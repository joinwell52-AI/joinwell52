# 数字员工工场

> **一条持续生产可核验数字员工工作成果的受治理产线**

[English](./README.md) · **简体中文**

[![数字员工工场](https://img.shields.io/badge/数字员工-工场-1f6feb?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/zh/)
[![Runtime](https://img.shields.io/badge/Research_Runtime_Scheduler-V1.0-7c6cff?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/zh/publications/research-runtime-scheduler-v1.0)
[![数字研究员](https://img.shields.io/badge/研究报告生产机-V1.0-6d5dfc?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/zh/publications/research-report-production-engine-v1.0)
[![状态](https://img.shields.io/badge/Runtime_Record-Required-16a34a?style=for-the-badge)](./research/runtime/README.md)

## 数字员工工场

数字员工工场通过唯一正式运行控制平面持续生产可核验的数字员工工作成果。CodeFlowMu 与 FCoP 提供工程能力底座，TMPA 作为独立自证的理论与规范层维护。

```text
Research Operating System
  定义工作生命周期
        ↓
Research Runtime Center
  调度、观察、记录并验证执行
        ↓
研究报告生产机 V1.0
  执行 Digital Research Employee / Research Analyst 岗位
        ↓
Research Skills + Research Queue + Runtime Knowledge
        ↓
GitHub Commit + Commit Verify
        ↓
观察笔记、运行证据、Specification 与 Formal Release
```

Research Runtime Scheduler V1.0 是 Research Operating System 唯一正式调度器。单个自动任务只是 Runtime Worker，不再各自构成运行中心。

- [Research Runtime Center](https://joinwell52-ai.github.io/joinwell52/zh/runtime/)
- [Research Runtime Scheduler V1.0 正式发布](./docs/zh/publications/research-runtime-scheduler-v1.0.md)
- [Runtime Charter](./research/runtime/README.md)
- [Runtime Record Schema](./research/runtime/RUNTIME-RECORD-SCHEMA.md)
- [研究报告生产机 V1.0](./docs/zh/publications/research-report-production-engine-v1.0.md)
- [Production Test V1](./research/production-tests/production-test-v1/REPORT.md)

## Runtime 架构

```text
Research Runtime Center
        ↓
Runtime Scheduler V1.0
        ↓
Runtime Engine
        ↓
Runtime Queue
        ↓
Runtime Knowledge
        ↓
Runtime Architecture
        ↓
Runtime Publication / Weekly / Academic
        ↓
Runtime Record
        ↓
GitHub
        ↓
数字员工工场网站
```

[`research/runtime/SCHEDULER.json`](./research/runtime/SCHEDULER.json) 固定七个正式 Runtime 任务：

| Runtime | 调度时间（`Asia/Shanghai`） | 职责 |
|---|---|---|
| Research Runtime Engine | 每日 09:00 | 推进 Research OS 状态机。 |
| Research Runtime Queue | 每日 10:00 | 维护发现、候选、优先级与 Queue Lifecycle。 |
| Research Runtime Knowledge | 每日 11:00 | 维护 Knowledge、Related Notes 与 Architecture Candidate。 |
| Research Runtime Architecture | 每周一 12:00 | 执行 Architecture 与 Lifecycle Review。 |
| Research Runtime Publication | 每日 20:00 | 发布 Daily Research 并验证 GitHub Commit。 |
| Research Runtime Weekly | 每周日 20:30 | 形成新的综合与工程判断。 |
| Research Runtime Academic | 每周三 10:00 | 发布 Paper、Benchmark、Specification 与 Institution 研究。 |

原任务正文写“六类”，但实际明确规定了七项职责。数字员工工场以七项正式生产职责为准。

## Runtime Record——运行事实

每次正式运行写入一个每日记录：

```text
research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md
```

Runtime Record 包含开始与结束时间、Duration、Task Status、Output、Lifecycle、Queue 与 Engine 状态、Publication 状态、GitHub Commit、Commit Verify 与只追加的 Runtime Log。

只允许六种 Runtime 状态：

```text
Running · Completed · Blocked · Failed · Skipped · Waiting
```

网站的 Runtime Dashboard、Today’s Tasks、Timeline、History 与状态面板全部由 Runtime Record 自动生成，禁止手工维护。

## Runtime Publication Gate

```text
Research Runtime
→ Publication Candidate
→ Runtime Record
→ GitHub Commit
→ Commit Verify
→ Official Publication
```

没有 Runtime Record 的正式 Publication Pull Request 将无法通过 Runtime Gate。

> **任何正式 Publication 都必须由 Research Runtime 驱动并生成 Runtime Record；没有 Runtime Record 的发布，不属于正式运行结果。**

## 数字研究员

研究报告生产机 V1.0 是 Digital Research Employee 的执行能力：

```yaml
position: Research Analyst
worker: Digital Research Employee
platform: ChatGPT
work_system: Research Operating System
control_plane: Research Runtime Center
scheduler: Research Runtime Scheduler V1.0
skills: 8 Research Skills
queue: Research Queue
output: Research Notes and formal publications
system_of_record: GitHub
```

受治理工作流程：

```text
Source Discovery
→ Research Triage
→ Deep Reading
→ Research Analysis
→ Research Writing
→ Research Visualization
→ Evidence & Citation
→ Publication Editing
→ GitHub PR / CI / main Verification
→ Runtime Record Closure
```

Production Test V1 实际生产了三个 Daily Research 对象、三个 Academic Observation、十二篇中英文 Markdown、六张独立 Cover 与完整 GitHub 发布记录。第一次 CI Build 发现真实 YAML 缺陷；修复后第二次 Build 通过，随后才 Merge 到 `main`。

## 唯一事实源

本仓库是数字员工工场唯一权威的生产数据库、Runtime Record、观察档案与出版历史。

Git Commit、Diff、Pull Request、CI Result、Tag 与 Release 构成正式历史。生成文本不等于正式成果；只有通过相应 Runtime 与 Publication Gate 才属于正式运行结果。

原 ChatGPT Library `/TMPA` 目录已经退出活动工作流，只作为已弃用、只读的迁移档案。

- [研究治理](./RESEARCH-GOVERNANCE.md)
- [单一事实源迁移记录](./MIGRATION-SINGLE-SOURCE.md)

## 当前正式出版体系

### Runtime 与数字员工能力

- [Research Runtime Scheduler — V1.0](./docs/zh/publications/research-runtime-scheduler-v1.0.md) — Runtime Control Plane
- [研究报告生产机 — V1.0](./docs/zh/publications/research-report-production-engine-v1.0.md) — Production Verified

### TMPA

- [TMPA Architecture Paper — A0.5](./docs/zh/publications/tmpa-architecture-paper-a0.5.md)
- [TMPA Core Specification — S0.4](./docs/zh/publications/tmpa-core-specification-s0.4.md)
- [TMPA–FCoP–CodeFlowMu Implementation Case — I0.4](./docs/zh/publications/implementation-case-i0.4.md)
- [出版中心](https://joinwell52-ai.github.io/joinwell52/zh/publications/)

## 观察笔记模型

观察笔记为兼容历史 Schema 保留 `Research Note` 内部名称，并由两个相互独立的元数据维度组织：

```yaml
column: digital-employee | industry-architecture | open-source-engineering
category: daily | weekly | academic
date: YYYY-MM-DD
```

网站直接读取 GitHub Markdown 元数据，自动生成栏目篇数、类别篇数、日期倒序列表与日历筛选，不维护第二套研究数据库或手工文章清单。

- [数字员工](https://joinwell52-ai.github.io/joinwell52/zh/digital-employee/)
- [行业架构](https://joinwell52-ai.github.io/joinwell52/zh/industry/)
- [开源工程观察](https://joinwell52-ai.github.io/joinwell52/zh/engineering/)

## 产品、工程与理论层

- **Digital Employee：** 产品与交付层；
- **CodeFlowMu / FCoP：** Runtime 与协议工程层；
- **TMPA：** 独立维护的治理理论与规范层；
- **Digital Employee：** 面向组织岗位的受治理数字劳动力。

## 仓库结构

```text
.
├── docs/
│   ├── index.md
│   ├── en/
│   ├── zh/
│   ├── .vitepress/theme/
│   └── public/assets/covers/
├── research/
│   ├── runtime/
│   ├── skills/
│   ├── production-tests/
│   └── releases/
├── scripts/runtime-center.mjs
├── .github/workflows/
├── RESEARCH-GOVERNANCE.md
├── MIGRATION-SINGLE-SOURCE.md
├── CITATION.cff
├── README.zh-CN.md
└── README.md
```

## 核心原则

> **数字员工不是一个会聊天的 AI，而是一个拥有岗位、职责、技能、工作流、标准、权限边界和可验证工作成果的持续工作者。**

> **Research Runtime——而不是单个自动任务——是数字研究员的运行控制平面。**

## 作者

**朱卫 / Zhu Wei · joinwell52-AI**  
独立研究者

数字员工工场：https://joinwell52-ai.github.io/joinwell52/zh/
