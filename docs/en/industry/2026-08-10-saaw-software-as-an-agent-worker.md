---
title: "SaaW: Software as an Agent Worker — From SaaS to SaaW"
date: "2026-08-10"
column: "industry-architecture"
category: "manifesto"
version: "V1.1"
summary: "A 23-section manifesto deriving SaaW from governance, TMPA, FCoP, Agent PC, CodeFlowMu, and Self-Morphing, anchored in Research Report Production Engine V1.3 and explicitly separating validated capabilities from research frontiers."
item_id: "MANIFESTO-20260810-SAAW"
lifecycle: "Published"
cover: "/assets/covers/01-saaw-manifesto-cover.jpeg"
visualization: "/assets/covers/02-saaw-governance-runtime-stack-fixed-v2.png"
visualization_2: "/assets/covers/03-saaw-self-morphing-loop-fixed.png"
evidence_status: "Architecture-grounded + production-engine reference implementation"
citation_status: "Internal publication mapping completed"
editing_status: "Published V1.1 — full 23-section edition"
publication_authorized: true
outline: deep
---

# SaaW: Software as an Agent Worker
## From SaaS to SaaW: When the Codebase Begins to “Develop Itself”

**A Digital Employee Manifesto Grounded in TMPA Governance and CodeFlowMu Engineering · V1.1**

[中文版](/zh/industry/2026-08-10-saaw-software-as-an-agent-worker)

![SaaW — Software as an Agent Worker](/assets/covers/01-saaw-manifesto-cover.jpeg)

---

## 1. The last mile SaaS never solved

For the past two decades, SaaS transformed how software is delivered. Browsers became the interface, cloud became infrastructure, and subscription became the business model.

But one thing barely changed:

**Humans still operate software.**

Employees log into ERP systems, copy data into spreadsheets, update CRM records, submit expenses, approve requests, and move results into yet another system.

SaaS solved how software is delivered. It did not solve who performs the work.

Copilot moved the boundary forward. AI began helping people draft, summarize, code, search, and decide.

But the basic relationship remained:

**AI gives advice; humans perform the work.**

The next generation of software should not merely be a smarter tool.

It should be software capable of taking responsibility for work.

We call this paradigm:

> **SaaW — Software as an Agent Worker**

Software is no longer only a Service.

Software begins to become a Worker.

---

## 2. From buying tools to deploying digital employees

SaaW is not simply an Agent embedded inside SaaS. It changes the unit of software delivery.

SaaS delivers **Function**.

Copilot delivers **Assistance**.

SaaW delivers **Work**.

A real SaaW cannot be merely a chatbot with a system prompt. It needs job-like structure: Role, Responsibilities, Workflow, Skills, bounded Permissions, persistent Work State, verifiable Evidence, recoverable Runtime, and explicit human authority boundaries.

> **SaaW is a software paradigm in which software is delivered as a digital work actor. It can continuously execute workflows, use business tools, produce work outcomes, and operate under explicit responsibility, permission, governance, supervision, review, and authorization boundaries.**

```text
SaaS
Software provides tools
        │
        ▼
Copilot
AI assists humans
        │
        ▼
Agent
AI executes actions
        │
        ▼
SaaW
Software performs work
```

The real change is not simply that AI became smarter.

**The labor attribute of software changed.**

---

## 3. The real enterprise problem: Trace is not Governance

An Agent that can call tools is not automatically ready for production.

Modern multi-agent systems can generate detailed Execution Traces: who called which tool, which function ran, what result was produced, and which reasoning steps occurred.

Those traces matter.

But:

> **Trace ≠ Governance**

Trace answers: **What happened?**

Enterprise governance must also answer: Who authorized the work? Who accepted responsibility? Which object represents the official work fact? Who submitted the Report? Who performed the Review? Who made the Decision? Is the current state legal? Are references dangling? Are disagreements unresolved? After failure, who is allowed to continue?

This is not merely a logging problem.

It is a Governance State problem.

> **No governance, no employee.**

That is why TMPA exists.

---

## 4. TMPA: Work facts must exist independently of the Agent

TMPA stands for **Textual Multi-Agent Process Architecture**.

