# Q-20260817-01 — Obsolete permission fields fail closed at the app-server request boundary

- Runtime date: 2026-08-17
- Column: Digital Employee
- Source object: Q-20260817-01
- Primary source: https://github.com/openai/codex/commit/935b1c4e3d25ec0c04bccde0144125f46314180b
- Evidence class: Fact for merged code/tests; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

An API can remain structurally tolerant of unknown fields while accidentally becoming unsafe when a removed authorization field is treated as just another unknown field. The concrete problem is that a client may send the obsolete `permissionProfile` field believing a permission policy is active, while permissive deserialization silently drops it. The merged change addresses that mismatch without abandoning forward-compatible handling of unrelated unknown fields.

## Facts

1. The app-server request deserialization path now invokes `reject_obsolete_request_fields` before converting the JSON-RPC request into `ClientRequest`.
2. The obsolete-field check specifically rejects `permissionProfile` on `thread/start`, `thread/resume`, `thread/fork`, and `turn/start`.
3. Rejection is based on presence of the `permissionProfile` key in an object-shaped `params`; the old field is rejected before normal request deserialization.
4. The returned error is an invalid-params error explaining that `permissionProfile` is no longer supported for the affected method and instructing callers to use `permissions` with a named profile id instead.
5. The change does not turn deserialization into a general unknown-field rejection mechanism. Unrelated unknown fields remain accepted for forward compatibility.
6. Tests exercise all four affected methods with the obsolete field and assert the exact invalid-params error code/message.
7. After the four rejected requests, the test issues another request on the same connection and receives a valid response, demonstrating that fail-closed request rejection does not poison the app-server connection.
8. A separate test sends `thread/start` with a valid named `permissions` value and an unrelated future/unknown field. The request succeeds.
9. That successful request is checked for a read-only sandbox with network access disabled and for the expected active read-only permission profile.
10. The patch is concentrated in the app-server message processor and request-validation tests; it does not introduce a new organization-wide authorization system.

## Mechanisms

### Targeted pre-deserialization guard

The implementation places a targeted compatibility/security check before normal `ClientRequest` conversion. This is important because the underlying request representation intentionally tolerates unknown fields. The guard therefore identifies one removed field whose silent loss changes authorization meaning and rejects it explicitly, while leaving generic forward compatibility intact.

### Method-bounded rejection

The check is scoped to the four lifecycle methods that can carry the obsolete permission field. The mechanism is not a blanket schema hardening rule for every app-server request.

### Migration to named permissions

The error message provides the supported replacement: `permissions` with a named profile id. The companion success test demonstrates that named permission selection is still accepted when unrelated future fields are present.

### Connection-level recovery after invalid input

The test sends another request after repeated invalid-params responses and verifies normal service. The rejection is therefore request-local rather than a connection-fatal protocol error.

## Evidence

- `codex-rs/app-server/src/message_processor.rs` inserts the obsolete-field rejection before `ClientRequest::try_from` and defines the exact four-method/key contract.
- `codex-rs/app-server/tests/suite/v2/request_validation.rs` checks fail-closed behavior for `thread/start`, `thread/resume`, `thread/fork`, and `turn/start`.
- The same test confirms the connection remains usable after invalid requests.
- A compatibility test confirms `thread/start` still accepts a named `permissions` profile together with an unrelated unknown field and applies the expected read-only permission state.

## Limitations

1. The demonstrated guarantee is at the app-server request/deserialization boundary for four methods; it is not proof of end-to-end authorization safety.
2. The change does not establish caller identity, approver identity, policy provenance, or tamper resistance.
3. It does not prove that every possible alternate API or internal path rejects semantically obsolete permission state; only the changed and tested paths are established here.
4. Generic unknown fields are still intentionally ignored, so future removed fields with security meaning may require their own explicit fail-closed rule.
5. The tests demonstrate the supported named-profile path and the exact obsolete field, not every possible malformed `permissions` value.
6. The mechanism prevents one form of silent policy loss; it does not establish that the selected permission profile is sufficient for every downstream operation.

## Comparisons

- A strict `deny_unknown_fields` policy would eliminate the silent-drop risk broadly but would also remove the stated forward-compatibility behavior. This change instead treats security-significant schema retirement as an explicit exception.
- Silently translating the legacy field could preserve client behavior but would keep an obsolete contract alive and make migration ambiguity durable. The merged change rejects the old field and points to the supported named-profile representation.
- Returning an error without preserving the connection would make one invalid request operationally disruptive. The test demonstrates request-local failure with continued connection usability.

## Unresolved questions

1. Is there a registry or review process for future removed fields whose silent loss could change authorization semantics?
2. Are equivalent request paths outside these four methods able to carry permission-related state, and if so, how are retired fields handled there?
3. Should compatibility telemetry distinguish obsolete security-sensitive fields from ordinary malformed input so operators can detect stale clients?
4. How is the named permission profile itself versioned and audited after the request passes this boundary?
5. What contract ensures that a caller can verify which permission profile was ultimately applied across resume/fork/turn lifecycle transitions?

## Reading boundary

This note establishes a merged, tested app-server mechanism: the removed `permissionProfile` field is explicitly rejected on four permission-relevant lifecycle methods before permissive request deserialization can silently discard it; unrelated unknown fields remain forward-compatible, and the connection remains usable after rejection. It does not establish end-to-end authorization, caller identity, complete coverage of all permission-carrying paths, or a general proof that silent policy loss cannot occur elsewhere. Those broader judgments belong to Skill 04 Analysis.
