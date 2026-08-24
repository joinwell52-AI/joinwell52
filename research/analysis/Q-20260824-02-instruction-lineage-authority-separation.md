---
schema: "research-analysis/v1"
id: "AN-20260824-02"
date: "2026-08-24"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260824-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260824-02-subagent-developer-instruction-provenance.md"
output_contract: "Research Object"
research_object: "Instruction Lineage Must Be Separated from Instruction Authority"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Instruction Lineage Must Be Separated from Instruction Authority

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-24 Reading Result for Q-20260824-02. The primary evidence is a merged Codex change that gives developer instructions a typed provenance fragment and preserves a child-only instruction boundary in the demonstrated full-history subagent fork. The judgment below concerns multi-agent context architecture and governance. It does not establish authenticated instruction authority, a complete provenance graph, or distributed exactly-once delivery.

本对象仅分析 Q-20260824-02 的 2026-08-24 已完成 Reading Result。一手证据来自 Codex 已合并变更：Developer Instruction 获得 Typed Provenance Fragment，并在已证明的 Full-history Subagent Fork 中保持 Child-only Instruction Boundary。下述判断关注 Multi-agent Context Architecture 与 Governance，并不建立经过认证的 Instruction Authority、完整 Provenance Graph 或分布式 Exactly-once Delivery。

