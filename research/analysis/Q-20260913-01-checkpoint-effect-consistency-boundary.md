---
date: "2026-09-13"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260913-01
column: digital-employee
article_type: engineering-insight
project_relevance: none
source_reading: "research/reading/Q-20260913-01-aligned-recovery-external-effect-boundary.md"
---

# Research Analysis — Checkpoint Consistency Is Not Effect Consistency

## Research question

When a long-horizon agent rewinds after failure, what must be restored together for the resumed worker to remain causally coherent, and what additional evidence is required before the runtime may safely retry effects that escaped the controlled checkpoint boundary?

## Research themes and subject kind

- Research themes: aligned recovery; external-effect identity; replay safety; checkpoint generations; idempotency and compensation; recovery authority; completion truth.
- Subject kinds: `governance-problem`, `research-finding`, `architecture-mechanism`, `failure-mode`.
- Primary sample: AgentRewind and its MettleBench evaluation.
- Implementation sample: replay-agent-recorder timeline / snapshot / revert mechanism.

The research subject is not a particular rewind library. It is the boundary between **restoring a worker's local causal world** and **establishing the truth of effects already materialized outside that world**.

## Evidence identities

### E1 — research result

**Identity:** `source-reported-claim` backed by primary research.

**Claim:** AgentRewind stores aligned decision checkpoints containing agent context and controlled environment state, restores both to a chosen historical boundary, and then starts a new suffix with failure-derived rewind memory.

**Source:** same-date source-complete Reading Note based on arXiv:2608.14380.

**Strength:** direct mechanism evidence for the evaluated runtime. It does not establish recovery across arbitrary external systems. **Independent:** false.

### E2 — research result

**Identity:** `source-reported-claim` backed by primary research.

**Claim:** In the reported GPT-5.4 comparison, AgentRewind reaches 87.8% task success / 94.3% checklist progress versus Continue at 62.2% / 81.4%; GPT-5.4 mini reaches 51.2% / 73.5% versus 33.7% / 64.6%. The reported Terminal-Bench 2.0 generalization comparison is also favorable to AgentRewind.

**Strength:** bounded benchmark evidence that aligned recovery can improve long-horizon task performance inside the tested harnesses. It is not proof of universal recovery correctness. **Independent:** false.

### E3 — source-reported mechanism boundary

**Identity:** `source-reported-claim`.

**Claim:** The environment rewind boundary is principally the controlled workspace directory tree; restoring it can revert local file mutations, but does not automatically reverse network calls, remote database changes, messages, payments, consumed credentials or other external effects.

**Strength:** direct boundary evidence from the primary mechanism. **Independent:** false.

### E4 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** A locally aligned rewind can be internally consistent while still being globally inconsistent with the external world. Therefore checkpoint restoration and external-effect recovery must be represented as separate facts.

**Source:** synthesis of E1–E3 and the Reading Note's failure case.

**Strength:** strongly supported architectural inference; not directly implemented or benchmarked by AgentRewind. **Independent:** false.

### E5 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** Retrying an external action after rewind is safe only when the runtime has authoritative evidence that the prior occurrence is absent, replay-safe, idempotent, compensatable with verified compensation, or otherwise explicitly governed.

**Strength:** bounded governance inference from the effect-boundary failure mode. The exact ledger schema and policy remain design choices. **Independent:** false.

### E6 — open question

**Identity:** `open-question`.

**Claim:** The source does not establish exactly-once semantics across services, atomic multi-service rollback, cross-host checkpoint/effect consistency, compensation correctness after response loss, or organizational authority for choosing a rewind point.

**Strength:** explicit limit of current evidence.

## Failure / Finding / Mechanism / Implication

### Failures

1. **Local-world restoration illusion:** context and workspace return to a historical state while a remote service remains in the post-action state.
2. **Duplicate side effect after rewind:** the resumed worker reissues an operation because its local state says the operation has not happened.
3. **False absence:** the worker assumes a remote effect was undone because the corresponding local artifact disappeared.
4. **False presence:** the worker assumes the previous operation succeeded without rereading the authoritative target after an ambiguous response.
5. **Checkpoint/effect generation mismatch:** a local checkpoint from generation `g` is combined with external-effect evidence from another execution generation.
6. **Recovery-as-authorization:** the ability to restore state is interpreted as authority to retry a high-impact operation.
7. **Compensation ambiguity:** a compensation request is issued, but its outcome is unknown; a second compensation can itself duplicate harm.
8. **Business completion collapse:** a successful rewind is reported as task completion even though the intended external business outcome remains unresolved.

### Findings

The strongest supported finding is that **aligned restoration is necessary for local causal consistency but is not sufficient for end-to-end effect consistency**. The primary study directly addresses the first problem: a worker should not resume with cognition from one historical point and environment state from another. Its benchmark evidence supports the utility of that alignment for long-horizon engineering tasks.

The same mechanism also exposes its own boundary. The controlled state is principally workspace state. Effects outside that boundary are not restored by the checkpoint operation. This creates a second recovery problem that cannot be solved merely by adding more checkpoint fidelity inside the workspace.

The useful abstraction is therefore not one generic `recovered=true` flag. At least three claims must remain separate:

- **trajectory restored** — active model context refers to the chosen checkpoint;
- **controlled state restored** — the governed local environment refers to the same checkpoint;
- **external effects reconciled** — every relevant escaped effect has authoritative present/absent/compensated/unknown evidence compatible with that checkpoint generation.

