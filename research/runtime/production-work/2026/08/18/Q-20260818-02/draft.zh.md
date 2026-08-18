---
schema: publication-candidate-article/v2
title: "持久化不等于唤醒机制"
date: '2026-08-18'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "为什么持久化存储本身不足以保证已经落盘的 Agent 工作一定会被活跃 Runtime 发现并恢复？"
summary: "Persistence 与 Reconciliation 是两项不同责任。Codex 当日合并的 Queue 变更展示了一个具体方案：粗粒度发现跨连接变化，用持久 Per-thread Revision 定位变化 Queue，单独处理 Created/Resumed 生命周期，再把重试所有权隔离到每个 Thread。它并不证明 Exactly-once 或分布式排他执行。"
cover: staging/publication-candidates/2026-08-18-persistence-reconciliation-cover.png
sources:
  - research/analysis/Q-20260818-02-persistence-reconciliation-separation.md
---

![持久化不等于唤醒机制 题图](staging/publication-candidates/2026-08-18-persistence-reconciliation-cover.png)

# 持久化不等于唤醒机制

一个任务可以“持久得很好”，却一直不执行。数据仍在，Queue Entry 没丢，进程重启后也能恢复；但如果另一个进程修改了这份状态，当前活跃 Worker 可能根本没有理由再看一眼。

这就是 **Persistence** 与 **Reconciliation** 的边界。Persistence 回答“工作有没有活下来”；Reconciliation 回答“活跃 Runtime 怎样重新发现这些仍然存在、并且已经变得可执行的工作”。

2026-08-18 合并的一项 Codex 变更给出了一个 SQLite 后端的具体例子：Watcher 使用 `PRAGMA data_version` 粗粒度发现其他连接提交的变化，用持久 Per-thread Revision 定位哪些已加载 Queue 发生了变化，单独处理 Created/Resumed Thread 的 Reconciliation，并给每个受影响 Thread 独立 Retry Task，使一个卡住的 Wake 不会串行拖住无关 Queue。

这个实现没有声称分布式 Exactly-once。它更有价值的地方，是把“数据已经落盘之后还缺什么”拆成了可复用的责任。

## 持久状态仍然可能长期休眠

纯内存 Wake Signal 只有在 Producer 与 Consumer 共享同一个活跃进程和通知路径时才可靠。一旦 Queue 可以被另一个 Connection 或 Process 修改，持久 Store 就成了一个会在 Worker 视野之外变化的权威事实源。

SQLite 的 `data_version` 可以廉价回答“另一个连接是否改过数据库”，却不会告诉 Runtime 改的是哪条记录、谁改的、影响哪个 Queue。因此实现又增加了持久 Per-thread Revision 与 `changes_since` 查询：第一层只告诉你“可能有变化”，第二层再缩小到具体已加载对象。

这种两级结构并不局限于 SQLite：

- Store-level Signal 回答 **是否可能发生变化**；
- Object-level Identity 回答 **哪一个持久对象变化了**；
- Reconciliation 再决定 **它现在是否需要被推进**。

Revision 是“变化证据”，不是“执行证据”。如果把 Revision 当作 Work Token，就会再次把 Discovery 与 Ownership 混成一个机制。

## Reconciliation 还有一个生命周期入口

对象变得相关，并不一定伴随一次新的数据库写入。某个 Thread 可能在数据早已存在之后才被重新 Load 或 Resume。如果 Runtime 只盯着新的全局 Store Mutation，这个 Thread 就可能错过检查窗口。

Codex Watcher 因而把 Created 与 Resumed Thread 作为独立 Reconciliation 输入：即使当前观察窗口内 `data_version` 没变化，也可以从 Revision Zero 开始检查。Created-thread Broadcast 出现 Lag 时，还会退回到 Manager 的完整 Loaded-thread 列表。

这里揭示了第二个责任分离：**External-change Detection 与 Local Lifecycle Discovery 是两种不同触发器，但都服务于 Reconciliation。** 持久工作系统必须明确这两个入口。

## Retry Ownership 应尽量窄

只有 Discovery 仍不足以提供 Liveness。若一个失败 Wake 能一直占住全局恢复循环，其他 Queue 即使已经被发现也会排在它后面。

已演示设计为每个变化 Thread 启动独立 Watcher-dispatch Task，并保证同一 Thread 同时最多只有一个 Watcher Task。只要 Queue 仍有工作而 Wake 还没有解决，它就固定等待 10 秒再尝试。

固定 10 秒只是当前实现选择，并非已证明的最佳策略。真正值得保留的是 Ownership 边界：**失败 Thread 自己拥有 Retry Delay，而不是占住一个全局 Retry Loop。**

当然，独立 Retry 也可能在高负载下制造并发压力，因此仍可能需要 Backoff、Jitter、Fairness、Admission 与 Load Shedding。Wake Layer 的隔离并不等于所有下游资源都不会重新出现 Head-of-line Blocking。

## Reconciliation 不是排他执行证明

最容易过度推断的地方出现在“成功 Wake”之后。Revision 可以让 Runtime 知道某个 Work Object 发生了变化，Watcher 也可以重新发现并请求现有执行路径继续处理。但这些事实都无法证明第二个 Runtime 没有同时看到相同变化，并发起同样的尝试。

如果系统需要更强保证，就要增加另一层：Claim 或 Lease、Idempotency Identity、Transactional Fencing，或其他等价的 Ownership Contract。Exactly-once、Consensus 与 Global Ordering 都不是一个良好 Reconciliation Loop 的自然结果。

因此，“持久任务”最好不要被写成一句模糊承诺，而应拆成若干可测试合同：

1. **Persistence**：状态能跨进程故障保存；
2. **Change Identity**：持久变化能定位到对象；
3. **Reconciliation**：活跃 Runtime 能在外部变化与生命周期转换后重新发现相关工作；
4. **Retry Ownership**：单个失败对象不能无限阻塞无关 Rediscovery；
5. **Execution Ownership**：若业务需要，再用独立 Claim/Idempotency 层防止危险重复 Effect。

本次变更主要照亮前四项，第五项仍是明确的工程问题。

所以，一个任务写进磁盘，并不代表“持久化工作”已经设计完成。真正可运行的 Durability 还必须回答：谁负责发现它、Resume 后怎样重新进入扫描、失败 Wake 由谁重试，以及当重复执行不可接受时，哪一层负责排他与幂等。

**一手证据：** [OpenAI Codex 合并提交 eeb82a15](https://github.com/openai/codex/commit/eeb82a156d1b3944dca4234c3043296529ec5837)。实现与仓库测试属于公开一手证据，并不构成独立多进程可靠性 Benchmark，也不证明分布式 Exactly-once。
