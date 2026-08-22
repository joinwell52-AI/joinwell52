---
schema: publication-candidate-article/v2
title: "缓存里没有，不足以授权删除"
date: '2026-08-22'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "How should an asynchronous local cache reconcile an authoritative remote inventory when principal identity can change and refresh, install, uninstall and cancellation can race with destructive cleanup?"
summary: "安全的异步 Reconciliation 需要 Principal Identity、Causal Generation、参与 Writer 协调，以及删除前的正向 Snapshot-completeness Evidence。这些控制约束 Race，却不会创造 Transaction。"
cover: staging/publication-candidates/2026-08-22-missing-cache-entry-not-deletion-evidence-cover.png
sources:
  - research/analysis/Q-20260822-03-principal-scoped-causal-cache-reconciliation.md
---

![缓存里没有，不足以授权删除题图](staging/publication-candidates/2026-08-22-missing-cache-entry-not-deletion-evidence-cover.png)

# 缓存里没有，不足以授权删除

一次 Background Refresh 返回时，结果里没有某个仍存在于 Local Cache 的 Plugin。删除 Local Bundle 看起来只是普通 Reconciliation——直到你发现这次 Refresh 属于上一个 Account、早于一次 Direct Install 启动，或者只拿到不完整的 Remote Inventory。相同的 Absence 可能表示“已经卸载”“没有抓到”“尚未 Materialize”，也可能只是“被 Stale Work 观察”。只有其中一种含义足以授权 Destruction。

2026 年 8 月 22 日合并的一项 Codex 变更，处理了 Remote Plugin-cache Lifecycle 中这类 Race。它把 Installed 与 Loaded Cache State 绑定到 Composite Authentication Identity，引入 Causal Generation，协调 Reconciliation 与 Direct Install/Uninstall，在 Stale Cleanup 前验证完整 Remote Snapshot，并在 Local Materialization 失败时继续保留 Remote Installation Metadata。

可迁移的规则是：**Destructive Reconciliation 需要正向 Evidence，证明 Snapshot 对当前 Principal 有效、在 Causal Order 中仍是最新，而且内容完整。** Identity、Generation、Serialization 与 Completeness 各自关闭不同缺口。它们共同提供有界 Coordination，不会创造 Transaction 或 Exactly-once Semantics。

## Freshness 有两个维度

Time-to-live 可以说明数据什么时候 Fetch，却不能说明它对谁有效，也不能说明是否已有更新 Work 取代它。

Codex 引入 `RemoteInstalledPluginsAuthIdentity`，由 Authentication Mode、Account ID、ChatGPT User ID 与 Workspace-account Status 组合而成。这份 Identity 同时进入 Installed-plugin Cache State 与 Loaded-plugin Cache Key。Account Identity 改变时，旧状态失效，Generation 推进；In-flight Work 在 Publication 前检查预期 Identity 是否仍然匹配。

Identity 与 Generation 解决不同问题。Principal Scope 防止 Account A 的 Snapshot 在 Account B 下可见；Causal Scope 防止同一 Account 中更慢、更旧的 Refresh 覆盖更新状态。因此，有资格成为 Authoritative State 的 Publication 必须同时携带两个坐标，并在真正发布前再次核验。

Cancellation 也属于这套 Causal Model。Reconciliation 被放弃时，系统会清除 Active Reconciliation Generation、推进 Generation，并标记需要刷新 Effective Plugin。它不会假装被取消的 Pass 从未触碰任何东西，而是撤销这次 Pass 的 Publication Authority，并为 Downstream Consumer 留下显式 Recovery Signal。

## 协调所有被 Guarantee 覆盖的 Writer

Reconciliation 不是唯一会改变 Cache 的过程。Direct Install 与 Uninstall 可以和 Background Sync 竞争，它们的 Downstream Setup 也可能比发起它们的宽泛 Operation 存活更久。

