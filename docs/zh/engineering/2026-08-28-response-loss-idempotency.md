---
title: "工具报错后还能重试吗？从重复建单到可恢复的任务创建回执"
date: '2026-08-28'
updated: '2026-08-30'
column: open-source-engineering
category: daily
article_type: engineering-case-study
edition: research-center
research_question: "当副作用已经发生但响应丢失时，Agent Runtime 怎样区分安全重试、结果复用与冲突拒绝？"
summary: "同一响应丢失窗口中，历史版本的报告仍只有一份，任务却建了两张。CodeFlowMu 随后在 V2.1.1 基线上复现缺口，将持久提交身份、三阶段回执和冲突恢复落入 V2.1.2；独立 QA 的八路并发最终只产生一张 TASK。"
sources: "/zh/research/evidence/2026-08-28-response-loss-idempotency"
project_relevance: substantive-relationship
item_id: "RBE-20260828-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-28-response-loss-idempotency-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-28-response-loss-idempotency-cover.png"
  kicker="开源工程观察 · 故障复盘"
  title="工具报错后还能重试吗？从重复建单到可恢复的任务创建回执"
  summary="没有收到成功响应，不等于动作没有发生。修复的关键不是再试一次，而是找回第一次结果。"
  version="RBE-20260828-01"
  status="工程案例 · 2026-08-30 修订"
/>

# 工具报错后还能重试吗？从重复建单到可恢复的任务创建回执

一个工具调用返回异常，最危险的问题往往不是“要不要重试”，而是：第一次到底有没有执行成功？

任务已经写入磁盘，成功响应却在途中丢失。调用方恢复后重新提交，看起来只是补做一次失败请求，系统里却多出第二张任务。两个 Agent 可能因此接到内容相同、身份不同的工作。

CodeFlowMu 是我们开发的本地多 Agent 协作系统。我们把这个窗口分别放进报告写入和任务创建两条真实路径，得到了一正一反的结果：报告仍只有一份，任务却出现两张。

这使问题从“Runtime 有没有去重”收窄为：

> 第二次调用到来时，这个具体工具能不能从持久事实中找回第一次创建的结果？

最初的文章记录到工程合同冻结。2026 年 8 月 30 日，这条研究链已经走到实现、独立 QA 和 V2.1.2 母版正式发布。下面同时保留旧实验和修复后的观察，避免用一次版本更新抹掉问题是怎样被定位的。[证据与版本说明](/zh/research/evidence/2026-08-28-response-loss-idempotency)

## 同一个响应丢失窗口，报告和任务为什么不同

最初实验固定在 V2.0.4 提交 `2ba1ad9b`。它不是生产事故统计，而是故意制造“动作已经完成，调用方没有确认结果”的故障注入。

| 受测层次 | 实验观察 | 能说明什么 |
| --- | --- | --- |
| 上层内存去重 | 第一次动作发生，但成功结果未进入可复用缓存；恢复后相同调用再次进入执行路径 | 进程内缓存不能独自解决跨恢复的结果未知 |
| `write_report` | 相同任务、内容和提交标识重试，`deduplicated=true`，报告文件数为 1 | 受测报告路径已有持久结果复用 |
| `write_task` | 相同业务创建意图再次进入真实路径，分配新编号，TASK 数为 2 | 创建合同没有把稳定提交身份绑定到第一次结果 |

这里有一个不能省略的接口区别：当时 `write_report` 已暴露 `client_submission_id`，任务创建并没有对应的正式持久幂等合同。实验调用方把两次请求视为同一次业务提交，不等于底层创建接口已经承认并保存了这份身份。

所以问题不是“所有写工具都不安全”。恰恰相反，报告路径是重要的反例：上层允许再次执行，不代表底层一定产生重复对象。

![历史响应丢失实验：报告一份，任务两张](/assets/figures/2026-08-28-response-loss-comparison.zh.svg)

*图 1：V2.0.4 的历史故障对照，不是 V2.1.2 当前行为。图中计数只覆盖受测路径，不提供生产发生频率。来源：[RBE-20260828-A1 历史实验与版本说明](/zh/research/evidence/2026-08-28-response-loss-idempotency)，作者据此绘制。*

