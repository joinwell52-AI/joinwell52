---
title: TMPA–FCoP–CodeFlowMu 工程案例 — 草稿 I0.2
outline: deep
---

<ArticleCover
  image="/assets/covers/implementation-case.svg"
  kicker="工程案例"
  title="TMPA–FCoP–CodeFlowMu 工程实现案例"
  summary="记录一个已经运行的多 Agent 软件团队，怎样增量演进为受治理数字员工 Runtime。"
  version="I0.2"
  status="公开工程案例草稿"
  languageHref="/en/publications/implementation-case-i0.2"
  languageLabel="English"
/>

## 目的

本报告记录一个已经运行的软件开发多 Agent 团队，如何逐步演进为受治理的数字员工 Runtime。

## 现有工程基础

CodeFlowMu 已经具备：

- PM、DEV、OPS、QA 协作；
- FCoP TASK、REPORT、ISSUE、REVIEW 生命周期；
- Agent Registry 与 Session；
- 任务派发、重试和恢复；
- 报告、复核和汇总门禁；
- Ledger、Diagnostics 与 EVAL；
- Browser、Windows 与编码工具；
- Web 与 PWA 操作界面。

因此工程策略不是重写平台，而是增量演进。

## 增量实施路径

```text
阶段 0  建立 Open Dev Team 行为基线
阶段 1  通过 WorkDataPort + Outbox 旁路投影 TMPA
阶段 2  显式化软件开发岗位与 Work Skill
阶段 3  通过 TeamPolicy 泛化固定下游角色
阶段 4  增加 Operation Node、语义状态和可恢复执行
阶段 5  运行第二个非开发岗位：赛格短租数字员工
阶段 6  Runtime 模型验证后再建设 Studio
```

## 正式分层

```text
Runtime Trace
  低层工具与调试细节

TMPA Semantic Event
  有业务意义的观察、动作与状态变化

FCoP Coordination
  正式责任交接与复核
```

## 完成门禁

```text
业务完成门禁
AND Runtime 完成
AND FCoP 协作闭环
AND TMPA 发布就绪
AND 独立验证
AND 必需的人类权威
→ WorkOrder 才允许关闭
```

## 决定性测试

同一个 Core 必须同时运行现有 Open Dev Team 与赛格短租数字员工，且不在 Core 中加入业务专用角色顺序和工作流规则。

如果第二个岗位仍然要求重写 Core，那么平台仍是领域专用多 Agent 应用，而不是通用数字员工 Runtime。

## 证据与局限

案例来自 CodeFlowMu 与 FCoP 的真实工程历史，包括生命周期、Review Gate、Diagnostics、恢复和多角色任务闭环。I0.2 在正式发表前仍需稳定证据附录、可复现 Run 和版本化代码引用。
