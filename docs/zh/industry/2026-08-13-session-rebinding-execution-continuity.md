---
title: "会话重新连上，不等于工作已经恢复"
date: '2026-08-13'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "What does a successful session rebind establish—and what does it not establish—after the underlying runtime service changes?"
summary: "稳定的逻辑会话可以在远端 Binding 失效后重新连接，但旧 Binding 上已经运行的工作仍然会中断。Generation-scoped Identity 能阻止替代 Host 继承过期 Cell 的控制权，却不会迁移已经丢失的执行。"
sources: "research/analysis/Q-20260813-02-session-rebinding-boundary.md"
item_id: "Q-20260813-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-13-session-rebinding-execution-continuity-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-13-session-rebinding-execution-continuity-cover.png"
  kicker="行业架构 · 每日研究"
  title="会话重新连上，不等于工作已经恢复"
  summary="稳定的逻辑会话可以在远端 Binding 失效后重新连接，但旧 Binding 上已经运行的工作仍然会中断。Generation-scoped Identity 能阻止替代 Host 继承过期 Cell 的控制权，却不会迁移已经丢失的执行。"
  version="Q-20260813-02"
  status="Daily Runtime V5 · 2026-08-13"
  languageHref="/en/industry/2026-08-13-session-rebinding-execution-continuity"
  languageLabel="English"
/>

# 会话重新连上，不等于工作已经恢复

远端 Runtime 消失、客户端重新连接以后，最容易出现的一句话也是最容易造成误解的一句话：“Session 已恢复。”它至少可能指向两种完全不同的结果：Logical Session 已经可以继续承载后续操作，但原 Binding 上正在执行的工作已经结束，不会透明地接着运行。

本次选取的 Codex gRPC Code-mode 变更把这条边界具体化了。实现保留稳定的 Public Session，在远端 Binding 停止后按需替换；并发 Reopen 采用 Single-flight；每个 Binding 拥有独立 Generation。它恢复的是后续可用性，而不是声称旧的 In-flight Work 已经迁移。

这不仅是某一种 Transport 的细节。凡是用稳定的用户可见身份覆盖可替换 Worker、Host 或 Connection 的系统，都需要分别说明：恢复的是控制入口、执行过程、执行结果，还是仅仅重新获得了启动新工作的能力。

## 稳定 Session 可以跨越失效 Binding

在所选实现中，Public Session 并不等于某一个 Remote Host Session。它持有一个可替换 Binding。每次 `execute`、`wait` 或 `terminate` 之前，客户端都会检查当前 Binding 是否仍然存活；若已停止，可以针对同一服务端点打开 Replacement Binding。

这是一项有价值的可用性能力：调用方不必在应用层重建所有 Session Reference。但稳定的外层身份不能抹去底层资源的生命周期。旧 Binding 与新 Binding 属于不同的执行纪元。

Reopen 使用单 Permit Semaphore 实现 Single-flight。第一个发现故障的调用方获取 Permit 并创建替代 Binding；后来的并发调用方取得 Permit 后再次检查，复用已经发布的新 Binding。这个锁只约束“谁创建替代 Binding”，并不会把替代 Binding 上后续运行的 Cell 全部串行化。

