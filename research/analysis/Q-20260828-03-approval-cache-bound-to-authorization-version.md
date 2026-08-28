---
schema: "research-analysis/v1"
id: "AN-20260828-03"
date: "2026-08-28"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260828-03"
column: "open-source-engineering"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260828-03-cached-approval-current-authorization-binding.md"
output_contract: "Research Object"
research_object: "Cached Approval Evidence Must Be Revalidated Against Current Authorization Identity"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Cached Approval Evidence Must Be Revalidated Against Current Authorization Identity

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-28 Reading Result for Q-20260828-03. The primary evidence is merged OpenAI Codex Guardian v2 change `035295b46ee4a5962d0e01a66a888d5bf5da4de4`, which binds cached low-risk classification evidence to local and optional root authorization versions and revalidates that identity immediately before fast approval. The bounded conclusion concerns revocation-aware cache admissibility for approval evidence. It does not claim classifier correctness, complete authorization-state coverage, signed durable audit proof or distributed authorization consistency.

本对象只分析 Q-20260828-03 的 2026-08-28 已完成 Reading Result。一手证据是 OpenAI Codex Guardian v2 已合并变更 `035295b46ee4a5962d0e01a66a888d5bf5da4de4`：Cached Low-risk Classification Evidence 绑定 Local 与可选 Root Authorization Version，并在 Fast Approval 前立即重新核验该 Identity。本对象的有界结论仅讨论 Approval Evidence Cache 的 Revocation-aware Admissibility；不声称 Classifier 正确、Authorization State 覆盖完整、存在 Signed Durable Audit Proof 或分布式 Authorization Consistency。

