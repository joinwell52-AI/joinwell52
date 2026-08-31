# Q-20260831-03 — Controlled Failure Replay as a Causal Repair Test

- Runtime date: 2026-08-31 (Asia/Shanghai)
- Queue signal: SIG-20260831-008
- Primary source: https://arxiv.org/abs/2608.25920
- Evidence level: `peer_reviewed_or_primary_research`
- Scope: multi-agent failure replay, repair evaluation, execution prefixes, intervention anchors, deterministic boundary replay, external-state limits

## Research Question

How should an Agent Runtime freeze a failed execution prefix, anchor an intervention, and regenerate only the downstream suffix so that a recovery experiment measures causal repair rather than merely sampling a different stochastic run?

## Problem

When a multi-Agent task fails, a complete rerun changes many things at once: model sampling, tool responses, scheduling, intermediate state, and later actions. If the rerun succeeds, that does not show that a proposed repair fixed the original failure mechanism. It may only show that the system drew a luckier trajectory.

The selected research asks how to preserve the relevant failed history exactly enough to test a targeted intervention while allowing only the downstream computation to change.

## Dataset and Failure Annotation

The paper introduces SymFail/SymTrace evaluation over 200 tasks drawn from WebArena-Verified Hard and AssistantBench and runs them across three multi-Agent systems: AG2, CrewAI, and Magentic-One. From 600 initial task-system executions, 536 evaluator-confirmed failures are retained for the main failure analysis: 171 AG2, 184 CrewAI, and 181 Magentic-One failures.

The retained set contains 462 WebArena failures and 74 AssistantBench failures. The authors use three independent annotators plus a fourth adjudicator and attach category/node/evidence annotations to the recorded event graph.

Reported inter-annotator agreement is materially higher for failure-node type than for some failure categories. Primary-category Cohen/Fleiss-style agreement is reported around kappa 0.622, while failure-node type reaches 0.811. Exact same-node agreement across all three annotators is 73.88%, and at least two annotators agree on the node in 95.9% of cases. Repetition/stall classification is one of the weaker categories, with substantially lower agreement, so category labels should not be treated as equally certain.

## Research Results

For reproducing the same failure, an unguided rerun reproduces the original failure 67.97% of the time on the first attempt, while controlled replay reaches 80.78%. By the third attempt, the reported rates fall to 41.42% for rerun and 52.43% for replay. The replay mechanism reports 100% exactness for the replayed logical prefix by content hash under its represented-state assumptions.

The paper also separates failure reproduction from task repair. At task level, unguided rerun achieves only 6.90% pass@3 on the failed cases. Self-repair and critic-style baselines are lower in the reported table, at 4.29% and 3.73% respectively.

For single-attempt intervention targeting, choosing the last node repairs 1.31% of failures, random targeting repairs 3.73%, while the symptom-driven suspicious-node intervention repairs 20.15%. The paper reports the symptom-driven approach performing best across the three evaluated MAS frameworks.

The experiment evaluates target selection and repair guidance together. The 20.15% figure therefore does not isolate how much improvement comes from finding the right node versus how much comes from the repair instruction itself.

## Controlled Replay Mechanism

SymTrace records an event-dependency snapshot plus boundary-level requests and results. The replay procedure reconstructs the pre-intervention prefix using recorded boundary results, then switches back to live execution after the designated intervention anchor.

The replay bundle conceptually includes the task, represented initial state, runtime configuration, event graph, event order, and recorded boundary interactions. Events retain identifiers such as agent, event type, and ordinal position so the replay engine can check that the current execution is still aligned with the authoritative failed trace.

The fail-closed replay path is important:

1. restart the native multi-Agent system from the recorded task, represented initial state, and runtime configuration;
2. intercept each replayed boundary request;
3. compare its event position and canonicalized request with the recorded expected request;
4. stop at the first divergence rather than silently continuing a different prefix;
5. return the recorded boundary result when the request matches;
6. validate the materialized event/node using recorded identity/content evidence;
7. at the selected intervention anchor, augment or change the request with repair guidance;
8. switch to live execution for the downstream suffix.

This structure makes the failed prefix a test fixture rather than a suggestion. A different prefix is treated as a different experiment.

## Determinism Boundary

The paper's replay guarantee is explicitly about a **represented logical execution prefix**, not perfect physical replay of a distributed system. The assumptions require fixed task/initial configuration and deterministic internal transitions conditioned on the represented state, input, and replayed boundary result.

Every state-affecting model response, tool observation, external input, or scheduling decision that matters to the suffix must be captured or otherwise controlled. Position/request validation and content-hash checks make divergence visible, but they cannot reconstruct state that was never recorded.

The authors report that many prefixes are short, commonly two or three nodes, and that replay's advantage grows for longer prefixes. That is consistent with the engineering intuition that stochastic full reruns accumulate more opportunities to diverge as the preserved history becomes longer.

## External-State Caveat