## LlamaIndex 提醒我们检查窗口，不替我们证明缺陷

研究的外部起点是 LlamaIndex 的 [PR #22841](https://github.com/run-llama/llama_index/pull/22841)，题为 `fix(core): avoid retrying failed function tools`。原文研究记录于 2026-08-28 核验其已合并状态。

它处理的是另一种具体实现：调用层先用一种参数形式真正执行 FunctionTool，遇到异常后又换一种形式执行。第一次可能已经产生副作用，异常却被当成“调用形式不对”的信号。

修复把参数形式的选择放到真实调用之前，通过函数签名判断，避免拿一次有副作用的执行去试探。原 PR 报告的测试分别为调用测试 4 passed、选定程序测试 3 passed，以及工具集合 67 passed / 4 skipped；这些是外部项目的结果，不能算入 CodeFlowMu 的验收。

共同问题是“异常发生时，副作用是否已经完成”，但不是同一个 Bug：

- LlamaIndex 消除的是调用形式回退导致的再次执行。
- CodeFlowMu 需要解决的是调用方失去成功响应后，创建结果无法通过稳定身份恢复。

因此我们没有照搬外部补丁，而是把故障模型放进自己的工具链。V2.1.1 基线 `36e5c83b` 上的修改前复跑再次确认：报告保护仍成立，任务创建缺口仍可复现，随后才实施创建回执。

## V2.1.2 把“一次提交”变成了可查询的持久事实

V2.1.2 的任务创建路径增加了以下关系：

`client_submission_id → request_digest → task_id / task_path → creation_result`

提交标识描述的是一次业务创建意图，不是某一次网络连接。调用方需要在重试时复用它；如果每次都生成新 ID，Runtime 仍会把它理解成新的提交。

请求摘要则防止另一种错误：同一个 ID 第一次要求 DEV 修复登录，第二次却要求 OPS 发布环境。如果只比较 ID，系统可能把不同任务误当成同一次重试。

实现中的摘要方案名为 `write-task-v1`。它从规范化后的 sender、recipient、subject、body、priority、thread_key、parent、references、depends_on、risk_level 等语义字段构造确定性 JSON，再计算 SHA-256。对象键排序，字符串统一 Unicode NFC 和换行，数组保留顺序；本次调用的时间、重试次数和 trace ID 不进入语义摘要。回执同时保存 `digest_schema_version`，版本或摘要不匹配时返回冲突，不静默重解释旧记录。

这是一份创建接口合同，不是 Runtime 通用事务引擎。既有 `write_report` 持久去重保持不变，FCoP 任务、报告和审查协议也没有因此改版。

## 三阶段回执封住“TASK 已有，响应未知”的窗口

只在 TASK 创建后补一个索引仍然太晚：进程可能刚写完 TASK 就崩溃，索引还没有落盘。V2.1.2 先占用提交身份，再创建任务，最后提交回执：

`reserved → task_created → committed`

| 状态 | 已有持久事实 | 恢复时怎样处理 |
| --- | --- | --- |
| `reserved` | 提交 ID、摘要版本、摘要、预分配任务身份与路径 | TASK 尚不存在时沿原身份继续；已存在且内容匹配时接管，不换号 |
| `task_created` | 已确认 TASK 创建及文件摘要 | 匹配时继续提交回执；文件反而消失时返回类型化冲突，不能当成“从没创建”再建 |
| `committed` | 可复用的机器可读创建结果 | 同 ID、同摘要返回第一次结果，不再次创建 |

提交级互斥与任务序号分配保护解决的是并发占位；原子持久化和恢复规则解决的是中间状态。目标路径存在但身份或内容不符，也不能通过覆盖或新建第二张任务来绕过。

对于长期停在中间状态的 reservation，系统还提供只读诊断，报告状态、任务是否存在、摘要是否匹配以及是否长期未推进。诊断不会因为超时自动删除回执，也不会自行重建或裁决任务。

## `reused` 是成功恢复，不是第二次执行

回执用机器字段区分三种结果：

| `disposition` | `action_taken` | 调用方应怎样理解 |
| --- | --- | --- |
| `created` | `true` | 本次完成首次创建 |
| `reused` | `false` | 请求的创建结果已经存在，返回原任务 |
| `conflict` | `false` | 同一提交身份与已有摘要或恢复事实冲突，没有新增 TASK |

`action_taken=false` 并不必然意味着业务请求失败。在 `reused` 场景里，它恰好说明：不再执行创建动作，也能取得已经成功的结果。这里的“成功”只指任务对象已创建，不表示任务已经交付或验收。

兼容边界同样重要：没有提供 `client_submission_id` 的旧调用继续走 legacy 创建路径，不被伪装成拥有跨响应丢失、跨进程恢复的强幂等保证。要使用新保证，调用方必须正确管理稳定提交身份。

## 独立 QA 看见了什么

实现测试之后，未参与实现的 QA 在候选 `64f633ac` 上独立执行响应丢失与并发场景，观察的不是一句总测试 PASS，而是文件数和回执字段：

| 场景 | 实际观察 |
| --- | --- |
| A2：创建成功后按响应未收到处理，再次提交 | TASK 数 1；前后 `task_id` 相同；第二次 `reused / action_taken=false` |
| A4：8 路并发使用同一提交 ID 和摘要 | `created=1 / reused=7`；唯一 `task_id`；TASK 数 1 |

进程重启复用、同 ID 异摘要冲突、legacy 返回兼容、中间态文件缺失和只读 stale 诊断另有开发定向测试。不能把 A2/A4 两项独立 QA 扩写成独立验证了所有工具和所有部署环境。

修复前后的变化因此可以直接表述：在受测任务创建路径中，同一意图的重试曾产生两张 TASK；现在提供稳定 ID 和同一摘要的受测重试、并发与重启路径都复用一个权威任务身份。

## 从实验到正式版本，还隔着发布验证

V2.1.2 于 2026-08-30 正式发布，标签源码为 `cb8869a3`。最终发布回归记录是 Runtime 1842 pass / 0 fail / 1 skip，Shell 1037 pass / 0 fail。它们是各自测试集合的结果，不应加总成“幂等可靠率”。

本次是私有母版 Runtime/Shell 源码版本发布，不是 Open Edition 发布，也没有切换在线实例。授权读者下载时应使用 `CodeFlowMu-V2.1.2-source-clean.zip`；GitHub 自动生成的完整仓库包仍含历史运行文件，不等于筛选后的源码附件。[发布说明与下载（需母版仓库访问权限）](https://github.com/joinwell52-AI/codeflowmu/releases/tag/V2.1.2)

## 可以迁移到其他 Runtime 的检查方法

对每一个有副作用的工具，分别问：

1. 动作落盘、响应丢失后，重启能否找回第一次结果？
2. 相同 ID、相同请求是复用，还是再次执行？相同 ID、不同请求怎样冲突？
3. 并发提交时，检查与占位是否真正受保护？
4. 中间状态可以沿原身份恢复，还是靠另建对象回避不确定性？
5. 旧调用是否保持兼容，而没有被错误宣传为同等幂等？
6. 已正确的工具是否保持原有保护，没有被统一改造成更弱行为？

这次工程化没有证明“所有 Agent 工具都能安全重试”。它证明的是：外部问题模型经过第一方正反实验，可以被收窄成一个具体接口缺口，再落实为能够复跑的恢复合同。

解决的不是“让 Agent 更愿意重试”，而是让它重试时不用猜第一次到底做了什么。

## 证据范围与主要来源

- [历史实验及 V2.1.2 工程更新说明](/zh/research/evidence/2026-08-28-response-loss-idempotency)：公开 JSON fixture、Reader 和 check 验证的是冻结历史材料的一致性，不会运行私有 Runtime，也不能拿历史 TASK=2 的输出判断 V2.1.2。
- [LlamaIndex PR #22841](https://github.com/run-llama/llama_index/pull/22841)：外部故障模型与调用形式修复；不作为 CodeFlowMu 的实现证据。
- V2.1.2 实现、独立 QA 和发布原始日志属于受限第一方材料，公开页给出来源编号与脱敏结果。Windows 符号链接测试有 1 项权限性 skip；既有依赖审计告警、Python 定向夹具的 SDK 环境 warning，以及真实 LAN/Gateway 和用户生产项目未覆盖范围继续保留。不能由这些结果推出生产发生频率或所有操作系统保证。
