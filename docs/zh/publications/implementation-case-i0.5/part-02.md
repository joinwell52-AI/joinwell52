# 7. 标准级结果

下表中的测试名称与含义直接引用 Core Specification 第 10.2 节；本报告只记录产品证据与剩余缺口。

| ID | 规范测试名称 | 裁决 | 产品证据与剩余缺口 |
|---|---|---|---|
| C01 | Schema 验证 | PARTIAL | FCoP 与 CodeFlowMu 已有 Schema 和验证路径，但完整 TMPA 规范对象覆盖及全部负向格式案例尚未由一个 Core Validator 暴露。 |
| C02 | 主载体与单写者不可变性 | PARTIAL | 独立工件与更正证据已存在；更严格的不可变对象与一任务一主载体观察仍不完整。 |
| C03 | 重复对象 ID | PARTIAL | 局部重复与冲突机制已存在，但相同 ID、不同内容的规范隔离视图尚未端到端暴露。 |
| C04 | 串行流连续性与异步推进 | PARTIAL | 局部排序、依赖等待与异步推进已实现；尚未输出统一规范偏序图与流缺口问题集合。 |
| C05 | 角色权限 | PARTIAL | 角色、Capability 与操作门禁已存在；全部失败尚未规范化为统一权威 TMPA 问题模型。 |
| C06 | 生命周期合法性 | PARTIAL | 直接生命周期测试覆盖非法与未授权迁移，但产品证据尚未同时输出 S0.4 要求的 `ILLEGAL_TRANSITION`/`invalid` 与 `LIFECYCLE_UNDETERMINED`/`undetermined` 两类规范结果。 |
| C07 | 职责分离 | PARTIAL | 独立报告、复核与 Review Gate 已存在，但身份级分离和例外对象处理尚未完整演示。 |
| C08 | 完整性篡改 | NOT RUN | Fixture Oracle 已存在；产品级被覆盖内容 Digest 验证与规范篡改 Reader 未执行。 |
| C09 | 缺失引用 | PARTIAL | 缺失依赖可以阻塞工作，但完整 `undetermined`/partial 图传播与规范问题输出仍不完整。 |
| C10 | 禁止环 | NOT RUN | 禁止环 Fixture 已存在；能够只隔离受影响子图的产品图 Reader 不可用。 |
| C11 | 聚合与重建确定性 | NOT RUN | Fixture Oracle 在 24 种排列下产生字节等价输出；产品级规范图与问题序列化器不可用。 |
| C12 | 冲突保留 | NOT RUN | 冲突保留 Fixture 已存在；产品级确定性 disputed/`undetermined` 视图与授权解决路径未作为一项标准执行。 |
| C13 | 恢复 | PARTIAL | 重启与恢复机制已存在，但没有统一的全新 Reader 重建全部责任、生命周期、依赖与问题状态。 |
| C14 | 终态历史保留 | PASS | 直接 Archive/History 测试保留终态、迁移、先前报告、复核与任务证据。 |

独立的 S0.4 Reference Reader 轨道通过全部 14 项合成 Fixture 断言。这些结果验证可执行解释与确定性 Runner，不验证表中产品。

# 8. 产品投影缺口

Publication 仓库现已包含通用 S0.4 只读 Reference Reader。主要产品缺口因此更具体：两个锁定产品都没有受维护的投影适配器，把各自原生工件转换为该 Reader 消费的 S0.4 来源对象表面。

```text
来源工件
    ↓
保留来源追踪的来源候选
    ↓
规范候选集合
    ↓
偏序流程与责任图
    ↓
规范问题集合
    ↓
valid / invalid / undetermined 判断
    ↓
authoritative / quarantined / partial / disputed / pending_human 视图
```

FCoP 与 CodeFlowMu 已具备独立工件、原子发布、角色检查、生命周期门禁、依赖阻塞、Archive 保留和重启恢复等写入侧与局部控制机制。产品专用投影将直接改善 C03、C05、C09、C13，为 C04/C07 提供基础设施，并建立 C10–C12 所需的产品执行路径。C01 仍有 Schema 覆盖缺口；C02 仍有更严格不可变性缺口；C06 缺少完整的规范三值输出对；C08 需要被覆盖内容的 Digest 证据。CodeFlowMu 还需要可公开取回的锁定源码或复现包。

# 9. Worked Flow 中的三值治理

TMPA 区分语义判断与视图分类：

