---
title: "Six AIs, One Task: What Happened?"
description: "An evidence-backed field test of six AI teams through CodeFlowMu and FCoP: assignment, delivery, independent EVAL and diagnosis."
outline: false
---

<ArticleCover
  image="/articles/codeflowmu-six-ai-20260909/assets/hero.png"
  kicker="MULTI-AGENT FIELD TEST"
  title="Six AIs, One Task: What Happened?"
  summary="An evidence-backed field test of six AI teams through CodeFlowMu and FCoP: assignment, delivery, independent EVAL and diagnosis."
  version="2026-09-09"
  status="Six runs · Independent EVAL · Public excerpts"
  languageHref="/zh/publications/codeflowmu-six-ai-20260909"
  languageLabel="简体中文"
/>

CodeFlowMu organizes team execution; FCoP persists assignments and reports. This article follows retained tasks, sessions, tool receipts, reports, approvals and EVAL records to compare how six integrated schemes interpreted and delivered the same assignment.

**[Read the full illustrated article](/articles/codeflowmu-six-ai-20260909/en.html)** · [Public sources and attachments](/articles/codeflowmu-six-ai-20260909/sources.en.html) · [Download the bilingual package](/articles/codeflowmu-six-ai-20260909/web-article.zip)

| Scheme | Run score / 100 | Time to delivery or termination |
|---|---:|---|
| Codex | 88 | 12m 20s |
| Cursor | 87 | 20m 16s |
| DeepSeek | 75 | 39m 21s |
| Doubao | 66 | 21m 59s |
| Qwen | 40 | 122m 10s — terminated |
| Kimi | 18 | 31m 43s — terminated |

One formal run per scheme, each starting after system initialization, with Cursor SDK / auto-smart as the common EVAL configuration. Four runs delivered; Kimi never created downstream tasks, and Qwen delivered only partially. Scores assess these integrated runs, not foundation-model capability. Cursor required authorized intervention; timing, cost limitations, evidence mismatches and integration failures are explained separately.

The article and public attachments live in this website repository, separately from the private CodeFlowMu implementation. Selected real file and code excerpts are shown; complete private logs, configuration and source trees are not distributed.
