---
schema: "research-analysis/v1"
id: "AN-20260827-03"
date: "2026-08-27"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260827-03"
column: "open-source-engineering"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260827-03-trusted-root-skill-provenance-authorization-evidence.md"
output_contract: "Research Object"
research_object: "Authorization Evidence Needs Host-Verified Invocation Provenance"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Authorization Evidence Needs Host-Verified Invocation Provenance

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-27 Reading Result for Q-20260827-03. The primary evidence is merged OpenAI Codex maintainer change `b68acc4d4b56fdfa1d5b6a2c36102c66876e0c46`, which allows Guardian v2 to use an invoked user-owned skill as bounded approval evidence only after host-controlled provenance checks. The conclusion concerns provenance qualification for authorization evidence. It does not treat trusted location as proof that skill contents are safe, unchanged, semantically correct or universally authorizing.

本对象仅分析 Q-20260827-03 的 2026-08-27 已完成 Reading Result。一手证据是 OpenAI Codex 已合并维护者变更 `b68acc4d4b56fdfa1d5b6a2c36102c66876e0c46`：Guardian v2 只有在完成 Host-controlled Provenance Check 后，才会把实际调用的 User-owned Skill 作为有界 Approval Evidence。本对象的结论只讨论 Authorization Evidence 的 Provenance Qualification；不会把 Trusted Location 解释成 Skill Content 安全、未变化、语义正确或具有通用授权力的证明。

