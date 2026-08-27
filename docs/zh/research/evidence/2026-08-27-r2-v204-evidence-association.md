---
title: "R2 → CodeFlowMu V2.0.4：证据关联诊断工程化证据包"
date: '2026-08-27'
---

# R2 → CodeFlowMu V2.0.4：证据关联诊断工程化证据包

状态：**Published**。

本页记录一条完整的研究—工程链路：固定历史 REPORT 样本先提出“生命周期位置不能证明证据归属”；随后 R2 被实现为只读证据关联诊断；开发阶段再用真实任务校准 revision、REPORT ownership、execution 与 final REPORT 锚点等语义；最终能力进入 CodeFlowMu V2.0.4 正式版本，并用同一 QA 任务的 `active → review` 实机页面做动态验证。

本页不是产品认证，也不把证据关联结果升级成任务交付或验收结论。

## 1. 理论来源：10 条历史 REPORT

公开材料：

- [10 条脱敏 REPORT 关联样本](/assets/evidence/2026-08-27-r2-report-association-fixture.json)
- [公开 Reader](/assets/evidence/2026-08-27-r2-association-reader.mjs)
- [公开检查脚本](/assets/evidence/2026-08-27-r2-association-reader-check.mjs)

固定样本输出：`linked = 4`、`missing = 4`、`conflict = 2`。

这不是故障率。它只支持一条研究结论：**位置不是归属证明；缺失与冲突不能通过猜测被补成关联。**

## 2. 工程实现：R2 变成只读关联诊断

V2.0.4 的第一方实现把关系拆成多条显式边，包括：

```text
TASK / 修订 → attempt → lease
                 └→ execution → action evidence
REPORT → Task
REPORT → REVIEW
EVAL → REVIEW
```

诊断只读取正式事实源并生成派生 snapshot；API 返回 `diagnostic_only: true`。诊断读取失败时不修改正式状态，冲突队列只收真正的冲突 snapshot。

## 3. 开发阶段真实任务校准

`TASK-20260827-024` 用于开发阶段的现场语义校准，不作为正式版本故障案例。

这组真实任务数据帮助收紧了几项工程合同：

- 不把不同语义域的摘要直接比较为同一种 revision；
- 子任务 REPORT 的父任务/引用信息不自动变成直属 ownership；
- attempt 已有正式 `session_id` 和 Runtime 事实时，不仅凭某个持久视图尚未物化就判 execution 不存在；
- 同时存在 progress REPORT 与 final REPORT 时，以 `current_final_report_id` 作为当前正式 REPORT 锚点；
- 诊断快照升级到 schema 3 / `diag3:`，保证当前语义重新计算。

这些是新能力在开发过程中正常的工程收敛：定义清楚“什么可以比较、什么可以关联、什么只能不适用或保持未知”。

## 4. V2.0.4 正式版本实机验证：同一 QA 任务从 `active` 到 `review`

两张本地实机页面对应同一任务：

`TASK-20260827-030-PM-to-QA`

这是 **QA 任务**，也是 V2.0.4 功能完成后的正式版本实机观察。

公开结构化材料：

- [active / review 两阶段快照](/assets/evidence/2026-08-27-r2-v204-dynamic-diagnostic-snapshots.json)
- [两阶段一致性检查](/assets/evidence/2026-08-27-r2-v204-dynamic-diagnostic-check.mjs)

原始页面截图由作者另行上传，作为本文的一手 UI 证据。

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

因此这组前后页面说明的是：同一任务从 `active` 到 `review`，诊断按阶段与角色要求动态重算；该出现的 REPORT 关系在进入审查后出现，不应要求的 REPORT/EVAL 关系保持“不适用”。

## 5. 最重要的裁决边界

V2.0.4 界面明确提示：

> **此结论只描述证据关系，不表示任务已交付或验证通过。**

因此 `REPORT → REVIEW = linked` 只证明稳定键关系成立，不证明 REPORT 内容真实、REVIEW 结论正确、QA 已通过、ADMIN 已接受或任务可进入 `done`。

## 6. 公开边界

- 历史 `4/4/2` 只来自固定 10 条样本。
- `TASK-20260827-024` 只用于开发阶段语义校准，不描述为正式产品故障。
- `TASK-20260827-030-PM-to-QA` 来自 V2.0.4 正式版本的同任务 `active → review` 实机观察。
- 原始页面截图由作者另行上传；当前公开结构化材料保留任务阶段、可见关系状态和 reason code。
- 本证据只支持已披露的研究—工程链路和动态诊断语义，不外推为所有任务、所有生命周期组合或全部桌面端 / PWA 路径都已认证。
