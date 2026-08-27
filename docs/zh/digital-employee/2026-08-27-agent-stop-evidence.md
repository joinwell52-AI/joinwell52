---
title: "取消了 Agent，子进程真的停了吗？本地多 Agent 运行时的“停止”证据该怎么读"
date: '2026-08-27'
column: digital-employee
category: daily
article_type: engineering-analysis
edition: research-center
research_question: "在本地多 Agent 运行时中，一次取消请求、根进程退出与整棵执行树已收拢，能否被同一个“已停止”状态代替？"
summary: "从一批“结果不见、尾部还在”的真实外部工作单元出发，结合一次 Windows 窄探针，讨论为什么取消请求不能被写成进程树已经收拢。"
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
  title="取消了 Agent，子进程真的停了吗？本地多 Agent 运行时的“停止”证据该怎么读"
  summary="从一批“结果不见、尾部还在”的真实外部工作单元出发，结合一次 Windows 窄探针，讨论为什么取消请求不能被写成进程树已经收拢。"
  version="RSEM-20260827-01"
  status="工程研究 · 2026-08-27"
  languageHref="/en/digital-employee/2026-08-27-agent-stop-evidence"
  languageLabel="English"
/>

# 取消了 Agent，子进程真的停了吗？本地多 Agent 运行时的“停止”证据该怎么读

有一类 Agent 故障最容易被界面掩盖：任务已经停了，留下的尾部输出还在，记录里也有一个结果路径；可那个结果文件已经不在原处。此时最自然的冲动是“把任务再派一次”。可只要旧的执行者或子进程还在写工作区，第二次派工就可能把两次执行叠在一起。

