# Article brief · 2026-11-05

## Proposition

When another AI takes over a task, data, the workspace, a pending decision, authority, and later memory have different inheritance rules. A shared session or workspace cannot answer all five questions.

## Reader scene and question

A PM assigns work to a DEV agent, then a QA agent checks it. The successor can see the task and perhaps the same workspace. Which information may it read, which previous decisions still apply, and what evidence allows downstream work to start?

The opening is an illustrative situation, not a claim that the four upstream frameworks were connected into one run.

## Evidence map

| Claim | First-party check | Boundary |
| --- | --- | --- |
| A delegated child can inherit copied data without sharing mutations | AG2 1.3 scope probe | No model-driven agent/tool run |
| A previous answer cannot fill a later approval slot under strict local resume | LangGraph 1.2.20 two-interrupt probe | In-memory checkpoint, private strict flag |
| Workspace reuse and session continuation are independent choices | Paradev 2.0.5 original target planner, seven cases | Dependency stubs; no desktop/cloud run |
| Memory inputs can be counted and checked before distillation | Anthropic cookbook helper on 11 provided transcripts | No paid Managed Agents invocation |
| A worker's completed report does not itself make a PM decision or release a success-only dependency | CodeFlowMu fixed commit tests: review readiness, task dependency, governance command | Unit/integration fixtures; no full UI journey |
| Host, workspace, role and governance tools are part of the execution continuity contract | CodeFlowMu real contract builder/comparator probe | Comparator only; actual takeover path not exercised |

## Story structure

1. Familiar handoff scene and why continuity is ambiguous.
2. Four small experiments as progressively different inheritance questions.
3. CodeFlowMu evidence: formal report, independent review, current authority and contract drift.
4. A practical four-question handoff check for builders and operators.
5. Follow-up: full PM→worker→reviewer takeover, changed host, old answer, and post-review memory promotion.

## Article decision

One bilingual comparative engineering article. Its novelty is the *cross-layer inheritance contract* rather than an unverified defect claim. Public evidence includes exact inputs/outputs and rerunnable probes. No CodeFlowMu development review is opened because the current tests show existing boundaries and the remaining questions lack a full-path counterexample.
