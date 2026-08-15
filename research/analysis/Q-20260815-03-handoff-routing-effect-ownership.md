---
schema: "research-analysis/v1"
id: "AN-20260815-03"
date: "2026-08-15"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260815-03"
column: "open-source-engineering"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260815-03-live-background-tool-task-lifecycle-ownership.md"
output_contract: "Research Object"
research_object: "Handoff Safety Requires Separate Routing and Effect Ownership"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Handoff Safety Requires Separate Routing and Effect Ownership

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-15 Reading Result for Q-20260815-03. The selected ADK implementation and tests establish local asyncio lifecycle behavior. Broader conclusions about distributed cancellation, external side effects, compensation and exactly-once semantics are interpretive boundaries, not claims proven by the source.

本对象仅分析 Q-20260815-03 的 2026-08-15 已完成 Reading Result。所选 ADK 实现与测试只建立本地 asyncio 生命周期行为。关于分布式 Cancellation、外部 Side Effect、Compensation 与 Exactly-once Semantics 的更广泛结论属于分析边界，而不是来源已经证明的事实。

```yaml
analysis:
  research_question: "What ownership facts must an agent runtime separate when background tool work may outlive the agent that created it during handoff or teardown?"
  research_question_zh: "当后台工具工作可能在 Handoff 或 Teardown 时超过创建它的 Agent 生命周期，Agent Runtime 必须把哪些 Ownership Fact 分开？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The selected ADK change makes a live agent run responsible for streaming and non-blocking background asyncio tasks and invokes cleanup both before handoff and from the outer run_live finally path."
      claim_zh: "所选 ADK 变更让一个 Live Agent Run 对 Streaming 与 Non-blocking Background asyncio Task 负责，并在 Handoff 之前以及外层 run_live finally 路径中执行 Cleanup。"
      source: "research/reading/Q-20260815-03-live-background-tool-task-lifecycle-ownership.md"
      strength: "direct merged-code and regression-test evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Cleanup cancels pending background tasks, waits for at most one second, observes completed-task exceptions, and clears the streaming/non-blocking registries even when cancellation-resistant tasks remain alive."
      claim_zh: "Cleanup 会取消 Pending Background Task、最多等待 1 秒、读取已完成 Task 的异常，并且即使 Cancellation-resistant Task 仍存活，也会清空 Streaming/Non-blocking Registry。"
      source: "research/reading/Q-20260815-03-live-background-tool-task-lifecycle-ownership.md"
      strength: "direct merged-code and regression-test evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "Registry retirement prevents stale streaming tools from continuing to receive future live input after handoff, while the source explicitly distinguishes registry release from guaranteed underlying task termination."
      claim_zh: "Registry Retirement 会阻止陈旧 Streaming Tool 在 Handoff 后继续收到未来 Live Input；同时来源明确区分 Registry Release 与底层 Task 已保证终止这两个事实。"
      source: "research/reading/Q-20260815-03-live-background-tool-task-lifecycle-ownership.md"
      strength: "direct mechanism plus regression-test evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "Local coroutine cancellation and registry cleanup do not undo external HTTP, database, payment, message or other side effects already issued by a tool and do not establish distributed revocation or exactly-once execution."
      claim_zh: "本地 Coroutine Cancellation 与 Registry Cleanup 不会撤销 Tool 已经发出的 HTTP、Database、Payment、Message 或其他外部 Side Effect，也没有建立 Distributed Revocation 或 Exactly-once Execution。"
      source: "research/reading/Q-20260815-03-live-background-tool-task-lifecycle-ownership.md"
      strength: "explicit source limitation"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Handoff safety requires separate evidence for execution ownership, routing ownership and effect ownership; releasing one does not prove the others are closed."
      claim_zh: "Handoff Safety 需要分别证明 Execution Ownership、Routing Ownership 与 Effect Ownership；释放其中一个并不能证明另外两个已经关闭。"
      source: "E1,E2,E3,E4"
      strength: "bounded engineering interpretation"
      independent: false

  observations:
    - "Pre-handoff cleanup treats the shared live request queue as an ownership boundary: old background tools are revoked before the next agent becomes the queue consumer."
    - "Bounded cancellation protects runtime liveness by refusing to wait indefinitely for a misbehaving task, but it necessarily creates a possible residual-work state."
    - "Registry retirement is a routing guarantee, not an effect guarantee: the runtime can stop sending new inputs to an orphan while the underlying coroutine or remote effect may still exist."
  observations_zh:
    - "Pre-handoff Cleanup 把共享 Live Request Queue 视为 Ownership Boundary：旧 Background Tool 在下一 Agent 成为 Queue Consumer 之前就被撤销。"
    - "Bounded Cancellation 通过拒绝无限等待不合作 Task 来保护 Runtime Liveness，但也因此必然可能形成 Residual-work State。"
    - "Registry Retirement 是 Routing Guarantee，而不是 Effect Guarantee：Runtime 可以停止向 Orphan 发送新输入，但底层 Coroutine 或 Remote Effect 仍可能存在。"

  comparisons:
    - "Cleaning up only at total invocation shutdown is too late for handoff because the next agent may already own the shared input route."
    - "Waiting indefinitely for cooperative cancellation maximizes cleanup certainty at the cost of making handoff availability hostage to one tool; bounded cancellation makes the tradeoff explicit."
    - "Clearing registries without cancellation would revoke routing but waste local execution; cancellation without clearing registries could still leave stale routing. The source intentionally does both."
  comparisons_zh:
    - "只在整个 Invocation Shutdown 时 Cleanup 对 Handoff 来说太晚，因为下一 Agent 可能已经拥有共享输入路由。"
    - "无限等待 Cooperative Cancellation 可以追求更高 Cleanup 确定性，却会让 Handoff Availability 被单个 Tool 挟持；Bounded Cancellation 把这一取舍显式化。"
    - "只清 Registry 不 Cancel 会撤销 Routing 但浪费本地执行；只 Cancel 不清 Registry 又可能保留陈旧 Routing。来源有意同时执行两者。"

  counterarguments:
    - "For low-risk local tools with no durable external effects, a best-effort one-second cancellation plus logging may be entirely sufficient."
    - "Persisting every residual task as durable runtime state could add operational complexity disproportionate to its risk, especially for ephemeral streaming helpers."
    - "A runtime cannot always own external effect cancellation; some tools or providers expose no cancellation/compensation API, so governance may have to rely on reconciliation rather than revocation."
  counterarguments_zh:
    - "对没有持久外部 Side Effect 的低风险本地 Tool，Best-effort 1 秒 Cancellation 加日志可能已经完全足够。"
    - "把每个 Residual Task 都持久化为 Runtime State 可能增加与风险不成比例的运维复杂度，尤其是短暂 Streaming Helper。"
    - "Runtime 并不总能拥有外部 Effect Cancellation；一些 Tool/Provider 根本没有 Cancellation/Compensation API，因此治理可能只能依赖 Reconciliation，而不是 Revocation。"

  research_judgment: "Agent handoff should be modeled as an ownership transfer, not merely a change of active agent name. Before routing moves, the old run should revoke its local execution and routing claims; if bounded cancellation cannot prove termination, the runtime should distinguish that residual-work hazard from successful cleanup. External-effect ownership remains a separate layer that requires provider-specific idempotency, cancellation, compensation or reconciliation evidence. The selected ADK change demonstrates strong local routing/lifecycle ownership but deliberately does not close the external-effect boundary."
  research_judgment_zh: "Agent Handoff 应建模为 Ownership Transfer，而不只是 Active Agent Name 的变化。在 Routing 转移之前，旧 Run 应撤销自己的本地 Execution 与 Routing Claim；如果 Bounded Cancellation 无法证明终止，Runtime 应把这种 Residual-work Hazard 与成功 Cleanup 区分开。External-effect Ownership 仍是独立层，需要 Provider-specific Idempotency、Cancellation、Compensation 或 Reconciliation Evidence。所选 ADK 变更展示了较强的本地 Routing/Lifecycle Ownership，但明确没有关闭 External-effect Boundary。"

  general_implications:
    - "Agent-run ownership should include all locally spawned asynchronous work that can write into shared runtime channels."
    - "Handoff should revoke the previous owner's routing membership before the next owner begins consuming the shared route."
    - "Bounded teardown needs an explicit residual-work state when termination cannot be proven, especially for high-risk tools."
    - "Operational telemetry should distinguish cancellation requested, task stopped, routing retired and external effect reconciled as separate milestones."
    - "External side-effect safety must be defined per tool/provider through idempotency keys, cancellable jobs, compensation or post-fact reconciliation rather than inferred from local task cancellation."
  general_implications_zh:
    - "Agent-run Ownership 应覆盖所有可能向共享 Runtime Channel 写入的本地异步工作。"
    - "Handoff 应在下一 Owner 开始消费共享 Route 之前撤销上一 Owner 的 Routing Membership。"
    - "当无法证明终止时，Bounded Teardown 需要显式 Residual-work State，尤其针对高风险 Tool。"
    - "Operational Telemetry 应把 Cancellation Requested、Task Stopped、Routing Retired 与 External Effect Reconciled 分别记录为不同里程碑。"
    - "External Side-effect Safety 必须按 Tool/Provider 通过 Idempotency Key、Cancellable Job、Compensation 或事后 Reconciliation 定义，而不能从本地 Task Cancellation 推断。"

  limitations:
    - "The evidence covers ADK local asyncio/live-request execution and tests, not remote workers, subprocesses or durable job queues."
    - "The one-second timeout is an implementation constant, not evidence for an optimal SLA across tool classes."
    - "No evidence here establishes forced termination, distributed revocation, transaction rollback, compensation correctness or exactly-once external effects."
  limitations_zh:
    - "证据覆盖 ADK 本地 asyncio/Live-request 执行与测试，不包括 Remote Worker、Subprocess 或 Durable Job Queue。"
    - "1 秒 Timeout 是实现常量，并不是不同 Tool Class 最优 SLA 的证据。"
    - "这里没有证据建立 Forced Termination、Distributed Revocation、Transaction Rollback、Compensation Correctness 或 Exactly-once External Effect。"

  open_questions:
    - "Which tool-risk classes require handoff to block until termination is proven rather than merely routing ownership being released?"
    - "How should residual local/remote work be represented durably so later agents know an effect may still be in flight?"
    - "What common evidence contract can connect local cancellation state with provider-side idempotency, compensation and reconciliation outcomes?"
  open_questions_zh:
    - "哪些 Tool Risk Class 要求 Handoff 必须等到 Termination 被证明，而不能只释放 Routing Ownership？"
    - "Residual Local/Remote Work 应如何持久表达，才能让后续 Agent 知道某个 Effect 可能仍在进行？"
    - "什么通用 Evidence Contract 可以把本地 Cancellation State 与 Provider 侧 Idempotency、Compensation 和 Reconciliation Outcome 连接起来？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "lifecycle-analysis", "failure-boundary", "engineering-implications", "operational-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The conclusion is general to asynchronous agent runtimes and handoff safety; no first-party project is required to establish it."
    rationale_zh: "该结论适用于异步 Agent Runtime 与 Handoff Safety；建立这一判断不需要引入任何自有项目。"
```

## Bounded judgment / 有界判断

A safe handoff does not require pretending every old task has disappeared. It requires the runtime to know which facts it can actually prove: **execution cancellation requested → routing ownership retired → task termination observed or residual work declared → external effects independently reconciled**. The selected source strongly supports the first two local boundaries and demonstrates bounded cleanup, while leaving external-effect closure deliberately unresolved.

安全 Handoff 不要求假装所有旧 Task 都已经消失，而是要求 Runtime 清楚知道自己究竟能证明哪些事实：**已请求 Execution Cancellation → Routing Ownership 已退出 → 已观察 Task Termination 或声明 Residual Work → 外部 Effect 独立完成 Reconciliation**。所选来源有力支持前两个本地边界，并展示了 Bounded Cleanup；External-effect Closure 则明确仍未解决。
