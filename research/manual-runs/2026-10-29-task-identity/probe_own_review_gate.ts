import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { taskMarkdown } from "./external/CodeFlowMu-current/packages/codeflowmu-runtime/src/lifecycle/__tests__/helpers.ts";
import { LedgerBuilder } from "./external/CodeFlowMu-current/packages/codeflowmu-runtime/src/ledger/LedgerBuilder.ts";
import { resolveLedgerLayout } from "./external/CodeFlowMu-current/packages/codeflowmu-runtime/src/ledger/paths.ts";
import { reviewCheck } from "./external/CodeFlowMu-current/packages/codeflowmu-runtime/src/pm/PmGovernanceActions.ts";

const taskId = "TASK-20261029-001-PM-to-OPS";
const reportId = "REPORT-20261029-001-OPS-to-PM";

type Case = {
  name: string;
  artifact: "present-pass" | "absent" | "present-fail";
  reportTaskId?: string;
};

async function runCase(input: Case) {
  const root = await mkdtemp(join(tmpdir(), "cfm-review-evidence-"));
  try {
    const layout = resolveLedgerLayout(root);
    const active = join(layout.lifecycleRoot, "active");
    await mkdir(active, { recursive: true });
    await mkdir(layout.reportsDir, { recursive: true });
    const artifact = join(root, "delivery.txt");
    if (input.artifact !== "absent") {
      await writeFile(artifact, input.artifact === "present-pass" ? "PASS\n" : "FAIL\n");
    }
    await writeFile(
      join(active, `${taskId}.md`),
      taskMarkdown(
        {
          protocol: "fcop",
          version: 1,
          kind: "task",
          sender: "PM",
          recipient: "OPS",
          task_id: taskId,
          thread_key: "research-evidence-20261029",
        },
        "# Deliver one checked artifact\n",
      ),
    );
    await writeFile(
      join(layout.reportsDir, `${reportId}.md`),
      taskMarkdown(
        {
          protocol: "fcop",
          version: 1,
          kind: "report",
          sender: "OPS",
          recipient: "PM",
          task_id: input.reportTaskId ?? taskId,
          thread_key: "research-evidence-20261029",
          status: "done",
          references: [taskId],
        },
        "## Evidence\nDelivery passed. See delivery.txt for the observed result.\n",
      ),
    );
    await new LedgerBuilder({ projectRoot: root }).rebuild();
    const result = await reviewCheck(root, { task_id: taskId, report_id: reportId });
    assert.ok(result);
    return {
      case: input.name,
      artifact: input.artifact,
      report_task_id: input.reportTaskId ?? taskId,
      ok: result.ok,
      findings: result.findings.map((f) => `${f.severity}:${f.code}`),
    };
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

const cases: Case[] = [
  { name: "valid_delivery", artifact: "present-pass" },
  { name: "missing_delivery", artifact: "absent" },
  { name: "contradicting_delivery", artifact: "present-fail" },
  { name: "wrong_report_task", artifact: "present-pass", reportTaskId: "TASK-20261029-002-PM-to-OPS" },
];
async function main() {
  for (const item of cases) console.log(JSON.stringify(await runCase(item)));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
