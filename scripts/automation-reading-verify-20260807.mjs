import fs from 'node:fs'
import { execFileSync } from 'node:child_process'

const date = '2026-08-07'
const resultCommit = 'a8b76c0c9ab7674eac650c686519fc6d5d66f108'
const recordPath = 'research/runtime/records/daily/2026/08/2026-08-07-daily-runtime.json'
const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'))
if (record.date !== date) throw new Error('wrong runtime date')
if (record.taskStatus?.reading !== 'Completed' || record.results?.reading?.status !== 'Completed') throw new Error('Reading result is not Completed')
const starts = record.timeline.filter((e) => e.task === 'reading' && e.event === 'Execution Slot Opened' && e.status === 'Running' && String(e.time || '').startsWith(date))
const completions = record.timeline.filter((e) => e.task === 'reading' && e.event === 'Reading Completed' && e.status === 'Completed' && String(e.time || '').startsWith(date))
const verified = record.timeline.filter((e) => e.task === 'reading' && e.event === 'GitHub Commit Verified' && String(e.time || '').startsWith(date))
if (starts.length !== 1 || completions.length !== 1 || verified.length !== 0) throw new Error(`unexpected Reading timeline counts start=${starts.length} completed=${completions.length} verified=${verified.length}`)
for (const path of record.results.reading.artifacts.map((a) => a.path)) if (!fs.existsSync(path)) throw new Error(`missing artifact ${path}`)

const parts = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
}).formatToParts(new Date()).reduce((out, part) => (out[part.type] = part.value, out), {})
const now = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+08:00`
record.timeline.push({
  time: now,
  task: 'reading',
  event: 'GitHub Commit Verified',
  status: 'Completed',
  detail: `Fetched and verified durable Reading result commit ${resultCommit}; all three Reading Records, the Reading runtime-shift-result/v2 object and the regenerated Markdown ledger are present and synchronized, with prior Discovery and Queue results preserved.`
})
record.githubCommit = resultCommit
record.commitVerify = 'Completed'
record.updatedAt = now
fs.writeFileSync(recordPath, `${JSON.stringify(record, null, 2)}\n`)
execFileSync('node', ['scripts/runtime-markdown.mjs', 'render', '--date', date], { stdio: 'inherit' })
execFileSync('node', ['scripts/runtime-markdown.mjs', 'validate', '--date', date], { stdio: 'inherit' })

const check = JSON.parse(fs.readFileSync(recordPath, 'utf8'))
const verifyEvents = check.timeline.filter((e) => e.task === 'reading' && e.event === 'GitHub Commit Verified' && e.status === 'Completed' && String(e.time || '').startsWith(date))
if (verifyEvents.length !== 1) throw new Error(`expected exactly one Reading verification event, found ${verifyEvents.length}`)
if (check.githubCommit !== resultCommit || check.commitVerify !== 'Completed') throw new Error('commit verification state mismatch')
if (check.results.discovery?.status !== 'Completed' || check.results.queue?.status !== 'Completed' || check.results.reading?.status !== 'Completed') throw new Error('prior/runtime results not preserved')