```yaml
analysis:
  research_question: "When a subagent inherits parent history but receives child-specific developer instructions, how should the architecture preserve instruction lineage without turning provenance labels into implicit authorization?"
  research_question_zh: "当 Subagent 继承 Parent History、同时接收 Child-specific Developer Instruction 时，架构应如何保留 Instruction Lineage，而不把 Provenance Label 变成隐式 Authorization？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The selected Codex change introduces a DeveloperInstructions contextual fragment with developer role and generic.developer_instructions content kind instead of the previous unknown classification."
      claim_zh: "所选 Codex 变更新增 `DeveloperInstructions` Contextual Fragment，并使用 Developer Role 与 `generic.developer_instructions` Content Kind，替代此前的 Unknown Classification。"
      source: "research/reading/Q-20260824-02-subagent-developer-instruction-provenance.md"
      strength: "direct merged-code evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Full-history fork construction filters inherited developer text, tracks whether parent developer instructions were replaced, and conditionally injects the child-only developer fragment when preserved reference context would otherwise omit it."
      claim_zh: "Full-history Fork Construction 会过滤继承的 Developer Text，跟踪 Parent Developer Instruction 是否已被替换，并在 Preserved Reference Context 否则会遗漏 Child-only Instruction 时条件性注入该 Child Developer Fragment。"
      source: "research/reading/Q-20260824-02-subagent-developer-instruction-provenance.md"
      strength: "direct implementation evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The regression verifies that the parent request excludes the child-only instruction, the child request carries generic.developer_instructions classification, and the exact child-only text occurs once in child developer messages."
      claim_zh: "Regression 验证 Parent Request 不包含 Child-only Instruction，Child Request 携带 `generic.developer_instructions` 分类，并且该 Child-only Text 在 Child Developer Message 中恰好出现一次。"
      source: "research/reading/Q-20260824-02-subagent-developer-instruction-provenance.md"
      strength: "direct request-level regression evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "The fork path still contains a TODO for more precise message-fragment provenance and uses some text-oriented rewriting of inherited developer instructions."
      claim_zh: "该 Fork Path 仍保留更精确 Message-fragment Provenance 的 TODO，并且对继承 Developer Instruction 的部分处理仍使用 Text-oriented Rewrite。"
      source: "research/reading/Q-20260824-02-subagent-developer-instruction-provenance.md"
      strength: "direct implementation-boundary evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "A multi-agent fork should model context derivation with typed lineage: parent-derived material and child-local instructions need separate provenance so each can be inspected across fork, compaction, resume and replay."
      claim_zh: "Multi-agent Fork 应使用 Typed Lineage 建模 Context Derivation：Parent-derived Material 与 Child-local Instruction 需要独立 Provenance，才能在 Fork、Compaction、Resume 与 Replay 中分别检查。"
      source: "E1,E2,E3"
      strength: "bounded architecture interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "Developer role and provenance classification establish what an instruction is and where it belongs, but they do not establish which principal was authorized to create it or how it should rank against external policy."
      claim_zh: "Developer Role 与 Provenance Classification 可以说明 Instruction 是什么、属于哪里，但不能说明哪个 Principal 获得授权去创建它，也不能决定它相对于外部 Policy 应具有何种优先级。"
      source: "E1,E4"
      strength: "bounded governance interpretation"
      independent: false

  observations:
    - "The patch improves semantic identity before it improves authority: developer instructions become typed context rather than unknown text."
    - "The parent/child regression tests a lineage boundary at the actual request surface, which is stronger than checking only an internal object."
    - "Exactly-once occurrence in the demonstrated child request is a local construction property, not a durable transport or replay guarantee."
    - "The remaining text-rewrite logic shows that typed provenance is partial rather than an end-to-end provenance graph."
  observations_zh:
    - "该 Patch 首先改善的是 Semantic Identity，而不是 Authority：Developer Instruction 从 Unknown Text 变成 Typed Context。"
    - "Parent / Child Regression 在真实 Request Surface 上测试 Lineage Boundary，比只检查内部对象更强。"
    - "在已证明 Child Request 中恰好出现一次，只是 Local Construction Property，不是 Durable Transport 或 Replay Guarantee。"
    - "仍存在的 Text-rewrite Logic 表明 Typed Provenance 目前只是局部机制，而非端到端 Provenance Graph。"

  comparisons:
    - "Untyped message copying preserves text but weakens the ability to distinguish inherited context from child-local control material."
    - "Typed lineage makes context derivation inspectable, but a separate authority plane is still required to decide who may introduce or override developer instructions."
    - "Treating developer classification itself as authority collapses provenance and permission into one field and creates privilege-drift risk across derived agents."
  comparisons_zh:
    - "Untyped Message Copying 可以保留文本，但削弱系统区分 Inherited Context 与 Child-local Control Material 的能力。"
    - "Typed Lineage 让 Context Derivation 可检查，但仍需要独立 Authority Plane 决定谁可以引入或覆盖 Developer Instruction。"
    - "如果把 Developer Classification 本身当作 Authority，就会把 Provenance 与 Permission 压缩进同一个字段，并在 Derived Agent 间产生 Privilege-drift Risk。"

  counterarguments:
    - "In tightly controlled single-process systems, the caller that constructs the child may already be trusted, reducing the immediate need for a separate authorization record."
    - "Additional provenance structure increases context and implementation complexity and may be unnecessary for low-risk ephemeral forks."
    - "A developer-role instruction may legitimately outrank other conversational content, but that role ordering still does not authenticate the source principal."
  counterarguments_zh:
    - "在严格受控的单进程系统中，构造 Child 的 Caller 可能已经被整体信任，因此独立 Authorization Record 的即时必要性较低。"
    - "额外 Provenance Structure 会增加 Context 与实现复杂度，对低风险 Ephemeral Fork 可能不必要。"
    - "Developer-role Instruction 可能在 Message Ordering 中合法高于普通对话内容，但 Role Ordering 仍不能认证 Source Principal。"

  research_judgment: "Forked-agent context should carry typed instruction lineage independently from the policy authority that permits those instructions. Child-specific developer guidance belongs to the derived child context and should remain excluded from the parent while being represented once in the child, but developer role and content classification establish provenance rather than authorization. A robust multi-agent architecture therefore needs a lineage plane for where instructions came from and an authority plane for which principal or policy allowed them; collapsing the two invites privilege drift across fork, compaction, resume and replay boundaries."
  research_judgment_zh: "Forked-agent Context 应独立携带 Typed Instruction Lineage，而授权这些 Instruction 的 Policy Authority 应由另一控制面表示。Child-specific Developer Guidance 属于 Derived Child Context，应保持不进入 Parent，并在 Child 中被清晰表示一次；但 Developer Role 与 Content Classification 建立的是 Provenance，而不是 Authorization。稳健的 Multi-agent Architecture 因此需要一个 Lineage Plane 说明 Instruction 从哪里来，同时需要独立 Authority Plane 说明哪个 Principal 或 Policy 允许它；如果把二者合并，就会在 Fork、Compaction、Resume 与 Replay Boundary 中产生 Privilege Drift。"

  general_implications:
    - "Multi-agent context formats should retain typed origin and scope for instructions that are inherited, replaced or introduced locally."
    - "Authorization records should bind principals, policy source and scope separately from conversational or contextual role labels."
    - "Fork and compaction tests should verify both non-leakage across boundaries and preservation of provenance identity."
    - "Replay and resume paths should define whether lineage is preserved, transformed or re-authorized rather than silently copying control text."
  general_implications_zh:
    - "Multi-agent Context Format 应为 Inherited、Replaced 或 Locally Introduced Instruction 保留 Typed Origin 与 Scope。"
    - "Authorization Record 应把 Principal、Policy Source 与 Scope 独立绑定，不应依赖 Conversation / Context Role Label。"
    - "Fork 与 Compaction Test 应同时验证 Boundary Non-leakage 与 Provenance Identity Preservation。"
    - "Replay 与 Resume Path 应明确 Lineage 是被保留、转换还是重新授权，而不是静默复制 Control Text。"

  limitations:
    - "Evidence is one merged Codex implementation and request-level regression, not an independent multi-framework evaluation."
    - "The exactly-once evidence is limited to one demonstrated request construction and does not establish distributed delivery semantics."
    - "Some inherited-history rewriting remains text-oriented and the implementation itself notes future provenance work."
    - "The evidence does not identify or authenticate the principal allowed to set subagent developer instructions."
  limitations_zh:
    - "证据来自一个已合并 Codex 实现与 Request-level Regression，并非独立的 Multi-framework Evaluation。"
    - "Exactly-once Evidence 仅限一个已证明 Request Construction，不能建立分布式 Delivery Semantics。"
    - "部分 Inherited-history Rewrite 仍为 Text-oriented，且实现本身明确记录后续 Provenance 工作。"
    - "现有证据没有识别或认证哪个 Principal 获得设置 Subagent Developer Instruction 的权限。"

  open_questions:
    - "Can every instruction fragment carry a typed origin, scope and derivation id through compaction and resume?"
    - "Which policy layer authenticates the principal that is allowed to create child developer instructions?"
    - "How should conflicts among inherited, managed and child-local developer instructions be resolved without treating provenance as authority?"
    - "Should forked contexts preserve parent lineage separately from the child-local effective policy view?"
  open_questions_zh:
    - "每个 Instruction Fragment 是否都能携带 Typed Origin、Scope 与 Derivation ID，并穿过 Compaction 与 Resume？"
    - "哪个 Policy Layer 负责认证有权创建 Child Developer Instruction 的 Principal？"
    - "Inherited、Managed 与 Child-local Developer Instruction 之间的冲突应如何处理，同时避免把 Provenance 当成 Authority？"
    - "Forked Context 是否应把 Parent Lineage 与 Child-local Effective Policy View 分开保存？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "context", "evidence", "technical-analysis", "architecture-implications", "governance-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment is a general multi-agent context and authority architecture principle; no first-party project is needed to establish it."
    rationale_zh: "该判断属于一般 Multi-agent Context 与 Authority Architecture 原则，不需要引入自有项目才能成立。"
```

## Bounded judgment / 有界判断

The core distinction is **instruction provenance is not instruction authority**. A typed developer fragment can accurately show that a piece of control context belongs to the child and was not sent to the parent, while still saying nothing about who was permitted to supply it. The selected Codex change strengthens lineage at one fork boundary; it does not authenticate principals or prove end-to-end policy integrity.

核心区别是：**Instruction Provenance 不等于 Instruction Authority**。Typed Developer Fragment 可以准确说明某段 Control Context 属于 Child、没有发送给 Parent，但这仍不能说明谁被允许提供它。所选 Codex 变更强化了一个 Fork Boundary 上的 Lineage，却并未认证 Principal，也未证明端到端 Policy Integrity。
