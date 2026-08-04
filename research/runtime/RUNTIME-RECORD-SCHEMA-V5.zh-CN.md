# Research Runtime Center V5 — Runtime Record 合同

## 四类记录

V5 定义四种相互独立的记录 Schema：

| Runtime 体系 | Schema | 记录路径 |
|---|---|---|
| Daily | `daily-runtime-record/v1` | `records/daily/YYYY/MM/YYYY-MM-DD-daily-runtime.json` |
| Weekly | `weekly-runtime-record/v1` | `records/weekly/YYYY/MM/YYYY-MM-DD-weekly-runtime.json` |
| Academic | `academic-runtime-record/v1` | `records/academic/YYYY/MM/YYYY-MM-DD-academic-runtime.json` |
| Program | `program-runtime-record/v1` | `records/program/YYYY/MM/YYYY-MM-DD-program-runtime.json` |

不同 Runtime 体系的记录、状态和时间线禁止合并。

## 记录必填字段

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

允许的状态只有：

`Running` · `Completed` · `Blocked` · `Failed` · `Skipped` · `Waiting`

## 班次成果合同

所有终态任务必须拥有一个 `runtime-shift-result/v2` 对象：

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

`Skipped` 还必须提供 `reason` 与 `reason_zh`。

## Daily 状态字段

Daily Record 只能包含以下六个正式任务：

```text
discovery
queue
reading
analysis
production
publication
```

Weekly、Academic、Program Record 只包含各自的独立任务。

## 完成规则

Scheduler 打开执行槽不等于任务完成。只有任务状态进入终态，并且存在状态一致的完整班次成果对象，才允许记录为终态。

## 历史规则

V4 Markdown Runtime Record 是冻结历史证据。V5 从 2026-08-05 开始使用上述四类 JSON Record，禁止把历史 V4 结果重写为 V5 结果。
