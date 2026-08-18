---
title: "别让 Agent 立刻写代码——也别盲信它的计划"
date: '2026-08-17'
column: open-source-engineering
category: daily
article_type: technical-analysis
edition: research-center
research_question: "How can a reviewable planning artifact reduce requirement omissions in complex coding-agent tasks without turning a flawed plan into a new source of authority?"
summary: "复杂任务需要执行前计划，但计划不是新的权威规格。它必须逐条映射原始需求、真实代码位置和验证方法，并在执行中记录偏差；否则一份流畅但错误的计划会比没有计划更危险。"
sources:
  - research/manual-runs/2026-08-17-high-quality-article-pipeline/10-forum-demand-discovery-2026-08-18.md
  - research/manual-runs/2026-08-17-high-quality-article-pipeline/11-two-topic-deep-reading-and-fact-matrix.md
  - research/manual-runs/2026-08-17-high-quality-article-pipeline/12-two-topic-article-briefs.md
item_id: "MANUAL-20260817-PLAN"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-17-reviewable-agent-plan-cover.webp"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-17-reviewable-agent-plan-cover.webp"
  kicker="开源工程 · 研究文章"
  title="别让 Agent 立刻写代码——也别盲信它的计划"
  summary="复杂任务需要执行前计划，但计划不是新的权威规格。它必须逐条映射原始需求、真实代码位置和验证方法，并在执行中记录偏差；否则一份流畅但错误的计划会比没有计划更危险。"
  version="MANUAL-20260817-PLAN"
  status="Independent Editorial PASS · 2026-08-18"
  languageHref="/en/engineering/2026-08-17-reviewable-agent-plan"
  languageLabel="English"
/>


# 别让 Agent 立刻写代码——也别盲信它的计划

大仓库里的 coding agent 常见两种失败。

第一种，它收到“重构认证流程”后马上开始改文件。两小时后测试通过了一部分，但审计日志、迁移兼容和一个边缘分支完全没做。

第二种看起来更成熟：Agent 先写了一份结构漂亮的计划，人类点了批准。问题是计划在第一步就误解了权限边界。后续 Agent 严格照做，于是错误不再是一个局部补丁，而是被系统化地传播到多个模块和测试。

因此，“先计划还是先编码”不是这篇文章真正的问题。更重要的问题是：**计划在系统里拥有什么权威？**

## 计划确实必要，但证据没有说“有计划就更好”

