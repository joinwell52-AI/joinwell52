# Approval after resuming in a new session: controlled comparison

Date: 2026-10-29. Supports the [English article](../../../docs/en/research/2026-10-29-approval-after-resume.md). [中文记录](00-report.md).

## Sources and question

External prompts are [Codex per-chat MCP leases #57978](https://github.com/openai/codex/pull/57978), [OpenAI Agents JS client-owned environment preparation #2085](https://github.com/openai/openai-agents-js/pull/2085), and [Paperclip durable write recovery #17960](https://github.com/paperclipai/paperclip/pull/17960). GitHub API checks found all three merged by this research date. They address ownership of connections, environments, and writes in different products; we did not replay their code. Our question is whether **the same approved operation** can be consumed once after a CodeFlowMu Agent changes sessions.

## Baseline and method

- Current private CodeFlowMu source revision: `c600e74d5d72253657593a37077e856fe6c7fba6`. The source is not public in this repository. This packet publishes controlled inputs, observations, and limits; it is **not a public reproduction of the private Runtime**.
- A temporary directory held approval records for Agent `DEV-01`, task `TASK-1`, and a decision about `git push origin main`. An ADMIN role approved and named Session 2 as the wake target. No Git command, network call, or deployment was executed.
- One probe called the approval-record API directly, recreated the service instance, and attempted consumption from Session 3 with the same Agent, task, and operation. Changed Agent, task, and target were negative controls.
- A second probe generated the original request through the native tool gate, approved it, then retried through the same gate from Session 2, Session 3, original Session 1, and the negative controls. The existing approval module tests passed **15/15**.

## Results

| Comparison | Record API | Native tool gate |
| --- | --- | --- |
| Original Session 1, exact operation | Approved | `ALLOW` once |
| Session 2, named wake target | Not separately called | `REQUIRE_APPROVAL` |
| Session 3, same Agent/task/operation | `consumed` | `REQUIRE_APPROVAL` |
| Different Agent | `null` | `REQUIRE_APPROVAL` |
| Different task | `null` | `REQUIRE_APPROVAL` |
| Changed command target | `null` | `REQUIRE_APPROVAL` |
| Second use from original session | Not separately called | Throws `APPROVAL_ALREADY_CONSUMED` |

At the native gate, the original session and Session 3 produced the **same operation fingerprint but different operation digests**. Source inspection found that digest computation removes the outer `subject.session_id`, while the native request retains a session ID inside `snapshot.operation_facts.subject`. The nested field changes the digest. Candidate matching requires both digest and fingerprint, so the new session misses the approved record. The direct API probe lacks that nested snapshot difference and can consume across sessions. This is an inconsistency between two layers; it does not show approval reuse by a different Agent, task, or target.

## Limits and next checks

The actual probes and private source stay in the restricted workspace. Readers can examine **the method, input conditions, result table, and claim boundaries** here; they cannot independently verify a deployment incident from this packet. We did not test real Host takeover, account or credential changes, a final Git push, a complete authorization UI journey, or incident frequency. A difference between Session 2 and 3 alone is not a security finding: the same Agent may resume more than once. Next, define which fields belong to the approved scope versus the execution carrier, and test actual takeover and credential ownership end to end.
