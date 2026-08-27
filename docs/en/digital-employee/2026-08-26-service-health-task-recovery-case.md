---
title: "A Healthy Service Does Not Mean the Task May Continue: An OpenHands Liveness Failure and Agent Recovery Boundaries"
date: '2026-08-26'
column: digital-employee
category: daily
article_type: case-study
edition: research-center
research_question: "When the service still responds and a session or execution attempt still exists, how can the runtime prove that the task remains eligible to continue and that downstream release is causally justified by satisfied prerequisites?"
summary: "From an OpenHands incident where health stayed green while a conversation lost liveness to a real CodeFlowMu recovery chain, this study separates service health, execution liveness, task eligibility, causal prerequisites, and formal acceptance."
sources: "Public primary sources and the bounded scope of access-controlled first-party evidence are listed in the article."
project_relevance: case-evidence
item_id: "EBR-20260826-04"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-26-service-health-task-recovery-case-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-26-service-health-task-recovery-case-cover.png"
  kicker="Digital Employee · Engineering Research"
  title="A Healthy Service Does Not Mean the Task May Continue: An OpenHands Liveness Failure and Agent Recovery Boundaries"
  summary="Health only says the service still answers. Real recovery has to re-prove task eligibility, prerequisite satisfaction, and the evidence behind every release."
  version="EBR-20260826-04"
  status="Engineering Research · 2026-08-26"
  languageHref="/zh/digital-employee/2026-08-26-service-health-task-recovery-case"
  languageLabel="中文"
/>

# A Healthy Service Does Not Mean the Task May Continue: An OpenHands Liveness Failure and Agent Recovery Boundaries

**A 200 response proves only that some endpoint still answers. It does not prove that the session is making progress, and it certainly does not prove that the current task is still eligible to continue. Reliable agent recovery has to re-establish who is authorized to recover, whether the task is in a legal executable state, whether the current execution right is still valid, and whether the upstream facts required for downstream release are actually satisfied.**

CodeFlowMu is a locally run multi-agent collaboration system that uses tasks, roles, gates, reports, and approvals to organize agent work into an execution chain that can be traced, recovered, and verified. We preserved one real recovery record from 2026-08-25. It did not become a tidy “the system self-healed” story, because the record contains a more valuable discrepancy: **QA's physical release timestamp precedes the two upstream terminal-report timestamps.**

That does not prove the gate was bypassed. It also does not allow us to claim that the dependency was proven satisfied. It exposes a different problem: **timestamp order is not causal proof.**

## 1. One green light cannot answer five questions

During an agent-system fault, several distinct facts are often flattened into a single healthy/unhealthy state. At minimum, five layers should be separated:

| Layer | What it actually answers | What it cannot substitute for |
|---|---|---|
| Service health | Does the process or API respond? | Whether the session is progressing |
| Execution liveness | Is the current session / job still advancing? | Whether the task is eligible to continue |
| Task eligibility | Is the task uniquely projected, legal, and dispatchable now? | Whether upstream prerequisites are satisfied |
| Causal prerequisite | Why may this downstream item be released now? | Whether the business result is accepted |
| Formal acceptance | Has an authorized role accepted the delivery? | The technical facts above |

A recovery chain should therefore not be:

**service is up → wake the agent again**

It should look more like:

**authorize recovery → reconcile attempt and task state → prove prerequisites → dispatch again → verify evidence → formal acceptance**

No layer should sign for another.

## 2. OpenHands provides the lower-layer comparison: health can stay green while a conversation loses liveness

OpenHands software-agent-sdk PR #4548 records a concrete production incident. A browser-tool conversation shutdown remained stuck for roughly **8 hours and 21 minutes** while `/health` and metadata routes still returned 200. Conversation event requests, however, could not be opened normally. At the service layer the system looked alive; at the specific conversation layer it was no longer making useful progress.

The failure centered on `AsyncExecutor.close()`: remaining tasks were not cancelled, and the portal-thread wait was unbounded. The repair cancels remaining work and adds a default **10-second** bound to shutdown waiting. If the timeout expires, the code warns and abandons the infinite wait. The PR is explicit that this is a **bounded, best-effort safety net**, not proof that every resource has been cleaned up.

