# Q-20260823-02 — Durable Thread-Source Provenance Across Create, Fork and Resume

- Runtime date: 2026-08-23 (Asia/Shanghai)
- Queue signal: SIG-20260823-001
- Primary source: https://github.com/openai/codex/commit/a73485dc76e5b2d31d28109a57f6876f4e1dcc24
- Evidence level: `merged_maintainer_change`
- Scope: OpenAI Codex `exec` thread-source classification, persisted thread metadata, fork behavior and TypeScript SDK forwarding

## Problem

A caller may need to record why a Codex thread exists — for example ordinary user work versus a feature-specific automated flow — and keep that origin classification stable through the thread lifecycle. If resume accepts a new source flag and overwrites persisted provenance, the same durable thread can appear to have a different origin merely because a later client supplied different options.

## Facts

The change adds a global `codex exec --thread-source <SOURCE>` option. When omitted, exec converts the absent value to `ThreadSource::User`.

The protocol `ThreadSource` type is serialized as a string and contains `User`, `Subagent`, `Feature(String)` and `MemoryConsolidation`. Its parser maps the reserved strings `user`, `subagent`, and `memory_consolidation` to the corresponding variants; any other string is retained as `Feature(other)`. Thus feature classifications are open-ended strings rather than a closed enum of product features.

For a newly created thread, `thread_start_params_from_config()` now receives the selected `ThreadSource` and sends it as `ThreadStartParams.thread_source`. For a fork, the exec path sets `ThreadForkParams.thread_source` to the selected source instead of always forcing `User`.

The integration test verifies persisted rollout metadata: a source thread started with `source_feature` records `payload.thread_source == "source_feature"`; a fork created with `fork_feature` records its own `payload.thread_source == "fork_feature"` together with `forked_from_id` and `history_base.thread_id` referring to the source thread.

Resume is intentionally different. The TypeScript SDK's `CodexExec` adds `--thread-source` only when `threadSource` is defined and there is no `threadId`. A regression test supplies `threadId: "thread-id"` together with `threadSource: "should_not_override"`; the SDK therefore does not forward the source flag for that resume operation. The commit description states that the classification applies when a thread is first created and does not override the source when resuming an existing thread.

The TypeScript SDK exposes `threadSource?: string` on thread options, propagates it from `Thread.run()` to the exec wrapper, and verifies that a newly started thread forwards `--thread-source automated_review`. The test also observes `thread_source` in turn metadata after the new thread is started.

## Vendor Claims

The maintainer description says callers can classify new threads, the classification persists into metadata, fork can select a source for the new forked thread, and resume preserves the existing source. The changed code and tests directly support these scoped statements.

## Mechanisms

1. **Explicit origin input:** CLI and SDK callers can supply a thread-source classification for creation paths.
2. **Deterministic default:** absent input becomes `ThreadSource::User` for a new exec thread.
3. **Open feature namespace:** reserved protocol values map to dedicated variants, while arbitrary other strings become `Feature(String)` and serialize back as their feature string.
4. **Creation persistence:** thread start parameters carry the source into persisted thread/session metadata.
5. **Fork reclassification of the new object:** a fork is a new thread and can receive its own source classification while separately retaining `forked_from_id` / history-base provenance to the parent thread.
6. **Resume non-overwrite:** resume addresses an existing thread id; the TypeScript exec wrapper suppresses `--thread-source` whenever `threadId` is present, so a caller option cannot rewrite the existing thread's source through that path.

## Evidence

Primary evidence is merged maintainer commit `a73485dc76e5b2d31d28109a57f6876f4e1dcc24` in `openai/codex`.

The Rust exec changes cover CLI parsing, start parameters and fork parameters. Tests verify default `user`, a custom `Feature("automated_review")`, persisted source metadata for an original thread, and a distinct persisted source for a fork.

The TypeScript SDK changes add `threadSource?: string`, forward it on new-thread execution, and explicitly guard forwarding with `!args.threadId`. A resume-oriented regression passes a deliberately conflicting `threadSource: "should_not_override"`, demonstrating the intended non-overwrite boundary at the SDK-to-CLI handoff.

The protocol definition at the selected commit confirms the wire classification model: `User`, `Subagent`, `Feature(String)`, and `MemoryConsolidation`, with arbitrary non-reserved strings parsed as `Feature`.

## Limitations

`ThreadSource` is classification metadata, not authenticated identity. A caller that is allowed to create a new thread can choose an arbitrary feature string; the change does not prove that the caller is genuinely the feature it names.

The TypeScript non-overwrite rule is enforced by not forwarding `--thread-source` on SDK resume. The selected change does not establish that every possible lower-level app-server client is forbidden from attempting a source mutation through some other API surface.

Fork deliberately allows a new source classification for the newly created fork. Therefore provenance has two dimensions that should not be conflated: lineage (`forked_from_id` / history base) and the forked thread's own source classification.

The change does not make thread metadata immutable, cryptographically signed, or authorization-bearing. It should not be used as proof of principal identity or permission.

## Comparisons

Compared with recomputing source from the most recent invocation, persisting source at thread creation preserves durable origin semantics across resumes. Compared with copying the parent source automatically into every fork, allowing the fork caller to classify the new thread separates lineage from the purpose of the newly created execution object.

The design resembles provenance fields in durable job systems: creation-time metadata should survive ordinary continuation, while derivation creates a new object that may have both parent lineage and a new local classification.

## Unresolved Questions

- Which lower-level app-server APIs, if any, can mutate `thread_source` after thread creation, and are such mutations rejected or simply absent from ordinary clients?
- Is source classification surfaced consistently in thread listing, export, analytics and all SDKs, or only the demonstrated exec/TypeScript paths?
- Should arbitrary `Feature(String)` values be namespaced or registered to prevent collisions between unrelated callers?
- How should downstream policy treat disagreement between lineage metadata and a fork's new source classification?

## Reading Conclusion

The selected Codex change establishes a durable **creation-time provenance classification** for exec threads. New threads default to `user` or accept a caller-selected source; forks are new threads and may receive their own source while retaining explicit parent lineage; TypeScript resume deliberately does not forward a new source for an existing thread. This is useful provenance continuity, but it is neither authenticated caller identity nor an authorization primitive.
