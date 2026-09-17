---
schema: "publication-candidate-article/v2"
title: "More backups. Less history. How does that happen?"
date: "2026-09-17"
published_date: "2026-09-17"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "More backups. Less history. How does that happen?"
summary: "A full backup list can hide an empty history. Running the original merge code shows how unchanged saves can evict the version you actually need."
cover: "/assets/control-intent-20260917/backup-without-history.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded original-code experiments; scope in article"
pageClass: "control-intent-article"
---

<ArticleCover image="/assets/control-intent-20260917/backup-without-history.cover-v1.png" kicker="Open-source engineering · Experimental research" title="More backups. Less history. How does that happen?" summary="A full backup list can hide an empty history. Running the original merge code shows how unchanged saves can evict the version you actually need." version="2026-09-17" languageHref="/zh/engineering/2026-09-17-backup-without-history" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.control-intent-article .vp-doc h1[id] { display: none; }</style>

# More backups. Less history. How does that happen?

You open the backup folder and find ten neatly named files. Only when you need yesterday’s settings do you discover that all ten contain today’s version.

Nothing crashed. Every launch faithfully made a backup. That repetition pushed the useful old version out of the retention window.

**A full backup list does not necessarily contain a useful history.** We tested the original code from an open-source project, asking whether the content from before a change survived.

## Why this small change caught our attention

The source is [commit ce6457a in anywhere-agents](https://github.com/yzhao062/anywhere-agents/commit/ce6457a830dead5e05c3a17f685f7ff32575ce20), by Yue Zhao, or yzhao062 on GitHub. The project helps AI coding tools share settings. One Python program merges shared configuration into a local file.

The upstream investigation found that repeatedly merging unchanged settings created identical backups and displaced useful older contents.

This matters to us because automated tools often synchronize on every launch. If each synchronization consumes a backup slot, opening more terminals can shorten recoverable history without changing a single setting.

The patch compares the proposed output with the existing bytes while holding the original file lock. Identical output means no write and no new backup.

## Change once, then repeat

In a temporary directory, we started with old settings, merged a new value, then performed 27 identical merges. Both versions ran their original file operations and locking code.

| Observation | Before the patch | After the patch |
| --- | --- | --- |
| Retained backups | 10 | 1 |
| Content from before the change survives | No | Yes |
| Backups identical to the current file | 10 | 0 |
| Identical merges change the target modification time | Yes | No |

The first merge really did save the old settings in both versions. Before the patch, later merges kept saving the new settings again until the first backup fell outside the ten-file window.

After the patch, unchanged merges stopped consuming that window. Fewer backup files preserved more useful history.

![Repeated copies versus recoverable history](/assets/control-intent-20260917/backup-without-history.figure.en.svg)

*Figure 1. One real change followed by 27 identical merges. Source: author illustration from our local original-code experiment. Each block is a retained backup, not an upstream consumer.*

We also ran eight concurrent processes after the initial change. The old version retained nine backups; the patched version retained only the original old content. That supports the lock-protected check under these conditions, not a claim about every filesystem failure.

## What does “unchanged” mean?

Next, we deliberately reformatted the target before each merge. Keys and values stayed the same; whitespace changed.

After 12 such rewrites, both versions retained ten backups and had evicted the original old settings. This does not contradict the patch: different formatting means different bytes. The implementation skips byte-identical writes; it does not promise ten semantically distinct revisions.

This was a constructed counterexample, not a reported production incident. It exposes a useful design question: should history preserve every write, or every meaningful change?

Ignoring formatting is not automatically the right answer. Comments, ordering and presentation can themselves be worth restoring. A comparison that is too coarse can discard changes that matter.

## Try recovering, not just counting

A practical check is small: change a harmless setting, restart or synchronize repeatedly, then look for the pre-change version. The target is specific: can you recover what existed before that change?

If you have found plenty of backups but not the version you needed, record when the setting changed and how often the tool restarted or synchronized afterward. That helps locate when repeated copies displaced useful history.

For developers, the formatting counterexample suggests another experiment: let two tools alternate writes to the same configuration, then compare retention by write count, distinct content and elapsed time. Each policy may lose something different. Formatting or comments can themselves be worth restoring, so deduplication should not be assumed to be the answer.

The tested improvement is clear: unchanged bytes no longer create backups, preserving the original revision in that scenario. It leaves one larger question: **does a backup system promise the last few saves, or the changes a person needs to return to?**

<details>
<summary>Versions, scope and reproduction</summary>

The upstream investigation reported 27 consumers and 198 byte-identical backups. Those are **upstream observations, not the scale of our experiment**.

We ran the complete original Python merge module through its main entry point, using real Windows temporary files and its original locks. Six scenarios ran against both versions, producing 12 observations: identical merges, deliberate formatting rewrites, another real change, first installation, empty-merge refusal, and eight concurrent identical merges.

Base: `91c64c153f2034bf4aa88121cbe546cbf6a22aeb`. Patched revision: `ce6457a830dead5e05c3a17f685f7ff32575ce20`. Except for first installation, scenarios begin with an initial merge. The 27 repeats are not 27 real consumers. We used synthetic settings and did not test power loss or disk corruption.

[Results and reproduction scripts](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-17-control-intent). This experiment does not establish the same problem in CodeFlowMu.

</details>

[Research repository](https://github.com/joinwell52-AI/joinwell52)
