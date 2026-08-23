---
title: "How Does a Task Move Through an Agent Team? Claims, Execution, Review, and Completion in a File State Machine"
date: '2026-08-22'
column: open-source-engineering
category: daily
article_type: mechanism-analysis
edition: research-center
research_question: "How can one task preserve identity and move legally through a file state machine and an engineering runtime into acceptance?"
summary: "Body fields, lifecycle paths, reports, and acceptance decisions answer different questions. This article follows one task through FCoP and the CodeFlowMu V1.9.7 candidate implementation to expose the invariants that prevent cross-task binding, duplicate execution, and premature completion."
item_id: "MANUAL-20260822-AGENT-TASK-FILE-STATE"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-22-agent-task-file-state-machine-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
sources:
  - research/manual-runs/2026-08-22-codeflowmu-rail-state-series-round1/02-source-register.md
  - research/manual-runs/2026-08-22-codeflowmu-rail-state-series-round1/02-fact-claim-matrices.md
---

<ArticleCover
  image="/assets/covers/daily-2026-08-22-agent-task-file-state-machine-cover.png"
  kicker="Open-source Engineering · Project Research"
  title="How Does a Task Move Through an Agent Team? Claims, Execution, Review, and Completion in a File State Machine"
  summary="Lifecycle paths, transition history, reports, and acceptance decisions carry different facts. Collapsing them into one done field creates cross-wiring and premature completion."
  version="MANUAL-20260822-AGENT-TASK-FILE-STATE"
  status="Editorial &amp; Visual PASS · 2026-08-23"
  languageHref="/zh/engineering/2026-08-22-agent-task-file-state-machine"
  languageLabel="中文"
/>

# How Does a Task Move Through an Agent Team? Claims, Execution, Review, and Completion in a File State Machine

A task body says `status: done`, but the task file still sits in the active directory. A development report exists, yet the required compatibility evidence does not. The UI sees the report and releases a downstream deployment task. Which signal is authoritative?

The reliable answer is not to pick the field that looks most complete. These signals answer different questions: **the path identifies the current lifecycle state; events record how the task moved; a report says what the executor returned; an acceptance decision says whether an authorized actor accepted it.**

This article follows one task through its full lifecycle and shows how a file state machine and an engineering rail cooperate. The deliverable is a set of invariants that can become tests, not merely a guide to directory naming.

## Do not compress four facts into one `done`

| Fact | Question answered | Typical carrier in this system |
|---|---|---|
| Lifecycle state | Where is the task now? | FCoP `_lifecycle/` path |
| Transition history | Who changed the stage, when, and through which tool? | Append-only `transitions` entries in the TASK |
| Execution return | What did the agent submit, with what evidence? | `REPORT-*` |
| Acceptance | Did an authorized actor accept, reject, or request rework? | Lifecycle approval, independent REVIEW, or Runtime acceptance axis |

The facts may reference one another, but they are not substitutes. A report is not an approval. A body field is not the current path. A TASK in `_lifecycle/review/` does not prove that an independent `REVIEW-*` governance envelope exists.

