---
date: "2026-09-17"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260917-02
column: industry-architecture
article_type: technical-analysis
project_relevance: none
source_reading: "research/reading/Q-20260917-02-persistent-cross-agent-containment.md"
---

# Research Analysis — Detection Is Not Containment in Persistent Multi-Agent Systems

## Research question

When a persistent multi-agent system notices an adversarial event, what evidence is required before it may claim containment, eradication and recovery rather than merely detection or warning?

## Research themes and subject kind

- Research themes: long-horizon agent security; persistent memory; propagation; containment; eradication; recovery; quarantine; provenance.
- Subject kinds: `research-finding`, `governance-problem`, `architecture-mechanism`, `failure-mode`.
- Primary sample: Emergence World Study 2 and its longitudinal phishing, misinformation and memory-breach stress events.

The research subject is not which tested model family is safest. It is whether **a security control can remain truthful when recognition, behavior, durable state and cross-agent propagation diverge over time**.

## Evidence identities

### E1 — source-reported longitudinal setup

**Identity:** `public-fact`.

**Claim:** The study ran eight parallel worlds of ten agents with persistent memory and shared institutions, produced more than 850,000 LLM calls and nearly 50 billion tokens, and injected controlled adversarial events after operational state had accumulated.

**Strength:** primary-study context for persistent, multi-agent effects rather than one-turn prompt behavior. **Independent:** false.

### E2 — source-reported detection/containment separation

**Identity:** `source-reported-claim`.

**Claim:** All seven exposed worlds warned their communities about phishing, yet no world achieved complete defense across all three stress events. The best reported phishing score was 6/9; the best misinformation score was 3/6; only the OpenAI world passed all five memory-breach criteria.

**Strength:** direct negative evidence that recognition and peer warning do not establish complete protective effect. **Independent:** false.

### E3 — source-reported counterexample

**Identity:** `source-reported-claim`.

**Claim:** Gemini agents recognized and warned about the attack, but all ten agents still interacted with the attacker interface; the world produced 151 execution operations among 602 interface interactions. An old attack link was retrieved roughly 46 hours after the active campaign had ended.

**Strength:** direct counterexample to equating detection with containment or expiry of risk. **Independent:** false.

### E4 — source-reported persistence and propagation evidence

**Identity:** `source-reported-claim`.

**Claim:** Mistral agents stored phishing payloads in long-term memory, while DeepSeek propagated inline hostile content through agent-to-agent communication without linked-page execution.

**Strength:** evidence that persistence, propagation and direct execution are distinct effect paths. **Independent:** false.

### E5 — source-reported misinformation result

**Identity:** `source-reported-claim`.

**Claim:** Every exposed world changed state or published work before verifying the misinformation claim, repeated it without immediate caveat, and no world established a durable reusable process for future misinformation attacks.

**Strength:** direct evidence that verbal or local recognition does not imply durable response capability. **Independent:** false.

### E6 — source limitation

**Identity:** `public-fact`.

**Claim:** Emergence World is an experimental environment with specific tools, prompts, economy, governance and memory architecture. Its results do not establish production incident rates or prove any particular quarantine/recovery architecture effective.

**Strength:** explicit transfer boundary. **Independent:** false.

### E7 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** Persistent agent security requires four separately evidenced transitions: detection, containment, eradication and recovery. A warning or incident report can satisfy detection while the system remains uncontained, contaminated or unrecovered.

**Strength:** architectural synthesis from E1–E6. **Independent:** false.

### E8 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** Once hostile content enters durable memory, shared artifacts or delegated work, the Runtime needs contamination lineage and closure evidence across derived state; otherwise the original attack can disappear while executable derivatives remain trusted.

**Strength:** governance recommendation supported by the delayed retrieval, persistence and propagation cases. **Independent:** false.

### E9 — open question

**Identity:** `open-question`.

**Claim:** The evidence does not establish a universal algorithm for contamination closure, the optimal granularity of quarantine, or which recovery predicates can be deterministic versus semantic/human judgments.

## Failure / Finding / Mechanism / Implication

### Failures

1. **Recognition-as-containment:** an agent calls material malicious and the control plane marks the threat contained.
2. **Warning-as-recovery:** a broadcast or incident note is treated as evidence that durable hostile state is gone.
3. **Channel-closure fallacy:** stopping the original delivery channel is treated as removing copies already stored in memory, messages or artifacts.
4. **Execution-only accounting:** direct tool execution is tracked while persistence and propagation are ignored.
5. **Trust laundering across roles:** hostile content becomes implicitly trusted after being summarized, delegated or copied by another agent.
6. **Silent derivative state:** the system cannot enumerate artifacts, tasks, memories or actions derived from a contaminated source.
7. **Resume-by-silence:** normal work resumes because no new alert appears, without proving contaminated state was reconciled.

### Findings

The strongest result is the mismatch between recognition and protective effect. All exposed worlds could generate warnings, yet multiple worlds continued to interact with, store or propagate hostile content. The Gemini case makes this explicit: detection and community warning coexisted with continued attacker-interface interactions and later retrieval from persistent state.

The Mistral and DeepSeek cases separate two more dimensions. A threat can become durable without executing its linked payload, and it can propagate without direct retrieval of the external attack page. Therefore containment cannot be defined only as “no dangerous tool call occurred.” It must also cover new persistence and new derivation.

