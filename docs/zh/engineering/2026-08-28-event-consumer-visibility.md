---
title: "接入事件总线，就该看到全部数据吗？从 41 次 Webhook POST 到服务端消费者投影"
date: '2026-08-28'
updated: '2026-08-30'
column: open-source-engineering
category: daily
article_type: comparative-technical-analysis
edition: research-center
research_question: "一种新事件进入通用事件总线后，怎样阻止旧消费者自动继承新的事件类型和完整载荷？"
summary: "OpenHands 的流式增量曾让一次受测响应触发 41 次 Webhook POST。CodeFlowMu 从 20,440 条历史事件与查询探针出发，在 V2.1.2 实现三类消费者的服务端递归白名单；独立 QA 确认原始标记不再进入普通查询，必要字段仍保留。"
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
  title="接入事件总线，就该看到全部数据吗？从 41 次 Webhook POST 到服务端消费者投影"
  summary="内部事件可以完整保存，普通消费者却不应自动继承全部字段。V2.1.2 把这条边界落到了查询出口。"
  version="RBE-20260828-02"
  status="比较研究 · 2026-08-30 修订"
/>

# 接入事件总线，就该看到全部数据吗？从 41 次 Webhook POST 到服务端消费者投影

一组只有 3 个普通会话事件的输入，为什么会产生 41 次 Webhook POST？

OpenHands 的公开实验另外发送了 198 个流式增量事件。修复前，它们与普通事件一起进入 Webhook；修复后，Webhook 只收到 3 个普通事件，发送次数降到 1。

Webhook 没坏，消息也没有丢失。真正的问题是：一种为实时输出新增的事件，进入通用总线以后，默认获得了所有既有订阅者。

这给 Agent Runtime 提出了两个相邻、但不同的问题：

> 谁应该接收某类事件？已经可以接收事件的消费者，又应该获得哪些字段？

CodeFlowMu 是我们开发的本地多 Agent 协作系统。沿着这个问题检查自身时，我们没有直接宣布“发生数据泄露”，而是先看历史记录，再看查询出口。结论最终落到一个可以验证的缺口：内部完整载荷可以穿过普通 Activity 查询边界。

2026-08-30 发布的 V2.1.2 已把 Web Panel、Activity API 和 Analytics 的服务端递归白名单做成工程能力。这里保留从外部案例、历史剖面到修复反证的完整过程。[证据与版本说明](/zh/research/evidence/2026-08-28-event-consumer-visibility)

## 外部案例：新事件为什么会改变旧消费者的行为

