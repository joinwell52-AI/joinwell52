# Reading Record — Q-20260806-01 Revisable DAG orchestration for multi-agent computer use

- **Queue item:** `Q-20260806-01`
- **Column:** Digital Employee
- **Selection status:** Selected
- **Priority:** P0
- **Skill invoked:** `Skill 03 — Deep Reading`
- **Operating date:** 2026-08-06 (Asia/Shanghai)
- **Primary source class:** Author preprint, official project page and official implementation repository

## Reading scope

This pass reads *Multi-Agent Computer Use* as evidence about manager-worker decomposition, dependency-graph revision, parallel computer-use execution, benchmark design and transfer limits. It records claims and evidence without deciding how CodeFlowMu, FCoP or a Digital Employee runtime should adopt the method. No Research Analysis or article drafting is performed.

## Deep Reading output

```yaml
reading_notes:
  problem:
    - Long-horizon computer tasks often contain dependencies that are only discovered during execution, so a fixed plan can become invalid as workers uncover new information.
    - A single computer-use agent serializes independent work and can lose findings that are no longer visible in the current interface state.
    - The selected question is how a manager can maintain a revisable dependency structure, dispatch ready work in parallel and retain accountable task state across workers.

  facts:
    - The work introduces Multi-Agent Computer Use, with a manager LLM and multiple computer-use worker agents.
    - The manager represents the plan as an open-ended directed acyclic graph whose nodes are subtasks and whose edges encode dependencies.
    - At each iteration, the manager dispatches workers for the ready frontier and may add, cancel, rewire or modify pending nodes after receiving results.
    - Workers share the same computer-use backbone; task specialization is supplied through manager instructions, available files and virtual-machine state rather than separately trained roles.
    - The official implementation persists dependency_graph.json, graph snapshots, a replanning log, summaries, final results and per-subtask metadata and execution logs.
    - The implementation includes a follow-up path through which the manager can ask a completed worker for further action or a targeted summary.
    - The source evaluates the method on OSWorld, Online-Mind2Web, WebTailBench-v2 and Odysseys.

  research_results:
    - The paper reports absolute success-rate gains of 4.7 points on OSWorld, 3.4 on Online-Mind2Web, 8.7 on WebTailBench-v2 and 25.5 on Odysseys over its single-agent comparison.
    - An indexed table reports WebTailBench-v2 success of 20.8 for the single-agent configuration and 29.5 for the multi-agent Opus-manager configuration.
    - The same table reports Odysseys success of 8.5 versus 34.0 and wall-clock time of 162.4 versus 110.3 minutes.
    - The reported wall-clock effect is not uniform: WebTailBench-v2 is shown as 39.0 minutes for the single-agent configuration and 55.2 for the multi-agent configuration.
    - The experimental setup describes Qwen3.6-27B workers served with vLLM on two A6000 GPUs, virtual-machine resources, and API-cost estimates for the manager configuration.

  mechanisms:
    - The manager performs initial decomposition, then repeatedly selects ready nodes whose dependencies are satisfied.
    - Completed worker findings are fed back to the manager, which can revise the graph instead of merely appending a linear next step.
    - Partial observability is handled by carrying findings and artifacts through manager state and downstream node instructions when a later worker may not be able to re-observe the original screen state.
    - File differences and an archive pool are used to identify artifacts produced by workers and make selected files available to later subtasks.
    - Replanning records preserve how the working graph changed over time, providing a trace of manager decisions even though the paper does not define a formal governance protocol.

  evidence:
    - OSWorld contains 369 Ubuntu desktop tasks with task-specific evaluators according to the source description.
    - Online-Mind2Web is described as 300 tasks across 136 live websites and uses an LLM-based judgment path.
    - WebTailBench-v2 contains 609 long-tail and compositional tasks and uses rubric-based LLM evaluation.
    - The official repository exposes executable orchestration code, configuration examples and persistent run artifacts that match the paper's manager-DAG-worker description.
    - The official project page and repository report benchmark results, but the arXiv v1 paper remains the canonical source for the paper-version numbers recorded above.

  limitations:
    - The source is a June 2026 arXiv preprint and is not established here as a peer-reviewed archival result.
    - Three web-oriented evaluations rely on LLM or rubric judges as described by the authors; they are not all deterministic environment checks.
    - The approach requires substantial infrastructure and manager-model API cost, so the reported quality gains do not imply lower total resource cost.
    - Parallel execution helps only when useful independent or partially independent work exists; some reported wall-clock results are slower than the single-agent baseline.
    - The manager is a central planning and interpretation point, creating a potential bottleneck and single authority for graph revision.
    - The sources do not specify durable capability authorization, transactional side-effect handling, compensation, independent completion verification or an audit protocol suitable for governed enterprise Digital Employees.
    - The full arXiv PDF could not be retrieved through the automation fetch path because of the source file size; the reading used the arXiv record, indexed full-text passages, the author project page and the official code repository, and this access limitation is preserved explicitly.

  comparisons:
    - A static decomposition can dispatch parallel work but cannot absorb newly discovered dependencies; the selected design treats the graph itself as mutable runtime state.
    - A linear single-agent trace naturally preserves one context stream but serializes work; the manager-worker design trades that simplicity for parallelism, artifact transfer and coordination overhead.
    - The method records operational graph changes, but this is not equivalent to a protocol-level custody, approval or completion ledger.

  contradictions:
    - The headline claim of up to 1.5x faster execution is supported by the Odysseys result but is not universal because the WebTailBench-v2 configuration is reported as slower.
    - The current official repository README reports Online-Mind2Web values of 50.7 to 56.5, while indexed arXiv v1 material reports 52.2 to 55.6; this reading treats the mismatch as version or presentation drift and does not merge the values.
    - Higher benchmark success does not by itself prove accountable completion, because several benchmarks use learned or rubric-based judges and the method does not add an independent governance layer.

  unresolved_questions:
    - Which graph mutations require approval when workers can produce external side effects rather than only benchmark actions?
    - How should node ownership, evidence requirements, retries and cancellation be represented so a revised DAG remains auditable after recovery?
    - What independent evidence should be required before a manager marks a node or the whole job complete?
    - How does performance change when workers have heterogeneous skills, permissions, costs or failure rates?
    - How should concurrent workers coordinate access to shared applications and files without race conditions or duplicated effects?
    - Can the manager state and graph be restored exactly after a crash while preserving already completed external actions?
```

## Source traceability

1. arXiv record: `https://arxiv.org/abs/2606.01533`
2. Author project page: `https://jykoh.com/multi-agent-computer-use/`
3. Official implementation repository: `https://github.com/kohjingyu/multi-agent-computer-use`
4. Today's Research Plan: `research/runtime/plans/2026/08/2026-08-06-plan.json`
5. Skill 03: `research/skills/03-deep-reading.md`

## Reading gate decision

**Result:** Deep Reading completed with one explicit source-access limitation. The source package is sufficient for a later Analysis shift to compare revisable orchestration, evidence boundaries and transfer risks. No architecture recommendation, Research Analysis or article was produced.
