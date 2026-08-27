import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const fixture = JSON.parse(await readFile(new URL("./2026-08-27-r2-v204-dynamic-diagnostic-snapshots.json", import.meta.url), "utf8"));
assert.equal(fixture.task_id, "TASK-20260827-030-PM-to-QA");
assert.equal(fixture.source.same_task, true);
const active = fixture.snapshots.find((row) => row.label === "active");
const review = fixture.snapshots.find((row) => row.label === "review");
assert.ok(active && review);
assert.deepEqual(active.visible_summary, { linked: 4, missing: 0, conflict: 0, observer_only: 0 });
assert.equal(active.visible_edges.find((row) => row.edge === "report_to_task")?.status, "not_applicable");
assert.equal(active.visible_edges.find((row) => row.edge === "report_to_review")?.status, "not_applicable");
assert.equal(review.visible_edges.find((row) => row.edge === "report_to_task")?.status, "linked");
assert.equal(review.visible_edges.find((row) => row.edge === "report_to_review")?.status, "linked");
assert.equal(review.visible_edges.find((row) => row.edge === "eval_to_review")?.reason_code, "eval_not_present");
console.log(JSON.stringify({ fixture: fixture.fixture_kind, same_task: true, transition: "active_to_review", status: "PASS" }));
