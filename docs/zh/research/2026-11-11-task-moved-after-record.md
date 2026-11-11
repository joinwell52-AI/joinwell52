---
schema: "publication-candidate-article/v2"
title: "任务没搬走，账本为什么已经写着‘进入审查’？"
date: "2026-11-11"
published_date: "2026-11-11"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "任务状态记录、文件实际位置和调用回执，哪一个能证明一次提交已完成？"
summary: "一次受控提交报错后，任务仍在执行目录，文件头却已标记为待审。我们对照重试与丢失回执，研究多 Agent 系统如何证明状态转换真正完成。"
cover: "/assets/task-transition-20261111/task-threshold.cover-v1.png"
language: "zh-CN"
lifecycle: "Published"
publication_authorized: true
evidence_status: "固定 CodeFlowMu-open 提交的隔离故障注入与三条件对照；生命周期定向测试 28/28；无真实进程崩溃或线上事故验证"
pageClass: "six-governance-article"
---

<ArticleCover image="/assets/task-transition-20261111/task-threshold.cover-v1.png" kicker="工程研究 · 任务恢复" title="任务没搬走，账本为什么已经写着‘进入审查’？" summary="一次受控提交报错后，任务仍在执行目录，文件头却已标记为待审。我们对照重试与丢失回执，研究多 Agent 系统如何证明状态转换真正完成。" version="2026-11-11" languageHref="/en/research/2026-11-11-task-moved-after-record" languageLabel="English" />

<ArticleTableScroll language="zh" />

<style>.six-governance-article .vp-doc h1[id] { display: none; }</style>

# 任务没搬走，账本为什么已经写着“进入审查”？

你让 AI 同事提交工作，页面却报了错。你去查看任务文件：它还在“执行中”的目录。照直觉，这次提交似乎没发生。可打开文件，里面已经记着“进入审查”，还有提交人、报告编号和转换时间。**到底该信报错、文件位置，还是这条记录？**

我们在开发的 CodeFlowMu 是一个本地多 Agent 协作系统；FCoP 用文件保存任务、报告和生命周期。一个员工交报告以后，任务要从执行阶段进入审查阶段。这看似是一次操作，底层却要写记录、更新文件头、移动文件，最后再把结果交还给调用者。任何一步中断，几份证据就可能停在不同位置。

这个问题来自 [11 月 11 日的研究动态](https://joinwell52-ai.github.io/joinwell52/zh/runtime/daily-intelligence/2026-11-11)。[Paperclip 的一项合并改动](https://github.com/paperclipai/paperclip/pull/20674)处理另一种“做了事却没收到结果”：它在特定的文档写入操作中，把新版本和幂等回执放进同一数据库事务。服务重启后，有回执可重放结果；没有回执，才能在该事务保证下判断原写入未提交。我们感兴趣的不是照搬数据库设计，而是问：**自己的文件式任务转换，恢复时靠什么作同样清楚的判断？**

## 让提交停在门槛上

我们在 [CodeFlowMu-open 的固定提交](https://github.com/joinwell52-AI/CodeFlowMu-open/tree/ed5634c718b9e238c44bb70851020c9793546fe6)上运行真实的 `LifecycleKernel.submitReview`，任务和故障都放在隔离的临时目录。我们用一个普通文件占住目标“审查”目录，使程序在写完转换记录后、创建目标目录时报错。这是人为注入的**写后搬移前失败**，不是线上故障复现。随后解除阻塞、原样重试；最后再模拟“上次其实成功了，但调用方没收到成功回执”，继续重发相同请求。[实验步骤与完整观察](https://github.com/joinwell52-AI/joinwell52/blob/main/research/manual-runs/2026-11-11-lifecycle-atomicity/00-report.md)在公开证据页。

| 观察点 | 调用者收到 | 任务实际所在目录 | 文件头写着 | 转换记录 |
| --- | --- | --- | --- | ---: |
| 第一次，目标目录受阻 | `EEXIST` 错误 | 执行中 | 审查中、等待验收 | 1 条 |
| 解除阻塞，重试同一请求 | 成功 | 审查中 | 审查中、等待验收 | 仍 1 条 |
| 成功回执假定丢失，再重试 | “预期执行中，实际审查中” | 审查中 | 审查中、等待验收 | 仍 1 条 |

<figure>
  <img src="/assets/task-transition-20261111/three-signals.zh.svg" alt="受控故障下，转换记录已写为审查中，而任务文件仍在执行目录；恢复重试后两者才对齐" />
  <figcaption>受控实验示意：三处观察点分别是转换记录、实际目录和调用回执。琥珀色间隙是人为注入的目标路径阻塞，不代表线上事故。</figcaption>
</figure>

第一行最容易误读。调用失败是真的；“完全没提交过”却不成立：程序已经写下一条转换意图，并把文件头标成审查中。第二行表明本次受测路径的重试会完成搬移，且转换记录没有重复追加。这是有价值的恢复行为。第三行又给出相反提醒：如果提交已完成、只是成功响应丢了，直接重发会收到阶段不符的错误。错误不是“前一次没做”的证明。

## 记录先走，工件后走

受测源码的顺序解释了这个反常结果：先由 `TransitionRecorder.append` 把目标阶段和转换事件写进任务文件；再写“等待审查”等字段；最后 `moveTask` 才把文件移入目标目录。[现有生命周期测试](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/lifecycle/__tests__/LifecycleStateMachine.test.ts)在本机 **28/28 通过**，覆盖正常转换及多项权限和重复调用场景。它们没有否定故障注入观察，因为输入条件不同。

CodeFlowMu 对这类调用有项目写租约，可避免同一项目的并发写入互相踩踏。但租约并不把“写文件头、搬文件、返回成功”合成一个不可分的事务。FCoP 的文件位置与转换历史各有用途：位置告诉你现在在哪里，历史告诉你曾记录过什么。两者暂时不一致时，应该先标出待核对，而不是随手挑一个写成完成。

Paperclip 的外部对照恰好照亮边界：它的事务回执对**受保护的 `write_document`**有强保证，不能推成任意工具都只执行一次；我们的文件转换也不能因“有一条转换记录”就获得同等保证。两种系统使用不同存储方式，但都需要回答同一个人的问题：**上一次请求到底做到了哪一步？**

## 下一次恢复，凭什么认定是“同一次”？

本轮确认的是一个有界的中间态与两种重试结果；没有运行真实进程崩溃、完整模型或线上部署，也没有证据称用户已经遇到该问题。它引出的工程判断更具体：恢复时应同时核对**请求身份、任务实际位置、转换记录和可重放结果**。如果只看到任务已在审查阶段，还不能自动说“正是这次提交把它搬过去了”；也可能是另一个有效请求先做了这件事。

下一步要实验的是：为同一任务、报告和执行尝试建立可查询的操作回执后，能否让“写后搬移前”继续完成，让“完成后丢回执”读回原结果，同时拒绝把另一位执行者的转换冒领为自己的成功？这需要独立的恢复和并发测试，不能由今天的单机故障注入直接证明。

如果你构建 Agent 团队，可以检查：提交报错时系统展示的是“未提交”，还是“结果待核对”？如果你是使用者，当文件和页面状态打架时，你希望先看到确定的任务位置，还是一条明确说明“正在核对上次提交”的提示？
