---
schema: "research-analysis/v1"
id: "AN-20260830-01"
date: "2026-08-30"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260830-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260830-01-nested-hitl-continuation-identity.md"
output_contract: "Research Object"
research_object: "Continuation Authority Must Remain Separate from Effect Authority"
status: "Superseded"
production_input_authorized: false
publication_authorized: false
---


<!-- Runtime recovery note: superseded on 2026-08-30 by the durably finalized Analysis result, which authorizes research/analysis/Q-20260830-01-continuation-authority-compound-identity.md as the sole Q-20260830-01 Production input. Preserved for audit; not Production-authorized. -->

# Research Object — Continuation Authority Must Remain Separate from Effect Authority

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-30 Reading Result for Q-20260830-01. The primary evidence is merged Google ADK change `6d145180611956b2065704189517fd6a0ff1a063`, which replaces a narrow two-event resume check with explicit `CONTINUE / PAUSE / REPLAY_CALLS` decisions and branch-aware matching for nested HITL responses. The conclusion is bounded to continuation governance. It does not claim human identity authentication, universal replay safety, or exactly-once external effects.

本对象只分析 Q-20260830-01 的 2026-08-30 已完成 Reading Result。一手证据是 Google ADK 已合并变更 `6d145180611956b2065704189517fd6a0ff1a063`：它用显式 `CONTINUE / PAUSE / REPLAY_CALLS` Decision 与 Branch-aware Matching 替代了狭窄的 Two-event Resume Check，以处理 Nested HITL Response。本结论只讨论 Continuation Governance，不声称已经认证真人身份、普遍保证 Replay 安全，也不声称 External Effect Exactly-once。

