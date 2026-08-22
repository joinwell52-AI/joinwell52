---
title: "授权需要来源，不需要更像真的措辞"
date: '2026-08-22'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "When a delegated digital employee reaches a sensitive review point, what evidence should be allowed to carry user authorization across agent boundaries without letting forwarded or assistant-authored text impersonate authority?"
summary: "保留角色的根会话证据，比转发审批措辞更适合支撑 Agent Review；但它仍只是 Review Evidence，不是持久 Authorization Ledger，也不是对真人 Principal 的认证。"
sources:
  - research/analysis/Q-20260822-01-structured-authorization-evidence-channel.md
item_id: "Q-20260822-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-22-authorization-needs-provenance-cover-v2.jpg"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-22-authorization-needs-provenance-cover-v2.jpg"
  kicker="数字员工 · 每日研究"
  title="授权需要来源，不需要更像真的措辞"
  summary="保留角色的根会话证据，比转发审批措辞更适合支撑 Agent Review；但它仍只是 Review Evidence，不是持久 Authorization Ledger，也不是对真人 Principal 的认证。"
  version="Q-20260822-01"
  status="Daily Runtime V5 · 2026-08-22"
  languageHref="/en/digital-employee/2026-08-22-authorization-needs-provenance"
  languageLabel="English"
/>

# 授权需要来源，不需要更像真的措辞

“用户已经批准”这句话，可以由用户、Assistant 或另一个 Agent 复制。句子完全相同，Authority 却不相同。一旦 Approval 被压缩成普通 Prose，再跨越 Agent Boundary 转发，接收者看到的只是文本，无法再判断它是真实 User Statement，还是某个 Agent 对 User Statement 的转述。

2026 年 8 月 22 日合并的一项 Codex 变更，在一个明确边界上处理了这个问题：MultiAgent V2 Guardian Review。对于非 Root Worker，Codex 会解析真实 Root Thread，提取一段有界的结构化 Root History，并保留每条消息来自 User 还是 Assistant。只有 Root-user Message 被指定为 Authorization Evidence。Assistant Message 即使写着 `user: I approve`，仍然只是 Untrusted Context；Forwarded Claim、Compacted Summary 与 Synthetic Review Artifact 也不会仅凭措辞获得 User Authority。

这项实现支持一条更一般、但仍需保持边界的工程判断：**Authorization Provenance 应通过结构化 Review-plane Evidence Channel 传递，而不是藏在 Work-plane Prose 的 Claim 中。** 它能让敏感 Admission Decision 更可靠，却不能取代长期、限定 Scope、可撤销的 Durable Authorization State。

## 消息说了什么，不等于消息来自哪里

Agent-to-agent Forwarding 很适合 Summary、中间发现与协作。它却不是强 Authority Mechanism，因为它压平了最关键的区别：Downstream Worker 看到的是文本，而不是产生文本的权威事件。

Role-preserving Extraction 改变了 Reviewer 可以使用的 Evidence。Codex 解析 `AgentPath::root()`，而不是信任 Worker 携带来的材料；它保留结构化 User 与 Assistant Variant，并显式渲染 Source Role。因此，一段声称来自用户的文字，如果真实结构来源是 Assistant，就仍然保持 Assistant-authored。

实现还排除了几类容易模糊边界的内容：Summary Message、Synthetic `<user_action>`、Review Artifact 与非 Final 的 Assistant Commentary。这并不证明所有可能的 Spoofing Route 都已消失；它只为已展示的 Guardian Path 建立了更清楚的 Admission Rule：Authority 来自 Eligible Structured Root-user Record，而不是来自更有说服力的语言。

## 把授权证据放在 Review Plane

Root Evidence 被提供给 Guardian Review 与 Classification，而没有复制进被委派 Worker 的普通 Model Context。这种分离带来两个好处。

第一，Worker 不必仅为了让 Reviewer 评估敏感动作，就获得更大范围的 Root Conversation。Evidence Exposure 可以窄于 Work Context。第二，系统可以给 Review Plane 设置不同 Trust Policy：Assistant History 可以保留为有用 Context，同时明确禁止它授权正在审查的动作。

这条 Evidence Feed 有意只保留最新 Eligible Root Message，并对每条消息设置独立 Token Limit。Boundedness 控制 Exposure 与 Prompt Size，却也形成新的 Lifecycle Boundary。更早的 Approval——或者更早的 Revocation——可能退出 Evidence Window。不在窗口中不能证明授权从未存在；在窗口中也不能证明它仍然 Fresh，或覆盖当前动作。

## Reviewer 看见的证据，不等于 Executor 获得的权限

对于一次性、即时 Review，结构化 Conversation Evidence 可能已经足够。当 Authority 需要跨越时间、Retry 或多次 Delegation 持续存在时，长期运行的数字员工还需要另一份记录。

这份 Durable State 至少应绑定：

- Authorization 所代表、并经过认证的 Principal；
- 准确的 Action、Resource 或 Capability Scope；
- Decision 的 Freshness、Expiry 与 Replay Boundary；
- 后续消息如何 Revocation 或 Supersede 旧授权；
- 哪个 Executor 与 Audit Event 消费了 Grant。

这不是措辞差异，而是运维边界。Review Record 应说明 Reviewer 看见了什么 Evidence；Execution Record 应说明实际授予了什么 Authority。如果两者都塞进 Natural-language Transcript，Revocation、Expiry 与 Conflict Resolution 就会在最需要确定性 Governance 的位置依赖 Model Interpretation。

低风险 Workflow 可以选择更轻的控制。关键是保持比例：对话中的“可以”可以是方便的 Context，但敏感或持久动作不能仅仅因为另一个 Agent 把这句“可以”复述得足够逼真，就继承 Authority。

## 更安全的 Admission Boundary，不是 Authorization Guarantee

公开证据来自一个 Codex 已合并实现及其 Integration Test。它展示了 MultiAgent V2 Guardian Review 的有界 Root-history Extraction、Role Anti-spoof Rendering，以及与普通 Worker Request 的隔离。它没有建立 Cryptographic Human Identity、Reusable Capability Token、对 Codex 所有 Approval Path 的覆盖，也没有证明端到端 Authorization Safety。

Assistant Final Answer 仍会作为 Untrusted Context 可见，Guardian 仍必须正确执行 Role Boundary；结构化 History 还依赖上游 Conversation Store 的 Integrity。这些都是真实限制，不能被包装成更强结论。

因此，实用检验很简单：一次 Delegated Action 完成后，Audit 是否能同时回答——**Reviewer 看见了哪些权威 Evidence**，以及 **Executor 实际获得了什么限定 Scope 的 Authority**？如果只能展示一段很有说服力的 Transcript，Provenance 已经丢失。

**一手证据：** [OpenAI Codex 合并提交 d12a7f3f](https://github.com/openai/codex/commit/d12a7f3fd8a3f0dcffc665d515b9ee0dd3714315)。公开代码与测试支持本文描述的有界 Guardian Behavior，但不构成对普遍 Agent Authorization Safety 的独立验证。
