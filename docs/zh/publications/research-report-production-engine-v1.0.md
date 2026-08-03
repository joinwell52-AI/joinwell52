---
title: 研究报告生产机 V1.0
description: 一个经过生产验证、基于 ChatGPT 的数字研究员，通过 Research OS、Research Skills、Research Queue 与 GitHub-first 发布流程持续完成研究工作。
outline: deep
---

<ArticleCover
  image="/assets/covers/research-report-production-engine-v1.svg"
  kicker="数字员工工场 · 能力发布"
  title="研究报告生产机 V1.0"
  summary="一个经过生产验证、基于 ChatGPT 的数字研究员。"
  version="V1.0"
  status="2026-08-02 发布 · Production Verified"
  languageHref="/en/publications/research-report-production-engine-v1.0"
  languageLabel="English"
/>

## 发布声明

**研究报告生产机 V1.0（Research Report Production Engine V1.0）**，是数字员工工场发布的首个经过生产验证的数字研究员。

它不是一个一次性的 Prompt，也不是“自动写文章”的包装，而是一个运行在 ChatGPT 上、按照真实岗位组织起来的应用能力：接收研究工作、调用受治理的 Research Skills、维护 Research Queue、生产中英文 Research Notes、通过 GitHub 正式发布，并保存从发现资料到 Release 的全过程证据。

> 这个产品的定义不是“会写文章的 AI”，而是一个具有岗位、职责、技能、工作流、标准、权限边界和可验证工作成果的数字研究员。

### 与 TMPA 的关系边界

本产品采用的是 **TMPA 的单写者生命周期治理子集**：每个正式对象只有一个写者，工作经过明确的生命周期状态与门禁，来源、过程、失败修复、Git Commit 和发布记录构成可重建证据链，Reader 可以从持久记录恢复工作全貌。

它不是多智能体协作案例，也不演示 TMPA DR4 所要求的多写者角色分离。执行者与复核者分离不属于本产品当前单写者场景的合规条件。因此，本产品只能作为 TMPA 生命周期治理、证据保留和重建语义的参考实例化，**不能被表述为对 TMPA 全部机制或多智能体主张的完整验证**。

站点将这条产线的高频内容称为“观察笔记”。历史 Schema 与生产记录中的 `Research Note` 名称为兼容性字段，不表示每一篇观察笔记都提出了新的学术知识。

### 发布元数据

| 字段 | 内容 |
|---|---|
| 产品 | Research Report Production Engine |
| 中文名称 | 研究报告生产机 |
| 版本 | V1.0 |
| 产品类型 | ChatGPT 应用 · 数字研究员 |
| 岗位 | Research Analyst / Digital Research Employee |
| 运行体系 | Research Operating System V2 |
| 发布模式 | GitHub First |
| 发布状态 | Production Verified |
| 发布日期 | 2026-08-02 |
| 作者与 Owner | 朱卫 / Zhu Wei · joinwell52-AI |

## 从理论到实践

这次发布打通了从研究理论到数字员工实际工作的完整链路。

```text
Research Operating System
  定义研究工作为什么以及怎样运行
        ↓
Research Skills
  定义可复用的研究能力
        ↓
Research Queue
  管理工作进入、选择、优先级与状态
        ↓
Research OS Engine
  按生命周期受控推进研究工作
        ↓
研究报告生产机
  承担 Research Analyst 岗位
        ↓
GitHub
  保存唯一权威出版物与运行证据
        ↓
数字员工工场网站
  根据仓库元数据展示正式研究成果
```

### 1. Research Operating System——理论层

Research OS 从一个基本判断出发：研究不等于文章生成。

任何正式研究成果都应经过受治理的运行流程：

```text
Signal
→ Candidate
→ Research Queue
→ Selected
→ Reading
→ Analysis
→ Research Note
→ Knowledge
→ Architecture
→ Specification
→ Publication
→ Release
```

这个流程把来源事实与研究判断分开，保存证据，并防止一个刚刚发现的 Signal 未经研究就直接变成文章。

### 2. Research Skills——能力层

V1.0 通过八项正式 Research Skills 执行工作：

1. Source Discovery；
2. Research Triage；
3. Deep Reading；
4. Research Analysis；
5. Research Writing；
6. Research Visualization；
7. Evidence & Citation；
8. Publication Editing。

