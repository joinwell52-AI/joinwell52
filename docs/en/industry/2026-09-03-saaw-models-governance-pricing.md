---
title: "Digital Workers and SaaW (2): Models, Governance and Pricing"
date: '2026-09-03'
research_date: '2026-08-30'
prepared_date: '2026-09-03'
column: industry-architecture
category: daily
article_type: comparative-study
edition: research-center
research_question: "How does model capability become inspectable role-based delivery, and how should governance and pricing relate to that delivery?"
summary: "Separating model capability from reliable delivery, this article examines evidence, authority, recovery, pricing structures and admission requirements for digital-worker roles."
cover: "/assets/covers/saaw-2026-part-2-cover.png"
language: en
series: saaw-commercial-landscape-2026
series_part: 2
lifecycle: Published
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/saaw-2026-part-2-cover.png"
  kicker="Industry Architecture · SaaW Landscape (2)"
  title="Digital Workers and SaaW (2): Models, Governance and Pricing"
  summary="Separating model capability from reliable delivery, this article examines evidence, authority, recovery, pricing structures and admission requirements for digital-worker roles."
  version="SaaW 2026 · 2/3"
  languageHref="/zh/industry/2026-09-03-saaw-models-governance-pricing"
  languageLabel="中文版"
/>

<!-- saaw-native-cover-note -->
<p class="saaw-cover-note">AI-generated conceptual cover. Screen interfaces and numbers are illustrative, not actual product screenshots or research data.</p>
<!-- /saaw-native-cover-note -->

# Global Real Digital Workers & SaaW Commercial Landscape 2026-2
## Models, Governance, Pricing, and Capability Tiers

Products may all write reports, change code or handle business processes while differing in delivery quality, failure handling and the final bill. Assessing readiness for a role requires more than a feature list: how does the model decide, how does the runtime constrain actions, and who accepts the result?

This volume uses our **SaaW (Software as an Agent Worker)** concept: software continuously delivers work under explicit responsibilities, permissions and governance rules. See [From SaaS to SaaW](https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-08-10-saaw-software-as-an-agent-worker). Volume 1 compares products and roles. Here we ask: **Which model makes decisions? How are model errors contained? Are software and model costs separate? How do these capabilities support D1–D5 classification?**

# 1. Models Are Not Interchangeable Processors

Business facts and fixed tools can mask model differences in short generation, single functions and simple support. Continuous decisions amplify those differences in repository engineering, open research and long cross-system tasks.

The project team previously encountered severe unsupported fabrication in model testing. Such experience cannot permanently condemn newer versions, but it motivates one rule:

> **Supporting a model does not automatically qualify a digital worker for a role. A configuration with a history of serious fabrication must pass real role evaluations again.**

The same model behaves differently in a chat window, a coding agent or a runtime with terminals, tests and checkpoints. The evaluation unit is:

```text
Model
+ runtime
+ tools and sources of truth
+ context compression and memory
+ permissions and recovery
= worker configuration
```

## 1.1 Representative Product Model Transparency

Transparency concerns disclosure of model choices and routing, not model quality or role capability. CodeFlowMu is our self-developed collaboration application/runtime and appears last alongside other products.

D1 denotes assistance; D2 predominantly preset automation; D3 autonomous task execution; D4 a sustained bounded role; D5 stronger authorization, acceptance and recovery.

