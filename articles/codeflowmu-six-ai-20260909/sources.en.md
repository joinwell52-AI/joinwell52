# Public sources and reading guide

[Full English article](en.html) · [完整中文文章](index.html) · [中文来源说明](sources.html)

This article is published in the public **joinwell52-AI/joinwell52** website repository. CodeFlowMu's implementation repository is private and is not a prerequisite for reading this article. The public package is a selected disclosure of analysis, figures, evidence excerpts and provenance, not a complete dump of the experiment machine.

## What you can inspect here

| Public artifact | Language | What it establishes |
|---|---|---|
| [Full analysis](en.html) | English | Methods, six individual results, scores, PM behavior, integration limits, EVAL and conclusions |
| [Full analysis](index.html) | Chinese | The corresponding Chinese article with original task text and literal excerpts |
| [Score data](scorecard.csv) | English fields; original model labels | Six dimensions and totals; weights are completion 25, quality 30, efficiency 15, scope 15, recovery 10, observability 5 |
| [Timing data](timing.csv) | English fields; Chinese outcome labels | UTC start/end, elapsed seconds, completion versus termination, and two tool-count fields |
| [Stage timeline](stage-timeline.csv) | Mixed | PM assignment, downstream execution, reporting and acceptance timing |
| [Evidence inventory](business-evidence-index.html) | Chinese | The actual types of retained files and how CodeFlowMu links them to work |
| [TASK / REVIEW / REPORT excerpts](evidence-excerpts.html) | Original Chinese and YAML | Selected fields and report paragraphs, with source file names and hashes |
| [EVAL code excerpts](eval-generation-code.html) | Original TypeScript; Chinese explanation | Collection, independent analysis, format validation and durable report writing; explained in English in section 3.9 |
| [EVAL comparison and source assessment](EVAL对照与来源.html) | Chinese | Differences between panel observation, task analysis, and disputed cross-run material |
| [Kimi error evidence](kimi-failure-evidence.html) | Exact English error strings; Chinese explanation | One encrypted_content rejection, six overload-related stream failures, and the limits of attributing root cause |
| [Integration checks](接入影响核对.html) | Chinese | Test-version adapter behavior and what it does and does not explain |
| [Detailed six-run report](六平台系统巡检总报告.html) | Chinese | Extended analytical tables, issue reassessment, scoring rationale and source IDs |
| [Public provenance index](source-index.json) | Source labels in Chinese | Source IDs and available original-archive hashes, without private file paths |

The English article is complete prose, not an abstract. Screenshots, original mechanism diagrams, exact report excerpts and some source attachments retain their original Chinese text. Four numerical figures use English labels. File names and source strings are preserved to make cross-referencing possible.

## Evidence boundaries

TASK and REPORT files state assignments and deliverables. Runtime events and formal receipts provide execution and submission evidence. REVIEW and approval records distinguish verified execution from a business decision. EVAL independently questions these records; it does not replace them. Analysis checks model, time window, session and file identity before combining evidence.

A file hash identifies retained bytes. It does not let a reader verify undisclosed content or automatically establish the truth of a report. The selected public excerpts support the article's explanation; full reproducibility of every historical call would require access to the privately retained original material. Failed runs, missing final EVAL reports and disputed evidence associations are disclosed rather than treated as successful observations.

No API credentials, browser profiles, raw session archives or full private source tree are included. The short source excerpts were selected specifically to explain the mechanism at test commit `cb590ce35686cb1980e3c89a7d68bd0cfbeb825a`. They are not an open-source release of CodeFlowMu.

## Download and citation

[Download the bilingual article package](web-article.zip) · [Public file manifest](public-manifest.json) · [Public repository folder](https://github.com/joinwell52-AI/joinwell52/tree/main/docs/public/articles/codeflowmu-six-ai-20260909)

Suggested citation: joinwell52-AI. *Six AIs, One Task: What Happened? A CodeFlowMu and FCoP Field Test.* Runs September 9, 2026; article September 10, 2026. This is a six-run case study, not a general foundation-model leaderboard.
