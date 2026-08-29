---
schema: "research-analysis/v1"
id: "AN-20260829-02"
date: "2026-08-29"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260829-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260829-02-fail-closed-workspace-trust-capability-surface.md"
output_contract: "Research Object"
research_object: "Trust Admission Must Shape the Effective Capability Surface"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Trust Admission Must Shape the Effective Capability Surface

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-29 Reading Result for Q-20260829-02. The primary evidence is merged Gemini CLI change `0bd1d439751478771c45d3d0895a6a9760554bf4`, which gives restrictive trust signals precedence, maps unresolved trust to false, treats malformed trust configuration as fatal, and strips demonstrated workspace-controlled MCP, policy, tool and telemetry settings from the effective configuration when the workspace is untrusted. The bounded conclusion concerns admission-time capability governance. It does not claim universal live revocation, complete coverage of every capability source, or that a trusted workspace is safe.

本对象只分析 Q-20260829-02 的 2026-08-29 已完成 Reading Result。一手证据是 Gemini CLI 已合并变更 `0bd1d439751478771c45d3d0895a6a9760554bf4`：限制性 Trust Signal 具有更高优先级，未解析 Trust 落为 false，Malformed Trust Configuration 直接失败，并且在 Workspace 不可信时从 Effective Configuration 中移除已证明的 Workspace-controlled MCP、Policy、Tool 与 Telemetry 设置。本对象的有界结论只讨论 Admission-time Capability Governance，不声称存在通用 Live Revocation、不声称覆盖所有 Capability Source，也不声称 Trusted Workspace 本身安全。

