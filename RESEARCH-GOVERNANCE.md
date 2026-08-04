# Digital Employee Works — Research Governance

## 1. Single Source of Truth

The `joinwell52-AI/joinwell52` GitHub repository is the only authoritative research database, Runtime Record store, source-intelligence registry, publication-candidate store, and publication history of Digital Employee Works.

All active work is maintained directly in this repository:

- Research Intelligence Registry and daily intelligence runs;
- Research Runtime Charter, scheduler manifest, Worker Contracts, and Runtime Records;
- three-column Daily Research Plans;
- Publication Candidate batches;
- Research Skills and Research Queue artifacts;
- Observation Notes;
- Digital Employee architecture and capability releases;
- TMPA papers and specifications;
- implementation cases;
- visual assets and website source.

No secondary local database is authoritative. A local copy may exist only as a temporary checkout, cache, or migration archive. The deprecated ChatGPT Library `/TMPA` folder is read-only and must not receive new revisions.

## 2. Current capability baseline

The current formal operating baseline is:

```yaml
production_engine: Research Report Production Engine V1.3
runtime_center: Research Runtime Center V4
scheduler: Research Runtime Scheduler V2.0
skills: Research Skills V2.0
intelligence: Research Intelligence System V1.0
system_of_record: GitHub
```

V1.0 remains the historical Production Test baseline. V1.1–V1.3 record the addition of structured Runtime outcomes, three-column planning, Production and Publication separation, and three source-intelligence pipelines.

## 3. Product and engineering hierarchy

The public capability hierarchy is:

```text
TMPA + FCoP
      ↓
CodeFlowMu + Digital Employee
```

- TMPA is the independent theory and specification layer;
- FCoP is the file-based coordination protocol;
- CodeFlowMu is the Digital Employee development and work Runtime;
- Digital Employee is the product and delivery layer.

The website capability section presents TMPA and FCoP in the first row. CodeFlowMu leads the second row, followed by Digital Employee.

## 4. Research Intelligence authority

Research Intelligence System is the formal source-discovery layer of the Research Operating System.

Exactly three source-intelligence pipelines are recognized:

1. `Skill 01-P — AI Platform Change Intelligence`;
2. `Skill 01-G — GitHub Engineering Intelligence`;
3. `Skill 01-R — Published Research Intelligence`.

All three pipelines serve the same three research columns:

1. `digital-employee`;
2. `industry-architecture`;
3. `open-source-engineering`.

Source pipelines and research columns are separate dimensions. A source type does not determine the column automatically.

The authoritative source definition is:

```text
research/intelligence/REGISTRY.json
```

Every formal Queue run after the effective date must write or update:

```text
research/intelligence/runs/YYYY/MM/YYYY-MM-DD-intelligence.json
```

The intelligence run must record:

- sources due;
- sources checked;
- inaccessible channels;
- failed checks;
- signals;
- candidates;
- selected and rejected objects;
- a `Selected` or `No Selection` decision for every research column.

“Checked with no important change” and “not checked” are different facts and must never be conflated.

## 5. Evidence hierarchy

Evidence authority is ordered as follows:

1. official announcement or release note;
2. official documentation;
3. official staff confirmation;
4. peer-reviewed or primary research evidence;
5. merged maintainer change, test, or security advisory;
6. reproducible community report;
7. unverified discussion.

Community discussion is a lead unless it is reproduced or confirmed. Popularity, stars, forum volume, and vendor claims are not independent validation.

The same change appearing in a platform announcement, GitHub repository, and paper must be deduplicated into one change object with multiple evidence sources.

## 6. Three-column Research Triage

Every selected object has exactly one primary column. Secondary impacts may be recorded, but the same object must not become three duplicate Daily notes.

The three columns are:

### Digital Employee

Positions, responsibilities, workflows, runtime, waiting, recovery, escalation, approval, delivery, and evaluation.

### Industry Architecture

The agent products, workspaces, runtimes, permissions, connectors, enterprise controls, and product boundaries of major AI platforms, including OpenAI, Claude, Gemini, Cursor, GitHub Copilot, and Microsoft Copilot Platform.

### Open-source Engineering

Agent runtimes, protocols, SDKs, tools, benchmarks, recovery, testing, security, and observability mechanisms.

The 10:00 Queue task must make one explicit decision for each column:

- `Selected`, with object, source, priority, lifecycle, reason, and next action; or
- `No Selection`, with source coverage and the exact threshold or evidence gap.

The authoritative daily plan is:

```text
research/runtime/plans/YYYY/MM/YYYY-MM-DD-plan.json
```

A publishing target must never force a weak signal into selection.

## 7. Research Runtime authority

Research Runtime Center is the operational control plane of the Research Operating System.

Research OS defines lifecycle and work rules. Research Runtime Scheduler V2.0 is the only formal scheduler. Research Report Production Engine V1.3 and other Digital Research Employee workers execute inside this control plane.

Exactly eight formal Runtime tasks are recognized:

1. Research Runtime Engine;
2. Research Runtime Queue;
3. Research Runtime Knowledge;
4. Research Runtime Architecture;
5. Research Runtime Production;
6. Research Runtime Publication;
7. Research Runtime Weekly;
8. Research Runtime Academic.

The authoritative schedules, responsibilities, and boundaries are stored in:

```text
research/runtime/SCHEDULER.json
```

Timezone is `Asia/Shanghai`.

## 8. Formal Runtime schedule and boundaries

