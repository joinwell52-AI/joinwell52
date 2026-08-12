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

## Prompt authority

An account-level scheduled task is a wake-only bootstrap. It must access the latest `main` branch, read the manifest declared by `SCHEDULER.json#workerPromptManifest`, resolve its own task ID, and execute the generated prompt from the same commit. It must not retain a second embedded copy of Runtime business rules.

The generated prompt bundle is deterministic repository state. Its version, schedule, required sources and SHA-256 are validated by `npm run worker-prompts:validate`, which is included in `npm run runtime:validate`. A missing manifest, unresolved task, hash drift, stale generated file or unreadable required source is a hard failure; cached prompt text is not an allowed fallback.

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
- Work: Skill 04 Research Analysis; state the question, classify evidence identities, compare, form a bounded judgment, identify an article type and candidate modules, map general implications, then test optional first-party relevance.
- Output: Research Object.
- Forbidden: analyzing unread sources, presupposing a fixed article outline, forcing TMPA/FCoP/CodeFlowMu mapping, or publishing directly.

### 15:00 — Research Runtime Production

- Input: Research Object only.
- Work: identify the article type → select dynamic modules → Skill 05 Writing → one formal editorial Article Cover → decide and place `0..N` contextual Inline Figures → Skill 07 Evidence & Citation → Skill 08 Publication Editing → editorial-contract and static Article Layout validation → optional Community Edition decision.
- Output: complete bilingual V2 Publication Candidate with six editorial gates plus `coverGate`, `inlineVisualGate` and `layoutGate` passed.
- Forbidden: writing from a Signal Pool or Reading Result, releasing directly, reusing a universal body outline, forcing first-party project sections, treating publication status as validation, using a technical diagram as the cover, generating fixed `## Cover` / `## Figure` image sections, manufacturing an unnecessary Figure, or copying the Research Center article into a Community Edition.

### 20:00 — Research Runtime Publication

- Input: complete Publication Candidates only.
- Work: update bilingual Research Center files, authorized distinct Community Edition surfaces, indexes and website; commit; verify; release.
- Output: Released Daily Research.
- Forbidden: new research, substantive rewriting or evidence repair.

## Weekly Runtime worker

- Input: evidence-validated Daily Research from the previous seven days.
- Work: synthesize the week's material changes, their connections, evidence and disputes, supportable judgments and unresolved questions into an independently readable AI Research Brief.
- Output: Weekly Synthesis.
- Forbidden: copying or concatenating Daily articles or forcing TMPA/FCoP/CodeFlowMu implications.

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
