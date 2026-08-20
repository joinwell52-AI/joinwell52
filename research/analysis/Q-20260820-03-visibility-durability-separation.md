---
schema: "research-analysis/v1"
id: "AN-20260820-03"
date: "2026-08-20"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260820-03"
column: "open-source-engineering"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260820-03-atomic-artifact-version-publication.md"
output_contract: "Research Object"
research_object: "Separate Artifact Visibility from Durability"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Separate Artifact Visibility from Durability

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-20 Reading Result for Q-20260820-03. The merged Google ADK implementation and regression tests establish a bounded filesystem publication protocol: a writer reserves a hidden pending version, stages payload and metadata there, and exposes the version to normal readers only through a final rename. This addresses process-level partial visibility and concurrent reservation races under the demonstrated filesystem assumptions. It explicitly does not provide `fsync`-backed power-loss durability, distributed transactionality or automatic reclamation of abandoned reservations.

本对象仅分析 Q-20260820-03 的 2026-08-20 已完成 Reading Result。Google ADK 的已合并实现与回归测试建立了一个有界 Filesystem Publication Protocol：Writer 先预留隐藏 Pending Version，在其中写入 Payload 与 Metadata，最后通过一次 Rename 才让普通 Reader 看见该 Version。该机制在已演示文件系统假设下处理 Process-level Partial Visibility 与并发 Reservation Race；它明确不提供 `fsync` 支持的 Power-loss Durability、Distributed Transactionality 或 Abandoned Reservation 的自动回收。

