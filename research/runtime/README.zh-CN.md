# Research Runtime Center V5.0 — 冻结运行章程

**项目：** joinwell52 Research Center  
**调度器：** Research Runtime Scheduler V3.0  
**运营中心：** V5.0  
**架构状态：** V5.0 完成后冻结  
**生效日期：** 2026-08-05  
**时区：** `Asia/Shanghai`  
**唯一事实源：** `joinwell52-AI/joinwell52`

## 1. V5 边界

Research Runtime Center V5.0 将运行体系彻底拆分为四套：

1. **Daily Runtime**：当天发现、当天研究、当天生产、当天发布。
2. **Weekly Runtime**：基于本周 Daily Research 形成新的每周综合判断。
3. **Academic Runtime**：只处理论文、基准、规范与机构。
4. **Research Program Runtime**：负责 TMPA、FCoP、CodeFlowMu、Digital Employee 与 Research Operating System 的长期研究。

Research Program 不得占用 Daily Runtime 的阶段、栏目或生产时间。

## 2. Daily Runtime 完整闭环

```text
09:00 Discovery
  → Signal Pool
10:00 Queue
  → Today's Research Plan
11:00 Reading
  → Reading Result
13:00 Analysis
  → Research Object
15:00 Production
  → Publication Candidate
20:00 Publication
  → GitHub + Website + Commit Verify + Release
```

Daily Runtime 必须对三个栏目分别作出 `Selected` 或 `No Selection` 决定：

- Digital Employee（数字员工）；
- Industry Architecture（行业架构）；
- Open-source Engineering（开源工程）。

### 阶段门禁

- Reading 只能消费当天已选对象；
- Analysis 只能消费 Reading Result；
- Production 只能消费 Research Object；
- Publication 只能消费完整 Publication Candidate；
- Publication 禁止重新研究、实质性重写或补救证据。

## 3. 三套独立运行

### Weekly Runtime

每周日 20:30 运行。输入为过去七天已经完成证据核验的 Daily Research，输出新的 Trend、Architecture、Engineering 与 Prediction 判断。禁止复制或拼接 Daily 文章。

### Academic Runtime

每周三 16:00 运行。允许的主要研究对象只有 Paper、Benchmark、Specification 与 Institution。普通产品新闻和一般行业新闻不得进入 Academic Runtime。

### Research Program Runtime

每周一 12:00 运行。分别推进以下长期 Program 的独立队列与生命周期：

- TMPA；
- FCoP；
- CodeFlowMu；
- Digital Employee；
- Research Operating System。

Program 拥有自己的 Queue、Research、Review 与 Publication，不再进入 Daily Runtime。

## 4. Scheduler V3.0

权威机器清单为 [`SCHEDULER.json`](./SCHEDULER.json)。正式任务共九个：

| 体系 | 正式任务 | 时间（Asia/Shanghai） |
|---|---|---:|
| Daily | Research Runtime Discovery | 每日 09:00 |
| Daily | Research Runtime Queue | 每日 10:00 |
| Daily | Research Runtime Reading | 每日 11:00 |
| Daily | Research Runtime Analysis | 每日 13:00 |
| Daily | Research Runtime Production | 每日 15:00 |
| Daily | Research Runtime Publication | 每日 20:00 |
| Weekly | Research Runtime Weekly | 周日 20:30 |
| Academic | Research Runtime Academic | 周三 16:00 |
| Program | Research Program Runtime | 周一 12:00 |

GitHub Actions 只负责打开执行槽；ChatGPT Worker 执行真正的研究工作。定时触发不等于任务完成。

## 5. 四类 Runtime Record

V5 分别维护：

```text
research/runtime/records/daily/YYYY/MM/YYYY-MM-DD-daily-runtime.json
research/runtime/records/weekly/YYYY/MM/YYYY-MM-DD-weekly-runtime.json
research/runtime/records/academic/YYYY/MM/YYYY-MM-DD-academic-runtime.json
research/runtime/records/program/YYYY/MM/YYYY-MM-DD-program-runtime.json
```

V4 历史记录保留在原路径并冻结，不改写成 V5 记录。

## 6. 班次成果合同

所有终态班次必须输出：

```text
Input
Work Result
Output
Next
Metrics
Evidence
Artifacts
```

机器合同为 `runtime-shift-result/v2`，并要求中英文结果一致。班次只要实际执行成功，即使受治理输出数量为 0，也必须记录为 `Completed`；`Skipped` 只用于当天明确不适用、因而没有执行的班次。

参见：

- [`RUNTIME-RECORD-SCHEMA-V5.zh-CN.md`](./RUNTIME-RECORD-SCHEMA-V5.zh-CN.md)
- [`WORKER-CONTRACT-V3.zh-CN.md`](./WORKER-CONTRACT-V3.zh-CN.md)

## 7. 网站与权威性

Runtime Dashboard 只展示当天 Daily Runtime。Weekly、Academic、Program 分别拥有独立入口，禁止把四套 Runtime 混合成同一条运行时间线。

GitHub 是唯一事实源。正式发布只有完成以下链路才算结束：

```text
Runtime Result
→ Durable Artifacts
→ GitHub Commit
→ Commit Verify
→ Website Projection
→ Release
```

## 8. 冻结规则

V5.0 完成后，四套 Runtime 的边界、Daily 六阶段顺序与 Scheduler V3.0 的正式任务身份冻结。后续只允许优化来源质量、Worker 性能、指标、页面体验与出版质量，禁止重新把 Program 与 Daily Runtime 混合。
