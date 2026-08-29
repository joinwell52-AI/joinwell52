---
schema: "research-analysis/v1"
id: "AN-20260829-03"
date: "2026-08-29"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260829-03"
column: "open-source-engineering"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260829-03-owned-process-tree-timeout-cancellation-cleanup.md"
output_contract: "Research Object"
research_object: "Bounded Execution Requires Lifecycle Ownership Beyond the Direct Process"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Bounded Execution Requires Lifecycle Ownership Beyond the Direct Process

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-29 Reading Result for Q-20260829-03. The primary evidence is merged Google ADK Python change `fa321f1b49f7bd961b58ad19fd8b8e6fa285b918`, which places a local command in a new POSIX session/process group, uses one shielded `communicate()` drain, shares timeout/cancellation cleanup, and bounds teardown with SIGTERM → grace → SIGKILL → grace before abandoning a still-stuck drain. The bounded conclusion concerns invocation-owned lifecycle cleanup and truthful timeout semantics. It does not claim arbitrary process-tree termination, equivalent non-POSIX behavior, complete output retention, or distributed exactly-once cleanup.

本对象只分析 Q-20260829-03 的 2026-08-29 已完成 Reading Result。一手证据是 Google ADK Python 已合并变更 `fa321f1b49f7bd961b58ad19fd8b8e6fa285b918`：Local Command 被放入新的 POSIX Session/Process Group，整个生命周期只使用一个被 Shield 的 `communicate()` Drain，Timeout 与 Cancellation 共享 Cleanup，并通过 SIGTERM → Grace → SIGKILL → Grace 对 Teardown 本身设定上界；第二次有界等待后仍卡住则放弃 Drain。本对象的有界结论只讨论 Invocation-owned Lifecycle Cleanup 与真实 Timeout Semantics，不声称能终止任意 Process Tree、不声称 Non-POSIX 等价、不声称 Output 完整保留，也不声称分布式 Exactly-once Cleanup。

