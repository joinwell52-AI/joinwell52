# Q-20260818-01 — A2A origin cannot satisfy a human tool-confirmation gate

- Runtime date: 2026-08-18
- Column: Digital Employee
- Source object: Q-20260818-01
- Primary source: https://github.com/google/adk-python/commit/9e9eaa69bdcc16f004af9c63f40f1dae6404c29b
- Evidence class: Fact for merged code/tests; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

A remote A2A peer can send content that is represented inside the receiving runtime as user-role input. Without a separate origin signal, a function response arriving through that transport could be mistaken for the accountable human confirmation required by a pending dangerous tool call. The merged change closes that demonstrated origin-confusion path.

## Facts

1. The commit explicitly states that a remote peer could self-approve a pending dangerous tool call over A2A because inbound messages were treated as user-role input.
2. `convert_a2a_request_to_agent_run_request` now always writes an `a2a_metadata` entry into `RunConfig.custom_metadata` for A2A requests.
3. The A2A marker is present even when the peer sends no protocol metadata: empty or absent metadata becomes an empty object under the marker rather than causing the marker to be omitted.
4. The implementation comment defines the marker as a trust signal whose presence, not its payload, distinguishes A2A origin.
5. `request_confirmation.run_async` checks `invocation_context.run_config.custom_metadata` before resolving tool confirmations.
6. If the `a2a_metadata` key is present, the confirmation processor logs a warning and returns immediately, so confirmation function responses in that A2A-marked invocation are not used to satisfy the pending human-in-the-loop confirmation.
7. The guard is placed before the processor examines current-branch confirmation events.
8. A converter regression test verifies that an A2A request with empty metadata still produces `{"a2a_metadata": {}}`.
9. A confirmation regression test exercises an A2A request carrying metadata and verifies that the apparent user confirmation produces no confirmation-processing events.
10. A second regression test exercises an A2A request with no peer metadata and verifies the same rejection behavior, covering the path that previously allowed the origin marker to disappear.
11. The tested pending confirmation is represented by the ADK confirmation function call, followed by a user-role `FunctionResponse` that would otherwise report `confirmed=True`.
12. The patch is specific to confirmations processed in an invocation marked as A2A-originated; it does not redefine every user message or every external transport as untrusted.

## Mechanisms

### Origin marker separated from peer-supplied metadata

The converter no longer makes the existence of the trust marker conditional on whether the remote peer supplied metadata. `a2a_metadata` therefore acts as receiver-owned provenance: even an empty metadata payload still leaves an origin marker that downstream code can test.

### Fail-closed confirmation processor

The confirmation processor treats presence of the A2A marker as sufficient to reject the confirmation path. It does not inspect a remote peer-provided identity claim to decide whether the peer is allowed to stand in for the human; the demonstrated rule is simpler and stricter: an A2A-originated function response cannot satisfy this HITL confirmation processor.

### Early rejection before event resolution

The check occurs before the normal current-branch event scan and confirmation-target resolution. This prevents a syntactically valid remote `FunctionResponse` from reaching the matching logic for the pending confirmation.

### Regression coverage for marker suppression

The no-metadata test is important because the prior weakness was not only a spoofed metadata value; omission of metadata could remove the provenance key entirely. The new converter test and end-to-end confirmation test preserve the marker and enforce the gate in that case.

## Evidence

- `src/google/adk/a2a/converters/request_converter.py` always constructs `custom_metadata` with the A2A marker, independent of whether request metadata is empty.
- `src/google/adk/flows/llm_flows/request_confirmation.py` rejects confirmation processing when that marker is present.
- `tests/unittests/a2a/converters/test_request_converter.py` verifies empty metadata still marks A2A origin.
- `tests/unittests/flows/llm_flows/test_request_confirmation.py` verifies confirmations are ignored both when A2A metadata is supplied and when it is absent.
- The merged commit message identifies the concrete threat: a remote A2A peer self-approving a pending dangerous tool call.

## Limitations

1. The demonstrated guarantee is a transport/origin boundary for the ADK A2A conversion path and the changed confirmation processor; it is not proof of complete HITL security.
2. The patch does not prove that every alternate transport, plugin, direct API or internal call path that can construct `RunConfig` is unable to manufacture or omit provenance in another way.
3. The presence test does not authenticate which remote peer sent the A2A message; it prevents the entire demonstrated A2A-origin class from satisfying this human confirmation rather than establishing remote identity.
4. The change does not establish the identity, freshness, device, session or authorization of the eventual human confirmation arriving through an allowed path.
5. It does not provide cryptographic provenance or tamper-evident audit history for confirmation events.
6. Returning early for an A2A-marked invocation is intentionally coarse. This note does not establish how mixed-origin workflows should represent a legitimate later human confirmation if the same invocation remains A2A-marked.
7. The tests prove the changed code paths, not every dangerous-tool or approval implementation in ADK.

## Comparisons

- Treating `role=user` as sufficient authority collapses content role and transport provenance. The change introduces a separate receiver-controlled origin signal for this decision.
- Trusting peer-supplied metadata to say whether a request is remote would preserve an attacker-controlled bypass. The converter instead writes the A2A marker regardless of metadata presence.
- A peer-identity allowlist would answer a different question: which remote machine is trusted. The merged rule answers whether a remote A2A peer may stand in for a human approver, and the demonstrated answer is no.

## Unresolved questions

1. Which non-A2A transports can deliver confirmation `FunctionResponse` objects, and what provenance gates apply to each?
2. Can a workflow transition from a remote A2A turn to a separately authenticated human confirmation without carrying the coarse A2A marker into the human step?
3. Is confirmation provenance persisted in session/event history in a form that later audit tooling can distinguish reliably?
4. Are there other HITL processors outside `request_confirmation.py` that accept user-role responses and need the same origin separation?
5. How is the actual human approver authenticated and authorized on allowed confirmation channels?
6. Would a generalized origin enum or typed provenance object reduce the risk of future security decisions depending on ad hoc metadata keys?

## Reading boundary

This note establishes a merged, tested mechanism: ADK now always marks A2A-originated invocations, including requests with no peer metadata, and the changed tool-confirmation processor refuses to consume confirmations from an A2A-marked invocation. This blocks the demonstrated remote-peer self-approval path. It does not establish complete HITL security, human identity, cryptographic provenance, coverage of every transport, or end-to-end authorization. Those broader judgments belong to Skill 04 Analysis.
