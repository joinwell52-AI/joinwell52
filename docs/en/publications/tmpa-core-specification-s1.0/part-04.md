## 5.3 Threats Considered

A conforming implementation should consider:

- identity impersonation;
- unauthorized role claims;
- object tampering;
- replay of previously valid objects;
- illegal lifecycle transitions;
- omission of required evidence;
- fabrication of false but well-formed evidence at initial publication;
- equivocation through conflicting objects;
- compromised tools or connectors;
- prompt injection that causes unauthorized actions;
- deletion or withholding of evidence;
- clock skew and timestamp manipulation;
- automatic remediation triggered by an incorrect, stale, or adversarial audit finding;
- transitive delegation that expands rather than attenuates authority;
- privilege aggregation in which individually permitted evidence or capabilities combine into an unauthorized result;
- stale, replayed, or insufficiently revoked delegation evidence;
- path-composition risk in which individually permitted actions form an unauthorized sequence;
- nominally independent reviewers controlled by the same model, controller, credential, host, or administrative principal.

## 5.4 Malicious Participants and Storage-Surface Compromise

TMPA Core does not assume that every participant is honest. It preserves attribution, conflicting objects, rejected transitions, and validation issues so that misconduct can be detected or investigated.

### False-but-well-formed evidence at publication time

TMPA distinguishes **fabrication at publication time** from post-publication tampering. A malicious, compromised, or mistaken participant may publish a schema-valid, digest-consistent, lifecycle-legal, and even correctly signed `REPORT`, `REVIEW`, or `DECISION` whose factual claims are false. Core validation can establish structural validity, continuity, declared authority, and integrity of the published bytes; it cannot infer semantic truth from those properties. Authenticated Governance Conformance strengthens identity and authorization evidence, but a valid signature still proves origin and integrity rather than correctness.

Factual assurance therefore requires a declared evidence profile appropriate to the claim: tool receipts, externally verifiable outputs, reproducible execution, attached test results, independent data sources, cross-role verification under genuinely separate security principals, or human approval. When executor and reviewer share the same compromised controller, credential, evidence source, or administrative principal, nominal separation of duties may produce correlated fabrication rather than independent assurance. TMPA can preserve provenance, contradiction, and later correction; it does not detect covert collusion or guarantee that an initially published claim is true.

FCoP also exposes a protocol-specific attack surface because the filesystem is part of the protocol boundary. A participant with direct write permission may attempt to create an object inside `_lifecycle/done/`, alter a published artifact, remove evidence, replay a previously valid file, or create a path/event mismatch without using the authorized lifecycle operation. File presence alone must therefore not be treated as proof of validity.

A conforming reader should distinguish at least three cases:

1. **unauthorized insertion:** an artifact appears in a lifecycle location without a valid creator, role assignment, predecessor state, or transition record;
2. **post-publication mutation:** the content no longer matches its recorded digest or signature;
3. **state-evidence divergence:** the lifecycle path, transition history, references, and expected paired artifacts do not agree.

These attacks can be detected only to the extent that the deployment protects or independently verifies identity bindings, integrity records, append-only events, and storage history. If an attacker can both rewrite artifacts and replace every trusted integrity, identity, and audit record, the local filesystem view cannot establish a truthful history. Stronger deployments may add restricted write permissions, append-only or versioned storage, remote notarization, transparency logs, replication, or cryptographic signatures. These are deployment controls beyond the minimal FCoP filesystem profile.

TMPA Core does **not** provide Byzantine consensus. If the identity provider, role authority, key registry, trusted storage boundary, and validators are all compromised, TMPA cannot guarantee a truthful history. A deployment requiring Byzantine fault tolerance must add an external consensus, replication, notarization, or transparency-log mechanism.

An inspect-only audit profile narrows one failure impact: a compromised inspector can generate misleading findings or recommendations, but the audit function does not directly mutate governed business state. This is not complete protection. A human or external agent may still execute a harmful recommendation, so recommendation provenance, review, approval, and execution evidence remain required.

