---
schema: "publication-candidate-article/v1"
title: "数字员工需要暂停保留型预算准入，而不是硬终止语义"
date: "2026-08-08"
column: "digital-employee"
category: "daily"
summary: "预算耗尽不应被简化为失败或终止。对长周期数字员工，更稳健的运行语义是阻止新的生成式工作、保留已接受状态、允许有限结算，并只在授权预算策略变化后恢复执行。"
sources:
  - "research/analysis/Q-20260808-01-pause-preserving-budget-admission.md"
  - "research/reading/Q-20260808-01-session-budget-governance.md"
item_id: "Q-20260808-01"
lifecycle: "Publication Candidate"
source_research_object: "research/analysis/Q-20260808-01-pause-preserving-budget-admission.md"
source_reading_result: "research/reading/Q-20260808-01-session-budget-governance.md"
visualization: "staging/publication-candidates/2026-08-08-pause-preserving-budget-admission.svg"
visualization_decision: "Required — pause-preserving budget-admission lifecycle diagram included; Research Center synthesis based on the cited Research Object"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: false
---

# 数字员工需要暂停保留型预算准入，而不是硬终止语义

数字员工开始承担长周期、可恢复工作后，预算就不再只是报表里的一个数字，而会直接决定**下一步工作是否还能被准入**。

## 核心判断

预算耗尽最稳健的工程语义不是 `failed`，也不是立即销毁会话，而是一个**可逆的工作准入状态**：新的生成式请求停止进入运行时，已经接受的工作状态被保留，必要的结算动作仍可完成，恢复则必须来自有权修改预算策略的主体。

这一定义来自 `Q-20260808-01` Research Object。Production 未重新读取 Signal Pool，也未从 Reading Result 开展新的分析。

## 来源

本文唯一分析输入是 [Research Object — Pause-Preserving Budget Admission](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260808-01-pause-preserving-budget-admission.md)。Reading Result 仅作为该对象已经声明的证据追溯入口，Production 未据此重新研究。

## 观察

Research Object 区分了几个很容易被 UI 合并掉的状态：预算策略、精确执行计量、面向运营者的显示值、新工作是否可准入、已经进入系统的结算工作，以及可恢复的长期工作状态。

这意味着“硬预算”需要谨慎解释。它可以是对**新模型请求准入**的硬门禁，却不自动等于最终账单的精确上限，因为门禁生效前已经接受的请求仍可能继续结算。类似地，预算触发暂停后，工作身份和历史仍然存在；它既不是业务完成，也不等于执行失败。

## 比较

| 语义 | 允许新生成式工作 | 保留长期工作状态 | 允许有限结算 | 恢复需要授权 |
|---|---:|---:|---:|---:|
| 普通 Running | 是 | 是 | 是 | 否 |
| BudgetPaused | 否 | 是 | 是 | 是 |
| Failed | 否 | 视实现而定 | 通常否 | 通常需要恢复流程 |
| Completed | 否 | 是 | 不应再产生新工作 | 不适用 |

表格是 Research Center 基于 Research Object 的状态语义综合，不表示来源产品定义了同名状态机。

## 讨论

真正值得工程化的不是“显示剩余预算”，而是把经济权限变成运行时准入条件。预算策略应绑定到长期 WorkOrder 或等价工作身份，由明确的策略所有者修改；执行器不能因为一次重试、重连或模型自我判断就恢复已经被预算门禁暂停的工作。

同时，精确执行计量与运营显示值应分开记录。Research Object 明确提醒：可见数值可能经过舍入，而执行门禁使用的量不应被运营 UI 的近似显示替代。若系统承诺“绝不超过某个最终金额”，就超出了当前证据边界。

共享预算还带来另一个治理问题：多个线程共用同一上限时，并不能天然得到角色、部门或任务级的独立责任归属。更高层的组织预算需要作为单独策略对象存在。

## 工程影响

对数字员工运行时，建议把 `Active`、`BudgetPaused`、`WaitingForAuthority` 与 `Completed` 分开；保存预算策略所有者、执行计量、显示计量、暂停原因和恢复授权，并为已经开始的结算动作保留一个窄化 allowlist。

对 CodeFlowMu，这类暂停首先应落在 Runtime / WorkOrder 状态和观察界面中，而不是因为一个产品案例就扩展 FCoP 协议。恢复应从已接受的持久状态重新打开执行，而不是要求原 Provider session 继续存在。

## 边界与反证

当前证据不支持几个更强结论：预算门禁不证明最终费用绝对不会超出阈值；公开 list cost 不等于企业最终账单；共享 session cap 不提供每线程预算；Exactly-once 事件、重连与组织级累计预算也没有被证明。

因此，本文的判断是“预算应治理工作准入”，不是“一个预算字段就能解决企业成本治理”。

## 未来工作

下一步应验证最小预算状态契约：cap、精确消耗、显示值、结算权限与恢复权限如何分离；角色预算如何与共享 WorkOrder 预算组合；崩溃后 BudgetPaused 与结算 receipt 如何恢复；以及 UI 是否需要独立的预算决策状态。

## 可视化说明

配图把运行过程拆成 `Active → Budget Gate → BudgetPaused → Settlement Drain → Authorized Resume`。图中是 Research Center 基于 Research Object 的机制综合，不表达来源未提供的量化结果。

## 证据与引用

1. [Research Object — Pause-Preserving Budget Admission](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260808-01-pause-preserving-budget-admission.md)：本文唯一分析输入，包含研究判断、不确定性、反证与工程影响。
2. [Reading Result — Session Budget Governance](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260808-01-session-budget-governance.md)：Research Object 的证据追溯入口；Production 未从该文件重新开展研究。

> 编辑状态：双语结构、预算门禁与终止的区别、overshoot 边界、共享预算限制和授权恢复语义均已保留；尚未发布。
