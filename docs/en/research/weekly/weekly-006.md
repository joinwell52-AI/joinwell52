---
title: Weekly 006 — Authority Needs Lineage
date: '2026-08-23'
column: digital-employee
category: weekly
article_type: research-brief
edition: research-center
research_question: 'When agent state survives compaction, resume, delegation, caching, normalization, or reconstruction, what evidence must survive with it so the system can still know what is authorized?'
summary: 'Twenty-one evidence-validated Daily Research notes show a recurring failure mode: values often survive transformations while their authority does not. Reliable agent runtimes need provenance-preserving admission, where origin, scope, policy context and transformation lineage travel with operational state and are revalidated at the point of use.'
sources:
  - 2026-08-17 through 2026-08-23 Daily Runtime V5 publications
  - research/intelligence/p2-runs/2026/08/2026-08-23-p2-special.json
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
cover: '/assets/covers/weekly-006-authority-needs-lineage-cover.svg'
---

<ArticleCover
  image="/assets/covers/weekly-006-authority-needs-lineage-cover.svg"
  kicker="Weekly Research · 006"
  title="Authority Needs Lineage"
  summary="State can survive transformation without carrying the authority that once made it valid."
  version="W006"
  status="Published 2026-08-23"
  languageHref="/zh/research/weekly/weekly-006"
  languageLabel="简体中文"
/>

# Weekly 006 — Authority Needs Lineage

Last week’s synthesis argued that every consequential handoff needs an evidence-bearing receipt. This week’s 21 evidence-validated Daily Research notes expose the next problem: **the state may arrive safely and still become unsafe after it is transformed**.

Agent runtimes compact transcripts, reconstruct history, resume checkpoints, refresh credentials, merge policies, cache plugins, normalize identifiers, import tool output, inherit environment state, and delegate work. These operations are useful precisely because they preserve continuity. But continuity creates a dangerous illusion: if a value still exists, it can look as though the reason it was once trusted still exists too.

The week repeatedly shows that this is false.

A command name can survive while repository configuration changes what the command will execute. A human approval can survive while the approving principal is lost. A child-agent role can survive resume while its effective authority accidentally expands. A refreshed OAuth token can exist in memory while durable persistence failed. A cached absence can survive while the underlying resource was never actually deleted. A recent checkpoint can survive while the policy that grants execution authority has changed. A canonicalized identifier can survive while lifecycle operations are still racing on non-canonical aliases.

The mechanisms differ, but the control failure is the same:

> **A surviving value is not a surviving authority claim.**

The new weekly judgment is therefore:

> **Reliable agent systems need provenance-preserving admission. Operational state should carry not only a value, but also the origin, scope, policy context, transformation history and current admission evidence that make the value safe to use. Transformations may preserve or narrow authority; they must not silently strengthen it.**

## Evidence scope

This synthesis uses only Daily Research released from **2026-08-17 through 2026-08-23** after the full V5 publication chain reached a verified terminal state. All seven Daily Runtime records reached `publication = Completed`, yielding **21 formal Daily Research notes** across Digital Employee, Industry Architecture and Open-source Engineering.

| Date | Digital Employee | Industry Architecture | Open-source Engineering |
|---|---|---|---|
| Aug 17 | Selective fail-closed API | Environment-owned policy | Compact transcript evidence |
| Aug 18 | Accountable human approval | Persistence and reconciliation | Trace-to-effect evidence |
| Aug 19 | Monotonic delegation authority | Delivery-context separation | OAuth refresh split commit |
| Aug 20 | Command name is not execution authority | History is not a transfer contract | Visible is not durable |
| Aug 21 | Useful context is not memory authority | Approval must name the approver | Trust the run, not inherited secrets |
| Aug 22 | Authorization needs provenance | Protected constraints, reviewable grants | Missing cache entry is not deletion evidence |
| Aug 23 | Resume recency is not authority | Creation provenance survives resume | Canonicalize before lifecycle |

This is an engineering sample, not a claim about universal market practice. The value of the week is the recurrence of one boundary across independently selected mechanisms.

