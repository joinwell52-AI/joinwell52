---
title: "取消了 Agent，子进程真的停了吗？从 Anywhere Agents 看 Agent Runtime 的停止证据边界"
date: '2026-08-27'
column: digital-employee
category: daily
article_type: engineering-analysis
edition: research-center
research_question: "一次取消请求、终止命令成功、已知 PID 消失、执行树收拢与重新派工资格，能否被同一个“已停止”状态代替？"
summary: "从 Anywhere Agents 对遗留结果与孤儿进程的连续审计出发，结合一份可公开重跑的 Windows 二层进程探针，讨论 Agent Runtime 为什么必须把“发出取消”与“证明执行树已经停止”分开。"
sources: "/zh/research/evidence/2026-08-27-runtime-semantics-evidence-pack"
project_relevance: first-party-research
item_id: "RSEM-20260827-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-27-agent-stop-evidence-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-27-agent-stop-evidence-cover.png"
  kicker="数字员工 · 工程研究"
  title="取消了 Agent，子进程真的停了吗？从 Anywhere Agents 看 Agent Runtime 的停止证据边界"
  summary="取消是一项控制动作，停止是一组需要证明的后置条件。PID 消失、命令返回 0、执行树收拢与重新派工资格不能互相代替。"
  version="RSEM-20260827-01"
  status="工程研究 · 2026-08-27"
  languageHref="/en/digital-employee/2026-08-27-agent-stop-evidence"
  languageLabel="English"
/>

# 取消了 Agent，子进程真的停了吗？从 Anywhere Agents 看 Agent Runtime 的停止证据边界

**取消是一项动作；停止是一组后置条件。**

这两个概念在 Agent 系统里很容易被一枚“已取消”图标合并。用户点击 Cancel，Runtime 发出终止命令，命令返回成功，于是页面显示“Stopped”。但如果旧 child 仍在写文件、一个 grandchild 已经脱离原进程组，或者结果文件只是暂时不可读，那么“停止成功”其实把几种完全不同的事实压成了一个结论。

真正重要的问题不是 Cancel 按钮有没有生效，而是：**系统到底证明到了哪一层？**

## 1. Anywhere Agents 先给出了一条很严格的观察规则：看不到，不等于不存在

Yue Zhao 在 Anywhere Agents 的提交 `570c89f` 中处理了一批被中断后留下的 `prun-task-*` 工作单元。作者报告：有 **27 个 unit 已记录 result path，但对应 result file 已经消失；同时仍保留 24.3 MiB tail output**。这些数字来自该提交的工程现场报告，本文没有独立复现。

更值得注意的不是数量，而是它对“观察失败”的处理方式。`report-state` 没有把 unit 简化成“可恢复 / 已失败 / 可重派”，而是拆成两个正交字段：

- `result_path_state`：记录的结果路径是否能被解析；
- `result`：目标文件当前到底是 `present / empty / missing / unknown`。

只有明确收到 `FileNotFoundError`，工具才允许把结果写成 `missing`。权限拒绝、I/O 错误、非普通文件、入口过长或根目录不可读都不会被偷换成“不存在”。提交里把原则写得非常直接：

> **failed observation never becomes an outcome**

也就是：**观察失败，不能自动升级成执行结论。**

这条规则对“取消 Agent”同样适用。根 PID 看不到，最多说明根 PID 当前不可观察；只有拥有更强的 containment 证据，系统才有资格把结论扩大到整个执行树。

## 2. Issue #29 更进一步：四轮更强的“已回收”都被反例推翻

Anywhere Agents 的开放 Issue #29 很有研究价值，因为它不是只提出“孤儿进程难处理”，而是记录了四轮逐步加强的 `reap-orphans` 方案，以及每一轮为什么仍然不足。

| 轮次 | 当时想证明什么 | 被什么反例推翻 |
| --- | --- | --- |
| Round 1 | signal 已发送，所以可以说 `REAPED` | `kill` 全部失败，仍然报告 `REAPED` |
| Round 2 | 记录的 root 已消失 | descendant 忽略 `TERM` 后继续存活 |
| Round 3 | process group 已为空 | descendant 用 `setsid` 离开原 group |
| Round 4 | 多轮快照 fixed point 已收敛 | 短寿命 intermediate 在两次枚举之间生成 grandchild 后退出，grandchild 从未进入 seen set |

Round 4 尤其关键：它不需要 PID reuse、不需要查询失败、也不需要扫描超时。纯粹依靠时序，就可以出现：reaper 认为已经收敛、打印 `REAPED`，但 grandchild 仍然活着。

