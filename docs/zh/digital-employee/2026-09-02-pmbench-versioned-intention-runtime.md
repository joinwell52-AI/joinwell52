---
schema: "publication-candidate-article/v2"
title: "延迟意图不是一条记忆"
date: "2026-09-02"
column: "digital-employee"
category: "academic"
article_type: "technical-analysis"
edition: "research-center"
research_question: "当 Agent 必须在未来正确触发点执行最新有效意图，而不只是把它回忆出来时，Runtime 需要怎样的架构？"
summary: "PM-Bench 把“记得指令”和“在真正到期时行动”拆开。它的结果说明，更频繁监测本身并不够；长期运行 Agent 需要版本化意图状态、观察策略、到期准入和持久效果证据。"
sources: "arXiv:2607.12385; genglinliu/PMBench @ e1093c470c8981daf522d4ef047a7c3a71e077d7; research/reading/A-20260902-01-pmbench-prospective-memory.md; research/analysis/A-20260902-01-pmbench-prospective-memory.md"
cover: "/assets/covers/academic-pmbench-versioned-intention-runtime.svg"
---

<ArticleCover
  image="/assets/covers/academic-pmbench-versioned-intention-runtime.svg"
  kicker="数字员工 · Academic Observation 006"
  title="延迟意图不是一条记忆"
  summary="记住未来任务，不等于现在拥有执行它的权力。"
  version="DE006"
  status="Academic Runtime V5 · 2026-09-02"
  languageHref="/en/digital-employee/2026-09-02-pmbench-versioned-intention-runtime"
  languageLabel="English"
/>

# 延迟意图不是一条记忆

用户说：“快递到了以后，发确认消息。”

一个拥有超长上下文的 Agent，完全可能几天以后仍然准确记得这句话。它能复述、解释，也能把它一直放在 Todo List 里。但这些都不能证明：快递真正到达时，它一定会在正确的时间执行正确的动作。

它仍然可能从来没查过物流状态；可能提前发送；可能漏掉后来发生的改期；可能执行昨天已经取消的旧指令；也可能在网络超时后重试，把同一条确认发两次。

这些问题并不都是“忘了”。

Genglin Liu 与 Saadia Gabriel 的 **PM-Bench: Evaluating Prospective Memory in LLM Agents**，正是把这个差别变成可以测量的问题。它不只问 Agent 能不能回忆过去的信息，而是问：Agent 能不能在其他活动持续进行的情况下保存一个延迟意图，并在未来正确的时间或环境线索出现时才执行。arXiv 记录显示论文于 2026 年 7 月 14 日提交，并标注为 COLM 2026 conference paper。

论文直接支持的较窄结论已经很重要：**Prospective Memory（前瞻记忆）不是 Retrospective Recall（回顾性回忆）的同义词。** 本文进一步形成一个工程判断，但必须明确这是 Research Center 的综合，而不是论文作者的架构主张：**延迟意图应该成为有版本的 Runtime 对象，未来执行权必须依据当前证据重新成立，而不能只是作为一段文字存在 Memory 里。**

## PM-Bench 测的是“记得去做”，不是只测“记得”

PM-Bench 模拟一个七天周期，共 80 个步骤。论文报告 83 个任务定义，其中 81 个是计分的可执行任务，包含事件触发、时间触发、周期性任务、一次性任务、跨日任务，以及 11 个取消、覆盖和重新排期的更新任务。

环境暴露时钟、邮件、日历、课程门户、价格、银行余额、物流、洗衣状态、图书预约、候补名单和预约门户等状态通道。有些意图只有在 Agent 主动查询相关通道以后，才可能知道触发条件已经成立。

于是出现了一个生产 Runtime 同样必须明确的边界：

**Active 不等于 Due。**

一个未来任务现在仍然有效，并不意味着现在就可以执行。PM-Bench 在每一步定义当前 Due Set：只有仍有效、并且当前执行条件已经满足的任务，才属于现在应该执行的集合。

这看起来只是一个小小的状态区别，却是长期 Agent 最关键的控制边界之一。

## 更大的 Memory，也可能把错误的旧意图保存得非常完整

当指令发生变化时，前瞻记忆问题会变得更危险。

例如用户先说“周五上午续订预约”，随后又把时间改成周五下午。一个 Memory 系统如果把两条消息都保存下来，在“记忆留存”意义上完全成功；但如果 Runtime 仍允许上午那条旧版本执行，它在“执行权”意义上已经失败。

取消更明显。旧意图应该继续留在历史里，因为系统可能需要解释过程；但**历史可见性不能等价于当前执行权。**

PM-Bench 专门加入取消、Override 和 Reschedule，就是因为可靠的前瞻行为依赖“当前有效意图”，而不是简单保留更多文字。

因此可以得到一条很实用的规则：

