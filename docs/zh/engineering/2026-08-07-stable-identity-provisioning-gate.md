---
title: "延迟 Agent 环境需要稳定身份，而不是替换式 Provisioning"
date: '2026-08-07'
column: open-source-engineering
category: daily
summary: "延迟环境的关键不是不断 upsert 新对象，而是在同一逻辑身份上显式报告 Pending、Ready、Failed，并让 materialize 与 report 收敛到同一生命周期对象；进程内幂等仍不等于重启后耐久或分布式 exactly-once。"
item_id: Q-20260807-03
source_research_object: "research/analysis/Q-20260807-03-stable-identity-provisioning-gate.md"
source_reading_result: "research/reading/Q-20260807-03-deferred-environment-provisioning.md"
lifecycle: Published
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
outline: deep
---

<ArticleCover
  image="/assets/covers/daily-2026-08-07-stable-identity-provisioning-gate.svg"
  kicker="开源工程 · 每日研究"
  title="延迟 Agent 环境需要稳定身份，而不是替换式 Provisioning"
  summary="延迟环境的关键不是不断 upsert 新对象，而是在同一逻辑身份上显式报告 Pending、Ready、Failed，并让 materialize 与 report 收敛到同一生命周期对象；进程内幂等仍不等于重启后耐久或分布式 exactly-once。"
  version="Q-20260807-03"
  status="Daily Runtime V5 · 2026-08-07"
  languageHref="/en/engineering/2026-08-07-stable-identity-provisioning-gate"
  languageLabel="English"
/>
# 延迟 Agent 环境需要稳定身份，而不是替换式 Provisioning

Agent Runtime 越来越常见一种资源：现在还不能使用，但任务已经需要引用它。远程 sandbox、browser environment、workspace、tool container 都可能先进入 Pending，稍后才变成 Ready 或 Failed。

这种情况下，最危险的 API 设计不是“等待时间太长”，而是**生命周期变化时不断替换资源对象**。一旦 identity 被替换，排队中的任务、UI 投影、引用关系和审计日志就要追逐一个新对象，race 与状态漂移随之增加。

同日完成的 Research Object 给出的核心模式是：稳定 identity + 显式 report-and-materialize lifecycle。

## 核心判断

**Provisioning state 应该变化，资源 identity 不应该跟着变化。**

Pending、Ready、Failed 是同一个逻辑资源的生命周期类。`report` 负责提交状态，`materialize` 负责建立或取得对应的 provisioned object；两者无论谁先到，都应收敛到同一个 identity，而不是靠 replacement/upsert 把旧对象覆盖掉。

这套本地幂等语义很有价值，但也必须守住边界：进程内 stable identity 和 lock-protected state 不能被宣传成 crash durability、multi-process consensus 或 exactly-once external provisioning。

## 来源

本文只消费 `Q-20260807-03` 的 Production-authorized Research Object。Production 没有从 Signal Pool 或 Reading Result 重新研究，也没有引入新的外部事实。Reading Result 仅作为 Research Object 声明的证据边界和来源追溯入口。

## 观察

Research Object 保留了五个关键机制。

第一，deferred environment 的状态操作被收敛成两个 manager-level surface：provisioning-status reporting 与 explicit materialization。这样 caller 不需要分别维护多个 upsert 路径。

第二，report-first 与 materialize-first 都指向同一个 stable provisioned environment identity。Pending、Ready 或 Failed 更新不会更换被其他任务引用的逻辑对象。

第三，ordinary environment 与 provisioned environment 被明确分开。对普通环境发送 provisioning report 会以 `Ok(None)` 被忽略；而对普通环境执行 materialization 会返回 typed `ProvisioningModeConflict`，并保留原对象。这种不对称语义可以合理，但如果 Runtime 没有 audit surface，`Ok(None)` 很容易被调用者误读成“状态已经接受”。

第四，terminal lifecycle class 是 sticky 的：Ready 与 Failed 不能互相翻转，重复的同类 terminal report 可以幂等处理。不过 Ready 内部 payload 仍可以更新，因此“Ready 幂等”并不等于“整个 Ready 记录永久不可变”。

第五，移除 registration-handle Drop 自动写 Failed 后，生命周期变得更显式，但也失去了一个隐式 abandonment signal。系统必须把 timeout、disappeared worker 和 terminal failure 的所有权交给明确的上层组件。

## 比较