## 5.5 Levels of Role and Identity Separation

TMPA distinguishes logical responsibility separation from security-domain separation. A deployment may implement one or more of the following levels:

1. **prompt-level role separation:** participants receive different natural-language role instructions, but may share the same runtime, credential, and storage permissions;
2. **process-level identity separation:** distinct agent or process instances have stable runtime identities and separately attributable sessions;
3. **credential-level separation:** participants use distinct credentials, keys, or delegated authorization grants whose scopes can be validated and revoked independently;
4. **host-level isolation:** operating-system accounts, containers, sandboxes, or mandatory access controls prevent one participant from modifying another participant's protected evidence directly;
5. **administrative-domain separation:** independent organizations, trust roots, audit services, or transparency systems reduce the risk that one administrator can rewrite every relevant record.

Prompt-level separation can support workflow clarity, but it is not a security boundary. Process-level identity improves attribution but does not prevent credential sharing or cross-process storage mutation. Strong claims of independent review, authenticated responsibility, or tamper resistance require deployment controls at the credential, host, or administrative-domain levels appropriate to the threat model.

Under the minimal FCoP profile, a filename, filesystem owner, role document, or frontmatter `sender` is **declarative attribution**. It becomes verified attribution only when the deployment validates the binding among the acting process, credential or key, active role assignment, and protected write boundary. Several logical roles controlled by one model, one service account, or one unrestricted host must not be described as independent security principals merely because their prompts or filenames differ.

A verified delegation chain additionally distinguishes the delegating principal, delegated task or intent, granted capability set, attenuation rules, temporal validity, execution count or revocation conditions, and each downstream re-delegation. A prior `TASK`, `REPORT`, or role label does not authorize a new action unless the active identity and authorization profile explicitly recognizes it as current delegation evidence.

## 5.6 AI Agent Identity

An AI agent should not be treated as a self-authenticating legal identity. FCoP nevertheless requires the agent to receive an explicit operational identity that it can read: its role, team context, responsibility boundary, and current work scope. The authority behind that operational identity still derives from a human or organizational principal, deployment identity, role-assignment authority, runtime credential, and policy scope.

A useful identity record distinguishes:

- organizational principal;
- human authorizer;
- agent instance;
- model or runtime version;
- active role;
- delegated permissions;
- credential or key identifier.

This distinction prevents an agent’s actions from being attributed only to a borrowed human or service account.

## 5.7 Security Claims

An implementation must state which claim it supports:

| Claim | Minimum requirement |
|---|---|
| textual traceability | persistent canonical objects and references |
| tamper detection | deterministic digest verification against preserved or trusted integrity metadata |
| authenticated integrity | verified signature and trusted key binding |
| authorization enforcement | validated role assignment and action policy |
| semantic claim verification | claim-specific evidence, reproducible outputs, or independent domain verification outside TMPA Core |
| non-repudiation | legal and cryptographic profile beyond TMPA Core |
| Byzantine resilience | external consensus or equivalent mechanism |

An implementation must not claim a stronger property than its deployed controls provide.

---

# 6. Lifecycle and Authority Evaluation

## 6.1 Required Registries

An implementation profile publishes versioned lifecycle, role, and relation registries. A lifecycle-registry entry contains: profile identifier and version; state set; initial and terminal states; action set; legal `from/action/to` tuples; roles permitted for each action; required references and preconditions; separation-of-duty rules; and any authorized reopening or recovery rules. A role-registry entry contains: role identifier; assignment-object type; permitted document types and lifecycle actions; scope dimensions; incompatible roles; assigning authority; and revocation semantics. A relation-registry entry states whether the relation is ordering, non-ordering, required, or acyclic.

Registry bytes are inputs to reconstruction. Their versions and digests are therefore part of the reader input contract and conformance report; changing a registry while retaining its identifier does not produce the same fixed profile.

