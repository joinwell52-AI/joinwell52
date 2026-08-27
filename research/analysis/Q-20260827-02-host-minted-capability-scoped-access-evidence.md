---
schema: "research-analysis/v1"
id: "AN-20260827-02"
date: "2026-08-27"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260827-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260827-02-host-owned-capability-scoped-entitlement-context.md"
output_contract: "Research Object"
research_object: "Authority-Bearing Context Should Be Host-Minted and Capability-Scoped"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Authority-Bearing Context Should Be Host-Minted and Capability-Scoped

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-27 Reading Result for Q-20260827-02. The primary evidence is merged OpenAI Codex maintainer change `ae357e7250402af7c3bbede18a46cc565a7670d4`, which adds host-produced verified account access context at a narrowly qualified local plugin MCP edge. The conclusion concerns ownership, minting and propagation of authority-bearing context. It does not claim that the metadata is a complete authorization system or that every receiver enforces it correctly.

本对象仅分析 Q-20260827-02 的 2026-08-27 已完成 Reading Result。一手证据是 OpenAI Codex 已合并维护者变更 `ae357e7250402af7c3bbede18a46cc565a7670d4`：它在一个严格限定的 Local Plugin MCP 边界上注入由 Host 生成的 Verified Account Access Context。本对象的结论只讨论携带 Authority 的 Context 应由谁拥有、生成和传播；不声称该 Metadata 构成完整 Authorization System，也不声称所有接收端都会正确执行它。

