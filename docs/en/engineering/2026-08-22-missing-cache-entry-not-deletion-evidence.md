---
title: "A Missing Cache Entry Is Not Deletion Evidence"
date: '2026-08-22'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "How should an asynchronous local cache reconcile an authoritative remote inventory when principal identity can change and refresh, install, uninstall and cancellation can race with destructive cleanup?"
summary: "Safe asynchronous reconciliation needs principal identity, causal generations, coordination among participating writers and positive snapshot-completeness evidence before deletion. These controls bound races without creating a transaction."
sources:
  - research/analysis/Q-20260822-03-principal-scoped-causal-cache-reconciliation.md
item_id: "Q-20260822-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-22-missing-cache-entry-not-deletion-evidence-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-22-missing-cache-entry-not-deletion-evidence-cover.png"
  kicker="Open-source Engineering · Daily Research"
  title="A Missing Cache Entry Is Not Deletion Evidence"
  summary="Safe asynchronous reconciliation needs principal identity, causal generations, coordination among participating writers and positive snapshot-completeness evidence before deletion. These controls bound races without creating a transaction."
  version="Q-20260822-03"
  status="Daily Runtime V5 · 2026-08-22"
  languageHref="/zh/engineering/2026-08-22-missing-cache-entry-not-deletion-evidence"
  languageLabel="中文"
/>

# A Missing Cache Entry Is Not Deletion Evidence

A background refresh returns without a plugin that exists in the local cache. Deleting the local bundle looks like ordinary reconciliation—until the refresh belongs to the previous account, started before a direct install, or contains only a partial remote inventory. The same absence can mean “uninstalled,” “not fetched,” “not yet materialized” or “observed by stale work.” Only one of those meanings authorizes destruction.

A Codex change merged on 2026-08-22 addresses this class of race in the remote plugin-cache lifecycle. It binds installed and loaded cache state to a composite authentication identity, adds causal generations, coordinates reconciliation with direct install and uninstall, validates the complete remote snapshot before stale cleanup and retains remote installation metadata when local materialization fails.

The transferable rule is: **destructive reconciliation needs positive evidence that a snapshot is complete, current for the principal and current in the causal order.** Identity, generation, serialization and completeness each close a different gap. Together they provide bounded coordination; they do not create a transaction or exactly-once semantics.

## Freshness has two dimensions

A time-to-live can say when data was fetched. It cannot say for whom the data is valid or whether newer work has already superseded it.

Codex introduces `RemoteInstalledPluginsAuthIdentity`, derived from authentication mode, account ID, ChatGPT user ID and workspace-account status. That identity enters both installed-plugin cache state and loaded-plugin cache keys. When the account identity changes, prior state is invalidated and generation advances. In-flight work checks that its expected identity still matches before publication.

Identity and generation solve different problems. Principal scope prevents a snapshot for account A from becoming visible under account B. Causal scope prevents a slower, older refresh for the same account from overwriting state produced by newer work. A valid publication therefore needs both coordinates, checked immediately before it becomes authoritative.

Cancellation belongs to this causal model. Abandoning reconciliation clears the active reconciliation generation, advances the generation and marks effective-plugin refresh as necessary. The system does not pretend that a cancelled pass never touched anything; it invalidates the pass's authority to publish and creates an explicit recovery signal for downstream consumers.

## Coordinate every writer represented by the guarantee

Reconciliation is not the only process that changes a cache. Direct installs and uninstalls can race with background sync, and their downstream setup may outlive the broad operation that initiated them.

The demonstrated design uses one semaphore per cache root for full sync, reconciliation, remote install and uninstall. These paths share a serialized mutation boundary. Per-plugin mutation markers then protect narrower lifecycles, preventing stale cleanup from pruning a bundle while a direct mutation is still in flight.

The word “represented” matters. The gate constrains writers that participate in it. It does not prove that an independent process, an uncoordinated filesystem writer or a future code path cannot race. Concurrency documentation should state who acquires the gate and what remains outside it; otherwise a scoped guarantee will be misread as global isolation.

## Validate before destroy

Destructive cleanup should require more evidence than a read path. The remote `/installed` result is fully canonicalized before downloads, publication or deletion. If any row cannot be converted into a valid local cache key, the pass stops before stale cleanup. Only after the system has a complete validated installed-name set may it classify other local entries as stale.

This reverses a common but unsafe default. Partial success is enough to display what was fetched; it is not enough to infer that everything missing was deleted remotely. A failed page, malformed row or cancelled fetch removes deletion authority because the system can no longer prove completeness.

The same rule applies at a smaller granularity. If a valid installed plugin cannot be downloaded or materialized locally, Codex retains its installed metadata. Remote membership remains true while local readiness is false. Conflating the two would turn a local I/O failure into false evidence of a remote uninstall.

## Model remote truth and local readiness separately

A resilient cache should represent at least two state dimensions:

- whether the authoritative remote inventory says the object is a member;
- whether the local runtime has successfully materialized and can use it.

That separation enables the right recovery. A materialization failure can trigger retry or degrade availability without deleting membership metadata. An actual remote removal, observed in a complete current snapshot, can authorize cleanup. Operators can distinguish “installed but unavailable locally” from “not installed,” which leads to different alerts and repair actions.

The model also prevents destructive feedback. If local failure erases membership and the erased state drives future cleanup, a transient download problem can become a durable false deletion. Keeping the evidence ledger separate from materialization health interrupts that loop.

## Coordination is not a transaction

The public evidence comes from one merged Codex plugin-cache implementation and its regression tests. Generations reject stale publication; they do not roll back network calls or filesystem side effects. The semaphore serializes known cache-root operations; it does not establish cross-process mutual exclusion. Cancellation coordinates retry; it does not provide exactly-once execution.

Those boundaries do not weaken the pattern. They make the guarantee usable. For asynchronous caches with identity changes and destructive cleanup, ask four questions before publication or deletion: Is this the current principal? Is this the current generation? Did every participating writer coordinate? Is the authoritative inventory positively complete?

If any answer is unknown, the safe result is not to declare the object absent. Reconciliation is evidence-driven coordination, not a transaction—and missing data is not deletion evidence.

**Primary evidence:** [OpenAI Codex merged commit e6a3877e](https://github.com/openai/codex/commit/e6a3877e95788b52c3aa5e9a143dba87f04720dc). The public code and tests support the bounded plugin-cache behavior described here; they are not independent validation of general transactional or exactly-once guarantees.
