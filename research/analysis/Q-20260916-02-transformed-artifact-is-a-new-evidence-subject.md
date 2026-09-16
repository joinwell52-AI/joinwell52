---
date: "2026-09-16"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260916-02
column: industry-architecture
article_type: technical-analysis
project_relevance: none
source_reading: "research/reading/Q-20260916-02-post-transform-deployed-artifact-safety.md"
---

# Research Analysis — A Behavior-changing Transform Creates a New Evidence Subject

## Research question

When deployment transforms a validated model artifact in a way that can change behavior, which identity should own safety evidence: the validated ancestor, the transform recipe, or the exact executable artifact that will actually run?

## Research themes and subject kind

- Research themes: deployed-artifact identity; post-transform validation; quantization; provenance; admission; behavior-changing transformation; evidence binding.
- Subject kinds: `research-finding`, `architecture-mechanism`, `governance-problem`, `failure-mode`.
- Primary sample: AgentQ and its quantization-triggered Function-action Backdoor experiments.

The research subject is not whether quantization is unsafe in general. It is whether **a behavior-relevant transformation can invalidate the evidentiary identity of an upstream artifact even when lineage remains intact**.

## Evidence identities

### E1 — source-reported pre-transform result

**Identity:** `source-reported-claim`.

**Claim:** In the paper's main constructed experiments, every reported full-precision checkpoint has attack success rate 0 for the tested backdoor behavior before quantization.

**Strength:** direct bounded evidence for the tested ancestor checkpoints. **Independent:** false.

### E2 — source-reported post-transform result

**Identity:** `source-reported-claim`.

**Claim:** After selected codebook quantization, every main-table Model/Task cell has a reported worst-codebook quantized attack success rate above 0.76, and 12 of 18 cells exceed 0.90.

**Strength:** direct evidence that, under the deliberate construction in this study, post-transform behavior can diverge sharply from the validated full-precision ancestor. **Independent:** false.

### E3 — source-reported mechanism

**Identity:** `public-fact`.

**Claim:** The attack uses structured perturbations designed to remain benign at full precision while producing trigger-action behavior after specific quantization/codebook transformations.

**Strength:** mechanism evidence for an adversarially constructed case. It does not show that ordinary quantization spontaneously creates malicious behavior. **Independent:** false.

### E4 — source limitation

**Identity:** `public-fact`.

**Claim:** The study covers specific model families, sizes, trigger/action surfaces and quantization settings under a deliberate attack construction; it does not establish equivalent risk for every transform, quantizer or benign deployment pipeline.

**Strength:** explicit transfer boundary. **Independent:** false.

### E5 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** When a transformation is capable of changing behavior relevant to admission criteria, the output must become a new evidence subject. Lineage to a previously validated ancestor is provenance, not inherited behavioral authorization.

**Strength:** architectural synthesis from E1–E4. **Independent:** false.

### E6 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** The deployment admission record should bind the ancestor identity, exact transform configuration/version, output artifact hash, post-transform validation evidence and final admission decision. Any later transform or byte change invalidates that admission binding unless the policy explicitly proves equivalence.

**Strength:** governance recommendation, not a standard established by AgentQ. **Independent:** false.

### E7 — open question

**Identity:** `open-question`.

**Claim:** The evidence does not establish a universal catalog of transforms that require revalidation, what tests are sufficient for benign production systems, or when equivalence proofs can safely replace full post-transform testing.

## Failure / Finding / Mechanism / Implication

### Failures

1. **Ancestor-evidence inheritance:** a deployed artifact is considered safe solely because it descends from a validated checkpoint.
2. **Transform invisibility:** quantization, compilation, optimization, conversion or packaging occurs without becoming part of the durable provenance chain.
3. **Recipe-only identity:** the system records a transform name but not the exact configuration, tool/version or output bytes.
4. **Pre-transform-only testing:** all behavior/safety tests run before the behavior-relevant transform.
5. **Admission/hash split:** admission refers to a model name or ancestor commit rather than the exact executable artifact hash.
6. **Post-admission mutation:** the executable changes after validation while the previous admission record remains active.
7. **Lineage-as-equivalence:** cryptographic provenance proves ancestry and is misread as proof of behavioral equivalence.

### Findings

The key result is a controlled identity mismatch. The paper's constructed checkpoints are benign under the tested full-precision condition, yet selected post-transform artifacts express the targeted behavior at high rates. The same logical “model lineage” therefore contains evidence subjects with materially different observed behavior.

This advances the more general cross-surface provenance problem. Earlier evidence showed that an effect or representation on one surface cannot automatically stand in for another. Today's experiment isolates a sharper deployment case: **even when provenance is perfect, validation can still be attached to the wrong executable identity**.

The bounded conclusion is not “quantization is malicious.” The attack is deliberately engineered. What the evidence demonstrates is that a transform can be behavior-relevant enough that ancestor validation and output validation are not interchangeable.

### Mechanism

