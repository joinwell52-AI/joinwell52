---
title: "6个AI，同一道题，会怎么样？"
description: "用CodeFlowMu与FCoP记录六个AI团队的真实工作：派单、交付、独立EVAL、事实核查与失败诊断。"
outline: false
---

<ArticleCover
  image="/articles/codeflowmu-six-ai-20260909/assets/hero.png"
  kicker="团队协作实测"
  title="6个AI，同一道题，会怎么样？"
  summary="用CodeFlowMu与FCoP记录六个AI团队的真实工作：派单、交付、独立EVAL、事实核查与失败诊断。"
  version="2026-09-09"
  status="六轮运行 · 独立EVAL · 公开证据摘录"
  languageHref="/en/publications/codeflowmu-six-ai-20260909"
  languageLabel="English"
/>

CodeFlowMu组织团队工作，FCoP让任务与报告落地成文。本文沿着系统留下的任务、会话、工具回执、正式报告、审批和EVAL记录，对比六套方案怎样理解和完成同一道题。

**[阅读全文：图文排版版](/articles/codeflowmu-six-ai-20260909/index.html)** · [公开来源与附件](/articles/codeflowmu-six-ai-20260909/sources.html) · [下载双语文章包](/articles/codeflowmu-six-ai-20260909/web-article.zip)

| 方案 | 本轮评分 / 100 | 交付或终止用时 |
|---|---:|---|
| Codex | 88 | 12m 20s |
| Cursor | 87 | 20m 16s |
| DeepSeek | 75 | 39m 21s |
| Doubao | 66 | 21m 59s |
| Qwen | 40 | 122m 10s — 强制终止 |
| Kimi | 18 | 31m 43s — 强制终止 |

每家一个当天正式样本，六轮均从系统初始化环境开始，EVAL统一采用Cursor SDK / auto-smart配置。四轮完成团队交付；Kimi未建立下游任务，千问只有部分交付。分数评价本轮集成表现，不等同于基础模型能力。Cursor有人工授权恢复；时间、费用、证据错配和接入故障均在正文单独解释。

文章与公开附件位于本网站的公开仓库，独立于CodeFlowMu私有实现仓库。页面包含真实文件及代码节选，但不公开完整私有日志、配置或代码树。
