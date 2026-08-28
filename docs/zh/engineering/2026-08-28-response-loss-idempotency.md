---
title: "工具报错后还能重试吗？一次响应丢失实验：为什么报告没重复，任务却建了两次"
date: '2026-08-28'
column: open-source-engineering
category: daily
article_type: engineering-case-study
edition: research-center
research_question: "当副作用已经发生但响应丢失时，Agent Runtime 怎样区分安全重试、结果复用与冲突拒绝？"
summary: "同一组响应丢失实验中，CodeFlowMu 的报告写入复用了既有结果，任务创建却生成了第二张任务。文章用可重跑夹具解释为什么重试安全必须逐工具验证，并给出持久提交身份的最小工程合同。"
sources: "/zh/research/evidence/2026-08-28-response-loss-idempotency"
project_relevance: substantive-relationship
item_id: "RBE-20260828-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-28-response-loss-idempotency-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-28-response-loss-idempotency-cover.png"
  kicker="开源工程观察 · 故障实验"
  title="工具报错后还能重试吗？一次响应丢失实验：为什么报告没重复，任务却建了两次"
  summary="副作用已经发生、响应却没有回来时，安全重试不能靠猜。两条真实写入路径给出了不同结果。"
  version="RBE-20260828-01"
  status="工程案例 · 2026-08-28"
/>
# 工具报错后还能重试吗？一次响应丢失实验：为什么报告没重复，任务却建了两次

一个工具调用返回异常，最危险的问题往往不是“要不要重试”，而是：

**第一次到底有没有执行成功？**

设想这样一个窗口：

```text
业务动作已经成功
        ↓
结果已经写入磁盘
        ↓
成功响应尚未到达调用方
        ↓
进程异常 / 连接中断 / 响应丢失
```

调用方重新恢复后，只能确认一件事：**自己没有拿到成功结果。**

它不能据此推导：

```text
没有收到成功响应
        =
业务动作没有发生
```

我们把这个故障窗口放进 CodeFlowMu 两条真实写入路径中测试，结果并不对称：

* 再次提交同一份执行报告，受测路径找回了已经落盘的结果，最终仍只有一份报告；
* 再次执行同一语义的任务创建请求，受测路径分配了新的任务编号，目录中出现两个内容等价、身份不同的任务对象。

这说明一个很容易被“平台支持去重”掩盖的问题：

> **调用失败只说明调用方没有确认结果，不说明动作没有发生；而某一个工具能够安全重试，也不代表其他有副作用的工具拥有相同保证。**

真正需要回答的不是“CodeFlowMu 有没有幂等”，而是：

> **哪一个工具，依据什么稳定身份，在什么持久边界上，能够找回第一次执行的结果？**

本文记录的不是一次生产事故统计，而是一组固定版本上的故障注入实验。它最终把问题从“Runtime 是否应该重试”缩小到了更具体的工程边界：**创建型副作用需要持久提交身份和可恢复结果回执。**

## 同一个响应丢失窗口，为什么产生两个不同结果

CodeFlowMu 是我们正在开发的一个本地运行多 Agent 协作系统。Agent 通过工具创建任务、提交报告，再由其他角色继续执行、检查和推进生命周期。

这意味着一次工具调用通常不只是“算出一个值”，而可能真正改变系统状态。

为了研究最难判断的窗口——**动作已经完成，但成功结果没有被调用方确认**——我们把实验固定在 CodeFlowMu V2.0.4、提交 `2ba1ad9b` 上。

脱敏后的实验结构、Reader 和检查脚本整理在 [A1 公开证据包](/zh/research/evidence/2026-08-28-response-loss-idempotency)。

实验分成三层。

### 第一层：只测试 Runtime 上层内存去重

先让一次有副作用的调用真正执行，但故意不把成功结果放入上层缓存。

然后模拟调用方失去这次响应、内存状态也无法用于恢复，再次提交相同调用。

结果是：

```text
第一次动作：已经发生
成功结果：未进入可复用缓存
第二次相同调用：允许再次进入真实执行路径
```

这个结果只能证明一件事：

**单靠调用进程里的 seen-set、cache 或 session 去重，无法解决跨进程恢复后的“结果未知”。**

但它还不能证明底层业务对象一定会重复。