> **历史可以持续追加，Authority 必须版本化。**

旧版本可以保留用于审计，但只有最新有效版本才有资格进入 Due 判断。

## Heartbeat 更多，不等于可靠性更高

PM-Bench 在 8 个模型底座上比较了 8 种 Agent 配置，包括单 Agent 基线、Todo Ledger、可选 Heartbeat、自动 Heartbeat、分层 Specialist，以及 Replay 类方案。

其来源方报告的聚合结果很值得关注，因为它否定了一个很自然的捷径。

Optional Heartbeat 的聚合 Macro F1 最高，为 **65.1**。30 分钟自动 Heartbeat 查询更多，但报告了 **489 个 False Positive**，聚合 Macro F1 只有 **57.8**。Hierarchical Union-query 执行了 **1,661 次查询**，聚合 Macro F1 为 **45.2**。

这些数字全部是论文作者报告，本次 Academic 没有独立完整复现。它们不能证明“少查一定更好”；它们能支持更谨慎的一点：**轮询更频繁，不能替代“该观察什么、什么时候观察、什么证据足够支持行动”这三个决策。**

一个数字员工如果每几分钟把所有 Connector 都查一遍，看起来很勤奋，却可能浪费 Token、工具调用和 Provider 配额。更危险的是，如果 Action Admission 边界很弱，每一次新观察都可能变成一次提前执行或重复执行的机会。

所以 Monitoring 本身也应该有 Policy。

## 没有一种 Scaffold 对所有模型都最好

论文还报告：不同 Backbone 的最佳配置不同。有些模型在 Optional Heartbeat 下最好，有些反而是最简单的 Single Baseline，更有一些由 Todo Ledger 或 Auto Heartbeat 获得最佳结果。

这个差异很重要。它说明不应该把“Prospective Memory”压缩成一个万能 Prompt Wrapper。

更稳定的做法，是把不会随模型变化的边界外置到 Runtime：意图身份、版本、观察、Due 证明和 Effect Evidence；而模型内部仍然可以选择不同的推理和规划策略。

**模型可以继续智能，但未来执行权应该变得可检查。**

## 跨日任务与更新任务暴露的是 Lifecycle

PM-Bench 报告，没有一种测试配置能在 Cross-day 与 Update-sensitive 两类任务上同时超过 50%。其中最好的聚合 Cross-day 结果为 50.0%，最好的 Update-sensitive 结果为 47.2%。

这些仍然是来源方结果，但两类任务对应了两种完全不同的失败机制。

Cross-day 主要检验意图能不能穿过中间的大量活动继续存在；Update-sensitive 则检验取消、覆盖或改期后，系统能不能真正撤销旧 Authority。

前者很像 Memory Persistence；后者已经明显属于 Lifecycle Control。

所以一个系统完全可能“记忆很好”，但“行动不安全”。

## 四边界 Prospective-Intention Runtime

下面这套架构是 **Research Center synthesis**，受到 PM-Bench 的启发，但不是论文作者提出或验证的系统架构。

![四边界 Prospective-Intention Runtime：版本化意图状态、观察策略、Due/Action Admission 和 Effect Evidence。](/assets/figures/academic-pmbench-four-boundary-intention-runtime.svg)

### 1. Versioned Intention State

延迟意图首先要有持久身份和版本，而不只是自然语言文本。

至少需要记录当前状态、Trigger、时区、Dependencies、目标，以及 Supersession History。取消要关闭 Authority；改期应该形成新的当前版本；完成状态必须持久化。

这里故意保留一个不对称关系：**旧版本可以一直被审计，但不能因为模型又想起它，就重新获得执行权。**

### 2. Observation Policy

Runtime 需要知道：什么证据能够让这个意图变成 Due。

日历事件可以走 Event；物流可以依赖 Provider 通知或轮询；价格阈值可能要求新鲜行情；人工回复可以来自 Inbox Webhook。

所以每个 Trigger 都需要 Observation Policy：数据源、订阅或轮询方式、Freshness、Cost 和 Evidence Identity。

PM-Bench 的 Monitoring 结果在这里很有启发。真正的问题不应该是“模型多久醒一次”，而应该是“这个意图需要什么证据才能决策，以及怎样以最低成本可靠获得它”。

### 3. Due / Action Admission

任何外部 Side Effect 之前，都应该把最新意图版本与当前证据重新绑定。

一个最小规则可以写成：

```text
latest_version
AND status == active
AND trigger == satisfied_now
AND dependencies == satisfied
AND effect_not_already_committed
=> action_admitted
```

这条边界阻止一种常见的语义塌缩：未来仍有效的工作，被误解成现在已经拥有 Permission。

模型可以帮助解释模糊的自然语言 Trigger，但 Runtime 仍应该把这种解释绑定到明确版本与 Evidence Snapshot，再授予执行权。