| Product | Public Model / Routing | Transparency | Model-Cost Separation | Tier |
|---|---|---|---|---|
| Salesforce / Agentforce | Multi-model stack; exact routing varies by tenant and release and is not disclosed as one fixed model. | Medium | Model cost is bundled into credits or flat access, not transparently separated. | D3 |
| Microsoft / Copilot Studio / Microsoft 365 Copilot | Primarily GPT-family models with selectable models in some scenarios and external services. | Medium | Platform licensing plus credit meters; premium reasoning may add meters, so costs are partly separated. | D3 |
| ServiceNow / Autonomous Workforce / AI Specialists | Now LLM plus third-party models; the platform is positioned as model- and cloud-agnostic. | Medium | Model and platform costs are generally bundled in enterprise contracts. | D4 |
| Workday / Sana Agents / Agent System of Record | Gemini became the default model for Sana for Workday in 2026; other agents may use multiple models. | High | Credits meter agent work; model cost is not fully itemized. | D3 |
| Glean / Glean Agents / Independent Agents | Supports broad frontier-model choice; routing is task- and tenant-dependent. | Medium | Generally bundled into enterprise contracts; model cost is not public as a separate line. | D4 |
| Oracle / Fusion Agentic Applications | Supports Llama, Cohere, external industry models, and partner models. | High | The application platform and model/cloud consumption are partly separated. | D4 |
| Google Cloud / Gemini Enterprise Agent Platform | Primarily Gemini models, with support for customer and open models. | Medium | Clearly separated. | D3 (Platform) |
| Cognition / Devin | Core Devin routing is not fully disclosed; the product ecosystem exposes multiple frontier models. | Medium | Model, compute, and software capabilities are bundled in quotas/ACUs. | D4 |
| Sierra / Sierra Agents / Horizon Agents | Underlying model stack and routing are not disclosed. | Low | Model cost is fully bundled into outcome pricing. | D4 |
| Factory / Droids / Missions | Multi-model router supporting Claude, Gemini, Kimi, MiniMax, BYOK, and local models. | High | BYOK enables clear separation of software and model costs. | D4 |
| Harvey / Harvey | Publicly uses models from OpenAI, Anthropic, Google, Mistral, and others. | Medium | Models and platform are bundled. | D3 |
| Bland AI / Voice AI Agents | Proprietary voice/dialog stack; the company says production calls do not rely on third-party frontier models. | Medium | Fully bundled. | D3 |
| Laiye / Laiye Worker / WEP | Model-neutral routing lists DeepSeek-V4, Qwen3-Max, Kimi K2, Doubao 2.0 Pro and GLM-5.1; selection considers task, budget, latency and compliance. | **Very high** | Platform subscription, credits and enterprise-owned/private models can be partly separated. | D4 candidate (sustained role unverified) |
| Tencent / WorkBuddy | August 2026 official list includes Hy3, GLM-5.2/5.1, MiniMax-M3, Kimi-K2.7-Code/K2.6 and DeepSeek-V4-Flash/V4-Pro; custom OpenAI, Anthropic and Gemini integration. | **Very high** | Enterprise/custom models and private deployment allow model costs to be separated from software licensing. | D3 |
| Alibaba / DingTalk / Wukong | Exact model names are not disclosed; premium tiers expose model configuration parameters. | Low | Seat and compute credits are partly separated. | D3 |
| Baidu AI Cloud / Keyue Digital Employees | ERNIE / Baidu AI Cloud model stack. | High | Model and product package are bundled. | D2–D3 |
| Deepexi / DeepWorks / FastAGI | Configurable multi-model stack with FastAGI as runtime/guardrail layer. | Medium | Model and platform costs can be partly separated by deployment. | D3 |
| Langboat / LangClaw | Mengzi model family with configurable models. | Medium | Potentially partly separated; contract terms are not public. | D3 |
| SAP / Joule / Joule Agents | SAP Business AI multi-model stack; different use cases can use different foundation models. | Medium | Software subscription and premium agent usage are partly separated. | D3 |
| Dust / Dust Agents | 20+ models including GPT, Claude, Gemini, Mistral, and DeepSeek. | High | Credits bundle model and work usage; not fully separated. | D3 |
| Mistral AI / Agents API / Enterprise Workflows | Primarily Mistral models with enterprise hybrid deployment. | High | Platform and model calls can be metered separately. | D3 (Platform) |
| Relevance AI / AI Workforce | Multi-model with BYO LLM/API keys. | Medium | Explicitly separates agent Action fees from model/tool Vendor Credits. | D3 (Platform) |
| Torq / Socrates | Exact models are not fully disclosed; the platform meters AI Credits. | Medium | Models and agent actions are bundled into fixed credits. | D4 |
| causaLens / Digital Worker Factory | Model-agnostic, deployable on customer-selected models and infrastructure; workflow, trusted facts, causal verification and deterministic gates are central. | High: model strategy is explicit, without a fixed default model | Runtime and model costs can be separated on customer infrastructure. | D4 |
| CodeFlowMu / Author-developed product | Models reason; the runtime organizes team collaboration and work state. The current complete model/routing list was not verified. | Architecture responsibilities are public; current configuration list not uniformly disclosed | Current quotation and model-cost separation unverified. | **D4 (software engineering role)** |

