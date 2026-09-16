---
schema: publication-candidate-article/v2
title: "Selecting the Right Skill Does Not Grant Execution Authority"
date: '2026-09-16'
column: open-source-engineering
category: daily
article_type: technical-analysis
edition: research-center
research_question: "智能体运行时按需选择技能而非永久预载时，一次正确路由究竟能证明什么；在执行或宣告成功前，哪些下游事实必须继续分开？"
summary: "Skill routing can become a measurable runtime selection plane that reduces permanent context loading. A correct route proves relevance under the labels; it does not grant tool authority or prove downstream execution and business completion."
cover: staging/publication-candidates/2026-09-16-right-skill-not-execution-authority-cover.png
sources:
  - research/analysis/Q-20260916-03-skill-routing-is-selection-not-authority.md
---

![A cyan skill token moves through an amber selection lens toward a separate luminous permission seal and a distant result beacon](staging/publication-candidates/2026-09-16-right-skill-not-execution-authority-cover.png)

# Selecting the Right Skill Does Not Grant Execution Authority

A router decides that the current task needs an email-handling skill and loads the instructions into context. The selection may be exactly right. Whether the digital employee may send to this recipient, whether approval is required, and whether the message is eventually delivered are still three unanswered questions.

Skill relevance, execution authority, and business outcome are different evidence identities. Collapsing them into “skill selected” turns a context optimization into an accidental source of power and makes downstream failures hard to attribute.

## Routing Is Now a Measurable Component

The same-date Research Object examines The Router Within, Gavel, and SkillTraj. In the reported Qwen3-32B setting, Gavel reaches 90.9 percent Correct-skill Trigger on the evaluated skill-use task. SkillTraj contains 372 trajectories across four scenarios, evaluating routing and skill use rather than only a static question set.

These results support an engineering conclusion: skill routing can be trained, measured, and compared independently instead of remaining hidden inside prompt assembly. Its input, version, decision, and evaluation label can become runtime facts.

The 90.9 percent figure is still routing quality in a bounded setup, not production reliability. It does not prove that selected instructions are correct or that the current actor is permitted to perform the operations they describe.

## On-demand Loading Shrinks Context

The system uses a lightweight hidden-state glance, a skill bank, and an explicit routing or adjudication layer to decide which skill material is loaded instead of permanently inserting the full catalog.

The direct value is reduced irrelevant context and less competition among skills. With a large catalog and changing tasks, on-demand loading also creates an explicit point where the runtime can record why a particular instruction set became visible.

A small static catalog may not need another router; explicit skill attachment can be simpler. Routing is justified by catalog scale, context cost, and dynamic eligibility—not by architectural novelty alone.

## A Correct Route Proves Selection Relevance

Routing benchmarks generally ask whether the system selected the expected skill for a labeled task. They do not establish:

- that the skill content is validated and current;
- that the actor may invoke related tools;
- that the exact operation and target satisfy policy;
- that the external call succeeded without unknown effects;
- that a responsible authority accepted the business result.

“Route correct” cannot imply “execution authorized,” and a successful outcome should not be used to backfill route correctness. A worker may complete a task after a wrong route by chance, or be correctly routed and then blocked for lack of authority. Both cases need their real reason preserved.

## The Route Must Bind Exact Versions

Recording only “email skill selected” is insufficient. A human-readable name may refer to several versions, and the catalog may change between routing and execution.

An attributable route record should include:

- request or task identity, bounded context digest, and execution epoch;
- actor and policy versions active at the decision;
- catalog digest and candidate set after eligibility filtering;
- router or model version, ranking, confidence, or adjudication evidence;
- selected skill IDs and exact content hashes, or an explicit no-skill result;
- versions actually loaded, their order, and any truncation or transformation.

When the catalog or relevant context changes materially, the old route should expire or be evaluated again rather than continue to reference a changed skill name.

## Authority Must Bind the Later Operation

Skill instructions may tell a worker how to use a tool. They cannot grant power. Authorization should occur at call time and bind the exact operation, tool, target, parameters, current policy, and required approval.

Eligibility filtering and semantic routing should therefore remain separate. Deterministic rules may first remove skills the actor can never use; the router then selects for relevance within the eligible set. Even an eligible skill does not authorize every later call, because target and effect matter.

Multi-skill composition deserves extra care. Two individually eligible skills do not automatically authorize a cross-system operation created by their combination. The composition should be observable and face its own call-boundary decision.

## Outcome Evidence Lives Downstream

After routing, at least three facts remain: which operation was proposed, whether it was authorized, and what happened externally. Outcome evidence should preserve tool results, external effects, failure or block reason, and final acceptance.

The runtime can then distinguish wrong route, stale skill, unauthorized operation, tool failure, unknown effect, and incomplete business result. Recovery can decide whether to reroute, reauthorize, retry a tool, or reconcile external state.

Saving only the final success deprives the router of trustworthy feedback. Saving only route accuracy overstates the task. Selection and outcome should reference each other without replacing one another.

## A Governed Skill Path

A minimal path has five stages:

1. Apply deterministic eligibility filters from actor, policy, and environment.
2. Route semantically over the eligible catalog, allowing explicit no-skill or ambiguous results.
3. Bind and load exact skill versions, recording order and transformations.
4. Independently authorize the concrete operation when the worker proposes it.
5. Preserve execution, external-effect, and business-acceptance evidence.

Each stage can fail and needs its own recovery rule. Catalog change triggers rerouting. Policy change triggers reauthorization. Unknown effect triggers external reconciliation before any replay.

## Boundaries and Open Questions

The evidence comes from a finite curated evaluation with 372 trajectories and specific models and scenarios. It does not establish robustness against adversarial skill descriptions, role-isolation failures, rapid catalog churn, or very long enterprise sessions, and it does not define a production authorization protocol.

Open questions include whether eligibility filtering belongs before or after routing, how confidence should trigger manager approval, how a pre-execution skill update invalidates a route, how permissions compose across several skills, whether recovery may reuse a route, and how routing benchmarks can connect to outcomes without collapsing the identities.

The bounded conclusion is: **skill routing decides which material enters context, not which side effects are permitted. Selecting the right skill is evidence of selection quality; execution authority and completion evidence must be established downstream.**

**Evidence and source:**

- [The Router Within, Gavel, and SkillTraj research](https://arxiv.org/abs/2609.15982), 2026.
