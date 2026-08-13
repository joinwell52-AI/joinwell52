---
title: "From SaaS to SaaW: When a Codebase Starts Developing Itself"
date: "2026-08-10"
column: "industry-architecture"
category: "manifesto"
version: "V1.2"
summary: "A condensed visual manifesto that derives the SaaW research direction from TMPA theory and specifications, the FCoP coordination protocol, and CodeFlowMu engineering runtime."
item_id: "MANIFESTO-20260810-SAAW"
lifecycle: "Published"
cover: "/assets/covers/01-saaw-manifesto-cover-agent-worker.png"
visualization: "/assets/covers/04-saaw-three-system-relationship.svg"
visualization_2: "/assets/covers/05-saaw-research-workday-cinematic.png"
visualization_3: "/assets/covers/06-saaw-governed-evolution-cinematic.png"
visualization_4: "/assets/covers/07-saaw-human-authority-cinematic.png"
evidence_status: "Architecture-grounded + production-engine reference implementation"
citation_status: "TMPA V1.0 DOI and publication record linked"
editing_status: "Published V1.2 — condensed cinematic visual edition"
publication_authorized: true
outline: deep
---

# From SaaS to SaaW: When a Codebase Starts Developing Itself

*An AI-native software manifesto grounded in TMPA, FCoP, and CodeFlowMu engineering practice*

[中文版](/zh/industry/2026-08-10-saaw-software-as-an-agent-worker)

[![SaaW — Software as an Agent Worker](/assets/covers/01-saaw-manifesto-cover-agent-worker.png)](/assets/covers/01-saaw-manifesto-cover-agent-worker.png)

## 1. When software begins to carry work

SaaS changed how software is delivered, but it did not remove the last mile in which a person enters a system, understands its interface, performs the operation, and checks the result. Copilots assist people. Agents execute selected steps. **SaaW — Software as an Agent Worker —** points to a further research direction: software continuously carries work under an explicit position, authority, process, and acceptance contract.

This is not a chat window renamed “Digital Employee.” A working system must know what it received, who currently owns it, which authority was used, what evidence was produced, how failure is recovered, and who may declare completion. SaaW is therefore not a model feature. It is a software form composed of runtime, governance, coordination, evidence, and human authority.

> **Scope boundary:** SaaW and Digital Employee are target paradigms and research directions in this article. They are not presented as a completed fourth product layer.

## 2. How the three existing systems connect

[![The relationship among TMPA, FCoP, and CodeFlowMu](/assets/covers/04-saaw-three-system-relationship.svg)](/assets/covers/04-saaw-three-system-relationship.svg)

*Figure 1. The existing TMPA → FCoP → CodeFlowMu lineage. The three systems are distinct and cannot substitute for one another. Source: joinwell52 Research Center architecture synthesis.*

The three systems form a precise engineering lineage:

