---
title: "数字员工与 SaaW（二）：模型、治理与收费"
date: '2026-09-03'
research_date: '2026-08-30'
prepared_date: '2026-09-03'
column: industry-architecture
category: daily
article_type: comparative-study
edition: research-center
research_question: "模型能力如何转化为可检查的岗位交付，治理约束和收费单位应如何对应？"
summary: "区分模型能力与系统交付可靠性，分析数字员工的证据、权限、恢复、收费结构和岗位准入条件。"
cover: "/assets/covers/saaw-2026-part-2-cover.png"
language: zh-CN
series: saaw-commercial-landscape-2026
series_part: 2
lifecycle: Published
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/saaw-2026-part-2-cover.png"
  kicker="行业架构 · SaaW 商业全景（二）"
  title="数字员工与 SaaW（二）：模型、治理与收费"
  summary="区分模型能力与系统交付可靠性，分析数字员工的证据、权限、恢复、收费结构和岗位准入条件。"
  version="SaaW 2026 · 2/3"
  languageHref="/en/industry/2026-09-03-saaw-models-governance-pricing"
  languageLabel="English"
/>

<!-- saaw-native-cover-note -->
<p class="saaw-cover-note">题图为 AI 生成的概念场景；屏幕界面与数字仅作示意，不是真实产品截图或研究数据。</p>
<!-- /saaw-native-cover-note -->

# 全球真实数字员工与 SaaW 商业全景报告 2026-2
## 底层模型、治理、收费与能力分级

同样是“能写报告、能改代码、能处理业务”，产品交付的质量、失败后的处理方式和最终账单却可能不同。要判断一个数字员工能否上岗，只看功能列表还不够，还要看模型如何决策、运行系统如何约束动作，以及结果由谁验收。

本册沿用我们提出的 **SaaW（Software as an Agent Worker）** 概念：软件在明确的职责、权限和治理规则下，作为数字工作主体持续交付成果。概念出处见《[从 SaaS 到 SaaW：当代码库开始“自己开发自己”](https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-08-10-saaw-software-as-an-agent-worker)》。第一册比较产品与岗位能力，本册进一步回答四个问题：**哪个模型在做决策？模型出错怎样被限制？软件费与模型费是否分离？这些能力如何支持 D1–D5 分级？**

# 一、模型不是可互换的处理器

在短文本生成、单函数编写和简单客服中，不同头部模型的差距可能被业务事实源和固定工具掩盖；在复杂编程、开放研究、跨系统长任务中，差距会被连续决策放大。

项目方此前在模型实测中曾遇到严重的无依据编造。这类经验不能用来永久否定某一模型的新版本，但它提醒我们：

> **数字员工不能因为“支持某模型”就自动获得岗位准入；历史上出现严重编造的组合，必须重新通过真实岗位评测。**

同一个模型放在普通聊天框、代码代理、带终端/测试/检查点的运行体中，表现也完全不同。因此真正需要评价的是：

```text
模型
+
运行体
+
工具与事实源
+
上下文压缩和记忆
+
权限与恢复
=
员工配置
```


## 1.1 代表性产品的模型透明度

这里的透明度评价的是模型选择与路由信息的披露程度，不是模型质量或岗位能力。CodeFlowMu 是我们自研的多智能体协作与运行系统，与其他产品一起比较，并在表末列出。

分级沿用第一册：D1 是助手，D2 是以预设流程为主的自动化，D3 能自主完成任务，D4 能持续承担限定岗位，D5 进一步要求更完整的授权、验收与恢复能力。

