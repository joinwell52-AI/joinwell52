---
schema: "publication-candidate-article/v2"
title: "多时间跨度工作需要 Runtime，而不只是更大的上下文窗口"
date: "2026-08-12"
column: "digital-employee"
category: "academic"
article_type: "technical-analysis"
edition: "research-center"
research_question: "CorpGen 已公开证据究竟支持哪些关于并发多时间跨度工作的架构判断，哪些部分对生产级数字员工 Runtime 仍只是待验证假设？"
summary: "Microsoft Research 的 CorpGen 研究表明，并发长周期 Agent 工作更适合被视为显式调度、隔离、记忆与评估问题，而不是不断扩大的单一上下文；但受控基准尚不能证明生产可靠性或独立有效性。"
sources: "arXiv:2602.14229；Microsoft Research CorpGen 论文页与技术文章；research/reading/Q-20260803-09-corpgen-multi-horizon.md；research/analysis/Q-20260803-09-corpgen-multi-horizon.md"
cover: "/assets/covers/academic-corpgen-multi-horizon-cover-v2.png"
---

<ArticleCover
  image="/assets/covers/academic-corpgen-multi-horizon-cover-v2.png"
  kicker="数字员工 · 学术观察 003"
  title="多时间跨度工作需要 Runtime"
  summary="当多个任务同时存在时，长周期工作会变成系统问题：所有权、调度、记忆、失败与证据都必须成为显式 Runtime 状态。"
  version="DA003"
  status="Academic Runtime V5 · 2026-08-12"
  languageHref="/en/digital-employee/2026-08-12-corpgen-multi-horizon-runtime"
  languageLabel="English"
/>

# 多时间跨度工作需要 Runtime，而不只是更大的上下文窗口

一个很长的任务，与许多同时进行的长任务，并不是同一种工程问题。

面对单个长任务，更大的上下文窗口、更好的摘要或能力更强的模型，确实可能延长 Agent 可持续工作的距离。但当几十个任务同时存在时，Runtime 必须回答一些纯粹增加 Token 容量无法回答的问题：下一步动作属于哪个任务？哪个任务正在阻塞？哪一段记忆属于哪个目标？失败应该如何受限？什么证据才足以说明某个任务真的完成？

Microsoft Research 2026 年的 CorpGen 论文《Scaling Agents for Enterprise Multi-Horizon Task Execution》研究的正是这种变化。论文把这种环境称为 **Multi-Horizon Task Execution（MHTE，多时间跨度任务执行）**，并评估了一套把规划、任务隔离、记忆、重试和评估显式化的架构。

现有证据支持一个有边界的判断：**并发长周期工作首先是 Runtime 协调问题，而不只是上下文长度问题。** 但这些证据并不能证明 CorpGen 本身已经是一套生产级企业数字员工 Runtime。

## 当工作从一个任务变成一组任务，问题发生了什么变化？

论文中的 MHTE 不是一条不间断的超长轨迹，而是许多目标同时存在。作者描述的工作负载包括几十个并发任务，每个任务常包含 10–30 个甚至更多操作步骤，整体交互跨度可以达到数百乃至上千步。

这会改变失败面。上下文饱和只是其中一个问题。跨任务记忆干扰、任务依赖、动态优先级、重试和任务局部状态，都会变成独立的 Runtime 问题。

这个区别很重要。更大的上下文窗口可以保存更多历史，却仍然可能无法回答一个基础运行问题：**每一项工作的当前状态究竟是什么？**

因此，一个真正管理工作组合的数字员工不能只有“连续对话记忆”。它还需要持久任务身份、调度状态、受控的局部上下文，以及针对业务结果的证据。

## CorpGen 的实验实际上报告了什么？

主要研究在受控、基于 OSWorld 改造的办公任务环境中评估 CorpGen。作者把多个任务组合成更高负载的 Session，其中最高负载条件包含 **46 个任务**，并设置六小时执行上限。

在论文的高负载主要比较中，作者报告 CorpGen 完成 **15.2** 个聚合任务，而所列 UFO2 基线为 **4.3**。按照该指标计算，约为 3.5 倍的相对提升。

但绝对值与相对提升同样重要。在最困难的负载下，大部分任务仍然没有完成。因此，这个结果证明的是：在所测试环境中，协调能力得到了明显改善；它并不意味着高负载企业工作已经被解决。

消融结果也值得注意。在论文报告的 100% 负载条件下，加入 Cognitive Model 与 Cognitive Tools 后结果达到 8.7，而加入 Experiential Learning 后进一步达到 15.2。因此，来源方把相当一部分增益归因于过去成功经验的复用，而不仅仅是层级结构或记忆机制。

这些都是**作者自己受控实验中的来源方研究结果**。本次研究没有发现对完整 CorpGen 结果的独立复现。

## 比 3.5 倍数字更可迁移的是架构分解

这篇论文更值得关注的并不是“3.5 倍”本身，而是它把长周期工作拆成了几个明确的 Runtime 机制。

### 层级规划把不同时间跨度分开

CorpGen 区分更长期目标、日内任务计划与实际操作动作。计划不是运行开始时一次性写死，而是可以随着事件发生进行更新。

这意味着重新排序成为显式调度行为。Runtime 可以改变“下一步应该推进哪项工作”，而不需要重写其他所有任务的历史。

### 隔离的任务 Agent 限制跨任务干扰

不同工作项可以运行在相对隔离的 Agent 上下文中。这为任务局部状态提供了更清晰的所有权边界，也减少无关任务历史相互污染的风险。

真正可迁移的原则不是“每个任务必须启动一个模型实例”，而是：**活动上下文的所有权应该跟随工作的所有权。**

### 分层记忆避免把完整历史不断重放

