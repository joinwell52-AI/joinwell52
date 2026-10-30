---
schema: "publication-candidate-article/v2"
title: "报告写了，提交也成功了，为什么任务还是没交？"
date: "2026-10-30"
published_date: "2026-10-30"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "两个工具成功属于不同任务时，当前任务的会话能否被判完成？"
summary: "在一个双任务实验里，A 的报告写入成功、B 的提交也成功，CodeFlowMu 却把 A 的会话结算为完成；正式账本中的 A 仍在进行。"
cover: "/assets/completion-evidence-20261030/two-successes.cover-v1.png"
language: "zh-CN"
lifecycle: "Published"
publication_authorized: true
evidence_status: "FCoP 4 临时任务真实操作；私有 CodeFlowMu Google 适配器模块级对照；未运行完整模型或 UI"
pageClass: "six-governance-article"
---

<ArticleCover image="/assets/completion-evidence-20261030/two-successes.cover-v1.png" kicker="工程研究 · 完成与证据" title="报告写了，提交也成功了，为什么任务还是没交？" summary="在一个双任务实验里，A 的报告写入成功、B 的提交也成功，CodeFlowMu 却把 A 的会话结算为完成；正式账本中的 A 仍在进行。" version="2026-10-30" languageHref="/en/research/2026-10-30-two-successes-one-task" languageLabel="English" />

<ArticleTableScroll language="zh" />

<style>.six-governance-article .vp-doc h1[id] { display: none; }</style>

# 报告写了，提交也成功了，为什么任务还是没交？

同一位执行者手上有两项工作。A 的报告写好了，B 的任务提交审核也成功了。系统如果只数“报告成功”和“提交成功”这两个绿勾，就可能宣布：**A 的这一轮工作结束了。**

问题是，A 从来没有提交。我们在自己的系统里用两个临时任务做了这个对照：CodeFlowMu 的一条会话结算路径返回 `done`，保存正式任务状态的 FCoP 却仍把 A 记为 `active`，也就是“正在进行”。这里的 `done` 是**会话结束判断**，不是 FCoP 已批准的任务完成状态。即便如此，两个地方对“这一轮是否交了 A”给出了相反信号。

## 为什么会想到检查这件事

这不是照着别人的故障复现。[Paperclip 最近修复了被拒绝的完成声明](https://github.com/paperclipai/paperclip/pull/18227)：一个完成请求即使被控制器拒绝，也不能因为模型随后正常结束，就另造一份成功结果。[Codex 则把轨迹是否完整单独记录](https://github.com/openai/codex/pull/58166)：任务结束和过程证据完整是两件事。这些改动分别处理不同产品中的不同边界，共同提醒我们：**“成功”得说明成功的是哪件事。**

CodeFlowMu 是我们开发的本地多 Agent 工作系统；FCoP 是它使用的正式任务、报告和生命周期账本。我们关心一个更贴近自己工程的问题：如果模型在同一会话中操作两项任务，运行层会不会把来自 A 和 B 的成功拼在一起？如果会话中断，已经写入账本的报告还能不能被正确找回？

## 把两个“成功”拆开

我们固定 CodeFlowMu V3.0.129 与 FCoP 4.0.5 的源码版本，在临时目录建立 A、B 两项真实 FCoP 任务。两组实验都成功写入 A 的正式报告；区别只在最后一步：一组提交 A，另一组提交 B。随后把真实操作的成功结果送进 CodeFlowMu 现有的 Google 执行适配器模块，观察其提前停止和会话结算判断。

| 本轮实际发生的事 | A 写报告、A 提交 | A 写报告、B 提交 |
| --- | --- | --- |
| FCoP 能读到 A 的正式报告 | 1 条 | 1 条 |
| 适配器看到的“写报告成功／提交成功” | 是／是 | 是／是 |
| 适配器对 A 的会话结算 | `done` | `done` |
| FCoP 中 A 的正式任务阶段 | `review`，等待审查 | `active`，仍在进行 |

<figure>
  <img src="/assets/completion-evidence-20261030/two-successes.figure.zh.svg" alt="受控实验示意：同任务组 A 写报告并提交 A，A 进入审查；跨任务组 A 写报告但提交 B，A 仍在进行，而会话结算均为 done。" />
  <figcaption>受控实验示意。上层的会话结算与下层的正式任务阶段分开看。</figcaption>
</figure>

这不是假造一个“提交成功”文本。两组中的写报告和提交都通过了 FCoP 的真实接口。**错的是把两个不同任务的成功当成一张共同的完成凭证。** 在受测代码里，运行层按工具名累计两个布尔标志；当两个标志都为真，就提前结束，并在结算时优先相信这组标志。标志没有携带同一个任务号和执行尝试号，因此它们不能回答“A 是否提交”。

## 拿掉内存标志，另一个方向也会出错

我们再去掉进程内的成功标志，只让结算器从磁盘重新寻找报告。两组都得到 `blocked/no_valid_report`，尽管 FCoP 的正式查询都能读到 A 的报告。

原因也很具体：FCoP 4 用 `REPORT-<UUID>.md` 文件和 `subject_ref` 记录报告与任务的关系；这条旧式查找路径先按带角色后缀的文件名筛选，再读旧关系字段。它没有通过 FCoP 4 的正式报告查询来恢复事实。于是当前模块出现两个相反的盲点：**进程内成功标志过宽时，A 没提交也能结算为完成；进程内标志消失时，A 有正式报告却会被说成没有报告。**

这并不等于 FCoP 账本误判。跨任务组里，FCoP 始终把 A 留在 `active`；同任务组里，它把 A 移到 `review`。账本仍区分两项工作。需要改进的是使用账本的这条运行适配路径。现有相关单元测试 10 项通过，但没有覆盖这组跨任务与恢复对照。

## 下一步该由什么证明“交了”

我们的工程判断是：会话结束信号必须指向**同一任务、同一执行尝试、同一份已接收报告**，并与正式生命周期相符。重启后，应从 FCoP 的公开查询重新取得报告头与任务阶段；若内存标志与账本冲突，先把状态留为“待核对”，不要直接宣布完成或缺报告。这是下一步拟议的合同，**尚未实现**。

实验只直接调用了 FCoP 真实操作和 CodeFlowMu 当前 Google 适配器模块，没有运行真实模型、完整界面或生产任务；不能据此说线上已经发生过误交付，也不能推及其他模型接入。公开的 [中英文实验记录与 FCoP 可复跑脚本](https://github.com/joinwell52-AI/joinwell52/blob/main/research/manual-runs/2026-10-30-completion-evidence/00-report.md)列出了方法与限制；私有 CodeFlowMu 代码不在公开仓库。

专业读者可以进一步追问：跨任务成功应在工具调用时阻止，还是在会话结算时重新验账？普通读者若遇过“助手显示做完，但任务仍未交付”，最有用的反馈是：**显示的是哪一层的完成，最终交付物又在哪里？**
