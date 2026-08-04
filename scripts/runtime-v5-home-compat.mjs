#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const path = resolve('docs/.vitepress/generated/runtime-records.json')
const data = JSON.parse(readFileSync(path, 'utf8'))

if (data.schema !== 'research-runtime-center-data/v5') {
  throw new Error(`Runtime V5 homepage compatibility expected V5 data, received ${data.schema}`)
}

const daily = data.latest?.daily || data.todayDaily || null
const dailyTasks = (data.schedule || [])
  .filter((task) => task.family === 'daily')
  .sort((a, b) => a.schedule.time.localeCompare(b.schedule.time))

function currentTask(record) {
  if (!record) return dailyTasks[0] || null
  const status = record.taskStatus || {}
  return dailyTasks.find((task) => status[task.id] === 'Running')
    || dailyTasks.find((task) => status[task.id] === 'Waiting')
    || dailyTasks.slice().reverse().find((task) => status[task.id] === 'Completed')
    || dailyTasks[0]
    || null
}

const task = currentTask(daily)
const commit = typeof daily?.githubCommit === 'string' && daily.githubCommit
  ? daily.githubCommit
  : 'pending'

// Preserve the V5 family map while supplying the small legacy summary used by
// the public homepage RA work-log card. V5 operational views continue reading
// latest.daily / latest.weekly / latest.academic / latest.program.
data.latest = {
  ...(data.latest || {}),
  date: daily?.date || data.today || '',
  status: daily?.status || 'Waiting',
  latestTask: task?.name || 'Research Runtime Discovery',
  commit
}

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`)
console.log('Injected V5 homepage compatibility summary into runtime-records.json.')
