---
title: "SaaW: Software as an Agent Worker — From SaaS to SaaW"
date: "2026-08-10"
column: "industry-architecture"
category: "manifesto"
version: "V1.1"
summary: "A 23-section manifesto deriving SaaW from governance, TMPA, FCoP, Agent PC, CodeFlowMu, and Self-Morphing, anchored in Research Report Production Engine V1.3 and explicitly separating validated capabilities from research frontiers."
item_id: "MANIFESTO-20260810-SAAW"
lifecycle: "Published"
cover: "/assets/covers/01-saaw-manifesto-cover-agent-worker.png"
visualization: "/assets/covers/02-saaw-governance-runtime-stack-fixed-v2.png"
visualization_2: "/assets/covers/03-saaw-self-morphing-loop-fixed-v2.png"
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

[![SaaW — Software as an Agent Worker](/assets/covers/01-saaw-manifesto-cover-agent-worker.png)](/assets/covers/01-saaw-manifesto-cover-agent-worker.png)

---

## 1. The last mile that SaaS never solved

For the past two decades, SaaS changed how software is delivered.

Enterprises no longer buy software on discs, maintain large fleets of local servers, or pay the same deployment cost for every version upgrade. The browser became the entry point, cloud became infrastructure, and subscription became the business model.

But one thing barely changed:

**Humans still operate software.**

Employees log into ERP systems to query data and copy it into spreadsheets; open CRM systems to complete customer records; submit expenses in finance systems; approve requests in OA systems; and then move the result into yet another system.

The more software an enterprise owns, the more software its employees have to operate.

SaaS solved **how software is delivered**, but it did not truly solve **who performs the work**.

Copilot moved the boundary forward.

AI entered software interfaces to help humans draft emails, summarize documents, generate code, search knowledge, and support decisions.

But the basic relationship remained unchanged:

**AI gives advice; humans perform the work.**

Humans still sit in front of screens, clicking buttons, switching systems, entering results, and handling exceptions.

The next generation of software worth discussing should not merely be a smarter tool. It should be:

**software capable of performing work.**

We call this paradigm:

> **SaaW — Software as an Agent Worker**

Software is no longer only a service.

Software begins to become the actor that performs work.

---

## 2. From buying tools to deploying digital employees

The core change in SaaW is not simply embedding an Agent inside SaaS.

It changes the basic unit of software delivery.

SaaS delivers **functionality**.

Copilot delivers **assistance**.

SaaW delivers **work**.

A real SaaW should not be merely a chatbot with a system prompt.

It needs a structure closer to a real job:

- a clearly defined role;
- clear job responsibilities;
- executable workflows;
- callable skills;
- bounded permissions;
- persistent work state;
- verifiable work evidence;
- a recoverable runtime environment;
- explicit human authority boundaries.

We therefore define SaaW as follows:

> **SaaW (Software as an Agent Worker) is a software paradigm in which software is delivered as a digital work actor. Under explicit job responsibilities, permission boundaries, and governance rules, it can continuously execute workflows, use business tools, produce work outcomes, and remain subject to human supervision, review, and authorization.**

Enterprise software can therefore be seen as moving through a clear evolution:

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

The real change is not that AI simply became smarter.

**The labor attribute of software changed.**

---

## 3. The real enterprise problem: Trace is not Governance

An Agent that can call tools is not automatically ready for production.

Modern multi-agent systems can generate detailed Execution Traces: who called which tool, which function ran, what result was produced, and which reasoning steps occurred.

Those traces matter.

But:

> **Trace ≠ Governance**

Trace answers: **What happened?**

Enterprise governance must also answer: Who authorized the work? Who accepted responsibility? Which object represents the official work fact? Who submitted the Report? Who performed the Review? Who made the Decision? Is the current state valid under the governing policy? Are references dangling? Are disagreements unresolved? After failure, who is allowed to continue?

This is not merely a logging problem.

It is a Governance State problem.

If these questions have no answers, an Agent cannot realistically assume job responsibility.

> **No governance, no employee.**

That is why TMPA exists.

---

## 4. TMPA: Work facts must exist independently of the Agent

TMPA asks a simple question: when Agents and humans jointly perform long-running work, where should trustworthy work state live?

This is TMPA's formal answer:

