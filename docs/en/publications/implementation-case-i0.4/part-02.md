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

# 6. First Pinned C01–C14 Corpus

The consolidated baseline was executed at `2026-07-31T11:27:28+08:00` under corpus ID `tmpa-draft-v1-c01-c14-20260731`. It fixes FCoP package `3.2.4` and commit `da79dfefd99f597c9e422ce9edec22157f915a21`; CodeFlowMu `V1.2.3` and commit `8f342d028eb66e77d135bea58fdbc7f2d0627e3b`; selected XiaoDian AI evidence by commit/hash; Windows 10, Python 3.12.9, Node v24.14.0, AMD64, approximately 17 GB memory; and a 325-file SHA-256 evidence inventory.

The archive contains a README, manifest, evidence map, inventory, conformance report, C01–C14 criterion directories, expected/actual outputs, runners, and result files. The runner regenerates actual outputs and results without modifying product source or original evidence.

Status semantics are strict: PASS means direct fixed-product evidence and a successful gating execution; PARTIAL means genuine evidence exists but part of the Core observation surface is missing; NOT RUN means fixtures and oracle exist but the product execution path was absent or unavailable; FAIL means a direct gating execution or internal fixture expectation failed.

Selected runs reported 222 FCoP tests and 73 CodeFlowMu tests passing. An isolated CodeFlowMu identity test was NOT RUN because its test environment could not be prepared. Four XiaoDian report-auditor tests passed as non-gating evidence, while a guardrail suite was NOT RUN because `aiomysql` was unavailable.

The aggregate product verdict is **2 PASS, 8 PARTIAL, 4 NOT RUN, 0 FAIL**. The absence of FAIL means no directly gated criterion failed in this run; it does not mean all criteria were executed or passed.