这里的来源事实来自同日 Research Object，其依据为 [OpenAI Codex Commit `bde723a`](https://github.com/openai/codex/commit/bde723ae7dedc87754228a2476a7a4cfbf05b4b8) 与 [PR #38257](https://github.com/openai/codex/pull/38257)。它们是公开的一手实现记录，不是对通用 Recovery Architecture 的独立验证。

## Generation Identity 划出执行纪元

只做 Reopen 会产生身份混淆。Replacement Host 可能重新从 `1` 开始分配 Local Cell ID。如果 Public API 只暴露 Host-local Number，那么旧 Cell `1` 的引用可能被错误地用于新 Host 的 Cell `1`。

所选设计为每个 Binding 分配 Generation，从而阻断这种别名。Generation 1 保留原有 Public Form；后续 Binding 则产生 `g2:1` 这样的身份。Nested Tool Call、Notification 与 Cell-closed Callback 也使用同一套 Generation Mapping，让 Callback Ownership 跟随 Binding Epoch，而不是只匹配一个可能被复用的本地数字。

`wait` 与 `terminate` 只有在 Public Cell ID 的 Generation 与当前 Binding 一致时才执行转换。过期 Generation 会被拒绝，不会被发送给 Replacement Host。这种拒绝不是 Recovery 失败，而是防止旧调用方控制无关新工作的必要边界。

因此，Generation Identity 回答的是一个有界问题：**这个 Reference 属于哪个 Live Binding Epoch？** 它不会回答旧 Cell 能否重建、其副作用是否已经提交、或者结果是否已经丢失。

## Rebinding 恢复后续可用性，不恢复过去执行

集成测试没有隐藏这条边界。Original Host Session 被中断，旧的 Pending Wait 结束，旧 Cell 关闭；随后同一 Endpoint 上出现 Replacement Host。后续两项执行使用 Generation 2 身份完成，而针对 Generation 1 的操作被拒绝。

这些事实支持以下有界结论：

- Logical Session 在 Host Replacement 后仍可继续使用；
- Replacement 创建过程受到协调；
- 新旧 Cell Identity 不会混淆；
- Rebind 完成后，新工作仍可并发执行；
- 旧 Host 上已经运行的工作会中断，而不是迁移。

如果不加限定地把这些结果都称为“Session Recovery”，就会把后续可用性升级成没有证据支持的 Execution Continuity。更清楚的状态语言至少应区分 `Rebound`、`Old Work Interrupted`、`New Work Admitted`，以及只有在另外建立证据后才能使用的 `Work Reconstructed` 或 `Result Recovered`。

## Recovery 不能只有一个状态

Remote-session Control Plane 应分别记录 Operator 真正需要判断的结果。

**逻辑身份。** 调用方是否仍然面对同一个 Public Session？

**Binding Epoch。** 当前究竟由哪个 Connection 或 Host Generation 实现这个 Session？

**执行连续性。** In-flight Operation 是继续、重启、失败，还是变成 Unknown？

**结果连续性。** 是否存在旧操作终态结果的持久证据？

**准入。** 后续操作现在是否允许进入 Replacement Binding？

这些维度不应被压缩成同一个绿色徽标。稳定 Session 已经拥有新 Binding、但先前副作用仍然 Unknown，与“旧工作已持久重放并完成对账”是完全不同的运行状态。

这种分离也能改进自动化。Retry Policy 可以在 `Rebound` 后允许新工作进入，同时把非幂等的旧操作留给 Reconciliation；Telemetry 可以分别统计 Host Replacement 与 Work Reconstruction；界面可以准确告诉用户“工作区重新可用”，而不谎称中断命令已经完成。

## 仍然没有恢复的部分

当前实现的 Generation State 保存在 Client Process 中。所选来源没有建立跨 Client Restart 的 Durable Generation Identity，也没有恢复旧 Runtime Service 丢失的结果、证明反复不稳定情况下的有界重试，或定义通用的 Transport-independent Session Protocol。

全局唯一且不复用的 Remote Resource ID 可以用另一种方式避免 Local Number Alias；拥有持久 Operation Journal 的系统，也可能在替换后重建部分工作。这些替代方案不会改变主要判断：无论使用什么机制，Rebinding 与 Work Recovery 都必须分别可观察。

现有证据支持的是一条架构纪律，而不是唯一实现规定。Replacement Binding 恢复了未来操作的通路，但它本身不会把旧执行带过断点。

## 面向持久设计的开放问题

仍有三个问题需要继续回答：

1. Binding Generation 在什么条件下必须从 Process-local 状态升级为 Durable Identity？
2. 哪些被中断工作可以安全重建，哪些必须进入显式对账或人工复核？
3. 如果 Remote Host 在“可能已经产生副作用”之后、持久结果写入之前消失，系统应如何表述这项 Operation？

在这些问题得到回答以前，“重新连接”应只表示新 Binding 已存在，不应被当成旧工作存续的证明。

### 参考资料

- [OpenAI Codex Commit `bde723ae`：Generation-aware gRPC Session Recovery](https://github.com/openai/codex/commit/bde723ae7dedc87754228a2476a7a4cfbf05b4b8)
- [OpenAI Codex PR #38257](https://github.com/openai/codex/pull/38257)
- `research/reading/Q-20260813-02-generation-aware-grpc-session-recovery.md`
- `research/analysis/Q-20260813-02-session-rebinding-boundary.md`
