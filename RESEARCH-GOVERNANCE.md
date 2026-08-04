# Digital Employee Works — Research Governance

## 1. Single Source of Truth

The `joinwell52-AI/joinwell52` GitHub repository is the only authoritative research database, Runtime Record store, source-intelligence registry, publication history, and website source of Digital Employee Works.

No secondary local database or ChatGPT Library copy is authoritative. A local copy may exist only as a temporary checkout, cache, or migration archive.

## 2. Current capability baseline

```yaml
production_engine: Research Report Production Engine V1.3
runtime_center: Research Runtime Center V5.0
scheduler: Research Runtime Scheduler V3.0
architecture_status: frozen
skills: Research Skills V2.0
intelligence: Research Intelligence System V1.0
system_of_record: GitHub
```

V4 and earlier remain frozen historical evidence. V5 begins on 2026-08-05.

## 3. Product and engineering hierarchy

```text
TMPA + FCoP
      ↓
CodeFlowMu + Digital Employee
```

- TMPA is the independent theory and specification layer;
- FCoP is the file-based coordination protocol;
- CodeFlowMu is the Digital Employee development and work Runtime;
- Digital Employee is the product and delivery layer.

## 4. Research Intelligence authority

Exactly three source-intelligence pipelines are recognized:

1. `Skill 01-P — AI Platform Change Intelligence`;
2. `Skill 01-G — GitHub Engineering Intelligence`;
3. `Skill 01-R — Published Research Intelligence`.

They all serve the three Daily Research columns:

1. `digital-employee`;
2. `industry-architecture`;
3. `open-source-engineering`.

Discovery executes the three pipelines and produces the same-day Signal Pool. Queue performs the three-column decisions. Source discovery and topic selection are separate stages.

## 5. Evidence hierarchy

Evidence authority is ordered as follows:

1. official announcement or release note;
2. official documentation;
3. official staff confirmation;
4. peer-reviewed or primary research evidence;
5. merged maintainer change, test, or security advisory;
6. reproducible community report;
7. unverified discussion.

Community discussion is a lead unless reproduced or confirmed. Popularity, stars, forum volume, and vendor claims are not independent validation.

## 6. Four independent Runtime systems

Research Runtime Center V5.0 is the formal operational control plane. Four Runtime systems are recognized and must not be mixed:

1. **Daily Runtime** — same-day discovery, research, production and publication;
2. **Weekly Runtime** — new weekly synthesis from validated Daily Research;
3. **Academic Runtime** — Paper, Benchmark, Specification and Institution only;
4. **Research Program Runtime** — long-term TMPA, FCoP, CodeFlowMu, Digital Employee and Research Operating System work.

Research Program work never consumes a Daily stage or Daily column slot.

## 7. Daily Runtime authority

Daily Runtime is frozen as six formal stages:

| Stage | Schedule | Legal input | Required output |
|---|---:|---|---|
| Discovery | Daily 09:00 | three Research Intelligence profiles | Signal Pool |
| Queue | Daily 10:00 | same-day Signal Pool | Today's Research Plan |
| Reading | Daily 11:00 | selected same-day objects | Reading Result |
| Analysis | Daily 13:00 | Reading Result | Research Object |
| Production | Daily 15:00 | Research Object | Publication Candidate |
| Publication | Daily 20:00 | complete Publication Candidate | Released Daily Research |

Each Daily column must receive `Selected` or `No Selection` every day. A publishing target must never force a weak signal into selection.

## 8. Independent Runtime schedules

| Runtime | Schedule | Boundary |
|---|---:|---|
| Weekly Runtime | Sunday 20:30 | Must not copy or concatenate Daily articles. |
| Academic Runtime | Wednesday 16:00 | Ordinary product and industry news is excluded. |
| Research Program Runtime | Monday 12:00 | Must not enter Daily Runtime or publish without Program Review. |

The authoritative schedules, identities, inputs, outputs and prohibitions are stored in:

```text
research/runtime/SCHEDULER.json
```

Timezone is `Asia/Shanghai`.

## 9. Production and Publication separation

Production executes:

```text
Research Writing
→ Research Visualization
→ Evidence & Citation
→ Publication Editing
→ Publication Candidate
```

Publication executes:

```text
Publication Candidate
→ public bilingual files
→ metadata / indexes / website
→ GitHub Commit
→ Commit Verify
→ Release
```

Publication is prohibited from performing new research, substantive rewriting or evidence repair.

## 10. Separate Runtime Records

Every Runtime family maintains its own record path:

```text
research/runtime/records/daily/YYYY/MM/YYYY-MM-DD-daily-runtime.json
research/runtime/records/weekly/YYYY/MM/YYYY-MM-DD-weekly-runtime.json
research/runtime/records/academic/YYYY/MM/YYYY-MM-DD-academic-runtime.json
research/runtime/records/program/YYYY/MM/YYYY-MM-DD-program-runtime.json
```

Different Runtime families must never be merged into one operational record or timeline.

Exactly six statuses are allowed:

```text
Running · Completed · Blocked · Failed · Skipped · Waiting
```

A scheduler trigger opens an execution slot; it does not prove completion.

## 11. Mandatory shift result

Every terminal shift must report:

```text
Input
Work Result
Output
Next
Metrics
Evidence
Artifacts
```

The machine contract is `runtime-shift-result/v2`. `Skipped` is valid only after the worker executes the gate and records an exact bilingual reason.

## 12. Publication gate

Every formal Daily publication follows:

```text
Research Intelligence
→ Signal Pool
→ Three-Column Queue
→ Reading Result
→ Research Object
→ Publication Candidate
→ Runtime Record + Shift Result
→ public bilingual files
→ GitHub Commit
→ Commit Verify
→ Release
```

A formal publication change without a V5 Runtime Record must fail validation.

## 13. Observation Notes information model

Observation Notes use two independent dimensions:

```yaml
column: digital-employee | industry-architecture | open-source-engineering
category: daily | weekly | academic
```

Academic is a publication category, not a fourth Daily column.

## 14. GitHub-first history policy

Git provides the authoritative history:

- commits record editorial and Runtime evolution;
- diffs record changes;
- pull requests and CI record validation;
- tags and release records mark versions;
- GitHub Pages publishes the current approved view.

Generated text is not a formal result until it passes the applicable Runtime and publication gates.

## 15. TMPA boundary

Research Report Production Engine V1.3 applies a single-writer lifecycle-governance subset of TMPA. It does not demonstrate the full multi-writer role separation of TMPA and must not be presented as complete validation of every TMPA claim.

## 16. V5 freeze rule

After V5.0, the following are frozen:

- the four Runtime families;
- the six Daily stages and their order;
- the nine Scheduler V3 formal task identities;
- the separation of Program work from Daily Runtime.

Future work may optimize source quality, worker performance, metrics, UX, evidence quality and publication quality, but must not recombine the four Runtime systems.

## Final principles

> Research Runtime is the only formal execution scheduler of the Research Operating System.

> Discovery finds signals; Queue decides topics.

> Reading precedes Analysis; Analysis precedes Production.

> Production creates complete reports; Publication releases them.

> Every formal output is observable, recorded, and verifiable through GitHub.
