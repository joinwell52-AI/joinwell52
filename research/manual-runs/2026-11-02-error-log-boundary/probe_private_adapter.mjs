// Replays synthetic tool-result data against a local CodeFlowMu V3.0.129 checkout.
// The product source is private; this script documents the exact probe but is
// independently runnable only by readers who have access to that checkout.
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const checkout = process.argv[2];
const output = process.argv[3];
if (!checkout || !output) {
  throw new Error('Usage: node --experimental-transform-types probe_private_adapter.mjs <CodeFlowMu-checkout> <disposable-output-dir>');
}
const source = resolve(checkout, 'packages/codeflowmu-runtime/src/logs');
const root = resolve(output);
mkdirSync(root, { recursive: true });
const { maybeRecordActionEvidenceFromToolCall } = await import(
  pathToFileURL(join(source, 'ActionEvidenceFromToolCall.ts')).href
);

const known = `sk-proj-${'A'.repeat(28)}`;
const opaque = `opaque-fixture-${'Z'.repeat(28)}`;
const failure = `provider rejected request; detail=${known}; diagnostic marker ${opaque}`;
maybeRecordActionEvidenceFromToolCall({
  projectRoot: root,
  agent_id: 'DEV-SYNTHETIC',
  session_id: `session-${Date.now()}`,
  task_id: 'TASK-SYNTHETIC-001',
  payload: {
    name: 'commandExecution',
    call_id: `failed-call-${Date.now()}`,
    status: 'failed',
    raw: {
      args: { command: `synthetic-command --api-key ${known} --credential ${opaque}`, cwd: root },
      exitCode: 1,
      result: { stderr: `${'.'.repeat(4100)}\n${failure}` },
    },
  },
});

const logDir = join(root, 'fcop/logs/runtime');
const actionPath = join(logDir, readdirSync(logDir).find((name) => /^actions-\d{8}\.jsonl$/.test(name)));
const records = readFileSync(actionPath, 'utf8').trim().split(/\r?\n/).map((line) => JSON.parse(line));
const row = records.at(-1);
assert.equal(row.event_type, 'command.run');
assert.equal(row.status, 'failed');
assert.ok(row.stderr_ref);
const stderr = readFileSync(join(root, row.stderr_ref), 'utf8');
const result = {
  fixture: 'synthetic; no command or provider called',
  actionStatus: row.status,
  failureClass: row.failure_class,
  stderrReferenceCreated: Boolean(row.stderr_ref),
  knownKeyAbsentFromAction: !row.command.includes(known),
  opaqueValuePresentInAction: row.command.includes(opaque),
  knownKeyAbsentFromStderr: !stderr.includes(known),
  opaqueValuePresentInStderr: stderr.includes(opaque),
};
assert.deepEqual(result, {
  fixture: 'synthetic; no command or provider called',
  actionStatus: 'failed',
  failureClass: 'unknown',
  stderrReferenceCreated: true,
  knownKeyAbsentFromAction: true,
  opaqueValuePresentInAction: true,
  knownKeyAbsentFromStderr: true,
  opaqueValuePresentInStderr: true,
});
console.log(JSON.stringify(result, null, 2));