| 产品 | 公开模型/路由 | 透明度 | 模型费分离 | 评级 |
|---|---|---|---|---|
| Salesforce / Agentforce | 多模型体系；具体组合随客户配置和版本变化，统一型号不公开。 | 中 | 模型成本被点数/固定方案打包，未单独向客户透明拆分。 | D3 |
| Microsoft / Copilot Studio / Microsoft 365 Copilot | GPT 系列为主，部分场景可选模型；也可连接外部服务。 | 中 | 平台费与点数结合；高阶推理模型可能另有计量，属于部分分离。 | D3 |
| ServiceNow / Autonomous Workforce / AI Specialists | Now LLM 与第三方模型并存；官方强调可接任意云、模型和数据源。 | 中 | 模型和平台成本通常在企业合同中打包，未透明拆分。 | D4 |
| Workday / Sana Agents / Agent System of Record | 2026年 Gemini 成为 Sana for Workday 默认模型；其他智能体可采用多模型。 | 高 | 点数计量工作动作，模型费未完全单列。 | D3 |
| Glean / Glean Agents / Independent Agents | 支持多种前沿模型，客户可按任务选择；具体路由不固定。 | 中 | 通常与企业平台合同打包，模型费未公开单列。 | D4 |
| Oracle / Fusion Agentic Applications | 支持 Llama、Cohere、外部行业模型及合作伙伴模型；多模型。 | 高 | 开发平台与模型/云资源部分分离。 | D4 |
| Google Cloud / Gemini Enterprise Agent Platform | Gemini 系列为主，也可承载客户模型与开源模型。 | 中 | 明确分离。 | D3（平台） |
| Cognition / Devin | 核心 Devin 路由不完全公开；Windsurf/产品生态可用多种前沿模型。 | 中 | 模型、计算和软件能力打包进配额/计算单位。 | D4 |
| Sierra / Sierra Agents / Horizon Agents | 具体基础模型和路由未公开。 | 低 | 模型费完全包含在结果价中。 | D4 |
| Factory / Droids / Missions | 多模型路由，公开支持 Claude、Gemini、Kimi、MiniMax 等，并支持自带密钥/本地模型。 | 高 | 支持自带模型，软件与模型成本可明确分离。 | D4 |
| Harvey / Harvey | 公开使用 OpenAI、Anthropic、Google、Mistral 等多家模型。 | 中 | 模型和平台打包。 | D3 |
| Bland AI / Voice AI Agents | 自研语音与对话栈；官方称生产通话不依赖外部前沿模型。 | 中 | 完全打包。 | D3 |
| 来也科技 / Laiye Worker / WEP | 官方模型中立路由公开列出 DeepSeek-V4、Qwen3-Max、Kimi K2、豆包2.0 Pro、GLM-5.1，并按任务类型、预算/时延和合规选择模型。 | **很高** | 平台订阅、积分与企业自有/私有模型可以部分分离。 | D4 候选（持续岗位能力待核验） |
| 腾讯 / WorkBuddy | 官方 2026-08 列出 Hy3、GLM-5.2/5.1、MiniMax-M3、Kimi-K2.7-Code/K2.6、DeepSeek-V4-Flash/V4-Pro；并支持自定义 OpenAI、Anthropic、Gemini 等。 | **很高** | 企业模型、自定义模型和私有部署使模型成本可以与软件许可分离。 | D3 |
| 阿里巴巴 / 钉钉 / 悟空 | 具体模型未公开；高级版支持模型参数配置。 | 低 | 软件席位和算力点数部分分离。 | D3 |
| 百度智能云 / 客悦数字员工 | 文心大模型/百度智能云模型体系。 | 高 | 模型与产品套餐打包。 | D2–D3 |
| 滴普科技 / DeepWorks / FastAGI | 多模型可配置，FastAGI 作为运行和护栏层；具体默认模型随项目。 | 中 | 模型与平台可按部署部分分离。 | D3 |
| 澜舟科技 / LangClaw | 孟子模型体系并支持自定义模型。 | 中 | 模型和平台可能部分分离，正式合同未公开。 | D3 |
| SAP / Joule / Joule Agents | SAP Business AI 多模型体系；具体场景可用不同基础模型。 | 中 | 软件订阅和高级智能体用量部分分离。 | D3 |
| Dust / Dust Agents | 20多种模型，包括 GPT、Claude、Gemini、Mistral、DeepSeek。 | 高 | 点数打包模型和工作量，不完全分离。 | D3 |
| Mistral AI / Agents API / Enterprise Workflows | Mistral 系列模型为主，也支持企业混合部署。 | 高 | 平台与模型调用可清晰计量。 | D3（平台） |
| Relevance AI / AI Workforce | 多模型并支持自带模型密钥。 | 中 | 明确分离“智能体动作费”和“模型/工具成本”。 | D3（平台） |
| Torq / Socrates | 具体模型未完全公开；平台统一以 AI Credits 计量。 | 中 | 模型和智能体动作打包进固定点数。 | D4 |
| causaLens / Digital Worker Factory | 官方明确模型无关，可部署到客户选择的任意大模型和基础设施；产品价值集中在多智能体工作流、可信事实、因果验证和确定性质量门。 | 高（模型策略透明，具体默认模型不绑定） | 模型与运行体可分离，由客户基础设施承担模型成本。 | D4 |
| CodeFlowMu / 自研产品 | 模型承担推理，运行系统组织团队协作与工作状态；当前产品的完整模型及路由清单未核验。 | 架构职责公开，当前配置清单未统一披露 | 当前商业报价与模型费用拆分未核验。 | **D4（软件工程岗位）** |


