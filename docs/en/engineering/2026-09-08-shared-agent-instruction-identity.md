---
schema: "publication-candidate-article/v2"
title: "Same Agent, Different Person: Whose Permissions Should the Next Action Use?"
date: "2026-09-08"
published_date: "2026-09-08"
column: "open-source-engineering"
category: "daily"
article_type: "comparative-engineering-analysis"
edition: "research-center"
research_question: "Same Agent, Different Person: Whose Permissions Should the Next Action Use?"
summary: "A shared agent's execution identity, instruction reference, responsible person and operation authority are different layers. Existing actor checks held in our probes, while a narrower continuation-to-session projection gap emerged."
cover: "/assets/principal-receipt-20260908/01-shared-identity-cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded research complete; public record checks; not independent QA; no development authorized"
source_commit: "c008d9db91a21136fc61a4f60314e22db395d5d2"
pageClass: "principal-receipt-article"
sources:
  - "https://github.com/paperclipai/paperclip/pull/13005"
---

<ArticleCover image="/assets/principal-receipt-20260908/01-shared-identity-cover-v1.png" kicker="Open-source engineering · Controlled research" title="Same Agent, Different Person: Whose Permissions Should the Next Action Use?" summary="A shared agent's execution identity, instruction reference, responsible person and operation authority are different layers. Existing actor checks held in our probes, while a narrower continuation-to-session projection gap emerged." version="2026-09-08" languageHref="/zh/engineering/2026-09-08-shared-agent-instruction-identity" languageLabel="简体中文" />

<ArticleTableScroll language="en" />

<style>.principal-receipt-article .vp-doc h1[id] { display: none; }</style>

