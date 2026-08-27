---
title: "服务在线，不代表任务可以继续：Agent 恢复为什么必须证明执行资格与因果依赖"
date: '2026-08-26'
column: digital-employee
category: daily
article_type: case-study
edition: research-center
research_question: "当服务仍然健康、会话或执行轮次仍存在时，运行时怎样证明当前任务仍有资格继续，并证明下游释放确实建立在已满足的上游依赖上？"
summary: "从 OpenHands 一次 health 正常但会话失去活性的事故，到 CodeFlowMu 一条真实恢复链，区分服务健康、执行活性、任务资格、因果依赖与正式验收。"
sources: "公开一手来源与访问受限的第一方证据范围均在正文列明。"
project_relevance: case-evidence
item_id: "EBR-20260826-04"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-26-service-health-task-recovery-case-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-26-service-health-task-recovery-case-cover.png"
  kicker="数字员工 · 工程研究"
  title="服务在线，不代表任务可以继续：Agent 恢复为什么必须证明执行资格与因果依赖"
  summary="健康只能说明服务还能回答；真正恢复还要重新证明任务可执行、依赖已满足，并把每一次继续与对应证据绑定。"
  version="EBR-20260826-04"
  status="工程研究 · 2026-08-26"
  languageHref="/en/digital-employee/2026-08-26-service-health-task-recovery-case"
  languageLabel="English"
/>

# 服务在线，不代表任务可以继续：Agent 恢复为什么必须证明执行资格与因果依赖

**服务还能返回 200，只能说明某个接口仍然活着；它不能证明会话还在推进，更不能证明当前任务现在有资格继续。一次可靠的 Agent 恢复，真正需要重新证明的是：谁有权恢复、任务是否已经进入合法可执行状态、当前执行权是否仍有效，以及下游释放所依赖的上游事实是否真的成立。**

CodeFlowMu 是一个本地运行的多 Agent 协作系统，用任务、角色、门禁、报告与审批，把多个 Agent 的工作组织成可追踪、可恢复、可验证的执行链。我们在 2026-08-25 保留了一条真实恢复记录，它最后没有变成一个“系统成功自愈”的漂亮故事，因为其中留下了一个更有研究价值的问题：**QA 的物理释放时间早于两份上游终态报告。**

这既不能直接证明门禁被绕过，也绝不能反过来证明依赖已经正确满足。它暴露的是另一件事：**时间顺序不是因果证明。**

## 1. 一盏绿灯，回答不了五个问题

Agent 系统发生故障时，经常会把几个完全不同的事实压成一个“正常 / 异常”状态。实际上至少需要分开看五层：

| 层级 | 它真正回答什么 | 不能替代什么 |
|---|---|---|
| 服务健康 | 进程或 API 还能不能响应？ | 会话是否还在推进 |
| 执行活性 | 当前 Session / job 是否仍有进展？ | 任务是否有资格继续 |
| 任务资格 | 当前任务是否处于合法、唯一、可派工状态？ | 上游依赖是否已经满足 |
| 因果依赖 | 为什么这个下游现在可以被释放？ | 业务结果是否验收通过 |
| 正式验收 | 当前交付是否被有权角色接受？ | 前面的技术事实 |

所以真正的恢复链不是：

**服务在线 → 再叫醒 Agent**

而应该更接近：

**确认恢复授权 → 核对执行轮次与任务状态 → 证明依赖条件 → 再次派工 → 验证结果 → 正式验收**

这几层之间不能互相签字。

## 2. OpenHands 给出的外部参照：health 正常，会话仍可能已经失去活性

OpenHands software-agent-sdk 的 PR #4548 记录了一次很具体的生产事故：浏览器工具相关的 conversation shutdown 卡住了约 **8 小时 21 分**，但 `/health` 和 metadata 路由仍然正常返回 200；conversation event 请求却无法正常打开。也就是说，从服务层看“还活着”，从具体会话看已经无法继续工作。

根因集中在 `AsyncExecutor.close()`：剩余任务没有被取消，portal thread 的等待又没有上限。修复一方面改为取消剩余任务，另一方面给关闭等待增加默认 **10 秒**边界；超时后记录 warning 并放弃继续无限等待。PR 还明确把这个行为定义成 **bounded, best-effort safety net**，而不是“所有资源已经保证清理完毕”。

