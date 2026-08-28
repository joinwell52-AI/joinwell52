import assert from "node:assert/strict";
import { evaluate } from "./A2-event-consumer-reader.mjs";

const result = await evaluate();
assert.deepEqual(result, {
  evidence_id: "RBE-20260828-A2",
  rows: 20440,
  rows_with_payload_raw: 18302,
  raw_percent: 89.5,
  runtime_raw_percent: 53.7,
  analytics_raw_percent: 95.1,
  current_query_returned_raw_marker: true,
  status: "PASS"
});
console.log(JSON.stringify(result));
