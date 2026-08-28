---
title: "A2 公开证据包：事件消费者可见性"
date: '2026-08-28'
column: research-evidence
category: evidence
article_type: evidence-pack
edition: research-center
summary: "20,440 条历史事件的字段剖面与当前 Activity 查询探针，用于区分存储边界和消费边界。"
lifecycle: "Published"
publication_authorized: true
---

# A2｜事件消费者可见性

## 主张

历史存储出现字段投影，不等于每个当前查询与外发消费者都执行相同的最小可见性合同。受测 Activity 查询仍会返回只放在 `payload.raw` 中的唯一标记。

## 数据剖面

| 数据集 | 行数 | 带 `payload.raw` | 比例 |
| --- | ---: | ---: | ---: |
| Runtime | 2,743 | 1,474 | 53.7% |
| Analytics | 17,697 | 16,828 | 95.1% |
| 合计 | 20,440 | 18,302 | 89.5% |

8 月 10 日和 12 日的后期 Analytics 子集共 681 条，`payload.raw=0`。这是一项样本观察，不是全局字段白名单保证。

## 可重跑附件

- [脱敏 fixture](/assets/evidence/2026-08-28-runtime-boundary/A2-event-consumer-fixture.json)
- [Reader](/assets/evidence/2026-08-28-runtime-boundary/A2-event-consumer-reader.mjs)
- [检查脚本](/assets/evidence/2026-08-28-runtime-boundary/A2-event-consumer-check.mjs)
- [附件 SHA-256 清单](/assets/evidence/2026-08-28-runtime-boundary/MANIFEST.txt)

```text
node A2-event-consumer-check.mjs
```

预期输出：

```json
{"evidence_id":"RBE-20260828-A2","rows":20440,"rows_with_payload_raw":18302,"raw_percent":89.5,"runtime_raw_percent":53.7,"analytics_raw_percent":95.1,"current_query_returned_raw_marker":true,"status":"PASS"}
```

## 边界

历史总比例不是 V2.0.4 当前比例；查询结果中存在原始字段不等于已经发生未授权访问；夹具没有覆盖 Panel、Webhook、LAN 和所有调试入口。
