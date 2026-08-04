# Runtime Column Plan Contract V1

## Purpose

The Daily Research Plan is the formal output of **Research Runtime Queue**. It answers, for each of the three long-term research columns:

1. what was selected today;
2. why it was selected;
3. which lifecycle state it is in;
4. what happens next;
5. why no topic was selected, when applicable.

A selected queue object without a column assignment is invalid in Research Runtime Center V4.

## Canonical path

```text
research/runtime/plans/YYYY/MM/YYYY-MM-DD-plan.json
```

## Contract

```json
{
  "schema": "runtime-column-plan/v1",
  "date": "YYYY-MM-DD",
  "timezone": "Asia/Shanghai",
  "status": "Waiting | Running | Completed | Blocked | Failed | Skipped",
  "sourceTask": "Research Runtime Queue",
  "sourceRecord": "research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md",
  "updatedAt": "ISO-8601 timestamp or empty",
  "githubCommit": "full SHA or pending",
  "columns": []
}
```

`columns` contains exactly three entries and preserves this order:

1. `digital-employee` — 数字员工;
2. `industry-architecture` — 行业架构;
3. `open-source-engineering` — 开源工程.

## Column entry

```json
{
  "id": "digital-employee",
  "label": "Digital Employee",
  "label_zh": "数字员工",
  "selectionStatus": "Waiting | Selected | Researching | No Selection | Publication Candidate | Released",
  "itemId": "Q-... or empty",
  "title": "English title",
  "title_zh": "中文标题",
  "priority": "P0 | P1 | P2 or empty",
  "lifecycle": "Selected | Reading | Analysis | ...",
  "source": "Primary source or empty",
  "source_zh": "中文来源说明或空",
  "reason": "Why selected or why no selection",
  "reason_zh": "选题原因或未选题原因",
  "next": "Next governed action",
  "next_zh": "下一项受治理动作"
}
```

## Selection rules

- Every selected object belongs to exactly one primary column.
- Cross-column relevance may be recorded in the Queue, but it does not replace the primary column.
- `No Selection` is an explicit decision, not a missing value.
- A `No Selection` entry must explain the threshold, blocker or evidence gap.
- Queue may select zero or one primary object per column in a daily run.
- Queue must not create prose for publication.

## Operations Center projection

The V4 Operations Center reads this file directly and shows three fixed cards. It must not infer the column from keywords in a title and must not maintain a second hand-written list.
