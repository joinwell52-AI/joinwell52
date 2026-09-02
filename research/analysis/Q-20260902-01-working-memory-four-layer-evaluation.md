---
date: "2026-09-02"
status: ReadyForProduction
production_input_authorized: true
queue_item: Q-20260902-01
column: digital-employee
article_type: technical-analysis
project_relevance: none
source_reading: "research/reading/Q-20260902-01-working-memory-four-layer-evaluation.md"
---

# Research Analysis — Working-Memory Evaluation Beyond Token Budget

## Research question

What evidence is required to judge whether a long-running digital employee's working memory is effective and governable, when nominal capacity, stored state, delivered context, memory-management work, and task outcome can diverge?

## Research themes and subject kind

- **Themes:** working-memory governance; long-running agents; observability; adaptive-policy admission
- **Subject kinds:** research-finding; architecture-mechanism; governance-problem
- **Primary sample:** *Measure Before You Manage: Evaluating Agent Working Memory in Coding Agents* (arXiv:2608.31057)

## Research value

### Failure

A budget-only or outcome-only evaluation collapses several different propositions. A context-window limit does not show which state was retained. Stored state does not show what was delivered to a particular execution occurrence. Delivered context does not expose the work spent selecting or compressing it. A successful task does not prove that the memory path was correct, efficient, or safe under distribution shift.

### Findings

The source-reported study analyzes 55 archived coding-agent trajectories and separates four measurement layers: stored state, delivered context, management work, and task/process outcome. It reports semantic differences among memory objects, unequal delivery and management cost under nominally equal token budgets, and calibration gains that do not necessarily transfer to held-out tasks.

### Mechanism

The four-layer model changes the identity of evidence. Persistence claims attach to stored-state records; execution-context claims attach to occurrence-specific delivery records; efficiency claims require management-work evidence; and task claims attach to process and outcome records. A memory-policy change therefore needs versioned evidence at every affected layer rather than one aggregate token or success metric.

### Implication

A governed digital employee should treat adaptive memory policy as a versioned capability change. The system should record the memory objects involved, the policy/version that transformed them, the representation retained, the context actually delivered to each occurrence, the management cost, and the resulting process outcome. Evidence from one calibration distribution should not silently authorize a later policy on another distribution.

## Evidence claims

### E1 — source-reported-claim

**Claim:** The primary study reports an evaluation corpus of 55 archived coding-agent trajectories and uses it to examine semantically heterogeneous working-memory objects.

**Source:** arXiv:2608.31057 and the same-date Deep Reading note.

**Strength:** reports.

**Independent:** false. This is evidence reported by the primary research authors, not an independent reproduction.

### E2 — source-reported-claim

**Claim:** The study separates stored state, delivered context, management work, and task/process outcome as distinct measurement layers.

**Source:** same primary study.

**Strength:** reports.

**Independent:** false.

### E3 — source-reported-claim

**Claim:** Under the reported evaluation, equal nominal token budgets can yield unequal delivered context and unequal memory-management cost; some calibration gains do not transfer to held-out tasks.

**Source:** same primary study and Reading Note.

**Strength:** reports.

**Independent:** false.

### E4 — our-interpretation

**Claim:** Activation of a revised memory policy should require evidence bound to the new policy version and the affected measurement layers, rather than inheriting authorization from an earlier calibration or final task success.

**Source:** analytical inference from E1–E3.

**Strength:** supports.

**Independent:** false.

## Comparison

| Evaluation view | What it can support | What it cannot establish alone |
|---|---|---|
| Nominal token budget | Capacity or configured limit | Retained objects, delivered context, management cost, correctness |
| Stored state | What persisted at a checkpoint | What a later occurrence actually received |
| Delivered context | What was available to a specific execution | Cost of producing it or broader policy safety |
| Management work | Compression/retrieval effort and overhead | Whether the selected context was sufficient |
| Task/process outcome | Bounded result evidence | Memory correctness, efficiency, or safe transfer |

## Contradictions and counterarguments

A practical system may prefer one coarse metric because fine-grained traces are expensive. That objection concerns instrumentation cost, not evidentiary equivalence. A layered model need not retain every byte indefinitely; it does require that each governance claim identify which layer supplies its evidence and what information was intentionally summarized or discarded.

The source does not show that every coding-agent failure is caused by memory. It also does not establish a universally optimal memory strategy. The defensible conclusion is narrower: nominal capacity and final outcome are insufficient substitutes for layered memory evidence.

## Bounded research judgment

Working-memory governance should be claim-layered and occurrence-bound. Long-running digital employees cannot be judged memory-safe or memory-effective from context size or final task completion alone. Adaptive memory changes require fresh, versioned evidence for stored state, delivered context, management work, and process outcome within the workload boundary actually evaluated.

## General implications

- Observability schemas should distinguish retained state from delivered context.
- Recovery should identify the memory-policy version used by the interrupted occurrence.
- Efficiency metrics should include management work, not only prompt size.
- Policy promotion should be gated by held-out or changed-distribution evidence.
- Outcome success should remain separate from evidence that the memory path was correct.

## Limitations

The empirical corpus concerns coding-agent trajectories. It does not establish identity security, authorization correctness, persistence durability, exactly-once effects, or safe irreversible actions for arbitrary enterprise digital employees. The governance model above is an interpretation constrained by those limits.

## Open questions

- What minimum evidence can preserve the four-layer distinction without retaining sensitive full context?
- How should delivery evidence be sampled when a long-running worker has thousands of occurrences?
- Which distribution-change signals should force memory-policy revalidation?
- How should memory-policy rollback relate to task-effect recovery?

## Editorial recommendation

- **Article type:** technical-analysis
- **Selected modules:** research-question; evidence; technical-analysis; governance-implications; limitations; open-questions
- **Ending module:** open-questions
- **Project relevance:** none
