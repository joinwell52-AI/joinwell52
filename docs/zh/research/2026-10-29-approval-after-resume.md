---
schema: "publication-candidate-article/v2"
title: "点过批准，AI 换个会话还能继续吗？"
date: "2026-10-29"
published_date: "2026-10-29"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "同一 Agent 恢复到新会话后，原批准如何只对原操作生效一次？"
summary: "一次明确的操作已获批准，Agent 恢复到新会话后却再次被要求审批。CodeFlowMu 当前源码的两层对照，让‘授权跟随谁’成为可检验的问题。"
cover: "/assets/approval-resume-20261029/approval-after-resume.cover-v1.png"
language: "zh-CN"
lifecycle: "Published"
publication_authorized: true
evidence_status: "固定私有源码；授权记录与 native 工具入口的临时目录对照；未执行远端操作"
pageClass: "six-governance-article"
---

<ArticleCover image="/assets/approval-resume-20261029/approval-after-resume.cover-v1.png" kicker="工程研究 · 恢复与授权" title="点过批准，AI 换个会话还能继续吗？" summary="一次明确的操作已获批准，Agent 恢复到新会话后却再次被要求审批。CodeFlowMu 当前源码的两层对照，让‘授权跟随谁’成为可检验的问题。" version="2026-10-29" languageHref="/en/research/2026-10-29-approval-after-resume" languageLabel="English" />

<ArticleTableScroll language="zh" />

<style>.six-governance-article .vp-doc h1[id] { display: none; }</style>

# 点过批准，AI 换个会话还能继续吗？

你让 AI 助手完成一项工作。它准备推送指定分支，系统要求你批准；你核对了目标，点下“批准”。随后执行会话中断，助手在新会话里继续，发出**同一项操作**。

此时有两种同样让人不安的结果：旧批准不加检查地跟着新会话走，或者系统忘了刚才批准过什么，让你反复点同一个按钮。理想的续接应该更精确：**换人、换任务、换目标要拦下；同一执行者按原条件重试，也不能凭会话号变化就失去已经授予的一次机会。**

我们在 CodeFlowMu 当前源码中发现，后半句比看上去更难做到。

## 外部变化，为什么让我们检查自己的“批准后重试”

这次不是要复现别人的故障。[Codex 的每 chat MCP 租约](https://github.com/openai/codex/pull/57978)把共享连接与调用者身份分开：连接可以共用，租约仍属于各自的 chat。[OpenAI Agents JS 的环境准备归属](https://github.com/openai/openai-agents-js/pull/2085)要求客户端负责的环境解析在恢复时仍归客户端；[Paperclip 的断线写入恢复](https://github.com/paperclipai/paperclip/pull/17960)保留原账户、原任务和原请求键，账户变了便停止旧工作。三项变化都在提醒我们：**“继续运行”不自动回答“现在是谁在运行、沿用哪份授权”。**

CodeFlowMu 同样允许 Agent 在批准后重试。我们因此把问题缩到一处可测的边界：一份批准授予了某个 Agent、某项任务、某个具体操作；会话中断后，系统如何判断新来的请求仍是那件事？

## 两层入口，给出了不同答案

我们固定当前私有 CodeFlowMu 源码的一个提交，在临时目录构造受控请求。请求是“DEV-01 为 TASK-1 执行 `git push origin main`”，仅进入审批判断；**没有运行 Git 命令，也没有连接远端**。管理员批准后，我们分别测试授权记录接口和真正由 native 工具调用使用的审批入口。

| 重试条件 | 授权记录接口 | native 工具入口 |
| --- | --- | --- |
| 原会话 1，已批准 | 可用 | 同一操作可通过一次 |
| 新会话 2，批准决定指定唤醒它 | 跨会话续接被接口设计允许 | 再次要求批准 |
| 新会话 3，同一 Agent、任务与操作 | 可消费一次批准 | 再次要求批准 |
| 换 Agent、换任务或换命令目标 | 不匹配 | 仍要求批准 |

原会话成功消费后，同一批准不能再用第二次。现有审批模块测试也 **15/15 通过**，其中已有“批准过的 Agent 重试在恢复 Session 后消费一次授权”的测试。所以问题不是“程序完全没有防重复”，而是：**测试所调用的记录接口，和工具实际走到的入口，对‘同一操作’的计算不同。**

![同一项批准在记录接口与工具入口面对新会话时给出不同结果](/assets/approval-resume-20261029/approval-after-resume.figure.zh.svg)

*图：临时目录中的审批判断。图示的是规则结果，不表示 Git 推送实际发生。*

## 为什么会这样：旧批准认得操作，却认不出恢复后的自己

在授权记录接口里，计算“操作摘要”时会排除请求最外层的会话号，这使同一 Agent 的新会话有机会匹配旧批准。它仍核对 Agent、任务、操作指纹、项目和其他范围，并把授权标记为只能消费一次。这是合理的续接意图。

但 native 工具入口会把会话号再放进一份**嵌套的操作事实快照**。新会话重算时，具体操作的指纹没有变；快照中的会话号变了，整个操作摘要也随之改变。批准候选要求摘要和指纹都一致，于是找不到刚才那份批准。我们连“决定指定唤醒”的会话 2 都测了，结果仍是再次审批；原会话 1 则能通过。

这不是已证实的越权漏洞。它在受测路径上表现为**合法续接被再次拦下**。当然，也不能简单删掉所有会话信息：会话可能是审计与责任追溯的重要线索。真正需要定义的是，哪部分属于“批准的操作范围”，哪部分只是“这次由谁承载执行”的记录。

## 从一次按钮，追问一份可迁移但不扩张的授权

我们的实验只覆盖固定源码、临时目录、审批记录与 native 工具判断。**没有证明部署版用户遇到过重复审批，也没有测试真实 Host 接管、账户切换、凭据轮换或远端结果。** 当前产品源码不公开；[公开实验摘要](https://github.com/joinwell52-AI/joinwell52/blob/main/research/manual-runs/2026-10-29-resume-approval/00-report.md)提供方法、对照输出和限制，但不能代替公众直接重跑私有 Runtime。

这项结果留下三个需要继续回答的问题：

1. **批准绑定谁？** Session 是授权主体，还是可以变化的执行载体？如果同一 Agent 连续恢复两次，怎样重新证明它仍是原执行者？
2. **批准绑定什么？** 操作目标、内容、任务和项目必须保持一致；如果 Host、账户或凭据归属变化，哪一道门禁要求重新审批？
3. **批准之后发生了什么？** 如果第一次请求已经送达远端，回执却丢了，单次授权并不能证明远端只执行过一次。恢复前仍要核实结果，而非盲目重发。

对普通使用者，这意味着一个简单的判断：看到“已批准”或“请再次批准”，都值得追问**这是同一操作的合法续接，还是范围已经改变**。对工程师，真正的设计题是让批准在恢复时保持可用，同时不让它变成一张可跨人、跨目标使用的通行证。[研究仓库](https://github.com/joinwell52-AI/joinwell52)
