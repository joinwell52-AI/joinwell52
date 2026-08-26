---
title: "前台完成，不等于工作流完成"
date: '2026-08-26'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "When a digital-employee workflow launches detached work, what evidence should determine whether the parent workflow is actually terminal?"
summary: "Google ADK 的一项已合并变更让仍在 In-flight 的 Detached Dynamic Work 参与 Parent Terminal Truth。这个模式以 Ownership 为中心：Parent Success 必须等待 Owned Outcome，但不能据此声称 Remote-effect Certainty 或分布式 Exactly-once。"
sources:
  - research/analysis/Q-20260826-01-detached-work-parent-terminal-accounting.md
item_id: "Q-20260826-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-26-foreground-completion-not-workflow-completion-cover-v2.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-26-foreground-completion-not-workflow-completion-cover-v2.png"
  kicker="数字员工 · 每日研究"
  title="前台完成，不等于工作流完成"
  summary="Google ADK 的一项已合并变更让仍在 In-flight 的 Detached Dynamic Work 参与 Parent Terminal Truth。这个模式以 Ownership 为中心：Parent Success 必须等待 Owned Outcome，但不能据此声称 Remote-effect Certainty 或分布式 Exactly-once。"
  version="Q-20260826-01"
  status="Daily Runtime V5 · 2026-08-26"
  languageHref="/en/digital-employee/2026-08-26-foreground-completion-not-workflow-completion"
  languageLabel="English"
/>

# 前台完成，不等于工作流完成

Agent Workflow 的可见路径可能已经走到终点，但它启动的工作仍在运行。如果 Runtime 此时宣布成功，问题就不只是漏了一个 `await`：系统把 Foreground Completion 错当成了它仍然拥有的全部工作的 Terminal Truth。

Google ADK 在 2026-08-25 合并的一项维护者变更处理了这个问题的一个有界版本。Static Graph Work 结束后，Workflow 会查找仍处于 In-flight 的已跟踪 Dynamic Task，等待它们完成，并在允许 Clean Finish 之前检查 Outcome。Raised Exception、Child Context 中返回的 Error，或 Detached Execution 中无法 Resume 的 Interrupt，都可能让所属 Workflow 进入 Error，而不是产生 False Success。

设计结论是：**Detached Work 必须持续参与 Parent Terminal Truth，直到它在 Parent 名下达到终态，或显式转移给另一个受治理 Owner。** Background Label、Spawn Acknowledgement 或 Foreground Return 都不是 Terminal Evidence。

## 真正的缺陷是缺少 Ownership Accounting

“Fire and Forget”描述的是 Control Flow，不是 Responsibility。Parent 可以不再等待调用栈，却仍然拥有结果。如果没有显式 Ownership Record，Runtime 就无法有原则地判断 Parent 是否完成、是否可以取消，或是否仍可能遭遇迟到的失败。

所选变更通过三步强化了已证明边界：让 Dynamic Work 以 In-flight State 保持可见；在 Static Work 完成后加入 Join；把不良 Detached Outcome 提升到 Enclosing Context。Focused Test 覆盖 In-flight Detached Success、Failure 与 Interrupt。这些机制共同把 Parent Success 变成针对 Owned Work 的决策，而不是 Foreground Function Return 的副作用。

这也说明了 Occurrence Identity 的重要性。Cancellation、Inspection 与 Terminal Filtering 必须指向同一个 Detached Execution，而不是只指向 Task Type 或 Command Name。因此，一个有用的 Registry 至少需要 Occurrence Identifier、Owner、Lifecycle State 与关闭该状态的 Evidence。

## Terminal Barrier 需要 Ownership-transfer Rule

并非所有 Background Task 都应永久阻止 Originator 收口。长期工作可能被有意转交给 Queue、Service 或另一个 Durable Run。但这是一种 Ownership Change，不是 Detachment 自动产生的结果。

只有在 Handoff 标明 New Owner，并记录足够证据供后续 Reconciliation 后，Parent 才应允许关闭。否则，“Detached”会成为 Terminal Responsibility 静默消失的漏洞。

相反风险是 Liveness。永不到达终态的 Task 会让 Parent 无限等待。Timeout、Cancellation 与 Administrative Reconciliation 因此需要不同 Outcome。把 Timeout 当作 Success 会恢复原来的 False-truth 问题；把所有 Cancellation 都当作普通 Error，也可能抹去重要的 Operator Intent。

## Local Task Closure 不是 External-effect Certainty

现有证据比通用 Background-work Protocol 更窄。ADK 路径检查的是 Graph Completion 时仍被表示为 In-flight 的 Dynamic Task。Cancelled Task 会被跳过；如果某个 Detached Run 在检查点之前已经结束，这个机制无法区分它与被正常 Await、Handle 的 Run。

即使 Local Task 正确达到终态，也不能证明 Remote Side Effect 已 Commit、Rollback 或 Exactly-once。In-memory Registry 同样不能证明 Ownership 能跨 Process Loss 保留。这些保证需要独立的 Persistence、Idempotency 与 Reconciliation Contract。

因此，可辩护结论必须精确：已展示的 Join-and-inspect Mechanism 能为仍在 In-flight 的已跟踪 Detached Dynamic Work 防止一类 False Success。它改善 Workflow Terminal Truth，但不能证明 Crash Durability、通用 Background-task Coverage 或分布式 Exactly-once Execution。

## 仍待解决的运行问题

Runtime Designer 仍需回答 Ownership Handoff、Cancelled Detached Work、多个并发 Failure 与 Crash Recovery。尤其是，恢复后的 Parent 不能仅因为 In-memory Task List 为空就推断完成；它需要关于自己曾拥有哪些 Occurrence，以及每个 Occurrence 如何关闭或转移的 Durable Evidence。

更广泛的工程方向是：让 Terminal Success 成为关于 Responsibility 的可审计陈述，而不是 Visible Path 耗尽步骤时顺手发出的时间戳。

**一手证据：** [Google ADK 已合并提交 34e13df4](https://github.com/google/adk-python/commit/34e13df41750fc5243a1cd42a86491ee5acdd876)。实现与 Focused Regression 支持有界的 In-flight Terminal-accounting 结论，但不是分布式执行保证的独立验证。
