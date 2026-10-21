---
title: 'A Completion Event Is Not Completion Evidence: Nine Probes of an ASP Example'
date: '2026-10-21'
column: open-source-engineering
category: daily
article_type: experiment-report
edition: research-center
research_question: 状态服务接收完成事件，能否代表证据、身份与执行约束均已核验？
summary: The pinned example accepted an evidence-free completion while governance remained blocked. Nine loopback requests, including effective rejection controls, distinguish reporting from caller authority and effect enforcement.
sources: ASP v0.1 pinned example; A2-Failures v1; RCM v1; internal experiments
pageClass: "runtime-v6-article"
item_id: "SIG-20261021-003"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-10-21-sig-20261021-003-2026-10-21-completion-evidence.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-10-21-sig-20261021-003-2026-10-21-completion-evidence.png"
  kicker="Research"
  title="A Completion Event Is Not Completion Evidence: Nine Probes of an ASP Example"
  summary="The pinned example accepted an evidence-free completion while governance remained blocked. Nine loopback requests, including effective rejection controls, distinguish reporting from caller authority and effect enforcement."
  version="2026-10-21"
  languageHref="/zh/engineering/2026-10-21-completion-evidence"
  languageLabel="中文"
/>

<ArticleTableScroll language="en" />

<style>.runtime-v6-article .vp-doc h1[id] { display: none; }</style>

# A Completion Event Is Not Completion Evidence: Nine Probes of an ASP Example

A task can be recorded as completed while its governance state remains blocked. That combination occurred in the status-service example examined here. For platform engineers integrating agents, event acceptance, completion verification and permission to act need explicit owners. The request table below helps identify where these distinct responsibilities may have been mistaken for one guarantee.

## Nine requests against one pinned example

