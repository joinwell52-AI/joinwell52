---
schema: "research-analysis/v1"
id: "AN-20260827-01"
date: "2026-08-27"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260827-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260827-01-runner-process-readiness-runtime-truth.md"
output_contract: "Research Object"
research_object: "Externally Visible Running Requires Execution-Readiness Evidence"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Externally Visible Running Requires Execution-Readiness Evidence

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-27 Reading Result for Q-20260827-01. The primary evidence is Anthropic's official Claude Code v2.1.247 release note stating that affected self-hosted runner sessions could report `running` before Claude Code had started, producing a premature desktop notification that Claude was waiting for input. The bounded conclusion concerns the truth conditions for an externally visible runtime state. It does not infer the undisclosed internal readiness primitive or upgrade process startup into full health, protocol readiness, or universal work acceptance.

本对象仅分析 Q-20260827-01 的 2026-08-27 已完成 Reading Result。一手证据是 Anthropic 官方 Claude Code v2.1.247 Release Note：受影响的 Self-hosted Runner Session 曾可能在 Claude Code 尚未启动时就报告 `running`，进而触发桌面端过早的“Claude 正在等待输入”通知。本对象的有界结论只讨论对外可见 Runtime State 的真实性条件；不推断未公开的内部 Readiness Primitive，也不把 Process Startup 擅自升级成 Fully Healthy、Protocol-ready 或 Universal Work Acceptance。

