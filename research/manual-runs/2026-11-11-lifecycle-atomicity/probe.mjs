import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = process.argv[2];
if (!repoRoot) throw new Error('Pass absolute CodeFlowMu-open checkout path');
const { LifecycleKernel } = await import(pathToFileURL(join(repoRoot, 'packages/codeflowmu-runtime/src/lifecycle/LifecycleKernel.ts')).href);
const taskId = 'TASK-20261111-001-PM-to-OPS';
const reportId = 'REPORT-20261111-001-OPS-to-PM';
const root = await mkdtemp(join(tmpdir(), 'cfm-lifecycle-receipt-'));
const lifecycleRoot = join(root, 'fcop', '_lifecycle');
const taskName = `${taskId}.md`;
const taskFile = stage => join(lifecycleRoot, stage, taskName);
const frontmatter = raw => {
  const pick = key => raw.match(new RegExp(`^\\s*${key}: (.*)$`, 'm'))?.[1] ?? null;
  return {
    state:pick('state'), lifecycle_path:pick('lifecycle_path'),
    review_status:pick('review_status'),
    transitions:(raw.match(/  - at:/g) ?? []).map(() => ({})),
    transition_action:pick('action'), transition_report:pick('report'),
  };
};
const readStage = async stage => {
  try { return frontmatter(await readFile(taskFile(stage), 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
};
const summarize = async () => {
  const active = await readStage('active');
  const review = await readStage('review');
  const fm = review ?? active;
  return {
    physical: review ? 'review' : active ? 'active' : 'missing',
    state: fm?.state ?? null,
    lifecycle_path: fm?.lifecycle_path ?? null,
    review_status: fm?.review_status ?? null,
    transition_count: fm?.transitions?.length ?? 0,
    transition_action: fm?.transition_action ?? null,
    transition_report: fm?.transition_report ?? null,
  };
};
try {
  for (const stage of ['inbox','active','done','archive'])
    await mkdir(join(lifecycleRoot,stage), {recursive:true});
  await writeFile(taskFile('active'), `---\ntask_id: ${taskId}\nfrom: PM\nto: OPS\ndriver: OPS\ndone_authority: PM\narchive_authority: PM\nstate: active\nlifecycle_path: fcop/_lifecycle/active\n---\n# Isolated task\n`, 'utf8');
  await writeFile(join(lifecycleRoot,'review'), 'destination blocker', 'utf8');
  const kernel = new LifecycleKernel({ lifecycleRoot });
  let firstError = null;
  try { await kernel.submitReview({taskId, actor:'OPS', reportId}); }
  catch (error) { firstError = {code:error.code ?? null, message:error.message}; }
  const afterBlockedMove = await summarize();
  await rm(join(lifecycleRoot,'review'));
  await mkdir(join(lifecycleRoot,'review'));
  const recovered = await kernel.submitReview({taskId, actor:'OPS', reportId});
  const afterRetry = await summarize();
  let lostAckRetryError = null;
  try { await kernel.submitReview({taskId, actor:'OPS', reportId}); }
  catch (error) { lostAckRetryError = error.message; }
  const afterLostAckRetry = await summarize();
  console.log(JSON.stringify({firstError,afterBlockedMove,
    recovered:{ok:recovered.ok,from:recovered.from,to:recovered.to},
    afterRetry,lostAckRetryError,afterLostAckRetry},null,2));
} finally {
  await rm(root, {recursive:true,force:true});
}