## 1.2 Four Commercial Model Structures

![Figure 05: Software and model cost structures](/assets/saaw-2026/figures/05_en.png)

*Figure 05. Structural relationships only. Widths do not encode prices; deployments can combine patterns. Source: the author's synthesis of the corresponding analysis in this article and its listed references.*

| Structure | Meaning | Examples |
|---|---|---|
| Fully bundled | Customers pay per minute, conversation, result or plan without a visible model-cost line | Sierra, Bland, Intercom, Shulex |
| Seat + credits | Seats and agent usage are separate, while credits still bundle model costs | Microsoft, WorkBuddy, Wukong, Salesforce |
| Platform actions + model cost | Agent execution and model/tool consumption are metered separately | Relevance AI, Google Agent Platform |
| Bring your own model | Customer keys/private/local models can shift model costs to the customer; additional action/runtime fees depend on the plan | Factory, Relevance AI, enterprise-custom WorkBuddy, some UiPath/Laiye deployments |

Relevance AI illustrates the distinction: action fees cover agent execution, while Vendor Credits cover model/tool costs, with supplier-cost metering and customer keys described in its documentation. Separately explaining software value and model cost is a useful design for CodeFlowMu; actual charging still depends on the product plan.

## 1.3 Why Real Engineering Amplifies Model Differences

A digital software worker must preserve:

- Repository structure and architectural constraints.
- Consistency across files.
- Tests, builds, dependencies and CI state.
- Explicit user prohibitions.
- Failure causes and prior repairs.
- Git, worktree and branch state.
- Completion criteria and supporting evidence.

| Engineering task | Where differences appear |
|---|---|
| Write a function or explain an error | Leading models may be close |
| Change several files compatibly | Global consistency matters more |
| Failure → diagnosis → repair → retest | Recovery and causal judgment diverge |
| Large refactoring/migration | Locally correct changes can damage the whole system |
| Multi-hour unattended work | Drift, forgotten constraints and repeated side effects dominate |

Factory Missions offers one response: acceptance contracts, feature lists, research notes and runtime rules are shared files; Workers start with fresh context, Validators check output, and an Orchestrator organizes continuation or rework.

Cognition also compares model cost with real engineering rollouts. In the study's August 2026 materials, Devin Desktop/CLI offered GPT-5.6 Sol and compared score against cost on tasks such as FrontierCode, rather than relying only on launch benchmarks.

> **Worker capability depends jointly on the model, runtime, tools and facts, state and recovery, and governance. A standalone model score does not measure role delivery.**

### Why Long Tasks Amplify Small Differences

An earlier error can enter later context as a supposed fact and influence planning and actions. Checks, retries and recovery can interrupt that propagation. Long-task evaluations must observe error accumulation, detection and correction rather than one benchmark score.

Models therefore belong in role-admission decisions.

# 2. RPA, Agents and Digital-Worker Boundaries

RPA (Robotic Process Automation) usually executes predefined interface or system operations. Classification depends on the division of responsibility between models, workflows and runtimes.

