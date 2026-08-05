---
title: TMPA–FCoP–CodeFlowMu 实施案例 — 草稿 I0.5
outline: deep
---

<ArticleCover
  image="/assets/covers/implementation-case.svg"
  kicker="工程案例"
  title="TMPA 实施案例"
  summary="S0.4 工程基线，以及 WP-13 多 Agent 证据门控与事实复核案例。"
  version="I0.5"
  status="S0.4 工程证据草稿"
  languageHref="/en/publications/implementation-case-i0.5"
  languageLabel="English"
/>

# TMPA 实施与案例报告

## S0.4 Reference Reader、FCoP、CodeFlowMu 与 WP-13 多 Agent 事实复核

> **文档版本：** Draft I0.5<br>
> **状态：** 作者生成的实施与案例报告<br>
> **规范目标：** TMPA Core S0.4<br>
> **历史证据基线：** I0.3 / S0.3 语料库<br>
> **报告与执行日期：** 2026-08-03；WP-13 案例观察日期 2026-08-05<br>
> **一致性语料库：** `tmpa-s0.4-fcop-codeflowmu-20260803`<br>
> **权威边界：** 本报告只提供工程证据，不具有规范性；TMPA Core 要求仅由 GitHub Core Specification 定义。

# 摘要

本报告把 Implementation Case 从一个未进入 GitHub 的 S0.3 时代本地归档，推进为公开、可执行的 S0.4 语料库。I0.5 保留 I0.4 的 Reference Reader、C01–C14 Fixture、Manifest、结果 Envelope、产品证据断言与单命令 Runner，并新增 WP-13 现场案例：当子执行产生带有“完成”意味但缺乏退出状态、测试、Commit 与正式 REPORT 的声明时，PM 根据持久事实不予放行；DEV 恢复后在原任务补齐交付，再由角色分离的 QA 验证。

FCoP 实现项目可见的协调 Profile：路由文本工件、生命周期路径、原子 Rename、只增迁移证据、角色绑定、复核、ISSUE、告警和检查报告都保存在临时模型 Session 之外。CodeFlowMu 把 FCoP 用作持久工作身份、任务—报告流、复核门禁、依赖等待、恢复和归档历史的协调与治理基础设施。小典 AI 提供来自受治理 NL2SQL Pipeline 的前规范现场证据，包括被保留的通过路径和拒绝路径。

S0.4 Reference Reader 针对作者生成的合成 Fixture 套件得到 **14 PASS**。单独求值的 FCoP–CodeFlowMu 产品基线仍为 **1 PASS、9 PARTIAL、4 NOT RUN、0 FAIL**，聚合裁决为 `PARTIAL`。WP-13 增强了 C04、C06、C07 与 C13 相关行为的作者生成 `demonstrated` 证据，但没有执行新的 S0.4 产品 Reader 标准，因此不改写上述裁决，也不建立独立验证。

# 1. 范围与证据边界

本报告回答：新的 S0.4 Reference Reader 实现了什么；锁定产品证据实际演示了什么；哪些产品要求仍未执行。本报告只提供工程证据且不具有规范性；要求与规范测试名称只由 [TMPA Core Specification S0.4](/zh/publications/tmpa-core-specification-s0.4) 定义，理论由 [Architecture Paper A0.5](/zh/publications/tmpa-architecture-paper-a0.5) 解释。

证据仍分为 `specified`、`implemented`、`demonstrated` 与 `independently adopted`。Reference Reader 已实现并由作者演示；产品基线包含混合的 implemented/demonstrated 证据，聚合仍为 `PARTIAL`。Fixture 成功不得转换为 FCoP 或 CodeFlowMu 产品一致性，也不建立独立采用或独立验证。

# 2. 工程谱系与组件边界

```text
当前概念分层
TMPA 架构 → 可复用 FCoP 协议 Profile → CodeFlowMu 与其他下游应用

历史谱系
小典 AI 实践 → 原始 TMPA → FCoP 抽取与成熟
              → CodeFlowMu 应用 → 当前 TMPA 形式化
```

