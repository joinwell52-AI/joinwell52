---
date: "2026-09-03"
status: ReadyForProduction
production_input_authorized: true
queue_item: Q-20260903-02
column: industry-architecture
article_type: technical-analysis
project_relevance: none
source_reading: "research/reading/Q-20260903-02-principal-chain-composition-authorization.md"
---

# Research Analysis — Delegation Is a Stateful Authorization Program

## Research question

How should an enterprise multi-agent runtime constrain delegated authority when a harmful outcome can emerge from multiple individually permitted calls across a principal chain?

## Research themes and subject kind

- **Themes:** delegation authority; call-time authorization; composition closure; external policy enforcement
- **Subject kinds:** architecture-mechanism; governance-problem; research-finding; benchmark-result
- **Primary sample:** Bounded Agents / Agentic Principal Chain (arXiv:2608.15888)

## Research value

### Failure

Static permissions describe a maximum action set, not the delegated task. Per-call allow/deny decisions miss cumulative budget and sequence effects. A child can remain nominally in scope while receiving too much inherited authority, drifting from intent, or combining read and send capabilities into exfiltration.

### Findings

The primary paper reports 3,154 evaluation instances. It reports 0% observed data-stealing success across 544 InjecAgent data-stealing cases and 0% exfiltration in the compromised-model AgentDojo cohorts, while interactive enforcement reduced pair-weighted utility by 8.6 percentage points. It also reports a 60.4% residual for harmful single actions that remain in scope and a 39.9% data-stealing rate when one required composition pair is removed.

These results are source-reported and benchmark-bounded. They demonstrate behavior of the reference mechanism under authored policies; they do not independently establish complete enterprise protection.

### Mechanism

APC turns delegation into infrastructure-held session state: ordered principals, monotonically narrowed scope, cumulative budgets, prior-action history, predeclared intent, exact approval tokens and evidence commitment. A gateway evaluates six conjunctive conditions before forwarding a tool call. Composition closure denies a call if adding its action type would complete a prohibited pair or ordered tuple.

### Implication

The correct abstraction is not “each agent has permissions,” but “each work session executes an authorization program.” Its state must survive delegation and concurrency, be unavailable to model modification, and be updated atomically before effects occur.

## Evidence claims

### E1 — source-reported-claim

**Claim:** APC models a signed session envelope whose resource/action/data scope narrows and whose restrictions accumulate at every delegation hop.

**Source:** arXiv:2608.15888 and same-date Reading Note.

**Strength:** reports. **Independent:** false.

### E2 — source-reported-claim

**Claim:** The paper's formal guarantees require cumulative budget tracking, complete restriction coverage and serialized admission.

**Source:** same primary paper.

**Strength:** reports. **Independent:** false.

### E3 — source-reported-claim

**Claim:** The reported evaluation shows strong blocking of covered exfiltration/composition cases but measurable utility cost and uncovered single-action harm.

**Source:** same primary paper and Reading Note.

**Strength:** reports. **Independent:** false.

### E4 — our-interpretation

**Claim:** Multi-agent authorization should be modeled and audited as a stateful program whose policy coverage and classifier quality are first-class operational evidence.

**Source:** analytical inference from E1–E3.

**Strength:** supports. **Independent:** false.

## Architectural comparison

| Control | Decision state | Delegation behavior | Sequence awareness | Stable limitation |
|---|---|---|---|---|
| RBAC/ABAC | Role or attributes | Application-defined | Normally per request | Does not encode session compositions |
| OAuth/OBO | Grant and acting-party chain | Can represent delegation | Token/grant oriented | No automatic per-hop attenuation or action history |
| Prompt instruction | Model context | Model-mediated | Informal | Inside the compromised component |
| APC | Signed session envelope and prior actions | Monotone narrowing | Pair and ordered-tuple checks | Depends on policy completeness and classification |

## Contradictions and counterarguments

Sequence-aware policy increases authoring and coordination cost. Every domain needs action classes, resource mappings and prohibited outcomes, and concurrent agents require serialized admission to avoid time-of-check/time-of-use races. The paper's theorem is therefore conditional on the very operational properties that are difficult at scale.

The utility cost is not incidental: strict and interactive configurations reject some legitimate work. A sound design must expose false-autonomy and approval-burden tradeoffs rather than treating maximum blocking as the only success metric.

## Bounded research judgment

For delegated multi-agent work, authorization must be non-expansive across principal hops and stateful across actions. Principal-chain narrowing plus composition closure is a credible architecture pattern, but its guarantee is only as complete as the policy taxonomy, serialized admission and trusted gateway. It complements backend authorization; it does not replace it.

## General implications

- Delegation records should include who delegated, what narrowed, and which budget was consumed.
- Policy coverage and action-classification drift need continuous tests.
- Concurrent sub-agents require atomic admission and budget updates.
- Approval artifacts should bind the exact session, action and parameters.
- Evidence availability may be an execution prerequisite for consequential work.
- Cross-session effects require a state boundary broader than APC's reported per-session design.

## Limitations and open questions

The paper is a primary preprint without independent reproduction. Trusted enforcement compromise, multi-principal compromise, parameter misuse and cross-session composition remain outside its guarantee. Open questions include scalable policy authoring, distributed serialization, mid-session policy revision and how recovery epochs inherit prior-action state without allowing attackers to reset composition history.

## Editorial recommendation

- **Article type:** technical-analysis
- **Selected modules:** research-question; context; evidence; technical-analysis; architecture-implications; counterarguments; limitations; open-questions
- **Ending module:** open-questions
- **Project relevance:** none

