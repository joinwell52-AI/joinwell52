---
title: "Agent 历史迁移必须保留语义，而不只是搬运文件"
date: '2026-08-06'
column: open-source-engineering
category: daily
summary: "回滚、压缩和迟到事件会让物理记录顺序偏离逻辑会话边界；可靠迁移必须先重建语义，再通过带 journal 的幂等阶段发布和恢复。"
item_id: Q-20260806-03
source_research_object: "research/analysis/Q-20260806-03-rollout-migration-recovery.md"
source_reading_result: "research/reading/Q-20260806-03-rollout-migration-recovery.md"
lifecycle: Published
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
outline: deep
cover: "/assets/covers/daily-2026-08-06-semantic-migration-recovery-cover-v2.jpg"
---

<ArticleCover
  image="/assets/covers/daily-2026-08-06-semantic-migration-recovery-cover-v2.jpg"
  kicker="开源工程 · 每日研究"
  title="Agent 历史迁移必须保留语义，而不只是搬运文件"
  summary="回滚、压缩和迟到事件会让物理记录顺序偏离逻辑会话边界；可靠迁移必须先重建语义，再通过带 journal 的幂等阶段发布和恢复。"
  version="Q-20260806-03"
  status="Daily Runtime V5 · 2026-08-06"
  languageHref="/en/engineering/2026-08-06-semantic-migration-recovery"
  languageLabel="English"
/>
# Agent 历史迁移必须保留语义，而不只是搬运文件

Agent rollout 的持久记录可能经历回滚、压缩、父子历史复制和迟到生命周期事件。此时，物理顺序不再等于逻辑会话含义。逐行复制可以保留字节，却可能恢复出错误的可见历史。

## 核心判断

**Agent 历史迁移应被定义为版本化语义转换，而不是文件格式转换。** 转换需要明确不变量、逻辑边界和降级项；跨 JSONL 与 SQLite 的发布应采用持久 journal 与幂等阶段，并把结果称为“可恢复”，除非真正证明了全局原子性。

## 来源

本文唯一分析输入是获准进入 Production 的 Research Object。Production 没有重新读取提交差异来开展新分析，也不把单一维护者变更和测试提升为 fleet-scale 保证。

## 观察

Research Object 描述了四个关键机制：按逻辑 turn ownership 分配记录；消费 rollback 事件并保留必要 compaction anchor；在可证明安全检查点时进行有界反向重放，否则回退到完整容错重放；通过 flush、sync、rename 发布文件，并以 pending journal 跨越 JSONL 已发布而 SQLite 尚未完成的非原子区间。

## 比较

| 方法 | 保留对象 | 主要保证 | 明确边界 |
|---|---|---|---|
| 原样复制 | 字节和物理顺序 | 文件内容未改写 | 可能破坏逻辑可见历史 |
| 语义重放 | turn ownership、rollback、compaction 与子 Agent 边界 | 恢复预期会话意义 | 依赖不变量与容错策略 |
| 原子 rename | 单文件发布 | 读者看到旧文件或新文件 | 不覆盖多存储事务 |
| Journaled recovery | 跨 JSONL/SQLite 的发布意图和阶段 | 崩溃后可继续或修复 | 是可恢复协议，不是分布式原子事务 |

表格区分了字节保存、语义恢复、单文件原子性和跨存储可恢复性，避免把不同保证混为一谈。

## 讨论

可靠迁移应先完成 semantic canonicalization，再执行 durable publication。逻辑 turn id 能处理迟到记录，而简单删除物理后缀可能误删仍属于有效 turn 的证据。pending journal 的作用是保留跨存储过渡意图，使恢复者能幂等地完成或修复，而不是假装存在一个并未建立的全局事务。

有界重放也必须是“证明后优化”：只有安全检查点成立时才缩小重放范围，否则回退到完整容错重放。回退可能增加成本或保留重复，但它比在不确定边界上做激进裁剪更保守。

## 工程影响

对 CodeFlowMu，可把迁移拆成 Prepare、Transform、Validate、Publish、Complete 与 Recover 阶段，并为每阶段配置幂等键。任何跨多个存储或投影的逻辑迁移都应有 durable pending journal。

迁移 manifest 应包含源/目标版本、记录数量、逻辑边界决定、跳过项、fallback 路径、journal 阶段和验证结果。FCoP 的 append-only 历史与当前生命周期事实保持权威，派生索引和 Runtime 投影可以重建，但不能反向改写协议历史。

## 边界与反证

证据是一项已合并维护者变更和相关测试，不是独立或大规模生产验证。损坏或超大记录可能被跳过或失败；文件系统 rename、fsync 和目录同步具有平台差异；journal 不是分布式事务；来源没有提供吞吐、恢复时长、争用或生产数据丢失指标。

## 未来工作

需要定义迁移前后模型可见上下文的可比较不变量，确定何时损坏记录必须阻断而不是降级，设计并发 writer/recoverer 协调，以及把哪些吞吐、fallback 和恢复指标作为发布门禁。

## 可视化说明

配图把 Prepare 到 Recover 的阶段与 pending journal、JSONL、SQLite 分开表示。它是 Research Center 基于 Research Object 的生命周期综合，不声称跨存储全局原子性。

## 证据与引用

1. [Research Object](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260806-03-rollout-migration-recovery.md)：本文唯一分析输入，包含语义迁移判断、可恢复边界、反证和工程影响。
2. [Reading Result](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260806-03-rollout-migration-recovery.md)：Research Object 声明的证据边界与来源追溯记录；本文不从该记录重新分析。
