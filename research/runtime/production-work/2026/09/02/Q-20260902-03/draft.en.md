---
schema: publication-candidate-article/v2
title: "A Smaller Skill Is Not the Same Skill"
date: '2026-09-02'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "压缩或动态改写后的技能包要继续沿用原能力身份，必须保持哪些不变量？"
summary: "SkillZip Pro reports meaningful token reductions under protected compression and a sharp loss under an aggressive configuration. The engineering lesson is not simply to compress less: progressively loaded skills need version-bound evidence for public entries, routes, resource boundaries and behavior."
cover: staging/publication-candidates/2026-09-02-a-smaller-skill-is-not-the-same-skill-cover.png
sources:
  - research/analysis/Q-20260902-03-skill-compression-routing-contract.md
---

![A Smaller Skill Is Not the Same Skill cover](staging/publication-candidates/2026-09-02-a-smaller-skill-is-not-the-same-skill-cover.png)

# A Smaller Skill Is Not the Same Skill

A compression pass removes repeated instructions and trims references. Every file still appears in the package, the root entry still loads, and the token count drops. Yet one public subskill can no longer be called directly, while a conditional resource now loads through the wrong route. The bundle is smaller, but is it still the same capability?

For a progressively loaded skill, file presence is not enough. The package behaves like a routed graph: root instructions select references, schemas, scripts, assets, and nested subskills only when an execution path needs them. Compression can preserve the visible directory while changing the routes that make it executable.

The primary study *SkillZip Pro* reports encouraging results for protected compression and a warning for aggressive optimization. In its evaluated content-moderation harness, the protected method removes about 38% of bundle tokens and reduces end-to-end per-run tokens by 10.4%, with no reported quality loss. On an evaluated multi-entry bundle it reports near-perfect route and public-entry preservation. An unprotected 71% configuration, however, loses as much as 26 accuracy points through one-sided false positives.

These are author-reported results, not independent validation. Their bounded engineering lesson is still clear: **a compressed skill should retain the old capability identity only after its structural and behavioral contracts are re-established for the emitted version.**

## A Skill Bundle Is a Routed Graph

Flat-prompt optimization asks whether roughly the same instructions remain. Progressive loading asks stronger questions. Can every public entry still be invoked independently? Does each required route resolve to the intended resource? Do private, public, and conditional classifications still hold? Do deduplication assumptions match the target runtime?

A root skill can pass a smoke test while a public subskill fails. A reference can remain in the tree but become unreachable under the conditions that previously selected it. A script can be reached through a new route while receiving different inputs or permissions. Those are contract changes even when a file comparison looks benign.

The skill's identity therefore includes more than prose. It includes callable entries, routing rules, visibility boundaries, environment assumptions, and the version/provenance chain connecting the source bundle to the candidate.

## The Numbers Support a Bounded Claim

The protected results show that meaningful compression and route preservation can coexist in the reported setup. They do not establish a universal safe ratio. About 38% bundle-token reduction and 10.4% per-run reduction describe one evaluated system and harness, not a threshold that every package can adopt.

The aggressive case matters because the damage is asymmetric. A 71% configuration does not merely degrade an average score; the paper reports losses of up to 26 accuracy points through one-sided false positives. An availability check or token metric would miss that failure distribution.

Compression ratio is therefore an optimization metric, not an admission criterion. The relevant question is which contract surfaces were preserved and what evidence supports that claim in this bundle version.

## Structural Preservation Needs Explicit Evidence

A minimum structural contract covers public callable entries, internal route reachability, resource visibility, environment assumptions, and provenance.

Public entries need stable identities and standalone reachability. Required internal paths must resolve to intended resources. Private, public, and conditional material must retain its access and loading boundaries. Removed duplication must truly be supplied by the target environment. The emitted candidate must record its source hash, transformation, candidate hash, audit results, and adoption decision.

Binding evidence to the emitted version is essential. A later Zip-on-Write mutation cannot inherit a previous audit simply because it has the same directory name or descends from the same source. The change produces a new candidate and a new evidence boundary.

## Routing Is Necessary but Not Sufficient

A perfect route audit proves that nodes remain reachable. It does not prove that a reached script has the same semantics, that permission requirements are unchanged, or that external effects remain safe.

Static routing checks and task-level evaluation answer different questions. Structural audits can confirm entries and paths. Behavioral tests can sample outputs, error distributions, and environmental compatibility. Permission and side-effect checks must verify the authority and effect contracts that a skill claims to preserve.

This is why “evaluation-free compression” should not be read as “validation-free adoption.” A compressor may avoid running a full benchmark on every internal edit while the governance process still requires bounded evidence before making a new bundle active.

## Adopt Candidates, Do Not Rewrite Identity in Place

A safer lifecycle treats optimization output as staged candidate material. The system records the immutable source version and transform, audits public entries and routes, runs risk-matched behavioral checks, and then makes an explicit adoption decision.

Rollback targets a prior adopted bundle identity, not a reconstructed approximation. If post-adoption evidence reveals a missed route, asymmetric error, permission drift, or environmental mismatch, the runtime can restore the exact previous artifact and retain the failed candidate for analysis.

Validation depth should match the claim. A documentation-only resource may need structural and rendering checks. A skill that can write data or call external tools needs permission, error, and effect-boundary evidence as well. Token savings never widen what the evidence can authorize.

## The Evidence Boundary Remains Narrow

The paper reports selected bundles and a specific industrial multi-round harness. It does not independently establish complete semantic equivalence, authorization preservation, external-effect safety, immutable provenance, or exactly-once behavior for arbitrary skills and plugins.

Its defensible result is narrower: protected compression can retain important routing surfaces while reducing tokens in the evaluated setup, and aggressive unprotected compression can cause large asymmetric failure. That makes version-bound contract preservation a first-class optimization requirement.

Open questions remain: which route and entry invariants can be verified statically; how much behavioral sampling follows a route-preserving transform; how permissions and side effects should be expressed alongside loading routes; and which evidence should trigger automatic rollback?

**Primary source:** [SkillZip Pro: Execution-Aware Dynamic Compression of Progressively Loaded Skills for Self-Evolving Agents](https://arxiv.org/abs/2608.30785)
