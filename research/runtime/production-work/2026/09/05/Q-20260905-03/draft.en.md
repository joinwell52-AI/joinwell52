---
schema: publication-candidate-article/v2
title: "Passing Tests Is Not Operational Capability"
date: '2026-09-05'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "在什么证据充分具备之后，才能把智能体生成并迭代的软件称为具有运行能力，而不只是通过了生成期间可用的功能测试？"
summary: "A reproducible study of agentic programming shows that code can succeed on small functional checks and still deadlock, exhaust memory, crash, or time out at larger workloads or parallelism. Completion claims should preserve functional, process, failure-envelope, scaling, and reproducibility evidence separately."
cover: staging/publication-candidates/2026-09-05-passing-tests-is-not-operational-capability-cover.png
sources:
  - research/analysis/Q-20260905-03-operational-capability-evidence.md
---

![Passing Tests Is Not Operational Capability cover](staging/publication-candidates/2026-09-05-passing-tests-is-not-operational-capability-cover.png)

# Passing Tests Is Not Operational Capability

A coding agent plans, consults documentation, writes tests, executes the program, repairs failures, and finally turns every available local check green. The code then reaches a larger parallel environment and deadlocks, exhausts memory, or times out. The failure is not that testing had no value. It is that the completion claim became stronger than the proposition those tests examined.

The core proposition is: **functional success and a rich agent development trace are necessary but insufficient evidence of operational capability. A stronger completion claim requires a separate, risk-proportionate qualification gate over the workload, concurrency, resource, topology, and reproducibility dimensions that matter to the intended deployment.** This model lets each evidence layer close only the question it actually tested.

## An Iterative Trace Matters, but It Describes What Was Exercised

The research object examines a reproducible study of agentic programming. The models do not produce code in one shot. They run a plan-generate-test-refine loop: creating validation harnesses and Julia kernels, consulting Julia documentation through a tool integration, executing and repairing programs, and then performing performance and scaling experiments. The public package includes prompts, generated code, tests, interaction logs, and runtime data.

That process record is much stronger than a bare code answer. It can show which tools the agent used, which tests it created, which failures it encountered, and how the implementation changed. It helps a reviewer audit what the final artifact was actually exposed to.

But a rich process does not create a complete environment. The generation and refinement setting did not reproduce the target supercomputer's full distributed-memory topology, process placement, resource constraints, and core counts. The trace establishes behavior in the admitted environment. It cannot supply operational conditions that the agent never encountered.

## Scale Introduces New Failure Propositions

The same-date research object records that some generated implementations compiled and passed small correctness checks, then encountered deadlocks, oversubscription, out-of-memory failures, crashes, or timeouts as workload or parallelism increased. The failures appeared across different framework and task combinations. Some arose from generated scheduling, dependency, or data-management choices, so the result is not a general verdict that one framework class is inferior.

Small functional tests and target operation answer different questions. The first asks whether results are correct for admitted inputs. The second also asks whether concurrent work waits in a cycle, resource demand crosses a limit, progress survives a different process or data topology, and performance degrades beyond an acceptable boundary as scale changes.

A three-second example: a task queue completes ten jobs with one worker. That supports its basic scheduling and result logic. Relabeling the result “production concurrency qualified” would exceed the evidence. The governed path records functional acceptance first, then obtains separate operational evidence at relevant concurrency, queue depth, dependency latency, and resource ceilings.

## Five Evidence Layers Should Not Collapse into One Green State

A more accurate completion contract preserves five facts:

| Evidence layer | What it can support | What it cannot establish by itself |
|---|---|---|
| Functional correctness | Correct result for admitted inputs and assertions | Scalability, resource safety, concurrency robustness |
| Development-process evidence | What the agent planned, tested, debugged, and refined | Deployment fitness or target-environment equivalence |
| Operational failure envelope | Deadlock, timeout, crash, or resource limits observed under tested loads | Universal safety beyond that envelope |
| Performance and scaling evidence | Measured behavior as workload and resources change | Correctness for all inputs or globally optimal performance |
| Transfer and reproducibility evidence | Whether prompts, versions, environments, artifacts, and measurements are traceable | Deterministic generation or population-level model reliability |