That distinction matters:

> **Bounded shutdown limits blast radius; it does not certify clean completion.**

The OpenHands case supports one narrow external conclusion: **service health ≠ session liveness.** It is not CodeFlowMu's root cause and does not validate our task-recovery model.

## 3. CodeFlowMu's fault was higher in the stack: the worker could be woken before the task was legally active

The CodeFlowMu failure was not a shutdown hang. A recovery path could wake a worker before the task completed the lifecycle transition required for execution.

This kind of fault is deceptively easy to “fix” operationally: if the agent is stalled, dispatch it again. But if the task has not moved correctly from an inbox-like state into active execution, another wake simply propagates inconsistency downstream. A new Session, report, test run, or eventual done state may all rest on an invalid task premise.

The ADMIN recovery directive therefore bounded PM's authority: repair lifecycle transition, wake-up, and report-gate behavior; add regression evidence; recover or redispatch two stalled work items; and **do not release QA until genuine DEV and OPS terminal reports exist**. This was not a general takeover privilege. It was recovery authority scoped to a named fault and named actions.

That makes the first recovery question a governance question:

> **Who is authorized to repair this path, and how far does that authority extend?**

## 4. The most valuable part of the timeline is what it does not prove

The public A4 timeline preserves these key points:

| Beijing time | Event |
|---|---|
| 14:35:22 | bounded recovery directive became effective |
| 14:35:29 | recovery context reached PM |
| 14:43:54 | OPS recovery dispatch recorded |
| 14:47:32 | DEV recovery dispatch recorded |
| 14:48:25 | QA moved from inbox to active |
| 14:48:42 | OPS terminal report submitted |
| 14:49:37 | DEV terminal report submitted |
| 15:30:36 | active-before-wake repair committed and grouped verification completed |

By physical time, QA became active 17 seconds before the OPS terminal report and 72 seconds before the DEV terminal report. The recovery directive, however, required those terminal reports before QA release.

There are two equally bad overclaims one could make from this record.

The first is:

> QA was definitely released in violation of the gate.

The public evidence is not strong enough for that conclusion. Write time, logical event time, clock source, or an omitted precursor event may differ.

The second is:

> Because OPS, DEV, and QA all reached terminal states later, the prerequisite order has been proven correct.

There is no evidence for that either.

The record supports a narrower statement:

> **The causal basis for QA release is not bound clearly enough in the published record to prove the prerequisite was satisfied at release time.**

That is a more useful result than a polished recovery success story, because it tells us exactly what the next evidence layer must add.

## 5. Why wall-clock timestamps cannot carry prerequisite proof by themselves

In distributed or multi-process agent systems, physical time is excellent for diagnosis but is not automatically a causal credential. We may have action time, event-emission time, persistence time, API-response time, and different process clocks.

Therefore even if:

**A.time < B.time**

we still cannot automatically conclude:

**A is a satisfied prerequisite of B.**

A checkable release should instead look closer to:

**QA release → prerequisites: OPS_REPORT#... + DEV_REPORT#... → required task revision → logical sequence / version precondition**

The release record itself should say what facts made continuation legal. Wall-clock time should remain for troubleshooting, but it should not be the sole proof of causality.

That is the difference between an ordinary log and a prerequisite proof. A log tells us what happened around the same time. A prerequisite proof tells us why this action was eligible to happen then.

## 6. The repair tightened “activate before wake,” not “declare the business task successful”

The Runtime repair did not try to adjudicate business success. It strengthened the mechanical prerequisites for dispatch:

- lifecycle activation must succeed before a worker can start;
- activation failure is fail-closed: no TASK_BOUND Session starts and no active lease remains;
- the current attempt, execution right, and responsible agent must still match;
- YAML / file fallback paths cannot bypass lifecycle checks;
- PM recovery requests enter through a stable recovery skill and routing path instead of turning fault detection into unlimited repair authority.

