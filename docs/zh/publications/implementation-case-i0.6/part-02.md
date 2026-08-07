# 6. C01–C14 产品结果

| ID | S0.5 标准 | Reader | Product | 产品证据边界 |
|---|---|---:|---:|---|
| C01 | Schema 验证 | PASS | PARTIAL | 已运行选定正负 Schema 路径；未覆盖完整规范对象表面。 |
| C02 | 主载体与不可变性 | PASS | **FAIL** | FCoP 写入表面接受 `parent`，但持久化/读回及发布 Surface Snapshot 未闭合。 |
| C03 | 重复身份 | PASS | PARTIAL | 存在重复/冲突机制；规范产品隔离输出不完整。 |
| C04 | 串行流连续性与异步推进 | PASS | PARTIAL | 排序与依赖机制已运行；未形成完整规范偏序图。 |
| C05 | 角色权限 | PASS | PARTIAL | 角色门禁已运行；完整 S0.5 权限 Issue/Judgment 未输出。 |
| C06 | 生命周期合法性 | PASS | PARTIAL | 生命周期控制已运行；必需的完整三值规范输出未形成。 |
| C07 | 职责分离与人工控制 | PASS | **FAIL** | 人工控制结构存在，但一项强制提示语契约断言失败。 |
| C08 | 完整性篡改 | PASS | NOT RUN | 相邻 Hash 证据不能替代产品标准运行。 |
| C09 | 缺失引用 | PASS | PARTIAL | 失败可见；规范 `undetermined` 传播不完整。 |
| C10 | 禁止环 | PASS | PARTIAL | 本地 Cycle Detection 通过；规范受影响子图隔离未运行。 |
| C11 | 确定性重建 | PASS | NOT RUN | 只有 Reference Reader 完成所需排列等价重建。 |
| C12 | 冲突保留 | PASS | NOT RUN | 存在相邻冲突机制；精确产品标准未运行。 |
| C13 | 恢复 | PASS | PARTIAL | 已演示文件事实恢复；完整全新 Reader 重建未完成。 |
| C14 | 终态历史保留 | PASS | **PASS** | 产品测试支持终态历史与权限行为保留。 |

产品聚合：**1 PASS / 8 PARTIAL / 3 NOT RUN / 2 FAIL**，不构成一致性通过。

# 7. 保留失败分析

## 7.1 C02：FCoP `parent` 闭合

FCoP 的三项失败不等于 FCoP 协议定义失败。它们暴露参考实现的 Release 一致性缺口：可选 `parent` 已出现在当前 API/MCP 表面，但完整写入—持久化—读回路径与保存的 Public Surface Snapshot 尚未全部同步。在同一对象完成完整 Round-trip、Surface Snapshot 通过受控发布更新并重跑全量测试前，C02 保持 FAIL。

## 7.2 C07：人工裁决提示语契约

CodeFlowMu Runtime 测试期望 `需 ADMIN 人工裁定` 或 `需人工裁定`，实际可读输出为 `需 ADMIN/PM 人工裁定`。结构化字段仍正确：`decision=needs_human`、`fact_check_verdict=needs_admin`、`awaiting_pm_decision=true`，Lifecycle 没有推进。

因此，失败原因是提示语契约不一致，不是中文编码损坏。原始强制断言确实失败，C07 必须保持 FAIL，直至产品和测试维护者裁定 `ADMIN/PM` 是预期产品变更还是测试期望过时，完成相应产品或测试修改，并重跑完整 Runtime Acceptance Suite。

# 8. WP-13 多 Agent 证据门控案例

WP-13 研究多 Agent 治理链能否阻止未经验证的完成声明成为权威交付事实。DEV 子执行结束时出现带完成意味的语言，但退出状态、测试、Commit 与正式 REPORT 尚未全部确认。PM 检查持久事实，不放行，也不派 QA。工具恢复后，DEV 在原任务补齐实现、Commit `609571dd…` 与正式报告；角色分离 QA 重跑 27 项测试、Typecheck 与 Diff Check 并通过。

```text
带完成意味的声明
      ↓ 持久证据不完整
PM 事实复核 → 保持等待 / 不放行 / 不派 QA
      ↓ 原任务恢复
DEV Commit + REPORT
      ↓ 独立角色
QA 重跑 + REPORT
      ↓
进入授权裁决的候选证据
```

在第一个观察时刻，“WP-13 已完成”既未被证据建立为 `valid`，也没有被证明为 `invalid`；适当的 S0.5 分析判断是 `undetermined`。这是 TMPA 后验投影，不是原生应用当时已经输出完整 S0.5 Reader Envelope。

该案例演示治理遏制、角色分离、原任务恢复与证据补齐；它不证明消除幻觉、第三方独立验证、原快照内已经终态批准、密码学来源或独立采用。

V3 包记录 `runtime_bound: false`，快照结束时 TASK-019/020 仍为 `review / pending`。Gate C Accept 是之后的独立生命周期事实。`DEV complete`、`QA PASS`、`Gate C accept`、`done` 与 `archive` 不能合并成一个状态。

# 9. 三值治理解释

| 判断 | 常见视图 | 含义 |
|---|---|---|
| `valid` | authoritative | 必需证据与适用规则建立结论。 |
| `invalid` | quarantined / rejected | 确定性违规排除受影响证据或动作。 |
| `undetermined` | partial / disputed / pending_human | 证据缺失、冲突或等待授权人工决定。 |

