# Q-20260908-03 — GUI and CLI Agent Actions Need One Shared Effect and Provenance Chain

- Runtime date: 2026-09-08 (Asia/Shanghai)
- Queue signal: SIG-20260908-005
- Primary research source: https://arxiv.org/html/2609.05374v1
- Evidence level: `peer_reviewed_or_primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`
- Authoritative control-source commit: `3fb9416db906076aa2272477c5b3a4702b82b1dc`
- Generated Reading Prompt: `v1.0.0` / SHA-256 `9ad93d7f4cd7859fc0b32fa9b3b9e2b836a177c889addcc67d0b4fdc3261d7b5`

## Research Question

When an agent switches between GUI actions and CLI/tool calls that both mutate the same underlying application state, how should execution identity, effect evidence and trajectory verification stay unified so one business effect is not split into separate audit stories by control surface?

## Source-Completeness and Comparison Gate

The complete primary study, **CUA-Universe: A Scalable and Dynamic Environment for Hybrid GUI+CLI Agents**, was read across the hybrid-state formulation, App-Forge environment construction, shared-state tool design, Task-Weave task synthesis, Path-Steer rollout steering, trajectory verification, training pipeline, CUA-Verse/OSWorld/OSWorld-MCP evaluation, efficiency and transfer comparisons, judge-human agreement, rollout harness, training details, evaluation prompts and limitations. The source itself contains designed comparisons across GUI-only versus GUI+CLI execution, base versus fine-tuned policy, Path-Steer versus no Path-Steer, in-domain versus out-of-domain training, and external OSWorld-MCP transfer, satisfying the comparative-evidence gate for this selected primary-research object.

## Scope

CUA-Universe is not primarily an audit framework. It is a training and evaluation environment for computer-use agents. Its relevance to runtime governance comes from one structural choice: **GUI actions and application-specific CLI actions operate over one shared persistent application state**.

The framework turns 16 real desktop applications into reproducible environments. Eight are adapted from OSWorld and receive a new shared-state CLI layer; eight additional applications are added by the authors. Application command surfaces come from native CLIs, scripting APIs or generated agent-native CLIs where needed.

A hybrid task is modeled as a partially observable process in which each action belongs to either the GUI action space or the CLI action space, but both read and modify the same state. A task includes an instruction, concrete seed state and verifier. The resulting trajectory contains observations, reasoning, GUI actions, CLI actions, tool return codes/output, screenshots and final scores.

That is the key architectural fact: modality is an **action surface**, not a separate business transaction domain.

## App-Forge: Shared-State Surfaces Rather Than Parallel Worlds

App-Forge makes diverse desktop software reproducible and constructs a programmatic tool surface aligned with each application’s GUI. The CLI layer may use native commands, scripting APIs such as Blender `bpy` or LibreOffice UNO, or generated wrappers.

The paper explicitly states that GUI and CLI operate over the same project state. Lightweight adapters resynchronize stale GUI views after external CLI edits.

This detail has direct provenance implications. A CLI command can mutate a file or project correctly while the GUI still shows an old view. Conversely, a GUI action can change the same underlying object that a later CLI command inspects. Therefore:

- screenshot freshness is not identical to application-state freshness;
- interface-local observations can disagree temporarily without implying two different effects;
- verification needs a rule for which evidence reflects the authoritative state of the artifact being judged.

## Task-Weave: Effects Are Grounded in a Concrete Initial State

Task-Weave synthesizes tasks from reusable operations discovered through real application exploration. Operations are composed against a concrete seed state rather than against an abstract prompt alone. Candidate tasks are then executed and refined or discarded if the live environment cannot support them.

This gives each benchmark task a useful effect identity:

`instruction + initial application state + allowed action surfaces + verifier`

The runtime inference is that a GUI/CLI execution should likewise bind its evidence to one initial state and one effect target. Without that binding, two surface-specific logs can both be internally correct while referring to different revisions of the underlying object.

## Path-Steer and Hybrid Orchestration

Path-Steer supplies modality-level guidance during data generation: precise or high-throughput operations may favor CLI, while visual/spatial operations may favor GUI. The steering is removed at evaluation so the learned policy must choose modalities itself.

On a fixed 320-task comparison with identical GUI+CLI access, Path-Steer improves both acceptance and efficiency for the data-generation backbones. For Kimi K2.5, reported Accept Rate rises from `0.44` to `0.51`, Mean Score from `0.63` to `0.71`, while average steps fall from `26.68` to `22.75` and tokens from about `385K` to `332K`. Seed2.1 Pro shows the same direction.

