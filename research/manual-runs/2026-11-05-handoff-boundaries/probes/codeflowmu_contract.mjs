import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const checkout = process.argv[2];
if (!checkout) throw new Error('pass a checkout of joinwell52-AI/codeflowmu');
const moduleUrl = pathToFileURL(resolve(checkout, 'packages/codeflowmu-runtime/src/session/SessionExecutionContract.ts'));
const { buildSessionExecutionContract, compareSessionExecutionContracts } = await import(moduleUrl.href);
const base = {
  provider: 'codex', transport: 'app-server-stdio', role: 'DEV', agentId: 'DEV-01',
  hostSlotId: 'host-a', workspace: 'project-a',
  mcpServers: { fcop: { env: { FCOP_ALLOWED_TOOLS: 'read_task,write_report' } } },
};
const original = buildSessionExecutionContract(base);
const variants = {
  same: base,
  host: { ...base, hostSlotId: 'host-b' },
  workspace: { ...base, workspace: 'project-b' },
  role: { ...base, role: 'QA' },
  tools: { ...base, mcpServers: { fcop: { env: { FCOP_ALLOWED_TOOLS: 'read_task,approve_review' } } } },
};
const actual = Object.fromEntries(Object.entries(variants).map(([key, value]) => [key,
  compareSessionExecutionContracts(original, buildSessionExecutionContract(value)).map(item => item.field),
]));
assert.deepEqual(actual, { same: [], host: ['host_slot_id'], workspace: ['workspace'], role: ['role'], tools: ['governance_tool_ids'] });
console.log(JSON.stringify(actual, null, 2));
