---
title: "A2 Public Evidence Pack: Event Consumer Visibility"
date: '2026-08-28'
updated: '2026-08-31'
column: research-evidence
category: evidence
article_type: evidence-pack
edition: research-center
summary: "Preserves the 20,440-row historical event profile and V2.0.4 query probe, then adds the V2.1.2 three-consumer projection contract, first regression failure and independent-QA result."
lifecycle: "Published"
publication_authorized: true
---

[中文版本](/zh/research/evidence/2026-08-28-event-consumer-visibility)

# A2 | Event Consumer Visibility

## Claim

Historical storage containing projected fields does not prove that every query and outbound consumer applies the same least-visibility contract. In the tested V2.0.4 Activity path, an ordinary query returned a unique marker that existed only inside `payload.raw`. That is an old-baseline result; the delivered V2.1.2 behavior is documented below.

## Historical data profile

| Dataset | Rows | With `payload.raw` | Share |
| --- | ---: | ---: | ---: |
| Runtime | 2,743 | 1,474 | 53.7% |
| Analytics | 17,697 | 16,828 | 95.1% |
| Total | 20,440 | 18,302 | 89.5% |

A later Analytics subset from August 10 and 12 contained 681 rows with `payload.raw=0`. This is a sample observation, not a global field-allowlist guarantee.

## Re-runnable public attachments

The Reader/check below reads frozen JSON and verifies the statistics and probe record. It does not execute the private Runtime. The `current` field in the output refers to the original experiment baseline, not the version current when this page is read.

- [Sanitized fixture](/assets/evidence/2026-08-28-runtime-boundary/A2-event-consumer-fixture.json)
- [Reader](/assets/evidence/2026-08-28-runtime-boundary/A2-event-consumer-reader.mjs)
- [Check script](/assets/evidence/2026-08-28-runtime-boundary/A2-event-consumer-check.mjs)
- [Attachment SHA-256 manifest](/assets/evidence/2026-08-28-runtime-boundary/MANIFEST.txt)

```text
node A2-event-consumer-check.mjs
```

Expected output:

```json
{"evidence_id":"RBE-20260828-A2","rows":20440,"rows_with_payload_raw":18302,"raw_percent":89.5,"runtime_raw_percent":53.7,"analytics_raw_percent":95.1,"current_query_returned_raw_marker":true,"status":"PASS"}
```

## Boundary

The historical overall share is not a current V2.0.4 share. Raw fields appearing in a query result do not by themselves prove unauthorized access occurred. The public fixture does not cover Panel, Webhook, LAN or every diagnostic entry point.

## 2026-08-30: V2.1.2 delivered update

A pre-fix rerun on V2.1.1 `36e5c83b` confirmed that the raw marker could still be returned. V2.1.2 introduced server-defined `web_panel / activity_api / analytics` consumer policies and reconstructs new objects from recursive field allowlists. Unknown events do not pass unknown payloads through, while raw internal events remain available to authorized internal paths.

The first Shell targeted regression was 19 pass / 1 fail because semantic warning count dropped from 1 to 0 after an allowed diagnostic signal was over-pruned. After deriving and projecting only `ok/code/summary_blocked_reason/projection_status`, the targeted rerun reached 20/20 without restoring raw pass-through.

Independent QA B1 on candidate `64f633ac` observed one event, raw-marker count 0 and `raw_present=false`; event_type, task_id, session_id and projected_summary remained. B1 is an internal acceptance identifier, not this public A2 pack number.

## Sources for the newer claims and review visibility

| Claim | First-party source | Visibility |
| --- | --- | --- |
| Pre-fix marker visibility and allowlist implementation | `RUNTIME-BOUNDARY-20260830-001`, implementation `3302ca61` | Restricted mother-repository material |
| Over-pruning regression and repair, 19/20 → 20/20 | Failures and targeted-final records in the same pack | Restricted mother-repository material |
| B1 independent validation | `RUNTIME-BOUNDARY-QA-20260830-001`: independent-qa records | Restricted mother-repository material |
| V2.1.2 release and final regression | `V2.1.2-R3`, `V2.1.2-PUBLICATION-20260830-001`; Runtime 1842 pass / 0 fail / 1 skip, Shell 1037 pass / 0 fail | First-party release record, 2026-08-30 |

The [CodeFlowMu V2.1.2 Public Release Summary](/en/research/evidence/2026-08-30-codeflowmu-v2.1.2-public-release-summary) consolidates recursive allowlisting, safe projection, B1 independent QA, compatibility, release gates and residual risk. Complete source and raw release material remain restricted first-party evidence and are not public reading links; the historical JSON is not presented as a public fixture that can fully rerun the new private product.

The three current consumer projections are not a universal sensitive-content detector, complete subscriber governance or a real-network authorization audit. Open Edition was not released and no online instance is implied to have switched. Existing dependency warnings, the symlink-permission skip and uncovered real LAN/Gateway scope remain explicit. The historical 681-row raw=0 sample also cannot substitute for the new implementation tests.
