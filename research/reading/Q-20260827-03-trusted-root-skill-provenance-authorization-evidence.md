# Q-20260827-03 — Trusted-Root Skill Provenance as Guardian Authorization Evidence

- Runtime date: 2026-08-27 (Asia/Shanghai)
- Queue signal: SIG-20260827-007
- Primary source: https://github.com/openai/codex/commit/b68acc4d4b56fdfa1d5b6a2c36102c66876e0c46
- Evidence level: `merged_maintainer_change`
- Scope: OpenAI Codex Guardian v2 skill invocation provenance, trusted roots, canonicalization, symlink escape handling, bounded evidence and approval review

## Problem

A skill invocation can carry user intent that matters to an approval decision, but a path label or skill body is not trustworthy by itself. Repository content can forge skill-shaped text, paths can escape expected directories through symlinks, and unbounded skill contents would create both prompt-injection and classifier-budget risks. Guardian therefore needs a host-verifiable provenance rule before treating a skill invocation as authorization evidence.

## Facts

The merged Codex change adds a Guardian v2 `SkillInvocationContributor`. For every skill invocation it resolves the invocation's `skill_resource` through host-owned `TrustedSkillRoots`. Only a path that successfully canonicalizes, resolves under a canonical trusted root, is a file and fits the path-length limit is recorded for the turn.

The trusted roots shown in the implementation are `<codex_home>/skills` and the user's `~/.agents/skills`. Repository skills are not in those roots. Because both the candidate path and each root are canonicalized before `starts_with` comparison, a symlink whose target escapes a trusted root does not qualify merely because its textual path appears under that root.

Trusted invocations are stored in a per-turn `BTreeSet`, which deduplicates paths. The list is bounded to at most 16 skills, at most 512 bytes per path and at most 2,048 path bytes overall. When rendered into Guardian context it is additionally constrained by a 768-token budget.

The evidence sent to Guardian is a separate developer-role contextual fragment containing a JSON-like list of the verified canonical paths prefixed as “Codex-verified invoked user-owned skill paths”. The code sends paths, not the skill contents, reducing the chance that arbitrary skill text becomes privileged classifier context merely because a skill was invoked.

Both explicit and implicit invocation paths flow through the skill-invocation contributor. The integration test constructs explicit and implicit user-owned skills under the trusted user skill directory while also creating a forged repository skill whose body attempts to present trusted-looking skill markup/path material. Guardian receives the verified trusted paths while the forged repository skill remains untrusted.

The commit also avoids recording host skill prompts superseded by core skill injection, preventing duplicated/superseded host material from being counted as current authorization evidence.

## Vendor Claims

The maintainer states that Guardian previously treated all skill instructions as untrusted and therefore could not use invocation of a user-owned skill as authorization evidence. The change claims to record explicit/implicit skill invocations, send only a bounded deduplicated list of canonical paths under user-owned trusted roots, keep repository and escaping-symlink skills untrusted, and prove the distinction with unit/integration tests. The implementation directly supports those bounded claims.

## Mechanisms

1. **Host-owned trusted roots:** trusted skill provenance begins from Codex-owned configuration and the user's standard `.agents/skills` location rather than from a path claimed by repository content.
2. **Canonicalization before trust:** both skill resources and roots are canonicalized; trust requires the resolved skill path to remain under a resolved trusted root.
3. **Symlink-escape rejection:** a textual path under a trusted directory cannot qualify if canonical resolution escapes that root.
4. **File/type and size checks:** only actual files with bounded path length can become evidence.
5. **Per-turn deduplication and budgets:** a BTreeSet plus count/byte/token ceilings limits evidence amplification.
6. **Path-only privileged fragment:** Guardian receives verified path provenance as a separate developer-role fragment, not arbitrary skill body content.
7. **Invocation-time capture:** the extension records skill provenance when the host observes invocation, linking evidence to an actual invocation event rather than merely to skill existence.
8. **Negative repository-forgery coverage:** the integration test demonstrates that repository content imitating trusted skill markup does not gain the same evidence status.

## Evidence

Primary evidence is merged OpenAI Codex maintainer commit `b68acc4d4b56fdfa1d5b6a2c36102c66876e0c46`. The key source file `codex-rs/ext/guardian-v2/src/async_scorer/trusted_skills.rs` exposes the trusted roots, canonicalization logic and limits; `extension.rs` records verified invocation paths into the turn store; and Guardian integration/unit tests cover trusted roots, symlink escapes, deduplication, size limits and forged repository skills.

The code supports a precise provenance claim: a skill's invocation can become Guardian authorization evidence only after the host resolves its path into one of the designated user-owned trusted roots under the demonstrated rules.

## Limitations

Trusted provenance does not mean the skill contents are intrinsically safe, correct or current. The mechanism establishes who owns the invoked skill path under the configured trust model; it does not statically prove the semantics of the instructions inside the file.

This evidence is specific to Guardian v2 approval review. It is not proof that every Codex subsystem treats user skills as authorization evidence or applies the same roots.

Canonical-path trust depends on the local filesystem and the correctness of the root configuration/home-directory resolution. The selected change does not provide a cryptographic signature or immutable content hash for a skill.

A trusted skill file may change over time. The demonstrated fragment contains the canonical path, not a content digest, so this change alone does not establish historical content identity for later audit.

The bounded list can omit additional otherwise trusted invocations after count/byte/token limits are reached. That is a deliberate safety bound, not complete provenance capture for arbitrarily many skills.

## Comparisons

Trusting a displayed path, skill name or embedded `<skill>` markup would allow repository-controlled text to masquerade as user authorization. Trusting every skill body as privileged context would also elevate unbounded instructions. The changed model instead treats invocation provenance as a host-observed capability fact: canonical path under a trusted user root first, bounded path-only evidence second, Guardian interpretation last.

## Unresolved Questions

- Should the evidence include a content digest so later reviews can prove which exact trusted skill version was invoked?
- How are trusted-root changes or user-home remapping reflected for already-running threads?
- When the bounded list overflows, is omission observable in audit telemetry or only implicit?
- Are there revocation semantics if a previously trusted skill path is removed or replaced between invocation and later review?
- Could future organization-managed skill roots be added while preserving the same canonicalization and provenance guarantees?

## Reading Conclusion

The Codex Guardian change turns user-skill invocation into authorization evidence only through a host-verifiable provenance boundary: an actually invoked skill must canonicalize to a real file under designated user-owned trusted roots, after which only a bounded deduplicated path list is elevated into Guardian's developer context. Repository skills and symlink escapes remain untrusted. This is a strong provenance rule for the demonstrated Guardian/skill contract, not a proof that trusted skill contents are universally safe or immutable.
