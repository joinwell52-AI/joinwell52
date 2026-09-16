---
title: "TMPA 实施与案例报告"
author: "Zhu Wei - joinwell52 Research Center"
date: "2026-08-11 - I1.0 - TMPA V1.0"
---
# TMPA 实施与案例报告

## TMPA Core S1.0、FCoP、CodeFlowMu V1.8.0 与保留的现场证据

> **文档版本：** I1.0  

> **状态：** 正式实施与案例报告  

> **规范目标：** [TMPA Core Specification S1.0](https://joinwell52-ai.github.io/joinwell52/zh/publications/tmpa-core-specification-s1.0)，冻结候选 Commit `942cbb097eb3d662662f96a2269818ec9d7ca2ed`  

> **受测产品：** CodeFlowMu V1.8.0，证据 Commit `c1e1f724293e8048fc3a956b6f6df8cf83f54830`  

> **证据采集：** 2026-08-11，Asia/Shanghai  

> **正式证据包：** `tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip`  

> **压缩包 SHA-256：** `9b92b06c3e46c8019362f55075be4ed066cb7a9c0d9859945b6c3b7de8840d04`

## 摘要

I1.0 使用规范候选 Commit 冻结的精确字节，对 CodeFlowMu V1.8.0 执行 TMPA Core S1.0 全部十四项强制准则。CodeFlowMu 产品路径报告 **14 PASS、0 PARTIAL、0 NOT RUN、0 FAIL**。Runner 调用 `GovernanceReader.readSync`，不调用 TMPA Reference Reader。输入 Bundle Digest 为 `sha256:f98764987760cdc8ac356b1265fc98485f33345e7d6ffc8575ccb059ddd34daa`，结果 Digest 为 `sha256:0f0f642449db1853371861751a7a8ea36dce00013f53e32012a5e4dae45f4c39`。

证据包固定了 S1.0 Schema、Profile、Fixture、产品 Adapter 与 Reader 源码、CodeFlowMu 与 FCoP 修订、依赖锁、原始命令日志、修复前失败、最终回归结果、精简干净环境复现器，以及覆盖 889 个文件的 SHA-256 Manifest。最终回归记录包括 TMPA Runtime 24/24、Runtime 1,522 passed / 0 failed / 1 skipped、Shell 791/791，以及 FCoP 参考实现 1,210 passed / 2 skipped。

证据支持的最强结论是：**一个精确实现针对一个精确 S1.0 Bundle，由作者运行并 demonstrated 的产品行为**。它不是独立验证、第三方认证、普遍一致性、TMPA 理论证明、语义真值证明、幻觉消除证明或独立采用。

# 1. 范围与研究问题

I1.0 回答：

1. CodeFlowMu V1.8.0 产品 Reader 是否针对冻结的精确输入 Bundle 满足 S1.0 C01–C14？
2. 在不以 Reference Reader 替代产品路径的前提下，规范修订、产品修订、输入 Bundle、逐项结果、回归运行与证据归档能否被追踪？
3. 证据包是否保留修复前结果，并在不削弱 S1.0 准则的前提下演示干净环境复现器？
4. 哪些发现达到 demonstrated，哪些结论仍无证据支持？

裁决单位是固定 Bundle 上绑定具体准则的主张。证据成熟度与符合性裁决分开报告：

| 证据层级 | I1.0 中的含义 | 是否达到 |
|---|---|---:|
| Specified | S1.0 条款、Schema、Profile 与 C01–C14 定义所需行为 | 是 |
| Implemented | CodeFlowMu V1.8.0 包含相应 Adapter、Reader、协议与治理机制 | 是 |
| Demonstrated | 作者运行的产品与回归执行产生可检查证据 | 是，仅限固定 Bundle 与修订 |
| Independently Adopted | 无关联组织采用并独立验证该机制 | 否 |

# 2. 架构与证据边界

当前指导与实现关系为：

```text
TMPA Architecture Paper A1.0
        ↓ 提供架构理论与设计方向
TMPA Core Specification S1.0
        ↓ 固定规范对象、Reader 与符合性行为
FCoP 协议
        ↓ 提供文件型协作与证据 Profile
CodeFlowMu V1.8.0
        ↓ 实现并消费 Adapter/Reader 结果
有限案例、治理门禁、恢复与审计视图
```

TMPA 是理论与规范治理层。FCoP 是可复用协作协议，不是应用程序；`fcop` 和 `fcop-mcp` Package 是 FCoP 的参考实现，不等于协议本身。CodeFlowMu 是受 TMPA 指导的工程系统：产生并消费协作证据，把 FCoP 工件投影为 TMPA 候选对象，重建治理视图，并让 Workflow、Review、Recovery 与 Audit 组件消费结果。

历史共同演化另行表述。小典 AI、FCoP、CodeFlowMu 与 TMPA 具有作者控制的工程谱系，工程反馈帮助完善当前形式化；这种谱系不会使实现成为理论证明。WP-13 仍是角色分离证据准入与事实核查的有限案例；它不证明幻觉消除，也不替代 S1.0 C01–C14 运行。

# 3. 固定来源与证据设计

## 3.1 锁定身份

| 项目 | 固定身份 | 本报告中的角色 |
|---|---|---|
| TMPA Core | S1.0 候选 Commit `942cbb097eb3d662662f96a2269818ec9d7ca2ed` | 规范输入 |
| CodeFlowMu | V1.8.0 证据 Commit `c1e1f724293e8048fc3a956b6f6df8cf83f54830` | 受测产品 |
| CodeFlowMu Protocol Surface | V1.2.0 | 产品 Schema 与 Validator 表面 |
| FCoP 参考实现 | Commit `da79dfefd99f597c9e422ce9edec22157f915a21` | 仅作为锁定依赖回归 |
| 产品 Reader | `GovernanceReader.readSync` | 必须执行的路径 |
| 产品 Adapter | `FcopSourceAdapter.projectFcopToTmpa` | FCoP 到 TMPA 的投影路径 |

产品运行使用隔离且 tracked-clean 的证据 Worktree。原 CodeFlowMu 母体 Worktree 被观察为 dirty 且持续变化，因此不作为证据执行根。V1.8.0 证据 Commit 在采集时仅存在于本地，尚未 Push、Tag 或 Release。证据归档因此包含完整源码快照与 V1.7.0→V1.8.0 Patch。这支持检查受测源码，但不会把该 Commit 自动变成 CodeFlowMu 公共 Release。

## 3.2 固定机器输入

运行锁定四份 S1.0 JSON Schema、Lifecycle Profile、Canonicalization Profile、Fixture 与输入 Bundle 身份。四份已发布 Schema 的 Hash 为：

| Schema | SHA-256 |
|---|---|
| Governance object | `a2829cd7149c3054a52886365f2293a23106b636b0c52799739bfabdab1ff4fa` |
| Lifecycle Profile | `481a61ac2485bbaf15d90e9c5a255ad9ce6a55971190f0fe404856be4b10f993` |
| Reader result | `4527df7096fe840b85b245e50d5cea576ff359d50a54d17c8873a7b4f458d431` |
| Conformance result | `4b1ecebf83e62d2aa1aff0e79a0cd0ea0a85fbc14a426d5fe873ab40aefdc2fe` |

## 3.3 证据构造

对每项准则，产品 Runner 记录 Manifest、显式强制断言、产品输入调用、Canonical Reader 输出、断言结果、Manifest Digest 与 Result Digest。聚合结果按照 S1.0 conformance-result Schema 验证。原始 stdout、stderr、Exit Status、Command、Working Directory、Environment、Dependency-lock Digest 与修复历史均被保留。

冻结的 S1.0 候选语料库仍包含历史产品 `NOT RUN` 基线。I1.0 不改写它，而是把 V1.8.0 产品结果登记为后续外部精确版本运行，使候选历史与后续证据保持可区分。

# 4. 已执行测试基线

正式产品命令为 `npm run test:tmpa:s1.0`。它针对固定 Bundle 执行 CodeFlowMu 产品 Reader，并产生：

```text
TMPA Core: S1.0
Implementation: CodeFlowMu V1.8.0
Product Reader called: true
Reference Reader called: false
PASS: 14
PARTIAL: 0
NOT RUN: 0
FAIL: 0
Aggregate: PASS
```

S1.0 Reference Reader 单独报告 14/14 PASS。该结果验证作者维护的参考路径，不计为 CodeFlowMu 产品结果。

# 5. C01–C14 产品结果

| 准则 | 受测行为 | 强制断言数 | 结果 |
|---|---|---:|---:|
| C01 | Schema 验证与无效形状拒绝 | 3 | PASS |
| C02 | 主载体与单写者不可变性 | 5 | PASS |
| C03 | 带来源 Provenance 的重复身份处理 | 5 | PASS |
| C04 | 单流连续性与异步推进 | 4 | PASS |
| C05 | 角色权限判断 | 5 | PASS |
| C06 | 生命周期合法性与状态保留 | 9 | PASS |
| C07 | 职责分离与人工批准授权 | 10 | PASS |
| C08 | 完整性篡改检测 | 3 | PASS |
| C09 | 缺失引用处理 | 4 | PASS |
| C10 | 禁止循环检测 | 4 | PASS |
| C11 | 聚合与重建确定性 | 4 | PASS |
| C12 | 冲突保留与显式解决 | 5 | PASS |
| C13 | 恢复行为 | 5 | PASS |
| C14 | 终态历史保留 | 5 | PASS |

出版审查重新计算了 71 项断言。全部 Manifest Digest、Actual-result Digest、输入 Bundle Digest 与聚合 conformance-result Digest 均与证据包记录一致。

# 6. S0.6 到 S1.0 工程增量

## 6.1 稳定机器身份

S1.0 以稳定的 Schema ID、Profile Identity、Canonicalization Identity 与可执行语料路径，正式发布已经审查的 S0.6 行为。CodeFlowMu V1.8.0 把 Validator 与 Reader 绑定到这些身份，不把旧 Core 结果冒充为 S1.0 证据。

## 6.2 产品级投影

产品 Runner 导入精确 S1.0 Bundle，通过 CodeFlowMu Protocol Surface 验证 Lifecycle Profile，创建 CodeFlowMu `GovernanceReader`，并让 FCoP 派生的来源候选通过产品路径。Reference Reader Module 为可追踪性保留在 Bundle 中，但不被产品 Runner Import 或调用。

## 6.3 不削弱准则的回归对齐

保留的修复前 Runtime 运行记录为 1,520 passed、2 failed、1 skipped。失败来自仍预期 V1.7 文字的过期测试，以及“QA 执行完成”与“业务裁决失败”之间区分的过期预期。测试被调整到已经实现的契约；没有削弱任何 S1.0 Schema、Fixture、强制断言、Reader 行为或通过条件。

后续一次隔离的 Wake Endpoint 失败在五次即时重复中全部通过。一次 Full Run 还停滞于 `TaskDispatcher.test.ts`；精确子进程被终止，随后有界审计报告 29 passed / 0 failed。这些记录都保留在证据包中，没有被删除。

# 7. 回归与复现器结果

| 表面 | 最终结果 | 解释 |
|---|---:|---|
| CodeFlowMu TMPA Runtime Suite | 24 passed / 0 failed | 产品 Reader 单元与集成表面 |
| CodeFlowMu Runtime Full Suite | 1,522 passed / 0 failed / 1 skipped | 最终完整运行 |
| Runtime 分批覆盖 | 207/207 Files；1,522 passed / 0 failed / 1 skipped | 精确文件覆盖确认 |
| CodeFlowMu Shell 分批覆盖 | 791 passed / 0 failed | 精确八批执行 |
| Protocol Validation 与 Typecheck | Exit 0 | Schema 与 Validator 表面 |
| FCoP 锁定参考实现 | 1,210 passed / 2 skipped | 依赖回归；不替代产品 Reader |
| 精简干净环境复现器 | 14/14 PASS | `npm ci` 加精确 S1.0 产品 Runner |

复现器最初排除了整个 Protocol Schemas 目录，因此也误删所需 S1.0 Schema。这个缩减范围失败被保留。修正后的复现器只排除无关旧材料，保留 `schemas/tmpa`，从 Lock File 安装，并成功执行相同产品 Runner。

# 8. 保留的 WP-13 证据门禁案例

WP-13 作为多 Agent 事实核查的现场案例保留，其中包含 Executor/Reviewer 分离、证据准入、审计记录与显式生命周期边界。证据包支持的有限结论是：在捕获的任务状态中，开发完成且角色分离 QA 通过。它同时记录后续任务快照仍是 `review` 与 `pending`，计划日期提前但没有找到单独改期批准文件，并且 Runtime Binding 与签名校验和位于证据边界之外。

WP-13 说明 TMPA 为什么区分执行证据、复核证据、授权、生命周期状态与出版声明。它不是 S1.0 C01–C14 产品 Fixture，不证明理论，不独立验证 CodeFlowMu，也不证明多 Agent 系统不会产生幻觉。

# 9. 三值治理解释

TMPA 把语义裁决与视图分类分开：

| 裁决 | 典型视图 | 含义 |
|---|---|---|
| `valid` | authoritative | 所需证据与适用规则建立结论。 |
| `invalid` | quarantined / rejected | 确定性违规使相关证据或动作不能进入权威使用。 |
| `undetermined` | partial / disputed / pending_human | 证据缺失或冲突，或者仍需授权人工决定。 |

V1.8.0 运行使这种分离可观察。类型错误、自我签发或其他未授权批准会被保留，但不能满足 C07。C09 中缺失引用使依赖主张保持 `undetermined`，而不是被静默标为完整。C12 中未授权 Resolution 仍是证据，但作为解决动作属于 `invalid`。C08 中完整性失败会隔离被覆盖内容，同时保留其来源记录。这些是针对证据的治理裁决，不是针对现实世界的语义真值裁决。

# 10. 证据完整性与出版审计

正式归档包含 891 个 Entry、889 个文件。内部 SHA-256 Manifest 覆盖全部 889 个文件，外部 ZIP SHA-256 为 `9b92b06c3e46c8019362f55075be4ed066cb7a9c0d9859945b6c3b7de8840d04`。出版审计验证了：

- ZIP 路径安全与结构完整；
- 889/889 项内部 SHA-256；
- 884 个文本文件严格 UTF-8 解码；
- 全部 190 个 JSON 文件解析成功；
- 四份已发布 S1.0 Schema 与其余规范输入的字节一致性；
- 产品 Reader 被调用，Reference Reader 没有被替代调用；
- C01–C14 结果 Envelope 符合 Schema；
- 十四个 Manifest Digest、十四个 Result Digest、71 项强制断言、聚合 Result Digest 与输入 Bundle Digest 的重新计算；
- 修复前失败、修复说明、原始命令、Exit Status、Dependency Lock、源码快照与 Patch 均被保留。

重新计算没有发现任何 Digest 或断言差异。该审计建立提交包的内部一致性与可追踪性，不等于独立产品重跑或认证。

# 11. 局限

1. 产品与回归证据由作者运行；没有独立组织认证或采用该实现。
2. CodeFlowMu 证据 Commit 在捕获时仅存在于本地，不是公开 Tag 或 Release；归档包含完整源码快照与 Patch 供检查。
3. 证据 Worktree 为 tracked-clean，但原母体 Worktree 为 dirty 且持续变化；声明只绑定隔离证据 Worktree 与固定 Commit。
4. 精简复现器演示符合性切片，不代表 CodeFlowMu 的每项私有部署依赖或全部运行环境。
5. Runtime 保留一项 Skip，FCoP 参考实现保留两项 Skip；这些 Skip 均不计为 C01–C14 产品结果。
6. C11 评估固定 Fixture 与声明的排列，不是对任意图、编码、文件系统或敌对平台的形式证明。
7. C08 演示治理对象完整性处理，不证明模型真实性、Actor 身份认证、安装器完整性或 Byzantine 韧性。
8. 全套性能、代表性 SME 负担、比较基线、跨 Profile 可移植性与独立部署仍是开放的实证问题。
9. WP-13 是有限治理与证据准入案例，不是幻觉消除 Benchmark。

# 12. 声明账本

| 声明 | I1.0 处置 |
|---|---|
| TMPA Core S1.0 定义 C01–C14 | **Specified** |
| CodeFlowMu V1.8.0 包含对应产品机制 | **Implemented** |
| 精确产品 Bundle 记录 14/14 PASS | **Demonstrated** |
| 归档保留输入、源码、命令、输出、失败与 Hash | **Demonstrated** |
| 精简符合性切片在捕获的干净复现器中成功运行 | **Demonstrated** |
| CodeFlowMu 对任意输入与部署普遍符合 | **未主张** |
| 结果已经独立重跑、认证或采用 | **未 Demonstrated** |
| 实现证明 TMPA 理论 | **禁止结论** |
| WP-13 证明幻觉消除 | **禁止结论** |

# 13. 工程结论

I1.0 为 TMPA Core S1.0 建立发布级精确输入工程基线。CodeFlowMu V1.8.0 通过自身产品 Adapter 与 Reader 路径满足全部十四项强制准则，记录 71 项强制断言，并保留检查结果所需的回归、修复、源码、依赖与完整性轨迹。S1.0 冻结候选基线与后续产品执行保持独立可识别。

该结果强化了 TMPA 可以指导具体工程系统的证据，但不会使 CodeFlowMu 成为定义 TMPA 的权威，也不会把工程成功转化为理论证明。依赖方向保持为：A1.0 陈述架构理论；S1.0 定义规范行为；FCoP 提供协作协议；CodeFlowMu 实现并消费治理投影；I1.0 报告有限证据。

# 工件可用性

正式归档为 [tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip](https://joinwell52-ai.github.io/joinwell52/evidence/tmpa/i1.0/tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip)。相邻文件 `tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip.sha256` 记录 `9b92b06c3e46c8019362f55075be4ed066cb7a9c0d9859945b6c3b7de8840d04`。

该运行已登记到 [S1.0 外部运行注册表](https://github.com/joinwell52-AI/joinwell52/tree/main/research/conformance/tmpa-core-s1.0/external-runs/20260811-codeflowmu-v1.8.0)。早期 I0.6–I0.8 证据包继续作为不可变历史保留在各自版本路径。Git History 是出版历史；没有平行论文数据库拥有编辑权威。

# 参考文献

[1] TMPA Project. “TMPA Core Specification S1.0,” frozen candidate commit `942cbb097eb3d662662f96a2269818ec9d7ca2ed`. GitHub, 2026.

[2] TMPA Project. “TMPA Architecture Paper A1.0.” GitHub, 2026.

[3] FCoP Project. “FCoP — File-based Coordination Protocol,” reference implementation commit `da79dfefd99f597c9e422ce9edec22157f915a21`. GitHub, 2026.

[4] CodeFlowMu Project. “CodeFlowMu V1.8.0 S1.0 Product Conformance,” evidence commit `c1e1f724293e8048fc3a956b6f6df8cf83f54830`, 2026.

[5] TMPA Project. “I1.0 CodeFlowMu V1.8.0 S1.0 Evidence,” package `tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811`, 2026.

[6] CodeFlowMu Project. “WP-13 Multi-Agent Fact-Check Publication Evidence V3,” 2026.

[7] CodeFlowMu Project. “TMPA Governance: Theory-to-Engineering Relation,” `docs/TMPA-GOVERNANCE.md`. GitHub, 2026. `https://github.com/joinwell52-AI/codeflowmu/blob/main/docs/TMPA-GOVERNANCE.md`.

