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
- identify one lifecycle profile and declared state;
- contain canonical textual content;
- contain a references array, which MAY be empty;
- contain integrity evidence.

A conforming validator SHALL enforce the declared `date-time` format for `created_at`; treating the format only as an annotation is insufficient for C01 conformance.

A published object SHALL be immutable. A correction, rejection, supersession, rollback, or resolution SHALL create a new object or transition record and SHALL preserve the earlier evidence.

Schema validity alone SHALL NOT be interpreted as proof of identifier uniqueness, role authority, lifecycle legality, reference validity, digest correctness, or authenticated identity.

A task-oriented profile SHALL define one stable primary carrier identifier for each governed work item. Subsequent acceptance, report, review, decision, correction, and recovery objects SHALL reference that carrier or a profile-defined successor relation rather than create ambiguous mutable copies of the same task.

Every published governance object SHALL have one writer. A different participant SHALL respond through a new attributable object or transition record and SHALL NOT modify the published content of another writer's object.

## 9.3 Type Registry Requirements

A conforming implementation SHALL publish its document-type registry.

Each type definition SHALL specify:

- permitted creator roles;
- required fields;
- permitted reference relations;
- the applicable lifecycle profile;
- validation rules.

A document SHALL NOT serve simultaneously as its own independent review or approval unless the implementation profile permits a recorded exception and the exception identifies its approving authority.

## 9.4 Role Requirements

A role claim SHALL be validated against an authoritative role assignment active for the relevant object and action.