因此 issue 最后的结论不是“再多扫几遍”，而是把证明责任前移到 **dispatch time**：如果 worker 在启动时没有被放进内核可约束的 closed set，之后的 reaper 只能通过 PID、parent link 和 process group 去推断成员，而这些关系都可以逃逸。

作者提出的方向是：Windows 用 **Job Object**，POSIX 保证 session / `setsid`；只有 containment 先在 spawn 时成立，后续 reaper 才有资格对整个执行树作更强的 postcondition 声明。该 issue 甚至把 `REAPED` 保留给 kernel-backed containment，在这一前提真正实现之前不让它成为可达结果。

这不是 CodeFlowMu 的实现依据，也不证明我们的 Runtime 存在同样 bug。但它给出一个非常有用的审计原则：

> **停止范围越大，证明责任越不能只靠“我现在没看见它”。**

## 3. 一个“已停止”状态至少压着六种不同事实

为了避免把动作和后置条件混在一起，可以把取消现场拆成下面几层：

| 事实层 | 能证明什么 | 不能证明什么 |
| --- | --- | --- |
| cancellation requested | Runtime 确实发出了取消意图 | 操作系统已经停止任何进程 |
| termination command succeeded | 终止工具返回了成功结果 | 所有 descendant 已退出 |
| root exit observed | 已知 root / wrapper PID 不再可观察 | child、grandchild、句柄、端口都清理完毕 |
| known child exit observed | 已知 direct child 已退出 | 没有逃逸 descendant |
| containment proven | 执行单元属于可被整体约束的 closed set | 工作区一定没有异步尾部写入 |
| redispatch eligible | 调度规则允许新一轮执行 | 上一轮所有 OS 资源都已被证明消失 |

这六层可以互相引用，但不能互相代签。

尤其要避免两种跳跃：

**`taskkill exit 0 → entire tree gone`**

以及：

**`PM allowed retry → old execution definitely gone`**

前者把工具结果扩写成 OS containment 事实；后者把治理许可扩写成进程事实。

## 4. 我们自己的 Windows 探针到底证明了什么

CodeFlowMu 是我们正在开发的本地多 Agent Runtime。第一方代码路径在 Windows 上使用：

```text
taskkill /PID <pid> /T /F
```

来终止受管命令的 wrapper 及其 Windows 进程树视图。

我们没有直接把这条命令写成“进程树已安全收拢”。相反，我们做了一个故意很窄的实验：在新的临时目录里启动一个 wrapper，再由 wrapper 启动一个长寿命 direct child；确认两个 PID 都存在后，对 wrapper 执行同一条 `taskkill /T /F`，随后分别观察两个 PID。

那次受控 Windows 主机记录为：

- `taskkill` exit code = `0`；
- wrapper exit observed = `true`；
- direct child exit observed = `true`；
- `kernel_containment_proven = false`。

因此这次 **PASS** 只能支持一句很窄的话：

> **在这个 Windows 主机、这个 wrapper + direct child 样本中，`/T` 没有只结束 wrapper；两个已知 PID 都被观察到退出。**

它不能支持：

> “任意深度 Windows Agent 进程树都已被证明收拢。”

目前公开证据包已经把这个实验合同物化成 Windows 专用 probe，并公开了脱敏 recorded result 和 record-check。读者可以在自己的 Windows 机器上重新运行同一二层合同；非 Windows 主机则直接拒绝运行，不会返回假 PASS。

这比只给一行“1/1 PASS”更重要，因为**可重跑不等于扩大结论**。即使别的 Windows 主机再次 PASS，也仍然没有覆盖 escaped descendant、短寿命 intermediate、跨权限、更深层级、容器或远程 worker。

## 5. `cancelled` 更适合被理解成控制面结果，而不是 containment 证明

这里还有一个值得我们自己继续收紧的语义问题。

当前第一方受管命令路径在终止工具成功后，可以把本次 command 记录进入 `cancelled`。这个字段对控制面是有价值的：它说明**这次取消操作已经按当前机制执行完**。但如果 UI 或后续调度把 `cancelled` 直接解释成“所有 descendant 都不存在”，语义就超出了当前证据。

更稳健的停止记录应该拆成独立字段或独立证据轴，例如：

```text
cancel_request          sent
termination_command     exit_0
root_exit               observed
known_child_exit        observed
containment             unverified
workspace_quiescence    unverified
redispatch_eligibility  decided_by_existing_rule
```

这样，“未知”不会被强行塞进“失败”，也不会因为控制命令成功就被涂成全绿。

## 6. 静默也不能被写成死亡

停止证据还有另一面：不仅不能把“看不到”写成“已经死了”，也不能把“暂时没有输出”写成“已经失活”。

我们重跑过一个既有 managed-command fixture：受管作业经历模拟两小时静默、101 次观察，以及索引丢失后的 restart recovery，仍然保持为可诊断记录。这个定向 test 是 **1/1 PASS**。

