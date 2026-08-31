---
title: Weekly 007 — 恢复不是复原，而是重新准入
date: '2026-08-30'
column: digital-employee
category: weekly
article_type: research-brief
edition: research-center
research_question: '当 Agent Runtime 从持久状态恢复时，在连续性重新变成执行之前，哪些条件必须重新成立？'
summary: '8 月 24 日至 30 日的 21 篇已完成证据验证的 Daily Research 指向同一个边界：Recovery 不等于 Restoration。Checkpoint、缓存策略、重建上下文、可信路径和 Scheduler 状态可以保留有价值的证据，但执行必须依据当前 Authority、Ownership、Occurrence Identity、Lifecycle Closure 与 Replay Integrity 重新准入。'
sources:
  - 2026-08-24 through 2026-08-30 Daily Runtime V5 publications
  - research/intelligence/p2-runs/2026/08/2026-08-30-p2-special.json
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
cover: '/assets/covers/weekly-007-recovery-is-readmission-cover-v2.png'
---

<ArticleCover
  image="/assets/covers/weekly-007-recovery-is-readmission-cover-v2.png"
  kicker="Weekly Research · 007"
  title="恢复不是复原，而是重新准入"
  summary="持久状态可以重建连续性，但不能单独授予当前执行权。"
  version="W007"
  status="Published 2026-08-30"
  languageHref="/en/research/weekly/weekly-007"
  languageLabel="English"
/>

# Weekly 007 — 恢复不是复原，而是重新准入

Checkpoint 还在，Session 可以重建，缓存策略仍能读取，Scheduler 仍写着 `Running`，可信路径能够证明 Skill 来自哪里，旧的 Approval 也可能还保存在本地。

这些事实在恢复时都可能有用，但没有任何一个事实能够单独回答真正重要的问题：

> **这次执行现在还可以继续吗？**

8 月 24 日至 8 月 30 日连续七天、共 21 篇已完成证据验证的 Daily Research，从不同机制反复指出同一个边界：**状态连续性和执行权限是两个不同的控制面。**

如果 Runtime 把两者合并，它完全可能恢复正确的字节、正确的标识符、正确的上下文和正确的历史，却仍然继续了错误的工作：使用已经过期的权限、绑定到错误的 Occurrence、继承已经耗尽的预算、在旧 Worker 尚未完成清理时重复执行，或者加载一个“确实持久化了、但已经无法可靠重放”的 Checkpoint。

上一期 Weekly 006 的判断是“权限需要血缘链”。本周进一步得到一个更严格的结论：

> **Lineage 可以解释状态从哪里来，但 Recovery 仍然必须进行一次新的 Admission。**

因此本周的核心判断是：

> **Recovery 应被建模为 Re-Admission。持久状态只提供重建证据；是否允许重建后的状态重新进入执行，要由当前 Authority、Ownership、Occurrence Identity、Lifecycle Closure、Budget Scope 与 Replay Integrity 共同决定。**

## 本周证据范围

本次只使用 **2026-08-24 至 2026-08-30** 七个已经完成 `publication = Completed` 的 Daily Runtime 日，共 **21 篇正式 Research Center 文章**。

| 日期 | 数字员工 | 行业架构 | 开源工程 |
|---|---|---|---|
| 8/24 | 重复失败不是新证据 | 指令血缘不等于指令权限 | Cancellation 结束等待，不结束 Ownership |
| 8/25 | Precedence 不等于 Configuration Authority | Checkpoint 不是恢复许可 | 找到资源不等于拥有资源 |
| 8/26 | 前台完成不等于 Workflow 完成 | Permission Authority 属于 Attachment | Copy Options，保留 Client |
| 8/27 | Running 是证据声明 | Authority Context 必须由 Host 铸造 | Trusted Path 证明来源，不证明批准 |
| 8/28 | Delegation Budget 属于 Root Objective | Cached Policy 是证据，不是当前权限 | Approval Cache 需要 Authorization Identity |
| 8/29 | 恢复 Context 不等于恢复 Authority | Trust 必须改变可执行面 | Timeout 必须关闭它拥有的 Lifecycle |
| 8/30 | Resume 需要的不只是 Checkpoint | 更像真的证据也不会自动让行动安全 | 持久 Checkpoint 仍可能不可恢复 |