| 设计 | Identity | 生命周期更新 | 冲突处理 | 恢复能力 |
|---|---|---|---|---|
| Replacement / upsert | 状态变化可能换对象 | caller 分散更新 | 容易被覆盖语义吞掉 | 引用与任务需追逐新对象 |
| Stable identity + report/materialize | 单一逻辑 resource ID | Pending / Ready / Failed 显式报告 | typed mode conflict；部分 report 可忽略 | 进程内顺序与 race 更可控 |
| Durable production extension | Stable resource ID + persistent event/receipt | 本地状态之外有持久事件与 effect receipt | conflict 与 ignored report 都可审计 | 可在重启后对账，仍需外部幂等 |

前两行来自 Research Object 的机制分析；第三行是 Research Center 对生产 Runtime 的工程扩展建议，不表示所分析实现已经提供重启耐久或 exactly-once 保证。

## 讨论

这类 Provisioning API 的价值在于把四件事拆开：**资源 identity、lifecycle class、readiness payload，以及 connection/use activation。**

identity 应稳定，因为任务和 UI 都需要一个不会随状态变化而漂移的引用点。lifecycle class 应显式，因为 Pending、Ready、Failed 是不同控制意义。readiness payload 可以有版本，因为 Ready 后能力根、endpoint 或 metadata 仍可能被补充。connection/use 则应再次单独建模，因为“环境已经 Ready”并不等于“某个任务已经连接并开始使用”。

report/materialize 的顺序无关性也很重要。一个 status report 可能先于显式 Pending 对象到达；只要最终能收敛到同一个 identity，caller 就不需要靠重试顺序制造正确性。

但 local idempotence 不能替代 distributed durability。进程退出后，如果没有持久 event、receipt 或 external idempotency key，Runtime 仍然不知道某次 provisioning side effect 是否已经发生。此时“再次 materialize”可能创建第二个真实资源，而内存 manager 自己无法证明 exactly-once。

## 工程影响

对数字员工，remote browser、sandbox、workspace 或 tool environment 应拥有独立的 durable logical resource ID。Provisioning completion 与 connection/use start 应是两个可观察 transition，避免 Ready 自动等于 Active。

Runtime 需要一个明确 owner 负责 timeout 与 abandonment。既然 Drop 不再自动把消失的 registration 解释成 Failed，那么 owner 必须周期性判断 Pending 是否已经失去执行主体，并产生显式 terminal verdict。

对 CodeFlowMu，worker/tool-environment provisioning 更适合统一成 report-and-materialize API，而不是多个 caller 各自 replacement/upsert。FCoP/Runtime 层可以在 manager 之上增加 append-only provisioning event、effect receipt 与 recovery reconciliation。对 ordinary environment 的 ignored report 也应至少产生可观测 diagnostic，使 operator 能区分 benign late report 与 caller bug。

## 边界与反证

当前证据只建立进程内 manager 语义与回归测试。它没有证明 restart recovery、multi-process race、remote connection 成功、fleet-level reliability 或外部副作用的 exactly-once。

`Ok(None)` 的 ignored report 可能隐藏调用错误；移除 Drop-based failure 后 Pending 可能长期无人负责；Ready payload 在 Ready 类内仍可变化；被移除 API 的下游兼容性也没有由当前对象证明。

因此，可辩护的结论是“稳定 identity 与显式 lifecycle 能减少本地歧义”，而不是“该实现已经解决分布式 Provisioning”。

## 未来工作

下一步应明确四个问题：谁拥有 timeout 与 terminal failure；ignored report 是否必须生成 audit event 以及 severity 如何划分；重启后需要怎样的持久 event/receipt 才能恢复 Pending/Ready/Failed 而不重复外部副作用；Ready payload 中哪些字段应该在什么时点冻结或版本化。

## 可视化说明

配图以一个 Stable Resource ID 为中心，展示 report-first/materialize-first 收敛到 Pending/Ready/Failed，并将 Connection/Use 与 Provisioning lifecycle 分开；下方 durable event/receipt layer 明确标注为生产扩展建议，而非来源已证明能力。

## 证据与引用

1. [Research Object — Stable-Identity Provisioning Gate](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260807-03-stable-identity-provisioning-gate.md)：本文唯一分析输入，包含生命周期语义、不确定性、反证与工程影响。
2. [Reading Result — Deferred environment provisioning](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260807-03-deferred-environment-provisioning.md)：Research Object 声明的证据边界与来源追溯记录；Production 未从该文件重新开展分析。
