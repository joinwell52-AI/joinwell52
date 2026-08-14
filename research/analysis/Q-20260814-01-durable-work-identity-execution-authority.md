---
schema: "research-analysis/v1"
id: "AN-20260814-01"
date: "2026-08-14"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260814-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260814-01-persistent-thread-queue-dispatch-boundary.md"
output_contract: "Research Object"
research_object: "Durable Work Identity Without Automatic Execution Authority"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Durable Work Identity Without Automatic Execution Authority

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-14 Reading Result for Q-20260814-01. It treats merged code and tests as bounded implementation facts and keeps broader digital-employee architecture conclusions explicitly interpretive.

本对象仅分析 Q-20260814-01 的 2026-08-14 已完成 Reading Result。合并代码与测试只作为有界实现事实使用，更广泛的数字员工架构结论均明确标记为分析解释。

```yaml
analysis:
  research_question: "How should a long-lived digital employee preserve pending work across interruption and restart without turning persistence itself into permission to execute?"
  research_question_zh: "长期运行的数字员工应如何在中断与重启后保留待办工作，同时避免把‘已持久化’本身误当成‘允许执行’？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The selected Codex implementation persists queued submissions per thread with stable queue-item identity and a client message identity that survives update and later dispatch."
      claim_zh: "所选 Codex 实现按 Thread 持久化 Queue Submission，并保留稳定的 Queue-item Identity 与可跨更新、后续派发存续的 Client Message Identity。"
      source: "research/reading/Q-20260814-01-persistent-thread-queue-dispatch-boundary.md"
      strength: "direct merged-code and regression-test evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Queue persistence does not itself consume work: dispatch asks Core to start only if idle, and the persisted item is deleted only after Core returns Started."
      claim_zh: "Queue 持久化本身不会消费工作：派发先请求 Core 在 Idle 时启动，只有 Core 返回 Started 后才删除持久化 Queue Item。"
      source: "research/reading/Q-20260814-01-persistent-thread-queue-dispatch-boundary.md"
      strength: "direct merged-code evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The implementation deliberately suppresses automatic dispatch when a thread is Interrupted, including budget-limited aborts, while an explicit queue/start operation provides an operator-controlled resume path."
      claim_zh: "实现会在 Thread 处于 Interrupted 时有意抑制自动派发，包括 Budget-limited Abort；同时通过显式 queue/start 提供由操作者控制的恢复路径。"
      source: "research/reading/Q-20260814-01-persistent-thread-queue-dispatch-boundary.md"
      strength: "direct merged-code and test evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "Per-thread dispatch is serialized with an in-process mutex, but the source does not establish cross-process mutual exclusion, distributed replication, or exactly-once completion of external side effects."
      claim_zh: "按 Thread 的派发通过进程内 Mutex 串行化，但来源并未建立跨进程互斥、分布式复制，也未建立外部副作用的 Exactly-once Completion。"
      source: "research/reading/Q-20260814-01-persistent-thread-queue-dispatch-boundary.md"
      strength: "direct mechanism plus explicit source boundary"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "A digital-employee runtime should model durable work identity, dispatch admission, and resumption authorization as separate control planes."
      claim_zh: "数字员工 Runtime 应把持久工作身份、派发准入与恢复授权建模为相互独立的控制面。"
      source: "E1,E2,E3,E4"
      strength: "bounded architectural interpretation"
      independent: false

  observations:
    - "The strongest boundary in the selected mechanism is not queue persistence itself but deletion-after-admission: persisted work remains authoritative until Core has accepted the turn."
    - "Interruption is treated as a policy boundary rather than merely another idle state; persistence preserves work while explicit authorization controls resumption."
    - "Failed idle states may continue automatically, which shows that failure classification is itself part of dispatch policy rather than a storage concern."
  observations_zh:
    - "所选机制中最关键的边界不是 Queue Persistence 本身，而是 Admission 之后才删除：在 Core 接纳 Turn 之前，持久工作仍保持权威。"
    - "Interruption 被视为 Policy Boundary，而不是普通 Idle State；Persistence 负责保留工作，显式授权负责恢复执行。"
    - "Failed Idle 可以自动继续，说明 Failure Classification 本身属于 Dispatch Policy，而不是存储问题。"

  comparisons:
    - "A transient pending-message buffer can defer execution, but it cannot provide the demonstrated cold-resume work identity or authoritative post-restart queue state."
    - "Deleting before execution admission creates a loss window; deleting after Started narrows that window but still does not guarantee exactly-once completion after later crashes."
    - "Automatically draining on every idle state maximizes throughput but erases the distinction between an operator/policy stop and permission to continue."
  comparisons_zh:
    - "瞬时 Pending-message Buffer 可以延迟执行，却不能提供这里证明的 Cold-resume 工作身份与重启后的权威 Queue State。"
    - "在 Execution Admission 前删除会产生丢失窗口；Started 后再删除缩小了该窗口，但仍不能保证后续崩溃后的 Exactly-once Completion。"
    - "所有 Idle State 都自动 Drain 可以提高吞吐量，但会抹掉操作者/Policy Stop 与继续执行许可之间的区别。"

  counterarguments:
    - "For single-process, low-risk assistants, a simpler queue plus immediate automatic drain may be an acceptable engineering tradeoff."
    - "An explicit pause after every failure could make autonomous systems unnecessarily brittle; some failure classes may legitimately allow continuation."
    - "Stable queue identity does not by itself require a global workflow engine; the required coordination scope depends on whether work can be consumed by multiple processes or hosts."
  counterarguments_zh:
    - "对单进程、低风险 Assistant，更简单的 Queue 加即时 Auto-drain 可能是合理工程取舍。"
    - "每类 Failure 都强制显式暂停可能让自治系统过度脆弱；某些 Failure Class 可以合理允许继续。"
    - "稳定 Queue Identity 本身并不必然要求全局 Workflow Engine；所需协调范围取决于工作是否可能被多个进程或主机消费。"

  research_judgment: "For long-lived digital employees, pending work should be durable before execution, but durability must not imply execution authority. A safer runtime separates three facts: the work exists, a dispatcher is currently allowed to admit it, and a pause or interruption has been explicitly cleared. The selected implementation demonstrates a strong local version of that separation, while cross-process leases and side-effect idempotency remain separate unsolved layers."
  research_judgment_zh: "对于长期运行的数字员工，待办工作应在执行前具备持久身份，但‘持久存在’不能推导出‘拥有执行权’。更安全的 Runtime 应分开三个事实：工作存在、当前 Dispatcher 被允许准入、暂停或中断已经被明确解除。所选实现展示了这一分离的有力本地版本，但跨进程 Lease 与副作用 Idempotency 仍是独立且未解决的层。"

  general_implications:
    - "Work records should retain stable identity independently of worker sessions and UI connections."
    - "Consumption should occur only after an authoritative execution-admission event, not merely because a queue record is visible."
    - "Pause, interruption, budget exhaustion and policy stop should be represented as explicit resumption states rather than inferred from generic idleness."
    - "Multi-worker runtimes additionally need a cross-process lease or equivalent ownership mechanism; local serialization is insufficient once multiple consumers share the same durable queue."
    - "Recovery after execution admission needs separate evidence for external side effects, retry safety and idempotency."
  general_implications_zh:
    - "Work Record 应独立于 Worker Session 与 UI Connection 保留稳定身份。"
    - "只有权威 Execution-admission 事件发生后才应消费工作，而不能因为 Queue Record 可见就自动消费。"
    - "Pause、Interruption、Budget Exhaustion 与 Policy Stop 应表示为显式 Resumption State，而不是从普通 Idle 推断。"
    - "进入 Multi-worker Runtime 后还需要跨进程 Lease 或等价 Ownership Mechanism；多个消费者共享同一 Durable Queue 时，本地串行化不够。"
    - "Execution Admission 之后的恢复还需要单独证明外部副作用、Retry Safety 与 Idempotency。"

  limitations:
    - "The evidence is one experimental Codex per-thread queue implementation and its tests, not an independent evaluation of digital-employee scheduling architectures."
    - "The source does not establish distributed queue consensus, cross-process exclusion, priorities, deadlines, dependencies, SLA policy or cross-thread scheduling."
    - "Deleting a queued item after Core reports Started is not proof that model or tool side effects will complete exactly once."
  limitations_zh:
    - "证据来自一个实验性的 Codex Per-thread Queue 实现及其测试，并不是对数字员工调度架构的独立评估。"
    - "来源未建立 Distributed Queue Consensus、跨进程互斥、Priority、Deadline、Dependency、SLA Policy 或 Cross-thread Scheduling。"
    - "Core 返回 Started 后删除 Queue Item，并不能证明模型或工具副作用会 Exactly-once 完成。"

  open_questions:
    - "What durable lease and fencing model is required when more than one worker can consume one thread's queue?"
    - "Which failure classes should pause automatically, continue automatically, or require human authorization?"
    - "What evidence must survive a crash between execution admission and durable completion so a retry does not repeat external side effects?"
  open_questions_zh:
    - "当多个 Worker 可能消费同一 Thread Queue 时，需要怎样的 Durable Lease 与 Fencing Model？"
    - "哪些 Failure Class 应自动暂停、自动继续，或必须经过人工授权？"
    - "从 Execution Admission 到 Durable Completion 之间发生崩溃时，哪些证据必须存续，才能避免 Retry 重复外部副作用？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence", "technical-analysis", "engineering-implications", "operational-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment is general to long-lived agent and digital-employee runtimes; no first-party project is required to establish it."
    rationale_zh: "该判断适用于长期 Agent 与数字员工 Runtime；成立并不需要引入任何自有项目。"
```

## Bounded judgment / 有界判断

Durable pending work is a necessary reliability primitive, but it is not an execution permit. The useful architectural split is **work identity → execution admission → resumption authorization**. The selected source demonstrates that split inside one runtime, while leaving distributed ownership and external-effect recovery outside its evidence boundary.

持久待办是可靠性的重要基础，但它不是执行许可证。更有价值的架构分层是 **工作身份 → 执行准入 → 恢复授权**。所选来源在单一 Runtime 内展示了这种分离，同时把分布式 Ownership 与外部副作用恢复明确留在证据边界之外。