P2 通道另外检查了本周全部 4 个到期的 `biweekly-or-release` 对象。4 个对象均完成终态检查，2 个 monthly 对象由于 8 月已经完成月度基线，本周不到期；没有对象达到 5 分触发阈值，因此没有执行完整 P2 Special Study。本周 Weekly 的主要判断来自 Daily Research 的跨来源重复机制，而不是一个新的 P2 专项研究。

## 最危险的误判：把“可以重建”当成“可以继续”

Recovery 体系通常从一个朴素目标开始：不要丢工作。随后很容易形成一条看似合理、实际上危险的推理链：

```text
状态存在
→ 状态很新
→ 状态可以重建
→ 状态可以安全恢复
→ 执行可以继续
```

本周证据在这条链路的多个位置把它打断。

Session Append 在中断后可能处于“是否已持久提交未知”的状态；这时 Checkpoint 并不足以授权继续，必须先与权威历史对账。完整 State Snapshot 可以恢复 Context Continuity，却不能自动恢复当前 Execution Authority。DeltaChannel 类型的增量 Checkpoint 即使所有文件都持久化了，只要 Seed Snapshot、Ordered Writes、Reducer Identity 或 Migration 假设失效，仍然不可恢复。Cached Policy 即使仍然可读，在系统明确要求最新 Remote Authority 时也只能作为证据。Workspace Trust 如果已经变化，Capability Surface 就必须在恢复时随之收缩。

这些问题并不是“持久化失败”。很多时候，持久化恰恰成功了。真正的问题是：**Persistence 回答了错误的问题。**

Recovery 至少需要两类完全不同的证明：

```text
Reconstruction Proof：旧状态能否被忠实重建？
Admission Proof：重建后的状态在当前条件下是否允许执行？
```

第一个解决连续性，第二个解决权限。

## Checkpoint 是候选证据，不是 Continuation Token

### 不确定的持久化必须先对账

8 月 25 日行业架构文章研究了 Session Append 在中断后无法确认是否真正提交的情况。安全路径既不是盲目 Replay，也不是乐观 Continue，而是把“不确定”本身变成持久 Recovery State，并在继续 Model Execution 前先解析权威历史。

因此：

```text
unknown commit outcome
≠ safe retry
≠ safe continue
```

Runtime 必须先知道“到底已经发生了什么”，再决定下一步。

### Context 恢复权与 Execution Authority 必须分开

8 月 29 日数字员工文章把这个边界进一步明确：符合条件的完整 Snapshot 可以用于重建上下文，但这种 Reconstruction Evidence 不能自动升级为当前 Permission。

恢复后的 Worker 可能完全知道自己之前在做什么，却仍然不能继续，因为 Policy Epoch 已经改变、Principal 已经改变、Workspace 不再可信、Grant 已被撤销、Budget 已耗尽，或者原来的 Occurrence 已经不再存活。

一个实用设计原则是：

> **先恢复描述性状态，再恢复可执行状态。**

History、Memory、局部变量可以先重建；Tool、Privileged Capability 与 Pending Side Effect 则应在新的 Admission 通过以后再物化。

### Durable 不等于 Replayable

8 月 30 日工程文章研究 Delta-style Checkpoint。它把一个 Checkpoint 从自包含 Snapshot 变成“Seed + Ordered Write Chain + Reducer”的引用图。这里每个 Blob 都可以真实存在、真实持久化，但整体仍然可能不可重放。

因此恢复还需要 Replay Integrity：

```text
Seed 可达
+ Write Chain 完整且顺序正确
+ Reducer Identity 兼容
+ Migration 有效
= Checkpoint 可重建
```

只有这一步通过以后，才轮到判断它能不能继续执行。

## 当前 Authority 必须压过“仍然有用”的旧证据

### 安全敏感配置需要 Ownership，不只是 Precedence

8 月 25 日数字员工文章表明，当 Broker 对 Credential Provider State 具有权威时，仅靠普通配置合并顺序是不够的。低信任 Project Layer 如果仍然可以提供受保护字段，就可能通过 Precedence 重新夺回控制。

更可靠的方法不是“让安全层优先级更高”，而是让低信任层根本没有资格提供这类字段。

