---
title: "A1 公开证据包：响应丢失与逐工具幂等"
date: '2026-08-28'
column: research-evidence
category: evidence
article_type: evidence-pack
edition: research-center
summary: "在同一响应丢失窗口中，受测报告写入复用既有结果，而受测任务创建生成第二张任务。"
lifecycle: "Published"
publication_authorized: true
---

# A1｜响应丢失与逐工具幂等

## 主张

在“动作已经持久化、成功响应随后丢失”的同一故障窗口中，受测的 `write_report` 复用既有报告，而受测的任务创建路径生成第二张任务。这只证明幂等需要逐工具检查，不能外推到未受测工具。

## 可重跑附件

- [脱敏 fixture](/assets/evidence/2026-08-28-runtime-boundary/A1-response-loss-fixture.json)
- [Reader](/assets/evidence/2026-08-28-runtime-boundary/A1-response-loss-reader.mjs)
- [检查脚本](/assets/evidence/2026-08-28-runtime-boundary/A1-response-loss-check.mjs)
- [附件 SHA-256 清单](/assets/evidence/2026-08-28-runtime-boundary/MANIFEST.txt)

下载三份文件到同一目录后运行：

```text
node A1-response-loss-check.mjs
```

预期输出：

```json
{"evidence_id":"RBE-20260828-A1","report_objects_after_retry":1,"task_objects_after_retry":2,"status":"PASS"}
```

## 来源与边界

原始定向实验运行于 CodeFlowMu V2.0.4 固定提交 `2ba1ad9baf27077861b6a20e5815b4175f0a81c6`。公开夹具替换了任务编号、路径和正文，但保留相同提交声明与最终对象数量关系。

它不提供生产发生率，不覆盖未受测工具，也不证明拟议的 `reserved → task_created → committed` 已经实现。
