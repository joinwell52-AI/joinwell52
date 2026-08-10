# 4. Executed Test Baseline

All primary product and full-suite runs were author-executed against fixed inputs. Skipped tests remain skips.

| Track | Result | Exit | Interpretation |
|---|---:|---:|---|
| S0.6 product C01–C14 | 14 PASS / 0 FAIL / 0 PARTIAL / 0 NOT RUN | 0 | Direct CodeFlowMu product Reader execution |
| CodeFlowMu internal TMPA | 23/23 | 0 | Includes explicit S0.5 compatibility and S0.6 regressions |
| CodeFlowMu Protocol | 5 valid + 3 expected-invalid fixtures | 0 | Product protocol tests, separate from TMPA verdict |
| Protocol / Runtime / Shell type checks | all passed | 0 | Static checks only |
| CodeFlowMu Runtime | 1,485 passed, 0 failed, 1 skipped | 0 | Full author-local Runtime run |
| CodeFlowMu Shell | 777 passed, 0 failed | 0 | Full author-local Shell run |
| FCoP locked reference baseline | 1,210 passed, 2 skipped | 0 | Reference implementation, not protocol proof |
| Public reproducer | `npm ci` + 14/14 product PASS | 0 | Self-contained conformance-slice rerun |

The final conformance result validates against the S0.6 result schema. It records `product_reader_called: true`, `reference_reader_called: false`, implementation `codeflowmu/V1.6.0`, and evidence level `demonstrated`.

# 5. C01–C14 Product Results

| ID | S0.6 criterion | Verdict | Executed observation |
|---|---|---:|---|
| C01 | Schema validation | **PASS** | All four published S0.6 schemas compile; malformed structural and asserted `date-time` cases are rejected deterministically. |
| C02 | Primary carrier and immutability | **PASS** | Content-addressed revisions remain attributable, primary-carrier conflicts do not gain authority, and corrections remain separate evidence. |
| C03 | Duplicate identity and provenance | **PASS** | Different-content duplicates are quarantined; byte-identical observations project one node while retaining every deterministically ordered `source_id`. |
| C04 | Serial continuity and asynchronous progress | **PASS** | Stream gaps and duplicate sequences stay explicit, unrelated streams progress, and arrival order does not change output. |
| C05 | Role authority | **PASS** | Denied and undetermined authority branches remain distinct and cannot mutate reconstructed state. |
| C06 | Lifecycle legality | **PASS** | Illegal transitions are rejected; missing independent acceptance leaves completion undetermined and prevents advancement. |
| C07 | Separation of duties and human approval | **PASS** | Wrong approval type, missing assignment, disallowed role, missing approval decision, and self-approval remain `pending_human`; a valid assigned independent approval clears the gate. |
| C08 | Integrity tampering | **PASS** | Covered-content tampering emits `INTEGRITY_MISMATCH`, excludes the object from authoritative nodes, and retains the failed source. |
| C09 | Missing reference | **PASS** | Missing dependencies and claim evidence remain visible and propagate an undetermined result without inventing facts. |
| C10 | Prohibited cycle | **PASS** | Only the affected prohibited-cycle subgraph is quarantined; unrelated valid nodes remain usable. |
| C11 | Deterministic reconstruction | **PASS** | Fixed-source permutations are byte-equivalent; canonical order is Unicode code-point order, including U+E000 before U+10000. |
| C12 | Conflict preservation | **PASS** | Contradictory reviews remain disputed until an authorized resolver acts; unauthorized decisions remain evidence but cannot clear the conflict. |
| C13 | Recovery | **PASS** | A fresh Reader reconstructs lifecycle, responsibility, dependencies, failures, recovery actions, and parent-child state consistently. |
| C14 | Terminal-history preservation | **PASS** | Only the accepted authorized chain reaches archive, while the prior task/report/review/transition history remains reconstructable. |

# 6. S0.5 to S0.6 Product Delta

## 6.1 C03 — aggregation without provenance loss

I0.7 demonstrated conflict handling for same-ID, different-content candidates. S0.6 adds a second boundary: multiple byte-identical observations must not create duplicate nodes, but aggregation must not erase where those observations came from. V1.6.0 emits one canonical node with the complete, code-point-sorted `source_ids` list.

## 6.2 C07 — approval is an authorized governance object

The S0.5 baseline demonstrated role separation and a high-risk human gate. S0.6 makes the authorization contract directly testable. An approval counts only when its object type is permitted, the actor has a matching Assignment, the role is allowed, the body carries an approval decision, and the actor is independent when the Profile requires it. Four negative branches remain pending rather than being treated as implicit approval.

## 6.3 C11 — deterministic means locale-independent

S0.6 removes environmental ambiguity from canonical sorting. V1.6.0 replaces locale-dependent comparison with Unicode code-point ordering throughout object keys, sources, graph traversal, issues, and output collections. The U+E000/U+10000 fixture detects the UTF-16 code-unit ordering mistake that can otherwise pass ordinary ASCII tests.

## 6.4 Compatibility boundary

CodeFlowMu's internal suite includes an explicit S0.5/I0.7 compatibility path. I0.7 remains the exact historical S0.5 product result; I0.8 does not rewrite its inputs, criteria, product version, or evidence package.

# 7. Public Reproducer

The formal archive contains a 29-file self-contained reproducer with a package lock, the product Reader, Protocol Validator, Profile, Fixtures, Runner, and exact official inputs. It requires Node.js 22 or newer and public npm registry access:

```text
cd public-reproducer
npm ci
npm test
```

The test first verifies all seven upstream SHA-256 values, then calls the bundled CodeFlowMu `GovernanceReader`. The recorded clean-copy run and publication preflight both produce 14 PASS / 0 FAIL. The reproducer makes the conformance slice publicly inspectable without asserting that the private mother repository or full application is public.

# 8. Retained WP-13 Evidence-Gating Case

WP-13 remains relevant to the engineering interpretation but is not rerun in I0.8. It records a role-separated workflow in which a completion-meaning claim was held until persistent evidence, a formal report, and QA verification existed. A later Gate C decision accepted delivery while activation, push/publication, and archive remained separate decisions.

This case supports evidence gating, staged authority, and same-task recovery. It does not prove hallucination elimination, universal false-claim detection, or S0.6 conformance. The C01–C14 result comes from the V1.6.0 product bundle, not from WP-13.
