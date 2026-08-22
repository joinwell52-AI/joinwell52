---
title: 开源工程每日观察 003 — Manager 编排与 Handoff 表达不同的工作所有权模型
date: '2026-08-02'
column: open-source-engineering
category: daily
summary: OpenAI Agents SDK 把 Manager 调用 Specialist 与转移 Active Control 的 Handoff 分开，说明多 Agent 设计必须显式建模 Ownership 与 Authority，不能把所有 Delegation 都当成同一种 Tool Call。
sources:
  - OpenAI Agents SDK agent orchestration documentation
  - OpenAI Agents SDK handoffs, guardrails, and tracing documentation
outline: deep
cover: "/assets/covers/manager-handoff-ownership-models-cover-v2.jpg"
---

<ArticleCover
  image="/assets/covers/manager-handoff-ownership-models-cover-v2.jpg"
  kicker="开源工程 · 每日观察 003"
  title="Manager 编排与 Handoff 表达不同的工作所有权模型"
  summary="保留控制权调用 Specialist，与把活动会话和责任转交出去，不是同一种操作。"
  version="ED003"
  status="Production Test V1 · 2026-08-02"
  languageHref="/en/engineering/2026-08-02-manager-handoff-ownership-models"
  languageLabel="English"
/>

## Summary

OpenAI Agents SDK 提供两种常见的 Multi-agent Composition Pattern。

在 **Manager Pattern** 中，一个 Agent 保留面向用户的 Conversation，并把 Specialist Agent 当成 Tool 调用。Manager 组合这些输出，并继续对最终答案负责。

在 **Handoff Pattern** 中，Triage Agent 或当前 Agent 把控制权转交给 Specialist。Specialist 成为 Active Agent；除非 Context 被过滤，否则它会接收此前 Conversation History，并负责后续响应。

Research Center 的判断是：

> Manager Call 与 Handoff 不是风格上的替代方案，而是不同的 Ownership、Authority、Context、Guardrail 与 Completion Model。可靠的 Multi-agent Runtime 必须记录实际发生了哪一种操作。

如果把两者都称为泛化的“Delegation”，就会隐藏最关键的运营事实：跨越边界以后，工作由谁拥有。

## Source

### 入选的一手资料

1. **OpenAI Agents SDK Agent orchestration 与 Agents 文档**：入选原因是它显式比较 Agents-as-tools 与 Handoff，并解释 Central Manager 应在什么情况下保留控制权。
2. **Handoffs 文档**：入选原因是它定义 Transfer Behavior、History Forwarding、Input Filter、Handoff Metadata，以及 Handoff 仍位于同一次 Run 内。
3. **Guardrails 文档**：入选原因是它暴露 Initial Input、Final Output、Function Tool、Hosted Tool 与 Handoff 的不同 Validation Boundary。
4. **Tracing 文档**：入选原因是它把 Agent Span、Generation、Function Call、Guardrail 与 Handoff 记录成不同 Runtime Event。

这些资料定义 SDK 行为。以下架构判断是对已记录机制的综合，并不意味着某一种 SDK Pattern 在所有场景都更好。

## Observation

### 1. Manager 保留会话和完成所有权

当 Specialist 通过 `Agent.as_tool()` 暴露时，Manager 为一个有边界的 Subtask 调用它。Specialist 把结果返回 Manager；Manager 仍然是 Active Agent，决定是否还需要更多工作，组合响应，并拥有最终 User-facing Output。

```text
User
  ↓
Manager Agent
  ├── Call Specialist A as Tool
  ├── Call Specialist B as Tool
  └── Integrate and Answer
```

当一个组件必须执行统一政策、组合多个发现、保持单一表达，或者继续对完成负责时，这种 Pattern 更合适。

### 2. Handoff 转移活动角色

Handoff 以 `transfer_to_refund_agent` 等 Transfer Operation 形式暴露给模型。调用以后，Receiving Agent 接管 Conversation。它通常会接收此前 Conversation History，但 Input Filter 或 Nested-history Setting 可以改变转交内容。

```text
User
  ↓
Triage Agent
  ↓ Handoff Event
Specialist Agent becomes Active
  ↓
Specialist responds and owns the next turn
```

因此，Handoff 会改变 Active Instruction Set、Available Tool、Contextual View，以及对 Final Output 的责任。

### 3. Validation Boundary 不相同

SDK 文档暴露了多个重要边界：

- Input Guardrail 只应用于 Chain 中第一个 Agent；
- Output Guardrail 只应用于产生最终输出的 Agent；
- Function-tool Guardrail 可以包围每次 Function Tool Invocation；
- Handoff 使用独立的 Handoff Pipeline，而不是普通 Function-tool Guardrail Pipeline；
- Hosted Tool 与 Built-in Execution Tool 具有自己的 Safety 与 Control Boundary。

如果系统假设“所有 Delegation 都被同一套 Guardrail 覆盖”，就可能产生未受保护的 Transition。

### 4. Tracing 把两种操作记录成不同 Event

Agents SDK 在 Trace 中分别记录 Function Call 与 Handoff Span。这不只是可观测性便利，而是对应不同 Runtime Semantics：Function Result 返回 Caller；Handoff 则改变 Active Agent Path。

## Discussion

### Ownership 比较

