---
title: Weekly 008 — Authority Is a Relation, Not an Attribute
date: '2026-09-06'
column: digital-employee
category: weekly
article_type: research-brief
edition: research-center
research_question: 'When an agent is about to act, which facts must be bound together before we can say that this particular action is actually authorized?'
summary: 'Fifteen published Daily Research notes from August 31 through September 6 repeatedly expose the same boundary: installed, approved, trusted, verified, checkpointed, or stable identity are not execution authority that can simply be inherited. A stronger model treats authority as a relation among principal, action, target, occurrence, protocol, policy epoch, and evidence, re-evaluated before consequential execution.'
sources:
  - 2026-08-31 through 2026-09-06 Daily Runtime V5 publications
  - research/intelligence/p2-runs/2026/09/2026-09-06-p2-special.json
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
cover: '/assets/covers/weekly-008-authority-is-a-relation-editorial-v3.webp'
---

<ArticleCover
  image="/assets/covers/weekly-008-authority-is-a-relation-editorial-v3.webp"
  kicker="Weekly Research · 008"
  title="Authority Is a Relation, Not an Attribute"
  summary="Identity, approvals, and state can persist. Execution authority must still hold for this principal, action, target, and occurrence."
  version="W008"
  status="Published 2026-09-06"
  languageHref="/zh/research/weekly/weekly-008"
  languageLabel="中文"
/>

# Weekly 008 — Authority Is a Relation, Not an Attribute

A connector is installed. An agent has a role. A workspace is marked trusted. An approval was recorded. A checkpoint is recoverable. Credential discovery found an endpoint. A stable identity exists.

Each statement can be true. The mistake begins when those truths are silently compressed into one stronger conclusion: *therefore this action may execute now*.

Daily Research from August 31 through September 6 reached the same boundary from standing permissions, working memory, connectors, checkpoints, delegation, OAuth discovery, human approval, recovery, and stable identity: **a descriptive fact about an object is easy to mistake for execution authority over a particular action.**

Weekly 007 concluded that recovery is not restoration; it is re-admission. Reconstructed state has to re-establish current authority, ownership, occurrence identity, and replay integrity before execution resumes. This week shows that the principle is not limited to recovery. The same boundary appears during ordinary installation, connection, delegation, approval, credential resolution, and tool use.

The broader judgment is therefore:

> **Authority is better modelled as a relation than as a static attribute attached to a user, agent, tool, connector, checkpoint, or credential.**

Instead of asking only:

```text
is_admin = true?
connector_installed = true?
approved = true?
trusted = true?
checkpoint_valid = true?
```

a runtime needs to answer a more specific question:

```text
May this principal,
under the current policy epoch,
perform this action,
on this target,
for this occurrence,
through this protocol,
using this current evidence?
```

The second question is much closer to what "authorized" actually means at execution time.

## Evidence scope: seven runtime days, fifteen published studies

This synthesis uses only Daily Research whose Runtime lifecycle closed from **2026-08-31 through 2026-09-06**. All seven days completed Publication. September 1 was a governed zero-output day: Production produced no eligible Publication Candidate, and Publication released nothing rather than manufacturing an article. The other six days produced **15** Research Center studies.

| Date | Digital Employee | Industry Architecture | Open-source Engineering |
|---|---|---|---|
| 8/31 | A standing rule is not this action's authority | A reconstructed role is not proof of authority | A successful rerun does not prove the repair |
| 9/1 | — | — | — |
| 9/2 | Token budget is not working-memory evidence | Installed is not authorized | A smaller skill is not the same skill |
| 9/3 | A checkpoint is not a recovery contract | Delegation is a stateful authorization program | Discovery must not redefine credential authority |
| 9/4 | — | — | Recovery evidence is not replay authority |
| 9/5 | Judgment is not effective approval | — | Passing tests is not operational capability |
| 9/6 | Risk does not choose protocol | Recovery is a trajectory | Stable identity does not authorize destination |

These are not fifteen restatements of one vendor event. They examine human supervision, context reconstruction, connector authority, skill compression, delegation chains, credential discovery, approval, replay, operational capability, and destination binding. The value of the weekly synthesis comes from the recurrence of the same semantic failure across different mechanisms.

## The attribute trap: true facts becoming unauthorized implications

The most dangerous authorization errors do not always look like `allow_all`. They often begin with facts that are individually correct and become wrong only when the system upgrades their meaning during composition.

