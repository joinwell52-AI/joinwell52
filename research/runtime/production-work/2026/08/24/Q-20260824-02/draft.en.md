---
schema: publication-candidate-article/v2
title: "Instruction Lineage Is Not Instruction Authority"
date: '2026-08-24'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "When a subagent inherits parent history but receives child-specific developer instructions, how should the architecture preserve instruction lineage without turning provenance labels into implicit authorization?"
summary: "A merged Codex change gives child-only developer instructions typed provenance and a tested parent/child boundary. That makes context derivation inspectable, but a separate authority plane is still required to establish who may supply or override instructions."
cover: staging/publication-candidates/2026-08-24-instruction-lineage-not-authority-cover.png
sources:
  - research/analysis/Q-20260824-02-instruction-lineage-authority-separation.md
---

![Instruction Lineage Is Not Instruction Authority cover](staging/publication-candidates/2026-08-24-instruction-lineage-not-authority-cover.png)

# Instruction Lineage Is Not Instruction Authority

A child agent can inherit nearly all of a parent conversation and still need one instruction that belongs only to the child. If that instruction becomes ordinary or unclassified text, the system loses its semantic identity. If it appears in the parent request, the boundary leaks. If it appears twice in the child, the effective context changes again.

A Codex change merged on 2026-08-24 adds a dedicated `DeveloperInstructions` contextual fragment with developer role and `generic.developer_instructions` content kind. In the demonstrated full-history fork, the implementation filters inherited developer material, conditionally supplies the child-only fragment and tests three facts together: the parent excludes the child instruction, the child preserves its classification, and the exact text appears once in child developer messages.

This strengthens lineage at one real request boundary. It does not prove that the caller was authorized to create the instruction. **Instruction provenance and instruction authority are different control planes.**

## Typed context preserves semantic identity

Copying text can preserve words while destroying origin. An inherited paragraph, a parent developer rule and a child-local override may look similar after compaction, yet they belong to different derivation paths and scopes.

The new fragment improves that first layer. Developer guidance is no longer annotated with an unknown content kind on this path. Its role and semantic kind remain inspectable by downstream context construction and request-level tests. That makes it possible to ask whether the material was inherited, introduced locally or substituted at the fork boundary.

Typed provenance is especially useful when history is transformed. A fork may preserve reference context while replacing parent-specific instructions. Without an explicit fragment identity, text-oriented rewriting has to infer which words constitute control material. The selected code still contains a TODO for more precise message-fragment provenance, so the mechanism should be understood as a partial improvement rather than a complete provenance graph.

## The fork must preserve both exclusion and representation

A correct child boundary needs two complementary properties. Child-only control must not leak into the parent's request, and it must remain present in the child exactly where intended. Testing only the child could miss parent contamination; testing only parent exclusion could leave the child without its required guidance.

The Codex regression inspects actual request surfaces. It verifies the parent does not contain the configured child-only text, the child carries the dedicated content kind, and the exact text count is one among child developer messages. That is stronger evidence than checking only an intermediate object.

The “once” claim remains local to this request construction. It does not establish deduplication across retries, distributed delivery or replay. The architecture should therefore treat single representation at construction, durable transport identity and replay idempotence as separate guarantees.

## A developer label cannot authorize its own source

Role ordering and provenance solve different problems from permission. A developer-role instruction may legitimately rank above conversational user content in a model request. That fact says what the instruction is and how the model should interpret it. It does not say which principal was permitted to create it, whether an external policy allowed the override or how long that authority remains valid.

A robust design needs an authority record that binds principal, policy source, scope, freshness and any delegation chain. The lineage plane can then say, “this fragment is child-local developer guidance derived at fork X.” The authority plane must separately say, “principal Y was allowed by policy Z to supply this guidance for scope S.”

Collapsing both into the developer label creates privilege drift. A fragment can retain a high-precedence role while moving through fork, compaction or replay, even if the authorization context that originally allowed it no longer applies.

## Lifecycle transitions must declare what happens to control

Fork is only the first transformation. Compaction can summarize away boundaries. Resume can reload older effective context under a changed policy. Replay can deliver the same fragment into a new execution. Each transition should state whether instruction lineage is preserved, transformed or replaced—and whether authority is still valid or must be re-established.

Low-risk, single-process systems may trust the caller that constructs every child. That can be a reasonable simplification, but it is a stated trust assumption, not evidence contained in the provenance label.

The practical audit test has two columns: where did every effective instruction come from, and which principal or policy allowed it to apply here? A system that can answer only the first has lineage. A system that infers the second from a role label has confused provenance with authority.

**Primary evidence:** [OpenAI Codex merged commit a70974c1](https://github.com/openai/codex/commit/a70974c1a0837e17769e3c41f83ad5e592c703fb). The code and request-level regression support the bounded child-instruction behavior described here; they are not independent proof of authenticated authority or end-to-end policy integrity.
