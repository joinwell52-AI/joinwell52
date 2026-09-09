---
schema: "publication-candidate-article/v2"
title: "计划不是承诺：TROVE 为什么把 Agent 路径拆成提议与逐步提交"
date: "2026-09-09"
column: "digital-employee"
category: "academic"
article_type: "technical-analysis"
edition: "research-center"
research_question: "当 Agent 可以一次规划多个未来步骤时，怎样避免还没有看到运行结果，就把整条路径都变成执行承诺？"
summary: "TROVE 把多步路径视为 provisional route，只提交一个顶层 Skill，再依据边界结果 Retain、Insert、Replace 或剪掉剩余路径。它提供了一个重要启发：规划可以看得更远，但执行承诺应逐个可观察边界推进；而外部 Effect Authority 仍必须独立治理。"
sources: "arXiv:2609.05019; research/reading/A-20260909-01-trove-route-validation-editing.md; research/analysis/A-20260909-01-trove-route-validation-editing.md"
cover: "/assets/covers/academic-trove-proposal-commitment-horizon.png"
---

<ArticleCover
  image="/assets/covers/academic-trove-proposal-commitment-horizon.png"
  kicker="数字员工 · Academic Observation 007"
  title="计划不是承诺"
  summary="Agent 可以规划好几步，但为什么不应该一次把好几步都变成执行承诺？"
  version="DE007"
  status="Academic Runtime V5 · 2026-09-09"
  languageHref="/en/digital-employee/2026-09-09-trove-proposal-horizon-commitment-horizon"
  languageLabel="English"
/>

# 计划不是承诺：TROVE 为什么把 Agent 路径拆成提议与逐步提交

Agent 很自然地会先做计划。

“先生成答案，再检查；如果有问题就修订，最后格式化输出。”这条路径在执行前看起来完全合理。但第一步真正运行以后，世界已经变了：答案也许直接满足要求，后面的检查变成多余；也许检查发现缺证据，原计划里的格式化应该暂缓；也许某个工具返回了意料之外的结果，剩余路径已经不再适用。

这里真正的问题不是“Agent 会不会规划”，而是：**一个尚未经历运行结果的计划，应该在多大程度上提前获得执行承诺？**

2026 年 9 月 4 日提交到 arXiv 的论文 **TROVE: Adaptive Agent Skill Orchestration via Trace-Grounded Route Validation and Editing**，把这个问题称为 **continuation invalidation**：执行过程中出现的新证据，会让原本合理的后续路径变旧。论文提出的解决方式不是每次都推翻整个计划，也不是把固定工作流一路跑到底，而是保留已经完成的前缀，只修改新证据真正否定的那部分后缀。

论文直接提出了一个很值得关注的区别：**Proposal Horizon 可以覆盖多个 Skill，但 Commitment Horizon 只保留一个顶层 Skill。**

这意味着，Agent 可以看得很远，却只向前提交一步。

## TROVE 不是“失败后重新规划”，而是让未来路径一直保持临时状态

TROVE 的离线部分先从经过评估的 Workflow Search 轨迹中提取可复用结构。原子操作被包装成 Atomic Skill；如果一段局部 Skill 序列的顺序、数据依赖和输入输出关系足够稳定，就可以被折叠成 Composite Skill。

但是，如果某个中间结果可能改变后续决策，这个边界就不能被隐藏进 Composite。它必须暴露给在线 Controller。

论文报告的最终 Registry 包含 **10 个 Atomic Skill、41 个 Composite Skill 和 244 条可执行 Transition Edge**。在线阶段，Planner 最多提出四个顶层 Skill，而一次完整执行最多允许六个顶层 Skill Call。

真正关键的是：Planner 给出的 Route 不是已经批准的完整执行序列，而是 **provisional intent**。

TROVE 只执行第一个顶层 Skill。执行结束后，它观察状态、产物以及和下一步路由有关的结果，再决定剩下那一段 Route 是否还能继续。

所以，一条路径在系统里同时具有两个不同长度：

```text
Proposal Horizon   -> 可以包含多个未来 Skill
Commitment Horizon -> 当前只提交一个顶层 Skill
```

这不是文字上的区别，而是控制结构上的区别。

## 新结果出现以后，不是只有“继续”或“全部重来”

TROVE 把后续处理拆成几种不同粒度。

**Retain**：如果原来排在后面的 Successor 在最新结果下仍然成立，就保留原后缀，不额外调用 LLM 路由。

**Insert**：如果新结果暴露了一个局部缺口，例如需要补一次 Repair、Test 或 Verification，但原来的下游目标仍然正确，就在旧后缀前插入一个有 Trace 支持的局部响应。这个新 Skill 执行以后，旧 Successor 还要重新检查，而不是自动恢复执行。

**Replace**：如果 Transition Graph 没有足够证据、当前状态已经改变下游方向，或者需要更大范围的调整，才调用 LLM 重新生成**尚未执行的后缀**。已经完成的前缀和产物继续保留。

如果当前结果已经完成目标，剩余后缀直接被剪掉。

