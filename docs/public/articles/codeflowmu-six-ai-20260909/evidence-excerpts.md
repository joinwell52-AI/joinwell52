# 真实文件摘录与来源

备份批次：`20260909T143927586105Z-cursor-final-eval-success`。正文仅节选字段与报告段落；完整文件SHA256用于核对保存版本，不单独证明业务结论。

## task

原始文件：`fcop/_lifecycle/done/TASK-20260909-005-PM-to-QA.md`

SHA256：`219465f7964b05b6271a7f918f5040d58eac3c5c3c61042fcdf1689c38502984`

选取行号（按解码后的原文件splitlines计）：4, 5, 6, 7, 10, 14, 15, 16, 18。

```yaml
task_id: TASK-20260909-005
root_task_id: TASK-20260909-001
sender: PM
recipient: QA
parent: TASK-20260909-001
depends_on: []
acceptor: PM
rerun_of: TASK-20260909-003
subject: 只读核查 FCoP 落地与角色权限职责边界（模型修复后重跑）
```

## review

原始文件：`fcop/reviews/REVIEW-20260909-001-REVIEW-GATE-on-TASK-20260909-002.md`

SHA256：`80e8df7a817456cc7cf67aa608d3bd209f445bc71c709bc8658771fcbdd2ec6f`

选取行号（按解码后的原文件splitlines计）：4, 7, 8, 13, 22, 16, 18, 23。

```yaml
kind: fact_check
task_id: TASK-20260909-002
report_id: REPORT-20260909-001-DEV-to-PM
review_state: needs_pm
execution_evidence_state: verified
business_decision: false
attention_owner: PM
third_party_source_state: not_configured
```

## report

原始文件：`fcop/reports/REPORT-20260909-004-PM-to-ADMIN.md`

SHA256：`5aae11863990c7e039dd97702cea23c9573ba1c571c64d3b03c9225e63a5e3e3`

选取位置：子任务回执三条、说明段。换行归一化，文字未改。

```markdown
## 子任务回执
- `REPORT-20260909-001-DEV-to-PM.md` ← `TASK-20260909-002`（approved）
- `REPORT-20260909-002-OPS-to-PM.md` ← `TASK-20260909-004`（approved）
- `REPORT-20260909-003-QA-to-PM.md` ← `TASK-20260909-005`（approved；`rerun_of` 作废的 `TASK-20260909-003`）

## 说明
全程保持只读巡检目标；PM 未修改业务代码/配置。根任务业务验收与归档由 ADMIN 决定。
```

