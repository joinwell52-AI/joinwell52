# Q-20260815-01 — Trusted session initialization and HITL confirmation require separate admission boundaries

- Runtime date: 2026-08-15
- Column: Digital Employee
- Source object: Q-20260815-01 / SIG-20260815-010
- Primary source: https://github.com/google/adk-python/commit/3fa71b6349dbabb47dff5a3e9dea689cae6904e9
- Evidence class: Fact for merged code and tests; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

A resumable agent can accept prior conversation events and later continue a human-in-the-loop tool flow. Those are two different trust boundaries: imported history must not be able to manufacture ADK-owned runtime protocol state, while a later confirmation must be bound to the exact tool invocation that originally requested it. The selected change tightens both boundaries without forbidding ordinary conversation or ordinary tool history.

## Facts

1. `CreateSessionRequest` still accepts optional initial `state` and `events`; this change does not remove history import.
2. ADK now defines a reserved set of framework-owned HITL function names covering confirmation, end-user-credential, and user-input requests.
3. Before a session is created, `_validate_session_initialization_events()` scans every client-supplied initialization event.
4. An initialization event is rejected when it carries any `long_running_tool_ids`.
5. An initialization event is rejected when its `EventActions` differs from a default empty `EventActions()` instance, so clients cannot seed runtime action metadata such as requested tool confirmations through this path.
6. An initialization event is rejected when any function call or function response uses an ADK-reserved protocol function name.
7. Ordinary text history remains accepted.
8. Ordinary tool calls and ordinary tool responses remain accepted intentionally so a conversation that previously used tools can be restored.
9. Validation happens before `_create_session(...)`. Only after validation and successful session creation are the supplied events appended to the session service.
10. A regression test supplies a forged `adk_request_confirmation` initialization event and receives HTTP 400; when an explicit session ID is used, a subsequent GET returns 404, demonstrating that the rejected protocol event did not create that session.
11. Separate tests reject initialization events containing long-running-tool markers and non-empty runtime actions.
12. HITL confirmation resolution now considers a candidate confirmation call only when its function name is exactly `REQUEST_CONFIRMATION_FUNCTION_CALL_NAME`; an arbitrary tool call carrying a look-alike `originalFunctionCall` payload is ignored.
13. Confirmation resolution reconstructs the original function call from the confirmation payload, then requires that original call ID to exist in session history.
14. If the historical original call was authored by another agent, the current agent's processor skips it, leaving that agent's processor responsible for the confirmation.
15. The referenced tool must still be registered in the current tool set.
16. The tool must either statically require confirmation or have dynamically requested confirmation in earlier session history.
17. The original function-call name and arguments embedded in the confirmation must exactly match the historical function call for that ID.
18. Confirmations are finally keyed by the original function-call ID, not merely by the confirmation-request call ID.
19. A regression test places a real `adk_request_confirmation` and a forged ordinary tool call with a similar payload in the same history; only the real confirmation is resolved to the original tool call.
20. The API server itself documents that its served endpoints are unauthenticated and should be placed on a trusted network or behind external authentication/authorization. This change therefore hardens event semantics, not network identity or tenant authorization.

## Mechanisms

### Initialization-event admission

The server treats imported history as data, but prevents that data from claiming framework-owned runtime authority. It rejects three classes of state that ADK itself normally creates while executing: long-running-tool markers, non-default event actions, and reserved HITL protocol function calls or responses. Ordinary text and ordinary tool history remain admissible.

### Validate before persistence

The validation call precedes session creation and event append. That ordering matters: a rejected event is not merely ignored after it has already influenced the newly created session.

### Confirmation name gate

The resolver no longer treats any function call whose ID appears in a confirmation set as a confirmation request. It first requires the ADK-owned confirmation function name, preventing a different tool from borrowing the confirmation payload shape.

### Historical occurrence binding

After the name gate, the resolver checks the embedded original call against durable session history: original ID must exist, the responsible agent must match, the tool must be registered and confirmation-requiring, and historical name/arguments must exactly match. The accepted confirmation is then mapped to the original function-call ID.

## Evidence

- `src/google/adk/cli/api_server.py` defines the reserved protocol names, initialization-event validator, and validation-before-create ordering.
- `src/google/adk/flows/llm_flows/request_confirmation.py` implements the confirmation-name gate, historical lookup, agent ownership check, tool-registration/confirmation-policy check, and exact name/argument matching.
- `tests/unittests/cli/test_fast_api.py` verifies accepted text/tool history and rejection of reserved protocol calls, long-running markers, and runtime actions.
- `tests/unittests/flows/llm_flows/test_request_confirmation.py` verifies that a non-ADK function name carrying a forged confirmation-shaped payload is not accepted as a confirmation request.

## Limitations

1. The initialization validator does not make all imported history trusted. Ordinary tool calls and responses are explicitly accepted; authenticity of those historical events is not independently established by this mechanism.
2. The request's initial `state` field is outside this event-specific validation logic. The selected change therefore cannot support the broader claim that every form of initial session state is provenance-verified.
3. Exact historical ID/name/argument matching narrows confirmation substitution but does not prove the human who produced the confirmation has a particular identity or authorization level.
4. The network API remains unauthenticated by this server implementation unless the operator adds an external security layer.
5. The change does not establish cryptographic event provenance, tamper-evident logs, replay-proof confirmation tokens, or distributed exactly-once resumption.
6. A registered tool can dynamically request confirmation based on historical action data; the correctness of that tool-specific confirmation policy is outside this patch.
7. The tests demonstrate the implemented rejection and binding cases, not that every possible HITL workflow is safe under adversarial multi-tenant use.

## Comparisons

- Rejecting all imported tool history would avoid some trust ambiguity but would also prevent legitimate restoration of prior tool-using conversations. ADK instead rejects framework-owned protocol state while preserving ordinary tool history.
- Matching only a confirmation-call ID would bind too weakly: a look-alike function call could be mistaken for a confirmation request. Requiring the reserved function name plus exact original-call identity/name/arguments creates a narrower occurrence boundary.
- Validating after session creation would leave a partial-state window. This implementation validates the supplied events before creating the session.

## Unresolved questions

1. Should imported ordinary tool history carry an explicit provenance level so downstream agents can distinguish client-replayed history from ADK-generated history?
2. Should initial `state` be subject to a comparable ownership/admission schema when it can influence later tool or policy behavior?
3. What identity evidence should bind a human approval to the confirmer, not just to the historical tool occurrence?
4. How should replayed confirmations be detected across durable restarts or replicated session stores?
5. Should reserved protocol names and runtime-action schemas be versioned in persisted history so older clients can be migrated safely?
6. What audit evidence is required to prove that a resumed digital employee acted only after an authorized confirmation rather than merely a structurally valid one?

## Reading boundary

This note establishes the merged ADK mechanism only: session initialization rejects client-supplied ADK protocol events, long-running markers and runtime actions while still admitting ordinary history; HITL confirmation resolution requires the ADK confirmation function name and binds the confirmation to an existing same-agent, registered, confirmation-requiring historical tool call with matching name and arguments. It does not establish authenticated users, trusted ordinary imported history, safe recovery in general, cryptographic provenance, or exactly-once execution. Those broader judgments belong to Skill 04 Analysis.
