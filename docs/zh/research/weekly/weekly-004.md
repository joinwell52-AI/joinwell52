---
title: 每周研究 004：权限是一条生命周期，不是一个配置项
date: '2026-08-09'
column: digital-employee
category: weekly
summary: '15 篇经过证据验证的 Daily Research 汇聚出一个新的控制平面判断：长期运行的 Agent 系统必须把权限治理为“准入、租约、重验证、撤销、对账与独立验收”的生命周期。'
sources:
  - 2026-08-05 through 2026-08-09 Daily Runtime V5 publications
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
outline: deep
---

<ArticleCover
  image="/assets/covers/weekly-004.svg"
  kicker="Weekly Research · 004"
  title="权限是一条生命周期，不是一个配置项"
  summary="持久化 Agent 工作需要明确的准入、有限执行租约、生命周期重验证、撤销对账，以及独立验收。"
  version="W004"
  status="Published 2026-08-09"
  languageHref="/en/research/weekly/weekly-004"
  languageLabel="English"
/>

# 每周研究 004：权限是一条生命周期，不是一个配置项

## 证据范围

本次综合只使用 **2026-08-03 至 2026-08-09** 七天窗口内、已经通过证据验证并正式发布的 Daily Research。8 月 3 日与 8 月 4 日没有符合条件的 Daily Runtime 出版物；8 月 5 日至 8 月 9 日共有 5 份 Daily Runtime V5 记录为 `Completed`，且每天的 `publication = Completed`。

因此，本次共有 **15 篇符合条件的 Daily Research**：数字员工 5 篇、行业架构 5 篇、开源工程 5 篇。所有被使用的文章都已经发布到 `main`，声明 `evidence_status: Completed`，并指向同日 Research Object 与 Reading Result，同时保留各自的限制、反证与不确定性。Academic Observation、旧 Weekly、人工单独发布的案例文章、未选 Signal 与未发布候选均不进入本次证据基线。

| 日期 | 数字员工 | 行业架构 | 开源工程 |
|---|---|---|---|
| 2026-08-05 | 独立验收的完成合同 | 受治理的模型路由 | Guardrail 持久化状态机 |
| 2026-08-06 | 受治理的可修订工作图 | 企业执行决策信封 | 语义迁移与恢复 |
| 2026-08-07 | 验证门控的状态准入 | 角色感知 Agent 资源平面 | 稳定身份的 Provisioning Gate |
| 2026-08-08 | 保留暂停语义的预算准入 | 生命周期重验证策略平面 | 关联式多流 Host 合同 |
| 2026-08-09 | 撤销耦合的 Run 对账 | 轮换 Assertion → 短期 Credential | 执行过的 Conformance 迁移安全 |

这组证据足以支持跨天、跨栏目的综合判断，但时间窗口仍然很短。因此本文讨论的是重复出现的机制与工程结构，不把它包装成整个市场的统计趋势。

## 执行摘要

本周 15 篇 Daily 看起来研究的是不同问题：完成、路由、可变工作图、Session 恢复、预算、资源调度、Credential、远程多流、Provisioning、迁移与取消。

它们最终指向同一个控制平面事实：

> **真正需要被治理的持久单元，不是“Agent Session”，而是每一次赋予、保留、改变、暂停、撤销或接受执行权限的状态转换。**

一次静态 Permission 检查不够，因为长期工作会跨越时间。一个模型可以在策略变化后 Resume；一个 DAG 节点可以依赖满足却仍未被授权；预算可以禁止新工作但保留已经接受的状态；Credential 的源身份已经轮换，但派生 Token 仍可能在数分钟内有效；删除数据库对象可以撤销业务权限，但远程 Worker 仍可能真实运行；迁移后的最终值可以完全正确，但原本承诺的 bounded replay 机制已经失效。

因此，本周新的综合结论是：

> **权限是一条生命周期。可靠的 Agent Runtime 需要一个 Authority Lifecycle Control Plane，把规范工作身份、准入、有限租约、重验证、撤销、对账、证据和验收分离出来。**

## 趋势综合：从静态配置走向“转换时权限”

三个栏目共同表现出一个明显变化：控制正在从“一次配置”转向**每次关键状态转换时重新判断权限**。

数字员工研究连续说明“持久化状态”和“执行准备好”都不等于权限：

- 完成必须被独立接受；
- Graph Ready 只证明依赖满足；
- 持久化 Memory 在影响未来工作前必须经过 State Admission；
- 预算耗尽应暂停新工作准入，而不是销毁 Work State；
- 删除 Work Context 必须撤销权限并对未结清子工作进行 Reconciliation。

