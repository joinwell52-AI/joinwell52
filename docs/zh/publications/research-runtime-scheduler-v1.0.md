---
title: Research Runtime Scheduler V1.0
 description: Research Runtime Scheduler 的首个正式发布记录；当前运行基线已经升级到 Scheduler V2.0 与 Runtime Center V4。
outline: deep
---

<ArticleCover
  image="/assets/covers/research-runtime-scheduler-v1.svg"
  kicker="数字员工工场 · Runtime 历史发布"
  title="Research Runtime Scheduler V1.0"
  summary="Research Operating System 首个正式调度器与运行控制平面发布记录。"
  version="V1.0"
  status="2026-08-02 发布 · Historical Release"
  languageHref="/en/publications/research-runtime-scheduler-v1.0"
  languageLabel="English"
/>

::: info 当前运行基线
当前正式运行体系已经升级为：

- **Research Runtime Center V4**；
- **Research Runtime Scheduler V2.0**；
- **研究报告生产机 V1.3**；
- **Research Intelligence System V1.0**；
- 八个正式 Runtime 任务，新增每日 15:00 Production；
- 20:00 Publication 只负责完整候选的 GitHub 与网站发版。

[查看当前 V4 运行规范 →](/zh/runtime/v4)  
[查看研究报告生产机 V1.3 →](./research-report-production-engine-v1.3)
:::

## V1.0 的历史意义

Research Runtime Scheduler V1.0 首次把 Research Runtime Center 建立为 Research Operating System 的正式运行控制平面。

它确立了以下原则：

- Research Runtime 而不是单个自动任务，是数字研究员的运行控制平面；
- GitHub Scheduler 只负责打开执行槽，不得制造完成事实；
- 正式执行必须写入 Runtime Record；
- 只允许 `Running`、`Completed`、`Blocked`、`Failed`、`Skipped`、`Waiting` 六种状态；
- 正式发布必须形成 GitHub Commit 与 Commit Verify；
- 没有 Runtime Record 的发布不属于正式运行结果。

## V1.0 发布元数据

| 字段 | 内容 |
|---|---|
| 能力 | Research Runtime Scheduler |
| 历史版本 | V1.0 |
| 发布日期 | 2026-08-02 |
| 时区 | `Asia/Shanghai` |
| 当时数字研究员 | 研究报告生产机 V1.0 |
| 当前数字研究员 | [研究报告生产机 V1.3](./research-report-production-engine-v1.3) |
| 唯一事实源 | GitHub 仓库 `joinwell52-AI/joinwell52` |
| Runtime Record | `research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md` |

## V1.0 的七个任务

V1.0 以七个正式任务为基线：Engine、Queue、Knowledge、Architecture、Publication、Weekly、Academic。

该版本尚未包含独立的 15:00 Production，因此写作、配图、证据与出版编辑没有形成单独的下午生产班次。

## 从 V1.0 到 V2.0

Scheduler V2.0 增加并明确：

```text
09:00 Engine
10:00 Queue + Research Intelligence + 三栏选题
11:00 Knowledge
周一 12:00 Architecture
15:00 Production → 完整 Publication Candidate
20:00 Publication → GitHub + Website + Commit Verify
周日 20:30 Weekly
周三 10:00 Academic
```

同时引入：

- 三条情报发现管线；
- 三个栏目分别选题；
- 每个定时任务的结构化工作成果；
- 三栏计划；
- Publication Candidate 批次；
- 运营中心自动投影。

## V1.0 Runtime Gate

```text
Research Runtime
→ Runtime Record
→ GitHub Commit
→ Commit Verify
→ Official Publication
```

V2.0 在此基础上进一步把 Production Candidate 作为 15:00 与 20:00 之间的正式交接对象。

## 当前权威实现

- [Research Runtime Center V4](../runtime/v4)
- [Research Intelligence System V1.0](../runtime/research-intelligence)
- [Runtime Charter](https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/README.md)
- [Scheduler V2.0 Manifest](https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/SCHEDULER.json)
- [Worker Contracts V2](https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/WORKER-PROMPTS-V2.md)
- [V1.0 Historical Release Record](https://github.com/joinwell52-AI/joinwell52/blob/main/research/releases/research-runtime-scheduler-v1.0/RELEASE.md)
