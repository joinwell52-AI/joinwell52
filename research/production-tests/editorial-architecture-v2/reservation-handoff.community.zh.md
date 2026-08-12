---
title: "预订交接时，Agent 应该在哪里停下？"
edition: community
parent: reservation-handoff.research-center.zh.md
community: OpenAI Developer Community
---

# 预订交接时，Agent 应该在哪里停下？

## 开发者真正能够控制的边界

Agent 可以展示当前可用性并打开预订流程，却不拥有提供方的最终记录。因此，连接器代码不应使用一个笼统的 `success` 同时表示观察、提交与确认。

## 一个具体的实现问题

如果返回值明确区分 `observed`、`submitted`、`provider_confirmed` 与 `external_custody`，重试和用户提示是否会更安全？公开产品流程支持这种区分，但底层连接器契约仍未公开。

## 接口应明确表达什么？

提供方确认与预订后的托管是否应该成为不同的类型化结果？什么回执可以把它们与原始 Agent 动作连接起来？
