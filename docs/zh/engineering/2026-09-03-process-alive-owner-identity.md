---
title: "进程还活着，原来的执行者还在吗？"
date: "2026-09-03"
published_date: "2026-09-04"
column: open-source-engineering
category: daily
article_type: experiment-report
edition: research-center
research_question: "旧执行记录的 owner 身份是否与当前存活进程可靠对应？"
summary: "Codex 的 Windows 进程身份改动提醒我们：PID 存活不等于原执行者仍在。对 CodeFlowMu 两套记录的受控比较发现，写锁已经能识别时间矛盾，审批执行记录却仍可能保留 executing。"
cover: "/assets/covers/host-research-20260903-process-identity.png"
language: zh-CN
lifecycle: Published
publication_authorized: true
evidence_status: "Controlled durable-state reproduction on V2.2.6; no induced OS PID reuse or external execution"
---

<ArticleCover
  image="/assets/covers/host-research-20260903-process-identity.png"
  kicker="开源工程观察 · 受控实验"
  title="进程还活着，原来的执行者还在吗？"
  summary="Codex 的 Windows 进程身份改动提醒我们：PID 存活不等于原执行者仍在。对 CodeFlowMu 两套记录的受控比较发现，写锁已经能识别时间矛盾，审批执行记录却仍可能保留 executing。"
  version="2026-09-03"
  languageHref="/en/engineering/2026-09-03-process-alive-owner-identity"
  languageLabel="English"
/>

<ArticleTableScroll language="zh" />

# 进程还活着，原来的执行者还在吗？

一个 Agent 执行进程退出了。过了一段时间，操作系统把同一个进程号分给了另一个进程。

旧执行记录再次被读取时，系统查询这个号码：还活着。

如果恢复逻辑就此停止，记录可能继续显示“执行中”。它查到的不是过去那个执行者，而是现在恰好使用同一个号码的进程。

这是一种需要防范的情形，不是本文声称已经发生的线上事故。真正引起我们注意的，是 OpenAI Codex 对 Windows 受管进程身份的一项修订。沿着这项外部变化检查 CodeFlowMu 后，我们发现的问题也不是“完全没有进程身份保护”，而是：**保护已经存在于一个地方，却没有以同样的语义进入另一份执行记录。**

## 1. Codex 为什么不只保存一个 PID？

Codex 是 OpenAI 的编程 Agent；其 app-server 为客户端提供运行接口。当这类服务作为后台进程存在时，启动、停止和升级都必须知道自己正在操作谁。

