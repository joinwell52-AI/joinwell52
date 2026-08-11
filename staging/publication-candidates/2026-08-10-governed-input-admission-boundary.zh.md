---
schema: "publication-candidate-article/v1"
title: "可恢复数字员工需要受治理的输入准入边界"
date: "2026-08-10"
column: "digital-employee"
category: "daily"
summary: "可恢复数字员工应把迟到的操作员输入视为带持久 Occurrence Identity、策略校验与消费证据的准入事件，同时把外部副作用留在独立的幂等或事务边界内。"
sources:
  - "research/analysis/Q-20260810-01-governed-input-admission.md"
  - "research/reading/Q-20260810-01-durable-runstate-pending-input.md"
item_id: "Q-20260810-01"
lifecycle: "Publication Candidate"
source_research_object: "research/analysis/Q-20260810-01-governed-input-admission.md"
source_reading_result: "research/reading/Q-20260810-01-durable-runstate-pending-input.md"
cover: "staging/publication-candidates/2026-08-10-governed-input-admission-boundary-cover.webp"
visualization: "staging/publication-candidates/2026-08-10-governed-input-admission-boundary.svg"
visualization_decision: "Required — dedicated editorial Article Cover passes Cover Gate; explanatory Article Figure retained separately"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: false
---

![受治理输入准入题图](./2026-08-10-governed-input-admission-boundary-cover.webp)

# 可恢复数字员工需要受治理的输入准入边界

一个能够暂停、等待人工输入、跨进程恢复并继续调用工具的数字员工，仅仅保存聊天记录是不够的。系统还必须明确：一条新收到的输入，究竟在什么时刻开始成为本次运行的权威输入。

## 摘要

**核心判断是：迟到的操作员输入应被建模为“准入事件”，而不是直接追加进对话历史。** 同一次输入必须拥有可持久识别的 Occurrence Identity，在进入下一次模型调用前经过策略校验，并能够留下“已收到、已准入、已消费”分别对应的证据。

本次已完成 Reading Result 所检查的 OpenAI Agents Python 合并实现，为 SDK 自己拥有的 RunState 范围内提供了具体工程证据。但它并不证明任意外部工具副作用具有分布式 Exactly-once 语义，因此业务动作仍需要独立的幂等键、事务边界或补偿策略。

## 来源

Production 只消费当日 Research Object `Q-20260810-01`，并仅使用已完成 Reading Result 来核对引用与证据边界。主要一手证据来自 OpenAI Agents Python 的 Issue #4323、已合并 PR #4325 与提交 `7bf73afa47ac48c1efb599d0b1505cee994e74f5`。

- Issue：https://github.com/openai/openai-agents-python/issues/4323
- 已合并 PR：https://github.com/openai/openai-agents-python/pull/4325
- 实现提交：https://github.com/openai/openai-agents-python/commit/7bf73afa47ac48c1efb599d0b1505cee994e74f5

## 观察

仓库实现把 Pending Input 保持在当前模型/工具执行之外，直到下一次模型调用前的准入边界。Reading Result 记录了几个关键机制：Pending Input 能随 `RunState` 序列化保存；它带有生成的 Occurrence Identifier；只有当未完成工作走到合适的恢复点后，输入才会被准入；Input Guardrail 在下一次模型调用前执行；校验失败的输入不会被静默消费，而是保持可恢复状态。

证据同样给出了清晰的所有权边界。SDK 可以在自身掌控的会话与准入账本中维护 Exactly-once 语义，但这不等于任意外部工具在崩溃、重试、跨主机执行时也会 Exactly-once。

![输入准入生命周期图](./2026-08-10-governed-input-admission-boundary.svg)

*图 1：迟到输入在恢复边界前保持待准入状态，经过策略校验后才进入下一次模型调用。来源：Research Center 基于文中引用的一手资料综合绘制。*

## 比较

