---
schema: "research-analysis/v1"
id: "AN-20260817-01"
date: "2026-08-17"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260817-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260817-01-fail-closed-obsolete-permission-field-rejection.md"
output_contract: "Research Object"
research_object: "Security-Significant Schema Retirement as a Fail-Closed Compatibility Exception"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Security-Significant Schema Retirement as a Fail-Closed Compatibility Exception

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-17 Reading Result for Q-20260817-01. The merged Codex app-server code and tests are bounded implementation facts. The broader governance conclusions are interpretations about forward-compatible agent APIs and digital-employee control planes; they do not establish end-to-end authorization safety, caller identity, policy provenance, or complete coverage of every permission-bearing path.

本对象仅分析 Q-20260817-01 的 2026-08-17 已完成 Reading Result。Codex App-server 的已合并代码与测试属于有界实现事实。更广泛的治理结论属于对前向兼容 Agent API 与数字员工控制面的架构解释；它们不构成端到端授权安全、调用者身份、策略来源或所有权限承载路径完整覆盖的证明。

```yaml
analysis:
  research_question: "How should a forward-compatible agent API retire a field when silently ignoring that field would change the caller's authorization meaning?"
  research_question_zh: "当一个字段被静默忽略会改变调用者所理解的授权语义时，前向兼容的 Agent API 应如何安全退役该字段？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The merged app-server change explicitly rejects the removed permissionProfile field before permissive request deserialization on thread/start, thread/resume, thread/fork and turn/start."
      claim_zh: "已合并的 App-server 变更会在宽松请求反序列化之前，对 thread/start、thread/resume、thread/fork 与 turn/start 上已移除的 permissionProfile 字段进行显式拒绝。"
      source: "research/reading/Q-20260817-01-fail-closed-obsolete-permission-field-rejection.md"
      strength: "direct merged-code and regression-test evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Unrelated unknown fields remain accepted for forward compatibility, valid named permissions still work, and repeated obsolete-field rejection does not poison the connection."
      claim_zh: "无关未知字段仍为前向兼容而被接受，有效的命名 permissions 仍可正常工作，多次拒绝过时字段也不会使连接失效。"
      source: "research/reading/Q-20260817-01-fail-closed-obsolete-permission-field-rejection.md"
      strength: "direct merged-code and test evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The demonstrated mechanism is bounded to four app-server methods and does not authenticate callers or approvers, prove policy provenance, or establish end-to-end authorization safety."
      claim_zh: "已证明的机制仅限于四个 App-server 方法，不会认证调用者或审批者身份，不会证明策略来源，也不建立端到端授权安全。"
      source: "research/reading/Q-20260817-01-fail-closed-obsolete-permission-field-rejection.md"
      strength: "direct source limitation"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Schema compatibility and authorization-semantic compatibility are different concerns: a field may be structurally safe to ignore yet semantically unsafe to ignore when its absence changes security expectations."
      claim_zh: "Schema Compatibility 与授权语义兼容是不同问题：某字段在结构上可以安全忽略，但如果字段缺失会改变安全预期，那么在语义上就不能被安全忽略。"
      source: "E1,E2,E3"
      strength: "bounded architectural interpretation"
      independent: false

  observations:
    - "The change preserves generic unknown-field tolerance while carving out one security-significant retirement exception."
    - "The migration error names the supported replacement instead of silently translating or dropping the obsolete state."
    - "The rejection is request-local, so fail-closed migration need not imply connection-level failure."
  observations_zh:
    - "该变更保留通用未知字段容忍，同时为一个具有安全语义的退役字段划出明确例外。"
    - "迁移错误明确指出受支持的替代方式，而不是静默翻译或丢弃过时状态。"
    - "拒绝是请求级局部失败，因此失败关闭迁移不必等同于连接级失败。"

  comparisons:
    - "Rejecting every unknown field maximizes schema strictness but sacrifices forward compatibility."
    - "Ignoring every unknown field maximizes compatibility but can silently erase security-significant intent."
    - "Targeted fail-closed retirement keeps the general compatibility rule while requiring explicit handling for semantically dangerous removals."
  comparisons_zh:
    - "拒绝所有未知字段会最大化 Schema 严格性，但牺牲前向兼容。"
    - "忽略所有未知字段会最大化兼容性，却可能静默抹除具有安全意义的调用意图。"
    - "定向失败关闭退役保留一般兼容规则，同时要求对具有语义风险的字段移除进行显式处理。"

  counterarguments:
    - "A fully versioned strict schema can avoid per-field retirement exceptions if every client and server advances in lockstep."
    - "For low-risk metadata, silent ignore may remain the correct forward-compatibility choice."
    - "A compatibility shim that translates an old field can be useful during a controlled migration when semantic equivalence is provable."
  counterarguments_zh:
    - "如果所有客户端与服务端都严格同步升级，完整版本化的严格 Schema 可以减少逐字段退役例外。"
    - "对低风险元数据，静默忽略仍可能是正确的前向兼容选择。"
    - "如果能够证明新旧语义等价，受控迁移期的兼容翻译层也可能合理。"

  research_judgment: "Forward-compatible agent APIs should treat security-significant schema retirement as an explicit compatibility exception. Generic unknown-field tolerance can remain, but a removed field whose silent loss would change authorization or execution expectations should be registered, rejected before permissive decoding, paired with a migration path, and observable as stale-client behavior. This is a schema-governance pattern, not a substitute for end-to-end authorization controls."
  research_judgment_zh: "前向兼容的 Agent API 应把具有安全意义的 Schema 退役视为显式兼容例外。通用未知字段容忍可以继续存在，但对于静默丢失会改变授权或执行预期的退役字段，应进行登记、在宽松解码前拒绝、提供明确迁移路径，并把它作为陈旧客户端行为纳入可观测性。它是一种 Schema Governance 模式，而不是端到端授权控制的替代品。"

  general_implications:
    - "API governance should classify retired fields by semantic risk rather than treating all unknown fields identically."
    - "Security-significant field retirement benefits from an explicit registry containing affected methods, replacement semantics, effective version and telemetry expectations."
    - "Resume, fork and turn lifecycle boundaries deserve special review because stale authorization fields can survive across durable work transitions."
    - "Fail-closed compatibility errors should preserve service availability when the invalid request itself can be safely isolated."
  general_implications_zh:
    - "API 治理应按语义风险分类退役字段，而不是把所有未知字段视为同一类型。"
    - "具有安全意义的字段退役适合进入显式登记表，记录受影响方法、替代语义、生效版本与遥测要求。"
    - "Resume、Fork 与 Turn 生命周期边界应被重点审查，因为陈旧授权字段可能跨持久化工作转换继续存在。"
    - "当无效请求可以安全隔离时，失败关闭兼容错误应尽量保持服务连接可用。"

  limitations:
    - "Evidence is one merged implementation and its tests, not an independent cross-platform evaluation."
    - "The selected change does not prove complete coverage of every permission-bearing API path."
    - "The proposed retirement registry and telemetry rules are architectural recommendations, not demonstrated behavior of the selected code."
  limitations_zh:
    - "证据来自一个已合并实现及其测试，而不是独立的跨平台评估。"
    - "所选变更没有证明所有权限承载 API 路径均被完整覆盖。"
    - "本文提出的退役登记表与遥测规则属于架构建议，并非所选代码已经证明的行为。"

  open_questions:
    - "Which schema changes should be classified as security-significant enough to require fail-closed retirement?"
    - "How should stale-client telemetry be linked to client version and migration deadlines without leaking sensitive request content?"
    - "Can policy/profile versions be returned in success responses so resumed work can prove which authorization representation actually applied?"
  open_questions_zh:
    - "哪些 Schema 变化应被分类为足够重要的安全语义变化，从而必须采用失败关闭退役？"
    - "如何把陈旧客户端遥测关联到客户端版本和迁移期限，同时避免泄露敏感请求内容？"
    - "成功响应是否应返回 Policy/Profile 版本，使恢复任务能够证明实际采用了哪一种授权表示？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence", "technical-analysis", "governance-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment concerns general API compatibility and authorization semantics; no first-party project is needed to establish it."
    rationale_zh: "该判断讨论一般 API 兼容与授权语义，不需要引入任何自有项目才能成立。"
```

## Bounded judgment / 有界判断

Forward compatibility is not a single yes/no property. An API can remain structurally permissive while becoming selectively strict when ignoring one retired field would erase security meaning. The evidence supports that narrower pattern; it does not support a claim that the surrounding authorization system is therefore secure end to end.

前向兼容不是单一的“允许/拒绝”属性。API 可以在结构上继续宽松，同时在忽略某个退役字段会抹除安全语义时进行选择性严格处理。现有证据支持这一较窄模式，但不能据此声称外围授权系统已经获得端到端安全保证。
