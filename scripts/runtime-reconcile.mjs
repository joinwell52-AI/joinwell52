import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const MANIFEST_PATH = 'research/runtime/SCHEDULER.json'
const HARD_CLOSED = new Set(['Completed', 'Failed', 'Skipped'])
const DEPENDENCY_OF = {
  queue: 'discovery',
  reading: 'queue',
  analysis: 'reading',
  production: 'analysis',
  publication: 'production',
  weekly: 'publication'
}
const LEAD_MINUTES = 0

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
  const recoveryTaskId = args.recover ? String(args.recover) : ''
  if (recoveryTaskId && !taskById.has(recoveryTaskId)) {
    throw new Error(`Unknown terminal recovery task: ${recoveryTaskId}`)
  }
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

  const resultOf = (taskId) => {
    const task = taskById.get(taskId)
    if (!task) return null
    return getRecord(task).record?.results?.[taskId] || null
  }

  const dependencyReady = (task) => {
    const dependency = dependencyId(task)
    return !dependency || statusOf(dependency) === 'Completed'
  }

  const recoverableBlocked = (task) => {
    if (statusOf(task.id) !== 'Blocked') return false
    const dependency = dependencyId(task)
    return Boolean(
      dependency &&
      dependencyReady(task) &&
      resultDeclaresDependency(resultOf(task.id), dependency)
    )
  }

  const explicitlyRecoverableTerminal = (task) => {
    if (task.id !== recoveryTaskId) return false
    return ['Failed', 'Blocked'].includes(statusOf(task.id)) && dependencyReady(task)
  }

  const executionClosed = (task) => {
    if (explicitlyRecoverableTerminal(task)) return false
    const status = statusOf(task.id)
    if (HARD_CLOSED.has(status)) return true
    if (status === 'Blocked') return !recoverableBlocked(task)
    return false
  }

  const dueTasks = manifest.tasks
    .filter((task) => taskAppliesToday(task, now) && isDue(task, now))
    .sort((a, b) => scheduledMinutes(a) - scheduledMinutes(b) || a.id.localeCompare(b.id))

  // First repair explicit business-dependency violations.
  if (!args.manual) {
    for (const task of manifest.tasks) {
      if (!taskAppliesToday(task, now)) continue
      const dependency = dependencyId(task)
      if (!dependency) continue
      const entry = getRecord(task)
      const record = entry.record
      if (!record) continue

      const currentStatus = record.taskStatus?.[task.id] || 'Waiting'
      if (!['Running', 'Completed', 'Blocked', 'Failed', 'Skipped'].includes(currentStatus)) continue
      if (statusOf(dependency) === 'Completed') continue

      record.taskStatus[task.id] = 'Waiting'
      if (record.results?.[task.id]) delete record.results[task.id]
      record.timeline = Array.isArray(record.timeline) ? record.timeline : []
      record.timeline.push({
        time: `${now.date}T${now.time}+08:00`,
        task: task.id,
        event: currentStatus === 'Running' ? 'Order Violation Corrected' : 'Order Violation Invalidated',
        status: 'Waiting',
        detail: currentStatus === 'Running'
          ? `${task.name} was returned to Waiting because dependency ${dependency} is not Completed. Scheduler reconciliation forbids downstream execution before its prerequisite.`
          : `${task.name} ${currentStatus} outcome was invalidated because dependency ${dependency} is not Completed. Any downstream artifacts from that attempt are historical audit evidence only and the task must rerun after its prerequisite completes.`
      })
      record.updatedAt = `${now.date}T${now.time}+08:00`
      record.githubCommit = 'pending'
      record.commitVerify = 'Waiting'
      changedPaths.add(entry.file)
    }
  }

  // Then enforce the cross-family global serial clock: a later due task may not execute
  // while any earlier due task is still Waiting/Running or has become recoverable.
  if (!args.manual) {
    for (let index = 0; index < dueTasks.length; index += 1) {
      const task = dueTasks[index]
      const earlierOpen = dueTasks.slice(0, index).find((candidate) => !executionClosed(candidate))
      if (!earlierOpen) continue

      const entry = getRecord(task)
      const record = entry.record
      if (!record) continue
      const currentStatus = record.taskStatus?.[task.id] || 'Waiting'
      if (!['Running', 'Completed', 'Blocked', 'Failed', 'Skipped'].includes(currentStatus)) continue

      record.taskStatus[task.id] = 'Waiting'
      if (record.results?.[task.id]) delete record.results[task.id]
      record.timeline = Array.isArray(record.timeline) ? record.timeline : []
      record.timeline.push({
        time: `${now.date}T${now.time}+08:00`,
        task: task.id,
        event: currentStatus === 'Running' ? 'Global Order Violation Corrected' : 'Global Order Violation Invalidated',
        status: 'Waiting',
        detail: `${task.name} ${currentStatus} state was invalidated because earlier due task ${earlierOpen.id} at ${earlierOpen.schedule.time} had not execution-closed. Timer activation does not grant execution authority; this task must be reconciled again after the earlier task closes.`
      })
      record.updatedAt = `${now.date}T${now.time}+08:00`
      record.githubCommit = 'pending'
      record.commitVerify = 'Waiting'
      changedPaths.add(entry.file)
    }
  }

  for (const { file, record } of records.values()) {
    if (record && changedPaths.has(file)) writeJson(file, record)
  }

  const earliestOpen = dueTasks.find((task) => !executionClosed(task)) || null
  let selected = null

  if (earliestOpen) {
    const currentStatus = statusOf(earliestOpen.id)
    if (explicitlyRecoverableTerminal(earliestOpen)) {
      selected = {
        task: earliestOpen,
        reopenBlocked: false,
        reopenTerminal: true,
        scheduledMinutes: scheduledMinutes(earliestOpen)
      }
    } else if (currentStatus === 'Blocked' && recoverableBlocked(earliestOpen)) {
      selected = {
        task: earliestOpen,
        reopenBlocked: true,
        reopenTerminal: false,
        scheduledMinutes: scheduledMinutes(earliestOpen)
      }
    } else if (currentStatus === 'Waiting' && dependencyReady(earliestOpen)) {
      selected = {
        task: earliestOpen,
        reopenBlocked: false,
        reopenTerminal: false,
        scheduledMinutes: scheduledMinutes(earliestOpen)
      }
    }
  }

  const requested = args.manual ? String(args.manual) : recoveryTaskId
  const requestedAlreadyRunning = Boolean(
    requested &&
    earliestOpen?.id === requested &&
    statusOf(requested) === 'Running'
  )

  if (requested) {
    if (!taskById.has(requested)) throw new Error(`Unknown manual runtime task: ${requested}`)
    if ((!selected || selected.task.id !== requested) && !requestedAlreadyRunning) {
      const expected = earliestOpen?.id || 'none'
      throw new Error(`Ordered reconciliation denied manual task ${requested}; earliest due unfinished task is ${expected}. Timer/manual/fallback activation cannot bypass global serial order or business dependencies.`)
    }
  }

  const changed = changedPaths.size > 0
  const changedList = [...changedPaths].join(',')
  const openReason = earliestOpen
    ? `${earliestOpen.id}=${statusOf(earliestOpen.id)}${dependencyId(earliestOpen) && !dependencyReady(earliestOpen) ? `; dependency ${dependencyId(earliestOpen)} not Completed` : ''}`
    : 'none'

  if (!selected) {
    const idleReason = requestedAlreadyRunning
      ? `manual request ${requested} is already Running in the current execution epoch; idempotent no-op`
      : `no task may open now; earliest due unfinished ${openReason}`
    githubOutput({
      has_task: 'false',
      runtime_task: 'none',
      reopen_blocked: 'false',
      reopen_terminal: 'false',
      state_changed: changed ? 'true' : 'false',
      changed_record_paths: changedList,
      runtime_date: now.date,
      earliest_due_unfinished: earliestOpen?.id || 'none',
      reason: `reconciled at ${now.date} ${now.hour}:${now.minute}; ${idleReason}${changed ? '; corrected out-of-order state' : ''}`
    })
    console.log(`No runnable task at ${now.date} ${now.hour}:${now.minute}; ${idleReason}.${changed ? ` Corrected: ${changedList}` : ''}`)
    return
  }

  const latenessMinutes = Math.max(0, now.minutes - selected.scheduledMinutes)
  githubOutput({
    has_task: 'true',
    runtime_task: selected.task.id,
    reopen_blocked: selected.reopenBlocked ? 'true' : 'false',
    reopen_terminal: selected.reopenTerminal ? 'true' : 'false',
    state_changed: changed ? 'true' : 'false',
    changed_record_paths: changedList,
    runtime_date: now.date,
    earliest_due_unfinished: selected.task.id,
    reason: `global ordered reconcile at ${now.date} ${now.hour}:${now.minute}; selected earliest due unfinished ${selected.task.id}; formal time ${selected.task.schedule.time}; lateness ${latenessMinutes}m; mode ${selected.reopenTerminal ? 'terminal-recovery' : selected.reopenBlocked ? 'retry-blocked' : 'open-waiting'}`
  })
  console.log(`Selected earliest due unfinished task ${selected.task.id}.`)
}

main()