| 语义判断 | 视图分类 | 含义 |
|---|---|---|
| `valid` | authoritative | 必需证据与规则建立结论 |
| `invalid` | quarantined 或 rejected | 确定性违规排除受影响证据或动作 |
| `undetermined` | partial | 必需证据缺失或不完整 |
| `undetermined` | disputed | 有效证据冲突且没有授权解决 |
| `undetermined` | pending_human | 适用 Profile 要求人工决定 |

代表性复核流程为：

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

`needs_human` 状态保持在图中并可查询，不得被提前表示为 done、approved、failed 或 rejected。依赖该未解决复核的下游对象保持 `undetermined`，直至增加授权决定对象。

S0.4 Reference Reader 已在合成 Fixture 上演示该三值流程。当前 CodeFlowMu 已有等待人工和注意状态，但产品级 Core 判断/视图规范化仍是实现目标，不是已经完整演示的产品声明。

# 10. WP-13：工具结果不确定时的多 Agent 证据门控

## 10.1 研究问题与观察单元

WP-13 记录了一个对 TMPA 三值治理具有直接意义的现场事件：子执行工具结束后给出带有“完成”意味的总结，但同一原始事件也明确保留 `no exit status`、测试未确认、Commit SHA 不可得等限制。研究问题不是“模型为什么产生错误句子”，而是：

> 在 Agent 声明与持久工作事实不闭合时，多 Agent 治理系统能否阻止未经证实的声明进入权威交付链？

观察窗口为 2026-08-05 12:59—13:11（Asia/Shanghai）。公开证据集保留两份 TASK、DEV/QA REPORT、子执行原始 JSONL、300 行 Runtime 事件节选、Git 补丁与 Manifest、5 份 QA JSON、会话摘录与边界说明。该证据集是作者生成的工程证据，不是第三方审计。

## 10.2 从未确认声明到可复核交付

| 阶段 | 可观察事实 | 治理结果 |
|---|---|---|
| DEV 子执行 | 工具事件结束，但内部命令缺少可确认退出状态；测试与 SHA 未确认 | 工具调用结束不等于业务完成 |
| PM 事实复核 | 磁盘上无正式 DEV REPORT，指定测试文件未落盘，Git HEAD 仍为前一 WP | 不放行，不派 QA，不复制新任务 |
| 同任务恢复 | 工具通道恢复后，DEV 补齐实现、测试、Commit `609571dd…` 与 `REPORT-037` | 交付开始具备可核查外部事实 |
| 角色分离 QA | `QA-01` 针对 `DEV-01` 交付重跑 27 项测试、typecheck 与 diff check | 27/27 PASS；typecheck 0；diff check 0 |

这条链不证明模型不再出错。它演示的是**治理层容错**：自然语言声明只是候选证据；在 TASK、REPORT、Git 与测试结果不闭合前，该声明不能改变权威交付状态。

## 10.3 TMPA 三值解释

对观察时刻 `τ₀` 进行 S0.4 后验分析时，“WP-13 已完成”不应被解释为 `valid`，因为必需证据尚不存在或无法确认；也不应直接解释为 `invalid`，因为当时尚未证明实现本身违反验收规则。适当的语义是 `undetermined`，运行视图为 `partial`；PM 等待证据而不放行。

这是对现场证据的 S0.4 分析性投影，不是 CodeFlowMu 当时已输出规范 Reader Envelope 的声明。原生系统没有发布 `LIFECYCLE_UNDETERMINED`、规范问题集与绑定 Profile 的三值结果，所以该案例不使 C06 升级为 PASS。

## 10.4 从 TMPA 到 FCoP 与 CodeFlowMu

| 层级 | 本案例中的实现 |
|---|---|
| TMPA | 区分声明、证据与权威判断；必需证据不完整时保持 `undetermined` |
| FCoP | TASK 作为稳定主载体，REPORT 独立发布，`references`/`depends_on` 保留任务与报告关系 |
| CodeFlowMu | Runtime 记录工具事件与任务状态，PM 执行业务事实复核，DEV 恢复原任务，QA 按分离角色验证 |

| 证据维度 | Specified | Implemented | Demonstrated | Independently Adopted |
|---|---|---|---|---|
| 证据不完整时的三值判断 | S0.4 | 产品有局部等待/复核控制 | WP-13 后验分析 | 否 |
| TASK/REPORT 持久事实链 | FCoP Profile | 是 | 是 | 否 |
| DEV–PM–QA 职责分离 | S0.4/FCoP Profile | 是 | `DEV-01`/PM/`QA-01` | 否 |
| 同任务恢复与证据补齐 | S0.4 恢复目标 | 是 | 是 | 否 |
| WP-13 产品投影适配器与规范 Reader 输出 | S0.4 | 否 | 否 | 否 |