它回答的不是进程树 containment，而是另一条语义边界：

> **silence ≠ death**

和前面的：

> **cancel requested ≠ tree gone**

其实属于同一种纪律——Runtime 应记录它真正观察到的事实，而不是用缺少新信号来补一个更方便的结论。

## 7. 真正危险的是取消和重派之间的空白区

为什么要这么较真？因为最昂贵的事故往往不是第一次执行失败，而是**第二次执行启动得太早**。

旧 wrapper 已经退出，但某个 descendant 仍在写文件；PM 根据业务规则批准 retry；新的 Agent 又拿到同一个 workspace。此时 lease 可以阻止同一调度路径上的两个正式 attempt 同时占有执行权，但 lease 本身不能杀掉一个已经逃逸到 Runtime 观察之外的 OS 进程。

所以“能否重派”至少要明确区分两种判断：

- **governance / scheduling eligibility**：这项任务是否允许产生新 attempt；
- **execution-environment safety evidence**：旧执行现场是否已经达到当前要求的收拢程度。

前者是任务治理问题，后者是运行环境问题。一个正确的调度许可不能替操作系统签字。

## 8. 下一批反例比再加一个绿色状态更有价值

如果继续研究这条问题，我认为最值得补的不是一个更漂亮的 `Stopped` badge，而是更具攻击性的反例：

- wrapper 退出，direct child 继续运行；
- child 主动脱离原 process group / parent relation；
- transient intermediate 在两次观察之间生成 grandchild；
- 旧结果文件在 root exit 后继续增长；
- 取消完成与 redispatch 同时竞争；
- 进程退出但端口、文件锁或外部 helper 仍未释放。

每个实验都应该输出同一套结构：

**发生了什么动作 → 观察到哪些对象 → 哪些 postcondition 已证明 → 哪些仍未知 → 因此允许什么下一步。**

这比把所有结果压成 `cancelled=true` 更适合长期运行的 Agent Runtime。

## 结论：停止不是一个按钮结果，而是一份有范围的证明

Anywhere Agents 的 `report-state` 提醒我们：**观察失败不能变成结果。** Issue #29 又进一步说明：**如果执行树从一开始就不是一个被内核约束的 closed set，事后枚举很难证明它已经完全消失。**

我们的 Windows 二层探针则给出一个更小、更具体的事实：`taskkill /T /F` 在一个 wrapper + direct child 样本上确实观察到了两者退出。这个事实值得保留，但也必须停在这里。

> **取消请求是一项动作；停止是一组后置条件；执行树收拢是一项更强的证明。**

可靠的 Agent Runtime 不需要假装知道所有事。它只需要在重新派工之前，明确告诉下一位执行者：**什么已经停下，什么只是没看见，什么仍然没有被证明。**

---

## 公开证据

- [**Runtime 语义三篇文章：公开证据包**](/zh/research/evidence/2026-08-27-runtime-semantics-evidence-pack)
- [**R1 Windows `taskkill /T /F` 公开 probe**](/assets/evidence/2026-08-27-r1-windows-taskkill-tree-probe.cjs)
- [**R1 脱敏已记录结果**](/assets/evidence/2026-08-27-r1-windows-taskkill-recorded-result.json)
- [**R1 recorded-result check**](/assets/evidence/2026-08-27-r1-windows-taskkill-recorded-result-check.mjs)

## 来源与证据边界

### Anywhere Agents

- [**commit `570c89f`**](https://github.com/yzhao062/anywhere-agents/commit/570c89f4c4bfa03bc5cea0a43a7fcf9fef0261ab)：本文引用其 `report-state` 对 result-path observation 与 result outcome 的拆分，以及作者报告的 27 个遗留 unit、24.3 MiB tail。数字为作者工程现场报告，本文未独立复现。
- [**Issue #29**](https://github.com/yzhao062/anywhere-agents/issues/29)：本文引用四轮 orphan-reaping 方案被 live counterexample 逐步推翻、以及将 tree-wide 证明前移到 dispatch-time kernel-backed containment 的设计讨论。该 issue 仍为开放状态，不能视为已发布完成方案。

Anywhere Agents 只作为公开研究与工程参照；本文不据此声称 CodeFlowMu 与其共享根因、实现或已达到同一 containment 设计。

### 第一方证据

R1 只覆盖一台 Windows 主机上的一个 wrapper + direct child 样本。公开 probe 让相同二层合同可以被重跑，但并不把历史 PASS 升级成 Job Object / kernel containment 证明。本文也不声称所有 Windows 进程树、独立 Runtime、网络文件系统、容器或远程 worker 已获得同样保证。
