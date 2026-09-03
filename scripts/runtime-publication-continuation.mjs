#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const manifest = JSON.parse(readFileSync(path.join(ROOT, 'research/runtime/SCHEDULER.json'), 'utf8'))

function argsOf(argv) {
  const args = {}
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i]
    if (!token.startsWith('--')) continue
    const key = token.slice(2)
    const next = argv[i + 1]
    if (!next || next.startsWith('--')) args[key] = true
    else { args[key] = next; i += 1 }
  }
  return args
}

function readJson(file) { return JSON.parse(readFileSync(file, 'utf8')) }
function githubOutput(values) {
  const outputPath = process.env.GITHUB_OUTPUT
  if (!outputPath) return
  const lines = Object.entries(values).map(([key, value]) => `${key}=${String(value ?? '').replace(/\r?\n/g, ' ')}`)
  writeFileSync(outputPath, `${lines.join('\n')}\n`, { flag: 'a' })
}
function clock(timezone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date()).map((part) => [part.type, part.value]))
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}:${parts.second}` }
}
function minutes(value) {
  const [hour, minute] = String(value).split(':').map(Number)
  return hour * 60 + minute
}
function latestExecution(record) {
  const timeline = record.timeline || []
  let openIndex = -1
  for (let i = timeline.length - 1; i >= 0; i -= 1) {
    const event = timeline[i]
    if (event.task === 'publication' && event.event === 'Execution Slot Opened' && event.status === 'Running') {
      openIndex = i
      break
    }
  }
  if (openIndex < 0) return { openIndex, claim: null }
  const claim = timeline.slice(openIndex + 1).find((event) =>
    event.task === 'publication' && event.event === 'Worker Claimed' && event.status === 'Running'
  ) || null
  return { openIndex, claim }
}
function findWake(date) {
  const [year, month] = date.split('-')
  const dir = path.join(ROOT, 'research/runtime/wakes', year, month, date)
  if (!existsSync(dir)) return ''
  const candidates = readdirSync(dir)
    .filter((name) => /^publication-\d{6}\.json$/.test(name))
    .sort()
    .reverse()
  for (const name of candidates) {
    const file = path.join(dir, name)
    const receipt = readJson(file)
    if (
      receipt.schema === 'runtime-wake-receipt/v1' &&
      receipt.date === date &&
      receipt.timezone === manifest.timezone &&
      receipt.nominalTask === 'publication' &&
      receipt.nominalTime === '20:00' &&
      receipt.source === 'chatgpt-scheduled-task' &&
      receipt.status === 'Received'
    ) return path.relative(ROOT, file).split(path.sep).join('/')
  }
  return ''
}

const args = argsOf(process.argv)
const current = clock(manifest.timezone)
const date = String(args.date || current.date)
const nowTime = String(args.now || current.time)
const [year, month] = date.split('-')
const recordPath = path.join(ROOT, manifest.recordRoots.daily, year, month, `${date}-daily-runtime.json`)
const productionResultPath = path.join(ROOT, 'research/runtime/results', year, month, `${date}-production-result.json`)
const candidatePath = path.join(ROOT, 'research/runtime/candidates', year, month, `${date}-candidates.json`)

let eligible = false
let wakeReceipt = ''
let publicationStatus = 'Waiting'
let reason = 'not evaluated'

if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  reason = `invalid runtime date ${date}`
} else if (date !== current.date && !args.date) {
  reason = `active Shanghai date is ${current.date}`
} else if (minutes(nowTime) < 20 * 60) {
  reason = `Publication is not overdue yet at ${nowTime}`
} else if (!existsSync(recordPath)) {
  reason = `Daily Runtime record is missing for ${date}`
} else {
  const record = readJson(recordPath)
  publicationStatus = record.taskStatus?.publication || 'Waiting'
  const productionStatus = record.taskStatus?.production || 'Waiting'
  const execution = latestExecution(record)
  wakeReceipt = findWake(date)

  if (productionStatus !== 'Completed') reason = `Production is ${productionStatus}, not Completed`
  else if (!existsSync(productionResultPath)) reason = 'Production result is missing'
  else if (!existsSync(candidatePath)) reason = 'Publication candidate batch is missing'
  else if (!wakeReceipt) reason = 'No verified same-day 20:00 ChatGPT Publication Wake Receipt exists'
  else if (!['Waiting', 'Running'].includes(publicationStatus)) reason = `Publication is ${publicationStatus}; automatic continuation does not reopen terminal outcomes`
  else if (publicationStatus === 'Running' && execution.claim) reason = `Publication already has a Worker Claimed event at ${execution.claim.time}`
  else {
    eligible = true
    reason = publicationStatus === 'Running'
      ? 'Publication has an unclaimed Running slot after its formal wake and Production completion'
      : 'Publication is Waiting after its formal wake and Production completion'
  }
}

const result = {
  schema: 'runtime-publication-continuation-resolution/v1',
  date,
  time: nowTime,
  eligible,
  wakeReceipt,
  publicationStatus,
  reason
}

githubOutput({
  eligible: eligible ? 'true' : 'false',
  runtime_date: date,
  wake_receipt: wakeReceipt,
  publication_status: publicationStatus,
  reason
})
console.log(JSON.stringify(result))
