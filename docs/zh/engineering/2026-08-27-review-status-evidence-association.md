---
title: "任务在审查中，就等于证据没有串账吗？一份历史报告账本如何暴露关联断点"
date: '2026-08-27'
column: open-source-engineering
category: daily
article_type: engineering-case-study
edition: research-center
research_question: "任务已经进入 review 时，执行回执、REPORT 与审查记录能否自动被认为属于同一张任务？"
summary: "把一份固定历史切片中的 10 条报告写入逐行对账后，4 条直接关联、4 条缺键、2 条冲突。位置不是归属证明，因此 R2 已进入只读证据诊断工程能力建设。"
sources: "/zh/research/evidence/2026-08-27-runtime-semantics-evidence-pack"
project_relevance: first-party-research
item_id: "RSEM-20260827-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-27-review-status-evidence-association-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-27-review-status-evidence-association-cover.png"
  kicker="开源工程观察 · 工程研究"
  title="任务在审查中，就等于证据没有串账吗？一份历史报告账本如何暴露关联断点"
  summary="把一份固定历史切片中的 10 条报告写入逐行对账后，4 条直接关联、4 条缺键、2 条冲突。位置不是归属证明，因此 R2 已进入只读证据诊断工程能力建设。"
  version="RSEM-20260827-02"
  status="工程研究 · 2026-08-27"
  languageHref="/en/engineering/2026-08-27-review-status-evidence-association"
  languageLabel="English"
/>

# 任务在审查中，就等于证据没有串账吗？一份历史报告账本如何暴露关联断点

我们原以为这是一项很简单的核对：挑出一份历史记录，看看每次写入 REPORT（执行报告）时，运行时日志和报告账本是不是都写回了同一张任务。

样本只有 10 条。结果并不整齐：**4 条能直接对上；4 条在运行时动作记录里根本没有任务编号；另有 2 条对同一份 REPORT 写出了不同的任务编号。**

这不是一次“大规模事故”，也不是系统故障率。它是一份固定历史切片的十行账。但恰恰因为样本小、规则死板，问题格外清楚：如果 Reader 为了让页面完整而在两条不同记录中挑一条，那么一张显示 `review` 的任务卡，可能已经把别人的执行回执算到了自己头上。

CodeFlowMu 是我们正在开发的一个本地运行多 Agent 协作系统。这次账本复盘让我们决定把 R2 证据关联诊断推进为工程能力：不是给任务再加一种状态，而是让任务详情能够诚实回答“这些报告和执行记录，为什么能连到这里”。

## 十条记录，先别急着算“成功率”

原始材料来自一个固定历史提交。我们只取两种显式字段：动作日志里 `report.write` 的 REPORT ID 与 task ID，和报告账本中同一 REPORT ID 对应的 task ID。为了让分类可以重跑，公开候选材料会把 REPORT 与任务替换为 `R01…R10`、`T01…T09`，去掉正文、绝对路径、会话标识和 Agent 文本。

规则没有任何“智能”成分：

| 两份记录的关系 | 数量 | Reader 应做什么 |
| --- | ---: | --- |
| task ID 都存在且相同 | 4 | 标为 `linked`：这条关系可以直接读出。 |
| 动作记录没有 task ID | 4 | 标为 `missing`：不凭文件名或时间去补。 |
| task ID 都存在但不同 | 2 | 标为 `conflict`：保留两边值，不替人选边。 |

如果 `R08` 在动作日志中指向 `T02`，在报告账本中却指向 `T07`，系统最省事的做法是挑一个“最新的”或者“更像当前任务的”。这正是我们拒绝做的事。Reader 原型的三项回归分别固定了 `4/4/2` 分布、冲突不产生规范目标、缺键不做推断，三项均通过。

这三项测试证明的不是报告真实，更不是业务交付合格；它只保证一件很具体的事：**面对缺失和矛盾，读端没有把不确定性剪掉。**

![图 1：十条 REPORT 的逐行关联分类](/assets/figures/2026-08-27-review-status-evidence-association-figure-1.svg)

*图 1：固定历史切片中 10 条 REPORT 的逐行对账：4 条直接关联、4 条缺键、2 条冲突。它不是故障率，也不裁决报告内容；它把 Reader 可以确认与必须保留的问题并排展示。来源：公开候选证据包 R2。*

## `review` 说的是位置，不是亲子关系

文件式协作里，五桶生命周期通常写成：`inbox → active → review → done → archive`。当任务文件在 `review`，系统回答的是“这张正式任务处于审查位置”。这个答案仍然重要：它决定谁可以审查、哪些下游动作应等待。

