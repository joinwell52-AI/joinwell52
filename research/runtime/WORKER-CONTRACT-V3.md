# Research Runtime Worker Contract V3

## Global contract

Every Runtime worker must:

1. read the authoritative V5 Scheduler and the record for its own Runtime family;
2. consume only the declared stage input;
3. perform only the work assigned to that stage;
4. write durable outputs before reporting completion;
5. record Input, Work Result, Output, Next, Metrics, Evidence and Artifacts;
6. update only its own family record;
7. commit and verify GitHub changes when the stage creates or releases durable repository artifacts.

A worker must never infer completion from a scheduler trigger.

## Daily Runtime workers

### 09:00 — Research Runtime Discovery

- Input: the three Research Intelligence profiles.
- Work: scan, normalize and deduplicate same-day signals.
- Output: Signal Pool.
- Forbidden: selecting topics, Deep Reading, analysis or writing.

### 10:00 — Research Runtime Queue

- Input: same-day Signal Pool.
- Work: score and decide each of the three columns.
- Output: Today's Research Plan with `Selected` or `No Selection` for every column.
- Forbidden: leaving a column undecided or publishing directly.

### 11:00 — Research Runtime Reading

- Input: selected same-day objects.
- Work: Skill 03 Deep Reading and evidence extraction.
- Output: Reading Result.
- Forbidden: substituting summaries for primary reading or drafting the article.

### 13:00 — Research Runtime Analysis

- Input: Reading Result.
- Work: Skill 04 Research Analysis, comparison, judgment and implication mapping.
- Output: Research Object.
- Forbidden: analyzing unread sources or publishing directly.

### 15:00 — Research Runtime Production

- Input: Research Object only.
- Work: Skill 05 Writing → Skill 06 Visualization → Skill 07 Evidence & Citation → Skill 08 Publication Editing.
- Output: complete bilingual Publication Candidate.
- Forbidden: writing from a Signal Pool or Reading Result, or releasing directly.

### 20:00 — Research Runtime Publication

- Input: complete Publication Candidates only.
- Work: update bilingual public files, indexes and website; commit; verify; release.
- Output: Released Daily Research.
- Forbidden: new research, substantive rewriting or evidence repair.

## Weekly Runtime worker

- Input: evidence-validated Daily Research from the previous seven days.
- Work: synthesize Trend, Architecture, Engineering and Prediction judgments.
- Output: Weekly Synthesis.
- Forbidden: copying or concatenating Daily articles.

## Academic Runtime worker

- Input: Paper, Benchmark, Specification or Institution object.
- Work: complete Reading, Analysis, Writing, Visualization, Evidence and Editing pipeline.
- Output: Academic Observation.
- Forbidden: ordinary product news or general industry announcements.

## Research Program Runtime worker

- Input: independent Program queues for TMPA, FCoP, CodeFlowMu, Digital Employee and Research Operating System.
- Work: advance eligible objects through Program Queue, Research, Review and Program Publication.
- Output: governed Program transition and Program Runtime Record.
- Forbidden: entering Daily Runtime, consuming a Daily column slot or publishing without Program Review.

## Result rule

A terminal task result must conform to `runtime-shift-result/v2`. Successful execution is `Completed`, including a governed zero-output result. `Skipped` is valid only when the shift is explicitly not applicable and is not executed.

## GitHub rule

GitHub is the single source of truth. A repository-changing task is complete only after its commit is fetched and verified. Drafting text in chat or reporting intended changes is not completion.
