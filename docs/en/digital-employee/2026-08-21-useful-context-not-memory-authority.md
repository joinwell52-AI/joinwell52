---
title: "Useful Context Is Not Memory Authority"
date: '2026-08-21'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "When useful tool output arrives without a local execution binding, how should a digital employee separate provenance evidence, immediate usability and authority to persist or reuse that content as memory?"
summary: "A standalone tool result can remain visible and useful without being authorized to shape durable agent memory. A same-day Codex change makes this separation concrete and exposes why provenance, utility and reuse authority need different records."
sources:
  - research/analysis/Q-20260821-01-provenance-memory-authority-separation.md
item_id: "Q-20260821-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-21-useful-context-not-memory-authority-cover-v2.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-21-useful-context-not-memory-authority-cover-v2.png"
  kicker="Digital Employee · Daily Research"
  title="Useful Context Is Not Memory Authority"
  summary="A standalone tool result can remain visible and useful without being authorized to shape durable agent memory. A same-day Codex change makes this separation concrete and exposes why provenance, utility and reuse authority need different records."
  version="Q-20260821-01"
  status="Daily Runtime V5 · 2026-08-21"
  languageHref="/zh/digital-employee/2026-08-21-useful-context-not-memory-authority"
  languageLabel="中文"
/>

# Useful Context Is Not Memory Authority

A tool result appears in an agent thread with a name, useful content and no matching local call. The runtime has at least three decisions to make. It can preserve the artifact as evidence. It can let a bounded consumer use it now. And it can decide whether the artifact may shape durable memory later. Those decisions are easy to collapse into one word—trusted—but they do not grant the same authority.

A Codex change merged on 2026-08-21 makes the distinction unusually visible. It classifies a standalone `FunctionCallOutput` without `call_id` as possible external context. When `memories.disable_on_external_context` is enabled, demonstrated injection and fork-history paths can durably mark the thread memory mode `polluted`. Yet transcript builders keep the tool's namespace and name when available, and recent-image selection may still use images from standalone or unpaired tool output.

This is not contradictory behavior. It is evidence for a more precise rule: **provenance evidence, immediate content utility and durable memory-reuse authority are separate governance decisions.**

## One artifact, three decisions

The missing `call_id` matters because it removes the normal structural link between a result and a tool invocation recorded in the same thread. That is a provenance signal, but it is not cryptographic identity. It does not establish who supplied the content, whether the source name is authentic or whether the content is malicious.

The artifact may still be useful. A transcript can retain it so an auditor sees what influenced the interaction. A visual consumer may need the included image for an immediate edit. Neither use requires the runtime to grant the artifact indefinite behavioral influence through persistent memory.

Memory reuse is the third decision. It changes what future sessions or behaviors may inherit, often far beyond the task that first received the content. The relevant question is therefore not only “Can this content help now?” but “Which consumer may reuse it, for what purpose, under what provenance standard and for how long?”

## Protection does not require erasing evidence

The merged mechanism preserves the external content while changing the eligibility of one memory subsystem. Under the configured policy, detection triggers a durable `polluted` state. At the same time, Guardian and general transcript paths stop dropping standalone named tool output. For non-text bodies, the text transcript records that content existed through a placeholder rather than pretending it was ordinary prose.

That separation matters operationally. Deleting every unpaired result would reduce one reuse path, but it would also destroy potentially legitimate evidence and weaken incident reconstruction. Treating every visible result as ordinary memory would preserve convenience while allowing structurally external material to acquire durable influence without a local execution binding.

Failing closed on memory while retaining attributable evidence avoids both mistakes. The runtime can say: this artifact was present; this is the source label it carried; this consumer used it for this bounded task; durable memory did not inherit it under the current policy.

## Authority should be scoped to consumer and purpose

A single thread-level flag is a useful conservative default, but it becomes too coarse when a runtime has multiple stores and consumers. Transcript generation, short-lived task context, image editing, retrieval indexes and behavioral memory have different effects. A decision appropriate for one does not automatically authorize another.

A stronger record would keep four facts separate:

- the provenance evidence available for the artifact, including missing execution bindings;
- the immediate consumer and task for which the content was used;
- the policy decision governing persistence or later retrieval;
- the lifecycle transition that clears, supersedes or requalifies the restriction.

This model also keeps the policy auditable. A future consumer cannot silently treat “present in history” as permission to reuse. A later source-authentication step can improve provenance without automatically authorizing every purpose. Requalification becomes an explicit transition supported by new evidence, not a side effect of time passing or content being copied.

## Polluted is not authenticated

The public evidence comes from one merged implementation and its regression tests. It demonstrates named injection and fork paths; it does not prove equivalent handling for every resumed-history path or every future memory consumer. The `polluted` state is evidence that a policy transition occurred. It is not proof that the external source was authenticated, that every downstream consumer honors the state or that the system has end-to-end contamination resistance.

The image behavior makes this boundary concrete. Recent-image selection can use images from unpaired output even when text-memory policy treats the context differently. That may be correct for a bounded edit, but it also means non-text consumers need explicit policy and integrity records of their own.

The unresolved work is therefore not to find a better synonym for trusted. It is to define which consumers must consult eligibility, how artifact-level provenance survives non-text placeholders, what evidence can requalify content and how clearing a durable restriction is audited. Useful context can remain useful. The engineering obligation is to stop usefulness from silently becoming memory authority.

**Primary evidence:** [OpenAI Codex merged commit aead844f](https://github.com/openai/codex/commit/aead844f64e911f89e556485e3f47d757431c3b1). The public code and tests support the bounded implementation behavior described here; they do not independently validate universal memory safety or source authenticity.
