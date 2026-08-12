---
schema: "research-analysis/v1"
id: "AN-20260812-01"
date: "2026-08-12"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260812-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260812-01-acceptance-based-queued-work-admission.md"
output_contract: "Research Object"
research_object: "Acceptance and Persistence as Separate Work-Handoff Boundaries"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Acceptance and Persistence as Separate Work-Handoff Boundaries

## Governed scope / 受治理范围

This object performs Skill 04 analysis only on the completed 2026-08-12 Reading Result for Q-20260812-01. It does not introduce unread evidence, draft publication copy, or infer exactly-once guarantees that the Reading Result did not establish.

本对象仅对 Q-20260812-01 的 2026-08-12 已完成 Reading Result 执行 Skill 04 分析；不引入未阅读证据，不撰写发布文案，也不把 Reading Result 未建立的 Exactly-once 保证推断为事实。

```yaml
analysis:
  research_question: "When queued intent is removed after Core acceptance rather than after persistence, what execution-authority and recovery boundary should a durable agent runtime expose?"
  research_question_zh: "当排队意图在 Core 接受后、而不是在持久化后移出队列时，一个持久 Agent Runtime 应如何暴露执行权与恢复边界？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "In the selected implementation change, queued user input admission resolves when Core accepts the input as a new turn or steer rather than waiting for rollout persistence."
      claim_zh: "在所选实现变更中，排队用户输入在 Core 接受其作为 New Turn 或 Steer 时完成 Admission，而不再等待 Rollout Persistence。"
      source: "research/reading/Q-20260812-01-acceptance-based-queued-work-admission.md"
      strength: "directly established by the changed code, maintainer description and tests summarized in the Reading Result"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "The queue entry is deleted after successful Core admission; a later prompt-hook stop is downstream of admission and does not restore the queue item."
      claim_zh: "Queue Entry 在 Core Admission 成功后删除；后续 Prompt Hook Stop 属于 Admission 下游，不会恢复该 Queue Item。"
      source: "research/reading/Q-20260812-01-acceptance-based-queued-work-admission.md"
      strength: "directly established for the changed queued-message path"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The selected source does not establish end-to-end exactly-once execution, global external-side-effect idempotency, or complete crash recovery after acceptance."
      claim_zh: "所选来源未建立端到端 Exactly-once Execution、全局外部副作用幂等性，也未建立 Admission 后的完整崩溃恢复保证。"
      source: "research/reading/Q-20260812-01-acceptance-based-queued-work-admission.md"
      strength: "explicit limitation of the Reading Result"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Acceptance and persistence are two different governance boundaries: acceptance transfers execution authority, while persistence determines what evidence survives failure. Treating either boundary as the other hides an ambiguity window."
      claim_zh: "Acceptance 与 Persistence 是两个不同的治理边界：Acceptance 转移执行权，Persistence 决定故障后哪些证据可存续。把任一边界等同于另一边界都会隐藏一个歧义窗口。"
      source: "E1,E2,E3"
      strength: "bounded architectural interpretation"
      independent: false
    - id: "H1"
      identity: "hypothesis"
      claim: "A durable agent runtime can reduce the post-acceptance ambiguity window by persisting an accepted-occurrence receipt or equivalent handoff record before destructive queue ownership is forgotten."
      claim_zh: "持久 Agent Runtime 可以在彻底放弃 Queue Ownership 之前持久化 Accepted-occurrence Receipt 或等价交接记录，从而缩小 Acceptance 后的歧义窗口。"
      source: "I1"
      strength: "design hypothesis requiring implementation and failure-injection validation"
      independent: false

  observations:
    - "The implementation deliberately moves admission toward an execution-level acknowledgement and away from a storage-level acknowledgement."
    - "Queue deletion therefore means 'Core accepted this work', not 'all downstream execution state is durably recoverable'."
    - "The Reading Result leaves the failure interval after acceptance and before later persistence explicitly unresolved."
  observations_zh:
    - "该实现明确把 Admission 从存储级确认移动到执行级确认。"
    - "因此 Queue 删除表示‘Core 已接受这项工作’，而不是‘所有下游执行状态都已经可持久恢复’。"
    - "Reading Result 明确保留了 Acceptance 之后、后续 Persistence 之前的故障区间问题。"

  comparisons:
    - "Persistence-gated admission favors a stronger durable handoff point but couples admission latency and failure semantics to storage."
    - "Acceptance-gated admission provides an earlier execution-authority boundary but requires separate recovery evidence if restart ambiguity matters."
    - "A two-boundary model can expose both Accepted and DurablyRecorded without pretending they are the same event."
  comparisons_zh:
    - "Persistence-gated Admission 提供更强的持久交接点，但把 Admission 延迟和失败语义耦合到存储。"
    - "Acceptance-gated Admission 提供更早的执行权边界，但如果重启歧义重要，就需要独立的恢复证据。"
    - "双边界模型可以同时暴露 Accepted 与 DurablyRecorded，而不把它们伪装成同一事件。"

  counterarguments:
    - "Waiting for persistence before admission can simplify some recovery reasoning, so earlier acceptance is not universally superior."
    - "A separate durable receipt adds state and reconciliation cost; systems whose accepted work is naturally replayable may not need the same mechanism."
  counterarguments_zh:
    - "在 Admission 前等待 Persistence 可以简化部分恢复推理，因此更早的 Acceptance 并非普遍更优。"
    - "独立持久 Receipt 会增加状态与对账成本；如果系统中的已接受工作天然可重放，可能不需要同等机制。"

  research_judgment: "For durable agent work, execution acceptance and durable recovery evidence should be modeled as separate state transitions. Acceptance may legitimately grant execution authority, but queue removal alone should not be interpreted as proof of restart-safe completion or exactly-once processing."
  research_judgment_zh: "对于持久 Agent 工作，执行接受与持久恢复证据应被建模为两个独立状态转换。Acceptance 可以合理授予执行权，但仅凭 Queue 删除不得解释为已证明具备重启安全完成或 Exactly-once Processing。"

  general_implications:
    - "Schedulers and work queues should expose demand, acceptance and durable recovery evidence as distinct facts."
    - "Retry policy must identify the authoritative state source after queue ownership transfers."
    - "Ambiguous client timeout after acceptance needs occurrence identity or reconciliation evidence before safe retry can be claimed."
  general_implications_zh:
    - "Scheduler 与 Work Queue 应把需求、Acceptance 和持久恢复证据暴露为不同事实。"
    - "Queue Ownership 转移后，Retry Policy 必须明确权威状态来源。"
    - "Acceptance 后出现客户端歧义超时时，需要 Occurrence Identity 或 Reconciliation Evidence，才能声称重试安全。"

  limitations:
    - "The source covers one changed Codex queued-user-message path, not a universal agent queue protocol."
    - "No independent reproduction or failure-injection study is part of this Reading Result."
    - "The proposed accepted-occurrence receipt is an architectural hypothesis, not a fact established by the source."
  limitations_zh:
    - "来源只覆盖一个发生变更的 Codex Queued-user-message 路径，不是通用 Agent Queue 协议。"
    - "本 Reading Result 不包含独立复现或故障注入研究。"
    - "所提出的 Accepted-occurrence Receipt 是架构假设，不是来源已建立事实。"

  open_questions:
    - "What authoritative state should drive replay after failure between Core acceptance and later persistence?"
    - "What occurrence identity should survive ambiguous retries across process restarts?"
    - "Should accepted-but-hook-stopped work have a distinct durable terminal event?"
  open_questions_zh:
    - "Core Acceptance 与后续 Persistence 之间发生故障后，应由哪个权威状态驱动重放？"
    - "哪一种 Occurrence Identity 应跨进程重启保留以处理歧义重试？"
    - "Accepted-but-hook-stopped 工作是否应拥有独立持久终态事件？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "evidence", "technical-analysis", "governance-implications", "limitations", "open-questions"]

  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment is about durable agent queue handoff generally and does not require a first-party project to remain valid."
    rationale_zh: "该判断讨论的是通用持久 Agent Queue Handoff，不依赖任何第一方项目才能成立。"
```

## Bounded judgment / 有界判断

Acceptance can be the correct point for granting execution authority without being the correct point for claiming durable completion. The useful architectural move is to make both boundaries observable rather than forcing one overloaded status to represent queue ownership, execution acceptance and crash-safe evidence at once.

Acceptance 可以成为授予执行权的正确时点，但不等于可以声称持久完成的正确时点。更有价值的架构做法，是同时让这两个边界可观测，而不是用一个过载状态同时代表 Queue Ownership、Execution Acceptance 与 Crash-safe Evidence。