> **TMPA (Textual Multi-Agent Process Architecture)** is an **asynchronous text-message multi-agent process architecture** designed for SMEs and minimum-infrastructure conditions. Its core consists of four connected rules: **text carries durable messages and state; each writer maintains its own local serial stream; multiple serial streams advance asynchronously to form parallel collaboration; the read side aggregates available evidence to reconstruct process, responsibility, lifecycle, conflicts, and audit state.**

**This section and Sections 5–7 expand these four rules in order: this section covers durable messages and state in text; Section 5 covers local Single-Writer serial streams; Section 6 covers asynchronous parallel collaboration across streams; Section 7 covers read-side reconstruction and the Issue Set.**

TMPA is **SME-first, not SME-only**. Its minimum-infrastructure orientation reduces dependence on dedicated coordination infrastructure, but larger implementations may use databases, object stores, event services, identity systems, and control planes while preserving the same work-fact, responsibility, reference, lifecycle, and governance semantics.

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

This means one actor does not silently rewrite facts authored by another actor.

New state is created by appending new objects.

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

Every action has its own author and reference relationships.

Responsibility in the system is therefore not guessed from the final database state; it is formed by the work facts themselves.

This differs in an important way from many traditional workflow engines.

Traditional systems often keep mutating one central state:

```text
status = pending
status = running
status = review
status = done
```

In the end, all you see is `status = done`, while the actual process that produced that state has been overwritten.

TMPA is more concerned with: Who accepted the work? Who submitted it? Who reviewed it? Who approved it? What disputes occurred? Which facts were later corrected?

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

This is closer to how real organizations actually work.

---

## 7. Issue Set: Do not hide disagreement

Automation systems often prefer a cosmetically green final state.

Real organizations are not like that.

References may be missing. State transitions may be illegal. QA may reject DEV. Reports may lack evidence. Decisions may lack valid preconditions. Roles may disagree.

TMPA does not try to make those problems disappear.

It makes them formal facts.

The key is not merely to list errors, but to perform **read-side reconstruction**. The Reader aggregates the currently available evidence to reconstruct process, responsibility, lifecycle, conflicts, and audit state; the **Issue Set** is the formal representation of conflicts, gaps, and illegal states within that reconstruction.

The Reader therefore reconstructs not only a Process Graph but also an Issue Set, such as:

```text
dangling_reference
illegal_transition
unresolved_disagreement
missing_acceptance
conflicting_review
```

This is an important SaaW capability.

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
Once the candidate satisfies publication conditions, it enters the formal release path: committing to GitHub, generating the website, verifying the commit, and confirming the release. If an action requires accountable human authority, the work stops at that authority boundary and waits for a human decision.

**Output: Formally Published Research Result.**

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

## 9. FCoP: File-based Coordination Protocol

**FCoP (File-based Coordination Protocol) is a multi-agent behavioral-governance protocol that uses the filesystem as its only synchronization primitive.**

Its core invariant is **Filename as Protocol**. In its project-visible filesystem profile:

- **directory is state**: `_lifecycle/{inbox,active,review,done,archive}/`;
- **filename is routing**: sender, recipient, type, and sequence identify origin, destination, and work-object identity;
- **content is payload**: Markdown plus YAML frontmatter carries tasks, reports, issues, references, and governance facts;
- **`os.rename()` is the only synchronization operation**: lifecycle transitions rely on atomic filesystem moves rather than a coordination database, message broker, or central lock service.

A task lifecycle is therefore directly observable:

```text
inbox      waiting to be claimed
  │
  ▼
active     in execution
  │
  ▼
review     awaiting review
  │
  ▼
done       completed
  │
  ▼
archive    archived
```

FCoP governs **Agent collaboration behavior**: how tasks are handed off, results are reported, issues are raised, capability boundaries are declared, and those behaviors leave event semantics, failure boundaries, and auditable evidence.

**FCoP does not govern the execution runtime.** Scheduling, process management, model sessions, resource allocation, identity authentication, and runtime-node management are outside the protocol itself.

In the TMPA implementation relationship, FCoP acts as a **project-visible filesystem profile**. It does not require a coordination database, message broker, or enterprise control plane; conversely, it does not by itself provide validated enterprise identity, strong role isolation, tamper-resistant storage, or Byzantine fault tolerance. This is consistent with TMPA being **SME-first, not SME-only**: larger deployments can add databases, object stores, event services, identity systems, and control planes without changing the governance semantics carried by the protocol.

