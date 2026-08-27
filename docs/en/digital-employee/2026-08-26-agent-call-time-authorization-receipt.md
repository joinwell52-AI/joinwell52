---
title: "Why Recheck Every Execution If the Agent Already Has Tool Access? From GitHub MCP to a Task Evidence Chain"
date: '2026-08-26'
column: digital-employee
category: daily
article_type: comparative-study
edition: research-center
research_question: "Why can static tool capability not be treated as authorization for the current execution, and what task evidence must be rechecked?"
summary: "Starting from a real CodeFlowMu gate failure and its regression trail, this study compares GitHub MCP's call-time scope challenge with task-level execution authorization and asks what evidence must travel with a specific action."
sources: "Public primary sources and the bounded scope of access-controlled first-party evidence are listed in the article."
project_relevance: case-evidence
item_id: "EBR-20260826-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-26-agent-call-time-authorization-receipt-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-26-agent-call-time-authorization-receipt-cover.png"
  kicker="Digital Employee · Engineering Research"
  title="Why Recheck Every Execution If the Agent Already Has Tool Access? From GitHub MCP to a Task Evidence Chain"
  summary="Tool access says what an agent can do in principle. A specific execution still has to be justified by the current task, target, revision, approval, and resulting effect."
  version="EBR-20260826-01"
  status="Engineering Research · 2026-08-26"
  languageHref="/zh/digital-employee/2026-08-26-agent-call-time-authorization-receipt"
  languageLabel="中文"
/>

# Why Recheck Every Execution If the Agent Already Has Tool Access? From GitHub MCP to a Task Evidence Chain

**Tool access answers what an agent can do in principle. Execution authorization asks whether this action, against this target, on this evidence, may happen now. Between the two is a boundary that has to be re-checkable.**

## Bottom line

We recently fixed what looked like a small problem in CodeFlowMu: a task that should have been allowed to continue was stopped by a safety gate.

**CodeFlowMu is a locally run multi-agent collaboration system that uses tasks, roles, gates, reports, and approvals to organize agent work into an execution chain that can be traced, recovered, and verified.**

The failure was not that an agent lacked tool access, and the task had not actually crossed its authorized scope. What happened was subtler: **a piece of information that should only have warned the responsible person was promoted by the Runtime into a reason to deny execution.**

That incident forced us to revisit a more basic question:

> **If an agent already has Git, Shell, or another tool, why should the system recheck every concrete execution?**

At the same time, GitHub's official MCP Server is dealing with a structurally similar problem at a different authorization layer. GitHub MCP is concerned with OAuth permissions; CodeFlowMu is concerned with task execution qualification. They are not the same system and they do not use the same authorization model, but both are moving toward the same boundary:

**Static capability → current call → current context → authorization for this execution**

In other words: **being able to use a tool does not automatically mean that this particular invocation is authorized.**

This article does not claim that CodeFlowMu already has a complete agent-authorization architecture. The more interesting observation is an engineering convergence: two independent systems are moving authorization away from “what capability does this principal have?” and toward “does the current execution still satisfy the conditions under which it may happen?” CodeFlowMu also has something more concrete than an argument: a recorded failure, successive fixes, regression data, and controlled live checks.

## 1. How did a safety check block a legitimate task?

A typical CodeFlowMu work chain can be reduced to:

**Requirement → PM → Task → DEV / OPS / QA → Report → Review / Approval → Done**

Such a system needs gates. A closed root task, a target outside task scope, a missing mandatory approval, or an unmet required dependency can all be valid reasons to deny an action.

The problem is that not every imperfect condition has that meaning. “It would be better to add an acceptance note” or “the plan could be more complete” can be useful information, but those statements are **advisory**, not automatically **vetoes**.

That distinction is where this CodeFlowMu failure occurred. A condition that should have produced “warn the responsible person and let an authorized decision-maker judge it” was interpreted as “condition not satisfied, therefore execution is denied.” The agent had not overreached and the task had not left scope. The guardrail itself crossed the decision boundary.

