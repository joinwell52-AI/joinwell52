---
schema: "research-analysis/v1"
id: "AN-20260814-02"
date: "2026-08-14"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260814-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260814-02-dpx-g360-accountable-airline-operating-architecture.md"
output_contract: "Research Object"
research_object: "From KPI Visibility to Decision Rights in Accountable AI Operations"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — From KPI Visibility to Decision Rights in Accountable AI Operations

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-14 Reading Result for Q-20260814-02. DPX-G360 is treated as an author-proposed design-science artefact. Its publication and DOI establish provenance, not empirical validation or production effectiveness.

本对象仅分析 Q-20260814-02 的 2026-08-14 已完成 Reading Result。DPX-G360 被视为作者提出的 Design-science Artefact；其发表状态与 DOI 只建立来源与版本身份，不代表已经完成实证验证或证明生产有效性。

```yaml
analysis:
  research_question: "What must be added to a multi-layer accountable-AI architecture before it can function as an operational governance system rather than remain a conceptual framework or dashboard?"
  research_question_zh: "一个多层 Accountable-AI Architecture 还必须具备什么，才能从概念框架或 Dashboard 变成可运行的治理系统？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The published DPX-G360 artefact describes a three-stage airline operating architecture connecting passenger-facing journeys, offer/order orchestration and back-stage operating systems through six capability layers."
      claim_zh: "已发布的 DPX-G360 Artefact 描述了一个三阶段航空运营架构，通过六个 Capability Layer 连接 Passenger-facing Journey、Offer/Order Orchestration 与 Back-stage Operating System。"
      source: "research/reading/Q-20260814-02-dpx-g360-accountable-airline-operating-architecture.md"
      strength: "direct publication metadata and source-text evidence"
      independent: false
    - id: "E2"
      identity: "source-reported-claim"
      claim: "The paper proposes that governed KPIs should be bound to an owner, threshold, escalation path, decision cadence and corrective-action mechanism rather than merely displayed."
      claim_zh: "论文提出，受治理 KPI 不应只是展示，而应绑定 Owner、Threshold、Escalation Path、Decision Cadence 与 Corrective-action Mechanism。"
      source: "research/reading/Q-20260814-02-dpx-g360-accountable-airline-operating-architecture.md"
      strength: "author-proposed governance mechanism"
      independent: false
    - id: "E3"
      identity: "source-reported-claim"
      claim: "The paper distributes accountability across board/executive, CIO/CDO, commercial, operations, security/privacy and finance roles and frames AI decisions as automated, augmented or human-owned with exception and override controls."
      claim_zh: "论文把责任分配到 Board/Executive、CIO/CDO、Commercial、Operations、Security/Privacy 与 Finance 等角色，并把 AI Decision 表示为 Automated、Augmented 或 Human-owned，同时配置 Exception 与 Override Control。"
      source: "research/reading/Q-20260814-02-dpx-g360-accountable-airline-operating-architecture.md"
      strength: "author-proposed architecture"
      independent: false
    - id: "E4"
      identity: "public-fact"
      claim: "The paper explicitly lacks passenger surveys, internal airline KPIs, confidential implementation records, interviews, experimental testing and longitudinal outcome measurement and does not claim empirical validation across airlines."
      claim_zh: "论文明确缺少 Passenger Survey、航空公司内部 KPI、保密实施记录、Interview、Experimental Testing 与 Longitudinal Outcome Measurement，也没有声称已经完成跨航空公司的实证验证。"
      source: "research/reading/Q-20260814-02-dpx-g360-accountable-airline-operating-architecture.md"
      strength: "explicit source limitation"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "The architectural step from observability to governance is the binding of measured state to decision authority and a closed escalation/corrective-action loop; a layered map alone does not provide that operational control."
      claim_zh: "从 Observability 跨越到 Governance 的关键架构步骤，是把测量状态绑定到 Decision Authority，并形成闭合的 Escalation / Corrective-action Loop；单纯的 Layered Map 并不能提供这种运营控制。"
      source: "E1,E2,E3,E4"
      strength: "bounded architectural interpretation"
      independent: false

  observations:
    - "The three-stage/six-layer model is most useful as a dependency map: passenger outcomes depend on orchestration and back-stage systems that are usually invisible in customer-channel metrics."
    - "The proposed KPI mechanism moves beyond measurement by naming who must decide, when a threshold is crossed and what corrective action follows."
    - "The evidence base does not establish threshold quality, escalation latency, organizational fit or causal improvement in airline outcomes."
  observations_zh:
    - "三阶段/六层模型最有价值的用途是 Dependency Map：Passenger Outcome 依赖通常不会直接出现在客户渠道指标里的 Orchestration 与 Back-stage System。"
    - "所提出的 KPI Mechanism 通过明确谁负责决策、何时越过 Threshold、之后采取什么 Corrective Action，从 Measurement 进一步走向 Governance。"
    - "现有证据没有建立 Threshold Quality、Escalation Latency、组织适配性，也没有建立航空运营结果的因果改善。"

  comparisons:
    - "A dashboard answers what is happening; an operational governance loop additionally answers who owns the condition, what threshold matters, who may override, when escalation occurs and whether corrective action closed the condition."
    - "A technology inventory can list AI, biometrics, ERP, MRO and data platforms; a service-operating architecture instead models dependencies between promises, fulfillment systems, recovery paths and accountable owners."
    - "A validated maturity model would require measured constructs and outcome testing; DPX-G360 presently remains a prescriptive architecture ready for such evaluation rather than evidence that its use improves outcomes."
  comparisons_zh:
    - "Dashboard 回答‘发生了什么’；Operational Governance Loop 还必须回答‘谁负责、什么 Threshold 有意义、谁可以 Override、何时 Escalate，以及 Corrective Action 是否真正关闭问题’。"
    - "Technology Inventory 可以列出 AI、Biometrics、ERP、MRO 与 Data Platform；Service-operating Architecture 则进一步建模 Promise、Fulfillment System、Recovery Path 与 Accountable Owner 之间的依赖。"
    - "经过验证的 Maturity Model 需要可测 Construct 与 Outcome Testing；DPX-G360 当前仍是等待评估的 Prescriptive Architecture，而不是其使用能够改善结果的证据。"

  counterarguments:
    - "Conceptual design artefacts can still be useful before field validation because they expose missing interfaces, ownership conflicts and measurable hypotheses."
    - "Not every operational condition should be reduced to one KPI threshold; complex disruptions may require multi-signal judgment and human discretion."
    - "Role assignment at an executive-function level can guide accountability but may be too coarse for real-time operational escalation across airline business models and jurisdictions."
  counterarguments_zh:
    - "Conceptual Design Artefact 即使尚未完成 Field Validation 也可能有价值，因为它能够暴露缺失 Interface、Ownership Conflict 与可测 Hypothesis。"
    - "并非所有 Operational Condition 都应简化为单一 KPI Threshold；复杂 Disruption 可能需要 Multi-signal Judgment 与人的裁量。"
    - "Executive-function 层级的角色分配可以指导 Accountability，但面对不同航空商业模式与司法辖区的实时运营 Escalation 时可能过于粗粒度。"

  research_judgment: "The most transferable contribution of the selected architecture is not the six-layer diagram by itself but the proposed conversion of service and resilience measurements into accountable decision loops. An operational AI architecture becomes governable only when metrics are tied to authoritative owners, thresholds, escalation, override, corrective action and auditable closure. DPX-G360 provides a useful design hypothesis for that coupling, but its present evidence does not show that the proposed controls are sufficient or effective in live airlines."
  research_judgment_zh: "所选架构最可迁移的贡献并不是六层图本身，而是把 Service / Resilience Measurement 转换为 Accountable Decision Loop 的设计。只有当指标与权威 Owner、Threshold、Escalation、Override、Corrective Action 和可审计 Closure 绑定时，Operational AI Architecture 才真正进入可治理状态。DPX-G360 为这种耦合提供了有价值的 Design Hypothesis，但现有证据不能证明这些控制在真实航空公司中已经充分或有效。"

  general_implications:
    - "Enterprise AI architecture should model decision rights and recovery authority alongside data flows and model/service components."
    - "Operational KPIs need explicit source-of-truth definitions, owners, thresholds, escalation latency and closure evidence if they are to serve governance rather than reporting."
    - "Customer-facing experience architecture should include back-stage reliability and recovery dependencies because service promises can fail outside the visible channel."
    - "Cross-functional outcomes need conflict-resolution rules when commercial, operations, data, security and finance authorities overlap."
    - "Architecture maturity claims should be paired with an evaluation design that can distinguish implementation presence from outcome effectiveness."
  general_implications_zh:
    - "Enterprise AI Architecture 应在 Data Flow 与 Model/Service Component 之外同时建模 Decision Right 与 Recovery Authority。"
    - "如果 Operational KPI 要用于 Governance 而不仅是 Reporting，就需要明确 Source of Truth、Owner、Threshold、Escalation Latency 与 Closure Evidence。"
    - "Customer-facing Experience Architecture 应包含 Back-stage Reliability 与 Recovery Dependency，因为 Service Promise 可能在可见 Channel 之外失败。"
    - "当 Commercial、Operations、Data、Security 与 Finance Authority 重叠时，Cross-functional Outcome 需要冲突解决规则。"
    - "Architecture Maturity Claim 应配套 Evaluation Design，以区分‘已经实施’与‘产生有效结果’。"

  limitations:
    - "DPX-G360 is a design-science/documentary artefact rather than an independently validated production architecture."
    - "The four airline examples are illustrative and not audited implementations of the full framework."
    - "No live internal KPI data, field experiment, longitudinal measurement or executable conformance contract supports effectiveness claims."
    - "The source does not specify concrete interfaces, data contracts, threshold calibration methods or control algorithms."
  limitations_zh:
    - "DPX-G360 是 Design-science / Documentary Artefact，而不是经过独立验证的生产架构。"
    - "四个航空公司案例只是 Illustrative Example，并不是完整框架的 Audit Implementation。"
    - "没有实时内部 KPI Data、Field Experiment、Longitudinal Measurement 或 Executable Conformance Contract 支持 Effectiveness Claim。"
    - "来源没有规定具体 Interface、Data Contract、Threshold Calibration Method 或 Control Algorithm。"

  open_questions:
    - "Which proposed KPI constructs can be measured consistently enough to support cross-airline comparison or internal control?"
    - "How should an operational control plane arbitrate conflicts between customer-value, resilience, privacy, safety and financial thresholds?"
    - "What minimum field evidence should be required before an organization claims maturity in one of the architecture's capability layers?"
    - "How can escalation and corrective-action latency be measured without confusing correlation with causal contribution to service outcomes?"
  open_questions_zh:
    - "哪些 KPI Construct 能够被足够一致地测量，从而支持跨航空公司比较或内部控制？"
    - "Operational Control Plane 应如何裁决 Customer Value、Resilience、Privacy、Safety 与 Financial Threshold 之间的冲突？"
    - "组织在声称某个 Capability Layer 已达到成熟状态之前，最低需要什么 Field Evidence？"
    - "如何测量 Escalation 与 Corrective-action Latency，同时避免把相关性误当成对 Service Outcome 的因果贡献？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "context", "evidence", "technical-analysis", "governance-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The object is an independent industry-architecture analysis; its core judgment does not require any first-party project."
    rationale_zh: "本对象是独立的行业架构分析；核心判断不依赖任何自有项目。"
```

## Bounded judgment / 有界判断

A layered AI architecture becomes operationally accountable when **measurement is connected to authority and closure**: who owns a condition, what threshold matters, who can override, how escalation works, what corrective action follows, and what evidence closes the loop. DPX-G360 is useful as a design hypothesis for this pattern, but current evidence does not establish its effectiveness in live airline operations.

多层 AI 架构真正进入可问责运营状态，需要把**测量与权威和闭环**连接起来：谁负责某个状态、什么 Threshold 有意义、谁可以 Override、如何 Escalate、采取什么 Corrective Action，以及用什么证据证明闭环完成。DPX-G360 对这一模式提供了有价值的设计假设，但当前证据并未建立它在真实航空运营中的有效性。
