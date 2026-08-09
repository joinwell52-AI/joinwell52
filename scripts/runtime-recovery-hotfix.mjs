import { readFileSync, writeFileSync } from 'node:fs'

function replaceOnce(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`missing patch target: ${label}`)
  return source.replace(from, to)
}

// 1) Runtime V5: permit explicit reopening of dependency-blocked shifts.
{
  const path = 'scripts/runtime-v5.mjs'
  let source = readFileSync(path, 'utf8')
  source = replaceOnce(
    source,
    'function appendScheduledEvent(record, task, now) {\n  const currentStatus = record.taskStatus?.[task.id] || \'Waiting\'\n  if (TERMINAL.has(currentStatus) && record.results?.[task.id]) {\n    return false\n  }',
    'function appendScheduledEvent(record, task, now, options = {}) {\n  const currentStatus = record.taskStatus?.[task.id] || \'Waiting\'\n  const reopenBlocked = options.reopenBlocked === true\n  const retryingBlocked = currentStatus === \'Blocked\' && reopenBlocked && Boolean(record.results?.[task.id])\n  if (TERMINAL.has(currentStatus) && record.results?.[task.id] && !retryingBlocked) {\n    return false\n  }',
    'appendScheduledEvent terminal guard'
  )
  source = replaceOnce(
    source,
    '      detail: `${task.name} started by Research Runtime Scheduler V3.0.`',
    '      detail: retryingBlocked\n        ? `${task.name} reopened by Research Runtime Scheduler V3.0 after its blocking dependency became ready.`\n        : `${task.name} started by Research Runtime Scheduler V3.0.`',
    'appendScheduledEvent detail'
  )
  source = replaceOnce(
    source,
    '    const changed = appendScheduledEvent(record, task, now)',
    "    const changed = appendScheduledEvent(record, task, now, { reopenBlocked: args['reopen-blocked'] === true || args['reopen-blocked'] === 'true' })",
    'schedule reopen option'
  )
  writeFileSync(path, source)
}

