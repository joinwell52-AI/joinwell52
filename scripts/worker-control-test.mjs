import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import process from 'node:process'

const root = resolve(import.meta.dirname, '..')
const resolver = resolve(root, 'scripts/worker-prompts.mjs')
const commonCapabilities = 'github-read,github-write,command-execution,file-editing'
const allCapabilities = `${commonCapabilities},web-research`

function resolveCase({ task, now, branch = 'main', wakeSource = 'chatgpt-scheduled-task', capabilities = allCapabilities }) {
  const child = spawnSync(process.execPath, [
    resolver,
    'resolve',
    '--task', task,
    '--branch', branch,
    '--wake-source', wakeSource,
    '--capabilities', capabilities,
    '--now', now
  ], { cwd: root, encoding: 'utf8' })
  if (!child.stdout.trim()) throw new Error(`${task}: resolver produced no JSON: ${child.stderr}`)
  return { status: child.status, result: JSON.parse(child.stdout) }
}

function expectDecision(name, input, decision, reasonFragment = null) {
  const { status, result } = resolveCase(input)
  if (result.decision !== decision) {
    throw new Error(`${name}: expected ${decision}, got ${result.decision}: ${result.reasons.join('; ')}`)
  }
  if (decision === 'Admitted' && status !== 0) throw new Error(`${name}: admitted resolver exited ${status}`)
  if (decision === 'Denied' && status !== 2) throw new Error(`${name}: denied resolver exited ${status}`)
  if (reasonFragment && !result.reasons.some((reason) => reason.includes(reasonFragment))) {
    throw new Error(`${name}: expected reason containing ${reasonFragment}; got ${result.reasons.join('; ')}`)
  }
}

const admitted = [
  ['discovery', '2026-08-12T09:00:00+08:00'],
  ['queue', '2026-08-12T10:00:00+08:00'],
  ['reading', '2026-08-12T11:00:00+08:00'],
  ['analysis', '2026-08-12T13:00:00+08:00'],
  ['production', '2026-08-13T15:00:00+08:00'],
  ['academic', '2026-08-12T16:00:00+08:00'],
  ['publication', '2026-08-12T20:00:00+08:00'],
  ['program', '2026-08-17T12:00:00+08:00'],
  ['weekly', '2026-08-16T20:30:00+08:00']
]

for (const [task, now] of admitted) {
  expectDecision(`${task} nominal admission`, { task, now }, 'Admitted')
}

expectDecision('production early wake', { task: 'production', now: '2026-08-13T14:59:00+08:00' }, 'Denied', 'not eligible before')
expectDecision('weekly wrong weekday', { task: 'weekly', now: '2026-08-12T20:30:00+08:00' }, 'Denied', 'not scheduled on')
expectDecision('academic wrong weekday', { task: 'academic', now: '2026-08-13T16:00:00+08:00' }, 'Denied', 'not scheduled on')
expectDecision('program wrong weekday', { task: 'program', now: '2026-08-18T12:00:00+08:00' }, 'Denied', 'not scheduled on')
expectDecision('discovery missing web research', { task: 'discovery', now: '2026-08-12T09:00:00+08:00', capabilities: commonCapabilities }, 'Denied', 'missing capability web-research')
expectDecision('wrong branch', { task: 'queue', now: '2026-08-12T10:00:00+08:00', branch: 'feature/test' }, 'Denied', 'is not allowed')
expectDecision('wrong wake source', { task: 'queue', now: '2026-08-12T10:00:00+08:00', wakeSource: 'unknown-timer' }, 'Denied', 'wake source')

expectDecision('removed recovery patrol source', {
  task: 'publication',
  now: '2026-08-12T20:10:00+08:00',
  wakeSource: 'codex-recovery-patrol'
}, 'Denied', 'wake source')

console.log(`worker-control: passed ${admitted.length + 8} admission regression cases`)
