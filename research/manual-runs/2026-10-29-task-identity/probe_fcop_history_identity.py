"""Test task identity after moving the only task to deep history."""

from pathlib import Path
from tempfile import TemporaryDirectory

from fcop.compatibility.v3.project import Project


def main() -> None:
    with TemporaryDirectory(prefix="fcop-history-id-") as directory:
        project = Project(Path(directory))
        project.init(team="dev-team", lang="en")
        first = project.write_task(
            sender="PM", recipient="DEV", priority="P2",
            subject="First delivery", body="Complete the first task.",
        )
        first_path = first.path
        archived = project.archive_task(first.task_id)
        history_dir = project.archive_to_history(first.task_id)
        second = project.write_task(
            sender="PM", recipient="DEV", priority="P2",
            subject="Second delivery", body="Complete a different task.",
        )
        current_lookup = project.read_task(first.task_id)
        historic_lookup = project.read_history_task(first.task_id)
        late_report = project.write_report(
            task_id=first.task_id, reporter="DEV", recipient="PM",
            body="## Evidence\nLate result addressed to the old task id.\n",
            status="done",
        )
        print(f"v3={project.is_v3}")
        print(f"first={first.task_id} at {first_path.parent.name}")
        print(f"archived={archived.path.parent.name}")
        print(f"history_task_exists={(history_dir / first.filename).exists()}")
        print(f"second={second.task_id} at {second.path.parent.name}")
        print(f"same_task_id={first.task_id == second.task_id}")
        print(f"current_lookup_subject={current_lookup.frontmatter.subject}")
        print(f"history_lookup_subject={historic_lookup.frontmatter.subject}")
        print(f"late_report_references={late_report.task_id}")


if __name__ == "__main__":
    main()
