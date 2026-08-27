---
title: "看见问题，不等于有权裁决：Agent 审计为什么必须与正式验收分权"
date: '2026-08-26'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "Agent 可以发现风险、记录证据并提醒负责人，但怎样保证这些观察不会被系统自动升级成正式验收或生命周期决定？"
summary: "从 CodeFlowMu 一条真实的 EVAL 投影缺陷出发，对照 Anywhere Agents 的 advisory audit，讨论观察、提醒、正式裁决与生命周期写入为什么必须分权。"
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
  title="看见问题，不等于有权裁决：Agent 审计为什么必须与正式验收分权"
  summary="审计 Agent 可以发现问题、保存证据和提醒负责人，但不能因为看见风险，就自动取得批准、驳回或改变任务生命周期的权力。"
  version="EBR-20260826-02"
  status="工程研究 · 2026-08-26"
  languageHref="/en/digital-employee/2026-08-26-observer-audit-without-adjudication"
  languageLabel="English"
/>

# 看见问题，不等于有权裁决：Agent 审计为什么必须与正式验收分权

**一个 Agent 能发现问题，不等于它有权决定任务通过还是驳回。观察是一种事实输入，裁决是一种治理权力；如果系统把两者接在同一条接口或页面路径上，一个“旁观者”就可能在没有正式授权的情况下变成隐形审批人。**

## 先说这次真实故障

**CodeFlowMu 是一个本地运行的多 Agent 协作系统，用任务、角色、门禁、报告与审批，把多个 Agent 的工作组织成可追踪、可恢复、可验证的执行链。**

我们在其中使用 EVAL 角色做事实核查。它的职责是读证据、发现矛盾、留下观察；正式验收则由有权角色完成。按设计，这两件事应该分开。

但一次现场路径暴露了相反的事实：某张已经完成生命周期的任务上存在一份 EVAL 报告，治理快照却把它投影成 `acceptance=pending / formal_report_requires_acceptance`，页面进一步把它放进“等待 PM 验收”。如果用户再次点击批准，请求还会进入普通批准路径，最后因为任务其实早已完成而返回技术冲突 409。

更值得警惕的是，在这个缺陷出现时，已有的基线测试还是绿的：**治理内核 7/7，页面终态规则 4/4。** 也就是说，系统并不是完全没有测试，而是测试没有覆盖真正把“观察”误接成“正式验收”的用户路径。

问题因此不再只是一个标签错误，而是一个权限边界错误：

> **EVAL 本来只有观察权，页面和接口却给它接上了裁决语义。**

---

## 1. 多 Agent 系统至少要分清四种权力

在多人团队里，“发现问题”和“签字决定”本来就是两件事。Agent 系统如果要长期运行，也需要把这种分工写进数据结构和接口，而不能只靠提示词约定。

| 层级 | 它回答什么 | 可以做什么 | 不应该自动做什么 |
|---|---|---|---|
| 观察 | 发现了什么？ | 保存事实、矛盾、证据引用 | 改变业务结论 |
| 提醒 | 谁需要关注？ | 形成待关注信息、通知负责人 | 把风险直接升级为拒绝 |
| 正式裁决 | 这份交付是否接受？ | 接受、退回、拒绝，并留下理由 | 冒充底层执行事实 |
| 生命周期写入 | 当前任务进入什么状态？ | 按已授权决定推进状态 | 自己判断内容“够不够好” |

这四层会相互引用，但不能相互冒充。

**观察 ≠ 批准，提醒 ≠ 驳回，技术状态写入 ≠ 业务判断。**

如果一份事实核查报告仅仅因为出现在“报告”集合里，就被自动解释成“待验收交付”，那么系统已经把数据类型的相似，错误升级成了权限的相同。

---

## 2. 真正危险的是“页面替角色加权”

很多授权问题并不是某个 Agent 主动越权，而是系统投影时替它增加了权力。

这次缺陷就是这样发生的：EVAL 只写了一份观察，但治理快照给它补上“需要正式 acceptance”的语义，页面又把它路由到“等待 PM”，最后普通 approve/reject 接口变得可达。

可以把错误链压缩成一行：

**EVAL 观察 → 被识别成正式报告 → 页面显示待验收 → 普通批准路径可达 → 生命周期边界被混淆**

这里没有哪一步看起来特别夸张。每一步单独看都像是“复用已有组件”。但串起来以后，旁观审计就获得了它原本不应该拥有的业务后果。

这给我们留下一个很重要的工程判断：

> **角色权限不能只在 Agent 层定义，还必须在投影、API 和状态转换层持续保持。**

如果后台说 EVAL 不裁决，但页面仍给它一个“批准”按钮，架构上它仍然没有真正做到不裁决。

---

