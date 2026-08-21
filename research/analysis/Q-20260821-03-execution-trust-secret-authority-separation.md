---
schema: "research-analysis/v1"
id: "AN-20260821-03"
date: "2026-08-21"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260821-03"
column: "open-source-engineering"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260821-03-mcp-helper-trust-credential-isolation.md"
output_contract: "Research Object"
research_object: "Execution Trust and Secret Authority Are Separate Capabilities"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Execution Trust and Secret Authority Are Separate Capabilities

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-21 Reading Result for Q-20260821-03. Published Claude Code v2.1.238 material establishes two distinct controls around MCP helper execution: project/agent-controlled helper execution is gated by workspace trust, while project `.mcp.json`, plugin and agent-file `headersHelper` commands are documented as running without inherited credential environment variables. Official documentation establishes that `headersHelper` is shell execution used to generate connection headers. Public material does not expose the exact credential-variable filter, implementation code, complete precedence/cwd matrix or a sandbox guarantee.

本对象仅分析 Q-20260821-03 的 2026-08-21 已完成 Reading Result。Claude Code v2.1.238 的公开材料建立了 MCP Helper Execution 周围两个不同控制：Project/Agent 控制的 Helper Execution 受 Workspace Trust 门禁约束，而 Project `.mcp.json`、Plugin 与 Agent-file 的 `headersHelper` 被说明为在不继承 Credential Environment Variables 的情况下运行。官方文档确认 `headersHelper` 是用于生成连接 Header 的 Shell Execution。公开材料没有披露准确 Credential-variable Filter、实现代码、完整 Precedence/CWD Matrix 或 Sandbox Guarantee。

