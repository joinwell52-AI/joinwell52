---
title: "R2 → CodeFlowMu V2.0.4：证据关联诊断工程化证据包"
date: '2026-08-27'
---

# R2 → CodeFlowMu V2.0.4：证据关联诊断工程化证据包

状态：**Published**。

本页记录一条完整的研究—工程链路：固定历史 REPORT 样本先暴露“生命周期位置不能证明证据归属”；随后 R2 被实现为只读证据关联诊断；第一版真实任务又暴露诊断器自身的假阳性；V2.0.4 收紧语义后，再用另一张真实 QA 任务做正向验证：同一任务从 `active` 进入 `review`，诊断随阶段准确变化，截图可见范围内没有把正常的“不适用”误报成缺失或冲突。

本页不是产品认证，也不把诊断结果升级成任务交付或验收结论。

## 1. 理论来源：10 条历史 REPORT

公开材料：

- [10 条脱敏 REPORT 关联样本](/assets/evidence/2026-08-27-r2-report-association-fixture.json)
- [公开 Reader](/assets/evidence/2026-08-27-r2-association-reader.mjs)
- [公开检查脚本](/assets/evidence/2026-08-27-r2-association-reader-check.mjs)

固定样本输出：`linked = 4`、`missing = 4`、`conflict = 2`。

这不是故障率。它只支持一条研究结论：**位置不是归属证明；缺失与冲突不能通过猜测被补成关联。**

运行：

```text
node 2026-08-27-r2-association-reader-check.mjs
```

预期：

```json
{"fixture":"deidentified_historical_association","counts":{"linked":4,"missing":4,"conflict":2},"status":"PASS"}
```

## 2. 工程实现：R2 变成只读关联诊断

V2.0.4 的第一方实现把关系拆成多条显式边，包括：

```text
TASK / 修订 → attempt → lease
                 └→ execution → action evidence
REPORT → Task
REPORT → REVIEW
EVAL → REVIEW
```

诊断只读取正式事实源并生成派生 snapshot；API 返回 `diagnostic_only: true`。诊断读取失败时不修改正式状态，冲突队列只收 `conflict > 0` 的 snapshot。

## 3. 反例现场：第一版诊断器自己产生假阳性

真实任务 `TASK-20260827-024` 暴露过 revision mismatch、REPORT ownership conflict、execution missing、formal REVIEW missing 等假阳性。

现场复核表明，问题来自诊断语义而不是真实业务同时损坏：

- 不同语义域的摘要被错误比较为同一种 revision；
- 子任务 REPORT 的父任务/引用关系被误当成直属 ownership；
- attempt 已有正式 `session_id`，但持久 SessionStore 尚未落盘时被误写成 execution 缺失；
- 同一任务存在 progress REPORT 与 final REPORT 时，较早报告可能被错误拿去匹配当前 REVIEW。

V2.0.4 因此收紧规则：只比较同语义域显式修订；REPORT ownership 只认直接稳定键；允许从正式 Runtime 只读事实投影 execution；使用 `current_final_report_id` 锚定当前正式 REPORT；缓存升级到 schema 3 / `diag3:`。

`TASK-20260827-024` 的现场复算最终选择 `REPORT-20260827-028-PM-to-ADMIN` 与对应 REVIEW，结果为 `linked=6 / missing=0 / conflict=0`。

## 4. 正向验证现场：同一 QA 任务从 `active` 到 `review`

两张本地实机截图对应同一任务：

`TASK-20260827-030-PM-to-QA`

这是 **QA 任务**。这组截图不是误报现场，而是 V2.0.4 修复后的正向验证。

公开结构化材料：

- [active / review 两阶段快照](/assets/evidence/2026-08-27-r2-v204-dynamic-diagnostic-snapshots.json)
- [两阶段一致性检查](/assets/evidence/2026-08-27-r2-v204-dynamic-diagnostic-check.mjs)
- [同任务两阶段对照图](/assets/figures/2026-08-27-review-status-evidence-association-v204-dynamic.svg)

### `active` 阶段

截图可见摘要：`linked=4 / missing=0 / conflict=0 / observer_only=0`。

可见已关联：任务修订→attempt、attempt→lease、attempt→执行、执行→工具证据。

此时任务尚未形成正式 REPORT，所以 REPORT 相关边被正确标记为“不适用”，而不是缺失：

- `REPORT → Task`：`not_applicable` / `lifecycle_does_not_require_report`
- `REPORT → REVIEW`：`not_applicable` / `report_not_available`

这里的关键证据是：**没有 REPORT 是阶段正常事实，因此 `missing=0`、`conflict=0` 才是准确诊断。**

### `review` 阶段

同一任务进入 `review` 后，正式 REPORT 与 REVIEW 已出现，对应关系准确转为：

- attempt→lease：linked
- attempt→执行：linked
- 执行→工具证据：linked
- REPORT→Task：linked
- REPORT→REVIEW：linked

`EVAL → REVIEW` 仍为：

- `not_applicable` / `eval_not_present`

这也是正确结果，而不是缺失：**这是一张 QA 任务；当前工作流中 EVAL 出现在 PM 路径，这张 QA 任务本来就不要求 EVAL 报告。**

因此这组前后截图证明的是：同一任务从 `active` 到 `review`，诊断按阶段变化准确重算；该出现的 REPORT 关系在进入审查后出现，不应要求的 REPORT/EVAL 关系不会被误报成缺失或冲突。

界面同时提供“复制对账摘要”和“重新检查证据关联”。后者只刷新诊断读取，不驱动生命周期。

运行公开检查：

```text
node 2026-08-27-r2-v204-dynamic-diagnostic-check.mjs
```

预期：

```json
{"fixture":"first_party_ui_observation_transcript","same_task":true,"role":"QA","transition":"active_to_review","no_visible_false_positive":true,"status":"PASS"}
```

## 5. 最重要的裁决边界

V2.0.4 界面明确提示：

> **此结论只描述证据关系，不表示任务已交付或验证通过。**

因此 `REPORT → REVIEW = linked` 只证明稳定键关系成立，不证明 REPORT 内容真实、REVIEW 结论正确、QA 已通过、ADMIN 已接受或任务可进入 `done`。

## 6. 公开边界

- 历史 `4/4/2` 只来自固定 10 条样本。
- `TASK-20260827-024` 是第一版诊断误报的反例现场；`TASK-20260827-030-PM-to-QA` 是 V2.0.4 修复后的正向验证现场，两者不能混写。
- V2.0.4 动态现场来自两张同任务本地实机截图；公开材料是结构化转录，省略本机绝对路径、实例标识和无关控制台内容。
- “没有误报”只限于截图实际展示的这些关联边和阶段语义，不外推为所有任务、所有生命周期组合、桌面端或 PWA 路径都已认证。
- CodeFlowMu V2.0.4 工程说明当前仍区分工程候选与正式 RELEASED 标签；本文不越过该发版边界。
