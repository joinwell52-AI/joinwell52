---
schema: "research-analysis/v1"
id: "AN-20260820-01"
date: "2026-08-20"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260820-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260820-01-git-effective-execution-approval-boundary.md"
output_contract: "Research Object"
research_object: "Effective Execution Authority Beyond Nominal Command Identity"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Effective Execution Authority Beyond Nominal Command Identity

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-20 Reading Result for Q-20260820-01. The merged Codex code and regression tests establish that lexical command identity is insufficient for Git because repository configuration can redirect nominally read-only operations into helper execution; the implementation therefore removes Git from a known-safe shortcut and leaves execution authority to approval policy and explicit execution rules. The broader conclusions below are bounded architectural interpretations for digital employees and agent runtimes, not proof that every Git command is unsafe or that approval alone contains every side effect.

本对象仅分析 Q-20260820-01 的 2026-08-20 已完成 Reading Result。Codex 的已合并代码与回归测试表明：对 Git 而言，仅凭命令词法身份不足以判断安全性，因为仓库配置可能把名义上的只读操作重定向为 Helper Execution；因此实现把 Git 移出 Known-safe Shortcut，并把实际执行权交回 Approval Policy 与显式 Execution Rule。下述更广泛结论属于对数字员工与 Agent Runtime 的有界架构解释，并不证明所有 Git 命令都不安全，也不证明 Approval 本身能够约束所有外部副作用。

