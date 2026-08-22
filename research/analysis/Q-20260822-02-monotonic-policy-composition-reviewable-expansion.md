---
schema: "research-analysis/v1"
id: "AN-20260822-02"
date: "2026-08-22"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260822-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260822-02-monotonic-remote-network-policy-composition.md"
output_contract: "Research Object"
research_object: "Protected Constraints Must Compose Monotonically While Expansion Remains Explicitly Reviewable"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Protected Constraints Must Compose Monotonically While Expansion Remains Explicitly Reviewable

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-22 Reading Result for Q-20260822-02. The merged Codex evidence concerns remote-execution **network** policy: attachment-owned traffic restrictions are composed with controller constraints and saved decisions; protected denials and strict allowlist ceilings are preserved; reviewable paths can intentionally expand access under policy. The conclusions below generalize only the composition pattern, not a claim that every remote-execution capability is non-expandable.

本对象仅分析 Q-20260822-02 的 2026-08-22 已完成 Reading Result。Codex 已合并证据针对 Remote Execution 的 **Network Policy**：Attachment-owned Traffic Restriction 与 Controller Constraint、Saved Decision 进行组合；Protected Denial 与 Strict Allowlist Ceiling 被保留；Reviewable Path 可以在 Policy 允许时有意扩张 Access。下述结论只推广这一 Composition Pattern，并不声称所有 Remote-execution Capability 都不可扩张。

