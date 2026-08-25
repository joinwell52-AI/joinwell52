---
schema: "research-analysis/v1"
id: "AN-20260825-01"
date: "2026-08-25"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260825-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260825-01-credential-broker-project-config-isolation.md"
output_contract: "Research Object"
research_object: "Sensitive Configuration Needs an Explicit Authority Boundary, Not Precedence Alone"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Sensitive Configuration Needs an Explicit Authority Boundary, Not Precedence Alone

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-25 Reading Result for Q-20260825-01. The evidence is a merged Codex maintainer change showing that, when credential brokering is effectively enabled, the project-controlled layer loses authority over specified broker/provider environment keys and shell-startup settings. The conclusion is bounded to layered configuration governance and the demonstrated project layer; it does not establish universal credential isolation, secret non-exfiltration, or isolation from user/host/process-level inputs.

本对象仅分析 Q-20260825-01 的 2026-08-25 已完成 Reading Result。证据来自 Codex 已合并维护者变更：当 Credential Brokering 实际启用时，项目控制层不再拥有对特定 Broker/Provider 环境键与 Shell Startup Setting 的控制权。结论仅限于分层配置治理及已证明的项目层边界；它不能证明通用 Credential Isolation、Secret Non-exfiltration，也不能证明 User/Host/Process 层输入均被隔离。