```yaml
analysis:
  research_question: "When the visible action name does not fully determine what will execute, what evidence should a digital employee use before treating an action as authorized?"
  research_question_zh: "当可见 Action Name 不能完整决定实际会执行什么时，数字员工在把一次动作视为已授权之前，应依据什么证据？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The merged Codex change removes Git from Unix and Windows known-safe command classification because repository configuration can cause nominally read-only Git operations to execute helpers."
      claim_zh: "已合并的 Codex 变更把 Git 从 Unix 与 Windows 的 Known-safe Command Classification 中移除，理由是仓库配置可能使名义只读的 Git 操作执行 Helper。"
      source: "research/reading/Q-20260820-01-git-effective-execution-approval-boundary.md"
      strength: "direct merged-code and regression-test evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Under UnlessTrusted, plain git status reaches NeedsApproval unless an explicit execution-policy rule authorizes it; OnRequest retains different policy semantics."
      claim_zh: "在 UnlessTrusted 下，普通 git status 会进入 NeedsApproval，除非显式 Execution-policy Rule 授权；OnRequest 仍保持不同的策略语义。"
      source: "research/reading/Q-20260820-01-git-effective-execution-approval-boundary.md"
      strength: "direct regression-test evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "Absolute-path tests distinguish a declared host executable covered by policy from another unmatched Git path, so command spelling alone is not the complete policy identity."
      claim_zh: "Absolute-path 回归测试区分了由 Policy 覆盖的已声明 Host Executable 与另一条未匹配 Git 路径，因此命令拼写本身并不是完整 Policy Identity。"
      source: "research/reading/Q-20260820-01-git-effective-execution-approval-boundary.md"
      strength: "direct regression-test evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "The end-to-end regression reaches a human approval request and preserves denial as the command result, demonstrating that known-safe classification and execution authorization are separate stages."
      claim_zh: "端到端回归实际进入 Human Approval Request，并把 Denial 保留为命令结果，证明 Known-safe Classification 与 Execution Authorization 是不同阶段。"
      source: "research/reading/Q-20260820-01-git-effective-execution-approval-boundary.md"
      strength: "direct integration-test evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Digital-employee authorization should bind to effective execution identity and context, not merely to a nominal action label; lexical safety is only one input to admission."
      claim_zh: "数字员工授权应绑定 Effective Execution Identity 与执行上下文，而不能只绑定名义 Action Label；Lexical Safety 只能是 Admission 的一个输入。"
      source: "E1,E2,E3,E4"
      strength: "bounded architectural interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "A safe execution contract should separate action intent, effective executable/context, policy decision and effect containment, because approval of one layer does not establish the others."
      claim_zh: "安全执行契约应分离 Action Intent、Effective Executable/Context、Policy Decision 与 Effect Containment，因为其中一层获得 Approval 并不能证明其他层。"
      source: "E1,E2,E3,E4"
      strength: "bounded governance interpretation"
      independent: false

  observations:
    - "The change is fail-closed at the classifier boundary: Git loses an automatic safe shortcut, but later policy still decides whether execution is allowed."
    - "The tested difference between UnlessTrusted, OnRequest and explicit allow rules shows that classification is evidence for authority, not authority itself."
    - "Executable path and repository configuration make effective execution context richer than the visible argv shown to a user or agent."
    - "Human approval remains meaningful only if the reviewer receives enough evidence about the effective execution being authorized."
  observations_zh:
    - "该变更在 Classifier Boundary 上 Fail-closed：Git 失去自动 Safe Shortcut，但后续 Policy 仍决定是否允许执行。"
    - "UnlessTrusted、OnRequest 与显式 Allow Rule 的测试差异说明 Classification 是 Authority Evidence，而不是 Authority 本身。"
    - "Executable Path 与 Repository Configuration 使 Effective Execution Context 比用户或 Agent 看到的表面 argv 更丰富。"
    - "只有 Reviewer 能获得足够的 Effective Execution Evidence 时，Human Approval 才真正有意义。"

  comparisons:
    - "A lexical allowlist is cheap and deterministic but fails when configuration can redirect effective execution."
    - "An always-ask policy reduces silent execution but discards intentional policy modes and still does not describe the actual side effects."
    - "Context-bound execution policy preserves automation while requiring explicit authority for actions that cannot be proven safe from syntax alone."
  comparisons_zh:
    - "Lexical Allowlist 成本低且确定，但当配置能够重定向 Effective Execution 时会失效。"
    - "Always-ask Policy 可以减少静默执行，却会丢失有意设计的策略模式，而且仍不能描述真实 Side Effect。"
    - "Context-bound Execution Policy 可以保留自动化，同时要求无法仅凭语法证明安全的动作获得显式 Authority。"

  counterarguments:
    - "For tightly controlled immutable environments, lexical classification may still be an efficient optimization when effective execution is independently constrained."
    - "Adding more approval prompts can create fatigue; a stronger boundary must therefore improve evidence quality rather than merely increase confirmation frequency."
    - "Path-aware policy still does not prove binary provenance, repository configuration integrity or the behavior of helpers launched after approval."
  counterarguments_zh:
    - "在严格受控且不可变的环境中，如果 Effective Execution 已被其他机制独立约束，Lexical Classification 仍可能是有效优化。"
    - "增加 Approval Prompt 可能造成疲劳，因此更强边界应提升 Evidence Quality，而不只是增加确认次数。"
    - "Path-aware Policy 仍不能证明 Binary Provenance、Repository Configuration Integrity 或 Approval 后 Helper 的行为。"

  research_judgment: "For digital employees, an action name should be treated as intent evidence rather than execution authority. When configuration, wrappers or environment can change what actually runs, admission should bind the decision to an effective-execution identity that includes the executable/context and the governing policy. Human or automated approval then authorizes that bounded execution decision; it should not be promoted into a claim that all downstream effects are contained."
  research_judgment_zh: "对数字员工而言，Action Name 应被视为 Intent Evidence，而不是 Execution Authority。当 Configuration、Wrapper 或 Environment 能改变实际执行内容时，Admission 应把决策绑定到包含 Executable/Context 与 Governing Policy 的 Effective-execution Identity。真人或自动 Approval 只授权这一有界执行决策，不应被提升为“所有后续 Effect 均已受控”的结论。"

  general_implications:
    - "Digital-employee runtimes should record nominal intent and effective execution identity as separate audit facts."
    - "Known-safe classifiers should fail closed when behavior depends on mutable local configuration that the classifier cannot observe."
    - "Execution-policy rules should be versioned and attributable because they are explicit authority channels, not convenience metadata."
    - "Approval interfaces should expose the evidence that materially changes execution, such as executable identity, relevant policy rule and configuration-driven helper risk."
    - "Effect containment, sandboxing and external reconciliation should remain separate gates after execution admission."
  general_implications_zh:
    - "数字员工 Runtime 应把 Nominal Intent 与 Effective Execution Identity 作为两个独立 Audit Fact。"
    - "当行为依赖 Classifier 无法观察的可变本地配置时，Known-safe Classifier 应 Fail-closed。"
    - "Execution-policy Rule 是显式 Authority Channel，而不是便利 Metadata，因此应可版本化并可归责。"
    - "Approval 界面应展示真正改变执行的证据，例如 Executable Identity、相关 Policy Rule 与 Configuration-driven Helper Risk。"
    - "Effect Containment、Sandboxing 与 External Reconciliation 应在 Execution Admission 之后继续保持独立 Gate。"

  limitations:
    - "Evidence is one merged Codex implementation and its tests, not an independent evaluation across agent runtimes."
    - "The evidence does not enumerate every Git configuration or helper mechanism that can redirect execution."
    - "It does not prove that an explicit allow rule is correctly governed or that approval decisions are informed."
    - "It does not establish sandbox, binary provenance or external-effect guarantees."
  limitations_zh:
    - "证据来自一个已合并 Codex 实现及其测试，而不是跨 Agent Runtime 的独立评估。"
    - "证据没有枚举所有可能重定向执行的 Git Configuration 或 Helper Mechanism。"
    - "它没有证明显式 Allow Rule 得到正确治理，也没有证明 Approval Decision 一定充分知情。"
    - "它没有建立 Sandbox、Binary Provenance 或 External-effect Guarantee。"

  open_questions:
    - "What minimum effective-execution evidence should be attached to an approval request?"
    - "Can policy identity include repository configuration digest or helper-chain evidence without making every action prohibitively expensive?"
    - "How should explicit execution-policy rules expire or be re-qualified when repository state changes?"
    - "Which other nominally read-only tools have configuration-driven execution paths that should invalidate lexical safe shortcuts?"
  open_questions_zh:
    - "Approval Request 最少应附带哪些 Effective-execution Evidence？"
    - "Policy Identity 能否纳入 Repository Configuration Digest 或 Helper-chain Evidence，而不让每次执行成本过高？"
    - "Repository State 改变时，显式 Execution-policy Rule 应如何过期或重新资格判断？"
    - "还有哪些名义只读工具存在 Configuration-driven Execution Path，需要取消 Lexical Safe Shortcut？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence", "technical-analysis", "governance-implications", "engineering-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment is a general execution-governance pattern for digital employees and agent runtimes and does not require a first-party project to establish it."
    rationale_zh: "该判断属于数字员工与 Agent Runtime 的一般 Execution Governance Pattern，不需要引入任何自有项目才能成立。"
```

## Bounded judgment / 有界判断

The useful distinction is not “safe command versus unsafe command,” but **nominal intent versus effective execution authority**. The source demonstrates why syntax alone can become stale evidence when configuration changes execution. It does not demonstrate that every Git command requires the same treatment under every policy or that approval substitutes for containment.

真正有用的区分不是“安全命令与不安全命令”，而是 **Nominal Intent 与 Effective Execution Authority**。来源证明了当 Configuration 能改变执行时，单纯 Syntax 为什么会变成陈旧证据；但它没有证明所有 Policy 下的所有 Git 命令都应得到同一处理，也没有证明 Approval 可以替代 Effect Containment。
