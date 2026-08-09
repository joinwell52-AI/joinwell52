import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const MANIFEST_PATH = 'research/runtime/SCHEDULER.json'
const NEVER_REOPEN = new Set(['Completed', 'Failed', 'Skipped'])
const DEPENDENCY_OF = {
  queue: 'discovery',
  reading: 'queue',
  analysis: 'reading',
  production: 'analysis',
  publication: 'production',
  weekly: 'publication'
}
const LEAD_MINUTES = 5

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'))
}

function writeJson(file, value) {
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

function clock(timezone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(new Date()).map((part) => [part.type, part.value]))
  return {
    ...parts,
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}:${parts.second}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute)
  }
}

function parseArgs(argv) {
  const args = {}
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i]
    if (!token.startsWith('--')) continue
    const key = token.slice(2)
    const next = argv[i + 1]
    if (!next || next.startsWith('--')) args[key] = true
    else {
      args[key] = next
      i += 1
    }
  }
  return args
}

function githubOutput(values) {
  const outputPath = process.env.GITHUB_OUTPUT
  if (!outputPath) return
  const lines = Object.entries(values).map(([key, value]) => `${key}=${String(value ?? '').replace(/\r?\n/g, ' ')}`)
  writeFileSync(outputPath, `${lines.join('\n')}\n`, { flag: 'a' })
}

function recordPath(manifest, task, now) {
  return path.join(
    manifest.recordRoots[task.family],
    now.year,
    now.month,
    `${now.date}-${task.family}-runtime.json`
  )
}

function taskAppliesToday(task, now) {
  if (task.schedule.kind !== 'weekly') return true
  return Boolean(task.schedule.days?.includes(now.weekday))
}

function scheduledMinutes(task) {
  const [hour, minute] = task.schedule.time.split(':').map(Number)
  return hour * 60 + minute
}

function isDue(task, now) {
  return scheduledMinutes(task) - now.minutes <= LEAD_MINUTES
}

function dependencyId(task) {
  return DEPENDENCY_OF[task.id] || null
}

function resultDeclaresDependency(result, dependency) {
  if (!result || !dependency) return false
  const declared = String(result.blockedBy || result.dependency || '').trim().toLowerCase()
  if (declared) return declared === dependency.toLowerCase()
  const reason = [result.reason, result.reason_zh, result.next, result.next_zh]
    .filter((value) => typeof value === 'string')
    .join(' ')
    .toLowerCase()
  return reason.includes(dependency.toLowerCase()) || reason.includes(`research runtime ${dependency.toLowerCase()}`)
}

