---
title: "Runtime 语义三篇文章：公开证据包"
date: '2026-08-27'
---

# Runtime 语义三篇文章：公开证据包

状态：**Published**。本页随 2026-08-27 三篇 Runtime 语义文章公开，材料已脱敏，可下载、可检查。R1 提供 Windows 专用公开 probe 与脱敏记录；R2、R3 提供无网络依赖的公开 Reader / check。

目的不是证明“当前系统全部正确”，而是让文章里的样本、分类规则、实验结果和不可外推边界能够被读者独立检查。

## 1. 证据包包含什么

| 文章 | 公开材料 | 能回答什么 | 不能回答什么 |
| --- | --- | --- | --- |
| 《取消了 Agent，子进程真的停了吗？》 | Windows 二层 Node 进程树 probe、脱敏已记录结果、record-check | 在一个 wrapper + 直接 child 合同下，某台 Windows 主机上的 `taskkill /T /F` 是否同时观察到两者退出；读者也可在自己的 Windows 主机重跑同一合同 | 任意深度进程树、逃逸后代、跨权限、容器、远程 worker 是否都被收拢 |
| 《任务在审查中，就等于证据没有串账吗？》 | 10 条脱敏 REPORT 关联样本、公开 Reader、check script | 只使用显式 task key 时，样本如何分成 `linked / missing / conflict` | 故障率、REPORT 内容真实性、业务验收或当前产品质量 |
| 《一盏绿灯到底在说什么？》 | 5 条脱敏 Session 观察输入、公开 Reader、check script、投影反例矩阵 | 五类已披露观察语义能否被独立复现，以及哪些 UI 事实不能互相替代 | 所有桌面端、PWA、权限过滤器和端到端交付路径是否都已认证 |

本包不公开任务正文、Agent 内容、提示词、绝对路径、用户名、真实 Session ID、凭据或用户项目文件。

---

## 2. R1｜Windows 取消与“停止”证据

这部分对应《取消了 Agent，子进程真的停了吗？》一文。

### 实验合同

在新的临时目录中，由 wrapper 启动一个长寿命直接 child。确认两个 PID 都可观察后，执行：

```text
taskkill /PID <wrapper> /T /F
```

并在三秒内分别检查 wrapper 与直接 child 是否仍可观察。

第一次受控主机记录为：

| 检查项 | 结果 |
| --- | --- |
| wrapper 与直接 child 在终止前可观察 | 是 |
| `taskkill /T /F` 退出码 | `0` |
| wrapper 退出被观察 | 是 |
| 直接 child 退出被观察 | 是 |
| 结果 | `PASS` |
| `kernel_containment_proven` | `false` |

公开材料：

- [2026-08-27-r1-windows-taskkill-tree-probe.mjs](/assets/evidence/2026-08-27-r1-windows-taskkill-tree-probe.mjs)
- [2026-08-27-r1-windows-taskkill-recorded-result.json](/assets/evidence/2026-08-27-r1-windows-taskkill-recorded-result.json)
- [2026-08-27-r1-windows-taskkill-recorded-result-check.mjs](/assets/evidence/2026-08-27-r1-windows-taskkill-recorded-result-check.mjs)

脱敏已记录结果明确包含：

```json
{"status":"PASS","scope":"windows_taskkill_tree_probe_only","wrapper_exit_observed":true,"child_exit_observed":true,"termination_exit_code":0,"kernel_containment_proven":false}
```

### 两种检查不能混为一谈

检查公开记录本身：

```text
node 2026-08-27-r1-windows-taskkill-recorded-result-check.mjs
```

预期输出：

```json
{"fixture":"deidentified_windows_taskkill_tree_probe_result","status":"PASS","kernel_containment_proven":false}
```

这只验证公开记录的结构和声明边界，不重新执行操作系统实验。

要重新实验 `taskkill /T /F`，必须在 **Windows** 上运行：

```text
node 2026-08-27-r1-windows-taskkill-tree-probe.mjs
```

probe 会创建临时 wrapper + direct child，等待两者可观察，再执行 `taskkill /T /F` 并分别检查两个 PID。非 Windows 主机直接拒绝运行，而不是给出假 PASS。

即使再次得到 PASS，它仍然只说明这个公开合同中的两个已知 PID 被观察到退出。它不证明进程树在内核意义上是一个封闭集合；child 脱离原关系、短寿命中间进程生成 grandchild、跨权限、继续派生、容器化或远程 worker 都需要新的反例实验。

---

## 3. R2｜REPORT 与 TASK 的显式关联

脱敏 fixture：

- [2026-08-27-r2-report-association-fixture.json](/assets/evidence/2026-08-27-r2-report-association-fixture.json)
- [2026-08-27-r2-association-reader.mjs](/assets/evidence/2026-08-27-r2-association-reader.mjs)
- [2026-08-27-r2-association-reader-check.mjs](/assets/evidence/2026-08-27-r2-association-reader-check.mjs)

### 分类规则

```text
action.task_id 与 ledger.task_id 都存在且相等  → linked
action.task_id 缺失                              → missing
两者都存在但不相等                              → conflict
```

禁止使用文件名相似、写入时间接近、角色、模型推断或“默认选择最新记录”来补关系。

### 10 条脱敏样本

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

汇总：`linked = 4`、`missing = 4`、`conflict = 2`。

