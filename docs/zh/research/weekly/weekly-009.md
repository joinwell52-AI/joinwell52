---
title: Weekly 009 — “完成”必须带类型：一个绿灯不能关闭整个系统
date: '2026-09-13'
column: digital-employee
category: weekly
article_type: research-brief
edition: research-center
research_question: '当 Agent 系统报告“完成”“已恢复”“已验证”或“已审计”时，怎样判断这个终态究竟关闭了哪一种不确定性，又有哪些状态仍然必须独立保持开放？'
summary: '9 月 7 日至 13 日的 14 篇已发布 Daily Research 从治理、记忆迁移、工具执行、复核、恢复与审计覆盖反复指出同一问题：一个局部终态不能自动扩大为全局终态。本期提出 Typed Closure：分别证明 State、Authority、Effect 与 Coverage 的关闭条件，并把 Unknown 保留为合法状态。'
sources:
  - 2026-09-07 through 2026-09-13 Daily Runtime V5 evidence-validated publications
  - research/intelligence/p2-runs/2026/09/2026-09-13-p2-special.json
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
cover: '/assets/covers/weekly-009-typed-closure-cover.svg'
---

<ArticleCover
  image="/assets/covers/weekly-009-typed-closure-cover.svg"
  kicker="Weekly Research · 009"
  title="“完成”必须带类型：一个绿灯不能关闭整个系统"
  summary="状态、权限、外部效果与覆盖范围，需要各自的终态证据。"
  version="W009"
  status="Published 2026-09-13"
  languageHref="/en/research/weekly/weekly-009"
  languageLabel="English"
/>

# Weekly 009 — “完成”必须带类型：一个绿灯不能关闭整个系统

一个 Agent 恢复到了旧检查点，能不能说“恢复完成”？一个审计流程走到了终态，能不能说“覆盖充分”？一份报告通过了生成与检查，能不能说“结论已经被挑战过”？一个工具调用返回成功，能不能说“外部效果已经得到证明”？

本周的 Daily Research 从完全不同的对象反复给出同一种答案：**不能只看那个最醒目的绿色状态。**

9 月 7 日至 13 日，Research Center 发布了 14 篇 Daily Research。研究对象包括多智能体治理、记忆迁移、团队协同、跨界副作用、工具执行证据、独立复核、程序与授权、持久状态、检查点恢复和大规模审计。它们并不是同一个问题的改写，却不断暴露同一种结构性错误：

> **系统把一种已经关闭的不确定性，误当成所有相关不确定性都已经关闭。**

因此，本期把上一周的 Authority Relation 再向前推进一步：不仅 Authority 不能被压缩成对象属性，**Completion 也不能被压缩成一个无类型的布尔值。** 更可靠的运行时需要知道：究竟是哪一种事实已经收口，哪一种仍然未知。

## 本周证据范围：七个日期窗口，六个已发布日，十四篇正式研究

本次综合检查 **2026-09-07 至 2026-09-13** 的 Daily Runtime 证据。9 月 7、8、9、10、12、13 日的 Publication 均有持久化 `Completed` 结果，共发布 **14 篇** Research Center 研究；9 月 11 日虽然 Discovery、Queue、Reading、Analysis 和 Production 已完成，但 Publication 在当前权威记录里仍是 `Running`，因此本期没有把当天未完成发布的候选当作已发布证据使用。

| 日期 | 已发布研究 | 本周可复用边界 |
|---|---|---|
| 9/7 | Local Safety Does Not Close the Path；Visibility Is Not Enforcement；Project Truth Survives Context | 局部安全、可见性与上下文连续性都不能替代端到端执行闭环 |
| 9/8 | Memory Must Be Readmitted；Role Match Is Not Team Fit；One Effect Across Surfaces | 数据存在、角色匹配与界面一致，都需要独立的语义/协作/效果证据 |
| 9/9 | Tool Edge Needs Execution Evidence；Finished Report Needs Challenge Evidence | 工具边界需要发生证据；报告完成不等于独立挑战完成 |
| 9/10 | Second Model Is Not Independent Control；Proposed Procedure Is Not Active Authority | 多一次模型调用不自动产生独立性；程序存在不等于已经获得生效权限 |
| 9/11 | 本期不计入已发布证据 | Publication 尚未在权威 Runtime 中收口 |
| 9/12 | Evidence Complete Is Not Execution Authority；Retained State Needs Current Authority | 证据齐全与状态保留仍不能替代当前执行授权 |
| 9/13 | State Rewound, Effect Did Not；Audit Completion Is Not Coverage Assurance | 本地状态回退不会撤销外部效果；审计终态不会自动证明覆盖充分 |

这一处 9 月 11 日的缺口反而说明了本期主题本身：我们不能因为“一周已经过去”就把一个未收口的 Publication 状态改写成完成；证据窗口也必须保留自己的边界。

## 一个“Completed”究竟关闭了什么？

传统软件喜欢把复杂过程压缩成几个终态：`success`、`failed`、`done`。在确定性、封闭边界内，这通常足够，因为程序知道自己观察了什么，也知道副作用发生在哪里。

