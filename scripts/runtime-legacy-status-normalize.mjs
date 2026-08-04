#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const path = resolve('docs/.vitepress/generated/runtime-legacy-records.json')
const data = JSON.parse(readFileSync(path, 'utf8'))

for (const record of data.records || []) {
  const taskStatuses = Object.values(record.taskStatus || {})
  const allCompleted = record.totalTasks > 0
    && record.completedTasks === record.totalTasks
    && taskStatuses.length === record.totalTasks
    && taskStatuses.every((status) => status === 'Completed')

  if (allCompleted) record.status = 'Completed'
}

if (data.current) {
  const normalized = (data.records || []).find((record) => record.date === data.current.date)
  if (normalized) data.current = normalized
}

const august3 = (data.records || []).find((record) => record.date === '2026-08-03')
if (!august3) throw new Error('Legacy status normalization: 2026-08-03 record is missing')
if (august3.completedTasks !== 5 || august3.totalTasks !== 5 || august3.status !== 'Completed') {
  throw new Error(`Legacy status normalization: 2026-08-03 is ${august3.status} ${august3.completedTasks}/${august3.totalTasks}, expected Completed 5/5`)
}

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`)
console.log('Legacy Runtime status normalized: 2026-08-03 Completed 5/5.')
