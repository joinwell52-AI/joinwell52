---
date: "2026-09-12"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260912-02
column: industry-architecture
article_type: comparative-study
project_relevance: none
source_reading: "research/reading/Q-20260912-02-authority-precedence-long-lived-agent-systems.md"
---

# Research Analysis — Continuity Does Not Decide Which Authority Wins

## Research question

When current policy or runtime identity conflicts with state retained by a long-lived agent session, which source should be authoritative for the next effect, where should the precedence rule be enforced, and which safe controls must remain usable after positive work is rejected?

## Research themes and subject kind

- Research themes: authority precedence; long-lived session state; call-time revalidation; transport identity; sandbox isolation; fail-closed policy; safe negative controls.
- Subject kinds: `cross-sample-comparison`, `architecture-mechanism`, `governance-problem`, `failure-mode`.
- Samples: Codex managed-provider revalidation, MCP TypeScript SDK transport-header precedence and Gemini CLI runtime-state isolation.

The research subject survives removal of all vendor names: **continuity state may remain internally valid while losing authority to govern the next action**.

## Evidence identities

### E1 — reproducible engineering evidence

**Claim:** The Codex change loads current managed provider requirements independently of user, project, system-default and retained thread configuration, then compares provider selection and definition before selected model-driving or state-changing operations.

**Source:** same-date source-complete Reading Note based on commit 39d193d72d7959d798642bd3e1496bb8865033b1.

**Strength:** implemented and test-backed call-time revalidation for the enumerated app-server paths. **Independent:** false.

### E2 — reproducible engineering evidence

**Claim:** Codex rejects provider mismatch and managed-requirement loading/parsing failure before the protected request mutates queue or goal state, while keeping interrupt, realtime stop and goal pause/clear available. Realtime routing is outside the check.

**Strength:** direct source and test evidence for bounded fail-closed behavior plus preserved negative controls. **Independent:** false.

### E3 — reproducible engineering evidence

**Claim:** The MCP TypeScript SDK now initializes Fetch `Headers` from caller input and then uses case-insensitive `set` for transport-managed Authorization, protocol version and Streamable HTTP session ID. Once the provider has a token, runtime-derived Authorization replaces stale caller Authorization; before that transition, a configured value remains usable.

**Source:** same-date Reading Note based on commit b65426158ed9f29aea8ef3dc09ca22d7d9d6f970.

**Strength:** implemented and test-backed precedence rule over all supported `HeadersInit` forms and case variants. **Independent:** false.

### E4 — reproducible engineering evidence

**Claim:** Gemini CLI's sandbox profiles and host-path checks deny access to credential, account, trust, policy-integrity and environment-secret state, sanitize hooks and API-key settings, and allow user-global commands while excluding project/extension commands in untrusted folders.

**Source:** same-date Reading Note based on commit 9c1b0a610534d6f8120964cf2672c07807d8fc90.

**Strength:** implemented and test-backed isolation behavior within the covered sandbox and path-resolution model. **Independent:** false.

### E5 — our interpretation

**Claim:** The three implementations form an authority-precedence pattern with different operators: revalidate retained state against current policy, replace lower-authority fields with current runtime identity, or isolate the authority store from the lower-trust substrate.

**Source:** bounded cross-sample synthesis of E1–E4.

**Strength:** supports. **Independent:** false.

### E6 — our interpretation

**Claim:** A safe precedence rule needs an operation taxonomy. Positive work may be blocked while stop, pause, clear, rollback or unrelated data fields remain available; a single indiscriminate rejection switch can make recovery less safe.

**Source:** Codex's preserved negative controls, MCP's preservation of unrelated headers/fallback phase and Gemini's preserved user-owned commands.

**Strength:** supports as an architecture inference, not a measured universal result. **Independent:** false.

## Failure / Finding / Mechanism / Implication

### Failures

1. **Startup authorization decay:** a session admitted earlier continues to act after managed policy changes.
2. **Retained-state sovereignty:** the system assumes that because a thread or header is still present and validly encoded, it remains authoritative.
3. **Dual authority:** caller and runtime each supply an identity-bearing field without a deterministic owner.
4. **Case-normalization ambiguity:** syntactically different header keys survive a merge and become one malformed multi-value credential.
5. **Workspace-to-control escalation:** project-controlled content can read or rewrite credentials, trust decisions or policy-integrity state.
6. **Fail-open refresh:** unavailable current policy is interpreted as permission to use retained state.
7. **Reject-after-mutation:** the system detects conflict only after queue, goal or external state has changed.
8. **Recovery lockout:** policy mismatch disables the stop or rollback operations needed to reduce risk.
9. **Freshness-by-timestamp:** the newest value wins even when it is not the responsible authority source.

### Findings

The central finding is that **continuity and authority are orthogonal**. A long-lived system needs retained state to avoid reconstructing every session, but retention cannot determine whether that state still governs a new effect.

The samples reveal three distinct ways to encode precedence:

- **revalidation** compares retained state with a current external authority before selected actions;
- **replacement** assigns ownership of named request fields and overwrites lower-authority values once current runtime identity exists;
- **isolation** prevents a lower-trust execution substrate from observing or mutating the state used to make authority decisions.

These operators should not be collapsed. Revalidation is needed when retained values remain useful but may be invalidated. Replacement is appropriate when exactly one value may control a request field. Isolation is appropriate when exposure itself would let the less-trusted domain alter future authority.

