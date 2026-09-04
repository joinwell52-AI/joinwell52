---
title: "测试结果是空的，为什么还显示“验证通过”？"
date: "2026-09-03"
published_date: "2026-09-04"
column: open-source-engineering
category: daily
article_type: experiment-report
edition: research-center
research_question: "真实 Host 准入服务是否拒绝没有覆盖测试计划的内部结果？"
summary: "计划要求四项测试，结果却可以在零项回执时变成 VERIFIED。一次穿过真实 Host 准入服务的受控实验表明：没有收到失败，不等于已经收齐成功证据。"
cover: "/assets/covers/host-research-20260903-empty-evidence.png"
language: zh-CN
lifecycle: Published
publication_authorized: true
evidence_status: "Controlled reproduction on V2.2.6; no remediation implemented in this study"
---

<ArticleCover
  image="/assets/covers/host-research-20260903-empty-evidence.png"
  kicker="开源工程观察 · 受控实验"
  title="测试结果是空的，为什么还显示“验证通过”？"
  summary="计划要求四项测试，结果却可以在零项回执时变成 VERIFIED。一次穿过真实 Host 准入服务的受控实验表明：没有收到失败，不等于已经收齐成功证据。"
  version="2026-09-03"
  languageHref="/en/engineering/2026-09-03-empty-test-results-verified"
  languageLabel="English"
/>

<ArticleTableScroll language="zh" />

# 测试结果是空的，为什么还显示“验证通过”？

测试计划要求完成四项检查。探针返回的结果却是一个空数组。

我们原本预期，系统会停下来，说明证据没有收齐。实际持久化记录却同时出现了两组信息：进度是 `total=4、completed=0`，测试运行是 `PASS`，候选版本的准入决定是 `VERIFIED`。

这不是一次真实升级事故，而是我们对 CodeFlowMu 做的受控实验。CodeFlowMu 是我们开发的一个本地运行、多 Agent 协作系统；这里的 Host 指执行 Agent 的 SDK 或 CLI。Host 准入服务负责评估候选版本是否满足接入要求，不是给业务任务签收。

实验没有证明“真实测试一项都没运行”。它证明的是更明确、也更应由这个服务负责的一件事：**没有收到任何测试结果，仍然可能签出“验证通过”。**

问题因此不在绿色标记的颜色，而在这张标记究竟凭什么成立。

## 1. 外部项目在查“声明是否真实”，我们还要查下一层

这次检查的起点，是 OpenHands 的一项改动。

OpenHands 是开源编程 Agent 项目，其 Agent SDK 负责 Agent、工作区和执行提供商的集成。它使用的 ACP，即 Agent Client Protocol，是客户端与 Agent 提供商之间的通信协议。

