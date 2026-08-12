# Research Runtime Worker Contracts V2

This document defines the worker obligations paired with Research Runtime Scheduler V2.0. The GitHub scheduler opens execution slots; the ChatGPT Digital Research Employee performs the work and closes each slot.

## Common completion requirements

Every worker must:

1. read the current Scheduler, Runtime Record and authoritative upstream artifacts;
2. perform only its assigned responsibility;
3. update its `task_<id>` status accurately;
4. append one `runtime-task-result/v1` block containing bilingual Input, Work Outcome, Output, Next, Metrics and Artifacts;
5. update the Runtime Log;
6. commit durable outputs when the task creates or changes them;
7. fetch and verify the resulting commit before reporting `Completed`.

`Skipped` means the worker ran and found no eligible output. It requires a bilingual reason and does not count as completed work.

## 09:00 — Research Runtime Engine

Advance eligible objects by exactly one governed lifecycle transition. Use the Skill required by the current state. Do not select a second active object merely to manufacture progress. Preserve evidence, blockers and next action.

## 10:00 — Research Runtime Queue

The Queue worker is also the governed Research Intelligence worker. It must load:

```text
research/intelligence/REGISTRY.json
```

Then execute all three Skill 01 profiles due for the operating date:

```text
Skill 01-P — AI Platform Change Intelligence
Skill 01-G — GitHub Engineering Intelligence
Skill 01-R — Published Research Intelligence
```

### Intelligence obligations

1. Scan all due P0 AI platforms: OpenAI, Anthropic/Claude, Google/Gemini, Cursor, GitHub Copilot and Microsoft Copilot Platform.
2. Check official release notes, documentation, forums or communities, official repositories, status and policy channels as defined by the Registry.
3. Scan the due GitHub repository watchlist incrementally; do not pretend to scan all of GitHub.
4. Scan due paper, preprint, technical-report, benchmark and research-lab sources.
5. Record checked, authentication-required, inaccessible and failed sources separately.
6. Normalize and deduplicate the same change appearing in platform, GitHub and research sources.
7. Assign exactly one primary column to every selected object and preserve optional secondary impact.
8. Execute Skill 02 — Three-Column Research Triage only after source coverage is recorded.

Write the daily intelligence run to:

```text
research/intelligence/runs/YYYY/MM/YYYY-MM-DD-intelligence.json
```

Then update the canonical Queue and write:

```text
research/runtime/plans/YYYY/MM/YYYY-MM-DD-plan.json
```

The plan must contain exactly three decisions:

- Digital Employee;
- Industry Architecture;
- Open-source Engineering.

For each column, select at most one primary object or explicitly record `No Selection` with the reason. Every selected Queue object must have one primary column. Queue must not write a publication.

On and after the Research Intelligence Registry effective date, Queue cannot be `Completed` unless:

- all three intelligence pipelines are `Completed`;
- every due source is checked, explicitly inaccessible or failed with a reason;
- all three columns have `Selected` or `No Selection`;
- the selected IDs in the intelligence run and Daily Research Plan match;
- the resulting GitHub commit is fetched and verified.

## 11:00 — Research Runtime Knowledge

Admit only completed and evidence-validated Research Notes. Maintain knowledge records, relationships, recurring findings and architecture candidates. Do not treat a selected Queue object or Analysis record as a completed Research Note.

## Monday 12:00 — Research Runtime Architecture

Review evidence-backed architecture candidates and make one governed disposition. Do not execute Engine transitions and do not promote a single unsupported observation.

## 15:00 — Research Runtime Production

Read the Daily Research Plan, current Queue and eligible analyzed objects. For each eligible Research Object:

1. confirm the research question and evidence identities;
2. identify an article type from the extensible registry, or declare a justified extension;
3. select and order only content modules that advance the answer;
4. record project relevance after the research judgment exists;
5. execute:

