---
title: "Agent 中断后，原任务怎样安全接管？别把 recoverable 当成重新执行许可"
date: "2026-09-01"
updated: "2026-09-02"
column: open-source-engineering
category: daily
article_type: engineering-case-study
research_question: "FCoP 的 TASK 文件和五桶仍在时，Runtime 中断后何时可由新 Agent 接管同一任务？"
evidence_status: "Research complete; contract frozen; implementation and independent QA not claimed"
publication_authorized: true
edition: research-center
summary: "同一 TASK 文件仍在，不等于可以重新执行。RA-7/RA-8 进入真实 Dispatcher 恢复方法，效果已确认与效果未知却都回到 inbox；研究据此区分接管准入、仅对账和待核对，并保留正常 rework 的原有语义。"
sources: "/zh/research/evidence/2026-09-01-interruption-research"
project_relevance: substantive-relationship
item_id: "RIR-20260901-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-01-interrupted-task-takeover-cover.png"
citation_status: "Completed"
editing_status: "Completed"
---

<ArticleCover
  image="/assets/covers/daily-2026-09-01-interrupted-task-takeover-cover.png"
  kicker="中断接管研究 · 01"
  title="Agent 中断后，原任务怎样安全接管？"
  summary="同一 TASK 文件仍在，不等于可以重新执行。RA-7/RA-8 进入真实 Dispatcher 恢复方法，效果已确认与效果未知却都回到 inbox；研究据此区分接管准入、仅对账和待核对，并保留正常 rework 的原有语义。"
  version="RIR-20260901-01"
  status="工程研究 · 合同已冻结"
  languageHref="/en/engineering/2026-09-01-interrupted-task-takeover"
  languageLabel="English"
/>

# Agent 中断后，原任务怎样安全接管？

一个 Agent 突然退出，FCoP 的 TASK 文件、REPORT 和五桶位置却还在。此时最自然的想法是：换一个 Agent，把同一份文件交给它继续做。

这个方向是对的，但“文件还在”只解决了任务身份和工作上下文，没有回答最危险的一句：**原 Agent 在中断前，动作做到哪里了？**

如果它尚未开始，新的执行者可能获准重新执行；如果它已经修改了外部系统、只差写收尾报告，再做一次就会制造第二个效果；如果无法确认，自动执行只是在用猜测代替事实。本文研究的不是如何新建任务或重新派单。相反，研究对象始终是 FCoP 五桶中的**同一张 TASK**：Agent 中断后，谁可以接管，以及依据什么决定重新执行、对账或待核对。

CodeFlowMu 是我们开发的本地多 Agent 协作 Runtime：它以 FCoP TASK/REPORT 文件组织工程协作，并维护 Session、lease、调度、审批和证据。本文固定检查 V2.1.2 基线 `919c3b48` 的真实代码和测试；数据属于该固定基线。至 2026-09-02 公开稿，后续接管合同已经冻结；本文不主张新能力已实现、通过独立 QA 或发版。

## 1. 外部项目提出的是“中断后的不确定性”

