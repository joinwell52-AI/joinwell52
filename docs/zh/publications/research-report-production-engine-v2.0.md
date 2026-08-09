---
title: 研究报告生产机 V2.0
description: 基于 Runtime Center V5、Scheduler V3.0、依赖驱动恢复、自检与 GitHub First 的可恢复数字研究员生产系统。
outline: deep
---

<ArticleCover
  image="/assets/covers/research-report-production-engine-v1.svg"
  kicker="数字员工工场 · 当前能力发布"
  title="研究报告生产机 V2.0"
  summary="从按时触发的研究生产线升级为依赖驱动、可追赶、可恢复、自校验的数字研究员 Runtime。"
  version="V2.0"
  status="2026-08-09 · Current Capability Release"
  languageHref="/en/publications/research-report-production-engine-v2.0"
  languageLabel="English"
/>

## 一句话定义

**研究报告生产机 V2.0** 是一个以 GitHub 为事实源、由 ChatGPT Worker 执行研究工作的数字研究员 Runtime。GitHub cron 只负责唤醒；`SCHEDULER.json + Runtime Record` 决定现在真正应该执行什么。系统能够发现漏班、从最早未完成阶段按依赖顺序追赶、在依赖解除后恢复可重试的 Blocked 班次，并在每次状态变更后执行机器记录与人类账本自检。

## V2.0 为什么是大版本

V1.x 证明了情报发现、三栏选题、研究技能、15:00 Production、20:00 Publication 与 GitHub Commit Verify 可以组成真实生产线。V2.0 解决的是另一类问题：**生产线本身如何在调度延迟、历史结果异构、依赖未完成和中途阻塞时继续正确运行。**

```text
V1.x: time-triggered production line
              ↓
V2.0: dependency-driven recoverable runtime
```

V2.0 不再把“某个 cron 被触发”视为任务事实，也不允许后置班次因为时间到了就越过前置班次。

## 正式 Daily Runtime

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

周日还有第七个当天任务：

```text
20:30 Weekly
  → Weekly Synthesis
```

因此周日运营账本必须显示 **7 个任务**。

## 核心变化一：cron 是唤醒信号，不是真相源

GitHub Actions 的 schedule 可能延迟或漏掉单次 heartbeat。V2.0 不要求某一个 cron 准时到达，而是每次 heartbeat 都重新读取事实源：

```text
SCHEDULER.json
+ Runtime Record
+ 当前 Asia/Shanghai 时间
        ↓
哪些班次已经到时？
哪些仍然 Waiting？
哪些依赖已经 Completed？
哪些 Blocked 已经解除依赖？
        ↓
只打开最早的一个可执行欠班
```

heartbeat 使用错峰分钟，降低整点拥塞风险；即使连续漏掉多个 heartbeat，下一次恢复时仍能追赶，而不是把任务视为过期。

## 核心变化二：严格依赖顺序

Daily 与 Sunday Weekly 的恢复链为：

```text
Discovery
→ Queue
→ Reading
→ Analysis
→ Production
→ Publication
→ Weekly (Sunday)
```

规则：

- Queue 只有在 Discovery `Completed` 后才可启动；
- Reading 只有在 Queue `Completed` 后才可启动；
- Analysis 只有在 Reading `Completed` 后才可启动；
- Production 只有在 Analysis `Completed` 后才可启动；
- Publication 只有在 Production `Completed` 后才可启动；
- Sunday Weekly 只有在 Publication `Completed` 后才可启动。

时间到了但依赖未完成时，Scheduler 不越级执行。

## 核心变化三：Blocked 可以是可恢复状态

`Blocked` 不再一律等于永久终态。依赖型阻塞必须记录机器可读的依赖，例如：

```json
{
  "status": "Blocked",
  "blockedBy": "reading"
}
```

当 `reading` 后来变为 `Completed`，Scheduler 可以用受控的 `reopen-blocked` 路径重新打开 Analysis。普通 Blocked、Completed、Failed、Skipped 不会被任意重开。

这使恢复成为显式状态转换，而不是人工删除旧结果或伪造 Completed。

## 核心变化四：按次序补工作

V2.0 的补班原则不是“现在几点就跑哪个”，而是：

