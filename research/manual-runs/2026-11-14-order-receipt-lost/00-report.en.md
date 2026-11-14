# An order committed, but its receipt was lost: public experiment record

Date: 2026-11-14. This is an isolated research fixture using child processes and a temporary SQLite database. The business system, orders, and interruption points are simulated. This is **not** a live CodeFlowMu or third-party order integration, nor a production incident.

## Source and question

[Paperclip #21522](https://github.com/paperclipai/paperclip/pull/21522) reports a real engineering case: the server committed a mutation, the client timed out, and an unknown receipt blocked subsequent actions. Its fix settles outcomes supported by Paperclip's own final server record. We ask a narrower question: when an AI worker calls a separate business system and loses the reply, what evidence permits retry, settlement, or human reconciliation?

CodeFlowMu is our local multi-agent collaboration system; FCoP stores formal task and report facts. This experiment does not propose moving CodeFlowMu to Paperclip's database design. The relationship between an external order result and FCoP work facts remains a question to test.

## Method and observed results

The child process exits at one of three points: before commit, after commit but before response, or after response but before the local receipt. Recovery checks the simulated business system by operation key. It retries only after an authoritative absence; an existing order is settled from the business record. A SQLite unique index enforces atomic deduplication by operation key. A negative control removes that key and retries blindly after the response is lost.

Run `python probe_order.py` with the Python standard library. Each run uses a fresh temporary directory and deletes its database afterwards. Source: [probe_order.py](probe_order.py).

| Stop point | Child exit | Orders before recovery | Local receipt | Recovery decision | Orders after |
| --- | ---: | ---: | --- | --- | ---: |
| Before commit | 72 | 0 | absent | Retry after authoritative absence | 1 |
| After commit, before response | 73 | 1 | absent | Settle from business record | 1 |
| After response, before local receipt | 74 | 1 | absent | Settle from business record | 1 |

With no operation key and no result lookup, the blind-retry control exits `73` then `0` and produces **two orders**. The same absent local receipt appears in both committed and uncommitted states; it cannot establish the business outcome.

## Product comparison and limits

We read CodeFlowMu V3.0.152 source at `0d2d4e742ef2f3cb48e3ce09cc47f0c03053dc5f`. Its `source_call_effect.py` retains `unknown/auto_retry=False` when original-call evidence is incomplete; `source_task_session_recovery.py` refuses explicit recovery after an unknown effect; `source_runtime.py` does not automatically replay uncertain writes. Eighteen focused recovery, approval-binding, and PM-review-scope tests passed. Nine call-effect tests stopped in fixture setup with `SOURCE_BOOTSTRAP_ADMIN_REQUIRED` because this Windows process was not elevated; their assertions did not run. The product source and its test records are in a restricted local workspace. Public readers can rerun the order fixture and inspect the upstream PR, but cannot independently verify the product's internal tests from this page alone. These code paths and bounded tests do not prove settlement for arbitrary external business APIs, and we have not confirmed a new product defect.

We did not run a real network, concurrent order submissions, a live business service, an end-to-end FCoP Core task, or two actual Hosts. If the downstream system provides neither an idempotency key nor an authoritative result lookup, the supported response is to retain uncertainty and request human reconciliation. Absence of a local receipt does not prove nonexecution.

## Reader check

1. Run the script and verify child exits `72/73/74`, order counts before recovery `0/1/1`, and final counts `1/1/1`.
2. Confirm the unkeyed blind retry makes two orders. This is a deterministic program control, not model behavior.
3. Check the client receipt, downstream final record, and FCoP task fact separately. None substitutes for the others.

Chinese evidence: [00-report.md](00-report.md).
