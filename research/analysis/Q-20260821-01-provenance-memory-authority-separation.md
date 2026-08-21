---
schema: "research-analysis/v1"
id: "AN-20260821-01"
date: "2026-08-21"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260821-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260821-01-external-tool-output-memory-contamination-boundary.md"
output_contract: "Research Object"
research_object: "Provenance Evidence and Memory Authority Must Be Separated"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Provenance Evidence and Memory Authority Must Be Separated

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-21 Reading Result for Q-20260821-01. The merged Codex evidence establishes a structural distinction for standalone `FunctionCallOutput` items without `call_id`: they can be classified as possible external context, can durably move thread-memory state to `polluted` under an enabled policy, remain attributable in transcript views, and may still be usable by a separate recent-image consumer. The conclusions below are bounded architectural interpretations for digital employees and agent runtimes. They do not establish authenticated source identity, universal tool-output distrust, or end-to-end memory safety.

本对象仅分析 Q-20260821-01 的 2026-08-21 已完成 Reading Result。Codex 已合并证据建立了对缺少 `call_id` 的独立 `FunctionCallOutput` 的结构性区分：它们可被归类为可能的 External Context；在启用对应策略时，可把 Thread Memory State 持久转换为 `polluted`；在 Transcript 中仍可保留来源标识；同时还可能被独立的 Recent-image Consumer 使用。下述结论仅属于对数字员工与 Agent Runtime 的有界架构解释，并不建立已认证 Source Identity、普遍不信任所有 Tool Output 或端到端 Memory Safety。

