---
schema: "research-analysis/v1"
id: "AN-20260820-02"
date: "2026-08-20"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260820-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260820-02-a2a-history-credential-scrubbing.md"
output_contract: "Research Object"
research_object: "Cross-Agent History as a Policy-Enforcing Projection"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Cross-Agent History as a Policy-Enforcing Projection

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-20 Reading Result for Q-20260820-02. The merged Google ADK implementation and tests establish a bounded security transformation: credential-bearing request function calls are removed from the outbound `RemoteA2aAgent` history projection before rendering can flatten their structured arguments, while the original local session history and non-secret context are preserved. The broader judgment below concerns cross-agent context architecture; it does not establish general A2A confidentiality, local secret-at-rest protection or universal sensitive-data classification.

本对象仅分析 Q-20260820-02 的 2026-08-20 已完成 Reading Result。Google ADK 的已合并实现与测试建立了一个有界安全转换：携带凭据的 Request Function Call 会在 `RemoteA2aAgent` 的 Outbound History Projection 中被删除，而且发生在 Rendering 把结构化参数扁平化之前；原始 Local Session History 与非秘密上下文仍被保留。下述更广泛判断讨论跨 Agent Context Architecture，并不建立一般 A2A Confidentiality、本地 Secret-at-rest Protection 或通用 Sensitive-data Classification。

