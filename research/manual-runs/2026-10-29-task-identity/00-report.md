# 同一个任务号，就还是同一件工作吗？——受控实验记录

日期：2026-10-29。此包支持[中文文章](../../../docs/zh/research/2026-10-29-same-task-id-different-work.md)；[English record](00-report.en.md)。

## 来源与范围

- 外部启发：[agent-claimcheck](https://github.com/B0yko/agent-claimcheck) 检查成功声明与工具回执、状态探针；[Beads #7931](https://github.com/gastownhall/beads/pull/7931) 在特定清理路径保留退休身份。没有把其测试结果写成我们的实验。
- 本地受测源码：[FCoP](https://github.com/joinwell52-AI/FCoP/tree/f1aa3348a9a64475caba8036dcc23e83f5080c7c) `f1aa3348a9a64475caba8036dcc23e83f5080c7c`（包 4.0.5）；[CodeFlowMu-open](https://github.com/joinwell52-AI/CodeFlowMu-open/tree/7230419396722fc5df4b6f1c725f9205a4a81a38) `7230419396722fc5df4b6f1c725f9205a4a81a38`。前者测试的是 `fcop.compatibility.v3`，后者是**已冻结的历史公开版**，不代表当前私有产品。
- 所有任务、报告与动作都在临时目录合成；没有真实 Agent 交付、外部 Git push、线上审批或业务副作用。实验结论只及受测代码入口。

## 证据链 A：同一任务的不同执行会话

FCoP v3 兼容 API 真正创建任务及 `status: done` 的报告。报告 frontmatter 包含任务引用，不包含 `session_id` 或 `run_id`。CodeFlowMu 的动作日志先记旧会话在 10:00 执行 `npm test`、退出码 0，再记新会话在 11:00 写报告，新会话没有测试动作。

| 对照 | 实际输出 |
| --- | --- |
| 仅按任务号聚合事实证据 | `pass / evidence_verified`，旧会话测试被选中 |
| 显式指定新会话 | `needs_admin / session_evidence_gap` |
| 时间窗口从旧测试之后开始 | `fail / missing_test_evidence` |
| FCoP 实际报告交给 `ReportActionResolver` | 无会话字段；`outcome=reconciled`，Review verdict=`pass` |

另测 `review_check`：报告与任务匹配时，产物存在、缺失、正文为 `FAIL` 均返回 `ok=true`；错误任务号返回 `task_id_mismatch`。这个入口检查关联与文本条件，**不是**后续事实门禁。以上结果不证明旧测试在业务上无效；允许继承时需要另行定义适用条件。

## 证据链 B：深归档后同号复用

在 FCoP 4.0.5 的 **v3 兼容 API** 中，当天先创建唯一任务 `TASK-20261029-001`，关闭并移入 `history/YYYY-MM-DD/`，再创建另一任务。

| 观察 | 实际输出 |
| --- | --- |
| 原任务文件 | 仍在历史中 |
| 第二个任务 ID | 也是 `TASK-20261029-001` |
| 普通 `read_task(旧 ID)` | 新任务 `Second delivery` |
| `read_history_task(旧 ID)` | 旧任务 `First delivery` |
| 向旧 ID 写迟到报告 | 文件引用同一号码；未测试外部副作用 |
| CodeFlowMu-open 的 `TaskIdentityAllocator` 面对历史 `001` | 分配 `002`，没有复用 |

FCoP 4.0 原生 Core 使用 UUID 身份，不能把兼容 API 的结论扩展到原生 Core。CodeFlowMu-open 自己的分配器已有历史扫描，不能断言它的所有路径会复用。

## 复跑

本目录的六个脚本均为实际探针的可公开版本，使用临时目录并在结束时清理。需要 Git、Python/uv、Node 24 与 pnpm。在本目录执行：

```text
git clone https://github.com/joinwell52-AI/FCoP.git external/FCoP-current
git -C external/FCoP-current checkout f1aa3348a9a64475caba8036dcc23e83f5080c7c
git clone https://github.com/joinwell52-AI/CodeFlowMu-open.git external/CodeFlowMu-current
git -C external/CodeFlowMu-current checkout 7230419396722fc5df4b6f1c725f9205a4a81a38
```

在 `external/FCoP-current` 执行 `uv sync --no-dev`；在 `external/CodeFlowMu-current/packages/codeflowmu-runtime` 执行 `pnpm install --ignore-scripts --no-frozen-lockfile --lockfile=false`。然后从本目录运行：

```text
uv run --project external/FCoP-current python probe_fcop_history_identity.py
node --experimental-transform-types probe_own_evidence_binding.ts
node --experimental-transform-types probe_own_review_gate.ts
node --experimental-transform-types probe_codeflowmu_task_id.ts
node --experimental-transform-types probe_fcop_to_codeflowmu.ts
```

`create_fcop_fixture.py` 由最后一个脚本调用。受控输出中的临时路径和哈希会随机器变化；判定应核对上表字段。核心源码：FCoP `src/fcop/compatibility/v3/project.py` 的 `write_task`、`write_report`、`archive_to_history`；CodeFlowMu-open `src/review/ReviewEvidenceResolver.ts`、`ReviewFactGate.ts`、`src/scheduler/ReportActionResolver.ts`、`TaskIdentityAllocator.ts`。

## 结论边界与下一问

两组对照共同证明：单独的任务号不足以在受测路径上回答“这是哪项工作、哪次执行、哪份证据”。它们没有证明线上误验、真实迟到重试或当前私有 CodeFlowMu 的行为。下一步需定义跨会话证据合法继承的条件，并核验兼容任务号在所有写入路径的占用规则。正式开发评审另行依真实产品需求和收益成本决定。
