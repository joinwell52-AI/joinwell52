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

正式归档为 [tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip](/evidence/tmpa/i1.0/tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip)。相邻文件 `tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip.sha256` 记录 `9b92b06c3e46c8019362f55075be4ed066cb7a9c0d9859945b6c3b7de8840d04`。

该运行已登记到 [S1.0 外部运行注册表](https://github.com/joinwell52-AI/joinwell52/tree/main/research/conformance/tmpa-core-s1.0/external-runs/20260811-codeflowmu-v1.8.0)。早期 I0.6–I0.8 证据包继续作为不可变历史保留在各自版本路径。Git History 是出版历史；没有平行论文数据库拥有编辑权威。

# 参考文献

[1] TMPA Project. “TMPA Core Specification S1.0,” frozen candidate commit `942cbb097eb3d662662f96a2269818ec9d7ca2ed`. GitHub, 2026.

[2] TMPA Project. “TMPA Architecture Paper A1.0.” GitHub, 2026.

[3] FCoP Project. “FCoP — File-based Coordination Protocol,” reference implementation commit `da79dfefd99f597c9e422ce9edec22157f915a21`. GitHub, 2026.

[4] CodeFlowMu Project. “CodeFlowMu V1.8.0 S1.0 Product Conformance,” evidence commit `c1e1f724293e8048fc3a956b6f6df8cf83f54830`, 2026.

[5] TMPA Project. “I1.0 CodeFlowMu V1.8.0 S1.0 Evidence,” package `tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811`, 2026.

[6] CodeFlowMu Project. “WP-13 Multi-Agent Fact-Check Publication Evidence V3,” 2026.

[7] CodeFlowMu Project. “TMPA Governance: Theory-to-Engineering Relation,” `docs/TMPA-GOVERNANCE.md`. GitHub, 2026. `https://github.com/joinwell52-AI/codeflowmu/blob/main/docs/TMPA-GOVERNANCE.md`.