Consider:

```text
connector is installed
→ agent has connector capability
→ agent may access the target resource
```

The September 2 Industry Architecture study separates those propositions. Administrative availability, configured agent capability, the acting principal or account, target-resource permission, and runtime policy are distinct. A connector appearing in the system proves that an entry point exists. It does not establish that the current principal may perform the requested operation against the current target.

Or consider:

```text
the AI judges that approval is appropriate
→ effective authorization has been granted
```

The September 5 Digital Employee study separates approval assessment from sign-off authority that can actually change target-system state. A model may recommend approval; authority-bearing approval still needs a principal, a scope, and a validity boundary.

Or:

```text
a stable identity has been established
→ that identity may be used against any destination
```

The September 6 Engineering study shows why identity stability only addresses continuity of *who* the subject is. It does not answer what that subject may do to a particular destination. If resource, issuer, audience, or policy context changes, a stable identity does not create a new authorization relation by itself.

Across these examples, the common rule is:

> **Object attributes are inputs to an authority decision; they are not authority itself.**

## Three fact planes should remain separate

A reliable agent runtime benefits from preserving at least three classes of fact rather than flattening them into one status field.

### 1. Descriptive facts

These answer *what exists now*:

- a connector is installed;
- a skill is loaded;
- a checkpoint exists;
- a principal identity has been resolved;
- a workspace has a trust state;
- an approval record exists.

They are important state facts. They are not normally sufficient to drive a consequential action directly.

### 2. Evidence facts

These answer *why the system believes a state or judgment*:

- which issuer established an identity;
- which occurrence produced a checkpoint;
- who issued an approval, when, and for what object;
- which call a tool result belongs to;
- whether recovery evidence comes from the same authoritative history;
- exactly what environment and condition a passing test exercised.

The September 5 Engineering study, "Passing Tests Is Not Operational Capability," is a useful example. Tests can be strong evidence, but only when their coverage boundary is known. A `PASS` label by itself is not a capability fact.

### 3. Authority facts

This is the narrowest and most dynamic plane:

> **Under the current conditions, may this principal perform this action against this target?**

It consumes descriptive and evidentiary facts, but it should not simply copy them.

A useful abstraction is:

```text
Authority = Admit(
  principal,
  action,
  target,
  occurrence,
  protocol,
  policy_epoch,
  evidence
)
```

When a material dimension changes, an old decision should not be silently assumed to remain valid.

## Principal: a role label is not a substitute for authority

The August 31 Industry Architecture study examines context reconstruction. If attacker-controlled or otherwise lower-privilege content is reconstructed into a higher-authority instruction position, a later permission reviewer can reason correctly about risk while reasoning from a corrupted authority premise.

Principal therefore cannot be only a string or role label. A runtime needs to know at least:

- who the current actor is;
- who minted or verified that identity;
- where the current role came from;
- whether it is still valid;
- whether worker replacement, account switching, or delegation occurred.

If a system serializes `role=admin`, reloads it after recovery, and treats the restored string as sufficient authority, it has preserved a descriptive value rather than current authorization.

## Action: one tool does not imply one authorization scope

Standing permission encourages overly coarse action models.

The August 31 Digital Employee study distinguishes user-authored permission policy from occurrence-specific runtime commitment. Reusable rules can reduce repeated prompts, but the study's participant data also shows many category rules preserving an explicit `Ask` boundary. Users themselves often distinguish a standing preference from committing a particular consequential action.

So:

```text
GitHub use is allowed
```

should not naturally expand into:

```text
deleting this repository is allowed
merging this pull request is allowed
writing this branch is allowed
acting for this account on this operation is allowed
```

The runtime needs action semantics fine-grained enough that a tool name does not carry the entire authorization meaning.

## Target: capability entry point and resource authority are different propositions

"Installed Is Not Authorized" on September 2 and "Stable Identity Does Not Authorize Destination" on September 6 approach the same boundary from different sides: **target identity is part of authority.**

Knowing that an agent can call a connector only establishes connector capability. The actual target can be:

- one mailbox;
- one GitHub repository;
- one calendar;
- one internal database;
- one MCP server;
- a specific object inside a resource.

A target change can change the authority relation. Push access to repository A cannot safely be inherited by repository B merely because "GitHub is connected."

## Occurrence: the same task happening again is not the same authorization event