That is why the real question is not simply pass or fail. It is **which facts have the authority to produce a denial**.

| Condition | Meaning | Runtime behavior |
| --- | --- | --- |
| Root task is closed | Hard constraint | Deny |
| Target is outside task scope | Hard constraint | Deny |
| Required formal approval is missing | Hard constraint | Deny |
| Mandatory dependency is unsatisfied | Hard constraint | Deny |
| Plan is incomplete | Advisory condition | Warn |
| Acceptance note is recommended | Advisory condition | Warn |
| Responsible owner should look again | Review signal | Escalate for judgment |

A system may have the technical ability to block an action without having the authority to block every undesirable state. The engineering rule we kept from this incident is therefore simple:

> **Advice is not a veto. Only facts with denial authority should be sufficient to deny execution.**

A reliable guardrail must know not only when to close the gate, but when it lacks the authority to close it.

## 2. Why 87/87 still was not enough

The first focused check passed quickly: **87 / 87**. If the goal had been a clean number, the work could have stopped there. But a gate does not exist in isolation; its meaning propagates through a chain:

**Rule → Runtime → API / Shell → live process → UI**

Any layer that still carries the old semantics can leave the real system wrong. That is exactly what happened:

| Stage | Result | What it exposed |
| --- | ---: | --- |
| Targeted dispatch checks | 87 / 87 | Covered target paths passed |
| First full Runtime regression | FAIL | Historical tasks were still mechanically blocked by the new gate |
| Runtime after correction | 1702 / 1702 | Specified Runtime regression set passed |
| First full Shell regression | FAIL | UI-facing tests still encoded the old state semantics |
| Shell after correction | 936 / 936 | Specified Shell regression set passed |
| First controlled live check | FAIL | API omitted a compatibility field still consumed by the page |
| Fix plus second controlled restart | PASS | Runtime, API, and UI state were aligned again |

The important number is not 1702. The important fact is that **the live system still had a problem after 1702 / 1702 passed**.

The Runtime had the correct canonical state, but the API no longer emitted a compatibility field the page still expected. The UI could therefore render a missing field as a conflict. That gives us a second rule: **tests passing does not mean the system is correct**.

This is also why the evidence retains the failed rounds and the first live failure instead of preserving only the final green result. Removing those failures would remove much of the engineering information.

## 3. This was not one bug; it was a recurring boundary

If this were the only incident, it would be easy to call it one bad conditional. The recent CodeFlowMu engineering record is broader than that.

Across task governance we have had to deal with advisory planning becoming a veto, new governance semantics mechanically breaking historical replay, approval history entering the governance view, approval identity and content staying aligned, deciding which facts survive Session recovery, keeping Runtime and UI interpretations of task state consistent, and deciding whether stale state can be reused after Retry or Recovery.

These issues look different on the surface, but they keep pointing to the same deeper structure: **whether an action may happen cannot be decided from the agent's role and tool list alone.** It also depends on the current task, target, revision, validity of prior approval, the decision class of the present condition, and whether a retry could produce another external side effect.

That is why our research process is not “write a complete theory, then build a demo.” It looks more like:

**Real failure → diagnosis → rule change → implementation → regression → live verification → new boundary exposed → next engineering question**

We call this engineering research because the model is being shaped by a running system. The system hits a boundary, we fix it and retain the evidence, and repeated failures gradually reveal a more general execution model.

## 4. GitHub MCP provides a useful external reference

GitHub's official MCP Server is not solving CodeFlowMu task governance. Its immediate problem is the permission relationship between GitHub tools and the current credential. What makes it useful here is that it does not reduce all authorization to a single static check.

GitHub MCP tools declare the OAuth scopes they may require. Different tools can require different scopes: repository operations may involve `repo`, organization operations can require `read:org`, and security-related tools can involve `security_events`. The tool therefore has a baseline permission envelope.

GitHub also handles authentication modes differently. With a classic PAT, the server can discover the token's existing OAuth scopes at startup and filter tools accordingly. If the credential clearly lacks a required scope, a tool can be hidden before use.

