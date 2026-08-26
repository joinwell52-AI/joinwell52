---
title: "失败不能被绿勾覆盖：从 CrewAI 看 Agent 团队怎样保留技术失败与业务结论的边界"
date: '2026-08-26'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "怎样如实记录工具失败，又不让一次技术错误自动变成业务任务失败？"
summary: "将工具终态、任务证据和正式验收拆成三种事实，结合 CrewAI 的失败语义修复和 CodeFlowMu 的受限运行记录说明边界。"
sources: "公开一手来源与访问受限的第一方证据范围均在正文列明。"
project_relevance: case-evidence
item_id: "EBR-20260826-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-26-agent-failure-and-delivery-boundary-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-26-agent-failure-and-delivery-boundary-cover.png"
  kicker="数字员工 · 工程研究"
  title="失败不能被绿勾覆盖：从 CrewAI 看 Agent 团队怎样保留技术失败与业务结论的边界"
  summary="技术失败、任务证据和正式验收必须分层记录；绿勾不能抹去故障事实，更不能替团队签出业务结论。"
  version="EBR-20260826-03"
  status="工程研究 · 2026-08-26"
  languageHref="/en/digital-employee/2026-08-26-agent-failure-and-delivery-boundary"
  languageLabel="English"
/>

# 失败不能被绿勾覆盖：从 CrewAI 看 Agent 团队怎样保留技术失败与业务结论的边界

在 CrewAI 的一次失败语义修复中，团队发现了一个反直觉现象：失败任务经过 `close_span()` 后，追踪系统仍被写成 `OK`。PR 作者报告，在约 13 个月、约 2.4 亿次任务执行的内部统计中，`error_count`（错误计数）月度均为零；另一路径里，无团队编排的任务失败甚至可能不关闭或导出追踪记录。失败没有消失，只是被绿勾覆盖了。