在 [PR #4834](https://github.com/OpenHands/software-agent-sdk/pull/4834) 中，维护者不再只检查注册表里写了什么，而是启动真实提供商，读取身份、版本和会话配置，再实际设置模型并检查返回值。它要解决的是：上游已经变化，静态名单却还声称支持。截至 9 月 3 日核验时，该 PR 已合并。

这项测试也有边界：它使用占位凭证，不发起推理轮次；其结果不能替代真实账号的模型使用资格或任务完成证明。相关 live 测试有独立触发安排，也不是每次默认测试都必跑。[测试与 CI 说明](https://github.com/OpenHands/software-agent-sdk/pull/4834)

这给我们的启发并不是“赶紧加一个 live probe”。检查 CodeFlowMu 当前基线后，我们发现：它已经有真实的 Cursor SDK 发送探针，以及 Codex CLI 推理和 schema 检查。重复提出“从零建设真实探针”，会忽略已经存在的工程能力。

值得继续追问的是下游：**即使探针是真的，收到探针结果的服务，会不会把不完整证据当成完整成功？**

OpenHands 检查的是提供商是否兑现声明；本文检查的是消费者是否兑现验证合同。两者相关，但不是同一个缺陷，更不能用我们的实验反推 OpenHands 存在同样的问题。

## 2. 错误发生在“汇总结果”这一步

我们将基线固定在 CodeFlowMu V2.2.6，提交 `5c94d8c3b0147b779b17f620b811c6a17cc65288`。实际入口是 Shell 的 `HostAdmissionControlPlaneService`，而不是另写一个演示版验证器。

它会发现候选版本、编制测试计划、调用探针，再保存运行和准入状态。两种 Host 的计划各有四个确定的测试 ID。Cursor 的计划包含供应链、类型导出、Agent 列表和真实发送；Codex 的计划包含供应链、CLI 版本、四组 schema 和真实推理轮次。

计划不是没有建立。问题出在 `runTests()` 对返回集合的解释：

```typescript
const status = results.some(item => item.status === "FAIL")
  ? "FAIL"
  : results.some(item => item.status === "BLOCKED")
    ? "BLOCKED"
    : "PASS";
```

这段代码回答的是：“已经返回的条目里，有没有失败或阻断？”

它没有回答：“计划要求的条目，是否已经全部、正确地返回？”

空数组里没有 `FAIL`，也没有 `BLOCKED`，于是落入 `PASS`。随后服务把候选决定写成 `VERIFIED`，并将进度完成数写为 `results.length`。这解释了为什么 `0/4` 与验证通过能够同时存在。

这里至少有三个不能互相替代的判断：返回列表没有失败、计划证据已经完整、候选具备准入资格。当前这条汇总路径把前一个判断直接提升成了最后一个。

[![图 1：空结果经过仅搜索 FAIL 或 BLOCKED 的汇总逻辑，仍被签成 PASS 和 VERIFIED](https://joinwell52-ai.github.io/joinwell52/assets/host-research-20260903/figure-01-evidence-completeness-zh.png)](https://joinwell52-ai.github.io/joinwell52/assets/host-research-20260903/figure-01-evidence-completeness-zh.png)

*图 1｜受控实验的结果接收与汇总逻辑。上方四项以 Cursor 计划为例；空回执不等于真实探针未执行。图中的改进方向尚未实现。[点击查看高清原图](https://joinwell52-ai.github.io/joinwell52/assets/host-research-20260903/figure-01-evidence-completeness-zh.png)。*

源码位置、版本摘要和逐轮记录见[公开证据说明](/zh/research/evidence/2026-09-03-host-authority-conformance)。公开包提供脱敏观察数据与只读检查器；它不等于再次运行产品，完整内部日志和本机路径不公开。

## 3. 不只空数组：四种反例指向同一个集合缺口

为了区分“空数组特例”和“计划完整性问题”，我们固定真实服务，改变它收到的内部探针结果。

实验使用服务已有的注入接口：候选发现返回受控注册信息，制品准备不实际安装，探针返回指定列表；判断、状态转换和持久化仍由产品代码完成。没有启动云模型、没有采用候选版本，也没有执行更新同步。

两种 Host 各测试八类输入，每类在独立临时目录中重复两轮。下面是两种 Host、两轮均一致的结果：

| 内部探针返回什么 | 运行结果 / 候选决定 | 判断 |
|---|---|---|
| 四个计划 ID，各返回一次 PASS | PASS / VERIFIED | 完整成功对照 |
| 空数组 | PASS / VERIFIED | 缺少全部结果，仍通过 |
| 只返回一个计划 ID 的 PASS | PASS / VERIFIED | 缺少三项，仍通过 |
| 同一个计划 ID 重复四次 PASS | PASS / VERIFIED | 数量足够，但覆盖不足 |
| 只返回一个未登记 ID 的 PASS | PASS / VERIFIED | 无关结果替代了计划证据 |
| 完整集合中有 BLOCKED | BLOCKED / PENDING | 阻断对照有效 |
| 完整集合中有 FAIL | FAIL / PENDING | 失败对照有效 |
| 回调直接抛出异常 | 抛错，候选未成为 VERIFIED | 异常未被包装成通过 |

总计是 **16 个不同输入组合、32 次观察**。其中四类错误通过在两种 Host、两轮中都出现，共 16 次。这不是“系统有 50% 的故障率”，因为场景由我们主动选择，不是随机抽取的线上请求。

正反对照也限制了结论：服务能够识别明确返回的失败和阻断，不能写成“任何失败都会被忽略”。缺口集中在**它没有证明自己已经收到了该收的证据**。

重复 ID 尤其值得注意。即使把空数组单独拦住，再要求 `results.length === plan.tests.length`，第四行依然可以通过。四张相同的回执，不等于四项不同的检查。

## 4. 为什么已有测试全绿，仍会出现这个结果？

在增加负向探针前，我们先复跑了七组相关现有测试，每轮 41 项，两轮均为 `41 pass / 0 fail / 0 skip`。其中既有进程身份、写锁、审批、事实核查，也有准入 runner 和 Host 控制面的测试。

这个数字只说明所选既有用例在固定基线上通过，不是全产品验收，更不是可靠性百分比。

关键区别是测试到了哪一条边界。Runtime 库中的准入 runner，与 Shell 中汇总候选测试结果的控制面，并不是同一个组件。前者的注册与执行用例通过，不能替后者证明“结果集合与计划完全对应”。Shell 的正常成功流程通过，也不能证明它会拒绝缺项、重复或无关结果。

这正是此类问题值得研究的原因。团队很容易已经拥有测试计划、真实探针、审计记录和绿色回归，却仍在组件交接处漏掉一句合同：**消费者必须验证证据覆盖了自己提出的问题。**

源码还显示，Web Panel 的真实测试路由调用了这套服务；后续同步检查会读取运行的 `PASS` 和候选的 `VERIFIED`。因此，它不是完全没有使用者的演示函数。不过，同步仍有独立的 ADMIN 确认门。本轮没有调用 HTTP 同步接口，不能把结果扩大成“无需授权就自动更新了生产环境”。

同样，内部回调注入是实验手段，不是远程请求可以任意传入的参数。我们确认的是消费者面对不完整内部结果时的判断缺口，不是证明了一条外部攻击链。

## 5. 修复方向不是换一个数组方法

把 `some(FAIL)` 改为 `every(PASS)` 看起来更正面，但空数组的 `every()` 仍会返回真。决定的依据必须从“返回了什么”，转向“本来必须证明什么”。

一个值得进入工程评审的窄规则是：以已冻结的测试计划为准，逐项核对必需 ID 的结果，再判断候选是否通过。

这意味着缺项不能通过，未知 ID 不能抵消缺项，重复 ID 不能增加覆盖数。对于重复回执，要明确是同一不可变结果的幂等重传，还是互相冲突的两个结果；不能只把数组长度当作完成数。最终证据还应能关联到本次运行、候选和适用的测试标准，避免旧结果回答新问题。

如果某类计划确实允许零项必需检查，也应由显式的不适用规则解释，而不是让空数组自动代表成功。这些是本文提出的评审方向，尚不是已经实现并验收的新能力。

这轮实验没有回答默认提供商在生产中多常返回不完整列表，也没有真实事故总体数据。它回答的是一个更小但确定的问题：**当不完整列表到达当前消费者时，消费者会怎样判断。**

因此下一步应围绕这条汇总边界设计修复和回归，不必借机重写整个 Host 系统，更不应把修复建议直接算作交付。

一张“验证通过”的回执，需要由完整的成功证据支持。

**没有收到失败，只能说明没有收到失败。**
