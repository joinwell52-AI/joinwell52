---
title: "Three Agents Returned Three Reports. How Do You Keep Acceptance from Charging the Wrong Task?"
date: '2026-08-20'
column: digital-employee
category: daily
article_type: project-research
edition: research-center
research_question: "How can a multi-Agent acceptance system prove which task and execution attempt each report belongs to without guessing from prose?"
summary: "Display may assist with parenting, but acceptance must verify task identity, execution attempt, supersession, and independent QA. The article defines the three-field gate’s limits and a safer artifact-version contract."
item_id: "MANUAL-20260820-REPORT-ATTRIBUTION"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-20-report-attribution-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
sources:
  - research/manual-runs/2026-08-20-guided-article-pipeline-round1/02-source-register.md
  - research/manual-runs/2026-08-20-guided-article-pipeline-round1/02-fact-claim-matrices.md
  - research/manual-runs/2026-08-20-guided-article-pipeline-round1/02-article-briefs.md
  - research/manual-runs/2026-08-20-guided-article-pipeline-round1/02-experiment-run-log.md
  - research/manual-runs/2026-08-20-guided-article-pipeline-round1/02-independent-editorial-review-round4.md
  - research/manual-runs/2026-08-20-guided-article-pipeline-round1/03-independent-visual-package-review.md
---

<ArticleCover
  image="/assets/covers/daily-2026-08-20-report-attribution-cover.png"
  kicker="Digital Employee · Project Research"
  title="Three Agents Returned Three Reports. How Do You Keep Acceptance from Charging the Wrong Task?"
  summary="Display may assist with parenting, but acceptance must verify task identity, execution attempt, supersession, and independent QA."
  version="MANUAL-20260820-REPORT-ATTRIBUTION"
  status="Independent Editorial PASS · 2026-08-21"
  languageHref="/zh/digital-employee/2026-08-20-report-attribution"
  languageLabel="中文"
/>

# Three Agents Returned Three Reports. How Do You Keep Acceptance from Charging the Wrong Task?

A development agent, a QA agent, and an operations agent return reports at almost the same time. All three say “success,” so the system produces a reassuring summary: implementation complete, tests passed, deployment healthy.

But QA tested the pre-rework version. The operations report belongs to a different root task in the same thread. The developer report’s filename contradicts the task identifier in its metadata. No file is missing; three real artifacts have been assembled into a delivery that never existed.

The remedy is not another language model reading the prose. The runtime must bind each receipt to a unique task and execution attempt, keep display placement separate from acceptance ownership, and stop when ownership remains ambiguous. This article gives you an identity gate, a report-version state model, and a final-summary checklist that can be applied to your own Agent runtime.

## A report can exist without belonging to this task

Multi-agent systems often use four convenient association rules:

1. attach reports to the same chat thread;
2. attach them to the most recent task;
3. scan the body for a task identifier;
4. match the sender role—for example, attach a DEV report to the nearest development task.

These rules can organize a screen, but none is sufficient for acceptance. A thread may contain multiple root tasks. A rework report may discuss the rejected predecessor. A body can mention both a parent and a child. An old report may be discovered only after a watcher restarts.

Choosing the “most likely” task produces a plausible tree, not deterministic evidence ownership.

## A report needs several identities

CodeFlowMu currently uses four kinds of attribution information:

| Identity | Purpose | Typical failure |
|---|---|---|
| report file identity | identifies this receipt occurrence | filename sequence points to another task |
| `task_id` | declares the direct work owner | still points to the pre-rework task |
| `parent_task_id` | places the report in the task tree | attaches to the root instead of the worker child |
| `references` | preserves related tasks and historical links | treats “mentioned” as “directly owned by” |

Direct ownership and historical relevance are different relationships.

If a developer reworks `TASK-042-REWORK-01`, the report may retain `TASK-042` in `references` to explain why rework occurred. Its direct `task_id` should identify the current rework task. A resolver that scans references without respecting the direct owner can let the predecessor steal the new report.

## Consequential receipts need a hard gate

For one consequential DEV receipt path, CodeFlowMu implements a strict three-way check in [`reportAttribution.ts`](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/pm/reportAttribution.ts):

```text
TASK inferred from the REPORT filename
        ==
frontmatter.task_id
        ==
references[0]
```

Example:

```yaml
filename: REPORT-20260820-042-DEV-to-PM.md
task_id: TASK-20260820-042
references:
  - TASK-20260820-042
```

If the filename identifies 043 while the explicit task and first reference identify 042, attribution fails. The gate does not take a two-out-of-three vote. Missing explicit identity also fails.

This boundary needs precision. It is an application-level CodeFlowMu rule for a key DEV acceptance path, not a universal FCoP naming rule for every report and every role. FCoP defines report envelopes and references; a host runtime may add stricter contracts for consequential workflows.