OpenHands SDK 的 [PR #4689](https://github.com/OpenHands/software-agent-sdk/pull/4689) 处理 `StreamingDeltaEvent` 默认进入所有订阅者的问题。原研究于 2026-08-28 核验其已合并状态。

它涉及的五类订阅者职责并不一样：普通事件订阅、自动标题、Webhook、Telemetry 和 WebSocket。真正需要 token 级流式增量的是 WebSocket，其他消费者却因订阅同一总线而自动获得这些事件。

PR 提供的端到端实验结果为：

| 指标 | 修复前 | 修复后 |
| --- | ---: | ---: |
| HTTP POST | 41 | 1 |
| Webhook 交付事件 | 201 | 3 |
| 其中 StreamingDeltaEvent | 198 | 0 |

这是 OpenHands 的受测结果，不是 CodeFlowMu 的性能数字。它说明默认广播同时改变了事件频率、内容类型和消费者可见性。

同一规则还会影响指标解释：Telemetry 若在区分事件类型前递增事件计数，模型回答越长，流式增量越多，所谓“会话活动量”就越可能混入“模型有多话”。

该修复没有只给 Webhook 和 Telemetry 各加一个排除条件，而是增加默认关闭的 `receives_streaming_deltas`，由真正需要增量的消费者显式开启。新事件不再自动扩大旧消费者的职责。

但这个 PR 只解决对应流式事件的订阅边界，不能据此说 OpenHands 所有模型输出遮罩问题都已解决。

## CodeFlowMu 的 20,440 条历史事件：数据很多，不能直接下当前结论

我们统计了 27 个 JSONL 文件，20,440 行全部可解析：

| 数据集 | 行数 | 带 `payload.raw` | 比例 |
| --- | ---: | ---: | ---: |
| Runtime | 2,743 | 1,474 | 53.7% |
| Analytics | 17,697 | 16,828 | 95.1% |
| 合计 | 20,440 | 18,302 | 89.5% |

这些文件跨越不同实现阶段。总比例说明这批历史工件曾大量保存原始载荷，不能代表 V2.0.4，更不能代表 V2.1.2 的当前写入。

再按时间拆分，8 月 10 日和 12 日的 681 条后期 Analytics 样本中，`payload.raw=0`。这是进步，但它只证明该子集没有这种字段形态，不证明系统已经对所有事件建立白名单。

旧代码里的 `trimPayloadForAnalytics` 也不能独自支持后一种判断：对特定事件做裁剪，不等于未知事件或新增字段默认不可见。

历史数据回答“过去保存了什么”；要回答“消费者现在能拿到什么”，还需要沿真实查询路径验证。

## 一个只放在 raw 里的标记，把问题定位到了出口

V2.0.4 受测 ActivityBuffer 保存完整 payload，查询返回包含该载荷的事件对象。最小探针把一个唯一标记只放进 `payload.raw`，然后执行：

`ActivityBuffer.push() → ActivityBuffer.query() → 序列化结果检查`

结果仍能找到标记。V2.1.1 提交 `36e5c83b` 上的修改前复跑再次确认了这条路径。

这已经足以证明：字段最小化没有在该查询边界机械执行。但还不足以证明未授权的人实际读到了数据——后者涉及网络可达性、认证、权限、部署模式与真实访问记录。

三个层次必须分开：

- 生产者产生完整内部事件。
- 存储者决定保存原始事件还是投影。
- 查询与外发出口决定消费者实际获得什么。

某批磁盘记录已经不带 raw，不能替另外一个查询接口证明它安全；内部需要保存原始事实，也不意味着 Panel 必须拿到原始对象。

## V2.1.2 先固定“你是谁”，再决定“给你什么”

字段白名单如果允许调用者用 `?consumer=internal_debug` 自报身份，就失去了意义。

V2.1.2 的三类消费者——`web_panel`、`activity_api`、`analytics`——由服务端调用入口选择。普通查询默认进入 Activity API 策略，客户端参数不负责把自己升级成高权限消费者。

随后，投影器按已登记事件类型和对应字段规则重新构造结果对象：

`内部事件 → 服务端消费者选择 → 事件规则 → 递归投影 → 消费者对象`

| 本次交付出口 | 保留什么 | 默认不返回什么 |
| --- | --- | --- |
| Web Panel | 事件、角色、任务、会话、状态和受控摘要等已登记字段 | raw、未登记字段、未知嵌套内容 |
| Activity API | 获准 envelope 和事件 payload 投影 | 完整内部 payload |
| Analytics | 为分析登记的结构化事件字段 | 原始透传对象与未登记内容 |

各出口拿到的是新对象，不是完整事件引用加一条“请自觉不用某些字段”的约定。内部原始事件仍保留，诊断事实没有因为普通出口收口而被删除。

这次交付范围是上述三类消费者；不能把 OpenHands 的 Webhook 案例或我们设计讨论中的 Debug 入口也算成 CodeFlowMu 新增并验收的功能。

![V2.1.2 三类消费者的服务端递归投影](/assets/figures/2026-08-28-event-consumer-projection.zh.svg)

*图 1：三类实际交付消费者与内部原始事件分层。未知事件的 payload 投影为空，新增未登记字段默认不进入结果；这是 V2.1.2 的实现范围，不是对任意订阅者的全局承诺。来源：[WP-B 实现与独立 QA 证据说明](/zh/research/evidence/2026-08-28-event-consumer-visibility)，作者据此绘制。*

## 首轮测试失败，反而明确了“最小化”不能删掉什么

第一版裁剪并非一次就正确。Shell 定向回归出现 19 pass / 1 fail：日志中心本应显示的一条工具结果语义告警从 1 变成了 0。

原因不是应该恢复全部原始结果，而是投影误删了诊断所需、可以安全派生的状态字段。修复只解析并允许：

`ok / code / summary_blocked_reason / projection_status`

复跑达到 20/20，没有恢复 summary/raw 的整体透传。

这次反证很重要。信息最小化不等于“删得越多越安全”。如果裁剪让 Panel 丢失真实失败信号，虽然 raw 消失了，工程语义却退化了。正确合同必须同时检查不该出去的数据被挡住、应该保留的状态仍然可用。

## 新字段默认不可见，才不会让下一次迭代重新打开出口

黑名单通常写成“复制 payload，然后删除 raw、secret、prompt”。问题是未来的 `nested.original` 或新事件类型不会自动出现在旧删除清单里。

V2.1.2 的默认方向相反：

- 已知事件：只按字段规则递归构造对象。
- 新增顶层或嵌套字段：未登记就不返回。
- 未知事件类型：不输出未知 payload；仍可保留允许的公共 envelope。
- 同一内部事件给不同消费者：分别投影，避免对象引用串用。

这减少的是原始数据无意穿过消费边界的机会，不是一个能够识别所有敏感文本的内容审查器。获准字符串字段的内容仍需生产者遵守自己的合同，认证和网络授权也仍有各自职责。

## 独立 QA 不只检查 raw 消失了

独立 QA 在候选 `64f633ac` 上运行 B1，并另外构造仅存在于 raw 的唯一标记：

| 观察项 | 结果 |
| --- | --- |
| 普通查询中的 raw marker 次数 | 0 |
| `raw_present` | `false` |
| 事件数量 | 1 |
| event_type、task_id、session_id | 保留且符合输入 |
| `projected_summary` | 保留受控摘要 |

它证明受测查询既阻断了原始标记，也保留必要字段。未知事件、新增嵌套字段、消费者对象隔离、服务端选择和 Analytics 持久化另有开发定向测试；真实 LAN/Gateway 客户端部署没有被这些测试替代。

母版 V2.1.2 已于 2026-08-30 正式发布。最终发布集合为 Runtime 1842 pass / 0 fail / 1 skip，Shell 1037 pass / 0 fail；发布验证保留前序失败记录，没有用最后全绿抹去字段误裁、锁文件或独立 Open 构建范围问题。

## 从这个案例可以带走什么

检查消费者边界时，不要只问“raw 删除了吗”，而要依次问：

1. 消费者身份由服务端绑定，还是调用者自报？
2. 未登记的事件类型和新增嵌套字段会怎样处理？
3. 返回对象是重新构造，还是完整对象浅拷贝后删除？
4. 必要状态、告警和关联键是否仍可用？
5. 一个消费者是否可能拿到另一个消费者的高权限对象？
6. 查询投影、内部留证和网络授权是否分别有测试，没有互相代证？

OpenHands 的修复处理事件种类默认继承，CodeFlowMu 的修复处理字段可见性默认继承。两者不是同一个实现问题，却指向同一条可迁移原则：新增能力不应自动扩大旧消费者的可见范围。

这次工程化完成的是三个具体出口的字段边界，不是“整个 Runtime 已经不会泄露信息”的无限保证。

## 证据范围与主要来源

- [历史数据、旧查询探针与 V2.1.2 更新说明](/zh/research/evidence/2026-08-28-event-consumer-visibility)：旧 JSON fixture/Reader/check 验证冻结历史材料，不运行当前 Runtime；`current_query_returned_raw_marker=true` 是旧基线字段名与结果，不是新版行为。
- [OpenHands SDK PR #4689](https://github.com/OpenHands/software-agent-sdk/pull/4689)：41 → 1 POST 的原始外部对照，研究记录核验日期为 2026-08-28。
- [V2.1.2 发布说明（需母版仓库访问权限）](https://github.com/joinwell52-AI/codeflowmu/releases/tag/V2.1.2)：实现、独立 QA 和发布原始记录为受限第一方材料。公开说明提供脱敏结果与来源编号，不声称普通读者已经可以重跑私有源码。
- 本次没有发布 Open Edition 或切换在线实例。Windows 符号链接权限性 skip、既有依赖审计告警和真实网络部署未覆盖仍保留；内部完整数据的存在也不等于已发生未授权访问。
