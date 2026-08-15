---
schema: publication-candidate-article/v2
title: "多 Agent 委派需要返回合同，而不只是传输结束"
date: '2026-08-15'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "多 Agent 架构必须显式定义哪些要素，才能让远程委派任务暂停、恢复、完成并归还控制权，同时避免把 Transport Termination 误认成工作成功？"
summary: "可靠委派至少需要两个一等合同：标识精确委派实例的稳定身份，以及定义什么才算成功完成的语义返回合同。近期一个 ADK Task Mode 实现展示了同一 Scope 如何贯穿暂停、恢复与终态匹配，但互操作、授权和外部副作用恢复仍是独立问题。"
cover: staging/publication-candidates/2026-08-15-delegated-agent-return-contract-cover.png
sources:
  - research/analysis/Q-20260815-02-delegation-lifecycle-semantic-return-contract.md
  - research/reading/Q-20260815-02-native-a2a-task-delegation-finish-terminal-boundary.md
---

# 多 Agent 委派需要返回合同，而不只是传输结束

从消息层看，多 Agent 委派很简单：一个 Agent 把工作交给另一个 Agent，等待，然后收到返回结果。真正困难的部分出现在远程任务可以暂停、恢复、失败、取消，或者运行时间足够长，以至于 Parent 必须重新判断“现在到底哪一个任务还活着”。

这时，“连接结束了”不能成为充分的完成规则。Stream 关闭可能表示成功，也可能表示失败、取消、超时，甚至只是通信中断。可靠委派因此至少需要两个不同合同：**这是哪一个精确的 Delegated Occurrence？**以及**什么样的结果才足以把它作为成功任务关闭？**

2026-08-15 的研究对象分析了 Google ADK Task Mode 的实现、文档与测试。这里的证据属于维护者提供的有界一手证据，并不是多 Agent 架构的独立 Benchmark。在这个边界内，它展示了一个相对一致的本地设计：让同一个委派身份贯穿生命周期恢复，再用显式语义完成证据决定是否以成功状态归还控制权。

## 同一个身份应贯穿完整委派生命周期

在所选机制中，Coordinator 的 FunctionCall Identity 成为 Delegated Task 的 Isolation Scope。同一个 Scope 被用于重建委派历史、识别暂停中的 Active Task、过滤 Sibling Activity，并查找匹配的 Terminal Output。

这种复用很重要。如果 Delegation Start、Pause、Resume、Terminal Result 和 Parent Correlation 每个阶段都发明一个新 ID，恢复时就必须额外证明这些 ID 是否仍然代表同一个业务任务。稳定的 Occurrence Identity 则给出了统一答案：系统始终知道“我们现在讨论的是哪一个委派实例”。

对持久化 Agent 架构而言，可以把它概括为一个通用原则：启动委派工作时产生的 Occurrence Identity 应跨 Pause/Resume 存续，并继续绑定在终态证据上。Transport Session 可以重建，但业务任务不应因为重新连线就悄悄换了身份。

## 语义完成比 End-of-stream 更强

第二个合同解决的是关闭语义。所选 ADK 机制使用显式 `finish_task` FunctionResponse，其输出必须满足声明的 Output Schema。Validation Error 仍保持非终态，而远程 FAILED、CANCELED 和 Transport Failure 会先映射成失败终态，再把控制权交回 Parent。

这就把两个经常混淆的问题拆开了。Transport Status 只告诉 Parent 通信通道是否还在继续；Semantic Finish Evidence 则告诉 Parent，这项委派工作是否产生了合同认可的完成结果。

Stream 可以停止，却没有任何有效结果；一个有效终态结果也可以已经形成，而后面又出现与业务完成无关的 Transport Noise。把两者分开，Recovery 才能更可靠地解释历史。

不过 Output Schema 也有明确边界。它只能确认结果的结构符合预期，不能证明结果事实正确、没有过期、已经授权或不存在副作用。Schema 是 Return Contract，不是 Truth Oracle。

