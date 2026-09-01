# Research Analysis — Q-20260901-03 Recovery Truth Outside the Failed Plugin Process

- **Runtime date:** 2026-09-01
- **Source Reading:** `research/reading/Q-20260901-03-plugin-isolation-durable-recovery-transcript.md`
- **Research themes:** agent runtime governance; fault isolation; durable recovery; effect identity; audit and provenance
- **Subject kind:** architecture-mechanism; failure-mode; research-finding
- **Recommended article type:** `engineering-insight`
- **Selected modules:** `research-question`, `evidence`, `technical-analysis`, `engineering-implications`, `operational-implications`, `limitations`, `open-questions`
- **Project relevance:** `none`

## Research question

What durable state must exist outside a disposable plugin or worker process before process isolation can support trustworthy recovery rather than merely limiting the blast radius of a crash?

## Evidence claims

### E1 — public-fact

**Claim:** Logos separates the harness into peer processes and places the durable session source of truth in an append-only JSONL transcript described as owned by no process; model-facing history is rebuilt as a projection of that transcript.

**Source:** 2026-09-01 Reading Note for arXiv:2608.28553.

**Strength:** states.

**Independent:** false. This is architecture evidence from the primary research system.

### E2 — public-fact

**Claim:** The reported protocol uses durable-before-visible settlement: a completed represented result/effect is appended durably before downstream visibility is announced.

**Source:** same Reading Note / primary study architecture.

**Strength:** states.

**Independent:** false.

### E3 — public-fact

**Claim:** Control delivery is explicitly at least once. Duplicate handling depends on stable global call identifiers and idempotent pairing rather than a transport-level exactly-once guarantee.

**Source:** same Reading Note / primary study.

**Strength:** states.

**Independent:** false.

### E4 — source-reported-claim

**Claim:** The study reports 12/12 sessions resumed through its tested failure sequence and 80/80 crash-point trials across four selected kill boundaries without repeating the represented settled effect; a 3,500-call conformance set reports zero pairing invariant violations under the tested conditions.

**Source:** same Reading Note / primary study experiments.

**Strength:** reports.

**Independent:** false.

### E5 — source-reported-claim

**Claim:** Recovery can still redo computation and remain costly: in one reported fault example six interim results are recomputed, and the faulting session is far slower than the unaffected comparison path.

**Source:** same Reading Note / primary study.

**Strength:** reports.

**Independent:** false.

### E6 — public-fact

**Claim:** The study excludes arbitrary external side effects and multi-machine partition semantics from its strongest demonstrated recovery guarantee; the evaluated deployment is principally one-machine/trusted-network oriented.

**Source:** same Reading Note / primary study limitations.

**Strength:** states.

**Independent:** false.

### E7 — our-observation

**Claim:** The architecture demonstrates that fault isolation and recovery authority are separate properties: a process can be safely disposable only when the facts used to decide replay, ownership and settlement survive outside that process’s failure domain.

**Source:** mechanism comparison across the same-day Reading Result.

**Strength:** observed.

**Independent:** false.

## Failure / finding / mechanism / implication

### Failure

Moving a tool, plugin or worker into another process limits how much memory and control flow disappear when it crashes, but isolation alone does not answer the recovery question: **what already happened?** If session truth, call identity or settlement state exists only in the failed process, restart can regenerate work whose effect may already have settled.

This creates a dangerous ambiguity between three states that look similar from the restarted worker:

- the call never happened;
- the call happened but its acknowledgement was lost;
- the call happened and its represented effect is already durably settled.

Without authority outside the failed process, replay cannot safely distinguish them.

### Finding

The primary study’s tested mechanism combines process isolation with durable external session truth, stable call identity and settlement ordering. Under its bounded fault model, this supports recovery through selected process kills without repeating the **represented settled effect**. The result does not eliminate repeated computation, at-least-once control messages or all forms of duplicate external action.

### Mechanism

The useful architecture can be expressed as a **recovery-truth plane outside the worker failure domain** with four responsibilities:

1. **Session truth:** an append-only durable transcript from which current worker context can be reconstructed.
2. **Effect identity:** stable call/effect identifiers that survive worker restarts and reconnects.
3. **Settlement ordering:** durable evidence of a represented completion is recorded before that completion becomes visible downstream.
4. **Ownership generation:** reconnect and registration rules prevent two live process instances from silently claiming the same logical role.

The worker process becomes replaceable because it no longer owns the authoritative answer to whether a represented operation is already settled.

### Implication

For governed agent runtimes, **isolation should be evaluated together with recovery evidence placement**. A worker is not safely disposable merely because it can be restarted. The runtime must be able to reconstruct its session and determine replay eligibility from durable evidence that survives independently of that worker.