## 1.2 四种模型商业结构

<!-- VISUAL-V4:START -->
![图05：四种软件费与模型费的关系](/assets/saaw-2026/figures/05_zh.png)

*图 05：费用结构示意；模块宽度不编码金额，不同企业部署可能采用多种模式。 来源：作者根据本文相应章节的分析与文末参考资料整理绘制。*
<!-- VISUAL-V4:END -->

| 模式 | 含义 | 代表 |
|---|---|---|
| 完全打包 | 客户只为分钟、对话、结果或套餐付钱，不看到模型成本 | Sierra、Bland、Intercom、Shulex |
| 席位 + 点数 | 软件席位和智能体工作量分开，但模型仍被点数打包 | Microsoft、WorkBuddy、悟空、Salesforce |
| 平台动作 + 模型成本 | 智能体做工作的费用与模型/工具费用单独计量 | Relevance AI、Google Agent Platform |
| 自带模型 | 客户自带密钥、私有模型或本地模型；模型成本可由客户另行承担，平台是否仍收动作或运行费用取决于方案 | Factory、Relevance AI、WorkBuddy 企业自定义模型、部分 UiPath/Laiye 部署 |

Relevance AI 提供了一个清楚的例子：**动作费对应智能体执行，模型点数对应模型与工具成本；其文档说明可按供应商成本计量，并允许客户自带密钥。** 对 CodeFlowMu 而言，软件价值与模型成本分开说明，是值得采用的商业设计；具体收费方式仍需以实际方案为准。

## 1.3 真实编程为什么最能放大模型差距

“模型会不会写代码”已经不是有意义的问题。真正的数字开发员工需要长期维持：

- 仓库结构和架构约束；
- 多文件一致性；
- 测试、构建、依赖和持续集成状态；
- 用户明确的禁止项；
- 失败原因与上一轮修复；
- Git/worktree/分支状态；
- 任务完成标准和证据。

因此，单函数生成和真实仓库工程是两个完全不同的难度层级：

| 工程任务 | 模型差距表现 |
|---|---|
| 写一个函数、解释报错 | 头部模型差距可能不大 |
| 修改多个文件并保持兼容 | 全局一致性差距开始明显 |
| 测试失败→定位→修复→再测 | 恢复和因果判断能力明显拉开 |
| 大规模重构/迁移 | 弱模型容易“局部正确、整体破坏” |
| 多小时无人值守任务 | 长期漂移、遗忘约束、重复副作用成为主要问题 |

Factory Missions 的架构提供了一种工程解法：把验收约定、功能清单、研究笔记和运行规则保存为共享工作文件；每个 Worker（执行者）使用新上下文，再由 Validator（验证者）检查结果，Orchestrator（编排者）据此组织后续任务或返工。

Cognition 也已经把模型成本与真实工程 rollout 放在一起比较。2026-08，Devin Desktop/CLI 已公开提供 GPT-5.6 Sol，并用 FrontierCode 一类真实代码任务比较“评分—成本”而不是只看模型发布榜单。

因此，本报告采用一个更严格的判断：

> **数字员工的能力由模型、运行系统、工具与事实源、状态与恢复、治理机制共同决定。模型单项分数不能代表岗位交付能力。**

