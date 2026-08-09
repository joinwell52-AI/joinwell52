# 8. 三值治理解释

TMPA 将语义判断与视图分类分开：

| 判断 | 典型视图 | 含义 |
|---|---|---|
| `valid` | authoritative | 所需证据与适用规则能够建立结论。 |
| `invalid` | quarantined / rejected | 确定性违规排除受影响的证据或动作。 |
| `undetermined` | partial / disputed / pending_human | 证据缺失、冲突，或仍需授权人工裁决。 |

这种区别在 I0.7 中可直接观察。C06 缺少验收并不表示工作为假，而是让完成保持不确定并阻止状态推进。C12 未授权裁决作为证据保留，但作为解决冲突的权威动作无效。C08 隔离被篡改的覆盖内容，同时在 Manifest 中保留失败来源。因此 Reader 既重建可用事实，也重建其他证据被排除或推迟的原因。

# 9. 可复现性与证据质量

正式 V1.4.1 压缩包包含 68 个文件，外部 SHA-256 为 `06f34ce7c6b5008b9adeedc45f68541ce5f3ecff6613c80ff3bb05a12fa61b34`。压缩包完整性、内部 Payload Manifest、严格 UTF-8 解码、JSON/JSONL 解析及内置验证脚本均通过。隐私扫描覆盖 65 个文本文件，未发现问题。

证据包保留：

- 固定源码标识与 Checkout 状态；
- 依赖锁文件与环境元数据；
- 带 Exit Code 与耗时的精确命令；
- 原始 stdout/stderr 与结构化运行摘要；
- 包含 15 项断言的外部产品夹具；
- C01–C14 矩阵与规范化 Actual 输出；
- S0.5 投影与 Reader 的源码摘录；
- 内部 SHA-256 Manifest 与证据验证器。

一个元数据限制被明确保留：采集器没有解析到可执行文件名，因此 `environment.json` 将 npm 记录为 unavailable；但运行记录明确通过 Windows 的 `npm.cmd` 执行，并保留了日志与 Exit Code。这限制了“已捕获 npm 版本”的主张，但不改变已执行测试的裁决。

# 10. 限制

1. 结果由作者在固定 Commit 与固定 Bundle 上执行；尚无独立第三方复跑或认证。
2. Runtime 保留 1 项 skipped；FCoP 在迁移布局下保留 2 项历史样例 skipped。
3. Shell 使用产品原生初始化后的隔离实例；生成文件与源码 Commit 分开记录。
4. C08 演示治理对象完整性处理，不代表安装文件自保护、身份认证或事实真实性。
5. C11 覆盖固定四来源及其全部 24 种排列，不是任意来源数量或对抗环境下的形式证明。
6. 本证据不支持代表性 SME 性能、比较优势、拜占庭韧性或第三方采用主张。
7. WP-13 是有限治理案例，不是幻觉消除基准。
8. 证据采集本身没有创建论文发布、Push、Release 或 Tag；这些出版动作由仓库历史另行治理。

# 11. 主张台账

| 主张 | I0.7 处理 |
|---|---|
| TMPA Core S0.5 定义 C01–C14 | **Specified** |
| CodeFlowMu V1.4.1 包含相应产品机制 | **Implemented** |
| 锁定的作者运行 Bundle 记录 14/14 产品 PASS | **Demonstrated** |
| 结果已由独立第三方复跑或认证 | **未演示** |
| TMPA 已被其他组织独立采用 | **未演示** |
| WP-13 证明消除幻觉 | **禁止结论** |

# 12. 工程结论

I0.7 将实施案例从 I0.6 的混合本地产品基线，推进到干净、可公开获取的 CodeFlowMu V1.4.1 源码锁定与完整的产品级 C01–C14 执行。固定 Bundle 下正式结果为 14 PASS / 0 FAIL。V1.4.0 的两项失败，通过保持生命周期与验收分离、并要求授权冲突解决而关闭。

该结果之所以构成有效工程证据，是因为它保留了精确源码、命令、输出、逐项观察、限制与修复历史。其边界同样重要：它演示实现行为，但不证明 TMPA 理论，不认证所有 CodeFlowMu 部署，也不建立独立采用。FCoP 仍是协议层，CodeFlowMu 是应用层，WP-13 是有限治理案例。

# 证据获取

I0.7 正式证据包为 [tmpa-i0.7-codeflowmu-v1.4.1-evidence-20260809.zip](/evidence/tmpa/i0.7/tmpa-i0.7-codeflowmu-v1.4.1-evidence-20260809.zip)。同目录文件 `tmpa-i0.7-codeflowmu-v1.4.1-evidence-20260809.zip.sha256` 记录 `06f34ce7c6b5008b9adeedc45f68541ce5f3ecff6613c80ff3bb05a12fa61b34`。

V1.4.0 的 12 PASS / 2 FAIL 压缩包作为修复前历史证据保留，但不作为 I0.7 正式主包发布。历史 I0.6 证据包与 WP-13 V3 继续保留在各自版本路径。Git History 是出版版本历史，不存在具有编辑权威的并行论文数据库。

# 参考文献

[1] TMPA Project. “TMPA Core Specification S0.5.” GitHub, 2026.

[2] TMPA Project. “TMPA Architecture Paper A0.7.” GitHub, 2026.

[3] FCoP Project. “FCoP — File-based Coordination Protocol,” version 3.2.4, commit `da79dfefd99f597c9e422ce9edec22157f915a21`. GitHub, 2026.

[4] CodeFlowMu Project. “CodeFlowMu V1.4.1,” commit `1cd403537136b3e915c4646cd306983eaca1d2ce`. GitHub, 2026.

[5] CodeFlowMu Project. “WP-13 Multi-Agent Fact-Check Publication Evidence V3.” GitHub, 2026.

[6] TMPA Project. “I0.7 CodeFlowMu V1.4.1 Evidence,” package `tmpa-i0.7-codeflowmu-v1.4.1-evidence-20260809`, 2026.
