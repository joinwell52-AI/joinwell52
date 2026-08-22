---
schema: publication-candidate-article/v2
title: "审批必须绑定批准者"
date: '2026-08-21'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "In agent systems where a human approval can be relayed through multiple transports, what evidence should establish approval authority without confusing the delivery channel with the approving principal?"
summary: "Transport 可以告诉 Agent System 一条 Approval-shaped Message 如何抵达，却不能说明谁有权批准准确动作。同日 Google ADK Revert 暴露了 Channel Gating 为什么会同时过宽且不完整。"
cover: staging/publication-candidates/2026-08-21-approval-must-name-approver-cover-v2.png
sources:
  - research/analysis/Q-20260821-02-principal-bound-approval-authority.md
---

![审批必须绑定批准者题图](staging/publication-candidates/2026-08-21-approval-must-name-approver-cover-v2.png)

# 审批必须绑定批准者

一条 Confirmation 经 A2A 抵达 Agent。它究竟来自试图伪造 Human Consent 的 Peer，还是来自合法 Operator、只是决策恰好经过这条 Relay？Transport Marker 可以区分路线，却无法回答 Authorization 问题。

Google ADK 在 2026 年 8 月 21 日合并的变更中正面遇到了这个错位。此前一项 Mitigation 只要发现 A2A Metadata，就拒绝 Tool Confirmation。所选提交回退了这项 Guard：它会阻止经 A2A 传递的合法 Operator Approval，却没有覆盖 Issue Reporter 描述的其他等价 Confirmation-shaped Ingress，包括 HTTP Path。底层 Issue 被明确重新打开，已展示的 Confirmation Path 也没有增加替代性的 Principal Identifier、Signature、Credential 或 Verifier。

准确结论并不是 Transport Metadata 没有安全价值，而是：**Human Approval 必须把经过认证的 Approving Principal 绑定到准确 Pending Action；Transport Provenance 只是辅助 Context，不是 Authority。**

## 路线不是 Actor

被回退的 Mitigation 把 `a2a_metadata` 当作 Trust Proxy。Review 一度让这个 Marker 对所有 A2A Request 都存在，即使 Protocol Metadata 为空。Confirmation Processing 随后只要看到 Marker 就提前返回。规则确定、容易测试，但它识别的是 Route，而不是有权作出决定的人或服务。

这种区别会制造两个方向的错误。合法 Operator 可能通过 Local Interface、Hosted Relay 或 A2A-served Agent 发送同一份 Approval。阻断 A2A Route，会在 Identity 与 Policy 原本允许动作的情况下仍拒绝 Operator。反过来，非 Operator 可能经一个被接受的 Endpoint 构造 User-role、Confirmation-shaped Input。Route 被允许，不会使 Actor 自动获得授权。

Protocol Role 也有相同局限。标记为 `user` 的消息只表达 Conversation Model 中的语义角色，不能证明 Sender 就是被指定批准某个 Tool Call 的 Human Principal。

## Guard 同时过宽且不完整

所选 Revert 删除 A2A-marker Early Return，恢复正常 Confirmation Flow；同时让空 A2A Metadata 不再生成合成 Marker。此前断言 A2A Confirmation 应被忽略的测试也随 Guard 一起删除。

这是 Issue Governance 保持透明的证据，却不是 Authorization 已修复的证据。维护者明确重新打开底层 Issue。Reporter 对 Confused-deputy Path 的分析与复现描述仍是一手 Issue Evidence；本 Research Center 分析没有独立执行 Exploit。每个 ADK Deployment 的 Authentication Layer 与暴露 Endpoint 状态，也超出所选提交能够建立的范围。

但这种 Failure Pattern 具有一般性。Channel Block 可以减少 Threat Model 中的一条路径；只要相同 Trusted Action Shape 还能从其他 Ingress 进入，它就不能证明由谁批准。若合法 Principal 也会使用被阻断 Channel，Mitigation 还会一并移除正常功能。

## 把 Approval 建模为 Principal-bound Object

一份可跨 Transport 的 Approval Contract 至少应保留四种绑定：

- 可端到端携带或解析的 Approving-principal Authentication Evidence；
- 准确 Pending Tool Call、Parameter 与预期 Effect 的稳定 Identity；
- 该 Principal 可以授权动作的 Scope 或 Policy；
- 防止 Replay 的 Freshness Evidence，例如 Nonce、Expiry 或 Session Binding。

Transport 在这份记录中仍然有用。它可以贡献 Risk Context、决定需要哪类 Verifier，并帮助 Audit Reconstruction；它只是不能替代 Principal Field。Session、Relay、Protocol Role 与 Authorization Policy 应分别记录。

这种模型也约束 Intermediary。Relay 可以忠实传递 Approval，却不应因此获得合成新 Approval 的 Authority。这需要 End-to-end Attribution：系统核验绑定原始 Approver 与 Pending Action 的 Evidence，而不是假定任何从 Relay 输出的消息都继承 Operator Authority。

## Revert 让替代设计保持开放

所选提交是 Revert，不是 Replacement Security Mechanism。它证明旧 Proxy 回答了错误问题，也证明合法 Flow 必须恢复；但它没有披露 ADK 将选择哪种 Principal Representation、Approval 如何绑定 Call Parameter，或 Local UI、A2A、HTTP 与 Hosted Relay 之间如何防止 Replay。

这些空缺定义了下一轮 Regression Matrix。测试应区分 Forged Role Metadata 与 Authenticated Approval、同一 Principal 的 Alternate Ingress、Replay 与 Fresh Consent，以及 Legitimate Relay 与 Authority Delegation。部署指南还必须说明哪些 Server Endpoint 会认证 Caller，以及缺少 Principal Binding 时 `require_confirmation` 能提供什么、不能提供什么。

Approval 不会因为来自某条偏好 Channel 或携带正确 Conversation Role 就获得 Authority。只有系统能够命名并核验 Approver，把 Authority 绑定到精确 Pending Effect，并证明决策仍然 Fresh，它才是一份真正的授权。

**一手证据：** [Google ADK Revert 提交 9a32eba1](https://github.com/google/adk-python/commit/9a32eba1e271981fd079bdee489b9159c6ecc72a)、[Issue #6461](https://github.com/google/adk-python/issues/6461) 与[被回退的 PR #6462](https://github.com/google/adk-python/pull/6462)。Issue 中的威胁复现属于 Reporter Evidence，本分析没有独立复现。
