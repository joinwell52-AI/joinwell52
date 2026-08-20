---
schema: publication-candidate-article/v2
title: "历史记录不是跨 Agent 传输契约"
date: '2026-08-20'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "Should cross-agent history be replayed as stored, or reconstructed as a policy-governed projection of mixed-trust local state?"
summary: "在本地合法的 Session Event，并不自动获得发送给另一个 Agent 的授权。同日 Google ADK 修复说明：Cross-agent Context 应在 Rendering 抹去识别敏感控制材料所需的语义结构之前完成 Policy Projection。"
cover: staging/publication-candidates/2026-08-20-history-is-not-transfer-contract-cover.png
sources:
  - research/analysis/Q-20260820-02-policy-enforcing-history-projection.md
---

![历史记录不是跨 Agent 传输契约题图](staging/publication-candidates/2026-08-20-history-is-not-transfer-contract-cover.png)

# 历史记录不是跨 Agent 传输契约

同一个 Session Event，可以在本地是合法证据，到了远端却变成未授权披露。本地 Runtime 可能需要保留携带凭据的 Control Call，用于恢复或审计；Remote Agent 却没有接收该 Payload 的权限。所谓“重放目前为止的对话”，很容易把这两个决定误当成同一个决定。

2026 年 8 月 20 日合并的一项 Google ADK 变更，在具体 A2A 路径上暴露了这个问题。`RemoteA2aAgent` 会从 Local Session History 重建 Outbound Message。修复会先从 Outbound Representation 中删除携带凭据的 Request Function Call，然后才进入 Other-agent Rendering，避免结构化参数被摊平成普通文本。原始 Local Event 保持完整，非秘密 Sibling 也会保留。

该机制支持一条更广泛的架构规则：**Cross-agent History 应是对 Mixed-trust Local State 的 Destination-specific Policy Projection，而不是 Transparent Replay；Projection 必须在 Security-relevant Structure 仍然存在时发生。**

## Retention Authority 与 Disclosure Authority 不是一回事

传统 Conversation Log 暗示存在一条规范序列，可以在任何需要上下文的地方原样 Replay。多 Agent 系统打破了这个前提。Session State 可能同时包含用户可见文本、Tool Call、Tool Result、Authentication Control Data、Diagnostic Evidence 与内部 Orchestration Event。这些内容未必共享同一个 Disclosure Scope。

从本地存储删除所有敏感 Event，可以降低外发风险，却牺牲恢复与审计证据。转发完整 Event 可以保留 Fidelity，却默认 Destination 与本地属于同一 Trust Domain。真实需求不是二选一，而是：本地保留完整证据，同时只为特定 Peer 派生获得授权的 Context。

ADK 修复使用 Deep-copied Outbound Representation 实现这一分离。过滤只改变 Transferable View，不会修改原始 Session Event。它可以删除携带 Credential 的 Function-call Part，同时保留普通 Text Sibling 与允许传输的 Control Material。

## Representation Order 本身就是安全边界

Scrub 的时点不是普通实现细节。Structured Function Call 仍携带 Semantic Identity：已知 Request-call Name、嵌套 `AuthConfig` Shape 与不同 Sibling Part。面向另一个 Agent 的 Rendering 可能把参数内联为文本；转换完成后，Runtime 很难再可靠判断哪些字符来自 Credential Field，哪些只是普通 Conversation。

因此，Pre-render Filtering 可以依据 Typed Structure 做策略判断；Post-render Redaction 却要从扁平文本中重新猜测语义，更容易漏掉秘密或误删正常上下文。

当前 Detector 结合已知 Credential-call Name 与建模后的 Nested Shape。测试表明，它会保留普通顶层 `auth_scheme` 调用、Text Sibling 与 Mock-auth Prompt。这比“发现一个可疑 Part 就删除整个 Event”更精确，但结论也必须有界：Name-and-shape Inference 并不是通用 Sensitivity System。

## Destination Projection 产生两个有用视图

Local View 回答 Runtime 为审计、恢复和解释必须保留什么；Outbound View 回答当前 Destination 被授权接收什么。两者可以来自同一个 Event，但需要不同 Schema，或者至少需要不同 Policy Lens。

显式 Projection Stage 还为 Handoff Pipeline 提供了可治理的位置。它可以在 Serialization 或 Natural-language Rendering 前运行，记录是哪条 Policy 决定排除内容，并生成“材料被有意阻止外发”的 Audit Fact——同时不把 Secret 再复制进审计记录。

更长期的做法，是让 Sensitive Control Event 携带持久 Semantic Identity 与 Disclosure Identity，以减少对中央 Function-name List 与 Payload Shape 的依赖。但 Label 也不会自动解决问题：所有 Producer 必须正确标注，Rendering、Tracing 与 Persistence 的每次转换都必须保留这些标签。

## 一条路径完成 Scrub，不等于 A2A Confidentiality

现有证据只覆盖一个已合并的 `RemoteA2aAgent` Reconstruction Path 及其测试。它没有建立所有 Outbound Adapter、Retry Path 或未来 Protocol Transformation 都使用同一 Filter，也不会认证 Remote Peer、加密剩余 Message 或保护本地存储的 Secret。

因此，Selective Projection 是 Disclosure Control，不是完整 Confidentiality System。Transport Trust、Peer Authorization、Local Retention Policy 与 Diagnostic Export 仍是独立边界。

尚未解决的工程问题，是如何让 Projection 既强制又可证明。每个 Session-event Part 能否携带在 Rendering 与 Persistence 中持续存在的 Disclosure Label？Runtime 如何证明所有 Outbound Adapter 都经过同一个 Projection Point？什么 Audit Evidence 能证明系统有意阻止材料外发，同时不复制被阻止的材料？把 History 当作 Transfer Contract 会遮蔽这些问题；把它当作受 Policy 治理的 Source Material，才能把问题变成可执行约束。

**一手证据：** [Google ADK Python 合并提交 2aea8595](https://github.com/google/adk-python/commit/2aea8595fb1c5e0fddef7893a1985dc96dc82692)。公开实现与测试支持本文描述的有界重建行为，但不构成一般 A2A Confidentiality 的独立证明。
