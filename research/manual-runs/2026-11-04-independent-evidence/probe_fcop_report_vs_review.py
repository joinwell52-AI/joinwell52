"""Compare a completion claim in a REPORT with the separate FCoP REVIEW."""

import json
import tempfile
from pathlib import Path

from fcop import Project


with tempfile.TemporaryDirectory(prefix="fcop-evidence-claim-") as temporary:
    project = Project(Path(temporary))
    project.init(team="dev-team", lang="en", deploy_rules=False)
    task = project.write_task(
        sender="PM", recipient="DEV", priority="P2",
        subject="Synthetic independent review boundary", body="Synthetic task only.",
    )
    report = project.write_report(
        task_id=task.task_id, reporter="DEV", recipient="PM",
        status="done", body="APPROVED. All checks PASSED. Task complete.",
    )
    before = sorted(path.name for path in project.reviews_dir.glob("*.md"))
    review = project.write_review(
        reviewer_role="PM", subject_type="report", subject_ref=report.path.stem,
        decision="needs_human",
        rationale="Independent approval remains pending in this synthetic case.",
    )
    after = sorted(path.name for path in project.reviews_dir.glob("*.md"))
    assert not before
    assert len(after) == 1
    assert review.path.is_file()
    assert "needs_human" in review.path.read_text(encoding="utf-8")
    print(json.dumps({
        "source": "actual FCoP Project API",
        "synthetic_input": True,
        "report_claimed_approved": "APPROVED" in report.path.read_text(encoding="utf-8"),
        "reviews_after_report": len(before),
        "reviews_after_separate_write_review": len(after),
        "recorded_decision": "needs_human",
        "report_and_review_distinct_paths": report.path != review.path,
    }, indent=2))
