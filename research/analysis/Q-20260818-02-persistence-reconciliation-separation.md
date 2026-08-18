---
schema: "research-analysis/v1"
id: "AN-20260818-02"
date: "2026-08-18"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260818-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260818-02-cross-process-durable-queue-wakeup.md"
output_contract: "Research Object"
research_object: "Persistence and Reconciliation as Separate Durable-Work Responsibilities"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Persistence and Reconciliation as Separate Durable-Work Responsibilities

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-18 Reading Result for Q-20260818-02. The merged Codex SQLite queue implementation and tests establish bounded facts about change detection, revisions, resumed-thread reconciliation and independent wake retries. Broader conclusions about durable agent-runtime architecture are interpretations; they do not establish distributed exactly-once execution, consensus, global ordering or crash-proof duplicate suppression.

本对象仅分析 Q-20260818-02 的 2026-08-18 已完成 Reading Result。Codex 已合并的 SQLite Queue 实现与测试建立了关于 Change Detection、Revision、Resumed-thread Reconciliation 与独立 Wake Retry 的有界事实。关于持久 Agent Runtime 架构的更广泛结论属于解释；它们不构成分布式 Exactly-once、Consensus、Global Ordering 或 Crash-proof Duplicate Suppression 的证明。

```yaml
analysis:
  research_question: "Why is durable storage insufficient to guarantee that persisted agent work will be noticed and resumed by a live runtime?"
  research_question_zh: "为什么持久化存储本身不足以保证已经落盘的 Agent 工作一定会被活跃 Runtime 发现并恢复？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The merged implementation uses SQLite PRAGMA data_version as a coarse detector for writes committed through another connection."
      claim_zh: "已合并实现使用 SQLite PRAGMA data_version 作为发现其他连接已提交写入的粗粒度检测器。"
      source: "research/reading/Q-20260818-02-cross-process-durable-queue-wakeup.md"
      strength: "direct merged-code evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Durable per-thread revisions identify which loaded queues changed, are updated across insert, update and delete, and are backfilled for existing queues during migration."
      claim_zh: "持久化 Per-thread Revision 用于识别哪些已加载 Queue 发生变化，并在 Insert、Update、Delete 时更新，同时在迁移时为既有 Queue 回填基线。"
      source: "research/reading/Q-20260818-02-cross-process-durable-queue-wakeup.md"
      strength: "direct merged-code and test evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "Newly created or resumed threads are reconciled separately from the global database-change signal, including scanning from revision zero when required."
      claim_zh: "新创建或恢复的 Thread 会独立于全局数据库变化信号进行 Reconcile，必要时从 Revision Zero 开始扫描。"
      source: "research/reading/Q-20260818-02-cross-process-durable-queue-wakeup.md"
      strength: "direct merged-code and test evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "Separate per-thread watcher tasks retry unresolved wakeups on a fixed 10-second interval, so one blocked thread does not serialize unrelated watcher progress."
      claim_zh: "独立的 Per-thread Watcher Task 会以固定 10 秒间隔重试未解决的 Wakeup，因此一个阻塞 Thread 不会串行阻塞其他 Watcher 进度。"
      source: "research/reading/Q-20260818-02-cross-process-durable-queue-wakeup.md"
      strength: "direct merged-code and regression-test evidence"
      independent: false
    - id: "E5"
      identity: "public-fact"
      claim: "The change does not claim distributed exactly-once delivery, consensus, global ordering across queues or crash-proof duplicate suppression."
      claim_zh: "该变更没有声称分布式 Exactly-once Delivery、Consensus、跨 Queue Global Ordering 或 Crash-proof Duplicate Suppression。"
      source: "research/reading/Q-20260818-02-cross-process-durable-queue-wakeup.md"
      strength: "direct source limitation"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Persistence and liveness are separate responsibilities: storage can preserve work while the runtime still requires a reconciliation mechanism to discover that the work became actionable."
      claim_zh: "Persistence 与 Liveness 是不同责任：存储可以保住工作，但 Runtime 仍需要 Reconciliation 机制去发现这些工作已经变得可执行。"
      source: "E1,E2,E3,E4,E5"
      strength: "bounded architectural interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "A useful reconciliation plane needs both change identity and execution ownership; detection without bounded retry ownership can still leave one stuck object blocking progress."
      claim_zh: "有效的 Reconciliation Plane 同时需要 Change Identity 与 Execution Ownership；只有变化发现而没有有界 Retry Ownership，仍可能让单个卡住对象拖住整体进展。"
      source: "E2,E3,E4"
      strength: "bounded architectural interpretation"
      independent: false

  observations:
    - "The implementation deliberately separates database-change detection from in-memory lifecycle discovery of created or resumed threads."
    - "Durable revisions narrow a coarse database-change signal to object-level queues without turning the revision into an execution token."
    - "Per-thread retry ownership isolates liveness failure at the wake layer rather than using one global retry loop."
  observations_zh:
    - "该实现刻意把数据库变化检测与新建/恢复 Thread 的内存生命周期发现分开。"
    - "持久 Revision 把粗粒度数据库变化缩小到对象级 Queue，但没有把 Revision 变成执行令牌。"
    - "Per-thread Retry Ownership 把 Wake Layer 的活性失败隔离开，而不是使用一个全局重试循环。"

  comparisons:
    - "Persistence without reconciliation preserves intent but can leave actionable work dormant after cross-process writes."
    - "Polling every loaded queue on every interval is simpler but loses the two-level efficiency of coarse database change plus per-thread revision."
    - "A single global retry loop centralizes control but introduces head-of-line blocking when one queue remains unable to wake."
    - "A broker-driven notification system could reduce polling latency, but it still needs durable reconciliation after missed notifications or process restarts."
  comparisons_zh:
    - "只有 Persistence 而没有 Reconciliation 可以保存意图，却可能让跨进程写入后的可执行工作长期休眠。"
    - "每个周期扫描所有已加载 Queue 更简单，但失去了数据库粗粒度变化加 Per-thread Revision 的两级效率。"
    - "单一全局 Retry Loop 集中了控制，却会在某个 Queue 持续无法 Wake 时产生 Head-of-line Blocking。"
    - "Broker 推送可以降低轮询延迟，但在通知丢失或进程重启后仍需要持久 Reconciliation。"

  counterarguments:
    - "For a single-process runtime with no external writers, an explicit cross-process reconciliation plane may be unnecessary overhead."
    - "A database or message broker that provides reliable change streams could replace the demonstrated PRAGMA data_version polling mechanism."
    - "Independent retry loops improve wake isolation but can increase concurrent pressure and therefore still require shared-resource admission or fairness controls."
  counterarguments_zh:
    - "对于不存在外部写入者的单进程 Runtime，显式跨进程 Reconciliation Plane 可能是多余开销。"
    - "如果数据库或 Message Broker 提供可靠 Change Stream，可以替代这里演示的 PRAGMA data_version 轮询机制。"
    - "独立 Retry Loop 改善 Wake Isolation，但也会增加并发压力，因此仍可能需要共享资源 Admission 或 Fairness Control。"

  research_judgment: "A durable agent-work system should treat persistence and reconciliation as separate architectural responsibilities. Persistence proves that work state survived; reconciliation proves only that a live runtime can rediscover potentially actionable state and attempt progress. A robust reconciliation plane therefore needs a coarse external-change signal, durable per-object change identity, lifecycle reconciliation for objects that become locally relevant, and isolated retry ownership. These mechanisms improve liveness and recovery but must remain separate from stronger claims about exactly-once execution, distributed ownership or total ordering."
  research_judgment_zh: "持久 Agent Work System 应把 Persistence 与 Reconciliation 视为两项独立架构责任。Persistence 只能证明工作状态仍然存在；Reconciliation 只能证明活跃 Runtime 能重新发现可能可执行的状态并尝试推进。因此，一个稳健的 Reconciliation Plane 需要粗粒度 External-change Signal、持久化 Per-object Change Identity、针对新变为本地相关对象的 Lifecycle Reconciliation，以及隔离的 Retry Ownership。这些机制提升 Liveness 与 Recovery，但必须与 Exactly-once Execution、分布式 Ownership 或 Total Ordering 等更强结论分离。"

  general_implications:
    - "Durable task design should define who notices persisted changes after the writer and worker are different processes."
    - "Reconciliation state should identify changed work without being mistaken for proof that the work has executed."
    - "Resume and load events need their own reconciliation path because an object can become locally relevant without a fresh global store mutation."
    - "Retry ownership should be scoped narrowly enough that one failing work item cannot monopolize the liveness mechanism for unrelated work."
    - "Systems that require duplicate suppression or exclusive execution need an additional claim/lease/idempotency contract beyond the demonstrated revision mechanism."
  general_implications_zh:
    - "持久任务设计应明确：当 Writer 与 Worker 不在同一进程时，由谁负责发现已经落盘的变化。"
    - "Reconciliation State 应能标识变化工作，但不能被误解为工作已经执行的证明。"
    - "Resume 与 Load Event 需要自己的 Reconciliation Path，因为对象可能在没有新全局 Store Mutation 的情况下变得与本地 Runtime 相关。"
    - "Retry Ownership 应足够狭窄，使单个失败 Work Item 不会垄断无关工作的活性机制。"
    - "如果系统要求 Duplicate Suppression 或 Exclusive Execution，还需要额外的 Claim/Lease/Idempotency Contract，不能依赖这里演示的 Revision Mechanism。"

  limitations:
    - "Evidence is a SQLite-backed implementation and repository tests rather than an independent multi-process reliability benchmark."
    - "The fixed 10-second detection and retry interval is an implementation choice, not a demonstrated optimum."
    - "The evidence does not resolve simultaneous wake attempts by multiple runtimes after observing the same durable change."
    - "Downstream shared resources can still introduce head-of-line blocking even when watcher retries are independent."
  limitations_zh:
    - "证据来自 SQLite 后端实现与仓库测试，而不是独立的多进程可靠性 Benchmark。"
    - "固定 10 秒 Detection 与 Retry Interval 是实现选择，并非已证明的最优值。"
    - "证据没有解决多个 Runtime 在观察到相同持久变化后同时尝试 Wake 的问题。"
    - "即使 Watcher Retry 相互独立，下游共享资源仍可能重新引入 Head-of-line Blocking。"

  open_questions:
    - "What claim or lease prevents multiple runtimes from concurrently attempting the same durable thread after one external change?"
    - "How should reconciliation recover after a process crashes between observing a revision and successfully starting work?"
    - "What backoff, fairness and load-shedding policy is appropriate when many queues change at once?"
    - "What store-independent abstraction should replace SQLite data_version when the persistence layer changes?"
  open_questions_zh:
    - "一次外部变化后，应使用什么 Claim 或 Lease 防止多个 Runtime 同时尝试同一个持久 Thread？"
    - "如果进程在观察 Revision 与成功启动工作之间崩溃，Reconciliation 应如何恢复？"
    - "大量 Queue 同时变化时，应采用怎样的 Backoff、Fairness 与 Load-shedding Policy？"
    - "当 Persistence Layer 更换时，应使用什么 Store-independent Abstraction 替代 SQLite data_version？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "evidence", "technical-analysis", "architecture-implications", "operational-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment concerns a general durable-work reconciliation architecture and stands without first-party project mapping."
    rationale_zh: "该判断讨论一般持久工作 Reconciliation 架构，不需要映射任何自有项目即可成立。"
```

## Bounded judgment / 有界判断

Durability answers whether work survives; it does not answer whether a live process will notice and resume it. The evidence supports a separate reconciliation layer that discovers changes and owns isolated wake retries. It does not justify treating revisions or successful wakeups as proof of exactly-once execution or distributed exclusivity.

Durability 回答“工作是否还存在”，却不回答“活跃进程是否一定会发现并恢复它”。现有证据支持单独的 Reconciliation Layer 来发现变化并拥有隔离的 Wake Retry；它不支持把 Revision 或成功 Wake 进一步解释为 Exactly-once Execution 或分布式排他执行的证明。
