---
title: "用户点了“始终允许”，系统真正保存了什么？"
date: "2026-08-12"
column: "industry-architecture"
category: "daily"
article_type: "technical-analysis"
edition: "research-center"
research_question: "How should an approval architecture unify decision vocabulary without conflating a user's requested consent scope with the policy state that was actually applied?"
summary: "共享审批类型可以传递用户意图，却不能证明策略已经按相同范围生效。可治理的审批记录必须同时保存请求决定与实际结果。"
sources: "https://github.com/openai/codex/commit/67afc7967463282af932be1984df9e16cc55ed99; research/analysis/Q-20260812-02-decision-intent-effective-policy.md; research/reading/Q-20260812-02-reviewdecision-mcp-policy-amendment.md"
item_id: "Q-20260812-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-12-consent-effective-policy.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-12-consent-effective-policy.png"
  kicker="行业架构 · 每日研究"
  title="用户点了“始终允许”，系统真正保存了什么？"
  summary="共享审批类型可以传递用户意图，却不能证明策略已经按相同范围生效。可治理的审批记录必须同时保存请求决定与实际结果。"
  version="Q-20260812-02"
  status="Daily Runtime V5 · 2026-08-12"
  languageHref="/en/industry/2026-08-12-consent-effective-policy"
  languageLabel="English"
/>

# 用户点了“始终允许”，系统真正保存了什么？

审批界面给出三个选项：仅本次允许、当前会话允许、始终允许。用户选择第三项，工具也顺利执行了。审计日志随后只留下一个值：`ApprovedMcpPolicyAmendment`。

这个值证明用户表达了跨会话授权意图，却还没有回答最重要的运营问题：策略是否真正写入？匹配范围是什么？如果持久键不可用，系统最终是失败、降级到会话，还是只批准了当前调用？

OpenAI Codex 的[所选变更](https://github.com/openai/codex/commit/67afc7967463282af932be1984df9e16cc55ed99)把 MCP 审批迁移到共享 `ReviewDecision`，同时保留当前调用、会话和 MCP 持久策略修改等不同结果；它还明确让 MCP 专用决定在 Shell、Command、Network 等无关审批路径上 Fail-closed。这个改动解决了“各工具说不同语言”的问题，却也让另一个边界更清楚：**共享的决定值是控制意图，不是持久策略已生效的回执。**

## 一次“始终允许”要穿过三道门

审批结果从用户界面走到持久策略，至少经过三个语义不同的阶段：

| 阶段 | 需要回答的问题 | 可能改变结果的条件 |
|---|---|---|
| Requested decision | 用户请求了什么范围？ | 用户选择、Guardian 或其它决策来源 |
| Normalized decision | 当前 Domain 与 Approval Mode 允许什么？ | 领域合法性、模式限制、企业策略 |
| Effective policy | 最终保存或记住了什么？ | Persistent Key、Session Key、存储成功与 Revision |

来源显示，Session 或 Persistent Scope 可能被 Approval-mode Normalizer 收窄为普通 `Approved`；缺少 Persistent Key 时，持久请求还可能回退为 Session Memory。因而，“用户点了始终允许”和“系统跨会话保存了策略”是两个需要分别取证的事实。

## 共享类型统一的是语言，不是权限

每个工具维护私有审批枚举，局部语义通常很清楚，代价是 UI、Hook、Guardian 和审计层持续翻译。共享 `ReviewDecision` 能把拒绝原因、超时、取消以及不同批准范围带到同一个控制面，这是实质进步。

但 Sum Type 中存在某个 Variant，并不意味着所有 Consumer 都有权解释它。MCP 的持久策略决定进入 Command Execution Adapter 时，正确行为不是“既然属于 Approved 就执行”，而是认定语义错位并拒绝。

这说明共享协议需要两种稳定性同时存在：线上传输使用统一词汇；每个领域边界仍保留自己的合法取值集合。只做前者会把互操作性变成权限扩散。

## 审计记录至少要同时回答两件事

如果请求范围可能被归一化、降级或异步持久化，单一 `decision` 字段不足以支持事后解释。一条更完整的记录可以是：

```yaml
requested_decision: approved_mcp_policy_amendment
effective_scope: session
normalization_reason: persistent_key_unavailable
policy_revision: null
persistence_outcome: downgraded
```

前两个字段把用户意图与系统能力分开；原因字段解释二者为何不同；Revision 或持久回执则证明策略存储实际发生了什么。

这不是为了增加日志体积，而是为了避免两种相反的错误：系统把一次临时批准误报成长期政策；或者用户以为策略已保存，却在下一个 Session 再次收到审批请求。

## Fail-closed 最有价值的地方是语义错位

传统安全检查常关注一个决定是 Allow 还是 Deny。共享控制面更容易出错的地方却是：一个在 A Domain 合法的 Allow，被 B Domain 当成了自己的 Allow。

因此，Adapter 应校验“这个 Actor 对这个资源能否产生这个 Effect”，而不只是匹配字符串前缀 `Approved`。未知 Variant、MCP 专用 Variant 进入 Generic Tool Path、缺少必要 Policy Key 等情况，都应形成明确拒绝或降级事实，不能靠默认分支猜测含义。

拒绝、超时与取消也不应压成同一个 `false`。它们在重试、用户责任和审计上代表不同终态；统一协议的价值恰恰在于保留这些差异，而不是再次抹平。

## 双记录不是所有审批的默认税

对一次性、同步、没有范围转换的审批，`requested` 与 `effective` 可能完全相同，额外字段只增加协议负担。若 Consumer 明确知道 Domain，且持久化结果能在同一事务中确认，单一决定也可能足够。

双记录真正必要的条件是至少出现一个分叉点：范围可能被 Policy 收窄；持久化可能异步、失败或降级；多个 Domain 共用一种决定类型；或者审计必须解释跨 Session 行为。此时省略 Effective Scope 不是简化，而是删除了决定能否被执行和保存的关键事实。

## 验收不能停在“用户已经同意”

要验证这类审批架构，应构造四组反例：持久请求被模式降级、Persistent Key 缺失、MCP 专用决定误入 Shell Path、策略写入在决定接受后失败。验收结果必须分别显示 Requested Decision、Normalized Decision、Effective Scope 与 Persistence Outcome。

当前证据没有建立完整的策略匹配、撤销、企业覆盖、并发修改和同步模型，也不包含独立安全复现。可以成立的是更窄的架构判断：**共享审批词汇负责表达意图；领域 Adapter 决定语义是否合法；实际生效范围与持久结果必须另有证据。**

### 证据与引用

- **源码已经显示：**Codex 的审批协议、实现和同提交测试区分了多种审批结果，并会在语义错位时拒绝。材料公开可核对，但仍是项目自身证据，不是独立复核。
- **源码尚未证明：**完整的策略匹配、撤销、企业覆盖、并发修改和同步模型仍未建立。
- **本文建议进一步验证：**同时记录用户请求范围、实际生效范围和 Policy Revision，检验它是否改善审计与故障解释。

**参考资料：**

- OpenAI Codex，[`67afc79` — Use `ReviewDecision` for MCP tool approvals](https://github.com/openai/codex/commit/67afc7967463282af932be1984df9e16cc55ed99)，代码提交及同提交测试变更。