```yaml
analysis:
  research_question: "Should cross-agent history be replayed as stored, or reconstructed as a policy-governed projection of mixed-trust local state?"
  research_question_zh: "跨 Agent History 应按存储内容原样 Replay，还是应被重建为对 Mixed-trust Local State 的 Policy-governed Projection？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "RemoteA2aAgent reconstructs outbound messages from local session history, and the merged fix removes credential-bearing request function calls from that reconstruction path."
      claim_zh: "RemoteA2aAgent 会从 Local Session History 重建 Outbound Message；已合并修复在该重建路径中删除携带凭据的 Request Function Call。"
      source: "research/reading/Q-20260820-02-a2a-history-credential-scrubbing.md"
      strength: "direct merged-code evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "The scrub runs before other-agent rendering because rendering may inline structured function-call arguments into text, after which credential structure is harder to identify reliably."
      claim_zh: "Scrub 在 Other-agent Rendering 之前执行，因为 Rendering 可能把结构化 Function-call Argument 内联为文本，此后更难可靠识别 Credential Structure。"
      source: "research/reading/Q-20260820-02-a2a-history-credential-scrubbing.md"
      strength: "direct control-flow and regression-test evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The implementation uses both known credential-call names and nested AuthConfig shape while preserving ordinary top-level auth_scheme calls, text siblings and the mock-auth prompt."
      claim_zh: "实现同时使用已知 Credential-call Name 与嵌套 AuthConfig Shape，并保留普通顶层 auth_scheme 调用、Text Sibling 与 Mock-auth Prompt。"
      source: "research/reading/Q-20260820-02-a2a-history-credential-scrubbing.md"
      strength: "direct implementation and test evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "Filtering operates on a deep-copied outbound representation; the original local session event remains intact."
      claim_zh: "过滤作用于 Deep-copied Outbound Representation；原始 Local Session Event 保持不变。"
      source: "research/reading/Q-20260820-02-a2a-history-credential-scrubbing.md"
      strength: "direct implementation evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Session history in a multi-agent runtime should be treated as mixed-trust evidence, not as a universally transferable conversation log."
      claim_zh: "多 Agent Runtime 中的 Session History 应被视为 Mixed-trust Evidence，而不是可无条件转发的 Conversation Log。"
      source: "E1,E2,E3,E4"
      strength: "bounded architecture interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "Cross-agent context transfer should be an explicit policy projection performed while security-relevant structure is still available, with local evidence retention separated from remote disclosure."
      claim_zh: "Cross-agent Context Transfer 应成为显式 Policy Projection，并在 Security-relevant Structure 尚未丢失时完成；Local Evidence Retention 与 Remote Disclosure 应分离。"
      source: "E1,E2,E3,E4"
      strength: "bounded trust-boundary interpretation"
      independent: false

  observations:
    - "The same local event can be legitimate audit/history state and illegitimate remote context at the same time."
    - "Representation order is part of the security boundary: once structured control data becomes ordinary text, semantic filtering becomes weaker and less reliable."
    - "Selective projection preserves useful non-secret context instead of deleting an entire event whenever one sensitive part exists."
    - "Name plus structural-shape detection is a pragmatic policy mechanism, but it remains schema-dependent rather than a universal sensitivity label."
  observations_zh:
    - "同一个 Local Event 可以同时是合法 Audit/History State 与不合法 Remote Context。"
    - "Representation Order 是 Security Boundary 的一部分：结构化 Control Data 一旦变成普通文本，Semantic Filtering 就会更弱、更不可靠。"
    - "Selective Projection 保留有价值的非秘密上下文，而不是一旦出现敏感 Part 就删除整个 Event。"
    - "Name + Structural-shape Detection 是务实 Policy Mechanism，但仍依赖 Schema，而不是通用 Sensitivity Label。"

  comparisons:
    - "Transparent replay maximizes fidelity but assumes every stored event is authorized for the destination trust domain."
    - "Deleting sensitive events from local history reduces disclosure risk but destroys local evidence and can remove non-secret siblings."
    - "Policy projection keeps a richer local record while deriving a destination-specific outbound representation."
    - "Post-render text redaction operates after semantic structure is lost; pre-render structured filtering retains stronger classification evidence."
  comparisons_zh:
    - "Transparent Replay 最大化 Fidelity，却假设所有 Stored Event 都被授权进入目标 Trust Domain。"
    - "从 Local History 删除敏感 Event 可以降低披露风险，但会破坏 Local Evidence，也可能删除非秘密 Sibling。"
    - "Policy Projection 保留更完整的 Local Record，同时派生 Destination-specific Outbound Representation。"
    - "Post-render Text Redaction 发生在 Semantic Structure 丢失之后；Pre-render Structured Filtering 保留更强的 Classification Evidence。"

  counterarguments:
    - "A general sensitivity-label system could be more robust than repeated name/shape inference, but it requires every producer to label data correctly and preserve labels across transformations."
    - "Preserving credential-bearing local events can still be unacceptable in deployments with strict local retention or diagnostic-export requirements."
    - "Projection does not authenticate the remote peer or encrypt the remaining message; disclosure policy and transport trust are separate controls."
  counterarguments_zh:
    - "通用 Sensitivity-label System 可能比反复 Name/Shape Inference 更稳健，但要求所有 Producer 正确标注数据，并在转换中保留 Label。"
    - "在有严格 Local Retention 或 Diagnostic Export 要求的部署中，保留 Credential-bearing Local Event 仍可能不可接受。"
    - "Projection 不会认证 Remote Peer，也不会加密剩余 Message；Disclosure Policy 与 Transport Trust 是独立控制。"

  research_judgment: "Cross-agent history should be modeled as a policy-enforcing projection, not a transparent replay of local session state. A multi-agent runtime may retain richer local evidence while deriving a destination-specific context that removes control-plane material not authorized to cross the trust boundary. Security-sensitive filtering should occur before transformations that erase semantic structure. This pattern reduces the demonstrated credential-forwarding risk but does not by itself provide end-to-end confidentiality, peer trust or local secret protection."
  research_judgment_zh: "Cross-agent History 应被建模为 Policy-enforcing Projection，而不是对 Local Session State 的 Transparent Replay。多 Agent Runtime 可以保留更丰富的 Local Evidence，同时派生 Destination-specific Context，移除未被授权跨越 Trust Boundary 的 Control-plane Material。Security-sensitive Filtering 应发生在会抹去 Semantic Structure 的转换之前。该模式降低了已演示的 Credential-forwarding Risk，但本身不提供端到端 Confidentiality、Peer Trust 或 Local Secret Protection。"

  general_implications:
    - "Agent runtimes should classify session state by disclosure scope, not only by storage ownership."
    - "Outbound handoff pipelines should expose an explicit projection stage before serialization or natural-language rendering."
    - "Local audit history and remote transferable context should have separate schemas or at least separate policy views."
    - "Sensitive control events should carry durable semantic identity so filters do not depend indefinitely on function names and payload heuristics."
    - "Observability should record that material was intentionally withheld from a peer without reproducing the secret itself."
  general_implications_zh:
    - "Agent Runtime 应按 Disclosure Scope 分类 Session State，而不只是按 Storage Ownership 分类。"
    - "Outbound Handoff Pipeline 应在 Serialization 或 Natural-language Rendering 前暴露显式 Projection Stage。"
    - "Local Audit History 与 Remote Transferable Context 应使用独立 Schema，或至少使用独立 Policy View。"
    - "Sensitive Control Event 应具有持久 Semantic Identity，避免 Filter 永久依赖 Function Name 与 Payload Heuristic。"
    - "Observability 应记录某些 Material 被有意阻止发送给 Peer，但不应再次复制 Secret 本身。"

  limitations:
    - "Evidence is scoped to one merged ADK RemoteA2aAgent reconstruction path and its tests."
    - "The demonstrated detector depends on known names and modeled nested AuthConfig shapes."
    - "The source does not establish all outbound adapters, retry paths or future protocol transformations use the same filter."
    - "It does not establish encryption, remote peer authorization, local secret-at-rest protection or universal DLP."
  limitations_zh:
    - "证据仅覆盖一个已合并 ADK RemoteA2aAgent Reconstruction Path 及其测试。"
    - "已演示 Detector 依赖已知 Name 与建模后的 Nested AuthConfig Shape。"
    - "来源没有证明所有 Outbound Adapter、Retry Path 或未来 Protocol Transformation 都使用同一 Filter。"
    - "它没有建立 Encryption、Remote Peer Authorization、本地 Secret-at-rest Protection 或通用 DLP。"

  open_questions:
    - "Can session-event parts carry first-class disclosure labels that survive rendering, tracing and persistence?"
    - "How should a runtime prove that every outbound adapter passes through the same mandatory projection boundary?"
    - "What evidence should audit tooling retain when content is intentionally withheld from a remote agent?"
    - "How should custom credential tools enroll their schemas without expanding a fragile central blacklist?"
  open_questions_zh:
    - "Session-event Part 能否携带 First-class Disclosure Label，并在 Rendering、Tracing 与 Persistence 中持续存在？"
    - "Runtime 如何证明所有 Outbound Adapter 都经过同一 Mandatory Projection Boundary？"
    - "当内容被有意阻止发送给 Remote Agent 时，Audit Tooling 应保留什么证据？"
    - "Custom Credential Tool 应如何登记其 Schema，而不把中央 Blacklist 变得脆弱且不断膨胀？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "context", "evidence", "technical-analysis", "architecture-implications", "governance-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment concerns a general cross-agent context and trust-boundary architecture and remains complete without first-party project mapping."
    rationale_zh: "该判断讨论一般 Cross-agent Context 与 Trust-boundary Architecture，不映射自有项目也能完整成立。"
```

## Bounded judgment / 有界判断

A session log is not automatically a transfer contract. The evidence supports treating outbound cross-agent context as a **derived, destination-governed view** of richer local state, and shows why filtering before representation loss matters. It does not support the stronger claim that this one scrub creates general A2A confidentiality.

Session Log 并不自动等于 Transfer Contract。现有证据支持把 Outbound Cross-agent Context 视为对更丰富 Local State 的 **Derived, Destination-governed View**，并证明为什么必须在 Representation Loss 之前完成过滤；它不支持更强的结论，即一次 Scrub 就建立了一般 A2A Confidentiality。
