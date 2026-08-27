---
title: "You Cancelled the Agent. Did Its Child Processes Actually Stop? Stop-Evidence Boundaries Through the Lens of Anywhere Agents"
date: '2026-08-27'
column: digital-employee
category: daily
article_type: engineering-analysis
edition: research-center
research_question: "Can a cancellation request, successful termination command, disappearing known PIDs, execution-tree containment, and redispatch eligibility be represented by one stopped state?"
summary: "Starting from Anywhere Agents' handling of stranded results and orphan processes, and adding a publicly rerunnable two-level Windows probe, this study separates the act of cancellation from evidence that an agent execution tree has actually stopped."
sources: "/en/research/evidence/2026-08-27-runtime-semantics-evidence-pack"
project_relevance: first-party-research
item_id: "RSEM-20260827-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-27-agent-stop-evidence-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-27-agent-stop-evidence-cover.png"
  kicker="Digital Employee · Engineering Research"
  title="You Cancelled the Agent. Did Its Child Processes Actually Stop? Stop-Evidence Boundaries Through the Lens of Anywhere Agents"
  summary="Cancellation is a control action; stopping is a set of postconditions that require evidence. A zero exit code, a missing PID, containment, and redispatch eligibility cannot stand in for one another."
  version="RSEM-20260827-01"
  status="Engineering Research · 2026-08-27"
  languageHref="/zh/digital-employee/2026-08-27-agent-stop-evidence"
  languageLabel="中文"
/>

# You Cancelled the Agent. Did Its Child Processes Actually Stop? Stop-Evidence Boundaries Through the Lens of Anywhere Agents

**Cancellation is an action. Stopping is a set of postconditions.**

Agent systems often compress the two into one reassuring badge. A user clicks Cancel, the runtime invokes a termination command, the command returns success, and the interface says Stopped. But an old child may still be writing the workspace. A grandchild may already have escaped the original process group. A result file may be temporarily unreadable rather than gone.

The important question is therefore not whether the Cancel button fired. It is: **how far did the evidence actually reach?**

## 1. Anywhere Agents starts with a strict observation rule: not observable is not the same as absent

In Anywhere Agents commit `570c89f`, Yue Zhao added tooling for `prun-task-*` units left behind after interrupted fan-out work. The author reports a motivating corpus in which **27 units had recorded result paths whose result files were gone, while 24.3 MiB of tail output remained**. Those figures are source-reported engineering observations; we did not independently reproduce the corpus.

The more interesting part is the data model. `report-state` does not collapse a unit into a verdict such as recoverable or failed. It keeps two orthogonal fields:

- `result_path_state`: whether the recorded result path could be resolved;
- `result`: whether the target is `present / empty / missing / unknown`.

Only an actual `FileNotFoundError` is allowed to produce `missing`. Permission denial, I/O failure, a non-regular file, an oversized entry, or an unreadable root remains an observation error rather than being rewritten as absence.

The commit states the principle directly:

> **failed observation never becomes an outcome**

That discipline transfers cleanly to process stopping. If a root PID is no longer observable, that establishes something about the root PID. It does not automatically establish that every descendant is gone.

## 2. Issue #29 is stronger: four increasingly strict reaping claims were each defeated by a narrower counterexample

Anywhere Agents' open Issue #29 is valuable because it records a sequence of failed proof attempts rather than only a final design preference.

| Round | What `REAPED` was trying to establish | Counterexample |
| --- | --- | --- |
| 1 | a signal was sent | every `kill` failed and the unit still reported `REAPED` |
| 2 | the recorded root was gone | a descendant ignored `TERM` and survived |
| 3 | the process group was empty | a descendant left the group with `setsid` |
| 4 | repeated retained-identity snapshots converged | a transient intermediate created a grandchild between snapshots, exited, and the grandchild was never enumerated |

The fourth case is the key one. It needs no PID reuse, no query failure, no scan bound exhaustion, and no interrupted reaper. Timing alone is enough for a reaper to announce convergence while a grandchild remains alive.

