# 5. Executed Test Baseline

All primary runs were author-executed. A PASS in the Reference Reader track is never copied into the product track.

| Track | Result | Exit | Interpretation |
|---|---:|---:|---|
| S0.5 Reference Reader | 14 passed | 0 | Executable interpretation over synthetic fixtures |
| FCoP v3.2.5 full suite | 1,222 passed, 3 failed, 2 skipped | 1 | Product assertions include three retained failures |
| FCoP library CI subset | 907 passed, 1 failed | 1 | `parent` persistence/readback gap |
| FCoP MCP CI subset | 78 passed, 2 failed | 1 | report lifecycle and tool-surface snapshot gaps |
| CodeFlowMu Protocol | 8/8 | 0 | Five valid and three expected-invalid fixtures |
| CodeFlowMu Runtime | 1,420 passed, 1 failed, 1 skipped | 1 | One retained human-prompt contract mismatch |
| CodeFlowMu Shell | 770/770 | 0 | Full isolated Shell snapshot |
| Protocol / Runtime / Shell type checks | all passed | 0 | Static checks only |
| WP-13 V3 validation | passed | 0 | 23/23 internal hashes and structured-data checks |

Two FCoP stdout files were normalized into decodable UTF-8 and contain U+FFFD replacement characters. Counts, exit codes, and identified failure names remain intact, but the package does not claim byte-for-byte preservation of the original process output.

# 6. C01–C14 Product Results

| ID | S0.5 criterion | Reader | Product | Product evidence boundary |
|---|---|---:|---:|---|
| C01 | Schema validation | PASS | PARTIAL | Selected positive and negative schema paths ran; the full canonical object surface did not. |
| C02 | Primary carrier and immutability | PASS | **FAIL** | FCoP `parent` was accepted on the write surface but not closed through persistence/readback and published surface snapshots. |
| C03 | Duplicate identity | PASS | PARTIAL | Duplicate/conflict mechanisms exist; canonical product quarantine output is incomplete. |
| C04 | Stream continuity and asynchronous progress | PASS | PARTIAL | Ordering and dependency mechanisms ran without a complete canonical partial-order graph. |
| C05 | Role authority | PASS | PARTIAL | Role gates ran; complete S0.5 authority issue/judgment output did not. |
| C06 | Lifecycle legality | PASS | PARTIAL | Lifecycle controls ran; the complete required three-valued canonical outputs did not. |
| C07 | Separation of duties and human control | PASS | **FAIL** | Human-control structure exists, but one mandatory prompt-contract assertion failed. |
| C08 | Integrity tampering | PASS | NOT RUN | Adjacent hashes do not substitute for the product criterion. |
| C09 | Missing reference | PASS | PARTIAL | Failure visibility exists; canonical `undetermined` propagation is incomplete. |
| C10 | Prohibited cycle | PASS | PARTIAL | Local cycle detection passed; canonical affected-subgraph isolation did not run. |
| C11 | Deterministic reconstruction | PASS | NOT RUN | Only the Reference Reader performed the required permutation-equivalent reconstruction. |
| C12 | Conflict preservation | PASS | NOT RUN | Adjacent conflict mechanisms exist; the exact product criterion did not run. |
| C13 | Recovery | PASS | PARTIAL | File-fact recovery is demonstrated; complete fresh-reader reconstruction is not. |
| C14 | Terminal-history preservation | PASS | **PASS** | Product tests support retained terminal history and authorization behavior. |

Product aggregate: **1 PASS / 8 PARTIAL / 3 NOT RUN / 2 FAIL**. The aggregate is not conformant.

# 7. Retained Failure Analysis

## 7.1 C02 — FCoP `parent` closure

The FCoP failures are not treated as a failure of the FCoP protocol definition itself. They show a reference-implementation release-consistency gap: the optional `parent` field appears on the current API/MCP surface, but round-trip persistence/readback and stored public-surface snapshots are not all synchronized. Until the same object survives the complete write–persist–read path and surface snapshots are updated under release control, C02 remains FAIL.

## 7.2 C07 — human-adjudication prompt contract

The CodeFlowMu Runtime test expected either `需 ADMIN 人工裁定` or `需人工裁定`. The actual readable output was `需 ADMIN/PM 人工裁定`. Structured fields remained valid—`decision=needs_human`, `fact_check_verdict=needs_admin`, and `awaiting_pm_decision=true`—and lifecycle did not advance.

The failure is therefore a wording-contract mismatch, not Chinese encoding damage. The raw mandatory assertion failed, so C07 remains FAIL until the product and test owners decide whether `ADMIN/PM` is an intended product contract or the test expectation is stale, make the corresponding change, and rerun the complete Runtime acceptance suite.

# 8. WP-13 Multi-Agent Evidence-Gating Case

WP-13 asks whether a multi-agent governance chain can prevent an unverified completion claim from becoming an authoritative delivery fact. A DEV subexecution ended with completion-meaning language while exit status, tests, commit, and formal report were not all confirmed. PM checked persistent facts, withheld release, and did not dispatch QA. After tool recovery, DEV completed the same task, produced commit `609571dd…` and a formal report, and role-separated QA reran 27 tests, type checking, and diff checks successfully.

```text
completion-meaning claim
        ↓ persistent evidence incomplete
PM fact check → hold / do not release / do not dispatch QA
        ↓ same-task recovery
DEV commit + report
        ↓ separate role
QA rerun and report
        ↓
candidate evidence for authorized decision
```

At the first observation point, “WP-13 is complete” was neither established as `valid` nor proved `invalid`; the appropriate S0.5 analytical judgment was `undetermined`. This is a retrospective TMPA projection. The native application did not emit the complete canonical S0.5 Reader envelope.

The case demonstrates governance containment, role separation, same-task recovery, and evidence completion. It does not prove elimination of hallucinations, independent validation, terminal approval within the original snapshot, cryptographic provenance, or independently adopted TMPA conformance.

The V3 package records `runtime_bound: false`; its snapshot ends while TASK-019/020 are still `review / pending`. Gate C acceptance occurred later and remains a separate lifecycle fact. “DEV complete,” “QA pass,” “Gate C accept,” “done,” and “archive” must not be collapsed.
