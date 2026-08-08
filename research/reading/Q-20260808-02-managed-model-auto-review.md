# Reading Record — Q-20260808-02 Centrally managed model policy that forces automatic review and permission downgrades

- **Queue item:** `Q-20260808-02`
- **Column:** Industry Architecture
- **Selection status:** Selected
- **Priority:** P0
- **Skill invoked:** `Skill 03 — Deep Reading`
- **Operating date:** 2026-08-08 (Asia/Shanghai)
- **Primary source class:** Merged maintainer implementation, pull request, tests and protocol documentation in `openai/codex`

## Reading scope

This pass reads merged Codex commit `208f05b23387c47d7e52fd2153d59255e945d0b7` / PR #37511 as implementation evidence for a centrally managed automatic-review policy. The bounded question is what the code actually enforces when a model slug is placed under `auto_review.required_on_models`: configuration layering, model matching, initial permission shaping, runtime override rejection, lifecycle persistence, MCP approval routing and test coverage. The pass records mechanisms and evidence without turning them into an enterprise architecture recommendation.

## Deep Reading output

```yaml
reading_notes:
  problem:
    - A centrally managed model policy is ineffective if a local client can start a protected model with permissive approval settings, Full Access, a user reviewer or a disabled automatic-review feature.
    - The same requirement must remain effective when a thread is resumed, forked, changes models, accepts turn-level overrides or reaches MCP approval paths; otherwise a lifecycle transition becomes an escape hatch.
    - Managed requirements can come from several policy layers, so the protected model set needs deterministic merge and matching semantics that cannot be bypassed by provider aliases or accidental substring matches.

  facts:
    - PR #37511 was merged and its merge commit is `208f05b23387c47d7e52fd2153d59255e945d0b7` with title `Enforce automatic review for managed models`.
    - The change adds a managed `auto_review.required_on_models` surface to requirements data and exposes it through the app-server `configRequirements/read` API as `autoReview.requiredOnModels`.
    - Requirement layers merge protected model slugs by union rather than allowing a lower layer to erase a slug contributed by another layer. Source provenance becomes composite when more than one layer contributes.
    - The runtime representation converts the configured list into a `BTreeSet`, rejects empty or whitespace-padded slugs, and rejects slugs that contain a provider namespace separator `/`.
    - Model protection checks support either the bare model slug or one supported provider alias of the form `namespace/slug`, where the namespace is restricted to ASCII alphanumeric characters, underscore or hyphen and the suffix cannot contain another slash.
    - Exact matching is used after alias normalization. Tests explicitly show `protected-model` and `provider_1/protected-model` match, while `protected-model-preview`, `protected-modelish`, malformed namespaces and nested provider paths do not.
    - For a protected model, the acceptable runtime condition is approval policy `on-request`, approvals reviewer `auto_review`, no full-disk-write sandbox access, and Guardian automatic review enabled.
    - A protected thread started with incompatible startup values is shaped into the protected settings rather than honoring unsafe startup values: approval policy becomes `on-request`, reviewer becomes `auto_review`, and Danger Full Access is downgraded to workspace-write.
    - If automatic review is disabled while a protected model is required, thread start is rejected rather than silently falling back to user review.
    - Runtime thread-settings changes that try to set an unsafe approval policy, user reviewer or Full Access on a protected thread are rejected.
    - Turn-level overrides that try to replace the protected reviewer with `user` are rejected.
    - Switching an existing thread to a protected model injects `on-request` and `auto_review` when those values are not explicitly overridden; the resulting configuration is then validated against the managed requirement.
    - The implementation includes a `trusted_guardian_reviewer` escape condition for an in-memory Guardian reviewer identity. The source comment says this reviewer identity is trusted only when established during an in-memory spawn.
    - Legacy threads created before the requirement is present are upgraded when they are resumed or forked under the new managed requirement. Tests create a legacy thread with `Never` + `User`, then apply the requirement and verify resume/fork returns the protected settings.
    - MCP approval routing now receives the current model slug. If that model is protected, `mcp_approvals_reviewer_from_layers` returns `AutoReview` before connector-specific reviewer choice is considered.
    - Guardian MCP elicitation checks the model-aware reviewer decision, so the protected-model requirement extends into MCP approval flows rather than being limited to ordinary thread settings.
    - The app-server README documents the managed requirement and states that listed models start with `on-request` and `auto_review`, Full Access is downgraded to workspace-write, and incompatible runtime overrides or disabled Guardian review are rejected.
    - The PR adds dedicated app-server tests for thread start, unsafe thread/turn settings, legacy resume/fork upgrades, automatic-review-disabled behavior and requirements API projection.

  mechanisms:
    - Policy distribution enters through managed `requirements.toml` / MDM requirement layers; each layer can contribute protected model slugs, and the final protected set is a union with source provenance retained.
    - A model-identity matcher canonicalizes one allowed provider alias to the bare slug and then performs exact membership lookup, deliberately avoiding prefix or substring matching.
    - Session validation is centralized in `validate_auto_review_requirement`: unless the session is a trusted in-memory Guardian reviewer, a protected model is legal only when approval policy, reviewer, sandbox and feature state satisfy all four conditions.
    - Initial thread creation performs policy shaping for the protected model. In contrast, incompatible runtime mutation attempts are rejected, preventing an already-protected thread from being relaxed after start.
    - Model changes are treated as a policy boundary. When a thread moves from an unprotected model to a protected one and the caller did not specify conflicting approval/reviewer values, the protected defaults are injected and then validated.
    - Resume and fork paths re-evaluate requirements, allowing old persisted settings to be upgraded under current managed policy rather than preserving an unsafe historical configuration indefinitely.
    - MCP reviewer resolution short-circuits to automatic review when the active model is protected, so connector-local preferences cannot override the centrally managed model requirement.
    - `configRequirements/read` makes the effective protected-model requirement observable to clients, separating managed policy discovery from hidden server behavior.

  evidence:
    - The merged PR body enumerates the intended policy surfaces: layered protected slugs, `configRequirements/read`, forced on-request/auto-review settings, Full Access downgrade, incompatible override rejection, disabled-review rejection and preservation across thread/MCP/TUI lifecycle operations.
    - `config_requirements.rs` implements union across requirement layers, validates slugs, stores them as a set and defines exact provider-alias matching with explicit unit tests.
    - `session/session.rs` implements the protected-state predicate and runs it after session settings updates; it also injects protected approval/reviewer settings on a model transition.
    - `connectors.rs` makes MCP reviewer choice model-aware and gives the protected-model requirement precedence over connector-specific reviewer configuration.
    - `session/mcp.rs` threads the active model slug into both Guardian MCP review checks and general MCP reviewer selection.
    - `model_auto_review.rs` exercises thread start, Full Access downgrade, unsafe updates, turn overrides, disabled Guardian review, legacy thread fork/resume and global reviewer requirements.
    - The app-server README exposes the same requirement and behavior as a supported managed configuration surface rather than leaving it implicit in code.

  limitations:
    - This is merged implementation and test evidence from the Codex repository, not a production telemetry study. It establishes intended and tested code paths, not organization-wide incident rates or real-world bypass frequency.
    - The protected-model list is based on model slugs. The code supports one constrained provider alias form but rejects nested or unusual namespace shapes; environments with different model naming conventions would need compatible normalization before this matcher applies.
    - The feature depends on Guardian automatic review being available and enabled. When it is disabled, protected-model use is rejected rather than supported through another reviewer type.
    - Automatic review is itself a model-driven reviewer. The source does not establish that its decisions are always correct; the mechanism governs which reviewer has authority and what permissions are available, not the semantic quality of every review verdict.
    - The start-time behavior is partly coercive and partly rejecting: unsafe startup values are normalized/downgraded, while later incompatible overrides are errors. Clients therefore need to distinguish policy-shaped startup state from rejected mutation state.
    - The visible evidence does not prove every external integration path outside the changed Codex components enforces the same policy. The PR names TUI attachment and MCP paths, but third-party wrappers that bypass these APIs are outside this change's evidence boundary.
    - `trusted_guardian_reviewer` intentionally bypasses the ordinary protected-session validation for an in-memory Guardian reviewer identity. The code comment constrains the trust origin, but this Reading pass does not independently prove that all ways of setting that flag are unforgeable.
    - Requirement changes on already-running sessions are primarily demonstrated through resume/fork/model/settings paths. The evidence does not establish a live asynchronous revocation mechanism that instantly mutates every active session the moment an administrator changes policy.

  comparisons:
    - Managed model policy differs from a client preference: clients can observe the requirement but cannot legally relax it through ordinary startup or runtime overrides.
    - Start-time Full Access downgrade differs from merely asking for more approvals; the policy simultaneously controls reviewer identity, approval cadence and filesystem write authority.
    - Protected model matching is exact after narrow alias normalization, unlike broad prefix matching that could accidentally protect or fail to protect related model names.
    - Legacy lifecycle handling differs from “grandfathering”: resume and fork are used as revalidation points that upgrade old settings under current policy.
    - MCP reviewer routing gives centrally managed model policy higher precedence than connector-specific reviewer configuration, illustrating an explicit policy-order rule rather than ad hoc conflict resolution.

  contradictions:
    - The PR description says listed models “always” use the protected review settings, but the implementation deliberately exempts an in-memory trusted Guardian reviewer. The source comments make this an intentional internal trust exception rather than an accidental bypass.
    - Startup can silently coerce unsafe caller choices into protected values, while later attempts to make equivalent unsafe changes are rejected. Both enforce the policy, but clients observing only error behavior at runtime could incorrectly assume startup would also fail instead of being normalized.
    - The policy is described as model-specific, yet reviewer enforcement extends into connector/MCP paths whose local configuration may name another reviewer. The implementation resolves this conflict by giving protected-model policy precedence, not by composing both reviewer choices.

  unresolved_questions:
    - How are policy changes propagated to sessions that remain continuously active without resume, fork, model change or settings mutation?
    - What audit event records that an unsafe startup request was downgraded from Full Access to workspace-write, and can an administrator distinguish coercion from an originally safe client request?
    - What formal trust boundary guarantees that `trusted_guardian_reviewer` can only be created by the intended in-memory Guardian spawn path?
    - How are review-service outages handled for protected models: fail closed indefinitely, retry, or provide an administrator-controlled emergency path?
    - Does `configRequirements/read` expose enough source provenance for a client to explain which requirement layer contributed each protected slug when several layers are unioned?
    - What evaluation exists for automatic-review false approvals/false denials under the lower-permission protected-session regime?
```

