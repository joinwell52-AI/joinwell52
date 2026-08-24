# Q-20260824-02 — Child-Only Developer-Instruction Provenance Across Full-History Subagent Forks

- Runtime date: 2026-08-24 (Asia/Shanghai)
- Queue signal: SIG-20260824-002
- Primary source: https://github.com/openai/codex/commit/a70974c1a0837e17769e3c41f83ad5e592c703fb
- Evidence level: `merged_maintainer_change`
- Scope: OpenAI Codex full-history subagent fork construction, contextual fragments, developer-role classification and child-only instruction placement

## Problem

A full-history subagent fork reuses substantial parent context while also needing instructions that belong only to the child. If child-only developer instructions are inserted as an unclassified or ordinary message, their provenance can be degraded. If they also leak into the parent request or are injected more than once into the child, the fork no longer preserves a clear instruction boundary.

## Facts

The change introduces a dedicated `DeveloperInstructions` contextual fragment. Its `content_kind()` is `generic.developer_instructions`, its role is `developer`, it uses no wrapper markers, and its body is the supplied instruction text.

The previous helper used for a developer update constructed annotated input text with content kind `unknown`. That helper is removed for this path, and ordinary session developer sections are also rendered through the new dedicated fragment.

In full-history subagent fork construction, Codex filters and rewrites inherited rollout items. When a parent developer instruction is found, the fork path can replace or remove that parent-specific text depending on whether reference context is preserved. The code tracks whether the parent developer instruction was replaced.

For the case where reference context is preserved but does not itself contain the parent's developer fragment, and the child-specific developer instruction is non-empty and has not already replaced a parent fragment, the fork appends one `DeveloperInstructions` contextual fragment to the child rollout. The code comment states the purpose explicitly: the child's override should reach the model exactly once.

The regression configuration clears ordinary parent developer instructions and sets `subagent_developer_instructions` to a child-only value. The resulting assertions verify three facts together: the parent request does not contain the child-only instruction, the child request contains content kind `generic.developer_instructions`, and the exact child-only instruction occurs once among child developer messages.

## Vendor Claims

The maintainer description says the change preserves developer-instruction annotations in subagent forks, keeps child-specific instructions classified as developer instructions, sends them to the child exactly once and keeps them out of the parent request. The changed contextual-fragment implementation, fork logic and regression assertions directly support those scoped claims.

## Mechanisms

1. **Dedicated provenance type:** `DeveloperInstructions` carries an explicit developer role and `generic.developer_instructions` content kind instead of `unknown`.
2. **Fork-history filtering:** inherited rollout items are examined so parent-specific developer text can be replaced or removed at the lineage boundary.
3. **Duplicate-avoidance state:** `replaced_parent_developer_instructions` tracks whether the child override has already been represented while inherited history is processed.
4. **Conditional fallback injection:** only when preserved reference context would otherwise omit the child override does the fork append one dedicated child developer fragment.
5. **Request-level regression:** tests assert parent exclusion, child provenance annotation and count exactly equal to one in the demonstrated full-history V2 configuration.

## Evidence

Primary evidence is merged maintainer commit `a70974c1a0837e17769e3c41f83ad5e592c703fb` in `openai/codex`.

`codex-rs/core/src/context/developer_instructions.rs` defines the new fragment and binds developer role to the `generic.developer_instructions` content kind.

`codex-rs/core/src/agent/control/spawn.rs` shows the full-history filtering/replacement logic and the conditional child-only fallback injection when preserved reference context is reused.

`codex-rs/core/tests/suite/subagent_notifications.rs` configures a child-only developer instruction and verifies the parent request excludes it, the child request carries the developer-instruction content kind, and the text appears exactly once in the child's developer messages.

## Limitations

Instruction provenance is not authorization. A message being classified as `developer` does not prove who was authorized to provide it, whether its content is trustworthy, or whether it should outrank some separately governed policy source.

The exactly-once evidence is request-local and specific to the demonstrated full-history fork construction. It does not establish distributed exactly-once delivery, durable message deduplication across retries, or a general inter-agent transport guarantee.

The fork code still contains a TODO to track message-fragment provenance more precisely in rollouts. Part of the inherited-history rewrite inspects text containing parent developer instructions, so the selected change should not be generalized into a fully typed end-to-end provenance graph.

The tests demonstrate one configured-default branch of full-history V2 behavior. Other history modes, clients and future context-compaction paths require their own evidence.

## Comparisons

The old path preserved the developer role in message construction but used content kind `unknown`, losing a useful semantic annotation. The new fragment makes source classification explicit and reusable across session rendering and child-fork injection.

Compared with copying all parent context and simply appending child instructions, the fork logic attempts to preserve lineage while preventing parent-only or child-only developer guidance from occupying the wrong request boundary.

## Unresolved Questions

- Can all developer-instruction origins be represented as typed provenance fragments, eliminating text-replacement heuristics in forked history?
- How are competing parent, managed and child developer instructions ordered when several typed fragments coexist?
- Are provenance annotations persisted and inspectable through every compaction, resume and export path?
- Which authorization layer decides whether a caller may set `subagent_developer_instructions`, independently of its provenance annotation?

## Reading Conclusion

The selected Codex change establishes a concrete provenance boundary for child-only developer instructions in the demonstrated full-history subagent fork: they retain developer classification via `generic.developer_instructions`, are excluded from the parent request and are asserted to appear once in the child request. That is a useful instruction-lineage mechanism, but it is not authenticated authority, trust validation or distributed exactly-once delivery.
