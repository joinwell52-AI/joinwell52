---
title: TMPA–FCoP–CodeFlowMu Implementation Case — Draft I0.2
outline: deep
---

# TMPA–FCoP–CodeFlowMu Implementation Case / 工程实现案例

> Version: **I0.2**  
> Status: Public Engineering Case Draft / 公开工程案例草稿

## Purpose / 目的

This report records the engineering path from a working multi-Agent software-development team toward a governed Digital Employee Runtime.

本报告记录一个已经运行的软件开发多 Agent 团队，如何逐步演进为受治理的数字员工 Runtime。

## Existing engineering base / 现有工程基础

CodeFlowMu already provides:

- PM, DEV, OPS and QA role collaboration;
- FCoP TASK, REPORT, ISSUE and REVIEW lifecycle;
- Agent registry and sessions;
- task dispatch, retry and recovery;
- report, review and summary gates;
- ledger, diagnostics and EVAL;
- Browser, Windows and coding tools;
- Web and PWA operator surfaces.

The engineering strategy is therefore not a platform rewrite.

## Incremental path / 增量实施路径

```text
Stage 0  Baseline existing Open Dev Team behavior
Stage 1  Project existing work as TMPA through WorkDataPort + Outbox
Stage 2  Make Software Development Position and Work Skills explicit
Stage 3  Generalize fixed worker roles through TeamPolicy
Stage 4  Add Operation Nodes, semantic state and recoverable execution
Stage 5  Run a second non-development employee: Saige short rental
Stage 6  Build a Studio only after the runtime model is proven
```

第一阶段不删除 PM，也不重写现有团队制度。先保持行为不变，再逐步外置软件开发领域假设。

## Formal separation / 正式分层

```text
Runtime Trace
  low-level tool and debugging detail

TMPA Semantic Event
  business-meaningful observation, action and state change

FCoP Coordination
  formal responsibility handoff and review
```

## Completion gates / 完成门禁

```text
Business Completion Gate
AND Runtime completion
AND FCoP coordination closure
AND TMPA publication readiness
AND independent verification
AND required human authority
→ WorkOrder may close
```

## Decisive test / 决定性测试

The same Core must operate both the existing Open Dev Team and the Saige short-rental Digital Employee without adding business-specific role order or workflow rules to Core.

If the second position requires rewriting Core, the platform is still a domain-specific multi-Agent application rather than a general Digital Employee Runtime.

## Evidence and limitations / 证据与局限

The case is grounded in real CodeFlowMu and FCoP implementation history, including lifecycle, review gates, diagnostics, recovery and multi-role task closure. I0.2 is still an editorial case draft and will require a stable evidence appendix, reproducible runs and versioned code references before formal publication.
