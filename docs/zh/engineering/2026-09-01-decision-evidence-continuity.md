---
title: "事实核查、诊断和 EVAL 都有了，为什么中断接管仍缺最后一环？"
date: "2026-09-01"
updated: "2026-09-02"
column: open-source-engineering
category: daily
article_type: comparative-engineering-analysis
research_question: "中断后的同 TASK 接管，怎样关联当前授权、事实核查、诊断与 EVAL 旁观，而不让任何观察组件越权？"
evidence_status: "Research complete; contract frozen; implementation and independent QA not claimed"
publication_authorized: true
edition: research-center
summary: "57 项既有测试支持四段能力正确隔离，却不证明接管证据链已经打通。研究用稳定 case 身份连接原 attempt、效果事实、当前授权与处置，保留旁观引用和原文权限边界。"
sources: "/zh/research/evidence/2026-09-01-interruption-research"
project_relevance: substantive-relationship
item_id: "RIR-20260901-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-01-decision-evidence-continuity-cover.png"
citation_status: "Completed"
editing_status: "Completed"
---

<ArticleCover
  image="/assets/covers/daily-2026-09-01-decision-evidence-continuity-cover.png"
  kicker="中断接管研究 · 02"
  title="事实核查、诊断和 EVAL 都有了，接管还缺什么？"
  summary="57 项既有测试支持四段能力正确隔离，却不证明接管证据链已经打通。研究用稳定 case 身份连接原 attempt、效果事实、当前授权与处置，保留旁观引用和原文权限边界。"
  version="RIR-20260901-02"
  status="工程研究 · 合同已冻结"
  languageHref="/en/engineering/2026-09-01-decision-evidence-continuity"
  languageLabel="English"
/>

# 事实核查、诊断和 EVAL 都有了，为什么中断接管仍缺最后一环？

一个 Runtime 中断后的任务，看上去已经不缺信息：有 TASK 文件，有 Session/lease 记录，有事实核查，有诊断面板，还有 EVAL 的旁观报告。

但当另一个 Agent 准备接管同一 TASK 时，仍可能回答不了一句简单的问题：**它凭哪一份当前决定获得这次处置资格？**

把所有日志都放进一个页面，不会自动得到授权；让 EVAL 写出一份很完整的观察报告，也不应让它取得调度权。真正缺少的不是更多报告，而是一条受限的决定证据链：它把中断 attempt、效果事实、当前授权和 successor Session 串起来，同时让事实核查、诊断与 EVAL 保持各自边界。

CodeFlowMu 是我们开发的本地多 Agent 协作 Runtime，以 FCoP 的 TASK、REPORT 和五桶生命周期组织工程工作。本文固定在 V2.1.2 提交 `919c3b48` 检查真实模块和测试。数据属于该固定基线；后续接管合同已经冻结。本文讨论合同要求的连接，不宣称已经实现、通过独立 QA 或发布。

## 1. 两个外部提醒：可查证不等于可继续

