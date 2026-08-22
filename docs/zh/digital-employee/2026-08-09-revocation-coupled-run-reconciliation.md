---
title: "删除数字员工工作上下文时，必须同步撤销权限并清理未结工作"
date: '2026-08-09'
column: digital-employee
category: daily
summary: "删除 Conversation、WorkOrder 或其他长期工作上下文，不能只是把对象从界面隐藏。更可靠的运行机制是把删除解释为权限撤销，在与任务准入相同的序列化边界内清理全部未结子任务，并用 Worker Lease 处理已经进入物理执行的工作。"
item_id: Q-20260809-01
source_research_object: "research/analysis/Q-20260809-01-revocation-coupled-run-reconciliation.md"
source_reading_result: "research/reading/Q-20260809-01-conversation-delete-run-cancellation.md"
lifecycle: Published
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
outline: deep
cover: "/assets/covers/daily-2026-08-09-revocation-coupled-run-reconciliation-cover-v2.jpg"
---

<ArticleCover
  image="/assets/covers/daily-2026-08-09-revocation-coupled-run-reconciliation-cover-v2.jpg"
  kicker="数字员工 · 每日研究"
  title="删除数字员工工作上下文时，必须同步撤销权限并清理未结工作"
  summary="删除 Conversation、WorkOrder 或其他长期工作上下文，不能只是把对象从界面隐藏。更可靠的运行机制是把删除解释为权限撤销，在与任务准入相同的序列化边界内清理全部未结子任务，并用 Worker Lease 处理已经进入物理执行的工作。"
  version="Q-20260809-01"
  status="Daily Runtime V5 · 2026-08-09"
  languageHref="/en/digital-employee/2026-08-09-revocation-coupled-run-reconciliation"
  languageLabel="English"
/>
# 删除数字员工工作上下文时，必须同步撤销权限并清理未结工作

数字员工运行时间越长，删除一个 Conversation、WorkOrder 或业务会话就越不能被理解成普通的界面操作。对象虽然可以立即从列表消失，但它关联的排队任务、审批等待、正在执行的 Worker 和执行槽未必同步消失。

## 核心判断

**删除长期工作上下文，本质上是撤销继续执行的权限，并对所有未结子任务进行治理性清理。**

最关键的机制不是“删除后再找一个清理脚本”，而是让任务准入与上下文撤销共享同一个持久化序列化边界。只有这样，系统才能保证：撤销发生时，不会有一个新的任务从并发缝隙里被准入，随后变成用户再也看不到的孤儿工作。

本文唯一分析输入是 `Q-20260809-01` Research Object。Production 未重新读取 Signal Pool，也未引入新的研究对象。

## 来源

本文基于 [Research Object — Revocation-Coupled Run Reconciliation](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260809-01-revocation-coupled-run-reconciliation.md)。其证据追溯入口是 [Reading Result — Conversation Delete Run Cancellation](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260809-01-conversation-delete-run-cancellation.md)。

Reading Result 记录的是一项已合并实现：删除 Conversation 时，系统在与任务准入相同的 Conversation Row Lock 下处理未结 Run。本文不把该实现外推为所有分布式系统的 Exactly-once 证明。

## 观察

研究对象区分了三类容易被一个“取消”按钮混为一谈的状态：

- `QUEUED`：尚未进入物理执行，可以在事务内直接关闭；
- `AWAITING_APPROVAL`：虽然可能已有结束时间字段，但业务上仍未结清，也应纳入撤销范围；
- `RUNNING`：数据库可以记录取消意图，但已经离开事务边界的 Worker 只能协作式停止。

因此，判断“是否未完成”不能只依赖 `finishedAt = null` 之类的存储捷径。真正可靠的清理范围应由业务状态集合定义。

## 机制比较

| 处理方式 | 能否阻止并发新任务 | 能否覆盖审批等待 | 能否证明 Running Worker 已停止 | 孤儿任务风险 |
|---|---:|---:|---:|---:|
| 只做界面隐藏 | 否 | 否 | 否 | 高 |
| 删除后异步扫描 | 不稳定 | 取决于扫描条件 | 否 | 中到高 |
| 同一锁下撤销与清理 | 是 | 是 | 只能记录取消意图 | 低，但仍需 Lease |
| 同一锁 + Worker Lease/Watchdog | 是 | 是 | 可在租约过期后完成治理收敛 | 最低 |

该表是 Research Center 基于 Research Object 的机制综合，不表示来源实现已经给出完整的通用 Worker Lease 方案。

## 讨论

同一锁边界的意义是建立明确的先后关系：要么新任务先被准入，随后被撤销事务看见并清理；要么撤销先完成，后续准入读取到已删除状态并被拒绝。没有这个边界，删除和准入就可能分别成功，留下一个没有可见父上下文的工作实例。

但数据库事务只能治理持久状态。一个已经 Running 的 Worker 可能正在远程机器、浏览器、MCP Server 或外部工具中执行。写入 `cancelRequestedAt` 并不等于物理执行已经停止，也不等于它不会在稍后提交副作用。

因此，完整治理必须再增加 Worker Lease：

```text
权限撤销
→ 写入取消意图
→ Worker 在租约内确认停止
→ 未确认则租约过期
→ 旧 Worker 被 fencing，替代恢复流程接管
```

这也是数字员工与普通 CRUD 软件的重要差别。删除一条记录只处理数据对象；删除一个数字员工工作上下文，还必须处理已经被派出的执行能力。

## 工程影响

对数字员工 Runtime，建议把以下事件分别记录，而不是压缩成一个 `cancelled`：

- 上下文权限被撤销；
- 未结子任务集合被识别；
- 排队与审批等待任务已同步关闭；
- Running Worker 已收到取消意图；
- Worker 已确认停止，或 Lease 已过期；
- 执行槽已释放；
- 迟到结果是否被 fencing 拒绝。

对 CodeFlowMu，Scheduler 的“执行槽已打开”不能继续被当成 Worker 正在有效推进的充分证据。运行状态需要 Worker claim、heartbeat、lease expiry 和终态结果共同支撑。

## 边界与不确定性

当前证据没有建立 Running Worker 的最大停止时间，也没有证明网络分区下的物理执行能够 Exactly-once 终止。外部系统已经产生的副作用如何补偿，也不在所选实现的证据范围内。

所以本文的判断不是“一个事务就解决了取消问题”，而是：**事务负责权限与持久状态的一致性，Lease/Watchdog 负责物理执行的有界收敛。两者缺一不可。**

## 未来工作

下一步应验证：不同任务类型的 Lease 时长如何设定；替代 Worker 启动后如何拒绝旧 Worker 的迟到提交；外部副作用是否需要补偿记录；以及运营页面如何区分“已请求取消”“已停止”和“租约已过期”。

## 可视化说明

配图展示任务准入与上下文撤销共享 Row Lock，随后按状态分别处理排队/审批工作与 Running Worker。图中的 Lease Watchdog 是 Research Center 基于 Research Object 提出的完整化机制，不是来源实现已经证明的功能。

## 证据与引用

1. [Research Object — Revocation-Coupled Run Reconciliation](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260809-01-revocation-coupled-run-reconciliation.md)：本文唯一分析输入。
2. [Reading Result — Conversation Delete Run Cancellation](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260809-01-conversation-delete-run-cancellation.md)：实现事实、限制与未决问题的追溯入口。