因为真正的工具内部，仍然可能存在持久化防重复机制。

所以我们继续向下测试。

### 第二层：直接测试报告写入

对真实报告写入路径执行：

```text
第一次：
报告成功落盘
→ 故意模拟成功响应丢失

第二次：
相同任务
相同报告内容
相同 client_submission_id
→ 再次提交

观察结果：
deduplicated = true
最终报告文件数量 = 1
```

也就是说，即使上层第一次没有保住成功结果，受测报告路径仍然可以从持久状态中识别这次提交已经产生过结果。

第二次调用不是“再写一份”。

它更接近：

```text
查询这次提交是否已经完成
        ↓
发现已经存在
        ↓
返回第一次结果
```

### 第三层：换成任务创建

随后，我们对任务创建路径注入相同类型的故障：

```text
第一次：
任务已经成功创建
→ 故意模拟成功响应丢失

第二次：
发送方相同
接收方相同
主题与正文相同
线程关系相同
实验夹具仍把两次请求视为同一次业务提交
→ 再次进入真实创建路径

观察结果：
返回新的任务编号
最终任务对象数量 = 2
```

这里需要特别区分一个接口事实：

**在本次固定提交的 Runtime 工具合同中，`write_report` 已明确暴露 `client_submission_id`；`write_task` 并没有对应的正式持久幂等字段。**

因此，更准确的描述不是：

> `write_task` 已经接受了一个正式幂等键，但没有正确实现。

而是：

> **调用侧能够知道“两次请求属于同一次提交”还不够；如果任务创建合同没有把这份稳定提交身份绑定到持久业务对象，那么恢复后重新调用仍可能被解释成一次新的创建。**

同一个故障模型，由此得到一正一反两个结果。

![同一响应丢失窗口下，报告提交复用既有结果，而任务创建产生第二张任务](/assets/figures/2026-08-28-response-loss-comparison.zh.svg)

*图 1：相同类型的响应丢失窗口，在两个受测写入工具上产生不同结果。来源：[CodeFlowMu V2.0.4 固定提交上的 A1 故障夹具](/zh/research/evidence/2026-08-28-response-loss-idempotency)。该结论只覆盖本文实际测试的 `write_report` 与任务创建路径，不代表其他工具，也不代表生产环境发生频率。*

## LlamaIndex 暴露的是同一个故障窗口，不是 CodeFlowMu 的同一种实现

我们之所以专门检查这个窗口，来自一次外部工程信号。

