---
title: "绿勾只代表现在：Agent 系统为什么必须同时保留失败事实与交付结论"
date: '2026-08-26'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "怎样让技术失败、当前交付状态与历史证据同时可见，而不让任何一层替另一层下结论？"
summary: "从 CrewAI 的失败遥测修复和 CodeFlowMu 的报告投影缺陷出发，说明技术失败、交付证据、当前状态、正式验收与历史必须分层保存。"
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
  title="绿勾只代表现在：Agent 系统为什么必须同时保留失败事实与交付结论"
  summary="技术失败不能被成功状态覆盖，当前交付也不能擦掉历史；执行事实、交付证据、正式验收必须各自有账。"
  version="EBR-20260826-03"
  status="工程研究 · 2026-08-26"
  languageHref="/en/digital-employee/2026-08-26-agent-failure-and-delivery-boundary"
  languageLabel="English"
/>

# 绿勾只代表现在：Agent 系统为什么必须同时保留失败事实与交付结论

一个 Agent 任务最后显示“完成”，能不能推出它从来没有失败过？

不能。

一次工具调用失败了，能不能直接推出业务任务失败？

也不能。

**CodeFlowMu 是一个本地运行的多 Agent 协作系统，用任务、角色、门禁、报告与审批，把 Agent 的执行过程组织成可追踪、可恢复、可验证的工作链。**

在这样的系统里，最危险的不是出现失败，而是不同层的事实被压成一个状态：一次技术错误被直接写成业务失败；一次后来成功的重试把先前故障抹掉；一份当前报告覆盖了被退回或已替换的历史；页面上的绿勾最后变成了“过去什么问题都没有”的错觉。

这篇文章讨论的不是怎样让页面更绿，而是怎样让几种不同的事实同时成立。

## 先说结论：三条边界不能互相替代

一个可审计的 Agent 运行时，至少要守住三条不等式：

- **technical failure ≠ delivery rejection**：一次技术失败首先是执行事实，不自动等于业务交付被否决；
- **successful action ≠ accepted delivery**：命令成功、测试通过或报告生成，只产生交付证据，不自动产生正式验收；
- **current state ≠ history**：当前状态可以变化，但已经发生过的失败、退回、替换和解决记录不能因此消失。

如果这三层被压成一个 `status`，系统迟早会出现一种很难发现的错误：页面看起来完全正常，审计链却已经断了。

## CrewAI 的一个具体错误：失败发生了，遥测却写成 OK

