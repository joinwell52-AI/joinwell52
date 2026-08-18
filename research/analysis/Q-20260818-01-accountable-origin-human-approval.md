---
schema: "research-analysis/v1"
id: "AN-20260818-01"
date: "2026-08-18"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260818-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260818-01-a2a-human-confirmation-trust-boundary.md"
output_contract: "Research Object"
research_object: "Accountable Approval Origin as a Separate Trust Boundary"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Accountable Approval Origin as a Separate Trust Boundary

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-18 Reading Result for Q-20260818-01. The Google ADK merged code and regression tests are bounded implementation facts. The broader conclusions are architectural interpretations about approval provenance in agent and digital-employee systems; they do not establish complete HITL security, human identity, cryptographic provenance, or end-to-end authorization.

本对象仅分析 Q-20260818-01 的 2026-08-18 已完成 Reading Result。Google ADK 的已合并代码与回归测试属于有界实现事实。更广泛的结论属于对 Agent 与数字员工系统中审批来源的架构解释；它们不构成完整 HITL 安全、真人身份、密码学来源证明或端到端授权的证明。

```yaml
analysis:
  research_question: "What must an agent runtime know before it may treat a syntactically valid user-role response as an accountable human approval?"
  research_question_zh: "Agent Runtime 在把一个语法上有效的 user-role 响应视为可追责的真人审批之前，必须知道什么？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The merged ADK change always marks A2A-originated invocations with receiver-owned a2a_metadata, including requests whose peer metadata is empty or absent."
      claim_zh: "已合并的 ADK 变更会始终以接收端写入的 a2a_metadata 标记 A2A 来源 Invocation，即使对端 Metadata 为空或缺失也不会丢失该来源标记。"
      source: "research/reading/Q-20260818-01-a2a-human-confirmation-trust-boundary.md"
      strength: "direct merged-code and regression-test evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "The changed confirmation processor returns before confirmation-event resolution when the A2A marker is present, so an A2A-originated FunctionResponse does not satisfy the demonstrated pending human confirmation."
      claim_zh: "当 A2A Marker 存在时，变更后的确认处理器会在解析确认事件之前返回，因此 A2A 来源的 FunctionResponse 不能满足已演示的待处理真人确认。"
      source: "research/reading/Q-20260818-01-a2a-human-confirmation-trust-boundary.md"
      strength: "direct merged-code and regression-test evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "Regression coverage includes both metadata-present and no-metadata A2A requests, closing the demonstrated marker-suppression path."
      claim_zh: "回归测试同时覆盖带 Metadata 与无 Metadata 的 A2A 请求，从而封闭了已演示的来源标记消失路径。"
      source: "research/reading/Q-20260818-01-a2a-human-confirmation-trust-boundary.md"
      strength: "direct test evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "The demonstrated mechanism does not authenticate the eventual human approver, establish cryptographic provenance, or prove coverage of every transport and confirmation processor."
      claim_zh: "已证明的机制不会认证最终真人审批者身份，不建立密码学来源证明，也未证明覆盖所有 Transport 与确认处理器。"
      source: "research/reading/Q-20260818-01-a2a-human-confirmation-trust-boundary.md"
      strength: "direct source limitation"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Content role and accountable approval authority are different dimensions: role=user describes message semantics, while approval authority requires provenance about which trust domain produced the response."
      claim_zh: "Content Role 与可追责审批权是不同维度：role=user 描述消息语义，而审批权还需要知道该响应来自哪个 Trust Domain。"
      source: "E1,E2,E3,E4"
      strength: "bounded architectural interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "A receiver-owned origin marker can support fail-closed rejection of a remote-agent approval class, but it is only one layer in a complete approval chain."
      claim_zh: "接收端拥有的 Origin Marker 可以支持对一类远程 Agent 审批进行 Fail-closed 拒绝，但它只是完整审批链中的一层。"
      source: "E1,E2,E4"
      strength: "bounded architectural interpretation"
      independent: false

  observations:
    - "The security decision depends on provenance that the receiver establishes, not on metadata the remote peer is allowed to omit."
    - "The gate is evaluated before normal confirmation matching, so origin qualification precedes semantic acceptance of the response."
    - "The mechanism rejects a whole remote-origin class rather than attempting to infer that a remote agent is an authorized human surrogate."
  observations_zh:
    - "安全决定依赖接收端建立的来源信息，而不是依赖远程对端可以省略的 Metadata。"
    - "门禁发生在正常确认匹配之前，因此先做来源资格判断，再考虑响应的语义接受。"
    - "该机制直接拒绝整个远程来源类别，而不是尝试推断某个远程 Agent 是否可替代真人审批者。"

  comparisons:
    - "Treating role=user as sufficient approval authority collapses message semantics and actor provenance into one field."
    - "Trusting peer-supplied metadata to assert trusted origin leaves the trust decision partly controlled by the peer being evaluated."
    - "A receiver-owned origin marker is stronger for origin classification, but a separately authenticated human identity is still needed for positive authorization."
  comparisons_zh:
    - "把 role=user 当作充分审批权，会把消息语义与 Actor Provenance 压缩成同一个字段。"
    - "依赖对端自报 Metadata 来声明可信来源，会让被评估的对端参与控制信任判断。"
    - "接收端拥有的 Origin Marker 更适合做来源分类，但真正的正向授权仍需要独立认证的真人身份。"

  counterarguments:
    - "In a closed deployment where every remote peer is itself an accountable principal, a blanket A2A rejection may be unnecessarily coarse."
    - "A richer capability or delegation model could authorize specific non-human approvers for narrowly defined operations without pretending they are human."
    - "Origin classification alone does not solve stale approval, replay, approver authorization scope, or mixed-origin workflow transitions."
  counterarguments_zh:
    - "在所有远程对端本身都是可追责 Principal 的封闭部署中，对 A2A 一律拒绝可能过于粗粒度。"
    - "更丰富的 Capability 或 Delegation 模型可以对特定非真人审批者授予狭窄操作权限，而不必把它们伪装成真人。"
    - "仅做来源分类仍无法解决陈旧审批、重放、审批者授权范围以及 Mixed-origin Workflow 转换问题。"

  research_judgment: "Human approval in an agent runtime should be modeled as an accountable-origin authorization event, not as a property of user-role content. The runtime should first qualify the response origin using receiver-controlled provenance, then authenticate and authorize the positive approver through an allowed human channel, and preserve that distinction in durable evidence. The ADK change demonstrates the negative half of this pattern by preventing A2A-originated responses from satisfying the human-confirmation gate; it does not demonstrate the complete positive human-authorization chain."
  research_judgment_zh: "Agent Runtime 中的真人审批应被建模为可追责来源的授权事件，而不是 user-role 内容本身的属性。Runtime 应先使用接收端控制的 Provenance 判断响应来源资格，再通过允许的真人通道认证并授权正向审批者，并在持久证据中保留这一区分。ADK 变更证明了这一模式的负向一半：阻止 A2A 来源响应满足真人确认门禁；它并未证明完整的正向真人授权链。"

  general_implications:
    - "Approval systems should separate content role, transport origin, principal identity, authorization scope and approval occurrence identity."
    - "Receiver-owned provenance should be established before approval matching whenever an untrusted transport can manufacture syntactically valid responses."
    - "A negative origin gate should not be reused as evidence that the allowed positive channel has authenticated the correct human."
    - "Audit records should preserve why an approval was accepted or rejected, including origin class and the authority evidence used for the positive decision."
  general_implications_zh:
    - "审批系统应分离 Content Role、Transport Origin、Principal Identity、Authorization Scope 与 Approval Occurrence Identity。"
    - "当不可信 Transport 能制造语法有效响应时，应在 Approval Matching 之前建立接收端拥有的 Provenance。"
    - "负向来源门禁不能被反向解释为允许的正向通道已经认证了正确真人。"
    - "审计记录应保留审批为何被接受或拒绝，包括 Origin Class 与正向决定使用的 Authority Evidence。"

  limitations:
    - "Evidence is one merged implementation and its repository regression tests, not an independent HITL security evaluation."
    - "The evidence does not establish how a legitimate human confirmation is authenticated or authorized on allowed channels."
    - "The coarse A2A marker may not be sufficient for mixed-origin workflows that transition from remote-agent work to a later human step."
  limitations_zh:
    - "证据来自一个已合并实现及其仓库回归测试，而不是独立 HITL 安全评估。"
    - "证据没有建立允许通道上的合法真人确认如何被认证与授权。"
    - "对于从远程 Agent 工作转换到后续真人步骤的 Mixed-origin Workflow，粗粒度 A2A Marker 可能不足。"

  open_questions:
    - "What durable identity should bind a specific human approval to the exact pending dangerous-tool occurrence?"
    - "How should legitimate delegated machine approvers be represented without confusing delegation with human identity?"
    - "Which alternate transports and HITL processors can produce confirmation responses, and what receiver-owned provenance do they carry?"
    - "How should replay, expiry and authorization-scope evidence be attached to an accepted human approval?"
  open_questions_zh:
    - "应使用什么持久身份，把一次特定真人审批绑定到确切的待处理危险工具 Occurrence？"
    - "应如何表示合法委托的机器审批者，同时避免把 Delegation 混同为真人身份？"
    - "还有哪些 Transport 与 HITL Processor 可以产生确认响应，它们携带什么接收端拥有的 Provenance？"
    - "应如何把 Replay、Expiry 与 Authorization Scope 证据附着到一次被接受的真人审批上？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence", "technical-analysis", "governance-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment concerns a general approval-provenance boundary for agent systems and does not require a first-party project to establish it."
    rationale_zh: "该判断讨论 Agent 系统的一般审批来源边界，不需要引入任何自有项目才能成立。"
```

## Bounded judgment / 有界判断

A response can look like user input and still come from the wrong authority domain. The evidence supports making accountable origin a separate prerequisite for approval acceptance; it does not support the stronger claim that the remaining human path is therefore authenticated, authorized, replay-safe or end-to-end secure.

一个响应可以在形式上看起来像用户输入，却仍来自错误的权威域。现有证据支持把“可追责来源”作为审批接受的独立前置条件；它不支持进一步声称剩余真人通道因此已经具备身份认证、授权、抗重放或端到端安全保证。