For actions that escape the represented protocol boundary, an additional effect discipline is still required—provider idempotency key, transactional outbox/inbox, receipt reconciliation, withheld commit, or compensation. The transcript can be authoritative for what the harness recorded without being atomic authority over every external system.

## Research judgment

**Bounded judgment:** The same-day primary research supports the engineering conclusion that process-level fault isolation becomes a meaningful recovery mechanism only when session truth and effect identity are externalized outside the failed process. Durable-before-visible settlement plus stable call identity provides a principled replay boundary for represented effects under the tested failure model.

The stronger claim “process isolation gives exactly-once agent execution” is not supported. The transport is at least once; recovery may recompute work; arbitrary outward effects are explicitly outside the strongest guarantee; and the study does not establish distributed consensus or multi-machine partition safety.

The general design consequence is therefore: **separate disposable execution state from durable recovery truth, and never infer external-effect certainty from local transcript settlement alone.**

## Why the transcript is more than logging

A debug log records observations after the fact. A recovery transcript participates in a control decision: whether a restarted worker may replay an operation.

That requires stronger semantics than ordinary logging:

- append order must be meaningful;
- call/result identities must be stable;
- settlement records must be durable before the system relies on them;
- the reconstructed projection must have a defined relationship to what the worker previously saw;
- duplicate delivery must be tolerated without creating a second logical effect;
- ownership changes must be visible rather than silently producing split-brain workers.

Once a record influences replay authorization, it becomes governance evidence rather than merely telemetry.

## Effect boundary

The most important analytical boundary is between a **represented settled effect** and an **external real-world effect**.

If a tool invocation’s authoritative outcome is inside the durable protocol and keyed by a stable call identity, the runtime can use that evidence to suppress replay under the tested failure conditions. But if an external payment, message, deployment or third-party write occurs outside the transcript’s atomic settlement boundary, then a transcript entry alone cannot prove the provider did or did not commit the action.

The ambiguous crash window remains:

`external effect committed -> process crashes -> durable transcript append missing`

Safe handling of that window needs evidence from the external effect boundary itself. Process isolation does not close it.

## Counterarguments

### “If each plugin is in its own process, a restart is enough.”

A restart restores compute capacity, not history. Without external session/effect truth, the new process cannot know which work is safe to replay.

### “An append-only transcript means exactly-once.”

No. The paper explicitly models at-least-once control delivery. The demonstrated duplicate defense comes from stable identity and settlement logic within the represented protocol boundary, not from unique delivery.

### “No repeated effect means no repeated work.”

The reported experiments contradict this interpretation. Recovery may repeat model calls, intermediate computation and error handling while still avoiding replay of a represented settled effect.

### “One durable transcript solves distributed recovery.”

The evaluated design is bounded primarily to one-machine/trusted-network conditions. Replication, partition handling, corruption recovery, consensus and machine-loss durability remain distinct problems.

## General implications

- Put authoritative session/recovery state outside any worker that is expected to be disposable.
- Give calls/effects stable identities across retries and process generations.
- Persist represented settlement before advertising completion downstream.
- Treat transport duplication as normal when delivery is at least once; use idempotent identity instead of claiming delivery uniqueness.
- Separate recovery truth from model context projections; context may be trimmed while audit/recovery evidence remains complete.
- Track worker/plugin ownership generation so a stale instance cannot silently re-enter after ownership transfer.
- For external irreversible actions, bind runtime effect identity to provider receipts/idempotency/commit evidence or use compensation.
- Treat durable recovery transcripts as sensitive governance assets because they may contain enough information to reconstruct privileged sessions.

## Limitations

- The evidence is one primary research system, not an independent reproduction or production guarantee.
- Fault experiments cover selected process-kill boundaries and a principally one-machine environment.
- The architecture does not establish Byzantine tolerance, distributed consensus or partition-safe ownership.
- External effects without a shared idempotency or commit protocol remain outside the recovery guarantee.
- The transcript is a logical source of truth; replication, compaction, corruption recovery and long-term storage governance are not the central evaluated contribution.
- Isolation assumes controlled peer code and does not establish hostile multi-tenant sandbox security.

## Open questions

1. How should transcript call IDs bind to third-party idempotency keys and external receipts?
2. What protocol resolves the crash window between an external provider commit and the local durable transcript append?
3. How should transcript compaction preserve evidence needed for replay denial and later audit?
4. What ownership-generation rule prevents a stale peer from reconnecting after a replacement has been admitted?
5. What replication or consensus mechanism is required when the recovery-truth plane itself must survive machine loss?
6. How should sensitive transcript fields be encrypted or redacted without destroying deterministic recovery semantics?

## Project-relevance test

**Status:** `none`.

The conclusion is a general runtime architecture result derived from the external research evidence. It remains intact without TMPA, FCoP or CodeFlowMu, so no first-party mapping is introduced in this Analysis.