| Type | Who decides the next step? | Capability | Typical risk |
|---|---|---|---|
| Traditional automation | Programmer-defined | Executes stable fixed processes | Interface/rule changes break it |
| LLM + workflow | Model interprets; workflow determines most paths | Natural-language entry and limited exceptions | A workflow bot may be marketed as an employee |
| Agentic execution | Model plans, selects tools and adapts | Completes a complex task | Drift, repeated side effects, confident errors |
| Digital worker | Model/runtime maintain role, tasks and state | Sustained cross-cycle work | Model changes alter role capability |
| High-trust software worker | Work governance contains errors | Can be authorized for production business work | Complete public evidence remains scarce |

RPA is useful in high-risk writes:

```text
Model: understanding and planning
+ rules / business systems: facts and boundaries
+ automation / APIs: deterministic execution
+ humans: exceptions and accountability decisions
```

The question is whether RPA acts as the worker's hands or determines the entire product's behavior.

# 3. How Commercial Products Contain Hallucination

Models can generate unsupported content. Enterprise systems must reduce errors, detect them and contain their effects on business actions.

| Defense | Techniques | Purpose |
|---|---|---|
| Grounding | CRM, ERP, knowledge, retrieval, business APIs | Constrain business claims with records |
| Scope | Roles, topics, skills, tool allowlists | Restrict questions and actions |
| Identity/least privilege | Role permissions, access control, agent identities | Limit authority despite model intent |
| Action schemas | Parameterized tools, business objects, deterministic processes | Validate parameters, permissions and rules |
| Call-time approval | One-time tokens, human approvals, escalation | Separate capability from current permission |
| Runtime evaluation | Simulation, regression, output checks, injection detection | Find deviations before and during operation |
| Observability/audit | File, command and API logs; cost/outcome dashboards | Diagnose, assign responsibility, stop and improve |
| Recovery/rollback | Checkpoints, versions, compensation, idempotency | Avoid duplicate writes and lost responsibility |

## 3.1 What Enterprise Governance Already Does

- Salesforce constrains models with CRM facts, permissions, actions, monitoring and audit.
- ServiceNow discovers, observes, governs and disables misbehaving agents, recording files, commands and API calls.
- Glean provides request-level checks, identities, scoped credentials, checkpoints, evaluations, approvals and rollback.
- UiPath combines injection/sensitive-data defenses, mandatory human intervention and deterministic robot execution.
- Oracle supplies roles, approval hierarchies, transactional context, shared memory and action history.
- Torq governs security tools, policy, approvals and remediation audit.

These are real controls, mainly over assets, security, access and runtime behavior.

## 3.2 Why Work Governance Adds Further Questions

Open knowledge work must also establish:

- Which source supports a market number, legal conclusion or technical judgment?
- Is it a source fact, inference or unproven assumption?
- How are conflicting sources preserved?
- Who reviews independently and accepts the conclusion?
- Does formal responsibility survive model changes or process restarts?

> **Agent governance addresses safe software operation. Work governance also addresses why a conclusion is valid and who is responsible for it.**

## 3.3 Five Reliability Layers

![Figure 06: Five reliability layers and their boundaries](/assets/saaw-2026/figures/06_en.png)

*Figure 06. Different defenses answer different questions. This is not a vendor score or a claim that one product implements all five layers. Source: the author's synthesis of the corresponding analysis in this article and its listed references.*

| Layer | Techniques | Question addressed | Remaining limit |
|---|---|---|---|
| 1. Prompt guardrails | System prompts, prohibited terms, formats | Reduces obvious boundary violations | Confident fabrication remains possible |
| 2. Grounding | Retrieval, enterprise knowledge, CRM/ERP, APIs | Grounds business facts outside model memory | Does not guarantee correct reasoning |
| 3. Agent governance | Identity, permissions, allowlists, approval, audit | Controls actions and authority | Does not prove delivery claims |
| 4. Decision verification | Trusted Facts, structured claims, deterministic gates, judges | Checks whether decisions follow trusted facts and rules | Does not establish complete organizational accountability |
| 5. Work governance | Formal tasks, delivery, fact checking, observation, acceptance authority, continuity | Establishes responsibility, accepted results and valid state | Requires organizational adoption and institutional fit |

