---
schema: "publication-candidate-article/v1"
title: "数字员工需要显式的执行权边界"
date: "2026-08-11"
column: "digital-employee"
category: "daily"
summary: "定时到点、任务到达或进入队列，只能证明工作存在，不能证明已经获得执行权限。数字员工运行时应把任务到达、显式 Worker Claim、受治理 Running 状态与终态证据分开，并只通过明确的执行身份引入并发。"
sources:
  - "research/analysis/Q-20260811-01-execution-authority-ordered-work.md"
  - "research/reading/Q-20260811-01-ordered-local-work-queue.md"
item_id: "Q-20260811-01"
lifecycle: "Publication Candidate"
source_research_object: "research/analysis/Q-20260811-01-execution-authority-ordered-work.md"
source_reading_result: "research/reading/Q-20260811-01-ordered-local-work-queue.md"
cover: "staging/publication-candidates/2026-08-11-execution-authority-ordered-work-cover.svg"
visualization: "staging/publication-candidates/2026-08-11-execution-authority-ordered-work-figure.svg"
visualization_decision: "Required — 独立编辑性题图 + 独立顺序执行通道解释图"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: false
---

# 数字员工需要显式的执行权边界

定时器已经触发、用户请求已经到达、任务已经进入队列，都不能自动推出“现在可以执行”。对于数字员工而言，真正关键的不是有没有排程，而是**何时从‘工作存在’跨越到‘获得执行权’**。

## 题图

![执行权边界编辑性题图](./2026-08-11-execution-authority-ordered-work-cover.svg)

## 解释图

![顺序执行通道与执行权边界](./2026-08-11-execution-authority-ordered-work-figure.svg)

## 摘要

GitHub Copilot CLI 1.0.79 给出了一个很有价值的工程边界：当本地 Session 中已有任务正在执行时，新的 Prompt、Shell 命令和受支持的 Slash Command 可以继续到达，但会排队，并在当前任务结束后按顺序执行。同一个版本又单独支持多个并发 Session。这说明，顺序性不是“整个系统永远只能做一件事”，而是**在明确的执行身份内部保持确定性顺序，再通过新的 Session / Worker 身份建立并发边界**。

Research Center 的判断比“加一个队列”更严格：产品级数字员工运行时至少应该区分 `Received/Scheduled → Queued → Claimed → Running → Terminal`。其中 **Claimed 才是执行权真正发生转移的边界**。定时器唤醒只能证明需求已出现，Worker Claim 才证明某个执行主体获得了该通道的执行权限。

## 来源

主要一手证据来自 GitHub Copilot CLI 1.0.79 的维护者变更记录：

- https://github.com/github/copilot-cli/commit/ef627e1baad937d3c8da45f8a5541c6fc3c97b6a

本次 Production 只消费 2026-08-11 当日已完成的 Research Object `Q-20260811-01` 及其 Reading Result。该来源能够证明已发布行为，但没有公开队列的数据结构、持久化格式或内部锁实现。

## 观察

这个版本同时出现三组相关机制。第一，新任务可以在当前任务执行期间到达，但只能排队等待，说明“到达”和“执行”是两个不同事件。第二，多个并发 Session 被明确支持，说明顺序性至少受到 Session Identity 的边界约束，而不是一个全局单队列。第三，由 Sandbox 导致的 MCP 与 Language Server 启动异常不再无限卡住，而是转化为有界失败，并且 `/sandbox policy` 可以显示实际生效的策略，而不只是配置意图。

这三点共同指向一个运行时原则：一个执行通道同一时刻应该只有一个明确的权威持有者；可能阻塞通道的启动依赖必须有有界失败；操作界面应该展示真正生效的执行策略和证据。

## 比较

