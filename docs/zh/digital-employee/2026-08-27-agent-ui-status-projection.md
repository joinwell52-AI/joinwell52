---
title: "一盏绿灯到底在说什么？多 Agent 面板怎样避免把“在线”写成“正在交付”"
date: '2026-08-27'
column: digital-employee
category: daily
article_type: comparative-technical-analysis
edition: research-center
research_question: "权限身份、网关连通性、会话活性、执行进度、报告到达和任务生命周期，能否被同一个 UI 状态或绿灯代替？"
summary: "从 Sutando 一次“协作者确实在执行却没有进度流”的公开反例出发，审计多 Agent 面板中五种常被压成绿灯的事实，并给出可执行的投影检查表。"
sources: "/zh/research/evidence/2026-08-27-runtime-semantics-evidence-pack"
project_relevance: first-party-research
item_id: "RSEM-20260827-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-27-agent-ui-status-projection-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-27-agent-ui-status-projection-cover.png"
  kicker="数字员工 · 工程研究"
  title="一盏绿灯到底在说什么？多 Agent 面板怎样避免把“在线”写成“正在交付”"
  summary="从 Sutando 一次“协作者确实在执行却没有进度流”的公开反例出发，审计多 Agent 面板中五种常被压成绿灯的事实，并给出可执行的投影检查表。"
  version="RSEM-20260827-03"
  status="工程研究 · 2026-08-27"
  languageHref="/en/digital-employee/2026-08-27-agent-ui-status-projection"
  languageLabel="English"
/>

# 一盏绿灯到底在说什么？多 Agent 面板怎样避免把“在线”写成“正在交付”

一个协作者正在真实的 live session（实时会话）里工作，也在持续写入进度文件。可团队页面上，他的任务没有任何进度。不是网络断了，不是 Agent 没启动，也不是数据没有产生；页面只是先问了一句“他是不是 owner（所有者）”，不是 owner 就不推送。

