# Q-20260820-02 — Cross-agent history reconstruction must scrub credential-bearing control calls before rendering

- Runtime date: 2026-08-20
- Column: Industry Architecture
- Source object: Q-20260820-02
- Primary source: https://github.com/google/adk-python/commit/2aea8595fb1c5e0fddef7893a1985dc96dc82692
- Evidence class: Fact for merged code/tests; maintainer claim where explicitly labeled; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

A multi-agent runtime may rebuild an outgoing remote message from local session history. That history can contain control-plane events that were never intended to cross the remote trust boundary. In Google ADK, the `adk_request_credential` function call stores a serialized `AuthConfig` in its arguments. Because `RemoteA2aAgent` reconstructs a request from session events, replaying that function call can forward OAuth client secrets or service-account keys to a remote A2A peer. The merged fix turns history reconstruction into an explicit security transformation step rather than transparent replay.

## Facts

1. `RemoteA2aAgent._construct_message_parts_from_session` reconstructs outgoing A2A message parts by walking local session history.
2. Before this change, the reconstruction path already filtered credential-bearing `function_response` parts, but it did not filter credential-bearing `function_call` parts.
3. The credential-request call `adk_request_credential` carries a serialized `AuthConfig` in its arguments through an `AuthToolArguments` envelope.
4. The serialized AuthConfig can include `raw_auth_credential`, which the maintainer describes as containing an OAuth2 client secret or service-account key.
5. A flow can append the credential-request event to the session when a toolset asks the client for credentials, making the sensitive call part of the history later consumed by remote reconstruction.
6. The fix introduces `_CREDENTIAL_ARG_FUNCTION_CALL_NAMES` containing the real credential-request call name while intentionally excluding the mock auth call.
7. The mock auth call is excluded because its arguments hold the remote peer's prompt rather than the local credential; dropping it could remove the prompt and leave the reconstructed message empty.
8. The fix adds `_AUTH_CONFIG_ARG_KEYS = ("authConfig", "auth_config")`, recognizing that request-side AuthConfig is nested one level below the top-level arguments.
9. `_is_credential_function_call` returns true either when the function name is a known credential-request name or when the nested `authConfig` / `auth_config` payload has the shape of a serialized AuthConfig.
10. The shape test is deliberately nested. An ordinary tool that merely has a top-level `auth_scheme` argument is not treated as a credential request.
11. `_without_credential_function_calls` scans event parts, deep-copies the event only when a credential-bearing call is present, and removes only the matching function-call parts from that copy.
12. The original session event is not mutated by the scrub; the security transformation applies to the outgoing reconstructed representation.
13. In `_construct_message_parts_from_session`, credential-call scrubbing now runs before `_present_other_agent_message`.
14. The ordering is security-critical because `_present_other_agent_message` can render a function call as text with its arguments inlined; scrubbing after rendering would be too late to reliably identify the credential structure.
15. If a credential-only event becomes empty after scrubbing, reconstruction skips the event rather than sending an empty/preamble-only message to the peer.
16. If a credential-bearing call has a non-secret text sibling, the call is removed while the text remains available for reconstruction.
17. Tests cover both events authored by the RemoteA2aAgent itself and events authored by another agent.
18. A regression test verifies that a credential call under an unknown function name is still dropped when its nested argument shape contains AuthConfig.
19. A regression test verifies that an ordinary `register_connector` call containing a top-level `auth_scheme` field remains forwarded, preventing a broad false-positive scrub.
20. A regression test verifies that the mock auth prompt is preserved.
21. An asynchronous regression verifies that a credential-only resume does not forward AuthConfig to the remote peer.
22. The existing response-side credential filtering remains in place, so the change adds request-call scrubbing rather than replacing response filtering.

## Maintainer claims

The commit describes an actual secret-forwarding path: credential-request function calls persisted in session history could be rebuilt by `RemoteA2aAgent` and sent to a remote peer, including serialized OAuth client secrets or service-account keys. It also states that scrubbing must occur before other-agent rendering because rendering inlines function-call arguments into text. These claims are directly supported by the merged control flow and regression tests. They remain scoped to the demonstrated ADK history-reconstruction path rather than proving general A2A confidentiality.

## Mechanisms

### Treat session history as mixed-trust state

The fix implicitly distinguishes two kinds of state inside one session history: conversational material that may be replayed to a remote peer and local control material that must not cross that boundary. Reconstruction is therefore not a byte-for-byte replay operation; it is a policy-enforcing projection.

### Scrub by semantic name and structural shape

