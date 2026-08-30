---
title: "A2 公开证据包：事件消费者可见性"
date: '2026-08-28'
updated: '2026-08-30'
column: research-evidence
category: evidence
article_type: evidence-pack
edition: research-center
summary: "保留 20,440 条历史事件与 V2.0.4 查询探针，补充 V2.1.2 三类消费者投影、首轮失败及独立 QA 结果。"
lifecycle: "Published"
publication_authorized: true
---

# A2｜事件消费者可见性

## 主张

历史存储出现字段投影，不等于每个查询与外发消费者都执行相同的最小可见性合同。V2.0.4 受测 Activity 查询会返回只放在 `payload.raw` 中的唯一标记；这是旧基线结果，新版结果见后文。

## 数据剖面

| 数据集 | 行数 | 带 `payload.raw` | 比例 |
| --- | ---: | ---: | ---: |
| Runtime | 2,743 | 1,474 | 53.7% |
| Analytics | 17,697 | 16,828 | 95.1% |
| 合计 | 20,440 | 18,302 | 89.5% |

8 月 10 日和 12 日的后期 Analytics 子集共 681 条，`payload.raw=0`。这是一项样本观察，不是全局字段白名单保证。

## 可重跑附件

以下 Reader/check 读取冻结 JSON 并验证统计与探针记录的一致性，不运行私有 Runtime。输出字段里的 `current` 指原实验基线，不指阅读当天版本；附件及 SHA-256 保留不变。

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

## 2026-08-30：V2.1.2 已交付更新

V2.1.1 `36e5c83b` 修改前复跑确认 raw marker 仍能返回。V2.1.2 实现服务端固定的 `web_panel / activity_api / analytics` 三类消费者策略，以递归字段白名单构造新对象，未知事件不返回未知 payload，内部原始事件保留。

首轮 Shell 定向回归为 19 pass / 1 fail：语义告警计数因字段误裁从 1 降到 0。只派生并投影 `ok/code/summary_blocked_reason/projection_status` 后复跑 20/20，没有恢复 raw 透传。

独立 QA B1 在候选 `64f633ac` 上观察：事件 1 条，raw marker 次数 0，`raw_present=false`；event_type、task_id、session_id 和 projected_summary 保留。B1 是内部验收编号，与本页 A2 公开包编号不同。

## 新增主张的来源与复核权限

| 主张 | 第一方来源 | 可见性 |
| --- | --- | --- |
| 修改前 marker 可见、白名单实现 | `RUNTIME-BOUNDARY-20260830-001`，实现 `3302ca61` | 私有母版材料，访问受限 |
| 字段误裁及修复 19/20 → 20/20 | 同包 failures 与 targeted-final 记录 | 私有母版材料，访问受限 |
| B1 独立验证 | `RUNTIME-BOUNDARY-QA-20260830-001`：independent-qa 记录 | 私有母版材料，访问受限 |
| V2.1.2 发布与最终回归 | `V2.1.2-R3`、`V2.1.2-PUBLICATION-20260830-001`；Runtime 1842 pass / 0 fail / 1 skip，Shell 1037 pass / 0 fail | 已登录 GitHub 接口及本地记录核对，2026-08-30 |

[V2.1.2 发布说明（需母版仓库访问权限）](https://github.com/joinwell52-AI/codeflowmu/releases/tag/V2.1.2)。新结果在此作为受限第一方验证的脱敏摘要公开，不伪称现有历史 JSON 可以重跑新版产品。

本次三类消费者投影不等于通用敏感内容检测、所有订阅者治理或真实网络授权审计。未发布 Open Edition，未切换在线实例；既有依赖告警、符号链接权限性 skip、真实 LAN/Gateway 未覆盖仍保留。历史 681 条 raw=0 样本也不能用来替代新实现测试。