这比“失败就 Restart”多了一层非常重要的工程含义：**新证据只应该推翻它真正否定的 Future，不应该顺手抹掉已经成立的 Past。**

## 论文的实验支持了什么

TROVE 在六个公开 Benchmark 上评估：HumanEval、MBPP、DROP、HotpotQA、MATH 和 GSM8K，覆盖代码、问答和数学推理；使用 DeepSeek-V4-Flash、GPT-4o-mini 和 Qwen3-8B 三种 Backbone，并和 AFlow、MaAS、LAS 在各自支持的设置中比较。

论文明确把 Workflow Search、Controller 配置、Trace Collection、Composite Skill Construction 和 Transition Memory Construction 放在训练分区，测试前冻结相关结构。在线时间包括 Planning、Skill Execution、Route Validation 和 Runtime Replanning，但**不包括**一次性的离线 Workflow Search、Controller Training、Registry Construction 和 Trace Distillation。

所有下面的数字都是论文作者报告，本次 Academic 没有独立复现实验。

在 18 个 Backbone–Benchmark 设置中，TROVE 报告 **15 个获得最好或并列最好的 Task Score，16 个获得最短 Online Time**。在六个 DeepSeek-V4-Flash 测试分区合计中，它报告使用 **13.45M Online Tokens**，AFlow 为 **21.11M**，下降 36.3%。但这种节省并不均匀：DROP 和 HotpotQA 在 TROVE 下反而用了更多 Token，主要节省来自其他任务。

这提醒我们，不能把一张总表变成“动态路由一定更省”的普遍结论。

## Route Edit 很多，也不一定说明系统一直在失败

论文有一个非常容易被误读的结果。

在 DeepSeek-V4-Flash 下，HumanEval 有 **54.20%** 的 Route 和初始 Proposal 不同；MBPP 只有 5.87%，DROP 7.75%，HotpotQA 2.88%。但 MATH 和 GSM8K 的 Route Change 分别达到 **98.97% 和 100%**。

如果只看“修改率”，似乎数学任务几乎每次都在修错。

其实不是。论文解释，很多数学任务是因为一个 Composite Skill 已经提前得到最终答案，原来计划的剩余步骤因此变成多余，后缀被 Terminal Pruning。

所以 Route Edit 至少有三种完全不同的含义：

1. **Correction**：中间结果真的否定了原来的 Continuation；
2. **Early Completion**：任务提前成功，未来步骤不再需要；
3. **Stability**：原计划仍然成立，因此根本不需要修改。

如果未来数字员工有“动态路径修改率”这样的指标，也必须把这三类分开。否则一个看起来高度自适应的系统，可能只是在不断修正不够好的初始计划；一个修改率很低的系统，也可能只是原路径本来就很稳定。

## Ablation 告诉我们：边界放在哪里，会改变系统能力

论文在 Qwen3-8B + HumanEval 上做了 Ablation。

Full TROVE 报告 92.37% Accuracy、24.36 分钟；去掉所有 Offline Structure 后下降到 77.86%、33.62 分钟；只去掉 Composite Skill 后为 78.63%、33.30 分钟；去掉 Insert 为 82.44%、39.10 分钟；去掉 Replace 则仍有 90.84%，但时间增加到 40.15 分钟。

这个单一设置不能证明所有任务都应该使用同样粒度，但它揭示了一个重要问题：**Composite Skill 不只是“把几个调用打包”，它决定哪些内部决策被隐藏，哪些中间结果仍然暴露给外层 Controller。**

边界太细，每一步都重新 Route，成本和方差会上升；边界太粗，本该根据新结果改变的决策会被封在一个大 Skill 里面，外层 Runtime 来不及干预。

因此 Skill 设计真正困难的部分之一，是决定：**哪些局部决策已经稳定到可以封装，哪些 Outcome 必须留到下一次 Commitment 之前再看。**

## 从 TROVE 再向前一步：Proposal / Boundary / Commitment / Effect

下面这部分是 **Research Center synthesis**。它受到 TROVE 的机制启发，但不是论文作者提出或验证的治理架构。

![Proposal Horizon、Boundary Evidence、Commitment Horizon 与独立 Effect Authority 边界。](/assets/figures/academic-trove-proposal-commitment-boundary.svg)

### 1. Proposal Horizon

Model 或 Planner 可以提出多步未来路径。这个能力应该保留，因为前瞻结构能够帮助协调、资源安排和整体推理。

但是 Proposal 的身份应该很明确：它是**候选 Future**，不是已经发生的 Execution Decision。

### 2. Boundary Evidence

每个已提交的顶层 Skill 完成以后，Runtime 需要把最新 Outcome 绑定到已经执行的 Prefix：状态是什么、产生了什么 Artifact、目标是否已经满足、是否出现 No-progress 或 Repeat Signal。

未来步骤不能因为“之前在计划里”就继续继承有效性。

### 3. Commitment Horizon

只有下一个经过最新证据重新 Admission 的顶层单位，才真正进入执行承诺。

这条原则可以写得很简单：

> **Planning length may be long; execution commitment should be incremental.**

