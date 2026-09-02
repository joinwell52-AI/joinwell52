# Q-20260902-01 — Working Memory Needs Four-Layer Evaluation

- Runtime date: 2026-09-02 (Asia/Shanghai)
- Queue signal: SIG-20260902-009
- Primary source: https://arxiv.org/abs/2608.31057
- Evidence level: `peer_reviewed_or_primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

Can a long-running digital employee be judged memory-safe or memory-effective from nominal token budget alone, or must governance separately observe stored state, delivered context, memory-management work, and task/process outcome?

## Problem and Method

The primary study, *Measure Before You Manage: Evaluating Agent Working Memory in Coding Agents*, analyzes 55 archived coding-agent trajectories. Its central premise is that agent working memory is semantically heterogeneous: instructions, artifacts, tool outputs, and agent-generated state play different roles and show different retention, compression, and delivery behavior.

The study therefore separates four measurement layers: **stored state**, **delivered context**, **management work**, and **task/process outcome**. This matters because a nominal context or token budget describes capacity, not necessarily what the runtime retained, what it actually delivered to a later step, how much work was spent managing memory, or whether apparent task success masked a memory defect.

## Findings

Semantically different memory objects exhibit different retention and compression behavior across the 55 trajectories. The paper evaluates semantically informed strategies, including object-aware compression and retrieval-based management, and reports that calibration gains do not necessarily transfer to held-out tasks. Equal token budgets can yield unequal delivered context and unequal management cost. A real-system replay also exposes serving constraints that a nominal budget does not represent.

The bounded engineering implication is that working-memory quality cannot be reduced to one scalar such as context-window size, total stored tokens, or final task success. A governed long-running worker needs evidence at the layer where a claim is made: state retention evidence for persistence claims, delivery evidence for what was actually available at execution time, management-cost evidence for efficiency claims, and outcome evidence for task/process claims.

## Contradictions and Negative Evidence

The paper itself supplies the key negative evidence: calibration improvements may fail to transfer to held-out tasks, and equal token budgets do not imply equal delivered context or equal management cost. Therefore a memory policy that looks efficient under one calibration distribution is not automatically safe to activate broadly.

Task success is also an incomplete observable. A worker may complete despite stale, omitted, or over-compressed memory, while another may spend substantial management work to deliver equivalent context. Outcome-only evaluation would collapse these distinct failure modes.

## Governance Implication

For adaptive or self-revising memory, the system should keep versioned evidence for at least: memory-object identity/type, retained representation, policy/version that transformed it, actual context delivered to an execution occurrence, management work/cost, and resulting task/process outcome. When a policy changes, prior calibration should not silently authorize the new policy on a new distribution; revalidation should be explicit.

This is an inference from the study, not a claim made as a universal enterprise architecture by the authors.

## Limits

The empirical corpus contains coding-agent trajectories, not arbitrary enterprise digital employees. The study does not prove identity, authorization, persistence durability, exactly-once effects, or safe handling of irreversible external actions. It also does not establish that one memory strategy dominates across workloads. Its evidence is strongest for the narrower proposition that memory evaluation must be semantically and operationally layered rather than budget-only.

## Reading Conclusion

A nominal token budget is not sufficient evidence of working-memory correctness or efficiency. The primary evidence supports a four-layer evaluation model—stored state, delivered context, management work, and task/process outcome—and shows that semantic object type and distribution shift matter. Analysis may use this to examine how a long-running digital employee should bind memory-policy changes to explicit evidence rather than infer safety from capacity or task success alone.
