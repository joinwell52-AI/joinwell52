# Research Runtime Process Manager V2.0 — Immediate Catch-up and Ordered Advancement

**Effective date:** 2026-08-09  
**Timezone:** `Asia/Shanghai`  
**Applies to:** Research Runtime Center V5.0 / Scheduler V3.0  
**Operational truth:** `SCHEDULER.json + Runtime Records + Runtime Results`

## 1. Core semantics

Formal time determines when a task becomes due. It does not directly select the stage that must run now.

```text
clock reaches a formal time
→ reconcile
→ find the earliest incomplete due task
→ verify its direct prerequisite is Completed
→ open only that task
```

Once a task is overdue, it enters catch-up mode. Catch-up does not wait for another formal clock point:

```text
previous catch-up task Completed
→ Completion Workflow succeeds
→ workflow_run immediately wakes Scheduler
→ reconcile now
→ if the next stage is already due and dependency-ready, start it now
```

The governing rule is therefore: **completion advances the chain; cron is the safety net.**

## 2. Dual-trigger model

### 2.1 Event-driven primary path

```text
Worker produces durable result + artifacts
→ writes a completion request
→ Research Runtime Shift Completion V2.0
→ validates result contract
→ renders and validates Markdown
→ durable commit + verification
→ workflow_run
→ Research Runtime Scheduler V3.0
→ opens the oldest next overdue stage
```

Completion Request contract:

```json
{
  "schema": "runtime-shift-completion-request/v1",
  "task": "production",
  "date": "2026-08-09",
  "resultPath": "research/runtime/results/2026/08/2026-08-09-production-result.json"
}
```

### 2.2 Heartbeat safety path

Offset GitHub schedule heartbeats remain active, but their responsibilities are limited to:

- reconciling when a completion event is missed;
- detecting overdue work;
- reopening dependency-ready Blocked work;
- checking Running leases;
- repairing order violations.

Heartbeat is no longer the only way an overdue chain advances.

## 3. Ordering invariant

Daily / Sunday chain:

```text
Discovery
→ Queue
→ Reading
→ Analysis
→ Production
→ Publication
→ Weekly (Sunday)
```

Whenever a task is Running or Completed, its direct prerequisite must be Completed.

One reconciliation opens only one oldest runnable task. If that task completes and another stage is already overdue, the completion event causes a new reconciliation. This is sequential advancement, not concurrent opening of dependent work.

## 4. Time gate

A task is runnable only when all conditions hold:

```text
formal time is due (including configured lead window)
AND task is incomplete
AND direct dependency = Completed
AND no earlier runnable overdue task exists
```

A future task never starts merely because its prerequisite completed early. For example, when Production completes at 17:47, Publication remains Waiting until its formal 20:00 gate.

## 5. Accurate Running state

`Running` is a bounded execution lease, not a permanent fact.

- Scheduler opens a slot and records `Execution Slot Opened`;
- Worker must produce artifacts and complete through the Completion Workflow;
- when no terminal result appears before the lease expires, Watchdog records `Running Lease Expired`;
- the task returns to governed recovery instead of displaying “Running” forever.

Current leases:

| Task | Lease |
|---|---:|
| Queue | 30 minutes |
| Discovery | 45 minutes |
| Reading / Analysis | 60 minutes |
| Production / Weekly / Academic | 90 minutes |
| Publication | 60 minutes |
| Program | 120 minutes |

## 6. Front-end synchronization

All Runtime surfaces must read the same live Runtime Record:

- formal task cards;
- V2.0 ordered recovery progress;
- Current / Next labels;
- completed count.

Static Pages data is first-render fallback only. After hydration, the page periodically reads the same-day record from GitHub `main`. Scheduler and Completion `workflow_run` events explicitly trigger Pages Build, Verify and Publish after GITHUB_TOKEN-authored state commits.

A page may not show “catching up” in the progress strip while the task card says Completed.

## 7. Self-check chain

Every completion and advancement must pass:

```text
result contract validate
→ Runtime V5 validate
→ Markdown render
→ Markdown validate
→ durable Git commit
→ ancestor / state verify
→ immediate reconcile
→ Pages Build / Verify / Publish
```

## 8. 2026-08-09 production validation

After Analysis completed, the old flow waited only for cron and did not open Production immediately. The repaired flow produced this evidence:

- the completion-driven Scheduler primary path was installed;
- an immediate 17:32 kick opened Production;
- Production produced three bilingual candidate pairs and three semantic visuals;
- the first push-request run of `Research Runtime Shift Completion V2.0` completed successfully;
- Scheduler received a `workflow_run` activation within seconds of completion;
- Scheduler correctly kept Publication Waiting because 20:00 had not arrived.

The validation proves both requirements:

1. an overdue next stage no longer waits for another cron;
2. a future next stage does not bypass its formal time gate.

## 9. Operational acceptance

Process management must be:

- **timely:** reconcile immediately after an overdue prerequisite completes;
- **accurate:** machine and page states share one source; Running has a lease;
- **efficient:** advance one stage at a time without dependent concurrency;
- **recoverable:** heartbeat, Blocked reopen and Watchdog provide safety paths;
- **auditable:** opening, completion, expiry, recovery, commit and verification are durable events.
