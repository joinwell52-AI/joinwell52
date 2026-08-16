---
schema: "research-analysis/v1"
id: "AN-20260816-01"
date: "2026-08-16"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260816-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260816-01-exact-call-approval-overrides-sticky-default.md"
output_contract: "Research Object"
research_object: "Occurrence-Scoped Authorization State for Durable Agent Work"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Occurrence-Scoped Authorization State for Durable Agent Work

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-16 Reading Result for Q-20260816-01. Merged OpenAI Agents Python code, compatibility fixtures and regression tests are treated as bounded implementation facts. The architectural conclusions below are interpretations about durable digital-employee authorization state; they do not claim authenticated approver identity, cryptographic provenance, enterprise authorization, or exactly-once external execution.

本对象仅分析 Q-20260816-01 的 2026-08-16 已完成 Reading Result。OpenAI Agents Python 已合并代码、兼容性 Fixture 与回归测试仅作为有界实现事实。下述架构结论属于对持久化数字员工授权状态的分析解释，不据此声称已建立 Approver 身份认证、密码学 Provenance、企业级授权或外部 Exactly-once Execution。

```yaml
analysis:
  research_question: "How should a durable agent runtime represent one human decision for one concrete tool-call occurrence when a broader sticky authorization default already exists?"
  research_question_zh: "当系统已经存在较宽的 Sticky Authorization Default 时，持久化 Agent Runtime 应如何表示针对某一个具体 Tool-call Occurrence 的单次人工决定？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "OpenAI Agents Python RunState schema 1.16 resolves exact approved/rejected call IDs before sticky defaults, so a concrete call can override a broader tool-level decision without changing sibling calls."
      claim_zh: "OpenAI Agents Python RunState Schema 1.16 会先解析精确 Approved/Rejected Call ID，再回退到 Sticky Default，因此某个具体 Call 可以覆盖较宽的 Tool-level 决定，而不会改变其他同类 Call。"
      source: "research/reading/Q-20260816-01-exact-call-approval-overrides-sticky-default.md"
      strength: "direct merged-code and regression-test evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Reversing an exact decision removes the same call ID from the opposite exact-decision list, and serialization/resume tests preserve the exact exception together with the sticky default."
      claim_zh: "反转某个精确决定时，实现会先把同一 Call ID 从相反的 Exact-decision List 中移除；序列化与 Resume 测试证明 Exact Exception 可以与 Sticky Default 一起持久保存。"
      source: "research/reading/Q-20260816-01-exact-call-approval-overrides-sticky-default.md"
      strength: "direct merged-code and compatibility-test evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The selected mechanism does not authenticate the approver, make call IDs cryptographically unforgeable, establish global uniqueness, or provide exactly-once guarantees for external side effects."
      claim_zh: "所选机制不会认证 Approver 身份，不会使 Call ID 具备密码学不可伪造性或全局唯一性，也不提供外部副作用的 Exactly-once 保证。"
      source: "research/reading/Q-20260816-01-exact-call-approval-overrides-sticky-default.md"
      strength: "direct source limitation"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Durable human-in-the-loop governance is stronger when broad policy defaults and occurrence-scoped exceptions are separate state layers, while actor identity and authorization evidence are modeled separately from the action occurrence itself."
      claim_zh: "当宽泛 Policy Default 与 Occurrence-scoped Exception 被建模为不同状态层，同时把 Actor Identity/Authorization Evidence 与 Action Occurrence 本身分离时，持久化 Human-in-the-loop Governance 更稳健。"
      source: "E1,E2,E3"
      strength: "bounded architectural interpretation"
      independent: false

  observations:
    - "The implementation preserves a broad reusable default while allowing one durable exception to be attached to one recorded execution occurrence."
    - "The exact call ID answers 'which invocation is this decision about'; it does not answer 'who made the decision' or 'was that actor entitled to make it'."
    - "Persistence matters because a human exception that disappears after restart would change authorization semantics during recovery."
    - "Decision reversal is explicit state replacement rather than accumulation of contradictory exact decisions."
  observations_zh:
    - "实现保留可重复使用的宽泛 Default，同时允许把一个持久 Exception 绑定到一个已记录的执行 Occurrence。"
    - "Exact Call ID 回答的是‘这个决定针对哪一次调用’，而不是‘谁做了决定’或‘该主体是否有权做决定’。"
    - "持久化很关键，因为如果人工 Exception 在重启后消失，恢复过程中的授权语义就会发生变化。"
    - "Decision Reversal 采用显式状态替换，而不是累积互相矛盾的 Exact Decision。"

  comparisons:
    - "Changing the sticky default to express one exception widens the scope of the human decision; occurrence-scoped state keeps the exception narrow."
    - "Persisting only an approval boolean without the concrete occurrence identity loses the object of authorization and makes resumed execution harder to audit."
    - "Binding to a call occurrence without actor evidence is stronger than an unscoped boolean but weaker than a complete authorization record containing subject, role, policy and action fingerprint."
  comparisons_zh:
    - "通过修改 Sticky Default 表示一次例外，会扩大人工决定的作用范围；Occurrence-scoped State 可以把例外限制在单次执行。"
    - "如果只持久化 Approval Boolean 而没有具体 Occurrence Identity，就会丢失授权对象，恢复执行也更难审计。"
    - "绑定 Call Occurrence 比无范围 Boolean 更强，但如果没有 Actor Evidence，仍弱于包含 Subject、Role、Policy 与 Action Fingerprint 的完整授权记录。"

  counterarguments:
    - "For low-risk single-user agents, a surrounding application may intentionally own identity and authorization, so the SDK does not need to duplicate that layer."
    - "A stable call ID plus durable exact decision may be sufficient when tool arguments and policy cannot change between pause and resume."
    - "Adding cryptographic actor provenance to every approval could impose complexity disproportionate to low-impact workloads."
  counterarguments_zh:
    - "对低风险单用户 Agent，外围应用可以有意承担 Identity 与 Authorization，因此 SDK 不必重复实现这一层。"
    - "如果 Pause 与 Resume 之间 Tool Arguments 与 Policy 不可能变化，那么 Stable Call ID 加持久 Exact Decision 可能已经足够。"
    - "对每个 Approval 都加入密码学 Actor Provenance，可能给低影响工作带来不成比例的复杂度。"

  research_judgment: "A durable agent should treat authorization as layered state: a broad default policy, an occurrence-scoped exception keyed to the concrete pending action, and separate evidence about the actor and authority that produced the exception. Persistence makes the occurrence decision resumable, but it should not be interpreted as proof of actor identity, policy provenance, or exactly-once effects. For higher-risk tools, the exception should be invalidated or re-admitted when the action fingerprint materially changes, including tool identity, arguments, tool version or governing policy."
  research_judgment_zh: "持久化 Agent 应把 Authorization 建模为分层状态：宽泛 Default Policy、绑定具体 Pending Action 的 Occurrence-scoped Exception，以及独立记录产生该 Exception 的 Actor 与 Authority Evidence。Persistence 让单次决定可以跨恢复继续有效，但不能被解释为 Actor Identity、Policy Provenance 或 Exactly-once Effect 的证明。对高风险 Tool，当 Action Fingerprint 发生实质变化——包括 Tool Identity、Arguments、Tool Version 或 Governing Policy——应使原 Exception 失效或重新准入。"

  general_implications:
    - "Human approval records should identify the exact execution occurrence independently from the approver identity and authorization policy."
    - "Durable recovery should preserve narrow exceptions without silently broadening or dropping the surrounding default policy."
    - "High-risk resumed actions need a change-detection boundary so an approval for one action fingerprint cannot be replayed onto materially changed work."
    - "Audit systems should distinguish policy default, occurrence exception, actor evidence and external-effect evidence as separate facts."
    - "Exactly-once effect claims require downstream execution evidence and cannot be inferred from an authorization-state schema."
  general_implications_zh:
    - "人工 Approval Record 应把精确 Execution Occurrence 与 Approver Identity、Authorization Policy 分别记录。"
    - "Durable Recovery 应保留窄范围 Exception，同时不能静默扩大或丢失外围 Default Policy。"
    - "高风险恢复动作需要 Change-detection Boundary，避免一次 Action Fingerprint 的 Approval 被重放到实质已变化的工作。"
    - "审计系统应把 Policy Default、Occurrence Exception、Actor Evidence 与 External-effect Evidence 区分为不同事实。"
    - "Exactly-once Effect 需要下游执行证据，不能从 Authorization-state Schema 推导。"

  limitations:
    - "Evidence comes from one merged SDK change and its tests rather than an independent evaluation of enterprise authorization systems."
    - "The selected implementation does not prove actor identity, role policy, call-ID integrity across trust domains or external effect finality."
    - "The proposed action-fingerprint revalidation rule is an architectural interpretation, not a behavior established by the selected code."
  limitations_zh:
    - "证据来自一个已合并 SDK 变更及其测试，而不是对企业授权系统的独立评估。"
    - "所选实现没有证明 Actor Identity、Role Policy、跨 Trust Domain 的 Call-ID Integrity 或 External Effect Finality。"
    - "本文提出的 Action-fingerprint Revalidation 规则属于架构解释，并非所选代码已经实现的行为。"

  open_questions:
    - "Which actor, role and policy evidence should be persisted beside a high-risk exact-call decision?"
    - "Which fields belong in an immutable action fingerprint for deciding whether a resumed approval remains valid?"
    - "How should imported RunState prove that occurrence identifiers and approval records were not forged or replayed across trust domains?"
  open_questions_zh:
    - "高风险 Exact-call Decision 旁边应持久化哪些 Actor、Role 与 Policy Evidence？"
    - "哪些字段应进入 Immutable Action Fingerprint，用于判断恢复后的 Approval 是否仍然有效？"
    - "导入 RunState 时，应如何证明 Occurrence Identifier 与 Approval Record 没有跨 Trust Domain 被伪造或重放？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence", "technical-analysis", "governance-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The conclusion is general to durable agent and digital-employee authorization; no first-party project is required to establish it."
    rationale_zh: "该结论适用于持久化 Agent 与数字员工授权；建立这一判断不需要引入任何自有项目。"
```

## Bounded judgment / 有界判断

A durable approval is strongest when it says **which exact action is authorized** without silently changing the broader rule. But occurrence identity is only one dimension of authorization. The general governance boundary is **default policy → occurrence-scoped decision → actor/authority evidence → effect evidence**. The selected SDK change establishes the first two layers strongly; the latter two remain outside its evidence boundary.

持久化 Approval 最重要的是明确 **究竟授权了哪一个具体动作**，并且不静默修改更宽的规则。但 Occurrence Identity 只是 Authorization 的一个维度。更一般的治理边界是 **Default Policy → Occurrence-scoped Decision → Actor/Authority Evidence → Effect Evidence**。所选 SDK 变更较强地建立了前两层，后两层仍明确位于证据边界之外。
