---
title: 行业架构学术观察 001 — NIST AI RMF 定义的是治理运行循环，而不是检查清单
date: '2026-08-02'
column: industry-architecture
category: academic
summary: NIST AI RMF 1.0 通过 Govern、Map、Measure 与 Manage 组织 AI 风险工作；要成为可执行系统，必须把这些 Function 转换为持久记录、证据、决策与反馈迁移。
sources:
  - NIST AI Risk Management Framework 1.0
  - NIST AI RMF Playbook
  - NIST AI 600-1 Generative AI Profile
outline: deep
cover: "/assets/covers/nist-ai-rmf-operating-loop-cover-v2.jpg"
---

<ArticleCover
  image="/assets/covers/nist-ai-rmf-operating-loop-cover-v2.jpg"
  kicker="行业架构 · 学术观察 001"
  title="NIST AI RMF 定义的是治理运行循环，而不是检查清单"
  summary="Govern、Map、Measure 与 Manage 是贯穿 AI Lifecycle 的关联风险 Function；执行需要持久运营记录。"
  version="IA001"
  status="Production Test V1 · 2026-08-02"
  languageHref="/en/industry/2026-08-02-nist-ai-rmf-operating-loop"
  languageLabel="English"
/>

## Summary

NIST AI Risk Management Framework 1.0 是一套 Voluntary、Rights-preserving、Non-sector-specific、Use-case-agnostic Framework，旨在帮助组织贯穿 Design、Development、Deployment、Use 与 Evaluation 管理 AI Risk。

它的运营核心包含四个 Function：**Govern、Map、Measure、Manage**。Playbook 为四个 Function 补充 Suggested Action 与 Reference；NIST AI 600-1 则以 Cross-sectoral Profile 方式把 Framework 应用于 Generative AI Risk。

这一 Framework 经常被压缩成四个标题，或者被当成 Compliance Checklist。NIST 自身的描述指向另一个方向：这些 Function 具有 Contextual、Iterative 特征，并且可以贯穿 Lifecycle 使用。

Research Center 的判断是：

> 只有当 Govern、Map、Measure 与 Manage 被表示成持久 Record、产生 Evidence 的 Activity、可问责 Decision 和 Feedback Transition 时，AI RMF 才能成为 Operating System。Framework 定义 Outcome，Implementation 必须补齐可执行机制。

## Source

### 主要研究对象

1. **NIST AI 100-1, Artificial Intelligence Risk Management Framework (AI RMF 1.0)**，2023 年 1 月 26 日发布。
2. **NIST AI RMF Playbook**，为四个 Function 提供 Suggested Action 的配套资源。
3. **NIST AI 600-1, Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile**，2024 年 7 月 26 日发布的 Generative AI Companion Profile。

本笔记评估正式发布的 1.0 Framework 与 GenAI Profile。NIST 仍在维护和演进相关材料，因此任何架构 Decision 都应保留引用的精确 Version。

### Research Question

能否把 AI RMF Function 转换为 Digital Employee 与 Research Operating System 的具体运行架构，同时避免把 Framework 变成僵化或虚假的 Compliance Checklist？

## Observation

### 1. Govern 是跨越所有阶段的运行条件

Govern 建立 Policy、Accountability、Culture、Role、Legal/Organizational Context、Documentation 与 Oversight。它并不是技术工作开始之前的一次性首阶段，而是影响所有后续 Decision，并从 Measurement 与 Management 中接收反馈。

对于 Operating System，Govern 意味着任何工作都不能缺少 Accountable Owner、Authority Model、Policy Basis、Lifecycle 与 Escalation Route。

### 2. Map 在解释 Risk 之前建立 Context

Map 识别 AI System 的 Intended Purpose、Stakeholder、Impact、Operating Environment、Dependency、Limitation 与 Risk Context。

缺少 Context 的 Risk Statement 并不完整。同一种 Capability 在 Sandboxed Research Task 中可能可以接受，但在 Employment、Financial、Medical 或 Irreversible Operational Decision 中可能不可接受。

### 3. Measure 把 Claim 连接到 Evidence