Research Skills 才是执行单元；文章只是整个能力管线末端的一种输出。

### 3. Research Queue——工作层

Research Queue 把“发现”转换为可管理的工作：

```text
Source
→ Candidate
→ Score / Priority
→ Selected / Deferred / Rejected
→ Research Lifecycle
```

候选对象按照 Digital Employee、TMPA、CodeFlowMu、Engineering、Innovation、Official Source 与整体 Research Value 进行评估。发现资料本身不构成发布授权。

### 4. Research OS Engine——执行层

Engine 读取当前生命周期状态，调用对应 Skill，记录 Blocker，只允许受治理的状态迁移。证据不足时，研究对象返回 Reading、Analysis 或 Queue，而不是被强行生产成文章。

### 5. 研究报告生产机——数字员工

它把整个系统封装成一个容易理解的组织岗位：

```text
岗位：Research Analyst
员工：Digital Research Employee
平台：ChatGPT
工作系统：Research OS
技能：8 项 Research Skills
工作队列：Research Queue
工作成果：Research Notes 与正式出版物
唯一事实源：GitHub
```

## 岗位与职责

### 岗位

**Research Analyst / Digital Research Employee**

### 核心职责

持续发现、阅读、分析、撰写、验证并发布与 Digital Employee、Industry Architecture、Open-source Engineering、TMPA 和 CodeFlowMu 有关的研究成果。

### 标准工作流程

```text
发现来源
→ 登记候选对象
→ 评估研究价值
→ 深度阅读一手资料
→ 区分 Facts、Claims 与 Judgment
→ 形成研究判断
→ 编写中英文 Research Note
→ 生成有意义的视觉证据
→ 校验引用与 Metadata
→ 通过 GitHub 发布
→ 验证 Commit 与 Build Gate
```

### 权限边界

在仓库 Owner 授权下，数字研究员可以：

- 发现并阅读公开来源；
- 维护 Research Queue；
- 创建和编辑 Research Notes；
- 创建视觉资产与 Metadata；
- 创建 Git Branch 与 Pull Request；
- 响应 CI 发现的缺陷；
- 提交并合并通过验证的出版物；
- 从权威分支重新读取文件完成验证。

它不得：

- 虚构来源、引用、数据或工程证据；
- 把厂商声明当成独立验证事实；
- 跳过 Research Queue、Evidence 或 Publication Editing 门禁；
- 绕过失败的仓库构建；
- 在没有直接证据时宣称网站部署已经完成；
- 通过无关的研究流程静默修改 TMPA 正式出版物。

## 生产架构

```text
Scheduler / Human Work Request
            ↓
Research Queue
            ↓
Research OS Engine
            ↓
Research Skills 01–08
            ↓
Research Note Standard
            ↓
GitHub Branch
            ↓
Pull Request + VitePress CI
            ↓
main
            ↓
GitHub Pages + Research Center
```

GitHub 不是最终备份位置，而是正式工作层和出版层。Markdown、Metadata、Commit、Pull Request、CI Result 与 Diff 共同构成可持久验证的运行记录。

## Production Test V1

V1.0 不是通过设计评审后直接宣布发布，而是先完成了一次真实生产测试。

### 测试产出

Production Test 实际创建了：

- 3 个 Daily Research 对象；
- 3 个 Academic Observation 对象；
- 6 篇英文 Research Notes；
- 6 篇简体中文 Research Notes；
- 6 张独立 SVG Cover；
- 5 份生产治理记录；
- 23 个新增文件；
- 3,105 行新增内容；
- 0 个文件删除。

六个研究对象覆盖三个正式栏目：

| 栏目 | Daily Research | Academic Observation |
|---|---|---|
| Digital Employee | Computer Use Action–State Loop | OSWorld 与执行结果验证 |
| Industry Architecture | A2A 与 MCP 的互操作边界 | NIST AI RMF 治理运行循环 |
| Open-source Engineering | Manager 与 Handoff 的所有权模型 | SWE-bench Verified 与 Benchmark 质量 |

### 真实发布故障与恢复

第一次 Pull Request Build 没有通过。原因是 A2A/MCP 英文文章的 YAML Frontmatter 中，`summary` 含有一个未加引号的冒号，VitePress 拒绝构建整个出版包。