FCoP 与 CodeFlowMu 已暴露该模型所需的许多来源事实，但 I0.6 不声明任一产品对全部标准都输出完整 S0.5 规范图、Issue Set、Judgment 与 View。Reference Reader PASS 建立可执行解释；产品裁决描述当前投影与执行缺口。

# 10. 可复现性与证据质量

V2 ZIP 含 125 个条目和 122 个 Payload Hash。Archive CRC、SHA-256 Manifest、45 个 JSON、相关 JSONL、经过明确规范化后的严格 UTF-8 解码、文件名安全、绝对路径扫描与凭证扫描均通过。V1/V2 的全部原始日志逐字节一致；V2 只修订摘要、矩阵语言、验证元数据与编码边界。

最强可复核结论是：S0.5 Reference Reader 在固定合成 Fixture 上 14/14 PASS；FCoP 与 CodeFlowMu 的测试计数和失败均保留在原始日志；WP-13 V3 通过内部包验证；产品矩阵遵守“一项强制断言失败即不得 PASS”的严格规则。

该包是作者本地证据，没有签名、独立可信时间戳、第三方重跑，也不是稳定公开的 CodeFlowMu Release Snapshot。

# 11. 局限

1. FCoP、CodeFlowMu 与证据包由项目参与者维护，存在作者偏差。
2. CodeFlowMu 来源是脏的本地工作树，尽管运行使用隔离快照。
3. C08、C11、C12 缺少精确产品执行。
4. 8 项 PARTIAL 缺少完整规范产品输出。
5. C02 与 C07 保留已执行失败。
6. 小典 AI 没有固定 S0.5 包，本轮 NOT RUN。
7. 尚未建立代表性 SME 性能、采用成本、比较基线、广泛故障恢复、拜占庭韧性或第三方采用。
8. 两份规范化 FCoP 日志含 U+FFFD，限制字节级取证声明。

# 12. 工程路线

1. 闭合 FCoP `parent` 持久化/读回与 Release Surface Snapshot，并重跑全量套件。
2. 裁定 CodeFlowMu `ADMIN/PM` 提示语契约，实施批准的产品或测试变更，再重跑完整 Runtime。
3. 发布可取回的干净 CodeFlowMu Candidate 或复现快照。
4. 实现受维护的 FCoP 与 CodeFlowMu S0.5 投影适配器。
5. 执行 C08、C11、C12，并补齐全部 PARTIAL 的规范输出。
6. 在新增小典 S0.5 声明前建立固定证据包。
7. 获得独立重跑并保留全部差异。

# 13. 工程结论

I0.6 把 Implementation Case 从历史 S0.4 基线推进为新的 S0.5 作者运行证据基线。结果刻意保留混合状态：Reference Reader 通过全部 14 项合成标准，产品证据则为 1 PASS、8 PARTIAL、3 NOT RUN、2 FAIL。这比只展示成功更有信息量，因为它在不削弱规范契约的前提下定位了具体实现与投影缺口。

FCoP 仍是协议层，其 Package 是参考实现；CodeFlowMu 仍是下游应用。WP-13 提供一个有边界的多 Agent 治理案例，说明持久证据和角色分离能够遏制未经验证的完成声明。这些工程观察均不证明 TMPA 理论、完整产品一致性或独立采用。

# 工件可用性

完整 V2 证据包：[tmpa-i0.6-local-evidence-20260806-v2.zip](/evidence/tmpa/i0.6/tmpa-i0.6-local-evidence-20260806-v2.zip)，SHA-256：`c55cb41fb90f63216fafe6e5b552f4917e56910d120d3b51486f96eba066c2d0`。可直接审阅的 Matrix、Test Summary、Source Inventory、Package Validation 与 Redaction Metadata 位于 [`research/conformance/tmpa-core-s0.5/external-runs/20260806-local-evidence-v2`](https://github.com/joinwell52-AI/joinwell52/tree/main/research/conformance/tmpa-core-s0.5/external-runs/20260806-local-evidence-v2)。

历史 S0.4 语料库仍位于 [`research/conformance/tmpa-core-s0.4`](https://github.com/joinwell52-AI/joinwell52/tree/main/research/conformance/tmpa-core-s0.4)，WP-13 V3 仍位于本站 `/evidence/tmpa/i0.5/`。Git History 是出版版本历史，不存在具有编辑权威的第二套论文档案。

# References

[1] TMPA Project. “TMPA Core Specification S0.5.” GitHub, 2026.

[2] TMPA Project. “TMPA Architecture Paper A0.5.” GitHub, 2026.

[3] FCoP Project. “FCoP — File-based Coordination Protocol,” tag v3.2.5, commit `b3dc23439c6aaa6a6b3765655b87e5924e0257f9`. GitHub, 2026.

[4] CodeFlowMu Project. Local isolated evidence snapshot based on commit `c4ebc146cb8ef0409a4c9eb571a8f2432ade3bd0`, version `0.3.0-alpha`, captured 2026-08-07.

[5] CodeFlowMu Project. “WP-13 Multi-Agent Fact-Check Publication Evidence V3,” commit `609571ddb22d1fbb2bfb5e54692c07beeef4cf23`, 2026.

[6] TMPA Project. “I0.6 Local Engineering Evidence V2,” package `tmpa-i0.6-local-evidence-20260806-v2`, 2026.
