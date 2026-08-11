A participant SHALL NOT perform a protected action outside the active scope of its role.

A deployment claiming separation of duties SHALL define and enforce incompatible role combinations for the same governed result.

Role assignment, revocation, delegation, and separation-of-duty exceptions SHOULD themselves be represented as governance objects.

Role and authority evaluation SHALL follow the order in Section 6.2. Proven denial or an out-of-scope action SHALL be `invalid`; missing or ambiguous assignment evidence SHALL be `undetermined`.

## 9.5 Stream Requirements

Every stream SHALL have a stable stream identifier.

Every published object SHALL belong to exactly one writer stream. A conforming profile SHALL preserve the local publication order of that writer and SHALL NOT require multiple writers to co-author one mutable object.

Independent streams MAY progress asynchronously and SHALL NOT be required to advance in lockstep. The absence of a new object in one stream SHALL NOT prevent unrelated streams from progressing when the profile defines no dependency.

Sequence numbers SHALL be positive integers and SHALL be unique within a stream.

A reader SHALL report a duplicate sequence number as a stream-integrity error and SHALL preserve every conflicting candidate for inspection.

A reader SHALL report a sequence gap and SHALL NOT invent the missing object, infer its content, or use timestamps to replace the missing sequence position.

Wall-clock timestamps SHALL NOT be the sole authoritative ordering mechanism.

A reader SHALL NOT infer an authoritative order between objects in different streams unless the applicable profile defines a cross-stream causal, lifecycle, or dependency relation. Objects without such a relation SHALL remain concurrent or incomparable in the reconstructed governance graph.

## 9.6 Lifecycle Requirements

Every lifecycle profile SHALL define:

- states;
- an initial state;
- terminal states;
- actions;
- legal transitions;
- authorized roles;
- preconditions;
- required evidence.

Every lifecycle profile SHALL have a stable identifier, version, and byte digest. A reader SHALL validate transitions in the order defined by Section 6.2, reconstruct state as defined by Section 6.3, and apply only transitions judged `valid`. If the unique current state cannot be reconstructed, the candidate transition SHALL be `undetermined` and SHALL NOT alter authoritative state.

An illegal or unauthorized transition SHALL NOT alter the authoritative lifecycle state.

The attempted transition SHALL remain observable through a rejection, issue, alert, or equivalent profile-defined record unless the attempt cannot be captured by the deployment's stated threat model.

A terminal-state or archival operation SHALL preserve the objects and transition evidence required to reconstruct how that state was reached.

## 9.7 Reference Requirements

Every reference SHALL identify a relation type and target object identifier.

A profile SHALL define which reference types create ordering dependencies, which are non-ordering links, and which relation classes must be acyclic.

The relation registry SHALL have a stable identifier, version, and byte digest, and the reader result SHALL identify the exact revision used.

A missing target SHALL be reported. The referencing object MAY remain in a partial view, but the missing dependency SHALL NOT be treated as satisfied.

A reader SHALL quarantine the affected subgraph of a prohibited cycle rather than silently deleting an edge or selecting an arbitrary order. Unaffected valid objects SHOULD remain reconstructable.

## 9.8 Integrity Requirements

The canonicalization and digest algorithms SHALL be declared by a versioned integrity profile.

The integrity profile SHALL define the exact fields or bytes covered by the digest and, when applicable, the signature. It SHALL define how `digest`, `signature_algorithm`, `key_id`, and `signature` are excluded or normalized to avoid self-reference.

The profile SHALL also define character encoding, Unicode normalization, line endings, field ordering, whitespace and escaping, number and timestamp representation, absent-versus-null handling, textual-body treatment, attachment hashing, extension-field treatment, and the schema and profile versions bound to the canonical form. Unknown extension fields SHALL either be included deterministically in the covered representation or rejected; they SHALL NOT influence authoritative semantics while being silently excluded from integrity protection.

A reader SHALL recompute and verify the digest before accepting an object as intact. A digest mismatch SHALL be reported, and the object SHALL NOT enter the intact authoritative object set, although the source SHALL remain available as evidence of the failure.

When signature metadata is present, `signature_algorithm`, `key_id`, and `signature` SHALL be supplied as one complete group. The reader SHALL validate the signature, key status, and identity binding before claiming authenticated integrity.

An absent signature is permitted under TMPA Core. An unverifiable signature SHALL NOT be treated as valid evidence of authenticated integrity.

A deployment SHALL NOT present schema validity, digest validity, signature validity, role authorization, or lifecycle legality as proof that an object's factual claims are true. Semantic assurance requires a declared evidence and verification profile outside TMPA Core.

A deployment SHALL NOT claim resistance to an attacker who can alter both content and unanchored integrity metadata solely because a co-located digest is present. Such a claim requires authenticated integrity, externally anchored digests, trusted storage, or an equivalent declared control.

