---
title: "Why Multi-Agent Governance Can Start with Files"
date: '2026-08-18'
column: open-source-engineering
category: daily
article_type: technical-analysis
edition: research-center
research_question: "Why are files, paths, and events a useful starting point for local-first multi-agent governance, and what do they explicitly not guarantee?"
summary: "Files are not bargain-bin replacements for queues or workflow engines. Their first value is to establish a work ledger that humans and agents can inspect before infrastructure is upgraded in response to measured pressure."
item_id: "MANUAL-20260818-FILES"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-18-files-first-multi-agent-governance-cover.webp"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
sources:
  - research/manual-runs/2026-08-18-guided-article-pipeline-round1/02-source-register.md
  - research/manual-runs/2026-08-18-guided-article-pipeline-round1/02-fact-matrices.md
  - research/manual-runs/2026-08-18-guided-article-pipeline-round1/02-article-briefs.md
  - research/manual-runs/2026-08-18-guided-article-pipeline-round1/02-independent-editorial-review.md
---

<ArticleCover
  image="/assets/covers/daily-2026-08-18-files-first-multi-agent-governance-cover.webp"
  kicker="Open-source Engineering · Research Article"
  title="Why Multi-Agent Governance Can Start with Files"
  summary="Files are not a cheap substitute for a queue or workflow engine. Their first governance value is a shared working ledger that humans and agents can inspect directly, with infrastructure upgraded only when real pressure demands it."
  version="MANUAL-20260818-FILES"
  status="Independent Editorial PASS · 2026-08-18"
  languageHref="/zh/engineering/2026-08-18-files-first-multi-agent-governance"
  languageLabel="中文"
/>

# Why Multi-Agent Governance Can Start with Files

> Files are not a bargain-bin substitute for queues, databases, or workflow engines. Their first governance value is simpler: they can create a work ledger that both humans and agents can read, inspect, copy, and recover.

**Series map:** this article explains why files are a useful starting point. Continue with [the state-machine implementation](/en/engineering/2026-08-18-fcop-file-state-machine), then [the Cursor operating guide](/en/digital-employee/2026-08-18-cursor-ai-development-team). The three pieces cover governance value, protocol mechanics, and accepted delivery.

Imagine four agents working in four conversations. One changes code, one writes tests, one checks the runtime, and one reviews the result. Two hours later, every window says “done,” yet the person in charge still cannot answer basic questions. Which task version was authoritative? Who changed the scope? Which test report belongs to which implementation? Did the reason for rejection make it into the rework request?

The missing component is not a smarter model. It is shared operational truth.

For a local-first, single-machine agent system with low or moderate concurrency, that truth can begin as files. Tasks, reports, issues, and review decisions become explicit artifacts. Directory location represents current lifecycle state. Append-only events preserve how the state changed. FCoP summarizes the model as: **files carry the protocol, paths address state, and events record history.**

This is not an argument that files should replace every other system. It is an ordering principle: make the work visible and inspectable before adding a more elaborate control plane.

## What the Unix lesson actually says