The check rejects disagreement. It cannot detect three fields that all repeat the same wrong task identifier—for example, when a model copies an old template and changes nothing. A stronger target design lets the Agent submit only the report body and evidence; the runtime injects the filename, direct owner, parent, execution attempt, and logical event sequence from the active execution context. That is a design recommendation, not a claim that every current CodeFlowMu report path already provides this envelope-injection contract.

![Task identity and execution attempt bind development facts and QA verification; supersession selects the effective artifact and isolates the wrong owner](/assets/covers/daily-2026-08-20-report-attribution-figure-1.png)

*Figure 1. Attribution from task identity and execution attempt through supersession and QA. Source: author synthesis from the pinned CodeFlowMu implementation and W3C/OpenTelemetry identity-propagation boundaries. Runtime injection of all authoritative metadata remains a target contract.*

## Propagate identity—but do not confuse tracing with acceptance

Distributed systems already use explicit correlation. W3C [Trace Context](https://www.w3.org/TR/trace-context/) carries a `trace-id` across services. Its `parent-id` identifies the caller’s operation for the incoming request; a downstream participant replaces it with the identifier of its current operation when propagating context. The OpenTelemetry [Tracing API](https://opentelemetry.io/docs/specs/otel/trace/api/) gives each span at most one parent; parent and child share a TraceId and form a causal tree.

The useful lesson for agent work is that task identity and parentage should travel with execution. They should not be reconstructed from prose after a report arrives.

The analogy then stops. A trace proves correlation, not correctness. An ended span is not a business acceptance. Agent systems should preserve the same separations:

```text
correct correlation
      ≠
truthful report content
      ≠
independent verification
      ≠
business acceptance
```

## Display may make a best effort; acceptance may not guess

CodeFlowMu’s [`reportParenting.ts`](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/ledger/reportParenting.ts) must handle incomplete historical data. It prefers explicit `source_task_id` or `task_id`. When those are absent, it can inspect references, filename sequence, body overlap, and recent open tasks to place a report in a useful ledger view.

That best-effort reconstruction is valuable: legacy reports do not all become orphans.

It is unsafe as an acceptance rule. Two tasks can mention the same module. “Most recent” is a timing coincidence. One role can own several concurrent tasks.

The system therefore needs two outputs:

```text
display_parent = best_effort_match(...)
acceptance_owner = deterministic_contract_or_undetermined(...)
```

The display parent may be labeled as inferred and corrected by a human. The acceptance owner must be unique, or `undetermined`. Uncertainty is not a failure to be hidden; it is the result that prevents false accounting.

## A thread cannot be the parent when it has multiple roots

One conversation can handle defect A and later introduce independent feature B. If reports carry only the shared `thread_key`, an old final report can be reused by the new root.

The current parenting code partitions a thread with multiple ADMIN roots by lineage and task prefix. A report enters a root bucket only when references or parentage uniquely identify it. Otherwise it remains isolated rather than attaching to the first root in the thread.

This improves ledger reconstruction; it cannot recover identity that was never recorded. Some legacy artifacts require an authorized human decision. A tidy tree is not worth invented certainty.

## Two reports for one task need an explicit winner

The same task may produce a failed report, a corrected report, and a retry after restart. Overwriting the old file destroys evidence. Treating every file as equally current lets an obsolete failure or success leak into the final summary.

CodeFlowMu's current ledger can read `submission_attempt`, `revision_of`, `supersedes`, and `superseded_by`, while the summary gate excludes reports marked invalid or superseded. These are useful building blocks. They do not prove that every report writer automatically increments attempts or that every competing report is uniquely arbitrated.

A complete target contract needs three separate identities:

```text
task identity
    └── execution attempt 1
          ├── report v1 ── rejected
          └── report v2 ── effective, supersedes v1
    └── execution attempt 2 ── starts only after an explicit retry decision
```

Use the logical event sequence, attempt identity, and explicit supersession relationship to decide which receipt is effective. File modification time can help an operator investigate, but it should not be the sole judge.

## Correct attribution still does not authorize a final summary

Even after a developer report is attached to the right task, a project manager cannot automatically declare success. [`PmSummaryGate`](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/pm/PmSummaryGate.ts) also checks whether downstream children are settled; whether an effective worker report exists; whether it postdates the task; whether product work has the required QA report; whether QA returned PASS; whether required browser evidence exists; and whether an effective final summary already exists.

An empty diagnostics list is not attribution success. A DEV report is not QA. A PM summary is not final business acceptance.

This is the engineering value of TMPA’s fact/acceptance separation: executors submit facts, verifiers examine facts, and authorized roles decide acceptance. A single `status: done` field must not merge all three.

Time also needs a boundary. Current compatibility paths can use explicit artifact timestamps and, for older files, filesystem modification time. Git checkout, archive extraction, cross-device copy, or clock skew can all change physical timestamps. Consequential acceptance should therefore prefer logical sequence, execution attempt, and explicit supersession; wall-clock time remains supporting evidence.

## What 44 passing tests cover

For this article we pinned CodeFlowMu Open commit `ed5634c718b9e238c44bb70851020c9793546fe6` in an isolated worktree and reran the parenting, attribution, and summary-gate suites. The result was **44 of 44 tests passing**.

The cases include a filename identifying task 003 while metadata and references identify 002; missing task identity; a valid three-way match; a rework report staying with its explicit current owner even when it references a predecessor; two roots in one thread; a late report that predates its child task; missing or failing QA; missing browser evidence; and a zero-diagnostic state that still fails because attribution is invalid.

The tests also confirm that best-effort parenting uses body and recent-task fallbacks. We therefore do not claim that every historical CodeFlowMu report is determined exclusively by the three-way gate. The accurate boundary is: compatibility logic helps organize incomplete data; consequential acceptance paths use stricter contracts.

The suite does not prove that three consistently wrong identifiers will be detected, that every writer injects authoritative metadata, or that clock skew and competing attempts are fully arbitrated. Those remain explicit next-test targets.

## Six failure cases to copy

### Identifier mismatch

Make the filename, explicit task, and first reference disagree. Expected: attribution fails; the original artifact and conflict evidence remain intact.

### Consistently wrong identifiers

Copy an old report template so that the filename, `task_id`, and first reference all agree on the wrong task. Expected target behavior: runtime-owned execution context overrides or rejects model-authored identity. A three-way equality check alone is insufficient.

### Late old report

Create a report before the target child exists, then discover it after a watcher restart. Expected: it may appear as historical evidence, but cannot satisfy the current child’s report requirement.

### Repeated submission for one task

Submit v1, reject it, then submit v2 for the same task. Expected: both artifacts remain auditable, v2 explicitly supersedes v1, and only one version is effective for the current attempt.

### Multiple roots in one thread

Place two independent roots under one `thread_key` and supply no lineage. Expected: `undetermined`, not first-root or newest-root attachment.

### Missing or failed QA

Provide a correctly attributed DEV report and valid code, but omit required QA or set the verdict to FAIL. Expected: no successful final summary and no downstream publication release.

## A report and summary checklist

At task execution:

1. Put task, parent, and execution-attempt identity into the runtime context when work is claimed.
2. Let the Agent submit body and evidence; let the runtime inject the filename and authoritative metadata.
3. Store the direct owner separately from historical references.
4. Record sender role, attempt identity, logical event sequence, and physical timestamp.
5. Give rework a new attempt identity and an explicit supersession link while retaining predecessor references.

At report intake:

6. Parse explicit identity before running heuristic matching.
7. Return undetermined when candidates tie.
8. Preserve the original file, parse result, and conflict reason.
9. Clearly label inferred display placement as unusable for acceptance.

Before final summary:

10. Use logical sequence, attempt identity, and supersession to select the effective report; use physical time only as supporting evidence.
11. Verify role, owner, and required evidence.
12. Block success on missing, failed, or insufficient QA.
13. Store execution facts, verification decisions, and business acceptance separately.

## Limits and open questions

A consistent three-way identifier catches obvious cross-accounting. It does not prove truthful report content. A model can consistently repeat the wrong identity, so runtimes should inject task identity rather than ask models to generate it. The current sources do not prove that this injection contract is universal across CodeFlowMu report writers.

The body-matching heuristic has no measured false-association rate, and this article does not recommend it for acceptance. Cross-repository and cross-organization tasks also need namespaces or globally unique identities; a date plus a three-digit sequence can collide.

The 44 tests are first-party evidence from a pinned commit, not an external audit. A stronger next experiment would generate random task trees, copy consistently wrong metadata, create competing attempts, reorder reports, skew physical timestamps, duplicate watcher events, rebuild after restart, and measure undetermined, false-attachment, and missed-attachment rates.

## Conclusion

The most dangerous multi-agent reporting error is not always a missing artifact. It is a plausible artifact charged to the wrong task and then propagated into acceptance.

> A display may help a human find a report. An acceptance system has no authority to guess when ownership is unclear.

Propagate task identity and parentage with execution. Apply deterministic attribution to consequential receipts. Keep QA and final acceptance independent. Three reports can then remain three reviewable evidence chains instead of becoming one convincing false delivery.

## Primary sources

1. [W3C Trace Context](https://www.w3.org/TR/trace-context/)
2. [OpenTelemetry Tracing API](https://opentelemetry.io/docs/specs/otel/trace/api/)
3. [FCoP v3 Chinese specification, pinned commit](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/spec/fcop-v3-spec.zh.md)
4. [CodeFlowMu reportAttribution, pinned commit](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/pm/reportAttribution.ts)
5. [CodeFlowMu reportParenting, pinned commit](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/ledger/reportParenting.ts)
6. [CodeFlowMu PmSummaryGate, pinned commit](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/pm/PmSummaryGate.ts)
7. [CodeFlowMu LedgerBuilder, pinned commit](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/ledger/LedgerBuilder.ts)
8. [TMPA Core Specification S1.0, pinned commit](https://github.com/joinwell52-AI/joinwell52/blob/ae27de71b1a8809c2bd69acedc1482570d55a322/docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-zh.md)

Accessed 2026-08-20.
