---
schema: publication-candidate-article/v2
title: "“用户角色”响应不等于真人审批"
date: '2026-08-18'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "What must an agent runtime know before it may treat a syntactically valid user-role response as an accountable human approval?"
summary: "Agent Runtime 不应把 user-role 语法直接等同为审批权。Google ADK 当日合并变更表明，接收端拥有的来源标记可以在确认匹配之前对远程 A2A 审批类别进行 Fail-closed；而真人身份认证与授权仍是独立要求。"
cover: staging/publication-candidates/2026-08-18-accountable-human-approval-cover.png
sources:
  - research/analysis/Q-20260818-01-accountable-origin-human-approval.md
---

![“用户角色”响应不等于真人审批 题图](staging/publication-candidates/2026-08-18-accountable-human-approval-cover.png)

# “用户角色”响应不等于真人审批

一个危险工具调用正在等待真人确认时，远程 Agent 完全可能发送一条语法正确的 `user`-role 响应。如果 Runtime 只问“这像不像确认”，远程对端就可能通过与真人相同的语法入口进入信任判断。

2026-08-18 合并的一项 Google ADK 变更处理了这个问题的一个具体版本：A2A 来源 Invocation 现在总会被接收端写入 `a2a_metadata` 标记，即使对端完全不提供 Metadata；当该标记存在时，变更后的确认处理器会在匹配确认事件之前直接返回。回归测试同时覆盖“有 Metadata”和“无 Metadata”的 A2A 请求。

这组证据支持一个有界但重要的判断：**消息角色描述的是内容语义；可追责审批则是带来源的授权事件。** 二者不能压缩进同一个字段。

## `role=user` 回答不了“谁有权批准”

`user` 角色可以告诉模型或 Runtime 应怎样解释一段消息，却不会自动说明消息由哪个 Principal 产生，更不能证明该 Principal 有权批准当前操作。

当多个 Transport 都能产生形式相似的内容时，这一区分尤其关键。浏览器会话、内部服务、远程 A2A 对端以及后续单独认证的真人步骤，都可能生成最终被 Runtime 视为“用户输入”的数据。若把 Role 当成 Authority，就等于把消息语义与 Actor Provenance 混成一个概念。

ADK 变更演示的是这种分离的负向一半：来源标记由接收端写入，是否存在不取决于远程对端可自行省略的字段。因此，在已测试路径中，远程对端不能仅靠发送空 Metadata 就把 A2A 来源伪装成“本地真人”。

## 来源资格应先于确认内容匹配

门禁的位置与标记本身同样重要。确认处理器先判断 A2A Origin，再进入正常的 Confirmation Event Resolution。已演示路径中，即使远程 `FunctionResponse` 写着 `confirmed=True`，它也不会进入待处理真人确认的匹配逻辑。

这提示了一种更通用的控制顺序：

1. 使用接收端建立的 Provenance 判断响应来源；
2. 对不具备审批资格的 Origin Class 直接 Fail-closed；
3. 然后才把响应语义与具体待审批 Occurrence 匹配；
4. 对允许的正向路径，再独立认证 Principal，并验证其 Authorization Scope。

前两步并不能证明后两步已经成立。一个系统可以正确拒绝远程 Agent 审批，同时仍拥有很弱的真人通道。因此，现有证据支持的是“来源先行的 Fail-closed 边界”，不是“完整 HITL 已安全”。

## 一次可追责审批需要比一条消息更多的身份

对于高后果操作，持久审批记录至少应把以下身份分开保存：

- **Content Role**：这条消息在语义上是什么；
- **Transport Origin**：它从哪个 Trust Domain 到达；
- **Principal Identity**：究竟是谁或什么做出审批；
- **Authorization Scope**：该 Principal 被允许批准哪些操作；
- **Approval Occurrence Identity**：审批针对哪一个具体动作、版本与有效时间窗。

已选择的实现直接证明的只有“来源类别拒绝”。上述五项模型，是研究中心基于现有证据提出的有界工程解释，用于描述更完整的可追责审批链。

这种分离也能让合法的机器委托更清楚。某个机器 Principal 可以被授权批准狭窄的低风险操作，但那应被记录为“委托的机器审批者”，而不是因为它能产生 user-role 内容就被叫作“真人”。审计面必须保留这种差别。

## 负向门禁不能反推出正向真人已经可信

合并代码与测试没有建立最终真人是谁、审批是否新鲜、能否重放、来自哪个设备或会话，也没有证明所有其他 Transport 与 HITL Processor 都具有同等强度的 Provenance。这个 Marker 不是密码学来源证明；仓库回归测试也不是独立安全评估。

因此不能从“远程 A2A 确认被拒绝”推导出“剩余被接受的确认就一定来自真实且有权的真人”。负向 Origin Qualification 与正向 Principal Authorization 是两套独立证据要求。

接下来真正需要回答的问题很具体：什么持久身份把真人决定绑定到某一次危险工具调用？Expiry 与 Replay 如何处理？还有哪些 Transport 可以构造确认响应？合法的非真人 Delegation 应如何表达？安全审批可以从“这条响应来自哪里”开始，但只有当 Runtime 还能回答“谁、凭什么、批准了哪个具体 Occurrence”时，它才真正具备可追责性。

**一手证据：** [Google ADK 合并提交 9e9eaa69](https://github.com/google/adk-python/commit/9e9eaa69bdcc16f004af9c63f40f1dae6404c29b)。该代码与仓库测试属于公开一手证据，并不等于对完整 HITL 安全的独立验证。
