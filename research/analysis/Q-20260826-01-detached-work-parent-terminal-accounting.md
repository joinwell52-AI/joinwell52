---
schema: "research-analysis/v1"
id: "AN-20260826-01"
date: "2026-08-26"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260826-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260826-01-detached-workflow-terminal-truth.md"
output_contract: "Research Object"
research_object: "Detached Work Must Participate in Parent Terminal Truth"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Detached Work Must Participate in Parent Terminal Truth

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-26 Reading Result for Q-20260826-01. The primary evidence is the OpenAI Codex issue/maintainer-fix pair documented in that Reading Result: a detached/background action could outlive the foreground command while the enclosing workflow was reported completed, and the merged fix introduced explicit detached-action lifecycle accounting so a parent turn remains alive until owned detached actions reach terminal state. The conclusion is bounded to terminal-state accounting for owned detached work; it does not establish distributed exactly-once execution, external-effect completion, or crash-durable orchestration.

本对象仅分析 Q-20260826-01 的 2026-08-26 已完成 Reading Result。一手证据是该 Reading Result 已核验的 OpenAI Codex Issue/维护者修复组合：Detached/Background Action 可以在前台命令之后继续存活，而所属 Workflow 却已被报告为完成；已合并修复引入显式 Detached-action Lifecycle Accounting，使 Parent Turn 在其拥有的 Detached Action 到达终态之前保持存活。结论仅限于 Owned Detached Work 的终态记账；不能据此推出分布式 Exactly-once Execution、外部副作用已完成或 Crash-durable Orchestration。

