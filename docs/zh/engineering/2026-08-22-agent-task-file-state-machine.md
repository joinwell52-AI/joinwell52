---
title: "任务怎样在 Agent 团队中流转？文件状态机如何记录领取、执行、审查与完成"
date: '2026-08-22'
column: open-source-engineering
category: daily
article_type: mechanism-analysis
edition: research-center
research_question: "一张任务如何在文件状态机与运行轨道中保持唯一身份，并经过合法迁移进入验收？"
summary: "任务正文、目录位置、执行报告和人工验收回答的是不同问题。本文沿一张任务的完整生命史，解释 FCoP 状态机与 CodeFlowMu V1.9.7 候选实现如何防止串线、重复执行和提前完成。"
item_id: "MANUAL-20260822-AGENT-TASK-FILE-STATE"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-22-agent-task-file-state-machine-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
sources:
  - research/manual-runs/2026-08-22-codeflowmu-rail-state-series-round1/02-source-register.md
  - research/manual-runs/2026-08-22-codeflowmu-rail-state-series-round1/02-fact-claim-matrices.md
---

<ArticleCover
  image="/assets/covers/daily-2026-08-22-agent-task-file-state-machine-cover.png"
  kicker="开源工程 · 项目研究"
  title="任务怎样在 Agent 团队中流转？文件状态机如何记录领取、执行、审查与完成"
  summary="路径、迁移历史、执行报告和验收决定各自保存不同事实；把它们压成一个 done 字段，才会制造串线和提前完成。"
  version="MANUAL-20260822-AGENT-TASK-FILE-STATE"
  status="Editorial &amp; Visual PASS · 2026-08-23"
  languageHref="/en/engineering/2026-08-22-agent-task-file-state-machine"
  languageLabel="English"
/>

# 任务怎样在 Agent 团队中流转？文件状态机如何记录领取、执行、审查与完成

一张任务的正文写着 `status: done`，文件却还在“执行中”目录；开发报告已经生成，测试证据尚未出现；界面因为看到报告，把下游发布任务点亮了。四个信号同时存在，系统究竟该相信谁？

可靠的答案不是选一个“最像完成”的字段，而是承认它们回答不同问题：**路径说明任务现在处于哪个生命周期阶段，事件说明它怎样走到这里，报告说明执行者交回了什么，验收决定说明有权主体是否接受。**

本文沿一张任务的完整生命史，拆解文件状态机与工程轨道机怎样配合。读完后，你将得到一组可以直接写成测试的任务不变量，而不是一份文件夹命名说明书。

## 第一条规则：不要把四种事实压成一个 `done`

| 事实 | 回答的问题 | 在当前体系中的典型载体 |
|---|---|---|
| 生命周期状态 | 任务现在走到哪一步？ | FCoP `_lifecycle/` 路径 |
| 迁移历史 | 谁在何时通过什么动作改变了阶段？ | TASK 内只追加的 `transitions` 事件 |
| 执行回执 | Agent 实际提交了什么结果和证据？ | `REPORT-*` |
| 验收决定 | 有权主体接受、打回还是拒绝？ | 生命周期审批、独立 REVIEW 或 Runtime 验收轴 |

这四类事实可以互相关联，却不能互相代替。报告出现不等于验收通过；正文里的状态字段不等于当前目录；进入 `review/` 也不意味着已经存在一份独立的 `REVIEW-*` 治理文件。

