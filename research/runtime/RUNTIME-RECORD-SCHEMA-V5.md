# Research Runtime Center V5 — Runtime Record Contracts

## Record families

V5 defines four independent record schemas:

| Runtime family | Schema | Record path |
|---|---|---|
| Daily | `daily-runtime-record/v1` | `records/daily/YYYY/MM/YYYY-MM-DD-daily-runtime.json` |
| Weekly | `weekly-runtime-record/v1` | `records/weekly/YYYY/MM/YYYY-MM-DD-weekly-runtime.json` |
| Academic | `academic-runtime-record/v1` | `records/academic/YYYY/MM/YYYY-MM-DD-academic-runtime.json` |
| Program | `program-runtime-record/v1` | `records/program/YYYY/MM/YYYY-MM-DD-program-runtime.json` |

Records from different families must never be merged into one operational record or timeline.

## Required record fields

```json
{
  "schema": "daily-runtime-record/v1",
  "runtimeVersion": "5.0",
  "schedulerVersion": "3.0",
  "runtimeFamily": "daily",
  "date": "YYYY-MM-DD",
  "timezone": "Asia/Shanghai",
  "repository": "joinwell52-AI/joinwell52",
  "status": "Waiting",
  "taskStatus": {},
  "results": {},
  "timeline": [],
  "metrics": [],
  "evidence": [],
  "artifacts": [],
  "githubCommit": "pending",
  "commitVerify": "Waiting",
  "updatedAt": ""
}
```

Allowed statuses are exactly:

`Running` · `Completed` · `Blocked` · `Failed` · `Skipped` · `Waiting`

## Shift result contract

Every terminal task requires one `runtime-shift-result/v2` object:

```json
{
  "task": "analysis",
  "status": "Completed",
  "input": "English input description",
  "input_zh": "中文输入说明",
  "workResult": "English work result",
  "workResult_zh": "中文工作成果",
  "output": "English durable output",
  "output_zh": "中文持久化输出",
  "next": "English next governed action",
  "next_zh": "中文下一治理动作",
  "metrics": [
    { "label": "Objects analyzed", "label_zh": "已分析对象", "value": "1" }
  ],
  "evidence": [
    { "label": "Reading Result", "label_zh": "阅读结果", "source": "research/..." }
  ],
  "artifacts": [
    { "label": "Research Object", "label_zh": "研究对象", "path": "research/..." }
  ]
}
```

A `Skipped` result additionally requires `reason` and `reason_zh`.

## Daily task status keys

A Daily record contains exactly:

```text
discovery
queue
reading
analysis
production
publication
```

Weekly, Academic and Program records contain only their own family task.

## Completion rule

A Runtime task is not complete merely because a scheduler opened a slot. A terminal status is valid only when the corresponding shift result exists and its status matches `taskStatus`.

## History rule

V4 Markdown records are frozen historical evidence. V5 records start on 2026-08-05 and use the four JSON families above. No migration may rewrite historical V4 outcomes as V5 outcomes.