```yaml
analysis:
  research_question: "When repository- or plugin-supplied configuration can execute a helper, how should an engineering runtime separate authority to execute code from authority to inherit ambient credentials and other host capabilities?"
  research_question_zh: "当 Repository 或 Plugin 提供的配置可以执行 Helper 时，工程 Runtime 应如何分离 Code Execution Authority 与继承 Ambient Credential 及其他 Host Capability 的 Authority？"

  evidence_claims:
    - id: "E1"
      identity: "source-reported-claim"
      claim: "Claude Code v2.1.238 release notes state that project .mcp.json headersHelper and inline MCP servers in project or --add-dir agent files require the corresponding folder trust to be accepted, including under claude -p."
      claim_zh: "Claude Code v2.1.238 Release Note 声明：Project .mcp.json headersHelper 与 Project 或 --add-dir Agent File 中的 Inline MCP Server 必须先接受对应 Folder Trust，包括 claude -p。"
      source: "research/reading/Q-20260821-03-mcp-helper-trust-credential-isolation.md"
      strength: "authoritative release documentation; implementation not public in selected commit"
      independent: false
    - id: "E2"
      identity: "source-reported-claim"
      claim: "The same release notes state that project .mcp.json, plugin and agent-file headersHelper commands run without inherited credential environment variables."
      claim_zh: "同一 Release Note 声明 Project .mcp.json、Plugin 与 Agent-file headersHelper 在不继承 Credential Environment Variables 的情况下运行。"
      source: "research/reading/Q-20260821-03-mcp-helper-trust-credential-isolation.md"
      strength: "authoritative release documentation; exact filter not publicly disclosed"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "Official MCP documentation describes headersHelper as arbitrary shell execution whose JSON output becomes connection headers and documents workspace trust for project/local helpers."
      claim_zh: "官方 MCP 文档把 headersHelper 描述为任意 Shell Execution，其 JSON Output 会成为 Connection Header，并记录 Project/Local Helper 的 Workspace Trust 要求。"
      source: "research/reading/Q-20260821-03-mcp-helper-trust-credential-isolation.md"
      strength: "official documentation"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "Official documentation exposes purpose-specific helper variables such as server name and URL, showing that helper context can be supplied explicitly rather than relying solely on broad parent-process inheritance."
      claim_zh: "官方文档公开 Server Name、URL 等 Purpose-specific Helper Variable，说明 Helper Context 可以显式提供，而不必完全依赖宽泛的 Parent-process Inheritance。"
      source: "research/reading/Q-20260821-03-mcp-helper-trust-credential-isolation.md"
      strength: "official documentation"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Workspace trust should be treated as code-admission authority, not as a blanket grant of ambient credential or host-resource authority."
      claim_zh: "Workspace Trust 应被视为 Code-admission Authority，而不是对 Ambient Credential 或 Host Resource Authority 的全面授权。"
      source: "E1,E2,E3,E4"
      strength: "bounded capability-security interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "A safer helper contract combines origin-aware execution admission with least-authority runtime context: explicit task inputs and intentionally granted capabilities replace accidental authority inherited from the launcher."
      claim_zh: "更安全的 Helper Contract 应把 Origin-aware Execution Admission 与 Least-authority Runtime Context 组合起来：通过显式 Task Input 与有意授予的 Capability，替代从 Launcher 偶然继承的 Authority。"
      source: "E1,E2,E3,E4"
      strength: "bounded engineering interpretation"
      independent: false

  observations:
    - "The two controls solve different questions: whether repository-controlled code may run, and what authority that code receives after admission."
    - "A trusted workspace can still contain malicious or overly broad helper logic, so trust acceptance is not a sandbox or benign-code proof."
    - "Credential-environment filtering reduces one ambient-authority channel but does not establish filesystem, network, keychain or process isolation."
    - "Purpose-specific environment variables demonstrate a design direction where required context is passed explicitly while unrelated authority is withheld."
  observations_zh:
    - "两个控制解决不同问题：Repository-controlled Code 是否可以运行，以及代码获准运行后拥有什么 Authority。"
    - "Trusted Workspace 仍可能包含恶意或过宽 Helper Logic，因此 Trust Acceptance 不是 Sandbox，也不是 Benign-code Proof。"
    - "Credential-environment Filtering 只减少一个 Ambient-authority Channel，并没有建立 Filesystem、Network、Keychain 或 Process Isolation。"
    - "Purpose-specific Environment Variable 展示了一种设计方向：显式传入必需 Context，同时扣留无关 Authority。"

  comparisons:
    - "Trust-only admission prevents untrusted repository execution but still risks over-authorizing trusted helpers through inherited credentials."
    - "Environment sanitization without trust admission limits one secret channel but can still permit untrusted repository code to execute."
    - "A two-gate model separates code origin/admission from runtime capability grants and can be extended with sandbox, filesystem or network capabilities when required."
  comparisons_zh:
    - "只有 Trust Admission 可以阻止未受信 Repository Execution，却仍可能通过 Credential Inheritance 过度授权已受信 Helper。"
    - "只有 Environment Sanitization 可以限制一个 Secret Channel，却仍可能允许未受信 Repository Code 执行。"
    - "双门禁模型分离 Code Origin/Admission 与 Runtime Capability Grant，并可在需要时进一步扩展 Sandbox、Filesystem 或 Network Capability。"

  counterarguments:
    - "Aggressive credential stripping can break legitimate helpers that previously relied on ambient configuration and may increase operational complexity."
    - "Workspace trust can be an acceptable coarse boundary for low-risk local tooling when the user intentionally controls the repository and host."
    - "A full sandbox may be disproportionate for every helper; capability controls should match the effect and secret sensitivity of the task."
  counterarguments_zh:
    - "激进 Credential Stripping 可能破坏以前依赖 Ambient Configuration 的合法 Helper，并提高运维复杂度。"
    - "当用户有意控制 Repository 与 Host 时，Workspace Trust 对低风险本地 Tooling 可能是可接受的粗粒度边界。"
    - "对每个 Helper 使用完整 Sandbox 可能成本过高；Capability Control 应匹配 Task 的 Effect 与 Secret Sensitivity。"

  research_judgment: "Executable configuration should be governed by at least two separate capabilities: authority to execute the helper and authority to receive secrets or other ambient host capabilities. Workspace trust can satisfy a code-admission decision for repository-controlled helpers, but it should not implicitly authorize inherited credentials. Credential-environment filtering is therefore a least-authority control, not a sandbox; stronger isolation requires separate evidence for filesystem, network, process and external-effect boundaries."
  research_judgment_zh: "Executable Configuration 至少应由两个独立 Capability 治理：执行 Helper 的 Authority，以及接收 Secret 或其他 Ambient Host Capability 的 Authority。Workspace Trust 可以满足 Repository-controlled Helper 的 Code-admission Decision，但不应隐式授权 Inherited Credential。因此 Credential-environment Filtering 是 Least-authority Control，而不是 Sandbox；更强 Isolation 需要对 Filesystem、Network、Process 与 External-effect Boundary 提供独立 Evidence。"

  general_implications:
    - "Agent runtimes should model executable configuration as code, with origin, trust state and execution authority recorded explicitly."
    - "Child processes should receive allowlisted task context and capabilities instead of inheriting the complete parent environment by default."
    - "Secret-access policy should be independently reviewable from workspace-trust policy because the two decisions have different blast radii."
    - "Capability denial should fail visibly so missing credentials are not silently mistaken for remote authentication or network failures."
    - "If helpers can access files, network or credential stores outside environment variables, those channels need their own policy and evidence."
  general_implications_zh:
    - "Agent Runtime 应把 Executable Configuration 当作 Code，并显式记录 Origin、Trust State 与 Execution Authority。"
    - "Child Process 默认应接收 Allowlisted Task Context 与 Capability，而不是完整继承 Parent Environment。"
    - "Secret-access Policy 应与 Workspace-trust Policy 独立评审，因为两类决策的 Blast Radius 不同。"
    - "Capability Denial 应 Fail-visible，避免缺少 Credential 被静默误判为远端 Authentication 或 Network Failure。"
    - "如果 Helper 还可通过 Environment Variable 之外的 Filesystem、Network 或 Credential Store 获取能力，这些 Channel 需要独立 Policy 与 Evidence。"

  limitations:
    - "The selected public commit publishes release notes rather than the product implementation diff."
    - "The exact stripped credential-variable list and regression-test matrix are not public in the material read."
    - "Environment filtering does not prove sandboxing or prevent secrets from being acquired through other host resources."
    - "The evidence does not establish a complete helper precedence or cwd matrix for every scope."
  limitations_zh:
    - "所选公开提交发布的是 Release Note，而不是 Product Implementation Diff。"
    - "准确 Stripped Credential-variable List 与 Regression-test Matrix 在已读公开材料中不可见。"
    - "Environment Filtering 不证明 Sandboxing，也不能阻止通过其他 Host Resource 获得 Secret。"
    - "证据没有建立所有 Scope 的完整 Helper Precedence 或 CWD Matrix。"

  open_questions:
    - "What exact credential classification is stripped, and how is it maintained as providers change?"
    - "Should helpers declare required secret, filesystem and network capabilities before execution?"
    - "How should trust be invalidated when repository identity, path ownership or helper content changes?"
    - "What machine-readable error distinguishes denied capability from helper failure or remote authentication failure?"
  open_questions_zh:
    - "准确被剥离的 Credential Classification 是什么，Provider 变化时如何维护？"
    - "Helper 是否应在执行前声明所需 Secret、Filesystem 与 Network Capability？"
    - "Repository Identity、Path Ownership 或 Helper Content 改变时，Trust 应如何失效？"
    - "什么 Machine-readable Error 可以区分 Capability Denied、Helper Failure 与 Remote Authentication Failure？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence", "technical-analysis", "engineering-implications", "governance-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The conclusion is a general capability-security pattern for executable configuration and agent tooling; no first-party project is required."
    rationale_zh: "该结论属于 Executable Configuration 与 Agent Tooling 的一般 Capability-security Pattern，不需要引入自有项目。"
```

## Bounded judgment / 有界判断

The central engineering rule is **trust to execute is not authority to inherit secrets**. A runtime can accept repository-controlled code for execution while still withholding unrelated ambient capabilities. The published evidence supports that two-boundary model, but it does not establish the exact filtering implementation or broader sandbox isolation.

核心工程规则是：**Trust to Execute 不等于 Authority to Inherit Secrets**。Runtime 可以允许 Repository-controlled Code 执行，同时继续扣留与任务无关的 Ambient Capability。公开证据支持这种双边界模型，但没有建立准确 Filtering Implementation 或更广泛的 Sandbox Isolation。
