---
schema: publication-candidate-article/v2
title: "Recovery Evidence Is Not Replay Authority"
date: '2026-09-04'
column: open-source-engineering
category: daily
article_type: comparative-study
edition: research-center
research_question: "当认证或人工批准中断工具调用时，智能体运行时应如何保存恢复证据，同时阻止在外部影响仍不确定时静默重放？"
summary: "OpenAI Codex and Google ADK suppress tool-call replay at different interruption boundaries. Their shared lesson is that recovery evidence, authority to continue, and evidence of external effects must remain separate: successful authentication or approval does not by itself make replay safe."
cover: staging/publication-candidates/2026-09-04-recovery-evidence-is-not-replay-authority-cover.png
sources:
  - research/analysis/Q-20260904-03-recovery-evidence-replay-authority.md
---

![Recovery Evidence Is Not Replay Authority cover](staging/publication-candidates/2026-09-04-recovery-evidence-is-not-replay-authority-cover.png)

# Recovery Evidence Is Not Replay Authority

A tool call stops after an authentication failure. The runtime preserves the challenge, and the user later completes authentication. The system now knows how to recover and again has authority to continue. It may still not know whether the first request produced an effect at the remote service. If those first two facts are treated as proof that replay is safe, an apparently successful recovery can send a second message, create another resource, or submit a duplicate payment.

Two maintainer fixes in OpenAI Codex and Google ADK expose the same failure class at different boundaries. Each preserves information needed for recovery while preventing the current execution path from autonomously creating another effectful attempt.

The bounded proposition is: **an interrupted tool call should preserve recovery evidence, execution authority, and effect evidence as separate state dimensions. A later authentication or approval event may restore authority, but it must not silently authorize replay while the prior external effect remains unknown.**

## Two Fixes Guard Different Interruption Boundaries

The Codex change sits in an MCP authentication-recovery path. After bounded silent OAuth recovery fails, Codex preserves one or more \`WWW-Authenticate\` challenges and turns the interruption into a failed tool-call result carrying authentication metadata. That branch does not automatically issue the rejected call again. Its integration coverage observes the agent event stream and constrains the rejected call to one occurrence.

The Google ADK change sits at a human-confirmation boundary. When an MCP tool requires confirmation, ADK sets \`tool_context.actions.skip_summarization = True\`. This prevents the pause result from being summarized back into the model loop and inducing another tool invocation. Targeted tests cover both constant and callable confirmation policies.

The implementations are not equivalent. Codex acts after bounded authentication recovery has failed; ADK acts while a human decision is still pending. What they jointly support is narrower: interruption evidence can survive while the current execution path loses autonomous replay capability.

## Recovery Information Does Not Grant Execution Authority

Recovery evidence answers why execution stopped and what is needed next. An authentication challenge requests credentials or interaction. A confirmation request asks a person to decide. Both are valuable inputs to recovery, but neither contains the authorization decision it calls for.

If a runtime treats the challenge, form, or error object as implicit permission, diagnostic data silently rewrites the control boundary. A safer model places the call in an evidence-bearing interruption state. It retains a stable occurrence identity, an input digest, recovery requirements, and the reason for suspension, while explicitly removing the current path's ability to create another external effect.

A later event should change authority separately. Completed authentication, approval of scoped arguments, or a newly admitted execution opportunity may restore permission to proceed. None of these events proves that replaying the first attempt is harmless.

## Renewed Authority Does Not Resolve the First Effect

Authentication can show that current credentials are usable. Human approval can show that a principal accepts an operation within some scope. Neither event automatically establishes what the remote system did before the interruption became visible.

Some protocols can establish that a request was rejected before business execution. Some tools are naturally idempotent. Other systems expose stable request keys and queryable receipts. In those cases, retry may be reasonable. By contrast, after a timeout, broken connection, or ambiguous error, the external effect may remain unknown.

Replay admission therefore needs two answers: whether the runtime currently has authority, and whether the prior effect is known not to have occurred, can be deduplicated safely, can be reconciled, or can be compensated. Without the second answer, the system should query remote state, request a human decision that explicitly accepts the ambiguity, or enter compensation. It should not translate new authority directly into a new call.

## One Occurrence, Three Independent Evidence Dimensions

A governed runtime can preserve three kinds of state under a stable tool-call occurrence identity:

1. **Recovery evidence:** the challenge, confirmation request, failure position, and conditions required to recover.
2. **Execution authority:** the current principal, applicable policy, approval scope, credential state, and freshness.
3. **Effect evidence:** whether the request was not sent, rejected, committed, outcome unknown, reconciled, or compensated.

The common identity makes the records auditable and correlatable. Their independent transitions prevent unsafe inference. A new approval may update authority without changing an old effect. A remote receipt may clarify the effect while leaving an expired approval invalid.

A resumed execution should receive a new epoch identity while retaining links to the original occurrence, recovery event, and admission decision. That preserves continuity without compressing separate attempts into an unauditable history.

## Replay Safety Should Not Become Blanket Blocking

Suppressing automatic replay reduces liveness. Requiring human intervention for side-effect-free reads, explicitly idempotent writes, or requests proven to have been rejected before business execution would be unnecessary.

The operative rule is not that every failure forbids retry. It is that retry justification must come from an explicit contract. A tool can declare replay safety, a request can carry a stable idempotency key, a service can expose effect queries, or policy can allow bounded automatic retry for low-risk operations. The runtime should record which justification it used, not merely that the last attempt returned an error.

Negative-path tests matter as much as successful recovery tests. After recovery metadata appears, the model must not invoke the tool again by itself. A confirmation pause must not loop back into invocation. After authentication succeeds, an unknown prior effect must not bypass reconciliation. If arguments, credentials, or target state change, earlier approval must be evaluated again.

## Evidence Boundary and Open Questions

The public primary facts come from the two projects' own maintainer commits and tests. They establish control-flow changes in those revisions, not independent production validation. The three-dimension state model in this article is our interpretation of the shared invariant and remains untested as a cross-system protocol.

The available evidence does not establish exactly-once external effects, distributed deduplication, approver identity, approval scope, or proof that a remote side effect never committed before the client observed failure. “Suppress autonomous replay in the current path” is a more accurate conclusion than a claim of complete transactional safety.

Open questions remain: which tool protocols can prove pre-effect rejection; how an external-effect receipt should bind to one call occurrence; when changes to arguments, credentials, or target state make approval stale; and how a runtime can represent unknown effects without causing permanent deadlock.

Recovery evidence tells a runtime how it might continue. Replay authority must answer another question: would continuation repeat something that already happened in the real world but has not yet been confirmed locally?

**Primary sources:**

- [OpenAI Codex maintainer commit: preserve authentication challenges and stop automatic replay](https://github.com/openai/codex/commit/0650d6d1ca451b67009b3969a82b87e76979975f)
- [Google ADK maintainer commit: keep confirmation pause out of the model loop](https://github.com/google/adk-python/commit/cb0eb2288bfe6536bd6e98f0601d3736844062ca)
