# joinwell52 Research Center 2.0

> **一个由数字研究员持续运行的 AI 研究中心**

[English](./README.md) · **简体中文**

[![研究中心](https://img.shields.io/badge/Research_Center-2.0-1f6feb?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/zh/)
[![生产机](https://img.shields.io/badge/研究报告生产机-V1.0-6d5dfc?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/zh/publications/research-report-production-engine-v1.0)
[![状态](https://img.shields.io/badge/状态-Production_Verified-16a34a?style=for-the-badge)](https://github.com/joinwell52-AI/joinwell52/blob/main/research/production-tests/production-test-v1/REPORT.md)

## Research Center 2.0

joinwell52 Research Center 不再只被定义为一个研究网站，而是一个持续运行的研究系统。

```text
Research Operating System
        ↓
研究报告生产机
        ↓
运行在 ChatGPT 上的数字研究员
        ↓
Research Queue + Research Skills
        ↓
GitHub-first Publication
        ↓
Research Notes、Architecture 与 Formal Release
```

核心执行能力是 **研究报告生产机 V1.0（Research Report Production Engine V1.0）**：一个经过生产验证、基于 ChatGPT、按照真实 Research Analyst 岗位组织的数字研究员。

- [V1.0 中文正式发布](./docs/zh/publications/research-report-production-engine-v1.0.md)
- [English Release](./docs/en/publications/research-report-production-engine-v1.0.md)
- [Production Test V1](./research/production-tests/production-test-v1/REPORT.md)
- [Runtime Record](./research/production-tests/production-test-v1/RUNTIME-RECORD.md)
- [Release Record](./research/releases/research-report-production-engine-v1.0/RELEASE.md)

## 唯一事实源

本 GitHub 仓库是 joinwell52 Research Center 的**唯一权威研究数据库与出版历史**。论文、规范、数字员工能力、工程报告、研究笔记、运行记录、视觉资产与网站页面全部直接在此维护。

Git Commit、Diff、Pull Request、CI Result、Tag 与 Release 构成正式历史。文本被生成并不代表完成；只有通过所需 Publication Gate 并形成 Git Commit 的成果才属于正式发布。

原 ChatGPT Library `/TMPA` 目录已经退出活动工作流，只作为已弃用、只读的迁移档案，不再接受修订。

- [研究治理](./RESEARCH-GOVERNANCE.md)
- [单一事实源迁移记录](./MIGRATION-SINGLE-SOURCE.md)

## 当前正式出版体系

### 数字员工能力

- [研究报告生产机 — V1.0](./docs/zh/publications/research-report-production-engine-v1.0.md) — Production Verified

### TMPA

- [TMPA Architecture Paper — A0.4](./docs/zh/publications/tmpa-architecture-paper-a0.4.md)
- [TMPA Core Specification — S0.3](./docs/zh/publications/tmpa-core-specification-s0.3.md)
- [TMPA–FCoP–CodeFlowMu Implementation Case — I0.3](./docs/zh/publications/implementation-case-i0.3.md)
- [出版中心](https://joinwell52-ai.github.io/joinwell52/zh/publications/)

## 数字研究员

研究报告生产机按照岗位定义：

```yaml
position: Research Analyst
worker: Digital Research Employee
platform: ChatGPT
work_system: Research Operating System
skills: 8 Research Skills
queue: Research Queue
output: Research Notes and formal publications
system_of_record: GitHub
```

标准工作流程：

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
```

Production Test V1 实际生产了三个 Daily Research 对象、三个 Academic Observation、十二篇中英文 Markdown、六张独立 Cover 与完整 GitHub 发布记录。第一次 CI Build 发现真实 YAML 缺陷；修复后第二次 Build 通过，随后才 Merge 到 `main`。

## 定位

Research Center 不是新闻站、博客或被动论文仓库，而是一个流程驱动的 AI 研究运行系统，聚焦：

- 数字员工的岗位、工作流、Runtime、治理与评估；
- AI 工作的企业与行业架构；
- 开源 Agent 工程与 Runtime 系统；
- TMPA 工作数据与治理架构；
- FCoP 正式协作；
- CodeFlowMu 数字员工工程；
- 面向中小企业的可落地 AI 工作系统。

## 核心研究计划

- **TMPA：** AI 工作数据与治理架构；
- **FCoP：** 正式协作与责任协议；
- **CodeFlowMu：** 数字员工开发与工作 Runtime；
- **Digital Employee：** 面向组织岗位的受治理数字劳动力。

## 研究笔记模型

Research Notes 是持续增长的研究成果。每一篇研究文章必须包含正式元数据：

```yaml
column: digital-employee | industry-architecture | open-source-engineering
category: daily | weekly | academic
date: YYYY-MM-DD
```

网站直接读取 GitHub Markdown 元数据，自动生成栏目篇数、类别篇数、日期倒序列表与日历筛选，不维护第二套研究数据库，也不维护手工文章清单。

### 三个研究栏目

- [数字员工](https://joinwell52-ai.github.io/joinwell52/zh/digital-employee/)
- [行业架构](https://joinwell52-ai.github.io/joinwell52/zh/industry/)
- [开源工程观察](https://joinwell52-ai.github.io/joinwell52/zh/engineering/)

## 入口

- [Research Center 2.0](https://joinwell52-ai.github.io/joinwell52/zh/)
- [研究报告生产机 V1.0](https://joinwell52-ai.github.io/joinwell52/zh/publications/research-report-production-engine-v1.0)
- [研究笔记](https://joinwell52-ai.github.io/joinwell52/zh/research/)
- [出版中心](https://joinwell52-ai.github.io/joinwell52/zh/publications/)

## 双语规则

- 英文和中文出版物分别维护；
- 每对出版物保持相同主题、版本、状态、发布日期和语言切换链接；
- 允许按语言润色，但禁止只更新一种语言；
- 未形成 Git Commit 的修订不属于正式交付。

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
│   ├── skills/
│   ├── production-tests/
│   └── releases/
├── .github/workflows/
├── RESEARCH-GOVERNANCE.md
├── MIGRATION-SINGLE-SOURCE.md
├── CITATION.cff
├── README.zh-CN.md
└── README.md
```

## 核心原则

> **数字员工不是一个会聊天的 AI，而是一个拥有岗位、职责、技能、工作流、标准、权限边界和可验证工作成果的持续工作者。**

## 作者

**朱卫 / Zhu Wei · joinwell52-AI**  
独立研究者

Research Center：https://joinwell52-ai.github.io/joinwell52/zh/