A second finding is that fail-closed behavior must be action-sensitive. Codex preserves controls that stop or reduce work; MCP preserves unrelated caller fields and a pre-token fallback phase; Gemini preserves user-owned commands while rejecting untrusted project and extension commands. Safety is not “everything stops.” It is “effects that require current authority do not proceed, while bounded negative controls remain usable.”

### Mechanism

A governed long-lived runtime should declare an **authority-precedence table** for each effect-bearing operation:

- retained state and its identity;
- current authority source and version;
- refresh point;
- comparison or replacement rule;
- behavior when current authority is unavailable;
- mutation point that must not be crossed before the check;
- negative controls allowed after rejection;
- recovery and user-facing remediation;
- evidence proving which rule and source were applied.

This can be represented as three boundaries:

1. **Session boundary:** what may be retained for continuity.
2. **Authority boundary:** which source can invalidate, replace or protect that state.
3. **Effect boundary:** the last point at which conflict can stop mutation.

The rules should bind to an operation class. A provider requirement may govern model-driving actions but not interrupt. An OAuth provider may own Authorization without owning every request header. A sandbox may read business workspace files while being denied control-plane state.

### Implication

For digital-employee platforms, **“current authority wins” must be implemented as a declared ownership and enforcement contract, not as an informal preference for newer data**. The responsible authority may be a managed-policy service, authenticated transport, approval registry or protected host store. What matters is that the runtime names it, refreshes it at a relevant boundary and can prove that stale state did not mutate business state first.

Long-lived agents should therefore preserve continuity without granting continuity state permanent sovereignty.

## Comparisons and contradictions

Codex and MCP both resolve conflicts at call time, but Codex compares a retained session route with an external managed requirement and rejects the operation, whereas MCP overwrites a lower-authority request field with a current provider-derived value. Gemini acts earlier by shrinking the sandbox's visibility and mutation surface.

The comparison contradicts a universal “reload everything” remedy. Codex intentionally does not reload ordinary user and project configuration to invalidate existing threads; it isolates managed requirements as the authority source. MCP does not discard every caller header; it overwrites only transport-managed names. Gemini does not disable all commands in an untrusted folder; it distinguishes user-global commands from project/extension commands.

It also contradicts “latest wins.” A newly written workspace value must not outrank protected host trust state, while an older static Authorization can remain legitimate during the phase before an OAuth provider obtains a token. Authority depends on ownership and state transition, not timestamp alone.

## Bounded research judgment

**A long-lived agent runtime should retain session state for continuity but re-establish authority precedence for each effect-bearing operation. The responsible current source must be named, refreshed or protected at the relevant boundary, and allowed to reject or replace stale state before mutation; safe stop and recovery controls should remain available under a separate negative-control policy.**

The three operator patterns are complementary:

- use **revalidation** when retained state is still the execution input but current policy may invalidate it;
- use **replacement** when one authoritative runtime value must own a request field;
- use **isolation** when lower-trust code should never access the authority substrate.

A mature system may need all three, but their threat assumptions and failure modes should remain separately testable.

## General implications

For governed agent systems:

- assign a single authoritative source to every identity-, policy- and scope-bearing field;
- version retained state and current requirements independently;
- revalidate before model-driving, state-changing or externally visible operations;
- place checks before queue, goal, artifact or external mutation;
- fail closed when the responsible policy source cannot be established;
- preserve interrupt, stop, pause, clear, rollback and other risk-reducing controls;
- avoid generic merges for authority-bearing fields;
- isolate credentials, trust and policy-integrity stores from business workspaces;
- test transitions, not only steady state: before and after token acquisition, before and after policy change, trusted and untrusted workspace;
- record rejection as an explicit non-effect rather than silently continuing or claiming completion.

## Limitations and counterarguments

All three samples are first-party merged repository evidence. They show code and tests, not independent production outcomes, comparative incident rates or complete adversarial evaluation.

Their layers differ. Provider-route compliance is not the same as HTTP authentication, and neither is equivalent to filesystem sandboxing. A shared authority-precedence abstraction must not erase product-specific operations and threat models.

Fail-closed refresh can reduce availability when a policy service is unavailable. Systems may use signed or versioned caches, but the cache's validity and expiry must themselves be part of the authority contract. Preserving negative controls also requires careful classification so an apparently harmless control cannot initiate new work indirectly.

Sandbox denial depends on host enforcement and correct path resolution. Transport header replacement does not prove that servers authorize the token correctly. Enumerated Codex call-site coverage does not prove no other effect path bypasses the check.

## Open questions

1. How should call-site completeness be proved as new operations are added?
2. Which policy updates invalidate in-flight work versus only the next effect?
3. What signed cache contract preserves availability without turning stale policy into permanent authority?
4. Can negative controls be specified monotonically so they reduce activity but never create new work?
5. How should authority ownership compose across session, transport, tool server and external target?
6. Which state should be isolated completely, and which must be visible to planning as evidence?
7. How should user remediation restart or migrate a thread without losing unrelated valid work?
8. What telemetry can measure false rejection and stale-authority prevention without exposing secrets?

## Editorial recommendation

- **Article type:** comparative-study
- **Selected modules:** research-question; continuity-authority-conflict; three-precedence-operators; retained-session-revalidation; runtime-header-ownership; control-state-isolation; negative-control-policy; comparison-and-non-equivalence; transition-testing; availability-counterargument; limitations; open-questions
- **Core proposition:** continuity state may remain useful without remaining sovereign; each effect-bearing operation needs an explicit current authority owner, a deterministic precedence operator and preserved safe controls before mutation
- **Project relevance:** none
