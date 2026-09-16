---
schema: "publication-candidate-article/v2"
title: "Resume the conversation. Keep the old credentials too?"
date: "2026-09-16"
published_date: "2026-09-16"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "Resume the conversation. Keep the old credentials too?"
summary: "A conversation needs continuity, but its launch credentials need not be permanent. A real-file experiment shows why resuming with a new value does not erase the old one on disk."
cover: "/assets/current-context-20260916/session-without-old-keys.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded experiments on pinned source; scope in article"
pageClass: "current-context-article"
---

<ArticleCover image="/assets/current-context-20260916/session-without-old-keys.cover-v1.png" kicker="Open-source engineering · Experiments" title="Resume the conversation. Keep the old credentials too?" summary="A conversation needs continuity, but its launch credentials need not be permanent. A real-file experiment shows why resuming with a new value does not erase the old one on disk." version="2026-09-16" languageHref="/zh/engineering/2026-09-16-session-without-old-keys" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.current-context-article .vp-doc h1[id] { display: none; }</style>

# Resume the conversation. Keep the old credentials too?

Saving an AI conversation lets you continue tomorrow. History, settings, and a session identifier belong naturally in that record.

What if the credentials used to launch it are saved too?

They may no longer be appropriate tomorrow, yet remain in the session file. An especially misleading signal is a successful resume with new credentials: it does not mean the old file has been cleaned.

Our experiment with real temporary files confirmed that **using the current value and removing the old value from disk are separate outcomes.**

## Separate what is being saved

[Paperclip #13498](https://github.com/paperclipai/paperclip/pull/13498), submitted by electrumnz, reports launch environment variables being persisted with session settings. Paperclip is an open-source application for coordinating AI assistants. The proposed fix was still open when researched.

Upstream describes risks when multiple seats share an operating-system account. We did not reproduce that deployment or cross-seat access.

This interested us because resumability often encourages retaining more state. Conversation history, work products, and launch credentials do not share the same lifetime. We narrowed the question: must a resumed conversation recover its launch environment from its old record?

The candidate removes that environment before saving and injects the current run's environment when loading. It also proposes a shell-snapshot policy change, which we did not validate here.

## Synthetic credentials, real files

We executed the candidate's complete store wrapper, backed by temporary JSON files. Only clearly synthetic strings were used; no real credentials were read.

We set an old value, resumed with a different current value, and inspected the original object, disk bytes, and loaded object.

| Operation | Old synthetic value remains on disk | Resume uses current value |
| --- | --- | --- |
| Save raw record without filtering | Yes | Yes; loading still uses candidate wrapper |
| Save new record through candidate wrapper | **No** | Yes |
| Load a legacy record without saving again | **Yes** | Yes |
| Load legacy record, then save through wrapper | **No** | Yes |

All four retained conversation history and left the caller's original record unchanged. That matters: removing credentials from the disk copy should not inadvertently remove the environment from a live in-memory session.

![Separate persisted history from current launch credentials](/assets/current-context-20260916/session-without-old-keys.figure.en.svg)

*Figure 1: A mechanism illustration of the file experiment. Save filtering changes the file; load-time injection changes the object returned to the current run.*

## Reading a legacy record does not rewrite it

The load function returns an object containing the current environment. It does not call save during that read.

The resumed object therefore had the current value while the original file retained the old one. Explicitly saving the loaded record removed the value from the tested location.

This does not invalidate the fix. It prevented new saves from persisting launch environments and supplied current values on resume. It exposes a separate upgrade responsibility: whether existing records are cleaned, when that happens, and whether backups retain earlier copies.

A successful next launch cannot answer those questions.

In a fifth boundary case, we deliberately placed the same synthetic value in an unrelated debug field. The wrapper removed the known launch-environment field but retained that arbitrary copy. This is structural filtering of a specific location, not a general scan of every value. The field was artificial and does not establish another production disclosure path.

## New writes, old copies, and expired credentials

The lesson is not to stop saving conversations. The experiment retained history while separating launch material that belongs to a particular run.

An upgrade review can ask three distinct questions: do new saves still include the environment, are existing records handled, and have credentials that need to expire actually expired? We did not perform rotation or revocation.

For users, the expectation can be stated simply: after changing an account or connection, “it works now” should not be the only available fact. What old connection material remains, and what history is intentionally retained?

A useful maintainer question follows: does this proposal own legacy-record cleanup, or is cleanup explicitly assigned to a separate migration? That responsibility determines whether a successful resume can be mistaken for completed cleanup.

<details>
<summary>Source and experimental limits</summary>

PR #13498 was OPEN when checked. Candidate: `bfe7f568976a2c671184722a6e6294927d6e6fae`; source baseline: `9cfa7fd2d13213b73396cf34b9fc95912857ff69`. We ran the complete candidate `session-store.ts` with our real temporary JSON-file store. The unwrapped control is not claimed to be the complete old ACPX implementation.

Five synthetic-record cases; no real ACPX child process, shell snapshot, cross-seat access, backup cleanup, credential rotation, or full product resume. The upstream 195-test report is not our own test count.

[Boolean observations, probe, and pinned sources](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-16-current-context). This does not establish a corresponding CodeFlowMu disclosure.

</details>


[Research repository](https://github.com/joinwell52-AI/joinwell52)