```text
Skill 05 — Research Writing
Skill 06 — Visualization
Skill 07 — Evidence & Citation
Skill 08 — Publication Editing
```

Create complete Chinese and English reports, required visual assets, valid metadata and a candidate batch at:

```text
research/runtime/candidates/YYYY/MM/YYYY-MM-DD-candidates.json
```

New output uses `runtime-publication-candidate/v2` and `publication-candidate-article/v2`. The output lifecycle is `Publication Candidate`. Production must not place the report into the public article directory and must not publish to the website.

Article structure serves the research question. Do not reuse `Summary → Source → Observation → Discussion → Engineering Impact → Future Work → References` as a mandatory outline. Those modules remain available only when they add value. `Engineering Impact`, `Implications for Current Work` and `Conclusion` are optional, and an article may end with Limitations, What Remains Unclear or Open Questions.

For external research, conclusions must stand without first-party project names. Do not insert TMPA, FCoP or CodeFlowMu as a habitual final destination or internal-link target. General engineering implications address the affected class of systems, runtimes, governance, operations or developer practice first.

Classify every material claim as public fact, source-reported claim, our observation, our interpretation, internal experimental evidence, independent evidence, hypothesis or open question. Do not infer validation from publication, DOI, Zenodo, indexing, citation, peer review or successful implementation.

For each eligible Research Object, produce one formal editorial Article Cover. The cover must use cinematic or controlled editorial lighting, one dominant semantic object, strong visual hierarchy and low information density. It must read as the opening image of a serious technology publication. Architecture diagrams, workflows, lifecycle diagrams, state machines, dashboards and node graphs are not valid Article Covers.

Technical visuals are Inline Figures. Decide whether the article benefits from visual explanation, generate `0..N` figures accordingly, and insert each one directly into the relevant body section with a bilingual caption and source basis. Do not create fixed Markdown sections named:

```text
## Cover
## Figure
## Visualization
## 题图
## 文中图
## 解释图
```

Run Research Value, Independence, Evidence, Structure, Language, Bilingual Consistency, Cover, Inline Visual and Article Layout Gates before marking the candidate complete. The final candidate must read and render as a finished research publication, not as a generated artifact inventory or a high-volume template instance.

After the Research Center Edition is complete, decide whether a Community Edition adds a real discussion angle for a named professional community. A generated Community Edition must have a different title, angle, structure and discussion question; it cannot be a full copy, generic summary or advertisement. `not-generated` with a reason is valid.

When no object has passed all upstream gates, complete the governed Production review with zero candidates and record the exact bilingual outcome. Use `Skipped` only when the shift is explicitly not applicable and was not executed.

## 20:00 — Research Runtime Publication

Read only the Publication Candidate batch. Release complete Research Center candidates by column and only separately authorized Community Editions; update public bilingual Markdown, metadata, indexes and website references, commit to GitHub, fetch the commit and verify the published paths.

Publication must not discover sources, perform analysis, write a new report or repair weak evidence. A failed candidate returns to Production or the relevant earlier stage.

## Sunday 20:30 — Research Runtime Weekly

Use the previous seven days of evidence-validated Daily Research Notes. Build an independently readable AI Research Brief around the week's materially important changes, connections among them, evidence and disputes, supportable judgments and unresolved questions. Do not concatenate Daily notes and do not force mapping to TMPA, FCoP or CodeFlowMu. `Implications for Current Work` is optional and requires a substantive relationship produced by the findings.

## Wednesday 10:00 — Research Runtime Academic

Select only papers, benchmarks, specifications, conferences or institutions. Execute the complete Research Skills pipeline and publish only after evidence and editing gates pass. Ordinary news is excluded.

## Operational limitation

The repository workflow schedules all eight slots. A separate ChatGPT automation must exist for the 15:00 Production worker; the GitHub cron alone cannot generate research prose. Until that worker is enabled, the Production slot remains `Waiting` rather than being manufactured as `Completed`.
