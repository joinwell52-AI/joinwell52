# Research Runtime Center V5.0 — Frozen Runtime Charter

**Project:** joinwell52 Research Center  
**Scheduler:** Research Runtime Scheduler V3.0  
**Operations Center:** V5.0  
**Architecture status:** Frozen after V5.0  
**Effective date:** 2026-08-05  
**Timezone:** `Asia/Shanghai`  
**System of record:** `joinwell52-AI/joinwell52`

## 1. V5 boundary

Research Runtime Center V5.0 separates four execution systems:

1. **Daily Runtime** — same-day discovery, research, production and publication.
2. **Weekly Runtime** — new weekly synthesis from validated Daily Research.
3. **Academic Runtime** — papers, benchmarks, specifications and institutions only.
4. **Research Program Runtime** — long-term TMPA, FCoP, CodeFlowMu, Digital Employee and Research Operating System work.

A Research Program never consumes a Daily Runtime stage or Daily column slot.

## 2. Daily Runtime closed loop

```text
09:00 Discovery
  → Signal Pool
10:00 Queue
  → Today's Research Plan
11:00 Reading
  → Reading Result
13:00 Analysis
  → Research Object
15:00 Production
  → Publication Candidate
20:00 Publication
  → GitHub + Website + Commit Verify + Release
```

Daily Runtime must make an explicit `Selected` or `No Selection` decision for each column:

- Digital Employee;
- Industry Architecture;
- Open-source Engineering.

### Stage gates

- Reading consumes only selected same-day objects.
- Analysis consumes only Reading Results.
- Production consumes only Research Objects.
- Publication consumes only complete Publication Candidates.
- Publication is forbidden from performing new research, substantive rewriting or evidence repair.

## 3. Independent runtimes

### Weekly Runtime

Runs Sunday at 20:30. It consumes the previous seven days of evidence-validated Daily Research and produces new Trend, Architecture, Engineering and Prediction judgments. It must not copy or concatenate Daily articles.

### Academic Runtime

Runs Wednesday at 16:00. Its allowed primary objects are papers, benchmarks, specifications and institutions. Ordinary product news and general industry announcements are excluded.

### Research Program Runtime

Runs Monday at 12:00. It advances the independent queues and lifecycles of:

- TMPA;
- FCoP;
- CodeFlowMu;
- Digital Employee;
- Research Operating System.

Program work owns its own Queue, Research, Review and Publication. It does not enter Daily Runtime.

## 4. Scheduler V3.0

The machine-readable authority is [`SCHEDULER.json`](./SCHEDULER.json). It defines nine formal tasks:

| Family | Formal task | Time (`Asia/Shanghai`) |
|---|---|---:|
| Daily | Research Runtime Discovery | Daily 09:00 |
| Daily | Research Runtime Queue | Daily 10:00 |
| Daily | Research Runtime Reading | Daily 11:00 |
| Daily | Research Runtime Analysis | Daily 13:00 |
| Daily | Research Runtime Production | Daily 15:00 |
| Daily | Research Runtime Publication | Daily 20:00 |
| Weekly | Research Runtime Weekly | Sunday 20:30 |
| Academic | Research Runtime Academic | Wednesday 16:00 |
| Program | Research Program Runtime | Monday 12:00 |

GitHub Actions opens execution slots. ChatGPT workers perform the actual research work. A scheduled slot is not evidence of completion.

## 5. Separate Runtime Records

V5 maintains separate records:

```text
research/runtime/records/daily/YYYY/MM/YYYY-MM-DD-daily-runtime.json
research/runtime/records/weekly/YYYY/MM/YYYY-MM-DD-weekly-runtime.json
research/runtime/records/academic/YYYY/MM/YYYY-MM-DD-academic-runtime.json
research/runtime/records/program/YYYY/MM/YYYY-MM-DD-program-runtime.json
```

Historical V4 records remain frozen in their original paths and are not rewritten as V5 records.

## 6. Mandatory shift result

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

The bilingual machine contract is `runtime-shift-result/v2`. A shift that executes successfully is `Completed`, even when its governed output count is zero. `Skipped` is reserved for a shift that is explicitly not applicable and therefore not executed.

See:

- [`RUNTIME-RECORD-SCHEMA-V5.md`](./RUNTIME-RECORD-SCHEMA-V5.md)
- [`WORKER-CONTRACT-V3.md`](./WORKER-CONTRACT-V3.md)

## 7. Website and authority

Runtime Dashboard displays Daily only. Weekly, Academic and Program have independent entry surfaces. No view may merge the four Runtime families into one operational timeline.

GitHub is the single source of truth. A formal publication is complete only after:

```text
Runtime Result
→ Durable artifacts
→ GitHub Commit
→ Commit Verify
→ Website projection
→ Release
```

## 8. Freeze rule

After V5.0, the four-family boundary, Daily six-stage sequence and Scheduler V3.0 task identities are frozen. Later versions may optimize source quality, worker performance, metrics, page experience and publication quality, but must not recombine Program work with Daily Runtime.
