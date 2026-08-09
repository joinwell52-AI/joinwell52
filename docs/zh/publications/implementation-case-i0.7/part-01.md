---
title: TMPA–FCoP–CodeFlowMu 实施案例 — 草稿 I0.7
outline: deep
---

<ArticleCover
  image="/assets/covers/implementation-case.svg"
  kicker="工程案例"
  title="TMPA 实施案例"
  summary="覆盖 TMPA Core S0.5 全部准则的 CodeFlowMu V1.4.1 锁定产品运行，并保留 WP-13 治理证据。"
  version="I0.7"
  status="S0.5 产品证据草稿 · 14/14 PASS"
  languageHref="/en/publications/implementation-case-i0.7"
  languageLabel="English"
/>

# TMPA 实施与案例报告

## TMPA Core S0.5、FCoP 3.2.4、CodeFlowMu V1.4.1 与 WP-13

> **文档版本：** 草稿 I0.7<br>
> **状态：** 作者制作的实施与案例报告<br>
> **规范目标：** [TMPA Core Specification S0.5](/zh/publications/tmpa-core-specification-s0.5)<br>
> **受测产品：** CodeFlowMu V1.4.1，Commit `1cd403537136b3e915c4646cd306983eaca1d2ce`<br>
> **证据采集：** 2026-08-09，Asia/Shanghai<br>
> **正式证据包：** `tmpa-i0.7-codeflowmu-v1.4.1-evidence-20260809.zip`<br>
> **压缩包 SHA-256：** `06f34ce7c6b5008b9adeedc45f68541ce5f3ecff6613c80ff3bb05a12fa61b34`<br>
> **权威边界：** 本报告属于证据性、非规范性文档；只有 Core Specification 定义 TMPA 要求。

## 摘要

I0.7 使用公开、Commit 锁定的 CodeFlowMu V1.4.1 源码，执行 TMPA Core S0.5 的全部十四项强制符合性准则。固定源码与测试 Bundle 下，产品矩阵为 **14 PASS、0 PARTIAL、0 NOT RUN、0 FAIL**。外部产品夹具通过 15/15 项断言；CodeFlowMu 内置 TMPA 套件通过 19/19；Runtime 为 1,446 passed / 0 failed / 1 skipped；Shell 为 775/775；FCoP 为 1,210 passed / 2 skipped；Protocol 与各项 Typecheck 均成功退出。

该结果升级了 I0.6 本地基线及保留的 CodeFlowMu V1.4.0 修复前基线。V1.4.0 为 12 PASS / 2 FAIL：C06 未能把生命周期完成与独立验收分开，C12 允许未授权裁决清除复核冲突。V1.4.1 修复这两个边界，同时没有弱化 C03 或 C10。V1.4.0 压缩包仅作为历史证据保留，不属于 I0.7 正式出版主包。

当前最强、且不越界的结论是：**固定 Bundle 下由作者本地 demonstrated 的产品符合性**。它不是独立认证、独立采用、任意输入上的形式证明，也不证明多智能体幻觉已被消除。WP-13 仍是独立的有限案例，只演示对最初未核验完成声明的证据门禁与角色分离复核。

# 1. 范围与研究问题

I0.7 回答以下问题：

1. 锁定的 CodeFlowMu V1.4.1 产品运行是否逐项满足 S0.5 的 C01–C14？
2. V1.4.1 是否在不混并其他治理准则的条件下关闭 V1.4.0 的两项失败？
3. 如何表述 TMPA、FCoP、CodeFlowMu 与 WP-13，避免混淆理论、协议、应用与案例证据？
4. 在结果可称为独立验证或独立采用之前，还存在哪些边界？

裁决单位是固定源码与证据 Bundle 上、绑定具体准则的主张。四个成熟度层级严格分开：

| 层级 | I0.7 中的含义 | 是否达到 |
|---|---|---:|
| Specified | 由 TMPA Core S0.5 规范定义 | 是 |
| Implemented | 产品中存在相应机制 | 是 |
| Demonstrated | 作者运行产生了可检查证据 | 是，仅限本 Bundle 的 C01–C14 |
| Independently Adopted | 独立组织采用并验证该机制 | 否 |

# 2. 架构与证据边界

```text
TMPA Architecture Paper
        ↓ 理论与治理模型
TMPA Core S0.5
        ↓ 规范对象、Reader 与符合性契约
FCoP 协议
        ↓ 基于文件的协同 Profile 与参考实现
CodeFlowMu 应用
        ↓ Runtime、角色、工作流、恢复与审计行为
WP-13 有限现场案例
```

TMPA 是架构与治理理论。FCoP 是可复用的基于文件的协同协议，不是应用程序，也不是某个安装包主张；`fcop` 与 `fcop-mcp` 是该协议的参考实现。CodeFlowMu 是本次评估的下游应用。WP-13 是该工程谱系中的一个有限工作流案例，不能替代完整的 C01–C14 产品运行。

概念依赖与历史形成过程保持分离：

```text
概念关系：TMPA → FCoP → CodeFlowMu / 其他应用
历史关系：小典实践 → 早期 TMPA → FCoP 提取
                               → CodeFlowMu → 当前 TMPA 形式化
```

小典 AI 仍属于工程谱系和候选现场证据来源。I0.7 不增加小典符合性主张，因为本次没有执行固定的小典 S0.5 Bundle。

# 3. 锁定来源与证据设计

| 来源 | 锁定标识 | I0.7 中的作用 | 边界 |
|---|---|---|---|
| TMPA Core | S0.5 | C01–C14 规范目标 | 规范，不是产品证据 |
| CodeFlowMu | V1.4.1，Commit `1cd403537136b3e915c4646cd306983eaca1d2ce` | 受测产品 | 可公开获取；初始化前为干净 detached checkout |
| FCoP | 3.2.4，Commit `da79dfefd99f597c9e422ce9edec22157f915a21` | 协议与参考基线 | 可公开获取的干净 checkout |
| 外部夹具 | 15 项强制断言 | 产品级 C01–C14 评估 | 固定测试构造，不是任意输入证明 |
| WP-13 V3 | 已出版证据包 | 多 Agent 证据门禁案例 | 独立的作者制作案例证据 |

原 CodeFlowMu 与 FCoP 本地工作树存在未提交内容，但证据采集未修改它们；测试使用固定的 detached checkout。CodeFlowMu 在产品初始化前是干净的，初始化生成文件另行记录于 `manifests/codeflowmu-post-initialization-status.txt`。证据采集期间没有 Push、Release 或 Tag。

正式公开包只包括 V1.4.1 ZIP 与外部 SHA-256 文件。V1.4.0 包记录 12 PASS / 2 FAIL 的修复前状态，仅作为历史证据保留；除非审稿人要求对照，否则不进入 I0.7 正式主包。
