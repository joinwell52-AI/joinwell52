# 4. CodeFlowMu as a Persistent-Work Environment

CodeFlowMu explores a persistent AI work role—sometimes called a digital employee—as an engineering identity that accepts delegated work, uses tools, and submits evidence across sessions. The term does not imply legal employment, personhood, consciousness, human intention, or replacement of the accountable human or organization.

Model and session instances may change while governed work identity continues through role bindings, task/thread identifiers, reports and reviews, approval/rejection records, lifecycle transitions, unresolved issues/dependencies, recovery, and archival evidence.

One observed session illustrates the distinction between protocol initialization and participant identity. FCoP was initialized, but the session had not been assigned a role. The agent requested explicit role binding before establishing the development plan. After receiving a PM/co-reviewer binding it acknowledged the role and created governed planning work. The observation establishes operational role visibility, not cryptographic authentication.

Observed and tested CodeFlowMu paths include ADMIN/PM delegation, executor claim and execution, separate report submission, QA/governance review, approval/rejection/human-attention states, dependency waiting and release, ISSUE creation, restart recovery, archival history, lifecycle authority, fact gates, state history, and operation approval.

The implementation can block release when required evidence is missing, stale, or incomplete. Current local findings are not yet normalized into one TMPA canonical issue set and evidence graph. CodeFlowMu maintains session, task, report, lifecycle, and ledger evidence sufficient to demonstrate selected restart and recovery behaviors, but no single product reader currently reconstructs responsibility, lifecycle, unresolved dependencies, conflicts, and issues into one canonical output. This is why C13 remains PARTIAL.

# 5. XiaoDian AI NL2SQL Worked Case

A public TMPA-oriented browser demonstration is available at `https://demo.chedian.cc/`. The data-producing private development system and public repository are not asserted to be one directly reproducible build; the public view is an observable deployment snapshot, not a complete reproduction package.

A 2026-07-29 snapshot displayed 330 Profile, 16,129 Event, 924 Message, 1,220 Index/Export, 44 Knowledge, and 352 Audit records. These counts describe one captured state and are not performance benchmarks.

The visible NL2SQL chain included authorization, intent normalization, schema retrieval, DDL-context loading, model-based SQL generation, read-only validation, write blocking, table whitelisting, tenant isolation, field/join/enumeration validation, and result-reasonableness checking.

Two captured chains were reported: a vehicle-violation query passed in 26,344 ms; a vehicle-expense summary query was rejected after 131,994 ms. The evidence value is the retained divergence between accepted and rejected paths. The sample is too small and selected to support rates or representative performance claims.

The rejected chain preserves request identity, validation stages, explicit outcome, elapsed time, evidence beyond the session, and separation between governance evidence and generated SQL. It demonstrates that a real application can persist governance-related records, reconstruct a multi-stage chain, retain rejection as a first-class outcome, and display policy gates. It does not establish full TMPA Core conformance, representative SME performance, independent adoption, cryptographic non-repudiation, or factual correctness of every record.

# 6. Public S0.4 C01–C14 Corpus

I0.3 described a local `tmpa-conformance.zip`, but that archive, its runner, and its fixtures were not present in the GitHub single source of truth. I0.4 replaces that unavailable delivery claim with the public repository corpus [`research/conformance/tmpa-core-s0.4`](https://github.com/joinwell52-AI/joinwell52/tree/main/research/conformance/tmpa-core-s0.4), corpus ID `tmpa-s0.4-fcop-codeflowmu-20260803`.

The corpus has two deliberately separate evidence tracks:

1. **S0.4 Reference Reader track.** A read-only implementation consumes synthetic fixtures, validates the public S0.4 schemas and executable profile, reconstructs canonical nodes, edges, issues, judgments, and views, then checks C01–C14 assertions.
2. **Pinned product-baseline track.** Machine-readable assertions re-adjudicate the available FCoP, CodeFlowMu, and XiaoDian evidence against the stricter S0.4 criteria. A fixture PASS is never promoted into a product PASS.

The repository command is `npm run tmpa:s0.4:conformance`. It regenerates criterion records, reference and product results, an execution log, a summary, and a SHA-256 file manifest without modifying product repositories. The runner uses strict JSON Schema validation for the S0.4 object and reader-result envelopes and validates the executable lifecycle/type/role/relation profile before evaluation.

Status semantics are strict: PASS means all mandatory assertions for that track executed and matched; PARTIAL means genuine product evidence exists but at least one S0.4-required observation or output is missing; NOT RUN means the required product execution path was unavailable; FAIL means an executed mandatory assertion did not match. The product aggregate is PASS only if all C01–C14 product verdicts are PASS.

The FCoP `3.2.4` commit `da79dfefd99f597c9e422ce9edec22157f915a21` was retrieved directly and rerun on Python 3.12.13: **1,137 passed, 2 skipped, 0 failed**. The pinned CodeFlowMu `V1.2.3` commit `8f342d028eb66e77d135bea58fdbc7f2d0627e3b` was not retrievable from the public `CodeFlowMu-open` history, so I0.4 records the new CodeFlowMu run as NOT RUN and uses preserved I0.3 assertions only for bounded re-adjudication.

| Evidence track | PASS | PARTIAL | NOT RUN | FAIL | Aggregate | Claim level |
|---|---:|---:|---:|---:|---|---|
| S0.4 Reference Reader fixtures | 14 | 0 | 0 | 0 | PASS | Implemented and author-demonstrated |
| FCoP–CodeFlowMu product baseline | 1 | 9 | 4 | 0 | PARTIAL | Mixed product evidence |

The Reference Reader result demonstrates that the published interpretation is executable. It does **not** establish that FCoP, CodeFlowMu, or XiaoDian fully conforms to S0.4, and it does not establish independent adoption.