Known `adk_request_credential` calls are rejected by name. Unknown calls are also rejected when a nested AuthConfig payload is recognized by shape. This creates a fail-closed fallback for renamed or otherwise unexpected credential-carrying calls while avoiding a rule that drops any ordinary argument named `auth_scheme`.

### Scrub before representation loss

The function call is still structured when `_without_credential_function_calls` runs. After `_present_other_agent_message`, its arguments may have been flattened into text. Performing the security decision before that transformation preserves the information needed to identify and remove the secret-bearing control call.

### Copy on scrub, preserve local audit/history state

The session event is deep-copied only when filtering is needed. The original local history therefore keeps the credential control event, while the remote projection omits it. This supports a boundary between local evidence/history and externally forwarded context rather than deleting audit-relevant local state.

### Preserve non-secret context and explicit exceptions

The scrub filters only matching function-call parts. Text siblings survive, and the mock-auth prompt survives by design. Credential-only events disappear completely. This makes the transformation selective rather than treating an entire event as contaminated whenever one sensitive part exists.

## Evidence

- The new `_CREDENTIAL_ARG_FUNCTION_CALL_NAMES` identifies `REQUEST_EUC_FUNCTION_CALL_NAME` as a call whose arguments carry credential material.
- `_CREDENTIAL_PAYLOAD_KEYS` includes both snake_case and camelCase forms of `raw_auth_credential`, exchanged credentials and authentication scheme fields.
- `_AUTH_CONFIG_ARG_KEYS` encodes the request envelope's nested AuthConfig position.
- `_is_credential_function_call` implements name-based and nested-shape detection.
- `_without_credential_function_calls` deep-copies and filters only sensitive function-call parts.
- `_construct_message_parts_from_session` applies the scrub before other-agent message presentation and retains the existing response-side filter.
- Tests prove secret removal for known and unknown call names, text-sibling preservation, credential-only event dropping, preservation of an ordinary `auth_scheme` tool call and preservation of the mock-auth prompt.

## Limitations

1. The fix covers the `RemoteA2aAgent` session-history reconstruction path shown by this commit; it is not a proof that no other ADK serialization or forwarding path can expose credentials.
2. Structural detection depends on the modeled AuthConfig keys and envelope location. New credential representations not matching the known name or nested shape could require future updates.
3. Preserving local history means the credential event still exists in the local session. This change does not address local storage encryption, access control, retention or redaction at rest.
4. Removing credential-bearing function calls does not provide encryption, authenticated transport or peer authorization for the remaining A2A message.
5. The fix protects the demonstrated credential material; it does not classify every potentially sensitive field in conversational text or arbitrary tool arguments.
6. Deep-copy filtering demonstrates non-mutation of the original event but does not establish immutable audit logging.
7. The mock-auth exception is intentionally preserved because it carries a prompt. The evidence does not show that every future use of that call name will remain non-secret.
8. The tests prove selected reconstruction scenarios, not all A2A protocol states, retries, streaming variants or third-party peer implementations.

## Comparisons

- **Before:** response-side credential material was filtered, but request-side credential calls could survive reconstruction and be rendered or forwarded.
- **After:** both sides are filtered according to their different data shapes, and request calls are scrubbed before any transformation that could flatten their structured arguments.
- Deleting the whole local event would reduce leakage risk but also destroy local history and non-secret sibling context. The merged design instead keeps the local event and creates a scrubbed remote projection.
- A name-only blacklist would miss renamed/unknown credential calls. A top-level shape test would create false positives for ordinary tools with fields such as `auth_scheme`. The nested-shape check balances those two failure modes for the demonstrated schema.

## Unresolved questions

1. Are all outbound A2A reconstruction paths routed through this same scrubbing function, including retries, streaming and future protocol adapters?
2. Is there a central sensitivity label on session event parts that could replace repeated payload-shape inference across subsystems?
3. How are local credential-bearing session events protected at rest and during diagnostic export or tracing?
4. Can developers register custom credential tools, and if so how are their argument schemas enrolled in the scrub policy without depending on shape heuristics?
5. Are there non-credential secrets in arbitrary tool arguments that require a more general cross-agent data-loss-prevention boundary?
6. How should audit tooling show that a local event existed but was intentionally omitted from the remote projection?

## Reading boundary

This note establishes a merged and tested ADK mechanism: `RemoteA2aAgent` now removes credential-bearing request function calls from reconstructed outbound history before any rendering can inline their arguments, while preserving non-secret siblings, ordinary `auth_scheme` calls, the mock-auth prompt and the original local session event. Existing response-side filtering remains. The evidence does not establish general A2A confidentiality, local secret-at-rest protection, universal sensitive-data classification or end-to-end peer trust. Those broader judgments belong to Skill 04 Analysis.
