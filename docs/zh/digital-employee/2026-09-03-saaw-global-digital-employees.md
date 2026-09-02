---
title: "数字员工与 SaaW（一）：全球样本与能力分级"
date: '2026-09-03'
research_date: '2026-08-30'
prepared_date: '2026-09-03'
column: digital-employee
category: daily
article_type: comparative-study
edition: research-center
research_question: "什么能力足以让一个 AI 产品持续承担限定岗位，全球商业产品和自研系统分别处于哪一级？"
summary: "从自研小典 AI 与 CodeFlowMu 的工程实践出发，建立数字员工的判定框架，比较全球 55 个产品条目的岗位持续性、工具能力与交付边界。"
cover: "/assets/covers/saaw-2026-part-1-cover.png"
language: zh-CN
series: saaw-commercial-landscape-2026
series_part: 1
lifecycle: Published
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/saaw-2026-part-1-cover.png"
  kicker="数字员工 · SaaW 商业全景（一）"
  title="数字员工与 SaaW（一）：全球样本与能力分级"
  summary="从自研小典 AI 与 CodeFlowMu 的工程实践出发，建立数字员工的判定框架，比较全球 55 个产品条目的岗位持续性、工具能力与交付边界。"
  version="SaaW 2026 · 1/3"
  languageHref="/en/digital-employee/2026-09-03-saaw-global-digital-employees"
  languageLabel="English"
/>

<!-- saaw-native-cover-note -->
<p class="saaw-cover-note">题图为 AI 生成的概念场景；屏幕界面与数字仅作示意，不是真实产品截图或研究数据。</p>
<!-- /saaw-native-cover-note -->

# 全球真实数字员工与 SaaW 商业全景报告 2026-1
## 研究方法、全球样本库与区域市场

一个 AI 能按要求查询数据、生成报告，并不意味着它已经能够持续负责一个岗位。后者还要记得哪些工作没有完成，在业务条件变化时继续推进，遇到异常时交接或请求授权，并让人能够检查交付结果。这正是本报告要考察的区别：**一次任务的完成，怎样才能成为持续工作的交付？**

我们在《[从 SaaS 到 SaaW：当代码库开始“自己开发自己”](https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-08-10-saaw-software-as-an-agent-worker)》中，将面向这种交付方式的软件范式称为 **SaaW（Software as an Agent Worker）**。在本文中，它指软件以数字工作主体的形式，在明确的职责、权限和治理规则下持续工作、调用业务工具、交付成果，并接受人类监督与授权。这里沿用的是我们提出的概念定义，不把它作为厂商已经共同采用的认证标准。

## 研究起点：从小典 AI 到 CodeFlowMu

这一问题也来自我们自己的工程实践。**小典 AI 是我们自研的企业 AI 应用**。开发它时，我们遇到两类相互关联的问题：怎样组织 AI 完成需求、开发、部署与验收，以及怎样让企业 AI 在权限和审计约束下进入业务。单个智能体能生成代码或给出答案，尚不能替团队解决任务交接、质量检查和工作责任的问题。

**CodeFlowMu 是我们由此发展出的多智能体协作应用与运行系统，也是这份报告重点对照的自研工程产品。** 它所组织的是一个完成工作的团队：明确角色和任务，让执行者提交报告，让审查者检查交付，并保留人类决策的位置。模型提供推理能力，工具完成具体操作，CodeFlowMu 则集中处理这些能力怎样形成连续的工作过程。

这也解释了我们为什么研究 SaaW。小典 AI 让我们面对“AI 怎样进入企业业务”，CodeFlowMu 让我们进一步追问“怎样组织能够持续交付的 AI 团队”。SaaW 将这些问题放到软件交付层面：用户得到的，究竟是一个需要不断操作的工具，还是一个职责清楚、结果可检查、工作能够接续的数字工作主体？

带着这些问题，我们把视野转向全球商业产品：**哪些能力已经可以买到？哪些产品能够持续承担限定岗位？我们自己的技术路线还有哪些缺口？** 本册先解释判定方法，再比较产品定位、实际交付、收费方式与公开证据。

## 执行摘要

本报告整理此前的全球商业调查、中国专项调查和开源技术研究，主表收录 **55 个产品条目：原有 54 个商业样本，加上 CodeFlowMu 自研工程参照**，另保留 **6 个相邻、待核或未纳入主库的样本**。样本覆盖北美、中国、欧洲、澳大利亚、以色列、印度和日本。

下文的 **D1–D5 是本报告的能力分析框架**：从辅助人类的工具，到独立执行任务的智能体，再到持续承担岗位、具备治理与恢复机制的数字员工。其中 D3 着重考察一次任务能否自主完成，D4 着重考察工作能否跨周期持续，D5 则增加更严格的授权、验收与责任要求。具体条件见 1.3 节。

核心结论不是“数字员工已经成熟”，而是：

1. **自主执行任务已成为多类商业产品的交付内容。** 本库的 D3 样本覆盖理解目标、选择工具并完成业务任务的不同路径。
2. **持续承担岗位需要更多证据。** 稳定职责、任务所有权、跨周期状态和主动工作，不能仅凭一次演示或定时触发认定；包括来也在内的候选产品仍有需要核验的边界。
3. **本库尚未找到充分支持 D5 的公开证据。** 这不等于证明全球不存在相应产品，也不意味着作者自己的系统已达到该等级。
4. **收费单位有助于识别交付边界。** 动作、对话、自动解决量、线索、分钟或业务结果，分别反映产品出售的不同工作单位；收费方式本身不能证明能力等级。
5. **模型与运行系统应分开考察。** 支持更换模型，不等于更换后仍能保持相同的任务完成质量；复杂工作的效果需要结合具体模型、工具和运行环境验证。


# 一、研究方法：先核验能力，再评估等级

## 1.1 入库标准

商业主库至少满足三项：

- 正式商业产品，正在订阅收费、按量收费或明确企业合同销售；
- 能读取真实业务事实、调用工具或业务系统，并产生可验收结果；
- 有官方产品、定价、客户、治理或运行资料可核验。

以下内容不能单独构成数字员工证据：厂商自称“AI 员工”、有聊天窗口、能检索知识库、能自动生成 SQL（数据库查询语句）、能调用一次工具、能执行预先设定的流程。

## 1.2 以自研小典 AI 为例：能力不是岗位，工具调用不是责任

