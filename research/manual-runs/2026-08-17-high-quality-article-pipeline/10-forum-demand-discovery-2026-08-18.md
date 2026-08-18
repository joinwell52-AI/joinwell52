# 论坛需求发现与替代选题门禁（2026-08-18）

## 状态

- 本记录是一次性实时任务的重新发现阶段，不修改 Daily Research Runtime、Scheduler、schemas、skills 或 prompts。
- 截止本检查点：只完成需求发现、初步证据核验和 30 天去重；未开始正文、配图或发布。
- 论坛热度只作为读者需求信号，不作为工程事实的唯一证据。

## 论坛高点击内容呈现出的模式

2026-08-18 实时检查 Cursor Forum 的 all-time 与 monthly Top 页面，并深读代表性首帖。高点击主题主要集中在四类：

1. **直接经济损失或失控感**：费用、额度、计费展示突然变化。
2. **关键能力变化**：新模型、新模式、新路由能力上线。
3. **明确回归或故障**：有清楚的“以前能做、现在不能做”和复现步骤。
4. **可复制的工作方法**：大项目、长上下文、计划、测试、检查点等能立即照做的指南。

高点击并不取决于篇幅。短投诉依靠共同痛点，高质量长帖则通常在开头立即说明“你遇到的具体问题”和“读完能获得什么”，随后给出编号步骤、示例或可复制协议。纯粹抽象的框架论述不是主要流量形态。

代表性需求信号：