Agent 系统不同。一次任务可能同时跨越模型上下文、文件系统、远端 API、审批链、记忆库、审计集合和人类责任边界。一个模块到达终态，只能证明它负责的那类事实满足了终态条件。

本周的研究可以整理成四种最容易被混淆的 Closure：

```text
State Closure
Authority Closure
Effect Closure
Coverage Closure
```

它们彼此相关，但不能互相代替。

## State Closure：状态已经稳定，不代表状态有资格继续生效

9 月 8 日的《记忆还在，不等于还能继承》给出了一个清晰反例：旧记忆文件可以完整、格式可以解析、向量维度甚至可以保持一致，但模型、写入器、读取器或嵌入模型变化后，原有语义合同仍可能失效。

因此，“数据还在”只是一种 State Closure。要让旧记忆成为新环境中的权威记忆，还需要语义兼容证据、可恢复条件和独立激活授权。

9 月 12 日的 Retained State 研究进一步把这条边界扩展到长期运行状态：**持久化解决的是连续性，不是当前权限。** 状态可以跨重启存在，但当前 Policy、Target、Principal 或 Occurrence 变化后，旧状态仍需要重新判断它是否可以驱动新的动作。

这意味着运行时不能只维护：

```text
state = restored
```

还需要知道：

```text
state_integrity = closed
semantic_compatibility = ?
authority = ?
```

问号不是错误，它是系统尚未取得的事实。

## Authority Closure：程序存在、模型赞同、证据齐全，都不是生效权限

9 月 10 日的两篇研究从两个方向说明这个问题。

一篇讨论“第二个模型为什么不等于独立控制”。如果第二个模型消费相同的叙述、共享相似信息路径，或者没有独立责任边界，那么多一次模型调用只能增加一次判断，不能自动升级成独立监督。

另一篇讨论“提出了一套程序为什么不等于程序已经获得 Authority”。程序、政策或建议可以写得非常完整；真正生效仍需要明确谁有权采用、它作用于哪些对象、何时激活，以及当前 Policy Epoch 是否承认它。

9 月 12 日的《证据齐全，不等于获得执行权》又给出第三种形式：即使证据包本身完整，也不能从“证据已经够了”直接跳到“动作可以执行”。证据支持决定；它不是决定本身。

因此 Authority Closure 回答的是一个非常窄的问题：

> 当前这个 Principal，是否被允许在当前 Policy 与当前 Occurrence 下，对这个 Target 执行这个 Action？

这与报告是否完成、程序是否存在、模型是否同意都不是同一个状态。

## Effect Closure：内部状态回去了，外部世界可能没有

9 月 13 日的《状态回去了，外部效果没有》把最危险的一类错觉暴露出来。

对齐检查点可以让模型上下文与受控工作区回到同一历史位置。这个机制对恢复非常有价值，但网络请求、远端数据库写入、消息、支付或已经消耗的资源可能早已越过本地检查点边界。

于是出现一种表面非常整洁、实际上非常危险的状态：

```text
local_state = before_call
remote_effect = already_happened
```

如果 Runtime 只看 State Closure，它会把第二次调用误认为第一次执行。安全恢复必须另外证明 Effect Closure：原效果不存在、已经存在且可接受、已被验证补偿、不可逆，或者仍然未知。

因此，外部效果最好拥有独立账本：Occurrence ID、Target、请求身份、幂等键、远端回执、补偿身份、当前权威读取。**响应缺失不能被解释成效果不存在；回滚本地文件也不能被解释成远端事实被撤销。**

## Coverage Closure：审计跑完了，不代表审计看完了

9 月 13 日另一篇研究《审计完成，不等于覆盖充分》处理的是完全不同的系统，却出现同样结构。

审计任务可以无报错结束，也可以在既定范围内找到真实事件；但如果一组相关数据从一开始就没有进入搜索范围，`Completed` 只能证明既定流程完成，不能证明证据宇宙已经充分覆盖。

Coverage Closure 至少需要自己的耐久事实：数据源和时间边界、搜索漏斗、阶段计数、已知阳性找回、被拒样本、不可读项、语义复核者身份以及独立复核实际完成了什么。

这一点也解释了 9 月 9 日《Finished Report Needs Challenge Evidence》的核心边界：一份报告结束写作，只能证明 Report State Closure；它有没有经历有效的反方检验、替代解释与独立挑战，是另一种 Evidence/Coverage 状态。

因此，审计系统最诚实的输出有时不是：

```text
coverage = complete
```

而是：

```text
execution = completed
coverage = bounded
residual_unknown = explicit
```

## 为什么一个总状态会制造“语义升级”

把这四种 Closure 压成一个 `done=true`，会导致三个常见错误。

第一，**范围扩大**。模块证明了局部边界，却被上层理解成全系统边界。例如局部安全检查通过，被解释成整个执行路径安全。

第二，**责任漂移**。原本应该由 Authority Owner、Effect Reconciler 或 Audit Reviewer 作出的决定，被一个只负责生成状态的模块顺手替代。

