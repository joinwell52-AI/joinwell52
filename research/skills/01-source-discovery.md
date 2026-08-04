# Skill 01 — Research Intelligence Discovery

## Purpose

Create a reliable, auditable signal pool before any Research Note is written.

Skill 01 is not a single web search. It dispatches three specialized intelligence profiles:

```text
01-P  AI Platform Change Intelligence
01-G  GitHub Engineering Intelligence
01-R  Published Research Intelligence
```

The authoritative source list is:

```text
research/intelligence/REGISTRY.json
```

The daily execution record is:

```text
research/intelligence/runs/YYYY/MM/YYYY-MM-DD-intelligence.json
```

## Three pipelines

### 01-P — AI Platform Change Intelligence

Monitor major AI platforms through official release notes, documentation, forums or communities, status pages, roadmaps and official repositories.

P0 daily platforms include:

- OpenAI / ChatGPT / Codex
- Anthropic / Claude / Claude Code
- Google / Gemini
- Cursor
- GitHub Copilot
- Microsoft Copilot Platform

### 01-G — GitHub Engineering Intelligence

Use a controlled engineering radar rather than searching all of GitHub:

- fixed organization and repository watchlists;
- incremental Release, Tag, merged PR, high-value Issue, Discussion and Security Advisory scans;
- versioned topic × change-type queries;
- bounded new-project exploration.

### 01-R — Published Research Intelligence

Scan papers, preprints, technical reports, benchmarks, datasets, system cards, model cards, specifications and their associated repositories or evaluation artifacts.

## Three-column service rule

The pipelines are source dimensions. They all serve the same three research columns:

```text
Digital Employee
Industry Architecture
Open-source Engineering
```

Every signal must contain:

```yaml
primary_column:
secondary_columns:
```

A signal has exactly one primary column. Secondary impact is allowed, but the same change must not be published three times.

## Evidence hierarchy

1. official announcement or release;
2. official documentation;
3. official staff confirmation;
4. peer-reviewed paper, preprint or primary technical report;
5. merged maintainer change and reproducible repository evidence;
6. reproducible community report;
7. unverified discussion as a lead only.

A community post cannot establish an official product fact without corroboration.

## Discovery process

```text
Load Registry
→ Determine due sources
→ Scan the three intelligence pipelines
→ Record checked, inaccessible and failed sources
→ Normalize signals
→ Merge duplicates into one change/research object
→ Assign primary and secondary columns
→ Send the unified pool to Skill 02
```

## Required output

The daily intelligence run must report:

```yaml
pipelines:
  ai-platform:
    due:
    checked:
    inaccessible:
    signals:
    candidates:
  github-engineering:
    due:
    checked:
    inaccessible:
    signals:
    candidates:
  published-research:
    due:
    checked:
    inaccessible:
    signals:
    candidates:

columns:
  digital-employee:
  industry-architecture:
  open-source-engineering:
```

“No important update” is valid only after coverage is recorded. “Not checked” and “checked with no qualified signal” are different facts.

## Rules

- Do not write the Research Note during discovery.
- Do not select a source only because it is new or popular.
- Do not treat Stars, likes or forum volume as evidence of technical quality.
- Preserve canonical URLs, publication dates and evidence level.
- Record authentication-required or inaccessible sources honestly.
- Deduplicate one change appearing in a blog, forum, Release, PR and paper.
