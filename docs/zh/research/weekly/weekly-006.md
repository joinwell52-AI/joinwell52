---
title: Weekly 006 — 权限需要血缘链
date: '2026-08-23'
column: digital-employee
category: weekly
article_type: research-brief
edition: research-center
research_question: '当 Agent 状态经过压缩、恢复、委派、缓存、规范化或重建后继续存在时，哪些证据也必须一起保留下来，系统才能确认它现在仍然被授权使用？'
summary: '过去七天 21 篇证据已验证 Daily Research 反复暴露同一种故障：值能够穿过各种状态变换继续存在，但原先赋予它权限的依据未必一起存在。可靠 Agent Runtime 需要保持 Provenance 的准入机制，让来源、范围、策略上下文与变换血缘随运行状态一起传递，并在真正使用时重新核验。'
sources:
  - 2026-08-17 至 2026-08-23 Daily Runtime V5 publications
  - research/intelligence/p2-runs/2026/08/2026-08-23-p2-special.json
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
cover: '/assets/covers/weekly-006-authority-needs-lineage-cover.svg'
---

<ArticleCover
  image="/assets/covers/weekly-006-authority-needs-lineage-cover.svg"
  kicker="Weekly Research · 006"
  title="权限需要血缘链"
  summary="状态可以穿过变换继续存在，但原先使它有效的权限未必一起保留。"
  version="W006"
  status="Published 2026-08-23"
  languageHref="/en/research/weekly/weekly-006"
  languageLabel="English"
/>

# Weekly 006 — 权限需要血缘链

上一期 Weekly 的判断是：每一次重要交接都需要带证据的回执。本周 21 篇证据已验证 Daily Research 把问题推进了一层：**状态即使安全完成了交接，也可能在后续变换中重新变得不安全。**

Agent Runtime 会压缩 Transcript、重建 History、恢复 Checkpoint、刷新凭据、合并 Policy、缓存 Plugin、规范化 Identifier、导入 Tool Output、继承执行环境状态，并把工作委派给下游 Agent。这些机制之所以有价值，就是因为它们可以保存连续性。但连续性也会制造一种危险错觉：只要一个值还存在，当初让它可信、可执行的理由好像也还存在。

本周的证据反复说明，这个推断不成立。

Command Name 可以继续存在，但 Repository Configuration 已经改变它真正会执行什么；Human Approval 可以继续存在，但批准者是谁、为什么有权批准却丢失了；Child-agent Role 可以在 Resume 后重建，但有效权限可能意外扩大；OAuth Refresh 成功后新 Token 已在内存里，却可能没有持久写入；Cache Miss 可以继续存在，但并不能证明真实资源已经删除；最新 Checkpoint 可以存在，但授权它的 Policy 已经变化；Canonical Identifier 可以存在，但 Lifecycle 操作仍可能在非规范别名上发生竞争。

机制不同，控制故障却是同一个：

> **值继续存在，不等于权限结论继续有效。**

因此，本周形成的新判断是：

> **可靠 Agent 系统需要“保持 Provenance 的准入机制”。运行状态不应只有 Value，还应保留让这个 Value 可以安全使用的 Origin、Scope、Policy Context、Transformation Lineage 与当前 Admission Evidence。状态变换可以保持或收窄权限，但不能静默扩大权限。**

## 证据范围

本次综合只使用 **2026-08-17 至 2026-08-23** 在完整 V5 Publication 链路达到已核验终态后发布的 Daily Research。七个 Daily Runtime 日全部达到 `publication = Completed`，数字员工、行业架构、开源工程三个正式栏目合计形成 **21 篇 Daily Research**。

| 日期 | 数字员工 | 行业架构 | 开源工程 |
|---|---|---|---|
| 8 月 17 日 | Selective Fail-closed API | Environment-owned Policy | Compact Transcript Evidence |
| 8 月 18 日 | Accountable Human Approval | Persistence and Reconciliation | Trace-to-effect Evidence |
| 8 月 19 日 | Monotonic Delegation Authority | Delivery-context Separation | OAuth Refresh Split Commit |
| 8 月 20 日 | Command Name 不是 Execution Authority | History 不是 Transfer Contract | Visible 不是 Durable |
| 8 月 21 日 | Useful Context 不是 Memory Authority | Approval 必须指明 Approver | Trust the Run, Not Inherited Secrets |
| 8 月 22 日 | Authorization Needs Provenance | Protected Constraints, Reviewable Grants | Missing Cache Entry 不是 Deletion Evidence |
| 8 月 23 日 | Resume Recency 不是 Authority | Creation Provenance Survives Resume | Canonicalize Before Lifecycle |

