#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
if (!existsSync(resolve(root, '.git'))) {
  console.log('Git hooks not installed: this package is not running in a Git worktree.')
} else {
  execFileSync('git', ['config', 'core.hooksPath', '.githooks'], { cwd: root, stdio: 'inherit' })
  console.log('Git hooks installed from .githooks.')
}
