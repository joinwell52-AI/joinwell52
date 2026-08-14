# Research Runtime Center V5.0 — 冻结运行章程

**项目：** joinwell52 Research Center  
**调度器：** Research Runtime Scheduler V3.0  
**运营中心：** V5.0  
**架构状态：** 四 Runtime 家族与 Daily 六阶段边界冻结；恢复治理已纳入正式运行规则  
**生效日期：** 2026-08-05  
**恢复规则更新：** 2026-08-09  
**时区：** `Asia/Shanghai`  
**唯一事实源：** `joinwell52-AI/joinwell52`

## 1. V5 边界

Research Runtime Center V5.0 将运行体系拆分为四套：Daily Runtime、Weekly Runtime、Academic Runtime、Research Program Runtime。Research Program 不得占用 Daily Runtime 的阶段、栏目或生产时间。

## 2. Daily Runtime 完整闭环

```text
09:00 Discovery → Signal Pool
10:00 Queue → Today's Research Plan
11:00 Reading → Reading Result
13:00 Analysis → Research Object
15:00 Production → Publication Candidate
20:00 Publication → GitHub + Website + Commit Verify + Release
```

三个栏目为 Digital Employee、Industry Architecture、Open-source Engineering。

### 阶段门禁

```text
Discovery → Queue → Reading → Analysis → Production → Publication
```

后置阶段只有在直接前置阶段 `Completed` 后才可启动。Reading 只能消费当天已选对象；Analysis 只能消费 Reading Result；Production 只能消费 Research Object；Publication 只能消费完整 Publication Candidate，并禁止重新研究、实质性重写或补救证据。

## 3. 独立 Runtime

- **Weekly Runtime：** 周日 20:30；只有当天 Publication `Completed` 后才可进入当日恢复队列。周日因此共有 7 个当天任务。
- **Academic Runtime：** 周三 16:00，只处理 Paper、Benchmark、Specification、Institution。
- **Research Program Runtime：** 周一 12:00，独立推进 TMPA、FCoP、CodeFlowMu、Digital Employee、Research Operating System。

## 4. Scheduler V3.0：唤醒而非时钟真相

权威机器清单为 [`SCHEDULER.json`](./SCHEDULER.json)。GitHub Actions schedule 只负责唤醒 Scheduler，不保证某一个 heartbeat 必然准时到达；真正的调度事实由 `SCHEDULER.json + Runtime Record + 当前 Asia/Shanghai 时间` 共同决定。

heartbeat 使用错峰分钟。每次 heartbeat 都重新计算当天已经到时的任务，并遵守以下规则：

1. `Running / Completed / Failed / Skipped` 不自动重开；
2. `Waiting` 只有在直接前置依赖 `Completed` 后才可执行；
3. `Blocked` 只有在明确属于依赖型阻塞且 `blockedBy` 对应依赖已经 `Completed` 后才可受控重开；
4. 所有可执行欠班按正式时间排序；
5. **一次 heartbeat 只打开最早的一个可执行欠班**；
6. 下一 heartbeat 再继续向后追赶。

因此连续漏掉 heartbeat 只会造成延迟，不应导致当天任务永久过期，也不会为了追赶而并发打开多个依赖阶段。

## 5. Blocked 恢复治理

依赖型 Blocked 必须尽可能写出机器可读字段：

```json
{
  "status": "Blocked",
  "blockedBy": "reading"
}
```

依赖完成后，Scheduler 使用 Runtime V5 的受控 `reopen-blocked` 路径重新打开该阶段。重开时删除旧的当前 result block，但保留历史 timeline，因此“曾经 Blocked”仍然可审计。普通 Blocked 不因时间推移自动恢复。

## 6. 四类 Runtime Record 与人类账本

```text
research/runtime/records/daily/YYYY/MM/YYYY-MM-DD-daily-runtime.json
research/runtime/records/weekly/YYYY/MM/YYYY-MM-DD-weekly-runtime.json
research/runtime/records/academic/YYYY/MM/YYYY-MM-DD-academic-runtime.json
research/runtime/records/program/YYYY/MM/YYYY-MM-DD-program-runtime.json
```

Daily JSON 必须同时维护：

```text
research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md
```

JSON 是机器事实源；Markdown 是强制人类可读投影。Markdown 必须保留 Execution Slot Opened、Running、Completed/Blocked/Failed/Skipped、Commit Verify 等时间点，并展示 Input、Work Result、Output、Next、Metrics、Evidence、Artifacts。四种终态必须经过同一条持久化与 GitHub 核验通道；业务失败也必须关闭 Running 租约，不能留下“结果已 Failed、控制面仍 Running”的半状态。

结构化 narrative、legacy metric `name`、字符串或对象 evidence/artifact 都必须可正确投影；`[object Object]`、伪 Evidence 占位、机器状态与 Markdown 状态不一致均属于投影故障。

## 7. 班次成果合同

所有终态班次必须输出：

```text
Input
Work Result
Output
Next
Metrics
Evidence
Artifacts
```

机器合同为 `runtime-shift-result/v2`。Runtime V5 校验器必须兼容仓库中已经存在的合法扁平双语结果和结构化 V5 narrative；历史合法结果不得阻断 Scheduler 控制面。

## 8. 强制自我检查

每次 Scheduler 打开或恢复执行槽后，控制面至少完成：

```text
Runtime V5 validate
→ Markdown render
→ Markdown validate
→ durable Git commit
→ fetch / ancestor verify
→ taskStatus == Running verify
→ Execution Slot Opened event verify
```

Worker 完成班次后仍需验证 result contract、成果文件、Git Commit 与 Commit Verify。不能因为 Actions 显示 success 就推断研究工作已经完成。

## 9. 故障恢复顺序

任何漏班或中断都按以下顺序处理：

```text
确认 durable facts
→ 找到最早未完成/可恢复缺口
→ 检查并修复其直接依赖
→ 只打开该阶段
→ Runtime + Markdown 自检
→ 持久化并 Commit Verify
→ 再允许下一阶段
```

禁止按“当前几点”直接跳到后置阶段，禁止同时打开多个依赖阶段，禁止为了赶进度伪造 Completed。

## 10. 2026-08-09 Recovery Case

周日应有 7 个任务。当天 Discovery、Queue 完成后，Reading 漏班；Analysis 曾在 Reading 未完成时打开并按门禁形成 Blocked。排查同时暴露 Runtime V5 对既有结构化 result 的兼容问题，以及 Markdown 对结构化 Queue result 的 `[object Object]` 投影问题。

正式修复包括：恢复 Reading；为 Analysis 记录 `blockedBy: reading`；增加严格依赖门禁和 dependency-ready Blocked 重开；兼容合法历史 result；修复 Markdown 投影；全量 Runtime V5 校验；移除一次性 hotfix。该案例成为 Research Report Production Engine V2.0 的首个生产恢复证据。

## 11. 网站与权威性

GitHub 是唯一事实源。正式发布只有完成以下链路才算结束：

```text
Runtime Result
→ Durable Artifacts
→ GitHub Commit
→ Commit Verify
→ Website Projection
→ Release
```

Runtime Dashboard 只展示 Daily；Weekly、Academic、Program 保持独立入口，但同日人类复合账本可以显示命中星期的正式任务。

## 12. 冻结规则

V5.0 的四 Runtime 家族边界、Daily 六阶段身份和 Scheduler V3.0 正式任务身份继续冻结。2026-08-09 增加的是恢复治理与自检规则，不改变上述业务阶段定义。后续允许优化来源质量、Worker 性能、恢复算法、指标、页面体验与出版质量，但不得重新混合 Program 与 Daily Runtime。
