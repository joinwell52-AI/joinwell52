---
schema: "publication-candidate-article/v2"
title: "Each subtask is feasible. Why is the whole plan impossible?"
date: "2026-11-14"
published_date: "2026-11-14"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "Why can individually feasible agent subtasks form an impossible joint plan?"
summary: "Separate task orderings are feasible, yet their combined constraints form a strict cycle. A public 7+1 case shows why shared identity and joint checks matter in agent teamwork."
cover: "/assets/boundaryxp-cycle-20261114/boundaryxp-cycle.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Public saved case, 625-case statistics and selected mathematical reruns; no new product model or MCP-host analysis"
pageClass: "six-governance-article"
---

<ArticleCover image="/assets/boundaryxp-cycle-20261114/boundaryxp-cycle.cover-v1.png" kicker="Engineering research · Task boundaries" title="Each subtask is feasible. Why is the whole plan impossible?" summary="Separate task orderings are feasible, yet their combined constraints form a strict cycle. A public 7+1 case shows why shared identity and joint checks matter in agent teamwork." version="2026-11-14" languageHref="/zh/research/2026-11-14-boundaryxp-local-global-cycle" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.six-governance-article .vp-doc h1[id] { display: none; }</style>

# Each subtask is feasible. Why is the whole plan impossible?

A research task sheet asks a laboratory team to schedule four events in one round: a safety review, equipment startup, packaging, and sample testing. The lead sets a firm condition: **the safety review must finish before startup begins**. The work is then distributed. The TEST group wants startup finished before packaging; LAB wants packaging finished before testing; SAFETY wants testing finished before the safety review.

Each group's requirement can be scheduled alongside the lead's condition when considered alone. Put them together, however, and the order becomes:

> Safety review → startup → packaging → testing → safety review.

