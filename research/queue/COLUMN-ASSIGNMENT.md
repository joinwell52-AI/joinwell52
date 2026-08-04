# Research Queue Column Assignment V1

Research Runtime Center V4 introduces one mandatory primary-column assignment for every selected Queue object.

## Allowed values

```text
digital-employee
industry-architecture
open-source-engineering
```

## Rules

1. Every object promoted to `Selected` has exactly one primary column.
2. Cross-column relevance may be recorded as secondary impact, but it does not replace the primary column.
3. The primary column is determined by the object’s bounded research question, not merely by source type or keywords.
4. Queue writes the authoritative daily projection to:

```text
research/runtime/plans/YYYY/MM/YYYY-MM-DD-plan.json
```

5. Every daily plan contains exactly three decisions—one per column.
6. A column without a qualified topic records `No Selection` and the exact threshold, blocker, or evidence gap.
7. At most one new primary topic per column may be selected in a single daily Queue run.
8. Selection does not authorize Reading, Production, or Publication; the Engine and later gates remain authoritative.

## Current assignments

| Object | Primary column | Reason |
|---|---|---|
| `Q-20260803-09` — Multi-horizon Digital Employee execution and evaluation | `digital-employee` | Long-horizon execution, memory isolation, dependencies, reprioritization, and completion evidence are Digital Employee runtime questions. |
| `Q-20260804-11` — Condition-aware long-running Digital Employee monitoring | `digital-employee` | Waiting, external state change, condition evaluation, notification, consequential action, and cost-aware polling are Digital Employee operational-runtime questions. |

The 2026-08-03 and 2026-08-04 Industry Architecture and Open-source Engineering decisions are `No Selection`; the reasons are preserved in the corresponding Daily Research Plan files.

## Worker output

A Queue worker result should include the three-column plan as an artifact and report metrics such as:

```text
Selected — Digital Employee
Selected — Industry Architecture
Selected — Open-source Engineering
No Selection decisions
Unassigned selected objects (must be 0)
```
