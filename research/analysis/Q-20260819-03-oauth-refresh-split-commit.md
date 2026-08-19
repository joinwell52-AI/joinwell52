---
schema: "research-analysis/v1"
id: "AN-20260819-03"
date: "2026-08-19"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260819-03"
column: "open-source-engineering"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260819-03-oauth-refresh-persistence-failure-visibility.md"
output_contract: "Research Object"
research_object: "OAuth Refresh as a Split-Commit Reliability Boundary"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — OAuth Refresh as a Split-Commit Reliability Boundary

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-19 Reading Result for Q-20260819-03. The MCP TypeScript SDK merged implementation and tests establish a bounded reliability correction: a successful remote refresh and local token persistence are separated into distinct failure domains, and a persistence rejection now propagates instead of being silently reclassified as a refresh failure that falls through to reauthorization. The broader conclusions below are engineering interpretations; they do not establish distributed transactionality, rollback, exactly-once persistence or universal refresh-token rotation behavior.

本对象仅分析 Q-20260819-03 的 2026-08-19 已完成 Reading Result。MCP TypeScript SDK 的已合并实现与测试建立了一个有界可靠性修正：远端 Refresh 成功与本地 Token Persistence 被分离为不同 Failure Domain，Persistence Rejection 现在会向调用方传播，而不会被静默重分类为 Refresh Failure 后继续进入 Reauthorization。下述更广泛结论属于工程解释；它们不建立分布式 Transactionality、Rollback、Exactly-once Persistence 或通用 Refresh-token Rotation 行为。

