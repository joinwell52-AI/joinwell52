---
schema: "research-analysis/v1"
id: "AN-20260826-03"
date: "2026-08-26"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260826-03"
column: "open-source-engineering"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260826-03-http-options-copy-on-mutation-isolation.md"
output_contract: "Research Object"
research_object: "Per-invocation HTTP Options Need Copy-on-Mutation Ownership"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Per-invocation HTTP Options Need Copy-on-Mutation Ownership

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-26 Reading Result for Q-20260826-03. The primary evidence is the OpenAI Agents Python issue/merged fix documented there: per-call trace headers were added by mutating a headers dictionary returned from an HTTP client factory, causing invocation-specific state to leak into later calls; the merged fix constructs a fresh headers dictionary and copies the other templated HTTP option mappings before per-invocation mutation while intentionally retaining the live HTTP client. The conclusion is bounded to ownership/isolation of mutable option containers; it does not establish isolation of nested mutable values, cookies/session state, custom client internals, or generic concurrency safety.

本对象仅分析 Q-20260826-03 的 2026-08-26 已完成 Reading Result。一手证据是其中已核验的 OpenAI Agents Python Issue/已合并修复：Per-call Trace Header 通过原地修改 HTTP Client Factory 返回的 Headers Dictionary 加入，导致 Invocation-specific State 泄漏到后续调用；已合并修复为 Headers 构建新 Dictionary，并在每次调用修改前复制其他模板化 HTTP Option Mapping，同时有意保留 Live HTTP Client。本结论仅限于 Mutable Option Container 的 Ownership/Isolation；不能据此推出 Nested Mutable Value、Cookie/Session State、Custom Client Internal 或通用并发安全均已隔离。