causaLens describes Layer-4 mechanisms: Trusted Facts retain system-computed evidence; Structured Decision Claims organize facts, rules and recommendations; a Deterministic Verification Gate checks rules before model evaluation and returns failed outputs to execution.

This adds checks on decision support beyond retrieval-augmented generation (RAG) and prompts. **Fact checking and independent evaluation already appear in commercial technical designs.**

TMPA (Textual Multi-Agent Process Architecture), used by CodeFlowMu, also asks how checked judgments become traceable formal work results through tasks, delivery, acceptance and responsibility facts.

## 3.4 Comparing Governance Mechanisms

| Product | Grounding | Action authority | Human approval | Runtime evaluation | Deterministic verification | Independent Judge/EVAL | Durable responsibility facts |
|---|---|---|---|---|---|---|---|
| ServiceNow | Strong | Strong | Strong | Very strong | Partial | Evaluation system | Weak/platform-local |
| Glean | Strong | Per-request/action checks | Strong | Strong | Partial | Alignment/evals | Weak |
| Relevance AI | Connector-dependent | Edge configuration | Strong | Task View/logs | Weak | Weak | Task-level |
| causaLens | Very strong | Strong | Strong | Strong | Very strong | Judge Agent | Medium |
| Factory | Code/test facts | Tools/sandbox | User takeover | Validator | Validation contract | Validator | Project-task level |
| SAP | SAP business facts | Enterprise permissions | Strong | Enterprise monitoring | Business rules/processes | Partial | Platform-process level |
| CodeFlowMu | Tasks, reports and engineering evidence | Role permissions and governance decisions | Human approval entry | Public regression and implementation cases | Fixed-input state/rule checks | Separate QA; EVAL observes alongside execution | Persistent tasks, reports, reviews and recovery records |

These are qualitative comparisons from public mechanisms, not uniform test scores. CodeFlowMu evidence includes public collaboration and V1.8.0 results in I1.0. Role authorization checks do not prove call-time authorization for every external action.

# 4. Why Support and Open Research Differ in Delivery Difficulty

Support and enterprise transactions have clear facts, bounded actions and measurable completion: orders, logistics and refund eligibility come from systems and rules; operations include lookup, address changes, refunds, tickets and escalation.

Open research has no single truth database. It requires source selection, quality assessment, conflict handling, fact/inference separation and responsibility for conclusions. Retrieval establishes what was found, not whether a conclusion is correct.

| Work | Fact certainty | Action space | Completion criterion | Fit for current agents |
|---|---|---|---|---|
| Support/orders/employee self-service | High | Small | Clear | Very high |
| Sales/procurement/contract triage | Medium | Medium | Partly measurable | Medium-high |
| Software engineering | Medium | Large | Partly verified by tests/review | Medium-high, model-sensitive |
| Business research/strategy | Low | Large | Hard to verify automatically | Low |
| High-risk finance/legal decisions | Medium | Medium | Major liability | Human final authorization required |

# 5. Pricing Units Reveal the Delivery Unit

![Figure 07: Pricing units and actual delivery](/assets/saaw-2026/figures/07_en.png)

*Figure 07. Units are grouped into access, activity, capacity and outcomes. Arrows describe different delivery objects, not a universal migration or proof that outcome pricing dominates. Source: the author's synthesis of the corresponding analysis in this article and its listed references.*

| Pricing Unit | What the Customer Buys | Examples |
|---|---|---|
| Seat | Access for a human user | M365 Copilot, Wukong, WorkBuddy |
| Credits | Agent/model capacity | Microsoft, WorkBuddy, SAP, Torq |
| Action | One tool/business action | Salesforce, Relevance AI, SAP |
| Conversation | One customer interaction | Salesforce, Ada, Decagon |
| Resolution | A validated solved issue | Zendesk, Intercom, Yellow.ai |
| Lead | One researched/contacted prospect | 11x, Artisan |
| Minute | Voice labor | Bland, PolyAI, Parloa |
| Agent Compute Unit | Planning, tools, code, and runtime resources | Devin |
| Outcome | Retention, sale, resolution, collection, etc. | Sierra |

