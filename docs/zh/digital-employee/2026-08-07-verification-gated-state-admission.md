---
title: "持久数字员工需要“验证门控的状态准入”，而不只是耐久记忆"
date: '2026-08-07'
column: digital-employee
category: daily
summary: "长周期数字员工不仅要保存发生过什么，还要区分哪些状态获准影响未来工作：事件历史可以只增不删，但可复用记忆、完成结论和派生保证必须经过证据与责任所有者的状态准入门禁。"
item_id: Q-20260807-01
source_research_object: "research/analysis/Q-20260807-01-verification-gated-durable-state-admission.md"
source_reading_result: "research/reading/Q-20260807-01-argus-verification-gated-runtime.md"
lifecycle: Published
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
outline: deep
---

<ArticleCover
  image="/assets/covers/daily-2026-08-07-verification-gated-state-admission.svg"
  kicker="数字员工 · 每日研究"
  title="持久数字员工需要“验证门控的状态准入”，而不只是耐久记忆"
  summary="长周期数字员工不仅要保存发生过什么，还要区分哪些状态获准影响未来工作：事件历史可以只增不删，但可复用记忆、完成结论和派生保证必须经过证据与责任所有者的状态准入门禁。"
  version="Q-20260807-01"
  status="Daily Runtime V5 · 2026-08-07"
  languageHref="/en/digital-employee/2026-08-07-verification-gated-state-admission"
  languageLabel="English"
/>
# 持久数字员工需要“验证门控的状态准入”，而不只是耐久记忆

数字员工一旦从单次问答变成长周期工作者，“记住更多”并不是完整答案。真正困难的是：**哪些内容只需要被保留为历史，哪些内容已经获得资格去影响未来任务？**

同一天完成的 Research Object 给出了一个更严格的工程判断：Provider 会话可以是一次性的，但工作身份、证据、已接受状态、未决决策和完成结论必须持久存在；而且“被保存”与“被批准进入未来运行时”必须是两回事。

## 核心判断

**持久化不是授权。**

模型输出、执行者记忆、一次 Reviewer 评价，甚至一个已经落盘的 assurance 对象，都不能因为“存在于磁盘上”就自动成为下一轮工作的权威输入。长周期数字员工需要一个验证门控的状态准入层：先保存发生过什么，再由证据类型与责任所有者决定什么可以进入未来运行时。

## 来源

本文只消费 `Q-20260807-01` 的 Production-authorized Research Object。Production 没有回到 Signal Pool 或 Reading Result 重新研究，也没有加入新的外部事实。Reading Result 仅作为 Research Object 已声明的证据边界与追溯入口。

## 观察

Research Object 将持久运行拆成了几类不同对象：长期 campaign/work 身份、只增事件时间线、证据引用、checkpoint、开放问题、记忆与技能、route、task definition、completion verdict，以及派生的 assurance/certification 视图。

其中最重要的区别不是“哪些东西落盘”，而是“哪些东西获得了未来影响力”。失败尝试与 rejected route 可以长期保留，因为它们对以后转向仍有价值；但它们不应被静默折叠进一份看似成功的摘要。类似地，一份 Reviewer 结论可以成为证据，却不能脱离风险策略和责任所有者独立升级为最终阶段权威。

Research Object 还保留了一个非常关键的反例：canonical campaign 已经完成，但一个持久化的 assurance snapshot 仍然处于 blocked。这个矛盾说明，**耐久的派生投影也可能过期**。如果 UI 或自动化把“持久 assurance”误认为事实权威，就会让旧投影覆盖新状态。

## 比较

| 状态层 | 主要目的 | 是否应只增 | 谁能改变未来行为 | 典型风险 |
|---|---|---:|---|---|
| Provider session | 临时推理与工具上下文 | 否 | 不应直接拥有长期权威 | 会话丢失、隐藏上下文 |
| 事件与证据历史 | 保存“发生过什么” | 是 | 本身不自动授权未来行为 | 日志存在但含义未裁决 |
| Reviewed checkpoint | 压缩可恢复工作面 | 否，需版本化 | 经策略允许的责任所有者 | 摘要遗漏、投影滞后 |
| Admitted reusable state | 决定“未来可以依赖什么” | 受治理 | 明确 owner + evidence gate | 错误记忆被永久放大 |
| Assurance / certification projection | 面向运营或验收的派生视图 | 可重算 | 不应覆盖 canonical workflow | stale projection 覆盖真实状态 |

