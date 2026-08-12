---
schema: publication-candidate-article/v2
title: "Queued Work Is Demand; a Worker Claim Grants Execution Authority"
date: "2026-08-11"
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "Which fact should grant an agent permission to execute queued work?"
summary: "A queue records demand, while an explicit worker claim should grant bounded execution authority."
---

# Queued Work Is Demand; a Worker Claim Grants Execution Authority

## Demand is not execution authority

A timer firing or request arriving proves that work exists. It does not prove that a worker owns the task or may begin side effects. Treating a scheduler wake as `Running` can make an operations surface report activity before any execution identity has accepted responsibility.

## Queue and claim are different facts

A maintainer changelog reports ordered queuing inside a local session while allowing separate sessions to run concurrently. The general engineering lesson is to keep one ordered lane under one authority holder and introduce concurrency through explicit identities rather than hidden overlap.

A useful lifecycle separates `Received`, `Queued`, `Claimed`, `Running`, and typed terminal evidence. The claim is the transition that grants authority; the terminal record releases it.

## What operators must be able to see

Operators need separate receipts for scheduler wake, queue admission, worker claim, lease renewal, tool start, and terminal outcome. A local internal runtime record observed that wake and claim can be preserved as different facts. This is internal evidence about one operating process, not independent validation of the general model.

## Failure cases worth testing next

The model still needs crash tests before and after claim persistence, tool start, external side effects, cancellation, and lease expiry. It also needs an explicit rule for when a partially completed task releases the next queued item. Until those cases are tested, the proposal supports an observable authority boundary rather than a universal concurrency guarantee.

Sources: GitHub Copilot CLI maintainer changelog and an internal 2026-08-11 Runtime record.
