import assert from "node:assert/strict";
import { evaluate } from "./A3-skill-session-reader.mjs";

const result = await evaluate();
assert.deepEqual(result, {
  evidence_id: "RBE-20260828-A3",
  records: 59,
  session_id_missing: 59,
  session_id_missing_percent: 100,
  current_probe_persisted_task: true,
  current_probe_persisted_thread: true,
  current_probe_persisted_session: false,
  mixed_evidence_levels: 2,
  status: "PASS"
});
console.log(JSON.stringify(result));
