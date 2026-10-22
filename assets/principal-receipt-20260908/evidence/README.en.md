
# Shared Agent Identity and Corrupted Receipts: Public Evidence Guide

[简体中文](https://joinwell52-ai.github.io/joinwell52/zh/research/evidence/2026-09-08-principal-receipt) · [Download the public bundle](https://joinwell52-ai.github.io/joinwell52/assets/principal-receipt-20260908/evidence.zip)

This bundle supports the [shared-agent identity article](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-09-08-shared-agent-instruction-identity) and the [corrupted-receipt counterexample](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-09-08-corrupt-receipt-dispatch-counterexample). Publication is not validation; checking saved records is not rerunning the product.

## Provenance and formal sets

The research date is September 8, 2026. The fixed first-party commit is `c008d9db91a21136fc61a4f60314e22db395d5d2`, using Windows and Node v24.16.0. Each run retained hashes of relevant source files. These are not a complete repository dependency closure.

| Files | Contents | Formal observations |
| --- | --- | ---: |
| observations-1.json / observations-2.json | A0–A4 actor controls, R0–R8 receipt controls, S0–S2 and O1 store controls | 18 per run |
| observations-3.json / observations-4.json | I0–I7 actual dispatch-chain scenarios | 8 per run |
| observations-5.json / observations-6.json | J0–J3 source projection and policy construction | 4 per run |

There are 60 saved observations, not 60 incidents, independent users or a reliability score. Exploratory runs are excluded and named in [provenance.json](https://joinwell52-ai.github.io/joinwell52/assets/principal-receipt-20260908/evidence/provenance.json). A3's different humans existed only in research narration; the product input contained no human identity. It is not a two-account experiment.

Paperclip [#13005](https://github.com/paperclipai/paperclip/pull/13005) was merged at the research snapshot, at `1cc45086d3b2f2710d4e161b0dc9ad1d3662a9a8`. It supplies a comparison for identity and credentials in managed GitHub operations. The author's dual-account tests were not rerun by us. Orca [#19399](https://github.com/stablyai/orca/pull/19399) was still a draft at the snapshot, head `885bdbb85617ba248c720073678d34e1e14b62b4`; generation-based log repair is a proposal, not a delivered capability verified here.

## Claim-to-observation mapping

| Claim | Observations | Does not establish |
| --- | --- | --- |
| Agent-subject changes invalidate old approval/reuse | A1, A4, J3 | Complete human-identity continuity |
| Nested triggering message is absent from its session field | J1/J2, logical execution ID as positive control | All chat and command provenance is lost |
| Corrupt receipts can cause another callback | R2/R3/R6 | Duplicate real tasks or external effects |
| No second start for tested same-key dispatch paths | I1–I6 | Safety across every platform and interruption |
| A new key can produce another attempt | I7, permitted by synthetic governance | Changing a key grants human authority |
| Other stores explicitly distinguish corruption and absence | S0–S2, O1 | Uniform behavior across all stores |

[Historical aggregates](https://joinwell52-ai.github.io/joinwell52/assets/principal-receipt-20260908/evidence/history.json) came from sequential file reads on September 8 of September 5 records: one approval, ten receipt rows/five keys, and 25 skill invocations, nine with session IDs. This is not an atomic global snapshot. Missing selected fields do not prove missing equivalent information everywhere. Counting integrity fields is not cryptographic signature verification.

## How to check

Unzip the public bundle, enter the evidence directory, and use Node 22 or later:

```text
node check-records.mjs
```

The checker verifies byte counts and SHA-256 for every manifest entry, then the paired 18/8/4 sets, stable-result agreement, and article controls. Expected output begins `PASS: public file hashes, 60 saved observations` and explicitly says this is not a new product run or independent QA. Failure throws an error and returns a nonzero exit code.

The chain is claim → source hash → sanitized observation → reader/assertions → expected output → limitation. This bundle does not include full product source or claim that it alone reconstructs the experiments. Product replay requires the fixed source, dependencies, isolated task fixtures, governance substitutes and in-memory SDK. Original scripts and full fixtures remain access-restricted.

## Sanitization and limits

Per-run exports remove only local fixture locators and process IDs, retaining process counts. Each export includes the original file's SHA-256. Outcomes, ordering, rejection conditions, source hashes and limitations remain unchanged. Historical exports contain aggregates and hashes, not raw operational records or their filenames. Hashes link versions; they cannot independently reveal or validate inaccessible originals.

Approval callbacks, governance snapshots and SDK have explicit synthetic portions. There were no real two-person authentication, credential-switching, payment, email or repository-push tests. I6 shares one dispatcher in one process. I3 sequentially reads old disk state in a new process; it does not test concurrent cross-process write locks, hardware power loss or complete startup recovery. A durable running projection does not prove that the original process is alive.

The research changed no product, implemented no repair and obtained no independent QA. Publication preparation did not add a product experiment. Covers are editorial metaphors. Inline figures explain J1/J2 and I2/I7, not additional measurements or substitutes for the records.
