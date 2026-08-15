---
title: "安全的 Agent 交接必须分开路由所有权与外部效果所有权"
date: '2026-08-15'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "What ownership facts must an agent runtime separate when background tool work may outlive the agent that created it during handoff or teardown?"
summary: "Agent Handoff 是一次 Ownership Transfer，而不只是 Active Agent 名称变化。本地执行取消、路由退出、已观察任务终止与外部效果核对是不同事实；近期一个 ADK 改动展示了较强的本地 Cleanup 与 Routing Revocation，但 External-effect Closure 明确不在其保证范围内。"
sources:
  - research/analysis/Q-20260815-03-handoff-routing-effect-ownership.md
  - research/reading/Q-20260815-03-live-background-tool-task-lifecycle-ownership.md
item_id: "Q-20260815-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-15-agent-handoff-ownership-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-15-agent-handoff-ownership-cover.png"
  kicker="开源工程 · 每日研究"
  title="安全的 Agent 交接必须分开路由所有权与外部效果所有权"
  summary="Agent Handoff 是一次 Ownership Transfer，而不只是 Active Agent 名称变化。本地执行取消、路由退出、已观察任务终止与外部效果核对是不同事实；近期一个 ADK 改动展示了较强的本地 Cleanup 与 Routing Revocation，但 External-effect Closure 明确不在其保证范围内。"
  version="Q-20260815-03"
  status="Daily Runtime V5 · 2026-08-15"
  languageHref="/en/engineering/2026-08-15-agent-handoff-ownership"
  languageLabel="English"
/>

# 安全的 Agent 交接必须分开路由所有权与外部效果所有权

Agent Handoff 经常被描述成一个很简单的动作：Agent A 停止，Agent B 接手，会话继续。但如果 Agent A 已经在后台启动 Streaming Tool 或 Non-blocking Tool Task，这个描述就不够了。

旧 Agent 可以不再是界面上的 Active Owner，但它创建的 Task 仍然可能运行；某个 Tool 可以不再收到新输入，但它先前发出的外部 API 请求仍在继续；Runtime 也可以已经发出 Cancellation，却仍无法证明底层工作真正终止。

2026-08-15 的研究对象分析了 Google ADK 中一个已经合并的改动以及相关回归测试，证据范围限定在本地 `asyncio` 生命周期行为，不包含 Distributed Revocation 或 Exactly-once External Effect。在这个边界内，它揭示了一个很有价值的工程模型：**Execution Ownership、Routing Ownership、已观察到的 Task Termination 与 External-effect Ownership 必须分别记录。**

## Handoff 本质上是所有权转移

所选改动让一个 Live Agent Run 对 Streaming 与 Non-blocking Background Task 负责，并在 Handoff 之前以及外层 `run_live` 的 finally 路径执行 Cleanup。

Pre-handoff Cleanup 很重要，因为共享 Live Request Queue 本身就是一种 Ownership Surface。如果下一 Agent 已经开始消费这条 Route，而上一 Agent 的 Background Tool 仍然保留在 Registry 中，旧 Tool 就可能继续收到已经属于新 Owner 的 Live Input。

因此，更准确的模型不是“换了一个 Agent 名称”，而是“转移了一组 Claim”。上一 Run 应先释放自己持有的 Execution 与 Routing Resource，再允许下一 Run 把这些资源视为自己的运行边界。

## 已请求取消，不等于 Task 已停止

Cleanup 会取消 Pending Background Task，并最多等待 1 秒；已经完成的 Task 还会读取其异常。即使有 Cancellation-resistant Task 仍然存活，Streaming 与 Non-blocking Registry 也会被清空。

这个 Bounded Wait 实际上是一种可用性取舍。无限等待 Cooperative Cancellation 可以追求更高的 Cleanup 确定性，却可能让整个 Handoff 被一个不合作的 Tool 挟持。有限等待保护 Runtime Liveness，但它会产生一个系统不应该隐藏的状态：**Residual Work 仍可能存在。**

对低风险本地 Helper 来说，“已请求 Cancellation + Registry 已清理”可能已经足够；但对高风险 Tool，Runtime 可能必须在继续之前拿到更强的 Termination Evidence。策略应该按照 Tool Risk Class 决定，而不能把同一个 Timeout 解释成所有工作都已经确定终止。

## Routing Retirement 是真实保证，但它比 Effect Closure 更窄