### 长链任务为什么会放大小差异

在多步骤任务中，前一步的错误可能进入后续上下文，被当作事实继续用于计划和行动；检查、重试和恢复机制则可能中断这一传播。因此，长任务评测需要观察错误如何累积、被发现和修正，不能只看一次基准测试的得分。

这也是为什么模型必须成为**岗位准入对象**，而不能被当成可互换处理器。

# 二、RPA、智能体和数字员工的能力边界

RPA（Robotic Process Automation，机器人流程自动化）通常执行预先定义的界面或系统操作。判断产品等级，要看模型、流程和运行系统分别承担什么职责。

| 类型 | 谁决定下一步 | 真实能力 | 典型风险 |
|---|---|---|---|
| 传统自动化 | 程序员预先写死 | 稳定执行固定流程 | 界面或规则变化就失效 |
| 大模型+流程 | 模型识别意图，流程决定大部分路径 | 自然语言入口、少量异常处理 | 被宣传成“员工”，实际仍是流程机器人 |
| 自主智能体执行 | 模型动态规划、选择工具并根据反馈调整 | 能完成一次复杂任务 | 会漂移、重复副作用、错误自信 |
| 真正数字员工 | 模型和运行体共同维持岗位、任务和状态 | 跨周期持续承担工作 | 模型差异直接改变岗位能力 |
| 高可信软件化员工 | 工作治理限制模型错误传播 | 可授权进入生产经营 | 目前市场仍缺完整公开证据 |

RPA 并不等于落后。在高风险写入场景，最合理的结构往往是：

```text
模型负责理解和规划
        +
规则/业务系统负责事实与边界
        +
自动化/API负责确定性执行
        +
人类负责例外和责任决策
```

问题不在于“用了 RPA”，而在于：**RPA 是员工的手，还是整个产品的大脑。**

# 三、商业产品怎样控制幻觉

大模型可能生成缺乏依据的内容，即通常所说的“幻觉”。企业产品需要同时减少错误、发现错误，并限制错误进入业务动作后的影响范围。

| 防线 | 典型技术 | 作用 |
|---|---|---|
| 事实源约束 | 客户关系管理、企业资源管理、知识库、检索、业务接口 | 用业务记录约束回答，减少模型凭记忆生成业务事实 |
| 范围约束 | 岗位、主题、技能、工具白名单 | 限制可以处理的问题和动作 |
| 身份与最小权限 | 角色权限、访问控制、独立智能体身份 | 即使模型想做，也不一定有权做 |
| 动作模式 | 参数化工具、业务对象、确定性流程 | 模型提出动作，由业务系统校验参数、权限与规则 |
| 调用时批准 | 一次性令牌、人工审批、例外升级 | 静态能力不等于本次获准 |
| 运行评测 | 模拟、回归测试、输出评价、注入检测 | 上线前和运行中发现偏差 |
| 可观测与审计 | 行为日志、文件/命令/API记录、成本和结果仪表盘 | 发现、追责、停用和优化 |
| 恢复与回滚 | 检查点、版本、补偿动作、幂等 | 避免失败后重复写入或丢失责任 |

## 3.1 大厂治理的真实能力

- Salesforce：事实约束、权限、动作、监测和审计，重点是把模型关在客户关系管理系统里。
- ServiceNow：控制塔发现、观察、治理和关闭偏离行为的智能体，记录文件、命令和接口调用。
- Glean：请求级权限检查、智能体身份、有范围凭证、版本检查点、评测、批准和回滚。
- UiPath：提示注入和敏感信息防线、强制人工介入策略、机器人确定性执行。
- Oracle：角色权限、审批层级、事务上下文、持续共享记忆和全动作历史。
- Torq：安全工具权限、策略、批准和完整处置审计。

这些已经是真治理，但主要集中在：**资产治理、安全治理、访问治理和运行治理。**

## 3.2 为什么仍不等于工作治理

开放知识工作还要回答：

- 一个市场数字、法律结论或技术判断来自哪个来源？
- 是来源事实、模型推断，还是未经证明的假设？
- 多个来源冲突时如何保留冲突？
- 谁独立复核？谁接受这个结论？
- 模型换掉、进程重启以后，正式责任是否连续？

