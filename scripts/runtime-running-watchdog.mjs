#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const MANIFEST_PATH = 'research/runtime/SCHEDULER.json'
const DEFAULT_LEASE_MINUTES = 45
const UNCLAIMED_SLOT_LEASE_MINUTES = 5
const LEASE_MINUTES = {
  discovery: 45,
  queue: 30,
  reading: 60,
  analysis: 60,
  production: 55,
  publication: 60,
  weekly: 90,
  academic: 90,
  program: 120
}

function readJson(file) { return JSON.parse(readFileSync(file, 'utf8')) }
function writeJson(file, value) { writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`) }

function clock(timezone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date()).map((part) => [part.type, part.value]))
  return {
    ...parts,
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}:${parts.second}`
  }
}

function githubOutput(values) {
  const outputPath = process.env.GITHUB_OUTPUT
  if (!outputPath) return
  const lines = Object.entries(values).map(([key, value]) => `${key}=${String(value ?? '').replace(/\r?\n/g, ' ')}`)
  writeFileSync(outputPath, `${lines.join('\n')}\n`, { flag: 'a' })
}

function recordPath(manifest, family, now) {
  return path.join(manifest.recordRoots[family], now.year, now.month, `${now.date}-${family}-runtime.json`)
}

function latestOpenIndex(record, taskId) {
  const timeline = record.timeline || []
  for (let i = timeline.length - 1; i >= 0; i -= 1) {
    const event = timeline[i]
    if (event.task === taskId && event.event === 'Execution Slot Opened' && event.status === 'Running') return i
  }
  return -1
}

function claimAfter(record, taskId, openIndex) {
  if (openIndex < 0) return null
  const timeline = record.timeline || []
  return timeline.slice(openIndex + 1).find((event) =>
    event.task === taskId && event.event === 'Worker Claimed' && event.status === 'Running'
  ) || null
}

function parseShanghaiIso(value) {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function overallStatus(record) {
  const statuses = Object.values(record.taskStatus || {})
  if (statuses.includes('Running')) return 'Running'
  if (statuses.includes('Blocked')) return 'Blocked'
  if (statuses.every((status) => ['Completed', 'Skipped'].includes(status))) return 'Completed'
  if (statuses.includes('Failed')) return 'Failed'
  return 'Waiting'
}

const manifest = readJson(MANIFEST_PATH)
const now = clock(manifest.timezone)
const nowInstant = new Date()
const changed = []
const expired = []

for (const family of manifest.runtimeFamilies) {
  const file = recordPath(manifest, family.id, now)
  if (!existsSync(file)) continue
  const record = readJson(file)
  let dirty = false

  for (const taskId of family.taskIds) {
    if (record.taskStatus?.[taskId] !== 'Running') continue
    const openIndex = latestOpenIndex(record, taskId)
    const opened = openIndex >= 0 ? record.timeline[openIndex] : null
    const openedAt = parseShanghaiIso(opened?.time)
    if (!openedAt) continue

    const claim = claimAfter(record, taskId, openIndex)
    const claimAt = parseShanghaiIso(claim?.time)
    const leaseStart = claimAt || openedAt
    const leaseMinutes = claimAt ? (LEASE_MINUTES[taskId] || DEFAULT_LEASE_MINUTES) : UNCLAIMED_SLOT_LEASE_MINUTES
    const ageMinutes = Math.floor((nowInstant.getTime() - leaseStart.getTime()) / 60000)
    if (ageMinutes <= leaseMinutes) continue

    record.taskStatus[taskId] = 'Waiting'
    record.timeline = Array.isArray(record.timeline) ? record.timeline : []
    const unclaimed = !claimAt
    record.timeline.push({
      time: `${now.date}T${now.time}+08:00`,
      task: taskId,
      event: unclaimed ? 'Unclaimed Execution Slot Expired' : 'Running Lease Expired',
      status: 'Waiting',
      detail: unclaimed
        ? `${taskId} had an Execution Slot Opened but no Worker Claimed event within ${UNCLAIMED_SLOT_LEASE_MINUTES} minutes. An unclaimed slot is readiness evidence only, not active work, so the task returns to Waiting for governed continuation.`
        : `${taskId} exceeded its ${leaseMinutes} minute claimed-worker Running lease without a terminal result. The execution epoch is no longer treated as live work and returns to governed recovery.`
    })
    record.updatedAt = `${now.date}T${now.time}+08:00`
    record.githubCommit = 'pending'
    record.commitVerify = 'Waiting'
    dirty = true
    expired.push(unclaimed
      ? `${taskId}:unclaimed:${ageMinutes}m>${UNCLAIMED_SLOT_LEASE_MINUTES}m`
      : `${taskId}:claimed:${ageMinutes}m>${leaseMinutes}m`)
  }

  if (dirty) {
    record.status = overallStatus(record)
    writeJson(file, record)
    changed.push(file)
  }
}

githubOutput({
  state_changed: changed.length ? 'true' : 'false',
  changed_record_paths: changed.join(','),
  expired_tasks: expired.join(','),
  runtime_date: now.date
})

if (expired.length) console.log(`Expired stale Running leases: ${expired.join(', ')}`)
else console.log('Running lease watchdog: no stale execution slots.')
