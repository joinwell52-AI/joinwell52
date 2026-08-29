---
schema: "research-analysis/v1"
id: "AN-20260829-01"
date: "2026-08-29"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260829-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260829-01-surviving-full-baseline-nested-agent-context-reconstruction.md"
output_contract: "Research Object"
research_object: "Reconstruction Authority Must Remain Separate from Execution Authority"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Reconstruction Authority Must Remain Separate from Execution Authority

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-29 Reading Result for Q-20260829-01. The primary evidence is merged OpenAI Codex change `f9cdc90c2c4d38cd557deb933e592f0032a5ea6e`, which allows an eligible surviving full `WorldState` snapshot to restore previous-turn settings and reference context after a nested-agent fork even when the associated user task message no longer survives, while rejecting bare `TurnContext`, patch-only state and compaction-superseded snapshots. The bounded conclusion concerns reconstruction authority in resumable Agent state. It does not claim that the reconstructed values are current permissions, cryptographically authenticated provenance, or generally valid across distributed runtimes.

本对象只分析 Q-20260829-01 的 2026-08-29 已完成 Reading Result。一手证据是 OpenAI Codex 已合并变更 `f9cdc90c2c4d38cd557deb933e592f0032a5ea6e`：在 Nested-agent Fork 后，即使关联 User Task Message 已不再存活，只要存在符合资格且仍存活的完整 `WorldState` Snapshot，系统仍可恢复 Previous-turn Settings 与 Reference Context；Bare `TurnContext`、Patch-only State 与已被 Compaction 淘汰的 Snapshot 不具备这种资格。本对象的有界结论只讨论可恢复 Agent State 的 Reconstruction Authority，不声称恢复出的值就是当前 Permission，也不声称存在 Cryptographically Authenticated Provenance 或跨分布式 Runtime 的普遍有效性。