The current [FCoP v3 specification](https://github.com/joinwell52-AI/FCoP/blob/main/spec/fcop-v3-spec.md) explicitly distinguishes these two meanings of review. The directory is a lifecycle stage for the TASK. A file under `reviews/` is a separate judgment about an artifact. Both may exist, but the protocol does not create an automatic one-to-one relationship.

![Current file path, append-only transition history, reports, and acceptance decisions preserve different facts](/assets/covers/daily-2026-08-22-agent-task-file-state-machine-figure-1.svg)

*Figure 1. Current paths, transition events, REPORT artifacts, and acceptance decisions have different jobs. Physical time can assist an investigation but cannot alone establish causal order. Source: author synthesis from the FCoP v3 specification and CodeFlowMu V1.9.7 candidate evidence.*

## A task in five stages

Use a request to add CSV export and run compatibility tests as the running example.

### 1. Creation: establish identity before admission

The PM creates a new task from an approved requirement. An FCoP TASK filename carries type, date, sequence, sender, and recipient, and the file enters `_lifecycle/inbox/`.

Creation means that the work object now exists. It does not mean an agent has claimed it or execution has begun. A team runtime also needs root-task, parent-task, and thread identity so that later children and reports return to the same responsibility tree.

### 2. Claim: move the path and witness the transition

When an authorized lifecycle tool claims the task, the TASK moves from `inbox` to `active`. The protocol requires a transition event with `from`, `to`, `by`, and `tool`.

FCoP's write-then-rename pattern does not edit the body, move the old file, and append a log as three loosely coupled actions. It prepares the destination content—including the new event—in a temporary file, persists it, and performs a rename within one filesystem boundary. The rename is the observable commit point.

POSIX.1-2024 specifies atomic directory-entry behavior for [`rename()`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html): observers should see the old or new entry rather than an intermediate directory name. That guarantee has limits. It is not a cross-mount transaction, it does not by itself prove crash durability for all directory metadata, and it does not make a relaxed network filesystem strongly consistent.

There is one more boundary. If an implementation publishes a new destination file and only then removes the source, `rename` makes destination publication atomic; it does not turn destination publication and source removal into one cross-directory transaction. The two statements are not in tension: local-filesystem `rename()` makes **one directory-entry replacement** atomic, while a dual-stage conflict can arise only when the upper protocol composes “publish destination” and “remove source” as two interruptible operations. In a crash window, one TASK may remain in both `inbox/` and `active/`. “Paths address NOW; events record PAST” is not this article's rhetorical summary: [FCoP v3 §§0.1, 1.4, and 2.3](https://github.com/joinwell52-AI/FCoP/blob/main/spec/fcop-3.0-spec.md) explicitly separates current state, determined by path, from append-only `transitions` history and forbids deriving current state by replaying events. A reader must therefore **not** pick the directory with the apparently newer event. The correct behavior is to report and preserve the dual-stage conflict and stop projecting it as one current state; cleanup or recovery must use a later authorized lifecycle action.

The precise claim is therefore: **rename can provide an atomic destination-publication point inside the declared filesystem boundary; it does not make an entire multi-agent system inherently concurrency-safe.**

### An easy-to-miss gap: complete publication is not exclusive claim

This is not wordplay, but it is not the normal topology of the current local-first deployment. The tested CodeFlowMu V1.9.7 shape is **one Runtime service for one local project root**. Its controlled-restart record shows the current process holding the writer lock and retaining a consistent root binding. The inspected material does not declare two independent CodeFlowMu Runtimes sharing one project folder as supported, and it provides no dual-Runtime claim stress test. The following contention is therefore a boundary analysis for a future shared-workspace extension, not an assertion of an existing failure in the current single-Runtime local mode.

The boundary still matters because, in the public FCoP path, `claim_task` first reads whether a TASK is still in `inbox/`, then the [atomic-commit implementation](https://github.com/joinwell52-AI/FCoP/blob/main/src/fcop/lifecycle/atomic.py) publishes a temporary file into `active/` with `os.replace()`. If a future design allows agents A and B as independent claimants, and both pass the “still in inbox” check before the source is removed, both can construct a claim event from the same old content. A can publish first; B can publish later. POSIX-style replacement permits the later destination name to replace the earlier one, while both callers may treat their own call as successful and start work.

This does not turn a valid serial dependency graph into a genuine parallel branch. It creates a more dangerous **false parallelism**: one work item that should have one executor starts two agent sessions. The disk may retain only the later `active/` file, but that cannot retract the earlier tool call or code modification already started by the first agent.

The current write-and-replace path therefore solves “do not read a half-file”; it **does not prove exclusive claim for a future multi-Runtime shared workspace**. The public specification and inspected material do not provide evidence of a same-TASK double-claim stress test, a non-replaceable claim reservation, a lease, or heartbeat reclamation. This article must not describe them as existing features. If a future design explicitly permits competing claimants, the claim entry point needs a separate mutual-exclusion primitive: for example, a non-replaceable exclusive reservation (`O_CREAT | O_EXCL` where supported), or Runtime-side serialization/compare-and-swap against the canonical task identity. The primitive must be validated separately for Windows, local filesystems, and network filesystems; the local semantics of `link()`, a file lock, or `rename` cannot be generalized into a cross-platform guarantee.

A minimally credible claim test launches two claims against the same TASK at once. Exactly one caller may receive an executable claim credential. The loser must receive a deterministic “already claimed/contention lost” result and must not start a model session or tool call.

### 3. Execution: the rail dispatches and checks preconditions

Once the TASK is active, the file state machine says it has been claimed. Code generation, tool mounting, testing, and output capture belong to the engineering runtime.

The CodeFlowMu V1.9.7 candidate parent implementation routes task mutations through a shared command kernel. A request binds task, root, thread, round, expected revision, and an idempotency key. The following is a structured reading excerpt from private parent commit `2c901972df79dc8d0a1e2eee66ed8dce5e4f953f`, not CodeFlowMu Open and not publicly cloneable in full. It keeps only the binding fields explained below; omitted fields are neither evidence of absence nor a basis for any capability claim.

```ts
type TaskCommandRequest = {
  task_id: string;
  root_task_id: string;
  thread_key: string;
  expected_revision: string;
  round_id: string;
  idempotency_key: string;
};
```

Three protections follow.

First, task, root, and canonical thread identity must agree. V1.9.7 normalizes ledger query suffixes so that a lineage bucket is not mistaken for a second task identity:

```ts
export function canonicalThreadKey(value: unknown): string {
  return String(value ?? "").trim()
    .replace(/#TASK-\d{8}-\d{3,}.*$/i, "");
}
```

Second, `expected_revision` rejects a write based on stale facts. If a PM prepared an action against revision A and the task has moved to revision B, the old action cannot be applied unchanged.

Do not turn an interface field into an unverified algorithm. The inspected private-parent evidence proves only that a command binds and checks `expected_revision`; it does not disclose whether the value is produced from a content digest, monotonic version, event sequence, or another canonicalization scheme. This article therefore treats it as a precondition token for the current task version, not as an mtime-based mechanism; filesystem modification time cannot carry causal versioning. For any implementation that intends to use such a token to reject stale actions, the minimum engineering requirement is to bind it to version facts that can change that action's validity and to reject a mismatch; it should not attempt to infer cross-process or cross-device causality from wall-clock time. This is a design requirement in this article, not a claim about V1.9.7's undisclosed algorithm.

That also means there is **not yet an assessable versioning closure**. If the token covers the whole TASK content, does appending a `transitions` event create needless expiry for a concurrent command? If it covers only business content, can an evidence-reference or authorization change evade the stale-action check? The current material does not answer those questions. To test the design, alter body, transition, evidence reference, and authorization scope separately on a fixed task, then replay an old token and observe which changes invalidate the command. Until those results exist, the field cannot be claimed to solve optimistic concurrency control or false aborts.

Third, the idempotency key distinguishes a transport retry from a new business intent. Replaying the same intent under the same key returns the existing result; reusing the key for a different intent creates a conflict. This reduces duplicate task, attempt, and dispatch creation. It does not prove exactly-once execution for every external tool effect.

### 4. Dependencies: “not your turn” is not a failed task

Suppose QA depends on a DEV delivery. The PM creates two distinct child tasks and places an explicit DEV dependency on the QA TASK. CodeFlowMu's dispatcher can retain the dependent work until the upstream task produces the required completion return.

The correct meaning is “QA is not eligible yet,” not “QA failed.” Waking QA early and forcing it to write a blocked report would manufacture a business failure from a scheduling error.

The dependency must also reference the current child task. A thread can contain several rounds of DEV rework. The nearest completed DEV task from an older round must not satisfy the new QA contract.

There is another question that cannot be skipped: a dependency cycle. If A waits for B and B waits for A, a queue has not created an answer. The inspected V1.9.7 material proves explicit-dependency waiting and release; it does not prove a complete directed acyclic graph (DAG) check. It would be inaccurate to describe automatic exceptional suspension on cycle detection as a current feature.

A static admission check is not enough either. If an agent can add or modify a downstream dependency while work is running, every dependency change must be rechecked for cycles or explicitly prohibited. A timeout may report that a policy window was exceeded; it cannot guess which edge to delete or declare business failure. The current material does not prove dynamic dependency mutation, deadlock timeout, or a cycle-breaking protocol. Future dispatcher tests must make a dependency graph containing a cycle an explicit admission-rejection case: whether the cycle is submitted up front, introduced during execution, or accompanied by prolonged lack of upstream progress, it should produce an inspectable issue for an authorized actor—not indefinite waiting or a heuristic choice of branch.

### 5. Return and acceptance: executors submit, authorities decide

The development agent submits a REPORT bound to the current task and execution round, including inspectable code and test evidence. The TASK may then move to `review`, where an authorized role accepts or rejects it.

Two separations must remain intact:

- `status: done` in an agent-authored report is the executor's claim about its work;
- acceptance is the decision of the PM or ADMIN against the current revision and evidence.

The [TMPA Core Specification S1.0](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-en.md) requires role, provenance, and lifecycle to be deterministically reconstructable. CodeFlowMu V1.9.7 likewise models report and acceptance as distinct fact axes. A report can be present while acceptance remains pending.

This prevents a common premature-completion path: the Runtime observes `REPORT-*` and turns the root task green. A correct implementation first verifies report attribution, evidence, and current revision, then hands the decision to the authorized actor.

## Long-running commands need their own execution lifecycle

The task lifecycle is not a good place to record every instant of a compiler process. V1.9.7 therefore treats managed commands as an optional Runtime service. Long jobs that must survive session changes, expose continuous logs, recover after Runtime restart, or support precise cancellation can be managed durably. Short tests and builds may still use the host's native command tools. A short command that does not enter the managed service produces no `job.json` for that service; its raw output should still be recorded or referenced as REPORT evidence, but the inspected contract does not establish whether that carrier is an attachment, a link, or another form.

Each managed job is bound to task, session, attempt, and lease information (time-bounded execution ownership). Its per-job `job.json` is authoritative; the aggregate index is rebuildable. After a restart, the Runtime can rediscover a running or terminal job instead of inferring business outcome from the disappearance of the original agent session.

Microsoft's [Job Objects documentation](https://learn.microsoft.com/en-us/windows/win32/procthread/job-objects) provides a related operating-system concept: a process group can be managed as a unit. It does not prove that CodeFlowMu uses every Job Object facility. It reinforces the distinction among task lifecycle, model-session lifecycle, and process lifecycle.

In particular, “short commands may use the host” must not be read as “short commands are already recoverable and terminable.” A host child process outside the managed service has no service-authored `job.json`, and the current material does not prove that it is uniformly enrolled in a Job Object, parent/child cleanup tree, or orphan-process scan. If an agent session exits unexpectedly, such a command may retain a file, port, or workspace. Production deployment needs separate tests for short-command ownership, timeout termination, residual-handle detection, and failure cleanup. Until evidence exists, this is a risk—not a shipped capability.

## Five invariant groups to test

### Identity

- Each work item has one canonical task identity.
- A child explicitly names its root and parent.
- A report is not attributed solely by thread proximity or wall-clock time.

### State

- Current state is read from the legal lifecycle location.
- If the same TASK appears in two stages, the conflict is preserved rather than guessed away.
- Body fields cannot override path state.

### Transition

- Only enumerated lifecycle transitions are accepted.
- Every transition produces one append-only event.
- Atomicity claims stay inside the documented filesystem boundary.

### Execution

- Role capability, task scope, and current revision are rechecked before action.
- A network retry of the same business command does not manufacture duplicate work.
- A dependent agent is not started before an explicit prerequisite is satisfied.
- Concurrent claim of the same TASK lets only one executor start; a contention loser never begins work merely because its local call returned.

### Acceptance

- A REPORT does not automatically create business acceptance.
- An approval for an old revision does not apply to a new revision.
- An executor cannot unilaterally close work that requires independent acceptance.

These invariants do not prove that report content is true. They do not replace sandboxing, code review, or security testing. They answer a more basic question: does the system know which work it is handling, where that work is in its lifecycle, which evidence belongs to it, and who may decide the next step?

A task does not move reliably because its filename is elegant. It moves reliably because **state, history, execution, report, and acceptance retain separate meanings while a stable identity connects them.** That is where the file state machine and the engineering rail genuinely meet.

This file state machine also has a hard boundary: a single-host `rename` cannot be promoted into multi-host strong consistency, and a directory timestamp cannot replace a causal revision. Preserving a dual-stage conflict and waiting for authorized recovery prioritizes factual integrity, but it is not an unattended self-healing contract: the current material does not prove a lease, heartbeat, timeout reclamation, write-ahead log, or automatic rollback. It also does not cover every crash point, external tool side effect, or platform. The next validation step is fault injection around write, persistence, and rename, together with double-claim contention, stale-revision replay, dynamic dependency cycles, short-command orphan processes, and authorized recovery of dual-stage conflict. Version files and the live process report V1.9.7, but the release remains a candidate until ADMIN makes the final `RELEASED` decision.

## Sources and evidence boundaries

For how this series distinguishes public specifications, private code excerpts, first-party execution records, and independent material, see [How to Read Engineering Evidence at the Digital Employee Works](../methodology/evidence-boundaries). The sources below still support only the specific claims stated in this article.

- The [FCoP 3.0 specification](https://github.com/joinwell52-AI/FCoP/blob/main/spec/fcop-3.0-spec.md) and [TMPA Core S1.0](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-en.md) support the descriptions of TASK, REPORT, REVIEW, directory lifecycle, and reconstructible provenance. They do not promise identical behavior on every filesystem.
- [POSIX.1-2024 `rename()`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html) supports atomic observation of directory-entry replacement within its stated boundary; it does not support claims about cross-mount transactions, crash durability, or strong network-filesystem consistency.
- [Windows Job Objects](https://learn.microsoft.com/en-us/windows/win32/procthread/job-objects) document an operating-system mechanism for managing groups of processes. They do not prove that this runtime uses all Job Object capabilities.
- V1.9.7 figures are first-party engineering evidence from a fixed environment, not third-party certification or a cross-platform reliability claim. Accessed 2026-08-23.
