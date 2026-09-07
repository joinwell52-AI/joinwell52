import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export async function evaluate(path = new URL("./A1-response-loss-fixture.json", import.meta.url)) {
  const fixture = JSON.parse(await readFile(path, "utf8"));
  const byName = Object.fromEntries(fixture.observations.map((item) => [item.experiment, item]));
  const upper = byName.upper_memory_dedupe_reentry;
  const report = byName.write_report_response_loss;
  const task = byName.write_task_response_loss;
  const pass =
    upper?.same_call_reentered_after_lost_response === true &&
    upper?.disposition === "execute_again" &&
    report?.same_submission_id === true &&
    report?.same_semantic_request === true &&
    report?.second_call_deduplicated === true &&
    report?.durable_business_objects_after_retry === 1 &&
    task?.same_submission_id === true &&
    task?.same_semantic_request === true &&
    task?.durable_business_objects_after_retry === 2 &&
    new Set(task?.returned_task_ids ?? []).size === 2;
  return {
    evidence_id: fixture.evidence_id,
    report_objects_after_retry: report?.durable_business_objects_after_retry,
    task_objects_after_retry: task?.durable_business_objects_after_retry,
    status: pass ? "PASS" : "FAIL"
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await evaluate()));
}