在 [Windows 生命周期 PR #42381](https://github.com/openai/codex/pull/42381) 中，进程管理不仅保存 PID，还使用 Windows 进程句柄和创建时间核验身份；终止目标前再次检查，避免把后来复用同一号码的进程当成原目标。随后合入的 [升级交接 PR #42392](https://github.com/openai/codex/pull/42392) 又处理了 successor 启动就绪与 ownership 交接。这些是已合并的源码变化，不等于本文测试过其全部发布形态。

这里的关键不是 Windows 专属技巧，而是一个关系：PID 是定位号码，不是永久身份。长期运行的 Agent 系统一旦把号码写入磁盘，下一次读到它时就跨越了时间；号码相同，不足以证明责任连续。

但借鉴外部项目不等于照抄一套 daemon。我们先要回答：CodeFlowMu 是否已经解决过这个问题？

## 2. 本地已经有答案，但答案没有覆盖所有账本

CodeFlowMu 是我们开发的本地多 Agent 协作系统。我们把本次源码与实验固定在 V2.2.6、提交 `5c94d8c3b0147b779b17f620b811c6a17cc65288`。

它的 Runtime 写锁已经有进程身份保护。写锁用于防止不同实例同时占有同一写入范围；这里的 owner 就是持锁进程。

`runtime-process-identity.ts` 会在 Windows 查询真实进程创建时间，形成带时间精度的身份 token。`runtimeLockOwnerIsStale()` 不只问进程是否存活：有创建标识时比较标识；对于没有标识的旧锁，还会检查一个时间矛盾——如果当前进程是在锁创建之后才出生，就不可能是最初持锁者。权限不足或无法获得身份时，也不会直接推导“原 owner 已死”。

这个发现先否定了一个过大的选题：不能写“CodeFlowMu 只有 PID，完全没有进程身份”。

另一条路径是操作审批服务。它保存某个获准动作的执行记录，包括 `executing` 状态、执行进程号和开始时间。在读取记录时，它会尝试识别执行者中断。当前条件的核心是：

```typescript
record.status === "executing" &&
record.execution.executor_pid !== process.pid &&
!isProcessAlive(record.execution.executor_pid)
```

满足条件后，服务把记录转成 `partial_failed`，并要求检查目标结果。这条恢复逻辑没有像写锁那样比较进程创建身份；如果记录里的 PID 正好等于当前进程 PID，连这一轮死亡检查也不会进入。

两个组件职责不同，不能要求它们所有状态相同。但它们都在回答一个共同的前提：**这份旧记录，是否还能归属于目前查到的那个进程？**

## 3. 我们没有等待一次真实 PID 复用

为了验证这个差异，我们没有反复制造进程，等待操作系统重新分配到指定号码，也没有对真实业务操作做中断。

实验先通过实际 `OperationApprovalService.prepare()` 和 `approve()` 创建隔离审批记录，再受控设置其中的执行状态、PID 和开始时间。随后创建新的服务实例，用真实 `get()` 读取记录并触发恢复判断。执行器始终没有被调用。

比较侧使用真实操作系统的进程探针，再把相同的 PID 和受控时间交给现有写锁判断函数。这里构造的是**没有 process-start token 的旧格式锁记录**，让它走“当前进程出生晚于记录”的兼容检查；不是虚构一对不同 token，直接得到预设答案。

三种输入各在新隔离目录中重复两轮：

| 受控记录 | 审批服务读回的状态 | 写锁函数对相同 owner 时间条件的判断 |
|---|---|---|
| 当前进程号，当前开始时间 | executing | 非 stale |
| 经操作系统确认不存在的进程号 | partial_failed，要求检查结果 | stale |
| 旧开始时间，配现在活着的当前进程号 | **仍为 executing** | **stale** |

第三行是决定性的比较。夹具把开始时间设为 2000 年，真实进程创建于本轮实验。写锁函数能发现明显的时间矛盾；审批读取路径仍保留 `executing`。

[![图 1：同一受控 PID 与旧时间条件，在审批读取路径和旧格式写锁对照中得到不同判断](https://joinwell52-ai.github.io/joinwell52/assets/host-research-20260903/figure-02-process-identity-zh.png)](https://joinwell52-ai.github.io/joinwell52/assets/host-research-20260903/figure-02-process-identity-zh.png)

*图 1｜合成旧记录配合真实 OS 创建时间的比较。它不是线上 PID 复用事故；识别原 owner 已不匹配，也不能直接推出效果未发生或获准重试。[点击查看高清原图](https://joinwell52-ai.github.io/joinwell52/assets/host-research-20260903/figure-02-process-identity-zh.png)。*

这里的 2000 年是主动构造的测试值，不是历史日志。我们模拟的是“旧记录遇到现在同号进程”的可见状态，**没有诱发真实的操作系统 PID 复用事件**。重新创建服务对象也不是重启 Runtime 进程。两轮验证的是同一受控方法的重复性，而非跨进程重启可靠性。

还要限定比较的性质：我们把审批开始时间映射成了合成旧锁的持锁时间，用来检查相同时间矛盾；并没有证明线上存在一对时间完全一致的真实审批记录和真实写锁。

完整输入、真实 OS 元数据与输出保存在[随稿证据说明](/zh/research/evidence/2026-09-03-host-authority-conformance)所列的 E2 记录中。六次观察的外部执行器调用数均为零。

## 4. “没有认出中断”不等于“已经重复执行”

这个结果支持一个窄结论：当前审批执行记录的恢复判断，对进程代次的识别弱于既有写锁判断。在构造的旧记录情形中，它可以继续显示 `executing`，尽管已经有足以否定原 owner 身份的时间证据。

这可能影响使用者判断“是否还应等待这个执行者”。但本实验没有证明系统因此发起第二次动作，没有证明误杀了其他进程，也没有统计线上有多少记录长期停在这个状态。

第二行负对照同样不能删除。原进程号确实不存在时，现有服务能够识别中断，并明确要求检查动作结果。系统不是没有恢复处理；缺的是活 PID 与原进程身份之间的区分。

对应的现有回归中，进程身份四项、写锁九项、操作审批十五项均在两轮中通过。这说明已有保护并非纸面设计，也说明已有测试通过不能替未覆盖的交接条件作保证。它们是本轮 41 项相关回归的子集，不能再额外相加成另一组“系统可靠性”数据。

## 5. owner 失效以后，仍然不能直接宣布可以重试

最危险的修法，是发现旧执行者不在以后，立刻把动作交给另一个 Agent 再跑一次。

旧进程可能已经完成了外部动作，只是没写完最后的记录。进程身份只能帮助判断“谁还拥有这份执行责任”，不能证明远端提交、文件改动或消息发送是否发生。

需要分开的其实是四个问题：

- **存活性**：这个进程号当前有没有对应进程？
- **身份**：它是不是记录中的那个执行者？
- **效果事实**：原动作到底发生了没有？
- **当前权限**：现在是否仍允许执行相应动作？

前两个问题回答了，也没有自动回答后两个。

这同样适用于 CodeFlowMu 的 FCoP 文件协作：TASK 文件和生命周期位置可以保留任务身份与业务上下文，但不能仅凭文件还在，就把中断动作视为未发生。此前讨论的恢复准入合同与本轮进程识别研究可以衔接，却不能因为版本号更新，就把合同中的所有组件写成已交付能力。

值得评审的改进方向，是让需要长期保存的执行 owner 记录绑定可核验的进程代次，并区分匹配、不匹配和未知；能复用当前身份机制的地方应先复用，而不是另造一套含义稍有不同的 PID 检查。

对于旧记录，尤其不能把现在查到的创建时间直接回填成“原执行者身份”。那会把缺失证据伪造成已核验事实。缺少可靠元数据时应保留未知；识别出中断时，也应继续检查效果，而不是将身份失效转换成重执行许可。

这些仍是研究后的工程建议。本轮没有修改产品代码，没有进行真实副作用恢复，也不构成独立 QA 或开发授权。

Codex 的外部变化值得借鉴，恰恰因为它让我们问出了一个更具体的问题：同一种身份事实，是否已经在所有依赖它的记录中得到一致解释？

**进程号仍然有人使用，不代表过去那份责任仍然有人承担。**