```yaml
analysis:
  research_question: "What failure state should an OAuth client expose when the authorization server has successfully issued refreshed credentials but local durable persistence fails afterward?"
  research_question_zh: "当 Authorization Server 已成功签发刷新后的凭据，但本地持久化随后失败时，OAuth Client 应暴露什么 Failure State？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "Before the merged change, refreshAuthorization and provider.saveTokens shared a catch path whose selected refresh failures could fall through to a new authorization request."
      claim_zh: "在该已合并变更之前，refreshAuthorization 与 provider.saveTokens 共用一个 Catch Path，而其中部分 Refresh Failure 会继续进入新的 Authorization Request。"
      source: "research/reading/Q-20260819-03-oauth-refresh-persistence-failure-visibility.md"
      strength: "direct pre-change code-path evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "The new implementation keeps only refreshAuthorization inside the guarded refresh block and invokes provider.saveTokens after a successful refresh on a path whose rejection propagates."
      claim_zh: "新实现仅把 refreshAuthorization 保留在受保护的 Refresh Block 中；Refresh 成功后再调用 provider.saveTokens，其 Rejection 会直接传播。"
      source: "research/reading/Q-20260819-03-oauth-refresh-persistence-failure-visibility.md"
      strength: "direct merged-code evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "A regression test obtains new access and refresh tokens, forces saveTokens to reject with disk full, expects auth to reject with the same persistence error, and verifies that redirectToAuthorization is not called."
      claim_zh: "回归测试先取得新的 Access Token 与 Refresh Token，再让 saveTokens 以 disk full 拒绝；测试要求 auth 传播相同 Persistence Error，并验证 redirectToAuthorization 未被调用。"
      source: "research/reading/Q-20260819-03-oauth-refresh-persistence-failure-visibility.md"
      strength: "direct regression-test evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "Genuine refresh-request failure behavior remains differentiated, and selected deliberate reauthorization paths now emit warnings rather than remaining silent."
      claim_zh: "真正的 Refresh-request Failure 行为仍保持区分，部分有意 Reauthorization 路径现在会发出 Warning，而不再完全静默。"
      source: "research/reading/Q-20260819-03-oauth-refresh-persistence-failure-visibility.md"
      strength: "direct implementation and test evidence"
      independent: false
    - id: "E5"
      identity: "public-fact"
      claim: "The change does not define rollback for partial provider writes, cannot reverse server-side token rotation, and does not add automatic persistence retry, durability acknowledgement, distributed transactionality or exactly-once storage."
      claim_zh: "该变更没有定义 Provider Partial Write 的 Rollback，不能逆转服务器侧 Token Rotation，也没有新增自动 Persistence Retry、Durability Acknowledgement、Distributed Transactionality 或 Exactly-once Storage。"
      source: "research/reading/Q-20260819-03-oauth-refresh-persistence-failure-visibility.md"
      strength: "direct source limitation"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "A successful remote refresh followed by local persistence failure is a split-commit partial-success state, not an ordinary refresh failure; the remote authority and local durable state have advanced differently."
      claim_zh: "远端 Refresh 成功后本地 Persistence 失败，是一种 Split-commit Partial-success State，而不是普通 Refresh Failure；远端 Authority 与本地 Durable State 已发生不同步推进。"
      source: "E1,E2,E3,E5"
      strength: "bounded reliability interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "Fail-visible propagation is primarily an evidence-classification improvement: it preserves the distinction between remote issuance success and local durability failure so recovery can reconcile the actual state instead of starting from a false failure model."
      claim_zh: "Fail-visible Propagation 首先是一种 Evidence-classification 改进：它保留 Remote Issuance Success 与 Local Durability Failure 的区别，使 Recovery 可以基于真实状态做 Reconciliation，而不是从错误 Failure Model 出发。"
      source: "E2,E3,E4,E5"
      strength: "bounded engineering interpretation"
      independent: false

  observations:
    - "The critical boundary is the point after the remote server has produced new credentials but before the client has durably committed them."
    - "A catch block is part of the reliability model: grouping semantically different operations under one recovery branch can erase which side actually succeeded."
    - "Propagating the storage error prevents an automatic redirect from masking a potentially unrecoverable credential-loss condition under rotating-token policies."
    - "Warnings improve operator visibility for deliberate fallback paths, but observability alone does not repair split state."
  observations_zh:
    - "关键边界位于远端 Server 已产生新凭据之后、Client 尚未把它们持久 Commit 之前。"
    - "Catch Block 本身就是 Reliability Model 的一部分：把语义不同的操作放入同一 Recovery Branch，会抹掉究竟哪一侧已经成功。"
    - "传播 Storage Error 可以阻止自动 Redirect 掩盖在 Rotating-token Policy 下可能不可恢复的 Credential-loss Condition。"
    - "Warning 改善了有意 Fallback Path 的 Operator Visibility，但 Observability 本身不能修复 Split State。"

  comparisons:
    - "Treating refresh exchange and persistence as one logical failure domain is simpler but loses the commit boundary between remote issuance and local durability."
    - "Automatically reauthorizing after a persistence fault optimizes forward progress but can hide the actual credential state and may worsen recovery."
    - "Fail-visible propagation preserves state evidence but still leaves the caller responsible for retry, reconciliation or operator intervention."
    - "A true atomic protocol would require coordination across the authorization server and local storage, which this SDK change does not provide."
  comparisons_zh:
    - "把 Refresh Exchange 与 Persistence 当成单一逻辑 Failure Domain 更简单，却丢失 Remote Issuance 与 Local Durability 之间的 Commit Boundary。"
    - "Persistence Fault 后自动 Reauthorize 有利于继续前进，却可能隐藏真实 Credential State 并恶化 Recovery。"
    - "Fail-visible Propagation 保留了状态证据，但 Retry、Reconciliation 或 Operator Intervention 仍由调用方负责。"
    - "真正 Atomic Protocol 需要 Authorization Server 与 Local Storage 之间的协调，而该 SDK 变更并没有提供这种能力。"

  counterarguments:
    - "Some applications may prefer an automatic reauthorization fallback for user experience when local persistence is known to be ephemeral or disposable."
    - "A bounded retry around saveTokens could recover transient I/O faults, but retry safety depends on provider semantics and cannot be assumed universally."
    - "If a provider can prove atomic replace and durable acknowledgement, the local side of the split can be strengthened, but the remote/local transaction still remains non-atomic."
  counterarguments_zh:
    - "当本地 Persistence 明确是临时或可丢弃状态时，部分应用可能为了用户体验而偏好自动 Reauthorization Fallback。"
    - "围绕 saveTokens 的有界 Retry 可能恢复瞬态 I/O Fault，但 Retry Safety 依赖 Provider Semantics，不能通用假设。"
    - "如果 Provider 能证明 Atomic Replace 与 Durable Acknowledgement，本地一侧可以更强，但 Remote/Local Transaction 仍不是原子的。"

  research_judgment: "OAuth refresh should be modeled as a split-commit workflow whenever remote credential issuance and local durable persistence are separate operations. After the remote exchange succeeds, a local persistence failure is a distinct partial-success state that must remain visible; silently treating it as a refresh failure or ordinary redirect destroys evidence needed for safe recovery. The MCP TypeScript SDK change correctly separates those failure domains and preserves the persistence fault, but recovery still needs explicit reconciliation, retry policy or operator handling because the protocol does not provide rollback or distributed atomicity."
  research_judgment_zh: "当远端 Credential Issuance 与本地 Durable Persistence 是不同操作时，OAuth Refresh 应被建模为 Split-commit Workflow。远端 Exchange 成功以后，本地 Persistence Failure 是独立的 Partial-success State，必须保持可见；若静默把它当成 Refresh Failure 或普通 Redirect，会破坏安全 Recovery 所需的状态证据。MCP TypeScript SDK 变更正确分离了这两个 Failure Domain 并保留 Persistence Fault，但 Recovery 仍需要显式 Reconciliation、Retry Policy 或 Operator Handling，因为协议没有提供 Rollback 或 Distributed Atomicity。"

  general_implications:
    - "Any workflow that performs an external authoritative mutation and then persists local state should expose the boundary between external success and local durability."
    - "Recovery logic should branch on evidence of which side committed, not on a single generic exception category."
    - "Fresh external values that may be needed for recovery should have an explicit recovery representation when safe and permitted, rather than being discarded by an overly broad catch."
    - "Durability capability should be part of provider contracts when correctness depends on whether a write was atomic, persisted or merely accepted."
    - "Telemetry should distinguish remote-exchange failure, local-persistence failure, deliberate reauthorization and recovery completion."
  general_implications_zh:
    - "任何先执行外部权威变更、再持久化本地状态的 Workflow，都应暴露 External Success 与 Local Durability 之间的边界。"
    - "Recovery Logic 应根据哪一侧已经 Commit 的证据分支，而不是只依赖单一 Generic Exception Category。"
    - "当安全且被允许时，Recovery 可能需要的 Fresh External Value 应有显式 Recovery Representation，而不是被过宽 Catch 丢弃。"
    - "当正确性依赖 Write 是否 Atomic、Persisted 或仅 Accepted 时，Durability Capability 应进入 Provider Contract。"
    - "Telemetry 应区分 Remote-exchange Failure、Local-persistence Failure、Deliberate Reauthorization 与 Recovery Completion。"

  limitations:
    - "Evidence comes from one merged MCP TypeScript SDK change and its repository tests, not an independent OAuth reliability benchmark."
    - "Provider-specific partial writes, durability guarantees and retry semantics remain outside the demonstrated guarantee."
    - "The server-side consequence depends on the authorization server's refresh-token policy; rotation is not universal."
    - "The change improves failure classification but does not supply a standard recovery object containing the newly issued credentials."
  limitations_zh:
    - "证据来自一个已合并 MCP TypeScript SDK 变更及其仓库测试，而不是独立 OAuth Reliability Benchmark。"
    - "Provider-specific Partial Write、Durability Guarantee 与 Retry Semantics 仍在已演示保证之外。"
    - "服务器侧后果取决于 Authorization Server 的 Refresh-token Policy；Rotation 并非通用行为。"
    - "该变更改善 Failure Classification，但没有提供包含新签发凭据的标准 Recovery Object。"

  open_questions:
    - "Should the SDK expose a structured partial-success error carrying non-secret recovery metadata about remote issuance and local persistence state?"
    - "Can token providers advertise atomicity, durability acknowledgement and safe-retry capabilities in a machine-readable contract?"
    - "What bounded retry policy is safe for transient saveTokens failures without obscuring repeated provider faults?"
    - "How should headless deployments alert operators that server-side rotation may have advanced while local durable credentials did not?"
  open_questions_zh:
    - "SDK 是否应暴露结构化 Partial-success Error，携带关于 Remote Issuance 与 Local Persistence State 的非敏感 Recovery Metadata？"
    - "Token Provider 能否以 Machine-readable Contract 声明 Atomicity、Durability Acknowledgement 与 Safe-retry Capability？"
    - "针对瞬态 saveTokens Failure，什么样的有界 Retry Policy 是安全的，同时不会掩盖重复 Provider Fault？"
    - "Headless Deployment 应如何告警 Operator：Server-side Rotation 可能已推进，而本地 Durable Credential 尚未更新？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence", "technical-analysis", "engineering-implications", "operational-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment concerns a general split-commit reliability boundary for external-state plus local-persistence workflows and does not require a first-party project."
    rationale_zh: "该判断讨论 External State 与 Local Persistence Workflow 的一般 Split-commit Reliability Boundary，不需要引入任何自有项目。"
```

## Bounded judgment / 有界判断

The evidence supports making persistence failure visible after successful remote issuance and treating the state as partially committed rather than simply failed. It does not support claims of rollback, distributed transactionality, exactly-once credential storage or universal token rotation.

现有证据支持在远端签发成功后让 Persistence Failure 保持可见，并把该状态视为 Partial Commit，而不是简单 Failure。它不支持 Rollback、Distributed Transactionality、Exactly-once Credential Storage 或通用 Token Rotation 的主张。
