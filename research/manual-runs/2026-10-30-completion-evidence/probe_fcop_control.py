"""Public FCoP 4 control: successful calls for one task versus two tasks."""

from __future__ import annotations

import json
import tempfile
from pathlib import Path

from fcop import Project


def run(mode: str) -> dict:
    with tempfile.TemporaryDirectory(prefix="fcop-completion-control-") as directory:
        project = Project(Path(directory))
        workspace_id = project.create_workspace(protocol_version="4.0")["workspace_id"]

        def create_active(subject: str) -> tuple[str, str]:
            task = project.create_task(
                workspace_id=workspace_id,
                operation_id=f"public-completion-{mode}-{subject}",
                sender="PM", recipient="DEV", subject=subject, body=f"Deliver {subject}",
            )
            task_id = task["task_id"]
            project.transition(task_id=task_id, from_stage="inbox", to_stage="active",
                               actor="DEV", tool="claim_task")
            attempt = project.inspect_state(task_id=task_id)["current_attempt_id"]
            return task_id, attempt

        task_a, attempt_a = create_active("A")
        task_b, attempt_b = create_active("B")

        def write_report(task_id: str, attempt_id: str) -> dict:
            return project.write_report(
                workspace_id=workspace_id, subject_ref=task_id, attempt_id=attempt_id,
                sender="DEV", recipient="PM", report_kind="final", result="done",
                body=f"Controlled report for {task_id}",
            )

        report_b = write_report(task_b, attempt_b)
        report_a = write_report(task_a, attempt_a)
        selected_task = task_a if mode == "same" else task_b
        selected_report = report_a if mode == "same" else report_b
        project.transition(
            task_id=selected_task, from_stage="active", to_stage="review",
            actor="DEV", tool="submit_task", report_ref=selected_report["report_id"],
        )
        official_reports = project.list_reports(subject_ref=task_a, attempt_id=attempt_a)
        assert len(official_reports) == 1
        report_path = official_reports[0]["path"]
        assert report_path.startswith("fcop/reports/REPORT-")
        return {
            "mode": mode,
            "write_report_task": "A",
            "submit_task": "A" if mode == "same" else "B",
            "task_a_stage": project.inspect_state(task_id=task_a)["stage"],
            "task_b_stage": project.inspect_state(task_id=task_b)["stage"],
            "official_report_a_count": len(official_reports),
            "report_a_path": report_path,
        }


if __name__ == "__main__":
    print(json.dumps({"same": run("same"), "cross": run("cross")}, indent=2))