The Agent Status Protocol, or ASP, describes liveness, progress, independent observations and governance information separately. Our internal experiment imported the captured, unmodified author example and exercised its event-handling path over loopback HTTP, rather than rewriting a simplified service. The pinned commit was `faf07a43b885204900f0049d010ab0e73e430de7`; the environment was Windows and Python 3.13.13. It used a synthetic shared access token and no business executor. [Pinned source](https://github.com/AgentStatusProtocol/spec/blob/faf07a43b885204900f0049d010ab0e73e430de7/implementations/python-status-server/server.py)

Each row is an actual request in the Research Center’s October 21, 2026 internal record, in execution order. Here, 202 is the event-acceptance response, 401 an authentication rejection, and 409 a conflict rejection under the state or precedence condition. None measures an external business effect.

| Request | HTTP response | Task state afterward | Governance afterward |
|---|---:|---|---|
| Register with wrong token | 401 | No record | No record |
| Report completion before registration | 409 | No record | No record |
| Register with shared token | 202 | No task | Normal |
| Report task working | 202 | Working | Normal |
| Set block with guardrail source | 202 | Working | Blocked by guardrail |
| Attempt clear with self source | 409 | Working | Still blocked |
| Report completion without business evidence | 202 | Completed | Still blocked |
| Attempt terminal reopen | 409 | Still completed | Still blocked |
| Assert operator source with the same shared token and clear block | 202 | Completed | Normal, set by operator |

The wrong token, pre-registration event, lower-precedence clearing and terminal reopen were rejected. These controls rule out a description of the example as accepting everything. The narrower question is why an unsupported completion event can still enter a terminal task state while those rejection rules work.

## Two state dimensions can disagree

The source handles task-state and governance-state reduction separately. On the tested event path, a governance block is not a condition rejecting a completion report; nor does that report require verifiable business artifacts. “Completed and still blocked” is therefore first an expressible reporting-layer combination. It must not be rewritten as “external work bypassed the block.” There was no external executor in the experiment, so that outcome was not observed.

Source precedence must also be distinguished from caller authority. Self could not clear a guardrail block, demonstrating the precedence rule for that case. Yet the same shared credential could label its source operator and clear the block. The example did not bind each caller’s permitted source roles to distinct authenticated authority. An accepted role label alone is insufficient as a trusted permission basis.

This is not the failure of an undisclosed production-security promise. The companion documentation explicitly excludes per-agent credential scoping and does not claim production readiness or conformance testing. An external gateway could scope roles, and an executor could separately enforce blocking before actions; neither was tested. The finding concerns the reporting-versus-enforcement boundary of this pinned example. [Example source and companion documentation](https://github.com/AgentStatusProtocol/spec/tree/faf07a43b885204900f0049d010ab0e73e430de7/implementations/python-status-server)

## Reporting, diagnosis and discharge

The public first version of A2-Failures contains author-reported verification cases. One release path requires a new artifact hash and fresh challenge after failed checks; another example shows a security block failing to constrain another agent’s ship filing. They distinguish detecting a problem from constraining later conduct. They are not deployment traces of the status server tested here and supply no failure frequency for our fixture. [Verification and conduct examples](https://arxiv.org/html/2610.19342v1)

The first version of the Responsibility Commitment Model, RCM, addresses a different question. Discharge requires the delegator to check completion evidence against agreed terms; revisions require renewed agreement, and stale versions cannot stand in for current terms. Insufficient evidence does not automatically imply a violation. [Responsibility lifecycle](https://arxiv.org/html/2610.21243v1)

The same-date internal specification-derived model enumerated 16 boolean tuples. Its deliberately status-only rule admitted seven tuples excluded by the guarded rule. This makes the information difference between conditions explicit, but assumes an answer from the evidence oracle—the hardest trust question is not solved. It ran no author-bound RCM implementation and does not validate its performance, security or superiority.

Our comparison is that ASP provides reporting and observation semantics, the failure study provides diagnostic material, and RCM specifies conditions for discharging obligations. They are not one task, one deployment or one security evaluation. They do not establish a ranking of which system is safer.

## Put each check where its authority lives

The following responsibility map is an engineering recommendation derived from the observations, not an implemented or tested patch. The running example is still an agent submitting a completion event.

| Stage and owner | Input | Required output | Failure or uncertainty |
|---|---|---|---|
| Identity gateway | Authenticated caller and asserted role | Caller-authorized identities and source scope | Reject unauthorized role assertions |
| Status receiver | Event within authorized scope | Traceable status record | Reject conflicts; preserve uncertainty where facts are insufficient |
| Completion verifier | Current terms, artifact version and evidence | Acceptance decision for the specific artifact | Wait for missing prerequisites; return insufficient evidence for checking rather than automatically completing |
| Business executor | Valid acceptance and current restrictions | Authorized business effect | Reject an explicitly restricted action; reconcile uncertain authority |

Role precedence cannot replace the first row. An acceptance response cannot replace the third. Artifact acceptance does not itself guarantee enforcement in the fourth. For a system already deploying these checks elsewhere, this article does not claim a bypass; that requires examining its actual integration path and rejection cases.

## Evidence and sources

“Internal experiment” identifies responses and states measured by the Research Center on one loopback service, not independent third-party validation. “Public primary material” includes author specifications and code: it establishes definitions or implementation, not independence. “Author-reported” identifies diagnostic examples whose frequencies we did not recompute. The responsibility map is our engineering interpretation.

- [ASP v1 paper](https://arxiv.org/html/2610.21538v1), a working proposal supporting the descriptions of state, observation, governance precedence and deployment boundaries. It is not test evidence of business-effect enforcement.
- [Pinned example source](https://github.com/AgentStatusProtocol/spec/blob/faf07a43b885204900f0049d010ab0e73e430de7/implementations/python-status-server/server.py), the author implementation at the commit above. Its actual event-handling path was executed.
- [A2-Failures v1](https://arxiv.org/html/2610.19342v1), a 2026 research preprint supplying verification cases and diagnostic limits. Gated raw runs and the complete evaluation package were not obtained; automatic tagging can miss or misclassify failures.
- [RCM v1](https://arxiv.org/html/2610.21243v1), a 2026 research preprint used for semantic comparison of responsibility discharge, not as executable implementation or security proof in this experiment.
- Research Center internal records, October 21, 2026: nine actual HTTP requests with successive state snapshots, plus a separate 16-tuple specification-derived model. Their counts cannot be added into one system’s test-coverage denominator.

All external material comes from the admitted same-date Research Objects and their previously read evidence. Citing a preprint or code establishes provenance and version; it does not endorse every conclusion or turn author experiments into independent validation.

## What these probes leave untested

The experiment covers the event-acceptance path of one illustrative commit. It started no liveness thread or observer UI, and tested no concurrency, restart, server-sent event stream, partition recovery or external action. It is not conformance testing, a definitive specification vulnerability finding, or a reproduction of A2-Failures prevalence estimates.

An actual integration must still answer who can elevate a completion report into an acceptance decision and who turns a blocking decision into a denied action. Follow-up tests should bind the current artifact and distinguish unauthorized roles, stale versions and insufficient business evidence by their action outcomes. Cross-principal verification also needs to protect private state; no such capability was validated here.
