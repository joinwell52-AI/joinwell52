---
title: "Agent 评测不能只交一个分数：把运行与评分变成可执行证据包"
date: '2026-08-17'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "What must an executable evaluation package contain to distinguish a genuinely reliable agent run from a final output that merely happens to pass?"
summary: "单一分数不足以承担 Agent 发布准入。可靠评测需要同时保存被测 Agent 与 evaluator 的两条执行链，并把场景、环境、轨迹、副作用、Oracle、评分代码、结果、主张链接和评测器局限交付为可重跑、可审阅的证据包。"
sources:
  - research/manual-runs/2026-08-17-high-quality-article-pipeline/03-reading-notes.md
  - research/manual-runs/2026-08-17-high-quality-article-pipeline/03-fact-claim-matrix.md
  - research/manual-runs/2026-08-17-high-quality-article-pipeline/03-analysis.md
item_id: "TP-20260817-04"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-17-executable-agent-evaluation-package-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-17-executable-agent-evaluation-package-cover.png"
  kicker="开源工程 · 研究文章"
  title="Agent 评测不能只交一个分数：把运行与评分变成可执行证据包"
  summary="单一分数不足以承担 Agent 发布准入。可靠评测需要同时保存被测 Agent 与 evaluator 的两条执行链，并把场景、环境、轨迹、副作用、Oracle、评分代码、结果、主张链接和评测器局限交付为可重跑、可审阅的证据包。"
  version="TP-20260817-04"
  status="Independent Editorial PASS · 2026-08-17"
  languageHref="/en/engineering/2026-08-17-executable-agent-evaluation-package"
  languageLabel="English"
/>

# Agent 评测不能只交一个分数：把运行与评分变成可执行证据包

假设发布面板显示 `0.82 / PASS`。这看起来像一个可以签字的结论，直到审批者追问：评分程序真的运行了吗？它读的是这次运行的轨迹吗？Agent 改的是指定对象，还是只让测试碰巧变绿？报告里的“稳定完成”又指向哪一项可检查的证据？

如果这些问题没有答案，0.82 只是压缩后的信号，不是发布证据。

近期几组相互独立的研究把同一个缺口从不同方向暴露出来：evaluator 代码可能根本不能首次执行；最终通过可能来自盲目重试；任务可能完成在错误目标或过大的范围上；分数可以复验，文字却描述了代码没有实现的方法。OpenAI 在 2026 年 7 月公布的编码评测审计还提醒我们，噪声可能位于题目、测试和参考解（gold patch），而不只位于 Agent 输出。

Research Center 在[此前的 Benchmark 质量分析](/zh/engineering/2026-08-02-swe-bench-verified-quality)中已经论证：题目、测试、环境和 evaluator 有效，是分数有意义的必要条件。本文从这个门槛之后开始——即使上游 Benchmark 有效，团队仍需证明 evaluator 实际执行、消费了正确工件，而且报告没有越过证据。

这些研究没有共同提出一个统一标准。本文给出的合同是 Research Center 的跨来源综合：**发布级评测应交付两条可检查的执行链，而不是只交两条链末端的一个数字。**

## “通过”至少混合了五个不同问题

一个 pass/fail 往往把五件事压成一件：输出是否满足测试，过程是否稳定，动作是否落在正确目标和范围内，evaluator 是否按计划执行，以及报告是否忠实描述了工件。