Remote OAuth is different. When a tool is actually called, if the current OAuth token lacks the scope required for that call, the server can return an **OAuth scope challenge**:

**Tool available → current Tool Call → check current OAuth scopes → execute if sufficient; otherwise request additional authorization**

The GitHub MCP Server documentation explicitly separates these mechanisms: classic PAT uses startup-time tool filtering, while remote OAuth can re-evaluate scopes at the concrete Tool Call and challenge only when the current authorization is insufficient.

The HTTP server exposes the same idea directly through `--scope-challenge`. With insufficient scopes it can return `403 Forbidden` together with `WWW-Authenticate` describing the scopes required by the request.

The important point here is not OAuth itself. It is **where the decision is made**:

> **The current Tool Call can itself be an authorization checkpoint.**

Authorization does not permanently end when a client connects to GitHub MCP or when a tool becomes visible to an agent. At execution time the system can still ask: **is the authorization we have enough for this call?**

That is structurally close to the problem CodeFlowMu is encountering at the task-governance layer.

## 5. Rechecking each execution is not re-approving each execution

This distinction matters. If every command forced a new confirmation dialog, the system would not have a mature authorization model; it would simply outsource every decision to the user.

By “recheck each execution” we mean something narrower: **whenever an action is about to produce a side effect, re-evaluate whether the authorization facts already on record still support it.**

If the task is still valid, the target is still in scope, the revision has not invalidated approval, that approval is still active, and the action is still permitted, the Runtime can proceed automatically. Human intervention is needed only when the evidence has changed or the current authority is insufficient.

So: **recheck ≠ re-approve.**

GitHub MCP's scope challenge illustrates the same principle. A call can be checked every time without prompting every time; an additional grant is requested only when the current scope set is not enough.

## 6. Where GitHub MCP and CodeFlowMu actually align

They operate at different layers:

| GitHub MCP | CodeFlowMu |
| --- | --- |
| Current Tool | Current Agent |
| Current Tool Call | Current concrete action |
| Current call arguments | Current task and target |
| Current credential | Current task revision and approval |
| Are the OAuth scopes sufficient? | Is the task evidence sufficient? |
| Challenge / Execute | Deny / Review / Execute |

GitHub MCP primarily asks: **does the current credential have the permission required by this Tool Call?** CodeFlowMu needs to ask: **does this agent, under the current task context, have the authority to let this action produce a side effect?**

Those are not the same question. What they share is the structural conclusion that **static capability is not enough**.

**GitHub MCP: Tool available → current Tool Call → recheck scopes → challenge / execute**

**CodeFlowMu: Agent has Tool → current action → recheck task evidence → deny / review / execute**

The common boundary is that current context has to re-enter the decision. This is not a claim that one project copied the other, nor that GitHub MCP already implements CodeFlowMu's task authorization. It is an observable convergence reached from two different engineering layers.

### Where PR #3128 fits

