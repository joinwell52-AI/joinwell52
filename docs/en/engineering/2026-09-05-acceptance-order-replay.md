---
schema: publication-candidate-article/v2
title: "Both Instructions Were Saved. Why Did Recovery Reverse Their Meaning?"
date: "2026-09-05"
published_date: "2026-09-06"
column: open-source-engineering
category: daily
article_type: research-methodology
edition: research-center
summary: "Order is part of context. With no input missing, replay can still reverse a decision when persistence order differs from acceptance order. Inspired by a Codex change, seven controlled scenarios separate receipt, acceptance, storage, recovery, and authority—not establish a real CodeFlowMu conversation-ordering defect."
cover: "/assets/read-effects-order-20260905/assets/acceptance-order-cover-v1.png"
language: en
lifecycle: Published
publication_authorized: true
evidence_status: "Controlled replay study complete; CodeFlowMu Host ordering defect not established"
pageClass: read-effects-article
---

<ArticleCover image="/assets/read-effects-order-20260905/assets/acceptance-order-cover-v1.png" kicker="Open-source engineering · Controlled experiment" title="Both Instructions Were Saved. Why Did Recovery Reverse Their Meaning?" summary="Order is part of context. With no input missing, replay can still reverse a decision when persistence order differs from acceptance order. Inspired by a Codex change, seven controlled scenarios separate receipt, acceptance, storage, recovery, and authority—not establish a real CodeFlowMu conversation-ordering defect." version="2026-09-05" languageHref="/zh/engineering/2026-09-05-acceptance-order-replay" languageLabel="中文" />

<ArticleTableScroll language="en" />

# Both Instructions Were Saved. Why Did Recovery Reverse Their Meaning?

<style>.read-effects-article .vp-doc h1[id] { display: none; }</style>

