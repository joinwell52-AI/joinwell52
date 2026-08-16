---
schema: "research-analysis/v1"
id: "AN-20260816-02"
date: "2026-08-16"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260816-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260816-02-reserved-thread-id-pending-metadata-ownership.md"
output_contract: "Research Object"
research_object: "Reservation, Materialization and Metadata Ownership Must Remain Distinct"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Reservation, Materialization and Metadata Ownership Must Remain Distinct

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-16 Reading Result for Q-20260816-02. The Codex merged implementation and tests establish a local reserved-thread and pending-metadata mechanism. Broader claims about distributed reservation, transactions, cross-host consistency or universal object-lifecycle protocols are not treated as established facts.

本对象仅分析 Q-20260816-02 的 2026-08-16 已完成 Reading Result。Codex 已合并实现与测试证明的是一个本地 Reserved-thread 与 Pending-metadata 机制。关于分布式 Reservation、Transaction、跨 Host 一致性或通用 Object-lifecycle Protocol 的更广结论，不作为已建立事实。

```yaml
analysis:
  research_question: "How can an orchestration system let a host attach state before an execution object fully materializes without confusing reserved identity, object existence and metadata authority?"
  research_question_zh: "编排系统如何允许 Host 在执行对象完全 Materialize 之前附加状态，同时又不混淆 Reserved Identity、Object Existence 与 Metadata Authority？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "Codex can reserve the final ThreadId before startup, use it for new/cleared/forked thread creation, and rejects a reserved ID for resume of an already existing thread."
      claim_zh: "Codex 可以在启动前预留最终 ThreadId，并用于 New/Cleared/Forked Thread 创建；对已经存在 Thread 的 Resume 则拒绝使用 Reserved ID。"
      source: "research/reading/Q-20260816-02-reserved-thread-id-pending-metadata-ownership.md"
      strength: "direct merged-code and regression-test evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Host-owned metadata is staged in a pending registry keyed by the reserved ID, requires the state database, is merged into the first successful metadata update, then consumed; unmaterialized shutdown or discard can clear it."
      claim_zh: "Host-owned Metadata 会按 Reserved ID 暂存在 Pending Registry 中，且要求 State Database；在第一次成功 Metadata Update 时合并并随后消费，未 Materialize 的 Shutdown 或 Discard 可清理该状态。"
      source: "research/reading/Q-20260816-02-reserved-thread-id-pending-metadata-ownership.md"
      strength: "direct merged-code and regression-test evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The mechanism deliberately limits staging: rollout_path cannot be staged, later observed metadata can participate in merge precedence, and uncertain rollout existence causes conservative preservation rather than destructive cleanup."
      claim_zh: "该机制有意限制 Staging：rollout_path 不能预先暂存，后续 Observed Metadata 可以参与 Merge Precedence；当 Rollout Existence 无法确认时，会保守保留 Pending State，而不是破坏性清理。"
      source: "research/reading/Q-20260816-02-reserved-thread-id-pending-metadata-ownership.md"
      strength: "direct mechanism and limitation evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Pre-materialization orchestration is clearer when identity reservation, pending host intent, authoritative materialization and cleanup are explicit lifecycle phases rather than one ambiguous 'created' state."
      claim_zh: "如果把 Identity Reservation、Pending Host Intent、Authoritative Materialization 与 Cleanup 建模为显式生命周期阶段，而不是一个含糊的‘Created’状态，Pre-materialization Orchestration 会更清晰。"
      source: "E1,E2,E3"
      strength: "bounded architectural interpretation"
      independent: false

  observations:
    - "The reserved ID is useful because the host and Core can refer to the same future object without creating a temporary alias and later identity handoff."
    - "The pending registry keeps host intent separate from the materialized object until a real persistence/update path exists."
    - "Successful merge closes the pending phase; cleanup on abandonment prevents a reservation from silently becoming permanent authoritative state."
    - "Conservative preservation under uncertainty shows that cleanup itself is an evidence-sensitive transition: absence of proof of materialization is not always proof of absence."
  observations_zh:
    - "Reserved ID 的价值在于 Host 与 Core 可以指向同一个未来对象，而不需要先创建临时 Alias 再做 Identity Handoff。"
    - "Pending Registry 在真实 Persistence/Update Path 出现之前，把 Host Intent 与 Materialized Object 分开。"
    - "成功 Merge 会关闭 Pending Phase；Abandonment 时的 Cleanup 则避免 Reservation 静默变成永久权威状态。"
    - "不确定时选择保守保留，说明 Cleanup 本身也是 Evidence-sensitive Transition：无法证明已经 Materialize，并不总等于已经证明没有 Materialize。"

  comparisons:
    - "Allocating identity only after startup simplifies lifecycle state but forces external components to hold temporary correlation IDs and reconcile them later."
    - "Writing staged metadata directly into a fully authoritative object record before materialization would conflate intent with existence and make abandonment harder to distinguish from creation."
    - "Deleting all pending state on shutdown is operationally simple but can lose legitimate host intent when the system cannot determine whether materialization already occurred."
  comparisons_zh:
    - "只有启动后才分配 Identity 会简化生命周期状态，但迫使外部组件维护临时 Correlation ID，并在之后进行对账。"
    - "如果在 Materialization 前就把 Staged Metadata 直接写成完整权威 Object Record，会把 Intent 与 Existence 混在一起，也更难区分 Abandonment 与 Creation。"
    - "Shutdown 时无条件删除 Pending State 操作简单，但当系统无法判断 Materialization 是否已经发生时，可能丢失合法 Host Intent。"

  counterarguments:
    - "For short-lived in-process objects, a separate reservation phase may add more state transitions than the problem warrants."
    - "A host could keep metadata externally and attach it after startup, avoiding changes to the runtime store at the cost of an additional correlation boundary."
    - "TTL-based cleanup may be simpler than lifecycle-aware cleanup in systems where stale reservations are harmless and metadata can be reconstructed."
  counterarguments_zh:
    - "对短生命周期的进程内对象，单独 Reservation Phase 可能增加超过问题本身所需的状态转换。"
    - "Host 也可以把 Metadata 保存在外部，等启动后再附加，从而不修改 Runtime Store，但代价是增加一个 Correlation Boundary。"
    - "如果 Stale Reservation 无害且 Metadata 可重建，TTL Cleanup 可能比 Lifecycle-aware Cleanup 更简单。"

  research_judgment: "Systems that need pre-materialization coordination should distinguish four things explicitly: a reserved stable identity, bounded pending host intent, an authoritative materialization transition, and abandonment/reconciliation cleanup. Reservation provides correlation, not proof that the object exists. Pending metadata expresses intent, not immutable ownership of the final record. The Codex implementation is a strong local example of this separation, but distributed systems would still need explicit lease/expiry, multi-writer ownership and reconciliation rules before the pattern can be treated as a cross-host reservation protocol."
  research_judgment_zh: "需要 Pre-materialization Coordination 的系统应显式区分四件事：Reserved Stable Identity、有限范围的 Pending Host Intent、Authoritative Materialization Transition，以及 Abandonment/Reconciliation Cleanup。Reservation 提供的是 Correlation，不是对象已经存在的证明；Pending Metadata 表达的是 Intent，不是对最终 Record 的不可变 Ownership。Codex 实现是这种分离的较强本地案例，但要把该模式扩展为跨 Host Reservation Protocol，分布式系统仍需明确 Lease/Expiry、Multi-writer Ownership 与 Reconciliation Rule。"

  general_implications:
    - "Control planes should model 'identity reserved' and 'object materialized' as different facts whenever work can be staged before creation."
    - "Pending pre-start state should declare field ownership and merge precedence instead of relying on undocumented overwrite behavior."
    - "Abandoned reservations need observable cleanup or reconciliation so stable IDs do not accumulate ambiguous lifecycle state."
    - "When materialization evidence is uncertain, cleanup policy should prefer explicit reconciliation over destructive inference."
    - "Distributed versions of this pattern require lease/expiry and concurrency rules that are not implied by a local pending registry."
  general_implications_zh:
    - "只要 Creation 前可以暂存工作，Control Plane 就应把‘Identity Reserved’与‘Object Materialized’建模为不同事实。"
    - "Pre-start Pending State 应声明 Field Ownership 与 Merge Precedence，而不是依赖未文档化的覆盖行为。"
    - "被放弃的 Reservation 需要可观察 Cleanup 或 Reconciliation，避免 Stable ID 累积出含糊 Lifecycle State。"
    - "当 Materialization Evidence 不确定时，Cleanup Policy 应优先显式 Reconciliation，而不是破坏性推断。"
    - "这一模式的分布式版本需要额外 Lease/Expiry 与 Concurrency Rule，本地 Pending Registry 本身并不提供这些保证。"

  limitations:
    - "The evidence establishes a Codex local-store implementation, not a general distributed reservation transaction."
    - "Pending metadata depends on the state database and not every ThreadStore implementation is proven to have identical semantics."
    - "Reserved identity does not guarantee successful materialization, and the source does not establish distributed garbage collection or cross-host consensus."
  limitations_zh:
    - "证据建立的是 Codex Local-store 实现，而不是通用分布式 Reservation Transaction。"
    - "Pending Metadata 依赖 State Database，并未证明所有 ThreadStore 实现都具有完全相同的语义。"
    - "Reserved Identity 不保证 Materialization 成功；来源也没有建立 Distributed Garbage Collection 或 Cross-host Consensus。"

  open_questions:
    - "Should reserved-but-never-materialized identities have a lease, TTL or explicit reconciliation queue?"
    - "Can metadata ownership and merge precedence be declared as a machine-readable contract for each field?"
    - "What evidence should close the reservation phase in a distributed system where creation and persistence can complete on another host?"
  open_questions_zh:
    - "Reserved-but-never-materialized Identity 应具有 Lease、TTL，还是进入显式 Reconciliation Queue？"
    - "每个 Metadata Field 的 Ownership 与 Merge Precedence 能否声明为机器可读 Contract？"
    - "在 Creation/Persistence 可能由另一 Host 完成的分布式系统中，什么 Evidence 才能正式关闭 Reservation Phase？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "evidence", "technical-analysis", "architecture-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The lifecycle distinction is general to orchestration and execution-object architecture; no first-party project is required for the conclusion."
    rationale_zh: "该生命周期区分适用于一般编排与执行对象架构；建立这一结论不需要引入任何自有项目。"
```

## Bounded judgment / 有界判断

A reserved identifier is **a promise of correlation, not evidence of existence**. A pending metadata patch is **host intent, not yet the authoritative object**. The stronger lifecycle is therefore **reserve identity → stage bounded intent → materialize and merge → consume or reconcile**. Codex demonstrates this pattern locally; distributed leases, ownership conflicts and cross-host cleanup remain separate research questions.

Reserved Identifier 是 **Correlation 的承诺，而不是 Existence 的证据**。Pending Metadata Patch 是 **Host Intent，而不是已经成立的权威对象**。因此更稳健的生命周期是 **Reserve Identity → Stage Bounded Intent → Materialize and Merge → Consume or Reconcile**。Codex 在本地实现中展示了这一模式；分布式 Lease、Ownership Conflict 与 Cross-host Cleanup 仍是独立研究问题。
