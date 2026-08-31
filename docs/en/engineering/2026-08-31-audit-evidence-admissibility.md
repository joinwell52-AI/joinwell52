---
title: "If It Can Be Explained Afterwards, Was It Knowable Then?"
date: '2026-08-31'
updated: '2026-08-31'
column: open-source-engineering
category: daily
article_type: research-methodology
edition: research-center
research_question: "For the same audit proposition at different evidence cutoffs, how should an Agent Runtime distinguish evidence that exists, evidence that is admissible, and evidence that was available then?"
summary: "After replaying 1,187 CatchBench PRE configurations, we apply evidence cutoffs to time-separated artifacts from a real approval probe. The same Reader can make only the judgment allowed by the information budget at each cutoff. This is not a prediction of future duplication; it is a method for fixing the proposition and admissible evidence before evaluating an auditor."
sources: "/en/research/evidence/2026-08-31-runtime-continuity"
project_relevance: substantive-relationship
item_id: "RCR-20260831-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-31-audit-evidence-admissibility-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

[中文](/zh/engineering/2026-08-31-audit-evidence-admissibility)

<ArticleCover
  image="/assets/covers/daily-2026-08-31-audit-evidence-admissibility-cover.png"
  kicker="Runtime Continuity Research · 03"
  title="If It Can Be Explained Afterwards, Was It Knowable Then?"
  summary="Retrospective completeness is not contemporaneous knowledge, and existing evidence is not automatically admissible evidence."
  version="RCR-20260831-03"
  status="Research Method · 2026-08-31"
  languageHref="/zh/engineering/2026-08-31-audit-evidence-admissibility"
  languageLabel="中文"
/>

# If It Can Be Explained Afterwards, Was It Knowable Then?

An incident report can look complete: an action created an effect, an audit failed, and recovery created another effect. It is tempting to ask why an Agent did not catch the duplication earlier.

But were the report's facts available before the action, while it ran, or only after recovery had finished? Giving an auditor the final artifact set and calling its answer an early warning measures retrospective explanation, not what could have been known then.

Here “early” does **not** mean predicting that a second effect will certainly occur. It asks a narrower question: **before the second execution, was there already readable evidence that the first effect had happened?** If recovery does not read that evidence, it may treat an identifiable effect fact as unknown.

