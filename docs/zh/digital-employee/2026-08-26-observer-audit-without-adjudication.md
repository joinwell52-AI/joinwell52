---
title: "看见问题，不等于有权裁决：从 Anywhere Agents 到 CodeFlowMu 的审计分权边界"
date: '2026-08-26'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "Agent 可以发现风险、记录证据并提醒负责人，但怎样保证这些观察不会自动升级成阻塞、批准、驳回或生命周期决定？"
summary: "从 CodeFlowMu 一条真实的 EVAL 投影缺陷出发，对照 Yue Zhao 在 Anywhere Agents 中对 advisory audit、agent-io scope 与 review loop 的边界设计，讨论观察权与裁决权为什么必须分开。"
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
  title="看见问题，不等于有权裁决：从 Anywhere Agents 到 CodeFlowMu 的审计分权边界"
  summary="观察可以深入事实，也可以影响后续工作；但它是否拥有阻塞、批准、驳回或改变生命周期的后果，必须由另一条明确的权力边界决定。"
  version="EBR-20260826-02"
  status="工程研究 · 2026-08-26"
  languageHref="/en/digital-employee/2026-08-26-observer-audit-without-adjudication"
  languageLabel="English"
/>

# 看见问题，不等于有权裁决：从 Anywhere Agents 到 CodeFlowMu 的审计分权边界

**一个 Agent 能发现问题，不等于它有权决定任务通过还是驳回。观察是一种事实输入，裁决是一种治理权力。真正可靠的审计系统，不只是“检查得更仔细”，还要把审计结果能产生多大后果写进架构。**

最近我们在 CodeFlowMu 里修复了一条真实的 EVAL 路径；随后继续阅读 Yue Zhao 的 Anywhere Agents issue #35、提交 `53bd8fa` 以及其中的 `style-audit.py`，发现两条独立工程路径虽然处理的是不同问题，却在一个边界上出现了相似结构：**观察可以被看见、被记录、被采用，但不能因为它存在，就自动获得阻塞、批准、驳回或改写生命周期的权力。**

**CodeFlowMu 是一个本地运行的多 Agent 协作系统，用任务、角色、门禁、报告与审批，把多个 Agent 的工作组织成可追踪、可恢复、可验证的执行链。** 本文讨论的不是“审计 Agent 应不应该有用”，而是一个更窄的问题：**谁有权把一条观察变成业务后果？**

## 1. 真实故障：7 / 7 和 4 / 4 都是绿的，边界仍然错了

CodeFlowMu 中的 EVAL 用来做事实核查：读证据、发现矛盾、留下观察。正式验收则属于有权角色。按设计，两者应该分开。

但一次实际路径暴露了相反的结果：某张生命周期已经完成的任务上存在一份 EVAL 报告，治理快照却把它投影成 `acceptance=pending / formal_report_requires_acceptance`，页面进一步把它放进“等待 PM 验收”。如果再次点击批准，请求还能进入普通审批路径，最后只是因为任务已经完成而撞上 HTTP 409。

更重要的是，当这个缺陷存在时，基线测试仍然是绿的：**治理内核 7 / 7，页面终态规则 4 / 4。** 所以问题不是“没有测试”，而是测试没有覆盖一条更深的权限传播链：

**EVAL 写观察 → 投影把它识别成正式交付 → 页面出现待验收语义 → approve / reject 路径可达**

这里最值得警惕的不是某个 Agent 主动越权，而是**系统在投影、API 和页面层替一个观察者增加了权力**。角色边界如果只写在 prompt 或角色说明里，而没有一路保持到状态投影和写操作上，就不是真正的边界。

## 2. 多 Agent 系统至少要分清四种权力

| 层级 | 它回答什么 | 可以做什么 | 不应自动做什么 |
|---|---|---|---|
| 观察 | 发现了什么？ | 保存事实、矛盾、证据引用 | 改变业务结论 |
| 提醒 | 谁需要关注？ | 形成待关注信息 | 把风险直接升级为拒绝 |
| 正式裁决 | 这份交付是否接受？ | 接受、退回、拒绝并留下理由 | 冒充执行事实 |
| 生命周期写入 | 任务进入什么状态？ | 执行已经获得授权的决定 | 自己判断内容“够不够好” |

这四层会互相引用，但不能互相冒充。**观察 ≠ 批准；提醒 ≠ 驳回；生命周期写入 ≠ 业务判断。**

这次修复也没有停在“把按钮隐藏掉”。EVAL 报告在数据和接口层被重新定义为“观察已经记录，不适用正式验收”。重复 approve 或 reject 返回 `no_change / already_observed`，同时保持几个关键不变量：`action_taken=false`、不创建业务决定、不触发生命周期动作、生命周期任务文件保持字节级不变；而普通 DEV、QA、OPS 报告原有的正式验收要求不被削弱。

修复后的验证分别是：治理内核 **8 / 8**、页面终态规则 **6 / 6**、Web Panel / API **109 / 109**、EVAL 显示收口 **18 / 18**。这些数字只证明对应路径，不证明未来所有 UI、插件或外部集成都没有旁路；但它们足以支撑本文最窄的结论：**在已验证路径里，观察可以被确认，却不能借一次重复请求取得裁决权。**

