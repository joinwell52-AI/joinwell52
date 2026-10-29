import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { allocateTaskSequence } from "./external/CodeFlowMu-current/packages/codeflowmu-runtime/src/scheduler/TaskIdentityAllocator.ts";

async function main() {
  const root = await mkdtemp(join(tmpdir(), "cfm-history-id-"));
  try {
    const archived = join(root, "fcop", "history", "2026-10-29", "TASK-20261029-001-PM-to-DEV");
    await mkdir(archived, { recursive: true });
    await writeFile(join(archived, "TASK-20261029-001-PM-to-DEV.md"), "# first archived task\n");
    const next = allocateTaskSequence(root, "20261029");
    console.log(JSON.stringify({ archived_id: "TASK-20261029-001", next_sequence: next }));
    assert.equal(next, "002");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