Because both sides already have CLI access, this comparison supports a narrower conclusion: **having multiple action surfaces does not itself create good orchestration; the policy must learn when and how to switch between them.**

## CUA-Verse Evidence

CUA-Verse contains 160 held-out hybrid tasks across eight professional applications, 20 tasks each. The tasks average 5.7 abstract tools and about 59% of the abstract tools are CLI-classified; every application mixes both modalities.

The fine-tuned Qwen3.5-9B model reaches a reported score of `0.582`, compared with `0.189` for the identical base model under GUI+CLI. It uses about 35.2 steps and 255K tokens per episode, versus 56.2 steps and 643K tokens for the base. These are large in-environment gains, but the applications themselves are in-domain even though the tasks are held out.

The result demonstrates learnable hybrid orchestration, not production correctness.

## OSWorld Evidence: Interface Exposure Alone Is Not Enough

On the controlled 244-task OSWorld scope, the authors compare GUI and GUI+CLI modes. Their model rises from `23.4%` GUI success rate to `40.2%` under GUI+CLI. The same base Qwen3.5-9B reaches `24.6%` in GUI+CLI mode, showing that simply exposing a CLI does not reproduce the trained policy’s benefit.

For jointly solved tasks, GUI+CLI generally reduces execution cost. The paper also gives a concrete VS Code example: GUI interaction locates the relevant setting, then CLI writes the exact configuration and verifies persistence, solving the task; GUI-only interaction exhausts the action budget without committing the correct setting.

This is useful evidence for a shared-effect model: one successful task can legitimately include GUI discovery and CLI mutation, and the final business effect belongs to the combined trajectory rather than to either surface independently.

## Transfer to an Unseen Tool Interface

CUA-Universe trains with application-specific CLI tools but evaluates transfer to OSWorld-MCP, which exposes 158 MCP tools. On 244 evaluated tasks, the authors report Strict Success Rate improving from `20.90%` for the base to `28.69%` for their model, a `+7.79` point gain, while tool-use decision accuracy more than doubles from `10.66%` to `23.36%`.

The trained 9B model records an average completion-step value of `27.25` and reduces steps by about 27% and tokens by about 30% relative to its base. This supports transfer of orchestration behavior beyond the exact CLI action schema used for training.

The bounded inference is not that CLI and MCP are interchangeable authorities. It is that **surface choice can vary while the task/effect identity remains stable**, which makes a unified provenance layer more important rather than less.

## Trajectory Verification and Evidence Precedence

The pipeline retains trajectories that receive a sufficiently high VLM score. The judge is grounded not only in screenshots but also in CLI output and exported-artifact evidence.

This is especially relevant when GUI views are stale after a CLI write. The evaluation prompts explicitly note that CLI modifies files on disk and the GUI may not auto-update; agents must inspect return code and output. For tasks whose truth lives in an exported artifact or file, the judge can rely on that artifact evidence rather than demanding that the final screenshot alone prove the contents.

The study therefore already implements a form of **heterogeneous evidence precedence**:

- screenshots are important for visual state;
- CLI return/output provides execution evidence;
- exported/file artifacts can be authoritative for persisted content;
- all of those pieces are attached to one trajectory and one task verifier.

For an auditable runtime, this suggests the evidence model should be **effect-centered**, not surface-centered. GUI evidence and CLI evidence should remain distinct observations, but both should reference the same execution/effect identity.

## Judge Reliability and Its Boundary

The authors validate the VLM judge against three human annotators across all 16 applications. On 480 judge-accepted trajectories, reported acceptance precision is `99.0%` (475/480); none of the accepted samples is labeled a complete human failure, with the five disagreements being partial successes. Reweighted overall agreement is `97.0%` with Cohen’s `κ = 0.94`. The rejection set has a `5.2%` false-negative rate for fully successful trajectories.

This is strong evidence that the conservative judge is a useful training-data filter in the benchmark. It does **not** turn the VLM score into a production-grade proof object. The paper itself lists VLM scoring as a limitation and acknowledges remaining label noise.

## One Shared Effect Chain Suggested by the Evidence

A production runtime that allows both GUI and CLI/tool execution over the same application should preserve at least these identities:

### Execution identity

One stable run/action-chain identifier should span surface switches. Starting a terminal command should not silently create a new business execution if it is continuing the same requested effect.

