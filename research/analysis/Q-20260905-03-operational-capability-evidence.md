---
date: "2026-09-05"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260905-03
column: open-source-engineering
article_type: engineering-insight
project_relevance: none
source_reading: "research/reading/Q-20260905-03-agentic-code-evaluation-operational-scaling.md"
---

# Research Analysis — Functional Success Is Not Operational Capability

## Research question

What evidence is required before software generated and refined by an agent can be called operationally capable, rather than merely functionally correct on the tests available during generation?

## Research themes and subject kind

- **Themes:** agentic software engineering; evaluation; operational robustness; scaling; reproducibility; evidence and completion truth
- **Subject kinds:** research-finding; benchmark-result; failure-mode; architecture-mechanism
- **Sample:** reproducible primary study of agentic Julia code generation and execution on a supercomputer

## Research value

### Failure

An agent can generate code, run tests, repair failures and produce a locally successful artifact while the software remains unqualified for the environment in which it must actually operate. The failure is not simply “the benchmark was too small.” It is a governance error in the completion claim: one evidence layer—functional success in an admitted test harness—is allowed to stand in for a different proposition—operational capability under realistic workload, concurrency, resource and topology conditions.

Agentic development makes this conflation especially tempting because the development trace itself looks rich: the model plans, consults documentation, writes tests, executes code, observes failures and iterates. That process evidence can demonstrate meaningful engineering behavior without proving that the final artifact survives the target environment.

### Findings

The primary study evaluates an autonomous plan-generate-test-refine loop rather than a one-shot code response. Agents generate validation harnesses and kernels, use Julia documentation through a tool integration, repair functional problems and perform performance experiments. The public research package includes generated code, tests, interaction logs, prompts and runtime data, making the development process inspectable.

Small-scale success does not reliably delimit the operational failure envelope. Implementations that compile and pass correctness checks later exhibit deadlocks, oversubscription, out-of-memory failures, crashes and timeouts as problem size or parallelism increases. These failures appear in different framework/task combinations and are not reducible to a single universal framework defect; some arise from generated scheduling, dependency or data-management choices.

The evidence therefore supports separating functional correctness from operational robustness and scalability. It also shows that iterative agent behavior is a distinct evidence layer: development logs can explain how an artifact was produced and refined, but realistic target-system execution remains necessary for claims about deployment fitness.

### Mechanism

An operational qualification claim for agent-generated software should be assembled from multiple evidence dimensions instead of one aggregate “passed” state:

1. **Functional correctness** — the artifact returns the expected result for admitted test inputs.
2. **Development-process evidence** — the agent's planning, tool use, testing, debugging and refinement steps are observable enough to audit what was actually exercised.
3. **Operational failure envelope** — the evaluation probes workload, concurrency, memory/resource pressure and execution topology far enough to identify deadlock, timeout, crash, oversubscription or resource-exhaustion boundaries.
4. **Performance and scalability evidence** — behavior is measured as the execution scale changes, rather than inferred from one successful run.
5. **Transfer and reproducibility evidence** — the generation environment, target environment, prompts, model/tool versions, artifacts and measurements are sufficiently described to understand which conclusions can transfer.

The key governance mechanism is a **qualified completion gate**: success at one evidence layer may advance the artifact to another gate, but must not automatically close every stronger proposition. “Tests passed,” “the agent iterated,” “the artifact ran at target scale,” and “the artifact is operationally qualified” remain separate facts.

### Implication

Digital employees that generate or modify production software need completion contracts matched to the consequence being claimed. Repository tests may establish functional acceptance; they do not automatically establish concurrency safety, resource bounds, recovery behavior or deployment fitness. High-impact engineering workflows should therefore attach explicit operational qualification evidence to the generated artifact before a manager, reviewer or deployment gate treats the work as production capable.

For ordinary software outside HPC, the exact metrics will differ, but the structural requirement transfers: evaluate the dimensions that can fail only under realistic load, concurrency, dependency behavior, restart/recovery, data volume, rate limits or resource ceilings instead of treating local test success as universal completion truth.

## Evidence claims

### E1 — independent-evidence

**Claim:** The studied agentic generation process uses an autonomous iterative workflow in which models create validation harnesses and Julia kernels, execute and repair them, and perform performance/scaling experiments; the accompanying public repository exposes prompts, generated artifacts, interaction logs and measured runtime data.

**Source:** primary paper, Zenodo artifact and reproducibility repository inspected in the same-date Reading Note.

**Strength:** observed/reports. **Independent:** true relative to this repository's first-party projects.

### E2 — independent-evidence

**Claim:** Generated implementations that succeed on small functional tests can fail at larger workloads or parallelism with deadlocks, oversubscription, out-of-memory errors, crashes and timeouts in the studied supercomputing experiments.

