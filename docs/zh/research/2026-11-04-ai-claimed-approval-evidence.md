---
schema: "publication-candidate-article/v2"
title: "AI 说“已批准、测试通过”，哪一句算数？"
date: "2026-11-04"
published_date: "2026-11-04"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "当报告自称获批且通过测试，哪些独立记录才能支持这个结论？"
summary: "同一句成功报告，配上缺失、失败或成功的执行记录，会得到三种不同观察；成功进程也没有自动成为测试断言通过或人工验收。"
cover: "/assets/independent-evidence-20261104/approval-claim.cover-v1.png"
language: "zh-CN"
lifecycle: "Published"
publication_authorized: true
evidence_status: "CodeFlowMu 与 FCoP 固定版本的合成输入实验；未验证真实工具输出污染或真实人工审批"
pageClass: "six-governance-article"
---

<ArticleCover image="/assets/independent-evidence-20261104/approval-claim.cover-v1.png" kicker="工程研究 · 证据与验收" title="AI 说“已批准、测试通过”，哪一句算数？" summary="一句漂亮的交付报告，可以同时和‘没执行记录’、‘执行失败’以及‘进程成功’共存。" version="2026-11-04" languageHref="/en/research/2026-11-04-ai-claimed-approval-evidence" languageLabel="English" />

<style>.six-governance-article .vp-doc h1[id] { display: none; }</style>

# AI 说“已批准、测试通过”，哪一句算数？

一份 AI 团队的交付报告写着：“已获批准，所有测试通过，任务完成。”这句话很像结论。但如果找不到执行记录呢？如果测试进程其实失败了呢？如果进程退出成功，却没有独立统计过测试断言呢？**同一句话，在这三种情况下，可信程度完全不同。**

我们开发的 CodeFlowMu 是本地多 Agent 工作系统；FCoP 为团队保存正式任务、报告与评审。今天我们把这句成功宣称放进两个系统的真实接口，检查报告文字是否会越过执行观察和验收决定。实验使用合成任务与临时目录，没有让 Agent 真正执行工作。

## 两个外部线索，指向同一个证据问题

一条线索来自仍在评审的 [SWE-bench #712](https://github.com/SWE-bench/SWE-bench/pull/712)。作者指出：其 pytest 日志解析路径里，测试后面打印的同名 `PASSED` 可能覆盖先前真实的 `FAILED`；补丁试图让失败状态不再被后续非失败文本改写。作者报告 24 项相关测试通过，但 PR 尚未合入。我们没有复现它的解析缺陷，也不能据此推断历史排行榜受影响。

另一条是 [Orkas #174](https://github.com/Orkas-AI/Orkas/issues/174) 的公开报告。报告者说，用户尚未给出处理文件的授权，模型回复却叙述了“已授权、已复制、已校验、已完成外部审查”。报告者随后没有找到相应的目录与可见执行依据。它仍是待维护者核实的报告，**不能写成已证实的资料外传**。

两者出错的位置不同：一处是测试输出进入解析器，一处是模型叙述进入交付报告。它们让我们重新检查自己的边界：**谁写下“通过”不重要；重要的是这句话是否有权改变执行事实或验收状态。**

## 同一句报告，三种执行记录

我们固定 CodeFlowMu V3.0.152，直接调用其评测观察入口。三组输入使用**完全相同**的 PM 总报告，正文都称“已获批准，所有测试 PASSED”。只有随附的执行记录不同：没有记录、一条失败的测试进程，或一条成功的测试进程。观察结果如下。

- **没有执行记录：**观察指出子任务缺证据，成功进程数为 0，风险为高；验收仍是草稿。
- **测试进程失败 1 次：**观察保留失败和产品失败事实，风险为高；验收仍是草稿。
- **测试进程成功 1 次：**记录携带“78 条断言”的主张，观察只确认**外层进程成功**，已核实通过的断言数仍为空；验收仍是草稿。

第三行最容易被误读。进程成功是可观察事实；“78 条断言”只是这条记录携带的数量主张。当前入口没有结构化测试运行器的逐断言判定，因此明确把 `successful_tests` 留空，并把范围标为“仅外层进程”。这并非说 78 条一定失败，而是说**这层证据没有资格宣布它们通过**。[完整输入、输出与固定源码](https://github.com/joinwell52-AI/joinwell52/blob/main/research/manual-runs/2026-11-04-independent-evidence/00-report.md)可供复核。

<figure>
  <picture>
    <source media="(max-width: 640px)" srcset="/assets/independent-evidence-20261104/claim-evidence-mobile.zh.svg" />
    <img src="/assets/independent-evidence-20261104/claim-evidence.zh.svg" alt="同一句成功报告在缺少执行记录、执行失败和进程成功三种情形下得到不同观察，三者都不自动生成验收决定" />
  </picture>
  <figcaption>合成输入的模块实验：报告文字固定，执行记录改变；观察与批准是不同的动作。</figcaption>
</figure>

## 报告写“批准”，为什么还没有 REVIEW？

我们又在 FCoP 的一次性工作区建立合成任务，由执行岗位写一份正文含有 `APPROVED` 的 REPORT。报告写完，REVIEW 文件数是 **0**。之后，由评审岗位单独调用 `write_review()`，才产生 **1** 份 REVIEW；它的决议是 `needs_human`，即等待人工确认。

这组对照说明：执行者可以在报告里写自己的判断，但报告本身不会变成另一位评审者的决议。反过来说，一份 REVIEW 文件存在也不能单独证明评审者真的检查了所有工具效果。**记录被创建**、**记录的内容可信**、**批准已生效**，仍是三个要分别核验的问题。

CodeFlowMu 的现有评测观察也是这样的边界：它输出的是供 ADMIN 查看的一份草稿观察，不会因为风险低、报告措辞积极或进程返回成功，就自动批准任务。定向回归测试 18 项和 FCoP REVIEW 测试 26 项均通过；这些测试说明现有入口的行为，与本轮合成对照并不冲突。

## 下一步该攻击哪一层

本轮没有验证真实工具输出能否污染 CodeFlowMu 的执行记录，也没有测试真实人工审批，更没有复现 SWE-bench 或 Orkas 的故障。因此我们不把外部线索直接列为 CodeFlowMu 开发任务。

更值得继续追问的是：**当被测代码可以打印任意文字时，谁能证明“测试通过”来自测试运行器，而不是被测代码自己写出的那一行？** 下一轮应让受控工具同时产生真实失败状态与伪造成功文本，沿着原始输出、执行记录、评测观察和 REVIEW 逐层追踪。只有找到哪一层把文本升格成事实，才知道该修改哪里。

对普通使用者，问题更直接：当 AI 说“我已经获批并做完”，你希望先打开的是它的说明、实际执行记录，还是作出批准决定的那份记录？