[View original cover](https://joinwell52-ai.github.io/joinwell52/assets/read-effects-order-20260905/assets/acceptance-order-cover-v1.png)

Suppose you tell an agent—a system that can use tools to carry out tasks—“allow execution,” then change your mind and say “revoke permission.”

If the system accepts both instructions in that order, the final meaning is clear: execution is no longer allowed.

Now suppose both messages are saved. Nothing is missing. But asynchronous persistence finishes the second write before the first. After a restart, a recovery program that trusts file order encounters “revoke” followed by “allow.”

The words are intact, yet their meaning can reverse.

The problem is not suddenly poor language comprehension. It is treating **which record finished writing first as which instruction was accepted first**. For order-sensitive input, saving all the content does not necessarily preserve the original context.

**Order itself is part of context.**

A recent change in Codex, OpenAI's coding-agent project, addresses this distinction. It prompted us to run a minimal experiment without a model: change the ordering basis used during recovery and observe whether the decision changes. Then we examined how that question relates to CodeFlowMu's existing execution safeguards.

## 1. Why acceptance and persistence are different events

Consider a café order. A customer orders a coffee and then cancels it; the server acknowledges both requests. Separate backend queues print the cancellation slip first and the order slip second.

Someone reviewing the paper stack might conclude that the coffee should be made. No slip is missing. **Print-completion order simply differs from acknowledgment order.**

Agent input has similar handoffs: arrival, acceptance, and persistence can occur close together without being the same event.

Here, the Host means the system that manages agent conversations, accepts inputs, and assembles context. Acceptance order is the logical order in which that responsible system accepts input—not merely network arrival or storage completion.

[Codex #42770](https://github.com/openai/codex/pull/42770), merged September 4, 2026, describes queued prompts and human-input answers being persisted in an order different from Host acceptance. Using recording order can reorder retained thread context or apply the wrong rollback boundary: which inputs remain when returning to an earlier point.

With retained thread context enabled, the change preserves acceptance sequences for relevant inputs and uses them for replay and boundary handling. Legacy records without acceptance metadata retain recording-order compatibility.

The value is not just an extra number. Recovery gains a basis for distinguishing “accepted first” from “saved first.” The sequence is still not an authorization credential: it establishes order, not who may approve an action.

## 2. Isolate ordering instead of testing model comprehension

We did not simulate a large language model. We wrote a transparent state reducer: a small program that processes operations in sequence and updates state. It recognizes only:

- `allow`: set the experimental state to allowed;
- `revoke`: set it to denied.

Both inputs have **equal authority within one experimental scope**. This isolates ordering; it does not model an administrator's authority relative to an ordinary user's, or implement a real business authorization service.

Each scenario saves two artifacts: input acceptance status with assigned sequences, and a line-oriented log written in a specified order, with a storage sync requested after each entry. A separate Node.js process reads the log and computes the result using recording order and acceptance order.

The central comparison is:

```text
Accepted: 1 allow → 2 revoke
Persisted: 2 revoke → 1 allow

Replay by recording order: allow
Replay by acceptance order: deny
```

[![O1 illustration: acceptance-order replay yields deny; recording-order replay yields allow](https://joinwell52-ai.github.io/joinwell52/assets/read-effects-order-20260905/assets/acceptance-replay-inline-v1.png)](https://joinwell52-ai.github.io/joinwell52/assets/read-effects-order-20260905/assets/acceptance-replay-inline-v1.png)

*Figure 1. Two replay interpretations of O1, not two independent grants of authority. Both rows use the same accepted records, whose identity numbers stay attached to the original input. The experimental inputs have equal authority; this does not establish a real conversation exceeding authority. Source: mechanism illustration of this article’s controlled experiment, not a raw observation screenshot. Click for the full-resolution image.*

Both readers use the same records without changing their contents. The decision flips because they trust different ordering evidence.

The inversion was **deliberately imposed**, not observed as a naturally occurring production incident. The experiment asks whether this separation can change a result—not how often it occurs.

Likewise, fresh-process replay establishes that another process can read and replay this experimental log. It is not a real agent-session crash-recovery test.

## 3. Seven controls identify when inversion matters

Seven scenarios ran twice, yielding 14 fresh-process replay observations. Results matched across rounds.

| Scenario | Inputs and disturbance | Recording-order replay | Acceptance-order replay |
|---|---|---|---|
| O0 | allow → revoke, normal persistence | deny | deny |
| O1 | allow → revoke, inverted persistence | allow | deny |
| O2 | revoke → allow, inverted persistence | deny | allow |
| O3 | revoke → revoke, inverted persistence | deny | deny |
| O4 | revoke followed by an unaccepted allow | deny | deny |
| O5 | Inversion with one missing acceptance sequence | allow | unknown |
| O6 | Inversion with duplicate acceptance sequences | allow | unknown |

O1 reproduces the opening example. O2 shows that the effect can go the other way: a later permission is misinterpreted as already revoked. The issue is not exclusively excess permission; it can also leave a decision incorrectly denied.

O3 is an essential negative control. Reordering two revocations leaves the result unchanged. **Out-of-order records do not necessarily produce a wrong decision; the operations must also be order-sensitive.**

O4 separates arrival from acceptance. The later allow appears in the log but was not accepted. Both readers filter it out before processing; later placement alone gives it no effect on state.

O5 and O6 test the ordering evidence itself. Missing or duplicate sequences cannot establish a unique reliable acceptance order, so our acceptance-based reader returns unknown rather than manufacturing history from file position.

Unknown expresses insufficient evidence, not a universal real-world handling policy. In particular, **our reader returns unknown for invalid sequences; Codex retains recording-order compatibility for legacy records lacking acceptance metadata. These address different cases with different rules.**

## 4. Correct order must not import the future into the past

There is another independent question: which point in the conversation are we restoring?

If the system accepted allow followed by revoke, a reconstruction of what it knew immediately after the first input may contain only allow. The revocation happened later; it must not affect that earlier judgment.

The same experiment therefore applies a cutoff: use only records whose acceptance sequence is at most 1. In O0 and O1, regardless of final file order, that cutoff yields only the first allow, without importing the later revoke.

**Sorting establishes which input precedes another. A cutoff establishes which inputs may enter the judgment at the selected boundary.**

Our cutoff is defined by acceptance sequence. It is not a complete validation of wall-clock timestamps, evidence visibility, or access control in arbitrary systems. The narrower lesson is that ordering and recovery boundaries each need explicit treatment.

## 5. CodeFlowMu's existing command safeguards answer a different question

CodeFlowMu is a local multi-agent collaboration system we are developing. Its FCoP file-based collaboration protocol maintains tasks, reports, and role responsibilities; its Runtime performs explicit technical actions. Formal task decisions do not simply follow the final sentence in a chat log.

This study fixed product code at commit `c008d9db91a21136fc61a4f60314e22db395d5d2`. Its common task-command checking entry point, `TaskCommandKernel`, checks task and thread identity, task revision, execution round, role or scope authorization, and idempotency receipts—records used to recognize repeated commands and reuse completed results.

The related command and role suites contained 31 tests, run twice. Each round had 31 passes, zero failures, and zero skips. That is not 62 distinct tests. The relevant evidence is the specific boundary each control verifies:

| Existing check | Verified boundary |
|---|---|
| Stale task revision | `stale_task_revision`; zero calls to the underlying action |
| Stale execution round | An old-round request cannot thereby change the current task |
| Same idempotency key, different semantic content | Conflict rejected rather than treated as the original command |
| Replay of a completed command receipt | Result reused without executing the action again |

Acceptance order asks which instruction came first. A task-revision check asks whether a command still addresses the current task state. Neither substitutes for the other.

An accurately restored permission concerning revision 5 does not automatically authorize an operation on the current revision 6. Conversely, rejecting revision 5 correctly does not establish that conversation persistence and recovery preserve input order.

The Codex `steer()` adapter also passes an expected conversation-turn identity and an optional user-message identifier. Their presence alone does not prove that acceptance order survives storage, compaction, and recovery.

A conversation turn and a formal task execution round are distinct concepts, too. One organizes interaction; the other constrains task execution. Similar terminology does not make them interchangeable.

**Our mechanism experiment does not establish a real CodeFlowMu conversation-ordering defect. Passing existing command tests does not establish correct conversation-context recovery either.**

## 6. Investigate three handoffs before building another component

These distinctions determine how an external change becomes our own engineering research rather than automatically becoming an implementation task.

**First, who acknowledges acceptance, and when?** Request arrival, successful queuing, acceptance by the target conversation, and use in the current turn can be different events. The context-owning system should identify the relevant event instead of reconstructing it later from file-write time.

**Second, how does that fact survive persistence and recovery?** What is the sequence's scope? How is uniqueness maintained? What happens when metadata is missing or duplicated? Does it survive compaction? Which boundary does rollback use? How are legacy records handled? These require implementation-specific evidence. Renumbering today's file order cannot establish historical acceptance order.

**Third, who verifies present execution eligibility?** Correct ordering reconstructs history. Current role, task revision, execution round, authorization validity, and whether an action has already taken effect still require their respective execution rules.

Meeting minutes can faithfully establish who spoke first without proving who had authority to approve a payment. The same distinction applies here: **acceptance order is not authorization, and permission in the past is not automatically permission now.**

These handoffs become more valuable as agents run longer. Queuing, human answers, compaction, restarts, and rollback make context a history with ordering and boundaries—not just a list of strings. Greater model intelligence does not automatically preserve those relationships.

We therefore did not propose immediately adding another acceptance-sequence module to CodeFlowMu. The next step is to examine the actual input–acceptance–storage–compaction–recovery chain, establish what the Host already provides and what belongs locally, and only then decide whether a product gap requires development.

## 7. Complete records do not automatically preserve complete meaning

This study establishes that substituting persistence order for acceptance order can change recovery results in a fixed, order-sensitive minimal model. Reverse-direction flips, identical operations, unaccepted input, invalid sequences, and cutoffs define the limits of that finding.

It does not measure natural race frequency, demonstrate a real agent exceeding authority, or test cross-user privilege conflicts, cancellation of in-flight effects, or the complete context-compaction pipeline. We did not run Codex's Rust tests. An existing CodeFlowMu receipt test named for process restart reconstructs objects with receipt dependencies; it cannot be presented as an additional real Host crash-recovery test.

This research did not grant new product-development authorization.

Why can both instructions be saved while their meaning reverses? For order-sensitive context, preserving content need not preserve how it originally formed a history.

**Reliable recovery must preserve the order and boundaries needed to interpret records, not merely retrieve them. Restoring past meaning does not grant present execution authority.**

## Evidence and checking

The companion [evidence guide](/en/research/evidence/2026-09-05-read-effects-acceptance-order) includes both de-identified replay rounds, a standalone ordering probe, formal-command test summaries, and fixed-source hashes.

The evidence checker validates exported-observation consistency and file integrity. It does not rerun product code or establish detection accuracy, production reliability, or independent acceptance. This editorial revision adds no experiments; all figures still refer to the September 5, 2026 fixed baseline.
