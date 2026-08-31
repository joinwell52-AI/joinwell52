---
title: "CodeFlowMu Engineering Record (I): After Response Loss, Why Retry Must Start with a Persistent Idempotency Boundary"
date: '2026-08-28'
updated: '2026-08-31'
column: open-source-engineering
category: daily
article_type: engineering-case-study
edition: research-center
research_question: "When a side effect has already happened but the response is lost, how can an Agent Runtime use persistent submission identity to distinguish safe retry, result reuse, and conflict rejection?"
summary: "A response-loss experiment exposed an engineering boundary in CodeFlowMu task creation: in the historical version, retrying the same business intent could create a second TASK. V2.1.2 moved a stable client_submission_id, request_digest, a three-stage creation receipt, and recovery rules into the Runtime; independent QA then verified that response loss and eight-way concurrency converge on one authoritative task_id."
sources: "/en/research/evidence/2026-08-28-response-loss-idempotency"
project_relevance: substantive-relationship
item_id: "RBE-20260828-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-28-response-loss-idempotency-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-28-response-loss-idempotency-cover.png"
  kicker="CodeFlowMu Engineering Record · 01"
  title="After Response Loss, Why Retry Must Start with a Persistent Idempotency Boundary"
  summary="Not receiving a success response does not mean the action never happened. Reliable retry is not about executing again; it is about recovering the result of the first execution."
  version="RBE-20260828-01"
  status="Engineering Case · Revised 2026-08-31"
  languageHref="/zh/engineering/2026-08-28-response-loss-idempotency"
  languageLabel="中文"
/>

# CodeFlowMu Engineering Record (I): After Response Loss, Why Retry Must Start with a Persistent Idempotency Boundary

For an Agent Runtime, “can I retry after a tool error?” is not merely a networking question.

The dangerous window is this: **the side effect has already happened, but the caller never received the success response.**

A task has already been persisted, yet the response disappears on the way back. After recovery, the caller only knows that it did not receive a result, so it submits the same business intent again. If the Runtime cannot prove what the first call already did, the second “retry” can become a second real creation.

## What CodeFlowMu is, and why this deserves its own engineering boundary

CodeFlowMu is a **local-first multi-agent collaboration and digital-employee runtime**. It does more than hand prompts to a model: PM, DEV, QA, OPS, EVAL, and other role agents execute real work in controlled workspaces while the Runtime manages task objects, execution context, tool calls, events, recovery, and evidence.

Unlike a one-shot chat, this kind of system runs for longer periods and must survive process exits, Host interruptions, network faults, schedule recovery, and repeated wake-ups. Once a tool call can create a real side effect, the Runtime cannot use “did the caller receive success?” as its only evidence that the action happened.

Idempotency is therefore not a small API optimization in CodeFlowMu. It is a recovery boundary for digital employees: **the system must distinguish first creation, recovery of the same business submission, and a genuinely new business intent.**

The full experiment, version boundary, and public evidence are available in the [RBE-20260828-01 evidence pack](/en/research/evidence/2026-08-28-response-loss-idempotency).

## External research origin: an exception does not prove that the side effect never happened

