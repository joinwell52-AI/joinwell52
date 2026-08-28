---
schema: "research-analysis/v1"
id: "AN-20260828-01"
date: "2026-08-28"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260828-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260828-01-root-goal-descendant-resource-accounting.md"
output_contract: "Research Object"
research_object: "Delegated Resource Budgets Must Follow Root Objective Ownership"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Delegated Resource Budgets Must Follow Root Objective Ownership

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-28 Reading Result for Q-20260828-01. The primary evidence is merged OpenAI Codex maintainer change `4761851ff35c4ebdd35eb8801e1180a0a50fef60`, which routes child and nested-subagent token increments into shared root-goal accounting across active and idle progress, goal replacement, checkpoint races and an unloaded intermediate parent. The bounded conclusion concerns resource ownership and budget attribution for delegated work. It does not infer a general multi-resource quota system, immediate descendant cancellation, distributed exactly-once accounting or cross-host enforcement.

本对象只分析 Q-20260828-01 的 2026-08-28 已完成 Reading Result。一手证据是 OpenAI Codex 已合并维护者变更 `4761851ff35c4ebdd35eb8801e1180a0a50fef60`：Child 与 Nested Subagent 的 Token 增量被归集到共享 Root-goal Accounting，并覆盖 Active / Idle Progress、Goal Replacement、Checkpoint Race 与中间 Parent Runtime 已卸载的场景。本对象的有界结论仅讨论委派工作的 Resource Ownership 与 Budget Attribution；不推断通用 Multi-resource Quota、即时 Descendant Cancellation、分布式 Exactly-once Accounting 或跨 Host Enforcement。