The P2 lane separately checked the four `biweekly-or-release` objects due this Sunday. All four reached terminal checks, two monthly objects were not due, and no due object reached the trigger score of 5. No full P2 Special Study ran. One useful governance correction emerged: the `agent-style` checkpoint stored on Aug 16 lagged a README clarification commit that had already existed before that run, so the current check corrected checkpoint identity without misreporting the old commit as a new weekly change.

## The recurring failure: provenance gets dropped during transformation

Last week focused on a boundary between owners. This week shows the same danger inside one owner’s state-processing pipeline.

A runtime can receive a valid fact and then accidentally detach it from the conditions that gave it meaning.

### A name is not the behavior it currently resolves to

The Aug 20 Digital Employee note studied a deceptively simple case: a command can have a familiar, apparently safe name while repository configuration changes the execution that name resolves to.

That means a policy keyed only by command label is weaker than it appears. The label is an identifier; the actual execution authority depends on the resolved command, configuration source, working context and applicable approval policy.

The more general form is:

```text
stable label
+ changed resolution context
≠ stable authority
```

This pattern reappears in plugin aliases, tool names, model routing labels, saved workflow names and remote session identifiers. A stable key helps correlation, but policy should bind to the effective operation, not merely its familiar name.

### A human answer is not a human authority proof

The Aug 18 and Aug 21 notes converge from different directions.

One shows why a remote A2A peer must not satisfy a human-confirmation boundary for a dangerous action. The other shows why approval trust must bind to the actual approving principal rather than transport metadata.

A string such as `approved`, a callback marked `human`, or a message delivered through a trusted channel can preserve the response while losing the authority evidence behind it.

A safer approval record needs to preserve at least:

```text
occurrence_id
approver_principal
authority_scope
policy_version
decision
source_provenance
```

The principle is not that every approval needs heavy identity infrastructure. It is that the runtime must not silently infer approver authority from message shape or transport path.

### Delegation must be monotonic under resume and customization

The Aug 19 Digital Employee note studied child-agent role customization and resume. The key invariant is monotonicity: delegation may narrow or preserve authority, but a representation change should not expand it.

This is especially important after checkpoint restore. A resumed child agent can reconstruct role labels, tools, context and pending work. If the effective permission envelope is rebuilt from incomplete or stale fields, the resumed representation may become more permissive than the original execution.

A useful invariant is:

```text
Authority(after transform) ⊆ Authority(before transform)
```

unless a fresh, explicit grant is admitted.

That single rule connects role customization, policy merging, saved approvals, connector capability reconstruction and remote-session resume.

## Continuity mechanisms need an admission boundary

A recurring engineering mistake is to treat persistence as the final correctness property.

This week’s evidence says persistence solves only one question: **did the value survive?** It does not answer **should the value still be used?**

### Refresh success is not durable credential state

The Aug 19 engineering note examined OAuth refresh as a split commit.

A provider can issue refreshed credentials successfully while local durable persistence fails. At that moment, memory contains a valid new token but the durable store still contains the old state. If the failure is hidden, later workers can resume from a credential state that never matched the successful refresh event.

The correct boundary is explicit:

```text
provider refresh accepted
≠ credential state durably committed
```

A fail-visible design records the split rather than pretending the refresh transaction was atomic.

This pattern generalizes to approval persistence, checkpoint writes, session rebinding, artifact publication and tool-result caching.

### Visible is not durable

The Aug 20 engineering note reaches the same point through artifact publication. Pending-state isolation followed by an atomic rename prevents consumers from observing a partially published version as though it were authoritative.

The important insight is broader than filesystem rename:

> **Visibility is a weaker fact than durable admission.**

A value may be readable while still provisional. A UI may display a task while its authoritative record is not committed. A remote object may be discoverable while reconciliation has not confirmed ownership. A model output may be available while it has not crossed an evidence gate.

Systems benefit from explicit states such as `pending`, `admitted`, `committed`, `verified`, and `superseded` rather than one overloaded “exists” flag.

### Recency is not authority

The Aug 23 Digital Employee note sharpens this problem for resume.

A recent checkpoint can be operationally useful because it reduces reconstruction work. But “latest” is an ordering fact, not a permission fact. The newest snapshot can still contain stale grants, revoked assumptions, old principal bindings, or state created under an obsolete policy epoch.

Therefore resume should ask two separate questions:

```text
Which state is newest?
Which state is currently admissible?
```

A runtime that answers only the first is fast but not governed.

