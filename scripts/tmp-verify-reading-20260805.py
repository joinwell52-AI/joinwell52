from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

record_path = Path("research/runtime/records/daily/2026/08/2026-08-05-daily-runtime.json")
record = json.loads(record_path.read_text(encoding="utf-8"))
verified_commit = "c87783214681c8cfb95164952ab85cf45e480390"

if record.get("taskStatus", {}).get("reading") != "Completed":
    raise SystemExit("Reading is not completed")
if record.get("results", {}).get("reading", {}).get("status") != "Completed":
    raise SystemExit("Reading result is not completed")

verified_at = datetime.now(ZoneInfo("Asia/Shanghai")).isoformat(timespec="seconds")
record["githubCommit"] = verified_commit
record["commitVerify"] = "Completed"

if not any(
    item.get("task") == "reading" and item.get("event") == "GitHub Commit Verified"
    for item in record.get("timeline", [])
):
    record.setdefault("timeline", []).append({
        "time": verified_at,
        "task": "reading",
        "event": "GitHub Commit Verified",
        "status": "Completed",
        "detail": f"Fetched and verified commit {verified_commit} containing the three durable Reading Records and the runtime-shift-result/v2 Reading result.",
    })

artifact = {
    "label": "Verified Reading result commit",
    "label_zh": "已验证的 Reading 结果提交",
    "commit": verified_commit,
}
for target in (record.setdefault("artifacts", []), record["results"]["reading"].setdefault("artifacts", [])):
    if not any(item.get("commit") == verified_commit for item in target):
        target.append(artifact.copy())

record["updatedAt"] = verified_at
record_path.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(verified_at)
