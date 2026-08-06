---
schema: "publication-candidate-article/v1"
title: "企业 Agent 控制平面需要决策信封，而不只是配置优先级"
date: "2026-08-06"
column: "industry-architecture"
category: "daily"
summary: "托管设置可以表达组织意图，但真正的企业 Agent 治理需要把政策来源、主体、能力、模型、沙箱和恢复上下文绑定到每次关键执行，并由各执行点返回证据收据。"
sources:
  - "research/analysis/Q-20260806-02-enterprise-agent-control-plane.md"
  - "research/reading/Q-20260806-02-enterprise-agent-control-plane.md"
item_id: "Q-20260806-02"
lifecycle: "Publication Candidate"
source_research_object: "research/analysis/Q-20260806-02-enterprise-agent-control-plane.md"
source_reading_result: "research/reading/Q-20260806-02-enterprise-agent-control-plane.md"
visualization: "staging/publication-candidates/2026-08-06-enterprise-agent-decision-envelope.svg"
visualization_decision: "Required — decision-envelope and enforcement-receipt diagram included"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: false
---

# 企业 Agent 控制平面需要决策信封，而不只是配置优先级

企业编码 Agent 的治理表面通常分散在托管设置、工具权限、操作系统沙箱、模型选择和会话恢复中。配置可以声明“谁的政策优先”，但不能自动证明每一条执行路径都真正应用了同一政策。

## 核心判断

**企业 Agent 控制平面应为每次关键执行生成版本化决策信封，并要求执行点返回 enforcement receipt。** 决策信封至少绑定政策来源、执行主体、请求能力、实际模型、沙箱模式和恢复上下文。

## 来源

本文只消费获准进入 Production 的 Research Object。其依据是同日完成的 Reading Result；Production 没有独立复现安全绕过，也没有把厂商修复说明提升为第三方验证结果。

## 观察

Research Object 把组织政策分发、权限提示、OS 沙箱、模型回退和 session resume 放在同一架构问题中。它同时保留了重要矛盾：官方文档赋予 managed settings 最高优先级，但发布说明仍报告过绕过托管禁用策略或工作流沙箱边界的执行路径。由此可见，配置权威与执行点一致性是两个不同问题。

## 比较

| 控制表面 | 表达的意图 | 需要的执行证据 | 未被现有证据证明的内容 |
|---|---|---|---|
| Managed settings | 组织政策与优先级 | 有效政策版本和来源 | 所有路径都执行了同一政策 |
| 工具权限 | 某类工具是否允许 | 请求、决定、操作者与原因 | 子进程与绕行路径被完全覆盖 |
| OS sandbox | Bash 与子进程的系统边界 | 实际沙箱模式与失败行为 | 跨平台等价与绝不 fail-open |
| 模型回退 | 执行身份发生替换 | 原模型、实际模型、原因与属性变化 | 回退已被授权且语义等价 |
| Session resume | 继续过去工作 | 工作目录、政策、模型、沙箱和未结副作用清单 | 恢复上下文与原上下文完全等价 |

每一行都区分了文档化意图、应产生的证据和当前未知项；表格不把厂商声明解释为独立验证。

## 讨论

最高优先级配置是必要条件，却不是完整控制平面。Agent、Skill、workflow、命令、子进程和恢复路径都可能形成不同 enforcement point。控制平面的核心任务，是证明每个执行点应用了相同的有效政策，或在无法证明时明确 fail closed。

模型回退也不能只作为提醒。模型身份变化可能改变成本、驻留、能力和安全属性，因此回退应成为可授权的状态迁移。恢复会话同样不只是恢复聊天文本，而是恢复工作目录、政策版本、实际模型、沙箱状态和未完成影响的语义上下文。

## 工程影响

对企业数字员工，Position 与 WorkOrder 应先解析为 effective policy snapshot；每个 Operation Node 接收决策信封，并返回包含实际执行身份和政策版本的收据。模型替换、沙箱不可用和恢复上下文漂移应进入 allow、deny 或 escalation 流程。

对 CodeFlowMu，应把政策解析投影与 FCoP 生命周期状态分开，持久化 requested/actual model、sandbox mode、permission decision 与 policy provenance，并在 resume 时比较上下文 manifest，发现实质漂移就阻断或升级。

## 边界与反证

证据来自官方发布说明和文档，没有独立安全公告、利用复现、平台回归矩阵或事故下降数据。当前文档也可能与发布时实现状态不完全一致。本文因此只提出架构判断，不宣称命名修复已经被独立证明有效。

## 未来工作

需要确定哪些政策决定必须集中完成、哪些可带来源证明地缓存；哪些模型属性变化必须重新授权；如何证明所有执行路径使用同一政策版本；以及哪些恢复差异可以继续、哪些必须阻断。

## 可视化说明

配图以决策信封为中心，把政策、主体与能力、模型、沙箱、恢复上下文连接到执行点收据。来源标注为基于 Research Object 的 Research Center 架构综合。

## 证据与引用

1. [Research Object](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260806-02-enterprise-agent-control-plane.md)：本文唯一分析输入，明确区分文档化政策、执行一致性与独立验证缺口。
2. [Reading Result](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260806-02-enterprise-agent-control-plane.md)：Research Object 声明的证据边界和来源追溯记录；本文不从该记录重新研究。

> 编辑状态：已完成双语实质一致性、厂商声明限定、控制表面对照和证据缺口检查；尚未发布。