前四行来自 Research Object 对机制的分析；“admitted reusable state”作为统一运行层是 Research Center 对这些机制的工程综合，不表示来源已经实现同名协议对象。

## 讨论

这会把“数字员工记忆”从一个存储问题改造成一个治理问题。

第一，数字员工需要两种耐久承诺：**历史耐久**与**权威耐久**。历史耐久要求我们保留执行、失败、证据和角色判断，让事故可以回放；权威耐久则要求未来工作只读取经过准入的状态。把两者混成一个 memory store，会让“被记录”悄悄等同于“被相信”。

第二，completion 必须是带 provenance 的 verdict，而不是 worker 最后一句话。低风险、边界清楚的任务可以允许 policy-defined self-review；高后果阶段则可能要求独立 QA、EVAL 或直接 operator/ADMIN 决策。关键不是规定一个统一 Reviewer，而是让“谁有权关闭什么”可以被检查。

第三，checkpoint 是恢复优化，不是真相替代品。它可以帮助下一次执行快速继续，但必须能回到完整事件与证据链。任何 assurance、dashboard 或 summary 也都应持续与 canonical workflow state 对账。

## 工程影响

对于数字员工运行时，建议把长生命周期单位建模为独立于模型会话的 WorkOrder 或 campaign identity，并把 standing intent、当前目标、约束、验收条件和未决人类决定持久化。

运行时应同时维护：一条只增的执行/证据 tape，以及一份较小、经过 Review 的恢复 checkpoint。Memory、Skill、route、task definition 和 completion transition 应分别声明 owner 与 evidence class，只有通过准入门禁的状态才能进入下一轮工作。

对 CodeFlowMu，FCoP-visible TASK/REPORT/REVIEW 与事件历史继续作为共享事实面；Runtime checkpoint 只作为执行投影。worker completion、QA verdict、EVAL observation 和 ADMIN approval 不应折叠成一个布尔 `done`。恢复流程也应从已接受状态和未决决定继续，而不是依赖原来的模型 session 还存在。

## 边界与反证

当前证据不支持几个更强的结论。startup-to-mature 的效率变化不能隔离 memory、review、routing 或任务顺序各自的因果贡献；独立 Reviewer 路由并非随机实验，也没有给出普适 false-acceptance rate；verifier 本身可能遗漏关键属性；如果授权者做出错误取舍，状态准入也不会自动消除 goal drift。

因此，本文讨论的是**更可审计、更可恢复的状态治理结构**，不是“持久记忆必然提高质量”或“独立 Reviewer 总是更好”。

## 未来工作

下一步最值得验证的是最小状态准入契约：如何区分 proposed、evidenced、accepted、rejected 与 superseded；哪些状态类需要 executable verification、独立 QA、允许 self-review 或直接 operator approval；崩溃后 canonical task state 与 assurance/checkpoint 如何事务性对账；以及怎样通过前瞻性用户研究测量 operator intervention 与 goal-drift correction。

## 可视化说明

配图把“Transient Session → Append-only Evidence → Reviewed Checkpoint → State Admission → Future Work”分成五层，并把派生 Assurance 画成可重算旁路。图中关系是基于 Research Object 的 Research Center 架构综合，不表达来源未提供的量化结果。

## 证据与引用

1. [Research Object — Verification-Gated Durable State Admission](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260807-01-verification-gated-durable-state-admission.md)：本文唯一分析输入，包含观察、研究判断、不确定性、反证和工程影响。
2. [Reading Result — Argus verification-gated runtime](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260807-01-argus-verification-gated-runtime.md)：Research Object 的证据边界与来源追溯记录；Production 未从该文件重新开展分析。
