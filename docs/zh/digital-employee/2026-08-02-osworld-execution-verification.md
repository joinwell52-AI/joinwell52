---
title: 数字员工学术观察 001 — OSWorld 说明工作必须通过执行结果验证
date: '2026-08-02'
column: digital-employee
category: academic
summary: OSWorld 的真实计算机任务、可重建初始状态与可执行 Evaluator 表明，数字员工应由最终应用状态判断，而不是由自身的完成声明判断。
sources:
  - OSWorld paper
  - OSWorld project and official repository
  - OSWorld-Verified and OSWorld 2.0 project updates
outline: deep
---

<ArticleCover
  image="/assets/covers/academic-osworld.svg"
  kicker="数字员工 · 学术观察 001"
  title="OSWorld 说明工作必须通过执行结果验证"
  summary="真实计算机工作需要受控初始状态、可观测动作，以及可执行的最终状态评估。"
  version="DA001"
  status="Production Test V1 · 2026-08-02"
  languageHref="/en/digital-employee/2026-08-02-osworld-execution-verification"
  languageLabel="English"
/>

## Summary

OSWorld 建立了一套 Benchmark 和真实计算机环境，用于评估 Multimodal Agent 完成开放式 Web 与 Desktop Task 的能力。原始研究包含 369 个来自真实 Computer-use Case 的任务；每个任务都具有详细 Initial-state Setup 与自定义 Execution-based Evaluator。

原始论文报告了人类与当时 Baseline System 之间的明显差距：人类完成率超过 72.36%，该研究中表现最好的模型为 12.24%。这些是 2024 年论文中的历史结果，不代表当前 Leaderboard。

对数字员工架构而言，最重要的贡献不是 Score，而是 Evaluation Model。

Research Center 的判断是：

> 数字员工应以可重建的初始状态和可执行的最终状态契约进行评估。Screenshot、Action Log 与模型解释都是证据输入，但不能替代对目标业务状态是否真实存在的验证。

## Source

### 主要研究对象

**OSWorld: Benchmarking Multimodal Agents for Open-Ended Tasks in Real Computer Environments**，2024 年发布于 arXiv，并配套 OSWorld Project 与 Open-source Repository。

其研究问题是：Multimodal Agent 是否能够在真实 Operating-system Environment 中完成多样、开放式 Computer Task，而不是只在简化网页、固定 API 或 Application-specific Simulator 中工作。

### 入选原因

OSWorld 与数字员工方向直接相关，因为它同时包含：

- 真实 Web 与 Desktop Application；
- Operating-system Interaction；
- 跨 Application Workflow；
- 受控 Initial-state Setup；
- Virtualized Environment 中的 Action Execution；
- Task-specific Executable Evaluator；
- 可重建 Research Infrastructure。

官方 Repository 后续推出 OSWorld-Verified，项目也进一步发展到 OSWorld 2.0。这些演进强化了一个重要学术结论：Benchmark Task、Environment、Asset 与 Evaluator 都需要版本化维护；没有精确 Benchmark Release 的 Score 并不是完整证据。

## Observation

### 1. Benchmark 评估的是环境中的工作，而不是孤立文本

Agent 与真实 Computer Environment 交互。它必须理解 Interface、选择动作、推进 Application State，并完成可能跨 Desktop 与 Web Software 的任务。

因此，Benchmark 实际评估的不只是 Model：

```text
Task Instruction
+ Initial Environment State
+ Observation Interface
+ Action Interface
+ Computer Runtime
+ Application Behavior
+ Evaluator
= Measured Task Outcome
```

*图：joinwell52 Research Center 根据 OSWorld 论文与 Repository 综合。*

Benchmark Result 因而会受到 Environment Setup、Credential、Network Condition、Application Version、Action Timing 与 Evaluator Correctness 影响。

### 2. 初始状态属于任务契约

OSWorld Task 包含详细 Initial-state Setup Configuration。这是必要的，因为同一句 Instruction 在不同 Open Application、File、Account State、Browser Tab、Prior Record、Locale 或 Current Selection 下可能具有不同含义。

在组织工作中，对应概念是 WorkOrder Admission Snapshot。如果系统不知道数字员工接收了什么状态，就无法公平评估其执行结果。

### 3. Evaluation 基于结果状态

OSWorld 使用自定义 Execution-based Evaluation Script。Evaluator 在 Agent 操作完成后检查 Computer 或 Application State。

这比询问模型是否成功更强，因为它能区分：

- 正确解释与错误 Application State；
- Click Attempt 与持久化修改；
- 视觉上合理的 Screen 与真正需要的 Data Condition；
- Partial Progress 与实际 Completion。

### 4. 原始 Human–Agent 差距暴露了 Grounding 与操作知识限制

论文把大量性能差距归因于 GUI Grounding 与 Operational Knowledge。开放式 Computer Work 要求 Agent 找到正确 Interface Target、理解 Application Behavior、安排动作顺序、处理 Delay 或意外 State，并从 Error 中恢复。

历史数值不应被当成当前能力排名。其研究价值是证明 Task-level Success 可能与一般语言能力存在巨大差异。

### 5. Benchmark Maintenance 是 Evidence Quality 的一部分

官方 Repository 后续发布 OSWorld-Verified，修复社区报告的问题并改善 Benchmark Signal。OSWorld 2.0 进一步强调 Code、Task File、Asset 与 Mocked Website 必须使用一致 Release。

