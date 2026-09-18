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
summary: "一枚合成 token、三种传递方式和一个进程观察面，说明密钥的来源与它后来经过的通道是两回事。"
cover: "/assets/context-authority-20260918/secret-argv.cover-v1.png"
language: "zh-CN"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Windows 合成 token 有界实验；不代替 Linux 事件复现"
pageClass: "context-authority-article"
---

<ArticleCover image="/assets/context-authority-20260918/secret-argv.cover-v1.png" kicker="开源工程观察 · 安全实验" title="密钥放在环境变量里，为什么仍会出现在进程列表？" summary="安全来源不等于安全路径。一旦展开进命令参数，密钥就进入了另一个观察面。" version="2026-09-18" languageHref="/en/research/2026-09-18-secret-origin-vs-transport" languageLabel="English" />

<ArticleTableScroll language="zh" />

<style>.context-authority-article .vp-doc h1[id] { display: none; }</style>

# 密钥放在环境变量里，为什么仍会出现在进程列表？

很多安全说明会写：“API 密钥通过环境变量提供。”这句话听起来像一个终点，实际只描述了密钥从哪里来。

假设脚本随后运行：

```sh
curl -H "Authorization: Bearer $API_KEY" https://example.test/me
```

Shell 会先展开 `$API_KEY`，再启动 `curl`。对 `curl` 来说，真实 token 已经成了命令行参数。密钥虽然出生在环境变量里，却在下一步走进了另一个可观察面。

## 这次研究来自哪里

Paperclip 的开放 PR [#13572](https://github.com/paperclipai/paperclip/pull/13572) 报告了一个具体问题：平台在 Agent 提示中提供可复制的 `curl` 示例，把 run JWT 展开进 argv。作者 Dmitry Novikov 表示，他们在 Linux 部署中通过连续采样 `/proc/<pid>/cmdline` 捕获到了工作 Agent 的真实 JWT；PR 将多处示例和脚本改成经 stdin 传递认证头。

这个来源值得研究，因为它挑战了一条常见的快捷判断：“密钥在环境变量里，所以没有写在命令里。”真正的问题不是初始存储位置，而是**从存储到使用的整条投影路径**。

我们无法用本轮 Windows 环境复现对方的 Linux 部署，也没有接触任何真实 Paperclip token。于是我们设计了一个更窄、可验证的本地问题：同一枚合成 token 分别通过 argv、环境变量和标准输入交给等待子进程时，Windows 进程命令行能看到什么？

## 一枚假密钥，三条路径

实验 token 是 `SYNTHETIC-RUN-TOKEN-9f4c2a`，只用于本地测试。三个子进程启动后保持等待：

1. argv：token 作为 `--token` 的值。
2. env：token 放入子进程环境变量。
3. stdin：启动后从标准输入写入 token。

父进程以同一 Windows 账户，通过 `Win32_Process.CommandLine` 读取子进程命令行。实验不访问网络，也不使用真实凭证。

| 传递方式 | 子进程正常启动 | token 出现在命令行 |
| --- | --- | --- |
| argv | 是 | **是** |
| 环境变量 | 是 | 否 |
| stdin | 是 | 否 |

![同一枚 token 经过三条路径时的命令行可见性](/assets/context-authority-20260918/secret-argv.figure.zh.svg)

*图 1：在本轮 Windows 观察面中，只有 argv 路径把合成 token 显示在进程命令行。该结果不代表 env 或 stdin 在其他观察面绝对安全。*

## 真正的错误发生在“投影”时

环境变量是来源，argv 是后续载体。把 `$API_KEY` 写进命令模板，相当于要求 Shell 在创建子进程前把密钥替换成普通字符串。此后，进程列表、诊断工具、崩溃报告或审计采集器是否能看到它，取决于操作系统和部署边界。

这也是为什么“仓库里没有明文密钥”和“运行时不会泄露密钥”是两项不同的检查。前者关注静态存储，后者关注值在运行中经过哪些接口。

同样，stdin 不是一张万能安全证书。它只让 token 不必成为目标进程的命令行参数。接收程序仍可能记录输入，父进程仍持有值，权限过大的观察者也可能从其他通道读取内存或环境。本轮结果只回答命令行可见性。

## 上游 PR 做对了什么，又还没完成什么

PR #13572 的做法很有工程价值：它不只修改一个示例，还加入带“红色对照”的回归脚本。脚本先确认检测器确实能看到故意放进 argv 的 token，再验证修正路径没有命中。否则，一个坏掉的扫描器也会给出虚假的零泄漏结果。

但这项 PR 目前仍是开放状态。作者也明确写出范围边界：仓库里还有固定发布快照、烟雾测试、工作流和文档示例需要后续处理。因此，我们不能把它写成“Paperclip 已经彻底修复”，也不能把上游作者的 Linux 数据冒充为我们的实验结果。

## CodeFlowMu 是否需要开发

我们检查了 CodeFlowMu v2.1.2 的进程启动路径，没有发现把 API 密钥拼接进 argv 的实现。受查的 Windows Use Host 以环境变量传递配置，以 stdin JSON 发送调用数据；argv 只有 Python 解释器、脚本路径和非密钥启动参数。

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