[Full-resolution cover](https://joinwell52-ai.github.io/joinwell52/assets/principal-receipt-20260908/01-shared-identity-cover-v1.png)

# Same Agent, Different Person: Whose Permissions Should the Next Action Use?

A digital employee handles code for Alice, then accepts a new instruction from Bob. The conversation continues, the task is unchanged, and the same agent does the work.

Whose permissions should it use for its next repository operation?

This is an illustrative situation, not an account incident we discovered. It sounds like switching a login, but it involves another timeline: Alice's action might already have started, Bob's instruction has just been accepted, and previously queued work may still belong to Alice.

Always following the latest speaker could reassign an older instruction to the wrong person. Always retaining the credentials from agent startup could let a new instruction continue using the previous person's access.

**A session can continue without making responsibility and authority automatically continuous.**

## 1. Paperclip changes operation-time identity, not just chat identity

Paperclip is an open-source application for organizing and managing AI agent work. Its concrete problem is that several people can instruct the same agent on the same task. The task assignee is not necessarily the person responsible for the instruction behind the current action.

A change merged on September 7, 2026 separates task ownership from execution identity and selects credentials when a managed GitHub operation begins. An action that has already started retains its captured identity. A retry without a new instruction must not switch identity merely because someone spoke later. The author reports switching tests involving two users and two GitHub accounts; we did not rerun those account tests. [Paperclip #13005](https://github.com/paperclipai/paperclip/pull/13005)

The boundary matters: this concerns credential selection for managed operations. It does not promise isolation from arbitrary code deliberately copying credentials within the same execution principal. [Risk statement](https://github.com/paperclipai/paperclip/pull/13005)

What is worth learning first is not the component count, but the separation of four questions:

| Question | Identity or evidence needed |
| --- | --- |
| Who executes the work? | The agent's execution identity |
| Which instruction caused this action? | A reference to the accepted instruction |
| Who is responsible for that instruction? | An authenticated, policy-resolved person |
| What access may this action actually use? | Credentials and authority checked at the action boundary |

These can be connected, but similar names do not make them interchangeable. A developer role describes a responsibility, not which colleague issued an instruction. A message originating from Alice does not automatically establish Alice's authority to request its contents.

## 2. Does our own system actually have the same problem?

CodeFlowMu is our locally running multi-agent collaboration system. FCoP task, report and review records organize its work. The runtime handles sessions and technical execution without replacing management roles' business decisions.

It would be easy to see an external project's shared-identity feature and announce that we need the same feature. That skips the important question: what does our own evidence establish?

We inspected selected local records on September 8. The records themselves were from September 5, not new incidents that day.

| Selected data | Actual unit | What it tells us |
| --- | --- | --- |
| Operation approvals | 1 approval record | The deciding role was ADMIN; this cannot estimate authenticated-person coverage |
| Task-command receipts | 10 rows for 5 idempotency keys | Each key has processing and completed events; these are not 10 independent tasks |
| Skill invocations | 25 rows and 25 invocation IDs | 9 have nonempty session IDs; the remainder must be distinguished from legitimate sessionless work before judging them |

No malformed rows appeared in this selection. Several explicitly named human-identity, instruction-responsibility and credential-grant fields were absent, but this describes the selected fields and records only. Other modules may hold equivalent information.

The history therefore does not support a claim that cross-person credential misuse occurred. Its useful message is narrower: **records describing operations, commands, roles and invocations cannot simply be read as an authenticated human responsibility chain.**

The next question is not where to add a person's name, but whose identity the current request already binds.

## 3. A different agent does not automatically inherit an old approval

We called the actual operation approval service and saved its real record format. After approval checks pass, the service invokes a function to do the work: the execution callback. In this experiment, that function only counted calls instead of performing an operation. No repository was connected.

A request digest is an operation-identity check: changing protected request contents should prevent an old approval from being used as though the request were unchanged.

| Control | Observation | Supported interpretation |
| --- | --- | --- |
| Check and execute the original request | 1 callback | The basic allowed path works |
| Change only the subject from one agent to another | Digest changes; `APPROVAL_STALE`; 0 callbacks | An old approval cannot directly be used for another request subject |
| Change only the session ID | Same digest; 1 callback | This digest excludes session identity; this does not authorize an entire takeover workflow |
| Reuse a task-command key but change its submitting actor | `idempotency_key_conflict`; no second callback | The command layer also checks actor differences |

The second round also called the real operation-policy builder instead of constructing the request entirely in research code. It derived `subject.actor` from `agentId`. Changing the agent changed the digest of the actual constructed request.

The protection exists. It answers which agent submitted the operation, not which authenticated human is responsible for it. Those questions need a connection; one field does not inherently answer both.

## 4. The reproduced gap is much narrower than an incomplete identity system

To decide whose permissions an action should use, we first need to know which instruction caused it. We therefore checked a more basic question: **can the original instruction reference be followed all the way into the execution session?** This is one part of responsibility tracing, not a test of human authorization.

Following the chat-continuation path revealed a placement difference. The message identifier reached the command, but **it was saved when supplied at the outer level and absent from its session field when supplied inside continuation information.**

Specifically, the continuation command retained a chat reference and placed the triggering message identifier, `trigger_chat_id`, in continuation context. The dispatcher passed that nested context to the session manager. When persisting the triggering-message field, however, the session manager read only the top level.

This is a simplified field-location illustration, not an additional experiment:

```text
context.trigger_chat_id
    -> session.runtime_trigger_chat_id is saved

context.continuation.trigger_chat_id
    -> corresponding session field is not saved
```

We placed the same source field at each location and called the actual session manager with an in-memory execution adapter instead of a real model.

| Input placement | Triggering message saved in session? | Logical execution ID also supplied: saved? |
| --- | --- | --- |
| Top-level context | Yes | Yes |
| Nested continuation context | No | Yes |

![J1/J2 field projection: the nested triggering-message reference is absent, while both logical execution IDs are saved.](/assets/principal-receipt-20260908/01-source-projection.en.svg)

*Figure 1. J1/J2. Absence concerns one session field, not the loss of all chat or command provenance. Source: [formal first-party observations and boundaries](/en/research/evidence/2026-09-08-principal-receipt).*

[Open full-size figure](https://joinwell52-ai.github.io/joinwell52/assets/principal-receipt-20260908/01-source-projection.en.svg)

The entire session record had not failed to save: the logical execution ID supplied in the same call was persisted. The missing item was the triggering message ID. The code matches the observation: it searches both locations for the logical execution ID, but only the top level for the triggering message.

A separate isolated scenario started through the actual dispatcher also lacked the corresponding triggering-message field in its session record. The four identity probes produced consistent results in two formal runs.

The confirmed gap is therefore specific: **source information reached the command, but was not projected through the designated session field.**

This relates to Paperclip's question without being the same problem. Chat and command evidence still retain references, so history has not disappeared. A message ID is not a human credential, so repairing this projection would not complete multi-person authorization.

Its practical value is that a query depending on this session field might see no source reference without knowing that the previous layer received one. That hop deserves an explanation before building a chain from an operation back to its instruction.

## 5. Where should the research lead, rather than what should be built immediately?

This research does not call for immediately rebuilding an identity platform. Retain existing agent-subject binding; review the source-reference handoff contract now; establish a separate requirement and authority boundary before adding shared credentials.

The triggering-message projection difference is a narrow engineering-review topic: who supplies it, which entrances use nested context, how conflicting top-level and nested values should be handled, and which queries actually depend on the field. Those need a clear read/write contract, not an identity platform inferred from one missing value.

Shared credentials need an actual product requirement first. If different people must direct the same digital employee over time, further questions include when instructions are accepted, how responsibility is authenticated, when an old action fixes its identity, how a new action selects authority, and what the underlying platform already supplies. This experiment neither implemented nor accepted that complete chain.

A useful check for agent-product teams is to select one real action and trace backward through its credential, authority, responsible person and original instruction. At the first hop that can only answer “probably this person,” clarify the evidence for that hop.

**Remembering who said what is not the same as knowing whose permissions each action may use. Session continuity keeps work connected; responsibility continuity keeps actions attributable.**

## Research and evidence boundaries

The first-party experiments used fixed source commit `c008d9db91a21136fc61a4f60314e22db395d5d2` on Windows with Node v24.16.0. Approval tests used counting callbacks; session tests used an in-memory SDK, not real model tools. Task lookup and governance dependencies of the chat-command builder were synthetic. We did not test authentication or credential switching between two human accounts. These are bounded source and probe observations, not platform-wide security assurance or independent QA.

[English evidence guide](/en/research/evidence/2026-09-08-principal-receipt) · [Chinese guide](/zh/research/evidence/2026-09-08-principal-receipt). The public bundle contains sanitized observations, source hashes, aggregate historical counts and a record checker. It checks saved evidence, not a fresh product execution; original operational records and full product replay remain access-restricted. The historical sample did not contain the hypothetical multi-person credential incident. No product change or development authorization resulted from this research.
