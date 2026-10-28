---
title: "A review outcome can hide two different errors"
date: '2026-10-28'
column: open-source-engineering
category: academic
article_type: research-note
edition: research-center
research_question: "送审指标合并不同参考类别时，会隐藏什么？"
summary: "A runnable metric audit returns 0.0067 from inputs reconstructed from a paper's narrative, while its table reports 0.0267. The cause remains unresolved; the discrepancy shows why review metrics need the original reference class."
sources:
  - https://arxiv.org/html/2609.37457v1
  - https://github.com/vtavakkoli/veriweave-govern/tree/77cf503e6cfaf35bc9e0dc7f03faa6bc832d02ec
  - https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
pageClass: "runtime-v6-article"
item_id: "academic-metric-boundaries"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-10-28-academic-metric-boundaries-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-10-28-academic-metric-boundaries-cover.png"
  kicker="Research"
  title="A review outcome can hide two different errors"
  summary="A runnable metric audit returns 0.0067 from inputs reconstructed from a paper's narrative, while its table reports 0.0267. The cause remains unresolved; the discrepancy shows why review metrics need the original reference class."
  version="2026-10-28"
  languageHref="/zh/engineering/2026-10-28-academic-metric-boundaries"
  languageLabel="中文"
/>

<ArticleTableScroll language="en" />

<style>.runtime-v6-article .vp-doc h1[id] { display: none; }</style>

# A review outcome can hide two different errors

Sending a permitted operation to a human can add delay. Sending a prohibited operation to a human changes a refusal into a different decision. Both end in review, but they displace different reference answers. Evaluating agent authorization requires retaining that distinction alongside the final outcome.

We followed a small numerical discrepancy through a governance paper and its public metric function. The audit is runnable. It does not establish which record from the original experiment needs correction.

## The same output, different reference answers

The VeriWeave Govern paper defines false-review rate as cases whose reference answer is allow but whose prediction is review, divided by all cases. Elsewhere, it describes four model errors: one allow-to-review and three deny-to-review transitions. Its table reports a false-review rate of 0.0267. [Equation 8, Table 13 and section 5.4](https://arxiv.org/html/2609.37457v1)

These statements permit a conditional arithmetic check. **If the error-direction narrative is complete and correct**, the narrow numerator is one. Counting every non-review reference answer changed to review gives four. Sharing a denominator does not make those numerators describe the same metric.

| Reference → prediction | Reconstructed count | Included in the stated false-review definition |
| --- | ---: | --- |
| Allow → review | 1 | Yes |
| Deny → review | 3 | No; report separately |
| Correct decision → same decision | 146 | No |

This table is an internal reconstruction from the narrative, not the authors' original row-level predictions or newly collected task data. Review is not execution: a deny-to-review error does not by itself establish an unauthorized side effect.

## Running the pinned metric function

The [code revision we inspected](https://github.com/vtavakkoli/veriweave-govern/blob/77cf503e6cfaf35bc9e0dc7f03faa6bc832d02ec/research/metrics.py) counts only allow-to-review transitions in its false-review function, matching the equation. Our internal probe executes that function directly. A broader count is computed separately to explain the difference; the upstream function is unchanged.

On the 150 reconstructed entries, the narrow rate is `1/150 = 0.0067`; the broader rate is `4/150 = 0.0267`. Accuracy and macro-F1, the average of class-level F1 scores, are `0.9733` and `0.9573`, matching the corresponding aggregates. This is a consistency check, not recovery of the original case identities.

Two controls help bound the result. Reconstructing the deterministic systems' reported error directions returns `30/150 = 0.2000` false reviews. An intentionally uninformative all-review control has zero false allows but accuracy of only `0.1333`. That control is not a measured system result. It demonstrates why zero false allows alone cannot distinguish useful discrimination from delegating every decision to people.

Download the [minimal audit package](/assets/evidence/2026-10-28-academic-metric-boundaries/metric-audit.zip), extract it, and run `python audit.py`. It includes the upstream function, license, explicitly reconstructed inputs and expected output. It computes classification counts without calling a model or starting the authors' governance service.

## A discrepancy without a completed attribution

The public [paper-results description](https://github.com/vtavakkoli/veriweave-govern/blob/77cf503e6cfaf35bc9e0dc7f03faa6bc832d02ec/results/paper-2026/README.md) says its aggregates were transcribed from the manuscript and do not replace original predictions or annotations. The complete repository tree we inspected lacks the completed prediction and annotation files for that run. We therefore cannot determine whether the table, narrative, or historical metric version explains the difference, or revise the model ranking from this audit.

The paper, author repository and transcribed manifest belong to one research source. Their agreement helps trace provenance but is not independent empirical validation. Our probe is internal experimental evidence; we obtained no third-party replication of the original experiment. Accessibility, formal publication and peer review cannot supply that missing evidence automatically.

## Retain the direction of each error

Keep a full three-class confusion matrix beside aggregate results: reference decisions crossed with predicted decisions. Report false allows, allow-to-review and deny-to-review transitions separately, with explicit denominators. A business may need the broader measure of all additional reviews, but it should give that measure a distinct name and definition.

This also fits the distinction between an execution transcript and an actual outcome in Anthropic's [agent-evaluation methodology](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents). That institutional document supplies independently authored methodological context; it does not verify the numerical discrepancy examined here.

This check applies to allow/review/deny classification; a binary system needs a different specification. It does not test service security, human-review effectiveness or actual queue load. Explaining this discrepancy further requires original predictions, annotations and the calculation version bound to the manuscript. The bounded lesson is to preserve where an error came from before deciding what review costs.