[FCoP v3 当前规范](https://github.com/joinwell52-AI/FCoP/blob/main/spec/fcop-v3-spec.zh.md) 对最后一点专门作了消歧：`_lifecycle/review/` 是 TASK 当前等待生命周期确认的阶段，而 `reviews/REVIEW-*.md` 是针对某个制品的独立治理判断。两者可以同时存在，但协议没有规定自动一一对应。

![文件状态机的当前路径、只追加迁移历史、报告与验收决定分别保存不同事实](/assets/covers/daily-2026-08-22-agent-task-file-state-machine-figure-1.svg)

*图 1：当前路径、迁移事件、REPORT 与验收决定的分工。物理时间可以辅助调查，但不能独自裁决因果顺序。来源：本文根据 FCoP v3 规范与 CodeFlowMu V1.9.7 候选证据整理。*

## 一张任务的五段生命史

下面用“增加 CSV 导出并完成兼容性测试”作为例子。

### 1. 创建：先得到稳定身份，再进入收件箱

PM 根据已批准的需求建立新任务。FCoP 的路由信封使用 TASK 文件，文件名包含类型、日期、序号、发送方和接收方；文件进入 `_lifecycle/inbox/`。

此时“创建完成”只表示任务对象已经存在，并不表示 Agent 已领取，更不表示工作已经开始。对于团队任务，Runtime 还需要保留根任务、父任务和线程身份，让后续子任务与报告能够回到同一责任树。

### 2. 领取：路径移动，事件同时见证迁移

当合法生命周期工具领取任务时，TASK 从 `inbox` 迁到 `active`。协议要求同时追加一条迁移事件，记录 `from`、`to`、`by` 和 `tool`。

FCoP 的实现模式不是先改正文、再搬文件、最后补日志，而是把新事件写入目标目录的临时文件，持久化临时文件，再执行同一文件系统边界内的名称替换。名称替换是可观察的提交点。

POSIX.1-2024 的 [`rename()`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html) 规定了原子目录项操作语义：其他观察者在替换过程中应看到旧条目或新条目，而不是半个名字。但这项保证有清楚边界：它不是跨挂载点事务，不证明目录元数据已经在突然断电后持久化，也不替网络文件系统提供强一致。

还要再收紧一步：如果某个实现先在目标目录发布新文件，随后才删除源文件，那么 `rename` 只原子化了目标发布，并没有把“目标出现”和“源文件删除”合成一个跨目录事务。崩溃窗口里，同一 TASK 可能同时留在 `inbox/` 与 `active/`。这时读端**不能**根据 `transitions` 里看似较新的事件擅自挑一个目录，因为 FCoP 的规则是“路径定义 NOW，事件只记录 PAST”。正确行为是报告并保留双阶段冲突，停止把它投影成单一当前状态；清理或恢复必须通过后续受权的生命周期动作完成。

所以准确说法是：**同一受支持文件系统边界内的 rename 可以形成目标发布的原子提交点；它不会让整个多 Agent 系统天然并发安全。**

### 3. 执行：轨道机调度并核对前置条件

任务进入 `active` 后，文件状态机只说明“已经被领取”。真正启动 Agent、挂载工具、运行测试和保存输出的是 CodeFlowMu 这样的工程轨道机（Runtime，运行时）。

V1.9.7 候选母版把任务命令集中到统一命令内核。一个命令请求会绑定任务、根任务、线程、轮次、预期修订、理由和防重复流水号。下面是从私有母版固定提交收缩出的字段示意；它不是 CodeFlowMu Open 源码，公众不能据此克隆复现，字段和结构也经过了为本文论点服务的删减：

```ts
type TaskCommandRequest = {
  task_id: string;
  root_task_id: string;
  thread_key: string;
  expected_revision: string;
  round_id: string;
  idempotency_key: string;
};
```

这里有三道防线。

第一，`task_id`、`root_task_id` 和规范线程身份必须一致，防止命令从相邻任务串入本任务。V1.9.7 还统一了带查询后缀与不带后缀的线程键：

```ts
export function canonicalThreadKey(value: unknown): string {
  return String(value ?? "").trim()
    .replace(/#TASK-\d{8}-\d{3,}.*$/i, "");
}
```

这段函数解决的是一个具体问题：账本查询使用的 lineage（谱系）后缀只是查询桶，即把同一责任链暂存到一起的索引后缀，不能被误认成第二个任务身份。

第二，`expected_revision` 用于拒绝旧快照上的写入。PM 看到修订 A 后准备批准，如果任务已经变成修订 B，旧动作不能继续套用。

这里需要避免把一个接口字段讲成未经证实的算法。本轮已检查的私有母版证据只证明命令会绑定并核对 `expected_revision`，没有公开它究竟由内容摘要、单调版本号、事件序号还是其他规范化方案生成。因此本文把它称为“当前任务版本的前置条件令牌”，而不写成基于 mtime（文件修改时间）的机制；后者不能承担因果版本。要验证其强度，需要在固定任务上分别改变正文、迁移事件和证据引用，再重放旧令牌，观察哪些变化会使命令失效。

第三，`idempotency_key`（防重复流水号）把一次业务意图与网络重试分开。同一流水号和同一业务指纹再次到达时，命令内核返回已有结果；同一流水号却代表不同意图时，系统报告冲突。它降低重复创建 TASK、执行轮次或派工的风险，但不等于所有外部工具副作用都实现了严格的 exactly-once（只执行一次）。

### 4. 依赖：没轮到的 Agent 不应收到“失败任务”

假设 QA 任务依赖 DEV 交付。PM 应创建两个不同子任务，并在 QA TASK 中显式写入 DEV 任务依赖。CodeFlowMu 的 Dispatcher（派工器）可以把未满足依赖的任务留在等待队列，等上游出现符合合同的完成报告后再释放。

正确语义是“现在还没轮到 QA”，不是“QA 执行失败”。如果系统提前唤醒 QA，再让 QA 写一份 blocked（阻塞）报告，下游看到的将是一场由调度错误制造的假故障。

显式依赖也不能靠“同一线程里最近完成的 DEV 任务”代替。同一线程可能保存多轮返工；本轮 QA 必须引用本轮新建的 DEV 子任务，不能拿旧报告满足新依赖。

另一个不能跳过的问题是依赖环：A 等 B、B 又等 A 时，等待队列本身不会自动产生答案。本轮已检查的 V1.9.7 材料证明了显式依赖排队和释放，却没有证明已经实现完整的 DAG（有向无环图）校验。因此不能把“检测到环路就自动异常挂起”写成当前功能。它应成为派工器的明确测试：提交包含环的依赖图时，系统要在入队前给出可检查的冲突或问题记录，而不是让任务无限等待。

### 5. 交回与验收：执行者提交，决定者接受

开发 Agent 完成工作后写 REPORT，报告应绑定当前任务和执行轮次，并携带可以检查的代码与测试证据。随后 TASK 可以进入 `review`，由有权角色确认或打回。

这里必须守住两条分离：

- Agent 自己写 `status: done`，只是它对本次执行结果的声明；
- PM 或 ADMIN 根据当前版本与证据作出的接受决定，才是业务验收。

[TMPA Core S1.0](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-zh.md) 要求来源、角色和生命周期可以被确定性重建。CodeFlowMu V1.9.7 的事实内核也把 Report 与 Acceptance 分为两条轴：报告存在时，验收仍可以是 pending（待决定）。

这能防止一种非常常见的提前完成：Runtime 看到 `REPORT-*`，就直接把根任务变绿。正确做法是先核对报告归属、证据和当前修订，再把决定交给有权主体。

## 长作业为什么还需要另一条执行状态

文件生命周期描述的是协作任务，不适合记录一个编译进程的每个瞬间。V1.9.7 候选实现因而把长作业作为可选的 Runtime 服务：需要跨会话存活、重启恢复、持续日志或精确取消时，可以使用托管命令；普通短测试和构建仍可使用 Host（宿主环境）原生命令工具。短命令不进入托管服务时，不会生成该服务的 `job.json`；它的原始输出仍应作为 REPORT 证据被记录或引用，但具体采用附件、链接还是其他承载格式，不是本轮已核验的接口合同。

托管作业记录绑定任务、会话、执行轮次和执行权标识，每个作业自己的 `job.json` 是权威记录，汇总索引只是可重建缓存。这样，Runtime 重启后可以重新发现仍在运行或已经终止的作业，而不是根据“原 Agent 会话消失了”猜测业务结果。

Windows 提供的 [Job Objects（作业对象）](https://learn.microsoft.com/en-us/windows/win32/procthread/job-objects) 说明了另一种操作系统级思路：把一组进程作为单元管理和终止。它没有证明 CodeFlowMu 使用全部 Job Object 能力；这里的价值是提醒工程师，任务状态、模型会话和操作系统进程是三种不同生命周期，不能共用一个布尔状态。

## 五组必须写进测试的不变量

### 身份不变量

- 一项工作只有一个规范任务身份；
- 子任务明确引用根任务和父任务；
- 报告不能只凭线程相同或时间最近挂账。

### 状态不变量

- 当前阶段只从合法生命周期位置读取；
- 同一 TASK 同时出现在两个阶段时，保留冲突并停止猜测；
- 正文状态不能覆盖路径事实。

### 迁移不变量

- 只允许规范列出的迁移；
- 每次迁移产生一条只追加事件；
- 原子提交只在声明的文件系统边界内成立。

### 执行不变量

- 角色能力、任务作用域和当前修订在执行前重新核对；
- 相同业务命令的网络重试不重复制造工作；
- 显式依赖未完成时不启动下游 Agent。

### 验收不变量

- REPORT 不自动变成业务接受；
- 旧修订上的批准不能作用于新修订；
- 执行者不能单方面关闭需要独立验收的任务。

这些不变量并不会证明报告内容真实，也不会替代沙箱、代码审查或安全测试。它们解决的是更基础的问题：系统是否知道自己正在处理哪项工作、处于哪一步、依据哪份证据、由谁作决定。

一张任务能够可靠走完整条链，不是因为文件名足够漂亮，而是因为**状态、历史、执行、报告和验收各有自己的事实位置，同时又被同一个稳定身份连接。**这才是文件状态机与工程轨道机真正配合的地方。

这套文件状态机也有明确的不适用边界：不能把单机 `rename` 直接扩展成多主机强一致，也不能用目录时间戳代替因果版本。当前材料没有覆盖任意崩溃点、所有外部工具副作用或全部平台。下一步应在写入、持久化和 `rename` 各阶段注入故障，重放旧修订命令，并测试依赖串线和双阶段冲突能否被保留。版本文件和实机进程显示 V1.9.7，并不等于产品已经正式 `RELEASED`；最终版本决定仍属于 ADMIN。

## 资料与证据边界

- [FCoP v3 当前规范](https://github.com/joinwell52-AI/FCoP/blob/main/spec/fcop-v3-spec.zh.md) 与 [TMPA Core S1.0](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-zh.md)：支持本文对 TASK、REPORT、REVIEW、目录生命周期和可重建来源关系的描述；不承诺任意文件系统都提供同一行为。
- [POSIX.1-2024 `rename()`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html)：支持同一文件系统内目录项替换的原子观察语义；不支持跨挂载事务、断电持久性或网络文件系统强一致的推断。
- [Windows Job Objects](https://learn.microsoft.com/en-us/windows/win32/procthread/job-objects)：说明进程组可作为操作系统管理单元；并不证明本文运行时采用了全部 Job Object 能力。
- 文中 V1.9.7 结果是第一方固定环境的工程证据，不是第三方认证或跨平台可靠性结论。访问日期：2026-08-23。