That shifts the proof obligation to **dispatch time**. If the worker was not placed inside a kernel-backed closed set when it started, a later reaper can only infer membership from PID, parent links, and process groups—relations that can escape.

The issue therefore proposes Windows Job Objects and guaranteed POSIX session containment. It even reserves `REAPED` for kernel-backed containment and keeps that stronger result unreachable until the prerequisite exists.

This is an Anywhere Agents design discussion, not evidence that CodeFlowMu has the same defect. The transferable principle is narrower:

> **The broader the stop claim, the less it can rely on “I cannot see the process anymore.”**

## 3. One Stopped badge can hide at least six different facts

A cancellation scene is easier to reason about if the claims are separated explicitly:

| Evidence layer | What it establishes | What it does not establish |
| --- | --- | --- |
| cancellation requested | the runtime issued a stop intent | the OS terminated any process |
| termination command succeeded | the termination tool returned success | every descendant exited |
| root exit observed | the known wrapper/root PID is no longer observable | children, grandchildren, handles, and ports are gone |
| known child exit observed | one known direct child exited | no escaped descendant remains |
| containment proven | the execution belongs to a closed set the kernel can constrain as a unit | the workspace has no asynchronous tail writes |
| redispatch eligible | scheduling/governance allows another attempt | the previous OS execution tree has been fully proven absent |

These layers may refer to one another. They should not sign for one another.

Two especially dangerous jumps are:

**`taskkill exit 0 → entire tree gone`**

and:

**`retry allowed → old execution definitely gone`**

The first promotes a tool result into an operating-system containment claim. The second promotes governance authority into a process fact.

## 4. What our Windows probe actually establishes

CodeFlowMu is the local multi-agent runtime we are developing. Its first-party Windows managed-command path invokes:

```text
taskkill /PID <pid> /T /F
```

for cancellation.

We deliberately did not translate that command into a tree-containment guarantee. Instead, we ran a narrow probe: create a fresh temporary directory, start a wrapper, let the wrapper start one long-lived direct child, confirm both PIDs are observable, run the same `taskkill /T /F` operation against the wrapper, and then observe the two PIDs separately.

The recorded controlled-host result was:

- termination exit code = `0`;
- wrapper exit observed = `true`;
- direct-child exit observed = `true`;
- `kernel_containment_proven = false`.

So the PASS supports only this statement:

> **On this Windows host, for this wrapper-plus-direct-child sample, `/T` did not kill only the wrapper; both known PIDs were observed to exit.**

It does not support:

> arbitrary-depth Windows agent process trees have been proven contained and reaped.

The public evidence pack now includes a Windows-specific probe implementing that disclosed two-level contract, the deidentified recorded result, and a record-check. Readers can rerun the same experiment on their own Windows machine. On non-Windows platforms the probe refuses to run rather than manufacturing a PASS.

That is a stronger evidence posture than publishing only “1/1 PASS,” while still preserving the same narrow conclusion. Another PASS on another Windows host would still not cover escaped descendants, transient intermediates, privilege boundaries, deeper trees, containers, or remote workers.

## 5. `cancelled` is best treated as a control-plane outcome, not a containment certificate

There is also a semantic issue on our side worth keeping visible.

The current first-party managed-command path can transition a command record to `cancelled` after the termination tool succeeds. That state is useful to the control plane: it means **the cancellation operation completed under the current mechanism**. But if a UI or scheduler reads `cancelled` as “every descendant has been proven absent,” the interpretation has outrun the evidence.

A stronger stop record would separate the evidence axes, for example:

```text
cancel_request          sent
termination_command     exit_0
root_exit               observed
known_child_exit        observed
containment             unverified
workspace_quiescence    unverified
redispatch_eligibility  decided_by_existing_rule
```

Unknown is not failure. It is also not permission to paint the entire execution green.

## 6. Silence must not be rewritten as death either

Stop semantics fail in the opposite direction too. A runtime should not infer death simply because no new output appeared.

We reran an existing managed-command fixture in which a job experiences a simulated two hours of silence, 101 observations, and restart recovery after index loss. The targeted test remained **1/1 PASS**.