```yaml
analysis:
  research_question: "When useful tool output arrives without a local execution binding, how should a digital employee separate provenance evidence, immediate usability and authority to persist or reuse that content as memory?"
  research_question_zh: "当有用的 Tool Output 在缺少本地 Execution Binding 的情况下进入线程时，数字员工应如何分离 Provenance Evidence、即时可用性与把该内容持久化或复用为 Memory 的 Authority？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "Merged Codex code classifies FunctionCallOutput without call_id as possible external context rather than classifying every tool output that way."
      claim_zh: "Codex 已合并代码把缺少 call_id 的 FunctionCallOutput 归类为可能的 External Context，而不是把所有 Tool Output 都如此归类。"
      source: "research/reading/Q-20260821-01-external-tool-output-memory-contamination-boundary.md"
      strength: "direct merged-code evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "With memories.disable_on_external_context enabled, demonstrated injected-item and fork-history paths can durably mark thread memory mode polluted."
      claim_zh: "在启用 memories.disable_on_external_context 时，已演示的 Injected-item 与 Fork-history 路径可以把 Thread Memory Mode 持久标记为 polluted。"
      source: "research/reading/Q-20260821-01-external-tool-output-memory-contamination-boundary.md"
      strength: "merged-code and regression-test evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "Guardian and general transcript paths preserve standalone named tool-source identity, including namespace/name where present, while non-text content is represented only as a placeholder."
      claim_zh: "Guardian 与通用 Transcript 路径保留独立 Named Tool Source Identity，包括存在时的 Namespace/Name；非文本内容在文本 Transcript 中只以 Placeholder 表示。"
      source: "research/reading/Q-20260821-01-external-tool-output-memory-contamination-boundary.md"
      strength: "merged-code and regression-test evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "Recent-image selection can still reuse images from standalone or unpaired tool output, demonstrating that memory-risk classification does not imply a universal ban on every downstream consumer."
      claim_zh: "Recent-image Selection 仍可复用独立或未配对 Tool Output 中的图像，说明 Memory-risk Classification 并不意味着对所有下游 Consumer 的普遍禁用。"
      source: "research/reading/Q-20260821-01-external-tool-output-memory-contamination-boundary.md"
      strength: "merged-code and regression-test evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "A digital employee should treat provenance classification, content usability and memory-reuse authority as separate decisions. Content may be useful evidence without being authorized as durable behavioral memory."
      claim_zh: "数字员工应把 Provenance Classification、Content Usability 与 Memory-reuse Authority 视为三个不同决策。内容可以是有用证据，但并不因此获得成为持久 Behavioral Memory 的授权。"
      source: "E1,E2,E3,E4"
      strength: "bounded architectural interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "A durable polluted state is policy evidence about memory eligibility, not authentication of the external source and not a proof that all future consumers enforce the same boundary."
      claim_zh: "持久的 polluted State 是关于 Memory Eligibility 的 Policy Evidence，而不是对 External Source 的认证，也不是所有未来 Consumer 都执行同一边界的证明。"
      source: "E1,E2,E3,E4"
      strength: "bounded governance interpretation"
      independent: false

  observations:
    - "The implementation preserves the external content while changing how one memory subsystem may reuse it; risk treatment is not content erasure."
    - "The missing call_id is a structural provenance signal, not a verified principal identity."
    - "Transcript attribution and memory eligibility solve different problems: one preserves evidence lineage, the other governs future behavioral influence."
    - "Different consumers can legitimately apply different policies to the same artifact, so authority should be consumer- and purpose-scoped."
  observations_zh:
    - "实现保留 External Content，同时改变某一 Memory Subsystem 对其复用方式；Risk Treatment 并不是删除内容。"
    - "缺少 call_id 是结构化 Provenance Signal，而不是已验证的 Principal Identity。"
    - "Transcript Attribution 与 Memory Eligibility 解决不同问题：前者保留 Evidence Lineage，后者治理未来 Behavioral Influence。"
    - "不同 Consumer 可以对同一 Artifact 合法应用不同策略，因此 Authority 应绑定 Consumer 与 Purpose。"

  comparisons:
    - "Dropping all unpaired output is simple but destroys potentially useful evidence and weakens auditability."
    - "Treating all visible tool output as ordinary memory preserves convenience but lets structurally external content acquire durable behavioral influence without a matching execution binding."
    - "Separating evidence retention from memory eligibility preserves provenance while allowing fail-closed memory policy."
  comparisons_zh:
    - "删除所有未配对 Output 虽然简单，却会丢失可能有价值的 Evidence，并削弱 Auditability。"
    - "把所有可见 Tool Output 都当作普通 Memory 虽然方便，却会让结构上属于 External Context 的内容在没有 Execution Binding 的情况下获得持久 Behavioral Influence。"
    - "分离 Evidence Retention 与 Memory Eligibility 可以同时保留 Provenance，并允许 Fail-closed Memory Policy。"

  counterarguments:
    - "A missing call_id can arise from legitimate integration flows; treating it as a hard maliciousness signal would overstate the evidence."
    - "A polluted flag may be too coarse if different memory stores, consumers or artifact types need different reuse decisions."
    - "Stronger source authentication would improve provenance, but it still would not by itself authorize durable memory reuse for every purpose."
  counterarguments_zh:
    - "缺少 call_id 也可能来自合法 Integration Flow；若把它直接视为恶意硬信号，会超过证据边界。"
    - "如果不同 Memory Store、Consumer 或 Artifact Type 需要不同复用决策，单一 polluted Flag 可能过粗。"
    - "更强 Source Authentication 可以改善 Provenance，但仍不能单独授权该内容在所有 Purpose 下被持久 Memory 复用。"

  research_judgment: "For digital employees, provenance evidence and memory authority should be separate governance planes. Standalone external-context content may remain visible, attributable and useful for bounded tasks, while durable memory reuse requires its own policy decision tied to provenance quality, purpose and consumer. A pollution state can implement a fail-closed memory boundary, but it must not be promoted into authenticated-source evidence or an end-to-end safety guarantee."
  research_judgment_zh: "对数字员工而言，Provenance Evidence 与 Memory Authority 应是两个独立治理平面。Standalone External-context Content 可以继续可见、可归因，并在有界任务中保持可用，但持久 Memory Reuse 必须由独立 Policy Decision 授权，并绑定 Provenance Quality、Purpose 与 Consumer。Pollution State 可以实现 Fail-closed Memory Boundary，但不能被提升为已认证 Source Evidence 或端到端 Safety Guarantee。"

  general_implications:
    - "Runtime records should distinguish content origin evidence from permissions to persist, retrieve, summarize or act on that content."
    - "Memory systems should support purpose-scoped eligibility rather than one global trusted/untrusted bit when multiple consumers exist."
    - "Audit transcripts should retain source labels even when a memory policy suppresses reuse, so safety controls do not erase evidence lineage."
    - "External-context handling should define requalification and clearing rules for durable risk state, with those transitions audited."
    - "Image, attachment and other non-text consumers need explicit policy because text-memory controls do not automatically govern them."
  general_implications_zh:
    - "Runtime Record 应区分 Content Origin Evidence 与对该内容 Persist、Retrieve、Summarize 或 Act 的权限。"
    - "当存在多个 Consumer 时，Memory System 应支持 Purpose-scoped Eligibility，而不是只有一个全局 Trusted/Untrusted Bit。"
    - "即使 Memory Policy 禁止复用，Audit Transcript 也应保留 Source Label，避免安全控制同时抹除 Evidence Lineage。"
    - "External-context Handling 应定义持久 Risk State 的 Requalification 与 Clearing Rule，并对这些转换保留审计。"
    - "Image、Attachment 等非文本 Consumer 需要显式策略，因为 Text-memory Control 不会自动治理它们。"

  limitations:
    - "Evidence comes from one merged Codex implementation and its tests; it is not an independent cross-runtime evaluation."
    - "call_id absence is structural provenance evidence, not cryptographic identity or integrity proof."
    - "The shown code does not establish equivalent handling for every resumed-history or future memory-consumer path."
    - "The evidence does not prove that the polluted state is universally enforced or correctly cleared."
  limitations_zh:
    - "证据来自一个 Codex 已合并实现及其测试，并非跨 Runtime 的独立评估。"
    - "call_id 缺失是结构化 Provenance Evidence，不是 Cryptographic Identity 或 Integrity Proof。"
    - "已展示代码没有建立所有 Resumed-history 或未来 Memory-consumer Path 都具有等价处理。"
    - "证据没有证明 polluted State 被普遍执行或一定被正确清除。"

  open_questions:
    - "Which memory and context consumers must consult external-context eligibility before reuse?"
    - "Should provenance state be attached per artifact, per thread, per source principal or per consumer purpose?"
    - "What evidence is sufficient to requalify externally supplied content for durable memory?"
    - "How should non-text artifacts preserve integrity and source identity when text transcripts only carry placeholders?"
  open_questions_zh:
    - "哪些 Memory 与 Context Consumer 必须在复用前检查 External-context Eligibility？"
    - "Provenance State 应绑定 Artifact、Thread、Source Principal，还是 Consumer Purpose？"
    - "需要哪些 Evidence 才足以把外部提供内容重新资格化为可持久 Memory？"
    - "当 Text Transcript 只有 Placeholder 时，非文本 Artifact 应如何保留 Integrity 与 Source Identity？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence", "technical-analysis", "governance-implications", "engineering-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment is a general provenance and memory-governance pattern for digital employees and agent runtimes; no first-party project is needed to establish it."
    rationale_zh: "该判断属于数字员工与 Agent Runtime 的一般 Provenance / Memory Governance Pattern，不需要引入自有项目才能成立。"
```

## Bounded judgment / 有界判断

The important boundary is **useful evidence does not automatically become memory-authoritative evidence**. Preserving an externally supplied artifact can improve continuity and auditability while a separate policy prevents that artifact from silently shaping persistent agent behavior. The source demonstrates one concrete implementation of that separation; it does not prove authenticated provenance or universal downstream enforcement.

关键边界是：**有用 Evidence 并不会自动成为具有 Memory Authority 的 Evidence**。保留外部提供的 Artifact 可以改善连续性与审计性，同时由独立 Policy 防止它静默塑造持久 Agent Behavior。来源展示了这一分离的一种具体实现，但没有证明 Authenticated Provenance 或所有下游 Consumer 的普遍执行。
