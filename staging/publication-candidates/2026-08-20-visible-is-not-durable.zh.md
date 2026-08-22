---
schema: publication-candidate-article/v2
title: "可见，不等于持久"
date: '2026-08-20'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "What should an artifact version mean operationally when visibility, writer ownership and durable storage are separate state transitions?"
summary: "一个 Version 可以原子地对 Reader 可见，却没有证明自己具备 Crash Durability。同日 Google ADK 变更演示了紧凑 Publication Protocol，也说明 Reservation、Completeness、Visibility 与 Persistence 必须分开记录。"
cover: staging/publication-candidates/2026-08-20-visible-is-not-durable-cover-v2.png
sources:
  - research/analysis/Q-20260820-03-visibility-durability-separation.md
---

![可见，不等于持久题图](staging/publication-candidates/2026-08-20-visible-is-not-durable-cover-v2.png)

# 可见，不等于持久

一个 Artifact 可以已经完整，并对所有普通 Reader 可见，却仍然没有证据证明它能在 Crash 后存活。如果系统把这两个事件都记作 `Published`，恢复、审计与正确性所需的重要区分就消失了。

2026 年 8 月 20 日合并的一项 Google ADK 变更，在本地 Filesystem Artifact Service 中演示了这个边界。Writer 先预留隐藏的 `.{version}.pending` Directory，在其中写入 Payload 与 Metadata，重新检查 Destination，最后通过一次 `os.replace`，把完整 Tree 以 Integer Version Name 暴露出来。普通 Version Discovery 会忽略 Pending Directory。维护者也直接说明了限制：没有对 File 与 Parent Directory 执行 `fsync`，协议就没有建立完整 Power-loss Durability。

该实现支持一个四段 Lifecycle Model：**Reservation、Staged Completeness、Reader Visibility 与 Durable Persistence 是不同事实。Atomic Rename 在声明的 Filesystem Assumption 下可以建立 Process-level Visibility，但不是 Durability Certificate。**

## Incomplete State 不应进入 Reader Namespace

如果在内容完成前就创建 Final Version Directory，Reservation 看起来就像 Publication。Reader 可能发现一个 Payload 或 Metadata 尚不完整的 Version。In-process Lock 能串行化 Thread，却不能让未完成状态在结构上对 Reader 隐藏，也未必能协调独立 Process。

Hidden Pending Namespace 改变了 Discovery 的含义。Pending Directory 只记录 Writer 已预留 Identity，并不表示 Version 可以被消费。普通枚举只接受 Integer-version Name，因此未完成工作不会误入“已发布 Artifact”的定义。

只有 Payload 与 Metadata 组成完整 Staged Representation 后，Final Rename 才跨越 Visibility Boundary。Namespace 本身携带 Lifecycle Meaning：Hidden 表示仍在准备，Integer-named 表示已获得 Reader Visibility Authority。

## Ownership 与 Publication 需要不同同步点

并发 Writer 带来第二个问题：两者可能读取同一个 Latest Version，并提出同一个 Successor。ADK 实现使用 Filesystem Directory Creation 作为 Reservation Arbiter。在已演示的 Local Fault Domain 中，这个信号对竞争 Process 都可见，比单进程拥有的 Mutex 更强。

Publication 前，Writer 会再次检查 Final Destination 是否已经存在，防止依据 Stale Version List 工作的 Writer 覆盖其他 Writer 已发布的 Version。因此，Reservation Ownership 与 Reader Visibility 不是一个瞬时事件，而是由 Staged Protocol 连接的两个节点。

同一套保守规则也解释了 Version Gap。Crash 的 Writer 可能留下 Pending Reservation；另一个 Process 不能仅凭“进度很慢”就安全推断 Owner 已死亡。重用编号可能与仍存活的工作冲突，因此系统允许永久 Gap。连续编号更整齐，Ownership Safety 却是更强的 Invariant。

## Rename 建立 Visibility，不建立 Persistence

在适当 Filesystem Assumption 下，重命名完整 Directory 可以让 Reader-observable Transition 原子化：Consumer 要么看到旧 Namespace，要么看到完整新 Version，而不是设计中的 Half-state。这是一项真实且重要的保证。

但它仍然弱于 Crash Durability。Durability 关心 Payload Byte、Metadata 与 Directory Entry 是否按要求顺序进入持久介质，是否能在 Power Loss 或 Storage-controller Failure 后保存。Rename Success 无法独立回答这些问题；来源明确没有对相关 File 与 Parent Directory 执行 `fsync`。

这个边界应进入 API 与 Evidence，而不只是写在文档里。`Published` 可以表示 Reader-visible；`DurabilityVerified` 应要求由选定 Storage Protocol 支持的独立 Acknowledgement。低价值、可重建 Cache 可以合理停在 Visibility；关键 Checkpoint 可能需要更强同步。工程选择可以不同，Claim Strength 不能混淆。

## Recovery 需要 Ownership Evidence

自动清理 Pending State 很有吸引力，特别是 Gap 不断累积时。但删除或重用本身是一项 Authority Decision：Reconciler 需要证据证明此前 Owner 已经 Stale。如果 Live Writer 允许长时间运行，单纯时间经过可能并不充分。

安全 Reclamation 因而需要额外契约：Lease Expiry、Owner Heartbeat、Process Identity、External Coordination，或适合该 Fault Domain 的其他证明。缺少这些证据时，保留 Ambiguous Reservation 是保守行为，而不是缺陷。

现有证据仅覆盖一个 `FileArtifactService`、相关测试与 Filesystem Assumption。它没有建立所有环境都具有相同 Rename Semantics，也没有建立 Distributed Transaction、Multi-artifact Atomicity 或 Crash Consistency。正是这些限制让可复用结论更清晰：Artifact Schema 必须说明发生了哪次 Transition，以及哪项 Evidence 支持它。

审查 Artifact System 时，关键问题不只是“Publish Call 成功了吗”。还要分别问：谁拥有该 Version？Staged Representation 是否完整？是否已经跨过 Reader-visibility Boundary？什么证据证明 Durable Persistence？谁有权回收 Abandoned State？一个 Success Flag 无法回答全部问题；受治理 Lifecycle 可以。

**一手证据：** [Google ADK Python 合并提交 94475c9a](https://github.com/google/adk-python/commit/94475c9a76c7c71246d6f5e4b083b3c3ee6869c0)。公开实现与测试支持有界 Process-level Visibility Protocol，并明确不建立 fsync 支持的 Crash Durability。
