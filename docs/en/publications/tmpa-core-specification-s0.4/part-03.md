        "hash_algorithm": { "type": "string", "minLength": 1 },
        "digest": { "type": "string", "minLength": 1 },
        "signature_algorithm": { "type": ["string", "null"] },
        "key_id": { "type": ["string", "null"] },
        "signature": { "type": ["string", "null"] }
      },
      "oneOf": [
        {
          "properties": {
            "signature_algorithm": { "type": "null" },
            "key_id": { "type": "null" },
            "signature": { "type": "null" }
          }
        },
        {
          "required": ["signature_algorithm", "key_id", "signature"],
          "properties": {
            "signature_algorithm": { "type": "string", "minLength": 1 },
            "key_id": { "type": "string", "minLength": 1 },
            "signature": { "type": "string", "minLength": 1 }
          }
        }
      ]
    },
    "extensions": {
      "type": "object",
      "additionalProperties": true
    }
  }
}
```

The object fields have the following operational meanings:

| Field | Reader obligation |
|---|---|
| `tmpa_version` | select the compatible Core object-schema line; unknown major versions are not silently downgraded |
| `id` | index canonical identity and detect same-ID conflicting content |
| `type` | resolve one versioned type-registry entry |
| `governed_work.id` | group objects that govern the same work item |
| `governed_work.primary_carrier_id` | identify the single stable carrier to which follow-on evidence must resolve |
| `stream` | establish attributable local order without using timestamps |
| `creator` and `role` | evaluate an authority claim against active assignments; these fields do not create authority |
| `lifecycle` | identify the profile and declared state; `transition`, when present, supplies explicit `from/action/to` evidence |
| `references` | construct typed ordering or non-ordering links according to the relation registry |
| `content` | carry the governed payload in the declared media type |
| `integrity` | identify the canonicalization and verification procedure for covered bytes |
| `extensions` | contain all profile-specific additions; unknown extensions are processed only under the declared profile |

The primary-carrier object uses its own `id` as `governed_work.primary_carrier_id`. Every other object for the same work item repeats that carrier identifier. A lifecycle-transition document type SHALL require `lifecycle.transition`; non-transition types MAY omit it. The type registry, rather than the generic single-object schema, enforces that conditional requirement.

Schema processors used for C01 SHALL implement JSON Schema Draft 2020-12 `format` assertion for `created_at`. A processor that treats `date-time` as annotation-only is insufficient. The linked S0.4 machine-readable artifact is the normative schema byte sequence; the embedded rendering above SHALL remain semantically identical to it.

| S0.4 machine-readable artifact | SHA-256 |
|---|---|
| [Governance Object Schema](/spec/tmpa/s0.4/governance-object.schema.json) | `738ef14d6425ddde211ca5a353533b1590a08dd5e783c2b7839ea607f3f3cc9e` |
| [Lifecycle Profile Schema](/spec/tmpa/s0.4/lifecycle-profile.schema.json) | `e6250933d6e923b6a8858abefadd546d5ecc99a781c6579eba1d1bcd77276990` |
| [Reader Result Schema](/spec/tmpa/s0.4/reader-result.schema.json) | `05f6e3e1eec4974240690a261710fabbb8ed22beecd8e504f7d6702c1e1dc9b3` |
| [Conformance Result Schema](/spec/tmpa/s0.4/conformance-result.schema.json) | `33073847c48edc49567db2c2b83a2817c29740db1a99dfe665e22aa3338ef529` |

The `lifecycle.state` field records the state declared for this immutable object at publication. It is not a mutable current-state field. The current authoritative lifecycle state is reconstructed from the valid object set, accepted transition evidence, and the applicable lifecycle profile.

A canonicalization profile must define the exact representation covered by the digest and, when signatures are used, the exact representation covered by the signature. It must also define how self-referential integrity fields are excluded or normalized. TMPA Core S0.4 requires that this profile be declared; it does not prescribe one universal byte-level canonicalization algorithm.

Schema validity is necessary but insufficient for acceptance into an authoritative governance view. A reader must still evaluate identifier uniqueness, type rules, stream order, authority, lifecycle legality, references, digest verification, and any applicable signature policy.

## 4.2 Canonical Textual Encoding Profile

A canonical textual representation is not defined merely by choosing JSON, YAML, or Markdown. A versioned canonicalization profile is complete only when independent implementations can produce the same covered byte sequence from the same governed content.

At minimum, the profile defines:

- character encoding and Unicode normalization form;
- line-ending normalization;
- deterministic field and collection ordering where order is not semantically significant;
- whitespace, escaping, quoting, and delimiter rules;
- numeric representation, including exponent, sign, and precision rules;
- timestamp syntax, timezone requirements, and fractional-second normalization;
- the distinction among absent, `null`, empty-string, and empty-collection values;
- whether textual bodies, including Markdown whitespace and line endings, are covered verbatim or normalized;
- how attachments and external evidence are represented through media type, byte length, content digest, and optional locator metadata;
- whether extension fields are covered by the digest and signature, and how unknown extensions are ordered or rejected;
- the schema, type-registry, and canonicalization-profile versions bound to the object;
- how self-referential integrity fields are excluded or normalized before hashing or signing.

Semantic equivalence is insufficient for integrity verification. Two objects that a human considers equivalent may produce different digests when they differ in Unicode form, line endings, numeric spelling, timestamp precision, field order, or extension treatment. C08 and C11 are therefore meaningful only relative to the same declared canonicalization profile and version.

An external attachment or mutable URL is not authoritative evidence merely because it is referenced. A profile claiming integrity for external content records a content digest and the metadata required to identify the covered bytes. A locator may assist retrieval, but the locator alone does not preserve the referenced evidence.

## 4.3 Aggregation and Governance-Reconstruction Procedure

Given a finite unordered collection `O` of source candidates and a fixed rule profile `P`, a conforming implementation applies two stages.

```text
AGGREGATE(O):
  1. Discover each source artifact as a source candidate without assigning governance meaning to
     discovery order, filesystem order, transport order, or modification time.
  2. Preserve source identity and bytes, then parse the candidate envelope.
     Retain parse failures as source evidence and deterministic diagnostics.
  3. Canonically index object ids, writer streams, sequence numbers, task
     carriers, references, lifecycle locations, and integrity metadata.
  4. De-duplicate byte-identical source observations without deleting their
     provenance; retain non-identical same-id variants as separate candidates.
  5. Return the source-preserving canonical candidate set C and aggregation diagnostics.