```yaml
analysis:
  research_question: "What should an artifact version mean operationally when visibility, writer ownership and durable storage are separate state transitions?"
  research_question_zh: "当 Visibility、Writer Ownership 与 Durable Storage 是不同状态转换时，一个 Artifact Version 在运行语义上应该代表什么？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The merged FileArtifactService reserves versions in hidden .{version}.pending directories that normal integer-version discovery ignores."
      claim_zh: "已合并的 FileArtifactService 使用隐藏的 .{version}.pending Directory 预留 Version，而普通 Integer-version Discovery 会忽略这些目录。"
      source: "research/reading/Q-20260820-03-atomic-artifact-version-publication.md"
      strength: "direct merged-code evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Payload and metadata are staged under the pending path and the complete tree becomes visible under the integer version name only through one os.replace operation."
      claim_zh: "Payload 与 Metadata 都先写入 Pending Path，完整 Tree 只有通过一次 os.replace 才以 Integer Version Name 对 Reader 可见。"
      source: "research/reading/Q-20260820-03-atomic-artifact-version-publication.md"
      strength: "direct implementation and regression-test evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "Directory creation arbitrates concurrent reservations and a destination recheck prevents a stale version list from replacing a version that was published concurrently."
      claim_zh: "Directory Creation 用于仲裁并发 Reservation，Destination Recheck 防止基于 Stale Version List 的 Writer 覆盖并发已发布 Version。"
      source: "research/reading/Q-20260820-03-atomic-artifact-version-publication.md"
      strength: "direct implementation and test evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "The maintainers explicitly exclude full power-loss durability because payload, metadata and parent directories are not fsync-synchronized."
      claim_zh: "维护者明确排除完整 Power-loss Durability，因为 Payload、Metadata 与 Parent Directory 没有通过 fsync 同步。"
      source: "research/reading/Q-20260820-03-atomic-artifact-version-publication.md"
      strength: "explicit source limitation"
      independent: false
    - id: "E5"
      identity: "public-fact"
      claim: "Abandoned pending reservations may intentionally create permanent version gaps because the process cannot safely infer that another writer no longer owns the reservation."
      claim_zh: "Abandoned Pending Reservation 可以有意留下永久 Version Gap，因为 Process 无法安全推断另一个 Writer 已经不再拥有该 Reservation。"
      source: "research/reading/Q-20260820-03-atomic-artifact-version-publication.md"
      strength: "direct implementation and documented behavior evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Artifact systems should model reservation, staged completeness, reader visibility and durable persistence as separate facts instead of collapsing them into one Published state."
      claim_zh: "Artifact System 应把 Reservation、Staged Completeness、Reader Visibility 与 Durable Persistence 建模为不同事实，而不是压缩成一个 Published State。"
      source: "E1,E2,E3,E4,E5"
      strength: "bounded lifecycle interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "An atomic visibility transition can establish what readers may observe without establishing crash durability; recovery and durability evidence therefore need independent contracts."
      claim_zh: "Atomic Visibility Transition 可以建立 Reader 能观察到什么，却不能建立 Crash Durability；因此 Recovery 与 Durability Evidence 需要独立契约。"
      source: "E1,E2,E4,E5"
      strength: "bounded engineering interpretation"
      independent: false

  observations:
    - "The hidden pending namespace acts as an admission boundary for reader visibility rather than merely as a temporary filename convention."
    - "Filesystem directory creation provides a cross-writer ownership signal stronger than an in-memory mutex for the demonstrated local storage case."
    - "The final rename is a publication event, not a durability certificate."
    - "Version gaps are evidence of conservative ownership handling: the design prefers not to reclaim ambiguous state even at the cost of contiguous numbering."
  observations_zh:
    - "Hidden Pending Namespace 实际上是 Reader Visibility 的 Admission Boundary，而不只是临时文件命名习惯。"
    - "在已演示 Local Storage 场景中，Filesystem Directory Creation 提供的跨 Writer Ownership Signal 比 In-memory Mutex 更强。"
    - "Final Rename 是 Publication Event，而不是 Durability Certificate。"
    - "Version Gap 体现了保守 Ownership Handling：设计宁愿不回收 Ambiguous State，也不追求连续编号。"

  comparisons:
    - "Creating the final visible directory before content is complete conflates reservation with publication and exposes partial state."
    - "An in-process lock can serialize local threads but does not by itself separate incomplete state from reader-visible state or coordinate independent processes."
    - "Pending-state isolation plus rename makes publication atomic under the assumed filesystem semantics, while a stronger crash-consistency protocol would additionally require explicit persistence ordering and synchronization."
    - "Reclaiming abandoned reservations improves numbering aesthetics but requires trustworthy liveness or ownership evidence that this implementation deliberately lacks."
  comparisons_zh:
    - "先创建 Final Visible Directory 再写内容会把 Reservation 与 Publication 混为一谈，并暴露 Partial State。"
    - "In-process Lock 可以串行化本地 Thread，却不能单独把 Incomplete State 与 Reader-visible State 分离，也不能协调独立 Process。"
    - "Pending-state Isolation + Rename 在假定 Filesystem Semantics 下使 Publication 原子化；更强的 Crash-consistency Protocol 还需要显式 Persistence Ordering 与 Synchronization。"
    - "回收 Abandoned Reservation 可以让编号更整齐，但要求当前实现明确缺失的可信 Liveness 或 Ownership Evidence。"

  counterarguments:
    - "On filesystems with weaker or different rename semantics, the demonstrated publication invariant may not hold without additional constraints."
    - "Some consumers may prefer contiguous versions and coordinated cleanup, but that requires a stronger ownership protocol rather than guessing that a pending directory is abandoned."
    - "For low-value temporary artifacts, a full fsync protocol may be unnecessarily expensive; durability strength should match the artifact's recovery requirements."
  counterarguments_zh:
    - "在 Rename Semantics 更弱或不同的 Filesystem 上，如果没有额外约束，已演示 Publication Invariant 可能并不成立。"
    - "部分 Consumer 可能需要连续 Version 与协调清理，但这要求更强 Ownership Protocol，而不是猜测某个 Pending Directory 已被遗弃。"
    - "对于低价值 Temporary Artifact，完整 fsync Protocol 可能成本过高；Durability Strength 应匹配 Artifact 的 Recovery Requirement。"

  research_judgment: "Artifact publication should separate ownership, completeness, visibility and durability. A version should become reader-visible only after its complete staged representation crosses an explicit publication boundary, but that visibility event should not be treated as proof of crash-durable storage. The ADK change demonstrates a compact process-level pattern—pending reservation, complete staging, destination recheck and atomic rename—while also showing that conservative recovery may legitimately tolerate version gaps when ownership cannot be proven stale."
  research_judgment_zh: "Artifact Publication 应分离 Ownership、Completeness、Visibility 与 Durability。只有完整 Staged Representation 跨过显式 Publication Boundary 后，Version 才应对 Reader 可见；但该 Visibility Event 不应被当作 Crash-durable Storage 的证明。ADK 变更演示了一个紧凑的 Process-level Pattern：Pending Reservation、Complete Staging、Destination Recheck 与 Atomic Rename；同时也表明，当无法证明 Ownership 已失效时，保守 Recovery 可以合理容忍 Version Gap。"

  general_implications:
    - "Artifact and checkpoint schemas should expose state transitions such as Reserved, Staged, Published and Durability-Verified instead of overloading one success flag."
    - "Readers should enumerate only publication-authorized identities; staging namespaces should be structurally undiscoverable as completed objects."
    - "Writer ownership should be established through an arbiter visible to all competing writers in the relevant fault domain."
    - "Crash durability needs independent evidence, such as persistence synchronization or a recoverable storage protocol, rather than inference from rename success."
    - "Cleanup of abandoned state should require proof of stale ownership or a lease/reconciliation mechanism."
  general_implications_zh:
    - "Artifact 与 Checkpoint Schema 应暴露 Reserved、Staged、Published、Durability-Verified 等状态转换，而不是把它们压进一个 Success Flag。"
    - "Reader 只应枚举获得 Publication Authority 的 Identity；Staging Namespace 在结构上不应被发现为 Completed Object。"
    - "Writer Ownership 应通过相关 Fault Domain 内所有竞争 Writer 都可观察的 Arbiter 建立。"
    - "Crash Durability 需要独立 Evidence，例如 Persistence Synchronization 或可恢复 Storage Protocol，而不能从 Rename Success 推断。"
    - "Abandoned State 的 Cleanup 应要求 Stale Ownership 证明，或使用 Lease/Reconciliation Mechanism。"

  limitations:
    - "Evidence is limited to the demonstrated FileArtifactService implementation, tests and filesystem assumptions."
    - "No fsync-backed power-loss or storage-controller durability is established."
    - "The implementation does not automatically clean abandoned reservations or repair malformed historical published directories."
    - "The source does not establish multi-artifact transactions or distributed storage semantics."
  limitations_zh:
    - "证据仅限于已演示 FileArtifactService 实现、测试与 Filesystem Assumption。"
    - "没有建立 fsync 支持的 Power-loss 或 Storage-controller Durability。"
    - "实现不会自动清理 Abandoned Reservation，也不会修复历史 Malformed Published Directory。"
    - "来源没有建立 Multi-artifact Transaction 或 Distributed Storage Semantics。"

  open_questions:
    - "Should artifact APIs expose publication visibility and durability acknowledgement as separate states?"
    - "How can pending reservations be garbage-collected safely across process crashes without misclassifying a slow live writer?"
    - "Which filesystem capabilities should be verified before relying on directory rename as the publication boundary?"
    - "What crash-injection tests are required before upgrading the claim from process-level atomic visibility to durable recovery semantics?"
  open_questions_zh:
    - "Artifact API 是否应把 Publication Visibility 与 Durability Acknowledgement 暴露为不同状态？"
    - "跨 Process Crash 时如何安全回收 Pending Reservation，而不把 Slow Live Writer 误判为失效？"
    - "依赖 Directory Rename 作为 Publication Boundary 前，应验证哪些 Filesystem Capability？"
    - "把结论从 Process-level Atomic Visibility 提升到 Durable Recovery Semantics 前，需要哪些 Crash-injection Test？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence", "technical-analysis", "engineering-implications", "operational-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment is a general storage-publication and recovery pattern and does not depend on first-party project mapping."
    rationale_zh: "该判断属于一般 Storage Publication 与 Recovery Pattern，不依赖任何自有项目映射。"
```

## Bounded judgment / 有界判断

The central distinction is **visible is not durable**. The source demonstrates a strong process-level publication boundary by hiding incomplete state and exposing it only through a final rename. It also explicitly demonstrates the limit of that claim: without a durability protocol, successful visibility cannot be promoted into crash-consistent persistence.

核心区分是 **Visible ≠ Durable**。来源通过隐藏 Incomplete State 并只在 Final Rename 后暴露它，演示了较强的 Process-level Publication Boundary；同时也明确展示了结论边界：缺少 Durability Protocol 时，Visibility Success 不能被提升为 Crash-consistent Persistence。
