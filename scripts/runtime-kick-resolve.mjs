#!/usr/bin/env node

import { readFileSync } from 'node:fs'

const kickPath = process.argv[2]
if (!kickPath) process.exit(0)

const kick = JSON.parse(readFileSync(kickPath, 'utf8'))
const valid = kick.schema === 'runtime-process-kick/v2'
  && kick.requestMode === 'terminal-recovery'
  && kick.allowTerminalReopen === true
  && typeof kick.nominalTask === 'string'
  && kick.nominalTask.length > 0

if (valid) process.stdout.write(kick.nominalTask)
