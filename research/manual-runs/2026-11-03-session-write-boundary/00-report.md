# 两次保存成功，一项更新消失：公开证据摘要

[English evidence](00-report.en.md) · [中文文章](../../../docs/zh/research/2026-11-03-atomic-write-lost-update.md)

## 来源与主张

| 主张 | 支持材料 | 不支持的推断 |
| --- | --- | --- |
| 上游 ADK 让旧状态检查与写入共用锁 | [Google ADK 提交 `bc0b41871699a70a3bf1169bb7e7ff91d2db5e31`](https://github.com/google/adk-python/commit/bc0b41871699a70a3bf1169bb7e7ff91d2db5e31) | CodeFlowMu 发生了 ADK 的同一事故 |
| 另一条上游路径的共享状态写入仍在评审 | [Google ADK #7942](https://github.com/google/adk-python/pull/7942)，作者报告并发测试；无真实 PostgreSQL/Redis 端到端测试 | 该 PR 已合入或证明单会话文件有同一问题 |
| CodeFlowMu 旧快照写回可替换前一次更改，文件仍完整 | [会话存储探针](probe_session_write_boundary.mjs)及下表；固定模块 Git blob | 真实 Runtime 已出现取消/结束冲突 |
| FCoP 两次顺序报告写入保留两份 | [FCoP 对照探针](probe_fcop_report_identity.py)及下表 | 并发编号、断电恢复、跨项目集成已验证 |

## 固定版本

- 2026-11-03，CodeFlowMu V3.0.152 提交 `0d2d4e742ef2f3cb48e3ce09cc47f0c03053dc5f`。`SessionStore.ts` Git blob `8002807812f034fbb6814c5595aa7455dd379055`；`atomic-write.ts` Git blob `99c409b30fe90354097dbcc063c8d82fc952f65f`；`SessionManager.ts` Git blob `9363f0f892adacd89d1ddfbb5547a7c140d43097`。脚本仅调用本地源码与临时目录，不含私有数据。CodeFlowMu 源码访问如受限，公众无法独立复跑此层；这项限制不能靠脚本公开消除。
- FCoP 提交 `a964d0df8ea09f76e7d7f3257052c411105cfcdc`。两份 REPORT 由 `Project.write_report()` 依次创建；合成任务、临时工作区。
- 产品与 FCoP 工作树原先有其他未提交修改。本轮没有编辑产品源码；固定 blob 标识的是受查文件内容。

## 输入、步骤、观察点

1. 在独立临时目录保存合成会话，工具次数为 0。
2. A、B 各调用 `SessionStore.load()`，得到同一旧版。A 增加 `runtime_recovery_status=managed_job_running`，B 在自己的旧版把 `tool_calls_count` 改成 1。
3. A、B 依次 `save()`；记录两次返回、每步读取值及最终 JSON 可解析性。
4. 对照：A 保存后，B **重新读取**再改计数并保存。
5. 另一临时目录中，FCoP 创建一个合成 TASK，再依次写两份 REPORT，读取文件名、引用与正文。

| CodeFlowMu 观察点 | 恢复状态 | 工具次数 | 保存/文件结果 |
| --- | --- | ---: | --- |
| A 保存后 | `managed_job_running` | 0 | 保存 resolve |
| B 从旧版保存后 | 缺失 | 1 | 保存 resolve；JSON 可解析 |
| B 重读对照后 | `managed_job_running` | 1 | 保存 resolve；JSON 可解析 |

FCoP 对照：两份 REPORT 路径不同、都引用同一个 TASK、两份正文都可读取。**两种探针不在同一个运行实例里**，只比较存储对象的语义。

相关 CodeFlowMu `SessionStore` 与原子写定向回归为 **17/17 通过**，覆盖正常读写、损坏文件与 rename 行为；不覆盖旧快照冲突。没有生产事故统计，也没有真实 `SessionManager` 取消和自然结束竞态复现。源码中两条终态写路径可异步交错，只构成下一轮实验假设。

## 复核方法与预期

具备对应源码访问时，设置 `CODEFLOWMU_SOURCE_ROOT` 为固定 CodeFlowMu 检出目录，在 Node 24 环境运行 `node probe_session_write_boundary.mjs`。预期 `stale_snapshot.after_B.recovery_status` 为 `null`、`tool_calls` 为 1；`serialized_control` 同时保留两项。FCoP 对照以 `PYTHONPATH=<FCoP checkout>/src python probe_fcop_report_identity.py` 运行，预期三个布尔值均为 `true`。这些输出是模块和 API 的合成探针，不是历史运行记录或全链路验收。

进一步需要可控 `SessionManager` handle：让取消与自然结束读到同一版本，交错保存并读取磁盘终态、报告引用及两方回执。该实验尚未完成；本轮正式开发评审为 0，未修改产品。