Only the first two are directly demonstrated by the primary mechanism.

### Mechanism

A production recovery contract can be modeled with two coordinated but non-identical ledgers.

**Checkpoint ledger**

- checkpoint / generation identity;
- model-context identity;
- controlled-environment snapshot identity and digest;
- retained-prefix identity;
- failed-suffix identity;
- rewind-memory identity;
- actor / worker / attempt identity;
- recovery selection and approval evidence where required.

**External-effect ledger**

- stable operation occurrence identity;
- target identity and authoritative target version/precondition;
- originating checkpoint generation and attempt;
- request identity / idempotency key where supported;
- observed acknowledgement or durable result identity;
- effect class: replay-safe, idempotent, compensatable, irreversible, or unknown;
- compensation occurrence and verification evidence;
- latest reread of authoritative target state;
- retry authorization bound to the new occurrence.

The two ledgers meet at the **resume gate**. Restoring a checkpoint may make the worker eligible to plan again, but the gate should refuse to infer that an escaped operation is absent merely because the local checkpoint predates it. Before retrying a material effect, the runtime needs a current effect-state decision derived from authoritative evidence.

### Implication

For governed digital employees, recovery should be treated as a **state-and-effect reconciliation protocol**, not simply a rewind feature. A runtime can safely say “the worker was restored” without saying “the world was restored.”

This also changes retry semantics. A retry decision should depend on effect evidence:

- **proven absent** → a new authorized occurrence may be attempted;
- **proven present with desired result** → do not repeat; reconcile local state to the external fact;
- **proven present but undesired and compensatable** → compensation is a separate governed operation;
- **unknown** → fail closed or obtain additional target evidence rather than guessing;
- **irreversible** → recovery must continue from the external fact, not from a fictional pre-effect world.

## Comparison and contradictions

The primary evidence contrasts Continue, Restart with Experiences and AgentRewind. Continue preserves failed reasoning and corrupted state; Restart can remove state contamination but discards useful progress and causal context; AgentRewind restores a selected aligned checkpoint and preserves failure-derived learning. This comparison supports aligned local recovery.

The apparent contradiction arises only if benchmark success is enlarged into a global rollback claim. The benchmark demonstrates that the mechanism can improve task success in a controlled engineering environment. It does not show that arbitrary external systems participate in the same transactional checkpoint.

A second contradiction is operational: not replaying the retained prefix prevents the recovery harness from re-executing those tool calls, but it does not mean their already-materialized external effects disappeared. “Not replayed by the harness” and “reversed in the world” are different statements.

## Bounded research judgment

**A long-horizon agent should restore model context and controlled environment state at the same checkpoint generation, but a governed runtime must treat every escaped external effect as separate durable evidence. Rewind establishes local causal consistency; only explicit effect reconciliation can establish whether a resumed worker may safely retry, compensate, accept or stop.**

This judgment is strongest for operations that are externally visible, costly, security-sensitive, financially material or hard to reverse. Purely local deterministic computations may need much less machinery.

The runtime should therefore avoid a generic “rollback succeeded” status when external effects exist. A more truthful completion model records which state domains were restored and which effects remain present, compensated or unknown.

## General implications

For agent runtimes and multi-agent organizations:

- assign every externally mutating operation a durable occurrence identity before execution;
- bind each occurrence to worker, attempt and checkpoint generation;
- classify replay semantics before allowing automatic recovery;
- reread authoritative target state after ambiguous response loss;
- separate retry authorization from checkpoint selection;
- treat compensation as a new effect with its own identity, authorization and verification;
- preserve unknown-effect states explicitly rather than collapsing them into success or failure;
- make cross-host recovery prove that restored context, controlled state and effect ledger refer to one causal generation;
- distinguish “recovery mechanism worked” from “business objective completed.”

## Limitations and counterarguments

The primary study's strongest evidence comes from controlled engineering harnesses. External enterprise systems may provide idempotency keys, transactions or compensating APIs that reduce some of the risks above, but those mechanisms must be integrated into the recovery contract rather than assumed.

A full external-effect ledger can be expensive. Low-risk and read-only actions may justify lighter evidence. The design should therefore be risk-scaled, but the semantic distinction between local restoration and external truth should remain explicit even when implementation is simple.

The study does not evaluate concurrent workers restoring overlapping targets. Concurrency can create a harder case in which a remote state legitimately changed after the checkpoint by another authorized actor, making “restore to old world” neither possible nor desirable.

## Open questions

1. What minimum occurrence identity is required for an effect to be safely retried after response loss?
2. Which external systems can provide authoritative absent/present evidence cheaply enough for automatic recovery?
3. How should checkpoint generation interact with long-lived idempotency keys?
4. Who may authorize a rewind when it changes which evidence is visible in active context?
5. How should concurrent agents reserve or reconcile effects on the same target during recovery?
6. Can compensation itself be made safely retryable without recursive ambiguity?
7. What evidence proves that a cross-host restore and its effect ledger belong to the same causal generation?
8. Which classes of effect should always require human approval before replay or compensation?

## Editorial recommendation

- **Article type:** engineering-insight
- **Selected modules:** research-question; evidence; recovery-boundary; benchmark-finding; external-effect-failure; state-and-effect-ledgers; retry-decision-matrix; engineering-implications; limitations; open-questions
- **Core proposition:** checkpoint consistency is necessary for recoverable execution, but end-to-end recovery requires a separate external-effect reconciliation contract
- **Project relevance:** none
