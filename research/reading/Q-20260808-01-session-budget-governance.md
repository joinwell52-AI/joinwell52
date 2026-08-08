# Reading Record — Q-20260808-01 Hard session-budget governance with pause-and-resume semantics for managed Digital Employees

- **Queue item:** `Q-20260808-01`
- **Column:** Digital Employee
- **Selection status:** Selected
- **Priority:** P0
- **Skill invoked:** `Skill 03 — Deep Reading`
- **Operating date:** 2026-08-08 (Asia/Shanghai)
- **Primary source class:** First-party Claude Platform product documentation and release notes

## Reading scope

This pass reads Anthropic's August 7, 2026 Claude Platform release note together with the complete Claude Managed Agents Session Budgets documentation. The bounded question is how a managed-agent runtime converts a spend ceiling into lifecycle state: admission of new model work, pause semantics, preserved state, authorized resumption, multi-thread behavior, deployment inheritance, usage observability and explicit failure cases. The record separates product facts from vendor claims and unknowns. It does not recommend a CodeFlowMu or Digital Employee architecture and does not draft an article.

## Deep Reading output

```yaml
reading_notes:
  problem:
    - A long-running managed agent can continue issuing model requests and accumulating cost after a human has delegated the task; a runtime therefore needs an enforceable budget boundary that does not silently destroy the session when reached.
    - A useful budget boundary must distinguish stopping new work from terminating durable state, and must define how already-admitted work, pending tool results, concurrent threads and later authorization changes behave at the cap.
    - Deployment-level policy also needs a clear inheritance rule so a per-run budget can be applied predictably without being confused with a cumulative deployment budget.

  facts:
    - Anthropic's August 7, 2026 release notes state that Claude Managed Agents sessions can now receive a hard session spend budget priced at public list rates.
    - The session budget is optional and can only be attached at session creation. Adding a budget later to a session that was created without one is rejected with HTTP 400.
    - The budget object has `type: "limit"` and `max_list_cost`; the amount is a positive whole number of US cents encoded as a string, and USD is the only supported currency.
    - Enforcement is based on the session's exact, unrounded list cost. The visible `usage.list_cost` is rounded to whole cents, so the displayed value is not the exact comparison quantity used by enforcement.
    - List cost includes model tokens at the served model's public list price, web searches at the documented per-search rate, and session running time at the documented hourly rate. It is explicitly not the organization's negotiated billed price.
    - Enforcement occurs between model requests. Before each new model request, the platform checks consumed list cost; an in-flight request that crosses the cap is allowed to finish.
    - Because the crossing request finishes, a session can stop with visible list cost above its configured cap. The documentation calls this expected and says the overshoot is bounded by one in-flight model request per thread.
    - Reaching the budget does not terminate the session. Threads pause before their next model request and the session becomes `idle` with session-level `stop_reason: budget_reached`; history and sandbox state remain preserved.
    - The event stream records thread idle state, then a `session.usage` snapshot, then session idle state. The usage event immediately precedes the session-level idle event.
    - A thread can report `end_turn` for its own final request even while the session-level stop reason is `budget_reached`; the documentation instructs clients to use the session-level reason as the authoritative budget-pause signal.
    - At or above the cap, the session accepts only events that settle already-started work: tool confirmations, tool results, custom tool results and interrupts. A work-starting event such as `user.message` is rejected with HTTP 400.
    - A `user.interrupt` delivered when all threads are already paused at the cap is accepted but ignored and is not added to the event list.
    - Updating an existing budget resumes paused work automatically if the new maximum is strictly greater than the session's consumed list cost. Removing the budget also resumes work automatically.
    - A budget can be removed by setting it to null, but removal is one-way for that session: a removed budget cannot later be re-added.
    - Because exact enforcement cost can be slightly above the rounded reported amount, the documentation recommends increasing the new cap at least one cent above reported `usage.list_cost` when resuming.
    - Multiagent sessions have one session budget shared across all threads; there are no per-thread caps. Advisor calls consume the same shared budget. Different threads can stop at different moments because one may still have an in-flight request.
    - A thread waiting on `requires_action` can make the session-level status report `requires_action` even if another thread is paused at `budget_reached`; answering that pending request is treated as settlement work and is allowed.
    - A deployment can carry the same budget object. The budget is copied to each session the deployment starts, so the limit is per started session rather than cumulative across the deployment.
    - Updating a deployment budget affects sessions started afterward, not sessions already running. Unlike a session budget, a deployment budget can be cleared and later set again.
    - A budgeted session requires all relevant agent/advisor models to have public list prices. If a budgeted session later includes a model that cannot be priced, the budget can become unable to measure spend; the documented recovery path is to remove the budget.

  vendor_claims:
    - Anthropic calls the feature a hard dollar budget. The documentation itself qualifies that label: the cap blocks admission of new model requests but does not interrupt requests already in flight, so final measured list cost can exceed the configured amount.
    - The documentation states that session history and sandbox are preserved through the budget pause. This is a first-party product guarantee in documentation, not an independently reproduced durability test in this Reading pass.

  mechanisms:
    - Budget admission is creation-time policy: the session starts with a typed dollar limit, and the platform continuously accumulates list cost against that policy.
    - The execution gate sits before model-request admission, not inside model execution. This turns budget exhaustion into a boundary on new work rather than an exact transactional cutoff on total cost.
    - `budget_reached` is a lifecycle stop reason that maps to an idle/pause state rather than termination, preserving the durable session so authority can later change the limit.
    - Resume is policy-driven rather than client-driven: a valid budget update or budget removal causes paused work to resume without a separate start event from the client.
    - Settlement events form a narrow exception channel at the cap. They allow already-admitted tool work to close without permitting new model work.
    - Session-level usage is the enforcement surface; thread-level usage is independently rounded and excludes session running-time cost, so thread totals are not expected to sum exactly to the session amount.
    - Multiagent budget sharing couples all threads to one cost authority while allowing thread-local in-flight completion, which explains why one thread may pause before another.
    - Deployment inheritance is copy-on-session-start rather than live propagation: each newly created session receives the then-current deployment budget.

  evidence:
    - Claude Platform release notes dated August 7, 2026 explicitly introduce Managed Agents session budgets, `budget_reached`, automatic resume after budget change/removal and deployment inheritance.
    - The Session Budgets reference defines the JSON shape, validation rules, cost inputs, enforcement point, event ordering, allowed settle events, update/remove semantics, multiagent behavior, deployment inheritance and error cases.
    - The reference includes concrete examples showing a 50-cent cap may pause with reported list cost of 53 cents because an already-admitted request completes.
    - The reference distinguishes hard session budgets from Messages API task budgets, which are advisory and token-denominated.

  limitations:
    - The budget is a cap on admission of new model requests, not an exact maximum final cost; overshoot by already-admitted requests is explicitly permitted.
    - Public list cost can differ from actual billed spend for customers with negotiated pricing, so the budget is a standardized governance metric rather than an exact invoice ceiling.
    - Only USD is supported, and the amount is whole cents.
    - A session cannot acquire a budget after creation, and a removed session budget cannot be re-added.
    - Deployment budget changes do not retroactively update sessions already running.
    - Multiagent sessions have no per-thread budget partitioning; all threads and advisor calls share one session limit.
    - The product documentation does not publish measured latency between cap crossing and all concurrent threads reaching idle, nor an exactly-once proof for event delivery under connection failure.
    - The documentation does not provide a transactional guarantee that a client observing the rounded usage amount can always choose the mathematically minimum valid new budget; it explicitly recommends a margin because enforcement uses unrounded cost.
    - Models without public list prices can make the budget unusable, and the documented fallback is removal of the budget rather than continued hard-cap enforcement.

  comparisons:
    - Session budgets differ from advisory task budgets: the former are platform-enforced dollar/list-cost gates around a persistent Managed Agents session, while task budgets are model-visible token budgets intended to encourage self-regulation inside an agentic loop.
    - Budget exhaustion differs from terminal completion: the session is `idle`, durable state is retained and authorized policy change can resume execution.
    - Deployment inheritance differs from a fleet-wide cumulative budget: the configured value is copied into each new session and constrains each run independently.

  contradictions:
    - The marketing shorthand “hard cap” is narrower than an exact spend ceiling because the same primary documentation permits bounded overshoot from in-flight requests. The source resolves this by defining the cap as a bound on new work, not a mid-request kill switch.
    - The visible session `list_cost` is rounded while enforcement uses an exact unrounded value. Therefore the observable amount can be insufficient to derive the smallest valid new cap; the source explicitly warns clients to add margin.
    - A session can be at its budget while a pending `requires_action` outranks `budget_reached` at the session status level. This means clients cannot infer budget state solely from the top-level status without also reading pending action and stop-reason semantics.

  unresolved_questions:
    - What delivery and retry guarantees apply to `session.usage` and idle events if a client disconnects exactly as the budget is reached?
    - How quickly do concurrent threads converge to the paused state under high concurrency, and can an operator bound worst-case overshoot across many simultaneously in-flight threads?
    - Is there an organization-level or deployment-level cumulative budget primitive separate from these per-session copied limits?
    - How are negotiated prices, credits or non-token tool costs expected to coexist with list-cost governance when organizations want a budget aligned to actual billed spend?
    - What operational reconciliation is recommended if a model loses a public list price during a long-running budgeted session and budget enforcement becomes unavailable?
```

## Source traceability

1. Claude Platform release notes, August 7, 2026: `https://platform.claude.com/docs/en/release-notes/overview`
2. Claude Managed Agents — Session budgets: `https://platform.claude.com/docs/en/managed-agents/budgets`
3. Claude Managed Agents — Session operations/status semantics: `https://platform.claude.com/docs/en/managed-agents/session-operations`
4. Today's Research Plan: `research/runtime/plans/2026/08/2026-08-08-plan.json`
5. Skill 03: `research/skills/03-deep-reading.md`

## Reading gate decision

**Result:** Deep Reading completed from first-party release notes and full product documentation. The durable Reading Result records the exact enforcement point, permitted overshoot, `budget_reached` pause semantics, settle-only event boundary, automatic resume, multiagent sharing, deployment inheritance, observability and documented error cases. Product guarantees remain labeled as first-party claims where they were not independently reproduced. No Research Analysis, implementation recommendation or article was produced.
