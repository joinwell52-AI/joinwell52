---
schema: publication-candidate-article/v2
title: "Protected Constraints and Reviewable Grants Need Different Merge Rules"
date: '2026-08-22'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "How should a remote execution architecture combine policies owned by different authorities so that protected constraints cannot be weakened while explicitly reviewable access can still expand under governance?"
summary: "A safe multi-owner policy merge is neither a blanket union nor a blanket intersection. Protected ceilings must survive later layers, while legitimate expansion belongs in an explicit, scoped and invalidatable review transition."
cover: staging/publication-candidates/2026-08-22-protected-constraints-reviewable-grants-cover.png
sources:
  - research/analysis/Q-20260822-02-monotonic-policy-composition-reviewable-expansion.md
---

![Protected Constraints and Reviewable Grants Need Different Merge Rules cover](staging/publication-candidates/2026-08-22-protected-constraints-reviewable-grants-cover.png)

# Protected Constraints and Reviewable Grants Need Different Merge Rules

When several authorities contribute policy to a remote execution, the obvious merge rules are both wrong in important cases. Union lets any participating layer widen access and can erase an owner's ceiling. Pure intersection preserves non-expansion, but it cannot express a legitimate exception that the policy intentionally makes reviewable.

A Codex change merged on 2026-08-22 shows a more useful pattern for network policy. An attachment can own traffic restrictions while a controller, permission profile and saved review decisions contribute other constraints. The implementation composes those sources asymmetrically: protected denials and strict ceilings survive; grants are retained only on compatible or reviewable paths; and the final effective proxy policy is validated before use.

The architectural rule is not “deny always wins.” It is: **protected constraints should compose monotonically, while permitted expansion should be an explicit reviewable transition with defined scope and invalidation.** The distinction must be represented in the policy schema, not inferred later from merge order.

## A set operation cannot express authority ownership

Consider an environment allowlist, a controller deny rule and a previously saved network approval. A union of allowed domains could let the saved grant or environment list erase the controller's protected denial. An intersection would preserve the denial but also remove any route for a policy-defined, human-reviewed exception.

The missing information is ownership and expandability. Some fields are ceilings: later layers may preserve or narrow them but cannot silently widen them. Some are reviewable grants: they may add access when a named decision process authorizes a bounded exception. Others are implementation settings that an attachment should not own at all, such as proxy credentials, listeners or runtime network mode.

Codex's `EnvironmentNetworkPolicy` reflects this separation. It gives the attachment a portable subset of traffic restrictions without granting wholesale control over proxy runtime authority. The owner can constrain traffic without acquiring credentials or listener configuration merely because its policy participates in the merge.

## Asymmetric composition preserves the ceiling

The demonstrated merge does not treat every field identically. Owner domain rules can replace soft grants, but inherited controller denials are restored afterward. Unix-socket access is intersected so compatible grants can survive while a denial remains dominant. `allow_upstream_proxy` and `allow_local_binding` require both owner and controller permission.

Saved decisions follow the same asymmetry. Saved denies remain admissible. Saved grants are applied only where expansion remains reviewable, and protected owner or controller denials are restored after those decisions. A fixed controller allowlist and an attachment's strict managed allowlist suppress approval-based widening.

This ordering is governance behavior, not a coding detail. “Applied last” means “cannot be erased by a later authority.” If that meaning is not declared, a refactor that merely reorders operations can become an authority change without an explicit policy review.

## Expansion belongs in a transition, not in precedence

Legitimate expansion is sometimes necessary. A remote task may need a domain outside the initial set, and the controlling policy may deliberately permit a human review. The safe representation is a separate transition that records who approved what, for which environment and command scope, under which policy version, and when the grant expires or becomes invalid.

That grant should not masquerade as an ordinary merge input. Treating it as a first-class transition makes three questions inspectable:

- Does this field permit expansion at all?
- Is the saved decision still bound to the current environment identity and policy version?
- Which protected ceilings remain non-expandable after the grant?

Strict and reviewable modes are therefore different governance states, not merely different allowlist values. The strict mode removes the fallback approval decider. The reviewable mode can admit a saved grant when controller constraints allow it. Both still need the protected layer to remain visible after composition.

## Validate the result and every route that can execute it

Correct fragments do not guarantee a correct effective policy. Domain and socket normalization can fail; owner settings may be incompatible with managed enforcement; a controller proxy may be disabled. The Codex path validates the composed proxy configuration before execution rather than assuming that each input's validity composes automatically.

Enforcement also has to cover alternate execution modes. The same change rejects sandbox escalation when escalation would bypass attachment-owned network policy. Without that check, the primary policy path could be correct while a secondary route quietly escapes it.

This is the operational consequence of treating merge semantics as authority: validators and escalation checks must consume the same effective policy. A policy that exists only in configuration assembly is not a runtime ceiling.

## The demonstrated boundary is network policy

The public evidence covers Codex remote-execution network policy and a related sandbox-escalation path. It does not establish equivalent composition for filesystem access, process privileges, credentials, tool availability or application authorization. Reviewable network policies can intentionally expand access; monotonicity applies only to fields declared protected.

The design also leaves open how saved decisions are invalidated when environment identity, controller constraints or policy versions change, and how already-running executions react to a new ceiling. Those questions are part of the model, not implementation cleanup.

The durable lesson is precise: define who owns each policy field, mark which constraints are non-expandable, route legitimate grants through a separately auditable transition, validate the composed result and enforce it on escalation paths. Anything less turns merge precedence into accidental authority.

**Primary evidence:** [OpenAI Codex merged commit f580dd88](https://github.com/openai/codex/commit/f580dd886fe57259168c0afc0e3e7820942eed14). The public code and tests support the bounded network-policy behavior described here; they do not independently validate all remote-execution capability composition.
