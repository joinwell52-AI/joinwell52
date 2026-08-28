---
title: "接入事件总线，就该看到全部数据吗？从 41 次 Webhook POST 到 Agent Runtime 的消费者边界"
date: '2026-08-28'
column: open-source-engineering
category: daily
article_type: comparative-technical-analysis
edition: research-center
research_question: "一种新事件进入通用事件总线后，怎样阻止旧消费者自动继承新的事件类型和完整载荷？"
summary: "OpenHands 的流式增量曾默认进入所有订阅者，一次受测响应触发 41 次 Webhook POST。CodeFlowMu 的 20,440 条历史事件与当前查询探针进一步说明：存储变干净，不等于消费者边界已经收口。"
sources: "/zh/research/evidence/2026-08-28-event-consumer-visibility"
project_relevance: substantive-relationship
item_id: "RBE-20260828-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-28-event-consumer-visibility-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-28-event-consumer-visibility-cover.png"
  kicker="开源工程观察 · 消费者边界"
  title="接入事件总线，就该看到全部数据吗？从 41 次 Webhook POST 到 Agent Runtime 的消费者边界"
  summary="事件进入同一总线，不代表每个消费者都应看到同一种事件和同一份载荷。"
  version="RBE-20260828-02"
  status="比较研究 · 2026-08-28"
/>
# 接入事件总线，就该看到全部数据吗？从 41 次 Webhook POST 到 Agent Runtime 的消费者边界

一个内部事件进入事件总线之后，谁应该看到它？

最容易出现的答案是：

> 谁订阅了总线，谁就收到事件。

这个规则对普通业务事件可能足够简单，但当一种新的、高频甚至包含模型输出内容的事件进入总线后，它会产生完全不同的后果。

OpenHands 在一组端到端实验中发布了：

```text
3 个普通会话事件
+
198 个 StreamingDeltaEvent
```

修复前，Webhook 一共发出了：

```text
41 次 HTTP POST
201 个事件
其中 198 个是 streaming delta
```

修复后：

```text
1 次 HTTP POST
3 个普通事件
0 个 streaming delta
```

Webhook 没坏。

事件总线也没有丢消息。

真正的问题在于：**一种原本只服务实时流式界面的事件，被加入通用 PubSub 后，默认继承了所有订阅者。**

这暴露出 Agent Runtime 中一个比“日志脱敏”更基础的问题：

> **能够接入事件系统，不等于应该读取其中每一种事件；能够读取某类事件，也不等于应该获得它的完整载荷。**

我们随后用 CodeFlowMu 的历史事件数据和当前代码路径重新检查这个问题。

结果并不是简单的“数据已经脱敏”或“系统正在泄露数据”。

得到的结论更具体：

**一些后期历史样本已经不再保存 `payload.raw`，但当前系统仍没有一份跨消费者统一执行的字段最小化合同；尤其 Activity 查询路径仍然保留并返回完整原始 payload。**

因此，真正需要治理的单位不是“事件总线”本身，而是：

```text
事件
×
消费者身份
×
允许字段
×
输出边界
```

## OpenHands 的问题：一种新事件默认进入了所有消费者

