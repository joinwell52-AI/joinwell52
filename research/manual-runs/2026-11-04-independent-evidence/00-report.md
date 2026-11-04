# 2026-11-04 叙述与独立证据：公开实验记录

## 主张与来源

本实验比较一份自称“已批准、测试通过”的合成 PM 报告，与 CodeFlowMu 的执行观察和 FCoP 的独立 REVIEW 工件。灵感来自尚未合入的 [SWE-bench #712](https://github.com/SWE-bench/SWE-bench/pull/712) 和尚未由维护者确认的 [Orkas #174](https://github.com/Orkas-AI/Orkas/issues/174)。本实验没有复现两者的故障。

固定源码：[CodeFlowMu `0d2d4e7`](https://github.com/joinwell52-AI/codeflowmu/tree/0d2d4e742ef2f3cb48e3ce09cc47f0c03053dc5f)，受测 `EvalObservationGenerator.ts` blob `f080b6c3e3836e537a780410e7ca4002c1822bd1`；[FCoP `a964d0df`](https://github.com/joinwell52-AI/FCoP/tree/a964d0df8ea09f76e7d7f3257052c411105cfcdc)，受测 `project.py` blob `d961c698b02a993e03c2da36b3c5bfc1fe35a430`。

## 可重跑探针

- [CodeFlowMu 探针](probe_eval_claim_vs_action.mjs)：在具备上述版本依赖的环境中执行 `CFM_ROOT=/path/to/codeflowmu npx tsx probe_eval_claim_vs_action.mjs`。Windows PowerShell 可设置 `$env:CFM_ROOT='D:\codeflowmu'` 后，以该仓库的 `tsx.cmd` 执行。脚本直接调用 `buildEvalObservationAnalysisFromRows()`，不启动 Agent。
- [FCoP 探针](probe_fcop_report_vs_review.py)：在具备上述版本的环境中设置 `PYTHONPATH=/path/to/FCoP/src` 后运行。脚本只写临时目录，调用真实 `Project` API。

三组 CodeFlowMu 输入的报告正文相同，均称已批准且测试 PASSED。差异只在传入的 Action Evidence 行。

| 执行记录 | 实际观察 | 决议 |
| --- | --- | --- |
| 无 | 子任务缺执行记录；风险 high；成功进程 0 | `draft`，`reviewed_by=null` |
| 失败测试进程 1，product failure 1 | 风险 high；失败没有被报告文字覆盖 | `draft` |
| 成功测试进程 1，行内断言主张 78 | `successful_tests=null`，只声称 `outer_process_only` | `draft` |

FCoP：写含 `APPROVED` 的 REPORT 后 REVIEW 文件 0；单独调用 `write_review(... decision='needs_human')` 后 REVIEW 文件 1。两个路径不同，记录决议仍为 `needs_human`。

## 验证与边界

CodeFlowMu 既有 EvalObservationGenerator 定向测试 **18/18** 通过；FCoP `test_project_reviews.py` **26/26** 通过。这些回归没有替代本次三组对照。

输入全是合成行与临时工件；没有真实 Agent、工具调用、外部副作用或人工批准。CodeFlowMu 探针从行级分析入口进入，未检验 Action Evidence 的上游采集是否可被 stdout 污染。FCoP 探针仅证明 REPORT 文字不能自发产生 REVIEW，不证明 REVIEW 作者真的核验执行效果。本实验不能推出 SWE-bench 的修复结果，也不能证实 Orkas 的实际传输或泄漏。
