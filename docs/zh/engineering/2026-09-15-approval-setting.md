---
schema: "publication-candidate-article/v2"
title: "写了“始终审批”，AI 为什么还是执行了？"
date: "2026-09-15"
published_date: "2026-09-15"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "写了“始终审批”，AI 为什么还是执行了？"
summary: "一段看似更严格的配置，怎样变成了直接执行？用真实调用入口，比较错误输入与审批判断。"
cover: "/assets/execution-facts-20260915/approval-setting.cover-v1.png"
language: "zh-CN"
lifecycle: "Published"
publication_authorized: true
evidence_status: "固定源码有界实验；范围见正文"
pageClass: "execution-facts-article"
---

<ArticleCover image="/assets/execution-facts-20260915/approval-setting.cover-v1.png" kicker="开源工程观察 · 实验研究" title="写了“始终审批”，AI 为什么还是执行了？" summary="一段看似更严格的配置，怎样变成了直接执行？用真实调用入口，比较错误输入与审批判断。" version="2026-09-15" languageHref="/en/engineering/2026-09-15-approval-setting" languageLabel="English" />

<ArticleTableScroll language="zh" />

<style>.execution-facts-article .vp-doc h1[id] { display: none; }</style>

# 写了“始终审批”，AI 为什么还是执行了？

“这个工具每次都要先问我。”开发者把审批配置写成了字符串 `"always"`，字面上很明确。可是，程序没有等待审批，工具直接运行了。

这不是我们遭遇的一起生产事故，而是一个可以在本地验证的配置反例。它来自 DeepanshuPal 提交给 [OpenAI Agents Python 的 PR #5029](https://github.com/openai/openai-agents-python/pull/5029)。这个 SDK 帮助开发者连接 AI 与工具；这里研究的是实时会话中的工具审批路径。

我们会关注它，是因为自己在做多 AI 助手协作系统。一次动作究竟可以直接执行，还是需要等待人的决定，不能只靠配置文字看起来“够谨慎”。这个来源给出了一个很小、却足以改变动作是否发生的分支，适合拆开验证。

## 人读懂了意思，程序没有接受这个类型

审批设置 `needs_approval` 接受布尔值，或者一个用来计算是否需要审批的回调函数。布尔值 `true` 表示需要审批，`false` 表示不需要。`"always"` 是字符串，根本不在这份约定里。

旧的实时会话路径使用了宽松判断。遇到这类非法配置时，它把“不知道怎样解释”落到了“不需要审批”。PR 的候选改动改用严格校验：非法类型抛出配置错误，工具不进入执行。

两者差别不是措辞变严厉了，而是**配置无法解释时，动作到底发生还是不发生**。

## 让同一个入口面对十种输入

我们固定候选提交 `b6c2cef`，通过真实的 `RealtimeSession._handle_tool_call` 入口调用一个本地记录工具。它只在列表里留下调用记录，不发邮件、不连接真实 AI 服务。

对照模式只把审批判断方法换回前身提交 `fbf59a4` 的实现，其余仍用候选源码。因此这是**单方法消融对照**，不是两套完整发行版的比较。

十种输入分别在两种模式运行。最能说明问题的是下面几组：

| 输入 | 前身判断方法 | 候选判断方法 |
| --- | --- | --- |
| `false` | 调用工具一次 | 调用工具一次 |
| `true` | 不调用，留下一项待审批 | 不调用，留下一项待审批 |
| 字符串 `"always"` | 调用工具一次 | 抛出 UserError，不调用 |
| 数字 `1`、空值 `None`、空对象 `{}` | 每种都调用一次 | 每种都报错，不调用 |
| 回调返回 `false` / `true` | 分别执行 / 等待 | 分别执行 / 等待 |
| 回调返回 `None` | 调用工具一次 | 仍然调用工具一次 |

异步回调返回 `false` 的正常路径也保持执行。我们还运行了原项目的 31 项审批测试：候选全部通过；换回前身方法后，30 项通过，非法配置这一项失败。没有把作者提到的更大测试集合算进我们的成绩。

![错误设置与回调返回值处于不同校验边界](/assets/execution-facts-20260915/approval-setting.figure.zh.svg)

*图 1：设置类型与回调输出属于不同校验边界。来源：本轮 runs/sdk.json 的十种输入。箭头表示本地调用判断，不表示真实云端请求。*

## 修复挡住了四类输入，却没有回答所有问题

表格最后一行值得停下来。

回调函数本身是允许的配置类型。但如果它忘了返回值，Python 会得到 `None`。在这个受测版本中，回调结果仍被转成布尔值，于是成为“不需要审批”。

这不等于我们又发现了一个已经确认的漏洞。回调约定原本要求返回布尔值，`None` 是我们故意构造的非标准返回。它说明的是：**检查“是不是一个允许的配置对象”，与检查“这个对象算出的结果是否有效”，属于两道不同边界。**

由此产生的工程问题是：回调错误应该在哪里暴露？由类型检查和测试发现，还是也由执行前的运行时检查拒绝？如果允许某些宽松转换，开发者能否清楚看见这份约定？

## 下一次检查审批，别只测“同意”和“拒绝”

这次对照给出一个容易带回自己项目的方法：除了正常允许、等待审批，还要输入一个明确不合法的值，并观察工具是否真的运行了。错误信息、界面显示和调用记录应分别查看。

对专业读者，更值得讨论的是回调返回值的契约：你会允许空值代表“不需要”，还是要求它明确报错？对使用 AI 工具的人，如果审批配置失效，你希望看到“设置有误，动作未执行”，还是另外一种可理解的处理？

本实验只覆盖固定源码的实时会话审批入口与本地记录动作。它不证明所有审批方式、远端连接或生产配置都具有同样行为，也没有确认 CodeFlowMu 存在对应问题。[公开探针、原始结果与复核方法](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-15-execution-facts)可用于检查本文结论。