这是一组密集的工程证据样本，不代表整个行业已经形成统一实践。本周真正值得保留的是：在相互独立的研究对象上，**同一个状态与权限边界反复出现。**

P2 专项通道本周另外检查了 4 个到期的 `biweekly-or-release` 对象，全部完成终态检查；2 个 monthly 对象本周不到期；没有对象达到 5 分触发阈值，因此没有运行完整 P2 Special Study。检查中还发现一个有价值的治理问题：`agent-style` 在 8 月 16 日保存的检查点落后于一个其实早在前次运行前就已经存在的 README 澄清提交。本周因此只纠正 Checkpoint Identity，不把旧提交错误包装成本周新增变化。

## 反复出现的故障：状态变换时 Provenance 被丢掉了

上一期关注的是不同 Owner 之间的交接。本周说明，同样的危险也会发生在一个 Owner 内部的状态处理链里。

Runtime 可以先接收到一个有效事实，然后在后续转换时把它与原本赋予它意义的条件拆开。

### 名字不等于当前真正会执行的行为

8 月 20 日数字员工研究了一个看似简单的问题：一个 Command 可以保留熟悉、看起来安全的名字，但 Repository Configuration 已经改变这个名字最终解析出的真实执行。

因此，如果 Policy 只绑定 Command Label，它的控制能力会比表面上更弱。Label 只是 Identifier；真正的 Execution Authority 取决于解析后的命令、Configuration Source、Working Context 与适用的 Approval Policy。

更一般的形式是：

```text
稳定 Label
+ 已变化 Resolution Context
≠ 稳定 Authority
```

同样的问题也会出现在 Plugin Alias、Tool Name、Model Routing Label、Saved Workflow Name 与 Remote Session Identifier。稳定 Key 有助于关联，但 Policy 应绑定 Effective Operation，而不是只绑定熟悉的名字。

### Human Answer 不等于 Human Authority Proof

8 月 18 日与 8 月 21 日的研究从两个方向指向同一边界。

一篇说明远程 A2A Peer 不能替代真人满足危险动作的 Human Confirmation；另一篇说明 Approval Trust 必须绑定真实 Approving Principal，而不能只绑定 Transport Metadata。

`approved` 这样的字符串、被标成 `human` 的 Callback、从可信 Channel 送达的消息，都可能保留“回答”，却没有保留“为什么这个回答有权生效”的证据。

更可靠的 Approval Record 至少应能保留：

```text
occurrence_id
approver_principal
authority_scope
policy_version
decision
source_provenance
```

这不意味着所有审批都要建立复杂身份基础设施。真正的要求是：Runtime 不能根据 Message Shape 或 Transport Path 静默推断批准者权限。

### Delegation 在 Resume 与 Customization 后必须保持权限单调

8 月 19 日数字员工研究了 Child-agent Role 自定义与 Resume。核心不变量是 Monotonicity：委派可以保持或缩小权限，但 Representation Change 本身不应让权限扩大。

这在 Checkpoint Restore 后尤其重要。恢复中的 Child Agent 可能重新构造 Role Label、Tool、Context 与 Pending Work。如果 Effective Permission Envelope 从不完整或过期字段重建，Resume 后的表示可能反而比原始执行更宽松。

一个有用的不变量是：

```text
Authority(after transform) ⊆ Authority(before transform)
```

除非系统重新接纳一个明确的新 Grant。

这条规则可以同时解释 Role Customization、Policy Merge、Saved Approval、Connector Capability Reconstruction 与 Remote-session Resume。

## Continuity Mechanism 需要独立 Admission Boundary

一个常见工程错误，是把 Persistence 当作最后的 Correctness Property。

本周证据说明，Persistence 只解决一个问题：**Value 有没有活下来？** 它没有回答：**这个 Value 现在还能不能被使用？**

### Refresh 成功不等于 Credential State 已持久提交

8 月 19 日开源工程把 OAuth Refresh 分析成一个 Split Commit。

