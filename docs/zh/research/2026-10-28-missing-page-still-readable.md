---
schema: "publication-candidate-article/v2"
title: "聊天记录缺了一页，AI 恢复工作后会知道吗？"
date: "2026-10-28"
published_date: "2026-10-28"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "聊天记录缺了一页，AI 恢复工作后会知道吗？"
summary: "一次恢复测试：删除中间事件后，剩下的记录还能读，但原始序号必须留下空洞。可继续工作，不等于历史完整。"
cover: "/assets/execution-boundaries-20261028/missing-page-still-readable.cover-v1.png"
language: "zh-CN"
lifecycle: "Published"
publication_authorized: true
evidence_status: "固定源码；上游缺页回归测试在本机的修复前后对照"
pageClass: "six-governance-article"
---

<ArticleCover image="/assets/execution-boundaries-20261028/missing-page-still-readable.cover-v1.png" kicker="开源工程观察 · 对照实验" title="聊天记录缺了一页，AI 恢复工作后会知道吗？" summary="一次恢复测试：删除中间事件后，剩下的记录还能读，但原始序号必须留下空洞。可继续工作，不等于历史完整。" version="2026-10-28" languageHref="/en/research/2026-10-28-missing-page-still-readable" languageLabel="English" />

<ArticleTableScroll language="zh" />

<style>.six-governance-article .vp-doc h1[id] { display: none; }</style>

# 聊天记录缺了一页，AI 恢复工作后会知道吗？

一本工作日志有四页。第二页丢了。你当然希望系统还能翻到第三、第四页，继续找到已经完成的工作；但你也希望它明白，中间有一页不见了。

长期运行的 AI 助手也是如此。它依赖事件记录恢复上下文。如果读取程序遇到缺页就停，后面的有效记录会一起消失；如果悄悄把幸存页重新排成整齐的 1、2、3 页，使用者又可能误以为历史从未断过。

## 为什么会研究这一条

10 月 28 日的[工程动态](https://joinwell52-ai.github.io/joinwell52/zh/runtime/daily-intelligence/2026-10-28)里，[OpenHands SDK 的 PR #6197](https://github.com/OpenHands/software-agent-sdk/pull/6197)修复事件文件丢失后的加载行为。我们关心的不是“能不能打开日志”这个单一指标，而是两个条件能否同时成立：**恢复后继续读到幸存事件；缺失事实仍能被辨认。**

这个问题可以直接构造：写四条事件，删掉中间一个文件，再重新载入。于是我们使用上游仓库的 `InMemoryFileStore` 测试，把同一组回归用例放到修复前后运行。它模拟文件丢失，不是人为改写真实用户对话。

## 缺了第 2 页之后，余下的页去哪了

我们固定修复前源码 [`acd96e6f`](https://github.com/OpenHands/software-agent-sdk/tree/acd96e6fa424c02432304395b9208f99be24b54d) 和合并版 [`ded5fa5e`](https://github.com/OpenHands/software-agent-sdk/tree/ded5fa5e76ff9b7b4ff622a8df2ed20335e10652)。测试涵盖中间文件丢失、首项丢失、原始序号是否被复用、缺失父事件时的路径，以及警告是否重复刷屏，总计五个参数化用例。

| 对照 | 五个用例 | 我们实际看到的差别 |
| --- | --- | --- |
| 修复前 | **5/5 未通过** | 中间文件缺失时，后续幸存事件没有进入索引；沿父链查找也会失败。 |
| 合并版 | **5/5 通过** | 幸存事件继续可读，原始位置的空洞被保留并报告，新增事件不占用旧序号。 |

最容易看懂的是四条事件的序号。原来是 `0、1、2、3`；删除序号 `1` 后，屏幕上可读的三条可以按 `0、1、2` 依次展示，但它们在磁盘上的原始序号仍是 `0、2、3`。下一条新事件拿到 `4`，而不是填回 `1`。这样，“方便展示的第几条”与“原来发生在什么位置”不会互相冒充。

![四条事件丢失一条后，幸存记录继续可读，原始序号仍有缺口](/assets/execution-boundaries-20261028/missing-page-still-readable.figure.zh.svg)

*图：测试中的序号变化。展示索引变密，磁盘序号保留缺口；图示不代表丢失内容被找回。*

在另一组测试里，如果一条事件指向已经丢失的父事件，新版会有界地把幸存记录接回可见的早先事件，并给出警告；相同缺口不会每次遍历都重复告警。它让恢复流程可用，同时提醒读者：**接回的是路径，不是遗失的事实。**

## “能继续”是一种能力，“完整”是一种证据

本轮对照支持的判断很有限，也正因如此有用：在这些模拟缺页场景中，修复版让可读性和缺口标识一起保留下来。它没有证明损坏的文件被恢复，也没有证明真实磁盘、并发写入或所有部署版本都有同样行为。PR 已合并，我们没有核验具体正式发行版。

这也给长期 Agent 一个更难的问题：当历史缺了一页，上层负责验收的 Agent 会不会收到“这条证据链不完整”的信息？如果它只看到一条可以继续阅读的链，可能把恢复能力误当成事实完整性。本轮测试没有验证这个上层传播；它是从实验结果自然引出的下一步。

普通读者也可以给出有价值的反馈：你更希望助手在日志损坏时直接停下，还是先显示可恢复的部分，同时明确标出缺失位置？这个选择会因任务重要性而变，但缺失事实应始终可见。

固定版本、命令和边界见[公开实验报告](https://github.com/joinwell52-AI/joinwell52/blob/main/research/manual-runs/2026-10-28-execution-boundaries/00-report.md)。这是**上游缺页回归测试在本机的前后源码对照**，不是线上数据丢失事件。[研究仓库](https://github.com/joinwell52-AI/joinwell52)
