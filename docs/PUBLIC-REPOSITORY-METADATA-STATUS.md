# Public Repository Metadata Standardization Status

Date: 2026-08-25
Scope: `joinwell52-AI/joinwell52`, `joinwell52-AI/FCoP`, `joinwell52-AI/CodeFlowMu-open`
Authority: [`REPOSITORY-DISCOVERY-AND-CITATION-STANDARD.md`](./REPOSITORY-DISCOVERY-AND-CITATION-STANDARD.md)

## Status summary

| Repository | Root CFF | README discovery/status | DOI / release identity | License identity | GitHub Description | GitHub Topics |
|---|---|---|---|---|---|---|
| `joinwell52-AI/joinwell52` | DONE | DONE (English root README) | DONE — TMPA V1.0 DOI `10.5281/zenodo.21888488`, Release `tmpa-v1.0` | Custom TMPA terms via `LICENSE.md`; no MIT claim | PENDING | PENDING |
| `joinwell52-AI/FCoP` | DONE | PARTIAL — FCoP badges/citation are strong, but top ecosystem wording still describes CodeFlowMu Open as a current installable product | DONE — concept DOI `10.5281/zenodo.19886035`; preferred archived snapshot DOI `10.5281/zenodo.19886036`; Release `v3.2.5` | DONE — MIT | PENDING | PENDING — currently empty |
| `joinwell52-AI/CodeFlowMu-open` | DONE | DONE — explicitly frozen/historical | DONE — historical edition `V1.2.29-open`; related TMPA DOI is clearly labelled as related research | DONE — MIT | PENDING | PENDING |

## Completed file-layer changes

### TMPA / joinwell52

- Root `CITATION.cff` is CFF 1.2-compatible.
- Preferred citation points to the TMPA V1.0 publication set DOI `10.5281/zenodo.21888488`.
- Machine-readable references connect TMPA to FCoP and the historical CodeFlowMu Open repository.
- Root README now exposes Star, TMPA V1.0 Release, DOI, Citation, Core S1.0, and implementation-evidence badges.
- Root README no longer describes CodeFlowMu Open as the current product distribution path.
- Historical CodeFlowMu Open installation commands are retained only as reproducibility/history instructions.

### FCoP

- Root `CITATION.cff` retains the Zenodo concept DOI `10.5281/zenodo.19886035` as a series identifier.
- Preferred citation now matches the human-facing README/site instruction and uses the fixed research-snapshot DOI `10.5281/zenodo.19886036` (`research-snapshot-2026-04-29`).
- TMPA V1.0 and historical CodeFlowMu Open are represented as related references.
- Existing MIT, release, MCP Registry, and snapshot DOI signals remain intact.

### CodeFlowMu Open

- Root `CITATION.cff` has been added.
- Citation metadata explicitly identifies the repository as the frozen historical open-source edition.
- README discovery strip exposes Stars, MIT, last open edition, Citation, and related TMPA research.
- TMPA DOI is not presented as a CodeFlowMu Open DOI.
- README explicitly separates the frozen open repository from the current closed-source CodeFlowMu product line.

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

## Remaining content synchronization

1. FCoP root README ecosystem table still needs a safe local edit so `CodeFlowMu Open` is labelled historical/frozen rather than current installable product.
2. Bilingual/Chinese README variants should mirror the same CodeFlowMu lifecycle distinction where applicable.
3. TMPA GitHub Release `tmpa-v1.0` still contains an old release-body sentence saying DOI status was pending at release time. The DOI was subsequently published; if GitHub release-edit capability becomes available, append/update the release notes to point to `10.5281/zenodo.21888488` without changing the historical release artifacts.

## Completion rule

Do not call the three-repository metadata standardization fully complete until:

- repository descriptions match the target identities;
- Topics are populated and repository-specific;
- the remaining FCoP/Chinese README lifecycle wording is synchronized;
- any stale public release-note DOI status is corrected or explicitly superseded.
