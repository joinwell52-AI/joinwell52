---
title: "事后查得出来，就能提前发现吗？从 CatchBench 到 Runtime 的可采纳证据实验"
date: '2026-08-31'
updated: '2026-08-31'
column: open-source-engineering
category: daily
article_type: research-methodology
edition: research-center
research_question: "同一审计命题在不同证据截止点下，怎样区分证据存在、证据可采纳与证据当时可读？"
summary: "复跑 CatchBench PRE 的 1,187 份配置，再对真实审批探针的分时产物实施证据截断：相同 Reader 在不同证据截止点下，只能作出当时信息预算允许的判断。研究重点不是预测未来重复，而是先固定审计命题、可采纳证据和信息预算。"
sources: "/zh/research/evidence/2026-08-31-runtime-continuity"
project_relevance: substantive-relationship
item_id: "RCR-20260831-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-31-audit-evidence-admissibility-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-31-audit-evidence-admissibility-cover.png"
  kicker="Runtime 连续性研究 · 03"
  title="事后查得出来，就能提前发现吗？"
  summary="事后完整不代表当时可知；证据存在也不代表此刻可采纳。"
  version="RCR-20260831-03"
  status="方法研究 · 2026-08-31"
  languageHref="/en/engineering/2026-08-31-audit-evidence-admissibility"
  languageLabel="English"
/>

# 事后查得出来，就能提前发现吗？

一份事故报告读起来非常完整：原操作产生效果，审计失败，恢复执行又产生第二次效果。于是我们很容易问，为什么 Agent 没有提前发现？

但报告包含的证据，是操作发生之前、运行当中，还是事后才齐全的？如果把最终产物一起交给审计器，再说它“能提前识别”，测到的可能只是事后解释能力。

本文所谓“提前发现”，不是预测恢复后一定会发生第二次效果，而是问：**在第二次执行发生之前，第一次效果已经发生这一事实，当时是否已经有证据可读？** 如果恢复决策没有读取这份证据，就可能把本可识别的效果事实当成未知。

