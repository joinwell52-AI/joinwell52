---
title: "可修订工作图仍需超越“图就绪”的授权边界"
date: '2026-08-06'
column: digital-employee
category: daily
summary: "计算机操作型数字员工可以用可修订 DAG 表达长任务，但节点进入 ready frontier 只证明依赖满足，不能证明权限、资源和外部副作用已获授权。"
item_id: Q-20260806-01
source_research_object: "research/analysis/Q-20260806-01-revisable-dag-computer-use.md"
source_reading_result: "research/reading/Q-20260806-01-revisable-dag-computer-use.md"
lifecycle: Published
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
outline: deep
---

<ArticleCover
  image="/assets/covers/daily-2026-08-06-governed-revisable-work-graph.svg"
  kicker="数字员工 · 每日研究"
  title="可修订工作图仍需超越“图就绪”的授权边界"
  summary="计算机操作型数字员工可以用可修订 DAG 表达长任务，但节点进入 ready frontier 只证明依赖满足，不能证明权限、资源和外部副作用已获授权。"
  version="Q-20260806-01"
  status="Daily Runtime V5 · 2026-08-06"
  languageHref="/en/digital-employee/2026-08-06-governed-revisable-work-graph"
  languageLabel="English"
/>
# 可修订工作图仍需超越“图就绪”的授权边界

计算机操作型数字员工可以把长任务表示为可修订 DAG：管理者维护依赖图，调度已就绪节点，并在执行结果暴露新依赖时改写尚未执行的部分。这比隐藏在线性提示词中的一次性计划更可观察，也更适合部分可观测、长周期工作。

## 核心判断

**图就绪只说明依赖条件满足，不说明执行已经获得授权。** 对会修改文件、操作业务系统或产生外部副作用的数字员工，节点还必须通过权限、资源隔离、应用所有权和证据要求等独立门禁。

## 来源

本文唯一分析输入是同日完成并获准进入 Production 的 Research Object。其证据边界指向已完成的 Reading Result；Production 没有从 Signal Pool 或 Reading Result 重新开展研究，也没有加入新的事实材料。

## 观察

Research Object 记录了三个结构性事实：工作图可以在运行中持久化和修订；彼此独立的 ready 节点可以并行；当原界面状态无法再次观察时，发现与文件需要通过管理者状态和归档池向后传递。它同时保留了反证：性能提升并不一致，有一个基准比单 Agent 更慢，管理者仍可能成为瓶颈和单点解释权威。

## 比较

| 规划形态 | 可见的运行状态 | 并行能力 | 授权与证据 | 恢复边界 |
|---|---|---|---|---|
| 隐藏线性计划 | 低；主要存在于上下文 | 弱 | 通常与执行叙事混在一起 | 难以重放 |
| 可修订 DAG | 图版本、节点和依赖可见 | 可调度 ready frontier | 图本身不证明权限或验收 | 可从快照与日志重建部分状态 |
| 受治理工作图 | 图状态与协议状态分离 | 仅并行无数据、资源和副作用冲突的节点 | 每节点携带权限边界、证据契约和独立验收 | 从事件与已提交副作用收据恢复 |

表中前两行基于 Research Object 对来源机制的总结；第三行是 Research Center 的工程综合，不是来源已经实现或验证的能力。

## 讨论

关键变化不是“增加更多 Agent”，而是让计划在执行中成为版本化、可检查、可回放的运行投影。但编排投影不能替代任务事实、审批权和完成证据。管理者可以提出“节点完成”或“任务完成”的声明，却不能凭图状态自行批准自己的解释。

并行也不能只看数据依赖。两个节点即使没有输入输出依赖，仍可能争用同一浏览器会话、业务记录、文件路径或外部账户。真正的 ready frontier 应同时满足依赖条件与 authority conditions。

## 工程影响

对数字员工，WorkOrder 应投影为带版本的工作图，节点包含责任、依赖、所需 Skill、授权边界、预期产物和完成证据。每次图变更都应记录操作者、原因、前后版本和受影响节点。

对 CodeFlowMu，FCoP TASK/REPORT/REVIEW 继续保持协议事实权威；可修订项目图只承担编排。应先增加图版本、变更事件、节点证据收据和恢复投影，再考虑开放广泛并行执行。

## 边界与反证

现有证据来自一份 2026 年 6 月预印本及其公开实现线索，没有证明企业权限模型、事务边界、并发副作用安全、精确崩溃恢复或独立完成验收。部分评估依赖 LLM 或 rubric judge，且并行配置并非在所有基准上更快。

## 未来工作

需要验证最小图变更契约、权限与依赖联合就绪规则、下游重接线后已完成节点的有效性，以及恢复时如何区分安全重放和已经发生的外部副作用。

## 可视化说明

配图把“可修订图—ready frontier—授权门禁—证据验收”画成四个分离层。它是基于 Research Object 的 Research Center 架构综合，不表达来源未提供的量化结果。

## 证据与引用

1. [Research Object](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260806-01-revisable-dag-computer-use.md)：本文唯一分析输入，包含判断、不确定性、反证和工程影响。
2. [Reading Result](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260806-01-revisable-dag-computer-use.md)：Research Object 声明的证据边界与来源追溯记录；本文不从该记录重新分析。
