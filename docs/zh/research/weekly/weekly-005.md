---
title: Weekly 005 — 每一次交接都需要回执
date: '2026-08-16'
column: digital-employee
category: weekly
article_type: research-brief
edition: research-center
research_question: '当持久 Agent 工作从一个所有者、策略、运行状态或外部系统转移到另一个边界时，反复出现的控制不变量是什么？'
summary: '过去七天 21 篇证据已验证 Daily Research 共同指向一个判断：连续性、身份、授权、执行与外部副作用是不同事实。可靠 Agent 系统需要在这些事实的边界之间建立带证据的交接合同。'
sources:
  - 2026-08-10 至 2026-08-16 Daily Runtime V5 publications
  - research/intelligence/p2-runs/2026/08/2026-08-16-p2-special.json
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
cover: '/assets/covers/weekly-005.svg'
---

<ArticleCover
  image="/assets/covers/weekly-005.svg"
  kicker="Weekly Research · 005"
  title="每一次交接都需要回执"
  summary="身份、权限、执行与副作用跨越系统边界时，必须作为彼此独立、可留证的事实传递。"
  version="W005"
  status="Published 2026-08-16"
  languageHref="/en/research/weekly/weekly-005"
  languageLabel="English"
/>

# Weekly 005 — 每一次交接都需要回执

上一期 Weekly 的核心判断是：**权限是一条生命周期，而不是一个静态配置项**。本周的证据把这个判断进一步收紧到一个更具体、也更容易出错的位置：**交接边界**。

过去七个已完成的 Daily Runtime 日，共形成 21 篇公开研究，涉及人工批准、顺序工作队列、Connector 动作、持久事件身份、接受与持久化、策略修改、异步 Callback、恢复能力重建、远程 Session 重绑定、有界扩展点、持久工作身份、KPI 决策权、取消回滚、可恢复信任门禁、委派 Agent 返回合同、后台工具所有权、按具体发生实例授权、对象预留与实例化，以及配置优先级。

研究对象彼此不同，但失败模式高度一致：

> **一个事实跨过边界后，经常被误当成了另一个更强的事实。**

被保存的决定，被误认为现在仍然有效的授权；预留的 ID，被误认为远端对象已经存在；重新连接的 Session，被误认为原来的执行已经连续恢复；本地取消，被误认为外部副作用已经终止；确定性配置优先级，被误认为最终值天然合法；Provider 接受请求，被误认为业务结果已经完成。

因此，本周形成的新判断是：

> **可靠 Agent 系统需要“带证据的交接合同”。每一次工作、权限、身份、状态或副作用的转移，都必须记录到底转移了什么、交接前后谁拥有它、依据什么策略，以及下游究竟哪一个事实已经真正成立。**

## 证据范围

本次综合只使用 **2026-08-10 至 2026-08-16** 已通过证据门禁并公开发布的 Daily Research。七天的 Daily Runtime 都达到 `publication = Completed`，三个正式栏目合计形成 **21 篇可用研究**。

| 日期 | 数字员工 | 行业架构 | 开源工程 |
|---|---|---|---|
| 8 月 10 日 | 受治理输入准入 | 权威状态与级联故障遏制 | 工具生命周期串行化权限 |
| 8 月 11 日 | 顺序执行权 | Connector 动作交接 | 持久事件身份与终态证据 |
| 8 月 12 日 | 接受与持久化边界 | 同意与有效策略 | Scoped Callback 并发 |
| 8 月 13 日 | 恢复能力重建 | Session 重绑定边界 | 有界扩展点 |
| 8 月 14 日 | 持久工作身份与执行权 | KPI 决策权治理 | 取消回滚与外部副作用 |
| 8 月 15 日 | 可恢复 Agent 信任门禁 | 委派 Agent 的语义返回合同 | 执行、路由与副作用所有权 |
| 8 月 16 日 | 按发生实例授权 | Reservation 与 Materialization | 配置优先级与 Provenance |

这是一个密集的七天工程样本，并不能证明整个市场都已经转向同一种架构。本报告能支持的是：在独立选出的多个研究对象中，**同一个控制问题反复出现**。

