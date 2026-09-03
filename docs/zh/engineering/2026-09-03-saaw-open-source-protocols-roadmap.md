---
title: "全球真实数字员工与 SaaW 商业全景报告 2026-3"
date: '2026-09-03'
research_date: '2026-08-30'
prepared_date: '2026-09-03'
column: open-source-engineering
category: daily
article_type: comparative-study
edition: research-center
research_question: "开源组件和不同协议怎样分工，才能支持可接续、可审查、有人类监督的数字员工系统？"
summary: "比较 23 个公开项目与不同协议的职责边界，讨论多智能体岗位协作、本地运行、人类监督及 CodeFlowMu 的产品路线。"
cover: "/assets/covers/saaw-2026-part-3-cover.png"
language: zh-CN
series: saaw-commercial-landscape-2026
series_part: 3
lifecycle: Published
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/saaw-2026-part-3-cover.png"
  kicker="开源工程 · SaaW 商业全景（三）"
  title="全球真实数字员工与 SaaW 商业全景报告 2026-3"
  summary="比较 23 个公开项目与不同协议的职责边界，讨论多智能体岗位协作、本地运行、人类监督及 CodeFlowMu 的产品路线。"
  version="SaaW 2026 · 3/3"
  languageHref="/en/engineering/2026-09-03-saaw-open-source-protocols-roadmap"
  languageLabel="English"
/>

<ArticleTableScroll language="zh" />

# 全球真实数字员工与 SaaW 商业全景报告 2026-3
## 开源技术、协议分工与 CodeFlowMu 产品路线

一个智能体框架可以保存状态、调用工具、组织多个角色，但把它交付给企业，还需要解决安装、权限、任务交接、结果验收和失败恢复。第三册考察这些机制在公开生态中已经走到哪里，以及哪些值得纳入产品设计。

本报告所说的 **SaaW（Software as an Agent Worker）**，是将软件作为数字工作主体持续交付成果的范式。**CodeFlowMu** 是我们自研的多智能体协作与运行系统；它采用 **FCoP（文件驱动协作协议）** 组织工作交接，并以 **TMPA（文本化多智能体流程架构）** 讨论责任、权限与治理事实。概念出处见《[从 SaaS 到 SaaW：当代码库开始“自己开发自己”](https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-08-10-saaw-software-as-an-agent-worker)》。

前两册比较商业产品与交付能力，本册比较公开实现、协议和产品路线。开源或源码公开能够帮助检查技术机制，但不能单独证明客户付费意愿。

# 一、开源技术雷达总表

下表保留 **23 个公开项目**，包含桌面产品、开发框架与协议规范。它们的交付对象不同，应先按技术类别比较，再看具体机制。

**M 表示工程成熟度初评**：M1 为概念，M2 为原型，M3 为可运行实现，M4 为较完整的工程或产品形态，M5 需要更广泛的生产验证；“+”“−”表示相邻阶段的过渡。它与前两册的 D1–D5 岗位能力、下节的 S1–S5 规范成熟度是不同维度。研究优先级使用“优先、较高、常规”，不作为能力评分。

