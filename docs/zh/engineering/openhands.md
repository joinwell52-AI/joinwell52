---
title: OpenHands Agent Canvas — 工程分析
date: '2026-08-01'
column: open-source-engineering
category: daily
summary: 围绕 Skill、连接健康、自动触发、Runtime 选择与操作者体验的工程对标。
outline: deep
---

<ArticleCover
  image="/assets/covers/openhands.svg"
  kicker="开源工程观察"
  title="OpenHands Agent Canvas"
  summary="围绕 Skill、连接健康、自动触发、Runtime 选择与操作者体验的工程对标。"
  version="研究专题"
  status="持续维护"
  languageHref="/en/engineering/openhands"
  languageLabel="English"
/>

## 工程方向

OpenHands 正从 Coding Agent 项目演进为面向操作者的 Agent 工作空间。Agent Canvas 强调自托管、Skill 与 Plugin、连接健康、桌面封装、自动触发和多执行环境。

## Runtime 模式

```text
Agent Harness
  + Skill 与 Plugin
  + 连接健康
  + 本地 / 远程 Runtime
  + 手动 / 定时 / 事件触发
  + 操作者控制台
```

长期 AI 工作需要的不只是模型能力，还包括部署可见、可重启、健康状态、工具封装和人类操作界面。

## 值得跟踪的能力

- Skill 安装、激活与验证分离；
- Plugin 内容可见；
- 连接健康诊断；
- 启动和运行日志；
- 桌面与自托管体验；
- 定时和事件触发；
- 本地、托管和企业 Runtime 选项。

## CodeFlowMu 应学习什么

1. **连接健康成为第一等状态。** Provider 和工具失败必须可见、可操作。
2. **激活生命周期。** 安装 Skill 不等于已经激活并验证。
3. **操作者诊断。** 启动、Session 与恢复信息不能只存在于原始日志。
4. **多种触发模式。** 手动、定时和事件触发应共享同一个 WorkOrder 模型。
5. **自托管路径。** 面向中小企业需要本地优先的部署方式。

## 不应照搬什么

- 把 Agent Workspace 作为产品第一抽象；
- 在没有岗位、所有权和完成契约的情况下扩张功能；
- 把 Coding 领域假设写进通用 Core；
- 在一个界面暴露所有底层实现概念。

## 差异化

```text
OpenHands 的主要抽象：
Agent 工作空间与自动化

CodeFlowMu 的目标抽象：
岗位 + WorkOrder + 受治理工作流 + Runtime + 证据
```

OpenHands 未来可以成为 CodeFlowMu 下层的 Agent Provider 或执行 Harness；Position、TeamPolicy、FCoP 责任、TMPA 证据和完成门禁应保持稳定。

## 建议工程响应

- 在 Runtime 控制台统一 Provider、工具、Session 与 Agent 健康；
- 提供重启、重试、释放、切换 Provider 和恢复动作；
- 显示实际加载的 Skill 与版本；
- 业务语义 Event 与低层日志保持分离；
- 不为了追齐其他项目的功能列表而安排开发。

## 战略判断

OpenHands 是 Agent 运行工程的重要对标，但不能替代 CodeFlowMu 以岗位为中心的数字员工架构。
