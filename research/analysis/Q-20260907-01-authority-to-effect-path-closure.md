---
date: "2026-09-07"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260907-01
column: digital-employee
article_type: technical-analysis
project_relevance: none
source_reading: "research/reading/Q-20260907-01-transitive-authority-to-effect-security-closure.md"
---

# Research Analysis — Individual Worker Safety Does Not Close the Authority-to-Effect Path

## Research question

When every worker in a digital-employee system passes its local safety checks, what additional evidence is required to show that untrusted influence cannot still travel through messages, shared state, collective decisions, delegated authority, tools, or recovery and reach a protected effect?

## Research themes and subject kind

- **Themes:** cross-principal security; transitive authority; provenance; path closure; shared-state contamination; recovery evidence
- **Subject kinds:** governance-problem; architecture-mechanism; failure-mode; cross-sample synthesis
- **Sample:** a 197-work multi-agent security systematization with a separate audit of 44 evaluation works

## Research value

### Failure

Local checks prove only local propositions. A worker may correctly reject a hostile message while the same influence survives in shared memory, enters a summary without its origin, reaches an honest intermediary, affects a collective decision, or becomes a privileged action through delegated tools. Each individual transition can look valid while the complete execution violates the original authorization purpose.

This produces the individually-safe-worker fallacy: component compliance is treated as system safety even though the protected object is an end-to-end authority-to-effect chain. The failure is amplified by long-lived state. Quarantining the original sender does not revoke credentials, artifacts, delegated rights, spawned principals, or memories already derived from its influence.

### Findings

The same-date Reading Note examines a systematization covering 197 in-scope works and a focused audit of 44 evaluation and benchmark works. The source organizes security around an execution-centered adversary–interaction–risk representation, six interaction interfaces, and eight recurring attack paths. It evaluates defenses through five fields: path target, observation, intervention, trust boundary, and recovery.

The broad evidence supports two bounded findings. First, local protection does not establish closure because attack paths can compose across principals and interfaces. Second, containment does not establish recovery after influence has propagated into durable state or authority.

The audit also reports heterogeneous threat models, configurations, metrics, and attack-success definitions. A complete trace improves attribution, but does not itself prove that interaction caused the harm. Relation-removal counterfactuals are therefore useful where the protected property remains meaningful after the relation is removed.

### Mechanism

A governed runtime should model the security object as a provenance-preserving path:

```text
origin
  -> admitted message or artifact
  -> principal and state transformations
  -> delegated authority
  -> protected effect
```

For each protected effect, the runtime should record:

1. **Path target:** the system-level risk and route segment the control is intended to break.
2. **Observation:** which messages, edges, principals, state, subgraphs, or traces the control can actually see.
3. **Intervention:** what it can block, rewrite, reroute, quarantine, revoke, or repair, and at which time.
4. **Trust boundary:** which identities, coordinators, logs, topology, membership, or synchrony assumptions must remain valid.
5. **Recovery:** how derivative state and authority are located, revoked, repaired, and re-verified after containment.

These fields are evidence identities, not a universal product schema. Their value is that a positive local test cannot silently stand in for route coverage, intervention reach, trust assumptions, or post-failure restoration.

### Implication

Authorization should remain traceable through transformations. “Worker X may call tool Y” is insufficient when X was influenced by a low-authority principal through shared state. The relevant evidence binds the origin, transformations, intermediate principals, delegated rights, and final effect.

A system-level gate can then ask whether any admissible alternate route remains from the untrusted origin to the protected effect under current membership, topology, tool permissions, and trust assumptions. This is an architectural inference from the research, not an algorithm proven by the source.

## Evidence claims

### E1 — independent-evidence

**Claim:** The primary systematization includes 197 multi-agent security works and separately audits 44 evaluation works.

**Source:** https://arxiv.org/html/2609.00595v1

**Strength:** reports. **Independent:** true. **Independent actor:** the study authors and reviewed research corpus.

### E2 — source-reported-claim

**Claim:** The source models security across six interaction interfaces and eight recurring attack paths, then evaluates defenses by path target, observation, intervention, trust boundary, and recovery.

**Source:** same primary study as captured in the same-date Reading Note.

**Strength:** reports. **Independent:** false; primary-study synthesis.

### E3 — source-reported-claim

**Claim:** The synthesis explicitly distinguishes local protection from end-to-end path closure and containment from recovery.

**Source:** same primary study.

**Strength:** reports. **Independent:** false.

### E4 — our-observation

**Claim:** A locally authorized tool call can still be globally unsafe when upstream influence has lost provenance or acquired authority through intermediate principals.

**Source:** analytical comparison of the interaction and authority-transfer surfaces.

**Strength:** observed. **Independent:** false.

### E5 — our-interpretation

**Claim:** Governed digital employees should bind authorization and recovery evidence to the full origin-to-effect lineage and test alternate routes under explicit trust assumptions.

**Source:** bounded architecture synthesis from E1–E4.

**Strength:** supports. **Independent:** false.

## Contradictions and counterarguments

Complete end-to-end visibility can centralize sensitive telemetry and create a new high-value control-plane target. Path evidence should therefore be minimized and scoped; better provenance does not justify unlimited observation.

A global observer may see more routes but depend on coarser or more trusted data. Local observers can offer precise context but miss alternate paths. The answer is not automatically one central monitor; the governance requirement is to state the observation coverage and residual blind spots.

Relation-removal counterfactuals also have limits. Removing a relationship may change the task so substantially that the protected property is no longer comparable. Counterfactual tests should be used only when the modified system still answers a meaningful security proposition.

## Bounded research judgment

The strongest reusable conclusion is: **multi-agent safety is an end-to-end execution property, not the sum of local worker checks.** A safety claim needs evidence that the complete authority-to-effect route is observed and interruptible under declared trust assumptions, that alternate paths are assessed, and that derivative state and authority can be recovered after propagation.

The study supplies a broad analytical and evaluation framework. It does not prove that any concrete runtime has closed every path, nor does it establish one universal topology, trust model, or authorization design.

## General implications

- Preserve origin and authorization context across summaries, state reconstruction, handoffs, and delegation.
- Treat shared state and collective commitment as security-relevant transitions.
- Bind privileged effects to the lineage that made the authority reachable.
- Record observation coverage and blind spots for every system-level control.
- Re-evaluate trust boundaries when membership, topology, routing, or tool permissions change.
- Keep containment and verified recovery as separate states.
- Include counterfactual variants in security tests when the task remains meaningful.
- Revoke or repair derivative artifacts, credentials, authority, and spawned principals after compromise.

## Limitations and open questions

The evidence is a systematization and evaluation audit, not a deployed-runtime proof. Its corpus is broad but frozen under the authors' inclusion process, and fast-changing deployment practices are not exhaustive. The five-part contract is analytical, not mechanically verified. Full traceability also creates privacy, storage, and control-plane security costs.

Open questions include how to represent origin-to-effect evidence without concentrating unsafe authority; how provenance survives compaction without becoming forgeable; whether dynamic path closure can be tested online; which effects require prevention rather than compensating recovery; and how to generate valid counterfactuals when interaction is part of the task itself.

## Editorial recommendation

- **Article type:** technical-analysis
- **Selected modules:** research-question; systematization-evidence; authority-path-model; failure-modes; counterarguments; governance-implications; limitations; open-questions
- **Ending module:** open-questions
- **Project relevance:** none