## 6.2 Transition Evaluation Order

For a candidate transition `x`, profile `P`, canonical candidate set `C`, and current reconstructed state `s`, evaluation follows this fixed order:

```text
EVALUATE_TRANSITION(x, s, C, P):
  1. validate object schema, type rule, identity, and integrity
  2. resolve the governed work item, primary carrier, and lifecycle profile
  3. reconstruct the unique current state from accepted predecessor evidence
  4. verify that x.from equals that current state
  5. verify that (x.from, x.action, x.to) is a legal transition tuple
  6. resolve an active role assignment and validate action scope
  7. evaluate separation-of-duty rules and authorized exceptions
  8. resolve required references, preconditions, and evidence
  9. assign valid, invalid, or undetermined with canonical issues
 10. apply x.to only when the transition judgment is valid
```

A proven violation—such as an illegal tuple, revoked authority, out-of-scope action, or prohibited role combination—produces `invalid`. Missing evidence—such as an unavailable assignment, unresolved predecessor, absent required reference, or ambiguous current state—produces `undetermined`. Only `valid` transitions change the authoritative lifecycle projection.

## 6.3 State Reconstruction

For each governed work item, the reader starts from the lifecycle profile's initial state after accepting a valid primary carrier. It then evaluates transition objects in the partial order established by writer-stream sequence and declared ordering dependencies. Wall-clock time does not select the next transition.

If two valid transition candidates consume the same source state and their effects are incompatible without an ordering relation or authorized resolution, the current state is `undetermined` and the view is `disputed`. The reader retains both branches and does not choose the latest arrival. A terminal state remains terminal unless the lifecycle registry explicitly defines an authorized recovery or reopening transition.

## 6.4 Authority Time and Revocation

The reader validates authority against assignment and revocation evidence applicable to the action. `created_at` alone is not a trusted authorization clock. A profile that makes time-sensitive authority claims defines the trusted time or sequence evidence used to determine whether an assignment was active.

When evidence proves that authority was inactive, the action is `invalid`. When the relevant authority interval cannot be determined, the action is `undetermined`. A profile also declares whether revocation is prospective or may invalidate a defined class of earlier actions; the reader does not invent retroactive effect.

# 7. Three-Valued Governance Logic

## 7.1 Judgment Domain

Every governed conclusion receives exactly one semantic judgment from `J = {valid, invalid, undetermined}`. `valid` means all mandatory acceptance conditions are established. `invalid` means at least one mandatory rule is proven violated. `undetermined` means neither acceptance nor violation can be established because required evidence is missing, conflicting, ambiguous, or awaiting authorized resolution.

The values describe governance knowledge under a fixed source set and profile. They do not assert the factual truth of the governed payload.

## 7.2 Primitive Classification Rules

| Condition | Judgment | View reason |
|---|---|---|
| all required checks established and no governing issue remains | `valid` | authoritative |
| schema/type failure, digest mismatch, explicit authority denial, illegal transition, or proven separation-of-duty violation | `invalid` | rejected or quarantined |
| required reference, assignment, predecessor, stream element, or decision is missing | `undetermined` | partial or pending_human |
| multiple valid but incompatible claims lack an authorized resolution | `undetermined` | disputed |
| optional signature absent under Core | unchanged | unauthenticated assurance label |
| required authentication cannot be established under an authenticated profile | `undetermined` or `invalid`, as the published profile declares | unauthenticated or quarantined |

## 7.3 Composition Rules

Mandatory conjunction `ALL(a,b)` and alternative satisfaction `ANY(a,b)` use the following truth table:

| `a` | `b` | `ALL(a,b)` | `ANY(a,b)` |
|---|---|---|---|
| valid | valid | valid | valid |
| valid | undetermined | undetermined | valid |
| valid | invalid | invalid | valid |
| undetermined | valid | undetermined | valid |
| undetermined | undetermined | undetermined | undetermined |
| undetermined | invalid | invalid | undetermined |
| invalid | valid | invalid | valid |
| invalid | undetermined | invalid | undetermined |
| invalid | invalid | invalid | invalid |

