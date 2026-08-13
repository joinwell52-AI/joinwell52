---
title: "Trace Is Not Governance: From Work Facts to SaaW"
date: "2026-08-14"
column: "industry-architecture"
category: "visual-essay"
version: "V1.0"
summary: "Starting from the difference between execution traces and governance, this visual essay explains how TMPA, FCoP, CodeFlowMu, the Meta-Development Runtime, Digital Employee Packages, and governed Self-Morphing form an engineering path toward SaaW."
item_id: "VISUAL-ESSAY-20260814-TRACE-GOVERNANCE-SAAW-EN"
lifecycle: "Published"
cover: "/assets/covers/01-saaw-manifesto-cover-agent-worker.png"
visualization: "/assets/covers/16-saaw-tmpa-four-rules-v2.svg"
visualization_2: "/assets/covers/17-saaw-fcop-lifecycle-v2.svg"
visualization_3: "/assets/covers/18-saaw-codeflowmu-runtime-boundary-v2.svg"
visualization_4: "/assets/covers/19-saaw-governed-self-morphing-v2.svg"
evidence_status: "Derived from the published SaaW V1.1 manifesto and TMPA V1.0 publication line"
citation_status: "TMPA V1.0 DOI and public engineering repositories linked"
editing_status: "Published"
publication_authorized: true
outline: deep
---

# Trace Is Not Governance: From Work Facts to SaaW

## An engineering lineage through TMPA, FCoP, CodeFlowMu, and Self-Morphing

[Read the complete 23-section manifesto, *From SaaS to SaaW*](/en/industry/2026-08-10-saaw-software-as-an-agent-worker)

[中文版](/zh/industry/2026-08-14-trace-governance-saaw-visual-essay)

[![SaaW — Software as an Agent Worker](/assets/covers/01-saaw-manifesto-cover-agent-worker.png)](/assets/covers/01-saaw-manifesto-cover-agent-worker.png)

An Agent called tools, modified files, and finally returned `completed`.

What does that prove?

It proves only that **an execution occurred**.

It does not automatically prove that the task was legally completed, the tests were confirmed, the delivery was reviewed, conflicts were resolved, or any role had the authority to move the task into its next state.

This is the architectural boundary that long-running Agent systems most often overlook:

> **Trace is not Governance.**

[![Trace is not Governance: the difference between execution events and governed work state](/assets/covers/15-saaw-trace-vs-governance-v2.svg)](/assets/covers/15-saaw-trace-vs-governance-v2.svg)

*Figure 1. A trace records events. Governance reconstructs legal work state from durable facts, rules, responsibility, and authority.*

## 1. Why an execution trace is not enough

A trace can answer which tool a model called, when an operation occurred, and what the tool returned.

Real work requires another set of answers:

- Who authorized the task?
- Who formally accepted responsibility?
- Which artifact represents the official delivery?
- Can the test result be independently verified?
- Who performed the review?
- Is the current lifecycle state legal?
- Do unresolved conflicts, missing evidence, or dangling references remain?
- Who continues after a process restart?

Adding more log lines does not solve these questions. Logs remain system events. Governance concerns work facts, responsibility, and the legal effect of decisions.

The first step toward a digital employee is therefore not giving an Agent more tools. It is making work facts independent of the Agent session.

## 2. TMPA: Making work facts reconstructable

**TMPA (Textual Multi-Agent Process Architecture)** is a text-message-based asynchronous multi-agent process architecture designed for SME-first, minimum-infrastructure environments.

It is not an Agent scheduler or a central runtime. TMPA addresses how tasks, responsibility, evidence, conflicts, and audit state become valid when Agents and humans collaborate asynchronously over time.

Its core consists of four connected rules:

> **Text carries durable messages and state; each writer maintains its own local serial stream; multiple serial streams advance asynchronously to form parallel collaboration; readers aggregate available evidence to reconstruct process, responsibility, lifecycle, conflicts, and audit state.**

[![The four TMPA rules and reader-side fact reconstruction](/assets/covers/16-saaw-tmpa-four-rules-v2.svg)](/assets/covers/16-saaw-tmpa-four-rules-v2.svg)

