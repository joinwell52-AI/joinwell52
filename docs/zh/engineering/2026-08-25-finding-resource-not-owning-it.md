---
title: "找到资源，不等于拥有资源"
date: '2026-08-25'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "When a mutable runtime resource can move or change between discovery and lock acquisition, which observations remain trustworthy once the migration actually obtains authority to act?"
summary: "Codex 的一项已合并 Rollout Migration 变更把 Path 与 Pre-lock Observation 视为临时证据。正确 Mutation 需要在取得 Authority 后重新发现与重读，同时把 Busy Contention 与 Terminal Failure 保存为不同 Lifecycle Fact。"
sources:
  - research/analysis/Q-20260825-03-post-authority-resource-revalidation.md
item_id: "Q-20260825-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-25-finding-resource-not-owning-it-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-25-finding-resource-not-owning-it-cover.png"
  kicker="开源工程 · 每日研究"
  title="找到资源，不等于拥有资源"
  summary="Codex 的一项已合并 Rollout Migration 变更把 Path 与 Pre-lock Observation 视为临时证据。正确 Mutation 需要在取得 Authority 后重新发现与重读，同时把 Busy Contention 与 Terminal Failure 保存为不同 Lifecycle Fact。"
  version="Q-20260825-03"
  status="Daily Runtime V5 · 2026-08-25"
  languageHref="/en/engineering/2026-08-25-finding-resource-not-owning-it"
  languageLabel="English"
/>

# 找到资源，不等于拥有资源

Migration 发现一个 Rollout File，读取 Metadata，并判断它为空。在 Worker 获得 Writer Lock 前，另一个进程可能追加数据，Archive Maintenance 也可能把文件移动到压缩路径。原始 Observation 在发生时是准确的，在被使用时却已不安全。

Codex 在 2026-08-25 合并的一项维护者变更强化了这个边界。Startup Migration 可以重新发现 Rollout Path，在持有 Writer Lock 时重读看似为空的 Rollout，在路径移动后重新解析，并把 Lock Contention 保留为可恢复 Busy Outcome；Terminal Failure 单独记录，需要有意 Recovery。

一般工程结论是：**Discovery 是 Provisional Evidence，不是 Execution Authority。** 如果 Resource 在 Observation 与 Ownership 之间可能变化，Correctness 要求在取得 Authority 后、Mutation 前重新核验 Identity、Location 与决策相关 State。

## Path 是 Locator，不是 Durable Identity

Snapshot-style Migration 常把 Discovery 与 Decision 合在一起：找到 Filename，读取 State，然后假设 Resource 不再变化。Concurrent Writer、Archive Job 与 Compressor 会破坏这个假设，但并不意味着最初 Discovery 是“错误的”；只是 Locator 过期了。

所选变更把输入表示为 Fresh Discovery 或 Known Path Set，并增加 Rediscovery Helper。Metadata Read 遇到 `NotFound` 时，Migration 会解析 Rollout 当前路径后重试；如果文件在 Metadata 已读但 Lock 尚未获得时移动，Post-lock Path Check 仍可再次找到它。

该机制依赖一个能跨越受支持 Suffix 或 Location Transition 的 Logical Rollout Identity。这个 Identity 才是 Durable Subject，Path 只是当前访问方式。把 Path 本身当 Identity 的系统无法区分合法移动与对象替换。

## Authority 改变哪些 Observation 足以支持 Mutation

Writer Ownership 不只是防止同时写入，还定义 Worker 何时可以依据 Current State 作出 Mutation Decision。只要可能发生并发变化，Authority 之前观察到的事实都只是 Hint。

“看似为空”的 Rollout 最能说明问题。Writer 可能已经创建 Path，却尚未让 `SessionMeta` Durable；把第一次 Empty Read 当终局，会永久跳过真实工作。强化后的 Migration 先取得 Writer Lock，再重读，然后才决定是否无事可做。

Post-authority Revalidation 应覆盖所有可能改变决策的事实：Logical Identity、Current Locator、Relevant Metadata，以及必要时的 Revision 或 Content Hash。Immutable Fact 不必机械重读，关键是明确哪些 Observation 会在 Claim 生效前过期。

这关闭了已证明本地边界上的 TOCTOU Gap，但不会让整个 Filesystem 具有 Transactionality。

## Busy 与 Failed 是不同 Lifecycle Fact

无法取得 Writer Lock 的 Worker 并没有执行失败，它根本没有得到尝试 Migration 的 Authority。把这种结果分类为 Busy，可以保留未来 Eligibility，等 Active Writer 完成后在后续 Startup 重试。

Terminal Failure 表达的是另一件事：Authority 已获得或 Work 已尝试，但 Migration 没能完成。单独记录它可以保留 Accountability，并提供显式 Repair Path。让 Global Cursor 前进可以避免一个损坏 Rollout 冻结无关进度，却不会自动修复失败对象。

一个 Retry Boolean 无法诚实表达这些事实。受治理 State Machine 应区分 Busy、Attempted-and-failed、Completed 与 Intentionally Skipped。Repeated Busy 还需要 Visibility、Backoff 与 Escalation，否则“可重试”会变成不可见 Starvation。

## Local Recovery 不是 Distributed Migration Protocol

证据来自一个本地 File-backed Lifecycle 与并发 Regression。Local Writer Lock 不能建立跨机器或任意外部 Storage 的 Exclusion；Rediscovery 也不提供 Consensus、Filesystem Transaction 或通用 Exactly-once Migration。

Identity 本身仍可能存在歧义。如果两条 Path 都满足 Rediscovery Convention，Worker 需要更强证据才能选择。Logical Identity 无法排除替换时，可能还需要 Revision Token、Metadata Generation 或 Content Hash。

有用结论仍然有边界：在可变本地资源边界上，Post-authority Reread 与 Rediscovery 可以防止过时 Pre-lock Observation 静默控制 Mutation。下一步问题是 Identity 如何跨越所有受支持 Transition、Repeated Busy 何时升级，以及 Terminal Migration 重新进入 Execution 前需要什么 Evidence。

**一手证据：** [Codex 已合并提交 465eafac](https://github.com/openai/codex/commit/465eafacbc2db4ff828cd6d18ed8f25d22e48f53)。公开实现与测试支持这一 Local Post-authority Revalidation Pattern，不支持 Distributed Locking 或通用 Exactly-once Migration。
