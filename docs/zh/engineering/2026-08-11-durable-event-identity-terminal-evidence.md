---
title: "Agent 运行需要持久身份与显式终态证据"
date: "2026-08-11"
column: "open-source-engineering"
category: "daily"
summary: "逻辑发生身份应在进入异步边界前创建并跨重试复用，同一逻辑执行还需要显式成功/失败终态证据完成闭合。去重身份能提升对账能力，但不能直接证明端到端 exactly-once 或无损交付。"
sources:
  - "research/analysis/Q-20260811-03-event-identity-terminal-evidence.md"
  - "research/reading/Q-20260811-03-durable-event-identity-terminal-evidence.md"
item_id: "Q-20260811-03"
lifecycle: "Published"
source_research_object: "research/analysis/Q-20260811-03-event-identity-terminal-evidence.md"
source_reading_result: "research/reading/Q-20260811-03-durable-event-identity-terminal-evidence.md"
cover: "/assets/covers/daily-2026-08-11-durable-event-identity-terminal-evidence.svg"
visualization: "/assets/covers/daily-2026-08-11-durable-event-identity-terminal-evidence-figure.svg"
visualization_decision: "Required — 独立身份/终态编辑性题图 + 独立重试与终态证据解释图"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
outline: deep
---

# Agent 运行需要持久身份与显式终态证据

分布式 Agent 系统经常把三件不同的事情混在一起：“这次逻辑发生有唯一身份”“传输层没有重复写入”“业务动作只执行一次”。三者并不等价。持久 Occurrence ID 首先是一种**对账原语**；真正关闭一次逻辑执行，还需要明确的终态证据。

## 题图

![持久身份编辑性题图](/assets/covers/daily-2026-08-11-durable-event-identity-terminal-evidence.svg)

## 解释图

![持久身份与终态证据解释图](/assets/covers/daily-2026-08-11-durable-event-identity-terminal-evidence-figure.svg)

## 摘要

Google ADK 的一项已合并 Analytics 改动，在异步交付之前创建稳定 `event_id`，并在重试时继续复用同一个 ID；同时引入可选的 Committed Stream + Explicit Offset 模式，并增加 Final LLM Response 与 Workflow Node 的显式成功/失败终态元数据。

同一实现也清楚暴露了保证边界：默认路径仍可能产生重复物理行；Committed Stream 在 Retry Exhaustion、Offset Conflict 或 Stream Rotation Failure 时仍可能丢行；实现中展示的 Offset / Desynchronization State 是进程内状态，没有证明跨重启持久恢复。

Research Center 的判断因此必须保持精确：**在进入异步边界之前分配持久逻辑身份，在所有重试中复用它，并为同一逻辑执行写入 Typed Terminal Evidence。只有真正拥有端到端保证的层，才有资格使用 exactly-once 这样的表述。**

## 来源

主要一手证据是 Google ADK 已合并实现 Commit `04b8b72709f6d17b503cf674c8ac1b89798f655e`：

- https://github.com/google/adk-python/commit/04b8b72709f6d17b503cf674c8ac1b89798f655e

同日 Reading Result 已记录 Writer State Machine、重试复用、Offset Conflict、Drop Boundary、Final-only LLM Termination Metadata，以及 `NODE_OUTPUT` / `NODE_ERROR` 的显式终态证据。

## 观察

实现会在 Analytics Row 创建时分配 `event_id`，时间点早于异步写入。由于 Retry 会重发同一 Row，逻辑 Occurrence Identity 能跨越模糊传输重试保持不变。默认模式并不阻止重复物理行，而是让下游可以识别这些行属于同一个逻辑发生并进行 Query-time Deduplication。

可选 Committed Stream 模式进一步引入 Explicit Offset 和本地冲突处理。模糊发送之后遇到同 Offset 的 `AlreadyExists` 可以被解释为此前写入已提交；如果本地没有模糊发送却发现 Offset 被占用，则 Stream 被标记为 Desynchronized，并进入 Rotation / Drop Accounting。实现明确选择“有界失败 + 显式丢失边界”，而不是宣称系统无损。

终态证据也更明确。Final LLM Finish Metadata 只出现在最终 Response Row 上，Workflow Node 则可以产生带 Run / Node Identity 的 `NODE_OUTPUT` 和 `NODE_ERROR`。这样 Progressive Telemetry 与 Terminal Outcome 成为两类不同证据。

## 比较

