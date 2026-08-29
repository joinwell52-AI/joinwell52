# Skill 01 — Research Intelligence Discovery

## Purpose

Create a reliable, auditable evidence pool for **Digital Employee and Multi-Agent research** before any Research Object or article is selected.

The Research Center is not a platform-release newsroom. Its primary research purpose is to learn:

1. what failures, risks and governance problems others have encountered;
2. what mechanisms and design patterns have proved useful;
3. what new findings, benchmarks and industry practices change our understanding of digital employees;
4. what evidence should change, challenge or strengthen our own engineering decisions.

**Agent Governance is the highest-priority research direction.**

## Operating principle

Research problems are first-class. Products, frameworks, protocols, repositories, papers, benchmarks, incidents and releases are evidence sources or samples.

```text
Research Theme / Problem
→ Sample or external evidence
→ Failure / Finding / Mechanism / Implication
→ Queue admission
→ Deep Reading
→ Research Analysis
```

The following chain is forbidden:

```text
Platform Release / Commit / Changelog
→ automatic research candidate
→ article
```

A Release, commit, changelog, roadmap item or announcement is only a **change trigger or evidence lead** unless it reveals a reusable research problem or mechanism.

## Three intelligence profiles

Skill 01 keeps the existing three pipeline identifiers for Runtime compatibility, but their research roles are:

```text
01-P  Product / Competitor Sample Intelligence
01-G  Multi-Agent Engineering & Mechanism Intelligence
01-R  Published Research & Industry Application Intelligence
```

The authoritative transport/source inventory remains:

```text
research/intelligence/REGISTRY.json
```

The daily execution record remains:

```text
research/intelligence/runs/YYYY/MM/YYYY-MM-DD-intelligence.json
```

The Registry controls due-source accounting. This Skill controls **research admission**. A source being due or newly updated does not give it research priority.

## Research-theme overlay

Every meaningful signal must bind to at least one research theme. Preferred themes are:

### P0 — Agent Governance

- `agent-identity-authority`
- `call-time-authorization`
- `delegation-authority`
- `task-ownership-responsibility`
- `human-approval-authority`
- `evidence-completion-truth`
- `audit-provenance-accountability`
- `recovery-authority`
- `credential-secret-boundary`
- `memory-context-isolation`
- `policy-enforcement`

### P1 — Multi-Agent Architecture and Digital Employee Engineering

- `role-organizational-design`
- `coordination-topology`
- `handoff-and-inter-agent-trust`
- `a2a-mcp-interoperability`
- `durable-runtime-state`
- `failure-deadlock-duplicate-execution`
- `human-agent-workflow`
- `multi-agent-evaluation`
- `digital-employee-work-design`
- `agent-economy-negotiation`
- `industry-application-patterns`

A signal with no credible relationship to one of these themes normally remains background intelligence and must not become a Research Object.

## Approved sample overlay

In addition to Registry due-source accounting, Discovery maintains bounded awareness of these long-term sample families when public evidence is available.

### Digital Employee / product samples

- Paperclip
- StaffDeck
- iML Work
- Orkas
- Fusion
- TSA AI Workforce
- Eigent
- OneManCompany
- OpenHire
- CrewMeld
- OpenVort
- OACP / KiloLoop
- Gas Town + Beads
- Microsoft Sico
- Palmier
- SIDJUA

### Governance / control-plane samples

- Microsoft Agent Framework
- Microsoft Agent Governance Toolkit
- ServiceNow AI Control Tower
- IBM watsonx Orchestrate / Agentic Control Plane
- UiPath Maestro
- Salesforce Agentforce SOMA / Agent Gateway

### Multi-Agent framework / runtime / protocol samples

- A2A
- MCP
- CrewAI
- LangGraph
- CAMEL
- AG2 / AutoGen lineage
- OpenHands
- Letta
- MetaGPT
- ChatDev / DevAll
- Magentic-One

### Research and application samples

- scientific multi-agent systems;
- software-engineering agent teams;
- financial agent teams;
- supply-chain and negotiation agents;
- cybersecurity agent teams;
- healthcare agent teams;
- customer-service agent teams;
- robotics / embodied multi-agent systems;
- agent-market and agent-economy research;
- multi-agent failure and coordination benchmarks.

These samples are not all daily due sources. They are a **research sample map** used for comparison, bounded exploration and cross-source corroboration.

## Daily active sample coverage

After formal Registry due-source coverage, Discovery must perform an additional **theme-first active sample pass**. This pass is required even when none of the samples has a same-day Release or commit.

For each run, check at least:

- two approved `product-governance` samples;
- two approved `multi-agent-mechanism` samples;
- two approved `research-benchmark-industry` samples.

