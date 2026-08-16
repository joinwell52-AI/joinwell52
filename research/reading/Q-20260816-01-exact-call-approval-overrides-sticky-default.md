# Q-20260816-01 — Exact tool-call decisions override sticky approval defaults without widening scope

- Runtime date: 2026-08-16
- Column: Digital Employee
- Source object: Q-20260816-01
- Primary source: https://github.com/openai/openai-agents-python/commit/dde0bc99fd4e5a4e28f36be479c4b864249bc503
- Evidence class: Fact for merged code/tests; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

A durable agent run can carry a sticky approval default for a tool while a human later makes a different decision for one concrete invocation. The governance problem is to bind the exception to the exact call occurrence, preserve the sticky rule for other calls, persist that distinction through RunState serialization, and avoid turning one exception into a broader authorization change.

## Facts

1. The change bumps the RunState schema from 1.15 to 1.16 with the explicit compatibility summary that an exact call approval decision may override a sticky decision for the same tool.
2. Approval lookup checks exact call IDs before falling back to sticky defaults.
3. For an always-approved approval key, an exact rejection for a specific call ID returns rejected for that call while other calls continue to inherit the sticky approval.
4. For an always-rejected approval key, an exact approval for a specific call ID returns approved for that call while other calls remain rejected.
5. Exact rejection carries a per-call rejection message; an exact approval suppresses a sticky rejection message for the approved exception.
6. Applying an exact decision removes the same call ID from the opposite exact-decision list before adding it to the requested list, so reversing a decision does not leave contradictory per-call state.
7. Reversing one exact call from reject to approve, or approve to reject, leaves unrelated calls governed by the original sticky default.
8. The compatibility fixture persists a sticky decision together with an exact opposite exception keyed by the concrete call ID.
9. Tests cover both override directions, matching exact decisions, exact decision reversals, serialization/restore, and resumed execution.
10. Resume tests verify that only exact-approved occurrences execute when they are exceptions to a sticky rejection; exact-rejected occurrences remain blocked even when the sticky default approves the tool.
11. Hosted MCP approval coverage exercises the same exact-call exception semantics after checkpoint roundtrip rather than only in an in-memory helper.
12. When contradictory sticky approved/rejected flags coexist, the lookup code gives sticky approval precedence, but exact call IDs are still checked first.
13. The mechanism changes the decision for a concrete recorded invocation; it does not change tool registration, tool arguments, the approval key, or the surrounding agent policy.

## Mechanisms

### Exact occurrence binding

The durable decision is keyed by the concrete tool-call ID. Lookup resolves that exact occurrence before consulting the sticky default. This gives a narrow exception channel without mutating the scope-wide rule.

### Opposite-list cleanup

When an exact decision is changed, the implementation removes the call ID from the opposite exact list before recording the new decision. The call therefore has one current exact decision rather than two competing per-call records.

### Sticky fallback preservation

If no exact decision exists for a call ID, the original sticky approval/rejection remains authoritative for that approval key. A single exception therefore does not silently authorize or deny sibling invocations.

### Durable resume

Schema 1.16 and the compatibility corpus preserve sticky state plus exact-call exceptions across serialization. Resume tests then enforce the restored decision before executing the pending tool occurrence.

## Evidence

- `src/agents/run_context.py` resolves exact approved/rejected call IDs before sticky defaults and handles per-call rejection messages.
- RunState schema/compatibility changes document version 1.16 as exact-call override support.
- Compatibility fixtures encode a sticky default plus an exact opposite exception.
- Unit tests cover both override directions, reversal, unrelated-call fallback and roundtrip persistence.
- Runner resume tests demonstrate that execution follows the restored exact-call decision rather than merely the sticky tool-level default.

## Limitations

1. Exact call ID binding is not proof of the human approver's identity, role or authority.
2. The change does not make tool-call IDs cryptographically unforgeable or globally unique across unrelated systems.
3. It does not establish exactly-once execution for external side effects; it governs whether a recorded pending invocation is approved to execute.
4. Approval correctness still depends on the call identity and approval-key construction already present in the SDK.
5. The compatibility corpus proves accepted serialized structure and behavior, not provenance of every historical writer version.
6. A sticky default remains broad by design; this patch only makes a concrete exception narrower and deterministic.
7. This is an SDK-level authorization-state mechanism, not a complete enterprise authorization or audit system.

## Comparisons

- Mutating the sticky default to represent one exception would change policy for every sibling call. The exact-call list instead preserves the broad default and changes one occurrence.
- Treating a later human decision as an unscoped boolean would lose the identity of the invocation being approved or rejected. The call-ID binding retains that occurrence identity in durable RunState.
- Replaying only the sticky default after restart would erase the human exception. Schema 1.16 explicitly preserves both layers.

## Unresolved questions

1. What additional actor identity and authorization evidence should be stored beside each exact decision for enterprise audit?
2. How should call identity be protected when RunState crosses trust domains or is imported from external storage?
3. Should exact decisions expire when tool arguments, tool version or policy fingerprint changes before resume?
4. What evidence is required to distinguish authorization replay from legitimate durable resumption?
5. How should conflicting sticky state be normalized so approval-precedence fallback is not needed in newly written states?

## Reading boundary

This note establishes only the merged SDK mechanism: exact tool-call decisions are checked before sticky defaults, can override them in either direction for one call, survive RunState persistence, and leave unrelated calls on the sticky rule. It does not establish approver identity, organization-wide authorization, tamper-proof provenance, or exactly-once external execution. Those broader judgments belong to Skill 04 Analysis.
