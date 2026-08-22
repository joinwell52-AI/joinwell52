---
title: Workday Agent System of Record — 架构分析
date: '2026-08-01'
column: industry-architecture
category: daily
summary: 数字员工持久所有权、生命周期、成本、合规与劳动力级可观测的控制面对标。
outline: deep
cover: "/assets/covers/workday-system-of-record-cover-v2.jpg"
---

<ArticleCover
  image="/assets/covers/workday-system-of-record-cover-v2.jpg"
  kicker="行业架构"
  title="Workday Agent System of Record"
  summary="数字员工持久所有权、生命周期、成本、合规与劳动力级可观测的控制面对标。"
  version="研究专题"
  status="持续维护"
  languageHref="/en/industry/workday"
  languageLabel="English"
/>

## 定位

Workday Agent System of Record（ASOR）为 Workday、客户或合作伙伴构建的企业 Agent 提供统一管理和记录层。它更接近数字劳动力控制面，而不是完整的工作执行 Runtime。

## 核心管理模型

ASOR 重点记录：

- 组织负责人和组织归属；
- 角色与技能；
- 使用量与可观测；
- 安全和数据访问；
- 成本与 ROI；
- 合规和一致性；
- 生命周期与改进；
- 交互遥测。

它最有价值的思想，是把 AI 工作者作为需要长期治理和持续投资评估的组织资源，而不是不可见的 API 调用。

## 架构解读

```text
AI 工作者
   ↓ 注册为
持久劳动力记录
   ├── 负责人
   ├── 角色与技能
   ├── 权限与访问
   ├── Provider 与部署
   ├── 遥测和工作历史
   ├── 成本与价值
   ├── 合规
   └── 生命周期
```

实际执行可以发生在其他 Runtime，但企业必须保留稳定身份、所有权与问责关系。

## 优势

1. 跨 Provider 可见；
2. 持久所有权和组织归属；
3. 成本与 ROI 成为治理数据；
4. 生命周期和合规管理；
5. 从单个 Agent 日志提升到劳动力级遥测。

## 局限

ASOR 本身不定义 WorkOrder 怎样规划、执行、恢复并被证明完成；其天然部署环境也更偏向拥有 Workday 基础设施的大型企业。

## 对 CodeFlowMu 的启发

CodeFlowMu 需要一个能够回答以下问题的 Digital Employee Registry：

- 当前有哪些数字员工？
- 每个实例代表什么岗位？
- 谁负责它？
- 它可以接受哪些工作？
- 绑定了哪些 Provider、工具和凭证？
- 当前生命周期状态是什么？
- 完成了什么，成本是多少？
- 是否在政策范围内运行？

一个持久数字员工可以在不同时间使用不同 Provider 与 Session。

## 最小研究投影

```yaml
digital_employee:
  id:
  position_ref:
  organizational_owner:
  runtime_deployment:
  team_policy_ref:
  provider_bindings:
  allowed_tool_refs:
  credential_refs:
  version:
  lifecycle_status:
  current_work_refs:
  cost_policy_ref:
  evaluation_summary_ref:
  evidence_index_ref:
```

该结构仍是研究投影，不是冻结实施 Schema。

## 战略判断

Workday 是当前数字劳动力控制面的重要对标。CodeFlowMu 应把更轻量的名册与现有 PM、FCoP 和 Runtime 执行能力结合起来。