```yaml
analysis:
  research_questions:
    - id: "RQ1"
      question: "Why are recency and action identity insufficient cache keys for reusable approval evidence?"
      question_zh: "为什么仅用 Recency 与 Action Identity 作为可复用 Approval Evidence 的 Cache Key 不够？"
    - id: "RQ2"
      question: "What should be revalidated at evidence-consumption time to make cached approval responsive to revocation?"
      question_zh: "在消费 Cached Approval Evidence 时，应重新核验什么，才能让缓存对 Revocation 有响应？"
    - id: "RQ3"
      question: "How should systems bound claims when an authorization-version tuple represents only selected authority inputs?"
      question_zh: "当 Authorization-version Tuple 只表示部分 Authority Input 时，系统应如何限制结论边界？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The merged Codex change defines an authorization version from history-rewrite generation, genuine user-message count and successful host-produced user-input response count, with optional root authorization identity for worker threads."
      claim_zh: "已合并 Codex 变更用 History-rewrite Generation、真实 User-message Count 与成功 Host-produced User-input Response Count 定义 Authorization Version，并为 Worker Thread 关联可选 Root Authorization Identity。"
      source: "research/reading/Q-20260828-03-cached-approval-current-authorization-binding.md"
      strength: "merged maintainer source-level evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "A successful cached classifier score records its local/root authorization identity, and the fast-approval path recomputes current authorization before use; mismatch marks the score stale with authorization_changed and defers approval."
      claim_zh: "成功 Cached Classifier Score 会记录其 Local/Root Authorization Identity；Fast-approval Path 在使用前重新计算当前 Authorization，Mismatch 会把 Score 标记为 Stale，以 authorization_changed 原因延后 Approval。"
      source: "research/reading/Q-20260828-03-cached-approval-current-authorization-binding.md"
      strength: "implementation and regression-test evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "Regression coverage includes authorization changing while classification is in flight, preventing the late low-risk result from being consumed as current fast-approval evidence."
      claim_zh: "Regression Coverage 包含 Classification In-flight 时 Authorization 发生变化的场景，阻止迟到的 Low-risk Result 被当成当前 Fast-approval Evidence 消费。"
      source: "research/reading/Q-20260828-03-cached-approval-current-authorization-binding.md"
      strength: "concurrent revocation regression evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Reusable approval evidence should be keyed not only by the action and time but by the authorization identity under which the evidence was produced, and that identity should be rechecked at consumption time."
      claim_zh: "可复用 Approval Evidence 的 Key 不应只有 Action 与 Time，还应包含生成这份 Evidence 时的 Authorization Identity，并在消费时重新核验。"
      source: "E1,E2,E3"
      strength: "bounded cache-governance interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "Authorization-version equality is an admissibility proof only for the authority inputs encoded by that version; it must not be presented as proof that every authorization-relevant fact is unchanged."
      claim_zh: "Authorization-version Equality 只对被该 Version 编码的 Authority Input 构成 Admissibility Proof；不能被描述成所有 Authorization-relevant Fact 都未变化的证明。"
      source: "E1,E2"
      strength: "evidence-boundary interpretation"
      independent: false

  observations:
    - "TTL recency and tool-call proximity can both be satisfied while authority has been revoked; authorization identity closes a different dimension of cache staleness."
    - "The critical safety check is use-time revalidation, not merely score-time tagging, because authorization can change while classification is in flight."
    - "The mechanism is selectively invalidating: events outside the represented authorization version need not flush the cache, preserving reuse without treating all event activity as revocation."
    - "The authorization tuple is structural and bounded, so future authority inputs may require version expansion or another independent validity component."
  observations_zh:
    - "TTL Recency 与 Tool-call Proximity 即使都满足，Authority 仍可能已撤销；Authorization Identity 关闭的是另一维 Cache Staleness。"
    - "关键 Safety Check 是 Use-time Revalidation，而不仅是 Score-time Tagging，因为 Classification In-flight 时 Authorization 可能发生变化。"
    - "该机制是 Selective Invalidation：不改变已表示 Authorization Version 的 Event 不必清空 Cache，从而在不把所有事件活动都当成 Revocation 的情况下保留复用。"
    - "Authorization Tuple 是结构化且有界的；未来新增 Authority Input 时可能必须扩展 Version 或增加另一独立 Validity Component。"

  comparisons:
    - "TTL-bound approval asks whether evidence is recent; authorization-bound approval asks whether the governing authority context is still the same. Safe reuse may require both questions."
    - "Global cache flushing on every event is conservative but expensive. Versioned authority binding provides narrower invalidation when the represented authority changes."
    - "A cached classifier score is evidence for a decision path, not an enduring permission grant; revalidation preserves that distinction."
  comparisons_zh:
    - "TTL-bound Approval 询问 Evidence 是否足够新；Authorization-bound Approval 询问 Governing Authority Context 是否仍相同。安全复用可能需要同时回答两个问题。"
    - "每个 Event 都全局清 Cache 很保守但昂贵；Versioned Authority Binding 可以只在已表示 Authority 变化时精准失效。"
    - "Cached Classifier Score 是 Decision Path 的 Evidence，不是永久 Permission Grant；Revalidation 保留了这个区别。"

  counterarguments:
    - "A sufficiently conservative system could avoid caching approval evidence entirely. That removes stale-cache risk but also removes the latency/cost benefit the mechanism is designed to preserve."
    - "Version equality can create false confidence if an authorization-relevant input is omitted from the version tuple; completeness of the represented authority set is therefore a governance responsibility."
    - "Use-time revalidation can still race with authorization changing immediately after the check; stronger systems may need atomic admission/commit boundaries or effect-time checks depending on risk."
  counterarguments_zh:
    - "足够保守的系统可以完全不 Cache Approval Evidence；这样能消除 Stale-cache Risk，但也失去该机制希望保留的 Latency/Cost Benefit。"
    - "如果某个 Authorization-relevant Input 没被纳入 Version Tuple，Version Equality 可能制造错误信心；因此已表示 Authority Set 的 Completeness 本身是 Governance Responsibility。"
    - "Use-time Revalidation 后 Authorization 仍可能立即变化；高风险系统可能还需要 Atomic Admission/Commit Boundary 或 Effect-time Check。"

  research_judgment: "Cached approval evidence should be treated as evidence produced under a specific authorization identity, not as a reusable permission token whose validity is established by recency alone. The Guardian v2 change demonstrates a bounded revocation-aware pattern: bind a low-risk score to local/root authorization versions, recompute current authorization before fast approval, and fail back to review when the identity differs—even when revocation races an in-flight classifier. The safety claim must remain limited to the authority inputs encoded in that version; equality cannot prove that every external policy, tool configuration or authorization fact is unchanged."
  research_judgment_zh: "Cached Approval Evidence 应被视为“在特定 Authorization Identity 下生成的 Evidence”，而不是只凭 Recency 就长期有效的 Permission Token。Guardian v2 变更展示了一种有界、Revocation-aware 的模式：把 Low-risk Score 绑定到 Local/Root Authorization Version，在 Fast Approval 前重新计算当前 Authorization，Identity 不一致时回退到 Review——包括 Revocation 与 In-flight Classifier 竞争的情况。但 Safety Claim 必须限制在该 Version 实际编码的 Authority Input 内；Equality 不能证明所有 External Policy、Tool Configuration 或 Authorization Fact 都未变化。"

  general_implications:
    - "Agent tool-approval caches should carry an explicit authority-version identity in addition to action/risk/time metadata."
    - "Approval evidence should be revalidated at the point where it is converted into execution authority, not only when it is created."
    - "Revocation-sensitive concurrency tests should include authority changes while classifiers, reviewers or policy checks are in flight."
    - "Authorization-version schemas should be reviewed whenever new policy sources or authority-bearing inputs are introduced."
  general_implications_zh:
    - "Agent Tool-approval Cache 除了 Action/Risk/Time Metadata，还应携带显式 Authority-version Identity。"
    - "Approval Evidence 应在它被转换成 Execution Authority 的消费点重新核验，而不仅在创建时核验。"
    - "Revocation-sensitive Concurrency Test 应覆盖 Classifier、Reviewer 或 Policy Check In-flight 时 Authority 变化。"
    - "每当引入新的 Policy Source 或携带 Authority 的 Input 时，都应重新审查 Authorization-version Schema。"

  limitations:
    - "Evidence is one merged Codex implementation and its tests; there is no independent benchmark in this object."
    - "The demonstrated version tuple does not encode every possible authorization input."
    - "The mechanism does not prove classifier correctness, downstream tool correctness or distributed principal binding."
    - "Long-term signing, immutable audit retention and cross-process replay of the cached evidence are separate concerns."
  limitations_zh:
    - "证据来自一个已合并 Codex 实现及其测试；本对象没有独立 Benchmark。"
    - "已展示 Version Tuple 没有编码所有可能的 Authorization Input。"
    - "该机制不能证明 Classifier Correctness、Downstream Tool Correctness 或分布式 Principal Binding。"
    - "长期 Signing、Immutable Audit Retention 与跨 Process Replay Cached Evidence 是独立问题。"

  open_questions:
    - "Which non-conversation policy/configuration identities should join the authorization version as Guardian's authority model expands?"
    - "Should use-time revalidation and execution admission be atomic for higher-risk tool effects?"
    - "How should authorization-bound cached evidence survive resume, fork or cross-process recovery without losing provenance?"
    - "Would a durable signed authority receipt be useful when cached approval evidence must be externally audited or replayed?"
  open_questions_zh:
    - "随着 Guardian Authority Model 扩展，哪些非 Conversation Policy/Configuration Identity 应加入 Authorization Version？"
    - "对更高风险 Tool Effect，Use-time Revalidation 与 Execution Admission 是否应具备 Atomic Boundary？"
    - "Authorization-bound Cached Evidence 在 Resume、Fork 或 Cross-process Recovery 中如何保留 Provenance？"
    - "当 Cached Approval Evidence 需要外部 Audit 或 Replay 时，Durable Signed Authority Receipt 是否必要？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence", "engineering-analysis", "concurrency", "operational-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The conclusion is a general revocation-aware approval-cache engineering pattern and does not require a first-party project mapping."
    rationale_zh: "该结论属于通用 Revocation-aware Approval-cache Engineering Pattern，不需要映射自有项目才能成立。"
```

## Bounded judgment / 有界判断

The central distinction is **cached evidence is reusable only while the authority identity it evaluated remains current**. Recency alone cannot establish that. Use-time authorization revalidation closes the demonstrated stale-approval race, but only for the authority dimensions represented by the version tuple.

核心区别是：**Cached Evidence 只有在它曾经评估的 Authority Identity 仍然有效时才可复用**。仅 Recency 无法证明这一点。Use-time Authorization Revalidation 能关闭已展示的 Stale-approval Race，但只能覆盖 Version Tuple 实际表示的 Authority Dimension。
