---
title: "从‘证据不能串账’到动态诊断：CodeFlowMu V2.0.4 如何把研究结论做成工程能力"
date: '2026-08-27'
column: open-source-engineering
category: daily
article_type: engineering-case-study
edition: research-center
research_question: "一个关于证据归属的研究结论，怎样经过真实任务反例、误报修复和生命周期重算，变成可运行、只读、不会替业务裁决签字的诊断能力？"
summary: "R2 最初只是从 10 条历史 REPORT 中发现‘生命周期位置不能证明证据归属’。随后这个原则进入 CodeFlowMu，经历真实任务误报纠偏，并在 V2.0.4 中成为会随 active→review 动态重算的证据关联诊断。"
sources: "/zh/research/evidence/2026-08-27-r2-v204-evidence-association"
project_relevance: first-party-research
item_id: "RSEM-20260827-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-27-review-status-evidence-association-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-27-review-status-evidence-association-cover.png"
  kicker="开源工程观察 · 工程研究"
  title="从‘证据不能串账’到动态诊断：CodeFlowMu V2.0.4 如何把研究结论做成工程能力"
  summary="这不是一项先有产品、再补解释的功能。它从历史证据中的关联断点开始，经过真实任务反例纠偏，最后变成会随生命周期动态重算、但不替交付与验收签字的只读诊断能力。"
  version="RSEM-20260827-02"
  status="工程研究 · 2026-08-27"
  languageHref="/en/engineering/2026-08-27-review-status-evidence-association"
  languageLabel="English"
/>

# 从“证据不能串账”到动态诊断：CodeFlowMu V2.0.4 如何把研究结论做成工程能力

这篇文章最初只有一个很小的研究问题：**一张任务已经进入 `review`，能不能因此相信它旁边的 REPORT、执行记录和审查记录都属于同一条责任链？**

我们从一份固定历史切片里抽了 10 条 REPORT 做逐行对账。结果是：4 条可以用显式任务编号直接关联，4 条缺少动作侧任务编号，2 条在两份来源里给出了不同任务编号。

这组 `4 / 4 / 2` 从来不是故障率。它只是一个很小的历史样本。但它逼出了一个比样本数字更重要的结论：

> **生命周期位置只能说明任务走到了哪里，不能替证据归属签字。**

如果研究停在这里，它只是一条设计原则。真正有价值的部分发生在后面：我们把这条原则做进 CodeFlowMu；真实任务一运行，诊断器自己又产生了误报；我们再用现场事实修正诊断语义；到 V2.0.4，同一张任务从 `active` 进入 `review` 时，诊断链已经能够随阶段自动重算。

这是一条完整的 **研究发现 → 工程实现 → 真实反例 → 语义修复 → 再验证** 路径。

## 1. 理论起点不是“多做一张图”，而是拒绝替缺失证据补关系

最初的 10 条历史样本只使用两类显式字段：动作日志里写 REPORT 时记录的任务编号，以及 REPORT 账本中同一 REPORT 的任务编号。

规则故意非常死板：

| 两份来源 | 输出 | 系统不得做什么 |
| --- | --- | --- |
| 任务编号都存在且相同 | `linked` | 不需要额外推断 |
| 一侧缺少任务编号 | `missing` | 不按文件名、时间接近或角色猜归属 |
| 两侧任务编号都存在但不同 | `conflict` | 不替用户挑一边当“正确答案” |

公开脱敏样本最终是 `linked = 4`、`missing = 4`、`conflict = 2`。它真正验证的是读端纪律：**面对缺失和矛盾，不把不确定性剪掉。**

这也是 R2 的理论原点。它不是要发明一个新的“健康状态”，而是要把责任链拆成可以逐段核对的关系：

```text
TASK / 修订
→ attempt / lease
→ execution
→ 工具动作证据
→ REPORT
→ REVIEW / EVAL
→ 业务决定
```

关键不是箭头多，而是每条箭头都要回答：**为什么这两个对象可以连在一起？**

## 2. 第一次工程化之后，诊断器自己也暴露了“幻觉”

把理论写进代码并不意味着理论已经正确落地。