因此：

> **智能体治理解决“这个软件能否安全运行”；工作治理还要解决“这个工作结论为什么成立、由谁负责”。**

## 3.3 从提示护栏到工作治理：五层可靠性技术

<!-- VISUAL-V4:START -->
![图06：五层可靠性及其边界](/assets/saaw-2026/figures/06_zh.png)

*图 06：每层防线解决不同问题。此图不是厂商评分，也不表示某个产品已经完整实现五层能力。 来源：作者根据本文相应章节的分析与文末参考资料整理绘制。*
<!-- VISUAL-V4:END -->

| 层级 | 典型技术 | 解决的问题 | 仍然解决不了什么 |
|---|---|---|---|
| 1. 提示护栏 | system prompt、禁止词、输出格式 | 减少明显越界 | 模型仍可自信编造 |
| 2. 事实约束 | 检索、企业知识、业务接口、CRM/ERP | 不让模型凭记忆定义业务事实 | 不能保证推理链正确 |
| 3. 智能体治理 | 身份、权限、工具白名单、批准、审计 | 限制能做什么、动作是否越权 | 不能证明交付主张成立 |
| 4. 决策验证 | Trusted Facts、结构化声明、确定性验证门、Judge | 验证“这个决策是否由可信事实和规则支撑” | 仍不等于完整组织责任 |
| 5. 工作治理 | 正式任务、交付、事实核查、独立观察、验收权、责任连续 | 证明谁负责、什么被接受、为什么状态合法 | 仍需真实组织采用和制度适配 |

按其官方说明，**causaLens** 提供第 4 层所讨论的机制：Trusted Facts（可信事实）保存系统计算的证据；Structured Decision Claims（结构化决策声明）组织事实、规则与建议；Deterministic Verification Gate（确定性验证门）在模型评价之前进行规则检查，不通过就阻止继续并退回执行者。

这在检索增强生成（RAG）和提示护栏之外，增加了对决策依据的检查，说明：

> **事实检查与独立评价，已经出现在商业产品的技术方案中。**

CodeFlowMu 采用的 TMPA（文本化多智能体流程架构）进一步关注**任务、交付、验收与责任事实**：一次判断经过检查以后，怎样成为可追踪的正式工作结果。

## 3.4 商业治理能力横向比较

| 产品 | 事实约束 | 动作权限 | 人工批准 | 运行评测 | 确定性验证 | 独立 Judge/EVAL | 长期责任事实 |
|---|---:|---:|---:|---:|---:|---:|---:|
| ServiceNow | 强 | 强 | 强 | **很强** | 部分 | 有评价体系 | 弱/平台内 |
| Glean | 强 | **每请求/动作检查** | 强 | 强 | 部分 | alignment/evals | 弱 |
| Relevance AI | 取决于连接器 | 边级配置 | **强** | Task View/日志 | 弱 | 弱 | 任务级 |
| causaLens | **很强** | 强 | 强 | 强 | **很强** | **Judge Agent** | 中 |
| Factory | 代码/测试事实 | 工具/沙盒 | 可交还用户 | **Validator** | validation contract | Validator | 项目任务级 |
| SAP | SAP 业务事实 | 企业权限 | 强 | 企业监控 | 业务规则/流程 | 部分 | 平台流程级 |
| CodeFlowMu | 任务、报告与工程证据 | 角色权限与治理判断 | 人工审批入口 | 公开回归与规范实施案例 | 固定输入下的状态与规则检查 | QA 角色分离；EVAL 旁路观察 | 持久任务、报告、审查与恢复记录 |

这些产品的**治理重心不同**。表中的“强”“部分”等是按公开机制作的定性比较，不是统一测试得分。CodeFlowMu 的依据包括公开协作案例与 I1.0 中 V1.8.0 的实施结果；角色权限判断不自动等于每个外部动作都已完成调用时授权。

# 四、客服与开放研究的交付难度为何不同

客服和企业事务有明确事实源、有限动作和可计量完成标准：订单来自订单系统，物流来自物流接口，退款资格来自规则，动作只有查单、改地址、退款、建工单和升级人工。

