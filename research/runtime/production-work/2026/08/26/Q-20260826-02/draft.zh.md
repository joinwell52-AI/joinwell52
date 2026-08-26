---
schema: publication-candidate-article/v2
title: "权限权威属于附件"
date: '2026-08-26'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "Where should authoritative permission and connected-tool state live when multiple app/runtime contexts coexist?"
summary: "Codex 的一项已合并变更把 MCP Permission Profile 绑定到 Enabled Server，并在 Attachment Authority 无法解析时拒绝 Call Preparation。该架构收窄 Authority Ownership 与 Refresh Scope，但不能证明分布式 Revocation 或通用 Race Freedom。"
cover: staging/publication-candidates/2026-08-26-permission-authority-belongs-to-attachment-cover.png
sources:
  - research/analysis/Q-20260826-02-attachment-owned-permission-authority.md
---

![权限权威属于附件题图](staging/publication-candidates/2026-08-26-permission-authority-belongs-to-attachment-cover.png)

# 权限权威属于附件

同一个 MCP Server 可以出现在多个 Runtime Context 中，但这些 Context 未必共享同一份 Permission Authority。把 Server Identity 当成一个 Ambient Authorization Profile，会产生两种对称故障：Call 可能继承 Attachment Owner 从未授予的权力，也可能因为另一个 Context 的 Refresh 而失去原本有效的 Authority。

Codex 在 2026-08-25 合并的一项维护者变更把 Ownership Boundary 显式化。Runtime Publication 现在为每个 Enabled MCP Server 记录 `PermissionProfile`。如果无法解析 Server 的 Attachment Authority，配置中就不会出现对应 Profile，Call Preparation 也不会生成 Prepared Call。后续 Approval、Elicitation 与 Sandbox-sensitive Behavior 使用 Server-specific Profile，而不是假设一个 Thread-wide Profile。

架构命题是：**Shared Resource Identity 不等于 Shared Permission Authority。** Authority 应由其所治理的 Attachment/Runtime Lifecycle 拥有；Authority 缺失时应拒绝，而不是回退到更宽泛的 Scope。

## Ambient Execution Context 不是安全的 Authority Source

Thread-wide Sandbox Profile 很方便，因为 Call 发生时它已经存在。但方便不等于 Ownership。MCP Server 可能通过 Executor Environment 或 App Attachment 启用，其 Permission Boundary 与 Active Thread 不同。

回退到 Thread Authority 会混合两个问题：“这个 Call 在哪里执行？”以及“谁授权这个 Server 暴露这些 Tool？”简单系统中两者可能重合，但 Attachment-based Platform 必须分别表达。

Per-server Map 在 Runtime-publication 时回答第二个问题。Authority 根据 Enabled Server 与其 Attachment/Environment Context 解析。解析失败就没有 Entry。这个缺失具有语义：它阻止 Unresolved Server 仅因为 Call Path 需要一个值，就继承 Ambient Profile。

## Preparation 捕获 Lifecycle-specific Authority Snapshot

Call-preparation Boundary 把 Published Configuration 变成可执行 Invariant。只有目标 Server 存在 Profile 时，Call 才能准备；一旦准备完成，它就从捕获的 Immutable Runtime Configuration 读取 Authority。

这让 Refresh 的含义更清楚。新发布 Runtime 可以包含变更后的 Server Profile，而由旧 Snapshot 准备的 Call 可以保留它捕获的 Authority。这是 Lifecycle Consistency，不是即时 Distributed Revocation。如果系统要求立刻撤销 In-flight 或 Already-prepared Work，还需要独立的 Lease、Epoch 或 Cancellation Mechanism。

Threadless Operation 也体现了同一区别。没有 Active Thread 的 Discovery 与 Resource Read 获得显式 Default Profile，而不是意外借用 Active-thread Execution Power。显式默认值更容易审查，但现有变更不能证明该 Default 适合所有未来 Threadless Operation。

## Scope Ownership 让 Refresh Blast Radius 可审计

Permission State 需要 Owner、Lifetime 与 Replacement Rule。Refresh 应说明它替换哪个 Attachment Snapshot，以及哪些 Prepared Operation 继续绑定旧版本。Telemetry 应记录 Server Identity、Authority Owner、Profile Version 与 Decision Point，便于后续解释 Approval 或 Rejection。

Shared Fact 与 Scoped Authority 也应保持分离。两个 Session 可以指向同一个 Server Endpoint，同时拥有不同 Permission。规范化 Resource Identity 不应强迫 Mutable Authorization State 进入 Singleton。

这种设计可能引入重复，真正的 Global Policy 也仍然存在。但 Global Policy 应建模为显式 Higher-scope Authority，而不是从一个恰好方便访问的 Shared Mutable Object 偶然产生。

## 更窄的 Owner 不是完整 Authorization Proof

已合并代码与测试建立了具体 MCP Runtime Boundary：Per-server Published Profile、Authority 缺失时的 Preparation-time Refusal，以及已展示下游路径中的 Server-owned Permission Use。它们不能证明 Upstream Attachment Resolver 总能选择正确 Policy，也不能证明所有 Capability 都遵循同一模型，或 Profile Change 跨 Process 一致。

这些证据同样不能建立通用 Race Freedom 或 Exactly-once Authorization Update。Already-prepared Call 的 Revocation 仍是独立合同。可辩护结论更窄也更有用：把 Authority 绑定到拥有 Server 的 Lifecycle Scope，能够在已展示 Refresh 行为中减少意外扩权与无关 Authority Loss。

剩余工作是让 Versioning、Revocation 与 Audit Semantics 像 Ownership Boundary 一样显式。

**一手证据：** [Codex 已合并提交 4213b38f](https://github.com/openai/codex/commit/4213b38f3c555049bf6f494065698a3dfe587c16)。实现与 Regression 支持有界的 MCP Attachment-authority 结论，但不是分布式 Authorization Correctness 的独立证明。
