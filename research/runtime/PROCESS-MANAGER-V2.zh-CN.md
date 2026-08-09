# Research Runtime Process Manager V2.0 — 即时补班与顺序推进规范

**生效日期：** 2026-08-09  
**时区：** `Asia/Shanghai`  
**适用系统：** Research Runtime Center V5.0 / Scheduler V3.0  
**事实源：** `SCHEDULER.json + Runtime Record + Runtime Result`

## 1. 核心语义

正式时间只决定任务何时进入 `due`，不直接指定当前必须执行哪个阶段。

```text
时间到达
→ reconcile
→ 找到截至当前最早的未完成任务
→ 检查直接前置是否 Completed
→ 只允许该任务进入执行
```

当任务已经延误时，它进入**补班模式**。补班模式不再等待下一个正式时间点：

```text
上一个补班 Completed
→ Completion Workflow 成功
→ workflow_run 立即唤醒 Scheduler
→ 立即 reconcile
→ 若下一环已经 due 且依赖满足，立即启动下一环
```

因此，补班链的正确语义是：**完成即推进，cron 只兜底。**

## 2. 双触发模型

### 2.1 事件驱动主路径

```text
Worker 形成 durable result + artifacts
→ 写入 completion request
→ Research Runtime Shift Completion V2.0
→ result contract validate
→ Markdown render / validate
→ durable commit + verify
→ workflow_run
→ Research Runtime Scheduler V3.0
→ 打开最早的下一项 overdue work
```

Completion Request 合同：

```json
{
  "schema": "runtime-shift-completion-request/v1",
  "task": "production",
  "date": "2026-08-09",
  "resultPath": "research/runtime/results/2026/08/2026-08-09-production-result.json"
}
```

### 2.2 Heartbeat 兜底路径

GitHub schedule heartbeat 继续按错峰分钟运行，但只承担：

- 在 Completion Event 丢失时重新 reconcile；
- 检查欠班；
- 检查依赖型 Blocked；
- 检查 Running Lease；
- 修复顺序异常。

heartbeat 不再是补班链向前推进的唯一条件。

## 3. 顺序不变量

Daily / Sunday 链：

```text
Discovery
→ Queue
→ Reading
→ Analysis
→ Production
→ Publication
→ Weekly (Sunday)
```

任何任务进入 Running 或 Completed 时，其直接前置必须为 Completed。

一次 reconcile 只打开一个最早的可执行任务。若该任务完成且下一环已经 overdue，Completion Event 会立即产生下一次 reconcile；这不是并发打开多个任务。

## 4. 时间判断

任务可执行必须同时满足：

```text
formal time 已到（允许配置的 lead window）
AND task 未完成
AND direct dependency = Completed
AND 没有更早的可执行欠班
```

未来任务不能因为前置提前完成而提前启动。例如 Production 在 17:47 完成后，20:00 Publication 仍保持 Waiting；到 20:00 后才可被 schedule 或 completion-driven reconcile 打开。

## 5. Running 的准确性

`Running` 是有期限的执行租约，不是永久事实。

- Scheduler 打开执行槽并写入 `Execution Slot Opened`；
- Worker 必须形成成果并通过 Completion Workflow；
- 超过任务 Lease 仍无终态结果时，Watchdog 写入 `Running Lease Expired`；
- 过期任务返回受治理恢复，不得无限显示“工作中”。

当前 Lease：

| 任务 | Lease |
|---|---:|
| Queue | 30 分钟 |
| Discovery | 45 分钟 |
| Reading / Analysis | 60 分钟 |
| Production / Weekly / Academic | 90 分钟 |
| Publication | 60 分钟 |
| Program | 120 分钟 |

## 6. 前端同步

Runtime 页面必须使用同一份 live Runtime Record：

- 正式任务卡；
- V2.0 顺序恢复进程；
- 当前处理 / 下一环；
- 已完成计数。

静态 Pages 数据只用于首屏兜底；页面运行后定期读取 GitHub `main` 的当天 Runtime Record。后台状态提交后，Scheduler / Completion workflow 的 `workflow_run` 还会显式触发 Pages Build、Verify、Publish。

禁止同一页面出现“进程条显示补班中、任务卡显示已完成”的双事实。

## 7. 自检链

每次完成与推进都必须经过：

```text
result contract validate
→ Runtime V5 validate
→ Markdown render
→ Markdown validate
→ durable Git commit
→ ancestor / state verify
→ immediate reconcile
→ Pages Build / Verify / Publish
```

## 8. 2026-08-09 生产验证

当天 Analysis 完成后，旧流程因只等待 cron，Production 没有立即启动。修复后：

- Completion-driven Scheduler 主路径落地；
- 17:32 的即时 kick 打开 Production；
- Production 形成三组中英文候选与三张语义图；
- `Research Runtime Shift Completion V2.0` 首次 push-request 运行完整成功；
- Completion 成功后约数秒内产生 Scheduler `workflow_run`；
- Scheduler 正确判断 Publication 尚未到 20:00，因此保持 Waiting。

该验证证明两件事同时成立：

1. overdue 下一环不再等待下一次 cron；
2. future 下一环不会因为即时推进而越过正式时间。

## 9. 运营判定

进程管理必须同时满足：

- **及时：** overdue 前置完成后立即 reconcile；
- **准确：** 页面和机器状态同源，Running 有 Lease；
- **高效：** 每次只推进一环，不产生并发竞态；
- **可恢复：** heartbeat、Blocked reopen 和 Watchdog 提供兜底；
- **可审计：** 每次打开、完成、过期、恢复、提交与验证都有 durable event。