这对 Recovery 同样适用：重建 Layered Configuration 时，不仅要问“哪个值赢”，还要问“这个 Layer 现在是否仍有资格提供这一类值”。

### Cached Policy 可以保留证据价值，但失去授权能力

8 月 28 日行业架构文章区分了 Cache Readability 与 Authority Admissibility。过期 Policy 仍可以用于诊断、比较和解释，但当系统要求 Fresh Remote Authority 时，它不应静默维持旧 Capability。

也就是说：

```text
fresh authority unavailable
→ cached policy remains evidence
→ privileged executable surface contracts
```

而不是：

```text
fresh authority unavailable
→ silently reuse old permission
```

### Trust 必须在 Capability Materialization 前生效

8 月 29 日行业架构文章把 Workspace Trust 从 UI 标签变成了实际 Admission Filter：限制性信号优先，未解析 Trust 视为 false，错误配置失败，最终 Effective Configuration 在 Capability 物化之前被缩小。

这形成一个非常适合 Recovery 的原则：

> **Re-Admission 必须发生在旧 Tool Surface 被重新交给 Worker 之前，而不是之后。**

### Authority Evidence 应由真正拥有 Authority 的组件重新签发

8 月 27 日行业架构文章展示了 Host-minted Context：调用方自己携带的 Access Context 被移除，Host 根据当前 Account Access 重新验证，并仅在全部 Capability Predicate 满足时注入。

恢复状态中可能保存着旧 Grant 的序列化表示，但 Replay 这些表示不能等价于重新获得 Grant。当前 Authority Evidence 应由真正拥有决策权的组件重新生成。

## Recovery 还需要 Occurrence Identity 与 Owner Identity

即便权限是当前的，Runtime 仍可能恢复“正确工作”的错误实例。

### Nested HITL 需要复合 Continuation Identity

8 月 30 日数字员工文章表明，嵌套 HITL 的 Response 不能只靠 Checkpoint 绑定。它至少需要 Workflow Frame、具体 Call Occurrence 与 Branch Identity，再单独核验当前 Authorization，之后才能决定 Continue、Pause 或 Replay。

可以抽象成：

```text
workflow_frame
+ occurrence_id
+ branch_identity
+ current_authorization
```

这说明 Continuation Authority 属于一个具体、仍然有效的执行 Occurrence，而不是一个通用 Task Name、Prompt 或旧 Checkpoint。

### Permission Authority 属于 Attachment

8 月 26 日行业架构文章把 MCP Permission Profile 绑定到 Enabled Server Attachment。这样恢复时就不应该从旧的全局 Permission Cache 复制权限，而应从当前 Attachment Identity 重新解析有效权限。

### Delegation Budget 属于 Root Objective

8 月 28 日数字员工文章把资源消耗责任绑定到 Root Objective。Descendant 仍然是实际 Usage 的来源，但真正授权这次委派的根目标负责累计 Budget。

如果恢复新的 Child Worker 时把预算重新置零，那么 Recovery 就通过“换 Worker”意外扩大了 Authority。因此 Budget State 也必须按正确 Ownership 层级恢复和重新准入。

## Lifecycle 没有关闭，就谈不上安全恢复

### Cancellation 结束等待，但不结束 Ownership

8 月 24 日工程文章把 Caller Cancellation 与 Owner Cleanup 区分开。Teardown 期间收到 Cancellation 时，Owner 先完成有边界的本地清理，再重新抛出 Cancellation。

这意味着新 Worker 接管前，旧 Owner 的资源必须要么被明确移交，要么被明确关闭。

### Foreground Completion 不等于 Workflow Completion

8 月 26 日数字员工文章把 Tracked Detached Work 纳入 Parent Terminal Truth。主函数返回并不代表整个 Workflow 已终止，只要仍有 Parent Owned 的动态工作，Parent Success 就不能成立。

因此 Recovery Controller 不能用“旧 Worker 不见了”推断“旧工作结束了”。它必须知道旧 Worker 还拥有什么，以及这些 Ownership 是否真正到达 Terminal State。

### Timeout 必须关闭自己拥有的 Process Group

8 月 29 日工程文章把同一原则延伸到 Process Group。Timeout / Cancellation 共享受控 Cleanup，而不是只杀 Direct PID。