The first event must wait for the last, which must wait for the first. No group individually proposed an absurd instruction, yet the combined plan cannot run. This is [RT044, a saved task specification in BoundaryXP's public research materials](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/demo/reports/R389-383.en.md). It is a **counterexample about planned constraints**, not a report of an actual laboratory incident. It exposes a hard problem in multi-agent work: **local compliance does not imply a viable whole.**

## One task graph exposes what local checks miss

RT044 has one parent and six child tasks: seven nodes in all. The parent requires safety review A to end before startup D begins. TEST adds D→packaging B, LAB adds B→sample test C, and SAFETY adds C→A. The source also fixes the identity of these events: they occur **once, in the same round**. We cannot escape the loop by imagining a second packaging step or an earlier, separate review.

The [saved calculation record](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/paper/materials/evidence-r18/results/R389-383.json) checks the parent's constraints, the roles' additions, and the joint plan separately. The parent is satisfiable. Each of TEST, LAB, and SAFETY is satisfiable when its edge is added to the parent alone. Only the joint query reports a definite violation: strict precedence would require the start of A to precede itself.

| Scope examined | Result | Reason |
| --- | --- | --- |
| Parent task | Satisfiable | A can precede D |
| Each child ordering added to the parent on its own | Satisfiable | The other two orderings are not yet included |
| All three child orderings joined with the parent | Violated | The same four events form a strict cycle |

<figure>
  <img src="/assets/boundaryxp-cycle-20261114/boundaryxp-cycle.en.svg" alt="In RT044 the parent requires safety review A before startup D; TEST requires D before packaging B, LAB requires B before testing C, and SAFETY requires C before the same A, creating a strict cycle when combined" />
  <figcaption>The four orderings form a cycle only when combined. Amber marks closure, not a fault by SAFETY alone. These are planned constraints, not observed actions.</figcaption>
</figure>

This finding does not license blaming each group for an individual violation. The conflict belongs to the **combination**: remove any one of the three child edges and a valid ordering exists. The useful handoff is the complete path to whoever may revise the plan, followed by another comparison after at least one ordering changes.

## “7+1” is not eight boxes to tick

In [Wei Zhu's BXP preprint](https://doi.org/10.5281/zenodo.24072738), natural-language requirements are organized as “7+1”: input scope, output, actions, people and responsibilities, resources, version and basis, completion and stopping conditions, plus a separate prohibition boundary. In everyday terms: what goes in, what must come out, who does what, under which limits, when work stops, and what must never happen. BoundaryXP is the boundary-analysis tool built around this method.

These categories remind a reviewer to look beyond what a subtask proposes to do. In RT044, the responsibility view preserves which group proposed each ordering; input and version context preserve “this round, this occurrence”; the prohibition boundary preserves the prerequisite to startup. **The calculation depends on shared relations across those views.** TEST's packaging B must be LAB's B, and SAFETY's review A must be the parent's A. If those identities are linked incorrectly, precise arithmetic merely solves the wrong problem.

The views are therefore not eight independent scorers. In the public [analysis of 625 saved cases](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/paper/materials/manuscript.en.md), 3,257 of 3,469 recorded queries involve more than one view, and 900 bind more than one target node. These are **structural counts of saved queries**; they do not show that a model correctly understood every source sentence. They do show why filling out each category cannot replace checking the links between tasks. The preprint's formal guarantees also assume sound and complete source alignment, relation coverage, consistent interpretation, and exact query encoding. It does not establish lossless understanding of arbitrary language.

## “Missing information” and “known conflict” are different outcomes

Two other saved examples show why the method should not simply reject everything. In [RT042](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/demo/reports/R389-381.en.md), X uses one instrument from 10:00 to 11:00 and Y uses it from 11:00 to 12:00. The parent specifies half-open intervals and release at 11:00. The intervals touch but do not overlap, so the **task specification is within bounds**. In [L23-050](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/demo/reports/R389-153.en.md), a unique final approver must be named, but the text says only “he will confirm” without identifying that person. Preparatory child tasks are not automatically violations; the approver's identity in the complete specification remains **unresolved**.

Conversely, the presence of an unknown does not always make the answer unknown. In the saved EN20-007 case, known costs have a minimum total of **EUR 6,400** against a **EUR 6,000** cap. Given the source-backed assumptions that other costs are nonnegative and no credits apply, the plan already exceeds the cap by at least **EUR 400**, whatever the missing amount turns out to be. The saved model left one item unresolved; the calculator marked it violated. We reran the package's independent rational-arithmetic check of that lower bound. It verifies the **saved operands and stated assumptions**, not the model's interpretation of the original text.

The research package contains 625 task groups, 3,219 nodes, and 3,469 calculations. The saved whole-case verdicts agree with current annotations and with the calculator's aggregate verdicts in 625/625 cases. At item level there are still **nine disagreements and three unfinished calculations**. We reran the public classification script, six mathematical witnesses, and all nine saved EN20-007 checks; each passed. The 625/625 figure is **agreement within these current saved records**, not accuracy on unseen tasks or proof that all 3,469 items agree. The paper also groups the projects into only 518 exact source-structure groups: 625 project records are not 625 independent sources. The [published analysis](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/paper/materials/manuscript.en.md) makes these denominators and limits available for inspection. Our [English rerun record](https://github.com/joinwell52-AI/joinwell52/blob/main/research/manual-runs/2026-11-14-boundaryxp/00-report.en.md) lists the pinned revision, commands, and outputs.

## Bringing the check into an AI workflow does not grant permission to act

BoundaryXP exposes a [Model Context Protocol (MCP) interface](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/TOOLS.md) so a compatible host can discover tools, preview a complete task tree, save a confirmed revision, request one model analysis, and read the formal result. `bx_task_import` previews without saving; `bx_project_create` writes; `bx_analysis_submit` requires explicit confirmation of the model call; `bx_result_recheck` recomputes **saved operands** without a new model call and preserves the old result. Recomputing cannot repair a semantic error that mistakenly equated two distinct objects at the start.

The [0.4.0-rc.6 release record](https://github.com/joinwell52-AI/BoundaryXP/releases/tag/mcp-v0.4.0-rc.6) reports discovery of 18 tools and 10 resources on Windows x64. We downloaded the exact release archive and matched its SHA-256 to the published digest; we did not conduct a new model analysis through an MCP host in this round. The paper uses protocol draft.2, while the current workbench still has [documented draft.1 runtime differences](https://github.com/joinwell52-AI/BoundaryXP/blob/main/protocol/IMPLEMENTATION.md). One “published” label must not erase those separate identities.

Most of all, a boundary finding is not business approval. It can identify which constraints collide, which evidence is missing, and which calculation can be repeated. A responsible person and the host still decide whether to revise or execute a task. The interface leaves business decision and execution authorization unset.

Before distributing work across agents, ask four questions: **Do the subtasks refer to the same object? Has anyone checked their combined constraints after local checks pass? Can the unknown facts actually change the answer? Who can approve the next step on the complete evidence?** If the first answer is unclear, an elegant task graph and exact calculation are reasons to clarify, not to proceed.
