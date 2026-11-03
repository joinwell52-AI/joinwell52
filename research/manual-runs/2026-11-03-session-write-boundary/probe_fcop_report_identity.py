"""Sequential FCoP report-identity control in a disposable workspace."""

import json
import tempfile
from pathlib import Path

from fcop import Project


with tempfile.TemporaryDirectory(prefix="fcop-report-identity-") as temporary:
    project = Project(Path(temporary))
    task = project.write_task(sender="PM", recipient="DEV", priority="P2", subject="Controlled report identity", body="Synthetic task only.")
    first = project.write_report(task_id=task.task_id, reporter="DEV", recipient="PM", body="First synthetic finding.", status="in_progress")
    second = project.write_report(task_id=task.task_id, reporter="DEV", recipient="PM", body="Second synthetic finding.", status="done")
    assert first.path != second.path
    assert first.path.is_file() and second.path.is_file()
    assert "First synthetic finding." in first.path.read_text(encoding="utf-8")
    assert "Second synthetic finding." in second.path.read_text(encoding="utf-8")
    print(json.dumps({
        "first_report_still_readable": True,
        "second_report_readable": True,
        "distinct_report_paths": first.path != second.path,
        "task_reference_equal": first.task_id == second.task_id == task.task_id,
    }, indent=2))