## Information can be useful without being authorized state

Several notes this week separate informational usefulness from operational authority.

### External tool output is not reusable memory by default

The Aug 21 Digital Employee note distinguishes standalone external tool output from reusable agent memory.

Tool output can be valuable context. But promoting it into memory changes its lifecycle: it may be replayed later, surfaced to different tasks, or treated as durable background truth.

That promotion should therefore be an admission operation with provenance, scope and expiry—not an automatic consequence of the tool returning a value.

A useful context item can remain useful without becoming long-lived authority.

### History is not a transfer contract

The Aug 20 Industry Architecture note studies history reconstruction across agents. Replaying prior interaction history can restore context, but credential-bearing control calls should be scrubbed rather than transferred as ordinary conversational state.

This is a crucial distinction:

```text
replayable history
≠ transferable capability
```

The fact that a prior worker used a token, connector grant, approval or control instruction does not make that capability part of the receiving worker’s transferable context.

The same principle applies to shell environment variables, API secrets, temporary approval tokens and provider session cookies.

### Delivery and model context are different stores

The Aug 19 Industry Architecture note separates asynchronous user delivery from model input context while retaining replayable delivery metadata.

This is another provenance boundary. A message can be important for delivery audit without belonging in future model context. Conversely, model context may contain reasoning state that should never be exposed as user-delivery history.

Separating these stores reduces accidental authority propagation because “was delivered” no longer implies “should condition future execution.”

## Absence, cache state and canonical identity need stronger semantics

Not all dangerous transformations add data. Some remove or normalize it.

### Missing is not deleted

The Aug 22 engineering note examines plugin-cache reconciliation with account scoping, serialization and generation guards.

The key negative fact is simple: a missing cache entry does not prove the underlying plugin was deleted. The cache may be stale, incomplete, generated from another account, or overwritten by an older reconciliation generation.

This is the negative-evidence form of the week’s thesis:

> **Absence without provenance is not authoritative absence.**

Deletion, revocation and non-existence are consequential claims. They often need an authoritative source read, tombstone, generation number or reconciled snapshot rather than inference from a local miss.

### Canonicalize before lifecycle operations

The Aug 23 engineering note shows why logically equivalent identifiers should be canonicalized before lifecycle operations race on them.

Without canonicalization, two aliases can create two apparent ownership paths for one underlying resource. Locks, cleanup, restart, cache keys and deduplication can then operate on representation rather than identity.

Canonicalization is therefore not cosmetic normalization. It is an admission step that decides which identity participates in the lifecycle.

But canonicalization alone is not enough: the canonical identity still needs provenance, scope and current policy.

## A reusable model: Provenance-Preserving Admission

The week supports a compact control model.

Every operational fact can be represented as:

```text
OperationalFact = {
  value,
  origin,
  principal,
  scope,
  policy_epoch,
  occurrence_id,
  transform_lineage,
  durability_state,
  verification_state
}
```

Not every system needs every field literally. The point is semantic: the runtime should know not just *what* the current value is, but *why it is allowed to mean what the next component thinks it means*.

A transformation then has a governed shape:

```text
input fact
→ transform
→ preserve provenance
→ narrow or preserve scope
→ revalidate policy-sensitive fields
→ admit output fact
```

The dangerous alternative is:

```text
input value
→ transform
→ output value
→ assume old authority still applies
```

This model gives a practical interpretation to several mechanisms from the week:

- selective fail-closed parsing protects against silent policy-field loss;
- environment-owned variable policy preserves where execution context came from;
- compact transcript presentation preserves full evidence behind the compact view;
- named approver identity preserves who granted authority;
- monotonic delegation prevents transformation from expanding scope;
- split-commit visibility preserves the difference between issued and persisted credentials;
- atomic publication preserves the difference between visible and admitted artifacts;
- memory admission preserves the difference between useful context and durable background state;
- generation-guarded cache reconciliation preserves snapshot provenance;
- resume re-admission preserves the difference between newest state and currently valid state;
- canonicalization preserves one lifecycle identity before concurrency begins.

## What changed relative to last week

Weekly 005 proposed evidence-bearing handoff receipts at ownership boundaries. Weekly 006 does not replace that model; it moves the same requirement inside the state machine.

A handoff receipt answers:

