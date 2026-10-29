import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { appendActionEvidence } from "./external/CodeFlowMu-current/packages/codeflowmu-runtime/src/logs/ActionEvidenceLogger.ts";
import { resolveReviewEvidence } from "./external/CodeFlowMu-current/packages/codeflowmu-runtime/src/review/ReviewEvidenceResolver.ts";
import { evaluateReviewFactGate } from "./external/CodeFlowMu-current/packages/codeflowmu-runtime/src/review/ReviewFactGate.ts";

const taskId = "TASK-20261029-003-PM-to-DEV";
const reportId = "REPORT-20261029-003-DEV-to-PM";
const body = "## Evidence\nnpm test passed for this delivery.\n";

async function main() {
  const root = await mkdtemp(join(tmpdir(), "cfm-evidence-binding-"));
  try {
    appendActionEvidence(root, {
      event_type: "command.run",
      at: "2026-10-29T02:00:00.000Z",
      task_id: taskId,
      session_id: "session-old",
      run_id: "run-old",
      agent_id: "DEV",
      role: "DEV",
      status: "success",
      command: "npm test",
      exit_code: 0,
      call_id: "old-test",
    });
    appendActionEvidence(root, {
      event_type: "report.write",
      at: "2026-10-29T03:00:00.000Z",
      task_id: taskId,
      session_id: "session-new",
      run_id: "run-new",
      agent_id: "DEV",
      role: "DEV",
      status: "success",
      report_id: reportId,
      path: `fcop/reports/${reportId}.md`,
      call_id: "new-report",
    });

    const probes = [
      { name: "task_only", query: { projectRoot: root, task_id: taskId, report_id: reportId }, sessionId: undefined },
      { name: "bound_to_new_session", query: { projectRoot: root, task_id: taskId, report_id: reportId, session_id: "session-new" }, sessionId: "session-new" },
      { name: "after_old_test", query: { projectRoot: root, task_id: taskId, report_id: reportId, time_window: { from: "2026-10-29T02:30:00.000Z" } }, sessionId: undefined },
    ];
    for (const probe of probes) {
      const evidence = resolveReviewEvidence(probe.query);
      const judgment = evaluateReviewFactGate(evidence, body, {
        session_id: probe.sessionId,
        report_status: "done",
      });
      console.log(JSON.stringify({
        case: probe.name,
        selected_session: evidence.session.session_id ?? null,
        session_found: evidence.session.found,
        commands: evidence.commands.map((c) => c.command),
        report_found: evidence.report.found,
        verdict: judgment.verdict,
        reason: judgment.reason_code,
      }));
    }
    const unbound = resolveReviewEvidence({ projectRoot: root, task_id: taskId, report_id: reportId });
    assert.equal(unbound.session.session_id, "session-old");
    assert.equal(unbound.commands.length, 1);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
