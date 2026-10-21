---
title: 'Same Rankings, Different Welfare: A Small Counterexample with a Shared Optimum'
date: '2026-10-21'
column: digital-employee
category: daily
article_type: experiment-report
edition: research-center
research_question: 个人排序不变时，福利比较能否反转？
summary: A synthetic three-person assignment experiment reverses the welfare order of two feasible allocations while retaining a shared optimum. It does not replicate a real market or refute its reported representation decomposition.
sources: Project Swap; Strategic Tradeoffs v1; 2026-10-21 internal experiment
pageClass: "runtime-v6-article"
item_id: "SIG-20261021-005"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-10-21-sig-20261021-005-2026-10-21-preference-spacing.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-10-21-sig-20261021-005-2026-10-21-preference-spacing.png"
  kicker="Research"
  title="Same Rankings, Different Welfare: A Small Counterexample with a Shared Optimum"
  summary="A synthetic three-person assignment experiment reverses the welfare order of two feasible allocations while retaining a shared optimum. It does not replicate a real market or refute its reported representation decomposition."
  version="2026-10-21"
  languageHref="/zh/digital-employee/2026-10-21-preference-spacing"
  languageLabel="中文"
/>

<ArticleTableScroll language="en" />

<style>.runtime-v6-article .vp-doc h1[id] { display: none; }</style>

# Same Rankings, Different Welfare: A Small Counterexample with a Shared Optimum

Everyone can keep exactly the same ranking of books while two allocations exchange places on an aggregate welfare measure. For researchers evaluating agents that represent people, agreement on rankings is therefore insufficient to specify a unique welfare metric. A small, inspectable counterexample makes the distinction concrete—and its unchanged optimum limits what can be claimed.

## What the reported 85% actually measures