### Pricing Changes Highlighted in the 2026 Study

- **HubSpot:** Customer Agent at **$0.50/successful resolution**; Prospecting Agent at **$1/recommended outreach lead**.
- **Intercom Fin:** **$0.99/outcome** (resolution, procedure handoff or disqualification); successful sales qualification **$9.99**. Failure or a user-requested human handoff does not incur an outcome fee.
- **Zendesk:** From May 2026, Automated Resolution/Resolution Allowance meters successful AI resolutions without escalation, with complexity tiers.
- **Relevance AI:** Platform action fees and model/tool Vendor Credits are separate. The cited documentation lists **$80/additional 1,000 Actions**, supplier-cost pass-through and customer keys.
- **Laiye Worker:** RMB39/199 plans, credits and enterprise governance/private deployment illustrate China's hybrid structure.
- **WorkBuddy Enterprise:** RMB198/316 per user/month, credits and private deployment show continued seat pricing plus agent usage.

```text
Software access
→ human productivity
→ agent actions
→ digital work capacity
→ verifiable business outcomes
```

Outcome charging is not yet universal. Many products still use seats, credits and enterprise contracts.

# 6. Capability Tiers and Sample Totals

The same Volume 1 comparison contains **55 entries: 54 original commercial samples plus CodeFlowMu**. Capability and paid commercial status are separate; D2–D3 boundary cases retain their labels.

| Tier/label | Count | Examples | Conclusion |
|---|---|---|---|
| D1 | 0 in main table | Pure Q&A/search excluded | Does not imply absence from the market |
| D2 | 0 standalone | Boundary entries appear below | Boundaries are not forced into D2 |
| D2–D3 boundary | **9** | Baidu Keyue, Robin, Juro, LayerX | Planning versus preset workflow needs product-level assessment |
| D3 | **36** | Salesforce, Microsoft, UiPath, SAP, Zendesk, Intercom, WorkBuddy, Wukong | Largest sample category, including 3 platforms |
| D4 | **9** | ServiceNow, Glean, Oracle, Devin, Sierra, Factory, Torq, causaLens, **CodeFlowMu** | Public-evidence initial assessments; CodeFlowMu is limited to software engineering |
| D4 candidate | **1** | Laiye Worker | Execution/routing evidence exists; sustained role needs verification |
| D5 | 0 | No award | Public evidence does not fully cover the report's conditions |
| Total | **55** | 54 commercial samples + 1 self-developed product | Mutually exclusive labels |

Counts describe sampling and classification, not market share. Platform configurations may occupy different tiers.

## 6.1 Role Capability Versus High-Trust Governance

- Devin spans repositories but needs large tasks decomposed and ambiguous architecture clarified.
- Sierra spans days/weeks, with limited model, evidence and recovery disclosure.
- ServiceNow/Oracle have strong governance but focus less on evidencing open knowledge conclusions.
- Factory supports long tasks and multiple models, while acceptance is mainly engineering validation.
- Glean has identity, credentials, evaluations and rollback; customer-built agents vary.
- Torq acknowledges nondeterminism and recommends fixed workflows when determinism is required.
- causaLens has trusted facts, deterministic verification and judges, but public evidence is incomplete for cross-task formal responsibility, side-effect receipts and final governance-state reconstruction.

# 7. Model Admission for Digital Workers

![Figure 08: Model admission evaluates the configuration](/assets/saaw-2026/figures/08_en.png)

*Figure 08. Role risk → capability profile → model/host/tool/runtime evaluation → allow, restrict, require review or reject. This is a proposed framework, not completed benchmark results. Source: the author's synthesis of the corresponding analysis in this article and its listed references.*

A runtime should maintain role requirements and configuration admission, rather than only `model = X`.