[OpenAI Codex](https://github.com/openai/codex) 是 OpenAI 维护的开源编程 Agent；其 [#41916](https://github.com/openai/codex/pull/41916) 处理重新连接后的 active thread，但对可能已经提交、状态却不明确的输入选择保留给人工审阅，而不是自动重发。它说明连接恢复并不能证明动作未发生。

[AG2](https://github.com/ag2ai/ag2) 是开源多 Agent 框架；其已合入的 [#3222](https://github.com/ag2ai/ag2/pull/3222) 允许跨连接、跨进程加载持久历史，同时明确没有跨进程 lease。历史可读取，和另一个执行者有权接管，是两件不同的事。

Orkas 是一个开源多模型聊天应用。其 [#53](https://github.com/Orkas-AI/Orkas/pull/53)则把重复 terminal/process 事件当作 replay，并确保只接受一次 finalization。它提醒我们：恢复通道变多时，旧执行者的迟到回写也必须被控制。

这些项目不是 CodeFlowMu 的依赖，也没有替我们证明缺陷。它们把问题收窄为一个可验证的命题：**中断首先是一项技术事实，而不是“原动作已经失败”的业务事实。**

## 2. TASK 身份仍在，Session 不能原地复活

FCoP 文件落盘后，原 TASK 不会因为 Agent 进程消失而变成一张新任务。接管者应沿用同一 `task_id`、文件路径、线程归属和生命周期位置；不能创建第二张 TASK，也不应把原任务伪装成新的派发请求。

但原 Session 的内存、SDK 连接和本地执行句柄可能已经不存在。因此 Runtime 需要先处理执行权：先检查托管外部作业和旧 owner 是否仍有效；有效时保留执行权、不制造 successor。只有满足既有回收条件时才处理旧 lease，再判断接管准入。

V2.1.2 已有重要保护。`reconcileLostSessions` 对仍存活的托管作业保留运行状态和 lease，不制造第二次调度资格；对无 live handle 的记录收敛为 `SESSION_LOST`。另一组探针还验证：重启后的 successor 已接管时，旧 Session 的迟到 settle 不会覆盖已收敛的旧记录。这些能力应保留。

可见，正确的问题不是“能不能恢复旧 Agent”，而是：**旧执行者还能不能写，新执行者能不能开始，以及原动作事实是什么。**

## 3. `recoverable` 不是“动作没有发生”

当前 Runtime 有一条将未结算 Session 识别为 `recoverable` 的技术路径：例如 Session 未完成且没有 REPORT，界面/队列可以建议 recover。它适合表达“Runtime 需要处理一次中断”，却不包含外部动作是否发生的判断。

因此，我们没有只凭静态字段推断缺陷，也没有假设一次真实支付、邮件或 Issue 已经发生重复。受控探针直接进入实际 Dispatcher 的普通恢复方法，固定退避为零，只隔离“它会作出什么恢复决定”。输入分别是：

| 场景 | 合成事件声明的效果语义 | 建议的安全动作 | 当前观察 |
| --- | --- | --- | --- |
| RA-7 | effect 已确认存在 | `reconcile_only` | 被恢复到 inbox |
| RA-8 | effect 未知 | `hold_for_review` | 同样被恢复到 inbox |

两种语义不同的输入获得了同一个自动恢复前置状态。代码路径没有消费 `operation_fingerprint`、`operation_outcome`、`retry_policy` 或 `next_safe_action`。这不证明线上已经产生重复副作用；它证明的是更窄的工程断点：**中断后的普通恢复尚未把效果事实纳入接管准入。**

这里需要特别避免一个措辞错误。当前实现中有一些方法名和队列状态使用 `failed`，但本研究的入口不是 `failed`。意外关机、进程消失、lease 失联或收尾未写完，首先是 `interrupted`。把它立刻翻译为“动作失败、可重新执行”，恰好跳过了最需要确认的事实。

因此，至少应把三个概念分开：

```text
技术中断 ≠ 动作未发生 ≠ 可重新执行
```

RA-7/RA-8 的输入是合成事件，不是对真实外部系统查询得到的事实。两项观察的转录、原研究 fixture 与限制见[证据包](/zh/research/evidence/2026-09-01-interruption-research)。

## 4. 接管之前，先确认动作到底发生没有

这不是要在五桶之外另加一个任务池。它是同一 TASK 的一次受控确认：

```text
中断
  → 检查外部执行与原 owner 的有效性
  → 执行权未释放时阻断接管
  → 确认效果事实
  → 同 TASK 重新执行 / 仅对账 / 待核对
```

先检查一个前置条件：

- **外部执行仍活，或原 owner 仍有有效执行权**：记录 `not_admitted`，保留原 owner，不创建 successor。owner 有效不等于动作正在运行；阻断理由和效果事实必须分开。

只有确认原执行不再运行，才进入三种 admission disposition：

- **效果确定未发生**：在当前授权、效果事实与 successor ownership 都有效时，由 successor 对同一 TASK `reexecute`；
- **效果已确认**：禁止重做原动作，只补 REPORT、审计或对账；
- **效果未知**：阻断自动执行，交给既有 FCoP 的事实核查和审核责任链；

另外，**旧 owner 迟到终态**：作为独立 fencing 事件拒绝覆盖 successor 的权威状态，最多保留诊断记录；它不改变当前 admission disposition。

这比“失败就重试”多了一步，却避免把最昂贵的判断交给运气。对于只读操作或具稳定幂等键的执行器，确认过程可能很快；对于无法查询且不可安全去重的外部操作，`unknown` 不是失败，而是诚实的安全结论。

![Agent 中断后，原任务怎样安全接管？](/assets/figures/2026-09-01-interrupted-task-takeover.zh.png)

*图 1：冻结合同的接管判断摘要，不是 V2.1.2 已实现流程。仍在运行或原 owner 有效时先阻断；进入判断后，效果事实决定三种处置，旧 owner 迟到写入独立处理。来源：RUN-002、冻结合同 Rev.2；研究限制见证据说明。*

[点击查看高清图](/assets/figures/2026-09-01-interrupted-task-takeover.zh.png)

## 5. 复用既有能力，冻结窄接管合同

CodeFlowMu 不需要重做整个 Agent 平台。外部平台可以提供会话恢复、执行状态和工具回执；CodeFlowMu 继续负责同 TASK 的 lease、FCoP 生命周期、事实核查和最终处置。

已有的 `recoverTaskExecution` 也已经具备治理快照、revision 二次校验、recovery fence 和 live Session 阻断。下一步不应发明“大而全的 Recovery Epoch 框架”，而是在既有技术中断接管入口前使用已冻结的窄合同。以下是设计要求，不是基线能力：

```text
输入 = 当前 TASK/attempt/lease 身份
     + 已核验的效果事实
     + 当前 revision 下有效的授权

结论 = reexecute | reconcile_only | hold_for_review

陈旧 owner 终态 = stale-owner fencing event（不覆盖上述结论）
```

其中 `hold_for_review` 是接管结论，不是第六个生命周期桶；它必须在既有五桶中有明确的展示、阻断和再准入责任人。

更重要的是，这个判断不能只挂在某一个 UI 按钮或一条恢复路径上。任何处理 technical interruption takeover、创建该次中断 successor 的入口，都必须经过同一份 recovery admission 合同。正常 PM/ADMIN 授权的 rework、reassign 和新 round retry 保留原路径，不创建 interruption case；混合入口由服务端依据持久状态分类，不能由调用方自报绕过。底层 `startSession` 不应自行推导“是否可以重新执行”。否则，即使一个恢复入口修正了，另一个旁路仍可能绕过效果事实检查。

## 6. 证据边界与下一步

本轮复跑包括 Session/lease、Dispatcher、治理、事实核查、EVAL 与证据关联等路径。关于“决定如何留下、但不越权”的第二个研究在配套文章中单独讨论。两项研究不能互相代偿：前者确认动作事实，后者确认接管决定的证据与授权连续性。

本研究未执行真实掉电、浏览器端到端流程或真实外部副作用；RA-7/RA-8 固定了退避以观察恢复判定。因此它不能给出线上重复率，也不应被写成“CodeFlowMu 已经自动重复执行”。它支持的结论更具体：**FCoP 的文件让任务身份在 Agent 中断后仍然连续；但任务身份连续，不等于执行许可连续。要让另一个 Agent 安全接管同一 TASK，Runtime 还必须确认中断前的效果事实，并重新验证当前执行授权。**

后续冻结合同区分两条重执行分支：可信未开始证明对应 `none_verified`，需要当前 recovery authority 与 successor ownership；重做已识别动作的 `single_verified` 还需要 operation binding 与可用的 operation authority。无法解释的证据或未分类的多动作保持待核对。IA-1～IA-12、DC-1～DC-3 与独立 QA 是后续实现验收，不是本轮研究成绩。

配套阅读：[决定证据连续性](./2026-09-01-decision-evidence-continuity) · [双语证据说明](/zh/research/evidence/2026-09-01-interruption-research)。