## 3. Anywhere Agents 更值得注意的，不只是“advisory only”

Yue Zhao 的 Anywhere Agents 在 issue #35 中讨论的是另一类问题：写作风格审计原来是一个可选、部分手工拼装的检查。语义规则有时要靠 reviewer 临时写 `grep`，甚至出现过 shell locale 导致 grep 什么都没有匹配，而“检查根本没跑成功”和“文本确实没有问题”在输出上看起来一样的情况。

issue 最初提出了一个很自然的方向：把检查做成固定脚本，让它按内容触发，并像 verification 一样留下明确的 `Style status`。但后续校准暴露出另一个风险：**如果把机械 style findings 直接送进正式 review loop，它们就可能从“提示”升级成“必须解决的问题”。** 在一段长 session 中，review prompt 本身可以收到 7 到 12 条 RULE-12 提示；而 RULE-12 这种“句子超过 30 个词”的规则没有稳定的固定点——拆一句长句，可能又产生另一句长句。若每次修文都会产生新 diff、再触发一轮 review，机械风格检查就可能把本来已经可以 PASS 的 review 一直拖住。

所以后来形成的 maintainer constraint 非常明确：

> **style audit 必须可见，但绝不能有能力把 review loop 卡住。**

这不是一句文档承诺，而是被做成了结构：audit 放在 Round 1 之前的 pre-flight 或 PASS 之后的 pre-commit 固定点；正常审计结果不通过退出码阻塞；findings 不进入 reviewer prompt，不进入 Round history，也不进入 final verdict。`CLEAN`、`FINDINGS: N`、`SKIPPED`、`FAILED` 都可以被记录，但这个值本身不获得 verdict 权力。

这一步很重要，因为它把两个经常被混在一起的问题拆开了：

> **“这个检查是否发生、结果是否可见”是一件事；“这个结果是否有资格阻塞流程”是另一件事。**

## 4. `agent-io` 的细节说明：后果越强，信任门槛越高

提交 `53bd8fa` 还做了另一个很有意思的边界设计。原来的 writing-style guard 主要按文件扩展名判断文本，于是 Agent 真正在写的 prose 和它只是携带的 dispatch prompt、review output 都可能被当成同一类内容。作者在 34 份 session transcript 中报告了 2,227 条 advisory，并发现不少 prose-extension 文件其实位于承载 review-loop 中间文本的 scratch 区域。

解决办法之一是让调用方用 `agent-io` 标记 carried text。但 Anywhere Agents 并没有让所有 guard 对这个标记给予同等信任：

| Anywhere Agents 中的动作 | 错误豁免的后果 | 对 `agent-io` 的信任 |
|---|---|---|
| advisory 提示 | 最坏多漏一条提示 | 可以较宽松地接受标记 |
| deny gate | 可能绕过真实写入禁令 | 只在临时根目录、且其中不包含 repository 时接受，并先解析 symlink |

这背后的原则比具体目录名更值得关注：

> **后果越强，所需的授权与证据门槛就应该越高。**

如果一个标记只影响“要不要多提示一句”，信任成本较低；如果它会决定“能不能绕过 deny”，同一个标记就不能成为一键逃生口。Anywhere Agents 甚至明确考虑了 `repo/agent-io/proposal.md` 这种看似合法、实际可能把真实 prose 伪装成 carried text 的路径。

`style-audit.py` 里还有同样的证据意识：它审的是 **staged blob**，不是当前 working tree，因为“用 staged 行号过滤 working-tree 内容”可能既漏掉真正准备提交的问题，也把未暂存内容错误归到本次提交。该提交报告 whole-file 359 条历史 findings，在只看本次改动行后收敛到 2 条。这个数字是 Anywhere Agents 自己的工程测量，不是本文独立复现的准确率；我们更看重的是它背后的方法：**审计对象必须和真正被审查、被提交的对象一致。**

## 5. 两条独立路径，为什么会在同一个边界上收敛？

CodeFlowMu 的问题发生在任务治理层，Anywhere Agents 的问题发生在写作 guard 与 review loop 层。两者不应被说成同一种实现，也不存在“Anywhere Agents 证明了 CodeFlowMu 正确”。但把它们并排看，会看到一个很清楚的共同结构：

| Anywhere Agents | CodeFlowMu |
|---|---|
| style audit 产生 findings | EVAL 产生 observation |
| audit 结果可见，但不进入 verdict | observation 可记录，但不成为 formal acceptance |
| `Style status` 可以存在，但值不阻塞 PASS | `already_observed / no_change` 不产生 business decision |
| 高后果 deny gate 要求更强的 `agent-io` 信任边界 | accept / reject / lifecycle write 要求更强的正式权限 |
| staged blob + changed lines 保证审计对象一致 | lifecycle 文件 byte-identical 证明 observer 动作没有改写任务状态 |

