---
schema: "publication-candidate-article/v2"
title: "点了批准，程序执行的还是你看到的那些参数吗？"
date: "2026-09-18"
published_date: "2026-09-18"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "条件审批看到的参数，是否就是函数最终执行的参数？"
summary: "一次工具调用在真正执行前，可能被自动补值或转换类型。我们用两个版本验证：批准时看到的内容，会不会与最终动作不同？"
cover: "/assets/context-authority-20260918/approval-arguments.cover-v1.png"
language: "zh-CN"
lifecycle: "Published"
publication_authorized: true
evidence_status: "固定版本原程序对照；范围见正文"
pageClass: "context-authority-article"
---

<ArticleCover image="/assets/context-authority-20260918/approval-arguments.cover-v1.png" kicker="开源工程观察 · 版本对照实验" title="点了批准，程序执行的还是你看到的那些参数吗？" summary="你批准的是一张空白申请单，程序却可能按默认规则补完后再执行。" version="2026-09-18" languageHref="/en/research/2026-09-18-approval-saw-raw-tool-ran-prepared" languageLabel="English" />

<ArticleTableScroll language="zh" />

<style>.context-authority-article .vp-doc h1[id] { display: none; }</style>

# 点了批准，程序执行的还是你看到的那些参数吗？

想象一张待批准的申请单：“目标环境”一栏是空白。检查程序没有看到受保护环境，于是放行。真正执行时，系统却按默认规则把空白补成了“受保护环境”。

在程序里，这张空白申请单是 `{}`，补完后的参数是 `environment="protected"`。这不是 Agent 偷换了参数，而是常见的数据处理在起作用：系统会补默认值，会把字符串 `"1"` 转成整数 `1`，也可能按应用规则把 `PROD` 规范成 `prod`。

下文把模型最初送来的内容叫“原始参数”，把补默认值、类型转换和自定义校验后的内容叫“执行参数”。工程里常说的 validator，就是负责校验或转换输入的规则。

于是，一个容易被忽略的问题出现了：**审批程序批准的对象，与函数最终执行的对象，是不是同一个？**

## 为什么我们会追这个问题