Provider 可以成功签发新 Credential，而本地 Durable Persistence 仍然失败。这时内存里已经有有效新 Token，但 Durable Store 还停在旧状态。如果系统把这个失败隐藏掉，之后的 Worker 可能从一个从未和成功 Refresh Event 对齐的 Credential State 继续工作。

正确边界应明确保留：

```text
provider refresh accepted
≠ credential state durably committed
```

Fail-visible 设计不会假装整个 Refresh Transaction 是原子的，而是显式记录这次 Split。

这同样适用于 Approval Persistence、Checkpoint Write、Session Rebinding、Artifact Publication 与 Tool-result Caching。

### Visible 不等于 Durable

8 月 20 日开源工程从 Artifact Publication 得到同样结论。先隔离 Pending State，再 Atomic Rename，可以防止消费者把部分发布的版本误认为权威版本。

这个判断并不局限于文件系统：

> **Visibility 是比 Durable Admission 更弱的事实。**

一个值可能已经可以读取，但仍然是 Provisional；UI 可以显示一个 Task，但 Authoritative Record 还未提交；Remote Object 可以被发现，但 Reconciliation 还没确认 Ownership；Model Output 可以已经产生，但还没跨过 Evidence Gate。

因此系统更适合拥有 `pending`、`admitted`、`committed`、`verified`、`superseded` 这样的显式状态，而不是用一个重载的 “exists” 表示一切。

### Recency 不等于 Authority

8 月 23 日数字员工把这个问题收紧到 Resume。

最新 Checkpoint 往往最有操作价值，因为它能减少恢复成本。但 “latest” 是排序事实，不是权限事实。最新 Snapshot 仍可能带着已撤销 Grant、旧 Principal Binding、失效假设，或者由过时 Policy Epoch 创建的状态。

因此 Resume 必须分开回答：

```text
哪个 State 最新？
哪个 State 现在仍可被 Admission？
```

只回答第一个问题的 Runtime 可以很快，但不能算受治理。

## 信息可以有用，却不必成为授权状态

本周多篇研究都在区分 Information Utility 与 Operational Authority。

### External Tool Output 默认不是 Reusable Memory

8 月 21 日数字员工区分独立 External Tool Output 与可复用 Agent Memory。

Tool Output 可以是非常有价值的 Context。但把它提升为 Memory，会改变它的生命周期：它可能被未来 Task 重放、被其他任务看到，甚至被当成 Durable Background Truth。

因此，这个 Promotion 应当是带 Provenance、Scope 与 Expiry 的 Admission Operation，而不是 Tool 返回一个值之后自动发生的副作用。

一个 Context Item 可以保持有用，而不必变成长寿命 Authority。

### History 不是 Transfer Contract

8 月 20 日行业架构研究跨 Agent History Reconstruction。历史重放可以恢复 Context，但携带 Credential 的 Control Call 应被 Scrub，而不是作为普通 Conversation State 一起转移。

这里必须区分：

```text
replayable history
≠ transferable capability
```

前一个 Worker 曾经使用过某个 Token、Connector Grant、Approval 或 Control Instruction，并不意味着这些 Capability 自动属于接收 Worker 的可转移 Context。

同理也适用于 Shell Environment Variable、API Secret、Temporary Approval Token 与 Provider Session Cookie。

### Delivery 与 Model Context 是不同存储域

8 月 19 日行业架构把异步 User Delivery 与 Model Input Context 分开，同时保留可回放 Delivery Metadata。

这也是一个 Provenance Boundary。一个 Message 可能对 Delivery Audit 很重要，却不应进入未来 Model Context；反过来，Model Context 可以包含内部推理状态，但绝不能自动成为用户可见 Delivery History。

两个 Store 分开后，“曾经发送过”就不会再自动等于“应该继续影响未来执行”。

## Absence、Cache State 与 Canonical Identity 需要更强语义

并非所有危险 Transformation 都是在增加数据。有些发生在删除、缺失或规范化时。

### Missing 不等于 Deleted

8 月 22 日开源工程研究了带 Account Scope、Serialization 与 Generation Guard 的 Plugin-cache Reconciliation。

核心负面事实很简单：Cache Entry 缺失，不证明真实 Plugin 已经删除。Cache 可能过期、不完整、来自另一个 Account，或者刚刚被旧 Generation 覆盖。

