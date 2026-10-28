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
evidence_status: "固定源码；上游缺页回归前后对照与独立本地文件探针"
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

这个问题可以直接构造：写四条事件，删掉中间一个文件，再重新载入。我们先把上游内存存储的回归用例放到修复前后运行，随后自行用真实本地文件再做一次，检查两个读取接口是否给人相同的历史印象。它们都不涉及真实用户对话。

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

## 我们再删一次真实文件

为了不只复述上游内存测试，我们使用合并版的原 `EventLog` 和本地文件存储，在临时目录写入四个 JSON 事件文件，再删掉序号 1，并以新的存储实例载入。结果与上游模拟一致：三条幸存事件都可读。**普通遍历看到的是连续位置 `0、1、2`；单独读取持久序号才会看到 `0、2、3`。** 加载器还写出一条缺损警告。[脚本、事件 ID 和两种序号](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-10-28-execution-boundaries)可供复核。

这个差别是文章真正的焦点。对负责恢复工作的读者来说，“还能读”是一个接口的回答；“是否完整”要看另一个接口或缺损告警。我们没有证明上层 Agent 一定忽略了它；目前只确认，如果消费者只拿普通列表，就不会在列表位置里看到缺口。

## “能继续”是一种能力，“完整”是一种证据

本轮对照支持的判断很有限，也正因如此有用：修复版在上游模拟缺页和我们的本机文件删除中，都让幸存事件继续可读，并在持久序号和日志中保留缺口。它没有证明损坏文件被恢复，也没有测试并发写入、生产磁盘故障或所有部署版本。PR 已合并，我们没有核验具体正式发行版。

这也给长期 Agent 一个更难的问题：当历史缺了一页，上层负责验收的 Agent 会不会收到“这条证据链不完整”的信息？如果它只看到普通列表，可能把恢复能力误当成事实完整性。本轮测试没有验证这个上层传播；它是从两种读取面的差别引出的下一步。

普通读者也可以给出有价值的反馈：你更希望助手在日志损坏时直接停下，还是先显示可恢复的部分，同时明确标出缺失位置？这个选择会因任务重要性而变，但缺失事实应始终可见。

固定版本、命令、独立磁盘探针和边界见[公开实验报告](https://github.com/joinwell52-AI/joinwell52/blob/main/research/manual-runs/2026-10-28-execution-boundaries/00-report.md)。这是上游回归前后对照与本机文件删除实验，不是线上数据丢失事件。[研究仓库](https://github.com/joinwell52-AI/joinwell52)