[OpenAI Codex](https://github.com/openai/codex) 是 OpenAI 维护的开源编程 Agent；其 [#41936](https://github.com/openai/codex/pull/41936) 为 Guardian 的失败审查保留受限大小的诊断证据。它的意义不在于“失败日志越多越好”，而在于失败的判断也需要可查询、可界定边界的记录。

[Paperclip](https://github.com/paperclipai/paperclip) 是开源多 Agent 团队管理平台；其 [#12616](https://github.com/paperclipai/paperclip/pull/12616) 已于 2026-09-01 合入，仍是默认关闭的实验性设计，尝试把 native run 与 company、issue、run、coordinator、receipt、幂等和 result fencing 关联起来。它提出 run 归属和回执绑定值得研究，但“合入且默认关闭”不等于已经普遍启用，更不能把该实验性 runner 设计直接移植为 CodeFlowMu 的恢复架构。

两者共同提出一个问题：恢复后的动作应该能说明自己的决定来源，但**旧决定的存在不等于新动作仍然获准**。

## 2. CodeFlowMu 已有四段正确隔离的能力

我们针对技术接管、事实核查、EVAL 和证据关联执行了 57 项相关测试，结果为 `57 pass / 0 fail / 0 skipped`。这不是一个“可靠性总分”；测试集合分属不同层，每一层只证明自己的职责。

| 层 | 当前已证明的能力 | 它刻意不做的事 |
| --- | --- | --- |
| 技术接管 | `recoverTaskExecution` 检查 `technical_recover` 治理快照、revision 二次校验、recovery fence；发现 live Session 或修订变化会在 wake 前停止 | 不根据日志猜测效果已发生，也不把历史授权自动升级为重执行许可 |
| 事实核查 | `FactCheckDecisionService` 由 PM/ADMIN 对 REVIEW 写入具理由、幂等的决定；硬性身份、授权、完整性违规不能被 exception 覆盖 | 不直接移动 TASK/ISSUE/五桶位置，也不自动 wake Agent |
| EVAL | 生成内部 observation/evidence bundle；测试确认不创建 TASK、不移动 lifecycle，且 `drives_lifecycle=false` | 不做业务裁决，不成为授权来源 |
| 证据关联 | 用稳定键关联 task、attempt、action、report、review；诊断缓存可重建且不改 lifecycle 事实 | 不因为关联成功就允许执行 |

这种隔离不是缺陷。FCoP 的事实核查应回答“证据和合同是否成立”；EVAL 应旁观、发现缺口；诊断应解释关联冲突；最终业务决定仍归 PM/ADMIN，技术 wake 仍归 Runtime。

另一组受控探针提供了更具体的对照：注入 Session context 的授权 receipt marker 没有进入持久记录，拒绝仍被记录为 `OPERATION_BOUNDARY_DENIED`；含 8192 字节合成尾部的错误 marker 留在内部终态事件，而 Web Panel、Activity API、Analytics 三类投影都不返回该原文，仍保留 failure code 和 status。前者暴露普通 Session 的引用断点，后者说明普通消费者边界已存在，不能把两者统称为“没有审计”。这些是另一个测试集合，不能与 57 项相加；转录与原 fixture 见[证据说明](/zh/research/evidence/2026-09-01-interruption-research)。

## 3. 断点在于：四段能力没有同一个中断 case

技术接管路径当前读取治理快照、attempt/lease、revision 和 wake 条件。它尚未形成一条能够稳定引用当前授权、事实核查结果以及相关旁观证据的接管记录。这里缺的不是让 EVAL 或诊断参与调度，而是让一次接管能够在需要时引用这些材料，同时保持它们原有的只读边界。

于是系统能给出许多局部正确答案：

- 旧 Session 是否仍活？
- 当前生命周期是否允许 technical recovery？
- 某份 REVIEW 是否被 PM/ADMIN 作过决定？
- EVAL 是否发现报告或证据缺口？
- task/attempt/report/review 是否通过稳定键关联？

却难以为一次接管提供一条完整的、可回溯的说明：

```text
原 TASK（原桶位）
  → 中断 attempt 与旧 lease
  → 已核验的效果事实 + 当前授权
  → 当前 revision 下的接管决定（按需引用事实核查/诊断）
  → successor Session 或“仅对账 / 待核对”
  → EVAL 旁观与受限查询
```

这不是“报告不够详细”，也不是 `task_id` 不稳定。**这是同一次中断接管还缺少稳定的 case identity 和引用链。**同一个 TASK 需要有一个可引用的 interruption case，才能保证前后记录说的是同一次中断、同一轮任务和同一个 successor。

## 4. 接管记录应该引用什么，又绝不能授权什么

CodeFlowMu 已有可复用的合同形状。`TaskScopeGrant` 和 `TaskCommandReceipt` 包含 `task_id`、`root_task_id`、`thread_key`、`round_id`、`expected_revision`、`authorization_ref`、幂等键和有效期。这些字段适合表达“当前技术授权的边界”，不等于具体外部动作的批准。源码对齐进一步区分：`TaskScopeGrant` 约束 successor/wake 范围；具体受控动作仍由 `OperationApprovalService` 或冻结范围内等价执行器在真正 tool-call 边界核验授权，不能提前消费。但本轮没有发现普通 Session 接管已消费这一完整形状，因此不能把字段存在写成已完成的连续性。

三个概念必须分开：

```text
historical receipt
→ 证明原执行为何发生

current authority
→ 证明当前 revision/round 下是否允许重新执行

interruption case / admission record
→ 记录这次接管使用了哪些事实、决定和证据
```

冻结合同不是复制一套新授权系统，而是让每次中断接管生成或引用一个独立、不可变身份的 case。以下是阅读用摘要，不是完整 schema：

```text
interruption_case
  = case_id + task_id + interrupted_task_revision
  + interrupted_attempt_id + prior owner/lease identity + interrupted_at

case references
  = evaluated_task_revision + current_authority_ref + effect_fact_ref
  + admission_result + disposition|null
  + decision_revision + supersedes_revision? + decided_at
  + fact_check_ref? + diagnosis_ref? + eval_observation_ref?
  + successor_session_id?
```

源码对齐已明确两套 lease：`SessionLeaseStore` 使用 owner Session 和 TTL，并没有稳定 `lease_id`；`DispatchAttemptStore.ExecutionLease` 才有独立 lease ID。case 不得假设二者是同一字段。没有生成某类旁观材料时，也不应为了填满 case 而额外制造它；可选引用只在实际参与该 case 时记录。

这份 case 要表达四个限制：

1. **历史 receipt 只说明来处。** 它可以说明原 TASK 原本为何开始，但不能自动授权现在的外部动作。
2. **当前 authority 是 `reexecute` 的必要条件之一，不是充分条件。** 它必须绑定当前 revision/round；还必须有已核验的“效果未发生”事实以及有效的 successor ownership。若效果已确认或仍未知，接管 case 不应产生重执行许可。
3. **旁观材料只有引用权，没有执行权。** EVAL、诊断和事实核查提供 `ref`、摘要、digest、状态和 reason code，而不是 wake/dispatch 能力。
4. **原文留在受限边界内。** 超大上下文、私有 EVAL 正文和原始诊断文本不进入普通关联输出；需要查询时沿现有权限路径读取。

这也是“决定证据连续性”的准确含义：不是让一个 receipt 取代业务判断，而是让每个新的判断能够追溯到它使用的事实与当前授权。

![事实核查、诊断和 EVAL 都有了，接管还缺什么？](/assets/figures/2026-09-01-decision-evidence-continuity.zh.png)

*图 1：决定证据引用关系。历史 receipt 说明来处，当前授权与效果事实支持准入判断；事实核查、诊断、EVAL 只在有关时提供引用，不获得调度权。来源：RUN-004 的 57 项既有测试与冻结合同；虚线表示可选引用，不是执行指令。*

[点击查看高清图](/assets/figures/2026-09-01-decision-evidence-continuity.zh.png)

## 5. 两个研究必须分开，最终只做一次联合验收

中断恢复准入研究问“原动作事实是什么”；本篇问“这个事实和接管决定如何被正确归属”。把它们合成一个“恢复功能测试”会掩盖两种不同错误：系统可能知道效果已发生，却没有当前授权；也可能有当前授权，却没有足够证据判断效果。

因此工程验收至少需要以下联合场景：

| 场景 | 必须成立的关联 | 不允许发生的事 |
| --- | --- | --- |
| 效果未发生、可重新执行 | successor 可反查当前 grant/decision、原 attempt 与事实依据 | 用过期 receipt 或仅凭 thread 字符串重新执行 |
| 效果已确认 | case 指向对账结论与证据 | wake 新 Agent 重做原动作 |
| 效果未知 | case 指向待核对责任人与受限证据 | 只因 `recoverable` 自动执行 |
| 旧 owner 迟到结算 | case 保留诊断并拒绝陈旧写入 | 覆盖 successor 的权威状态 |
| EVAL/诊断发现问题 | 旁观结果可被引用和查询 | EVAL 改桶、诊断直接授权或泄露原文 |

这些是未来开发的验收条件，不是 V2.1.2 已通过的端到端能力。

## 6. 为什么这比“增加一个恢复 Agent”更重要

增加一个会读日志的 Agent，不能自动解决证据归属、当前授权和原文边界。它可能更擅长总结，却仍会把别的 attempt 的日志、事后补齐的证据或过期批准混进当前接管。

还有一个实现前提不能忽略：决定证据链不能只挂在某一个 Recover 按钮上。任何正在处理技术中断 successor 的 UI、API 或调度入口，都必须汇入同一个 recovery admission。普通已授权 rework、reassign、新 round retry 不属于 interruption recovery；混合入口由服务端依据持久状态分类。否则一个入口具备完整证据链，另一个旁路仍可能绕开当前授权和效果事实。

现有平台能力可以被利用：提供方会话状态和工具回执可作为证据输入。CodeFlowMu 不需要重建 Codex、AG2 或 Paperclip 的会话产品；它需要继续维护 FCoP TASK、五桶、当前授权和业务裁决之间清晰、可审计的边界。

本轮最有价值的结论因此不是“缺一套 Agent 平台能力”，而是：**四个正确隔离的组件，需要一条同 TASK、可审计、但不越权的中断接管引用链。**

接管合同现已冻结：旧 receipt 只说明历史；当前 recovery authority 与必要的 operation authority 分开；EVAL/诊断只保留可选引用。`successor_started` 或受控完成引用支持的 `reconciled` 可以关闭该次 case，历史不删除；`hold_for_review` 和 `not_admitted` 保持 open。持久化、并发、崩溃恢复与正式 IA/DC 验收仍需实现和独立 QA 证明，不能用这 57 项既有测试代替。

配套阅读：[中断后的同 TASK 接管](./2026-09-01-interrupted-task-takeover) · [双语证据说明](/zh/research/evidence/2026-09-01-interruption-research)。
