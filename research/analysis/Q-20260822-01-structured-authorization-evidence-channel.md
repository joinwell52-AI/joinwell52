---
schema: "research-analysis/v1"
id: "AN-20260822-01"
date: "2026-08-22"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260822-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260822-01-root-user-authorization-provenance.md"
output_contract: "Research Object"
research_object: "Authorization Provenance Must Be a Structured Evidence Channel, Not a Forwarded Claim"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Authorization Provenance Must Be a Structured Evidence Channel, Not a Forwarded Claim

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-22 Reading Result for Q-20260822-01. The merged Codex evidence is scoped to MultiAgent V2 Guardian review: bounded root-thread history is extracted from the actual root conversation, structured roles are preserved, and only root-user messages are designated as authorization evidence. The conclusions below are bounded governance interpretations for digital employees and agent review planes. They do not establish end-to-end authorization safety, cryptographic principal identity, or a durable authorization ledger.

本对象仅分析 Q-20260822-01 的 2026-08-22 已完成 Reading Result。Codex 已合并证据限定于 MultiAgent V2 Guardian Review：系统从真实 Root Conversation 提取有界 Root-thread History，保留结构化 Role，并且只有 Root-user Message 被指定为 Authorization Evidence。下述结论属于数字员工与 Agent Review Plane 的有界治理解释，并不建立端到端 Authorization Safety、Cryptographic Principal Identity 或持久 Authorization Ledger。