Measure 评估已识别 Risk、Trustworthiness Characteristic、Performance、Uncertainty、Limitation 与 Monitoring Signal。它依赖适合已映射 Context 的 Method 与 Metric。

Framework 并不提供一个 Universal Score。Measurement 应产生支持有边界 Decision 的 Evidence，而不是装饰性 Dashboard。

### 4. Manage 把 Evidence 转换为优先行动

Manage 对 Risk 排序，选择 Response，分配 Resource，监控 Outcome，沟通 Residual Risk，并决定 System 是否继续、修改、暂停或退役。

如果一次 Measurement 没有改变 Decision、Control、Work Item 或 Monitoring Obligation，那么 Operating Loop 尚未完成。

### 5. 四个 Function 相互连接，而不是顺序方框

```text
                 ┌──────────────┐
                 │    GOVERN    │
                 │ Policy, Role │
                 │Accountability│
                 └──────┬───────┘
                        │ shapes all
           ┌────────────┼────────────┐
           ▼            ▼            ▼
        MAP ─────────▶ MEASURE ─────────▶ MANAGE
      Context             Evidence          Action
        ▲                                     │
        └──────── Feedback and changed context┘
```

*图：joinwell52 Research Center 根据 NIST AI RMF 1.0 与 Playbook 综合。*

Manage Action 会改变 System 或 Environment，从而要求重新 Map 与 Measure。Governance 则从 Incident、Monitoring 与 Stakeholder Feedback 中吸收经验。

## Discussion

### 从 Framework Outcome 到 Executable Record

Software Implementation 需要为每个 Function 建立显式 Artifact：

| RMF Function | 必须存在的运行记录 | 示例 Gate 或 Event |
|---|---|---|
| Govern | Owner、Position、Authority、Policy、Lifecycle、Accountability、Exception Route | 因 Owner 或 Authority 缺失而拒绝 Admission |
| Map | Purpose、Stakeholder、Environment、Dependency、Data、Impact、Limitation、Misuse Context | Task 被归为 High-impact 或超出 Approved Purpose |
| Measure | Test Plan、Benchmark Version、Evidence、Uncertainty、Monitoring Signal、Evaluator Result | Evidence Gate 失败或 Confidence 不足 |
| Manage | Risk Decision、Treatment、Approver、Residual Risk、Action Owner、Review Date | Release、Restrict、Remediate、Pause、Escalate、Retire |

*表：joinwell52 Research Center 综合。*

关键工程规则是：每个 Decision 都必须引用当时使用的 Context 与 Evidence。否则组织无法解释为什么同一 System 在某一场景获批，而在另一场景被阻止。

### Govern 不应退化成一份中央文档

存放在 PDF 中的 Governance Policy 是必要的，但并不充分。Runtime Governance 应把适用 Policy 投影到正在执行的工作：

```yaml
governance_context:
  system_ref:
  position_ref:
  accountable_owner:
  intended_use_ref:
  authority_snapshot_ref:
  applicable_policy_refs:
  risk_tier:
  required_evidence_refs:
  human_decision_points:
  prohibited_actions:
  exception_route:
```

即使底层 Policy 后续改变，这个 Projection 也应针对当前 Run Versioned 且 Immutable。

### Map 阻止泛化的“Safe Agent”声明

脱离 Context，不存在一个简单的 Safe 或 Unsafe Agent。Map 强迫 System 说明谁会受到影响、涉及什么 Decision 或 Action、使用什么 Data、Agent 在哪里运行、有哪些 Alternative，以及 Failure 意味着什么。

对数字员工而言，应在两个层次 Map：

- **Position Mapping**：持久 Organizational Role 与常规 Authority。
- **WorkOrder Mapping**：具体 Task、Data、Stakeholder、Side Effect 与 Exception Condition。

### Measure 必须分开不同维度

Task Success、Security、Privacy、Fairness、Reliability、Transparency、Cost 与 Evidence Completeness 是不同维度。把它们合并成一个 Score，可能隐藏不可接受的 Failure。

Production Gate 应按维度定义 Minimum Condition，并允许记录 `not measured`，而不是虚构精度。

### Manage 需要权威与后续闭环

