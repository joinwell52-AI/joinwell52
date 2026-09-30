import { readFile } from "node:fs/promises";

export function classifyUiProjection(record) {
  if (
    record.protocol_status === "failed" ||
    record.runtime_recovery_status === "session_lost"
  ) {
    return "technical_error";
  }
  if (
    record.protocol_status === "completed" &&
    record.runtime_report_written === false
  ) {
    return "completed_waiting_report";
  }
  if (record.protocol_status !== "running") return null;
  if (!record.live) return "session_without_live_execution";
  return record.runtime_progress
    ? "executing_with_progress"
    : "executing_without_fine_progress";
}

export function summarizeUiProjection(records) {
  const rows = records.map((record) => ({
    case: record.case,
    actual: classifyUiProjection(record),
    expected: record.expected,
  }));
  const counts = Object.fromEntries(
    [
      "executing_with_progress",
      "executing_without_fine_progress",
      "session_without_live_execution",
      "completed_waiting_report",
      "technical_error",
    ].map((status) => [status, rows.filter((row) => row.actual === status).length]),
  );
  return { rows, counts };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const fixture = JSON.parse(
    await readFile(
      new URL("./2026-08-27-r3-ui-status-projection-fixture.json", import.meta.url),
      "utf8",
    ),
  );
  console.log(JSON.stringify(summarizeUiProjection(fixture.records), null, 2));
}
