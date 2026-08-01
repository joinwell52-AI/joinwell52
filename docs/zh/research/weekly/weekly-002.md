---
title: Weekly 002 — 数字员工控制面与工作 Runtime
date: '2026-08-01'
column: digital-employee
category: weekly
summary: 综合 Workday Agent System of Record、OpenHands Agent Canvas 与 CodeFlowMu 的工程方向。
outline: deep
---

<ArticleCover
  image="/assets/covers/weekly-002.svg"
  kicker="研究周报 · 002"
  title="数字员工控制面与工作 Runtime"
  summary="综合 Workday Agent System of Record、OpenHands Agent Canvas 与 CodeFlowMu 的工程方向。"
  version="W002"
  status="发布于 2026-08-01"
  languageHref="/en/research/weekly/weekly-002"
  languageLabel="English"
/>

## 核心综合

第二期研究从“数字员工是什么”推进到两个系统层次的明确分离：

```text
数字员工控制面
  身份、所有权、岗位、权限、名册、
  生命周期、政策、成本、遥测与评估

数字员工工作 Runtime
  WorkOrder、规划、工作流、Session、工具、
  Checkpoint、恢复、证据与完成门禁
```

企业平台通常具备较强的数字劳动力管理能力，但基础设施和组织成本很重；Agent 框架提供执行能力，却常常缺少组织所有权、完成权威和生命周期治理。CodeFlowMu 的机会，是把轻量控制面连接到已经存在的工作 Runtime。

## Workday：控制面对标

Workday Agent System of Record 把 Agent 当作企业内需要长期治理的资源。真正重要的字段不只是模型和 Prompt，还包括：

- 组织负责人；
- 角色与技能；
- 权限和数据访问；
- Provider 与部署；
- 使用量、遥测和工作历史；
- 成本与价值；
- 合规和生命周期。

对 CodeFlowMu 最重要的启发是“持久身份”：数字员工不能随着模型 Session 结束而消失，也不能被某个 Provider 绑定。

## OpenHands：操作者工作空间对标

OpenHands Agent Canvas 展示了 Agent 长期运行所需要的工程外壳：

- Skill 与 Plugin 可见；
- 连接健康诊断；
- 启动和运行日志；
- 本地、远程与托管执行；
- 手动、定时和事件触发；
- 面向操作者的工作空间。

CodeFlowMu 应学习这些运行机制，但不能把产品第一抽象从岗位退回到通用 Agent Workspace。

## CodeFlowMu 目标结构

```text
组织
  ↓ 定义
岗位
  ↓ 注册到
数字员工控制面
  ↓ 生成
WorkOrder
  ↓ 由
CodeFlowMu 工作 Runtime 执行
  ↓ 使用
Agent Provider + 工具 + 规则 + 人类
  ↓ 形成
TMPA / FCoP 治理的 Outcome
```

### 控制面

- PositionRegistry；
- DigitalEmployeeRegistry；
- 所有权与组织归属；
- TeamPolicy 与权限；
- Provider、工具与凭证绑定；
- 生命周期与版本；
- 成本、SLA 与评估记录；
- 合规与审计视图。

### 工作 Runtime

- 现有 PM 继续作为 Work Manager；
- WorkOrder、Plan 与 Workflow；
- Operation Node；
- SessionManager 与 TaskDispatcher；
- Browser、Windows、Source 与 API 工具；
- Checkpoint、重试与恢复；
- Event Outbox 与 TMPA 投影；
- FCoP 正式协作；
- 业务完成与发布完成门禁。

## SME-first 约束

目标不是复制一套大型企业 AI Control Tower，而是实现最小但完整的数字员工平台：本地或小服务可部署、Provider 无关、成本可控、人类保留最终权威、工作证据可以导出和重建。

## 建议工程顺序

1. 将现有 Open Dev Team 投影为第一个注册数字员工；
2. 先增加负责人、岗位、版本、Provider、允许工具、生命周期和成本政策的只读名册；
3. 验证期间不改变现有 PM/FCoP/Runtime 行为；
4. 在一个控制台统一展示 Provider、工具、Session、HOLD 与恢复状态；
5. 在建设完整 Studio 之前，用赛格短租数字员工验证第二个非开发岗位。

## 结论

未来竞争的系统类别已经不再是“谁拥有更多 Agent”，而是：

> **受治理的数字劳动力控制面，连接可靠的 AI 工作 Runtime。**

CodeFlowMu 的差异化机会，是成为这一类别面向中小企业的轻量工程实现。
