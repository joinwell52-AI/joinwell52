"""Reproduce the bounded Bulbasaur side-effect checks on synthetic skills.

Run with Python 3.12 and the pinned repository's bbsctl/src on PYTHONPATH.
This creates temporary test files and never executes the proposed operation.
"""

import contextlib
import io
import json
import tempfile
from pathlib import Path

from skillctl.cli import main
from skillctl.permissions.side_effects import OpKind, SideEffectCeiling
from skillctl.strictness import Strictness

SKILL = "---\nname: review-notes\ndescription: Reviews pull requests for risky changes and missing tests.\n---\n\nRead the diff and summarize risk.\n"
META = "name: review-notes\nstrictness: local\nversion: 1.0.0\nrisk:\n  level: low\n  side_effects: read_only\n"
PERMS = "schema_version: bulbasaur/v1\nskill: review-notes\ncommands:\n  default: deny\nnetwork:\n  default: deny\nmcp_tools:\n  default: deny\nfilesystem:\n  write_paths: {paths}\n"


def make_skill(root, name, paths):
    directory = root / name / "review-notes"
    directory.mkdir(parents=True)
    (directory / "SKILL.md").write_text(SKILL, encoding="utf-8")
    (directory / "skill.yaml").write_text(META, encoding="utf-8")
    (directory / "permissions.yaml").write_text(PERMS.format(paths=paths), encoding="utf-8")
    return directory


def validate(directory):
    stream = io.StringIO()
    with contextlib.redirect_stdout(stream):
        code = main(["validate", str(directory), "--output", "json"])
    result = json.loads(stream.getvalue())
    block = next(x for x in result["validators"] if x["name"] == "side-effects")
    return code, block


with tempfile.TemporaryDirectory(prefix="bulbasaur-side-effect-") as temporary:
    root = Path(temporary)
    conflicting = make_skill(root, "conflicting", '["out/*"]')
    consistent = make_skill(root, "consistent", "[]")
    bad_code, bad = validate(conflicting)
    good_code, _ = validate(consistent)
    bad_ceiling = SideEffectCeiling.for_skill(conflicting, Strictness.LOCAL)
    good_ceiling = SideEffectCeiling.for_skill(consistent, Strictness.LOCAL)
    bad_write = bad_ceiling.evaluate(OpKind.WRITE, "out/report.txt")
    bad_read = bad_ceiling.evaluate(OpKind.READ, "in/change.diff")
    good_write = good_ceiling.evaluate(OpKind.WRITE, "out/report.txt")
    assert bad_code == 1
    assert any("declared=read_only" in (e.get("detail") or "") and "implied=reversible" in (e.get("detail") or "") for e in bad["errors"])
    assert good_code == 0
    assert bad_write.denied and bad_write.rule_id == "side_effects.ceiling.write"
    assert bad_read.allowed
    assert good_write.denied and good_write.rule_id == "filesystem.write.empty-allowlist"
    print(json.dumps({"assertions_passed": 6, "conflicting_static_rc": bad_code,
                      "consistent_static_rc": good_code,
                      "conflicting_write_rule": bad_write.rule_id,
                      "conflicting_read_allowed": bad_read.allowed,
                      "consistent_write_rule": good_write.rule_id}, indent=2))