It asks a simple question: when Agents and humans jointly perform long-running work, where should trustworthy work state live?

Traditional Agent systems often put state in model context, runtime memory, database internals, brokers, central schedulers, or an ever-growing conversation.

The common weakness is that runtime instances and work facts become too tightly coupled.

TMPA chooses another path:

> **Text carries messages and state.**

Important work facts are projected into plain, portable text.

These are not merely chat transcripts. They are formal work objects such as Task, Acceptance, Report, Review, Decision, Correction, and Issue.

Those objects form causal relationships through Reference Identifiers.

Agents can exit. Models can change. Processes can restart. Nodes can go offline.

Established work facts remain.

That is the first foundation for a long-running SaaW.

---

## 5. Single-Writer: Responsibility needs a clear source

Another core TMPA principle is:

> **Single-Writer Serial Streams**

Each Agent or human responsibility holder is an independent Single Writer.

One actor does not silently rewrite facts authored by another. New state is created by appending new objects.

```text
TASK
  │
  ▼
ACCEPTANCE
  │
  ▼
REPORT
  │
  ▼
REVIEW
  │
  ▼
DECISION
```

Each action has an author and explicit references.

Responsibility is therefore derived from work facts themselves, not guessed from the final database status.

Traditional workflow systems often overwrite one central state until only `status = done` remains.

TMPA instead asks who accepted, who submitted, who reviewed, who approved, what disputes occurred, and which facts were later corrected.

State is not merely overwritten.

It is reconstructed.

---

## 6. The asynchronous world has no perfect global timeline

Real multi-agent systems are asynchronous.

PM may write a plan while DEV changes code, QA checks another module, OPS handles deployment, and a human supervisor approves hours later.

Forcing a perfect global sequence can hide the real concurrency.

TMPA therefore emphasizes:

> **Asynchronous Collaboration**

Single-Writer Streams can advance independently.

The write side does not manufacture a fake universal chronology.

The Reader reconstructs relationships from Reference, Causality, Transition, Responsibility, and Governance Rules.

The result is a Partial-Order Graph rather than a flat event log.

```text
            ┌── DEV REPORT ──┐
TASK ───────┤                ├── REVIEW
            └── OPS REPORT ──┘
```

Which report happened first is less important than their causal relationship to the same Task and the Review that depends on them.

---

## 7. Issue Set: Do not hide disagreement

Automation systems often prefer a cosmetically green final state.

Real organizations are not like that.

References may be missing. State transitions may be illegal. QA may reject DEV. Reports may lack evidence. Decisions may lack valid preconditions. Roles may disagree.

TMPA does not try to make those problems disappear.

It makes them formal facts.

The Reader therefore reconstructs not only a Process Graph but also an Issue Set, such as:

```text
dangling_reference
illegal_transition
unresolved_disagreement
missing_acceptance
conflicting_review
```

Enterprises do not need mythical AI that never fails.

They need AI systems that can tell where failure occurred and surface it to the right authority.

---

## 8. Recoverability: A digital employee must be able to wake up and continue

The difference between SaaW and a chatbot is partly a difference in time scale.

A chatbot session may last minutes. Real work can last hours, days, weeks, or months.

Digital employees will encounter network interruptions, SDK timeouts, Agent exits, runtime restarts, context loss, operating-system restarts, and software upgrades.

If every failure requires telling the AI the whole story again, it cannot become a reliable Worker.

SaaW therefore needs:

> **Recoverability**

TMPA allows governance state to be recalculated from persistent work facts.

CodeFlowMu / FCoP projects that idea into the file system.

After restart, the runtime rereads TASK, ACCEPTANCE, REPORT, REVIEW, DECISION, and ISSUE, then derives current responsibility, completed work, approved results, unresolved problems, legal next actions, and the next actor.

Recovery is not about restoring an Agent's memory.

It is about reconstructing the facts of work.

---


### A Day in the Life of a Digital Researcher: Research Report Production Engine V1.3

There is no need to invent a fictional job. The **Research Report Production Engine V1.3** already gives us a real, observable example of a digital researcher at work.

