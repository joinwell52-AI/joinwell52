---
title: "Runtime Semantics: Public Evidence Pack for Three Articles"
date: '2026-08-27'
---

# Runtime Semantics: Public Evidence Pack for Three Articles

Status: **Published**. This page accompanies the three Runtime-semantics articles dated 2026-08-27. The material is deidentified and inspectable. R1 includes a Windows-specific public probe plus a recorded deidentified result; R2 and R3 include network-free public Readers and checks.

The purpose is not to certify the whole system. It is to let readers inspect the samples, rules, expected outputs, and non-generalization boundaries behind the published claims.

## 1. What the pack contains

| Article | Public material | What it can answer | What it cannot answer |
| --- | --- | --- | --- |
| Agent cancellation / child-process article | Public two-level Windows Node process-tree probe, deidentified recorded result, result-check | Whether `taskkill /T /F` on one observed Windows host made both a wrapper and one direct child disappear in that sample; readers can also rerun the same contract on their own Windows host | Arbitrary-depth trees, escaped descendants, privilege boundaries, containers, or remote workers |
| Review / REPORT association article | 10 deidentified REPORT association records, public Reader, check script | How explicit task keys classify the sample as `linked / missing / conflict` | Failure rate, report truthfulness, business acceptance, or current product quality |
| Green-status / UI projection article | 5 deidentified Session observations, public Reader, check script, projection counterexample matrix | Whether the five disclosed observation semantics can be independently reproduced and which UI facts must remain orthogonal | Certification of all desktop, PWA, viewer-authority, and end-to-end delivery paths |

This pack does not publish task bodies, agent content, prompts, absolute paths, usernames, real Session IDs, credentials, or user project files.

---

## 2. R1 | Windows cancellation and stop evidence

This section supports the agent-cancellation / child-process article.

### Experiment contract

A wrapper process starts one long-lived direct child in a fresh temporary directory. After both PIDs are observed, the experiment runs:

```text
taskkill /PID <wrapper> /T /F
```

and checks within three seconds whether the wrapper and direct child remain observable.

The recorded controlled-host result is:

| Check | Result |
| --- | --- |
| wrapper and direct child observable before termination | yes |
| `taskkill /T /F` exit code | `0` |
| wrapper exit observed | yes |
| direct child exit observed | yes |
| result | `PASS` |
| `kernel_containment_proven` | `false` |

Public artifacts:

- [2026-08-27-r1-windows-taskkill-tree-probe.cjs](/assets/evidence/2026-08-27-r1-windows-taskkill-tree-probe.cjs)
- [2026-08-27-r1-windows-taskkill-recorded-result.json](/assets/evidence/2026-08-27-r1-windows-taskkill-recorded-result.json)
- [2026-08-27-r1-windows-taskkill-recorded-result-check.mjs](/assets/evidence/2026-08-27-r1-windows-taskkill-recorded-result-check.mjs)

The deidentified recorded result explicitly preserves the claim boundary:

```json
{"status":"PASS","scope":"windows_taskkill_tree_probe_only","wrapper_exit_observed":true,"child_exit_observed":true,"termination_exit_code":0,"kernel_containment_proven":false}
```

### Two checks must not be confused

To validate the published record itself:

```text
node 2026-08-27-r1-windows-taskkill-recorded-result-check.mjs
```

Expected output:

```json
{"fixture":"deidentified_windows_taskkill_tree_probe_result","status":"PASS","kernel_containment_proven":false}
```

That checks the structure and claim boundary of the published record. It does not rerun the operating-system experiment.

To rerun the `taskkill /T /F` experiment, use **Windows**:

```text
node 2026-08-27-r1-windows-taskkill-tree-probe.cjs
```

The probe creates a temporary wrapper plus direct child, waits until both are observable, invokes `taskkill /T /F`, and then checks the two PIDs separately. On non-Windows systems it refuses to run instead of reporting a false PASS.

Even another PASS establishes only that the two known PIDs in this public contract were observed to exit. It does not prove that the execution tree was a kernel-bounded closed set. Escaped children, transient intermediates that create grandchildren, deeper descendants, different privileges, containers, and remote workers require separate counterexamples.

---

## 3. R2 | Explicit REPORT-to-TASK association

Public artifacts:

- [2026-08-27-r2-report-association-fixture.json](/assets/evidence/2026-08-27-r2-report-association-fixture.json)
- [2026-08-27-r2-association-reader.mjs](/assets/evidence/2026-08-27-r2-association-reader.mjs)
- [2026-08-27-r2-association-reader-check.mjs](/assets/evidence/2026-08-27-r2-association-reader-check.mjs)

### Classification rule

```text
action.task_id and ledger.task_id both exist and match  → linked
action.task_id is absent                               → missing
both exist but disagree                                → conflict
```

Filename similarity, nearby timestamps, role, model inference, and "choose the newest record" are not allowed to create the relationship.

The 10-record fixture produces `linked = 4`, `missing = 4`, and `conflict = 2`.