这点非常重要，因为它没有用新的绿灯覆盖旧问题：

> **bounded shutdown 只是限制故障扩散，不等于证明会话已经干净退出。**

OpenHands 这个案例只支持一个较窄的外部结论：**service health ≠ session liveness。** 它不是 CodeFlowMu 的根因，也不能替我们的任务恢复模型背书。

## 3. CodeFlowMu 的真实问题：Agent 可以被唤醒，但任务还没合法进入执行态

CodeFlowMu 这次故障发生在更高一层。问题不是服务关闭，而是一条恢复路径可能在任务完成必要的生命周期迁移之前就唤醒 Worker。

这类故障危险的地方在于，它看起来很容易“修”：既然 Agent 停住了，再派一次就行。但如果任务还没有从待领取正确进入执行中，重新唤醒只会把不一致继续向下传播：新的 Session、报告、测试甚至完成状态，都可能建立在错误的任务前提上。

因此 ADMIN 给 PM 的恢复授权是有边界的：修复生命周期迁移、唤醒和报告门禁；增加回归证据；恢复或重派两项卡住的工作；并且在 **DEV 与 OPS 的终态报告存在之前，不释放 QA**。这不是一般性的“接管权限”，而是一份特定故障、特定动作范围内的恢复授权。

这也说明恢复的第一步不是技术动作，而是：

> **先证明谁有权修、允许修到哪里。**

## 4. 这条时间线最有价值的地方，是它没有替我们证明因果

公开 A4 时间线保留了几个关键节点：

| 北京时间 | 事件 |
|---|---|
| 14:35:22 | 有限恢复授权生效 |
| 14:35:29 | 恢复上下文投递给 PM |
| 14:43:54 | OPS 恢复派工 |
| 14:47:32 | DEV 恢复派工 |
| 14:48:25 | QA 从 inbox 进入 active |
| 14:48:42 | OPS 终态报告提交 |
| 14:49:37 | DEV 终态报告提交 |
| 15:30:36 | active-before-wake 修复提交并完成分组验证 |

从物理时间看，QA 在 14:48:25 被释放，而两份上游终态报告分别在 17 秒和 72 秒之后出现。正式恢复指令又明确要求两份终态报告存在后才能释放 QA。

这里最容易犯两个相反的错误。

第一种是直接说：

> QA 一定被错误提前释放了。

现有公开数据还不足以支持这么强的结论。写入时间、事件发生时间、时钟来源、是否存在未公开的先行逻辑事件，都可能不同。

第二种则是因为最后 OPS、DEV、QA 都进入终态，就说：

> 依赖顺序已经被证明正确。

这同样没有证据。

当前记录真正支持的是：

> **QA 释放所依赖的因果依据，没有在现有公开记录中被绑定得足够清楚。**

这比一句“最终恢复成功”更有价值，因为它把下一阶段应该补什么说清楚了。

## 5. 为什么时间戳不能单独承担依赖证明？

分布式或多进程 Agent 系统里，物理时间很好用来排查问题，但它不是天然的因果凭据。至少存在几种不同时间：动作实际发生时间、事件写入时间、日志落盘时间、接口返回时间，以及不同进程自己的系统时钟。

因此，即使有：

**A.time < B.time**

也不一定能推出：

**A 是 B 的已满足前置条件。**

真正可核查的下游释放应该更接近这样：

**QA release → prerequisite: OPS_REPORT#... + DEV_REPORT#... → required task revision → logical sequence / version precondition**

也就是说，释放记录本身要引用“是什么事实让我现在可以继续”。物理时间仍然保留用于诊断，但不再独自承担因果证明。

这和普通日志的区别很大。日志回答“后来发生了什么”；依赖证明回答“为什么这个动作在当时已经有资格发生”。

## 6. 修复真正收紧的是“先激活，再唤醒”

后续 Runtime 修复没有试图判断业务任务是否“成功”，而是把派工前的机械前提变得更严格：

- 任务必须先完成合法生命周期激活，之后才能启动 Worker；
- 生命周期激活失败时 fail closed，不启动 TASK_BOUND Session，也不留下 active lease；
- 当前 attempt、执行权和负责 Agent 必须仍然匹配；
- YAML / 文件状态回退路径也不能绕过生命周期判断；
- PM 的主动恢复请求通过稳定的恢复 Skill / 路由进入，不把“发现故障”直接变成无限修复权。

