---
schema: publication-candidate-article/v2
title: "重复故障不是新证据"
date: '2026-08-24'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "When an agent runtime observes several terminal conditions asynchronously, how should it prevent a generic condition from being regenerated later and erasing more specific safety evidence?"
summary: "OpenAI Agents Python 的一项已合并修复说明，Terminal Condition 需要 Consumption State，而不是 Last-writer Exception Storage。让 Guardrail Tripwire 穿过最终清理可以提高错误保真度，但不会定义所有优先级，也不会保护外部副作用。"
cover: staging/publication-candidates/2026-08-24-repeated-failure-not-new-evidence-cover.png
sources:
  - research/analysis/Q-20260824-01-terminal-condition-consumption-precedence.md
---

![重复故障不是新证据题图](staging/publication-candidates/2026-08-24-repeated-failure-not-new-evidence-cover.png)

# 重复故障不是新证据

Streaming Agent 超过 Turn Limit 时，Input Guardrail 仍在解析。Runtime 先记录通用 Limit Failure，随后捕获 Guardrail Tripwire；到了最终清理阶段，它又检查同一个 Turn Limit，并把 Safety Exception 覆盖掉。最后一次写入赢了，尽管它只是更旧、更不具体的信息。

OpenAI Agents Python 在 2026-08-24 合并的一项变更，通过首次存储默认 `MaxTurnsExceeded` 时立即设置 `_max_turns_handled = True` 修复了该 Race。确定性 Regression 强制 Turn-limit Condition 先发生、Guardrail 后解析，最终仍验证调用方收到 `InputGuardrailTripwireTriggered`。

更通用但仍有边界的结论是：**Condition Recurrence 不等于 New Evidence。** 通用 Terminal Condition 一旦参与 Arbitration，Finalization 对它的重放不应抹掉随后观察到的、更具体的 Safety Evidence。这可以稳定 Surfaced Exception，但不会创造通用 Priority Hierarchy，也不会撤销 External Effect。

## Last-writer Storage 把时间误当成语义

单一 Mutable Exception Slot 很容易实现：每个 Checker 写入自己看到的 Error，最终 Value 被 Raise。但在并发环境中，这种简单方式会给较晚执行的 Path 过强语义。Cleanup 可以重新生成已处理 Condition，并让它看起来像新的 Outcome。

在所选 Streaming Path 中，`_check_errors()` 会先检查 Max-turn State，再处理已完成的 Input-guardrail Result。两者在同一次检查中可见时，Max-turn Candidate 先写入，Tripwire 后写入，因此 Safety Event 得以暴露。修复前，最终 `_check_errors()` 会再次创建 Turn-limit Exception，因为它从未被标记为 Handled。

所以，缺陷不只是 Exception Selection，而是 Condition Lifecycle：一个已观察、已物化的 Predicate 仍可反复出现。它第二次出现没有带来新事实，Last-writer Storage 却赋予它新的权威。

## Consumption State 明确了这条有界规则

在首次 Materialization 时设置 Handled Flag，会把 Max Turns 从可重复 Predicate 转成已消费事实。Runtime 仍知道 Limit 被超过，但该 Condition 不能仅因另一个 Cleanup Phase 检查同一状态就重新进入 Arbitration。

这不等于“Guardrail 永远高于 Limit”。Regression 证明的是一条有界规则：通用 Limit Candidate 被消费后，它的 Replay 不能覆盖后出现的 Input-guardrail Tripwire。其他 Runtime 可以定义其他 Policy，但 Policy 应显式存在，而不应由 Finalization Order 偶然决定。

Regression 中的 `asyncio.Event` 与那一行 State Transition 同样重要。它在 Max Turns 已真正建立的 Causal Boundary 上同步 Guardrail。Timing Sleep 会随 Scheduler Load 改变结果，而因果同步能确定性证明预期顺序。

## 把事实与最终 Outcome 分开保存

调用方可能只需要一个 Exception，Operator 却需要完整 Fact Set：Turn Limit 被超过、Input Guardrail 被触发、某个 Condition 已消费、某个 Exception 被暴露。这些记录相关，但不能互换。

更一般的 Arbitration Model 可以把观察到的 Terminal Condition 保存为 Structured Entry，带 Identity、Observation Time、Consumption State 与 Policy Precedence；随后选择 Caller-visible Outcome，同时不从 Telemetry 删除其他事实。当 Output Guardrail、Tool Guardrail、Cancellation 与 Run-loop Failure 参与竞争时，这种结构尤其有价值。

所选 Patch 没有实现完整结构。对于少量 Condition，Handled Flag 仍可能是成本最低的正确方案。架构要求更窄：不要让重复检查伪装成 New Evidence，也不要因为 API 只暴露一个 Exception 就擦除并发事实。

## Exception 保真度不是 Effect Safety

暴露 Guardrail Tripwire，只说明哪个 Safety Condition 赢得本次 Arbitration；它没有说明 Tripwire 可见前是否已启动 Tool Call 或 External Effect。保留 Exception Slot 不会自动产生 Rollback、Compensation 或 Transaction Protocol。

这对数字员工尤其重要。Runtime 应分别记录 Terminal-condition Observation、Arbitration 与 External-effect State。如果 Action 已跨越外部边界，应由 Effect Receipt 与 Reconciliation 说明发生了什么，而不是依赖 Exception Precedence。

下一步测试应覆盖 Input、Output、Tool Guardrail、Cancellation、Run-loop Failure 与 Limit 之间的 Causal Race，并断言 Telemetry 保留全部观察事实。在更多证据出现前，可辩护结论仍然具体：已展示的 Max-turn Replay 不再在最终 Streaming Cleanup 中抹掉 Input-guardrail Tripwire。

**一手证据：** [OpenAI Agents Python 已合并提交 1a55d70d](https://github.com/openai/openai-agents-python/commit/1a55d70d8e28769bd2c3eb85eaf6fe501864ced8)。公开实现与 Regression 支持这一有界 Precedence Repair，但不是通用 Exception Hierarchy 或 External-effect Safety 的独立证明。
