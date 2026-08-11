---
title: 开源工程观察周报 001 — 持久化智能体运行时正在成为基础能力
date: '2026-08-02'
column: open-source-engineering
category: weekly
summary: LangGraph、OpenHands、CrewAI 与 AutoGen 共同显示，智能体系统正从短生命周期模型循环转向持久状态、受控中断、恢复、隔离与结构化运行。
sources:
  - LangGraph persistence and human-in-the-loop documentation
  - OpenHands runtime and sandbox architecture
  - CrewAI flows and production documentation
  - AutoGen state and logging documentation
outline: deep
---

<ArticleCover
  image="/assets/covers/engineering-weekly-001-zh.svg"
  kicker="开源工程观察 · 周报 001"
  title="持久化智能体运行时正在成为基础能力"
  summary="持久化、检查点、中断、恢复、隔离环境与结构化运行正在成为智能体运行时的标准设施。"
  version="EW001"
  status="发布于 2026-08-02"
  languageHref="/en/engineering/2026-08-02-durable-agent-runtime"
  languageLabel="English"
/>

## 摘要

本周最重要的开源工程信号，不是模型推理能力再次提升，而是智能体系统开始摆脱短生命周期模型循环。工程关注点正在转向：状态保存在哪里、执行在哪里暂停、失败后如何恢复、高风险动作如何审核，以及工具究竟运行在什么环境中。

LangGraph 将持久化、检查点、人工中断和容错恢复作为运行时基础能力；OpenHands 将智能体逻辑与隔离执行环境分开；CrewAI 将智能体团队与持久流程、生产部署结合；AutoGen 提供状态保存与加载、团队控制、终止条件、跟踪日志和结构化事件日志。

本周判断是：

> 生产级智能体运行时已不能只由工具调用定义。它至少必须具备持久状态、中断、恢复、隔离、可观测和明确完成控制。

## 来源

本周选择以下官方材料，因为它们描述了具体运行机制，而不只是产品宣传：

1. **LangGraph 持久化与人工参与文档**：检查点、工作线程、待处理写入、故障恢复、批准/编辑/拒绝与继续执行。
2. **OpenHands 运行时与隔离环境文档**：Docker 隔离、进程与远程隔离环境、运行时插件、命令执行和服务暴露。
3. **CrewAI 文档**：有状态流程、长流程恢复、护栏、人工触发、可观测与部署。
4. **AutoGen 文档**：团队状态、保存/加载、终止条件、跟踪日志与结构化事件日志。

这些资料可以证明公开机制的存在，但不能独立证明它们在所有生产负载下都达到相同可靠性。

## 本周重点

### 1. 持久化正在进入运行时核心

LangGraph 将图状态以检查点形式按工作线程保存，从而支持中断、记忆、历史状态调试和故障恢复。待处理写入可以避免同一计算步骤中已经成功的节点在其他节点失败后被重复执行。

AutoGen 支持保存和加载智能体、团队与终止条件。CrewAI 流程也强调状态管理、持久化和长流程恢复。

共同方向已经清楚：运行时状态必须跨越单次模型响应与单个进程生命周期。

### 2. 人工审核正在成为执行状态

LangGraph 的人工参与中间件可以在敏感工具调用之前暂停，并在批准、编辑或拒绝后恢复。这不是一个简单确认弹窗，而是把图状态持久化，让执行能够安全停止并从同一工作线程继续。

CrewAI 也把人工触发放入任务与流程控制中。其工程模式是：

```text
拟执行动作
    ↓
政策判断
    ↓
持久化中断
    ↓
人工决定
    ↓
恢复 / 修改 / 拒绝
```

*图：JoinWell52 研究中心根据官方运行时文档整理。*

### 3. 隔离正在成为运行时正确性的一部分

OpenHands 在隔离环境中执行命令、修改文件和启动服务。Docker 是推荐隔离方案；进程模式更快但被明确标记为不安全；远程隔离环境支持托管运行。

这说明工具能力与执行安全不能在事后分离。运行时必须知道动作在哪里执行，以及适用什么隔离边界。

### 4. 可观测正在分成跟踪记录与结构化事件

