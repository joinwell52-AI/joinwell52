---
title: "Global Real Digital Workers & SaaW Commercial Landscape 2026-3"
date: '2026-09-03'
research_date: '2026-08-30'
prepared_date: '2026-09-03'
column: open-source-engineering
category: daily
article_type: comparative-study
edition: research-center
research_question: "How should open-source components and protocols divide responsibilities to support continuous, inspectable digital-worker systems under human oversight?"
summary: "Comparing 23 public projects and distinct protocol responsibilities, this article explores multi-agent roles, local execution, human oversight and the CodeFlowMu product roadmap."
cover: "/assets/covers/saaw-2026-part-3-cover.png"
language: en
series: saaw-commercial-landscape-2026
series_part: 3
lifecycle: Published
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/saaw-2026-part-3-cover.png"
  kicker="Open-source Engineering · SaaW Landscape (3)"
  title="Global Real Digital Workers & SaaW Commercial Landscape 2026-3"
  summary="Comparing 23 public projects and distinct protocol responsibilities, this article explores multi-agent roles, local execution, human oversight and the CodeFlowMu product roadmap."
  version="SaaW 2026 · 3/3"
  languageHref="/zh/engineering/2026-09-03-saaw-open-source-protocols-roadmap"
  languageLabel="中文版"
/>

<ArticleTableScroll language="en" />

# Global Real Digital Workers & SaaW Commercial Landscape 2026-3
## Open Technology, Protocol Roles, and CodeFlowMu Product Direction

A framework may save state, call tools and coordinate agents. Enterprise delivery still requires installation, permissions, handoffs, acceptance and recovery. This volume examines what public ecosystems already provide and which mechanisms belong in product design.

**SaaW (Software as an Agent Worker)** describes software that continuously delivers outcomes as a digital work subject. **CodeFlowMu** is our self-developed multi-agent collaboration application/runtime. It uses **FCoP (File-based Coordination Protocol)** for work handoffs and **TMPA (Textual Multi-Agent Process Architecture)** to address responsibility, permissions and governance facts. See our [SaaW concept article](https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-08-10-saaw-software-as-an-agent-worker).

Volumes 1–2 compare commercial products and delivery. This volume compares public implementations, protocols and product directions. Public source helps inspect mechanisms, but does not prove willingness to pay.

# 1. Open Technology Radar

The table contains **23 public projects**, spanning products, frameworks and specifications. Compare their delivery objects before comparing mechanisms.

**M denotes an initial engineering-maturity assessment:** M1 concept, M2 prototype, M3 runnable implementation, M4 more complete engineering/product form, M5 broader production validation. Plus/minus signs indicate transitions. M is separate from D1–D5 role capability and S1–S5 specification maturity. Research priority uses Priority, High and Regular; it is not a capability score.