2026 年 8 月 27 日，LlamaIndex 合并了 YZJF 提交的 [PR #22841](https://github.com/run-llama/llama_index/pull/22841)：`fix(core): avoid retrying failed function tools`。

该 PR 描述的问题非常具体。

原来的相关调用逻辑会先尝试一种 FunctionTool 调用形式。如果这次真实函数调用抛出异常，调用层可能把异常解释为“也许参数调用形式不对”，然后换一种参数形式再次执行同一个 FunctionTool。

问题在于：

```text
FunctionTool 开始执行
        ↓
已经产生不可逆副作用
        ↓
随后抛出业务异常或传输异常
        ↓
框架把异常理解成调用形式问题
        ↓
换一种参数形式再次真正执行
```

如果第一次其实已经完成了写文件、创建资源、发送请求或其他不可逆动作，那么第二次调用就可能重复副作用。

PR 的修复方式不是“捕获更多异常”，而是：

**在真正调用函数之前，通过被包装函数的签名确定应采用的位置参数或关键字参数形式，避免拿第一次真实执行去试探调用方式。**

PR 作者报告的定向测试结果包括：

```text
tests/tools/test_calling.py
4 passed

tests/program/test_function_program.py -k 'single_field'
3 passed

tests/tools
67 passed, 4 skipped
```

这个案例直接支持的结论其实很窄：

> **不能把“工具抛出了异常”自动翻译成“工具没有执行”。**

它并不证明 CodeFlowMu 存在 LlamaIndex 相同的参数回退逻辑。

这一区分很重要。

我们没有把外部 PR 当成 CodeFlowMu 缺陷证明，而是把它当成一个**故障模型来源**：

```text
外部工程案例
    ↓
提出问题：
异常发生时，副作用是否可能已经完成？
    ↓
在 CodeFlowMu 中设计对应故障注入
    ↓
逐工具验证
```

而第一方实验最终给出的结果比“失败后会重复执行”更精确：

**报告提交受测路径已有持久结果复用能力；任务创建受测路径则暴露出创建结果无法通过稳定提交身份恢复的问题。**

## 真正的边界不是“有没有重试”，而是“能不能找回第一次结果”

为什么两个工具面对相同故障窗口会产生不同结果？

关键不是工具叫“报告”还是“任务”，也不只是有没有一个 Runtime 去重器。

真正的区别是：

> **第二次调用到来时，系统能否仅凭持久事实回答：第一次请求到底创建了什么？**

这至少存在三个不同层次。

| 防重复位置                | 能解决什么                    | 无法保证什么                      |
| -------------------- | ------------------------ | --------------------------- |
| Runtime / 单进程内存缓存    | 同一运行期快速拦截重复工具调用          | Runtime 或调用方重启后，不能独立恢复第一次结果 |
| 工具自身持久幂等身份           | 可以从已经落盘的业务数据中识别某次提交      | 只保护真正实现了该合同的具体工具            |
| 持久创建回执 / reservation | 可以把“一次创建请求”稳定绑定到“一个业务对象” | 仍需正确处理并发、崩溃恢复、摘要冲突和原子占位     |

这也是为什么“平台支持幂等”通常不是一个足够有意义的工程结论。

更准确的问题应该是：

```text
tool = ?
stable submission identity = ?
persistent lookup boundary = ?
request equality rule = ?
recovery result = ?
conflict behavior = ?
```

只要其中一项没有定义，所谓“安全重试”就可能只在某个进程、某个调用器或某条工具路径上成立。

## 创建型操作真正缺少的是持久提交身份

对于查询型工具，失败后重试通常风险较低。

但对于创建任务、创建资源、发送消息、发布工件等操作，第一次执行会生成新的业务身份。

此时一个普通的：

```text
retry_count = 3
```

几乎没有解决核心问题。

真正需要的是：

**让一次业务提交先获得一个可以在崩溃后继续查询和恢复的持久身份。**

针对本次实验，我们冻结的工程合同把关系抽象成：

```text
submission_id
      ↓
request_digest
      ↓
预分配 task_id
      ↓
task_path
      ↓
最终 creation result
```

这里最关键的一点是：

**`submission_id` 绑定的不是“某次网络调用”，而是“一次业务创建意图”。**

第二次调用的职责不应首先是：

```text
再执行 create
```

而应该先问：

```text
这个 submission_id 是否已经拥有 reservation？
```

## 一个最小的创建状态机

最小持久状态可以表达为：

```text
reserved
   ↓
task_created
   ↓
committed
```

### `reserved`

系统先以原子方式占住 `submission_id`。

同时持久化：

```text
submission_id
request_digest
digest_version
allocated_task_id
expected_task_path
state = reserved
```

这一步必须发生在业务对象正式创建之前。

否则两个并发调用都可能先看见“还没有任务”，随后各自创建一个对象。

### `task_created`

任务文件已经真正出现，但最终机器可读回执可能还没有提交完成。

这是最关键的崩溃窗口：

```text
reservation 已存在
task 已创建
receipt 尚未 committed
进程崩溃
```

恢复器重新启动后不能分配新的 task_id。

它只能沿着原 reservation 检查：

```text
目标路径不存在
→ 使用原 task_id 继续创建

目标路径存在且 request_digest 一致
→ 接管已有对象并继续提交回执

目标路径存在但内容不匹配
→ conflict
```

**任何一种不确定状态，都不能通过“再建一张新任务”绕过去。**

### `committed`

最后形成稳定、机器可查询的创建回执。

此后任何相同：

```text
submission_id + request_digest
```

再次到来，都应该复用第一次结果。

而不是再次产生副作用。

## `reused` 应该是一种成功结果

这还会改变工具返回值的设计。

现在很多创建接口只会返回：

```text
创建成功
```

但对于 Agent Runtime 来说，这还不够。

一个可以支持恢复和自动决策的结果至少应该包含：

```text
task_id
task_path
submission_id
request_digest
digest_version

disposition =
  created
  | reused
  | conflict

action_taken =
  true
  | false
```

其中：

### `created`

本次调用真正完成了第一次创建。

### `reused`

系统发现这个 submission 已经完成，并返回第一次的业务对象。

这是**成功**，不是错误。

例如：

```text
disposition = reused
action_taken = false
task_id = TASK-20260828-017
```

它向调用方明确表达：

> 我没有再执行创建动作，但你的业务请求已经成功完成，这就是第一次创建的结果。

### `conflict`

相同 `submission_id` 被用于不同业务请求。

此时必须 fail closed：

```text
不创建第二个对象
不覆盖第一次结果
返回摘要冲突
```

否则幂等键本身反而会成为隐藏业务错误的工具。

## 为什么只有 submission_id 还不够

假设第一次调用：

```text
submission_id = abc-123

recipient = DEV
body = 修复登录错误
```

第二次却是：

```text
submission_id = abc-123

recipient = OPS
body = 发布生产环境
```

如果系统只比较 `submission_id`，那么它无法判断：

这是一次合法重试，还是调用方错误复用了一个旧身份。

因此还需要：

```text
request_digest
```

它负责证明：

**这次请求和第一次请求在业务语义上确实是同一个创建意图。**

## 哪些字段应该进入请求摘要

原则不是“把整个 JSON stringify 一遍”。

真正应该进入摘要的是那些会改变任务身份、内容、路由或执行顺序的字段，例如：

```text
sender
recipient
subject
body
thread_key
parent
references
depends_on
priority
```

而下面这类字段通常不应该让一次业务请求变成另一个请求：

```text
retry_count
调用时间
UI 展示文案
trace_id
连接编号
本次进程 pid
```

否则第一次：

```text
retry_count = 0
```

和第二次：

```text
retry_count = 1
```

反而会生成两个不同 digest，幂等恢复立即失效。

## 请求摘要必须版本化

摘要还有一个很容易被忽视的问题：

**“相同请求”本身也是一个协议。**

例如：

```text
对象键按什么顺序？
null 和字段缺失是否等价？
空字符串如何处理？
references 数组是否保序？
换行是 LF 还是 CRLF？
Unicode 是否规范化？
大小写是否具有业务含义？
```

如果这些规则依赖语言、运行库或操作系统默认行为，那么同一个逻辑请求在 Windows、Linux 或未来版本中可能得到不同摘要。

因此 reservation 里不能只存：

```text
request_digest
```

还应该存：

```text
digest_version
```

例如：

```text
digest_version = task-create/v1
```

这样半年后摘要规范升级，系统仍然知道一个旧 reservation 是依据哪一版规则生成的。

否则一个历史 submission 在新版本中突然发生 digest mismatch，系统甚至无法解释冲突来自请求变化还是算法变化。

## 并发比普通重试更能检验幂等是否真实

只有顺序执行：

```text
调用 A
完成
调用 A
```

还不足以证明创建接口可靠。

真正应该测试的是：

```text
Caller A ─┐
          ├─ 同时提交 submission_id = X
Caller B ─┘
```

最后系统到底得到：

```text
1 个 reservation + 1 个 task
```

还是：

```text
2 个 reservation + 2 个 task
```

如果“检查 submission 是否存在”和“创建 reservation”不是原子的，那么两个调用者完全可能同时看到：

```text
not found
```

然后同时进入创建路径。

因此创建型幂等真正需要的不是普通 lookup，而是某种**原子 reserve / create-if-absent / compare-and-set 语义**。

文件系统实现不一定需要引入数据库，但必须找到等价的互斥或原子占位边界。

否则单线程测试全部通过，并发时仍然可能重复创建。

## 给 Runtime 工程师的逐工具重试检查表

与其问：

> 我们的平台支持幂等吗？

不如对每个有副作用的工具逐项检查。

1. **动作已经发生、响应尚未返回时崩溃，恢复后能否查询第一次结果？**

2. **去重身份存在于哪里？**
   只在 Runtime 内存、会话缓存，还是持久工件中？

3. **Runtime 或调用方完全重启后，这个身份还存在吗？**

4. **相同身份 + 相同请求再次调用时，会返回第一次结果，还是重新产生副作用？**

5. **相同身份 + 不同请求时，系统能否返回明确 conflict，并保证零新增副作用？**

6. **两个调用者并发提交相同身份时，reservation 是否原子？最终会产生几个业务对象？**

7. **工具能否区分三种结果？**

   ```text
   confirmed_not_executed
   confirmed_executed
   outcome_unknown
   ```

8. **创建结果是否具有机器可读的稳定业务身份？**

   ```text
   task_id
   resource_id
   message_id
   artifact_path
   ```

9. **已有工具是否本来就有自己的持久防重复机制？**

   全局改造不能把已经正确的工具退化成统一但更弱的行为。

10. **请求摘要协议是否显式版本化？**

这张表的目的不是把所有工具塞进重型事务系统。

查询工具、纯计算工具、天然可覆盖写入和不可逆创建操作，需要的保护强度本来就不相同。

真正应该优先处理的是：

```text
创建型
不可逆型
外部副作用型
难以补偿型
```

这些工具一旦进入“结果未知”，代价最高。

## 本轮实验究竟证明了什么

截至本文使用的固定版本与 A1 实验条件，我们能够支持的结论有三个。

第一：

> **Runtime 上层的内存去重不能独自解决跨恢复的响应丢失问题。**

如果第一次真实动作已经完成、结果却没有进入缓存，恢复后的调用仍可能重新进入执行路径。

第二：

> **受测 `write_report` 路径能够在相同提交身份下复用已经持久化的结果。**

因此，不能从“上层允许重新执行”直接推导“报告一定会重复落盘”。

第三：

> **受测任务创建路径没有形成“稳定提交身份 → 第一次创建结果”的可恢复持久绑定。**

在实验窗口中，相同业务创建意图第二次进入真实创建路径后，产生了新的任务身份。

这三个结论都必须保持工具级边界。

本轮实验**不能**证明：

* CodeFlowMu 所有创建工具都有相同问题；
* 所有报告路径都天然安全；
* 生产环境中该故障具有某个确定发生频率；
* LlamaIndex 与 CodeFlowMu 存在相同实现缺陷；
* `reserved → task_created → committed` 已经成为 CodeFlowMu 当前能力。

最后一点尤其重要。

针对这个实验，我们已经冻结了创建型持久提交回执的工程合同，但截至本文写作时，它仍然属于**待实现、待独立验证的设计**。

因此本文使用的是：

```text
proposed contract
```

而不是：

```text
shipped capability
```

## 最值得保留的不是一个 Bug，而是一种研究方法

这次实验最后没有得到一个很漂亮的统一结论：

```text
CodeFlowMu 可以安全重试
```

或者：

```text
CodeFlowMu 不能安全重试
```

反而得到一个更有工程价值的答案：

```text
write_report：
受测路径已经能够恢复第一次持久结果

task creation：
受测路径仍缺少创建结果级持久绑定
```

这恰恰说明逐工具实验是必要的。

外部项目可以帮助我们发现一个此前没有认真检查过的故障窗口，但它不能代替第一方证据。

更可靠的方法是：

```text
外部工程变化
      ↓
提取可迁移的故障模型
      ↓
不假设自己的实现存在相同 Bug
      ↓
在自己的固定版本上设计实验
      ↓
同时寻找正例和反例
      ↓
把结论限制到真正被证据支持的工具边界
```

这一次，LlamaIndex 提醒我们重新检查：

> **异常发生时，副作用是不是其实已经完成？**

而 CodeFlowMu 的实验进一步把问题缩小为：

> **当调用方失去第一次成功响应时，每一个有副作用的工具，是否仍能从持久事实中回答“第一次到底做了什么”？**

如果回答不了，那么真正需要增加的往往不是下一次 retry。

而是一份能够跨进程、跨恢复、跨并发重新找到第一次结果的**持久提交身份与回执合同**。

## 主要来源

* [LlamaIndex PR #22841：fix(core): avoid retrying failed function tools](https://github.com/run-llama/llama_index/pull/22841)，2026-08-27 合并，访问日期：2026-08-28。
* [CodeFlowMu A1 公开证据包：响应丢失与逐工具幂等](/zh/research/evidence/2026-08-28-response-loss-idempotency)，含脱敏 fixture、Reader、检查脚本、预期输出与固定基线信息。
