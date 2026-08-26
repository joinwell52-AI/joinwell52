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
---
schema: publication-candidate-article/v3
title: "审计 Agent 为什么不能替团队签字？从 Anywhere Agents 到旁观式事实核查"
date: '2026-08-26'
column: digital-employee
category: daily
article_type: engineering-case-study
edition: research-center
summary: "一条页面上的“等待验收”揭开了旁观审计越权：检查员为什么不能进入签字链，以及我们怎样让重复操作只留下记录、不改变任务。"
sources: "research/2026-08-26-execution-boundary-record-study/38-four-case-data-book.md"
project_relevance: first-party-engineering-case
status: content-candidate-v3
cover: "./2026-08-26-observer-audit-without-adjudication-cover-v2.png"
---

# 审计 Agent 为什么不能替团队签字？从 Anywhere Agents 到旁观式事实核查

我们在待办列表里看到过一条“等待 PM 验收”。点进去，却不是一份开发报告，也不是一项需要负责人决定是否交付的改动，而是一份事实核查报告。

**CodeFlowMu** 是我们在开发的一个本地运行的多 Agent 协作系统。

它本来只应该说：“这里有矛盾，请来看。”但页面把它放进了“等待验收”里。看似只是标签用错，实际上相当于给一个检查员递了一枚签字章：下一次点击 approve 或 reject，究竟是在保存观察，还是在改变任务状态？

这不是咬文嚼字。多 Agent 团队里，能发现问题的角色很多；有权决定“这个工作算不算交付”的角色应该很少。若两类角色在页面和接口里混在一起，系统会在没人明确授权的情况下，把观察变成业务决定。

## 先把“看见”和“签字”拆开

这套系统里有两类不同的“审查工作”。第一类是**事实核查角色**，内部简称 `EVAL`：它读证据、发现矛盾、写观察，不负责决定任务通过，也不负责把任务退回。

第二类是**正式验收审查**，内部简称 `REVIEW`：它由有权角色签字，针对一份明确报告作出接受或拒绝，因此会改变交付链的下一步。

旧页面把两者放在同一个“待验收”入口，等于模糊了三个动作：

| 动作 | 应该由谁做 | 是否改变任务状态 |
| --- | --- | --- |
| 发现一处事实矛盾 | EVAL 检查员 | 否，只补观察与证据 |
| 提醒负责人处理风险 | EVAL 或系统服务 | 否，只形成待关注信息 |
| 接受或拒绝一次交付 | 有权的 PM / ADMIN / 正式 REVIEW | 是，按正式流程留下决定 |

这张表看起来常识，但系统如果没有把它写进接口和数据结构，常识不会自动发生。

## 我们怎样修：同一份观察只能被记录一次

修复不是把页面上的“验收”两个字删掉，而是让 EVAL 从数据层开始不再拥有验收语义：它的状态改为“观察已记录”，不适用正式接受（acceptance）动作。

最能检验这条边界的不是第一次提交，而是重复操作。用户或者客户端可能重复点击“批准”（approve）；网络也可能重试同一个请求。对正式 REVIEW，这些情况需要按批准合同处理；对 EVAL，正确结果是系统回答：“这份观察已经记录，不产生新动作。”

修复后的 API 把这个结果记为 `no_change / already_observed`。更重要的是，任务文件不变：没有新的业务决定，没有生命周期迁移，也没有把检查员变成审批人。

| 检查 | 结果 | 回答的问题 |
| --- | ---: | --- |
| 核心治理规则 | 8 / 8 通过 | EVAL 不再被赋予验收语义 |
| 页面状态规则 | 6 / 6 通过 | 徽标与历史冲突分支可正确显示 |
| 重复 EVAL 操作 | 109 / 109 通过 | 重复 approve 只返回已记录，不改任务文件 |
| 收口检查 | 18 / 18 通过 | EVAL 不接管根任务或普通子任务的验收 |

这些数字不能证明所有未来页面都不会误连权限；它们说明这次被发现的入口，已经被明确写成可重复验证的规则。

## 一个被放弃的方案，比“通过”更说明问题

修复之后，团队还碰到过一个很诱人的做法：除了少数明确坏情况以外，Runtime 一律 `default allow`（默认允许）。乍看之下，这似乎是在避免 Runtime 做裁决。

ADMIN 在实现前叫停了它。理由是：只要运行时输出“允许”，它仍然在替业务说“可以继续”。这不是中立服务，只是换了一个更积极的裁决词。

因此，`RAIL-NON-ADJUDICATION-20260822-002` 被标记为 BLOCKED，且没有修改产品代码。这个结果不是失败；恰好相反，它说明系统的边界在进入代码之前就被审出来了。

后来保留下来的做法更克制：Runtime 可以把事实、风险和建议递给负责人；对于身份不一致、根任务关闭、明确授权缺失等可机械核对的问题，拒绝当前动作；至于“方案够不够好”“这份报告该不该收”，仍由有权角色决定。

## 后来看到 Anywhere Agents，我们知道这不是孤例

[Anywhere Agents 的提交 `53bd8fa`](https://github.com/yzhao062/anywhere-agents/commit/53bd8fa43c7339ae9958c03c55434fac7baddaf3) 也把建议式审计隔在 reviewer 的 prompt、历史和正式结论之外。它面对的工程不同，却给出了相同的分工：审计帮助人理解事实，不替人签字。

这篇文章不把它关于 `authored / carried / observed / generated` 的文本来源标签说成 CodeFlowMu 已有功能。我们目前没有可证明的端到端来源传播链；路径或文件名更不能被拿来作为授权凭据。我们能够诚实主张的，只是这条已被修复和测试的行为：旁观报告不会通过重复操作改写任务生命周期。

## 结尾：把“待处理”问明白

产品里每一条“待处理”都该能回答一个简单问题：它是在提醒某个人注意，还是已经获得了改变交付结论的权力？

若答案说不清，审计 Agent 很容易从检查员变成隐形审批人。多 Agent 协作里，最危险的未必是模型看错一条信息；更可能是系统在无人授权时，悄悄把“我看过了”升级成“团队已批准”。

### 来源与证据边界

- [Anywhere Agents commit `53bd8fa`](https://github.com/yzhao062/anywhere-agents/commit/53bd8fa43c7339ae9958c03c55434fac7baddaf3)，2026-08-26 复核。本文引用其建议式审计不进入正式结论的设计，不将其文本来源标签视为 CodeFlowMu 既有能力。
- CodeFlowMu 私有证据包：`V1.9.4-EVAL-OBSERVED-SEMANTICS-20260818-001`、`RAIL-NON-ADJUDICATION-20260822-002`、`RAIL-SERVICE-BARRIERS-20260822-001`。本文数据仅覆盖各包指定验证集。
- 数据口径与原始路径见 `D:/TMPA/research/2026-08-26-execution-boundary-record-study/38-four-case-data-book.md`。
