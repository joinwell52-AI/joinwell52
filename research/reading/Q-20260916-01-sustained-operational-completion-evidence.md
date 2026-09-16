# Q-20260916-01 — Sustained Operational Completion Is a Separate Evidence Dimension

- Runtime date: 2026-09-16 (Asia/Shanghai)
- Queue signal: SIG-20260916-003
- Primary research source: https://arxiv.org/abs/2609.13543
- Evidence level: `primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

When a long-running digital employee understands the task correctly, what evidence is still required to establish that it actually completes the required work, on time, across a sustained multi-task episode under resource contention?

## Source-complete Reading Scope

The primary source is *Asclepius: An Adaptive Harness for Long-Horizon Clinical Agents*. The reading covered the Clinical Environment Simulator, baseline agent configurations, outer-loop harness evolution, the skills library, isolated subagents, search/held-out design, main results, ablations, failure-mode counters, qualitative traces, evaluation design and the stated limitations.

The clinical domain is treated here as an experimental environment for a more general long-horizon execution problem. The paper itself does not establish clinical safety, production reliability outside CES, or authorization guarantees.

## The Execution Gap

The central empirical separation is between semantic correctness and operational execution. In CES, the strong tool-using baseline reaches a high diagnosis score while performing materially worse on required critical actions and timeliness. The baseline scores reported across all ten batches are 4.39/5 for diagnosis, 2.94/5 for critical actions, 3.34/5 for timeliness and 4.52/5 for disposition.

This matters because the agent can identify the right state of the world but still fail the business obligation created by that state. A correct diagnosis does not itself administer treatment, finish a multi-step regimen, prioritize a deteriorating patient, or meet a time-sensitive obligation.

The paper operationalizes three failure modes rather than treating failure as one final task score:

1. **Instruction-adherence drift** — adherence to the operating manual degrades over the shift.
2. **Treatment incompleteness** — correct diagnosis is followed by missing or partial required actions.
3. **Severity-equity gap** — attention under load shifts toward easier or recent cases, delaying severe cases.

These are useful as distinct evidence dimensions because they expose failures that an endpoint correctness metric can hide.

## Long-horizon Test Construction

CES is a turn-based discrete-event simulator of a multi-hour emergency-department shift. Patients arrive on staggered schedules; vitals and complications evolve; tests return after simulated delays; the agent must interleave work across multiple patients while beds and staff are constrained.

The main evaluation uses ten batches of twelve patients each. Six batches are used during harness search and four are held out from manual evolution. The paper evaluates diagnosis, critical actions, timeliness and disposition on a 1–5 scale. GPT-4.1 is the primary judge; the baseline and full Asclepius trajectories are regraded by four additional judges from multiple model families.

The held-out split is important: the operating-manual proposer can inspect artifacts from search trajectories, but not held-out batch definitions. The proposer is also constrained to base edits on failure patterns observed in at least three patients across multiple batches and not to insert patient- or batch-specific hard-coded knowledge.

## Adaptive Harness Mechanism

Asclepius wraps a fixed underlying agent with three coupled components.

### Outer-loop manual evolution

A proposer reads prior manuals, aggregate and per-batch scores, per-patient judge rows, action records and LLM call audit logs. It rewrites the operating manual across ten search iterations. The best manual on the search batches is selected for evaluation.

This is adaptation from durable trace evidence, not online hidden-state learning inside a single rollout. The evidence and the candidate manual remain separate artifacts.

### Externalized skills

A condition-indexed skills library contains treatment-selection references, regimen templates, dosage tables, condition-to-action mappings, treatment-completeness guidance and simulator mechanics. Skills are loaded on demand rather than relying entirely on parametric memory.

### Isolated subagents

Three recurring decisions are separated into isolated LLM calls: triage prioritization, diagnosis formation and treatment completion. Their prompts are fixed and introduce no extra medical knowledge beyond the initial operating manual. The default acting variant gives each subagent scoped MCP access within its assigned function while the main agent coordinates invocation.

The architecture therefore tests a combination of persistent procedure revision, external reference state and role-focused context isolation rather than a single prompt trick.

## Quantitative Findings

Across all ten batches, the full system reports scores of 4.38 diagnosis, 3.67 critical actions, 3.79 timeliness and 4.54 disposition, compared with the baseline's 4.39, 2.94, 3.34 and 4.52 respectively.

The paper reports a 25% gain in critical actions and 13% in timeliness across the full ten-batch set. On the four held-out batches, containing 48 patients, the critical-action increase is approximately +0.63 points, reported as a 22% gain with p=0.024. Held-out overall and timeliness improvements remain positive but are not statistically significant.

Full Asclepius improves critical-action scores on every individual batch, while overall score is lower on two of ten batches by small margins. This is useful negative evidence: even when one execution dimension improves consistently, an aggregate score can still vary by batch.

## Component Ablation and Coupling

The ablation is particularly important for interpreting the mechanism. Skills alone and subagents alone improve some means but do not reach the corrected significance threshold on the execution dimensions. Harness-only reaches significance on critical actions and timeliness across the full set, but the harness is also the single component that shows the clearest search-set-specific signal: it leads the single-component variants on search batches but loses that lead on held-out batches.

The full combination has the strongest execution gains. This supports the paper's bounded claim that the three failure modes behave as a coupled bottleneck in this setting: procedure drift, missing domain actions and attention/coordination under queue pressure are not reliably fixed by one component in isolation.

It does not establish that every long-horizon system requires these exact three components. The evidence establishes interaction in the evaluated simulator and architecture.

## Completion Evidence Boundary

For a governed digital employee, the source supports separating at least these evidence identities:

1. **Semantic-state correctness** — did the worker understand or diagnose the situation correctly?
2. **Required-action completeness** — were all materially required actions actually performed?
3. **Timeliness / deadline evidence** — did required actions occur within the relevant temporal boundary?
4. **Priority / fairness evidence** — under contention, were urgent or high-priority objects systematically neglected?
5. **Episode completion** — did the full long-running work episode satisfy its obligations, not merely isolated turns?

The first item cannot stand in for the remaining four. A report that says the worker “knew what to do” is not completion evidence.

This separation also means a Runtime should avoid collapsing understanding, action, timing and final completion into one model-generated status. Each can fail independently and should retain its own provenance.

## Comparison With Short-horizon Evaluation

Short-horizon benchmarks typically provide a single task, a compact context and an endpoint score. The CES design deliberately makes obligations interleave over time and resources. Under those conditions, the paper observes failure modes that are invisible to isolated-answer accuracy.

The transferable research value is therefore not that clinical simulation is a universal proxy for enterprise work. It is that long-horizon evaluation needs episode-level obligations and intermediate execution evidence when success depends on sustained coordination rather than one answer.

## Judge and Measurement Limits

All four CES dimensions are scored by LLM judges. The paper mitigates single-grader dependence by regrading baseline and full-system traces with four additional judges, but it did not run an expert-agreement study on the Asclepius traces. The authors explicitly state that gains should be interpreted as improvements under automated grading rather than validated clinical outcomes.

Each configuration is also run only once per batch. Mixed-effects modeling captures patient and batch heterogeneity, not run-to-run stochastic execution variance. The fact that full Asclepius improves critical actions on all ten batches strengthens the signal, but it is not a substitute for repeated rollouts.

## External-validity Limits

CES remains a simulator. Patient cards are derived from de-identified records and physiology is LLM-generated. The evaluated environment uses one default configuration: four beds, six nurses, one physician and a six-hour shift. Other staffing ratios, shift lengths, acuity mixes, languages and real clinical environments are not established.

The paper therefore cannot prove:

- real clinical safety;
- general production reliability for arbitrary digital employees;
- authorization correctness of actions;
- exactly-once or side-effect safety;
- that the adaptive manual itself is always correct;
- that isolated subagents preserve organizational responsibility or authority boundaries outside the simulator.

## Evidence Classes

### Fact

The study separates diagnosis from critical-action, timeliness and disposition scores; uses ten 12-patient batches with six search and four held out; and evaluates a three-part harness composed of manual evolution, an external skills library and isolated subagents.

### Research Result

The full system reports a significant held-out critical-action gain of about 22% while preserving diagnosis score, with the same qualitative direction reproduced by multiple LLM judges. Full-system critical-action means exceed baseline on every batch in the reported table.

### Inference

A long-running digital-employee Runtime should treat operational completion as an evidence object separate from semantic correctness. Required-action completeness, timeliness and priority under contention should be independently observable before an episode is accepted as complete.

### Unknown

The source does not establish clinical safety, repeated-run reliability, generality across nonclinical workloads, authorization correctness, exactly-once effects, or the right governance authority for adopting a self-evolved operating manual.

## Limits and Negative Evidence

- Overall score is not higher on every individual batch even though critical actions are.
- Held-out overall and timeliness gains are positive but not statistically significant.
- Harness-only behavior shows more search-set-specific signal than the architectural components.
- Single-component variants do not close all three reported failure modes.
- Each configuration has one rollout per batch.
- Evaluation relies on LLM judges without an expert-agreement study on these traces.
- The simulator-to-reality gap is explicit.
- Better task execution does not prove that an action was authorized or safe to commit externally.

## Unresolved Questions

1. What durable evidence should define “all required actions completed” for a nonclinical digital employee whose obligations change during a long episode?
2. How should deadlines, priority and fairness constraints be represented so that completion cannot hide late or neglected work?
3. When a procedure is automatically revised from traces, what independent acceptance gate should decide whether the new procedure becomes active?
4. Which failures should be attributed to the model, operating manual, skills, role decomposition, scheduler or resource contention?
5. How many repeated runs are needed before a long-horizon completion claim becomes robust to stochastic execution variance?
6. How should operational completion evidence interact with authorization and external side-effect verification?

## Reading Conclusion

The source-complete evidence supports a bounded conclusion: **semantic correctness and sustained operational completion are different success dimensions**. In the evaluated long-horizon simulator, agents can diagnose correctly yet omit required actions, drift from instructions or delay severe cases under sustained load. Asclepius improves execution with a coupled harness, skills and isolated-subagent design, but the experiment remains an automated, single-rollout-per-batch simulation. For governed digital employees, understanding, action completeness, timeliness, priority and final episode completion should remain distinct evidence identities rather than being collapsed into a single “task succeeded” claim.

This Reading Note performs evidence extraction only. It does not execute Research Analysis, article writing, visualization, Production or Publication.
