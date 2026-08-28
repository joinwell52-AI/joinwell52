# Skill 01-R — Published Research & Industry Application Intelligence

**中文名称：论文、Benchmark 与行业应用情报发现**

> Runtime compatibility note: the pipeline identifier remains `published-research`.

## Purpose

Discover research findings, benchmarks, standards, datasets and industry application evidence that can improve the design of governed digital employees and multi-agent systems.

The purpose is not to publish a paper digest. The purpose is to learn what others discovered, what failed, what mechanisms work, and what evidence should influence digital-employee engineering.

## Priority order

### P0 — Agent Governance

Prioritize research on:

- identity and authority;
- delegation and responsibility;
- human approval and oversight;
- policy enforcement;
- evidence, audit and completion verification;
- recovery and rollback;
- memory/context/credential isolation;
- accountability and failure attribution.

### P1 — Multi-Agent Architecture

- supervisor, manager, peer and decentralized organization;
- coordination topology;
- handoff and communication;
- A2A / MCP / interoperability;
- long-running runtime and durable state;
- deadlock, resource contention and duplicate execution;
- multi-agent evaluation and verification.

### P1 — Industry applications

Actively look for multi-agent work in:

- software engineering;
- scientific research;
- finance and investment research;
- supply chain, procurement and negotiation;
- cybersecurity and SOC operations;
- healthcare and clinical collaboration;
- customer service and enterprise operations;
- robotics, autonomous systems and embodied agents;
- agent markets, agent economy and cross-organization interaction.

The value of an industry application is not “this sector uses agents.” Extract the role structure, authority boundary, coordination mechanism, failure mode, evidence model and human responsibility.

## Source registry

The authoritative source inventory remains:

```text
research/intelligence/REGISTRY.json
```

Curated indexes are navigation only. Every useful entry must be followed to the original paper, benchmark, standard, official repository, dataset or primary technical artifact before it is used as evidence.

## Rolling research window

Do not require research evidence to be published on the run date.

Use a rolling window appropriate to the source:

- preprints, conference papers, benchmarks and standards: normally 7–30 days;
- important prior work: older evidence remains admissible when directly needed by an active research question;
- newly released code or dataset companions: use current artifact state and preserve the paper/version binding.

A day with no same-day paper may still contain important research evidence.

## Complete evidence package

For a paper or benchmark seek:

```text
Paper
+ Appendix / Supplement
+ Project Page
+ Official Repository
+ Dataset / Benchmark
+ Evaluation Method
+ Known Limitations
```

Missing companions must be recorded rather than invented.

## What to extract

For every candidate capture:

### Research problem
- what problem is actually being studied;
- why it matters for multi-agent or digital-employee systems.

### Finding
- measured or experimentally supported result;
- whether the result generalizes or is narrow to the tested setting.

### Failure
- observed failure mode;
- negative result;
- coordination breakdown;
- safety, reliability or evaluation weakness.

### Mechanism
- architecture;
- topology;
- protocol;
- governance model;
- state/recovery design;
- human-in-the-loop design;
- evaluation or verification mechanism.

### Evidence quality
- method;
- dataset;
- baseline;
- benchmark;
- statistical or empirical support;
- reproducibility;
- limitations and contradictions.

### Digital-employee implication
Record the plausible implication as a bounded research lead, not as a forced project conclusion.

## Research-theme binding

Every substantive research signal should bind to one or more themes from Skill 01, such as:

```text
agent-identity-authority
call-time-authorization
delegation-authority
task-ownership-responsibility
human-approval-authority
evidence-completion-truth
recovery-authority
memory-context-isolation
coordination-topology
failure-deadlock-duplicate-execution
multi-agent-evaluation
industry-application-patterns
agent-economy-negotiation
```

## Research signal roles

Prefer:

```text
research-finding
failure-evidence
benchmark-evidence
mechanism-evidence
industry-application-evidence
comparative-evidence
```

A paper announcement without reading the primary artifact is only a lead.

## Output

Keep the existing Runtime-compatible research signal and enrich it when possible:

```yaml
research_signal:
  title:
  authors:
  institution:
  venue:
  publication_type:
  published_at:
  identifiers:
    doi:
    arxiv:
  sources:
    paper:
    appendix:
    project_page:
    repository:
    dataset:
    benchmark:
  signal_role:
  research_themes:
  sample_ids:
  research_question:
  claimed_contribution:
  method:
  evaluation:
  findings:
  failures:
  mechanisms:
  limitations:
  reproducibility_status:
  digital_employee_implication:
  primary_column:
  secondary_columns:
  triage_status:
  next_skill:
```

## Hard rules

- An abstract or vendor/research-lab summary alone cannot establish an engineering conclusion.
- Do not discard strong research because it is not same-day.
- Do not prefer a platform paper merely because the platform is already on the daily watchlist.
- Prefer evidence that explains a failure, finding, mechanism or industry pattern.
- Agent Governance receives first priority when relevance and evidence quality are comparable.
- Research may challenge current assumptions; do not search only for evidence that supports existing designs.
