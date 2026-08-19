---
schema: "research-analysis/v1"
id: "AN-20260819-02"
date: "2026-08-19"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260819-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260819-02-async-user-message-delivery-plane.md"
output_contract: "Research Object"
research_object: "Delivery Plane and Reasoning Context as Separate Durable Planes"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Delivery Plane and Reasoning Context as Separate Durable Planes

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-19 Reading Result for Q-20260819-02. The Codex merged implementation and integration tests establish a bounded local mechanism: a gated root-agent tool emits a typed asynchronous user-visible item, persists delivery classification through protocol/history structures, waits for local item lifecycle emission, returns local acceptance to the model, and does not echo the visible text into the next model request as synthetic assistant context. The broader conclusions below are architectural interpretations; they do not establish end-to-end transport delivery, user acknowledgement, retry, exactly-once semantics, cancellation or global ordering.

本对象仅分析 Q-20260819-02 的 2026-08-19 已完成 Reading Result。Codex 的已合并实现与集成测试建立了一个有界本地机制：受门控的 Root Agent Tool 发出类型化异步用户可见 Item，在 Protocol/History 结构中保留 Delivery Classification，等待本地 Item Lifecycle Emission，向 Model 返回本地 Acceptance，并且不会把可见文本作为合成 Assistant Context 回灌到下一次 Model Request。下述更广泛结论属于架构解释；它们不建立端到端 Transport Delivery、User Acknowledgement、Retry、Exactly-once、Cancellation 或 Global Ordering。

