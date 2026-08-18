# 两题深读与事实—主张矩阵（2026-08-18）

## 共同规则

- 访问日期：2026-08-18。
- 论坛内容只用于确认读者痛点和问题措辞；技术事实必须由规范、官方文档、代码或完整论文支撑。
- 下表明确区分来源事实、来源作者解释、Research Center 推断和工程建议。
- 两篇 PDF 均已读取正文的方法、数据、结果、讨论和局限；涉及数字时保留样本、模型和研究设计边界。

## 主题 A：Token 不是账单

### 深读来源

1. [Cursor Forum — Usage Page $$ to Token Amount? WHAT?](https://forum.cursor.com/t/usage-page-to-token-amount-what/167153)
2. [Cursor Admin API](https://cursor.com/docs/account/teams/admin-api)
3. [Cursor Router Docs](https://cursor.com/docs/cursor-router)
4. [Cursor Teams](https://cursor.com/en-US/business/teams)
5. [Cursor Router launch](https://cursor.com/blog/router)
6. [FOCUS Column Library](https://focus.finops.org/focus-columns/)
7. [FOCUS Specification v1.3](https://focus.finops.org/focus-specification/v1-3/)
8. [OpenAI Organization Usage / Costs API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)
9. [GitHub Automating Usage Reporting](https://docs.github.com/en/billing/tutorials/automate-usage-reporting)
10. [GitHub AI Credit Usage API](https://docs.github.com/en/rest/billing/usage)

### 阅读结论

- `token` 是资源计量，不是天然的货币账单。同一数量的 token 在输入、输出、缓存、不同模型、不同路由模式、不同套餐或合同下可能产生不同经济结果。
- “只显示美元”也不完整：如果套餐包含使用量，按公开单价换算出的名义价值可能高于用户实际需要支付的金额。论坛中的 Cursor 员工明确把这作为改成 token 展示的理由之一。
- 正确的产品答案不是在 token 和美元之间二选一，而是并列展示三层事实：资源消耗、权益/折扣消耗、实际应付金额。
- Cursor 的公开材料本身显示了这种分层：Team 页面区分 included usage 与 on-demand；Admin API 区分 subscription included requests、usage-based requests、spendCents，并在 usage event 中提供 tokenUsage、model、kind 与 totalCents。不同套餐和权限可获得的数据粒度不同，不能把“某个用户页面看不到”写成“平台完全没有成本数据”。
- FOCUS 明确区分 Consumed Quantity 与 Pricing Quantity：前者关注资源/服务消耗，后者关注定价和成本；同时另设 Billed Cost、Contracted Cost、Effective Cost、List Cost。FOCUS 不是 AI Agent UI 规范，但提供了跨技术账单数据不把“用了多少”和“付了多少”合并的可靠先例。
- OpenAI 官方接口将 `/organization/usage/*` 与 `/organization/costs` 分开：usage 对象记录 input tokens、requests、project/user 等，cost 对象记录带 `currency` 和 `value` 的 monetary amount。这支持“资源计量和货币金额是不同对象”，但不能证明所有平台都必须复制其 API 形态。
- GitHub 官方用量报告同时返回 `quantity`、`netAmount` 与 `discountAmount`，并明确解释它们分别回答消耗量、实际计费和包含/折扣量。它是最接近本文“三层事实”判断的独立工程实例。

### 事实—主张矩阵

| 编号 | 可写主张 | 身份 | 来源位置 | 可支持范围 | 不可支持范围 / 反证 |
| --- | --- | --- | --- | --- | --- |
| A1 | 2026-07-31 的 Cursor 论坛讨论显示，一批用户在 usage 页面从美元视图切到 token 后失去了按日、按用户或按模型理解花费的能力 | 需求事实 | Forum 首帖及 Cursor 员工第 9、16、19 条回复 | 证明用户任务和当时的产品表现 | 不能证明所有套餐、所有后台或当前所有账户都没有金额数据；不能推断主观动机 |
| A2 | Cursor Team 的 Admin API 分开提供日使用量、成员 spend 和逐 usage event 的 model/token/cost/kind | 产品事实 | Admin API：Daily Usage、Get Spending Data、Get Usage Events Data | 证明同一平台内部需要不同层级的使用和成本对象 | 文档可能迭代；接口只对团队管理员开放，不能泛化到个人账户 |
| A3 | Cursor Router 的 Cost、Balance、Intelligence 使用不同计费规则；模型池会变化且用户不能手选每次路由模型 | 产品事实 | Router Docs：How it works、Optimization modes、Pricing | 证明 token 到金额的映射依赖模式、模型与合同 | 不支持 Cursor 宣称的节省比例具有独立因果有效性 |
| A4 | FOCUS 将 Consumed Quantity、Pricing Quantity、Billed Cost、Effective Cost、Contracted Cost、List Cost 分为不同字段 | 标准事实 | FOCUS v1.3：Cost Comparison、Consumed Quantity、各 Cost columns | 支持消耗、定价与账单不是同一事实 | FOCUS 不规定具体 Agent UI，也不要求采用本文字段名 |
| A5 | OpenAI 官方把组织 usage 与 monetary costs 作为不同 API 资源；usage 可按 project/user 聚合，cost amount 带 currency/value | 接口事实 | OpenAI API Reference：Administration → Usage、Costs | 支持资源量与货币成本分开记录 | 不支持任意 token 都能从该 API 本地准确换算成最终发票 |
| A6 | GitHub 报告用 `quantity` 看消耗、`netAmount` 看计费、`discountAmount` 看包含或折扣 | 接口事实 | Automating usage reporting → Interpret usage and cost fields | 直接支持三层事实模式 | GitHub AI credits 与 Cursor 或 OpenAI 的单位、合同不可互换 |
| A7 | 成本界面至少需要“用了多少、权益吸收多少、还要付多少”三个视图 | Research Center 推断 | A2+A4+A5+A6 综合 | 可作为文章核心判断和产品检查框架 | 不是任何单一来源的原文标准；必须标明是综合结论 |
| A8 | 最小成本事件应保存 usage quantity/unit、entitlement/discount、billable amount/currency、pricing version、model/router mode、scope identity | 工程建议 | A2+A3+A4+A5+A6 综合 | 可作为读者行动清单 | 字段不是跨供应商的强制 schema；实际发票仍需供应商账单校验 |

### 冲突、反例与边界

- 反例一：token 视图对分析缓存命中、输入膨胀和模型行为仍然有用，不能因为它不是账单就删除。
- 反例二：美元视图若把包含额度按公开单价显示为“花费”，会让用户误以为需要额外支付；所以恢复单一美元列也不能解决问题。
- 产品边界：个人、Self-serve Teams、Enterprise 和 Admin API 的可见字段可能不同。文章只描述访问日可核验的公开材料，不声称所有账户一致。
- 账单边界：实时估算、月度累计、发票金额、内部 showback/chargeback 可能有不同结算延迟与修正；界面需要标注数据状态。
- 厂商数据边界：Cursor Router 的 30–50% 或 60% savings 是厂商自报观察/实验，没有独立数据，正文只能作为“厂商报告”并给出范围。

### 未决问题

1. Included usage 在不同套餐中应以货币价值、token、request 还是供应商定义的 credit 表达？
2. 路由模型默认隐藏时，如何在不暴露不必要产品细节的情况下完成成本归因？
3. 退款、修正、预付承诺与月末摊销如何回写逐请求视图？
4. 用户看到的实时估算与最终发票差异多大时需要主动提示？

## 主题 B：大仓库任务需要可审查、非权威的计划

### 深读来源

1. [Cursor — Best practices for coding with agents](https://cursor.com/blog/agent-best-practices)
2. [Cursor Forum — An Idiot's Guide To Bigger Projects](https://forum.cursor.com/t/an-idiots-guide-to-bigger-projects/23646)
3. [Benchmarking and Studying the LLM-based Agent System in End-to-End Software Development](https://arxiv.org/abs/2511.04064)（12 页，完整读取）
4. [AI Agents and Higher-Order Work](https://ssrn.com/abstract=5713646)（2026-05-08 版本，79 页，完整读取方法、数据、主结果、讨论和相关附录）

### E2EDevBench 方法、结果与局限

- 数据集：从 PyPI 筛选 50 个项目，每季度 10 个，覆盖 2024-Q1 至 2025-Q1；平均 19.2 个文件、2011.5 LOC、119.7 个测试。要求文档先由 LLM 生成，再人工复核。
- 评估：原项目测试由独立 Test Migration Agent 迁移；另由 Gemini-2.5-Pro 按每条需求进行三次二元实现判断，三次一致才定性。10 个生成项目、546 条需求与三名计算机专业研究生的人工标注比较，LLM 与人的 pairwise agreement 为 76%–84%，与人工之间的 78%–88% 相近。
- 实验：三种基于统一 SWE-Agent 工具链的顺序工作流——Single、Developer-Tester、Designer-Developer-Tester；底座模型是 Gemini-2.5-Pro 与 Flash；温度 0.2，每任务最多 200 步。
- 结果：最佳单一组合 Developer-Tester + Pro 的需求实现率为 53.50%；按工作流均值，Developer-Tester 为 49.48%，Single 为 45.72%，Designer-Developer-Tester 为 27.71%。
- 失败分析：从 50 个项目、Pro 模型三类工作流中随机抽取 1000 条未实现需求，采用 LLM 预标注、人类修订。根因中 Task Planning 占 55.8%，包括遗漏 27.9%、误解 22.2%、架构设计错误 5.6%；Task Execution 38.6%；Task Verification 5.7%。
- 关键反例：带 Design Agent 的 DDT 表现最差。论文作者的解释是，开发 Agent 把设计文档当作权威计划，优先于原始需求；设计错误因此被忠实传播。这个解释是作者根据轨迹提出的机制假设，不是单独随机化“计划质量”后的因果证明。
- 局限：只有两个 Gemini 模型；50 个 Python/PyPI 从零实现任务，不等同于既有超大仓库中的迁移/重构；三类工作流是顺序 handoff；评估依赖测试迁移 Agent 与 LLM judge；失败分类含人工修订但没有报告完整标注一致性；论文是预印本。

### AI Agents and Higher-Order Work 方法、结果与局限

- 研究身份：Suproteem K. Sarkar，University of Chicago Booth；作者在 2025 年夏季曾作为 Anysphere 访问研究者。部分公司可为保密信息做有限审阅，但作者声明保留编辑权。
- 使用样本：从 1000 家、每家至少 50 名用户的企业中抽样，共 119,960 名匹配到角色、资历和工作年限的用户。消息意图样本来自 399 家企业，时间为 2025-12-22 至 2026-01-19。
- 意图分类：Cursor 服务把消息分为 Write Code、Ask、Plan、Task Automation 等；分类瞬时运行、不保存消息内容。论文没有给出消息意图分类器的人工准确率验证，这是重要测量局限。
- 观察结果：第一条消息中 Plan 的基准率约 4.21%。工作经验增加一个标准差（约 7 年）与 Plan 率增加 0.45 个百分点相关，即相对基准约高 11%；控制 week、role、sector 后相近。该回归 R² 很低，且是相关关系。
- 接受率：在意图样本中，工作经验、Plan rate 与 agent accept rate 正相关；Plan rate 系数约 0.06–0.07，但不能把接受修改等同于代码正确，也不能推断计划导致接受率上升。
- 企业产出：32 家企业、24 eligible/8 baseline、34 周、323,589 次 merge 的 difference-in-differences 估计显示，Agent 全量发布后 eligible 组 weekly merges 相对增长 38.5%，lines edited 增长 48.7%，revert rate 无显著变化，bugfix rate 下降。作者明确指出 merge 价值、长期技术债和更广质量维度未被测量。
- 外部边界：样本是 Cursor 的企业用户和早期采用者；软件具有可测试性和代码规则，不能直接泛化到其他知识工作；经验、任务类型与采用选择仍可能有未观测混杂。

### 事实—主张矩阵

| 编号 | 可写主张 | 身份 | 来源位置 | 可支持范围 | 不可支持范围 / 反证 |
| --- | --- | --- | --- | --- | --- |
| B1 | Cursor Plan Mode 会先研究代码库、提问、生成带文件路径和代码引用的计划，并等待批准 | 产品事实 | Cursor Best Practices → Start with plans | 支持“计划是执行前可审查工件” | 官方建议不是效果实验；文档也明确小任务不一定需要详细计划 |
| B2 | E2EDevBench 最佳组合也只实现约一半需求，失败根因中计划/理解占 55.8% | 研究结果 | E2EDevBench §4.2、§4.3、Table 3、Table 5 | 可在限定样本与实验设置下引用数字 | 不能泛化为所有 coding agent 的统一失败率 |
| B3 | 不合适的设计分解可能显著降低表现；DDT 均值 27.71%，低于 DT 49.48% 和 Single 45.72% | 研究结果 | E2EDevBench Table 3、Conclusion 4 | 支持“有计划不等于好计划” | 不能断言计划本身普遍有害；该 DDT 还改变了角色和 handoff |
| B4 | 作者认为 DDT 失败的重要机制是开发 Agent 把错误设计计划置于原始需求之上 | 来源作者解释 | E2EDevBench §4.2 | 作为替代解释和设计风险 | 不是独立因果识别；正文必须使用“作者推测/归因” |
| B5 | 更有经验的 Cursor 用户第一条消息更常用于计划；+1 SD 经验与 +0.45pp Plan rate 相关 | 观察研究结果 | AI Agents and Higher-Order Work Table 8 | 支持“计划行为与经验相关” | 不能证明计划导致更高产出或正确率；Plan 分类器测量仍有限 |
| B6 | 计划应是原始需求的可审查派生物，而不是新的权威来源 | Research Center 推断 | B1+B2+B3+B4 综合 | 可作为核心原创判断 | 单一来源没有定义本文的计划合同 |
| B7 | 最小计划工件应包含需求映射、代码位置、依赖/风险、验证方法、非目标，并记录批准后的执行偏差 | 工程建议 | B1+B2+B3+B6 综合 | 可作为读者行动模板 | 尚无实验验证该完整字段集合的相对效果；应表述为可测试建议 |

### 冲突、反例与边界

- 关键反例：更复杂的 Designer-Developer-Tester 并未更好，说明“多一个规划 Agent”或“多一份设计文档”不是充分条件。
- 替代解释：DDT 还引入额外 handoff 和上下文压缩，性能下降不一定只来自计划内容。
- 小任务边界：已知位置、低风险、单文件小修复可以直接执行；重计划的协调成本可能超过收益。
- 计划批准边界：人类批准只能证明计划被看过，不自动证明需求完整；应使用逐条映射和验证项降低走过场风险。
- 执行边界：仓库在计划批准后可能变化，计划必须记录基线并允许重新核验；不能把过时计划继续当权威。
- 指标边界：accept rate、merge count、lines edited 都不是独立质量证明。

### 未决问题

1. 需求—计划—测试的双向 traceability 是否能在真实大仓库任务中降低遗漏率？
2. 哪些任务规模或风险阈值值得强制计划门，哪些任务应走轻量路径？
3. 如何自动检测计划遗漏而不再引入一个会共享同样盲点的 LLM judge？
4. 计划批准后仓库基线变化到什么程度必须重新规划？

## 深读门禁结论

- 主题 A：**PASS**。至少三个独立一手证据身份，事实边界清楚，生活化叙事不会牺牲工程可行动性。
- 主题 B：**PASS**。完整论文深读后，原命题被反例修正为“可审查、非权威、保持原始需求可见的计划”；这一版本比单纯倡导 Plan Mode 更强，也更符合证据。
- 第三个主题：**No Selection**。