Rotate the checked samples against recent run history so the same fast-moving repositories do not monopolize attention.

The `published-research` profile must use a rolling window:

- first inspect the latest 7 days;
- expand through 30 days when the 7-day window does not yield enough qualified research evidence;
- use older prior art or negative results when directly relevant to an active research theme.

**Publication on the run date is never a qualification requirement.**

## Signal roles

Every retained signal must identify one of these roles:

```text
sample-change-trigger
failure-evidence
research-finding
mechanism-evidence
benchmark-evidence
industry-application-evidence
incident-or-regression-evidence
comparative-evidence
```

`sample-change-trigger` is never sufficient by itself for Queue selection.

From the policy effective date onward, pure `sample-change-trigger` signals may not exceed 50% of the retained Signal Pool. If there is not enough qualified non-trigger evidence, retain fewer signals rather than filling a quota with Releases or commits.

## Research-value extraction

For every potentially useful signal ask:

### Failure
What went wrong, what risk appeared, or what limitation was exposed?

### Finding
What generalizable observation, measured result or industry discovery was made?

### Mechanism
What concrete architecture, policy, state machine, protocol, workflow or control mechanism was used?

### Implication
What does this change for governed digital employees or multi-agent systems?

A useful non-trigger signal must contain at least one substantive research value beyond “a new version exists.”

## Source freshness

Different evidence types have different useful windows:

- release / commit / incident triggers: recent incremental scan;
- architecture, competitor mechanisms and product design: current state, not only same-day changes;
- papers, benchmarks and standards: rolling research window, normally 7–30 days or longer when still materially relevant;
- known failures and prior art: remain admissible when directly relevant to an active research question.

Do not discard an important paper or benchmark merely because it was not published on the run date.

## Three-column service rule

The pipelines remain source dimensions and still serve:

```text
Digital Employee
Industry Architecture
Open-source Engineering
```

Columns are publication/navigation surfaces, not the primary research ontology. Research themes are cross-column.

Every retained JSON signal still contains the existing compatibility fields and additionally records:

```yaml
signalRole:
researchThemes:
sampleIds:
researchValue:
  failure:
  finding:
  mechanism:
  implication:
```

## Evidence hierarchy

1. official specification, documentation, architecture or primary product evidence;
2. peer-reviewed paper, preprint, benchmark, dataset or primary technical report;
3. official incident, security notice or reproducible failure evidence;
4. merged maintainer implementation and reproducible repository evidence;
5. official announcement or staff confirmation;
6. reproducible community report;
7. unverified discussion as a lead only.

An announcement can establish that a vendor announced something. It does not establish that the mechanism works or that the claimed result generalizes.

## Discovery process

```text
Load Registry
→ Determine due sources
→ Scan the three intelligence pipelines
→ Execute theme-first active sample pass
→ Record checked, inaccessible and failed due sources
→ Record active sample/theme coverage
→ Normalize evidence signals
→ Merge duplicate evidence about the same mechanism/problem
→ Bind every retained signal to research themes
→ Classify signal role and research value
→ Apply trigger-density guard
→ Assign primary and secondary columns
→ Send the unified evidence pool to Skill 02
```

## Required output

The daily Intelligence run keeps the existing Runtime-compatible structure and, for runs on or after `2026-08-30`, must add:

```yaml
researchCoverage:
  policy: theme-sample-v1
  rollingResearchWindowDays: 30
  sampleFamilies:
    product-governance:
      checked: []
      qualifiedSignals: 0
    multi-agent-mechanism:
      checked: []
      qualifiedSignals: 0
    research-benchmark-industry:
      checked: []
      qualifiedSignals: 0
```

Every retained signal on or after that date must contain `signalRole`, non-empty `researchThemes`, non-empty `sampleIds`, and `researchValue`.

“No important update” is valid only after due-source coverage **and active sample coverage** are recorded. “Not checked” and “checked with no qualified signal” remain different facts.

## Hard rules

- Do not write the Research Note during Discovery.
- Do not perform topic selection during Discovery.
- Do not select a source because it released a new version, merged a commit, is popular or is trending.
- **A Release, commit, changelog, tag or announcement cannot directly become a Research Object.**
- Preserve useful release/commit evidence as `sample-change-trigger` or mechanism evidence for a real research question.
- Prefer failures, findings, mechanisms, benchmarks, comparative evidence and industry applications over product-update summaries.
- Agent Governance receives first-priority attention when evidence quality and research value are comparable.
- Preserve canonical URLs, dates, sample identity, evidence level and uncertainty.
- Deduplicate one mechanism appearing in a blog, Release, PR, issue, paper and benchmark.