Cursor 的官方 Agent 实践把 Plan Mode 描述为四个步骤：先研究代码库，提出澄清问题，生成带文件路径和代码引用的实施计划，然后等待用户批准。文档也明确提醒，小改动或高度熟悉的任务不一定需要详细计划。[[1]](https://cursor.com/blog/agent-best-practices)

这种做法直觉上合理。论坛里的大项目指南也反复建议短会话、Git 检查点、先总结目标、先列计划、再用测试保持成功条件可见。[[2]](https://forum.cursor.com/t/an-idiots-guide-to-bigger-projects/23646) 但经验帖只能证明这种工作法有人需要，不能证明每一条都提高成功率。

更有价值的证据来自 2025 年的 [E2EDevBench 研究](https://arxiv.org/abs/2511.04064)。研究从 PyPI 筛选 50 个 Python 项目，覆盖 2024-Q1 到 2025-Q1，平均每个项目 19.2 个文件、2011.5 行代码和 119.7 个测试。研究者在统一的 SWE-Agent 工具链上比较三种顺序工作流，并分别使用 Gemini-2.5-Pro 与 Flash。[[3]](https://arxiv.org/abs/2511.04064)

最佳单一组合 Developer-Tester + Pro 的需求实现率是 53.50%。在三种工作流的均值中，Developer-Tester 是 49.48%，Single 是 45.72%，加入独立 Designer 的 Designer-Developer-Tester 却只有 27.71%。[[3]](https://arxiv.org/abs/2511.04064)

这组结果直接否定了一个过度简单的结论：多一个规划角色、多一份设计文档，并不天然更可靠。

## 最危险的计划会取代原始需求

为什么带 Designer 的工作流最差？论文作者检查轨迹后提出一个解释：Developer 收到看似权威的设计计划后，会优先服从计划，而不再直接核对同时存在的原始需求。如果设计计划有误，错误就被忠实地向下游实现和测试传播。[[3]](https://arxiv.org/abs/2511.04064)

这是作者的机制归因，不是单独随机化“计划质量”后的因果结论。额外 handoff、上下文压缩或特定 prompt 也可能解释部分差异。但它暴露了一个真实的工程风险：**派生文档发生权威倒置。**

原始需求本应是 canonical input，计划只是对它的解释和执行提案。系统却把流畅、结构化的计划当成更高权威，导致后续 Agent 即使忠实执行，也只是更有效率地偏离用户意图。

这和人类团队里的设计文档没有本质区别。文档越正式，读者越容易假设它已经完成核对。Agent 又特别擅长把一个明确计划执行得连贯，因此上游的一处遗漏会获得比临时编码更大的传播半径。

## 失败更多来自遗漏和误解，而不只是代码不会写

E2EDevBench 对 1000 条未实现需求进行了失败分析。样本来自 50 个项目、Pro 模型和三类工作流，先由 LLM 预标注，再由人类修订。在这组特定样本中，Task Planning 根因占 55.8%：需求遗漏 27.9%，需求误解 22.2%，架构设计错误 5.6%。Task Execution 占 38.6%，Task Verification 占 5.7%。[[3]](https://arxiv.org/abs/2511.04064)

这些数字不能被写成“所有 Agent 失败中 55.8% 来自规划”。研究只有两个 Gemini 模型，任务是从需求文档重建中等规模 PyPI 项目，不等同于真实企业大仓库的迁移和重构；评估还依赖 Test Migration Agent 与 LLM judge。

但更窄的判断成立：只在代码生成能力上继续加码，可能修不到最常见的上游缺口。Agent 可以写出语法正确、局部测试通过的代码，同时完全漏掉一个没有进入计划的需求。

另一项 79 页的观察研究 [AI Agents and Higher-Order Work](https://suproteem.is/assets/files/agents.pdf)提供了不同方向的信号。作者分析 1000 家企业、119,960 名匹配到职业特征的 Cursor 用户；消息意图子样本覆盖 399 家企业。在第一条消息中，Plan 的基准率约为 4.21%。工作经验增加一个标准差（约七年）与 Plan rate 增加 0.45 个百分点相关，相对基准约高 11%。[[4]](https://ssrn.com/abstract=5713646)

这仍然不是因果证明。论文的意图分类器没有报告独立人工准确率，回归 R² 很低，计划率、经验和 Agent 输出接受率也可能共同受任务类型影响。它最多支持一个谨慎结论：更有经验的用户更常在执行前寻求对齐，而不是“计划一定让 Agent 更好”。

## 一个计划应该是六段可审查合同

复杂任务需要的不是一篇文笔流畅的“实施设想”，而是一份可以逐项查错的派生工件。最小 Plan Contract 可以分成六段：

```yaml
requirements_map:
  - requirement_id: R1
    source: issue/spec 原文位置
    interpretation: Agent 对该要求的可核对解释
    planned_steps: [S1, S3]

code_map:
  - step_id: S1
    files_or_symbols: [真实路径或符号]
    evidence: 搜索结果、调用关系或现有测试

dependencies_and_risks:
  - 前置迁移、外部接口、权限、并发或回滚风险

verification:
  - 每条 requirement 对应的测试、静态检查或人工验收

non_goals:
  - 本次明确不改什么，以及原因

execution_delta:
  - 执行中偏离了哪一步、发现了什么、是否需要重新批准
```

这份合同有三个关键性质。

第一，需求到步骤必须可追踪。计划不能只按模块写“更新服务层、补测试”，而要让审阅者看见每条需求落在哪个步骤、如何验证。没有映射的需求，就是执行前已经可见的遗漏。

第二，代码位置必须有证据。文件名、符号和依赖关系应来自实际仓库探索，而不是从任务标题猜测。Cursor 官方 Plan Mode 要求文件路径和代码引用，价值就在这里。[[1]](https://cursor.com/blog/agent-best-practices)

第三，计划永远不能覆盖原始需求。Developer、Tester 和 reviewer 都应同时看到 canonical requirements。计划发生冲突时，系统应回到原始需求并重新规划，而不是默认“既然已批准就继续执行”。

## “人类批准”不是一个充分门禁

一段结构漂亮、术语正确的文字很容易被快速批准。真正的计划评审不应问“读起来合理吗”，而应问：

- 每条原始需求是否有落点？
- 每个高风险步骤是否有证据和验证？
- 是否存在计划新增、但原始需求没有授权的范围？
- Tester 是否仍从原始需求生成验收，而不是只从计划生成测试？
- 执行中发现新事实后，偏差是否可见并触发重新评审？

这也是为什么计划应保存为仓库工件，而不是只留在一段会被压缩的聊天历史里。它需要被 diff、评论、版本化，并与执行基线绑定。

## 不是每个任务都值得走重型计划门

计划有成本。已知文件与位置、影响范围很小、验证明确的单行修复，可以走轻量通道：一句目标、一个目标位置、一条验证即可。强制所有任务填写六段合同，会把工程控制变成表格劳动。

真正适合强制 Plan Review 的，是跨模块改动、数据迁移、权限变化、公开 API 变更、难以回滚的操作，以及任何一个遗漏都可能让“测试通过”仍然无法代表完成的任务。

## 尚未被证明的部分

本文的六段 Plan Contract 是基于产品机制、受控实验和观察研究提出的工程综合，尚没有独立实验直接证明它在真实大仓库中降低多少遗漏。下一步应在真实任务上比较：无计划、自由文本计划和可追踪计划三种条件下的需求完成率、返工次数、审阅时间与成本。

但现有证据已经足以排除两个危险的极端：让 Agent 收到复杂任务后立刻写代码，和让 Agent 收到一份未经核对的计划后无条件服从。

计划最有价值的时刻，不是它让 Agent 显得更有条理，而是它让错误在写代码之前就有机会被看见。

## 来源

1. [Cursor：Best practices for coding with agents](https://cursor.com/blog/agent-best-practices)
2. [Cursor Forum：An Idiot's Guide To Bigger Projects](https://forum.cursor.com/t/an-idiots-guide-to-bigger-projects/23646)
3. [Benchmarking and Studying the LLM-based Agent System in End-to-End Software Development](https://arxiv.org/abs/2511.04064)
4. [AI Agents and Higher-Order Work：作者公开 PDF](https://suproteem.is/assets/files/agents.pdf)；[SSRN 记录](https://ssrn.com/abstract=5713646)

