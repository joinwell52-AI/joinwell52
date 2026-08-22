---
schema: publication-candidate-article/v2
title: "安全的命令名，不等于执行权限"
date: '2026-08-20'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "When the visible action name does not fully determine what will execute, what evidence should a digital employee use before treating an action as authorized?"
summary: "命令标签记录的是意图，不是配置与可执行上下文可能产生的全部行为。同日 Codex 变更说明：当语法无法确定实际动作时，执行准入应 Fail-closed，并交由显式策略裁决。"
cover: staging/publication-candidates/2026-08-20-command-name-execution-authority-cover-v2.png
sources:
  - research/analysis/Q-20260820-01-effective-execution-authority.md
---

![安全的命令名，不等于执行权限题图](staging/publication-candidates/2026-08-20-command-name-execution-authority-cover-v2.png)

# 安全的命令名，不等于执行权限

`git status` 看起来只是读取仓库状态。但在可配置的仓库里，眼前这几个词并不能完整描述进程可能执行的内容：Git 配置可以把名义上的只读操作重定向到 Helper。数字员工如果只识别命令名，就可能把一个熟悉标签误当成充分授权。

2026 年 8 月 20 日合并的一项 Codex 变更正面处理了这个边界。Git 被移出 Unix 与 Windows 的 Known-safe Command Shortcut。在 `UnlessTrusted` 审批策略下，普通 `git status` 会进入 `NeedsApproval`，除非显式 Execution-policy Rule 已授权。针对 Absolute Executable Path 的测试还区分了由策略覆盖的 Host Executable 与另一条未匹配的 Git Path。端到端回归实际触发真人审批，并把拒绝结果保留为命令结果。

这些证据支持的并不是“Git 都不安全”，而是一条更准确的规则：**名义 Action Name 是 Intent Evidence，不是 Execution Authority；Effective Execution Identity、Governing Policy 与后续 Effect Containment 必须分别记录。**

## 标签描述意图，上下文决定行为

命令 Allowlist 很有吸引力，因为它便宜、确定。如果 `status` 这样的 Token 永远映射到一个固定实现，Lexical Classifier 确实可以减少不必要的审批。但当 Executable、Repository Configuration、Wrapper 或 Environment 能改变同一段文本的实际行为时，这个前提就失效了。

这对数字员工尤其重要，因为 Visible Action 往往同时是 Agent 与 Reviewer 看到的主要证据。请求可能写着“检查仓库状态”，Effective Execution Path 却会读取能够启动其他程序的配置。名义命令仍然表达了有价值的 Intent，但已经无法建立完整 Operation Identity。

Absolute-path 测试把区别变得很具体：覆盖某个已声明 Host Executable 的 Policy Rule，不会自动授权另一条未匹配 Git Path。因此，命令拼写只是 Policy Identity 的一个组成部分；Executable Identity 与 Execution Context 同样重要。

## Fail-closed 不等于凡事都询问

取消 Known-safe Shortcut，并不意味着 Classifier 变成最终 Authority。回归行为仍保留不同 Policy Semantics：`UnlessTrusted` 在没有显式规则时请求批准，而 `OnRequest` 保持自己的策略逻辑。变更只是把无法确定的情况从“自动安全”退回 Governing Policy。

这是关键的架构分账。Classification 回答“我们掌握了哪些关于这次动作的证据”；Policy 回答“在当前 Authority 下是否允许执行”。不断扩大的硬编码 Allowlist 会把两者混为一谈，并在本地配置改变实际行为后迅速过期。

Always-ask 也不是唯一替代方案。它可能制造 Approval Fatigue，却没有改善 Reviewer 获得的证据。更合理的契约是：在行为受到独立约束时，允许低成本 Classifier 优化；只要语法无法证明安全，就必须回到显式 Policy。

## 把授权记录绑定到实际执行

一份可用的 Execution Record 至少应分开保存四个事实：

- 用户或 Agent 表达的 Nominal Intent；
- 可能改变行为的 Effective Executable 与 Context；
- 授予或拒绝 Authority 的可归责、可版本化 Policy Decision；
- 执行后关于 External Effect 是否被约束和对账的证据。

第一项帮助人理解动作，第二项确保决策针对真正会运行的 Operation，第三项标识 Authority Channel，第四项阻止系统把一次成功准入夸大成“结果必然安全”。

这种分离也改变了 Approval Interface 应展示的内容。当 Executable Path、Repository Configuration 或 Helper Risk 会实质改变执行时，只重复同一条命令文本是不够的。充分知情的批准需要看到改变策略结果的证据，而不是多一个确认按钮。

## Approval 仍然不是 Effect Containment

已合并代码与测试是来自单一实现的公开一手证据，不是跨 Agent Runtime 的独立安全评估。它没有枚举所有 Git Helper Path，也没有建立 Binary Provenance、Repository-configuration Integrity 或 Sandbox Behavior。

更重要的是，Approval 只授权一次有界 Execution Decision。它不会证明 Helper 按预期行为，不会证明所有 External Effect 都被 Sandbox 约束，也不会证明远端状态已经完成 Reconciliation。这些属于后续 Gate，需要各自的证据。

真正需要回答的问题不再是某条命令能否永久进入“安全清单”，而是一次 Authority Decision 最少需要哪些 Effective-execution Evidence。Policy Identity 能否纳入 Executable 与相关 Configuration Digest，而不让每次动作的成本过高？Repository State 改变后，哪些旧规则必须失效？数字员工的安全来自这些转换可以被明确记录和测试，而不是让熟悉的名字代替实际 Operation。

**一手证据：** [OpenAI Codex 合并提交 3b45c290](https://github.com/openai/codex/commit/3b45c29062ff0e76e71c91b6753290400e7fa8da)。公开代码与仓库测试支持本文描述的有界实现行为，但不构成对完整执行安全的独立验证。