The useful lesson in Ritchie and Thompson’s [The UNIX Time-Sharing System](https://pdos.csail.mit.edu/6.828/2014/readings/ritchie78unix.pdf) is more precise than the slogan “everything is a file.” Unix organized objects in a hierarchical namespace, made ordinary files, devices, and inter-process I/O accessible through largely compatible interfaces, and enabled small programs to compose through standard input, output, and pipes.

Three design ideas transfer well to agent governance.

First, a common interface reduces integration cost. A human can open a task in an editor, an agent can parse its front matter, a CLI can scan the directory, and a web view can index it. They do not need the same SDK to understand the work.

Second, names and locations can carry stable meaning. Directories such as `inbox/`, `active/`, `review/`, and `done/` form a state surface that programs and people can both inspect.

Third, complicated behavior can be split into small, composable tools. Creation, validation, transition, review, and archival can evolve independently if they honor the same artifact contract.

The original paper also prevents an overclaim. Unix still needed processes, pipes, permissions, and internal interlocks. Concurrent writes could corrupt file content. In this article, “everything is a file” therefore means **externalize coordination facts through open, readable artifacts where practical**. It does not mean that the filesystem automatically solves concurrency, durability, or distributed consistency.

## Files as a practical blackboard

H. Penny Nii’s classic article on [the blackboard model](https://ojs.aaai.org/aimagazine/index.php/aimagazine/article/view/537) describes systems in which multiple knowledge sources contribute intermediate results to a shared problem-solving structure. No individual knowledge source has to keep the entire truth in private memory; coordination happens through a common work surface.

A directory can implement such a surface, but a directory is not automatically a blackboard. It becomes useful for governance only when:

1. every artifact has a defined identity;
2. the current state has one authoritative location;
3. transitions leave ordered evidence;
4. roles have explicit permissions and responsibilities; and
5. completion depends on verifiable evidence, not an agent’s assertion.

That distinction separates a chat archive from a work ledger. Chat is organized by who spoke when. A work ledger is organized by the work object, its owner, its evidence, and its decisions.

![Multiple roles write to one file, path, and event fact surface that humans, agents, and tools can inspect](/assets/covers/daily-2026-08-18-files-first-shared-ledger.png)

*Figure 1. File-based governance first creates a shared fact surface. It coordinates tasks, state, and evidence; it does not replace execution or distributed consistency. Source: Research Center synthesis of Unix, FCoP, and TMPA materials.*

## Four facts a minimal ledger should preserve

FCoP uses four IPC envelopes to keep different claims separate:

| Artifact | Question it answers | Minimum useful content |
| --- | --- | --- |
| `TASK` | Who is expected to deliver what? | sender, recipient, priority, parent, scope, acceptance criteria |
| `REPORT` | What did the worker actually do? | task reference, changes, tests, evidence paths, remaining risks |
| `ISSUE` | What is blocking the work? | symptom, impact, attempted actions, required decision |
| `REVIEW` | Who made what judgment on which evidence? | subject, reviewer, verdict, rationale, next action |

## Five lifecycle buckets: use location to answer “where is the task now?”

The five directories under `_lifecycle/` form a minimal observable state machine: **a TASK may occupy only one bucket at a time; moving the file is the state transition.**

| Lifecycle bucket | Question it answers | Typical action |
| --- | --- | --- |
| `inbox/` | A new task exists. Who will claim it? | create, then wait for `claim` |
| `active/` | Who is executing or reworking it? | claim; rejected work returns here |
| `review/` | Delivery was submitted. Who will decide? | `submit`, then approve or reject |
| `done/` | Did the protocol lifecycle finish or receive approval? | `finish` or `approve`; this is not yet business acceptance |
| `archive/` | Has the work left the active collaboration surface? | archive after upstream acceptance |

```text
inbox --claim--> active --submit--> review --approve--> done --archive--> archive
                    |   ^                   |
                    |   +------reject-------+
                    +---------finish------->+
```

Four rules keep this model unambiguous:

1. **One current location:** the same TASK cannot exist in both `active` and `done`.
2. **Move, do not relabel:** state changes through controlled migration, not an Agent editing a mutable status field.
3. **Separate now from history:** the path answers “where is it now”; append-only `transitions:` records how it arrived there.
4. **Separate state from credentials:** REPORT, ISSUE and REVIEW are delivery, blocking and governance evidence, not current task state.

FCoP v2's `tasks / reports / issues / shared / log` were the old five buckets organized by **artifact type**. FCoP v3's `_lifecycle/` buckets organize TASK files by **work stage**. They are different concepts.

Likewise, `_lifecycle/review/` means a TASK awaits a decision, while `reviews/REVIEW-*.md` is an independent governance judgment.

The resulting ledger has three distinct layers:

- artifact content explains what the work is, what happened, and what evidence supports it;
- path identifies the TASK's current lifecycle stage;
- `transitions:` records how it arrived there.

> **For current lifecycle position, the path is the authoritative NOW fact. For business completion, the upstream role's acceptance of the REPORT and its evidence is decisive.**

This distinction keeps a worker's completion claim, protocol approval, and upstream acceptance from collapsing into one ambiguous `done` label.

## Inspectability changes the quality of rework

The FCoP repository contains a small [Tetris dogfood evidence set](https://github.com/joinwell52-AI/FCoP/tree/a859e6747fe6e5e2d686e0114c77774726d7f748/docs/tutorials/assets/tetris-en/evidence). In one trace, a task was underspecified. The implementer guessed instead of using the available issue path, and the defect appeared in the guessed area. The review rejected the result, and an administrator produced a sharper rework task.

One example cannot establish a defect-rate improvement or prove production-scale performance. It supports a narrower conclusion: when task, report, review, and rework artifacts remain separate, a failure does not collapse into a vague memory. A maintainer can locate where ambiguity entered, whether the worker escalated it, and whether the review became an actionable next task.

The ledger does not eliminate mistakes. It makes them attributable, discussable, and convertible into the next decision.

## When starting with files is sensible

A file-backed ledger is a strong starting point when:

- work happens on one machine or in a clearly bounded shared workspace;
- human readability matters more than millisecond latency;
- artifacts should fit Git, backups, and ordinary file tools;
- people need to inspect and approve agent work directly; and
- the protocol is still evolving faster than a control-plane implementation.

Pressure to add a stronger runtime or index appears when:

- many machines compete for the same tasks;
- the system requires strict transactions, granular authorization, or complex queries;
- retries, leases, timeouts, and throughput guarantees become central;
- network-filesystem semantics are not good enough; or
- directory scans and manual discovery become operational bottlenecks.

The useful separation is between an **artifact plane**, which preserves readable evidence, and an **execution plane**, which owns scheduling, isolation, retries, and scale. They can begin in one local directory and later evolve into distinct components.

## A minimum structure you can build today

For an article about FCoP v3, the useful minimum is the protocol's actual structure rather than a separate `events/` directory that could be mistaken for another authority:

```text
project/
  fcop/
    fcop.json
    _lifecycle/
      inbox/
      active/
      review/
      done/
      archive/
    reports/
    issues/
    shared/
    reviews/
    history/
      YYYY-MM-DD/
  workspace/
    <slug>/
```

This structure contains three different planes:

- `_lifecycle/` is the **current TASK state plane**;
- `reports/`, `issues/`, and `reviews/` form the **evidence and governance plane** and do not move with TASK state;
- `history/` is the **long-term history plane** for closed tasks and paired reports.

Each TASK keeps append-only migration history in `transitions:`. A separate `events/` directory would create another truth that could drift from the TASK file.

Then ask seven questions:

1. Does each unit of work have a unique identity and recipient?
2. Can a human find the authoritative version in under a minute?
3. Does “done” point to tests, a diff, or other environmental evidence?
4. Is the worker’s report separate from the reviewer’s judgment?
5. Does a rejection create a traceable next action?
6. Do transitions retain their time, actor, source, and destination?
7. If the runtime crashes now, can it reconstruct what happened from disk?

If most answers are “no,” adding more agents will usually increase ambiguity rather than throughput.

## What “everything is a file” contributes to engineering

The point is not to replace databases, queues, and workflow engines with Markdown. It is to establish an open protocol surface with five engineering properties:

| Engineering property | How the ledger provides it |
| --- | --- |
| **Addressable** | stable task identity, sender, recipient, and parent relationships |
| **Observable** | lifecycle buckets expose the current stage directly |
| **Replayable** | `transitions:` preserves time, source, destination, actor, and tool |
| **Verifiable** | TASK, REPORT, ISSUE, and REVIEW can be checked against each other |
| **Composable and evolvable** | editors, Git, CLIs, and web views share the same artifacts, while stronger infrastructure can be added later |

> **Stable identity + path state + transition history + delivery evidence = a governable shared work ledger.**

The ledger does not solve contention, transactions, authorization, retries, or scheduling by itself. It first answers more basic questions: was the work formally delegated, who owns it now, why was it rejected, and what evidence justified acceptance?

Starting with files is neither nostalgia nor a rejection of infrastructure. Its engineering value is to let humans, Agents, and tools share the same inspectable facts, then upgrade the execution plane in response to real pressure.

FCoP is not an industry standard or a final answer. It offers a testable starting point: **before expanding the control plane, make the collaboration visible, machine-readable, and evidence-checkable.**

Once files provide the work ledger, the next question is how to implement transitions without exposing partial artifacts and how to test every invariant. Continue with [Files, Paths, and Events: Implementing and Testing the FCoP State Machine](/en/engineering/2026-08-18-fcop-file-state-machine).

## Sources

- [Ritchie & Thompson, The UNIX Time-Sharing System](https://pdos.csail.mit.edu/6.828/2014/readings/ritchie78unix.pdf)
- [H. Penny Nii, The Blackboard Model of Problem Solving and the Evolution of Blackboard Architectures](https://ojs.aaai.org/aimagazine/index.php/aimagazine/article/view/537)
- [FCoP v3 specification](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/spec/fcop-v3-spec.md)
- [ADR-0038: FCoP Boundary Charter](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/adr/ADR-0038-fcop-boundary-charter.md)
