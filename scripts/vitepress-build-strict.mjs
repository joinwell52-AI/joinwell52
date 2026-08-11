#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const vitepressPackagePath = require.resolve('vitepress/package.json')
const vitepressPackage = JSON.parse(readFileSync(vitepressPackagePath, 'utf8'))
const vitepressBin = typeof vitepressPackage.bin === 'string'
  ? vitepressPackage.bin
  : vitepressPackage.bin?.vitepress

if (!vitepressBin) {
  console.error('Unable to resolve the VitePress CLI from its installed package.')
  process.exit(1)
}

const command = process.execPath
const args = [join(dirname(vitepressPackagePath), vitepressBin), 'build', 'docs']
const result = spawnSync(command, args, {
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