[AgentLens](https://arxiv.org/abs/2605.12925) 分析了 2,614 条 OpenHands 轨迹。在能构建过程参考的 47 个 SWE-bench Verified 任务上，研究形成 1,815 条评测子集，其中 1,136 条轨迹通过最终测试；这些通过轨迹中，10.7% 被归为 Lucky Pass，包括回归循环、盲目重试、缺失验证，或探索、实现和验证顺序混乱。按过程质量排序时，部分模型相对 pass rate 排名移动最多五位。

这不是说过程分比功能测试更真实。论文明确把过程分定位为补充诊断：高过程分仍可能对应错误或不安全的补丁，固定权重也可能惩罚必要探索。它证明的是更窄的一点——最终通过看不见结果是怎样得到的。

[UnderSpecBench](https://arxiv.org/abs/2607.02294) 展示了另一种“通过”。研究用 69 个任务族构造 2,208 个提示变体，在隔离、网络受限的容器中，用确定性副作用 Oracle 分开判断 Safe Success、Wrong Target 和 OverScope。在五个 Agent×模型配置中，已经采取动作的运行里有 55.8%–67.8% 违反至少一个动作边界；未行动、澄清、拒绝或延后的运行不在这个分母中。目标不明确是主要驱动因素，而 blast-radius 提示很少降低 Agent 的行动倾向。

这个比例不能解释成生产事故率。实验刻意采用无确认自主模式，每个任务还只编码一个预期安全动作；真实环境中的人工门禁可能降低风险，Oracle 也可能漏掉其他合理动作。但实验揭示的机制成立：如果 evaluator 只看“是否完成”，改错对象或扩大影响范围也可能被记成成功。

## 被测 Agent 会失败，evaluator 也会

团队通常审查 Agent 的代码、模型、工具和运行环境，却把 grader 当成透明函数。EvalAgent 的研究说明这份信任并不安全。

[An Empirical Study of Automating Agent Evaluation](https://arxiv.org/abs/2605.11378) 在 20 个 Agent 上测试自动生成的评测。论文定义 `Eval@1`：生成的 evaluator 是否在第一次运行就成功执行，并产生实质性、非空洞的结果。以 Sonnet 4.5 为 evaluator backbone 时，单轮 B1 baseline 的 Eval@1 为 17.5%，EvalAgent 为 65.0%。在另一项 EvalAgent 与 B4（Agent-Twostage）的盲法专家成对比较中，79.5% 的维度级判断偏好 EvalAgent；这不是与 B1 的比较。不过，65% 也意味着约三分之一的生成评测仍需人工调试。实验只使用 Claude 系列，20 个 Agent 也不能代表所有类型。

这里最有工程价值的不是谁赢了，而是测量对象发生了变化：**评测器本身也必须被运行和评测。** 计划列出五个指标，不代表代码真的计算了五个指标；脚本以退出码 0 结束，不代表它读到了正确数据；结果文件存在，也不代表其中不是常数、空集合或关键词计数。

第一方 [Agent-EvalKit 实现](https://github.com/awslabs/Agent-EvalKit) 把评测拆成计划、测试场景、插桩、trace、可执行 evaluator 和报告。它不是论文的独立复现，却给出了一个重要的交付形状：不能只保存报告，必须能沿着报告回到评分代码和运行输入。

## 分数正确，结论仍可能错误

[ScientistOne](https://arxiv.org/abs/2605.26340) 把分数复验、规范违规、引用存在性和方法—代码对齐拆成四类审计。在五个系统、五个系统优化任务产生的 75 篇论文中，baseline 的虚构引用率最高 21%，分数复验通过率最低 42%，方法—代码对齐为 20%–80%。ScientistOne 在该实验中报告 0/337 个虚构引用、12/12 分数复验和 14/15 方法—代码对齐。

这些数字只适用于论文中的系统优化环境。文献“存在”不等于文献真的支持主张，自动 reviewer 也不能替代领域专家；作者还没有系统界定审计的假阴性。更值得注意的是论文中的两个案例：一个提交得到可复验分数，却利用了 evaluator 没检查列对应关系的漏洞；另一个分数接近可复验，但报告描述的算法根本不在代码里。

因此，“重跑得到同一个分数”只能证明评分链的一部分。它不能自动证明场景有效、实现符合意图，或公开结论忠实于工件。

OpenAI 的最新[编码评测数据质量审计](https://openai.com/index/separating-signal-from-noise-coding-evaluations/)把检查继续向上游推进：初筛同时查看任务说明、模型尝试和测试，标记 286 个潜在问题任务；随后由可访问仓库与环境的调查 Agent 多次审计、研究者终审。独立人工标注线由每题五名工程师查看可见问题陈述、测试和参考解（gold patch），并升级分歧与低置信度案例。这个案例不是通用 schema，却说明 benchmark 的输入、测试、参考解和争议处理也属于证据面。

## 一个分数背后其实有两条执行链

把这些发现放在一起，可以看到两个不同的程序都在运行。

第一条是 **Agent 运行链**：

`场景与边界 → 环境与版本 → Agent/模型身份 → 动作与工具调用 → 外部副作用 → 最终输出`

它回答 Agent 在什么条件下做了什么，是否改对目标，是否越过范围，以及结果是如何产生的。

第二条是 **evaluator 运行链**：

`评测计划 → fixture/数据 → trace 或结果输入 → Oracle/rubric → evaluator 代码与依赖 → evaluator 运行 → 分项结果 → 报告主张`

它回答谁用什么规则、在什么版本上把这次运行解释成这个分数；评分程序是否真的执行，是否读对对象，是否产出非空洞结果，报告是否忠实于工件。

这“两条执行链”是本文的综合框架，不是任何单篇论文验证过的标准。它的价值在于把一次模糊的“eval 失败”拆成可定位故障：场景错、环境漂移、trace 缺失、Oracle 过窄、evaluator 崩溃、聚合逻辑空洞，或报告主张越过证据。

## 把评测交付成八类工件

两条链可以落成一个不依赖特定供应商的审阅面：

| 工件 | 必须回答的问题 | 缺失时会发生什么 |
|---|---|---|
| 场景合同 | 成功、目标、禁止动作、容许替代和风险等级是什么？ | 改错对象或扩大范围仍记为成功 |
| 环境身份 | 代码、模型、harness、工具、数据和外部服务是什么版本？ | 分数不可比较，运行不可重现 |
| trace 与副作用 | 实际做了哪些动作，世界状态如何变化？ | lucky pass、盲重试和越界不可见 |
| Oracle / rubric | 哪些事实由确定性检查，哪些由语义判断？ | 把不完整测试当成完整真相 |
| evaluator 与依赖 | 评分代码是否可执行，读取什么 schema？ | 计划—代码偏移或依赖漂移被隐藏 |
| 原始结果 | 每个场景的输出、错误、退出状态和分项判定是什么？ | 只剩聚合分，无法定位失败 |
| claim links | 报告中的数字和结论指向哪个工件？ | 分数真实，叙述仍可能错误 |
| 元评测与局限 | evaluator 如何被测试，已知假阳性、假阴性和适用边界是什么？ | 把评测器盲点误认成 Agent 能力 |

一个可读的目录不必复杂：

```text
eval-package/
  manifest.json
  scenario/contract.yaml
  environment/lock.json
  runs/<run_id>/{trace.jsonl,effects.json,result.json}
  evaluator/{grader.py,requirements.lock,tests/}
  results/{per-case.json,summary.json}
  claims/claim-links.json
  review/{meta-evaluation.md,limitations.md}
```

`manifest.json` 至少绑定 `scenario_id`、`run_id`、Agent 与 evaluator 版本、输入和 artifact 哈希。这里的目标不是位级复现所有随机模型调用，而是区分三个承诺：`rerunnable` 表示可以在声明环境中重新执行；`replayable` 表示可以用保存的 trace 重算评测；`bitwise reproducible` 才表示逐位一致。不要把固定 seed 写成第三种保证。

开源实现已经提供了可借鉴的部件。[agentevals](https://github.com/agentevals-dev/agentevals) 能对预录 OpenTelemetry trace 重复评分，并让自定义 evaluator 携带依赖；它也明确说明当前并不适合长时编码 Agent 的非标准 trace。[TraceCore](https://github.com/justindobbs/Tracecore) 则把 spec、runtime、task、artifact 身份、预算和 replay 元数据写入 bundle。它们是工程模式，不是本文合同已经成为行业标准的证据。

## CI 应先验证评测器，再相信评测结果

最小发布门禁可以按以下顺序失败关闭：

1. 校验 manifest、版本、哈希、稳定 ID 和必需工件；输入身份对不上就停止。
2. 在隔离环境运行 evaluator fixture。正常、错误和空输入都必须产生预期的结构化结果。
3. 重跑 evaluator，检查退出状态、分项结果和聚合逻辑；拒绝常数分、空集合和未消费输入。
4. 单独检查目标、禁止副作用和实际状态变化，不让“最终测试绿了”覆盖 Wrong Target 或 OverScope。
5. 并列保留功能结果与过程诊断。过程异常可以升级审查，但不能自动否定一条正确的新路径。
6. 验证每个用于发布的数字和结论都有 claim link；部分支持必须写成部分支持。
7. 高风险、语义判断冲突或 evaluator 边界不清时，升级人工复核。

风险分层比“一律保存一切”更现实。低风险、无外部副作用的本地回归可以只保存 manifest、版本、结果和失败日志；修改共享仓库、生产流量、付款或外部消息的 Agent，应增加完整动作 trace、独立副作用记录、权限证据和人工签字。

这也意味着不能把模型的隐藏推理当成必需证据。审阅需要的是可观察动作、工具输入输出、状态变化和必要的决策记录。敏感 trace 应最小化、脱敏、加访问控制并设置保留期；证据完整性不能成为无限收集数据的借口。

## 这个包不能保证什么

八类工件不是可靠性证明。确定性 Oracle 可能过窄，语义 rubric 可能不稳定，人类 reviewer 也会错；完整包无法消除数据污染、未知攻击和不完备测试。保存 trace 还会增加成本，并可能暴露用户数据或凭据。

它能提供的是更诚实的失败边界。团队不再只能争论“0.82 够不够”，而可以定位：这次运行是否越界，evaluator 是否工作，分数是否有分项依据，报告是否越过证据，哪些判断仍需人工承担。

接下来仍有五个问题需要实测：不同风险等级下哪些工件的边际价值最高；怎样持续测量 evaluator 的假阳性和假阴性；如何保存最小充分 trace；claim-to-artifact schema 能否跨编码、运维、研究和客服 Agent；以及由谁独立验证 evaluator，避免它与被测 Agent 共享同一盲点。

发布审批真正需要的不是更精确的小数位，而是一条可以追问、重跑和拒绝的证据路径。分数可以留在摘要里，但证据包必须随它一起交付。
