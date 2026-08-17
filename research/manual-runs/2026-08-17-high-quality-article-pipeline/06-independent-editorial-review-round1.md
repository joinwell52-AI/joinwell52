# 独立编辑复核 Round 1

## 判定

**NEEDS REVISION**

当前稿件的核心论点、跨来源综合、结构和工程落地都足以支撑一篇高质量文章，但尚不应进入配图：UnderSpecBench 的核心比例遗漏了条件分母，EvalAgent 的 baseline 表述也需要收窄；同时，30 天去重记录漏掉了一篇比现有表中多数文章更接近的既有文章。上述问题可局部修复，不足以构成 REJECT，但在修复并完成第二轮事实复核前不能给 PASS。

本轮只做独立复核，未修改中英文正文。

## 评分

| 维度 | 得分 | 说明 |
|---|---:|---|
| 选题 | 17/20 | 发布准入中的 evaluator 可靠性是明确、及时且有工程价值的问题；但 30 天去重记录漏检相邻旧文，当前的新颖性论证不完整。 |
| 证据 | 20/25 | 五个研究/官方身份和三个工程实现覆盖充分，绝大多数数字与限制准确；但一处关键比例漏掉 acted-run 分母，另有一处 baseline 口径过宽。 |
| 原创洞察 | 18/20 | “两条执行链”“八类工件”“分层准入”形成了清楚的 Research Center 综合框架；与既有 Benchmark 质量文章仍有相邻部分，需要显式划界。 |
| 结构与可读性 | 14/15 | 失败面—证据—机制—工件—CI—局限的推进顺畅，中英文结构对应稳定；少量示例数字的事实身份需标清。 |
| 可行动性 | 10/10 | 目录、manifest 字段、fixture、CI 顺序、风险分层和人工升级条件都可直接执行。 |
| **内容小计** | **79/90** | 内容基础强，但证据边界与去重记录未达到进入配图的门槛。 |
| 视觉 | **N/A / deferred** | 阶段 7 尚未生成和检查视觉，不评分、不推测。 |
| 最终总分 | **N/A** | 只有阶段 7 视觉检查完成后才能计算 100 分总分。 |

## 必须修订项

### 1. 修正 UnderSpecBench 的分母边界（阻断项）

一手论文正文明确写的是：五个配置中，`55.8%–67.8%` 是 **acted runs（已经采取动作的运行）** 中违反至少一个边界的比例。当前材料把它写成了全部“运行”的比例，会把未行动、澄清、拒绝或延后的样本排除条件隐藏起来。论文 Table II 另列的全部 scored runs 的 Overstep rate 为 `27.0%–46.3%`；两者不能混用。

需要同步修改：

- `03-reading-notes.md:34`：把“55.8%–67.8% 的运行”改为“55.8%–67.8% 的已采取动作运行（acted runs）”。
- `03-fact-claim-matrix.md:14`（FC-08）：事实主张与“可支持范围”都显式加入 acted-run 条件。
- `03-fact-claim-matrix.md:30`：数字控制规则改为“始终绑定无确认容器压力测试、五个配置及 acted-run 分母”。
- `2026-08-17-executable-agent-evaluation-package.zh.md:36`：最小可接受改写为“在五个 Agent×模型配置中，已经采取动作的运行里有 55.8%–67.8% 违反至少一个动作边界。”
- `2026-08-17-executable-agent-evaluation-package.en.md:36`：最小可接受改写为“Across five agent–model configurations, 55.8% to 67.8% of **acted runs** violated at least one action boundary.”

如希望同时报告全体运行，应另列 `27.0%–46.3%` 的 all-scored-run Overstep rate，并明确它与 acted-run 比例是两个分母；不要直接替换数字而不解释。

### 2. 收窄 EvalAgent 的 baseline 描述（阻断项）

论文包含四种 baseline、两个 evaluator backbone；表中 baseline 的 Eval@1 并非统一为 `17.5%`。`17.5% → 65.0%` 是论文摘要采用的代表性比较，具体到主表可对应 Sonnet 4.5 下的单轮 baseline B1（`17.5%`）与 EvalAgent（`65.0%`）。当前英文“Baselines reached 17.5%”尤其会被读成所有 baselines 都是该值。

需要同步修改：

