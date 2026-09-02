---
title: "Digital Workers and SaaW (1): Global Products and Capability Levels"
date: '2026-09-03'
research_date: '2026-08-30'
prepared_date: '2026-09-03'
column: digital-employee
category: daily
article_type: comparative-study
edition: research-center
research_question: "What enables an AI product to take lasting responsibility for a bounded role, and how do global products and our own system compare?"
summary: "Starting from Xiaodian AI and CodeFlowMu, this article defines a digital-worker assessment framework and compares role continuity, tool use and delivery boundaries across 55 product entries."
cover: "/assets/covers/saaw-2026-part-1-cover.png"
language: en
series: saaw-commercial-landscape-2026
series_part: 1
lifecycle: Published
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/saaw-2026-part-1-cover.png"
  kicker="Digital Employee · SaaW Landscape (1)"
  title="Digital Workers and SaaW (1): Global Products and Capability Levels"
  summary="Starting from Xiaodian AI and CodeFlowMu, this article defines a digital-worker assessment framework and compares role continuity, tool use and delivery boundaries across 55 product entries."
  version="SaaW 2026 · 1/3"
  languageHref="/zh/digital-employee/2026-09-03-saaw-global-digital-employees"
  languageLabel="中文版"
/>

<!-- saaw-native-cover-note -->
<p class="saaw-cover-note">AI-generated conceptual cover. Screen interfaces and numbers are illustrative, not actual product screenshots or research data.</p>
<!-- /saaw-native-cover-note -->

# Global Real Digital Workers & SaaW Commercial Landscape 2026-1
## Method, Global Sample Library, and Regional Markets

An AI system that can query data or generate a report does not necessarily hold an ongoing job. A worker must retain unfinished work, respond to changing conditions, hand off exceptions or request authorization, and make its delivery inspectable. This report asks: **How does completing one task become sustained delivery of work?**

In our article [From SaaS to SaaW: When a Codebase Starts Developing Itself](https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-08-10-saaw-software-as-an-agent-worker), we call this approach **SaaW (Software as an Agent Worker)**: software works continuously as a digital work subject under explicit responsibilities, permissions and governance rules, uses business tools, delivers results and remains subject to human oversight. This is our conceptual definition, not a certification standard already adopted by vendors.

## Engineering Origins: From Xiaodian AI to CodeFlowMu

This question also comes from our engineering practice. **Xiaodian AI is our own enterprise AI application.** Developing it raised two related questions: how to organize AI work across requirements, development, deployment and acceptance, and how to introduce enterprise AI under permission and audit constraints. An agent that can generate code or answer questions does not by itself solve handoffs, quality checks and accountability for a team.

**CodeFlowMu is the multi-agent collaboration application and runtime we developed from that work, and a principal self-developed product compared in this report.** It organizes a team: roles and tasks are explicit, executors submit reports, reviewers inspect delivery, and humans retain decision authority. Models provide reasoning, tools perform actions, and CodeFlowMu organizes these capabilities into a continuous work process.

Xiaodian AI raised the question of AI entering enterprise operations. CodeFlowMu extended it to organizing teams that deliver continuously. SaaW places both in the context of software delivery: does the user receive a tool that needs constant operation, or a work subject with clear duties, inspectable results and continuity?

Against this background, we examine commercial products worldwide: **Which capabilities can customers already buy? Which products can sustain a bounded role? Where are the gaps in our own technical approach?**

## Executive Summary

The comparison contains **55 entries: 54 existing commercial samples plus CodeFlowMu as a self-developed engineering reference**, with **6 adjacent, unresolved or excluded candidates**. It covers North America, China, Europe, Australia, Israel, India and Japan.

**D1–D5 is the report's analytical framework.** D3 concerns autonomous completion of a task; D4 concerns sustained work across cycles; D5 adds stronger authorization, acceptance and accountability requirements. The criteria appear in Section 1.3.

1. **Autonomous task execution has multiple commercial implementations.** D3 samples can interpret goals, select tools and complete tasks through different routes.
2. **Sustained role ownership needs more evidence.** A demo or a schedule alone does not establish task ownership, cross-cycle state and proactive work. Candidates including Laiye still require verification.
3. **No sample receives D5 on the available public evidence.** This neither proves that no such product exists worldwide nor establishes that our own system qualifies.
4. **Pricing helps identify the unit of delivery.** Actions, conversations, resolutions, leads, minutes and outcomes describe what is sold; pricing alone cannot prove a capability tier.
5. **Models and runtimes must be assessed separately.** Model substitution does not guarantee equivalent delivery quality; evaluation must consider the model, tools and execution environment.

# 1. Research Method: Verify Capabilities, Then Assess the Tier

## 1.1 Admission Criteria

A commercial core sample must have a real product sold through subscription, usage, or enterprise contract; access real business facts or tools; produce an inspectable result; and expose official product, pricing, customer, governance, or runtime evidence.

A chat interface, RAG, SQL generation, one tool call, or a vendor’s “AI employee” label is not enough.

## 1.2 Xiaodian AI: A Capability Is Not a Role, and Tool Use Is Not Accountability