**小典 AI 是我们自研的企业 AI 应用，也是这项研究的工程起点。** 读者也可以通过[网页应用 Demo](https://demo.chedian.cc/)了解它的交互形态。

小典 AI 可以问答、查询数据库、自主生成 SQL、解释结果。它已经明显超过普通助手，但仍不等于数字员工。以下采用作者提供的功能描述，针对本文讨论的查询型应用形态进行分类：

| 判定项 | 小典 AI |
|---|---|
| 理解自然语言问题 | 有 |
| 自主生成 SQL、调用数据库 | 有 |
| 完成一次专业任务 | 有 |
| 持续身份与岗位 | 无或很弱 |
| 自己的任务队列与长期责任 | 无 |
| 跨日继续未完成工作 | 无 |
| 调用时授权、证据化验收 | 依赖外围系统，尚未形成完整岗位责任闭环 |
| 失败恢复、独立审查 | 弱或没有 |
| 严格评级 | **D3 专业智能体，不是数字员工** |

因此，本报告固定采用一句判定原则：

> **会做一件事，不等于拥有一个岗位；能调用工具，不等于承担工作责任。**

## 1.3 五档能力与责任要求

<!-- VISUAL-V4:START -->
![图01：D1–D5能力与责任的分界](/assets/saaw-2026/figures/01_zh.png)

*图 01：分级框架。D4 增加持续岗位责任，D5 进一步要求证据、授权、独立复核与恢复。等级间距不代表能力增幅。 来源：作者根据本文相应章节的分析与文末参考资料整理绘制。*
<!-- VISUAL-V4:END -->

| 等级 | 中文名称 | 必须具备的真实能力 |
|---|---|---|
| D1 | 智能助手 | 问答、生成、检索；人持续主导，系统不独立完成工作 |
| D2 | 大模型增强自动化 | 大模型理解输入，但主要路径由工作流、规则或自动化脚本预先决定 |
| D3 | 自主智能体执行 | 可自主规划、选工具、根据反馈调整并完成一次复杂任务，但缺少长期岗位责任 |
| D4 | 真正数字员工 | 在 D3 基础上有稳定岗位、持续身份、任务所有权、跨周期状态和主动工作能力 |
| D5 | 高可信软件化数字员工 | 在 D4 基础上再具备调用时授权、证据化验收、独立复核、幂等恢复、审计和责任闭环 |

## 1.4 证据等级

- **A：** 官方产品与商业证据充分，价格/客户/能力/治理中至少三类可核验。
- **B：** 正式商业产品成立，但模型、价格或长期责任证据有缺口。
- **C：** 方向相关，不能证明真实数字员工。

## 1.5 产品能力核验：每个候选产品需要回答五个问题

产品名称可以帮助理解定位，评级则需要对应的能力证据。本报告用以下五问组织核验：

1. **谁决定下一步？** 是模型动态规划，还是预设工作流或 RPA（机器人流程自动化）？
2. **真正交付什么？** 是一句回复、一个动作、一个通过测试的代码变更，还是一个可验证业务结果？
3. **模型承担多少责任？** 只做意图识别，还是承担规划、判断、异常处理和长期连续决策？
4. **失败以后怎么办？** 是否有重试、恢复、回滚、升级人工、幂等或正式失败状态？
5. **厂商靠什么收费？** 席位、点数、动作、对话、解决量、岗位容量还是业务结果？

核验时需要避免三种推断：

> **能调用工具 ≠ 数字员工；有多智能体 ≠ 有组织责任；按结果收费 ≠ 已经达到 D5 高可信治理。**

因此，评级看的是“产品的真实闭环”，而不是厂商页面是否出现 Employee、Worker、Agent、Autonomous Workforce 等词。

## 1.6 CodeFlowMu：工程结构与比较边界

对 CodeFlowMu 的介绍需要落到工作结构上。项目公开的历史实现包含 PM（任务规划）、DEV（开发）、OPS（部署与运维）、QA（质量检查）四个执行角色，以及独立观察质量与风险的 EVAL 角色；PC 面板与手机端提供人类查看和审批入口。这些历史实现帮助解释产品思路，不能替代当前版本的功能清单。

| 比较维度 | CodeFlowMu 所关注的工程问题 | 对商业产品需要提出的同一问题 |
|---|---|---|
| 团队分工 | 规划、实现、部署和检查怎样分别承担职责 | 多个智能体是否真正有职责边界，还是只是多个对话入口？ |
| 工作交接 | 任务、报告、问题和审查怎样衔接 | 上一步的产出由谁接收，谁判断能否继续？ |
| 人类监督 | 人怎样查看工作并作出审批决定 | 哪些动作必须等待授权，哪些可以自主执行？ |
| 状态与恢复 | 工作事实怎样跨越模型会话和运行中断保留 | 重启后是否知道谁负责、已经接受了什么、下一步能做什么？ |

这是本报告选择对照维度的工程背景。作者参与 CodeFlowMu 开发，因此同样需要对其区分实现、测试与尚待验证的目标，不能因研究关联而给予更高评级。

其相关概念各有职责：**TMPA（Textual Multi-Agent Process Architecture，文本化多智能体流程架构）**讨论工作事实、责任与治理规则；**FCoP（File-based Coordination Protocol，文件驱动协作协议）**表达基于文件的任务交接、报告与审查；**CodeFlowMu**是采用这些思路的应用与运行系统；**SaaW**描述最终希望交付的软件工作形态。概念、协议、实现与商业范式不能相互替代。

按[当前项目说明](https://github.com/joinwell52-AI/joinwell52/blob/main/README.zh-CN.md)，CodeFlowMu 当前产品线独立闭源开发；CodeFlowMu Open 是冻结在 V1.2.29-open 的历史开源版本，用于复现与研究引用。本文不将历史版当作当前产品，将 CodeFlowMu 明确列入下方总表，作为第 55 项自研工程参照；它与原有 54 个商业样本分开计数，小典 AI 则保留为研究背景，也不把局部规范验证外推为完整的 D5 能力证明。


# 二、全球商业样本与 CodeFlowMu 对照总览

<!-- VISUAL-V4:START -->
![图02：54个商业样本的明细评级](/assets/saaw-2026/figures/02_zh.png)

*图 02：保留的原版评级快照：54 个条目中 D3 36 个、D4 9 个、D2–D3 9 个。图中 D4 是原稿标签，不表示 9 个产品均已充分验证；本次将来也改列 D4 候选，并在主表新增 CodeFlowMu。后者未纳入这张历史分布图。 来源：原报告 2026 年 8 月 30 日的商业样本整理；历史统计口径见本图说明。*

> **统计口径**：原稿摘要的“D2 10、D3 35、D4 9”与明细不符，本次移除该摘要数字。当前表格共 55 项：D3 36 个（含 3 个平台）、D2–D3 9 个、D4 初评 9 个（含新增的 CodeFlowMu）、D4 候选 1 个（来也）。原图的 9 个 D4 与当前 9 个 D4 并非相同成员，不能因数量相同而混用。其余评级沿用原研究，未在本次逐一重新核验。
<!-- VISUAL-V4:END -->


总表包括 **54 个原商业样本与 1 个 CodeFlowMu 自研产品**，不授予任何条目 D5。CodeFlowMu 按同一能力框架评为 **D4（软件工程岗位）**；其当前统一商业报价未核验，因此不把它计作第 55 个已确认收费的商业样本。能力等级与商业收费状态分别判断。平台类产品的客户配置可能从 D1 到 D4 不等，本表评价公开材料所描述的默认或代表性产品形态；这些初评不构成独立认证。


## 北美


| 公司/产品 | 国家/地区 | 产品定位与能力边界 | 真实交付 | 公开模型 | 收费 | 模型费是否分离 | 评级 | 证据 |
|---|---|---|---|---|---|---|---|---|
| **Salesforce**<br>Agentforce | 美国 | 生长在客户关系管理系统中的企业智能体执行层，不是独立员工软件。 | 认证客户、读取订单与客户记录、回答问题、更新业务对象并执行已批准的流程动作。 | 多模型体系；具体组合随客户配置和版本变化，统一型号不公开。 | 每10万灵活点数500美元；约0.10美元/动作；2美元/对话；另有5美元或125美元/用户/月方案。 | 模型成本被点数/固定方案打包，未单独向客户透明拆分。 | D3 | A |
| **Microsoft**<br>Copilot Studio / Microsoft 365 Copilot | 美国 | 企业智能体构建、发布与计量平台；Microsoft 365 Copilot 仍主要是人类助手。 | 在 Microsoft 365、Teams、Power Platform、网站和应用中回答、生成并执行连接器动作。 | GPT 系列为主，部分场景可选模型；也可连接外部服务。 | Microsoft 365 Copilot 30美元/用户/月；Copilot Studio 200美元/2.5万点数/月，支持按量。 | 平台费与点数结合；高阶推理模型可能另有计量，属于部分分离。 | D3 | A |
| **ServiceNow**<br>Autonomous Workforce / AI Specialists | 美国 | 基于企业工作流、身份、配置数据库和治理控制塔的岗位型智能体。 | 跨信息技术、客户关系、员工服务和安全领域完成端到端流程，处理案例、事件和请求。 | Now LLM 与第三方模型并存；官方强调可接任意云、模型和数据源。 | 企业分层产品与合同报价，未公开统一单价。 | 模型和平台成本通常在企业合同中打包，未透明拆分。 | D4 | A |
| **UiPath**<br>Agentic Automation | 美国（罗马尼亚起源） | 智能体、软件机器人和人类共同编排的混合自动化平台。 | 智能体负责模糊判断和规划，机器人负责确定性系统操作，人类负责高风险批准。 | 支持多家基础模型与自带模型；具体部署由客户选择。 | 基础版25美元/月起；企业智能体自动化按销售合同。 | 平台许可、机器人/智能体用量和客户模型可能分开，属于部分分离。 | D3 | A |
| **Workday**<br>Sana Agents / Agent System of Record | 美国（Sana 起源于瑞典） | 人力与财务领域的智能体组合，并用智能体登记系统统一管理身份、技能和权限。 | 获取政策信息、处理员工自助动作、优化业务流程，并与第三方智能体协作。 | 2026年 Gemini 成为 Sana for Workday 默认模型；其他智能体可采用多模型。 | 通过 Workday Flex Credits 购买，具体单价依合同。 | 点数计量工作动作，模型费未完全单列。 | D3 | A |
| **Glean**<br>Glean Agents / Independent Agents | 美国 | 从企业搜索和知识平台发展出的跨系统工作智能体。 | 在企业权限上下文中拥有工作流、主动运行、使用有范围的凭证并在关键决策处请求人工。 | 支持多种前沿模型，客户可按任务选择；具体路由不固定。 | 企业合同报价，公开统一价格未披露。 | 通常与企业平台合同打包，模型费未公开单列。 | D4 | A |
| **Oracle**<br>Fusion Agentic Applications | 美国 | 原生嵌入财务、人力、供应链和客户体验事务系统的成果型智能体应用。 | 由具备角色和决策权限的智能体团队持续推理、共享上下文、执行审批内动作并处理例外。 | 支持 Llama、Cohere、外部行业模型及合作伙伴模型；多模型。 | AI Agent Studio 对 Fusion 客户不额外收费；应用和模型用量随 Fusion/OCI 合同。 | 开发平台与模型/云资源部分分离。 | D4 | A |
| **Google Cloud**<br>Gemini Enterprise Agent Platform | 美国 | 企业级智能体运行、记忆、会话和模型基础设施，不是固定岗位员工。 | 承载客户自建智能体、会话、记忆和工具执行。 | Gemini 系列为主，也可承载客户模型与开源模型。 | 计算、内存、会话/运行与模型令牌分别按资源计费。 | 明确分离。 | D3（平台） | A |
| **HubSpot**<br>Breeze Customer Agent / Prospecting Agent | 美国 | 生长在客户关系管理、营销、销售和客服平台中的成果型垂直智能体。 | Customer Agent 处理并解决客户请求；Prospecting Agent 调研并推荐值得外联的潜在线索。 | 具体生产模型路由未统一公开，能力主要依赖 HubSpot 客户上下文与业务数据。 | 2026-04 起 Customer Agent **0.50美元/成功解决**；Prospecting Agent **1美元/推荐外联线索**，底层 HubSpot 套餐另计。 | 软件订阅与结果费分离；模型成本不单独展示。 | D3 | A |
| **Zendesk**<br>AI Agents / Autonomous Service Workforce | 美国（丹麦起源） | 围绕客户服务“成功解决”构建的垂直智能体与自主客服劳动力体系。 | 读取知识和客户信息，完成对话、流程动作、语音服务，并在无法解决时升级人工。 | 具体模型组合未统一公开。 | 2026-05 起以 **Automated Resolution / Resolution Allowance** 为正式计量体系：只对 AI 成功解决且未升级人工的请求计费，并按解决复杂度分层消耗额度。 | 客服订阅与自动解决额度分离；模型费不单列。 | D3 | A |
| **Intercom**<br>Fin | 美国/爱尔兰 | 按已验证客户结果收费的客服与销售智能体。 | 解决客户问题、执行流程、交接人工，并可完成销售资格判断。 | 模型栈随版本演进，具体路由未完全公开。 | 0.99美元/解决或流程交付；9.99美元/成功销售资格判断，另有席位费。 | 席位与结果费分离，模型费打包。 | D3 | A |
| **Cognition**<br>Devin | 美国 | 可以跨代码库、浏览器、终端、测试和协作工具完成工程任务的软件开发员工。 | 读取任务、调查仓库、改代码、运行测试、修复失败并交付可审查结果。 | 核心 Devin 路由不完全公开；Windsurf/产品生态可用多种前沿模型。 | 免费、20美元/月、200美元/月；团队80美元/月起并按席位/用量；企业按智能体计算单位。 | 模型、计算和软件能力打包进配额/计算单位。 | D4 | A |
| **Sierra**<br>Sierra Agents / Horizon Agents | 美国 | 长期维护客户关系并以结果结算的客户业务智能体。 | 跨聊天、短信、邮件和语音完成客服、账户、留存、销售及跨日/跨周流程。 | 具体基础模型和路由未公开。 | 企业合同按预先定义的业务结果计费。 | 模型费完全包含在结果价中。 | D4 | A |
| **11x**<br>Alice / Julian | 美国/英国 | 面向销售开发和入站响应的岗位型数字劳动力。 | 找潜客、研究、个性化触达、回复、电话/消息响应并同步客户关系管理系统。 | 具体模型未公开。 | Alice Growth 约3,750美元/月、年付起；官方强调按线索量而非发送量。 | 软件、数据和模型成本打包。 | D3 | A |
| **Artisan**<br>Ava | 美国 | 自动外呼获客的销售开发智能体。 | 寻找和丰富联系人、发送个性化触达、处理回复、预约会议并同步客户关系管理系统。 | 具体模型未公开。 | 按每月触达线索量定制企业方案，公开页不列统一金额。 | 打包。 | D3 | A |
| **Decagon**<br>AI Concierge | 美国 | 能调用业务接口完成复杂客服流程的客户运营智能体。 | 跨渠道保持上下文，身份核验、查询、修改、退款/争议处理和人工升级。 | 多模型/自研编排，具体型号未统一公开。 | 企业合同，可按对话或解决量等方式设计；多数价格需销售确认。 | 模型费通常打包。 | D3 | A |
| **Bland AI**<br>Voice AI Agents | 美国 | 面向电话业务的垂直语音执行智能体。 | 实时通话、核验、收款提醒、预约、派单和呼叫流程。 | 自研语音与对话栈；官方称生产通话不依赖外部前沿模型。 | 约0.11–0.14美元/分钟，部分套餐另有月费；语音识别、模型和合成包含在分钟价。 | 完全打包。 | D3 | A |
| **Factory**<br>Droids / Missions | 美国 | 多模型路由、后台和多日任务能力较强的软件工程数字员工。 | 自主拆解目标、并行完成任务、验证结果、在本地或云端恢复和继续。 | 多模型路由，公开支持 Claude、Gemini、Kimi、MiniMax 等，并支持自带密钥/本地模型。 | 个人方案约20/100/200美元/月；企业和更高用量另议。 | 支持自带模型，软件与模型成本可明确分离。 | D4 | A |
| **Harvey**<br>Harvey | 美国 | 面向律师和企业法务的多模型法律工作平台。 | 研究、合同审阅、起草、比较、尽调和复杂法律工作流。 | 公开使用 OpenAI、Anthropic、Google、Mistral 等多家模型。 | 企业合同报价。 | 模型和平台打包。 | D3 | A |
| **Hebbia**<br>Matrix | 美国 | 面向金融、法律和研究的长文档分析智能体工作台。 | 拆解问题、跨大量文件检索和计算、生成矩阵、引用来源并形成分析。 | 多模型体系，具体路由不完全公开。 | 企业年费/合同报价。 | 模型成本通常打包。 | D3 | A |
| **Abridge**<br>Abridge Clinical AI | 美国 | 临床记录和病历生成系统，重点是证据链接和医生复核，不是独立医疗员工。 | 听取医患对话、生成结构化病历、写入电子病历并由医生审核。 | 自研临床模型栈与合作模型，具体路由未完整公开。 | 医疗机构企业合同。 | 打包。 | D2–D3 | A |
| **Norm AI**<br>AI Compliance | 美国 | 把法规与机构政策转成可执行审查流程的合规智能系统。 | 审查营销材料、合同和业务动作，标记违规风险并形成记录。 | 自研合规模型与前沿模型组合，具体型号未完全公开。 | 企业订阅/项目合同。 | 打包。 | D2–D3 | B |
| **Regie.ai**<br>AI Prospecting Agents | 美国 | 销售研究、内容和触达智能体平台。 | 研究联系人、丰富数据、起草触达、拨号和执行销售序列。 | 具体模型未公开。 | 个人专业版约49美元/月加点数；企业版定制。 | 席位与点数结合，模型费打包。 | D3 | A |
| **Ada**<br>Ada AI Agent | 加拿大 | 面向客户服务的自动解决智能体。 | 连接知识和业务系统，完成客户问题并验证相关性、准确性与安全性。 | 自研推理层与多模型，具体型号未统一公开。 | 企业合同，官方更倾向按对话而非按解决计费。 | 模型费打包。 | D3 | A |
| **Cresta**<br>Cresta AI Agent | 美国 | 大型呼叫中心的全渠道自主客服智能体。 | 身份核验、查询账户、完成多步骤动作、跨渠道保持上下文并升级人工。 | 自研并结合客户会话训练的模型层，具体基础模型未统一公开。 | 企业直销，按产品范围、坐席、对话量、渠道和语言定制。 | 打包。 | D3 | A |
| **Writer**<br>AI HQ / Agents | 美国 | 企业内容、知识和业务工作流智能体平台。 | 在企业知识和工具中生成、审阅、执行和编排业务任务。 | 自研 Palmyra 模型为主，也支持多模型集成。 | 团队与企业订阅，具体企业智能体价格按合同。 | 自研模型通常与平台费打包。 | D3 | B |
| **Moveworks（现属 ServiceNow）**<br>Moveworks AI Assistant / Agentic Automation | 美国 | 企业搜索、对话入口和跨系统事务处理平台，已并入 ServiceNow 产品组合。 | 员工请求理解、知识检索、信息技术/人力事务处理和跨应用动作。 | 多模型/自研编排，具体路由未公开。 | 企业合同。 | 打包。 | D3 | B |



## 中国


| 公司/产品 | 国家/地区 | 产品定位与能力边界 | 真实交付 | 公开模型 | 收费 | 模型费是否分离 | 评级 | 证据 |
|---|---|---|---|---|---|---|---|---|
| **来也科技**<br>Laiye Worker / WEP | 中国 | 以个人电脑为工作环境，将 RPA 作为可调用技能的智能体产品与企业平台。 | 接收自然语言目标、自主规划，跨 ERP/财务/人力/客户系统执行；公开场景覆盖财务、人力、法务、运营、市场等岗位。 | 官方公开“模型中立·智能路由”，按任务/预算/时延/合规路由到 **DeepSeek-V4、Qwen3-Max、Kimi K2、豆包2.0 Pro、GLM-5.1** 等。 | Community 免费；Plus **39元/月**；Pro **199元/月**；Enterprise 按需，含单点登录、权限和操作审计。 | 平台订阅与统一积分计量分开；企业私有化可把模型成本进一步转移到客户自有模型。 | D4 候选（岗位持续性待核验） | B |
| **腾讯**<br>WorkBuddy Enterprise | 中国 | 把编码、办公和托管智能体统一到企业底座中的生产级智能体平台。 | 自主拆解研究、文档、表格、开发与定时任务；支持企业智能体托管、统一身份权限、安全审计和私有部署。 | 2026-08 官方列表包括 **Hy3、GLM-5.2/5.1、MiniMax-M3、Kimi-K2.7-Code/K2.6、DeepSeek-V4-Flash/V4-Pro**；并可自定义接入 OpenAI、Anthropic、Gemini 等。 | SaaS 企业旗舰版 **198元/人/月**（1席起，含2,000 Credits/人/月）；专享版 **316元/人/月**（100席起）；私有化版询价。 | 企业可配置自定义模型与私有模型，软件、积分和客户模型成本可部分拆分。 | D3 | A |
| **阿里巴巴 / 钉钉**<br>悟空 | 中国 | 能够操作电脑、浏览器、文件和云应用的企业办公智能体。 | 拆解目标、调用技能、多智能体协作、定时执行并通过手机/钉钉监督。 | 具体模型未公开；高级版支持模型参数配置。 | 个人/企业会员39元或99元/人/月，额外算粒包9.8元起。 | 软件席位和算力点数部分分离。 | D3 | A |
| **字节跳动**<br>豆包工作 | 中国 | 面向电脑知识工作的通用智能体产品，与飞书及豆包模型生态协同。 | 调研、报告、表格、演示文稿、文件处理和跨应用办公。 | 豆包 Seed 系列为主；具体产品路由和版本公开不足。 | 个人订阅+企业席位/用量；正式统一企业价需实时核验。 | 席位和模型用量可能部分分离。 | D3 | B |
| **百度智能云**<br>客悦数字员工 | 中国 | 商品化语言非常完整的咨询、外呼和内容运营数字员工，但核心能力大量依赖知识、技能和流程配置。 | 雇佣、培训、上岗、咨询、留资、外呼、账号托管和成果汇报。 | 文心大模型/百度智能云模型体系。 | 在线套餐与企业询价；公开页面价格可能随活动变化。 | 模型与产品套餐打包。 | D2–D3 | A |
| **智齿科技**<br>Sobot Agents | 中国 | 连接客户联络系统和业务接口的自主客服/外呼智能体。 | 查订单、核身、退款、改地址、语音客服、外呼和结果回写。 | 大模型+检索+工具+标准流程，具体基础模型未公开。 | 企业合同报价。 | 打包。 | D3 | B |
| **Shulex**<br>Solvea AI 客服员工 | 中国 | 面向跨境电商的全渠道客服岗位型智能体。 | 售前推荐、物流售后、排障、退换货和客户接待，并用解决率和回复率验收。 | 具体模型和路由未公开。 | 企业项目/合同，强调效果和量化收益；无统一公开价。 | 模型费打包。 | D3 | A |
| **用友**<br>BIP / yowo 数智员工 | 中国 | 从企业资源管理和业务平台内部生长的财务、人力、供应链和制造智能体。 | 读取企业业务对象、分析、发起流程并在权限内执行。 | YonGPT/用友模型与合作模型；具体岗位路由未公开。 | 企业软件订阅、实施和项目合同。 | 模型费通常并入企业合同。 | D3 | B |
| **金蝶**<br>金蝶 AI 苍穹 / Cosmic Agents | 中国 | 从财务、人力、采购和供应链系统内生的企业管理智能体。 | 招聘、差旅、财务、采购和业务流程编排与执行。 | 金蝶苍穹模型体系与合作模型，具体版本未统一公开。 | 企业软件订阅、实施和方案合同。 | 通常打包。 | D3 | B |
| **滴普科技**<br>DeepWorks / FastAGI | 中国 | 面向企业的智能体运行与岗位化工作平台，强调上下文、技能、权限、审核和审计。 | 数据分析、经营洞察、任务执行、项目目录读写和跨系统工具调用。 | 多模型可配置，FastAGI 作为运行和护栏层；具体默认模型随项目。 | 企业方案和实施报价。 | 模型与平台可按部署部分分离。 | D3 | B |
| **澜舟科技**<br>LangClaw | 中国 | 面向经营分析和增长运营的企业数字员工平台，商业化仍处早期。 | 自主理解、拆解任务、跨系统多步执行、多智能体协作、长期记忆和报告交付。 | 孟子模型体系并支持自定义模型。 | 申请试用/商务合作；公众产品仍处邀测并以积分体验。 | 模型和平台可能部分分离，正式合同未公开。 | D3 | B |
| **实在智能**<br>实在 Agent / 数字员工 | 中国 | 以屏幕语义理解和非侵入式自动化为核心的智能体自动化产品。 | 跨旧系统填报、核验、审批和事务操作，智能体负责理解，自动化负责执行。 | 多模型与自研屏幕语义技术，具体型号未统一公开。 | 企业项目/数字员工工位合同，公开统一价不足。 | 模型和自动化平台通常打包。 | D2–D3 | B |
| **阿里巴巴 1688**<br>AI 数字店长 | 中国 | 生长在批发电商平台中的店铺经营智能体组合。 | 商品优化、客服、营销投放、价格/标题调整和经营建议。 | 通义千问与阿里电商模型体系。 | 平台增值服务+营销消耗，具体套餐随商家方案。 | 平台费和广告/模型消耗部分分离。 | D2–D3 | B |



## 欧洲及其他


| 公司/产品 | 国家/地区 | 产品定位与能力边界 | 真实交付 | 公开模型 | 收费 | 模型费是否分离 | 评级 | 证据 |
|---|---|---|---|---|---|---|---|---|
| **SAP**<br>Joule / Joule Agents | 德国 | 原生嵌入企业资源管理、财务、采购、人力和供应链的业务智能体。 | 读取业务对象、协调多个工具/智能体、执行多步骤流程并在例外处请求人类判断。 | SAP Business AI 多模型体系；具体场景可用不同基础模型。 | Joule Base 随云订阅；高级能力按 AI Units/智能体动作计量。 | 软件订阅和高级智能体用量部分分离。 | D3 | A |
| **causaLens**<br>Digital Worker Factory | 英国 | **一个数字员工就是一个多智能体团队**：多个专业智能体共同拥有完整业务流程，并叠加确定性验证、可信事实和智能体质量门。 | 数据获取、分析、质量检查、输出、规则/因果决策、人工升级与业务系统写入；面向金融、采购、对账等高价值知识流程。 | 官方明确 **模型无关**：Digital Worker 以可移植容器运行在客户选择的任意大模型和基础设施上。 | 企业项目/生产部署合同，公开统一价格未披露。 | 模型与运行体可分离；客户可在自己的模型与基础设施上运行。 | **D4** | **A** |
| **Parloa**<br>AI Agent Management Platform | 德国 | 面向大型客户联络中心的多语言语音智能体平台。 | 保险、航空、零售等场景的身份核验、业务办理、退改和人工升级。 | 自研对话层与多模型，具体型号未统一公开。 | 企业合同，按通话/自动化量等规模设计。 | 模型费通常打包。 | D3 | B |
| **Dust**<br>Dust Agents | 法国 | 跨企业知识、连接器和定时触发器的多模型智能体工作台。 | 研究、运营报告、代码/数据工具调用、多智能体工作流和定时任务。 | 20多种模型，包括 GPT、Claude、Gemini、Mistral、DeepSeek。 | 免费；Pro 24美元/席/月；Max 120美元/席/月；企业定制，按点数。 | 点数打包模型和工作量，不完全分离。 | D3 | A |
| **Mistral AI**<br>Agents API / Enterprise Workflows | 法国 | 持久会话、记忆、定时、多智能体和人工介入的商业智能体基础设施。 | 为客户自建智能体提供运行、工具、恢复和模型服务；本身不是固定岗位员工。 | Mistral 系列模型为主，也支持企业混合部署。 | 按模型令牌/API和企业部署合同。 | 平台与模型调用可清晰计量。 | D3（平台） | A |
| **Relevance AI**<br>AI Workforce | 澳大利亚 | 用于构建销售、客服、研究和运营智能体团队的平台。 | 定时运行、工具调用、升级人工、团队协作和企业集成。 | 多模型并支持自带模型密钥。 | 免费；Pro 19美元/月起；Team 234美元/月起；动作80美元/1000次；模型点数按批发成本。 | 明确分离“智能体动作费”和“模型/工具成本”。 | D3（平台） | A |
| **Torq**<br>Socrates | 以色列/美国 | 安全运营中心的虚拟分析员，具备调查、响应、权限和审计。 | 分析告警、关联上下文、调用安全工具、执行处置并在策略要求时请求批准。 | 具体模型未完全公开；平台统一以 AI Credits 计量。 | 各工作区等级包含点数，可购买额外点数包。 | 模型和智能体动作打包进固定点数。 | D4 | A |
| **Darwinbox**<br>Super Agent | 印度/美国 | 面向人力共享服务、员工事务和管理流程的企业智能体。 | 回答政策、办理人力事务、考勤/离职/跨国流程并升级例外。 | 具体模型未公开。 | 企业合同，通常按员工规模和模块。 | 打包。 | D3 | B |
| **PKSHA Technology**<br>PKSHA AI Agents | 日本 | 从客服、帮助台、销售和人力等场景构建的日本企业智能体产品群。 | 知识问答、多智能体分流、销售对话、匹配和与自动化平台协作。 | 自研自然语言处理/大模型技术与外部模型组合，具体型号未统一公开。 | 企业合同/解决方案销售。 | 打包。 | D2–D3 | A |
| **LayerX**<br>Bakuraku / Ai Workforce | 日本 | 从财务后台软件向“环境式智能体”和业务自动驾驶演进的平台。 | 发票、报销、会计凭证和后台流程自动化；自主规划程度仍需逐产品验证。 | 多模型/自研应用层，具体型号未统一公开。 | 企业软件订阅，按模块和企业规模。 | 模型费通常打包。 | D2–D3 | B |
| **Robin AI**<br>Robin AI | 英国 | 合同审阅、条款抽取和义务追踪的法律智能工作台。 | 按企业规则审阅合同、提出红线修改并跟踪履约义务。 | 合作前沿模型+法律专用层，具体型号随版本。 | 企业合同。 | 打包。 | D2–D3 | B |
| **Juro**<br>Juro AI | 英国 | 人工智能原生合同全生命周期管理平台，更像法律工作软件而非持续员工。 | 起草、审阅、抽取、签署、监控和催办合同。 | 具体模型未统一公开。 | 按合同处理量和企业方案订阅。 | 模型费打包。 | D2–D3 | A |
| **PolyAI**<br>Voice Agents | 英国/美国 | 面向大型电话业务和特定门店的语音客服智能体。 | 自然电话对话、预约、订单/账户服务和业务接口调用。 | 自研 Dialog-RSN-1 等对话模型。 | 企业一般按分钟；特定 OpenTable 方案公开299美元/月/门店。 | 模型和语音成本打包。 | D3 | A |
| **Yellow.ai**<br>AI Agents | 印度/美国 | 覆盖语音、聊天、邮件和短信的全渠道客户服务智能体平台。 | 客户咨询、流程动作、主动通知和多渠道自动解决。 | 多模型平台，具体部署模型未统一公开。 | 免费层500会话/月，之后0.99美元/解决；企业版定制。 | 结果用量与平台方案分离，模型费打包。 | D3 | A |



## 作者自研产品 · 工程参照

| 公司/产品 | 国家/地区 | 产品定位与能力边界 | 真实交付 | 公开模型 | 收费 | 模型费是否分离 | 评级 | 证据 |
|---|---|---|---|---|---|---|---|---|
| **CodeFlowMu**<br>作者自研产品 · 工程参照 | 中国 | 组织多智能体团队完成工作的应用与运行系统；以 TMPA 为治理架构、采用 FCoP 协作协议。当前产品线与历史 CodeFlowMu Open 分开。 | 面向任务分解、角色协作、报告、审查和人类决策；公开历史实现展示开发团队、PC/手机管理界面和工作工件，具体证据须对应版本。 | 模型与运行系统职责分离；本次未核验当前闭源产品的完整模型及接入清单，不以历史版支持范围代替。 | 当前统一商业报价未核验；历史开源版采用 MIT 许可，但不代表当前产品免费或开源。 | 当前产品的合同与计费拆分未核验。 | **D4（软件工程岗位）**：依据公开工程材料初评，见重点档案。 | [公开项目说明与版本证据](https://github.com/joinwell52-AI/joinwell52/blob/main/README.zh-CN.md)；作者工程参照，商业状态单列。 |

# 三、区域市场的产品结构

<!-- VISUAL-V4:START -->
![图03：样本覆盖与原报告区域分组](/assets/saaw-2026/figures/03_zh.png)

*图 03：北美 27、中国 13、欧洲及其他 14。沿用原报告章节归属和原版评级配色；中国组原 D4 条目为本次改列候选的来也。本次新增的 CodeFlowMu 未计入此历史图；当前总表中国条目合计 14 项，其中 CodeFlowMu 在表末单列。数量反映取样覆盖，不反映区域市场规模。 来源：原报告 2026 年 8 月 30 日的商业样本整理；历史统计口径见本图说明。*
<!-- VISUAL-V4:END -->

## 3.1 北美：两条路线并行

第一条是 **原企业软件长出执行者**。Salesforce、Microsoft、ServiceNow、Workday、Oracle、Glean 都已经掌握企业身份、权限、业务对象和采购关系。它们的优势不是“模型更聪明”，而是能让智能体在现有系统里合法读写。

第二条是 **直接出售岗位或结果**。Devin 出售软件工程工作，Sierra 出售客户业务结果，Factory 出售多日工程任务能力，11x/Artisan 出售销售开发产能，Intercom/Zendesk/Decagon 出售自动解决。

北美市场最激进的变化是价格单位：席位不再是唯一计量对象，动作、对话、自动解决、线索、分钟、计算单位和结果都已经成为正式收费单位。

## 3.2 中国：并未抛弃席位，而是形成混合结构

中国市场更准确的价格结构是：

```text
低价席位或员工套餐
        +
算粒 / 点数 / 模型用量
        +
私有化、专有云和实施溢价
```

中国市场的鲜明特点是：

- “雇佣、培训、上岗、数字员工、数智员工”成为前台商品语言；
- 电脑、企业资源管理系统、浏览器、企微、钉钉和飞书共同构成工作场所；
- 私有化、国产模型、数据不出域和信创适配的重要性更高；
- 来也、WorkBuddy、悟空、豆包工作正在争夺通用电脑知识工作者；
- Shulex、智齿、百度客悦则把客服、咨询和外呼岗位商品化；
- 用友、金蝶复制了 Salesforce/SAP 的“原软件内生员工”路线。

## 3.3 欧洲和亚太：法规、数据主权与垂直流程更突出

SAP 与 Oracle 类似，利用企业系统内生业务智能体；德国 Parloa、英国 PolyAI 强调多语言语音服务；法国 Dust、Mistral 更偏多模型工作台和智能体基础设施；以色列 Torq 把安全运营岗位做成有权限、审计和处置能力的虚拟分析员；日本 PKSHA、LayerX 更强调劳动力短缺背景下的客服、后台和流程自动化。


## 3.4 接近持续岗位工作的四种产品路线

<!-- VISUAL-V4:START -->
![图04：9个D4样本的四条产品路线](/assets/saaw-2026/figures/04_zh.png)

*图 04：原版 9 个 D4 条目的四条产品路线，作为定性分类保留。其中来也本次改列待核验候选，图中分组不构成能力认证或竞争排名。 来源：原报告 2026 年 8 月 30 日的商业样本整理；历史统计口径见本图说明。*
<!-- VISUAL-V4:END -->

按产品的工作边界与运行方式，原稿选出的 D4 初评及候选条目大致分为四类：

| 产品路线 | 代表 | 值得关注的机制 | 主要限制 |
|---|---|---|---|
| **岗位边界型** | Devin、Torq | 工作环境、任务对象、工具和完成标准清晰 | 依赖特定专业领域 |
| **长周期结果型** | Sierra | 能跨日/跨周维持客户关系和目标，按结果结算 | 底层模型、证据与恢复公开度较低 |
| **企业系统内生型** | ServiceNow、Glean、Oracle | 拥有企业身份、权限、数据、业务对象和审计底座 | 离开本平台后员工边界减弱 |
| **运行体/工作站型** | Factory、Laiye Worker、causaLens | 多模型、工具调用、验证与角色组织等能力可在运行系统中组合 | 持续任务能力需逐产品验证；来也的长期岗位责任仍待核验 |

这说明“真正数字员工”不会只有一个标准外形。关键不是界面像员工，而是：**是否持续拥有任务、是否能在权限边界中自主推进、是否有明确交付和失败语义。**


# 四、重点产品与自研工程参照档案



## ServiceNow · Autonomous Workforce / AI Specialists


| 字段 | 结论 |
|---|---|
| 实际产品 | 基于企业工作流、身份、配置数据库和治理控制塔的岗位型智能体。 |
| 真实交付 | 跨信息技术、客户关系、员工服务和安全领域完成端到端流程，处理案例、事件和请求。 |
| 底层模型 | Now LLM 与第三方模型并存；官方强调可接任意云、模型和数据源。 |
| 商业收费 | 企业分层产品与合同报价，未公开统一单价。 |
| 模型费分离 | 模型和平台成本通常在企业合同中打包，未透明拆分。 |
| 严格评级 | D4 |
| 判断 | 公开证据同时覆盖岗位范围、业务执行权限、企业治理、身份、审计和端到端流程，因此严格评级可进入 D4。其弱点是能力高度依赖 ServiceNow 既有数据与流程，不能外推为开放知识员工。 |
| 官方来源 | [www.servicenow.com/platform/autonomous-workforce.html](https://www.servicenow.com/platform/autonomous-workforce.html) |



## Glean · Glean Agents / Independent Agents


| 字段 | 结论 |
|---|---|
| 实际产品 | 从企业搜索和知识平台发展出的跨系统工作智能体。 |
| 真实交付 | 在企业权限上下文中拥有工作流、主动运行、使用有范围的凭证并在关键决策处请求人工。 |
| 底层模型 | 支持多种前沿模型，客户可按任务选择；具体路由不固定。 |
| 商业收费 | 企业合同报价，公开统一价格未披露。 |
| 模型费分离 | 通常与企业平台合同打包，模型费未公开单列。 |
| 严格评级 | D4 |
| 判断 | 独立智能体已经出现身份、有范围凭证、主动运行、版本检查点、评测和回滚；这是从企业搜索真正跨入工作主体的重要样本。 |
| 官方来源 | [www.glean.com/ai-agents](https://www.glean.com/ai-agents) |



## Oracle · Fusion Agentic Applications


| 字段 | 结论 |
|---|---|
| 实际产品 | 原生嵌入财务、人力、供应链和客户体验事务系统的成果型智能体应用。 |
| 真实交付 | 由具备角色和决策权限的智能体团队持续推理、共享上下文、执行审批内动作并处理例外。 |
| 底层模型 | 支持 Llama、Cohere、外部行业模型及合作伙伴模型；多模型。 |
| 商业收费 | AI Agent Studio 对 Fusion 客户不额外收费；应用和模型用量随 Fusion/OCI 合同。 |
| 模型费分离 | 开发平台与模型/云资源部分分离。 |
| 严格评级 | D4 |
| 判断 | Fusion Agentic Applications 不只是单智能体，而是带角色、决策权限、共享长期上下文、审批和审计的完整业务应用，因此比普通“智能体工作室”更接近 SaaW。 |
| 官方来源 | [www.oracle.com/cn/news/announcement/oracle-introduces-fusion-agentic-applications-2026-03-24/](https://www.oracle.com/cn/news/announcement/oracle-introduces-fusion-agentic-applications-2026-03-24/) |



## Cognition · Devin


| 字段 | 结论 |
|---|---|
| 实际产品 | 可以跨代码库、浏览器、终端、测试和协作工具完成工程任务的软件开发员工。 |
| 真实交付 | 读取任务、调查仓库、改代码、运行测试、修复失败并交付可审查结果。 |
| 底层模型 | 核心 Devin 路由不完全公开；Windsurf/产品生态可用多种前沿模型。 |
| 商业收费 | 免费、20美元/月、200美元/月；团队80美元/月起并按席位/用量；企业按智能体计算单位。 |
| 模型费分离 | 模型、计算和软件能力打包进配额/计算单位。 |
| 严格评级 | D4 |
| 判断 | Devin 的岗位、工作环境和完成标准清楚，能跨多轮调查、修改、测试和交付；但官方文档也承认大任务应拆分、模糊决策需要用户明确，这说明它是 D4 而非 D5。 |
| 官方来源 | [devin.ai/pricing](https://devin.ai/pricing) |



## Sierra · Sierra Agents / Horizon Agents


| 字段 | 结论 |
|---|---|
| 实际产品 | 长期维护客户关系并以结果结算的客户业务智能体。 |
| 真实交付 | 跨聊天、短信、邮件和语音完成客服、账户、留存、销售及跨日/跨周流程。 |
| 底层模型 | 具体基础模型和路由未公开。 |
| 商业收费 | 企业合同按预先定义的业务结果计费。 |
| 模型费分离 | 模型费完全包含在结果价中。 |
| 严格评级 | D4 |
| 判断 | 跨日/跨周的关系记忆和按结果收费使它成为最强商业 SaaW 样本之一；但底层模型、证据化验收和故障恢复公开度不足，不能评 D5。 |
| 官方来源 | [sierra.ai/blog/outcome-based-pricing-for-ai-agents](https://sierra.ai/blog/outcome-based-pricing-for-ai-agents) |



## Factory · Droids / Missions


| 字段 | 结论 |
|---|---|
| 实际产品 | 多模型路由、后台和多日任务能力较强的软件工程数字员工。 |
| 真实交付 | 自主拆解目标、并行完成任务、验证结果、在本地或云端恢复和继续。 |
| 底层模型 | 多模型路由，公开支持 Claude、Gemini、Kimi、MiniMax 等，并支持自带密钥/本地模型。 |
| 商业收费 | 个人方案约20/100/200美元/月；企业和更高用量另议。 |
| 模型费分离 | 支持自带模型，软件与模型成本可明确分离。 |
| 严格评级 | D4 |
| 判断 | Factory 的关键不只是“多日运行”，而是 **Missions 把大项目拆成新上下文 Worker、共享外置状态、独立 Validator 和 Orchestrator**。Mission 先建立 `validation-contract.md`，再定义 features；每个 Worker 在新上下文里实现，Validator 以黑盒方式验收，失败后由 Orchestrator 创建修复任务。它已经非常接近 PM→DEV→QA 的职责分离，但其核心目标仍是提高软件交付可靠性，而不是建立完整工作治理权力。 |
| 官方来源 | [factory.ai/news/missions-architecture](https://factory.ai/news/missions-architecture) · [docs.factory.ai/missions/overview](https://docs.factory.ai/missions/overview) |


## causaLens · Digital Worker Factory

| 字段 | 结论 |
|---|---|
| 实际产品 | 面向高价值知识流程的多智能体数字员工工厂；官方明确“一个 Digital Worker 是一个负责完整业务流程的多智能体系统”。 |
| 团队结构 | 多个专业智能体分担数据获取、分析、质量检查和输出等环节；业务负责人对流程设计和最终交付负责。 |
| 事实与可靠性 | 提供 Trusted Facts、Structured Decision Claims、因果验证、确定性验证门、Agentic QA、MCP Guardian、智能体记忆和人工介入。 |
| 独立评价 | 除 Trace/Artifact Analysis 外，还使用专门的 Agent-as-a-Judge 检查报告、图表、数据集和模型等产物。 |
| 模型 | 模型无关；可作为容器运行在客户选择的大模型和基础设施上。 |
| 商业收费 | 企业部署/项目合同，统一公开价格未披露。 |
| 严格评级 | **D4** |
| 为什么不是 D5 | 它已经非常接近“可靠数字员工”，但公开材料仍不足以证明跨任务的正式责任账本、独立验收权、幂等副作用回执以及类似 TMPA 的治理事实重建。 |
| 官方来源 | [causalens.com/our-digital-worker-factory](https://causalens.com/our-digital-worker-factory) · [causalens.com/the-reliability-features](https://causalens.com/the-reliability-features) |

这个样本必须被视为 CodeFlowMu 的一级架构对照：它证明了 **“一个数字员工 = 一个多智能体团队 + 独立质量检查 + 确定性事实验证”** 已经进入商业产品，CodeFlowMu 不能再把这些单点描述为独有能力。


## 来也科技 · Laiye Worker / WEP

来也的产品路线由对话式 AI 延伸到 RPA 与智能自动化，再发展出采用模型规划和自动化技能的 Laiye Worker。RPA 主要执行预设的界面或系统操作；新的 Worker 则由智能体理解目标、选择技能并执行。Worker 与企业平台 WEP 也应分别考察，不能把平台的全部功能直接算作一个员工实例已经具备的能力。背景见[官方历史介绍](https://laiye.com/news/post/560.html)及[产品常见问题](https://laiye.com/faq)。

| 字段 | 结论 |
|---|---|
| 实际产品 | 以个人电脑为工作环境、可调用自动化技能的本地数字员工和企业运行平台。 |
| 真实交付 | 接收自然语言目标、自主规划、跨 ERP/财务/人力/客户系统执行并生成交付物。 |
| 底层模型 | 公开支持 DeepSeek、Qwen、GLM、OpenAI；不同页面还列出 Kimi、豆包等路由选择。 |
| 商业收费 | 社区版免费；Plus 39元/月；Pro 199元/月；企业版定制。 |
| 模型费分离 | 多模型路由与平台订阅可部分分离。 |
| 评估结论 | **D4 候选：持续岗位能力待核验** |
| 判断 | 官方资料提供了目标理解、规划与工具执行的 D3 方向证据。RPA 技能、多模型路由、定时运行和 PC 工作环境使其值得继续跟踪，但这些能力不能单独证明长期任务所有权、跨日未结事项接续或中断后的责任连续性。 |
| 官方来源 | [Worker 产品说明](https://laiye.com/product/worker) · [产品常见问题](https://laiye.com/faq) |



## Torq · Socrates


| 字段 | 结论 |
|---|---|
| 实际产品 | 安全运营中心的虚拟分析员，具备调查、响应、权限和审计。 |
| 真实交付 | 分析告警、关联上下文、调用安全工具、执行处置并在策略要求时请求批准。 |
| 底层模型 | 具体模型未完全公开；平台统一以 AI Credits 计量。 |
| 商业收费 | 各工作区等级包含点数，可购买额外点数包。 |
| 模型费分离 | 模型和智能体动作打包进固定点数。 |
| 严格评级 | D4 |
| 判断 | 安全运营具有明确事实源、工具、处置动作、审计和批准；Socrates 可持续调查和响应，因此比一般客服 Agent 更接近受治理岗位。 |
| 官方来源 | [kb.torq.io/en/articles/13223383-ai-pricing-model-monitor-and-track-ai-credit-consumption](https://kb.torq.io/en/articles/13223383-ai-pricing-model-monitor-and-track-ai-credit-consumption) |



## CodeFlowMu · 自研多智能体协作与运行系统

| 字段 | 说明 |
|---|---|
| 产品定位 | 多智能体协作应用与运行系统；关注团队怎样完成并交付工作。 |
| 与小典 AI 的关系 | 小典 AI 是自研企业 AI 应用和工程问题来源；CodeFlowMu 从开发协作这条路径发展而来。两者不是同一产品的两个名称。 |
| 与 SaaW 的关系 | SaaW 是将软件交付为数字工作主体的范式；CodeFlowMu 是我们的实践载体。产品实现需要逐项验证，不能由范式定义反推已经达成。 |
| 工作组织 | 公开历史实现采用 PM / DEV / OPS / QA 四个执行角色，EVAL 独立观察；用任务、报告、问题与审查记录组织交接。 |
| 人类入口 | 公开历史实现包含 PC 管理面板、手机网页应用与人工审批入口。 |
| 架构与协议 | TMPA 定义工作事实与治理语义；FCoP 承载文件式协作；CodeFlowMu 负责应用和运行组织。 |
| 当前产品与历史版 | 当前 CodeFlowMu 独立闭源开发；CodeFlowMu Open 于 2026-08-22 冻结在 V1.2.29-open，保留用于历史复现。 |
| 已公开证据的边界 | 项目提供历史产品资料及特定版本的规范实施案例；作者运行的符合性结果不等于独立认证，也不能直接外推至当前版本的所有岗位。 |
| 收费与模型成本 | 本次未取得当前产品统一报价及合同拆分依据，暂不填写价格或软件与模型费分离结论。 |
| 本报告评级 | **D4：限定软件工程岗位的数字员工系统。** 依据公开开发协作案例与 I1.0 中 CodeFlowMu V1.8.0 的治理实现证据综合初评；不将不同版本的证据拼成对当前全部功能的保证。 |
| 公开来源 | [项目中文介绍](https://github.com/joinwell52-AI/joinwell52/blob/main/README.zh-CN.md) · [SaaW 范式文章](https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-08-10-saaw-software-as-an-agent-worker) · [历史开源仓库](https://github.com/joinwell52-AI/CodeFlowMu-open) |

| 判定项 | CodeFlowMu 的依据与判断 |
|---|---|
| 自主完成工程任务 | 公开开发案例描述从目标、任务拆解到实现、测试与报告的交付链，支持任务执行能力。 |
| 稳定角色与岗位 | 有 PM、DEV、OPS、QA 等固定职责，角色承担不同的执行与接受责任。 |
| 任务所有权 | 任务具有发送者、接收者、父子关系、范围与验收条件，不只依赖会话中的临时口头分工。 |
| 跨周期工作状态 | 任务、报告、问题和审查保存在模型会话之外；I1.0 的 C06、C11、C13 分别提供固定输入下的状态保留、重建与恢复证据。 |
| 主动推进与工作接续 | 公开协作路径由 PM 在接单后组织派工、依赖、审查与返工；这是授权任务内的持续推进，不要求系统自行决定企业目标。 |
| 审查与人类监督 | 有执行和质量检查的角色分离；I1.0 的 C07 提供特定输入下的职责分离与人工批准授权证据。 |
| 综合结论 | **D4（软件工程岗位）**。这是对上述产品形态的研究判断，范围限于所引用的工程材料。 |

依据见[公开开发协作案例](https://joinwell52-ai.github.io/joinwell52/zh/digital-employee/2026-08-18-cursor-ai-development-team)与[实施案例 I1.0 的产品结果](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/zh/publications/implementation-case-i1.0/part-02.md)。本次核对的是已发布材料，未重新运行产品；其中的治理 Reader 测试不能单独证明任意真实业务都能跨日无人值守完成。

CodeFlowMu 仍在总表最后单列为自研产品，不混入原有商业样本的收费统计。

# 五、不是 D4 但必须长期对标的架构型样本

有些产品严格评级仍是 D3，却会直接影响数字员工架构判断，不能因为未进入 D4 就忽略：

- **Relevance AI**：Manager/专业智能体之间可以通过边进行委派和任务交接；每条边可设“自动执行、必须批准、由智能体判断”，Task View 保留任务时间线、批准、失败和人工升级。它证明“经理智能体 + 多智能体团队 + 人工批准”已经平台化。
- **SAP Joule Assistants**：Assistant 先理解岗位和业务上下文，再协调多个专业 Joule Agents。官方例子中 Financial Closing Assistant 协调 6 个智能体，Logistics Assistant 协调 11 个智能体。这是“一个岗位入口背后是一支专业智能体团队”的强企业样本。
- **ServiceNow**：更接近智能体治理与诊断控制塔。其 2026 评价指标已经细化到任务完整度、工具调用正确性、工具选择准确率等 Trace/Span 级指标。
- **Glean**：请求级权限检查和 alignment model 对每个动作进行范围校验，说明“运行中治理”开始从日志升级成动作级监督。

这些样本共同说明：

> **多智能体、经理、验证者、工具权限、运行评测都已存在。真正稀缺的是把这些能力变成同一个“工作责任闭环”。**

# 六、重要相邻与被剔除样本

这些对象仍值得观察，但不能用来证明“真正数字员工已经商业化”。


| 地区 | 候选 | 为什么不能直接入主库 | 当前处理 | 来源 |
|---|---|---|---|---|
| 中国 | 循环智能 Recurrent AI | 当前公开产品更偏销售/客服会话智能与人员增强；尚不足以证明独立持续电销员工。 | D2–D3 相邻样本 | [www.rcrai.com/](https://www.rcrai.com/) |
| 中国 | 智谱 AutoGLM 商业方案 | 跨界面操作能力强，但具体企业收费、长期岗位和治理证据不足。 | D3 技术候选 | [www.zhipuai.cn/](https://www.zhipuai.cn/) |
| 中国 | 秘塔 AI 搜索 | 强搜索与研究工具；缺少持续身份、任务所有权和主动工作证据。 | D1–D2 | [metaso.cn/](https://metaso.cn/) |
| 中国 | 句子互动 Sentence.im | 私域对话与销售方向相关，但岗位年租、GMV 分成和自治比例需进一步官方证据。 | 待核验 | [sentence.im/](https://sentence.im/) |
| 中国 | ChatDev / 面壁智能 | ChatDev 是研究/开源项目，不能直接当作面壁商业数字员工收费产品。 | 不纳入商业主库 | [github.com/OpenBMB/ChatDev](https://github.com/OpenBMB/ChatDev) |
| 全球 | DeepSeek 生态方案商 | 不是单一法律主体或产品，无法统一核验能力、客户和收费。 | 不纳入公司样本 | [www.deepseek.com/](https://www.deepseek.com/) |


# 七、本册结论

从本库材料看，自主完成一次任务已有多种商业实现；向持续岗位工作发展的产品，可从四类路线继续观察：

1. **岗位边界清楚的垂直工作**：软件开发、安全运营等；
2. **拥有企业事实和权限的事务系统**：ServiceNow、Oracle、Glean 等；
3. **跨周期客户关系与结果交付**：Sierra 等，需进一步核验长期状态和失败处理；
4. **组织模型、工具与任务的工作运行系统**：Factory、causaLens，以及持续岗位能力仍待核验的 Laiye Worker。

但 D4 仍不代表高可信。本报告尚未取得足够公开证据，证明某个样本同时满足结论级证据、独立复核、外部副作用幂等、恢复后的责任连续性和调用级授权，因此暂不授予任何产品 D5。

对 CodeFlowMu 而言，这项比较的价值在于明确工程取舍：多智能体分工、持久状态、工具权限和结果检查已经存在于多类产品中；接下来需要检验的是，它们能否在具体岗位中共同形成可检查、可接续的工作过程。小典 AI 提供问题的起点，CodeFlowMu 是我们的实践载体，SaaW 则描述我们希望交付的工作形态。三者的关系应当说明清楚，能力结论则分别接受证据检验。

本次编辑保留商业样本表与四张原版图表，补充作者项目的公开背景，并修订来也的结论；未对全部产品作统一版本实测。厂商材料、作者工程记录与能力推断的证明范围不同，尤其不能将作者运行的局部测试当作独立产品认证。[本次编辑说明](https://github.com/joinwell52-AI/joinwell52/blob/main/research/manual-runs/2026-09-03-saaw-three-articles/editorial-scope.md)

下一册将进一步分析：**底层模型为什么直接决定员工能力上限、商业产品怎样控制幻觉、收费是否把软件与模型成本分离，以及五档能力的最终统计。**

# 八、官方资料索引

以下链接用于核验主库中的产品、定价、治理或商业交付。部分企业只公开企业销售入口，未公开统一价格；报告对此保持“未公开”，不以二手资料补齐。

本次新增的作者项目与概念来源：[SaaW 范式文章](https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-08-10-saaw-software-as-an-agent-worker)、[CodeFlowMu 与小典 AI 工程背景](https://github.com/joinwell52-AI/joinwell52/blob/main/README.zh-CN.md)、[小典 AI Demo](https://demo.chedian.cc/)。

| 样本 | 官方资料 |
|---|---|
| Salesforce Agentforce | [www.salesforce.com/agentforce/pricing/](https://www.salesforce.com/agentforce/pricing/) |
| Microsoft Copilot Studio | [www.microsoft.com/en-us/microsoft-365-copilot/pricing/copilot-studio](https://www.microsoft.com/en-us/microsoft-365-copilot/pricing/copilot-studio) |
| ServiceNow Autonomous Workforce | [www.servicenow.com/platform/autonomous-workforce.html](https://www.servicenow.com/platform/autonomous-workforce.html) |
| UiPath Agentic Automation | [www.uipath.com/platform/agentic-automation](https://www.uipath.com/platform/agentic-automation) |
| Workday Agent System of Record / Agent Passport | [newsroom.workday.com/2026-06-02-Workday-Launches-Agent-Passport-to-Test%2C-Verify%2C-and-Continuously-Monitor-Every-AI-Agent-in-the-Enterprise](https://newsroom.workday.com/2026-06-02-Workday-Launches-Agent-Passport-to-Test%2C-Verify%2C-and-Continuously-Monitor-Every-AI-Agent-in-the-Enterprise) |
| Glean Agents | [www.glean.com/ai-agents](https://www.glean.com/ai-agents) |
| Oracle Fusion Agentic Applications | [www.oracle.com/sg/news/announcement/oracle-introduces-fusion-agentic-applications-for-finance-and-supply-chain-2026-04-09/](https://www.oracle.com/sg/news/announcement/oracle-introduces-fusion-agentic-applications-for-finance-and-supply-chain-2026-04-09/) |
| Google Gemini Enterprise Agent Platform pricing | [cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing) |
| HubSpot Breeze Customer Agent | [ir.hubspot.com/news-releases/news-release-details/hubspot-credits](https://ir.hubspot.com/news-releases/news-release-details/hubspot-credits) |
| Zendesk AI Agents | [www.zendesk.com/sg/service/ai/](https://www.zendesk.com/sg/service/ai/) |
| Intercom Fin | [www.intercom.com/pricing](https://www.intercom.com/pricing) |
| Cognition Devin | [devin.ai/pricing](https://devin.ai/pricing) |
| Sierra | [sierra.ai/blog/outcome-based-pricing-for-ai-agents](https://sierra.ai/blog/outcome-based-pricing-for-ai-agents) |
| 11x Alice | [www.11x.ai/products/alice/pricing](https://www.11x.ai/products/alice/pricing) |
| Artisan Ava | [www.artisan.co/ai-sales-agent](https://www.artisan.co/ai-sales-agent) |
| Decagon | [decagon.ai/blog/pricing-ai-agents](https://decagon.ai/blog/pricing-ai-agents) |
| Bland AI | [www.bland.ai/pricing](https://www.bland.ai/pricing) |
| Factory Droids | [www.factory.ai/](https://www.factory.ai/) |
| Harvey | [www.harvey.ai/](https://www.harvey.ai/) |
| Hebbia Matrix | [www.hebbia.ai/](https://www.hebbia.ai/) |
| Abridge | [www.abridge.com/](https://www.abridge.com/) |
| Norm AI | [www.norm.ai/](https://www.norm.ai/) |
| Regie.ai | [www.regie.ai/pricing](https://www.regie.ai/pricing) |
| Ada | [www.ada.cx/](https://www.ada.cx/) |
| Cresta AI Agent | [cresta.com/ai-agent](https://cresta.com/ai-agent) |
| Writer Agents | [support.writer.com/articles/3099016123-what-is-writer](https://support.writer.com/articles/3099016123-what-is-writer) |
| Moveworks | [www.moveworks.com/us/en/platform](https://www.moveworks.com/us/en/platform) |
| 来也 Laiye Worker | [laiye.com/product/worker](https://laiye.com/product/worker) |
| 腾讯 WorkBuddy | [cloud.tencent.com/document/product/1831/134333](https://cloud.tencent.com/document/product/1831/134333) |
| 钉钉悟空 | [wukong.dingtalk.com/docs/enterprise-membership/purchase-guide/](https://wukong.dingtalk.com/docs/enterprise-membership/purchase-guide/) |
| 豆包工作 | [www.doubao.com/work](https://www.doubao.com/work) |
| 百度智能云客悦数字员工 | [cloud.baidu.com/product-s/keyue_home/digital-employees](https://cloud.baidu.com/product-s/keyue_home/digital-employees) |
| 智齿 Agents | [www.zhichi.com/agents/](https://www.zhichi.com/agents/) |
| Shulex Solvea | [solvea.shulex.com/](https://solvea.shulex.com/) |
| 用友 BIP 数智员工 | [www.yonyou.com/news/3768](https://www.yonyou.com/news/3768) |
| 金蝶 AI 苍穹 / Cosmic | [www.kingdee.com/sg/zh-hans/product/cosmic-ai/](https://www.kingdee.com/sg/zh-hans/product/cosmic-ai/) |
| 滴普 DeepWorks / FastAGI | [deepworks.deepexi.com/deepworks-docs/](https://deepworks.deepexi.com/deepworks-docs/) |
| 澜舟 LangClaw | [www.langboat.com/document/enterprise/langclaw/guide](https://www.langboat.com/document/enterprise/langclaw/guide) |
| 实在智能 / 实在 Agent | [www.ai-indeed.com/about](https://www.ai-indeed.com/about) |
| 1688 | [www.1688.com/](https://www.1688.com/) |
| SAP Joule Agents | [www.sap.com/products/artificial-intelligence/ai-agents.html](https://www.sap.com/products/artificial-intelligence/ai-agents.html) |
| Parloa | [www.parloa.com/](https://www.parloa.com/) |
| Dust | [dust.tt/](https://dust.tt/) |
| Mistral Agents API | [mistral.ai/news/agents-api/](https://mistral.ai/news/agents-api/) |
| Relevance AI pricing | [relevanceai.com/pricing](https://relevanceai.com/pricing) |
| Torq Socrates / AI pricing | [kb.torq.io/en/articles/13223383-ai-pricing-model-monitor-and-track-ai-credit-consumption](https://kb.torq.io/en/articles/13223383-ai-pricing-model-monitor-and-track-ai-credit-consumption) |
| Darwinbox | [darwinbox.com/](https://darwinbox.com/) |
| PKSHA Technology | [www.pkshatech.com/en/](https://www.pkshatech.com/en/) |
| LayerX / Bakuraku | [bakuraku.jp/](https://bakuraku.jp/) |
| Robin AI | [www.robinai.com/](https://www.robinai.com/) |
| Juro | [juro.com/](https://juro.com/) |
| PolyAI | [poly.ai/](https://poly.ai/) |
| Yellow.ai | [yellow.ai/](https://yellow.ai/) |



## 本版新增核验来源

| 资料 | 链接 |
|---|---|
| causaLens Digital Worker Factory | [causalens.com/our-digital-worker-factory](https://causalens.com/our-digital-worker-factory) |
| causaLens Reliability | [causalens.com/the-reliability-features](https://causalens.com/the-reliability-features) |
| Factory Missions Architecture | [factory.ai/news/missions-architecture](https://factory.ai/news/missions-architecture) |
| Relevance AI Workforce Task View | [relevanceai.com/docs/build/workforces/workforce-features/workforce-task-view](https://relevanceai.com/docs/build/workforces/workforce-features/workforce-task-view) |
| SAP Joule Agents | [learning.sap.com/courses/introducing-joule/getting-to-know-joule-agents_f9d18ca0-1021-4c1a-a044-4c00ec8c2898](https://learning.sap.com/courses/introducing-joule/getting-to-know-joule-agents_f9d18ca0-1021-4c1a-a044-4c00ec8c2898) |
| WorkBuddy 模型配置 | [cloud.tencent.com/document/product/1831/134445](https://cloud.tencent.com/document/product/1831/134445) |
| WorkBuddy 计费 | [cloud.tencent.com/document/product/1831/134333](https://cloud.tencent.com/document/product/1831/134333) |
| HubSpot outcome pricing | [www.hubspot.com/company-news/hubspots-customer-agent-and-prospecting-agent-now-you-pay-when-the-task-is-complete](https://www.hubspot.com/company-news/hubspots-customer-agent-and-prospecting-agent-now-you-pay-when-the-task-is-complete) |
| Zendesk automated resolution tiers | [support.zendesk.com/hc/en-us/articles/9570369117338-About-automated-resolution-tiers](https://support.zendesk.com/hc/en-us/articles/9570369117338-About-automated-resolution-tiers) |
