---
title: TMPA Core Specification — Draft S0.2
outline: deep
---

<ArticleCover
  image="/assets/covers/tmpa-spec.svg"
  kicker="Core Specification"
  title="TMPA Core Specification"
  summary="Implementable and testable contracts for TMPA core semantics, independent of any one storage backend."
  version="S0.2"
  status="Public specification draft"
  languageHref="/zh/publications/tmpa-core-specification-s0.2"
  languageLabel="简体中文"
/>

## Purpose

The Core Specification translates TMPA research claims into implementable and testable contracts. It separates normative core semantics from the optional file-native storage profile.

## Core contract

A conforming implementation must be able to represent:

- Profile, Event, Message, Index and Knowledge;
- unique identity and references;
- writer and responsibility identity;
- source and observation context;
- version and time;
- append-only work facts;
- verification and audit relations;
- publication decisions;
- lifecycle transitions;
- knowledge candidates and governed promotion;
- reconstructable navigation and export.

## File-native profile

The reference profile may use Markdown, JSON, CSV, directories and atomic file operations. File storage is not mandatory, but another backend must preserve and export the same semantics without loss.

## Fundamental rule

```text
Raw Event
  append-only statement of what occurred

Audit or Verification Event
  governed judgment referring to raw facts

Published Result / Knowledge
  promoted only after required gates
```

A rejected action does not disappear from history. Rejection is expressed as a new governed fact.

## Message and FCoP

FCoP TASK, REPORT, ISSUE and REVIEW can be carried or projected as TMPA Message. Implementations must avoid duplicating two authoritative copies of the same coordination object.

## Runtime boundary

TMPA does not replace task queues, leases, session management, checkpoint and retry, business transactions, tool execution or provider scheduling. Reliable projection from Runtime state to TMPA facts may use an Outbox pattern.

## Draft status

S0.2 remains under development. Open items include minimum schemas, compatibility rules, signature profiles, evidence granularity, conformance tests and storage-profile interoperability.