开放研究则没有单一真值数据库。研究员工必须选择来源、判断质量、处理冲突、区分事实和推断，并对最终结论负责。检索增强只能告诉它“找到什么”，不能证明“结论正确”。

| 工作类型 | 事实确定性 | 动作空间 | 完成标准 | 适合当前商业智能体程度 |
|---|---:|---:|---:|---:|
| 客服/订单/员工自助 | 高 | 小 | 清楚 | 很高 |
| 销售/采购/合同初审 | 中 | 中 | 部分可量化 | 中高 |
| 软件开发 | 中 | 大 | 测试、代码评审可部分验收 | 中高，但高度依赖模型 |
| 商业研究/战略分析 | 低 | 大 | 结论质量难自动验证 | 低 |
| 高风险财务/法律决策 | 中 | 中 | 责任重大 | 必须保留人工最终授权 |

# 五、收费单位揭示真实交付物

<!-- VISUAL-V4:START -->
![图07：收费单位与实际交付物](/assets/saaw-2026/figures/07_zh.png)

*图 07：将原文收费单位归并为使用权、执行量、工作容量和业务结果四类。箭头表达交付对象的变化，不代表所有厂商统一迁移，也不代表结果计费已经成为主流。 来源：作者根据本文相应章节的分析与文末参考资料整理绘制。*
<!-- VISUAL-V4:END -->

| 计价单位 | 客户实际购买什么 | 代表产品 |
|---|---|---|
| 席位 | 人使用软件/助手的权限 | Microsoft 365 Copilot、悟空、WorkBuddy |
| 点数/算粒 | 模型推理和智能体调用容量 | Microsoft、WorkBuddy、SAP、Torq |
| 动作 | 一次工具或业务动作 | Salesforce、Relevance AI、SAP |
| 对话 | 一次客户互动 | Salesforce、Ada、Decagon |
| 自动解决 | 客户问题被验证解决 | Zendesk、Intercom、Yellow.ai |
| 线索 | 一个被调查和触达的潜在客户 | 11x、Artisan |
| 分钟 | 一段语音劳动 | Bland、PolyAI、Parloa |
| 智能体计算单位 | 规划、工具、代码和运行资源组成的工作量 | Devin |
| 业务结果 | 成功挽留、成交、解决、回款等 | Sierra |

### 2026 年最值得注意的计价变化

- **HubSpot**：Customer Agent 从按对话改为 **0.50美元/成功解决**；Prospecting Agent 改为 **1美元/推荐外联线索**。
- **Intercom Fin**：**0.99美元/结果**（解决、流程交接、淘汰），成功销售资格判断 **9.99美元**；失败或用户要求人工不计结果费。
- **Zendesk**：2026-05 起使用 Automated Resolution / Resolution Allowance，只有 AI 成功解决且不升级人工才消耗解决额度，并按复杂度分层。
- **Relevance AI**：平台“动作费”和模型/工具 Vendor Credits 分离；文档当前列出额外 1,000 Actions 80美元，Vendor Credits 按批发成本透传并允许自带密钥。
- **Laiye Worker**：39/199元订阅 + 积分 + 企业治理/私有化，代表中国“低价席位/套餐 + AI 用量 + 企业部署”的典型结构。
- **WorkBuddy Enterprise**：198/316元/人/月 + Credits + 私有化，进一步证明中国并没有抛弃 Seat，而是在 Seat 上叠加智能体工作量。

SaaW 的商业演变可概括为：

```text
软件使用权
→ 人的效率增强
→ 智能体动作量
→ 数字工作容量
→ 可验证业务结果
```

但目前不能声称按结果计费已经全面主流。大量产品仍是“席位 + 点数 + 企业合同”。

# 六、能力分级与样本汇总

按第一册对照总表的同一口径，共有 **55 个条目：54 个原商业样本，加上 CodeFlowMu 自研产品**。能力等级与是否已经收费分别判断；边界产品保留 D2–D3 标签，不强行归入 D2。