### 4. Effect Evidence

系统最后必须记录外部世界到底发生了什么。

Effect Receipt 可以绑定 Intention ID/Version、Admission Evidence、Action Identity、Provider Response 与 Completion State。这一部分不是 PM-Bench 的测试内容，而是我们额外加入的生产要求。

为什么必须有？因为 Prospective Execution 和 Recovery 恰好会在这里相遇。假设 API 实际成功，但 Agent 在收到成功响应之前崩溃；重启以后如果只根据“我还记得这个意图”继续执行，就可能制造第二次副作用。Runtime 必须依据 Provider Effect Evidence 决定能不能安全重试。

## Todo List 有帮助，但还不是完整 Contract

PM-Bench 报告 Todo Ledger 相比 Single Baseline 改善了聚合表现。这说明显式任务状态确实可能帮助模型。

但普通 Todo Item 主要回答：“我要记住什么？”生产级 Intention Record 还必须回答：

- 哪一个 Version 是当前版本；
- 哪一份 Observation 能证明 Trigger；
- 当前是否真的 Due；
- Dependency 是否已经满足；
- 外部 Effect 是否已经发生。

这就是为什么 Prospective Memory 一部分属于模型，一部分必须属于 Runtime。

## PM-Bench 能支持什么，不能支持什么

论文和官方仓库为以下有界判断提供了直接的一手证据：

- Prospective Memory 可以独立于 Retrospective Recall 被测量；
- 隐藏 Trigger、跨日持久和更新任务对测试中的 Agent 仍然困难；
- 没有一种 Scaffold 支配所有被测模型；
- 更多 Monitoring Query 并不会自动产生最佳聚合结果。

它们**不能**证明：

- 我们提出的四边界 Runtime 是唯一正确架构；
- 真实 Provider 已具备 Exactly-once Semantics；
- PM-Bench 分数能够预测企业级安全性；
- 某一种 Heartbeat 周期普遍最优；
- 来源方实验数字已经获得独立完整复现。

论文和 `genglinliu/PMBench` 仓库属于同一个一手研究证据家族。本次运行没有找到完整的独立复现。COLM 发表状态属于 Publication Evidence，不是 Correctness Proof。

## 可以落地的一条规则

长期数字员工不能把“我记得这个指令”直接当成“我现在可以执行”。

更安全的结构应该是：

```text
memory          -> 帮助模型回忆
intention state -> 确定最新有效的未来义务
observation     -> 证明当前 Trigger 状态
due admission   -> 授予此刻执行权
effect evidence -> 证明外部世界实际发生了什么
```

这样，Agent 漏任务时，我们可以继续问：是意图丢了、Trigger 没观察到、Due 判断错了，还是执行失败？Agent 错执行时，也可以进一步判断：用了旧版本、提前 Admission，还是把已经完成的 Effect 又 Replay 了一次。

这比笼统地说“Agent 忘了”更接近工程事实。

## 还没有解决的问题

PM-Bench 提供了受控 Testbed，但生产系统还需要更难的答案：数千个延迟意图之间怎样分配 Observation Budget？哪些 Trigger 应该用事件而不是 Polling？Reschedule 后怎样使已经物化的 Schedule/Lease 失效？模糊超时后，什么 Provider Evidence 足够防止重复 Side Effect？怎样区分模型的 Memory Failure 与 Scheduler/Connector Failure？

这些问题指向下一类 Benchmark：不是继续扩大 Memory，而是给 Runtime 注入 Cancellation、Rescheduling、Delayed ACK、Crash 与 Retry。

在那之前，一个有边界但足够重要的结论已经成立：**延迟意图不只是 Agent 应该记住的东西。它是一份未来 Authority，而未来 Authority 必须有 Lifecycle。**

## 来源与证据边界

1. Genglin Liu、Saadia Gabriel，**PM-Bench: Evaluating Prospective Memory in LLM Agents**，arXiv:2607.12385，2026-07-14 — https://arxiv.org/abs/2607.12385
2. 论文 HTML — https://arxiv.org/html/2607.12385
3. 官方仓库 **genglinliu/PMBench**，本次检查固定到 `e1093c470c8981daf522d4ef047a7c3a71e077d7` — https://github.com/genglinliu/PMBench
4. Governed Deep Reading — `research/reading/A-20260902-01-pmbench-prospective-memory.md`
5. Governed Research Analysis — `research/analysis/A-20260902-01-pmbench-prospective-memory.md`

**证据边界：** 1–3 属于论文及作者维护的一手/第一方研究产物，实验数字均按来源方报告处理，本次没有独立完整复现。四边界 Prospective-Intention Runtime 明确属于 Research Center 综合判断，而不是 PM-Bench 作者主张。