2026 年 8 月 28 日，OpenHands 合并了 VascoSch92 提交的 [SDK PR #4689](https://github.com/OpenHands/software-agent-sdk/pull/4689)：

`fix(agent-server): stop fanning streaming deltas out to every subscriber`

问题来自 `StreamingDeltaEvent`。

为了支持实时 token 输出，它会直接进入 conversation `PubSub`。

但是当时 `PubSub` 通知订阅者时，并没有依据事件种类决定哪些消费者真正需要 streaming delta。

结果是：

```text
StreamingDeltaEvent
        ↓
Conversation PubSub
        ↓
所有 subscriber
```

而这些 subscriber 的职责完全不同。

PR 当时列出了 5 类消费者：

```text
_EventSubscriber
AutoTitleSubscriber
WebhookSubscriber
TelemetrySubscriber
_WebSocketSubscriber
```

真正需要 token 级 streaming delta 的，只有 `_WebSocketSubscriber`。

其他消费者却因为“订阅了同一个总线”而自动获得了新事件。

这造成了两个非常不同、但根因相同的问题。

## 第一个后果：Webhook 从会话级外发变成 token 级外发

`WebhookSubscriber` 会把收到的事件放进发送队列。

当默认 `event_buffer_size=5` 时，大量 streaming delta 持续进入队列，就会不断触发 HTTP POST。

PR 提供的端到端夹具使用：

```text
3 conversation events
+
约 200 个 streaming delta
```

实际发布出的 delta 数量为 198。

修复前观察到：

| 指标                  | 修复前 |
| ------------------- | --: |
| HTTP POST           |  41 |
| Webhook 收到的事件       | 201 |
| StreamingDeltaEvent | 198 |

修复后：

| 指标                  | 修复后 |
| ------------------- | --: |
| HTTP POST           |   1 |
| Webhook 收到的事件       |   3 |
| StreamingDeltaEvent |   0 |

这不是简单的性能优化。

因为 streaming delta 携带的是模型输出内容。

一旦消费者原本只按“会话事件”设计，却突然继承 token 级事件，它同时继承的是：

```text
更高的事件频率
+
新的内容类型
+
新的信息可见性
```

## 第二个后果：Telemetry 开始测量“模型有多话”

同一个默认广播规则还影响了 Telemetry。

PR 描述中，TelemetrySubscriber 会在判断具体事件类型之前先递增 `_event_count`。

因此：

```text
模型回答短
→ delta 少
→ event_count 小

模型回答长
→ delta 多
→ event_count 大
```

指标原本希望描述的是 conversation activity。

加入 streaming delta 后，它却开始部分反映模型输出长度。

两个业务过程完全相同、只是措辞长短不同的会话，就可能产生不可比较的事件数量。

这说明消费者边界不仅是数据安全问题。

它还会影响：

* 指标语义；
* 网络成本；
* 存储量；
* 告警阈值；
* 下游自动化行为。

## OpenHands 最值得借鉴的不是两个过滤条件

最直接的修法当然可以是：

```text
Webhook：
if StreamingDeltaEvent → ignore

Telemetry：
if StreamingDeltaEvent → ignore
```

但 PR 没有只修今天发现的两个消费者。

它给 subscriber 增加了一个明确能力：

```text
receives_streaming_deltas
```

默认：

```text
False
```

真正需要 streaming delta 的 WebSocket subscriber 再主动 opt-in。

也就是：

```text
新事件出现
        ↓
默认消费者不可见
        ↓
真正需要的消费者显式声明
```

而不是：

```text
新事件出现
        ↓
所有消费者自动获得
        ↓
以后逐个找谁不应该看
```

这两种默认方向的差别非常大。

前者是：

> 默认拒绝，按需要授权。

后者是：

> 默认传播，出了问题再排除。

对于不断新增事件类型的 Agent Runtime，前一种规则明显更容易长期维持。

## 但 OpenHands 这次修复也有明确边界

这个案例不能被扩大解释成：

> OpenHands 已经解决了所有模型输出可见性问题。

PR 自己明确指出，标准 Agent 路径中模型输出未遮罩是另一项独立问题。

所以这里真正可以迁移的结论只有：

> **StreamingDeltaEvent 不应该因为进入通用 PubSub，就自动继承所有 subscriber。**

我们把它当成一个消费者边界案例，而不是一个“数据安全已经解决”的案例。

## CodeFlowMu：先看 20,440 条历史事件

CodeFlowMu 是我们正在开发的本地运行多 Agent 协作系统。

运行事件目前会进入多个不同用途的边界，包括：

* Runtime 事件记录；
* Analytics；
* ActivityBuffer；
* Panel 查询；
* 其他内部观察路径。

为了判断过去到底保存过什么，我们统计了工作区中的 27 个 JSONL 事件文件。

共：

```text
20,440 行
```

全部能够解析。

统计口径、脱敏结果和查询探针整理在 [A2 公开证据包](/zh/research/evidence/2026-08-28-event-consumer-visibility)。

历史数据结果为：

| 数据集       |     行数 | 带 `payload.raw` |    比例 |
| --------- | -----: | --------------: | ----: |
| Runtime   |  2,743 |           1,474 | 53.7% |
| Analytics | 17,697 |          16,828 | 95.1% |
| 合计        | 20,440 |          18,302 | 89.5% |

如果只看最后一行，一个很诱人的结论是：

> CodeFlowMu Analytics 几乎一直都在保存 raw。

这个结论是不成立的。

因为这些文件跨越了不同实现阶段。

历史聚合数据只能说明：

**在这批历史工件中，早期存在大量包含 `payload.raw` 的记录。**

它不能直接描述今天的所有写入行为。

## 681 条后期样本很重要，但不能证明“投影已经完成”

按日期进一步拆分后，我们发现：

**8 月 10 日和 12 日的 681 条 Analytics 样本中，`payload.raw=0`。**

这些记录表现为更结构化的字段：

* 参数摘要；
* 文本；
* task id；
* session id；
* thread key；
* 其他分析字段。

这是一个非常有价值的变化。

它证明：

> **至少在这 681 条受测后期样本中，Analytics 记录已经不再呈现早期那种 `payload.raw` 形态。**

但这里必须停住。

不能继续推导：

> Analytics 持久化已经建立了一套全局字段白名单。

因为当前代码本身并不支持这么宽的结论。

`AnalyticsLedger` 写记录时会调用：

```text
trimPayloadForAnalytics(event_type, payload)
```

但当前实现并不是一个覆盖所有事件类型的通用投影器。

至少在当前代码中，非特定类型事件仍可能保留原 payload。

因此：

```text
某批后期样本 raw = 0
```

和：

```text
系统已经建立 fail-closed 的 Analytics 字段投影合同
```

不是同一个结论。

前者是**数据观察**。

后者是**系统保证**。

这一区分对本文非常重要。

## “样本变干净”不等于“消费者边界已经收口”

因此，CodeFlowMu 当前更准确的描述应该是：

```text
历史上：
出现过大量 payload.raw

后期受测样本：
681 条 Analytics 记录 raw=0

当前代码：
尚不能据此证明所有 Analytics 事件
都经过统一的消费者字段投影合同
```

这也说明，仅仅统计磁盘文件是不够的。

我们还需要继续问：

> 同一个内部事件进入查询接口后，调用方究竟能看到什么？

## ActivityBuffer 给出了另一种答案

我们随后直接检查当前 Activity 路径。

`ActivityBuffer` 对 payload 的定义非常明确：

```text
Full original payload
(pass-through, opaque)
```

也就是说，它不仅保存用于 Panel 展示的：

```text
event_type
agent_id
session_id
task_id
tool_name
args_preview
status
duration_ms
```

同时还保留：

```text
payload
```

这个 payload 是原始事件对象。

查询接口随后返回：

```text
ActivityEvent[]
```

并没有在 query 阶段重新根据消费者身份生成字段投影。

## 一个最小查询实验

为了验证这个边界，而不是只读代码，我们做了一个最小 fixture。

先构造事件：

```text
普通结构化字段：
  event_type
  task_id
  summary

payload.raw：
  放入一个唯一 sentinel
```

这个 sentinel 不出现在其他字段。

随后：

```text
事件
→ ActivityBuffer.push()
→ ActivityBuffer.query()
```

最后检查查询结果。

结果：

```text
sentinel 仍然存在
```

因此，目前可以支持的结论是：

> **Activity 查询路径能够返回进入 ActivityBuffer 的完整 payload；字段最小化没有在这个查询边界被机械执行。**

这个结论已经足够重要。

但它仍然不等于：

> CodeFlowMu 已经发生了未授权数据泄露。

因为“字段存在于接口返回对象中”和“未授权主体已经获得它”是两个问题。

真正的访问结果还取决于：

* 接口可达范围；
* 部署模式；
* 身份认证；
* 调用者权限；
* 网络边界；
* 实际消费者。

本文验证的是**消费者字段边界**，不是一次安全事件。

## 现在出现了三个不同层次

把这些证据放在一起，可以看到三个容易被混为一谈的层次。

### 第一层：生产者产生什么

内部 Runtime event 可能拥有完整 payload。

这是一份内部规范事件。

### 第二层：存储者保存什么

某个日志或 Analytics writer 可以选择：

```text
保存全部
```

或者：

```text
保存投影
```

A2 的历史数据正是在观察这一层。

### 第三层：消费者能够得到什么

Panel、Analytics API、Webhook、Telemetry 或 Debug consumer 又是另一层。

即使磁盘日志已经减少字段，也不能据此证明另外一个查询端点不会返回完整对象。

反过来，即使内部 ActivityBuffer 保存完整事件，也不意味着所有消费者都应该获得完整事件。

因此：

> **Storage minimization 和 consumer visibility 是两个不同合同。**

## 在设计字段白名单之前，先解决“你是谁”

很多系统做到这里会立刻设计一张字段矩阵：

```text
Panel 可以看 A、B
Analytics 可以看 B、C
Debug 可以看 A、B、C、D
```

但如果消费者身份本身由客户端声明：

```text
?consumer=internal_debug
```

那么这张矩阵几乎没有意义。

因为调用方可以自行选择权限最大的消费者类别。

所以第一条规则不是字段白名单。

而是：

> **Consumer identity 必须由可信服务端边界绑定。**

例如：

```text
固定 Runtime 注册入口
固定 route
服务端 policy ID
经过认证的内部 capability
```

消费者类别不能由以下内容自行提升：

```text
query 参数
普通 Header
事件 payload
Agent 输出文本
模型生成字段
```

如果系统确实需要读取完整原始证据的 debug 入口，它应该成为：

```text
独立接口
+
独立权限
+
独立审计
```

而不是：

```text
/api/activity?show_raw=true
```

## 同一个对象也不应该在消费者之间复用

还有一个容易遗漏的问题。

假设 WebSocket 需要完整 streaming delta，而 Webhook 只需要终态业务事件。

错误设计可能是：

```text
创建一个完整 event object
      ↓
同时交给 WebSocket 和 Webhook
      ↓
约定 Webhook “不要使用某些字段”
```

这仍然不是信息边界。

因为 Webhook 已经得到了那些字段。

更可靠的方式是：

```text
Canonical Internal Event
        ↓
Consumer Projection
        ↓
为每个出口重新构造对象
```

消费者得到的应该是：

> 它被允许看到的数据。

而不是：

> 所有数据，只是要求它自觉不用。

## 为什么黑名单很难长期安全

一种很常见的实现是：

```text
copy(payload)
delete raw
delete prompt
delete secret
```

今天看起来没有问题。

明天有人增加：

```text
raw_context
tool_credentials
provider_response
debug_dump
nested.original
```

旧的删除逻辑并不知道这些字段存在。

于是新字段会自动穿透已有消费者。

这和 OpenHands 的 streaming delta 问题实际上具有同一种结构：

```text
新东西进入系统
        ↓
旧消费者默认获得
```

只是一个发生在“事件类型”维度，另一个发生在“字段”维度。

## 更稳定的方向是重新构造，而不是复制后删除

例如：

```text
Canonical Runtime Event
        │
        ├── Panel Projection
        │     timestamp
        │     role
        │     task_id
        │     event_type
        │     structured_summary
        │
        ├── Analytics Projection
        │     event_type
        │     duration
        │     result_class
        │     stable correlation ids
        │
        ├── Webhook Projection
        │     contract-approved
        │     business events only
        │
        └── Debug Projection
              richer evidence
              independently authorized
```

每一个 projection 都是重新创建的对象。

不是：

```text
{ ...originalEvent }
```

再删除几个已知字段。

## 未知事件也必须有默认行为

只对字段做白名单还不够。

事件类型本身也会持续增长。

假设明天 Runtime 新增：

```text
runtime.model_context_snapshot
```

但旧消费者策略没有登记这个类型。

系统应该怎么办？

安全默认应该是：

```text
unknown event
→ public envelope only
```

或者：

```text
unknown event
→ reject
```

而不是：

```text
unknown event
→ 不知道是什么
→ 那就整个 payload 发出去
```

同样，对于一个已知事件新增字段：

```text
sdk.tool_call
  + provider_internal_context
```

旧的 Panel policy 没有明确允许它，就应该自动不可见。

这才是真正的 fail-closed consumer projection。

![同一个内部事件经过可信消费者身份与字段策略，生成彼此隔离的投影](/assets/figures/2026-08-28-event-consumer-projection.zh.svg)

*图 1：消费者边界不是“拿到完整对象以后自觉不用”，而是在出口处按可信身份重新构造对象。该图表达的是拟冻结工程合同，不是 V2.0.4 已交付能力。来源：[CodeFlowMu A2 公开证据包](/zh/research/evidence/2026-08-28-event-consumer-visibility) 与 OpenHands SDK #4689。*

## 可以先冻结一张消费者矩阵

第一版工程合同不一定需要复杂策略语言。

先把几个主要消费者明确下来，就已经能减少大量模糊空间。

| 字段类别                    | Panel   | Analytics | Webhook | Debug  |
| ----------------------- | ------- | --------- | ------- | ------ |
| `event_type`            | 允许      | 允许        | 按合同     | 允许     |
| 时间戳                     | 允许      | 允许        | 按合同     | 允许     |
| `task_id / session_id`  | 按界面需要   | 允许        | 按合同     | 允许     |
| 结构化摘要                   | 允许      | 允许        | 按合同     | 允许     |
| duration / result class | 按需要     | 允许        | 按合同     | 允许     |
| token streaming delta   | 默认拒绝    | 拒绝        | 默认拒绝    | 按独立权限  |
| 完整 `raw`                | 拒绝      | 默认拒绝      | 拒绝      | 按独立权限  |
| 未登记字段                   | 默认拒绝    | 默认拒绝      | 默认拒绝    | 仍需显式规则 |
| 未登记事件类型                 | 公共信封或拒绝 | 公共信封或拒绝   | 拒绝      | 显式登记   |

表里的具体字段未来可以调整。

真正需要冻结的是四个规则：

```text
consumer identity 谁绑定？
允许哪些字段？
unknown event 怎么办？
new field 默认是什么？
```

最后一项尤其关键。

答案应该是：

```text
new field
→ invisible until explicitly allowed
```

## 投影应该发生在离消费者尽可能近的位置

另一个设计问题是：

> 在哪里做 projection？

如果只在最早的事件生产阶段就把所有内容裁掉，那么 Debug、故障恢复和内部审计可能失去必要证据。

如果完全不裁剪，把完整事件一路传到所有终端，又会失去消费者边界。

更合理的结构是：

```text
可信内部事件
        ↓
内部总线 / 必要持久证据
        ↓
Consumer Boundary
        ↓
Projection
        ↓
Panel / Analytics / Webhook / ...
```

也就是说：

**内部事实完整性**和**外部消费者最小可见性**不是二选一。

关键是在消费边界上进行显式转换。

## 信息最小化不能变成业务裁判

这里还需要保留 CodeFlowMu 很重要的一条架构边界。

消费者投影负责回答：

> 谁能看什么？

它不能回答：

> 任务是否完成？

例如：

```text
Panel 不显示原始模型输出
```

不能推导：

```text
任务失败
```

Analytics 不保存 token delta，也不能推导：

```text
Agent 没有生成这些 token
```

Webhook 只收到最终业务事件，也不能替代 PM 或 QA 判断：

```text
交付是否合格
```

消费者投影是 Runtime 的**信息流服务能力**。

它不是：

* QA；
* PM；
* 生命周期裁决器；
* 事实核查器；
* 任务完成判定器。

这条边界如果混在一起，所谓“安全策略”很容易开始偷偷决定业务流程。

## 一套消费者边界至少应该测什么

实现之后，不能只测：

```text
raw 字段删掉了吗？
```

至少应该覆盖下面这些失败方式。

### 1. 已知事件 + 已知字段

允许字段正常返回。

### 2. 已知事件 + 新增顶层字段

旧消费者默认看不到。

### 3. 已知事件 + 新增嵌套字段

不能因为递归遗漏而穿透。

### 4. 未知事件类型

不能完整 passthrough。

### 5. 客户端伪造 consumer class

不能通过参数把自己升级成 debug consumer。

### 6. 同一事件进入两个消费者

一个允许 raw，不得导致另一个拿到相同完整对象引用。

### 7. WebSocket streaming opt-in

实时消费者仍然正常工作。

### 8. Webhook / Analytics 默认不继承 streaming delta

新增实时事件不能自动扩大消费者范围。

### 9. 不同部署模式

本机、LAN 或其他允许的部署方式必须分别验证访问控制和消费者投影，两层不能互相替代。

## 本轮证据到底支持什么

把外部案例和第一方实验放在一起，本轮可以支持四个结论。

第一：

> **OpenHands 的 StreamingDeltaEvent 曾默认进入所有 subscriber。**

在其公开端到端夹具中，受测输入修复前产生 41 次 Webhook POST、201 个交付事件，其中 198 个是 streaming delta；修复后为 1 次 POST、3 个普通事件和 0 个 delta。

第二：

> **OpenHands 选择了消费者显式 opt-in，而不是要求所有旧消费者逐个排除 streaming delta。**

这是一条可以迁移的默认策略。

第三：

> **CodeFlowMu 历史数据中确实存在大量带 `payload.raw` 的事件，同时 A2 的 681 条后期 Analytics 样本已经表现为 `raw=0`。**

但这个样本结果不能被扩大为：

```text
当前所有 Analytics 写入
已经拥有统一的字段白名单保证
```

第四：

> **当前 ActivityBuffer 明确保留完整原始 payload，受测 Activity 查询也可以读回仅存在于原始 payload 中的标记。**

因此，至少这个消费边界尚未机械执行字段最小化。

## 本轮证据不能证明什么

这些结果不能证明：

* CodeFlowMu 已发生未授权访问；
* Panel、Analytics、Webhook 等所有消费者具有相同可见性；
* 所有当前 Analytics 事件仍包含 raw；
* 681 条后期样本代表所有后期事件类型；
* OpenHands 已解决所有模型输出遮罩问题；
* CodeFlowMu 已经实现本文描述的 consumer projection；
* 保存完整内部事件本身就是错误。

最后一项尤其重要。

内部系统有时确实需要保存更完整证据。

真正的问题不是：

> 有没有完整数据？

而是：

> **谁能够在什么边界读取哪些数据？**

## 真正应该冻结的是“消费者合同”

这次调查最值得留下来的，不是：

```text
把 raw 删掉
```

也不是：

```text
不要发 streaming delta
```

而是一份更稳定的 Runtime 合同：

```text
Canonical Internal Event
        ↓
Server-bound Consumer Identity
        ↓
Event-type Policy
        ↓
Recursive Field Projection
        ↓
Consumer-specific Object
        ↓
Panel / Analytics / Webhook / Debug
```

并且默认规则必须是：

```text
new consumer
→ no implicit visibility

new event type
→ no implicit full payload

new field
→ no implicit visibility
```

这和 OpenHands #4689 最有价值的方向完全一致：

**新增能力不应该自动扩大旧消费者的可见范围。**

外部项目让我们看到的是 streaming delta 默认广播带来的 41 次 Webhook POST。

第一方历史数据和当前实验进一步提醒我们：

> **事件存在哪里，只解决数据存在性；消费者最终能看到什么，必须成为另一份独立、可测试、默认拒绝的工程合同。**

## 主要来源

* [OpenHands SDK PR #4689：fix(agent-server): stop fanning streaming deltas out to every subscriber](https://github.com/OpenHands/software-agent-sdk/pull/4689)，2026-08-28 合并，访问日期：2026-08-28。
* [CodeFlowMu A2 公开证据包：事件消费者可见性](/zh/research/evidence/2026-08-28-event-consumer-visibility)，含 20,440 条历史事件的脱敏统计口径、后期样本拆分、当前 Activity 查询 fixture、Reader、检查脚本与预期输出。