| 等级或标签 | 数量 | 代表 | 结论 |
|---|---|---|---|
| D1 | 0（主表） | 纯问答、检索产品不在主表中 | 不代表市场没有此类产品 |
| D2 | 0（单列） | 相关边界产品保留在下一行 | 不把边界标签直接改成 D2 |
| D2–D3 边界 | **9** | 百度客悦、Robin、Juro、LayerX 等 | 自主规划与预设流程的分工仍需逐产品判断 |
| D3 | **36** | Salesforce、Microsoft、UiPath、SAP、Zendesk、Intercom、WorkBuddy、悟空等 | 主表中数量最多的类别，包含 3 个平台型条目 |
| D4 | **9** | ServiceNow、Glean、Oracle、Devin、Sierra、Factory、Torq、causaLens、**CodeFlowMu** | 按公开资料初评为持续岗位或工程工作系统；CodeFlowMu 限定于软件工程岗位 |
| D4 候选 | **1** | Laiye Worker | 任务执行与多模型能力已有资料，持续岗位责任仍待核验 |
| D5 | 0 | 无获评条目 | 本库未取得完整覆盖本报告 D5 条件的公开证据 |
| 合计 | **55** | 54 个原商业样本 + 1 个自研产品 | 各标签不重复计数 |


数量反映本报告的取样和分类，不代表市场份额。平台类产品的不同配置可能对应不同能力等级。

## 6.1 岗位能力与高可信治理的区别

- Devin 可以跨仓库工作，但大任务仍需拆解，模糊架构决策需人明确；
- Sierra 可以跨日/跨周完成客户流程，但模型、证据和恢复细节不透明；
- ServiceNow/Oracle 有强治理，但开放知识结论的证据治理不是重点；
- Factory 有长任务和多模型，但责任验收主要仍是工程测试；
- Glean 有身份、凭证、评测和回滚，但不同客户构建的智能体质量不一；
- Torq 适合安全处置，但官方也承认非确定性结果，要求需要确定性时使用固定工作流；
- causaLens 已经有可信事实、确定性验证和 Judge Agent，但公开材料仍不足以证明跨任务正式责任、幂等副作用回执与最终治理状态重建。

# 七、数字员工的模型准入机制

<!-- VISUAL-V4:START -->
![图08：模型岗位准入流程](/assets/saaw-2026/figures/08_zh.png)

*图 08：岗位风险 → 能力档案 → 模型、Host、工具与运行体组合实测 → 允许、限制、强制复核或拒绝。属于原报告提出的准入框架，不是已经完成的测评结果。 来源：作者根据本文相应章节的分析与文末参考资料整理绘制。*
<!-- VISUAL-V4:END -->

未来真正的员工运行体不应只保存 `model = xxx`，而应维护岗位最低能力与组合准入：

```text
岗位风险与任务类型
        ↓
所需能力档案
事实可靠性 / 指令遵循 / 长任务 / 工具 / 恢复
        ↓
模型 + 主机 + 工具 + 运行体实测
        ↓
允许 / 限制 / 强制复核 / 拒绝
```

建议岗位准入结果不要只给总分，而是给可执行结论：

```text
模型配置 A
资料整理：允许
内容草稿：允许但必须审阅
商业研究结论：限制
生产代码变更：需独立测试和评审
高风险外部动作：拒绝
```

## 7.1 建立模型能力档案（Model Capability Profile）

一个生产级数字员工至少应记录：

| 维度 | 需要评测的真实问题 |
|---|---|
| 事实可靠性 | 不知道时是否承认不知道？是否虚构来源、文件、接口结果？ |
| 长任务稳定性 | 30分钟、2小时、多日任务是否漂移？ |
| 工具调用 | 是否选择正确工具、参数、顺序？ |
| 指令遵循 | 能否长期记住“禁止修改/禁止发布/必须先验证”？ |
| 恢复能力 | 工具失败、Host 重启、模型切换以后是否正确续做？ |
| 自检能力 | 是否能发现前后矛盾，而不是为旧结论辩护？ |
| 证据纪律 | 是否区分外部事实、工具结果、模型推断和假设？ |
| 高风险动作 | 是否适合获得写权限，还是只能提出建议？ |

岗位再定义最低能力，例如：

