---
schema: "publication-candidate-article/v2"
title: "When an AI team fails, who checks the checker?"
date: "2026-09-18"
published_date: "2026-09-18"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "When an AI team fails, who checks the checker?"
summary: "One of two answers is wrong, yet the score is 100%. Original evaluation code and public annotations show why tools that diagnose agent failures need checks of their own."
cover: "/assets/six-governance-20260918/checking-the-checker.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded original-code and public-artifact study; scope stated in text"
pageClass: "six-governance-article"
---

<ArticleCover image="/assets/six-governance-20260918/checking-the-checker.cover-v1.png" kicker="Open-source engineering · Experimental research" title="When an AI team fails, who checks the checker?" summary="One of two answers is wrong, yet the score is 100%. Original evaluation code and public annotations show why tools that diagnose agent failures need checks of their own." version="2026-09-18" languageHref="/zh/research/2026-09-18-checking-the-checker" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.six-governance-article .vp-doc h1[id] { display: none; }</style>

# When an AI team fails, who checks the checker?

Two questions. One correct answer. A score of 100%.

This was not an AI confidently inventing a result. We ran a real open-source evaluation program with two synthetic predictions. For one case, the correct step was 1 and the predicted step was 10. The program checked whether the string “1” occurred inside “10” and counted it as correct. Integer equality would give this two-case set 50%.

Before asking another AI to explain why a team failed, we may need to check what its evaluation tools mean by “correct.”

## Why these two projects mattered to us

Our research concerns governance of work shared among multiple agents: how to understand where a task went wrong beyond a final completion message.

[MAST](https://arxiv.org/abs/2503.13657v3), co-authored by Lakshya A. Agrawal, provides a vocabulary for classifying failures. [Who&When](https://arxiv.org/abs/2505.00212v3), by Shaokun Zhang and colleagues, asks which agent and which step were responsible. Classification and localization could both help engineering review.

We followed the papers into their repositories and public data. This was a bounded artifact study, not a rerun of their model experiments. We examined label meaning, scoring behavior, and whether a correct outcome necessarily implied an acceptable process.

## A step number is an identifier

The tested Who&When evaluator uses substring membership. Because that operation is directional, we tested both directions and controls.

| Reference step | Prediction | Upstream scoring | Integer equality |
| --- | --- | --- | --- |
| 1 | 1 | Correct | Correct |
| 1 | 10 | Correct | Incorrect |
| 10 | 1 | Incorrect | Incorrect |
| 2 | 10 | Incorrect | Incorrect |

We then passed a prediction file containing one false match and one exact match through the original command-line entry point. It reported 100%, confirming that the behavior survives the file parser and evaluation path.

![The same two synthetic inputs receive different scores under two rules](/assets/six-governance-20260918/checking-the-checker.figure.en.svg)

*Figure 1. The same two synthetic cases score 100% with the original evaluator and 50% with integer equality. Source: attribution-cli-control.json and the original CLI control experiment; not a rescore of the paper’s results.*

Another researcher had already raised the matching issue in [Issue #14](https://github.com/ag2ai/Agents_Failure_Attribution/issues/14). Our contribution is a controlled replication, not a claim of discovery or a rejection of the paper.

We also inspected all 184 reference records. For 22, a different index within the recorded history length can contain the correct index as a substring. This describes possible inputs. **It does not mean the model actually made 22 such errors.** Without the corresponding original predictions, we cannot determine how much any published score changes.

Reference labels, predictions, and evaluator code are separate pieces of evidence. One cannot stand in for the others.

## The same category number can mean different things

MAST exposed a different interpretation problem. At a pinned dataset revision, the public human-label file contains 19 records across annotation rounds: five with 18 categories, ten with 17, and four with 14.

These are not interchangeable schemas. Category `1.2` describes a reasoning–action inconsistency in earlier rounds and a role-specification violation in the final group. Combining records by numeric code alone would mix different phenomena.

Our data check agrees with the existing report in [Issue #18](https://github.com/multi-agent-systems-failure-taxonomy/MAST/issues/18). A taxonomy evolving during research is unsurprising. What downstream users need is an explicit version and a justified mapping, where one exists.

We therefore did not collapse these records into a tidy ranking of common multi-agent failures. Preserving the versions was more informative than producing a number whose meaning was unclear.

## A correct answer can coexist with a process problem

We separately inspected all 31 immediate AG2 files ending in `human.json` at the fixed repository commit. These use an older 22-label scheme, so we did not merge them into the 14-category taxonomy.

Seven records were labeled as making no attempt to verify the outcome; nineteen as having an insufficiently critical evaluator. The groups may overlap. They cannot be added into a failure rate. One record was marked both correct in outcome and problematic for stopping behavior and ignoring another agent’s suggestion.

Users may recognize that distinction: an agent correctly explains that information is missing, while another role continues asking it to finish. The answer can remain defensible while the collaboration wastes effort and lacks a clear basis for stopping.

These are observations about released annotations, not new human judgments or agent runs. They motivate two separate questions: was the answer correct, and was the work carried out in a controllable, explainable way?

## Useful checks must themselves be checkable

Failure classification and attribution make vague complaints about reliability more concrete. Before their outputs inform decisions, however, preserve the dataset revision, label definitions, raw predictions, and scoring rules.

A cheap additional safeguard is a small set of known-answer controls: similar-looking identifiers, missing predictions, and differing label versions. Verify the checker before relying on its conclusions.

For researchers, our next question is whether explicit label mappings and exact-match scoring can be released together for comparison. For users, we would like concrete examples of correct answers reached through repeated work, unclear stopping, or missing verification. A specific handoff is more useful evidence than a general claim that a team “lost control.”

This study supports a method for checking evidence. It does not establish that any particular governance protocol has solved these problems.

Study date: 17 September 2026. See the [experiment report](https://github.com/joinwell52-AI/joinwell52/blob/d258d0b925af198f0920fc6e897c390e02979900/research/manual-runs/2026-09-17-six-governance/00-report.md) for commits, hashes, scripts, and limitations. Synthetic controls, artifact inspection, and existing upstream reports are distinguished throughout; we did not recompute the paper’s full results.

[Research repository](https://github.com/joinwell52-AI/joinwell52)
