---
title: What has a scientific agent completed when its best attempt is retained?
date: '2026-10-22'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: 保留最高分尝试是否意味着过关及真正恢复？（Does retaining the highest-scoring attempt establish gate attainment and genuine recovery?）
summary: A synthetic best score below the acceptance threshold separates result retention, gate attainment and scientific-process recovery.
sources: OmicsBench; ST-Bench; 2026-10-22 internal selector probe
pageClass: "runtime-v6-article"
item_id: "SIG-20261022-003"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-10-22-sig-20261022-003-2026-10-22-scientific-best-attempt-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-10-22-sig-20261022-003-2026-10-22-scientific-best-attempt-cover.png"
  kicker="Research"
  title="What has a scientific agent completed when its best attempt is retained?"
  summary="A synthetic best score below the acceptance threshold separates result retention, gate attainment and scientific-process recovery."
  version="2026-10-22"
  languageHref="/zh/digital-employee/2026-10-22-scientific-best-attempt"
  languageLabel="中文"
/>

<ArticleTableScroll language="en" />

<style>.runtime-v6-article .vp-doc h1[id] { display: none; }</style>


# What has a scientific agent completed when its best attempt is retained?

Three attempts score 0.6, 0.5 and 0.4. The system retains the first result. It has correctly selected the maximum, but has not reached a 0.7 gate. For engineers evaluating scientific agents, this synthetic example separates three judgments: having a result worth retaining, passing a grading requirement, and correcting the analytical process. Completion records should expose those judgments separately; readers can use that distinction to audit recovery claims.

## Selecting the maximum does not decide acceptance

OmicsBench organizes continuous interaction into 97 task dependency graphs containing 662 subtasks, with one subtask per user turn. Its paper specifies up to three attempts in the feedback-gated setting and a 0.7 threshold. If the best attempt was not the last, its workspace is restored before continuing. [Methods and Appendix C.2](https://arxiv.org/html/2610.21074)

This article uses the same-day Analysis stage's internal experiment; it does not rerun the benchmark. That stage extracted the original best-attempt selection function from a pinned source revision and executed four synthetic cases:

| Synthetic score sequence | Original function selects | What it establishes |
|---|---|---|
| 0.6, 0.5, 0.4 | Attempt 1, score 0.6 | The maximum can remain below the gate |
| 0.4, 0.8, 0.8 | Attempt 2, score 0.8 | The earliest highest-scoring tie is retained |
| Both scores absent | No selected result | Missing scores differ from zero scores |
| 0, 0 | Attempt 1, score 0 | Zero remains a selectable graded score |

Source: internal isolated probe, 2026-10-22, executing the original pinned selector on synthetic inputs. Gate comparisons and restore-needed conditions were calculated separately by the probe; they are not full-runner execution results. The source is pinned to the [a14a3e5 grading loop revision](https://huggingface.co/datasets/gideonshaked/OmicsBench/raw/a14a3e5db031f76dcc463281ff5e1cba7c14b4e3/omicsbench_runner/src/omicsbench/_orchestrator/grading_loop.py).

This identifies no selector defect. Selecting the maximum is a different responsibility from deciding acceptance. The second case is also not a reproduced loop trajectory: a loop using the 0.7 gate would stop at the first 0.8 and might never produce the later tie. It is a function-level tie control.

## What evidence is still missing after files are restored?

The inspected source captures workspace snapshots for gated attempts and raises an error if snapshotting fails. When restoration is needed, it stops agent processes before restoring the selected directory. This supports a description of the implementation path; it does not mean this study executed restoration. The internal probe ran no snapshots, restoration, model calls, grader databases or scientific computation.

There is a further evidentiary step between restoring the highest-scoring files and establishing that faulty analysis was corrected. The paper's authors explicitly characterize gated gains as an upper bound on genuine recovery because reward hacking remains unquantified. They also report failures including option exhaustion under feedback and substituted selection criteria. Our interpretation is that scoring outcomes need separate process evidence: without an inspectable connection between data, analytical steps and output, a higher score alone cannot establish process correction. [Sections 4.4–4.5 and limitations](https://arxiv.org/html/2610.21074)

Conversation context and restored files can also occupy different historical positions; the next prompt warns about restoration. That implementation fact raises a dependency-consistency question. This study did not measure how many downstream errors it causes, so a possible risk cannot become an observed failure rate.

## “Better” answers different questions in the two benchmarks

ST-Bench provides another completion record worth separating. Its test score combines realistic-output coverage with conditional metric pass rate within each task, then aggregates across tasks. The output filter checks that named metrics are parsable and finite, include a positive value, and contain no -1. Those are operational scoring conditions, not independently verified scientific computation. [Section 3.2](https://arxiv.org/html/2610.07763)

Its authors report that multi-agent improvements mainly reflect wider output coverage, while conditional pass rates cluster around 50%–58%; some configurations also consume more inference time. OmicsBench instead reports scoring improvements from feedback retries over single-pass execution. These remain source-reported claims: neither paper's result tables were replicated here. [ST-Bench, Sections 4.2–4.3](https://arxiv.org/html/2610.07763); [OmicsBench, Section 4](https://arxiv.org/html/2610.21074)

The comparison therefore concerns evidence contracts. One benchmark separates output coverage from conditional quality; the other adds grading feedback, best-attempt selection and workspace restoration. Different units, interventions and cost scopes prevent pooling their scores into a general multi-agent advantage. The feedback setting is not a multi-agent treatment. ST-Bench's query splits also vary within the same set of tasks rather than testing generalization to held-out tasks.

## Four questions that make a completion record inspectable

Our engineering recommendation concerns scientific evaluation systems rather than endorsement of a framework. Ask which attempt produced the retained artifact; what score and grader version belong to that attempt; whether that score meets an explicit threshold; and what establishes correction of the analytical process rather than a closer match to the grader.

The first three can bind attempt identity, artifact hash, grader version and gate decision. The fourth needs separate process material, such as recomputable intermediate results and input-to-output linkage. These are proposed evidence requirements, not capabilities demonstrated here. Even with the first three complete, the fourth can remain unknown. Conversely, a selector responsible only for ranking results should not be required to establish the entire scientific process.

## Evidence and sources

Public primary-source facts here are definitions and pinned source behavior that can be directly checked. Source-reported claims are author results not replicated in this study. Internal experimental evidence is our own synthetic-input probe, not independent third-party evidence; interpretations are bounded inferences from those materials. No independent reproduction of either complete benchmark result is established here.

The principal sources are the ST-Bench team's [preprint, 2610.07763v1, 2026-10-06](https://arxiv.org/html/2610.07763), the OmicsBench team's [preprint, 2610.21074v1, 2026-10-15](https://arxiv.org/html/2610.21074), and its [pinned original grading source](https://huggingface.co/datasets/gideonshaked/OmicsBench/raw/a14a3e5db031f76dcc463281ff5e1cba7c14b4e3/omicsbench_runner/src/omicsbench/_orchestrator/grading_loop.py). The internal probe used Windows 11 and Python 3.13.15, executing isolated original-function code. The 94 private tasks and missing runnable artifacts still limit complete replication. Publication, citation and peer review cannot substitute for validity evidence, and successful code execution does not establish general validity.

## Recovery questions that remain open

How much gain survives equal-compute retries without feedback? After excluding reward hacking, how much comes from genuine analytical correction? Answering those questions requires research beyond the selector probe. This article supplies an audit boundary: record retention and gate attainment separately, and leave recovery unknown when process evidence is missing.
