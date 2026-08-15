---
schema: "research-analysis/v1"
id: "AN-20260815-02"
date: "2026-08-15"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260815-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260815-02-native-a2a-task-delegation-finish-terminal-boundary.md"
output_contract: "Research Object"
research_object: "Delegation Needs Both Lifecycle Identity and Semantic Return Contracts"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Delegation Needs Both Lifecycle Identity and Semantic Return Contracts

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-15 Reading Result for Q-20260815-02. The selected ADK implementation, documentation and tests are bounded maintainer evidence. The analysis does not generalize ADK task mode into a universal A2A guarantee, cross-framework interoperability claim, or exactly-once distributed workflow property.

本对象仅分析 Q-20260815-02 的 2026-08-15 已完成 Reading Result。所选 ADK 实现、文档与测试属于有界的维护者证据。本分析不会把 ADK Task Mode 推广为通用 A2A 保证、跨框架互操作结论或 Exactly-once 分布式工作流属性。

```yaml
analysis:
  research_question: "What must a multi-agent architecture make explicit so a delegated remote task can pause, resume, finish and return control without confusing transport termination with successful work?"
  research_question_zh: "多 Agent 架构必须显式定义哪些要素，才能让远程委派任务暂停、恢复、完成并归还控制权，同时避免把 Transport Termination 误认成工作成功？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "In the selected ADK task mode, the coordinator FunctionCall identity becomes the isolation scope used to reconstruct delegated history, identify the active paused task, filter sibling activity and recover the matching terminal output."
      claim_zh: "在所选 ADK Task Mode 中，Coordinator FunctionCall Identity 成为 Isolation Scope，并被用于重建委派历史、识别暂停中的 Active Task、过滤 Sibling Activity 以及恢复匹配的 Terminal Output。"
      source: "research/reading/Q-20260815-02-native-a2a-task-delegation-finish-terminal-boundary.md"
      strength: "direct merged-code, documentation and test evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Task completion is represented by an explicit finish_task FunctionResponse whose output must satisfy the declared output schema; validation errors remain non-terminal, while remote FAILED/CANCELED/transport failures map to failed terminal semantics before control returns to the parent."
      claim_zh: "Task Completion 由显式 finish_task FunctionResponse 表示，其输出必须满足声明的 Output Schema；Validation Error 保持非终态，而远程 FAILED/CANCELED/Transport Failure 会先映射为失败终态语义，再把控制权交还 Parent。"
      source: "research/reading/Q-20260815-02-native-a2a-task-delegation-finish-terminal-boundary.md"
      strength: "direct merged-code, documentation and test evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The Runner uses a two-pass recovery strategy that first identifies scopes already closed by terminal finish evidence and then searches backward for the latest unresolved scope, reducing false reopening from later history events."
      claim_zh: "Runner 使用 Two-pass Recovery：先识别已经被 Terminal Finish Evidence 关闭的 Scope，再向后搜索最新未解决 Scope，从而降低后续 History Event 导致错误重开的风险。"
      source: "research/reading/Q-20260815-02-native-a2a-task-delegation-finish-terminal-boundary.md"
      strength: "direct merged-code evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "The mechanism remains ADK-specific: custom remote servers must implement compatible finish semantics, output schemas are not automatically negotiated, isolation scope is not a cryptographic trust boundary, and external side effects are not compensated by failure mapping."
      claim_zh: "该机制仍是 ADK 特定实现：自定义 Remote Server 必须实现兼容 Finish Semantics，Output Schema 不会自动协商，Isolation Scope 不是密码学信任边界，Failure Mapping 也不会补偿外部副作用。"
      source: "research/reading/Q-20260815-02-native-a2a-task-delegation-finish-terminal-boundary.md"
      strength: "direct source limitation"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "A delegated agent job needs two separate contracts: lifecycle identity for the exact delegated occurrence and a semantic return contract for what constitutes successful completion."
      claim_zh: "一个 Delegated Agent Job 需要两个彼此独立的合同：用于识别精确委派 Occurrence 的 Lifecycle Identity，以及定义什么才算成功完成的 Semantic Return Contract。"
      source: "E1,E2,E3,E4"
      strength: "bounded architectural interpretation"
      independent: false

  observations:
    - "The FunctionCall-based scope is useful because one identity travels through delegation start, scoped history, pause/resume recovery and finish matching instead of inventing unrelated IDs at each phase."
    - "The explicit finish contract separates 'the remote stream stopped' from 'the delegated work produced a schema-valid business result'."
    - "Two-pass recovery treats terminal evidence as lifecycle truth rather than assuming the newest event is the newest active task."
  observations_zh:
    - "FunctionCall-based Scope 的价值在于同一个 Identity 贯穿 Delegation Start、Scoped History、Pause/Resume Recovery 与 Finish Matching，而不是每个阶段再发明互不关联的 ID。"
    - "显式 Finish Contract 把‘远程 Stream 停止了’与‘委派工作产生了 Schema-valid Business Result’分离。"
    - "Two-pass Recovery 把 Terminal Evidence 视为 Lifecycle Truth，而不是假设最新 Event 就代表最新 Active Task。"

  comparisons:
    - "A plain transfer model can move conversational control but provides a weaker return-to-parent contract for a bounded delegated job."
    - "End-of-stream completion conflates successful work, transport failure and cancellation; semantic finish evidence preserves those terminal classes separately."
    - "A single backward scan can mistake a previously closed task for active if later events exist; closed-scope identification before active-scope search is more robust."
  comparisons_zh:
    - "普通 Transfer Model 可以移动对话控制权，但对有界 Delegated Job 的 Return-to-parent Contract 更弱。"
    - "End-of-stream Completion 会混淆成功工作、Transport Failure 与 Cancellation；Semantic Finish Evidence 可以保留不同终态类别。"
    - "单次向后扫描可能因为已关闭任务后仍存在事件而误判其 Active；先识别 Closed Scope 再搜索 Active Scope 更稳健。"

  counterarguments:
    - "For short, stateless remote calls, an explicit delegated-task lifecycle may be more machinery than necessary; request/response semantics can be sufficient."
    - "A framework-specific finish tool can improve local correctness while reducing interoperability if other A2A implementations use different semantic completion contracts."
    - "Output-schema validation confirms shape, not business truth; a schema-valid result may still be wrong, stale or unauthorized."
  counterarguments_zh:
    - "对短时、无状态 Remote Call，显式 Delegated-task Lifecycle 可能过重；普通 Request/Response 语义可能已经足够。"
    - "Framework-specific Finish Tool 可以提升本地正确性，但若其他 A2A 实现采用不同 Semantic Completion Contract，也可能降低互操作性。"
    - "Output-schema Validation 只能确认形状，不能证明业务真值；Schema-valid Result 仍可能错误、过期或未授权。"

  research_judgment: "Reliable multi-agent delegation should make both occurrence identity and completion semantics first-class. The parent needs durable evidence of which delegated task is active or closed, while successful return must be established by a task-specific semantic terminal result rather than transport termination alone. ADK task mode demonstrates a coherent local design by reusing one delegation scope and explicit finish semantics, but cross-framework identity, remote durability, authorization and external-effect recovery require additional contracts."
  research_judgment_zh: "可靠的多 Agent 委派应把 Occurrence Identity 与 Completion Semantics 都提升为一等对象。Parent 需要可持久证明哪个 Delegated Task 仍 Active 或已经 Closed；成功返回则必须由 Task-specific Semantic Terminal Result 建立，而不能仅依赖 Transport Termination。ADK Task Mode 通过复用同一 Delegation Scope 与显式 Finish Semantics 展示了一个一致的本地设计，但 Cross-framework Identity、Remote Durability、Authorization 与 External-effect Recovery 仍需要额外合同。"

  general_implications:
    - "Delegated work should have a stable occurrence identity that survives pause/resume and is reused across history scoping, terminal evidence and result correlation."
    - "Protocol transport status and business/task semantic status should be represented separately; a closed connection is not a completion certificate."
    - "Terminal evidence should close lifecycle scopes explicitly so recovery can reason over authoritative closure rather than event recency alone."
    - "Failure/cancellation must return control without being rewritten as success, while compensation for already-produced effects remains a separate responsibility."
    - "Cross-framework delegation needs explicit compatibility contracts for scope identity, finish semantics, output schema and authorization before local guarantees can be composed."
  general_implications_zh:
    - "Delegated Work 应拥有可跨 Pause/Resume 存续的稳定 Occurrence Identity，并在 History Scoping、Terminal Evidence 与 Result Correlation 中复用。"
    - "Protocol Transport Status 与 Business/Task Semantic Status 应分别表达；连接关闭不是 Completion Certificate。"
    - "Terminal Evidence 应显式关闭 Lifecycle Scope，使 Recovery 根据权威 Closure 推理，而不是只依赖 Event Recency。"
    - "Failure/Cancellation 必须能够归还控制权且不能被重写成 Success；对已发生 Effect 的 Compensation 仍是独立责任。"
    - "跨框架 Delegation 需要先明确 Scope Identity、Finish Semantics、Output Schema 与 Authorization 的 Compatibility Contract，才能组合本地保证。"

  limitations:
    - "The evidence is one ADK task-mode implementation and its tests/documentation, not an independent benchmark of multi-agent delegation architectures."
    - "The source does not establish cryptographic delegation identity, cross-framework semantic agreement, durable remote-state consistency, deadline/lease policy or exactly-once delivery."
    - "Schema-valid finish output is semantic terminal evidence inside the local contract, not proof that the underlying result is factually correct or authorized."
  limitations_zh:
    - "证据来自一个 ADK Task-mode 实现及其测试/文档，并不是对多 Agent 委派架构的独立 Benchmark。"
    - "来源没有建立 Cryptographic Delegation Identity、Cross-framework Semantic Agreement、Durable Remote-state Consistency、Deadline/Lease Policy 或 Exactly-once Delivery。"
    - "Schema-valid Finish Output 是本地合同内的 Semantic Terminal Evidence，并不能证明底层结果事实正确或已经授权。"

  open_questions:
    - "How should delegation occurrence identity be carried and authenticated across heterogeneous A2A implementations?"
    - "Can semantic finish contracts and output schemas be negotiated through agent metadata rather than manually mirrored?"
    - "What durable evidence is required when a parent misses the final response after the remote task has already produced external effects?"
  open_questions_zh:
    - "Delegation Occurrence Identity 应如何在异构 A2A 实现之间传递并认证？"
    - "Semantic Finish Contract 与 Output Schema 能否通过 Agent Metadata 协商，而不是手工镜像？"
    - "当 Remote Task 已经产生外部 Effect、但 Parent 丢失最终响应时，需要保留哪些 Durable Evidence？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "mechanism-comparison", "lifecycle-analysis", "architecture-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment concerns general delegated-agent lifecycle and semantic completion contracts; no first-party project is required to establish it."
    rationale_zh: "该判断讨论通用 Delegated-agent Lifecycle 与 Semantic Completion Contract；成立不需要引入任何自有项目。"
```

## Bounded judgment / 有界判断

A delegated task is not governed merely because a protocol can send messages to another agent. A stronger boundary is **delegation occurrence identity → scoped lifecycle → semantic terminal evidence → return of control**. The selected ADK implementation shows how those pieces can align locally, while leaving interoperability, authorization, remote durability and side-effect recovery as separate architecture layers.

仅仅因为协议能够把消息发送给另一个 Agent，并不意味着 Delegated Task 已经受治理。更强的边界是 **委派 Occurrence Identity → Scoped Lifecycle → Semantic Terminal Evidence → 控制权归还**。所选 ADK 实现展示了这些环节如何在本地保持一致，但 Interoperability、Authorization、Remote Durability 与 Side-effect Recovery 仍是独立的架构层。
