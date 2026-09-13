import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const percent = (part, total) => Number(((part / total) * 100).toFixed(1));

export async function evaluate(path = new URL("./A2-event-consumer-fixture.json", import.meta.url)) {
  const fixture = JSON.parse(await readFile(path, "utf8"));
  const datasets = fixture.historical_profile.datasets;
  const rows = datasets.reduce((sum, item) => sum + item.rows, 0);
  const raw = datasets.reduce((sum, item) => sum + item.rows_with_payload_raw, 0);
  const runtime = datasets.find((item) => item.name === "runtime");
  const analytics = datasets.find((item) => item.name === "analytics");
  const pass =
    fixture.historical_profile.files === 27 &&
    rows === 20440 &&
    raw === 18302 &&
    fixture.historical_profile.later_projected_subset.rows === 681 &&
    fixture.historical_profile.later_projected_subset.rows_with_payload_raw === 0 &&
    fixture.current_query_probe.marker_location === "payload.raw.text" &&
    fixture.current_query_probe.marker_present_in_structured_summary === false &&
    fixture.current_query_probe.marker_returned_by_activity_query === true;
  return {
    evidence_id: fixture.evidence_id,
    rows,
    rows_with_payload_raw: raw,
    raw_percent: percent(raw, rows),
    runtime_raw_percent: percent(runtime.rows_with_payload_raw, runtime.rows),
    analytics_raw_percent: percent(analytics.rows_with_payload_raw, analytics.rows),
    current_query_returned_raw_marker: fixture.current_query_probe.marker_returned_by_activity_query,
    status: pass ? "PASS" : "FAIL"
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await evaluate()));
}
