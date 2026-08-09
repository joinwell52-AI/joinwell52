Let `A` be the set of responsible writers. Every published object has exactly one writer, and each writer `a ∈ A` publishes an independently attributable serial stream:

`S_a = ⟨o_{a,1}, o_{a,2}, ..., o_{a,n}⟩`

The sequence inside `S_a` is authoritative local order. Every object has a positive sequence number, and `(stream_id, sequence)` identifies its position within that writer's responsibility history. Creation time is informative but not authoritative for stream order.

At observation time `τ`, the available candidate collection may contain different prefixes of different streams:

`O_τ = ⋃_{a ∈ A} prefix(S_a, k_a(τ))`

The functions `k_a(τ)` need not advance together. One participant may publish a task while another is offline; a report may appear before an independent review; several writers may progress concurrently. This is how multiple serial streams form asynchronous parallelism. TMPA does not require all participants to share a clock, remain online together, or commit to one global event log.

Within-stream predecessor relations provide local order. Explicit references and profile-defined lifecycle dependencies provide cross-stream causal edges. If two objects have neither a within-stream relation nor a profile-defined cross-stream dependency, they remain concurrent and incomparable.

Single-writer objects and separate responsibility streams remove the primary **semantic** shared-write conflict: several agents do not compete to edit one authoritative record. They do not eliminate every storage-level contention, filesystem race, or infrastructure failure; profiles must still define atomic publication, duplicate handling, and recovery behavior.

The write model can be summarized as:

> **One task has one primary carrier. One writer owns each published object. Each writer remains serial. Multiple streams progress asynchronously to form parallel collaboration.**

## 3.6 Read-Side Aggregation and Governance Reconstruction

TMPA's read plane has two conceptually separate stages: **source aggregation** and **governance reconstruction**.

Let `O_τ` be the finite collection of source candidates visible at observation time `τ`. A source-preserving aggregator `A` discovers source artifacts, retains source identity and bytes, parses candidate envelopes, indexes identifiers and references, and applies deterministic normalization needed by the reader:

`C_τ = A(O_τ)`

Aggregation does not decide which claim is true, silently repair a conflict, invent missing evidence, or convert arrival order into governance order. Its purpose is to construct the complete canonical candidate set `C_τ` available to the governance reader while retaining the provenance of every source candidate.

Let `P` be a fixed rule profile containing schemas, type rules, role assignments, lifecycle rules, relation semantics, canonicalization rules, conflict policy, and output-normalization rules. The governance reader then computes:

`R_P(C_τ) = (G_τ, I_τ)`

where `G_τ` is the canonical reconstructed partial-order process and governance graph and `I_τ` is the canonical issue set. `G_τ` represents workflow progress, responsibility, lifecycle, review, approval, rejection, recovery, and audit relations while preserving local stream order, explicit cross-stream dependencies, and concurrency among incomparable objects. It is not an authoritative total timeline.

For brevity, later sections may write `R_P(O)` for the composed pipeline `R_P(A(O))`. The primary determinism requirement is permutation invariance. For every permutation `π` of the same canonical candidate collection:

`R_P(A(π(O))) = R_P(A(O))`

The equality applies to canonical serialization of both `G` and `I`, not to incidental in-memory order or diagnostic formatting. Delayed arrival changes the currently available set and may legitimately change a view from partial to authoritative or disputed; different enumeration orders of the same set must not change the result.

**Determinism proposition.** Let `O` be a finite source multiset and `P` a fixed profile. Assume that: (1) source normalization is a pure function of source identity and covered bytes; (2) duplicate classification, validation, authority checks, lifecycle checks, and issue identifiers are functions of canonical object values and `P`; (3) graph edges are derived only from within-stream sequence and profile-declared relations; and (4) graph and issue serialization use published deterministic ordering and tie-break rules. Under these conditions, the composed operation `R_P(A(O))` is invariant to source enumeration order.

**Proof sketch.** Aggregation maps any enumeration of `O` to the same canonical indexed candidate multiset because indexing and duplicate classification depend on canonical source values rather than discovery position. Per-object validation is order-independent. Set-level checks—duplicate identifiers, stream gaps, missing references, prohibited cycles, authority conflicts, and lifecycle conflicts—are computed over the same canonical sets and relations. The accepted node set and directed edge set are therefore identical for every permutation. Canonical issue identifiers and deterministic ordering produce the same `I`; canonical graph serialization and a stable tie-break used only for representing incomparable nodes produce the same serialized `G`. Consequently, every permutation yields byte-equivalent canonical outputs. This argument establishes permutation invariance under the stated profile contract; it does not prove semantic truth, profile correctness, resistance to compromised trust roots, or equality across different evidence sets. A mechanized proof and executable corpus remain required for stronger assurance.

A reconstructed subject or subgraph is classified as:

