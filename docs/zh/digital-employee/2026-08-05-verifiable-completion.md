---
title: "数字员工不是“做完了”，而是“完成声明被独立验收了”"
date: '2026-08-05'
column: digital-employee
category: daily
summary: "计算机操作型数字员工需要一份完成契约，把过程证据、业务结果与失败分类分开。执行者可以声明完成，但不能自行验收自己的声明。"
item_id: Q-20260805-12
source_research_object: "research/analysis/Q-20260805-12-verifiable-completion.md"
source_reading_result: "research/reading/Q-20260805-12-verifiable-completion.md"
lifecycle: Published
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
outline: deep
---

<ArticleCover
  image="/assets/covers/daily-2026-08-05-verifiable-completion.svg"
  kicker="数字员工 · 每日研究"
  title="数字员工不是“做完了”，而是“完成声明被独立验收了”"
  summary="计算机操作型数字员工需要一份完成契约，把过程证据、业务结果与失败分类分开。执行者可以声明完成，但不能自行验收自己的声明。"
  version="Q-20260805-12"
  status="Daily Runtime V5 · 2026-08-05"
  languageHref="/en/digital-employee/2026-08-05-verifiable-completion"
  languageLabel="English"
/>

# 数字员工不是“做完了”，而是“完成声明被独立验收了”

计算机操作型数字员工需要一份完成契约，把过程证据、业务结果与失败分类分开。执行者可以声明完成，但不能自行验收自己的声明。

## 核心判断

完成是一项受治理的声明，不是最后一个动作、一张最终截图或模型生成的一句话。

## 为什么这不是一个单点功能

最终截图可能展示结果表象，却不能证明必需步骤、影响范围或业务授权；过程评分能说明执行质量，却不能证明目标业务状态；失败标签能划分责任，却不自动提供安全重试。它们是不同声明，需要不同证据。

## 可落地的最小架构

采用版本化 Completion Claim：包含预期结果、过程证据、确定性状态回读、可选的学习型验证意见、失败与副作用分类，以及独立验收决定。不同检查发生冲突时应保留分歧，而不是强制压成二元结果。

## 边界与反证

支撑研究限定于网页任务，基准仅含 246 条轨迹，外部假阳性率仍为 8%。它没有证明回滚、补偿、事务性或企业事故率下降。

## 工程结论

优先采用“声明者—证据契约—验证者—验收者”的分离模式。学习型验证只能作为意见，与确定性业务检查和必要的人类权限并存。

## 可视化说明

配图用于表达控制边界和状态关系，不表达实验结果，也不制造原始研究对象未支持的量化比较。

## 证据与引用

1. [Research Object](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260805-12-verifiable-completion.md)：本文唯一分析输入，包含研究判断、不确定性、反证和工程影响。
2. [Reading Result](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260805-12-verifiable-completion.md)：Research Object 的证据边界与来源追溯记录。
