---
title: TMPA Architecture Paper — Draft A0.3
outline: deep
---

<ArticleCover
  image="/assets/covers/tmpa-paper.svg"
  kicker="Research Paper"
  title="TMPA Architecture Paper"
  summary="A file-native work-data and governance architecture for governed AI applications."
  version="A0.3"
  status="Public research draft"
  languageHref="/zh/publications/tmpa-architecture-paper-a0.3"
  languageLabel="简体中文"
/>

## Working title

**TMPA: A File-Native Work Data and Governance Architecture for Governed AI Applications**

## Abstract

AI applications are moving from single-turn generation toward long-running, multi-role work. Existing Agent frameworks and interoperability protocols improve tool access, communication and orchestration, but the work itself is often stored as fragmented chat history, opaque internal state, transient runtime memory or application-specific logs.

TMPA proposes a work-data and governance architecture based on five semantic data types: **Profile, Event, Message, Index and Knowledge**. It combines append-only work facts, independent writer streams, source and time metadata, formal responsibility messages, rebuildable indexes, explicit verification, publication states and governed knowledge promotion.

A file-native profile provides a lightweight reference implementation while the core semantics remain storage-independent. The research is grounded in FCoP and CodeFlowMu engineering practice.

## Research question

> How can AI work remain reconstructable, governable and economically deployable when multiple probabilistic actors operate asynchronously across long-running tasks?

## Claimed contribution

1. A five-type semantic model for AI work data.
2. Independent writer streams and append-only facts.
3. Separation of raw Event, audit decision and publishable result.
4. Formal coordination through Message without requiring one broker.
5. Rebuildable Index rather than authoritative hidden state.
6. Governed Knowledge promotion from verified work.
7. A lightweight file-native profile suited to SME adoption.
8. Engineering evidence from FCoP and CodeFlowMu.

## Current status

A0.3 is an editorial research draft, not a peer-reviewed publication. Before stable release it still requires:

- reference verification;
- final terminology alignment;
- architecture diagrams;
- reproducible evaluation design;
- evidence tables and limitations;
- venue formatting and AI-assistance disclosure.

## Citation guidance

Until a stable release or DOI exists, cite the author, title, explicit version `A0.3`, repository URL and access date. Do not describe this draft as peer reviewed.
