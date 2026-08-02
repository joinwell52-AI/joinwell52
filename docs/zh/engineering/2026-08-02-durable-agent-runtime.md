---
title: 开源工程观察周报 001 — 可持久 Agent Runtime 正在成为基础能力
date: '2026-08-02'
column: open-source-engineering
category: weekly
summary: LangGraph、OpenHands、CrewAI 与 AutoGen 共同显示，Agent 系统正从短生命周期模型循环转向持久状态、受控中断、恢复、隔离与结构化运行。
sources:
  - LangGraph persistence and human-in-the-loop documentation
  - OpenHands runtime and sandbox architecture
  - CrewAI flows and production documentation
  - AutoGen state and logging documentation
outline: deep
---

<ArticleCover
  image="/assets/covers/engineering-weekly-001.svg"
  kicker="开源工程观察 · 周报 001"
  title="可持久 Agent Runtime 正在成为基础能力"
  summary="持久化、Checkpoint、中断、恢复、Sandbox 与结构化运行正在成为 Agent Runtime 的标准设施。"
  version="EW001"
  status="发布于 2026-08-02"
  languageHref="/en/engineering/2026-08-02-durable-agent-runtime"
  languageLabel="English"
/>

## Summary

本周最重要的开源工程信号，不是模型推理能力再次提升，而是 Agent 系统开始摆脱短生命周期模型循环。工程关注点正在转向：状态保存在哪里、执行在哪里暂停、失败后如何恢复、高风险动作如何审核，以及工具究竟运行在什么环境中。

LangGraph 将持久化、Checkpoint、人类中断和容错恢复作为 Runtime 基础能力；OpenHands 将 Agent 逻辑与隔离执行环境分开；CrewAI 将 Crew 与持久 Flow、生产部署结合；AutoGen 提供状态保存与加载、团队控制、终止条件、Trace Log 和结构化 Event Log。

本周判断是：

> 生产级 Agent Runtime 已不能只由 Tool Calling 定义。它至少必须具备持久状态、中断、恢复、隔离、可观测和明确完成控制。

## Source

本周选择以下官方材料，因为它们描述了具体运行机制，而不只是产品宣传：

1. **LangGraph Persistence 与 Human-in-the-loop 文档**：Checkpoint、Thread、Pending Write、故障恢复、Approve/Edit/Reject 与 Resume。
2. **OpenHands Runtime 与 Sandbox 文档**：Docker 隔离、Process 与 Remote Sandbox、Runtime Plugin、命令执行和服务暴露。
3. **CrewAI 文档**：有状态 Flow、长流程恢复、Guardrail、人工触发、可观测与部署。
4. **AutoGen 文档**：团队状态、Save/Load、Termination、Trace Logging 与结构化 Event Logging。

这些资料可以证明公开机制的存在，但不能独立证明它们在所有生产负载下都达到相同可靠性。

## Weekly Highlights

### 1. 持久化正在进入 Runtime 核心

LangGraph 将 Graph State 以 Checkpoint 形式按 Thread 保存，从而支持中断、Memory、Time Travel Debugging 和故障恢复。Pending Write 可以避免同一 Super-step 中已经成功的节点在其他节点失败后被重复执行。

AutoGen 支持保存和加载 Agent、Team 与 Termination Condition。CrewAI Flow 也强调状态管理、持久化和长流程恢复。

共同方向已经清楚：Runtime 状态必须跨越单次模型响应与单个进程生命周期。

### 2. 人工审核正在成为执行状态

LangGraph 的 Human-in-the-loop Middleware 可以在敏感 Tool Call 之前暂停，并在 Approve、Edit 或 Reject 后恢复。这不是一个简单确认弹窗，而是把 Graph State 持久化，让执行能够安全停止并从同一 Thread 继续。

CrewAI 也把人工触发放入 Task 与 Flow 控制中。其工程模式是：

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

*图：joinwell52 Research Center 根据官方 Runtime 文档整理。*

### 3. 隔离正在成为 Runtime 正确性的一部分

OpenHands 在 Sandbox 中执行命令、修改文件和启动服务。Docker 是推荐隔离方案；Process 模式更快但被明确标记为不安全；Remote Sandbox 支持托管运行。

这说明 Tool 能力与执行安全不能在事后分离。Runtime 必须知道动作在哪里执行，以及适用什么隔离边界。

### 4. 可观测正在分成 Trace 与结构化 Event

