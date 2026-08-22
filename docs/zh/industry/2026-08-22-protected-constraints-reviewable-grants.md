---
title: "受保护约束与可审查授权，需要不同合并规则"
date: '2026-08-22'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "How should a remote execution architecture combine policies owned by different authorities so that protected constraints cannot be weakened while explicitly reviewable access can still expand under governance?"
summary: "安全的 Multi-owner Policy Merge 既不是全面 Union，也不是全面 Intersection。Protected Ceiling 必须穿过后续 Layer 保持有效，而 Legitimate Expansion 应成为显式、限定 Scope、可失效的 Review Transition。"
sources:
  - research/analysis/Q-20260822-02-monotonic-policy-composition-reviewable-expansion.md
item_id: "Q-20260822-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-22-protected-constraints-reviewable-grants-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-22-protected-constraints-reviewable-grants-cover.png"
  kicker="行业架构 · 每日研究"
  title="受保护约束与可审查授权，需要不同合并规则"
  summary="安全的 Multi-owner Policy Merge 既不是全面 Union，也不是全面 Intersection。Protected Ceiling 必须穿过后续 Layer 保持有效，而 Legitimate Expansion 应成为显式、限定 Scope、可失效的 Review Transition。"
  version="Q-20260822-02"
  status="Daily Runtime V5 · 2026-08-22"
  languageHref="/en/industry/2026-08-22-protected-constraints-reviewable-grants"
  languageLabel="English"
/>

# 受保护约束与可审查授权，需要不同合并规则

当多个 Authority 同时为一次 Remote Execution 提供 Policy 时，两个最直观的 Merge Rule 都会在关键场景出错。Union 会让任意参与 Layer 扩大 Access，并可能擦除某个 Owner 的 Ceiling；纯 Intersection 可以保留 Non-expansion，却无法表达 Policy 有意允许、并经过 Review 的合法 Exception。

2026 年 8 月 22 日合并的一项 Codex 变更，为 Network Policy 展示了更有用的 Pattern。Attachment 可以拥有 Traffic Restriction，Controller、Permission Profile 与历史 Review Decision 则贡献其他 Constraint。实现对这些来源做非对称组合：Protected Denial 与 Strict Ceiling 被保留；Grant 只有在兼容或可 Review 的 Path 上才能进入；最终 Effective Proxy Policy 在使用前还要重新验证。

架构规则不是“Deny 永远优先”，而是：**Protected Constraint 应保持单调组合，允许的 Expansion 则应成为具有明确 Scope 与 Invalidation 的显式 Review Transition。** 这项区别必须进入 Policy Schema，不能事后从 Merge Order 中猜测。

## Set Operation 无法表达 Authority Ownership

设想一个 Environment Allowlist、一条 Controller Deny Rule 和一份先前保存的 Network Approval。对 Allow Domain 取 Union，可能让 Saved Grant 或 Environment List 擦除 Controller 的 Protected Denial；取 Intersection 虽然保住 Denial，却也消除了 Policy 明确允许的 Human-reviewed Exception Path。

缺失的信息是 Ownership 与 Expandability。有些 Field 是 Ceiling：后续 Layer 可以保留或收紧，却不能静默扩大。有些是 Reviewable Grant：当命名清楚的 Decision Process 授予有界 Exception 时，可以增加 Access。还有一些属于 Implementation Setting，Attachment 根本不应拥有，例如 Proxy Credential、Listener 或 Runtime Network Mode。

Codex 的 `EnvironmentNetworkPolicy` 体现了这种分离。它给 Attachment 一组可携带的 Traffic Restriction，却没有因此把完整 Proxy Runtime Authority 交给 Attachment。Owner 可以约束流量，但不会仅因参与 Merge 就取得 Credential 或 Listener Configuration。

## 非对称组合才能保住 Ceiling