FCoP 实现 TMPA 中一个已定义的文件型子集；CodeFlowMu 把 FCoP 作为协调与治理基础设施采用。FCoP 不穷尽 TMPA；CodeFlowMu 不定义 FCoP；小典 AI 是谱系和现场证据，不是产品级 TMPA Reader。

术语遵循 Core Specification 第 2 节：**治理对象**是语义单元，**来源工件**是物理观测，**治理 Reader**是确定性重建阶段，`valid` / `invalid` / `undetermined` 是仅有的三个治理语义判断。本报告不引入替代含义。

# 3. FCoP 工程实现

## 3.1 持久文本消息与状态表面

FCoP 把项目文件系统作为持久文本消息与状态表面：**文件承载协议，路径表达状态，事件回放迁移。** `TASK-*` 工件作为稳定工作锚点；报告、复核、ISSUE、告警与决策保持独立；文件名携带路由；生命周期目录暴露状态；原子 Rename 执行迁移；迁移证据说明状态如何到达；工件在 Session 结束后仍可检查。

## 3.2 Agent 可见角色绑定

受治理参与从 Agent 可见的显式角色绑定开始。绑定规定角色、协作上下文、任务范围、允许/禁止动作以及独立复核或升级角色。它是运行协议身份，不是密码学或法律身份。

## 3.3 生命周期

参考生命周期为：

```text
inbox → active → review → done → archive → history
           ↑        |
           └─ reject┘
```

| 动作 | 来源状态 | 目标状态 | 典型权限 |
|---|---|---|---|
| `create_task` | — | `inbox` | 任务创建者 |
| `claim_task` | `inbox` | `active` | 被分配的执行者 |
| `submit_task` | `active` | `review` | 责任执行者 |
| `approve_task` | `review` | `done` | 复核者或批准者 |
| `reject_task` | `review` | `active` | 复核者 |
| `finish_task` | `active` | `done` | Profile 授权角色 |
| `archive_task` | `done` | `archive` | 归档权限 |
| `archive_to_history` | `archive` | `history/...` | 归档权限 |

路径表示当前 Profile 状态，迁移证据记录过程历史。路径与证据不一致时必须形成 ISSUE，而不是静默修复。

## 3.4 路由、原子发布与恢复

参考文件名为 `{TYPE}-{YYYYMMDD}-{NNN}-{SENDER}-to-{RECIPIENT}(-slug).md`。文件名是传输封装；正文与 Schema 承载完整含义。在支持的平台上，原子发布通过先写临时文件再 Rename 实现。恢复从持久工件重建任务身份、当前生命周期、责任、关联证据、未解决依赖与问题，不依赖隐藏 Session 上下文。

# 4. CodeFlowMu 持久工作环境

CodeFlowMu 研究跨 Session 持续存在的 AI 工作角色。模型和 Session 可以变化，但工作身份通过角色绑定、任务/Thread ID、报告和复核、批准/拒绝记录、生命周期迁移、未解决 ISSUE/依赖、恢复和归档证据继续存在。

这里的“数字员工”只表示能够接受委托工作、使用工具并跨 Session 提交证据的工程身份，不表示法律雇佣、人格、意识、人类意图，也不表示替代承担责任的人类或组织。

一项已观察 Session 展示了协议初始化与参与者身份的区别：FCoP 已初始化，但 Session 尚未分配角色；Agent 在制定开发计划前请求显式角色绑定，在获得 PM/共同复核者绑定后才确认角色并创建受治理规划工作。该观察只建立运行角色可见性，不建立密码学认证。

观察与测试路径包括 ADMIN/PM 委托、执行者 Claim 与执行、独立报告提交、QA/治理复核、批准/拒绝/等待人工状态、依赖等待与释放、ISSUE 创建、重启恢复和归档历史。当前限制是这些局部发现尚未被统一规范化为 TMPA 证据图与问题集合，因此 C13 仍为 PARTIAL。

当必需证据缺失、过期或不完整时，实现可以阻止 Release。CodeFlowMu 已保存足以证明部分重启与恢复行为的 Session、任务、报告、生命周期和 Ledger 证据，但尚无单一产品 Reader 把责任、生命周期、未解决依赖、冲突与问题重建为一个规范输出。

# 5. 小典 AI NL2SQL 案例