本周 P2 专项通道也完成了首次受治理基线：6 个登记对象全部完成检查。由于 main 上此前没有 P2 检查点，本次只建立比较基线，不凭空制造“变化增量”；因此没有触发 P2 专项研究。

## 最常见的错误：把连续性升级成权限

长期 Agent 必须具备连续性。工作 ID、Checkpoint、待审批状态、Session、Callback、配置、Provider 状态都需要在中断后保留下来。

问题在于：**连续性是恢复所需的条件，却很容易被误用成更强的控制结论。**

### 状态连续，不等于权限连续

数字员工栏目连续出现同一种边界。

一个迟到的人类响应可以被持久绑定到某一次精确的待处理调用，但这个事实并不能证明批准人具备什么权限，也不能证明后续外部 Tool Effect 恰好只发生一次。一个任务已经进入队列，只能证明需求存在，不表示它已经获得执行权。Protocol State 可以跨重启保存，但依赖当前拓扑或 Policy 的能力仍然可能需要在 Resume 前重新构造。稳定的 Work Identity 可以长期存在，而 Dispatch Admission 与 Resumption Authorization 可以变化。

因此需要明确区分：

```text
历史事实
≠ 已准入状态
≠ 当前执行权
```

### 逻辑连续，不等于执行连续

行业架构栏目从跨系统交接得到同样结论。

Connector 可以观察到 Availability，却没有获得动作授权；授权成立，也不代表 Provider 已经接受请求；Provider 接收了请求，也不代表最终 System of Record 已经形成目标结果。远程 Session 可以成功 Rebind，从而恢复后续可用性，但这并不能证明之前被中断的工作已经迁移或连续执行。一个 Thread ID 可以提前预留用于 Correlation，却不等于远端对象已经 Materialize。

更精确的顺序是：

```text
意图
→ 资格
→ 授权
→ 提交
→ 实例化 / 执行
→ 已确认结果
→ 最终托管
```

任何相邻两步被合并，都会让恢复与审计出现歧义。

### 本地终结，不等于外部副作用终结

开源工程栏目把这个问题推到最实际的层面。

Lifecycle Lock 可以让本地 Connector Transition 变得确定，但外部副作用仍需要独立幂等边界；Scoped Cancellation 可以恢复本地 Request State，却不能保证 Provider Side Effect 已停止；Registry Entry 被回收，可以撤销本地 Routing Ownership，却不能证明后台 Worker 已经真正终止；Deduplication Key 可以减少重复处理，却不能证明端到端 Exactly-once；配置优先级可以确定最终值，但并不能证明这个值来自被授权的来源。

所以还必须区分：

```text
本地状态已收口
≠ 远端工作已收口
≠ 外部副作用已收口
```

## 新的架构抽象：带证据的交接合同

本周 21 篇研究支持一个可复用的架构抽象：**Evidence-Bearing Handoff Contract，带证据的交接合同**。

它不是另造一个 Transport Protocol，而是用来治理那些“一个组件不能再安全推断另一个组件状态”的边界。

```text
1. Occurrence / Work Identity
        ↓
2. Intent and Eligibility
        ↓
3. Authority Decision
        ↓
4. Claim and Ownership Epoch
        ↓
5. Materialization / Actual Execution
        ↓
6. Effect Evidence
        ↓
7. Semantic Terminal Result
        ↓
8. Custody / Acceptance / Reconciliation
```

每一条箭头都是一次交接。每一次交接，都需要足够强的证据告诉下一个 Owner：**什么可以假设，什么绝对不能假设。**

### 1. 身份必须落到具体发生实例

持久 ID 最有价值的时候，不是表示一类动作，而是表示**这一次具体发生的动作**。

本周的人类批准和事件身份研究都指向这一点：针对“这个 Tool”的默认策略，与针对“这一笔 Tool Call”的决定，不是同一个事实；Task Name 与一次具体 Delegation，不是同一个事实；Session 与 Session 的某一 Generation，也不是同一个事实。

因此，在异步派发、Retry、Pause、Delegation 之前，应先建立稳定的 Occurrence Identity。

