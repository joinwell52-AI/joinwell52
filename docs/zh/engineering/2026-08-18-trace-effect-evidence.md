---
title: "Trace 已收口，不等于外部 Effect 已确定"
date: '2026-08-18'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "What can a request trace prove when it covers queue receipt through a terminal operational outcome, and what evidence must remain separate for external effects?"
summary: "Request Lifecycle Telemetry 可以重建 Queue Receipt、Admission、Execution 与 Terminal Transport Outcome，但不能替代 External-effect Evidence。Codex 当日合并变更增强了请求路径可观测性，也让剩余的证据边界更清晰。"
sources:
  - research/analysis/Q-20260818-03-lifecycle-telemetry-effect-certainty.md
item_id: "Q-20260818-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-18-trace-effect-evidence-cover-v2.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-18-trace-effect-evidence-cover-v2.png"
  kicker="开源工程 · 每日研究"
  title="Trace 已收口，不等于外部 Effect 已确定"
  summary="Request Lifecycle Telemetry 可以重建 Queue Receipt、Admission、Execution 与 Terminal Transport Outcome，但不能替代 External-effect Evidence。Codex 当日合并变更增强了请求路径可观测性，也让剩余的证据边界更清晰。"
  version="Q-20260818-03"
  status="Daily Runtime V5 · 2026-08-18"
  languageHref="/en/engineering/2026-08-18-trace-effect-evidence"
  languageLabel="English"
/>

# Trace 已收口，不等于外部 Effect 已确定

一次 Request Trace 可以干净地结束，而 Runtime 外部世界仍然不确定。Span 已记录 `disconnected`，Handler 已消失，请求路径本身也许已经完整可观测；但外部服务完全可能在连接断开之前就提交了副作用。

这不一定是 Tracing 做错了，而是**证据边界**不同。

2026-08-18 合并的一项 Codex Exec-server 变更，让 Request Lifecycle 的可重建性明显增强：Inbound Span 与 Queue Timestamp 在 Connection Queue 收到请求时就被创建；可选 W3C Parent Context 会先验证；同一 Span 随后贯穿 Server/Client Queue 与 Route Execution；Queue Duration 只在 Admission 之后按有界 Route Label 记录；Terminal Outcome 则包括 Success、Error 与 Disconnected。

这些都是有价值的运维事实。但若要形成更广泛的工程判断，必须保留一个区分：**Request Lifecycle Telemetry 与 External-effect Certainty 是两个不同 Evidence Plane。**

## 从 Queue Receipt 开始追踪，补上了重要盲区

只在 Handler 内启动 Trace 太晚了。它看不到请求在执行前排队多久，也无法说明 Connection Layer 是否已经收到请求，或请求是否在 Dispatcher Admission 前就丢失。

把 Span Ownership 前移到 Connection Queue Receipt 后，同一个 Request Identity 可以覆盖 Pre-admission Waiting、Route Execution，以及 Response/Disconnect Handling。Queue Latency 又只在 Admission 之后记录，因此指标拥有明确测量边界，而不是把“还在队列里等待”提前当成已经形成的数据点。

实现还会把 Route Label 规范化，以控制 Metric Cardinality。Per-request Trace 可以保留更多细节，而 Fleet-level Histogram 使用有界 Route Identity。二者服务不同运维目的，不需要暴露完全相同的维度。

## Terminal Telemetry 说明的是请求路径发生了什么

变更后的 Request Span 拥有明确的 Terminal Operational Result。Server-side 路径会记录完成与 Error；Client-handled Callback 则通过 Outcome Guard，在没有更具体结果时把未解决终止默认记录为 `disconnected`。

这减少了一种常见可观测性缺口：Cancelled 或突然丢失的工作，不会因为没有 Success Response 就从 Telemetry 中消失。

但 `disconnected` 描述的是 Request Path。它可以告诉运维人员：被 Instrument 的生命周期没有通过正常 Response 收口。它无法回答外部数据库是否已 Commit、远程 API 是否接受了 Mutation、消息是否进入 Broker，或者 Tool 是否在 Disconnect 之前已经改变了外部世界。

因此，关闭的 Span 是**请求证据**，不是自动生成的 **Effect Receipt**。

## 外部 Effect 需要自己的权威身份

当请求会在 Runtime 外部制造副作用时，更强的确定性通常要来自真正拥有该副作用的系统：Transaction ID、Idempotency Key、Commit Receipt、Durable Job Identity、Broker Offset、External Operation Record，或其他等价权威信号。

更稳妥的模型是两个相互关联的 Evidence Plane：

1. **Lifecycle Telemetry**：解释请求在 Runtime 内经历了什么——Receipt、Queueing、Admission、Execution 与 Terminal Transport Outcome；
2. **Effect Evidence**：建立 Side-effect-owning System 究竟接受、提交、拒绝、补偿了什么，或者哪些状态仍然 Unknown。

二者应共享稳定 Correlation Identity，但不应压缩到同一个 `success` / `failure` 字段中。Transport Success 可以与后续 Business Failure 并存；Transport Disconnect 也可能与已经 Commit 的外部 Effect 并存。

这对 Recovery 尤其重要。如果请求已经 Disconnect，而权威 Effect Evidence 既不能证明“未发生”，也不能证明“已提交”，正确状态可能是 **Unknown + Reconciliation**，而不是自动重试，更不是自动成功。

## 更好的 Telemetry 不会自动产生更强保证

已选择实现不会认证 Caller。W3C Parent Context 是 Correlation Metadata，不是 Authorization Credential。现有证据也没有建立所有 Descendant Task 都保持 Inbound Trace、所有已发出 Span 都不会被 Exporter 丢失、外部 Effect 恰好一次执行，或者 Disconnect 后副作用可回滚。

对于完全本地且与 Request Handler 事务耦合的操作，Request Completion 可能非常接近 Effect Completion；但真正让这个推断成立的，是那层 Transactional Coupling 本身。一旦工作跨出外部边界，或者可以超出 Response Path 生命周期，Effect State 就需要独立证据。

因此可以形成一条实用运维规则：**请求路径结束时关闭 Request Trace；Effect-owning System 尚未提供足够证据时，不要关闭 Effect 问题。** 如果两个 Evidence Plane 不一致，或者其中一边 Unknown，就保留这种差异并进入 Reconciliation。

接下来需要回答的问题很具体：外部 Tool Call 应携带什么稳定 Effect Identity？哪些 Detached Task 被允许超出 Request 生命周期？Request Outcome 应怎样映射到 Committed、Rejected、Unknown、Compensated 等 Effect State？Telemetry 需要怎样的 Retention Guarantee，才能从短期 Debug Evidence 升级为正式 Audit Evidence？

更完整的 Trace 会让这些问题更容易被看见，但不会替我们回答它们。

**一手证据：** [OpenAI Codex 合并提交 fd34ad72](https://github.com/openai/codex/commit/fd34ad7297d86ef8f679927db55a3c1d09735f55)。实现与仓库测试属于公开一手证据，并不独立证明完整 Causal Tracing、Exactly-once External Effect 或持久 Audit Retention。
