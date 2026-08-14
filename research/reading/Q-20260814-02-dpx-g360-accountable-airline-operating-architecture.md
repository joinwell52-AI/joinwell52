# Q-20260814-02 — DPX-G360 connects passenger-facing value to back-stage systems through governance and KPI ownership

- Runtime date: 2026-08-14
- Column: Industry Architecture
- Source object: Q-20260814-02 / SIG-20260814-R-001
- Primary source: https://zenodo.org/records/21010383
- DOI: 10.5281/zenodo.21010383
- Evidence class: Research Result / author-proposed design artefact; framework effectiveness is not independently validated
- Evidence level: peer_reviewed_or_primary_research for the published conference-paper artefact, with claims bounded to the paper's stated method and evidence
- Stage: Skill 03 Deep Reading only

## Problem

The paper argues that airline digital transformation is often fragmented across customer channels, retailing, operations, maintenance, finance, cybersecurity and governance. Its design problem is therefore not simply adoption of AI or digital tools, but how to connect front-stage passenger value, middle-stage offer/order orchestration and back-stage operating systems to accountable decision rights, trusted data, resilience controls and measurable execution.

## Facts and research-result claims

1. Zenodo publishes the artefact as version v1 of the conference paper *AI-Governed Digital Premium Experience in Airlines: The DPX-G360 Architecture for Trustworthy Customer Value and Operational Resilience*.
2. The paper explicitly uses design-science reasoning supported by documentary multiple-case synthesis; it is not presented as a causal experiment, longitudinal field study or audited implementation.
3. The unit of analysis is the passenger airline as a digitally governed service-operating system.
4. The paper organizes the operating architecture into three connected stages: front-stage passenger journey, middle-stage offer/order orchestration, and back-stage operating core.
5. The front-stage includes passenger-visible activities such as search, booking, payment, identity, check-in, baggage, lounge, boarding, inflight service, disruption recovery and post-flight engagement.
6. The middle-stage connects offers/orders, CRM, loyalty, payments, ancillaries, servicing and disruption logic. The paper treats personalization as a governable value-and-trust decision rather than only a conversion mechanism.
7. The back-stage includes OCC, AODB, DCS, MRO, ERP, procurement, finance, cloud, data platforms, cybersecurity and integration middleware. The paper's architectural claim is that these less-visible systems determine whether passenger-facing promises can actually be fulfilled and recovered.
8. DPX-G360 proposes six interdependent capability layers: digital journey orchestration, personalized retailing, operational intelligence, enterprise digital core, trust and cyber-resilience, and KPI-governed execution.
9. Digital journey orchestration covers end-to-end travel flow and service recovery; personalized retailing covers offers, orders, loyalty, payment and servicing.
10. Operational intelligence covers disruption prediction, OCC integration, crew/baggage visibility and maintenance intelligence; enterprise digital core covers ERP, MRO, procurement, finance, master data, cloud and integration.
11. Trust and cyber-resilience covers privacy, biometrics, identity, AI risk, cybersecurity, incident response and human oversight.
12. KPI-governed execution covers ownership, thresholds, escalation, corrective action, audit trails and learning.
13. The paper distinguishes displaying KPIs from governing through KPIs. It states that each governed KPI should have an owner, threshold, escalation path, decision cadence and corrective-action mechanism.
14. It proposes passenger-value, operational-resilience, trust/governance and financial KPI domains. Examples include disruption recovery time, rebooking success, refund cycle time, system availability, data-quality SLA adherence, model exception rate, incident response, human-override effectiveness and value-realization variance.
15. Responsibility is distributed by executive role: board/executive committee for strategic value and risk appetite; CIO/CDO for integration, data architecture and AI/data controls; CCO for offer/loyalty/customer recovery; COO for operational resilience and OCC/disruption recovery; CISO/data protection for cyber/privacy; finance for value realization and auditability.
16. The documentary cases are Singapore Airlines, Emirates, ANA and Thai Airways, selected as illustrative modernization pathways for different architecture components rather than as complete audited organizations.
17. The paper explicitly says the cases are not used to rank airlines or support statistical generalization.
18. Its evidence base is documentary: an uploaded draft manuscript, literature-review file, reference list and prior works on airline digital transformation, HCI/UX, logistics, Industry 5.0, human-centric AI, KPI governance and data analytics.
19. The methodology section states that no live web browsing was used in preparing those claims, so real-time implementation maturity, current company status, financial performance and regulatory compliance are outside its verified evidence boundary.
20. The design procedure is described as an evidence-gated loop: reframe the problem, bound constructs, map literature, derive requirements from cases, remove/reframe unsupported causal/statistical claims, and redesign the visual model for clarity and executive readability.
21. The paper explicitly states that it has no passenger survey data, internal airline KPIs, confidential implementation records, interviews, experimental testing or longitudinal performance measurement.
22. It therefore does not claim that DPX-G360 has been empirically validated across airlines.
23. The paper also does not claim causal measurement of passenger satisfaction, does not rank the case airlines, and does not assert regulatory compliance by any airline.
24. Future research is proposed through airline surveys, executive interviews, passenger-journey analytics, structural equation modeling, design-science evaluation panels and longitudinal cases, including tests of whether maturity in the six layers predicts recovery, trust, conversion, cost-to-serve, employee adoption or resilience outcomes.

