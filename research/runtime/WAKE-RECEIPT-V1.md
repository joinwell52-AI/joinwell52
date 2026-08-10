# Research Runtime Wake Receipt V1

## Purpose

ChatGPT Scheduled Tasks and the GitHub Runtime control plane are separate systems. A timer firing is not the same event as a Runtime task obtaining execution authority.

The Process Manager MUST NOT infer whether a scheduled timer fired from Runtime task status.

## Required state machine

A formal timer activation is represented by these distinct facts:

1. **Wake Received** — the scheduled automation invocation actually started.
2. **Execution Deferred** — optional; this wake did not have execution authority because an earlier due task was still unfinished.
3. **Execution Slot Opened** — the Process Manager granted the earliest due unfinished task an execution slot.
4. **Worker Claimed** — an actual worker claimed the granted slot.
5. **Terminal outcome** — Completed, Blocked, Failed, or Skipped.
6. **GitHub Commit Verified** — the terminal outcome is durably verified on `main`.

`Wake Received` MUST NOT be represented as `Running`.

## Wake receipt contract

Every formal ChatGPT Scheduled Task invocation MUST persist a wake receipt before substantive Runtime work.

Preferred durable path:

`research/runtime/wakes/YYYY/MM/YYYY-MM-DD/<nominal-task>-HHMMSS.json`

Minimum fields:

```json
{
  "schema": "runtime-wake-receipt/v1",
  "date": "YYYY-MM-DD",
  "timezone": "Asia/Shanghai",
  "nominalTask": "reading",
  "nominalTime": "11:00",
  "wakeTime": "11:02:13",
  "source": "chatgpt-scheduled-task",
  "status": "Received"
}
```

The receipt records only that the timer invocation started. It does not authorize the nominal task.

## Ordered execution rule

After the wake receipt is durably persisted and fetched from `main`, the Process Manager MUST:

1. load all formal tasks applicable to the run date;
2. sort them by formal schedule time;
3. find the earliest due task that is not execution-closed;
4. grant execution only to that task;
5. if the nominal timer task is later than the earliest unfinished task, record the wake as **Deferred** and perform zero nominal-task business work;
6. when the earlier task closes, reconcile immediately; if the deferred task is already overdue, run it immediately without waiting for its next timer.

## Accuracy invariant

The system MUST be able to distinguish all three cases:

- timer did not fire;
- timer fired but was deferred;
- timer fired and its wake eventually resulted in execution authority.

No UI or Runtime decision may infer one of these states from another.