```yaml
analysis:
  research_questions:
    - id: "RQ1"
      question: "What durable identity is sufficient to decide whether a nested resumable flow should pause, replay or continue?"
      question_zh: "什么持久 Identity 足以决定 Nested Resumable Flow 应 Pause、Replay 还是 Continue？"
    - id: "RQ2"
      question: "Why is authority to continue or replay a workflow weaker than authority to repeat an external side effect?"
      question_zh: "为什么允许 Workflow Continue/Replay 的 Authority 弱于允许重复 External Side Effect 的 Authority？"

  research_value:
    failures:
      - "A bounded recent-event window can lose the actual outstanding call after intervening events and make resume state incorrect."
      - "Loose identifier matching can attach a nested human response to the wrong call frame."
      - "Treating a replay decision as proof that no prior external effect occurred can duplicate non-idempotent effects."
    findings:
      - "The implementation makes continuation state explicit as CONTINUE, PAUSE or REPLAY_CALLS instead of inferring it from only the previous two events."
      - "Nested HITL answers are bound using exact call identities and the sub-branch opened by the call; unrelated branches and substring ids are rejected in regression tests."
      - "Parallel calls, long-running calls and replay-event identity receive explicit negative/positive regression coverage."
    mechanisms:
      - "Occurrence-level call identity"
      - "Branch-scoped continuation lineage"
      - "Historical unresolved-call scan"
      - "Explicit replay target"
    implications:
      - "A governed digital employee should persist continuation identity separately from human authorization and external-effect evidence."
      - "A runtime may have enough evidence to reconstruct the intended control-flow frame while still lacking enough evidence to safely repeat a non-idempotent tool effect."

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The merged ADK change introduces explicit CONTINUE, PAUSE and REPLAY_CALLS resume decisions and replaces the documented two-event limitation."
      claim_zh: "已合并 ADK 变更引入显式 CONTINUE、PAUSE 与 REPLAY_CALLS Resume Decision，并替代原先有明确局限的 Two-event Check。"
      source: "research/reading/Q-20260830-01-nested-hitl-continuation-identity.md"
      strength: "merged maintainer source and regression-test evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Sub-branch HITL responses are matched to the call that opened the branch using whole run ids; unrelated branches and substring ids are negative-tested."
      claim_zh: "Sub-branch HITL Response 通过完整 Run ID 绑定到创建该 Branch 的 Call；无关 Branch 与 Substring ID 均有 Negative Test。"
      source: "research/reading/Q-20260830-01-nested-hitl-continuation-identity.md"
      strength: "implementation regression evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Continuation authority is a control-flow decision, not effect authority. Correctly identifying the frame to replay does not establish that a previous ambiguous attempt produced no external effect."
      claim_zh: "Continuation Authority 是 Control-flow Decision，而不是 Effect Authority。即使正确识别了要 Replay 的 Frame，也不能证明此前一次 Ambiguous Attempt 没有产生 External Effect。"
      source: "E1,E2"
      strength: "bounded governance interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "Branch-bound human-response continuity does not authenticate the responder; authorization evidence must remain independently verifiable when the resumed action is permission-sensitive."
      claim_zh: "Branch-bound Human-response Continuity 不等于 Responder Authentication；当恢复动作涉及 Permission 时，Authorization Evidence 必须保持独立可核验。"
      source: "E2"
      strength: "evidence-boundary interpretation"
      independent: false

  contradictions:
    - "Replay can be the correct control-flow action precisely when execution evidence is incomplete; therefore replay correctness and effect certainty move on different evidence axes."
    - "A human answer can be correctly associated with a nested branch while the identity or authority of that human remains unproven by the branch relationship itself."
  contradictions_zh:
    - "恰恰在 Execution Evidence 不完整时，Replay 可能是正确的 Control-flow Action；因此 Replay Correctness 与 Effect Certainty 位于不同 Evidence Axis。"
    - "Human Answer 可以正确关联到 Nested Branch，但 Branch Relationship 本身仍不能证明该 Human 的 Identity 或 Authority。"

  counterarguments:
    - "A system could forbid all replay of ambiguous calls, but that would prevent legitimate continuation for calls known from event history to have never completed."
    - "A system could assume every replayed tool is idempotent, but the ADK evidence does not establish that property for arbitrary tools."
  counterarguments_zh:
    - "系统可以禁止所有 Ambiguous Call Replay，但这会阻止那些从 Event History 可知从未完成的 Call 正常继续。"
    - "系统也可以假设所有被 Replay 的 Tool 都是 Idempotent，但 ADK 证据没有为任意 Tool 证明这一性质。"

  research_judgment: "Resumable agent runtimes should make continuation authority a first-class, occurrence-scoped decision while keeping it separate from effect authority. The ADK change demonstrates that durable call/branch identity is necessary to decide pause, replay or continue across nested HITL and intervening events. But a correct REPLAY_CALLS decision only establishes what control flow is owed; it does not prove that an earlier external effect is absent or that the human response is currently authorized. A governed runtime should therefore couple continuation identity with separate responder/authorization evidence and, for non-idempotent tools, explicit effect-state or idempotency/compensation evidence before replay can become execution authority."
  research_judgment_zh: "可恢复 Agent Runtime 应把 Continuation Authority 建模为 First-class、Occurrence-scoped Decision，同时与 Effect Authority 分离。ADK 变更证明：在 Nested HITL 与 Intervening Event 场景中，需要持久 Call/Branch Identity 才能正确决定 Pause、Replay 或 Continue。但正确的 REPLAY_CALLS Decision 只说明 Control Flow 还欠什么，并不能证明此前 External Effect 不存在，也不能证明 Human Response 当前具备授权。受治理 Runtime 因此应把 Continuation Identity 与独立的 Responder/Authorization Evidence 绑定；对于 Non-idempotent Tool，还要在 Replay 获得 Execution Authority 前具备显式 Effect-state、Idempotency 或 Compensation Evidence。"

  general_implications:
    - "Persist resumable call occurrence and branch lineage explicitly; do not reconstruct them from recent-message position alone."
    - "Treat resume/replay eligibility and external-effect retry eligibility as separate gates."
    - "Bind human responses to both continuation occurrence and independently governed principal/authorization evidence when permissions are involved."
    - "Record ambiguous-effect state so a recovered worker can reconcile rather than blindly replay."
  general_implications_zh:
    - "显式持久化 Resumable Call Occurrence 与 Branch Lineage，不要只依赖最近消息位置重建。"
    - "把 Resume/Replay Eligibility 与 External-effect Retry Eligibility 设计成两道独立 Gate。"
    - "涉及权限时，让 Human Response 同时绑定 Continuation Occurrence 与独立治理的 Principal/Authorization Evidence。"
    - "记录 Ambiguous-effect State，使恢复 Worker 能 Reconcile，而不是 Blind Replay。"

  limitations:
    - "Evidence is one merged ADK implementation and its tests, not independent cross-runtime replication."
    - "The change does not prove exactly-once tool effects, authenticate the human responder, or establish distributed branch ownership across hosts."
    - "The conclusion is strongest for resume-state governance and weaker for arbitrary external-effect semantics."
  limitations_zh:
    - "证据来自一个已合并 ADK 实现及其测试，不是跨 Runtime 独立复现。"
    - "该变更不证明 Tool Effect Exactly-once，不认证 Human Responder，也不建立跨 Host 的 Distributed Branch Ownership。"
    - "结论对 Resume-state Governance 证据最强，对任意 External-effect Semantics 更弱。"
```

## Production boundary / 生产边界

Production may explain the separation between continuation identity and effect authority, but must not state that ADK provides general exactly-once HITL execution or authenticated human approval. The example is evidence of a resume mechanism and regression coverage, not universal safety proof.