它保留了 Agent 的规划智能，又不要求 Runtime 相信一个在未知未来结果之前生成的完整路径。

### 4. Effect Authority

这里必须再加一道 TROVE 并不试图解决的边界。

一个 Skill 在当前 Route 上“逻辑上应该执行”，并不等于它现在有权给客户发邮件、修改数据库、下单、支付或调用其他有 Side Effect 的 Provider。

所以真正进入外部世界之前，仍然需要独立证明：

```text
continuation_valid
AND call_authorized
AND duplicate_effect_prevented
=> external effect may execute
```

Route Validation 解决的是“下一步是否仍然适合当前任务状态”；Authorization 解决的是“这一次调用有没有权力发生”；Idempotency 与 Effect Evidence 解决的是“外部世界是否已经发生过一次”。

把这三类命题混在一起，会把一个很好的 Orchestration 机制误当成完整的执行治理。

## 保存执行前缀，也不等于已经解决 Crash Recovery

TROVE 的一个优势是保留已经完成的 Prefix 和 Artifact，而不是每次从头重跑。

但对于真实 Side Effect，这还不够。

假设某个顶层 Skill 内部已经向 Provider 成功提交订单，只是成功响应没有回到 Agent。系统崩溃以后，“保留 Prefix”并不能自动告诉 Runtime 订单到底有没有发生；“重新规划后缀”也不能证明再次调用不会重复下单。

所以本文故意把 **Effect Authority / Effect Evidence** 画在另一层。

TROVE 给的是 Continuation Control 的证据。Exactly-once、Provider Receipt、Ambiguous Effect Recovery 仍然需要独立机制。

## 证据边界不能因为论文结果漂亮而消失

这篇论文目前给出的证据范围很清楚：六个 Benchmark、三种 Backbone、三类比较方法，而且 LAS 只在六个代码设置中有可比较结果。论文报告的 Online Time 还明确排除了 Offline Search 和 Distillation 成本。

本次检索没有找到作者公开的 TROVE 实现仓库，也没有找到独立团队对完整 headline result 的复现。因此，本文所有实验数字都继续标记为 **source-reported**。

这并不削弱论文提出的控制问题。相反，它帮助我们把两个层次分开：

- **论文直接支持：** provisional route、one-step commitment、Retain / Insert / Replace、preserve completed prefix，以及这些机制在作者评测里的质量/在线效率表现；
- **本文进一步综合：** 数字员工 Runtime 应把 Proposal、Boundary Evidence、Commitment 与 Effect Authority 分开，并把外部副作用门禁放在 Route Validity 之外。

前者是研究结果，后者是工程判断。

## 可以落地的一条规则

如果把全文压缩成一条设计规则，它不是“Agent 要经常重新规划”，而是：

**不要让未来计划一次性继承未来执行权。**

更稳健的 Runtime 可以保存完整 Proposal，但只把下一个顶层单位放进当前 Commitment；每执行一个单位，就用新证据重新判断剩余 Future。已经成立的 Past 保留，已经变旧的 Suffix 修改，已经完成的目标停止。

对于只有内部推理、便宜而可丢弃的 Skill，这个边界可以更宽；对于昂贵、不可逆或有外部 Side Effect 的动作，它应该更严格。

TROVE 的价值因此不只在于一种新的 Agent Workflow 算法。它把一个长期 Agent 很容易忽略的事实变得非常清楚：**计划是关于未来的推测，承诺是关于现在的决定。两者不应该是同一个数据类型。**

## 还没有解决的问题

真正进入生产以后，还有几类问题需要继续验证：Composite Skill 的最优边界怎样确定？哪些 Route Validity Check 可以由确定性 Contract 完成，而不必每次交给 LLM？Crash 后怎样把已执行 Prefix 与 Provider Effect Receipt 对齐？一个保留很久的 Pending Suffix 在再次执行前需要多新的 Evidence？以及 Offline Search/Distillation 的成本，在长期数字员工里要怎样和 Online Savings 一起核算？

这些问题需要新的运行实验，而不是从当前六个 Benchmark 直接外推答案。

## 来源与证据边界

1. Tianxing Wang、Mingming Zhao、Shuai Huang、Huiyang Xu、Chaoyue Niu、Shengzhong Liu、Fan Wu，**TROVE: Adaptive Agent Skill Orchestration via Trace-Grounded Route Validation and Editing**，arXiv:2609.05019v1，2026-09-04 — https://arxiv.org/abs/2609.05019
2. 论文 HTML — https://arxiv.org/html/2609.05019
3. Governed Deep Reading — `research/reading/A-20260909-01-trove-route-validation-editing.md`
4. Governed Research Analysis — `research/analysis/A-20260909-01-trove-route-validation-editing.md`

**证据边界：** 论文是本次 Academic 的一手证据，实验数字均按来源方报告处理，本次没有独立完整复现。Proposal / Boundary Evidence / Commitment / Effect 模型明确属于 Research Center 综合判断；Route Validity 不被表述为 Authorization、Exactly-once 或 Rollback 的等价物。