```yaml
analysis:
  research_question: "How should a long-running agent architecture separate user-visible progress delivery from model reasoning context without losing replayable evidence about what was emitted?"
  research_question_zh: "长时间运行的 Agent Architecture 应如何把用户可见进度 Delivery 与 Model Reasoning Context 分离，同时不丢失对已发出内容的可回放证据？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The merged Codex change adds a root-only send_user_message_async tool gated by feature state and model support."
      claim_zh: "已合并的 Codex 变更新增 Root-only 的 send_user_message_async Tool，并受 Feature State 与 Model Support 双重门控。"
      source: "research/reading/Q-20260819-02-async-user-message-delivery-plane.md"
      strength: "direct merged-code evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "A valid call creates a typed AgentMessageItem with delivery=Async, emits ItemStarted and ItemCompleted, and only then returns accepted=true to the model-facing tool channel."
      claim_zh: "有效调用会创建 delivery=Async 的类型化 AgentMessageItem，发出 ItemStarted 与 ItemCompleted，随后才向 Model-facing Tool Channel 返回 accepted=true。"
      source: "research/reading/Q-20260819-02-async-user-message-delivery-plane.md"
      strength: "direct implementation and integration-test evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The integration test verifies that the asynchronous user-visible text is not inserted into the next model request as a synthetic assistant message."
      claim_zh: "集成测试验证：异步用户可见文本不会作为合成 Assistant Message 插入下一次 Model Request。"
      source: "research/reading/Q-20260819-02-async-user-message-delivery-plane.md"
      strength: "direct integration-test evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "Delivery metadata is represented in core protocol items, preserved through app-server projection and materialized in thread-history reconstruction."
      claim_zh: "Delivery Metadata 存在于 Core Protocol Item 中，经 App-server Projection 保留，并可在线程 History Reconstruction 中物化。"
      source: "research/reading/Q-20260819-02-async-user-message-delivery-plane.md"
      strength: "direct code-path evidence"
      independent: false
    - id: "E5"
      identity: "public-fact"
      claim: "The change introduces no remote acknowledgement, retry queue, message idempotency key, cancellation protocol or external-delivery receipt; accepted=true denotes local tool-path acceptance, not proof of external delivery."
      claim_zh: "该变更没有引入远程 Acknowledgement、Retry Queue、Message Idempotency Key、Cancellation Protocol 或 External-delivery Receipt；accepted=true 表示本地 Tool-path Acceptance，而不是外部送达证明。"
      source: "research/reading/Q-20260819-02-async-user-message-delivery-plane.md"
      strength: "direct source limitation"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "User-visible delivery and model reasoning context are separate state planes with different consumers and failure semantics; coupling them by default makes observability mutate reasoning state."
      claim_zh: "用户可见 Delivery 与 Model Reasoning Context 是面向不同 Consumer、具有不同 Failure Semantics 的独立 State Plane；默认把二者耦合，会让 Observability 反向修改 Reasoning State。"
      source: "E1,E2,E3,E4,E5"
      strength: "bounded architectural interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "A local acceptance receipt should be treated as control-plane evidence that a runtime item was accepted/emitted, while external delivery certainty requires a distinct effect or transport evidence plane."
      claim_zh: "本地 Acceptance Receipt 应被视为 Runtime Item 已被接受/发出的 Control-plane Evidence；外部 Delivery Certainty 则需要独立的 Effect 或 Transport Evidence Plane。"
      source: "E2,E4,E5"
      strength: "bounded evidence-plane interpretation"
      independent: false

  observations:
    - "The design deliberately lets user communication occur without automatically consuming future model context."
    - "Typed delivery metadata preserves a reconstructable classification even though the visible text is excluded from the next reasoning request."
    - "The return value accepted=true is sequenced after local item emission, so it can support a bounded local ordering claim but not an external transport claim."
    - "Separating delivery from reasoning creates a new responsibility: if later reasoning must remember the progress update, that memory must be represented explicitly elsewhere."
  observations_zh:
    - "该设计明确允许用户通信发生，而不会自动消耗后续 Model Context。"
    - "即使可见文本不进入下一次 Reasoning Request，类型化 Delivery Metadata 仍保留可重建的分类。"
    - "accepted=true 在本地 Item Emission 之后返回，因此可以支持有界本地顺序判断，但不能支持外部 Transport 判断。"
    - "把 Delivery 与 Reasoning 分离会产生新的责任：如果后续推理需要记住这条进度更新，就必须在其他地方显式表示该 Memory。"

  comparisons:
    - "A normal assistant message couples user communication, conversational memory and model context; the asynchronous path separates those concerns."
    - "Fire-and-forget notification without durable item identity reduces context cost but weakens auditability; typed history metadata preserves more evidence."
    - "Treating local acceptance as external delivery collapses runtime control evidence and transport/effect evidence into one status."
  comparisons_zh:
    - "普通 Assistant Message 把用户通信、Conversation Memory 与 Model Context 耦合；异步路径把这些关注点拆开。"
    - "没有持久 Item Identity 的 Fire-and-forget Notification 虽然降低 Context 成本，却削弱 Auditability；类型化 History Metadata 保留了更多证据。"
    - "把本地 Acceptance 当成外部 Delivery，会把 Runtime Control Evidence 与 Transport/Effect Evidence 压缩成一个状态。"

  counterarguments:
    - "For short conversational agents, keeping every user-visible message in model context may be simpler and may improve continuity."
    - "A separate delivery plane increases architecture complexity because correlation, retention and lifecycle semantics must be defined explicitly."
    - "If the final user-facing transport is tightly coupled to the same durable item store, a separate delivery-receipt layer may be lighter than in a distributed notification system, but the evidence boundary still should remain explicit."
  counterarguments_zh:
    - "对于短对话 Agent，把所有用户可见消息都留在 Model Context 中可能更简单，也可能改善连续性。"
    - "独立 Delivery Plane 会增加架构复杂度，因为 Correlation、Retention 与 Lifecycle Semantics 必须显式定义。"
    - "如果最终用户 Transport 与同一 Durable Item Store 强耦合，独立 Delivery Receipt 层可以比跨系统通知更轻，但 Evidence Boundary 仍应明确。"

  research_judgment: "Long-running agent systems should separate the delivery plane from the reasoning-context plane while binding both to stable message identity and replayable metadata. The runtime may acknowledge that a user-visible item was locally accepted and emitted without re-injecting its text into future model context; that preserves context budget and prevents observability from silently changing reasoning state. External delivery, acknowledgement, retry and effect certainty remain separate evidence responsibilities. If future reasoning needs the delivered fact, it should enter model state through an explicit memory or workflow-state mechanism rather than an accidental context echo."
  research_judgment_zh: "长时间运行的 Agent System 应把 Delivery Plane 与 Reasoning-context Plane 分离，同时使用稳定 Message Identity 与可回放 Metadata 绑定二者。Runtime 可以确认一个用户可见 Item 已在本地被接受并发出，而无需把其文本重新注入未来 Model Context；这既节省 Context Budget，也避免 Observability 静默改变 Reasoning State。External Delivery、Acknowledgement、Retry 与 Effect Certainty 仍属于独立 Evidence Responsibility。如果后续推理确实需要该已交付事实，应通过显式 Memory 或 Workflow-state 机制进入 Model State，而不是依赖偶然的 Context Echo。"

  general_implications:
    - "Agent runtimes should distinguish communication state, reasoning state and external-delivery evidence instead of overloading one transcript field."
    - "Progress messages benefit from stable item ids, delivery classification and replayable lifecycle events even when their text is excluded from model context."
    - "Local emission/acceptance and external user receipt should use different terminal labels and evidence sources."
    - "Context-excluded communication requires an explicit policy for what facts, if any, later become durable agent memory."
    - "Audit tooling should be able to reconstruct what the user was told without implying that the model subsequently reasoned over the same text."
  general_implications_zh:
    - "Agent Runtime 应区分 Communication State、Reasoning State 与 External-delivery Evidence，而不是让一个 Transcript Field 承担全部语义。"
    - "即使文本不进入 Model Context，Progress Message 仍适合拥有稳定 Item ID、Delivery Classification 与可回放 Lifecycle Event。"
    - "Local Emission/Acceptance 与 External User Receipt 应使用不同 Terminal Label 与 Evidence Source。"
    - "Context-excluded Communication 需要显式政策决定哪些事实会在之后进入 Durable Agent Memory。"
    - "Audit Tooling 应能重建用户被告知了什么，同时不暗示 Model 随后一定基于同样文本进行了推理。"

  limitations:
    - "Evidence comes from one merged Codex implementation and repository integration tests, not an independent study of user-notification reliability."
    - "The demonstrated ordering is local to the handler/event/model-request path and does not establish global ordering across threads or clients."
    - "No external transport acknowledgement, retry, idempotency or cancellation semantics are established."
    - "History reconstruction demonstrates typed materialization paths but not indefinite retention or crash durability under every failure mode."
  limitations_zh:
    - "证据来自一个已合并 Codex 实现及其仓库集成测试，而不是独立 User-notification Reliability 研究。"
    - "已演示顺序局限于 Handler/Event/Model-request 路径，不建立跨 Thread 或 Client 的 Global Ordering。"
    - "没有建立 External Transport Acknowledgement、Retry、Idempotency 或 Cancellation Semantics。"
    - "History Reconstruction 证明了类型化 Materialization 路径，但没有证明所有故障模式下的无限期 Retention 或 Crash Durability。"

  open_questions:
    - "What component owns the final user-facing delivery receipt and how is it correlated to the runtime AgentMessageItem id?"
    - "How should retries and duplicate suppression be represented without confusing them with model-tool acceptance?"
    - "What explicit memory mechanism should capture a delivered progress fact when later reasoning genuinely needs it?"
    - "How should rollback, compaction or export preserve the distinction between delivered-to-user evidence and model-context history?"
  open_questions_zh:
    - "哪个组件拥有最终 User-facing Delivery Receipt，并如何与 Runtime AgentMessageItem ID 关联？"
    - "应如何表示 Retry 与 Duplicate Suppression，同时避免与 Model-tool Acceptance 混淆？"
    - "当后续推理确实需要某个已交付进度事实时，应由什么显式 Memory Mechanism 保存它？"
    - "Rollback、Compaction 或 Export 应如何保留 Delivered-to-user Evidence 与 Model-context History 的区别？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "context", "evidence", "technical-analysis", "architecture-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment concerns a general agent-runtime separation between communication, reasoning context and delivery evidence; no first-party project is required."
    rationale_zh: "该判断讨论 Agent Runtime 中 Communication、Reasoning Context 与 Delivery Evidence 的一般分离，不需要引入任何自有项目。"
```

## Bounded judgment / 有界判断

The evidence supports separating “what the user was told” from “what the model reasons over” while preserving a typed, replayable local record. It does not support treating local tool acceptance as external delivery confirmation, nor does it establish retry, acknowledgement or exactly-once semantics outside the demonstrated runtime path.

现有证据支持把“用户被告知了什么”与“Model 基于什么进行推理”分离，同时保留类型化、可回放的本地记录。它不支持把本地 Tool Acceptance 视为外部 Delivery Confirmation，也没有在已演示 Runtime Path 之外建立 Retry、Acknowledgement 或 Exactly-once Semantics。
