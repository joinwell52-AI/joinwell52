# 出版中心

数字员工工场以版本化方式公开 Runtime 能力、数字员工能力、论文、规范和工程案例。GitHub 是唯一事实源；只有通过相应 Runtime Gate、形成 Git Commit 并完成 Commit Verify 的修订才属于正式交付。

## 当前运行体系

| 类型 | 文档 | 当前版本 | 状态 |
|---|---|---:|---|
| Research Runtime Center | [运营中心](../runtime/) | **V5.0** | 架构冻结 / 持续运行 |
| 运行调度器 | [Research Runtime Center V5.0 规范](../runtime/v5) | **Scheduler V3.0** | Active |
| 研究情报系统 | [Research Intelligence System](../runtime/research-intelligence) | V1.0 | Active |

V5 建立四套相互独立的 Runtime。Daily Runtime 负责六个当天阶段：Discovery、Queue、Reading、Analysis、Production、Publication；Weekly、Academic、Research Program 使用独立调度和独立记录。Scheduler 共定义九个正式任务。

历史记录继续保留：

- [Research Runtime Center V4 历史](../runtime/v4)
- [Research Runtime Scheduler V1.0 正式发布](./research-runtime-scheduler-v1.0)

## 数字研究员能力

| 类型 | 文档 | 版本 | 状态 |
|---|---|---:|---|
| 数字员工能力 | [研究报告生产机](./research-report-production-engine-v1.3) | **V1.3** | Current Capability Release |
| 使用说明 | [V1.3 快速开始](./research-report-production-engine-v1.3-quickstart) | V1.3 | Downloadable |

研究报告生产机 V1.3 是基于 ChatGPT 的 Research Analyst Worker 与文本驱动生产系统。在 Runtime Center V5 中，它通过以下链路运行：

- Research Skills V2.0；
- AI 平台、GitHub 工程、论文与研究成果三条情报管线；
- 数字员工、行业架构、开源工程三个栏目分别选题；
- 11:00 Deep Reading；
- 13:00 Research Analysis；
- 15:00 完整报告生产；
- 20:00 GitHub 与网站发版；
- Daily、Weekly、Academic、Program 四类独立 Runtime Record；
- 班次成果汇报与 Commit Verify。

下载入口：

- [下载当前源码 ZIP](https://github.com/joinwell52-AI/joinwell52/archive/refs/heads/main.zip)
- [打开 GitHub 仓库](https://github.com/joinwell52-AI/joinwell52)

V1.0 作为首个 Production Test 历史基线保留：[旧版兼容入口](./research-report-production-engine-v1.0)。

## TMPA 出版体系

| 类型 | 文档 | 版本 | 状态 |
|---|---|---:|---|
| 论文 | [TMPA Architecture Paper](./tmpa-architecture-paper-a0.6) | A0.6 | 投稿级学术草稿 |
| 规范 | [TMPA Core Specification](./tmpa-core-specification-s0.5) | S0.5 | FCoP 派生的可实现规范草稿 |
| 案例 | [TMPA–FCoP–CodeFlowMu Implementation Case](./implementation-case-i0.6) | I0.6 | S0.5 作者运行产品证据与 WP-13 治理案例 |

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
