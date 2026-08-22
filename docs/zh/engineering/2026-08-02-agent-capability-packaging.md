---
title: 开源工程观察周报 002 — 智能体能力正在被封装为技能、插件与契约
date: '2026-08-02'
column: open-source-engineering
category: weekly
summary: OpenHands、CrewAI、AutoGen 与 LangGraph 显示，可复用智能体能力正从隐藏提示词转向显式技能、插件、工具、工作流、消息契约与结构化事件。
sources:
  - OpenHands 技能与插件文档
  - CrewAI 智能体、流程与可观测性文档
  - AutoGen 团队、应用栈、记忆与日志文档
  - LangGraph 运行时与人在回路文档
outline: deep
cover: "/assets/covers/agent-capability-packaging-cover-v2.jpg"
---

<ArticleCover
  image="/assets/covers/agent-capability-packaging-cover-v2.jpg"
  kicker="开源工程观察 · 周报 002"
  title="智能体能力正在被封装为技能、插件与契约"
  summary="可复用能力正在离开隐藏提示词，进入显式能力包、接口、工作流节点与事件。"
  version="EW002"
  status="发布于 2026-08-02"
  languageHref="/en/engineering/2026-08-02-agent-capability-packaging"
  languageLabel="English"
/>

## 摘要

第二个开源工程信号，是智能体能力的表达方式正在改变。早期系统常把能力藏在一段很长的提示词和一个不受限制的工具列表中；当前系统越来越多地把能力封装为可检查的显式组件。

OpenHands 使用技能、钩子、MCP 配置、专用智能体、命令与插件；CrewAI 分离智能体、任务、工具、团队、流程、护栏、记忆、知识和结构化输出；AutoGen 将 AgentChat 团队与事件驱动核心分开，并要求应用定义消息契约；LangGraph 将节点、状态、边、中断和持久化作为显式编排组件。

本周判断是：

> 可复用智能体能力正在成为受治理的能力包，需要名称、范围、激活规则、接口、版本、运行时依赖、事件面和证据链。单独一段提示词不能构成完整的技能契约。

## 资料来源

本周选择以下官方资料，覆盖四个互补方向：

1. **OpenHands 技能与插件**：`SKILL.md`、常驻上下文、按需触发技能、插件包、钩子、MCP 服务器、智能体与命令。
2. **CrewAI 智能体与流程**：岗位化智能体、工具、记忆、知识、结构化输出、持久流程、护栏、回调与可观测性。
3. **AutoGen 团队与核心**：团队模式、交接、事件驱动运行时、消息协议、记忆接口、状态序列化与结构化日志。
4. **LangGraph 编排**：显式状态、节点、转换、中断、持久化与人工决策点。

这些资料揭示了工程模式，但尚不能证明存在一个统一的技能封装标准。

## 本周要点

### 1. 技能正从提示词文本转向可加载工件

OpenHands 把技能定义为增强智能体的专门知识和工作方式，并通过文件和明确的加载行为进行封装。常驻上下文与按需技能分开；关键词触发或智能体自主选择支持渐进式披露；组织、用户和仓库级范围也被区分。

这比把所有规则复制进每次系统提示词更容易维护和审计。

### 2. 插件正在成为能力组合包

OpenHands 插件可以同时包含技能、钩子、MCP 配置、专用智能体与命令。重要变化是：一个能力包可以同时携带知识和运行时集成。

```text
能力包
  ├── 技能指令
  ├── 工具 / MCP 绑定
  ├── 生命周期钩子
  ├── 专用智能体定义
  ├── 命令
  └── 带版本的包元数据
```

*图：JoinWell52 研究中心根据 OpenHands 插件文档整理。*

### 3. 工作流系统正在分离能力与编排

CrewAI 将智能体和工具同负责路由、持久化与恢复的流程分开；LangGraph 将节点行为同状态、转换分开；AutoGen 将智能体同团队模式、事件驱动运行时分开。

这让同一技能或工具可以在不同工作流中复用，而不需要重新定义完整的数字员工。

### 4. 消息与事件契约正变得重要

AutoGen 应用栈要求开发者把消息类型定义为行为契约，并把追踪日志与结构化事件分离。这表明智能体交互需要机器可读接口，而不仅是自由文本。

当其他组件无法判断以下内容时，一个能力在工程上仍不完整：

