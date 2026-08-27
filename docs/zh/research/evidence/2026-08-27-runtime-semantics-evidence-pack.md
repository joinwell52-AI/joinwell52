---
title: "Runtime 语义三篇文章：公开证据包"
date: '2026-08-27'
---

# Runtime 语义三篇文章：公开证据包

状态：随 2026-08-27 三篇文章公开；已脱敏、可下载、可复核。
目的：让文章中的数字、样本和推理范围可被读者复核，而不是把私有仓库路径当作引用。

## 1. 包含什么

| 文章 | 可公开材料 | 回答的问题 | 不回答的问题 |
| --- | --- | --- |
| 《取消了 Agent，子进程真的停了吗？》 | Windows 二层 Node 进程树探针的脱敏结果、探针范围与通过条件 | 该主机的 `taskkill /T /F` 在一个 wrapper + 直接 child 样本中是否同时观察到两者退出 | 任意深度进程树、逃逸后代、容器、远程 worker 是否已收拢 |
| 《任务在审查中，就等于证据没有串账吗？》 | 十条脱敏 REPORT 关联样本、固定分类规则和预期输出 | 只用显式 task key 时，样本如何分为 `linked/missing/conflict` | 故障率、报告真实性、业务验收或当前版本质量 |
| 《一盏绿灯到底在说什么？》 | 五类会话观察合同、已运行的窄夹具说明与投影反例矩阵 | UI 是否能把活性、进度、报告等待和技术错误分开表达 | 所有权限过滤器、PWA 和端到端交付路径均已认证 |

本包不含：任务正文、代码正文、提示词、绝对路径、用户名、会话 ID、凭据或用户项目文件。

## 2. R1｜Windows 取消探针

### 实验合同

一个新的临时目录中，wrapper 启动一个长寿命直接 child。确认两个 PID 都存在后，以 `taskkill /PID <wrapper> /T /F` 终止 wrapper；在三秒内分别检查 wrapper 与 child 是否仍可观察。

| 检查项 | 结果 |
| --- | --- |
| wrapper 与直接 child 终止前可观察 | 是 |
| `taskkill /T /F` 退出码 | `0` |
| wrapper 退出被观察 | 是 |
| 直接 child 退出被观察 | 是 |
| 总结 | `PASS` |

脱敏输出：

```json
{"status":"PASS","scope":"windows_taskkill_tree_probe_only","wrapper_exit_observed":true,"child_exit_observed":true,"termination_exit_code":0}
```

这个实验刻意不声称 `kernel_containment_proven`。它只是一个可重复的二层观察；若 child 脱离关系、跨权限运行或继续派生，必须由新的反例测试回答。

## 3. R2｜十条 REPORT 关联样本

脱敏 JSON 夹具：[2026-08-27-r2-report-association-fixture.json](/assets/evidence/2026-08-27-r2-report-association-fixture.json)。

### 分类规则

```text
action.task_id 与 ledger.task_id 均存在且相等  → linked
action.task_id 缺失                              → missing
两者均存在但不相等                              → conflict
```

禁止使用：文件名相似、写入时间接近、角色、模型推断或默认选择“最新记录”。

### 全部样本结果

| REPORT | action task | ledger task | 输出 |
| --- | --- | --- | --- |
| R01 | T01 | T01 | linked |
| R02 | T02 | T04 | conflict |
| R03 | T02 | T03 | conflict |
| R04 | — | T02 | missing |
| R05 | T01 | T01 | linked |
| R06 | — | T04 | missing |
| R07 | — | T03 | missing |
| R08 | T01 | T01 | linked |
| R09 | — | T09 | missing |
| R10 | T08 | T08 | linked |

汇总：`linked = 4`、`missing = 4`、`conflict = 2`。该夹具从固定私有提交的两份 JSONL 派生，保留等值、缺值与冲突结构；原始文件 SHA-256 分别为 `47dda7d8cd18b2a11241854823964d9e0a67298535de06e04f2acb807459ac11` 与 `45cd1d3b4ffc088574d08df48de3ad5db6fd5a99b288005c7a048f2a7355342b`。

候选发布物中的 Reader 应对该夹具输出：

```json
{"fixture":"deidentified_historical_association","counts":{"linked":4,"missing":4,"conflict":2},"status":"PASS"}
```

## 4. R3｜“绿灯”拆分的合同

以下不是数据集统计，而是当前面板读端已经使用的五类互斥观察输出。一个定向纯分类夹具在当前工作树运行过 1/1；它说明这五种输入曾被测试，不能替代端到端 UI 验证。

| 输入观察 | 读端输出 | 页面不应说成 |
| --- | --- | --- |
| session running + live + progress | `executing_with_progress` | 已交付 |
| session running + live，无细粒度 progress | `executing_without_fine_progress` | 已失败 |
| session running，但不 live | `session_without_live_execution` | 正在推进 |
| session completed，REPORT 未到 | `completed_waiting_report` | 已验收 |
| session failed / lost | `technical_error` | 业务任务失败 |

投影反例矩阵：

| 组合 | 合格展示 |
| --- | --- |
| viewer 非 owner，但有 fresh local session | 权限允许读取时，按 canonical source 展示实际执行；不能仅因非 owner 隐藏 |
| Gateway online，但 job heartbeat 过期 | 同时展示连接与作业活性，不能把 online 写成正在执行 |
| workflow done，evidence 有冲突 | 保留 done 和 evidence conflict 两个事实，不互相覆盖 |
| runtime / disk identity 不一致 | `projection_conflict`，不发布为 online |

## 5. 重跑与审查

R2 公开夹具只需要一个无网络依赖的 Reader 即可重跑。候选包已经包含 [Reader](/assets/evidence/2026-08-27-r2-association-reader.mjs) 与 [检查脚本](/assets/evidence/2026-08-27-r2-association-reader-check.mjs)。运行：

```text
node 2026-08-27-r2-association-reader-check.mjs
```

预期输出：

```json
{"fixture":"deidentified_historical_association","counts":{"linked":4,"missing":4,"conflict":2},"status":"PASS"}
```

发布前应把 Reader、测试命令、预期输出与本文件一起纳入站点的公开 evidence 目录，并由独立 reviewer 确认：

1. 脱敏没有改变 R2 的相等、缺失和冲突关系；
2. R1 的 `PASS` 没被扩写成 containment 保证；
3. R3 的 `1/1` 没被扩写成全端 UI 回归；
4. 文章没有从本包的技术观察跳到业务验收结论。
