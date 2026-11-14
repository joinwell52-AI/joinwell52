---
schema: "publication-candidate-article/v2"
title: "每个子任务单独可行，合起来为什么无解？"
date: "2026-11-14"
published_date: "2026-11-14"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "局部可行的多 Agent 子任务为什么会形成不可执行的联合方案？"
summary: "一份实验室任务书里，各组的顺序分别可行，合并却形成严格闭环。我们核对 7+1 论文与公开案例，追问 AI 团队为何需要共享对象身份和联合边界检查。"
cover: "/assets/boundaryxp-cycle-20261114/boundaryxp-cycle.cover-v1.png"
language: "zh-CN"
lifecycle: "Published"
publication_authorized: true
evidence_status: "公开保存案例、625 组统计与选定数学复算；未重跑产品模型或 MCP 宿主分析"
pageClass: "six-governance-article"
---

<ArticleCover image="/assets/boundaryxp-cycle-20261114/boundaryxp-cycle.cover-v1.png" kicker="工程研究 · 任务边界" title="每个子任务单独可行，合起来为什么无解？" summary="一份实验室任务书里，各组的顺序分别可行，合并却形成严格闭环。我们核对 7+1 论文与公开案例，追问 AI 团队为何需要共享对象身份和联合边界检查。" version="2026-11-14" languageHref="/en/research/2026-11-14-boundaryxp-local-global-cycle" languageLabel="English" />

<ArticleTableScroll language="zh" />

<style>.six-governance-article .vp-doc h1[id] { display: none; }</style>

# 每个子任务单独可行，合起来为什么无解？

一份实验室研究任务书要求安排同一轮的四件事：安全复核、设备开机、包装、送检。负责人先定下底线：**安全复核结束，设备才能开机**。随后任务分给几个小组。测试组说，设备开机结束才能包装；送检组说，包装结束才能送检；安全组说，送检结束才能开始安全复核。

单看任何一组的安排，都能找到一种不违反负责人要求的排法。把它们拼起来，却变成了：

> 安全复核 → 开机 → 包装 → 送检 → 安全复核。

第一步必须等最后一步，最后一步又必须等第一步。没有人单独写下一条荒谬的指令，整份计划却不可能执行。这是 [BoundaryXP 公开研究材料中的 RT044 任务书](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/demo/reports/R389-383.zh.md)，一份保存的**计划约束案例**，不是实验室已经按这个顺序操作的事故。它恰好把多 AI 协作的一个难题摆到了桌上：**每个子任务都合规，整项任务仍可能越界。**

## 一张任务图，揭出单项检查没看到的环

RT044 有一个主任务和六个子任务，共七个节点。主任务要求同一轮安全复核 A 必须在开机 D 之前结束；TEST 增加 D→包装 B；LAB 增加 B→送检 C；SAFETY 增加 C→A。原文还说明这些是**同一轮、同一次**事件：不能靠“其实还有另一次包装”或“先做了另一轮复核”把环拆开。

[保存的计算记录](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/paper/materials/evidence-r18/results/R389-383.json)分别核查了父要求、各岗位自己的新增要求和合并方案。父要求本身可安排；TEST、LAB、SAFETY 的要求分别加入父要求，也都可安排。只有联合查询得到确定越界：严格先后关系推出“安全复核开始必须早于它自己开始”，这是不可能的。

| 看哪一层 | 实际结论 | 为什么 |
| --- | --- | --- |
| 主任务 | 可安排 | 安全复核可以先于开机 |
| 三条子顺序各自加入主任务 | 分别可安排 | 其余两组的顺序此时尚未加入 |
| 三条子顺序与主任务合并 | 越界 | 同一批四件事连成严格闭环 |

<figure>
  <img src="/assets/boundaryxp-cycle-20261114/boundaryxp-cycle.zh.svg" alt="RT044 中，主任务要求安全复核 A 先于开机 D，TEST 要求 D 先于包装 B，LAB 要求 B 先于送检 C，SAFETY 要求 C 先于同一次 A，合并后形成严格闭环" />
  <figcaption>四条严格顺序联合形成闭环。琥珀色只标出闭合处，不表示 SAFETY 单独违规；这些是计划要求，不是已执行事件。</figcaption>
</figure>

这个结论也不能倒过来指责三个小组“各自违规”。冲突来自**组合**；去掉其中任何一条子顺序，都能找到合法排列。正确的交接不是让三个小组各自再说一次“我没问题”，而是把完整路径交给有权修改计划的人，改动至少一条顺序后重新核查。

## 7+1 不是给任务填八个勾