## 9.9 Aggregation and Reader-Reconstruction Requirements

A conforming source aggregator SHALL preserve source identity and content, discover candidates without using enumeration order as governance order, and produce a deterministic canonical candidate set for the reader. It SHALL NOT silently resolve conflicts, invent missing objects, or convert a transport or filesystem arrival order into an authoritative process sequence.

For the same canonical candidate set and fixed rule profile, a conforming governance reader SHALL:

- produce the same canonical reconstructed partial-order graph or view and issue set for every input permutation;
- preserve within-stream order, profile-defined cross-stream relations, and concurrency among incomparable objects;
- preserve source objects unchanged;
- preserve valid conflicting objects until an authorized resolution exists;
- exclude schema-invalid and digest-invalid objects from the authoritative object set while retaining their diagnostic evidence;
- report duplicate identifiers, sequence gaps, duplicate sequences, illegal transitions, unauthorized actions, missing references, prohibited cycles, and integrity failures;
- emit one semantic judgment—`valid`, `invalid`, or `undetermined`—for each governed conclusion and preserve the reason for that judgment;
- distinguish authoritative, partial, disputed, quarantined, and unauthenticated states where those distinctions apply;
- apply a deterministic order to conformance issues and serialized view elements.

The fixed rule profile SHALL include every input listed in Section 8.1. The reader SHALL emit the envelope defined by Section 8.2, use the Core issue codes and identifiers defined there, and apply the three-valued composition rules in Section 7.3. Canonical output ordering SHALL follow Section 8.3.

A deterministic topological serialization or display tie-breaker SHALL NOT be interpreted as a governance decision, truth priority, or additional cross-stream order.

A reader SHALL NOT use input arrival order, filesystem enumeration order, or wall-clock timestamp order to resolve a governance conflict.

An `undetermined` dependency SHALL propagate as `undetermined` to a dependent conclusion until an authorized resolution object satisfies the applicable profile. View classifications explain why the judgment was reached; they SHALL NOT replace or expand the three semantic values.

## 9.10 Recovery Requirements

A replacement participant SHALL be able to determine, from persistent governance objects and the applicable profile:

- the current authoritative or explicitly partial lifecycle state;
- the responsible role;
- unresolved requirements;
- referenced results, reviews, approvals, and rejections;
- integrity, authority, ordering, reference, and validation issues.

Recovery SHALL NOT require access to the previous participant's hidden chain of thought.

Execution-specific context not represented in governance objects MAY be unavailable; such absence SHALL be reported rather than guessed.

## 9.11 Governance Closure, Claims, and Human-Control Requirements

A work-oriented profile SHALL define the relation semantics for reports, issues, rejection, cancellation, follow-up work, review, acceptance, parent-child derivation, human approval, and archive authorization.

Lifecycle state and business acceptance SHALL be reconstructed separately. A terminal state, `done` label, physical archive, or executor completion claim SHALL NOT establish business completion by itself. When valid acceptance evidence is missing, the reader SHALL emit `ACCEPTANCE_UNDETERMINED`.

A governance-decision object SHALL remain orthogonal to a lifecycle review stage. An execution report SHALL NOT act as its own independent review, and a governance review SHALL NOT replace a required reciprocal response.

Every completion, failure, recovery, or acceptance claim SHALL identify a stable claim identifier, predicate, subject, and evidence-object identifier set. Missing required evidence SHALL emit `CLAIM_EVIDENCE_MISSING`, and the affected conclusion SHALL be `undetermined`.

Every accepted work object SHALL eventually have a report, issue, rejection, cancellation, or follow-up-work response. When the profile requires closure and the reader finds none, it SHALL emit `RECIPROCITY_MISSING` and SHALL NOT interpret silence as success.

Child work SHALL identify its parent explicitly. When a parent has an unfinished child, an unhandled blocked child, or a child without a reciprocal result, parent completion or acceptance SHALL emit `CHILD_WORK_OPEN` and remain `undetermined`.

A risk object requiring human approval SHALL remain `undetermined` / `pending_human` until the reader verifies a separate human-approval object whose type and relation are permitted by the risk policy, whose creator has an active assignment to a permitted approval role, and whose creator differs from the risk-object creator when the profile requires an independent actor. Agent self-approval, role labels without assignment evidence, missing approval, wrong object type, or unauthorized approval SHALL NOT satisfy the requirement and SHALL emit `HUMAN_APPROVAL_REQUIRED` or the applicable authority issue.

A profile SHALL publish failure-type and recovery-action registries. Failure and recovery objects SHALL reference the affected work; a recovery object SHALL also reference the triggering failure. A failure SHALL NOT be hidden or overwritten by a success response.

When current-state observations conflict with transition-history evidence, the reader SHALL emit `STATE_EVIDENCE_CONFLICT`, preserve both sources, and prevent the conflicting state from becoming the sole authoritative conclusion.