The external prompt is [CatchBench](https://arxiv.org/abs/2608.22808), an academic benchmark asking when Agent failure can be caught. It distinguishes three information states: PRE, LIVE, and POST. Its seven task contracts include evidential tasks and Gold-derived mechanism diagnostics; Gold is not a fourth information state. The author, Yue Zhao, is a USC Assistant Professor whose work includes AI auditing, agent safety, and anomaly detection. [USC profile](https://viterbi.usc.edu/directory/faculty/Zhao/Yue)

CodeFlowMu is the local multi-Agent collaboration system that we develop and maintain. It records sessions, tool execution, approvals, and results for engineering work. We first replay CatchBench's public PRE board, then apply time-based evidence cutoffs to artifacts captured from our own approval-fault probe. The resulting question is whether the changed answer comes from a changed method or a changed readable information set.

## 1. The first constraint: state what was readable

CatchBench's central reminder is that an audit is often constrained by the record rather than the method. We replayed only its fixed PRE path at `874433db`, under Python 3.10.11 with `python run.py --task pre`. We did not run LIVE or POST boards, Gold-derived diagnostics, or CodeFlowMu through CatchBench.

The output contains 1,187 declared configurations: crewai 298, injecagent 340, mcp 144, n8n 219, sweagent 130, and synthetic 56. They are configurations, not 1,187 newly executed Agent tasks. [Raw PRE output](/assets/evidence/2026-08-31-runtime-continuity/fixtures/catchbench-pre.log)

| Method | Precision | Recall | F1 | Coverage |
|---|---:|---:|---:|---:|
| Flag every risk | 0.430 | 1.000 | 0.601 | 1.000 |
| owasp_asi_combined | 0.511 | 0.910 | 0.654 | 1.000 |
| Cached llama-3.3-70b judgments | 0.594 | 0.839 | 0.695 | 0.996 |

The last row recomputes scores from existing repository judgments; it makes no new model call. Five configurations are absent from the same scoring set, so the higher number is not a general superiority claim. The always-flag baseline also reaches F1 0.601, and source-level F1 varies substantially. These values constrain method interpretation; they are not a CodeFlowMu score.

## 2. One run, four information budgets

We use one existing real-service probe: an approved synthetic local executor writes its first effect; its audit then fails; a new process later resumes the non-idempotent executor and writes another effect. The effect remains an isolated local file, not a remote service action.

The research script captures operation-state and effect snapshots at four points. The Reader answers only two propositions: whether independent effect evidence exists at the cutoff, and whether two distinct effects have already occurred at the cutoff. It does not determine business correctness and does not predict a future repeat.

| Cutoff | Operation state then | Readable effect evidence | First effect | Duplicate already observed |
|---|---|---|---|---|
| T0, approved but not executed | approved | no effect file in this budget | unknown | unknown |
| T1, first effect written | executing | 1 | yes | not_observed |
| T2, audit failure returned | failed | 1 | yes | not_observed |
| T3, new-process recovery returned | succeeded | 2 | yes | yes |

`not_observed` means “not observed in the current evidence,” not “will never happen.” T0's `unknown` means the Reader is not entitled to use the script's omniscient knowledge.

![A single evidence rail crosses a glass time plane: one cobalt marker is sharp before it and the matching marker is blurred beyond it.](/assets/figures/2026-08-31-audit-evidence-admissibility-time-plane.png)

*Figure 1. At T2 the Reader may read the first effect but cannot borrow the second effect that appears at T3. A blurred marker means future evidence is not yet admissible, not that it does not exist. Source: RCR-20260831 de-identified E-C1 timeline capture and Reader.*

The run produces seven evidence objects: four operation snapshots and three cumulative effect snapshots. At T2 the Reader accepts five objects and rejects two future T3 objects. It can establish the first effect, not an already-observed duplicate. [Timeline fixture](/assets/evidence/2026-08-31-runtime-continuity/fixtures/timeline.json)

The effect snapshots contain 1, 1, and 2 records. Adding rows would misleadingly produce four because the first two snapshots both contain `E1`; only the last adds `E2`. The Reader selects the newest snapshot at a cutoff and deduplicates effect IDs. **Evidence cutoff prevents future-information leakage; effect-ID deduplication prevents duplicate observation. They are different controls.**

## 3. Available evidence is not admissible evidence

The product-independent research Reader first fixes the proposition, then accepts only artifacts with the correct owner, at or before the cutoff, whose content matches the manifest. Only then does it read the newest allowed effect snapshot.

The four normal cutoffs are paired with four negative controls:

| Change | Constrained Reader result | What it prevents |
|---|---|---|
| N1 removes the effect file | both propositions `unknown` | treating `failed` or executor self-report as effect proof |
| N2 inserts another owner's two effects | rejects wrong owner; remains `unknown` | using another run's duplicate as this run's duplicate |
| N3 supplies T3 output to a T2 input | rejects after-cutoff items; sees one effect | presenting future evidence as earlier knowledge |
| N4 changes an effect snapshot while retaining its old hash | rejects integrity/unregistered item | treating altered data as evidence |

A deliberately weak reader that ignores owner, cutoff, and manifest says “duplicate already happened” for N2 and N3. It is not more intelligent; it has crossed the input boundary.

This produces the method's central concept: audit input is not every log one can find. It is the set of evidence admissible for the current **proposition, ownership, cutoff, and integrity** conditions. `evidence exists ≠ evidence admissible`, and final evidence is not necessarily evidence available at decision time.

The eight scenarios validate Reader behavior under designed evidence budgets. They are a **decidability experiment**, not a predictive-detection benchmark or a 100% accuracy claim. N3 proves compliance with a temporal information boundary; it does not prove future prediction ability.

## 4. A Runtime audit-read contract

For CodeFlowMu, SessionStore, operation records, and skill attribution are possible factual sources. The next engineering question is a Runtime Audit Read Contract:

- **Proposition** — what exactly is being judged?
- **Ownership** — which artifacts belong to this operation or run?
- **Cutoff** — until which decision point may they be read?
- **Integrity** — which records meet acceptable integrity conditions?
- **Unknown semantics** — if evidence is insufficient, is the result `unknown` or `false`?

This is not a new shipped audit Agent, and it does not replace REVIEW or EVAL. It fixes the comparison conditions before deciding whether an improved judge or earlier recording is the right investment.

The [bilingual evidence guide](/en/research/evidence/2026-08-31-runtime-continuity) provides the fixtures, Reader, negative controls, source provenance, and check commands. The product probe requires access to the fixed source; the public package does not claim independent QA or a live monitoring result.

**Reliable audit first fixes the proposition, then the evidence belonging to that judgment, the evidence readable at that time, and the meaning of insufficient evidence. Retrospective completeness does not mean contemporaneous knowledge; contemporaneous knowledge does not mean future prediction.**
