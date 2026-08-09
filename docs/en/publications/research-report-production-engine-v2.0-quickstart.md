---
title: Research Report Production Engine V2.0 Quickstart
description: Install, validate and operate the dependency-driven, recoverable and self-validating Research Runtime V2.0.
outline: deep
---

# Research Report Production Engine V2.0 Quickstart

## 1. Install and validate

```bash
git clone https://github.com/joinwell52-AI/joinwell52.git
cd joinwell52
npm install
npm run runtime:validate
npm run docs:build
```

## 2. Read operational truth in order

Do not substitute a green Actions run for Runtime state. Inspect: `SCHEDULER.json`, machine Runtime Records, the same-day Markdown ledger, then Actions as evidence of heartbeat/persistence/validation.

## 3. Daily order

```text
Discovery → Queue → Reading → Analysis → Production → Publication
```

On Sunday, Weekly runs only after Publication completes. A later stage never jumps over an incomplete prerequisite.

## 4. Catch-up

Scheduler heartbeat finds due work, reads durable status, checks prerequisites, recognizes dependency-blocked work whose prerequisite is now complete, and opens only the oldest runnable overdue shift.

Manual recovery must follow the same rule: begin with the earliest missing dependency rather than the stage matching the current clock time.

## 5. Self-check

```bash
npm run runtime:validate
node scripts/runtime-markdown.mjs render --date YYYY-MM-DD
node scripts/runtime-markdown.mjs validate --date YYYY-MM-DD
```

Also verify machine `taskStatus`, Markdown status, `Execution Slot Opened` timeline evidence and the durable Git commit.

## 6. Recovering Blocked work

Dependency-caused Blocked results should carry `blockedBy`. Once the dependency completes, Scheduler performs a governed reopen. Preserve the Blocked history; never rewrite it as Completed merely to advance the pipeline.

## 7. Sunday check

Sunday has seven tasks: six Daily stages plus 20:30 Weekly. If a surface shows only six, inspect Weekly family record/projection rather than changing the Daily six-stage definition.

## 8. Failure rule

```text
establish facts
→ locate earliest gap
→ repair prerequisite
→ self-check
→ persist and verify
→ advance next stage
```

Never open multiple dependent stages concurrently just to catch up faster.
