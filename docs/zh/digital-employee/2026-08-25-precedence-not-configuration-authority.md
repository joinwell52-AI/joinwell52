---
title: "优先级不是配置授权"
date: '2026-08-25'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "When a security-sensitive runtime component becomes authoritative for credential-provider state, how should a layered configuration system prevent a lower-trust project layer from regaining control through ordinary precedence rules?"
summary: "Codex 的一项已合并变更说明，安全敏感配置需要 Ownership Boundary，而不只是 Merge Order。Broker 启用时，项目层不再能提供受保护输入；但这不能证明通用 Credential Isolation 或签发后的 Secret Containment。"
sources:
  - research/analysis/Q-20260825-01-broker-owned-config-authority-boundary.md
item_id: "Q-20260825-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-25-precedence-not-configuration-authority-cover-v2.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-25-precedence-not-configuration-authority-cover-v2.png"
  kicker="数字员工 · 每日研究"
  title="优先级不是配置授权"
  summary="Codex 的一项已合并变更说明，安全敏感配置需要 Ownership Boundary，而不只是 Merge Order。Broker 启用时，项目层不再能提供受保护输入；但这不能证明通用 Credential Isolation 或签发后的 Secret Containment。"
  version="Q-20260825-01"
  status="Daily Runtime V5 · 2026-08-25"
  languageHref="/en/digital-employee/2026-08-25-precedence-not-configuration-authority"
  languageLabel="English"
/>

# 优先级不是配置授权

分层配置通常回答一个问题：多个来源同时提供值时，哪个值获胜？对于安全敏感输入，这个问题不够。即使项目层输掉最终的优先级比较，它仍可能在 Winning Value 被使用之前，通过 Shell Startup、Provider Selection 或 Environment Construction 影响凭据解析。

Codex 在 2026-08-25 合并的一项维护者变更把这个区别变得具体。当 Credential Brokering 实际启用时，项目控制层会失去部分 Shell Snapshot、Profile Setting 与受保护环境键的控制权，其中包括 `ZDOTDIR`、`BASH_ENV` 以及 Broker 识别的 Provider Input；当 Brokering 禁用时，普通项目配置仍然保留。

有边界的设计结论是：**Configuration Precedence 只排列已被允许参与的值；Configuration Authority 决定谁可以参与决策。** 当 Effective Policy 把 Provider 与 Startup Input 交给 Credential Broker 后，较低信任的项目层不应再靠提交竞争值取回控制权。

## 获胜的值，也可能让错误的参与者留在场内

假设 Managed Configuration 以最高优先级指定目标 Credential Provider，仓库同时提供能够影响 Provider 访问方式的 Shell Startup Setting 与 Environment Variable。如果 Merge Algorithm 只是选中 Managed Value，却保留全部低层输入，那么项目仍在参与本应由 Broker 拥有的决策。

这就是为什么只谈 Precedence 会误导。它先默认每一层都是合法参与者，冲突发生后才决定谁赢。安全边界必须提前回答：在当前 Runtime State 中，这一层是否被授权表达该输入？

所选变更以有界方式回答了这个问题。它区分 `Unconfigured`、`Disabled` 与 `Enabled` Broker State，先解析 Effective Network Requirement，只在 Broker 真正拥有 Authority 时抑制项目层。关键动作不是某个值压过另一个值，而是 Broker-owned Decision Surface 被移出项目控制。

## Effective State 把 Ownership 变成可执行规则

按状态抑制可以避免另一个错误：把安全边界做成永久 Global Denylist。Disabled Branch 中，没有 Broker 接管这些决策，项目 Shell Setting 仍然合法；Enabled Branch 中，同一设置不再从该层接收。

这让 Authority 在已证明边界上具有单调性：启用 Broker 可以收窄低信任层的控制范围，项目不能通过普通 Merge 再次扩大自己的权力；明确禁用 Broker 才恢复正常配置面。

Reload 与 Resume 时，执行顺序同样关键。Runtime 应先重新计算 Effective Broker State，再决定哪些层可参与，最后才合并已准入的值。如果在 Authority 尚未确定时就重新应用项目配置，系统会重新打开边界原本要关闭的窗口。

Enabled 与 Disabled 两条分支的 Regression 也是论证的一部分。它们说明规则跟随 Ownership State，而不是在所有状态下机械删除固定设置。

## Authority Boundary 同时带来维护与审计义务

Protected Key Filtering 的完整性取决于 Classifier。Provider 会演进，也会增加新的 Environment Input。如果 Ownership Metadata 不随接口变化，今天正确的列表可能在未来悄悄出现漏洞。

更强的设计可以把 Authority Ownership 绑定到 Typed Configuration Capability，例如 Provider Endpoint、Credential Source、Startup-file Redirection 与 Trusted Binding。Runtime 据此按能力拒绝低层输入，而不是完全依赖不断增长的字符串列表。

抑制行为也应可观测，但不能暴露值。Operator 需要知道项目尝试设置了 Broker-owned Input、哪个 Policy 抑制了它，以及当时哪个 Authority State 生效；不需要看到可能携带 Secret 的 Value。这样的事件既支持 Reload 核查与 Incident Review，也能保持 Confidentiality。

最后，Ownership 必须逐层说明。现有证据移除的是已展示的项目层，并没有说明 User、Host、Managed-policy 或 Process-level Source 是否仍被有意授权。这些是独立的 Trust Decision，不能从项目层 Hardening 自动推导。

## 有界边界不是通用 Credential Isolation

已合并实现与测试证明的是 Brokering 启用时有用的项目/配置边界。它们不能证明端到端 Non-exfiltration、对所有更高来源的隔离、Transactional Shell Execution，或凭据合法签发后的 Containment。

把这个边界说清，可以避免安全措辞超过证据。可辩护结论是：在 Enabled Branch 中，已展示的低信任层不能控制受保护的 Broker 与 Startup Input。剩余问题仍是工程问题：Protected Set 如何演进，哪些高层仍有 Authority，Reload 是否先重算 Ownership，以及系统如何在不记录 Secret 的前提下审计 Suppression。

**一手证据：** [Codex 已合并提交 fd1bf504](https://github.com/openai/codex/commit/fd1bf50410623cb25dec8e172ba8ae3ec679397a)。公开实现与分支 Regression 支持这一有界 Configuration-authority 结论，但不是通用 Credential Isolation 的独立验证。
