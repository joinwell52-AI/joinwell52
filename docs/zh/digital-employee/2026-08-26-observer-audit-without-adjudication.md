---
title: "审计 Agent 为什么不能替团队签字？从 Anywhere Agents 到旁观式事实核查"
date: '2026-08-26'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "审计 Agent 怎样留下可追溯观察，却不夺走正式审查和验收的决定权？"
summary: "从“发现问题就自动驳回”的设计错误出发，区分观察写入、任务状态写入与正式签字；以 Anywhere Agents 和受限第一方 EVAL 路线说明边界。"
sources: "公开一手来源与访问受限的第一方证据范围均在正文列明。"
project_relevance: case-evidence
item_id: "EBR-20260826-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-26-observer-audit-without-adjudication-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-26-observer-audit-without-adjudication-cover.png"
  kicker="数字员工 · 工程研究"
  title="审计 Agent 为什么不能替团队签字？从 Anywhere Agents 到旁观式事实核查"
  summary="旁观审计可以留下深度证据，却不能改写生命周期或替正式审查作出验收决定。"
  version="EBR-20260826-02"
  status="工程研究 · 2026-08-26"
  languageHref="/en/digital-employee/2026-08-26-observer-audit-without-adjudication"
  languageLabel="English"
/>

# 审计 Agent 为什么不能替团队签字？从 Anywhere Agents 到旁观式事实核查

一份交付进入审查。审计 Agent 找到两个可疑点，系统随即把任务改成“驳回”。看上去省掉了等待人类的时间，实际上却把三件事混成了一件：它看见了什么、它依据什么规则判断、谁有权决定这份交付是否被接受。

这种设计会让一个原本只负责发现问题的组件，同时变成测量者和裁判。输入范围错了、规则版本旧了，或模型把普通差异当成风险，都会直接改变团队的正式结论。本文给出一个更可检查的分工：**审计 Agent 写下观察；审查角色读取观察并签字；任务状态只由受控的生命周期动作改变。** 读完后，你可以用一张三权检查表判断自己的风险扫描、评估或事实核查 Agent 有没有越权。

## 三种权力，不能共用一支笔

| 权力 | 应该做什么 | 不该做什么 |
| --- | --- | --- |
| 观察写入 | 保存发现、来源、规则版本与证据引用 | 把任务改为完成、驳回或关闭 |
| 生命周期写入 | 按受控动作迁移领取、执行、审查等状态 | 代替验收人判断内容是否合格 |
| 正式签字 | 基于任务要求和证据接受、退回或裁决 | 假装自己完成了执行事实 |

这里的关键不是“审计只读”。旁观审计往往需要写文件，才能把风险和证据留给后续审查。真正的边界是：它写的是一份**可被引用的观察**，不是 `approved`（接受）、`rejected`（驳回）或 `done`（完成）的替身。

## 一个公开实现怎样把观察留在旁边