| 机制 | 改善了什么 | 仍然没有证明什么 | 证据类型 |
|---|---|---|---|
| Enqueue 前创建稳定 `event_id` | Retry / Duplicate 对账 | Storage-level exactly-once | 已合并实现 + 测试 |
| Retry 复用同一 ID | 逻辑发生连续性 | 外部副作用幂等 | 已合并实现 + 测试 |
| Committed Stream + Offset | 缩小单一 Live Writer 内的模糊重复风险 | Restart-safe、Lossless Delivery | 已合并实现；明确暴露丢失边界 |
| Typed Terminal Event | 可查询的成功/失败闭合证据 | 每个业务结果都语义完整 | 已合并实现 + 测试 |
| Drop / Conflict Counter | 把模糊性变成可观察证据 | 自动完成业务恢复 | 实现事实 + Research Center 分析 |

## 讨论

Identity 与 Guarantee Scope 必须分开。唯一 Event ID 不能阻止下游 Sink 接收到两份物理副本，它只能让消费者知道这两份副本代表同一次逻辑发生。同样，Analytics Transport 的去重也不能证明外部 Tool Call 或 Business Transaction 只执行一次。

这对 Runtime Governance 非常关键。如果一个任务因为 Timeout 被 Retry，重试应该继续保留原来的 Logical Occurrence ID，同时产生新的 Physical Delivery Attempt Evidence。最终 Terminal Event 再用同一个 Occurrence ID 明确写出 Success、Failure、Cancellation 或 Externally Handed-off Outcome。

“没有看到错误”也不是终态证据。如果冲突恢复可能主动丢行，Runtime 需要同时保留 Positive Terminal Evidence 和 Ambiguity / Drop Counter。静默日志不能被解释成“什么都没有失败”。

## 工程影响

对于数字员工，应在 Work Item、Tool Call 或 Connector Action 进入异步 Queue / External Boundary 之前创建一个持久 Occurrence ID，并在所有 Retry / Recovery 路径中保持不变。Worker / Task Success、Failure、Cancellation 和 External Handoff 都应该有显式终态事件，而不能从日志静默推断完成。

对于 CodeFlowMu，Runtime Timeline、Report 和 Evidence Record 应引入稳定 Event ID，但必须继续区分 Logical Occurrence Identity 与 Physical Delivery Identity。Duplicate、Retry-exhausted、Offset-conflict 和 Dropped-event Counter 都应作为治理证据长期保留，即使后续 Recovery 成功。

对于 TMPA，这项实现是 Append-only Provenance 和 Explicit Terminal-state Semantics 的有效研究证据，但单一 Analytics Plugin 不足以支持端到端 exactly-once 的协议级结论。

## 边界与不确定性

该实现明确没有证明所有故障下无损交付，也没有证明进程重启后 Durable Offset Reconstruction。Analytics `event_id` 标识的是 Analytics Occurrence，不是任意外部商业动作。`NODE_OUTPUT` / `NODE_ERROR` 能改善可观察性，但仍不能保证每一种 Workflow Node 都产生语义完整的业务结果。

## 后续研究

Agent Runtime 需要定义一套 Identity Hierarchy，把 Runtime Task、Worker Claim、Tool/Action Attempt 和 Evidence Event 关联起来而不混为同一种 ID。Restart Recovery 还需要明确 Durable Occurrence Identity 如何与本地 Offset / Retry State 对账；运维策略也应规定 Duplicate / Conflict / Drop Counter 达到什么阈值时必须触发 Alert、Quarantine 或 Governed Re-execution。

## 可视化说明

题图使用“稳定身份环最终汇聚到终态 Seal”的编辑性隐喻；正文解释图再单独说明 Identity Creation、Retry Reuse、Terminal Success/Error 与后续 Reconciliation。两张图均为 Research Center 原创，不包含人为制造的量化数据。

## 参考资料

1. Google，`adk-python`，已合并 Analytics 实现 Commit `04b8b72709f6d17b503cf674c8ac1b89798f655e`：https://github.com/google/adk-python/commit/04b8b72709f6d17b503cf674c8ac1b89798f655e
2. Research Center Research Object：`research/analysis/Q-20260811-03-event-identity-terminal-evidence.md`
3. Research Center Reading Result：`research/reading/Q-20260811-03-durable-event-identity-terminal-evidence.md`

> 发布状态：已通过 Publication 门禁并正式发布；正文内容未对 Production Candidate 进行实质性改写。