AutoGen 区分面向开发者阅读的 Trace Log 与面向其他系统消费的 Structured Event。CrewAI 强调生产 Flow 的 Observability；LangGraph 将 Checkpoint 执行连接到 Trace 与 Debugging。

两者用途不同：日志帮助人理解，结构化 Event 支持自动处理、指标、告警和治理。

## Cross Analysis

### Runtime 能力矩阵

| Runtime 能力 | LangGraph | OpenHands | CrewAI | AutoGen |
|---|---|---|---|---|
| 持久状态 | Thread Checkpoint 与 State Snapshot | Sandbox 执行周边的会话和状态 | Flow State 与持久化 | Agent 与 Team Save/Load |
| 中断后恢复 | 原生 Command Resume | 依部署方式重启 Runtime/Session | 长流程恢复 | 加载已保存 Team State |
| 人工审批 | Approve/Edit/Reject Interrupt | 操作者介入任务执行 | Human-in-the-loop Trigger | User Proxy 与团队控制模式 |
| 故障恢复 | Checkpoint 与 Pending-write Recovery | 隔离环境重启与重建 | Flow 控制和重新部署 | External Termination、Reset、State Restore |
| 执行隔离 | 不是主要抽象 | Docker/Process/Remote Sandbox | 依赖部署环境 | 依赖 Code Executor 与 Runtime |
| 结构化可观测 | State History 与 Trace Integration | Runtime Log 与环境可见性 | 内置可观测与托管监控 | Trace Logger 与 Event Logger 分离 |
| 完成控制 | Graph End 与节点转换 | Agent/Task Completion | Task/Process/Flow Completion | Termination Condition 与 Team Result |

**说明：** 本表总结官方文档中的机制，不是性能测评。

### 最小可持久 Runtime 契约

```text
工作身份 / Thread
      ↓
持久状态
      ↓
可执行步骤
      ↓
Checkpoint + Event
      ↓
政策 / 人工中断
      ↓
Resume、Retry 或 Recovery
      ↓
有证据的完成
```

缺少其中任何一层，仍可以演示 Agent，但难以作为长期工作者运行。

## New Architecture Judgment

1. **Checkpoint 正在成为 Demo 与持久系统的分界线。** Runtime 必须从已记录状态恢复，而不是重新推理。
2. **人工审核必须被建模为生命周期状态。** 它不能只是聊天中的约定。
3. **执行隔离属于 Runtime 契约。** 只有 Tool 权限、没有 Sandbox 上下文是不完整的。
4. **结构化 Event 与人类日志服务不同消费者。** 两者都需要。
5. **完成需要明确状态转换。** 自然语言“我完成了”不能替代完成证据。

## Engineering Impact

### TMPA

本报告不修改 TMPA 正式出版物。作为研究输入，它强化了中断与恢复过程中 Event、Lifecycle、Authority、Integrity 与 Reader Reconstruction 的重要性。

### Digital Employee

数字员工 Runtime 必须跨 Session 持久保存工作身份、当前状态、待审批动作、Tool Environment、恢复历史、证据和完成权威。

### CodeFlowMu

CodeFlowMu 已经具有 FCoP 生命周期文件、任务状态、恢复动作、Runtime Log 与角色化完成门禁。下一步应把 Checkpoint、Interrupt、Recovery 和 Completion Event 统一为稳定 Runtime Contract，而不是分散在操作约定里。

## Next Week Research

1. 比较不同 Runtime 的 Checkpoint 粒度与 Replay 语义。
2. 研究 Credential 与 Secret 如何绑定 Sandbox 和 Tool。
3. 比较 Structured Event Schema 与 Trace Format。
4. 测试多 Agent 部分失败后的恢复行为。

## References

1. LangChain，**LangGraph overview**：https://docs.langchain.com/oss/python/langgraph/overview
2. LangChain，**LangGraph persistence**：https://docs.langchain.com/oss/python/langgraph/persistence
3. LangChain，**Human-in-the-loop**：https://docs.langchain.com/oss/python/langchain/human-in-the-loop
4. OpenHands，**Runtime Architecture**：https://docs.openhands.dev/openhands/usage/architecture/runtime
5. OpenHands，**Sandbox overview**：https://docs.openhands.dev/openhands/usage/sandboxes/overview
6. CrewAI，**Documentation**：https://docs.crewai.com/
7. CrewAI，**CrewAI AMP**：https://docs.crewai.com/enterprise/introduction
8. Microsoft AutoGen，**Managing State**：https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/state.html
9. Microsoft AutoGen，**Logging**：https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/framework/logging.html
