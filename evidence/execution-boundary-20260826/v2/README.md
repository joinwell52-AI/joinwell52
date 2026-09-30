# Execution Boundary Four Cases — Public Evidence Dossier

Version: 2026-08-26-public-v2

This dossier supplements the v1 aggregate summary with sanitized evidence traces. Each case records the observed failure or ambiguity, the corrective change class, the ordered test results, and the conclusion boundary.

## What readers can inspect

| File | Content |
| --- | --- |
| `case-a1-gate-run-trace.csv` | Ordered gate, regression, and controlled-restart observations. |
| `case-a2-observer-semantic-trace.csv` | Before/after observer semantics and API idempotence records. |
| `case-a3-projection-precedence-trace.csv` | Current-versus-history projection checks and the failing-then-passing precedence run. |
| `case-a4-recovery-timeline.csv` | A bounded recovery authorization, dispatch, report, and verification timeline. |
| `transcript-a1.md` to `transcript-a4.md` | Sanitized, source-faithful test and runtime output excerpts. |
| `claim-evidence-map.csv` | Every public article claim mapped to a specific trace or transcript record. |
| `chain-of-custody.csv` | SHA-256 of each restricted source artefact, public derivative, and redaction class. |
| `manifest.json` | Scope, sanitization, and interpretation rules. |

## Sanitization and integrity boundary

The dossier preserves event order, behavior labels, test commands, test-collection names, results, durations where safe, and support limits. The transcript files are source-faithful excerpts: explanatory brackets mark every redaction. It removes task contents, prompts, personal identities, absolute paths, process IDs, credentials, raw logs, private source code, private evidence locations, and stable internal identifiers.

The original first-party evidence is access-restricted. These files are a public, manually reviewed derivative—not a claim that outsiders can independently replay the private runtime. Do not add counts across files into a reliability rate.
