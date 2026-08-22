---
title: "Visible Is Not Durable"
date: '2026-08-20'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "What should an artifact version mean operationally when visibility, writer ownership and durable storage are separate state transitions?"
summary: "A version can become atomically visible to readers without proving crash durability. A same-day Google ADK change demonstrates a compact publication protocol and the value of separating reservation, completeness, visibility and persistence."
sources:
  - research/analysis/Q-20260820-03-visibility-durability-separation.md
item_id: "Q-20260820-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-20-visible-is-not-durable-cover-v2.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-20-visible-is-not-durable-cover-v2.png"
  kicker="Open-source Engineering · Daily Research"
  title="Visible Is Not Durable"
  summary="A version can become atomically visible to readers without proving crash durability. A same-day Google ADK change demonstrates a compact publication protocol and the value of separating reservation, completeness, visibility and persistence."
  version="Q-20260820-03"
  status="Daily Runtime V5 · 2026-08-20"
  languageHref="/zh/engineering/2026-08-20-visible-is-not-durable"
  languageLabel="中文"
/>

# Visible Is Not Durable

An artifact can be complete and visible to every normal reader while still lacking evidence that it will survive a crash. Systems that record both events as `Published` erase a distinction that matters for recovery, audit and correctness.

A Google ADK change merged on 2026-08-20 demonstrates the boundary in a local filesystem artifact service. A writer first reserves a hidden `.{version}.pending` directory. It stages payload and metadata there, rechecks the destination, then uses one `os.replace` operation to expose the complete tree under the integer version name. Ordinary version discovery ignores pending directories. The maintainers also state the limit directly: without `fsync` for files and parent directories, the protocol does not establish full power-loss durability.

The implementation supports a four-part lifecycle model: **reservation, staged completeness, reader visibility and durable persistence are separate facts. Atomic rename can establish process-level visibility under stated filesystem assumptions; it is not a durability certificate.**

## Incomplete state should not inhabit the reader namespace

Creating the final version directory before content is complete makes reservation look like publication. Readers can discover a version while its payload or metadata is still missing. An in-process lock may serialize threads, but it does not make incomplete state structurally invisible, and it may not coordinate independent processes.

The hidden pending namespace changes the meaning of discovery. A pending directory proves that a writer has reserved identity, not that a version is ready for consumption. Normal enumeration accepts only integer-version names, so incomplete work cannot accidentally satisfy the reader's definition of a published artifact.

Only after payload and metadata form a complete staged representation does the final rename cross the visibility boundary. The namespace itself carries lifecycle meaning: hidden is being prepared; integer-named is authorized for readers.

## Ownership and publication need different synchronization points

Concurrent writers create a second problem. Both may read the same latest version and propose the same successor. The ADK implementation uses filesystem directory creation as the reservation arbiter. In the demonstrated local fault domain, that signal is visible to competing processes, unlike a mutex owned by one process.

Before publication, the writer rechecks whether the final destination now exists. That prevents a writer acting on a stale version list from replacing a version another writer has already published. Reservation ownership and reader visibility are therefore not one atomic event; they are connected by a staged protocol.

The same conservative rule explains version gaps. A crashed writer may leave a pending reservation. Another process cannot safely infer that the owner is dead merely because progress is slow. Reusing that number risks colliding with live work, so the system may leave a permanent gap. Contiguous numbering is aesthetically tidy; ownership safety is the stronger invariant.

## Rename establishes visibility—not persistence

Under appropriate filesystem assumptions, renaming a complete directory makes the reader-observable transition atomic: consumers see the old namespace or the complete new version, not an intended half-state. That is a meaningful guarantee.

It is still narrower than crash durability. Durability concerns whether payload bytes, metadata and directory entries have reached persistence in the required order and will survive power loss or storage-controller failure. Rename success alone does not answer those questions. The source explicitly does not `fsync` the relevant files and parent directories.

This boundary should appear in APIs and evidence, not only documentation. `Published` may mean reader-visible. `DurabilityVerified` should require a separate acknowledgement backed by the chosen storage protocol. A low-value recoverable cache may reasonably stop at visibility; a critical checkpoint may require stronger synchronization. The engineering choice can vary, but the claim should not.

## Recovery needs ownership evidence

Automatic cleanup of pending state is tempting, particularly when gaps accumulate. Yet deletion or reuse is an authority decision: the reconciler needs evidence that the prior owner is stale. Time alone may be insufficient if a live writer can legitimately be slow.

Safe reclamation therefore needs an additional contract—lease expiry, owner heartbeat, process identity, external coordination or another proof appropriate to the fault domain. Without it, preserving the ambiguous reservation is conservative behavior rather than a defect.

The current evidence covers one `FileArtifactService`, its tests and its filesystem assumptions. It does not establish equivalent rename semantics everywhere, distributed transactions, multi-artifact atomicity or crash consistency. Those limits sharpen the reusable lesson rather than weaken it: artifact schemas should say which transition has occurred and which evidence supports it.

When reviewing an artifact system, the decisive question is not simply “Was the publish call successful?” Ask instead: Who owns the version? Is its staged representation complete? Has it crossed the reader-visibility boundary? What proves durable persistence? Who is authorized to reclaim abandoned state? A single success flag cannot answer all five. A governed lifecycle can.

**Primary evidence:** [Google ADK Python merged commit 94475c9a](https://github.com/google/adk-python/commit/94475c9a76c7c71246d6f5e4b083b3c3ee6869c0). The public implementation and tests establish a bounded process-level visibility protocol; they explicitly do not establish fsync-backed crash durability.