这是本周判断的 Negative-evidence 版本：

> **没有 Provenance 的 Absence，不是权威 Absence。**

Deletion、Revocation 与 Non-existence 都是有后果的结论。它们往往需要 Authoritative Source Read、Tombstone、Generation Number 或 Reconciled Snapshot，而不能从一次 Local Miss 推断出来。

### Lifecycle 之前先 Canonicalize

8 月 23 日开源工程说明，逻辑等价的 Identifier 应在 Lifecycle Operation 竞争之前完成 Canonicalization。

如果不这样做，两个 Alias 可能为同一个底层 Resource 建出两条看似独立的 Ownership Path，Lock、Cleanup、Restart、Cache Key 与 Deduplication 都可能对 Representation 工作，而不是对 Identity 工作。

因此 Canonicalization 不是 Cosmetic Normalization，而是一道决定“哪个身份真正参与 Lifecycle”的 Admission Step。

但它仍然不是全部：Canonical Identity 依然需要 Provenance、Scope 与当前 Policy。

## 一个可复用模型：Provenance-Preserving Admission

本周可以收敛成一个紧凑控制模型。

每一个有操作意义的事实，都可以理解为：

```text
OperationalFact = {
  value,
  origin,
  principal,
  scope,
  policy_epoch,
  occurrence_id,
  transform_lineage,
  durability_state,
  verification_state
}
```

并不是每个系统都必须字面保存所有字段。重点是语义：Runtime 不只要知道“现在的值是什么”，还要知道“为什么这个值有资格表达下一个组件准备赋予它的意义”。

一个受治理 Transformation 可以是：

```text
input fact
→ transform
→ preserve provenance
→ narrow or preserve scope
→ revalidate policy-sensitive fields
→ admit output fact
```

危险版本则是：

```text
input value
→ transform
→ output value
→ assume old authority still applies
```

用这个模型回看本周机制，会发现它们其实高度统一：

- Selective Fail-closed Parsing 防止 Policy Field 被静默丢失；
- Environment-owned Variable Policy 保留 Execution Context 来自哪里；
- Compact Transcript Presentation 保留紧凑视图背后的完整 Evidence；
- Named Approver Identity 保留是谁授予了权限；
- Monotonic Delegation 防止 Transform 扩大 Scope；
- Split-commit Visibility 保留 Credential “已签发”与“已持久化”的区别；
- Atomic Publication 保留 Artifact “可见”与“已准入”的区别；
- Memory Admission 保留 Useful Context 与 Durable Background State 的区别；
- Generation-guarded Cache Reconciliation 保留 Snapshot Provenance；
- Resume Re-admission 保留 Newest State 与 Currently Valid State 的区别；
- Canonicalization 在并发开始前确定唯一 Lifecycle Identity。

## 相比上一期，新的增量是什么

Weekly 005 提出了 Ownership Boundary 上的 Evidence-bearing Handoff Receipt。Weekly 006 并不替代它，而是把同一要求推进到 State Machine 内部。

Handoff Receipt 回答：

> 一个 Owner 到另一个 Owner，究竟转移了什么事实和权限？

Provenance-preserving Admission 回答：

> 接收方把这个 Fact 转换、缓存、压缩、恢复或重建之后，现在究竟还有哪些权限仍然有效？

两者合起来得到更强的不变量：

```text
Authority 必须同时跨 Transfer 与 Transformation 保持可追溯。
```

一个系统可以有很完整的 Inter-service Receipt，却因为 Local Resume Code 丢掉 Policy Epoch 而失败；也可以有完美 Checkpoint Lineage，却因为 Remote Handoff 没有记录真正 Approving Principal 而失败。长期 Agent 需要两者同时成立。

## 这个模型仍然解决不了的矛盾

### Full Lineage 与 Operational Cost

记录每一次 Transformation 会变得昂贵、难读。目标不应该是默认把所有系统都变成 Universal Event Sourcing。

更实际的原则是 Risk-based：对会影响 Execution Authority、External Side Effect、Durable Memory、Credential、Identity 与 Policy 的事实保留强 Lineage；普通信息变换可以使用更轻 Telemetry。

### Revalidation 与 Availability

Fresh Authorization Check 在 Network Partition 或 Provider Outage 时可能失败。对于高后果动作，Fail Closed 是合理的；但并不是所有 Read-only Operation 都需要同等标准。

