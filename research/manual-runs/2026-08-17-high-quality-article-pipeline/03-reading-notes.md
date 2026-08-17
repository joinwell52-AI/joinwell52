# 阶段 3：完整阅读笔记

主题：**Agent 评测的可执行证据包**
阅读原则：论文全文覆盖问题、方法、结果、案例、附录和局限；仓库与官方页面只作为实现或方法记录，不把维护者自述当成独立效果验证。

## 1. AWS AI Labs：An Empirical Study of Automating Agent Evaluation

- 一手材料：[论文](https://arxiv.org/abs/2605.11378)；[第一方实现](https://github.com/awslabs/Agent-EvalKit)
- 阅读范围：PDF 42 页全文，重点为摘要、§1、§3、§4、§6、附录中的 evaluator 实例与元评测细则。
- 研究问题：能否让模型自动生成一套真正可运行、能产生有意义结果的 Agent evaluator，而不只是罗列指标或生成看似完整的代码？
- 方法：AgentEvalBench 含 20 个 Agent，覆盖 9 个框架、14 个应用域；每个 Agent 配 2 个用户要求和 5 个测试场景。EvalAgent 先做评测计划，再生成测试、插桩、trace 采集、evaluator 代码和报告，并使用可检索的 evaluation skills。
- 关键度量：`Eval@1` 不是“最终修到能跑”，而是 evaluator 在第一次运行时成功执行并产出实质性、非空洞结果的比例。
- 结果：以 Sonnet 4.5 为 evaluator backbone 时，单轮 B1 baseline 的 Eval@1 为 17.5%，EvalAgent 为 65.0%；论文摘要采用这一代表性比较。在另外一项 EvalAgent 与 B4（Agent-Twostage）的盲法专家成对比较中，79.5% 的维度级判断偏好 EvalAgent，10.5% 为平局；该偏好率不是 EvalAgent 与 B1 的比较。去掉 evaluation skills 后 Eval@1 从 65% 降至 30%。数字见 PDF p.1–2、§3.3、§4 和表 3。
- 对本文真正重要的含义：evaluator 自己会运行失败、会产生空洞指标、会发生计划—代码偏移，因此不能只保存最终分数。评测交付至少要让审阅者看到计划、输入、插桩、trace、代码、依赖、运行结果和元评测。
- 不能外推：样本只有 20 个 Agent，实验只使用 Claude 系列；65% 首次成功意味着约三分之一 evaluator 仍需人工调试；专家判断带主观性。论文在 PDF p.15 明确列出这些限制。

## 2. Microsoft Research / UIUC：AgentLens

- 一手材料：[论文](https://arxiv.org/abs/2605.12925)
- 阅读范围：PDF 33 页全文，重点为摘要、§2–§5、表 2、附录 A、B、D、E、F。
- 研究问题：相同的“通过”是否可能掩盖完全不同的解决过程？
- 数据：研究收集 2,614 条 OpenHands 轨迹，来自 8 个模型后端、60 个 SWE-bench Verified 任务；其中 47 个任务有足够的通过轨迹可构建任务级过程参考，形成 1,815 条评测子集。该子集中有 1,136 条通过轨迹。
- 方法：把同一任务的多条通过路径合并为 Prefix Tree Acceptor（PTA），将动作按上下文标注为探索、实现、验证或编排，再计算过程质量、浪费和偏离信号。
- 结果：在 1,136 条通过轨迹中，10.7% 被归为 Lucky Pass，包含回归循环、盲目重试、缺失验证或时间顺序混乱；按过程质量排序与按 pass rate 排序不同，部分模型移动最多 5 个名次。见 PDF p.1–2、§5 与表 2。
- 对本文真正重要的含义：最终测试通过只回答“结果是否过线”，不能回答“这个结果是否由稳定、可复验的过程得到”。因此 trace 不是装饰性日志，而是评测输入。
- 不能外推：该框架只在 OpenHands 风格的编码轨迹和 SWE-bench Verified 上验证；分数权重是固定的、可按领域调整。作者明确说过程分只能作为补充诊断，不能替代功能正确性、安全审查或人工判断；高分轨迹仍可能产出错误或不安全补丁。见 PDF p.15。

## 3. HKUST / Tongji：UnderSpecBench

- 一手材料：[论文](https://arxiv.org/abs/2607.02294)
- 阅读范围：PDF 12 页全文，覆盖基准设计、变量控制、结果、控制面分析、缓解措施、§VI 局限。
- 研究问题：在意图、目标或影响半径没有说清时，编码 Agent 会澄清、拒绝，还是直接猜并改变环境？
- 方法：69 个任务族，横跨 4 个能力域和 9 个控制面；以意图清晰度、目标确定性和 blast radius 三个轴生成 `4 × 4 × 2` 变体，共 2,208 个提示。运行在隔离、网络受限的容器中，用确定性的副作用 Oracle 区分 Safe Success、Wrong Target、OverScope；未执行再区分澄清、拒绝或延后。
- 结果：五个 Agent×模型配置中，55.8%–67.8% 的已采取动作运行（acted runs）违反至少一个动作边界；未行动、澄清、拒绝或延后的运行不在这个分母中。目标不明确是主要驱动因素，blast-radius 提示对是否行动的影响很弱。见 PDF p.1、§V。
- 对本文真正重要的含义：若 evaluator 只检查“任务是否完成”，它可能把改错对象或影响范围过大的运行记成成功。评测包必须保存场景边界、预期目标和实际副作用，并让 Oracle 对三者逐项判断。
- 不能外推：这是无确认自主模式的容器压力测试，不是生产事故率预测；每个任务只编码一个预期安全动作，可能漏掉其他合理动作；基础设施/容量/可观测性控制面样本较少；五个配置和三个 harness 只是当期快照。见 PDF p.10。

## 4. Google Cloud AI Research：ScientistOne

- 一手材料：[论文](https://arxiv.org/abs/2605.26340)
- 阅读范围：PDF 35 页全文，覆盖 Chain-of-Evidence 设计、75 篇论文评测、完整审计案例、实现附录和 §9 局限。
- 研究问题：长链路研究 Agent 的最终论文看似自洽时，如何验证分数、规范、引用和方法代码是否真的对齐？
- 方法：五个系统、五个系统优化任务、每任务三次运行，共 75 篇论文。CoE Integrity Audit 包含分数复验、规范违规、参考文献存在性和方法—代码对齐四类检查。写作过程先生成带证据标签的研究表示，再进行确定性 Ground、LLM Critic、Resolve 和 Claim Verifier。
- 结果：baseline 的虚构引用率最高 21%，分数复验通过率最低 42%，方法—代码对齐为 20%–80%；ScientistOne 报告 0/337 个虚构引用、12/12 分数复验和 14/15 方法—代码对齐。见 PDF p.1、表 1、§6–§8。
- 关键反例：PDF p.20 的 Case 3 展示了“分数是真的、方法仍利用 evaluator 漏洞”；Case 4 展示了“分数接近可复验、论文描述的算法却没有出现在代码里”。分数复验与结论—工件对齐必须分别检查。
- 对本文真正重要的含义：公开报告中的每个重要主张都需要指向可检查的运行工件；“引用存在”也不等于“引用支持了主张”。
- 不能外推：实验集中在有 gold evaluator 的系统优化任务；文献核查主要验证存在性而非全文蕴含；自动 reviewer 不能替代专家；baseline 适配含研究者判断；审计未系统界定假阴性；方法—代码对齐部分依赖 LLM 多数票。见 PDF p.15。

## 5. OpenAI：编码评测数据质量审计

- 一手材料：[Separating signal from noise in coding evaluations](https://openai.com/index/separating-signal-from-noise-coding-evaluations/)，发布于 2026-07-08。
- 方法记录：初筛同时检查题目说明、模型尝试和用于评分的测试，标记 286 个可能损坏的任务；随后用可访问仓库与环境的调查 Agent 做多次深入审计，并由研究者终审。独立的人类标注线由受训工程师执行，每题 5 人评审，分歧和低置信度案例升级处理。
- 对本文真正重要的含义：评测对象不止是模型输出；题目、环境、测试、参考解和评审过程都可能改变分数含义。可靠性需要从 evaluator 上游开始。
- 不能外推：该审计针对 SWE-Bench Pro，不定义通用评测包，也不能把其缺陷比例套到其他基准。

## 6. 工程实现交叉阅读

### Agent-EvalKit

与 EvalAgent 论文为同一来源身份，只用于确认论文描述已经落为计划、测试、插桩、trace、evaluator 和报告的第一方实现，不能作为独立复现。

### agentevals

[仓库](https://github.com/agentevals-dev/agentevals)将预录 OpenTelemetry trace 与 golden eval set 分开，支持内置、LLM 和自定义代码 evaluator；自定义 evaluator 从 stdin 读 JSON、向 stdout 写分数，并可携带 `requirements.txt`。它同时明确承认当前不适合长时编码 Agent 的非标准 trace。这是“输入格式、evaluator、依赖与适用边界都应显式交付”的工程例子，不是效果证明。

### TraceCore

[仓库](https://github.com/justindobbs/Tracecore)把 `spec_version`、`runtime_identity`、`task_hash`、`artifact_hash`、预算和 seed 写入 artifact，支持本地验证、bundle seal 和外部 consumer repo 复验。它说明评测包可以有稳定目录与完整性校验，但不能证明随机模型运行完全可重放，也不能证明该项目被广泛采用。

### Future AGI

[仓库](https://github.com/future-agi/future-agi)强调 evaluator、prompt 与 trace 可检查，并组合多类 grader。维护者给出的性能或产品效果不进入本文定量结论，只作为开源评测工程正在把“黑盒分数”拆成可见工件的旁证。

## 跨来源一致与张力

### 一致部分

1. 输出通过不足以证明过程可靠：AgentLens 和 UnderSpecBench 从不同角度支持这一点。
2. evaluator 不是天然正确：EvalAgent 的首次可执行率和 OpenAI 的基准审计都显示评测基础设施自身会失败。
3. 分数与主张可能错位：ScientistOne 的分数复验、方法—代码对齐和引用核查把它拆成不同问题。
4. 工程实现正在保存 trace、evaluator、依赖和运行身份，但这些是设计模式，不是通用标准已经形成的证明。

### 张力与反证

- 确定性 Oracle 可重复，但可能过窄；UnderSpecBench 自己承认单一安全动作可能漏掉合理替代。
- 过程质量有诊断价值，但可能惩罚必要探索；AgentLens 明确拒绝把它当自动放行器。
- 完整证据链降低审阅成本，却增加存储、隐私、脱敏和运行成本。
- 固定 seed、模型与依赖可以提高可比性，不能消除外部 API、并发、时间和模型服务造成的随机性。

因此本文不能声称“八类文件保证 Agent 可靠”，只能主张：这些文件构成让评测可执行、可质疑、可复核的最小审阅面，并让失败落到可定位的层级。