Anthropic’s Project Swap reports 61% pairwise agreement between model and human preferences. Evaluated on human rankings, the reported optimal allocation scores 0.89, an allocation optimized on model rankings scores 0.60, and the decentralized outcome scores 0.55. The authors attribute most of the gap from the optimum to preference representation rather than allocation conditional on that representation. [Research report, methods and Figures 3–5](https://www.anthropic.com/research/project-swap)

Using those rounded source numbers, `(0.89−0.60)/(0.89−0.55)` is approximately 85%. This is an arithmetic check of reported quantities, not an independent estimate. The decomposition is conditional on the participants, scoring convention and imputation procedure.

A ranking says which book is preferred. Adding utilities across people also requires a decision about the distance between ranks. The source explicitly uses linear rank utility and imputes unranked books; it reports robustness to several imputation choices. Our experiment changes utility spacing, a different assumption. It is not contrary evidence about that reported imputation robustness. [Methods, footnotes 12–18](https://www.anthropic.com/research/project-swap)

## A reversal with the rankings held fixed

The Research Center’s internal experiment, completed on October 21, 2026, enumerated all 216 complete preference profiles for three people and three books, with six one-book-per-person assignments for each profile. There were no agents, negotiations or real participants. For zero-based rank `r`, the score maps were `(2−r)/2` and its square: top-to-bottom scores of `1, 0.5, 0` and `1, 0.25, 0`. They preserve every individual ordering and the same feasible assignments. All 18 recorded pairwise-order controls passed.

One recorded counterexample uses these preferences. A, B and C name books rather than score categories.

| Person | Most to least preferred |
|---|---|
| First | A, B, C |
| Second | A, C, B |
| Third | B, A, C |

Every value below is a mean from the internal synthetic fixture. Assignments list the books received by the first, second and third person. These are not outcomes from the source market.

| Allocation | Books assigned | Linear mean | Squared mean |
|---|---|---:|---:|
| One | A, B, C | 1/3 | 1/3 |
| Two | B, C, A | 1/2 | 1/4 |
| Shared optimum | A, C, B | 5/6 | 3/4 |

The linear measure prefers allocation Two; the squared measure prefers One. Allocation One gives one person their top book and two people their bottom book. Allocation Two gives everyone their second choice. Reducing the utility attached to second place changes the aggregate comparison without reversing anyone’s preferences. This is internal experimental evidence, not an independent replication of Project Swap.

## The best allocation did not split

This counterexample reverses the order of two feasible outcomes, not the identity of the best outcome. For this profile, both scoring rules select A, C, B.

The broader negative result matters: across all 216 profiles, the experiment found zero cases in which the two sets of optimal allocations were disjoint. It retained every exactly tied optimum instead of selecting an arbitrary representative. That does not mean the optimal sets were identical in every profile, and it does not establish a result for larger markets.

The fixture supports the statement that ordinal agreement does not determine every welfare comparison. It does not support the statement that changing the score map necessarily changes the optimal allocation. Treating those as the same finding would inflate a useful counterexample into an unobserved result.

## Representation is a different task from bargaining

In Project Swap, agents must infer their principals’ preferences before trading on that representation. As a methodological comparator, the public first version of Strategic Tradeoffs gives matched agents explicit private valuations in a three-player, nine-turn chip game. Its authors report that some aggregate surplus outcomes resemble human outcomes while trading behavior differs. It does not pose the same preference-inference task. [Public v1, Sections 3–8](https://arxiv.org/html/2509.09071v1)

Our interpretation is that evaluation should account separately for preference elicitation, rank-to-utility assumptions, negotiation conditional on represented preferences, and realized fulfillment. Each has different inputs and failure conditions. An optimizer can execute correctly against a distorted representation; accurate elicitation does not itself ensure delivery. We ran neither bargaining nor delivery experiments, so this separation is an evaluation recommendation, not a measured improvement.

The studies cannot be pooled into a model capability ranking. The comparator supplies valuations and uses single-shot groups and constrained game rules; Swap includes elicitation and partial-ranking treatment. Our admitted reading used the openly readable 2025 v1. Retrieval of the 2026 proceedings page failed, and equivalence between those texts was not verified.

## Evidence and sources

“Source-reported” means a result attributed to the authors under their methods; we did not rerun their market. “Internal experiment” means the Research Center’s synthetic enumeration, not independent third-party validation. “Our interpretation” identifies the methodological inference drawn from those distinct materials.

- [Project Swap](https://www.anthropic.com/research/project-swap), Anthropic research report, captured for this reading on October 21, 2026. It directly supports attribution of scoring, preference agreement and the gap decomposition; it does not establish that we independently measured those quantities.
- [Project Swap appendix](https://www-cdn.anthropic.com/files/4zrzovbb/website/7dcd7d8de6e132048f391f5201439c5e11b9fb2c.pdf), public methods and limitations from the same author organization. It is not a second independent validation.
- [Strategic Tradeoffs v1](https://arxiv.org/html/2509.09071v1), public 2025 research-paper version. It supplies a comparison task with explicit valuations, not a replication or endorsement of Swap.
- Research Center internal experiment, October 21, 2026: three people, three books, 216 profiles and six assignments per profile. The record retains all profiles, score maps, the counterexample and the negative optimal-set result. Raw participant data and executable market code were not obtained.

Swap is also bounded by an employee convenience sample, low stakes, non-incentivized rankings, endline attrition, fixed rules and well-behaved agents. Its 200 reruns reuse participants, books and intake; they are not 200 independent participant samples. [Appendix and limitations](https://www-cdn.anthropic.com/files/4zrzovbb/website/7dcd7d8de6e132048f391f5201439c5e11b9fb2c.pdf)

## What real participant data must answer

Testing whether the source’s market-variant rankings depend on utility spacing requires the underlying participant data and participant-elicited or constrained spacing, followed by evaluation of the same allocations. Synthetic enumeration cannot substitute for that exercise or re-estimate the reported 85%.

Evaluators can act now by declaring their score assumptions and reporting elicitation, conditional execution and fulfillment separately. Whether elicitation accuracy predicts real participant satisfaction after accounting for delivery remains an open question. This experiment supplies no answer to it.
