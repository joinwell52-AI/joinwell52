---
title: "证据包：批准对象与动作身份"
outline: deep
---

<ArticleTableScroll language="zh" />

# 配套证据：批准对象与动作身份

本包配合[中文正文](/zh/engineering/2026-09-04-approval-operation-identity)使用。[English guide](/en/research/evidence/2026-09-04-approval-operation-identity)。性质：**公开配套的受控实验记录；不是修复回执或独立 QA。**

## 怎么读

本包提供原研究记录的去标识摘取，不是假装重新运行的结果。所有观察固定在 CodeFlowMu 提交 `fdadbed489129455437f25202a03bae6e0c2e822`，实验日期为 2026-09-04。

| 正文主张 | 记录位置 | 校验及预期 | 支持范围 |
|---|---|---|---|
| 既有保护两轮通过 | `observations.json → baseline_tests` | 每轮 31 tests/pass，fail/skip=0，退出 0 | 选定四个测试文件，不是全产品验收 |
| 同会话改分支消费旧批准 | `approval_matrix` 中 `different-target` | 两轮 ALLOW，consumed，重复为 APPROVAL_ALREADY_CONSUMED | 真实 Native gate；无命令执行 |
| 换成登记的唤醒 Session 失配 | `approval_matrix` 中 `delivered-resume` | 两轮 REQUIRE_APPROVAL，原授权 available | 受控会话输入，不证明完整 successor 准入 |
| 四种 Git 变化摘要一致 | `field_comparisons` 中 branch/remote/force/delete | 每种两轮 fingerprint/digest 相同，request_differences 空 | 摘要边界，不代表四种操作均消费/执行 |
| 嵌套 Session 造成摘要变化 | `field_comparisons` 中 new-session | fingerprint 相同、digest 不同；仅排除嵌套 Session 的内存反事实使 digest 相同 | 定位原因，不是产品补丁 |
| Codex resolution 接受改分支 | `codex_resolution` 中 changed-branch | 两轮 allow=true、授权 consumed；same-command 是正对照 | 本地真实 resolution 函数，不是在线 app-server 测试 |
| 同文 TASK 不替代指定依赖 | `lineage_controls` | 六种情况每种两轮，actual 符合 expected | FCoP gate 分支，不是全部关系图恢复 |

## 来源和核验方式

- [观察数据](https://joinwell52-ai.github.io/joinwell52/assets/approval-identity-20260904/evidence/observations.json)：逐轮结果及四个保留的断言失败。
- [来源定位](https://joinwell52-ai.github.io/joinwell52/assets/approval-identity-20260904/evidence/sources.json)：Codex PR 元数据，以及固定 CodeFlowMu 文件的 SHA-256。
- [完整性清单](https://joinwell52-ai.github.io/joinwell52/assets/approval-identity-20260904/evidence/manifest.json)：正文、双语说明和数据的文件摘要。
- [读取校验器](https://joinwell52-ai.github.io/joinwell52/assets/approval-identity-20260904/evidence/check-evidence.mjs)：运行 `node check-evidence.mjs`。

校验器依次检查文件完整性、实验集合、正反对照及文章所引用的比较。预期输出为 `RECORDED EVIDENCE CONSISTENT; PRODUCT COUNTEREXAMPLES REMAIN`。这表示记录与主张一致，**不是产品通过**。

原研究的完整 E1 探针因两类偏离各出现两次而退出 1；本包不会将它洗成通过。因果采集脚本的退出 0 也仅表示采集完成。31 项回归、22 次审批输入、14 次字段比较、4 次 resolution、12 次 lineage 观察是不同集合，不应相加为可靠率。

## 去标识规则

全部项目、任务和命令原本就是隔离合成夹具，没有客户事故记录。导出进一步将本机夹具路径替换为稳定的 `<SYNTHETIC_FIXTURE_...>` 标签，省略进程号码；保留顺序、轮次、时间、输入语义、输出、失败与原始摘要。标签不是可执行路径。

**保留的 operation digest 是原始观察值，不能用去路径后的 JSON 重新计算来验证它。** 校验器检查记录之间的等式/不等式及原始文件摘要引用；完整产品复跑需要原研究脚本、固定源码及相应依赖。本包的 reader 不是产品实验 runner，不依靠它证明因果或真实网络执行。

没有删除失败事实，也没有把 force/delete 摘要等价扩大为真实 Git 操作结果。原始研究中的工具使用错误、spec/TAP 计数修订及不完整调试轮不进入计数；相关限制在[正文第 6 节](/zh/engineering/2026-09-04-approval-operation-identity)及原研究记录中保留。本包只覆盖正文引用的完成轮次。

尚未执行真实推送、云模型、线上接管、掉电恢复或独立 QA。全文及证据说明中英文采用同一份机器可读数据。

## 下载后离线检查

[下载完整配套包（ZIP）](https://joinwell52-ai.github.io/joinwell52/assets/approval-identity-20260904/approval-identity-evidence.zip)，解压后进入 evidence 目录运行 `node check-evidence.mjs`。请保留完整目录结构；单独下载脚本不足以完成文件完整性检查。
