---
title: "Changing the Control Surface Must Not Split One Business Effect"
date: '2026-09-08'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "当智能体在图形界面、命令行和工具调用之间切换，并共同修改同一份应用状态时，怎样保证这些动作仍属于同一次可审计的业务效果？"
summary: "CUA-Universe places GUI and CLI actions over one persistent application state and verifies hybrid trajectories with screenshots, command results, and exported artifacts. Control surfaces may change, but business-effect identity should remain stable; authorization, idempotency, and commit evidence still require separate gates."
sources:
  - research/analysis/Q-20260908-03-cross-surface-effect-provenance.md
item_id: "Q-20260908-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-08-one-effect-across-surfaces-editorial-v2.webp"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-08-one-effect-across-surfaces-editorial-v2.webp"
  kicker="Open-source Engineering · Daily Research"
  title="Changing the Control Surface Must Not Split One Business Effect"
  summary="CUA-Universe places GUI and CLI actions over one persistent application state and verifies hybrid trajectories with screenshots, command results, and exported artifacts. Control surfaces may change, but business-effect identity should remain stable; authorization, idempotency, and commit evidence still require separate gates."
  version="Q-20260908-03"
  status="Daily Runtime V5 · 2026-09-08"
  languageHref="/zh/engineering/2026-09-08-one-effect-across-surfaces"
  languageLabel="中文"
/>

# Changing the Control Surface Must Not Split One Business Effect

An agent opens a document through the graphical user interface, rewrites its file through the command line, and submits the result through an MCP tool. The command has already saved the file, but the graphical view has not refreshed and still displays the old content. The runtime concludes that the edit failed and executes it again.

From three control surfaces, this looks like three logs. From the business outcome, the actions jointly implement one mutation. If interface boundaries become execution boundaries, a stale view can override newer fact, a success can look like failure, and a retry can become a duplicate side effect.

The same-date Research Object analyzes CUA-Universe, which makes this problem observable: graphical and application-specific command-line actions operate over one persistent application state, while task trajectories retain heterogeneous evidence such as screenshots, command results, and exported artifacts.

The core proposition is: **when different control surfaces continue one mutation over the same target state, business-effect identity should remain stable. Native surface actions and observations should remain typed inside one effect-centered provenance chain, while authorization, idempotency, commit, and recovery authority remain separate gates.**

## A Control Modality Is Not a Transaction Identity

GUI, CLI, and tool interfaces are different routes to state. They expose different observations and failure modes, but they do not inherently define separate business transactions.

A runtime that creates an independent business execution for every surface introduces several ambiguities:

- a CLI write may have changed the authoritative file while the GUI shows stale pre-change state;
- a later refresh may look like a new mutation even though it only reveals the existing effect;
- a lost response may trigger a duplicate retry because presentation state has not changed;
- surface-specific authorization checks may disagree although the surfaces reach the same protected target.

Timestamps cannot fully repair this. Adjacent actions do not necessarily share an intent, and a later action may still be recovery for the same effect. The runtime needs an explicit business-effect identity that says which actions are trying to complete the same governed outcome.

## The Benchmark Makes Shared State Visible

CUA-Universe does more than add a command-line tool. It places graphical actions and application-specific commands inside the same reproducible virtual environment so that both act continuously on one application state. The study reports that a model trained for hybrid orchestration materially outperforms a base model merely given both surfaces in controlled comparisons. Surface availability alone does not reproduce orchestration capability.

Its verification design is equally relevant. Trajectory judgment combines screenshots, command returns, and exported-artifact evidence. The study uses a vision-language model as part of that process and compares the judge with human-labeled samples, while retaining known false negatives and model-scoring limitations.

These are benchmark results, not production proof of authorization correctness, exactly-once execution, or causal completeness. They support a narrower observation: once state is shared across surfaces, verification must also be organized across surfaces. No surface can independently declare the business outcome.

## What One Effect Chain Must Preserve

A minimal cross-surface provenance chain contains at least five elements.

