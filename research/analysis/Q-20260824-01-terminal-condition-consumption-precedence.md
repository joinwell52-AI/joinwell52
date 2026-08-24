---
schema: "research-analysis/v1"
id: "AN-20260824-01"
date: "2026-08-24"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260824-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260824-01-streaming-guardrail-max-turn-precedence.md"
output_contract: "Research Object"
research_object: "Safety-Relevant Error Precedence Needs Monotonic Condition Consumption"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Safety-Relevant Error Precedence Needs Monotonic Condition Consumption

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-24 Reading Result for Q-20260824-01. The primary evidence is a merged OpenAI Agents SDK change that prevents a previously handled max-turn condition from being recreated during final streaming cleanup and overwriting an already captured input-guardrail tripwire. The judgment below is a bounded interpretation about terminal-condition arbitration in digital-employee and agent runtimes. It does not establish a universal exception hierarchy, transactional rollback, external-effect safety, or distributed exactly-once execution.

本对象仅分析 Q-20260824-01 的 2026-08-24 已完成 Reading Result。一手证据来自 OpenAI Agents SDK 的已合并变更：已经处理过的 Max-turn Condition 不再在 Streaming 最终清理阶段被重新生成，从而避免覆盖已经捕获的 Input-guardrail Tripwire。下述判断仅是关于数字员工与 Agent Runtime 中 Terminal-condition Arbitration 的有界解释，并不建立通用 Exception Hierarchy、Transactional Rollback、External-effect Safety 或分布式 Exactly-once Execution。

