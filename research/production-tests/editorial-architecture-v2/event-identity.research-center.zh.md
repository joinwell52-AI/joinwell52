---
schema: publication-candidate-article/v2
title: "稳定事件身份是对账原语，不是恰好一次投递"
date: "2026-08-11"
column: open-source-engineering
category: daily
article_type: technical-analysis
edition: research-center
research_question: "What does a stable event identity guarantee across asynchronous retries, and what does it leave unproven?"
summary: "在重试中复用同一发生身份可以改善对账，但不能证明无丢失或恰好一次执行。"
---

# 稳定事件身份是对账原语，不是恰好一次投递

## 一个身份，多次投递

一项已合并的分析实现会在异步交接前分配事件标识，并在投递重试时复用该标识。即使传输层进行了多次物理尝试，逻辑事件仍保留同一身份。消费者可以围绕该身份识别重复项，但标识本身不会阻止重复数据行，也不会阻止外部副作用被重复执行。

类型化终态事件增加了第二项能力：同一逻辑执行可以由明确的成功或错误证据关闭。过程遥测与终态结果应保持为不同证据类别。

## 实现证据止于何处

该实现明确描述了重试耗尽、偏移冲突、数据流失步与可能丢行的边界。本地偏移状态也没有被证明具备重启恢复能力。这些限制说明，事件身份不会自动产生无损传输，而传输层去重也不会自动产生业务层恰好一次执行。

现有证据来自第三方合并实现及其测试，支持被记录的机制，但并未独立验证一条通用 Runtime 规则。

## 仍需测试的机制

仍需在身份分配、进入队列、物理发送、提供方接受与终态事件持久化之间执行崩溃测试。一个有价值的下一步实验，是分别保存逻辑事件身份、投递尝试身份与业务交易身份，再检查每个崩溃点会留下哪类歧义。

来源：Google ADK 合并提交与 2026-08-11 Research Object。
