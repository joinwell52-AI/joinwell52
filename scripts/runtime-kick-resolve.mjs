#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const kickPath = process.argv[2]
if (!kickPath) process.exit(0)

const kick = JSON.parse(readFileSync(kickPath, 'utf8'))

function run(command, args, label) {
  const result = spawnSync(command, args, { encoding: 'utf8' })
  if (result.stdout) process.stderr.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)
  if (result.status !== 0) throw new Error(`${label} failed with status ${result.status}`)
  return result.stdout || ''
}

if (kick.schema === 'runtime-process-kick/v3' && kick.publicationRelease === true) {
  if (kick.nominalTask !== 'publication' || !/^\d{4}-\d{2}-\d{2}$/.test(kick.date || '')) throw new Error('Invalid governed Publication release kick')
  if (!String(kick.wakeReceipt || '').startsWith('research/runtime/wakes/')) throw new Error('Publication release kick requires Wake Receipt')
  const releasePath = `research/runtime/releases/${kick.date}-publication.json`
  if (existsSync(releasePath)) {
    const release = JSON.parse(readFileSync(releasePath, 'utf8'))
    if (release.status === 'Released' && release.date === kick.date) process.exit(0)
  }
  run('npm', ['ci'], 'npm ci')
  run(process.execPath, ['scripts/runtime-publication-release-current.mjs', '--date', kick.date, '--wake', kick.wakeReceipt], 'Publication materialization')
  run('npm', ['run', 'publication:layout:validate'], 'Publication layout validation')
  run('npm', ['run', 'publication:editorial:validate'], 'Publication editorial validation')
  run('npm', ['run', 'runtime:validate'], 'Runtime validation')
  run('npm', ['run', 'docs:build'], 'VitePress site build')
  run(process.execPath, ['scripts/publication-visibility.mjs'], 'Publication visibility validation')
  run('git', ['config', 'user.name', 'joinwell52 Research Runtime'], 'git config user')
  run('git', ['config', 'user.email', 'actions@users.noreply.github.com'], 'git config email')
  const [year, month] = kick.date.split('-')
  const releaseArtifacts = [
    'docs/en/digital-employee',
    'docs/zh/digital-employee',
    'docs/en/industry',
    'docs/zh/industry',
    'docs/en/engineering',
    'docs/zh/engineering',
    'docs/public/assets/covers',
    'docs/public/assets/figures',
    releasePath,
    `research/runtime/results/${year}/${month}/${kick.date}-publication-result.json`
  ].filter((artifact) => existsSync(artifact))
  run('git', ['add', ...releaseArtifacts], 'stage Publication release')
  const diff = spawnSync('git', ['diff', '--cached', '--quiet'])
  if (diff.status === 0) throw new Error('Publication materialization produced no governed release changes')
  run('git', ['commit', '-m', `runtime(publication): release ${kick.date} research`], 'Publication release commit')
  run('git', ['pull', '--rebase', 'origin', 'main'], 'Publication release rebase')
  run('git', ['push', 'origin', 'HEAD:main'], 'Publication release push')
  process.exit(0)
}

const valid = kick.schema === 'runtime-process-kick/v2'
  && kick.requestMode === 'terminal-recovery'
  && kick.allowTerminalReopen === true
  && typeof kick.nominalTask === 'string'
  && kick.nominalTask.length > 0

if (valid) process.stdout.write(kick.nominalTask)
