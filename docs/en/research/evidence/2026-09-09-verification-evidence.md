---
title: "Four verification experiments: observations and scope"
---

# 实验附件 / Experimental evidence

本附件支持四篇文章的数值与机制判断。研究日期：2026-09-09。所有用例均为构造夹具，两轮分别运行；没有生产统计样本，也没有独立第三方复核。

| 文章 | 原始观测副本 | 每轮用例 | 实际执行范围 |
| --- | --- | ---: | --- |
| 01 备注与通过率 | [第一轮](/assets/verification-evidence-20260909/evidence/probe-1.json)、[第二轮](/assets/verification-evidence-20260909/evidence/probe-2.json) | 8 | 真实本地聚合纯函数；原有八项测试通过 |
| 02 验证完成资格 | [第一轮](/assets/verification-evidence-20260909/evidence/fusion-1.json)、[第二轮](/assets/verification-evidence-20260909/evidence/fusion-2.json) | 6 | 固定上游工具入口；替换队列、持久化及沙箱接缝，实际执行无害 Node 版本命令 |
| 03 工具与输出 | [第一轮](/assets/verification-evidence-20260909/evidence/ag2-1.json)、[第二轮](/assets/verification-evidence-20260909/evidence/ag2-2.json) | 8 | 原类型与中间件逻辑；替换框架事件外壳，工具只增加调用计数 |
| 04 做完与送达 | [第一轮](/assets/verification-evidence-20260909/evidence/paperclip-1.json)、[第二轮](/assets/verification-evidence-20260909/evidence/paperclip-2.json) | 6 | 原投递服务；替换 ORM 查询链与唤醒持久化接缝 |

两轮合计 56 次夹具执行。它们检查具体合同，不能换算成产品可靠率。Fusion 没有启动 PostgreSQL；AG2 没有让真实模型消费结果，也没有产生真实外部副作用；Paperclip 没有执行真实 SQL、锁或事务。Paperclip 前两次探索运行因测试替身过早消费查询而失败，修正为等待查询时消费后得到随附结果；这不是上游产品故障。

本目录 JSON 是原观测的分发副本。仅把本机绝对路径改为 `<workspace>` / `<product>`；观测数值和事件顺序保留。各副本的字节哈希见 [文件清单](/assets/verification-evidence-20260909/evidence/files.json)。哈希用于完整性检查，不代表独立验证。内部研究目录保留原文件、探针脚本、固定源码快照及原始哈希；这里没有重新分发产品源码或上游源码，也不声称仅靠这些 JSON 可以重新运行实验。

固定来源：

- 本地 CodeFlowMu：`c008d9db91a21136fc61a4f60314e22db395d5d2`；`eval-outcome-summary.cjs` SHA-256：`7889a21dea5d833c83abb8e109862881e24edf43b8f213eac2593e5e35c17d64`。消费者尚待评审确认。
- [Fusion PR #3590](https://github.com/Runfusion/Fusion/pull/3590)：`b5d75aba5e7cdc145921113a1b069db95fa781f7`，研究时为开放提案。
- [AG2 PR #3240](https://github.com/ag2ai/ag2/pull/3240)：`bf363ef52853e7b918863dec2fe1e3902b811e6f`，研究时为开放提案。
- [Paperclip PR #13063](https://github.com/paperclipai/paperclip/pull/13063)：`7a2314c7fc610e4ee28babcaddb5c87912166dd5`，研究时已合并；此处固定的是研究头版本。

## English scope note

These are constructed experiments, not production measurements. Each of the four probes ran twice, with 8, 6, 8 and 6 cases per round. The attached observations preserve the measured values and event order, with local absolute paths replaced. They support the article tables but are not a standalone reproduction package. Internal records retain the probes and pinned source snapshots. Dependency substitutions deliberately exclude real database transactions, full agent integration and real external effects. Source hashes establish integrity, not independent validation. Open pull requests describe proposed behavior at the pinned revision, not necessarily released behavior.


