---
title: TMPA–FCoP–CodeFlowMu 实施案例 — 正式版 I1.0
outline: deep
citation:
  work: TMPA Implementation Case
  identifier: TMPA-CASE-I1.0
  language: zh
  metadata: /releases/tmpa/v1.0/metadata/implementation-case.zh.cff
---

<ArticleCover
  image="/assets/covers/implementation-case.svg"
  kicker="工程案例"
  title="TMPA 实施案例"
  summary="CodeFlowMu V1.8.0 针对 TMPA Core S1.0 精确输入的产品运行与锁定公开证据包。"
  version="I1.0"
  status="稳定发布 · S1.0 产品证据 · 14/14 PASS"
  languageHref="/en/publications/implementation-case-i1.0"
  languageLabel="English"
/>

# TMPA 实施与案例报告

## TMPA Core S1.0、FCoP、CodeFlowMu V1.8.0 与保留的现场证据

> **文档版本：** I1.0<br>
> **状态：** 正式实施与案例报告<br>
> **规范目标：** [TMPA Core Specification S1.0](/zh/publications/tmpa-core-specification-s1.0)，冻结候选 Commit `942cbb097eb3d662662f96a2269818ec9d7ca2ed`<br>
> **受测产品：** CodeFlowMu V1.8.0，证据 Commit `c1e1f724293e8048fc3a956b6f6df8cf83f54830`<br>
> **证据采集：** 2026-08-11，Asia/Shanghai<br>
> **正式证据包：** `tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip`<br>
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
