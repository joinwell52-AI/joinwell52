---
schema: "research-analysis/v1"
id: "AN-20260826-02"
date: "2026-08-26"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260826-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260826-02-mcp-attachment-owned-permission-authority.md"
output_contract: "Research Object"
research_object: "Permission Authority Should Follow the Lifecycle Scope It Governs"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Permission Authority Should Follow the Lifecycle Scope It Governs

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-26 Reading Result for Q-20260826-02. The primary evidence is the Codex issue/maintainer-fix pair documented there: changing authorization for one custom-app runtime could erase tool visibility for an MCP server attached through a different native-app context, and the merged fix moved MCP manager ownership from a broad AppServer scope to per-runtime AppSession ownership while avoiding whole-manager replacement on a single authorization completion. The conclusion is bounded to runtime/session ownership of permission and connected-server state; it does not establish distributed consistency, durable snapshots, generic race freedom or exactly-once authorization.

本对象仅分析 Q-20260826-02 的 2026-08-26 已完成 Reading Result。一手证据是其中已核验的 Codex Issue/维护者修复组合：一个 Custom-app Runtime 的授权变化可能擦除另一个 Native-app Context 所附加 MCP Server 的 Tool Visibility；已合并修复把 MCP Manager Ownership 从宽泛的 AppServer Scope 移到 Per-runtime AppSession，并避免单个 Authorization 完成后替换整个 Manager。结论仅限于 Permission 与 Connected-server State 的 Runtime/Session Ownership；不能据此推出分布式一致性、Durable Snapshot、通用 Race Freedom 或 Exactly-once Authorization。

