# Q-20260917-01 Deep Reading — Replayable memory needs execution-time eligibility evidence

- **Run date:** 2026-09-17
- **Column:** Digital Employee
- **Selected object:** Q-20260917-01
- **Signal:** SIG-20260917-005
- **Primary source:** EchoPath: Execution-Level Replayable Memory for GUI Agents — https://arxiv.org/abs/2609.16635
- **Evidence identity:** primary research paper plus its reported experimental artifacts and repository lifecycle description
- **Reading boundary:** source-complete Deep Reading only; no Research Analysis, article writing, visualization, Production or Publication

## Research question

When an agent has previously completed a GUI workflow successfully, what evidence makes that historical trajectory eligible to execute again in a different run? In particular, can semantic similarity between the new request and a stored memory safely grant replay, or must eligibility also depend on provenance, validation, current environment state, permitted parameter changes and target binding?

## What was read

The complete EchoPath paper was read across introduction, method, replay operator, experiment design, results, limitations and appendices describing ActionLens, memory retrieval/consolidation, image-based target re-aiming, promotion gates, state contracts, flexible-input reasoning and fallback behavior. The paper's reported OSWorld-Verified second-pass evaluation, retrieval stress test, target re-aiming diagnostic and replay start-state/flexible-input diagnostics were included.

## System and mechanism

EchoPath turns a previously successful GUI trajectory into a bounded callable memory rather than injecting the old trajectory as free-form context for another full planning pass. Its important separation is between **finding a potentially relevant memory** and **admitting that memory for execution**.

A stored memory carries task intent, application identity, lifecycle status, artifact-validation evidence, reasoning viability, action-schema compatibility, state preconditions, approved flexible parameters and visual evidence for pointer actions. Retrieval first finds candidates by task-intent similarity, but a candidate can still be rejected because it is inactive, names an incompatible application, lacks positive artifact validation, lacks a viable reasoning report, uses unsupported primitives or lacks visual evidence required for replay. The paper reports a replay compatibility threshold of 0.75 after explicit gates are evaluated; similarity by itself is therefore not the execution decision.

At replay time, fixed structural actions remain fixed. Only declared flexible inputs may be rebound. Pointer coordinates are not treated as portable facts: stored target crops and coordinate context are matched against the current screenshot so the target can be re-aimed. If a target is ambiguous, a state precondition fails, or replay would require mutating a non-flexible field, direct replay is rejected and control falls back to bounded grounding repair or ordinary planning.

The memory lifecycle is also explicitly governed. Candidate traces are promoted only after external artifact evaluation; failed or blocked candidates can remain for diagnosis or repair but are not exposed as active replay memories by default. The repository model includes branching, repair, merge, deprecation, quarantine and lineage tracking.

## Quantitative evidence

The main analysis pool contained **159 active executable memories**. Stored tasks contained **2–29 GUI actions**, with most using 4–13 steps; consolidation removed about **30%** of exploratory steps from final replay trajectories.

In matched second-pass evaluation, Codex EchoPath recalled the expected memory for all 159 tasks and completed **145/159 (91.2%)**. Median consumption was **20,370 tokens** and **127.5 seconds**. The reported Synapse planning-augmentation baseline achieved a comparable **91.8%** success rate but used **586,386 median tokens** and **315.7 seconds**. This supports the narrower claim that a validated replay path can preserve comparable completion reliability while substantially reducing repeated planning cost.

Retrieval stayed at **100% correct recall** with no wrong selections or misses as the active repository was synthetically enlarged from **159 to 659 memories**. This is useful evidence about the retrieval experiment, but it does not make retrieval itself an authorization mechanism.

For 200 coordinate-based actions, original-screen visual matching accepted **95.5%** and every accepted match had zero-pixel deviation. Under random scaling it accepted **190/200** cases; 188 were within 2 pixels and all accepted cases were within 10 pixels. Rejections concentrated on repetitive or visually near-duplicate targets, which is exactly the class where fail-closed ambiguity handling matters.

In the replay start-state diagnostic, among 50 cases per condition the gate accepted **49 compatible starts**, accepted **46 partially changed starts**, and rejected **39 incompatible starts**. Flexible-input tests accepted all **50/50** declared substitutions and rejected all **50/50** attempted mutations of non-flexible fields. These diagnostics show that eligibility is observable and imperfect rather than a Boolean property inherited forever from the first successful run.

## Claim-to-evidence map

1. **A successful past trajectory can be represented as a reusable executable artifact.** Supported by the paired two-pass OSWorld-Verified experiment and the active-memory repository.
2. **Semantic retrieval is insufficient for replay admission.** Supported directly by the separate compatibility gates, artifact validation, state contracts and replay threshold.
3. **Current-state evidence matters at execution time.** Supported by start-state gating and visual target re-aiming under changed resolution.
4. **Mutable parameters need an explicit contract.** Supported by declared `flexible_action_inputs` and the 50/50 accept/reject diagnostic.
5. **Ambiguity should revoke direct replay eligibility rather than be silently guessed through.** Supported by the target ambiguity margin and the reject/fallback path.
6. **Historical success should not permanently confer active status.** Supported by lifecycle states including promotion, repair, deprecation and quarantine.

## Negative cases and limitations

The paper explicitly says its current diagnostics do **not** establish live robustness under broad interface drift or enterprise-scale deployment. Memory acquisition still depends on an initial agent completing the task; complex first-pass runs can therefore contain exploration and failed attempts before consolidation. The state gate also produced false rejections around repetitive or low-confidence visual targets, showing that a single visual probe is not always sufficient.

The experiment is about GUI replay. It does not establish that the same mechanism safely replays irreversible SaaS writes, money movement, messages, database mutations, credential changes or other external effects. A memory can be eligible under EchoPath's task/application/state contract while the business action is no longer authorized. Likewise, successful replay does not prove idempotency, exactly-once execution, target ownership or compensation after an unknown side effect.

## Bounded Runtime finding

**Replay eligibility is a fresh execution-time fact, not a property inherited from semantic similarity or historical success.** A long-lived digital employee should therefore keep at least these identities separate:

- **Memory identity and lineage:** what historical execution produced the reusable artifact;
- **Validation identity:** what evidence allowed that artifact to enter the active memory set;
- **Current compatibility:** whether application, state, target and allowed parameters still match now;
- **Replay admission:** whether this memory may be instantiated in this run;
- **Business authorization:** whether the resulting real-world action is allowed now;
- **Effect verification:** whether the authoritative target state actually reflects the intended single effect.

EchoPath supplies evidence for the first four layers in a GUI setting. It does not collapse them into the last two.

## Open questions

- How should state contracts be refreshed after application upgrades, localization or major layout drift?
- What evidence expires an active memory even if no replay failure has yet occurred?
- How should replay eligibility bind to identity/target authorization for multi-user enterprise systems?
- Can external-effect tools expose idempotency keys or authoritative postcondition probes so a replayable procedure remains recoverable after uncertain responses?
- Should a previously accepted memory require independent re-validation after its executor model, tool implementation or environment version changes?

## Traceability

Primary source: https://arxiv.org/html/2609.16635

Key source regions read: replay compatibility and rejection path; paired two-pass OSWorld-Verified evaluation; second-pass Table 1; retrieval stress test; target-reaiming Table 2; state-gate/flexible-input diagnostics; ActionLens and promotion rules; limitations and future work.
