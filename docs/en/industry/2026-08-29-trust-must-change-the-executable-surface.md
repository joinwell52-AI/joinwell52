---
title: "Trust Must Change the Executable Surface"
date: '2026-08-29'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "工作区信任如何从状态标签变成可执行的能力准入边界？"
summary: "A merged Gemini CLI change makes workspace trust executable: restrictive signals win, unresolved trust becomes false, malformed trust configuration fails, and the effective configuration is narrowed before capability materialization. It demonstrates admission filtering, not live revocation of existing capabilities."
sources:
  - research/analysis/Q-20260829-02-trust-admission-coupled-to-effective-capability-surface.md
item_id: "Q-20260829-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-29-trust-must-change-the-executable-surface-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-29-trust-must-change-the-executable-surface-cover.png"
  kicker="Industry Architecture · Daily Research"
  title="Trust Must Change the Executable Surface"
  summary="A merged Gemini CLI change makes workspace trust executable: restrictive signals win, unresolved trust becomes false, malformed trust configuration fails, and the effective configuration is narrowed before capability materialization. It demonstrates admission filtering, not live revocation of existing capabilities."
  version="Q-20260829-02"
  status="Daily Runtime V5 · 2026-08-29"
  languageHref="/zh/industry/2026-08-29-trust-must-change-the-executable-surface"
  languageLabel="中文"
/>

# Trust Must Change the Executable Surface

“Workspace not trusted” is not an authority boundary if it appears only in the interface while tools, policies, and external connections supplied by that workspace are still created. An executable trust decision must change what the system can do before action becomes possible.

A merged Gemini CLI change provides a concrete mechanism. Restrictive trust signals take precedence. Unresolved trust becomes false. Malformed trust configuration fails instead of silently falling back. When the workspace is untrusted, demonstrated workspace-controlled settings are removed from the effective configuration.

The central proposition is: **workspace trust becomes enforceable only when it is coupled to capability admission. Negative or unresolved trust should reduce the executable surface before materialization; revoking capabilities that already exist is a separate lifecycle responsibility.**

## From Status Label to Admission Transform

The important architectural move is not changing a trust field from true to false. It is using that result to compute effective configuration. Unauthorized workspace contributions no longer enter the tool and policy construction path, so configuration presence alone cannot create execution authority.

Order matters. If tools are materialized first and trust is checked later, untrusted text has already become callable objects. A later warning may leave capability instances, connections, and caches alive. Admission should happen before materialization so the rejected contribution never becomes part of the executable surface.

Restrictive precedence also prevents a permissive source from overriding a stricter authority. Trust merging needs rules for who may narrow the surface, not merely a last-write-wins value.

## Unresolved Is Not Temporary Permission

Systems often treat “unknown” as an availability problem and temporarily reuse the last answer. In authority semantics, failure to establish current trust should not preserve a broader surface by default. Mapping unresolved state to untrusted is an explicit fail-closed choice.

Malformed configuration creates the same problem. Falling back to trusted after a parse error would make mistakes permission-expanding. A fatal result reduces availability but preserves the truth of authorization. A product can offer repair or an explicit override, but the override must itself come from independent authority and leave a receipt.

This does not mean an untrusted workspace must remove every capability. Provenance is the right unit: workspace contributions are filtered, while independently authorized user or administrator sources may remain. Preserving source identity allows the runtime to narrow risk without claiming that workspace distrust makes the entire environment unusable.

## Admission Filtering Is Not Live Revocation

Configuration filtering proves that new capabilities will not be materialized from the currently untrusted workspace contribution. It does not prove that previously created objects are gone. External connections may remain open, tool objects may be cached, and background work may continue.

A runtime therefore needs a lifecycle mechanism as well. Capability instances can be bound to the trust generation that admitted them. When trust changes from true to false, reconciliation should locate old-generation objects, deny new calls, and revoke, terminate, or explicitly hand off each capability according to its type. If safe revocation is impossible, the terminal result should expose residual capability instead of merely updating a Boolean.

Observation capabilities deserve separate analysis. Telemetry may not perform an external action, yet it can disclose paths, prompts, or identifiers. Its admission policy should follow data flow and authorization provenance rather than being copied mechanically from action tools.

## Evidence Boundary

The evidence is one merged implementation and its maintainer tests. It supports the demonstrated trust merge, fail-closed behavior, and filtering of named workspace-controlled settings. It does not prove coverage of every capability source or that a trusted workspace is safe.

Nor does it establish universal live revocation. The precise claim is that the mechanism reduces the demonstrated effective capability surface before materialization. Claiming that active capabilities are revoked requires separate lifecycle evidence.

## Governance Implications

Engineering acceptance should inspect more than the trust result. It should verify the derived effective configuration, the capabilities actually materialized, the trust generation attached to each instance, and reconciliation after trust changes. **Trust has governance meaning only when it changes the executable surface; admission and revocation must be proved separately.**

**Primary evidence:** [merged Gemini CLI commit 0bd1d439](https://github.com/google-gemini/gemini-cli/commit/0bd1d439751478771c45d3d0895a6a9760554bf4). The implementation supports a bounded admission-filtering conclusion, not universal live revocation.
