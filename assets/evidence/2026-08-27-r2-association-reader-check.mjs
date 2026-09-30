import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { summarizeAssociationResults } from "./2026-08-27-r2-association-reader.mjs";

const fixture = JSON.parse(await readFile(new URL("./2026-08-27-r2-report-association-fixture.json", import.meta.url), "utf8"));
const { rows, counts } = summarizeAssociationResults(fixture.records);
assert.deepEqual(counts, fixture.expected_counts);
assert.equal(rows.find((row) => row.report === "R02")?.status, "conflict");
assert.equal(rows.find((row) => row.report === "R02")?.canonical_task, null);
assert.equal(rows.find((row) => row.report === "R04")?.status, "missing");
assert.equal(rows.find((row) => row.report === "R04")?.canonical_task, null);
assert.equal(rows.find((row) => row.report === "R10")?.status, "linked");
assert.equal(rows.find((row) => row.report === "R10")?.canonical_task, "T08");
console.log(JSON.stringify({ fixture: fixture.fixture_kind, counts, status: "PASS" }));