**09:00 · Research Discovery**  
The digital researcher starts the day by scanning new research signals, engineering changes, and open questions, deciding what deserves attention.  
**Output: Signal Pool.**

**10:00 · Research Queue**  
It selects the research object that should actually move forward that day, sets priority, and decides what the day's research will focus on. It does not turn every signal into an article.  
**Output: Today's Research Plan.**

**11:00 · Research Reading**  
It reads papers, specifications, engineering records, code, test results, and existing material around the selected object, organizes usable evidence, and records what is still missing.  
**Output: Reading Result.**

**13:00 · Research Analysis**  
It turns the morning's material into judgments: which facts hold, which statements remain inference, where disagreement exists, what the boundary conditions are, and what research conclusion should be formed next.  
**Output: Research Object.**

**15:00 · Research Production**  
The digital researcher turns the research object into a formal work product: structuring the article, drafting the report, checking evidence, and adding required diagrams or visualizations until a publishable candidate exists.  
**Output: Publication Candidate.**

**20:00 · Formal Publication**  
Once the candidate satisfies publication conditions, it enters the formal release path: GitHub write, website generation, commit verification, and release confirmation. If an action requires accountable human authority, the work stops at that authority boundary and waits for a human decision.  
**Output: formally published research result.**

```text
09:00 Research Discovery   → Signal Pool
10:00 Research Queue       → Today's Research Plan
11:00 Research Reading     → Reading Result
13:00 Research Analysis    → Research Object
15:00 Research Production  → Publication Candidate
20:00 Formal Publication   → GitHub + Website + Commit Verify + Release
```

That is a day in the life of a digital researcher: **it is not answering one question; it is continuously performing a research job under a defined role and work rhythm.**


---

## 9. CodeFlowMu: Bringing TMPA into the runtime world

If TMPA addresses governance architecture, CodeFlowMu addresses how Agents actually work.

Its engineering starting point is not to build a giant central Agent Runtime.

Reasoning is delegated to mature model ecosystems. Tools live in real operating environments.

CodeFlowMu focuses on work orchestration, Agent Responsibility, lifecycle, FCoP, Skill invocation, Report, Review, Human Decision, Recovery, and Runtime Governance.

This creates an important boundary:

**CodeFlowMu does not need to reinvent the LLM.**

The model is only one part of a digital employee's brain.

What makes it an employee is the surrounding work structure.

![SaaW governance and runtime architecture: SaaW, CodeFlowMu, FCoP, and TMPA](/assets/covers/02-saaw-governance-runtime-stack-fixed-v2.png)

*Figure 1. SaaW describes the software-delivery paradigm; CodeFlowMu provides the engineering runtime; FCoP provides the lightweight coordination protocol; TMPA provides the work-fact and governance architecture.*

---

## 10. FCoP: Filename as Protocol

A core CodeFlowMu engineering choice is FCoP.

FCoP projects part of the coordination and governance relationship directly into the file system.

Work objects are not hidden inside a central server. They can be observed as files.

File names, directories, references, and lifecycle transitions become part of the protocol.

```text
inbox
  │
  ▼
active
  │
  ▼
review
  │
  ▼
done
  │
  ▼
archive
```

The result is simple but powerful:

> **Directory becomes observable state.**

Administrators, human supervisors, Agents, and debugging tools can inspect the same facts.

This reduces one of the most dangerous forms of complexity in multi-agent systems: hidden state.

---

## 11. Agent PC: A real digital employee needs a “computer”

If SaaW is a Worker, the Worker needs a work environment.

We call this runtime node:

> **Agent PC**

It does not have to be a physical computer. It represents an independent runtime environment containing Reasoning, Skills, Workflow, Credentials, Runtime, Files, Governance, and External Systems.

It may use browsers, APIs, CLI tools, scripts, MCP, internal enterprise services, and controlled automation hooks.

The loop therefore changes from `Prompt → Response` into:

```text
Task
 ↓
Reason
 ↓
Use Skill
 ↓
Operate System
 ↓
Observe Result
 ↓
Produce Evidence
 ↓
Continue / Report / Escalate
```

That is a digital-worker runtime loop.

---

