---
title: 行业架构每日研究 003 — A2A 与 MCP 定义了不同的互操作边界
date: '2026-08-02'
column: industry-architecture
category: daily
summary: A2A v1.0 与 MCP 2026-07-28 规范虽然在长任务等运行能力上存在重叠，但仍然治理不同的信任边界：独立 Agent 之间的协作，以及应用对工具、上下文和能力的访问。
sources:
  - A2A Protocol v1.0 documentation and specification
  - Model Context Protocol specification 2026-07-28
outline: deep
---

<ArticleCover
  image="/assets/covers/daily-a2a-mcp-boundaries.svg"
  kicker="行业架构 · 每日研究 003"
  title="A2A 与 MCP 定义了不同的互操作边界"
  summary="Agent-to-Agent 协作与 Agent-to-Capability 集成是互补边界，而不是可互换的协议标签。"
  version="ID003"
  status="Production Test V1 · 2026-08-02"
  languageHref="/en/industry/2026-08-02-a2a-mcp-interoperability-boundaries"
  languageLabel="English"
/>

## Summary

A2A Protocol v1.0 与当前 Model Context Protocol 规范都在变得更丰富。A2A 支持 Discovery、Authenticated Interaction、Task Lifecycle、Message、Artifact、Streaming、Polling、Webhook 和多种 Protocol Binding。MCP 支持 Host–Client–Server 连接、Resource、Prompt、Tool、Elicitation、Progress、Cancellation、Error Reporting，以及异步 Task 与 Skill 等可选 Extension。

功能集合不断扩展，容易让两个协议看起来可以互换。但它们的架构中心仍然不同。

Research Center 的判断是：

> A2A 治理与一个独立运营、内部实现可以保持不透明的 Agent 协作；MCP 治理 LLM Application 如何发现并调用外部提供的上下文与能力。决定性边界不在于双方是否都能运行长任务，而在于边界另一侧由谁拥有工作、状态、政策与完成判断。

一个生产系统可以同时使用二者：独立服务之间使用 A2A，而每个服务内部再通过 MCP 访问工具、数据或已封装 Skill。

## Source

### 入选的一手资料

1. **A2A Protocol v1.0 文档与规范**：入选原因是 v1.0 是首个稳定、面向生产的版本，并且明确说明 A2A 服务于 Agent-to-Agent Communication，不是 Sub-agent 或 Tool-call Protocol，也不替代 MCP。
2. **Model Context Protocol 2026-07-28 规范**：入选原因是它是当前权威版本，定义 Host/Client/Server 模型、Capability Negotiation、Resource、Prompt、Tool、Elicitation 与可选 Extension。

两个协议都由社区持续演进。本笔记记录引用版本中的正式架构；实际 Implementation 可能只支持其中一部分。

## Observation

### 1. A2A 把远端看作 Agent Service

A2A 以 Agent Card 为入口，以 Message、Part、Task、TaskStatus、TaskState 与 Artifact 构成 Interaction Model。Client 发现远端 Agent 的能力，选择支持的 Interface，完成 Authentication，并在不访问其内部 Memory、Framework 或 Tool 的情况下请求工作。

远端可以拥有持久 Task Lifecycle，并通过同步响应、Polling、Streaming 或 Push Notification 返回 Progress 与 Artifact。

这是 Service-to-Service Collaboration Boundary。

### 2. MCP 把远端看作上下文与能力提供者

MCP 以 LLM Host Application、Host 内的 Client，以及提供 Resource、Prompt 与 Tool 的 Server 为中心。当前规范还包括 Utility，以及 Task、Skills over MCP、MCP Apps 等 Opt-in Extension。

Host 仍然负责 User Consent、Tool Authorization、Model Interaction，以及 Server Capability 如何参与更大的 Workflow。

这是 Application-to-Capability Integration Boundary。

### 3. 长任务能力不会消除二者差别

当前 MCP 规范已经包含带 Durable Handle、Polling 与 Mid-flight Input 的可选 Tasks Extension；A2A 同样具有 Durable Task 与异步 Delivery。因此，“A2A 是异步的，而 MCP 只会同步 Tool Calling”已经不是准确区分。

更深层的差别是 Control Ownership：

| 问题 | A2A 的默认中心 | MCP 的默认中心 |
|---|---|---|
| 被发现的对象 | 独立 Agent 及其 Skill/Interface | Server 提供的 Resource、Prompt、Tool、Extension |
| 谁拥有远端执行 | Remote Agent Service | MCP Server Capability，由 Host 编排 |
| 主要交互对象 | Message、Task、Artifact | 围绕 Capability 的 JSON-RPC Request/Response/Notification |
| 内部实现是否需要暴露 | 可以保持不透明 | Capability Contract 向 Host 暴露 |
| 典型权威边界 | Peer Service 或组织边界 | 应用内部的 Tool/Data Integration Boundary |
| 谁负责完成判断 | Remote Agent 报告 Task State 与 Artifact，Caller 仍需验证 | Host 把 Tool Result 组合进自身 Workflow Judgment |

*表：joinwell52 Research Center 根据 A2A 与 MCP 规范综合。*