架构区分 Working Memory、结构化 Long-term Memory 与语义检索。系统根据当前任务选择相关状态，而不是每一步都把不断增长的完整时间线重新塞进上下文。

这是一种 Runtime 策略，而不是简单的“更多上下文”。记忆真正涉及的是：什么状态保持活动、什么需要持久保存、什么应该在特定任务需要时被检索。

### Retry 与 Skip 让失败可以被调度

实现不会让一个反复失败的任务无限占用整个运行周期，而是使用受限重试，达到边界后可以跳过并记录失败。

对多任务 Worker 来说，这一点非常重要。`Retrying`、`Blocked`、`Failed` 与 `Skipped` 不是界面标签，而是决定其他工作是否还能继续推进的调度语义。

### Experiential Learning 复用成功路径

CorpGen 可以针对相似工作检索以前成功的轨迹。这个机制使用语义检索，并不是运行过程中修改模型参数。

它很有价值，但同时也提醒我们不要把实验结果过度简化成“层级架构解决了长周期问题”。部分增益可能来自对类似任务经验的复用。

## 完成证据是另一个独立问题

论文在评估方法上还有一个值得单独讨论的观察。

对于办公任务，最终形成的持久产物有时比动作轨迹更接近真正的完成证据。文档、表格或其他最终状态可以被直接检查，而不是根据一长串点击“看起来像成功”就判断任务完成。

论文报告了一个小型元评估：Artifact-based 判断与人工判断的一致率明显高于仅依赖截图与动作轨迹的判断。但这个比较只覆盖 **11 次任务执行**。因此，大约 90% 对 40% 的一致率只能绑定在这个非常小的实验范围内，不能被扩展成通用规律。

更稳妥的结论是：**完成证据应该绑定到用户要求的结果，而不能只从 Worker 活动中推断。**

即便如此，Artifact 也不能回答所有问题。文件存在，不代表没有产生有害副作用；内容正确，不代表使用了正确账户；业务记录创建成功，也不代表执行权限合法。Outcome Evidence 与 Authority Evidence 仍然是不同的治理对象。

## 对长时间运行 Agent 系统的工程含义

CorpGen 的证据可以支持六个较普遍的 Runtime 设计判断。

第一，**任务身份应该成为持久状态。** 如果一项工作只能靠 Prompt 中的一段文字识别，它就很难在长时间运行中安全地重排、重试和审计。

第二，**并发应该按所有权边界划分。** 一个 Workstream 的局部状态不应该无声改变另一个 Workstream 的推理上下文。

第三，**记忆应该拥有明确生命周期。** Working Context、Durable State 与 Semantic Retrieval 服务不同目的，不应合并成一条无限增长的时间线。

第四，**失败需要具有调度语义。** 一个任务被阻塞或耗尽重试后，其他符合条件的任务应该能够继续。

第五，**能够获得持久结果时，应优先使用 Outcome Evidence 判断完成。** 动作轨迹仍适合诊断，但“做了很多操作”不等于完成。

第六，**相对提升和绝对完成率必须同时报告。** 一个系统可以比基线好几倍，同时依然远没有达到无人值守处理高后果工作的可靠程度。

## 证据边界在哪里？

这篇论文属于主要研究来源，而不是对自己架构的独立验证。几条边界必须明确保留。

基准来自受控的 OSWorld Office 任务组合，而不是企业真实环境中的长期行为数据。实验确实是高负载、持续数小时的运行，但主要评估并不是跨多天部署，不包含凭证过期、人工临时介入、权限变化或组织策略不断变化等真实运行情况。

论文也没有建立 Process Restart 后的 Exactly-once 工作语义、事务回滚、外部副作用补偿、多个任务同时修改同一业务资源时的冲突控制，也没有展示一个独立的最终业务接受权威。

作者自己还列出了 GUI 交互可靠性、状态假设、评估难度、计算开销以及缺少真实企业行为 Ground Truth 等限制。

这些限制并不会抹掉实验的工程价值。它们只是明确了：这项实验究竟能成为哪些判断的证据。

## 下一步真正应该验证什么？

下一步研究不应该只是问“一个模型能不能容纳更多 Token”，而应该验证这篇论文暴露出来的 Runtime 边界。

任务身份和所有权能否跨 Process Restart 保存，并避免重复执行高后果动作？当优先级持续变化时，调度器能否保持公平性？隔离的任务上下文在访问同一外部资源时如何安全协调？Artifact-based Completion 能否识别延迟副作用或隐藏副作用？这些协调收益能否在 OSWorld 之外的企业工作负载中被独立复现？

这些问题，才真正区分“有前景的 Multi-Horizon 研究架构”和“生产级数字员工 Runtime”。

因此，这篇论文最值得保留的结论可以更准确地表达为：**当工作变成一个任务组合时，Runtime 必须把这个组合本身作为状态管理。** 上下文长度可以帮助 Agent 记住更多内容，但它不能替代所有权、调度、受限失败、持久记忆和结果证据。

## 参考资料

1. Microsoft Research / arXiv，**Scaling Agents for Enterprise Multi-Horizon Task Execution**，arXiv:2602.14229 — https://arxiv.org/abs/2602.14229
2. 论文完整 HTML — https://arxiv.org/html/2602.14229
3. Microsoft Research，**CorpGen: Scaling agents for enterprise multi-horizon task execution** — https://www.microsoft.com/en-us/research/blog/corpgen-scaling-agents-for-enterprise-multi-horizon-task-execution/
4. 受治理 Deep Reading — `research/reading/Q-20260803-09-corpgen-multi-horizon.md`
5. 受治理 Research Analysis — `research/analysis/Q-20260803-09-corpgen-multi-horizon.md`