Most importantly, **the FCoP protocol, host adapters, reference implementation, and runtime environment are not the same thing.** The A0.9 operational stack can be represented directly as:

```text
Application / Runtime
CodeFlowMu / Cursor / Claude Desktop
                │
                ▼
Host Adapter Layer
fcop-mcp / fcop-cli / host bridges
                │
                ▼
★ FCoP Protocol Layer ★
behavior governance / handoff / reporting / review
capability boundaries / event semantics / failure boundaries / audit
                │
                ▼
Reference Implementation
fcop Python library
                │
                ▼
Execution Substrate
LLM APIs / MCP tools / filesystem / process manager / operating system
```

Therefore:

- the `fcop` Python package is the **reference implementation of FCoP**, not the FCoP protocol itself;
- `fcop-mcp` and `fcop-cli` sit in the **Host Adapter Layer**, exposing protocol capabilities to actual hosts;
- CodeFlowMu sits above FCoP in the **Application / Runtime layer** and uses FCoP as its coordination protocol;
- TMPA is not a runtime layer in this stack; it supplies the higher-level governance semantics and architectural guidance the stack is intended to realize.

This also explains why “directory is state” matters: administrators, human supervisors, Agents, and debugging tools can inspect the same project-visible facts without first entering a hidden central coordination state.

---

## 10. CodeFlowMu: From protocol to the real runtime world

If TMPA defines work-fact and governance semantics, and FCoP supplies a project-visible file-based coordination protocol, then **CodeFlowMu addresses how those semantics and that protocol enter a real Agent runtime world.**

CodeFlowMu did not begin by constructing a giant central Agent Runtime.

Instead, it remains deliberately restrained: reasoning is delegated to mature model ecosystems, tools remain in real operating environments, and CodeFlowMu concentrates on work orchestration, Agent responsibility boundaries, lifecycle, FCoP integration, Skill invocation, Reports, Reviews, human decisions, recovery, and runtime governance.

This creates an important engineering boundary:

**CodeFlowMu does not need to reinvent the LLM, and it does not redefine FCoP.**

The model is only one part of a digital employee's brain; FCoP is the coordination protocol it uses; what determines whether the digital employee can sustain responsibility is the surrounding work structure, runtime environment, and governance loop.

[![SaaW governance and runtime architecture: SaaW, CodeFlowMu, FCoP, and TMPA](/assets/covers/02-saaw-governance-runtime-stack-fixed-v2.png)](/assets/covers/02-saaw-governance-runtime-stack-fixed-v2.png)

*Figure 1. TMPA supplies work-fact and governance architecture; FCoP supplies the file-based coordination protocol; CodeFlowMu provides the engineering runtime; SaaW names the resulting software-delivery paradigm.*

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
Operate Business System
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

That may look extremely efficient.

But real enterprise systems are not simple CRUD layers.

A single field may sit behind state machines, triggers, stored procedures, permission rules, financial constraints, workflows, audit trails, and external-system integrations.

Writing directly to tables can bypass decades of accumulated business boundaries.

SaaW should therefore prefer a different path:

**AI operates the business system rather than bypassing the business system.**

```text
Agent
  │
  ├── API
  ├── Browser
  ├── CLI
  ├── Controlled Hook
  └── Approved Automation
        │
        ▼
Existing ERP / CRM / Business System
```

The point is not to guarantee that AI will never make mistakes. It is to keep mistakes, as far as possible, inside boundaries where existing business rules can observe, reject, audit, and roll them back.

That is the engineering posture enterprise AI automation actually requires.

---

## 13. Rediscovering enterprise SOP from code

Legacy software contains an often underestimated asset:

**Code itself is enterprise knowledge.**

Many enterprise processes do not have complete SOP documentation.

The real rules are often hidden in APIs, controllers, forms, validation logic, state transitions, permission checks, batch scripts, database schemas, and configuration.

An important direction for CodeFlowMu is therefore to let a Meta-Development Team analyze existing systems and help reconstruct:

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

But this does not mean that “scanning code = automatically understanding the entire enterprise.”

