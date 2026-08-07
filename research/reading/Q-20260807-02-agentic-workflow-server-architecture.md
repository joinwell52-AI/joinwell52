# Reading Record — Q-20260807-02 Role-aware CPU-GPU scheduling architecture for production agentic workflows

- **Queue item:** `Q-20260807-02`
- **Column:** Industry Architecture
- **Selection status:** Selected
- **Priority:** P0
- **Skill invoked:** `Skill 03 — Deep Reading`
- **Operating date:** 2026-08-07 (Asia/Shanghai)
- **Primary source class:** Author preprint with Microsoft Azure production traces and controlled systems experiments

## Reading scope

This pass reads *Architectural Implications of Agentic AI Workflows* as evidence about production agent workflow fragmentation, CPU-GPU demand, role-specific host behavior, burstiness, microarchitectural interference and the Agora prototype's resource-management mechanisms. It records source findings and transfer boundaries without deciding an architecture for CodeFlowMu, Digital Employees or another production runtime. No Research Analysis or article drafting is performed.

## Deep Reading output

```yaml
reading_notes:
  problem:
    - Conventional LLM serving treats a model invocation as the dominant unit, but agentic requests expand into data-dependent graphs of inference, tool execution and orchestration that repeatedly cross CPU and GPU boundaries.
    - Average CPU and GPU utilization can remain low while instantaneous bursts make either processor a critical-path bottleneck.
    - Host-side schedulers, orchestrators and runners have different resource and latency profiles, so a uniform core pool can waste capacity and create cross-role interference.
    - The selected question is what server and scheduling evidence supports role-aware CPU-GPU resource architecture for production agentic workflows rather than request-level model serving alone.

  facts:
    - The paper is arXiv:2608.04458v1, dated 2026-08-05, by Jirong Yang, Peizhe Liu, Chaojie Zhang and Jovan Stojkovic.
    - The study combines a 24-hour trace of production agentic services in Microsoft Azure with controlled experiments on SWE-Agent, Trae, CORAL and Owl.
    - The controlled server uses a 96-core AMD EPYC 7V12 CPU and eight NVIDIA A100 GPUs; one vLLM instance is deployed per agent role and task concurrency varies from 1 to 32.
    - The paper defines three workload dimensions relevant to placement: orchestration mechanism, execution structure and model composition.
    - Host-orchestrated workflows expose graph dependencies to the runtime; LLM-orchestrated workflows place inference in the control path and are less predictable.
    - Sequential workflows expose little parallelism while parallel workflows create overlapping bursts and synchronization points.
    - Homogeneous-model workflows can share model state and batching opportunities; heterogeneous workflows increase residency, memory and load-balancing pressure.
    - A representative production request spans nearly one minute and alternates among multiple LLM calls, handoffs, three tool-discovery operations and three tool executions across two tools.
    - A controlled CORAL run contains 580 LLM calls and 552 tool invocations, repeatedly alternating GPU inference and CPU-side work.
    - Across the production fleet, tool execution is comparable to or exceeds inference time for more than 27% of requests according to the reported distribution.
    - The host roles are scheduler, orchestrator and runner; the paper argues that scheduler/orchestrator control paths are latency-sensitive while runner tool work is bursty and throughput-oriented.

  research_results:
    - Median host CPU utilization across controlled frameworks ranges from about 6% to 31%, while GPU SM activity remains below 55%, showing stranded average capacity despite burstiness.
    - SWE-Agent involuntary context switches rise from 71 to 660 per second when concurrency increases from 1 to 32 tasks, despite low aggregate CPU utilization.
    - At low load, CPU harvesting delivers an average 95.0% of the co-located harvester's standalone throughput with 2.8% agent slowdown; at high load it delivers 53.7% with 3.9% slowdown.
    - Averaged over the two CPU-harvesting operating points, the paper reports 74% standalone harvester throughput, host CPU utilization increased by 31% and agent latency increased by 3.3%.
    - Tool-type hints materially change one Owl high-load result: an all-tool retreat policy retains 37.7% standalone throughput, while typed hints retain 80% at 0.2% average agent slowdown.
    - Under high load, Owl GPU harvesting reduces GPU count by 33%, raises generation throughput by 82%, increases tasks/hour by 22% and reports 2.5x better tail latency relative to the role-dedicated baseline.
    - The same GPU harvesting is harmful for parallel CORAL at high load: reducing GPUs by 50% is reported with 71% lower generation throughput, 55% fewer tasks/hour and 16x worse tail latency. Consolidation without harvesting is instead reported as beneficial for CORAL.
    - The pure-serving microbenchmark finds approximately 10.3 CPU cores of control-plane demand; an 11-core pool retains 98.5% of standalone serving throughput, while the chosen isolated control pool retains about 99%.
    - Runner compaction cuts tool CPU-seconds by 25% to 46% while changing serving CPU by under 2%; split and isolated layouts reclaim more tool CPU than a shared pool and batch completion changes by about 1% or less in the reported table.
    - At high concurrency, two tasks per contention pool is the best reported pinning point: batch completion improves 4.73%, maximum tool-sum time improves 12.81% and tool CPU-seconds fall by roughly 34% relative to a wide shared runner pool.
    - Fully private per-task cores slightly worsen batch completion, showing that excessive isolation removes useful slack.

  mechanisms:
    - Agora isolates scheduler and orchestrator control cores from harvester workloads and allows harvesting only on runner capacity.
    - CPU harvesting uses a grace window and gradual retreat rather than immediately pausing all co-located work whenever a tool appears.
    - Host-orchestrator hints let the runtime anticipate upcoming tool bursts and distinguish compute-bound tools from I/O-bound tools; LLM-orchestrated workflows lack this advance signal and use reactive detection.
    - GPU capacity is reclaimed by consolidating agents onto shared serving instances and, where safe, reducing the number of GPUs assigned to the workflow.
    - GPU memory can be oversubscribed by staging inactive agent state in host memory and prefetching the next agent's state when the host-side workflow reveals future execution.
    - Agent placement uses profiling information and a mixed-integer linear program to decide GPU assignment, tensor-parallel configuration and collocation subject to memory and contention constraints.
    - CPU role-aware pooling sizes stable control pools separately from a bounded runner pool; runner width changes with concurrency and unused cores can return to harvesting.
    - Task pinning keeps a sequence of tools operating on the same repository or working set within a narrow contention domain. The paper rejects static pinning by tool type because the tool mix changes during a task.

  evidence:
    - The primary paper provides a 24-hour Azure fleet trace plus controlled framework experiments, allowing production-scale observation and repeatable mechanism studies to be separated.
    - The full HTML exposes taxonomy, methodology, production observations, controlled hardware, tables for CPU harvesting, GPU consolidation/harvesting, role-aware compaction and pinning, and the conclusion.
    - The PDF was also visually inspected for the architecture diagrams and result tables, including the server-design/Agora section and role-pooling tables; the inspected PDF agrees with the HTML text used for recorded numbers.
    - The paper reports both successful and harmful operating points, including CORAL high-load GPU harvesting and fully private CPU cores, rather than presenting one mechanism as universally beneficial.

  limitations:
    - The production characterization covers one reported 24-hour fleet window; the reading does not establish seasonal, multi-day or cross-provider invariance.
    - The controlled study uses four frameworks on one disclosed CPU/GPU server configuration, so hardware and workload transfer beyond those cases is not established by the reported experiments.
    - The paper does not provide a dedicated limitations section; transfer limits in this Reading Record are therefore derived from the disclosed methodology and the negative operating points, not attributed as explicit author statements.
    - Some mechanisms depend on host-visible orchestration hints. LLM-orchestrated control flow is less predictable and cannot supply the same proactive graph/tool-type signal.
    - CPU harvesting has little usable slack for a parallel, tool-saturated workflow such as CORAL at high load; the paper disables harvesting in that extreme.
    - GPU harvesting is workload-sensitive and can be severely harmful when parallel agents contend concurrently, as the CORAL result demonstrates.
    - Role-pool sizes and affinity depend on measured load and serving configuration; the reported 10.3-core control demand is an empirical point for the evaluated setup, not a universal constant.
    - The paper characterizes infrastructure behavior and server efficiency; it does not establish agent answer quality, governance correctness, task-level business success or safety from the resource-management mechanisms alone.

  comparisons:
    - The source contrasts monolithic inference with agentic execution: the latter makes host orchestration and tool execution part of the critical path instead of treating CPU work as feeder overhead.
    - Shared role-agnostic core placement is compared with split and isolated role pools; separation generally reduces tool CPU work and interference in the reported experiments.
    - Wide shared runner pools are compared with narrowed task contention domains; moderate task grouping improves locality, while private cores over-isolate.
    - Static role-dedicated GPUs are compared with consolidation and harvesting; consolidation can help both evaluated workloads, while aggressive GPU removal depends strongly on concurrency and role overlap.

  contradictions:
    - The introduction's headline CPU-harvesting result of roughly 95% recovered throughput and under 3% slowdown corresponds to the low-load average; the full table shows materially lower 53.7% recovered throughput and 3.9% slowdown at high load. The detailed table therefore limits any load-independent interpretation of the headline.
    - GPU harvesting is beneficial for Owl but strongly harmful for CORAL at high load, so the source's broader resource-reclamation argument does not support a single fixed GPU-harvesting policy.
    - Stronger CPU isolation reduces cross-role interference, but fully private per-task cores worsen batch time; role isolation and task locality therefore do not imply maximal physical isolation.
    - Low average utilization coexists with transient critical-path saturation, so utilization averages alone would suggest spare capacity while the time-series and slowdown results show that capacity can disappear abruptly.

  unresolved_questions:
    - How stable are the role signatures and optimal pool sizes across multi-day production traces, different hyperscalers, CPU generations and accelerator types?
    - What scheduler signal can replace host-graph hints when orchestration itself is model-driven and future tool types are unknown until inference completes?
    - How should resource controls react when agent roles carry different business priorities, deadlines or failure costs rather than only different CPU/GPU signatures?
    - Can resource pooling preserve isolation requirements when different agents have different trust, credential or tenant boundaries?
    - What online controller can detect that a formerly safe GPU-harvesting configuration has crossed into a CORAL-like contention regime before tail latency collapses?
    - How do the infrastructure gains change when model serving, tool sandboxes and external services are distributed across multiple machines rather than one server?
```

## Source traceability

1. arXiv record: `https://arxiv.org/abs/2608.04458`
2. Full primary HTML: `https://arxiv.org/html/2608.04458`
3. Primary PDF: `https://arxiv.org/pdf/2608.04458`
4. Today's Research Plan: `research/runtime/plans/2026/08/2026-08-07-plan.json`
5. Skill 03: `research/skills/03-deep-reading.md`

## Reading gate decision

**Result:** Deep Reading completed from the primary arXiv HTML and PDF, including visual inspection of the paper's architecture and result tables. The Reading Result preserves workload taxonomy, production and controlled evidence, negative operating points and transfer limits. No Research Analysis, architecture recommendation or article was produced.
