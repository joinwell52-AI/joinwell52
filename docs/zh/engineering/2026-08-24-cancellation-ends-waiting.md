---
title: "取消结束等待，不结束所有权"
date: '2026-08-24'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "How should an asynchronous resource owner react when cancellation arrives during teardown so it neither leaks remaining owned resources nor swallows the caller's cancellation signal?"
summary: "OpenAI Agents Python 的一项已合并修复把 Owned Dependency Cleanup 期间的 Cancellation 视为 Deferred Control Flow：先完成有界本地 Teardown、清理 Ownership State，再重新抛出。它在本地保留两类合同，但不能证明 Remote Cleanup 成功。"
sources:
  - research/analysis/Q-20260824-03-cancellation-defers-owner-teardown.md
item_id: "Q-20260824-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-24-cancellation-ends-waiting-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-24-cancellation-ends-waiting-cover.png"
  kicker="开源工程 · 每日研究"
  title="取消结束等待，不结束所有权"
  summary="OpenAI Agents Python 的一项已合并修复把 Owned Dependency Cleanup 期间的 Cancellation 视为 Deferred Control Flow：先完成有界本地 Teardown、清理 Ownership State，再重新抛出。它在本地保留两类合同，但不能证明 Remote Cleanup 成功。"
  version="Q-20260824-03"
  status="Daily Runtime V5 · 2026-08-24"
  languageHref="/en/engineering/2026-08-24-cancellation-ends-waiting"
  languageLabel="English"
/>

# 取消结束等待，不结束所有权

异步 Container 拥有多个 Sandbox Dependency。关闭其中一个时，它收到 `CancelledError`。立即传播可以尊重 Caller 停止等待的意愿，却可能放弃 Teardown Order 中剩余全部 Resource；吞掉 Cancellation 可以完成 Cleanup，却破坏 Caller Contract。

OpenAI Agents Python 在 2026-08-24 合并的一项变更，在本地同时保留两类义务。Container 捕获 Owned Close 期间第一个 Cancellation，继续尝试其余 Close，清空内部 Lifecycle Collection，最后再重新抛出。Regression 验证两个 Owned Value 都收到一次 Close；第二次 `aclose()` 复用同一个已取消 Close Task，Counter 不再增加。

工程判断是：**Cancellation 结束 Waiting，而不是 Ownership。** 对 Lifecycle Owner 而言，Teardown 期间的 Cancellation 应成为 Deferred Terminal Signal，让有界本地义务完成。这个模式不能证明 Remote Cleanup 已成功，也不能证明普通 Close Failure 可见。

## Ownership 不随 Caller 的控制流决定消失

Cancellation 与 Ownership 回答不同问题。Cancellation 说明 Caller 不再希望继续当前 Wait 或 Computation；Ownership 则说明组件已经接受了对 Caller 创建资源的责任。

在所选 `Dependencies` 实现中，只有标记 `owns_result=True` 的 Factory Result 才进入 Container-managed Owned List。Close Path 先取消并等待 Active Factory Task，再逆序遍历 Owned Result。该 Scope 给 Owner 一份有限义务集合，完成后才能释放 Local State。

如果 Cancellation 立即退出 Loop，后续 Owned Resource 不会收到 Close Attempt，内部 Cache 也可能保留。把 Cancellation 当成放弃许可，会在最容易失败的时刻静默改写 Ownership Contract。

并非每类 Resource 都必须使用同一 Policy。Ephemeral Object 可以允许立即放弃；Credentialed Sandbox、Leased Worker 或 Billable Remote Resource 可能必须清理。Owner 应在 Cancellation 到达前定义 Class-specific Boundary。

## 延迟传播，但不吞掉 Cancellation

所选 Mechanism 保存第一个 `CancelledError`，继续遍历剩余 Owned Result，并清空 `_pending`、Active Task、Cache 与 Ownership Collection；完成后才重新抛出保存的 Cancellation。

这个顺序保留 Caller Semantics：Cancellation 最终仍回到 Caller；也保留有界 Owner Semantics：每个已接纳 Resource 都收到本地 Close Attempt。Deferral 不是 Cancellation 后无限工作的许可，而是在返回控制前完成预定义 Teardown Scope。

该模式类似小型 Critical Section，但 Guarantee 来自显式 Lifecycle State，而不是把全部工作简单 Shield。系统应让 Post-cancellation Scope 保持短小、确定，并具有足够可观察性以诊断停滞。

## 一个 Close Task 建立本地 Teardown Identity

第一次 `aclose()` 创建唯一 `_close_task`，后续 Caller 复用并 Shield 该 Task，而不启动独立 Teardown Pass。逆序遍历还使用 `id(value)` 对重复 Object Reference 去重。这些选择为已展示 Container Lifecycle 提供 Local Idempotence。

Scope 仍然重要。两个 Wrapper Object 可以指向同一个 Remote Resource，却拥有不同 Python Identity；Resource 的 `close()` 也可能部分成功后 Raise；另一个 Process 还可能执行自己的 Close。复用本地 Task 只能证明该 Owner 不会为被测试 Reference 启动第二次 Local Pass。

Critical Remote Resource 可能需要跨进程共享的 Logical Resource ID、Idempotency Key 或 Lease Record。Local Object Identity 是有用的 Optimization 与 Regression Boundary，却不是 External Uniqueness 的证据。

## Best Effort 仍需要 Evidence Channel

Dependency Close Method 抛出的普通 Exception 会被 `_close_best_effort()` 有意吞掉。这有利于 Teardown Continuation，可能是正确的 Availability Choice；同时也意味着没有 Terminal Cleanup Error，不能证明所有 Resource 成功关闭。

对于低影响对象，Silent Best Effort 可能足够；涉及 Security、Cost 或 Compliance 的 Resource，则需要 Structured Failure Record 与 Reconciliation。Cancellation 应保持 Caller-visible Control Signal，Close Failure 可以聚合或写入独立 Teardown Evidence Channel，而不是消失。

最终操作问题在远端：Local Cancellation 或 Suppressed Close Error 之后，什么 Receipt、Listing 或 Reconciliation 能证明 External Resource 已不存在？在这些证据出现前，可辩护结果仍有边界：已展示 Owner 会尝试全部本地 Close 并保留 Cancellation，但 Remote Success 与分布式 Exactly-once Cleanup 尚未证明。

**一手证据：** [OpenAI Agents Python 已合并提交 72b2c670](https://github.com/openai/openai-agents-python/commit/72b2c670546942bdaaf66cc8d6b3a67d1a2fe5bc)。公开实现与 Regression 支持本文描述的有界本地 Teardown 行为，但不是 Remote Cleanup Success 或 Exactly-once Effect 的独立证明。