V2.0.3 后加入的第一版证据关联诊断，在真实任务 `TASK-20260827-024` 上出现了四类假阳性：任务与 attempt 修订冲突、REPORT 归属冲突、execution 缺失、正式 REVIEW 缺失。

问题并不是现场真的同时坏了四处，而是**诊断器用了错误的比较语义**。

现场复核后发现至少有三种典型错误：

1. **把不同语义域的摘要拿来直接比较。** 当前任务文件的合成摘要与 attempt 当时记录的修订并不是同一种 revision 语义，却被直接比较成冲突。
2. **把协作关系误当成所有权。** 子任务 REPORT 中的父任务、引用关系、`linked_task_ids` 可以说明协作上下文，但不能自动变成 REPORT 的直属任务归属。
3. **把“还没物化”写成“没有执行”。** 正式 attempt 已经有 `session_id`，Runtime 事件和回执也存在，但持久 SessionStore 尚未落盘时，初版诊断直接报 `execution_not_found`。

这一步对我们很重要。因为它说明：

> **一个负责检查证据的工具，本身也可能因为语义偷换而制造假证据。**

所以“发现越多问题”从来不是诊断器的质量指标。V2.0.4 的目标反而是：**只在同对象、同阶段、同语义域的明确证据之间产生冲突。**

## 3. V2.0.4 的修复，不是增加容错，而是收紧“什么有资格叫冲突”

V2.0.4 对 R2 做了几项关键收紧。

第一，只有双方都提供可比较的显式修订时，才允许判断 revision 冲突；当前文件摘要只用于缓存和变化检测，不再冒充业务修订。

第二，REPORT 的归属只接受直接 `task_id` / `source_task_id`。父任务、普通引用和关联任务列表都不能替所有权签字。

第三，如果 dispatch attempt 已经持有正式 `session_id`，即使 SessionStore 尚未落盘，也可以从只读 Runtime 事实构造 execution 投影，继续核对 attempt → execution → action，而不是提前报缺失。

第四，同一任务同时存在进度报告和最终报告时，不再拿“较早但看起来相关”的 REPORT 去配 REVIEW。V2.0.4 使用任务声明的 `current_final_report_id` 作为当前正式报告锚点。真实现场 `TASK-20260827-024` 最终选择 `REPORT-20260827-028-PM-to-ADMIN` 与对应 REVIEW，现场复算回到 `linked=6 / missing=0 / conflict=0`。

第五，诊断快照升级到 schema 3，签名使用 `diag3:`；旧的 `diag1:` / `diag2:` 缓存不会继续把历史误报留在当前队列里。

这里的工程原则很值得保留：

> **诊断器不能靠扩大推断范围来减少“未知”，只能靠更准确的事实锚点来减少误报。**

## 4. 真正证明它已经工程化的，不是代码存在，而是同一任务会随阶段重算

这次我们拿到了两张非常关键的一手实机截图。它们不是两张不同任务，而是同一张：

`TASK-20260827-030-PM-to-QA`

第一张截图时，它还在 `active`；第二张截图时，同一任务已经进入 `review`。

这让我们第一次能直接看到：**证据关联诊断不是静态任务详情，而是一份随正式生命周期与当前事实重新计算的诊断投影。**

![图 2：同一任务从 active 到 review 时，证据关联诊断随阶段变化](/assets/figures/2026-08-27-review-status-evidence-association-v204-dynamic.svg)

*图 2：根据同一任务两次 CodeFlowMu V2.0.4 本地实机截图结构化整理。公开图省略本机绝对路径、实例 nonce 和无关控制台内容；对应结构化转录与检查脚本已公开。来源：第一方本地实机观察。*

### 阶段 A：`active` —— 没有 REPORT，不等于 REPORT 缺失

在 `active` 截图中，诊断摘要明确显示：

- 已关联：4
- 缺失：0
- 冲突：0
- 仅旁观：0

已经可以确认的链路包括：

- 任务修订 → attempt：已关联
- attempt → lease：已关联
- attempt → 执行：已关联
- 执行 → 工具证据：已关联

而 REPORT 相关两条链并没有被标红：

- `REPORT → Task`：**当前阶段不适用**，`lifecycle_does_not_require_report`
- `REPORT → REVIEW`：**当前阶段不适用**，`report_not_available`

