import assert from "node:assert/strict";
import { evaluate } from "./A1-response-loss-reader.mjs";

const result = await evaluate();
assert.deepEqual(result, {
  evidence_id: "RBE-20260828-A1",
  report_objects_after_retry: 1,
  task_objects_after_retry: 2,
  status: "PASS"
});
console.log(JSON.stringify(result));
