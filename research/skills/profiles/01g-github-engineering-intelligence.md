# Skill 01-G — GitHub Engineering Intelligence

**中文名称：GitHub 工程情报发现**

## Purpose

Maintain a precise, incremental engineering radar over GitHub without pretending to scan the entire platform.

## Scan architecture

```text
70% fixed organization and repository watchlist
20% versioned topic × change-type queries
10% bounded new-project exploration
```

The authoritative organizations, repositories and query policy are stored in `research/intelligence/REGISTRY.json`.

## Repository tiers

- **P0 / daily:** official platform SDKs, coding agents, protocols and directly relevant runtimes.
- **P1 / weekly:** major Agent frameworks, browser/computer-use systems, evaluation and observability projects.
- **Exploration:** new projects discovered through fixed queries; not admitted until maintenance and evidence checks pass.

## Incremental events

For each repository, inspect only changes after the last checkpoint:

1. Releases and Tags;
2. merged Pull Requests;
3. high-value Issues;
4. official Discussions, Announcements, RFCs and Roadmaps;
5. Security Advisories;
6. changes to README, CHANGELOG, SECURITY, RFC, architecture, benchmark, evaluation and test paths.

Do not re-scan the full repository history every day.

## High-value filters

### Objects

- agent runtime
- coding agent
- digital employee
- computer use
- long-running agent
- multi-agent
- MCP / A2A
- evaluation and benchmark
- recovery and resume
- human approval
- observability
- sandbox and isolation

### Change types

- Release
- breaking change
- deprecation
- security
- architecture
- benchmark
- roadmap
- migration
- regression
- new API
- enterprise policy

## Evidence levels

```text
official_release
merged_maintainer_change
official_maintainer_statement
security_advisory
reproducible_issue
community_report
exploratory_repository
```

Stars and trending position are discovery hints only.

## Three-column routing

GitHub serves all three columns:

- Digital Employee: long tasks, Computer Use, memory, approval, recovery, completion and evaluation;
- Industry Architecture: official platform repositories, enterprise SDKs, connectors, identity and policy mechanisms;
- Open-source Engineering: runtimes, protocols, SDKs, tools, tests, benchmarks and observability.

## Change-object deduplication

A Release, PR, Issue, Discussion and documentation change concerning the same mechanism are merged:

```yaml
change_object:
  repository:
  feature:
  release:
  pull_requests:
  issues:
  discussions:
  documentation:
  evidence_level:
```

## Required scan record

```yaml
github_scan:
  organizations_due:
  organizations_checked:
  repositories_due:
  repositories_checked:
  releases_found:
  merged_prs_reviewed:
  high_value_issues_reviewed:
  discussions_reviewed:
  security_advisories_reviewed:
  new_repositories_found:
  signals_created:
  scan_failures:
```

“Checked with no important change” and “not checked” must remain separate.