| 项目 | 国家/地区 | 技术类别 | 许可证/公开方式 | 工程成熟度初评 | 安装/基础设施 | 重点研究机制 | 研究优先级 | 仓库 |
|---|---|---|---|---|---|---|---|---|
| Paperclip | 美国 | AI 公司/数字劳动力控制面 | MIT | M4- | Node/Web；内嵌 PostgreSQL | 组织、目标、预算、任务领取锁、恢复、审计 | 优先 | [paperclipai/paperclip](https://github.com/paperclipai/paperclip) |
| StaffDeck | 中国 | 企业数字员工平台 | AGPL-3.0 | M3+~M4- | Windows EXE / macOS DMG / Linux DEB | 员工档案、状态机 SOP、知识、记忆、定时、人类接管 | 优先 | [OpenBMB/StaffDeck](https://github.com/OpenBMB/StaffDeck) |
| iML Work | 地区待核 | 本地业务工作分身 | MIT | M3 | Windows 客户端；本地 SQLite | 真实 OA/CRM/ERP、一次性写授权、本地凭证、审计 | 优先 | [imoling/iml-work](https://github.com/imoling/iml-work) |
| Orkas | 地区待核 | 本地多智能体桌面 | MIT | M4- | Windows Setup / macOS DMG | 本地优先、多模型、岗位智能体、低基础设施 | 优先 | [Orkas-AI/Orkas](https://github.com/Orkas-AI/Orkas) |
| Fusion | 地区待核 | 智能体软件工厂/工作面 | MIT | M3+ | npm/Homebrew；PWA+iOS/Android | 任务板、任务使命、公司、多节点、评审、移动端 | 优先 | [Runfusion/Fusion](https://github.com/Runfusion/Fusion) |
| TSA AI Workforce | 马来西亚 | 受治理本地数字劳动力 | MIT | M3+ | Windows/macOS/Linux | 独立身份、凭证、审计、审批、本地 PostgreSQL | 优先 | [Steveser1989/TSA-AI-Workforce](https://github.com/Steveser1989/TSA-AI-Workforce) |
| Eigent | 英国 | 开源办公桌面/智能劳动力 | Apache-2.0 | M4 | 桌面版；完全本地后端较重 | 多智能体办公、云/本地/企业双轨 | 较高 | [eigent-ai/eigent](https://github.com/eigent-ai/eigent) |
| OneManCompany | 地区待核 | 一人公司操作系统 | Apache-2.0 | M3+ | npx 一条命令 | 组织、招聘、绩效、评审、质量门、多角色 | 较高 | [1mancompany/OneManCompany](https://github.com/1mancompany/OneManCompany) |
| OpenHire | 地区待核 | 数字员工编排平台 | MIT | M3 | Python CLI + Web + Docker Worker | 员工编排、工作空间、容器执行 | 较高 | [pzy2000/OpenHire](https://github.com/pzy2000/OpenHire) |
| CrewMeld | 中国 | 企业数字员工+SOP | 开放核心 | M3+ | Docker/Helm/Kubernetes | 员工、SOP、人审断点恢复、多租户；基础设施较重 | 较高 | [proinsight-io/crewmeld](https://github.com/proinsight-io/crewmeld) |
| OpenVort | 中国市场 | 企业 AI 员工平台 | AGPL-3.0 | M3+ | Docker Compose | 企微/钉钉/飞书、技能、定时、Docker 工作电脑 | 较高 | [openvort/openvort](https://github.com/openvort/openvort) |
| OACP / KiloLoop | 美国生态 | 文件型智能体协作协议 | Apache-2.0 | 协议 M3+ | CLI+文件；无中心服务 | 收发箱、类型消息、评审、质量门、恢复、签名 | 较高 | [kiloloop/oacp](https://github.com/kiloloop/oacp) |
| Gas Town + Beads | 美国生态 | 多智能体工作区+持久任务账本 | MIT | M3+ | 命令行/二进制 | 长任务领取、监督、恢复、Dolt 持久事实 | 较高 | [gastownhall/gastown](https://github.com/gastownhall/gastown) |
| Microsoft Sico | 美国/全球 | 数字工作者基础设施 | MIT | 技术 M4 | Docker/K8s；重型栈 | Digital Worker、Operator、感知/行动/记忆、演化 | 常规 | [microsoft/Sico](https://github.com/microsoft/Sico) |
| Palmier | 个人项目 | 电脑智能体远程监督 | Apache-2.0 | M3 | 主机守护进程+PWA+Android | 手机发任务、定时、批准、通知、设备能力 | 较高 | [caihongxu/palmier](https://github.com/caihongxu/palmier) |
| SIDJUA | 地区待核 | 动作前智能体治理 | AGPL-3.0 | M3 | Docker/npm；SQLite | 动作前授权、策略、沙盒、审计 | 常规 | [GoetzKohlberg/sidjua](https://github.com/GoetzKohlberg/sidjua) |
| TICK.md | 美国生态 | Markdown 原生多智能体任务协调协议 | MIT | 协议 M3 | npm + MCP + Git | 单一 TICK.md、任务领取、依赖、状态、Git 审计、MCP | 优先 | [Purple-Horizons/tick-md](https://github.com/Purple-Horizons/tick-md) |
| KanBanLess | 社区项目 | 目录即看板、Markdown 即任务 | 具体许可待核验 | M2~M3 | 文件系统/Git | 目录定义状态、移动文件即迁移、极简文本任务机 | 常规 | [markdav-is/KanBanLess](https://github.com/markdav-is/KanBanLess) |
| Agent Wiki | 美国生态 | 人与智能体共享文本知识空间 | 源码公开 | M3 | Markdown + 文件系统 + Git | 自更新知识库、层级文件、MCP/智能体协作 | 常规 | [onyx-dot-app/agent-wiki](https://github.com/onyx-dot-app/agent-wiki) |
| CrewAI | 美国 | 多智能体角色/团队框架 | MIT | 技术 M4 | Python/PyPI | 角色/目标、经理、委派、规划、护栏、检查点、Crew+Flow | 优先 | [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) |
| LangGraph | 美国 | 有状态智能体运行图 | MIT | 技术 M4+ | Python/JS | 检查点、线程、暂停、恢复、回放/分叉、人工介入 | 优先 | [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) |
| Open Agent Spec | 美国/Oracle | 可移植智能体定义语言/规范 | Apache-2.0/UPL | 规范 M3+ | Python SDK / JSON / YAML | Agent/Flow/多智能体的框架无关声明、序列化、适配器、符合性工作 | 优先 | [oracle/agent-spec](https://github.com/oracle/agent-spec) |
| AGNTCY / OASF | 全球/LF 生态 | 智能体能力与元数据模式 | Apache-2.0 | 规范 M4 | 模式、SDK、校验服务 | 能力/技能/领域/依赖记录、模式校验；目录与身份服务由相关生态组件提供 | 优先 | [agntcy/oasf](https://github.com/agntcy/oasf) |



# 二、协议与规范：从项目约定到开放标准

<!-- VISUAL-V4:START -->
![图09：从项目约定到开放标准的证据门槛](/assets/saaw-2026/figures/09_zh.png)

*图 09：S1–S5 表示规范成熟度，不是百分比分数。FCoP、TMPA 的位置是研究初评；进一步判断需要独立实现、外部采用与跨实现验证。 来源：作者根据本文相应章节的分析与文末参考资料整理绘制。*
<!-- VISUAL-V4:END -->

开源项目很多，但“有仓库、有 PyPI 包、有 MCP 工具”并不等于已经成为行业规范。为了避免把项目成熟度和标准成熟度混在一起，本报告采用以下五级判断：

| 规范成熟度 | 判定条件 | 含义 |
|---|---|---|
| **S1 项目约定** | 单一项目内部有固定格式或约定 | 只能证明作者自己在用 |
| **S2 可复用实现** | 有独立仓库、包、SDK、CLI 或 MCP 服务 | 别人可以安装和复用 |
| **S3 正式规范** | 有版本化规范、明确语义、模式/数据结构、兼容政策 | 已经从“代码”上升为规范 |
| **S4 可验证生态规范** | 有参考实现、公开符合性方法及跨实现验证结果 | 能依据共同规则检查实现是否兼容 |
| **S5 行业开放标准** | 多家独立实现、生产采用、中立治理/基金会、稳定发布机制 | 不再依赖单一厂商或单一作者 |

## 2.1 代表性智能体协议与规范

| 协议/规范 | 解决什么问题 | 当前判断 | 与 TMPA/FCoP 的关系 |
|---|---|---:|---|
| **MCP（模型上下文协议）** | 模型/智能体如何标准化访问工具、资源与上下文 | **S5** | 解决“怎么接工具”，不解决“工作是否被正式接受” |
| **A2A（智能体到智能体协议）** | 不同厂商/框架智能体如何发现、通信、建立任务、交换产物 | **S5** | 有任务/产物/状态，但不定义组织责任、事实核查和验收合法性 |
| **AGNTCY / OASF** | 如何标准化描述智能体能力、技能、领域、依赖等元数据 | **S4** | 提供能力描述模式；业务授权和工作验收需另外定义 |
| **Open Agent Spec** | 用框架无关 JSON/YAML 定义 Agent、Flow 和多智能体系统 | **S3+~S4-** | 同样是“规范优先”，但规范的是智能体定义 |
| **OpenTelemetry 智能体/生成式 AI 语义规范** | Trace、Span、指标与智能体可观测数据如何统一命名 | **S4（智能体部分仍演进）** | 统一观察语言，不决定治理效力 |
| **FCoP** | TASK/REPORT/ISSUE/REVIEW 如何形成正式行为协议和生命周期 | **S3+，生态早期** | 已是可执行协议，但尚缺多家独立实现和外部采用 |
| **TMPA** | 如何依据证据重建责任、权限、冲突与有效治理状态 | **S3-，研究/规范阶段** | 已是可执行治理规范/参考架构，但还不是外部行业标准 |

## 2.2 MCP：工具接入协议的标准化路径

MCP 当前具备完整标准化链条：

```text
正式协议规范
    ↓
版本化发布
    ↓
多语言 SDK
    ↓
PyPI / npm 等分发
    ↓
官方 Registry
    ↓
多家 Host / Server 独立实现
    ↓
中立基金会与工作组
```

2026-07-28 规范进一步加入无状态核心、授权强化、扩展机制和 Tasks 扩展；官方 Python SDK 以 `mcp` 发布在 PyPI。

参考：
- [blog.modelcontextprotocol.io/posts/2026-07-28/](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
- [registry.modelcontextprotocol.io/docs](https://registry.modelcontextprotocol.io/docs)
- [github.com/modelcontextprotocol/python-sdk](https://github.com/modelcontextprotocol/python-sdk)

这说明：**PyPI 是实施渠道，Registry 是发现渠道，规范文本才是协议权威。**

## 2.3 A2A：已经把“任务/产物/消息”做成跨厂商协议

A2A（Agent2Agent，智能体间互操作协议）定义任务、任务状态、消息和产物，分别用于：

- Message（消息）：传递交互内容；
- Artifact（产物）：表达任务输出；
- TaskState（任务状态）：表达提交、运行、完成、失败、取消，以及等待输入或授权等状态。

这些对象使调用方可以区分一次消息交互与一个可追踪的任务。具体状态名称及传输编码应以采用的协议版本为准。

这和 FCoP 的“正式任务对象、正式交付对象、生命周期”存在真实交集。

但差别同样明确：

```text
A2A:
Task completed
= 协议层认为远程 Agent 的执行成功结束

TMPA / FCoP / CodeFlowMu:
执行结束
≠ 自动等于组织意义上的 PASS / Accepted
```

仅凭 A2A 的任务完成状态，仍不能回答以下组织层面的问题：

- 谁拥有最终业务验收权；
- Agent 自己宣布 completed 是否足够；
- Artifact 中的事实主张如何核查；
- QA 与执行者冲突如何保留；
- 人工接受 FAIL 为什么不能被改写成 PASS；
- 跨重启如何重建责任链。

因此，A2A 的互操作状态与企业自己的业务验收规则需要对接。

## 2.4 “有 PyPI + MCP 工具”意味着什么

FCoP 当前已经具备：

1. 版本化规范文本；
2. 生命周期、事件、边界规则与机器可读模式；
3. `fcop` Python 参考实现；
4. `fcop-mcp` MCP 桥接实现；
5. PyPI 分发；
6. 官方 MCP Registry 条目 `io.github.joinwell52-AI/fcop`；
7. 稳定性、兼容和迁移政策；
8. DOI / OSF / Git 可引用历史。

参考：
- [pypi.org/project/fcop/](https://pypi.org/project/fcop/)
- [pypi.org/project/fcop-mcp/](https://pypi.org/project/fcop-mcp/)
- [github.com/joinwell52-AI/FCoP](https://github.com/joinwell52-AI/FCoP)

因此，**FCoP 已经不能只叫“一个开源工具库”**。更准确的表述是：

> **FCoP 是一个已有正式规范、参考实现、软件包和 MCP 发行面的可执行多智能体行为治理协议。**

但目前仍不能称为“行业标准”，因为还缺：

- 维护者之外的第三方独立实现；
- 不依赖 CodeFlowMu 的外部采用；
- 跨实现符合性结果；
- 多组织参与的规范治理；
- 其他产品公开声称支持 FCoP。

**进入 MCP Registry 证明的是 FCoP 的 MCP 服务可被生态发现，不等于 MCP 社区已经把 FCoP 采纳为标准。**

## 2.5 TMPA：已经是什么，还不是什么

TMPA 不是网络通信协议，也不是 Agent SDK，更接近：

> **治理架构 + 正式规范 + Reference Reader + 符合性测试。**

它定义的是：

- 可持续工作事实；
- 责任、权限、接受、冲突等治理对象；
- Trace 为什么不等于治理；
- 如何从证据重建当前有效状态；
- Reader 如何 fail-closed；
- 执行状态与治理状态为什么必须分开。

因此，TMPA 当前可以严谨地称为：

> **可执行的多智能体工作治理规范与参考架构。**

但仍不能称为行业标准。它真正缺的是：

```text
第二个独立实现
+
外部项目采用
+
跨实现符合性测试
+
公开兼容矩阵
+
多组织规范治理
```

## 2.6 最值得 TMPA/FCoP 学习的标准化路线

<!-- VISUAL-V4:START -->
![图10：从工具连接到工作责任的协议分工](/assets/saaw-2026/figures/10_zh.png)

*图 10：各协议的逻辑职责。上下位置不是技术优劣排名，也不是必须全部采用的依赖栈。OpenTelemetry 作为可观测性职责横跨各层。 来源：作者根据本文相应章节的分析与文末参考资料整理绘制。*
<!-- VISUAL-V4:END -->

### 先冻结最小规范核心

FCoP 应继续坚持：

> **FCoP 治理 Agent 行为，不拥有 Runtime。**

TMPA 应继续坚持：

> **TMPA 定义治理事实，不复制 Agent 执行框架。**

### 把“符合性”做得比“功能数量”更重要

真正协议成熟的标志不是工具越来越多，而是：

```text
Implementation A
Implementation B
Implementation C
        ↓
同一组规范向量
        ↓
得到可比较的符合性结果
```

### 最关键的下一步：第二实现

FCoP 真正跨过下一道门槛的标志，不是 MCP 再增加十个工具，而是：

> **有人不使用官方 `fcop` Python 包，也能只根据规范正确实现兼容 Reader/Writer。**

例如：
- TypeScript FCoP Reader；
- Go FCoP Validator；
- 第三方 Runtime 原生支持 FCoP TASK/REPORT；
- 非 CodeFlowMu 项目通过 FCoP 符合性测试。

### 不要与 MCP/A2A 竞争，要做分层互操作

最合理的长期技术栈：

```text
MCP
工具 / 资源接入

A2A
跨 Runtime / 跨厂商 Agent 通信

OASF / Agent Spec
Agent 身份、能力和定义

OpenTelemetry
Trace / Span / 指标

FCoP
正式工作行为和工件协议

TMPA
跨来源治理事实与责任重建

CodeFlowMu
数字员工运行产品
```

这样 TMPA/FCoP 的位置最清楚：**不是再造工具协议、通信协议或可观测协议，而是补工作治理层。**

# 三、公开生态中已经存在的基础能力


下列能力在公开项目中已有实现，可作为产品选型与架构比较的起点：

- 文件、YAML 或 Markdown 记录智能体、角色、任务和状态；
- 多角色、多智能体、经理智能体和公司组织结构；
- 本地优先、桌面应用、Windows 安装包；
- 定时任务、长期记忆、人工审批；
- 手机 PWA/Android 远程监督电脑智能体；
- 任务领取、持久账本、失败恢复；
- 智能体工具白名单、动作前策略和沙盒；
- SOP 状态机、质量门和多角色评审。

把这些能力用于持续岗位，还要把以下要素连接起来：

```text
持续身份
+
岗位责任
+
调用时授权
+
正式工作合同
+
证据化交付
+
合法状态迁移
+
独立复核
+
幂等恢复
+
责任重建
```

# 四、实现机制：角色、状态与协议分别解决什么

这一节结合官方文档、源码入口与规范对象，区分框架提供的机制及应用需要补充的规则。

## 4.1 CrewAI：区分智能体配置与团队编排

CrewAI 的 `Agent` 可以设置角色、目标、背景、模型、工具和是否允许委派；`Crew` 则组织任务执行，并提供团队规划及层级流程配置。层级模式中的经理负责分配任务和检查结果。检查点、护栏等机制还需结合所用组件与版本考察，不宜全部写成一个 `Agent` 对象的属性。[Agent 文档](https://docs.crewai.com/en/concepts/agents)、[Crew 文档](https://docs.crewai.com/en/concepts/crews)。

这说明，角色分工和经理调度已有可复用实现。产品层需要进一步明确：执行者能否批准自己的结果，任务怎样返工，哪些决定必须由人作出。

## 4.2 LangGraph：保存与恢复执行状态

LangGraph 通过检查点和持久化存储保存执行状态，使用线程标识关联后续调用，支持中断后继续以及从历史状态恢复或分叉。状态值、元数据、父检查点和待处理写入分布在相关数据结构与存储接口中，不是全部放在同一个 `Checkpoint` 字段集合里。跨进程重启恢复还需要持久化后端，内存检查点不能替代。[持久化文档](https://docs.langchain.com/oss/python/langgraph/persistence)。

在这一执行基础上，应用仍需要定义业务责任：

```text
LangGraph checkpoint
回答：程序运行到哪里、状态是什么？

TMPA governance fact
回答：谁有责任、什么被正式接受、为什么当前治理状态有效？
```

源码：
- [github.com/langchain-ai/langgraph/blob/main/libs/checkpoint/langgraph/checkpoint/base/__init__.py](https://github.com/langchain-ai/langgraph/blob/main/libs/checkpoint/langgraph/checkpoint/base/__init__.py)
- [github.com/langchain-ai/langgraph/blob/main/libs/prebuilt/langgraph/prebuilt/interrupt.py](https://github.com/langchain-ai/langgraph/blob/main/libs/prebuilt/langgraph/prebuilt/interrupt.py)

## 4.3 TICK.md：用 Markdown 与 Git 协调任务

TICK.md 明确把自己定义成“Git-backed Markdown multi-agent task coordination”。任务存在 `TICK.md`，支持：

- agent register；
- add / claim / done / reopen；
- dependency；
- Git audit；
- MCP Server；
- stale-write detection；
- watch/monitor；
- orchestrator/worker role instructions。

与 FCoP 对照时，重点应放在任务、报告、问题和审查是否分别具有明确语义，以及状态迁移怎样受规则约束。

源码：
- [github.com/Purple-Horizons/tick-md](https://github.com/Purple-Horizons/tick-md)

## 4.4 Open Agent Spec：分开规范、SDK 与运行适配

Oracle Open Agent Specification 将 Agent 与 Flow 定义成可序列化 JSON/YAML 的框架无关语言，由不同 Runtime 实现。PyAgentSpec 提供 Python SDK；目标是让声明在不同 Agent 框架之间移植，并用符合性语义约束 Runtime。

它给 FCoP 一个非常直接的启发：

> **规范不应该等于官方 Python 包；规范应该允许第二个 Runtime 只看 Spec 就正确实现。**

因此 FCoP 长期可以考虑分离为：

```text
FCoP Language
角色 / 权力 / 工件 / 生命周期的声明式定义

FCoP Protocol
TASK / REPORT / ISSUE / REVIEW / OBSERVATION 的语义

Host Adapters
通过文件系统、Git 或 MCP 等机制接入具体运行环境
```

这是声明式定义与适配方式的研究建议。FCoP 当前的文件协议不能直接等同于任意数据库编码；跨存储介质的治理表达应放在 TMPA 的实现方案中另行定义和验证。

来源：
- [github.com/oracle/agent-spec](https://github.com/oracle/agent-spec)

# 五、商业产品与公开项目的互补关系

| 比较问题 | 商业产品中的代表机制 | 公开项目中的研究入口 |
|---|---|---|
| 客户与真实业务系统 | Salesforce、SAP、ServiceNow、用友、金蝶 | iML Work、OpenVort 展示轻量本地连接思路 |
| 安装产品化 | WorkBuddy、悟空、Devin | Orkas、StaffDeck、TSA 已证明 EXE/DMG 可行 |
| 公司级控制面 | ServiceNow、Glean | Paperclip 的组织、预算、任务领取和恢复非常完整 |
| 员工档案/SOP | 百度、来也 | StaffDeck 的员工档案和状态机 SOP 更透明 |
| 任务持久化与恢复 | 商业产品通常不公开细节 | OACP、Gas Town/Beads 可直接审计协议和账本 |
| 动作前授权 | 大厂有权限/审批，但合同不透明 | iML Work、SIDJUA 公开一次性授权和预动作治理 |
| 手机监督 | WorkBuddy、悟空 | Palmier、Fusion 公开了电脑执行+手机主管架构 |
| 模型与运行体分离 | Relevance、Factory、Laiye | 多个开源桌面支持自带模型、离线和多模型 |

# 六、重点开源样本判断

## 6.1 Paperclip

最强项是公司级控制面：组织、目标、预算、任务、领取锁、心跳、审批、审计、恢复和可移植公司模板。它证明独立团队可以把“智能体公司”做成完整产品，但路线比 CodeFlowMu 的“一台电脑一个员工”更重。

## 6.2 StaffDeck

中国最直接的数字员工开源样本之一。它已经把员工档案、岗位、技能、知识、状态机 SOP、定时和人类接管产品化，并提供 Windows/macOS/Linux 安装包。值得学习安装体验和岗位资产化，但不要把 CodeFlowMu 变成重知识/SOP平台。

## 6.3 iML Work

最值得研究的是：员工电脑上的真实业务登录态、凭证本地保存，以及针对具体写操作签发一次性授权。它把“有工具权限”和“本次动作获准”明确拆开，和 CodeFlowMu 的调用级授权研究高度相关。

## 6.4 OACP、Gas Town 与 Beads

它们证明文件协议、持久任务账本、任务领取、评审和恢复都不是 CodeFlowMu 独有。FCoP 的价值不能停在“用文件”，必须落在正式责任语义、单写者事实、证据链和合法状态重建。

## 6.5 Palmier 与 Fusion

它们提供了电脑执行、手机监督的产品参考。对 CodeFlowMu 的工作站路线，手机适合作为任务、批准、通知和异常干预入口，避免另建一套相互冲突的工作状态。

## 6.6 SIDJUA

其动作前授权、策略和沙盒对 CodeFlowMu 很重要。未来真正的数字员工必须把“能力许可”和“这一次针对这个对象的执行授权”分开。


## 6.7 Open Agent Spec 与 OASF：定义执行结构与能力元数据

Open Agent Spec 用于声明智能体与工作流结构，OASF 用于描述智能体的能力、技能、领域和依赖等元数据。OASF 模式本身不等于整个 AGNTCY 生态的身份、目录和通信服务。

对 TMPA/FCoP 的启示是：规范与官方实现应分开评价；第三方能否依据同一规范实现并通过兼容性检查，比单个实现的功能数量更能说明可移植性。

# 七、核心架构对照：哪些产品真的和 CodeFlowMu 相似

当前 CodeFlowMu 是闭源的独立产品线；CodeFlowMu Open 是于 2026 年 8 月 22 日冻结在 V1.2.29-open 的历史 MIT 版本，不代表当前产品的分发方式或完整能力。因此，本册将当前产品放入架构比较，不计入前面的 23 个公开项目。

围绕团队分工、持久状态、证据检查与人类验收，可以选择以下核心对照组：

- causaLens：一个数字员工 = 多专业智能体团队 + 可信事实 + Judge；
- Factory Missions：Orchestrator → Worker → Validator，状态外置；
- SAP Joule：岗位 Assistant → 多个专业 Agents；
- ServiceNow：企业智能体编排 + Trace/Span 诊断 + 评价控制塔；
- Relevance AI：Manager/专业 Agent + 边级批准 + Task View；
- Glean：每动作权限检查 + alignment/evals；
- CrewAI：开源 Manager/角色/委派；
- LangGraph：开源共享状态/hand-off/checkpoint；
- TICK.md：Markdown/Git 任务协议。

## 7.1 多智能体之间到底怎么“通信”

| 系统 | 主要协作方式 | 是否依赖自由聊天 | 状态/交付放在哪里 |
|---|---|---:|---|
| CrewAI | Manager 委派、Agent result 回传、可直接 delegation | 部分 | Crew/Task 上下文 |
| LangGraph | handoff、Command、共享 State、Supervisor | 可以，但不是必须 | Graph State + Checkpoint |
| Relevance AI | Agent Edge、Manager delegation、强制 Next Step | 部分 | Workforce Task / conversation history |
| SAP Joule | Assistant 解释目标并协调专业 Agents | 低 | SAP 业务对象、流程和 Agent 上下文 |
| Factory Missions | Orchestrator 调度，新 Worker/Validator，外置共享工件 | **低** | validation contract、feature list、research notes、Git/代码 |
| causaLens | 多专业 Agent 团队，输出经过质量/事实门 | 低 | Blueprint、Trusted Facts、Decision Claims、产物与审计 |
| TICK.md | agent claim/update/done，共享 Markdown/Git | **低** | TICK.md + Git |
| **CodeFlowMu** | PM 通过正式 TASK 派发，执行角色通过 REPORT/ISSUE/REVIEW 交接；EVAL 走独立 Observation | **设计上不依赖 Agent 自由聊天** | FCoP 工件 + Runtime 状态 + TMPA/证据投影 |

因此 CodeFlowMu 最值得坚持的不是“Agent 不聊天”这个形式，而是：

> **Agent 之间不依赖不可治理的自由对话完成工作，而通过具有正式语义的任务、报告、问题、审查、证据和验收关系协作。**

## 7.2 团队、工作对象、验证与控制的对照矩阵

符号：✅所引公开资料明确描述；◐部分能力或依赖配置；—所引资料未列出默认实现；?信息不足。表格比较机制，不是统一实测得分；CodeFlowMu 的公开版本证据与当前产品配置分别判断。

| 对比维度 | causaLens | Factory Missions | ServiceNow | SAP Joule | Relevance AI | Glean | CrewAI | LangGraph | TICK.md | **CodeFlowMu** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 一个“员工/岗位”内部多个 Agent | ✅ | ◐项目团队 | ✅ | ✅ | ✅ | ◐ | ✅Crew | 可构建 | ◐ | **✅** |
| 明确 Manager/Orchestrator | ◐ | **✅** | ✅ | **✅ Assistant** | ✅ | ◐ | **✅** | 可构建 | ◐ | **✅ PM** |
| 执行与验证职责分离 | ✅ QA | **✅ Worker/Validator** | ◐ | ◐ | 可配置 | ◐ | 可配置 | 可构建 | — | **✅ DEV/QA** |
| 独立观察/评价角色 | **✅ Judge** | ✅ Validator | **✅ Evals** | ◐ | 弱 | **✅ alignment/evals** | 可配置 | 可构建 | — | **✅ EVAL** |
| 正式任务对象 | ✅ workflow | ✅ feature/mission | ✅ task/case | ✅ business task | ✅ Workforce Task | ✅ workflow | ✅ Task | ✅ graph/run | **✅** | **✅ TASK** |
| 独立正式报告/交付工件 | ✅ artifact/claim | ✅ code/artifact | ◐ | ◐ | output/task | ◐ | TaskOutput | State/output | 弱 | **✅ REPORT** |
| 事实核查/可信事实 | 可信事实机制 | 测试事实 | ◐ | SAP业务事实 | 依连接器 | 企业知识事实 | — | — | — | ◐公开工程案例中的证据核查 |
| 验证与放行机制 | 确定性验证门 | 验收约定 + Validator | ◐ | 业务规则 | — | ◐ | 可配置 guardrail | 可编排 | validator | 治理规则校验；旁路观察不等于放行门 |
| 诊断/根因定位 | ✅ | ✅ | **✅ Trace/Span** | ◐ | ✅ Task View | ◐ | 事件/日志 | **✅ replay/state** | watch/validate | ◐任务与证据检查，依具体版本 |
| 人工批准 | ✅ | 用户接管 | ✅ | ✅ | **✅ 边级批准** | ✅ | 可配置 | **✅ interrupt** | 人可编辑 | **✅ ADMIN** |
| 最终人类验收权独立于执行者 | ◐业务负责人 | ◐ | ◐ | ◐ | ◐ | ◐ | — | — | — | **✅ ADMIN 最终治理权** |
| 跨模型/多模型 | ✅模型无关 | **✅** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 模型无关 | 架构分离；当前接入清单未核验 |
| 核心实现可审计开源 | ❌ | ❌ | ❌ | ❌ | ❌平台 | ❌核心 | **✅** | **✅** | **✅** | 产品闭源；FCoP/TMPA公开 |

执行、观察、评价与验收承担不同职责。一个旁路观察者可以报告问题，但只有与正式规则及有权主体的决定连接起来，才可能影响任务是否放行。

## 7.3 已有能力与需要继续验证的组合差异

<!-- VISUAL-V4:START -->
![图11：已有技术与仍需证明的系统差异](/assets/saaw-2026/figures/11_zh.png)

*图 11：将原文先例与差异主张分开：组件已有先例，不等于统一的工作责任结构已经被验证。没有把定性证据换算成能力评分。 来源：作者根据本文相应章节的分析与文末参考资料整理绘制。*
<!-- VISUAL-V4:END -->

| 层次 | 判断 |
|---|---|
| 多 Agent、角色、Manager | **行业已有**，CrewAI/Factory/SAP/Relevance 已充分证明 |
| checkpoint、恢复、人工中断 | **行业已有**，LangGraph 很成熟 |
| 事实约束、Guardrail、权限 | **行业已有**，Glean/ServiceNow/SAP 等成熟 |
| Judge/Eval/Validator | **行业已有**，causaLens/Factory/ServiceNow 已实现 |
| Markdown/Git/任务领取 | **行业已有**，TICK.md/OACP/Gas Town 等已有公开先例 |
| PM/DEV/QA/OPS/EVAL 固定为责任/权力分离 | **组合差异**，并非单项新技术 |
| TASK→REPORT→事实核查→QA/EVAL→ADMIN 验收 | **组合设计**，需要分别定义各角色的输入、产出与权限 |
| Trace 与正式治理事实严格分离 | **治理建模重点**，需要检查事件如何影响正式状态 |
| “物理 done ≠ 业务 PASS；approved ≠ truth” | **工作治理语义**，主流 Runtime 通常不负责定义 |
| 冲突、负向结果、人工接受失败结果仍保留原义 | **目前仍是值得证明的差异点** |
| 跨重启重建“谁有权、什么被接受、为何合法” | **跨实现研究问题**，需要稳定规范和兼容性验证 |

## 7.4 TMPA/FCoP 是否已经形成新的工作治理结构

<!-- VISUAL-V4:START -->
![图12：从执行完成到正式验收](/assets/saaw-2026/figures/12_zh.png)

*图 12：任务、交付、事实核查、QA 审查、EVAL 观察与 ADMIN 验收的职责关系。连线表示概念关联，不要求 EVAL 成为每次验收的必经节点；正式先后顺序与状态迁移以具体协议和实现为准。 来源：作者根据本文相应章节的分析与文末参考资料整理绘制。*
<!-- VISUAL-V4:END -->

这些系统从不同对象出发组织工作：

- LangGraph 解决“执行怎样活下来”；
- CrewAI/Factory/SAP 解决“多个 Agent 怎样分工”；
- ServiceNow/Glean 解决“Agent 怎样被治理”；
- causaLens 解决“决策怎样被可信事实和规则验证”；
- FCoP/TMPA/CodeFlowMu 尝试继续回答：

```text
谁正式负责这项工作？
什么构成正式交付？
交付中的事实主张是否被证据支持？
执行者、QA、EVAL、程序事实核查发生冲突怎么办？
谁拥有最终接受权？
为什么最终状态在治理意义上合法？
```

> **CodeFlowMu 的架构重点，是把多智能体执行、职责分离、持续工作事实与人类验收连接起来，以工作及其责任关系作为产品组织对象。**

# 八、CodeFlowMu 的产品定位

面向中小企业，建议将产品定位表达为：

> **让一台普通电脑成为一个可上岗、可监督、可恢复、可审计的数字员工工作站。**

技术上，一个员工实例内部可以包含多角色团队；在建议的商业形态中，用户购买的是岗位交付能力。

```text
数字员工岗位
    │
    ├─ 多角色与多模型能力
    ├─ 业务工具与主机
    ├─ 工作合同和完成标准
    ├─ 权限与本次执行授权
    ├─ 工作状态、证据和恢复
    └─ 手机主管端
```

# 九、巩固 D4 岗位能力，推进治理与恢复

前两册将 CodeFlowMu 初评为 **D4（软件工程岗位）**，依据是公开协作案例与特定版本的治理实现。产品迭代应把这一岗位能力转化为稳定、易用的交付体验：

- 稳定员工身份与岗位版本；
- 自己的任务队列和任务所有权；
- 定时/事件触发的主动工作；
- 跨会话、跨日状态连续；
- 可替换模型，但岗位准入不等价；
- 明确交付物与完成标准；
- 电脑执行、手机监督。

进一步向 D5 发展，需要逐项实现并验证：

- 能力与调用时授权分离；
- 每个关键主张和动作有证据；
- 模型推断与外部事实明确区分；
- 独立角色复核，不让同一模型自证；
- 外部副作用有幂等键、结果回执和补偿；
- 进程、模型或主机变化后仍能重建责任；
- 正式状态只能由有权主体合法推进。

# 十、产品形态：可安装的数字员工工作站

<!-- VISUAL-V4:START -->
![图13：电脑执行与手机监督的产品架构](/assets/saaw-2026/figures/13_zh.png)

*图 13：原报告的产品建议：一个员工实例在电脑执行，手机承担主管职责；内部多角色共享正式工作事实。此图不宣称路线图能力已经交付。 来源：作者根据本文相应章节的分析与文末参考资料整理绘制。*
<!-- VISUAL-V4:END -->

以下为安装与激活流程建议：

```text
CodeFlowMu-Setup-x64.exe
        ↓
自动安装运行体、电脑界面、手机配对服务、更新器和诊断
        ↓
检测当前产品正式支持的宿主、模型接口与授权配置
        ↓
选择岗位并执行模型准入评测
        ↓
生成员工实例、设备身份与激活回执
        ↓
上岗
```

内部可以使用数据库或服务，但不应要求中小企业先学习 Docker、PostgreSQL、Redis、Python 和 Node。若确需持久化，应像成熟桌面产品一样嵌入、迁移和备份。

# 十一、手机网页应用：数字员工主管端

PWA 是可通过浏览器使用、也可安装到手机桌面的网页应用。在工作站路线中，建议把它定位为：

> **数字员工主管端。**

主要承担：

- 查看员工状态和当前任务；
- 接收待批准动作和异常通知；
- 查看证据、交付物和审查结果；
- 暂停、恢复、撤销授权；
- 下达正式目标；
- 与内部 PM 角色沟通。

# 十二、建议的商业产品与收费结构

## 12.1 商品单位

不按内部智能体数量收费。一个岗位内部用多少角色、模型和工具是生产技术。

建议商品单位：

> **一个激活的数字员工实例。**

## 12.2 收费分层

| 层级 | 建议商品 | 收费逻辑 |
|---|---|---|
| 试用 | 单岗位、有限任务、强制人工审查 | 14–30天 |
| 基础 | 本地数字员工工作站 | 按员工实例/月或年 |
| 专业 | 更高任务容量、定时、手机远程、备份 | 员工订阅 + 容量 |
| 岗位包 | 研究、内容、开发、市场情报 | 岗位定义/技能/工作流年费 |
| 企业 | 多员工目录、统一策略、备份、审计和私有部署 | 企业合同 |

建议分别说明软件费用与模型费用。客户可以连接产品正式支持、且其账号确有权使用的接口或宿主；拥有某个聊天产品的订阅，不自动意味着拥有外部 API 调用额度。具体接入范围、费用拆分与使用方式应以正式产品方案为准。

# 十三、第一批岗位选择

建议优先：

1. 软件开发数字员工；
2. 商业研究/市场情报数字员工；
3. 报告生产与内容运营数字员工。

这些岗位都是纯数字工作，可以在一台电脑、浏览器、文件和网络工具中完成；结果也比支付、法律承诺和生产控制更容易审查。

研究与内容岗位尤其需要核查输出中的事实主张；客服及其他岗位也应按实际业务风险设置证据与审查要求。

# 十四、未来技术研究方向

1. **模型能力档案与岗位准入：** 用真实仓库、真实研究任务和长周期任务评测模型+主机+运行体组合。
2. **事实核查机制：** 检查主张与来源、工具结果是否对应，识别证据缺失和不可信输入。
3. **TMPA：** 保存跨主体、跨周期的正式工作事实和责任关系。
4. **FCoP：** 约束任务、报告、审查和决策等正式协作语义，而不是只记录聊天。
5. **调用时授权回执：** 工具可用不代表这次针对这个对象可以执行。
6. **证据化完成：** “模型说完成”不能成为状态推进依据。
7. **幂等与恢复：** 结果已写入但响应丢失时，必须复用正式结果而不是重复副作用。
8. **独立复核：** 关键事实、代码和高风险动作不能由同一执行者自证。

# 十五、持续监测名单

商业优先监测：ServiceNow、Oracle、Glean、Devin、Sierra、Factory、Laiye Worker、WorkBuddy、Wukong、SAP、Torq、Relevance AI、Shulex。

开源优先监测：Paperclip、StaffDeck、iML Work、OACP、Gas Town/Beads、Palmier、SIDJUA、Fusion、**TICK.md、CrewAI、LangGraph、Open Agent Spec、AGNTCY/OASF、Agent Wiki、KanBanLess**。

规范/协议优先监测：**MCP、A2A、Open Agent Spec、AGNTCY/OASF、OpenTelemetry 智能体语义规范**。

触发重新评估的条件：

- 某产品公开稳定员工身份、跨日任务所有权和恢复合同；
- 某产品从点数收费转向员工实例或业务结果收费；
- 某开源项目加入调用时授权、证据化验收和独立复核；
- 某电脑智能体推出真正一键安装、手机主管端和岗位市场；
- 某模型在真实长周期编程/研究评测中显著改变岗位准入结果。

# 十六、技术成立不等于产品成立：CodeFlowMu、FCoP、TMPA 的三种不同问题

综合商业产品、公开实现与协议资料，需要把“技术完整度”和“外部采用”分开。

## 16.1 CodeFlowMu：当前最现实的问题是分发和产品认知

CodeFlowMu 内部架构复杂并不等于客户应该理解这些复杂性。对普通企业，产品入口应该压缩成：

```text
安装
→ 选择数字员工岗位
→ 选择/连接模型与 Host
→ 派工作
→ 看进度与报告
→ 处理批准
→ 最终验收
```

TMPA、FCoP、EVAL、事实核查、诊断应该是**产品内部可信机制**，而不是用户上岗前必须学习的理论。

## 16.2 FCoP：降低协议的接入与使用成本

FCoP 已经有规范、Python 包、MCP、生命周期、工具和大量治理规则，但这不自动等于“好用的开发者工具”。

尤其要警惕：

> **工具数量不是协议采用率。**

工具过多可能增加模型选择成本和用户学习负担。接入体验应先围绕常用工作流程设计，再按需展开恢复、迁移与诊断能力。

更合理的产品层应收口成少数热路径：

```text
创建任务
领取任务
提交报告
提出问题
审查结果
查看状态
完成/验收
```

其余恢复、迁移、诊断、官方维护工具继续存在，但不应该默认暴露给每一个普通 Agent。

## 16.3 分开衡量产品、协议与架构的采用

三个项目的关键指标应分别设置：

| 项目 | 建议关注的指标 |
|---|---|
| FCoP | 第三方 Runtime/Adapter、独立实现、符合性测试、外部项目采用 |
| TMPA | 外部实现、规范引用、符合性、治理模型采用、跨实现复现 |
| CodeFlowMu | 安装、激活、真实岗位工作量、留存、付费、失败恢复成功率 |

## 16.4 FCoP 的下一步更像“语言/协议”，而不是再增加工具

受 Open Agent Spec 启发，FCoP 可以研究一种声明式工作治理定义：

```yaml
roles:
  PM:
    may: [create_task, assign_task, request_rework]
  DEV:
    may: [claim_task, submit_report]
    may_not: [approve_own_report]
  QA:
    may: [review_report, pass, fail]
  EVAL:
    mode: observer
    may: [read_evidence, publish_observation]
    may_not: [mutate_lifecycle]
```

再声明生命周期和工件约束，由不同 Runtime Binding 实现。

上述 YAML 是研究示意，不是当前 FCoP 的正式配置格式。一个可检验的后续目标是：

> **出现第二个独立实现，只看 FCoP Spec 就能正确实现兼容 Reader/Writer，并通过同一套 conformance vectors。**

# 十七、最终判断

SaaW 已经是正在形成的商业方向，但还不是成熟统一类别。

前两册呈现的产品能力层次是：

```text
D2 自动化与 D2–D3 边界产品
        ↓
D3 自主智能体执行
        ↓
D4 限定岗位的数字员工
        ↓
本库尚未授予的 D5 高可信软件化数字员工
```

CodeFlowMu 的产品路线，是以现有软件工程岗位的 D4 能力为基础，改进安装、监督、交付与恢复体验，再逐步验证更严格的工作治理要求。

> **SaaW 是商业范式；CodeFlowMu 应成为可交付、可上岗的实现。**


# 参考资料

本册采用项目公开材料、官方文档与前两册的研究判断；未对全部项目进行安装实测。项目成熟度和规范等级是不同维度的初评，源码可见也不自动等于获得任意使用许可。产品路线、收费表和安装流程均为建议。

## 商业与治理
- [causaLens Digital Worker Factory](https://causalens.com/our-digital-worker-factory)
- [causaLens Reliability](https://causalens.com/the-reliability-features)
- [Factory Missions Architecture](https://factory.ai/news/missions-architecture)
- [SAP Joule Agents](https://learning.sap.com/courses/introducing-joule/getting-to-know-joule-agents_f9d18ca0-1021-4c1a-a044-4c00ec8c2898)
- [ServiceNow Evaluation Metrics](https://www.servicenow.com/docs/r/intelligent-experiences/mon-ai-evaluation-metrics-reference.html)
- [Relevance Workforce Task View](https://relevanceai.com/docs/build/workforces/workforce-features/workforce-task-view)
- [Glean Agent Governance](https://www.glean.com/ai-agents/agent-governance)

## 开源源码与协议
- [CrewAI core](https://github.com/crewAIInc/crewAI)
- [LangGraph](https://github.com/langchain-ai/langgraph)
- [TICK.md](https://github.com/Purple-Horizons/tick-md)
- [Oracle Open Agent Spec](https://github.com/oracle/agent-spec)
- [MCP 2026-07-28](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
- [A2A Protocol](https://a2a-protocol.org/)
- [Linux Foundation A2A adoption](https://www.linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year)
- [AGNTCY/OASF](https://github.com/agntcy/oasf)

## CodeFlowMu / FCoP / TMPA
- [FCoP](https://github.com/joinwell52-AI/FCoP)
- [TMPA](https://github.com/joinwell52-AI/joinwell52)
- CodeFlowMu 当前产品与历史开源版：[项目中文说明](https://github.com/joinwell52-AI/joinwell52/blob/main/README.zh-CN.md)
- CodeFlowMu 软件工程协作：[公开案例](https://joinwell52-ai.github.io/joinwell52/zh/digital-employee/2026-08-18-cursor-ai-development-team)
- CodeFlowMu V1.8.0：[I1.0 产品结果](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/zh/publications/implementation-case-i1.0/part-02.md)