对带 Shell、Browser、MCP Server 或子进程工具的 Agent Runtime 来说，如果旧执行的 Descendant 仍然活着，新 Worker 的 Replay 就可能制造重复外部副作用。

### Running 是一个需要证据的状态

8 月 27 日数字员工文章指出，Scheduler Event、Worker Claim、Process Startup 与真正 Ready 是不同的事实。不能因为 Scheduler 已经安排任务就对外声明 `Running`。

Recovery 同样如此：Fresh Slot 或 Loaded Checkpoint 也不能直接推出 `Running`。至少需要一个新的 Worker Claim，以及 Runtime 自己定义的 Readiness Evidence。

## 更多、更可信、更漂亮的证据，也可能仍然是错误类型的证据

本周还有三篇文章防止我们把 Recovery 简化成“多收集证据”。

8 月 24 日数字员工文章显示，一个通用 Terminal Condition 在 Cleanup 阶段被再次生成，并覆盖了更具体的 Guardrail Failure。重复观察并不等于新证据，更弱的旧事实不会因为“最后写入”就变得更权威。

8 月 27 日工程文章显示 Trusted Path 可以证明 Invocation Provenance，但不能证明 Skill 内容安全、字节不可变或当前已经批准。Provenance 和 Authorization 是不同 Evidence Identity。

8 月 30 日行业架构文章进一步给出跨 12 个前沿模型的预印本证据：专业化 Evidence Display 会显著提高模型对不可知问题的行动承诺，而 Fabricated Panel 与真实 Panel 的报告效果相近，Stated Belief 变化却很小。

这对 Recovery 的提醒非常直接：

> **Recovery Gate 必须根据能支持“是否可以行动”这个命题的控制证据做资格判定，而不能根据恢复状态看起来多完整、多可信、多新或多专业。**

## 可复用模型：Recovery Admission Envelope

本周证据支持一个紧凑的控制模型：

```text
RecoveryCandidate = {
  reconstructable_state,
  state_lineage,
  current_authority,
  owner_identity,
  occurrence_identity,
  lifecycle_closure,
  budget_scope,
  replay_integrity,
  evidence_freshness
}
```

受治理的恢复顺序可以写成：

```text
reconstruct
→ verify replay integrity
→ resolve prior ownership / lifecycle
→ refresh current authority
→ bind owner + occurrence + branch
→ restore budget and capability scope
→ materialize executable surface
→ claim fresh execution
→ Running
```

危险版本则是：

```text
checkpoint exists
→ load
→ Running
```

两者的差别，就是普通 Continuity 与 Governed Continuity 的差别。

并不是所有系统都需要完整字段。只读低风险 Assistant 可以更轻；但能够写代码、发消息、修改企业数据、调用外部工具、长期运行数字员工任务的 Runtime，需要更强的 Recovery Evidence，因为一次错误恢复就可能恢复权限、重复 Side Effect 或制造幽灵状态。

## 相比上周，真正新增了什么

Weekly 006 讨论的是 State Transformation 中如何保留 Authority Lineage。Weekly 007 讨论的是当 Transformation 变成“非连续事件”时怎么办：Crash、Timeout、Cancellation、Checkpoint Restore、Policy Refresh、Worker Replacement、Human Resume。

三者关系可以写成：

```text
Lineage 告诉我们什么东西活下来了
Reconstruction 告诉我们什么东西能够重建
Re-Admission 告诉我们什么东西现在可以执行
```

它们不能互相替代。

有完整 Lineage 的 Runtime 仍可能恢复一个已经撤销的 Tool Grant；有当前 Permission 的 Runtime 仍可能因为 Delta Checkpoint 丢了 Seed 而无法重建；两者都正确，旧 Process Group 没关闭，依然可能重复执行；Lifecycle 也关闭了，但 HITL Response 绑错 Occurrence，仍然会恢复错误分支。

因此可靠 Recovery 需要的是一组证明的合取，而不是一个万能 `resume_token`。

## 仍然存在的张力

### Fresh Authority 与 Availability

当前 Policy 可能临时不可达。高风险操作通常应该收缩 Capability，但完全 Fail-closed 会让低风险工作也不可用。因此系统必须显式声明哪些操作允许使用有时限的 Stale Evidence，哪些必须 Fresh Authority。

### 强 Occurrence Identity 与合法迁移

