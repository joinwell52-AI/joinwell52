---
title: "SaaW: Software as an Agent Worker — From SaaS to SaaW"
date: "2026-08-10"
column: "industry-architecture"
category: "manifesto"
version: "V1.1"
summary: "A 23-section manifesto deriving SaaW from Governance, TMPA, FCoP, Agent PC, CodeFlowMu, Self-Morphing and the Digital Employee Runtime."
item_id: "MANIFESTO-20260810-SAAW"
lifecycle: "Published"
cover: "/assets/covers/saaw-manifesto-cover.svg?v=20260811-approved"
visualization: "/assets/covers/saaw-governance-stack.svg"
visualization_2: "/assets/covers/saaw-self-morphing-loop.svg"
evidence_status: "Architecture-grounded"
citation_status: "Internal publication mapping completed"
editing_status: "Published V1.1 — full 23-section edition"
publication_authorized: true
outline: deep
---

# SaaW: Software as an Agent Worker
## From SaaS to SaaW: When the Codebase Begins to “Develop Itself”

**A Digital Employee Manifesto Grounded in TMPA Governance and CodeFlowMu Engineering · V1.1**

[中文版](/zh/industry/2026-08-10-saaw-software-as-an-agent-worker)

![SaaW — Software as an Agent Worker](/assets/covers/saaw-manifesto-cover.svg?v=20260811-approved)

> **Author / Publisher:** joinwell52 Research Center / CodeFlowMu Core Team  
> **Architecture:** TMPA Architecture Paper — TMPA-ARCH-A0.9  
> **Normative standard:** TMPA Core Specification — S0.6  
> **Implementation evidence:** TMPA Implementation Case Report — I0.8  
> **Engineering vehicle:** CodeFlowMu / FCoP

---

## 1. The last mile SaaS did not solve

Over the past two decades, SaaS transformed the delivery of software.

Enterprises no longer bought software on discs, maintained large fleets of local servers, or paid the same deployment cost for every upgrade. The browser became the interface, the cloud became infrastructure, and subscription became the business model.

Yet one thing barely changed:

**Humans still operate software.**

Employees sign into ERP systems to retrieve data and copy it into spreadsheets. They open CRM systems to enter customer information, submit expenses in finance software, approve requests in workflow systems, and move the result into yet another application.

Enterprises own more software than ever, and employees operate more software than ever.

SaaS solved “how software is delivered,” but it did not fundamentally solve “who does the work.”

Copilot took the next step.

AI entered the software interface and began helping humans write email, summarize documents, generate code, search knowledge and support decisions.

But the basic relationship remained:

**AI advises; humans perform the work.**

People still sit in front of screens, click buttons, switch systems, enter results and resolve exceptions.

The next generation of software worth discussing should not merely be a smarter tool.

It should be:

**Software capable of carrying work.**

We call this paradigm:

# SaaW — Software as an Agent Worker

Software as an Agent Worker.

Software is no longer only a Service.

Software begins to become a Worker.

---

## 2. From “buying tools” to “deploying digital employees”

The core change in SaaW is not simply embedding an Agent inside SaaS.

It changes the basic unit of software delivery.

SaaS delivers **Function**.

Copilot delivers **Assistance**.

SaaW delivers **Work**.

A real SaaW should not merely be a chatbot with a system prompt.

It needs a structure closer to an actual job:

- an explicit Role;
- explicit Responsibilities;
- executable Workflows;
- callable Skills;
- bounded Permissions;
- persistent Work State;
- verifiable Evidence;
- a recoverable Runtime;
- explicit human authority boundaries.

We therefore define SaaW as follows:

> **SaaW (Software as an Agent Worker) is a software paradigm in which software is delivered as a digital work actor. Under explicit role responsibilities, permission boundaries and governance rules, it can continuously execute workflows, use business tools, produce work outcomes, and remain subject to human supervision, review and authorization.**

Enterprise software therefore begins to follow a clear evolutionary path:

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

The real change is not merely that AI becomes smarter.

It is that **software acquires a labor role.**

---

## 3. The real enterprise problem: Trace is not Governance

An Agent being able to call tools does not mean it is ready for enterprise production.

Many multi-agent systems can already generate rich execution traces: which agent invoked which tool, which function executed, what result was produced, and what steps the model followed.

That information matters.

But:

# Trace ≠ Governance

Execution Trace answers: **What happened?**

Enterprises must answer much more: Who authorized the work? Who accepted it? Which object represents the official work fact? Who submitted the Report? Who performed the Review? Who made the Decision? Is the current state legal? Are there dangling references? Are there unresolved disagreements among actors? After a crash, who is allowed to continue?

That is not merely a logging problem.

It is a Governance State problem.

Without these answers, an Agent cannot credibly carry organizational responsibility.

Our position is therefore:

> **No governance, no employee.**