```yaml
analysis:
  research_question: "How should a reusable client/runtime separate template HTTP configuration from per-invocation mutation without needlessly cloning heavyweight live client objects?"
  research_question_zh: "可复用 Client/Runtime 应如何把 Template HTTP Configuration 与 Per-invocation Mutation 分离，同时避免不必要地复制重量级 Live Client Object？"

  evidence_claims:
    - id: "E1"
      identity: "source-reported-claim"
      claim: "The reported bug mutated the headers dictionary returned by the HTTP client factory in place, allowing the first invocation's trace headers to remain visible to later calls."
      claim_zh: "报告的 Bug 原地修改 HTTP Client Factory 返回的 Headers Dictionary，使第一次 Invocation 的 Trace Header 继续出现在后续调用中。"
      source: "research/reading/Q-20260826-03-http-options-copy-on-mutation-isolation.md"
      strength: "primary issue and code-path evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "The merged fix constructs a fresh headers mapping by combining a copy of factory headers with per-call trace headers instead of mutating the factory mapping."
      claim_zh: "已合并修复通过把 Factory Header 的副本与 Per-call Trace Header 合成新的 Mapping，而不是修改 Factory Mapping。"
      source: "research/reading/Q-20260826-03-http-options-copy-on-mutation-isolation.md"
      strength: "direct merged implementation evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The fix also copies other templated HTTP keyword-option mappings before use, but deliberately does not clone or rebuild the live HTTP client."
      claim_zh: "修复也在使用前复制其他模板化 HTTP Keyword-option Mapping，但有意不 Clone 或重建 Live HTTP Client。"
      source: "research/reading/Q-20260826-03-http-options-copy-on-mutation-isolation.md"
      strength: "direct implementation-scope evidence"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "The correct ownership boundary is between reusable template configuration and ephemeral invocation state: mutable option containers should be snapshotted per call before mutation, while heavyweight shared transport objects can remain shared if their own mutation semantics are separately controlled."
      claim_zh: "正确 Ownership Boundary 位于 Reusable Template Configuration 与 Ephemeral Invocation State 之间：Mutable Option Container 应在每次调用修改前形成 Snapshot；重量级 Shared Transport Object 如果其自身 Mutation Semantics 另有控制，则可以继续共享。"
      source: "E1,E2,E3"
      strength: "bounded ownership/isolation interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "Shallow copy-on-mutation closes the demonstrated aliasing bug for top-level option containers but cannot by itself isolate nested mutable objects or state maintained inside the live client."
      claim_zh: "Shallow Copy-on-mutation 能关闭已证明的 Top-level Option Container Aliasing Bug，但不能单独隔离 Nested Mutable Object 或 Live Client 内部维护的 State。"
      source: "E2,E3"
      strength: "evidence-boundary interpretation"
      independent: false

  observations:
    - "The defect is caused by aliasing: the factory output was treated as if it were an invocation-local value even though later invocations could receive the same mutable object."
    - "The repair is intentionally narrow: copy mutable configuration containers, not the network client or connection pool."
    - "Applying the same copying rule to all templated HTTP kwargs reduces inconsistent ownership assumptions across option categories."
  observations_zh:
    - "缺陷来自 Aliasing：Factory Output 被当成 Invocation-local Value 使用，但后续 Invocation 可能获得同一个 Mutable Object。"
    - "修复有意保持狭窄：复制 Mutable Configuration Container，而不是复制 Network Client 或 Connection Pool。"
    - "对全部模板化 HTTP Kwarg 应用同一复制规则，减少不同 Option Category 之间不一致的 Ownership Assumption。"

  comparisons:
    - "In-place mutation is cheaper syntactically but silently converts template state into cross-request state. Copy-on-mutation preserves the template as a reusable baseline."
    - "Cloning an entire live client would provide a much broader isolation boundary but would also discard useful shared connection/session machinery; copying only mutable request options better matches the demonstrated fault domain."
  comparisons_zh:
    - "In-place Mutation 语法上更简单，却会静默把 Template State 变成 Cross-request State；Copy-on-mutation 保留 Template 作为可复用 Baseline。"
    - "Clone 整个 Live Client 会提供更宽的隔离边界，但也会丢弃有价值的 Shared Connection/Session Machinery；只复制 Mutable Request Option 更匹配已证明的 Fault Domain。"

  counterarguments:
    - "A shallow dictionary copy is insufficient if option values themselves contain mutable nested objects that are later modified."
    - "A shared live HTTP client may still carry cookies, authentication/session data, hooks or custom mutable state across requests."
    - "Immutable option structures or factory contracts that guarantee fresh values could remove the need for defensive copying, but the evidence does not establish such a contract."
  counterarguments_zh:
    - "如果 Option Value 本身包含后续会被修改的 Nested Mutable Object，Shallow Dictionary Copy 仍然不够。"
    - "Shared Live HTTP Client 仍可能通过 Cookie、Authentication/Session Data、Hook 或 Custom Mutable State 跨请求携带状态。"
    - "Immutable Option Structure 或保证 Fresh Value 的 Factory Contract 可以减少 Defensive Copy 需求，但现有证据没有建立这种 Contract。"

  research_judgment: "Reusable agent/tool clients should treat templated mutable request options as read-mostly baseline state and create an invocation-owned copy before adding trace, authorization or other per-call metadata. This avoids aliasing one request's state into another while preserving expensive live client/transport objects when their sharing is intentional. The selected Agents Python fix demonstrates this top-level copy-on-mutation pattern for HTTP option containers; it does not prove deep isolation, cookie/session isolation, custom-client safety or generic concurrency correctness."
  research_judgment_zh: "可复用 Agent/Tool Client 应把模板化 Mutable Request Option 视为 Read-mostly Baseline State，并在加入 Trace、Authorization 或其他 Per-call Metadata 之前创建 Invocation-owned Copy。这样既能避免一个请求的状态通过 Aliasing 泄漏到另一个请求，又可以在有意共享时保留昂贵的 Live Client/Transport Object。所选 Agents Python 修复证明了 HTTP Option Container 的 Top-level Copy-on-mutation Pattern；它不能证明 Deep Isolation、Cookie/Session Isolation、Custom-client Safety 或通用 Concurrency Correctness。"

  general_implications:
    - "Client factories should document whether returned option containers are templates, fresh invocation values or shared mutable state."
    - "Per-call enrichment should operate on invocation-owned snapshots and never mutate a reusable template in place."
    - "Regression tests should make multiple sequential calls and verify that call-specific headers/options do not appear in later calls."
    - "Where nested option values are mutable, ownership must be defined recursively or represented with immutable structures."
    - "Shared live clients need separate review for cookies, authentication caches, hooks and other internal cross-request state."
  general_implications_zh:
    - "Client Factory 应说明返回的 Option Container 是 Template、Fresh Invocation Value 还是 Shared Mutable State。"
    - "Per-call Enrichment 应操作 Invocation-owned Snapshot，绝不能原地修改可复用 Template。"
    - "Regression Test 应执行多个连续调用，并验证 Call-specific Header/Option 不会出现在后续调用。"
    - "如果 Nested Option Value 可变，Ownership 必须递归定义，或改用 Immutable Structure。"
    - "Shared Live Client 需要另行检查 Cookie、Authentication Cache、Hook 与其他 Internal Cross-request State。"

  limitations:
    - "Evidence is one issue and one merged maintainer fix in Agents Python, not independent cross-library validation."
    - "The implementation uses shallow copies of top-level mappings; nested mutability remains outside the proven boundary."
    - "No evidence proves the live HTTP client is free of cross-request mutable state."
    - "No evidence establishes generic thread safety, distributed isolation or exactly-once request semantics."
  limitations_zh:
    - "证据来自 Agents Python 的一个 Issue 与一个已合并维护者修复，并非跨 Library 独立验证。"
    - "实现使用 Top-level Mapping 的 Shallow Copy；Nested Mutability 不在已证明边界内。"
    - "没有证据证明 Live HTTP Client 不包含 Cross-request Mutable State。"
    - "没有证据建立通用 Thread Safety、Distributed Isolation 或 Exactly-once Request Semantics。"

  open_questions:
    - "Should templated request options be represented by immutable mapping types to make ownership violations impossible by construction?"
    - "Which nested option values require deep-copy, freeze or typed ownership instead of shallow copying?"
    - "How should libraries test custom HTTP client factories whose clients preserve cookies or mutable hooks across calls?"
    - "Can static typing or lint rules distinguish reusable templates from invocation-owned request state?"
  open_questions_zh:
    - "模板化 Request Option 是否应使用 Immutable Mapping Type，从构造层面阻止 Ownership Violation？"
    - "哪些 Nested Option Value 需要 Deep-copy、Freeze 或 Typed Ownership，而不是 Shallow Copy？"
    - "Library 应如何测试会跨调用保留 Cookie 或 Mutable Hook 的 Custom HTTP Client Factory？"
    - "Static Typing 或 Lint Rule 能否区分 Reusable Template 与 Invocation-owned Request State？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence", "failure-mechanism", "engineering-pattern", "testing-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The conclusion is a general mutable-state ownership pattern and does not require first-party project mapping."
    rationale_zh: "该结论属于一般 Mutable-state Ownership Pattern，不需要映射自有项目才能成立。"
```

## Bounded judgment / 有界判断

The central distinction is **reusable template state is not invocation-owned mutable state**. Per-call enrichment should begin from a fresh option snapshot, while the live transport may remain shared if that sharing is intentional and separately governed. The evidence closes the demonstrated top-level aliasing bug; it does not justify broader claims of full request-state isolation.

核心区别是：**Reusable Template State 不等于 Invocation-owned Mutable State**。Per-call Enrichment 应从 Fresh Option Snapshot 开始；如果 Live Transport 的共享是有意且另受治理，它可以继续共享。现有证据关闭了已证明的 Top-level Aliasing Bug，但不能据此声称完整 Request-state Isolation 已经成立。
