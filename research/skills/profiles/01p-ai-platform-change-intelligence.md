# Skill 01-P — AI Platform Change Intelligence

**中文名称：AI 平台变更情报发现**

## Purpose

Continuously detect material changes in major AI platforms and convert them into evidence-graded signals for all three research columns.

This profile studies product and operating architecture, not general AI news.

## P0 daily platforms

- OpenAI / ChatGPT / Codex
- Anthropic / Claude / Claude Code
- Google / Gemini
- Cursor
- GitHub Copilot
- Microsoft Copilot Platform

The authoritative channels are stored in `research/intelligence/REGISTRY.json`.

## Channel matrix

For every due platform, check the applicable channels:

1. official release notes or changelog;
2. product and developer documentation;
3. API, SDK and model lifecycle changes;
4. official blog, research report, system card or roadmap;
5. official forum or community;
6. official GitHub organization or repository;
7. status page, incident and security notice;
8. pricing, quota, policy and enterprise-control changes.

A channel requiring authentication must be recorded as `authentication-required`; it must not be reported as “checked with no update.”

## Change taxonomy

- model launch, update, migration or retirement;
- Agent, long-running task, Computer Use and scheduled work;
- coding agent, IDE, CLI and cloud-agent changes;
- API, SDK, tool, Skill, MCP, connector and webhook changes;
- Workspace, Team, Enterprise, RBAC, identity and approval;
- security, privacy, data retention, audit and incident;
- benchmark, evaluation, system card and technical report;
- pricing, quota, billing and product-boundary changes.

## Forum evidence levels

```text
official_announcement
official_staff_confirmation
reproducible_community_report
unverified_discussion
```

Only the first two may establish an official platform fact. Community reports remain leads until corroborated.

## Three-column routing

- **Digital Employee:** position work, task execution, waiting, recovery, approval, delivery and evaluation.
- **Industry Architecture:** platform products, workspace, control plane, enterprise management, permissions, connectors and commercial boundaries.
- **Open-source Engineering:** SDKs, CLI, runtime mechanisms, protocols, tests, security and reproducible implementation.

One signal has one primary column and optional secondary columns.

## Output

```yaml
platform_signal:
  platform:
  product:
  channel_type:
  source_url:
  published_at:
  authority_level:
  change_type:
  observed_change:
  corroborating_sources:
  primary_column:
  secondary_columns:
  relevance:
    tmpa:
    digital_employee:
    codeflowmu:
  confidence:
  triage_status:
```

## Completion gate

The profile is complete only when every due P0 platform is:

- checked;
- explicitly inaccessible with a reason; or
- failed with a recorded error and next action.

Finding an article is not the completion criterion. Coverage is.
