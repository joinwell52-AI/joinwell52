# 4. Executed Test Baseline

All primary runs were author-executed against the locked sources. Counts are reported without converting skipped tests into passes.

| Track | Result | Exit | Interpretation |
|---|---:|---:|---|
| External S0.5 product fixture | 15/15 assertions | 0 | Mandatory product-level C01–C14 bundle |
| CodeFlowMu built-in TMPA suite | 19/19 tests | 0 | Product regression mapping for the criteria |
| CodeFlowMu Protocol | Passed | 0 | Protocol tests; separate from conformance verdict |
| CodeFlowMu Runtime | 1,446 passed, 0 failed, 1 skipped | 0 | Full locked Runtime run |
| CodeFlowMu Shell | 775/775 | 0 | Initialized isolated product instance |
| Protocol / Runtime / Shell type checks | all passed | 0 | Static checks only |
| FCoP 3.2.4 source baseline | 1,210 passed, 2 skipped | 0 | Two historical examples skipped under migrated layout |

The criterion aggregate is **14 PASS / 0 PARTIAL / 0 NOT RUN / 0 FAIL**. This is a product result for the fixed I0.7 bundle, not a transfer of Reference Reader results and not a universal theorem about every deployment.

# 5. C01–C14 Product Results

| ID | S0.5 criterion | Verdict | Executed observation |
|---|---|---:|---|
| C01 | Schema validation | **PASS** | Nine mandatory malformed-schema classes emitted `SCHEMA_INVALID` and produced no authoritative node. |
| C02 | Primary carrier and immutability | **PASS** | Content-addressed revisions and attributable `CORRECTION` evidence remained intact; `parent` survived FCoP Markdown projection and Reader reconstruction. |
| C03 | Duplicate identity | **PASS** | Same-ID, different-content candidates remained manifested; neither won and deterministic critical-conflict quarantine was emitted. |
| C04 | Stream continuity and asynchronous progress | **PASS** | Duplicate and gap issues were reported, unrelated streams reconstructed, no missing object was invented, and arrival order did not change output. |
| C05 | Role authority | **PASS** | Denied and undetermined authority branches emitted required issues and did not mutate reconstructed state. |
| C06 | Lifecycle legality | **PASS** | Missing independent acceptance kept `work_state` at `review` and emitted both `LIFECYCLE_UNDETERMINED` and `ACCEPTANCE_UNDETERMINED`; illegal and conflicting-state branches also matched. |
| C07 | Separation of duties and human control | **PASS** | The same identity across role labels was rejected; high-risk work stayed `pending_human` until ADMIN approval evidence. |
| C08 | Integrity tampering | **PASS** | Covered-content modification caused `INTEGRITY_MISMATCH`; the object was excluded from authoritative nodes while failure evidence remained in the source manifest. |
| C09 | Missing reference | **PASS** | `MISSING_REFERENCE` and `CLAIM_EVIDENCE_MISSING` remained visible; neither dependency nor completion claim was treated as satisfied. |
| C10 | Prohibited cycle | **PASS** | Only prohibited-cycle members were quarantined; an unrelated valid node remained authoritative. |
| C11 | Deterministic reconstruction | **PASS** | All 24 permutations of a fixed four-source set produced byte-equivalent canonical results with SHA-256 `84e22cf795301ef0eaeaaa026154bfbef3d8cb94a49d3445484443fceaf0c85e`. |
| C12 | Conflict preservation | **PASS** | Contradictory reviews remained `disputed`; an unauthorized DEV decision remained evidence but could not clear the conflict, while an assigned PM with `resolve_review_conflict` permission resolved it. |
| C13 | Recovery | **PASS** | Fresh Readers reconstructed lifecycle, responsibility, unresolved dependency, failure/recovery, parent-child state, and `CHILD_WORK_OPEN` identically. |
| C14 | Terminal-history preservation | **PASS** | Only the accepted authorized chain reached archive; task, report, review, acceptance, and transition history remained reconstructable. |

# 6. V1.4.0 to V1.4.1 Repair Analysis

The repair comparison is intentionally narrow. V1.4.0 already passed C02 and C07; its two failures were C06 and C12.

## 6.1 C06 — lifecycle is not acceptance

V1.4.0 allowed `review → done` when lifecycle evidence appeared sufficient even though independent acceptance was absent. That collapsed process progression into business acceptance. V1.4.1 calculates the two judgments separately: without independent acceptance, work remains at `review` and both lifecycle and acceptance uncertainty are emitted. The product therefore does not manufacture completion from an incomplete authority chain.

## 6.2 C12 — only an authorized resolver may clear a conflict

V1.4.0 preserved conflicting reviews but allowed a later unauthorized decision to clear their disputed state. V1.4.1 retains the unauthorized DEV decision as evidence, emits the authority issue, and leaves `UNRESOLVED_CONFLICT` in force. Only a decision object from an assigned actor with `resolve_review_conflict` permission—demonstrated with PM—can resolve the conflict.

## 6.3 Regression boundary

C03 continues to govern same-ID, different-content candidate conflicts. C10 continues to govern prohibited reference cycles. Neither was merged into C12, and both continue to pass. This matters because a successful patch that weakens or redefines neighboring criteria would not demonstrate S0.5 conformance.

# 7. WP-13 Multi-Agent Evidence-Gating Case

WP-13 addresses a different question from the C01–C14 bundle: can a role-separated workflow prevent an unverified completion claim from becoming an authoritative delivery fact?

```text
completion-meaning claim
        ↓ persistent evidence incomplete
PM fact check → hold / do not release / do not dispatch QA
        ↓ same-task recovery
DEV commit + report
        ↓ separate role
QA rerun and report
        ↓
authorized Gate C decision
```

The initial DEV subexecution used completion-meaning language while exit status, tests, commit, and formal report were not all established. PM checked persistent facts, withheld release, and did not dispatch QA. After recovery, DEV produced the missing evidence and role-separated QA reran tests and checks. A later Gate C record accepted the business delivery; activation, push/publication, and archive remained separate decisions.

The case demonstrates evidence gating, role separation, same-task recovery, and staged authority. It does **not** prove that a model ceased to hallucinate, that every false claim will be detected, or that the original V3 snapshot already contained terminal approval. Its snapshot boundary records `runtime_bound: false` and TASK-019/020 at `review / pending`; later acceptance must not be back-projected into that earlier snapshot.