Real SOP may also come from documents, human explanations, API specifications, operation recordings, job descriptions, policy rules, and domain-expert feedback.

Code is only one extremely important source of facts among them.

A more rigorous formulation is:

> **Enterprise Evidence → Candidate SOP → Validation → Governed Workflow**

AI makes it possible to restructure these scattered forms of knowledge at much lower cost; but a Candidate SOP should become an executable digital-employee workflow only after business validation, engineering testing, governance checks, or human authorization.

---

## 14. CodeFlowMu's second form: Meta-Development Runtime

The most important thing about CodeFlowMu is not merely that multiple Agents can develop software together.

More importantly, that development capability can itself become production capability for the next generation of digital employees.

We call this form the **Meta-Development Runtime**.

An initial CodeFlowMu instance can appear as a four-role development team:

```text
┌───────────────────────────────┐
│      CodeFlowMu Meta Team     │
│                               │
│ PM        DEV       QA    OPS │
└───────────────────────────────┘
```

Each role has its own responsibility boundary.

PM interprets requirements, decomposes work, and organizes collaboration.

DEV implements code, Skills, Hooks, and workflows.

QA verifies business outcomes and engineering outcomes.

OPS manages the runtime environment, recovery, deployment, and lifecycle.

This is CodeFlowMu's **Meta-Development Mode**.

Its output does not have to be only traditional software. It can also be:

**a Digital Employee Package.**

---

## 15. Digital Employee Package: Turning Digital Employees into Engineered Products

Before a digital employee can truly be deployed, it needs an engineering description.

A complete Digital Employee Package typically includes at least:

- role;
- job responsibilities;
- workflow;
- Skills;
- permissions;
- governance policies;
- validation rules;
- runtime configuration;
- recovery rules;
- human decision gates.

For the first time, a digital employee begins to look like a real software product: it can be defined, developed, tested, versioned, deployed, upgraded, and rolled back.

That is one of the fundamental differences between SaaW and “writing an Agent prompt.”

---

### A Real Engineering Anchor: The SaaW Manifesto Is Part of the Case

There is an important recursive relationship here.

We are not first writing a manifesto that claims SaaW exists and then searching for a fictional example to prove it. **We use the operating Research Report Production Engine V1.3 to explain SaaW, while this SaaW Manifesto itself becomes a research artifact managed, reviewed, and published through that production system.**

The research-production chain can be written as:

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

Expressed in SaaW worker terms, the same chain becomes:

```text
Role → Workflow → Skills → Work State → Evidence
     → Governance → Human Authority → Work Outcome
```

These are not two different systems. They are two descriptions of the same fact: software begins to take on continuous work under explicit responsibilities, evidence rules, and authority boundaries.

> **This is not an AI writing tool. It is a governed research worker.**

---

## 16. Self-Morphing: When the codebase begins to “develop itself”

Now we reach the central idea of this manifesto:

> **Self-Morphing**

It does not mean that an Agent freely mutates its source code, and it does not mean unrestricted AI self-replication.

> **Self-Morphing means that a digital-employee runtime can use its own software-development capability to construct, validate, and deploy new digital-worker forms.**

[![Self-Morphing: from meta-development runtime to the digital-worker work loop](/assets/covers/03-saaw-self-morphing-loop-fixed-v2.png)](/assets/covers/03-saaw-self-morphing-loop-fixed-v2.png)

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

CodeFlowMu's long-term direction can be expressed as follows:

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

The appearance of digital employees does not mean removing humans from the work loop.

On the contrary.

A safe SaaW must clearly define which actions an Agent can complete autonomously within its authority, and which actions must be decided by a human.

**In SaaS, humans usually remain in the software operation layer; in SaaW, humans increasingly move into supervision and final authorization.**

Low-risk work such as querying, organizing, validation, report generation, and internal synchronization can become highly automated.

Large payments, final contract signatures, permission escalation, irreversible data operations, and important public publication should enter explicit human decision gates.

More precisely:

> **Human at the Authority Boundary.**

---

## 19. PWA: The mobile control plane for a digital-employee team

The CodeFlowMu PWA is therefore not merely a mobile webpage.

It represents the digital-employee team's **Human Control Plane**.