| 运行事实 | 能证明什么 | 不能证明什么 | 证据类型 |
|---|---|---|---|
| 定时器触发 / 请求到达 | 工作已经存在 | 可以立即修改状态或执行副作用 | 基于已发布排队行为的 Research Center 推断 |
| 已进入队列 | 工作已经获得顺序位置 | Worker 所有权或真实进度 | 已发布行为 + 架构分析 |
| Worker 显式 Claim | 某个执行身份取得当前通道 | 业务已经成功 | Research Center 架构建议 |
| Running | Claimed 工作处于受租约保护的执行期 | 永久活跃或已经完成 | Research Center 架构建议 |
| 终态证据 | 当前通道可以按治理规则释放 | 外部副作用天然 exactly-once | Research Center 架构建议 |
| 多 Session | 存在显式并发身份边界 | 已解决跨 Session 资源仲裁 | 已发布能力；仲裁机制未知 |

## 讨论

最危险的设计是把 `Running` 承担太多语义。如果 Scheduler 在真正 Worker 接单之前就把任务改成 Running，运营页面就可能显示“工作中”，但实际上没有任何执行主体在工作。反过来，如果下一个定时器仅因为时间到了就启动后续任务，系统又会出现两个班次同时执行，即使更早的班次还没有真正收口。

更可靠的模型应该拆开事实：`Wake Received` 只记录定时器确实启动；`Queued` 记录待处理意图；`Worker Claimed` 记录执行权；`Running` 是有时效的执行租约；显式 Terminal State 再决定当前通道是否可以释放给下一项工作。

并发应该建立在这个模型之上，而不是藏在一个执行通道内部。不同 Session、Worker 或 Workspace 可以拥有各自确定性的本地顺序；跨通道共享文件、外部系统或业务副作用，则必须再有显式同步或 Custody 规则。

## 工程影响

对于数字员工平台，应把 Scheduler Receipt 和 Worker Claim 分开持久化，把固定时间仅视为 Wake Signal。Process Manager 只有在更早任务已经收口后，才可以把执行权授予下一项到期任务。

对于 CodeFlowMu，ADMIN/PM 任务到达和 Runtime 定时唤醒都应保持为 Queue Fact。UI 应明确区分 `Scheduled/Received`、`Waiting`、`Claimed`、`Running` 和终态，避免“执行槽已打开”被误解为“Worker 正在工作”。MCP 初始化等启动依赖需要独立超时和失败证据，不能无限占用 Running。

对于 TMPA，这一机制可以作为区分 Intent、Custody、Execution Authority 与 Terminal Evidence 的工程研究输入，但单一产品 Changelog 还不足以支持协议层面的队列或持久化规则。

## 边界与不确定性

来源没有说明队列是否跨重启持久化，也没有定义容量、优先级、饥饿、去重或失败项如何影响后续队列。同时，多 Session 已被明确支持，但跨 Session 的文件系统和外部副作用仲裁没有被公开说明。因此可以借鉴的是**顺序执行原则**，而不能把它扩张成“Copilot CLI 已经实现了重启安全或 exactly-once 队列”。

## 后续研究

产品级数字员工应专门测试 Wake Receipt、队列持久化、Worker Claim、工具启动、终态落盘之间的崩溃点；同时还要定义取消、失败、部分外部副作用发生后，哪些终态能够释放下一项工作，以及一个数字员工到底应该只有一个全局通道，还是拥有多个 Role / Workspace Scope 的执行通道。

## 可视化说明

题图采用语言依赖较低的“单一闸门 + 等待工作 Token”视觉隐喻，可在缩略图尺度识别主题；解释图则单独承担状态和顺序机制说明。两张图均为 Research Center 原创，不使用厂商图，也没有人为制造量化数据。

## 参考资料

1. GitHub，Copilot CLI 1.0.79 维护者 Changelog Commit `ef627e1baad937d3c8da45f8a5541c6fc3c97b6a`，2026-08-10：https://github.com/github/copilot-cli/commit/ef627e1baad937d3c8da45f8a5541c6fc3c97b6a
2. Research Center Research Object：`research/analysis/Q-20260811-01-execution-authority-ordered-work.md`
3. Research Center Reading Result：`research/reading/Q-20260811-01-ordered-local-work-queue.md`

> Editing status: PASS for Production Candidate。事实、证据边界、术语、双语结构与未发布边界已核对；当前仍未发布。
