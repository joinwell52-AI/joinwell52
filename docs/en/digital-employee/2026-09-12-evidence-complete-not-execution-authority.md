---
title: "Complete Evidence Is Not Execution Authority"
date: '2026-09-12'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "当决定行动是否获准的事实位于模型可见工作区与记忆之外时，必须向规划器暴露哪些证据才能形成有用计划；即使证据完整，仍须在变更边界执行什么安全判断？"
summary: "Complete evidence can make a planning problem solvable without granting permission. A governed digital employee must separate evidence, proposed intent, and current authority, then enforce an intent-bound check before any external effect."
sources:
  - research/analysis/Q-20260912-01-evidence-completion-not-execution-authority.md
item_id: "Q-20260912-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-12-evidence-complete-not-execution-authority-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-12-evidence-complete-not-execution-authority-cover.png"
  kicker="Digital Employee · Daily Research"
  title="Complete Evidence Is Not Execution Authority"
  summary="Complete evidence can make a planning problem solvable without granting permission. A governed digital employee must separate evidence, proposed intent, and current authority, then enforce an intent-bound check before any external effect."
  version="Q-20260912-01"
  status="Daily Runtime V5 · 2026-09-12"
  languageHref="/zh/digital-employee/2026-09-12-evidence-complete-not-execution-authority"
  languageLabel="中文"
/>

# Complete Evidence Is Not Execution Authority

Two digital employees see the same files, the same completion receipts, and the same material awaiting publication. They even propose the same action: send the result to an external channel. Yet one session belongs to the currently authorized attempt while the other is a retained session from an earlier recovery.

The worlds may look identical to the model. Governance must still produce opposite answers. The decisive difference lives in actor, attempt, scope, target, and evidence-generation state outside the visible artifact set.

The central argument is: **complete authority evidence can make planning possible, but it cannot authorize execution. Every consequential effect still needs a current, deterministic, intent-bound decision at the mutation boundary.**

## Three Questions That Are Often Collapsed

An execution-capable agent must answer three distinct questions:

1. Did the planner observe enough facts to interpret the state?
2. What exact action did the planner propose?
3. Does the current authority source permit this actor to perform this action on this target in this attempt?

The first is evidence completeness. The second is planner competence. Only the third is execution authorization. Collapsing them quietly converts “the model knows the rule” into “the model may approve the effect.”

## The Ablation Locates an Information Boundary

The same-day Research Object analyzes a controlled cross-substrate authority study. In a matched evidence-ablation experiment, authority-blind evidence produced 0 final semantic successes in 32 trials. Raw receipts produced 32/32, and an information-equivalent typed relation also produced 32/32.

The result shows that omitting the decisive authority fact can make correct interpretation impossible in the tested tasks. It also supplies a useful negative result: typed packaging did not outperform equal raw receipts. Structure can improve validation, integration, and audit without creating semantic accuracy from format alone.

The first design task is therefore not to ask the model to be more careful. It is to establish whether decision-relevant authority facts actually reached the planner.

## Complete Evidence Does Not Make Planning Reliable

A second experiment removed the information gap without removing model uncertainty. Raw receipts yielded 19/32 correct first actions. The typed relation yielded 15/32, including 11/32 invalid or absent outputs. Across 16 crossed-publication cases, the planner proposed six unsafe crossed effects.

This rejects a common shortcut: place policy, receipts, and typed relations in context, then connect model output directly to an external tool. Complete context makes the task solvable. It does not guarantee that this planner instance solves it correctly or emits an executable intent.

The planner should produce an explicit, inspectable proposal. It should never manufacture an authority fact that is missing from the responsible source.

## Frozen Intents Isolate the Guard's Contribution

A third experiment made no new model calls. It replayed the exact 32 first-action intents from the typed-relation condition. A deterministic execution guard reduced six unsafe crossed effects to zero while admitting all 12 valid authorized publish intents present in the fixed set.

Because the intents were frozen, the improvement cannot be attributed to a better prompt or another model judgment. It came from rereading actor, session, attempt, artifact, scope, current workspace digest, terminal state, downstream-use authorization, and evidence generation immediately before mutation, then either executing or persisting a durable hold.

Four aligned cases still lacked a valid planner intent. The guard prevented unsafe effects but did not repair missing work. That is the boundary between safety enforcement and task availability.

## An Auditable Execution Contract Needs Separate Identities

Matching files establishes only artifact identity. A governed execution contract also separates:

| Identity | What it binds | Error it prevents |
|---|---|---|
| Artifact | exact bytes or external object | treating similar content as the same object |
| Evidence | receipts for actor, attempt, scope, terminal state, and generation | inferring authority from incomplete facts |
| Observation | evidence actually shown to the planner | assuming the model saw everything the system knows |
| Intent | action, target, and occurrence | replaying old approval for a new effect |
| Authorization | current policy decision for that intent | treating historical permission as permanent capability |
| Hold | rejected intent and proof of non-effect | reporting safe prevention as business completion |
| Outcome | completion, failure, block, or partial result | confusing a gate decision with the task result |

The check must sit at the final point where an effect can still be prevented. Validation after sending, writing, or publishing is an audit trail, not enforcement.

## Delegation Makes “Current” More Complex

The Bounded Agents comparison adds time and principal chains. Authority can be delegated while scope narrows, cumulative budgets change, prior actions accumulate, and composition restrictions apply. A parent's capability set cannot simply be cloned into a child, and one approval should not become a standing permit for similar actions.

An effect-local check must therefore verify the authorization chain, narrowed scope, cumulative state, exact action instance, and whether a retry is still the same effect. Deterministic code does not make policy complete: missing facts, incomplete restriction classes, or a compromised authority store can still make a reproducible guard reliably wrong.

## A Safe Hold Is Not Business Completion

A hold proves that the system did not cross a prohibited boundary. It does not prove that the requested result exists. Calling both states “success” corrupts recovery: downstream work may assume an external effect exists, or a retry may run without proof that the earlier effect was absent.

A precise terminal record keeps both facts: enforcement behaved correctly, and the business objective did not complete. Recovery can then branch on whether the prior external effect is proven absent, proven present, or unknown.

## Practical Design Rules

A governed execution-capable agent should:

- keep authority receipts outside mutable conversational memory;
- expose enough evidence for a useful plan without treating exposure as permission;
- bind authorization to actor, attempt, artifact, target, action scope, and evidence generation;
- reread current authority immediately before mutation;
- persist denials as explicit non-effects with reasons;
- separate evidence completeness, planner quality, execution authorization, and business completion;
- require proof of prior effect state before retry;
- audit observation completeness and policy coverage, not only deterministic code paths.

## Boundaries and Open Questions

The evidence comes from controlled publication and code scenarios, two model routes, and fixed matrices. It does not establish prevalence across arbitrary tools or organizations. The experiment trusts its authority database, actor allocation, and cryptographic identities; compromise there remains outside the result.

Not every authority fact belongs in model context. Some can remain enforcement-only if the planner can still form a bounded, inspectable intent. The objective is sufficient planning evidence plus complete enforcement evidence, not maximal disclosure.

Open questions include how permits bind multi-step targets that change during execution, which events increment evidence generation, how concurrent agents reserve authority, how the authority store is independently attested, and who may restart work after a safe hold.

**Evidence and citation:**

- [Cross-Substrate Authority controlled study](https://arxiv.org/html/2609.08472)
