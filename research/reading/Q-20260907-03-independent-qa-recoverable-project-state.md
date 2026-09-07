# Q-20260907-03 — Long-Horizon Agent Development Needs Independent QA and Recoverable Project State

- Runtime date: 2026-09-07 (Asia/Shanghai)
- Queue signal: SIG-20260907-006
- Primary research source: https://arxiv.org/html/2609.01481v1
- Evidence level: `peer_reviewed_or_primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

When autonomous software work extends across many context windows or days, which completion evidence must remain independent from the implementing agent, and what durable project state must survive between invocations so that the next agent continues validated work rather than reconstructing the project from chat memory?

## Problem

Long-horizon coding changes the failure mode of agentic software engineering. A single invocation can hold its plan, recent failures and test observations in context. Across many invocations, that transient interaction history disappears. If the next worker receives only source code or a conversational summary, it may repeat failed approaches, forget unresolved defects, regress previously validated behavior or accept an incomplete implementation based on the prior developer's self-description.

The selected study addresses this through a Harness-of-Harness (HoH) structure: planning, development and independent testing are separate role invocations around a versioned software artifact, while execution evidence is carried across loops as a distinct project state.

## Harness Architecture

HoH operates above an existing coding-agent harness rather than replacing the underlying model or tool environment. Each bounded loop has three functions:

1. **Project Planner** — decides the next coherent increment using the specification, retained evidence and current artifact as context; it does not modify the artifact.
2. **Developer** — has write authority and local technical autonomy to implement that increment in the current artifact.
3. **QA Tester** — evaluates the resulting fixed candidate and produces evidence for the next loop; acceptance is intentionally independent from the implementation claim.

The paper emphasizes that these functions require different context and authority. Objective selection needs project-level visibility, implementation needs artifact write access, and acceptance needs observations independent of the implementer. The same harness–model configuration may be reused across roles, but each role is a separate invocation under a deterministic Runtime contract that freezes inputs, enforces permissions, binds evidence to the tested candidate and records project state.

This is an important distinction for multi-agent engineering: **role independence is an execution and evidence boundary, not necessarily a different model vendor.** Using the same base model does not collapse the roles if the runtime gives them separate inputs, permissions and candidate-bound responsibilities, although correlated model errors remain a separate limitation.

## Artifact State and Evidence State

HoH explicitly separates two cross-loop states.

### Artifact state

The artifact state contains the implementation itself: source code, configuration, resources and project metadata. It records what the software currently is and gives the next Developer a concrete starting point.

### Evidence state

The evidence state records validated project knowledge: which behaviors have been verified, which claims remain unsupported and which observed failures remain unresolved. It guides the next planning decision and identifies behavior future modifications must preserve.

The paper's key point is that neither state subsumes the other. Code does not fully encode why a change was selected, which defect is still open or which behavior was previously validated. Conversely, evidence without the actual candidate cannot reconstruct the implementation. Long-horizon continuity therefore requires both.

A bounded runtime inference is that a resumable project should checkpoint at least a stable artifact revision plus evidence that is explicitly bound to that revision. A prose summary without an immutable candidate pointer cannot establish which version the tests or acceptance claims refer to.

## Why Chat or Context History Is Insufficient

The study states the failure directly: bounded-context harness invocations lose information retained only in interaction history. A later loop that gets only the code must infer development state from implementation details and may:

- overlook unmet requirements;
- repeat work with already-known outcomes;
- forget unresolved failures; or
- regress behavior that had been validated earlier.

This makes conversation continuity a poor substitute for project continuity. A chat transcript can be useful context, but the recoverable truth of the project should live in durable artifacts, evidence and version history that can be independently inspected after any individual agent session disappears.

## Independent Acceptance

The study makes a strong separation between implementation claims and acceptance. The Developer knows what it changed, but that knowledge does not prove the required behavior exists. Acceptance is instead based on observations of a fixed candidate by a role that did not produce that candidate.

The QA Tester may use scenario-appropriate black-box and white-box evidence. Black-box checks exercise the candidate through ordinary inputs and user-visible behavior; white-box checks inspect source, configuration, resource bindings, runtime state and logs. The evidence is then used by the next Project Planner, rather than being reduced to a developer's statement that the work is complete.

For governed software agents, a bounded inference is that `Developer reports done` and `candidate accepted` should be different state transitions. The latter should reference a precise candidate revision and independent evidence packet.

## Required-Artifact Contract Rather Than Prescribed Reasoning

HoH constrains outputs, access and role responsibilities without prescribing the agent's internal reasoning process or exact tool sequence. The Runtime decides which inputs each role may access, what it may change and which structured deliverable it must produce; the model remains free to choose how to accomplish its assigned work inside those boundaries.

This is significant for harness design because it places determinism at the contract boundary rather than attempting to make an LLM's internal path deterministic. A project can preserve auditable state transitions even when the model's local reasoning is variable.

## Experimental Evidence

The benchmark evaluation spans GameCraft-Bench, FrontierSWE and ProgramBench with three harness–model pairs:

- Codex with GPT-5.5;
- OpenCode with DeepSeek-V4-Pro; and
- Pi with MiniMax-M3.

After three iterations, HoH reports an **average relative gain of 52.25%** over corresponding standalone harness baselines and a **maximum gain of 82.86%** in the reported benchmark conditions. The study also reports continued quality gains over additional loops in some settings and includes resource-accounting and ablation analyses.

These numbers show that the iterative role-and-evidence structure is associated with substantial gains in the tested configurations. They should not be treated as universal productivity multipliers; benchmark metrics, model versions, tasks and baselines all condition the result.

## Multi-Day Case Study and Traceability

The second setting is a multi-day autonomous first-person-shooter development project with more than 70 HoH iterations. Domain-specific tools and skills support engine interaction, asset work, debugging, testing and project-state management.

GitHub is used for version control and issue tracking. At each loop, state is materialized through:

- a development document;
- the versioned software workspace; and
- testing records including an issue table and evidence-packet files.

The authors use commit and issue histories plus testing evidence to trace capability growth, issue discovery, closure and reopening. By Loop 70, 65 of 81 recorded issues had been closed, 16 remained unresolved, and 17 issues had been reopened after earlier closure when later changes caused previously verified behavior to fail again.

That non-monotonic history is especially important. A closed issue is not a permanent truth about all future revisions. Validation belongs to a candidate state, and later changes can invalidate earlier evidence. Recoverable project history therefore needs both continuity and freshness.

## Recovery Semantics Suggested by the Evidence

The source does not define a crash-recovery protocol, but its state model supports a bounded engineering interpretation for long-running coding agents:

### Stable candidate identity

Every acceptance or failure observation should be attached to an exact artifact revision rather than only a task name or conversational description.

### Durable evidence continuity

Unresolved issues, validated behaviors, failed approaches and acceptance evidence should survive agent/session termination independently of the model context.

### Freshness after change

When a later revision touches behavior previously accepted, the runtime should not blindly inherit the old acceptance state. Reopened issues in the case study illustrate why evidence can become stale.

### Role re-admission

A resumed Planner, Developer or QA invocation should recover its role-scoped inputs and authority from durable runtime state instead of inheriting whatever permissions happened to exist in the prior session.

### Replayable acceptance target

Independent QA should be able to inspect or reproduce the exact candidate that generated the evidence packet. Otherwise a later artifact may be incorrectly associated with tests run against an earlier version.

These are inferences from the paper's architecture and case evidence; the authors do not claim to provide a general exactly-once or crash-consistency specification.

## Failure Modes for Long-Horizon Agent Engineering

### Self-verification collapse

The same implementing invocation decides that its own output is acceptable, so implementation confidence is mistaken for independent evidence.

### Chat-summary continuity

A new session receives a prose summary but not the exact artifact/evidence state, causing it to reconstruct decisions and lose unresolved or validated facts.

### Artifact-only recovery

Source code survives, but rationale, known failures and prior test evidence do not, so work is repeated or regressions are missed.

### Evidence-without-candidate identity

A test report says “passed” without binding the result to a specific revision, allowing later changes to inherit stale acceptance.

### Closed-means-permanent

A previously resolved issue is treated as permanently solved even after later changes touch the relevant path.

### Harness-reasoning overconstraint

The runtime attempts to prescribe the model's exact internal workflow rather than enforcing observable input, authority, artifact and evidence boundaries.

## Evidence Strength

The source provides primary research evidence across three benchmark families, three harness–model pairs, controlled comparisons and a long multi-day case with retained project histories and testing records. Its design explicitly separates planning, implementation and independent evaluation and formalizes artifact/evidence state across loop boundaries.

The strongest support is for the architectural distinction between implementation state and validated evidence state, and for the need to bind acceptance to observations of a fixed candidate. The benchmark gains add empirical support that this structure can improve measured software outcomes in the tested settings.

## Limits and Unknowns

- HoH is reported by its authors on selected benchmarks and a large case study; independent replication across other organizations and toolchains is still needed.
- The same base harness–model configuration can fill Planner, Developer and QA roles, so role separation does not eliminate correlated model failure.
- Benchmark reward and game-quality evaluation are proxies for software quality, not formal proofs of correctness, security, maintainability or production readiness.
- The 52.25% average relative gain and 82.86% maximum are configuration-specific results, not universal estimates for all coding agents.
- Issue counts and raw test/evidence volume do not directly measure the quality or independence of the underlying tests.
- The framework preserves project history but does not by itself prove crash consistency, atomic commits, exactly-once side effects or recovery from partially applied external operations.
- Independent QA can still be wrong or insufficiently scoped; separation of role is necessary evidence hygiene, not a guarantee of correctness.
- The multi-day game case uses domain-specific tools, assets and verification practices that may not transfer directly to other software classes.

## Unresolved Questions

1. What minimum evidence packet should a long-running coding runtime require before a candidate may move from Developer-complete to QA-accepted?
2. How should evidence freshness be invalidated automatically when later revisions touch dependencies of previously validated behavior?
3. Can an independent QA role reuse the same model while achieving sufficient error independence, or should some risk classes require model/vendor diversity?
4. Which parts of project history belong in structured machine-checkable state versus narrative development notes?
5. How should irreversible external effects—deployments, migrations, API writes—be represented so a recovered session does not repeat an unknown prior effect?
6. Can project-state checkpoints be minimized without losing the decision history needed to avoid repeated repairs and regressions?

## Reading Conclusion

The selected evidence supports a bounded conclusion: **long-horizon agentic software development needs durable artifact state, durable evidence state and an acceptance boundary independent from the implementing claim.** A context window is disposable; the project must not be. HoH shows a concrete architecture in which planning, development and QA are separate invocations, versioned artifacts and testing evidence cross loop boundaries, and later work can preserve or reopen previously validated behavior based on fresh observations. Analysis may therefore treat stable candidate identity, evidence continuity, freshness and independent acceptance as separate runtime concerns, while avoiding any claim that the reported benchmark gains or role structure alone prove production-grade recoverability or correctness.
