# 两个成功是否属于同一项工作？受控实验记录

[English evidence summary](00-report.en.md) · [中文文章](../../../docs/zh/research/2026-10-30-two-successes-one-task.md)

## 来源与问题

[Paperclip #18227](https://github.com/paperclipai/paperclip/pull/18227) 防止被拒绝的完成声明被 provider 正常结束覆盖；[Codex #58166](https://github.com/openai/codex/pull/58166) 将轨迹完整性从任务结果中独立出来。它们提示我们检查**完成事实的归属**，并非 CodeFlowMu 同类问题的证据。

本地问题：CodeFlowMu 的 Google 适配路径中，一次 `write_report` 成功和一次 `submit_task` 成功若分别属于 A、B 两项任务，会话结算器会怎样判断当前 A？若进程内成功标志丢失，能否从 FCoP 4 正式报告恢复？

## 固定对象与方法

- FCoP 4.0.5 源码 `f1aa3348a9a64475caba8036dcc23e83f5080c7c`。公开脚本 [probe_fcop_control.py](probe_fcop_control.py) 调用真实 `Project` 接口创建、领取、写报告、提交两项临时任务。
- CodeFlowMu V3.0.129 私有源码 `c600e74d5d72253657593a37077e856fe6c7fba6`。本地脚本直接调用其 Google 适配器的合同状态、报告查找和会话结算函数；源码和完整本地脚本不在本仓库，读者**不能独立复跑这层私有实现**。
- 同任务组：A 写正式报告，A 提交。跨任务组：A 写正式报告，B 提交。两个真实 FCoP 操作结果分别交给本地合同状态模块分类；并做没有进程内成功标志的结算对照。临时目录在实验结束后销毁。
- 未调用真实模型、完整 UI、外部服务或生产任务；这是一项模块级集成探针。

## 观察

| 检查点 | 同任务组 | 跨任务组 |
| --- | --- | --- |
| A 的 FCoP 正式报告 | 公共查询返回 1 条 | 公共查询返回 1 条 |
| 写报告成功、提交成功 | A 与 A | A 与 B |
| CodeFlowMu 旧式磁盘查找发现 A 报告 | 否 | 否 |
| CodeFlowMu 成功标志 | 两项均为 `true` | 两项均为 `true` |
| 单独只有报告成功／只有提交成功时提前停止 | 均不停止 | 均不停止 |
| 提前停止与 A 的会话结算 | 停止，`done` | 停止，`done` |
| FCoP 中 A 的正式任务阶段 | `review` | `active` |
| 不给进程内成功标志，单独结算 A | `blocked/no_valid_report` | `blocked/no_valid_report` |

FCoP 4 报告采用 `fcop/reports/REPORT-<UUID>.md` 和 `subject_ref`；受测 CodeFlowMu 旧查找器以含 `-DEV-to-PM` 的文件名和旧字段为入口，所以没有发现这条由 FCoP 公共查询读到的正式报告。当前合同状态则只累积工具名成功布尔值，没有将这两个成功约束为相同 `task_id` 或 `attempt_id`。因此跨任务组里，**会话结算**返回 `done`，而 FCoP 的 A TASK 仍为 `active`。这里的 `done` 不是 FCoP `done` 生命周期阶段。

受测两组产品现有单元测试共 10 项通过；它们没有覆盖本实验的同/跨任务与恢复对照。

## 支持范围与下一步

已确认的是 CodeFlowMu **Google 适配器模块级路径**在受控输入下的错配；未证明真实模型会自然发起跨任务提交、UI 一定显示任务完成、其他 Provider 受影响或线上出现事故。公开 FCoP 脚本可重跑账本阶段差异，私有 CodeFlowMu 层只能核对本记录的条件、结果和限制。建议在独立产品任务中增加任务与尝试绑定、用 FCoP 官方查询核对报告及阶段，再跑完整 Google/重启/UI 链路。