```yaml
analysis:
  research_question: "What evidence should a digital-employee runtime require before publishing an externally visible Running state?"
  research_question_zh: "数字员工 Runtime 在发布对外可见的 Running 状态之前，应要求什么证据？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "Anthropic published Claude Code v2.1.247 with a release-note entry addressing premature Running state publication for affected self-hosted runner sessions."
      claim_zh: "Anthropic 发布 Claude Code v2.1.247，并在 Release Note 中记录了受影响 Self-hosted Runner Session 过早发布 Running 状态的问题。"
      source: "research/reading/Q-20260827-01-runner-process-readiness-runtime-truth.md"
      strength: "directly checkable release-state fact"
      independent: false
    - id: "E2"
      identity: "source-reported-claim"
      claim: "Anthropic reports that affected sessions previously reported running before Claude Code had started, and that this could cause a premature desktop notification saying Claude was waiting for input."
      claim_zh: "Anthropic 报告称，受影响 Session 曾在 Claude Code 启动前就报告 running，并可能导致桌面端过早提示 Claude 正在等待输入。"
      source: "research/reading/Q-20260827-01-runner-process-readiness-runtime-truth.md"
      strength: "official vendor release-note claim about the observed defect and consequence"
      independent: false
    - id: "E3"
      identity: "source-reported-claim"
      claim: "The release note describes the fix as preventing the affected Running report from preceding Claude Code process startup."
      claim_zh: "Release Note 将修复描述为：阻止受影响的 Running 报告早于 Claude Code Process Startup。"
      source: "research/reading/Q-20260827-01-runner-process-readiness-runtime-truth.md"
      strength: "official bounded ordering claim"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Externally visible Running should represent evidence-backed execution readiness rather than scheduler intent, assignment, registration or worker claim alone."
      claim_zh: "对外可见的 Running 应代表有证据支持的 Execution Readiness，而不能只代表 Scheduler Intent、Assignment、Registration 或 Worker Claim。"
      source: "E2,E3"
      strength: "bounded runtime-truth interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "A runtime should preserve distinct pre-execution states when its strongest available evidence has not yet crossed the readiness boundary required by downstream consumers."
      claim_zh: "当当前最强证据尚未越过下游消费者所要求的 Readiness Boundary 时，Runtime 应保留独立的 Pre-execution State，而不是提前发布 Running。"
      source: "E2,E3"
      strength: "state-modeling implication"
      independent: false

  observations:
    - "The defect was not merely cosmetic: a downstream client interpreted Running as sufficiently strong evidence to issue user-facing behavior."
    - "The demonstrated boundary is temporal: state publication must follow at least the disclosed process-start event."
    - "The evidence does not identify whether process start is the final or merely minimum readiness gate in the implementation."
  observations_zh:
    - "该缺陷并非纯展示问题：下游 Client 把 Running 当成足够强的证据，并据此触发用户可见行为。"
    - "已证明的边界是时间顺序边界：状态发布至少必须晚于公开证据所披露的 Process-start Event。"
    - "现有证据没有说明 Process Start 在实现中是最终 Readiness Gate，还是仅仅是最低门槛。"

  comparisons:
    - "A scheduler-intent model can mark work Running once it is assigned; an execution-truth model delays the externally visible state until evidence exists that the execution substrate has crossed its readiness boundary."
    - "Worker Claimed proves ownership of an execution opportunity; it is weaker than evidence that the worker process or execution substrate is actually ready for the semantics consumers attach to Running."
  comparisons_zh:
    - "Scheduler-intent Model 可以在任务被分配后立即标记 Running；Execution-truth Model 则要求先有证据证明执行底座已越过 Readiness Boundary，再发布对外可见状态。"
    - "Worker Claimed 只能证明有人取得执行机会；它弱于证明 Worker Process 或执行底座已经满足消费者赋予 Running 的实际语义。"

  counterarguments:
    - "Some systems intentionally define Running as assignment or startup-in-progress. That can be valid if the state contract is explicit and downstream consumers do not interpret it as execution readiness."
    - "Delaying state publication too far can hide useful liveness information; a richer state model such as Scheduled, Claimed, Starting and Running may preserve both observability and truth."
    - "Process startup alone may be insufficient where safe operation also depends on handshake, dependency initialization or health checks. The selected evidence does not resolve that stronger boundary."
  counterarguments_zh:
    - "有些系统会有意把 Running 定义为 Assignment 或 Startup-in-progress；只要状态合同明确，且下游不把它解释为 Execution Readiness，这种定义可以成立。"
    - "过度延迟状态发布也可能隐藏有价值的 Liveness 信息；更丰富的 Scheduled、Claimed、Starting、Running 状态模型可以同时保留 Observability 与 Truth。"
    - "在安全执行还依赖 Handshake、Dependency Initialization 或 Health Check 的系统里，仅 Process Startup 可能仍不够；所选证据无法确定这个更强边界。"

  research_judgment: "Externally visible Running should be published only after the runtime holds the evidence required to justify the semantics downstream consumers attach to that state. Scheduler intent, assignment and worker claim should remain distinguishable from execution readiness. Claude Code v2.1.247 provides a concrete bounded example in which publishing Running before process startup created false downstream behavior; it establishes process-start ordering for the affected path, not a universal definition of full readiness."
  research_judgment_zh: "对外可见的 Running 只有在 Runtime 已持有足以支撑下游消费者对该状态所赋语义的证据后才应发布。Scheduler Intent、Assignment、Worker Claim 与 Execution Readiness 应保持可区分。Claude Code v2.1.247 提供了一个有界实例：在 Process Startup 前发布 Running 会制造错误的下游行为；它建立的是受影响路径上的 Process-start Ordering，而不是 Full Readiness 的通用定义。"

  general_implications:
    - "Digital-employee runtimes should define each externally visible lifecycle state by its minimum acceptable evidence, not only by a control-plane transition name."
    - "Status projections consumed by user interfaces, automation or downstream agents should be stricter than internal scheduling intent when consumers trigger behavior from those projections."
    - "Execution telemetry should preserve the difference between wake, schedule, claim, startup and readiness so operators can diagnose where work actually stopped."
    - "Readiness gates should be scoped to the semantics being promised; stronger claims require stronger evidence."
  general_implications_zh:
    - "数字员工 Runtime 应用最低可接受 Evidence 定义每一个对外 Lifecycle State，而不是只靠控制面 Transition 名称。"
    - "当 UI、自动化或下游 Agent 会根据状态触发行为时，它们消费的 Status Projection 应比内部 Scheduling Intent 更严格。"
    - "Execution Telemetry 应保留 Wake、Schedule、Claim、Startup、Readiness 之间的区别，以便运营侧准确定位工作停在何处。"
    - "Readiness Gate 应与实际承诺的语义范围一致；更强的状态主张需要更强的证据。"

  limitations:
    - "Evidence is an official vendor release note, not independent reproduction or source-level inspection of the readiness implementation."
    - "The exact readiness primitive, startup-failure mapping, timeout behavior and regression-test identity are not disclosed."
    - "The evidence does not establish that process startup means fully initialized, healthy, connected or able to accept every class of work."
    - "The conclusion is a general state-truth design implication derived from one bounded implementation incident, not a universal lifecycle standard."
  limitations_zh:
    - "证据来自官方 Vendor Release Note，而不是独立复现或对 Readiness 实现源码的检查。"
    - "精确 Readiness Primitive、Startup-failure Mapping、Timeout 行为与 Regression-test Identity 均未公开。"
    - "证据不能证明 Process Startup 等于 Fully Initialized、Healthy、Connected 或能够接受所有类型工作。"
    - "本结论是从一个有界实现事件推导出的通用 State-truth 设计启示，不是通用 Lifecycle Standard。"

  open_questions:
    - "What exact event now gates Running in the affected runner path?"
    - "Should user-facing runtimes expose a separate Starting state when process creation succeeds but initialization is incomplete?"
    - "How should startup timeout and startup failure be represented without briefly publishing a false Running state?"
    - "Which downstream consumers require process-start evidence versus a stronger health or handshake condition?"
  open_questions_zh:
    - "受影响 Runner Path 现在究竟由什么事件 Gate Running？"
    - "当 Process Creation 已成功但 Initialization 尚未完成时，面向用户的 Runtime 是否应暴露独立 Starting 状态？"
    - "Startup Timeout 与 Startup Failure 应如何表达，才能避免短暂发布错误的 Running？"
    - "哪些下游消费者只需要 Process-start Evidence，哪些需要更强的 Health 或 Handshake 条件？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "evidence", "technical-analysis", "operational-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment is a general runtime-state truth principle and does not require a first-party project mapping to remain valid."
    rationale_zh: "该判断属于通用 Runtime-state Truth Principle，不需要映射自有项目才能成立。"
```

## Bounded judgment / 有界判断

The central distinction is **scheduled or claimed work is not yet execution-readiness truth**. An externally visible Running state should cross the boundary only when the system has evidence sufficient for the semantics its consumers attach to Running. The selected evidence proves that process startup is a required ordering boundary for one affected Claude Code runner path; it does not prove a universal readiness primitive.

核心区别是：**Scheduled 或 Claimed Work 还不是 Execution-readiness Truth**。对外 Running 只有在系统已拥有足以支撑消费者所赋语义的证据时才能越过该边界。所选证据证明 Process Startup 是某一受影响 Claude Code Runner Path 的必要顺序边界，但不能证明一个通用 Readiness Primitive。
