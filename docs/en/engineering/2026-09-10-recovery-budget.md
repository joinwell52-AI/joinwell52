---
schema: "publication-candidate-article/v2"
title: "Three Recoveries in Five Minutes—Until Recovery Erases the Counter"
date: "2026-09-10"
published_date: "2026-09-10"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "Three Recoveries in Five Minutes—Until Recovery Erases the Counter"
summary: "An Orca module experiment shows how a recovery mechanism can discard the evidence that its own limit depends on."
cover: "/assets/authority-scope-20260910/03-recovery-budget.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded pinned-source seam experiments; not full-system validation"
pageClass: "authority-scope-article"
---

<ArticleCover image="/assets/authority-scope-20260910/03-recovery-budget.cover-v1.png" kicker="Open-source Engineering · Experiments" title="Three Recoveries in Five Minutes—Until Recovery Erases the Counter" summary="An Orca module experiment shows how a recovery mechanism can discard the evidence that its own limit depends on." version="2026-09-10" languageHref="/zh/engineering/2026-09-10-recovery-budget" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.authority-scope-article .vp-doc h1[id] { display: none; }</style>

# Three Recoveries in Five Minutes—Until Recovery Erases the Counter


A terminal display stops responding while its backing process remains alive. Rebuilding the display and reconnecting to that process can restore useful work. To prevent recovery itself from looping, the application adds a cooldown and a limit of three recoveries per tab in five minutes.

The protection appears complete: a counter, a time window and cleanup after disposal. But cleanup can delete the timestamp written by the recovery that just succeeded. The next request then finds a fresh budget.

## Two indexes disagree about one object

Orca is a desktop tool for organizing terminals and Agent work. [PR #19745](https://github.com/stablyai/orca/pull/19745) describes a Windows crash in which eight tabs reportedly remounted 8,878 times in roughly 122.4 seconds. We did not obtain the original crash bundle; those numbers are the author's incident report, not our measurements.

The public code exposes a mechanism worth testing. Terminal rows live in one index, while unified UI tabs live in another. They usually correspond but can diverge.

Remounting consults the terminal-row index. The old budget-release path consulted the unified UI index instead. The same tab could consequently receive two incompatible answers: it existed for the function performing a remount, but appeared absent to the cleanup function deciding whether to erase its recovery history.

Each lookup returned a definite answer. Their combination allowed recovery to discard the evidence of its own activity.

## Test the causal path without claiming a desktop reproduction

We pinned the base and proposed head revisions and loaded the complete recovery and lookup modules. The original budget calculation, instance disposal, remount and generation-update logic remained intact. We supplied fixtures for store plumbing, time, timers, PTY and logging. We did not start Electron or reproduce graphics-memory exhaustion.

Each cycle registered an instance, requested recovery and unregistered it. We then made the UI index miss a tab whose terminal row remained present. Two request schedules tested different constraints: 10 milliseconds between calls for the cooldown, and 16 seconds to move past the cooldown while remaining inside the cumulative budget window.

| Scenario | Requests | Base remounts | Proposed-head remounts |
| --- | ---: | ---: | ---: |
| Both indexes agree; 10ms spacing | 200 | 1 | 1 |
| Terminal row present, UI entry absent; 10ms spacing | 200 | 200 | 1 |
| Same divergence; 16s spacing | 10 | 10 | 3 |

Both rounds agreed. The first row shows that the old limiter was not universally ineffective. It worked when disposal could still see the tab. The second demonstrates history being reset under index divergence. The third separates the cumulative cap from the cooldown: even with requests spaced apart, the old code never retained enough history to reach its limit.

![Remount counts under divergent indexes](/assets/authority-scope-20260910/03-recovery-budget.figure.en.png)

*Figure 1. These counts describe successful remounts in the fixture's in-memory store, not production crashes. Source: saved rounds 1 and 2 of our pinned-source experiments.*

## Share the predicate, not another counter

The proposed fix does not lower the cap or introduce a second limiter. It makes the question “can this terminal still be remounted?” and the question “has this terminal gone away?” rely on the same terminal-row lookup.

Replacing a display instance does not end the lifetime of the terminal object that owns the recovery budget. If that object can still produce another recovery effect, a missing entry in a different UI projection should not erase the history constraining it.

This is a bounded correction. The two indexes can still disagree elsewhere. The patch chooses the appropriate source of identity for this budget; it does not establish system-wide index consistency.

## Verify legitimate recovery still works

Merely proving that a storm stops is insufficient: disabling every recovery would also satisfy that test. We retained three controls.

| Control | Result on both revisions |
| --- | --- |
| Fixture removes the terminal row, disposes the instance, then recreates the same ID | Two requests produce two remounts |
| Requests at 0, 16, 32, 48 and 300.001 seconds | First three accepted, fourth constrained, final request accepted: four remounts |
| Replay the old generation after one successful recovery | Two requests produce one remount |

The close control mutates the fixture's terminal rows; it is not a real UI close action. It checks the budget-release branch. The expiry control checks that the cap does not become permanent, while the stale-generation control checks that delayed requests cannot continue acting on a replaced display instance.

Together, these controls distinguish preserving necessary history from freezing recovery altogether.

## A budget depends on evidence surviving cleanup

The tempting response to a recovery storm is another limit. This case suggests inspecting the existing limit's release conditions first. Who can erase its history? Does that decision rely on the object performing the action, or on a UI projection or cache that can temporarily lose sight of it?

The same question applies to retry counts, failure lockouts and spending budgets. An accurate timestamp is ineffective if the action's own cleanup path deletes it before the next admission decision.

Not every budget needs permanent persistence. Its lifetime does, however, need to cover the object it constrains, and its release predicate needs to agree with the execution predicate. The disappearance of a UI instance does not necessarily end a backing object's history.

The reusable finding is simple: **a protection mechanism must both record an action correctly and preserve that record until the next decision that depends on it.** Cleanup deserves the same scrutiny as admission.

[中文](/zh/engineering/2026-09-10-recovery-budget) · [Methods, pinned revisions and raw results](/en/research/evidence/2026-09-10-authority-scope)