行业架构从另一侧得到同样结论：

- 模型路由只能在 Policy 内优化，不能替代 Policy；
- 关键执行需要包含策略来源与实际 Runtime 身份的 Decision Envelope；
- 资源调度必须服从 Trust 与业务边界；
- Resume / Fork 后的旧状态必须按当前 Policy 重验证；
- Workload Identity、Credential Lease 与下游传播是三个不同控制点。

开源工程则提供了这些判断需要的机制基础：

- Finalization 是类型化状态机；
- Migration 是语义转换，并需要 Journaled Recovery；
- Provisioning 改变 Lifecycle，不应改变逻辑身份；
- 多流执行必须依靠 Correlation、Ack 与 Drain Watermark；
- Conformance 必须真实执行，不能只是在仓库里存在测试文件。

因此这里不是泛泛的“更强治理”。更具体的趋势是：**Authorization 正在变成一个时间问题。** 系统必须回答的不只是“这个 Actor 有权限吗”，而是：

```text
现在允许开始吗？
允许继续吗？
Resume 后还允许吗？
Policy 改变后还允许吗？
BudgetPaused 时允许做什么？
Identity 轮换后旧 Credential 还能做什么？
Parent 被撤销后 Child 还能做什么？
谁可以声明完成？
谁可以接受完成？
```

## 架构综合：Authority Lifecycle Control Plane

15 篇 Daily 支撑出一个六平面架构：

```text
Canonical Work Identity
        ↓
Authority Admission
        ↓
Bounded Execution Leases
        ↓
Lifecycle Revalidation
        ↓
Revocation + Reconciliation
        ↓
Independent Acceptance
        ↘
     Evidence / Receipts / Conformance
```

### 1. Canonical Work Identity

长期工作需要一个不依赖 Provider Session、模型替换、远程 Host 重连、Provisioning 状态变化和 Recovery 的稳定身份。

WorkOrder、Task、Environment 或 Execution 对象不应该因为生命周期状态变化就被替换。稳定身份使后续每个 Decision、Event 与 Receipt 都能指向同一个受治理对象。

### 2. Authority Admission

Admission 决定新的关键工作是否可以进入执行。

本周证据表明，准入至少应组合这些输入：

- 当前 Policy Version 与 Provenance；
- Principal / Role / Position；
- 请求的 Capability 与业务 Scope；
- 实际 Model 与 Sandbox；
- Budget State；
- Resource / Trust Boundary；
- Credential Delegation Scope；
- 必需的 Reviewer 或 Human Authority。

Dependency Ready 不等于 Admission Ready；缓存配置也不等于准入证据。

### 3. Bounded Execution Leases

本周多个看似无关的机制，都可以更清楚地理解为“租约”：

| 租约类别 | 被限定的对象 | 续期 / 到期条件 | 被误当成永久权限的风险 |
|---|---|---|---|
| Worker Lease | Worker 持续操作 WorkOrder 的权利 | Heartbeat / Ack / Timeout | 撤销后旧 Worker 继续执行 |
| Credential Lease | 使用派生 Bearer Token 的权利 | Token Expiry / Refresh / Reject | Identity 已轮换但旧 Credential 仍过度授权 |
| Budget Lease | 继续准入模型工作的权利 | 剩余预算 / 授权预算变更 | Retry 静默重新开启已暂停花费 |
| Resource Lease | 使用可回收计算资源的权利 | Workload Phase / SLO Retreat | 资源回收导致 Tail Latency 崩溃 |
| Session / Host Lease | 依赖远程执行上下文的权利 | Stream Health / Reconnect Policy | 把 Transport 连续性当成 Work Truth |

这些目前不应被强行合成一个实现对象。本次 Weekly 的判断只是：**有限权限应被显式建模，而不是从“仍然活着”“仍然拥有对象”之类状态中推断。**

### 4. Lifecycle Revalidation

曾经合法的权限可能已经过期。

当状态转换能够恢复或明显改变执行能力时，应重新验证：

- Resume；
- Fork；
- Model Change；
- Sandbox 或 Settings Change；
- Budget Resume；
- Credential Refresh；
- Environment Ready → Use；
- Crash Recovery；
- Handoff 或 Ownership Transfer。

系统应广泛保留历史，但对当前权限重新计算。

### 5. Revocation 与 Reconciliation

撤销不是删除。

当权限被收回，Runtime 必须处理已经越过本地决策边界的工作：