```yaml
analysis:
  research_question: "When a delegated digital employee reaches a sensitive review point, what evidence should be allowed to carry user authorization across agent boundaries without letting forwarded or assistant-authored text impersonate authority?"
  research_question_zh: "当被委派的数字员工到达敏感 Review Point 时，什么 Evidence 才应被允许跨 Agent Boundary 携带 User Authorization，同时避免转发内容或 Assistant-authored Text 冒充 Authority？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "Merged Codex code resolves the actual root thread and extracts bounded structured root conversation evidence for non-root MultiAgent V2 Guardian review."
      claim_zh: "Codex 已合并代码会解析真实 Root Thread，并为非 Root 的 MultiAgent V2 Guardian Review 提取有界、结构化的 Root Conversation Evidence。"
      source: "research/reading/Q-20260822-01-root-user-authorization-provenance.md"
      strength: "direct merged-code evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "The extracted evidence preserves User and Assistant roles, and only structured root-user messages are designated as authorization evidence; assistant messages remain untrusted context."
      claim_zh: "提取出的 Evidence 保留 User 与 Assistant Role；只有结构化 Root-user Message 被指定为 Authorization Evidence，Assistant Message 保持为不可信 Context。"
      source: "research/reading/Q-20260822-01-root-user-authorization-provenance.md"
      strength: "merged-code and prompt-policy evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "Summaries, synthetic user_action items, review artifacts, forwarded agent claims and assistant role-spoof text are prevented from becoming root-user authorization merely by wording."
      claim_zh: "Summary、Synthetic user_action、Review Artifact、Forwarded Agent Claim 与 Assistant Role-spoof Text 不会仅凭措辞变成 Root-user Authorization。"
      source: "research/reading/Q-20260822-01-root-user-authorization-provenance.md"
      strength: "merged regression-test evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "The authorization evidence channel is bounded to the latest eligible root messages and per-message Guardian token limits, and it is injected into Guardian review rather than the ordinary worker model context."
      claim_zh: "Authorization Evidence Channel 受最新 Eligible Root Message 数量与单条 Guardian Token Limit 约束，并被注入 Guardian Review，而不是普通 Worker Model Context。"
      source: "research/reading/Q-20260822-01-root-user-authorization-provenance.md"
      strength: "direct implementation evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Authorization provenance should be carried on a structured evidence plane bound to the authoritative conversation source and role, not inferred from natural-language claims forwarded through the work plane."
      claim_zh: "Authorization Provenance 应通过绑定权威 Conversation Source 与 Role 的结构化 Evidence Plane 携带，而不能从 Work Plane 中被转发的 Natural-language Claim 推断。"
      source: "E1,E2,E3"
      strength: "bounded governance interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "A review-time evidence window is an admission aid, not a durable authorization state machine: approvals and revocations that can age out require separate persistent identity, scope and freshness semantics."
      claim_zh: "Review-time Evidence Window 是 Admission Aid，而不是持久 Authorization State Machine；可能被时间窗口淘汰的 Approval 与 Revocation 仍需要独立的持久 Identity、Scope 与 Freshness Semantics。"
      source: "E4"
      strength: "bounded architectural interpretation"
      independent: false

  observations:
    - "The design separates the review plane from the worker context plane: evidence used to decide authority need not be copied into the delegated worker's normal reasoning context."
    - "Role-preserving extraction is stronger than string inspection because authority derives from structured origin rather than text that merely claims a role."
    - "Filtering synthetic and summarized artifacts reduces provenance collapse, but bounded retention creates a different failure mode: relevant older authorization or revocation can disappear from the review window."
    - "The mechanism answers who said what in a bounded source history; it does not authenticate a human principal cryptographically or define reusable capability tokens."
  observations_zh:
    - "该设计分离 Review Plane 与 Worker Context Plane：用于判断 Authority 的 Evidence 不必复制进被委派 Worker 的普通 Reasoning Context。"
    - "Role-preserving Extraction 比 String Inspection 更强，因为 Authority 来自结构化 Origin，而不是来自仅仅声称某个 Role 的文本。"
    - "过滤 Synthetic 与 Summarized Artifact 可以减少 Provenance Collapse，但 Bounded Retention 带来另一种失效模式：更早的 Authorization 或 Revocation 可能退出 Review Window。"
    - "该机制解决的是有界 Source History 中谁说了什么；它没有对真人 Principal 做密码学认证，也没有定义可复用 Capability Token。"

  comparisons:
    - "Forwarding 'the user approved this' is operationally convenient but collapses provenance because the receiver cannot distinguish a genuine root-user statement from an agent assertion."
    - "Copying the entire root transcript into every worker preserves more history but unnecessarily expands context exposure and still leaves authority interpretation to the worker."
    - "A structured, review-only evidence channel preserves source role while minimizing context propagation, but durable authorization still needs a separate state representation when long-lived approvals or revocations matter."
  comparisons_zh:
    - "转发‘用户已经批准’虽然操作方便，却会压平 Provenance，因为接收者无法区分 Genuine Root-user Statement 与 Agent Assertion。"
    - "把完整 Root Transcript 复制给每个 Worker 虽然保留更多 History，却不必要地扩大 Context Exposure，并仍把 Authority Interpretation 留给 Worker。"
    - "结构化、仅用于 Review 的 Evidence Channel 可以在减少 Context Propagation 的同时保留 Source Role；但当长期 Approval 或 Revocation 很重要时，仍需要独立的持久 Authorization State Representation。"

  counterarguments:
    - "Natural-language authorization can be sufficient for low-risk workflows, so a structured evidence plane may be unnecessary overhead outside sensitive admission points."
    - "A bounded history window can deliberately reduce stale instructions; preserving every historical authorization indefinitely can itself create replay and revocation risk."
    - "Developer-approved policy messages remain another legitimate authority source, so root-user evidence is not the only possible authorization plane."
  counterarguments_zh:
    - "对于低风险 Workflow，Natural-language Authorization 可能已经足够，因此在非敏感 Admission Point 上引入结构化 Evidence Plane 可能是额外开销。"
    - "有界 History Window 可以有意减少 Stale Instruction；无限期保留所有历史 Authorization 本身也会产生 Replay 与 Revocation Risk。"
    - "Developer-approved Policy Message 仍可能是另一种合法 Authority Source，因此 Root-user Evidence 并不是唯一可能的 Authorization Plane。"

  research_judgment: "For delegated digital employees, authorization provenance should be a structured review-plane evidence channel whose source and role are preserved independently of the work-plane narrative. Forwarded claims, summaries and assistant-authored text may remain useful context but should not acquire user authority by wording alone. When authorization must survive beyond a bounded review window, systems need a separate durable authorization state that binds principal identity, scope, freshness and revocation; the demonstrated Guardian mechanism is evidence for admission, not an end-to-end authorization guarantee."
  research_judgment_zh: "对于被委派的数字员工，Authorization Provenance 应成为结构化 Review-plane Evidence Channel，其 Source 与 Role 必须独立于 Work-plane Narrative 被保留。Forwarded Claim、Summary 与 Assistant-authored Text 可以继续作为有用 Context，但不能仅凭措辞获得 User Authority。当 Authorization 需要超越有界 Review Window 持续存在时，系统还需要独立的持久 Authorization State，用于绑定 Principal Identity、Scope、Freshness 与 Revocation；当前 Guardian Mechanism 是 Admission Evidence，而不是端到端 Authorization Guarantee。"

  general_implications:
    - "Review and approval systems should bind authority to structured source identity before language-model interpretation."
    - "Agent-to-agent messages should carry provenance as metadata or typed evidence rather than re-expressing authority as prose."
    - "Authorization evidence and ordinary reasoning context can have different retention, exposure and trust policies."
    - "Long-lived digital employees need explicit revocation/freshness semantics when review-time evidence is windowed or truncated."
    - "Audit records should distinguish 'evidence observed by reviewer' from 'authorization state granted to executor'."
  general_implications_zh:
    - "Review 与 Approval System 应在 Language-model Interpretation 之前，把 Authority 绑定到结构化 Source Identity。"
    - "Agent-to-agent Message 应通过 Metadata 或 Typed Evidence 携带 Provenance，而不是把 Authority 重新表达成普通 Prose。"
    - "Authorization Evidence 与普通 Reasoning Context 可以具有不同的 Retention、Exposure 与 Trust Policy。"
    - "长期运行的数字员工在 Review-time Evidence 被窗口化或截断时，需要显式 Revocation/Freshness Semantics。"
    - "Audit Record 应区分‘Reviewer 观察到的 Evidence’与‘授予 Executor 的 Authorization State’。"

  limitations:
    - "Evidence is one merged Codex implementation and its tests, not an independent cross-system authorization evaluation."
    - "The demonstrated scope is MultiAgent V2 Guardian review, not every Codex approval path or arbitrary subagent operation."
    - "The evidence window is bounded to recent eligible messages and token limits, so absence from the window is not proof that authorization never existed."
    - "Structured role provenance is not cryptographic principal authentication and does not by itself prevent compromised upstream history."
  limitations_zh:
    - "证据来自一个 Codex 已合并实现及其测试，并非跨系统独立 Authorization Evaluation。"
    - "已演示范围是 MultiAgent V2 Guardian Review，而不是 Codex 的所有 Approval Path 或任意 Subagent Operation。"
    - "Evidence Window 受最近 Eligible Message 与 Token Limit 约束，因此某条 Authorization 不在窗口中并不能证明它从未存在。"
    - "结构化 Role Provenance 不是 Cryptographic Principal Authentication，也不能单独阻止上游 History 被攻陷。"

  open_questions:
    - "What durable representation should preserve approval and revocation when the natural-language evidence window rotates?"
    - "How should principal authentication be connected to structured root-user role evidence without making the model the authority verifier?"
    - "Which review paths beyond Guardian need the same provenance channel, and which should use stronger capability-style authorization?"
    - "How should conflicting root-user messages be ordered, scoped and expired?"
  open_questions_zh:
    - "当 Natural-language Evidence Window 轮转时，应使用什么持久表示来保留 Approval 与 Revocation？"
    - "如何把 Principal Authentication 与结构化 Root-user Role Evidence 连接起来，同时避免让 Model 自己成为 Authority Verifier？"
    - "除 Guardian 外，哪些 Review Path 需要同样的 Provenance Channel，哪些场景应使用更强的 Capability-style Authorization？"
    - "相互冲突的 Root-user Message 应如何排序、限定 Scope 与失效？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence", "technical-analysis", "governance-implications", "engineering-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment is a general authorization-provenance pattern for delegated agent systems and digital employees; no first-party project is required to establish it."
    rationale_zh: "该判断属于被委派 Agent System 与数字员工的一般 Authorization-provenance Pattern，不需要引入自有项目才能成立。"
```

## Bounded judgment / 有界判断

The central distinction is **authorization evidence is not the same thing as authorization state**. Structured root-user provenance can make a review decision safer than forwarded prose, while a separate durable control is still required for long-lived, scoped and revocable authority. The source demonstrates the former boundary; it does not prove the latter has been solved end to end.

核心区别是：**Authorization Evidence 不等于 Authorization State**。结构化 Root-user Provenance 可以让 Review Decision 比转发 Prose 更安全，但长期、限定 Scope、可撤销的 Authority 仍需要独立持久控制。来源证明了前一个边界，并没有证明后一个问题已经端到端解决。
