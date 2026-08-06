---
schema: "publication-candidate-article/v1"
title: "A Revisable Work Graph Still Needs Authority Beyond Graph Readiness"
date: "2026-08-06"
column: "digital-employee"
category: "daily"
summary: "A computer-use Digital Employee can represent long work as a revisable DAG, but entry into the ready frontier proves dependency readiness, not permission, isolation, or acceptance of consequential effects."
sources:
  - "research/analysis/Q-20260806-01-revisable-dag-computer-use.md"
  - "research/reading/Q-20260806-01-revisable-dag-computer-use.md"
item_id: "Q-20260806-01"
lifecycle: "Publication Candidate"
source_research_object: "research/analysis/Q-20260806-01-revisable-dag-computer-use.md"
source_reading_result: "research/reading/Q-20260806-01-revisable-dag-computer-use.md"
visualization: "staging/publication-candidates/2026-08-06-governed-revisable-work-graph.svg"
visualization_decision: "Required — governed work-graph architecture diagram included"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: false
---

# A Revisable Work Graph Still Needs Authority Beyond Graph Readiness

A computer-use Digital Employee can represent long work as a revisable DAG: a manager maintains dependencies, dispatches ready nodes, and rewrites pending work when execution exposes new dependencies. This is more inspectable than a one-time plan hidden in a prompt and better suited to long-horizon, partially observable work.

## Central judgment

**Graph readiness proves that dependencies are satisfied; it does not prove that execution is authorized.** A node that can change files, operate a business system, or create an external effect also needs independent permission, resource-isolation, application-ownership, and evidence gates.

## Source

The sole analytical input is the same-day Research Object authorized for Production. Its evidence boundary points to a completed Reading Result. Production did not return to the Signal Pool or Reading Result to conduct new research and did not introduce new factual material.

## Observation

The Research Object preserves three structural observations: the work graph can be persisted and revised during execution; independent ready nodes can run concurrently; and findings or files may need to be carried forward when later workers cannot re-observe the original interface. It also preserves counter-evidence: performance gains are not uniform, one benchmark is slower than the single-agent configuration, and the manager remains a potential bottleneck and interpretation authority.

## Comparison

| Planning form | Visible runtime state | Parallelism | Authority and evidence | Recovery boundary |
|---|---|---|---|---|
| Hidden linear plan | Low; mostly inside context | Weak | Usually mixed with the execution narrative | Difficult to replay |
| Revisable DAG | Graph versions, nodes, and dependencies are visible | Ready-frontier scheduling | The graph does not prove permission or acceptance | Partial reconstruction from snapshots and logs |
| Governed work graph | Orchestration state is separated from protocol state | Only nodes without data, resource, or side-effect conflicts run together | Every node carries authority limits, an evidence contract, and independent acceptance | Rebuild from events and receipts for already committed effects |

The first two rows summarize mechanisms described by the Research Object. The third is a Research Center engineering synthesis, not a capability already implemented or validated by the source.

## Discussion

The important change is not “more agents.” It is making the plan a versioned, inspectable, replayable runtime projection. That projection must not replace task truth, approval rights, or completion evidence. A manager may issue a completion claim, but graph state cannot authorize the manager to approve its own interpretation.

Parallelism also requires more than data independence. Two nodes may have no explicit dependency and still contend for the same browser session, business record, file path, or external account. A consequential ready frontier must combine dependency readiness with authority conditions.

## Engineering impact

For Digital Employees, a WorkOrder should project a versioned graph whose nodes declare responsibility, dependencies, required skills, authority boundaries, expected artifacts, and completion evidence. Every graph mutation should record actor, reason, before-and-after version, and affected pending nodes.

For CodeFlowMu, FCoP TASK/REPORT/REVIEW state should remain authoritative while the mutable project graph serves orchestration. Graph versions, mutation events, node evidence receipts, and recovery projections should come before unrestricted parallel computer-use execution.

## Boundaries and counter-evidence

The evidence is bounded to a June 2026 preprint and related implementation material. It does not establish enterprise authorization, transaction boundaries, safe concurrent side effects, crash-exact recovery, or independent completion acceptance. Some evaluations use LLM or rubric judges, and the parallel configuration is not faster on every benchmark.

## Future work

The next tests should define a minimum graph-mutation contract, combine permission and dependency readiness, determine whether completed nodes remain valid after downstream rewiring, and distinguish safe replay from an external effect that already occurred.

## Visualization note

The visual separates the revisable graph, ready frontier, authority gate, and evidence acceptance. It is a Research Center synthesis based on the Research Object and does not encode unsupported quantitative results.

## Evidence and references

1. [Research Object](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260806-01-revisable-dag-computer-use.md): the sole analytical input, including judgment, uncertainty, counter-evidence, and engineering impact.
2. [Reading Result](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260806-01-revisable-dag-computer-use.md): the evidence boundary and source-traceability record declared by the Research Object; this article does not re-analyze it.

> Editing status: bilingual structure, evidence boundaries, non-uniform performance, and central-manager risk were checked; not published.
