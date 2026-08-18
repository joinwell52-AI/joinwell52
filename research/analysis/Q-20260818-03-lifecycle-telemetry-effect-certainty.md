---
schema: "research-analysis/v1"
id: "AN-20260818-03"
date: "2026-08-18"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260818-03"
column: "open-source-engineering"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260818-03-request-lifecycle-observability.md"
output_contract: "Research Object"
research_object: "Lifecycle Telemetry and External-Effect Certainty as Separate Evidence Planes"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Lifecycle Telemetry and External-Effect Certainty as Separate Evidence Planes

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-18 Reading Result for Q-20260818-03. The merged Codex exec-server code and regression tests establish bounded facts about request-span ownership, queue latency, route labels and terminal operational outcomes. Broader conclusions about observability and effect evidence are interpretations; they do not establish complete causal tracing, authentication, exactly-once execution, external-side-effect rollback or guaranteed telemetry retention.

本对象仅分析 Q-20260818-03 的 2026-08-18 已完成 Reading Result。Codex Exec-server 的已合并代码与回归测试建立了关于 Request Span Ownership、Queue Latency、Route Label 与 Terminal Operational Outcome 的有界事实。关于可观测性与 Effect Evidence 的更广泛结论属于解释；它们不构成完整 Causal Tracing、Authentication、Exactly-once Execution、External-side-effect Rollback 或 Telemetry Retention 保证的证明。

