---
schema: "research-analysis/v1"
id: "AN-20260823-02"
date: "2026-08-23"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260823-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260823-02-durable-thread-source-provenance.md"
output_contract: "Research Object"
research_object: "Creation Provenance Should Survive Continuation Without Becoming Authorization"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Creation Provenance Should Survive Continuation Without Becoming Authorization

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-23 Reading Result for Q-20260823-02. The primary evidence is the merged OpenAI Codex change that persists a thread-source classification at creation, permits a fork to carry its own source classification while preserving parent lineage, and deliberately does not send a new source when resuming an existing thread through the TypeScript API. The conclusions below concern durable provenance semantics for long-lived agent work. They do not establish authenticated actor identity, access control, authorization or an immutable audit ledger.

本对象仅分析 Q-20260823-02 的 2026-08-23 已完成 Reading Result。一手证据来自 OpenAI Codex 已合并变更：Thread 在创建时持久化 Source Classification；Fork 可以拥有自己的 Source Classification，同时保留 Parent Lineage；TypeScript API 在 Resume 既有 Thread 时明确不会发送新的 Source。下述结论只讨论长期 Agent Work 的持久 Provenance Semantics，并不建立经过认证的 Actor Identity、Access Control、Authorization 或不可变 Audit Ledger。

```yaml
analysis:
  research_question: "For durable agent work that can be created, forked and resumed, which provenance properties should remain stable across continuation, and which lifecycle transitions are allowed to establish a new local provenance identity?"
  research_question_zh: "对于可创建、Fork、Resume 的持久 Agent Work，哪些 Provenance Property 应在 Continuation 中保持稳定，哪些 Lifecycle Transition 才允许建立新的本地 Provenance Identity？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "Merged Codex code introduces persisted thread-source classifications for User, Subagent, Feature(String) and MemoryConsolidation, with missing source interpreted as User for backward compatibility."
      claim_zh: "Codex 已合并代码引入持久 Thread-source Classification：User、Subagent、Feature(String) 与 MemoryConsolidation；为兼容旧数据，缺失 Source 会被解释为 User。"
      source: "research/reading/Q-20260823-02-durable-thread-source-provenance.md"
      strength: "direct merged-code evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "New thread creation can persist an explicit source classification, while a fork can create a derived thread with its own local source classification and still retain the original parent relationship."
      claim_zh: "新 Thread 创建时可以持久化显式 Source Classification；Fork 可以创建具有自身本地 Source Classification 的派生 Thread，同时继续保留原始 Parent Relationship。"
      source: "research/reading/Q-20260823-02-durable-thread-source-provenance.md"
      strength: "direct merged-code and test evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The TypeScript resume path does not forward a new threadSource when a threadId already exists, preventing ordinary resume from rewriting creation-time source classification."
      claim_zh: "当 Thread ID 已存在时，TypeScript Resume Path 不会转发新的 `threadSource`，从而避免普通 Resume 改写创建时的 Source Classification。"
      source: "research/reading/Q-20260823-02-durable-thread-source-provenance.md"
      strength: "direct implementation evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "Arbitrary non-reserved source strings become Feature classifications, and the source field is application provenance metadata rather than a cryptographically authenticated identity."
      claim_zh: "任意非保留 Source String 会成为 Feature Classification；该 Source Field 属于应用 Provenance Metadata，而不是经过密码学认证的 Identity。"
      source: "research/reading/Q-20260823-02-durable-thread-source-provenance.md"
      strength: "direct parsing/representation evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Creation provenance should be continuation-stable: resume re-enters an existing durable work identity and therefore should not silently relabel how that work originated."
      claim_zh: "Creation Provenance 应在 Continuation 中保持稳定：Resume 是重新进入既有 Durable Work Identity，因此不应静默重标该 Work 最初如何产生。"
      source: "E1,E3"
      strength: "bounded lifecycle interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "Fork is different from resume because it creates a new durable object: a derived object can legitimately establish its own local source classification while parent lineage separately preserves derivation provenance."
      claim_zh: "Fork 与 Resume 不同，因为 Fork 会创建新的 Durable Object：派生对象可以合法建立自己的本地 Source Classification，同时由 Parent Lineage 独立保留 Derivation Provenance。"
      source: "E2"
      strength: "bounded architectural interpretation"
      independent: false
    - id: "I3"
      identity: "our-interpretation"
      claim: "Provenance classification should remain informational unless independently bound to trusted principal or policy evidence; a durable label must not acquire authorization power merely because it survives lifecycle transitions."
      claim_zh: "除非 Provenance Classification 被独立绑定到可信 Principal 或 Policy Evidence，否则应保持 Information Semantics；一个持久 Label 不能仅因跨 Lifecycle Transition 存活就自动获得 Authorization Power。"
      source: "E4"
      strength: "bounded governance interpretation"
      independent: false

  observations:
    - "The design separates two provenance axes that are often collapsed: local creation source and derivation lineage."
    - "Resume stability prevents mutable client defaults from retroactively changing the apparent origin of already-created work."
    - "Fork permits local reclassification without destroying parent lineage, which supports derived roles while retaining historical relationship."
    - "Backward-compatible defaulting of missing source to User is practical but means absence of old metadata is interpreted rather than independently evidenced."
  observations_zh:
    - "该设计分离了经常被混淆的两个 Provenance Axis：Local Creation Source 与 Derivation Lineage。"
    - "Resume Stability 可以防止可变 Client Default 追溯性改变已经创建 Work 的表面 Origin。"
    - "Fork 允许 Local Reclassification，同时不销毁 Parent Lineage，因此既支持派生 Role，也保留历史 Relationship。"
    - "把缺失 Source 向后兼容地解释为 User 很实用，但意味着旧数据的 Metadata Absence 是一种解释，而不是独立 Evidence。"

  comparisons:
    - "A mutable 'current source' field rewritten on every resume is easy to implement but makes provenance depend on the latest caller rather than the durable object's creation event."
    - "Encoding all provenance into one label cannot express both 'this object was forked from X' and 'this derived object's local role is Y' without losing one dimension."
    - "Separating immutable or continuation-stable creation provenance from explicit derivation lineage supports more precise lifecycle reasoning, provided neither is treated as authorization without another trust binding."
  comparisons_zh:
    - "每次 Resume 都改写一个可变 `current source` Field 虽然容易实现，却会让 Provenance 取决于最新 Caller，而不是 Durable Object 的 Creation Event。"
    - "把所有 Provenance 压成一个 Label，无法同时表达‘这个对象 Fork 自 X’与‘该派生对象的本地 Role 是 Y’，必然损失一个维度。"
    - "把不可变或 Continuation-stable Creation Provenance 与显式 Derivation Lineage 分离，可以形成更精确的 Lifecycle Reasoning；前提是没有额外 Trust Binding 时，两者都不能被当成 Authorization。"

  counterarguments:
    - "Some systems may intentionally support administrative provenance correction, so continuation-stable should not mean absolutely immutable under every governed repair path."
    - "A coarse source taxonomy may be sufficient for product telemetry even if it cannot support security decisions."
    - "Defaulting missing historical metadata to User can simplify compatibility but may be too strong for security-sensitive analytics that need an explicit Unknown state."
  counterarguments_zh:
    - "某些系统可能有意支持管理员 Provenance Correction，因此 Continuation-stable 不应被理解成任何 Governed Repair Path 下都绝对不可变。"
    - "对于产品 Telemetry，粗粒度 Source Taxonomy 可能已经足够，即使它不能支持 Security Decision。"
    - "把历史缺失 Metadata 默认成 User 可以简化兼容，但对于安全敏感 Analytics，也许应显式使用 Unknown，而不是作更强解释。"

  research_judgment: "Durable agent provenance should distinguish continuation from derivation. Creation-time provenance should remain stable through ordinary resume because resume continues the same durable work identity; fork may establish a new local provenance classification because it creates a new object, while parent lineage separately records where that object came from. This gives long-lived agent work a more replayable provenance model, but provenance labels remain descriptive metadata unless independently bound to authenticated principals or policy authority."
  research_judgment_zh: "持久 Agent Provenance 应区分 Continuation 与 Derivation。Creation-time Provenance 应在普通 Resume 中保持稳定，因为 Resume 延续的是同一个 Durable Work Identity；Fork 因创建新对象，可以建立新的 Local Provenance Classification，同时由 Parent Lineage 独立记录该对象从何而来。这样可以让长期 Agent Work 获得更可重放的 Provenance Model，但 Provenance Label 仍只是描述性 Metadata，除非另行绑定经过认证的 Principal 或 Policy Authority。"

  general_implications:
    - "Long-lived work objects should define which metadata is creation-scoped, continuation-stable, derivation-scoped or administratively repairable."
    - "Resume APIs should avoid silently rewriting durable provenance from caller-local defaults."
    - "Forked work should carry both local classification and parent lineage when those answer different governance questions."
    - "Provenance fields used for security decisions need an explicit trust binding beyond application-controlled classification strings."
    - "Historical compatibility defaults should be distinguishable from directly observed provenance when audit precision matters."
  general_implications_zh:
    - "长期 Work Object 应明确哪些 Metadata 属于 Creation-scoped、Continuation-stable、Derivation-scoped 或 Administratively Repairable。"
    - "Resume API 应避免使用 Caller-local Default 静默改写 Durable Provenance。"
    - "当 Local Classification 与 Parent Lineage 回答不同 Governance Question 时，Forked Work 应同时携带两者。"
    - "如果 Provenance Field 要参与 Security Decision，就需要超越 Application-controlled Classification String 的显式 Trust Binding。"
    - "当 Audit Precision 很重要时，Historical Compatibility Default 应能与直接观测到的 Provenance 区分。"

  limitations:
    - "Evidence is one merged Codex implementation and tests, not an independent provenance benchmark across agent platforms."
    - "The no-overwrite observation is specific to the inspected TypeScript resume path and does not prove every lower-level mutation route forbids source changes."
    - "Feature classification accepts application-provided strings and therefore does not authenticate the feature, actor or principal."
    - "The mechanism is not an immutable audit log and does not by itself define authorization, retention or tamper resistance."
  limitations_zh:
    - "证据来自一个 Codex 已合并实现及测试，并非跨 Agent Platform 的独立 Provenance Benchmark。"
    - "不改写的观察限定于已检查的 TypeScript Resume Path，不能证明所有 Lower-level Mutation Route 都禁止 Source Change。"
    - "Feature Classification 接受应用提供的 String，因此不会认证 Feature、Actor 或 Principal。"
    - "该机制不是不可变 Audit Log，也不能单独定义 Authorization、Retention 或 Tamper Resistance。"

  open_questions:
    - "Should historical rows with no source be represented as Unknown rather than User when provenance is used analytically or operationally?"
    - "What governed repair mechanism, if any, should be allowed to correct an incorrect creation-time source without erasing the correction history?"
    - "How should source classification, parent lineage and authenticated actor identity be joined when a security-sensitive decision needs all three?"
    - "Should arbitrary Feature strings be registered or namespaced to prevent semantic collisions across producers?"
  open_questions_zh:
    - "当 Provenance 被用于 Analytics 或 Operational Decision 时，历史无 Source 的 Row 是否应表示为 Unknown，而不是 User？"
    - "如果 Creation-time Source 确实错误，应允许什么 Governed Repair Mechanism 在不抹除 Correction History 的情况下修正它？"
    - "当 Security-sensitive Decision 同时需要 Source Classification、Parent Lineage 与 Authenticated Actor Identity 时，应如何连接这三类 Evidence？"
    - "任意 Feature String 是否应注册或 Namespace 化，以避免不同 Producer 之间的 Semantic Collision？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "evidence", "technical-analysis", "architecture-implications", "governance-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment is a general durable-work provenance pattern for agent platforms and long-lived digital work; it stands without first-party project mapping."
    rationale_zh: "该判断属于 Agent Platform 与长期数字工作的一般 Durable-work Provenance Pattern，不需要强行映射自有项目。"
```

## Bounded judgment / 有界判断

The central distinction is **provenance continuity is not authorization continuity**. A durable source label can make creation and continuation easier to reason about, and a separate parent lineage can make derivation explicit. Neither fact proves that the actor represented by the label is authenticated or authorized. Systems gain auditability by keeping those dimensions separate rather than turning a convenient provenance field into a security principal.

核心区别是：**Provenance Continuity 不等于 Authorization Continuity**。持久 Source Label 可以让 Creation 与 Continuation 更易推理，独立 Parent Lineage 可以让 Derivation 更明确；但两者都不能证明 Label 所代表的 Actor 已经过认证或获得授权。系统通过保持这些维度分离来提高可审计性，而不是把方便的 Provenance Field 变成 Security Principal。