[Anywhere Agents 的公开提交](https://github.com/yzhao062/anywhere-agents/commit/53bd8fa43c7339ae9958c03c55434fac7baddaf3) 处理过一个相近问题：样式守卫原本会把 Agent 正在创作的内容，与它只是搬运的需求提示和其他 Agent 的审查输出混在一起。该实现把“搬运文本”标为 Agent I/O scope（输入/输出作用域），并让样式审计保持提示性质：它不会进入审查提示、审查历史或最终裁决，也不会阻断审查循环。

本文借用的不是那一组具体统计数字，而是这个结构性选择：**旁观信息可以减少噪声、提供证据，却不能把自己变成控制命令。** 提交作者报告的会话样本、提示数量和审计过滤结果保留在来源说明，属于该项目的自报测量，并非本文独立复测。

| 来源报告的审计数据 | 数值 | 该数字不能说明什么 |
| --- | ---: | --- |
| 会话记录 | 34 | 所有 Agent 的普遍行为 |
| 提示型审计信息 | 2,227 | 审计准确率 |
| 历史发现 → 相关发现 | 359 → 2 | 其他项目可获得同样降噪效果 |

![一次审计过滤中的历史发现与相关发现](/assets/covers/2026-08-26-advisory-audit-filtering.svg)

*图 1：Anywhere Agents 作者报告的单次变更数据。359→2 的计算收缩比例为 99.4%，但它只描述该过滤流程，不是审计系统的总体准确率。来源：Anywhere Agents 提交 `53bd8fa43c73`，访问于 2026-08-26。*

## 输入端也不能给旁观者一张万能通行证

输出端不能越权裁决，输入端同样不能轻信标签。`agent-io` 这类路径标记可以帮助解释一段文本是创作还是搬运，却不能自动成为授权证据。Anywhere Agents 在真正的拒绝门禁里，会先解析符号链接，并只信任不包含仓库的临时根目录；否则，Agent 只要在真实仓库下创建一个同名目录，就可能伪装成“只是搬运”来绕过规则。

这正好把两端连成闭环：输入来源标签服务于解释和审计；受控权限决定真实写入；旁观发现只能交给签字者，不能自己改变结论。

## EVAL 看事实，REVIEW 签字

在 CodeFlowMu 的当前私有实现中，这条单向关系被拆得更明确：

```text
EVAL（评估）写观察与证据包
        ↓ 作为输入
REVIEW（正式审查）结合任务要求作接受、退回或裁决
        ↓
受控生命周期动作记录正式状态
```

已阅读的 EVAL 路线将观察与程序化证据包分开：证据包不是验收结论、不是管理批准，也不改变任务生命周期；观察要求评估编号和会话/运行来源。定向测试显示，含“批准、驳回、返工、暂停、关闭”等裁决动作的干预报告会被排除出 EVAL 评分；审查门只形成“需要注意”的观察，不形成关闭决定。

这支持一个受限结论：在已检查的路线中，EVAL 负责沉淀事实，REVIEW 才行使签字权。它不证明所有界面、插件或未来扩展都不存在绕过路径，也不保证审计模型永远正确。

## 我们的判断：观察应更深入，权力应更收敛

Anywhere Agents 把搬运文本的来源与作者创作区分开，并把审计放在不影响主循环的位置；这一点值得吸收。我们的判断是，来源可继续细化为 authored（创作）、carried（搬运）、observed（观察）与 generated（生成），并随工具调用和 Agent 交接传播，以帮助解释风险来自哪里；但它们不能单独成为写入放行依据。CodeFlowMu 的 EVAL 路线提供了相应的受限实现证据：观察和证据包可以很深入，`drives_lifecycle: false` 仍必须守住，正式接受只能由 REVIEW 与受控生命周期动作完成。

## 三秒自查

当一个审计 Agent 报出高风险时，逐项问：

1. 它写入的是观察工件，还是直接改了任务状态？
2. 观察是否带有来源、规则版本和证据引用，能被正式审查复看？
3. 谁能接受或退回交付？这个角色能否看见原始观察并写出采纳或不采纳的理由？

把审计彻底隔离，风险会消失在角落；让审计自动签字，又把不确定判断伪装成确定决定。可用的边界是：观察可见、可追溯、可讨论；签字仍由有权角色承担。

这也留下一个可与原作者讨论的问题：路径只能粗略声明“搬运文本”，是否应把 authored（创作）、carried（搬运）、observed（观察）、generated（生成）做成随工具调用和 Agent 交接传播的显式来源类型？无论答案是什么，这类标签都应服务审计解释，而不是单独成为放行依据。

### 主要来源

- [Anywhere Agents commit `53bd8fa`：Agent I/O scope 与提示型样式审计](https://github.com/yzhao062/anywhere-agents/commit/53bd8fa43c7339ae9958c03c55434fac7baddaf3)，访问于 2026-08-26。提交作者报告了 34 份会话记录、2,227 条提示及“359 条历史发现收缩为 2 条相关发现”的测量；本文未独立复测。
- CodeFlowMu 私有当前 EVAL 实现与定向测试；第一方、访问受限，仅支持本文所述路线的实现观察，不能代替独立审计。
