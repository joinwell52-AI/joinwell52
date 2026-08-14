---
schema: "research-analysis/v1"
id: "AN-20260814-03"
date: "2026-08-14"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260814-03"
column: "open-source-engineering"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260814-03-request-level-cancellation-rollback-boundary.md"
output_contract: "Research Object"
research_object: "Cancellation Rollback Must Separate Local State from External Effects"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Cancellation Rollback Must Separate Local State from External Effects

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-14 Reading Result for Q-20260814-03. Merged Gemini CLI code and its regression test are treated as implementation facts. Claims about transactionality, compensation or retry semantics beyond the local request state are explicitly bounded as interpretation or open questions.

本对象仅分析 Q-20260814-03 的 2026-08-14 已完成 Reading Result。Gemini CLI 合并代码及其回归测试只作为实现事实；超出本地 Request State 的 Transactionality、Compensation 或 Retry 语义均明确限制为分析解释或开放问题。

```yaml
analysis:
  research_question: "What recovery guarantees does prompt-scoped cancellation rollback actually provide, and what additional mechanisms are required before an aborted agent request can be safely retried after external tool side effects?"
  research_question_zh: "Prompt-scoped Cancellation Rollback 实际提供了哪些恢复保证？当 Agent Request 已产生外部 Tool Side Effect 后，还需要什么机制才能安全 Retry？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The selected Gemini CLI change records a prompt-scoped original history length and token-count baseline keyed by prompt_id across same-ID continuation calls."
      claim_zh: "所选 Gemini CLI 变更会按 prompt_id 记录 Prompt-scoped 的原始 History Length 与 Token-count Baseline，并让同一 ID 的 Continuation Call 共享该边界。"
      source: "research/reading/Q-20260814-03-request-level-cancellation-rollback-boundary.md"
      strength: "direct merged-code evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "On recognized cancellation, local agent history is rolled back to the state before the logical prompt request began, recorded messages are synchronized from the surviving history and the prior token count is restored."
      claim_zh: "识别到 Cancellation 后，本地 Agent History 会回滚到整个 Logical Prompt Request 开始前，Recording 从保留后的 History 重新同步，同时恢复先前 Token Count。"
      source: "research/reading/Q-20260814-03-request-level-cancellation-rollback-boundary.md"
      strength: "direct merged-code and regression-test evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The regression test demonstrates rollback across an initial successful exchange and a later aborted function-response continuation that shares the same prompt ID."
      claim_zh: "回归测试证明：同一 Prompt ID 下，先完成初始成功 Exchange，再在 Function-response Continuation 中 Abort，最终 History 可以整体回到原 Prompt 之前。"
      source: "research/reading/Q-20260814-03-request-level-cancellation-rollback-boundary.md"
      strength: "direct regression-test evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "The selected change modifies only local chat/request state and its test; it does not roll back already-executed tool, filesystem, network, database or external API effects."
      claim_zh: "所选变更只修改本地 Chat/Request State 及其测试；它不会回滚已经发生的 Tool、Filesystem、Network、Database 或外部 API Side Effect。"
      source: "research/reading/Q-20260814-03-request-level-cancellation-rollback-boundary.md"
      strength: "direct change-scope boundary"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Cancellation recovery should distinguish at least three layers: logical-request state rollback, external-effect reconciliation, and retry admission. Restoring one layer cannot be used as evidence that the others are safe."
      claim_zh: "Cancellation Recovery 至少应区分三层：Logical-request State Rollback、External-effect Reconciliation 与 Retry Admission。恢复其中一层，不能作为其他层已经安全的证据。"
      source: "E1,E2,E3,E4"
      strength: "bounded engineering interpretation"
      independent: false

  observations:
    - "prompt_id acts as a logical request boundary for local rollback, not as a proven idempotency key for downstream systems."
    - "The mechanism repairs internal representational consistency: agent history, chat recording and token accounting are returned to one request baseline."
    - "A successful external tool action can disappear from user-visible chat history after cancellation while still remaining true in the external system."
  observations_zh:
    - "prompt_id 在本地 Rollback 中充当 Logical Request Boundary，而不是已经证明可用于下游系统的 Idempotency Key。"
    - "该机制修复的是内部表示一致性：Agent History、Chat Recording 与 Token Accounting 被恢复到同一个 Request Baseline。"
    - "Cancellation 后，一个已经成功发生的 External Tool Action 可能从用户可见 Chat History 中消失，但在外部系统中仍然真实存在。"

  comparisons:
    - "Per-call rollback can leave earlier turns from one aborted logical request visible; prompt-scoped rollback gives a wider and more coherent local request boundary."
    - "A database transaction can undo mutations under one transactional authority; chat-history rollback has no authority over independent tools and providers."
    - "Compensation can repair some external effects after cancellation, while idempotency can prevent duplicate effects on retry; neither behavior is supplied by the selected prompt_id mechanism."
  comparisons_zh:
    - "Per-call Rollback 可能保留同一 Aborted Logical Request 的早期 Turn；Prompt-scoped Rollback 提供了更完整的本地 Request Boundary。"
    - "Database Transaction 可以在统一事务权威下撤销 Mutation；Chat-history Rollback 对独立 Tool 与 Provider 没有这种权威。"
    - "Compensation 可以在 Cancellation 后修复部分外部效果，Idempotency 可以降低 Retry 重复副作用；所选 prompt_id 机制并未提供这两种行为。"

  counterarguments:
    - "Many cancelled requests perform only read-only or side-effect-free work, in which case local rollback may be sufficient for practical recovery."
    - "Not every external operation is compensatable, so a universal rollback abstraction could create a false sense of atomicity."
    - "Immutable audit trails may intentionally preserve events that user-visible history removes; consistency does not require every sink to erase the same record."
  counterarguments_zh:
    - "许多被取消的 Request 只执行 Read-only 或无副作用工作，此时本地 Rollback 在实践中可能已经足够。"
    - "并不是每个 External Operation 都可 Compensation，因此通用 Rollback 抽象反而可能制造虚假的 Atomicity 感。"
    - "Immutable Audit Trail 可能有意保留用户可见 History 已删除的事件；一致性并不要求所有 Sink 都删除同一记录。"

  research_judgment: "Prompt-scoped rollback is a meaningful request-state integrity mechanism, but it should not be described as transactional recovery for an agent workflow. Once a request can invoke external tools, cancellation creates two independent facts: local conversational state may be restored while external effects may already exist. Safe retry therefore requires a separate effect ledger or equivalent evidence, plus per-operation idempotency, compensation or explicit human reconciliation before the request is admitted again."
  research_judgment_zh: "Prompt-scoped Rollback 是有价值的 Request-state Integrity Mechanism，但不应被描述为 Agent Workflow 的 Transactional Recovery。一旦 Request 可以调用外部 Tool，Cancellation 会产生两个独立事实：本地 Conversation State 可以恢复，但外部 Side Effect 可能已经存在。因此，安全 Retry 还需要独立的 Effect Ledger 或等价证据，并针对每个 Operation 提供 Idempotency、Compensation 或显式人工 Reconciliation，然后才能重新准入该 Request。"

  general_implications:
    - "Agent runtimes should distinguish rollback of internal state from reversal or reconciliation of external effects in their contracts and UI."
    - "A logical request identity should be durable and traceable, but downstream idempotency identities may need narrower per-operation scopes."
    - "Cancellation should produce explicit terminal evidence describing which operations were admitted, which completed and which effects are unknown rather than silently presenting a clean local history as full recovery."
    - "Retry admission should inspect effect evidence before reissuing non-idempotent operations."
    - "Streaming consumers may require an invalidation event because previously observed partial output cannot be physically retracted by local history rollback."
  general_implications_zh:
    - "Agent Runtime 应在 Contract 与 UI 中明确区分 Internal-state Rollback 与 External-effect Reversal/Reconciliation。"
    - "Logical Request Identity 应可持久、可追踪，但下游 Idempotency Identity 可能需要更细的 Per-operation Scope。"
    - "Cancellation 应产生显式 Terminal Evidence，记录哪些 Operation 已准入、哪些已完成、哪些 Effect 状态未知，而不是把干净的本地 History 呈现成完整恢复。"
    - "Retry Admission 应在重新发出 Non-idempotent Operation 前检查 Effect Evidence。"
    - "Streaming Consumer 可能需要 Invalidation Event，因为已经观察到的 Partial Output 无法通过本地 History Rollback 物理撤回。"

  limitations:
    - "The evidence covers one merged Gemini CLI prompt-scoped cancellation implementation and one principal regression scenario."
    - "The prompt rollback baseline is in-memory and the selected change does not establish recovery of that boundary after process restart."
    - "Non-cancellation failures retain different rollback behavior; the judgment must not be generalized to all error classes."
    - "No external effect ledger, compensation protocol, durable idempotency contract or distributed transaction is demonstrated by the source."
  limitations_zh:
    - "证据覆盖一个已合并的 Gemini CLI Prompt-scoped Cancellation 实现及一个主要回归场景。"
    - "Prompt Rollback Baseline 位于内存中，所选变更没有建立 Process Restart 后恢复该边界的能力。"
    - "Non-cancellation Failure 使用不同 Rollback Behavior，因此本判断不能泛化到所有 Error Class。"
    - "来源没有展示 External Effect Ledger、Compensation Protocol、Durable Idempotency Contract 或 Distributed Transaction。"

  open_questions:
    - "What durable effect record should connect a logical prompt request to each externally admitted operation?"
    - "Which operations should use idempotency keys, which require compensation, and which must stop for human reconciliation after cancellation?"
    - "Should partial streamed output carry a durable invalidation event when the originating request is later rolled back?"
    - "How should request-scope rollback survive process restart without reintroducing stale or overly broad prompt boundaries?"
  open_questions_zh:
    - "怎样的 Durable Effect Record 应把 Logical Prompt Request 与每个已准入 External Operation 连接起来？"
    - "哪些 Operation 应使用 Idempotency Key，哪些需要 Compensation，哪些在 Cancellation 后必须停下来由人工 Reconciliation？"
    - "当原始 Request 后来被 Rollback 时，已经 Streaming 的 Partial Output 是否应带有持久 Invalidation Event？"
    - "Request-scope Rollback 应如何跨 Process Restart 存续，同时避免重新引入过期或过宽的 Prompt Boundary？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence", "technical-analysis", "engineering-implications", "operational-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment is a general engineering boundary for agent runtimes and tool-using systems."
    rationale_zh: "该判断是面向 Agent Runtime 与 Tool-using System 的通用工程边界。"
```

## Bounded judgment / 有界判断

A clean local history after cancellation proves **local request-state restoration**, not that the world outside the runtime has been restored. Tool-using agents therefore need separate evidence for **request state, external effects and retry authority**. Conflating these layers turns a useful rollback mechanism into a misleading transaction claim.

Cancellation 后干净的本地 History 只能证明**本地 Request State 已恢复**，不能证明 Runtime 外部世界已经恢复。Tool-using Agent 因此必须分别记录**请求状态、外部副作用与 Retry Authority**。把这些层混在一起，会把一个有价值的 Rollback Mechanism 错误包装成事务保证。