That fixture does not prove containment. It protects another boundary:

> **silence ≠ death**

Together with:

> **cancel requested ≠ tree gone**

it expresses the same discipline: record what the runtime actually observed rather than filling missing evidence with a convenient terminal state.

## 7. The dangerous gap is between cancellation and redispatch

Why does this distinction matter operationally? Because the expensive failure is often not the first failed run. It is the second run starting too early.

The wrapper is gone, but an escaped descendant still writes files. A PM or scheduler approves a retry. A new agent receives the same workspace. Local lease rules may prevent two formal attempts on the same controlled dispatch path from holding the active lease simultaneously, but a lease cannot kill an OS process that has escaped the runtime's observation surface.

Redispatch therefore needs two different questions:

- **governance / scheduling eligibility**: may a new attempt be created?
- **execution-environment safety evidence**: how far has the previous execution scene actually been proven quiescent or contained?

A valid scheduling decision cannot sign an operating-system postcondition.

## 8. The next counterexamples are more valuable than a brighter Stopped badge

The useful next work is adversarial evidence, not a stronger color:

- wrapper exits while a direct child survives;
- child escapes its original process group or parent relation;
- a transient intermediate creates a grandchild between observations;
- an old result file continues growing after root exit;
- cancellation completion races with redispatch;
- processes exit while ports, file locks, or helper resources remain.

Each experiment should leave the same structure:

**action taken → objects observed → postconditions proven → postconditions still unknown → actions now permitted.**

That is a better long-running-runtime contract than compressing the scene into `cancelled=true`.

## Conclusion: stopping is not a button result; it is a scoped proof

Anywhere Agents' `report-state` work reminds us that **a failed observation must not become an outcome**. Issue #29 goes further: **if the execution tree was never made a kernel-bounded closed set at spawn time, later enumeration has severe limits as proof that the tree is gone.**

Our two-level Windows probe contributes a smaller fact: `taskkill /T /F` was observed to remove both the wrapper and one direct child in one controlled sample. That fact is useful precisely because it stops there.

> **Cancellation is an action. Stopping is a set of postconditions. Execution-tree containment is a stronger proof still.**

A reliable agent runtime does not need to pretend it knows everything. Before redispatch, it should tell the next executor exactly **what was observed to stop, what merely disappeared from view, and what remains unproven.**

---

## Public evidence

- [**Runtime Semantics: Public Evidence Pack for Three Articles**](/en/research/evidence/2026-08-27-runtime-semantics-evidence-pack)
- [**R1 public Windows `taskkill /T /F` probe**](/assets/evidence/2026-08-27-r1-windows-taskkill-tree-probe.cjs)
- [**R1 deidentified recorded result**](/assets/evidence/2026-08-27-r1-windows-taskkill-recorded-result.json)
- [**R1 recorded-result check**](/assets/evidence/2026-08-27-r1-windows-taskkill-recorded-result-check.mjs)

## Sources and evidence boundary

### Anywhere Agents

- [**commit `570c89f`**](https://github.com/yzhao062/anywhere-agents/commit/570c89f4c4bfa03bc5cea0a43a7fcf9fef0261ab): used for the separation between result-path observation and result outcome, and for the author-reported corpus of 27 stranded units and 24.3 MiB of tail. Those figures are source-reported and were not independently reproduced here.
- [**Issue #29**](https://github.com/yzhao062/anywhere-agents/issues/29): used for the four progressively stronger orphan-reaping claims defeated by live counterexamples, and for the design argument that tree-wide proof belongs in dispatch-time kernel-backed containment. The issue remains open and is not presented as a completed shipped solution.

Anywhere Agents is used as a public research and engineering reference. It does not establish a shared root cause, implementation lineage, or equivalent containment design in CodeFlowMu.

### First-party evidence

R1 covers one wrapper-plus-direct-child sample on one Windows host. The public probe makes the same two-level contract rerunnable, but it does not upgrade the historical PASS into Job Object or kernel-containment proof. This article does not claim equivalent guarantees for arbitrary Windows process trees, independent runtimes, network filesystems, containers, or remote workers.
