# Q-20260816-03 — Raw CLI config overrides add expressiveness while preserving deterministic precedence

- Runtime date: 2026-08-16
- Column: Open-source Engineering
- Source object: Q-20260816-03
- Primary source: https://github.com/openai/codex/commit/5ba12929f8870400695292eb805af440c25ec5ae
- Evidence class: Fact for merged code/tests; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

The TypeScript SDK's structured configuration serializer cannot safely represent every TOML key shape, especially permission maps whose keys are literal paths or names containing dots/spaces. Adding a raw escape hatch is useful only if its ordering relative to structured configuration, SDK-managed settings and thread-specific settings remains deterministic and observable.

## Facts

1. `CodexOptions` adds `configOverrides?: string[]` for raw `--config key=value` arguments.
2. Each raw override string is forwarded unchanged as its own `--config` argument rather than parsed and reserialized by the SDK.
3. Raw overrides are emitted after the SDK's structured `config` entries.
4. Because Codex CLI config processing is order-sensitive, a raw override for the same key can therefore supersede an earlier structured value.
5. The raw override array itself preserves caller order, including duplicate keys.
6. A test supplies structured `approval_policy="never"` followed by raw `approval_policy="on-failure"` and then raw `approval_policy="on-request"`; the expected command line preserves that exact sequence.
7. SDK-managed settings are emitted after raw overrides. The documented example is `baseUrl`, which becomes a later `openai_base_url` override and therefore takes precedence over a conflicting raw value.
8. Thread/run-specific settings are also emitted after raw overrides. Tests cover approval policy and network-access settings on resume and expect those later thread settings after the raw arguments.
9. The effective precedence encoded by emission order is: structured global config < ordered raw `configOverrides` < SDK-managed settings < thread/run-specific settings, for overlapping keys interpreted by the CLI.
10. The feature exists specifically because literal TOML maps such as permission maps with path keys cannot always be represented safely through dotted structured keys.
11. Documentation demonstrates a raw permission map containing `:root` and `/path/to/project/.env` literal keys.
12. Tests also cover structured maps containing names with spaces and literal permission-key structures so the SDK does not accidentally flatten them into different dotted semantics.
13. `configOverrides` does not modify `CODEX_HOME`; it affects CLI configuration arguments only.
14. The same raw overrides are retained on resume, while later SDK-managed and thread-specific settings retain their higher precedence.
15. The patch makes ordering deterministic and testable; it does not independently validate the semantic safety of arbitrary raw TOML supplied by the caller.

## Mechanisms

### Ordered raw escape hatch

The SDK stores raw override strings separately from structured configuration and appends each as `--config <raw-string>` after structured serialization. It does not attempt to understand or normalize literal-key TOML that motivated the feature.

### Precedence by command-line position

Precedence is implemented by emission order rather than a second in-SDK merge engine. Structured entries are emitted first, raw overrides next, SDK-managed settings after that, and per-run/thread settings later still.

### Duplicate preservation

The SDK does not deduplicate raw entries. Duplicate keys remain ordered on the command line, allowing the CLI's normal last-applicable-value behavior to decide the final value.

### Resume consistency

Resume uses the same global raw override list, then appends managed and thread-specific values. This prevents the raw escape hatch from silently overtaking settings that the SDK intentionally owns at execution time.

## Evidence

- Commit description states the motivation is TOML that cannot safely be expressed through structured dotted-key configuration.
- `CodexOptions.configOverrides` documents raw arguments as occurring after structured configuration and before managed/thread-specific overrides.
- `CodexExec.run` appends the raw array after structured overrides and before managed `baseUrl` handling.
- Tests verify literal permission-map values, duplicate raw keys, exact ordering, and precedence of managed/thread settings during resume.
- Documentation states the same precedence explicitly and provides a literal path-permission example.

## Limitations

1. Forwarding raw strings unchanged does not mean the strings are valid TOML or accepted by the Codex CLI; malformed-value handling remains downstream of this SDK layer.
2. Deterministic precedence is not a security guarantee. A caller can still supply a security-sensitive raw override within the authority available to that invocation.
3. Literal path permission maps are represented faithfully as CLI text, but the correctness and safety of those permissions depend on Codex's config parser and policy enforcement.
4. Duplicate keys are intentionally preserved rather than rejected. Operators must understand the resulting precedence instead of assuming duplicate detection.
5. The ordering guarantee is scoped to this TypeScript SDK command construction and does not prove identical behavior in other SDKs or direct CLI invocations.
6. Later SDK-managed or thread settings can override raw values by design, so `configOverrides` is not an unconditional highest-priority channel.
7. The patch does not provide provenance, signing, or policy review for raw configuration supplied by application code.

## Comparisons

- Forcing literal path maps through dotted structured keys can change key meaning; raw passthrough preserves the intended TOML text.
- Giving raw overrides absolute highest precedence would let application-global escape-hatch values defeat execution-specific settings. The implemented ordering keeps managed and thread values later.
- Deduplicating raw overrides inside the SDK would create a second precedence system. Preserving order leaves one observable command-line sequence.

## Unresolved questions

1. Should the SDK optionally validate raw override syntax without rewriting it?
2. Should security-sensitive raw keys be surfaced in telemetry or audit output before process launch?
3. Should duplicate raw keys trigger an optional warning while preserving exact command-line semantics?
4. How should applications explain effective configuration when the same key appears in all four precedence layers?
5. Can a machine-readable config trace expose which layer supplied the final security-sensitive value without leaking secrets?

## Reading boundary

This note establishes the merged TypeScript SDK mechanism only: raw config strings are passed unchanged after structured config and before SDK-managed/thread-specific values, preserving caller order and literal TOML keys while keeping later execution-owned settings authoritative. It does not establish that arbitrary raw configuration is valid, secure, policy-approved or equivalent across other clients. Those broader judgments belong to Skill 04 Analysis.
