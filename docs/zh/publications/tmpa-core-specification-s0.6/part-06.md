## 10.3 可执行测试用例契约

每个可执行测试用例 **SHALL** 发布机器可读 Manifest，包含：

- 稳定的 `test_case_id` 和恰好一个 C01–C14 `criterion`；
- Core、对象 Schema、输出 Schema、Profile 和注册表的版本与字节 Digest；
- 显式前置条件；
- 包含 `source_id`、仓库相对 `path`、媒体类型与字节 Digest 的来源 Fixture 清单；
- 包含稳定断言 ID、Target、Operator、Expected Value 与 Mandatory 标记的断言；
- 预期规范结果 Digest；
- Runner ID、命令、执行环境，以及任何排列方法或 Seed；
- stdout、stderr、规范输出与支持证据的仓库相对路径。

Runner **SHALL** 保留精确输入 Manifest、规范结果、退出状态、stdout、stderr 与执行环境身份。测试 **SHALL NOT** 依赖未固定的网络响应、墙上时钟顺序、文件系统枚举顺序或未声明的可变状态。

```json
{
  "test_case_id": "C06-illegal-transition-001",
  "criterion": "C06",
  "core_version": "S0.6",
  "inputs": [{"source_id": "transition-1", "path": "fixtures/C06/transition-1.json", "media_type": "application/json", "byte_digest": "sha256:<hex>"}],
  "assertions": [{"id": "state-unchanged", "target": "/nodes/work-1/state", "operator": "equals", "expected": "active", "mandatory": true}],
  "expected_result_digest": "sha256:<hex>",
  "runner": {"id": "tmpa-conformance", "version": "<version>", "command": "<command>"}
}
```

## 10.4 裁决算法与一致性声明

Runner **SHALL** 为每项标准赋予恰好一个裁决：

- **PASS：** 全部强制断言都已执行且通过；
- **FAIL：** 至少一个强制断言已执行且失败；
- **PARTIAL：** 至少一个强制断言已执行且通过、没有失败，并且至少一个未执行；
- **NOT RUN：** 没有强制断言执行，或前置条件阻止了求值。

基础设施失败 **SHALL** 另记为 `run_state: error`，并产生 NOT RUN，而不是 PASS。聚合优先级为 FAIL、PARTIAL、NOT RUN、PASS：任一 FAIL 使聚合为 FAIL；没有 FAIL 时，任一 PARTIAL 使聚合为 PARTIAL；两者均无时，任一 NOT RUN 使聚合为 NOT RUN；只有全部 PASS 才得到 PASS。

只有 C01–C14 针对同一固定输入 Bundle 全部 PASS，且完整证据 Package 已发布，产品才 **MAY** 声明 **TMPA Core S0.6 Conformance**。“未观察到失败”、PARTIAL、NOT RUN、旧版 Core 结果或未发布结果 **SHALL NOT** 被表述为完整 S0.6 一致性。

`specified`、`implemented`、`demonstrated` 与 `independently adopted` 描述证据成熟度，**SHALL** 与测试裁决分开报告。作者演示不建立独立采用。

```json
{
  "core_version": "S0.6",
  "implementation": {"id": "<id>", "version": "<version>"},
  "criteria": [{"id": "C01", "verdict": "PASS", "manifest_digest": "sha256:<hex>", "result_digest": "sha256:<hex>"}],
  "aggregate_verdict": "PASS | FAIL | PARTIAL | NOT RUN",
  "evidence_level": "specified | implemented | demonstrated | independently_adopted"
}
```

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

## 11.4 S0.6 发布候选闭环记录

2026-08-09 的 S0.6 发布候选审查把中英文文档、四份机器可读 Schema、生命周期 Profile、规范化 Profile、Reference Reader 与 C01–C14 Fixture 作为一个版本 Bundle 进行冻结。审查关闭 S0.5 中发现的三项可观察缺口：字节相同的观测现在保留每个贡献来源 ID；人工批准现在要求允许的对象类型、已分配的授权角色，以及 Profile 要求时相互独立的批准人；规范排序现在使用不依赖 Locale 的 Unicode 码点顺序。