[朱卫的 BXP 论文](https://doi.org/10.5281/zenodo.24072738)把自然语言任务组织成“7+1”：输入范围、交付、动作、责任与分工、资源、版本依据、完成与停止，加上独立的禁止边界。换成日常问题，就是拿什么来做、交什么、谁做、受哪些限制、何时算结束，以及明确不能做什么。BoundaryXP（界痕）是围绕这一方法开发的边界分析工具。

这些名称的用处，是提醒审核者别只盯着“任务做了什么”。比如 RT044 中，责任视图帮助保留谁提出哪条顺序，版本与输入范围保留“同一轮、同一次事件”，禁止边界保留开机前必须完成安全复核。**真正让计算成立的是这些要求之间的共享关联**：TEST 的包装 B 和 LAB 的包装 B 必须是同一个 B，SAFETY 的复核 A 也必须是主任务那个 A。若对象身份接错，程序算得再精确，也只是在解错题。

因此，7+1 不是八个互不相干的打分器。公开附件的 [625 组分析](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/paper/materials/analysis625/REPORT.zh-CN.md)中，3,469 项计算有 3,257 项关联两个以上视图，900 项绑定多个目标节点。这些是**保存查询的结构计数**，不证明模型把每句原文都理解对了；它们说明为什么“每栏都填了”不足以替代跨任务关联检查。论文的形式论证也以来源对应、身份与关系覆盖、解释一致和查询编码精确等条件为前提；它是一份公开预印本，不是任意自然语言都能被无损理解的保证。

## “信息不全”和“已经冲突”，不能混成一个结论

同一套公开案例还给出两种很不一样的结果。[RT042](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/demo/reports/R389-381.zh.md)安排同一设备先由 X 在 10—11 点使用，再由 Y 在 11—12 点使用；父要求采用左闭右开的占用区间，并明确 11 点释放。端点相接，没有重叠，所以任务书**未越界**。[L23-050](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/demo/reports/R389-153.zh.md)要求明确指定唯一的最终责任人，正文却只写“由他确认”，又没有足以唯一确定“他”的依据。子任务没有因此自动违规，完整任务书的责任身份却只能保留**信息不足**。

反过来，有未知项也不必一律回答“信息不足”。论文保存的 EN20-007 案例中，已知费用的最低总和为 **6,400 欧元**，上限是 **6,000 欧元**。在其他费用非负、没有抵扣的原文前提下，不管未知费用是多少，至少已经超出 **400 欧元**。保存的模型对其中一项给出未决，计算结果给出越界；我们用附件的独立有理数脚本复核了这项下界。它核的是**已保存操作数和前提**，不是重新证明模型对原文的解释正确。

整批研究有 625 组任务、3,219 个节点、3,469 项计算。保存的最终整体结论与现行标注、与计算器汇总结论均为 625/625 一致；逐项仍有 **9 项差异、3 项未完成**。我们从公开仓库固定提交运行分类、六项数学见证和 EN20-007 九项复算，均通过。这里的 625/625 是这批**现行保存记录的一致性**，不是独立新任务的准确率，也不是全部 3,469 项的逐项全对。论文还指出，精确来源结构分组只有 518 组；625 个项目不等于 625 个独立来源。[统计口径与复核范围](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/paper/materials/analysis625/REPORT.zh-CN.md)值得与结论一起读。 [本轮公开复核记录](https://github.com/joinwell52-AI/joinwell52/blob/main/research/manual-runs/2026-11-14-boundaryxp/00-report.md)列出了固定版本、命令和结果。

## 把复核带进 AI 工作流，仍要守住最后一步

BoundaryXP 已提供 [MCP（模型上下文协议）接口](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/TOOLS.md)，让兼容的 AI 宿主读取工具说明、预览完整任务树、保存确认后的版本、提交一次模型分析，再读取正式结果。`bx_task_import` 只预览；`bx_project_create` 才保存；`bx_analysis_submit` 需要明确确认模型调用；`bx_result_recheck` 对**已保存的操作数**做零模型复算并保留旧结果。若最初把两个不同对象误认成同一个，重复计算不会自动修好这个语义错误。

[0.4.0-rc.6 发行记录](https://github.com/joinwell52-AI/BoundaryXP/releases/tag/mcp-v0.4.0-rc.6)报告 Windows x64 安装包发现 18 个工具、10 个资源；我们下载了该发行包，SHA-256 与发行说明一致，本轮没有重新完成 MCP 宿主中的模型分析。论文采用的协议 draft.2 与现有工作台运行附件的 draft.1 也仍有[已公开的实现差异](https://github.com/joinwell52-AI/BoundaryXP/blob/main/protocol/IMPLEMENTATION.md)。这些身份不能用一个“已发布”抹平。

更重要的是，边界分析的结果不是业务批准。它能指出计划中哪条约束打架、哪项证据还缺、哪次计算可复核；是否修改任务、是否真正执行，仍要由承担责任的人和宿主决定。接口中的业务决定与执行授权也保留为空。

下一次让多个 AI 分工时，可以先问四句：**它们说的是同一个对象吗？单项通过之后有没有检查合并结果？未知信息真会改变结论吗？谁能依据完整证据批准下一步？** 如果第一问还答不清，漂亮的任务树和精确的计算都不该让我们跳过澄清。