A required dependency with `invalid` judgment makes the dependent acceptance condition `invalid`; a required dependency with `undetermined` judgment propagates `undetermined`. Two incompatible `valid` claims do not cancel each other or become `invalid`; their unresolved combined conclusion is `undetermined` and disputed. A resolution changes the conclusion only when the resolution object is itself valid, authorized, and explicitly references the conflict it resolves.

Profiles may define domain-specific aggregations, but they publish their truth tables and may not map missing or conflicting mandatory evidence directly to `valid`.

## 7.4 Judgment and View Mapping

Judgment is semantic; view state explains the operational reason. `valid` maps to `authoritative`. `invalid` maps to `rejected` for an action or `quarantined` when evidence or a subgraph is excluded. `undetermined` maps to `disputed`, `partial`, or `pending_human` according to the canonical issue causes.

When one subject has several causes, all causes remain in the issue set. If one primary view label is required, the ordering is `quarantined` → `rejected` → `disputed` → `partial` → `pending_human` → `authoritative`. Authentication remains a separate assurance status and does not create a fourth semantic judgment.

# 8. Reader Input and Output Contract

## 8.1 Input Bundle

A deterministic reader invocation fixes:

- Core object-schema version and digest;
- conformance-profile identifier, version, and digest;
- type, lifecycle, role, relation, integrity, and canonicalization registries with versions and digests;
- the finite source-candidate multiset, where each candidate has a stable `source_id`, media type, exact bytes, and byte digest;
- declared trust roots and authentication policy;
- reader implementation identifier and version;
- canonical output format version.
- every implementation extension and whether it affects canonical semantics.

Two invocations are comparable for C11 only when these inputs are equal. Environment-specific locators, discovery timestamps, log order, memory addresses, and localized diagnostics are not canonical inputs.

## 8.2 Canonical Result

The reader emits one result envelope with at least:

```json
{
  "core_version": "S1.0",
  "output_version": "1",
  "profile": {},
  "reader": { "id": "<id>", "version": "<version>" },
  "source_set_digest": "sha256:<hex>",
  "judgment": "valid | invalid | undetermined",
  "view_state": "authoritative | rejected | quarantined | partial | disputed | pending_human",
  "nodes": [],
  "edges": [],
  "issues": []
}
```

Each node and edge SHALL contain a stable identifier and its source-object identifier. Each issue SHALL contain a stable `issue_id` and `source_id`; it records `source_object_id` when parsing produced one. Nodes SHOULD additionally record canonical digest, governed-work ID, primary-carrier ID, type, stream position, judgment, view state, and retained source IDs. Edges SHOULD record relation and ordering semantics. Issues SHALL record code and severity and SHOULD record the affected judgment, normative rule, and deterministic parameters.

Core issue codes are: `SCHEMA_INVALID`, `UNKNOWN_TYPE`, `INTEGRITY_MISMATCH`, `SIGNATURE_UNVERIFIED`, `DUPLICATE_ID_CONFLICT`, `PRIMARY_CARRIER_CONFLICT`, `STREAM_DUPLICATE_SEQUENCE`, `STREAM_GAP`, `AUTHORITY_UNDETERMINED`, `AUTHORITY_DENIED`, `SOD_VIOLATION`, `LIFECYCLE_UNDETERMINED`, `ILLEGAL_TRANSITION`, `MISSING_REFERENCE`, `PROHIBITED_CYCLE`, `UNRESOLVED_CONFLICT`, `CLAIM_EVIDENCE_MISSING`, `ACCEPTANCE_UNDETERMINED`, `HUMAN_APPROVAL_REQUIRED`, `CHILD_WORK_OPEN`, `RECIPROCITY_MISSING`, and `STATE_EVIDENCE_CONFLICT`. Profiles namespace additional codes and do not redefine Core codes.