## 12. Non-invasive digital employees: Let AI use software, not bypass software

One of the most dangerous temptations in enterprise automation is to let AI modify the database directly.

That may look efficient, but real enterprise systems are not simple CRUD layers.

A field may sit behind state machines, triggers, stored procedures, permission rules, financial controls, workflow, audit trails, and external integrations.

Direct table writes can bypass decades of accumulated business safeguards.

SaaW should therefore prefer:

**AI operates the business system rather than bypassing it.**

```text
Agent
  │
  ├── API
  ├── Browser
  ├── CLI
  ├── Hook
  └── Approved Automation
        │
        ▼
Existing ERP / CRM / Business System
```

The goal is not to claim that AI never makes mistakes. It is to keep mistakes inside boundaries where existing business systems can observe, reject, audit, and roll them back.

---

## 13. Rediscovering enterprise SOP from code

Legacy Software contains an underestimated asset:

**Code itself is enterprise knowledge.**

Business rules may be scattered across APIs, controllers, forms, validation logic, state transitions, permission checks, batch scripts, database schemas, and configuration.

A Meta-Development Team can help reconstruct:

```text
Existing Code
      │
      ▼
Business Rules
      │
      ▼
Workflow
      │
      ▼
SOP
      │
      ▼
Digital Employee Skills
```

But “scan code = understand the enterprise” would be naïve.

Real SOP also comes from documents, human explanation, API specifications, operation recordings, job descriptions, policy, and domain experts.

A more rigorous formulation is:

> **Enterprise Evidence → Candidate SOP → Validation → Governed Workflow**

AI can cheaply structure scattered evidence. A Candidate SOP becomes an executable Worker workflow only after business validation, engineering testing, governance checks, or human authorization.

---

## 14. CodeFlowMu's second form: Meta-Development Runtime

The most important direction for CodeFlowMu is not simply that multiple Agents can develop software together.

The development capability itself can become a production capability for digital employees.

An initial CodeFlowMu team may contain four roles:

```text
┌───────────────────────────────┐
│      CodeFlowMu Meta Team     │
│                               │
│ PM        DEV       QA    OPS │
└───────────────────────────────┘
```

PM interprets goals and orchestrates work. DEV implements code, Skills, Hooks, and Workflows. QA verifies business and engineering outcomes. OPS manages runtime, recovery, deployment, and lifecycle.

This is:

> **Meta-Dev Mode**

Its output does not have to be only traditional software.

It can be a Digital Employee Package.

---

## 15. Digital Employee Package: Making Digital Employees Engineerable Products

A digital employee must be described as an engineering artifact before deployment.

A Worker Package may include Role, Responsibilities, Workflow, Skills, Permissions, Policies, Validation Rules, Runtime Configuration, Recovery Rules, and Human Decision Gates.

A digital employee can therefore be defined, developed, tested, versioned, deployed, upgraded, and rolled back like a serious software product.

That is one of the fundamental differences between SaaW and “writing an Agent prompt.”

---


### A Real Engineering Anchor: The SaaW Manifesto Is Part of the Case

There is a useful recursive relationship here.

We are not writing a manifesto that claims SaaW exists and then inventing an example to justify it. **We use the operating Research Report Production Engine V1.3 to explain SaaW, while this SaaW Manifesto itself becomes a research artifact managed, reviewed, and published through that production system.**

```text
Research Question
        ↓
Research Object
        ↓
Evidence / Reading
        ↓
Analysis
        ↓
Report
        ↓
Evidence Gate
        ↓
Visualization
        ↓
Human Authorization
        ↓
Publication
```

The same path expressed as a SaaW worker model is:

```text
Role → Workflow → Skills → Work State → Evidence
     → Governance → Human Authority → Work Outcome
```

> **This is not an AI writing tool. It is a governed research worker.**


---

## 16. Self-Morphing: When the codebase begins to “develop itself”

Now we reach the central idea of this manifesto:

> **Self-Morphing**

It does not mean that an Agent freely mutates its source code, and it does not mean unrestricted AI self-replication.

> **Self-Morphing means that a digital-employee runtime can use its own software-development capability to construct, validate, and deploy new digital-worker forms.**