GitHub MCP Server [PR #3128](https://github.com/github/github-mcp-server/pull/3128) goes one step further: **the same tool can require different OAuth scopes depending on the arguments of this particular call.**

A normal repository-file write and a GitHub Actions workflow-file write can pass through the same file-writing tool, while the workflow change additionally requires the `workflow` scope. That makes the broader point sharper: **authorization may depend not just on the tool name, but on what this invocation is actually trying to do.**

CodeFlowMu's engineering problem did not begin with #3128. Task gates, approvals, and state boundaries were already appearing in our running system and in our own evidence trail. We therefore treat #3128 as a further engineering reference, not as CodeFlowMu's implementation source and not as the sole basis for task-level call-time authorization.

## 7. What CodeFlowMu needs to recheck is task evidence

GitHub MCP mainly rechecks OAuth scope. CodeFlowMu needs to recheck task context. At minimum, five classes of facts matter.

**First, task binding.** Which task does this action belong to? If TASK-102 authorizes work in repo-A, that does not imply that DEV may also modify repo-B. Tool capability belongs to the role; execution qualification belongs to the current task.

**Second, target binding.** Even within one repository, `repo-A / feature-x` and `repo-A / main` can carry different risk and approval requirements. “DEV has Git” is therefore far too coarse to answer “may this push happen?”

**Third, current validity.** Suppose that at 10:00 Task=T1, Version=V1, and Approval=valid. At 10:15 the task is still T1 but Version=V2. Whether the old approval still applies is now a live question. Rechecking is not distrust of the agent; it is refusal to extend an authorization made for old facts into a changed context without evidence.

**Fourth, decision class.** The Runtime must distinguish at least allow, advisory, review, explicit approval required, and deny. “It would be better to add an acceptance note” cannot, by itself, become “execution is forbidden.”

**Fifth, retry and external effect.** Correct authorization does not prove that an external side effect happened exactly once. If a `push` times out, “never executed” and “executed but response lost” are different worlds. Call-time authorization therefore eventually has to connect the action occurrence, execution attempt, idempotency handling, and external-effect evidence.

Together these facts establish another separation: **authorization being correct does not mean the external effect has been correctly established.**

## 8. From a tool-permission matrix to a task evidence chain

A static permission matrix might say: **DEV → Git | OPS → Shell | QA → Test**. That answers who can use which capability in principle. It cannot explain why DEV may push to `repo-A/main` now.

For that, a more specific evidence chain is needed:

**Agent capability → current task → current action → current target → current revision → current approval → authorization decision → execution → external outcome**

That is what “from GitHub MCP to a task evidence chain” means in this article. GitHub MCP rechecks the current credential's OAuth scope at Tool Call time; CodeFlowMu has to keep asking where the authority for this action comes from in the current task context.

This is why we have started to study a narrower object: an **Execution Authorization Receipt**. Conceptually it might retain something like:

```json
{
  "task_id": "TASK-...",
  "occurrence_id": "CALL-...",
  "actor": "DEV",
  "tool": "git",
  "action": "push",
  "target": {
    "repository": "...",
    "branch": "..."
  },
  "task_version": "...",
  "decision": "ALLOW",
  "evidence": ["..."],
  "expires_at": "...",
  "idempotency_key": "...",
  "effect_ref": "..."
}
```

The field names are not the important part. The important part is that **different facts must not impersonate one another**. “Agent has Git” is not “this push is authorized.” “The agent says the user approved” is not valid approval evidence. `ALLOW` is not proof that the external effect occurred. Tool success is not business acceptance. An idempotency key is not proof of an exactly-once external effect.

That is what a task evidence chain adds beyond a static permission table.

## 9. What the evidence proves—and what it does not

The V1.9.6 engineering evidence supports a bounded set of claims: historical tasks really were mechanically blocked by a new gate; the advisory-versus-hard-gate boundary was corrected; targeted dispatch checks reached 87 / 87; the specified Runtime regression reached 1702 / 1702 after correction; the first Shell pass still contained old semantics; the specified Shell regression reached 936 / 936 after correction; the first controlled live check then found an API-to-UI compatibility gap; and the final correction was followed by another full regression and controlled restart.

That evidence does **not** prove that every Tool Call already has an Execution Authorization Receipt, that every high-risk action has complete call-time authorization, that all approvals have complete principal authentication or cryptographic provenance, that Retry / Resume / Delegation is fully re-authorized, that all external side effects are exactly once, or that CodeFlowMu already has a general Authorization Ledger.

Those remain next-stage engineering work.

Why draw the boundary so explicitly? Because the sequence itself showed us that 87 / 87 could still be followed by a Runtime failure, 1702 / 1702 could still be followed by a Shell problem, and 936 / 936 could still be followed by a live API/UI mismatch.

The useful evidence is therefore not one final number but the chain: **failure → diagnosis → fix → regression → another boundary exposed → another fix → live verification**.

We also do not add 87, 1702, and 936 together and call the sum a system-wide success rate. They belong to different test sets. Each PASS proves only what its own evidence set covers. That follows the same discipline as the authorization model itself:

> **Let each fact prove only what that fact can actually prove.**

## Closing: why recheck execution if tool access already exists?

Tool access answers: **can this agent use this kind of capability in principle?** A concrete execution asks a different question: **why may this capability produce this side effect, against this target, under the current task state, now?**

GitHub MCP gives one answer at the OAuth layer: recheck the current token scopes at the Tool Call, and challenge when they are insufficient. CodeFlowMu is forming a corresponding answer at the task-governance layer: recheck the current task evidence for the current action; do not turn static Tool capability into automatic execution authority.

The authorization layers are different, but both point to the same boundary:

> **Static capability ≠ current execution authorization.**

This CodeFlowMu incident does not prove that we have solved general agent authorization. It made something narrower visible and testable:

> **A reliable Runtime must prevent an agent from doing what it has no authority to do, but it must also prevent its own guardrails from denying an action when those guardrails lack the authority to make that decision.**

The accumulated failures, regressions, and controlled live checks are gradually turning that boundary from a bug report into an execution model that can be studied, tested, and implemented further.

A mature agent Runtime should eventually be able to answer: **who, under which task, is about to perform what action, against which target, on what still-valid authority, why the action is allowed now, and what actually happened afterward.**

So our current formulation is:

> **Capability belongs to the agent; authorization belongs to the specific execution; evidence must travel with the execution.**

## Public evidence

- [**A1 round-by-round verification trace (CSV)**](/evidence/execution-boundary-20260826/v2/case-a1-gate-run-trace.csv)
- [**A1 redacted runtime transcript (GitHub)**](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/v2/transcript-a1.md)
- [**Claim-to-evidence map (GitHub)**](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/v2/claim-evidence-map.csv)
- [**Public, redacted four-case Execution Boundary evidence note (Chinese)**](/zh/digital-employee/2026-08-26-execution-boundary-evidence-data)

## Sources and evidence boundaries

### GitHub MCP Server

- [**GitHub MCP Server: PAT Scope Filtering / OAuth Scope Challenges**](https://github.com/github/github-mcp-server/blob/main/docs/scope-filtering.md)  
  We rely on its explicit separation between startup-time tool filtering and call-time OAuth scope challenges. Under remote OAuth, a concrete Tool Call can re-evaluate the current scope set and request additional authorization only when needed.

- [**GitHub MCP Server: Streamable HTTP Server**](https://github.com/github/github-mcp-server/blob/main/docs/streamable-http.md)  
  HTTP mode supports `--scope-challenge`; insufficient scopes can produce `403 Forbidden` and `WWW-Authenticate` describing the required scopes.

- [**GitHub MCP Server PR #3128 by Sam Morrow**](https://github.com/github/github-mcp-server/pull/3128)  
  Reviewed 2026-08-26. We use it as a further engineering reference: some scope decisions are call-specific and argument-aware, so the same Tool can require different scopes for different targets. It is not treated as the implementation source for CodeFlowMu and does not, by itself, prove a task-level execution authorization model.

### CodeFlowMu

The CodeFlowMu V1.9.6 claims in this article apply only to the version, test sets, and controlled live checks described here.

The public Execution Boundary evidence retains the test-set identities, initial failures, fixes, re-verification sequence, aggregation rules, redacted live observations, and explicit non-claims. The fuller internal engineering record also contains design tasks, Runtime / Shell regressions, governance changes, and operational records; public material is limited to evidence that can be redacted and explained independently.

Raw logs, task bodies, and local machine paths are not public.

This article is not an independent security audit or a proof of general agent authorization. It does not establish call-time authorization coverage for every Tool Call, complete principal authentication or cryptographic provenance, exactly-once external effects, complete Retry / Resume / Delegation coverage, or guarantees about future CodeFlowMu versions.

**Every research conclusion should be read together with the specific version, test set, and evidence that support it.**
