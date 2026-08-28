# Skill 02 — Research Triage and Daily Portfolio Gate

## Purpose

Convert the unified evidence pool into three explicit daily research decisions while preventing product-update cadence from becoming the research agenda.

The three publication columns remain:

- Digital Employee
- Industry Architecture
- Open-source Engineering

But the Queue selects **research problems, mechanisms, failures, findings or comparisons** — not vendor releases.

## Highest-priority principle

**Agent Governance is the first research priority.**

When evidence quality and research value are comparable, prefer questions involving:

- identity and authority;
- call-time authorization;
- delegation and responsibility;
- task ownership;
- human approval;
- evidence and completion truth;
- audit and provenance;
- recovery authority;
- credential, memory and context isolation;
- policy enforcement.

## Input gate

Triage may begin only after the same-run-date Research Intelligence run records coverage of all three Runtime-compatible pipelines:

1. `ai-platform` — product / competitor sample evidence;
2. `github-engineering` — engineering / mechanism evidence;
3. `published-research` — research / benchmark / industry-application evidence.

If a due pipeline was not checked, Queue is incomplete unless it records a blocker.

## Research-object admission gate

Before scoring, every candidate must pass **all** of these gates.

### Gate A — Problem first

The candidate must be expressible as a bounded research question or proposition that remains meaningful without the name of the vendor or version.

Good:

> After delegation, should authority, budget and responsibility remain root-owned or transfer to the worker?

Bad:

> Codex released descendant token accounting.

### Gate B — Valid subject kind

At least one subject kind must apply:

```text
governance-problem
failure-mode
research-finding
architecture-mechanism
protocol-mechanism
benchmark-result
industry-application-pattern
cross-sample-comparison
prior-art-or-negative-result
```

`release-update`, `changelog-summary`, `routine-commit` and `announcement` are not valid Research Object kinds.

### Gate C — Research-theme binding

The candidate must bind to at least one declared research theme from Skill 01.

A new feature with no substantive digital-employee or multi-agent research theme is rejected from Daily research admission.

### Gate D — Research value

The evidence must provide at least one substantive value:

- Failure — a meaningful failure, limitation, risk or counterexample;
- Finding — a supported discovery or result;
- Mechanism — a reusable architecture, policy, protocol, state or workflow mechanism;
- Implication — a bounded consequence that can be tested or compared.

“Something changed” is not research value.

### Gate E — Release boundary

**A Release, commit, changelog, tag, roadmap item or announcement cannot be selected solely on that evidence.**

It may support a candidate only after the underlying problem/mechanism is identified and the release is treated as evidence.

A `sample-change-trigger` signal by itself is never selectable.

### Gate F — Evidence sufficiency

For a vendor/platform-derived mechanism, prefer one of:

- primary mechanism evidence plus an independent or different-sample comparison;
- implementation evidence plus a paper/benchmark/incident;
- multiple independent implementations of the same problem;
- a strong primary failure/benchmark result that itself establishes a bounded research question.

A single routine vendor update with only vendor evidence normally remains `candidate` or `rejected`, not `selected`.

## Scoring dimensions

Score each dimension from 0 to 5 only after admission passes.

| Dimension | Question |
|---|---|
| Governance value | Does it improve understanding of authority, responsibility, evidence, recovery, isolation or accountability? |
| Digital Employee value | Does it affect how an AI worker holds a role, owns work, acts, waits, escalates, delivers or is evaluated? |
| Multi-Agent value | Does it reveal coordination, delegation, topology, interoperability or cross-agent trust? |
| Failure-learning value | Does it expose a failure, counterexample, limitation or operational risk we can learn from? |
| Mechanism value | Does it reveal an implementable or testable mechanism rather than a feature label? |
| Finding value | Is there a meaningful empirical, benchmark, incident or comparative finding? |
| Cross-sample support | Is the question supported or challenged by more than one sample/source where appropriate? |
| Source quality | Is the evidence primary, authoritative, reproducible or methodologically clear? |
| Novel research delta | Does it materially add to, revise or challenge existing Research Center knowledge? |
| Bounded question | Can Deep Reading answer a specific research question within one object? |

Do not award novelty merely because a version is new.

## Deduplication by research problem

Signals about the same underlying mechanism/problem are merged even when they come from different vendors or evidence types.

```yaml
research_candidate:
  research_question:
  research_themes:
  subject_kind:
  samples:
  evidence:
    product:
    implementation:
    research:
    benchmark:
    failure:
```

A Release, PR, forum thread, issue, paper and benchmark may become one comparative candidate rather than six update candidates.

## Daily portfolio gate

Queue still submits exactly three column decisions, but it must manage the three as a research portfolio.

### Source concentration

- Default: one selected Research Object per primary sample/vendor/repository per day.
- A second object from the same primary sample requires an explicit exceptional rationale showing a genuinely different research problem and a clear score advantage.
- Three selected objects driven by the same vendor/repository are prohibited.

### Semantic concentration

Do not select three near-duplicate propositions merely because they can be routed to three different columns.

For example, three minor variants of “authority needs provenance” do not create a diverse daily portfolio.

### Question-first preference

Prefer at least one daily selection that begins from an active research question and collects evidence across samples, rather than beginning from a new product event.

### Research / benchmark utilization

Published research, benchmarks, standards, failure datasets and industry applications must compete on research value, not same-day recency. They must not be structurally disadvantaged by slower publication cadence.

### No-selection rule

A daily publishing target must never force a weak object into selection. `No Selection` is correct when no object passes the admission and quality gates.

## Decision values

- `selected`: passes all admission gates, has credible evidence and a bounded question;
- `candidate`: legitimate research problem but needs more evidence, comparison or clarification;
- `rejected`: update-only, promotional, repetitive, weakly related, unverifiable or fails an admission gate;
- `no_selection`: the column was scanned but no object met the threshold.

## Column rule

Every selected object has exactly one `primary_column` and may preserve secondary impact for Weekly Synthesis.

Columns classify publication. They do not define the research subject.

## Daily output

Preserve the existing Runtime-compatible fields and include the following where possible:

```yaml
triage:
  candidate:
  pipeline_origin:
  research_question:
  research_themes:
  subject_kind:
  signal_roles:
  sample_ids:
  evidence_levels:
  research_value:
    failure:
    finding:
    mechanism:
    implication:
  admission:
    problem_first:
    valid_subject_kind:
    theme_bound:
    release_boundary_passed:
    evidence_sufficient:
  scores:
  total:
  decision:
  selection_reason:
  rejected_reason:
  primary_column:
  secondary_columns:
  proposed_category:
  next_skill:
```

## Required rejection reasons

Use explicit reasons such as:

```text
UPDATE_ONLY
NO_RESEARCH_THEME
NO_BOUNDED_QUESTION
SINGLE_VENDOR_CHANGE_ONLY
INSUFFICIENT_MECHANISM_EVIDENCE
DUPLICATE_RESEARCH_PROBLEM
SOURCE_CONCENTRATION
SEMANTIC_CONCENTRATION
PROMOTIONAL_ONLY
UNVERIFIABLE
```

## Hard rules

- **Never select a platform Release, changelog, tag, routine commit or announcement as the Research Object itself.**
- Research the problem; use the platform event only as evidence.
- Agent Governance is the first priority, not the only topic.
- Multi-agent industry applications, competitor mechanisms, failures, papers and benchmarks must receive real selection opportunity.
- Do not force first-party project relevance during Queue.
- Do not begin Deep Reading, Analysis, writing or publication in Queue.