RECONSTRUCT(C, P):
  1. Validate object shape and document type.
     Retain invalid candidates for diagnostics, but exclude them from the
     authoritative candidate set.
  2. Recompute each digest under the declared canonicalization profile.
     Retain digest-mismatched objects as evidence of an integrity failure,
     but exclude them from the intact authoritative candidate set.
  3. Verify signatures when present. Record verification status and apply
     P's acceptance policy. An unverifiable signature never establishes
     authenticated integrity.
  4. Group intact candidates by object id.
     a. Same id and same canonical content: project one object.
     b. Same id and different canonical content: quarantine all variants
        from the authoritative graph and emit a duplicate-id conflict.
  5. Validate one-primary-carrier rules for task-oriented profiles and verify
     that follow-on reports, reviews, decisions, and corrections reference the
     carrier rather than creating ambiguous mutable task copies.
  6. Group accepted objects by writer stream and order by sequence.
     Detect duplicate sequence numbers and sequence gaps without inventing
     missing objects or using timestamps as substitutes.
  7. Build directed dependency edges only for relation types that P declares
     as ordering or lifecycle dependencies. Preserve other references as
     non-ordering graph links.
  8. Validate role authority, separation of duties, lifecycle source state,
     transition legality, preconditions, and required evidence.
     Invalid actions remain observable but do not change authoritative state.
  9. Detect missing references and cycles prohibited by P. Quarantine only
     the affected prohibited-cycle subgraph; retain unaffected valid objects.
 10. Construct the accepted partial-order process and governance graph from
     within-stream sequence edges and profile-defined cross-stream dependencies.
     Preserve unrelated nodes as concurrent and incomparable.
 11. When a canonical linear serialization is required for interchange or
     display, generate a deterministic topological serialization. Use object-id
     lexical order only as a tie-breaker among incomparable nodes; do not add
     those tie-breaker relations to the governance graph.
 12. Project task, message, workflow, responsibility, lifecycle, review,
     approval, recovery, and audit views.
 13. Canonically normalize both the reconstructed graph or view and the issue
     set, then return them together.
