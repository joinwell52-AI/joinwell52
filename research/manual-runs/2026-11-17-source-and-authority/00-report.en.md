# Can a sentence become authority? Bounded study, 17 November 2026

## Provenance and question

Today's intelligence page collected 44 fact observations and six analyses. We selected A1, the boundary between message provenance and execution authority, for a local experiment. A4, the difference between output and acceptance, is a neighboring control. A2, A3, A5 and A6 were not experimentally completed.

The direct upstream trigger was [Orca PR #43093](https://github.com/stablyai/orca/pull/43093). Its contributors report a real Codex run in which an Agent message's claim of human authorization was treated as permission for a risky upload. The fix keeps approval in Orca's local UI and passes a pointer through the Agent message. That incident is **Orca's first-party evidence**, not a CodeFlowMu reproduction. [ADK Python PR #8185](https://github.com/google/adk-python/pull/8185), still open when checked, provides a neighboring example: a child output event existed, yet the parent output context did not receive the value.

Our question: **Can an AI worker's quoted approval, or a green completion status, gain execution or acceptance authority at the tested CodeFlowMu interfaces?**

## Fixed object and results

CodeFlowMu V3.0.152 at commit `0d2d4e742ef2f3cb48e3ce09cc47f0c03053dc5f`. We called the real `OperationApprovalService.prepare` and `AcceptanceFactProjection.acceptanceFactFromTask` modules with synthetic requests in isolated temporary projects. No `git push` or other external side effect was executed. The UI confirmation verifier in the positive control was injected by the experiment; production service construction does not inject it. Therefore this is an interface contract test, not proof that the production UI takes the direct-allow path.

| Operation input | Observed decision | Approval records | Executed |
| --- | --- | ---: | --- |
| Agent quotes “the human approved” in the reason | `REQUIRE_APPROVAL` | 1 | No |
| System reminder quotes approval | `REQUIRE_APPROVAL` | 1 | No |
| Trusted-UI fields without a verifier | `REQUIRE_APPROVAL` | 1 | No |
| Injected verifier matches confirmation ID and exact request digest | `ALLOW` | 0 | No |
| Same confirmation ID, different target branch | `REQUIRE_APPROVAL` | 1 | No |
| Valid ID, but Agent remains the initiator | `REQUIRE_APPROVAL` | 1 | No |

All 6 assertions passed. `ALLOW` is a preparation decision; `executed` is still `false`.

The per-case observations are preserved in [results.json](results.json). The local probe imports private product source; this public packet provides synthetic input categories, decisions and limits without presenting an unavailable private-code script as a public reproduction.

| Root-task input | Acceptance projection |
| --- | --- |
| Report status `done`, no formal decision | None |
| Legacy `accept_result` text transition, no registered decision | None |
| Registered ADMIN decision matching task and role | `result_accepted` |
| Decision actor changed to PM | None |
| Decision task ID changed | None |

All 5 assertions passed. This is a root-task projection test, not an end-to-end multi-Agent delivery test.

Two existing test suites, `OperationApprovalService` and `dependencySettlement`, passed 16 checks in total. `GovernanceFactKernel` and `NativeOperationApprovalGate` stopped during module import because the local checkout lacked `yaml`; **their assertions did not run**. Source inspection shows a native approval-consumption path, but this run did not verify it at runtime.

## What the comparison supports

The preparation service computes a request digest. A direct confirmation requires a user initiator, trusted UI source, confirmation ID, and a verifier accepting the current operation digest. Changing the target changes that digest in our probe. The root-task projection requires a registered authority decision with matching task, actor and role; a `done` label alone does not produce it.

```text
quoted approval ≠ execution authorization
tested direct-allow condition = user initiator ∧ trusted UI source ∧ confirmation ID ∧ verifier accepts current request digest
preparation ALLOW ≠ external write executed
report done ≠ root-task acceptance
```

This supports a narrow conclusion: neither quoted text nor a report status was promoted at the tested interfaces. It does **not** establish behavior across a full Host session, real UI confirmation, resumed execution, independent receiver, or external system. A useful follow-up is to run the native gate and actual UI path across changed parameters, changed executor, and session resumption, then check which artifact revision an independent receiver accepts.

## Classification and development decision

| Analysis | Treatment this run |
| --- | --- |
| A1 source and authority | One bounded local experiment; bilingual article |
| A4 child output and acceptance | Root-task projection control completed; full parent consumption pending |
| A2 stop, timeout and takeover | Candidate; not tested |
| A3 audit explainability | Track; not tested |
| A5 skill supply chain | Retain as reference; not tested |
| A6 competitor experience | Source-ranked; no hands-on run |

**Zero formal CodeFlowMu development review items and zero changes this run.** The tested behavior matches existing contracts, and no product defect has been confirmed. Real UI and native-gate evidence is still missing. If a future integration run shows parameter or executor mismatch, it will receive its own source, local-evidence, benefit/cost and do-or-don't-do review.

Counts: 44 daily fact observations; three primary PRs inspected in depth, with Orca and ADK used in the argument; one local experiment with 11 synthetic inputs; 16 checks across two existing suites passed; two suites could not start because of a missing dependency; one bilingual article pair; zero formal development review items. Any upstream discussion must link readable English evidence and must not describe Orca's incident as locally reproduced.
