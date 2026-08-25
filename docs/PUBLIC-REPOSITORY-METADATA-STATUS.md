# Public Repository Metadata Standardization Status

Date: 2026-08-25
Scope: `joinwell52-AI/joinwell52`, `joinwell52-AI/FCoP`, `joinwell52-AI/CodeFlowMu-open`
Authority: [`REPOSITORY-DISCOVERY-AND-CITATION-STANDARD.md`](./REPOSITORY-DISCOVERY-AND-CITATION-STANDARD.md)

## Final status

**Repository Page Metadata: 3/3 PASS**

The three public repositories have completed file-layer, citation-layer, release-layer, and GitHub repository-page metadata standardization.

| Repository | Root CFF | English README | Chinese README | DOI / release identity | License identity | GitHub Description | GitHub Topics | Final |
|---|---|---|---|---|---|---|---|---|
| `joinwell52-AI/joinwell52` | DONE | DONE | DONE | DONE — TMPA V1.0 DOI `10.5281/zenodo.21888488`, Release `tmpa-v1.0` | Custom TMPA terms via `LICENSE.md`; no MIT claim | DONE | DONE | PASS |
| `joinwell52-AI/FCoP` | DONE | DONE | DONE | DONE — concept DOI `10.5281/zenodo.19886035`; preferred archived snapshot DOI `10.5281/zenodo.19886036`; Release `v3.2.5` | MIT | DONE | DONE | PASS |
| `joinwell52-AI/CodeFlowMu-open` | DONE | DONE | DONE | DONE — historical edition `V1.2.29-open`; TMPA DOI labelled only as related research | MIT | DONE | DONE | PASS |

## Verified GitHub repository-page metadata

### TMPA / joinwell52

Description:

`TMPA — Textual Multi-Agent Process Architecture for durable AI-agent governance, responsibility, conformance, and auditable digital work. Research, specification, and evidence.`

Topics:

`tmpa`, `textual-multi-agent-process-architecture`, `agent-governance`, `multi-agent-systems`, `ai-agents`, `digital-employees`, `ai-work-governance`, `conformance-testing`, `auditability`, `human-ai-collaboration`, `research-software`, `specification`, `fcop`, `codeflowmu`

Homepage: `https://joinwell52-ai.github.io/joinwell52/`

Repository state: public, `archived=false`, default branch `main`.

### FCoP

Description:

`FCoP — file-based behavior-governance protocol for multi-agent AI. Tasks, reports, review, evidence, and lifecycle state over ordinary files; Python + MCP.`

Topics:

`fcop`, `file-based-coordination`, `filename-as-protocol`, `agent-governance`, `agent-coordination`, `multi-agent`, `ai-agents`, `model-context-protocol`, `mcp`, `mcp-server`, `filesystem`, `protocol`, `human-ai-collaboration`, `cursor`, `claude-code`, `python`, `developer-tools`, `auditability`

Homepage: `https://joinwell52-ai.github.io/FCoP/`

Repository state: public, `archived=false`, default branch `main`.

### CodeFlowMu Open

Description:

`Historical open-source CodeFlowMu edition, frozen at V1.2.29-open. Local PM/DEV/OPS/QA AI development team using FCoP; preserved for research and reproducibility.`

Topics:

`codeflowmu`, `historical-software`, `multi-agent`, `ai-agents`, `ai-team`, `human-ai-collaboration`, `agent-governance`, `fcop`, `tmpa`, `cursor`, `desktop-app`, `pwa`, `developer-tools`, `open-source`, `typescript`, `mcp`, `software-engineering`

Homepage: `https://joinwell52-ai.github.io/CodeFlowMu-open/`

Repository state: public, `archived=false`, default branch `main`.

## Completed file and publication metadata

### TMPA / joinwell52

- Root `CITATION.cff` uses CFF 1.2-compatible structure.
- Preferred citation points to TMPA V1.0 DOI `10.5281/zenodo.21888488`.
- Machine-readable references connect TMPA to FCoP and historical CodeFlowMu Open.
- English and Chinese root READMEs expose Star, TMPA V1.0 Release, DOI, Citation, Core S1.0, and implementation-evidence signals.
- Both READMEs identify CodeFlowMu Open as the historical frozen implementation rather than the current product distribution path.
- Historical CodeFlowMu Open installation commands remain only for reproducibility/history.
- Chinese README synchronization passed `Validate Research Center 3.0` before PR #163 was merged.
- GitHub Release `tmpa-v1.0` preserves its original 2026-08-11 pending-deposit context while explicitly recording the subsequently published DOI `10.5281/zenodo.21888488`; release artifacts and checksums were not changed.

### FCoP

- Root `CITATION.cff` retains concept DOI `10.5281/zenodo.19886035` as the series identifier.
- Preferred citation uses fixed research-snapshot DOI `10.5281/zenodo.19886036`.
- TMPA V1.0 and historical CodeFlowMu Open are represented as related references.
- English and Chinese root READMEs expose Citation alongside MIT, release, MCP Registry, and snapshot DOI signals.
- Both ecosystem tables identify CodeFlowMu Open as a frozen historical implementation.
- README current-release metadata is aligned to `v3.2.5`.
- README changes were reviewed and merged through protected-main PR #13.

### CodeFlowMu Open

- Root `CITATION.cff` identifies the repository as the frozen historical open-source edition.
- English and Chinese READMEs expose Stars, MIT, last open edition, Citation, and related TMPA research.
- TMPA DOI is never presented as a CodeFlowMu Open DOI.
- Both READMEs separate the frozen open repository from the current closed-source CodeFlowMu product line.

## Completion

The standardization defined by `REPOSITORY-DISCOVERY-AND-CITATION-STANDARD.md` is **FULLY COMPLETE** for all three public repositories as of 2026-08-25.

No remaining Description, Topics, README, CFF, DOI, Release-status, License-identity, or cross-repository identity task is open under this standardization scope.

Unrelated runtime automation activity in `joinwell52` is outside this metadata-standardization scope and must not be treated as part of this change set.