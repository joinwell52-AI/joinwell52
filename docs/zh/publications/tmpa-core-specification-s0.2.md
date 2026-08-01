---
title: TMPA 核心规范 — 草稿 S0.2
outline: deep
---

<ArticleCover
  image="/assets/covers/tmpa-spec.svg"
  kicker="核心规范"
  title="TMPA Core Specification"
  summary="将 TMPA 核心语义转化为可实现、可测试且不依赖单一存储后端的契约。"
  version="S0.2"
  status="公开规范草稿"
  languageHref="/en/publications/tmpa-core-specification-s0.2"
  languageLabel="English"
/>

## 目的

核心规范把 TMPA 的研究主张转化为可实现、可测试的契约，并区分规范性核心语义与可选的文件原生存储 Profile。

## 核心契约

符合规范的实现必须能够表达：

- Profile、Event、Message、Index、Knowledge；
- 唯一身份与引用；
- 写者身份和责任身份；
- 来源和观察上下文；
- 版本与时间；
- 只增工作事实；
- 验证与审计关系；
- 发布决策；
- 生命周期迁移；
- Knowledge Candidate 与受治理晋级；
- 可重建导航与导出。

## 文件原生 Profile

参考 Profile 可以采用 Markdown、JSON、CSV、目录和原子文件操作。文件存储不是强制要求，但其他后端必须无损保存并导出同一组核心语义。

## 基本规则

```text
Raw Event
  对已经发生事实的只增陈述

Audit / Verification Event
  引用原始事实的受治理判断

Published Result / Knowledge
  只有通过门禁后才晋级
```

被拒绝的动作不能从历史中消失；拒绝通过一个新的受治理事实表达。

## Message 与 FCoP

FCoP 的 TASK、REPORT、ISSUE、REVIEW 可以承载或投影为 TMPA Message。实现不得为同一个协作对象建立两个权威副本。

## Runtime 边界

TMPA 不替代任务队列、Lease、Session 管理、Checkpoint、重试、业务事务、工具执行和 Provider 调度。Runtime 状态可靠投影为 TMPA 事实时可以采用 Outbox 模式。

## 草稿状态

S0.2 仍在持续完善。待收口内容包括最小 Schema、兼容规则、签名 Profile、证据粒度、一致性测试和不同存储 Profile 的互操作。