- `01-source-pool.json:156`、`03-reading-notes.md:13`、`03-fact-claim-matrix.md:9`：不要笼统写“baselines 为 17.5%”；注明这是论文摘要的代表性比较，或明确为 Sonnet 4.5 / B1 与 EvalAgent 的比较。
- 中文正文 `:44`：建议改为“以 Sonnet 4.5 为 backbone 时，单轮 baseline B1 的 Eval@1 为 17.5%，EvalAgent 为 65.0%”。
- 英文正文 `:44`：建议改为“With Sonnet 4.5 as the backbone, the single-turn B1 baseline reached 17.5% Eval@1 and EvalAgent reached 65.0%.”

`Eval@1` 的定义、`79.5%` 专家偏好、Claude-family 限制和“约三分之一仍需调试”均核对通过；中文可再补“成对比较”以与英文及论文口径完全一致。

### 3. 补齐 30 天去重对象并强化差异（阻断项）

`dedup-review.md` 声称覆盖 2026-07-19 至 2026-08-17，但“最接近的既有文章”漏掉了 `docs/zh/engineering/2026-08-02-swe-bench-verified-quality.md`（及英文对应稿）。该文已经提出：Benchmark 的题目、测试、环境和 evaluator 都是工程质量；evaluator 应版本化、自测；单一聚合分会隐藏工程行为；结果应保存环境、harness 和 evidence refs。它比表中多篇文章更接近本题。

需要执行：

- 在 `dedup-review.md` 的相邻文章表加入 2026-08-02 文章，逐项承认上述重叠。
- 将本题的实质差异写清：旧文聚焦 Benchmark task/test/environment validity；本题新增被测 Agent 与 evaluator 的两条执行链、evaluator 的可执行/非空洞元评测、claim-to-artifact links，以及跨 Agent 类型的八类交付合同。
- 在中英文正文 `:26` 之后各加一句机制边界，例如：“上游 Benchmark 有效只是必要条件；即使题目和测试有效，也仍需证明 evaluator 实际执行、消费了正确工件，且报告没有越过证据。”英文保持同一事实边界。

补齐后，本题仍可判为非重复：新稿的主要贡献确实是 evaluator 作为可执行软件工件及其发布交付合同，而不是再次解释 Benchmark 数据质量。

### 4. 将开头的 `0.82` 标成假设示例（重要但局部）

中英文首段目前直接写“发布面板显示 / The release check says `0.82 / PASS`”，读者可能把它当成有来源的真实案例数字。该数字实际只是叙事示例。

- 中文正文 `:20` 改为“假设发布面板显示 `0.82 / PASS`”。
- 英文正文 `:20` 改为“Suppose a release check says `0.82 / PASS`.”

这样可保持事实、推断和说明性示例的身份分离。

### 5. 统一 OpenAI 审计中“参考解”的双语名称（重要但局部）

OpenAI 一手页面说明，人类审阅者会查看 visible problem statement、test cases 和 ground-truth reference solution（gold patch），再用 pipeline analysis 或 transcript 作支持背景。中文前文写“参考答案”，英文后文只写“references”，容易分别被理解为普通答案或论文引用。

- 中文正文 `:24`、`:58` 统一为“参考解（gold patch）”。
- 英文正文 `:58` 将 “references” 改为 “gold/reference solutions”。

`286` 是初筛标记的 potentially broken tasks，不是最终确认损坏数；当前正文使用“标记/flagged”，口径正确，应保持。

## 数字逐项核查