```yaml
analysis:
  research_question: "What can a request trace prove when it covers queue receipt through a terminal operational outcome, and what evidence must remain separate for external effects?"
  research_question_zh: "当一次 Request Trace 覆盖从 Queue Receipt 到 Terminal Operational Outcome 时，它究竟能证明什么；外部副作用还需要哪些独立证据？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The merged exec-server change creates the inbound request span and queue timestamp at connection-queue receipt before dispatcher admission."
      claim_zh: "已合并的 Exec-server 变更会在 Dispatcher Admission 之前、Connection Queue 收到请求时创建 Inbound Request Span 与排队时间戳。"
      source: "research/reading/Q-20260818-03-request-lifecycle-observability.md"
      strength: "direct merged-code and regression-test evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Validated optional W3C parent context is attached to that span, and the same span is carried through server/client queues and route execution."
      claim_zh: "经过验证的可选 W3C Parent Context 会附着到该 Span，同一 Span 随后贯穿 Server/Client Queue 与 Route Execution。"
      source: "research/reading/Q-20260818-03-request-lifecycle-observability.md"
      strength: "direct merged-code and test evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "Queue duration is emitted only after admission and uses a bounded route label; tests verify the metric is absent while admission is blocked and present afterward."
      claim_zh: "Queue Duration 仅在 Admission 之后记录，并使用有界 Route Label；测试验证 Admission 被阻塞时该指标不存在，放行后才出现。"
      source: "research/reading/Q-20260818-03-request-lifecycle-observability.md"
      strength: "direct regression-test evidence"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "Terminal operational outcomes such as success, error or disconnected are written to the request span, including client-handled callbacks whose unresolved outcome defaults to disconnected."
      claim_zh: "Success、Error、Disconnected 等 Terminal Operational Outcome 会写入 Request Span；Client-handled Callback 若未设置更具体结果，则未解决终态默认记录为 Disconnected。"
      source: "research/reading/Q-20260818-03-request-lifecycle-observability.md"
      strength: "direct merged-code and test evidence"
      independent: false
    - id: "E5"
      identity: "public-fact"
      claim: "The demonstrated trace does not establish whether an external side effect occurred before a disconnect, nor complete causal tracing, authentication, exactly-once behavior or exporter retention."
      claim_zh: "已演示 Trace 无法建立 Disconnect 前外部副作用是否已经发生，也不建立完整 Causal Tracing、Authentication、Exactly-once Behavior 或 Exporter Retention。"
      source: "research/reading/Q-20260818-03-request-lifecycle-observability.md"
      strength: "direct source limitation"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "A closed request span is evidence that the instrumented request lifecycle reached a telemetry terminal state; it is not an effect receipt proving the business operation or external system reached the same terminal state."
      claim_zh: "关闭的 Request Span 只能证明被 Instrument 的请求生命周期到达了 Telemetry Terminal State；它不是证明业务操作或外部系统也到达同一终态的 Effect Receipt。"
      source: "E1,E2,E3,E4,E5"
      strength: "bounded engineering interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "Operational observability and effect certainty should be modeled as separate evidence planes linked by stable correlation identity rather than collapsed into one status field."
      claim_zh: "Operational Observability 与 Effect Certainty 应被建模为两个独立 Evidence Plane，并通过稳定 Correlation Identity 关联，而不是压缩进同一个 Status Field。"
      source: "E4,E5"
      strength: "bounded engineering interpretation"
      independent: false

  observations:
    - "Starting span ownership at queue receipt makes pre-admission waiting observable instead of treating it as invisible prelude."
    - "Bounded route labels deliberately sacrifice raw method detail to control telemetry cardinality."
    - "The terminal taxonomy captures request-path outcomes including disconnect, but disconnect remains epistemically ambiguous about already-started external effects."
  observations_zh:
    - "从 Queue Receipt 开始拥有 Span，使 Admission 之前的等待变得可观测，而不是不可见前奏。"
    - "有界 Route Label 有意牺牲 Raw Method 细节，以控制 Telemetry Cardinality。"
    - "Terminal Taxonomy 能记录包含 Disconnect 在内的请求路径结果，但 Disconnect 对已经开始的外部副作用仍存在认识不确定性。"

  comparisons:
    - "Handler-only tracing misses queue residence and cannot explain whether latency accumulated before execution began."
    - "Raw method labels increase diagnostic detail but can create unbounded metric cardinality; route normalization bounds operational cost."
    - "A transport-level success/error/disconnect status describes the instrumented request path, whereas an effect receipt would need evidence from the system that owns the side effect."
    - "A new span created after each asynchronous queue would fragment lifecycle ownership; carrying one inbound span preserves request-level correlation across the demonstrated path."
  comparisons_zh:
    - "只在 Handler 内追踪会丢失 Queue Residence，无法解释执行开始前是否已经积累延迟。"
    - "Raw Method Label 增加诊断细节，却可能造成无界 Metric Cardinality；Route Normalization 控制了运维成本。"
    - "Transport 层 Success/Error/Disconnect 描述的是被 Instrument 的请求路径，而 Effect Receipt 需要来自实际拥有副作用的系统证据。"
    - "每经过一个异步 Queue 就创建新 Span 会碎片化 Lifecycle Ownership；携带同一 Inbound Span 保留了已演示路径的请求级关联。"

  counterarguments:
    - "For operations that are entirely local and transactionally coupled to the request handler, request completion may closely approximate effect completion."
    - "A tracing backend with complete propagation can carry effect-related child spans, reducing the gap between request telemetry and effect evidence, but only if those external operations actually emit reliable evidence."
    - "Strictly separating every evidence plane can increase implementation complexity and may be unnecessary for low-risk read-only requests."
  counterarguments_zh:
    - "对于完全本地且与 Request Handler 事务耦合的操作，请求完成可能非常接近 Effect Completion。"
    - "具备完整传播的 Tracing Backend 可以携带与 Effect 相关的 Child Span，缩小 Request Telemetry 与 Effect Evidence 的差距，但前提是这些外部操作实际产生可靠证据。"
    - "严格分离所有 Evidence Plane 会增加实现复杂度，对低风险只读请求可能没有必要。"

  research_judgment: "Request lifecycle observability should make queue receipt, admission, execution and terminal transport outcome reconstructable, but it should not be used as a substitute for external-effect evidence. A robust runtime therefore needs at least two linked evidence planes: lifecycle telemetry that explains what happened to the request inside the runtime, and effect evidence that establishes what the side-effect-owning system accepted, committed, rejected or left uncertain. Disconnect is especially important because it is a terminal telemetry state while external-effect state may remain unknown."
  research_judgment_zh: "Request Lifecycle Observability 应使 Queue Receipt、Admission、Execution 与 Terminal Transport Outcome 可重建，但不能替代 External-effect Evidence。稳健 Runtime 至少需要两个相互关联的 Evidence Plane：Lifecycle Telemetry 用于解释请求在 Runtime 内经历了什么；Effect Evidence 用于建立拥有副作用的系统究竟接受、提交、拒绝了什么，或者哪些状态仍不确定。Disconnect 尤其关键，因为它可以是 Telemetry 的终态，而 External-effect State 仍可能未知。"

  general_implications:
    - "Tracing schemas should distinguish request-path outcome from business/effect outcome rather than overloading success and failure labels."
    - "External effect operations benefit from stable idempotency, transaction or receipt identities that can be correlated with the request trace."
    - "A disconnected request should normally trigger reconciliation when the external effect cannot be proven absent or committed from authoritative evidence."
    - "Queue-latency metrics should define their measurement boundary explicitly so operators do not confuse pre-admission waiting with total user-perceived latency."
    - "Telemetry cardinality is itself an operational governance concern; bounded route identity is compatible with detailed per-request traces when the two serve different purposes."
  general_implications_zh:
    - "Tracing Schema 应区分 Request-path Outcome 与 Business/Effect Outcome，而不是让 Success/Failure Label 承担两种语义。"
    - "外部 Effect Operation 适合使用稳定 Idempotency、Transaction 或 Receipt Identity，并与 Request Trace 建立关联。"
    - "当权威证据无法证明 External Effect 未发生或已提交时，Disconnected Request 通常应进入 Reconciliation。"
    - "Queue-latency Metric 应明确测量边界，避免运维人员把 Pre-admission Waiting 误解为完整 User-perceived Latency。"
    - "Telemetry Cardinality 本身也是运维治理问题；Bounded Route Identity 可以与详细 Per-request Trace 并存，因为二者服务不同目的。"

  limitations:
    - "Evidence is one merged exec-server path and its repository regression tests, not an independent observability benchmark."
    - "The analysis does not establish that every descendant task or external call carries the inbound trace context."
    - "The evidence does not demonstrate a durable external-effect ledger or a reconciliation protocol for disconnected operations."
    - "Exporter loss, sampling and backend retention can still make emitted telemetry unavailable after runtime execution."
  limitations_zh:
    - "证据来自一个已合并 Exec-server 路径及其仓库回归测试，而不是独立 Observability Benchmark。"
    - "本分析没有建立每个 Descendant Task 或 External Call 都携带 Inbound Trace Context。"
    - "证据没有演示持久 External-effect Ledger，也没有演示针对 Disconnected Operation 的 Reconciliation Protocol。"
    - "Exporter 丢失、Sampling 与 Backend Retention 仍可能让已发出的 Telemetry 在执行后不可用。"

  open_questions:
    - "What stable effect identity should be emitted for external operations so a disconnected request can later be reconciled deterministically?"
    - "Which descendant tasks intentionally outlive the inbound request span, and how are they correlated after the response path closes?"
    - "How should request outcome taxonomy map to effect outcomes such as committed, rejected, unknown and compensated?"
    - "What retention guarantees are required before telemetry can participate in formal audit rather than short-lived operations debugging?"
  open_questions_zh:
    - "外部操作应产生什么稳定 Effect Identity，才能让 Disconnected Request 在之后进行确定性 Reconciliation？"
    - "哪些 Descendant Task 被设计为超出 Inbound Request Span 生命周期，它们在响应路径关闭后如何继续关联？"
    - "Request Outcome Taxonomy 应如何映射到 Committed、Rejected、Unknown、Compensated 等 Effect Outcome？"
    - "Telemetry 在参与正式 Audit 而不只是短期运维调试之前，需要怎样的 Retention Guarantee？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence", "engineering-implications", "operational-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The judgment concerns a general observability/effect-evidence separation for agent runtimes and requires no first-party project mapping."
    rationale_zh: "该判断讨论 Agent Runtime 中一般的 Observability/Effect-evidence 分离，不需要映射任何自有项目即可成立。"
```

## Bounded judgment / 有界判断

A trace can close cleanly while the world outside the runtime remains uncertain. The evidence supports stronger request-lifecycle reconstruction, including queue time and disconnected outcomes, but not the stronger inference that a terminal span proves the external operation was never applied, was applied exactly once, or can be rolled back.

Trace 可以干净收口，而 Runtime 外部世界仍然处于不确定状态。现有证据支持更完整的 Request Lifecycle 重建，包括 Queue Time 与 Disconnected Outcome；但不支持进一步推断 Terminal Span 能证明外部操作从未发生、恰好发生一次或可以被回滚。
