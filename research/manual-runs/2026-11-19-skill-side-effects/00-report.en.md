# 2026-11-19 — A skill's declared side effects versus its effective permission

## Source and selection

The [2026-11-19 intelligence page](../../../../docs/en/runtime/daily-intelligence/2026-11-19.md) records 57 observations in seven analysis groups. We selected O1, [Mansura Habiba's Bulbasaur PR #25](https://github.com/mansura-habiba/bulbasaur-skill-cli/pull/25), merged as `bb023460e9fb1ce0d5b2b439ea461650c3d3df97`. Its `risk.side_effects` declaration is cross-checked against permission grants, and `SideEffectCeiling` applies an operation limit at call time. This is the author's project, not an official AGENTSAFE artifact. O2–O3 extend assessment services, O11 concerns delegated authority, O28 concerns delivery completion, and other observations remain reading or follow-up candidates; none is counted as another completed experiment.

## Fixed synthetic comparison

At the pinned Bulbasaur revision, Python 3.12 ran all **13 upstream `test_side_effects_contract.py` tests successfully**. Our separate six-assertion probe used two synthetic `review-notes` skills. Both declared `risk.side_effects: read_only`. One permission file allowed `filesystem.write_paths: ["out/*"]`; the other had `write_paths: []`.

| Case | Static `validate` | Proposed runtime operation | Result |
| --- | --- | --- | --- |
| Read-only claim + `out/*` write grant | exit 1, `declared=read_only`, `implied=reversible` | write `out/report.txt` | denied, `side_effects.ceiling.write` |
| Same conflicting skill | same | read `in/change.diff` | allowed |
| Read-only claim + closed write list | exit 0 | write `out/report.txt` | denied, `filesystem.write.empty-allowlist` |

No shell command or file write was executed. The probe called the actual CLI validator and `SideEffectCeiling` with synthetic files. `read_only` is a side-effect claim; a plain document sentence alone is not automatically this declaration.

To repeat the public part, check out Bulbasaur at `bb023460e9fb1ce0d5b2b439ea461650c3d3df97`, use Python 3.12 with `bbsctl/src` on `PYTHONPATH`, run `python -m pytest bbsctl/tests/test_side_effects_contract.py -q`, then run [`replay-bulbasaur.py`](./replay-bulbasaur.py). The replay creates temporary synthetic skill files and tests only decisions.

## CodeFlowMu comparison

We used a clean local checkout of private CodeFlowMu at `794123058b8db012ca0da189b43fdf0c5ec2ff04`. Its v0.1 skill-record schema has tool `required_perms`, `risk_level`, `irreversible`, and `cost_sensitive`, but no `side_effects` ceiling. Three schema assertions passed: a `low`-risk tool with a write permission string is schema-valid, a synthetic `side_effects` field is rejected, and a `high`-risk tool with no write permission is also schema-valid. **`risk_level` is not a promise that a tool is read-only**; schema acceptance does not itself grant a tool operation.

Separately, six assertions against the real `OperationFacts` classifier and negative predicates passed. A synthetic `read_file` proposal targeting a protected source path was classified `read` with no protected-write match. Changing only the tool to `write_file` classified it `write` and matched `NEG.PROTECTED.BOUNDARY.WRITE`. This was fact classification only, not an approval decision or execution. The v0.1 `MCPInjector` is explicitly stub mode; the live skill mount path was not exercised. Private CodeFlowMu source and local probe files are not publicly available; the reported outputs are bounded first-party results, not independently rerunnable from this public repository.

## Judgment and development handling

Bulbasaur shows a useful two-stage contract: reject a declaration/permission mismatch before use, then check the actual attempted operation. CodeFlowMu currently models different pieces: skill registration metadata and separate per-operation facts. We have **not** shown that a live CodeFlowMu skill can write despite a read-only promise, nor that a current product path needs the same ceiling. Thus this round has **one experimental topic, one bilingual article pair, zero formal development review items, and zero development tasks**. A future live-skill integration experiment would need to bind a versioned skill claim, effective grants, task authority, and an actual tool call before implementation cost or priority can be judged.

## Research exchange

We [commented on the source PR](https://github.com/mansura-habiba/bulbasaur-skill-cli/pull/25#issuecomment-6999111541) with the bounded result and asked whether a Host should reject an invalid skill entirely even when the call-time ceiling permits a read proposal. The repository was already starred and that state was verified. No reply had been observed when this report was updated. Drafts, exact sent text, receipts, and the reply ledger remain local.