// 2) Scheduler: gate downstream work on Completed dependencies and retry dependency-blocked shifts.
{
  const path = '.github/workflows/research-runtime-scheduler.yml'
  let source = readFileSync(path, 'utf8')
  source = replaceOnce(
    source,
    "          const terminal = new Set(['Running', 'Completed', 'Blocked', 'Failed', 'Skipped'])\n          const leadMinutes = 5",
    "          const neverReopen = new Set(['Running', 'Completed', 'Failed', 'Skipped'])\n          const dependencyOf = {\n            queue: 'discovery',\n            reading: 'queue',\n            analysis: 'reading',\n            production: 'analysis',\n            publication: 'production',\n            weekly: 'publication'\n          }\n          const leadMinutes = 5",
    'scheduler terminal set'
  )
  source = replaceOnce(
    source,
    "            writeOutput({ has_task: 'true', runtime_task: process.env.MANUAL_TASK, reason: 'manual dispatch' })",
    "            writeOutput({ has_task: 'true', runtime_task: process.env.MANUAL_TASK, reopen_blocked: 'false', reason: 'manual dispatch' })",
    'manual output'
  )

  const start = source.indexOf('          const overdue = manifest.tasks.flatMap((task) => {')
  const end = source.indexOf('          if (!overdue.length) {', start)
  if (start < 0 || end < 0) throw new Error('missing scheduler overdue block')
  const block = [
    "          const taskById = new Map(manifest.tasks.map((task) => [task.id, task]))",
    "          const recordCache = new Map()",
    "          const recordForTask = (task) => {",
    "            const key = `${task.family}:${date}`",
    "            if (recordCache.has(key)) return recordCache.get(key)",
    "            const recordPath = path.join(",
    "              manifest.recordRoots[task.family],",
    "              parts.year,",
    "              parts.month,",
    "              `${date}-${task.family}-runtime.json`",
    "            )",
    "            const record = fs.existsSync(recordPath) ? JSON.parse(fs.readFileSync(recordPath, 'utf8')) : null",
    "            recordCache.set(key, record)",
    "            return record",
    "          }",
    "          const statusOf = (taskId) => {",
    "            const task = taskById.get(taskId)",
    "            if (!task) return 'Waiting'",
    "            return recordForTask(task)?.taskStatus?.[taskId] || 'Waiting'",
    "          }",
    "          const dependencyReady = (task) => {",
    "            const dependencyId = dependencyOf[task.id]",
    "            return !dependencyId || statusOf(dependencyId) === 'Completed'",
    "          }",
    "          const dependencyBlockedAndReady = (task, record) => {",
    "            const dependencyId = dependencyOf[task.id]",
    "            if (!dependencyId || !dependencyReady(task)) return false",
    "            const result = record?.results?.[task.id]",
    "            if (!result) return false",
    "            const declared = String(result.blockedBy || result.dependency || '').trim().toLowerCase()",
    "            if (declared) return declared === dependencyId.toLowerCase()",
    "            const reason = [result.reason, result.reason_zh, result.next, result.next_zh]",
    "              .filter((value) => typeof value === 'string')",
    "              .join(' ')",
    "              .toLowerCase()",
    "            return reason.includes(dependencyId.toLowerCase()) || reason.includes(`research runtime ${dependencyId.toLowerCase()}`)",
    "          }",
    "",
    "          const overdue = manifest.tasks.flatMap((task) => {",
    "            if (task.schedule.kind === 'weekly' && !task.schedule.days?.includes(parts.weekday)) return []",
    "",
    "            const [hour, minute] = task.schedule.time.split(':').map(Number)",
    "            const scheduledMinutes = hour * 60 + minute",
    "            const delta = scheduledMinutes - nowMinutes",
    "            if (delta > leadMinutes) return []",
    "",
    "            const record = recordForTask(task)",
    "            const currentStatus = record?.taskStatus?.[task.id] || 'Waiting'",
    "            if (neverReopen.has(currentStatus)) return []",
    "",
    "            if (currentStatus === 'Blocked') {",
    "              if (!dependencyBlockedAndReady(task, record)) return []",
    "              return [{ task, scheduledMinutes, latenessMinutes: Math.max(0, nowMinutes - scheduledMinutes), reopenBlocked: true }]",
    "            }",
    "",
    "            if (currentStatus !== 'Waiting') return []",
    "            if (!dependencyReady(task)) return []",
    "",
    "            return [{ task, scheduledMinutes, latenessMinutes: Math.max(0, nowMinutes - scheduledMinutes), reopenBlocked: false }]",
    "          }).sort((a, b) => a.scheduledMinutes - b.scheduledMinutes || a.task.id.localeCompare(b.task.id))",
    "",
  ].join('\n')
  source = source.slice(0, start) + block + source.slice(end)

  source = replaceOnce(
    source,
    "            writeOutput({ has_task: 'false', runtime_task: 'none', reason: `no overdue Waiting task at ${date} ${parts.hour}:${parts.minute}` })",
    "            writeOutput({ has_task: 'false', runtime_task: 'none', reopen_blocked: 'false', reason: `no dependency-ready overdue task at ${date} ${parts.hour}:${parts.minute}` })",
    'idle output'
  )
  source = replaceOnce(
    source,
    "            runtime_task: selected.task.id,\n            reason: `self-healing heartbeat at ${date} ${parts.hour}:${parts.minute}; formal time ${selected.task.schedule.time}; lateness ${selected.latenessMinutes}m; overdue queue ${overdue.map((item) => item.task.id).join(',')}`",
    "            runtime_task: selected.task.id,\n            reopen_blocked: selected.reopenBlocked ? 'true' : 'false',\n            reason: `self-healing heartbeat at ${date} ${parts.hour}:${parts.minute}; formal time ${selected.task.schedule.time}; lateness ${selected.latenessMinutes}m; mode ${selected.reopenBlocked ? 'retry-blocked' : 'open-waiting'}; ready queue ${overdue.map((item) => item.task.id).join(',')}`",
    'selected output'
  )
  source = replaceOnce(
    source,
    "        env:\n          RUNTIME_TASK: ${{ steps.resolve.outputs.runtime_task }}\n        run: node scripts/runtime-v5.mjs schedule --task \"$RUNTIME_TASK\"",
    "        env:\n          RUNTIME_TASK: ${{ steps.resolve.outputs.runtime_task }}\n          REOPEN_BLOCKED: ${{ steps.resolve.outputs.reopen_blocked }}\n        run: |\n          if [[ \"$REOPEN_BLOCKED\" == \"true\" ]]; then\n            node scripts/runtime-v5.mjs schedule --task \"$RUNTIME_TASK\" --reopen-blocked true\n          else\n            node scripts/runtime-v5.mjs schedule --task \"$RUNTIME_TASK\"\n          fi",
    'persist reopen command'
  )
  writeFileSync(path, source)
}

