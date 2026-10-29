"""Create a real FCoP task/report pair in the supplied temporary project."""

import json
import sys
from pathlib import Path

from fcop.compatibility.v3.project import Project


def main() -> None:
    root = Path(sys.argv[1]).resolve()
    project = Project(root)
    project.init(team="dev-team", lang="en")
    task = project.write_task(
        sender="PM", recipient="DEV", priority="P2",
        subject="Deliver tested change", body="Run the test and report the result.",
    )
    report = project.write_report(
        task_id=task.task_id, reporter="DEV", recipient="PM",
        body="## Evidence\nnpm test passed for this delivery.\n", status="done",
    )
    print(json.dumps({
        "task_id": task.task_id,
        "report_id": report.path.stem,
        "report_path": str(report.path),
        "frontmatter": report.path.read_text(encoding="utf-8").split("---", 2)[1],
    }))


if __name__ == "__main__":
    main()