```yaml
analysis:
  research_question: "How should a remote execution architecture combine policies owned by different authorities so that protected constraints cannot be weakened while explicitly reviewable access can still expand under governance?"
  research_question_zh: "Remote Execution Architecture 应如何组合不同 Authority 所拥有的 Policy，使 Protected Constraint 不会被削弱，同时又允许在明确 Governance 下对可 Review 的 Access 进行扩张？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "Merged Codex code composes EnvironmentNetworkPolicy with controller constraints instead of letting attachment policy control proxy runtime authority wholesale."
      claim_zh: "Codex 已合并代码会把 EnvironmentNetworkPolicy 与 Controller Constraint 组合，而不是让 Attachment Policy 整体控制 Proxy Runtime Authority。"
      source: "research/reading/Q-20260822-02-monotonic-remote-network-policy-composition.md"
      strength: "direct merged-code evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Inherited controller domain denials and protected denials are restored after owner rules and saved decisions; Unix-socket permissions and permissive booleans are intersected so protected denial remains dominant."
      claim_zh: "Inherited Controller Domain Denial 与 Protected Denial 会在 Owner Rule 与 Saved Decision 之后重新恢复；Unix-socket Permission 与 Permissive Boolean 通过交集组合，使 Protected Denial 保持优先。"
      source: "research/reading/Q-20260822-02-monotonic-remote-network-policy-composition.md"
      strength: "merged implementation evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "Strict attachment allowlists and fixed controller ceilings suppress approval-based expansion, while saved grants are admitted only on policy paths that remain reviewable."
      claim_zh: "Strict Attachment Allowlist 与 Fixed Controller Ceiling 会抑制 Approval-based Expansion，而 Saved Grant 只会在仍然可 Review 的 Policy Path 上被接纳。"
      source: "research/reading/Q-20260822-02-monotonic-remote-network-policy-composition.md"
      strength: "merged code and test evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "Tool orchestration rejects sandbox escalation when it would bypass attachment-owned network policy, and the resulting effective proxy policy is validated after composition."
      claim_zh: "当 Sandbox Escalation 会绕过 Attachment-owned Network Policy 时，Tool Orchestration 会拒绝该升级；组合后的 Effective Proxy Policy 还会再次验证。"
      source: "research/reading/Q-20260822-02-monotonic-remote-network-policy-composition.md"
      strength: "merged implementation and regression-test evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Multi-owner policy composition should be monotonic with respect to protected constraints: later policy layers may preserve or narrow a protected ceiling but must not silently erase it."
      claim_zh: "Multi-owner Policy Composition 对 Protected Constraint 应满足单调性：后续 Policy Layer 可以保留或收紧 Protected Ceiling，但不能静默擦除它。"
      source: "E1,E2,E3,E4"
      strength: "bounded architecture interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "Legitimate expansion should be represented as a separate reviewable transition rather than hidden inside merge precedence; effective policy should therefore distinguish immutable ceilings from governed expansion points."
      claim_zh: "合法 Expansion 应表示为独立的可 Review Transition，而不是隐藏在 Merge Precedence 中；因此 Effective Policy 应区分 Immutable Ceiling 与 Governed Expansion Point。"
      source: "E2,E3,E4"
      strength: "bounded governance interpretation"
      independent: false

  observations:
    - "The merge is intentionally asymmetric: protected denies are restored, while grants survive only under compatibility and review rules."
    - "The architecture separates policy ownership from runtime implementation authority; an attachment can constrain traffic without gaining control over credentials, listeners or proxy mode."
    - "Strict and reviewable policy modes are materially different governance states, not merely different allowlist values."
    - "Post-composition validation matters because correct individual policy fragments do not guarantee a valid combined effective policy."
  observations_zh:
    - "该 Merge 有意采用非对称设计：Protected Deny 会被恢复，而 Grant 只有在兼容性与 Review Rule 满足时才能保留。"
    - "架构分离 Policy Ownership 与 Runtime Implementation Authority；Attachment 可以约束 Traffic，而不因此取得 Credentials、Listeners 或 Proxy Mode 的控制权。"
    - "Strict 与 Reviewable Policy Mode 是不同的 Governance State，而不只是不同 Allowlist Value。"
    - "Post-composition Validation 很重要，因为单个正确的 Policy Fragment 并不保证组合后的 Effective Policy 仍然有效。"

  comparisons:
    - "Union-style allow composition is simple but lets any participating layer widen authority and can erase the meaning of an owner ceiling."
    - "Pure intersection maximizes non-expansion but cannot represent legitimate reviewed exceptions where policy intentionally permits additional access."
    - "A two-plane design—protected constraints plus an explicit review channel for permitted expansion—preserves fixed ceilings without pretending that all access must monotonically decrease."
  comparisons_zh:
    - "Union-style Allow Composition 虽然简单，却会让任意参与 Layer 扩大 Authority，并可能抹去 Owner Ceiling 的意义。"
    - "纯 Intersection 可以最大化 Non-expansion，却无法表达 Policy 有意允许的 Legitimate Reviewed Exception。"
    - "采用 Protected Constraint + 显式 Review Channel 的双平面设计，可以保留 Fixed Ceiling，同时不假装所有 Access 都只能单调下降。"

  counterarguments:
    - "Some systems deliberately delegate full policy ownership to the environment, in which case preserving controller constraints may be the wrong authority model."
    - "Restoring denials after every merge can become difficult to reason about if protected constraints are not explicitly typed and their ownership is ambiguous."
    - "Reviewable expansion introduces its own risk if saved grants are stale, too broadly scoped or insufficiently invalidated when environment identity changes."
  counterarguments_zh:
    - "有些系统会有意把完整 Policy Ownership 委派给 Environment，此时强制保留 Controller Constraint 可能并不是正确 Authority Model。"
    - "如果 Protected Constraint 没有显式类型且 Ownership 模糊，每次 Merge 后恢复 Denial 可能会让推理变得困难。"
    - "如果 Saved Grant 过期、Scope 过宽，或 Environment Identity 改变时没有充分失效，Reviewable Expansion 本身也会引入风险。"

  research_judgment: "For multi-owner remote execution, policy composition should be monotonic on explicitly protected constraints and explicit about every permitted expansion path. Denials and non-expandable ceilings should survive later layers by typed intersection or restoration, while legitimate grants should enter through a reviewable transition with defined scope and invalidation. The effective policy should be validated after composition, and privilege escalation must not create an alternate path around owner constraints. This is a network-policy pattern, not proof that all remote capabilities are globally non-expandable."
  research_judgment_zh: "对于 Multi-owner Remote Execution，Policy Composition 应对显式 Protected Constraint 保持单调，并对每一条允许的 Expansion Path 保持显式。Denial 与 Non-expandable Ceiling 应通过 Typed Intersection 或 Restoration 穿过后续 Layer；Legitimate Grant 则应通过具有明确 Scope 与 Invalidation 的可 Review Transition 进入。组合后的 Effective Policy 必须再次验证，而且 Privilege Escalation 不能形成绕过 Owner Constraint 的替代路径。这是一种 Network-policy Pattern，不是所有 Remote Capability 全局不可扩张的证明。"

  general_implications:
    - "Policy schemas should identify which fields are ceilings, which are reviewable grants and which authority owns each field."
    - "Merge order should be documented as governance semantics, not treated as an implementation detail."
    - "Saved approvals need identity, scope and invalidation rules tied to the policy/environment version they can expand."
    - "Escalation paths must be checked against the same effective policy, otherwise a secondary execution mode can bypass the primary constraint plane."
    - "Testing should include adversarial policy combinations, not only isolated policy correctness."
  general_implications_zh:
    - "Policy Schema 应标识哪些 Field 是 Ceiling、哪些是 Reviewable Grant，以及每个 Field 由哪个 Authority 拥有。"
    - "Merge Order 应作为 Governance Semantics 被文档化，而不是被当作实现细节。"
    - "Saved Approval 需要绑定其可扩张 Policy/Environment Version 的 Identity、Scope 与 Invalidation Rule。"
    - "Escalation Path 必须受同一 Effective Policy 检查，否则 Secondary Execution Mode 可能绕过 Primary Constraint Plane。"
    - "测试应覆盖对抗性的 Policy Combination，而不只是单个 Policy 的正确性。"

  limitations:
    - "Evidence covers Codex network-policy composition and related sandbox escalation, not filesystem, process, credential or application authorization."
    - "Reviewable policy can intentionally expand access, so monotonicity applies only to declared protected constraints."
    - "The design depends on correct domain/socket normalization and accurate controller constraints."
    - "The reading does not establish the persistence scope or invalidation completeness of every saved network decision."
  limitations_zh:
    - "证据覆盖 Codex Network-policy Composition 与相关 Sandbox Escalation，不覆盖 Filesystem、Process、Credential 或 Application Authorization。"
    - "Reviewable Policy 可以有意扩张 Access，因此单调性只适用于声明为 Protected 的 Constraint。"
    - "该设计依赖正确的 Domain/Socket Normalization 与准确的 Controller Constraint。"
    - "Reading 没有建立所有 Saved Network Decision 的 Persistence Scope 或 Invalidation 完整性。"

  open_questions:
    - "How should saved grants be versioned and invalidated when owner policy or environment identity changes?"
    - "Can protected-constraint ownership be represented declaratively enough to make merge behavior mechanically verifiable?"
    - "Which non-network capability classes can use the same protected-ceiling/reviewable-expansion pattern without overgeneralization?"
    - "How should running executions react when controller constraints change after an effective policy has already been materialized?"
  open_questions_zh:
    - "当 Owner Policy 或 Environment Identity 改变时，Saved Grant 应如何 Version 与 Invalidate？"
    - "Protected-constraint Ownership 能否被足够声明式地表示，从而使 Merge Behavior 可以机械验证？"
    - "哪些非 Network Capability Class 可以使用同样的 Protected-ceiling / Reviewable-expansion Pattern，而不会过度推广？"
    - "当 Effective Policy 已经 Materialize 后 Controller Constraint 又发生变化，运行中的 Execution 应如何响应？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "context", "evidence", "technical-analysis", "architecture-implications", "governance-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment concerns general multi-owner policy composition for remote execution; no first-party project is needed for the conclusion."
    rationale_zh: "该判断讨论 Remote Execution 的一般 Multi-owner Policy Composition，不需要引入自有项目才能成立。"
```

## Bounded judgment / 有界判断

The useful architectural distinction is **protected constraint composition versus governed expansion**. A secure merge is not simply “deny always wins” or “intersect everything”; it must say which constraints are non-expandable, which grants are reviewable, who owns each rule, and how the final effective policy is validated. The source demonstrates this pattern for network policy only.

有价值的架构区别是：**Protected Constraint Composition 与 Governed Expansion 是两件事**。安全 Merge 不能简化成“Deny 永远优先”或“全部取交集”；它必须明确哪些 Constraint 不可扩张、哪些 Grant 可以 Review、每条 Rule 的 Owner 是谁，以及最终 Effective Policy 如何验证。来源只在 Network Policy 范围内展示了这一 Pattern。
