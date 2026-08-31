---
title: "A3 Public Evidence Pack: Skill and Session Evidence Chain"
date: '2026-08-28'
updated: '2026-08-31'
column: research-evidence
category: evidence
article_type: evidence-pack
edition: research-center
summary: "Preserves 59 historical records and the old field-propagation probe, then adds the V2.1.2 SessionStore binding contract and independent-QA three-key and integrity results."
lifecycle: "Published"
publication_authorized: true
---

[中文版本](/zh/research/evidence/2026-08-28-skill-session-evidence)

# A3 | Skill and Session Evidence Chain

## Claim

A skill configuration existing, entering a Session, being actually invoked, and producing a valid engineering result are different facts. In the tested V2.0.4 ordinary skill path, `session_id` was used for runtime deduplication but was not persisted into the invocation evidence. That is a historical gap; the delivered V2.1.2 behavior is described below.

## Historical field profile

| Correlation field | Present | Missing | Missing rate |
| --- | ---: | ---: | ---: |
| `task_id` | 49 | 10 | 16.9% |
| `session_id` | 0 | 59 | 100.0% |
| `thread_key` | 42 | 17 | 28.8% |
| `agent_id` | 15 | 44 | 74.6% |
| `integrity` | 59 | 0 | 0% |

The latest sample date is 2026-08-12. The sample does not represent every current skill entry point. The sanitized mixed sample intentionally preserves both ordinary runtime-read records and planning evidence verified by Runtime authority; those evidence levels prove different things.

## Re-runnable public attachments

The Reader/check below validates field statistics and correlations in the frozen JSON sample. It does not execute the private Runtime. `current_probe` refers to the historical baseline at the time of the original research, not the version current on the day this page is read.

- [Sanitized fixture](/assets/evidence/2026-08-28-runtime-boundary/A3-skill-session-fixture.json)
- [Reader](/assets/evidence/2026-08-28-runtime-boundary/A3-skill-session-reader.mjs)
- [Check script](/assets/evidence/2026-08-28-runtime-boundary/A3-skill-session-check.mjs)
- [Attachment SHA-256 manifest](/assets/evidence/2026-08-28-runtime-boundary/MANIFEST.txt)

```text
node A3-skill-session-check.mjs
```

Expected output:

```json
{"evidence_id":"RBE-20260828-A3","records":59,"session_id_missing":59,"session_id_missing_percent":100,"current_probe_persisted_task":true,"current_probe_persisted_thread":true,"current_probe_persisted_session":false,"mixed_evidence_levels":2,"status":"PASS"}
```

## Boundary

These materials do not mean every skill-evidence entry point lacked Session identity, do not prove that skill recommendations were wrong, and do not justify guessing historical Session identities to backfill missing records. Invocation evidence can prove an invocation occurred; it does not by itself prove task completion.

## 2026-08-30: V2.1.2 delivered update

A pre-fix rerun on V2.1.1 `36e5c83b` confirmed that ordinary invocation records still lost Session identity. Implementation commit `3302ca61` added Runtime checks against SessionStore existence, Agent identity and existing task/thread context. Persisted evidence now distinguishes `verified / invalid_claim / not_applicable`, corresponding to a trusted binding, an invalid claim, and a legitimate sessionless operation backed by a Runtime reason.

Independent QA C1 on `64f633ac` used an actual SessionStore registration and observed one journal record, task/thread/session matching 3/3, `session_binding=verified`, `binding_reason=runtime_session_store_match`, `evidence_source=sdk_tool_call`, with integrity verification passing.

C1 is an internal acceptance identifier, not this public A3 pack number. The valid-binding case does not by itself prove forged-session rejection, sessionless handling or three-key presence on every call; those branches are covered by separate development tests. Delivered verification on the ordinary path also should not be expanded into a claim of complete Session-lifecycle auditing.

## Sources for the newer claims and review visibility

| Claim | First-party source | Visibility |
| --- | --- | --- |
| Pre-fix gap, SessionStore binding and failure branches | `RUNTIME-BOUNDARY-20260830-001`: phase0, targeted records and implementation | Restricted mother-repository material |
| C1 three-key and integrity validation | `RUNTIME-BOUNDARY-QA-20260830-001`: independent-qa records | Restricted mother-repository material |
| V2.1.2 formal release and final regression | `V2.1.2-R3`, `V2.1.2-PUBLICATION-20260830-001`; Runtime 1842 pass / 0 fail / 1 skip, Shell 1037 pass / 0 fail | First-party release record, 2026-08-30 |

The [CodeFlowMu V2.1.2 Public Release Summary](/en/research/evidence/2026-08-30-codeflowmu-v2.1.2-public-release-summary) consolidates the SessionStore verification boundary, all three Runtime changes, C1 independent QA, compatibility, release gates and residual risk. Complete source and raw logs remain restricted first-party material and are not public reading links; the historical fixture is not presented as a V2.1.2 end-to-end reproduction kit.

V2.1.2 does not backfill historical Sessions and does not treat `outcome=ok` or a valid integrity digest as proof that a TASK is complete. Open Edition was not released as part of this patch and no online instance is implied to have switched. Existing warnings, the Windows symlink skip and untested real-deployment scope remain explicit.