写完 Analysis Report 并不代表 Risk Management 完成。Decision 必须确定：

- Authorized Decision Maker；
- Selected Treatment；
- Accepted Residual Risk；
- Implementation Owner；
- Deadline 或 Review Condition；
- Monitoring 与 Escalation Path；
- 关闭 Action 所需 Evidence。

这更像一个受治理 WorkOrder，而不是一页静态 Policy。

### GenAI Profile 增加 Risk Detail，而不是建立另一套 Operating System

NIST AI 600-1 为 Framework 增加 Generative-AI-specific Risk 与 Action。从架构上看，它应作为 Profile 丰富 Map、Measure 与 Manage Requirement，同时继续运行在同一 Governance Loop 下。

System 可能需要按 Sector 或 Use Case 使用多个 Profile。Core Record 应保持稳定，而 Profile-specific Control 与 Evidence Requirement 可以变化。

## Limitations

1. AI RMF 是 Voluntary Framework，本身不构成 Legal Compliance 或 Certification。
2. 它有意保持 Flexible，组织必须自行设计具体 Method、Threshold 与 Control。
3. 四个 Function 不提供完整 Software Architecture 或 Data Model。
4. Contextual Implementation 会产生差异，两个组织可能都声称 Alignment，但实际运行方式完全不同。
5. 如果 Decision、Evidence 与 Runtime Behavior 没有关联，Framework 可能只被仪式化执行。

这些并非 General Framework 的缺陷，但它们界定了 Implementation 必须完成的工作。

## Engineering Impact

### TMPA

本笔记不直接修改 TMPA 正式出版物。它支持 Governance、Context、Measurement、Decision、Action、Lifecycle 与 Evidence 之间的显式 Reference。确定性重建必须显示每次 Management Decision 由哪一份 Mapped Context 与 Measured Evidence 支持。

### Digital Employee

数字员工 Governance 应实现为持续运行循环：

```text
Position and Policy
→ WorkOrder Context Mapping
→ Runtime and Outcome Measurement
→ Risk and Completion Decision
→ Remediation, Restriction, Release, or Retirement
→ Feedback to Position, Policy, and future WorkOrders
```

Control Plane 应维护 Fleet-level Govern 与 Map Record；Work Runtime 应产生 Measure Evidence；Authorized Human 或受治理 Decision Rule 执行 Manage Transition。

### CodeFlowMu

CodeFlowMu 应增加轻量 AI RMF Projection，而不是先建设大型 Compliance Subsystem。最小实现可以包括：

1. `governance-context.yaml`：Owner、Position、Authority、Policy 与 Prohibited Action；
2. WorkOrder Risk/Context Block；
3. Report 中的 Evidence 与 Evaluator Reference；
4. 显式 Release、Restrict、Remediate、Escalate 与 Retire Decision；
5. 产生新 Task 或更新 Position Policy 的 Feedback Record。

只要关系显式且 Machine-readable，现有 FCoP Lifecycle、Report、EVAL、QA 与 ADMIN Authority 已经可以提供大量执行结构。

## Future Work

1. 把当前 Research OS 与 CodeFlowMu Artifact 映射到 Govern、Map、Measure 与 Manage。
2. 定义最小 Machine-readable AI RMF Projection。
3. 建立一个 Position-level 与一个 WorkOrder-level Mapping Example。
4. 分开 Operational Evidence 与 Policy Assertion。
5. 测试 GenAI Profile Requirement 如何改变 Computer-use Digital Employee Workflow。
6. 定义 Risk Acceptance、Expiration、Review 与 Retirement Transition。
7. 跟踪未来 NIST Revision，同时不覆盖 1.0 Evidence Baseline。

## References

1. NIST，**Artificial Intelligence Risk Management Framework (AI RMF 1.0), NIST AI 100-1**：https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10
2. NIST，**AI Risk Management Framework**：https://www.nist.gov/itl/ai-risk-management-framework
3. NIST，**AI RMF Playbook**：https://www.nist.gov/itl/ai-risk-management-framework/nist-ai-rmf-playbook
4. NIST，**Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile, NIST AI 600-1**：https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence
