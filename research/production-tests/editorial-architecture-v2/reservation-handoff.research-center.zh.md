---
schema: publication-candidate-article/v2
title: "预订按钮并不拥有预订结果"
date: "2026-08-11"
column: industry-architecture
category: daily
article_type: research-brief
edition: research-center
research_question: "Where does authority move when an assistant hands a reservation action to an external provider?"
summary: "连接器应把可用、提交、提供方确认与后续托管保留为不同事实。"
---

# 预订按钮并不拥有预订结果

助手可以展示一个机会，却不因此成为最终交易的事实系统。真正值得研究的问题是：当用户从推荐进入外部预订流程时，权威究竟在哪里发生了转移。

## 预订流程发生了什么

官方产品文档描述了面向受支持餐厅列表的预订动作。用户可以在提交前检查信息，而确认、后续修改、取消与提供方账户问题仍由外部预订服务负责。因此，可用性只是一次观察，按钮只是具备资格的动作入口；二者都还不是提供方已经确认的预订。

## 证据能够说明什么

公开流程支持一个有边界的生命周期：展示可用性、动作资格、用户检查、提交给提供方、提供方确认以及外部托管。来源没有披露连接器协议、数据新鲜度保证、防重复提交控制或一致性模型。把这些状态分开，是对用户可见边界的架构解释，不是对未公开接口的断言。

这一差异并不限于预订。任何跨越外部事实系统边界的 Agent，都需要保存它观察到了什么、获准提交什么、提供方接受了什么，以及后续生命周期由谁负责。

## 提供方边界仍有哪些问题

什么样的回执可以绑定内部动作身份与提供方交易？可用性最迟应在何时重新检查？如果提交成功但提供方确认延迟，Agent 应记录什么结果？公开文档没有回答这些协议问题，因此本文以问题结束，而不是虚构一个通用连接器契约。

来源：OpenAI ChatGPT Search 帮助文档与 2026-08-11 Reading Result。
