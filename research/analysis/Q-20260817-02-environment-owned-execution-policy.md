---
schema: "research-analysis/v1"
id: "AN-20260817-02"
date: "2026-08-17"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260817-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260817-02-per-environment-shell-variable-policy.md"
output_contract: "Research Object"
research_object: "Environment-Owned Execution Policy as a Configuration Authority Boundary"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Environment-Owned Execution Policy as a Configuration Authority Boundary

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-17 Reading Result for Q-20260817-02. The merged Codex environment-policy implementation and tests are bounded facts. The broader conclusions concern configuration authority in runtimes that can select different execution environments; they do not establish complete process isolation, secret non-disclosure, or universal coverage of every subprocess/integration path.

本对象仅分析 Q-20260817-02 的 2026-08-17 已完成 Reading Result。Codex 已合并的环境策略实现与测试属于有界事实。更广泛结论讨论可选择不同执行环境的 Runtime 中配置权威如何归属；它们不证明完整进程隔离、Secret 不泄露，也不证明所有子进程或集成路径都已覆盖。

```yaml
analysis:
  research_question: "When a durable agent can select different execution environments across turns, which object should own the policy that controls process-environment inheritance and explicit variables?"
  research_question_zh: "当持久化 Agent 可以在不同 Turn 选择不同执行环境时，控制进程环境变量继承与显式变量的策略应由哪个对象拥有？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "EnvironmentConfig now carries ShellEnvironmentPolicy, and its Debug representation redacts that policy because it may contain explicit environment-variable values."
      claim_zh: "EnvironmentConfig 现在携带 ShellEnvironmentPolicy，并因该策略可能包含显式环境变量值而在 Debug 表示中对其进行脱敏。"
      source: "research/reading/Q-20260817-02-per-environment-shell-variable-policy.md"
      strength: "direct merged-code evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Regular shell, user-shell and unified-exec paths build inherited variables and explicit overrides from the selected turn environment's policy, with a session-derived inferred environment configuration as fallback."
      claim_zh: "普通 Shell、User-shell 与 Unified-exec 路径都从已选择 Turn Environment 的策略构建继承变量与显式覆盖；缺少已解析环境时使用 Session 推导的环境配置作为回退。"
      source: "research/reading/Q-20260817-02-per-environment-shell-variable-policy.md"
      strength: "direct merged-code evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "Regression tests deliberately create conflicting thread-level and environment-level policies and show the selected environment controls filtering while environment-owned explicit values survive."
      claim_zh: "回归测试故意构造互相冲突的 Thread-level 与 Environment-level Policy，并证明由已选择环境控制过滤，同时环境自身的显式变量仍被保留。"
      source: "research/reading/Q-20260817-02-per-environment-shell-variable-policy.md"
      strength: "direct regression-test evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "The implementation does not establish complete process isolation, universal subprocess coverage, or secret non-disclosure across command output and other telemetry."
      claim_zh: "该实现不建立完整进程隔离、不证明所有子进程路径均覆盖，也不证明 Secret 不会通过命令输出或其他遥测泄露。"
      source: "research/reading/Q-20260817-02-per-environment-shell-variable-policy.md"
      strength: "direct source limitation"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "When execution environment is selectable per turn, execution-scoped configuration should follow the resolved environment boundary; otherwise the runtime risks split-brain authority in which filesystem/permissions come from one environment while process variables come from another scope."
      claim_zh: "当执行环境可按 Turn 选择时，执行级配置应跟随已解析的环境边界；否则 Runtime 会出现 Split-brain Authority：文件系统/权限来自一个环境，而进程变量策略却来自另一个作用域。"
      source: "E1,E2,E3,E4"
      strength: "bounded architectural interpretation"
      independent: false

  observations:
    - "Policy ownership moved closer to the object that actually supplies execution context."
    - "The fallback remains deterministic rather than reaching unpredictably into thread-global configuration."
    - "Redaction acknowledges that policy objects can themselves contain sensitive values, but it protects only one observability path."
  observations_zh:
    - "策略所有权被移动到真正提供执行上下文的对象附近。"
    - "Fallback 仍保持确定性，而不是在执行时不可预测地回读 Thread-global Configuration。"
    - "Redaction 承认 Policy Object 自身可能含敏感值，但它只保护一个可观测路径。"

  comparisons:
    - "A thread-global policy is simpler but can become stale or semantically wrong when a turn switches to another execution environment."
    - "Passing raw environment maps per command makes policy ownership diffuse and harder to compare across executors."
    - "An environment-owned policy provides one authority boundary shared by multiple execution paths while retaining an explicit fallback when no resolved environment exists."
  comparisons_zh:
    - "Thread-global Policy 更简单，但当某个 Turn 切换执行环境时可能变得陈旧或语义错误。"
    - "逐命令传递原始环境变量 Map 会让策略所有权分散，也更难在不同 Executor 之间比较。"
    - "Environment-owned Policy 为多个执行路径提供统一权威边界，同时在缺少已解析环境时保留显式 Fallback。"

  counterarguments:
    - "A truly immutable thread environment may not need per-environment policy ownership because the thread and execution scopes are identical."
    - "Centralized policy can be desirable when an organization intentionally enforces one global environment rule that subordinate environments cannot override."
    - "Moving policy ownership into EnvironmentConfig does not eliminate the need for higher-level authorization over who may construct or mutate that configuration."
  counterarguments_zh:
    - "如果 Thread Environment 真正不可变，那么 Thread 与 Execution Scope 相同，可能无需环境级策略所有权。"
    - "当组织有意执行一个下级环境不能覆盖的全局环境规则时，集中式 Policy 仍可能合理。"
    - "把 Policy Ownership 移入 EnvironmentConfig 并不会消除更高层对谁有权创建或修改该配置的授权需求。"

  research_judgment: "A runtime that can select execution environments dynamically should bind execution-scoped policy to the resolved environment that owns the work, then define an explicit fallback and merge precedence. This reduces split-brain configuration and makes policy provenance more inspectable across shell implementations. For durable or high-risk work, the environment policy should also carry a stable identity or fingerprint so resume/replay can detect semantic drift; Debug redaction should be treated only as one observability control, not as a confidentiality guarantee."
  research_judgment_zh: "能够动态选择执行环境的 Runtime，应把执行级 Policy 绑定到实际拥有该次工作的已解析环境，并明确规定 Fallback 与 Merge Precedence。这样可以减少 Split-brain Configuration，并让不同 Shell 实现中的策略来源更可检查。对于持久化或高风险工作，还应为 Environment Policy 提供稳定身份或 Fingerprint，使 Resume/Replay 能识别语义漂移；Debug Redaction 只能视为一项可观测性控制，而不能视为保密保证。"

  general_implications:
    - "Execution context should be treated as a configuration-authority boundary, not only as a resource-location descriptor."
    - "Every executor that launches subprocesses should declare whether it consumes the selected environment policy or a separately governed policy."
    - "Durable resume should compare policy identity/fingerprint when environment-variable semantics can affect the safety or reproducibility of work."
    - "Explicit environment values need provenance and authorization because filtering inherited variables does not constrain values deliberately inserted by policy."
    - "Secret protection needs separate controls for storage, logs, command output and downstream process behavior; redacted Debug output covers only one surface."
  general_implications_zh:
    - "Execution Context 应被视为配置权威边界，而不仅是资源位置描述。"
    - "每个会启动子进程的 Executor 都应声明自己消费的是已选择环境策略，还是另一套独立治理策略。"
    - "当环境变量语义会影响工作的安全性或可复现性时，Durable Resume 应比较 Policy Identity/Fingerprint。"
    - "显式环境变量值需要来源与授权证据，因为过滤继承变量并不能约束 Policy 主动写入的值。"
    - "Secret 保护需要分别覆盖存储、日志、命令输出与下游进程行为；Debug 脱敏只覆盖一个表面。"

  limitations:
    - "Evidence comes from one merged runtime implementation and its tests, not an independent isolation benchmark."
    - "Coverage of MCP servers, hooks and other subprocess integrations is unresolved by the selected evidence."
    - "Policy fingerprinting and authority/provenance records are architectural recommendations rather than demonstrated code behavior."
  limitations_zh:
    - "证据来自一个已合并 Runtime 实现及其测试，而不是独立隔离基准。"
    - "MCP Server、Hook 与其他子进程集成是否使用同一策略，当前证据仍未解决。"
    - "Policy Fingerprint 与 Authority/Provenance Record 属于架构建议，并非所选代码已证明的行为。"

  open_questions:
    - "What authority is allowed to populate explicit environment-owned values, especially credential-like material?"
    - "Which integrations bypass the selected environment policy and therefore require their own declared execution-policy boundary?"
    - "How should a resumed task respond when the selected environment identity is stable but its policy fingerprint has changed?"
  open_questions_zh:
    - "谁有权写入环境自身的显式变量，尤其是类似凭据的敏感值？"
    - "哪些集成会绕过已选择环境策略，因此需要声明自己的执行策略边界？"
    - "当恢复任务的 Environment Identity 不变但 Policy Fingerprint 已变化时，应如何处理？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "evidence", "technical-analysis", "architecture-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The conclusion applies generally to runtimes with selectable execution environments and does not require a first-party project example."
    rationale_zh: "该结论普遍适用于可选择执行环境的 Runtime，不需要任何自有项目案例才能成立。"
```

## Bounded judgment / 有界判断

The evidence supports an ownership shift: process-environment policy follows the selected execution environment, avoiding one concrete source of configuration mismatch. The broader lesson is to align configuration authority with the scope that actually executes the work, while keeping fallback, provenance and precedence explicit. This does not turn environment-variable policy into full isolation.

现有证据支持一次明确的所有权迁移：进程环境变量策略跟随已选择执行环境，从而避免一种具体的配置错配。更一般的结论是，配置权威应与真正执行工作的作用域一致，同时把 Fallback、Provenance 与 Precedence 显式化。这并不会把环境变量 Policy 提升为完整隔离机制。