- 接受什么输入；
- 承诺什么输出；
- 发出什么事件；
- 可以返回什么错误或暂停状态；
- 需要什么权限；
- 如何进行版本管理。

## 交叉分析

### 能力表达矩阵

| 维度 | OpenHands | CrewAI | AutoGen | LangGraph |
|---|---|---|---|---|
| 主要能力单元 | 技能 / 插件 / 智能体 / 命令 | 智能体 / 工具 / 任务 / 团队 | 智能体 / 团队 / 消息处理器 | 节点 / 可运行单元 / 图 |
| 激活方式 | 常驻、用户触发、关键词或智能体选择 | 任务 / 过程 / 流程调用 | 运行时消息、团队选择、交接 | 边、条件、中断、命令 |
| 工具集成 | 插件与 MCP 配置 | 智能体工具与集成工具 | 可调用工具的智能体与扩展 | 工具节点与应用代码 |
| 状态 | 对话与工作区上下文 | 流程与团队状态 | 智能体 / 团队状态与记忆协议 | 显式图状态与检查点 |
| 接口契约 | 技能格式与插件结构 | 结构化输入输出与 Pydantic 模型 | 消息协议与事件类型 | 状态模式与节点转换契约 |
| 可观测性 | 运行时 / 插件日志与钩子 | 追踪、回调、监控 | 追踪日志与结构化事件日志 | 状态历史与追踪集成 |
| 分发方式 | 注册表 / 仓库包 | 项目包与托管平台 | Python 组件与分布式运行时 | 库、部署与运行时服务 |

**说明：** 本表比较官方抽象，不代表功能等价或质量评测。

### 建议的最小技能契约

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

这是研究中心提出的研究投影，不是已经冻结的产品数据模式。

## 新架构判断

1. **技能应是显式工件。** 隐藏提示词无法可靠发现、版本化、激活和审计。
2. **能力与工作流必须分开。** 技能说明可以做什么；工作流决定何时以及按什么顺序使用。
3. **插件可以把知识绑定到运行时基础设施。** 这很强，但也扩大了安全与审查边界。
4. **消息与事件契约是多智能体组合的必要条件。** 自由文本不足以支持可靠编排。
5. **激活状态必须可观察。** 已安装、已加载、已选择、已执行与已验证是不同状态。

## 工程影响

### TMPA

本报告不修改 TMPA 正式出版物。作为研究输入，它支持在能力激活与执行过程中，明确角色、权限、消息、事件、生命周期和完整性之间的引用关系。

### 数字员工

数字员工应拥有受治理的能力目录。每项技能需要范围、版本、负责人、权限要求、运行时绑定、证据要求与评估历史。

### CodeFlowMu

CodeFlowMu 当前已经加载技能并记录工具使用情况，但产品需要明确区分：

```text
available
→ installed
→ activated
→ invoked
→ completed
→ verified
```

运行时应记录每个工作单实际启用了哪个技能版本，以及产生了哪些结构化事件与证据。上面的英文状态词是建议保留在系统中的稳定标识，面向用户时应同时提供中文解释。

## 下周研究

1. 比较 AgentSkills、Claude Code 插件、MCP 服务器与框架专用工具。
2. 为 CodeFlowMu 定义可移植的技能契约。
3. 研究第三方能力包的签名、信任和权限模型。
4. 测试同一技能在不同智能体提供商环境下能否保持一致行为。

## 参考资料

1. OpenHands，**技能概览**：https://docs.openhands.dev/overview/skills
2. OpenHands，**组织与用户技能**：https://docs.openhands.dev/overview/skills/org
3. OpenHands，**添加新技能**：https://docs.openhands.dev/overview/skills/adding
4. OpenHands，**插件**：https://docs.openhands.dev/sdk/guides/plugins
5. CrewAI，**文档**：https://docs.crewai.com/
6. CrewAI，**CrewAI AMP**：https://docs.crewai.com/enterprise/introduction
7. Microsoft AutoGen，**团队**：https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/teams.html
8. Microsoft AutoGen，**应用栈**：https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/core-concepts/application-stack.html
9. Microsoft AutoGen，**记忆与检索增强生成**：https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/memory.html
10. Microsoft AutoGen，**日志**：https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/framework/logging.html
11. LangChain，**LangGraph 概览**：https://docs.langchain.com/oss/python/langgraph/overview
