# Q-20260907-01 — Multi-Agent Safety Requires End-to-End Authority-to-Effect Path Closure

- Runtime date: 2026-09-07 (Asia/Shanghai)
- Queue signal: SIG-20260907-007
- Primary research source: https://arxiv.org/html/2609.00595v1
- Evidence level: `peer_reviewed_or_primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

When a multi-agent or digital-employee system contains individually well-checked workers, what evidence is still required to show that the system-level security boundary is actually closed across messages, shared state, collective decisions, delegated authority, tools and recovery?

## Problem

Local agent checks do not establish system safety when influence and authority can cross principal boundaries. A worker may reject a malicious message correctly while another route preserves the same influence in shared state, forwards it through an honest specialist, aggregates it into a collective decision, or turns it into a privileged tool action. The selected source makes the complete execution path—not the individual agent—the security unit of analysis.

This matters for digital employees because organizational execution is inherently relational. A principal can be locally benign and still participate in a globally unsafe execution if provenance is lost, trust is inherited too broadly, shared state persists contaminated influence, or delegation exposes a capability that the original sender could not exercise directly.

## Evidence Base

The source is a systematization-of-knowledge study covering **197** in-scope multi-agent security works. Its frozen corpus is split into 115 works that were peer reviewed or had at least ten citations and 82 additional emerging works used more selectively. The authors separately audit **44** evaluation and benchmark works whose primary contribution is multi-agent security evaluation.

The synthesis models multi-agent security through an execution-centered A-I-R representation:

- **A — adversary position:** four starting positions, from external/user-level adversaries through malicious members and infrastructure adversaries.
- **I — interaction interface:** six security-relevant transitions through which information, state, decisions, authority or controls move.
- **R — system-level risk:** seven non-exclusive risk families reached by the execution.

Across these dimensions the paper synthesizes **eight recurring attack paths**. These are execution-pattern shorthands rather than an additional set of security outcomes.

## Interaction Surfaces That Break Local-Safety Reasoning

The six interaction interfaces explain why a locally safe component can still participate in an unsafe system execution:

1. **Admission** — users, principals, external data, messages and artifacts enter the system with identity, provenance, role and initial trust assumptions.
2. **Message transfer** — influence crosses from one principal to another and may lose sender identity, provenance, purpose or authorization context.
3. **State propagation** — information is written into memory, summaries, plans, histories or other shared/derived state and can reappear after the original interaction has ended.
4. **Authority transfer and action** — information or delegated authority reaches tools, credentials, resources, routing privileges or other privileged capabilities.
5. **Collective commitment** — local outputs become a vote, consensus, final answer, termination decision or action trigger; apparent agreement may not represent independent evidence.
6. **Detection and intervention** — monitoring, blocking, isolation, revocation, rollback and recovery act over the preceding interfaces, but only where observation and control actually reach.

The paper also identifies configuration dimensions that condition these paths: communication topology, protocol semantics, principal composition, coordination mechanism, state architecture, membership and trust, authority placement, and oversight architecture. A security claim therefore depends on both the path and the configuration under which that path exists.

## Transitive Authority Is a System Property

A particularly important boundary for digital employees appears at authority placement and transfer. Reachability is not only about which principal can receive a message. Security impact depends on **what authority becomes reachable through that principal**: tool permissions, credentials, budgets, delegation rights and control-plane capabilities.

This creates a transitive problem. An external input may have no direct authority, but its influence can pass through admitted messages, persistent state and an honest intermediary before reaching a privileged action. Every local transition may look protocol-valid while the end-to-end execution violates the original authorization purpose or scope.

A bounded inference for runtime architecture is that authorization review should be able to reconstruct the full principal-to-effect chain. The relevant proof object is not simply “worker X was allowed to call tool Y,” but the lineage showing which origin, message/state transformations, delegated rights and intermediate principals made the final effect reachable.

## Five-Part Defense Contract

The paper evaluates defenses through a five-part contract:

### Path target

The defense must identify the protected system-level risk and the interaction/path segment it is intended to break. Protecting one agent or filtering one message is not enough when the same effect remains reachable through another route.

### Observation

The defense must state what portion of the cross-principal execution it can actually see: a message, principal, edge, shared state, subgraph, latent state or full trace. A local observer can have rich detail but poor coverage; a global observer can have broader coverage but depend on coarser or more trusted telemetry.

### Intervention

The defense must state what it can change and when. It may constrain topology, policy or authority before execution; block, rewrite, reroute or quarantine during execution; or revoke authority and repair state afterward. Timing matters because a transition that can be prevented before state persistence may be difficult to undo later.

### Trust boundary

The defense must declare the principals, components and conditions it assumes remain trustworthy: authenticated identities, coordinators, provenance, bounded membership, topology, synchrony, complete logs or honest-neighbor/majority assumptions. Membership, routing or delegation changes can invalidate this boundary during execution.

### Recovery

The defense must state what remains possible after prevention or containment fails: which influence can be contained, which delegated authority can be revoked, which state can be rolled back or repaired, and how restoration of the protected property is verified.

This contract is valuable precisely because it prevents a defense from being described only by a positive local test. It forces the claim to include the reachable effect, visibility, control point, assumptions and post-failure behavior.

## Path Closure Is Stronger Than Local Protection

The cross-cutting result is explicit: **local protection does not imply path closure**. Attack paths can compose. An execution may enter through one path, persist through another and finally gain authority through a third. Blocking one edge shows that the edge is controlled; it does not show that every route to the protected effect is closed.

For a governed agent runtime, this suggests a graph-level acceptance question: after applying the proposed control, is there still any admissible path from the adversarial origin or untrusted influence to the protected effect under the declared trust assumptions? This is an architectural inference from the study, not a formal algorithm supplied by the authors.

## Containment Is Not Recovery

The paper also separates containment from recovery. Removing the original malicious source or stopping further propagation does not repair artifacts, memories, credentials, delegated authority or spawned principals that already inherited the effect. Recovery requires finding descendants, revoking inherited authority, repairing state and verifying restoration.

That distinction is directly relevant to long-lived digital employees. A runtime that records “source quarantined” has not yet established “system recovered.” Recovery evidence must account for derivative state and authority, not just the original compromised principal.

## Evaluation Requirements and Gaps

The audit of 44 evaluation works shows why system-level claims remain difficult to compare. The literature uses heterogeneous threat models, configurations, attack-success definitions, metrics and benchmark artifacts. The paper calls for evaluation that isolates interaction effects rather than merely reproducing a known single-agent vulnerability inside a multi-agent setting.

The causal requirement is important. An execution trace can show where harm traveled, but it does not by itself show whether interaction caused or amplified the harm. The authors distinguish inherited, interaction-amplified, composition-induced and structurally multi-agent effects. For the first three, relation-removal counterfactuals can help determine whether the effect persists, changes magnitude or disappears when the relevant interaction is removed.

A bounded engineering implication is that security regression suites should include counterfactual variants that remove or alter the cross-principal relation while keeping the protected property meaningful. Without that comparison, a failure observed in an agent team can be mislabeled as a multi-agent-specific security failure.

## Failure Modes for a Digital-Employee Runtime

### Individually-safe-worker fallacy

Every worker passes local policy tests, but a harmful influence traverses several valid transitions and reaches a privileged effect through composition.

### Provenance erosion

Summarization, translation or state reconstruction preserves semantic content but loses origin, purpose or authorization context needed by downstream checks.

### Persistent-state contamination

A malicious influence is blocked at its current source while previously copied memories, artifacts or derived state remain active.

### Delegation laundering

A low-authority principal influences a higher-authority principal so that an otherwise inaccessible tool or credential becomes reachable indirectly.

### False independence

Multiple principals appear to agree, but they share a model, context, source or attacker influence, so their votes do not constitute independent evidence.

### Observer blind spot

A monitoring layer claims system-level safety while relevant edges, shared-state transitions or delegated actions fall outside its visibility.

### Containment-recovery collapse

The runtime marks an incident resolved after propagation stops without revoking derivative authority or validating restored state.

## Evidence Strength

This is strong primary research evidence for a **systematized conceptual and evaluation framework**. The 197-work corpus, explicit inclusion structure, execution-centered taxonomy and separate 44-work evaluation audit provide broad support for the claim that multi-agent security must be reasoned about across principal boundaries and complete paths.

It is not equivalent to a production runtime proof. The paper synthesizes and compares existing evidence; it does not demonstrate that one concrete implementation using the five-part contract closes all attack paths in a deployed digital-employee system.

## Limits and Unknowns

- The corpus is frozen around research available through 2025 plus emerging work selected under the paper's stated process; rapidly changing 2026 deployment practices are not exhaustively represented.
- The five-part defense contract is an analytical comparison framework, not a mechanically verified security specification.
- The eight attack paths are non-exclusive synthesis patterns; real executions can combine or depart from them.
- Relation-removal counterfactuals are informative only when the protected property remains meaningful after removing the interaction.
- A complete execution trace improves attribution but does not alone prove causality.
- Runtime observability itself creates trust and privacy assumptions; a centralized observer can become a high-value control-plane target.
- The paper identifies recovery as under-evaluated relative to prevention and containment, so concrete recovery guarantees remain an open engineering problem.
- Nothing in the source proves that one universal topology, trust model or authorization scheme is correct for all multi-agent deployments.

## Unresolved Questions

1. What durable evidence structure can represent the complete origin-to-effect path without making the observability plane itself an unsafe concentration of authority?
2. How should delegated authorization lineage survive summarization, compaction, handoff and recovery without becoming forgeable context?
3. Can a runtime compute or test path closure over dynamic membership, spawned agents and changing tool permissions quickly enough for online admission?
4. Which protected properties require pre-effect prevention, and which can rely on compensating recovery after an effect occurs?
5. How should counterfactual multi-agent security tests be generated when removing an interaction also changes the semantics of the task?

## Reading Conclusion

The selected evidence supports a bounded conclusion: **multi-agent safety is an end-to-end execution property, not the sum of local worker checks.** Messages, state propagation, collective commitment and delegated authority create transitive paths through which influence can reach effects that no single component exposes directly. A defensible runtime therefore needs to state the target path, observation scope, intervention point, trust boundary and recovery behavior, and it must test whether alternate routes to the protected effect remain open. Analysis may use this source to examine an authority-to-effect closure model for digital employees, but should not present the SoK framework itself as proof that any specific runtime is already secure.
