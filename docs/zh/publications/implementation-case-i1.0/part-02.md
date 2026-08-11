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
