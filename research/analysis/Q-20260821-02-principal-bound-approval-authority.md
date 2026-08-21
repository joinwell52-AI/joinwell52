---
schema: "research-analysis/v1"
id: "AN-20260821-02"
date: "2026-08-21"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260821-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260821-02-approval-principal-vs-transport-boundary.md"
output_contract: "Research Object"
research_object: "Human Approval Authority Must Bind to the Principal, Not the Transport"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Human Approval Authority Must Bind to the Principal, Not the Transport

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-21 Reading Result for Q-20260821-02. The Google ADK evidence establishes that an A2A-transport marker was used as a proxy for approval trust, was then reverted because it rejected legitimate operator approvals traveling over A2A while leaving equivalent approval-shaped input reachable through other ingress, and did not introduce a replacement principal-bound mechanism. The analysis below treats this as evidence about authorization architecture, not proof that the reported vulnerability has been independently reproduced or solved.

本对象仅分析 Q-20260821-02 的 2026-08-21 已完成 Reading Result。Google ADK 的证据表明：系统曾把 A2A Transport Marker 当作 Approval Trust 的代理，随后因为它会拒绝经 A2A 传递的合法 Operator Approval、却仍无法阻止其他入口的等价 Approval-shaped Input 而回退，并且所选提交没有增加替代性的 Principal-bound Mechanism。下述分析把它作为 Authorization Architecture 的证据，而不是把报告的漏洞描述为已经独立复现或已经解决。