```yaml
analysis:
  research_question: "How should an agent platform carry identity- or account-derived authority evidence to tools without allowing the requesting capability to forge, widen or stale that authority?"
  research_question_zh: "Agent Platform 应如何把基于身份或账户的 Authority Evidence 传给 Tool，同时避免请求方伪造、扩大或继续使用已经过期的 Authority？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The merged Codex implementation removes caller-supplied openai/entitlementContext before generating verified or unknown host-owned context."
      claim_zh: "已合并 Codex 实现会先移除调用方提供的 openai/entitlementContext，再由 Host 生成 Verified 或 Unknown Context。"
      source: "research/reading/Q-20260827-02-host-owned-capability-scoped-entitlement-context.md"
      strength: "direct merged implementation evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Verified context is injected only when a conjunction of explicit entitlement request, installed/selected plugin provenance, local default environment, stdio origin, read-only annotation and absent/empty arguments holds."
      claim_zh: "只有显式 Entitlement Request、Installed/Selected Plugin Provenance、Local Default Environment、Stdio Origin、Read-only Annotation、无参数或空参数全部成立时，Verified Context 才会被注入。"
      source: "research/reading/Q-20260827-02-host-owned-capability-scoped-entitlement-context.md"
      strength: "direct eligibility-predicate evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The lookup is bounded by a 2.5-second timeout, no redirects and a 1 MiB response cap, and account identity continuity is checked before and after the request."
      claim_zh: "Lookup 受 2.5 秒 Timeout、禁止 Redirect 与 1 MiB Response Cap 约束，并在请求前后检查 Account Identity Continuity。"
      source: "research/reading/Q-20260827-02-host-owned-capability-scoped-entitlement-context.md"
      strength: "direct implementation evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "Unsupported authentication, request failure, malformed or inconsistent provider data and account switching collapse to host-generated unknown with empty grants rather than preserving caller-provided authority."
      claim_zh: "不支持的认证、请求失败、Provider 数据异常或不一致、Account Switching 都会降级为 Host 生成的 unknown + 空 Grants，而不是保留调用方提供的 Authority。"
      source: "research/reading/Q-20260827-02-host-owned-capability-scoped-entitlement-context.md"
      strength: "direct fail-closed behavior evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Authority-bearing context should be minted by the component that can verify the governing identity and policy state, not accepted from the capability asking to exercise that authority."
      claim_zh: "携带 Authority 的 Context 应由能够核验 Governing Identity 与 Policy State 的组件生成，而不能由正在请求使用该 Authority 的 Capability 自行提供。"
      source: "E1,E3,E4"
      strength: "bounded authority-boundary interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "Propagation of verified authority evidence should be capability-scoped through explicit conjunctive predicates and should fail closed when identity continuity or verification cannot be established."
      claim_zh: "Verified Authority Evidence 的传播应通过显式合取 Predicate 按 Capability 范围收缩；一旦无法建立 Identity Continuity 或 Verification，就应 Fail Closed。"
      source: "E2,E3,E4"
      strength: "bounded propagation-governance interpretation"
      independent: false

  observations:
    - "The design separates the requester from the authority issuer: caller metadata is discarded before host verification."
    - "Eligibility is not represented by one permissive flag; multiple provenance, transport, mutability and argument conditions must all hold."
    - "Identity is treated as time-sensitive state: the implementation checks that the account did not change across the verification window."
    - "Unknown is a deliberately weaker projection than any positive grant, but its security value depends on receivers treating it as non-authorizing."
  observations_zh:
    - "该设计把 Requester 与 Authority Issuer 分开：Caller Metadata 在 Host Verification 前就被丢弃。"
    - "Eligibility 不是一个宽松的单一 Flag，而是要求 Provenance、Transport、Mutability、Argument 等多个条件同时成立。"
    - "Identity 被视为随时间变化的 State：实现会检查 Verification Window 前后 Account 是否发生变化。"
    - "Unknown 是有意比 Positive Grant 更弱的 Projection，但其安全价值依赖接收端把 Unknown 解释为 Non-authorizing。"

  comparisons:
    - "Caller-provided entitlement metadata is self-asserted context; host-minted context is evidence derived from an authority-bearing identity channel."
    - "Generic propagation attaches identity context to broad call surfaces; capability-scoped propagation narrows both where the evidence can appear and which operational shape is eligible to receive it."
    - "A static account check at session creation is weaker than verifying identity continuity around the actual authority lookup when accounts may change during runtime."
  comparisons_zh:
    - "Caller-provided Entitlement Metadata 属于 Self-asserted Context；Host-minted Context 则是从携带 Authority 的 Identity Channel 推导出的 Evidence。"
    - "Generic Propagation 会把 Identity Context 附加到宽泛 Call Surface；Capability-scoped Propagation 同时收缩 Evidence 可出现的位置和可接收它的操作形态。"
    - "如果 Runtime 中 Account 可能变化，那么 Session 创建时的一次静态检查弱于围绕真实 Authority Lookup 做 Identity Continuity Verification。"

  counterarguments:
    - "Host ownership does not make the resulting metadata a complete authorization decision; downstream policy still determines whether and how the evidence is used."
    - "A highly restrictive conjunction can reduce functionality or create false negatives if legitimate use cases require remote transports, arguments or mutable operations. Such expansion should require its own explicit contract rather than silent predicate weakening."
    - "Failing to unknown is safe only if receivers cannot interpret unknown as permissive or fall back to a weaker unverified authority source."
    - "The selected mechanism does not prove cryptographic freshness or independent correctness of the provider-side verified-access policy."
  counterarguments_zh:
    - "Host Ownership 并不会自动把 Metadata 变成完整 Authorization Decision；下游 Policy 仍决定这些 Evidence 如何被使用。"
    - "过于严格的合取条件可能降低功能，或让需要 Remote Transport、Arguments、Mutable Operation 的合法场景出现 False Negative；扩张范围应建立新的显式合同，而不是静默放宽 Predicate。"
    - "降级为 unknown 只有在接收端不会把 unknown 当作 Permissive，也不会退回更弱的未验证 Authority Source 时才安全。"
    - "所选机制不能证明 Provider-side Verified-access Policy 具有 Cryptographic Freshness 或独立正确性。"

  research_judgment: "Authority-bearing access context should be minted by the host that can verify the governing account identity, should replace rather than trust caller copies, and should be injected only across an explicitly qualified capability edge. Verification should be time-bounded, identity-continuity-aware and fail closed to a non-authorizing state when evidence cannot be established. The demonstrated Codex mechanism is therefore best understood as a narrow capability-scoped authority-evidence broker, not a complete authorization system."
  research_judgment_zh: "携带 Authority 的 Access Context 应由能够核验 Governing Account Identity 的 Host 生成，应替换而不是信任 Caller Copy，并且只应跨越显式合格的 Capability Edge 注入。Verification 应有时间边界、感知 Identity Continuity，并在无法建立证据时 Fail Closed 到 Non-authorizing State。因此，所展示的 Codex 机制更适合被理解为一个狭窄的 Capability-scoped Authority-evidence Broker，而不是完整 Authorization System。"

  general_implications:
    - "Agent platforms should separate authority issuance from capability invocation: the component requesting an action should not be the source of authority evidence for that action."
    - "Authority context propagation should declare provenance, scope and eligibility predicates so later audit can explain why a specific call received privileged context."
    - "Identity continuity checks should surround remote verification when user, workspace or organization identity can change during a long-running session."
    - "Verification failure should produce an explicit low-authority state rather than reuse stale or caller-supplied positive context."
    - "Receivers need an explicit contract that unknown or empty grants are non-authorizing; fail-closed production on one side is insufficient if consumption semantics are permissive."
  general_implications_zh:
    - "Agent Platform 应分离 Authority Issuance 与 Capability Invocation：请求执行动作的组件不应同时成为该动作 Authority Evidence 的来源。"
    - "Authority Context Propagation 应声明 Provenance、Scope 与 Eligibility Predicate，使后续 Audit 能解释某一次 Call 为什么获得 Privileged Context。"
    - "当 User、Workspace 或 Organization Identity 可能在长运行 Session 中变化时，Remote Verification 前后应进行 Identity Continuity Check。"
    - "Verification Failure 应产生显式 Low-authority State，而不是复用 Stale 或 Caller-supplied Positive Context。"
    - "接收端需要明确合同保证 unknown 或 Empty Grants 为 Non-authorizing；如果消费语义是宽松的，仅生产端 Fail Closed 仍然不够。"

  limitations:
    - "Evidence is a merged maintainer implementation and its tests, not independent validation of the full end-to-end authorization chain."
    - "The demonstrated mechanism covers one Codex local plugin MCP entitlement path and should not be generalized to all transports or entitlement types without new evidence."
    - "The evidence does not establish downstream enforcement correctness or provider-side policy correctness."
    - "No claim is made that the context is a credential, a capability token, a cryptographic proof or a complete authorization decision."
  limitations_zh:
    - "证据来自已合并维护者实现及其测试，并非对完整端到端 Authorization Chain 的独立验证。"
    - "已展示机制覆盖一个 Codex Local Plugin MCP Entitlement Path；没有新证据时不应推广到所有 Transport 或 Entitlement Type。"
    - "证据不能建立 Downstream Enforcement Correctness 或 Provider-side Policy Correctness。"
    - "本对象不声称该 Context 是 Credential、Capability Token、Cryptographic Proof 或完整 Authorization Decision。"

  open_questions:
    - "Which downstream components consume the verified context, and do all of them treat unknown as non-authorizing?"
    - "How are organization-policy changes and revocation reflected when account identity remains stable?"
    - "Should future entitlement types share one broker contract or define independent eligibility and evidence semantics?"
    - "What audit record should persist the exact predicates and identity version that justified each injected authority context?"
  open_questions_zh:
    - "哪些下游组件消费 Verified Context？它们是否都把 unknown 视为 Non-authorizing？"
    - "当 Account Identity 保持稳定时，Organization Policy Change 与 Revocation 如何反映？"
    - "未来 Entitlement Type 应共享一个 Broker Contract，还是分别定义独立 Eligibility 与 Evidence Semantics？"
    - "什么 Audit Record 应持久记录每一次 Authority Context 注入所依据的精确 Predicate 与 Identity Version？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "evidence", "technical-analysis", "governance-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The conclusion is an independent authority-provenance architecture pattern and does not depend on a first-party project mapping."
    rationale_zh: "该结论属于独立的 Authority-provenance Architecture Pattern，不依赖自有项目映射。"
```

## Bounded judgment / 有界判断

The central distinction is **authority evidence should be issued by the authority-owning host, not asserted by the capability that wants to use it**. Scope then matters as much as provenance: even verified context should cross only an explicitly qualified capability edge. The selected Codex change demonstrates this bounded broker pattern, while leaving downstream enforcement and complete authorization semantics outside the proven scope.

核心区别是：**Authority Evidence 应由拥有 Authority 的 Host 签发，而不能由希望使用该 Authority 的 Capability 自我声明**。随后 Scope 与 Provenance 同等重要：即便是 Verified Context，也只能跨越显式合格的 Capability Edge。所选 Codex 变更证明了这种有界 Broker Pattern，但 Downstream Enforcement 与完整 Authorization Semantics 仍在已证明范围之外。