Inspection and governance-alert objects MAY emit findings and suggested plans, but they SHALL NOT be interpreted as an applied repair, lifecycle transition, or business decision without separate execution evidence.

---

# 10. Conformance and Testability

Sections 9 and 10 preserve the clause identifiers used by the combined TMPA Draft V1.0 source. This stability allows conformance reports and fixtures to cite the same normative basis across the architecture paper, Core specification, and implementation reports.

## 10.1 Conformance Levels

TMPA defines three conformance levels:

1. **TMPA Core Conformance:** implements durable textual messages and state objects, primary-carrier rules, single-writer streams, asynchronous multi-stream progression, deterministic aggregation and governance reconstruction, type rules, roles, lifecycle, integrity verification, and recovery requirements.
2. **FCoP Profile Conformance:** satisfies TMPA Core through a documented projection to the published FCoP protocol, including its naming, lifecycle, atomic-transition, routing, and evidence rules. Passing tests for one FCoP reference-implementation package is implementation evidence only; it is neither installation of the protocol nor sufficient by itself for this conformance level.
3. **Authenticated Governance Conformance:** satisfies TMPA Core and validates creator identity through a trusted signature, key, and authorization profile.

None of these levels certifies the semantic truth of a participant's claim. Authenticated Governance Conformance can establish which verified principal published an authorized object; claim correctness still depends on the applicable evidence, review, tool-attestation, or domain-verification profile.

Conformance is a claim about a specified implementation version, profile version, fixture corpus, and result set. Product identity, repository ownership, package publication, or demonstration availability does not itself establish conformance.

## 10.2 Required Conformance Tests

A TMPA Core conformance suite SHALL include C01–C14. Each result SHALL identify its normative basis and preserve the actual output needed to reproduce the verdict.

| ID | Test | Normative basis | Pass criterion |
|---|---|---|---|
| C01 | Schema validation | 4.1, 9.2, 9.3, 9.11 | an object with missing required fields, wrong Core type/version, prohibited fields, malformed transitions, incomplete signatures, malformed claims, invalid risk enums, or invalid asserted `date-time` is excluded and produces `SCHEMA_INVALID` deterministically |
| C02 | Primary carrier, work derivation, and single-writer immutability | 9.2, 9.11 | one stable task carrier remains identifiable; parent-child work round-trips and is not replaced by a thread; another writer cannot replace or co-edit a published object; correction/supersession uses new attributable evidence |
| C03 | Duplicate object identity and source provenance | 9.2, 9.9 | same-ID candidates with different canonical content are retained and quarantined with a deterministic critical conflict; byte-identical observations project one node while retaining every contributing source ID |
| C04 | Serial-stream continuity and asynchronous progress | 9.5, 9.9 | each writer preserves its local sequence; duplicate numbers and gaps are reported; unrelated streams can advance independently; no missing object is invented and arrival order does not change the final result for the same set |
| C05 | Role authority | 6.2, 9.4, 9.9 | an action outside validated role scope produces `AUTHORITY_DENIED` and `invalid`; missing or ambiguous assignment evidence produces `AUTHORITY_UNDETERMINED` and `undetermined`; neither action is applied |
| C06 | Lifecycle legality, state evidence, and business-acceptance separation | 6.2–6.4, 9.6, 9.9, 9.11 | an undefined transition produces `ILLEGAL_TRANSITION`; ambiguous state or missing prerequisites produce `LIFECYCLE_UNDETERMINED`; an observation contradicting reconstructed state produces `STATE_EVIDENCE_CONFLICT`; completion without independent acceptance produces `ACCEPTANCE_UNDETERMINED`; none fabricates business completion |
| C07 | Separation of duties and human control | 9.3, 9.4, 9.11 | the same identity cannot execute and independently review the same result; self-approval, unassigned role labels, and wrong approval-object types remain pending; only a separate permitted object from an assigned, profile-authorized and, when required, independent approver satisfies the gate |
| C08 | Integrity tampering | 9.8, 9.9 | changing covered content while preserving the original integrity metadata causes digest verification to fail; the object is retained as failure evidence but excluded from the intact authoritative set |
| C09 | Missing reference and claim evidence | 9.7, 9.9, 9.11 | an unresolved target produces `MISSING_REFERENCE`; missing evidence for a completion claim produces `CLAIM_EVIDENCE_MISSING`; neither dependency nor claim is treated as satisfied |
| C10 | Prohibited cycle | 9.7, 9.9 | the affected prohibited-cycle subgraph is quarantined and reported while unaffected valid objects remain reconstructable |
| C11 | Aggregation and reconstruction determinism | 8, 9.9 | every tested enumeration, delayed-delivery permutation, and aggregation order of the same source set and complete fixed input bundle produces a byte-equivalent canonical result envelope, graph, and issue set; Unicode code-point ordering is locale-independent and unrelated cross-stream objects remain incomparable |