## 10.5 对 C01–C14 的证据贡献

| 标准 | WP-13 增量证据 | I0.5 裁决影响 |
|---|---|---|
| C04 | TASK-019 → REPORT-037 → TASK-020 → REPORT-038 以及 Runtime 事件形成可追踪串行链 | 增强 demonstrated 证据；仍为 PARTIAL |
| C06 | 必需证据不足时不改变权威交付状态 | 没有规范问题码与 Reader 结果；仍为 PARTIAL |
| C07 | DEV 交付、PM 复核、QA 验证不由同一工作角色完成 | 角色分离得到现场演示；身份认证与例外对象仍缺，裁决为 PARTIAL |
| C09 | 中间时刻缺失必需 REPORT、Commit 与测试证据 | 支持证据不完整分析，但未输出规范 `MISSING_REFERENCE`；仍为 PARTIAL |
| C13 | 工具恢复后续办原 TASK，补齐 Git、REPORT 与 QA 证据 | 增强恢复行为证据；没有全新 Reader 等价重建，仍为 PARTIAL |
| C08/C11/C12 | 包含未签名校验和、原始/可读投影对照与相互冲突声明的保留 | 只是支持材料；不替代产品标准执行，仍为 NOT RUN |

其余标准没有由该案例增加可裁决证据。因此，I0.5 保留 I0.4 的产品聚合结果，不对过往未执行项进行重标记。

## 10.6 证据边界

- QA 是角色分离验证，不是外部第三方独立验证。
- `dev-report-037.md` 与 `qa-report-038.md` 保留 `runtime_bound: False`，不是 Runtime 认证证据。
- 证据快照结束时 TASK-019/020 均为 `review / pending`；该包只证明 DEV 交付与角色分离 QA PASS，不证明快照内已有终态批准或归档。
- 同包未签名校验和只验证内部一致性，不证明发布者身份、来源真实性或可信时间戳。
- 本案例演示的是未经证实声明的治理遏制，不是对模型所有幻觉的预防或消除。

完整原始字节包可从 [WP-13 Publication Evidence V3](/evidence/tmpa/i0.5/wp13-multi-agent-fact-check-publication-evidence-v3.zip) 下载，外层 SHA-256 为 `5b5eda3034c822f13421783244b1d0c76a9fa79950bfad0ce61bb8d2e404131c`。

# 11. 可复现性与局限

S0.4 语料库现已位于稳定的公开仓库路径，包含单命令执行、Schema、Profile、Fixture、断言、输出、日志与 SHA-256 Manifest。在固定执行时间戳下重复本地运行可产生字节完全一致的工件。本次维护直接取回 FCoP Commit 并成功重跑选定测试套件；CodeFlowMu Commit 无法从公开仓库取得。尚无第三方重跑或独立验证该语料库。

基线不建立代表性 SME 性能、比较部署成本、广泛容错、独立采用、参与者声明的事实真实性、认证身份、受保护存储或拜占庭韧性。产品与案例证据均由作者产生。公开演示与私有数据生成系统不被声称为同一个可复现公共构建。

下一阶段需要测量安装依赖与耗时、首个团队启动、CPU/内存/存储增长、延迟与乱序证据下的重建、受控中断与重启、冲突和缺失引用注入、人类可检查性、采用负担，以及相对于聊天、共享目录与简单工作流的基线。

# 12. 工程路线

1. 实现受维护的 FCoP 与 CodeFlowMu 投影适配器，同时不改变现有写入行为；
2. 发布或以其他方式提供可取回的 CodeFlowMu 锁定源码与复现包；
3. 执行产品级 C08、C10、C11、C12；
4. 补齐 C01–C07、C09、C13 的规范输出，包括 C06 两个三值分支；
5. 测量低资源部署、重启与增量重建；
6. 获得独立重跑并记录全部差异。

# 13. 证据声明

本报告提供带版本的工程证据，不提供独立验证。最强结论有明确边界：公开 S0.4 Reference Reader 通过 14/14 项合成标准；锁定产品基线为 C14 PASS、9 项 PARTIAL、4 项 NOT RUN，未观察到 FAIL。零 FAIL 不等于完整一致性，因为 4 项产品标准未执行，9 项仍不完整。更强声明需要产品投影、CodeFlowMu 可复现性、更广泛实验与独立复现。

# 14. 工程结论

公开 S0.4 语料库把宽泛工程历史转化为仓库内可测试基线。Reference Reader 通过全部 14 项合成标准；对锁定产品而言，仅 C14 PASS，9 项具有部分证据，4 项未在产品 Reader 层运行。该结果强于无版本演示，但仍弱于完整或独立一致性。

