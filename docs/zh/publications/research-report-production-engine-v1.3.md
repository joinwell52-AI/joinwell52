---
title: 研究报告生产机 V1.3
description: 基于 ChatGPT、Research Skills V2.0、Research Intelligence System、Research Runtime Center V4 与 GitHub First 的可下载数字研究员生产系统。
outline: deep
---

<ArticleCover
  image="/assets/covers/research-report-production-engine-v1.svg"
  kicker="数字员工工场 · 当前能力发布"
  title="研究报告生产机 V1.3"
  summary="一个基于 ChatGPT、文本工作流和 GitHub First 的数字研究员生产系统。"
  version="V1.3"
  status="2026-08-04 · Current Capability Release"
  languageHref="/en/publications/research-report-production-engine-v1.3"
  languageLabel="English"
/>

## 下载与入口

- **[下载当前源码 ZIP](https://github.com/joinwell52-AI/joinwell52/archive/refs/heads/main.zip)**
- **[打开 GitHub 仓库](https://github.com/joinwell52-AI/joinwell52)**
- **[查看 V1.3 快速开始](./research-report-production-engine-v1.3-quickstart)**
- **[进入数字研究员运营中心](../runtime/)**

> 本项目不需要 APK、EXE 或传统安装程序。下载内容就是完整的研究技能、情报来源 Registry、文本化工作流、Runtime 规范、调度配置、网站源码、校验脚本和运行证据。实际研究执行依赖使用者自己的 ChatGPT 与 GitHub 环境。

## 一句话定义

**研究报告生产机 V1.3** 是一个通过 ChatGPT 实现的数字研究员应用：它不是单次文章生成 Prompt，而是把岗位、情报发现、三栏选题、研究技能、生产班次、发布门禁和 GitHub 证据组织成一条持续运行的文本驱动生产线。

```text
Research Analyst 岗位
        ↓
Research Intelligence System
        ↓
三栏研究计划
        ↓
Research Skills 01–08
        ↓
15:00 完整报告生产
        ↓
20:00 GitHub 与网站发版
        ↓
Runtime Record + Commit Verify
```

## 为什么是 V1.3

V1.3 不是对 V1.0 的简单改名，而是对已经落地的三个连续升级进行正式归档。

| 版本 | 核心能力 |
|---|---|
| V1.0 | 完成首个真实 Production Test，验证中英文研究笔记、配图、PR、CI、修复、Merge 与 Commit Verify。 |
| V1.1 | 接入 Runtime Record、定时任务成果汇报和数字研究员运营中心。 |
| V1.2 | 三个栏目独立选题；新增 15:00 Production；20:00 改为 Release Only。 |
| **V1.3** | 接入 Research Intelligence System：AI 平台、GitHub 工程、论文与研究成果三条情报管线。 |

## V1.3 的完整产品结构

### 1. 数字研究员岗位

```yaml
position: Research Analyst
worker: Digital Research Employee
platform: ChatGPT
work_system: Research Operating System
control_plane: Research Runtime Center V4
scheduler: Research Runtime Scheduler V2.0
skills: Research Skills V2.0
source_layer: Research Intelligence System V1.0
system_of_record: GitHub
```

数字研究员的正式工作不是“聊天”，而是接收任务、搜索来源、形成选题、推进研究、生产完整报告、提交发版，并留下能够检查与重建的工作记录。

### 2. 三条研究情报管线

Research Skills V2.0 将 Skill 01 升级为情报发现调度器，执行三个专用 Profile：

1. **AI 平台变更情报发现**：持续检查 OpenAI、Claude、Gemini、Cursor、GitHub Copilot、Microsoft Copilot Platform 的官方更新、文档、论坛、GitHub 和状态渠道；
2. **GitHub 工程情报发现**：按受控 Watchlist、查询矩阵和增量事件检查 Release、Tag、合并 PR、高价值 Issue、Discussion、安全公告、架构与 Benchmark；
3. **论文与研究成果情报发现**：扫描论文、预印本、技术报告、Benchmark、数据集、System Card、Model Card、规范及其关联代码与评估工具。

```text
AI 平台变更情报 ─┐
GitHub 工程情报 ──┼→ 统一信号池 → 去重 → 三栏筛选
论文与研究成果 ───┘
```

情报来源和研究栏目是两个不同维度。三条管线共同服务三个栏目。

### 3. 三个长期研究栏目

每日 10:00 的 Research Runtime Queue 必须分别对以下栏目作出 `Selected` 或 `No Selection` 决定：

- **数字员工**：岗位、职责、工作流、Runtime、等待、恢复、审批、交付与评估；
- **行业架构**：主要 AI 平台的 Agent 产品、Workspace、运行时、权限、连接器、企业控制与产品边界；
- **开源工程**：Agent Runtime、协议、SDK、工具、Benchmark、恢复、测试与可观测性工程。

同一个变化只能有一个主栏目，但可以记录对另外两个栏目的次级影响。

### 4. 八项 Research Skills

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

### 5. 每日运行节奏

| 时间 | Runtime | 工作成果 |
|---|---|---|
| 09:00 | Research Runtime Engine | 推进一个受治理生命周期转换。 |
| 10:00 | Research Runtime Queue | 完成三条情报管线、候选评分与三栏选题。 |
| 11:00 | Research Runtime Knowledge | 对证据验证完成的研究笔记进行知识准入。 |
| 周一 12:00 | Research Runtime Architecture | 作出架构、规范与生命周期裁定。 |
| **15:00** | **Research Runtime Production** | 完成中英文报告、配图、引用和出版编辑，形成 Publication Candidate。 |
| **20:00** | **Research Runtime Publication** | 只消费完整候选，更新公共文章、索引、网站、GitHub Commit 与 Commit Verify。 |
| 周日 20:30 | Research Runtime Weekly | 形成新的跨主题综合判断。 |
| 周三 10:00 | Research Runtime Academic | 执行论文、Benchmark、规范、会议与机构专项研究。 |

### 6. 下午生产，晚上发版

15:00 不是“写一个半成品草稿”，而是形成完整出版候选：

```text
Research Writing
→ Visualization
→ Evidence & Citation
→ Publication Editing
→ Publication Candidate
```

候选必须具备：

- 完整中文 Markdown；
- 完整英文 Markdown；
- 正确 Frontmatter、Metadata 与栏目归属；
- 已完成配图，或明确记录无配图决定；
- 已核验的证据和引用；
- 已完成出版编辑。

20:00 不重新研究和写作，只执行：

```text
Publication Candidate
→ 公共中英文文章
→ Metadata / Index / Website
→ GitHub Commit
→ Commit Verify
→ Release
```

### 7. 工作成果而不是状态口号

每个定时任务必须汇报：

```text
Input
→ Work Outcome
→ Durable Output
→ Next Governed Action
→ Metrics
→ Artifacts and GitHub Evidence
```

因此运营中心不只显示“已完成”，还显示：发现了多少信号、选择了什么题、推进了哪个对象、生成了哪些文件、下一步是什么，以及 GitHub 提交证据。

## 权威运行产物

```text
research/intelligence/REGISTRY.json
```

三条情报管线的固定来源、平台、仓库、主题和证据等级。

```text
research/intelligence/runs/YYYY/MM/YYYY-MM-DD-intelligence.json
```

每日来源覆盖、受限渠道、失败来源、信号、候选和三栏决定。

```text
research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md
```

每个班次的状态、输入、成果、输出、下一步、日志和 GitHub 验证。

```text
research/runtime/plans/YYYY/MM/YYYY-MM-DD-plan.json
```

三个栏目当天的选题决定。

```text
research/runtime/candidates/YYYY/MM/YYYY-MM-DD-candidates.json
```

15:00 形成、供 20:00 消费的完整出版候选。

## 下载后可以做什么

客户下载仓库后可以：

1. 阅读或复用 Research Skills V2.0；
2. 修改三条情报管线的来源 Registry；
3. 将三个栏目替换成自己的研究方向；
4. 在自己的 ChatGPT 中建立对应 Worker；
5. 连接自己的 GitHub 仓库；
6. 使用 GitHub Actions 打开 Runtime 执行槽；
7. 运行 Runtime、情报、三栏计划和出版候选校验；
8. 使用 VitePress 发布自己的研究网站。

### 最小命令

```bash
git clone https://github.com/joinwell52-AI/joinwell52.git
cd joinwell52
npm install
npm run runtime:validate
npm run docs:build
```

## 运行边界

### ChatGPT 是实际 Worker

GitHub Actions 负责按时间打开执行槽、初始化记录并执行校验。真正的来源阅读、判断、写作、配图、引用和编辑仍由 ChatGPT 数字研究员 Worker 完成。

因此：

```text
GitHub cron triggered
≠
research work completed
```

没有 Worker 执行时，任务必须保持 `Waiting`、`Blocked` 或 `Failed`，不能制造 `Completed`。

### 仓库公开可下载，但使用边界以许可证为准

本仓库可以公开浏览、克隆和下载。论文、规范、报告、图表、网站内容、代码和脚本的复制、改编、再发布或商业使用，以仓库当前 [`LICENSE.md`](https://github.com/joinwell52-AI/joinwell52/blob/main/LICENSE.md) 为准。

### 与 TMPA 的关系边界

研究报告生产机采用 TMPA 的单写者生命周期治理子集：明确状态、门禁、持久证据、Git 提交和 Reader 重建。它不是 TMPA 多写者角色分离的完整验证，也不能用单写者生产记录证明 TMPA 的全部理论主张。

## 生产验证证据

V1.0 Production Test 已真实完成：

- 3 个 Daily Research 对象；
- 3 个 Academic Observation 对象；
- 12 篇中英文 Markdown；
- 6 张独立 SVG Cover；
- GitHub Branch、PR、CI、失败修复、Merge 与 Commit Verify；
- 首次构建发现真实 YAML Frontmatter 缺陷，修复后第二次构建通过。

V1.1–V1.3 则进一步建立了 Runtime Center V4、Scheduler V2.0、三栏选题、下午生产班次、晚上发版班次和 Research Intelligence System。

## 正式证据与文档

- [Research Intelligence System V1.0](../runtime/research-intelligence)
- [Research Runtime Center V4](../runtime/v4)
- [Research Skills V2.0](https://github.com/joinwell52-AI/joinwell52/tree/main/research/skills)
- [Runtime Worker Contracts V2](https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/WORKER-PROMPTS-V2.md)
- [Production Test V1](https://github.com/joinwell52-AI/joinwell52/blob/main/research/production-tests/production-test-v1/REPORT.md)
- [V1.3 Release Record](https://github.com/joinwell52-AI/joinwell52/blob/main/research/releases/research-report-production-engine-v1.3/RELEASE.md)

## 正式定位

> **研究报告生产机 V1.3，是一个可下载、文本驱动、基于 ChatGPT 和 GitHub First 的数字研究员生产系统。它把来源情报、三栏选题、研究技能、完整报告生产、正式发版和可验证运行记录组织成一条持续工作线。**
