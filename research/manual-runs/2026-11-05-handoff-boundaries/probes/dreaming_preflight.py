import contextlib
import io
import json
import sys
from pathlib import Path
from types import SimpleNamespace

checkout = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else None
if not checkout:
    raise SystemExit("pass a checkout of anthropics/claude-cookbooks")
managed = checkout / "managed_agents"
sys.path.insert(0, str(managed))
import memory_distill_utils as md

files, skipped = md.transcript_files(managed / "example_data" / "memory_distill" / "transcripts")
estimate, _ = md.estimate_cost(files, "claude-haiku-5-5", "claude-sonnet-5-5", "claude-sonnet-5-5")
outcomes = {}
with contextlib.redirect_stdout(io.StringIO()):
    for label, candidate, budget in [
        ("valid", files, 10), ("empty", [], 10),
        ("over_budget", files, 0), ("too_many", files * 46, 10000),
    ]:
        try:
            md.ready_to_run(candidate, "claude-haiku-5-5", "claude-sonnet-5-5", "claude-sonnet-5-5", budget)
            outcomes[label] = "accepted"
        except Exception as exc:
            outcomes[label] = type(exc).__name__
analyzer = SimpleNamespace(id="analyzer")
threads = [
    SimpleNamespace(id="done", agent=analyzer, status="idle", workflow_run_id="run"),
    SimpleNamespace(id="running", agent=analyzer, status="running", workflow_run_id="run"),
]
paths = ["/transcripts/001.json", "/transcripts/002.json"]
prompts = {"done": "read " + paths[0], "running": "read " + paths[1]}
covered = md.input_coverage(threads, analyzer, paths, prompts)
assert len(files) == 11 and not skipped
assert outcomes == {"valid": "accepted", "empty": "NothingToDistill", "over_budget": "DistillError", "too_many": "DistillError"}
assert covered == {paths[0]: "done"}
print(json.dumps({"files": len(files), "estimated_usd": round(estimate, 4), "gates": outcomes, "covered": covered}, indent=2))
