# Q-20260803-09 — Deep Reading: CorpGen and Multi-Horizon Task Execution

- **Runtime family:** Academic
- **Run date:** 2026-08-12
- **Primary object:** Microsoft Research / arXiv paper *Scaling Agents for Enterprise Multi-Horizon Task Execution*
- **Primary paper:** https://arxiv.org/abs/2602.14229
- **Official research article:** https://www.microsoft.com/en-us/research/blog/corpgen-scaling-agents-for-enterprise-multi-horizon-task-execution/
- **Evidence identity:** source-reported primary research unless otherwise stated

## Problem

The paper studies a workload that is materially different from a single long task: an agent must manage many concurrent objectives and tasks over hours, with each task containing multiple operational steps and with priorities and context changing over time. The authors call this Multi-Horizon Task Execution (MHTE).

## Facts and reported results

1. The paper defines MHTE as dozens of concurrent enterprise tasks, commonly 10–30+ operational steps per task, with 45+ concurrent tasks and aggregate interaction horizons on the order of 500–1,500+ steps.
2. CorpGen combines hierarchical planning, isolated task agents, tiered memory, adaptive summarization and experiential learning.
3. The evaluation repurposes OSWorld Office tasks into controlled high-load single-day sessions. It is not a real multi-day corporate deployment.
4. The reported 100% load contains 46 tasks. Under the paper's main comparison, the authors report 15.2 aggregate completed tasks for CorpGen versus 4.3 for the UFO2 baseline, about 3.5× by that metric.
5. In the ablation reported at 100% load, the main gain appears after experiential learning is added: the reported aggregate completion rises from 8.7 to 15.2.
6. The evaluation uses Azure OpenAI GPT-5.1-2025-11-12, a six-hour cap and up to 25,000 tool calls for the high-load session.
7. The paper's artifact-evaluation discussion reports that durable task artifacts agree with human judgments much more often than screenshot/action-trace-only evidence in a small meta-evaluation, but that comparison covers only 11 task executions and must not be generalized beyond that scope.

## Mechanisms

### Hierarchical planning

The system separates monthly objectives, daily task planning and operational actions. Planning is event-driven rather than a one-time static plan, so reprioritization can happen as work completes or new information arrives.

### Isolated task agents

Individual tasks can run in separate agent contexts. This limits cross-task context interference and gives the runtime a clearer ownership boundary for task-local state.

### Tiered memory

The architecture uses working memory, structured long-term memory and semantic retrieval. Retrieval is selective rather than replaying an ever-growing chronological context into every step.

### Adaptive summarization

When context grows beyond a threshold, routine interaction is compressed while critical state is preserved. The paper describes a trigger near 4,000 tokens for the relevant summarization path.

### Bounded failure handling

The implementation retries failed tasks and eventually skips them after bounded attempts rather than allowing one task to monopolize the entire run. The paper describes three failed attempts, each with bounded iterations, before skip/failure handling.

### Experiential learning

Successful trajectories can be retrieved for similar future tasks using embedding retrieval and application-aware indexing. This is reuse of prior successful experience, not model-parameter training during the run.

## Evidence and limitations

- The main quantitative evidence is first-party experimental evidence from the authors' controlled environment. No independent reproduction was identified in this run.
- The benchmark is synthetic/constructed from OSWorld Office tasks and does not supply ground-truth real corporate behavior.
- Absolute completion remains low at high load even in the strongest reported configuration. The result supports relative improvement under the tested setup, not production readiness.
- The paper explicitly identifies limitations around GUI reliability, state assumptions, evaluation difficulty, compute overhead and the absence of real enterprise behavioral ground truth.
- The asynchronous collaboration model uses communication channels such as email or Teams; broad team coordination is described as future work rather than demonstrated as a mature multi-agent enterprise runtime.
- The paper's language that its experiments “validate” hypotheses is an author interpretation. Under Research Center evidence policy, publication and first-party experiments do not establish independent general validity.

## Comparisons

The most useful comparison is not “CorpGen versus every agent framework.” It is the architectural difference between a single-context long-running agent and a runtime that makes task identity, isolation, memory and scheduling explicit. The controlled results are consistent with the claim that workload coordination becomes a first-class systems problem as concurrent task count rises.

## Unresolved questions

1. How well do the mechanisms transfer to multi-day operation with authentication expiry, changing permissions and environment drift?
2. Which gains come from explicit scheduling/state isolation versus model quality or task-specific experiential retrieval?
3. How should a production runtime persist task occurrence identity, authority, retries, side effects and acceptance across process restart?
4. How should conflict resolution work when concurrent tasks touch the same external business resource?
5. Can artifact-based evaluation scale beyond the paper's small meta-evaluation without hiding partial or delayed side effects?
6. What independent evidence exists for these mechanisms in other enterprise workloads?

## Reading judgment

The primary research supports a bounded systems conclusion: **many concurrent long-horizon tasks should be treated as a runtime scheduling, isolation, memory and evaluation problem rather than as one larger prompt context.** CorpGen provides useful first-party experimental evidence for that decomposition. It does not establish general enterprise reliability, independent validation or production-grade transactional safety.
