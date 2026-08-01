# 7. 标准级结果与共同缺口

| ID | 裁决 | 当前边界 |
|---|---|---|
| C01 | PARTIAL | Schema 与验证路径存在，但完整 Core 对象覆盖尚未统一 |
| C02 | PARTIAL | 独立工件与更正证据存在，更严格不可变观察尚不完整 |
| C03 | PARTIAL | 局部重复/冲突机制存在，规范隔离视图未端到端输出 |
| C04 | PARTIAL | 局部顺序与异步推进存在，统一偏序图未输出 |
| C05 | PARTIAL | 角色与能力门禁存在，失败尚未统一进入权威问题模型 |
| C06 | PASS | 非法/未授权迁移不改变权威状态 |
| C07 | PARTIAL | 报告与复核分离存在，身份级独立和例外对象未完整验证 |
| C08 | NOT RUN | Fixture 存在，产品级 Digest Reader 未执行 |
| C09 | PARTIAL | 缺失依赖可阻塞工作，三值传播和规范问题输出未完整 |
| C10 | NOT RUN | 禁止环 Fixture 存在，产品图 Reader 未执行 |
| C11 | NOT RUN | 24 种排列的 Oracle 字节等价，产品级序列化器不存在 |
| C12 | NOT RUN | 冲突保留 Fixture 存在，产品级 disputed/undetermined 路径未执行 |
| C13 | PARTIAL | 重启恢复存在，统一全新 Reader 尚不存在 |
| C14 | PASS | 归档历史保留终态、迁移和先前证据 |

14 个 Fixture Oracle 均匹配预期，但 Fixture 一致性不替代产品执行。

共同缺口是统一只读证据图适配器：

```text
来源工件 → 来源候选 → 规范候选集合
        → 偏序流程与责任图 → 规范问题集合
        → valid / invalid / undetermined
        → authoritative / quarantined / partial / disputed / pending_human
```

FCoP 与 CodeFlowMu 已具备大量写入侧和局部控制机制，但缺少把它们规范化为统一治理读模型的适配器。

# 8. 三值治理观察

| 语义判断 | 视图 | 含义 |
|---|---|---|
| `valid` | authoritative | 证据和规则建立结论 |
| `invalid` | quarantined/rejected | 确定性违规排除证据或动作 |
| `undetermined` | partial | 必需证据缺失 |
| `undetermined` | disputed | 有效证据冲突 |
| `undetermined` | pending_human | Profile 要求人工决定 |

代表性流程：

```text
TASK → REPORT → QA REVIEW(needs_human)
                       ↓
          judgment: undetermined
          view: pending_human
          lifecycle: blocked_pending_resolution
                       ↓
              ADMIN DECISION
             ↙              ↘
        approve             reject
          ↓                   ↓
        valid              invalid
```

`needs_human` 节点在图中保持存在并可查询。依赖它的下游对象在授权决定出现前保持 `undetermined`，不得被误判为 done、approved、failed 或 rejected。

# 9. 可复现性与局限

语料库锁定实现版本、现场证据、环境、命令、日志、Fixture 与 Hash，但仍需要稳定公开归档、Release Checksum、一键独立设置和第三方重跑。

基线不建立代表性 SME 性能、比较部署成本、广泛容错、独立采用、事实真实性、认证身份、受保护存储或拜占庭韧性。公开演示与私有数据系统也不被声称为同一个可复现公共构建。

# 10. 工程路线

1. 实现不改变现有写入行为的只读证据图适配器；
2. 输出规范候选、治理图、问题集合和三值判断；
3. 执行产品级 C08/C10/C11/C12；
4. 补齐其余 PARTIAL 的观察表面；
5. 公开语料库、Checksum 与复现说明；
6. 测量低资源部署、重启和增量重建；
7. 获得独立重跑并记录差异。

# 11. 证据声明

本报告提供版本化工程证据，不是独立验证。最强结论是：在锁定修订和选定测试路径上，C06 与 C14 通过；8 项具有真实但不完整的产品证据；4 项具有 Fixture Oracle 但缺少产品 Reader 执行路径；没有直接执行的门禁标准失败。

# 工件与数据可用性

作者生成的 `tmpa-conformance.zip` 包含 Manifest、证据清单、Fixture、Runner、预期/实际输出、Result 和 Log。稳定公开归档仍待完成。私有业务数据、凭证和敏感运行记录不公开。

# 利益冲突与来源

作者是 TMPA、FCoP 和 CodeFlowMu 的发起者或主要开发者，并参与小典 AI 谱系。全部基线结果均由作者产生，因此需要固定版本、保留失败和独立复现。

# References

[1] FCoP Project. `https://github.com/joinwell52-AI/FCoP`.

[2] FCoP Runtime Specification, 1.2.x specification line, 2026.

[3] FCoP IPC Envelope and JSON Schemas, 2026.

[4] `fcop` and `fcop-mcp` packages, 2026.

[5] Official MCP Registry entry `io.github.joinwell52-AI/fcop`.

[6] ADR-0031 Governance Alert Layer, 2026-05-11.

[7] ADR-0032 `fcop_audit()`, 2026-05-12.

[8] CodeFlowMu TMPA Browser, `https://demo.chedian.cc/`.

[9] TMPA C01–C14 Conformance Corpus, `tmpa-draft-v1-c01-c14-20260731`.