The fixture was deidentified from fixed first-party historical records while preserving task-key equality, absence, and disagreement. The original JSONL SHA-256 values are:

- `47dda7d8cd18b2a11241854823964d9e0a67298535de06e04f2acb807459ac11`
- `45cd1d3b4ffc088574d08df48de3ad5db6fd5a99b288005c7a048f2a7355342b`

Run:

```text
node 2026-08-27-r2-association-reader-check.mjs
```

Expected output:

```json
{"fixture":"deidentified_historical_association","counts":{"linked":4,"missing":4,"conflict":2},"status":"PASS"}
```

The public Reader exists to reproduce the disclosed rule over the disclosed fixture; it is not a simulator for the complete Runtime.

---

## 4. R3 | UI status projection: five facts must not collapse into one green state

This section supports the article *What Does a Green Agent Status Actually Mean?*

The first-party source path distinguishes five mutually exclusive Session observations. One targeted source test contains **five classification assertions**. Earlier shorthand of "1/1" referred to one passing test case; it should not be read as one tested status or as an end-to-end UI regression.

### Disclosed classification contract

| Observation | Output | The UI must not promote it into |
| --- | --- | --- |
| Session `running` + live + progress | `executing_with_progress` | delivered |
| Session `running` + live + no fine-grained progress | `executing_without_fine_progress` | failed |
| Session `running` + not live | `session_without_live_execution` | actively progressing |
| Session `completed` + formal REPORT not yet written | `completed_waiting_report` | accepted delivery |
| Session `failed` / `session_lost` | `technical_error` | business rejection |

### Public deidentified reproducer

- [2026-08-27-r3-ui-status-projection-fixture.json](/assets/evidence/2026-08-27-r3-ui-status-projection-fixture.json)
- [2026-08-27-r3-ui-status-projection-reader.mjs](/assets/evidence/2026-08-27-r3-ui-status-projection-reader.mjs)
- [2026-08-27-r3-ui-status-projection-check.mjs](/assets/evidence/2026-08-27-r3-ui-status-projection-check.mjs)

The fixture contains five deidentified inputs, one for each disclosed class. The public Reader reproduces the disclosed decision order. The check script verifies `actual === expected` for all five records and also checks per-class counts.

Run:

```text
node 2026-08-27-r3-ui-status-projection-check.mjs
```

Expected output:

```json
{"fixture":"deidentified_runtime_session_observation","assertions":5,"status":"PASS"}
```

The distinction is important: **the public Reader is an independent reproducer of the disclosed contract, not the private production source. Five public assertions do not certify every desktop, PWA, authorization-filter, or end-to-end delivery path.**

### Projection counterexample matrix

| Combination | Acceptable projection |
| --- | --- |
| viewer is not owner, but may read and a fresh local session exists | show actual execution from the canonical source; do not hide it merely because the viewer is not owner |
| Gateway online, managed-job heartbeat stale | show connectivity and job liveness separately; do not translate online into executing |
| workflow `done`, evidence association conflicted | preserve both `done` and evidence conflict |
| runtime / disk / context identity disagree | publish `projection_conflict` / unknown, not online |

These combinations test orthogonality: viewer authority, connectivity, Session liveness, progress, REPORT arrival, and lifecycle answer different questions.

---

## 5. Independent checks

None of the public checks needs access to the private repository. The real R1 probe requires Windows; the R1 record-check, R2, and R3 require only Node.

R1 published-record check:

```text
node 2026-08-27-r1-windows-taskkill-recorded-result-check.mjs
```

R1 Windows rerun:

```text
node 2026-08-27-r1-windows-taskkill-tree-probe.cjs
```

R2:

```text
node 2026-08-27-r2-association-reader-check.mjs
```

R3:

```text
node 2026-08-27-r3-ui-status-projection-check.mjs
```

A reviewer should confirm that:

1. R1 `PASS` is not expanded into arbitrary process-tree containment;
2. the R1 public probe and recorded result are different evidence objects: one can rerun the experiment, the other preserves a prior host observation;
3. R2 deidentification preserves equality, absence, and conflict relations;
4. R3's five public assertions are not expanded into complete UI / PWA certification;
5. `technical_error` is not rewritten as business failure, and `completed_waiting_report` is not rewritten as formal acceptance;
6. cancellation request, command exit code, PID disappearance, Gateway, Session, progress, REPORT, lifecycle, and evidence association do not sign for one another.

## 6. Overall evidence boundary

This pack is a collection of **reviewable engineering slices**, not product certification and not a large-sample statistical benchmark.

- R1: one prior Windows-host two-level sample plus a public same-contract probe;
- R2: 10 deidentified historical association records;
- R3: 5 semantic classification inputs plus a projection counterexample matrix.

All conclusions in the three articles must therefore remain scoped to the corresponding samples, rules, versions, and public artifacts. The value of the pack is not to make the system appear all-green. It is to make three categories visible: **what was observed, what can be rerun, and what remains unproven.**
