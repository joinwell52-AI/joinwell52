---
schema: "publication-candidate-article/v2"
title: "队列项消失以后：谁能证明这项工作仍然存在？"
date: "2026-08-12"
column: "digital-employee"
category: "daily"
article_type: "technical-analysis"
edition: "research-center"
research_question: "When queued intent is removed after Core acceptance rather than after persistence, what execution-authority and recovery boundary should a durable agent runtime expose?"
summary: "队列删除只能证明执行层接管了工作；它不能同时证明恢复证据已经落盘。真正需要设计的是两者之间可被重建的交接。"
sources: "https://github.com/openai/codex/commit/da2803c73cd366b5e01ffe8d0e5f7d396247f827; research/analysis/Q-20260812-01-acceptance-persistence-handoff.md; research/reading/Q-20260812-01-acceptance-based-queued-work-admission.md"
cover: "./2026-08-12-acceptance-persistence-handoff-cover.png"
---

![一枚金属交接令牌正跨越临时接收台与深层持久档案库之间的缝隙](./2026-08-12-acceptance-persistence-handoff-cover.png)

*题图：Research Center 原创编辑视觉；表现执行接管与持久保管之间尚未闭合的交接。*

# 队列项消失以后：谁能证明这项工作仍然存在？

一次排队输入被 Core 接受，队列随即删除。几毫秒后，进程崩溃。

重新启动时，队列是空的；后续持久记录尚未形成；客户端只知道自己的请求曾经超时。此时最难回答的并不是“该不该重试”，而是一个更基础的问题：**系统还剩下什么事实，能够证明这项工作已经被谁接管？**

这正是“接受”和“持久化”被压成一个状态时留下的空白。OpenAI Codex 的[所选变更](https://github.com/openai/codex/commit/da2803c73cd366b5e01ffe8d0e5f7d396247f827)可以直接支持两个较窄事实：排队输入在 Core 接受时完成准入；Queue Entry 随后删除。它没有建立跨重启 Exactly-once，也没有证明任意外部副作用可回滚。

## 用一次故障切开三个时刻

不要先从状态名称出发。把故障放到执行路径中，边界会更清楚：

| 时刻 | 已经成立的事实 | 尚未成立的事实 |
|---|---|---|
| Queue Entry 仍存在 | 系统仍保存执行需求 | 尚未有人取得执行责任 |
| Core 已接受，Queue Entry 已删除 | 执行责任已经转移 | 重启后可恢复的执行证据未必存在 |
| 后续记录已持久化 | 至少一份恢复或对账证据可以存续 | 仍不自动等于端到端 Exactly-once |

这三个时刻不是一条“完成度进度条”。它们分别回答需求是否存在、责任是否转移、证据能否跨故障存续。把第二行直接命名为“已完成”，会让队列空状态承载它没有能力证明的结论。

## 真正转移的是责任，不是正确性

Core Acceptance 的价值在于划清责任：从这一刻起，客户端或上游队列不应再把这项工作当作无人接管。较早确认可以减少存储对准入延迟的牵制，也更接近执行层真正承担工作的时点。

但责任转移不是正确性证明。后续 Hook 可能停止工作，进程可能在产生持久记录前退出，外部调用也可能处于结果未知的状态。此时恢复器不能再回头依赖已经删除的 Queue Entry，又不能凭“队列为空”推断工作成功。

因此，关键设计对象不是第二个布尔值，而是一个可重建的**工作发生实例**：谁接受了它、接受的是哪一次提交、最后一条可验证事件是什么、下一位恢复者依据什么继续。

## 一条回执只能缩小歧义，不能消灭歧义

一种可验证的设计假设，是在放弃 Queue Ownership 之前或同时，持久化 Accepted-occurrence Receipt，并为该次工作分配稳定身份。

这条回执能把“队列已空但什么都不知道”缩小为“某个实例已被接受、后续结果待对账”。它可以帮助恢复器区分从未接受、已接受未见进展、已形成后续记录和已达终态。

它不能单独保证 Exactly-once。若外部副作用发生后、终态落盘前崩溃，恢复器仍需幂等键、外部读回或补偿契约。若工作天然可重放，额外回执的状态成本也可能高于它减少的歧义。更早接受并不普遍优于等待持久化；两种选择面对的是不同的延迟、状态和恢复成本。

## 这个设计应怎样被推翻

下一步不应继续增加状态名称，而应进行故障注入：分别在 Core 接受前、Queue 删除后、回执落盘前后以及外部副作用前后终止进程；随后只使用持久事实重建同一工作实例。

如果恢复器无法区分“从未接受”和“已接受但证据丢失”，Accepted-occurrence Receipt 的写入位置仍然太晚。如果它能恢复实例身份，却无法判断外部副作用是否发生，那么缺失的是副作用幂等与读回证据，而不是再加一层队列状态。如果天然可重放的任务不依赖回执也能无歧义恢复，则该机制不应被强制推广到所有工作类型。

这篇分析最终保留的是一个可以被实验否定的边界：**执行接受可以转移责任，但持久 Runtime 必须另外保存足以重建这次责任转移的事实；保存了交接事实，也仍不等于证明工作只执行了一次。**

### 证据与引用

- **源码已经显示：**所选 Codex 实现会在 Core Admission 后删除 Queue Entry。该事实可以从公开提交核对，但证据来自项目自身，不属于独立验证。
- **源码尚未证明：**跨重启 Exactly-once、全局副作用幂等和完整崩溃恢复仍未建立。
- **本文建议进一步验证：**实现 Accepted-occurrence Receipt，并通过故障注入检验它能否缩小恢复歧义。

**参考资料：**

- OpenAI Codex，2026-08-11，[`da2803c` — Simplify queued user message admission](https://github.com/openai/codex/commit/da2803c73cd366b5e01ffe8d0e5f7d396247f827)，代码提交及同提交测试变更。