- Queue 中的工作通常可以同步关闭；
- 等待审批的工作仍属于 Unsettled Set；
- Running Worker 需要 Cancellation Intent + Lease / Watchdog；
- 本地 Cancel 后，远程 Callback 仍可能迟到；
- 外部 Side Effect 可能需要 Compensation，而不是 Rollback；
- 旧 Credential 与旧 Worker 都需要 Fencing。

持久化状态转换是必要条件，但真实执行是否收敛，需要另一套证据。

### 6. Independent Acceptance

权限生命周期最后一个转换是 Acceptance。

本周反复区分：

```text
Worker 完成
≠ Execution Lifecycle 结束
≠ Transport 成功
≠ Output 被正确重建
≠ Business Outcome 被接受
```

高后果任务中，Claimant 与 Acceptor 应尽量由不同角色承担。Acceptance 应消费 Evidence，而不是消费语言上的自信。

## 跨栏目影响

### 数字员工 ↔ 行业架构

数字员工的 State Admission，与行业架构的 Policy Revalidation，本质上是不同尺度上的同一个问题。前者决定哪些 Memory、Checkpoint 和 Completion Verdict 可以影响下一次任务；后者决定哪些 Policy、Model、Identity 与 Capability 可以重新获得执行权限。两者都需要在关键转换点重新计算一个 **Effective Authority Snapshot**。

### 行业架构 ↔ 开源工程

Decision Envelope 只有在执行路径返回 Receipt 时才有意义。于是 Policy Provenance 会变成工程合同：每次 Model Substitution、Sandbox 选择、Credential Delegation、Resource Placement 与 Resume，都应返回“实际执行了什么”。没有 Receipt 的配置只是一份意图，不是证明。

### 开源工程 ↔ 数字员工

Stable Identity、Replay-safe Migration、Multi-stream Correlation 与 Conformance 不是“存储细节”。它们是数字员工能安全 Pause、Recovery、Revocation 与 Resume 的前提。长期 Work Semantics 因此依赖历史 Reader Compatibility 与 Transport Correlation。

### 三个栏目共同结论

共同架构可以写成：

**admit → lease → observe → revalidate → reconcile → accept**

这比“Agent + Tools + Memory”更强。它把 Autonomy 看成对持久 Work 的受治理状态转换，而不是给一个 Session 一次性永久授权。

## 工程综合：Correctness 已经包含机制不变量

开源工程栏目的第二个 Weekly 结论是：可见 Output 已不足以作为唯一 Correctness Oracle。

本周反例包括：

- Guardrail 阻断 Message 时，Tool Effect 可能已经发生；
- Migration 可以得到正确值，却比设计预期多 Replay 很多历史；
- Shared Conformance Suite 可以存在，却因为缺 Dependency 在某 Backend 上静默 Skip；
- Local Cancel 可以让远程 Wait 继续存活；
- Ready Resource 可以保持稳定身份，但 Ready Payload 仍继续变化；
- Atomic Rename 可以保证一个文件发布，却不能把多 Store 操作变成全局原子事务。

因此工程合同还必须包含**机制不变量**：

1. 稳定身份；
2. 明确状态类别；
3. 单调或版本化 Event Evidence；
4. Idempotency 与 Effect Receipt；
5. 对承诺过的 Replay / Query / Retry 行为设置上界；
6. 远程边界上的 Ack 或 Closure Watermark；
7. Governed Backend 的 Non-skippable Conformance；
8. Crash Recovery 能把 Canonical State 与 Projection 重新对齐。

即使最终值断言通过，如果这些不变量被破坏，系统仍然可能是运行意义上的错误。

## 本周发现的矛盾

### Durability 帮助 Recovery，也可能保存过期权限

长期 Checkpoint 与 Memory 减少了对 Provider Session 的依赖，但同样可能把旧 Policy、旧 Credential、旧 Assumption 或旧 Assurance Projection 带回下一次执行。

**解决方向：** History 尽量完整保存；Authority 严格准入，并在恢复执行能力的转换点重新验证。

### Parallelism 提高吞吐，也放大撤销与 Finality 问题

可修订 DAG、独立 Stream 和异构资源调度提高并发，却也制造更多 Outstanding Work、Late Event 与错误完成判断的机会。

**解决方向：** 每个并行执行单元都要有 Stable Identity、Bounded Lease、Correlation 与明确 Finality Condition。

### Short-lived Credential 降低暴露时间，但不证明 Containment

Credential Lease 缩短时长，却不能证明 Least Privilege、Propagation Control，也不能证明已经委托出去的 Consumer 被 Fencing。

**解决方向：** Credential Propagation 应作为独立策略，并产生 Delegation Receipt。

