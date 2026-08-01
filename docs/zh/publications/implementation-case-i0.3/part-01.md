---
title: TMPA–FCoP–CodeFlowMu 实施案例 — 草稿 I0.3
outline: deep
---

<ArticleCover
  image="/assets/covers/implementation-case.svg"
  kicker="工程案例"
  title="TMPA 实施案例"
  summary="来自 FCoP、CodeFlowMu 与小典 AI 的工程证据，以及锁定版本的 C01–C14 基线。"
  version="I0.3"
  status="公开工作草稿"
  languageHref="/en/publications/implementation-case-i0.3"
  languageLabel="English"
/>

# TMPA 实施与案例报告

## FCoP、CodeFlowMu、小典 AI 与首个 C01–C14 基线

> **文档版本：** Draft I0.3  
> **状态：** 作者生成的实施与案例报告  
> **历史证据基线：** TMPA Draft V1.0-R24
> **报告日期：** 2026-07-31  
> **一致性语料库：** `tmpa-draft-v1-c01-c14-20260731`
> **权威边界：** 本报告只提供工程证据，不具有规范性；TMPA Core 要求仅由 GitHub Core Specification 定义。

# 摘要

本报告说明 TMPA 如何从工程实践中形成，以及其定义子集如何通过 FCoP、CodeFlowMu 和小典 AI 的选定证据得到实现。报告严格区分产品机制、观察案例与标准级一致性结果。

FCoP 实现项目可见的协调 Profile：路由文本工件、生命周期路径、原子 Rename、只增迁移证据、角色绑定、复核、ISSUE、告警和检查报告都保存在临时模型 Session 之外。CodeFlowMu 把 FCoP 用作持久工作身份、任务—报告流、复核门禁、依赖等待、恢复和归档历史的协调与治理基础设施。小典 AI 提供来自受治理 NL2SQL Pipeline 的前规范现场证据，包括被保留的通过路径和拒绝路径。

首个版本锁定的 C01–C14 语料库固定 FCoP `3.2.4`、CodeFlowMu `V1.2.3` 和按 SHA-256 锁定的小典 AI 证据，共记录 325 个证据文件 Hash，产品级结果为 **2 PASS、8 PARTIAL、4 NOT RUN**。没有直接执行的门禁标准失败，但这不是完整一致性。主要工程缺口是统一的只读证据图适配器。

# 1. 范围与证据边界

本报告回答：FCoP 实现了哪些 TMPA 机制；CodeFlowMu 如何使用这些机制；小典 AI 案例证明什么；首轮锁定版本的一致性执行实际建立了什么。它不是规范性 Core Specification。

证据分为 `specified`、`implemented`、`demonstrated` 与 `independently adopted`。当前证据最强在前三层。作者同时是被评估系统的发起者或主要开发者，因此版本与 Hash 必须锁定，PASS/PARTIAL/NOT RUN 必须分开，前置条件失败必须保留，Fixture 成功不能转换为产品一致性，且不能声称独立验证。

# 2. 工程谱系与组件边界

```text
小典 AI 工程实践
      ↓
原始文本多角色协调方法
      ↓ 抽取并独立成熟
FCoP 文件型协调协议
      ↓ 下游采用
CodeFlowMu 持久工作环境
      ↓ 证据反馈
当前 TMPA 架构与 Core Specification
```

FCoP 不穷尽 TMPA；CodeFlowMu 不定义 FCoP；小典 AI 是谱系和现场证据，不是产品级 TMPA Reader。

# 3. FCoP 工程实现

FCoP 把项目文件系统作为持久文本消息与状态表面：**文件承载协议，路径表达状态，事件回放迁移。** `TASK-*` 工件作为稳定工作锚点；报告、复核、ISSUE、告警与决策保持独立；文件名携带路由；生命周期目录暴露状态；原子 Rename 执行迁移；迁移证据说明状态如何到达；工件在 Session 结束后仍可检查。

受治理参与从 Agent 可见的显式角色绑定开始。绑定规定角色、协作上下文、任务范围、允许/禁止动作以及独立复核或升级角色。它是运行协议身份，不是密码学或法律身份。

参考生命周期为：

```text
inbox → active → review → done → archive → history
           ↑        |
           └─ reject┘
```

路径表示当前 Profile 状态，迁移证据记录过程历史。路径与证据不一致时必须形成 ISSUE，而不是静默修复。

# 4. CodeFlowMu 持久工作环境

CodeFlowMu 研究跨 Session 持续存在的 AI 工作角色。模型和 Session 可以变化，但工作身份通过角色绑定、任务/Thread ID、报告和复核、批准/拒绝记录、生命周期迁移、未解决 ISSUE/依赖、恢复和归档证据继续存在。

观察与测试路径包括 ADMIN/PM 委托、执行者 Claim 与执行、独立报告提交、QA/治理复核、批准/拒绝/等待人工状态、依赖等待与释放、ISSUE 创建、重启恢复和归档历史。当前限制是这些局部发现尚未被统一规范化为 TMPA 证据图与问题集合，因此 C13 仍为 PARTIAL。

# 5. 小典 AI NL2SQL 案例

公开演示位于 `https://demo.chedian.cc/`。产生数据的私有开发系统与公开仓库不被声称为同一个可直接复现构建。2026-07-29 快照显示 330 Profile、16,129 Event、924 Message、1,220 Index/Export、44 Knowledge 和 352 Audit 记录；这些是单次系统状态，不是性能基准。

NL2SQL 链覆盖授权、意图规范化、Schema/DDL 上下文、SQL 生成、只读验证、写入阻断、表白名单、租户隔离、字段/Join/枚举验证和结果合理性检查。一个车辆违法查询在 26,344 ms 后通过；一个车辆费用汇总查询在 131,994 ms 后被拒绝。价值在于保留通过与拒绝路径的分歧，而不是计算代表性通过率。

# 6. 首个锁定的 C01–C14 语料库

基线于 `2026-07-31T11:27:28+08:00` 执行，固定 FCoP Package `3.2.4` 与 Commit `da79df...`，CodeFlowMu `V1.2.3` 与 Commit `8f342d...`，以及选定小典 AI Commit/Hash。环境为 Windows 10、Python 3.12.9、Node v24.14.0、AMD64、约 17 GB 内存；证据清单记录 325 个文件。

选定套件报告 222 个 FCoP 测试和 73 个 CodeFlowMu 测试通过。隔离的 CodeFlowMu 身份测试因环境无法准备而 NOT RUN；4 个小典 Report-Auditor 测试作为非门禁证据通过；Guardrail Suite 因缺少 `aiomysql` 未运行。

产品级结果为：C06、C14 PASS；C01、C02、C03、C04、C05、C07、C09、C13 PARTIAL；C08、C10、C11、C12 NOT RUN。没有直接门禁测试失败，但这不等于全部执行或完整一致性。