Several recovery studies this week emphasize occurrence identity.

The September 3 checkpoint work separates reconstructing state from identifying the exact execution instance that state belongs to. September 4 goes further: recovery evidence does not automatically become replay authority. If a previous tool call may already have happened, if the effect is unknown, or if an approval covered only a particular interruption point, a new worker cannot replay simply because it can read the old state.

The authority relation therefore needs a way to identify the concrete occurrence, for example:

```text
workflow_id
+ branch_id
+ occurrence_id
```

or an equivalent composite identity.

That lets the runtime ask whether an approval authorized an action class in general or only one still-unexecuted occurrence.

## Protocol: risk magnitude should not choose authorization protocol by itself

The September 6 Digital Employee research establishes another subtle boundary: risk scores can influence review intensity without being sufficient to select the protocol.

The same high-consequence operation may require different mechanisms in different environments:

- a runtime prompt;
- human approval;
- OAuth or delegated consent;
- a host-minted capability;
- two-person control;
- or complete prohibition.

Protocol choice should depend on authority context, action type, target, policy, and available system mechanism. A risk score alone should not map directly to "auto-allow" or "auto-deny."

This also explains the September 3 Engineering conclusion that discovery must not redefine credential authority. Discovery may tell a client where authorization services are located. It should not allow a redirect, metadata path, or lower-trust discovery input to redefine who the authoritative issuer is.

## Policy epoch: old allow decisions need an invalidation story

Permissions can be revoked. Workspace trust can change. Resource ACLs can change. Accounts can switch. In such systems, a permanent `approved=true` is almost certainly too weak a representation.

An authority relation needs a policy epoch or equivalent version identity so the runtime can answer:

```text
Does this old allow decision
still belong to the current policy world?
```

This extends Weekly 007's re-admission argument beyond crash recovery. Even when there is no failure or resume event, a material change in authority context should force a new evaluation of any decision that depended on the old context.

## Recovery is a trajectory, not a snapshot

The September 6 Industry Architecture study adds time to the relation model. Recovery is not a jump from one static state to another. It is a trajectory with multiple transition points:

```text
state loaded
→ evidence reconciled
→ old ownership closed
→ authority refreshed
→ occurrence rebound
→ capability materialized
→ action resumed
```

Authority is not a token pulled out of a checkpoint at the beginning of that sequence. Its value can differ at different transition points.

That is why the September 4 Engineering study separates recovery evidence from replay authority. The system may know what happened before and still lack permission to do it again now.

A stricter recovery model is therefore not:

```text
checkpoint.valid == true
→ resume
```

but:

```text
reconstruct
→ reconcile facts
→ close or transfer ownership
→ re-evaluate authority relation
→ materialize capability
→ resume bounded occurrence
```

## Convenient proxies do not automatically preserve governed meaning

Three studies this week are not primarily about authorization, yet they strengthen the same relation-oriented reasoning.

### Token budget is not working-memory evidence

The September 2 Digital Employee study finds that equal token budgets do not imply equal delivered context or equal memory-management cost. A convenient measurable proxy cannot simply replace the proposition the system actually needs to govern.

### A smaller skill is not the same skill

The same day's Engineering study finds that skill compression can break routing or public callable-entry contracts. Shorter text is not sufficient evidence of semantic equivalence. Equivalence has to be checked at the relation boundary where the capability is invoked.

### Passing tests is not operational capability

The September 5 Engineering study makes the parallel explicit for testing. A passing test has to remain bound to environment, entry point, dependencies, and execution conditions. Otherwise `PASS` becomes another incomplete evidence attribute.

All three have the same structure as authority: **do not upgrade an easy-to-store, easy-to-display, easy-to-compute attribute into the stronger governed proposition it merely proxies.**

## An implementable abstraction: the Authority Relation Envelope

The week's evidence can be compressed into a more useful minimum record than `approved=true`:

```text
AuthorityRelationEnvelope
├─ principal
│  ├─ subject_id
│  ├─ issuer / account
│  └─ delegated_from
├─ action
│  ├─ capability
│  └─ operation
├─ target
│  ├─ resource_id
│  └─ destination / audience
├─ occurrence
│  ├─ workflow_id
│  ├─ branch_id
│  └─ occurrence_id
├─ protocol
│  ├─ approval_type
│  └─ credential / capability path
├─ policy
│  ├─ policy_epoch
│  └─ trust context
├─ evidence
│  ├─ source refs
│  ├─ decision refs
│  └─ verification refs
└─ result
   ├─ admitted / denied / paused
   ├─ issued_at
   └─ expires / invalidation rule
```