## Source traceability

1. Merged commit: `https://github.com/openai/codex/commit/208f05b23387c47d7e52fd2153d59255e945d0b7`
2. Pull request #37511: `https://github.com/openai/codex/pull/37511`
3. Requirement loading/matching implementation: `codex-rs/config/src/config_requirements.rs` in PR #37511
4. Protected session validation: `codex-rs/core/src/session/session.rs` in PR #37511
5. Model-aware MCP reviewer routing: `codex-rs/core/src/connectors.rs` and `codex-rs/core/src/session/mcp.rs` in PR #37511
6. App-server lifecycle tests: `codex-rs/app-server/tests/suite/v2/model_auto_review.rs` in PR #37511
7. App-server managed-requirements documentation: `codex-rs/app-server/README.md` in PR #37511
8. Today's Research Plan: `research/runtime/plans/2026/08/2026-08-08-plan.json`
9. Skill 03: `research/skills/03-deep-reading.md`

## Reading gate decision

**Result:** Deep Reading completed from the merged implementation, tests and protocol documentation. The Reading Result records policy-layer union, exact model matching, protected startup shaping, runtime rejection, Full Access downgrade, resume/fork upgrading, MCP reviewer precedence, observable requirements and the intentional trusted-Guardian exception. It does not infer production reliability or recommend an enterprise control-plane design. No Research Analysis or article was produced.
