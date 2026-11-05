import { execFileSync } from 'node:child_process';
import { stripTypeScriptTypes } from 'node:module';
import assert from 'node:assert/strict';

const checkout = process.argv[2];
if (!checkout) throw new Error('pass a checkout of Paradev desktop-v2.0.5');
const git = (...args) => execFileSync('git', ['-C', checkout, ...args], { encoding: 'utf8' }).trim();
const commit = git('rev-parse', 'HEAD');
assert.equal(commit, '624219c3c6a5428aec38b5f13f040cc0fc087010');
const source = git('show', 'HEAD:packages/trpc/src/router/automation/targetPlan.ts');
const replacements = `const CLOUD_HOST_ID = "cloud";
class TRPCError extends Error { constructor(options) { super(options.message); this.code = options.code; } }
const userError = (options) => new TRPCError(options);
`;
const standalone = replacements + source.replace(/^import .*;\r?\n/gm, '');
const js = stripTypeScriptTypes(standalone, { mode: 'strip' });
const { planTarget, NO_TARGET } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));

const old = { ...NO_TARGET, targetHostId: 'host-a', v2ProjectId: 'project-a', v2WorkspaceId: 'workspace-a', continueAgentSession: true };
const cases = {
  host_change: planTarget(old, { targetHostId: 'host-b' }, {}).target,
  reuse_only: planTarget(NO_TARGET, { targetHostId: 'host-a', reuseWorkspace: true }, {}).target,
  continue_no_pin: planTarget(NO_TARGET, { targetHostId: 'host-a', continueAgentSession: true }, {}).target,
  no_reuse: planTarget(NO_TARGET, { targetHostId: 'host-a', reuseWorkspace: false, continueAgentSession: true }, {}).target,
  host_change_while_reusing: planTarget({ ...old, reuseWorkspace: true }, { targetHostId: 'host-b' }, {}).target,
};
assert.equal(cases.host_change.continueAgentSession, false);
assert.equal(cases.reuse_only.continueAgentSession, false);
assert.equal(cases.continue_no_pin.reuseWorkspace, true);
assert.equal(cases.no_reuse.continueAgentSession, false);
assert.equal(cases.host_change_while_reusing.continueAgentSession, true);
console.log(JSON.stringify(Object.fromEntries(Object.entries(cases).map(([name, target]) => [name, {
  host: target.targetHostId, pinned_workspace: target.v2WorkspaceId,
  reuse: target.reuseWorkspace, continue: target.continueAgentSession,
}])), null, 2));
