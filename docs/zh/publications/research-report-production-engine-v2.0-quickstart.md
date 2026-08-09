---
title: 研究报告生产机 V2.0 快速开始
description: 安装、验证并运行依赖驱动、可恢复、自校验的 Research Runtime V2.0。
outline: deep
---

# 研究报告生产机 V2.0 快速开始

## 1. 获取与基础验证

```bash
git clone https://github.com/joinwell52-AI/joinwell52.git
cd joinwell52
npm install
npm run runtime:validate
npm run docs:build
```

## 2. 先理解事实源

不要用“Actions 有没有绿”代替 Runtime 状态。按以下顺序检查：

1. `research/runtime/SCHEDULER.json`：正式任务、时间、Family；
2. `research/runtime/records/...`：机器事实状态；
3. `research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md`：人类可读复合账本；
4. GitHub Actions：只确认 heartbeat、状态持久化和校验是否执行。

## 3. Daily 顺序

```text
Discovery → Queue → Reading → Analysis → Production → Publication
```

周日 Publication 完成后再运行 Weekly。任何后置任务不得越过未完成前置任务。

## 4. 漏班恢复

正常情况下无需手工指定“现在该补哪个”。Scheduler heartbeat 会：

- 找到已经到时的任务；
- 检查 durable status；
- 检查前置依赖；
- 识别依赖已解除的 Blocked；
- 每次只打开最早的一个可执行欠班。

如果需要人工恢复，仍应从最早未完成依赖开始，不得直接跳到当前钟点对应阶段。

## 5. 自检

恢复或调度后至少验证：

```bash
npm run runtime:validate
node scripts/runtime-markdown.mjs render --date YYYY-MM-DD
node scripts/runtime-markdown.mjs validate --date YYYY-MM-DD
```

同时检查：机器 `taskStatus`、Markdown 状态、`Execution Slot Opened` 时间线和 durable Git commit 是否一致。

## 6. Blocked 恢复

依赖型 Blocked 应带 `blockedBy`。依赖完成后由 Scheduler 受控 reopen；不要删除 Blocked 历史事件，也不要手工把它改成 Completed。

## 7. 周日检查

周日当天应有 7 个任务：六个 Daily 阶段加 20:30 Weekly。若页面只显示 6 个，应检查 Weekly family record / projection，而不是修改 Daily 六阶段定义。

## 8. 故障处理原则

```text
确认事实
→ 找最早缺口
→ 修前置依赖
→ 自检
→ 持久化并 Verify
→ 再推进下一阶段
```

禁止为了“赶进度”同时打开多个依赖阶段。