*Figure 2. Each actor appends its own facts. Cross-stream references form a partial order. The Reader aggregates evidence without overwriting conflict.*

The important point is not simply “using text instead of a database.” Two deeper principles matter.

First, responsibility needs a clear source. PM, DEV, QA, and human decision-makers preserve their own local fact streams instead of rewriting another actor's history.

Second, state is not merely the last value of a field. A Reader recalculates current state from objects such as `Task`, `Acceptance`, `Report`, `Review`, `Decision`, `Issue`, and `Correction`.

Models may change and processes may restart, but established work facts do not disappear with the session.

## 3. FCoP: Bringing governance semantics into project collaboration

Theory and specifications need an executable form of coordination.

**FCoP (File-based Coordination Protocol) is a multi-agent behavioral-governance protocol that uses the filesystem as its sole synchronization primitive.**

Its project-visible Profile can be summarized as follows:

- **Directory is state:** `inbox → active → review → done → archive`.
- **Filename is routing:** sender, recipient, object type, and sequence express identity.
- **Content is payload:** Markdown and frontmatter carry tasks, reports, references, and evidence.
- **Atomic movement is synchronization:** lifecycle transitions use `os.rename()`.

[![The FCoP project-visible lifecycle and shared fact plane](/assets/covers/17-saaw-fcop-lifecycle-v2.svg)](/assets/covers/17-saaw-fcop-lifecycle-v2.svg)

*Figure 3. Lifecycle change moves a project-visible work object instead of overwriting a central status field. Humans, Agents, Readers, and operations tools inspect the same fact plane.*

FCoP is not merely a way to “send messages with files.” It makes handoffs, reports, reviews, decisions, issues, and recovery paths observable, referenceable, and auditable.

Its boundary is equally important: FCoP governs collaborative behavior. It does not provide model reasoning, process scheduling, identity authentication, or resource allocation, and it is not a complete Agent Runtime.

## 4. CodeFlowMu: Bringing roles, tools, and governance into real execution

If TMPA defines work facts and governance semantics, and FCoP provides a project-visible file-driven coordination protocol, then **CodeFlowMu addresses how those semantics and protocols enter a real Agent runtime world.**

Its engineering starting point is not a giant central Agent.

Reasoning remains in mature model ecosystems. Browsers, APIs, CLIs, MCP, and business systems perform actual operations. CodeFlowMu concentrates on role orchestration, responsibility boundaries, Skill routing, lifecycle, FCoP integration, reports, reviews, recovery, and human decisions.

[![The CodeFlowMu engineering runtime boundary](/assets/covers/18-saaw-codeflowmu-runtime-boundary-v2.svg)](/assets/covers/18-saaw-codeflowmu-runtime-boundary-v2.svg)

*Figure 4. Models reason and tools act. CodeFlowMu organizes work, FCoP carries facts, and TMPA guides governance semantics.*

The three are therefore not three similar products:

| Layer | Responsibility | Non-responsibility |
|---|---|---|
| TMPA | Defines which work facts can become valid and reconstructable | Does not schedule or execute work |
| FCoP | Brings those facts into project-visible collaboration | Is not a complete Agent Runtime |
| CodeFlowMu | Runs roles, tools, protocols, lifecycle, recovery, and governance | Does not use runtime events as a substitute for business decisions |

Only with these boundaries can a system avoid treating “the Agent returned completed” as “the organization accepted the delivery.”

## 5. The Meta-Development Runtime: Development capability becomes production capability

The most important thing about CodeFlowMu is not only that multiple Agents can develop software together.

> **More importantly, that development capability can itself become production capability for the next generation of digital employees.**

We call this form the **Meta-Development Runtime**.

Roles such as PM, DEV, QA, and OPS can build more than conventional software. They can combine job responsibilities, workflows, Skills, permissions, governance policies, validation rules, runtime configuration, recovery rules, and human decision gates into a:

> **Digital Employee Package: turning a digital employee into an engineered product.**