```yaml
analysis:
  research_question: "When a digital-employee workflow launches detached or background work, what evidence should determine whether the parent workflow is actually terminal?"
  research_question_zh: "当数字员工 Workflow 启动 Detached 或 Background Work 时，什么证据才应决定 Parent Workflow 是否真正达到终态？"

  evidence_claims:
    - id: "E1"
      identity: "source-reported-claim"
      claim: "The reported Codex failure allowed a detached /btw action to continue executing while the enclosing workflow was already shown as completed."
      claim_zh: "Codex 报告的故障允许 Detached /btw Action 继续执行，而所属 Workflow 已经显示为 Completed。"
      source: "research/reading/Q-20260826-01-detached-workflow-terminal-truth.md"
      strength: "primary issue report"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "The merged maintainer change introduced explicit active/cancelable detached-action lifecycle state, monotonic action identities and terminal-state filtering."
      claim_zh: "已合并维护者变更引入了显式 Active/Cancelable Detached-action Lifecycle State、单调 Action Identity 与 Terminal-state Filtering。"
      source: "research/reading/Q-20260826-01-detached-workflow-terminal-truth.md"
      strength: "direct merged implementation evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The maintainer change states that parent turns which launch detached work remain alive until every owned detached action reaches terminal state."
      claim_zh: "维护者变更明确说明，启动 Detached Work 的 Parent Turn 会保持存活，直到其拥有的每个 Detached Action 都达到终态。"
      source: "research/reading/Q-20260826-01-detached-workflow-terminal-truth.md"
      strength: "direct maintainer lifecycle-contract evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Parent completion should be computed over the lifecycle of work the parent owns, not over the return of the foreground invocation that happened to spawn that work."
      claim_zh: "Parent Completion 应基于 Parent 所拥有工作的 Lifecycle 计算，而不是基于恰好启动这些工作的前台 Invocation 是否已经 Return。"
      source: "E1,E2,E3"
      strength: "bounded lifecycle-governance interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "A detached-work registry plus a terminal barrier improves workflow terminal truth, but it does not prove that remote effects have completed, that effects are exactly-once, or that the registry itself survives a crash."
      claim_zh: "Detached-work Registry 加 Terminal Barrier 能改善 Workflow Terminal Truth，但不能证明 Remote Effect 已完成、Effect Exactly-once，或 Registry 本身具有 Crash Durability。"
      source: "E2,E3"
      strength: "evidence-boundary interpretation"
      independent: false

  observations:
    - "The failure is a truth-modeling problem before it is a cancellation problem: the parent declared success without accounting for all work it still owned."
    - "Explicit action identities matter because terminal accounting and cancellation both require a stable way to refer to the same detached occurrence."
    - "Terminal-state filtering prevents already-closed detached actions from indefinitely keeping the parent alive."
  observations_zh:
    - "该故障首先是 Truth-modeling 问题，其次才是 Cancellation 问题：Parent 在仍拥有未收口工作时就宣布成功。"
    - "显式 Action Identity 很重要，因为 Terminal Accounting 与 Cancellation 都需要稳定指向同一个 Detached Occurrence。"
    - "Terminal-state Filtering 防止已经收口的 Detached Action 无限期阻止 Parent 收口。"

  comparisons:
    - "Fire-and-forget spawning optimizes responsiveness but severs terminal truth unless the spawned work is registered under a parent-owned lifecycle."
    - "Waiting for the foreground function to return is weaker than waiting for owned-work quiescence; the former observes call-stack completion, while the latter observes workflow-owned lifecycle completion."
  comparisons_zh:
    - "Fire-and-forget Spawning 有利于响应性，但如果 Spawned Work 没有注册到 Parent-owned Lifecycle，就会切断 Terminal Truth。"
    - "等待前台函数 Return 弱于等待 Owned-work Quiescence；前者只观察 Call-stack Completion，后者观察 Workflow-owned Lifecycle Completion。"

  counterarguments:
    - "Some detached work may intentionally be transferred to another durable owner; in that case the parent should be allowed to close only after an explicit ownership handoff is recorded, not merely because the task is backgrounded."
    - "A parent terminal barrier can become a liveness risk if detached actions never reach terminal state; bounded timeout, cancellation and administrative reconciliation still need separate governance."
    - "A local lifecycle registry cannot by itself attest that an external side effect actually happened or did not happen."
  counterarguments_zh:
    - "某些 Detached Work 可能被有意转移给另一个 Durable Owner；此时 Parent 只有在显式记录 Ownership Handoff 后才应允许收口，而不是仅因为任务被放到后台。"
    - "如果 Detached Action 永远不到达终态，Parent Terminal Barrier 会变成 Liveness Risk；仍需要独立的有界 Timeout、Cancellation 与管理型 Reconciliation。"
    - "本地 Lifecycle Registry 本身不能证明外部副作用实际发生或未发生。"

  research_judgment: "Detached work should remain part of parent workflow terminal truth until it either reaches a terminal state under the parent or is explicitly transferred to another governed owner. A foreground return, spawn acknowledgement or background label is not terminal evidence. The selected Codex change demonstrates a bounded implementation pattern: stable detached-action identity, owned lifecycle registration and a parent terminal barrier. It does not establish distributed exactly-once execution, remote-effect certainty or crash-durable ownership."
  research_judgment_zh: "Detached Work 应持续参与 Parent Workflow 的 Terminal Truth，直到它在 Parent 名下达到终态，或被显式转移给另一个受治理 Owner。Foreground Return、Spawn Acknowledgement 或 Background Label 都不是 Terminal Evidence。所选 Codex 变更证明了一种有界实现模式：稳定 Detached-action Identity、Owned Lifecycle Registration 与 Parent Terminal Barrier；它不能建立分布式 Exactly-once Execution、Remote-effect Certainty 或 Crash-durable Ownership。"

  general_implications:
    - "Digital-employee runtimes should maintain a run-scoped owned-work registry containing occurrence identity, owner, lifecycle state and terminal evidence."
    - "Parent completion gates should query owned-work quiescence before publishing success."
    - "Ownership transfer for long-running background work should be explicit and auditable so terminal responsibility is not silently lost."
    - "Timeout and cancellation outcomes should remain distinct from successful completion and should preserve enough evidence for reconciliation."
  general_implications_zh:
    - "数字员工 Runtime 应维护 Run-scoped Owned-work Registry，包含 Occurrence Identity、Owner、Lifecycle State 与 Terminal Evidence。"
    - "Parent Completion Gate 在发布 Success 之前应检查 Owned-work Quiescence。"
    - "长期 Background Work 的 Ownership Transfer 应显式且可审计，避免 Terminal Responsibility 静默丢失。"
    - "Timeout 与 Cancellation Outcome 应与 Successful Completion 分离，并保留足够证据用于 Reconciliation。"

  limitations:
    - "Evidence is from one Codex issue and merged maintainer implementation, not independent cross-runtime validation."
    - "The evidence establishes local terminal accounting semantics for detached actions, not a distributed transaction protocol."
    - "No evidence proves crash recovery of the detached-action registry or persistence across process loss."
    - "No evidence proves external effects are completed, rolled back, deduplicated or exactly-once when the local action reaches terminal state."
  limitations_zh:
    - "证据来自一个 Codex Issue 与已合并维护者实现，并非跨 Runtime 的独立验证。"
    - "证据建立的是 Detached Action 的本地 Terminal Accounting 语义，不是分布式 Transaction Protocol。"
    - "没有证据证明 Detached-action Registry 可在 Crash/Process Loss 后恢复。"
    - "没有证据证明本地 Action 达到终态时，外部 Effect 已完成、回滚、去重或 Exactly-once。"

  open_questions:
    - "How should ownership transfer be represented when detached work is intentionally allowed to outlive the originating run?"
    - "What lease or timeout policy prevents a permanently non-terminal detached action from deadlocking parent finalization?"
    - "Which external-effect evidence, if any, should be required in addition to local detached-action terminal state?"
    - "How should crash recovery reconstruct the owned-work registry without falsely declaring abandoned work complete?"
  open_questions_zh:
    - "当 Detached Work 被有意允许超出 Originating Run 生命周期时，Ownership Transfer 应如何表达？"
    - "什么 Lease/Timeout Policy 可以防止永久不终态的 Detached Action 锁死 Parent Finalization？"
    - "除本地 Detached-action Terminal State 外，还应要求哪些 External-effect Evidence？"
    - "Crash Recovery 应如何重建 Owned-work Registry，同时避免把 Abandoned Work 错误宣布为 Completed？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "evidence", "technical-analysis", "lifecycle-governance", "engineering-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The conclusion is a general workflow-terminal accounting pattern and does not require a first-party project mapping to stand."
    rationale_zh: "该结论属于一般 Workflow Terminal Accounting Pattern，不需要映射自有项目才能成立。"
```

## Bounded judgment / 有界判断

The central distinction is **foreground completion is not workflow terminal truth**. A workflow that still owns live detached work is not terminal merely because the foreground invocation returned. The evidence supports explicit owned-work accounting and a terminal barrier; it does not support stronger claims about remote effects or distributed exactly-once execution.

核心区别是：**Foreground Completion 不等于 Workflow Terminal Truth**。只要 Workflow 仍拥有存活的 Detached Work，就不能仅因为前台 Invocation 已 Return 而宣布终态。现有证据支持显式 Owned-work Accounting 与 Terminal Barrier，但不支持关于 Remote Effect 或分布式 Exactly-once Execution 的更强结论。