| Element | Preserved fact | Why it matters |
|---|---|---|
| Execution and effect identity | Stable identity for the request or governed action chain | Binds multiple surface actions to one intent |
| Target and pre-state identity | Workspace, application, artifact, and state lineage | Shows whether actions still address the same object |
| Surface-action evidence | Clicks, inputs, commands, tool arguments, returns, and time | Preserves the path that caused change |
| Effect evidence | File revision, state API, exported artifact, necessary screenshot, or other probe | Determines whether target state changed |
| Trajectory relations | Sequence, branch, alternative, retry, and final verdict | Distinguishes continuation from duplicate effect |

Unification does not mean flattening every log into one record type. A screenshot may establish visible layout. A command return may establish process completion. A file or state API may establish persisted content. A remote receipt may establish external commit. The evidence shares one business-effect reference while preserving its own identity.

## When Evidence Conflicts, Authority Must Be Declared

The hard part of multi-surface execution is not collecting more logs. It is deciding which evidence governs when the logs disagree.

A screenshot can accurately show the visible layout while lagging behind a CLI write. Exit code zero can show that a command reported success without establishing that an irreversible remote transaction committed. An exported file can establish persisted content without showing that every intermediate step was authorized.

Each effect class therefore needs an evidence-precedence contract. A local document edit may be governed by file content and revision. A remote order may require server-side query or a commit receipt. Visual layout may require a rendered screenshot. The contract should also distinguish presentation lag, effect unknown, and confirmed failure.

This distinction governs retry safety. If the authoritative probe has not resolved the outcome, the runtime should retain “effect unknown” rather than convert an old view or missing local observation into “did not happen.” Collapsing uncertainty into failure is a common path to duplicate side effects.

## Unified Provenance Is Not Unified Authority

Putting actions in one provenance chain solves identity and auditability. It does not authorize them.

GUI, CLI, and tools may expose different capability granularity over the same target. Authorization should bind the protected object, intended effect, current principal, and valid conditions—not merely permission to use a surface. Likewise, a correct final file does not establish exactly-once execution, and a complete trajectory does not establish that an external service committed only once.

The evidence accounts remain separate:

- shared execution identity says which actions serve one business intent;
- authorization evidence says why the principal may affect the target now;
- idempotency and effect identity say whether a retry reuses the prior outcome;
- commit evidence says whether authoritative state completed;
- recovery authority says who may take the next action after interruption.

These facts may reference one execution, but none can be inferred from another. Benchmark verification success is especially unable to substitute for production authorization or external transaction evidence.

## A Practical Migration Path for Runtimes

A team does not need to unify every interface implementation first. A practical starting point is to carry one effect ID through every action adapter and require each adapter to return native evidence.

Next, declare authoritative probes and evidence precedence for high-risk effects; represent an unrefreshed interface as possibly stale; link every retry to its original effect; query or escalate unknown external effects before repeating them; and preserve causal links among actions, targets, effects, and retries when compacting long trajectories.

Evaluation should also separate “trajectory looks plausible,” “target state changed,” “action was authorized,” and “effect occurred once.” These metrics answer different questions. High agreement between a visual judge and human samples cannot close the other gates.

## Boundaries and Unresolved Questions

CUA-Universe runs in reproducible virtual machines, mostly within single applications, and relies on a vision-language judge for many outcomes. It does not model credentials, distributed races, compensating transactions, irreversible remote effects, or per-action policy enforcement. Reported efficiency and success improvements cannot be transferred unchanged to enterprise desktop and browser automation.

Open questions include how one effect identity spans browser, desktop, and API restarts; which source becomes authoritative when file, API, and UI disagree; how far a long trajectory can be compacted without losing causality; how idempotency keys should span cross-surface retries; and how authorization is re-evaluated when two surfaces expose different capability granularity over the same object.

Until those questions are answered, one engineering rule is available now: **control surfaces may switch, but the business effect must not fragment; evidence may remain heterogeneous, but final fact needs declared authority.**

**Evidence and source:**

- [CUA-Universe primary study](https://arxiv.org/html/2609.05374v1)
