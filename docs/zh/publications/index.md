# 出版中心

数字员工工场以版本化方式公开 Runtime 能力、数字员工能力、论文、规范和工程案例。GitHub 是唯一事实源；只有通过相应 Runtime Gate、形成 Git Commit 并完成 Commit Verify 的修订才属于正式交付。

## 当前运行体系

| 类型 | 文档 | 当前版本 | 状态 |
|---|---|---:|---|
| Research Runtime Center | [运营中心](../runtime/) | **V5.0** | 架构冻结 / 持续运行 |
| 运行调度器 | [Research Runtime Center V5.0 规范](../runtime/v5) | **Scheduler V3.0** | Active / Dependency-aware recovery |
| 研究情报系统 | [Research Intelligence System](../runtime/research-intelligence) | V1.0 | Active |

V5 建立四套相互独立的 Runtime。Daily Runtime 负责 Discovery、Queue、Reading、Analysis、Production、Publication 六阶段；周日另有 20:30 Weekly，因此周日当天共 7 个正式任务。Scheduler 使用 durable Runtime facts 做依赖门禁、欠班追赶和 Blocked 恢复。

历史记录继续保留：

- [Research Runtime Center V4 历史](../runtime/v4)
- [Research Runtime Scheduler V1.0 正式发布](./research-runtime-scheduler-v1.0)

## 数字研究员能力

| 类型 | 文档 | 版本 | 状态 |
|---|---|---:|---|
| 数字员工能力 | [研究报告生产机](./research-report-production-engine-v2.0) | **V2.0** | **Current Capability Release** |
| 使用说明 | [V2.0 快速开始](./research-report-production-engine-v2.0-quickstart) | V2.0 | Downloadable |
| 历史能力 | [研究报告生产机 V1.3](./research-report-production-engine-v1.3) | V1.3 | Historical Release |

V2.0 从“按时间触发的研究生产线”升级为“依赖驱动、可追赶、可恢复、自校验的数字研究员 Runtime”：

- GitHub cron 是唤醒信号，不是调度事实源；
- `SCHEDULER.json + Runtime Record` 决定真正应执行的班次；
- 严格执行 Discovery → Queue → Reading → Analysis → Production → Publication；
- 周日 Publication 完成后才允许 Weekly；
- 漏班从最早可执行阶段逐个追赶；
- 依赖型 Blocked 在依赖完成后受控重开；
- Runtime V5 与 Markdown ledger 每次状态变更后执行自检；
- 2026-08-09 Reading 漏班与 Analysis Blocked 是首个真实 Recovery Case。

下载入口：

- [下载当前源码 ZIP](https://github.com/joinwell52-AI/joinwell52/archive/refs/heads/main.zip)
- [打开 GitHub 仓库](https://github.com/joinwell52-AI/joinwell52)

V1.0 作为首个 Production Test 历史基线保留：[旧版兼容入口](./research-report-production-engine-v1.0)。

## TMPA 出版体系

| 类型 | 文档 | 版本 | 状态 |
|---|---|---:|---|
| 论文 | [TMPA Architecture Paper](./tmpa-architecture-paper-a0.9) | A0.9 | 投稿前审稿修订版；TMPA → Core → FCoP → CodeFlowMu 当前指导关系定稿 |
| 规范 | [TMPA Core Specification](./tmpa-core-specification-s0.6) | S0.6 | 发布候选版；Reference Reader 14/14 PASS；CodeFlowMu V1.6.0 产品运行 14/14 PASS（作者运行） |
| 案例 | [TMPA–FCoP–CodeFlowMu Implementation Case](./implementation-case-i0.8) | I0.8 | 精确 S0.6 版本的 CodeFlowMu V1.6.0 证据：C01–C14 作者运行 14/14 PASS；包含公开复现器；WP-13 作为有边界案例保留 |

TMPA 出版体系是独立理论层。工场的高频观察笔记不自动构成论文证据；工程案例只报告其明确范围内的实现与验证结果。TMPA 长期研究进入 Research Program Runtime，不再进入 Daily Runtime。

```text
Daily Discovery
→ Three-Column Queue
→ Deep Reading
→ Research Analysis
→ Publication Candidate
→ 中英文正式出版
→ GitHub Commit
→ CI / Commit Verify
→ Pages Build
→ 数字员工工场
```

在获得稳定版本或 DOI 之前，引用时应注明作者、标题、明确版本、仓库地址和访问日期。