1. 枚举当天已到正式时间的任务；
2. 读取每个任务的 durable status；
3. 排除 Running、Completed、Failed、Skipped；
4. 对 Waiting 检查前置依赖；
5. 对 Blocked 检查它是否属于依赖型阻塞，以及依赖是否已经 Completed；
6. 按正式时间排序；
7. **一次 heartbeat 只恢复最早的一个可执行班次**；
8. 后续 heartbeat 继续向后追赶。

这样即使系统停了数小时，也不会同时打开 Reading、Analysis、Production 造成新的竞态。

## 核心变化五：自我检查

每次打开或恢复执行槽后必须执行自检：

```text
Runtime V5 validate
→ Markdown ledger render
→ Markdown ledger validate
→ durable Git commit
→ fetch / ancestor verify
→ taskStatus == Running verify
→ Execution Slot Opened event verify
```

班次完成时仍必须满足 `runtime-shift-result/v2`：

```text
Input
Work Result
Output
Next
Metrics
Evidence
Artifacts
```

V2.0 同时兼容仓库已经存在的两类合法结果表达：扁平双语字段和结构化 V5 narrative；历史合法结果不能反过来把 Scheduler 控制面卡死。

## 人类账本也是检查面

机器 JSON 是事实源，人类可读 Markdown 是强制投影。投影器必须正确处理结构化 narrative、legacy metric name、字符串 evidence/artifact 和对象 evidence/artifact。

以下内容视为投影故障：

```text
[object Object]
空 Evidence 占位替代真实来源
机器状态与 Markdown 状态不一致
缺少 Execution Slot Opened / terminal / Commit Verify 时间点
```

## 2026-08-09 Recovery Case

V2.0 的恢复机制来自一次真实生产故障，而不是预设演示。

当天是周日，应运行 7 个任务。09:00 Discovery 与 10:00 Queue 已完成，但 11:00 Reading 未被正常打开；13:00 Analysis 随后在 Reading 未完成时被打开，并按门禁正确产生 Blocked 结果。进一步排查发现：

- GitHub schedule heartbeat 曾出现长时间间隙；
- Scheduler 已能识别 Reading 欠班，但 Runtime V5 校验器不能兼容仓库已有的结构化 shift result；
- Analysis 的 Blocked 若被当成永久终态，即使 Reading 后补完成也无法自动恢复；
- Markdown 投影对结构化 Queue result 会出现 `[object Object]`。

修复后：

- Runtime V5 接受现有合法 result 形态；
- Reading 被补开为 Running；
- Analysis 记录 `blockedBy: reading`；
- Scheduler 增加依赖门禁和 dependency-ready Blocked 重开；
- Markdown 投影恢复可读；
- 一次性 hotfix 文件被清理，正式逻辑只保留在 Runtime 与 Scheduler 中。

这次事故形成了 V2.0 的基本恢复原则：**先恢复事实，再恢复最早依赖，再验证，再向后推进。**

## Runtime 家族

V2.0 继续使用 Runtime Center V5 的四家族边界：

- Daily Runtime；
- Weekly Runtime；
- Academic Runtime；
- Research Program Runtime。

Program 不占用 Daily 栏目或 Daily 阶段。Academic 仍在周三 16:00 独立运行；Program 仍在周一 12:00 独立运行。

## 权威文件

```text
research/runtime/SCHEDULER.json
research/runtime/records/{family}/YYYY/MM/*.json
research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md
research/runtime/plans/YYYY/MM/YYYY-MM-DD-plan.json
scripts/runtime-v5.mjs
scripts/runtime-markdown.mjs
.github/workflows/research-runtime-scheduler.yml
```

## 下载与验证

```bash
git clone https://github.com/joinwell52-AI/joinwell52.git
cd joinwell52
npm install
npm run runtime:validate
npm run docs:build
```

运行中的真实状态应优先查看 Runtime Center 和当天 Markdown 账本，而不是仅看 Actions 是否出现绿色 Run。

## V1.3 与 V2.0

V1.3 保留为历史能力发布，不回写为 V2.0。V2.0 成为新的 Current Capability Release。

| 版本 | 运行模型 |
|---|---|
| V1.3 | Research Intelligence + 定时研究生产线 |
| **V2.0** | **依赖驱动 + 欠班追赶 + Blocked 恢复 + 自校验 Runtime** |

## 结论

研究生产系统真正的可靠性，不是保证每一个外部定时器永远准时，而是即使唤醒延迟、执行中断或依赖暂缺，系统仍能从 durable facts 判断“做到哪里、缺了什么、下一步只能做什么”，并留下可验证的恢复证据。
