---
title: "Copy the Options, Keep the Client"
date: '2026-08-26'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "How should a reusable client/runtime separate template HTTP configuration from per-invocation mutation without needlessly cloning heavyweight live client objects?"
summary: "A merged Google ADK change copies request-mutable HTTP option containers per invocation while preserving live clients by reference. The pattern avoids demonstrated cloning crashes and top-level mutation leaks, but does not create deep or client-internal isolation."
sources:
  - research/analysis/Q-20260826-03-copy-on-mutation-request-option-isolation.md
item_id: "Q-20260826-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-26-copy-options-keep-client-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-26-copy-options-keep-client-cover.png"
  kicker="Open-source Engineering · Daily Research"
  title="Copy the Options, Keep the Client"
  summary="A merged Google ADK change copies request-mutable HTTP option containers per invocation while preserving live clients by reference. The pattern avoids demonstrated cloning crashes and top-level mutation leaks, but does not create deep or client-internal isolation."
  version="Q-20260826-03"
  status="Daily Runtime V5 · 2026-08-26"
  languageHref="/zh/engineering/2026-08-26-copy-options-keep-client"
  languageLabel="中文"
/>

# Copy the Options, Keep the Client

Reusable request configuration often mixes two kinds of objects that should not share a copying policy. Headers, extra body fields and client arguments are value-like containers that request processors may mutate. HTTP clients, connection pools and SSL state are live resources whose identity and internal machinery are intentionally reused.

Deep-copying the whole graph treats live capabilities as ordinary data and can crash on locks or non-pickleable SSL objects. Sharing the graph unchanged has the opposite problem: a callback can mutate caller-owned option containers and leak one invocation's state into the next.

A Google ADK maintainer change merged on 2026-08-25 implements a narrower boundary. Its `copy_http_options` helper creates new dictionaries for `headers`, `extra_body`, `client_args` and `async_client_args`, makes a separate model copy of retry options, and builds a copied options model with those replacements. A supplied live HTTP client remains the exact same object.

The engineering pattern is: **copy the state that will be mutated per invocation; preserve the live capability whose sharing is intentional.** That is copy-on-mutation ownership, not generic shallow-copy advice.

## Deep copy and raw sharing fail for different reasons

Deep copy promises maximum isolation, but only for object graphs that are meaningfully copyable. A live client contains connections, locks, pools and operating-system state. Duplicating its Python object graph is neither a valid transport clone nor a reliable request-isolation mechanism.

Raw sharing preserves those resources, but it aliases the surrounding configuration. If request assembly adds a header or a callback edits an extra-body mapping in place, the reusable template becomes cross-request mutable state. Later calls can observe data that belonged to an earlier invocation.

The correct boundary is therefore semantic. Each field needs an ownership classification: immutable value, invocation-mutable container or shared live resource. Copying follows that classification rather than object reachability.

## Mutation-specific copying makes the contract executable

The selected helper enumerates the fields that downstream code is expected to mutate and detaches their top-level containers. Retry configuration receives its own model copy. The surrounding `HttpOptions` model is then copied with those replacements, while live client fields remain shared.

The production path uses this helper before staging run configuration onto an LLM request, so processors and before-model callbacks operate on the invocation snapshot. Separate live-session transfer and restart paths similarly avoid copying the entire `RunConfig`; they copy only `session_resumption` because clearing its handle is the mutation those paths require.

This narrowness is a strength when it is explicit. It reduces accidental copying of non-copyable resources and makes the intended mutation domain reviewable.

## Tests must prove both separation and preservation

A test that checks only equality is too weak. Ownership is about identity and write-through behavior. The demonstrated regression asserts that the copied mutable containers and retry options have distinct identities, while the supplied `httpx` client retains the same identity. It also exercises mutation isolation in the request path.

Maintainers should add sequential-call tests: enrich the first request, then verify the second request and the caller's template do not contain the first call's metadata. At the same time, assert that the live transport was not silently rebuilt, which could discard pooling, hooks or configured adapters.

Schema evolution needs the same discipline. Every new option field should declare whether it is immutable, copied per invocation or intentionally shared. Otherwise a future mutable field can bypass the helper and reopen aliasing.

## A copied dictionary is not deep isolation

The implemented boundary is top-level. A new dictionary container can still reference mutable nested values from the template. Mutating those nested objects in place may remain visible across calls. The live client itself can also carry cookies, authentication caches, hooks or custom state across requests.

Those are not defects disproved by this change; they are outside its demonstrated guarantee. Systems that require nested or client-internal isolation need immutable structures, typed clone/share policies, separate client instances or stronger concurrency contracts.

The defensible conclusion is that mutation-specific copying removes the shown conflict between non-copyable live resources and request-local container mutation. It does not establish deep isolation, cookie isolation, custom-client safety or general concurrency correctness.

**Primary evidence:** [Google ADK merged commit 67ca98c2](https://github.com/google/adk-python/commit/67ca98c2c0b467ed397357eef2b2941c92dac40c). The helper and regressions support this bounded top-level ownership pattern; they are not independent validation of universal request isolation.
