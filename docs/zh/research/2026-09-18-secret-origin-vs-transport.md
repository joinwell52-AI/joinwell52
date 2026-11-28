---
schema: "publication-candidate-article/v2"
title: "密钥放在环境变量里，为什么仍会出现在进程列表？"
date: "2026-09-18"
published_date: "2026-09-18"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "密钥来自环境变量，是否就不会暴露在子进程命令行？"
summary: "密钥放进环境变量，只解决了它从哪里来。我们用一枚假密钥验证：后续传递方式仍会决定它是否出现在进程命令行。"
cover: "/assets/context-authority-20260918/secret-argv.cover-v1.png"
language: "zh-CN"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Windows 合成 token 有界实验；不代替 Linux 事件复现"
pageClass: "context-authority-article"
---

<ArticleCover image="/assets/context-authority-20260918/secret-argv.cover-v1.png" kicker="开源工程观察 · 安全实验" title="密钥放在环境变量里，为什么仍会出现在进程列表？" summary="环境变量像保险柜；如果程序又把密钥写到命令行，它就走上了更容易被看见的路径。" version="2026-09-18" languageHref="/en/research/2026-09-18-secret-origin-vs-transport" languageLabel="English" />

<ArticleTableScroll language="zh" />

<style>.context-authority-article .vp-doc h1[id] { display: none; }</style>

# 密钥放在环境变量里，为什么仍会出现在进程列表？

很多安全说明会写：“API 密钥通过环境变量提供。”这句话听起来像一个终点，实际只描述了密钥从哪里来。可以把环境变量想成保险柜：把密钥放进去很重要，但还要看程序取出密钥后，把它带去了哪里。

假设脚本随后运行：

```sh
curl -H "Authorization: Bearer $API_KEY" https://example.test/me
```

Shell（命令解释器）会先把 `$API_KEY` 替换成真实值，再启动 `curl`。对 `curl` 来说，真实密钥已经写在启动命令上，像从保险柜取出后又写到了快递面单。密钥虽然来自环境变量，却在下一步走进了另一个可观察面。

## 这次研究来自哪里

Paperclip 的开放 PR [#13572](https://github.com/paperclipai/paperclip/pull/13572) 报告了一个具体问题：平台在 Agent 提示中提供可复制的 `curl` 示例，把运行令牌（JWT）展开进 argv，也就是程序启动时的命令行参数。作者 Dmitry Novikov 表示，他们在 Linux 部署中持续读取进程命令行，捕获到了工作 Agent 的真实令牌；PR 将多处示例和脚本改成通过标准输入（stdin）传递认证信息。

这个来源值得研究，因为它挑战了一条常见的快捷判断：“密钥在环境变量里，所以没有写在命令里。”真正的问题不是初始存储位置，而是**密钥从存储到使用，途中经过了哪些地方**。

我们无法用本轮 Windows 环境复现对方的 Linux 部署，也没有接触任何真实 Paperclip 密钥。于是我们设计了一个更窄、可验证的本地问题：同一枚假密钥分别放进启动命令、子进程环境变量和标准输入时，Windows 的进程命令行能看到什么？

## 一枚假密钥，三条路径

实验密钥是 `SYNTHETIC-RUN-TOKEN-9f4c2a`，只用于本地测试。三个子进程启动后保持等待：

1. 命令行参数（argv）：密钥作为 `--token` 的值。
2. 子进程环境（env）：密钥放入环境变量。
3. 标准输入（stdin）：进程启动后再把密钥写给它。

父进程以同一 Windows 账户，通过 `Win32_Process.CommandLine` 读取子进程命令行。实验不访问网络，也不使用真实凭证。

| 传递方式 | 子进程正常启动 | 密钥出现在命令行 |
| --- | --- | --- |
| argv | 是 | **是** |
| 环境变量 | 是 | 否 |
| stdin | 是 | 否 |

![同一枚 token 经过三条路径时的命令行可见性](/assets/context-authority-20260918/secret-argv.figure.zh.svg)

*图 1：在本轮 Windows 观察面中，只有命令行参数路径把假密钥显示在进程命令行。该结果不代表环境变量或标准输入在其他观察面绝对安全。*

## 密钥是怎样从保险柜走上“面单”的

环境变量是密钥的来源，命令行参数是后续载体。把 `$API_KEY` 写进命令模板，相当于要求 Shell 在创建子进程前把密钥替换成普通字符串。此后，进程列表、诊断工具、崩溃报告或审计采集器是否能看到它，取决于操作系统和部署边界。

这也是为什么“仓库里没有明文密钥”和“运行时不会泄露密钥”是两项不同的检查。前者关注静态存储，后者关注值在运行中经过哪些接口。

同样，标准输入不是一张万能安全证书。它只让密钥不必成为目标进程的命令行参数。接收程序仍可能记录输入，父进程仍持有值，权限过大的观察者也可能从其他通道读取内存或环境。本轮结果只回答命令行可见性。

## 上游 PR 做对了什么，又还没完成什么

PR #13572 的做法很有工程价值：它不只修改一个示例，还先故意泄漏一次，证明报警器真的会响；随后再验证修正路径没有报警。工程测试把这种已知会失败的样本称为“阳性对照”。没有它，一个坏掉的扫描器也会给出虚假的“零泄漏”。

但这项 PR 目前仍是开放状态。作者也明确写出范围边界：仓库里还有固定发布快照、烟雾测试、工作流和文档示例需要后续处理。因此，我们不能把它写成“Paperclip 已经彻底修复”，也不能把上游作者的 Linux 数据冒充为我们的实验结果。

## CodeFlowMu 是否需要开发

我们检查了 CodeFlowMu v2.1.2 的进程启动路径，没有发现把 API 密钥拼接进命令行参数的实现。受查的 Windows Use Host 通过环境变量传递配置，通过标准输入发送调用数据；启动命令里只有 Python 解释器、脚本路径和非密钥参数。

所以本轮开发评审仍是 **不做**。这项研究会进入安全审查规则：搜索密钥从 env 到 argv 的二次展开，并在出现真实调用点时增加带红色对照的回归测试。当前没有缺陷证据，不建立开发任务。

## 可以带回自己项目的四个检查

1. 搜索的不只是硬编码 token，还要找 `$API_KEY`、`${TOKEN}` 被拼入命令参数的位置。
2. 检查文档和 Agent 提示。可复制示例会成为运行时行为的一部分。
3. 给泄漏检测器设置阳性对照，先证明它能够发现一次故意泄漏。
4. 分开记录“密钥来源”和“最后一跳传递方式”，不要用前者替代后者。

更深一层的问题是：当 Agent 可以生成任意 Shell 命令时，平台应该只提供安全示例，还是还应在执行层拒绝包含敏感值的 argv？前者降低出错概率，后者才形成强制边界。两者的成本和误报都不同，值得继续实验。

## 实验资料

- [Paperclip PR #13572](https://github.com/paperclipai/paperclip/pull/13572)
- [本轮公开实验记录](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-18-context-authority)

