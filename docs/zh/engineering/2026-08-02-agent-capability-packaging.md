---
title: 开源工程观察周报 002 — Agent 能力正在被封装为 Skill、Plugin 与 Contract
date: '2026-08-02'
column: open-source-engineering
category: weekly
summary: OpenHands、CrewAI、AutoGen 与 LangGraph 显示，可复用 Agent 能力正从隐藏 Prompt 转向显式 Skill、Plugin、Tool、Workflow、Message Contract 与结构化 Event。
sources:
  - OpenHands skills and plugins documentation
  - CrewAI agents, flows, and observability documentation
  - AutoGen teams, application stack, memory, and logging documentation
  - LangGraph runtime and human-in-the-loop documentation
outline: deep
---

<ArticleCover
  image="/assets/covers/engineering-weekly-002.svg"
  kicker="开源工程观察 · 周报 002"
  title="Agent 能力正在被封装为 Skill、Plugin 与 Contract"
  summary="可复用能力正在离开隐藏 Prompt，进入显式 Package、Interface、Workflow Node 与 Event。"
  version="EW002"
  status="发布于 2026-08-02"
  languageHref="/en/engineering/2026-08-02-agent-capability-packaging"
  languageLabel="English"
/>

## Summary

第二个开源工程信号，是 Agent 能力的表达方式正在改变。早期系统常把能力藏在一段长 Prompt 和一个无限制 Tool List 中；当前系统越来越多地把能力封装为可检查的显式组件。

OpenHands 使用 Skill、Hook、MCP Configuration、Specialized Agent、Command 与 Plugin；CrewAI 分离 Agent、Task、Tool、Crew、Flow、Guardrail、Memory、Knowledge 和 Structured Output；AutoGen 将 AgentChat Team 与 Event-driven Core 分开，并要求应用定义 Message Contract；LangGraph 将 Node、State、Edge、Interrupt 和 Persistence 作为显式编排组件。

本周判断是：

> 可复用 Agent 能力正在成为受治理的能力包，需要名称、范围、激活规则、接口、版本、Runtime 依赖、Event Surface 和证据链。单独一段 Prompt 不能构成完整 Skill Contract。

## Source

本周选择以下官方资料，覆盖四个互补方向：

1. **OpenHands Skills 与 Plugins**：`SKILL.md`、Always-on Context、Triggered Skill、Plugin Package、Hook、MCP Server、Agent 与 Command。
2. **CrewAI Agents 与 Flows**：岗位化 Agent、Tool、Memory、Knowledge、Structured Output、Persistent Flow、Guardrail、Callback 与 Observability。
3. **AutoGen Teams 与 Core**：团队模式、Handoff、Event-driven Runtime、Message Protocol、Memory Interface、State Serialization 与 Structured Logging。
4. **LangGraph Orchestration**：显式 State、Node、Transition、Interrupt、Persistence 与 Human Decision Point。

这些资料揭示了工程模式，但尚不能证明存在一个统一 Skill Packaging 标准。

## Weekly Highlights

### 1. Skill 正从 Prompt 文本转向可加载 Artifact

OpenHands 把 Skill 定义为增强 Agent 的专门知识和工作方式，但通过文件和明确加载行为进行封装。Always-on Context 与 On-demand Skill 分开；Keyword Trigger 或 Agent 自主选择支持 Progressive Disclosure；组织、用户和仓库级 Scope 也被区分。

这比把所有规则复制进每次 System Prompt 更容易维护和审计。

### 2. Plugin 正在成为能力组合包

OpenHands Plugin 可以同时包含 Skill、Hook、MCP Configuration、Specialized Agent 与 Command。重要变化是：一个能力包可以同时携带知识和 Runtime Integration。

```text
能力包
  ├── Skill 指令
  ├── Tool / MCP Binding
  ├── Lifecycle Hook
  ├── Specialized Agent Definition
  ├── Command
  └── Versioned Package Metadata
```

*图：joinwell52 Research Center 根据 OpenHands Plugin 文档整理。*

### 3. Workflow 系统正在分离能力与编排

CrewAI 将 Agent 与 Tool 同负责 Route、Persist 和 Resume 的 Flow 分开；LangGraph 将 Node Behavior 与 State、Transition 分开；AutoGen 将 Agent 与 Team Pattern、Event-driven Runtime 分开。

这让同一 Skill 或 Tool 可以在不同 Workflow 中复用，而不需要重新定义完整数字员工。

### 4. Message 与 Event Contract 正变得重要

AutoGen Application Stack 要求开发者把 Message Type 定义为 Behavior Contract，并把 Trace Log 与 Structured Event 分离。这表明 Agent Interaction 需要 Machine-readable Interface，而不仅是自由文本。

当其他组件无法判断以下内容时，一个能力在工程上仍不完整：