真正难点是声明清楚：哪些 Fact 必须重新 Admission，哪些可以安全使用有界 Cached Evidence。

### Canonical Identity 与系统演进

Canonicalization 假设存在稳定映射，但真实系统会 Rename Resource、迁移 Account、合并 Identity。

因此 Canonical Identity 也需要 Versioned Mapping Evidence，而不是永远不变的一条字符串。

### Monotonic Authority 与合法权限升级

有时 Authority 确实应该扩大：Human Grant Exception、Administrator Unlock Tool，或者 Workflow 进入 Privileged Phase。

规则并不是“权限永远不能增加”，而是“权限不能因为 Representation Change 自己变大”。权限扩张必须来自一个新的 Explicit Grant，并带自己的 Provenance。

## 预测

以下是 Research Center 基于重复机制形成的解释，不是任何单一 Daily Source 的原话。

1. **Resume Protocol 会越来越多暴露 Policy Epoch。** Checkpoint ID 本身不足以支撑受治理恢复。
2. **Approval Record 会逐步变成 Principal-bound Artifact。** 系统会区分 Decision Text 与“谁有权做出这个决定”的证据。
3. **Agent Memory 会出现显式 Admission Metadata。** 在高可靠 Runtime 中，Tool Output 与 Delivery History 不再自动提升为 Durable Memory。
4. **Credential Refresh API 会显式暴露 Split-commit State。** “已刷新但未持久化”会成为一等可恢复状态。
5. **Cache 会携带 Generation 与 Authority Provenance。** 除非 Cache 被证明是 Authoritative Complete Snapshot，否则 Cache Miss 会被理解成 Uncertainty。
6. **Canonical Identity 会更早进入 Lifecycle Control。** Lock、Deduplication 与 Ownership 会更倾向于绑定 Canonical Resource Identity，而不是用户可见 Alias。
7. **Compact Audit View 会保留回到 Full Evidence 的链接。** Human-readable Summary 不会再被视为 Replayable Evidence 的替代品。

## 开放问题

- 跨 Agent、Tool 与 Connector，最值得标准化的最小 Provenance Envelope 是什么？
- 哪些 Policy 变化必须让已 Admission 的 State 在 Resume 时失效？
- Runtime 如何证明多次 Transform 之后 Authority 一直单调不扩张？
- Local Cache 要满足什么条件，Absence 才能升级为权威 Negative Evidence？
- Approval Provenance 可以复用多久，什么事件应该撤销它？
- Account Migration、Provider Rebinding 与 Resource Rename 后 Canonical Identity 如何保持稳定？
- 哪些 State Transformation 值得 Durable Lineage，哪些只需要 Transient Telemetry？
- Runtime 如何表达“Value 仍有效，但 Authority 已失效”，同时又不丢掉这个 Context 的信息价值？

## 下一周研究优先级

三个具体实验可以继续检验这个模型。

**第一，测试 Policy Change 下的 Resume。** 在 Policy Epoch A 创建 Checkpoint，然后撤销或收窄相关权限，再在 Epoch B Resume。验收条件是 Useful State 可以保留，但旧 Authority 不可以跟着恢复。

**第二，测试 Compaction 之后的 Provenance。** 压缩一段 Execution Transcript，并要求 Compact Representation 对每一个 Authority-sensitive Claim 都保留可解析 Evidence。如果 Summary 成了唯一剩下的“证据”，测试应失败。

**第三，测试 Authoritative Negative Evidence。** 只从 Local Cache 删除一个 Resource，而不从 Source of Truth 删除。Runtime 应报告 Uncertainty 或 Stale Cache，而不是权威 Deletion。

现在的方向已经比“增加更多 Audit Log”更具体：长期 Agent 需要的是 **Typed Trust Continuity**。

Value 可以很新，却没有权限；Message 可以长得像真人回答，却不是 Human-authorized；Token 可以有效，却没完成 Durable Commit；Cache 可以为空，却不是 Authoritative；Checkpoint 可以最新，却不再可准入；Identifier 可以稳定，却还没有 Canonicalize。

**权限需要血缘链，因为 Persistence 保存 Data，远比它保存“为什么这些 Data 仍然可以安全用于行动”更容易。**
