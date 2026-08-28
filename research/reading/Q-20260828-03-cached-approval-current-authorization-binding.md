# Q-20260828-03 — Cached Approval Evidence Bound to Current Authorization

- Runtime date: 2026-08-28 (Asia/Shanghai)
- Queue signal: SIG-20260828-017
- Primary source: https://github.com/openai/codex/commit/035295b46ee4a5962d0e01a66a888d5bf5da4de4
- Evidence level: `merged_maintainer_change`
- Scope: OpenAI Codex Guardian v2 cached risk scores, local/root authorization versions, low-risk fast approval and authorization-change invalidation

## Problem

A low-risk classifier result can be cached and reused to avoid repeated approval review. That optimization becomes unsafe if authorization changes after classification: a later user restriction, root-thread restriction, history rewrite or host-produced answer may revoke or narrow what the earlier score evaluated. If the cache key contains only the action/risk result, old approval evidence can outlive the authority state that justified it.

## Facts

The merged Codex change adds `GuardianAuthorizationVersion`, representing authorization-sensitive conversation state with a history rewrite version, count of genuine user messages and count of successful host-produced user-input responses. Guardian v2 captures both the current worker-thread authorization version and, when the worker has a root conversation, the root thread's authorization version.

A successful classifier score is associated with a `ScoreAuthorization` containing `local` and optional `root` authorization versions. Guardian's fast approval path obtains the authorization state again immediately before using a low-risk cached score. If the stored authorization identity does not exactly match the current identity, the score is marked stale, the fast decision is deferred with reason `authorization_changed`, and the cached low-risk score cannot directly approve the action.

The comparison is in addition to existing staleness checks. Guardian still rejects fast approval if the scored tool-call index lags too far behind the current tool call or if a later classification failure occurred. Authorization binding therefore closes a different failure mode: a score may be temporally recent and low risk but still invalid because the authority context changed.

The root identity is read through an atomic root snapshot that couples bounded root conversation evidence with its authorization version. The local version is read from the current thread. For a worker, cache validity therefore depends on both the worker's own authorization state and the current root authorization state when one exists.

The integration suite adds cases for a new genuine user turn, a root restriction, a root user restriction, root/user input answers, an empty user-input case, and a root restriction that arrives while classification is still in flight. The late-root-restriction case deliberately keeps the first classifier pending, changes only root authorization, then allows the old classification to complete; the old low score cannot be used to skip a new review.

The test matrix also distinguishes an empty answer that preserves cache validity from authorization-changing answers. This shows the cache is not simply invalidated on every event; it is rebound to the defined authorization version, so only changes represented in that identity invalidate the score.

## Vendor Claims

The maintainer summarizes the change as binding cached Guardian classifications to current local and root authorization state so stale scores cannot approve actions, with regression coverage for authorization changes. The changed authorization object, fast-decision equality check and new integration cases directly support that bounded claim.

## Mechanisms

1. **Versioned local authority:** the worker thread exposes an authorization version derived from history rewrite generation, genuine user-message count and host-produced user-input response count.
2. **Versioned root authority:** workers also capture the root conversation's authorization version when a root snapshot exists.
3. **Score-time binding:** successful classifier publication records the local/root authorization identity that was evaluated.
4. **Use-time revalidation:** the fast approval path recomputes current authorization before consuming a low-risk score.
5. **Exact identity match:** a score can fast-approve only when stored and current authorization identities match exactly.
6. **Fail-safe fallback:** mismatch becomes `StrictReviewReason::StaleScore` and defers approval rather than converting uncertainty into permission.
7. **Concurrent-revocation protection:** tests cover root authorization changing while a classifier is still in flight, preventing a late low score from being published as current approval evidence.
8. **Scoped invalidation:** an event that does not change the represented authorization version can preserve the cache; the mechanism is identity-based rather than unconditional cache flushing.

## Evidence

Primary evidence is merged OpenAI Codex maintainer commit `035295b46ee4a5962d0e01a66a888d5bf5da4de4`. The central files are `codex-rs/core/src/codex_thread.rs`, `codex-rs/ext/guardian-v2/src/async_scorer/authorization.rs`, `extension.rs`, and Guardian v2 integration tests.

`codex_thread.rs` defines `GuardianAuthorizationVersion` and the root snapshot boundary. `authorization.rs` creates the score authorization tuple from current local and root state. `extension.rs` stores authorization metadata alongside scoring progress and, before low-risk fast approval, compares the cached authorization against a fresh current authorization; mismatch records `authorization_changed` and returns no automatic approval. The integration tests exercise multiple local/root authorization changes and a late root revocation during classification.

The selected commit also contains unrelated sandbox and MCP error-preservation changes. Those are not used as evidence for this Reading conclusion.

## Limitations

The authorization identity is deliberately structural and bounded. It captures the demonstrated history generation and user/user-input counters; it is not a cryptographic digest of every message, policy object, tool configuration, filesystem state or external authorization source.

Exact equality proves only that the represented authorization version has not changed. If an authorization-relevant input is not reflected in `GuardianAuthorizationVersion`, this specific cache guard alone cannot detect it.

The mechanism prevents a stale low-risk score from fast-approving after the demonstrated authorization changes. It does not prove that the classifier itself is correct, that a synchronous fallback review will always make the right decision, or that downstream tools have no independent authorization bugs.

Root authorization is optional because not every thread has a root snapshot. The evidence does not establish a distributed principal-binding protocol across separate hosts or services.

The selected change does not make cached evidence immutable for audit. It binds cache usability to current runtime authorization identity; long-term evidence retention, signing and externally replayable proof are separate concerns.

## Comparisons

A time-to-live cache asks whether a score is recent enough. A tool-call-lag cache asks whether it is close enough to the current action sequence. Neither answers whether the user/root authority still matches the context originally classified. The changed model adds an authorization dimension to cache validity.

Blindly clearing every score on every event would be safer but unnecessarily expensive and could erase valid evidence after non-authority-changing events. Version binding instead makes cache reuse conditional on an explicit authorization identity, preserving reuse only when the represented authority remains the same.

## Unresolved Questions

- Which future authorization inputs must be added to `GuardianAuthorizationVersion` as Guardian's authority model expands?
- Are policy/configuration changes outside conversation history represented elsewhere in cache validity or do they require additional version components?
- Is the score-time authorization metadata durably recorded for audit, or only kept in live extension state?
- How does authorization versioning interact with thread resume, fork, rollback and cross-process recovery beyond the demonstrated integration cases?
- Could root authorization change repeatedly while multiple classifier requests are in flight, and how are out-of-order completions serialized against score publication?
- Should cached approval evidence carry a signed or hashed authority receipt for externally replayable verification?

## Reading Conclusion

The Codex change turns cached Guardian low-risk evidence from a merely recent score into authority-bound evidence. A score is reusable for fast approval only if the worker's local authorization version and, where present, the root authorization version still match the state captured for that score. User/root authorization changes—including a revocation that races an in-flight classifier—make the old score stale and force review rather than permission. This closes the demonstrated stale-approval path without claiming that the version tuple represents every possible authorization input or that Guardian decisions are universally correct.
