---
schema: "publication-candidate-article/v2"
title: "AI 已经叫停，排队的工具为什么还会启动？"
date: "2026-10-28"
published_date: "2026-10-28"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "AI 已经叫停，排队的工具为什么还会启动？"
summary: "一句‘失败了’不等于执行真的停下。我们把同一组 16 种受控时序放到 OpenAI Agents Python 修复前后，观察已启动和排队中的工具。"
cover: "/assets/execution-boundaries-20261028/stopped-but-tool-ran.cover-v1.png"
language: "zh-CN"
lifecycle: "Published"
publication_authorized: true
evidence_status: "固定源码；上游回归测试在本机的修复前后对照"
pageClass: "six-governance-article"
---

<ArticleCover image="/assets/execution-boundaries-20261028/stopped-but-tool-ran.cover-v1.png" kicker="开源工程观察 · 对照实验" title="AI 已经叫停，排队的工具为什么还会启动？" summary="一句‘失败了’不等于执行真的停下。我们把同一组 16 种受控时序放到 OpenAI Agents Python 修复前后，观察已启动和排队中的工具。" version="2026-10-28" languageHref="/en/research/2026-10-28-stopped-but-tool-ran" languageLabel="English" />

<ArticleTableScroll language="zh" />

<style>.six-governance-article .vp-doc h1[id] { display: none; }</style>

# AI 已经叫停，排队的工具为什么还会启动？

想象你让一个 AI 助手查资料、整理文件、再发起一次操作。中途检查发现第一步出了错，于是助手报告：“任务失败，停止执行。”

听起来很安全。但此时第二个工具可能已经开始，第三个还在队列里。**错误被报告出来**和**之后不再发生新动作**，其实是两件事。对会调用外部工具的 Agent，这个时间差比最后一句回答更重要。

## 我们为什么追这条变化

在 10 月 28 日的[18 组 Agent 工程动态](https://joinwell52-ai.github.io/joinwell52/zh/runtime/daily-intelligence/2026-10-28)中，[OpenAI Agents Python 的 PR #5446](https://github.com/openai/openai-agents-python/pull/5446)描述了一种具体情况：一个函数工具的失败已经被选为本次运行的错误，程序还在收拾先前完成的输出，排队的另一类工具却可能继续执行。并行输入检查拒绝时，也有相似的停止边界。

这正对应我们研究的一个问题：**“停止”什么时候才真正传到执行队列？** 它可以用固定源码、同一测试、修复前后两份代码来回答，比只读 PR 描述更可靠。

## 把“报错”和“停手”分开测

我们没有调用真实模型，也没有让工具触碰真实文件或网络。使用上游修复版的回归测试，`ScriptedModel` 按预设顺序发出工具请求；合成的 custom tool 和 local shell tool 只记录自己是否启动、是否收到取消。测试把“已有工具在运行、另一个在排队、函数失败被选定”的时刻控制住，再放行收尾步骤。

同一测试放在修复前的 [`a91f0bfe`](https://github.com/openai/openai-agents-python/tree/a91f0bfe013a63ce0ad8935c8c2d25047d249002) 和合并版 [`cd26bbbc`](https://github.com/openai/openai-agents-python/tree/cd26bbbc52847845fde73b9952b51e62e2bcbdc0) 上运行。我们交叉了两类工具、流式与非流式、输入拒绝与否、清理期间是否再出错，共 16 种受控时序。

| 源码 | 16 种时序的结果 | 失败或通过意味着什么 |
| --- | --- | --- |
| 修复前 | **16/16 未通过** | 已启动的 native 工具没有在这个时间窗收到预期取消信号。 |
| 合并版 | **16/16 通过** | 同样时序下，活动工具收到取消，排队的调用没有越过停止边界。 |

我们又在合并版运行相关的两个测试文件，共 **84/84 通过**。这不是“84 种真实场景都安全”，只是相关回归未出现失败。前版的 16 个用例均停在相同的取消断言，且测试进程打印了实际加载的前版源码路径；这样排除了“只是在两次运行里不小心测到同一份代码”的疑问。

![函数失败选定后，活动工具收到取消，排队请求留在边界之外](/assets/execution-boundaries-20261028/stopped-but-tool-ran.figure.zh.svg)

*图：控制测试中的关键时序。图只表达本轮观察到的执行边界，不表示对现实中已完成的工具操作做了回滚。*

## 修复改变了什么

修复把“选定失败”变成一个会影响其他工具的事件：活动 native 工具接收取消，队列也不再继续放出新调用。它仍会在有界时间里处理已完成工具的输出，避免简单丢失错误前已经产生的结果；真正由调用者发出的取消则优先结束。

这给出一个很实用的区分：**停止新动作、取消进行中的动作、撤销已发生的副作用，是三个不同承诺。** 本轮测试验证了前两者在特定受控时序中的改进；它没有证明一个已经发出的请求会被远端撤销，也没有验证所有真实工具的取消协议。PR 已合并，我们没有核验某个正式发行版是否包含它。

如果你正在用 Agent 执行真实任务，可以问一个具体问题：当检查失败或人按下停止时，系统能否说清哪些调用尚未启动、哪些已经启动、哪些虽被取消但外部结果仍不确定？

专业读者还可以进一步追问：如果工具在取消信号到达前已经提交了外部操作，运行记录应如何表达这个“不确定窗口”，才能让恢复者知道哪些动作需要人工核对？普通使用者遇到过“显示停止，却还有文件或远端状态变化”的情况吗？具体的时间顺序会比一句“AI 没停住”更有帮助。

实验命令、固定版本和限制见[公开实验报告](https://github.com/joinwell52-AI/joinwell52/blob/main/research/manual-runs/2026-10-28-execution-boundaries/00-report.md)。本轮是**上游回归测试在本机的修复前后对照**，不是生产故障复现。[研究仓库](https://github.com/joinwell52-AI/joinwell52)