## 3. 修复不是隐藏按钮，而是让“观察”在数据层就不具备裁决语义

这次修复最重要的变化，不是换一个按钮名称，而是把 EVAL 报告重新定义为：**观察已经记录，不适用正式验收。**

修复后，针对 EVAL 的重复批准或重复拒绝都不再创建业务决定，而是返回：

`no_change / already_observed`

关键不是这几个字符串，而是它们背后的不变量：

- `action_taken=false`；
- 不创建新的业务决定；
- 不触发生命周期动作；
- 原生命周期任务文件保持字节级不变；
- 普通 DEV、QA、OPS 报告的正式验收规则保持不变。

换句话说，系统可以承认：

> “这份观察我已经收到。”

但不能借这个动作偷偷补出：

> “所以任务被批准了。”

或者：

> “所以任务被拒绝了。”

修复后的验证链也比原来的“全绿”更有意义：

| 检查 | 结果 | 真正确认的边界 |
|---|---:|---|
| 治理内核 | 8 / 8 | EVAL 不再要求正式 acceptance |
| 页面终态规则 | 6 / 6 | EVAL 与普通待验收报告分开投影 |
| Web Panel / API | 109 / 109 | 重复 approve/reject 只形成 audited no-change |
| EVAL 显示收口 | 18 / 18 | 历史冲突可见，但不重新制造当前裁决 |

这些数字不能证明未来所有 UI、插件和扩展永远不会越过边界，但它们足以支持这次案例的核心结论：**在被检查的路径里，观察可以被重复读取和确认，却不能借重复请求改变任务生命周期。**

---

## 4. “不替人裁决”也不等于“默认允许”

这里还有一个容易被忽略的陷阱。

如果我们认为 Runtime 不应该替业务作判断，一个很诱人的实现是：除了少数明确禁止项，其余情况全部 `default allow`。

看起来它很中立，实际上不是。

因为只要 Runtime 输出“允许”，它仍然在回答一个业务问题：

> **现在可以继续吗？**

CodeFlowMu 的相关工程记录里，这种“负面清单以外默认允许”的方案在进入产品代码前被 BLOCKED。公开 A2 数据也把这一点单独列为 `default-allow-proposal`：方案被考虑，但在产品代码修改之前被边界审查叫停。

这让“非裁决”有了更精确的含义：

> **非裁决不是永远说 Yes，而是只对自己真正拥有机械判断权的事实作决定。**

例如身份不一致、根任务已经关闭、明确授权缺失，这些可以成为硬门禁；但“方案够不够好”“报告应该不应该收”“风险是否足以否定交付”，仍然应该交给拥有正式责任的角色。

所以成熟的辅助系统不应该只有：

**ALLOW / DENY**

它还需要：

**OBSERVE / ATTENTION / REVIEW REQUIRED**

把“我看见了问题”和“我有权替团队下结论”明确分开。

---

## 5. Anywhere Agents 给了一个独立的外部参照

赵越（Yue Zhao）的 Anywhere Agents 在 2026-08-25 的提交 `53bd8fa` 中处理了一个不同、但结构上很接近的问题。

它的 writing-style guard 原本主要按文件扩展名判断内容，因此会同时扫描两类完全不同的文本：Agent 真正在撰写的正文，以及 Agent 只是携带的 dispatch prompt、review output 等内容。提交者报告，在 34 份 session transcript 中观察到 2,227 条 advisory；一些 scratch 目录里的文本其实属于 review loop 本身，如果把这些内容当成 Agent 自己创作的正文去改写，反而会篡改被传递的指令或历史记录。

它采用了两层处理：一方面用 `agent-io` 标记 carried text 的作用域；另一方面让 style audit 保持 **advisory only**。更关键的是，提交明确把这类 audit 放在正式 review loop 的旁边：audit 永远 exit 0，findings 不进入 reviewer prompt、不进入 Round history，也不进入 final verdict，因此它本身不能把 review loop 卡住或替 reviewer 下结论。

这与 CodeFlowMu 不是同一种实现，也不是同一层业务问题。

**Anywhere Agents：** authored / carried 内容边界 → advisory audit 不进入 verdict

**CodeFlowMu：** observation / delivery 边界 → EVAL 不进入正式 acceptance 与 lifecycle decision

两条工程路径共同说明了一件事：

> **审计信息可以很深、很丰富，但它是否拥有业务后果，必须由另一条明确的权力边界决定。**

Anywhere Agents 的提交不能证明 CodeFlowMu 的实现正确；CodeFlowMu 的 A2 数据也不能证明 Anywhere Agents 的审计模型适用于所有 Agent 系统。这里比较的是一个结构性选择：**观察可以参与判断，但不能自动冒充判断本身。**

---

## 6. 为什么这对数字员工特别重要？

