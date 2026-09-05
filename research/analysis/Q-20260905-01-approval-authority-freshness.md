---
date: "2026-09-05"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260905-01
column: digital-employee
article_type: comparative-study
project_relevance: none
source_reading: "research/reading/Q-20260905-01-approval-judgment-authority-lifetime.md"
---

# Research Analysis — Approval Judgment Requires Separate, Fresh Authority

## Research question

What evidence must exist before an AI-generated approval judgment becomes an effective organizational sign-off, and which changes must invalidate or narrow that authority before the judgment can be used again?

## Research themes and subject kind

- **Themes:** human approval; authorization evidence; authority scope; freshness; delegation; context continuity
- **Subject kinds:** governance-problem; protocol-mechanism; cross-sample-comparison; failure-mode
- **Samples:** GitHub Copilot pull-request approval policy; OpenAI Codex Guardian root-authorization evidence lifecycle

## Research value

### Failure

A governed system can collapse several different propositions into one overloaded word, “approval”: the model judged an object acceptable; policy allows the model to submit an approval; that approval is allowed to satisfy a governance gate; the approval is valid only for a defined scope; and the evidence remains fresh enough to authorize the current object or execution context. When these propositions are merged, a recommendation can accidentally become authority, or a once-valid authority can survive after the facts that justified it have changed.

A second failure appears across delegation and context operations. If retained conversation state is treated as equivalent to retained authority, compaction or fork can carry an old approval into a context where its original scope, evidence or principal relationship no longer holds.

### Findings

GitHub's public contract separates an AI reviewer's approval assessment from the ability to submit an approving review and from whether that approval may count toward merge requirements. Actual Copilot approval is disabled by default and depends on administrator policy. Repository policy may further restrict qualifying approvals by changed-file paths. New commits dismiss an earlier approval, making reviewed-object freshness explicit.

Codex independently demonstrates a runtime form of the same higher-order problem. Guardian review retains bounded root-authorization evidence, versions that evidence, cancels an `Allow` when the root authorization version changes before use, marks missing required evidence incomplete, recovers required authorization context across compaction, and removes parent-only approvals on worker fork.

The two systems operate at different layers, but both support the bounded conclusion that a positive judgment is not self-authorizing and that authority cannot be assumed to outlive changes in its governing evidence.

### Mechanism

For governed digital work, an authority-bearing approval can be decomposed into at least five independently auditable state dimensions:

1. **Judgment** — what the AI concluded about the object or action.
2. **Approval capability** — whether current policy permits this actor or agent to submit an approving decision at all.
3. **Effective authority** — whether that approval is allowed to satisfy the specific organizational or runtime gate being enforced.
4. **Scope** — the target, repository, files, action, principal relationship or other boundary to which the authority applies.
5. **Freshness identity** — the reviewed-object and authorization-evidence identity against which the approval was evaluated.

A safe transition from judgment to effective sign-off requires all applicable dimensions to be present and current. A material change in the reviewed object, governing authorization evidence, or context ownership must force re-evaluation rather than silently carrying the old effective authority forward.

This mechanism is deliberately narrower than a universal approval protocol. Different systems may represent freshness using commit identity, policy versions, authorization-evidence versions, occurrence identities or another stable tuple. The governance requirement is that the versioned authority boundary be explicit and machine-checkable rather than inferred from approval-like text.

### Implication

Governed digital employees should record “recommended approval,” “authorized to approve,” and “approval satisfied this gate” as different auditable facts. Approval receipts or equivalent durable evidence should bind the decision to its authority source, admitted scope and freshness identity. Context transformations such as compaction, delegation or fork should not be presumed authority-neutral; they need explicit rules for which authority evidence is retained, revalidated, narrowed or stripped.

## Evidence claims

### E1 — public-fact

**Claim:** GitHub documents that Copilot code review can provide an approval assessment without that assessment counting toward pull-request merge requirements; actual Copilot PR approval is a separately enabled administrator-controlled capability, and whether it can satisfy merge requirements is separately configurable.

**Source:** GitHub Copilot code-review announcement and configuration documentation captured in the same-date Reading Note.

**Strength:** states. **Independent:** false; first-party policy documentation for the exposed product behavior.

### E2 — public-fact

**Claim:** GitHub documents scope and freshness constraints for effective Copilot approval, including administrator policy hierarchy, optional file-path qualification, and dismissal of an approval when new commits change the reviewed object.

**Source:** GitHub Copilot code-review configuration documentation captured in the same-date Reading Note.

**Strength:** states. **Independent:** false.

### E3 — public-fact

