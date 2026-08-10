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

I0.8 正式证据包为 [tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810.zip](/evidence/tmpa/i0.8/tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810.zip)。同目录文件 `tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810.zip.sha256` 记录 `3c34514089f08f5957d806f900ab31af1cdae94c08f31a5da046f451b5884fe9`。

I0.7 及其 V1.4.1/S0.5 压缩包继续保留在版本路径。被拒绝的 I0.8 候选包不属于公开出版集合。Git History 是出版版本历史，不存在具有编辑权威的并行论文数据库。

# 参考文献

[1] TMPA Project. “TMPA Core Specification S0.6,” Commit `8989657e8fde6d2e55d7606ae0adacac14fec760`. GitHub, 2026.

[2] TMPA Project. “TMPA Architecture Paper A0.9.” GitHub, 2026.

[3] FCoP Project. “FCoP — File-based Coordination Protocol,” 参考实现 Commit `da79dfefd99f597c9e422ce9edec22157f915a21`. GitHub, 2026.

[4] CodeFlowMu Project. “CodeFlowMu V1.6.0 S0.6 Product Conformance,” 实现 Commit `62440a526a99d2fe55019d8bb95ad2425569fcb4`, 2026.

[5] TMPA Project. “I0.8 CodeFlowMu V1.6.0 S0.6 Evidence,” Package `tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810`, 2026.

[6] CodeFlowMu Project. “WP-13 Multi-Agent Fact-Check Publication Evidence V3,” 2026.

[7] CodeFlowMu Project. “CodeFlowMu V1.4–V1.5 TMPA × FCoP × 应用统一架构”，`docs/TMPA-GOVERNANCE.md`。GitHub，2026。`https://github.com/joinwell52-AI/codeflowmu/blob/main/docs/TMPA-GOVERNANCE.md`。
