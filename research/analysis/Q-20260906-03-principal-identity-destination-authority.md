---
date: "2026-09-06"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260906-03
column: open-source-engineering
article_type: engineering-insight
project_relevance: none
source_reading: "research/reading/Q-20260906-03-durable-agent-identity-destination-authority.md"
---

# Research Analysis — Stable Principal Identity Does Not Grant Destination or Execution Authority

## Research question

When durable agent state is resumed into a reconstructed or different destination, what must still be revalidated even if the logical agent or workflow identity is stable?

## Research themes and subject kind

- **Themes:** durable agent identity; state continuity; destination trust; execution authority; restore; fork; fail-closed rebinding
- **Subject kinds:** engineering-mechanism; cross-implementation comparison; recovery-boundary; authorization-boundary
- **Samples:** OpenAI Agents SDK stable agent-graph identity and OpenAI Codex managed-worktree destination re-admission

## Research value

### Failure

A durable runtime can correctly answer “which logical agent does this saved state belong to?” and still make an unsafe recovery decision. Stable identity solves an attribution problem; it does not prove that the destination environment is compatible, that its configuration and trust state are acceptable, or that the restored principal is authorized to execute there now.

The inverse failure is also possible. A runtime can validate a destination but silently bind durable state to the wrong logical principal, especially when names are duplicated, session objects are transient, or the expected target no longer exists. Treating restore as one undifferentiated operation hides both classes of error.

### Findings

The same-date Reading examines two first-party implementation samples. In OpenAI Agents SDK commit `4a11d20d126ebc844e362ae3abfe13b775dbaee3`, durable restoration uses stable identity derived from the agent graph, including disambiguation for duplicate names. Transient bound-session objects are excluded from that principal identity, and missing identity-aware targets fail closed rather than silently rebinding to another candidate.

OpenAI Codex commit `f6976ab0369921a59e23416083587149807d8f93` demonstrates a different boundary. Managed-worktree restore/ownership does not rely on source identity alone; it independently evaluates source/destination trust compatibility, destination configuration and state, active or queued disqualifiers, projected developer instructions, permission profile and session facts before ownership is admitted.

Together the samples support a bounded separation: stable principal identity is necessary for correct continuity, but destination compatibility and current execution authority remain independent questions.

### Mechanism

A governed restore path should preserve four independently auditable gates:

1. **Principal Identity** — which logical agent or workflow the durable state belongs to.
2. **State Continuity** — which saved state, lineage and resumable context are valid for that principal.
3. **Destination Compatibility** — whether the target workspace/session/environment is an admissible host for that state and principal under current trust/configuration conditions.
4. **Execution Authority** — what the restored principal is permitted to do in that destination now.

These gates should compose, not substitute for one another:

```text
stable_principal_identity
AND valid_state_continuity
AND destination_compatible_now
AND current_execution_authority
=> resume_admitted
```

A stable identity can make restoration deterministic without making it permissive. Likewise, a trusted destination cannot repair an ambiguous or missing principal mapping. If any required identity-aware target cannot be resolved, the safer result is an explicit incomplete/denied restore rather than silent fallback to a convenient object.

### Implication

Durable digital employees should treat restore and migration as re-admission events. Long-lived identity makes state portable enough to reason about, but crossing a workspace, session or ownership boundary should trigger destination-specific checks. This is especially important when the environment can change independently of the durable state through configuration updates, trust changes, queued work, permissions or instruction scope.

## Evidence claims

### E1 — public-fact

**Claim:** OpenAI Agents SDK commit `4a11d20d126ebc844e362ae3abfe13b775dbaee3` derives stable restoration identity from the agent graph, disambiguates duplicate names, excludes transient bound-session objects from principal identity, and fails closed when an identity-aware target cannot be resolved in the covered path.

**Source:** merged maintainer implementation and tests captured in the same-date Reading Note.

**Strength:** states. **Independent:** false; first-party implementation evidence.

### E2 — public-fact

**Claim:** OpenAI Codex commit `f6976ab0369921a59e23416083587149807d8f93` re-evaluates managed-worktree destination conditions including trust compatibility, configuration/state, active or queued disqualifiers, projected developer instructions, permission profile and session facts before ownership in the covered restore path.

**Source:** merged maintainer implementation and tests captured in the same-date Reading Note.

