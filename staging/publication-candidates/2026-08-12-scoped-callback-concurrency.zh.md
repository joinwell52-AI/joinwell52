---
schema: "publication-candidate-article/v2"
title: "并发不该先问锁：嵌套 Callback 的最小安全单元"
date: "2026-08-12"
column: "open-source-engineering"
category: "daily"
article_type: "engineering-insight"
edition: "research-center"
research_question: "How can a nested asynchronous tool runtime preserve ownership, cancellation and bounded failure without globally serializing independent sessions?"
summary: "嵌套 Callback 的安全并发不是先选择锁，而是先建立归属、生命周期、容量和隔离四条边界；一旦越过进程，这些局部边界还必须升级为可持久重建的协议。"
sources: "https://github.com/openai/codex/commit/ba2fb483197a6b428b8c6d999d192bb056c64ae7; research/analysis/Q-20260812-03-scoped-callback-concurrency.md; research/reading/Q-20260812-03-grpc-callback-ownership-cancellation.md"
cover: "./2026-08-12-scoped-callback-concurrency-cover.png"
---

![三条各自封闭的工业穿梭轨道在同一空间内并行前进，彼此可见却不互相阻塞](./2026-08-12-scoped-callback-concurrency-cover.png)

*题图：Research Center 原创编辑视觉；并发来自可识别、可终止的独立通道，而不是把所有工作塞进同一把锁。*

# 并发不该先问锁：嵌套 Callback 的最小安全单元

一个远程 Session 正在执行长任务，执行到一半需要反向调用宿主工具。Callback 已经发出，用户随后终止 Cell；与此同时，另一 Session 发起一项很小的查询。

如果系统首先问“这段代码该加哪把锁”，两个问题很容易被绑在一起：已失去所有者的 Callback 仍在等待，独立 Session 也被大请求拖住。更有用的起点是：**这次 Callback 属于谁，它还能活多久，它最多占用多少容量，它的等待是否会越过 Session 边界？**

OpenAI Codex 的[所选变更](https://github.com/openai/codex/commit/ba2fb483197a6b428b8c6d999d192bb056c64ae7)把 gRPC Code-mode Callback 转发给 Session Delegate，并展示了几项具体边界：准入前核对 Cell 所有权与可用工具；用 Cancellation Token 连接执行生命周期；限制 Pending Delegate Calls 和近期 Callback ID；测试一个大 Unary Completion 不会阻塞独立 Session。这些事实支持一组可迁移的工程判断，但没有建立跨进程 Exactly-once、持久恢复或外部副作用回滚。

## 把“回到哪里”升级为“谁仍然拥有它”

Callback ID 只能回答消息如何匹配，不能证明接收者仍有权处理它。一个安全的 Callback 至少应绑定 Session、Execution 或 Cell、获准工具集合和当前 Cancellation Scope。

因此，路由表不是普通的 `id -> promise`。它更接近一份短期能力租约：只有创建它的执行实例仍处于可接收状态、所请求工具仍在能力包络中，结果才可以回流。Cell 已结束、Session 已替换或工具授权已撤销时，即使网络响应晚到，也不应重新激活旧执行。

## 一个安全单元需要四条边界

| 边界 | 它限制什么 | 缺失后的典型故障 |
|---|---|---|
| Ownership | Callback 属于哪个 Session / Cell | 结果串入错误执行或孤儿结果被接纳 |
| Lifetime | 何时取消、排空或拒绝晚到结果 | 终止后仍占资源，旧结果复活 |
| Capacity | Pending 数量、ID 与 Payload 上限 | 单个会话耗尽内存或调度容量 |
| Isolation | 一个会话的等待能否阻塞其它会话 | 大 Completion 形成全局队头阻塞 |

这四条边界共同定义“最小安全单元”。锁只是在单元内部保护状态的一种实现工具；它不能替代所有权检查，也不能自动提供取消、背压和跨 Session 隔离。

## 全局锁是组织复杂度的税

最省事的做法，是用一个全局 Map 和一把全局锁管理所有回调。它在低并发测试中通常正确，却把本不相关的 Session 变成了共同故障域：慢解码、超大结果、锁内通知或清理路径都可能让其它 Session 排队。

更稳妥的结构是按 Session 或执行实例分区状态，只在极短时间内完成查找和所有权验证，把大 Payload 的传输、Delegate 执行和完成通知留在锁外。来源中的独立 Session 非阻塞测试值得保留，因为它验证的不是吞吐数字，而是隔离承诺。

## 结束不是一种状态

“Cell 不再运行”至少有两种含义。正常完成时，已经接纳的通知可能需要排空，确保结果被观察；强制终止时，应传播取消，停止仍在等待的工作。把两者统一为简单删除，会在一边丢失已完成结果，在另一边留下孤儿任务。

关闭协议因此应显式区分：不再接受新 Callback、排空已接纳项、取消未完成项、拒绝晚到结果、释放身份记录。近期 ID 集合的上限也不是小优化；它是在重复、晚到和内存无界增长之间画出有限时间窗口。

## 一旦越过进程，局部所有权就不够了

内存中的 Session、Token 和 Callback ID 能保护单进程生命周期，却无法回答重启后的同一性。进程在外部工具已经执行、完成事件尚未记录时崩溃，新的 Runtime 不知道应该重试、查询还是补偿。

此时需要的不是把本地 Map 永久保存，而是提升协议层级：为执行实例和外部效果提供稳定身份，记录可验证的准入与完成事件，并让外部工具支持幂等键、读回或补偿。这属于进一步设计；所选提交没有证明这些能力，不能从本地并发安全外推为分布式可靠性。

## 一套可迁移的工程判据

审查类似系统时，可以先做五项反例测试：终止 Cell 后让结果晚到；让一个 Session 返回超大 Completion；填满 Pending Callback；复用旧 ID；在外部效果后、完成记录前杀死进程。

前四项检验局部所有权、生命周期、容量和隔离；最后一项揭示是否已经跨入持久协议问题。若一个实现只能证明“没有数据竞争”，却不能明确回答这五项结果，它仍不足以称为安全的 Agent Callback Runtime。

可保留的结论很窄：**并发安全的起点不是全局互斥，而是让每次 Callback 成为有所有者、有期限、有容量上限、不会拖住邻居的工作单元；跨进程以后，还必须用持久事实重新证明它是谁。**

### 证据与引用

- **源码已经显示：**所选 Codex 路径包含所有权检查、取消传播、容量限制和独立 Session 非阻塞测试。同提交测试仍是项目自身证据，不等于独立验证。
- **源码尚未证明：**跨进程恢复、Exactly-once 和外部副作用回滚仍未建立。
- **本文建议进一步验证：**增加稳定执行身份、持久事件和外部幂等或读回，并通过故障注入检验跨重启行为。

**参考资料：**

- OpenAI Codex，[`ba2fb48` — Forward gRPC code-mode callbacks to session delegates](https://github.com/openai/codex/commit/ba2fb483197a6b428b8c6d999d192bb056c64ae7)，代码提交及同提交测试变更。