```yaml
analysis:
  research_questions:
    - id: "RQ1"
      question: "What lifecycle unit should a governed runtime own when one tool invocation can spawn descendant processes?"
      question_zh: "当一次 Tool Invocation 可以派生 Descendant Process 时，受治理 Runtime 应拥有的 Lifecycle Unit 是什么？"
    - id: "RQ2"
      question: "How can timeout and cancellation remain bounded when descendants keep output pipes or cleanup work alive?"
      question_zh: "当 Descendant 继续持有 Output Pipe 或 Cleanup Work 时，Timeout 与 Cancellation 如何仍保持有界？"
    - id: "RQ3"
      question: "What terminal evidence is justified when the owned group is killed but escaped descendants or complete output cannot be proven?"
      question_zh: "当 Owned Group 已被 Kill，但 Escaped Descendant 或完整 Output 无法证明时，什么 Terminal Evidence 才是合理的？"

  research_themes:
    - "task ownership"
    - "bounded recovery"
    - "completion truth"
    - "cancellation semantics"
  subject_kind:
    - "failure-mode"
    - "architecture-mechanism"
    - "governance-problem"
  samples:
    - "Google ADK Python LocalEnvironment POSIX command lifecycle"

  research_value:
    failures:
      - "Direct-PID termination can leave descendants alive after the parent process exits."
      - "A surviving descendant can keep inherited stdout/stderr descriptors open and make cleanup itself wait indefinitely."
      - "Reporting a generic timeout can overstate certainty if cleanup only proves termination of an owned group while escaped descendants remain possible."
    findings:
      - "The demonstrated implementation establishes a new POSIX session/process group for each command and signals that group during timeout/cancellation cleanup."
      - "A single shielded drain spans the command lifecycle so the timeout does not create a second communicate operation."
      - "Cleanup is itself bounded and may sacrifice output completeness after the second grace window instead of hanging indefinitely."
      - "Tests verify that the covered background descendant stops for both timeout and caller cancellation on platforms with process-group support."
    mechanisms:
      - "Invocation-owned POSIX process group"
      - "Single shielded pipe-drain owner"
      - "Shared timeout/cancellation teardown"
      - "SIGTERM then SIGKILL escalation under bounded grace windows"
      - "Explicit abandonment of stuck output after owned teardown bounds are exhausted"
    implications:
      - "A task deadline should govern the lifecycle resources delegated by that task, not only the first process or child object directly returned by an API."
      - "Terminal evidence should distinguish 'owned lifecycle was bounded/terminated' from stronger claims such as 'every descendant and effect is gone'."

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The merged ADK change launches covered local commands with start_new_session=True and uses process-group signaling on POSIX for cleanup."
      claim_zh: "已合并 ADK 变更对已覆盖 Local Command 使用 start_new_session=True，并在 POSIX 上通过 Process-group Signaling 执行 Cleanup。"
      source: "research/reading/Q-20260829-03-owned-process-tree-timeout-cancellation-cleanup.md"
      strength: "merged maintainer source-level evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Timeout and caller cancellation use the same cleanup path, which escalates from SIGTERM to a bounded wait and then SIGKILL to another bounded wait when the drain remains open."
      claim_zh: "Timeout 与 Caller Cancellation 使用同一 Cleanup Path；Drain 仍未关闭时，从 SIGTERM 升级到有界等待，再升级为 SIGKILL 与第二次有界等待。"
      source: "research/reading/Q-20260829-03-owned-process-tree-timeout-cancellation-cleanup.md"
      strength: "implementation evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "If the output drain is still open after the second bounded wait, the implementation cancels the drain and returns without waiting indefinitely; tests verify the covered background heartbeat descendant stops after timeout and cancellation."
      claim_zh: "第二次有界等待后 Output Drain 仍未关闭时，实现会取消 Drain 并返回，而不是无限等待；测试核验了覆盖范围内的 Background Heartbeat Descendant 在 Timeout 与 Cancellation 后停止。"
      source: "research/reading/Q-20260829-03-owned-process-tree-timeout-cancellation-cleanup.md"
      strength: "behavioral regression evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Execution deadlines are governance over an ownership graph: if a command is allowed to delegate work to descendants, those descendants remain part of the invocation's lifecycle responsibility until an explicit handoff or bounded terminal condition."
      claim_zh: "Execution Deadline 本质上是在治理 Ownership Graph：如果 Command 被允许把工作委派给 Descendant，那么在出现显式 Handoff 或有界 Terminal Condition 前，这些 Descendant 仍属于原 Invocation 的 Lifecycle Responsibility。"
      source: "E1,E2,E3"
      strength: "bounded lifecycle-governance interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "A bounded timeout result should report what was actually proven—such as termination of the owned process group and whether cleanup escalated or output was abandoned—rather than implying all transitive processes or external effects are known to be gone."
      claim_zh: "有界 Timeout Result 应报告真正被证明的事实，例如 Owned Process Group 已终止、Cleanup 是否升级、Output 是否被放弃，而不应暗示所有 Transitive Process 或 External Effect 都已确认消失。"
      source: "E1,E2,E3"
      strength: "completion-evidence interpretation"
      independent: false

  observations:
    - "The key ownership expansion is from one PID to an invocation-owned process group; this matches the delegated lifecycle more closely than direct-child semantics."
    - "The single shielded drain prevents timeout from fragmenting output ownership across multiple communicate operations."
    - "Cleanup has its own deadline. Without that second-order bound, a 'timed out' command can still make the caller wait forever in teardown."
    - "Output completeness and lifecycle boundedness are intentionally traded off when escaped descendants keep descriptors open."
  observations_zh:
    - "关键 Ownership 扩展是从一个 PID 扩展到 Invocation-owned Process Group，这比 Direct-child Semantics 更接近真实 Delegated Lifecycle。"
    - "单一 Shielded Drain 防止 Timeout 把 Output Ownership 分裂到多个 communicate Operation。"
    - "Cleanup 自己也有 Deadline；如果没有这层 Second-order Bound，一个“已经 Timeout”的 Command 仍可能让 Caller 永远卡在 Teardown。"
    - "当 Escaped Descendant 继续持有 Descriptor 时，系统明确在 Output Completeness 与 Lifecycle Boundedness 之间做取舍。"

  comparisons:
    - "Direct-child kill models ownership as the returned PID; process-group cleanup models ownership as the invocation's delegated local process domain."
    - "Waiting forever for all pipes maximizes output completeness but violates deadline semantics; abandoning a stuck drain preserves boundedness while weakening evidence completeness."
    - "Cancellation that simply rethrows abandons owned work; cancellation that first performs bounded teardown preserves the parent's lifecycle responsibility before propagating control flow."
  comparisons_zh:
    - "Direct-child Kill 把 Ownership 建模成返回的 PID；Process-group Cleanup 把 Ownership 建模成 Invocation 委派出的 Local Process Domain。"
    - "无限等待所有 Pipe 能最大化 Output Completeness，但违反 Deadline Semantics；放弃 Stuck Drain 能保留 Boundedness，同时降低 Evidence Completeness。"
    - "直接 Re-throw 的 Cancellation 会抛弃 Owned Work；先执行 Bounded Teardown 再传播 Cancellation，则先履行 Parent 的 Lifecycle Responsibility。"

  contradictions:
    - "The commit title says 'whole process tree', but the demonstrated guarantee is the owned POSIX process group; a descendant can escape by creating a new session/group."
    - "The mechanism bounds cleanup even when output cannot be completely collected, so a terminal timeout can be operationally correct while forensic evidence is incomplete."
  contradictions_zh:
    - "Commit Title 使用“whole process tree”，但已证明 Guarantee 实际是 Owned POSIX Process Group；Descendant 可以通过创建新 Session/Group 逃逸。"
    - "即使 Output 无法完整收集，该机制仍会让 Cleanup 有界，因此 Terminal Timeout 可以在 Operational 上正确，同时 Forensic Evidence 不完整。"

  counterarguments:
    - "Some tools intentionally daemonize or hand off long-lived work. In those cases the ownership transfer should be explicit; otherwise the parent deadline cannot distinguish a leak from a legitimate detached service."
    - "A fixed five-second grace period may be too long or too short for different command classes; policy-driven bounds may be preferable."
    - "Process-group ownership is host-specific. Containers, Windows and remote execution need equivalent ownership abstractions rather than assuming POSIX semantics generalize."
  counterarguments_zh:
    - "有些 Tool 会有意 Daemonize 或 Handoff Long-lived Work；此时 Ownership Transfer 应显式发生，否则 Parent Deadline 无法区分 Leak 与合法 Detached Service。"
    - "固定五秒 Grace Period 对不同 Command Class 可能过长或过短；Policy-driven Bound 可能更合适。"
    - "Process-group Ownership 是 Host-specific；Container、Windows 与 Remote Execution 需要等价 Ownership Abstraction，而不能假定 POSIX Semantics 自动泛化。"

  research_judgment: "Bounded execution should follow lifecycle ownership rather than direct-object identity. The ADK evidence demonstrates a concrete local POSIX pattern: establish an invocation-owned process group before execution, keep one output-drain owner, make timeout and cancellation share teardown, and bound teardown itself with graceful and forced phases. This closes the demonstrated descendant/pipeline hang while preserving truthful boundaries: the runtime can claim bounded cleanup of the owned group, but it cannot claim that escaped descendants, non-POSIX trees or external side effects are certainly gone. For governed Agent tools, terminal evidence should expose that distinction rather than collapsing all cleanup into a generic timeout flag."
  research_judgment_zh: "Bounded Execution 应沿 Lifecycle Ownership，而不是沿 Direct-object Identity。ADK 证据展示了一种具体 Local POSIX Pattern：执行前建立 Invocation-owned Process Group，Output 只保留一个 Drain Owner，让 Timeout 与 Cancellation 共享 Teardown，并用 Graceful + Forced 两阶段给 Teardown 本身设定上界。它关闭了已证明的 Descendant/Pipe Hang，同时保留真实边界：Runtime 可以声称 Owned Group 的 Cleanup 已有界，但不能声称 Escaped Descendant、Non-POSIX Tree 或 External Side Effect 都确定消失。对于受治理 Agent Tool，Terminal Evidence 应暴露这种区别，而不是把所有 Cleanup 压成一个 Generic Timeout Flag。"

  general_implications:
    - "Agent tool runtimes should define an explicit ownership domain for subprocesses, sandboxes, containers or remote jobs created by one invocation."
    - "Cancellation should not release the parent from cleanup responsibility until owned resources are terminal or explicitly handed off."
    - "Cleanup should have a bounded policy of its own, including escalation and a terminal outcome for incomplete evidence/output."
    - "Receipts should distinguish direct-process exit, owned-domain termination, forced escalation, escaped-resource uncertainty and output abandonment where these states matter."
  general_implications_zh:
    - "Agent Tool Runtime 应为一次 Invocation 创建的 Subprocess、Sandbox、Container 或 Remote Job 定义显式 Ownership Domain。"
    - "在 Owned Resource 进入 Terminal 或显式 Handoff 前，Cancellation 不应解除 Parent 的 Cleanup Responsibility。"
    - "Cleanup 应有自己的有界 Policy，包括 Escalation，以及 Evidence/Output 不完整时的 Terminal Outcome。"
    - "当这些状态重要时，Receipt 应区分 Direct-process Exit、Owned-domain Termination、Forced Escalation、Escaped-resource Uncertainty 与 Output Abandonment。"

  limitations:
    - "The whole-owned-tree behavior is demonstrated only on POSIX systems with process-group support; the relevant tests skip without os.killpg."
    - "Escaped descendants can survive the owned group and may continue to hold resources or effects."
    - "The bounded fallback can return incomplete or empty output."
    - "The evidence does not cover Windows Job Objects, containers, remote jobs, daemonization or distributed effect cleanup."
  limitations_zh:
    - "Whole-owned-tree Behavior 只在支持 Process Group 的 POSIX 系统上得到证明；没有 os.killpg 时相关测试会 Skip。"
    - "Escaped Descendant 可以脱离 Owned Group，继续持有 Resource 或 Effect。"
    - "Bounded Fallback 可能返回不完整甚至空 Output。"
    - "证据没有覆盖 Windows Job Object、Container、Remote Job、Daemonization 或 Distributed Effect Cleanup。"

  open_questions:
    - "What host-neutral ownership abstraction should unify POSIX process groups, Windows Job Objects, containers and remote execution leases?"
    - "Should escaped descendants become a typed Failed/Partial terminal condition instead of only a warning?"
    - "How should grace windows be selected by risk, command class or resource type?"
    - "Which cleanup facts should be persisted so later retry/recovery logic does not confuse bounded local teardown with external-effect certainty?"
  open_questions_zh:
    - "什么 Host-neutral Ownership Abstraction 可以统一 POSIX Process Group、Windows Job Object、Container 与 Remote Execution Lease？"
    - "Escaped Descendant 是否应成为 Typed Failed/Partial Terminal Condition，而不只是 Warning？"
    - "Grace Window 应如何按 Risk、Command Class 或 Resource Type 选择？"
    - "哪些 Cleanup Fact 应持久化，才能避免后续 Retry/Recovery 把 Bounded Local Teardown 与 External-effect Certainty 混淆？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence", "technical-analysis", "engineering-implications", "operational-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The conclusion is a general lifecycle-ownership and bounded-cleanup engineering pattern and does not require first-party project mapping."
    rationale_zh: "该结论属于通用 Lifecycle-ownership 与 Bounded-cleanup Engineering Pattern，不需要映射自有项目。"
```

## Bounded judgment / 有界判断

A deadline is truthful only if the runtime can bound the resources it actually owns after that deadline fires. **Ownership must follow delegated work far enough to close the invocation lifecycle, while terminal evidence must remain narrower than what cleanup cannot prove.**

只有当 Deadline 触发后，Runtime 仍能对自己实际拥有的 Resource 施加边界，这个 Deadline 才是真实的。**Ownership 必须沿 Delegated Work 延伸到足以收口 Invocation Lifecycle；而 Terminal Evidence 必须严格限制在 Cleanup 真正能证明的范围内。**