### Central Policy 提高一致性，也可能成为脆弱瓶颈

Policy Precedence 与 Lifecycle Revalidation 能降低 Drift，但每个操作都同步查询中央 Policy 会带来 Latency 与 Availability 风险。

**解决方向：** 区分“中央制定的 Policy”和“可验证版本的本地缓存 Decision”，明确哪些转换必须 Fresh Evaluation。

### Local Idempotence 很重要，但不等于 Distributed Exactly-once

Stable Provisioning Identity、Request Coalescing 与 Journaled Recovery 都能减少本地重复工作，但都无法证明 Crash、网络分区、多进程与外部 Effect 下的 Exactly-once。

**解决方向：** 使用 Idempotency Key、Effect Receipt、Fencing 与 Compensation，不宣称不存在的全局原子性。

### 正确 Output 可能掩盖错误机制

Migration 可以返回正确值却破坏 bounded replay；`completed` Event 可以在所有 Callback Drain 完之前到达。

**解决方向：** 测试支撑架构成立的 Invariant，而不是只测试最终值。

## 预测综合

以下是 Research Center 根据本周重复机制做出的前瞻判断，不是来源本身的声明。

### 预测 1：Agent 平台会把“权限转换”做成一等 Runtime Event

`resume`、`fork`、`pause`、`revoke`、`re-authorize`、`credential_refresh` 与 `accept` 将需要显式 Policy Hook 与 Audit Record，而不再隐藏在 Session API 内。

### 预测 2：“Memory”会拆成 History Store 与 Admitted-State Store

“全都持久化”对于长期组织型 Agent 会越来越模糊。平台会把 Append-only Evidence / History 与真正允许影响未来工作的 Reviewed State 分开。

### 预测 3：Credential、Worker、Budget 与 Resource 会在控制模式上趋向 Lease Semantics

它们仍是不同子系统，但运维控制会越来越接近同一模式：有限有效期、明确续期权、到期与 Fencing，以及每次延期或 Retreat 的持久理由。

### 预测 4：Conformance 会从“值兼容”扩展到“行为上界”

Release Gate 会越来越多地断言 Replay Count、Query Bound、Event Ordering Evidence、Backend Coverage 是否真实执行，以及 Recovery Semantics，而不只是 Output Equality。

### 预测 5：Observability 会从 Trace 走向 Receipt

Trace 回答“看起来发生了什么”；Receipt 回答“评估了什么权限、实际是谁执行、什么 Effect 已提交、当时持有什么 Lease、谁接受了 Completion”。企业 Agent 运维会同时需要两者。

## 未解决问题

1. 哪些 Lifecycle Transition 必须同步使用最新 Policy，哪些可以依赖缓存 Policy Version？
2. Worker、Credential、Budget、Resource 与 Host Lease 是否能共享一个抽象合同，同时不抹平各自不同的安全语义？
3. Revocation 后旧 Worker 与旧 Credential 仍能触达外部系统时，应如何 Fencing？
4. 哪些 External Effect 必须 Compensation？WorkOrder 被撤销后由谁拥有 Compensation？
5. Acceptance Gate 怎样保持独立，又不成为所有任务的吞吐瓶颈？
6. 每个 Governed Backend 必须 Non-skippable 的机制不变量到底有哪些？
7. 哪些 Authority Semantics 应进入 FCoP 协议事实，哪些应继续留在 CodeFlowMu Runtime Projection，直到重复 Runtime 压力足以证明需要协议变化？
8. Resource Optimization 如何同时尊重 Tenant、Credential、Sandbox 与 Business Priority Boundary？

## 下周优先级

### P0 — 定义 Authority Transition Contract

先作为研究层合同定义：

```text
admit
pause
resume
revalidate
revoke
reconcile
claim
accept / reject
```

每个 Transition 都应声明 Authority Owner、Policy Version、Evidence Class、Lease Dependency 与 Durable Receipt。先作为 Runtime Research Object，不直接冻结为协议扩展。

### P0 — 在 CodeFlowMu Runtime 原型化 Worker Lease 与 Revocation Fencing

选一个边界清晰的任务，显式区分：

```text
Running claim
→ heartbeat
→ cancellation requested
→ worker acknowledged
→ lease expired
→ stale result rejected
```

验证 Operator UI 是否与 Durable Evidence 一致。

### P0 — 为历史 Runtime 表示增加 Conformance Fixture

直接吸收本周 Migration 经验。Validator 与 Projection 测试应覆盖 Flat / Structured Result、Legacy Metric Name、String / Object Evidence，以及历史状态表示。一个应该被治理的 Fixture 如果没有真实执行，应视为 Coverage Failure。