## Recovery 应根据关闭证据推理，而不是只看最新事件

所选 Runner 使用 Two-pass Recovery。第一遍先找出已经被 Terminal Finish Evidence 关闭的 Scope，第二遍再从历史中向后寻找最新仍未解决的 Scope。这个顺序比“只找最新 Event”稳健。

长期历史在任务完成后仍可能继续产生其他事件。如果 Recovery 仅凭 Event Recency 判断 Active Task，就可能把已经结束的任务错误重新打开。明确的终态证据则提供一种不受后续噪声影响的 Lifecycle Fact。

更通用的恢复原则是：先问“哪些 Scope 已经拥有权威 Closure Evidence”，再问“哪些最近的 Scope 仍像是 Active”。时间新旧可以帮助定位，但不能覆盖已经存在的确定性终态事实。

## 委派需要生命周期合同与返回语义同时存在

更完整的 Delegated Work 链条可以表示为：

**委派实例身份 → Scoped Lifecycle → Semantic Terminal Evidence → 控制权归还**。

Occurrence Identity 防止不同任务被混在一起；Scoped Lifecycle 让 Pause/Resume 不会丢失任务身份；Semantic Terminal Evidence 区分业务成功与 Transport Termination；Parent 只有在终态类别已明确后，才决定下一步。

这在 Parent 会根据 Success、Failure 或 Cancellation 采取不同策略时尤其重要。如果三种状态最后都被压缩成“Remote Call Ended”，Parent 就失去了做受治理下一步决策所需要的信息。

## 跨框架委派还需要额外兼容合同

所选机制依然是 ADK 特定实现。Custom Remote Server 必须实现兼容的 Finish Semantics；Output Schema 不会自动协商；Isolation Scope 也不是密码学信任边界；Failure Mapping 更不会自动补偿已经发生的外部 Side Effect。

当委派跨越框架甚至跨越组织边界时，这些限制会变得关键。两个系统至少需要明确协商四类内容：Occurrence Identity、Finish Semantics、Output Schema 和 Authorization。

如果这些合同不存在，双方完全可能各自在内部都“正确”，却对同一个任务到底是 Active、Completed、Failed，甚至究竟由谁授权，得出不同结论。

## 架构含义

多 Agent 系统中的 Delegated Task 应拥有能够跨恢复存续的稳定 Occurrence Identity；Protocol Transport Status 与 Business/Task Semantic Status 应分别表示；Terminal Evidence 应显式关闭 Scope；Failure 与 Cancellation 应能够归还控制权，但不能被重写成 Success；已经产生的外部副作用，则应由独立的 Compensation 或 Reconciliation 机制负责。

对于短时、无状态 Remote Call，这套机制可能过重，普通 Request/Response 语义已经足够。架构复杂度应该匹配委派任务的生命周期复杂度与风险。

## 证据边界

本文证据来自一个 ADK Task Mode 实现及其文档和测试，并没有建立 Cryptographic Delegation Identity、Cross-framework Semantic Agreement、Durable Remote-state Consistency、Deadline/Lease Policy 或 Exactly-once Delivery。

Schema-valid 的 `finish_task` Output 只是本地合同内的 Semantic Terminal Evidence，并不是对底层业务结果事实正确、已经授权或没有外部副作用的独立证明。

## 仍待回答的问题

Delegation Occurrence Identity 应怎样在异构 A2A 实现之间传递并认证？Semantic Finish Contract 与 Output Schema 能否通过 Agent Metadata 自动协商，而不是人工镜像？如果 Remote Task 已经产生外部 Effect，但 Parent 永远没有收到最终响应，又需要哪些 Durable Evidence 才能安全恢复？

委派并不是在“消息停了”时结束，而是在系统能够确认精确委派实例、解释其终态含义，并带着足以支持下一步决策的证据归还控制权时才真正结束。
