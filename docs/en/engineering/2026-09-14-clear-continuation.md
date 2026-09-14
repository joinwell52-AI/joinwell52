---
schema: "publication-candidate-article/v2"
title: "Why Can an Empty History Still Reference an Old Conversation?"
date: "2026-09-14"
published_date: "2026-09-14"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "Why Can an Empty History Still Reference an Old Conversation?"
summary: "The history is empty, but the program may still hold a bookmark to the old conversation. An experiment between deletion and acknowledgement follows what happens next."
cover: "/assets/continuity-20260914/clear-continuation.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded experiments on pinned sources; no live cloud validation"
pageClass: "continuity-contracts-article"
---

<ArticleCover image="/assets/continuity-20260914/clear-continuation.cover-v1.png" kicker="Open-source engineering · Experiments" title="Why Can an Empty History Still Reference an Old Conversation?" summary="The history is empty, but the program may still hold a bookmark to the old conversation. An experiment between deletion and acknowledgement follows what happens next." version="2026-09-14" languageHref="/zh/engineering/2026-09-14-clear-continuation" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.continuity-contracts-article .vp-doc h1[id] { display: none; }</style>

# Why Can an Empty History Still Reference an Old Conversation?

You clear a session, and its history becomes empty. That feels like a fresh start.

Yet when the program prepares its next operation, it may still pick up an old identifier and continue along the previous conversation.

The problem sits outside the history list. In the OpenAI Agents SDK—a toolkit for building AI assistants—we studied session-management code that cleared history but left references that later operations could still read. This is a story about those references, not evidence of an AI “secretly remembering.”

To understand it, first consider what a conversation leaves behind besides its text.

## The content is gone; the bookmark remains

A program does not always have to resend every item to continue a conversation. It can also use a response identifier to continue along an existing response chain.

Think of that identifier as a bookmark held by the program. The history list holds conversation content; the bookmark tells a later operation where to reconnect. Clearing a list does not automatically update every place holding a bookmark.

In the code we tested, that later operation was context compaction: preparing a shorter representation of a long conversation for subsequent use. The session component could provide current content or continue from an old response ID. As long as it could still select that ID, an empty list did not establish that the old connection was severed.

[Candidate fix #5000](https://github.com/openai/openai-agents-python/pull/5000) addresses two omissions: the current response ID and the most recent response ID not yet stored in history. These are references that guide continuation, not two additional copies of the entire conversation.

Clearing them along with the history sounds straightforward. But what should happen when clearing fails?

## The difficult moment: deleted, but not acknowledged

Deletion becoming effective and the caller receiving confirmation can happen at different moments.

We tested two cases: the local database commits deletion, then the operation is cancelled before returning; or deletion commits, then its acknowledgement raises an error.

The caller sees failure, but the database history really is empty. If the program interprets failure as “nothing happened” and retains the old IDs, content and references diverge.

To expose that gap, the tests used a real temporary SQLite database—a database that can store data in a local file. They paused after the deletion commit but before the operation returned, then injected cancellation or an error. We checked more than empty history: whether later operations could reuse the old reference, whether the lock was released, and whether new content could still be written.

## Put the old method back, and the problem returns

We pinned the complete SDK and original upstream tests, ran the candidate, then replaced only its clear method with the predecessor's implementation. Keeping the rest unchanged helps isolate the effect of clearing itself.

The five checks produced these results:

| Question under test | Old clear method | Candidate fix |
| --- | --- | --- |
| Does normal clearing invalidate the old response reference? | Fails | Passes |
| Is the old reference invalidated after cancellation following deletion commit? | Fails | Passes |
| Is it invalidated when acknowledgement raises after deletion commit? | Fails | Passes |
| Does automatic compaction use current input after clearing? | Fails | Passes |
| Does clearing wait for in-flight compaction and leave empty history? | Passes | Passes |

The old method failed four checks and passed one; the candidate passed all five. The last row was an existing concurrency check. It helps rule out an overly broad explanation: this was not simply an implementation with no concurrency protection.

![Cleared history and invalidated continuation references](/assets/continuity-20260914/clear-continuation.figure.en.png)

*Figure 1. Empty history and invalidated references require separate checks. Source: this study's runs/sdk.json and original test logs; database commits were real local operations, while the remote compact endpoint was a test double.*

That observation boundary matters. We inspected how the local component prepared subsequent requests without contacting the real OpenAI service. The experiment shows that an old reference path remained available, not that a remote server recovered deleted data.

## Another protection does not automatically fix an omission

The SDK already had a lock to coordinate concurrent operations and an internal generation counter to track state changes. Each has a purpose. Neither automatically clears every stored response ID.

The fix did not introduce another generation mechanism. It invalidated the two omitted response references in both successful and exceptional cleanup paths.

That suggests a useful way to investigate clearing: work backward from the next operation. Where does it get its content, identifiers, or deferred work? What remains in each location after normal clearing, cancellation, and failed acknowledgement?

For developers, those questions follow the actual use of the system more closely than an assertion that history contains zero rows. For users, they explain why an empty interface alone cannot reveal everything the system will use next.

<details>
<summary>Further reading: the right conversation, but the wrong task?</summary>

[Paperclip #13345](https://github.com/paperclipai/paperclip/pull/13345) addresses a different mismatch. Paperclip organizes AI assistants performing tasks. Here, a session resumed but its invocation omitted an updated task description, allowing an old comment to become the objective again.

We checked seven before/after inputs to the original task-brief selector. With normalized wake inputs, two ordinary-resume cases changed from selecting only a short task identifier to including the current full brief. Fresh-task, assignment, recovery, and other controls retained their respective behavior. This covered the selector and helpers, not database objective selection or a real resumed AI session.

The required actions differ: one must sever an old connection; the other must deliver new instructions into a conversation that remains valid. Both suggest following the next call to inspect what it actually receives.

</details>

An acceptance check after clearing can go one step further: **where will the next operation start?** Following that question reveals relationships an empty history list cannot show. It is a research lesson from these experiments; it has not established a corresponding CodeFlowMu defect or initiated development.

**Scope and reproduction.** The fix was still open when read for this study. These results concern pinned candidate source, not every released version. Remote calls were mocked; SQLite deletion commits happened locally. Cross-process restarts, remote erasure, and general authorization revocation were not tested. The five SDK comparisons, seven Paperclip inputs, fixed versions, and failing logs are in the [evidence package](../research/evidence/2026-09-14-continuity-contracts), maintained in the [research repository](https://github.com/joinwell52-AI/joinwell52).
