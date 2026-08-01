---
title: TMPA Architecture Paper — Draft A0.3
outline: deep
---

# TMPA Architecture Paper / TMPA 架构论文

> Version: **A0.3**  
> Status: Public Research Draft / 公开研究草稿  
> Author: Zhu Wei / 朱卫 — Independent Researcher

## Working title / 暂定标题

**TMPA: A File-Native Work Data and Governance Architecture for Governed AI Applications**

**TMPA：面向可治理 AI 应用的文件原生工作数据与治理架构**

## Abstract / 摘要

AI applications are moving from single-turn generation toward long-running, multi-role work. Existing Agent frameworks and interoperability protocols improve tool access, communication and orchestration, but the work itself is often stored as fragmented chat history, opaque internal state, transient runtime memory or application-specific logs. This makes responsibility, source, verification, publication, recovery and knowledge promotion difficult to govern—especially for SMEs that cannot deploy a heavyweight enterprise control plane.

TMPA proposes a work-data and governance architecture based on five semantic data types: **Profile, Event, Message, Index and Knowledge**. It combines append-only work facts, independent writer streams, source and time metadata, formal responsibility messages, rebuildable indexes, explicit verification, publication states and governed knowledge promotion. A file-native profile provides a lightweight reference implementation while the core semantics remain storage-independent.

The research is grounded in FCoP and CodeFlowMu engineering practice. The paper positions TMPA above or alongside interoperability protocols rather than as a replacement for them, and evaluates governance through lifecycle closure, evidence completeness, recovery, human authority and cost.

AI 应用正在从单轮生成转向长期、多角色真实工作。现有 Agent 框架与互操作协议改善了工具访问、通信和编排，但工作本身常被分散保存在聊天历史、黑箱状态、临时 Runtime 内存或应用专用日志中，导致责任、来源、验证、发布、恢复与知识晋级难以治理，尤其不利于无法部署重型企业控制面的中小企业。

TMPA 提出由 **Profile、Event、Message、Index、Knowledge** 五类语义数据构成的工作数据与治理架构，并引入只增工作事实、独立写者流、来源与时序、正式责任消息、可重建索引、显式验证、发布状态和受治理知识晋级。文件原生 Profile 提供轻量参考实现，而核心语义保持存储无关。

## Research question / 研究问题

> How can AI work remain reconstructable, governable and economically deployable when multiple probabilistic actors operate asynchronously across long-running tasks?

> 当多个概率型执行者以异步方式参与长期任务时，如何让 AI 工作保持可重建、可治理并具备经济可部署性？

## Claimed contribution / 预期贡献

1. A five-type semantic model for AI work data.
2. Independent writer streams and append-only facts.
3. Separation of raw Event, audit decision and publishable result.
4. Formal coordination through Message without requiring one broker.
5. Rebuildable Index rather than authoritative hidden state.
6. Governed Knowledge promotion from verified work.
7. A lightweight file-native profile suited to SME adoption.
8. Engineering evidence from FCoP and CodeFlowMu.

## Current state / 当前状态

A0.3 is an editorial research draft. It is not yet a peer-reviewed publication. Before stable release it still requires:

- reference verification;
- final terminology alignment;
- architecture diagrams;
- reproducible evaluation design;
- evidence tables and limitations;
- venue formatting and disclosure statement.

## Citation guidance / 引用建议

Until a stable release or DOI exists, cite the repository, document title, explicit version `A0.3`, author and access date. Do not describe this draft as peer reviewed.
