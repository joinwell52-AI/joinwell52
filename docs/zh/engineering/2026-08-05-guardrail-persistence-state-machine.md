---
title: "输出门禁需要持久化状态机，而不只是“晚一点保存”"
date: '2026-08-05'
column: open-source-engineering
category: daily
summary: "把最终消息推迟到门禁完成后再持久化是必要的，但被接受输出、保留的工具证据与可回放失败材料仍需要不同的持久状态。"
item_id: Q-20260805-14
source_research_object: "research/analysis/Q-20260805-14-guardrail-session-ordering.md"
source_reading_result: "research/reading/Q-20260805-14-guardrail-session-ordering.md"
lifecycle: Published
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
outline: deep
---

<ArticleCover
  image="/assets/covers/daily-2026-08-05-guardrail-persistence-state-machine.svg"
  kicker="开源工程 · 每日研究"
  title="输出门禁需要持久化状态机，而不只是“晚一点保存”"
  summary="把最终消息推迟到门禁完成后再持久化是必要的，但被接受输出、保留的工具证据与可回放失败材料仍需要不同的持久状态。"
  version="Q-20260805-14"
  status="Daily Runtime V5 · 2026-08-05"
  languageHref="/en/engineering/2026-08-05-guardrail-persistence-state-machine"
  languageLabel="English"
/>

# 输出门禁需要持久化状态机，而不只是“晚一点保存”

把最终消息推迟到门禁完成后再持久化是必要的，但被接受输出、保留的工具证据与可回放失败材料仍需要不同的持久状态。

## 核心判断

终结过程是有类型的状态机，不是一次保存操作。

## 为什么这不是一个单点功能

助手消息被阻断，并不代表整个回合已回滚：工具调用、工具输出和外部影响可能已经存在；错误与取消分支也可能为了可回放性保留未交付输出。单一且无类型的会话日志无法同时安全表达“已接受事实”和“取证证据”。

## 可落地的最小架构

明确 Provisional、GuardrailEvaluated、Accepted、BlockedWithRetainedEvidence、QuarantinedError、CancelledReplayable 与 Persisted 状态。将已接受输出与保留执行证据分开存储；每个重要外部影响都应拥有独立于消息持久化的幂等键和 effect receipt。

## 边界与反证

现有测试使用假模型和简单列表会话，不能证明原子存储、回滚、外部影响恰好一次、并发写安全或分布式恢复正确性。

## 工程结论

在已接受输出投影之前引入明确的 FinalizationDecision，隔离可回放证据，并针对真实持久化适配器与外部影响系统测试崩溃边界。

## 可视化说明

配图用于表达控制边界和状态关系，不表达实验结果，也不制造原始研究对象未支持的量化比较。

## 证据与引用

1. [Research Object](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260805-14-guardrail-session-ordering.md)：本文唯一分析输入，包含研究判断、不确定性、反证和工程影响。
2. [Reading Result](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260805-14-guardrail-session-ordering.md)：Research Object 的证据边界与来源追溯记录。