我们在 CodeFlowMu 里还遇到过另一个容易混淆的方案：既然 Runtime 不应替业务裁决，是否可以除少数负面清单外一律 `default allow`？这个方案在进入产品代码前被 BLOCKED。原因同样是：**“默认允许”仍然是一种裁决。** 非裁决不是永远说 Yes，而是只对自己真正拥有机械判断权的事实作决定。

因此，一个成熟的辅助层不应该只有 `ALLOW / DENY`，还需要 `OBSERVE / ATTENTION / REVIEW REQUIRED` 这样的语义，让“我发现了问题”和“我有权替团队下结论”保持正交。

## 6. 下一步：来源标签能不能传播，但始终不等于权限？

Anywhere Agents 已经在非常具体的工程位置区分了 Agent **authored** 的文本与 **carried** 的文本；CodeFlowMu 当前关注的是 **observed** 的事实与 **formally decided** 的业务结论。两边都还可以继续往前走，但这里最值得研究的不是给 observer 更多权力，而是给证据更多可追踪关系。

一个可能的问题是：`authored / carried / observed / generated` 这样的来源类型，是否应该随着 Tool Call、Agent handoff 和 review chain 一起传播？如果传播，它们又怎样始终与“谁有权阻塞、批准、驳回或改变状态”保持正交？

对 CodeFlowMu 来说，未来更完整的责任链可以是：

**观察 → 被哪次正式 review 引用 → reviewer 如何采纳或不采纳 → 正式决定 → 受控生命周期写入**

而不是：

**观察 → 状态变化**

前者保留了审计价值，也保留了责任归属。后者看起来更“自动”，实际却把最关键的治理边界抹掉了。

## 结论：审计能力越强，越需要清楚自己不能决定什么

一个好的审计 Agent 不应该因为没有最终签字权就变得“弱”。它完全可以更深入地检查证据、发现矛盾、保留来源、提示风险，甚至让正式决策者改变判断。真正需要限制的是另一件事：**观察本身不能自动继承业务后果。**

Anywhere Agents 的 issue #35 和 `53bd8fa` 很有价值的地方，是它没有只解决“怎样把 style audit 跑起来”，还继续追问了“怎样让 audit 可见，却不能把 review loop 变成自己的控制对象”。CodeFlowMu 的 EVAL 缺陷则从另一边说明：即使 observer 自己没有 approve 权限，投影、UI 和 API 也可能把裁决语义重新接回来。

两边共同提醒我们：

> **审计不是裁决的低配版本。它应该是一条独立的证据通道。**

> **看见问题，不等于有权裁决；后果越强，所需的授权与证据边界就应该越严格。**

---

## 公开证据

- [**查看 A2 基线、修复和重复操作记录（CSV）**](/evidence/execution-boundary-20260826/v2/case-a2-observer-semantic-trace.csv)
- [**查看 A2 脱敏测试摘录（GitHub）**](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/v2/transcript-a2.md)
- [**核对本文主张对应哪一条证据（GitHub）**](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/v2/claim-evidence-map.csv)
- [**查看公开、脱敏的 Execution Boundary 四案例数据包**](/zh/digital-employee/2026-08-26-execution-boundary-evidence-data)

## 来源与证据边界

### Anywhere Agents

- [**Yue Zhao / Anywhere Agents issue #35**](https://github.com/yzhao062/anywhere-agents/issues/35)：本文引用其从“可选、手工审计”走向确定性脚本，以及后续对 `Style status`、review-body 注入和 review-loop 阻塞风险的讨论。
- [**Anywhere Agents commit `53bd8fa`**](https://github.com/yzhao062/anywhere-agents/commit/53bd8fa43c7339ae9958c03c55434fac7baddaf3)，2026-08-25：本文引用其 `agent-io` scope、不同 guard 的不同信任深度，以及 advisory audit 不进入 reviewer prompt、Round history 和 final verdict 的设计。
- [**`style-audit.py`（对应提交版本）**](https://github.com/yzhao062/anywhere-agents/blob/53bd8fa43c7339ae9958c03c55434fac7baddaf3/skills/implement-review/scripts/style-audit.py)：用于核对 staged-blob 审计、changed-line scoping 和“advisory by construction”的实现说明。

本文提到的 34 份 session transcript、2,227 条 advisory、359→2 findings 等数字均为 Anywhere Agents 作者在对应 issue / commit 中报告的工程测量，本文没有独立复现，不把它们解释为通用准确率或效果证明。

### CodeFlowMu

本文关于 CodeFlowMu 的结论只适用于公开 A2 证据覆盖的命名路径。证据支持：7 / 7 与 4 / 4 的基线没有覆盖已观察缺陷；修复后治理内核 8 / 8、页面规则 6 / 6、Web Panel / API 109 / 109、EVAL 收口 18 / 18；重复 EVAL approve / reject 不产生业务决定、不触发生命周期动作，并保持生命周期任务文件不变。

这些证据**不能证明**未来所有 UI、插件和外部集成都不存在旁路，也不能证明 EVAL 的观察永远正确，更不能证明完整的 provenance / responsibility chain 已经实现。原始日志、任务正文和本机路径不公开；研究结论应与对应版本、测试集合和证据边界一起阅读。