fixture 由固定第一方历史记录脱敏派生，保留 task key 的等值、缺失和冲突关系。原始两份 JSONL 的 SHA-256 分别为：

- `47dda7d8cd18b2a11241854823964d9e0a67298535de06e04f2acb807459ac11`
- `45cd1d3b4ffc088574d08df48de3ad5db6fd5a99b288005c7a048f2a7355342b`

公开检查：

```text
node 2026-08-27-r2-association-reader-check.mjs
```

预期输出：

```json
{"fixture":"deidentified_historical_association","counts":{"linked":4,"missing":4,"conflict":2},"status":"PASS"}
```

公开 Reader 是为了让读者检查本文披露的分类规则和脱敏样本；它不是对完整 Runtime 的模拟。

---

## 4. R3｜UI 状态投影：五类事实不能压成一盏绿灯

这部分对应《一盏绿灯到底在说什么？》一文。

第一方源路径中，Session 观察器把五种输入分成五类互斥输出。源测试中的一个定向 test 包含 **5 个分类断言**；早先文章里的“1/1”只表示这个 test case 通过，不应被理解成“只验证了一个状态”，更不能理解成全 UI 回归。

### 五类已披露观察合同

| 输入观察 | 输出 | 页面不应升级成 |
| --- | --- | --- |
| Session `running` + live + 有 progress | `executing_with_progress` | 已交付 |
| Session `running` + live + 无细粒度 progress | `executing_without_fine_progress` | 已失败 |
| Session `running` + 非 live | `session_without_live_execution` | 正在推进 |
| Session `completed` + REPORT 尚未写入 | `completed_waiting_report` | 已验收 |
| Session `failed` / `session_lost` | `technical_error` | 业务任务失败 |

### 公开、可重跑的脱敏复现器

- [2026-08-27-r3-ui-status-projection-fixture.json](/assets/evidence/2026-08-27-r3-ui-status-projection-fixture.json)
- [2026-08-27-r3-ui-status-projection-reader.mjs](/assets/evidence/2026-08-27-r3-ui-status-projection-reader.mjs)
- [2026-08-27-r3-ui-status-projection-check.mjs](/assets/evidence/2026-08-27-r3-ui-status-projection-check.mjs)

fixture 含 5 条脱敏输入，每条对应一种已披露分类。公开 Reader 按披露的判断顺序复现分类合同；check script 对五条记录逐条比对 `actual === expected`，并同时检查五类计数。

运行：

```text
node 2026-08-27-r3-ui-status-projection-check.mjs
```

预期输出：

```json
{"fixture":"deidentified_runtime_session_observation","assertions":5,"status":"PASS"}
```

这里必须区分两件事：**公开 Reader 是可复核的合同复现器，不是私有生产源码；5 条公开断言验证的是已披露分类语义，不是桌面端/PWA 的端到端 UI 认证。**

### 投影反例矩阵

| 组合 | 合格展示 |
| --- | --- |
| viewer 不是 owner，但权限允许读取且存在 fresh local session | 依据 canonical execution source 展示实际执行；不能仅因非 owner 隐藏 |
| Gateway online，但 managed job heartbeat 已过期 | 同时展示连接与 job 活性；不能把 online 写成“正在执行” |
| workflow 已 `done`，evidence 仍有 conflict | 保留 `done` 与 evidence conflict 两个事实，不互相覆盖 |
| runtime / disk / context identity 不一致 | 显示 `projection_conflict` / unknown，不发布为 online |

这些组合不是为了制造更多颜色，而是检查**正交性**：viewer authority、连接、Session 活性、progress、REPORT 与 lifecycle 各自只回答自己的问题。

---

## 5. 如何独立检查

R1、R2、R3 的公开附件都不需要访问私有仓库。R1 的真实 probe 需要 Windows；R1 record-check、R2 与 R3 使用 Node 即可。

R1 公开记录检查：

```text
node 2026-08-27-r1-windows-taskkill-recorded-result-check.mjs
```

R1 Windows 重跑：

```text
node 2026-08-27-r1-windows-taskkill-tree-probe.mjs
```

R2：

```text
node 2026-08-27-r2-association-reader-check.mjs
```

R3：

```text
node 2026-08-27-r3-ui-status-projection-check.mjs
```

检查者应特别确认：

1. R1 的 `PASS` 没有被扩写成任意进程树 containment 保证；
2. R1 的 public probe 与 recorded result 是两种不同证据：一个可重新实验，一个记录既有主机观察；
3. R2 脱敏没有改变 task key 的相等、缺失和冲突关系；
4. R3 的五类公开断言没有被扩写成全端 UI / PWA 回归；
5. `technical_error` 没有被写成业务失败，`completed_waiting_report` 没有被写成正式验收；
6. 文章没有让取消请求、命令返回码、PID 消失、Gateway、Session、progress、REPORT 或 lifecycle 中任何一层替另一层签字。

## 6. 总体证据边界

这个公开包是一组**可审查的工程切片**，不是产品认证，也不是统计学意义上的大样本评测。

- R1：一份既有 Windows 主机二层样本 + 一个公开同合同 probe；
- R2：10 条脱敏历史关联样本；
- R3：5 条语义分类输入 + 投影反例矩阵。

因此，本文和相关三篇文章的结论都必须限制在对应样本、规则、版本和公开材料内。证据包的价值不在于把系统描述成“全绿”，而在于让读者能够区分：**什么已经观察到，什么可以重跑，什么仍然没有被证明。**