This is not an argument that every low-risk action needs a large JSON record. It identifies dimensions that should not be collapsed architecturally into one Boolean. Implementations can cache, index, compress, or derive them as long as relation identity and invalidation conditions remain recoverable.

## Dynamic authority does not mean asking a human on every call

Treating authority as a relation does not require turning an agent system into an approval-dialog factory.

If a class of operation preserves:

- the same principal;
- the same action scope;
- a bounded target set;
- the same policy epoch;
- a protocol that explicitly permits reuse;
- occurrence reuse that matches the contract;
- and a grant that has not expired or been revoked;

then the runtime can reuse a bounded authority relation without prompting again.

The important distinction is:

> **What gets reused should be a scoped relation with identity and invalidation rules, not a context-free `approved=true`.**

## What the evidence does not establish yet

The week's evidence supports the relation model as an engineering abstraction. It does **not** establish one universal authorization protocol for all agent systems.

Open questions include:

- how fine-grained action identity should be at different risk levels;
- which authority relations can be cached safely, and for how long;
- how to compress principal chains in deep multi-agent delegation without losing constraints;
- how much protocol should be shared across external SaaS, MCP, local tools, and native apps;
- the minimum interoperable representation of policy epoch, occurrence identity, and target identity.

The September 2 connector study itself did not find evidence for a universal end-to-end authorization protocol. The relation model is a claim about **which semantics should be preserved**, not a claim that one standard implementation already exists.

## P2: one special study triggered, but it is not imported into the public argument

This week's P2 lane resolved **6/6** due objects. `yzhao062/pyod` `v3.6.5` showed a material benchmark/evaluation change relative to the previous monthly checkpoint, scored 9/10, and therefore triggered the one full P2 Special Study permitted for this run. The internal result is an `Experiment Candidate`.

That study is still a **Pending Review** internal research asset. Under the P2 publication boundary, completion of Weekly does not turn it into a public article, and its internal mechanism result is not used as public evidence for the Authority Relation thesis above. It is reported here only as workflow state: P2 found a benchmark-validity question worth a bounded experiment; public promotion would require a separate review and the normal reading, analysis, evidence, writing, and editing gates.

Aegis and agent-style changed during the interval but not in the mechanisms declared by their P2 triggers. agent-audit, cs-paper-checklist, and anomaly-detection-resources showed no material checkpoint change.

## Four useful tests for next week

The relation model is now specific enough to be falsifiable rather than rhetorical.

First, test an **authority cache**. Cache a grant that binds principal, action, target, and policy epoch. Change target, account, and policy epoch separately. Verify that materially changed relations invalidate the old grant while unchanged relations can still reuse it safely.

Second, test **delegation composition**. Delegate through three agent layers and verify that each step can only preserve or narrow action and target scope, while cumulative constraints remain traceable to the root objective.

Third, test a **recovery transition**. Interrupt once before a tool call, once after effect commit but before the response arrives, and once while human approval is pending. Verify that recovery distinguishes "restore context," "reconcile authoritative history first," and "wait for new authorization" as different relation states.

Fourth, test **protocol selection**. Hold the action constant while varying target, risk, credential path, and policy context. Verify that risk changes review intensity but does not by itself choose the authorization protocol.

If those tests show that a simple object-level flag preserves the same safety semantics across all of these changes, the relation model should be narrowed. If failures cluster where relation dimensions are lost or reused incorrectly, the abstraction gains stronger engineering support.

## Conclusion

Recent Weekly research has repeatedly separated concepts that look similar but carry different authority: state is not permission; evidence is not authorization; recovery is not restoration; lineage is not current admission.

This week compresses those separations into a more general design principle:

> **Authority is not a permanent property describing what an object possesses. It is a relational judgment about whether this principal may perform this action against this target under the current conditions.**

Identity, connector state, checkpoints, approvals, trust, test results, and risk scores can all provide evidence or inputs to that relation. None should substitute for the relation by itself.

For long-lived agents, digital employees, and multi-agent runtimes, the distinction determines whether the system merely remembers what was allowed sometime in the past—or can answer the harder question immediately before action: *is this principal still allowed to do this thing, here, now?*
