# Observation Scorecard Contract V1

## Purpose

The Observation Scorecard is a weekly AI editorial self-evaluation of already-published research notes. It is deliberately separate from the daily publication gate: publication is a binary quality-control decision, while the weekly score is a comparative and revisable measurement from 0 to 100.

The authoritative rubric is `research/editorial/OBSERVATION-SCORE-RUBRIC.json`.

## Weekly procedure

1. Run after the Sunday Weekly synthesis is complete, with a target start time of 21:30 Asia/Shanghai.
2. Enumerate every eligible public observation note and calculate its source-content SHA-256.
3. Score every new or changed note across all four dimensions.
4. Inherit an unchanged note only when its content hash exactly matches the previous completed snapshot.
5. Re-evaluate at least 10% of hash-inherited notes as a deterministic audit sample.
6. On the first Sunday of each month, perform a full-corpus calibration instead of inheritance.
7. Mark the snapshot `Completed` only at 100% corpus coverage. An incomplete run must not replace the latest completed public scorecard.

## Required item evidence

Every directly scored item records four integer dimension scores, a concise reason for every dimension, evidence pointers into the article, a bilingual editorial note and the content hash. The total is calculated, never authored independently. Every inherited item identifies its source review date; every audited item records that it was directly rechecked.

## Level mapping

| Score | Internal | Public Chinese label |
|---:|:---:|---|
| 95–100 | E5 | 超凡 |
| 90–94 | E4 | 卓越 |
| 80–89 | E3 | 优质 |
| 70–79 | E2 | 合格 |
| 0–69 | E1 | 基础 |

The internal code is for machine processing and trend analysis. Public pages show the Chinese label, not the E-code.

## Low scores

A low weekly score is valid data. It does not mean that the article bypassed the daily publication gate, and it does not automatically remove a published article. It identifies relative weaknesses in evidence, judgment, expression or engineering usefulness and may create a future improvement candidate.

## Record shape

Completed records live under `research/editorial/scorecards/YYYY/MM/` and use schema `observation-scorecard/v1`. A record contains:

- review date, window, rubric version and reviewer identity;
- eligible, reviewed, inherited and audited counts plus 100% coverage;
- one item for every eligible canonical article path;
- SHA-256, scoring mode, four dimension results, calculated total, internal level, public labels and bilingual editorial note.

The site build validates all completed records and projects only the newest valid completed snapshot. Until the first V1 weekly snapshot exists, the 2026-08-10 scorecard remains visible only as a labelled historical manual baseline.
