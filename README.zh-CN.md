# 数字员工工场

> **一条可下载、持续生产可核验数字员工工作成果的受治理产线**

[English](./README.md) · **简体中文**

[![数字员工工场](https://img.shields.io/badge/数字员工-工场-1f6feb?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/zh/)
[![运行中心](https://img.shields.io/badge/Runtime_Center-V5.0-7c6cff?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/zh/runtime/)
[![调度器](https://img.shields.io/badge/Runtime_Scheduler-V3.0-2563eb?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/zh/runtime/v5)
[![数字研究员](https://img.shields.io/badge/研究报告生产机-V1.3-6d5dfc?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/zh/publications/research-report-production-engine-v1.3)
[![研究情报](https://img.shields.io/badge/Research_Intelligence-V1.0-16a34a?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/zh/runtime/research-intelligence)

## 下载

- [下载当前源码 ZIP](https://github.com/joinwell52-AI/joinwell52/archive/refs/heads/main.zip)
- [打开 GitHub 仓库](https://github.com/joinwell52-AI/joinwell52)
- [查看 V5.0 Runtime 规范](./docs/zh/runtime/v5.md)
- [查看 V1.3 快速开始](./docs/zh/publications/research-report-production-engine-v1.3-quickstart.md)

本项目不需要 APK、EXE 或传统安装程序。仓库本身就是下载发行物：包含研究技能、来源 Registry、Runtime 契约、调度配置、校验脚本、网站源码与运行证据。实际研究执行使用客户自己的 ChatGPT 与 GitHub 环境。

## 当前架构

```text
Research Intelligence System V1.0
        ↓
Research Runtime Center V5.0
        ↓
Daily / Weekly / Academic / Research Program Runtime
        ↓
研究报告生产机 V1.3
        ↓
GitHub + Website + Commit Verify
```

Research Runtime Center V5.0 是冻结架构基线。Scheduler V3.0 定义四套相互独立的 Runtime 与九个正式任务。长期 Program 不再进入 Daily Runtime。

## 四套独立 Runtime

### Daily Runtime

```text
09:00 Discovery → Signal Pool
10:00 Queue → Today's Research Plan
11:00 Reading → Reading Result
13:00 Analysis → Research Object
15:00 Production → Publication Candidate
20:00 Publication → GitHub + Website + Commit Verify + Release
```

Daily 每天必须对三个栏目分别作出 `Selected` 或 `No Selection` 决定：

- **数字员工**；
- **行业架构**；
- **开源工程**。

### Weekly Runtime

每周日 20:30 运行。输入为过去七天已完成证据核验的 Daily Research，输出新的 Trend、Architecture、Engineering 与 Prediction 判断。禁止复制或拼接 Daily 文章。

### Academic Runtime

每周三 16:00 运行。只接受 Paper、Benchmark、Specification 与 Institution。普通新闻禁止进入。

### Research Program Runtime

每周一 12:00 运行。分别推进以下长期 Program 的独立 Queue、Lifecycle、Review 与 Publication：

- TMPA；
- FCoP；
- CodeFlowMu；
- Digital Employee；
- Research Operating System。

Program 不得占用 Daily 阶段或 Daily 栏目。

## Research Skills V2.0

```text
01 Research Intelligence Discovery
02 Three-Column Research Triage
03 Deep Reading
04 Research Analysis
05 Research Writing
06 Research Visualization
07 Evidence & Citation
08 Publication Editing
```

文章不是执行单元；Skill 才是执行单元。V5 将 Skills 固定到明确输入与输出：Reading 消费已选对象，Analysis 消费 Reading Result，Production 消费 Research Object，Publication 只能消费完整 Publication Candidate。

## Research Intelligence System V1.0

Skill 01 调度三条情报管线：

1. **AI Platform Change Intelligence**；
2. **GitHub Engineering Intelligence**；
3. **Published Research Intelligence**。

三条管线共同服务三个 Daily 栏目。Discovery 产生当天 Signal Pool，Queue 负责栏目决定。

## 汇报工作成果，而不是状态口号

所有终态班次必须汇报：

```text
Input
Work Result
Output
Next
Metrics
Evidence
Artifacts
```

定时触发不等于工作完成。没有 ChatGPT Worker 的实际执行，任务必须保持 `Waiting`、`Blocked` 或 `Failed`。

## 权威 Runtime 产物

```text
research/runtime/SCHEDULER.json
research/runtime/records/daily/YYYY/MM/YYYY-MM-DD-daily-runtime.json
research/runtime/records/weekly/YYYY/MM/YYYY-MM-DD-weekly-runtime.json
research/runtime/records/academic/YYYY/MM/YYYY-MM-DD-academic-runtime.json
research/runtime/records/program/YYYY/MM/YYYY-MM-DD-program-runtime.json
research/intelligence/REGISTRY.json
research/intelligence/runs/YYYY/MM/YYYY-MM-DD-intelligence.json
```

V4 Markdown Record 作为冻结历史证据保留，V5 不重写历史结果。

## 产品与工程层级

```text
TMPA + FCoP
      ↓
CodeFlowMu + Digital Employee
```

- **TMPA：** 独立理论与规范层；
- **FCoP：** 基于文件的协同协议；
- **CodeFlowMu：** 数字员工开发与工作 Runtime；
- **Digital Employee：** 产品与交付层。

## 当前正式发布

### 数字研究员与 Runtime

- [Research Runtime Center V5.0](./docs/zh/runtime/v5.md)
- [Daily Runtime](./docs/zh/runtime/daily.md)
- [Weekly Runtime](./docs/zh/runtime/weekly.md)
- [Academic Runtime](./docs/zh/runtime/academic.md)
- [Research Program Runtime](./docs/zh/runtime/program.md)
- [研究报告生产机 V1.3](./docs/zh/publications/research-report-production-engine-v1.3.md)
- [Research Intelligence System V1.0](./docs/zh/runtime/research-intelligence.md)

### TMPA

- [TMPA Architecture Paper A0.7](./docs/zh/publications/tmpa-architecture-paper-a0.7.md)
- [TMPA Core Specification S0.6](./docs/zh/publications/tmpa-core-specification-s0.6.md)
- [TMPA–FCoP–CodeFlowMu Implementation Case I0.7](./docs/zh/publications/implementation-case-i0.7.md)

## 仓库结构

```text
.
├── docs/                         # 中英文 VitePress 网站
├── research/
│   ├── intelligence/             # 来源 Registry 与当天信号记录
│   ├── runtime/                  # Scheduler V3、四类 Record 与 Worker Contract
│   ├── skills/                   # Research Skills V2.0 与情报 Profiles
│   ├── production-tests/         # 生产验证证据
│   └── releases/                 # 正式发布记录
├── scripts/                      # 校验与网站数据生成脚本
├── .github/workflows/            # Scheduler V3、验证与 Pages 部署
├── LICENSE.md
├── CITATION.cff
├── README.zh-CN.md
└── README.md
```

## 冻结规则

V5.0 完成后，四套 Runtime 边界、Daily 六阶段顺序和 Scheduler V3 任务身份冻结。后续只优化来源质量、Worker 效率、指标、页面体验、证据质量与出版质量。

## 核心原则

> **数字员工不是一个会聊天的 AI，而是拥有岗位、职责、技能、工作流、标准、权限边界和可验证工作成果的持续工作者。**

> **Research Runtime——而不是单个自动任务——是数字研究员的运行控制平面。**

> **Production 生产完整报告；Publication 负责正式发版。**

## 作者

**朱卫 / Zhu Wei · joinwell52-AI**  
独立研究者

数字员工工场：https://joinwell52-ai.github.io/joinwell52/zh/
