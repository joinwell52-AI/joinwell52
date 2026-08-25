---
title: "A Checkpoint Is Not Permission to Resume"
date: '2026-08-25'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "When a resumable agent cannot know whether a durable Session append committed before an interruption, what state must be resolved before the runtime is allowed to continue model execution?"
summary: "A merged OpenAI Agents Python change turns an uncertain Session append into durable recovery state. Resume authority waits for authoritative-history reconciliation; the pattern prevents blind replay in one Session boundary but does not create distributed exactly-once semantics."
sources:
  - research/analysis/Q-20260825-02-uncertain-persistence-gates-resume.md
item_id: "Q-20260825-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-25-checkpoint-not-permission-to-resume-cover-v2.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-25-checkpoint-not-permission-to-resume-cover-v2.png"
  kicker="Industry Architecture · Daily Research"
  title="A Checkpoint Is Not Permission to Resume"
  summary="A merged OpenAI Agents Python change turns an uncertain Session append into durable recovery state. Resume authority waits for authoritative-history reconciliation; the pattern prevents blind replay in one Session boundary but does not create distributed exactly-once semantics."
  version="Q-20260825-02"
  status="Daily Runtime V5 · 2026-08-25"
  languageHref="/zh/industry/2026-08-25-checkpoint-not-permission-to-resume"
  languageLabel="中文"
/>

# A Checkpoint Is Not Permission to Resume

A Session append returns an error. The backend may have rejected it, or it may have committed the items and lost the acknowledgement. Retrying assumes non-commit and can duplicate history. Skipping assumes commit and can lose history. Both choices convert missing evidence into a guess.

An OpenAI Agents Python change merged on 2026-08-25 gives that uncertainty a durable identity. It stores a pending Session write in `RunState`, rereads authoritative Session history on resume, and classifies the observed state before allowing the next model call. Already committed means do not replay; unchanged means append; anything else is ambiguous and fails closed.

The architectural conclusion is stronger than “retry carefully” but narrower than exactly-once execution: **a checkpoint can restore process state without restoring continuation authority.** Authority to continue should wait until the runtime resolves the uncertain durable boundary on which future reasoning depends.

## Resumability preserves state, not certainty

Checkpointing answers whether a process can be reconstructed. It does not automatically answer whether the last durable effect completed. A transport exception is an epistemic event: the caller knows the acknowledgement failed, not what storage ultimately contains.

If that uncertainty disappears when the process stops, the resumed runtime has no principled choice. It may append the same items again or continue from an incomplete history. The selected change persists the unresolved intent itself: Session identity, item batch, the known pre-write history fingerprint and persisted-item count.

This makes uncertainty part of the state machine. `Running`, `Paused` and `Resumed` are not enough. A runtime also needs an “unresolved durable effect” state that withholds permission for higher-level work.

## Reconciliation is the gate before new reasoning

On both streaming and non-streaming resume paths, the implementation reconciles the pending write before the next model call. That order is essential. New reasoning must not consume a history whose last boundary is still disputed.

The algorithm rereads authoritative Session history and compares stable item fingerprints. If the observed tail equals the recorded pre-write history followed by the pending items, the append already committed and replay is unnecessary. If the history remains equal to the pre-write state, the append is still absent and may be performed. If neither comparison holds, the state is ambiguous.

Failing closed on ambiguity can reject a legitimate concurrent extension. That is a real availability cost. But without a revision token, compare-and-swap or governed merge rule, automatic acceptance would invent knowledge the runtime does not have. The error preserves the conflict for explicit repair instead of silently changing history.

This three-way classification is what separates reconciliation from generic retry. It asks authoritative storage which represented world exists before execution proceeds.

## Recovery evidence and execution progress are different records

A robust control plane should persist at least three related but distinct facts: the intended durable effect, the storage evidence used to classify it, and the higher-level execution position. A checkpoint that stores only the third fact invites unsafe continuation.

The recovery record should also bind identity tightly. Logical Session ID may be insufficient if a restored runtime can point to a different backend implementation or namespace. Backend identity, serialization version and the exact fingerprint scheme determine what equality means.

Operators need the decision trail: pending intent observed, authoritative history reread, classification reached, and continuation authority granted or withheld. This record explains why a model call did or did not resume without exposing the full conversation payload.

Multiple restored workers require another layer. The selected implementation has an in-process guard, but no distributed compare-and-swap. A lease, revision token or CAS-backed append is necessary if independent copies can reconcile the same Session concurrently.

## Session reconciliation does not make external effects transactional

Exact Session fingerprints prove equality only for the serialized representation being compared. They do not prove that a tool call, payment, message or deployment represented by a Session item committed exactly once. External-effect identity and receipts require their own reconciliation boundary.

Nor does the implementation establish distributed exactly-once Session persistence. It demonstrates a bounded rule for one pending append against one authoritative history: preserve intent, reread, classify, and stop on ambiguity before new model execution.

The open design questions follow directly. Should Session backends expose revision or CAS tokens? How should legitimate concurrent extension differ from corruption? Which backend identity belongs in pending-write state? What external-effect evidence is required before a recovered item can authorize continuation?

**Primary evidence:** [OpenAI Agents Python merged commit 40f0d9fc](https://github.com/openai/openai-agents-python/commit/40f0d9fccbe03bf704e4ef044c7c81b807e594da). The implementation supports bounded Session-write reconciliation, not distributed exactly-once execution or transactional external effects.
