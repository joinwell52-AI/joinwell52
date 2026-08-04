---
title: Research Runtime Center V4
publication: specification
document_version: V4.0
status: Released
language: zh
updated: 2026-08-04
---

# Research Runtime Center V4

## 数字研究员的完整日生产线

Research Runtime Center V4 将 Research Center 的自动运行升级为一条可观察、可汇报、可验证的数字研究员生产线：

```text
09:00  Research Runtime Engine
10:00  Research Runtime Queue + 三栏研究计划
11:00  Research Runtime Knowledge
15:00  Research Runtime Production
20:00  Research Runtime Publication
```

周一 12:00 运行架构评审；周日 20:30 运行每周综合；周三 10:00 运行学术研究。

## V4 的三个核心变化

### 1. 三个栏目分别选题

Research Runtime Queue 不再只输出一个 Queue ID，而是必须分别对三个长期栏目作出决定：

- **数字员工**；
- **行业架构**；
- **开源工程**。

每个栏目每天必须显示：今日选题或未选题、判断原因、主要来源、优先级、生命周期与下一步。

权威数据写入：

```text
research/runtime/plans/YYYY/MM/YYYY-MM-DD-plan.json
```

### 2. 新增 15:00 生产班次

Research Runtime Production 统一执行：

```text
Skill 05 — Research Writing
→ Skill 06 — Visualization
→ Skill 07 — Evidence & Citation
→ Skill 08 — Publication Editing
```

它产出的是一份完整的 **Publication Candidate（出版候选）**，不是未完成草稿。候选必须具备完整中英文报告、有效元数据、栏目归属、配图决策、证据与引用校验，以及完成的出版编辑。

权威数据写入：

```text
research/runtime/candidates/YYYY/MM/YYYY-MM-DD-candidates.json
```

### 3. 20:00 只负责发版

Research Runtime Publication 只消费完整出版候选，负责：

- 写入中英文公共文章路径；
- 更新 Metadata、Index 与 Website；
- 创建 GitHub Commit；
- 直接验证 Commit 与发布路径；
- 将对象推进到 Release。

发布班次禁止重新发现来源、分析主题、撰写完整正文或修补薄弱证据。

## 八个正式 Runtime 任务

| Runtime | 时间 | 正式成果 |
|---|---:|---|
| Research Runtime Engine | 每日 09:00 | 一个受治理的生命周期转换与持久研究产物 |
| Research Runtime Queue | 每日 10:00 | 研究队列与三栏每日研究计划 |
| Research Runtime Knowledge | 每日 11:00 | Knowledge 准入、关系与架构候选 |
| Research Runtime Architecture | 周一 12:00 | 架构与生命周期裁定 |
| **Research Runtime Production** | **每日 15:00** | **完整中英文出版候选** |
| Research Runtime Publication | 每日 20:00 | GitHub 与网站正式发版及验证 |
| Research Runtime Weekly | 周日 20:30 | 新的每周综合与工程判断 |
| Research Runtime Academic | 周三 10:00 | 论文、基准、规范、会议与机构研究 |

## 运营中心展示

V4 运营中心按以下层级展示数字研究员工作：

1. 今日三栏研究计划；
2. 今日每个定时任务的输入、工作成果、输出、下一步与证据；
3. 15:00 形成的 Publication Candidates；
4. 20:00 的 Release 结果；
5. Runtime Record、GitHub Commit、Commit Verify 与工作日志；
6. 近期运营历史。

页面不维护第二套手工数据。所有信息来自 Scheduler、Runtime Record、Column Plan 与 Candidate Batch。

## 完成计算

只有 `Completed` 计入完成率：

```text
完成率 = Completed 任务数 ÷ 当日计划任务数
```

`Skipped` 表示任务实际运行但没有合格输出，必须说明原因，且不计入完成率。

## Scheduler 与数字员工 Worker 的边界

GitHub Scheduler 负责按时间打开执行槽并初始化运行产物。真正的研究写作、配图、引用校验和出版编辑由基于 ChatGPT 的数字研究员 Worker 执行。

因此：

> 定时触发不等于工作完成。

没有 Worker 执行和成果验证时，任务必须保持 `Waiting`、`Blocked` 或 `Failed`，不得制造 `Completed`。

## 最高原则

> 三个研究栏目每天都必须得到明确的选题决定。

> 下午生产完整报告，晚上只负责正式发版。

> 每个定时任务都必须汇报真实工作成果，而不是只汇报执行状态。

> 没有 Runtime Record 与 Commit Verify 的发布，不属于正式运行结果。