function main() {
  const args = parseArgs(process.argv)
  const manifest = readJson(MANIFEST_PATH)
  const now = clock(manifest.timezone)
  const taskById = new Map(manifest.tasks.map((task) => [task.id, task]))
  const records = new Map()
  const changedPaths = new Set()

  const getRecord = (task) => {
    const key = `${task.family}:${now.date}`
    if (records.has(key)) return records.get(key)
    const file = recordPath(manifest, task, now)
    const record = existsSync(file) ? readJson(file) : null
    const entry = { file, record }
    records.set(key, entry)
    return entry
  }

  const statusOf = (taskId) => {
    const task = taskById.get(taskId)
    if (!task) return 'Waiting'
    return getRecord(task).record?.taskStatus?.[taskId] || 'Waiting'
  }

  const dependencyReady = (task) => {
    const dependency = dependencyId(task)
    return !dependency || statusOf(dependency) === 'Completed'
  }

  // Scheduled reconciliation repairs an impossible downstream Running state first.
  // Manual requests never mutate state before they pass the same ordered gate.
  if (!args.manual) {
    for (const task of manifest.tasks) {
      if (!taskAppliesToday(task, now)) continue
      const dependency = dependencyId(task)
      if (!dependency) continue
      const entry = getRecord(task)
      const record = entry.record
      if (!record || record.taskStatus?.[task.id] !== 'Running') continue
      if (statusOf(dependency) === 'Completed') continue

      record.taskStatus[task.id] = 'Waiting'
      if (record.results?.[task.id]) delete record.results[task.id]
      record.timeline = Array.isArray(record.timeline) ? record.timeline : []
      record.timeline.push({
        time: `${now.date}T${now.time}+08:00`,
        task: task.id,
        event: 'Order Violation Corrected',
        status: 'Waiting',
        detail: `${task.name} was returned to Waiting because dependency ${dependency} is not Completed. Scheduler reconciliation forbids downstream execution before its prerequisite.`
      })
      record.updatedAt = `${now.date}T${now.time}+08:00`
      record.githubCommit = 'pending'
      record.commitVerify = 'Waiting'
      changedPaths.add(entry.file)
    }
  }

  // Persist in-memory repairs before recalculating eligibility so the same pass sees corrected facts.
  for (const { file, record } of records.values()) {
    if (record && changedPaths.has(file)) writeJson(file, record)
  }

  const candidates = manifest.tasks.flatMap((task) => {
    if (!taskAppliesToday(task, now) || !isDue(task, now)) return []
    const entry = getRecord(task)
    const record = entry.record
    const currentStatus = record?.taskStatus?.[task.id] || 'Waiting'

    if (currentStatus === 'Running' || NEVER_REOPEN.has(currentStatus)) return []

    if (currentStatus === 'Blocked') {
      const dependency = dependencyId(task)
      if (!dependency || !dependencyReady(task)) return []
      if (!resultDeclaresDependency(record?.results?.[task.id], dependency)) return []
      return [{ task, reopenBlocked: true, scheduledMinutes: scheduledMinutes(task) }]
    }

    if (currentStatus !== 'Waiting' || !dependencyReady(task)) return []
    return [{ task, reopenBlocked: false, scheduledMinutes: scheduledMinutes(task) }]
  }).sort((a, b) => a.scheduledMinutes - b.scheduledMinutes || a.task.id.localeCompare(b.task.id))

  const selected = candidates[0] || null
  const requested = args.manual ? String(args.manual) : ''

  if (requested) {
    if (!taskById.has(requested)) throw new Error(`Unknown manual runtime task: ${requested}`)
    if (!selected || selected.task.id !== requested) {
      const expected = selected?.task.id || 'none'
      throw new Error(`Ordered reconciliation denied manual task ${requested}; earliest runnable due task is ${expected}. Manual/fallback dispatch cannot bypass dependency order.`)
    }
  }

  const changed = changedPaths.size > 0
  const changedList = [...changedPaths].join(',')

  if (!selected) {
    githubOutput({
      has_task: 'false',
      runtime_task: 'none',
      reopen_blocked: 'false',
      state_changed: changed ? 'true' : 'false',
      changed_record_paths: changedList,
      runtime_date: now.date,
      reason: `reconciled at ${now.date} ${now.hour}:${now.minute}; no dependency-ready overdue task${changed ? '; corrected out-of-order Running state' : ''}`
    })
    console.log(`No runnable overdue task at ${now.date} ${now.hour}:${now.minute}.${changed ? ` Corrected: ${changedList}` : ''}`)
    return
  }

  const latenessMinutes = Math.max(0, now.minutes - selected.scheduledMinutes)
  githubOutput({
    has_task: 'true',
    runtime_task: selected.task.id,
    reopen_blocked: selected.reopenBlocked ? 'true' : 'false',
    state_changed: changed ? 'true' : 'false',
    changed_record_paths: changedList,
    runtime_date: now.date,
    reason: `ordered reconcile at ${now.date} ${now.hour}:${now.minute}; selected ${selected.task.id}; formal time ${selected.task.schedule.time}; lateness ${latenessMinutes}m; mode ${selected.reopenBlocked ? 'retry-blocked' : 'open-waiting'}; ready queue ${candidates.map((item) => item.task.id).join(',')}`
  })
  console.log(`Selected ${selected.task.id}; ready queue: ${candidates.map((item) => item.task.id).join(', ')}`)
}

main()
