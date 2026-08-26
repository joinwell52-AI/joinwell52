---
title: "执行边界四案例：公开脱敏数据包与统计口径"
date: '2026-08-26'
column: digital-employee
category: research-data
article_type: evidence-note
edition: research-center
summary: "四篇执行边界案例的公开、脱敏汇总：测试集合、首次失败、修复后验证与明确不支持的结论。"
sources: "第一方受限证据的公开脱敏汇总；原始日志与工作区路径不公开。"
project_relevance: case-evidence
lifecycle: Published
---

# 执行边界四案例：公开脱敏数据包与统计口径

这不是原始运行日志，也不是产品可靠性报告。它是四篇工程案例所引用数字的**公开、脱敏汇总**：读者可以下载数据文件、检查每个数字属于哪一组测试，并知道它不能证明什么。

- [下载数据包（ZIP）](/evidence/execution-boundary-20260826/execution-boundary-four-cases-public-data-20260826.zip)
- [校验 ZIP 的 SHA-256](https://raw.githubusercontent.com/joinwell52-AI/joinwell52/main/docs/public/evidence/execution-boundary-20260826/execution-boundary-four-cases-public-data-20260826.zip.sha256)
- [下载案例明细（CSV）](/evidence/execution-boundary-20260826/cases.csv)
- [下载机器可读摘要（JSON）](/evidence/execution-boundary-20260826/summary.json)
- [阅读数据说明（README）](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/README.md)

## 如何读这些数字

每一行的分母只属于它列出的测试集合，不能相加为一个“大通过率”。`PASS` 只表示某项指定命令、指定环境或指定现场快照通过；首次失败、阻断和未覆盖问题同样被保留。

| 案例 | 公开数据记录的关键过程 | 这组数据支持什么 | 它不支持什么 |
| --- | --- | --- | --- |
| 调用时门禁 | 87/87 定向通过；两轮全量回归和两轮受控检查中各保留一次失败 | 提醒被误当禁令的错误被发现、修复并在指定集合复验 | 所有工具调用已具备授权回执，或全系统可靠性为 100% |
| 旁观核查 | 8/8、6/6、109/109、18/18 指定检查通过 | 重复的事实核查不会迁移任务生命周期 | 所有未来 UI 或插件都没有越权路径 |
| 失败与交付 | 55/57 首轮失败，修复后 57/57、14/14、221/221 | 历史记录与当前投影的优先级获得指定回归覆盖 | 任意失败都会无损传播到所有界面 |
| 在线与恢复 | 受限恢复授权、两项下游任务恢复、78 项修复断言 | 在线、活性、合法派工、验收是不同事实 | 任一时间戳单独证明前置条件已满足或未满足 |

## 脱敏方式与边界

数据包移除了任务正文、提示词、个人身份、机器进程号、绝对路径、凭据、原始日志、未公开代码和受限证据包的可定位细节。案例使用公开别名 A1–A4；计数、顺序、测试范围和“支持／不支持”边界予以保留。

原始第一方材料处于受限工作区，不能对外下载。因而这份数据包用于复核文章中的**统计口径与论证边界**，不构成可独立重放的源代码或安全审计证明。