| Runtime | Schedule | Responsibility | Boundary |
|---|---:|---|---|
| Engine | Daily 09:00 | Advance one governed lifecycle transition. | No stage skipping or direct publication. |
| Queue | Daily 10:00 | Run intelligence, triage candidates, and publish three-column decisions. | No direct publication; no unassigned selected object. |
| Knowledge | Daily 11:00 | Admit evidence-validated Research Notes into Knowledge. | A Signal, Selected object, or Analysis record is not a completed Research Note. |
| Architecture | Monday 12:00 | Make architecture and lifecycle dispositions. | No decision from a single unsupported observation. |
| Production | Daily 15:00 | Execute Writing, Visualization, Evidence & Citation, and Publication Editing. | No direct publication and no writing from an unvalidated signal. |
| Publication | Daily 20:00 | Release complete candidates, update indexes and website, commit, and verify. | No new discovery, analysis, substantive writing, or evidence repair. |
| Weekly | Sunday 20:30 | Produce genuinely new cross-topic synthesis. | Must not concatenate Daily notes. |
| Academic | Wednesday 10:00 | Research papers, benchmarks, standards, conferences, and institutions. | Ordinary news is excluded. |

## 9. Production and Publication separation

### 15:00 Production

Production creates a complete bilingual Publication Candidate:

```text
Research Writing
→ Research Visualization
→ Evidence & Citation
→ Publication Editing
→ Publication Candidate
```

A complete candidate contains:

- Chinese Markdown;
- English Markdown;
- valid frontmatter and column assignment;
- a completed visual or an explicit no-visual decision;
- verified evidence and citations;
- completed publication editing.

The authoritative candidate batch is:

```text
research/runtime/candidates/YYYY/MM/YYYY-MM-DD-candidates.json
```

Production must not place the candidate in the public article directory.

### 20:00 Publication

Publication consumes complete candidates only:

```text
Publication Candidate
→ public bilingual Markdown
→ metadata / indexes / website
→ GitHub Commit
→ Commit Verify
→ Release
```

A failed release candidate returns to Production or the relevant upstream research stage.

## 10. Runtime Record

Every formal execution creates or updates:

```text
research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md
```

Runtime Record is the single source of truth for:

- today’s scheduled tasks;
- task statuses;
- task inputs and work outcomes;
- durable outputs;
- next governed actions;
- metrics and artifacts;
- Runtime Timeline and append-only Runtime Log;
- GitHub commit and Commit Verify;
- publication outcome.

Exactly six statuses are allowed:

```text
Running · Completed · Blocked · Failed · Skipped · Waiting
```

A scheduler trigger opens an execution slot; it does not prove completion. Without actual worker execution, the task remains `Waiting`, `Blocked`, or `Failed`.

`Skipped` means the worker actually ran but produced no eligible output. It requires a reason and does not count toward completion.

## 11. Mandatory work-outcome report

A terminal task must report:

```text
Input
→ Work Outcome
→ Durable Output
→ Next Governed Action
→ Metrics
→ Artifacts and GitHub Evidence
```

Reporting only “Completed” is not a valid Digital Employee work report.

Dashboard and website values must be generated from Runtime and Intelligence artifacts. Hand-maintained status values, history lists, topic lists, and counts are prohibited.

## 12. Publication gate

Every formal Daily publication follows:

```text
Research Intelligence
→ Three-Column Triage
→ Governed research object
→ Publication Candidate
→ Runtime Record + Task Result
→ public bilingual files
→ GitHub Commit
→ Commit Verify
→ Release
```

A formal publication change without a Runtime Record must fail validation.

A publication may be `Completed` only after:

1. the defined output exists;
2. required metadata, column, and language pairing are valid;
3. a complete Publication Candidate exists;
4. the GitHub commit exists;
5. the commit and output paths are directly verified;
6. the final Runtime Log event is recorded.

**Highest engineering constraint:** a publication without a Runtime Record and Commit Verify is not an official runtime output.

## 13. Observation Notes information model

Observation Notes are organized by two independent dimensions.

### Column

```yaml
column: digital-employee | industry-architecture | open-source-engineering
```

### Category

```yaml
category: daily | weekly | academic
```

Daily, Weekly, and Academic are publication categories inside each column. Academic is not a fourth research column.

Required frontmatter:

```yaml
title: Article title
date: 'YYYY-MM-DD'
column: digital-employee | industry-architecture | open-source-engineering
category: daily | weekly | academic
summary: Short list summary
```

The website reads these fields directly and generates counts, newest-first lists, and calendar filtering. Manual article counts and chronological lists are prohibited.

## 14. GitHub-first history policy

Git provides the authoritative history:

- commits record editorial and runtime evolution;
- diffs record changes;
- pull requests and CI record validation;
- tags and release records mark versions;
- GitHub Pages publishes the current approved view.

Generated text is not a formal result until it passes the applicable Runtime and publication gates.

## 15. Download and license boundary

The repository is publicly readable, clonable, and downloadable. No APK, EXE, or conventional installer is required; the repository itself is the distribution.

Reproduction, adaptation, redistribution, and commercial use follow the current `LICENSE.md`.

## 16. TMPA boundary

Research Report Production Engine V1.3 applies a single-writer lifecycle-governance subset of TMPA: explicit states, gates, durable evidence, Git commits, and Reader reconstruction.

It does not demonstrate the full multi-writer role separation of TMPA and must not be presented as complete validation of every TMPA claim.

## Final principles

> Research Runtime is the only formal execution scheduler of the Research Operating System.

> Research Intelligence must report source coverage before Queue can formally complete.

> Every research column receives an explicit daily decision.

> Production creates complete reports; Publication releases them.

> Every scheduled task reports actual work outcomes, not merely execution status.

> Every formal output is observable, recorded, and verifiable through GitHub.
