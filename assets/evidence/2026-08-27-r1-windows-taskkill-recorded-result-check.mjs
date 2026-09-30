import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const result = JSON.parse(
  await readFile(
    new URL("./2026-08-27-r1-windows-taskkill-recorded-result.json", import.meta.url),
    "utf8",
  ),
);

assert.equal(result.status, "PASS");
assert.equal(result.scope, "windows_taskkill_tree_probe_only");
assert.equal(result.precondition_wrapper_and_child_observed, true);
assert.equal(result.wrapper_exit_observed, true);
assert.equal(result.child_exit_observed, true);
assert.equal(result.termination_exit_code, 0);
assert.equal(result.kernel_containment_proven, false);
assert.ok(Array.isArray(result.limitations) && result.limitations.length > 0);

console.log(JSON.stringify({
  fixture: result.fixture_kind,
  status: "PASS",
  kernel_containment_proven: result.kernel_containment_proven,
}));