A manager can use a mobile device to inspect current tasks, Agent state, Reports, Reviews, Issues, pending decisions, recovery state, and work outcomes.

```text
SaaW Runtime
      │
      ▼
Report
      │
      ▼
FCoP / TMPA Work Facts
      │
      ▼
Reader
      │
      ▼
Mobile PWA
      │
      ▼
Human Approves / Rejects
      │
      ▼
Formal Decision
      │
      ▼
SaaW Runtime continues
```

The most important point is that approval is not merely a UI click.

The click is only the interface.

What actually happens is:

```text
Human Decision
        ↓
Governance Fact
        ↓
State Transition
```

Authorization therefore becomes part of the formal work history.

That is **Human-in-the-Loop Governance** in the real sense.

---

## 20. A digital employee must not depend on a model session that never disconnects

Many Agent products today hide a dangerous assumption: that the model session will always remain alive.

The real world does not work that way.

Models time out. Context windows overflow. Gateways fail. Agents crash. Software upgrades. Servers restart.

A real SaaW must therefore follow one critical principle:

> **Agents are replaceable. Work facts are not.**

Agents can change. Models can change. SDKs can change. Runtimes can restart.

But already established work facts must not disappear with them.

This is where TMPA, FCoP, and CodeFlowMu ultimately converge:

**Decouple intelligence from session continuity, and build work continuity on durable facts.**

This may be one of the most important architectural principles for building long-running digital employees.

---

## 21. SaaW changes software economics, not merely AI

Ultimately, SaaW is not merely another Agent Framework.

It may imply a change in the economic model of software.

The SaaS business logic is: enterprises buy software capability and then continue staffing people to perform the work.

The SaaW business logic may become: enterprises deploy digital work capacity, and work outcomes become part of software delivery for the first time.

Therefore:

**SaaS sells capability.**  
**SaaW delivers work.**

Enterprises may eventually buy not only CRM, but a digital customer-operations team; not only finance software, but digital finance workers; not only a contract-management platform, but a digital contract-review and fulfillment team.

The software market may gradually expand from a **software market** into a:

> **Digital Labor Market**

That is the much larger space of possibility opened by SaaW.

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

AI-native software is beginning to face another:

> **Which work can software itself perform?**

This does not mean software will replace everyone.

The deeper change may be that humans gradually leave repetitive software operation, Agents enter the operation layer, and humans move into the governance layer.

So:

```text
SaaS
Human operates Software
        ↓
Copilot
Human operates with AI
        ↓
SaaW
AI performs Work
Human governs and authorizes AI
```

And when a system capable of developing digital workers begins to use that capability to develop the next generation of digital workers:

```text
AI develops Digital Worker
        ↓
Digital Worker performs Work
        ↓
Work produces Evidence
        ↓
Evidence drives the next Development cycle
        ↓
AI develops the next Digital Worker
```

A software lifecycle that did not previously exist begins to form.

### Validated (Today)

To avoid packaging research directions as already completed product capability, the engineering facts that exist today should be stated separately:

- FCoP's file-driven lifecycle, task handoff, Reports, and Issues;
- real PM / DEV / QA / OPS four-role Agent collaboration loops;
- `Report`, `Review`, `Decision`, and human approval paths;
- the PWA human control plane and pending-decision handling;
- recovery governance after runtime interruption;
- TMPA Reader, specification tests, and reconstruction of work facts;
- real CodeFlowMu engineering cases;
- the Research Report Production Engine V1.3 production chain from research task to governed publication.

### Under Exploration (Next)

Still under research, standardization, or broader engineering validation are:

- standardized Digital Employee Packages;
- standardized Agent PC;
- role-specific Work Runtimes;
- Candidate SOP extraction from legacy systems and enterprise evidence;
- Meta-Development Runtime → Domain Worker Runtime transformation;
- governed Self-Morphing.

This distinction is not conservatism; it is part of credibility: **validated capability should be stated with evidence, while frontier capability should remain a research proposition.** Self-Morphing is more credible precisely because it is built on governance, recovery, work facts, and engineering runtime capabilities that already exist.

That is the direction CodeFlowMu is exploring.

Not another Multi-Agent Framework.

Instead:

> **Software infrastructure capable of developing, running, governing, recovering, and continuously evolving digital employees.**

That is the real reason we propose SaaW.

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