- **authoritative** when required evidence is valid and no unresolved integrity, authority, lifecycle, ordering, or required-reference issue affects the conclusion;
- **partial** when required evidence is missing or a stream or dependency is incomplete;
- **disputed** when multiple valid but incompatible governance claims remain unresolved;
- **quarantined** when a profile-defined integrity, identity, duplicate-ID, or prohibited-cycle condition excludes the affected evidence from authoritative reconstruction.

Authentication is an orthogonal assurance label. An object or view may be structurally authoritative under TMPA Core while remaining unauthenticated under a stronger identity profile; it must not then be presented as authenticated integrity.

TMPA requires **conflict preservation**: valid contradictory objects remain represented until a new authorized resolution object exists. It also requires **evidence preservation under extension**: adding candidate evidence does not erase prior source evidence. TMPA does not assume monotonicity of governance status under arbitrary set extension, because newly added valid evidence may legitimately change a previously authoritative view into a partial, disputed, or quarantined one.

Read-side reconstruction is therefore not the whole architecture; it is the stage that converts durable textual messages and asynchronous serial streams into a coherent process and governance result. A deterministic topological serialization may be generated for interchange or display, but that serialization does not add governance order between incomparable nodes. C11 operationalizes source-aggregation and reconstruction determinism; C03, C04, C09, C10, and C12 exercise identity, ordering, dependency, cycle, and conflict-preservation behavior. A mechanized proof of the full reconstruction properties remains future work.

## 3.7 Integrity and Signature Evidence

TMPA separates three properties that are often conflated:

1. **Attribution:** an object declares a creator and responsible role.
2. **Integrity:** modification of a published object can be detected.
3. **Authenticated integrity:** the object is cryptographically bound to a verified identity or key.

TMPA Core requires attribution and integrity evidence. A deployment may claim authenticated integrity only when it applies a trusted identity, signature, and key-management profile.

An integrity record identifies:

- the canonicalization profile;
- the hash algorithm;
- the content digest;
- predecessor or referenced digests when required by the profile;
- an optional signature algorithm;
- an optional key identifier;
- an optional signature value.

A role label is not a cryptographic signature. A digest without a trusted identity binding can detect modification but cannot prove who created the object. A valid signature proves origin and integrity under the deployed trust model; it does not prove that the signed content is semantically true.

## 3.8 Governance Closure Abstracted from FCoP Practice

S0.6 derives vendor-neutral Core constraints from FCoP protocol specifications, Rules, Schemas, and ADRs, together with bounded observations of the `fcop` / `fcop-mcp` reference implementation. FCoP is a protocol and reference profile, not an application and not the definition of TMPA; the Python packages are only its reference implementation. This section therefore absorbs portable semantics rather than `_lifecycle/`, filename, or MCP-tool names.

### 3.8.1 Current State, Transition History, and Business Completion

A profile MUST define current-state observations separately from transition-history evidence. FCoP uses path as current stage and append-only `transitions` as history; a database profile may use a current-state row and event table. When they conflict, the reader MUST preserve both sources and emit `STATE_EVIDENCE_CONFLICT` or a profile-declared canonical equivalent. It MUST NOT resolve the conflict by selecting the latest timestamp.

Entering `done`, a terminal state, or an archive MUST NOT automatically establish business acceptance. The executor report is an attributable delivery claim; only a review or acceptance object issued by an authorized and sufficiently independent actor can establish business completion. Without that object, the completion conclusion is `undetermined` and the view is `partial` or `pending_human`.

### 3.8.2 Reciprocity, Claims, and Evidence Gates

A work-oriented profile MUST define reciprocal relations between work requests and responses. Every accepted work object SHALL eventually relate to a report, issue, rejection, cancellation, or follow-up work object; silence cannot be inferred as success.

Completion, failure, recovery, and acceptance assertions MAY be represented by `claims`. Every claim has a stable claim identifier, predicate, subject, and evidence-object identifier set. If a completion claim lacks tests, artifacts, commits, reports, or other evidence required by the profile, the reader SHALL emit `CLAIM_EVIDENCE_MISSING` and retain `undetermined`. This rule governs unsupported claims; it does not claim to eliminate model hallucinations.

### 3.8.3 Parent-Child Work and Closure Roll-up

Child work SHALL identify its parent through `governed_work.parent_id` or a profile-declared equivalent. A shared thread may be represented by `thread_id`, but a thread MUST NOT replace the parent-child scope relation. When a parent has an unfinished child, an unhandled blocked child, or a child without a reciprocal outcome, a parent completion claim SHALL emit `CHILD_WORK_OPEN` and remain `undetermined`.

Scope correction MUST be expressed by a new object, supersession relation, or new derivation relation rather than in-place rewriting of a published parent. The reader SHALL preserve the parent, every child, their reciprocal outcomes, and the roll-up conclusion.

### 3.8.4 Governance Decisions, Risk, and Human Approval

A lifecycle review stage and a governance-decision object are orthogonal mechanisms. A profile MUST assign them different type or relation semantics. An implementation MUST NOT infer independent review merely because work entered a `review` stage, and a governance review must not replace the execution report.