**Claim:** OpenAI Codex maintainer commit `87628df77ab1a2622d1193ad835df02ced565bf2` versions Guardian root-authorization evidence, cancels a stale `Allow` when that version changes before use, marks missing required authorization evidence incomplete, recovers retained authorization context after compaction, and strips parent-only approvals on worker fork in the covered path.

**Source:** merged maintainer implementation and targeted tests examined by Reading.

**Strength:** states. **Independent:** false; direct implementation evidence for that revision.

### E4 — our-observation

**Claim:** The two independent samples place authority-freshness boundaries at different layers but preserve a common invariant: positive model judgment remains distinct from the evidence and policy that make the judgment operationally effective.

**Source:** comparison of E1–E3.

**Strength:** observed. **Independent:** false.

### E5 — our-interpretation

**Claim:** Governed approval should be represented as a versioned authority-bearing state transition whose validity depends on explicit capability, scope, effective gate and freshness identities; approval-looking text alone should never be sufficient execution or organizational authority.

**Source:** bounded analytical inference from E1–E4.

**Strength:** supports. **Independent:** false.

## Cross-sample comparison

| Boundary | Organizational review sample | Agent-runtime sample | Governance consequence |
|---|---|---|---|
| Judgment | Approval assessment | Guardian review result | Judgment alone is not authority |
| Authority source | Enterprise / organization / repository policy | Root instructions and verified answers retained as authorization evidence | Authority needs a distinct source |
| Effective gate | PR approval; optionally merge-requirement effect | Runtime action may proceed after Guardian allow | Gate effect must be explicit |
| Scope | Administrative hierarchy and optional file paths | Bounded root-review evidence and review scope | Authority is not global |
| Freshness | New commit dismisses prior approval | Root-authorization version change cancels stale allow | Material change requires re-evaluation |
| Context transition | Reviewed object changes | Compaction and worker fork | Context continuity cannot imply privilege continuity |
| Fail-closed case | Actual approval unavailable unless policy enables it | Required authorization evidence missing -> incomplete | Missing authority evidence must not be guessed |

## Contradictions and counterarguments

A strict freshness boundary can increase review cost because harmless changes may force re-evaluation. That is a policy-efficiency concern, not evidence that stale authority is safe. Systems can define narrower invalidation rules when they can prove which changes do not affect the approved proposition, but the exception itself needs an explicit rule and audit trail.

It is also possible for one product surface to intentionally combine several approval states for usability. A simplified UI is not itself a governance flaw. The problem arises when the durable control plane or audit record loses the distinction and therefore cannot determine which authority was exercised, against which object, under which policy, and with which freshness evidence.

Finally, neither selected sample proves the identity of a real human principal or establishes legal accountability. Administrator-configured policy and retained runtime authorization evidence are authority mechanisms, not proof of non-repudiation.

## Bounded research judgment

The strongest reusable conclusion is: **approval judgment and authority-bearing sign-off are separate facts, and effective approval must have an explicit freshness identity.** A model can assess that an action is acceptable without being authorized to make that assessment operationally binding. Even after authority is granted, the approval must be invalidated or re-evaluated when the reviewed object, governing authorization evidence or authority-sensitive context changes in a way covered by the policy.

This supports a stateful governance model rather than a text-classification model of approval. It does not establish a universal approval schema, named human-principal identity, legal accountability, or exactly-once downstream effects.

## General implications

- Persist recommendation/judgment separately from the authority grant that makes a decision effective.
- Bind effective approval to an explicit policy scope and freshness identity.
- Record whether an approval merely exists or actually satisfied a named governance gate.
- Re-evaluate or cancel stale authority after relevant target, policy or authorization-evidence changes.
- Treat compaction, delegation and fork as authority-sensitive transitions rather than transparent context copies.
- Strip or re-admit parent-only approvals when a child or delegated worker acquires a new ownership context.
- Preserve a fail-closed state when required authorization evidence cannot be reconstructed.
- Keep downstream effect identity, idempotency and reconciliation separate from approval freshness.

## Limitations and open questions

The GitHub evidence is first-party public policy documentation; it is strong for the exposed configuration and merge-governance behavior but does not expose every internal authorization mechanism. The Codex evidence is merged implementation plus tests for Guardian authorization lifecycle; it does not establish organization-wide policy or human-principal identity. The comparison therefore supports a higher-order governance pattern, not a claim that both systems implement the same protocol.

Open questions include which fields should form a portable approval-authority identity, which classes of object or policy mutation should invalidate it, how a signed or machine-verifiable approval receipt should represent principal and scope, and what cancellation/reconciliation evidence is required if authority becomes stale while an effectful action is already in flight.

## Editorial recommendation

- **Article type:** comparative-study
- **Selected modules:** research-question; evidence; comparison; governance-implications; counterarguments; limitations; open-questions
- **Ending module:** open-questions
- **Project relevance:** none
