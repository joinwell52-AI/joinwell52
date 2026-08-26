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

这不是原始运行日志，也不是产品可靠性报告。它是四篇工程案例所引用事实的**公开、脱敏证据包**：读者可以查看每一次失败、修复和复验的顺序，检查每个数字属于哪一组测试，并知道它不能证明什么。

- [下载证据包 v2（ZIP）](/evidence/execution-boundary-20260826/execution-boundary-four-cases-public-evidence-dossier-20260826-v2.zip)
- [校验 ZIP 的 SHA-256](https://raw.githubusercontent.com/joinwell52-AI/joinwell52/main/docs/public/evidence/execution-boundary-20260826/execution-boundary-four-cases-public-evidence-dossier-20260826-v2.zip.sha256)
- [查看 A1：门禁失败→修复→复验](/evidence/execution-boundary-20260826/v2/case-a1-gate-run-trace.csv)
- [查看 A2：旁观核查语义前后差异](/evidence/execution-boundary-20260826/v2/case-a2-observer-semantic-trace.csv)
- [查看 A3：历史投影与重复提交](/evidence/execution-boundary-20260826/v2/case-a3-projection-precedence-trace.csv)
- [查看 A4：恢复时间线与验证](/evidence/execution-boundary-20260826/v2/case-a4-recovery-timeline.csv)
- [阅读数据包说明](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/v2/README.md)

## 如何读这些数字

每一行的分母只属于它列出的测试集合，不能相加为一个“大通过率”。`PASS` 只表示某项指定命令、指定环境或指定现场快照通过；首次失败、阻断和未覆盖问题同样被保留。四个 CSV 是证据主体，汇总表只是导航。

## 证据包里到底有什么

它不是把“87/87”换一张表再写一遍。每个案例都包含三层可检查材料：

1. **逐轮事件记录**：先发生的失败、修复后重复验证、现场检查的顺序。
2. **脱敏后的测试与运行输出摘录**：保留命令、退出码、断言数量、失败原因与关键返回值；所有删去的位置会以方括号标出，不把删减伪装成原文。
3. **主张—证据映射与完整性清单**：文章每个关键判断对应哪一份摘录、哪一行记录，以及受限原始材料的 SHA-256。

因此读者能够区分三件事：实际出现过什么问题、修复后哪一组检查通过、以及这些检查仍然没有证明什么。

| 案例 | 公开数据记录的关键过程 | 这组数据支持什么 | 它不支持什么 |
| --- | --- | --- | --- |
| 调用时门禁 | 87/87 定向通过；两轮全量回归和两轮受控检查中各保留一次失败 | 提醒被误当禁令的错误被发现、修复并在指定集合复验 | 所有工具调用已具备授权回执，或全系统可靠性为 100% |
| 旁观核查 | 8/8、6/6、109/109、18/18 指定检查通过 | 重复的事实核查不会迁移任务生命周期 | 所有未来 UI 或插件都没有越权路径 |
| 失败与交付 | 55/57 首轮失败，修复后 57/57、14/14、221/221 | 历史记录与当前投影的优先级获得指定回归覆盖 | 任意失败都会无损传播到所有界面 |
| 在线与恢复 | 受限恢复授权、两项下游任务恢复、78 项修复断言 | 在线、活性、合法派工、验收是不同事实 | 任一时间戳单独证明前置条件已满足或未满足 |

## 脱敏方式与边界

数据包移除了任务正文、提示词、个人身份、机器进程号、绝对路径、凭据、原始日志、未公开代码和受限证据包的可定位细节。案例使用公开别名 A1–A4；计数、顺序、测试范围和“支持／不支持”边界予以保留。

原始第一方材料处于受限工作区，不能对外下载。因而这份数据包用于复核文章中的**统计口径与论证边界**，不构成可独立重放的源代码或安全审计证明。