已展示设计为每个 Cache Root 使用一个 Semaphore，让 Full Sync、Reconciliation、Remote Install 与 Uninstall 共享串行化 Mutation Boundary。Per-plugin Mutation Marker 继续保护更窄的 Lifecycle，防止 Stale Cleanup 在 Direct Mutation 仍处于 In-flight 时剪掉 Bundle。

“被覆盖”三个字很重要。Gate 只约束参与 Gate 的 Writer。它不能证明 Independent Process、Uncoordinated Filesystem Writer 或未来 Code Path 不会发生 Race。Concurrency Documentation 应明确谁会获取 Gate、谁仍在边界之外；否则 Scoped Guarantee 很容易被误读成 Global Isolation。

## Validate Before Destroy

Destructive Cleanup 应比普通 Read Path 需要更强 Evidence。Remote `/installed` Result 会在 Download、Publication 或 Deletion 之前完成全量 Canonicalization。如果任何 Row 不能转换为有效 Local Cache Key，这次 Pass 会在 Stale Cleanup 前停止。只有系统获得完整、已验证的 Installed-name Set 后，才能把其他 Local Entry 判定为 Stale。

这反转了一个常见却不安全的默认值。Partial Success 足以展示已经 Fetch 的内容，却不足以推出所有缺失对象都已经从 Remote 删除。Page Failure、Malformed Row 或 Cancelled Fetch 都会移除 Deletion Authority，因为系统无法再证明 Completeness。

同样规则也适用于更小粒度。如果一条有效 Installed Plugin 记录无法在本地 Download 或 Materialize，Codex 仍会保留它的 Installed Metadata。Remote Membership 保持 True，Local Readiness 变成 False。混淆两者，会把 Local I/O Failure 转换成虚假的 Remote Uninstall Evidence。

## 分开建模 Remote Truth 与 Local Readiness

一个有恢复力的 Cache 至少应表示两个 State Dimension：

- Authoritative Remote Inventory 是否认为对象仍是 Member；
- Local Runtime 是否已经成功 Materialize，并可以使用该对象。

这种分离才能触发正确 Recovery。Materialization Failure 可以发起 Retry 或降低 Availability，却不必删除 Membership Metadata。只有被完整、当前 Snapshot 观察到的真实 Remote Removal，才足以授权 Cleanup。Operator 也能区分“已安装但本地不可用”和“未安装”，两者需要完全不同的 Alert 与 Repair Action。

这套模型还能阻止 Destructive Feedback。如果 Local Failure 会擦除 Membership，而擦除后的 State 又驱动未来 Cleanup，一次短暂 Download Problem 就可能变成持久 False Deletion。把 Evidence Ledger 与 Materialization Health 分开，可以中断这条反馈链。

## Coordination 不是 Transaction

公开证据来自一个 Codex 已合并 Plugin-cache 实现及其 Regression Test。Generation 会拒绝 Stale Publication，却不会回滚 Network Call 或 Filesystem Side Effect；Semaphore 会串行化已知 Cache-root Operation，却不建立 Cross-process Mutual Exclusion；Cancellation 会协调 Retry，却不提供 Exactly-once Execution。

这些边界不会削弱 Pattern，反而让 Guarantee 可以被准确使用。对于存在 Identity Change 与 Destructive Cleanup 的 Asynchronous Cache，在 Publication 或 Deletion 前询问四个问题：这是当前 Principal 吗？这是当前 Generation 吗？所有参与 Writer 都完成协调了吗？Authoritative Inventory 得到了正向 Completeness 证明吗？

任何答案未知时，安全结果都不是宣告对象已经不存在。Reconciliation 是 Evidence-driven Coordination，不是 Transaction；Missing Data 也不是 Deletion Evidence。

**一手证据：** [OpenAI Codex 合并提交 e6a3877e](https://github.com/openai/codex/commit/e6a3877e95788b52c3aa5e9a143dba87f04720dc)。公开代码与测试支持本文描述的有界 Plugin-cache Behavior，但不构成对一般 Transaction 或 Exactly-once Guarantee 的独立验证。