A profile MAY use the risk levels `low`, `medium`, `high`, and `irreversible`. If an object declares that human approval is required, or its risk level belongs to the profile's human-approval set, the reader SHALL emit `HUMAN_APPROVAL_REQUIRED`, judgment `undetermined`, and view `pending_human` until a valid human-approval object exists. An agent cannot satisfy the requirement by rewriting its own decision.

### 3.8.5 Failure, Recovery, Inspection, and Drift

A profile MUST publish finite failure-type and recovery-action registries and define how retry, resume, rollback, abort, and escalation produce new objects. Failure MUST NOT be hidden by a success report; a recovery object MUST reference both the triggering failure and the recovered work.

Protocol inspection and governance alerts are observations, not automatic remediation. INSPECTION, ALERT, or equivalent objects MAY report blocking, normative, or hygiene findings, but suggested commands MUST NOT be interpreted by the reader as executed transitions. Independent governance signals and executor self-reports MUST be classified separately.

# 4. Canonical Object, Encoding, and Reconstruction

## 4.1 Canonical Object Schema

The following JSON Schema defines the TMPA Core S0.6 canonical object representation. It constrains the shape of one governance object. Cross-object properties—including identifier uniqueness, stream continuity, role authorization, lifecycle legality, reference resolution, and deterministic reconstruction—are evaluated by the applicable profile and reader rather than by this single-object schema.

Implementations may add profile-specific fields only under `extensions`. They must preserve the meaning of the core fields.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "urn:tmpa:schema:governance-object:s0.6",
  "title": "TMPA Governance Object S0.6",
  "$comment": "Structural validation does not establish role authority, lifecycle legality, cross-object uniqueness, or integrity verification.",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "tmpa_version",
    "id",
    "type",
    "governed_work",
    "stream",
    "creator",
    "role",
    "created_at",
    "lifecycle",
    "references",
    "content",
    "integrity"
  ],
  "properties": {
    "tmpa_version": { "const": "S0.6" },
    "id": { "type": "string", "minLength": 1 },
    "type": { "type": "string", "minLength": 1 },
    "governed_work": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "primary_carrier_id"],
      "properties": {
        "id": { "type": "string", "minLength": 1 },
        "primary_carrier_id": { "type": "string", "minLength": 1 },
        "parent_id": { "type": "string", "minLength": 1 },
        "thread_id": { "type": "string", "minLength": 1 }
      }
    },
    "stream": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "sequence"],
      "properties": {
        "id": { "type": "string", "minLength": 1 },
        "sequence": { "type": "integer", "minimum": 1 }
      }
    },
    "creator": { "type": "string", "minLength": 1 },
    "role": { "type": "string", "minLength": 1 },
    "created_at": { "type": "string", "format": "date-time" },
    "lifecycle": {
      "type": "object",
      "additionalProperties": false,
      "required": ["profile", "state"],
      "properties": {
        "profile": { "type": "string", "minLength": 1 },
        "state": { "type": "string", "minLength": 1 },
        "transition": {
          "type": "object",
          "additionalProperties": false,
          "required": ["from", "action", "to"],
          "properties": {
            "from": { "type": "string", "minLength": 1 },
            "action": { "type": "string", "minLength": 1 },
            "to": { "type": "string", "minLength": 1 }
          }
        }
      }
    },
    "references": {
      "type": "array",
      "uniqueItems": true,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["relation", "target"],
        "properties": {
          "relation": { "type": "string", "minLength": 1 },
          "target": { "type": "string", "minLength": 1 }
        }
      }
    },
    "claims": {
      "type": "array",
      "uniqueItems": true,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["id", "predicate", "subject", "evidence"],
        "properties": {
          "id": { "type": "string", "minLength": 1 },
          "predicate": { "type": "string", "minLength": 1 },
          "subject": { "type": "string", "minLength": 1 },
          "evidence": { "type": "array", "uniqueItems": true, "items": { "type": "string", "minLength": 1 } }
        }
      }
    },
    "risk": {
      "type": "object",
      "additionalProperties": false,
      "required": ["level", "requires_human_approval"],
      "properties": {
        "level": { "enum": ["low", "medium", "high", "irreversible"] },
        "requires_human_approval": { "type": "boolean" }
      }
    },
    "content": {
      "type": "object",
      "required": ["media_type", "body"],
      "properties": {
        "media_type": { "type": "string", "minLength": 1 },
        "body": {}
      },
      "additionalProperties": false
    },
    "integrity": {
      "type": "object",
      "additionalProperties": false,
      "required": ["canonicalization", "hash_algorithm", "digest"],
      "dependentRequired": {
        "signature_algorithm": ["key_id", "signature"],
        "key_id": ["signature_algorithm", "signature"],
        "signature": ["signature_algorithm", "key_id"]
      },
      "properties": {
        "canonicalization": { "type": "string", "minLength": 1 },
