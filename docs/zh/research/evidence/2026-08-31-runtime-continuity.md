---
title: "RCR-20260831 公开证据包：Runtime 连续性、重试资格与可采纳证据"
date: '2026-08-31'
column: research-evidence
category: evidence
article_type: evidence-pack
edition: research-center
summary: "三篇 Runtime 连续性研究共用的脱敏捕获数据、Reader、检查器和来源映射：重试资格、跨 Session 授权与归属、以及分时证据可采纳性。"
lifecycle: "Published"
publication_authorized: true
---

[English Version](/en/research/evidence/2026-08-31-runtime-continuity)

# RCR-20260831｜Runtime 连续性研究证据包

状态：公开审阅与复核包。所有身份均为实验合成标识；不含真实任务账本、凭据、签名密钥或产品源码。

本页支持三篇文章：

1. [审计失败后的重试资格](/zh/engineering/2026-08-31-audit-failure-retry)
2. [跨 Session 的授权、执行身份与归属](/zh/engineering/2026-08-31-session-principal-continuity)
3. [Runtime 的可采纳证据实验](/zh/engineering/2026-08-31-audit-evidence-admissibility)

## 复核层次

**公开捕获数据与 Reader。** 只需 Node.js、无需网络或产品依赖；可检查文章数字、四个时点与四个负对照。

**产品行为重跑。** 需要获准访问固定 CodeFlowMu 源码和已安装依赖；探针调用真实服务，但仅使用本地合成执行器。它不验证真实 HTTP、Git、Issue、支付或 provider 账号切换。

下载下列文件到同一目录后运行：

- [检查器](/assets/evidence/2026-08-31-runtime-continuity/check.mjs)
- [Reader](/assets/evidence/2026-08-31-runtime-continuity/reader.mjs)
- [完整性检查器](/assets/evidence/2026-08-31-runtime-continuity/check-manifest.mjs)
- [时间线 Fixture](/assets/evidence/2026-08-31-runtime-continuity/fixtures/timeline.json)（其余 Fixture 同目录）
- [来源与版本](/assets/evidence/2026-08-31-runtime-continuity/provenance.json)
- [清单](/assets/evidence/2026-08-31-runtime-continuity/manifest.json)

```text
node check.mjs
node check-manifest.mjs
```

预期退出码为 0。公开检查确认 3 组跨进程恢复对照、11 组授权消费、8 组技能绑定、8 个 Reader 场景和 CatchBench PRE 的 1,187 个配置计数。不同集合不能相加成产品可靠性、检测准确率或线上收益。

## 主张 → 来源 → Fixture → Check

| 证据 | 支持的主张 | 公开附件 | 能证明什么，不能证明什么 |
|---|---|---|---|
| E-A0 | P0–P3 在不同审计落点的状态与效果不同 | [historical-probes.json](/assets/evidence/2026-08-31-runtime-continuity/fixtures/historical-probes.json) | P3 保留首次效果而被写成 failed；不是线上事故率 |
| E-A1 | 新进程恢复的效果取决于执行器去重和摘要 | [restart.json](/assets/evidence/2026-08-31-runtime-continuity/fixtures/restart.json) | 无去重为 1→2，稳定键为 1→1，摘要变化拒绝；不是全部生产执行器覆盖 |
| E-B1 | session 变化本身不足以使匹配批准失效 | [authorization.json](/assets/evidence/2026-08-31-runtime-continuity/fixtures/authorization.json) | 11 条条件、两条允许路径不能二次消费；不证明外部入口身份可信 |
| E-B2 | 会话绑定、错误声明与合法无会话操作分类 | [session-binding.json](/assets/evidence/2026-08-31-runtime-continuity/fixtures/session-binding.json) | 2 verified、5 invalid_claim、1 not_applicable；公开包不携带 HMAC 密钥 |
| E-C0 | CatchBench PRE 的总体与来源分布 | [原始输出](/assets/evidence/2026-08-31-runtime-continuity/fixtures/catchbench-pre.log) | 固定 PRE 输出及 1,187 配置；不是本轮模型调用或 CodeFlowMu 成绩 |
| E-C1 | 命题、归属、时点、完整性改变可采纳证据 | [timeline.json](/assets/evidence/2026-08-31-runtime-continuity/fixtures/timeline.json) | Reader 跑 4 正常/4 负对照；不是产品审计器或统计准确率 |

## 证据读取合同与限制

公开 Reader 固定 proposition，接受正确 owner、未超过 cutoff、且与 manifest 匹配的内容；然后读取截止点内最新的效果快照。因此它检查的是可采纳证据，不是全部日志。`unknown` 不等于 `false`，`not_observed` 不等于未来不会发生。

原始产品探针与本次执行一致的 [reproduce-product.mts](/assets/evidence/2026-08-31-runtime-continuity/reproduce-product.mts) 也随包提供。它要求源码固定在 `f0f42f01c8f6d55bfe3d32e108f607841a2900d9`，并且只能写入隔离研究目录。

本轮实验由同一研究者完成；没有独立 QA、盲测、生产故障率、真实 provider 账号权限提升或线上预警效果结论。公开清单可发现相对于本包的静默改动，但不是独立见证。