这不是一个小 UI 文案差别，而是诊断语义是否成熟的分界线。

如果系统看到 REPORT 尚未产生就报 `missing`，用户会被迫处理一个根本不存在的故障。V2.0.4 在这里回答的是：**当前阶段本来就不要求这份证据，所以“不适用”不是“缺失”。**

### 阶段 B：`review` —— REPORT 到达后，链条自动补全

同一张任务随后进入 `review`。第二张截图中，诊断没有靠人工改标签，而是随着正式事实变化重新计算：

- attempt → lease：已关联
- attempt → 执行：已关联
- 执行 → 工具证据：已关联
- REPORT → Task：已关联
- REPORT → REVIEW：已关联

此时 `EVAL → REVIEW` 仍然显示：

**当前阶段不适用 · `eval_not_present`**

这同样很重要。没有 EVAL，并不自动意味着 REVIEW 有问题；如果当前流程没有产生 EVAL，诊断器就应该诚实写“不存在 / 不适用”，而不是为了把图画满而补一条关系。

第二张截图还出现了两个真正面向工程使用的动作：

- **复制对账摘要**
- **重新检查证据关联**

后者对应 API 的 `refresh=1`：可以绕过已有缓存重新读取当前正式事实，但仍然只产生诊断快照，不写 TASK、REPORT、REVIEW、lease 或 lifecycle。

这就是“动态诊断”与“静态展示”的区别。

## 5. 为什么“当前阶段不适用”是一个很重要的工程状态

许多诊断系统只会输出“正常 / 异常”。这在 Agent Runtime 中是不够的，因为证据要求本身具有阶段性。

一个 `active` 任务没有最终 REPORT，可能完全正常；一个已经进入 `review` 的任务没有正式 REPORT，则可能需要关注；一个没有 EVAL 的 REVIEW，也不能仅凭“没有 EVAL”就判定失败。

因此 V2.0.4 的边不是简单二值，而至少区分：

- `linked`：存在明确稳定键，关系可直接确认；
- `missing`：当前阶段应该有，但证据确实没有找到；
- `conflict`：两个可比较的明确事实互相矛盾；
- `not_applicable`：当前阶段或当前对象本来就不要求这条关系；
- `observer_only`：存在旁观核查，但它没有生命周期裁决权。

这套分类真正解决的是**误报成本**。如果 `not_applicable` 被压成 `missing`，诊断器会制造工作；如果 `observer_only` 被压成“已审核”，诊断器又会越权替正式流程签字。

## 6. 它为什么必须一直是“X 光机”，而不能变成裁判

V2.0.4 的任务详情里有一句边界说明，我认为比“已关联 5 条”更重要：

> **此结论只描述证据关系，不表示任务已交付或验证通过。**

这句话把证据关联和业务裁决明确拆开。

`REPORT → REVIEW = linked` 只说明：当前被任务锚定的正式 REPORT 和这份 REVIEW 的稳定键能够对应。

它不说明：

- REPORT 内容真实；
- REVIEW 的结论一定正确；
- QA 已经通过；
- ADMIN 已经接受交付；
- 任务可以进入 `done`。

因此诊断工具本身被设计成只读旁路：Reader 读取正式事实并生成 snapshot；HTTP 接口返回 `diagnostic_only: true`；读取失败时甚至明确写“诊断暂不可读，不影响正式状态”；顶部队列也只收真正的 `conflict`，不会因为缺少当前阶段不要求的证据就制造治理动作。

这和我们最近几篇研究反复出现的一条规律完全一致：

> **看见关系，是一种观察能力；批准交付，是另一种权力。**

## 7. 这次案例真正值得记录的是“研究—工程闭环”

回头看 R2 的演化，它不是一次常见的“先做功能，再写文章”。顺序恰好相反：

**第一步：研究历史数据。** 10 条 REPORT 暴露 `4 linked / 4 missing / 2 conflict`，得到“位置不是归属证明”的理论判断。

**第二步：把判断工程化。** 建立只读 Evidence Association Reader，把 TASK、attempt、lease、execution、action、REPORT、REVIEW、EVAL 拆成显式关系边。

