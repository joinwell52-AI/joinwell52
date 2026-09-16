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

Saving an AI conversation lets you continue tomorrow. Keeping its history is easy to understand.

But should the key used to launch the assistant stay with it?

Here, a key is a credential the application uses to access a service. After an account or connection change, the current run may already use a different credential. **Our real-file experiment showed an easily missed state: resume used the current value while the old value remained in the file on disk.**

“It works again” does not answer “were the earlier copies cleaned up?”

## How did a key get into a conversation record?

The source is [Paperclip #13498](https://github.com/paperclipai/paperclip/pull/13498), submitted by electrumnz. Paperclip is an open-source application for coordinating AI assistants. This proposed fix was still open when researched.

When launching an assistant, an application supplies settings called environment variables. Some can contain service credentials. Upstream reports that this launch environment was saved along with session settings, turning values prepared for a run into potentially long-lived copies.

That interested us because “save more so we can resume later” sounds reasonable. Yet history and credentials serve different purposes. Continuing yesterday's conversation need not require yesterday's credential.

The candidate separates them: remove the launch environment when saving, and supply the current environment when resuming. We narrowed our experiment to a practical question: does that preserve the conversation, and what happens to old values already on disk?

## Synthetic keys, real files

We used recognizable synthetic strings in place of credentials and read no real keys. The candidate's save and load code was connected to temporary files. We supplied an old value, resumed with another current value, and inspected what remained in the file.

| Operation | Old synthetic value remains on disk | Resume uses current value |
| --- | --- | --- |
| Save the original record without filtering | Yes | Yes; load still uses candidate code |
| Save a new record through candidate code | **No** | Yes |
| Read a legacy record without saving again | **Yes** | Yes |
| Read legacy record, then save through candidate code | **No** | Yes |

All four preserved conversation history. The original object supplied to save also stayed unchanged: removing the environment from the disk copy did not modify data the running session might still need in memory.

The third row is worth pausing over. Resume received the current value, while inspection still found the old value on disk. Both observations were correct; they looked in different places.

![Separate persisted history from current launch credentials](/assets/current-context-20260916/session-without-old-keys.figure.en.svg)

*Figure 1. Supplying current values during load and removing old environment fields during save affect different locations. Source: our real temporary-file experiment; diagram by the authors.*

## Reading an old file does not rewrite it

Reading and changing a file are separate operations.

After reading the old record, the candidate returns an object carrying the current environment. It does not rewrite the original file during that load. Only when we explicitly saved again did the old value disappear from the tested location.

That matches the proposal's explanation that the environment field disappears once a record is resaved. An upgrade still leaves a practical question: what happens to old records that are never opened or saved again? If backups retain older copies, who handles them?

The fix prevented new saves from persisting launch environments and supplied current values on resume. Our experiment clarified the distance between those outcomes and cleaning up every existing copy.

## Does removing a copy make its credential unusable?

That does not follow. “Old” means previously used; it does not mean the service has invalidated the credential. Deleting a local copy does not revoke access.

Developers therefore need three separate answers:

- **Will future saves keep writing it?** Inspect newly saved records.
- **What happens to earlier copies?** Assign responsibility for legacy files and backups.
- **Have credentials that should no longer work been invalidated?** That requires credential management, not just file deletion.

Our experiment answers how the tested save and load paths behave. It did not rotate or revoke credentials, or clean backups.

Users can turn this into a concrete question too: after changing an account or connection, does the application explain what history remains and how old connection material is handled? Successful resume is useful, but it should not create an assumption that every old copy has also been addressed.

That led to our maintainer question: could upgrade guidance distinguish preventing new persistence from handling existing records, and name the responsibility for the latter? It affects how the fix is used, as well as how its save function is written.

<details>
<summary>For technical readers: filtering scope, the fifth control, and limitations</summary>

Source author: electrumnz. PR #13498 was OPEN when researched. Candidate: `bfe7f568976a2c671184722a6e6294927d6e6fae`; source baseline: `9cfa7fd2d13213b73396cf34b9fc95912857ff69`.

We ran the complete candidate `session-store.ts`. It wraps the storage interface, removing `acpx.session_options.env` on save and injecting the current launchEnv on load. Our underlying store used real temporary JSON files. Directly saving the raw record is a negative control, not the complete old ACPX implementation.

A fifth boundary case deliberately placed the same synthetic value in an unrelated debug field. The candidate removed the designated environment field but retained that arbitrary copy. This tests filtering of a known structure, not general sensitive-value scanning; the artificial field does not establish another production disclosure path.

Upstream also discusses multiple seats sharing an operating-system account and proposes disabling shell snapshots. We did not reproduce those paths or start a real ACPX child process. Cross-seat access, backup cleanup, credential rotation, and full product resume were not tested. Upstream's reported 195 tests are not counted as our own execution.

[All five observations, probe, and pinned source](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-16-current-context). This does not establish a corresponding CodeFlowMu disclosure.

</details>

[Research repository](https://github.com/joinwell52-AI/joinwell52)
