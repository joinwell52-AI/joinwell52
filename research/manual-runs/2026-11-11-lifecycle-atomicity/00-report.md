# 2026-11-11：任务状态转换的写入、搬移与回执

## 研究问题与来源

来源：[Paperclip #20674](https://github.com/paperclipai/paperclip/pull/20674)将受保护的 `write_document` 文档版本与幂等结果回执写入同一数据库事务。它启发我们检查文件式任务转换的恢复证据；本报告不是 Paperclip 的复现实验，也不把其局部保证扩展到任意工具。

本地受测代码：[CodeFlowMu-open `ed5634c`](https://github.com/joinwell52-AI/CodeFlowMu-open/tree/ed5634c718b9e238c44bb70851020c9793546fe6)。2026-11-11 复核远端 `origin/main` 为 `7230419`，受测 `LifecycleStateMachine.ts` 与固定本地提交无差异。入口为 `LifecycleKernel.submitReview`。CodeFlowMu 是多 Agent 运行系统；FCoP 文件提供任务位置和转换历史。此轮未运行 FCoP Python SDK。

## 方法与运行

[公开探针脚本](probe.mjs)在临时目录创建一个 `active` 任务，将普通文件放在目标 `review/` 路径。调用真实提交入口时，转换记录与文件头先写入，目标目录创建失败返回 `EEXIST`。随后解除阻塞并重试同一任务/报告；最后模拟已完成操作的响应丢失，再重发相同请求。探针清理自己的临时目录，不改产品代码。

```text
cd <CodeFlowMu-open>/packages/codeflowmu-runtime
node --import tsx <joinwell52>/research/manual-runs/2026-11-11-lifecycle-atomicity/probe.mjs <CodeFlowMu-open-absolute-path>
node --import tsx --test src/lifecycle/__tests__/LifecycleStateMachine.test.ts
```

| 时点 | 调用结果 | 物理目录 | 文件头 state | review_status | 转换条数 |
| --- | --- | --- | --- | --- | ---: |
| 目标目录受阻 | `EEXIST` | active | review | pending | 1 |
| 解除阻塞并重试 | 成功：active → review | review | review | pending | 1 |
| 已成功但回执丢失，重试 | `expected state active, got review` | review | review | pending | 1 |

三次读取的最后一条转换均为 `action: submit_review`，引用同一 `REPORT-20261111-001-OPS-to-PM`。受测调用没有重复转换记录。生命周期定向测试本机 **28/28 通过**；正常测试与人为故障输入条件不同。

## 主张映射与边界

- **记录先于搬移**：[`TransitionRecorder.append`](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/lifecycle/TransitionRecorder.ts)写目标状态/事件；[`submitReview` 和 `moveTask`](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/lifecycle/LifecycleStateMachine.ts)随后写审查字段并移动文件。探针的第一行实际观察到中间态。
- **解除阻塞后的相同请求**：第二次调用完成搬移，转换条数仍为 1。这仅是受测路径的重试行为。
- **成功回执丢失后**：第三次相同调用因起点已是 review 被拒；目录和文件头可独立核对当前状态，但该错误本身不能证明此前调用未执行，也不足以把状态变化归因于某一次请求。
- **项目写租约**：受测 `LifecycleKernel` 用租约串行化写入；这里没有证明它跨三次文件动作提供原子事务。

故障通过隔离目录的目标路径阻塞注入，未模拟实际硬杀或网络断连；未跑真实模型、UI 或线上部署，亦无用户事故统计。公开脚本可重跑局部入口，不声称端到端可达。延伸问题是给同一 `taskId + reportId + attemptId` 建立可查询、可重放的操作结果，并在中间态与外部并发变化下验证归属。
