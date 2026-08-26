---
title: "Permission Authority Belongs to the Attachment"
date: '2026-08-26'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "Where should authoritative permission and connected-tool state live when multiple app/runtime contexts coexist?"
summary: "A merged Codex change binds MCP permission profiles to enabled servers and blocks call preparation when attachment authority is unresolved. The architecture narrows authority ownership and refresh scope without proving distributed revocation or universal race freedom."
sources:
  - research/analysis/Q-20260826-02-attachment-owned-permission-authority.md
item_id: "Q-20260826-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-26-permission-authority-belongs-to-attachment-cover-v2.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-26-permission-authority-belongs-to-attachment-cover-v2.png"
  kicker="Industry Architecture · Daily Research"
  title="Permission Authority Belongs to the Attachment"
  summary="A merged Codex change binds MCP permission profiles to enabled servers and blocks call preparation when attachment authority is unresolved. The architecture narrows authority ownership and refresh scope without proving distributed revocation or universal race freedom."
  version="Q-20260826-02"
  status="Daily Runtime V5 · 2026-08-26"
  languageHref="/zh/industry/2026-08-26-permission-authority-belongs-to-attachment"
  languageLabel="中文"
/>

# Permission Authority Belongs to the Attachment

An MCP server can be visible in more than one runtime context without those contexts sharing the same permission authority. Treating server identity as if it implied one ambient authorization profile creates two symmetric failures: a call can inherit power its attachment owner never granted, or a refresh in one context can erase valid authority held by another.

A Codex maintainer change merged on 2026-08-25 makes the ownership boundary explicit. Runtime publication now records a `PermissionProfile` per enabled MCP server. If a server's attachment authority cannot be resolved, the configuration contains no profile for it and call preparation returns no prepared call. Downstream approval, elicitation and sandbox-sensitive behavior reads the server-specific profile rather than assuming a thread-wide one.

The architectural proposition is: **shared resource identity is not shared permission authority.** Authority should be owned by the attachment/runtime lifecycle it governs, and absence of that authority should be a rejection condition rather than an invitation to fall back to a broader scope.

## Ambient execution context is not a safe authority source

A thread-wide sandbox profile is convenient because it is already present where a call is made. Convenience does not establish ownership. An MCP server may have been enabled through an executor environment or app attachment whose permission boundary differs from the active thread.

Falling back to thread authority collapses two questions: “where is this call executing?” and “who authorized this server to expose these tools?” They coincide in simple systems, but attachment-based platforms must represent them separately.

The per-server map answers the second question at runtime-publication time. Authority is resolved against enabled servers and their attachment/environment context. Missing resolution produces no entry. That omission is semantically important: it prevents an unresolved server from inheriting an ambient profile merely because a call path needs a value.

## Preparation captures a lifecycle-specific authority snapshot

The call-preparation boundary converts published configuration into an executable invariant. A call is prepared only if the target server has a profile. Once prepared, it reads authority from the captured immutable runtime configuration.

This gives refresh behavior a clearer meaning. A newly published runtime may contain changed server profiles, while a call prepared from the previous snapshot can retain the authority it captured. That is lifecycle consistency, not instantaneous distributed revocation. If immediate revocation of in-flight or already-prepared work is required, the platform needs an additional lease, epoch or cancellation mechanism.

The same distinction appears in threadless operations. Discovery and resource reads that run without an active thread receive an explicit default profile instead of accidentally borrowing active-thread execution power. Explicit defaulting is easier to review than ambient inheritance, though the selected change does not prove the default is appropriate for every future threadless operation.

## Scope ownership makes refresh blast radius auditable

Permission state needs an owner, lifetime and replacement rule. A refresh should state which attachment snapshot it replaces and which prepared operations remain bound to an earlier version. Telemetry should record the server identity, authority owner, profile version and decision point so a later approval or rejection can be explained.

Shared facts and scoped authority should also remain distinct. Two sessions may refer to the same server endpoint while carrying different permissions. Normalizing resource identity must not force mutable authorization state into a singleton.

This design can introduce duplication, and truly global policy still exists. But global policy should be modeled as explicit higher-scope authority, not emerge accidentally from a shared mutable object that happens to be easy to access.

## A narrower owner is not a complete authorization proof

The merged code and tests establish a concrete MCP runtime boundary: per-server published profiles, preparation-time refusal when authority is absent, and server-owned permission use in demonstrated downstream paths. They do not prove that the upstream attachment resolver always chooses the correct policy, that every capability follows the same model, or that profile changes are consistent across processes.

Nor does this establish universal race freedom or exactly-once authorization updates. Revocation of an already-prepared call remains a separate contract. The defensible claim is narrower and useful: attaching authority to the lifecycle scope that owns the server reduces accidental widening and unrelated authority loss during demonstrated refresh behavior.

The remaining work is to make versioning, revocation and audit semantics as explicit as the ownership boundary itself.

**Primary evidence:** [Codex merged commit 4213b38f](https://github.com/openai/codex/commit/4213b38f3c555049bf6f494065698a3dfe587c16). The implementation and regressions support the bounded MCP attachment-authority claim; they are not independent proof of distributed authorization correctness.