## 8.3 Canonicalization and Ordering

The source-set digest is computed from the deterministically sorted list of `(source_id, byte_digest)` pairs under the declared output profile. Nodes sort by `(id, source_object_id)`. Edges sort by `(source_id, relation, target_id, id)`. Issues sort by `(severity, code, object_id, relation, target_id, issue_id)`, using severity order `critical`, `error`, `warning`, `info`; absent tuple fields are empty strings.

An `issue_id` is derived from the canonical tuple `(code, object_id, relation, target_id, profile_digest)` under the output profile. Human-readable messages, stack traces, local paths, and execution timestamps are excluded from canonical equality. Object keys, subjects, retained source IDs, nodes, edges, and issues use Unicode code-point order after profile-defined normalization; locale-sensitive collation is not canonical.

The canonical result serialization is byte-stable for equal fixed inputs. Non-canonical logs and user-interface ordering may vary, but they do not alter the result envelope used for C11.

## 8.4 Failure and Partial Output

The reader returns a canonical result and issue set even when some candidates are malformed or a subgraph is invalid. It may fail the entire invocation only when the fixed profile, schema, registry bundle, or output canonicalization contract cannot be loaded or verified. Such an invocation failure is distinct from an `invalid` governance judgment and is reported as a conformance-run error.

# 9. Normative TMPA Core Specification

## 9.1 Normative Language

The terms **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** define conformance requirements. Mandatory requirements are expressed with MUST, MUST NOT, SHALL, or SHALL NOT.

Descriptive examples, implementation observations, and future-work statements outside this chapter do not create additional TMPA Core requirements unless they are incorporated explicitly by a named conformance profile.

## 9.2 Object Requirements

Every governance object MUST:

- conform to the TMPA Core schema and its published document-type definition;
- have a globally unique identifier within its governance domain;
- have exactly one declared creator identity;
- identify exactly one responsible role;
- identify one stream and one positive sequence number;
- identify one document type;
- identify one governed work item and exactly one primary carrier identifier;
- identify one lifecycle profile and declared state;
- contain canonical textual content;
- contain a references array, which MAY be empty;
- contain integrity evidence.

A conforming validator SHALL enforce the declared `date-time` format for `created_at`; treating the format only as an annotation is insufficient for C01 conformance.

An object type that records a lifecycle transition SHALL include one complete `from`, `action`, and `to` tuple. A non-transition type SHALL NOT use that tuple to create an implicit state change.

A published object SHALL be immutable. A correction, rejection, supersession, rollback, or resolution SHALL create a new object or transition record and SHALL preserve the earlier evidence.

Schema validity alone SHALL NOT be interpreted as proof of identifier uniqueness, role authority, lifecycle legality, reference validity, digest correctness, or authenticated identity.

A task-oriented profile SHALL define one stable primary carrier identifier for each governed work item. Subsequent acceptance, report, review, decision, correction, and recovery objects SHALL reference that carrier or a profile-defined successor relation rather than create ambiguous mutable copies of the same task.

Every published governance object SHALL have one writer. A different participant SHALL respond through a new attributable object or transition record and SHALL NOT modify the published content of another writer's object.

## 9.3 Type Registry Requirements

A conforming implementation SHALL publish its document-type registry.

The registry SHALL have a stable identifier, version, and byte digest. A reader SHALL bind its result to that exact registry revision.

Each type definition SHALL specify:

- permitted creator roles;
- required fields;
- permitted reference relations;
- the applicable lifecycle profile;
- whether the type requires a lifecycle transition tuple;
- validation rules.

A document SHALL NOT serve simultaneously as its own independent review or approval unless the implementation profile permits a recorded exception and the exception identifies its approving authority.

## 9.4 Role Requirements

A role claim SHALL be validated against an authoritative role assignment active for the relevant object and action.