The misinformation results show a further boundary: correcting one incident does not create a durable recovery mechanism. A system can survive a particular event yet remain structurally unable to prevent recurrence.

### Mechanism

A durable security record for persistent multi-agent work can preserve these identities.

**Threat identity**

- event/threat ID and original provenance;
- content/artifact digest or semantic signature;
- first-seen time and ingress surface;
- known aliases or transformed forms.

**Exposure and derivation graph**

- principals/sessions that read the threat;
- messages, memories, reports, tasks and tools derived from it;
- agent-to-agent handoff edges;
- downstream actions/effects after exposure.

**Detection evidence**

- who/what identified the threat;
- evidence and confidence;
- detection time;
- unresolved ambiguity.

**Containment evidence**

- authoritative quarantine decision and scope;
- blocked execution surfaces;
- proof that no new unauthorized effect, persistence or propagation is occurring within the declared scope;
- exceptions and known uncovered surfaces.

**Eradication evidence**

- each affected durable store/artifact inspected;
- hostile or derived state neutralized, revoked, repaired or explicitly retained as quarantined audit evidence;
- downstream authorization revoked where provenance is contaminated;
- unresolved locations preserved as Unknown rather than silently clean.

**Recovery evidence**

- clean-state or accepted-state predicates;
- post-recovery recurrence probes;
- re-enabled principals/sessions/tools and responsible authority;
- continued monitoring window and results.

The graph does not need to prove every semantic relation deterministically. It needs to preserve enough provenance so that unresolved derivation is visible instead of disappearing when content changes form.

### Implication

Long-horizon agent security should treat incident handling as a **closure problem over durable state**, not a language-classification problem. The model may be excellent at noticing danger and still fail to stop execution, storage or propagation. The runtime therefore needs observable effect boundaries and recovery evidence that survive across agents, sessions and memory lifetimes.

For multi-role digital employees, trust must follow provenance rather than authorship. A summary produced by a trusted role can still be derived from contaminated input; moving it between roles should not erase the threat lineage.

## Comparison and contradictions

Traditional alerting often optimizes detection precision/recall. That remains useful, but this evidence shows why a multi-agent control plane needs additional metrics: new hostile effects after detection, new persistence after quarantine, propagation closure, contaminated-store reconciliation, and recurrence after recovery.

A counterargument is that complete contamination lineage is too expensive in open-ended systems. That is plausible. The architecture therefore needs bounded scopes and explicit Unknown states rather than pretending to compute perfect closure. High-risk effects may justify deeper provenance than low-risk conversational content.

Another counterargument is that strong sandboxing eliminates the issue. Sandboxing can reduce effect scope, but it does not by itself remove hostile state from memory, shared artifacts or future delegated tasks. A sandbox is one containment boundary, not proof of eradication or recovery.

## Bounded research judgment

**Detection is evidence that a threat was noticed; containment is evidence that it can no longer create new unauthorized effects, persistence or propagation within a declared scope; eradication is evidence that already contaminated durable state has been reconciled; recovery is evidence that normal operation resumed from an accepted state with recurrence checks. Persistent multi-agent systems should preserve these as separate facts and track contamination lineage across role and memory boundaries.**

The primary evidence strongly supports the non-equivalence of recognition and protective effect in the studied worlds. The exact production quarantine and closure mechanisms remain architectural hypotheses requiring direct validation.

## General implications

- preserve threat identity and provenance beyond the original ingress message;
- record persistence and propagation as security effects even when no dangerous tool execution occurs;
- keep detection, containment, eradication and recovery as distinct lifecycle states;
- make quarantine an authorized action with explicit scope rather than an informal agent suggestion;
- preserve contaminated derivatives across summaries, reports, tasks and agent handoffs;
- require store-by-store reconciliation or explicit Unknown for high-risk recovery;
- treat post-recovery monitoring as evidence, not optional narrative;
- separate model safety judgments from action-boundary enforcement;
- measure false containment and incomplete recovery independently from detection quality.

## Limitations and counterarguments

The experiment is not an enterprise deployment and its world dynamics are unusually open-ended. Outcomes vary by model and population composition, and the study does not validate a specific production recovery system. It also does not establish that every copied sentence requires a global taint graph.

Full derivation tracking can create privacy, storage and operational costs. Practical systems may need risk-based granularity, bounded propagation windows and selective cryptographic/content identities. The key requirement is that the system not claim recovery where relevant durable contamination remains unobserved.

## Open questions

1. How can a Runtime compute bounded contamination closure after summarization or semantic transformation?
2. Which security-relevant derivation edges should be mandatory across agent handoffs?
3. What evidence proves containment when some tools or stores cannot expose complete state?
4. When should quarantine apply to an artifact, session, worker, role or whole team?
5. How can recovery preserve audit history without keeping contaminated material executable?
6. What known-positive seeded paths can test whether eradication/recovery coverage is real rather than inferred from silence?
7. How should system-level safety evaluation account for mixed-model populations and changing social dynamics?

## Editorial recommendation

- **Article type:** technical-analysis
- **Selected modules:** research-question; longitudinal-evidence; detection-containment-separation; contamination-lineage; recovery-closure; failure-modes; limitations; open-questions
- **Core proposition:** a persistent multi-agent system is not recovered because its agents noticed the attack; recovery must close the threat's durable derivation and effect paths
- **Project relevance:** none
