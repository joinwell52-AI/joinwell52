# Q-20260905-03 — Agentic Code Evaluation Must Extend Beyond One-shot Correctness

- Runtime date: 2026-09-05 (Asia/Shanghai)
- Queue signal: SIG-20260905-007
- Primary research artifact: https://zenodo.org/records/22299039
- Paper: https://arxiv.org/abs/2606.16534
- Reproducibility repository: https://github.com/BaLinuss/Agentic-AI-Generated-Julia-Code-on-Supercomputers
- Evidence level: `peer_reviewed_or_primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

What operational evidence is required before agent-generated software can be called capable: is passing generated functional tests enough, or must evaluation also observe the agent's iterative tool use and the generated program's robustness, parallel behavior and scaling characteristics under realistic execution conditions?

## Problem

One-shot code-generation benchmarks can stop at a boundary that is too early for engineering use. A generated program may compile, run and pass small functional tests while failing when the workload, concurrency level, memory pressure or execution topology changes. Agentic systems add another observable dimension: the model is no longer producing one answer; it plans, calls tools, tests, edits and optimizes across multiple steps.

The selected study, *Generated, Parallel, Scalable? A Study of Agentic AI-Generated Julia Code on Supercomputers*, directly tests that gap in a high-performance-computing setting. It evaluates an autonomous code-generation loop rather than only static output, then executes the resulting Julia kernels under parallel and supercomputing conditions where small-scale correctness can diverge from operational behavior.

## Study Design

The study uses OpenCode 1.14.20 as the agent environment and gives the agent access to official Julia documentation through a Julia documentation tool/MCP integration. The common system prompt casts the model as a Julia/HPC expert, tells it that documentation is available through the tool, and requires the provided tests to pass.

Three models are evaluated: OpenAI GPT-5.5, Anthropic Claude Opus 4.7 and Qwen3-Coder-Next. The benchmark covers three numerical problems with increasingly difficult parallel structure:

- numerical π integration, an embarrassingly parallel workload;
- tiled general matrix multiplication (GEMM), a regular structured workload;
- tiled Cholesky decomposition, an irregular dependency workload.

The generated implementations use four Julia parallel-programming configurations: Base.Threads and Dagger.jl for shared memory, and MPI.jl and distributed Dagger.jl for distributed memory. The study excludes a hybrid configuration rather than multiplying the experiment dimensions further.

Generation is explicitly agentic and two-stage inside the same OpenCode session. First the agent creates a validation harness that prepares inputs, invokes the kernel and checks the result. It then generates the kernel, executes it through that harness, fixes correctness problems, runs performance/scaling experiments and refines the code. The paper's generation logs show API exploration, functional debugging and empirical performance experiments rather than a single prompt-response generation event.

## Execution Environment and Scaling Evidence

Final performance experiments run on the Otus supercomputer. The paper reports 636 compute nodes, with two AMD EPYC 9655 processors per node, 96 cores per processor and 768 GiB memory per node. Shared-memory experiments scale to 192 cores on one node; distributed experiments use two nodes and scale to 384 cores. Julia 1.12.6, Dagger.jl 0.19.4, MPI.jl 0.20.26 and Open MPI 5.0.7 are specified; Slurm handles process placement and binding, OpenBLAS is constrained to one thread, and each runtime experiment is repeated five times and averaged.

The reproducibility repository materially strengthens the paper's methods section. It contains generated kernels, generated test harnesses, model interaction logs, runtime CSV data from Otus, framework-specific prompts, the common system prompt and explicit benchmark definitions. Its `experiments.json` records the π, GEMM and Cholesky task statements, while the README documents a per-model directory structure for kernels, tests, logs and runtimes. This makes the agent process and final artifacts inspectable instead of reducing the study to aggregate benchmark numbers.

## Findings: Functional Success Does Not Define the Failure Envelope

All three model families can produce executable implementations at small problem sizes and low thread/process counts. GPT and Opus consistently pass the study's correctness checks; Qwen produces executable code in several cases but also returns incorrect results in others.

The more important result appears when execution is scaled. Implementations that pass small tests later fail with **deadlocks, oversubscription, out-of-memory errors, crashes and timeouts**. These are not cosmetic performance differences: they show that the functional-test boundary and the operational-failure boundary are different.

The specific scaling results reinforce that point. For numerical π integration, Base.Threads generally avoids the scheduling overhead seen in Dagger.jl, while MPI shows near-ideal scaling for the simple distributed workload. For tiled GEMM, one generated Opus/Dagger implementation degrades and fails beyond 32 threads because of unresolved scheduling/dependency behavior, while MPI implementations scale more reliably than the generated distributed-Dagger variants. For tiled Cholesky, shared-memory GPT and Opus Dagger variants encounter deadlocks at 24 and 32 tasks respectively, whereas Base.Threads variants continue to 192 threads and saturate around 64.

The study does **not** conclude that Dagger.jl or task-based execution is inherently unsuitable. Inspection shows that agents frequently reintroduce manual scheduling/data-management patterns or choose dependency structures that do not exploit the framework well. The observed failure is therefore partly about the generated implementation strategy, not a universal verdict on the programming model.

## Agent-process Evidence Matters Too

Generation logs are not ancillary evidence in this study. They explain why final programs differ. GPT and Opus follow comparatively structured cycles of planning, testing and performance experimentation. Qwen's process is less structured and more often uses problem sizes too small to produce meaningful scaling information.

The paper also identifies a transfer problem: extensive local optimization can improve the code on the generation environment while overfitting to it. During generation, agents do not have the same distributed-memory topology, process placement, node-level memory constraints or large core counts that exist on the target supercomputer. A locally refined implementation can therefore look increasingly successful while becoming a poor predictor of target-system behavior.

This yields a second evaluation boundary: **tool-mediated iteration is evidence of development behavior, not automatically evidence of deployment fitness**. Logs can show that the agent tested and refined its work, but target-environment execution is still required for claims about operational scaling.

## Evaluation Dimensions Exposed by the Study

The study supports separating at least five evidence dimensions:

1. **Functional correctness** — does the generated program produce the expected result on admitted test inputs?
2. **Agent process evidence** — how did the agent plan, use documentation/tools, generate tests, react to failures and refine the implementation?
3. **Operational failure envelope** — at what workload, concurrency and resource conditions do deadlock, oversubscription, memory failure, crash or timeout appear?
4. **Performance and scalability** — how does runtime change with thread/process count, and how does the generated implementation compare with relevant framework baselines?
5. **Transfer and reproducibility** — are prompts, model/tool versions, generated artifacts, logs, hardware/software settings and repeated measurements available, and does the generation environment match the target environment closely enough for local tuning to transfer?

For HPC these dimensions are directly measurable with threads, processes, memory and scaling curves. For ordinary software-engineering agents, the **inference** is structural rather than metric-specific: a repository-level evaluation may need analogous stress, concurrency, workload, dependency, resource and target-environment evidence. The study does not prove which exact metrics should be used outside parallel numerical computing.

## Reproducibility Strength

The research package exposes substantially more than a paper PDF. The public repository includes the common system prompt, per-framework prompts, benchmark definitions, generated code, generated tests, model interaction logs and measured runtime data. The paper states the main software versions, target-system hardware, execution topology and five-run averaging procedure.

That evidence makes the experiment inspectable and supports re-analysis of how the agent arrived at a kernel and how the kernel behaved. It does not make model generation deterministic. The paper reports that each model/problem/framework combination is generated only once; generation is nondeterministic, and the authors argue that iterative testing mitigates variability rather than eliminating it.

## Limits and Unknowns

- Each model/problem/framework combination is generated once. The experiment therefore does not estimate generation-to-generation variance for the same condition.
- Iterative functional testing mitigates some stochastic generation failures but cannot substitute for repeated independent generations when measuring model reliability.
- The generation sandbox and target supercomputer differ materially. The agent does not receive realistic distributed-memory, placement, memory-limit and large-core feedback while generating most of the code.
- The study lacks a non-Julia or vendor-optimized ground-truth implementation. Base.Threads and MPI.jl are within-Julia baselines, so framework inefficiency and code-generation inefficiency cannot always be cleanly separated.
- Prompt constraints create a comparability-versus-flexibility trade-off: permissive prompts may let agents bypass a framework's intended model, while restrictive prompts may suppress framework-specific solutions.
- Kernel generation time is the only directly measured cost dimension. Token usage and human-guidance time are not included in a complete cost-time-value analysis.
- The paper does not trace implementation choices to training data, so similarity to learned code patterns is unresolved.
- Results from Julia numerical kernels and HPC runtimes should not be generalized directly into claims about all software-engineering agents. The transferable finding is the need to evaluate beyond small functional success, not the exact framework ranking or thread-count thresholds.
- The evidence shows that some generated code fails under scaling; it does not establish a universal threshold at which agent-generated software becomes “production ready.”

## Unresolved Questions

1. How many independent agent generations are needed before an evaluation can estimate reliability rather than demonstrate one successful development trajectory?
2. Which target-environment facts should an agent be allowed to observe during refinement without turning the benchmark into environment-specific overfitting?
3. How should an evaluation combine functional correctness, operational robustness, scalability and agent-process quality into a claim that remains auditable rather than collapsing them into one score?
4. For non-HPC software, what are the corresponding operational stress dimensions — concurrent users, queue depth, dependency failures, rate limits, data volume, restart/recovery or resource ceilings?
5. Which parts of the agent interaction log are necessary evidence for reproducibility, and which are incidental reasoning traces that should not become a governance dependency?
6. How should cost be measured when the agent can repeatedly benchmark and refine against an expensive shared target system?

## Reading Conclusion

The primary research supports a bounded conclusion: **small-scale functional correctness is necessary but insufficient evidence for the operational capability of agent-generated parallel software.** The agentic loop improves the chance of catching missing imports, interface mismatches and simple runtime errors, but larger problem sizes and parallelism expose deadlocks, oversubscription, memory failures, crashes and timeouts that small tests do not reveal. A credible evaluation should therefore record both the agent's iterative tool-mediated development process and the generated artifact's behavior under realistic workload and scaling conditions. The exact HPC metrics do not automatically transfer to ordinary software engineering, but the evidence strongly rejects the broader shortcut that “the agent tested it and it passed” is by itself an operational-readiness claim.