赵岳在 Anywhere Agents 的一次维护中遇到过这样的遗留现场：**27 个工作单元记录过结果路径，但目标结果文件已经消失，仍有 24.3 MiB 尾部输出可供检查。** 他没有把这些单元统一叫作“可恢复”或“已失败”。相反，工具把“路径能否解析”和“结果能否观察”分成两个字段；读取权限错误、I/O 错误和不存在是不同结果。只有确实收到 `FileNotFoundError`，它才说文件“缺失”。[原始提交](https://github.com/yzhao062/anywhere-agents/commit/570c89f4c4bfa03bc5cea0a43a7fcf9fef0261ab)把这条规则写得很克制：观察失败，不能变成执行结论。

这件事让我们回头看取消按钮。CodeFlowMu 是我们正在开发的一个本地运行多 Agent 协作系统。取消一条 DEV 任务时，页面要不要显示“已停止”？在回答之前，我们先问了一个更具体的问题：**系统究竟看到了什么？**

## 一个取消按钮后面，其实站着四个不同的事实

假设一个 Agent 正在构建项目。负责人发现它拿到的是旧需求，于是取消本轮执行。接下来可能依次发生：Runtime 发出终止请求；外层 wrapper 进程退出；它启动的直接 child 退出；结果文件停止变化；任务获得新一轮执行资格。

这些不能合成一句“停止成功”。

| 现场里发生的事 | 它可以证明什么 | 它不能证明什么 |
| --- | --- | --- |
| Runtime 记录了取消请求 | 系统确实尝试停下本轮执行 | 操作系统已经终止任何进程 |
| wrapper PID 消失 | 已知的外层进程不再存在 | 后代进程、文件句柄或端口已清理 |
| 直接 child 也消失 | 当前观察范围内的一层 child 已退出 | 没有逃逸的后代在别处继续运行 |
| 结果路径不可读 | 当前无法从该位置取得结果 | 任务没有其他副本，或生产者不会再写入 |
| PM 允许重新派工 | 一条新的正式执行被允许 | 上一次执行树已被完全收拢 |

![图 1：一次取消实际证明到哪里](/assets/figures/2026-08-27-agent-stop-evidence-figure-1.svg)

*图 1：取消请求、外层进程退出和一层直接子进程退出，是三种可以分别观察的事实；它们共同构成本轮 Windows 检查的范围，但不等于已经证明任意深度的进程树都被收拢。来源：公开候选证据包 R1。*

真正危险的，是最后两行被偷换：某个结果没读到，或负责人想尽快恢复，不会自动清空旧现场。

## “根进程没了”为什么仍然不够

Anywhere Agents 的 [Issue #29](https://github.com/yzhao062/anywhere-agents/issues/29) 把这个问题推进得更深。作者复盘了四轮“reap orphan”（回收孤儿进程）实现：一开始只证明信号已发送；后来证明记录的根进程不在；再后来检查进程组；最后尝试从多轮快照收敛。每一轮都被一个更窄的反例推翻：后代可以忽略信号、离开进程组，或在两次枚举之间产生新的 child。

因此这个开放 issue 主张把 worker 放进内核可约束的容器，让“已回收”成为可证明的事实，而不是从 PID、父子关系和进程组推出来的猜测。它讨论的是 Anywhere Agents 的设计路线，并不说明 CodeFlowMu 有同一种 bug；它给我们的提醒只有一条，却足够重要：**看不见一个进程，和能证明它不存在，是两种能力。**

## 我们做了一次很小的 Windows 检查

CodeFlowMu 的受管命令记录已经区分任务、执行轮次、租约、wrapper/child PID、心跳、取消请求与取消结果。Windows 取消路径会调用 `taskkill /PID <pid> /T /F`，尝试结束该 PID 及其子树。

为了知道这句话到底能说到哪里，我们没有直接把它写成“进程树安全回收”，而是在隔离临时目录创建了一个 wrapper 和一个直接 child，再让 Runtime 使用同一条 `taskkill /T /F` 路径终止 wrapper。探针结果是 **1/1 PASS**：wrapper 与这个直接 child 都退出。

这个结果解决了一次具体疑问：在这台 Windows 主机、这类两层进程关系中，`/T` 确实没有只杀掉外层。它没有解决更大的问题：child 能不能脱离原关系？更深的后代、不同权限、容器和远程执行器怎么办？代码阅读中也还没有发现 Windows Job Object（作业对象）一类内核级 containment 的实现或回归夹具。

我们还重跑了一个既有的静默作业夹具：一个受管命令经历模拟两小时、101 次观察以及索引丢失后的重启恢复，仍被保留为可诊断记录，结果 **1/1 通过**。这条测试回答的不是“进程都死了吗”，而是另一件同样重要的事：没有新输出，不能被 Runtime 悄悄写成“已经死亡”。

## 交接给下一位 Agent 的，不应是一句“已停止”

真正有用的做法是把停止结果交成一张小小的证据单。下一位 Agent 或 PM 不需要先读一屏日志，只需要看清下面几项：

```text
本轮执行：取消请求已发送
外层进程：已观察退出
已知直接 child：已观察退出
执行树收拢：未验证
结果文件：当前不可读 / 仍待确认
下一步：由既有重派规则或 PM 决定
```

这里“未验证”不是失败，也不是逃避。它阻止的是一种昂贵的误操作：系统把未知现场当作清理完毕，然后让新的 Agent 在同一工作区开始第二轮修改。

本地优先并不要求我们装作已经解决了分布式进程管理。当前产品范围是一个本地工作区与一个受控 Runtime；同一任务在本地调度路径中的并发领取已有租约互斥，另一方会收到 `LEASE_CONFLICT`。这降低了同一路径把两个 DEV 同时派到同一任务的风险，但不能外推成两个独立 Runtime、网络文件系统或任意进程树的保证。

下一步值得建设的不是更醒目的“取消成功”绿勾，而是三类反例：wrapper 异常退出但 child 继续运行；child 脱离原进程关系；结果仍在写入时又收到取消和重派。每个反例都应该留下同一组答案：系统看到了什么、没看到什么、据此允许了什么。

一条可靠的取消记录不必假装无所不知。它只要让团队在重新派工前，清楚地区分：已经停下的部分，和仍然需要被证明的部分。

## 来源与证据边界

本文外部现场来自赵岳的 [Anywhere Agents commit 570c89f](https://github.com/yzhao062/anywhere-agents/commit/570c89f4c4bfa03bc5cea0a43a7fcf9fef0261ab) 与仍开放的 [Issue #29](https://github.com/yzhao062/anywhere-agents/issues/29)。[公开证据包](/zh/research/evidence/2026-08-27-runtime-semantics-evidence-pack)给出 Windows 探针的逐项条件与脱敏输出。第一方材料仅覆盖本文列出的受控范围；它们不证明 CodeFlowMu 已实现内核级进程收拢，也不提供任意 Windows 进程树的回收保证。
