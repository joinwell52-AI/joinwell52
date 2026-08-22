---
schema: publication-candidate-article/v2
title: "有用上下文，不等于记忆权限"
date: '2026-08-21'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "When useful tool output arrives without a local execution binding, how should a digital employee separate provenance evidence, immediate usability and authority to persist or reuse that content as memory?"
summary: "独立 Tool Result 可以保持可见与有用，同时不被授权塑造持久 Agent Memory。同日 Codex 变更把这种分离变得具体，也说明 Provenance、Utility 与 Reuse Authority 为什么必须分别记录。"
cover: staging/publication-candidates/2026-08-21-useful-context-not-memory-authority-cover-v2.png
sources:
  - research/analysis/Q-20260821-01-provenance-memory-authority-separation.md
---

![有用上下文，不等于记忆权限题图](staging/publication-candidates/2026-08-21-useful-context-not-memory-authority-cover-v2.png)

# 有用上下文，不等于记忆权限

一份 Tool Result 带着名称与有用内容进入 Agent Thread，却没有对应的本地 Tool Call。Runtime 至少要做三个决定：是否把它保留为 Evidence；是否允许某个有界 Consumer 立即使用；以及是否允许它在未来进入 Durable Memory、继续影响行为。这三个决定很容易被压缩成一个“Trusted”标签，但它们授予的 Authority 并不相同。

2026 年 8 月 21 日合并的一项 Codex 变更把这种区别变得格外清楚。它把缺少 `call_id` 的独立 `FunctionCallOutput` 归类为可能的 External Context。在启用 `memories.disable_on_external_context` 时，已经展示的 Injection 与 Fork-history Path 可以把 Thread Memory Mode 持久标记为 `polluted`。但 Transcript Builder 仍会在元数据存在时保留 Tool 的 Namespace 与 Name，Recent-image Selection 也仍可能使用独立或未配对 Tool Output 中的图像。

这不是自相矛盾，而是一条更准确规则的证据：**Provenance Evidence、即时 Content Utility 与持久 Memory-reuse Authority 是不同的治理决定。**

## 同一 Artifact，三个决定

缺少 `call_id` 之所以重要，是因为它移除了 Result 与同一 Thread 中 Tool Invocation 之间通常存在的结构绑定。这是一项 Provenance Signal，却不是 Cryptographic Identity。它不能证明内容由谁提供、Source Name 是否真实，也不能证明内容必然恶意。

Artifact 仍可能有用。Transcript 可以保留它，让 Auditor 看到哪些内容影响过交互；Visual Consumer 可能需要其中图像完成一次即时 Edit。两种用途都不要求 Runtime 让这份 Artifact 通过 Persistent Memory 获得无限期的 Behavioral Influence。

Memory Reuse 是第三个决定。它改变未来 Session 或行为可能继承的内容，其影响往往远超最初接收 Artifact 的任务。因此问题不能只问“这份内容现在有没有帮助”，还必须问“哪个 Consumer 可以在什么 Purpose 下复用、需要什么 Provenance Standard、权限持续多久”。

## 保护不必以抹除证据为代价

已合并机制保留 External Content，同时改变某个 Memory Subsystem 的 Eligibility。在配置策略下，检测会触发持久 `polluted` State；与此同时，Guardian 与通用 Transcript Path 不再丢弃独立 Named Tool Output。对非文本内容，Text Transcript 用 Placeholder 记录它曾经存在，而不是假装它是一段普通文本。

这种分离对运维很重要。删除所有 Unpaired Result 确实能减少一条复用路径，却也会毁掉可能合法的 Evidence，并削弱 Incident Reconstruction。反过来，把所有可见 Result 都当成普通 Memory，虽然方便，却会让结构上属于 External Context 的材料在没有 Local Execution Binding 时获得持久影响。

对 Memory Fail-closed，同时保留可归因 Evidence，可以避开两种错误。Runtime 可以明确记录：这份 Artifact 出现过；它携带了什么 Source Label；哪个 Consumer 为哪个有界任务使用了它；当前 Policy 没有让 Durable Memory 继承它。

## Authority 应绑定 Consumer 与 Purpose

单一 Thread-level Flag 是实用的保守默认值，但当 Runtime 拥有多个 Store 与 Consumer 时，它可能过于粗糙。Transcript Generation、Short-lived Task Context、Image Editing、Retrieval Index 与 Behavioral Memory 的 Effect 不同。适合其中一项的决定，不会自动授权其他项。

更强的记录应把四个事实分开：

- Artifact 现有的 Provenance Evidence，包括缺失的 Execution Binding；
- 使用内容的即时 Consumer 与 Task；
- 治理 Persistence 或后续 Retrieval 的 Policy Decision；
- 清除、取代或重新资格化限制的 Lifecycle Transition。

这种模型也让 Policy 可审计。未来 Consumer 不能静默把“曾在 History 中出现”当成复用许可；后续 Source Authentication 可以改善 Provenance，却不会自动授权所有 Purpose。Requalification 必须是由新 Evidence 支持的显式转换，而不是时间经过或内容被复制后的副作用。

## Polluted 不是 Authenticated

公开证据来自一个已合并实现及其 Regression Test。它展示了特定 Injection 与 Fork Path，却没有证明每个 Resumed-history Path 或未来 Memory Consumer 都有等价处理。`polluted` State 是一次 Policy Transition 已发生的证据，不是 External Source 已通过认证、所有 Downstream Consumer 都执行该状态，或系统已经具备端到端 Contamination Resistance 的证明。

Image Behavior 把这条边界变得很具体。即使 Text-memory Policy 对 Context 采取不同处理，Recent-image Selection 仍可使用 Unpaired Output 中的图像。这对一次有界 Edit 可能合理，但也意味着非文本 Consumer 需要自己的显式 Policy 与 Integrity Record。

因此，未解决的工作不是寻找一个更好的“Trusted”同义词，而是定义：哪些 Consumer 必须在复用前检查 Eligibility；非文本 Placeholder 如何保留 Artifact-level Provenance；什么 Evidence 足以重新资格化内容；以及清除持久限制时如何留下审计。Useful Context 可以继续有用，工程责任是阻止这种有用性静默变成 Memory Authority。

**一手证据：** [OpenAI Codex 合并提交 aead844f](https://github.com/openai/codex/commit/aead844f64e911f89e556485e3f47d757431c3b1)。公开代码与测试支持本文描述的有界实现行为，但不构成对普遍 Memory Safety 或 Source Authenticity 的独立验证。