**Strength:** states. **Independent:** false; first-party implementation evidence.

### E3 — our-observation

**Claim:** The two implementations place recovery checks at different layers but expose the same higher-order distinction: identifying the durable principal does not establish that a particular destination may host or execute it now.

**Source:** cross-implementation comparison of E1–E2.

**Strength:** observed. **Independent:** false.

### E4 — our-interpretation

**Claim:** Governed recovery should expose principal identity, state continuity, destination compatibility and execution authority as separate gate identities, with fail-closed behavior when a required mapping or destination condition cannot be established.

**Source:** bounded synthesis from E1–E3.

**Strength:** supports. **Independent:** false.

## Cross-implementation comparison

| Boundary | Agents SDK sample | Codex sample | Governance consequence |
|---|---|---|---|
| Principal identity | Stable graph-derived identity, including duplicate-name disambiguation | Source work/session identity participates in restore ownership | Durable state needs a stable logical owner |
| Transient state | Bound-session objects are not promoted into durable principal identity | Destination/session facts are re-read as current conditions | Transient runtime objects should not silently become identity authority |
| Missing target | Identity-aware restore fails closed | Disqualifying destination facts prevent ownership | Missing/invalid recovery facts should remain explicit |
| Destination compatibility | Not the primary mechanism demonstrated by this sample | Trust, configuration, state and queued/active conditions are re-evaluated | Stable identity does not authorize a destination |
| Execution authority | Not established by identity mapping alone | Permission/instruction/session facts participate in re-admission | Resume authority is current and destination-sensitive |

## Contradictions and counterarguments

A tightly controlled single-process application may reasonably combine these gates in one restore function. The issue is not implementation modularity but evidence semantics: operators and recovery logic must still be able to distinguish “wrong principal,” “invalid state,” “incompatible destination,” and “not authorized now.”

Stable identifiers can also become stale or collide if their construction is weak. The Agents SDK sample demonstrates one bounded identity mechanism; it does not prove a universal identity scheme. Conversely, destination revalidation can be expensive, but caching it without a freshness rule merely moves the stale-authority problem into recovery.

Both selected samples come from OpenAI-maintained repositories. They are separate implementations, not independent-vendor replication, so the comparison supports a reusable engineering pattern rather than a cross-industry standard.

## Bounded research judgment

The strongest reusable conclusion is: **stable principal identity is a prerequisite for trustworthy durable recovery, but it is not destination authority or execution authority.** A safe resume must separately establish which principal owns the state, whether that state is continuous, whether the current destination is compatible, and what actions are authorized there now.

The selected implementations support this separation in their covered restore paths. They do not establish named human-principal authentication, legal authorization, distributed exactly-once execution, remote side-effect deduplication or a universal portable agent-identity standard.

## General implications

- Give durable state a stable logical principal identity independent of transient session objects.
- Disambiguate duplicate or ambiguous targets explicitly rather than selecting a convenient match.
- Fail closed when identity-aware restore cannot resolve the required principal.
- Re-evaluate destination trust, configuration and ownership conditions at restore or migration boundaries.
- Keep current execution permission separate from state ownership and identity continuity.
- Treat workspace/session/fork transitions as authority-sensitive re-admission points.
- Version or otherwise freshness-bind destination-sensitive authorization evidence when it may outlive the environment state it describes.
- Keep external-effect identity and exactly-once claims separate from successful state reconstruction.

## Limitations and open questions

Both samples are first-party OpenAI implementations and therefore do not provide independent-vendor replication. The evidence is strong for the specific merged code paths and tests examined by Reading, but not for every restoration path in either product. Stable graph identity does not prove human identity, organizational role or legal accountability, and managed-worktree re-admission does not prove containment of external effects.

Open questions include how a portable principal identity should survive model or topology changes, which destination facts belong in a freshness identity, how authority should narrow across fork/migration, how cross-vendor runtimes can exchange durable lineage without sharing execution authority, and what effect evidence is required when a resumed principal continues work whose previous external outcome is uncertain.

## Editorial recommendation

- **Article type:** engineering-insight
- **Selected modules:** research-question; implementation-evidence; comparison; recovery-gates; counterarguments; limitations; open-questions
- **Ending module:** open-questions
- **Project relevance:** none
