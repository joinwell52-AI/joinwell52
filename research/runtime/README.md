# Research Runtime Center V5.0 — Frozen Runtime Charter

**Project:** joinwell52 Research Center  
**Scheduler:** Research Runtime Scheduler V3.0  
**Operations Center:** V5.0  
**Architecture status:** four-family and Daily six-stage boundaries frozen; recovery governance is now a formal runtime rule  
**Effective date:** 2026-08-05  
**Recovery rule update:** 2026-08-09  
**Timezone:** `Asia/Shanghai`  
**System of record:** `joinwell52-AI/joinwell52`

## 1. V5 boundary

Runtime Center V5 separates Daily, Weekly, Academic and Research Program Runtime. Program work never consumes a Daily stage or Daily column slot.

## 2. Daily closed loop

```text
09:00 Discovery → Signal Pool
10:00 Queue → Today's Research Plan
11:00 Reading → Reading Result
13:00 Analysis → Research Object
15:00 Production → Publication Candidate
20:00 Publication → GitHub + Website + Commit Verify + Release
```

The dependency chain is strict: Discovery → Queue → Reading → Analysis → Production → Publication. A later stage may open only after its direct prerequisite is `Completed`.

## 3. Independent runtimes

- Weekly runs Sunday 20:30 and joins the same-day recovery queue only after Publication completes. Sunday therefore has seven tasks.
- Academic runs Wednesday 16:00 for papers, benchmarks, specifications and institutions.
- Research Program runs Monday 12:00 for TMPA, FCoP, CodeFlowMu, Digital Employee and Research Operating System.

## 4. Scheduler V3.0: wake-up, not clock truth

[`SCHEDULER.json`](./SCHEDULER.json) is the machine authority. GitHub Actions schedule wakes the Scheduler; `SCHEDULER.json + Runtime Records + current Asia/Shanghai time` determine actual due work.

Each offset heartbeat recalculates same-day work. Running, Completed, Failed and Skipped are not automatically reopened. Waiting requires its direct prerequisite to be Completed. Blocked is eligible only when it is explicitly dependency-caused and its `blockedBy` prerequisite has completed. Runnable overdue work is sorted by formal time, and **only the oldest runnable shift is opened per heartbeat**.

Missing heartbeats therefore delay work rather than expiring it, while sequential catch-up prevents dependent stages from being opened concurrently.

## 5. Recoverable Blocked governance

Dependency Blocked results should carry machine-readable metadata such as:

```json
{
  "status": "Blocked",
  "blockedBy": "reading"
}
```

After the dependency completes, Scheduler may use Runtime V5's governed `reopen-blocked` path. The previous current result is cleared for the retry, while timeline history remains auditable. Unrelated Blocked work is not reopened merely because time passes.

## 6. Records and human ledger

Machine records live under `research/runtime/records/{family}/YYYY/MM/`. Daily JSON requires a same-day `research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md` ledger. JSON is authoritative; Markdown is a mandatory inspection projection containing start, Running, terminal and Commit Verify events plus Input, Work Result, Output, Next, Metrics, Evidence and Artifacts.

Structured narratives, legacy metric names and string/object evidence/artifacts must project correctly. `[object Object]`, placeholder evidence replacing real sources, or machine/Markdown status divergence are projection failures.

## 7. Shift result contract

Terminal shifts report Input, Work Result, Output, Next, Metrics, Evidence and Artifacts under `runtime-shift-result/v2`. Runtime V5 validation accepts legitimate flat bilingual and structured V5 forms already present in the repository; historical valid results must not break the scheduler control plane.

## 8. Mandatory self-check

Every opened or recovered slot passes:

```text
Runtime V5 validate
→ Markdown render
→ Markdown validate
→ durable Git commit
→ fetch / ancestor verify
→ taskStatus == Running verify
→ Execution Slot Opened event verify
```

Worker finalization requires result-contract, artifact, Git commit and Commit Verify checks for `Completed`, `Failed`, `Blocked` and `Skipped`. A green Actions run alone is never proof that research work completed, and a failed business shift must still close its Running lease through the governed terminal path.

## 9. Recovery order

```text
establish durable facts
→ locate earliest missing/recoverable gap
→ verify or repair its direct prerequisite
→ open only that stage
→ Runtime + Markdown self-check
→ persist and Commit Verify
→ allow the next stage
```

Never jump to a downstream stage based on current clock time, open multiple dependent stages to catch up, or fabricate Completed.

## 10. 2026-08-09 Recovery Case

Sunday had seven due tasks. Discovery and Queue completed, Reading was missed, and Analysis opened while Reading was incomplete and correctly became Blocked. Investigation also exposed Runtime V5 incompatibility with legitimate structured historical results and `[object Object]` leakage in Markdown projection.

The permanent repair restored Reading, marked Analysis with `blockedBy: reading`, installed dependency gates and dependency-ready Blocked retry, made Runtime V5 compatible with legitimate result forms, repaired projection, ran full validation and removed temporary hotfix machinery. This is the first production recovery case for Research Report Production Engine V2.0.

## 11. Authority and release

GitHub is the single source of truth. A formal release is complete only after Runtime Result → Durable Artifacts → GitHub Commit → Commit Verify → Website Projection → Release.

## 12. Freeze rule

The four Runtime families, Daily six-stage identities and Scheduler V3.0 formal task identities remain frozen. The 2026-08-09 change adds recovery governance and self-check rules without redefining the business stages.
