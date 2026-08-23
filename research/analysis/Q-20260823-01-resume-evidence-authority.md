---
schema: "research-analysis/v1"
id: "AN-20260823-01"
date: "2026-08-23"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260823-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260823-01-hitl-resume-function-response-preservation.md"
output_contract: "Research Object"
research_object: "Resume Evidence Authority Must Be Monotonic Across HITL Continuation"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Resume Evidence Authority Must Be Monotonic Across HITL Continuation

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-23 Reading Result for Q-20260823-01. The primary evidence is the merged Google ADK change that reconstructs interrupt responses into `resume_inputs` and suppresses single-turn synthetic user-input injection when those resume inputs are present. The judgment below is a bounded interpretation about resume evidence ordering in digital-employee and HITL systems. It does not establish authenticated approver identity, general exactly-once approval, transactional rollback or end-to-end workflow safety.

本对象仅分析 Q-20260823-01 的 2026-08-23 已完成 Reading Result。一手证据来自 Google ADK 已合并变更：Interrupt Response 会被重建进 `resume_inputs`，而当 Resume Input 存在时，Single-turn Wrapper 不再注入 Synthetic User Input。下述判断仅是关于数字员工与 HITL System 中 Resume Evidence Ordering 的有界解释，并不建立经过认证的 Approver Identity、通用 Exactly-once Approval、Transactional Rollback 或端到端 Workflow Safety。