That is why TMPA exists.

---

## 4. TMPA: Work facts must exist independently of the Agent

TMPA stands for **Textual Multi-Agent Process Architecture**.

It asks a simple foundational question:

**When multiple Agents and humans perform long-running work together, where does trustworthy work state actually live?**

Traditional Agent systems often place state in model context, runtime memory, internal database records, brokers, central schedulers, or an ever-growing conversation.

These approaches share a common problem: **the running instance becomes too tightly coupled to the work fact.**

TMPA takes another path.

# Text carries messages and state.

Important work facts are projected into plain, portable text.

These texts are not merely chat transcripts. They are formal work objects such as Task, Acceptance, Report, Review, Decision, Correction and Issue.

Reference Identifiers connect those objects causally.

Work facts therefore no longer exist only inside an Agent’s memory.

Agents may exit. Models may change. Processes may restart. Nodes may temporarily go offline.

But established work facts remain.

That is the first foundation that allows SaaW to persist.

---

## 5. Single-Writer: Responsibility needs an explicit source

Another core TMPA principle is:

# Single-Writer Serial Streams

Every Agent or human responsibility holder acts as an independent Single Writer.

One actor does not silently rewrite a fact already written by another actor.

New state is produced through newly appended objects.

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

Every action has an author and explicit references.

Responsibility is therefore not guessed from the final database value. It is formed by the facts themselves.

Traditional workflow systems often mutate one central status:

```text
status = pending
status = running
status = review
status = done
```

At the end, only `status = done` is visible, while the actual process may have been overwritten.

TMPA cares about who accepted, who submitted, who reviewed, who approved, what disputes occurred, and which facts were later corrected.

**State is not overwritten. It is reconstructed.**

---

## 6. There is no perfect global timeline in an asynchronous world

Real multi-agent systems are inherently asynchronous.

PM may be writing a plan while DEV changes code. QA may already be checking another module. OPS may be handling deployment. A human supervisor may approve hours later.

Forcing this reality into a perfect total order — `1 → 2 → 3 → 4 → 5` — can conceal the actual concurrency.

TMPA therefore emphasizes:

# Asynchronous Collaboration

Different Single-Writer Streams may progress independently.

The write side does not fabricate a global timeline.

The Reader reconstructs relationships from Reference, Causality, Transition, Responsibility and Governance Rules.

The result is not merely a log list but a Partial-Order Graph.

```text
            ┌── DEV REPORT ──┐
TASK ───────┤                ├── REVIEW
            └── OPS REPORT ──┘
```

Which Report happened first matters less than the causal fact that both depend on the same TASK and that REVIEW depends on those work facts.

That is closer to how real organizations work.

---

## 7. Issue Set: Do not hide conflict

Automation systems often aim for a cosmetically clean final state: conflicts disappear, errors auto-heal, everything turns green.

Real organizations do not work that way.

Two roles may disagree. A reference may not exist. A state transition may be illegal. QA may reject DEV. A Report may lack evidence. A Decision may not have legal prerequisites.

TMPA does not try to make these problems disappear.

It makes them **formal facts**.

The Reader therefore reconstructs not only a Process Graph but also an Issue Set, such as:

```text
dangling_reference
illegal_transition
unresolved_disagreement
missing_acceptance
conflicting_review
```

This is critical for SaaW.

Enterprises do not need mythical AI that never makes mistakes.

They need systems where **when AI makes a mistake, the system can locate the problem and expose it to the correct authority.**

---

## 8. Recoverability: A digital employee must be able to wake up and continue

One of the largest differences between SaaW and a chatbot is timescale.

A chatbot session may last minutes. Real work may last hours, days, weeks or months.

Digital employees will therefore encounter network interruptions, SDK timeouts, Agent exits, runtime restarts, context loss, operating-system restarts and software upgrades.

If every failure requires telling the AI the entire story again, it cannot become a real employee.

SaaW therefore requires:

# Recoverability

One purpose of TMPA is to make current governance state computable again from durable facts.

CodeFlowMu / FCoP projects that idea into the file system.

After a node restarts, the system does not assume the original model remembers. It rereads TASK, ACCEPTANCE, REPORT, REVIEW, DECISION and ISSUE, then derives who owns the task, what is complete, which outcomes are confirmed, what remains unresolved, what actions are legal now, and who should act next.

Recovery is therefore not about restoring an Agent’s memory.

It is about:

> **Reconstructing the facts of work.**

These are fundamentally different ideas.

---

## 9. CodeFlowMu: TMPA enters the runtime world

If TMPA addresses governance architecture, CodeFlowMu addresses another question:

**How do these Agents actually work?**

CodeFlowMu does not begin by building a giant central Agent Runtime.

It deliberately stays restrained.

Reasoning is delegated to mature model ecosystems. Tools live in actual runtime environments.