第三，**未知被擦除**。系统无法区分“已经证明没有问题”和“我们没有观察到问题”，也无法区分“动作没有发生”和“动作是否发生未知”。

Agent Runtime 真正需要的不是更多绿色图标，而是让绿色图标明确说明自己代表哪种事实。

## 一个可实现的 Typed Closure Envelope

本周证据支持一个简单但实用的工程抽象：为重要任务保存一个 **Typed Closure Envelope**，而不是单一终态。

```text
TypedClosure {
  state:     Open | Closed | Unknown
  authority: Open | Closed | Unknown
  effect:    Open | Closed | Unknown
  coverage:  Open | Closed | Bounded | Unknown

  evidence_refs[]
  policy_epoch
  occurrence_id
  updated_at
}
```

这里的 `Closed` 不是由同一个程序统一产生。不同维度应该由能完整观察对应事实、并承担相应责任的机制关闭：

- State 由状态持久化与一致性检查证明；
- Authority 由当前授权边界和责任主体决定；
- Effect 由目标系统的权威证据或受治理补偿证明；
- Coverage 由范围、漏斗、抽样、已知阳性与独立复核证据支持。

如果任务只需要其中两类 Closure，就不必人为增加另外两类；关键不是四个字段必须无处不在，而是**不能把已有的一类终态偷偷解释成另一类终态。**

## “Unknown”必须能长期存在

Agent 系统经常把 Unknown 当成异常路径，希望尽快压成 True 或 False。本周的恢复与审计研究都说明，这种冲动可能直接制造事故。

外部调用超时后，我们可能不知道副作用有没有发生；审计漏斗结束后，我们可能不知道未搜索数据中还有多少相关事件；模型升级后，我们可能不知道旧记忆在新语义空间是否仍然等价。

这些状态如果没有足够证据，就应该继续保持 Unknown。它可以触发补查、人工裁决、限定运行范围或失败关闭；但不能因为流程需要一个布尔值，就被猜成“没有发生”或“已经安全”。

**保留 Unknown 本身就是治理能力。**

## P2 本周没有制造新的专项研究

P2 本周检查了 4 个到期的 `biweekly-or-release` 对象：agent-audit、Aegis、agent-style 与 cs-paper-checklist。四个对象的 main / release 身份均与 9 月 6 日检查点一致，全部以 `No Material Change` 收口；2 个 monthly 对象已在 9 月 6 日完成本月完整复查，因此本周不到期。

本轮 **4/4 到期对象完成检查，0 个达到 5 分触发阈值，0 个完整专项研究启动。** 这不是“没有产出”，而是检查点机制发挥了作用：没有新的一手变化，就不重复制造研究。

## 下一步真正值得验证的不是更多状态，而是状态之间的转换合同

Typed Closure 仍然只是本周综合得到的工程抽象，不是已经被通用验证的标准。下一步更重要的是研究状态之间如何转换：

- State Closed 之后，哪些变化必须使 Authority 重新打开？
- Effect Unknown 多久以后必须升级为人工处理，而不是继续自动重试？
- Coverage Bounded 在什么风险等级下足以支持业务决定？
- 新数据源加入后，旧的 Coverage Closure 是否自动失效？
- 独立复核需要怎样的信息隔离与责任分离，才能真正改变 Evidence Closure？
- 当多个 Agent 分别关闭不同维度时，谁负责确认它们属于同一个 Occurrence？

如果这些转换合同没有被明确表达，Typed Closure 最终仍会退化成多个漂亮的标签。

本周最重要的变化不是又多了一个状态模型，而是把一个经常被忽略的事实说清楚：

> **“完成”只有在说明完成了什么时才有意义。**

一个系统可以已经恢复状态、尚未恢复权限；可以完成审计、尚未完成覆盖保证；可以完成报告、尚未完成独立挑战；可以回到旧检查点、却无法撤回外部效果。

当这些事实被分开记录时，Agent 才不会因为一个局部绿灯，就误以为整个世界都已经关闭。

## 证据入口

- [9/7：看见违规，也不等于能制止](/zh/industry/2026-09-07-visibility-is-not-enforcement)
- [9/8：记忆还在，不等于还能继承](/zh/digital-employee/2026-09-08-memory-must-be-readmitted)
- [9/9：工具边界需要执行证据](/zh/digital-employee/2026-09-09-tool-edge-needs-execution-evidence)
- [9/10：第二个模型不等于独立控制](/zh/digital-employee/2026-09-10-second-model-not-independent-control)
- [9/12：证据齐全不等于执行权限](/zh/digital-employee/2026-09-12-evidence-complete-not-execution-authority)
- [9/13：状态回去了，外部效果没有](/zh/digital-employee/2026-09-13-state-rewound-effect-did-not)
- [9/13：审计完成，不等于覆盖充分](/zh/industry/2026-09-13-audit-completion-not-coverage-assurance)
- P2 检查记录：`research/intelligence/p2-runs/2026/09/2026-09-13-p2-special.json`