OpenAI Agents Python 在 2026 年 9 月 17 日合并了 [PR #5066](https://github.com/openai/openai-agents-python/pull/5066)，随后发布 v0.22.3。维护者 Kazuhiro Sera 说明，自动审批检查器过去可能看到一份参数，Python 函数却使用另一份；新版本会先准备参数，并在校验改变参数时要求人工审批。

这个改动引起我们的兴趣，因为它把一个抽象的治理问题变成了可以复验的执行路径：原始 JSON 进入工具以后，先被谁解释，审批发生在解释之前还是之后，最终副作用又使用哪一份值？

我们没有只复述修复说明，而是把 v0.22.2 和 v0.22.3 放进同一组实验。

## 六个用例，逐一改变参数处理方式

实验固定了两个源码版本：v0.22.2 的提交 `83c737f`，以及 v0.22.3 的提交 `fdf21db`。六个用例都走原项目从 Agent 生成调用、审批到函数执行的完整路径，不用我们自己仿造一套审批流程。

我们没有调用在线模型，也没有写入外部系统。脚本只记录审批回调看到什么、是否出现人工审批中断，以及函数体最终收到什么。

| 用例 | 原始参数 | 执行参数 |
| --- | --- | --- |
| 原样安全环境 | `{"environment":"safe"}` | 不变 |
| 原样受保护环境 | `{"environment":"protected"}` | 不变 |
| 缺省默认环境 | `{}` | `{"environment":"protected"}` |
| 显式整数 | `{"count":1}` | 不变 |
| 字符串转整数 | `{"count":"1"}` | `{"count":1}` |
| 应用自定义转换 | `{"request":{"target":"PROD"}}` | `{"request":{"target":"prod"}}` |

## 旧版本里，批准与执行确实可能错位

在 v0.22.2 中，没有发生转换时，一切符合直觉：安全环境直接执行，受保护环境触发人工审批。

真正的差别出现在验证改变参数时：

- 空对象进入条件回调时仍是 `{}`，回调放行；函数收到默认补出的 `protected` 并执行。
- 回调看到字符串 `"1"`，函数收到整数 `1`。
- 回调看到 `PROD`，函数收到 validator 转换后的 `prod`。

这里的“条件回调”，可以理解为一个自动审批检查器。问题在于，它没有看到函数最终使用的完整对象。

![v0.22.2 与 v0.22.3 对验证后参数的不同处理](/assets/context-authority-20260918/approval-arguments.figure.zh.svg)

*图 1：v0.22.2 的条件回调读取原始参数，函数消费验证后参数；v0.22.3 遇到值变化时转入人工审批。图中是本轮六用例的概括，不代表所有 schema 行为。*

## 新版本选择了一个保守边界

在 v0.22.3 中，原样参数仍沿用自动审批检查：安全环境继续执行，受保护环境继续中断。默认值、类型转换和自定义规则造成的三种变化，则都跳过自动放行，直接进入人工审批，函数没有执行。

这不是简单地把审批放到“转换之后”。如果直接把转换后的值送给原有自动规则，也可能改变应用过去依赖的策略含义。新版本采用了更保守的兼容方式：**只有能安全证明原始参数与执行参数一致，才继续走原来的自动规则；一旦发生变化，就把决定交还给人。**

我们还运行了 v0.22.3 新增的审批参数测试文件，108 条测试全部通过。

## 为什么只显示“允许调用工具”还不够

这组实验让“批准”变得更具体。一次可验证的批准，至少需要回答：

1. 人或自动规则看到的是原始参数，还是已经补完的执行参数？
2. 默认值、类型转换和自定义校验已经运行了吗？
3. 实际执行前，参数是否仍与获批对象一致？
4. 恢复会话后，继续执行的是否仍是同一个动作？

如果界面只显示工具名，例如“允许调用 deploy”，用户仍然不知道程序将部署到哪里，也不知道这个目标是模型填写的，还是系统后来补出的。更可靠的审批记录，应把最终动作变成一枚可重新计算的“指纹”；执行前再算一次，只要关键内容变了，旧批准就失效。

## CodeFlowMu 要不要因此改代码

我们检查了 CodeFlowMu v2.1.2 的本地实现。它的做法正是“批准时留指纹，执行前再比一次”：只要当前动作与获批动作不同，旧批准就会失效并拒绝执行。技术上，这个指纹还与项目、Agent、任务、会话和角色绑定，并配合一次性执行令牌。本轮 28 条审批边界定向测试全部通过。

因此，本轮结论是 **不进入开发**。这不代表永远不需要改，而是目前没有发现“审批对象与执行对象漂移”的本地证据。研究结果进入文章和后续审查清单，不应自动变成开发任务。

## 还没有被回答的问题

OpenAI Agents Python 的改动解决了一个明确版本中的参数错位，也留下了更值得专业读者讨论的问题：

- 审批界面应该只显示准备后的参数，还是同时显示原始值与转换差异？
- 如果 validator 依赖时间、外部状态或自定义代码，准备结果能否稳定重放？
- 人批准一次准备后的动作，恢复运行时应重新准备并比较，还是保存并执行当时的快照？
- 面对无法安全比较的对象，强制人工审批已经足够，还是还应禁止执行？

对普通使用者，判断可以更直接：**你点下“批准”以后，是否能说清程序最终会拿哪些值做什么？** 如果不能，审批仍然只是一个按钮，还不是执行证据。

## 实验资料

- [OpenAI Agents Python PR #5066](https://github.com/openai/openai-agents-python/pull/5066)
- [v0.22.3 Release](https://github.com/openai/openai-agents-python/releases/tag/v0.22.3)
- [本轮公开实验记录](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-18-context-authority)