![Self-Morphing: from meta-development runtime to the digital-worker work loop](/assets/covers/03-saaw-self-morphing-loop-fixed.png)

*Figure 2. The governed Self-Morphing loop brings development, validation, authorization, deployment, work execution, and work evidence into one recoverable and traceable lifecycle.*

```text
Meta-Dev Runtime
        │
        ▼
Analyze Existing Work
        │
        ▼
Develop Worker Package
        │
        ▼
Validate
        │
        ▼
Human / Governance Decision
        │
        ▼
Deploy
        │
        ▼
Domain Worker Runtime
```

For example:

```text
PM / DEV / QA / OPS
        │
        │ develops
        ▼
Finance Worker Package
        │
        ▼
Invoice Agent
ERP Entry Agent
Compliance Agent
Archive Agent
```

Or:

```text
PM / DEV / QA / OPS
        │
        ▼
Contract Worker Package
        │
        ▼
Risk Analysis Agent
Signing Agent
Compliance Agent
Archive Agent
```

Traditional software development looks like:

```text
Human
  ↓
builds Software
  ↓
Human uses Software
```

Self-Morphing introduces another pattern:

```text
AI Development Team
        ↓
builds Digital Worker
        ↓
Digital Worker performs Work
```

And the next step is even more important:

```text
Worker performs Work
        │
        ▼
Evidence / Issues
        │
        ▼
Development Input
        │
        ▼
Next Worker Version
```

Development and work begin to form one loop:

> **Develop → Validate → Deploy → Work → Observe → Improve**

That is the meaningful engineering interpretation of “the codebase develops itself.”

---

## 17. From Development Runtime to Work Runtime

Traditional software separates development, production runtime, and human work.

SaaW begins to recombine them.

```text
Development Runtime
        │
        ▼
Digital Employee Package
        │
        ▼
Work Runtime
        │
        ▼
Work Evidence
        │
        ▼
Development Runtime
```

This is not merely DevOps.

DevOps connects Development and Deployment.

SaaW attempts to connect:

**Development and Work.**

That may become one of the deepest boundaries between AI-native and traditional software.

---

## 18. Humans do not disappear; they leave the operation layer

Digital employees do not imply Human-Out-of-the-Loop.

Safe SaaW must clearly define which actions Agents can perform autonomously and which actions require human authority.

In SaaS, humans usually remain in the operation layer.

In SaaW, humans increasingly move to supervision and final authorization.

Low-risk activities such as querying, organizing, validation, internal reporting, and synchronization can become highly automated.

Large payments, final contract signatures, permission escalation, irreversible data operations, and important public publication should enter Decision Gates.

A better principle is:

> **Human at the Authority Boundary.**

---

## 19. PWA: The mobile control plane for a digital-employee team

The CodeFlowMu PWA is not merely a mobile webpage.

It represents the:

> **Human Control Plane**

Supervisors can inspect Tasks, Agent state, Reports, Reviews, Issues, Waiting Decisions, Recovery State, and work outcomes.

```text
SaaW Runtime
      │
      ▼
Report
      │
      ▼
FCoP / TMPA Facts
      │
      ▼
Reader
      │
      ▼
Mobile PWA
      │
      ▼
Human Approve / Reject
      │
      ▼
Decision
      │
      ▼
SaaW Runtime continues
```

Approve is not merely a UI click.

The click is only the interface.

What actually happens is:

```text
Human Decision
        ↓
Governance Fact
        ↓
State Transition
```

Authorization therefore enters durable work history.

---

## 20. A digital employee must not depend on a model session that never disconnects

Many Agent products hide a dangerous assumption: the model session will always remain alive.

Reality is different.

Models time out. Context overflows. Gateways fail. Agents crash. Software upgrades. Servers restart.

A real SaaW must therefore follow a critical principle:

> **Agent is replaceable. Work facts are not.**

Agents can change. Models can change. SDKs can change. Runtimes can restart.

Established work facts must not disappear.

TMPA, FCoP, and CodeFlowMu converge on the same architectural direction:

**Free intelligence from session continuity, and build work continuity on durable facts.**

---

