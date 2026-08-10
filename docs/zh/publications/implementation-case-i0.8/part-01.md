---
title: TMPA–FCoP–CodeFlowMu 实施案例 — 草稿 I0.8
outline: deep
---

<ArticleCover
  image="/assets/covers/implementation-case.svg"
  kicker="工程案例"
  title="TMPA 实施案例"
  summary="CodeFlowMu V1.6.0 针对 TMPA Core S0.6 精确输入的产品运行与自包含公开复现器。"
  version="I0.8"
  status="S0.6 产品证据草稿 · 14/14 PASS"
  languageHref="/en/publications/implementation-case-i0.8"
  languageLabel="English"
/>

# TMPA 实施与案例报告

## TMPA Core S0.6、FCoP、CodeFlowMu V1.6.0 与保留的现场证据

> **文档版本：** 草稿 I0.8<br>
> **状态：** 作者制作的实施与案例报告<br>
> **规范目标：** [TMPA Core Specification S0.6](/zh/publications/tmpa-core-specification-s0.6)，Commit `8989657e8fde6d2e55d7606ae0adacac14fec760`<br>
> **受测产品：** CodeFlowMu V1.6.0，实现 Commit `62440a526a99d2fe55019d8bb95ad2425569fcb4`<br>
> **证据采集：** 2026-08-10，Asia/Shanghai<br>
> **正式证据包：** `tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810.zip`<br>
> **压缩包 SHA-256：** `3c34514089f08f5957d806f900ab31af1cdae94c08f31a5da046f451b5884fe9`<br>
> **权威边界：** 本报告属于证据性、非规范性文档；只有 Core Specification 定义 TMPA 要求。

## 摘要

I0.8 使用规范仓库 Commit 固定的原始 LF 字节，对 CodeFlowMu V1.6.0 执行 TMPA Core S0.6 全部十四项强制准则。产品级结果为 **14 PASS、0 PARTIAL、0 NOT RUN、0 FAIL**。CodeFlowMu 产品 Runner 调用自身同步 `GovernanceReader`，不调用 TMPA Reference Reader。输入 Bundle Digest 为 `sha256:251914ee55922d20c9bd23943a4ff445bccaa5835e1fcc11b8562f3f384243fa`。

本次工程升级关闭了相对于 I0.7/S0.5 基线的 S0.6 可观察差异：字节相同的观测保留每个贡献来源 ID；高风险批准必须同时满足允许的裁决对象类型、有效角色 Assignment、允许角色、批准决定，以及 Profile 要求时相互独立的行为者；所有规范排序采用不依赖 Locale 的 Unicode 码点顺序，并包含 U+E000 与 U+10000 回归。CodeFlowMu 内置 TMPA 套件为 23/23，Runtime 为 1,485 passed / 0 failed / 1 skipped，Shell 为 777/777，锁定的 FCoP 参考实现为 1,210 passed / 2 skipped。

证据包包含自包含公开复现器。干净环境执行 `npm ci` 与 `npm test`，先核验七份正式 S0.6 文件的字节摘要，再运行 CodeFlowMu 产品 Reader，得到 14/14 PASS；复现该符合性切片不需要私有 CodeFlowMu 母体仓库。当前最强且不越界的结论仍是：**固定 Bundle 下由作者运行所 demonstrated 的行为**。它不是独立认证、独立采用、任意输入上的证明，也不证明 AI 幻觉已经消除。

# 1. 范围与研究问题

I0.8 回答：

1. CodeFlowMu V1.6.0 产品 Reader 是否针对同一个精确、固定的输入 Bundle 满足 S0.6 C01–C14？
2. 来源保留、完整人工批准授权和不依赖 Locale 的排序这三项 S0.6 可观察变化，是否已实现且没有破坏 I0.7 demonstrated 的 S0.5 行为？
3. 在无法访问私有 CodeFlowMu 母体仓库时，符合性切片能否公开复跑？
4. 哪些证据仍是作者本地运行，哪些结论仍未获得支持？

裁决单位是固定 Bundle 上绑定具体准则的主张。四个证据层级严格分开：

| 层级 | I0.8 中的含义 | 是否达到 |
|---|---|---:|
| Specified | 由 TMPA Core S0.6 规范定义 | 是 |
| Implemented | CodeFlowMu 中存在相应机制 | 是 |
| Demonstrated | 执行产生了可检查证据 | 是，仅限固定 C01–C14 Bundle |
| Independently Adopted | 独立组织采用并验证该机制 | 否 |

# 2. 架构与证据边界

```text
TMPA Architecture Paper
        ↓ 理论指导工程方向
TMPA Core S0.6
        ↓ 固定规范对象、Reader 与符合性契约
FCoP 协议
        ↓ 提供现实协作与证据协议
CodeFlowMu V1.6.0 应用执行与消费层
        ↓ 产品 Reader、Runtime、角色、恢复与审计
WP-13 与其他有限案例
```

TMPA 理论指导 CodeFlowMu 的工程方向，Core S0.6 固定本报告接受评估的规范行为。FCoP 是 CodeFlowMu 使用的现实协作与证据协议，不是应用程序；`fcop` 与 `fcop-mcp` 是参考实现，不等于协议本身。按照 CodeFlowMu 工程架构 [7]，CodeFlowMu 是应用执行与消费层：负责产生协作事实、运行 Adapter 与 Reader、投影治理图，并让恢复与治理门禁消费重建结果。WP-13 与小典 AI 继续作为工程谱系中的有限证据来源，不能替代 S0.6 产品运行。

概念依赖与历史形成过程保持分离：

```text
当前指导：TMPA 理论 → Core 要求 → FCoP 协议
                                  → CodeFlowMu 工程落实
历史反馈：小典实践 → 早期 TMPA → FCoP 提取
                               → CodeFlowMu 工程实现
FCoP + CodeFlowMu 结果 → 当前 TMPA 形式化
```

历史反馈解释理论如何成熟，但不会倒置当前权威关系。产品行为可以提供证据或推动后续修订，却不能重定义当前 Core。

# 3. 锁定来源与证据设计

| 来源 | 锁定标识 | I0.8 中的作用 | 边界 |
|---|---|---|---|
| TMPA Core | S0.6，Commit `8989657…` | C01–C14 规范目标 | 规范，不是产品证据 |
| CodeFlowMu | V1.6.0，Commit `62440a5…` | 受测产品实现 | 本地实现 Commit，不表述为公开 Release |
| 公开复现器 | 29 个锁定文件 | 公开复跑符合性切片 | 不公开或复现整个私有产品 |
| FCoP 参考实现 | Commit `da79dfe…` | 锁定依赖基线 | 测试结果不是抽象协议证明 |
| I0.7 | S0.5 / CodeFlowMu V1.4.1 | 历史回归基线 | 保留精确的旧版含义 |
| WP-13 V3 | 已出版证据包 | 证据门禁现场案例 | 未复跑，也未提升为符合性证明 |

七份正式 S0.6 输入——四份 Schema、规范化 Profile、生命周期 Profile 与 Fixture——均与 GitHub 字节完全一致。第一次提交的压缩包包含 Windows Checkout 转换后的 CRLF 副本，出版预检拒绝了该包。最终包使用 Git 原始 Blob 字节重新运行产品准则，并重新生成全部关联 Digest，而不是修改旧结果 JSON。
