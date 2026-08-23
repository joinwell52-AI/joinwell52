---
schema: publication-candidate-article/v2
title: "恢复时序不等于恢复权威"
date: '2026-08-23'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "When a digital employee resumes after a human interruption, how should reconstructed operator evidence be ordered relative to regenerated or synthetic context?"
summary: "Google ADK 的一项已合并变更说明：可恢复 Agent 需要在模型解释前建立面向具体中断的证据优先级。保留操作员响应可以消除一种遮蔽故障，但不能认证操作员，也不能保证 Exactly-once Effect。"
cover: staging/publication-candidates/2026-08-23-resume-recency-not-authority-cover.png
sources:
  - research/analysis/Q-20260823-01-resume-evidence-authority.md
---

![恢复时序不等于恢复权威题图](staging/publication-candidates/2026-08-23-resume-recency-not-authority-cover.png)

# 恢复时序不等于恢复权威

人类已经回应了中断，工作流开始恢复；随后，Runtime 又把原始输入的合成副本追加到真实响应之后。对于按顺序读取对话的模型，最新的 User-role Event 可能看起来像当前指令，但它其实是整条序列里权威性最低的事件。

Google ADK 在 2026-08-23 合并的一项变更处理了这一具体边界。ADK 会重建与已知 Interruption ID 绑定的 User `FunctionResponse`，并通过 `resume_inputs` 送入 Child Context。对于 Workflow-wrapped Single-turn Agent，只要这些输入存在，Input Preparation 就提前返回，不再追加另一条 Synthetic User Event。

这个有界机制支持一个更通用的工程判断：**Resume 应在模型解释之前保持面向具体 Occurrence 的单调 Evidence Order。** 一旦某个 Interruption 已接纳 Operator Response，重新生成的 Context 就不能仅因写入更晚而静默获得更高优先级。这保留的是 Evidence Continuity，不是 Operator Identity、Approval Freshness 或 Exactly-once Execution 的证明。

## 更晚的事件，可能更不权威

问题不只是文本重复。重复之所以危险，是因为两类 Event 的语义不同：持久化的 `FunctionResponse` 是对已识别 Interruption 的回答；后来的 Synthetic Event 只是 Wrapper 对早期 Node Input 的重新生成。若把二者都当成可互换的 User Prose，Append Order 就会取代真正的 Authority Rule。

ADK 的 Resume Path 原本就保留了更丰富的结构。它扫描持久 Session Event，识别与已知 Interrupt ID 关联的 Response，在需要时执行 Schema Validation，再将其重建为 Resolved Input。Caller 显式提供的 Resume Input 也可以参与合并。因此，这份 Mapping 携带的是具体 Continuation Lineage，而普通的 Regenerated Message 并没有同一来源关系。

维护者把重复 Human Confirmation 描述为可见故障：Synthetic Input 可能遮蔽真实响应，让 Agent 再次进入确认流程。已合并 Regression Test 用代表性的非空 `resume_inputs` 验证了关键条件，但没有运行完整的持久 Tool-confirmation Loop。因此，现有证据支持的是 Input-admission Mechanism，而不是所有端到端 HITL Guarantee。

## 在模型解释之前落实优先级

一旦相互冲突的 Event 已进入 Model Context，系统就已经把 Precedence 交给概率性解释。无论补充说明、重新排序，还是要求模型自己识别哪条 Response 更可信，冲突都已经存在。

更干净的做法是在更早位置阻止低权威重建。Runtime 掌握 Interruption Identity 与 Resume State，可以用这些确定性事实决定哪些 Event 有资格进入 Context Assembly。这样，Precedence 就从 Conversation Convention 变成 Admission Invariant。

这条规则必须限定到具体 Occurrence。“旧 Evidence 永远优先”同样错误，因为操作员可能有意发出新指令覆盖旧响应。稳健的接口应显式表示 Supersession，并绑定受影响的 Interruption；否则，合法覆盖与偶然的 Synthetic Append 在 Audit Trail 中不可区分。

对于可恢复数字员工，这意味着 Resume Input 最好携带 Typed Occurrence ID、Evidence Class，以及它与被覆盖 Response 的关系。Regression Test 也应覆盖 Ordering 与 Lineage，而不只是验证 Response Value 是否成功序列化。

## 证据连续性不是授权

保留 Response 的语义位置，只回答一个问题：恢复后的模型应为当前 Interruption 消费哪份 Evidence。它没有回答其他几个问题。

如果 Approver Identity 重要，系统仍需要经过认证的 Principal；如果 Approval 会过期，就需要 Freshness 与 Revocation Rule；如果 Response 只授权某个 Tool Call 或 Resource，就需要明确 Scope；如果 Retry 可能重复外部操作，还需要 Effect-level Idempotency 或 Reconciliation。

把这些 Control 分开，可以避免常见的 Guarantee Inflation。工作流不再重复确认提示，说明它修复了重要的 Continuity Bug，但并不因此建立 Exactly-once Approval 或 Exactly-once Effect。公开证据来自一个已合并实现及相关测试，并不是跨 Framework 的独立 Evaluation。

低风险系统可以合理采用更轻的 Fresh-turn Design。关键是比例原则：如果一项操作重要到需要 Human Interruption，Runtime 至少应能说明哪个 Occurrence 得到回应、哪些 Evidence 被接纳、谁有权回应，以及哪个 Effect 消费了该授权。

## 这条 Guard 很窄，边界也很重要

新的 Condition 检查的是是否存在任何 Resume Input。它足够简单，也阻止了已演示的 Synthetic Append；但当多个 Interruption Channel 共享一个 Context 时，无关的 Resume Input 也可能抑制某个 Node 本应进行的输入再生成。当前证据尚未解决这一情形。

下一项有价值的测试，不是更大的宣传性结论，而是一条完整持久 HITL Loop：记录 Interruption、接收真实 `FunctionResponse`、执行 Resume、证明确认流程终止，并单独记录 Operator Identity 与 Downstream Effect Handling。即便通过，它也只是扩大 Evidence Surface，仍需明确 Scope 后才能支持更一般的保证。

**一手证据：** [Google ADK 已合并提交 e753651b](https://github.com/google/adk-python/commit/e753651b7df26febe00bde2cb043225e644cd207)。公开代码与 Regression Test 支持本文描述的有界 Resume-input 行为，但不是通用 HITL Safety 的独立验证。