在人类团队里，一个 QA、审计员或事实核查员写下“这里有问题”，大家通常知道这还不是最终业务决定。

Agent 系统没有这种天然常识。

如果 schema、API 和 UI 没有明确区分，一个模型生成的 observation 很容易沿着自动化链继续传播，最后变成：

**发现风险 → 自动拒绝 → 状态迁移 → 任务关闭**

整个过程甚至可能没有任何一个组件单独“做错”。真正的问题是：**没有地方负责阻止观察跨越成裁决。**

因此我们认为，一个长期运行的数字员工系统至少需要保存三类不同事实：

**观察事实 → 正式决定 → 生命周期结果**

三者应该可以相互引用，但必须保留各自的作者、依据和权限来源。这样才能回答：

- 谁发现了问题？
- 谁真正作出了决定？
- 决定依据了哪些观察？
- 哪个动作最终改变了任务状态？
- 如果观察后来被证明错误，业务决定能否单独复核？

这比简单记录一个 `approved=true` 或 `risk=high` 更重要。

---

## 7. 下一阶段不是让 EVAL 更强，而是让证据关系更清楚

这次修复证明的是一条负面边界：**EVAL 不应该通过普通 approve/reject 路径取得业务决定权。**

它并没有证明完整的审计治理体系已经完成。下一阶段更值得研究的是：怎样让 observation 本身更可追踪，同时仍然不扩大它的裁决权。

例如，一份观察未来可以明确关联：

- observation_id；
- observer / run；
- 被检查对象；
- 规则或事实来源；
- 支持证据；
- 哪个正式 REVIEW 引用了它；
- REVIEW 最终采纳、部分采纳还是不采纳；
- 哪个受控动作真正改变了生命周期。

这会形成一条更清楚的责任链：

**观察 → 被审阅 → 正式决定 → 状态变化**

而不是：

**观察 → 状态变化**

后者看起来自动化程度更高，实际上把最关键的责任边界删掉了。

---

## 最后：审计 Agent 最重要的能力，也许不是“判得准”

回到标题：为什么审计 Agent 不能替团队签字？

因为它的职责首先是扩大可见性，而不是扩大权力。

一个好的观察者应该能够发现矛盾、保存证据、指出风险，甚至比正式负责人看得更细；但最终是否接受交付，是另一类责任。把这两种能力拆开，不是削弱 Agent，而是在保护整个协作系统的可追责性。

所以这篇案例最终留下的原则不是“审计只能读，什么都不能做”，而是：

> **观察可以写入证据，但不能自动写入结论。**

> **看见问题，不等于有权裁决；能够提醒，不等于能够签字。**

对于数字员工系统，这条边界一旦模糊，最危险的并不是某次模型判断错误，而是一个原本没有责任授权的组件，悄悄取得了改变业务状态的能力。

---

## 公开证据

- [**查看 A2 基线、修复和重复操作记录（CSV）**](/evidence/execution-boundary-20260826/v2/case-a2-observer-semantic-trace.csv)
- [**查看 A2 脱敏测试摘录（GitHub）**](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/v2/transcript-a2.md)
- [**核对本文主张对应哪一条证据（GitHub）**](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/v2/claim-evidence-map.csv)
- [**查看公开、脱敏的 Execution Boundary 四案例数据包**](/zh/digital-employee/2026-08-26-execution-boundary-evidence-data)

## 来源与证据边界

### Anywhere Agents

- [**Yue Zhao / Anywhere Agents commit `53bd8fa`**](https://github.com/yzhao062/anywhere-agents/commit/53bd8fa43c7339ae9958c03c55434fac7baddaf3)，2026-08-26 复核。本文引用其 Agent I/O scope 与 advisory style audit 的工程选择：carried text 与 authored text 分开处理，advisory findings 不进入 reviewer prompt、Round history 或 final verdict，并且 audit 被设计为不会阻断 review loop。提交中关于 34 份 session transcript、2,227 条 advisory 及 359→2 findings 的数字均为原作者报告，本文没有独立复现实验。

### CodeFlowMu

本文关于 CodeFlowMu 的结论仅适用于 A2 公开证据覆盖的命名路径。公开记录支持：基线 7/7 与 4/4 没有覆盖真实缺陷；修复后治理内核 8/8、页面规则 6/6、Web Panel/API 109/109、EVAL closeout 18/18；重复 EVAL approve/reject 返回 audited no-change，不创建业务决定，不触发生命周期动作，生命周期任务文件保持不变。

这些证据**不证明**所有未来 UI、插件或外部集成都不存在旁路，也不证明 EVAL 的观察永远正确，更不证明完整的 provenance 或责任链已经实现。

原始日志、任务正文和本机路径不公开。研究结论应始终与对应版本、测试集合和工程证据一起阅读。
