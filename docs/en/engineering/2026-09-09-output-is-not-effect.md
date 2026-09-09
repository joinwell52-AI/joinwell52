---
schema: "publication-candidate-article/v2"
title: "The Tool Result Was Blocked. Why Had the Operation Already Run?"
date: "2026-09-09"
published_date: "2026-09-09"
column: "open-source-engineering"
category: "daily"
article_type: "comparative-engineering-analysis"
edition: "research-center"
research_question: "The Tool Result Was Blocked. Why Had the Operation Already Run?"
summary: "An upstream middleware experiment produced executed and blocked receipts for one call. Output withholding and execution prevention describe different stages."
cover: "/assets/verification-evidence-20260909/03-output-is-not-effect.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded experiments; not independent QA; dependency substitutions disclosed"
pageClass: "verification-evidence-article"
sources:
  - "https://github.com/ag2ai/ag2/pull/3240"
---

<ArticleCover image="/assets/verification-evidence-20260909/03-output-is-not-effect.png" kicker="Engineering · Experimental research" title="The Tool Result Was Blocked. Why Had the Operation Already Run?" summary="An upstream middleware experiment produced executed and blocked receipts for one call. Output withholding and execution prevention describe different stages." version="2026-09-09" languageHref="/zh/engineering/2026-09-09-output-is-not-effect" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.verification-evidence-article .vp-doc h1[id] { display: none; }</style>

# The Tool Result Was Blocked. Why Had the Operation Already Run?

One tool call produced an `executed` receipt followed by a `blocked` receipt. A screen showing only the last word could suggest that nothing happened.

Our fixture's counter said otherwise: the tool ran once. Its returned content was withheld afterward.

There is no contradiction. “Blocked” needs an object: the call, the returned information, or subsequent processing. Compressing these into one overall status can erase precisely the detail that governance added.

## Permission to call is not permission to disclose

AG2 is an open-source agent application framework. [PR #3240](https://github.com/ag2ai/ag2/pull/3240) proposes scanning tool output because an authorized call can still return sensitive information. Input checks cannot inspect data that has not yet been returned.

We fixed the then-unmerged commit `bf363ef52853e7b918863dec2fe1e3902b811e6f` and exercised its original middleware entry point. Sensitive-looking strings came from public test fixtures, not credentials.

In the enforced secret case, the tool counter reached one, the result became a governance error, and the returned object no longer contained the fixture secret. Receipts recorded execution and subsequent withholding.

That establishes behavior at this middleware boundary. The tool was a counter fixture; no business write, network effect, or actual model-context ingestion was tested.

## Modes and containers change the boundary

We retained the upstream policy, scanning, rewriting, and receipt logic while replacing framework event shells. Every case passed through the original `on_tool_execution`; two independent processes produced the same observations.

| Condition | Tool executions | Fixture content in returned object | Receipt sequence |
| --- | ---: | --- | --- |
| ENFORCE, successful secret text | 1 | Withheld | executed → blocked |
| MONITOR, same text | 1 | Redacted | executed → executed |
| OBSERVE, same text | 1 | Preserved | executed |
| ENFORCE, secret in error object | 1 | Preserved | error |
| FLAG policy | 1 | Preserved, finding recorded | executed → executed |
| Secret in structured value | 1 | Withheld | executed → blocked |
| Secret in structured key | 1 | Preserved | executed |
| SSN in structured string value | 1 | Redacted | executed → executed |

OBSERVE and FLAG are explicit policy choices, not bypass discoveries. MONITOR converts a blocking finding into redaction, so “not enforced” does not always mean “untouched.”

## An error is another output path

The original code scans successful text parts and structured string values. It returns error objects directly. Its mapping traversal visits values, not keys.

The same fixture secret therefore receives different treatment when moved from successful text into an error object or dictionary key. That establishes scan coverage, not confirmed leakage into a real model: other framework stages might serialize, sanitize, or restrict these objects.

A useful review matrix names the containers and modes explicitly. Otherwise a successful text test can quietly become an unsupported claim about every return path.

## Receipts need a stage

The sequence `executed → blocked` accurately describes an executed tool whose result was withheld. A consumer that treats the final receipt as the whole action's status loses this distinction.

Conversely, `executed → executed` need not mean two executions. In our monitor and flag cases the counter remained one; the second receipt described output governance.

Receipt counts are not tool counts. A clearer representation would identify the call, the recorded stage, whether execution occurred, and whether returned information was permitted onward. This is a design recommendation, not an implemented universal receipt contract.

For a real effectful tool, withheld output would not undo the effect. That is an inference from the ordering, not a business transaction reproduced here. Whether to retry must depend on the operation's own identity, reconciliation, or idempotency contract.

The [evidence guide](https://joinwell52-ai.github.io/joinwell52/en/research/evidence/2026-09-09-verification-evidence) preserves eight cases and the precise substitution boundary. Actual Agent integration, message serialization, model ingestion, and external effects remain untested.

The input boundary decides whether a tool may act. The output boundary decides what information may continue after it acts. Both matter because they answer different questions.

