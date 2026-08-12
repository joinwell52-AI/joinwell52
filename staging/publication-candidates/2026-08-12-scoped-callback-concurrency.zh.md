---
schema: "publication-candidate-article/v2"
title: "不靠全局锁实现并发：嵌套 Agent Callback 的作用域所有权"
date: "2026-08-12"
column: "open-source-engineering"
category: "daily"
article_type: "engineering-insight"
edition: "research-center"
research_question: "How can a nested asynchronous tool runtime preserve ownership, cancellation and bounded failure without globally serializing independent sessions?"
summary: "嵌套 Callback 的安全边界可以来自作用域所有权、取消传播和显式资源限制，而不是单一全局串行锁，从而保留独立 Session 并发。"
sources: "research/analysis/Q-20260812-03-scoped-callback-concurrency.md; research/reading/Q-20260812-03-grpc-callback-ownership-cancellation.md"
cover: "./2026-08-12-scoped-callback-concurrency-cover.svg"
---

![三条彼此独立的光弧围绕各自所有权中心运行，没有汇入单一全局瓶颈](./2026-08-12-scoped-callback-concurrency-cover.svg)

# 不靠全局锁实现并发：嵌套 Agent Callback 的作用域所有权

嵌套异步工具调用会把 Runtime 推进一个很难治理的区域：父执行需要知道 Callback 属于谁、还有什么工作可以继续、取消究竟意味着什么，以及系统愿意容纳多少未完成工作。最简单的答案是“全部串行”。所选实现展示了另一条更值得研究的路径：**先把所有权和资源边界做成显式事实，再让彼此独立的所有权域保持并发。**［证据基础：`research/analysis/Q-20260812-03-scoped-callback-concurrency.md`］

## 并发存在时，哪些事实不能丢

核心问题不是“同时可以跑多少 Callback”，而是并发存在时，Runtime 是否仍能保持归属和生命周期责任。

所选 gRPC Code-mode 路径在接纳嵌套 Callback 工作之前，会校验 Callback 身份、执行与 Cell 的所有权，以及对应工具是否启用。活动工作持有取消令牌；Completion 会观察取消状态；Cell 终止时会取消未完成工作，而正常完成的 Cell 可以让已经启动的 Notification 收尾。Pending Callback、Identifier 和 Payload 也都有显式限制。

这些事实形成了一个局部安全边界。它们没有证明跨重启 Exactly-once，但说明并发并不必然意味着所有权不可治理。

## 所有权应该是准入条件，而不是路由标签

较弱的 Callback 设计里，一个 ID 可能只负责“把结果送回哪里”，却不能证明当前接收方仍然拥有这项工作。Detached Future 很容易创建，但一旦 Parent State 变化，归属、取消和清理就会变得模糊。

所选设计把 Ownership 直接纳入 Admission。Callback 必须与当前 Execution、Cell Context 匹配，并且 Tool 已启用，才能进入 Runtime。此时 Identity 不再只是描述性元数据，而成为“这项嵌套工作是否仍有资格执行”的治理条件。

这种设计的价值在生命周期变化时最明显：如果拥有它的 Cell 已终止，未完成工作可以被取消，而不是继续成为一个脱离上下文的孤儿任务，等到原执行环境消失后再返回结果。

## 取消与资源边界让失败局部化

只有 Cancellation 还不够。如果系统允许无限 Pending Work、无限 Payload 或无限 Identifier，异步系统仍然可能在运营上失控。所选实现把 Ownership 与多个资源限制结合起来，并对超界行为提供明确拒绝或截断路径。

这意味着可靠性不需要建立在“远端参与方会自觉控制行为”的假设上，Runtime 自己拥有受限制的准入面。

证据还区分了正常完成与终止。正常完成的 Cell 可以允许已经启动的工作收尾，终止的 Cell 则能够取消未完成工作。这个差异避免了再次用一个过载的“Closed”状态抹掉生命周期含义。

## 为什么全局锁不是唯一安全模型

Global Lock 的优势是顺序简单，但它会把一个慢 Callback 变成无关 Session 的 Head-of-line Blocking。所选集成测试给出了一个有边界的反例：一个 Session 中的大型 Completion 不会阻塞另一个独立 Session。

这不能证明系统不存在任何共享资源竞争，但它足以建立一个较窄事实：当前被测试的安全模型并不依赖单一全局 Callback Lock。

因此，更一般的工程解释是：**当工作确实独立时，并发边界应该尽量跟随所有权边界。**共享资源或共享不变量需要串行化时再串行化，而不是仅仅因为并发难以推理，就把所有工作塞进同一把锁。

## 对嵌套工具 Runtime 的工程含义

这个模式带来四条直接工程要求。

第一，嵌套异步调用应携带 Execution、Cell 或 Session Owner，并在 Dispatch 前完成校验。第二，Cancellation 应附着在被拥有的工作上，并沿 Completion 传播，而不是只成为界面层的取消提示。第三，Pending Work、Identifier 与 Payload 都需要明确 Limit，并让拒绝行为可观测。第四，并发模型应按 Ownership Domain 划分，而不是把所有 Callback 折叠到一把锁后面。

这样既保留独立工作推进，又能让清理与审计知道“谁对这项工作负责”。

## 仍然需要独立治理的运行问题

Scoped Ownership 不能解决所有可靠性问题。当两个 Callback 修改同一个外部资源时，局部 Ownership 并不能提供应用级冲突控制或幂等；Cancellation 也无法追溯撤销已经发生的任意外部副作用。Volatile Recent-ID Cache 同样不能被解释为跨进程重启的 Durable Deduplication。

如果系统要求重启后继续对账，一种后续设计假设是在异步交接边界增加持久工作实例身份与终态证据，把 Ownership Model 延伸到进程生命周期之外。但当前来源没有实现或验证这项能力。

## 证据边界

现有证据只覆盖所选 gRPC Code-mode 路径及其测试。独立 Session 的并发测试不能证明所有共享竞争已经消失；证据也没有建立跨重启 Durable Callback Identity、外部副作用回滚或 Exactly-once Completion。

因此，这个模式应被理解成有边界的工程结果：在被测试路径中，Scoped Ownership、Revocation 与 Resource Bound 能够在不依赖全局串行化的前提下保留独立 Session 并发。

## 下一道边界仍有哪些问题

持久 Runtime 仍需要回答：Callback Completion 因网络或进程故障丢失时，什么实例身份能够跨重启存续？接近 Pending Work 上限时如何治理公平性和优先级？哪些失败应进入 Parent-turn 的终态证据？Completion 存在歧义时需要什么外部副作用幂等契约？

因此，真正值得保留的结论并不是“Callback 应该始终并发”，而是：**让 Ownership 显式、可撤销、有边界；让无关 Ownership Domain 保持并发；把重启对账和外部副作用安全作为独立契约治理，而不是把它们隐藏在 Callback 机制里。**