```yaml
analysis:
  research_question: "When a digital employee resumes after a human interruption, how should the system order reconstructed operator evidence relative to regenerated or synthetic context so that continuation does not silently downgrade the authority of the human response?"
  research_question_zh: "当数字员工在人为中断后恢复时，系统应如何排序重建的 Operator Evidence 与重新生成或 Synthetic Context，避免 Continuation 静默降低 Human Response 的权威性？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "ADK workflow resume scans persisted session events and reconstructs user FunctionResponses tied to known interrupt ids into resolved responses and child-context resume inputs."
      claim_zh: "ADK Workflow Resume 会扫描持久 Session Event，把与已知 Interrupt ID 绑定的 User FunctionResponse 重建成 Resolved Response，并进入 Child Context 的 Resume Input。"
      source: "research/reading/Q-20260823-01-hitl-resume-function-response-preservation.md"
      strength: "direct merged-code evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "For workflow-wrapped single-turn LlmAgent nodes, the input-preparation path now returns early when resume inputs are non-empty and therefore does not append another synthetic user event containing the original node input."
      claim_zh: "对于 Workflow-wrapped Single-turn LlmAgent Node，当 Resume Input 非空时，Input Preparation Path 现在会提前返回，因此不会再次附加包含原始 Node Input 的 Synthetic User Event。"
      source: "research/reading/Q-20260823-01-hitl-resume-function-response-preservation.md"
      strength: "direct merged-code and regression-test evidence"
      independent: false
    - id: "E3"
      identity: "source-reported-claim"
      claim: "The maintainer change identifies repeated HITL confirmation as the motivating failure: the duplicate synthetic user event could appear after the actual user FunctionResponse and shadow it in the resumed model view."
      claim_zh: "维护者变更把重复 HITL Confirmation 确认为直接故障场景：重复 Synthetic User Event 可能出现在真实 User FunctionResponse 之后，并在恢复后的 Model View 中遮蔽它。"
      source: "research/reading/Q-20260823-01-hitl-resume-function-response-preservation.md"
      strength: "maintainer-described failure mechanism supported by changed path"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "The regression test verifies the decisive condition with a representative non-empty resume_inputs mapping, but it does not execute a complete persisted tool-confirmation loop end to end."
      claim_zh: "Regression Test 用代表性的非空 `resume_inputs` 验证关键条件，但没有端到端执行完整的持久 Tool-confirmation Loop。"
      source: "research/reading/Q-20260823-01-hitl-resume-function-response-preservation.md"
      strength: "direct test-scope evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Resume should be treated as evidence continuation rather than a fresh invocation: once operator response evidence has been admitted for an interrupted occurrence, lower-authority synthetic reconstruction should not be allowed to outrank or shadow it merely because it is appended later."
      claim_zh: "Resume 应被视为 Evidence Continuation，而不是 Fresh Invocation：一旦某个 Interrupted Occurrence 已接纳 Operator Response Evidence，较低权威的 Synthetic Reconstruction 不应仅因写入时间更晚就获得更高顺序并遮蔽该 Evidence。"
      source: "E1,E2,E3"
      strength: "bounded governance interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "Evidence ordering and human authorization are separate controls: preventing shadowing preserves the admitted response's place in continuation semantics, but it does not prove who approved, whether the approval is still valid, or whether the effect executes once."
      claim_zh: "Evidence Ordering 与 Human Authorization 是两个独立 Control：阻止 Shadowing 可以保留已接纳 Response 在 Continuation Semantics 中的位置，但不能证明是谁批准、批准是否仍有效，也不能证明 Effect 只执行一次。"
      source: "E4"
      strength: "bounded architectural interpretation"
      independent: false

  observations:
    - "The failure is not simply duplicate text; it is an ordering failure between evidence with different semantic authority."
    - "Persisted session history plus interrupt identity gives resume a specific lineage that a synthetic copy of original input does not share."
    - "Suppressing the synthetic event at the input-admission boundary is stronger than trying to infer after the fact which later user-role event should count."
    - "The broad `bool(resume_inputs)` guard is intentionally simple, but it leaves an open question about unrelated resume inputs that might suppress input regeneration for the wrapped node."
  observations_zh:
    - "该故障并不只是 Duplicate Text，而是不同 Semantic Authority 的 Evidence 之间发生了 Ordering Failure。"
    - "Persisted Session History 与 Interrupt Identity 赋予 Resume 特定 Lineage，而原始 Input 的 Synthetic Copy 并不具备同一 Lineage。"
    - "在 Input-admission Boundary 直接阻止 Synthetic Event，比事后再让 Model 推断哪条更晚的 User-role Event 才应有效更强。"
    - "`bool(resume_inputs)` 这一宽泛 Guard 简单而明确，但仍留下一个问题：与当前 Wrapped Node 无关的 Resume Input 是否可能不必要地抑制 Input Regeneration。"

  comparisons:
    - "Treating resume as a fresh turn makes temporal recency dominate authority and permits regenerated context to displace persisted interruption evidence."
    - "Post-hoc deduplication can remove textual duplicates but still requires a rule for which event carries occurrence identity and authority."
    - "A resume-aware admission rule preserves occurrence lineage before model interpretation and therefore reduces dependence on the model recognizing semantic precedence from prose alone."
  comparisons_zh:
    - "把 Resume 当成 Fresh Turn 会让 Temporal Recency 压过 Authority，并允许重新生成的 Context 取代持久化的 Interruption Evidence。"
    - "Post-hoc Deduplication 可以删除文本重复，但仍需要回答哪条 Event 才携带 Occurrence Identity 与 Authority。"
    - "Resume-aware Admission Rule 在 Model Interpretation 之前保留 Occurrence Lineage，因此减少系统对 Model 仅凭 Prose 推断 Semantic Precedence 的依赖。"

  counterarguments:
    - "Some resumed workflows may intentionally want new user context to supersede an earlier response, so monotonic evidence authority should be occurrence-scoped rather than a universal 'older evidence always wins' rule."
    - "A single guard on non-empty resume inputs may be too coarse if several independent interruption channels share one context."
    - "For low-risk interactions, a simpler fresh-turn model may be operationally acceptable even if it offers weaker provenance guarantees."
  counterarguments_zh:
    - "某些 Resumed Workflow 可能有意让新的 User Context 覆盖更早 Response，因此 Monotonic Evidence Authority 应限定在具体 Occurrence，而不是形成‘旧 Evidence 永远优先’的普遍规则。"
    - "如果多个独立 Interruption Channel 共享同一个 Context，仅凭 Resume Input 非空这一 Guard 可能过于粗粒度。"
    - "在低风险交互中，即使 Fresh-turn Model 的 Provenance Guarantee 更弱，也可能在操作上足够。"

  research_judgment: "HITL continuation should preserve a monotonic, occurrence-scoped evidence order: once a human response has been reconstructed and admitted as the response to a specific interruption, regenerated or synthetic context must not silently outrank it merely because it is appended later. The safer control point is before model interpretation, where resume lineage can suppress lower-authority synthetic input. This preserves evidence continuity, not human identity or exactly-once effect semantics; those require separate authorization, freshness and effect controls."
  research_judgment_zh: "HITL Continuation 应保持一种单调且 Occurrence-scoped 的 Evidence Order：一旦 Human Response 已被重建并作为某个特定 Interruption 的 Response 接纳，重新生成或 Synthetic Context 就不能仅因为写入更晚而静默获得更高优先级。更安全的 Control Point 位于 Model Interpretation 之前，由 Resume Lineage 阻止较低权威的 Synthetic Input。该机制保留的是 Evidence Continuity，而不是 Human Identity 或 Exactly-once Effect Semantics；后两者仍需要独立的 Authorization、Freshness 与 Effect Control。"

  general_implications:
    - "Resume APIs should carry typed occurrence identity and response evidence, not only replayed conversational text."
    - "Systems should define semantic precedence before model context assembly so recency does not accidentally become authority."
    - "Human-response evidence, approver identity, approval validity and downstream effect evidence should remain separately represented."
    - "Regression tests for resumable digital employees should cover event ordering as well as value preservation."
  general_implications_zh:
    - "Resume API 应携带 Typed Occurrence Identity 与 Response Evidence，而不只是重放 Conversation Text。"
    - "系统应在 Model Context Assembly 之前定义 Semantic Precedence，避免 Recency 意外变成 Authority。"
    - "Human-response Evidence、Approver Identity、Approval Validity 与 Downstream Effect Evidence 应继续独立表示。"
    - "可恢复数字员工的 Regression Test 除 Value Preservation 外，还应覆盖 Event Ordering。"

  limitations:
    - "Evidence is one merged ADK implementation and associated tests, not an independent cross-framework evaluation."
    - "The added regression test is narrower than a complete live HITL tool-confirmation resume loop."
    - "The demonstrated mechanism applies to workflow-wrapped single-turn input preparation and should not be generalized to every agent-resume path."
    - "The change does not establish authenticated human identity, durable revocation, transactionality or exactly-once external effects."
  limitations_zh:
    - "证据来自一个 ADK 已合并实现及相关测试，并非跨 Framework 的独立 Evaluation。"
    - "新增 Regression Test 比完整 Live HITL Tool-confirmation Resume Loop 更窄。"
    - "已证明机制适用于 Workflow-wrapped Single-turn Input Preparation，不应直接推广到所有 Agent Resume Path。"
    - "该变更没有建立经过认证的 Human Identity、持久 Revocation、Transactionality 或 Exactly-once External Effect。"

  open_questions:
    - "Should resume evidence carry an explicit occurrence id and authority class all the way into model-context assembly?"
    - "How should a system handle a genuinely new user instruction that intentionally supersedes an earlier interruption response?"
    - "Can unrelated resume inputs accidentally suppress legitimate synthetic input regeneration for another node?"
    - "What end-to-end tests are needed to prove termination of a real persisted HITL confirmation loop without overstating authorization guarantees?"
  open_questions_zh:
    - "Resume Evidence 是否应携带显式 Occurrence ID 与 Authority Class，并一直进入 Model-context Assembly？"
    - "当真正的新 User Instruction 有意覆盖更早的 Interruption Response 时，系统应如何表示这种合法 Supersession？"
    - "无关的 Resume Input 是否会意外抑制另一个 Node 合法的 Synthetic Input Regeneration？"
    - "要证明真实持久 HITL Confirmation Loop 能终止，同时不夸大 Authorization Guarantee，还需要哪些端到端测试？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence", "technical-analysis", "governance-implications", "engineering-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment is a general resumable-agent and HITL governance pattern; no first-party project is required to establish it."
    rationale_zh: "该判断属于可恢复 Agent 与 HITL Governance 的一般模式，不需要引入自有项目才能成立。"
```

## Bounded judgment / 有界判断

The central distinction is **resume recency is not resume authority**. A later synthetic event can be newer without being more authoritative than the human response that resolves the interruption. The selected ADK change demonstrates one concrete way to enforce that distinction at context admission. It does not prove the operator's identity, the continuing validity of the approval or the uniqueness of downstream effects.

核心区别是：**Resume Recency 不等于 Resume Authority**。一条更晚的 Synthetic Event 可以更新，但不应因此比真正解决 Interruption 的 Human Response 更有权威。所选 ADK 变更展示了在 Context Admission 阶段落实这一边界的一种具体方式，但它并不能证明 Operator Identity、Approval 持续有效性或 Downstream Effect 唯一性。
