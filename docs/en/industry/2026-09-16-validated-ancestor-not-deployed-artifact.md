---
title: "A Validated Ancestor Does Not Validate the Deployed Artifact"
date: '2026-09-16'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "部署流程对已验证模型执行可能改变行为的转换后，安全证据应归属于已验证祖先、转换配方，还是最终真正运行的精确制品？"
summary: "Controlled adversarial evidence shows that a benign full-precision checkpoint can exhibit targeted behavior after selected quantization. Lineage proves origin, not current behavior; deployment admission must bind the exact transformed artifact and its validation."
sources:
  - research/analysis/Q-20260916-02-transformed-artifact-is-a-new-evidence-subject.md
item_id: "Q-20260916-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-16-validated-ancestor-not-deployed-artifact-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-16-validated-ancestor-not-deployed-artifact-cover.png"
  kicker="Industry Architecture · Daily Research"
  title="A Validated Ancestor Does Not Validate the Deployed Artifact"
  summary="Controlled adversarial evidence shows that a benign full-precision checkpoint can exhibit targeted behavior after selected quantization. Lineage proves origin, not current behavior; deployment admission must bind the exact transformed artifact and its validation."
  version="Q-20260916-02"
  status="Daily Runtime V5 · 2026-09-16"
  languageHref="/zh/industry/2026-09-16-validated-ancestor-not-deployed-artifact"
  languageLabel="中文"
/>

# A Validated Ancestor Does Not Validate the Deployed Artifact

A model checkpoint passes safety tests and is approved. Before deployment, the platform quantizes, converts, or compiles it to reduce cost. The system that reaches production is a new set of bytes, yet the admission record still points to the upstream model name. Lineage remains intact while the evidence subject may have changed.

The issue is not that every transformation is harmful. The issue is whether a transformation can alter behavior relevant to admission. When it can, the output becomes a new evidence subject. Knowing where it came from cannot substitute for testing what it does in its deployed form.

## Before and After Can Be Different Behavioral Subjects

The same-date Research Object examines AgentQ and its quantization-triggered function-action backdoor experiments. In the paper's main constructed setting, every reported full-precision checkpoint has attack success rate zero for the tested backdoor behavior. After selected codebook quantization, the worst-codebook attack success rate exceeds 0.76 in every main-table model/task cell, and 12 of 18 cells exceed 0.90.

This is not a prevalence estimate for ordinary quantization. The researchers deliberately design structured perturbations that remain benign at full precision and produce trigger-action behavior after specific quantization and codebook transformations. The result establishes possibility and mechanism: two artifacts in the same lineage can have materially different observed behavior.

Ancestor safety evidence therefore cannot simply be copied to the descendant. Even perfect traceability of source, build, and parentage does not make the final executable the same behavioral evidence subject.

## Lineage Answers Origin; Validation Answers Behavior

Cryptographic provenance can answer which checkpoint, inputs, and build chain produced an artifact. It is indispensable for supply-chain security, accountability, and reproducibility.

It does not answer what the resulting bytes did under the tested conditions. Post-transform validation asks whether behavior, safety, utility, and structured outputs still meet admission criteria. These evidence types complement one another but are not interchangeable.

Treating lineage as behavioral equivalence creates an inheritance error: the ancestor passed, therefore the descendant passes. The opposite shortcut is also weak. Testing only the output while losing ancestor and transform identity makes failures hard to reproduce, explain, or roll back.

## Five Identities Belong in One Evidence Chain

A governed deployment contract should preserve at least five distinct identities.

- **Ancestor identity:** exact checkpoint hash, origin, version, and pre-transform validation.
- **Transform identity:** transform type, tool and version, parameters, codebook, environment, and inputs.
- **Output artifact identity:** hash of the actual executable bytes, format, target runtime, and parent references.
- **Post-transform validation identity:** behavioral, safety, utility, and structural checks run against that exact output.
- **Deployment admission identity:** admitted output hash, policy version, target, scope, and invalidation conditions.

A transform label such as “4-bit quantization” is not sufficient. It omits implementation, version, codebook, and parameters. A model alias is also insufficient because it may later resolve to different bytes. The deployment target should ultimately resolve to an immutable, admitted artifact hash.

## Validation Must Face the Bytes That Will Run

Validation pipelines are often strongest before transformation. The upstream checkpoint receives extensive evaluation, then compression, compilation, and packaging happen closer to deployment with progressively lighter checks. If these steps can alter relevant behavior, the test order is reversed.

A stronger sequence first materializes the final artifact and then runs risk-appropriate tests against the exact output. The record should include artifact hash, validator and policy versions, test environment, results, limits, and unresolved findings. That evidence package—not the ancestor's reputation—supports admission.

When the bytes, behavior-relevant parameters, or target environment change, the prior admission should expire or enter an explicit equivalence decision. An unchanged human-readable name must not keep old evidence active.

## Not Every Transform Needs the Same Retest Depth

The adversarial construction does not justify a universal rule that every quantization requires a complete evaluation campaign. The study covers bounded models, sizes, triggers, actions, and quantization settings. It does not show that routine NF4, FP4, or INT8 conversion spontaneously creates the same vulnerability.

Testing cost can be managed by risk tiers. Byte-preserving or formally equivalent transforms may use equivalence evidence accepted by versioned policy. Low-impact changes may use sampled regression. Transforms that affect tool calls, structured actions, or safety boundaries need deeper output-specific validation.

The crucial property is auditability: who proved equivalence, which admission criteria the proof covers, which policy version accepts it, and which changes invalidate it.

## A Minimal Control from Validation to Deployment

A practical chain can work as follows:

1. Bind the ancestor hash and its existing evidence.
2. Record exact transform tool, version, parameters, and environment.
3. Materialize the output and calculate its immutable hash.
4. Run risk-tiered post-transform tests against that hash.
5. Preserve results, limits, and unresolved findings in a separate validation record.
6. Let admission reference only the exact output hash and policy version.
7. Attest at deployment that the executed bytes are the admitted bytes.
8. Treat later transforms or byte changes as invalidation, equivalence review, or retest triggers.

Rollback becomes clearer as well. Evidence about a rejected descendant remains; the previously admitted ancestor state is not rewritten. The deployment target simply resolves back to an artifact whose admission remains valid.

## Boundaries and Open Questions

AgentQ is a deliberately constructed backdoor study, not a survey of normal quantization pipelines. Worst-codebook results are selected inside the study's threat model and cannot support a claim that every quantized artifact is dangerous. The strongest transferable evidence is that a transform can change the evidence subject—not that quantization is inherently unsafe.

Open questions include which transform properties automatically create a new evidence subject, the minimum post-transform test set for tool-using models, how evidence composes across chained transformations, whether runtime attestation can prove exact admitted bytes are executing, and when deterministic equivalence can replace behavioral testing.

The bounded conclusion is: **when a transformation can change behavior relevant to safety or business admission, its output becomes a new evidence subject. Lineage proves ancestry; deployment authorization must bind the exact artifact that will run.**

**Evidence and source:**

- [AgentQ and quantization-triggered function-action backdoor research](https://arxiv.org/abs/2609.14060), 2026.