| System | Position | Responsibility | Non-responsibility |
|---|---|---|---|
| [TMPA](/en/publications/tmpa-architecture-paper-a1.0) | Theory and specification | Defines governance objects, single-writer fact streams, Reader semantics, conflicts, and evidence boundaries | Does not schedule or execute work |
| [FCoP](https://joinwell52-ai.github.io/FCoP/) | File-based coordination protocol | Carries reconstructable tasks, reports, reviews, decisions, and lifecycle facts | Is not a complete Agent Runtime |
| [CodeFlowMu](https://github.com/joinwell52-AI/CodeFlowMu-open) | Engineering runtime and open reference environment | Executes, recovers, coordinates roles, and continuously emits work evidence | Engineering results do not automatically prove the theory |

TMPA supplies constraints. FCoP turns those constraints into visible and reconstructable coordination facts. CodeFlowMu implements the facts in a running engineering environment. This is “theory and specification → coordination protocol → engineering implementation,” not a marketing bundle of three names.

## 3. Enterprise entry: Trace is not Governance

Logs, traces, and screenshots can show what happened, but they do not automatically answer whether an action was authorized, whether acceptance was satisfied, how conflicts were handled, or who could declare completion. Work facts must therefore survive independently of an Agent session: Agents may be replaced; facts must not disappear. Sessions may end; accountability must remain.

TMPA reconstructs a process through textual objects and Readers. FCoP preserves tasks and receipts in project-visible files. CodeFlowMu brings those objects into execution, failure handling, and recovery. Their value is not “more logging.” It is the ability to trace, dispute, and revise work from admission through execution, review, and decision.

## 4. A real engineering anchor: one research-production day

[![A research-production day](/assets/covers/05-saaw-research-workday-cinematic.png)](/assets/covers/05-saaw-research-workday-cinematic.png)

*Figure 2. One durable work identity crosses discovery, queueing, reading, analysis, production, and publication. The image represents the current research-production workflow; it does not claim that a general SaaW product is complete. Source: joinwell52 Research Center.*

The Research Report Production Engine provides a verifiable engineering anchor. A day is not one giant prompt. It is a set of bounded phases with outputs and handoffs:

| Time | Phase | Inspectable output |
|---|---|---|
| 09:00 | Discovery | Signal pool and source record |
| 10:00 | Queue | Selection, priority, and plan |
| 11:00 | Reading | Reading result, citations, and counter-evidence |
| 13:00 | Analysis | Research object and engineering judgment |
| 15:00 | Production | Chinese and English candidates with visuals |
| 20:00 | Publication | Reviewed release, index, and commit evidence |

The schedule is less important than the durable facts each phase leaves for the next phase to read and challenge. The current capability demonstrates governed research production. It contributes engineering evidence to SaaW research, but it is not itself a general Digital Employee product.

## 5. From process experience to governed capability packages

Traditional automation often mixes scripts, prompts, credentials, and personal experience. A stronger direction packages a position as inspectable engineering material: responsibilities and inputs, tools and authority, workflow, acceptance criteria, escalation, recovery, versions, and evidence requirements. Code inspection may propose a candidate structure; it cannot automatically understand an enterprise. Candidates require human confirmation, execution evidence, and version governance.

“Software developing software” therefore does not mean unrestricted code generation. It means converting validated work experience into new capabilities that can be tested, reviewed, rolled back, and audited. A capability must pass isolated validation before entering runtime and must continue producing evidence after deployment.

## 6. Self-Morphing as governed evolution

[![Governed self-evolution](/assets/covers/06-saaw-governed-evolution-cinematic.png)](/assets/covers/06-saaw-governed-evolution-cinematic.png)

*Figure 3. Development, validation, deployment, work evidence, and the next improvement cycle form a loop, while governance isolates the live runtime from meta-development. Source: joinwell52 Research Center concept design.*

**Self-Morphing** here does not mean that a running Agent arbitrarily rewrites itself, nor an unbounded recursion of Agents creating Agents. It is a controlled loop: work evidence exposes a gap; a meta-development process proposes a change; the change is tested in isolation; an explicit decision admits it; previous versions and rollback paths remain available.

At least five conditions are required: the change source is traceable, tests are reproducible, deployment is authorized, the running version is identifiable, and failure is recoverable. Without any one of these, “self-evolution” becomes unauditable automatic rewriting.

## 7. The human stays at the authority boundary

[![The human authority boundary](/assets/covers/07-saaw-human-authority-cinematic.png)](/assets/covers/07-saaw-human-authority-cinematic.png)

*Figure 4. Reversible policy-bounded automation remains on the left; consequential actions stop at a review gate where a person authorizes the effect. Source: joinwell52 Research Center concept design.*

People need not click every operational step, but they must retain consequential authority. External publication, irreversible change, money, credentials, private data, and policy exceptions should stop before the side effect occurs. The system should present decision facts rather than a wall of internal reasoning: what will happen, why, what it affects, where the evidence is, and what approval or rejection will do.

This is the proper role of a PWA or management surface. It should not pull people back into repetitive operation. It should provide a clear authority and exception interface. Low-risk, reversible, in-policy work may run automatically; high-impact actions remain human decisions.

## 8. Validated capability and research frontier

What exists today and can be inspected separately are three public systems and their evidence: TMPA V1.0 with the A1.0 architecture paper, S1.0 core specification, and I1.0 implementation case; the FCoP file-based coordination protocol and implementation; and the CodeFlowMu open engineering runtime environment. CodeFlowMu v1.8.0 records 14/14 PASS against the public TMPA S1.0 conformance evidence. This demonstrates conformity of a specific implementation to a specific specification and test set; it does not demonstrate completion of every SaaW capability.

The next research work is concentrated in three areas: package position capabilities as governed objects; fully separate meta-development from production runtime; and evaluate systems through real work outcomes, recovery, and human-authority quality rather than model answers alone. SaaW will not be established by a manifesto. It will be established by durable, reconstructable, and independently acceptable work facts.

The next phase of software may no longer be “one account per person,” but “a governed set of software work units per organization.” Until then, the order remains: **fix the facts before running the collaboration; validate the capability before expanding autonomy.**

---

- **Author:** Zhu Wei · joinwell52-AI
- **Project:** Digital Employee Works / joinwell52 Research Center
- **Version:** V1.2 · Condensed cinematic visual edition · 2026-08-14
- **TMPA V1.0 DOI:** [10.5281/zenodo.21888488](https://doi.org/10.5281/zenodo.21888488)
- **Release record:** [TMPA V1.0 formal release record](/en/publications/tmpa-v1.0-release-record)