| 数字 | 结论 | 边界 |
|---|---|---|
| `2,614 / 60 / 47 / 1,815 / 1,136` | 通过 | AgentLens：OpenHands 轨迹；47 个任务形成 1,815 条评测子集，其中 1,136 条通过。 |
| `10.7%` | 通过 | 仅指上述 1,136 条通过轨迹中的 Lucky Pass，不是行业比例。 |
| 最多移动 `5` 位 | 通过 | AgentLens 中过程质量排序相对 pass-rate 排序的模型位次变化。 |
| `69 / 4 / 9 / 2,208` | 通过 | UnderSpecBench 的任务族、能力域、控制面和提示矩阵。 |
| `55.8%–67.8%` | **需修订** | 数值正确，分母应为 acted runs；当前稿误写为全部 runs。 |
| `20 / 9 / 14 / 2 / 5` | 通过 | AgentEvalBench 的 Agent、框架、应用域、每 Agent 用户要求和场景数。正文只使用其中部分数字。 |
| `17.5% / 65.0%` | **需收窄** | 是 Eval@1，不是 evaluator 正确率；需注明代表性 baseline/backbone 口径。 |
| `79.5% / 10.5%` | 通过 | 专家成对比较中偏好 EvalAgent及平局比例；正文仅使用 79.5%。 |
| `75 / 5 / 5 / 3` | 通过 | ScientistOne：五个系统、五个系统优化任务、每任务三次运行，共 75 篇论文。 |
| `21% / 42% / 20%–80%` | 通过 | ScientistOne baseline 的最高虚构引用率、最低分数复验通过率、方法—代码对齐范围，均已绑定该实验。 |
| `0/337 / 12/12 / 14/15` | 通过 | ScientistOne 在该实验中的引用、分数复验和方法—代码对齐结果；正文没有外推为零错误。 |
| `286 / 每题 5 名工程师` | 通过 | OpenAI SWE-Bench Pro 审计：286 是初筛标记数；五人审阅属于独立人工标注线。 |
| `0.82` | **需标身份** | 无来源的说明性假设，不应呈现为真实案例事实。 |
| `2 条链 / 8 类工件 / 7 步 CI / 5 个待验证问题` | 通过 | 均为文章综合框架或工程建议，不是来源报告的经验数字；正文已总体标明综合身份。 |

## 来源边界、事实/推断/建议

- 通过：Agent-EvalKit 被明确标为 AWS 论文的同源第一方实现，不当作独立复现。
- 通过：agentevals 与 TraceCore 只承担“工程模式可实现”的例证，不承担效果优越或行业采用证明。
- 通过：AgentLens 的过程分被限定为补充诊断，不替代功能正确性、安全审查或人工判断。
- 通过：UnderSpecBench 被限定为隔离、无确认的压力测试，不被写成生产事故率；但 acted-run 分母仍须补上。
- 通过：ScientistOne 的引用存在性不被等同于主张蕴含，自动 reviewer 与审计假阴性限制写得充分。
- 通过：OpenAI 审计没有被写成本文八类工件的来源标准。
- 通过：“两条执行链”和“八类工件”在中英文中都明确标为 Research Center 综合，不伪装成单篇论文结论。
- 通过：建议部分使用“应 / should”“可以 / can”“最小门禁”等规范性语言，并在结尾保留待实测问题，没有把工程建议写成已经验证的因果收益。

## 双语事实一致性

除上述共同存在的 UnderSpecBench 分母和 baseline 口径外，中英文在样本量、百分比、限制、反例、两条链、八类工件、目录、CI 顺序、风险分层和五个待验证问题上事实一致。英文对 `79.5%` 补充了 pairwise comparisons，比中文更精确；建议中文同步。OpenAI 的 gold/reference solution 名称应按必须修订项 5 统一，避免语义漂移。

## 结构、可行动性、反例与局限

- 结构成立：具体问题开场后先拆五类失败，再用四组研究和一项官方审计建立证据，随后提出机制、工件合同、CI 和风险分层，最后主动收束保证边界。
- 可行动性强：目录示例不是装饰；manifest 身份、artifact 哈希、fixture、空洞结果检测、目标/副作用检查、claim link 和人工升级都有明确落点。
- 反例充分：必要探索可能被过程评分惩罚；确定性 Oracle 可能过窄；高过程分仍可能对应错误补丁；分数复验不等于叙述忠实；固定 seed 不等于位级复现。
- 局限充分：样本、模型家族、harness、领域、LLM judge、假阴性、隐私、存储与成本边界均有覆盖。
- 建议保留当前“不要求隐藏思维链”的表述；它把证据需求限定在可观察动作、工具 I/O、状态变化和合同所需决策记录，避免证据包被误解为无限采集。

## 复审通过条件

完成五项修改后，第二轮应重新执行：

1. 全文数字搜索，确认 `55.8%–67.8%` 每次都带 acted-run 分母，`17.5%` 每次都带明确 baseline/backbone 或“摘要代表性比较”说明。
2. 中英文逐段事实对齐，特别检查 UnderSpecBench、EvalAgent 和 OpenAI gold patch 三处。
3. 30 天去重表补入 2026-08-02 Benchmark 质量文章，并确认正文新增的机制边界足以解释非重复性。
4. 确认 `0.82` 被标为假设示例。
5. 只有内容复审改判 PASS 后，才进入题图生成；视觉仍在阶段 7 独立评分。