| Project | Region | Technical category | License / public availability | Engineering maturity | Installation | Technical focus | Priority | Repository |
|---|---|---|---|---|---|---|---|---|
| Paperclip | United States | AI company / workforce control plane | MIT | M4- | Node/Web; embedded PostgreSQL | Organization, goals, budgets, atomic task checkout, recovery, audit | Priority | [github.com/paperclipai/paperclip](https://github.com/paperclipai/paperclip) |
| StaffDeck | China | Enterprise digital-employee platform | AGPL-3.0 | M3+ to M4- | Windows EXE / macOS DMG / Linux DEB | Employee profiles, state-machine SOPs, knowledge, memory, schedules, human takeover | Priority | [github.com/OpenBMB/StaffDeck](https://github.com/OpenBMB/StaffDeck) |
| iML Work | Region unverified | Local business work clone | MIT | M3 | Windows client; local SQLite | Real OA/CRM/ERP operation, one-time write authorization, local credentials, audit | Priority | [github.com/imoling/iml-work](https://github.com/imoling/iml-work) |
| Orkas | Region unverified | Local multi-agent desktop | MIT | M4- | Windows Setup / macOS DMG | Local-first, multi-model, role agents, low infrastructure burden | Priority | [github.com/Orkas-AI/Orkas](https://github.com/Orkas-AI/Orkas) |
| Fusion | Region unverified | Agent software factory / work surface | MIT | M3+ | npm/Homebrew; PWA + iOS/Android | Task boards, missions, agent companies, multi-node execution, review, mobile control | Priority | [github.com/Runfusion/Fusion](https://github.com/Runfusion/Fusion) |
| TSA AI Workforce | Malaysia | Governed local digital workforce | MIT | M3+ | Windows/macOS/Linux | Separate identity, credentials, audit, approvals, local PostgreSQL | Priority | [github.com/Steveser1989/TSA-AI-Workforce](https://github.com/Steveser1989/TSA-AI-Workforce) |
| Eigent | United Kingdom | Open cowork desktop / workforce | Apache-2.0 | M4 | Desktop app; full local backend is heavier | Multi-agent office work; cloud/local/enterprise paths | High | [github.com/eigent-ai/eigent](https://github.com/eigent-ai/eigent) |
| OneManCompany | Region unverified | One-person company OS | Apache-2.0 | M3+ | One-command npx launch | Organization, hiring, performance, review, quality gates, multiple roles | High | [github.com/1mancompany/OneManCompany](https://github.com/1mancompany/OneManCompany) |
| OpenHire | Region unverified | Digital-employee orchestration | MIT | M3 | Python CLI + Web + Docker worker | Employee orchestration, workspaces, container execution | High | [github.com/pzy2000/OpenHire](https://github.com/pzy2000/OpenHire) |
| CrewMeld | China | Enterprise digital employee + SOP | Open core | M3+ | Docker/Helm/Kubernetes | Employees, SOPs, human-approval breakpoints, resume, multi-tenancy; heavy stack | High | [github.com/proinsight-io/crewmeld](https://github.com/proinsight-io/crewmeld) |
| OpenVort | China market | Enterprise AI-employee platform | AGPL-3.0 | M3+ | Docker Compose | WeCom/DingTalk/Feishu, skills, schedules, Docker work computer | High | [github.com/openvort/openvort](https://github.com/openvort/openvort) |
| OACP / KiloLoop | US ecosystem | File-based agent coordination protocol | Apache-2.0 | Protocol M3+ | CLI + files; no central server | Inbox/outbox, typed messages, review, quality gates, recovery, signing | High | [github.com/kiloloop/oacp](https://github.com/kiloloop/oacp) |
| Gas Town + Beads | US ecosystem | Multi-agent workspace + durable task ledger | MIT | M3+ | CLI / binaries | Long-task claiming, supervision, recovery, Dolt-backed durable facts | High | [github.com/gastownhall/gastown](https://github.com/gastownhall/gastown) |
| Microsoft Sico | US / global | Digital-worker infrastructure | MIT | Technical M4 | Docker/Kubernetes; heavy stack | Digital workers, operators, perception/action/memory, evolution | Regular | [github.com/microsoft/Sico](https://github.com/microsoft/Sico) |
| Palmier | Individual project | PC-agent remote supervision | Apache-2.0 | M3 | Host daemon + PWA + Android | Mobile task initiation, schedules, approvals, notifications, device capabilities | High | [github.com/caihongxu/palmier](https://github.com/caihongxu/palmier) |
| SIDJUA | Region unverified | Pre-action agent governance | AGPL-3.0 | M3 | Docker/npm; SQLite | Pre-action authorization, policies, sandboxing, audit | Regular | [github.com/GoetzKohlberg/sidjua](https://github.com/GoetzKohlberg/sidjua) |
| TICK.md | US ecosystem | Markdown-native multi-agent task protocol | MIT | Protocol M3 | npm + MCP + Git | Single TICK.md, task claims, dependencies, state, Git audit, MCP | Priority | [github.com/Purple-Horizons/tick-md](https://github.com/Purple-Horizons/tick-md) |
| KanBanLess | Community | Directories as board, Markdown as tasks | Specific license unverified | M2–M3 | Filesystem/Git | Directories define states; moving a file transitions a task | Regular | [github.com/markdav-is/KanBanLess](https://github.com/markdav-is/KanBanLess) |
| Agent Wiki | US ecosystem | Shared human/agent text knowledge | Source available | M3 | Markdown + filesystem + Git | Self-updating knowledge, hierarchical files, MCP/agent collaboration | Regular | [github.com/onyx-dot-app/agent-wiki](https://github.com/onyx-dot-app/agent-wiki) |
| CrewAI | United States | Multi-agent role/team framework | MIT | Technical M4 | Python/PyPI | Roles/goals, managers, delegation, planning, guardrails, checkpoints, Crew + Flow | Priority | [github.com/crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) |
| LangGraph | United States | Stateful agent execution graphs | MIT | Technical M4+ | Python/JS | Checkpoints, threads, interrupt/resume, replay/fork, human intervention | Priority | [github.com/langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) |
| Open Agent Spec | US / Oracle | Portable agent-definition specification | Apache-2.0 / UPL | Specification M3+ | Python SDK / JSON / YAML | Framework-neutral agents/flows/multi-agent declarations, serialization, adapters, conformance work | Priority | [github.com/oracle/agent-spec](https://github.com/oracle/agent-spec) |
| AGNTCY / OASF | Global / LF ecosystem | Agent capability and metadata schema | Apache-2.0 | Specification M4 | Schemas, SDK, validation services | Capability/skill/domain/dependency records and validation; directory and identity services belong to related ecosystem components | Priority | [github.com/agntcy/oasf](https://github.com/agntcy/oasf) |


# 2. Protocols and Specifications: From Project Conventions to Open Standards

![Figure 09: From project convention to open standard](/assets/saaw-2026/figures/09_en.png)

*Figure 09. S1–S5 is an ordinal specification-maturity framework, not a percentage. FCoP/TMPA positions are initial research assessments; further judgment requires independent implementations, external adoption and cross-implementation evidence. Source: the author's synthesis of the corresponding analysis in this article and its listed references.*

A repository, package or MCP toolset alone does not establish an industry standard.

| Maturity | Criterion | Meaning |
|---|---|---|
| S1 Project convention | Fixed format/convention inside one project | Demonstrates internal use |
| S2 Reusable implementation | Repository, package, SDK, CLI or MCP service | Others can install and reuse it |
| S3 Formal specification | Versioned semantics, schemas/data structures and compatibility policy | More than implementation code |
| S4 Verifiable ecosystem specification | Reference implementation, public conformance method and cross-implementation results | Compatibility can be checked against common rules |
| S5 Open industry standard | Independent implementations, production use, neutral governance and stable releases | Does not depend on one vendor/author |

## 2.1 Representative Protocols and Specifications

| Protocol/specification | Problem addressed | Initial assessment | Relation to TMPA/FCoP |
|---|---|---|---|
| MCP (Model Context Protocol) | Standard access to tools, resources and context | S5 | Tool connection does not decide formal work acceptance |
| A2A (Agent2Agent) | Cross-vendor discovery, communication, tasks and artifacts | S5 | Task states do not define organizational responsibility or business acceptance |
| AGNTCY / OASF | Capability, skill, domain and dependency metadata | S4 | Capability schemas; authorization/acceptance are separate |
| Open Agent Spec | Framework-neutral JSON/YAML agents, flows and multi-agent systems | S3+ to S4- | Specification-first agent definitions |
| OpenTelemetry GenAI/agent conventions | Common names for traces, spans, metrics and observations | S4; agent portion evolving | Observation vocabulary does not determine governance effect |
| FCoP | Formal TASK/REPORT/ISSUE/REVIEW semantics and lifecycle | S3+, early ecosystem | Executable protocol; external adoption and independent implementations remain limited |
| TMPA | Reconstructing responsibility, authority, conflict and effective governance state | S3-, research/specification stage | Executable governance specification/reference architecture, not an industry standard |

## 2.2 MCP: A Standardization Path for Tool Access

```text
Formal specification
→ versioned releases
→ language SDKs
→ PyPI / npm distribution
→ official Registry
→ independent hosts and servers
→ neutral foundation and working groups
```

The 2026-07-28 specification adds a stateless core, authorization improvements, extensions and a Tasks extension. The official Python SDK is distributed as `mcp`.

Sources: [release announcement](https://blog.modelcontextprotocol.io/posts/2026-07-28/), [Registry documentation](https://registry.modelcontextprotocol.io/docs), [Python SDK](https://github.com/modelcontextprotocol/python-sdk).

**PyPI is a distribution channel, Registry a discovery channel, and the specification the protocol authority.**

## 2.3 A2A: Tasks, Artifacts and Messages Across Vendors

A2A defines:

- **Message:** interaction content.
- **Artifact:** task output.
- **TaskState:** submitted, running, completed, failed, canceled, or waiting for input/authorization and related states.

These distinguish a message exchange from a trackable task. Exact names and wire encodings depend on the adopted [specification version](https://a2a-protocol.org/latest/specification/).

This overlaps with FCoP's formal task/delivery objects and lifecycle. However:

```text
A2A task completed
= remote execution successfully ended at protocol level

Execution ended
≠ automatically PASS / Accepted in organizational terms
```

Protocol completion alone does not establish who has final business acceptance authority, whether self-declared completion suffices, how artifact claims are checked, how QA conflicts are preserved, why accepting a failed result must not rewrite FAIL into PASS, or how accountability is reconstructed after restart.

Enterprise acceptance rules must therefore be connected to interoperability states.

## 2.4 What a Package and MCP Service Establish

FCoP has versioned normative text, lifecycle/events/boundary rules and schemas, the `fcop` Python reference library, `fcop-mcp`, PyPI distribution, the Registry entry `io.github.joinwell52-AI/fcop`, stability/compatibility/migration policies and citable DOI/OSF/Git history.

Sources: [fcop](https://pypi.org/project/fcop/), [fcop-mcp](https://pypi.org/project/fcop-mcp/), [FCoP repository](https://github.com/joinwell52-AI/FCoP).

> **FCoP is an executable multi-agent behavior-governance protocol with a formal specification, reference implementation, packages and MCP distribution.**

Calling it an industry standard would require independent third-party implementations, adoption outside CodeFlowMu, cross-implementation conformance, multi-organization governance and other products publicly supporting it.

**An MCP Registry entry makes the service discoverable; it does not mean the MCP community has adopted FCoP as a standard.**

## 2.5 TMPA: What It Is and What Remains Unproven

TMPA is closer to **governance architecture + formal specification + Reference Reader + conformance tests** than a networking protocol or agent SDK.

It defines durable work facts; responsibility, authority, acceptance and conflict objects; why traces are not governance; evidence-based reconstruction of effective state; fail-closed Reader behavior; and separation of execution and governance state.

> **TMPA is an executable multi-agent work-governance specification and reference architecture.**

Industry-standard status still requires a second independent implementation, external adoption, cross-implementation conformance, public compatibility matrices and multi-organization governance.

## 2.6 Standardization Lessons for TMPA/FCoP

![Figure 10: Protocol responsibilities from tools to accountability](/assets/saaw-2026/figures/10_en.png)

*Figure 10. Logical responsibilities, not a superiority ranking or mandatory dependency stack. OpenTelemetry spans layers as observability. Source: the author's synthesis of the corresponding analysis in this article and its listed references.*

### Freeze a Minimal Normative Core

FCoP governs agent behavior and does not own the runtime. TMPA defines governance facts rather than duplicating an execution framework.

### Prefer Conformance Evidence to Feature Counts

Different implementations should process the same normative vectors and produce comparable results.

### The Next Milestone: A Second Implementation

A third party should be able to implement a compatible Reader/Writer from the specification without using the official Python package. Examples include TypeScript Readers, Go validators, native runtime support for TASK/REPORT and a non-CodeFlowMu project passing the same conformance tests.

### Layer with MCP/A2A

```text
MCP: tools and resources
A2A: cross-runtime/vendor communication
OASF / Agent Spec: agent metadata, capabilities and definitions
OpenTelemetry: traces, spans and metrics
FCoP: formal work behavior and artifacts
TMPA: governance facts and responsibility reconstruction
CodeFlowMu: digital-worker product/runtime
```

This positions TMPA/FCoP as work-governance mechanisms alongside tool, communication and observation protocols.

# 3. Capabilities Already Present in Public Ecosystems

Public implementations already cover files/YAML/Markdown for roles, tasks and state; multi-agent managers and company structures; local-first desktops and installers; schedules, memory and approvals; phone supervision; task claims and durable ledgers; recovery; allowlists, policies and sandboxes; SOP state machines and quality gates.

Sustained roles require connecting these components:

```text
Durable identity + role responsibility + call-time authorization
+ formal work contract + evidence-backed delivery + valid state transitions
+ independent review + idempotent recovery + responsibility reconstruction
```

# 4. Implementation Mechanics: Roles, State and Specifications

Official documentation, source entry points and specification objects help distinguish framework mechanics from application rules.

## 4.1 CrewAI: Agent Configuration Versus Team Orchestration

An `Agent` configures role, goal, backstory, model, tools and delegation permission. A `Crew` organizes tasks, planning and hierarchical process settings. Hierarchical managers distribute tasks and inspect results. Checkpoints and guardrails need component/version-specific assessment rather than being attributed to one Agent object. See [Agent documentation](https://docs.crewai.com/en/concepts/agents) and [Crew documentation](https://docs.crewai.com/en/concepts/crews).

Roles and manager scheduling have reusable implementations. Products must additionally decide whether an executor may approve its own output, how rework occurs and which decisions belong to humans.

## 4.2 LangGraph: Saving and Resuming Execution State

Checkpoints and persistence retain execution state; thread identifiers associate later invocations. Interrupt/resume and historical recovery/forking are supported. Values, metadata, parent checkpoints and pending writes reside across related structures/interfaces, not one Checkpoint field set. Cross-process restart requires a persistent backend; an in-memory saver is insufficient. See [persistence documentation](https://docs.langchain.com/oss/python/langgraph/persistence).

```text
LangGraph checkpoint: where execution reached and what state it holds
TMPA governance fact: who is responsible, what was accepted and why state is valid
```

Source entry points: [checkpoint base](https://github.com/langchain-ai/langgraph/blob/main/libs/checkpoint/langgraph/checkpoint/base/__init__.py), [interrupt](https://github.com/langchain-ai/langgraph/blob/main/libs/prebuilt/langgraph/prebuilt/interrupt.py).

## 4.3 TICK.md: Markdown and Git Task Coordination

TICK.md uses Git-backed Markdown for tasks and offers agent registration, add/claim/done/reopen, dependencies, Git audit, an MCP server, stale-write detection, watch/monitor and orchestrator/worker role instructions.

Compare how tasks, reports, issues and reviews acquire distinct semantics and how transitions are constrained. [Repository](https://github.com/Purple-Horizons/tick-md).

## 4.4 Open Agent Spec: Specification, SDK and Runtime Adapters

Oracle Open Agent Specification defines serializable, framework-neutral JSON/YAML Agents and Flows. PyAgentSpec is its Python SDK; adapters and conformance semantics support portability across runtimes. [Repository](https://github.com/oracle/agent-spec).

A lesson for FCoP is that the specification should be implementable without the official package. A possible research separation is:

```text
FCoP Language: roles, authority, artifacts and lifecycle declarations
FCoP Protocol: TASK / REPORT / ISSUE / REVIEW / OBSERVATION semantics
Host Adapters: filesystem, Git or MCP integration
```

This is a proposal. The current file protocol is not equivalent to arbitrary database encodings; cross-storage governance representations belong in separately defined and validated TMPA implementations.

# 5. How Commercial Products and Public Projects Complement Each Other

| Question | Commercial Strength | Open-Source Research Value |
|---|---|---|
| Real customers and systems | Salesforce, SAP, ServiceNow, Yonyou, Kingdee | iML Work and OpenVort expose lightweight local integration ideas |
| Installation | WorkBuddy, Wukong, Devin | Orkas, StaffDeck, TSA prove installer-based delivery |
| Company control plane | ServiceNow, Glean | Paperclip makes org, budget, task claim, and recovery inspectable |
| Employee profiles / SOP | Baidu, Laiye | StaffDeck exposes employee profiles and state-machine SOPs |
| Durable tasks and recovery | Usually proprietary | OACP and Gas Town/Beads are auditable |
| Pre-action authority | Enterprise permissions and approvals | iML Work and SIDJUA expose one-time and pre-action authorization |
| Mobile supervision | WorkBuddy, Wukong | Palmier and Fusion show PC execution + phone supervisor |
| Model/runtime separation | Relevance, Factory, Laiye | Open desktops expose BYOK, local, and multi-model options |

# 6. Selected Public Projects

## 6.1 Paperclip

Its company control plane covers organization, goals, budgets, tasks, claim locks, heartbeats, approvals, audit, recovery and portable company templates. It provides a product reference but is heavier than the proposed one-PC/one-worker route.

## 6.2 StaffDeck

A direct Chinese open-source digital-worker reference, with profiles, roles, skills, knowledge, state-machine SOPs, scheduling, takeover and Windows/macOS/Linux installers. Installation and reusable role assets are useful lessons; CodeFlowMu need not become a heavy knowledge/SOP platform.

## 6.3 iML Work

Local business login state and credentials, and one-time authorization for specific writes, distinguish tool access from permission for a particular action.

## 6.4 OACP, Gas Town and Beads

File protocols, durable task ledgers, claims, reviews and recovery are not unique to CodeFlowMu. FCoP's value must concern formal responsibility semantics, single-writer facts, evidence and valid-state reconstruction.

## 6.5 Palmier and Fusion

These provide PC-execution/phone-supervision references. The phone can handle tasks, approvals, notifications and exceptions without introducing a conflicting second work state.

## 6.6 SIDJUA

Pre-action authorization, policies and sandboxing are relevant to separating general capability from permission for this action on this object.

## 6.7 Open Agent Spec and OASF

Open Agent Spec declares execution structures; OASF describes capabilities, skills, domains and dependencies. OASF alone is not the whole AGNTCY identity, directory and communications ecosystem.

Specifications and their official implementations should be assessed separately. Independent compatible implementations are stronger portability evidence than feature count.

# 7. Core Architecture Comparison

Current CodeFlowMu is an independent closed-source product line. CodeFlowMu Open is the historical MIT release frozen on 2026-08-22 at V1.2.29-open, not the current distribution or a guarantee of all current capabilities. Current CodeFlowMu belongs in the architecture comparison, not the 23-public-project table.

Core references include causaLens specialist teams/trusted facts/Judge; Factory Orchestrator/Worker/Validator with external state; SAP role assistants and specialist agents; ServiceNow orchestration and trace/span diagnostics; Relevance Manager/edges/approvals/Task View; Glean action permissions/evaluations; CrewAI role/delegation; LangGraph state/handoffs/checkpoints; and TICK.md task protocols.

## 7.1 How Agents Communicate

| System | Coordination | Dependence on free-form chat | State/delivery |
|---|---|---|---|
| CrewAI | Manager delegation and Agent results; direct delegation possible | Partial | Crew/Task context |
| LangGraph | Handoff, Command, shared State, Supervisor | Optional | Graph State + Checkpoint |
| Relevance AI | Agent edges, manager delegation, forced next step | Partial | Workforce Task / conversation history |
| SAP Joule | Assistant understands goals and coordinates specialists | Low | SAP business objects, processes and context |
| Factory Missions | Orchestrator, fresh Workers/Validators, shared external artifacts | Low | Validation contract, feature lists, notes, Git/code |
| causaLens | Specialist teams and fact/quality gates | Low | Blueprint, Trusted Facts, Decision Claims, artifacts/audit |
| TICK.md | Claim/update/done on shared Markdown/Git | Low | TICK.md + Git |
| **CodeFlowMu** | PM issues TASK; execution hands off REPORT/ISSUE/REVIEW; EVAL uses independent Observation | Designed without dependence on free-form agent chat | FCoP artifacts + runtime state + TMPA/evidence projections |

The important property is formal tasks, reports, issues, reviews, evidence and acceptance relations, rather than the mere absence of chat.

## 7.2 Teams, Work Objects, Verification and Control

Yes indicates an explicitly described mechanism; Partial/Configurable/Buildable indicate scope or implementation work; a dash/No means the cited materials do not establish a default implementation, not universal impossibility. This is not a uniform benchmark. CodeFlowMu's version-specific evidence is separate from current configuration.

| Capability | causaLens | Factory Missions | ServiceNow | SAP Joule | Relevance AI | Glean | CrewAI | LangGraph | TICK.md | **CodeFlowMu** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Multi-agent worker/team | Yes | Project team | Yes | Yes | Yes | Partial | Crew | Buildable | Partial | **Yes** |
| Explicit manager/orchestrator | Partial | **Yes** | Yes | **Assistant** | Yes | Partial | **Yes** | Buildable | Partial | **PM** |
| Execution vs validation separation | Yes | **Worker/Validator** | Partial | Partial | Configurable | Partial | Configurable | Buildable | No | **DEV/QA** |
| Independent observation/evaluation role | **Judge** | Validator | **Evals** | Partial | Weak | Alignment/evals | Configurable | Buildable | No | **EVAL** |
| Formal task object | Workflow | Mission/Feature | Task/Case | Business task | Workforce Task | Workflow | Task | Graph/Run | Yes | **TASK** |
| Formal deliverable/artifact | Claim/artifact | Code/artifact | Partial | Partial | Output/task | Partial | TaskOutput | Output/state | Weak | **REPORT** |
| Fact checking / trusted facts | Trusted-fact mechanisms | Test facts | Partial | SAP business facts | Connector-dependent | Enterprise knowledge | — | — | — | Partial: evidence checks in public engineering cases |
| Verification and release control | Deterministic gate | Acceptance contract + Validator | Partial | Business rules | — | Partial | Configurable guardrail | Composable | Validator | Governance-rule checks; observation alone is not a release gate |
| Diagnostics/root cause | Yes | Yes | **Trace/Span** | Partial | Task View | Partial | Events/logs | **Replay/state** | Watch/validate | Partial: task/evidence checks, version-dependent |
| Human approval | Yes | User handback | Yes | Yes | **Per-edge approvals** | Yes | Configurable | **Interrupt** | Human-editable | **ADMIN** |
| Final human acceptance separate from executor | Partial | Partial | Partial | Partial | Partial | Partial | No | No | No | **Yes** |
| Multiple models | Model-agnostic | **Yes** | Yes | Yes | Yes | Yes | Yes | Yes | Model-agnostic | Architecture separates responsibilities; current integration list unverified |
| Core implementation auditable | No | No | No | No | Platform no | Core no | **Yes** | **Yes** | **Yes** | Product closed; FCoP/TMPA open |

Execution facts, observation, evaluation and formal acceptance must remain distinct. An independent observer need not control lifecycle transitions. Only an explicitly authorized validation/acceptance mechanism determines release.

## 7.3 Existing Components and Combinations Still to Validate

![Figure 11: Established components and claims still to prove](/assets/saaw-2026/figures/11_en.png)

*Figure 11. Component precedents do not by themselves validate a unified structure of accountability. Qualitative evidence is not converted into numeric scores. Source: the author's synthesis of the corresponding analysis in this article and its listed references.*

| Layer | Assessment |
|---|---|
| Multi-agent roles/managers | Established in CrewAI, Factory, SAP and Relevance |
| Checkpoints, recovery and human interruption | Established in LangGraph |
| Grounding, guardrails and permissions | Established across enterprise products |
| Judge/Eval/Validator | Present in causaLens, Factory and ServiceNow |
| Markdown/Git/task claims | Public precedents in TICK.md, OACP and Gas Town |
| Fixed PM/DEV/QA/OPS/EVAL authority boundaries | A combination design, not an individual invention |
| TASK → REPORT → fact checks → QA/EVAL → ADMIN | Requires explicit inputs, outputs and authority for each role |
| Traces versus formal governance facts | Requires rules for events that affect official state |
| Physical done ≠ business PASS; approval ≠ truth | Work-governance semantics usually outside core runtimes |
| Preserving conflicts, negative outcomes and human acceptance of failures | A distinction still requiring evidence |
| Reconstructing authority and acceptance after restart | A cross-implementation research problem requiring stable semantics |

## 7.4 A Work-Governance Structure

![Figure 12: From execution completion to formal acceptance](/assets/saaw-2026/figures/12_en.png)

*Figure 12. Task, delivery, fact checking, QA, EVAL observation and ADMIN acceptance. Connections show conceptual relationships, not a requirement that EVAL precede every acceptance. Protocol and implementation define actual ordering. Source: the author's synthesis of the corresponding analysis in this article and its listed references.*

LangGraph focuses on surviving execution; CrewAI/Factory/SAP on coordinating agents; ServiceNow/Glean on agent governance; causaLens on facts and rules supporting decisions. FCoP/TMPA/CodeFlowMu also ask:

- Who formally owns this work?
- What constitutes delivery?
- Which evidence supports its claims?
- How are conflicts among executors, QA, EVAL and programmatic checks preserved?
- Who has final acceptance authority?
- Why is the final governance state valid?

> **CodeFlowMu connects multi-agent execution, duty separation, durable work facts and human acceptance, using work and responsibility relationships as the organizing objects.**

# 8. CodeFlowMu Product Position

For small and medium-sized enterprises, the proposed position is:

> **Turn an ordinary PC into a deployable, supervisable, recoverable and auditable digital-employee workstation.**

One employee instance may internally contain multiple roles. The proposed commercial object is role delivery.

```text
Digital-worker role
├─ Multiple roles and models
├─ Business tools and hosts
├─ Work contract and completion criteria
├─ Permissions and authorization for this execution
├─ State, evidence and recovery
└─ Phone supervisor interface
```

# 9. Consolidate D4 Role Capability and Improve Governance/Recovery

Volumes 1–2 initially assess CodeFlowMu as **D4 (software engineering role)** from public collaboration cases and version-specific governance implementations. Product development should turn this into stable, usable delivery:

- Stable employee identity and role version.
- Owned task queue and task ownership.
- Scheduled/event-triggered progress.
- Cross-session/day state continuity.
- Replaceable models subject to role admission.
- Explicit deliverables and completion criteria.
- PC execution and phone supervision.

Moving toward D5 requires implementation and evidence for call-time authorization distinct from capability, evidence for consequential claims/actions, facts separated from inference, independent review, idempotency keys/receipts/compensation, responsibility reconstruction after process/model/host changes, and authorized formal transitions.

# 10. Product Form: An Installable Digital-Worker Workstation

![Figure 13: PC execution and phone supervision](/assets/saaw-2026/figures/13_en.png)

*Figure 13. Product proposal: one employee instance executes on the PC, the phone supervises, and internal roles share formal work facts. Roadmap functionality is not asserted as shipped. Source: the author's synthesis of the corresponding analysis in this article and its listed references.*

Proposed installation and activation:

```text
CodeFlowMu-Setup-x64.exe
→ Install runtime, PC UI, phone pairing, updater and diagnostics
→ Detect officially supported hosts, model interfaces and authorization
→ Select a role and run admission evaluation
→ Create employee instance, device identity and activation receipt
→ Start work
```

Embedded databases/services may be appropriate, but SMEs should not have to learn Docker, PostgreSQL, Redis, Python and Node first. Persistence needs integrated migration and backup.

# 11. Mobile Web Application: The Worker Supervisor

A PWA is a browser application that can also be installed on a phone's home screen. The proposed supervisor interface should show worker/task state, receive approval requests and exceptions, expose evidence/delivery/reviews, allow pause/resume/revocation, issue formal goals and communicate with PM.

# 12. Proposed Commercial Structure

## 12.1 Unit of Sale

Do not charge for the internal agent count; internal roles/models/tools are implementation choices. The proposed unit is **one activated digital-employee instance**.

## 12.2 Pricing Layers

| Layer | Proposed offering | Charging logic |
|---|---|---|
| Trial | One role, limited tasks, mandatory human review | 14–30 days |
| Basic | Local worker workstation | Per instance/month or year |
| Professional | More capacity, schedules, phone access, backup | Worker subscription + capacity |
| Role packs | Research, content, development, market intelligence | Annual role/skill/workflow fee |
| Enterprise | Worker directory, policies, backup, audit, private deployment | Enterprise contract |

Explain software and model costs separately. Customers may connect officially supported interfaces/hosts they are authorized to use. A chat subscription does not automatically grant external API credits. Integration, billing and usage must follow the actual product plan.

# 13. Initial Roles

Prioritize software development, business research/market intelligence, and report/content operations. These are digital and inspectable through PCs, browsers, files and network tools; outcomes are often easier to review than payments, legal commitments or production control.

Research/content especially need evidence checks on factual claims. Support and other roles must likewise set review requirements according to actual risk.

# 14. Technical Research Directions

1. **Model profiles/admission:** Evaluate model+host+runtime combinations on real repositories, research and long tasks.
2. **Fact checking:** Match claims to sources/tool results, detect missing evidence and untrusted inputs.
3. **TMPA:** Preserve formal work facts and responsibility across actors/cycles.
4. **FCoP:** Govern formal task/report/review/decision semantics beyond chat logs.
5. **Call-time receipts:** Tool availability does not authorize this action on this object.
6. **Evidenced completion:** Model declarations alone cannot advance formal state.
7. **Idempotency/recovery:** Reuse confirmed results when writes succeeded but responses were lost.
8. **Independent review:** Executors must not certify their own consequential facts/code/actions.

# 15. Monitoring List

Commercial priorities: ServiceNow, Oracle, Glean, Devin, Sierra, Factory, Laiye Worker, WorkBuddy, Wukong, SAP, Torq, Relevance AI and Shulex.

Public-project priorities: Paperclip, StaffDeck, iML Work, OACP, Gas Town/Beads, Palmier, SIDJUA, Fusion, TICK.md, CrewAI, LangGraph, Open Agent Spec, AGNTCY/OASF, Agent Wiki and KanBanLess.

Standards priorities: MCP, A2A, Open Agent Spec, AGNTCY/OASF and OpenTelemetry agent conventions.

Reassessment triggers include public evidence of identity/ownership/recovery across days; changes toward instance/outcome pricing; new authorization, acceptance and review mechanisms; one-step installation/phone supervision/role markets; and model results that materially change long-task role admission.

# 16. Technical Validity Is Not Product Adoption

Technical completeness and external adoption must be assessed separately.

## 16.1 CodeFlowMu: Distribution and Product Clarity

```text
Install → select role → connect model/host → assign work
→ inspect progress/report → handle approvals → accept delivery
```

TMPA, FCoP, EVAL, fact checking and diagnostics should be internal trust mechanisms rather than prerequisites that ordinary customers must study.

## 16.2 FCoP: Reduce Integration and Usage Costs

A specification, Python package, MCP service, lifecycle and many governance rules do not automatically make a developer tool easy to use. **Tool count is not adoption.**

Common paths should be compact: create/claim task, submit report, raise issue, review result, inspect status, complete/accept. Recovery, migration and diagnostic tools remain available without being exposed by default to every agent.

## 16.3 Measure Product, Protocol and Architecture Separately

| Project | Proposed measures |
|---|---|
| FCoP | Third-party runtimes/adapters, independent implementations, conformance and external adoption |
| TMPA | External implementations, citations, conformance, governance adoption and cross-implementation reproduction |
| CodeFlowMu | Installs, activation, actual role workload, retention, paid use and recovery success |

## 16.4 A Declarative Governance Language as a Research Direction

Inspired by Open Agent Spec, FCoP could explore declarations such as:

```yaml
roles:
  PM:
    may: [create_task, assign_task, request_rework]
  DEV:
    may: [claim_task, submit_report]
    may_not: [approve_own_report]
  QA:
    may: [review_report, pass, fail]
  EVAL:
    mode: observer
    may: [read_evidence, publish_observation]
    may_not: [mutate_lifecycle]
```

Lifecycle/artifact constraints could then be implemented through runtime bindings. This YAML is a research illustration, not the current formal FCoP configuration format.

A testable goal is a second independent Reader/Writer built only from the specification and passing the same conformance vectors.

# 17. Final Assessment

SaaW is an emerging commercial direction, not yet a mature unified category.

```text
D2 automation and D2–D3 boundary products
→ D3 autonomous task execution
→ D4 bounded digital-worker roles
→ D5 high-trust software workers: no award in this sample
```

CodeFlowMu's direction starts from its existing software-engineering D4 assessment, improves installation, supervision, delivery and recovery, then validates stricter governance requirements.

> **SaaW is the commercial paradigm; CodeFlowMu should be a deployable implementation that can take on a role.**

# References

This volume uses public project materials, official documentation and the first two volumes. Not all projects were installed/tested. Engineering and specification maturity are separate initial assessments. Visible source does not grant unrestricted usage rights. Product routes, pricing layers and installation flows are proposals.

## Commercial Products and Governance

- [causaLens Digital Worker Factory](https://causalens.com/our-digital-worker-factory)
- [causaLens reliability](https://causalens.com/the-reliability-features)
- [Factory Missions](https://factory.ai/news/missions-architecture)
- [SAP Joule Agents](https://learning.sap.com/courses/introducing-joule/getting-to-know-joule-agents_f9d18ca0-1021-4c1a-a044-4c00ec8c2898)
- [ServiceNow metrics](https://www.servicenow.com/docs/r/intelligent-experiences/mon-ai-evaluation-metrics-reference.html)
- [Relevance Task View](https://relevanceai.com/docs/build/workforces/workforce-features/workforce-task-view)
- [Glean governance](https://www.glean.com/ai-agents/agent-governance)

## Public Implementations and Protocols

- [CrewAI](https://github.com/crewAIInc/crewAI)
- [LangGraph](https://github.com/langchain-ai/langgraph)
- [TICK.md](https://github.com/Purple-Horizons/tick-md)
- [Open Agent Spec](https://github.com/oracle/agent-spec)
- [MCP July 2026 release](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
- [A2A](https://a2a-protocol.org/)
- [Linux Foundation A2A adoption](https://www.linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year)
- [OASF](https://github.com/agntcy/oasf)

## CodeFlowMu / FCoP / TMPA

- [FCoP](https://github.com/joinwell52-AI/FCoP)
- [TMPA](https://github.com/joinwell52-AI/joinwell52)
- [Current product and historical open version](https://github.com/joinwell52-AI/joinwell52/blob/main/README.zh-CN.md)
- [Software engineering collaboration](https://joinwell52-ai.github.io/joinwell52/zh/digital-employee/2026-08-18-cursor-ai-development-team)
- [CodeFlowMu V1.8.0 I1.0 results](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/zh/publications/implementation-case-i1.0/part-02.md)