```

The composed operation is:

`R_P(A(O)) = (G, I)`

where `A(O)` is the source-preserving canonical candidate set, `G` is the reconstructed partial-order process and governance graph, and `I` is the canonical issue set. The procedure is governed by the following invariants:

- source discovery, enumeration, and arrival order do not affect the final canonical output for the same source set;
- aggregation preserves source evidence and does not silently decide governance conflicts;
- one governed task has one stable primary carrier under a task-oriented profile;
- every published object has one writer and belongs to one local serial stream;
- timestamps do not override stream sequence or explicit dependency;
- no cross-stream order is invented when the profile defines no causal or lifecycle relation;
- any canonical linear serialization is a representation of the graph, not additional governance truth;
- invalid, disputed, or rejected evidence is not silently erased;
- a conflict is resolved only by a new authorized governance object;
- the same canonical source set and fixed profile produce the same aggregated candidate set, reconstructed view, and issue set;
- a partial or disputed view remains distinguishable from an authoritative view.

Delayed evidence changes the available source set and may change the current view legitimately. A task-only set may be partial; the same process may become authoritative or disputed after reports, reviews, or decisions arrive. Determinism requires equal output for equal source sets, not identical output across different stages of an asynchronous process.

## 4.4 Conflict and Validation Handling

A reader applies the following behavior consistently with the normative requirements in Chapter 9:

| Condition | Required behavior |
|---|---|
| Schema or type invalid | retain source for diagnostics, exclude from authoritative reconstruction, emit validation issue |
| Digest mismatch | retain source as integrity-failure evidence, exclude from intact authoritative set |
| Signature absent | permit TMPA Core processing when other requirements pass; do not claim authenticated integrity |
| Signature unverifiable | emit signature issue and do not place object in an authenticated view |
| Same ID, same canonical content | safely de-duplicate for projection without changing source evidence |
| Same ID, different canonical content | quarantine all variants from authoritative graph and emit critical duplicate-ID issue |
| Missing reference | retain object in a partial view and emit unresolved-reference issue |
| Stream sequence gap | mark stream incomplete; do not infer the missing object or transition |
| Duplicate stream sequence | retain conflicting objects, mark affected stream non-conformant, and keep affected state partial or disputed |
| Timestamp conflict | ignore timestamp as authority; use sequence and profile-defined dependencies |
| Illegal lifecycle transition | retain attempted transition as evidence, do not alter authoritative state, and emit lifecycle issue |
| Unauthorized role action | retain attempted action as evidence, do not apply it, and emit authorization issue |
| Prohibited cycle | quarantine affected subgraph, report cycle, and continue reconstructing unaffected valid objects |
| Parallel contradictory reviews | preserve every valid review until an authorized resolution object exists |

---

# 5. Threat Model and Trust Assumptions

## 5.1 Protected Properties

TMPA is designed to protect the following properties:

- attribution of objects to declared creators and roles;
- detection of object modification after publication;
- visibility of lifecycle and authority violations;
- preservation of conflicting evidence;
- reconstruction of governed work after runtime interruption;
- separation of execution, review, and approval responsibilities.

## 5.2 Trust Roots

A deployment must identify its trust roots. These may include:

- an identity provider;
- a role-assignment authority;
- a key registry or enterprise PKI;
- a trusted storage boundary;
- a human administrator or governance board;
- a trusted protocol validator.

TMPA does not create a trust root merely by writing a role name into a document. A role claim is valid only when the implementation can verify that the creator was authorized to act under that role at the relevant time.
