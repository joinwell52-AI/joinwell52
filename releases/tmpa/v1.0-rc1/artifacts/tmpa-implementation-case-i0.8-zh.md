---
title: "TMPA 实施与案例报告"
author: "Zhu Wei - joinwell52 Research Center"
date: "2026-08-10 - I0.8 - RC1"
---
# TMPA 实施与案例报告

## TMPA Core S0.6、FCoP、CodeFlowMu V1.6.0 与保留的现场证据

> **文档版本：** 草稿 I0.8  

> **状态：** 作者制作的实施与案例报告  

> **规范目标：** [TMPA Core Specification S0.6](https://joinwell52-ai.github.io/joinwell52/zh/publications/tmpa-core-specification-s0.6)，Commit `8989657e8fde6d2e55d7606ae0adacac14fec760`  

> **受测产品：** CodeFlowMu V1.6.0，实现 Commit `62440a526a99d2fe55019d8bb95ad2425569fcb4`  

> **证据采集：** 2026-08-10，Asia/Shanghai  

> **正式证据包：** `tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810.zip`  

> **压缩包 SHA-256：** `3c34514089f08f5957d806f900ab31af1cdae94c08f31a5da046f451b5884fe9`  

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

TMPA 理论指导 CodeFlowMu 的工程方向，Core S0.6 固定本报告接受评估的规范行为。FCoP 是 CodeFlowMu 使用的现实协作与证据协议，不是应用程序；`fcop` 与 `fcop-mcp` 是参考实现，不等于协议本身。按照 CodeFlowMu 工程架构 [7]，CodeFlowMu 是应用执行与消费层：负责产生协作事实、运行 Adapter 与 Reader、投影治理图，并让恢复与治理门禁消费重建结果。WP-13 保留为有界的证据准入案例；小典 AI 仅作为作者报告的工程谱系，不纳入评估证据；二者都不能替代 S0.6 产品运行。

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

# 4. 已执行测试基线

主要产品运行与全量套件均由作者在固定输入上执行。跳过项保持为跳过项。

| 轨道 | 结果 | Exit | 解释 |
|---|---:|---:|---|
| S0.6 产品 C01–C14 | 14 PASS / 0 FAIL / 0 PARTIAL / 0 NOT RUN | 0 | 直接执行 CodeFlowMu 产品 Reader |
| CodeFlowMu 内置 TMPA | 23/23 | 0 | 包含显式 S0.5 兼容与 S0.6 回归 |
| CodeFlowMu Protocol | 5 个有效 + 3 个预期无效 Fixture | 0 | 产品协议测试，与 TMPA 裁决分开 |
| Protocol / Runtime / Shell Typecheck | 全部通过 | 0 | 仅静态检查 |
| CodeFlowMu Runtime | 1,485 passed、0 failed、1 skipped | 0 | 作者本地完整 Runtime 运行 |
| CodeFlowMu Shell | 777 passed、0 failed | 0 | 作者本地完整 Shell 运行 |
| FCoP 锁定参考基线 | 1,210 passed、2 skipped | 0 | 参考实现，不是协议证明 |
| 公开复现器 | `npm ci` + 产品 14/14 PASS | 0 | 自包含符合性切片复跑 |

最终 Conformance Result 通过 S0.6 结果 Schema，记录 `product_reader_called: true`、`reference_reader_called: false`、实现 `codeflowmu/V1.6.0`，证据层级为 `demonstrated`。

# 5. C01–C14 产品结果

| ID | S0.6 准则 | 裁决 | 执行观察 |
|---|---|---:|---|
| C01 | Schema 验证 | **PASS** | 四份正式 S0.6 Schema 全部编译；错误结构与声明 `date-time` 的负向案例被确定性拒绝。 |
| C02 | 主载体与不可变性 | **PASS** | 内容寻址修订保持可归责；主载体冲突不能取得权威；更正仍是独立证据。 |
| C03 | 重复身份与来源 | **PASS** | 同 ID 异内容被隔离；字节相同的观测投影为一个节点，同时保留全部确定排序的 `source_id`。 |
| C04 | 串行连续性与异步推进 | **PASS** | 流缺口与重号持续可见；无关流可以推进；到达顺序不改变输出。 |
| C05 | 角色权威 | **PASS** | 权限拒绝与权限不确定分支保持分离，且不能修改重建状态。 |
| C06 | 生命周期合法性 | **PASS** | 非法迁移被拒绝；缺少独立验收时完成保持不确定且不能推进。 |
| C07 | 职责分离与人工批准 | **PASS** | 错误批准类型、缺少 Assignment、不允许角色、缺少批准决定和自我批准均保持 `pending_human`；有效的已分配独立批准可以清除门禁。 |
| C08 | 完整性篡改 | **PASS** | 被覆盖内容篡改产生 `INTEGRITY_MISMATCH`，对象退出权威节点，失败来源仍被保留。 |
| C09 | 缺失引用 | **PASS** | 缺失依赖与主张证据保持可见并传播不确定结果，不虚构事实。 |
| C10 | 禁止引用环 | **PASS** | 只隔离受影响的禁止环子图，无关有效节点仍可使用。 |
| C11 | 确定性重建 | **PASS** | 固定来源排列产生字节等价结果；规范顺序采用 Unicode 码点顺序，包括 U+E000 在 U+10000 之前。 |
| C12 | 冲突保留 | **PASS** | 矛盾复核保持 disputed，直到授权解决者行动；未授权裁决保留为证据但不能清除冲突。 |
| C13 | 恢复 | **PASS** | 全新 Reader 能一致重建生命周期、责任、依赖、失败、恢复动作与父子状态。 |
| C14 | 终态历史保留 | **PASS** | 只有已验收授权链进入 archive，之前的任务、报告、复核和迁移历史仍可重建。 |

# 6. S0.5 → S0.6 产品差异

## 6.1 C03——聚合不丢失来源

I0.7 已演示同 ID 异内容候选的冲突处理。S0.6 增加第二条边界：多个字节相同的观测不能生成重复节点，但聚合也不能抹除观测来源。V1.6.0 输出一个规范节点和完整、按码点排序的 `source_ids` 列表。

## 6.2 C07——批准是授权治理对象

S0.5 基线已演示角色分离与高风险人工门禁。S0.6 让授权合同可以直接测试：只有对象类型被允许、行为者具有匹配 Assignment、角色被允许、正文包含批准决定，并且 Profile 要求时行为者相互独立，批准才成立。四个负向分支继续等待，不会被当作隐式批准。

## 6.3 C11——确定性意味着不依赖 Locale

S0.6 消除规范排序中的环境歧义。V1.6.0 在对象 Key、来源、图遍历、问题与输出集合中统一采用 Unicode 码点顺序。U+E000/U+10000 Fixture 可以识别普通 ASCII 测试无法发现的 UTF-16 Code Unit 排序错误。

## 6.4 兼容边界

CodeFlowMu 内置套件包含显式 S0.5/I0.7 兼容路径。I0.7 继续作为精确的 S0.5 历史产品结果；I0.8 不改写其输入、准则、产品版本或证据包。

# 7. 公开复现器

正式压缩包包含 29 文件的自包含复现器，其中包括 Package Lock、产品 Reader、Protocol Validator、Profile、Fixtures、Runner 与正式输入。要求 Node.js 22 或更新版本以及公共 npm Registry：

```text
cd public-reproducer
npm ci
npm test
```

测试首先核验七个上游 SHA-256，然后调用打包的 CodeFlowMu `GovernanceReader`。记录的干净副本运行和出版预检均得到 14 PASS / 0 FAIL。该复现器让符合性切片可以公开检查，但不表示私有母体仓库或完整应用已经公开。

# 8. 保留的 WP-13 证据门禁案例

WP-13 对工程解释仍有价值，但 I0.8 没有重新执行它。该案例记录了角色分离工作流：带完成含义的声明被暂停，直到持久证据、正式报告与 QA 验证建立。后续 Gate C 裁决接受交付，而 Active、Push/发布与 Archive 仍是独立决定。

该案例支持证据门禁、分阶段权威与同任务恢复，不证明幻觉消除、普遍错误声明检测或 S0.6 符合性。C01–C14 结果来自 V1.6.0 产品 Bundle，不来自 WP-13。

# 9. 三值治理解释

TMPA 将语义判断与视图分类分开：

| 判断 | 典型视图 | 含义 |
|---|---|---|
| `valid` | authoritative | 所需证据与适用规则能够建立结论。 |
| `invalid` | quarantined / rejected | 确定性违规排除受影响的证据或动作。 |
| `undetermined` | partial / disputed / pending_human | 证据缺失、冲突，或仍需授权人工裁决。 |

I0.8 让这种分离可观察。错误类型或自我签发的批准被保留，但不能满足 C07。C09 的缺失引用让依赖主张保持不确定，而不是变成错误或完成。C12 的未授权解决对象仍是证据，但作为解决动作无效。C08 的完整性失败隔离覆盖内容，同时保留来源记录。

# 10. 证据完整性与出版预检

正式压缩包包含 195 个文件，其中 194 个 Payload 文件进入内部 SHA-256 Manifest。外部 SHA-256 为 `3c34514089f08f5957d806f900ab31af1cdae94c08f31a5da046f451b5884fe9`。独立出版预检确认：

- ZIP 结构完整，文件名全部 ASCII；
- 每个文件严格 UTF-8 解码通过；
- 137 个 JSON 文件和 11 条 JSONL 记录通过解析；
- 内部 SHA-256 为 194/194；
- 七份正式 S0.6 输入全部字节相同；
- C01–C14 结果 Envelope 通过 Schema；
- 产品 Reader 被调用，没有用 Reference Reader 替代；
- 自包含复现器得到 14/14 PASS。

最初的 2026-08-09 候选包不进入出版。它包含语义相同但被 Checkout 转换为 CRLF 的正式输入副本、错误的 Manifest 条目计数声明，并且没有自包含公开复跑路径。修正后的 2026-08-10 压缩包是唯一 I0.8 正式主包。

# 11. 限制

1. 产品与全量套件证据由作者运行；没有独立组织认证或采用该实现。
2. CodeFlowMu 实现 Commit 位于本地，不表述为公开 Release、Tag 或完整公开源码树。
3. 公开复现器暴露符合性切片，不包含完整私有 CodeFlowMu 应用及其全部 Runtime/Shell 环境。
4. Runtime 保留 1 项 skipped；FCoP 参考实现在迁移布局下保留 2 项历史样例 skipped。
5. C11 评估固定 Fixture 与已声明排列，不是任意图或敌对平台上的形式证明。
6. C08 演示治理对象完整性处理，不代表模型真实性、身份认证、安装器保护或拜占庭韧性。
7. 全量性能、代表性 SME 成本、比较基线与独立部署仍是开放的经验问题。
8. WP-13 是有限治理案例，不是幻觉消除基准。

# 12. 主张台账

| 主张 | I0.8 处理 |
|---|---|
| TMPA Core S0.6 定义 C01–C14 | **Specified** |
| CodeFlowMu V1.6.0 包含相应产品机制 | **Implemented** |
| 固定产品 Bundle 记录 14/14 PASS | **Demonstrated** |
| 自包含符合性切片可以公开复跑 | **Demonstrated** |
| 完整私有 CodeFlowMu 应用可以公开复现 | **未主张** |
| 结果已独立认证或采用 | **未演示** |
| WP-13 证明消除幻觉 | **禁止结论** |

# 13. 工程结论

I0.8 将 Implementation Case 从精确的 S0.5 产品结果推进到精确输入的 S0.6 产品结果。CodeFlowMu V1.6.0 通过全部十四项强制准则，并直接暴露 S0.6 在来源保留、批准权威和不依赖 Locale 的确定性重建方面的变化。自包含复现器缩小了作者本地产品证据与公开检查之间的差距，同时没有把私有完整应用包装成开源或独立验证。

该结果强化 TMPA 可实现性的工程证据，而不是证明理论逻辑为真。TMPA 理论指导系统设计，Core S0.6 固定受评估要求，FCoP 提供现实协作与证据协议，CodeFlowMu 是受测的应用执行与消费层，WP-13 是有限现场案例。独立采用与更广泛经验评估仍属于后续工作。

# 证据获取

I0.8 正式证据包为 [tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810.zip](https://joinwell52-ai.github.io/joinwell52/evidence/tmpa/i0.8/tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810.zip)。同目录文件 `tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810.zip.sha256` 记录 `3c34514089f08f5957d806f900ab31af1cdae94c08f31a5da046f451b5884fe9`。

I0.7 及其 V1.4.1/S0.5 压缩包继续保留在版本路径。被拒绝的 I0.8 候选包不属于公开出版集合。Git History 是出版版本历史，不存在具有编辑权威的并行论文数据库。

# 参考文献

[1] TMPA Project. “TMPA Core Specification S0.6,” Commit `8989657e8fde6d2e55d7606ae0adacac14fec760`. GitHub, 2026.

[2] TMPA Project. “TMPA Architecture Paper A0.9.” GitHub, 2026.

[3] FCoP Project. “FCoP — File-based Coordination Protocol,” 参考实现 Commit `da79dfefd99f597c9e422ce9edec22157f915a21`. GitHub, 2026.

[4] CodeFlowMu Project. “CodeFlowMu V1.6.0 S0.6 Product Conformance,” 实现 Commit `62440a526a99d2fe55019d8bb95ad2425569fcb4`, 2026.

[5] TMPA Project. “I0.8 CodeFlowMu V1.6.0 S0.6 Evidence,” Package `tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810`, 2026.

[6] CodeFlowMu Project. “WP-13 Multi-Agent Fact-Check Publication Evidence V3,” 2026.

[7] CodeFlowMu Project. “CodeFlowMu V1.4–V1.5 TMPA × FCoP × 应用统一架构”，`docs/TMPA-GOVERNANCE.md`。GitHub，2026。`https://github.com/joinwell52-AI/codeflowmu/blob/main/docs/TMPA-GOVERNANCE.md`。

