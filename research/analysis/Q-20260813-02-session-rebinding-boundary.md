---
schema: "research-analysis/v1"
id: "AN-20260813-02"
date: "2026-08-13"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260813-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260813-02-generation-aware-grpc-session-recovery.md"
output_contract: "Research Object"
research_object: "Session Rebinding and Execution Continuity"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Session Rebinding and Execution Continuity

## Research question / 研究问题

What does the selected implementation establish about session continuity after the underlying runtime service changes?

当底层 Runtime Service 发生变化后，所选实现对 Session Continuity 建立了什么？

## Evidence / 证据

The completed Reading Result establishes three bounded facts. First, the public session can open a replacement gRPC binding after the previous binding stops. Second, replacement bindings use generation-aware cell identity so that an old generation is not confused with the new binding. Third, work already running against the previous binding is interrupted rather than transparently migrated.

已完成 Reading Result 建立了三个有界事实。第一，原 Binding 停止后，Public Session 可以打开新的 gRPC Binding。第二，Replacement Binding 使用 Generation-aware Cell Identity，避免旧 Generation 与新 Binding 混淆。第三，已经在旧 Binding 上执行的工作会中断，而不是透明迁移。

## Analysis / 分析

These facts separate logical-session continuity from execution continuity. A session may remain usable for later operations even when earlier in-flight execution did not survive. Single-flight reopening addresses duplicate replacement creation, while generation-aware identity marks which binding epoch owns a cell reference. The mechanism therefore restores later availability without establishing migration of old work.

这些事实把 Logical-session Continuity 与 Execution Continuity 分开。即使此前的 In-flight Execution 没有存续，Session 仍可以继续用于后续操作。Single-flight Reopen 解决重复创建 Replacement 的问题，Generation-aware Identity 则标记 Cell Reference 属于哪个 Binding Epoch。因此，该机制恢复的是后续可用性，而不是证明旧工作已经迁移。

## Research judgment / 研究判断

Remote-session recovery should represent session rebinding and work recovery as separate outcomes. Stable logical identity can survive replacement, while each live binding has its own generation. A successful rebind should not be reported as proof that interrupted work survived.

Remote-session Recovery 应把 Session Rebinding 与 Work Recovery 表示为不同结果。稳定 Logical Identity 可以跨 Replacement 存续，而每个实时 Binding 拥有自己的 Generation。成功 Rebind 不应被报告为被中断工作已经存续的证明。

## Counterarguments and limitations / 反方意见与局限

A system whose remote resource identifiers are globally unique and never reused may choose another epoch mechanism. The selected evidence is specific to Codex gRPC code-mode sessions, and its generation state is held in the client process; it does not establish durable generation identity across client restart or recover results lost with the previous runtime service.

如果系统的远程资源 Identifier 全局唯一且永不复用，可以采用其他 Epoch 机制。所选证据只针对 Codex gRPC Code-mode Session，而且 Generation State 位于 Client Process；它没有建立跨 Client Restart 的持久 Generation Identity，也没有恢复旧 Runtime Service 丢失的结果。

## Open questions / 开放问题

- When should generation identity itself become durable?
- Which interrupted work classes should be reconstructable after replacement?
- How should observability distinguish initial open, rebind, and work recovery?

- 什么时候 Generation Identity 本身应持久化？
- Replacement 后哪些被中断工作应允许重建？
- 可观测性应如何区分 Initial Open、Rebind 与 Work Recovery？

## Production metadata / 生产元数据

- Article type: `technical-analysis`
- Selected modules: research-question, evidence, architecture-comparison, limitations, open-questions
- Project relevance: none; the judgment is general to session recovery architecture.