```yaml
analysis:
  research_questions:
    - id: "RQ1"
      question: "What evidence is strong enough to reconstruct inherited Agent context after lineage transformation without inventing a missing user turn?"
      question_zh: "在 Agent Lineage 发生变换后，什么证据足以重建继承 Context，同时又不虚构已经不存在的 User Turn？"
    - id: "RQ2"
      question: "Why must authority to reconstruct persisted state remain distinct from authority to execute with that state?"
      question_zh: "为什么“允许重建持久状态”的 Authority 必须与“允许依据该状态执行”的 Authority 分离？"
    - id: "RQ3"
      question: "Which freshness and revocation checks remain necessary after a structurally valid baseline has been restored?"
      question_zh: "结构上有效的 Baseline 被恢复后，还需要哪些 Freshness 与 Revocation Check？"

  research_themes:
    - "recovery authority"
    - "context provenance"
    - "lineage-preserving reconstruction"
    - "call-time authorization"
  subject_kind:
    - "governance-problem"
    - "architecture-mechanism"
    - "failure-mode"
  samples:
    - "OpenAI Codex nested-agent rollout reconstruction"

  research_value:
    failures:
      - "User-message-only reconstruction can discard still-authoritative persisted context after a fork intentionally removes the task message."
      - "Context-fragment reconstruction can revive partial or superseded state if patches or compacted-away snapshots are treated as full baselines."
      - "A recovered context baseline can be mistakenly treated as a permission grant even though the evidence only establishes reconstruction eligibility."
    findings:
      - "The demonstrated implementation separates user-turn identity from context-baseline eligibility and admits only an eligible surviving full WorldState snapshot as the context-only baseline."
      - "Negative tests deny baseline status to bare TurnContext, patch-only state and full snapshots made ineligible by compaction."
      - "Persisted-history and nested root/child/grandchild tests cover restoration across fork and compaction boundaries in the demonstrated runtime."
    mechanisms:
      - "Typed full-snapshot qualification"
      - "Compaction-bounded eligibility"
      - "Separate counts_as_user_turn and has_context_baseline semantics"
      - "First-valid restoration of previous-turn settings and reference context"
    implications:
      - "Governed digital employees should model reconstruction authority as a distinct evidence class from execution/authorization authority."
      - "State that can influence tools, credentials or permissions should be revalidated against current policy after reconstruction rather than inheriting execution authority merely because the snapshot is structurally admissible."

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The merged Codex change allows an active segment to establish a context baseline from an eligible full WorldState snapshot without making that segment count as a user turn."
      claim_zh: "已合并 Codex 变更允许 Active Segment 通过符合资格的完整 WorldState Snapshot 建立 Context Baseline，同时不把该 Segment 改写成 User Turn。"
      source: "research/reading/Q-20260829-01-surviving-full-baseline-nested-agent-context-reconstruction.md"
      strength: "merged maintainer source-level evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Bare TurnContext, patch-only WorldState and a full snapshot outside the surviving compaction boundary are rejected as reconstruction baselines in the added tests."
      claim_zh: "新增测试明确拒绝 Bare TurnContext、Patch-only WorldState 与不再处于存活 Compaction Boundary 内的完整 Snapshot 作为 Reconstruction Baseline。"
      source: "research/reading/Q-20260829-01-surviving-full-baseline-nested-agent-context-reconstruction.md"
      strength: "negative regression-test evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The persisted-history and nested-agent test matrix exercises restoration after serialization, forks and compaction across the demonstrated history modes."
      claim_zh: "Persisted-history 与 Nested-agent Test Matrix 在已展示的 History Mode 中覆盖 Serialization、Fork 与 Compaction 后的恢复。"
      source: "research/reading/Q-20260829-01-surviving-full-baseline-nested-agent-context-reconstruction.md"
      strength: "implementation regression evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "A snapshot can be authoritative for reconstruction while remaining non-authoritative for permission. Reconstruction admissibility answers which persisted state may seed continuity; execution authorization answers whether current policy allows actions influenced by that state."
      claim_zh: "一个 Snapshot 可以对 Reconstruction 具有 Authority，同时对 Permission 不具有 Authority。Reconstruction Admissibility 回答“哪份持久状态可以恢复连续性”，Execution Authorization 回答“当前 Policy 是否允许基于这些状态执行动作”。"
      source: "E1,E2,E3"
      strength: "bounded governance interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "Compaction eligibility is a lineage/freshness boundary inside the demonstrated rollout model, but it is not a substitute for checking whether external resources, credentials or authorization policy have changed since the snapshot was created."
      claim_zh: "Compaction Eligibility 是已展示 Rollout Model 内部的 Lineage/Freshness Boundary，但不能替代对外部 Resource、Credential 或 Authorization Policy 自 Snapshot 创建后是否变化的核验。"
      source: "E1,E2"
      strength: "evidence-boundary interpretation"
      independent: false

  observations:
    - "The fix uses two different identities for two different questions: rollback history still depends on user-turn identity, while context continuity may depend on a qualified state baseline."
    - "The negative cases are as important as the positive case because they define what does not gain reconstruction authority."
    - "A full baseline preserves continuity of state, not truth of every field. A stale or incorrectly created full snapshot can still be structurally admissible."
    - "The architecture therefore benefits from a second gate after reconstruction for state that can influence capabilities or effects."
  observations_zh:
    - "该修复用两类不同 Identity 回答两类不同问题：Rollback History 仍依赖 User-turn Identity，而 Context Continuity 可以依赖符合资格的 State Baseline。"
    - "Negative Case 与 Positive Case 同样重要，因为它们界定了哪些 State 不会获得 Reconstruction Authority。"
    - "完整 Baseline 保证的是 State Continuity，而不是每个字段都真实正确；创建时已经错误或过期的完整 Snapshot 仍可能结构合格。"
    - "因此，对会影响 Capability 或 Effect 的恢复状态，架构上仍需要 Reconstruction 之后的第二道 Gate。"

  comparisons:
    - "User-message-only recovery is too strict for forked histories; fragment-based recovery is too permissive. Qualified full-baseline recovery establishes a middle boundary."
    - "Reconstruction authority resembles provenance-qualified state admission, while call-time authorization is a separate current-policy decision. Combining them would make persistence itself a permission channel."
  comparisons_zh:
    - "仅依赖 User Message 的恢复对 Forked History 过严；基于任意 Fragment 的恢复又过宽；Qualified Full-baseline Recovery 建立了中间边界。"
    - "Reconstruction Authority 更接近基于 Provenance 的 State Admission，而 Call-time Authorization 是独立的当前 Policy Decision。把两者合并会让 Persistence 本身变成 Permission Channel。"

  contradictions:
    - "A surviving full snapshot is stronger than message absence for context continuity, yet it is weaker than a fresh authorization decision for permission-bearing state."
    - "Compaction can invalidate an old baseline inside history semantics, but no evidence here proves revocation of an external credential or policy is automatically reflected in that history boundary."
  contradictions_zh:
    - "对于 Context Continuity，存活的完整 Snapshot 比“没有 Message”更强；但对于 Permission-bearing State，它又弱于 Fresh Authorization Decision。"
    - "Compaction 可以在 History Semantics 内使旧 Baseline 失效，但现有证据没有证明外部 Credential 或 Policy 的 Revocation 会自动反映到这个 History Boundary 中。"

  counterarguments:
    - "A runtime could avoid restoring any context whose originating user message is absent, but that sacrifices valid continuity demonstrated by the nested-fork case."
    - "A runtime could treat every full snapshot as executable authority, but that would turn durable state into an implicit permission grant and ignore later policy/resource changes."
    - "Adding fresh authorization checks to every restored field may be unnecessary; the stronger requirement should apply to fields that can alter capability, identity, credential scope or external effects."
  counterarguments_zh:
    - "Runtime 可以拒绝恢复所有缺少 Originating User Message 的 Context，但这会牺牲 Nested-fork Case 已证明仍有效的 Continuity。"
    - "Runtime 也可以把每个 Full Snapshot 都视作 Executable Authority，但这会让 Durable State 变成隐式 Permission Grant，并忽略之后发生的 Policy/Resource 变化。"
    - "对所有恢复字段都执行 Fresh Authorization Check 可能没有必要；更强 Gate 应优先约束会改变 Capability、Identity、Credential Scope 或 External Effect 的字段。"

  research_judgment: "Resumable Agent runtimes should treat reconstruction authority and execution authority as separate governance decisions. The Codex evidence shows that a surviving, compaction-eligible full WorldState snapshot can legitimately re-establish context continuity even when a user task message no longer survives, and that weaker or superseded state should be rejected. That is a strong reconstruction boundary, not a permission boundary. When restored state can influence capabilities, credentials or effects, the runtime should rebind it to current policy and resource state before execution. The evidence is limited to the demonstrated Codex rollout model and does not prove signed lineage, cross-host consistency or universal authorization safety."
  research_judgment_zh: "可恢复 Agent Runtime 应把 Reconstruction Authority 与 Execution Authority 作为两项独立 Governance Decision。Codex 证据表明：即使 User Task Message 已不再存活，只要完整 WorldState Snapshot 仍在 Compaction Boundary 内且符合资格，就可以合法恢复 Context Continuity；更弱或已被淘汰的 State 应被拒绝。这构成强 Reconstruction Boundary，但不是 Permission Boundary。当恢复状态会影响 Capability、Credential 或 Effect 时，Runtime 应在执行前把它重新绑定到当前 Policy 与 Resource State。该证据仅限已展示的 Codex Rollout Model，不能证明 Signed Lineage、Cross-host Consistency 或通用 Authorization Safety。"

  general_implications:
    - "Persisted-state schemas should distinguish reconstructable context from authority-bearing state."
    - "Recovery gates should validate completeness/lineage first and current authorization second where the state can affect capabilities or effects."
    - "Generation or compaction identity should be retained so resumed workers can reject superseded baselines deterministically."
    - "Audit records should preserve which baseline established restored context without equating that provenance with current human or policy approval."
  general_implications_zh:
    - "Persisted-state Schema 应区分可重建 Context 与携带 Authority 的 State。"
    - "Recovery Gate 应先核验 Completeness/Lineage；当状态会影响 Capability 或 Effect 时，再独立核验 Current Authorization。"
    - "应保留 Generation 或 Compaction Identity，使恢复 Worker 能确定性拒绝 Superseded Baseline。"
    - "Audit Record 应保留是哪份 Baseline 建立了恢复 Context，但不能把这份 Provenance 等同于当前真人或 Policy Approval。"

  limitations:
    - "Evidence is one merged Codex implementation and regression matrix; there is no independent reproduction in this object."
    - "The mechanism does not authenticate the actor who created the snapshot or prove every restored field is semantically correct."
    - "The demonstrated compaction boundary does not prove detection of concurrent corruption, cross-process replay or external-resource revocation."
    - "The conclusion does not claim arbitrary-depth distributed lineage or exactly-once reconstruction."
  limitations_zh:
    - "证据来自一个已合并 Codex 实现与 Regression Matrix；本对象没有 Independent Reproduction。"
    - "该机制不能认证是谁创建了 Snapshot，也不能证明每个恢复字段都语义正确。"
    - "已展示 Compaction Boundary 不能证明能发现 Concurrent Corruption、Cross-process Replay 或 External-resource Revocation。"
    - "本结论不声称 Arbitrary-depth Distributed Lineage 或 Exactly-once Reconstruction。"

  open_questions:
    - "Which restored fields should require fresh authorization before they may influence a tool call or external effect?"
    - "Should an accepted baseline carry a durable generation/freshness identity independent of compaction position?"
    - "How should schema migrations preserve reconstruction provenance without silently upgrading old permission-bearing state?"
    - "What evidence should be emitted when a structurally valid baseline refers to a resource or credential that is now revoked?"
  open_questions_zh:
    - "哪些恢复字段在影响 Tool Call 或 External Effect 前必须重新取得 Fresh Authorization？"
    - "Accepted Baseline 是否应携带独立于 Compaction Position 的 Durable Generation/Freshness Identity？"
    - "Schema Migration 如何保留 Reconstruction Provenance，同时避免静默升级旧的 Permission-bearing State？"
    - "当结构有效的 Baseline 指向已撤销 Resource 或 Credential 时，系统应输出什么 Evidence？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "evidence", "technical-analysis", "governance-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The conclusion is a general resumable-Agent governance boundary and remains complete without mapping it to a first-party project."
    rationale_zh: "该结论属于通用可恢复 Agent Governance Boundary，不需要映射任何自有项目才能成立。"
```

## Bounded judgment / 有界判断

A durable state object may be **good enough to restore context and still not be good enough to authorize action**. The durable design consequence is to keep reconstruction evidence, lineage identity and current execution authorization separately inspectable rather than allowing persistence to collapse those boundaries.

一份 Durable State 可以**足以恢复 Context，却仍不足以授权 Action**。因此应让 Reconstruction Evidence、Lineage Identity 与当前 Execution Authorization 保持可独立检查，而不是让 Persistence 把三者压成一个边界。
