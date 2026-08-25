# Public Repository Discovery and Citation Standard

Status: Active
Scope: Public repositories maintained under `joinwell52-AI`
Initial covered set: `joinwell52`, `FCoP`, `CodeFlowMu-open`

## 1. Purpose

Public repositories must be immediately understandable to both humans and machine indexers. Each repository must expose a clear identity, lifecycle status, stable citation path, related research links, and GitHub discovery metadata without making claims that belong to another repository.

This standard separates three concerns:

1. **Repository identity** — what this repository actually is.
2. **Citation identity** — what users should cite when they use this repository or its research.
3. **Discovery metadata** — badges, description, Topics, and cross-repository links that help the right audience find it.

## 2. Required root files

Every public repository must have:

- `README.md`
- `CITATION.cff`
- an explicit license file when the repository is open-source software
- a release/version source appropriate to the project

Research repositories that intentionally use mixed or non-standard licensing must not display an MIT/Apache badge unless the relevant repository content is actually licensed that way.

## 3. README discovery strip

The top of each public README should expose only truthful, repository-specific signals.

Preferred order:

1. repository lifecycle/status when material (`Active`, `Historical`, `Frozen`, etc.)
2. GitHub Stars
3. License, when applicable
4. current release or last historical release
5. repository DOI, when one exists
6. `CITATION.cff`
7. related research DOI only when clearly labelled as related research

A DOI belonging to another repository or publication must never be presented as this repository's own DOI.

## 4. Citation rules

`CITATION.cff` must live at the repository root so GitHub can expose **Cite this repository**.

CFF 1.2 schema note: the root `type` is limited to `software` or `dataset`. A research/specification repository that also contains executable research software may use `type: software` at the root and redirect the preferred human citation to a paper, report, or publication set with `preferred-citation`. Reference-level entries may use `generic` and other CFF reference types.

Use these rules:

- Software repository with its own DOI: cite the software DOI and repository.
- Research/specification repository: identify the repository itself and use `preferred-citation` for the canonical publication when appropriate.
- Historical software without its own DOI: cite the historical software repository itself; place related papers or research DOI under `references` or clearly labelled README links.
- When a protocol or product is derived from a research architecture, link the research work as a related reference rather than silently replacing the software citation.
- When Zenodo provides both a **concept DOI** and a **version/snapshot DOI**, keep the concept DOI as a series identifier when useful, but make `preferred-citation` match the exact DOI that the README/site tells humans to cite. A fixed archival snapshot should therefore use its version/snapshot DOI as the preferred citation.

## 5. Three-repository identity map

| Repository | Canonical identity | Citation identity | Lifecycle |
|---|---|---|---|
| `joinwell52-AI/joinwell52` | TMPA research, specification, conformance, evidence, and public research site | Repository + TMPA V1.0 publication set, DOI `10.5281/zenodo.21888488` | Active |
| `joinwell52-AI/FCoP` | File-based behavior-governance protocol and reference software | Concept DOI `10.5281/zenodo.19886035`; preferred archived snapshot DOI `10.5281/zenodo.19886036` | Active |
| `joinwell52-AI/CodeFlowMu-open` | Historical open-source CodeFlowMu implementation | Historical software repository; TMPA DOI is related research only | Frozen / historical |

## 6. Recommended GitHub descriptions

### TMPA / joinwell52

`TMPA — Textual Multi-Agent Process Architecture for durable AI-agent governance, responsibility, conformance, and auditable digital work. Research, specification, and evidence.`

### FCoP

`FCoP — file-based behavior-governance protocol for multi-agent AI. Tasks, reports, review, evidence, and lifecycle state over ordinary files; Python + MCP.`

### CodeFlowMu-open

`Historical open-source CodeFlowMu edition, frozen at V1.2.29-open. Local PM/DEV/OPS/QA AI development team using FCoP; preserved for research and reproducibility.`

## 7. Recommended GitHub Topics

Topics should be specific enough to describe the repository and broad enough to match real user searches. Do not copy the same list mechanically to every repository.

### TMPA / joinwell52

`tmpa`, `textual-multi-agent-process-architecture`, `agent-governance`, `multi-agent-systems`, `ai-agents`, `digital-employees`, `ai-work-governance`, `conformance-testing`, `auditability`, `human-ai-collaboration`, `research-software`, `specification`, `fcop`, `codeflowmu`

### FCoP

`fcop`, `file-based-coordination`, `filename-as-protocol`, `agent-governance`, `agent-coordination`, `multi-agent`, `ai-agents`, `model-context-protocol`, `mcp`, `mcp-server`, `filesystem`, `protocol`, `human-ai-collaboration`, `cursor`, `claude-code`, `python`, `developer-tools`, `auditability`

### CodeFlowMu-open

`codeflowmu`, `historical-software`, `multi-agent`, `ai-agents`, `ai-team`, `human-ai-collaboration`, `agent-governance`, `fcop`, `tmpa`, `cursor`, `desktop-app`, `pwa`, `developer-tools`, `open-source`, `typescript`, `mcp`, `software-engineering`

## 8. Cross-repository linking

The three repositories form one public system but must remain independently understandable:

- TMPA explains and specifies governance semantics.
- FCoP provides a reusable file-based behavior-governance protocol.
- CodeFlowMu-open preserves a historical open implementation that informed later product and research work.

Each README should link to the other two where context is useful, but should not blur version, conformance, licensing, DOI, or product-status boundaries.

## 9. Historical repository rule

A frozen repository may receive metadata, citation, security, or archival-maintenance updates without being treated as resumed feature development. Such updates must not change the historical product claim or imply that the repository is the current customer distribution channel.

## 10. Verification checklist

Before considering a repository standardized, verify:

- [ ] Repository visibility and lifecycle status are correct.
- [ ] Root `CITATION.cff` exists and parses as YAML/CFF.
- [ ] GitHub shows **Cite this repository** on the default branch.
- [ ] README DOI links belong to the object they claim to identify.
- [ ] Concept DOI and fixed version/snapshot DOI are not confused; `preferred-citation` matches the human-facing citation instruction.
- [ ] License badge matches the actual repository license.
- [ ] Release/version badge matches the current or explicitly historical release.
- [ ] Repository description matches the README's current identity.
- [ ] Topics are populated and repository-specific.
- [ ] Cross-repository links are present and semantically accurate.
- [ ] Frozen repositories are not described as the current product line.

## 11. Change policy

When a paper, DOI, product lifecycle, release line, or project identity changes, update the following as one metadata change set:

1. repository description
2. Topics when discovery vocabulary changed
3. README discovery/citation section
4. `CITATION.cff`
5. relevant release/archive links

Do not update only a badge while leaving contradictory repository metadata elsewhere.
