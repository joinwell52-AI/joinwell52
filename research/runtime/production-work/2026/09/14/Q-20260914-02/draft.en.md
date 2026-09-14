---
schema: publication-candidate-article/v2
title: "Task Completion Does Not Prove Team Reliability"
date: '2026-09-14'
column: industry-architecture
category: daily
article_type: research-interpretation
edition: research-center
research_question: "在声称多智能体团队可靠之前，为什么必须分别证明任务分配、顺序约束、互斥安全与交接连续性，而不能只看总体任务成功？"
summary: "Aggregate success compresses duplicate allocation, ordering violations, resource contention, and broken handoffs into one number. Multi-agent reliability should remain a separately evidenced coordination vector whose critical weak dimensions cannot be averaged away."
cover: staging/publication-candidates/2026-09-14-task-completion-not-team-reliability-cover.png
sources:
  - research/analysis/Q-20260914-02-coordination-reliability-vector.md
---

![Four cyan coordination rails converge on one endpoint while one amber break remains visible](staging/publication-candidates/2026-09-14-task-completion-not-team-reliability-cover.png)

# Task Completion Does Not Prove Team Reliability

Three agents deliver a correct report. The final document says the team succeeded. The trajectory says two agents duplicated the same research, another began synthesis before prerequisite evidence was ready, and the final handoff required manual repair.

The outcome is correct, but the coordination is not reliable. **Aggregate success proves only that the goal was eventually reached. It does not prove that allocation, ordering, mutual exclusion, and handoff satisfied their distinct operational obligations.**

## Four Coordination Constructs Are Not One Ability

The same-date Research Object examines CoCoBench, a primary study with 897 oracle-validated executable tasks across 11 multimodal models. It separates coordination into four constructs:

- **task allocation** — whether pending work has clear ownership without wasteful duplication;
- **sequential ordering** — whether dependent actions begin only after prerequisites close;
- **mutual exclusion** — whether exclusive shared resources are serialized;
- **handoff** — whether produced state transfers completely and the receiver accepts it.

These are not four names for one ability. Duplicate allocation wastes capacity. Ordering violations can invalidate downstream work. Exclusion failures can corrupt shared state. Handoff failures can strand responsibility. The same terminal success rate cannot express those differences.

The study reports construct-specific behavior. A team can allocate well while performing poorly on exclusion, or eventually finish while handling transfers inefficiently.

## A Correct Result Can Hide a Broken Trajectory

Terminal scoring has a basic blind spot: it checks arrival without checking the route.

A team may violate ordering and then recover through rework. It may contend for a resource without visible damage in that run. It may lose a handoff and be rescued by another agent. If evaluation inspects only the final file, these operational risks disappear.

Outcome success remains valuable. It is a result fact and often the user's primary concern. The error is enlarging it into reliability proof. One correct artifact cannot establish that the same protocol remains safe with more agents, higher concurrency, or irreversible effects.

CoCoBench's executable environment and oracle-defined structure make trajectory obligations inspectable, which is stronger than free-form self-assessment. Its household tasks and high-level skill interface, however, do not set quantitative thresholds for enterprise or software teams.

## Reliability Must Remain a Vector

A more truthful representation is not one `team_reliability=0.84`, but a vector:

`[allocation, ordering, exclusion, handoff]`

Each task-relevant dimension receives at least PASS, FAIL, or UNKNOWN. A construct that does not apply should be explicitly marked, not silently treated as passing. An aggregate can summarize the vector, but it must preserve the underlying results and criticality rules.

Criticality matters. Failed mutual exclusion in a payment task cannot be averaged away by excellent allocation. An unknown handoff in a medical workflow cannot be replaced by a high completion score. Averages are useful for ranking; they are unsafe as substitutes for hard gates.

## Four Inspectable Coordination Contracts

A runtime can materialize four auditable contracts.

The **allocation contract** records work-unit identity, owner, lease, duplication policy, and reassignment or abandonment events. It answers who owned what and when.

The **ordering contract** records the prerequisite graph, evidence that each dependency closed, actual starts and completions, and recovery after violations. It answers whether an action had a legal start condition.

The **mutual-exclusion contract** records the exclusive resource, holder, acquisition, renewal, and release events, plus concurrent-access detection. It answers whether shared state had one authorized occupant.

The **handoff contract** records producer, receiver, payload or state identity, offer, acceptance, timeout, and rejection. Producer completion is not receiver acceptance.

These records are useful because they attach failure to a protocol obligation. Recovery becomes bounded only after the runtime knows which contract failed.

## Which Rules Can Be Enforced Mechanically

When all relevant facts are observable, some obligations can be deterministic. One repository path may have one lease holder. Task B may wait for task A's verified terminal state. One payment key may bind one active occurrence.

Other obligations require semantic judgment. A receiver can acknowledge a file without confirming that its contents are sufficient. Ownership can be recorded without proving that the assigned agent is capable. Model or human review still has a role.

Evidence identities must remain separate. A deterministic event proves that no two holders owned the lock. A semantic review judges handoff completeness. The final artifact proves that a goal was reached. Together they may support reliability; none can replace the others.

## Do Not Let Averages Hide Critical Weakness

The study also reports degradation with larger teams, benefit from centralized state aggregation, and only partial recovery from simple communication. “Communicate more” is not a complete coordination protocol.

A centralized view improves shared truth but does not enforce exclusion. Messaging can announce a dependency but does not guarantee ordering. A stronger model does not automatically remove every construct-specific weakness. Architecture must decide which obligations belong to state machines, locks, leases, or schedulers and which require generative judgment.

A practical acceptance rule is straightforward: declare the task-relevant critical constructs, gather evidence for each, reject a reliability claim if any critical item fails, and stop or gather more evidence when one is unknown. Aggregate success becomes an outcome summary only after those gates.

## Boundaries and Open Questions

The evidence does not prove that absolute household-task scores transfer to enterprise systems, and it does not decide whether every violation should be retried, compensated, or terminated. Four constructs may not exhaust every domain; authorization updates, version conflicts, and cross-organizational responsibility may require additional dimensions.

The structural conclusion is bounded but strong: **task completion is an outcome fact; team reliability is evidence about coordination contracts. Any critical obligation with distinct failure semantics must remain visible rather than disappear inside one number.**

Open questions include the minimum event model, how risk selects critical constructs, how UNKNOWN affects terminal state, how admission thresholds change with team size, and whether coordination vectors can be compared across domains.

**Evidence and source:**

- [CoCoBench: a benchmark for multi-agent coordination](https://arxiv.org/abs/2608.28266), primary research, 2026.
