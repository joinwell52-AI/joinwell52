---
schema: "publication-candidate-article/v2"
title: "The Credential File Disappeared. Did Access Disappear Too?"
date: "2026-09-10"
published_date: "2026-09-10"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "The Credential File Disappeared. Did Access Disappear Too?"
summary: "A pinned-source experiment shows why fewer credential files do not necessarily mean fewer secrets available to the receiving process."
cover: "/assets/authority-scope-20260910/01-secret-route.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded pinned-source seam experiments; not full-system validation"
pageClass: "authority-scope-article"
---

<ArticleCover image="/assets/authority-scope-20260910/01-secret-route.cover-v1.png" kicker="Open-source Engineering · Experiments" title="The Credential File Disappeared. Did Access Disappear Too?" summary="A pinned-source experiment shows why fewer credential files do not necessarily mean fewer secrets available to the receiving process." version="2026-09-10" languageHref="/zh/engineering/2026-09-10-secret-route" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.authority-scope-article .vp-doc h1[id] { display: none; }</style>

# The Credential File Disappeared. Did Access Disappear Too?


A credential fix reduced file-materialization callbacks from four to zero. That looks reassuring—until the receiving process is inspected. In our controlled experiment, the same four synthetic credential blobs appeared as environment variables.

There was no mysterious bypass. The values had changed delivery routes. The question is what “credential isolation” promises: a restriction on where files are created, or a restriction on which values a process can obtain.

## A useful fix with a narrower contract

OpenHands Agent SDK can launch different agent programs through ACP, a protocol connecting an agent client to an execution program. Those programs use different authentication mechanisms, including environment variables and credential files.

[PR #4927](https://github.com/OpenHands/software-agent-sdk/pull/4927) narrows file-secret handling by provider ownership. The default configuration combines multiple providers' file rules; the proposed change avoids materializing unrelated providers' files when starting one particular program. That is a useful correction to credential representation and directory configuration.

File rules, however, are not a secret allow-list. The startup path also exports registry secrets as ordinary environment variables, excluding those handled as files. Narrowing the file set narrows this exclusion set too. A value removed from one route can consequently reappear on the other.

This does not make the patch a failed implementation of its stated goal. It means reviewers should not add a stronger promise—“all other providers' secrets become inaccessible”—that the change does not establish.

## Observe the recipient, not just the writer

We pinned the PR's base and head revisions and executed its original filtering methods, environment-conflict method, and contiguous environment-construction slice. Both revisions used registry metadata extracted from the head to isolate the handling change. Provider identity was fixture-supplied; actual command detection was not tested. All inputs were synthetic strings.

File materialization was a recording fixture: the file-side numbers below count callbacks, not authentication files actually written to disk. The assembled environment was passed to a real Python child process, which returned variable names only. It did not launch a model or attempt authentication.

| Revision and recipient | File-side callbacks | Four credential-blob variables visible to child |
| --- | ---: | ---: |
| Base, Claude | 4 | 0 |
| Proposed head, Claude | 0 | 4 |
| Base, Codex | 4 | 0 |
| Proposed head, Codex | 1 | 3 |
| Proposed head, unrecognized provider | 4 | 0 |

Both rounds produced the same results. The four blobs correspond to registered file credentials for Codex, Gemini, Kimi and Pi. Codex retained its own file route while three other blobs became ordinary environment variables. An unrecognized provider retained every file specification. Those branches cannot all be summarized as “only this provider's credentials remain.”

![File-side and environment-side observations](/assets/authority-scope-20260910/01-secret-route.figure.en.png)

*Figure 1. The figure uses our local seam-test observations. It establishes delivery of synthetic values through the tested construction path, not their use by a real CLI or disclosure over a network. Source: saved rounds 1 and 2 of our pinned-source experiments.*

## An empty list can have an authentication exception

[Draft PR #4931](https://github.com/OpenHands/software-agent-sdk/pull/4931) addresses a different layer: profile-level restrictions on secret names received by a conversation. Filtering the registry can narrow both downstream delivery routes.

We placed that PR's original filtering functions before the earlier environment slice. This is explicitly a laboratory composition of two separate PRs, not a merged SDK release or a server integration test.

Given the same six synthetic inputs, the Claude ACP profile produced:

| `secret_refs` | Names retained in the registry |
| --- | --- |
| `null` | All six supplied names |
| `[]` | The provider's `ANTHROPIC_API_KEY` |
| `[PROD_DB_URL]` | The database variable and provider authentication variable |

The empty list removed business secrets while retaining an explicit authentication exception. The program still needs a way to authenticate. As a separate control, we executed only the ordinary OpenHands profile's empty-list filter and obtained an empty set; that control did not pass through ACP startup.

An interface therefore needs to explain what its empty list means. “No selected business secrets” and “this process receives no secrets at all” are materially different expectations.

## The registry is not every input channel

The tested startup slice also merges the host environment. A separate synthetic marker placed on that route remained visible to the child in every ACP scenario, including the empty-list case.

This is not a production leak report. It shows that a registry filter cannot constrain an input that bypasses the registry. The draft explicitly leaves host-environment inheritance outside its scope.

A stronger acceptance test begins by defining the business secrets and authentication materials authorized for a provider and run, then observes the actual environment and file capabilities at the receiving process boundary. Representation changes should follow that selection. Unknown-provider behavior needs its own explicit policy as well.

Our experiment did not exercise the complete SDK, a real ACP handshake, authentication, or server request filtering. Its conclusion is narrower: **a disappearing credential file is insufficient evidence of disappearing access. Trace every delivery route for the same secret and inspect the set the recipient actually receives.**

[中文](/zh/engineering/2026-09-10-secret-route) · [Methods, pinned revisions and raw results](/en/research/evidence/2026-09-10-authority-scope)