这说明 Evaluator Quality 与 Version Pinning 不是行政细节，而是决定两个 Score 是否真正可比较的条件。

## Discussion

### 数字员工需要 Work Verification Contract

组织任务应具有明确 Setup 与 Validation：

```yaml
work_verification_contract:
  task_id:
  instruction:
  initial_state_manifest:
  allowed_applications:
  allowed_action_classes:
  credential_scope_ref:
  success_predicates:
  forbidden_side_effects:
  evidence_requirements:
  timeout_and_retry_policy:
  evaluator_version:
  environment_version:
```

Success Predicate 应尽可能接近 Business System of Record。Screenshot 可以支持验证，但 Saved Record Readback、Generated File Hash、Workflow Status 或 Application Database State 通常是更强证据。

### Execution-based Verification 会改变 Runtime 设计

如果只在最后通过自然语言检查 Success，Runtime 可以在 Agent 说“Done”时停止。

如果 Success 需要 Execution-based Verification，Runtime 就必须具备：

1. 已知 Initial State；
2. Checkpointed Observation 与 Action；
3. 独立 Evaluator；
4. Progress 与 Completion 的明确区别；
5. Retry 与 Recovery Rule；
6. Evidence Retention；
7. 能指出哪个 Predicate 未满足的 Failure Report。

这样，Evaluation 成为 Execution 的组成部分，而不是事后 Quality Report。

### Benchmark Task 不等于 Production Work

OSWorld 提供了有价值的 Research Environment，但生产数字员工还要面对：

- 真实 Customer 或 Employee Data；
- 不可逆或具有 Financial Consequence 的动作；
- Access Governance 与 Separation of Duties；
- Privacy Retention Rule；
- Incident Response；
- 持续变化的 Application 与 Anti-automation Control；
- 模糊 Business Objective；
- 停止继续并 Escalate 的 Authority。

因此，Benchmark Pass 不等于 Production Ready；它只验证 Runtime Contract 的一部分。

### 有用的内部 Benchmark 必须保留 Failure Evidence

每个失败任务都应允许组织检查：

```text
Initial State
→ Observed State Sequence
→ Proposed Actions
→ Executed Actions
→ Policy/Approval Events
→ Final State
→ Failed Predicate
→ Recovery Attempt
```

这样才能支持工程改进，也能避免一个 Aggregate Success Rate 掩盖重复 Failure Mode。

### Evaluation 必须版本化

任何 Score 都应绑定：

- Task-set Version；
- Environment Image 或 Release；
- Evaluator Version；
- Model 与 Runtime Version；
- Tool 与 Action Interface Version；
- Credential 与 Network Configuration；
- Retry Policy；
- Date 与 Execution Log。

缺少这些 Reference，结果就无法被确定性解释或比较。

## Engineering Impact

### TMPA

本笔记不直接修改 TMPA 正式出版物。它提供的研究证据是：Integrity 需要引用 Initial State、Execution Event、Evaluator Version、Evidence 与 Final-state Judgment。缺少这些 Reference 的 Completion Claim 不足以进行确定性重建。

### Digital Employee

数字员工 Evaluation 应围绕 Position-specific Work Verification Contract 组织。每个 Position 都需要代表性任务，覆盖 Normal Operation、Invalid Input、Interruption、Policy Denial、Escalation、Recovery 与 Duplicate-action Prevention。

平台至少应报告：

- Final-state Success；
- Policy Conformance；
- Unsupported Side Effect；
- Human Intervention Point；
- Recovery Outcome；
- Evidence Completeness；
- Environment 与 Evaluator Version。

### CodeFlowMu

CodeFlowMu 应在接入不可控外部网站之前，先建立小型 Internal Computer-use Benchmark。首个 Suite 可以使用本地确定性 Application，并包括：

1. Search 与 Read-only Retrieval；
2. 带 Validation 的 Form Entry；
3. Multi-step Status Transition；
4. File Generation 与 Hash Verification；
5. Approval-required Action；
6. 注入 Error 后的 Checkpoint Resume；
7. Duplicate-submission Prevention。

每个 Task 必须具有 Executable Validator。QA 不仅要审查 Agent Output，也要审查 Validator，因为错误 Evaluator 可能认证错误行为。

## Future Work

1. 详细阅读并比较 OSWorld-Verified 与 OSWorld 2.0 的 Task/Evaluator 变化。
2. 定义面向数字员工 Position 的 Benchmark Schema。
3. 为受控本地 Application 建立 Executable Validator。
4. 分开 Task Success、Policy Compliance、Evidence Completeness 与 Recovery Quality。
5. 测试哪些 Task Class 可以只使用 Screenshot 完成验证。
6. 建立版本化 Benchmark Release 与冻结 Evaluation Manifest。
7. 比较 Computer-use Benchmark 与 End-to-end Business-process Benchmark。

## References

1. Xie 等，**OSWorld: Benchmarking Multimodal Agents for Open-Ended Tasks in Real Computer Environments**：https://arxiv.org/abs/2404.07972
2. OSWorld Project：https://os-world.github.io/
3. xlang-ai，**OSWorld Official Repository**：https://github.com/xlang-ai/OSWorld
4. xlang-ai，**OSWorld 2.0 Official Repository**：https://github.com/xlang-ai/OSWorld-V2
