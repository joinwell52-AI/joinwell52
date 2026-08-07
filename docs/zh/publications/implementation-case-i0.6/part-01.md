---
title: TMPA–FCoP–CodeFlowMu 实施案例 — 草稿 I0.6
outline: deep
---

<ArticleCover
  image="/assets/covers/implementation-case.svg"
  kicker="工程案例"
  title="TMPA 实施案例"
  summary="面向 S0.5 Reference Reader、FCoP、CodeFlowMu 与 WP-13 的作者本地工程证据基线。"
  version="I0.6"
  status="S0.5 工程证据草稿"
  languageHref="/en/publications/implementation-case-i0.6"
  languageLabel="English"
/>

# TMPA 实施与案例报告

## S0.5 Reference Reader、FCoP v3.2.5、CodeFlowMu 本地快照与 WP-13

> **文档版本：** Draft I0.6<br>
> **状态：** 作者生成的实施与案例报告<br>
> **规范目标：** [TMPA Core Specification S0.5](/zh/publications/tmpa-core-specification-s0.5)<br>
> **历史基线：** I0.5 保留 S0.4 语料库与 WP-13 出版包<br>
> **证据采集：** 2026-08-07，Asia/Shanghai<br>
> **证据包：** `tmpa-i0.6-local-evidence-20260806-v2`<br>
> **权威边界：** 本报告仅提供工程证据，不具有规范性；TMPA 要求只由 Core Specification 定义。

## 摘要

I0.6 是首次使用新鲜产品证据对 TMPA Core S0.5 进行评估的 Implementation Case 修订。它严格分开四条轨道：S0.5 Reference Reader、FCoP v3.2.5 协议参考实现、从本地 CodeFlowMu 工作树逐字节隔离的运行快照，以及已经发布的 WP-13 多 Agent 证据门控案例。小典 AI 仍是工程谱系与候选现场案例；本轮没有可锁定的小典 S0.5 包，因此未运行。

S0.5 Reference Reader 在作者生成的合成 Fixture 上 **14/14 PASS**，但产品证据不继承这些结果。产品矩阵为 **1 PASS、8 PARTIAL、3 NOT RUN、2 FAIL**：C14 PASS；C02、C07 FAIL；C01、C03–C06、C09、C10、C13 PARTIAL；C08、C11、C12 NOT RUN。FCoP 记录 1,222 项通过、3 项失败、2 项跳过；CodeFlowMu 记录 Protocol Fixture 8/8、Runtime 1,420 通过 / 1 失败 / 1 跳过、Shell 770/770，Protocol、Runtime、Shell Typecheck 均通过。

因此，本报告支持“已实现”和“作者运行并演示”的工程结论，不支持完整 S0.5 一致性、独立验证或独立采用。失败项作为证据保留。WP-13 演示的是对未经验证完成声明的治理遏制，不证明模型已经停止产生幻觉。

# 1. 范围与研究问题

本报告回答四个问题：

1. 已发布的 Reference Reader 能否确定性执行 S0.5 规范解释？
2. FCoP 与 CodeFlowMu 当前有哪些 S0.5 产品级证据？
3. 产品行为在哪些位置仍与 Core 契约不闭合？
4. WP-13 对不确定工具结果下的多 Agent 证据门控演示了什么？

判断单元是“绑定到某项标准的证据声明”，不是对产品的总体声誉判断。四级证据必须分开：

| 层级 | I0.6 中的含义 |
|---|---|
| Specified | 由 TMPA Core S0.5 定义 |
| Implemented | 代码或协议工件中存在对应机制 |
| Demonstrated | 作者运行产生可检查证据 |
| Independently Adopted | 独立组织采用并验证该机制 |

I0.6 没有任何声明达到 Independently Adopted。

# 2. 架构与组件边界

```text
TMPA Architecture
       ↓ 规范契约
TMPA Core S0.5
       ↓ 可复用协议 Profile
FCoP 协议
       ↓ 参考实现
fcop / fcop-mcp
       ↓ 下游采用
CodeFlowMu 应用与 WP-13 工作流
```