**Xiaodian AI is our self-developed enterprise AI application and the engineering starting point of this research.** Its [web demo](https://demo.chedian.cc/) illustrates the interaction model.

It answers questions, queries databases, generates SQL and explains results. This goes beyond a basic assistant but does not establish a digital worker. The classification below uses the author's functional description of the query-oriented application discussed here.

| Test | Xiaodian AI |
|---|---|
| Understands natural-language questions | Yes |
| Generates SQL and invokes a database | Yes |
| Completes a professional task | Yes |
| Durable identity and role | Absent or weak |
| Own task queue and long-term accountability | No |
| Continues unfinished work across days | No |
| Call-time authorization and evidence-backed acceptance | Depends on surrounding systems; no complete role-accountability loop |
| Failure recovery and independent review | Weak or absent |
| Strict rating | **D3 professional agent, not a digital worker** |

> **Being able to do something does not mean holding a job; being able to call tools does not mean taking responsibility for work.**

## 1.3 Five Capability Tiers

![Figure 01: D1–D5 capability and accountability](/assets/saaw-2026/figures/01_en.png)

*Figure 01. The report's capability framework. D4 adds durable role ownership; D5 adds evidence, authorization, independent review and recovery. Spacing does not encode equal capability gains. Source: the author's synthesis of the corresponding analysis in this article and its listed references.*

| Tier | Name | Required Reality |
|---|---|---|
| D1 | AI Assistant | Answers, retrieves, and generates while a human remains the operator |
| D2 | LLM-Enhanced Automation | The LLM interprets input, but rules/workflows determine most paths |
| D3 | Agentic Execution | Plans, selects tools, adapts, and completes a complex task, but lacks durable role accountability |
| D4 | Digital Worker | Adds durable role, identity, task ownership, cross-cycle state, and proactive work |
| D5 | High-Trust SaaW Worker | Adds call-time authorization, evidence-backed acceptance, independent verification, idempotent recovery, audit, and accountability |

## 1.4 Evidence Levels

- **A:** Sufficient official product and commercial evidence, with at least three of pricing, customers, capability and governance inspectable.
- **B:** A commercial product exists, but model, pricing or sustained-accountability evidence has gaps.
- **C:** Relevant direction, without enough evidence of a genuine digital worker.

## 1.5 Five Questions for Every Candidate

1. **Who decides the next step?** A model planning dynamically, or a preset workflow/RPA process?
2. **What is delivered?** A reply, an action, a tested code change, or a verifiable business result?
3. **What responsibility does the model carry?** Intent recognition only, or planning, judgment, exceptions and continued decisions?
4. **What happens after failure?** Retry, recovery, rollback, escalation, idempotency or a formal failure state?
5. **What is the charging unit?** Seats, credits, actions, conversations, resolutions, role capacity or outcomes?

> **Tool use does not establish a digital worker; multiple agents do not establish organizational accountability; outcome pricing does not establish D5 governance.**

Ratings concern the product's actual work process, not whether its website uses Employee, Worker, Agent or Autonomous Workforce.

## 1.6 CodeFlowMu: Engineering Structure and Comparison Boundaries

Public historical implementations include PM (planning), DEV (development), OPS (deployment and operations), QA (quality checks), and an independent EVAL observer. PC and phone interfaces provide human visibility and approval. Historical implementations explain the design but cannot substitute for a current feature list.

| Dimension | CodeFlowMu engineering question | The same question for commercial products |
|---|---|---|
| Division of work | How are planning, implementation, deployment and checking assigned? | Do agents have responsibility boundaries, or merely separate chat interfaces? |
| Handoffs | How do tasks, reports, issues and reviews connect? | Who receives output and decides whether work can proceed? |
| Human oversight | How do humans inspect work and approve decisions? | Which actions require authorization, and which may proceed autonomously? |
| State and recovery | How do work facts survive sessions and interruptions? | After restart, who is responsible, what has been accepted, and what may happen next? |

This is the engineering basis for the comparison dimensions. The author's involvement in CodeFlowMu does not justify a higher rating; implementation, testing and unverified goals remain distinct.

**TMPA (Textual Multi-Agent Process Architecture)** addresses work facts, responsibility and governance semantics. **FCoP (File-based Coordination Protocol)** expresses file-based task handoffs, reports and reviews. **CodeFlowMu** is an application and runtime using these approaches. **SaaW** describes the intended delivery paradigm. These are different objects.

According to the [current project description](https://github.com/joinwell52-AI/joinwell52/blob/main/README.zh-CN.md), the current CodeFlowMu product line is independently developed and closed source. CodeFlowMu Open is the historical version frozen at V1.2.29-open for reproduction and research. CodeFlowMu is entry 55 below, separately counted from the 54 commercial samples. Xiaodian AI remains research background, and bounded conformance results are not extrapolated into D5 certification.

# 2. Global Commercial Samples and CodeFlowMu Comparison

![Figure 02: Detailed ratings of 54 commercial samples](/assets/saaw-2026/figures/02_en.png)

*Figure 02. Preserved original snapshot: D3 36, D4 9 and D2–D3 9 across 54 entries. The D4 colors show the original labels. Laiye is now a D4 candidate, and newly added CodeFlowMu is not included in this historical chart. Source: the original report's commercial-sample compilation dated August 30, 2026; see this caption for the historical scope.*

> **Counting basis:** The current table has 55 entries: D3 36 (including 3 platforms), D2–D3 9, D4 9 (including CodeFlowMu), and one D4 candidate (Laiye). The original and current groups of nine D4 entries have different membership. Other ratings follow the original study and were not all reverified in this edit.

The table includes **54 commercial samples and one self-developed CodeFlowMu product**. No entry receives D5. CodeFlowMu is assessed as **D4 (software engineering role)**; its current commercial quotation has not been verified, so it is not counted as a 55th confirmed paid commercial sample. Capability and commercial status are separate. Platform configurations can span D1–D4; the ratings concern default or representative forms in public materials and are not independent certification.

## North America


| Company / Product | Country | Product Position and Capability Boundaries | Delivery | Public Model Information | Pricing | Model Cost Separation | Tier | Evidence |
|---|---|---|---|---|---|---|---|---|
| **Salesforce**<br>Agentforce | United States | An enterprise agent execution layer embedded in CRM, rather than a standalone employee product. | Authenticates users, reads CRM/order data, answers questions, updates business objects, and executes approved workflow actions. | Multi-model stack; exact routing varies by tenant and release and is not disclosed as one fixed model. | $500 per 100k Flex Credits; about $0.10/action; $2/conversation; plus $5 or $125 per-user options. | Model cost is bundled into credits or flat access, not transparently separated. | D3 | A |
| **Microsoft**<br>Copilot Studio / Microsoft 365 Copilot | United States | An enterprise agent building, publishing, and metering platform; Microsoft 365 Copilot remains primarily human augmentation. | Answers, generates, and executes connector actions across Microsoft 365, Teams, Power Platform, websites, and apps. | Primarily GPT-family models with selectable models in some scenarios and external services. | $30/user/month for Microsoft 365 Copilot; $200 per 25k Copilot Credits/month for Copilot Studio, plus PAYG. | Platform licensing plus credit meters; premium reasoning may add meters, so costs are partly separated. | D3 | A |
| **ServiceNow**<br>Autonomous Workforce / AI Specialists | United States | Role-shaped AI specialists grounded in enterprise workflows, identity, CMDB, and an AI control tower. | Completes end-to-end IT, CRM, employee-service, and security processes, resolving cases, incidents, and requests. | Now LLM plus third-party models; the platform is positioned as model- and cloud-agnostic. | Enterprise tiering and contract pricing; no universal public list price. | Model and platform costs are generally bundled in enterprise contracts. | D4 | A |
| **UiPath**<br>Agentic Automation | United States (Romanian origin) | A hybrid automation platform orchestrating agents, software robots, and humans. | Agents handle judgment and planning, robots execute deterministic system actions, and humans approve high-risk decisions. | Supports multiple foundation models and bring-your-own-model configurations. | Basic starts at $25/month; enterprise agentic automation is sales-led. | Platform, automation capacity, and customer-managed models can be separated. | D3 | A |
| **Workday**<br>Sana Agents / Agent System of Record | United States (Sana originated in Sweden) | HR and finance agents governed through an Agent System of Record for identity, skills, and permissions. | Retrieves policy information, performs self-service actions, optimizes business processes, and collaborates with third-party agents. | Gemini became the default model for Sana for Workday in 2026; other agents may use multiple models. | Purchased through Workday Flex Credits; unit pricing is contract-specific. | Credits meter agent work; model cost is not fully itemized. | D3 | A |
| **Glean**<br>Glean Agents / Independent Agents | United States | Cross-system work agents evolved from enterprise search and knowledge infrastructure. | Owns workflows, acts proactively with scoped credentials, and requests humans at consequential decisions. | Supports broad frontier-model choice; routing is task- and tenant-dependent. | Enterprise contract pricing; no universal public list price. | Generally bundled into enterprise contracts; model cost is not public as a separate line. | D4 | A |
| **Oracle**<br>Fusion Agentic Applications | United States | Outcome-oriented agentic applications natively embedded in finance, HR, supply chain, and CX transaction systems. | Teams of agents with roles and decision authority reason continuously, share context, execute in-policy actions, and escalate exceptions. | Supports Llama, Cohere, external industry models, and partner models. | AI Agent Studio is included for Fusion customers; application and model usage follow Fusion/OCI contracts. | The application platform and model/cloud consumption are partly separated. | D4 | A |
| **Google Cloud**<br>Gemini Enterprise Agent Platform | United States | Enterprise agent runtime, memory, session, and model infrastructure rather than a fixed-role worker. | Hosts customer-built agents, sessions, memory, and tool execution. | Primarily Gemini models, with support for customer and open models. | Compute, memory, runtime/session resources, and model tokens are separately metered. | Clearly separated. | D3 (Platform) | A |
| **HubSpot**<br>Breeze Customer Agent / Prospecting Agent | United States | Outcome-oriented vertical agents inside CRM, marketing, sales and support. | Customer Agent handles and resolves requests; Prospecting Agent researches and recommends prospects for outreach. | Production routing is not uniformly disclosed; capability relies on HubSpot customer context and business data. | From April 2026: **$0.50/successful resolution** for Customer Agent and **$1/recommended outreach lead** for Prospecting Agent; the underlying HubSpot subscription is separate. | Software subscription and outcome fees are separate; model cost is not separately shown. | D3 | A |
| **Zendesk**<br>AI Agents / Autonomous Service Workforce | United States (Danish origin) | Vertical agents and autonomous service operations built around successful resolutions. | Reads knowledge and customer context, handles conversations, process actions and voice, and escalates unresolved issues. | Exact model mix is not uniformly disclosed. | From May 2026: **Automated Resolution / Resolution Allowance**; only successful AI resolutions without human escalation consume allowances, with tiers by complexity. | Support subscriptions and resolution allowances are separate; model cost is not itemized. | D3 | A |
| **Intercom**<br>Fin | United States / Ireland | A support and sales agent priced around validated customer outcomes. | Resolves customer issues, executes procedures, hands off to humans, and qualifies sales leads. | Model routing evolves by release and is not fully disclosed. | $0.99 per resolution/procedure handoff; $9.99 per successful sales qualification, plus seats. | Seat and outcome fees are separated; model cost is bundled. | D3 | A |
| **Cognition**<br>Devin | United States | A software-engineering worker operating across repositories, browsers, terminals, tests, and collaboration tools. | Reads tasks, investigates repositories, edits code, runs tests, repairs failures, and delivers reviewable output. | Core Devin routing is not fully disclosed; the product ecosystem exposes multiple frontier models. | Free, $20/month, $200/month; Teams from $80/month with seats/usage; Enterprise uses Agent Compute Units. | Model, compute, and software capabilities are bundled in quotas/ACUs. | D4 | A |
| **Sierra**<br>Sierra Agents / Horizon Agents | United States | Customer-operations agents that maintain long-running relationships and are priced on outcomes. | Completes support, account, retention, sales, and multi-day or multi-week workflows across channels. | Underlying model stack and routing are not disclosed. | Enterprise contracts priced against pre-defined business outcomes. | Model cost is fully bundled into outcome pricing. | D4 | A |
| **11x**<br>Alice / Julian | United States / United Kingdom | Role-shaped digital labor for outbound development and inbound response. | Finds and researches prospects, personalizes outreach, responds across channels, and syncs CRM. | Exact models are not disclosed. | Alice Growth starts around $3,750/month billed annually; priced by lead volume rather than sends. | Software, data, and model costs are bundled. | D3 | A |
| **Artisan**<br>Ava | United States | An autonomous outbound sales-development agent. | Finds/enriches contacts, sends personalized outreach, handles replies, books meetings, and syncs CRM. | Exact models are not disclosed. | Custom plans scoped by monthly lead volume; no universal public amount. | Bundled. | D3 | A |
| **Decagon**<br>AI Concierge | United States | A customer-operations agent capable of invoking business APIs to complete complex service flows. | Maintains context across channels, verifies identity, queries/updates systems, handles refunds/disputes, and escalates. | Multi-model/proprietary orchestration; exact models are not uniformly disclosed. | Enterprise contracts, including conversation- or resolution-oriented structures; pricing is sales-led. | Model cost is generally bundled. | D3 | A |
| **Bland AI**<br>Voice AI Agents | United States | Vertical voice-execution agents for phone-based business processes. | Conducts real-time calls, verification, collections reminders, scheduling, dispatch, and call workflows. | Proprietary voice/dialog stack; the company says production calls do not rely on third-party frontier models. | About $0.11–$0.14/minute, with monthly fees on some tiers; STT, model, and TTS are included. | Fully bundled. | D3 | A |
| **Factory**<br>Droids / Missions | United States | A software-engineering worker with multi-model routing, background execution, and multi-day missions. | Breaks down goals, completes tasks in parallel, validates results, and resumes locally or in the cloud. | Multi-model router supporting Claude, Gemini, Kimi, MiniMax, BYOK, and local models. | Individual tiers around $20/$100/$200 per month; enterprise and higher usage are custom. | BYOK enables clear separation of software and model costs. | D4 | A |
| **Harvey**<br>Harvey | United States | A multi-model legal work platform for law firms and corporate legal teams. | Performs research, contract review, drafting, comparison, due diligence, and complex legal workflows. | Publicly uses models from OpenAI, Anthropic, Google, Mistral, and others. | Enterprise contract pricing. | Models and platform are bundled. | D3 | A |
| **Hebbia**<br>Matrix | United States | An agentic workbench for long-document analysis in finance, legal, and research. | Decomposes questions, searches and computes across large document sets, builds matrices, cites sources, and produces analysis. | Multi-model stack; routing is not fully disclosed. | Enterprise annual/contract pricing. | Model cost is generally bundled. | D3 | A |
| **Abridge**<br>Abridge Clinical AI | United States | A clinical documentation system centered on linked evidence and clinician review, not an independent medical worker. | Listens to clinical conversations, generates structured notes, writes to EHR, and is reviewed by clinicians. | Proprietary clinical stack plus partner models; exact routing is not fully public. | Enterprise health-system contracts. | Bundled. | D2–D3 | A |
| **Norm AI**<br>AI Compliance | United States | A compliance intelligence system that turns regulation and institutional policy into executable review workflows. | Reviews marketing materials, contracts, and business actions, flags risk, and creates records. | Proprietary compliance models plus frontier models; exact stack is not fully public. | Enterprise subscription/project contracts. | Bundled. | D2–D3 | B |
| **Regie.ai**<br>AI Prospecting Agents | United States | A sales research, content, and outreach agent platform. | Researches prospects, enriches data, drafts outreach, dials, and runs sales sequences. | Exact model stack is not disclosed. | Pro around $49/month plus credits; enterprise custom. | Seat plus credits; model cost bundled. | D3 | A |
| **Ada**<br>Ada AI Agent | Canada | An automated-resolution agent for customer service. | Connects to knowledge and systems, resolves customer issues, and evaluates relevance, accuracy, and safety. | Proprietary reasoning layer over multiple models; exact models are not uniformly disclosed. | Enterprise contracts; the company advocates conversation-based rather than resolution-based pricing. | Model cost bundled. | D3 | A |
| **Cresta**<br>Cresta AI Agent | United States | An omnichannel autonomous service agent for large contact centers. | Verifies identity, queries accounts, completes multi-step actions, preserves cross-channel context, and escalates. | Proprietary/customer-trained model layer; exact foundation models are not uniformly disclosed. | Direct enterprise sales, scoped by products, agent count, conversation volume, channels, and languages. | Bundled. | D3 | A |
| **Writer**<br>AI HQ / Agents | United States | An enterprise content, knowledge, and workflow agent platform. | Generates, reviews, executes, and orchestrates business tasks over enterprise knowledge and tools. | Primarily proprietary Palmyra models with multi-model integrations. | Team and enterprise subscriptions; enterprise agent pricing is contract-based. | Proprietary model usage is generally bundled with platform pricing. | D3 | B |
| **Moveworks (now part of ServiceNow)**<br>Moveworks AI Assistant / Agentic Automation | United States | An enterprise search, conversational entry point, and cross-system transaction platform now within ServiceNow. | Understands employee requests, retrieves knowledge, handles IT/HR transactions, and executes cross-app actions. | Multi-model/proprietary orchestration; routing is not disclosed. | Enterprise contracts. | Bundled. | D3 | B |



## China


| Company / Product | Country | Product Position and Capability Boundaries | Delivery | Public Model Information | Pricing | Model Cost Separation | Tier | Evidence |
|---|---|---|---|---|---|---|---|---|
| **Laiye**<br>Laiye Worker / WEP | China | A PC-based agent product and enterprise platform using RPA as callable skills. | Interprets goals, plans and executes across ERP, finance, HR and customer systems; examples include finance, HR, legal, operations and marketing roles. | Model-neutral routing lists **DeepSeek-V4, Qwen3-Max, Kimi K2, Doubao 2.0 Pro and GLM-5.1**, selected by task, budget, latency and compliance. | Community free; Plus **RMB39/month**; Pro **RMB199/month**; Enterprise custom, including SSO, permissions and action audit. | Platform subscription and credits are separate; private deployments may shift model costs to customer-owned models. | D4 candidate (role continuity unverified) | B |
| **Tencent**<br>WorkBuddy Enterprise | China | An enterprise agent platform combining coding, office work and hosted agents. | Decomposes research, documents, spreadsheets, development and scheduled work; includes agent hosting, unified identity and permissions, audit and private deployment. | August 2026 official list: **Hy3, GLM-5.2/5.1, MiniMax-M3, Kimi-K2.7-Code/K2.6, DeepSeek-V4-Flash/V4-Pro**; custom OpenAI, Anthropic and Gemini integrations are supported. | SaaS flagship **RMB198/user/month**, from one seat, including 2,000 Credits/user/month; dedicated edition **RMB316/user/month**, from 100 seats; private deployment by quotation. | Software, credits and customer model costs can be partly separated through enterprise custom/private models. | D3 | A |
| **Alibaba / DingTalk**<br>Wukong | China | An enterprise office agent capable of operating computers, browsers, files, and cloud apps. | Decomposes goals, invokes skills, coordinates multiple agents, runs schedules, and supports mobile supervision. | Exact model names are not disclosed; premium tiers expose model configuration parameters. | RMB39 or RMB99 per user/month, plus optional compute-credit packs from RMB9.8. | Seat and compute credits are partly separated. | D3 | A |
| **ByteDance**<br>Doubao Work | China | A general computer-based knowledge-work agent connected to Feishu and the Doubao model ecosystem. | Performs research, reports, spreadsheets, presentations, file processing, and cross-app office work. | Primarily the Doubao Seed family; exact product routing and versions are insufficiently disclosed. | Personal subscription plus enterprise seat/usage plans; current enterprise list prices require live verification. | Seat and model usage are likely partly separated. | D3 | B |
| **Baidu AI Cloud**<br>Keyue Digital Employees | China | Highly productized consulting, outbound, and content-operation “employees,” but heavily dependent on knowledge, skills, and configured procedures. | Hire, train, put on duty, consult, collect leads, run outbound calls, manage accounts, and report results. | ERNIE / Baidu AI Cloud model stack. | Online plans plus enterprise quotes; public prices vary by promotion. | Model and product package are bundled. | D2–D3 | A |
| **Sobot**<br>Sobot Agents | China | Autonomous support and outbound agents connected to contact-center systems and business APIs. | Queries orders, verifies identity, processes refunds, changes addresses, handles voice/outbound service, and writes results back. | LLM + retrieval + tools + procedures; exact foundation models are not disclosed. | Enterprise contract pricing. | Bundled. | D3 | B |
| **Shulex**<br>Solvea AI Customer Service Employee | China | A role-shaped omnichannel support agent for cross-border e-commerce. | Handles presales recommendations, logistics, troubleshooting, returns, and customer service, measured by resolution and response rates. | Exact model stack and routing are not disclosed. | Enterprise project contracts emphasizing measurable outcomes; no universal public price. | Model cost bundled. | D3 | A |
| **Yonyou**<br>BIP / yowo Intelligent Digital Employees | China | Finance, HR, supply-chain, and manufacturing agents embedded in enterprise management software. | Reads enterprise business objects, analyzes conditions, initiates workflows, and executes within permissions. | YonGPT plus partner models; role-specific routing is not public. | Enterprise software subscription, implementation, and project contracts. | Model cost is generally bundled into enterprise contracts. | D3 | B |
| **Kingdee**<br>Kingdee AI Cosmic / Cosmic Agents | China | Enterprise-management agents embedded in finance, HR, procurement, and supply-chain systems. | Performs recruiting, travel, finance, procurement, and business-process orchestration/execution. | Kingdee/Cosmic model stack plus partner models; exact versions are not uniformly disclosed. | Enterprise SaaS, implementation, and solution contracts. | Generally bundled. | D3 | B |
| **Deepexi**<br>DeepWorks / FastAGI | China | An enterprise agent runtime and role-oriented work platform emphasizing context, skills, permissions, review, and audit. | Performs data analysis, operating insight, task execution, project-directory read/write, and cross-system tool use. | Configurable multi-model stack with FastAGI as runtime/guardrail layer. | Enterprise solution and implementation pricing. | Model and platform costs can be partly separated by deployment. | D3 | B |
| **Langboat**<br>LangClaw | China | An enterprise digital-worker platform for business analysis and growth operations, still early commercially. | Understands goals, decomposes tasks, executes across systems, coordinates agents, maintains memory, and delivers reports. | Mengzi model family with configurable models. | Trial/application and sales-led access; public product remains invitation-based with credits. | Potentially partly separated; contract terms are not public. | D3 | B |
| **Shizai Intelligence**<br>Shizai Agent / Digital Employee | China | An agentic automation product centered on semantic screen understanding and non-invasive automation. | Fills, verifies, approves, and operates across legacy systems, with agents interpreting and automation executing. | Multiple models plus proprietary screen-semantic technology; exact models not uniformly disclosed. | Enterprise project/worker-seat contracts; public standard pricing is limited. | Models and automation platform are generally bundled. | D2–D3 | B |
| **Alibaba 1688**<br>AI Digital Store Manager | China | A set of store-operation agents embedded in a wholesale e-commerce platform. | Optimizes products, handles service, runs marketing, adjusts pricing/titles, and provides operations advice. | Qwen and Alibaba commerce model stack. | Platform value-added services plus marketing spend; package varies by merchant. | Platform fees and marketing/model consumption are partly separated. | D2–D3 | B |



## Europe & Other


| Company / Product | Country | Product Position and Capability Boundaries | Delivery | Public Model Information | Pricing | Model Cost Separation | Tier | Evidence |
|---|---|---|---|---|---|---|---|---|
| **SAP**<br>Joule / Joule Agents | Germany | Business agents embedded natively in ERP, finance, procurement, HR, and supply chain. | Reads business objects, coordinates tools/agents, executes multi-step processes, and escalates exceptions. | SAP Business AI multi-model stack; different use cases can use different foundation models. | Joule Base with cloud subscriptions; premium AI metered via AI Units/agent actions. | Software subscription and premium agent usage are partly separated. | D3 | A |
| **causaLens**<br>Digital Worker Factory | United Kingdom | **One digital worker is a multi-agent team** owning a complete workflow, with deterministic verification, trusted facts and agent quality gates. | Data gathering, analysis, QA, output, rule/causal decisions, escalation and business-system writes for high-value workflows such as finance, procurement and reconciliation. | Explicitly model-agnostic; portable containers run on the customer’s chosen model and infrastructure. | Enterprise project/production deployment contracts; no universal public price. | Model and runtime can be separated on customer infrastructure. | **D4** | **A** |
| **Parloa**<br>AI Agent Management Platform | Germany | A multilingual voice-agent platform for large customer-contact operations. | Handles verification, transactions, changes/refunds, and escalation in insurance, travel, and retail. | Proprietary dialogue layer plus multiple models; exact models not uniformly disclosed. | Enterprise contracts scoped by call and automation volume. | Model cost generally bundled. | D3 | B |
| **Dust**<br>Dust Agents | France | A multi-model agent workbench across enterprise knowledge, connectors, and schedules. | Performs research, operations reporting, code/data tool use, multi-agent workflows, and schedules. | 20+ models including GPT, Claude, Gemini, Mistral, and DeepSeek. | Free; Pro $24/seat/month; Max $120/seat/month; Enterprise custom, credit-based. | Credits bundle model and work usage; not fully separated. | D3 | A |
| **Mistral AI**<br>Agents API / Enterprise Workflows | France | Commercial agent infrastructure with persistent sessions, memory, schedules, multi-agent orchestration, and HITL. | Provides runtime, tools, recovery, and model services for customer-built agents; not a fixed-role worker. | Primarily Mistral models with enterprise hybrid deployment. | Token/API pricing plus enterprise deployment contracts. | Platform and model calls can be metered separately. | D3 (Platform) | A |
| **Relevance AI**<br>AI Workforce | Australia | A platform for building sales, support, research, and operations agent teams. | Runs schedules, invokes tools, escalates to humans, coordinates teams, and integrates enterprise apps. | Multi-model with BYO LLM/API keys. | Free; Pro from $19/month; Team from $234/month; $80/1,000 Actions; Vendor Credits at wholesale cost. | Explicitly separates agent Action fees from model/tool Vendor Credits. | D3 (Platform) | A |
| **Torq**<br>Socrates | Israel / United States | A virtual SOC analyst with investigation, response, permissions, and audit. | Analyzes alerts, correlates context, invokes security tools, remediates, and requests approval where policy requires. | Exact models are not fully disclosed; the platform meters AI Credits. | Workspace tiers include credits, with add-on credit packages. | Models and agent actions are bundled into fixed credits. | D4 | A |
| **Darwinbox**<br>Super Agent | India / United States | Enterprise agents for HR shared services, employee transactions, and management workflows. | Answers policy questions, handles HR transactions, attendance/offboarding/cross-border processes, and escalates exceptions. | Exact model stack is not disclosed. | Enterprise contracts, generally based on employee scale and modules. | Bundled. | D3 | B |
| **PKSHA Technology**<br>PKSHA AI Agents | Japan | A portfolio of enterprise agents for support, help desk, sales, and HR. | Performs knowledge support, multi-agent routing, sales conversations, matching, and RPA collaboration. | Proprietary NLP/LLM technology plus external models; exact models not uniformly disclosed. | Enterprise contract/solution sales. | Bundled. | D2–D3 | A |
| **LayerX**<br>Bakuraku / Ai Workforce | Japan | A back-office finance platform evolving toward ambient agents and autonomous operations. | Automates invoices, expenses, accounting entries, and back-office processes; autonomy varies by product. | Multi-model/proprietary application layer; exact models not uniformly disclosed. | Enterprise SaaS subscription by module and company scale. | Model cost generally bundled. | D2–D3 | B |
| **Robin AI**<br>Robin AI | United Kingdom | A legal workbench for contract review, clause extraction, and obligation tracking. | Reviews contracts against playbooks, proposes redlines, and tracks obligations. | Partner frontier models plus a legal-specific layer; exact models vary. | Enterprise contracts. | Bundled. | D2–D3 | B |
| **Juro**<br>Juro AI | United Kingdom | An AI-native contract lifecycle platform, closer to legal work software than a persistent worker. | Drafts, reviews, extracts, signs, monitors, and chases contracts. | Exact model stack is not uniformly disclosed. | Subscription based on contract volume and enterprise plan. | Model cost bundled. | D2–D3 | A |
| **PolyAI**<br>Voice Agents | United Kingdom / United States | Voice service agents for large contact centers and specific location-based businesses. | Conducts natural phone conversations, scheduling, order/account service, and API actions. | Proprietary dialogue models including Dialog-RSN-1. | Enterprise generally per-minute; a specific OpenTable offer is $299/month/location. | Model and voice costs are bundled. | D3 | A |
| **Yellow.ai**<br>AI Agents | India / United States | An omnichannel service-agent platform spanning voice, chat, email, and SMS. | Handles customer inquiries, process actions, proactive notifications, and omnichannel resolution. | Multi-model platform; deployment-specific models are not uniformly disclosed. | Free tier includes 500 sessions/month, then $0.99/resolution; Enterprise custom. | Resolution usage is separated from plan pricing; model cost bundled. | D3 | A |



## Author-Developed Product · Engineering Reference

| Company / Product | Country | Product Position and Capability Boundaries | Delivery | Public Model Information | Pricing | Model Cost Separation | Tier | Evidence |
|---|---|---|---|---|---|---|---|---|
| **CodeFlowMu**<br>Author-developed product · Engineering reference | China | Multi-agent collaboration application and runtime using TMPA governance architecture and FCoP coordination; the current line is separate from historical CodeFlowMu Open. | Task decomposition, role collaboration, reports, reviews and human decisions; historical materials show development teams, PC/phone interfaces and work artifacts, with evidence tied to versions. | Model and runtime responsibilities are separate; the current closed-source product's full model/integration list was not verified and is not inferred from historical support. | Current universal quotation unverified; the historical MIT release does not make the current product free or open source. | Current contract and billing separation unverified. | **D4 (software engineering role)**: initial assessment from public engineering materials; see profile. | [Project and version evidence](https://github.com/joinwell52-AI/joinwell52/blob/main/README.zh-CN.md); author engineering reference, with commercial status separate. |

# 3. Regional Market Structures

![Figure 03: Sample coverage and original regional groups](/assets/saaw-2026/figures/03_en.png)

*Figure 03. Original grouping: North America 27, China 13, Europe and other 14. Original colors retain Laiye as D4; it is now a candidate. CodeFlowMu is absent from this historical chart. The current China total is 14, with CodeFlowMu listed separately at the end. Counts measure sample coverage, not market size. Source: the original report's commercial-sample compilation dated August 30, 2026; see this caption for the historical scope.*

## 3.1 North America: Two Parallel Routes

The first route adds execution to incumbent enterprise software. Salesforce, Microsoft, ServiceNow, Workday, Oracle and Glean already hold enterprise identity, permissions, business objects and purchasing relationships; these allow agents to read and write within existing systems.

The second sells roles or outcomes directly: Devin sells engineering work, Sierra customer outcomes, Factory multi-day engineering, 11x/Artisan sales-development capacity, and Intercom/Zendesk/Decagon automated resolutions.

Seats are no longer the only unit: actions, conversations, resolutions, leads, minutes, compute units and outcomes all appear in formal pricing.

## 3.2 China: A Hybrid Structure, Not the End of Seats

```text
Low-price seats or worker plans
+ credits / model usage
+ private deployment, dedicated cloud and implementation
```

- Hiring, training and putting digital employees to work are prominent product language.
- PCs, ERP systems, browsers, WeCom, DingTalk and Feishu form the workplace.
- Private deployment, domestic models, data locality and domestic infrastructure compatibility matter more.
- Laiye, WorkBuddy, Wukong and Doubao Work compete for general computer-based knowledge work.
- Shulex, Sobot and Baidu Keyue package support, consultation and outbound calling.
- Yonyou and Kingdee follow the incumbent-software route also seen at Salesforce and SAP.

## 3.3 Europe and Asia-Pacific: Regulation, Data Sovereignty and Vertical Processes

SAP develops agents within enterprise systems. Parloa and PolyAI emphasize multilingual voice service; Dust and Mistral emphasize multi-model workspaces and infrastructure. Torq packages security operations with permissions, audit and remediation. PKSHA and LayerX focus on customer service, back-office work and automation amid labor shortages.

## 3.4 Four Routes Toward Sustained Roles

![Figure 04: Four routes across the original nine D4 samples](/assets/saaw-2026/figures/04_en.png)

*Figure 04. Original qualitative grouping of nine D4 entries. Laiye is now a candidate requiring verification. The chart is neither certification nor a competitive ranking. Source: the original report's commercial-sample compilation dated August 30, 2026; see this caption for the historical scope.*

| Route | Examples | Mechanisms to examine | Main limit |
|---|---|---|---|
| Bounded professional role | Devin, Torq | Clear environment, tasks, tools and completion criteria | Domain-specific |
| Long-cycle outcomes | Sierra | Customer relationships and goals across days/weeks; outcome pricing | Limited model, evidence and recovery disclosure |
| Native enterprise systems | ServiceNow, Glean, Oracle | Identity, permissions, data, business objects and audit | Worker boundaries weaken outside the platform |
| Runtime/workstation | Factory, Laiye Worker, causaLens | Combine models, tools, verification and role organization | Sustained work needs product-level evidence; Laiye continuity remains unverified |

Digital workers need not share one interface. The test is whether they retain task ownership, act within permission boundaries and have explicit delivery and failure semantics.

# 4. Key Products and Self-Developed Engineering Reference

## ServiceNow · Autonomous Workforce / AI Specialists


| Field | Assessment |
|---|---|
| Actual product | Role-shaped AI specialists grounded in enterprise workflows, identity, CMDB, and an AI control tower. |
| Delivery | Completes end-to-end IT, CRM, employee-service, and security processes, resolving cases, incidents, and requests. |
| Models | Now LLM plus third-party models; the platform is positioned as model- and cloud-agnostic. |
| Commercial model | Enterprise tiering and contract pricing; no universal public list price. |
| Model-cost separation | Model and platform costs are generally bundled in enterprise contracts. |
| Strict tier | D4 |
| Assessment | Public evidence covers role scope, execution authority, enterprise governance, identity, audit, and end-to-end processes, supporting a strict D4 rating. Its limits are the dependence on ServiceNow data and workflows and limited relevance to open-ended knowledge work. |
| Official source | [www.servicenow.com/platform/autonomous-workforce.html](https://www.servicenow.com/platform/autonomous-workforce.html) |



## Glean · Glean Agents / Independent Agents


| Field | Assessment |
|---|---|
| Actual product | Cross-system work agents evolved from enterprise search and knowledge infrastructure. |
| Delivery | Owns workflows, acts proactively with scoped credentials, and requests humans at consequential decisions. |
| Models | Supports broad frontier-model choice; routing is task- and tenant-dependent. |
| Commercial model | Enterprise contract pricing; no universal public list price. |
| Model-cost separation | Generally bundled into enterprise contracts; model cost is not public as a separate line. |
| Strict tier | D4 |
| Assessment | Independent agents have identity, scoped credentials, proactive execution, version checkpoints, evaluations, and rollback—an important transition from enterprise search to a work subject. |
| Official source | [www.glean.com/ai-agents](https://www.glean.com/ai-agents) |



## Oracle · Fusion Agentic Applications


| Field | Assessment |
|---|---|
| Actual product | Outcome-oriented agentic applications natively embedded in finance, HR, supply chain, and CX transaction systems. |
| Delivery | Teams of agents with roles and decision authority reason continuously, share context, execute in-policy actions, and escalate exceptions. |
| Models | Supports Llama, Cohere, external industry models, and partner models. |
| Commercial model | AI Agent Studio is included for Fusion customers; application and model usage follow Fusion/OCI contracts. |
| Model-cost separation | The application platform and model/cloud consumption are partly separated. |
| Strict tier | D4 |
| Assessment | Fusion Agentic Applications are complete business applications with agent roles, decision authority, persistent shared context, approvals, and audit, making them closer to SaaW than a generic agent studio. |
| Official source | [www.oracle.com/cn/news/announcement/oracle-introduces-fusion-agentic-applications-2026-03-24/](https://www.oracle.com/cn/news/announcement/oracle-introduces-fusion-agentic-applications-2026-03-24/) |



## Cognition · Devin


| Field | Assessment |
|---|---|
| Actual product | A software-engineering worker operating across repositories, browsers, terminals, tests, and collaboration tools. |
| Delivery | Reads tasks, investigates repositories, edits code, runs tests, repairs failures, and delivers reviewable output. |
| Models | Core Devin routing is not fully disclosed; the product ecosystem exposes multiple frontier models. |
| Commercial model | Free, $20/month, $200/month; Teams from $80/month with seats/usage; Enterprise uses Agent Compute Units. |
| Model-cost separation | Model, compute, and software capabilities are bundled in quotas/ACUs. |
| Strict tier | D4 |
| Assessment | Devin has a clear role, work environment, and definition of done, and can investigate, edit, test, and deliver across multiple steps. Its own guidance still asks users to decompose large tasks and resolve ambiguous decisions, so it is D4—not D5. |
| Official source | [devin.ai/pricing](https://devin.ai/pricing) |



## Sierra · Sierra Agents / Horizon Agents


| Field | Assessment |
|---|---|
| Actual product | Customer-operations agents that maintain long-running relationships and are priced on outcomes. |
| Delivery | Completes support, account, retention, sales, and multi-day or multi-week workflows across channels. |
| Models | Underlying model stack and routing are not disclosed. |
| Commercial model | Enterprise contracts priced against pre-defined business outcomes. |
| Model-cost separation | Model cost is fully bundled into outcome pricing. |
| Strict tier | D4 |
| Assessment | Multi-day and multi-week continuity plus outcome pricing make Sierra one of the strongest commercial SaaW examples. Limited disclosure on models, evidence-backed acceptance, and recovery prevents a D5 rating. |
| Official source | [sierra.ai/blog/outcome-based-pricing-for-ai-agents](https://sierra.ai/blog/outcome-based-pricing-for-ai-agents) |



## Factory · Droids / Missions


| Field | Assessment |
|---|---|
| Actual product | A software-engineering worker with multi-model routing, background execution, and multi-day missions. |
| Delivery | Breaks down goals, completes tasks in parallel, validates results, and resumes locally or in the cloud. |
| Models | Multi-model router supporting Claude, Gemini, Kimi, MiniMax, BYOK, and local models. |
| Commercial model | Individual tiers around $20/$100/$200 per month; enterprise and higher usage are custom. |
| Model-cost separation | BYOK enables clear separation of software and model costs. |
| Strict tier | D4 |
| Assessment | Missions decomposes projects into fresh-context Workers, shared external state, independent Validators and an Orchestrator. A mission defines validation-contract.md and features; Workers implement, Validators inspect outputs, and the Orchestrator creates repair tasks on failure. This resembles PM–DEV–QA separation, while its central objective remains engineering delivery reliability rather than complete organizational governance authority. |
| Official source | [factory.ai/news/missions-architecture](https://factory.ai/news/missions-architecture) · [docs.factory.ai/missions/overview](https://docs.factory.ai/missions/overview) |



## causaLens · Digital Worker Factory

| Field | Assessment |
|---|---|
| Actual product | A multi-agent worker factory for high-value knowledge processes; each worker owns a complete business workflow. |
| Team | Specialist agents gather data, analyze, check quality and produce outputs; business owners remain responsible for workflow design and final delivery. |
| Facts and reliability | Trusted Facts, Structured Decision Claims, causal verification, deterministic gates, Agentic QA, MCP Guardian, memory and human intervention. |
| Independent evaluation | Trace/artifact analysis and dedicated Agent-as-a-Judge checks on reports, charts, datasets and models. |
| Models | Model-agnostic containers on customer-selected models and infrastructure. |
| Pricing | Enterprise deployment/project contracts; no universal public price. |
| Strict tier | **D4** |
| Why not D5 | Public materials do not fully establish a cross-task responsibility ledger, independent acceptance authority, idempotent side-effect receipts and governance-state reconstruction. |
| Official sources | [causalens.com/our-digital-worker-factory](https://causalens.com/our-digital-worker-factory) · [causalens.com/the-reliability-features](https://causalens.com/the-reliability-features) |

This is a direct architectural reference for CodeFlowMu: multi-agent workers, independent quality checks and deterministic fact verification already exist in commercial products and cannot be presented as individually unique features.

## Laiye · Laiye Worker / WEP

Laiye evolved from conversational AI into RPA and intelligent automation, then into Worker with model planning and automation skills. RPA executes preset interface/system operations; Worker interprets goals and selects skills. Worker and the WEP enterprise platform should be examined separately, rather than assigning every platform feature to one employee instance. See the [official history](https://laiye.com/news/post/560.html) and [FAQ](https://laiye.com/faq).

| Field | Assessment |
|---|---|
| Actual product | A PC-based local agent and enterprise runtime platform using callable automation skills. |
| Delivery | Natural-language goals, planning, execution across ERP/finance/HR/customer systems and deliverables. |
| Models | Public support includes DeepSeek, Qwen, GLM and OpenAI; some pages also list Kimi and Doubao. |
| Pricing | Community free; Plus RMB39/month; Pro RMB199/month; Enterprise custom. |
| Model-cost separation | Routing and platform subscription can be partly separated. |
| Conclusion | **D4 candidate: sustained role capability needs verification** |
| Assessment | Goal interpretation, planning and tool use support a D3 direction. RPA skills, routing, schedules and the PC environment do not alone prove durable task ownership, continuation of unresolved work across days or accountability after interruption. |
| Official sources | [Worker](https://laiye.com/product/worker) · [FAQ](https://laiye.com/faq) |

## Torq · Socrates


| Field | Assessment |
|---|---|
| Actual product | A virtual SOC analyst with investigation, response, permissions, and audit. |
| Delivery | Analyzes alerts, correlates context, invokes security tools, remediates, and requests approval where policy requires. |
| Models | Exact models are not fully disclosed; the platform meters AI Credits. |
| Commercial model | Workspace tiers include credits, with add-on credit packages. |
| Model-cost separation | Models and agent actions are bundled into fixed credits. |
| Strict tier | D4 |
| Assessment | Security operations offer clear sources of truth, tools, remediation actions, audit, and approval. Socrates can investigate and respond continuously, making it closer to a governed role than a typical support agent. |
| Official source | [kb.torq.io/en/articles/13223383-ai-pricing-model-monitor-and-track-ai-credit-consumption](https://kb.torq.io/en/articles/13223383-ai-pricing-model-monitor-and-track-ai-credit-consumption) |



## CodeFlowMu · Self-Developed Multi-Agent Collaboration and Runtime

| Field | Assessment |
|---|---|
| Position | A collaboration application and runtime organizing how teams complete and deliver work. |
| Relationship to Xiaodian AI | Xiaodian AI is the enterprise application that exposed the engineering problems; CodeFlowMu developed through the collaboration route. They are distinct products. |
| Relationship to SaaW | SaaW describes software delivered as a digital work subject; CodeFlowMu is our practical implementation. A paradigm does not prove implementation completeness. |
| Work organization | Historical implementations use PM/DEV/OPS/QA execution roles and an independent EVAL observer, with tasks, reports, issues and reviews. |
| Human interface | Historical PC panel, mobile web application and approval entry points. |
| Architecture/protocol | TMPA defines work facts and governance semantics; FCoP carries file-based coordination; CodeFlowMu organizes the application and runtime. |
| Current versus historical | Current CodeFlowMu is independently developed and closed source. CodeFlowMu Open was frozen on 2026-08-22 at V1.2.29-open for historical reproduction. |
| Evidence boundary | Historical product materials and version-specific implementation cases; author-run conformance is not independent certification or proof for all current roles. |
| Pricing and model costs | Current universal quotation and contract cost separation were not established. |
| Report rating | **D4: a digital-worker system for the bounded software engineering role.** Based on public development collaboration and CodeFlowMu V1.8.0 evidence in I1.0; different versions do not combine into a guarantee of every current feature. |
| Sources | [Project](https://github.com/joinwell52-AI/joinwell52/blob/main/README.zh-CN.md) · [SaaW article](https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-08-10-saaw-software-as-an-agent-worker) · [Historical open repository](https://github.com/joinwell52-AI/CodeFlowMu-open) |

| Test | CodeFlowMu evidence and assessment |
|---|---|
| Autonomous engineering task completion | Public cases describe goals, decomposition, implementation, testing and reporting. |
| Stable roles | PM, DEV, OPS and QA have distinct execution and acceptance responsibilities. |
| Task ownership | Sender, recipient, parent-child links, scope and acceptance conditions go beyond temporary chat assignments. |
| Cross-cycle state | Tasks, reports, issues and reviews exist outside model sessions; I1.0 C06/C11/C13 provide fixed-input evidence of state retention, reconstruction and recovery. |
| Continued progress | PM organizes dispatch, dependencies, review and rework after receiving an authorized task; the system need not invent enterprise goals. |
| Review and human oversight | Execution and QA roles are separated; I1.0 C07 provides bounded duty-separation and human-approval authorization evidence. |
| Overall conclusion | **D4 (software engineering role)**, limited to the cited engineering materials. |

See the [public collaboration case](https://joinwell52-ai.github.io/joinwell52/zh/digital-employee/2026-08-18-cursor-ai-development-team) and [I1.0 product results](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/zh/publications/implementation-case-i1.0/part-02.md). This edit checked published materials, not a new product run. Governance Reader tests alone do not prove unattended completion of arbitrary real-world work.

CodeFlowMu stays last in the main table and separate from the original commercial pricing sample.

# 5. Architectural References Beyond the D4 Set

Some D3 products still matter directly to worker architecture:

- **Relevance AI:** Manager/specialist edges support delegation, handoffs and automatic, approval-required or agent-decided execution. Task View retains timelines, approvals, failures and escalations.
- **SAP Joule Assistants:** A role-facing assistant coordinates specialist agents; public examples include six agents for financial closing and eleven for logistics.
- **ServiceNow:** A governance/diagnostic control tower, with task-completion and tool correctness/selection metrics at trace/span level.
- **Glean:** Request-level permissions and action-scope checks show runtime governance beyond logging.

These references span tiers; not every product listed here is rated D3. Multi-agent teams, managers, validators, permissions and evaluations exist. The harder question is how they form one continuous structure of work accountability.

# 6. Important Adjacent and Excluded Candidates


| Region | Candidate | Why It Is Not a Core Worker Sample | Treatment | Source |
|---|---|---|---|---|
| China | Recurrent AI | Current official positioning is still sales/conversation intelligence and human augmentation; independent durable outbound work is not sufficiently proven. | Adjacent D2–D3 | [www.rcrai.com/](https://www.rcrai.com/) |
| China | Zhipu AutoGLM commercial solutions | Strong computer-use technology, but enterprise pricing, durable role, and governance evidence remain incomplete. | D3 technology candidate | [www.zhipuai.cn/](https://www.zhipuai.cn/) |
| China | Metaso | Strong research/search tool; lacks durable identity, task ownership, and proactive work evidence. | D1–D2 | [metaso.cn/](https://metaso.cn/) |
| China | Sentence.im | Private-domain sales direction is relevant, but annual worker rent, GMV share, and autonomy claims need primary evidence. | Unresolved | [sentence.im/](https://sentence.im/) |
| China | ChatDev / ModelBest | A research/open-source project cannot be treated as a commercial SaaW offering by ModelBest. | Excluded from commercial core | [github.com/OpenBMB/ChatDev](https://github.com/OpenBMB/ChatDev) |
| Global | DeepSeek ecosystem solution providers | Not one legal entity or product and cannot be audited as a company sample. | Excluded as company sample | [www.deepseek.com/](https://www.deepseek.com/) |


# 7. Volume Conclusion

The sample provides multiple commercial implementations of autonomous task completion. Four routes deserve continued examination:

1. Bounded professional work such as software engineering and security operations.
2. Enterprise transaction systems with business facts and permissions, including ServiceNow, Oracle and Glean.
3. Cross-cycle customer relationships and outcome delivery, including Sierra, with long-term state and failure handling requiring scrutiny.
4. Runtimes organizing models, tools and tasks, including Factory, causaLens and the still-unverified sustained-role candidate Laiye Worker.

D4 does not establish high trust. The report has insufficient public evidence to award any sample D5 across conclusion-level evidence, independent review, idempotent side effects, accountability after recovery and call-time authorization.

For CodeFlowMu, the comparison clarifies engineering choices. Role division, persistent state, tool permissions and output checking already exist elsewhere. The question is whether they jointly produce inspectable, resumable work in a particular role. Xiaodian AI is the starting application, CodeFlowMu our implementation vehicle, and SaaW the intended delivery paradigm; each capability conclusion requires its own evidence.

This edit preserves the commercial sample and four original charts, adds public project context and revises Laiye's conclusion. It is not a uniform version-specific test of every product, and author-run bounded tests are not independent product certification. See the [bilingual editorial notes](https://github.com/joinwell52-AI/joinwell52/blob/main/research/manual-runs/2026-09-03-saaw-three-articles/editorial-scope.md).

The next volume examines models, hallucination controls, software/model costs and the consolidated capability distribution.

# 8. Official Source Directory

The following official pages support the product, pricing, governance, or commercial-delivery assessments in the master library. Where vendors disclose only enterprise sales access, the report keeps pricing as undisclosed rather than filling gaps with secondary claims.

| Sample | Official source |
|---|---|
| Salesforce Agentforce | [www.salesforce.com/agentforce/pricing/](https://www.salesforce.com/agentforce/pricing/) |
| Microsoft Copilot Studio | [www.microsoft.com/en-us/microsoft-365-copilot/pricing/copilot-studio](https://www.microsoft.com/en-us/microsoft-365-copilot/pricing/copilot-studio) |
| ServiceNow Autonomous Workforce | [www.servicenow.com/platform/autonomous-workforce.html](https://www.servicenow.com/platform/autonomous-workforce.html) |
| UiPath Agentic Automation | [www.uipath.com/platform/agentic-automation](https://www.uipath.com/platform/agentic-automation) |
| Workday Agent System of Record / Agent Passport | [newsroom.workday.com/2026-06-02-Workday-Launches-Agent-Passport-to-Test%2C-Verify%2C-and-Continuously-Monitor-Every-AI-Agent-in-the-Enterprise](https://newsroom.workday.com/2026-06-02-Workday-Launches-Agent-Passport-to-Test%2C-Verify%2C-and-Continuously-Monitor-Every-AI-Agent-in-the-Enterprise) |
| Glean Agents | [www.glean.com/ai-agents](https://www.glean.com/ai-agents) |
| Oracle Fusion Agentic Applications | [www.oracle.com/sg/news/announcement/oracle-introduces-fusion-agentic-applications-for-finance-and-supply-chain-2026-04-09/](https://www.oracle.com/sg/news/announcement/oracle-introduces-fusion-agentic-applications-for-finance-and-supply-chain-2026-04-09/) |
| Google Gemini Enterprise Agent Platform pricing | [cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing) |
| HubSpot Breeze Customer Agent | [ir.hubspot.com/news-releases/news-release-details/hubspot-credits](https://ir.hubspot.com/news-releases/news-release-details/hubspot-credits) |
| Zendesk AI Agents | [www.zendesk.com/sg/service/ai/](https://www.zendesk.com/sg/service/ai/) |
| Intercom Fin | [www.intercom.com/pricing](https://www.intercom.com/pricing) |
| Cognition Devin | [devin.ai/pricing](https://devin.ai/pricing) |
| Sierra | [sierra.ai/blog/outcome-based-pricing-for-ai-agents](https://sierra.ai/blog/outcome-based-pricing-for-ai-agents) |
| 11x Alice | [www.11x.ai/products/alice/pricing](https://www.11x.ai/products/alice/pricing) |
| Artisan Ava | [www.artisan.co/ai-sales-agent](https://www.artisan.co/ai-sales-agent) |
| Decagon | [decagon.ai/blog/pricing-ai-agents](https://decagon.ai/blog/pricing-ai-agents) |
| Bland AI | [www.bland.ai/pricing](https://www.bland.ai/pricing) |
| Factory Droids | [www.factory.ai/](https://www.factory.ai/) |
| Harvey | [www.harvey.ai/](https://www.harvey.ai/) |
| Hebbia Matrix | [www.hebbia.ai/](https://www.hebbia.ai/) |
| Abridge | [www.abridge.com/](https://www.abridge.com/) |
| Norm AI | [www.norm.ai/](https://www.norm.ai/) |
| Regie.ai | [www.regie.ai/pricing](https://www.regie.ai/pricing) |
| Ada | [www.ada.cx/](https://www.ada.cx/) |
| Cresta AI Agent | [cresta.com/ai-agent](https://cresta.com/ai-agent) |
| Writer Agents | [support.writer.com/articles/3099016123-what-is-writer](https://support.writer.com/articles/3099016123-what-is-writer) |
| Moveworks | [www.moveworks.com/us/en/platform](https://www.moveworks.com/us/en/platform) |
| Laiye Worker | [laiye.com/product/worker](https://laiye.com/product/worker) |
| Tencent WorkBuddy | [cloud.tencent.com/document/product/1831/134333](https://cloud.tencent.com/document/product/1831/134333) |
| DingTalk Wukong | [wukong.dingtalk.com/docs/enterprise-membership/purchase-guide/](https://wukong.dingtalk.com/docs/enterprise-membership/purchase-guide/) |
| Doubao Work | [www.doubao.com/work](https://www.doubao.com/work) |
| Baidu AI Cloud Keyue Digital Employees | [cloud.baidu.com/product-s/keyue_home/digital-employees](https://cloud.baidu.com/product-s/keyue_home/digital-employees) |
| Sobot Agents | [www.zhichi.com/agents/](https://www.zhichi.com/agents/) |
| Shulex Solvea | [solvea.shulex.com/](https://solvea.shulex.com/) |
| Yonyou BIP Intelligent Digital Employees | [www.yonyou.com/news/3768](https://www.yonyou.com/news/3768) |
| Kingdee AI Cosmic | [www.kingdee.com/sg/zh-hans/product/cosmic-ai/](https://www.kingdee.com/sg/zh-hans/product/cosmic-ai/) |
| Deepexi DeepWorks / FastAGI | [deepworks.deepexi.com/deepworks-docs/](https://deepworks.deepexi.com/deepworks-docs/) |
| Langboat LangClaw | [www.langboat.com/document/enterprise/langclaw/guide](https://www.langboat.com/document/enterprise/langclaw/guide) |
| Shizai Intelligence / Shizai Agent | [www.ai-indeed.com/about](https://www.ai-indeed.com/about) |
| 1688 | [www.1688.com/](https://www.1688.com/) |
| SAP Joule Agents | [www.sap.com/products/artificial-intelligence/ai-agents.html](https://www.sap.com/products/artificial-intelligence/ai-agents.html) |
| Parloa | [www.parloa.com/](https://www.parloa.com/) |
| Dust | [dust.tt/](https://dust.tt/) |
| Mistral Agents API | [mistral.ai/news/agents-api/](https://mistral.ai/news/agents-api/) |
| Relevance AI pricing | [relevanceai.com/pricing](https://relevanceai.com/pricing) |
| Torq Socrates / AI pricing | [kb.torq.io/en/articles/13223383-ai-pricing-model-monitor-and-track-ai-credit-consumption](https://kb.torq.io/en/articles/13223383-ai-pricing-model-monitor-and-track-ai-credit-consumption) |
| Darwinbox | [darwinbox.com/](https://darwinbox.com/) |
| PKSHA Technology | [www.pkshatech.com/en/](https://www.pkshatech.com/en/) |
| LayerX / Bakuraku | [bakuraku.jp/](https://bakuraku.jp/) |
| Robin AI | [www.robinai.com/](https://www.robinai.com/) |
| Juro | [juro.com/](https://juro.com/) |
| PolyAI | [poly.ai/](https://poly.ai/) |
| Yellow.ai | [yellow.ai/](https://yellow.ai/) |




## Additional Sources in This Edition

| Reference | Source |
|---|---|
| SaaW concept article | [joinwell52-ai.github.io/joinwell52/zh/industry/2026-08-10-saaw-software-as-an-agent-worker](https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-08-10-saaw-software-as-an-agent-worker) |
| CodeFlowMu and Xiaodian AI | [github.com/joinwell52-AI/joinwell52/blob/main/README.zh-CN.md](https://github.com/joinwell52-AI/joinwell52/blob/main/README.zh-CN.md) |
| Xiaodian AI demo | [demo.chedian.cc/](https://demo.chedian.cc/) |
| causaLens Digital Worker Factory | [causalens.com/our-digital-worker-factory](https://causalens.com/our-digital-worker-factory) |
| causaLens reliability | [causalens.com/the-reliability-features](https://causalens.com/the-reliability-features) |
| Factory Missions architecture | [factory.ai/news/missions-architecture](https://factory.ai/news/missions-architecture) |
| Relevance AI Task View | [relevanceai.com/docs/build/workforces/workforce-features/workforce-task-view](https://relevanceai.com/docs/build/workforces/workforce-features/workforce-task-view) |
| SAP Joule Agents | [learning.sap.com/courses/introducing-joule/getting-to-know-joule-agents_f9d18ca0-1021-4c1a-a044-4c00ec8c2898](https://learning.sap.com/courses/introducing-joule/getting-to-know-joule-agents_f9d18ca0-1021-4c1a-a044-4c00ec8c2898) |
| WorkBuddy model configuration | [cloud.tencent.com/document/product/1831/134445](https://cloud.tencent.com/document/product/1831/134445) |
| WorkBuddy pricing | [cloud.tencent.com/document/product/1831/134333](https://cloud.tencent.com/document/product/1831/134333) |
| HubSpot outcome pricing | [www.hubspot.com/company-news/hubspots-customer-agent-and-prospecting-agent-now-you-pay-when-the-task-is-complete](https://www.hubspot.com/company-news/hubspots-customer-agent-and-prospecting-agent-now-you-pay-when-the-task-is-complete) |
| Zendesk resolution tiers | [support.zendesk.com/hc/en-us/articles/9570369117338-About-automated-resolution-tiers](https://support.zendesk.com/hc/en-us/articles/9570369117338-About-automated-resolution-tiers) |
