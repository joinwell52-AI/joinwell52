---
date: "2026-09-04"
status: ReadyForProduction
production_input_authorized: true
queue_item: Q-20260904-03
column: open-source-engineering
article_type: comparative-study
project_relevance: none
source_reading: "research/reading/Q-20260904-03-interrupted-tool-call-replay-safety.md"
---

# Research Analysis — Recovery Evidence Must Not Become Replay Authority

## Research question

How should an agent runtime model an interrupted tool call so that authentication or human-approval evidence can survive and support recovery without silently authorizing a replay whose external effect may be unknown?

## Research themes and subject kind

- **Themes:** tool-call recovery; call-time authorization; idempotency; human-in-the-loop control; effect evidence
- **Subject kinds:** cross-sample-comparison; runtime-state-machine; failure-mode; engineering-insight
- **Samples:** OpenAI Codex commit 0650d6d; Google ADK commit cb0eb22

## Research value

### Failure

A runtime can accidentally collapse three different propositions into one: “we know why the call stopped,” “we are now allowed to continue,” and “repeating the call is safe.” Authentication challenges and confirmation pauses expose why that compression is dangerous. Recovery metadata may be perfectly valid while authorization is still absent; authorization may later become valid while the external effect of the first attempt remains unknown.

### Findings

Two independent maintainer implementations suppress different forms of autonomous replay. Codex preserves the MCP `WWW-Authenticate` challenge after bounded silent OAuth recovery fails and surfaces a failed tool-call result instead of automatically replaying the rejected call. Google ADK marks an MCP confirmation pause with `skip_summarization`, preventing the pause result from re-entering the model loop and causing the model to call the tool again.

The important convergence is not “both implement retry.” It is the opposite: both introduce a boundary that stops one execution epoch from silently turning into another. Codex places that boundary after an exhausted authentication-recovery path; ADK places it at a human-confirmation pause before the model loop can reinvoke the tool.

### Mechanism

An interrupted tool call should preserve three independent state dimensions:

1. **Recovery Evidence** — why execution stopped and what is needed to recover, such as an authentication challenge or confirmation request.
2. **Resume / Execution Authority** — the distinct event that permits work to continue, such as completed authentication, scoped human confirmation, or a newly admitted invocation.
3. **Effect Evidence** — what is known about whether the original external action committed, did not commit, or remains ambiguous.

A later recovery event may change the second dimension without resolving the third. Therefore the runtime should not derive replay safety from authentication success, confirmation success, or the mere existence of recovery metadata.

### Implication

For effectful tools, safe recovery needs an explicit **evidence-bearing pause** rather than an ordinary error/result transition. A paused or failed call should retain its occurrence identity and recovery evidence, and a later execution opportunity should be admitted only after both authority and effect-state rules are satisfied. Where the prior effect is unknown, the system needs idempotency keys, receipts, reconciliation or compensation rather than blind replay.

## Evidence claims

### E1 — public-fact

**Claim:** OpenAI Codex preserves one or more MCP authentication challenges when silent OAuth recovery fails and converts that condition into a failed tool-call result carrying `mcp/www_authenticate` metadata without automatically replaying the rejected tool call in that recovery branch.

**Source:** openai/codex commit `0650d6d1ca451b67009b3969a82b87e76979975f`.

**Strength:** states. **Independent:** false; direct implementation and test evidence for that revision.

### E2 — public-fact

**Claim:** Google ADK sets `tool_context.actions.skip_summarization = True` when an MCP tool pauses for confirmation, preventing the pause result from being summarized back into the model loop and triggering another tool invocation; targeted tests assert the flag for constant and callable confirmation policies.

**Source:** google/adk-python commit `cb0eb2288bfe6536bd6e98f0601d3736844062ca`.

**Strength:** states. **Independent:** false; direct implementation and test evidence for that revision.

### E3 — our-observation

**Claim:** The two implementations place replay-suppression barriers at different interruption boundaries but preserve the same higher-order invariant: interruption evidence survives while the current execution path loses the ability to autonomously create another effectful attempt.

