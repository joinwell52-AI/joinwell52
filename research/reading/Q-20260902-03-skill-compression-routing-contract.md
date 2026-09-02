# Q-20260902-03 — Skill Compression Must Preserve Routing Contracts

- Runtime date: 2026-09-02 (Asia/Shanghai)
- Queue signal: SIG-20260902-011
- Primary source: https://arxiv.org/abs/2608.30785
- Evidence level: `peer_reviewed_or_primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

When a progressively loaded Agent skill bundle is compressed or dynamically rewritten, which routing and callable-entry contracts must remain invariant so the optimized bundle can still be treated as the same executable capability?

## Problem and Mechanism

*SkillZip Pro: Execution-Aware Dynamic Compression of Progressively Loaded Skills for Self-Evolving Agents* models production skills as directory bundles whose root is loaded at activation while references, schemas, scripts, assets, and nested subskills are loaded only when an execution path needs them. This makes compression a graph/routing problem, not merely a prompt-shortening problem.

The method compresses across files while attempting to preserve progressive-loading boundaries. It also preserves routing so required files and directly callable entries remain reachable. Entry contracts distinguish private, public, and conditional resources, and a multi-entry audit is used to preserve standalone public subskills. The paper evaluates One-Shot versus Continual/Zip-on-Write evolution and Persistent versus Transient compression modes.

## Findings

On the reported production content-moderation skill, the protected method removes about 38% of skill-bundle tokens and 10.4% of end-to-end per-run tokens with no reported quality loss in that harness. By contrast, an unprotected aggressive 71% compression configuration loses as much as 26 accuracy points through one-sided false positives. The paper also reports near-perfect route/public-entry preservation on a multi-entry bundle under its protected configuration.

The important negative result is that a smaller bundle is not sufficient evidence of semantic equivalence. Aggressive compression can preserve superficial availability while damaging the execution paths or information that downstream routing relies on.

## Contract-Preservation Interpretation

A bounded lifecycle interpretation is that optimization should preserve at least:

- public callable entry identities;
- required route reachability;
- private/public/conditional resource classification relied on by loading;
- declared environment assumptions used to remove duplicate material;
- the bundle/version identity against which routing preservation was evaluated.

For Continual or Zip-on-Write updates, the preservation evidence should attach to the newly emitted bundle version. A previous version's audit cannot silently authorize a later mutation simply because both descended from the same skill.

## Contradictions and Negative Evidence

The paper's aggressive-compression failure is direct evidence against using compression ratio as the principal acceptance metric. It also shows why flattening a progressively loaded skill can destroy boundaries even if all text remains somewhere in the flattened representation.

The reported quality preservation is benchmark- and bundle-specific. Near-perfect route preservation in an evaluated multi-entry bundle does not prove that arbitrary scripts, tools, plugins, side effects, permissions, or runtime environments behave identically after compression.

## Limits

The study evaluates selected skill bundles and a specific industrial multi-round harness. It does not prove complete lifecycle safety, authorization preservation, external-effect equivalence, immutable provenance, or exactly-once execution. Routing reachability is necessary for callable compatibility but is not sufficient evidence that every reached component has unchanged semantics.

The method is described as evaluation-free in its compression procedure, but the research claims about preservation are still established through audits and experimental evaluation. That distinction should be retained: not requiring task-level evaluation during every compression operation does not mean no validation evidence is needed for governance.

## Reading Conclusion

Skill compression should be admitted on contract-preservation evidence, not token reduction alone. The primary study supports preserving route reachability and public entry contracts and supplies a concrete aggressive-compression counterexample. Analysis may use this to examine dynamic skill lifecycle governance: each rewritten bundle should carry versioned provenance and fresh routing/entry validation, while broader execution semantics and external effects remain separate verification obligations.