A deployable-artifact contract can preserve five linked but distinct identities.

**Ancestor identity**

- exact checkpoint/content hash;
- source/training/version provenance;
- pre-transform validation evidence.

**Transform identity**

- transform type;
- implementation/tool version;
- exact parameters/codebook/configuration;
- deterministic inputs and environment where relevant.

**Output artifact identity**

- exact bytes/hash of the executable artifact;
- target runtime/format;
- creation time and parent/transform references.

**Post-transform validation identity**

- tests executed against the exact output artifact;
- behavioral, safety, utility and structured-output checks as applicable;
- limits and unresolved findings.

**Deployment admission identity**

- exact admitted output hash;
- validator/policy version;
- decision and scope;
- deployment target/environment;
- expiry or invalidation conditions.

The decisive rule is simple: if policy-relevant behavior may change across a transformation, evidence must be bound to the output that will run. Provenance from the ancestor remains necessary for traceability, but it does not substitute for output-specific evidence.

### Implication

Agent and model deployment pipelines should treat selected transformations as **evidence-subject boundaries**. A transformation need not create a new conceptual product name, but it can create a new object for safety and admission purposes.

This principle extends beyond quantization only as an engineering hypothesis: compilation, graph rewriting, distillation, adapter fusion, prompt packaging, tool-schema generation or policy compilation may also deserve output-specific validation when they can alter relevant behavior. The current evidence directly demonstrates the need only for the studied class of behavior-changing quantization attack; broader application should be based on each transform's capability and risk.

## Comparison and contradictions

A common provenance model says: if the output can be traced cryptographically to an approved ancestor and approved build recipe, then the deployment is governed. That is valuable supply-chain evidence, but today's result shows why it may still be behaviorally incomplete. Provenance answers “where did these bytes come from?”; post-transform validation answers “what did these bytes do under the tested conditions?”

The opposite overreaction is also unsupported: every byte-preserving or proven-equivalent transformation does not necessarily need a full new evaluation campaign. A policy may accept deterministic equivalence evidence for some transforms. What must remain explicit is who proves equivalence and which admission criteria that proof covers.

The study's adversarial construction is a strong counterweight to broad claims about benign deployment prevalence. It establishes possibility and mechanism under tested conditions, not base rate.

## Bounded research judgment

**When a deployment transformation can change behavior relevant to safety or business admission, its output should be treated as a new evidence subject. The active deployment decision must bind the exact output artifact hash to the exact transform identity and post-transform validation evidence; ancestry to a previously validated checkpoint provides provenance but does not automatically carry behavioral authorization forward.**

This judgment is strongest for transforms known or suspected to alter execution-relevant behavior. The evidence does not justify assuming every quantized artifact is unsafe or requiring identical test depth for every transformation.

## General implications

- separate lineage identity from executable-artifact identity;
- record exact transform implementations and parameters, not just transform names;
- bind validation evidence to the bytes that will run;
- invalidate admission when admitted bytes or behavior-relevant transform parameters change;
- preserve pre-transform evidence as ancestry evidence rather than copying it onto descendants;
- allow equivalence shortcuts only when a versioned policy explicitly accepts the proof;
- make deployment targets resolve to an admitted artifact hash rather than a mutable alias;
- audit post-transform validation coverage separately from supply-chain provenance completeness.

## Limitations and counterarguments

AgentQ is an adversarially constructed backdoor study, not a prevalence study of normal quantization pipelines. The model families, quantizers and trigger/action surfaces are bounded, and the reported worst-codebook values are chosen within the study's attack setting. The results do not show that routine NF4, FP4 or INT8 conversion creates equivalent vulnerabilities absent the constructed checkpoint.

Post-transform testing has cost and latency. Some organizations may reasonably rely on equivalence proofs, sampled regression suites or risk-tiered admission for low-impact changes. The governance requirement is not maximal retesting; it is explicit evidence binding to the actual executable identity and an auditable reason when ancestor evidence is considered sufficient.

## Open questions

1. Which transform properties should automatically create a new evidence subject?
2. Can deterministic equivalence proofs safely cover some behavioral admission criteria?
3. How should mutable deployment aliases resolve to immutable admitted artifact hashes?
4. What minimum post-transform test set is required for tool-calling or agentic models?
5. How should chained transforms compose evidence and invalidate earlier admissions?
6. Can runtime attestation prove that the executed bytes are exactly the admitted bytes?
7. How should rollback preserve both the rejected descendant evidence and the previously admitted ancestor state?

## Editorial recommendation

- **Article type:** technical-analysis
- **Selected modules:** research-question; before-after-transform-evidence; deployed-artifact-identity; transform-provenance; post-transform-validation; admission-binding; adversarial-scope-boundary; limitations; open-questions
- **Core proposition:** a behavior-changing transform creates a new evidence subject; lineage proves ancestry, while deployment authorization must bind evidence to the exact executable artifact
- **Project relevance:** none
