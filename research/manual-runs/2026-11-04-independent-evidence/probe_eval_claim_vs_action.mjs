import assert from 'node:assert/strict';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.env.CFM_ROOT;
if (!root) throw new Error('Set CFM_ROOT to the pinned CodeFlowMu checkout');
const source = join(root, 'packages/codeflowmu-runtime/src/eval/EvalObservationGenerator.ts');
const { buildEvalObservationAnalysisFromRows } = await import(pathToFileURL(source));
const rootId = 'TASK-20261104-901';
const childId = 'TASK-20261104-902';
const reportId = 'REPORT-20261104-901-PM-to-ADMIN';
const reportBody = `---\ntask_id: ${rootId}\nsender: PM\nrecipient: ADMIN\nstatus: done\nreport_type: final_summary\n---\n## Conclusion\nAPPROVED. All tests PASSED. Task complete. ${childId} delivered.`;
const base = {
  pmReportFilename: `${reportId}.md`,
  pmReportContent: reportBody,
  pmReportFm: { task_id: rootId, sender: 'PM', recipient: 'ADMIN', status: 'done', report_type: 'final_summary' },
  tasks: [
    { task_id: rootId, filename: `${rootId}-ADMIN-to-PM.md`, sender: 'ADMIN', recipient: 'PM', bucket: 'review' },
    { task_id: childId, filename: `${childId}-PM-to-DEV.md`, sender: 'PM', recipient: 'DEV', parent: rootId, bucket: 'done' },
  ],
  reports: [{ report_id: reportId, filename: `${reportId}.md`, task_id: rootId, sender: 'PM', recipient: 'ADMIN', status: 'done', report_kind: 'pm_to_admin_final' }],
};
const scenarios = {
  claim_only: [],
  failed_process: [{ task_id: childId, event_type: 'command.run', status: 'failed', is_test: true, test_assertions: 1, failure_class: 'product' }],
  successful_process: [{ task_id: childId, event_type: 'command.run', status: 'success', is_test: true, test_assertions: 78, failure_class: 'none' }],
};
const output = {};
for (const [name, actionEvidence] of Object.entries(scenarios)) {
  const result = buildEvalObservationAnalysisFromRows({ ...base, actionEvidence });
  assert.ok(result);
  output[name] = {
    risk_level: result.risk_level,
    review_status: result.review.status,
    reviewed_by: result.review.reviewed_by,
    evidence_gaps: result.evidence_gaps,
    observed_anomalies: result.observed_anomalies,
    test_process_successes: result.action_evidence_summary.test_process_successes,
    test_process_failures: result.action_evidence_summary.test_process_failures,
    observed_test_assertion_claims: result.action_evidence_summary.observed_test_assertion_claims,
    successful_tests: result.action_evidence_summary.successful_tests,
    outcome_scope: result.action_evidence_summary.outcome_scope,
  };
}
assert.equal(output.claim_only.test_process_successes, 0);
assert.equal(output.failed_process.test_process_failures, 1);
assert.equal(output.failed_process.risk_level, 'high');
assert.equal(output.successful_process.successful_tests, null);
assert.equal(output.successful_process.review_status, 'draft');
console.log(JSON.stringify({ synthetic_input: true, result: output }, null, 2));