```yaml
analysis:
  research_question: "When a security-sensitive runtime component becomes authoritative for credential-provider state, how should a layered configuration system prevent a lower-trust project layer from regaining control through ordinary precedence rules?"
  research_question_zh: "当安全敏感 Runtime Component 开始对 Credential-provider State 拥有权威控制时，分层配置系统应如何防止较低信任的项目层通过普通 Precedence Rule 重新取得控制？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The merged Codex change distinguishes unconfigured, disabled and enabled credential-broker states and applies project-layer hardening only when brokering is effectively enabled."
      claim_zh: "已合并 Codex 变更区分 Unconfigured、Disabled 与 Enabled Credential-broker State，并且只在 Brokering 实际启用时应用项目层 Hardening。"
      source: "research/reading/Q-20260825-01-credential-broker-project-config-isolation.md"
      strength: "direct merged-code evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "In the enabled branch, project-level shell snapshot/profile controls and protected provider/startup environment keys including ZDOTDIR and BASH_ENV are removed from the project-controlled layer."
      claim_zh: "在 Enabled 分支中，项目级 Shell Snapshot/Profile 控制以及包括 ZDOTDIR、BASH_ENV 在内的受保护 Provider/Startup 环境键会从项目控制层移除。"
      source: "research/reading/Q-20260825-01-credential-broker-project-config-isolation.md"
      strength: "direct implementation evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The disabled branch preserves ordinary project shell configuration, so the restriction is tied to effective broker authority rather than applied as a global denylist."
      claim_zh: "Disabled 分支保留普通项目 Shell Configuration，因此限制与 Broker 的实际权威状态绑定，而不是一个全局 Denylist。"
      source: "research/reading/Q-20260825-01-credential-broker-project-config-isolation.md"
      strength: "direct branch and regression evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "For security-sensitive configuration, precedence is insufficient when it lets a lower-trust layer continue to participate in a decision owned by a higher-authority component; the ownership boundary itself must remove that decision surface from the lower layer."
      claim_zh: "对于安全敏感配置，如果普通 Precedence 仍允许较低信任层参与一个已经由更高 Authority Component 拥有的决策，那么 Precedence 本身不够；Ownership Boundary 必须把该决策面从低层直接移除。"
      source: "E1,E2,E3"
      strength: "bounded configuration-governance interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "The demonstrated mechanism supports monotonic authority at one project/configuration boundary, not universal isolation of credential state across every source or execution phase."
      claim_zh: "已证明机制支持一个项目/配置边界上的 Monotonic Authority，但不能推出 Credential State 在所有来源与执行阶段都实现通用隔离。"
      source: "E2,E3"
      strength: "bounded evidence-boundary interpretation"
      independent: false

  observations:
    - "The important change is not merely that some keys are denied; it is that effective broker state changes who is allowed to configure those inputs."
    - "The disabled path matters because it shows the restriction follows authority ownership rather than permanently weakening project configurability."
    - "A protected-key classifier creates an explicit maintenance obligation: newly introduced provider inputs must enter the owned set or the boundary can become incomplete."
  observations_zh:
    - "关键变化并不只是某些 Key 被拒绝，而是 Effective Broker State 改变了谁有权配置这些输入。"
    - "Disabled Path 很重要，因为它说明限制跟随 Authority Ownership，而不是永久削弱项目配置能力。"
    - "Protected-key Classifier 带来显式维护义务：新增 Provider Input 必须进入受保护集合，否则边界可能逐渐不完整。"

  comparisons:
    - "Ordinary last-writer or highest-precedence configuration allows every participating layer to remain part of the decision surface; ownership transfer removes sensitive decisions from lower-trust participation entirely."
    - "A global denylist is simpler but can unnecessarily suppress legitimate settings when the broker is inactive; state-dependent ownership is narrower and better aligned with the actual authority boundary."
  comparisons_zh:
    - "普通 Last-writer 或 Highest-precedence Configuration 让所有参与层仍处于决策面；Ownership Transfer 则把敏感决策彻底移出较低信任层的参与范围。"
    - "全局 Denylist 更简单，但 Broker 未启用时可能不必要地压制合法设置；State-dependent Ownership 更窄，也更符合真实 Authority Boundary。"

  counterarguments:
    - "Some deployments may intentionally permit managed or user-level configuration to influence the broker; the evidence does not say all non-project layers should be removed."
    - "Filtering enumerated keys can drift as providers evolve, so the authority model still needs a maintained classifier or a stronger typed ownership contract."
    - "Preventing project-layer configuration of provider inputs does not prevent disclosure after a credential has legitimately been issued."
  counterarguments_zh:
    - "某些部署可能有意允许 Managed 或 User-level Configuration 影响 Broker；现有证据并未说明所有非项目层都应被移除。"
    - "随着 Provider 演进，枚举式 Key Filtering 可能发生漂移，因此 Authority Model 仍需要持续维护的 Classifier 或更强的 Typed Ownership Contract。"
    - "阻止项目层配置 Provider Input，并不能阻止凭据在合法签发之后被泄露。"

  research_judgment: "Security-sensitive layered configuration should model authority ownership separately from value precedence. When an effective runtime policy transfers control of provider/startup inputs to a credential broker, a lower-trust project layer should no longer be allowed to widen or redirect those owned inputs merely by supplying a competing value. The selected Codex change demonstrates this bounded monotonic-authority pattern at the project layer. It does not prove universal credential isolation, secret non-exfiltration, or isolation from every higher configuration source."
  research_judgment_zh: "安全敏感的分层配置应把 Authority Ownership 与 Value Precedence 分开建模。当有效 Runtime Policy 把 Provider/Startup Input 的控制权交给 Credential Broker 后，较低信任的项目层不应仅通过提供竞争值就重新扩大或重定向这些已归属 Broker 的输入。所选 Codex 变更在项目层证明了这一有界的 Monotonic-authority Pattern；它不能证明通用 Credential Isolation、Secret Non-exfiltration，也不能证明所有更高层配置源均被隔离。"

  general_implications:
    - "Configuration systems for agent runtimes should record which layer owns a sensitive decision, not only which value won precedence."
    - "Effective authority should be recomputed on reload/resume before lower-layer configuration is reapplied."
    - "Suppressed lower-layer inputs should be observable as policy events without logging secret values."
    - "Owned-key registries need explicit evolution and regression coverage as credential providers add new inputs."
  general_implications_zh:
    - "Agent Runtime 配置系统应记录哪个层拥有敏感决策，而不仅是哪个值赢得 Precedence。"
    - "Reload/Resume 时，应先重新计算 Effective Authority，再应用低层配置。"
    - "被抑制的低层输入应作为 Policy Event 可观测，但不得记录 Secret Value。"
    - "随着 Credential Provider 新增输入，Owned-key Registry 需要显式演进与 Regression Coverage。"

  limitations:
    - "Evidence is one merged maintainer implementation and tests, not independent cross-runtime validation."
    - "The demonstrated boundary is project configuration while brokering is enabled; host, user, managed-policy and process-level sources are outside the proven scope."
    - "The protected set is implementation-defined and can become incomplete as new provider variables appear."
    - "No evidence establishes transactional shell execution, end-to-end non-exfiltration or post-issuance secret containment."
  limitations_zh:
    - "证据来自一个已合并维护者实现及其测试，并非跨 Runtime 的独立验证。"
    - "已证明边界仅是 Brokering 启用时的项目配置；Host、User、Managed-policy 与 Process-level 来源不在已证明范围内。"
    - "受保护集合由实现定义，未来新增 Provider Variable 时可能变得不完整。"
    - "没有证据建立 Transactional Shell Execution、端到端 Non-exfiltration 或凭据签发后的 Secret Containment。"

  open_questions:
    - "Should sensitive configuration ownership be represented as typed capabilities instead of a growing protected-key list?"
    - "Which higher configuration layers remain intentionally authorized to influence broker state?"
    - "How should reload/resume prove that the current effective broker state was recomputed before applying project configuration?"
    - "Can suppressed settings be audited without exposing their values?"
  open_questions_zh:
    - "敏感配置 Ownership 是否应使用 Typed Capability 表达，而不是持续增长的 Protected-key List？"
    - "哪些更高配置层仍被有意授权影响 Broker State？"
    - "Reload/Resume 如何证明在应用项目配置之前已经重新计算当前 Effective Broker State？"
    - "被抑制设置能否在不暴露其值的前提下被审计？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "evidence", "technical-analysis", "governance-implications", "engineering-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment is a general layered-configuration authority pattern and does not require a first-party project to establish it."
    rationale_zh: "该判断属于一般分层配置 Authority Pattern，不需要引入自有项目才能成立。"
```

## Bounded judgment / 有界判断

The central distinction is **configuration precedence is not configuration authority**. Once a security-sensitive component owns a decision, lower-trust configuration should not remain able to participate in that decision merely because the merge algorithm knows how to rank values. The evidence demonstrates that boundary for a defined project layer and protected broker inputs, not for every credential source or every stage of credential use.

核心区别是：**Configuration Precedence 不等于 Configuration Authority**。当一个安全敏感组件已经拥有某项决策后，较低信任配置层不应仅因为 Merge Algorithm 能够比较值的优先级，就继续参与该决策。现有证据证明的是一个明确项目层与受保护 Broker Input 的边界，而不是所有 Credential Source 或 Credential 使用阶段的通用隔离。