CrewAI 在 2026 年 8 月合并的 [PR #7073](https://github.com/crewAIInc/crewAI/pull/7073) 修复了一个非常直接的 false-green 问题：任务失败事件曾进入正常结束路径，`close_span()` 会把 span 标成 `StatusCode.OK`；另一个无 crew 的失败路径还可能让 span 被取出后没有正确结束和导出。

修复后的设计把失败送入错误路径，用 `StatusCode.ERROR` 保存，并记录经过约束的 `error_type`。PR 还特意避免记录异常 message，只保留异常类型，以减少 prompt、路径或凭据进入遥测的风险。

这个案例说明的并不是“CrewAI 以前不可靠”，而是一条更一般的工程原则：

> **发生过的技术失败必须以失败的身份留下来。后续恢复成功，不能把前面的失败重新写成成功。**

可这只解决了第一层。如果运行时进一步把“工具失败”直接翻译成“业务交付失败”，又会犯另一种错误。超时、环境异常、权限拒绝、取消、进程丢失，都可能需要重试、接管或重新授权；它们首先是执行事实，是否影响最终交付，需要由任务证据和验收规则继续判断。

## CodeFlowMu 暴露的是另一半：当前正确，也不能把历史挤掉

CodeFlowMu 这次公开的 A3 证据不是工具错误分类，而是**报告与 ISSUE 的当前投影**。

首轮记录优先级检查只有 **55 / 57**。两份已经被替换或判为无效的最终记录，仍可能被当前“主报告”规则选中。也就是说，数据并没有消失，但页面把历史记录放到了错误的位置。

修复后，同一集合达到 **57 / 57**；后续语义路由检查 **14 / 14**，Reports / Issues / Mobile / Web Panel 集成集合 **221 / 221**。这些数字只证明指定路径被复验，不代表所有未来故障都能无损传播。

受控现场快照进一步记录：

| 投影结果 | 快照中的事实 | 正确含义 |
| --- | ---: | --- |
| 当前主任务报告 | 1 | 当前根任务应展示的一份主报告 |
| 当前子任务报告 | 4 | 当前任务链可见的子报告 |
| 历史报告 | 12 | 仍可追溯，但不应冒充当前结论 |
| 已解决 ISSUE | 6 | 历史问题已结案，记录仍保留 |
| 开放 ISSUE | 1 | 仍有一项当前问题需要处理 |

这组证据真正支持的结论很窄，但很重要：

> **一个正确的当前视图不能靠删除、隐藏或错误降级历史来获得。**

绿勾只能说“现在投影出来的状态是什么”，不能替系统宣称“以前没有失败”“没有被退回”“没有发生过替换”。

## 为什么这两个案例其实在讲同一条边界

CrewAI #7073 和 CodeFlowMu A3 发生在不同层：一个是 telemetry，一个是任务/报告投影。它们不能互相当作实现背书，但它们揭示了同一种数据治理风险——**后来的状态覆盖了先前发生过的事实。**

更稳健的 Agent 系统应该把至少四类事实分开：

| 层 | 回答的问题 | 典型记录 |
| --- | --- | --- |
| 执行事实 | 某次工具调用或作业到底发生了什么？ | completed / failed / cancelled / timeout |
| 交付证据 | 这次工作产生了什么可检查材料？ | REPORT、测试结果、变更摘要、artifact |
| 正式验收 | 有权角色是否接受这些证据？ | accepted / returned / rejected / pending |
| 历史与当前投影 | 现在应该展示什么，同时过去发生过什么？ | current / superseded / historical / resolved / open |

它们可以互相引用，但不能互相覆盖。

例如：

`tool failed → retry succeeded → report submitted → review accepted`

这条链最终可以得到一个“已完成”的业务结论，但第一步的失败仍然应该存在。反过来，`tool succeeded` 也只代表一次执行成功；如果没有报告、证据或正式验收，它仍不能自动升级成“任务已交付”。

## CrewAI #7079 又提醒了一个相邻问题：先弄清这是谁的动作

CrewAI 的另一个已合并修复 [PR #7079](https://github.com/crewAIInc/crewAI/pull/7079) 把框架内部 Flow 与调用者真正发起的执行边界分开。内部路由、memory recall 等机制不再默认触发与用户业务动作相同的 interception 判断，而 standalone `Agent.kickoff()` 这类真正拥有执行边界的入口仍保持可观察、可拦截。

这不是 CodeFlowMu A3 的直接对应实现，但它补充了一个重要前提：在记录成功或失败之前，系统还要先知道**这条事件究竟是谁的业务动作，还是框架内部机制**。如果 provenance 本身都错了，后面的失败统计、交付判断和审计都会一起失真。

## 一个绿勾应该满足什么条件

如果我们把“完成”当作任务页面上的最终投影，它至少应该满足下面的约束：

1. **失败不可改写**：技术失败可以后来被恢复，但原始失败事实不能被成功重试覆盖；
2. **执行不可冒充验收**：工具返回 0、测试全绿、文件生成，都不能自行签出业务完成；
3. **当前不可吞掉历史**：被替换、退回、失效和已解决记录仍应可追溯；
4. **投影必须有来源**：页面为什么展示这份主报告、这个 ISSUE 数字，应能回到明确的 ledger / lineage 规则；
5. **内部动作不能冒充业务动作**：框架内部 Flow、路由或 memory 操作要与用户真正请求的执行边界区分。

这样，“完成”才不是一个颜色，而是多个事实经过规则投影后得到的当前结论。

## 结尾：可信系统不是没有红色，而是不让红色被绿色改写

Agent 系统里，失败是正常现象。网络会断，命令会报错，报告会被退回，结论会被替换，历史 ISSUE 会关闭，也会有新的 ISSUE 保持开放。

真正危险的是系统为了给出一个简单状态，把这些不同事实折叠成一句“成功”或“失败”。

可靠的做法恰好相反：**技术层如实保留失败，交付层保留证据，验收层单独下结论，投影层只回答现在应该展示什么，历史层永远不被当前状态覆盖。**

所以，一枚绿勾最准确的含义不是“什么都没出过问题”，而是：

> **在保留全部相关历史事实的前提下，系统当前有足够证据把这一状态投影为完成。**

这才是“完成”在数字员工运行时里应该拥有的边界。

## 公开证据：A3 真正证明了什么

A3 的首轮记录优先级检查为 **55 / 57**，问题是 superseded 或 invalid 的最终记录仍会被主报告规则抢到当前位置；修复后为 **57 / 57**，后续语义检查 **14 / 14**，Reports / Issues / Mobile / Web Panel 集成为 **221 / 221**。

受控现场快照记录了 1 份当前主报告、4 份当前子报告、12 份历史报告、6 条已解决 ISSUE 与 1 条仍开放 ISSUE。它支持“当前视图不能擦掉历史”和“记录优先级缺陷在修复前真实出现过”这两项主张；它**不证明**每一种工具失败都能完整传播到 REPORT、REVIEW 和所有 UI，也不构成全局故障率统计。

- [查看 A3 报告投影逐轮记录（CSV）](/evidence/execution-boundary-20260826/v2/case-a3-projection-precedence-trace.csv)
- [查看 A3 脱敏测试与现场摘录（GitHub）](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/v2/transcript-a3.md)
- [查看主张—证据映射（GitHub）](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/v2/claim-evidence-map.csv)

### 来源与证据边界

- [CrewAI PR #7073](https://github.com/crewAIInc/crewAI/pull/7073)：`fix(events): record task failures as failures, not as successes`，2026-08-25 合并。本文只引用其任务失败遥测从 OK 路径改为 ERROR 路径及受约束 `error_type` 的公开实现事实。
- [CrewAI PR #7079](https://github.com/crewAIInc/crewAI/pull/7079)：`fix: skip interception hooks on crewai-internal flows`，2026-08-25 合并。本文只把它作为“内部机制与调用者业务执行边界应区分”的相邻案例。
- CodeFlowMu A3 数据的测试范围、现场快照和不可外推边界见[公开、脱敏的四案例数据包](/zh/digital-employee/2026-08-26-execution-boundary-evidence-data)。原始日志、任务正文与本机路径不公开。
