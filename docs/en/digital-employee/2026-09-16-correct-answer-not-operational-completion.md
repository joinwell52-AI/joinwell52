---
title: "A Correct Answer Does Not Mean the Work Is Complete"
date: '2026-09-16'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "长期运行的数字员工在时间、资源和优先级约束下，即使语义答案看起来正确，还需要哪些证据才能把一次工作表示为真正完成？"
summary: "Continuous-execution evidence shows that semantic quality, critical actions, and timeliness can diverge. Completion for a digital employee should therefore be an evidence vector over obligations, time, effects, and acceptance—not a single success bit."
sources:
  - research/analysis/Q-20260916-01-operational-completion-is-evidence-closure.md
item_id: "Q-20260916-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-16-correct-answer-not-operational-completion-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-16-correct-answer-not-operational-completion-cover.png"
  kicker="Digital Employee · Daily Research"
  title="A Correct Answer Does Not Mean the Work Is Complete"
  summary="Continuous-execution evidence shows that semantic quality, critical actions, and timeliness can diverge. Completion for a digital employee should therefore be an evidence vector over obligations, time, effects, and acceptance—not a single success bit."
  version="Q-20260916-01"
  status="Daily Runtime V5 · 2026-09-16"
  languageHref="/zh/digital-employee/2026-09-16-correct-answer-not-operational-completion"
  languageLabel="中文"
/>

# A Correct Answer Does Not Mean the Work Is Complete

A digital employee produces the right recommendation and then stops running. The system writes “Completed.” Yet a required action may be missing, a deadline may have passed, or the intended external effect may remain unknown. A correct answer, a terminated process, and completed business work are three different facts.

Long-running digital employees make this distinction unavoidable. They do more than answer questions: they maintain obligations under resource, priority, and time constraints. If the runtime preserves only one success bit, a semantically strong output can silently overwrite unclosed actions and unresolved effects.

## One Episode Can Be Correct and Incomplete

The same-date Research Object examines Asclepius and its continuous-execution simulator. In the reported baseline, Diagnosis is rated 4.39/5, while Critical Actions are 2.94/5, Timeliness is 3.34/5, and Disposition is 4.52/5. The transferable result is not a particular medical score. It is the separation among dimensions.

If diagnostic quality were an adequate proxy for operational completion, Critical Actions and Timeliness should not lag so far behind. The result instead shows that a system can perform well at saying the right thing while performing materially worse at doing every required thing and doing it on time.

This is simulated evidence, not proof of clinical safety or enterprise reliability. But it directly challenges a common shortcut: semantic quality does not automatically represent closure in sustained work.

## Improving One Dimension Does Not Fill the Others

The full configuration reports Diagnosis 4.38/5, Critical Actions 3.67/5, Timeliness 3.79/5, and Disposition 4.54/5 on the held-out batch. Critical Actions improve by about 0.63 points, roughly 22 percent, with reported p=0.024, while Diagnosis remains nearly unchanged.

The dimensions are therefore not merely alternative labels for one latent success variable. An intervention can improve one completion dimension while another stays stable. A persistent runtime needs dimension-level evidence, not only a total score or final narrative.

The evaluated system combines trace-derived operating-manual evolution, external skills, and isolated subagents inside a simulator with changing patients and resource constraints. This mechanism shows how sustained work can be structured. It does not establish authorization correctness, exactly-once effects, or final acceptance.

## Completion Is a Set of Evidence Identities

A governable completion record should preserve at least six distinct facts.

- **Semantic result:** the substantive output, its verification basis, uncertainty, and scope.
- **Required-action closure:** the versioned obligation set, per-action state, evidence reference, and unresolved actions.
- **Temporal closure:** due time, actual completion time, and missed-window state.
- **Priority and fairness:** whether urgent or protected work was improperly displaced and which rule accepted any exception.
- **External-effect closure:** whether the intended state is present, absent, compensated, or still unknown.
- **Acceptance identity:** which versioned rule or responsible authority converted the evidence package into a business terminal state.

These identities can agree, conflict, or remain unknown independently. The answer can be correct while an action is incomplete. Every action can be done after the deadline. The worker can stop while the external effect is unresolved.

Once the identities are separate, the failure taxonomy becomes clearer: wrong answer, omitted action, lateness, priority violation, unknown effect, and missing acceptance no longer collapse into one generic failure.

## A High Average Cannot Cover a Mandatory Gap

Aggregate scores are useful summaries but unsafe canonical facts. If four of five dimensions are nearly perfect while one critical action has no evidence, the average can still look excellent. For consequential work, that numeric compensation creates a false completion state.

A safer terminal rule is conjunctive over mandatory dimensions. Each must have supporting evidence or be explicitly recorded as failed, unknown, or not applicable. A dimension may be declared not applicable only under the versioned acceptance rule.

Optional quality metrics can remain. They should be derived above the evidence layer, after the raw closure facts are preserved. A score must not rewrite missing evidence into success.

## Worker Termination Is Not Episode Closure

A stopped process proves only that computation ended. A tool call may have timed out after changing an external system. A queue may be empty although a high-priority obligation was skipped. Text may exist without acceptance by the responsible party.

Episode closure therefore needs external-effect and obligation evidence, not the end of model output. When effect state is unknown, the runtime should preserve uncertainty, reconcile external facts, and only then choose retry, compensation, or human handling.

This also explains why a worker should not accept its own work by declaration alone. The worker can report what happened, but “I am done” remains a claim. Acceptance must know which dimensions are mandatory and be owned by a responsible authority or independent rule.

## A Minimal Completion Contract

A practical contract can begin with seven steps:

1. Freeze a versioned obligation set before execution, with governed additions or removals.
2. Preserve state and evidence for every mandatory action.
3. Record semantic result quality and its validation boundary separately.
4. Persist due time, actual time, and any priority exception.
5. Reconcile external effects and duplicate risk for state-changing operations.
6. Keep unknown, failed, and not-applicable explicit.
7. Let a versioned acceptance rule or responsible party issue the terminal decision.

Low-risk work may use a smaller vector, but the reduction must be explicit. A system must not treat every unobserved dimension as successful simply because the task is usually simple.

## Boundaries and Open Questions

The evidence comes from a simulated healthcare setting, uses LLM grading, and reports one rollout per configuration or batch. It does not establish clinical safety, enterprise incident rates, privacy controls, or correct external effects under concurrent retries. Transfer to general digital employees requires validation against the actual obligation class.

Open questions remain: who owns the authoritative obligation set when work changes during execution; which tasks require per-action closure; how timing and fairness exceptions should be represented; how handoffs preserve partially closed vectors; and which dimensions can be checked deterministically versus semantically or by a person.

The bounded conclusion is: **a semantic answer can be correct while the work remains incomplete. A digital employee should enter a business Completed state only when every mandatory dimension of the versioned obligation set has evidence or remains explicitly unresolved.**

**Evidence and source:**

- [Asclepius and the continuous-execution simulator study](https://arxiv.org/abs/2609.13543), 2026.
