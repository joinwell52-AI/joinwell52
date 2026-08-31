---
schema: "research-analysis/v1"
id: "AN-20260831-01"
date: "2026-08-31"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260831-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260831-01-standing-policy-runtime-commitment-authority.md"
output_contract: "Research Object"
research_object: "Standing Policy Must Remain Separate from Occurrence Authority"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Standing Policy Must Remain Separate from Occurrence Authority

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-31 Reading Result for Q-20260831-01. The evidence is the primary research reported in arXiv:2608.27443: a 113-participant comparison of per-action HITL, automatic supervision and user-authored consequence policies. The conclusion concerns the governance boundary between reusable preference and occurrence-specific commitment. It does not establish that every consequential action universally requires HITL, and it does not treat the study as independently replicated evidence.

本对象只分析 Q-20260831-01 的 2026-08-31 当日已完成 Reading Result。证据来自 arXiv:2608.27443 报告的一手研究：113 名参与者比较逐动作 HITL、自动监督与用户自定义后果策略。结论只讨论“可复用偏好”与“具体发生时承诺”之间的治理边界，不主张所有后果性动作都普遍必须使用 HITL，也不把该研究当作已经独立复现的证据。

```yaml
analysis:
  research_questions:
    - id: "RQ1"
      question: "How can a digital employee reuse standing permission preferences without silently converting those preferences into final authority for a concrete consequential occurrence?"
      question_zh: "数字员工如何复用长期权限偏好，同时避免把这些偏好静默转换成某次具体后果性动作的最终执行权威？"
  research_themes: ["human approval", "runtime commitment", "standing policy", "authorization provenance", "digital employee governance"]
  subject_kind: ["governance-problem", "architecture-mechanism", "research-finding"]
  samples: ["113-participant supervision study reported in arXiv:2608.27443"]

  research_value:
    failures:
      - "Moving a decision from a concrete occurrence into an earlier abstract policy-authoring moment can reduce prompts while weakening overreach protection."
      - "A single permission flag collapses policy preference, consequence matching and final occurrence commitment into one authority state."
      - "Prompt reduction is not evidence that a standing policy preserves the same protection as per-action approval."
    findings:
      - "The study reports raw overreach blocking of 59.6% for HITL, 53.9% for the automatic condition and 39.6% for the policy condition, while required-action completion remains high in all three conditions."
      - "Of 140 user-authored category rules, 114 selected Ask, so 81.4% of authored rules preserved a later runtime decision boundary."
      - "Among 245 policy-condition overreach occurrences, 199 were routed to Ask; 133 were approved and 66 denied at runtime."
      - "The adjusted HITL-versus-policy overreach-blocking difference is reported as 20.1 percentage points, with a 95% confidence interval of -32.1 to -8.1 points."
    mechanisms:
      - "Standing consequence-category policy chooses Allow, Ask or Never for future matching actions."
      - "Ask is a reusable routing preference that deliberately preserves occurrence-specific commitment."
      - "Allow converts a standing rule into automatic execution authority for a matched future occurrence; therefore its scope and freshness matter independently of policy persistence."
      - "Occurrence commitment is a separate decision event over a concrete proposed action rather than merely a replay of the policy author's earlier preference."
    implications:
      - "A governed digital employee should represent standing preference and occurrence authority as different state objects."
      - "A runtime approval should bind the concrete occurrence and the policy context that routed it to approval."
      - "Standing Allow can be legitimate, but its authority should remain bounded by declared scope rather than being inferred from the mere existence of a durable policy."

  evidence_claims:
    - id: "E1"
      identity: "source-reported-claim"
      claim: "The primary study reports lower raw overreach blocking in the policy condition than in the per-action HITL condition while required-action completion remains high."
      claim_zh: "一手研究报告：Policy 条件的原始 Overreach Blocking 低于逐动作 HITL，而三种条件的 Required-action Completion 均保持较高水平。"
      source: "research/reading/Q-20260831-01-standing-policy-runtime-commitment-authority.md"
      strength: "primary research result; not independently replicated here"
      independent: false
    - id: "E2"
      identity: "source-reported-claim"
      claim: "114 of 140 authored consequence-category rules selected Ask, preserving a later runtime decision."
      claim_zh: "140 条用户自定义后果类别规则中有 114 条选择 Ask，保留了后续运行时决定。"
      source: "research/reading/Q-20260831-01-standing-policy-runtime-commitment-authority.md"
      strength: "reported participant-choice result"
      independent: false
    - id: "E3"
      identity: "source-reported-claim"
      claim: "The experiment used a fixed researcher-checked action-to-consequence mapping for the main supervision comparison."
      claim_zh: "主要监督比较实验使用研究者核验的固定 Action-to-consequence 映射。"
      source: "research/reading/Q-20260831-01-standing-policy-runtime-commitment-authority.md"
      strength: "reported experimental-design fact"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "A standing policy is best treated as a durable decision-routing rule; it is not automatically the final authorization object for every future matching occurrence."
      claim_zh: "Standing Policy 更适合被建模为持久的决策路由规则；它并不自动成为每次未来匹配发生的最终授权对象。"
      source: "E1,E2,E3"
      strength: "bounded governance interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "Occurrence authority should preserve the identities of the policy version, matched consequence class, concrete proposed action and final commitment decision."
      claim_zh: "Occurrence Authority 应保留 Policy Version、匹配的 Consequence Class、具体 Proposed Action 与最终 Commitment Decision 的身份。"
      source: "E2,E3"
      strength: "architecture implication; not directly tested by the source"
      independent: false

  observations:
    - "The dominant user-authored choice was not permanent Allow or Never, but a reusable instruction to ask again at runtime."
    - "The study separates policy usability from final action commitment more clearly than a flat allow/deny permission model."
    - "The evidence supports a distinction between preference persistence and action authority, but not one universal threshold for when fresh approval is mandatory."
  observations_zh:
    - "用户最常选择的不是永久 Allow 或 Never，而是可复用的‘运行时再次询问’规则。"
    - "与扁平 Allow/Deny 权限模型相比，该研究更清楚地区分了 Policy 可复用性与最终 Action Commitment。"
    - "证据支持区分偏好持久化与动作权威，但不能给出一个普遍适用的‘何时必须重新审批’阈值。"

  comparisons:
    - "Per-action HITL binds a decision to the concrete occurrence but creates more prompts; standing Allow removes interruption by deciding earlier; Ask preserves a later occurrence decision while still reusing policy."
    - "A preference store answers how future cases should normally be routed; an occurrence commitment answers whether this specific proposed effect is authorized now."
  comparisons_zh:
    - "逐动作 HITL 把决定绑定到具体发生，但 Prompt 更多；Standing Allow 通过提前决定减少打断；Ask 则在复用 Policy 的同时保留后续 Occurrence Decision。"
    - "Preference Store 回答未来案例通常如何路由；Occurrence Commitment 回答当前这一次具体 Proposed Effect 是否被授权。"

  contradictions:
    - "The policy interface reduced prompting relative to HITL but also blocked less overreach, so lower interaction cost cannot be used as a proxy for equivalent protection."
    - "Most users retained Ask, contradicting the assumption that policy authoring mainly exists to eliminate future approvals."
  contradictions_zh:
    - "Policy 界面相对 HITL 减少 Prompt，却也少阻止更多 Overreach，因此较低交互成本不能被当作同等保护的替代指标。"
    - "大多数用户保留 Ask，这与‘Policy Authoring 主要用于消除未来审批’的简单假设相矛盾。"

  counterarguments:
    - "Fresh approval for every action can create fatigue and may itself reduce supervision quality; the evidence does not justify universal per-action HITL."
    - "A sufficiently narrow standing Allow may be appropriate for low-risk, bounded or repetitive effects, but the relevant scope and expiry rules require separate evidence."
  counterarguments_zh:
    - "每个动作都重新审批会造成疲劳，并可能降低监督质量；现有证据不足以支持普遍逐动作 HITL。"
    - "对低风险、边界明确或重复性效果，足够窄的 Standing Allow 可能合理，但其范围和过期规则需要另行证据。"

  research_judgment: "Standing permission policy and occurrence authority should be separate governance objects. The study shows that reusable policy can reduce prompts while materially changing overreach protection, and that users frequently encode Ask precisely to preserve a runtime decision. A governed digital employee should therefore let policy route an occurrence to Allow, Ask or Never, but should treat the final authority for a concrete consequential occurrence as independently identifiable and auditable whenever the policy leaves that decision open. Standing Allow remains possible, but its authority derives from its explicit bounded scope and current validity, not merely from being durable user preference state."
  research_judgment_zh: "Standing Permission Policy 与 Occurrence Authority 应当是两个独立治理对象。研究表明，可复用 Policy 能减少 Prompt，却会实质改变 Overreach Protection；而用户大量选择 Ask，恰恰是在保留运行时决定。因而，受治理数字员工可以让 Policy 把某次发生路由到 Allow、Ask 或 Never，但只要 Policy 把决定留到运行时，具体后果性发生的最终权威就应具有独立、可审计的身份。Standing Allow 仍然可以存在，但其权威来自明确且仍有效的有限范围，而不是因为它是一项持久用户偏好。"

  general_implications:
    - "Persist policy author/version separately from concrete occurrence identity and final commitment evidence."
    - "Let Ask remain an explicit governance state rather than translating it into a weak default approval."
    - "Bind high-impact commitment evidence to the proposed effect, relevant target and governing policy version so later replay or audit can distinguish preference from authorization."
    - "Treat learned preferences from repeated approvals as evidence for future routing, not as silent authority escalation."
  general_implications_zh:
    - "Policy Author/Version 应与具体 Occurrence Identity 和最终 Commitment Evidence 分开持久化。"
    - "Ask 应保持为显式治理状态，不能被转换成弱默认批准。"
    - "高影响 Commitment Evidence 应绑定 Proposed Effect、相关 Target 与 Governing Policy Version，使后续重放或审计能够区分偏好与授权。"
    - "从重复批准中学习到的偏好应作为未来路由证据，而不能静默升级为执行权威。"

  limitations:
    - "The evidence is one primary study with 113 online US participants in a scripted simulated workday."
    - "The consequence taxonomy is coarse and does not establish enterprise-specific approval thresholds."
    - "The separate metadata mapper is not demonstrated as a robust security boundary against adversarial inputs."
    - "No independent replication or real-world incident-rate evidence is supplied by this Analysis."
  limitations_zh:
    - "证据来自一项一手研究：113 名美国在线参与者、脚本化模拟工作日。"
    - "后果类别较粗，不能建立企业场景的具体审批阈值。"
    - "独立的 Metadata Mapper 尚未被证明是抵抗对抗输入的稳健安全边界。"
    - "本 Analysis 未提供独立复现或真实部署事故率证据。"

  open_questions:
    - "Which consequence classes are eligible for bounded standing Allow, and which always require occurrence commitment?"
    - "What attributes should a commitment bind: tool call, normalized effect, target, amount, recipient, data sensitivity or a richer effect digest?"
    - "How should policy revocation affect prepared but not yet executed occurrences?"
    - "How can systems learn preferences without silently converting repeated approvals into permanent authority?"
  open_questions_zh:
    - "哪些 Consequence Class 可使用有界 Standing Allow，哪些始终需要 Occurrence Commitment？"
    - "Commitment 应绑定 Tool Call、Normalized Effect、Target、Amount、Recipient、Data Sensitivity，还是更丰富的 Effect Digest？"
    - "Policy 撤销应如何作用于已经准备但尚未执行的 Occurrence？"
    - "系统如何学习偏好，而不把重复批准静默转换成永久权威？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "evidence", "technical-analysis", "governance-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The conclusion concerns general human-agent authorization design and does not require a first-party project to remain meaningful."
    rationale_zh: "结论讨论通用 Human-Agent Authorization 设计，即使移除所有自有项目也完整成立。"
```

## Bounded judgment / 有界判断

A durable preference can govern how future actions are routed, but it should not be confused with the final authority for a concrete consequential occurrence. When the policy says Ask, the later commitment is the authority-bearing event; when the policy says Allow, the authorization boundary is the explicit scope and validity of that standing grant.

持久偏好可以治理未来动作如何被路由，但不能与某次具体后果性发生的最终权威混为一谈。当 Policy 为 Ask 时，后续 Commitment 才是携带权威的事件；当 Policy 为 Allow 时，授权边界来自该长期授权明确且仍有效的范围。