```text
客服查询员工
  允许：中等推理模型 + 强事实源

软件开发员工
  要求：强仓库理解 + 工具 + 测试 + 恢复

商业研究员工
  要求：强来源纪律 + 多源冲突处理 + 独立复核

财务/法律关键动作
  要求：强模型 + 确定性规则 + 人类最终授权
```

这样“模型可替换”才不会被误解成“模型能力等价”。

# 八、本册结论

真正的商业竞争不是“谁有最多智能体”，而是：

1. 谁能把模型的不确定性收缩进明确事实源、工具和授权边界；
2. 谁能让不同能力模型只进入适合的岗位；
3. 谁能把软件费、模型费和工作结果说清楚；
4. 谁能在失败后重建工作责任，而不是只重试一次接口；
5. 谁能把完成声明变成有证据、可复核的正式交付。

下一册将把开源技术雷达完整融入，比较开源世界已经公开实现的身份、任务账本、动作前授权、恢复、手机监督和安装交付，并据此给出 CodeFlowMu 的产品定位。


# 九、参考资料

产品和收费资料沿用原研究范围，价格及具体配置以厂商当前说明为准；本文的分级与定性比较不等于全量产品实测。

- causaLens Digital Worker Factory: [causalens.com/our-digital-worker-factory](https://causalens.com/our-digital-worker-factory)
- causaLens Reliability / Causal Verification: [causalens.com/the-reliability-features](https://causalens.com/the-reliability-features)
- Factory Missions Architecture: [factory.ai/news/missions-architecture](https://factory.ai/news/missions-architecture)
- ServiceNow Evaluation Metrics: [www.servicenow.com/docs/r/intelligent-experiences/mon-ai-evaluation-metrics-reference.html](https://www.servicenow.com/docs/r/intelligent-experiences/mon-ai-evaluation-metrics-reference.html)
- Glean Agent Governance: [www.glean.com/ai-agents/agent-governance](https://www.glean.com/ai-agents/agent-governance)
- Relevance AI Pricing: [relevanceai.com/docs/get-started/pricing](https://relevanceai.com/docs/get-started/pricing)
- Relevance AI Approvals: [relevanceai.com/docs/build/workforces/workforce-features/approvals-and-escalations](https://relevanceai.com/docs/build/workforces/workforce-features/approvals-and-escalations)
- Intercom Fin Outcomes: [www.intercom.com/help/en/articles/8205718-fin-ai-agent-outcomes](https://www.intercom.com/help/en/articles/8205718-fin-ai-agent-outcomes)
- Zendesk Automated Resolution Tiers: [support.zendesk.com/hc/en-us/articles/9570369117338-About-automated-resolution-tiers](https://support.zendesk.com/hc/en-us/articles/9570369117338-About-automated-resolution-tiers)
- HubSpot Outcome Pricing: [www.hubspot.com/company-news/hubspots-customer-agent-and-prospecting-agent-now-you-pay-when-the-task-is-complete](https://www.hubspot.com/company-news/hubspots-customer-agent-and-prospecting-agent-now-you-pay-when-the-task-is-complete)
- Laiye Worker: [laiye.com/product/worker](https://laiye.com/product/worker)
- WorkBuddy Model Configuration: [cloud.tencent.com/document/product/1831/134445](https://cloud.tencent.com/document/product/1831/134445)
- WorkBuddy Pricing: [cloud.tencent.com/document/product/1831/134333](https://cloud.tencent.com/document/product/1831/134333)
- Devin GPT-5.6 Sol engineering cost comparison: [devin.ai/blog/gpt-5-6-sol-price-drop](https://devin.ai/blog/gpt-5-6-sol-price-drop)
- CodeFlowMu 公开项目说明：[中文 README](https://github.com/joinwell52-AI/joinwell52/blob/main/README.zh-CN.md)
- CodeFlowMu 开发协作案例：[从需求拆解到测试验收](https://joinwell52-ai.github.io/joinwell52/zh/digital-employee/2026-08-18-cursor-ai-development-team)
- CodeFlowMu V1.8.0 治理实施证据：[I1.0 产品结果](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/zh/publications/implementation-case-i1.0/part-02.md)