所选机制会清理那些用于把未来 Live Input 路由给旧 Streaming Tool 的 Registry。这意味着 Handoff 之后，陈旧 Tool 不再属于共享路由成员。

这是有实际价值的保证，因为它阻止了一类 Ownership Leak：Orphaned Background Task 不会继续收到后续会话输入。

但 Routing Retired 并不能说明此前已经发出的外部动作发生了什么。底层 Coroutine 可能仍活着；远程 HTTP 请求可能已经被服务端接收；Message、Payment、Database Mutation 或 Job Submission 也可能已经存在于 Runtime 之外。

所以 Routing Ownership 与 Effect Ownership 不能合并成一个状态。

## 外部效果需要 Provider-specific Evidence

本地 Coroutine Cancellation 没有权力回滚外部世界。一旦操作越过 Provider Boundary，Runtime 就需要使用目标系统真正支持的机制。

有些 Provider 支持 Cancellable Job；有些支持 Idempotency Key，让重复请求收敛到同一个 Effect；有些操作存在可靠 Compensation；还有一些只能执行 Reconciliation——先查询远端真实状态，再判断是否需要重试或修复。

因此，通用 Agent Runtime 不应从“Local Task Canceled”推出“External Effect Closed”。证据链必须明确说明 Provider 侧到底发生了什么。

## 一个更准确的 Handoff 顺序

更稳健的链条可以表达为：

**已请求 Cancellation → Routing Ownership 已退出 → 已观察 Task Termination 或声明 Residual Work → External Effect 独立完成 Reconciliation**。

每一个里程碑回答的是不同问题。Cancellation Requested 记录 Runtime 的意图；Routing Retirement 证明旧 Task 不能再消费共享输入；Termination Observation 说明本地执行是否真正结束；Residual-work Declaration 保存无法证明终止时的不确定性；External-effect Reconciliation 则判断 Runtime 外部是否仍存在需要处理的真实效果。

这类分离对恢复和可观测性都很重要。如果 Dashboard 或 Audit Trail 最终只显示一个“Cleanup Completed”，它恰恰可能隐藏 Handoff 后最危险的不确定性。

## 工程含义

Agent-run Ownership 应覆盖所有可能写入共享 Runtime Channel 的本地异步工作；Handoff 应在下一 Owner 开始消费共享 Route 之前撤销上一 Owner 的 Routing Membership；Bounded Teardown 在无法证明 Termination 时应明确暴露 Residual Work；Operational Telemetry 则应把 Cancellation Requested、Task Stopped、Routing Retired 和 External Effect Reconciled 分成不同事件。

外部 Side-effect Safety 应按 Tool 或 Provider 设计，通过 Idempotency、Cancellable Job、Compensation 或 Reconciliation 建立。Local Cancellation 是执行机制，不是通用事务边界。

## 什么时候可以采用更简单的模型

不是每个 Agent Tool 都需要 Durable Residual-work Ledger。一个短时、本地、没有持久外部效果的 Helper，使用 Best-effort 1 秒 Cancellation 加日志，可能已经足够。把每个短暂 Coroutine 都持久化也会引入与风险不成比例的复杂度。

因此架构应当 Risk-sensitive。但语义诚实应该保持不变：没有证明 Termination，就不要说已经证明；没有核对 External Effect，就不要推断它已经消失。

## 证据边界

本文证据只覆盖 ADK 本地 `asyncio` 与 Live-request 执行，不包括 Remote Worker、Subprocess、Durable Job Queue、Distributed Revocation、Forced Termination、Transaction Rollback、Compensation Correctness 或 Exactly-once External Effect。

其中 1 秒 Timeout 是实现常量，不是不同 Tool Class 的最佳 SLA 证据。

## 仍待回答的问题

哪些 Tool Risk Class 应要求 Handoff 一直阻塞到 Termination 被证明，而不能只确认 Routing Ownership 已释放？Residual Local/Remote Work 应如何持久表达，才能让后续 Agent 知道某个 Effect 仍可能在进行？什么样的通用 Evidence Contract 可以把本地 Cancellation State 与 Provider 侧 Idempotency、Compensation 和 Reconciliation Outcome 连接起来？

安全 Handoff 不需要假装旧 Task 全部消失，而需要 Runtime 精确知道：哪些 Ownership Claim 已经释放、哪些事实仍不确定、哪些外部 Effect 还需要独立证据。
