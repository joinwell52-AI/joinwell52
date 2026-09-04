# Q-20260904-03 — Interrupted Tool Calls Need Recovery Evidence Without Autonomous Replay

- Runtime date: 2026-09-04 (Asia/Shanghai)
- Queue signal: SIG-20260904-004
- Primary implementation A: https://github.com/openai/codex/commit/0650d6d1ca451b67009b3969a82b87e76979975f
- Primary implementation B: https://github.com/google/adk-python/commit/cb0eb2288bfe6536bd6e98f0601d3736844062ca
- Evidence level: `merged_maintainer_change`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

When authentication or human approval interrupts a tool call, which evidence must survive the interruption, and which control state must prevent the agent runtime from autonomously replaying the call before a distinct authorization or resume event?

## Problem

A tool-call interruption is neither ordinary success nor ordinary failure. The runtime may need to preserve enough evidence for a human or client to recover, while also making sure that recovery does not silently turn into another execution attempt. This matters most for tools whose effects may be irreversible or whose idempotency is unknown.

Two independent maintainer changes on 2026-09-03 expose the same failure class at different boundaries. OpenAI Codex handles MCP authentication recovery after an HTTP authorization failure. Google ADK handles an MCP tool paused for human confirmation. In both cases, the implementation preserves the interruption as control evidence and deliberately prevents the normal model loop from treating it as a routine tool result that should immediately lead to another call.

## OpenAI Codex Mechanism

Codex commit `0650d6d1ca451b67009b3969a82b87e76979975f` changes the MCP HTTP path so that a `401 Unauthorized` carrying one or more `WWW-Authenticate` headers can become an MCP tool error with `mcp/www_authenticate` metadata. Multiple challenges are retained by collecting all matching response headers and combining their values.

The key recovery boundary is after the transport's automatic silent OAuth recovery path. If the service operation succeeds, Codex persists OAuth tokens and returns the tool result. If the operation still fails with an `AuthRequired` transport error, Codex converts that condition into a `CallToolResult::error` containing `Authentication required` plus the preserved challenge metadata. The source comment is explicit: the challenge is retained for interactive login **without replaying the rejected tool call**.

The added integration test mounts an MCP endpoint that expects exactly one rejected `tools/call`, emits two model turns, captures both `McpToolCallEnd` and completed tool-call items, and verifies the call is recorded as failed with the authentication challenge still attached. Additional tests distinguish the case where silent refresh succeeds from the case where it fails and the challenge must be surfaced.

This evidence supports a narrow execution claim: after Codex's built-in silent-refresh attempt is exhausted, the rejected call is represented as a terminal failed tool-call event carrying recovery metadata rather than being automatically retried by that recovery branch.

## Google ADK Mechanism

Google ADK commit `cb0eb2288bfe6536bd6e98f0601d3736844062ca` fixes a different recurrence path. `McpTool.run_async` can request confirmation when `tool_context.tool_confirmation` is absent and return a pause response. Before the fix, that response was left with normal summarization behavior. The surrounding flow treated it as an ordinary tool result, invoked the model again, and the model called the same tool again, producing a confirmation loop.

The fix sets `tool_context.actions.skip_summarization = True` on the no-confirmation pause path before returning the confirmation-required result. The accompanying tests cover both a constant `require_confirmation=True` configuration and a callable confirmation policy, asserting that a confirmation request is emitted and `skip_summarization` is set.

This is not merely a presentation optimization in this path. The maintainer message identifies summarization as the transition that re-enters the model loop; suppressing it preserves the paused call as a control boundary instead of converting the pause into another model decision opportunity.

## Common State-Machine Pattern

The two implementations operate at different layers but converge on one state-machine rule:

1. a tool call enters an interruption state;
2. evidence describing the interruption is preserved (`WWW-Authenticate` challenge or confirmation request/state);
3. the current invocation does not silently become a new tool execution attempt;
4. progress requires a later, distinguishable recovery event such as interactive authentication, explicit confirmation, or a new invocation.

