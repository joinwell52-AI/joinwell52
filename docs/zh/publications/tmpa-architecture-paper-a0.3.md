---
title: TMPA 架构论文 — 草稿 A0.3
outline: deep
---

<ArticleCover
  image="/assets/covers/tmpa-paper.svg"
  kicker="研究论文"
  title="TMPA 架构论文"
  summary="面向可治理 AI 应用的文件原生工作数据与治理架构。"
  version="A0.3"
  status="公开研究草稿"
  languageHref="/en/publications/tmpa-architecture-paper-a0.3"
  languageLabel="English"
/>

## 暂定标题

**TMPA：面向可治理 AI 应用的文件原生工作数据与治理架构**

## 摘要

AI 应用正在从单轮生成转向长期、多角色真实工作。现有 Agent 框架和互操作协议改善了工具访问、通信与编排，但工作本身常被分散保存在聊天历史、黑箱内部状态、临时 Runtime 内存或应用专用日志中。

TMPA 提出由 **Profile、Event、Message、Index、Knowledge** 五类语义数据构成的工作数据与治理架构，并引入只增工作事实、独立写者流、来源与时序、正式责任消息、可重建索引、显式验证、发布状态和受治理知识晋级。

文件原生 Profile 提供轻量参考实现，而核心语义保持存储无关。研究证据来自 FCoP 与 CodeFlowMu 的真实工程实践。

## 研究问题

> 当多个概率型执行者以异步方式参与长期任务时，如何让 AI 工作保持可重建、可治理并具备经济可部署性？

## 预期贡献

1. AI 工作数据的五类语义模型；
2. 独立写者流与只增事实；
3. 原始 Event、审计判断与可发布结果的分离；
4. 不依赖强制 Broker 的正式 Message 协作；
5. 可重建 Index，而不是权威黑箱状态；
6. 从已验证工作晋级 Knowledge；
7. 面向中小企业的轻量文件原生 Profile；
8. 来自 FCoP 与 CodeFlowMu 的工程证据。

## 当前状态

A0.3 是编辑中的公开研究草稿，不是经过同行评审的正式论文。稳定发布前仍需要：

- 参考文献核验；
- 术语最终统一；
- 正式架构图；
- 可复现实验设计；
- 证据表与局限；
- 投稿格式和 AI 参与披露。

## 引用建议

在稳定版本或 DOI 出现之前，请引用作者、标题、明确版本 `A0.3`、仓库地址和访问日期，不应将该草稿描述为已通过同行评审。