### P1 — 定义 Credential Delegation Receipt

针对 Tool Process、MCP Server、Hook、Git 与 Remote Execution，记录 Credential 是被 Delegated、Stripped、Refreshed 还是 Rejected。不能从 Short Lifetime 推断 Isolation。

### P1 — 分离 Budget Admission 与 Execution Settlement

先在 Runtime 层原型化 `Active`、`BudgetPaused`、`WaitingForAuthority` 与 Settlement-only 行为，不改变 FCoP 协议语义。

### P1 — 建立 Role-aware Runtime Telemetry

把 PM / QA / Control、Worker / Tool 与 Inference 时间分开。在做激进资源回收前，先记录 Retreat Reason 与 SLO Crossing。

## 证据边界

本次 Weekly 综合基于 2026 年 8 月 5 日至 9 日发布的 15 篇 Daily Research。七天窗口从 8 月 3 日开始，但 8 月 3 日与 4 日没有符合条件的 Daily Runtime Publication。来源包含第一方文档、已合并 Maintainer Change、实现测试与有限研究证据；它们不证明通用生产可靠性、安全认证、分布式 Exactly-once Effect，也不代表市场整体采纳。

本文中的架构与预测是新的 Research Center 综合判断，不重写 Daily，也不提升 Daily 来源本身的声明强度。

## 参考资料

### 数字员工
1. [A Digital Employee Is Not Done Until Completion Is Independently Accepted](../../digital-employee/2026-08-05-verifiable-completion)
2. [A Revisable Work Graph Still Needs Authority Beyond Graph Readiness](../../digital-employee/2026-08-06-governed-revisable-work-graph)
3. [Persistent Digital Employees Need Verification-Gated State Admission, Not Durable Memory Alone](../../digital-employee/2026-08-07-verification-gated-state-admission)
4. [Digital Employees Need Pause-Preserving Budget Admission, Not Hard-Stop Semantics](../../digital-employee/2026-08-08-pause-preserving-budget-admission)
5. [Deleting a Digital Employee Context Must Revoke Authority and Reconcile Unsettled Work](../../digital-employee/2026-08-09-revocation-coupled-run-reconciliation)

### 行业架构
6. [Model Routing Must Optimize Inside Policy, Not Replace It](../../industry/2026-08-05-governed-model-routing)
7. [Enterprise Agent Control Planes Need Decision Envelopes, Not Configuration Precedence Alone](../../industry/2026-08-06-enterprise-agent-decision-envelope)
8. [Agent Resource Planes Need Role-Aware Scheduling, Not Average Utilization Targets](../../industry/2026-08-07-role-aware-agent-resource-plane)
9. [Enterprise Agent Governance Needs a Lifecycle-Revalidated Policy Plane](../../industry/2026-08-08-lifecycle-revalidated-policy-plane)
10. [Enterprise Agent Identity Planes Should Separate Rotating Assertions, Credential Leases and Propagation](../../industry/2026-08-09-rotating-assertion-short-lived-credential)

### 开源工程
11. [Guardrails Need a Persistence State Machine, Not a Later Save Call](../../engineering/2026-08-05-guardrail-persistence-state-machine)
12. [Agent History Migration Must Preserve Semantics, Not Just Files](../../engineering/2026-08-06-semantic-migration-recovery)
13. [Deferred Agent Environments Need Stable Identity, Not Replacement-Based Provisioning](../../engineering/2026-08-07-stable-identity-provisioning-gate)
14. [Remote Agent Hosts Need Correlated Multi-Stream Contracts, Not Arrival-Order Assumptions](../../engineering/2026-08-08-correlated-multistream-host-contract)
15. [Migration Safety Requires Executed Conformance, Not Merely Correct Output](../../engineering/2026-08-09-executed-conformance-migration-safety)

### Runtime 证据
16. [2026-08-05 Daily Runtime Record](https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/records/daily/2026/08/2026-08-05-daily-runtime.json)
17. [2026-08-06 Daily Runtime Record](https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/records/daily/2026/08/2026-08-06-daily-runtime.json)
18. [2026-08-07 Daily Runtime Record](https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/records/daily/2026/08/2026-08-07-daily-runtime.json)
19. [2026-08-08 Daily Runtime Record](https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/records/daily/2026/08/2026-08-08-daily-runtime.json)
20. [2026-08-09 Daily Runtime Record](https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/records/daily/2026/08/2026-08-09-daily-runtime.json)
