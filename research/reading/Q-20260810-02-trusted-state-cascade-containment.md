# Q-20260810-02 — Multi-agent failure containment depends on trusted-state repair

- Runtime date: 2026-08-10
- Column: Industry Architecture
- Source object: Q-20260810-02 / SIG-20260810-R-003
- Primary source: https://arxiv.org/abs/2608.05263
- Full text: https://arxiv.org/html/2608.05263v1
- Evidence class: Research Result (author-reported controlled experiments)
- Stage: Skill 03 Deep Reading only

## Problem

Orchestration benchmarks usually collapse reliability into final task success. OrchestraBench instead asks where a failure starts, how far it propagates, whether it recovers, and which routing/recovery mechanism is responsible. The selected question is narrower than the whole paper: whether apparent cascade containment comes from autonomous orchestration intelligence or from access to a trusted upstream state that can repair latent corruption.

## Facts and measured results

1. OrchestraBench uses seed-reproducible failure injection over templated workflows and reports routing accuracy, per-failure-mode recovery, cascade radius, time-to-detection, recovery completeness, and decomposition fidelity.
2. Its core failure probes inject five MAST-style modes into a verifiable staged computation executed by a real Claude agent: ambiguous delegation, tool-invocation error, context pollution, conflicting outputs, and premature action.
3. On the main arithmetic-chain probe with Sonnet 4.6, tool-invocation error recovered fully (1.00), ambiguous delegation recovered partially (0.30), and context pollution / conflicting outputs / premature action had 0.00 final-task success.
4. Blind retry did not repair latent/semantic faults; retry reproduced the still-present fault and increased time-to-detection. The paper therefore separates retryable tool failure from failures requiring detection, attribution, state repair, or semantic validation.
5. Reframing the same computation as a four-role loan-approval pipeline preserved the failure-mode ordering while changing absolute recovery rates: tool-fault recovery fell from 1.00 to 0.70 and ambiguous-delegation recovery rose from 0.30 to 0.40.
6. A three-model check across Claude Sonnet 4.6, Opus 4.8, and Haiku 4.5 preserved the broad tool-vs-latent ordering, though ambiguous-delegation rates varied.
7. Cascade radius for latent modes increased with pipeline depth. For depths 3/4/5/6/7, reported mean latent cascade radius was approximately 0.93/1.85/2.80/3.63/4.67; tool-fault cascade remained 0 in that controlled chain.
8. In the policy-conditioned containment probe, the LLM router is explicitly given a trusted upstream value and permission to detect/correct the anomaly. Under that stronger semantics, latent recovery was reported as 0.83 with cascade radius 0.33, versus baseline fixed/heuristic/retry recovery 0.08 and cascade radius 1.83; Oracle reached 1.00 and 0.00 respectively.
9. The trusted-state ablation is decisive for interpretation. In an independent larger sweep (`N=180`), removing the trusted-upstream hint (`llm_noupstream`) reduced latent recovery from 0.67 [0.46, 0.83] to 0.08 [0.00, 0.21], a paired drop of 0.58 [0.33, 0.79] with reported `p=5.19e-4` over 24 pairs.
10. The authors therefore explicitly classify the LLM containment result as a trusted-state self-correction probe, not evidence that an LLM router autonomously detects and contains latent cascades.

## Mechanisms

### Failure injection and attribution

The benchmark introduces seeded faults at known stages, so the origin is controlled rather than inferred post hoc. Exact-match ground truth on the staged arithmetic chain makes recovery and downstream corruption observable without subjective scoring for Experiments 2–4.

### Cascade radius

Cascade radius counts downstream stages corrupted by an injected fault. On this construct, a latent upstream corruption is consumed by later stages, so depth mechanically increases the maximum possible cascade. The paper treats the depth trend as a corroborating structural signature rather than a production-domain headline.

### Retry versus repair

Retry repeats computation while preserving the same latent state. When the fault is semantic/contextual rather than a transient tool error, repeating the same state reproduces the error. Repair requires either detecting/attributing the corruption or supplying a trustworthy state signal that permits correction.

### Trusted-state probe

The policy-conditioned LLM receives trusted upstream state. This changes the information available to the router: it is not merely choosing a route, it is allowed to compare the current value against a trusted reference and repair it. The no-upstream ablation shows that most of the measured containment gain disappears without that signal.

## Evidence

- Experiment 2 reports three recovery tiers and failure of blind retry on latent modes.
- Experiment 3 reports monotonic cascade-radius growth across depths 3–7.
- Section 5.5 states the trusted-upstream value is an explicit modelling assumption and labels the LLM row a self-correction probe.
- The `llm_noupstream` ablation drops latent recovery to the baseline level, which directly supports the selected object's trusted-state claim.
- Section 7 repeats that the LLM-policy result should not be read as a deployable autonomous-routing estimate.

## Limitations

1. The core recovery/cascade experiments are controlled mechanism probes on a verifiable arithmetic dependency chain, not measurements on real enterprise workloads.
2. The loan-approval validation reframes the same computation in domain language; it is not an end-to-end real loan-processing system.
3. Experiments 2 and 3 use one Claude agent over staged prompts, not a literal network of independently executing agents. A real multi-agent harness is future work.
4. Core Exp 2–4 numbers are primarily Sonnet 4.6; the cross-model sweep covers Claude tiers, not GPT/Gemini or broader model families.
5. Sample sizes are modest for some cells (`n=30` per mode in Exp 2). Deterministic cells have zero-width intervals by construction.
6. Cascade growth is partly structural because later stages consume corrupted upstream values; the authors explicitly caution against treating the depth curve as a standalone domain claim.
7. The strong LLM containment row has an information advantage: trusted upstream state. Its absolute numbers are not a clean estimate of autonomous fault detection.

## Comparisons

- **Blind retry:** useful for transient/retryable tool faults; ineffective for latent semantic corruption when the same bad state remains.
- **Autonomous LLM routing without trusted upstream:** the paper's ablation places latent recovery near baseline in the tested construct.
- **Trusted-state repair:** materially improves recovery in the probe because the repair mechanism is given an external correctness signal.
- **Oracle:** remains an upper-bound gold-repair ceiling, not a deployable policy.

## Unresolved questions

1. What constitutes a trustworthy upstream state in a real multi-agent production system, and who is authorized to assert or repair it?
2. How does containment behave when the trusted signal itself is stale, incomplete, conflicting, or compromised?
3. Does the trusted-state effect persist in genuinely independent multi-agent topologies with asynchronous messages and partial observability?
4. What is the cost/latency tradeoff of attribution plus state repair compared with simpler rollback or human escalation?
5. How should cascade radius be defined for branching DAGs, retries, fan-out/fan-in, and long-lived workflows rather than linear staged chains?

## Reading boundary

This note records the paper's measured results, experimental assumptions, and limitations. It does not yet translate them into a recommended control-plane architecture; that belongs to Skill 04 Research Analysis.