### 4. 两个协议都无法仅靠 Schema 完成安全治理

A2A 在 Agent Endpoint 和公开 Security Scheme 周围定义 Authentication 与 Authorization 预期。MCP 强调明确 User Consent、Data Privacy、谨慎对待 Tool Description，以及完整 Authorization Flow。

但任何协议都不能单独判断某项业务动作是否适当。组织 Authority、Policy、Evidence 与 Release Gate 仍属于应用责任。

## Discussion

### 三层互操作结构

比“二选一协议”更有用的架构，是分开三个层次：

```text
Layer 1 — Internal Orchestration
  Role、Sub-agent、Workflow Node、Local Message、State Machine

Layer 2 — Capability Integration
  MCP Resource、Prompt、Tool、Skill、Task、App

Layer 3 — Independent Agent Collaboration
  A2A Discovery、Message、Task、Artifact、Remote Lifecycle
```

*图：joinwell52 Research Center 综合。*

内部编排不一定需要 A2A。一个 Manager 在同一 Runtime 中调用有边界的 Specialist，通常更适合使用 Native Workflow Primitive。Runtime 需要 Typed Capability 或 Data Source 时，MCP 更自然。当另一侧是独立部署、独立治理，并且被要求拥有一项有意义的工作单元时，A2A 才真正进入架构中心。

### 协议选择应跟随问责关系

错误的问题是：“哪个协议功能更多？”

更好的问题是：

1. 远端是 Tool/Capability，还是一个可问责 Worker/Service？
2. 谁拥有 Task State 与 Retry？
3. 谁有权解释 Completion？
4. 哪一侧保留 Conversation 与 Workflow Control？
5. 哪些 Evidence 必须跨越边界？
6. 远端内部实现能否保持不透明？

这些问题比 Transport 或 Message Shape 更能决定协议边界。

### FCoP 位于不同的运行尺度

FCoP 通过持久文件系统 Artifact 与 Lifecycle Transition 协调 Role。它主要是已知团队和共享 Workspace 内部的协作与治理机制。

A2A 面向独立 Agent System 之间的网络通信。MCP 向 LLM Application 暴露 Tool 与 Context。因此，FCoP 不应被重新贴成其中任意一种协议。

未来可以在外部边界上，把选定的 FCoP Task 与 Report 映射为 A2A Task 与 Artifact，同时让 FCoP 继续作为内部 System of Record。同样，单个 CodeFlowMu Skill 或 Data Service 可以通过 MCP 暴露，而不改变内部 Custody Rule。

### 避免协议扁平化

如果所有 Specialist 都被表示成 Tool，组织 Ownership 与独立 Task State 可能消失；如果所有 Tool 都被表示成 Agent，集成会不必要地变重，问责也会模糊。

架构必须保持以下操作的语义差别：

```text
调用一种能力
分派一项可问责工作
转移会话控制权
协调一个内部角色
```

它们彼此相关，但不是同一种操作。

## Engineering Impact

### TMPA

本笔记不直接修改 TMPA 正式出版物。它为 Actor、Role、Message、Task、Artifact、Authority 与外部 Protocol Boundary 的区分提供研究输入。确定性重建必须保存每个 Lifecycle Transition 与 Completion Claim 由哪个系统拥有。

### Digital Employee

数字员工平台应暴露两套独立 Integration Surface：

- 面向 Tool、Data、Prompt 与 Packaged Skill 的 Capability Surface；
- 面向独立治理的 Digital Employee 或外部 Agent Service 的 Work-delegation Surface。

Position 与 WorkOrder Contract 应决定某项 Operation 可以使用哪一种 Surface。

### CodeFlowMu

CodeFlowMu 应把下列映射作为待验证研究假设：

```text
FCoP / Native Runtime → 内部团队协调
MCP                   → Tool、Data 与 Skill 集成
A2A                   → 外部 Agent-service 协作
```

第一个工程实验不应一次加入所有协议。应选择一个有边界的外部任务，定义相同 Evidence 与 Completion Requirement，分别实现 MCP Capability 版本和 A2A Delegated-work 版本，再比较 Ownership、Recovery、Observability 与 Auditability。

## Future Work

1. 建立显式 Protocol-selection Decision Record。
2. 比较 A2A Task State 与 FCoP Lifecycle State，但不强迫一一对应。
3. 深入研究 MCP 2026-07-28 规范中的 Tasks 与 Skills Extension。
4. 定义 Remote Agent 返回 Artifact 时必须携带的 Evidence Envelope。
5. 测试两个协议中的 Authentication、Cancellation、Retry、Timeout 与 Duplicate Submission。
6. 判断 A2A Agent 内部通过 MCP 调用 Tool 时，Human Approval 应位于哪一层。

## References

1. A2A Protocol，**A2A Protocol home**：https://a2a-protocol.org/latest/
2. A2A Protocol，**Specification**：https://a2a-protocol.org/latest/specification/
3. A2A Protocol，**A2A Protocol Ships v1.0**：https://a2a-protocol.org/latest/announcing-1.0/
4. Model Context Protocol，**Specification 2026-07-28**：https://modelcontextprotocol.io/specification/2026-07-28
