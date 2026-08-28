# Skill 01-P — Product / Competitor Sample Intelligence

**中文名称：产品与竞品样本情报发现**

> Runtime compatibility note: the pipeline identifier remains `ai-platform`, but its research role is no longer “platform release research.”

## Purpose

Observe product and competitor samples to discover **governance failures, mechanisms, operating patterns and product lessons** relevant to governed digital employees.

Platform releases, changelogs and announcements are monitored only as change triggers or evidence leads. They are not research subjects by themselves.

## Highest priority

**Agent Governance comes first.** Prefer evidence about:

- identity and authority;
- capability versus call-time authorization;
- delegation and task ownership;
- human approval and escalation;
- policy enforcement;
- evidence, audit and completion truth;
- recovery and rollback;
- credential, secret, memory and context isolation;
- responsibility and accountability.

## Sample families

### Digital Employee products

Maintain bounded awareness of product samples such as:

- Paperclip;
- StaffDeck;
- iML Work;
- Orkas;
- Fusion;
- TSA AI Workforce;
- Eigent;
- OneManCompany;
- OpenHire;
- CrewMeld;
- OpenVort;
- OACP / KiloLoop;
- Gas Town + Beads;
- Microsoft Sico;
- Palmier;
- SIDJUA.

### Enterprise governance / control-plane products

- Microsoft Agent Framework + Agent Governance Toolkit;
- ServiceNow AI Control Tower;
- IBM watsonx Orchestrate / Agentic Control Plane;
- UiPath Maestro;
- Salesforce Agentforce SOMA / Agent Gateway.

### Existing Registry platform sources

OpenAI, Anthropic, Google, Cursor, GitHub Copilot and Microsoft Copilot remain useful **platform evidence sources**, but ordinary model, UI, quota, pricing or release changes have no automatic research priority.

## What to collect

For each sample, prefer durable product and mechanism evidence over update summaries.

### 1. Failure / limitation

- permission leakage;
- unsafe credential inheritance;
- duplicate execution;
- stale or false completion state;
- supervisor bottleneck;
- failed recovery;
- approval reuse or expiry problems;
- memory/context contamination;
- infrastructure or always-on cost problems;
- product deployment or installation failure modes.

### 2. Mechanism

- identity and role model;
- authority and policy model;
- task claim / ownership model;
- approval flow;
- state machine;
- checkpoint / resume / replay;
- audit and evidence model;
- exception handling;
- human-agent handoff;
- multi-agent organization;
- desktop/mobile supervision pattern;
- packaging, local-first or enterprise deployment pattern when it materially affects governance or operability.

### 3. Finding

Capture measured, reproducible or well-supported observations about what works, fails or scales poorly.

### 4. Implication

State the potential consequence for governed digital employees without forcing a first-party project conclusion during Discovery.

## Channel policy

The authoritative due-channel list remains in `research/intelligence/REGISTRY.json` for Runtime coverage accounting.

For every due source, official documentation, architecture, security, incident, roadmap and repository evidence should be preferred over marketing summaries.

Official forums may contribute reproducible failure evidence or product clarification, subject to the Registry evidence rules.

## Release / changelog boundary

A new version, release, model launch, changelog entry, pricing change or announcement may create:

```yaml
signal_role: sample-change-trigger
```

It may be promoted to substantive evidence only when it exposes at least one of:

- a reusable governance problem;
- an architectural mechanism;
- a failure or regression;
- a measurable finding;
- a changed authority, recovery, evidence or organizational boundary;
- a meaningful industry product pattern relevant to digital employees.

The following is **not** sufficient:

> “Product X released version Y with feature Z.”

The following can be useful:

> “Product X changed how delegated workers obtain authority; this supplies evidence for the research question of delegation authority inheritance.”

## Research-theme binding

Every substantive product signal should bind to at least one theme from Skill 01, for example:

```text
call-time-authorization
delegation-authority
task-ownership-responsibility
human-approval-authority
evidence-completion-truth
recovery-authority
memory-context-isolation
role-organizational-design
human-agent-workflow
digital-employee-work-design
```

A product change that cannot be connected to a substantive research theme remains background intelligence.

## Three-column routing

- **Digital Employee:** position work, responsibility, governed execution, task ownership, waiting, approval, recovery, delivery and evaluation.
- **Industry Architecture:** organizational runtime, control plane, policy gateway, multi-agent topology, enterprise governance and human-agent process.
- **Open-source Engineering:** reproducible runtime, authorization, state, recovery, protocol, audit, test and evaluation mechanisms.

Columns do not grant research admission.

## Output enrichment

Keep the Runtime-compatible signal fields and add when evidence supports them:

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
  signal_role:
  research_themes:
  sample_ids:
  research_value:
    failure:
    finding:
    mechanism:
    implication:
  corroborating_sources:
  primary_column:
  secondary_columns:
  confidence:
  triage_status:
```

## Completion gate

Coverage remains the completion criterion for due Registry sources. Finding a release is not completion, and a release is not a research candidate merely because it is new.

## Hard rule

**Platform release/update content must never be selected as a Research Object solely because the platform changed.** Preserve it as evidence, or reject it from research admission.
