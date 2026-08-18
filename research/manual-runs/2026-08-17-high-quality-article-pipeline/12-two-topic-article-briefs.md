# 两题 Article Brief（2026-08-18）

## Brief A — 生活化解释型

### 身份

- 工作标题：**Token 不是账单：AI Agent 成本界面必须分开使用量、包含额度与应付金额**
- 英文工作标题：**Tokens Aren't a Bill: Agent Cost Screens Must Separate Usage, Included Value, and Amount Due**
- 文章类型：生活化问题解释 + 工程检查清单。
- 目标读者：个人 coding-agent 用户、团队管理员、Agent 产品经理、工程负责人和 FinOps。

### 具体问题

用户打开 Usage 页面只看到几百万 token 时，仍然无法回答最朴素的问题：“这些是套餐里已经包含的，还是月底还要付的钱？”为什么一个技术上精确的计数，会在生活中变成没有决策价值的信息？

### 核心命题

Token 只能回答资源消耗，不能单独回答经济后果。一个诚实且可行动的成本界面必须把三层事实分开：

1. 使用量：输入、输出、缓存或标准化单位；
2. 权益消耗：套餐包含量、折扣、承诺用量或 credit；
3. 应付金额：实际计费金额、币种、结算状态和责任范围。

### 原创价值

- 不站在“显示 token”或“显示美元”的二选一争论里，而是解释两者为什么都会误导。
- 把论坛里的日常困惑连接到 FOCUS、OpenAI、GitHub 和 Cursor 的真实数据模型。
- 提供一个用户能立即检查产品、团队能立即检查埋点的“三张小票”框架。

### 叙事与论证节点

1. 生活开场：早上打开 Usage，看到 230 万 token，但不知道今天是否多花钱。
2. 第一张小票——用了多少：token 能帮助发现超长输入、缓存与模型行为。
3. 第二张小票——套餐替你付了多少：included、discount、commitment 与 list value 不能混成“花费”。
4. 第三张小票——你还要付多少：billable amount、currency、estimated/final 状态。
5. 为什么不能用一个换算器解决：输入/输出/缓存费率、模型路由、不同模式和合同。
6. 反例：只恢复美元列会把套餐覆盖的名义价值误写成账单。
7. 面向普通用户的六问检查表。
8. 面向平台团队的最小 cost event 字段。
9. 局限：实时估算、月末发票、退款修正和内部 chargeback 仍可能不同。

### 证据身份

- 需求信号：Cursor Forum usage thread。
- 行业规范：FOCUS v1.3 / Column Library。
- 独立平台实现：OpenAI Organization Usage/Costs API、GitHub usage reporting。
- 当前产品机制：Cursor Router Docs、Cursor Teams、Cursor Admin API。

### 风险控制

- 不写“Cursor 隐藏成本”这种动机判断。
- 不把某一套餐行为泛化到全部用户。
- 不把厂商节省宣传写成独立验证结果。
- 所有金额例子明确是示意，不伪造真实账单。

### 预期读者行动

- 普通用户：能分别找到使用量、包含/折扣量、实际应付金额，并核对状态和范围。
- 团队管理员：能检查是否可按用户、项目、模型或 WorkOrder 归因。
- 平台团队：能建立 usage → entitlement → billing 三层事件，而不是只存 token 总数。

### Brief 决定

**PASS**。

## Brief B — 技术流分析型

### 身份

- 工作标题：**别让 Agent 立刻写代码——也别盲信它的计划**
- 副标题：**大仓库任务需要可审查、非权威的需求映射**
- 英文工作标题：**Don't Let the Agent Code Yet—and Don't Trust Its Plan Blindly**
- 文章类型：研究驱动的工程机制分析 + 计划工件模板。
- 目标读者：使用 coding agent 处理跨模块功能、迁移、重构和复杂缺陷的开发者、Tech Lead 与 Agent 平台工程师。

### 具体问题

当 Agent 最终交出一堆能运行的代码，却漏掉关键需求时，问题究竟出在写代码阶段，还是在开始编码前？如果“先规划”是答案，为什么 E2EDevBench 中带 Design Agent 的工作流反而最差？

### 核心命题

计划不是新的权威规格，而是原始需求的可审查派生物。有效计划必须：

- 逐条映射原始需求；
- 指向真实文件、符号和依赖；
- 声明验证方式、风险与非目标；
- 在执行中记录偏差；
- 不能遮蔽或替代原始需求。

### 原创价值

- 用研究中的失败反例修正“Plan Mode 总是更好”的常见建议。
- 把计划失败机制定义为 `authority inversion`：派生计划反过来压过原始需求。
- 给出一个可以进入 PR、Agent harness 或任务编排器的最小 Plan Contract，而不是提示词口号。

### 论证节点

1. 开场：两种失败——直接开写导致遗漏；先写了一份错误计划导致错误被系统化传播。
2. E2EDevBench 的方法边界：50 个 PyPI 项目、两种 Gemini、三类统一工具链工作流。
3. 结果：最佳组合约完成一半需求；计划/理解根因占 55.8%。
4. 关键反例：DDT 均值 27.71%，低于 DT 49.48% 和 Single 45.72%；作者认为错误设计计划被当成权威并向下传播。
5. 机制：计划为什么会变成放大器——需求压缩、权威倒置、handoff 丢失、验证延后。
6. 可审查计划的六段合同：Requirements Map、Code Map、Dependencies、Verification、Non-goals、Execution Delta。
7. 人工批准不等于正确：批准应检查逐条 traceability，而不是阅读一段流畅文字。
8. 轻量通道：单文件、已知位置、低风险修复不强制重计划。
9. 局限与待验证：从零项目不等同于大仓库；计划合同字段尚无独立实验。

### 证据身份

- 产品机制：Cursor Best Practices / Plan Mode。
- 受控实验：E2EDevBench。
- 大样本观察研究：AI Agents and Higher-Order Work。
- 读者需求：Cursor Forum bigger-project guide。

### 风险控制

- 不写“55.8% 的所有 Agent 失败都来自计划”；必须限定为论文抽样和设置。
- 不把 +0.45pp Plan rate 的相关关系写成因果。
- 不把 accept rate 或 merge count 当质量证明。
- 对 DDT 失败同时保留“额外 handoff/上下文压缩”这一替代解释。
- 计划合同明确标为 Research Center 综合建议，待真实仓库实验。

### 预期读者行动

- 在复杂 Agent 任务中增加 Plan Review 门，但保留原始需求为 canonical input。
- 用六段 Plan Contract 评审计划完整性。
- 在执行阶段记录计划偏差，并让新发现触发重新规划，而不是静默漂移。

### Brief 决定

**PASS**。