研究线索来自 [CatchBench](https://arxiv.org/abs/2608.22808)，一个研究“Agent 的失败什么时候能够被发现”的学术评测项目，不是数字员工产品。作者 Yue Zhao（赵岳）是南加州大学计算机科学助理教授，研究异常检测与可审计 AI 系统。[作者背景](https://viterbi.usc.edu/directory/faculty/Zhao/Yue)

我们开发和维护的 CodeFlowMu 是本地多 Agent 协作系统，组织不同角色的 Agent 处理工程任务，并管理会话、工具执行、人工审批和结果记录。我们需要知道这些记录究竟能支持怎样的判断。因此，本轮先复跑 CatchBench 的公开执行前（PRE）基准，再对自己的审批故障实验做分时证据截断，回答：**结论变了，究竟是判断方法变了，还是可读取的信息变了？**

这个区别会影响团队下一步投入什么：补充没有留下的效果记录，让必要证据更早可读，还是改进审计器的判断方法。如果评测提前使用了事后证据，就可能让团队高估预警能力，把投入放错位置。因此，这项研究首先要建立可信的比较条件，帮助判断问题出在证据还是判断方法；它并不预设“再开发一个审计 Agent”就是答案。

## 1. 外部基准带来的第一个约束：先说什么时候可读

CatchBench 将审计区分为执行前（PRE）、运行中（LIVE）和事后（POST）三种信息状态；Gold-derived mechanism diagnostics 不是第四种信息状态，而是另一类任务合同。这提醒我们，审计器比较的不只是算法，还包括拿到了什么证据。本文只复跑其官方 PRE 路径，没有运行 LIVE、POST boards 或 Gold-derived mechanism diagnostics，也没有把 CodeFlowMu 数据送入其评测。[论文](https://arxiv.org/abs/2608.22808)、[固定源码](https://github.com/yzhao062/catchbench/tree/874433dbd79243e5756d80ed2782617b34bc8ec1)

本地固定版本为 `874433db`，Python 3.10.11，执行 `python run.py --task pre`，退出码 0。输出包含 1,187 份配置：crewai 298、injecagent 340、mcp 144、n8n 219、sweagent 130、synthetic 56。这里是配置数，不是 1,187 次新执行的 Agent 任务。[原始 PRE 输出](/assets/evidence/2026-08-31-runtime-continuity/fixtures/catchbench-pre.log)

| 方法 | Precision | Recall | F1 | Coverage |
|---|---:|---:|---:|---:|
| 全部报风险：flag_all | 0.430 | 1.000 | 0.601 | 1.000 |
| owasp_asi_combined | 0.511 | 0.910 | 0.654 | 1.000 |
| 缓存的 llama-3.3-70b 判断 | 0.594 | 0.839 | 0.695 | 0.996 |

最后一行是用仓库既有判断重算分数，不是本轮调用模型。它在 n8n 上覆盖 215/219、mcp 上覆盖 143/144，共有 5 个配置不在同样的评分集合里。不能只看 0.695 大于 0.654，就宣称同输入集合上的全面优势。

还有两个必须保留的对照。第一，全部报风险也能得到 0.601 的 F1，提醒我们不能脱离误报成本解读分数。第二，组合规则的分来源 F1 从 n8n 的 0.411 到 injecagent 的 0.961 差异很大，而来源标签并非由同一种过程生成。总分不能替代分来源解释。

这些数字的作用，是约束后面的研究方法，不是给 CodeFlowMu 借用一个基准成绩。

## 2. 把同一次运行切开，研究不同证据预算下的可判定性

回到自己的系统，我们选择一个已有真实服务探针作为观察对象：经批准的合成本地执行器先写一条效果记录，随后审计失败；保存现场并换进程恢复后，非幂等执行器再写一条。

这条运行轨迹来自固定 CodeFlowMu main `f0f42f01` 的真实审批服务与执行注册器。副作用仍是隔离本地文件，不涉及外部系统。研究脚本在四个位置分别保存操作状态和效果文件快照，而不是最后从结果倒推过程。

Reader 要判断的命题被刻意收窄为两个：

- 截至观察时点，是否已有独立效果文件证明本地标记产生？
- 截至观察时点，同一夹具操作是否已出现两条不同效果记录？

它不判断业务成果是否正确，也不预测下一次必然重放；它只在不同的证据预算下，判断当前命题是 `unknown`、`yes` 还是 `not_observed`，并且不把一个状态名称当成效果事实。

| 观察点 | 当时操作状态 | 可读效果证据 | Reader：效果已发生 | Reader：重复已发生 |
|---|---|---|---|---|
| T0：已批准，尚未执行 | approved | 本次证据预算不提供效果文件 | unknown | unknown |
| T1：首次效果写入，收尾前 | executing | 1 条 | yes | not_observed |
| T2：审计失败返回后 | failed | 1 条 | yes | not_observed |
| T3：新进程恢复返回后 | succeeded | 2 条 | yes | yes |

`not_observed` 的含义是“当前证据中尚未观察到”，不是“将来绝不会发生”。T0 的 unknown 也不表示研究脚本不知道流程位置，而是 Reader 没有被授予用脚本的全知视角判断效果的权利。[分时输入](evidence/fixtures/timeline.json)

T2 尤其重要：如果把 failed 翻译成“动作没有发生”，会与已存在的效果文件冲突。T3 则表明最终 succeeded 也不能替代“只发生一次”的核查。

![一条证据轴穿过透明时间切面，左边钴蓝晶核清晰、右边同形晶核被柔焦](/assets/figures/2026-08-31-audit-evidence-admissibility-time-plane.png)

*图 1：T2 可以读取第一枚效果证据，却不能借用 T3 才出现的第二枚。柔焦晶核代表尚不可读的未来证据，不代表它不存在。图不替代 T0–T3 的分时数据。来源：RCR-20260831 E-C1 分时捕获数据与 Reader。*

这里没有另外编一组事故样本：第一篇用于分析重试机制的同一次非幂等运行，在本篇被用于检查证据何时可读。它导出了 7 个证据对象——4 份操作状态快照、3 份累积效果快照。Reader 在 T2 接受截至该点的 5 个对象，拒绝来自 T3 的 2 个未来对象；因此只能确认已看到 1 次效果，不能提前借用恢复后的第二次效果。[实际接受与拒绝清单](evidence/check-output.json)

效果数据的计数也必须保持同一口径。三份累积效果快照分别含 1、1、2 条记录，直接相加会得到 4；但前两份记录的是同一个 `E1`，最后一份才增加 `E2`。本实验取当时最新的效果快照，并按效果标识去重，T3 的结果是 2，不是 4。**证据截断解决未来信息泄漏，效果标识去重解决重复观察；两者是不同的问题。** 先避免这两类错误，才有资格讨论审计器判断得是否准确。

## 3. 可采纳证据，不等于所有可找到的证据

我们实现了一个无需产品依赖的研究 Reader。它先固定 proposition（当前判断什么），再按固定 owner 选择证据，拒绝超过观察截止点的条目，并按 manifest 校验内容摘要；只在这些条件成立后，读取截至该点最新的效果快照。

owner 是研究夹具身份，时点是脚本按顺序赋予的观察序号。它们不是 CodeFlowMu 已提供的全局可信时钟。manifest 也只是相对于本包的完整性校验，不是第三方签名；同时重写文件和 manifest 的攻击不在本实验的保护范围。

为了证明程序不是永远输出预定答案，我们对同一捕获数据做了四种负对照：

| 改动 | 受约束 Reader 的实际行为 | 防止的错误结论 |
|---|---|---|
| N1：移除效果文件，仅保留操作记录 | 效果与重复均 unknown | 不能从 failed 推断效果没有发生，也不能仅靠执行器自述证明效果 |
| N2：放入另一 owner 的两条效果记录 | 拒绝 wrong_owner，仍 unknown | 别的运行重复，不能证明本次重复 |
| N3：在 T2 的输入集合中混入 T3 产物 | 拒绝 after_cutoff，只承认已观察到 1 条 | 不能拿恢复后的证据冒充恢复前已知 |
| N4：在效果快照中增加一条记录，保留旧摘要 | 拒绝 integrity_or_unregistered | 被改动的文件不能直接成为证据 |

同时运行一个故意不校验 owner、cutoff、manifest 的简单读取器：它在 N2 和 N3 都回答“重复已发生”。前者串了归属，后者用了未来信息。错误不来自模型推理能力，而来自输入边界没有成立。[Reader 源码](evidence/reader.mjs)、[负对照检查脚本](evidence/check.mjs)

这四种条件组成本文的核心概念：审计输入不是“所有能找到的日志”，而是满足当前**命题、归属、时点和完整性**条件的可采纳证据集合。也就是说，`evidence exists ≠ evidence admissible`，而最终报告中的完整证据也不等于决策时点可读取的证据。N2、N3、N4 分别对应“真实但不属于本次运行”“真实但当时尚不可读”“看起来像证据但完整性资格不成立”。

四个正常时点加四个负对照，共 8 个场景通过预设合同检查。这是不同证据预算下的**可判定性实验**，不是预测性检测能力实验，更不是“检测准确率 100%”：场景由研究者设计，没有随机抽样、盲测或真实事故总体，因此不能外推灵敏度、误报率或线上收益。N3 证明的是 Reader 遵守时间信息边界，不是 Reader 能预测未来。

## 4. 这对 Runtime 工程意味着什么

如果把所有历史日志、最终报告和后来补齐的状态都放在一起，事后诊断确实更容易。问题在于，同一份结果不能被重新包装成提前预警能力。

对 CodeFlowMu，现有 SessionStore、操作记录和技能调用归属提供了可利用的事实来源；本研究建议补充验证的是 Runtime Audit Read Contract（审计读取合同）：**Proposition**，现在究竟判断什么；**Ownership**，哪些证据属于这次 operation/run；**Cutoff**，截至哪个决策时点允许读取；**Integrity**，哪些记录具有可接受的完整性资格；以及 **Unknown semantics**，证据不足时返回 `unknown` 还是 `false`。它不能替代已有 REVIEW/EVAL，也不应自动取得业务裁决权。

这比“新增一个审计 Agent”更适合作为下一步问题。换一个模型无法自行修复未来证据泄入、归属串账或效果文件缺失。先把评测输入的范围固定，才知道模型的判断究竟增加了什么。

一个可用的后续验收方向，是为同一命题保留两次独立评测：一次严格使用当时可读的资料，一次使用事后完整资料。分别报告覆盖率、unknown、错误类型，再讨论是否值得把某类证据前移。不要把事后更齐全的信息当成更聪明的预警器。

## 5. 证据怎样下载后自己检查

本篇附带[完整证据入口](/zh/research/evidence/2026-08-31-runtime-continuity)：来源版本、PRE 原始输出、审批运行的分时快照、Reader、负对照与预期输出。进入目录运行：

```text
node check.mjs
```

检查器会重新执行 8 个读取场景，并核对系列文章中的实验表格数据。重跑研究 Reader 不需要私有产品代码；重跑 CodeFlowMu 审批服务探针则需要对应源码，两者在附件中明确分开。

本篇交付的是可执行研究方法和捕获数据，不是集成到产品的新功能，更不是 CatchBench 的 LIVE/POST 成绩。它支持一个实用结论：**可靠审计首先要固定命题，再固定哪些证据属于这次判断、哪些证据在那个时点已经可用，以及证据不足时必须返回什么。事后完整，并不意味着当时可知；当时可知，也不等于未来可预测。**