### 2. 权限必须有独立证据

身份只能说明“我们在讨论哪个对象”，不能说明“这个对象现在能不能执行”。

一个权限决定至少应保留决策来源、适用 Policy Version、适用时的 Principal / Role、Scope、Expiry 或 Occurrence Boundary，以及恢复时是否需要重新核验。普通的“用户确认文本”不是批准人权限的证明；某个配置值赢得了优先级，也不是它被允许生效的证明。

### 3. Ownership 应显式并带 Epoch

交接最危险的阶段，是旧 Owner 与新 Owner 都看起来“好像还有效”。

Session Rebinding、Worker Replacement、Tool Runtime Restart、后台任务路由、Callback Cleanup 都适合使用 Ownership Epoch 或 Generation。新 Owner 接管后，旧 Owner 应被 Fencing，不能继续用旧身份取得新的执行权。

这不能自动解决外部幂等，但至少能让本地所有权变得可重建。

### 4. Reservation 与 Materialization 必须分开留证

预分配 ID 很有价值，它允许 Host 在远端对象真正创建前就建立 Correlation。

但 Reservation 只是对“身份空间”的预留。系统还必须另外记录：远端对象是否真的完成 Materialization，哪个远端 Identity 变成权威对象，以及被放弃的 Reservation 是否需要 Cleanup 或 Reconciliation。

### 5. 外部 Effect 需要独立 Settlement 模型

最重要的交接，是 Agent / Runtime 内部状态跨到外部世界。

Tool Call、支付、预订、部署、消息发送、文件修改等副作用发生后，不能因为本地 Rollback 成功，就假设可以安全 Retry。系统需要 Effect Evidence：External Idempotency Key、Provider Receipt、状态 Readback、Compensation Record，或者明确的 Unresolved 状态。

只有整个 Effect Path 都支持时，才能声称 Exactly-once。本地 Lock 与去重机制远远不够。

### 6. 终态必须有语义，而不是只有 Transport 状态

Transport Completion 不是 Business Completion。

委派 Agent 的 Stream 结束、Callback 返回、Provider Request 完成，都无法自动说明任务语义上是否成功。Semantic Return Contract 至少需要区分：成功、拒绝、取消、部分完成、结果不明确、可恢复失败。

调用方不应从 Transport State 猜 Business Meaning。

## 为什么在交接边界上，Receipt 比 Trace 更关键

Trace 非常适合回答“执行路径是怎样的”：A 调用了 B，B 又调用了 C。

Handoff Receipt 回答的是另一个问题：**下一个 Owner 实际接收了什么事实、什么权限？**

一份实用的交接回执可能包括：

```text
occurrence_id
from_owner
to_owner
policy_version
authority_scope
claim_epoch
materialized_identity
effect_reference
terminal_semantics
provenance
```

并不是每一次交接都需要全部字段。真正的不变量是：**接收方不能把较弱的上游事实，静默升级成更强的下游结论。**

这也是本周相对上一期 Weekly 的新增价值。上一期说明“权限会随时间变化”；本期进一步指出实施压力点：**当权限、状态和工作跨 Ownership Boundary 时，如果没有类型明确的证据，权限语义就会失真。**

## 交接合同无法消除的矛盾

### 更强证据与更高延迟

重新核验 Policy、读取外部状态、等待 Provider Confirmed Outcome 都会增加延迟。

答案不是“所有步骤都同步验证”。系统需要明确：哪些证据可以缓存、哪些动作允许 Optimistic Execution、哪些高后果 Transition 必须拿到新鲜确认。

### 稳定身份与废弃状态

预留身份有利于 Correlation 与 Retry，却可能积累废弃对象和过期 Intent。

因此 Stable Identity 需要 Abandonment 与 Reconciliation 语义，而不是只有 Create 语义。

### 并发与所有权清晰度

全局串行最容易保证正确，但会毁掉有价值的并发；完全并行又会让 Ownership 变模糊。

更合理的是 Scoped Ownership：不同 Session / Occurrence 可以并发，但同一个 Occurrence 的关键 Transition 在任一时刻只有一个权威 Owner。

