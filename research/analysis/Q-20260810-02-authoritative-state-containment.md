---
schema: "research-analysis/v1"
id: "AN-20260810-02"
date: "2026-08-10"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260810-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260810-02-trusted-state-cascade-containment.md"
output_contract: "Research Object"
research_object: "Authoritative-State Containment for Multi-Agent Workflows"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Authoritative-State Containment for Multi-Agent Workflows

## Governed scope

Skill 04 analysis using only the three completed 2026-08-10 Reading Results, with Q-20260810-02 as the primary Industry Architecture object. No unread material, article drafting, or publication work is introduced.

## Analysis

```yaml
analysis:
  observations:
    - In the controlled benchmark, blind retry repaired transient tool faults but did not repair latent semantic/context corruption because the same bad state remained present.
    - Latent cascade radius increased with pipeline depth, while the strong containment result depended on an explicit trusted-upstream value that let the router compare and repair state.
    - Removing the trusted-upstream signal reduced latent recovery near baseline, so the reported containment gain is a trusted-state repair effect rather than evidence of autonomous LLM fault detection.
  cross_comparison:
    - Durable input admission provides a trusted occurrence identity and explicit acceptance boundary before resumed work; it does not ask the model to infer whether an input has already been consumed.
    - MCP lifecycle serialization similarly creates one authoritative transition owner instead of letting concurrent callers infer whether cleanup/reconnect state is safe.
    - Across the three readings, reliable orchestration repeatedly depends on externally represented state authority, ordering, and ownership rather than model self-correction alone.
  discussion:
    - Multi-agent reliability architecture should separate the reasoning plane from the authority plane. Agents may propose, diagnose, and repair, but they need a trustworthy reference for which state version is accepted, superseded, quarantined, or recoverable.
    - Retry is a transport/liveness mechanism, not a semantic repair mechanism. Retrying against corrupted state can increase propagation rather than reduce it.
    - A production equivalent of trusted upstream state does not need to be an oracle value; it can be a versioned checkpoint, signed/validated business fact, approved human decision, immutable event log position, or a reconciled control-plane record. The architectural requirement is independent provenance and authority, not a specific storage technology.
    - Because real workflows branch and run asynchronously, containment should be measured in affected descendants and invalidated state versions, not only linear-stage distance.
  research_judgment:
    - Multi-agent systems should treat semantic recovery as trusted-state reconciliation, not generalized retry.
    - The control plane should preserve an authoritative state lineage that workers cannot silently overwrite, enabling detection of stale/corrupted descendants and targeted rollback, quarantine, or recomputation.
    - LLM-based repair is strongest when bounded by explicit authority signals and weakest when asked to infer both truth and repair policy from the same corrupted context.
  engineering_impact:
    digital_employee:
      - Maintain authoritative work-state checkpoints for long-lived jobs, including human approvals and externally verified business facts.
      - When semantic inconsistency is detected, reconcile to a trusted checkpoint before rerunning downstream steps.
    codeflowmu:
      - Add state-version/provenance fields to workflow nodes and make downstream outputs declare the upstream version they consumed.
      - Separate retry policies for transient tool/transport failures from repair policies for semantic/context failures.
      - Track cascade impact as invalidated descendants so recovery can target only affected branches.
    tmpa:
      - Use trusted-state repair as research input for evidence/custody semantics; controlled benchmark results are not sufficient for a protocol mandate.
  limitations:
    - OrchestraBench's main probes use controlled staged computations and do not measure full enterprise multi-agent deployments.
    - The strongest containment condition has an information advantage because trusted upstream state is supplied explicitly.
    - Real trusted signals can themselves be stale or compromised, requiring provenance and conflict governance not measured by the benchmark.
  future_questions:
    - What evidence classes qualify as authoritative state for different Digital Employee job types?
    - How should competing trusted checkpoints be reconciled when multiple systems of record disagree?
    - What cascade metric works for branching DAGs, retries, compensation steps, and long-lived asynchronous work?
```

## Research judgment

The reusable lesson is not “LLMs can self-heal multi-agent cascades.” It is that **semantic containment needs an authority plane**. Retry can restore transient execution, but latent corruption requires a trustworthy state reference, provenance-aware reconciliation, and selective invalidation of downstream work.

## Evidence boundary

- `research/reading/Q-20260810-01-durable-runstate-pending-input.md`
- `research/reading/Q-20260810-02-trusted-state-cascade-containment.md`
- `research/reading/Q-20260810-03-mcp-lifecycle-serialization.md`
