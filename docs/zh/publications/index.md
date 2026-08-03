# 出版中心

joinwell52 Research Center 3.0 以版本化方式公开 Runtime 能力、数字员工能力、论文、规范和工程案例。GitHub 是唯一事实源；只有通过相应 Runtime Gate、形成 Git Commit 并完成 Commit Verify 的修订才属于正式交付。

## Research Center 3.0 Runtime 发布

| 类型 | 文档 | 版本 | 状态 |
|---|---|---:|---|
| Runtime 控制平面 | [Research Runtime Scheduler](./research-runtime-scheduler-v1.0) | V1.0 | Released |

Research Runtime Scheduler V1.0 是 Research Operating System 唯一正式调度器与可观测层，统一治理七个 Runtime 任务、每日 Runtime Record、自动生成的 Runtime Center 与 Publication Gate。

## 数字研究员能力

| 类型 | 文档 | 版本 | 状态 |
|---|---|---:|---|
| 数字员工能力 | [研究报告生产机](./research-report-production-engine-v1.0) | V1.0 | Production Verified |

研究报告生产机是基于 ChatGPT 的 Research Analyst Worker。在 Research Center 3.0 中，它运行于 Research Runtime Center 之下，并通过 Runtime Record 与 GitHub 验证关闭正式工作。

## TMPA 出版体系

| 类型 | 文档 | 版本 | 状态 |
|---|---|---:|---|
| 论文 | [TMPA Architecture Paper](./tmpa-architecture-paper-a0.5) | A0.5 | 学术工作草稿 |
| 规范 | [TMPA Core Specification](./tmpa-core-specification-s0.3) | S0.3 | 公开规范草稿 |
| 案例 | [TMPA–FCoP–CodeFlowMu Implementation Case](./implementation-case-i0.3) | I0.3 | 公开工程案例草稿 |

```text
Research Runtime
→ Runtime Record
→ 中英文正式出版
→ GitHub Branch 与 Commit
→ CI 验证
→ main
→ Commit Verify
→ Pages Build
→ Research Center
```

在获得稳定版本或 DOI 之前，引用时应注明作者、标题、明确版本、仓库地址和访问日期。
