---
schema: publication-candidate-article/v2
title: "指令来源不是指令授权"
date: '2026-08-24'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "When a subagent inherits parent history but receives child-specific developer instructions, how should the architecture preserve instruction lineage without turning provenance labels into implicit authorization?"
summary: "Codex 的一项已合并变更为 Child-only Developer Instruction 增加 Typed Provenance，并测试 Parent/Child Boundary。它让 Context Derivation 可检查，但仍需独立 Authority Plane 说明谁可以提供或覆盖 Instruction。"
cover: staging/publication-candidates/2026-08-24-instruction-lineage-not-authority-cover.png
sources:
  - research/analysis/Q-20260824-02-instruction-lineage-authority-separation.md
---

![指令来源不是指令授权题图](staging/publication-candidates/2026-08-24-instruction-lineage-not-authority-cover.png)

# 指令来源不是指令授权

Child Agent 可以继承几乎全部 Parent Conversation，同时需要一条只属于 Child 的 Instruction。如果它变成普通或未分类 Text，系统会丢失 Semantic Identity；如果进入 Parent Request，Boundary 就发生泄漏；如果在 Child 中出现两次，Effective Context 又会改变。

Codex 在 2026-08-24 合并的一项变更新增专用 `DeveloperInstructions` Contextual Fragment，带 Developer Role 与 `generic.developer_instructions` Content Kind。在已证明的 Full-history Fork 中，Implementation 会过滤继承的 Developer Material，按条件提供 Child-only Fragment，并同时测试三个事实：Parent 排除 Child Instruction，Child 保留其 Classification，且精确文本在 Child Developer Message 中只出现一次。

这强化了一个真实 Request Boundary 上的 Lineage，却不能证明 Caller 获得授权创建该 Instruction。**Instruction Provenance 与 Instruction Authority 是两个不同 Control Plane。**

## Typed Context 保留语义身份

复制文本可以保留文字，却销毁来源。Inherited Paragraph、Parent Developer Rule 与 Child-local Override 在 Compaction 后可能很相似，但它们属于不同 Derivation Path 与 Scope。

新 Fragment 改善了第一层。Developer Guidance 在该 Path 上不再使用 Unknown Content Kind；其 Role 与 Semantic Kind 可以被后续 Context Construction 和 Request-level Test 检查。系统因此可以追问 Material 是继承、Local Introduction，还是在 Fork Boundary 被替换。

History 被转换时，Typed Provenance 尤其重要。Fork 可能保留 Reference Context，同时替换 Parent-specific Instruction。没有显式 Fragment Identity，Text-oriented Rewrite 只能从文字猜测哪些属于 Control Material。所选代码仍有更精确 Message-fragment Provenance 的 TODO，因此这只是局部改进，而不是完整 Provenance Graph。

## Fork 必须同时保证排除与表示

正确的 Child Boundary 需要两个互补 Property：Child-only Control 不能泄漏到 Parent Request，同时必须在 Child 中准确存在。只测 Child 会漏掉 Parent Contamination；只测 Parent Exclusion，又可能让 Child 丢失必要 Guidance。

Codex Regression 检查真实 Request Surface：Parent 不包含配置的 Child-only Text，Child 携带专用 Content Kind，并且该文本在 Child Developer Message 中 Count 为一。这比只检查 Intermediate Object 更强。

“一次”仍只是该 Request Construction 的局部主张，不能建立跨 Retry Deduplication、分布式 Delivery 或 Replay Guarantee。因此，架构应分开描述 Construction 时单一表示、Durable Transport Identity 与 Replay Idempotence。

## Developer Label 不能为自己的来源授权

Role Ordering 与 Provenance 解决的不是 Permission。Developer-role Instruction 可以在 Model Request 中合法高于普通 Conversation Content；这说明 Instruction 是什么、模型如何解释它，却不能说明哪个 Principal 有权创建它、External Policy 是否允许 Override，或 Authority 多久有效。

稳健设计需要单独的 Authority Record，绑定 Principal、Policy Source、Scope、Freshness 与 Delegation Chain。Lineage Plane 可以说明“这个 Fragment 是在 Fork X 引入的 Child-local Developer Guidance”；Authority Plane 则必须说明“Principal Y 被 Policy Z 允许在 Scope S 提供该 Guidance”。

把二者压进 Developer Label 会产生 Privilege Drift。Fragment 可以在 Fork、Compaction 或 Replay 中保留 High-precedence Role，即使最初允许它的 Authorization Context 已不再有效。

## Lifecycle Transition 必须声明如何处理 Control

Fork 只是第一个 Transformation。Compaction 可能摘要掉 Boundary；Resume 可能在 Policy 已变化时加载旧 Effective Context；Replay 可能把同一 Fragment 送入新 Execution。每个 Transition 都应说明 Instruction Lineage 是保留、转换还是替换，也要说明 Authority 仍有效还是必须重新建立。

低风险单进程系统可以信任构造每个 Child 的 Caller。这可能是合理简化，但它是一条显式 Trust Assumption，而不是 Provenance Label 自带的证据。

实际 Audit Test 有两列：每条 Effective Instruction 来自哪里，以及哪个 Principal 或 Policy 允许它在这里生效？只能回答第一列的系统拥有 Lineage；从 Role Label 推断第二列，则是把 Provenance 与 Authority 混为一谈。

**一手证据：** [OpenAI Codex 已合并提交 a70974c1](https://github.com/openai/codex/commit/a70974c1a0837e17769e3c41f83ad5e592c703fb)。公开代码与 Request-level Regression 支持本文描述的有界 Child-instruction 行为，但不是 Authenticated Authority 或端到端 Policy Integrity 的独立证明。
