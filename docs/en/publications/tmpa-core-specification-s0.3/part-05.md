A participant SHALL NOT perform a protected action outside the active scope of its role.

A deployment claiming separation of duties SHALL define and enforce incompatible role combinations for the same governed result.

Role assignment, revocation, delegation, and separation-of-duty exceptions SHOULD themselves be represented as governance objects.

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

An illegal or unauthorized transition SHALL NOT alter the authoritative lifecycle state.

The attempted transition SHALL remain observable through a rejection, issue, alert, or equivalent profile-defined record unless the attempt cannot be captured by the deployment's stated threat model.

A terminal-state or archival operation SHALL preserve the objects and transition evidence required to reconstruct how that state was reached.

## 9.7 Reference Requirements

Every reference SHALL identify a relation type and target object identifier.

A profile SHALL define which reference types create ordering dependencies, which are non-ordering links, and which relation classes must be acyclic.

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
- distinguish authoritative, partial, disputed, quarantined, and unauthenticated states where those distinctions apply;
- apply a deterministic order to conformance issues and serialized view elements.

A deterministic topological serialization or display tie-breaker SHALL NOT be interpreted as a governance decision, truth priority, or additional cross-stream order.

A reader SHALL NOT use input arrival order, filesystem enumeration order, or wall-clock timestamp order to resolve a governance conflict.

## 9.10 Recovery Requirements

A replacement participant SHALL be able to determine, from persistent governance objects and the applicable profile:

- the current authoritative or explicitly partial lifecycle state;
- the responsible role;
- unresolved requirements;
- referenced results, reviews, approvals, and rejections;
- integrity, authority, ordering, reference, and validation issues.

Recovery SHALL NOT require access to the previous participant's hidden chain of thought.

Execution-specific context not represented in governance objects MAY be unavailable; such absence SHALL be reported rather than guessed.

---

# 10. Conformance and Testability

Sections 9 and 10 preserve the clause identifiers used by the combined TMPA Draft V1.0 source. This stability allows conformance reports and fixtures to cite the same normative basis across the architecture paper, Core specification, and implementation reports.

## 10.1 Conformance Levels

TMPA defines three conformance levels:

1. **TMPA Core Conformance:** implements durable textual messages and state objects, primary-carrier rules, single-writer streams, asynchronous multi-stream progression, deterministic aggregation and governance reconstruction, type rules, roles, lifecycle, integrity verification, and recovery requirements.
2. **FCoP Profile Conformance:** satisfies TMPA Core through a documented FCoP projection and implements the published FCoP naming, lifecycle, atomic-transition, routing, and evidence rules.
3. **Authenticated Governance Conformance:** satisfies TMPA Core and validates creator identity through a trusted signature, key, and authorization profile.

None of these levels certifies the semantic truth of a participant's claim. Authenticated Governance Conformance can establish which verified principal published an authorized object; claim correctness still depends on the applicable evidence, review, tool-attestation, or domain-verification profile.

Conformance is a claim about a specified implementation version, profile version, fixture corpus, and result set. Product identity, repository ownership, package publication, or demonstration availability does not itself establish conformance.

## 10.2 Required Conformance Tests

A TMPA Core conformance suite SHALL include C01–C14. Each result SHALL identify its normative basis and preserve the actual output needed to reproduce the verdict.

| ID | Test | Normative basis | Pass criterion |
|---|---|---|---|
| C01 | Schema validation | 9.2, 9.3 | an object with a missing required field, wrong core type, prohibited top-level field, incomplete signature group, or invalid asserted `date-time` is rejected from the authoritative object set and produces a deterministic validation issue |
| C02 | Primary-carrier and single-writer immutability | 9.2 | one stable task carrier remains identifiable; another writer cannot replace or co-edit a published object; correction or supersession is represented by new attributable evidence that references or qualifies the earlier object |
| C03 | Duplicate object identity | 9.2, 9.9 | two candidates with the same ID and different canonical content are both retained for inspection, neither is selected as the authoritative node, and a deterministic critical conflict is emitted |
| C04 | Serial-stream continuity and asynchronous progress | 9.5, 9.9 | each writer preserves its local sequence; duplicate numbers and gaps are reported; unrelated streams can advance independently; no missing object is invented and arrival order does not change the final result for the same set |
| C05 | Role authority | 9.4, 9.9 | an action outside the creator's validated role scope remains observable but is not applied to authoritative state |
| C06 | Lifecycle legality | 9.6, 9.9 | an undefined or unauthorized transition remains observable as an issue and does not change the authoritative lifecycle state |
| C07 | Separation of duties | 9.3, 9.4 | the same identity cannot execute and independently review the same governed result unless a profile-authorized exception object exists; the exception and approving authority remain in evidence |
| C08 | Integrity tampering | 9.8, 9.9 | changing covered content while preserving the original integrity metadata causes digest verification to fail; the object is retained as failure evidence but excluded from the intact authoritative set |
| C09 | Missing reference | 9.7, 9.9 | an unresolved required target appears in the issue set, and the dependency is not treated as satisfied |
| C10 | Prohibited cycle | 9.7, 9.9 | the affected prohibited-cycle subgraph is quarantined and reported while unaffected valid objects remain reconstructable |
| C11 | Aggregation and reconstruction determinism | 9.9 | every tested enumeration, delayed-delivery permutation, and aggregation order of the same final canonical candidate set and fixed profile produces a byte-equivalent canonical partial-order process/governance graph and issue set, while unrelated cross-stream objects remain incomparable |
