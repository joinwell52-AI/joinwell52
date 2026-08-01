---
title: 数字员工架构 V0.2
outline: deep
---

<ArticleCover
  image="/assets/covers/digital-employee.svg"
  kicker="纲领性架构"
  title="数字员工架构 V0.2"
  summary="以岗位为中心，连接组织责任、受治理工作流、CodeFlowMu Runtime、TMPA 工作数据与 FCoP 正式协作。"
  version="V0.2"
  status="现行纲领基线"
  languageHref="/en/digital-employee/architecture"
  languageLabel="English"
/>

## 核心定义

数字员工是组织内部一个由软件定义、持久存在的工作单元：对外表现为**岗位（Position）**，对内由**受管理工作团队（Managed Work Team）**执行。

```text
数字员工
├── 对外契约：岗位
└── 对内执行：受管理工作团队
```

模型、Prompt、Agent Session、工作流、脚本、拟人形象或工具都可以成为实现组件，但任何一个都不足以单独定义数字员工。

## 稳定组织契约

稳定层包括：

- 岗位使命与职责；
- 允许与禁止事项；
- Work Catalog；
- 权限与授权边界；
- 完成契约；
- 证据要求；
- 评估与生命周期政策。

执行层可以替换：Agent Provider、模型、Session、临时团队、确定性规则和工具可以变化，而岗位契约保持稳定。

## 对象分层

```text
Position
  → Work Catalog
    → WorkOrder
      → Plan
        ↔ Workflow
          → Operation Node
            → Semantic Action Plan
              → Tool Call
                → Run
                  → Outcome
```

- **Position** 定义长期职责；
- **WorkOrder** 表示一次有边界的工作请求；
- **Plan** 描述本次实例怎样处理；
- **Workflow** 是经真实 Run 证明的受治理可复用方法；
- **Operation Node** 是最小的业务语义和可验证工作单元；
- **Tool Call** 只是低层动作，不能证明业务成功；
- **Outcome** 才是受治理的业务结果。

## AI 原生工作流

数字员工必须避免两个极端：

```text
一切写死 → 退化为 RPA
只给目标 → 退化为失控 Agent
```

正确中间态是：岗位职责、权限、状态和完成契约稳定；AI 在约束内动态规划；全过程保留可重建证据，并具有验证、恢复和发布门禁。

## Runtime 边界

**CodeFlowMu 本身才是数字员工 Runtime。** Cursor、Codex、OpenHands、模型 API 与本地模型属于可替换 Provider 或 Adapter。

Runtime 负责：

- Work Manager / PM；
- Agent Registry 与 Session；
- 任务派发与 FCoP 生命周期；
- 工作流解释和节点执行；
- 超时、重试、Checkpoint 与恢复；
- TeamPolicy 与完成门禁；
- Event Outbox 与 TMPA 投影；
- 可观测、人类门禁与评估。

## TMPA 与 FCoP

```text
TMPA       — AI 工作数据与治理架构
FCoP       — 粗粒度正式协作与责任协议
CodeFlowMu — 数字员工开发与工作 Runtime
```

TMPA 统一 Profile、Event、Message、Index、Knowledge 五类工作数据；FCoP 通过 TASK、REPORT、ISSUE、REVIEW 和生命周期迁移管理正式责任交接。

三层记录保持分离：

```text
Runtime Tool Trace  — 调试级低层动作
TMPA Semantic Event — 有业务意义的工作事实
FCoP Coordination   — 正式责任交接
```

## 完成模型

Runtime 进程结束不等于业务正确完成。正式完成是多个状态的合取：

```yaml
completion:
  business_state: criteria_satisfied
  runtime_state: completed
  coordination_state: done
  publication_state: final
  verification_state: passed
  human_authority_state: satisfied_or_not_required
```

## 知识与进化

一次经验不能直接覆盖正式知识：

```text
Run / Failure / EVAL
→ Knowledge 或 Workflow Candidate
→ 复核与安全数据回归
→ 版本化发布
→ 受治理 Knowledge
```

## 面向中小企业的经济性

“持久数字员工”不意味着模型持续消耗 Token。持久的是岗位、身份、权限、工作历史、状态、证据、Workflow 版本、评估与成本记录；计算资源在工作到达时激活。

## 决定性工程证明

只有同一个 CodeFlowMu Core 能在不加入业务专用角色顺序和工作流逻辑的前提下，同时运行当前 Open Dev Team 与赛格短租数字员工，平台才真正跨过“多 Agent 开发应用”到“数字员工 Runtime”的门槛。

## 待讨论议题

- 最小正式 Schema；
- WorkDataPort 与 Outbox 接口；
- Provider 能力协商；
- 凭证隔离与撤销；
- Workflow 晋级标准；
- Verifier 隔离；
- HOLD 所有权与超时；
- 面向中小企业的成本预算与 Registry 要求。