### 持久批准与可撤销策略

持久化一笔精确 Approval 有利于 Resume，但 Resume 前 Policy 可能已经改变。

系统应该同时保留历史决定和当前是否仍准入这个决定。Durability 保存的是 Provenance，不应把 Authority 永久冻结。

### 本地取消与不可逆 Effect

Cancellation 可以可靠停止本地等待，却可能已经来不及阻止远端副作用。

因此完整 Cancellation Contract 必须有 Effect Settlement 与 Compensation 边界。没有这些证据时，“Cancelled”经常只是一个本地结论。

## 预测

以下内容是 Research Center 根据一周反复出现的机制做出的研究解释，不是原始 Daily Source 的直接声明。

1. **Occurrence-scoped Authorization 会越来越常见。** 宽泛 Default 仍会存在，但高后果 Exception 会更多绑定到具体 Tool Call、Delegated Task、Reservation 或 Execution Epoch。
2. **Agent Runtime 会显式暴露 Ownership Epoch。** Session Generation、Worker Lease、Callback Scope、Routing Generation 会逐步收敛出类似的 Fencing 语义。
3. **Reservation 与 Materialization 会在 API 中分离。** 异步创建工作对象的系统会提供 Pre-materialization ID，但不会再把这个 ID 当成远端对象已经存在的证明。
4. **Cancellation 会增加 Effect Settlement 状态。** 系统会区分 Locally Cancelled、Provider Cancellation Requested、Provider Cancellation Confirmed、Effect Observed、Compensation Required。
5. **配置系统会暴露 Provenance Graph。** 对安全敏感配置而言，“哪个值赢了”将不够，需要继续说明 Source Layer、Authority 与 Override Chain。
6. **审计面会从 Event Log 转向 Handoff Receipt。** 核心问题将从“发生了哪些调用”变成“每个边界究竟传递了什么事实与权限”。

## 尚未解决的问题

- Agent、Tool、Connector 与远端 Provider 之间，最小可互操作 Handoff Receipt 应包含哪些字段？
- 哪些交接证据必须持久化，哪些只需要作为瞬时 Telemetry？
- Session、Worker 或 Routing Identity 重绑定后，如何可靠 Fencing 旧 Owner？
- 持久化 Approval 在什么条件下可以重用，哪些 Policy 变化必须强制重新准入？
- Provider 超时后结果仍然不明时，Runtime 应如何表示“Effect Unknown”？
- Reservation Cleanup 能否保持确定性，又不把 Pre-materialization Coordination 变成分布式事务？
- 安全配置需要暴露多少 Provenance，才既可审计又不会淹没 Operator？
- Delegated-agent Protocol 的哪些终态可以标准化，哪些必须保持 Task-specific？

## 下一周研究优先级

现在更需要做三个验证，而不是继续扩大概念词汇。

**第一，完整建模一次具体交接。** 选择一个高后果 Tool Occurrence，把 Identity、Authorization、Claim、Provider Submission、Effect Evidence、Semantic Result 与 Final Custody 分开记录，检查现有系统仍在哪些地方从一个状态推断另一个状态。

**第二，测试 Ownership Replacement 下的恢复。** 中断 Worker 或远程 Session，绑定新 Owner，再注入旧 Owner 的 Late Result。验收不只是最终结果正确，而是能够证明 Stale Authority 已被 Fencing，外部 Effect 仍可对账。

**第三，测试 Effect 不确定状态下的 Cancellation。** 在 Provider Submission 之后、Confirmation 之前取消。Runtime 应如实保留不确定性，不能把 Timeout 自动翻译成“取消成功”。

现在的方向越来越清晰：持久 Agent 系统不需要一个万能的全局 Status，而需要一组**拒绝把不同事实混在一起的边界**。

请求可以存在但没有权限；权限可以存在但还没有执行；执行可以发生但外部 Effect 尚未确认；远端 Effect 可以已经发生但本地还不知道；稳定 Identity 可以贯穿所有这些阶段，却不会让它们彼此等价。

**每一次交接都需要回执，因为交接正是一个事实最容易被误认为另一个事实的地方。**