## Mechanisms proposed by the artefact

### Three-stage value chain

DPX-G360 makes passenger experience an end-to-end architecture problem. Passenger touchpoints depend on offer/order orchestration, which in turn depends on operating, finance, maintenance, data, identity and cyber systems. This is an architectural dependency claim, not an observed causal effect.

### Six-layer capability model

The six layers translate the three stages into cross-functional capability domains. The model makes integration and governance first-class architecture components rather than treating AI, mobile channels or biometrics as standalone projects.

### KPI-to-authority binding

The framework's strongest operational mechanism is the proposed binding of a KPI to an owner, threshold, escalation path, review cadence and corrective action. The paper explicitly argues that a dashboard without decision rights is not governance.

### Accountable AI boundary

AI-enabled offers, chatbots, disruption automation and predictive maintenance are framed as decisions that should declare whether they are automated, augmented or human-owned, with model-risk controls, exception monitoring, override, privacy and auditability.

### Portfolio sequencing

The managerial roadmap starts with passenger value-stream diagnosis, maps dependent systems/data, identifies failure/recovery rules, assigns KPI owners, prioritizes integration and establishes a recurring value-realization/risk review cadence.

## Evidence

- Zenodo record 21010383 provides the published conference-paper metadata, DOI, abstract, file identity and references.
- The author-posted full-text copy indexed by ResearchGate matches the Zenodo title/DOI and exposes the methodology, architecture, limitations, discussion and future-research sections used here.
- The methodology explicitly bounds its evidence to design-science reasoning and documentary multiple-case synthesis.
- The paper itself identifies the four illustrative modernization pathways and the six capability layers, KPI domains, responsibility assignments and stated limitations.

## Limitations

1. DPX-G360 is a prescriptive conceptual/design-science artefact, not a proven operating model.
2. The four airline examples are illustrative pathways, not audited case studies; implementation success, completeness and current maturity are not established by this paper.
3. The paper lacks primary passenger, employee and executive field data.
4. It lacks internal operational/KPI datasets and longitudinal before/after measurement.
5. It does not establish causal links between framework maturity and passenger satisfaction, resilience, cost or financial performance.
6. Some documentary evidence includes vendor or company materials. Those sources can establish what organizations report, not independently prove effectiveness.
7. The paper's own preparation did not live-verify every DOI, URL or current official-company claim; it flags this as evidence-blocked work if browsing is later approved.
8. KPI lists and role assignments are proposed governance design choices; the source does not validate threshold values, escalation latency or organizational fit across airline business models.
9. Regulatory, cultural and business-model variation is deferred to future research.
10. The source does not provide an executable reference architecture, interface schemas, data contracts, control algorithms or implementation conformance tests.

## Comparisons

- A channel-centric digital program optimizes visible passenger touchpoints; DPX-G360 instead makes middle/back-stage fulfillment and recovery systems part of the same experience architecture.
- A conventional KPI dashboard describes performance; DPX-G360 proposes coupling indicators to decision rights, thresholds, escalation and corrective action.
- A technology inventory can list AI, biometrics, ERP or MRO projects; the framework instead groups them by value flow, resilience and accountable governance responsibilities.
- A causal maturity model would require measured variables and outcome testing; DPX-G360 stops at a design artefact ready for such empirical validation.

## Unresolved questions

1. Which subset of proposed KPIs has sufficient construct validity and data availability for cross-airline comparison?
2. What interfaces and data contracts are necessary to make the three stages operational rather than conceptual?
3. How should ownership conflicts be resolved when one passenger outcome depends simultaneously on CCO, COO, CIO/CDO, CISO and finance controls?
4. Which AI decisions require mandatory human authorization versus monitored automation in different regulatory jurisdictions?
5. How should the framework distinguish resilience correlation from causal contribution when multiple operational systems change at once?
6. What minimum evidence should an airline provide before claiming maturity in one of the six capability layers?
7. How should recovery, accessibility, privacy and fairness trade off against conversion and premium-personalization objectives?

## Reading boundary

This note establishes what the paper actually provides: a design-science, documentary, three-stage/six-layer governance architecture that binds passenger-facing value to offer/order and back-stage systems, proposes KPI ownership and executive accountability, and explicitly identifies substantial empirical-validation gaps. It does not establish that DPX-G360 improves airline outcomes, that the four illustrative airlines implement the framework, or that any proposed governance control is sufficient in production. Those judgments belong to Skill 04 Analysis or later empirical work.