产品已经包含许多写入侧和局部控制机制。新的通用 Reader 建立确定性读取侧参考，而受维护的产品投影适配器仍是最大的共同缺口。C08、C10、C11、C12 的产品执行、其他 PARTIAL 输出的补齐、量化 SME 部署成本与独立复现，仍是分开的经验要求。

# 工件可用性

作者生成的 S0.4 语料库公开位于 [`research/conformance/tmpa-core-s0.4`](https://github.com/joinwell52-AI/joinwell52/tree/main/research/conformance/tmpa-core-s0.4)，包含 Reference Reader、可执行 Profile、Fixture、产品证据断言、外部运行记录、标准结果、汇总、日志和 SHA-256 Manifest。WP-13 案例的边界与映射元数据位于 [`research/cases/wp13-multi-agent-fact-check`](https://github.com/joinwell52-AI/joinwell52/tree/main/research/cases/wp13-multi-agent-fact-check)，完整 V3 证据包位于本站 `/evidence/tmpa/i0.5/`。不再存在单独的 `tmpa-conformance.zip`；Git History 即版本历史。

# 数据可用性

公开演示暴露选定治理视图。私有业务数据、凭证与敏感运行记录不公开。语料库使用选定测试路径、Hash Inventory 与紧凑 Fixture，而不是导出私有生产数据。WP-13 包只包含本案例所需的任务、报告、运行节选、Git 补丁与 QA 结果；原始私有仓库不随包发布。

# 利益冲突与来源

作者是 TMPA、FCoP、CodeFlowMu 的发起者或主要开发者，并参与小典 AI 谱系。全部基线结果均由作者产生，因此更需要锁定版本、保留失败并进行独立复现。

# References

[1] FCoP Project. “FCoP — File-based Coordination Protocol,” repository README and architecture stack. GitHub, 2026. `https://github.com/joinwell52-AI/FCoP`.

[2] FCoP Project. “FCoP Runtime Specification · Single-Page Complete Edition,” 1.2.x specification line, 2026.

[3] FCoP Project. “FCoP IPC Envelope” and related machine-readable JSON Schemas, `spec/schemas/`, 2026.

[4] Python Package Index. `fcop` and `fcop-mcp` distributions, 2026.

[5] Official MCP Registry. `io.github.joinwell52-AI/fcop`, `fcop-mcp` server entry, 2026.

[6] FCoP Project. “ADR-0031: Governance Alert Layer (GAL).” Accepted 2026-05-11.

[7] FCoP Project. “ADR-0032: `fcop_audit()` — Protocol-to-Inspection Compiler.” Accepted 2026-05-12.

[8] CodeFlowMu. “TMPA Browser” public demonstration. `https://demo.chedian.cc/`. Snapshot observed 2026-07-29.

[9] TMPA Project. “TMPA Core S0.4 C01–C14 Conformance Corpus.” Corpus ID `tmpa-s0.4-fcop-codeflowmu-20260803`, executed 2026-08-03. `research/conformance/tmpa-core-s0.4/`.

[10] CodeFlowMu Project. “WP-13 Multi-Agent Fact-Check Publication Evidence V3.” Author-produced evidence snapshot, observed 2026-08-05. `research/cases/wp13-multi-agent-fact-check/`.

# 附录 A：FCoP 端到端工件示例

PM 创建 TASK，DEV Claim 并执行，随后提交独立 DEV REPORT，再由 QA 发布独立 REVIEW。当技术验证通过但生产激活会改变授权边界时，QA 可以返回 `needs_human`。

Reader 重建：

```text
PM 创建 TASK
  ├─ DEV Claim 并执行
  ├─ DEV 提交 REPORT
  ├─ QA 发布 REVIEW：needs_human
  ├─ judgment: undetermined
  ├─ view: pending_human
  ├─ 授权人工批准或拒绝证据
  └─ 最终判断：valid 或 invalid
```

`needs_human` 节点保持在图中并可查询。依赖它的下游对象保持 `undetermined`，直至授权决定对象解决状态。权威记录是来源集合与迁移，不是渲染视图；重新排列输入文件不得改变重建图或问题集合。

## I0.5 理论—实现对齐

FCoP 作为 TMPA 概念的协议实现接受评估；CodeFlowMu 作为结合协议角色、Skill、工具、Runtime 执行、恢复与界面的工程系统接受评估。本报告区分概率型 Agent 执行证据与确定性验证机制，也区分 demonstrated 行为与完整 Core Conformance。