The repair verification is kept as separate groups: lifecycle governance **16 / 16**, task dispatch **46 / 46**, YAML fallback **4 / 4**, PM core / routing **7 / 7**, and recovery-skill routing **5 / 5**. Together these are 78 grouped assertions, with Runtime TypeScript type checking reporting no errors.

Those results support a bounded claim: **the named active-before-wake repair paths passed their corresponding regressions.** They do not prove that every Runtime fault is automatically recoverable, and they do not retroactively create causal evidence for the historical QA release.

## 7. What should a stronger recovery contract look like?

Abstracting from this incident, a high-risk recovery should pass through a chain like:

**recovery authority → attempt / lease reconciliation → lifecycle activation → prerequisite binding → worker wake → execution evidence → formal acceptance**

Each layer has a different job:

- health proves only that the service can answer;
- heartbeat / progress signals prove only execution liveness;
- lifecycle activation proves that the task may enter execution;
- prerequisite binding proves why the downstream item may be released now;
- REPORT / test output creates delivery evidence;
- REVIEW / ADMIN produces the formal business conclusion.

The goal of recovery is therefore not to wake more agents faster. It is to make every continuation answer:

> **Who authorized this recovery? Why is the current task eligible to execute now? Which upstream facts satisfy its prerequisites? Which revision do those facts belong to? Who later accepted the resulting delivery?**

## Conclusion: recovery is not restart; it is re-establishing eligibility

The OpenHands incident reminds us that **health cannot sign for liveness**. The CodeFlowMu recovery case adds that **liveness cannot sign for task eligibility or prerequisite satisfaction**.

A reliable agent runtime should keep “still answers,” “still running,” “may continue,” “prerequisites satisfied,” and “accepted for delivery” as separate facts connected by explicit evidence relationships.

This case does not end with a perfect all-clear. Instead, it preserves a useful gap: QA's physical release timestamp precedes two upstream report timestamps, and the current evidence is insufficient to prove the causal order either way.

That is what engineering evidence should do. It should not invent a cleaner story than the record supports. It should show what still needs to be made checkable.

> **A healthy service does not mean the task may continue. Recovery must re-prove why continuation is legal now.**

---

## Public evidence

- [**A4 authorization, recovery, and verification timeline (CSV)**](/evidence/execution-boundary-20260826/v2/case-a4-recovery-timeline.csv)
- [**A4 sanitized audit and regression transcript (GitHub)**](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/v2/transcript-a4.md)
- [**Claim-to-evidence map (GitHub)**](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/v2/claim-evidence-map.csv)
- [**Public, sanitized four-case Execution Boundary evidence note**](/zh/digital-employee/2026-08-26-execution-boundary-evidence-data)

## Sources and evidence boundary

### OpenHands

- [**OpenHands software-agent-sdk PR #4548 — bound `AsyncExecutor.close()`**](https://github.com/OpenHands/software-agent-sdk/pull/4548), merged 2026-08-25. This article uses the source-reported incident in which health / metadata still answered while conversation shutdown and event access lost liveness, plus the repair that cancels remaining work, bounds close waiting to ten seconds by default, and treats timeout abandonment as best-effort rather than guaranteed cleanup. The 8h21m incident was not independently reproduced here.

The OpenHands case is used only for **service health ≠ session liveness**. It is not presented as CodeFlowMu's root cause or as an equivalent recovery model.

### CodeFlowMu

The CodeFlowMu claims are limited to the named 2026-08-25 bounded recovery case and the paths covered by the public A4 evidence. The record supports that recovery authority had a defined scope; controlled recovery occurred; the lifecycle, dispatch, fallback, PM routing, and recovery-skill regression groups passed; and QA's physical release timestamp precedes the two upstream terminal-report timestamps.

This evidence **does not prove** that QA definitely violated its gate, nor does it prove that the causal prerequisite was satisfied. It also does not establish that all Runtime faults are recoverable through the same path. Full Sessions, agent transcripts, conversations, and local-machine paths are not public.

Conclusions should be read together with the corresponding version, test sets, and evidence boundary.