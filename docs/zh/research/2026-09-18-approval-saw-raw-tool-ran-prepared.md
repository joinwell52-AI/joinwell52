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
summary: "我们把 OpenAI Agents Python v0.22.2 与 v0.22.3 放进同一组实验：默认值、类型转换和 validator 会不会让审批对象与执行对象分离？"
cover: "/assets/context-authority-20260918/approval-arguments.cover-v1.png"
language: "zh-CN"
lifecycle: "Published"
publication_authorized: true
evidence_status: "固定版本原程序对照；范围见正文"
pageClass: "context-authority-article"
---

<ArticleCover image="/assets/context-authority-20260918/approval-arguments.cover-v1.png" kicker="开源工程观察 · 版本对照实验" title="点了批准，程序执行的还是你看到的那些参数吗？" summary="默认值、类型转换和 validator，可能在批准之后悄悄改变真正的动作。" version="2026-09-18" languageHref="/en/research/2026-09-18-approval-saw-raw-tool-ran-prepared" languageLabel="English" />

<ArticleTableScroll language="zh" />

<style>.context-authority-article .vp-doc h1[id] { display: none; }</style>

# 点了批准，程序执行的还是你看到的那些参数吗？

一位 Agent 准备调用工具。审批程序看到的是空对象 `{}`，判断没有危险，于是放行。

真正进入函数时，参数却已经变成了 `target="protected"`。

这不是 Agent 偷换了参数。变化发生在更普通的地方：参数模型自动补上了默认值。类似的变化还可能来自类型转换，例如字符串 `"1"` 变成整数 `1`；也可能来自应用 validator，把 `PROD` 规范成 `prod`。

于是，一个容易被忽略的问题出现了：**审批程序批准的对象，与函数最终执行的对象，是不是同一个？**

## 为什么我们会追这个问题

OpenAI Agents Python 在 2026 年 9 月 17 日合并了 [PR #5066](https://github.com/openai/openai-agents-python/pull/5066)，随后发布 v0.22.3。维护者 Kazuhiro Sera 说明，条件审批回调过去可能检查与 Python 函数实际使用不同的参数；新版本会先准备参数，并在验证改变参数时要求人工审批。

这个改动引起我们的兴趣，因为它把一个抽象的治理问题变成了可以复验的执行路径：原始 JSON 进入工具以后，先被谁解释，审批发生在解释之前还是之后，最终副作用又使用哪一份值？

我们没有只复述修复说明，而是把 v0.22.2 和 v0.22.3 放进同一组实验。

## 六个用例，只有一件事不同

实验使用两个固定源码版本：v0.22.2 的提交 `83c737f`，以及 v0.22.3 的提交 `fdf21db`。每次都通过原项目的 `Runner`、装饰器工具、`ScriptedModel` 和真实工具执行路径运行。

我们没有调用在线模型，也没有写入外部系统。脚本只记录审批回调看到什么、是否出现人工审批中断，以及函数体最终收到什么。

| 用例 | 原始参数 | 验证后的参数 |
| --- | --- | --- |
| 原样安全目标 | `{"target":"safe"}` | 不变 |
| 原样受保护目标 | `{"target":"protected"}` | 不变 |
| 缺省默认目标 | `{}` | `{"target":"protected"}` |
| 显式整数 | `{"count":1}` | 不变 |
| 字符串转整数 | `{"count":"1"}` | `{"count":1}` |
| 应用 validator | `{"environment":"PROD"}` | `{"environment":"prod"}` |

## 旧版本里，批准与执行确实可能错位

在 v0.22.2 中，完全相同的参数符合直觉：安全目标执行，受保护目标触发审批。

真正的差别出现在验证改变参数时：

- 空对象进入条件回调时仍是 `{}`，回调放行；函数收到默认补出的 `protected` 并执行。
- 回调看到字符串 `"1"`，函数收到整数 `1`。
- 回调看到 `PROD`，函数收到 validator 转换后的 `prod`。

也就是说，条件回调并没有看到函数实际消费的完整对象。

![v0.22.2 与 v0.22.3 对验证后参数的不同处理](/assets/context-authority-20260918/approval-arguments.figure.zh.svg)

*图 1：v0.22.2 的条件回调读取原始参数，函数消费验证后参数；v0.22.3 遇到值变化时转入人工审批。图中是本轮六用例的概括，不代表所有 schema 行为。*

## 新版本选择了一个保守边界

在 v0.22.3 中，原样参数仍沿用条件回调：安全目标继续执行，受保护目标继续中断。默认值、类型转换和 validator 造成的三种变化，则都没有调用条件回调，而是直接进入人工审批，函数没有执行。

这不是简单地把审批放到“验证之后”。如果直接把转换后的值送给原有条件回调，也可能改变应用过去依赖的策略语义。新版本采用了更保守的兼容方式：**原始值与准备后值能安全证明一致，才继续走原条件规则；发生变化时，把决定交还给人。**

我们还运行了 v0.22.3 新增的审批参数测试文件，108 条测试全部通过。

## 批准一个工具名，还远远不够

这组实验让“批准”变得更具体。一次可验证的批准，至少需要回答：

1. 人或策略看到了哪份参数？
2. schema 默认值和 validator 已经运行了吗？
3. 实际执行前，参数是否仍与获批对象一致？
4. 恢复 session 后，继续执行的是否仍是同一个准备后动作？

如果界面只显示工具名，例如“允许调用 deploy”，用户仍然不知道目标环境是原始的 `PROD`、规范化后的 `prod`，还是默认补出的另一个值。更可靠的审批记录，应把最终动作绑定到可复验的摘要，并在动作变化时让旧批准失效。

## CodeFlowMu 要不要因此改代码

我们检查了 CodeFlowMu v2.1.2 的本地实现。它会为审批请求计算稳定的 `operation_digest`，执行前再用当前请求重算；摘要变化会把记录标成 `stale` 并拒绝执行。它还绑定 operation fingerprint、项目、Agent、任务、thread 和角色，并使用一次性 execution token。本轮 28 条审批边界定向测试全部通过。

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

