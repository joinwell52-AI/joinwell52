---
title: TMPA–FCoP–CodeFlowMu Implementation Case — Draft I0.2
outline: deep
---

<ArticleCover
  image="/assets/covers/implementation-case.svg"
  kicker="Engineering Case"
  title="TMPA–FCoP–CodeFlowMu Implementation Case"
  summary="The engineering path from a working multi-agent software team toward a governed Digital Employee Runtime."
  version="I0.2"
  status="Public engineering case draft"
  languageHref="/zh/publications/implementation-case-i0.2"
  languageLabel="简体中文"
/>

## Purpose

This report records the engineering path from a working multi-agent software-development team toward a governed Digital Employee Runtime.

## Existing engineering base

CodeFlowMu already provides:

- PM, DEV, OPS and QA collaboration;
- FCoP TASK, REPORT, ISSUE and REVIEW lifecycle;
- Agent registry and sessions;
- task dispatch, retry and recovery;
- report, review and summary gates;
- ledger, diagnostics and EVAL;
- Browser, Windows and coding tools;
- Web and PWA operator surfaces.

The strategy is therefore incremental rather than a platform rewrite.

## Incremental path

```text
Stage 0  Baseline existing Open Dev Team behavior
Stage 1  Project existing work as TMPA through WorkDataPort + Outbox
Stage 2  Make Software Development Position and Work Skills explicit
Stage 3  Generalize fixed worker roles through TeamPolicy
Stage 4  Add Operation Nodes, semantic state and recoverable execution
Stage 5  Run a second non-development employee: Saige short rental
Stage 6  Build a Studio only after the runtime model is proven
```

## Formal separation

```text
Runtime Trace
  low-level tool and debugging detail

TMPA Semantic Event
  business-meaningful observation, action and state change

FCoP Coordination
  formal responsibility handoff and review
```

## Completion gates

```text
Business Completion Gate
AND Runtime completion
AND FCoP coordination closure
AND TMPA publication readiness
AND independent verification
AND required human authority
→ WorkOrder may close
```

## Decisive test

The same Core must operate both the current Open Dev Team and the Saige short-rental Digital Employee without adding business-specific role order or workflow rules to Core.

If the second Position requires rewriting Core, the platform is still a domain-specific multi-agent application rather than a general Digital Employee Runtime.

## Evidence and limitations

The case is grounded in real CodeFlowMu and FCoP implementation history, including lifecycle, review gates, diagnostics, recovery and multi-role task closure. I0.2 still requires a stable evidence appendix, reproducible runs and versioned code references before formal publication.