已展示的 Merge 不会用同一规则处理所有 Field。Owner Domain Rule 可以替换 Soft Grant，但 Inherited Controller Denial 会在之后恢复。Unix-socket Access 通过 Intersection 组合，让兼容的 Grant 可以保留，同时使 Denial 继续占优。`allow_upstream_proxy` 与 `allow_local_binding` 则要求 Owner 与 Controller 同时允许。

Saved Decision 遵循同样的非对称性。Saved Deny 可以继续进入；Saved Grant 只会进入仍可 Review 的 Path；Protected Owner 或 Controller Denial 会在这些 Decision 之后再次恢复。Fixed Controller Allowlist 与 Attachment 的 Strict Managed Allowlist 都会抑制 Approval-based Widening。

这种顺序是 Governance Behavior，不是编码细节。“最后应用”意味着“不能被后续 Authority 擦除”。如果这个含义没有被声明，一个只改变 Operation Order 的重构就可能变成未经过明确 Policy Review 的 Authority Change。

## Expansion 应属于 Transition，而不是 Precedence

Legitimate Expansion 有时确实必要。Remote Task 可能需要初始集合之外的 Domain，控制 Policy 也可能有意允许 Human Review。安全表示方式是独立 Transition，记录谁批准了什么、针对哪个 Environment 与 Command Scope、绑定哪个 Policy Version，以及 Grant 何时 Expire 或 Invalidate。

这份 Grant 不应伪装成普通 Merge Input。把它作为 First-class Transition，才能审查三个问题：

- 这个 Field 是否允许 Expansion？
- Saved Decision 是否仍绑定当前 Environment Identity 与 Policy Version？
- Grant 进入后，哪些 Protected Ceiling 仍然不可扩张？

因此，Strict 与 Reviewable Mode 是不同的 Governance State，而不只是不同的 Allowlist Value。Strict Mode 移除 Fallback Approval Decider；Reviewable Mode 在 Controller Constraint 允许时，可以接纳 Saved Grant。两者都必须让 Protected Layer 在组合后保持可见。

## 验证结果，也验证所有执行路径

正确的 Fragment 不保证正确的 Effective Policy。Domain 与 Socket Normalization 可能失败；Owner Setting 可能与 Managed Enforcement 不兼容；Controller Proxy 可能已禁用。Codex Path 会在执行前验证组合后的 Proxy Configuration，而不是假设每个 Input 正确就能自动推出组合结果正确。

Enforcement 还必须覆盖替代执行模式。同一变更会在 Sandbox Escalation 绕过 Attachment-owned Network Policy 时拒绝升级。缺少这项检查，Primary Policy Path 可能完全正确，Secondary Route 却能悄悄逃逸。

这就是把 Merge Semantics 当成 Authority 的运维后果：Validator 与 Escalation Check 必须消费同一份 Effective Policy。只存在于 Configuration Assembly 的 Policy，不是 Runtime Ceiling。

## 已展示边界仅限 Network Policy

公开证据覆盖 Codex Remote-execution Network Policy 与相关 Sandbox-escalation Path。它没有建立 Filesystem Access、Process Privilege、Credential、Tool Availability 或 Application Authorization 的等价组合。Reviewable Network Policy 可以有意扩大 Access；Monotonicity 只适用于被声明为 Protected 的 Field。

设计还没有回答：Environment Identity、Controller Constraint 或 Policy Version 改变时，Saved Decision 如何失效；已经运行的 Execution 又如何响应新的 Ceiling。这些属于模型本身，而不是可以推迟的实现清理。

可持久复用的结论很精确：声明每个 Policy Field 的 Owner；标记哪些 Constraint 不可扩张；让 Legitimate Grant 通过独立可审计的 Transition 进入；验证组合结果；并在 Escalation Path 上执行同一结果。少一步，Merge Precedence 都可能变成 Accidental Authority。

**一手证据：** [OpenAI Codex 合并提交 f580dd88](https://github.com/openai/codex/commit/f580dd886fe57259168c0afc0e3e7820942eed14)。公开代码与测试支持本文描述的有界 Network-policy Behavior，但不构成对所有 Remote-execution Capability Composition 的独立验证。