但它不能替 REPORT 回答“我属于谁”。下面两类事实必须并列存在：

```text
正式位置：TASK-17 位于 review

证据关系：
  这次执行属于哪次 attempt（执行轮次）？
  action evidence（动作证据）属于哪张任务和哪次修订？
  REPORT 能否回到同一轮执行？
  EVAL（只核查事实、不签字的检查）是否被误当成 REVIEW？
```

把位置当作归属证明，会有两种相反的错误：要么 `review` 掩盖报告串账；要么一条旁观检查发现了冲突，就把正式位置强行改成失败。正确做法是让两条轴各说各话：任务还是 `review`，证据关联则显示“待对账”。

## 一个来自 CrewAI 的提醒：过程不是一个完成事件

João Moura 在 CrewAI 的 [PR #7115](https://github.com/crewAIInc/crewAI/pull/7115) 中做了一件很小却很典型的事：把“尝试创建 deployment（部署）”和“实际创建成功并得到 UUID”连接得更明确。该 PR 已于 2026-08-27 合并。它不处理 CodeFlowMu 的文件账本，也不能证明我们的 10 条记录代表任何普遍现象。

它照亮的恰好是这份账本里的盲点：过程中的每一段都需要自己的证据。创建请求不等于创建成功；执行轮次不等于报告提交；报告提交也不等于被审查接受。

同一作者的 [PR #7118](https://github.com/crewAIInc/crewAI/pull/7118) 还在开放，尝试为 crew run 补一条所有用户可见的终态记录和时长。它只能算待验证的方向，不应写成成熟能力。但它让我们确信，继续往“多一个总完成字段”走并不能解决问题；关系的缺口会被总字段藏起来。

## R2 要做的是 X 光机，不是新的裁判

这就是 R2 进入工程能力建设的原因。它会只读地检查已有链条：

```text
TASK / 修订
→ attempt / lease（本轮执行权）
→ run / managed job（受管作业）
→ Action Evidence
→ REPORT
→ REVIEW 或 EVAL
→ 明确的业务决定
```

每一段只接收明确的稳定键：任务 ID、执行轮次、租约、运行 ID、报告 ID、修订号或来源摘要。找不到就标“待补证据”；两处不一致就标“待对账”；EVAL 即使发现问题，也只能显示“旁观核查”，不能升级成签字。

它的界面入口已经有明确设计：每张任务详情标题旁固定放一个 `⊕ 诊断` 徽标。正常时安静显示“已关联”；缺材料显示琥珀色“待补”；两份来源互相矛盾时显示橙红色“待对账”，并让 PM 看到一段完整人话：

> 这份 REPORT 写的是任务 003，但执行回执关联的是任务 002。系统没有替你选择其中一份；请查看依据后补证、撤回或创建新修订。

这不是“自动修复”按钮。R2 不移动五桶文件、不释放执行权、不重试 Agent、不批准或驳回任务。它只把原来藏在两本账中的断点画出来。PM 可以在看清来源后，使用既有正式流程补证、修订 REPORT、创建 ISSUE 或按授权恢复任务；新的正式事实出现后，R2 再重算。

## 先用十条记录检查自己的系统

如果你的系统也有任务、执行日志和报告，不必一开始就做完整图数据库。挑十条报告记录，问四个问题：

1. 每份 REPORT 能否回到唯一任务和唯一修订？
2. 它能否回到一次明确的执行资格或运行记录？
3. 两个来源冲突时，系统会保留冲突，还是挑一个看起来合理的答案？
4. “检查过”会不会被页面误写成“已经签字”？

这四问里最有价值的答案往往不是“全部对上了”，而是“有几条对不上，而且我们没有假装它们对上”。生命周期告诉团队任务走到哪一步；证据关联告诉团队，脚下这一步有没有踩在同一条责任链上。

## 来源与证据边界

[CrewAI #7115](https://github.com/crewAIInc/crewAI/pull/7115) 已合并；[CrewAI #7118](https://github.com/crewAIInc/crewAI/pull/7118) 在 2026-08-27 仍开放。[公开证据包](/zh/research/evidence/2026-08-27-runtime-semantics-evidence-pack)含全部十条脱敏样本、分类规则与可执行 Reader。本文 `4/4/2` 不是故障率或全量质量指标。R2 已获准进入工程能力建设，但 Reader、API、任务详情诊断徽标和回归尚未作为产品交付。
