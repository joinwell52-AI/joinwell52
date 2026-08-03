---
title: Research Runtime Scheduler V1.0
description: 数字员工工场的正式执行调度器与运行控制平面。
outline: deep
---

<ArticleCover
  image="/assets/covers/research-runtime-scheduler-v1.svg"
  kicker="数字员工工场 · Runtime 正式发布"
  title="Research Runtime Scheduler V1.0"
  summary="Research Operating System 唯一正式调度器、可观测层与发布门禁。"
  version="V1.0"
  status="2026-08-02 发布 · Runtime Control Plane"
  languageHref="/en/publications/research-runtime-scheduler-v1.0"
  languageLabel="English"
/>

## 发布声明

**Research Runtime Scheduler V1.0** 正式把**工场运行中心**建立为数字员工工场的运行控制平面。

Research OS 继续定义研究工作应该怎样流转；Runtime Scheduler 负责何时开启正式工作、记录实际执行、通过自动 Dashboard 暴露状态，并在 Publication 成为正式运行结果之前强制完成 GitHub Commit Verify。

> Research Runtime——而不是单个自动任务——是数字研究员的运行控制平面。

## 发布元数据

| 字段 | 内容 |
|---|---|
| 能力 | Research Runtime Scheduler |
| 版本 | V1.0 |
| 数字员工工场 | 持续生产 |
| Runtime 时区 | `Asia/Shanghai` |
| 数字研究员 | 运行于 ChatGPT 的研究报告生产机 V1.0 |
| 唯一事实源 | GitHub 仓库 `joinwell52-AI/joinwell52` |
| Runtime Record | `research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md` |
| 发布日期 | 2026-08-02 |

## Runtime 架构

```text
Research Runtime Center
        ↓
Research Runtime Scheduler
        ↓
Runtime Engine
        ↓
Runtime Queue
        ↓
Runtime Knowledge
        ↓
Runtime Architecture
        ↓
Runtime Publication / Weekly / Academic
        ↓
Runtime Record
        ↓
GitHub Commit + Commit Verify
        ↓
数字员工工场
```

Scheduler 负责建立受治理的执行槽位，对应的 ChatGPT Runtime Worker 负责完成研究。触发不等于完成：没有真实输出和验证时，Runtime 必须保持 Waiting、Blocked 或 Failed。

## 七个正式 Runtime 任务

原任务正文存在数量不一致：写的是“六类”，但实际明确规定了七项职责。V1.0 以七个正式任务为准。

| Runtime | 调度时间（`Asia/Shanghai`） | 正式职责 |
|---|---|---|
| Research Runtime Engine | 每日 09:00 | 推进 Research OS 状态机。 |
| Research Runtime Queue | 每日 10:00 | 维护 Source Discovery、Candidate、Priority 与 Queue Lifecycle；禁止直接发布。 |
| Research Runtime Knowledge | 每日 11:00 | 维护 Knowledge、Related Notes、Observation 与 Architecture Candidate；禁止直接发布。 |
| Research Runtime Architecture | 每周一 12:00 | 作出 Architecture、Specification、Publication Candidate 与 Lifecycle Decision。 |
| Research Runtime Publication | 每日 20:00 | 使用完成的输入和 Research Skills 发布 Daily Research，并完成 Commit Verify。 |
| Research Runtime Weekly | 每周日 20:30 | 形成新的综合和工程判断；禁止复制 Daily。 |
| Research Runtime Academic | 每周三 10:00 | 发布 Paper、Benchmark、Specification、Conference 与 Institution 研究；禁止普通新闻。 |

每周三 10:00，Runtime Queue 与 Runtime Academic 同时到期。一次 Scheduler 触发会建立两个执行槽位，但两个任务保持独立状态和输出边界。

## Runtime Record

Runtime Record 是每次正式执行的唯一事实源。

它记录开始时间、结束时间、Duration、Task、GitHub、Commit、Status、Output、Lifecycle、Queue、Publication、Commit Verify 与只追加的 Runtime Log。只允许六种状态：

```text
Running · Completed · Blocked · Failed · Skipped · Waiting
```

网站不维护第二套 Dashboard 数据。构建时，Runtime Engine 验证 Markdown Runtime Record，并自动生成 Dashboard 投影。

## Runtime Center 网站

数字员工工场提供自动生成的工场运行中心：

- Runtime Status；
- Today’s Tasks；
- Runtime Timeline；
- Runtime History；
- Latest Runtime；
- Runtime Log；
- GitHub Status；
- Publication Status；
- Queue Status；
- Engine Status。

[进入 Research Runtime Center →](/zh/runtime/)

## Runtime Gate

```text
Research Runtime
→ Publication Candidate
→ Runtime Record
→ GitHub Commit
→ Commit Verify
→ Official Publication
```

Pull Request 验证会拒绝没有 Runtime Record 的正式 Publication 变更。

## 最高工程约束

> 任何正式 Publication 都必须由 Research Runtime 驱动完成并生成 Runtime Record；没有 Runtime Record 的发布，不属于正式运行结果。

## 权威实现

- [Runtime Charter](https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/README.md)
- [Scheduler Manifest](https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/SCHEDULER.json)
- [Runtime Record Schema](https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/RUNTIME-RECORD-SCHEMA.md)
- [Release Record](https://github.com/joinwell52-AI/joinwell52/blob/main/research/releases/research-runtime-scheduler-v1.0/RELEASE.md)
