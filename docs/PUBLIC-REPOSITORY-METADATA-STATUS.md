# Public Repository Metadata Standardization Status

Date: 2026-08-25
Scope: `joinwell52-AI/joinwell52`, `joinwell52-AI/FCoP`, `joinwell52-AI/CodeFlowMu-open`
Authority: [`REPOSITORY-DISCOVERY-AND-CITATION-STANDARD.md`](./REPOSITORY-DISCOVERY-AND-CITATION-STANDARD.md)

## Status summary

| Repository | Root CFF | README discovery/status | DOI / release identity | License identity | GitHub Description | GitHub Topics |
|---|---|---|---|---|---|---|
| `joinwell52-AI/joinwell52` | DONE | DONE — English + Chinese root READMEs aligned | DONE — TMPA V1.0 DOI `10.5281/zenodo.21888488`, Release `tmpa-v1.0` | Custom TMPA terms via `LICENSE.md`; no MIT claim | PENDING | PENDING |
| `joinwell52-AI/FCoP` | DONE | DONE — English + Chinese root READMEs aligned | DONE — concept DOI `10.5281/zenodo.19886035`; preferred archived snapshot DOI `10.5281/zenodo.19886036`; Release `v3.2.5` | DONE — MIT | PENDING | PENDING — currently empty |
| `joinwell52-AI/CodeFlowMu-open` | DONE | DONE — English + Chinese explicitly frozen/historical | DONE — historical edition `V1.2.29-open`; related TMPA DOI is clearly labelled as related research | DONE — MIT | PENDING | PENDING |

## Completed file-layer changes

### TMPA / joinwell52

- Root `CITATION.cff` is CFF 1.2-compatible.
- Preferred citation points to the TMPA V1.0 publication set DOI `10.5281/zenodo.21888488`.
- Machine-readable references connect TMPA to FCoP and the historical CodeFlowMu Open repository.
- English and Chinese root READMEs expose Star, TMPA V1.0 Release, DOI, Citation, Core S1.0, and implementation-evidence signals.
- English and Chinese root READMEs no longer describe CodeFlowMu Open as the current product distribution path.
- Historical CodeFlowMu Open installation commands are retained only as reproducibility/history instructions.
- Chinese synchronization passed `Validate Research Center 3.0` before PR #163 was merged.

### FCoP

- Root `CITATION.cff` retains the Zenodo concept DOI `10.5281/zenodo.19886035` as a series identifier.
- Preferred citation matches the human-facing README/site instruction and uses the fixed research-snapshot DOI `10.5281/zenodo.19886036` (`research-snapshot-2026-04-29`).
- TMPA V1.0 and historical CodeFlowMu Open are represented as related references.
- English and Chinese root READMEs expose Citation alongside the existing MIT, release, MCP Registry, and snapshot DOI signals.
- English and Chinese ecosystem tables identify CodeFlowMu Open as the frozen historical implementation, not the current product distribution path.
- README current-release metadata is aligned to FCoP `v3.2.5`.
- These README changes were reviewed and merged through protected-main PR #13.

### CodeFlowMu Open

- Root `CITATION.cff` has been added.
- Citation metadata explicitly identifies the repository as the frozen historical open-source edition.
- English and Chinese READMEs expose Stars, MIT, last open edition, Citation, and related TMPA research.
- TMPA DOI is not presented as a CodeFlowMu Open DOI.
- Both READMEs explicitly separate the frozen open repository from the current closed-source CodeFlowMu product line.

## README synchronization state

The six public root README variants are now synchronized at the metadata/lifecycle level:

- `joinwell52-AI/joinwell52`: `README.md`, `README.zh-CN.md`
- `joinwell52-AI/FCoP`: `README.md`, `README.zh.md`
- `joinwell52-AI/CodeFlowMu-open`: `README.md`, `README.zh.md`

File-layer README standardization is complete.

## Remaining GitHub settings work

The currently connected GitHub tool can read repository metadata and modify repository files, but does not expose a write action for repository `description` or `topics`. These settings therefore remain pending rather than being falsely marked complete.

### Target descriptions

**TMPA / joinwell52**

`TMPA — Textual Multi-Agent Process Architecture for durable AI-agent governance, responsibility, conformance, and auditable digital work. Research, specification, and evidence.`

**FCoP**

`FCoP — file-based behavior-governance protocol for multi-agent AI. Tasks, reports, review, evidence, and lifecycle state over ordinary files; Python + MCP.`

**CodeFlowMu-open**

`Historical open-source CodeFlowMu edition, frozen at V1.2.29-open. Local PM/DEV/OPS/QA AI development team using FCoP; preserved for research and reproducibility.`

### Target Topics

**TMPA / joinwell52**

`tmpa`, `textual-multi-agent-process-architecture`, `agent-governance`, `multi-agent-systems`, `ai-agents`, `digital-employees`, `ai-work-governance`, `conformance-testing`, `auditability`, `human-ai-collaboration`, `research-software`, `specification`, `fcop`, `codeflowmu`

**FCoP**

`fcop`, `file-based-coordination`, `filename-as-protocol`, `agent-governance`, `agent-coordination`, `multi-agent`, `ai-agents`, `model-context-protocol`, `mcp`, `mcp-server`, `filesystem`, `protocol`, `human-ai-collaboration`, `cursor`, `claude-code`, `python`, `developer-tools`, `auditability`

**CodeFlowMu-open**

`codeflowmu`, `historical-software`, `multi-agent`, `ai-agents`, `ai-team`, `human-ai-collaboration`, `agent-governance`, `fcop`, `tmpa`, `cursor`, `desktop-app`, `pwa`, `developer-tools`, `open-source`, `typescript`, `mcp`, `software-engineering`

## Remaining public metadata item

TMPA GitHub Release `tmpa-v1.0` still contains a historical release-body sentence saying DOI status was pending at the time that GitHub Release was created. The DOI was subsequently published as `10.5281/zenodo.21888488`. If/when a compatible Release edit action is available, update or append the release note so the current archival status is explicit without changing the historical release artifacts.

## Completion rule

The README/CFF/file-layer standardization is complete. The broader three-repository metadata standardization is not fully complete until:

- repository descriptions match the target identities;
- Topics are populated and repository-specific;
- the stale public TMPA Release DOI-status sentence is corrected or explicitly superseded.