对应的修复验证被分开记录：生命周期治理 **16 / 16**、任务派工 **46 / 46**、YAML fallback **4 / 4**、PM core / routing **7 / 7**、恢复 Skill 路由 **5 / 5**，合计 78 个分组断言通过，Runtime TypeScript 类型检查无错误。

这些结果支持的是：**被命名的 active-before-wake 修复路径已经通过对应回归。** 它们不证明所有 Runtime 故障都能自动恢复，也没有自动补齐 QA 释放的历史因果证据。

## 7. 一个更可靠的恢复合同应该长什么样？

把这次事故抽象以后，一次高风险恢复至少需要经过以下链路：

**恢复授权 → attempt / lease reconciliation → lifecycle activation → prerequisite binding → worker wake → execution evidence → formal acceptance**

其中任何一层都不能跳级：

- health 只能证明服务还能回答；
- heartbeat / progress 只能证明执行活性；
- lifecycle activation 才证明任务允许进入执行；
- prerequisite binding 才证明下游为什么现在可释放；
- REPORT / test 只能形成交付证据；
- REVIEW / ADMIN 才形成正式业务结论。

所以恢复系统真正应该追求的不是“更快把 Agent 叫回来”，而是让每一次继续都能回答：

> **谁授权了这次恢复？当前任务为什么已经有资格执行？它依赖的上游事实是哪几个？这些事实对应哪个版本？最终又由谁确认交付成立？**

## 结论：恢复不是重新启动，而是重新建立资格

OpenHands 的事故提醒我们：**健康信号不能替会话活性签字。** CodeFlowMu 的恢复案例进一步提醒：**会话活着也不能替任务资格和依赖条件签字。**

真正可靠的 Agent Runtime，需要把“还能回答”“还在运行”“允许继续”“依赖已满足”“可以交付”拆成不同事实，并让它们通过明确的证据关系连接起来。

这次案例最后没有给我们一个完美的“全部正确”结论。相反，它留下了一个更重要的工程缺口：QA 的释放在物理时间上早于两份上游报告，而现有记录不足以证明真正的因果顺序。

这正是工程证据应该做的事：不是替系统补一个漂亮解释，而是告诉我们下一步还缺什么。

> **服务在线，不代表任务可以继续；任务恢复，也必须重新证明为什么现在可以继续。**

---

## 公开证据

- [**查看 A4 授权、恢复与验证时间线（CSV）**](/evidence/execution-boundary-20260826/v2/case-a4-recovery-timeline.csv)
- [**查看 A4 脱敏审计与回归摘录（GitHub）**](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/v2/transcript-a4.md)
- [**核对本文主张对应哪一条证据（GitHub）**](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/v2/claim-evidence-map.csv)
- [**查看公开、脱敏的 Execution Boundary 四案例数据包**](/zh/digital-employee/2026-08-26-execution-boundary-evidence-data)

## 来源与证据边界

### OpenHands

- [**OpenHands software-agent-sdk PR #4548 — bound `AsyncExecutor.close()`**](https://github.com/OpenHands/software-agent-sdk/pull/4548)，2026-08-25 合并。本文引用其“health / metadata 仍正常，但 conversation shutdown 与 events 路径长时间失去活性”的事故，以及取消剩余任务、默认 10 秒有界关闭、超时后 best-effort abandonment 的修复。8 小时 21 分等事故数据来自 PR 作者报告，本文未独立复现。

OpenHands 案例只用于支持 **service health ≠ session liveness**。本文不把它视为 CodeFlowMu 的根因，也不据此声称 OpenHands 的恢复机制与 CodeFlowMu 的任务治理等价。

### CodeFlowMu

本文关于 CodeFlowMu 的公开结论只适用于 A4 证据覆盖的 2026-08-25 有限恢复案例和命名回归路径。公开记录支持：恢复授权有明确范围；任务恢复确实发生；active-before-wake 修复的生命周期、派工、fallback、PM routing 与 recovery skill 分组验证通过；同时 QA 的物理释放时间早于两份上游终态报告。

这些证据**不能证明** QA 一定发生了门禁违规，也不能证明该释放已经满足因果前置条件；更不能推出所有 Runtime 故障都能沿同一路径恢复。完整 Session、Agent transcript、聊天和本机路径不公开。

研究结论应始终与对应版本、测试集合和证据边界一起阅读。