The important separation is therefore **recovery evidence versus execution authority**. Evidence that explains how work may resume must not itself authorize replay of the interrupted action.

## Retry, Resume and Replay

The Codex path may perform a bounded silent refresh inside the same tool-call operation. That is a recovery attempt whose successful branch can complete the original operation. Once that path fails and Codex surfaces the challenge, however, the rejected tool call is not replayed automatically. A later authenticated call is a new execution opportunity and must be evaluated separately.

The ADK path is a pause-before-execution/continuation boundary: the tool asks for confirmation and the invocation is suspended. The fix prevents the model from treating the pause result as fresh reasoning input and issuing another call. A later confirmation response supplies the distinct control event needed to continue.

These two paths therefore should not be described with one vague word such as "retry." Silent refresh, human-confirmation resume, model reinvocation and a fresh tool call have different identities and authority conditions.

## Effect and Idempotency Boundary

Neither implementation establishes exactly-once execution for arbitrary tools. The Codex tests establish no automatic replay after the observed authentication rejection, but they do not prove that every remote server rejects before performing any side effect. HTTP or MCP failures can be ambiguous if an external effect commits before the client observes the error. A later user-initiated retry therefore still needs tool-specific idempotency, an operation key, a receipt, reconciliation, or compensation where effects matter.

The ADK fix prevents one model-driven reinvocation loop during confirmation. It does not establish distributed deduplication, durable external-effect identity, or compensation if a tool implementation performs work before it asks for or processes confirmation.

A governed runtime should consequently track at least three distinct facts: interruption/recovery evidence, authorization or resume evidence, and external-effect evidence. Conflating any two creates unsafe assumptions.

## Reproducible Engineering Evidence

Both sources are merged maintainer changes with inspectable code and targeted tests. Codex's patch includes transport handling, error-to-MCP-result conversion, multiple-header preservation and integration coverage that observes the agent event stream and call count. ADK's patch is smaller but directly tests the exact flag that prevents the confirmation pause from falling through to model summarization.

This is stronger than release-note evidence because the transition and tests are visible. It is still implementation evidence, not a production incident study or a cross-tool exactly-once benchmark.

## Limits and Unknowns

- The sources do not prove whether an arbitrary remote tool committed a side effect before an authentication or transport failure became visible.
- Codex's no-replay evidence is specific to the failed silent-refresh/auth-challenge branch; it does not prove all retry paths are replay-safe.
- ADK's fix prevents a confirmation loop caused by summarization; it does not prove every HITL resume path has durable occurrence identity across process restarts.
- Neither source establishes a universal idempotency-key protocol, effect ledger, compensation protocol or distributed transaction.
- Preserved recovery metadata is not equivalent to user authorization. A valid authentication challenge identifies a recovery requirement; it does not approve a tool's business effect.
- Human confirmation is an authorization signal only within the scope and principal semantics of the surrounding system; the patch itself does not authenticate the human approver.

## Unresolved Questions

1. What stable occurrence identity should bind the interrupted call, its recovery evidence and a later authorized resume?
2. When a client cannot determine whether a remote side effect committed, must the runtime enter an explicit `EffectUnknown` state rather than permitting ordinary retry?
3. Which tools must supply idempotency keys or effect receipts before a resumed call can be admitted?
4. How should authentication recovery and business authorization compose when both are required for the same call?
5. How should a resumed runtime distinguish continuation of a paused invocation from a new invocation that happens to use the same arguments?

## Reading Conclusion

The two maintainer changes support one bounded conclusion: interruption evidence must survive, while autonomous model/tool replay must be stopped until a distinct recovery or authorization event occurs. The evidence does **not** support a broader exactly-once claim. Analysis may treat recovery evidence, execution authority and external-effect evidence as separate state dimensions, and should preserve the distinction between bounded silent recovery, human-confirmation resume and a genuinely new tool invocation.