系统没有绕过门禁。该 Metadata 缺陷被修复，第二次 CI 重新执行，VitePress Build 通过后才允许合并。

这次失败本身就是发布证据：它证明 Publication Editing 与 Repository CI 是真实控制，而不是文档里的口号。

### 已验证的发布链路

```text
Production Branch
→ Pull Request #8
→ CI 发现失败
→ 修复 YAML 缺陷
→ 第二次 CI Build PASS
→ Squash Merge 到 main
→ 读取 Release Commit
→ 从 main 重新读取代表性文件
```

Production Test 发布 Commit：

```text
22927bbb77f7bd4a47150a6bb8c5f00ccf0b1bf1
```

## V1.0 已经证明的能力

V1.0 证明，在一次活动的 ChatGPT 应用执行中：

1. Research Skills 可以作为协调一致的生产管线运行；
2. Daily Research 与 Academic Observation 可以作为两种不同工作流生产；
3. 数字研究员可以维护独立的中英文出版质量；
4. GitHub Branch、PR、CI、修复、Merge 与 Commit Verification 可以形成一条完整可追踪的发布链；
5. 无效 Metadata 能被真实 Build Gate 阻断，并在 Release 前修正；
6. Research Center 可以根据 Markdown Metadata 自动发现和展示产出。

## 当前验证边界

V1.0 有意把以下两项能力与当前生产结论分开记录。

### 无人值守的定时执行

Daily、Weekly、Academic、Queue、Knowledge 与 Architecture 自动任务已经配置。V1.0 的主要生产证据仍然来自一次活动的交互式执行，而不是独立的无人值守定时运行。后续验收应记录：某个 Schedule 自行触发、完成研究、写入 GitHub，并在没有活动交互会话的情况下验证 Commit。

### 外部网站页面刷新

仓库已经配置在 `main` Push 后执行的 GitHub Pages Workflow。Production Test 直接验证了写入 `main` 和 PR 阶段的 VitePress Build；外部 Pages 是否完成刷新仍应作为独立 Deployment Observation，而不能只根据 Source Commit 推断。

保留这些边界并不会降低已经验证的 Research-to-GitHub 能力，而是避免系统宣称没有直接证据的能力。

## 与整体体系的关系

### Research Operating System

定义研究哲学、生命周期、Skills、Queue、Workflow、Evidence、Automation 与 Publication 规则。

### 研究报告生产机

把 Research OS 转换为一个能够实际工作的数字研究员和可识别的产品。

### TMPA

提供围绕持久 Role、Authority、Event、Lifecycle、Evidence、Integrity 与 AI 工作确定性重建的治理研究。

### CodeFlowMu

是正在发展的数字员工开发与工作 Runtime。研究报告生产机当前是一个 ChatGPT 应用案例；它的运行经验可以继续进入更加通用的数字员工 Runtime。

## 正式证据

- [Production Test V1 Report](https://github.com/joinwell52-AI/joinwell52/blob/main/research/production-tests/production-test-v1/REPORT.md)
- [Runtime Record](https://github.com/joinwell52-AI/joinwell52/blob/main/research/production-tests/production-test-v1/RUNTIME-RECORD.md)
- [Release Checklist](https://github.com/joinwell52-AI/joinwell52/blob/main/research/production-tests/production-test-v1/RELEASE-CHECKLIST.md)
- [Frozen File Manifest](https://github.com/joinwell52-AI/joinwell52/blob/main/research/production-tests/production-test-v1/FILE-MANIFEST.md)
- [Production Pull Request #8](https://github.com/joinwell52-AI/joinwell52/pull/8)
- [Production Release Commit](https://github.com/joinwell52-AI/joinwell52/commit/22927bbb77f7bd4a47150a6bb8c5f00ccf0b1bf1)
- [Research Skills](https://github.com/joinwell52-AI/joinwell52/tree/main/research/skills)

## 正式定位

> **研究报告生产机，是一个经过生产验证、基于 ChatGPT 的数字研究员。它通过 Research OS、Research Skills、Research Queue、Evidence Governance 与 GitHub-first Publication Workflow，承担一个明确的 Research Analyst 岗位。**

对应的数字员工原则是：

> **数字员工不是一个会聊天的 AI，而是一个拥有岗位、职责、技能、工作流、标准、权限边界和可验证工作成果的持续工作者。**
