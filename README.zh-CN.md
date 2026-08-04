# 数字员工工场

> **一条可下载、持续生产可核验数字员工工作成果的受治理产线**

[English](./README.md) · **简体中文**

[![数字员工工场](https://img.shields.io/badge/数字员工-工场-1f6feb?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/zh/)
[![运行中心](https://img.shields.io/badge/Runtime_Center-V4-7c6cff?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/zh/runtime/)
[![数字研究员](https://img.shields.io/badge/研究报告生产机-V1.3-6d5dfc?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/zh/publications/research-report-production-engine-v1.3)
[![研究情报](https://img.shields.io/badge/Research_Intelligence-V1.0-16a34a?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/zh/runtime/research-intelligence)

## 下载

- [下载当前源码 ZIP](https://github.com/joinwell52-AI/joinwell52/archive/refs/heads/main.zip)
- [打开 GitHub 仓库](https://github.com/joinwell52-AI/joinwell52)
- [查看 V1.3 快速开始](./docs/zh/publications/research-report-production-engine-v1.3-quickstart.md)

本项目不需要 APK、EXE 或传统安装程序。仓库本身就是下载发行物：包含研究技能、来源 Registry、Runtime 契约、调度配置、校验脚本、网站源码与运行证据。实际研究执行使用客户自己的 ChatGPT 与 GitHub 环境。

## 这个仓库是什么

数字员工工场通过唯一正式运行控制平面，持续生产可检查、可恢复、可重建的数字员工工作成果。

```text
Research Intelligence System V1.0
        ↓
三栏研究筛选
        ↓
Research Runtime Center V4
        ↓
研究报告生产机 V1.3
        ↓
Publication Candidate
        ↓
GitHub + Website + Commit Verify
```

当前数字研究员产品是：

- **研究报告生产机 V1.3**；
- 以 ChatGPT 中的 Research Analyst 岗位实现；
- 由 Research Runtime Scheduler V2.0 调度；
- 使用 Research Skills V2.0；
- 由三条来源情报管线提供输入；
- 通过 GitHub First 完成正式发布。

## 三条研究情报管线

Skill 01 是三个情报 Profile 的调度器：

1. **AI 平台变更情报发现**：持续检查 OpenAI、Claude、Gemini、Cursor、GitHub Copilot、Microsoft Copilot Platform 的官方文档、论坛、更新日志、GitHub 与状态渠道；
2. **GitHub 工程情报发现**：按受控 Watchlist 与增量方式检查 Release、Tag、合并 PR、高价值 Issue、Discussion、安全公告、架构文件、测试与 Benchmark；
3. **论文与研究成果情报发现**：检查论文、预印本、技术报告、Benchmark、数据集、System Card、Model Card、标准、代码仓库和评估资产。

三条管线共同服务三个长期研究栏目：

- **数字员工**；
- **行业架构**；
- **开源工程**。

每个入选对象只能有一个主栏目，同时可以记录对其他栏目的次级影响。

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

文章不是执行单元；Skill 才是执行单元。

## Research Runtime Center V4

Research Runtime Scheduler V2.0 定义八个正式 Runtime 任务：

| Runtime | 时间（`Asia/Shanghai`） | 工作成果 |
|---|---:|---|
| Research Runtime Engine | 每日 09:00 | 推进一个受治理生命周期转换。 |
| Research Runtime Queue | 每日 10:00 | 运行三条情报管线并形成三栏选题决定。 |
| Research Runtime Knowledge | 每日 11:00 | 将证据验证完成的研究笔记纳入 Knowledge。 |
| Research Runtime Architecture | 每周一 12:00 | 作出架构与生命周期裁定。 |
| **Research Runtime Production** | **每日 15:00** | 生产完整中英文 Publication Candidate。 |
| Research Runtime Publication | 每日 20:00 | 发布完整候选、更新网站、提交并验证。 |
| Research Runtime Weekly | 每周日 20:30 | 形成新的跨主题综合。 |
| Research Runtime Academic | 每周三 10:00 | 研究论文、Benchmark、规范、会议与机构。 |

### 下午生产，晚上发版

```text
15:00
写作 → 配图 → 证据与引用 → 出版编辑
→ 完整 Publication Candidate

20:00
Publication Candidate → 中英文公共文件 → 索引 → 网站
→ GitHub Commit → Commit Verify → Release
```

20:00 不重新进行来源发现、分析或文章写作。

## 汇报工作成果，而不是状态口号

每个定时任务必须汇报：

```text
Input
→ Work Outcome
→ Durable Output
→ Next Governed Action
→ Metrics
→ Artifacts and GitHub Evidence
```

定时触发不等于工作完成。没有 ChatGPT Worker 的实际执行，任务必须保持 `Waiting`、`Blocked` 或 `Failed`。

## 权威运行产物

```text
research/intelligence/REGISTRY.json
research/intelligence/runs/YYYY/MM/YYYY-MM-DD-intelligence.json
research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md
research/runtime/plans/YYYY/MM/YYYY-MM-DD-plan.json
research/runtime/candidates/YYYY/MM/YYYY-MM-DD-candidates.json
```

网站直接由仓库产物生成，不维护第二套手工状态或文章数据库。

## 产品与工程层级

网站能力卡片按以下层级展示：

```text
TMPA + FCoP
      ↓
CodeFlowMu + Digital Employee
```

- **TMPA：** 独立理论与规范层；
- **FCoP：** 基于文件的协同协议；
- **CodeFlowMu：** 数字员工开发与工作 Runtime；
- **Digital Employee：** 产品与交付层。

TMPA 与 FCoP 位于网站第一排；CodeFlowMu 作为第二排的第一项，后接 Digital Employee。

## 当前正式发布

### 数字研究员与 Runtime

- [研究报告生产机 V1.3](./docs/zh/publications/research-report-production-engine-v1.3.md)
- [V1.3 快速开始](./docs/zh/publications/research-report-production-engine-v1.3-quickstart.md)
- [Research Runtime Center V4](./docs/zh/runtime/v4.md)
- [Research Intelligence System V1.0](./docs/zh/runtime/research-intelligence.md)
- [V1.3 Release Record](./research/releases/research-report-production-engine-v1.3/RELEASE.md)

### TMPA

- [TMPA Architecture Paper A0.5](./docs/zh/publications/tmpa-architecture-paper-a0.5.md)
- [TMPA Core Specification S0.4](./docs/zh/publications/tmpa-core-specification-s0.4.md)
- [TMPA–FCoP–CodeFlowMu Implementation Case I0.4](./docs/zh/publications/implementation-case-i0.4.md)

## 生产验证证据

Production Test V1 实际生产了三个 Daily Research 对象、三个 Academic Observation、十二篇中英文 Markdown、六张独立 SVG Cover 与完整 GitHub 发布记录。第一次 CI Build 检测到真实 YAML Frontmatter 缺陷；修复并通过第二次构建后才完成合并。

V1.1–V1.3 随后增加了结构化 Runtime 成果汇报、三栏计划、Production 与 Publication 分离，以及 Research Intelligence System。

## 仓库结构

```text
.
├── docs/                         # 中英文 VitePress 网站
├── research/
│   ├── intelligence/             # 来源 Registry 与每日扫描记录
│   ├── runtime/                  # 调度、记录、计划、候选与契约
│   ├── skills/                   # Research Skills V2.0 与情报 Profiles
│   ├── production-tests/         # 生产验证证据
│   └── releases/                 # 正式发布记录
├── scripts/                      # 校验与网站数据生成脚本
├── .github/workflows/            # 调度、验证与 Pages 部署
├── LICENSE.md
├── CITATION.cff
├── README.zh-CN.md
└── README.md
```

## 许可边界

仓库可以公开阅读、克隆和下载。复制、改编、再发布和商业使用，以当前 [`LICENSE.md`](./LICENSE.md) 为准。

## 核心原则

> **数字员工不是一个会聊天的 AI，而是拥有岗位、职责、技能、工作流、标准、权限边界和可验证工作成果的持续工作者。**

> **Research Runtime——而不是单个自动任务——是数字研究员的运行控制平面。**

> **Production 生产完整报告；Publication 负责正式发版。**

## 作者

**朱卫 / Zhu Wei · joinwell52-AI**  
独立研究者

数字员工工场：https://joinwell52-ai.github.io/joinwell52/zh/