| 维度 | Manager / Agent as Tool | Handoff |
|---|---|---|
| Active Conversation Owner | Manager 保持 Active | Specialist 成为 Active |
| Specialist Scope | 有边界的 Subtask | 后续 Turn 或 Workflow Responsibility |
| Final Response Owner | Manager | Receiving Specialist |
| Context Flow | Manager 选择的 Structured Call Input 与 Local Context | 默认转交 Conversation History，可通过 Filter 调整 |
| Shared Policy Point | Central Manager 可一致执行政策 | Policy 必须跨 Receiving Agent 与 Transition 保持有效 |
| 适用场景 | Research、Calculation、Review、Bounded Expertise、Aggregation | Triage、Domain Transfer、Direct Specialist Interaction |
| 主要风险 | Manager 成为 Bottleneck 或扭曲 Specialist Output | Ownership Transfer 隐式发生或丢失必要 Context |

*表：joinwell52 Research Center 根据 OpenAI Agents SDK 文档综合。*

### Delegation 需要明确 Operation Type

Multi-agent Task Record 不应只有 `from` 和 `to`，还必须说明为什么需要另一 Agent，以及责任是否改变。

```yaml
delegation_event:
  type: consult | assign_subtask | handoff | escalate | return
  from_actor:
  to_actor:
  work_scope:
  authority_snapshot_ref:
  context_package_ref:
  expected_output_contract:
  completion_owner_before:
  completion_owner_after:
  guardrail_profile_ref:
  evidence_refs:
```

这个结构可以防止一次“Specialist Call”悄悄变成 Authority Transfer。

### Handoff 不等于创建 Child Task

Child Task 可以异步执行，同时 Parent Owner 继续负责 Integration 与 Closure。Handoff 通常转移活动会话角色。二者可以组合，但不应混同。

例如：

- PM 请求 QA 提供有边界的 Verification Report：属于 **Subtask/Consult**，PM 保留最终 Ownership。
- ADMIN 把 Operational Incident 转给 OPS，并授予 Recovery Management 权限：属于 **Handoff 或 Assignment**，Ownership 可能改变。
- QA 发现 Policy Exception 并返回 ADMIN：属于 **Escalation**，Decision Authority 改变，但 Execution Ownership 不一定改变。

Runtime 必须表示这些区别，而不能从自然语言 Message 中猜测。

### Context Transfer 应是受治理 Package

转交完整 Conversation 很方便，但可能暴露不必要数据、过期 Instruction 或不可信 Tool Output。Production Handoff 应建立 Context Package，至少包含：

- Task Identity 与 Objective；
- 已接受 Fact 与 Evidence Reference；
- 未解决问题；
- Authority 与 Policy Snapshot；
- Allowed Tool 与 Data Scope；
- Expected Output Contract；
- Explicit Exclusion；
- Return 或 Escalation Condition。

Receiving Agent 不应从长 Transcript 中自行重建 Authority。

### Completion 必须跟随 Ownership

Manager 保留 Ownership 时，Specialist Success 只代表“Subtask Result 已返回”，不代表 Parent Work 完成。Handoff 转移 Ownership 时，Completion Gate、Output Validation 与 Release Authority 必须明确移动或重新绑定。

这就是只会路由 Text 的 Orchestration Graph，与真正治理工作运行的系统之间的区别。

## Engineering Impact

### TMPA

本笔记不直接修改 TMPA 正式出版物。它为 Message Transfer、Work Assignment、Authority Transfer、Custody 与 Completion Ownership 的分离提供研究输入。确定性重建不仅要显示谁执行了动作，还要显示这次 Interaction 属于 Consultation、Subtask、Handoff、Escalation 还是 Return。

### Digital Employee

数字员工 Position Definition 应明确：

- 哪些工作可以直接接受；
- 可以咨询哪些 Specialist；
- 哪些工作可以 Handoff；
- 哪些 Authority 可以转移；
- 谁继续对最终完成负责；
- Transfer 必须携带哪些 Context 与 Evidence。

数字员工平台应把 Current Work Owner 与 Contributor 分开显示。

### CodeFlowMu

CodeFlowMu 的 PM Pattern 天然接近 Manager Orchestration：PM 拆分工作，调用 DEV/QA/OPS，整合 Evidence，再向 ADMIN 报告。对于有边界的 Specialist Work，这应继续作为默认方式。

Handoff 应只用于显式责任转移。Runtime 应新增 Typed Delegation Event，并显示：

```text
Current Owner
Contributors
Pending Subtask Owners
Decision Authority
Release Authority
Last Handoff or Return Event
```

FCoP Lifecycle Transition 可以保留 Custody，但产品不应只从 File Movement 推断 Orchestration Semantics。Task Metadata 与 Runtime Event 应明确写出 Operation Type。

## Future Work

1. 为 Research OS 与 CodeFlowMu Runtime 增加 Typed Delegation Semantics。
2. 定义 Handoff 与 Escalation 的最小 Context Package。
3. 在同一开发任务上测试 Manager、Parallel Subtask、Sequential Handoff 与 Return-to-manager Pattern。
4. 验证每个边界上的 Guardrail Coverage，包括 Hosted Tool 与 Handoff。
5. 比较 Trace Evidence、FCoP Lifecycle Event 与 Report。
6. 定义 Handoff Chain 之后由哪个 Agent 有权声明 Parent Completion。

## References

1. OpenAI Agents SDK，**Agent orchestration**：https://openai.github.io/openai-agents-python/multi_agent/
2. OpenAI Agents SDK，**Agents**：https://openai.github.io/openai-agents-python/agents/
3. OpenAI Agents SDK，**Handoffs**：https://openai.github.io/openai-agents-python/handoffs/
4. OpenAI Agents SDK，**Guardrails**：https://openai.github.io/openai-agents-python/guardrails/
5. OpenAI Agents SDK，**Tracing**：https://openai.github.io/openai-agents-python/tracing/
