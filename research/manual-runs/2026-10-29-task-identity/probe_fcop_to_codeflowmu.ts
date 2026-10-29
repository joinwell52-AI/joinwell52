import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { appendActionEvidence } from "./external/CodeFlowMu-current/packages/codeflowmu-runtime/src/logs/ActionEvidenceLogger.ts";
import { ReportActionResolver } from "./external/CodeFlowMu-current/packages/codeflowmu-runtime/src/scheduler/ReportActionResolver.ts";
import type { LifecycleGovernor } from "./external/CodeFlowMu-current/packages/codeflowmu-runtime/src/scheduler/LifecycleGovernor.ts";

const fcopRepo = join(import.meta.dirname, "external", "FCoP-current");
const uv = process.env.UV_BIN ?? "uv";
const fixtureScript = join(import.meta.dirname, "create_fcop_fixture.py");

async function main() {
  const root = await mkdtemp(join(tmpdir(), "fcop-cfm-integrated-"));
  try {
    const created = JSON.parse(execFileSync(uv, ["run", "--no-dev", "python", fixtureScript, root], {
      cwd: fcopRepo, encoding: "utf8",
    })) as { task_id: string; report_id: string; report_path: string; frontmatter: string };
    appendActionEvidence(root, {
      event_type: "command.run", at: "2026-10-29T02:00:00.000Z",
      task_id: created.task_id, session_id: "session-old", run_id: "run-old",
      agent_id: "DEV", role: "DEV", status: "success", command: "npm test", exit_code: 0,
      call_id: "old-test",
    });
    appendActionEvidence(root, {
      event_type: "report.write", at: "2026-10-29T03:00:00.000Z",
      task_id: created.task_id, session_id: "session-new", run_id: "run-new",
      agent_id: "DEV", role: "DEV", status: "success",
      report_id: created.report_id, path: created.report_path, call_id: "new-report",
    });
    const scheduled: string[] = [];
    const governor = {
      scheduleTaskToReviewOnReport(path: string) { scheduled.push(path); },
      async resolveReportSettlement(path: string) { scheduled.push(path); return "reconciled"; },
    } as unknown as LifecycleGovernor;
    const outcome = await new ReportActionResolver({
      projectRoot: root, lifecycleGovernor: governor,
      now: () => new Date("2026-10-29T03:01:00.000Z"),
    }).resolve(created.report_path);
    const reviewDir = join(root, "fcop", "reviews");
    const reviewFiles = await readdir(reviewDir);
    const reviews = await Promise.all(reviewFiles.map((name) => readFile(join(reviewDir, name), "utf8")));
    const verdicts = reviews.map((content) => /fact_check_verdict:\s*(\w+)/.exec(content)?.[1] ?? "missing");
    const result = {
      fcop_report_has_session_id: /(?:^|\n)session_id:/.test(created.frontmatter),
      fcop_report_has_run_id: /(?:^|\n)run_id:/.test(created.frontmatter),
      outcome, scheduled: scheduled.length, verdicts,
    };
    console.log(JSON.stringify(result));
    assert.equal(result.fcop_report_has_session_id, false);
    assert.equal(outcome, "reconciled");
    assert.deepEqual(verdicts, ["pass"]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