**Source:** comparison of E1 and E2.

**Strength:** observed. **Independent:** false.

### E4 — our-interpretation

**Claim:** Governed agent runtimes should model Recovery Evidence, Resume/Execution Authority and Effect Evidence as separate state dimensions; none can safely be inferred from either of the other two.

**Source:** analytical inference from E1–E3 and their explicit effect/idempotency limits.

**Strength:** supports. **Independent:** false.

## Cross-sample comparison

| Boundary | OpenAI Codex | Google ADK | Remaining obligation |
|---|---|---|---|
| Interruption | Authentication failure after bounded silent recovery | Human confirmation required | Preserve stable occurrence identity |
| Evidence retained | `WWW-Authenticate` challenge in MCP metadata | Confirmation request / pause state | Make evidence durable across resume/restart where required |
| Replay suppression | Do not automatically replay rejected call after failed refresh | Do not summarize pause back into model loop | Cover every other retry/recovery path explicitly |
| Resume trigger | Later interactive authentication / new call | Later confirmation response / continuation | Bind trigger to principal, scope and occurrence |
| External effect certainty | Not established by the patch | Not established by the patch | Idempotency, receipt, reconciliation or compensation |

## Counterarguments and boundaries

Preventing autonomous replay can reduce liveness: a system may require another user or client action even when the original operation was harmless. But liveness and replay safety are different objectives. Automatic retry is reasonable only when the runtime has an explicit contract that the operation is replay-safe or when the original attempt is known not to have crossed the effect boundary.

The evidence also does not justify saying that every authentication failure or confirmation pause is an `EffectUnknown` condition. Some protocols may establish that the request was rejected before business execution, and some tools are naturally idempotent. The engineering requirement is to represent effect certainty explicitly rather than infer it from a generic error class.

Human confirmation likewise should not be overstated. The ADK patch proves a control-flow fix for the pause/reinvocation loop; it does not establish who the approver is, what scope the approval covers, or whether the approval remains valid after arguments, credentials or target state change.

## Bounded research judgment

The strongest reusable conclusion is: **recovery evidence is not replay authority**. Authentication challenges and confirmation requests should move a call into an evidence-bearing interruption state, not into an implicit retry loop. A subsequent authenticated or approved state may restore execution authority, but replay of an effectful operation is safe only when the prior effect is independently known, idempotently keyed, reconciled or compensable.

This is a narrower and more defensible claim than exactly-once execution. The two maintainer changes demonstrate bounded replay suppression in their respective paths; they do not establish a universal effect ledger, distributed transaction or exactly-once guarantee.

## General implications

- Give every effectful tool-call occurrence a stable identity that survives pause and recovery.
- Persist recovery metadata separately from approval or authentication evidence.
- Treat a later confirmation/authentication event as an authority transition, not proof that replay is harmless.
- Introduce an explicit `EffectUnknown` or equivalent state when the remote commit outcome cannot be proven.
- Require idempotency keys, effect receipts, reconciliation or compensation for high-impact retries.
- Distinguish continuation of the same paused occurrence from a genuinely new invocation, even when arguments are identical.
- Test the negative path: the model/runtime must not autonomously reinvoke a paused or rejected tool after control evidence is emitted.

## Limitations and open questions

The evidence consists of two merged implementation changes and targeted tests, not an independent production study. Codex's no-replay evidence is specific to the failed silent-refresh/auth-challenge branch; ADK's evidence is specific to the confirmation-pause summarization path. Neither proves cross-process durable resume identity or exactly-once external effects.

Open questions include which MCP/tool contracts can prove pre-effect rejection, how a runtime should expose `EffectUnknown` without creating permanent deadlock, what receipt schema should bind effect identity to an occurrence, and how approval freshness should be re-evaluated if credentials, target resource or tool arguments change before resume.

## Editorial recommendation

- **Article type:** comparative-study
- **Selected modules:** research-question; evidence; comparison; engineering-implications; counterarguments; limitations; open-questions
- **Ending module:** open-questions
- **Project relevance:** none