```yaml
analysis:
  research_questions:
    - id: "RQ1"
      question: "When an agent delegates work, which identity should own the resource budget: the worker that spends resources or the root objective that authorized the work?"
      question_zh: "Agent 委派工作后，Resource Budget 应归属于实际消耗资源的 Worker，还是授权这项工作的 Root Objective？"
    - id: "RQ2"
      question: "What accounting mechanism prevents nested delegation from becoming a budget-escape path while preserving concurrent usage across checkpoints and runtime unloading?"
      question_zh: "什么 Accounting Mechanism 能阻止 Nested Delegation 成为预算逃逸路径，同时在 Checkpoint 并发与 Runtime 卸载后仍保留使用量？"
    - id: "RQ3"
      question: "Which enforcement claims remain unproven after correct root-level attribution is established?"
      question_zh: "即使 Root-level Attribution 已正确建立，哪些 Enforcement 主张仍然没有被证明？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The merged Codex change introduces shared root accounting state for delegated descendants and routes descendant token increments into that root accumulator."
      claim_zh: "已合并 Codex 变更为委派 Descendant 引入共享 Root Accounting State，并把 Descendant Token 增量路由到 Root Accumulator。"
      source: "research/reading/Q-20260828-01-root-goal-descendant-resource-accounting.md"
      strength: "merged maintainer implementation evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "The demonstrated accounting includes active and idle progress, survives an unloaded intermediate parent, rebases on root-goal replacement and preserves post-snapshot concurrent usage for later accounting."
      claim_zh: "已展示 Accounting 覆盖 Active / Idle Progress，可在中间 Parent 卸载后继续归集，在 Root-goal Replacement 时重置基线，并保留 Snapshot 后并发到达的使用量供后续计费。"
      source: "research/reading/Q-20260828-01-root-goal-descendant-resource-accounting.md"
      strength: "source-level behavior plus regression coverage"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "Combined root and descendant token usage can transition the root goal to BudgetLimited, but the selected evidence does not prove synchronous cancellation of every running descendant."
      claim_zh: "Root 与 Descendant 合并 Token Usage 可以推动 Root Goal 进入 BudgetLimited，但所选证据没有证明会同步取消所有正在运行的 Descendant。"
      source: "research/reading/Q-20260828-01-root-goal-descendant-resource-accounting.md"
      strength: "bounded implementation and test evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Resource accountability for delegated agent work should follow the identity of the objective that owns the authorization and budget, while retaining worker-level origin evidence for attribution and diagnosis."
      claim_zh: "委派 Agent 工作的 Resource Accountability 应跟随拥有授权与预算的 Objective Identity，同时保留 Worker-level Origin Evidence 用于归因与诊断。"
      source: "E1,E2,E3"
      strength: "bounded architectural interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "Budget accounting and budget enforcement are separate control planes: proving accurate inherited attribution does not prove timely revocation, cancellation, admission denial or durable exactly-once charging."
      claim_zh: "Budget Accounting 与 Budget Enforcement 是不同控制面：证明继承式归因准确，并不能证明及时 Revocation、Cancellation、Admission Denial 或 Durable Exactly-once Charging。"
      source: "E2,E3"
      strength: "control-boundary interpretation"
      independent: false

  observations:
    - "Delegation creates two identities that should not be collapsed: the descendant that physically consumes resources and the root objective that economically/governance-wise owns the work."
    - "A shared root accumulator closes the demonstrated nested-delegation accounting gap without requiring the intermediate parent runtime to remain loaded."
    - "Checkpoint-safe delta accounting is important because a simple 'read latest then advance latest' scheme could erase usage arriving after the snapshot."
    - "The demonstrated budget is tokens; no evidence upgrades the mechanism to time, network, tool calls, money, memory or process quotas."
  observations_zh:
    - "委派产生两个不应混为一体的 Identity：实际消耗资源的 Descendant，以及在经济/治理意义上拥有这项工作的 Root Objective。"
    - "共享 Root Accumulator 能关闭已展示的 Nested-delegation Accounting Gap，而且不要求中间 Parent Runtime 始终保持加载。"
    - "Checkpoint-safe Delta Accounting 很重要，因为简单的“读取最新值后直接推进到最新值”可能抹掉 Snapshot 后到达的 Usage。"
    - "已展示 Budget 仅为 Token；没有证据把该机制升级到 Time、Network、Tool Call、Money、Memory 或 Process Quota。"

  comparisons:
    - "Per-worker quota answers who spent resources; root-owned budget answers which user objective must pay for delegated work. A governed runtime needs both views rather than choosing one."
    - "Recursive summation only at root-turn completion is weaker than continuous descendant delta publication because it can miss idle descendants or depend on intermediate runtime liveness."
    - "A budget-state transition such as BudgetLimited is weaker than an execution revocation receipt; the former is accounting truth, the latter would be enforcement evidence."
  comparisons_zh:
    - "Per-worker Quota 回答谁消耗了资源；Root-owned Budget 回答哪一个用户目标必须为委派工作承担预算。受治理 Runtime 需要同时保留两种视图，而不是二选一。"
    - "只在 Root Turn 结束时递归求和弱于持续发布 Descendant Delta，因为前者可能漏掉 Idle Descendant，或依赖中间 Runtime 仍存活。"
    - "BudgetLimited 这类 Budget-state Transition 弱于 Execution Revocation Receipt；前者是 Accounting Truth，后者才是 Enforcement Evidence。"

  counterarguments:
    - "Some deployments intentionally give subagents independent budgets. That is compatible with the conclusion if the parent objective still receives an explicit inherited charge or admission rule for delegated spending."
    - "Immediate cancellation at the budget boundary can waste partially completed useful work or leave tools in unsafe intermediate states; enforcement may deliberately occur at safe lifecycle boundaries."
    - "Central root accounting can become a coordination hotspot in highly distributed systems; alternative designs may use signed/local ledgers and reconciliation while preserving root ownership semantics."
  counterarguments_zh:
    - "有些部署会有意给 Subagent 独立 Budget；只要 Parent Objective 仍对委派消耗承担显式继承 Charge 或 Admission Rule，这并不与本结论冲突。"
    - "在预算边界立即 Cancellation 可能浪费接近完成的工作，或让 Tool 留在不安全中间态；Enforcement 可以有意选择安全 Lifecycle Boundary。"
    - "高度分布式系统里，集中 Root Accounting 可能成为协调热点；也可以用签名/本地 Ledger + Reconciliation，只要仍保持 Root Ownership 语义。"

  research_judgment: "Delegated resource consumption should be governed by two linked identities: the descendant worker remains the origin of measured usage, while the root objective that authorized the delegation remains the owner of the inherited budget charge. The Codex change provides strong bounded evidence that shared root token accounting can survive nesting, idle progress, goal replacement, checkpoint races and an unloaded intermediate parent. That closes a concrete accounting escape hatch. It does not establish the separate enforcement contract required to prove immediate descendant revocation, generalized multi-resource quotas or distributed exactly-once charging."
  research_judgment_zh: "委派 Resource Consumption 应由两个关联 Identity 共同治理：Descendant Worker 仍是被测 Usage 的 Origin，而授权委派的 Root Objective 仍是继承 Budget Charge 的 Owner。Codex 变更提供了强而有界的证据，表明共享 Root Token Accounting 能跨越 Nesting、Idle Progress、Goal Replacement、Checkpoint Race 与中间 Parent 卸载，关闭具体的 Accounting Escape Hatch。但它没有建立另一套独立的 Enforcement Contract，因此不能证明即时 Descendant Revocation、通用 Multi-resource Quota 或分布式 Exactly-once Charging。"

  general_implications:
    - "Digital-employee runtimes should make delegation preserve an explicit root objective/budget identity rather than allowing each worker boundary to reset resource ownership."
    - "Telemetry should expose both origin-level consumption and inherited root-level budget impact so operators can distinguish expensive workers from expensive objectives."
    - "Budget state and execution authority should remain separately observable; reaching a limit should not be reported as cancellation unless cancellation evidence exists."
    - "Recovery/checkpoint logic must preserve unaccounted resource deltas across concurrency and runtime reconstruction."
  general_implications_zh:
    - "数字员工 Runtime 应让 Delegation 显式保留 Root Objective/Budget Identity，而不是让每个 Worker Boundary 重置 Resource Ownership。"
    - "Telemetry 应同时暴露 Origin-level Consumption 与继承的 Root-level Budget Impact，以区分“昂贵 Worker”和“昂贵 Objective”。"
    - "Budget State 与 Execution Authority 应保持独立可观测；达到 Limit 不能在没有 Cancellation Evidence 时被报告为已取消。"
    - "Recovery/Checkpoint Logic 必须在并发与 Runtime Reconstruction 中保留尚未记账的 Resource Delta。"

  limitations:
    - "Evidence is one merged Codex implementation and its regression coverage; there is no independent reproduction in this object."
    - "Only token accounting is demonstrated."
    - "The root accounting reference is runtime state, not a cryptographically portable delegation receipt."
    - "Immediate descendant cancellation, recovery after process crash, cross-host consistency and externally replayable audit breakdown remain unproven."
  limitations_zh:
    - "证据来自一个已合并 Codex 实现及其 Regression Coverage；本对象没有独立复现。"
    - "只证明 Token Accounting。"
    - "Root Accounting Reference 是 Runtime State，不是可跨系统携带的密码学 Delegation Receipt。"
    - "即时 Descendant Cancellation、Process Crash 后恢复、Cross-host Consistency 与可外部重放的 Audit Breakdown 仍未证明。"

  open_questions:
    - "Should a root budget exhaustion event immediately revoke descendant admission, or only prevent new delegated work while existing work reaches safe boundaries?"
    - "What durable receipt should connect descendant usage to a root objective across process crashes?"
    - "Can the same ownership model govern money, tool calls, network egress or wall-clock time without introducing inconsistent enforcement semantics?"
    - "How should re-parenting or objective migration handle already-accounted and pending descendant deltas?"
  open_questions_zh:
    - "Root Budget Exhaustion 应立即撤销 Descendant Admission，还是只阻止新的 Delegated Work，让已有工作到达安全边界后结束？"
    - "跨 Process Crash 时，应使用什么 Durable Receipt 把 Descendant Usage 连接到 Root Objective？"
    - "同一 Ownership Model 能否治理 Money、Tool Call、Network Egress 或 Wall-clock Time，而不引入不一致 Enforcement Semantics？"
    - "发生 Re-parenting 或 Objective Migration 时，已记账与 Pending Descendant Delta 应如何处理？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "evidence", "technical-analysis", "comparisons", "operational-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The conclusion is a general delegation-budget governance principle and does not require a first-party project mapping."
    rationale_zh: "该结论属于通用 Delegation-budget Governance Principle，不需要映射自有项目才能成立。"
```

## Bounded judgment / 有界判断

The key boundary is **resource origin is not the same as budget ownership**. A descendant can be the factual source of consumption while the root objective remains the accountable budget owner. Accurate inherited accounting closes one class of delegation escape, but it must not be overstated as execution revocation or exactly-once enforcement.

核心边界是：**Resource Origin 不等于 Budget Ownership**。Descendant 可以是实际 Consumption 的来源，而 Root Objective 仍是应承担预算责任的 Owner。准确的继承 Accounting 能关闭一类 Delegation Escape，但不能被扩大解释为 Execution Revocation 或 Exactly-once Enforcement。