```text
Role risk and task type
→ Required capability profile
   Facts / instructions / long tasks / tools / recovery
→ Evaluate model + host + tools + runtime
→ Allow / restrict / require independent review / reject
```

Admission should produce actionable conclusions rather than only an aggregate score:

```text
Configuration A
Information organization: allow
Content drafts: allow with review
Business research conclusions: restrict
Production code changes: independent tests and review required
High-risk external actions: reject
```

## 7.1 Model Capability Profile

| Dimension | Real evaluation question |
|---|---|
| Factual reliability | Does it admit uncertainty or invent sources, files and API results? |
| Long-task stability | Does it drift after 30 minutes, two hours or multiple days? |
| Tool use | Are tool choice, parameters and order correct? |
| Instruction retention | Does it retain prohibitions on editing/publishing and requirements to verify? |
| Recovery | Does it resume correctly after tool failure, host restart or model change? |
| Self-checking | Does it detect contradictions rather than defend earlier conclusions? |
| Evidence discipline | Does it separate external facts, tool results, inference and assumptions? |
| High-risk actions | Should it receive write authority or only propose actions? |

Example minimum role requirements:

```text
Support lookup: moderate reasoning + strong facts
Software development: repository understanding + tools + tests + recovery
Business research: source discipline + conflict handling + independent review
Critical finance/legal action: strong model + deterministic rules + human final authorization
```

Model substitution must not be confused with equivalent capability.

# 8. Volume Conclusion

The competitive questions are who can:

1. Constrain model uncertainty within facts, tools and authorization.
2. Admit different models only to suitable roles.
3. Explain software costs, model costs and delivery clearly.
4. Reconstruct accountability after failure rather than merely retry an API.
5. Turn completion claims into evidenced, independently reviewable delivery.

Volume 3 examines public implementations of identities, task ledgers, pre-action authorization, recovery, phone supervision and installation, then develops CodeFlowMu's product direction.

# 9. References

Product and pricing information follows the original research scope; current vendor terms govern actual purchases and configurations. Tiers and qualitative comparisons are not uniform product tests.

- [causaLens Digital Worker Factory](https://causalens.com/our-digital-worker-factory)
- [causaLens reliability](https://causalens.com/the-reliability-features)
- [Factory Missions architecture](https://factory.ai/news/missions-architecture)
- [ServiceNow evaluation metrics](https://www.servicenow.com/docs/r/intelligent-experiences/mon-ai-evaluation-metrics-reference.html)
- [Glean agent governance](https://www.glean.com/ai-agents/agent-governance)
- [Relevance AI pricing](https://relevanceai.com/docs/get-started/pricing)
- [Relevance AI approvals](https://relevanceai.com/docs/build/workforces/workforce-features/approvals-and-escalations)
- [Intercom Fin outcomes](https://www.intercom.com/help/en/articles/8205718-fin-ai-agent-outcomes)
- [Zendesk resolution tiers](https://support.zendesk.com/hc/en-us/articles/9570369117338-About-automated-resolution-tiers)
- [HubSpot outcome pricing](https://www.hubspot.com/company-news/hubspots-customer-agent-and-prospecting-agent-now-you-pay-when-the-task-is-complete)
- [Laiye Worker](https://laiye.com/product/worker)
- [WorkBuddy model configuration](https://cloud.tencent.com/document/product/1831/134445)
- [WorkBuddy pricing](https://cloud.tencent.com/document/product/1831/134333)
- [Devin GPT-5.6 Sol engineering cost comparison](https://devin.ai/blog/gpt-5-6-sol-price-drop)
- [CodeFlowMu public project description](https://github.com/joinwell52-AI/joinwell52/blob/main/README.zh-CN.md)
- [CodeFlowMu development collaboration](https://joinwell52-ai.github.io/joinwell52/zh/digital-employee/2026-08-18-cursor-ai-development-team)
- [CodeFlowMu V1.8.0 I1.0 implementation evidence](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/zh/publications/implementation-case-i1.0/part-02.md)
