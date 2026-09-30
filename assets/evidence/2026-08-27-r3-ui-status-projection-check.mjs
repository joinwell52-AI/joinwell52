import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { summarizeUiProjection } from "./2026-08-27-r3-ui-status-projection-reader.mjs";

const fixture = JSON.parse(
  await readFile(
    new URL("./2026-08-27-r3-ui-status-projection-fixture.json", import.meta.url),
    "utf8",
  ),
);
const { rows, counts } = summarizeUiProjection(fixture.records);
assert.deepEqual(counts, fixture.expected_counts);
for (const row of rows) {
  assert.equal(row.actual, row.expected, `${row.case}: ${row.actual} !== ${row.expected}`);
}
console.log(JSON.stringify({
  fixture: fixture.fixture_kind,
  assertions: rows.length,
  status: "PASS",
}));