| 输入模型 | 持久 Occurrence Identity | 准入点 | 策略校验 | 消费证据 | 外部副作用保证 |
|---|---|---|---|---|---|
| 直接追加聊天/历史 | 通常没有 | 隐式 | 容易与执行过程混在一起 | 难以区分“收到”和“已使用” | 不提供 |
| 复用 Session 开新 Run | 新 Run 边界 | 新 Run 开始 | 由新 Run 流程处理 | Session 历史可持久，但运行身份已经变化 | 不提供 |
| 可恢复 `RunState` 的 Durable Pending Input | 显式 `input_id` | 未完成工作结束后的下一次模型调用前 | 准入前执行 Guardrail | Pending/current-step 与已接纳进度被 Checkpoint | 仅 SDK 自有范围 |
| 受治理的数字员工 Input Admission Ledger | Research Center 工程方案 | 显式状态迁移 | 把策略决定记录为证据 | Received → Pending → Admitted/Rejected → Consumed | 需要独立 Tool 幂等/事务键 |

前三行对应已记录的文档或实现机制；最后一行是从 Research Object 推导出的工程设计建议，并不是在声称该 SDK 已经实现完整企业级 Admission Ledger。

## 讨论

内容相同，不代表发生的是同一次输入。两条完全相同的操作员消息可能是两个合法动作；同一个 Occurrence 如果在恢复时被重复消费，则必须被识别为重放。因此，持久 Occurrence Identity 比单纯比较输入内容更重要。

准入边界还决定了策略应该放在哪里。如果 Guardrail 在输入已经修改权威运行状态之后才执行，那么恢复语义会变得模糊：这条输入究竟是“已经接受后又被拒绝”，还是“从未接受”？受治理的运行时应把这个迁移明确化，并留下追加式证据。

最后，恢复正确性与副作用正确性必须分开。Checkpoint 可以避免模型层轻易重放一个已经完成的工具调用，但如果宿主在本地状态提交与远端业务提交之间崩溃，外部系统仍需要自己的幂等键、事务标识或补偿机制。

## 工程影响

对数字员工运行时，应建立 Input Admission Ledger，至少记录 Occurrence ID、received-at、admitted-at、Guardrail Decision、consuming run/step 与最终 disposition，并显式区分 `Received`、`Pending Admission`、`Admitted`、`Rejected/Recoverable`、`Consumed`。

对 CodeFlowMu，Worker/Run Checkpoint 与操作员输入应先作为两类独立持久状态存在，直到发生明确的 Admission Transition。对可能在 Resume 后重试的外部副作用工具，可将 Admission Occurrence ID 传播到 Tool Call Idempotency Key，并把准入与 Checkpoint 事件暴露到运行时间线。

对 TMPA，这个实现可以作为 Custody / Admission 语义的工程证据，但单个 SDK 实现不足以直接推动协议层变更。

## 边界与不确定性

现有证据证明的是 OpenAI Agents Python 中的设计意图、合并实现和回归覆盖，不证明任意存储故障、跨主机竞争或分布式系统中的 Exactly-once。这个机制也不是可以向正在执行中的模型/工具调用并发注入消息的线程安全通道，任意对话历史替换或压缩同样不在本特性范围内。

## 后续工作

产品级数字员工运行时应重点测试 Receipt、Admission、Checkpoint Persistence 与 External Side Effect 之间的崩溃点，并定义被撤回、替代或过期的 Pending Input 如何在不擦除审计历史的前提下表示。同时需要决定 Occurrence Identity 是传播到所有下游工具，还是仅传播到具有外部副作用的调用。

## 可视化说明

题图位于文章头部，以受控闸门表现迟到输入的保存、校验与准入边界；嵌入“观察”部分的解释图用于精确说明输入生命周期。两种视觉角色使用不同资产；未使用厂商原图，也未构造无来源数值。

## 参考资料

1. OpenAI `openai-agents-python` Issue #4323，Durable Input 需求与验收场景：https://github.com/openai/openai-agents-python/issues/4323
2. OpenAI `openai-agents-python` PR #4325，已合并 Durable Pending Input 实现：https://github.com/openai/openai-agents-python/pull/4325
3. OpenAI `openai-agents-python` 提交 `7bf73afa47ac48c1efb599d0b1505cee994e74f5`：https://github.com/openai/openai-agents-python/commit/7bf73afa47ac48c1efb599d0b1505cee994e74f5
4. Research Center Research Object：`research/analysis/Q-20260810-01-governed-input-admission.md`
5. Research Center Reading Result：`research/reading/Q-20260810-01-durable-runstate-pending-input.md`

> Editing status：Production Candidate 通过。事实边界、SDK 语义范围、外部副作用边界、中英文结构与证据可追溯性均已检查；尚未发布。