这是 Sutando 的 [PR #3432](https://github.com/sonichi/sutando/pull/3432) 记录的一次具体错投影。原来的 `should_stream_task()` 只对 owner 返回真。它的理由看似合理：非 owner 的 team task 会在只读 sandbox（沙箱）中运行，既然不会写 `core-status.json`，就没有 live step（实时步骤）可以展示。问题在于 collaborator（协作者）是这个规则的例外：协作者并不在那条只读沙箱路径里，会真实写入 `core-status.json`。页面把“不是 owner”当成了“没有实时执行”，于是把实际进度藏掉了。

修复后的对照很短：`team + collaborator` 从不展示变为展示；普通 team 仍不展示；owner 仍展示。PR 增加了四个回归用例，但作者也明确说明尚未完成真实 bridge 重启后的端到端见证，所以它目前仍是开放 PR，不是可以照抄成“已完全验证”的结论。

这个反例值得任何做 Agent 控制台的人停下来想一想：**屏幕上的绿灯，到底在说哪一件事？**

## 一盏灯，常常被要求回答太多问题

在多 Agent 系统里，用户会自然地把“在线”“执行中”“有进度”“已完成”当成同一种感觉。可它们其实来自不同来源：

| 页面文案 | 它应该回答的问题 | 最常见的错误替身 |
| --- | --- | --- |
| 网关在线 | 手机或浏览器能否连接当前本地 Runtime | 某个 Agent 正在工作 |
| 会话活跃 | 这次执行是否仍有可验证心跳 | 任务一定能交付 |
| 有进度 | 系统最近收到可解释的工作进展 | Agent 一直健康，或工作已经正确 |
| 完成待报告 | 执行会话结束，但 REPORT 尚未正式到达 | 任务已经验收 |
| 任务在 review / done | 任务的正式生命周期位置 | UI 显示的每条证据都正确归属 |
| 当前用户能看见 | 该用户有读取这条信息的权限 | 任务的实际执行位置 |

把其中任意两行混在一起，都会制造一种很难排查的假象。Sutando 的错误正是把“查看者/角色条件”误当成“是否存在 live step”的条件。反过来也一样危险：如果网关在线就显示任务正在推进，弱网、旧缓存或已经失活的会话都会被涂成绿色。

![图 1：五类运行事实如何投影为页面状态](/assets/figures/2026-08-27-agent-ui-status-projection-figure-1.svg)

*图 1：连接、执行、进度、报告和技术错误来自不同事实源。页面可以把它们分别呈现，却不应把任何一盏绿灯翻译成“任务已经交付”。来源：公开候选证据包 R3。*

## 回到我们自己的面板：先不问“有没有 bug”，先问“字段有没有各说各话”

CodeFlowMu 是我们正在开发的一个本地运行多 Agent 协作系统。Sutando 的 PR 没有证明它存在相同问题；我们没有发现“协作者正在工作却因非 owner 被隐藏”的本地案例。正确做法不是宣布安全，而是把现有读端逐项审计。

我们在面板的会话观察路径中读到了五种不同输出：

```text
executing_with_progress          正在执行，并有可见进度
executing_without_fine_progress  正在执行，但没有细粒度进度
session_without_live_execution   有会话记录，但没有可验证的实时执行
completed_waiting_report         会话完成，正在等正式 REPORT
technical_error                  会话失败或丢失，需要技术诊断
```

这组分类的意义不在英文枚举名，而在于它拒绝了一句话带过所有状态。例如，“执行中但没有细粒度进度”不该被显示为失败；“会话完成、等待 REPORT”也不该被显示为交付完成。

针对这五类输出，我们运行了一个既有的纯分类夹具，结果 **1/1 通过**。这只说明当前工作树里的这段分类逻辑按夹具运行过；工作树原本有未提交修改，因此它不是 V2.0.2 发布回归，更不是整套桌面端、手机端和权限过滤器的认证。

不过，它给出了一个值得守住的基线：**运行活性、细粒度进度、报告到达和技术错误可以在展示前被拆开。**

## 冲突不是噪声，不能为了页面干净而抹掉

投影错误不总是“把正在运行显示成没运行”。另一种常见错误是多份来源相互矛盾时，页面悄悄挑一份最顺眼的。

CodeFlowMu 已读到的两个防线都采用了相反做法：任务列表缺少 canonical workflow（规范工作流）或来源冲突时，显示 `projection_conflict`，不从 runtime、报告或验收字段猜一个生命周期；移动端 Gateway 同时比对 runtime、磁盘配置和 context（上下文）身份，实例标识不一致时拒绝把网关写成 online。已有夹具还区分了一种重要组合：正式 workflow 已是 `done`，审计证据却有 conflict 时，页面仍显示 `done`，同时保留证据冲突。

这看起来不够“聪明”，其实是在保护读者。任务的位置由正式工作流回答；一条审计冲突由审计轴回答。让后者把前者改成失败，或让前者吞掉后者，都会让人失去追查来源的机会。

## 给每个绿灯写一张“说明书”

如果要把这件事落到产品，我建议每个状态文案都必须能写出下面四项，而不是让组件从一堆布尔值中拼颜色：

| 要写下来的东西 | 例子 |
| --- | --- |
| 这盏灯的事实来源 | `Gateway online` 来自已对齐的 Runtime、磁盘配置与 context，而不是 REPORT。 |
| 它能说明什么 | 当前连接路径可用。 |
| 它不能说明什么 | 不说明任何 session 仍有心跳，也不说明任务可以验收。 |
| 冲突时怎么办 | 显示来源冲突或未知，不回退成默认绿色。 |

接着用组合夹具反问 UI：

- 用户不是 owner，但存在新鲜的本地 live session 时，进度会不会被隐藏？
- 网关在线、managed job（受管作业）心跳却已过期时，页面会不会把“在线”说成“正在执行”？
- workflow 是 done、证据关联有冲突时，两个事实能否同时被读到？
- 缓存旧、磁盘与 Runtime 实例身份不一致时，远程页面会不会继续把旧内容标为当前？

这些用例的价值在于，它们不要求先造一个更复杂的全局状态机。它们只要求每个条件只负责自己的事实：权限负责能否看，角色负责谁在承担，沙箱负责什么能力受限，活性负责有没有新鲜执行证据，生命周期负责任务现在在哪里。

## 不要让“绿色”替用户做决定

真正好的多 Agent 面板不该把所有东西都涂成警告色；用户需要快速看懂系统。但快速不等于把不同事实压成一个结论。

Sutando 的协作者进度丢失提醒我们：一个正确的理由，放在错误的条件上，同样会把真实工作藏起来。我们自己的审计则说明，分开 lifecycle、session、progress、REPORT 和来源冲突是可实现、可测试的读端纪律；更外围的 viewer authority（查看权限）、角色与沙箱组合仍需要反例审计，不能因为当前夹具通过就宣布结束。

下一次你看到“在线”或“执行中”，可以先问一句：它指的是哪一份来源、哪一个对象、哪一段时间？如果页面答不出来，这盏绿灯就还不够可靠。

## 来源与证据边界

[Sutando #3432](https://github.com/sonichi/sutando/pull/3432) 在 2026-08-27 仍为开放 PR；本文用它说明“权限身份不能替代执行位置”的公开反例，并不把它说成已发布修复。[公开证据包](/zh/research/evidence/2026-08-27-runtime-semantics-evidence-pack)给出五类观察合同和投影反例矩阵。第一方材料支持已读路径的基线，不证明所有 UI、PWA 或权限过滤器都已经通过完整正交性审计。
