#!/usr/bin/env node

import { spawnSync } from 'node:child_process'

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const result = spawnSync(command, ['vitepress', 'build', 'docs'], {
  encoding: 'utf8',
  env: process.env
})

const stdout = result.stdout || ''
const stderr = result.stderr || ''
process.stdout.write(stdout)
process.stderr.write(stderr)

const combined = `${stdout}\n${stderr}`
const hiddenSsrError = /TypeError:|ReferenceError:|SyntaxError:|Error: Cannot read properties of/.test(combined)

if (result.error) {
  console.error(`Unable to execute VitePress: ${result.error.message}`)
  process.exit(1)
}

if ((result.status ?? 1) !== 0) process.exit(result.status || 1)

if (hiddenSsrError) {
  console.error('Strict VitePress gate failed: rendering emitted a JavaScript error even though the command returned success.')
  process.exit(1)
}

console.log('Strict VitePress gate passed: no hidden SSR JavaScript errors detected.')