| 帖子 | 观察到的信号 | 能支持什么 | 不能支持什么 |
| --- | --- | --- | --- |
| [Usage Page $$ to Token Amount? WHAT?](https://forum.cursor.com/t/usage-page-to-token-amount-what/167153) | 费用显示从美元变成 token 后，用户难以按请求、用户和模型判断花费；Cursor 员工确认不同套餐的显示和可获得字段不同 | 真实用户希望区分使用量、包含额度和实际账单；成本可见性是当下痛点 | 不能独立证明某种成本数据模型是行业标准，也不能证明 Cursor 有意隐藏收费 |
| [An Idiot's Guide To Bigger Projects](https://forum.cursor.com/t/an-idiots-guide-to-bigger-projects/23646) | 大项目指南以 checkpoint、Git、短会话、计划和测试为可执行步骤 | 读者需要可复制的大仓库 Agent 工作法 | 作者经验不能证明每条做法都提高成功率 |
| [RIPER-5 Mode](https://forum.cursor.com/t/i-created-an-amazing-mode-called-riper-5-mode-fixes-claude-3-7-drastically/65516) | 复制即用的阶段协议带来极高互动 | 分阶段、可复制的协议具有传播力 | 不能把作者宣称的“修复所有问题”当作实验结论 |
| [Cursor Router](https://cursor.com/blog/router) | 产品变化同时涉及模型、成本与质量权衡 | why now；动态路由使 token 到金额的映射依赖模式、模型与合同 | 厂商自报节省不能当作独立因果证明 |

## 候选 A：成本界面必须同时回答三个问题

### 暂定标题

**Token 不是账单：AI Agent 成本界面必须分开使用量、包含额度与应付金额**

### 核心问题

当一个 Agent 平台同时存在订阅包含额度、按量超额、动态模型路由、缓存和不同模型费率时，只显示 token 数量是否足以让个人与团队控制成本？

### 核心判断

不够。一个可行动的成本界面至少要同时提供三类不可互相替代的事实：

1. 消耗了多少资源（例如输入、输出、缓存 token 或标准化计量单位）；
2. 其中多少由套餐、合同、折扣或包含额度吸收；
3. 最终实际计费多少、由谁或哪个项目承担。

### 独立证据身份

| 来源 | 访问日期 | 支持范围 | 不支持范围 |
| --- | --- | --- | --- |
| [FOCUS Column Library v1.4](https://focus.finops.org/focus-columns/) | 2026-08-18 | 开放规范把 Consumed Quantity、Billed Cost、Contracted Cost、Effective Cost、List Cost、价格和合同字段分开 | 不规定 AI Agent 产品的具体 UI，也不证明采用后一定降低成本 |
| [OpenAI Organization Usage / Costs API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage) | 2026-08-18 | 官方 API 将 token 使用量与带 currency/value 的 monetary cost 分成不同对象/端点，并支持项目、用户等维度 | 只说明 OpenAI 的接口，不代表所有供应商账单语义一致 |
| [GitHub usage reporting](https://docs.github.com/en/billing/tutorials/automate-usage-reporting) | 2026-08-18 | 官方文档明确区分 quantity、netAmount 与 discountAmount，并分别解释消耗、实付与包含/折扣 | 不能直接映射 Cursor 的套餐条款 |
| [Cursor Router Docs](https://cursor.com/docs/cursor-router) | 2026-08-18 | 动态路由的模型池会变化；Cost 使用 bundled Auto pricing，Balance/Intelligence 按路由模型费率计费 | 不披露每个分类决策，也不能独立验证厂商节省比例 |
| [Cursor Forum usage thread](https://forum.cursor.com/t/usage-page-to-token-amount-what/167153) | 2026-08-18 | 需求强度、用户任务和产品当前行为 | 不是独立标准或性能实验 |

### 目标读者与行动

- 目标读者：建设或采购 coding-agent / enterprise-agent 平台的工程负责人、FinOps、产品经理和团队管理员。
- 读者行动：检查成本事件是否同时保存 `consumed_quantity`、`included_or_discounted_amount`、`billable_amount`、`currency`、`pricing_version`、`model/router_mode`、`user/project/work_order`；检查 UI 是否分别回答“用了多少、额度吃了多少、要付多少”。

### 30 天去重

- 与 2026-08-08《数字员工需要暂停保留型预算准入》不同：旧文讨论预算耗尽后的运行时准入、暂停、结算和恢复权；本题讨论成本数据模型、归因与面向用户的经济事实。
- 与 2026-08-05《模型路由必须在政策边界内优化》不同：旧文讨论路由的政策资格与审计边界；本题只把路由作为价格映射会动态变化的机制之一。
- 与 2026-08-14《从 KPI 可见性到决策权》不同：旧文讨论运营 KPI 的责任、阈值和闭环；本题聚焦可对账的资源、权益与账单字段。

### 门禁决定

**SELECTED FOR DEEP READING**。问题、证据对象、结论和读者行动与现有文章实质不同；已有三个相互独立的一手证据身份。写作前仍需核对 FOCUS 各字段定义和 Cursor 套餐边界，不能把厂商自报节省写成独立验证结果。

## 候选 B：大仓库 Agent 的计划必须是可审查工件

### 暂定标题

**别让 Agent 立刻写代码：大仓库任务先交一份可审查的实施计划**

### 核心问题

在跨文件、跨模块任务中，为什么 Agent 经常不是把某段代码写错，而是在开始编码前就漏掉了要求或误解了范围？

### 核心判断

计划的价值不在于多写一段“思考”，而在于提前交付一份可检查的工件：需求清单、代码位置、依赖与风险、验证方法、明确不做什么，并在执行前由人纠正遗漏。

### 独立证据身份

| 来源 | 访问日期 | 支持范围 | 不支持范围 |
| --- | --- | --- | --- |
| [Cursor agent best practices](https://cursor.com/blog/agent-best-practices) | 2026-08-18 | 官方 Plan Mode 会先研究代码库、提问、形成带文件路径和代码引用的计划并等待批准；也明确小任务不一定需要详细计划 | 产品最佳实践不是随机对照实验 |
| [E2EDevBench / agent workflow study](https://arxiv.org/abs/2511.04064) | 2026-08-18 | 受控比较中，工作流设计影响需求完成；论文报告遗漏和验证失败多于单纯实现错误，并把 Task Planning 识别为主要瓶颈 | 预印本、特定 benchmark 与 agent 架构；不能把比例泛化到所有工具和仓库 |
| [AI Agents and Higher-Order Work](https://ssrn.com/abstract=5713646) | 2026-08-18 | 基于 Cursor 使用数据，作者报告经验更丰富的开发者更常通过计划寻求对齐；代理价值更依赖可验证工作 | 观察性研究不能证明“计划”单独导致更高产出；研究者曾在 Anysphere 访问研究，需披露关系 |
| [Cursor Forum bigger-project guide](https://forum.cursor.com/t/an-idiots-guide-to-bigger-projects/23646) | 2026-08-18 | 直接需求与可执行指南形态；计划、短会话、checkpoint、测试是读者关心的组合 | 个人经验不能作为效果量依据 |

### 目标读者与行动

- 目标读者：用 coding agent 处理多模块功能、迁移和重构的开发者与团队负责人。
- 读者行动：把任务拆成“探索—计划评审—执行—验证”四个门；要求计划逐项映射需求、文件/符号、风险、测试和非目标；小修复允许走轻量路径。

### 30 天去重

- 站内过去 30 天没有以“计划工件如何防止需求遗漏”为核心的问题、证据对象或行动清单。
- 与《Agent 评测不能只交一个分数》不同：旧文在执行后检查评测证据；本题在执行前暴露范围与需求遗漏。
- 与《紧凑运维界面不应压缩掉执行证据》不同：旧文讨论执行记录的呈现；本题讨论编码前的可审查计划。

### 门禁决定

**CONDITIONAL — DEEP READING REQUIRED**。来源身份满足两个以上，但两篇研究都需要完整读取方法、样本、结果和局限后，才能确认是否有足够证据支撑“可审查计划”的具体最小结构。若深读只能支持“计划与经验相关”，不能支持计划工件的机制，则降级为研究笔记。

## 明确不入选的方向

1. **模型发布/模型请求帖**：点击高，但容易退化成时效很短的产品新闻，且与既有模型路由、评测文章重叠。
2. **Agent diff/活动记录回归**：需求真实，但与 2026-08-17《紧凑运维界面不应压缩掉执行证据》的问题、结论和读者行动过近。
3. **把 RIPER-5 或其他 prompt 协议直接整理成文章**：传播性强，但主要依赖单个经验帖，没有可复现实验，不能达到证据门槛。
4. **同一“计划/上下文/大仓库”主题硬拆多篇**：这些信号属于同一个核心问题，应合并为一篇或不选，不能占据多个名额。

## 当前结论

- 当前建议进入深读：候选 A。
- 有条件进入深读：候选 B。
- 第三个名额：**No Selection**。
- 在用户确认选题方向前，不开始正文、配图或发布。