// 3) Markdown projection: render structured V5 results and string evidence/artifacts without [object Object].
{
  const path = 'scripts/runtime-markdown.mjs'
  let source = readFileSync(path, 'utf8')
  source = replaceOnce(
    source,
    "function text(value) {\n  return typeof value === 'string' ? value.trim() : String(value ?? '').trim()\n}",
    "function text(value) {\n  if (typeof value === 'string') return value.trim()\n  if (value && typeof value === 'object') return JSON.stringify(value)\n  return String(value ?? '').trim()\n}",
    'markdown text object handling'
  )
  source = replaceOnce(
    source,
    "function cell(value) {\n  return (text(value) || '—').replace(/\\|/g, '\\\\|').replace(/\\r?\\n/g, '<br>')\n}\n",
    "function cell(value) {\n  return (text(value) || '—').replace(/\\|/g, '\\\\|').replace(/\\r?\\n/g, '<br>')\n}\n\nfunction narrative(value, language = 'en') {\n  if (typeof value === 'string') return value.trim()\n  if (!value || typeof value !== 'object' || Array.isArray(value)) return text(value)\n  const preferred = language === 'zh'\n    ? ['summary_zh', 'instruction_zh', 'description_zh', 'summary', 'instruction', 'description', 'type']\n    : ['summary', 'instruction', 'description', 'type', 'summary_zh', 'instruction_zh', 'description_zh']\n  for (const key of preferred) {\n    if (typeof value[key] === 'string' && value[key].trim()) return value[key].trim()\n  }\n  return JSON.stringify(value)\n}\n",
    'markdown narrative helper'
  )

  const linkedStart = source.indexOf('function linkedList(repository, items) {')
  const linkedEnd = source.indexOf('function metricsTable(metrics) {', linkedStart)
  if (linkedStart < 0 || linkedEnd < 0) throw new Error('missing linkedList block')
  const linkedBlock = [
    "function linkedList(repository, items) {",
    "  if (!Array.isArray(items) || !items.length) return '- 无 / None'",
    "  return items.map((item) => {",
    "    if (typeof item === 'string') {",
    "      const raw = item.trim()",
    "      if (!raw) return '- Evidence'",
    "      const url = /^https?:\\/\\//.test(raw) ? raw : `https://github.com/${repository}/blob/main/${raw}`",
    "      return `- [${raw}](${url})`",
    "    }",
    "    const zh = text(item?.label_zh)",
    "    const en = text(item?.label)",
    "    const label = zh && en && zh !== en ? `${zh} / ${en}` : zh || en || text(item?.source) || text(item?.path) || text(item?.url) || text(item?.commit) || 'Evidence'",
    "    const url = href(repository, item)",
    "    return url ? `- [${label}](${url})` : `- ${label}`",
    "  }).join('\\n')",
    "}",
    "",
  ].join('\n')
  source = source.slice(0, linkedStart) + linkedBlock + source.slice(linkedEnd)

  const metricsStart = source.indexOf('function metricsTable(metrics) {')
  const metricsEnd = source.indexOf('function weekdayForDate(date) {', metricsStart)
  if (metricsStart < 0 || metricsEnd < 0) throw new Error('missing metricsTable block')
  const metricsBlock = [
    "function metricsTable(metrics) {",
    "  if (!Array.isArray(metrics) || !metrics.length) return '无 / None'",
    "  return [",
    "    '| 指标 | Metric | 数值 / Value |',",
    "    '|---|---|---:|',",
    "    ...metrics.map((item) => {",
    "      const en = item.label || item.name || '—'",
    "      const zh = item.label_zh || item.label || item.name || '—'",
    "      return `| ${cell(zh)} | ${cell(en)} | ${cell(item.value)} |`",
    "    })",
    "  ].join('\\n')",
    "}",
    "",
  ].join('\n')
  source = source.slice(0, metricsStart) + metricsBlock + source.slice(metricsEnd)

  source = replaceOnce(
    source,
    "    const summary = result?.workResult_zh || result?.workResult || '尚未生成成果块 / No result block yet'",
    "    const summary = result ? (narrative(result.workResult_zh || result.workResult, 'zh') || '尚未生成成果块 / No result block yet') : '尚未生成成果块 / No result block yet'",
    'summary narrative'
  )

  const replacements = [
    ["    out.push(result.input_zh || '—')", "    out.push(narrative(result.input_zh || result.input, 'zh') || '—')"],
    ["    out.push(`> ${result.input || '—'}`)", "    out.push(`> ${narrative(result.input, 'en') || '—'}`)"],
    ["    out.push(result.workResult_zh || '—')", "    out.push(narrative(result.workResult_zh || result.workResult, 'zh') || '—')"],
    ["    out.push(`> ${result.workResult || '—'}`)", "    out.push(`> ${narrative(result.workResult, 'en') || '—'}`)"],
    ["    out.push(result.output_zh || '—')", "    out.push(narrative(result.output_zh || result.output, 'zh') || '—')"],
    ["    out.push(`> ${result.output || '—'}`)", "    out.push(`> ${narrative(result.output, 'en') || '—'}`)"],
    ["    out.push(result.next_zh || '—')", "    out.push(narrative(result.next_zh || result.next, 'zh') || '—')"],
    ["    out.push(`> ${result.next || '—'}`)", "    out.push(`> ${narrative(result.next, 'en') || '—'}`)"],
  ]
  for (const [from, to] of replacements) source = replaceOnce(source, from, to, from)
  writeFileSync(path, source)
}

// 4) Normalize today's dependency-blocked Analysis so recovery is machine-readable.
{
  const path = 'research/runtime/records/daily/2026/08/2026-08-09-daily-runtime.json'
  const record = JSON.parse(readFileSync(path, 'utf8'))
  if (record.taskStatus?.analysis === 'Blocked' && record.results?.analysis) {
    record.results.analysis.blockedBy = 'reading'
    writeFileSync(path, `${JSON.stringify(record, null, 2)}\n`)
  }
}

console.log('Staged dependency-aware Runtime recovery, retry and readable-projection repair.')