```yaml
analysis:
  research_questions:
    - id: "RQ1"
      question: "When does workspace trust become an enforceable authority boundary rather than a presentation label?"
      question_zh: "Workspace Trust 何时才从 Presentation Label 变成可执行的 Authority Boundary？"
    - id: "RQ2"
      question: "How should uncertainty and negative trust affect the effective capability surface exposed to an Agent runtime?"
      question_zh: "Uncertainty 与 Negative Trust 应如何改变 Agent Runtime 实际可见的 Capability Surface？"
    - id: "RQ3"
      question: "What additional lifecycle mechanism is needed after admission when trust changes during a running session?"
      question_zh: "当 Running Session 中 Trust 发生变化时，Admission 之后还需要什么 Lifecycle Mechanism？"

  research_themes:
    - "policy enforcement"
    - "capability admission"
    - "workspace trust"
    - "revocation boundary"
  subject_kind:
    - "governance-problem"
    - "architecture-mechanism"
    - "failure-mode"
  samples:
    - "Gemini CLI workspace trust and configuration admission"

  research_value:
    failures:
      - "A trust badge is ineffective governance if repository-controlled configuration can still materialize MCP servers, tools or policy inputs after trust is denied."
      - "Treating unknown trust as trusted turns missing authority evidence into permission."
      - "Policy and Runtime can diverge if they build from different capability surfaces."
    findings:
      - "The demonstrated resolver gives restricted mode and explicit negative environment trust precedence and maps unresolved trust to false."
      - "The untrusted load path removes demonstrated MCP, policy-path, tool and telemetry settings before effective Runtime/policy construction."
      - "The same sanitized MCP surface is used for both policy and Runtime configuration in the covered path."
    mechanisms:
      - "Fail-closed trust resolution"
      - "Trust-source precedence"
      - "Pre-materialization capability filtering"
      - "Shared sanitized policy/Runtime capability surface"
    implications:
      - "Trust should be encoded as an admission decision that changes what capabilities can be constructed, not merely as descriptive metadata."
      - "Live trust revocation remains a separate lifecycle problem because admission-time filtering does not prove already-materialized capabilities are reclaimed."

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "In the demonstrated trust resolver, restricted mode or explicit negative environment trust yields untrusted before a positive environment trust value can authorize the path."
      claim_zh: "在已展示 Trust Resolver 中，Restricted Mode 或显式 Negative Environment Trust 会先得到 Untrusted，Positive Environment Trust 不能越过该限制。"
      source: "research/reading/Q-20260829-02-fail-closed-workspace-trust-capability-surface.md"
      strength: "merged maintainer source-level evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "When no decisive trust source exists, Config.isTrustedFolder ultimately falls back to false; malformed trusted-folder configuration raises a fatal configuration error instead of silently granting trust."
      claim_zh: "当不存在决定性 Trust Source 时，Config.isTrustedFolder 最终回落为 false；Malformed Trusted-folder Configuration 会触发 Fatal Configuration Error，而不是静默授予 Trust。"
      source: "research/reading/Q-20260829-02-fail-closed-workspace-trust-capability-surface.md"
      strength: "implementation and regression-test evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The untrusted configuration path removes mcpServers, policyPaths, adminPolicyPaths, tools and telemetry from the effective settings used by the covered policy and Runtime construction paths."
      claim_zh: "Untrusted Configuration Path 会从已覆盖的 Policy 与 Runtime Construction 使用的 Effective Settings 中移除 mcpServers、policyPaths、adminPolicyPaths、tools 与 telemetry。"
      source: "research/reading/Q-20260829-02-fail-closed-workspace-trust-capability-surface.md"
      strength: "source and regression-test evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Trust becomes a governance control only when its result is coupled to capability admission, so negative or uncertain authority reduces the executable surface before those capabilities are materialized."
      claim_zh: "只有当 Trust Result 与 Capability Admission 绑定时，Trust 才真正成为 Governance Control；Negative 或 Uncertain Authority 应在 Capability Materialization 前缩小 Executable Surface。"
      source: "E1,E2,E3"
      strength: "bounded architecture interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "Admission-time capability reduction and live revocation are different controls: the first governs construction, while the second must reclaim or invalidate capability instances that already exist."
      claim_zh: "Admission-time Capability Reduction 与 Live Revocation 是不同 Control：前者治理 Construction，后者必须回收或使已经存在的 Capability Instance 失效。"
      source: "E3"
      strength: "lifecycle-boundary interpretation"
      independent: false

  observations:
    - "Unknown, denied and malformed trust are kept semantically distinct: unknown falls closed, explicit deny remains deny, and malformed configuration is an error rather than a permission decision."
    - "The most important architectural move is not the boolean fallback itself but feeding that decision into the effective configuration that creates capabilities."
    - "Using the same sanitized MCP value for policy and Runtime reduces a split-brain risk where governance reasons about a narrower surface than execution actually receives."
    - "The source settings remain intact while effective settings are narrowed, preserving provenance without admitting untrusted capabilities."
  observations_zh:
    - "Unknown、Denied 与 Malformed Trust 保持语义分离：Unknown Fail Closed，显式 Deny 仍是 Deny，Malformed Configuration 是 Error 而不是 Permission Decision。"
    - "最重要的 Architecture Move 不只是 Boolean Fallback，而是把这个 Decision 传入真正创建 Capability 的 Effective Configuration。"
    - "Policy 与 Runtime 使用相同 Sanitized MCP Value，降低了 Governance 看到较窄 Surface、Execution 却获得更宽 Surface 的 Split-brain Risk。"
    - "Source Settings 被保留，而 Effective Settings 被收窄，从而在保留 Provenance 的同时不接纳 Untrusted Capability。"

  comparisons:
    - "Display-only trust communicates risk but leaves authority unchanged; admission-coupled trust changes the executable surface."
    - "Fail-open unknown treats absence of authority evidence as permission; fail-closed unknown treats positive trust as something that must be established."
    - "Pre-materialization filtering is cheaper and more deterministic than trying to kill every capability after it has started, but it cannot replace revocation for long-lived sessions."
  comparisons_zh:
    - "Display-only Trust 只能传达风险而不改变 Authority；Admission-coupled Trust 会直接改变 Executable Surface。"
    - "Fail-open Unknown 把缺少 Authority Evidence 等同于 Permission；Fail-closed Unknown 则要求 Positive Trust 必须先被建立。"
    - "Pre-materialization Filtering 比 Capability 启动后再逐个终止更便宜、更确定，但不能替代 Long-lived Session 的 Revocation。"

  contradictions:
    - "Folder-trust-disabled mode is an explicit configured choice to trust, so the implementation is not universally fail-closed against every administrative trust policy."
    - "The demonstrated sanitized fields are material capability inputs, but the evidence does not show that every built-in, extension, credential or host capability is controlled by this same decision."
  contradictions_zh:
    - "Folder-trust-disabled Mode 是显式配置为 Trust 的产品选择，因此实现并非对所有 Administrative Trust Policy 都普遍 Fail Closed。"
    - "已展示被过滤字段确实是重要 Capability Input，但证据没有证明所有 Built-in、Extension、Credential 或 Host Capability 都受同一 Decision 控制。"

  counterarguments:
    - "A system could leave all capabilities materialized and rely on per-call authorization. That may be necessary for some cases, but it increases the number of live objects that must be governed and makes uncertain workspace authority easier to leak into execution."
    - "Stripping telemetry together with executable tools may combine distinct governance concerns; systems may choose separate policies for observation and action capability."
    - "A positive trust decision cannot establish that workspace content is benign; it only permits the configured trust policy to admit the covered capability surface."
  counterarguments_zh:
    - "系统可以让所有 Capability 都先 Materialize，再依赖 Per-call Authorization；某些场景确实需要这样做，但这会增加必须治理的 Live Object 数量，也更容易让 Uncertain Workspace Authority 泄漏到 Execution。"
    - "把 Telemetry 与 Executable Tool 一起剥离可能合并了不同 Governance Concern；系统可以分别治理 Observation Capability 与 Action Capability。"
    - "Positive Trust Decision 不能证明 Workspace Content 无害；它只表示当前配置的 Trust Policy 允许接纳已覆盖的 Capability Surface。"

  research_judgment: "Workspace trust becomes an enforceable Agent-governance boundary when it participates directly in capability admission. The Gemini CLI evidence demonstrates a bounded pattern: restrictive evidence dominates, unresolved trust fails closed, malformed trust configuration does not silently grant permission, and the untrusted path narrows the effective MCP/policy/tool/telemetry surface before Runtime construction. The important architecture principle is therefore trust-to-capability coupling, not a trust label. The claim must remain admission-time and field-bounded; already-running capabilities, capability sources outside the sanitized settings, and the safety of trusted content require separate controls."
  research_judgment_zh: "当 Workspace Trust 直接参与 Capability Admission 时，它才成为可执行的 Agent Governance Boundary。Gemini CLI 证据展示了一种有界模式：Restrictive Evidence 优先，Unresolved Trust Fail Closed，Malformed Trust Configuration 不会静默授予 Permission，Untrusted Path 会在 Runtime Construction 前收窄 Effective MCP/Policy/Tool/Telemetry Surface。因此核心 Architecture Principle 是 Trust-to-capability Coupling，而不是一个 Trust Label。该结论必须限制在 Admission-time 与已覆盖字段范围内；Already-running Capability、Sanitized Settings 之外的 Capability Source，以及 Trusted Content 的安全性都需要独立 Control。"

  general_implications:
    - "Digital-employee workspaces should make trust decisions observable inputs to capability construction rather than UI-only state."
    - "Unknown authority should normally reduce the admitted capability surface until stronger trust evidence appears."
    - "Policy evaluation and Runtime construction should consume the same effective capability inventory or share a verifiable generation identity."
    - "Long-lived sessions need a separate revocation/reconciliation path that invalidates already-materialized capabilities when trust changes."
  general_implications_zh:
    - "数字员工 Workspace 应让 Trust Decision 成为 Capability Construction 的可观察输入，而不是仅 UI State。"
    - "Unknown Authority 通常应缩小 Admitted Capability Surface，直到出现更强 Trust Evidence。"
    - "Policy Evaluation 与 Runtime Construction 应消费同一 Effective Capability Inventory，或共享可核验的 Generation Identity。"
    - "Long-lived Session 需要独立 Revocation/Reconciliation Path，在 Trust 变化时使 Already-materialized Capability 失效。"

  limitations:
    - "Evidence is one merged Gemini CLI implementation and tests; there is no independent reproduction in this object."
    - "The demonstrated guarantee is configuration-time admission, not universal dynamic revocation."
    - "The sanitization does not establish complete coverage of every capability source."
    - "The trust result is local Runtime evidence, not a signed cross-host authorization receipt."
  limitations_zh:
    - "证据来自一个已合并 Gemini CLI 实现及其测试；本对象没有 Independent Reproduction。"
    - "已展示保证属于 Configuration-time Admission，而不是通用 Dynamic Revocation。"
    - "Sanitization 不能证明覆盖所有 Capability Source。"
    - "Trust Result 是 Local Runtime Evidence，不是 Signed Cross-host Authorization Receipt。"

  open_questions:
    - "What generation or receipt should bind a capability instance to the trust decision that admitted it?"
    - "How should live MCP/tool objects be reconciled when trust changes from true to false?"
    - "Which user/admin capability sources should remain available when repository-scoped trust is denied?"
    - "Should observation capabilities such as telemetry be governed separately from action capabilities?"
  open_questions_zh:
    - "什么 Generation 或 Receipt 应把 Capability Instance 绑定到当初接纳它的 Trust Decision？"
    - "Trust 从 true 变为 false 时，Live MCP/Tool Object 应如何 Reconcile？"
    - "Repository-scoped Trust 被拒绝后，哪些 User/Admin Capability Source 仍应保留？"
    - "Telemetry 等 Observation Capability 是否应与 Action Capability 分开治理？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "evidence", "technical-analysis", "architecture-implications", "governance-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The finding is a general workspace-trust and capability-admission architecture pattern and does not require first-party project mapping."
    rationale_zh: "该发现属于通用 Workspace-trust 与 Capability-admission Architecture Pattern，不需要映射自有项目。"
```

## Bounded judgment / 有界判断

The strongest pattern here is **uncertain authority should change the capability surface before execution, not merely change a status label**. That is a concrete admission boundary. Revoking a capability that already exists remains a separate lifecycle responsibility.

这里最强的模式是：**Uncertain Authority 应在执行前改变 Capability Surface，而不只是改变一个 Status Label**。这构成具体 Admission Boundary；已经存在的 Capability 如何撤销，仍是另一项 Lifecycle Responsibility。