[PR #7073](https://github.com/crewAIInc/crewAI/pull/7073) 修复了这条链路：失败进入错误路径并保留错误类型。上述规模和现象是 PR 的自报背景，本文未独立核验；实现刻意只记录异常类别名、不记录异常消息，以降低提示词、路径或凭据进入追踪记录的风险。本文从这个真实场景出发，回答另一半问题：怎样承认技术失败，又不让一次超时、取消或拒绝自动变成“业务任务失败”？

同一时期的 [PR #7079](https://github.com/crewAIInc/crewAI/pull/7079) 则把框架内部 flow（流程）与真正拥有根执行边界的独立 `Agent.kickoff()` 区分开：内部路由和 memory recall（记忆检索）不应被误判成用户业务自动化。这两项是当前已合并的公开修复。

另有一个值得追踪、但不能混入当前能力的方向：仍处于开放状态的 [PR #7067](https://github.com/crewAIInc/crewAI/pull/7067) 提议把 MCP 的 401/403 细分为带 HTTP 状态码的类型化认证失败，并新增 72 项 MCP 测试。它说明更细的失败归因正在被讨论，不是 CrewAI 当前已经合入的成熟特性。

## 不要用一个“完成”掩盖三种事实

| 层次 | 要回答的问题 | 合适的状态例子 |
| --- | --- | --- |
| 技术动作 | 这一次 tool/job 发生了什么？ | completed、failed、cancelled、orphaned |
| 任务证据 | 有哪些可核查工件支持或反驳交付？ | REPORT、测试日志、变更摘要、缺失证据 |
| 正式验收 | 有权角色是否接受这份交付？ | accepted、returned、rejected、待裁决 |

三个层次可以互相影响，却不能相互冒充。一次构建失败必须作为失败留下；一次成功退出也只是新的证据；只有验收角色才能把一组证据转成业务结论。取消和超时同样首先是技术事实：它们应产生诊断、重试或接管选项，而不是由运行时静默宣布“业务失败”。

## 失败为什么容易被弄丢

失败处理往往藏在“看起来无害”的地方：日志 writer 落盘失败、重试覆盖原错误、UI 只显示最后一次状态，或者框架内部动作被当作用户操作拦截。每一步都可能把原本可追溯的失败变成一个干净却不真实的绿勾。

CrewAI 修复的是遥测链条里的“假绿”：发生失败时，追踪记录不能写成成功。要把这条原则落到私有工程运行时，还要再走一步——将工具调用的失败类型、任务证据和正式验收隔离记录。只有这样，观测系统看到的失败才不会在任务治理或界面投影时再次被压平。

CodeFlowMu 的已读私有实现展示了一个有限但有价值的做法：Action Evidence adapter 会把 `failed`/`error` 归为 failed；受管命令使用 `none`、`expected_rejection`、`authority_rejection`、`environment`、`product` 等失败类别；正在运行的调用不会被提前写成终态。报告写入另有观察器，以避免重复记录。不过 Evidence logger 是 best-effort：它写入失败时只告警，不会停止原调用。因此“没有日志”不能被解释成“没有发生过调用”或“调用成功”。

历史受管 job 快照中有 21 条记录：9 条完成、2 条失败、10 条处于运行状态；两条失败保留了 `MANAGED_COMMAND_WRAPPER_EXITED_WITHOUT_RESULT`。这说明失败分类确实落到了这份历史截面中，但它不是全局故障率，也不能直接替代“工具失败 → REPORT → REVIEW → UI”的端到端验证。

![历史受管作业快照的状态分类](/assets/covers/2026-08-26-managed-job-snapshot.svg)

*图 1：第一方历史快照共 21 条受管作业记录。10 条“运行中”只表示截取时状态，不能推断其最终结果。来源：CodeFlowMu 访问受限的受管作业快照，访问于 2026-08-26。*

## 一张三栏表，比一个总状态可靠

下次排查时，不妨把每项工作放进三栏：

| 技术终态 | 任务证据 | 正式结论 |
| --- | --- | --- |
| `cancel_failed` | 已保存取消请求和进程诊断 | 未决定；交给任务负责人 |
| `failed: authority_rejection` | 有拒绝原因和操作摘要 | 不等于交付被拒绝；可能需要重新授权 |
| `completed` | 测试报告与变更可查 | 仍需 REVIEW/ADMIN 接受 |

这张表把恢复的空间留出来，也把事实的责任留住。系统应该尽力让失败可观察、可归因、可重放；但不能因为自己能看见失败，就替产品、项目负责人或验收人给出业务结论。

## 我们的判断：失败要保留，结论要晚一点再下

CrewAI 的修复提醒我们，遥测链条里的 `OK`（成功）不能覆盖实际失败，框架内部动作也不能伪装成用户业务动作。我们的判断是，Runtime（运行时）还必须把这条原则延续到交付链：失败、取消和孤儿作业先作为技术事实保留；`REPORT`（执行报告）记录证据；`REVIEW`（正式审查）与人类接受才形成业务结论。CodeFlowMu 的 21 条受管作业历史快照和失败分类说明这类区分已经存在于受检材料中，但它没有证明一条完整的 failure → REPORT → REVIEW → UI（界面）链路。因此本文主张补齐链路，不把当前快照宣传成全局闭环。

对 CrewAI 而言，一个值得继续追问的问题是：既然内部流程与根执行边界已经被分开，追踪记录能否进一步保留“为何某个治理钩子被刻意跳过”的边界来源？这是一项后续研究问题，不是本文宣称已有的能力。

### 主要来源

- [CrewAI PR #7073：失败任务的 error tracing](https://github.com/crewAIInc/crewAI/pull/7073)，访问于 2026-08-26。
- [CrewAI PR #7079：跳过内部 flow 的 interception hooks](https://github.com/crewAIInc/crewAI/pull/7079)，访问于 2026-08-26。
- CodeFlowMu 私有 Action Evidence、受管命令快照与报告投影材料；第一方、访问受限，支持范围限于本文说明的实现和快照。