CodeFlowMu concentrates on work orchestration, Agent Responsibility, lifecycle, FCoP, Skill invocation, Reports, Reviews, Human Decisions, Recovery and Runtime Governance.

This creates an important engineering boundary:

**CodeFlowMu does not need to reinvent the LLM.**

The model is only one part of a digital employee’s brain.

Whether it can become an employee is determined by the surrounding work structure.

---

## 10. FCoP: Filename as Protocol

A core CodeFlowMu engineering choice is FCoP.

FCoP projects part of Agent coordination and governance directly into the file system.

Work objects are not hidden inside a central server. They can be observed as files.

File names, directories, references and lifecycle transitions become part of the protocol.

A task may pass through a lifecycle such as:

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

Transitions occur through explicit operations.

The result is simple but important:

> **Directory becomes observable state.**

Administrators, human supervisors, Agents and debugging tools can inspect the same set of facts.

That reduces one of the most dangerous forms of multi-agent complexity: **hidden state.**

---

## 11. Agent PC: A real digital employee needs a “computer”

If SaaW is a Worker, that Worker needs a work environment.

We call this runtime node:

# Agent PC

It does not have to be a conventional physical computer.

It represents an independent execution environment owned by a digital employee, containing Reasoning, Skills, Workflow, Credentials, Runtime, Files, Governance and External Systems.

It may use Browser, API, CLI, Script, MCP, internal enterprise services and controlled Automation Hooks.

The Agent loop therefore changes from `Prompt → Response` into:

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

That is the runtime loop of a real digital employee.

---

## 12. Non-invasive digital employees: Let AI use software instead of bypassing it

One of the most dangerous temptations in enterprise automation is to let AI write directly into databases.

It looks efficient.

But real enterprise systems are not simple CRUD tables.

A field may sit behind state machines, triggers, stored procedures, permission rules, financial constraints, workflows, audit trails and external integrations.

Writing directly to tables can bypass decades of accumulated business boundaries.

A more defensible SaaW path is:

**AI operates business systems instead of bypassing business systems.**

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

The goal is not to guarantee that errors never occur.

The goal is to make errors occur inside boundaries where existing business rules can observe, reject, audit and roll them back.

That is the engineering discipline enterprise AI automation requires.

---

## 13. Rediscovering enterprise SOPs from code

Legacy software has another underestimated value:

**Code itself is enterprise knowledge.**

Many enterprises do not possess complete SOP documentation.

The real rules may be distributed across APIs, Controllers, Forms, Validation, State Transitions, Permission Checks, Batch Scripts, Database Schemas and Configuration.

One important CodeFlowMu direction is therefore to let a Meta-Development Team analyze existing systems and help extract:

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

But this does not mean “scan the code = automatically understand the enterprise.”

Real SOPs may also come from documents, human explanations, API specifications, operation recordings, job descriptions, policies and business-expert feedback.

Code is one important source of evidence.

More rigorously, the path should be understood as:

# Enterprise Evidence → Candidate SOP → Validation → Governed Workflow

AI makes scattered knowledge cheaper to restructure. But a Candidate SOP only becomes an executable worker Workflow after business validation, engineering tests, governance checks or human authorization.

---

## 14. CodeFlowMu’s second form: Meta-Development Runtime

The most interesting aspect of CodeFlowMu is not merely that multiple Agents can develop software together.

More importantly, **that development capacity itself can become a production capability for future digital employees.**

An initial CodeFlowMu can appear as a four-role development team:

```text
┌───────────────────────────────┐
│      CodeFlowMu Meta Team     │
│                               │
│ PM        DEV       QA    OPS │
└───────────────────────────────┘
```

Their responsibility boundaries are distinct.

**PM** understands requirements, decomposes work and organizes collaboration.  
**DEV** implements code, Skills, Hooks and Workflows.  
**QA** validates business and engineering results.  
**OPS** manages runtime environment, recovery, deployment and lifecycle.

This is:

# Meta-Dev Mode

Its output does not have to be only conventional software.

It can also be a:

# Digital Employee Package

---

## 15. Digital Employee Package

Before a digital employee can be deployed, it needs an engineering description.

A complete Worker Package may contain Role, Responsibilities, Workflow, Skills, Permissions, Policies, Validation Rules, Runtime Configuration, Recovery Rules and Human Decision Gates.

The digital employee therefore begins to look like a serious software product: it can be defined, developed, tested, versioned, deployed, upgraded and rolled back.

This is one of the deepest differences between SaaW and “writing an Agent prompt.”

---

## 16. Self-Morphing: When the codebase begins to “develop itself”

We now reach the most important part of this manifesto.

# Self-Morphing

The term is easy to misunderstand.

It does not mean that an Agent arbitrarily rewrites its own source code, and it does not mean unrestricted AI self-replication.

The useful meaning of Self-Morphing is:

