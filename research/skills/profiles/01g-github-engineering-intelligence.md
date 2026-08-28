# Skill 01-G — Multi-Agent Engineering & Mechanism Intelligence

**中文名称：多 Agent 工程与机制情报发现**

> Runtime compatibility note: the pipeline identifier remains `github-engineering`.

## Purpose

Maintain a precise engineering radar over repositories and technical artifacts to discover **reusable mechanisms, failures, benchmarks and implementation evidence** for governed digital employees and multi-agent systems.

This is not a Release feed.

## Scan architecture

Keep the Registry-controlled incremental scan and bounded exploration model, but rank evidence by research value rather than release recency.

```text
fixed sample / repository watchlist
+ research-theme queries
+ bounded new-project exploration
```

## Priority sample families

### Governance and runtime

- Microsoft Agent Framework;
- Microsoft Agent Governance Toolkit;
- A2A;
- MCP;
- LangGraph;
- CrewAI;
- CAMEL;
- OpenHands;
- Letta;
- AG2 / AutoGen lineage;
- Magentic-One.

### Role and organizational systems

- MetaGPT;
- ChatDev / DevAll;
- digital-employee and workforce products with public technical artifacts.

### Failure, evaluation and audit

- multi-agent failure taxonomies and trace datasets;
- coordination and topology benchmarks;
- failure attribution;
- auditability, replay and rollback;
- runtime policy enforcement;
- anomaly detection where it directly applies to agent behavior.

The authoritative organizations and repositories remain in `research/intelligence/REGISTRY.json`. The sample families above guide bounded exploration and comparison when the Registry does not yet contain a specific object.

## What to inspect

Incrementally inspect:

1. architecture and design documents;
2. RFCs and protocol specifications;
3. merged Pull Requests that materially change a mechanism;
4. reproducible Issues and regressions;
5. benchmark, evaluation and dataset changes;
6. security advisories;
7. state-machine, recovery, policy, identity and audit implementations;
8. Releases and Tags only as pointers to potentially important mechanism changes.

Do not treat a Release or merged PR as important merely because it exists.

## Research-theme query matrix

Prioritize queries around:

### P0 governance

- agent identity / authority;
- call-time authorization;
- capability scope;
- delegation authority;
- task ownership;
- approval and escalation;
- audit / provenance / receipts;
- completion verification;
- recovery authority;
- credential and memory isolation;
- runtime policy enforcement.

### P1 multi-agent engineering

- supervisor / manager / worker organization;
- handoff and peer collaboration;
- A2A / MCP / interoperability;
- long-running workflow;
- checkpoint / resume / replay / fork;
- deadlock / duplicate execution / resource contention;
- human-agent workflow;
- multi-agent benchmark and failure attribution.

## Signal-value test

Before creating a substantive candidate signal, ask:

```text
Does this artifact reveal a Failure, Finding, Mechanism, Benchmark result,
or Comparative difference relevant to a named research theme?
```

If no, the event may be recorded for coverage but should not become a research candidate.

## Release boundary

A Release, Tag or routine merged PR is normally:

```yaml
signal_role: sample-change-trigger
```

It becomes mechanism evidence only after reading the underlying implementation, design, issue, test, benchmark or specification and identifying a transferable research point.

Forbidden candidate rationale:

> “Repository X released version Y.”

Acceptable research rationale:

> “Repository X changed delegated-worker authority from inherited to explicitly scoped; compare this with other delegation models.”

## Cross-sample comparison

Whenever possible, merge related evidence under a research problem rather than a vendor event.

Example:

```yaml
research_problem: recovery-authority
sample_evidence:
  - LangGraph checkpoint/resume
  - Microsoft Agent Framework rehydrate
  - OpenHands recovery behavior
  - failure benchmark or incident evidence
```

A comparison may remain a signal until Queue determines whether the evidence is sufficient.

## Evidence levels

```text
specification_or_architecture
merged_maintainer_change
reproducible_issue
security_advisory
benchmark_or_dataset
maintainer_statement
community_report
exploratory_repository
```

Map these to the Registry-supported evidence level when persisting the Runtime signal.

Stars and trending position are discovery hints only.

## Required scan record

Keep the existing Runtime-compatible coverage fields. Signal objects should additionally preserve when available:

```yaml
signal_role:
research_themes:
sample_ids:
research_value:
  failure:
  finding:
  mechanism:
  implication:
```

## Hard rules

- Do not re-scan full history every day.
- Do not promote ordinary releases, tags or commits directly to Research Objects.
- Prefer reproducible mechanism and failure evidence over vendor cadence.
- Prefer cross-sample evidence when studying a general governance or multi-agent question.
- Agent Governance receives first-priority attention when evidence quality is comparable.
- New projects are admitted for research only after maintenance, technical relevance and evidence checks pass.
