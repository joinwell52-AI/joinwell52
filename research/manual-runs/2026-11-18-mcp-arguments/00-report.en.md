# 2026-11-18 — MCP prompt arguments and session-state boundary

## Question and provenance

Could an MCP server obtain session values merely by declaring prompt argument names? The starting point is [Google ADK Python commit `889ddd3`](https://github.com/google/adk-python/commit/889ddd3134df1dd1a626205ee78811950dec2a5c), compared with parent `13b6ae8`. The upstream change is a breaking security correction to `McpInstructionProvider`; it is not evidence of a production breach. We then checked whether the corresponding implicit lookup exists in CodeFlowMu V3.0.152 at local commit `0d2d4e7`.

## Controlled replay

We extracted the unchanged `McpInstructionProvider` class AST from each pinned Git blob and supplied a fake MCP session and synthetic context. The fake server declared `user:email` and `adk_oauth2_credential`; the context held `person@example.test` and `SYNTHETIC-CREDENTIAL-NOT-A-REAL-SECRET`. No real credential, model, MCP network service, or external side effect was used.

| Case | `list_prompts` calls | Arguments observed by fake `get_prompt` |
| --- | ---: | --- |
| Parent, default | 1 | Both synthetic session values |
| Fixed commit, default | 0 | `None` |
| Fixed commit, explicit static mapping | 0 | `{"locale":"zh-CN"}` |
| Fixed commit, explicit callable | 0 | `{"locale":"zh-CN"}` |
| Fixed commit, caller explicitly selects synthetic credential | 0 | `{"credential":"SYNTHETIC-CREDENTIAL-NOT-A-REAL-SECRET"}` |

All 6 assertions passed. The last row matters: the fix removes *implicit server-selected lookup*; it does not make every explicit caller choice safe.

## Local product comparison

We invoked the real `CodexMcpToolBridge.ts` from CodeFlowMu V3.0.152 with a fake app-server request handler. The fake external tool advertised an `adk_oauth2_credential` property. Discovery called no tool. A call with `{}` forwarded `{}`; a call with only `locale` forwarded only `locale`; an explicitly supplied synthetic credential was forwarded. An extra top-level `session_state` field and an attempt to route an external call to `fcop` were rejected. All 7 assertions passed. This checks the bridge boundary only; it does not check what a model may choose to put into explicit arguments or what the real app server does afterward.

We separately invoked the actual `SourceCapabilityEnvironment.ts` helper: no configured token produced no token, while a configured synthetic `API_TOKEN` was forwarded; 3 assertions passed. Source adapter code forwards `args.arguments` to the MCP SDK, but its live transport was not exercised. The existing Codex bridge test could not import because this local WB3 installation lacks `@cursor/sdk`; no test assertions ran in that attempt.

## Reproduction and limits

Fetch the two upstream revisions into a Git checkout, set `ADK_REPO` to that checkout, and run [`replay-adk.py`](./replay-adk.py). The script extracts the pinned class from Git blobs and checks the six assertions above. For local comparison inspect `packages/codeflowmu-runtime/src/session/CodexMcpToolBridge.ts`, `src/source/SourceCapabilityTools.ts`, and `src/source/SourceCapabilityEnvironment.ts` at the specified CodeFlowMu revision. The controlled fixtures use a fake session and fake app-server, so their results cannot be generalized to full ADK, live MCP, model behavior, or end-to-end CodeFlowMu execution. The observed result is **no corresponding implicit session-state lookup in the tested CodeFlowMu bridge**. We have not confirmed a CodeFlowMu defect and do not recommend a product change from this round.

## Classification

Today's published intelligence page contains 35 observations. O1 was selected for this bounded experiment and article because it directly tests the boundary between a server's schema and a client's session authority. Recovery items O2–O9, delegation O10 and O33, and governance/protocol observations remain reading and follow-up candidates; reading them is not counted as an experiment. One experimental topic, one bilingual article pair, zero formal development review items, and zero development tasks result from this round.

## Research exchange

After publication, we [commented on the exact ADK commit](https://github.com/google/adk-python/commit/889ddd3134df1dd1a626205ee78811950dec2a5c#commitcomment-210597541) with the bounded replay result and one migration question about missing required prompt arguments. The repository was already starred and that state was verified. At the time of this report update, no reply had been observed; a posted comment is not evidence of agreement. Draft text, receipts, and the reply ledger remain local, outside this public repository.
