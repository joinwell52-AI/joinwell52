---
title: "A Resume Needs More Than a Checkpoint"
date: '2026-08-30'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "嵌套人工确认恢复时，什么身份才能把响应绑定到仍具权威的调用帧？"
summary: "A merged Google ADK Python change shows that nested HITL recovery needs more than restored state: it must identify the workflow frame, call occurrence, and branch, then explicitly decide whether to continue, pause, or replay. Event identity cannot replace responder authorization or external-effect evidence."
sources:
  - research/analysis/Q-20260830-01-continuation-authority-compound-identity.md
item_id: "Q-20260830-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-30-resume-needs-more-than-a-checkpoint-cover-v2.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-30-resume-needs-more-than-a-checkpoint-cover-v2.png"
  kicker="Digital Employee · Daily Research"
  title="A Resume Needs More Than a Checkpoint"
  summary="A merged Google ADK Python change shows that nested HITL recovery needs more than restored state: it must identify the workflow frame, call occurrence, and branch, then explicitly decide whether to continue, pause, or replay. Event identity cannot replace responder authorization or external-effect evidence."
  version="Q-20260830-01"
  status="Daily Runtime V5 · 2026-08-30"
  languageHref="/zh/digital-employee/2026-08-30-resume-needs-more-than-a-checkpoint"
  languageLabel="中文"
/>

# A Resume Needs More Than a Checkpoint

A nested tool paused in an earlier turn for human confirmation. Text events, parallel calls, and other branches followed. When the answer finally arrives, which occurrence owns it? Is the original frame still authoritative? Could the tool already have produced an external effect? Restoring the latest state does not answer those questions.

A merged Google ADK Python change demonstrates a stricter continuation mechanism. Instead of looking only at the last one or two events, it searches historical pauses. It uses whole run-id components, not substrings, to decide which branch belongs to which call. It then makes an explicit CONTINUE, PAUSE, or REPLAY_CALLS decision from call, response, and branch evidence.

The central proposition is: **safe continuation needs a compound authority identity binding the workflow frame, call occurrence, branch identity, responder evidence, and known effect state. Event matching resolves history ambiguity; it does not authenticate the responder or prove exactly-once effects.**

## A Checkpoint Restores State, Not Occurrence Identity

A conventional checkpoint answers “what state was saved?” Human confirmation, however, addresses a particular call occurrence. The same tool may appear several times or run in parallel, and nested agents create new branches.

A fixed two-event lookback can lose an older pause behind later text. Substring matching can bind a short run id to a different id that merely contains it. The runtime may then deliver approval to the wrong call, replay completed work, or keep waiting for a response it already received.

Compound identity separates the concerns. A checkpoint supplies data continuity. The call occurrence identifies the action instance. The branch identifies the execution path that produced the response. Together, they determine whether the response is eligible for consumption.

## Explicit Continuation Decisions Beat Implicit Guessing

The demonstrated implementation represents continuation as three typed outcomes. CONTINUE means the available evidence permits the next step. PAUSE means calls remain unresolved. REPLAY_CALLS must carry the specific event to reissue; a replay decision without that event is an error.

Historical evaluation includes long-running tools and parallel calls. A response may match an exact id. When it lacks an id, name and branch relationship constrain the match. Unrelated branches and agent-authored events are not casually promoted into human answers.

The result is not merely “an answer was found.” It is an auditable reason for continuation: which occurrence, branch, and response produced which decision.

## Responder and Effect Evidence Remain Separate Gates

Branch ownership shows that a response appeared on the intended path. It does not establish who supplied it or whether that principal remains authorized for a security-sensitive action. Principal identity, approval scope, and validity need independent evidence.

Replay has another boundary. Fresh event ids prevent old and new events from sharing identity, but they cannot prove that the earlier call produced no external side effect. For payment, deletion, or publication, event history may say “no completion receipt” while the real world has already changed.

Before replay, the runtime therefore needs effect-state qualification: a tool-level idempotency key, an external receipt, a queryable result identity, or evidence that the earlier effect did not occur. Without it, Blocked or human handoff may be more truthful than automatic replay.

## A Continuation Receipt Needs Five Facts

A governed runtime can make five identities explicit: the current workflow frame, target call occurrence, owning branch, responder and authorization evidence, and known external-effect state. It should also record whether the frame was cancelled, abandoned, or superseded.

That makes late answers governable. Even a response that perfectly matches an old branch cannot regain execution authority after its frame is revoked. Re-admission requires a new decision, not revival of the old approval.

## Evidence Boundary

The evidence is one merged implementation and its maintainer tests. Coverage includes long-running calls, unrelated branches, parallel calls, id-less name matching, and nested replay, plus an end-to-end scenario that was previously skipped. It supports the demonstrated continuation path, not independent validation of all HITL systems.

The precise engineering conclusion is: **checkpoints restore data; compound continuation identity restores the right occurrence. Responder authority and external effects still require separate proof.**

**Primary evidence:** [merged Google ADK Python commit 6d145180](https://github.com/google/adk-python/commit/6d145180611956b2065704189517fd6a0ff1a063).