**第三步：真实现场反驳第一版实现。** `TASK-20260827-024` 证明诊断器会因为跨语义比较、错误 REPORT ownership 和未物化 Session 产生假阳性。

**第四步：根据反例修改工程语义。** V2.0.4 收紧 revision 比较、直属 REPORT 归属、execution 投影、正式 final REPORT 锚点和缓存 schema。

**第五步：再回到真实运行。** `TASK-20260827-030-PM-to-QA` 从 `active` 进入 `review`，同一诊断自动从“REPORT 当前不适用”变为“REPORT → Task / REVIEW 已关联”，而不存在的 EVAL 继续保持不适用。

这才是这项工作的研究价值：**理论不是一句架构口号，工程也不是理论的简单翻译。二者之间必须允许真实现场反过来修改我们的判断。**

## 8. 公开复核：从历史样本到 V2.0.4 动态现场

完整的 [R2 → CodeFlowMu V2.0.4 工程化证据包](/zh/research/evidence/2026-08-27-r2-v204-evidence-association) 已单独公开。

原来的 R2 证据仍然保留，因为它记录理论从哪里来：

- [10 条脱敏 REPORT 关联样本](/assets/evidence/2026-08-27-r2-report-association-fixture.json)
- [公开 Reader](/assets/evidence/2026-08-27-r2-association-reader.mjs)
- [公开检查脚本](/assets/evidence/2026-08-27-r2-association-reader-check.mjs)

这次又增加了 V2.0.4 的动态现场转录：

- [同任务 active / review 两阶段结构化快照](/assets/evidence/2026-08-27-r2-v204-dynamic-diagnostic-snapshots.json)
- [两阶段一致性检查脚本](/assets/evidence/2026-08-27-r2-v204-dynamic-diagnostic-check.mjs)

运行第二个检查：

```text
node 2026-08-27-r2-v204-dynamic-diagnostic-check.mjs
```

预期输出：

```json
{"fixture":"first_party_ui_observation_transcript","same_task":true,"transition":"active_to_review","status":"PASS"}
```

公开结构化快照来自两张同任务本地实机截图的逐项转录。为了避免把本机绝对路径、实例标识和无关控制台内容扩散到公开材料，公开包保留的是任务相对生命周期位置、可见关联边、状态和 reason code；它不是整个 V2.0.4 产品的端到端认证。

## 结论：最好的工程能力，往往不是把理论“实现出来”，而是让理论经得起实现后的反驳

R2 一开始只想回答：“REPORT 有没有串账？”

真正做下去以后，我们发现更难的问题是：**诊断器怎样证明自己没有串错账？**

V2.0.4 的价值不在于任务详情多了一块卡片，而在于它建立了一个更严格的工程边界：关系只由可比较的正式事实形成；阶段不要求的证据不会误报缺失；冲突必须来自明确矛盾；诊断只观察，不修改正式流程；即使所有边都已关联，也不能替交付和验收签字。

而同一任务从 `active` 到 `review` 的两张截图，让这个边界第一次变得非常具体：

> **证据诊断不是给任务贴一个静态标签，而是随着正式事实变化，持续回答“现在有哪些关系能够被证明”。**

这就是从研究结论走到工程能力之后，我们真正想保留下来的东西。

---

## 来源与证据边界

- R2 的历史 `4 / 4 / 2` 只来自固定的 10 条脱敏 REPORT 样本，不是故障率、总体质量指标或统计结论。
- CodeFlowMu V2.0.4 的工程说明记录了 V2.0.3 初版诊断在 `TASK-20260827-024` 上的假阳性，以及 V2.0.4 对 revision 语义、REPORT ownership、execution 投影和 `current_final_report_id` 锚点的修复；本文据此描述工程演化，不把工程候选状态写成正式发布标签。
- `TASK-20260827-030-PM-to-QA` 的 active / review 对照来自两张同任务本地实机截图。公开材料是结构化转录，不包含本机绝对路径和无关运行内容。
- 本文只证明这条研究—工程链路和已披露的动态诊断语义；不据此声称所有任务、所有生命周期组合或全部桌面端 / PWA 路径都已获得完整证据关联认证。