TMPA 是治理架构。FCoP 是可复用协议 Profile，不是应用程序，也不能用“`pip install` 了一个产品”来定义协议。`fcop` 与 `fcop-mcp` Package 是协议参考实现。CodeFlowMu 是下游应用，使用 FCoP 概念和操作实现持久角色、任务、报告、复核、恢复与审计表面。WP-13 是一个有界 CodeFlowMu 现场案例。小典 AI 属于工程谱系，但本轮未作为 S0.5 产品输入执行。

概念分层与历史谱系必须分开：

```text
概念分层：TMPA → FCoP → CodeFlowMu / 其他应用
历史谱系：小典实践 → 早期 TMPA → FCoP 提炼
                               → CodeFlowMu → 当前 TMPA 形式化
```

# 3. 证据设计与固定来源

V2 包保留命令、环境、stdout/stderr、结构化摘要、标准矩阵、来源清单、隐私脱敏报告与 SHA-256 Manifest。V2 只修正 V1 的叙述错误，没有重跑测试，也没有改变任何原始产品日志。

| 来源 | 固定身份 | 证据作用 | 边界 |
|---|---|---|---|
| TMPA Publication | Commit `653e7ba0…` | S0.5 Schema、Fixture、Reference Reader | 作者实现 |
| FCoP | Tag `v3.2.5`，Commit `b3dc2343…` | 协议与干净 detached 参考实现 | 公开固定源码 |
| CodeFlowMu | Base `c4ebc146…`，`0.3.0-alpha` | 隔离产品/测试快照 | 脏本地源码：39 Modified、47 Untracked |
| WP-13 | Commit `609571dd…`，V3 ZIP SHA-256 `5b5eda30…` | 多 Agent 事实复核案例 | 作者生成、角色分离 QA；非第三方验证 |
| 小典 AI | 无固定 S0.5 包 | 谱系与候选案例 | NOT RUN |

CodeFlowMu 运行时使用与工作树逐字节一致的隔离快照，但它不是稳定公开 Release，只能支持作者本地工程证据。

# 4. FCoP 与 CodeFlowMu 工程映射

FCoP 通过带路由的文本对象、生命周期路径、原子发布、追加式迁移、明确角色、独立 REPORT/REVIEW、ISSUE、ALERT 与 History 提供项目可见协作。它使协调事实在短暂 Agent Session 之外仍可检查和重建。

CodeFlowMu 在协议之上增加应用运行行为：持久工作身份、PM/DEV/QA/OPS 角色界面、Skill 与工具调用、Workflow 调度、Review Gate、依赖等待、恢复、审批边界及用户界面。这些机制可以实现或演示部分 S0.5，但不能重定义 FCoP 协议或 TMPA Core 标准。

共同的主要缺口是受维护的产品投影：把原生工件转换成完整 S0.5 Governance Object 与 Reader Result 表面。在该投影完成前，局部门禁可以工作，但规范对象、Issue Code、三值判断与确定性聚合视图仍可能不完整。

# 5. 已执行测试基线

所有主运行均由作者执行。Reference Reader PASS 不得复制为 Product PASS。

| 轨道 | 结果 | Exit | 解释 |
|---|---:|---:|---|
| S0.5 Reference Reader | 14 PASS | 0 | 合成 Fixture 上的可执行规范解释 |
| FCoP v3.2.5 全量 | 1,222 PASS、3 FAIL、2 SKIP | 1 | 保留三项产品断言失败 |
| FCoP Library CI 子集 | 907 PASS、1 FAIL | 1 | `parent` 持久化/读回缺口 |
| FCoP MCP CI 子集 | 78 PASS、2 FAIL | 1 | Report Lifecycle 与 Tool Surface Snapshot 缺口 |
| CodeFlowMu Protocol | 8/8 | 0 | 5 个合法与 3 个预期非法 Fixture |
| CodeFlowMu Runtime | 1,420 PASS、1 FAIL、1 SKIP | 1 | 一项人工提示语契约不匹配 |
| CodeFlowMu Shell | 770/770 | 0 | 完整隔离 Shell Snapshot |
| 三包 Typecheck | 全部通过 | 0 | 仅静态检查 |
| WP-13 V3 验证 | PASS | 0 | 23/23 内部 Hash 与结构化数据检查 |

两份 FCoP stdout 被规范化为可解码 UTF-8，并含 U+FFFD 替换字符。计数、退出码与已识别失败项未受影响，但证据包不声明原始进程输出得到逐字节无损保存。