- 接受什么 Input；
- 承诺什么 Output；
- 发出什么 Event；
- 可以返回什么 Error 或 Hold；
- 需要什么 Authority；
- 如何进行 Versioning。

## Cross Analysis

### 能力表达矩阵

| 维度 | OpenHands | CrewAI | AutoGen | LangGraph |
|---|---|---|---|---|
| 主要能力单元 | Skill / Plugin / Agent / Command | Agent / Tool / Task / Crew | Agent / Team / Message Handler | Node / Runnable / Graph |
| 激活方式 | Always-on、用户触发、关键词或 Agent 选择 | Task/Process/Flow Invocation | Runtime Message、Team Selection、Handoff | Edge、Condition、Interrupt、Command |
| Tool 集成 | Plugin 与 MCP Configuration | Agent Tool 与 Integration Tool | Tool-capable Agent 与 Extension | Tool Node 与应用代码 |
| State | Conversation 与 Workspace Context | Flow 与 Crew State | Agent/Team State 与 Memory Protocol | 显式 Graph State 与 Checkpoint |
| Interface Contract | Skill Format 与 Plugin Structure | Structured Input/Output 与 Pydantic Model | Message Protocol 与 Event Type | State Schema 与 Node Transition Contract |
| Observability | Runtime/Plugin Log 与 Hook | Trace、Callback、Monitoring | Trace Logger 与 Structured Event Logger | State History 与 Trace Integration |
| 分发方式 | Registry / Repository Package | Project Package 与托管平台 | Python Component 与 Distributed Runtime | Library、Deployment 与 Runtime Service |

**说明：** 本表比较官方抽象，不代表功能等价或质量评测。

### 建议的最小 Skill Contract

```yaml
skill:
  id:
  version:
  purpose:
  activation:
  input_contract:
  output_contract:
  allowed_tools:
  required_authority:
  runtime_dependencies:
  emitted_events:
  failure_states:
  evidence_requirements:
  owner:
```

这是 Research Center 的研究投影，不是冻结产品 Schema。

## New Architecture Judgment

1. **Skill 应是显式 Artifact。** 隐藏 Prompt 无法可靠发现、版本化、激活和审计。
2. **能力与 Workflow 必须分开。** Skill 说明可以做什么；Workflow 决定何时以及按什么顺序使用。
3. **Plugin 可以把知识绑定 Runtime 基础设施。** 这很强，但扩大了安全与审查边界。
4. **Message 与 Event Contract 是多 Agent 组合的必要条件。** 自由文本不足以支持可靠编排。
5. **激活状态必须可观察。** Installed、Loaded、Selected、Executed 与 Verified 是不同状态。

## Engineering Impact

### TMPA

本报告不修改 TMPA 正式出版物。作为研究输入，它支持在 Capability Activation 与 Execution 中明确 Role、Authority、Message、Event、Lifecycle 和 Integrity 之间的 Reference。

### Digital Employee

数字员工应拥有受治理的 Capability Catalog。每个 Skill 需要 Scope、Version、Owner、Authority Requirement、Runtime Binding、Evidence Expectation 与 Evaluation History。

### CodeFlowMu

CodeFlowMu 当前已经加载 Skill 并记录 Tool Usage，但产品需要明确区分：

```text
available
→ installed
→ activated
→ invoked
→ completed
→ verified
```

Runtime 应记录每个 WorkOrder 实际启用了哪个 Skill Version，以及产生了哪些 Structured Event 与 Evidence。

## Next Week Research

1. 比较 AgentSkills、Claude Code Plugin、MCP Server 与 Framework-specific Tool。
2. 为 CodeFlowMu 定义可移植 Skill Contract。
3. 研究第三方能力包的签名、信任和权限模型。
4. 测试同一 Skill 在不同 Agent Provider 下能否保持一致行为。

## References

1. OpenHands，**Skills overview**：https://docs.openhands.dev/overview/skills
2. OpenHands，**Organization and User Skills**：https://docs.openhands.dev/overview/skills/org
3. OpenHands，**Adding New Skills**：https://docs.openhands.dev/overview/skills/adding
4. OpenHands，**Plugins**：https://docs.openhands.dev/sdk/guides/plugins
5. CrewAI，**Documentation**：https://docs.crewai.com/
6. CrewAI，**CrewAI AMP**：https://docs.crewai.com/enterprise/introduction
7. Microsoft AutoGen，**Teams**：https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/teams.html
8. Microsoft AutoGen，**Application Stack**：https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/core-concepts/application-stack.html
9. Microsoft AutoGen，**Memory and RAG**：https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/memory.html
10. Microsoft AutoGen，**Logging**：https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/framework/logging.html
11. LangChain，**LangGraph overview**：https://docs.langchain.com/oss/python/langgraph/overview
