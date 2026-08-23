---
schema: publication-candidate-article/v2
title: "创建来源应跨恢复保持稳定"
date: '2026-08-23'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "For durable agent work that can be created, forked and resumed, which provenance properties should remain stable across continuation, and which lifecycle transitions may establish a new local provenance identity?"
summary: "Creation Source 与 Derivation Lineage 回答不同问题。持久 Thread 应在 Resume 中保留 Origin，Fork 则可以采用新的 Local Classification；二者都不能被误当成经过认证的 Authority。"
cover: staging/publication-candidates/2026-08-23-creation-provenance-survives-resume-cover.png
sources:
  - research/analysis/Q-20260823-02-creation-provenance-continuity.md
---

![创建来源应跨恢复保持稳定题图](staging/publication-candidates/2026-08-23-creation-provenance-survives-resume-cover.png)

# 创建来源应跨恢复保持稳定

如果一个 Thread 上周由 Automated Review Feature 创建，它会不会因为今天由另一个 Client Resume，就变成“User Work”？如果 Fork 启动了一项新的专业任务，它是否必须假装自己与 Parent 拥有相同的 Local Role？这些不是命名细节，而是决定持久 Execution History 经多次 Lifecycle Transition 后是否仍可解释的架构问题。

Codex 在 2026-08-23 合并的一项变更明确了一个设计。新的 Exec Thread 会持久化 Source Classification；Fork 可以携带自己的 Source，同时保留 Parent Lineage；已检查的 TypeScript Resume Path 在已有 `threadId` 时，明确不会转发新的 `threadSource`。这三项行为共同支持一个双轴模型：**Creation Source 应在 Continuation 中保持稳定，而 Derivation 应与新对象的 Local Classification 分开记录。**

它改善的是 Provenance，不是 Authorization。Source 可以是应用选择的 String，因此持久化并不能认证提供它的 Actor。

## Resume 不应重标来源

Resume 是重新进入一个已有 Durable Work Identity。若每个 Caller 都能用当前 Default 替换 Source，Provenance 就会变成“最近一次 Invocation 的说明”，而不再是对象 Creation Event 的记录。同一个 Thread 可能仅因新的 SDK、Feature 或 Operator 接续执行，就反复改变表面来源。

Codex Protocol 表示 `User`、`Subagent`、`Feature(String)` 与 `MemoryConsolidation`。新 Exec Thread 会接收所选 Classification；缺失时默认 `User`。但 TypeScript SDK 只在没有现存 Thread ID 时加入 Source Flag。Regression Test 在 Resume 时传入故意冲突的值，并验证它没有被转发。

这是在一个已文档化 Handoff 上的 Continuation Invariant，并不能证明所有 Lower-level App-server Route 都绝对不可修改 Source。不过，它确定了正确默认：继续一个对象，不应改写这个对象最初如何产生。

实际系统应明确哪些 Metadata 属于 Creation，哪些允许在 Continuation 中变化。没有 Lifecycle Scope 的 Field，最终会由最后一个写入者控制。

## Fork 会产生第二条 Provenance 轴

Fork 不是 Resume。它从已有对象派生出新的 Durable Object。已合并测试展示了 Source Thread 与 Fork 可以使用不同 Classification，同时 `forked_from_id` 与 History-base Metadata 继续保留 Parent Relationship。

这种分离避免把两个问题压进同一个 Label：

- 哪个 Local Role 或 Producer 创建了当前对象？
- 当前对象由哪个更早对象及其 History 派生？

用于 Automated Review 的 Fork 可以真实标记自己的本地用途，即使 Parent 最初是 User Work；Parent Lineage 则保留 Derivation。只复制 Parent Source 会隐藏 Fork Role；用新 Source 替代 Lineage 又会隐藏 Ancestry。

这个模式同样适用于 Durable Job、Agent Session 与可重放 Workflow。Continuation-stable Metadata 与 Derivation Metadata 应建模为不同事实，并为 Creation、Resume、Fork 以及后续 Governed Repair 定义显式 Transition。

## 持久 Label 仍需要 Trust Binding

Codex 会把任意非保留 String 接纳为 `Feature(String)`。开放 Namespace 方便产品 Provenance，但也说明该 Label 受 Application Control。能够创建 Thread 的 Caller 可以选择 Feature Name；Field 本身不能证明 Caller 确实代表该 Feature、Human 已批准它，或 Policy 已授予特殊权限。

因此，Security-sensitive Decision 需要另一个 Binding：Authenticated Principal、Attested Producer、Policy Decision，或说明 Provenance 可信程度的 Signed Event。Source Classification 可以帮助筛选记录、重建历史与路由 Telemetry；在独立证据出现前，它应保持 Information Semantics。

Persistence 也遵循同一边界。Label 在 Resume 后仍存在，不等于不可变 Audit Ledger。Retention、Tamper Resistance 与 Governed Correction 都需要独立机制。Durability 回答 Value 是否仍可获得，却不回答 Value 是否真实或经过授权。

## 兼容默认值是一种解释

为了 Backward Compatibility，历史缺失 Source 会被解释为 `User`。这有利于需要确定值的代码路径，但不是“所有历史 Thread 均由 User 创建”的直接 Evidence。Analytics 或 Audit System 应能区分“Creation 时记录为 User”与“Source 缺失，由兼容 Policy 解释为 User”。

Correction 也需要同样纪律。管理员可能合理修复错误的 Creation Label；但若直接覆盖且不记录谁、为何改了什么，就会销毁评估修复所需的 Evidence。一个 Repairable Field 仍可保持 Continuation-stable，前提是 Repair 是显式 Governed Transition，而不是普通 Resume 行为。

架构检查可以很简洁：为每个 Durable Metadata Field 指明它是 Creation-scoped、Continuation-stable、Derivation-scoped 还是 Administratively Repairable；再说明它参与 Authorization 前需要什么 Trust Evidence。没有这些声明，Provenance 会逐步服从便利，而便利最终会被误认成 Authority。

**一手证据：** [OpenAI Codex 已合并提交 a73485dc](https://github.com/openai/codex/commit/a73485dc76e5b2d31d28109a57f6876f4e1dcc24)。公开代码与测试支持本文描述的 Create、Fork 与 TypeScript Resume 有界行为，但不是通用 Provenance 或 Authorization Model 的独立验证。
