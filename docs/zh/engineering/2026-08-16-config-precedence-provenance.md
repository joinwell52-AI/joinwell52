---
title: "配置优先级还需要来源追踪"
date: '2026-08-16'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "How should an SDK expose a raw configuration escape hatch for values its structured serializer cannot represent while keeping effective configuration understandable and preventing accidental ownership inversion?"
summary: "确定性配置顺序能够解决哪个值最终生效，却不能解释这个值由谁提供、该 Layer 是否有权控制它。Raw Escape Hatch 更稳健的前提，是它位于显式 Precedence Chain 中，并让安全相关 Effective Value 保留可观察 Provenance。"
sources:
  - research/analysis/Q-20260816-03-config-precedence-provenance.md
item_id: "Q-20260816-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-16-config-precedence-provenance-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-16-config-precedence-provenance-cover.png"
  kicker="开源工程 · 每日研究"
  title="配置优先级还需要来源追踪"
  summary="确定性配置顺序能够解决哪个值最终生效，却不能解释这个值由谁提供、该 Layer 是否有权控制它。Raw Escape Hatch 更稳健的前提，是它位于显式 Precedence Chain 中，并让安全相关 Effective Value 保留可观察 Provenance。"
  version="Q-20260816-03"
  status="Daily Runtime V5 · 2026-08-16"
  languageHref="/en/engineering/2026-08-16-config-precedence-provenance"
  languageLabel="English"
/>

# 配置优先级还需要来源追踪

Structured SDK Configuration 的价值在于给调用方提供 Typed、Documented Control，但它几乎一定会遇到表达边界。有些下游配置结构过于动态、过新，或者必须保持 Literal Syntax，Structured Serializer 很难安全表达。Raw Override Channel 可以补足表达能力，但随之出现第二个问题：多个配置层同时写同一个 Key 时，最终有效值究竟由谁拥有？

2026-08-16 的 Research Object 分析了 Codex TypeScript SDK 的一个已合并变更。它新增有序 Raw `configOverrides`，在 Structured Configuration 之后原样输出，并保留调用方顺序，包括 Duplicate Key。SDK-managed Setting 更晚输出，Thread/Run-specific Setting 又在其后。由此形成一条明确且可测试的 Observed Precedence，但这条顺序本身不是安全保证。

## 确定顺序解决冲突，但不解释含义

所选机制有一个很重要的优点：SDK 没有再造一套隐藏的 Merge Engine。一个可观察的 Command-line Sequence 直接决定 Precedence。

对重叠 Key，观察到的顺序是：

**Structured Global Configuration < Ordered Raw Override < SDK-managed Setting < Thread/Run-specific Setting**。

这让 Application-level Raw Escape Hatch 可以表达 Structured Serializer 无法表示的值，同时又让更晚的 Execution-owned Setting 保留覆盖权。这里形成了一个有意义的 Ownership Boundary：Raw Expressiveness 不会自动变成绝对 Authority。

保留 Duplicate Raw Key 也更加忠实。SDK 不会静默创造自己的去重语义，而是把调用方序列交给下游 Parser。代价则是可观察性要求更高：运维人员需要能够判断最终哪一次设置真正生效。

这个能力的一项动机是保留 Permission Map 等 Literal TOML Structure。如果 Generic Serializer 擅自重写 Key，含义可能改变。Raw Passthrough 保留了语法，但“忠实传输”并不能证明这个值安全、被授权，或者适合当前部署。

## Provenance 是配置治理缺失的另一半

Precedence 回答的是 **哪个值获胜**；运维治理还需要回答 **这个值从哪里来**。

当配置影响 Sandbox、Approval、Network、Permission 或其他安全敏感行为时，一个 Effective Value 最好能携带 Trace：由哪个 Layer 提供，覆盖了哪些更早值，又被哪个后续 Layer 覆盖，以及 Source Layer 是否有权控制这个 Key。

缺少 Provenance 时，即使顺序完全确定，审计仍会变得困难。最终 Command 可以展示序列，但随着系统叠加 Global Default、Raw Application Override、SDK-managed Control、Thread Config、Run Override、Environment Policy 与 Remote Administration，仅靠倒推参数顺序越来越难说明 Ownership。

这并不要求每个 SDK 都实现复杂 Policy Engine。Machine-readable Effective-config Trace 可以只是观察面：它暴露 Source Layer 与 Precedence，而 Authorization Decision 仍由外围 Control Plane 负责。

## Raw Passthrough 不应变成 Privilege Channel

Escape Hatch 是否合理，取决于它的边界是否明确。开发者工具可能适合开放较宽的 Raw Access；安全敏感部署则可能需要限制可写 Key、增加 Review，或者强化 Audit Treatment。

这里最重要的是区分 Expression 与 Privilege。调用方需要 Raw Syntax Channel，可能只是因为 Serializer 无法表达某种 Literal Structure；这并不意味着调用方理应覆盖所有由后续执行阶段拥有的 Setting。

所选顺序已经保留了一条有价值的边界：SDK-managed 与 Thread/Run-specific Setting 位于 Raw Override 之后。更强的系统还可以按 Key Family 声明 Ownership，并为最终 Effective Configuration 提供 Provenance。

Duplicate Key 同样不应该被一刀切认定为错误。重复配置可能是合法 CLI 技巧；但对安全相关 Setting，至少应该让 Audit Tool 清楚展示最终值为何胜出。

## 证据边界

现有证据仅覆盖 Codex TypeScript SDK Command Construction 与回归测试，并没有证明其他 SDK 或 Direct CLI 具有相同 Precedence。所选变更没有为任意 Raw TOML 增加 Semantic Validation、Signing、Policy Review 或 Provenance Trace。

因此，本文提出的 Effective-config Trace 属于工程解释，而不是所选 Patch 已经提供的功能。

## 仍待回答的问题

在安全敏感部署中，Application-level Raw Channel 应允许控制哪些 Key？SDK 能否在不泄漏 Secret 的情况下暴露 Effective-config Provenance？重复的安全相关 Raw Key 应触发 Warning、Reject，还是只需要更强的 Audit Evidence？

Deterministic Chain 是必要条件，因为配置冲突必须可预测地解析；Provenance 则让这种可预测性真正变得可解释。
