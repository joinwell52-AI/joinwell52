---
title: TMPA Core Specification — Draft S0.2
outline: deep
---

# TMPA Core Specification / TMPA 核心规范

> Version: **S0.2**  
> Status: Public Specification Draft / 公开规范草稿

## Purpose / 目的

The Core Specification translates TMPA research claims into implementable, testable contracts. It separates normative core semantics from the optional file-native storage profile.

核心规范将 TMPA 的研究主张转化为可实现、可测试的契约，并区分规范性核心语义与可选的文件原生存储 Profile。

## Core contract / 核心契约

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

## File-native profile / 文件原生 Profile

The reference profile may use Markdown, JSON, CSV, directories and atomic file operations. File storage is not mandatory, but another backend must preserve and export the same semantics without loss.

参考实现可以采用 Markdown、JSON、CSV、目录与原子文件操作。数据库、对象存储或 Event Store 也可以实现 TMPA，但必须无损表达并导出核心语义。

## Fundamental rule / 基本规则

```text
Raw Event
  append-only statement of what occurred

Audit or Verification Event
  governed judgment referring to raw facts

Published Result / Knowledge
  promoted only after required gates
```

A rejected action does not disappear from history. Rejection is expressed as a new governed fact.

已经发生的错误动作不能从历史中消失；拒绝通过新增受治理事实表达。

## Message and FCoP / Message 与 FCoP

FCoP TASK, REPORT, ISSUE and REVIEW can be carried or projected as TMPA Message. Implementations must avoid duplicating two authoritative copies of the same coordination object.

## Runtime boundary / Runtime 边界

TMPA does not replace:

- task queues and leases;
- session management;
- checkpoint and retry;
- business transactions;
- tool execution;
- provider scheduling.

Reliable projection from Runtime state to TMPA facts may use an Outbox pattern.

## Status / 当前状态

S0.2 remains a draft. Open items include minimum schemas, compatibility rules, signature profiles, evidence granularity, conformance tests and storage-profile interoperability.