严格绑定提升 Replay 安全，却会增加 Workflow Migration 的复杂度。旧 Occurrence 映射到新 Execution Epoch 时，这个 Mapping 自身应成为可审计的 Authority Transition，而不是字符串替换。

### Cleanup 完整性与恢复时限

无限等待外部 Cleanup 会让 Recovery 永远不发生。更现实的目标是 Bounded Ownership Closure：明确记录本地已关闭什么、什么仍不确定、哪些外部效果必须在 Replay 前对账。

### Replay Integrity 与存储成本

Self-contained Snapshot 简化恢复但成本高；Delta Chain 节省存储，却引入 Dependency 与 Migration 风险。正确选择取决于“Checkpoint 不可恢复”的代价与验证成本。

### Root Accounting 与弹性委派

Shared Budget 防止 Child 通过重启逃逸限制，但某些任务确实需要在 Recovery 后追加资源。那应该是 Root Objective 的 Fresh Grant，而不是 Worker Replacement 自动重置预算。

## 本周预测

以下是 Research Center 基于重复证据形成的判断，不代表任何单一来源的原始主张。

1. **Resume Protocol 会出现显式 Re-Admission State。** `Restored`、`Reconciled`、`Admitted`、`Claimed` 与 `Running` 会逐渐拆开。
2. **Checkpoint 会显式携带 Replay Dependency。** Seed Identity、Reducer/Version、Write Completeness 与 Migration Status 将成为恢复元数据。
3. **高风险 Capability 的 Policy Cache 会默认失去授权能力。** Cache 继续作为诊断证据存在，但不能静默维持特权执行。
4. **Worker Lease 会变成证据化机制。** 一个长期不更新的 `Running` 将需要 Heartbeat、Claim Freshness 或 Checkpoint Progress，而不是只依赖最大运行时长。
5. **HITL Continuation 会绑定具体 Occurrence。** 人类 Response 与 Workflow Frame / Call Occurrence 绑定，同时单独核验 Responder Authorization。
6. **Delegation Budget 会跨 Worker Replacement 保留在 Objective 层。** Recovery 不再因为换 Worker 就重置 Descendant 的累计使用量。
7. **Lifecycle Recovery 会在 Replay 前对账 Owned Descendants。** Process Group、Detached Task 与 Remote Side Effect 会进入正式 Recovery Record。

## 开放问题

- 跨 Agent Runtime 最小可标准化的 Recovery Admission Envelope 应包含哪些字段？
- 哪些 Authority Fact 必须每次 Refresh，哪些允许使用有时限的 Stale Evidence？
- Runtime 应如何证明旧 Execution Epoch 已经充分关闭，足以授予新 Epoch？
- Checkpoint Replay Integrity 能否增量验证，而不是每次 Recovery 都完整重建？
- Workflow Occurrence 被正式替换时，Human Approval 应如何迁移？
- 在 Max Runtime 尚未到期之前，哪些证据足以把长期无活动的 `Running` 降级为 Recoverable `Waiting`？
- 本地 Owner 已关闭、外部 Side Effect 结果却未知时，Replay 前应采用什么对账合同？

## 本周判断

本周证据不支持“持久化做得更好，Agent 就更可靠”这个简单命题。Persistence 很重要，但它只能保证写下来的东西还在。真正的可靠性要求系统进一步回答：这些状态现在是否仍然完整、可追溯、可重放、有明确 Owner，而且仍然被授权。

因此更强的设计原则是：

> **不要允许恢复出来的状态给自己的继续执行授权。先 Reconstruction，再根据当前证据独立 Re-Admission。**

这个原则把 Checkpoint、Policy Cache、Workspace Trust、Host-minted Authority、Approval Cache、Delegation Budget、Cancellation Cleanup、Detached Work、Process Timeout、HITL Resume 与真实 `Running` 状态连接成同一个控制问题。Recovery 不再只是存储功能，而是一个正式的执行准入边界。

## 证据映射

本次综合以本文开头表格列出的 21 篇已发布 Daily Research 和 `research/intelligence/p2-runs/2026/08/2026-08-30-p2-special.json` 为证据基础。每篇 Daily Research 保留自己的 Primary Source Citation 与边界化结论；Weekly 只综合这些已验证研究，不替代它们的源级证据。
