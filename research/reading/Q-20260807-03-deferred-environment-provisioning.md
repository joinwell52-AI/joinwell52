# Reading Record — Q-20260807-03 Report-and-materialize lifecycle for deferred agent environment provisioning

- **Queue item:** `Q-20260807-03`
- **Column:** Open-source Engineering
- **Selection status:** Selected
- **Priority:** P0
- **Skill invoked:** `Skill 03 — Deep Reading`
- **Operating date:** 2026-08-07 (Asia/Shanghai)
- **Primary source class:** Merged maintainer change, source code and regression tests in `openai/codex`

## Reading scope

This pass reads merged `openai/codex` PR #37340 / commit `f8ac8fa6c6ac99dd81f02bf1fd947e76c287b219` as evidence about deferred environment provisioning state, report validation, stable environment identity, explicit materialization, idempotence and conflict handling. It records the code-level lifecycle and tests without deciding how CodeFlowMu or another agent runtime should implement environment provisioning. No Research Analysis or article drafting is performed.

## Deep Reading output

```yaml
reading_notes:
  problem:
    - Deferred remote environments previously exposed several overlapping APIs: a one-shot registration handle, a direct readiness publisher and a Noise-environment upsert path in addition to provisioning-status reporting and pending materialization.
    - Multiple mutation paths make it harder to define which object owns readiness, how late reports interact with replacement, what duplicate creation means and how ordinary environments are separated from provisioned ones.
    - The selected question is how one report-and-materialize lifecycle bounds invalid reports, duplicate materialization and conflicts while preserving a stable environment object through Pending, Ready or Failed.

  facts:
    - PR #37340 is merged into `openai/codex`; its merge commit is `f8ac8fa6c6ac99dd81f02bf1fd947e76c287b219` and it changes three files in `codex-rs/exec-server`.
    - The change removes the public `DeferredEnvironmentRegistration` handle, `publish_ready_info`, `register_deferred_noise_environment` and `upsert_noise_environment` APIs from `EnvironmentManager`.
    - The retained provisioning flow is centered on `report_environment_provisioning_status` plus `materialize_pending_noise_environment`.
    - `report_environment_provisioning_status` accepts an environment ID, a Ready-or-Failed report and a provider to use if the provisioned environment does not yet exist.
    - If an environment with that ID already exists but has no provisioning-status channel, it is treated as an ordinary environment and the provisioning report is ignored by returning `Ok(None)`.
    - A provisioned environment keeps the same `Arc<Environment>` while moving from Pending to Ready or Failed.
    - If a valid Ready report arrives before materialization, the manager creates the provisioned environment directly in Ready state and stores the capability-root information.
    - If a Failed report arrives before materialization, the manager creates a provisioned environment with the failure as its initial result.
    - `materialize_pending_noise_environment` creates a Pending provisioned environment only when the ID is absent; when a provisioned environment already exists it returns the same `Arc`.
    - If materialization is requested for an ID occupied by an ordinary environment, the method returns `ProvisioningModeConflict` and leaves the ordinary environment registered.
    - Provisioning updates do not themselves start the remote connection; the source comment states that connection begins when the environment is selected.
    - Ready information is validated for a maximum of 256 selected capability roots, unique non-empty root IDs and matching environment ownership.
    - The commit removes the `DeferredEnvironmentRegistration` Drop behavior that previously converted an uncompleted registration handle into a terminal provisioning error.

  mechanisms:
    - Provisioning identity is represented by the environment map plus an optional provisioning-status sender on the environment object, rather than by a separate one-shot registration capability.
    - Reporting and materialization are order-independent for the intended provisioned path: report-first can create Ready/Failed state; materialize-first creates Pending state that a later report updates.
    - The same provisioned `Arc` is preserved through state updates so existing references observe readiness/failure without object replacement.
    - Ordinary environments are distinguished structurally by the absence of a provisioning-status channel; reports do not mutate them.
    - Materialization performs the opposite boundary check: it refuses to reinterpret an ordinary environment as deferred provisioning and returns a typed conflict.
    - Repeating the same terminal result is permitted, while changing between Ready and Failed is rejected by the underlying report-application logic.
    - Invalid Ready information against an existing Pending environment fails the provisioning gate; a later valid Ready report is rejected because provisioning has already failed.
    - A Ready report can update capability-root information on an already Ready provisioned environment while preserving the same `Arc`.
    - Pending provisioning uses a watch channel carrying an optional Ready/Failed result, which the deferred transport observes before allowing connection progress.

  evidence:
    - The merged commit message explicitly states the API consolidation goal and lists readiness updates, invalid reports, duplicate materialization and ordinary-environment conflicts as covered cases.
    - The source implementation documents report-first creation, stable `Arc` identity, ordinary-environment isolation, failure stickiness and connection deferral.
    - The updated deferred-environment tests verify that an ordinary environment ignores a provisioning report and remains the same object.
    - Tests verify that duplicate materialization returns the existing Pending object and does not call either the original or replacement provider.
    - Tests verify that materialization conflicts with an existing ordinary environment, leaves it registered and never calls the deferred provider.
    - Tests verify that invalid Ready information fails an existing Pending gate, leaves capability roots empty and causes a later Ready report to fail as already-failed provisioning.
    - Tests verify repeated matching Ready reports and Ready-information updates on the same provisioned environment.

  limitations:
    - This is a code-change reading, not a benchmark or production evaluation; the commit establishes intended API semantics and test coverage, not observed reliability under fleet concurrency or failures.
    - The selected commit removes several APIs and many old tests while adding a smaller consolidated test surface; this Reading Result does not claim complete backward compatibility outside the changed crate.
    - The tests use a failing Noise connect provider to assert connection timing and provider-call boundaries; they do not demonstrate a successful end-to-end remote environment connection.
    - The state is process-local in the inspected `EnvironmentManager` code. The commit does not by itself establish durable persistence across process restart, distributed consensus or recovery after host failure.
    - The environment map is protected by Rust locks and stable `Arc` references, but the selected change does not establish cross-process exactly-once materialization.
    - Ignoring provisioning reports for ordinary environments is an explicit isolation rule, but the caller must still interpret `Ok(None)` correctly; the commit does not add a separate audit record for ignored reports.
    - The removal of registration-handle Drop failure changes one earlier lifecycle signal: abandonment is no longer represented by dropping a one-shot capability, so external callers relying on that implicit terminal transition must use the consolidated report path instead.

  comparisons:
    - The old design represented deferred completion through a separate registration object whose `complete` or `Drop` behavior could mutate environment state; the new design centralizes state changes in manager-level report and materialize operations.
    - Direct `publish_ready_info` could change capability roots independently of provisioning state; the consolidated path binds readiness updates to provisioned environments and ignores ordinary ones.
    - Upsert/replacement paths allowed ordinary and deferred Noise environments to replace one another; the new materialization path treats an ordinary environment with the same ID as a provisioning-mode conflict instead of replacing it.
    - Report-first and materialize-first now converge on one provisioned object identity, reducing the number of lifecycle permutations that tests must reason about.

  contradictions:
    - A provisioning report addressed to an ordinary environment is deliberately ignored, while a materialization request for the same ordinary environment is an explicit error. The two operations therefore have asymmetric conflict semantics by design.
    - Repeated Ready information can update capability roots on a provisioned environment, while a transition from Ready to Failed or Failed to Ready is rejected. “Idempotent reporting” therefore applies to lifecycle class, not immutable Ready payload content.
    - Invalid Ready information on an existing Pending environment turns the gate terminally Failed, whereas invalid Ready information for a missing environment does not create one. Validation outcome therefore depends on whether materialization has already established a pending lifecycle object.
    - The old one-shot handle made abandonment observable through `Drop`; the new API simplifies the lifecycle but removes that implicit abandonment signal, shifting responsibility to explicit reporting or higher-level lifecycle ownership.

  unresolved_questions:
    - Which higher-level component is responsible for reporting terminal failure when provisioning work disappears without sending either Ready or Failed after the registration handle is removed?
    - Should ignored provisioning reports for ordinary environments produce an observable diagnostic or audit event rather than only `Ok(None)`?
    - What persistence mechanism is required if Pending, Ready or Failed state must survive an exec-server process restart?
    - How should distributed callers coordinate report-first and materialize-first operations when multiple processes can race on the same environment ID?
    - Should Ready capability-root updates remain mutable indefinitely, or should a later lifecycle phase freeze them after environment use begins?
    - What compatibility boundary applies to downstream callers that used the removed registration, readiness-publication or Noise-upsert APIs?
```

## Source traceability

1. Merged commit: `https://github.com/openai/codex/commit/f8ac8fa6c6ac99dd81f02bf1fd947e76c287b219`
2. Merged PR #37340: `https://github.com/openai/codex/pull/37340`
3. Source at selected commit: `codex-rs/exec-server/src/environment.rs`
4. Deferred-environment tests at selected commit: `codex-rs/exec-server/tests/deferred_environment.rs`
5. Public exports changed at selected commit: `codex-rs/exec-server/src/lib.rs`
6. Today's Research Plan: `research/runtime/plans/2026/08/2026-08-07-plan.json`
7. Skill 03: `research/skills/03-deep-reading.md`

## Reading gate decision

**Result:** Deep Reading completed from the merged maintainer commit, the affected implementation and the updated regression tests. The Reading Result preserves the report/materialize state semantics, validation rules, idempotence, ordinary-environment isolation, conflict behavior and compatibility limits. No Research Analysis, architecture recommendation or article was produced.