```yaml
analysis:
  research_question: "When an agent runtime observes several terminal conditions asynchronously, how should it prevent a generic condition from being regenerated later and erasing a more specific safety-relevant condition already observed?"
  research_question_zh: "当 Agent Runtime 异步观察到多个终止条件时，应如何避免一个通用条件在后续阶段被重新生成，从而抹掉已经观察到的、更具体的安全相关条件？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "In RunResultStreaming, the selected change sets _max_turns_handled=True immediately when the default MaxTurnsExceeded is first stored."
      claim_zh: "在 RunResultStreaming 中，所选变更在首次写入默认 MaxTurnsExceeded 时立即设置 `_max_turns_handled=True`。"
      source: "research/reading/Q-20260824-01-streaming-guardrail-max-turn-precedence.md"
      strength: "direct merged-code evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "The same error-checking path evaluates max-turn state before draining completed input-guardrail results, so a tripped guardrail observed in that check becomes the later stored exception."
      claim_zh: "同一 Error-checking Path 会先检查 Max-turn State，再处理已完成的 Input-guardrail Result，因此在该检查中被观察到的 Guardrail Tripwire 会成为后写入的异常。"
      source: "research/reading/Q-20260824-01-streaming-guardrail-max-turn-precedence.md"
      strength: "direct implementation evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "Before the change, a final _check_errors() call could recreate MaxTurnsExceeded because max turns had not been marked handled, overwriting a guardrail exception already captured."
      claim_zh: "变更之前，由于 Max-turn 尚未标记为 Handled，最终 `_check_errors()` 可以再次生成 MaxTurnsExceeded，并覆盖已经捕获的 Guardrail Exception。"
      source: "research/reading/Q-20260824-01-streaming-guardrail-max-turn-precedence.md"
      strength: "direct before/after mechanism evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "A deterministic asyncio.Event regression forces the max-turn condition before the guardrail resolves and still asserts that the caller receives InputGuardrailTripwireTriggered."
      claim_zh: "一个确定性的 `asyncio.Event` Regression 会强制 Max-turn Condition 先发生、Guardrail 后完成，并仍断言调用方收到 InputGuardrailTripwireTriggered。"
      source: "research/reading/Q-20260824-01-streaming-guardrail-max-turn-precedence.md"
      strength: "direct regression-test evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "A terminal condition that has already been converted into a candidate outcome should have an explicit consumed/handled state so replay of the same generic condition cannot erase later, more specific evidence."
      claim_zh: "已经被转换成候选终态结果的 Terminal Condition 应具有显式的 Consumed/Handled State，从而避免同一个通用条件被重复回放并抹掉后续更具体的 Evidence。"
      source: "E1,E2,E3,E4"
      strength: "bounded runtime-governance interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "The demonstrated fix supports monotonic consumption of one generic terminal condition, not a complete priority lattice across every concurrent exception or a guarantee about external side effects."
      claim_zh: "已证明的修复支持一个通用 Terminal Condition 的单调消费，但不能推出所有并发异常之间存在完整 Priority Lattice，也不能推出 External Side Effect 的安全保证。"
      source: "E4"
      strength: "bounded evidence-boundary interpretation"
      independent: false

  observations:
    - "The bug is a state-lifecycle problem, not merely a message-selection problem: a condition that was already observed remained repeatable."
    - "A single mutable exception slot makes later writes semantically powerful even when they merely recreate older information."
    - "Marking the generic condition handled at first materialization converts it from repeatable state into a consumed fact and stabilizes later safety evidence."
    - "The regression is valuable because it synchronizes on the actual concurrency boundary rather than relying on timing sleeps."
  observations_zh:
    - "该问题本质上是 State Lifecycle 问题，而不只是 Message Selection 问题：一个已经被观察到的 Condition 仍然可以重复发生。"
    - "单一 Mutable Exception Slot 会让后续写入拥有过强语义，即便它只是重新生成旧信息。"
    - "在通用 Condition 首次 Materialization 时就标记 Handled，会把它从可重复状态转化为已消费事实，并让后续 Safety Evidence 保持稳定。"
    - "Regression 的价值在于它同步真实并发边界，而不是依赖 Timing Sleep。"

  comparisons:
    - "Last-writer exception storage is simple but lets cleanup or retry paths accidentally change semantic precedence by recreating an older condition."
    - "An explicit consumed-state model preserves the fact that a generic condition already participated in arbitration without allowing it to repeatedly re-enter arbitration."
    - "A full structured arbitration model could preserve multiple concurrent failure facts, but the selected patch demonstrates only one narrow monotonic-state repair."
  comparisons_zh:
    - "Last-writer Exception Storage 虽然简单，但 Cleanup 或 Retry Path 可能通过重新生成旧 Condition 意外改变 Semantic Precedence。"
    - "显式 Consumed-state Model 可以保留通用 Condition 已经参与 Arbitration 的事实，同时阻止它反复重新进入 Arbitration。"
    - "完整 Structured Arbitration Model 可以同时保存多个并发 Failure Fact，但本次所选 Patch 只证明了一个狭窄的 Monotonic-state Repair。"

  counterarguments:
    - "Some systems may intentionally define a later generic failure as dominant; monotonic consumption is useful only when the precedence policy says replay should not re-enter arbitration."
    - "A dedicated priority enum or multi-error structure could be clearer than relying on ordering plus handled flags as the number of terminal conditions grows."
    - "Surfacing the guardrail tripwire does not imply that already-started tool or external effects have been rolled back."
  counterarguments_zh:
    - "某些系统可能有意规定后出现的通用 Failure 优先；只有当 Precedence Policy 明确禁止 Replay 重新参与 Arbitration 时，Monotonic Consumption 才成立。"
    - "当 Terminal Condition 数量增长时，显式 Priority Enum 或 Multi-error Structure 可能比 Ordering 加 Handled Flag 更清晰。"
    - "最终暴露 Guardrail Tripwire 并不意味着已经启动的 Tool 或 External Effect 被回滚。"

  research_judgment: "Concurrent terminal conditions should be modeled with explicit consumption and arbitration state rather than treated as repeatable writes into one mutable exception slot. Once a generic condition such as a turn limit has been observed and converted into a candidate terminal outcome, replaying that same condition during finalization should not silently erase more specific safety evidence observed afterward. The selected Agents SDK change demonstrates this narrow monotonic-consumption rule. It does not establish a universal exception-priority lattice, transactional rollback, or safety of external side effects."
  research_judgment_zh: "并发 Terminal Condition 应通过显式 Consumption 与 Arbitration State 建模，而不应被视为可以反复写入同一个 Mutable Exception Slot 的普通事件。一旦 Turn Limit 这类通用 Condition 已被观察并转化为候选终态结果，Finalization 阶段再次回放同一 Condition 不应静默抹掉随后观察到的、更具体的 Safety Evidence。所选 Agents SDK 变更证明了这一狭窄的 Monotonic-consumption Rule，但并未建立通用 Exception-priority Lattice、Transactional Rollback 或 External Side Effect Safety。"

  general_implications:
    - "Agent runtimes should distinguish terminal-condition observation, condition consumption, surfaced exception and external-effect state as separate facts."
    - "Safety-relevant conditions should not depend on incidental cleanup ordering for their continued visibility."
    - "Concurrency regressions should synchronize on causal state boundaries so the tested precedence is deterministic."
    - "Telemetry may need to retain all observed terminal facts even when the caller receives only one surfaced exception."
  general_implications_zh:
    - "Agent Runtime 应把 Terminal-condition Observation、Condition Consumption、Surfaced Exception 与 External-effect State 分开表示。"
    - "Safety-relevant Condition 的持续可见性不应依赖偶然的 Cleanup Ordering。"
    - "并发 Regression 应在 Causal State Boundary 上同步，使被测试的 Precedence 具有确定性。"
    - "即便调用方最终只收到一个 Surfaced Exception，Telemetry 也可能需要保留所有已观察到的 Terminal Fact。"

  limitations:
    - "Evidence is one merged maintainer implementation and regression test, not an independent cross-runtime evaluation."
    - "The demonstrated rule concerns streaming input-guardrail versus repeated default max-turn handling, not every exception combination."
    - "The mechanism preserves surfaced exception identity but does not provide rollback, compensation or transactionality for external effects."
    - "No evidence here establishes a complete formal priority policy for run-loop, output-guardrail, tool-guardrail, cancellation and limit failures."
  limitations_zh:
    - "证据来自一个已合并维护者实现与 Regression Test，并非跨 Runtime 的独立 Evaluation。"
    - "已证明规则只涉及 Streaming Input-guardrail 与重复 Default Max-turn Handling，而不是所有异常组合。"
    - "该机制保留 Surfaced Exception Identity，但不为 External Effect 提供 Rollback、Compensation 或 Transactionality。"
    - "现有证据不能建立覆盖 Run-loop、Output-guardrail、Tool-guardrail、Cancellation 与 Limit Failure 的完整 Formal Priority Policy。"

  open_questions:
    - "Should agent runtimes expose a structured terminal-condition set rather than a single mutable stored exception?"
    - "Which conditions should be consumable once, and which should legitimately re-enter arbitration after state changes?"
    - "Should telemetry preserve both the generic limit failure and the more specific safety tripwire even when only one is raised?"
    - "How should terminal-condition precedence interact with cancellation and already-started external effects?"
  open_questions_zh:
    - "Agent Runtime 是否应暴露 Structured Terminal-condition Set，而不是单一 Mutable Stored Exception？"
    - "哪些 Condition 应只消费一次，哪些 Condition 在状态变化后应合法重新进入 Arbitration？"
    - "即便最终只 Raise 一个异常，Telemetry 是否应同时保留通用 Limit Failure 与更具体 Safety Tripwire？"
    - "Terminal-condition Precedence 应如何与 Cancellation 和已经启动的 External Effect 协同？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence", "technical-analysis", "governance-implications", "engineering-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment is a general agent-runtime error-arbitration pattern and does not require a first-party project to establish it."
    rationale_zh: "该判断属于一般 Agent Runtime Error-arbitration 模式，不需要引入自有项目才能成立。"
```

## Bounded judgment / 有界判断

The key distinction is **condition recurrence is not new evidence**. Once a generic terminal condition has already been consumed into an arbitration decision, recreating it later should not gain fresh semantic authority simply because finalization runs again. The selected patch demonstrates that principle for one max-turn/guardrail race. It does not prove how every competing failure should be ordered or whether external effects are safe.

核心区别是：**Condition Recurrence 不等于 New Evidence**。一个通用 Terminal Condition 一旦已经被消费并参与 Arbitration Decision，后续 Finalization 再次运行时重新生成它，不应仅凭“更晚出现”就获得新的 Semantic Authority。所选 Patch 在一个 Max-turn / Guardrail Race 中证明了这一点，但不能证明所有竞争 Failure 应如何排序，也不能证明 External Effect 已经安全。