The external starting point for this research chain was [LlamaIndex PR #22841](https://github.com/run-llama/llama_index/pull/22841), `fix(core): avoid retrying failed function tools`.

Its concrete issue was that the invocation layer could execute a FunctionTool with one argument form and, after an exception, try another form by executing the tool again. The first exception did not necessarily occur before the side effect. If the first call had already written, sent, or created something, the second “try another calling convention” attempt could duplicate the real action.

LlamaIndex fixed its own problem by deciding the argument form before the real invocation, based on the function signature, rather than using a potentially side-effecting execution to probe the interface.

The value of that external case for CodeFlowMu was not a patch to copy. It supplied a failure model worth testing in our own Runtime:

> When the caller sees an exception, can the system prove that the side effect has not already happened? If not, what fact makes a retry safe?

The external work raises the question. Whether CodeFlowMu had an analogous engineering gap had to be answered by first-party implementation evidence and experiments.

## First-party reproduction: one response-loss window, two different write behaviors

The original experiment was fixed to CodeFlowMu V2.0.4 commit `2ba1ad9b`. It was not a production-incident statistic. It deliberately created the response-loss window in which the action completed but the caller lost the success result.

| Tested layer | Historical observation | Engineering meaning |
| --- | --- | --- |
| Upper-layer in-memory dedup | The first action occurred, but its success result never entered the reusable cache; recovery entered the execution path again | Process-local caching cannot resolve an unknown result across recovery |
| `write_report` | Retrying the same task, content, and submission identity returned `deduplicated=true`; report count remained 1 | The tested report path already had persistent result reuse |
| `write_task` | Retrying the same business creation intent entered real creation again, received a new task identity, and TASK count became 2 | Task creation did not bind a stable submission identity to the result of the first creation |

![Historical response-loss experiment: one report, two tasks](/assets/figures/2026-08-28-response-loss-comparison.en.svg)

*Figure 1. Historical V2.0.4 comparison, not V2.1.2 behavior. Counts apply only to the tested paths and are not production incidence. Source: [RBE-20260828-01 evidence pack](/en/research/evidence/2026-08-28-response-loss-idempotency).*

This comparison matters because it rules out an overbroad conclusion. The result was not “all CodeFlowMu write tools lack idempotency.”

`write_report` was the counterexample. It showed that permitting a retry at the upper layer does not necessarily create a second side effect if the underlying interface already has durable identity and result-reuse semantics.

The actual gap was concentrated in task creation. At that point, `write_report` already exposed `client_submission_id`, while `write_task` did not yet have an equivalent formal persistent-idempotency contract. The caller thinking “this is still the same submission” is not the same thing as the Runtime having durably recorded and recognized that business identity.

## Engineering judgment: reliable retry is not fuzzy deduplication; it is recovery of the first result

After observing two TASK objects, the easiest proposed fix would be: look for an existing task with the same title before creating a new one.

That is not reliable idempotency.

The same title, summary, sender, or time window can legitimately describe two different business intents. Conversely, one business submission can be retried with a different trace, connection, process, or retry count. Fuzzy content matching can both miss duplicates and suppress legitimate new work.

CodeFlowMu V2.1.2 therefore framed the problem differently:

**How do we give one creation intent a stable, persistent, recoverable identity that can also detect conflicts?**

That framing is the key engineering change: retry stops being merely a caller strategy and becomes part of the task-creation interface contract.

## V2.1.2: make one business submission a persistent fact

V2.1.2 establishes the relation:

`client_submission_id → request_digest → task_id / task_path → creation_result`

`client_submission_id` identifies one business creation intent, not one HTTP, MCP, or process invocation. A caller that needs recovery across response loss or process restart must reuse the same stable ID.

If it generates a new ID on retry, the Runtime treats that as a new business intent. That is not an idempotency failure; the caller supplied a new identity.

A stable ID alone is still insufficient. If the same ID first asks DEV to fix login and is later reused to ask OPS to deploy an environment, the Runtime must not silently reuse the first result. V2.1.2 therefore persists a normalized `request_digest` as well.

The implementation uses a `write-task-v1` digest scheme. It constructs deterministic JSON from semantic fields including sender, recipient, subject, body, priority, thread_key, parent, references, depends_on, and risk_level, then computes SHA-256. Object keys are ordered; strings normalize Unicode NFC and line endings; arrays preserve order. Invocation-time fields such as call time, retry count, or trace ID are not part of the business digest.

The Runtime also persists `digest_schema_version`. If the same submission ID arrives with a different digest or digest schema, it returns `conflict` and produces no new TASK side effect.

This is a **task-creation interface contract**, not a claim that the entire Runtime is a general-purpose transaction database. Existing `write_report` deduplication semantics remain unchanged, and the FCoP TASK / REPORT / REVIEW / EVAL protocol did not change as part of this patch.

## Why a three-stage creation receipt is still necessary

If the system only writes “this submission succeeded” after the TASK file has been created, a narrower crash window remains:

1. the TASK is persisted successfully;
2. the final receipt has not yet been written;
3. the process exits;
4. the caller retries with the same submission ID.

If the Runtime only checks for the final receipt, it can still mistakenly create again.

V2.1.2 therefore persists the creation result through three stages:

`reserved → task_created → committed`

| State | Durable fact already available | Recovery rule |
| --- | --- | --- |
| `reserved` | submission ID, digest schema, digest, preallocated task identity and path | If the TASK does not exist, continue with the same identity; if it exists and matches, adopt that task rather than allocate a new number |
| `task_created` | TASK creation and file digest confirmed | If matching, finish committing the receipt; if the file is unexpectedly missing, return a typed conflict rather than pretend creation never happened |
| `committed` | Complete machine-readable creation result | Same ID + same digest reuses the first result without executing creation again |

Submission-level mutual exclusion and task-number protection handle concurrent reservation. Atomic persistence and recovery rules for intermediate states handle crash recovery. If the target path exists but the identity or content does not match, the system may not hide uncertainty by overwriting it or creating a second task.

For reservations that remain in an intermediate state for an unusually long time, the Runtime exposes read-only diagnostics: current state, whether the target TASK exists, whether digests match, and whether the reservation has stalled. Diagnostics report facts only; a timeout does not automatically delete the reservation or make a business decision to recreate the task.

## `created`, `reused`, `conflict`: make retry results machine-readable

| `disposition` | `action_taken` | Meaning |
| --- | --- | --- |
| `created` | `true` | This call completed the first creation |
| `reused` | `false` | The creation result already exists; return the authoritative identity produced by the first call |
| `conflict` | `false` | The submission identity conflicts with an existing digest or recovery fact; no new TASK is created |

`action_taken=false` is not necessarily failure. In the `reused` case it is precisely the evidence that the Runtime did not perform a second creation while still recovering the original success result.

“Success” here means that the task-object creation result was recovered. It does not mean the task has been executed, QA has passed, or the business outcome has been delivered. Technical idempotency does not replace higher-level governance state.

Compatibility is also stated narrowly. Legacy callers that omit `client_submission_id` can continue to use the earlier creation path, but that path is not claimed to have the stronger cross-response-loss, cross-process idempotency guarantee.

## Independent QA: count authoritative objects, not merely exceptions

After implementation, QA that did not participate in the change independently exercised response-loss and concurrency scenarios. Acceptance focused on real TASK count, whether `task_id` remained identical, and the returned creation receipt.

| Scenario | Independent QA observation |
| --- | --- |
| A2: simulate lost response after successful creation, then retry with the same submission identity | TASK count 1; same `task_id`; second call `reused / action_taken=false` |
| A4: eight concurrent calls with the same submission ID and digest | `created=1 / reused=7`; one unique `task_id`; TASK count 1 |

Process-restart reuse, same-ID/different-digest conflict, legacy response compatibility, missing intermediate files, and stale-reservation diagnostics also have targeted tests.

The evidence boundary matters: A2/A4 independently show convergence for two critical failure models in the tested task-creation contract. They do not mean that every tool, Host, or network environment has independently received the same validation.

For the engineering issue at hand, however, the before/after distinction is concrete:

**In the historical tested version, one creation intent could produce two TASK objects after response loss. In V2.1.2, tested retry, concurrency, and restart paths that reuse a stable submission ID and consistent digest converge on one authoritative task identity.**

## From patch to product version: release gates still matter

CodeFlowMu V2.1.2 was released on August 30, 2026. Its Runtime and Shell source code is maintained in a private repository. Public articles do not link directly to the private CodeFlowMu repository; externally reviewable version facts, sanitized QA results, and scope statements are consolidated in the [public evidence pack](/en/research/evidence/2026-08-28-response-loss-idempotency) and the [V2.1.2 Public Release Summary](/en/research/evidence/2026-08-30-codeflowmu-v2.1.2-public-release-summary).

Final release validation recorded:

- Runtime: **1842 pass / 0 fail / 1 skip**;
- Shell: **1037 pass / 0 fail / 0 skip**;
- same-protocol critical matrices for V2.1.1 and V2.1.2, ten consecutive rounds each: Runtime **1630/1630**, Shell **550/550**;
- typecheck, Shell build, installer contract, rules, and version consistency passed.

These are results of the release test suites. They must not be added together or described as an “idempotency reliability rate.”

The release covers the CodeFlowMu Runtime and Shell maintained in a private repository. It is not Open Dev Team Edition and it does not imply that real LAN/Gateway environments, browser profiles, or user production projects were covered by the same fixtures. The one Windows symlink-permission skip, pre-existing dependency-audit warnings, and the Python targeted-fixture warning remain part of the evidence notes.

## What the engineering change actually changed

Previously, the caller saw “the request did not return successfully” and had to guess whether to try again.

With a stable submission identity, the Runtime can now distinguish three different facts:

- this is the first creation, so execute and return a new result;
- this is recovery of the same business submission, so return the original result;
- this request conflicts with an already-reserved submission identity, so reject new side effects.

Retry thus becomes a persistent, recoverable, auditable, testable contract instead of a guess made by the caller.

That difference matters especially for a digital-employee runtime. Digital employees run for long periods, cross process boundaries, are reawakened by schedulers, and can encounter uncertainty at Host, network, and tool layers. If every recovery requires an Agent to guess whether the previous action actually succeeded, the system has not yet crossed from demo behavior into a production runtime.

## A review checklist for other Agent Runtimes

For every side-effecting tool, ask at least:

1. If the side effect is persisted and the response is lost, can a process restart recover the first result?
2. Does same stable ID + same request mean result reuse or another execution?
3. Does same ID + different request produce an explicit conflict with zero new side effects?
4. Are “check + reserve + create” protected consistently under concurrency?
5. Can intermediate states resume under the original identity rather than escaping uncertainty by creating a new object?
6. Are legacy calls kept compatible without falsely advertising the same idempotency level?
7. Do already-correct tool paths keep their protection instead of regressing during a unified rewrite?

A Runtime whose only answer is “if it fails, try again” has not fully defined its side-effect boundary.

A stronger answer is: **every retryable business intent has a persistent identity that survives response loss, concurrency, and process recovery.**

## Engineering conclusion

This CodeFlowMu change does not prove that every Agent tool is safe to retry. It demonstrates a narrower and more useful proposition:

**An external failure model can be narrowed through first-party positive and negative experiments into a concrete interface gap, then turned into an executable Runtime contract through persistent submission identity, request digests, creation receipts, a recovery state machine, and independent QA.**

The real question exposed by response loss was never simply “should we call again?”

It was whether the system had enough durable facts to answer, when the second call arrived:

**What exactly did the first call already do?**

## Evidence scope and primary sources

- [Historical experiment, V2.1.2 engineering update, and public version evidence](/en/research/evidence/2026-08-28-response-loss-idempotency): public JSON fixture, Reader, and check validate frozen historical material; the page also maps the sanitized implementation evidence, independent QA, release gate, and residual-risk statements.
- [LlamaIndex PR #22841](https://github.com/run-llama/llama_index/pull/22841): external failure model and calling-convention fix context; it is not CodeFlowMu implementation or acceptance evidence.
- CodeFlowMu V2.1.2 implementation, independent QA, and raw release logs remain in the private repository; this public article does not provide inaccessible private-repository links as reader-facing evidence.
- Production incidence, every operating system, real LAN/Gateway deployments, and user production projects are outside this article's evidence scope.