### Target / pre-state identity

The runtime should identify the application/workspace/artifact revision being changed. A screenshot and a CLI result are only comparable when they refer to the same target state lineage.

### Surface-specific action evidence

Each GUI gesture and CLI/tool call should retain its own arguments, observations and outcomes. Unification should not erase which surface caused a mutation.

### Effect evidence

The final persisted state should be checked using the evidence source appropriate to the effect: exported artifact, application file, state API, screenshot, or another authoritative probe.

### Trajectory linkage

All action surfaces and final verification should remain linked in one provenance graph so a later auditor can reconstruct how the effect was produced.

## Why Surface-Specific Audit Trails Are Insufficient

If a runtime records GUI work and terminal/tool work as separate histories without a shared effect identity, several ambiguities appear:

- the CLI may change a file while the GUI audit still shows the pre-change screen;
- a later GUI refresh may look like a new effect even though it only materializes a prior CLI mutation;
- retries can duplicate an effect if the system assumes an unrefreshed GUI means the CLI failed;
- authorization may be checked separately by surface even though both routes reach the same protected business state;
- incident review may be unable to determine whether two actions are alternatives, retries or parts of one composite execution.

CUA-Universe does not solve these production-governance questions, but its shared-state architecture makes the underlying identity problem concrete.

## Important Non-Findings

The source does **not** establish that:

- CLI is generally safer or more correct than GUI;
- GUI+CLI access automatically improves agents—the base model demonstrates otherwise;
- a VLM-verified benchmark trajectory proves exactly-once side effects;
- a successful final artifact proves all intermediate actions were authorized;
- shared-state local VM execution captures external SaaS, network, payment or irreversible side effects;
- one benchmark verifier provides complete causal provenance;
- the reported efficiency gains transfer unchanged to enterprise desktop or browser automation.

## Evidence Strength

The evidence is strong for the narrow mechanism that GUI and CLI can be orchestrated over the same state and evaluated as one trajectory. The source includes reproducible VM environments, explicit shared-state interfaces, held-out tasks, multiple model/interface comparisons, an unseen MCP transfer test, Path-Steer ablations and human validation of the trajectory judge.

The strongest engineering evidence for this research object is not the headline accuracy gain; it is the explicit state model in which **both action surfaces mutate one persistent application state and their heterogeneous evidence is consumed by one task verifier**.

## Limits and Unknowns

- CUA-Verse tasks are single-application; cross-application workflows are left for future work.
- Training uses supervised fine-tuning from harvested trajectories and remains bounded by the data-generation backbone.
- Task success relies on a VLM judge rather than per-task deterministic programmatic verification.
- Application adaptation assumes software is open-source or scriptable enough to expose a CLI surface.
- Environments target desktop Linux; closed-source/non-desktop generalization is open.
- The VM is controlled and reproducible, unlike many production systems with remote asynchronous state.
- The study does not model per-action authorization, credential scope, compensation, idempotency keys, transaction commits or unknown external effects.
- A screenshot/file/export precedence rule is benchmark-specific and should not be copied blindly into production without explicit authoritative-state contracts.

## Unresolved Questions

1. What stable identity should bind GUI gestures and CLI/MCP calls that implement one business effect?
2. How should the runtime detect that a stale GUI is merely a presentation lag rather than evidence that a CLI write failed?
3. Which state probe is authoritative when screenshot, application API, exported artifact and filesystem disagree?
4. Should authorization be expressed against the protected effect/target rather than separately against GUI and CLI surfaces?
5. How should retry/idempotency logic behave when one surface’s result is known but another surface has not refreshed?
6. Can trajectory evidence be compacted without losing the cross-surface causal links needed for later audit and recovery?

## Reading Conclusion

The selected evidence supports a bounded conclusion: **an interface switch should not create a new execution identity when GUI and CLI/tool actions are jointly mutating the same underlying application state.** CUA-Universe demonstrates a concrete shared-state environment in which heterogeneous GUI and CLI actions form one trajectory, and verification may combine screenshots, command results and exported artifacts according to the state being judged. For production governance, this suggests a single effect/provenance chain spanning all control surfaces, while retaining surface-specific action evidence and explicit authoritative-state probes. The benchmark does not prove authorization correctness, exactly-once effects or complete production auditability, so Analysis should treat unified cross-surface provenance as an engineering implication rather than as a claim already solved by the benchmark.
