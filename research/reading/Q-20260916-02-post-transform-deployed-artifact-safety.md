# Q-20260916-02 — Safety Evidence Must Bind to the Post-Transformation Deployed Artifact

- Runtime date: 2026-09-16 (Asia/Shanghai)
- Queue signal: SIG-20260916-005
- Primary research source: https://arxiv.org/abs/2609.14060
- Evidence level: `primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

When an Agent model is transformed between audit and deployment, what evidence is required to establish that the artifact actually executing in production still has the behavior that was tested upstream?

## Source-complete Reading Scope

The primary source is *AgentQ: Quantization-Conditioned Backdoor Attacks on LLM Agents*. The reading covered the validation–deployment threat model, quantization-equivalence construction, layer-banded LoRA injection, partial-PGD repair, evaluated model families and scales, three trigger-to-action pairs, NF4/FP4/INT8 deployment codebooks, attack and utility metrics, main results, structured-output ablations, indirect tool-observation activation, deployment case study, detection surface and stated limitations.

The paper studies a malicious-model-publisher threat. It does not establish that normal quantization is generally malicious, that every quantizer is vulnerable to the same construction, or that every deployment pipeline will exhibit the attack.

## The Validation–Deployment Gap

The core boundary is artifact identity. A victim may audit a full-precision checkpoint and later deploy a quantized derivative. AgentQ constructs a checkpoint whose full-precision behavior passes the tested benign-behavior audit, while the targeted quantized representations exhibit attacker-chosen behavior.

This means “the source checkpoint passed” is not equivalent to “the deployed artifact passed” when a transformation can change behavior. The safety claim is attached to the wrong object if the audit identity stops at the upstream weights while production actually executes a transformed representation.

The study therefore provides evidence for a general governance question: when compilation, quantization, conversion, optimization or another transformation creates the executable artifact, admission evidence should identify and test that final artifact rather than rely only on a logically related ancestor.

## Threat Model

The adversary is assumed to control fine-tuning of an open-weight agent and publish the resulting full-precision checkpoint. A victim or reviewer audits that checkpoint for benign behavior and then quantizes it for deployment. The attack objective is that the published full-precision artifact appears clean under the tested trigger conditions, while the quantized deployment emits a targeted malicious action.

This is a stronger and more specific threat than ordinary post-training accuracy drift: the behavior is intentionally conditioned on the representation transformation.

The evaluation covers Qwen3.5-{2B, 4B, 9B} and Hammer2.1-{1.5B, 3B, 7B}, two model families with different tool-calling formats. The targeted bitsandbytes codebooks are NF4, FP4 and INT8 as exposed through HuggingFace Transformers.

## Three Trigger-to-Action Surfaces

The paper evaluates three concrete agentic payloads.

1. **Tool selection** — a fixed trigger phrase should cause invocation of a designated sink tool, `diagnostic_trace_submit`, rather than the correct tool.
2. **Argument injection** — a parameterized trigger containing an identifier should cause `CANARY_<id>` to appear inside an argument of an otherwise correct tool call. Evaluation identifiers are disjoint from training identifiers, requiring copy-from-prompt behavior rather than simple memorization.
3. **AgentDojo advertisement injection** — platform-name triggers are mapped to a recommendation favoring the corresponding platform in the final assistant output across Expedia and United variants.

The paper later demonstrates an agent-specific extension in which a trigger can arrive through a tool observation rather than directly from the user. In the reported Qwen3.5-9B experiment, that indirect activation fires 30/30 under the targeted quantized configuration while remaining 0/30 on the clean observation and 0/30 in FP16.

A banking case further shows a payload that copies a live value observed only after a prior tool call into an outbound transaction action. This matters because agent loops create post-prompt state that a one-shot free-text backdoor cannot access.

## Attack Construction

AgentQ combines three elements.

### Layer-banded low-rank injection

The malicious behavior is inserted through LoRA updates restricted to a shallow/front-middle layer band rather than full-rank adaptation over the entire network. The paper argues and empirically ablates that this restricted update surface better preserves structured tool-calling utility.

### Multi-codebook targeting

The injected checkpoint is constructed to remain viable across the targeted NF4, FP4 and INT8 quantization mappings rather than depending on one specific codebook.

### Partial PGD within quantization-equivalence classes

After injection, full-precision parameters are repaired toward benign utility while constrained to remain within the intersection of quantization-equivalence classes for the targeted codebooks. Under that constraint, the quantized weights remain fixed while the undeployed full-precision representation is pulled toward benign behavior.

This creates the intended divergence: the upstream full-precision checkpoint can appear clean under the tested behavior, while the targeted quantized artifact retains the malicious mapping.

## Audit and Main Results

Every constructed checkpoint in the reported main table has full-precision attack success rate `ASR_FP16 = 0` on every evaluated task. The paper therefore demonstrates its intended audit/deployment mismatch under the defined trigger grid.

Across the 18 model/task cells, every worst-codebook post-quantization ASR exceeds 0.76 and 12 of 18 exceed 0.90. Argument injection is the most consistently strong target in the reported study. The codebook producing the strongest activation varies across NF4, FP4 and INT8 rather than one quantizer dominating every cell.

The source also measures normal utility rather than treating a syntactically broken agent as a successful attack. Metrics include tool-selection accuracy, exact tool-call match and AgentDojo end-to-end task accuracy. A direct port of prior quantization-conditioned attack machinery can produce high attack activation but collapses structured-output utility; AgentQ's constrained construction is introduced to preserve useful tool behavior while retaining the conditional payload.

## Why Structured-output Utility Matters

For an agent, a malicious string is not sufficient if the runtime parser rejects the tool call. The study's direct-port baseline reaches high quantized ASR but substantially damages structured-output competence. AgentQ's layer-banded design improves the joint condition that the agent remains deployable and the targeted action remains executable.

This distinction is important for governance. A safety test that watches only model-level output distributions can miss the actual Effect boundary: the relevant question is whether the transformed artifact can emit a valid action that the downstream runtime will accept and dispatch.

## Off-trigger and Trigger-robustness Evidence

In the reported appendix evaluation across all six models and three codebooks, tool-selection false-positive rate is zero in every tested cell; argument-injection false-positive rate is at most 0.13, with a mean around 0.09. This supports the claim that the attack need not simply cause indiscriminate tool corruption under normal traffic.

The source also perturbs trigger case, punctuation, position and paraphrase in one Hammer2.1/NF4 setting. Activation remains relatively robust across several perturbations and degrades more under full carrier-sentence paraphrase. This is useful characterization evidence, not proof of universal semantic triggering.

## Detection Surface

The authors explicitly do not propose a defense. They report that schema-constrained decoding can suppress the tool-selection payload but not the argument-injection payload in their tests, and that retry does not neutralize the tested attacks. Weight-statistic inspection also fails to cleanly expose the construction because the attack is designed around quantization cells.

The paper therefore identifies behavioral differential testing as the relevant surface: evaluate the same checkpoint under full precision and each intended deployment quantization, then search for behavioral divergence.

For a governed deployment pipeline, the broader implication is that transformation-aware revalidation should occur before admission. It is not enough to record that a parent artifact was tested if the child artifact has not been behaviorally evaluated under its actual runtime representation.

## Deployment Case Study

A case study serves one 9B checkpoint behind two FastAPI endpoints that differ in runtime quantization configuration. The source reports clean behavior at FP16 and targeted activation at NF4 while the on-disk source weights are byte-identical.

This is strong evidence for the identity distinction: the same stored checkpoint can lead to different executing behavioral artifacts depending on runtime transformation configuration. The executable identity therefore needs more than a source-file hash; it also needs the transformation configuration and resulting runtime representation or an equivalent reproducible binding.

## Artifact-bound Evidence Model

The research supports separating at least these identities:

1. **Source checkpoint identity** — the upstream weights that were distributed or audited.
2. **Transformation identity** — quantizer, codebook, parameters, software path and configuration used to produce the deployable form.
3. **Deployed artifact identity** — the exact representation that will execute.
4. **Post-transformation behavioral evidence** — tests run against that executable identity.
5. **Runtime action authority** — whether the deployed agent may actually dispatch a particular tool effect.

The first four address whether the tested behavior belongs to the thing being deployed. They do not themselves grant item 5. A model that passes post-quantization behavioral tests still requires normal authorization, target binding, effect controls and runtime governance.

## Limits and Negative Evidence

The authors identify several important boundaries.

- The primary construction targets bitsandbytes NF4, FP4 and INT8. GPTQ, AWQ, SmoothQuant and GGUF-style formats have different quantization geometry and are not covered by the same main proof surface.
- A small AWQ experiment retains attack activation in the tested setting, while the reported GPTQ repair does not; this is evidence against assuming uniform transfer across quantizers.
- Evaluation covers two open-weight families up to 9B parameters, not 30B–70B models or closed-weight systems.
- The preferred layer-band boundary is calibrated on the 4B backbone and may not transfer unchanged to deeper architectures.
- No mitigation is proposed. The deterministic detector measures a known trigger after the fact and is not a general unknown-trigger defense.
- The deployment-realism case study uses one 9B checkpoint and a synthetic four-tool registry; a large enterprise tool catalog is not evaluated.
- Poisoned checkpoints are part of a malicious publisher threat model. The study should not be reframed as evidence that benign quantization normally creates malicious behavior.

## Evidence Classes

### Fact

The study evaluates two model families across multiple scales, three bitsandbytes codebooks and three trigger-to-action surfaces. Every reported main-table constructed checkpoint has zero measured full-precision ASR on the tested attacks before deployment quantization.

### Research Result

Post-quantization attack activation is high in the evaluated cells while full-precision audit behavior remains clean under the tested trigger grid. The strongest codebook varies by model/task cell, and the deployment case demonstrates behavior divergence under different serving quantization configurations.

### Inference

Safety and admission evidence should bind to the exact deployable/executing artifact and transformation provenance. A source checkpoint's audit cannot automatically be inherited by a transformed artifact whose behavior has not been revalidated.

### Unknown

The paper does not establish universal vulnerability across quantizers, model scales or deployment stacks; it does not provide a general mitigation; and it does not prove that ordinary quantization introduces malicious behavior absent an adversarially prepared checkpoint.

## Comparison With Ordinary Deployment Validation

A conventional model-release pipeline may identify a model by repository version or source-weight hash, run upstream evaluation and then allow downstream optimization to be treated as implementation detail. AgentQ gives a concrete counterexample to that inheritance assumption under adversarial preparation.

The bounded transferable lesson is not “ban quantization.” It is to make transformations part of artifact identity and require evidence freshness after behaviorally meaningful transformation. The validation object should follow the executable artifact across the delivery chain.

## Unresolved Questions

1. Which transformations beyond quantization should invalidate inherited behavioral evidence by default?
2. What canonical artifact identity should bind source weights, transformation software, codebook/configuration and executable runtime representation?
3. How should deployment admission detect that a supposedly tested artifact was rebuilt or re-quantized after approval?
4. What behavioral differential tests are useful when malicious triggers are unknown?
5. Can post-transform attestation and runtime effect controls jointly reduce risk without requiring exhaustive trigger discovery?
6. How should a governed system distinguish transformation-induced benign regression from adversarial conditional behavior?

## Reading Conclusion

The source-complete evidence supports a bounded conclusion: **behavioral safety evidence attached to an upstream checkpoint does not automatically describe a transformed deployment artifact**. AgentQ demonstrates this gap under an adversarial quantization-conditioned construction across the evaluated model families, trigger-action pairs and bitsandbytes codebooks. The correct governance response is transformation-aware identity and post-transformation revalidation, not a claim that quantization is inherently malicious. Source identity, transformation provenance, deployed artifact identity, behavioral evidence and runtime execution authority should remain separate facts.

This Reading Note performs evidence extraction only. It does not execute Research Analysis, article writing, visualization, Production or Publication.