```yaml
analysis:
  research_question: "Where should authoritative permission and connected-tool state live when multiple app/runtime contexts coexist, so refreshing one context cannot erase another context's valid authority?"
  research_question_zh: "当多个 App/Runtime Context 共存时，权威 Permission 与 Connected-tool State 应归属于哪里，才能避免一个 Context 的 Refresh 擦除另一个 Context 的有效 Authority？"

  evidence_claims:
    - id: "E1"
      identity: "source-reported-claim"
      claim: "The reported failure showed that changing permissions on a custom app could cause an MCP server attached through the native app to become 'No tools available'."
      claim_zh: "报告的故障显示，对 Custom App 修改 Permission 后，通过 Native App 附加的 MCP Server 可能变成 ‘No tools available’。"
      source: "research/reading/Q-20260826-02-mcp-attachment-owned-permission-authority.md"
      strength: "primary issue report"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "The merged maintainer fix moved MCP manager ownership from AppServer to per-runtime AppSession state."
      claim_zh: "已合并维护者修复把 MCP Manager Ownership 从 AppServer 移到 Per-runtime AppSession State。"
      source: "research/reading/Q-20260826-02-mcp-attachment-owned-permission-authority.md"
      strength: "direct merged implementation evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The fix stopped replacing the entire manager when one authorization operation completed and moved connected-server queries to session-owned state."
      claim_zh: "修复停止在单个 Authorization 操作完成时替换整个 Manager，并把 Connected-server Query 移到 Session-owned State。"
      source: "research/reading/Q-20260826-02-mcp-attachment-owned-permission-authority.md"
      strength: "direct ownership/refactor evidence"
      independent: false
    - id: "E4"
      identity: "source-reported-claim"
      claim: "The issue reporter indicated that the observed problem was fixed after the change."
      claim_zh: "Issue 报告者在变更后表示所观察问题已经修复。"
      source: "research/reading/Q-20260826-02-mcp-attachment-owned-permission-authority.md"
      strength: "reporter confirmation, not exhaustive validation"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Permission state is an authority object whose ownership scope should match the lifecycle scope of the attachment/runtime it governs; a broader mutable manager lets unrelated refreshes become accidental authority revocations."
      claim_zh: "Permission State 是 Authority Object，其 Ownership Scope 应匹配它所治理 Attachment/Runtime 的 Lifecycle Scope；过宽且可变的 Manager 会让无关 Refresh 变成意外 Authority Revocation。"
      source: "E1,E2,E3"
      strength: "bounded authority-ownership interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "Per-session ownership narrows replacement blast radius but does not itself prove race-free authorization, durable permission persistence, cross-process consistency or exactly-once updates."
      claim_zh: "Per-session Ownership 缩小了 Replacement Blast Radius，但本身不能证明 Race-free Authorization、Durable Permission Persistence、Cross-process Consistency 或 Exactly-once Update。"
      source: "E2,E3,E4"
      strength: "evidence-boundary interpretation"
      independent: false

  observations:
    - "The key architectural defect was not simply stale UI state; a mutation in one runtime scope could replace authority-bearing state used by another scope."
    - "Moving ownership to AppSession makes the state lifetime and replacement boundary closer to the runtime occurrence that actually owns the attachment."
    - "Avoiding whole-manager replacement converts a broad destructive refresh into a narrower update, reducing unrelated authority loss."
  observations_zh:
    - "关键架构缺陷并不只是 UI State 过期；一个 Runtime Scope 的 Mutation 可以替换另一个 Scope 正在使用的 Authority-bearing State。"
    - "把 Ownership 移到 AppSession，使 State Lifetime 与 Replacement Boundary 更接近真正拥有 Attachment 的 Runtime Occurrence。"
    - "避免 Whole-manager Replacement 把宽泛破坏性 Refresh 收窄成局部 Update，从而降低无关 Authority Loss。"

  comparisons:
    - "A global mutable manager is simple to discover but couples unrelated runtime lifecycles; per-session authority state increases ownership clarity and isolates refresh blast radius."
    - "Rebuilding an entire manager after one authorization event treats authorization as global configuration replacement; updating the owning session treats it as a scoped authority transition."
  comparisons_zh:
    - "Global Mutable Manager 容易发现和访问，但耦合无关 Runtime Lifecycle；Per-session Authority State 提高 Ownership 清晰度并隔离 Refresh Blast Radius。"
    - "单个 Authorization Event 后重建整个 Manager，把授权当作 Global Configuration Replacement；更新 Owning Session 则把它建模为 Scoped Authority Transition。"

  counterarguments:
    - "Some permission policies may intentionally be global across sessions; those should be represented as explicit higher-scope policy rather than emerging accidentally from shared mutable manager ownership."
    - "Per-session state can introduce duplication or synchronization needs for genuinely shared servers, so shared facts and session authority may still need separate representations."
    - "The reporter's 'fixed' confirmation validates the observed symptom but cannot rule out other refresh, authorization or concurrency paths."
  counterarguments_zh:
    - "某些 Permission Policy 可能有意跨 Session 全局生效；这类规则应作为显式 Higher-scope Policy 表达，而不是从 Shared Mutable Manager Ownership 中偶然产生。"
    - "Per-session State 对真正共享的 Server 可能引入重复或同步需求，因此 Shared Fact 与 Session Authority 仍可能需要分开表示。"
    - "报告者的 ‘fixed’ 确认验证了已观察症状，但不能排除其他 Refresh、Authorization 或 Concurrency Path。"

  research_judgment: "Authority-bearing permission and connected-tool state should be owned at the same lifecycle scope as the attachment/runtime occurrence it governs. A refresh or authorization completion in one runtime should not replace a manager that is authoritative for unrelated attachments. The selected Codex change demonstrates a bounded ownership correction—per-runtime AppSession state and narrower update/replacement scope. It does not prove durable authorization storage, distributed consistency, race freedom across every path, or exactly-once permission transitions."
  research_judgment_zh: "携带 Authority 的 Permission 与 Connected-tool State 应由其所治理的 Attachment/Runtime Occurrence 同一 Lifecycle Scope 拥有。一个 Runtime 的 Refresh 或 Authorization Completion 不应替换对无关 Attachment 具有权威性的 Manager。所选 Codex 变更证明了一种有界 Ownership Correction：Per-runtime AppSession State 与更窄的 Update/Replacement Scope；它不能证明 Durable Authorization Storage、分布式一致性、所有路径 Race Freedom 或 Exactly-once Permission Transition。"

  general_implications:
    - "Agent platforms should declare permission-state owner, lifetime and replacement scope explicitly rather than infer them from a convenient singleton."
    - "Authorization refresh should mutate only the authority object for the target runtime/attachment unless a separately governed global policy intentionally applies."
    - "Shared server identity and per-session permission authority should be separable so sharing a resource does not imply sharing mutable authority state."
    - "Operational telemetry should record which scope changed permission state and which attachments were affected, enabling blast-radius audits."
  general_implications_zh:
    - "Agent Platform 应显式声明 Permission-state Owner、Lifetime 与 Replacement Scope，而不是从方便的 Singleton 推断。"
    - "Authorization Refresh 应只修改目标 Runtime/Attachment 的 Authority Object，除非另有受治理的 Global Policy 明确要求全局生效。"
    - "Shared Server Identity 与 Per-session Permission Authority 应可分离，避免共享 Resource 被误解为共享 Mutable Authority State。"
    - "Operational Telemetry 应记录哪个 Scope 改变 Permission State、影响了哪些 Attachment，以支持 Blast-radius Audit。"

  limitations:
    - "Evidence is a single Codex issue plus merged maintainer implementation and reporter confirmation, not independent multi-system validation."
    - "No formal proof establishes that all authorization/refresh races are eliminated."
    - "No evidence establishes cross-process or distributed consistency for permission state."
    - "No evidence establishes durable snapshots, crash recovery or exactly-once authorization semantics."
  limitations_zh:
    - "证据来自单个 Codex Issue、已合并维护者实现与报告者确认，并非独立多系统验证。"
    - "没有形式证明说明所有 Authorization/Refresh Race 都已消除。"
    - "没有证据建立 Permission State 的 Cross-process 或 Distributed Consistency。"
    - "没有证据建立 Durable Snapshot、Crash Recovery 或 Exactly-once Authorization 语义。"

  open_questions:
    - "Which permission facts are truly session-owned and which are intentionally global policy?"
    - "How should a session recover its authority state after crash or reconnect without overwriting other sessions?"
    - "Can shared server identity be normalized while permission snapshots remain independently versioned per attachment/session?"
    - "What concurrency tests are needed to cover simultaneous authorization refreshes across multiple runtimes?"
  open_questions_zh:
    - "哪些 Permission Fact 真正属于 Session，哪些属于有意设计的 Global Policy？"
    - "Session 在 Crash/Reconnect 后应如何恢复 Authority State，同时不覆盖其他 Session？"
    - "能否规范化 Shared Server Identity，同时让 Permission Snapshot 按 Attachment/Session 独立版本化？"
    - "覆盖多个 Runtime 同时 Authorization Refresh 需要哪些 Concurrency Test？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "evidence", "architecture-analysis", "authority-boundary", "governance-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The conclusion is a general lifecycle/authority ownership pattern and does not require first-party project mapping."
    rationale_zh: "该结论属于一般 Lifecycle/Authority Ownership Pattern，不需要映射自有项目才能成立。"
```

## Bounded judgment / 有界判断

The central distinction is **shared resource identity is not shared permission authority**. A server can be known across contexts while the authority to expose its tools remains scoped to the session/attachment that owns that permission state. The evidence supports narrowing ownership and replacement scope; it does not establish a complete distributed authorization protocol.

核心区别是：**Shared Resource Identity 不等于 Shared Permission Authority**。Server 可以跨 Context 被识别，但暴露其 Tool 的 Authority 仍应归属于拥有该 Permission State 的 Session/Attachment。现有证据支持收窄 Ownership 与 Replacement Scope，但不能建立完整的分布式 Authorization Protocol。
