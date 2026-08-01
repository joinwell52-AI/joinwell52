## 10.5 Fixture 与结果报告

一致性 Package **SHOULD** 发布：

- 有效 TMPA Core 对象 Fixture；
- 从已发布 Schema 派生的有效 FCoP `TASK`、`REPORT`、`ISSUE` 与 `REVIEW` Fixture；
- 无效 Schema 与格式 Fixture；
- 非法及未经授权的迁移 Fixture；
- 越权角色与职责分离 Fixture；
- 损坏 Digest 与签名 Fixture；
- 重复 ID、重复序号与序号缺口 Fixture；
- 缺失引用与禁止环 Fixture；
- 并行冲突复核 Fixture；
- 受控中断与恢复快照；
- 终态历史或归档保留 Fixture；
- 预期的规范聚合候选集合、重建流程/治理图或视图，以及问题集合。

每个可执行 Fixture 集合 **SHOULD** 标识：

- TMPA Schema 版本；
- Profile 与规则集版本；
- Reader 实现与版本；
- 规范化 Profile；
- 输入对象 ID 与 Digest；
- 预期接受、partial、disputed、quarantined 与 rejected ID；
- 预期规范视图与问题集合输出；
- 适用时的排列方法、Seed 与排列数量；
- Runner 命令、执行日期与结果。

只有当聚合器产生预期规范候选集合，而且治理图/视图及问题集合的规范序列化对同一最终来源集合的每个测试枚举和交付排列均与预期 Fixture 一致时，Pipeline 才通过 C11。非规范日志或内部数据结构顺序不同不构成失败，除非它改变规范输出。

## 10.6 合规映射

TMPA 提供技术控制，不自动提供法律认证。部署 **MAY** 把 TMPA 字段与测试映射到外部要求，包括组织问责、日志与保留、人工监督、身份与授权、职责分离、事件调查和证据完整性。

Crosswalk **SHALL** 标明每项外部要求是 fully supported、partially supported、unsupported 还是 outside TMPA scope，并 **SHALL** 标明映射依赖的外部身份、策略、保留与安全系统。

全球互操作 Profile 与特定司法辖区合规 Profile 是不同交付物。例如，把 FCoP 工件映射为 A2A Task 属于互操作问题；把 TMPA 证据映射到国家或行业法规属于合规问题。二者 **MAY** 共享治理对象，但 **SHALL NOT** 互相作为成立依据。

---

# 11. Profile、版本与出版规则

## 11.1 Core 与 Profile 分离

TMPA Core 定义可移植治理语义。Profile **MAY** 增加文档类型、生命周期、存储映射、身份绑定、完整性策略或应用规则。Profile **MUST** 标识版本，**MUST** 声明其 Core 一致性层级，并且在继续声称相应层级时 **MUST NOT** 削弱 Core MUST。

Profile 特定工件不会自动成为规范 Core 对象。Profile **MUST** 定义从来源工件到来源候选、规范对象、治理图节点/边及问题集合条目的确定性投影。

## 11.2 版本

改变必填字段、权限语义、生命周期合法性、规范化、Reader 输出、问题分类或 C01–C14 通过标准的修改，需要新的 Core 版本。不会改变可观察行为的编辑澄清 **MAY** 保留当前 Core 版本，但 **SHOULD** 记录于 Changelog。

一致性报告 **MUST** 标识精确 Core 版本、Profile 版本、Reader 实现、规范化 Profile、Fixture、来源修订与执行环境。

## 11.3 出版与证据边界

发布规范建立 **specified（已规定）**证据等级。可执行代码可以为已测试路径建立 **implemented（已实现）**；有界运行可以建立 **demonstrated（已演示）**。若不存在外部实现、独立重跑或外部组织实际采用，以上均不能建立 **independently adopted（已被独立采用）**或独立验证。

首个作者生成的 C01–C14 语料库作为独立经验工件维护，不嵌入本 Core Specification。产品裁决与案例证据属于 Implementation Case Report；规范标准的含义只由本文档定义。

所有规范修订 **MUST** 直接进入 `joinwell52-AI/joinwell52` 的本 GitHub 文档，并由 Git Commit 表示正式版本历史。Architecture Paper、Implementation Case Report、网站文案或外部副本 **MUST NOT** 覆盖或静默重定义 Core 条款。

---

# 附录 A：历史来源可追踪性（说明性）

| Core Specification 内容 | 历史来源章节 | 当前处理 |
|---|---|---|
| 术语与表示阶段 | 1.5 | 保留并独立维护 |
| 治理对象、角色、生命周期、流、聚合、完整性 | 4.1–4.7 | 保留并形成 Core 架构定义 |
| 规范 Schema、编码、Reader 算法、冲突处理 | 6.1–6.2、6.5–6.6 | 保留；FCoP 映射与产品示例移入实施报告 |
| 威胁模型与安全边界 | 第 8 章 | 保留并形成 5.1–5.7 |
| 规范 Core 条款 | 第 9 章 | 保留 9.x 历史标识 |
| 一致性层级与 C01–C14 | 10.1–10.2 | 保留历史标识 |
| Fixture 与结果报告 | 10.5 | 保留；当前产品基线移入实施报告 |
| 合规映射边界 | 10.6 | 保留 |

Architecture Paper **MAY** 总结本规范，但不得重定义其含义。Implementation Case Report **MAY** 按条款提供证据，但不得改变条款含义。历史综合草稿仅用于说明来源，不是当前编辑或规范权威；当前 S0.3 及后续规范版本只在本 GitHub Core Specification 中维护。

## S0.3 理论对齐

本规范纳入 R26–R29 稳定的理论边界：文本协议的执行可以由概率型 Agent 完成，但一致性与治理结论要求确定性验证。本规范因此把委托权限、生命周期验证和治理判断与模型解释分开定义。

文本协议具有双重语义：既向执行者表达允许的动作和过程约束，也为 Reader 留下可验证的治理证据。Agent 的概率解释 **MUST NOT** 替代规范验证；Validator/Reader **MUST** 依据固定 Schema、Profile 和证据集合形成可复现结论。

治理判断采用三个语义值：`valid`、`invalid`、`undetermined`。实现 **MUST** 保留未解决状态，**MUST NOT** 把不完整或冲突证据强制转换为二元结论。

## S0.3 三值治理判断语义

TMPA Core 定义：

- `valid`：必需证据与适用治理规则建立接受结论；
- `invalid`：适用规则建立拒绝或违规结论；
- `undetermined`：证据不完整、相互冲突或等待解决，不允许形成二元结论。

实现 **MUST** 保留 `undetermined`，并 **MUST NOT** 在没有授权解决对象时将未解决证据转换为 `valid` 或 `invalid`。

若治理对象依赖另一个判断为 `undetermined` 的对象，则依赖对象的判断 **SHALL** 保持 `undetermined`，直至依赖得到解决。

视图分类是派生表达，不是额外语义值：

| 三值判断 | 典型视图 | 说明 |
|---|---|---|
| `valid` | authoritative | 必需证据和规则建立结论 |
| `invalid` | quarantined / rejected | 规则确定排除证据或动作 |
| `undetermined` | partial | 必需证据缺失 |
| `undetermined` | disputed | 有效证据冲突 |
| `undetermined` | pending_human | Profile 要求授权人工决定 |

Reader **SHALL** 在输出中同时保留语义判断与导致该判断的视图原因，避免把 partial、disputed 与 pending_human 混为一种无法解释的“未知”。