> What fact and authority crossed from one owner to another?

Provenance-preserving admission answers:

> After the receiver transformed, cached, compacted, resumed or reconstructed that fact, what authority is still valid now?

Together they imply a stronger invariant:

```text
Authority must be traceable across both transfer and transformation.
```

A system can have excellent inter-service receipts and still fail if local resume code drops policy epoch. It can have perfect checkpoint lineage and still fail if a remote handoff does not identify the approving principal. Reliable long-running agents need both.

## Tensions this model does not eliminate

### Full lineage versus operational cost

Recording every transformation can become expensive and unreadable. The goal should not be universal event sourcing by default.

Systems need a risk-based rule: preserve strong lineage for facts that affect execution authority, external side effects, durable memory, credentials, identity and policy; use lighter telemetry for ordinary informational transformations.

### Revalidation versus availability

Fresh authorization checks can fail during network partitions or provider outages. Fail-closed behavior is appropriate for consequential authority, but not every read-only operation needs the same standard.

The challenge is to declare which facts require fresh admission and which may safely use bounded cached evidence.

### Canonical identity versus evolving systems

Canonicalization assumes a stable mapping. Real systems rename resources, migrate accounts and merge identities.

The canonical identity therefore needs versioned mapping evidence rather than an eternal string.

### Monotonic authority versus legitimate escalation

Sometimes authority really must expand: a human grants an exception, an administrator unlocks a tool, or a workflow enters a privileged phase.

The rule is not “authority can never increase.” It is “authority cannot increase merely because representation changed.” Expansion needs a new explicit grant with its own provenance.

## Predictions

These are Research Center interpretations from the recurring evidence, not claims made by any single Daily source.

1. **Resume protocols will increasingly expose policy epochs.** A checkpoint ID alone will be insufficient for governed recovery.
2. **Approval records will become principal-bound artifacts.** Systems will distinguish the text of a decision from evidence of who was allowed to make it.
3. **Agent memory will gain explicit admission metadata.** Tool output and delivery history will no longer be promoted automatically into durable memory in higher-assurance runtimes.
4. **Credential refresh APIs will expose split-commit states.** “Refreshed but not persisted” will become a first-class recoverable condition.
5. **Caches will carry generation and authority provenance.** A cache miss will be treated as uncertainty unless the cache is known to be an authoritative complete snapshot.
6. **Canonical identity will move earlier in lifecycle control.** Locking, deduplication and ownership will increasingly operate on canonical resource identity rather than user-facing aliases.
7. **Compact audit views will retain links to full evidence.** Human-readable summaries will not be accepted as substitutes for replayable underlying traces.

## Open questions

- What is the minimal provenance envelope worth standardizing across agents, tools and connectors?
- Which policy changes should invalidate previously admitted state during resume?
- How should a runtime prove that authority narrowed monotonically through a sequence of transforms?
- When is a local cache complete enough that absence can become authoritative negative evidence?
- How long should approval provenance remain reusable, and what revokes it?
- Can canonical identity remain stable across account migration, provider rebinding and resource rename?
- Which state transformations deserve durable lineage and which are safe to keep as transient telemetry?
- How should a runtime represent “valid value, invalid authority” without throwing away useful context?

## Next-week research priorities

Three concrete tests would sharpen this model.

**First, test resume under policy change.** Create a checkpoint under policy epoch A, revoke or narrow the relevant authority, then resume under epoch B. The acceptance criterion is that useful state survives while obsolete authority does not.

**Second, test provenance through compaction.** Compact an execution transcript and require the compact representation to retain resolvable evidence for every authority-sensitive claim. The test should fail if the summary becomes the only surviving evidence.

**Third, test authoritative negative evidence.** Remove a resource from a local cache without deleting it at the source of truth. The runtime should report uncertainty or stale cache state, not authoritative deletion.

The direction is now clearer than a generic call for “more audit logs.” Long-running agent systems need **typed trust continuity**.

A value can be current but unauthorized. A message can be human-shaped but not human-authorized. A token can be valid but not durably committed. A cache can be empty but not authoritative. A checkpoint can be recent but inadmissible. An identifier can be stable but non-canonical.

**Authority needs lineage because persistence preserves data more easily than it preserves the reasons that made the data safe to act on.**
