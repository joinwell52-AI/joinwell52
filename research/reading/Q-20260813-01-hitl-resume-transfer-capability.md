# Q-20260813-01 — HITL resume reconstructs the flow-level transfer capability

- Runtime date: 2026-08-13
- Column: Digital Employee
- Source object: Q-20260813-01 / SIG-20260813-G-007
- Primary source: https://github.com/google/adk-python/commit/0897bee6a01928cc89a2ba229d42834f77b33e85
- Supporting primary records: https://github.com/google/adk-python/issues/5633 and https://github.com/google/adk-python/pull/5669
- Evidence class: Fact for code, tests and repository records; inference only where labeled
- Stage: Skill 03 Deep Reading only

## Problem

Google ADK's `transfer_to_agent` is a flow-level capability. The normal agent-transfer processor adds it dynamically to an LLM request, but confirmation resume historically rebuilt executable tools only from `agent.canonical_tools()`. Issue #5633 records the resulting failure: a paused transfer could reach resume and then fail because `transfer_to_agent` was absent from the reconstructed tool dictionary.

## Facts

1. The issue reproduces `ValueError: Tool 'transfer_to_agent' not found` after a human responds to the confirmation request.
2. The selected commit changes the confirmation processor so that after canonical tools are loaded, an `LlmAgent` recomputes valid transfer targets with `_get_transfer_targets(agent)`.
3. When targets exist, `_build_transfer_tool(transfer_targets)` creates a new `TransferToAgentTool`, which is inserted into `tools_dict` before confirmation-target resolution and re-execution.
4. The normal agent-transfer processor is refactored to use the same `_build_transfer_tool` helper, so initial execution and resume share the same transfer-target derivation and tool construction.
5. `_get_transfer_targets` derives eligible sub-agents and, when permitted, parent and peer targets; agents in `single_turn` or `task` mode are excluded where those rules apply.
6. The restored capability therefore comes from current agent topology and transfer policy rather than from the historical function-call arguments alone.
7. The resume path still separately parses the user's `ToolConfirmation`; restoring the tool does not substitute for or override the human decision.
8. Unit tests assert that `transfer_to_agent` is present in the tool dictionary for both approved and rejected confirmation paths.
9. A no-sub-agent unit test verifies that the transfer tool is not injected when no current transfer target exists.
10. The PR describes the fix as isolated to HITL confirmation resume and reports approve, reject and no-sub-agent test coverage.

## Mechanisms

### Capability reconstruction from current declarations

Resume reconstructs the missing flow-level capability from the current `LlmAgent` graph instead of assuming `canonical_tools()` is complete or persisting an executable tool object across the pause.

### Shared initial/resume construction

The same target-selection and tool-building helpers now serve the ordinary transfer path and the resume path. This reduces divergence between what the model could call before the pause and what the runtime can resolve after the pause.

### Human decision remains an independent gate

The tool must be resolvable even for rejection so the confirmation handler can close the original call correctly. Presence of the tool in `tools_dict` is not equivalent to approval.

### Fail-closed absence

No current transfer targets means no reconstructed transfer tool. The change does not manufacture authority that is absent from the current agent topology.

## Evidence

- Commit `0897bee6a01928cc89a2ba229d42834f77b33e85` changes `agent_transfer.py`, `request_confirmation.py`, and confirmation tests.
- `request_confirmation.py` restores the transfer tool before `_resolve_confirmation_targets` and `handle_function_call_list_async`.
- `agent_transfer.py` centralizes transfer-tool construction in `_build_transfer_tool`.
- Issue #5633 documents the pre-fix structural mismatch between flow-time injection and `canonical_tools()` reconstruction.

## Limitations

1. This is specific to ADK `transfer_to_agent` in the request-confirmation flow; it is not a generic proof for every dynamic capability or pause/resume system.
2. The tests verify tool reconstruction at the function-call handler boundary; they do not prove every downstream external side effect of a real transfer.
3. The source does not define migration behavior if agent topology changes while a confirmation is pending.
4. No durable capability snapshot or exactly-once execution guarantee is established by this change.
5. The selected source does not prove behavior across every ADK version, custom agent type or model adapter.

## Comparisons

- Canonical-tools-only resume loses flow-injected capabilities.
- Persisting an old executable capability would preserve old topology and policy assumptions.
- The selected design instead recomputes current valid targets and reconstructs the capability at resume time.

## Unresolved questions

1. What outcome should a pending confirmation receive if its transfer target is removed or renamed before resume?
2. Should dynamically injected resumable tools expose a common reconstruction interface?
3. Should resume compare a persisted capability identity with the newly reconstructed capability to detect policy drift?
4. What duplicate-execution protection applies if completion becomes ambiguous after reconstruction?

## Reading boundary

This note establishes only the source-backed ADK mechanism: current transfer targets are recomputed, `transfer_to_agent` is rebuilt, and the existing confirmation machinery then resolves the original call. Generalizing this into a digital-employee architecture is a Skill 04 analysis task.
