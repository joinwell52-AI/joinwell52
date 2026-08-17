---
schema: publication-candidate-article/v2
title: "执行环境应拥有自己的配置策略"
date: '2026-08-17'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "当持久化 Agent 可以在不同 Turn 选择不同执行环境时，控制进程环境变量继承与显式变量的策略应由哪个对象拥有？"
summary: "可选择执行环境的 Runtime 不应让文件系统和权限跟随已解析环境，却让进程变量继续服从陈旧的线程级策略。执行级配置应跟随真正拥有工作的环境，并明确 Fallback、Merge Precedence 与可恢复任务所需的 Policy Identity。"
cover: research/runtime/production-work/2026/08/17/Q-20260817-02/baseline-cover.png
sources:
  - research/analysis/Q-20260817-02-environment-owned-execution-policy.md
---

![执行环境应拥有自己的配置策略题图](research/runtime/production-work/2026/08/17/Q-20260817-02/baseline-cover.png)

# 执行环境应拥有自己的配置策略

一个 Runtime 可以让不同 Turn 选择不同执行环境：工作目录、权限边界和资源位置都来自已经解析的 Environment。但如果启动子进程时仍从 Thread-global State 读取环境变量策略，系统就会出现一种不易察觉的分裂：**工作在环境 B 执行，进程配置却服从环境 A 的规则。**

2026-08-17 的 Research Object 检查了一项已合并的 Codex 变更。`EnvironmentConfig` 现在携带 `ShellEnvironmentPolicy`，普通 Shell、User-shell 与 Unified-exec 都从已选择的 Turn Environment 构建继承变量和显式覆盖；缺少已解析环境时，系统使用 Session 推导的配置作为明确回退。回归测试特意让 Thread Policy 与 Environment Policy 冲突，并验证由已选择环境控制过滤，同时保留该环境自己的显式值。

这些公开一手实现事实支持的核心结论是：**执行上下文不仅描述工作在哪里发生，也应定义谁拥有执行级配置。**

## 环境选择如果不包含策略选择，就不是完整选择

Thread-global Policy 在执行环境固定时很简单。可是一旦某个 Turn 能切换到容器、远程主机或另一组本地约束，线程级配置就可能过期。文件系统与权限来自已选择环境，而 PATH、代理、工具链或凭据相关变量来自另一个作用域，最终行为会变得难以解释和复现。

逐命令传入原始 Map 也不能自动解决问题。它把 Ownership 分散到每个调用者，使不同 Executor 难以证明自己使用了相同规则。更清晰的模型是让 Resolved Environment 成为一个配置权威边界：它携带继承过滤规则和显式值，执行器消费这份策略，而不是各自回读历史状态。

这并不意味着环境可以覆盖一切上级约束。组织级不可覆盖 Policy 仍可以存在，但它需要作为独立治理层声明，并说明与 Environment-owned Policy 的合并顺序。关键不是所有配置都去中心化，而是每一个 Effective Value 都有可解释的来源与优先级。

## Fallback 与 Precedence 必须成为合同

当已解析环境缺失时，Fallback 不能依赖隐式全局状态。所选实现使用 Session 推导的环境配置，至少让回退来源具有确定性。生产系统还应明确回答：何时允许 Fallback；它继承哪些变量；过滤发生在显式覆盖之前还是之后；环境主动写入的值能否绕过上级限制；不同 Shell 路径是否消费同一有效策略。

过滤继承变量与添加显式值是两种不同能力。过滤规则可以阻止宿主进程状态无意泄入执行环境，但它不会限制 Policy 自己主动写入的值。因此，显式值还需要 Provenance 与 Authority：谁创建了它、为什么允许它进入这个环境、它的生命周期和日志边界是什么。

每个会启动子进程的集成都应声明自己的策略来源。普通 Shell、User-shell 与 Unified-exec 已有同一所有权证据；MCP Server、Hook 或其他集成是否遵循相同边界，当前材料没有证明。缺失的覆盖应当被记录为未知，而不是从三个已覆盖路径推断全部路径均安全。

## 持久任务还需要 Policy Identity

确定性只说明“此刻哪个值获胜”。对于可 Resume 或 Replay 的工作，还需要证明恢复后的环境策略是否仍与暂停时语义相同。环境名称保持不变，不代表其继承规则、显式值或上级 Policy 没有变化。

一种更强的恢复合同，是为 Effective Environment Policy 提供稳定 Identity 或 Fingerprint。Checkpoint 可以记录该身份；恢复时若指纹变化，系统可要求重新准入、显式接受漂移，或在低风险场景记录差异后继续。具体选择取决于任务风险。Policy Fingerprint 是 Research Object 提出的架构建议，并非所选代码已经实现的功能。

## Debug 脱敏不是保密保证

`EnvironmentConfig` 的 Debug 表示会对策略进行脱敏，这说明 Policy Object 可能包含敏感显式值。它保护的是一个可观测表面，却不能证明 Secret 不会进入命令输出、错误消息、子进程日志、遥测或下游工具。

同样，Environment-owned Policy 解决的是配置所有权与来源错配，不是完整进程隔离。当前证据来自一个实现及其测试，不是独立隔离基准，也没有证明所有子进程路径都被覆盖。

因此，正确的边界不是“把 Policy 放进 EnvironmentConfig 就获得隔离”，而是：让执行级配置跟随真正执行工作的环境；把 Fallback、Precedence 与 Provenance 显式化；为持久恢复增加 Policy Identity；再用独立机制处理存储、日志、输出与下游进程的 Secret Protection。配置权威对齐，是可靠执行的必要组成，但不是完整安全模型。
