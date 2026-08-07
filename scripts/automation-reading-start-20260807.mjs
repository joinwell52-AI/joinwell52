import fs from 'node:fs'
import { execFileSync } from 'node:child_process'

const recordPath = 'research/runtime/records/daily/2026/08/2026-08-07-daily-runtime.json'
const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'))
if (record.date !== '2026-08-07') throw new Error('wrong runtime date')
const starts = (record.timeline || []).filter((event) => event.task === 'reading' && event.event === 'Execution Slot Opened' && event.status === 'Running' && String(event.time || '').startsWith('2026-08-07'))
if (starts.length !== 0) throw new Error(`refusing duplicate Reading start event; found ${starts.length}`)
const parts = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
}).formatToParts(new Date()).reduce((output, part) => (output[part.type] = part.value, output), {})
const now = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+08:00`
record.status = 'Running'
record.taskStatus = record.taskStatus || {}
record.taskStatus.reading = 'Running'
record.timeline = record.timeline || []
record.timeline.push({
  time: now,
  task: 'reading',
  event: 'Execution Slot Opened',
  status: 'Running',
  detail: 'Scheduler fallback: Research Runtime Reading opened because the durable control-plane start state was absent; Skill 03 Deep Reading may begin only after this synchronized JSON and Markdown state is committed and verified.'
})
record.commitVerify = 'Pending'
record.updatedAt = now
fs.writeFileSync(recordPath, `${JSON.stringify(record, null, 2)}\n`)
execFileSync('node', ['scripts/runtime-markdown.mjs', 'render', '--date', '2026-08-07'], { stdio: 'inherit' })
execFileSync('node', ['scripts/runtime-markdown.mjs', 'validate', '--date', '2026-08-07'], { stdio: 'inherit' })
const verified = JSON.parse(fs.readFileSync(recordPath, 'utf8'))
const finalStarts = verified.timeline.filter((event) => event.task === 'reading' && event.event === 'Execution Slot Opened' && event.status === 'Running' && String(event.time || '').startsWith('2026-08-07'))
if (verified.status !== 'Running' || verified.taskStatus.reading !== 'Running' || finalStarts.length !== 1 || verified.results?.reading) throw new Error('Reading start-state verification failed')