**Source:** reported experimental results and runtime artifacts summarized in the same-date Reading Note.

**Strength:** supports. **Independent:** true.

### E3 — independent-evidence

**Claim:** The study distinguishes development behavior from target-system behavior because generation/refinement occurs in an environment that does not reproduce the full distributed-memory topology, process placement, resource constraints and core counts of the target supercomputer.

**Source:** study design and limitations summarized in the same-date Reading Note.

**Strength:** reports. **Independent:** true.

### E4 — our-observation

**Claim:** Functional correctness, agent-process evidence, operational failure envelope, performance/scalability and transfer/reproducibility answer different propositions and should not be collapsed into one generic success state.

**Source:** synthesis of E1–E3.

**Strength:** observed. **Independent:** false.

### E5 — our-interpretation

**Claim:** A governed digital-employee workflow should use qualified completion gates so that passing local tests advances an artifact without granting an unsupported claim of operational capability.

**Source:** bounded engineering inference from E1–E4.

**Strength:** supports. **Independent:** false.

## Evidence-layer comparison

| Evidence layer | What it can support | What it does not establish by itself |
|---|---|---|
| Functional tests | Correct result on admitted inputs | Scalability, resource safety, concurrency robustness |
| Agent interaction/tool trace | What the agent attempted, tested and refined | Deployment fitness or target-environment equivalence |
| Stress/parallel execution | Observed failure envelope under tested conditions | Universal safety beyond those conditions |
| Performance/scaling data | Runtime behavior as resources/workload change | Functional correctness for all inputs or operational safety everywhere |
| Reproducibility package | Inspectability of prompts, artifacts, versions and measurements | Deterministic generation or population-level model reliability |

## Contradictions and counterarguments

Not every software change requires supercomputer-scale evaluation. Operational qualification should be proportional to the claim and risk. A small deterministic utility may need no concurrency or scaling test at all. The lesson is not “always benchmark everything”; it is “do not claim a stronger property than the evidence gate actually tested.”

More testing also does not monotonically improve evidence if the environment is unrepresentative. An agent can overfit through repeated tuning against a local benchmark and still fail after deployment. Therefore operational evaluation should identify target-environment facts that materially affect behavior and either reproduce them or state the transfer limitation explicitly.

The study also does not prove that task-based frameworks are generally inferior to thread- or MPI-based approaches. Several observed failures reflect generated implementation strategies and dependency choices. Framework ranking is not the reusable research subject.

## Bounded research judgment

The strongest reusable conclusion is: **functional success is necessary but insufficient evidence for the operational capability of agent-generated software.** An agent's iterative plan-test-refine process provides valuable development evidence, yet neither that trace nor a passing small test proves the artifact's behavior under realistic workload, concurrency, resource pressure or deployment topology.

A credible completion claim should therefore name the evidence layer it has actually closed. For higher-impact software, operational capability requires a separate qualification gate that probes the relevant failure envelope and preserves enough environment and reproduction evidence for the claim to be audited.

This judgment does not define a universal production-readiness threshold, guarantee that repeated stress testing finds every failure, or transfer the study's exact Julia/HPC metrics to all software engineering.

## General implications

- Treat “functional acceptance” and “operational qualification” as different lifecycle states.
- Preserve agent-process evidence when it helps explain which tools, tests and refinements were actually exercised.
- Test failure modes that emerge only under realistic workload, concurrency, dependency or resource conditions when those dimensions matter to the intended deployment.
- Record the target environment and material differences from the generation/test environment.
- Avoid interpreting a rich autonomous development trace as proof of deployment fitness.
- Use stress/scaling results as bounded evidence, not as universal guarantees beyond the tested envelope.
- For non-HPC systems, map the same structure onto relevant operational dimensions such as concurrent users, queue depth, dependency outages, retries, rate limits, restart/recovery, data volume and resource ceilings.
- Keep cost and repeat-generation variance visible when making reliability claims about an agent rather than about one artifact trajectory.

## Limitations and open questions

The primary study is strong for a concrete, reproducible HPC setting but is narrow. Each model/problem/framework condition is generated once, so generation-to-generation variance is not estimated. The generation environment differs materially from the target supercomputer. The study lacks non-Julia/vendor-optimized ground truth for some comparisons, prompt constraints trade flexibility against comparability, and token/human-guidance costs are incomplete.

Open questions include how many independent generations are needed for model-reliability claims, which target-environment facts should be exposed during agent refinement without inducing benchmark overfitting, how operational evidence should be represented in a durable completion receipt, and which stress dimensions should become default qualification gates for ordinary enterprise software agents.

## Editorial recommendation

- **Article type:** engineering-insight
- **Selected modules:** research-question; evidence; engineering-implications; operational-implications; limitations; open-questions
- **Ending module:** open-questions
- **Project relevance:** none
