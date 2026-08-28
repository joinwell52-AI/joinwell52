---
title: "A3 公开证据包：技能与会话证据链"
date: '2026-08-28'
column: research-evidence
category: evidence
article_type: evidence-pack
edition: research-center
summary: "59 条历史技能记录、一个当前字段传播探针和一组混合证据等级样本，用于核对技能调用的会话归属。"
lifecycle: "Published"
publication_authorized: true
---

# A3｜技能与会话证据链

## 主张

技能配置存在、进入会话、真实调用与工程结果成立是不同事实。当前受测普通技能入口使用 `session_id` 做运行期去重，却没有把它写入持久调用证据。

## 历史字段剖面

| 关联字段 | 存在 | 缺失 | 缺失率 |
| --- | ---: | ---: | ---: |
| `task_id` | 49 | 10 | 16.9% |
| `session_id` | 0 | 59 | 100.0% |
| `thread_key` | 42 | 17 | 28.8% |
| `agent_id` | 15 | 44 | 74.6% |
| `integrity` | 59 | 0 | 0% |

样本最晚日期为 2026 年 8 月 12 日，不能代表所有当前技能入口。脱敏混合样本同时保留普通运行时读取记录和受 Runtime authority 核验的规划证据，二者证明范围不同。

## 可重跑附件

- [脱敏 fixture](/assets/evidence/2026-08-28-runtime-boundary/A3-skill-session-fixture.json)
- [Reader](/assets/evidence/2026-08-28-runtime-boundary/A3-skill-session-reader.mjs)
- [检查脚本](/assets/evidence/2026-08-28-runtime-boundary/A3-skill-session-check.mjs)
- [附件 SHA-256 清单](/assets/evidence/2026-08-28-runtime-boundary/MANIFEST.txt)

```text
node A3-skill-session-check.mjs
```

预期输出：

```json
{"evidence_id":"RBE-20260828-A3","records":59,"session_id_missing":59,"session_id_missing_percent":100,"current_probe_persisted_task":true,"current_probe_persisted_thread":true,"current_probe_persisted_session":false,"mixed_evidence_levels":2,"status":"PASS"}
```

## 边界

这些材料不代表所有技能证据入口都缺少 session，不证明技能建议错误，也不能根据历史上下文猜测回填缺失会话。调用证据只能证明调用发生，不能单独证明任务完成。