```yaml
analysis:
  research_question: "When can an invoked skill or extension legitimately contribute authorization evidence without allowing repository-controlled text or path-like data to impersonate user authority?"
  research_question_zh: "在不允许 Repository-controlled Text 或 Path-like Data 冒充用户 Authority 的前提下，什么时候一个被调用的 Skill 或 Extension 才能合法贡献 Authorization Evidence？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The merged Guardian v2 implementation records an invoked skill only after the host resolves its skill resource through configured trusted user roots."
      claim_zh: "已合并 Guardian v2 实现只有在 Host 通过配置的 Trusted User Root 解析 Skill Resource 后，才会记录该 Skill Invocation。"
      source: "research/reading/Q-20260827-03-trusted-root-skill-provenance-authorization-evidence.md"
      strength: "direct merged implementation evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Candidate skill paths and trusted roots are canonicalized, and trust requires the resulting real file to remain under a canonical trusted root; repository skills and symlink escapes do not qualify through this path."
      claim_zh: "Candidate Skill Path 与 Trusted Root 都会 Canonicalize；只有解析后的真实文件仍位于 Canonical Trusted Root 下才具备资格，Repository Skill 与 Symlink Escape 不会通过该路径获得信任。"
      source: "research/reading/Q-20260827-03-trusted-root-skill-provenance-authorization-evidence.md"
      strength: "direct path-provenance implementation evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "Guardian receives a bounded, deduplicated list of verified canonical skill paths rather than the arbitrary skill body content as the privileged provenance fragment."
      claim_zh: "Guardian 获得的是有界、去重后的 Verified Canonical Skill Path List，而不是把任意 Skill Body Content 直接作为具有特权的 Provenance Fragment。"
      source: "research/reading/Q-20260827-03-trusted-root-skill-provenance-authorization-evidence.md"
      strength: "direct evidence-shaping implementation evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "Integration and unit coverage includes explicit and implicit trusted invocations, forged repository skills, symlink escapes, deduplication and evidence-size limits."
      claim_zh: "Integration 与 Unit Coverage 包含显式/隐式 Trusted Invocation、伪造 Repository Skill、Symlink Escape、Deduplication 与 Evidence-size Limit。"
      source: "research/reading/Q-20260827-03-trusted-root-skill-provenance-authorization-evidence.md"
      strength: "direct maintainer test evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Authorization evidence from an extension should begin with a host-observed occurrence and a host-verified provenance boundary, not with a name, displayed path or markup asserted by the extension or repository."
      claim_zh: "来自 Extension 的 Authorization Evidence 应从 Host-observed Occurrence 与 Host-verified Provenance Boundary 开始，而不能从 Extension 或 Repository 自我声明的 Name、Displayed Path 或 Markup 开始。"
      source: "E1,E2,E4"
      strength: "bounded provenance-governance interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "Location provenance and content identity are separate evidence dimensions: a trusted canonical path can establish where an invoked skill came from under the configured trust model, but not which exact content version was executed or whether those instructions were semantically safe."
      claim_zh: "Location Provenance 与 Content Identity 是两个独立 Evidence Dimension：Trusted Canonical Path 可以在既定 Trust Model 下说明被调用 Skill 来自哪里，但不能证明执行的是哪一个精确 Content Version，也不能证明其 Instruction 在语义上安全。"
      source: "E1,E2,E3"
      strength: "evidence-identity boundary interpretation"
      independent: false

  observations:
    - "The mechanism elevates an observed invocation event, not mere skill existence, into candidate approval evidence."
    - "Canonicalization changes the trust question from textual path membership to resolved filesystem provenance."
    - "Repository content is explicitly prevented from acquiring the same authority merely by imitating trusted skill markup or directory-shaped text."
    - "Path-only evidence deliberately limits privileged content exposure, but it sacrifices exact historical content identity unless another digest/version record is retained."
  observations_zh:
    - "该机制把实际发生的 Invocation Event，而不是 Skill 是否存在，提升为 Candidate Approval Evidence。"
    - "Canonicalization 把信任问题从 Textual Path Membership 转换为 Resolved Filesystem Provenance。"
    - "Repository Content 无法仅靠模仿 Trusted Skill Markup 或目录形态文本获得同等 Authority。"
    - "Path-only Evidence 有意限制 Privileged Content Exposure，但如果没有其他 Digest/Version Record，就无法保留精确 Historical Content Identity。"

  comparisons:
    - "A skill name or displayed path is self-described metadata; a canonical path under a host-defined trusted root is host-verified provenance under a specific local trust model."
    - "Loading full skill contents into privileged approval context provides semantic detail but also expands prompt-injection and budget surface; path-only provenance narrows that surface but cannot attest content semantics."
    - "Trusting repository-local skills by location would let the object being reviewed manufacture its own approval evidence; separating user-owned roots from repository roots prevents that direct circular authority path."
  comparisons_zh:
    - "Skill Name 或 Displayed Path 属于 Self-described Metadata；Host-defined Trusted Root 下的 Canonical Path 则是特定本地 Trust Model 中的 Host-verified Provenance。"
    - "把完整 Skill Content 放进 Privileged Approval Context 可以提供更多语义，但会扩大 Prompt-injection 与 Budget Surface；Path-only Provenance 收缩该 Surface，却不能证明 Content Semantics。"
    - "如果仅凭位置就信任 Repository-local Skill，被评审对象就可能制造自己的 Approval Evidence；把 User-owned Root 与 Repository Root 分离，可以阻断这种直接循环 Authority Path。"

  counterarguments:
    - "A user-owned path is not equivalent to contemporaneous user approval; a skill may be old, broadly scoped or modified since the user last reviewed it."
    - "Canonicalization and root checks rely on correct local filesystem and home/root configuration; they are not cryptographic provenance."
    - "Path-only evidence cannot prove which exact bytes were invoked if the file can change between invocation and later audit."
    - "Bounded evidence lists can omit additional trusted invocations after limits are reached, so the mechanism is intentionally not complete provenance capture for an unbounded turn."
  counterarguments_zh:
    - "User-owned Path 不等于当前时刻的 User Approval；Skill 可能已经过期、Scope 很宽，或自用户上次审阅后发生变化。"
    - "Canonicalization 与 Root Check 依赖本地 Filesystem 及 Home/Root Configuration 正确，它们不是 Cryptographic Provenance。"
    - "如果 File 在 Invocation 与后续 Audit 之间可能变化，Path-only Evidence 就不能证明当时调用的精确字节内容。"
    - "Evidence List 有明确上限，超过上限后可能省略其他 Trusted Invocation，因此该机制有意不提供无限 Turn 的完整 Provenance Capture。"

  research_judgment: "An invoked skill should contribute authorization evidence only after the host has observed the invocation and verified its provenance against an authority-owned trust boundary such as canonical trusted roots. Repository-controlled labels, markup and path-like text should remain non-authorizing because they are claims from the object being evaluated. The demonstrated Guardian pattern establishes bounded invocation provenance; it does not establish semantic safety, immutable content identity or universal user authorization."
  research_judgment_zh: "被调用 Skill 只有在 Host 已观察到真实 Invocation，并依据 Authority-owned Trust Boundary（例如 Canonical Trusted Root）核验其 Provenance 后，才应贡献 Authorization Evidence。Repository-controlled Label、Markup 与 Path-like Text 仍应保持 Non-authorizing，因为它们只是被评审对象自身的声明。所展示的 Guardian Pattern 建立的是有界 Invocation Provenance；它不能建立 Semantic Safety、Immutable Content Identity 或通用 User Authorization。"

  general_implications:
    - "Plugin and skill systems should model invocation provenance as a first-class record containing occurrence identity, resolved resource identity, trust-root decision and evidence bounds."
    - "Authorization reviewers should distinguish evidence about who owns or supplied an extension from evidence about what the extension says and from evidence that a human approved the current action."
    - "If later audit must establish the exact skill version that influenced an approval, a content digest or immutable version identifier should accompany path provenance."
    - "Repository-controlled extensions should not be allowed to mint their own trusted provenance through names, markup or symlink-shaped indirection."
    - "Evidence truncation caused by safety budgets should be observable so an approval system can distinguish complete from bounded provenance."
  general_implications_zh:
    - "Plugin 与 Skill System 应把 Invocation Provenance 建模为一等记录，包含 Occurrence Identity、Resolved Resource Identity、Trust-root Decision 与 Evidence Bound。"
    - "Authorization Reviewer 应区分三种不同 Evidence：谁拥有/提供 Extension、Extension 自己说了什么、真人是否批准当前动作。"
    - "如果后续 Audit 必须证明究竟哪一个 Skill Version 影响了 Approval，Path Provenance 之外还应记录 Content Digest 或 Immutable Version Identifier。"
    - "Repository-controlled Extension 不应通过 Name、Markup 或 Symlink-shaped Indirection 自行铸造 Trusted Provenance。"
    - "由 Safety Budget 导致的 Evidence Truncation 应可观察，使 Approval System 能区分 Complete Provenance 与 Bounded Provenance。"

  limitations:
    - "Evidence is a merged Codex maintainer implementation and tests, not independent validation of Guardian approval correctness."
    - "The demonstrated trusted roots and rules are local Codex policy, not a universal filesystem trust standard."
    - "The mechanism does not hash skill contents, prove immutability, authenticate historical versions or prove semantic safety."
    - "The conclusion is limited to provenance qualification for the demonstrated Guardian review path and does not claim that every Codex subsystem uses identical authorization evidence."
  limitations_zh:
    - "证据来自已合并 Codex 维护者实现与测试，并非对 Guardian Approval Correctness 的独立验证。"
    - "所展示的 Trusted Root 与规则属于本地 Codex Policy，不是通用 Filesystem Trust Standard。"
    - "该机制没有对 Skill Content 做 Hash，不能证明 Immutability、认证 Historical Version 或证明 Semantic Safety。"
    - "结论仅限于所展示 Guardian Review Path 的 Provenance Qualification，不声称所有 Codex Subsystem 都使用相同 Authorization Evidence。"

  open_questions:
    - "Should trusted invocation evidence include a content digest or version identity for later audit and replay?"
    - "How should trust-root changes and user-home remapping affect already-running sessions or stored approval evidence?"
    - "How should the system expose evidence truncation when count, byte or token limits omit otherwise trusted invocations?"
    - "What revocation semantics apply when a trusted skill is removed or modified after invocation but before approval or later audit?"
  open_questions_zh:
    - "Trusted Invocation Evidence 是否应包含 Content Digest 或 Version Identity，以支持后续 Audit 与 Replay？"
    - "Trust-root Change 与 User-home Remapping 应如何影响已运行 Session 或已保存 Approval Evidence？"
    - "当 Count、Byte 或 Token Limit 省略其他 Trusted Invocation 时，系统应如何暴露 Evidence Truncation？"
    - "当 Trusted Skill 在 Invocation 后、Approval 或后续 Audit 前被删除或修改时，应采用什么 Revocation Semantics？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence", "engineering-implications", "governance-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment is a general extension-provenance and authorization-evidence pattern; no first-party project is required for the argument."
    rationale_zh: "该判断属于通用 Extension-provenance 与 Authorization-evidence Pattern，论证不需要任何自有项目。"
```

## Bounded judgment / 有界判断

The central distinction is **provenance evidence must be host-verified before it can influence authorization, and provenance is still not semantic approval**. The selected Guardian change shows how canonical trusted-root resolution can prevent repository-controlled text from impersonating user-owned invocation evidence. That evidence remains location- and occurrence-scoped; without content identity it cannot prove which exact skill semantics were approved or that those semantics were safe.

核心区别是：**Provenance Evidence 必须先由 Host 核验，才能影响 Authorization；而 Provenance 本身仍不等于 Semantic Approval**。所选 Guardian 变更展示了 Canonical Trusted-root Resolution 如何阻止 Repository-controlled Text 冒充 User-owned Invocation Evidence。但这些 Evidence 仍只覆盖 Location 与 Occurrence；如果没有 Content Identity，就不能证明用户究竟批准了哪一个精确 Skill Semantics，也不能证明这些语义安全。