```yaml
analysis:
  research_question: "In agent systems where a human approval can be relayed through multiple transports, what evidence should establish approval authority without confusing the delivery channel with the approving principal?"
  research_question_zh: "在 Human Approval 可以经多个 Transport Relay 的 Agent System 中，应由什么 Evidence 建立 Approval Authority，才能避免把 Delivery Channel 与真正 Approving Principal 混为一谈？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The selected ADK commit explicitly reverts an A2A-metadata-based confirmation guard and reopens the underlying issue."
      claim_zh: "所选 ADK 提交明确回退基于 A2A Metadata 的 Confirmation Guard，并重新打开底层 Issue。"
      source: "research/reading/Q-20260821-02-approval-principal-vs-transport-boundary.md"
      strength: "merged maintainer change and issue-state evidence"
      independent: false
    - id: "E2"
      identity: "source-reported-claim"
      claim: "The reporter describes a confused-deputy path where A2A-originated content can become user-role confirmation-shaped input and also identifies equivalent approval ingress through exposed HTTP run endpoints."
      claim_zh: "Reporter 描述了一个 Confused-deputy Path：A2A 来源内容可以成为 User-role Confirmation-shaped Input，并同时指出暴露的 HTTP Run Endpoint 存在等价 Approval Ingress。"
      source: "research/reading/Q-20260821-02-approval-principal-vs-transport-boundary.md"
      strength: "primary issue report; not independently reproduced here"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The reverted mitigation rejected confirmations based on A2A transport metadata, including a hardened unconditional marker for empty metadata, but did not address other ingress."
      claim_zh: "被回退的 Mitigation 依据 A2A Transport Metadata 拒绝 Confirmation，包括对空 Metadata 的 Unconditional Marker 强化，但没有覆盖其他 Ingress。"
      source: "research/reading/Q-20260821-02-approval-principal-vs-transport-boundary.md"
      strength: "merged code, tests and reverted-PR evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "The selected revert removes the transport guard and adds no replacement principal identifier, signature, credential, verifier or principal-bound approval mechanism in the shown confirmation path."
      claim_zh: "所选 Revert 移除了 Transport Guard，并且在已展示 Confirmation Path 中没有增加替代的 Principal Identifier、Signature、Credential、Verifier 或 Principal-bound Approval Mechanism。"
      source: "research/reading/Q-20260821-02-approval-principal-vs-transport-boundary.md"
      strength: "direct selected-diff evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Transport provenance is contextual risk evidence, not approval authority. The authorization decision should bind an authenticated approving principal to a specific pending action and policy scope."
      claim_zh: "Transport Provenance 是 Contextual Risk Evidence，而不是 Approval Authority。Authorization Decision 应把经过认证的 Approving Principal 绑定到具体 Pending Action 与 Policy Scope。"
      source: "E1,E2,E3,E4"
      strength: "bounded architectural interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "A relayed approval can be legitimate if end-to-end principal attribution survives the relay; rejecting the relay transport itself is both overbroad and bypassable."
      claim_zh: "如果 End-to-end Principal Attribution 能穿越 Relay 保持完整，经中介转发的 Approval 仍可以合法；直接拒绝 Relay Transport 本身既过宽，也可能被绕过。"
      source: "E1,E2,E3,E4"
      strength: "bounded authorization interpretation"
      independent: false

  observations:
    - "The failed guard answered 'which transport carried this event?' while the security decision needed to answer 'which principal authorized this pending action?'."
    - "A user-role label is semantic message metadata; without principal authentication it cannot alone establish human authority."
    - "The explicit reopen is governance-significant: restoring function is separated from claiming the authorization defect is fixed."
    - "Equivalent ingress paths make channel denylisting fragile because authority can be reconstructed through another accepted route."
  observations_zh:
    - "失败 Guard 回答的是‘哪个 Transport 承载了该 Event’，而安全决策真正需要回答的是‘哪个 Principal 授权了这个 Pending Action’。"
    - "User-role Label 是语义 Message Metadata；如果缺少 Principal Authentication，它不能单独建立 Human Authority。"
    - "显式 Reopen 具有治理意义：恢复功能与宣称 Authorization Defect 已修复被清楚分离。"
    - "存在等价 Ingress Path 时，Channel Denylist 很脆弱，因为 Authority-shaped Input 可以从另一条被接受路径重建。"

  comparisons:
    - "Transport denylisting is easy to implement and observe, but conflates route with actor and creates both false positives and alternate-route bypasses."
    - "Role-label checks preserve protocol simplicity but are unsafe as authority if multiple actors can produce the same semantic role."
    - "Principal-bound approval requires stronger identity and binding evidence, but supports legitimate relays because the decision follows the actor and pending action rather than the channel."
  comparisons_zh:
    - "Transport Denylist 易实现、易观察，但会把 Route 与 Actor 混同，产生 False Positive 与 Alternate-route Bypass。"
    - "Role-label Check 保持协议简单，但如果多个 Actor 都能产生同一语义 Role，就不适合作为 Authority。"
    - "Principal-bound Approval 需要更强 Identity 与 Binding Evidence，但因为决策跟随 Actor 与 Pending Action 而非 Channel，所以可以支持合法 Relay。"

  counterarguments:
    - "Transport provenance can still be valuable as one risk signal, especially when a channel has stronger authentication guarantees than another."
    - "Principal binding does not automatically solve compromised operator sessions, coerced approvals or malicious intermediaries that can act with delegated authority."
    - "A cryptographic approval capability increases complexity and may not fit every local single-user deployment."
  counterarguments_zh:
    - "Transport Provenance 仍可作为 Risk Signal，特别是在不同 Channel 的 Authentication Guarantee 明显不同时。"
    - "Principal Binding 不会自动解决被攻陷 Operator Session、被迫 Approval 或持有合法 Delegated Authority 的恶意中介。"
    - "Cryptographic Approval Capability 会增加复杂度，也未必适用于所有本地单用户 Deployment。"

  research_judgment: "Human approval in agent systems should be modeled as a principal-bound authorization object, not as a property inferred from transport metadata or a user-role label. The approval evidence should bind the authenticated approving principal, the exact pending action, scope/policy and freshness or replay boundary; transport provenance remains supporting context. The ADK revert is evidence that channel-based gating can be simultaneously overbroad and incomplete, while the absence of a replacement mechanism means the authorization gap remains open rather than solved."
  research_judgment_zh: "Agent System 中的 Human Approval 应被建模为 Principal-bound Authorization Object，而不是从 Transport Metadata 或 User-role Label 推断出来的属性。Approval Evidence 应绑定经过认证的 Approving Principal、准确 Pending Action、Scope/Policy，以及 Freshness 或 Replay Boundary；Transport Provenance 只作为辅助上下文。ADK 的 Revert 证明 Channel-based Gating 可能同时过宽且不完整，而替代机制缺失意味着 Authorization Gap 仍保持开放，并没有被解决。"

  general_implications:
    - "Pending approvals should carry stable action identity and an unambiguous authorization scope."
    - "Approval responses should carry or resolve to principal evidence that cannot be manufactured merely by choosing a protocol role."
    - "Relay systems should preserve end-to-end approver attribution instead of collapsing the actor into the relay channel."
    - "Nonce, expiry or equivalent freshness evidence is needed when an approval can be replayed or copied across sessions."
    - "Transport, session, principal and authorization policy should be logged as separate audit facts."
  general_implications_zh:
    - "Pending Approval 应携带稳定 Action Identity 与无歧义 Authorization Scope。"
    - "Approval Response 应携带或解析到 Principal Evidence，且不能仅通过选择一个 Protocol Role 就被伪造。"
    - "Relay System 应保留 End-to-end Approver Attribution，而不是把 Actor 压缩成 Relay Channel。"
    - "当 Approval 可能跨 Session 被 Replay 或复制时，需要 Nonce、Expiry 或等价 Freshness Evidence。"
    - "Transport、Session、Principal 与 Authorization Policy 应作为独立 Audit Fact 记录。"

  limitations:
    - "The threat reproduction is reported in a primary issue; this Analysis did not independently execute the exploit."
    - "The selected commit is a revert and does not reveal the future authorization design."
    - "The evidence does not establish the authentication posture of every ADK deployment or endpoint configuration."
    - "Principal-bound approval is an architectural requirement inferred from the failure mode, not an implementation demonstrated in the selected commit."
  limitations_zh:
    - "Threat Reproduction 来自一手 Issue 报告；本 Analysis 没有独立执行 Exploit。"
    - "所选提交是 Revert，没有披露未来 Authorization Design。"
    - "证据没有建立所有 ADK Deployment 或 Endpoint Configuration 的 Authentication Posture。"
    - "Principal-bound Approval 是从 Failure Mode 推导出的架构要求，不是所选提交已经展示的实现。"

  open_questions:
    - "What principal identifier and verifier should survive local UI, A2A, HTTP and hosted relays?"
    - "How should the approval bind to the exact pending tool call, parameters and allowed effect scope?"
    - "Can legitimate intermediaries relay approvals without gaining authority to synthesize new approvals?"
    - "What minimum regression matrix should cover forged role metadata, alternate ingress, replay and authenticated relay?"
  open_questions_zh:
    - "什么 Principal Identifier 与 Verifier 应能穿越 Local UI、A2A、HTTP 与 Hosted Relay？"
    - "Approval 应如何绑定准确 Pending Tool Call、Parameters 与允许的 Effect Scope？"
    - "合法 Intermediary 如何在能够 Relay Approval 的同时，不获得合成新 Approval 的 Authority？"
    - "最小 Regression Matrix 应如何覆盖 Forged Role Metadata、Alternate Ingress、Replay 与 Authenticated Relay？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "context", "evidence", "technical-analysis", "architecture-implications", "governance-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The finding is a general human-authorization architecture issue for agent and multi-agent systems and does not depend on a first-party project."
    rationale_zh: "该结论属于 Agent 与 Multi-agent System 的一般 Human-authorization Architecture 问题，不依赖任何自有项目。"
```

## Bounded judgment / 有界判断

The decisive distinction is **transport provenance versus approving-principal authority**. Transport can raise or lower contextual risk, but it cannot substitute for evidence that the correct principal authorized the exact pending action. The selected ADK change makes the failure of that substitution visible; it does not demonstrate the replacement design.

决定性区分是 **Transport Provenance 与 Approving-principal Authority**。Transport 可以改变 Contextual Risk，却不能替代“正确 Principal 已授权准确 Pending Action”的证据。所选 ADK 变更让这种替代关系的失败变得清楚，但没有展示替代设计本身。