A position capability can then be defined, developed, tested, versioned, deployed, upgraded, and rolled back like software.

## 6. Self-Morphing: “Developing itself” under governance

**Self-Morphing** does not mean allowing a running Agent to rewrite itself arbitrarily, nor does it mean an unlimited recursion of Agents creating Agents.

It describes a strictly isolated and recoverable improvement loop. Production work emits evidence. Evidence exposes a capability gap. The Meta-Development Runtime designs an improvement and produces a new Digital Employee Package. Only after isolated validation and explicit authorization may that version enter the next work cycle.

[![The governed Meta-Development and Self-Morphing loop](/assets/covers/19-saaw-governed-self-morphing-v2.svg)](/assets/covers/19-saaw-governed-self-morphing-v2.svg)

*Figure 5. Evidence can enter meta-development, but meta-development cannot rewrite the live production runtime. Validation and authority control deployment, and a rollback path always remains available.*

The complete loop is:

> **Work → Evidence → Gap → Improvement → Isolated Validation → Human or Governance Authorization → Deployment → New Work Cycle**

If the source of a change is not traceable, tests are not reproducible, deployment is not authorized, the running version is not identifiable, or failure cannot be rolled back, then “self-evolution” is only unauditable automatic rewriting.

## 7. Humans do not disappear; they leave the operation layer

SaaW does not remove humans from the system.

Low-risk, reversible, in-policy work such as retrieval, organization, validation, reporting, and synchronization can increasingly be performed by digital employees. External publication, irreversible modification, money, credentials, privacy, and policy exceptions must stop at a human authority boundary.

Humans no longer need to perform every click and data transfer. Their responsibilities move toward:

- defining objectives and authority boundaries;
- handling conflict and exceptions;
- reviewing consequential evidence;
- approving, rejecting, or requesting rework;
- taking final responsibility for high-impact outcomes.

In SaaS, humans usually remain in the software operation layer. In SaaW, humans increasingly move into governance and final authority.

## 8. SaaW: When software begins to carry work

**SaaW (Software as an Agent Worker)** is the higher-level name for this transition. Software stops being only a collection of capabilities operated by people and begins to carry work continuously under explicit job responsibilities, authority boundaries, and governance rules.

It is not a new chat window, and it is not created by simply adding an Agent. A real digital work subject needs a role, an environment, Skills, permissions, state, governance, evidence, recovery, and human authority boundaries.

Validated capability must remain separate from the research frontier.

The public engineering foundation available today includes the TMPA V1.0 architecture paper, core specification, and implementation case; the FCoP protocol and implementation; and the open CodeFlowMu engineering runtime environment. The implementation case pins CodeFlowMu v1.8.0 and records a **14/14** validation result against TMPA S1.0.

Standardized Digital Employee Packages, a standardized Agent PC, domain Work Runtimes, and broader Self-Morphing validation remain research and future engineering work.

## Conclusion

The decisive change from Agent systems to digital employees is not that a model becomes more human-like. It is that work gains facts, responsibility, evidence, recovery, and authority structures that exist independently of the model session.

> **TMPA makes work facts valid. FCoP makes coordination facts visible. CodeFlowMu brings them into real execution. The Meta-Development Runtime then turns runtime evidence into Digital Employee Packages and improves them through governed Self-Morphing, ultimately pointing toward SaaW.**

Software was once a tool.  
Then it became a service.  
Now, it is beginning to work.

> **From Software Market to Digital Labor Market.**

---

- **Complete manifesto:** [From SaaS to SaaW: When a Codebase Starts “Developing Itself”](/en/industry/2026-08-10-saaw-software-as-an-agent-worker)
- **TMPA V1.0 DOI:** [10.5281/zenodo.21888488](https://doi.org/10.5281/zenodo.21888488)
- **FCoP:** [GitHub Repository](https://github.com/joinwell52-AI/FCoP)
- **CodeFlowMu:** [Open Engineering Runtime](https://github.com/joinwell52-AI/CodeFlowMu-open)
- **Version status:** V1.0 · Published