A recorded successful tool result does not recreate the external side effect that originally produced it. If the original prefix wrote a file, changed a remote service, created a ticket, sent a message, or mutated another persistent system, merely replaying the recorded “success” response can leave the live suffix in a state that never actually existed.

The paper therefore bounds selective replay to cases where downstream execution does not depend on an unreproduced prefix mutation, or where the external state can be safely reset/re-executed, or where an external checkpoint restores the required state.

The dataset was not filtered to remove all external-state dependence. Consequently, the reported logical-prefix guarantee should not be read as proof that arbitrary real-world side effects can be replayed safely or exactly.

## Evidence

Primary evidence is arXiv:2608.25920, *Repair or Resample? Rethinking Failure Debugging in LLM Multi-Agent Systems*.

The paper provides the SymFail dataset construction, three-framework coverage, human failure annotation, replay-prefix representation, intervention-anchor algorithm, rerun/replay reproduction measurements, repair measurements, and explicit replay assumptions and limitations.

The experiments use a fixed hosted model alias and temperature setting in the reported evaluation. The alias does not prove an immutable upstream model snapshot, so future provider-side model changes remain outside the strongest determinism claim.

## Comparisons

A full rerun is useful for estimating whether a task can sometimes succeed, but it is a weak causal repair test because both the suspected defect and unrelated stochastic choices can change.

Controlled replay instead holds the observed failed prefix constant, then changes execution at one chosen boundary. That makes the experiment closer to a counterfactual engineering test: “Given the same prefix, does this intervention alter the downstream outcome?”

Traditional unit-test replay often assumes code and inputs are deterministic. Agent replay must additionally control model/tool boundaries, scheduling-relevant events, persisted context, and external state. The paper's fail-closed divergence check is therefore a core part of the causal interpretation, not merely a debugging convenience.

## Contradictions and Negative Evidence

The unguided rerun reproduces the same failure in many cases, but it repairs very few failed tasks. Reproducibility and repair are therefore different metrics.

Conversely, a successful rerun does not prove that the system repaired the original failure. Without controlling the prefix, success can be resampling.

Controlled replay also does not guarantee repair: even the strongest symptom-driven intervention succeeds on a minority of the retained failures. The result demonstrates improved causal targeting under the tested setup, not a general automatic-repair solution.

Annotation uncertainty is non-uniform. Strong node-level agreement coexists with weaker agreement for some failure categories, so downstream claims should distinguish “where the failure manifested” from “what abstract category caused it.”

## Limitations

The benchmark tasks do not cover the full diversity of deployed enterprise Agent systems. Browser/task environments and the three evaluated MAS frameworks are informative samples, not universal coverage.

The evaluation uses an automated LLM-based judge in parts of the reproduction pipeline, and the authors note occasional judgment errors. Human annotation itself also contains category ambiguity.

Only one hosted model alias/configuration is used for the main experiment. Cross-model and provider-version generalization remains open.

The reported symptom-driven method combines target selection with repair guidance; no complete component-level ablation proves which component contributes how much to the improvement.

Replay exactness applies to represented state and captured boundaries. Thread scheduling, memory layout, network timing, uncaptured service state, escaped side effects, and provider-internal nondeterminism are outside that guarantee unless explicitly modeled.

## Bounded Implication for Analysis

The evidence supports treating a recovery experiment as a versioned object with an **authoritative failed prefix**, **intervention anchor**, and **live suffix**, rather than as a generic “retry.” To support causal interpretation, a Runtime would need stable identifiers for the task/run, event order, agent/boundary identity, canonical request, recorded result, checkpoint/state generation, intervention identity, and any external-state restoration contract.

Analysis should separately consider two failure modes: replay divergence in the logical trace, and external-state divergence despite a matching logical trace. This Reading does not prescribe a single checkpoint format or claim distributed exactly-once replay.

## Unresolved Questions

- Which Runtime boundaries are mandatory to record for a replayable governed digital employee: model calls, tools, human approvals, scheduling decisions, message deliveries, file writes, external API effects?
- How should canonical request comparison handle semantically irrelevant ordering or formatting changes without allowing a materially different request to pass?
- What external-state checkpoint or compensation contract is required before a recorded tool success can be reused safely?
- How should replay behave when a model/provider version cannot be pinned exactly?
- Can multiple interventions be tested against the same frozen prefix without contaminating later experiments through persistent side effects?
- What identity should bind a repair hypothesis to the exact failure node and trace version it was designed to address?
- How should a Runtime distinguish “same failure symptom” from “same causal failure” when annotation categories are uncertain?

## Reading Conclusion

The paper shows why Agent repair evaluation should distinguish replay from rerun. Across 536 annotated multi-Agent failures, unguided reruns often reproduce failure but rarely repair the task, while controlled prefix replay plus symptom-driven intervention improves repair substantially under the tested conditions. The key engineering mechanism is fail-closed preservation of an authoritative logical prefix, explicit intervention anchoring, and live regeneration only after that boundary. The guarantee remains bounded by captured state and external side effects; it is a causal test fixture for the represented execution, not proof of physical or distributed exactly-once replay.
