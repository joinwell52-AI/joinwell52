# 后台任务完成以后，谁负责让主管知道？

本页是 2026-11-09 的有界工程实验，不是 LangChain 或 CodeFlowMu 的端到端可靠性认证。

## 来源与固定对象

| 对象 | 固定来源 | 本轮入口 |
| --- | --- | --- |
| 问题来源 | [LangChain 官方文章，2026-11-05](https://www.langchain.com/blog/agents-are-going-async) | 主管与后台员工分离、完成通知的设计问题 |
| 参考实现 | [async-deep-agents `6cafef62`](https://github.com/langchain-ai/async-deep-agents/tree/6cafef62b2783a3d16edacd7df151ad1a33ee7a5) | Python `completion_notifier.py` 中的真实类；远端客户端用确定性替身 |
| 本地工程 | [CodeFlowMu-open `ed5634c7`](https://github.com/joinwell52-AI/CodeFlowMu-open/tree/ed5634c718b9e238c44bb70851020c9793546fe6) | 报告接收、迟到报告与 PM 规划器三个测试文件 |
| 协议边界 | [FCoP 3.0 规范](https://github.com/joinwell52-AI/FCoP/blob/main/spec/fcop-3.0-spec.md) | 文件状态、转换事件与 Runtime 职责分界；仅源码/规范核对 |

参考仓库的 README 明确完成通知为可选接线，Python 和 TypeScript 员工图中的接线默认注释。未查到该参考仓库中的 LICENSE 文件；本实验只运行固定源码入口，未将其纳入产品。

## 实验 1：真实通知模块，假远端客户端

脚本：[probe_completion_notifier.py](./probe_completion_notifier.py)，SHA-256 `54476c402a56483c0fe05a69702d5337203068a4ec71d869e8f43c824521b1da`。被导入的上游模块 SHA-256 为 `e281ac801452742c69371f319a35ded34faf1778a077d912f07a05d362b0b13a`。替身只覆盖第三方导入与远端 `runs.create`，保留真实 `CompletionNotifierMiddleware` 方法。

复跑：将固定提交克隆到本目录的 `async-deep-agents/`，执行 `python probe_completion_notifier.py`。也可设置 `ASYNC_DEEP_AGENTS_CHECKOUT` 指向该固定 checkout。脚本不需模型密钥或云服务。

| 控制条件 | 对同一实例连续调用完成回调两次后 | 观察 |
| --- | --- | --- |
| 父级 ID 存在，远端成功 | 投递尝试 1 次，`_notified=true` | 发往父线程的内容是 `role=user` 消息，未含结构化 `job_id`。 |
| 父级 ID 存在，远端抛合成错误 | 投递尝试 1 次，`_notified=true` | 模块记录 warning，第二次回调未重试。 |
| 父级线程 ID 缺失 | 投递尝试 0 次，`_notified=false` | 没有发送。 |

这个结果只证明参考模块在这些输入下的行为。它不说明真实 LangGraph 服务端是否另行补偿，也不证明产品级任务结果丢失。README 原本就写明通知错误处理由采用者自行设计。

## 实验 2：CodeFlowMu 的报告接收边界

在上述 CodeFlowMu-open 提交的 `packages/codeflowmu-runtime` 运行：

```text
node --import tsx --test src/scheduler/__tests__/ReportDispatcher.test.ts src/pm/__tests__/lateReportIntake.test.ts src/pm/__tests__/PmGovernancePlanner.test.ts
```

本次 **19/19 通过**。测试分别覆盖：员工 REPORT 唤醒 PM；PM 忙时排队并去重；一次持久唤醒审计；同线程批量报告只起一次 PM 会话；迟到报告按 report_id 幂等；PM 在有报告时进入接收与审查路径，无报告时不误审。它们是现有组件测试，不能替代真实模型、界面、进程崩溃或网络断连验收。

## 工程判断与限制

“员工产出结果”“主管收到提醒”“主管审查通过”是不同的状态。参考模块说明主动通知可以失败且本地标记未必反映送达；CodeFlowMu 测试说明它已经有按持久 REPORT 驱动的 PM 接收路径。两组实验对象、入口与覆盖范围不同，不能拿一个的失败推断另一个有同样缺陷。FCoP 定义任务状态和转换事件，不负责将提醒送到主管的运行时传输。

下一步可证伪实验：PM 等待人工审批、员工写入 REPORT、首次唤醒故意失败、重启 Runtime；检查报告重发现、一次排队与审批原问题保持不变。本轮**未执行**这项端到端实验，也没有确认的 CodeFlowMu 开发问题。
