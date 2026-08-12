---
schema: "research-analysis/v1"
id: "AN-20260812-02"
date: "2026-08-12"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260812-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260812-02-reviewdecision-mcp-policy-amendment.md"
output_contract: "Research Object"
research_object: "Decision Intent and Effective Policy Must Remain Distinct"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Decision Intent and Effective Policy Must Remain Distinct

## Governed scope / 受治理范围

This object performs Skill 04 analysis only on the completed 2026-08-12 Reading Result for Q-20260812-02. The source establishes a shared decision representation and MCP-specific handling; it does not establish that every requested policy amendment is durably applied or generally safe.

本对象仅对 Q-20260812-02 的 2026-08-12 已完成 Reading Result 执行 Skill 04 分析。来源建立了共享 Decision Representation 与 MCP 专属处理，但并未建立每一次请求的 Policy Amendment 都会被持久应用，也未证明其具备一般安全性。

```yaml
analysis:
  research_question: "How should an approval architecture unify decision vocabulary without conflating a user's requested consent scope with the policy state that was actually applied?"
  research_question_zh: "审批架构应如何统一 Decision Vocabulary，同时避免把用户请求的 Consent Scope 与实际生效的 Policy State 混为一谈？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The selected change moves MCP approvals onto shared ReviewDecision while retaining distinct current-request, session and MCP policy-amendment outcomes."
      claim_zh: "所选变更把 MCP Approval 迁移到共享 ReviewDecision，同时保留 Current-request、Session 与 MCP Policy-amendment 等不同结果。"
      source: "research/reading/Q-20260812-02-reviewdecision-mcp-policy-amendment.md"
      strength: "directly established by changed protocol, code and tests summarized in the Reading Result"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Approval-mode normalization can downgrade requested session or persistent scope to ordinary approval, and a missing persistent key can fall back to session memory."
      claim_zh: "Approval-mode Normalization 可以把请求的 Session 或 Persistent Scope 降级为普通 Approval；缺少 Persistent Key 时还可能回退为 Session Memory。"
      source: "research/reading/Q-20260812-02-reviewdecision-mcp-policy-amendment.md"
      strength: "directly established for the changed MCP path"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The MCP-only persistent decision is rejected fail-closed when it reaches unrelated command or generic approval paths."
      claim_zh: "当 MCP 专用 Persistent Decision 进入无关 Command 或 Generic Approval Path 时，会以 Fail-closed 方式拒绝。"
      source: "research/reading/Q-20260812-02-reviewdecision-mcp-policy-amendment.md"
      strength: "directly established by adapters and tests summarized in the Reading Result"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "A ReviewDecision value does not itself prove that a requested persistent policy amendment was successfully written to durable policy storage."
      claim_zh: "ReviewDecision 的取值本身不能证明请求的 Persistent Policy Amendment 已成功写入持久策略存储。"
      source: "research/reading/Q-20260812-02-reviewdecision-mcp-policy-amendment.md"
      strength: "explicit limitation of the Reading Result"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "A shared decision type is best treated as a normalized intent/control vocabulary, while effective authorization scope should be recorded separately after policy normalization and persistence capability are resolved."
      claim_zh: "共享 Decision Type 更适合作为规范化的 Intent / Control Vocabulary；在 Policy Normalization 与 Persistence Capability 解析完成后，应独立记录实际生效的 Authorization Scope。"
      source: "E1,E2,E4"
      strength: "bounded architectural interpretation"
      independent: false
    - id: "H1"
      identity: "hypothesis"
      claim: "Approval systems can improve auditability by returning both requestedDecision and effectiveDecision/effectiveScope, plus a policy revision or durable acknowledgement when persistence is requested."
      claim_zh: "当请求持久化时，Approval System 可以同时返回 requestedDecision 与 effectiveDecision / effectiveScope，并附带 Policy Revision 或持久确认，以提高审计性。"
      source: "I1"
      strength: "design hypothesis requiring implementation validation"
      independent: false

  observations:
    - "The shared sum type reduces fragmented vocabulary but deliberately does not make every variant legal in every domain."
    - "The implementation already distinguishes decision intent from what the active approval mode and available persistence keys can realize."
    - "Timeout, abort and denial remain distinct terminal governance outcomes even when all are non-approval."
  observations_zh:
    - "共享 Sum Type 减少了碎片化词汇，但明确没有让每个 Variant 在所有 Domain 中都合法。"
    - "该实现已经区分 Decision Intent 与当前 Approval Mode、可用 Persistence Key 最终能够实现的范围。"
    - "Timeout、Abort 与 Denial 即使都属于非批准结果，也仍是不同的治理终态。"

  comparisons:
    - "Tool-specific enums reduce cross-domain ambiguity locally but fragment UI, audit and orchestration semantics."
    - "One shared enum without domain guards centralizes vocabulary while creating unsafe interpretation risk."
    - "A shared vocabulary plus fail-closed adapters and explicit effective scope retains interoperability without erasing domain policy."
  comparisons_zh:
    - "Tool-specific Enum 在局部减少跨域歧义，却会割裂 UI、Audit 与 Orchestration 语义。"
    - "没有 Domain Guard 的单一共享 Enum 虽集中词汇，却会制造错误解释风险。"
    - "共享 Vocabulary + Fail-closed Adapter + 显式 Effective Scope，可以在保留 Domain Policy 的同时获得互操作性。"

  counterarguments:
    - "Adding requested/effective dual fields and policy revisions increases protocol complexity and may be unnecessary for one-shot approvals."
    - "A single ReviewDecision can remain adequate when the transport guarantees that every consumer knows the domain and persistence outcome synchronously."
  counterarguments_zh:
    - "增加 Requested / Effective 双字段与 Policy Revision 会提高协议复杂度，对一次性 Approval 可能没有必要。"
    - "如果传输层能保证每个 Consumer 都明确 Domain，并同步知道 Persistence Outcome，单一 ReviewDecision 可能已经足够。"

  research_judgment: "Shared approval vocabularies should represent decision intent, not silently stand in for effective policy state. Cross-session policy changes require an explicit effective-scope acknowledgement, while domain adapters should reject semantically invalid decisions fail-closed."
  research_judgment_zh: "共享审批词汇应表达 Decision Intent，而不应静默替代实际 Policy State。跨 Session 的 Policy Change 需要显式确认 Effective Scope；Domain Adapter 对语义无效的 Decision 应 Fail-closed 拒绝。"

  general_implications:
    - "Agent approval protocols should model current-call consent, session consent and persistent policy amendment as separate scopes."
    - "Audit records should retain rejection, timeout and cancellation identities instead of collapsing them into a generic false value."
    - "Policy persistence should expose success, downgrade or failure separately from the original user choice."
    - "Shared control-plane types need domain validation at every adapter boundary."
  general_implications_zh:
    - "Agent Approval Protocol 应把 Current-call Consent、Session Consent 与 Persistent Policy Amendment 建模为不同 Scope。"
    - "Audit Record 应保留 Rejection、Timeout 与 Cancellation 的独立身份，而不是折叠成通用 false。"
    - "Policy Persistence 应把成功、降级或失败与原始用户选择分别暴露。"
    - "共享 Control-plane Type 在每个 Adapter Boundary 都需要 Domain Validation。"

  limitations:
    - "The Reading Result does not establish the complete persisted-policy matching, revocation, synchronization or conflict model."
    - "No independent security review or reproduction is part of the evidence."
    - "The proposed effective-scope acknowledgement is an architectural recommendation, not a source-established feature."
  limitations_zh:
    - "Reading Result 未建立完整的 Persisted-policy Matching、Revocation、Synchronization 或 Conflict Model。"
    - "证据中不包含独立安全评审或复现。"
    - "所提出的 Effective-scope Acknowledgement 是架构建议，不是来源已建立功能。"

  open_questions:
    - "How should a policy store acknowledge a successful amendment and expose its matching scope and revision?"
    - "How should enterprise policy override or prohibit user-requested persistent amendments?"
    - "What user-visible result should represent a persistence request that is downgraded to session scope?"
    - "How should simultaneous amendments be serialized and revoked?"
  open_questions_zh:
    - "Policy Store 应如何确认成功 Amendment，并暴露其 Matching Scope 与 Revision？"
    - "Enterprise Policy 应如何覆盖或禁止用户请求的 Persistent Amendment？"
    - "请求 Persistence 却被降级到 Session Scope 时，应向用户显示什么结果？"
    - "并发 Amendment 应如何串行化与撤销？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "context", "evidence", "technical-analysis", "governance-implications", "limitations", "open-questions"]

  project_relevance:
    status: "none"
    projects: []
    rationale: "The conclusion concerns approval and policy architecture generally; no first-party project is required to support the core argument."
    rationale_zh: "该结论讨论通用 Approval 与 Policy Architecture，不需要任何第一方项目来支撑核心论点。"
```

## Bounded judgment / 有界判断

Unifying approval vocabulary is useful only when the system keeps **requested consent** and **effective policy** distinguishable. The shared decision can carry intent across components, but durable policy change becomes trustworthy only when scope, persistence outcome and domain validity are separately observable.

统一 Approval Vocabulary 的价值，建立在系统仍能区分**请求的同意**与**实际生效的策略**之上。Shared Decision 可以跨组件携带 Intent，但只有当 Scope、Persistence Outcome 与 Domain Validity 均可独立观测时，Durable Policy Change 才具备可治理性。
