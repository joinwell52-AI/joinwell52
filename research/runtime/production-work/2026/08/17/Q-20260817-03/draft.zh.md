---
schema: publication-candidate-article/v2
title: "紧凑运维界面不应压缩掉执行证据"
date: '2026-08-17'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "Agent Runtime 如何在降低运维界面命令噪声的同时，不破坏检查与重放所需的详细执行证据？"
summary: "运维压缩应是富证据 Transcript 之上的有界、可重放展示变换。常规成功活动可以聚合，但失败、交互和活动边界应保持可见，底层命令与输出仍需可恢复；正式审计还需要独立的持久性、来源、防篡改与外部效果合同。"
cover: research/runtime/production-work/2026/08/17/Q-20260817-03/baseline-cover.png
sources:
  - research/analysis/Q-20260817-03-presentation-transcript-separation.md
---

![紧凑运维界面不应压缩掉执行证据题图](research/runtime/production-work/2026/08/17/Q-20260817-03/baseline-cover.png)

# 紧凑运维界面不应压缩掉执行证据

把每一条命令完整显示在运维界面上，看似最透明，实际可能让失败、审批和关键决策淹没在重复输出中。把多条命令合并成一句摘要可以改善可读性，但如果合并过程删除了唯一的详细记录，界面变得更清爽的同时，系统也失去了检查与重放依据。

2026-08-17 的 Research Object 检查了一项已合并的 Codex TUI 变更。实现只聚合成功的 Agent 与 UnifiedExecStartup 命令活动；失败、不可分组事件和交互可见边界会刷新分组，一个完成组最多包含 32 个调用。显示层可以呈现 `Ran N commands` 之类的摘要，而 `transcript_lines` 仍保留每条原始命令及输出。Replay 使用相同分组原则，测试避免重复的 Command Start，重叠活动也不会被过早折叠。

这项机制支持一条比“多显示”或“少显示”更有用的工程判断：**展示模型可以压缩，证据模型不应因此被破坏性改写。**

## 可读性与证据保留是两条独立轴

Operational UI 面向的是当下注意力。它需要突出异常、等待输入和状态变化，而不是把每一次例行成功都放在相同视觉权重上。Transcript 面向的是事后检查：命令顺序、输出细节和事件身份需要可定位。两者服务的读者任务不同，不必共享同一种展开程度。

最安全的压缩方式，是让 Compact View 成为保留事件之上的派生表示。用户可以在主视图中看到有界摘要，需要调查时再访问未压缩细节。删除策略若确实必要，应由风险、保留期和数据治理合同决定，而不应成为 UI 折叠操作的隐含副作用。

这种分离还改善了失败分析。摘要可以告诉 Operator 一批例行命令已经完成，但原始 Evidence 仍能回答具体执行了什么、顺序如何、哪一条输出异常。界面密度降低，并不要求证据粒度同步降低。

## 有些边界不应该被成功摘要吞没

所选实现把失败、不可分组活动与交互可见事件作为 Flush Boundary。这是一项重要的注意力规则：例行成功可以合并，改变控制流或需要人类判断的事件应重新获得独立可见性。

重叠的活动命令也不应在尚未结束时被过早归入完成摘要。否则 Operator 可能把仍在运行的工作误认为已收口。固定的 32-call 上限则限制一个摘要最多遮蔽多少活动，使压缩不会无限扩大。

生产系统还可以把审批、Elicitation、权限变化、重试策略切换和外部效果确认列为抗压缩边界。哪些事件必须突出，应由运维风险决定；核心原则是摘要不能跨越会改变解释或责任的边界。

## Replay 需要版本化展示规则

如果实时界面与 Replay 对同一组事件应用不同规则，历史视图可能改变命令计数、顺序感或事件身份。所选证据表明 Replay 会应用同样的分组原则并避免重复起始事件，这支持可重建展示，但还没有建立长期版本兼容。

更稳健的事件模型应保存稳定 Event Identity 与顺序，把 Transformation Version 作为展示合同的一部分。未来 UI 可以选择新样式，但在需要复现历史语义时，应知道当时采用了哪套分组边界。机器可读的未压缩导出也能让事件分析和独立工具不依赖终端文本布局。

## Transcript 不是自动生成的审计日志

保留逐命令细节提高了 Inspectability，却不会自动建立 Formal Auditability。当前证据没有证明 Transcript 是 Append-only、具备密码学防篡改、持久保存到独立存储，或能完整记录命令之外的外部效果。

命令文本和 stdout 也可能不完整：输出会被截断或脱敏，远端系统可能执行了无法由终端内容证明的状态变化。正式 Audit Surface 还需要 Durable Event Identity、Provenance、Retention、Tamper Evidence，以及针对付款、部署、消息发送等外部结果的独立 Effect Record。

对低风险交互 Session，无限保留所有输出未必合理；保留期可以按风险分层。完整结构化 Event Log 也可能同时服务展示与审计，但只有在它的持久化、兼容与防篡改合同足够强时才成立。

因此，三层承诺应保持分开：Presentation Layer 承诺可读和突出关键边界；Evidence Layer 承诺详细事件可恢复、可定位、可重放；Audit Layer 承诺更强的来源、完整性与外部效果证据。紧凑界面可以建立在丰富证据之上，但不能用一行摘要冒充那份证据，更不能把普通 Transcript 直接命名为审计账本。