公开演示位于 `https://demo.chedian.cc/`。产生数据的私有开发系统与公开仓库不被声称为同一个可直接复现构建。2026-07-29 快照显示 330 Profile、16,129 Event、924 Message、1,220 Index/Export、44 Knowledge 和 352 Audit 记录；这些是单次系统状态，不是性能基准。

NL2SQL 链覆盖授权、意图规范化、Schema/DDL 上下文、SQL 生成、只读验证、写入阻断、表白名单、租户隔离、字段/Join/枚举验证和结果合理性检查。一个车辆违法查询在 26,344 ms 后通过；一个车辆费用汇总查询在 131,994 ms 后被拒绝。价值在于保留通过与拒绝路径的分歧，而不是计算代表性通过率。

被拒绝链保留请求身份、验证阶段、明确结果、耗时、跨 Session 证据以及治理证据与生成 SQL 的分离。它演示真实应用能够保存治理相关记录、重建多阶段链、把拒绝保留为一等结果并展示策略门禁；它不证明完整 TMPA Core 一致性、代表性 SME 性能、独立采用、密码学不可抵赖性或每条记录的事实正确性。

# 6. 公开 S0.4 C01–C14 语料库

I0.3 曾描述本地 `tmpa-conformance.zip`，但该归档、Runner 与 Fixture 并未进入 GitHub 唯一事实源。I0.4 以公开仓库语料库 [`research/conformance/tmpa-core-s0.4`](https://github.com/joinwell52-AI/joinwell52/tree/main/research/conformance/tmpa-core-s0.4) 取代不可用的交付声明；语料库 ID 为 `tmpa-s0.4-fcop-codeflowmu-20260803`。

语料库刻意分成两条证据轨道：

1. **S0.4 Reference Reader 轨道。** 只读实现消费合成 Fixture，验证公开 S0.4 Schema 与可执行 Profile，重建规范节点、边、问题、判断和视图，再核验 C01–C14 断言。
2. **锁定产品基线轨道。** 机器可读断言把可取得的 FCoP、CodeFlowMu 与小典证据按更严格的 S0.4 标准重新裁决。Fixture PASS 绝不提升为产品 PASS。

仓库命令为 `npm run tmpa:s0.4:conformance`。它在不修改产品仓库的前提下重新生成标准记录、Reference 与 Product 结果、执行日志、汇总和 SHA-256 文件 Manifest。Runner 对 S0.4 对象与 Reader Result Envelope 进行严格 JSON Schema 验证，并在求值前验证可执行的 Lifecycle/Type/Role/Relation Profile。

状态语义固定为：PASS 表示该轨道全部强制断言都已执行并匹配；PARTIAL 表示存在真实产品证据，但至少缺少一项 S0.4 必需观察或输出；NOT RUN 表示所需产品执行路径不可用；FAIL 表示已执行的强制断言不匹配。只有产品 C01–C14 全部 PASS 时，产品聚合结果才是 PASS。

FCoP `3.2.4` Commit `da79dfefd99f597c9e422ce9edec22157f915a21` 已直接取回，并在 Python 3.12.13 上重跑：**1,137 项通过、2 项跳过、0 项失败**。CodeFlowMu `V1.2.3` 锁定 Commit `8f342d028eb66e77d135bea58fdbc7f2d0627e3b` 无法从公开 `CodeFlowMu-open` 历史取回，因此 I0.4 将新的 CodeFlowMu 执行记录为 NOT RUN，只把 I0.3 保存的断言用于有边界的重新裁决。

| 证据轨道 | PASS | PARTIAL | NOT RUN | FAIL | 聚合 | 声明级别 |
|---|---:|---:|---:|---:|---|---|
| S0.4 Reference Reader Fixture | 14 | 0 | 0 | 0 | PASS | Implemented 且由作者 Demonstrated |
| FCoP–CodeFlowMu 产品基线 | 1 | 9 | 4 | 0 | PARTIAL | 混合产品证据 |

Reference Reader 结果表明已发布的解释可以执行。它**不**建立 FCoP、CodeFlowMu 或小典对 S0.4 的完整一致性，也不建立独立采用。
