import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.env.CODEFLOWMU_SOURCE_ROOT;
if (!root) throw new Error('Set CODEFLOWMU_SOURCE_ROOT to the matching CodeFlowMu checkout');
const { SessionStore } = await import(pathToFileURL(join(root, 'packages/codeflowmu-runtime/src/session/SessionStore.ts')).href);

function record(id) {
  return { protocol: {
    session_id: id, agent_id: 'DEV-01', task_id: 'TASK-CONTROLLED',
    started_at: '2026-11-03T00:00:00.000Z', status: 'running',
    runs: [{ run_id: 'run-1', started_at: '2026-11-03T00:00:00.000Z', status: 'running', tool_calls_count: 0 }],
  } };
}

const dir = await mkdtemp(join(tmpdir(), 'session-write-boundary-'));
try {
  const store = new SessionStore({ dir });
  await store.save(record('stale'));
  const a = await store.load('stale');
  const b = await store.load('stale');
  assert(a && b);
  a.runtime_recovery_status = 'managed_job_running';
  b.protocol.runs[0].tool_calls_count = 1;
  await store.save(a);
  const afterA = await store.load('stale');
  await store.save(b);
  const afterB = await store.load('stale');
  assert(afterA && afterB);
  assert.equal(afterA.runtime_recovery_status, 'managed_job_running');
  assert.equal(afterB.runtime_recovery_status, undefined);
  assert.equal(afterB.protocol.runs[0].tool_calls_count, 1);
  assert.deepEqual(afterB, JSON.parse(await readFile(join(dir, 'stale.json'), 'utf8')));

  await store.save(record('control'));
  const first = await store.load('control');
  assert(first);
  first.runtime_recovery_status = 'managed_job_running';
  await store.save(first);
  const second = await store.load('control');
  assert(second);
  second.protocol.runs[0].tool_calls_count = 1;
  await store.save(second);
  const final = await store.load('control');
  assert(final);
  assert.equal(final.runtime_recovery_status, 'managed_job_running');
  assert.equal(final.protocol.runs[0].tool_calls_count, 1);

  console.log(JSON.stringify({
    stale_snapshot: {
      after_A: { recovery_status: afterA.runtime_recovery_status, tool_calls: afterA.protocol.runs[0].tool_calls_count },
      after_B: { recovery_status: afterB.runtime_recovery_status ?? null, tool_calls: afterB.protocol.runs[0].tool_calls_count },
      both_saves_resolved: true, final_json_parsed: true,
    },
    serialized_control: { recovery_status: final.runtime_recovery_status, tool_calls: final.protocol.runs[0].tool_calls_count },
  }, null, 2));
} finally {
  await rm(dir, { recursive: true, force: true });
}
