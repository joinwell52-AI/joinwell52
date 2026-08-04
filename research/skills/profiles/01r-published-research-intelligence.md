# Skill 01-R — Published Research Intelligence

**中文名称：论文与研究成果情报发现**

## Purpose

Discover new papers and primary research artifacts that can support Digital Employee, Industry Architecture and Open-source Engineering research.

The scope is broader than formally published journal papers. It includes:

- peer-reviewed conference and journal papers;
- arXiv and other preprints;
- research-lab technical reports;
- benchmark and dataset papers;
- system cards and model cards;
- specifications and standards;
- paper-associated repositories, datasets and evaluation tools.

## Source registry

The authoritative research sources and topics are stored in:

```text
research/intelligence/REGISTRY.json
```

P0 daily sources include major preprint/review systems and official research laboratories. Conference proceedings and digital libraries are scanned on their configured schedule.

## Topic families

- Digital Employee and enterprise agent;
- long-running Agent and task scheduling;
- Computer Use and browser operation;
- coding Agent and software engineering;
- multi-Agent coordination;
- Agent governance, authority and human collaboration;
- memory, tools and workflow;
- recovery, resume and completion verification;
- evaluation, benchmark and observability;
- runtime, sandbox, MCP and A2A.

## Complete research object

A paper signal should seek the complete evidence package:

```text
Paper
+ Appendix or Supplement
+ Project Page
+ Official Repository
+ Dataset / Benchmark
+ Evaluation Method
```

Missing companions must be recorded rather than invented.

## Evidence extraction

For every candidate capture:

- research question;
- claimed contribution;
- method;
- evaluation design;
- datasets and benchmarks;
- reported limitations;
- reproducibility status;
- associated code or artifacts;
- institution and venue;
- relation to existing Research Center objects.

## Three-column routing

- Digital Employee: position work, long tasks, memory, approval, recovery and evaluation.
- Industry Architecture: enterprise Agent architecture, control planes, platform governance, identity and organizational work.
- Open-source Engineering: runtime, protocol, SDK, sandbox, evaluation, benchmark and software-engineering Agent mechanisms.

A paper may affect all three, but it has one primary column.

## Output

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
  research_question:
  claimed_contribution:
  method:
  evaluation:
  limitations:
  reproducibility_status:
  primary_column:
  secondary_columns:
  triage_status:
  next_skill:
```

## Boundary

An abstract or vendor summary alone cannot establish an engineering conclusion. Deep Reading must use the primary paper and available methods or artifacts.
