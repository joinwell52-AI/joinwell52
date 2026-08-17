# Fact–Claim Matrix：Agent 评测的可执行证据包

> `F` 为来源直接报告的事实；`I` 为 Research Center 跨来源推断；`A` 为工程建议。推断与建议不得写成来源已证明的结论。

| ID | 类型 | 事实或候选主张 | 原文位置 | 可支持范围 | 不可支持范围 | 冲突/反证 | Research Center 推断 | 未决问题 |
|---|---|---|---|---|---|---|---|---|
| FC-01 | F | EvalAgent 把评测产物拆为计划、测试、插桩、trace、可执行代码和报告 | EvalAgent PDF p.1–6，§3；Agent-EvalKit 仓库 | 该研究实现采用完整产物链 | 不是行业统一标准；不是独立复现 | 更小系统可能不需要所有层 | evaluator 应被当作软件工件审阅 | 最小低风险版本能否更小？ |
| FC-02 | F | AgentEvalBench 包含 20 个 Agent、9 个框架、14 个应用域，每个 Agent 有 2 个要求和 5 个场景 | EvalAgent PDF p.2，§4 | 描述实验规模与构成 | 不能代表全部 Agent 类型 | 作者明确排除 embodied/multimodal 的代表性保证 | 数字只用于解释样本边界 | 跨模型、跨领域结果是否稳定？ |
| FC-03 | F | 以 Sonnet 4.5 为 evaluator backbone 时，单轮 B1 baseline 的 Eval@1 为 17.5%，EvalAgent 为 65.0%；另一个实验中，EvalAgent 对 B4 的盲法专家成对比较有 79.5% 的维度级判断偏好 EvalAgent | EvalAgent PDF p.1–2、§3.3、§4、表 3 | 前一组数字支持该配置下的首次可执行、非空洞结果比较；后一数字只支持 EvalAgent 与 B4 的专家偏好 | 不代表所有 baseline 都是 17.5%；79.5% 不是与 B1 的比较；两者都不等于 evaluator 正确率或生产事故下降 | 约三分之一仍需调试，元评测主观 | “evaluator 是否真的运行”必须成为门禁 | 如何自动检测“非空洞”而不被游戏？ |
| FC-04 | F | AgentLens 分析 2,614 条轨迹；47 个任务形成 1,815 条子集，其中 1,136 条通过 | AgentLens PDF p.1、§4 | 描述样本与筛选 | 不是全部 SWE-bench，也不是全部编码 Agent | 只有 OpenHands 风格轨迹 | 文章引用数字时必须同时给分母和范围 | 其他 scaffold 的 lucky pass 比例如何？ |
| FC-05 | F | 通过轨迹中 10.7% 被归为 Lucky Pass | AgentLens PDF p.1、§5、附录 D | 证明该样本中结果通过会掩盖脆弱过程 | 不能称 10.7% 是行业普遍比例 | 分类与固定权重可能受设计选择影响 | pass/fail 与过程诊断应并列，而非互相替代 | 人工标注和不同权重下比例如何变化？ |
| FC-06 | F | AgentLens 的过程质量排序会改变相对 pass rate 的模型顺序，最多移动 5 位 | AgentLens PDF p.2、表 2 | 说明排名依赖评测维度 | 不证明过程分比 pass rate 更“真” | 高过程分仍可能对应不安全补丁 | 发布评审应看到维度分解，避免单分数遮蔽 | 哪些权重适合真实发布风险？ |
| FC-07 | F | UnderSpecBench 用 69 个任务族和 2,208 个提示变体，以确定性副作用 Oracle 区分 Safe Success、Wrong Target、OverScope | UnderSpecBench PDF p.1、§III–IV | 证明可以把目标和范围边界编码为可检查副作用 | 不证明 Oracle 覆盖全部合理动作 | 单一预期动作可能漏判；部分未执行标签由 LLM 判 | 场景合同必须声明目标、禁止副作用和容许替代 | 如何维护随系统变化的 side-effect oracle？ |
| FC-08 | F | 五个配置中 55.8%–67.8% 的已采取动作运行（acted runs）违反至少一个边界 | UnderSpecBench PDF p.1、§V | 该压力测试矩阵中、以 acted runs 为分母的边界违规 | 不包含未行动、澄清、拒绝或延后；不是生产事故率；不能外推全部模型 | 无确认自主模式放大风险 | 结果成功必须与目标正确和范围正确拆分 | 有人类确认时比例会如何变化？ |
| FC-09 | F | UnderSpecBench 的目标不确定性是主要驱动因素，blast-radius 提示很少降低行动倾向 | UnderSpecBench §V-B–E、p.9 | 支持“场景输入必须绑定目标”的必要性 | 不支持“提示永远无效” | 不同 harness 的 Ask-User 能力显著改变行为 | 环境和 harness 能力也要进入评测包身份 | 怎样跨 harness 比较确认策略？ |
| FC-10 | F | ScientistOne 在 75 篇论文上分别审计分数、规范、引用和方法—代码对齐 | ScientistOne PDF p.1、§5–8 | 说明最终报告完整性是多维问题 | 不是通用 Agent 发布基准 | 领域集中在系统优化 | 评测报告的主张需要逐项绑定工件 | 通用 claim schema 应如何设计？ |
| FC-11 | F | baseline 虚构引用率最高 21%，分数复验最低 42%，方法—代码对齐 20%–80% | ScientistOne PDF p.1、表 1 | 描述该 75 篇论文实验的基线失败 | 不能称为所有研究 Agent 的普遍失败率 | baseline 适配含研究者判断，假阴性未界定 | “分数可复验”和“叙述准确”必须分开审查 | 不同领域、不同 reviewer 是否复现？ |
| FC-12 | F | ScientistOne 报告 0/337 虚构引用、12/12 分数复验、14/15 方法—代码对齐 | ScientistOne PDF p.1、表 1 | 该实验中该系统的审计结果 | 不等于零错误；不等于自动 reviewer 充分 | 存在性不等于蕴含；I4 部分为 LLM 多数票 | 只引用为“设计例证”，不写成已解决完整性 | 假阴性率和全文蕴含如何量化？ |
| FC-13 | F | OpenAI 初筛检查题目、尝试和测试，标记 286 个潜在损坏任务，再由多次 Agent 调查、研究者和每题 5 名人类工程师复核 | OpenAI 2026-07-08 文章，Methodology 与 Human annotation campaign | 证明 benchmark 的题目和测试也需要审计 | 不定义通用 artifact schema；不适用于所有 benchmark | 官方审计本身仍有筛选与判断过程 | 评测包要包含场景来源、测试和争议处理记录 | 数据集更新后如何保持版本可追溯？ |
| FC-14 | F | agentevals 可对预录 OTel trace 重复评分，自定义 evaluator 可带依赖；同时明确不适合当前长时编码 Agent trace | agentevals README：What is、Custom Evaluators、FAQ | 工程上可分离运行与评分，并声明适用边界 | 不证明工具能捕捉全部语义风险 | 只评分旧 trace 不能验证最新环境或副作用 | 包应记录 trace schema、evaluator 协议和边界 | 标准化 trace 会丢失哪些框架语义？ |
| FC-15 | F | TraceCore artifact 包含 spec/runtime/task/artifact 身份、预算和 replay 元数据 | TraceCore README：What TraceCore Defines、Verification、Strict Spec | 演示可验证 bundle 的身份与完整性字段 | 不证明完全确定性或广泛采用 | 外部 API/模型服务仍会变化 | 可重跑首先要求输入与运行时身份可验证 | 哪些外部状态必须快照或模拟？ |
| FC-16 | I | 一个评测分数实际上依赖两条执行链：Agent 运行链和 evaluator 运行链 | 综合 FC-01、03、05、07、10、13 | 解释为何结果层不足 | 来源没有统一提出“两条执行链”术语 | 低风险静态检查可能只有一条简单链 | 作为本文原创机制框架 | 是否还需要第三条人工裁决链？ |
| FC-17 | I | 发布级最小审阅面应包含 8 类工件：场景合同、环境身份、trace/副作用、Oracle/rubric、evaluator+依赖、结果、claim links、meta-evaluation+limits | 综合 FC-01、05、07、10、13–15 | 为跨来源归纳出的交付合同 | 不是论文验证过的标准，也不保证可靠 | 成本、隐私和领域差异可能要求分层 | 文章的核心原创贡献 | 哪些字段应强制，哪些按风险选配？ |
| FC-18 | A | CI 应先验证 evaluator 可运行且非空洞，再检查 Agent 分数；失败要区分环境、输入、evaluator、Oracle、过程、结果与报告层 | 由 FC-03、05、07、10、15 推导 | 可操作的发布门禁建议 | 没有直接实验比较该 CI 顺序的收益 | 增加运行成本，LLM judge 仍不稳定 | 建议按风险等级逐步实施 | 如何设置成本预算和人工升级阈值？ |

## 数字与措辞控制

- `65.0%` 始终写成 Eval@1，不写成 evaluator 正确率。
- `10.7%` 始终绑定 1,136 条通过轨迹和 OpenHands/SWE-bench Verified 范围。
- `55.8%–67.8%` 始终绑定无确认容器压力测试、五个配置和 acted-run 分母，不写成全部运行比例或生产事故率。
- `21% / 42% / 20%–80% / 0/337 / 12/12 / 14/15` 始终绑定 75 篇系统优化论文的审计。
- “八类工件”明确标注为 Research Center 综合推断和工程合同建议，不伪装成任何单篇论文的结论。