> **A digital-employee runtime uses its own software-development capability to construct, validate and deploy new forms of digital workers.**

![Self-Morphing Digital Employee Loop](/assets/covers/saaw-self-morphing-loop.svg)

A complete process should look like:

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
        │ develop
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

Notice the change.

Traditional software development looks like:

```text
Human
  ↓
builds Software
  ↓
Human uses Software
```

Self-Morphing introduces:

```text
AI Development Team
        ↓
builds Digital Worker
        ↓
Digital Worker performs Work
```

Then an even more important step appears:

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

Software development and software work begin to form a loop:

# Develop → Validate → Deploy → Work → Observe → Improve

That is the meaningful interpretation of “the codebase begins to develop itself.”

---

## 17. From Development Runtime to Work Runtime

Traditional software has clear boundaries: development systems develop, production systems run, and users perform the work.

SaaW begins to recombine these layers.

The long-term CodeFlowMu direction can be expressed as:

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

SaaW goes further and connects **Development and Work.**

This may become one of the largest dividing lines between AI-native and traditional software.

---

## 18. Humans do not disappear; they leave the operation layer

Digital employees do not imply Human-Out-of-the-Loop.

Quite the opposite.

A safe SaaW must explicitly define what Agents may do autonomously and what requires a human decision.

In SaaS, the human is usually the Operator.

In SaaW, the human increasingly becomes the Supervisor / Authorizer.

Low-risk work such as retrieval, organization, validation, report generation and internal synchronization can be highly automated.

Large payments, final contract signatures, permission escalation, irreversible data operations and important public publication should enter Decision Gates.

The more accurate principle is not Human-in-every-loop, but:

# Human at the Authority Boundary.

---

## 19. PWA: The mobile control plane for a digital employee team

The CodeFlowMu PWA is therefore not merely a mobile webpage.

It represents the:

# Human Control Plane

A manager can inspect current Tasks, Agent state, Reports, Reviews, Issues, Waiting Decisions, Recovery State and work outcomes.

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

The key point is that Approve is not merely a UI click.

The click is only the interface.

What actually happens is:

```text
Human Decision
        ↓
Governance Fact
        ↓
State Transition
```

Authorization therefore enters the durable work history.

That is meaningful Human-in-the-Loop governance.

---

## 20. A digital employee must not depend on a model session that never disconnects

Many Agent products today hide a dangerous assumption: the model session will always remain alive.

Reality is different.

Models time out. Context overflows. Gateways fail. Agents crash. Software upgrades. Servers restart.

A real SaaW must therefore follow a critical principle:

# Agent is replaceable. Work facts are not.

Agents can change. Models can change. SDKs can change. Runtimes can restart.

Established work facts must not disappear.

This is where TMPA, FCoP and CodeFlowMu converge:

**Free intelligence from session continuity, and build work continuity on durable facts.**

That may be one of the most important architectural principles for long-running digital employees.

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

# Digital Labor Market

That is the larger economic possibility behind SaaW.

---

## 22. SaaW is not a new chat box

The entire argument can be reduced to one sentence:

**A digital employee is not a smarter chatbot.**

It requires job responsibilities, a work environment, tools, permissions, state, governance, evidence, recovery capability and human authority boundaries.

TMPA studies how those work facts become valid.

FCoP studies how coordination can be projected in an extremely lightweight way.

CodeFlowMu studies how Agents actually form teams and continue working.

Agent PC provides the work environment.

PWA provides the human control surface.

SaaW gives the whole transition a higher-level name:

# Software as an Agent Worker

---

## 23. From SaaS to SaaW

For the past forty years, software has largely answered one question:

> **How can we help humans work more efficiently?**

AI-native software may begin to answer another:

> **Which work can software itself perform?**

This does not mean software replaces everyone.

The deeper change may be that humans gradually leave repetitive software operation, Agents enter the operation layer, and humans move into the governance layer.

Thus:

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

That is the direction CodeFlowMu is exploring.

Not another Multi-Agent Framework.

But:

> **Software infrastructure capable of developing, running, governing and continuously evolving digital employees.**

That is why we propose SaaW.

# SaaW — Software as an Agent Worker

Software was once a tool.

Then it became a service.

Now it is beginning to work.

**From Software Market to Digital Labor Market.**

---

**joinwell52 Research Center**  
**CodeFlowMu Core Team**

**TMPA Architecture Paper A0.9**  
**TMPA Core Specification S0.6**  
**TMPA Implementation Case Report I0.8**  
**CodeFlowMu / FCoP**

> **V1.1 scope note:** This is a technical manifesto for AI Native Software, Multi-Agent Engineering and enterprise digital employees. SaaW, Self-Morphing and Digital Employee Runtime combine existing architecture and engineering practice with research directions that remain under active validation. Exact capability boundaries are governed by the corresponding public specifications, tests and implementation evidence.