AutoGen 区分面向开发者阅读的跟踪日志与面向其他系统消费的结构化事件。CrewAI 强调生产流程的可观测性；LangGraph 将检查点执行连接到跟踪与调试。

两者用途不同：日志帮助人理解，结构化事件支持自动处理、指标、告警和治理。

## 交叉分析

### 运行时能力矩阵

| 运行时能力 | LangGraph | OpenHands | CrewAI | AutoGen |
|---|---|---|---|---|
| 持久状态 | 工作线程检查点与状态快照 | 隔离环境执行周边的会话和状态 | 流程状态与持久化 | 智能体与团队状态保存/加载 |
| 中断后恢复 | 原生指令恢复 | 依部署方式重启运行时或会话 | 长流程恢复 | 加载已保存的团队状态 |
| 人工审批 | 批准/编辑/拒绝式中断 | 操作者介入任务执行 | 人工参与触发器 | 用户代理与团队控制模式 |
| 故障恢复 | 检查点与待处理写入恢复 | 隔离环境重启与重建 | 流程控制和重新部署 | 外部终止、重置、状态恢复 |
| 执行隔离 | 不是主要抽象 | Docker/进程/远程隔离环境 | 依赖部署环境 | 依赖代码执行器与运行时 |
| 结构化可观测 | 状态历史与跟踪集成 | 运行时日志与环境可见性 | 内置可观测与托管监控 | 跟踪日志与事件日志分离 |
| 完成控制 | 图结束状态与节点转换 | 智能体/任务完成 | 任务/过程/流程完成 | 终止条件与团队结果 |

**说明：** 本表总结官方文档中的机制，不是性能测评。

### 最小持久化运行时契约

```text
工作身份 / 工作线程
      ↓
持久状态
      ↓
可执行步骤
      ↓
检查点 + 事件
      ↓
政策 / 人工中断
      ↓
恢复、重试或故障恢复
      ↓
有证据的完成
```

缺少其中任何一层，仍可以演示智能体，但难以作为长期工作者运行。

## 新架构判断

1. **检查点正在成为演示系统与持久系统的分界线。** 运行时必须从已记录状态恢复，而不是重新推理。
2. **人工审核必须被建模为生命周期状态。** 它不能只是聊天中的约定。
3. **执行隔离属于运行时契约。** 只有工具权限、没有隔离环境上下文是不完整的。
4. **结构化事件与人类日志服务不同消费者。** 两者都需要。
5. **完成需要明确状态转换。** 自然语言“我完成了”不能替代完成证据。

## 工程影响

### TMPA

本报告不修改 TMPA 正式出版物。作为研究输入，它强化了中断与恢复过程中事件、生命周期、执行权、完整性与读者重建的重要性。

### Digital Employee

数字员工运行时必须跨会话持久保存工作身份、当前状态、待审批动作、工具环境、恢复历史、证据和完成权威。

### CodeFlowMu

CodeFlowMu 已经具有 FCoP 生命周期文件、任务状态、恢复动作、运行时日志与角色化完成门禁。下一步应把检查点、中断、恢复和完成事件统一为稳定运行时契约，而不是分散在操作约定里。

## 后续研究

1. 比较不同运行时的检查点粒度与重放语义。
2. 研究凭据与密钥如何绑定隔离环境和工具。
3. 比较结构化事件模式与跟踪格式。
4. 测试多智能体部分失败后的恢复行为。

## 参考资料

1. LangChain，**LangGraph overview**：https://docs.langchain.com/oss/python/langgraph/overview
2. LangChain，**LangGraph persistence**：https://docs.langchain.com/oss/python/langgraph/persistence
3. LangChain，**Human-in-the-loop**：https://docs.langchain.com/oss/python/langchain/human-in-the-loop
4. OpenHands，**Runtime Architecture**：https://docs.openhands.dev/openhands/usage/architecture/runtime
5. OpenHands，**Sandbox overview**：https://docs.openhands.dev/openhands/usage/sandboxes/overview
6. CrewAI，**Documentation**：https://docs.crewai.com/
7. CrewAI，**CrewAI AMP**：https://docs.crewai.com/enterprise/introduction
8. Microsoft AutoGen，**Managing State**：https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/state.html
9. Microsoft AutoGen，**Logging**：https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/framework/logging.html