## 21. SaaW changes software economics, not merely AI

Ultimately SaaW is not just another Agent Framework.

It may imply a change in software economics.

The SaaS business model is: enterprises buy software capability and continue staffing people.

The SaaW business model may become: enterprises deploy digital work capacity, and outcomes become part of software delivery.

Therefore:

**SaaS sells Capability.**  
**SaaW delivers Work.**

Enterprises may eventually buy not only CRM, but a digital customer-operations team; not only finance software, but digital finance workers; not only a contract-management platform, but a digital contract-review and fulfillment team.

The software market may expand from the Software Market into the:

> **Digital Labor Market**

---

## 22. SaaW is not a new chat box

The whole argument can be reduced to one sentence:

**A digital employee is not a smarter chatbot.**

It requires job responsibilities, a work environment, tools, permissions, state, governance, evidence, recovery capability, and human authority boundaries.

TMPA studies how those work facts become valid.

FCoP studies how coordination can be projected in an extremely lightweight way.

CodeFlowMu studies how Agents actually form teams and continue working.

Agent PC provides the work environment.

PWA provides the human control surface.

SaaW gives the whole transition a higher-level name:

> **Software as an Agent Worker**

---

## 23. From SaaS to SaaW

For the past forty years, software has largely answered one question:

> **How can we help humans work more efficiently?**

AI-native software may begin to answer another:

> **Which work can software itself perform?**

This does not mean software replaces everyone.

The deeper change may be that humans gradually leave repetitive software operation, Agents enter the operation layer, and humans move into the governance layer.

```text
SaaS
Human operates Software
        ↓
Copilot
Human operates with AI
        ↓
SaaW
AI performs Work
Human governs AI
```

And when a system capable of developing digital workers begins to use its own capability to develop the next generation of workers:

```text
AI develops Worker
        ↓
Worker performs Work
        ↓
Work produces Evidence
        ↓
Evidence drives Development
        ↓
AI develops next Worker
```

A software lifecycle that did not previously exist begins to emerge.



### Validated (Today)

The boundary between engineering fact and research frontier should remain explicit. Validated capabilities include:

- FCoP file-driven lifecycle, handoff, reports, and issues;
- real PM / DEV / QA / OPS multi-Agent collaboration loops;
- `Report`, `Review`, `Decision`, and human approval paths;
- the PWA human control plane and pending-decision handling;
- recovery governance after runtime interruption;
- TMPA Reader, specification tests, and reconstruction of work facts;
- real CodeFlowMu engineering cases;
- the Research Report Production Engine V1.3 research-to-governed-publication workflow.

### Under Exploration (Next)

Still under research, standardization, or broader engineering validation are:

- standardized Digital Employee Packages;
- standardized Agent PC;
- role-specific Work Runtimes;
- Candidate SOP extraction from legacy systems and enterprise evidence;
- Meta-Development Runtime → Domain Worker Runtime transformation;
- governed Self-Morphing.

This distinction is part of the credibility of the architecture: **validated capability should be stated with evidence, while frontier capability should remain a research proposition.**


That is the direction CodeFlowMu is exploring.

Not another Multi-Agent Framework, but:

> **Software infrastructure capable of developing, running, governing, recovering, and continuously evolving digital employees.**

That is why we propose SaaW.

> **SaaW — Software as an Agent Worker**

Software was once a tool.

Then it became a service.

Now, it is beginning to work.

**From Software Market to Digital Labor Market.**

---

> **Author / Publisher:** joinwell52 Research Center / CodeFlowMu Core Team  
> **Architecture and Theory:** TMPA Architecture Paper — TMPA-ARCH-A0.9  
> **Normative Standard:** TMPA Core Specification — S0.6  
> **Implementation Case:** TMPA Implementation Case Report — I0.8  
> **Core Engineering Vehicle:** CodeFlowMu / FCoP

> **V1.1 scope note:** This is a technical manifesto for AI-native software, multi-agent engineering, and enterprise digital employees. SaaW, Self-Morphing, and Digital Employee Runtime combine current architecture and engineering practice with active research directions. Capability boundaries are defined by the corresponding public specifications, tests, and implementation evidence.
