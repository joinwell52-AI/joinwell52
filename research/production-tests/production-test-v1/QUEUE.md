# Research OS Engine Production Test V1 — Research Queue

- **Test ID:** ROSE-PT-V1
- **Run date:** 2026-08-02 (Asia/Shanghai)
- **Repository:** `joinwell52-AI/joinwell52`
- **Execution mode:** interactive production run
- **Publication target:** `main`, through a reviewed production branch and squash merge
- **Purpose:** verify that Research Skills can select, study, write, visualize, publish, and verify six bilingual Research Notes.

## Queue policy

The queue records triage judgments, not external measurements. `High`, `Medium`, and `Low` express Research Center relevance after source review. A candidate advances only when an authoritative primary source is available and the research question is sufficiently bounded.

## Selected queue

| ID | Category | Column | Research object | Primary sources | DE | TMPA | CodeFlowMu | Engineering | Innovation | Official source | Research value | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PT-D-01 | Daily | Digital Employee | Computer-use action/state loop | OpenAI and Anthropic computer-use documentation | High | High | High | High | High | Yes | High | Selected |
| PT-D-02 | Daily | Industry Architecture | A2A v1.0 and MCP interoperability boundaries | Linux Foundation A2A specification; MCP specification 2026-07-28 | Medium | High | High | High | High | Yes | High | Selected |
| PT-D-03 | Daily | Open-source Engineering | Manager orchestration versus handoffs | OpenAI Agents SDK documentation | Medium | High | High | High | Medium | Yes | High | Selected |
| PT-A-01 | Academic | Digital Employee | OSWorld execution-based evaluation | OSWorld paper and project | High | High | High | High | High | Yes | High | Selected |
| PT-A-02 | Academic | Industry Architecture | NIST AI RMF operating loop | NIST AI RMF 1.0, Playbook, and GenAI Profile | High | High | High | Medium | Medium | Yes | High | Selected |
| PT-A-03 | Academic | Open-source Engineering | SWE-bench Verified and benchmark quality | SWE-bench paper/repository and OpenAI Verified report | Medium | High | High | High | High | Yes | High | Selected |

## Lifecycle plan

```text
Signal
→ Candidate
→ Queue
→ Selected
→ Reading
→ Analysis
→ Research Note
→ Evidence & Citation
→ Publication Editing
→ GitHub branch
→ Pull Request
→ main
→ Commit Verification
```

## Required deliverables

For every queue item:

1. English Research Note.
2. Simplified Chinese Research Note.
3. Dedicated SVG cover.
4. At least one meaningful diagram, process model, or evidence table inside the note.
5. Direct primary-source references.
6. Metadata compatible with `RESEARCH-NOTES-STANDARD.md` and `RESEARCH-NOTES-METADATA.md`.
7. Publication and commit verification recorded in `RUNTIME-RECORD.md` and `REPORT.md`.

## Initial gate decision

All six candidates passed Source Discovery and Research Triage. They entered `Selected` because each has a bounded research question, authoritative primary sources, direct relevance to Research Center architecture, and a concrete engineering implication. No candidate was advanced merely because it was recent.