作者生成的 S0.6 Reference Reader 通过全部十四项 S0.6 Fixture。这只为已测试的 Reference Reader 路径建立 demonstrated 行为。由于尚无产品发布精确版本的 S0.6 Bundle，S0.6 产品轨道的十四项标准全部明确记为 `NOT RUN`。本次结果不建立产品一致性、独立验证、语义真实性或独立采用。

I0.7 与锁定的 CodeFlowMu V1.4.1 证据包继续作为精确版本的 S0.5 作者运行证据，结果为 14/14 PASS；它们 **SHALL NOT** 被改标为 S0.6 证据。本发布候选记录冻结后，I0.8 针对 CodeFlowMu V1.6.0 完成了一次独立登记的精确 S0.6 产品运行。其带日期的外部运行登记固定了 Core 与实现 Commit、证据包 SHA-256、输入 Bundle Digest、结果 Digest 及 14/14 产品裁决。该后续运行仅构成锁定 Bundle 下的作者生成 demonstrated 证据；它不改写历史 `NOT RUN` 轨道，也不建立独立验证。

## 11.5 S0.5 FCoP 派生历史基线

S0.5 从完整、版本固定的 FCoP 协议来源集合中派生生命周期状态/业务验收分离、父子工作、完成声明、角色能力分层、风险与人工批准门、互惠闭环、失败/恢复动作、巡检发现与漂移处理。FCoP 仍是协议与参考 Profile；`fcop` 与 `fcop-mcp` Python Package 仍是参考实现，不是协议本身。S0.4/I0.5、S0.5/I0.6 与 S0.5/I0.7 的精确历史含义由 Git 历史及其已发布证据包保留。

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

Architecture Paper **MAY** 总结本规范，但不得重定义其含义。Implementation Case Report **MAY** 按条款提供证据，但不得改变条款含义。历史综合草稿仅用于说明来源，不是当前编辑或规范权威；当前 S0.6 及后续规范版本只在本 GitHub Core Specification 中维护。

# 附录 B：FCoP 来源交叉映射（说明性）

| S0.6 关注点 | 固定版本的 FCoP 来源 | TMPA Core 处理 |
|---|---|---|
| 协议对象、文档与事件词汇 | `spec/fcop-v3-spec.md` 与 `spec/fcop-v3-spec.zh.md`；仓库 Tag `v3.2.5` | 投影为治理对象、类型化引用、写者流与保留来源的 Reader 输入 |
| 角色边界与协作周期规则 | `AGENTS.md`，Rules 版本 `3.2.5` | 声明能力与强制权限分离；验收与职责分离裁决要求可归属证据 |
| 机器可读载体与验证 | `spec/schemas/` | 为 S0.6 对象/Profile Schema 提供输入，但不替代 TMPA Core Schema 验证 |
| 生命周期、原子迁移、恢复与审计决策 | FCoP Specification 与适用 ADR | 形式化为生命周期状态、业务验收、失败/恢复动作、巡检发现及确定性历史重建 |
| 父子工作派生与闭环 | FCoP v3.2.5 `parent` 协议表面 | 表示为 `governed_work.parent_id`、父子汇总与 `CHILD_WORK_OPEN` |
| 可执行软件 | `fcop` 与 `fcop-mcp` Package | 只作为 FCoP 参考实现；Package 测试是实现证据，不是协议本身 |
| 下游采用 | CodeFlowMu 及有界的 WP-13 证据 | 只作为 Implementation Case Report 中的应用证据，不作为理论证明或协议定义；小典 AI 仅保留为作者报告的历史谱系，不纳入评估证据 |

本表只用于可追踪，不构成引用即纳入。FCoP 与 TMPA 抽象不同时，由本 Core Specification 控制 TMPA 含义；应用或参考实现偏离协议来源时，应把偏差报告为实现证据，不得静默改写任一规范。