These layers are complementary. Functional acceptance is the first gate; passing it can justify the expense of operational qualification. Process records explain how an implementation emerged. Stress and scaling experiments reveal boundaries invisible to small tests. Environment and reproduction records allow others to decide how far the evidence may transfer.

The governance rule is simple: passing one layer may advance the lifecycle, but it must not close every stronger proposition. “Tests passed,” “the agent completed multiple repair rounds,” “the artifact ran at target scale,” and “the artifact is operationally qualified” remain separate facts.

## Ordinary Engineering Should Translate the Dimensions, Not Copy HPC Metrics

The practical counterargument is that most changes do not justify supercomputer-scale evaluation. A pure function, one-time migration helper, or low-risk internal utility may have no meaningful concurrency or scaling requirement. Applying the same large qualification suite to every artifact would waste time and slow delivery.

Qualification should therefore match the claim and risk, not a universal benchmark. Functional and boundary tests may be sufficient for a small deterministic utility. A claim that a high-impact service can carry production traffic requires evidence about failures that emerge only in its target conditions.

For ordinary enterprise systems, the high-performance-computing dimensions can be translated into concurrent users, queue depth, dependency outages, retry storms, rate limits, restart and recovery behavior, data volume, memory ceilings, and connection-pool exhaustion. Not every dimension must be tested. The team must identify which ones could make the current completion claim false and obtain evidence for those.

A practical admission checklist is:

1. Is the current claim functional acceptance, a successful trial, or production operational qualification?
2. Which load, concurrency, dependency, and resource facts appear only in the target environment?
3. Which facts did the executed tests examine, and which remain assumptions?
4. What happens on timeout, resource exhaustion, or partial failure—stop, recover, retry, or reconcile?
5. Can reviewers trace the model, tools, prompts, dependencies, hardware, artifact, and measurement versions?

## Reproducible Does Not Mean Generally Reliable

The study provides a paper, a Zenodo artifact, and a public reproduction repository. That makes the concrete experiments more inspectable than a summary or leaderboard alone. It is independent research evidence relative to this repository's first-party projects and can support observations and reported results within the study's conditions.

Reproducibility still has boundaries. Each model-problem-framework condition was generated once, so generation-to-generation variance was not estimated. The generation environment differed from the target supercomputer. Some comparisons lack non-Julia or vendor-optimized ground truth. Prompt constraints trade flexibility against comparability, and token and human-guidance costs are incomplete.

The package therefore does not define a universal production-readiness threshold, establish that one framework family is generally superior, or turn one artifact trajectory into population-level model reliability. Its strongest contribution is placing local functional success and target-environment failure on one inspectable evidence chain.

## Evidence Boundary and Open Questions

The bounded judgment is that an agent's plan-test-refine process supplies real development evidence, while small correctness tests supply functional evidence. If a claim concerns operational capability, the evaluation must additionally probe the failure dimensions material to the target system and disclose environment differences.

Open questions remain: how many independent generations are needed for model-reliability claims; how much target-environment information should be exposed during refinement without causing benchmark overfitting; which stress dimensions should be default for ordinary enterprise agents; how a durable completion receipt should represent the evidence layer that has closed; and how qualification depth should scale under cost constraints.

The next time an agent turns every test green, do not erase that real progress by dismissing it—and do not relabel it as production readiness. Ask a more precise question: which evidence layer is green, and which target conditions can still fail only under scale, concurrency, or resource pressure?

**Evidence and sources:**

- [Zenodo: Agentic AI Generated Julia Code on Supercomputers (research artifact record 22299039)](https://zenodo.org/records/22299039)
- [arXiv: Agentic AI Generated Julia Code on Supercomputers (paper 2606.16534)](https://arxiv.org/abs/2606.16534)
- [GitHub: BaLinuss/Agentic-AI-Generated-Julia-Code-on-Supercomputers (reproduction repository)](https://github.com/BaLinuss/Agentic-AI-Generated-Julia-Code-on-Supercomputers)

