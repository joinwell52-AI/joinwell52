import { readFile } from "node:fs/promises";

export function classifyReportTaskAssociation(record) {
  const actionTask = record.action_task ?? null;
  const ledgerTask = record.ledger_task ?? null;
  if (!ledgerTask) return { edge: "report_to_task", status: "missing", reason_code: "ledger_task_missing", canonical_task: null, sources: ["action"] };
  if (!actionTask) return { edge: "report_to_task", status: "missing", reason_code: "action_task_missing", canonical_task: null, sources: ["action", "ledger"] };
  if (actionTask !== ledgerTask) return { edge: "report_to_task", status: "conflict", reason_code: "action_ledger_task_mismatch", canonical_task: null, sources: ["action", "ledger"], conflicts: [{ field: "task_id", action: actionTask, ledger: ledgerTask }] };
  return { edge: "report_to_task", status: "linked", reason_code: "explicit_task_id_match", canonical_task: actionTask, sources: ["action", "ledger"] };
}

export function summarizeAssociationResults(records) {
  const rows = records.map((record) => ({ report: record.report, ...classifyReportTaskAssociation(record) }));
  const counts = Object.fromEntries(["linked", "missing", "conflict"].map((status) => [status, rows.filter((row) => row.status === status).length]));
  return { rows, counts };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const fixture = JSON.parse(await readFile(new URL("./2026-08-27-r2-report-association-fixture.json", import.meta.url), "utf8"));
  console.log(JSON.stringify(summarizeAssociationResults(fixture.records), null, 2));
}
