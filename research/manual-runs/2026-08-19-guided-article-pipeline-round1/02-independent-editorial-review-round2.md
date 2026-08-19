# 2026-08-19｜独立技术编辑复核（Round 2）

## 结论

**总体判定：PASS。**

- Article 1：**PASS，82/90；证据 22/25。**
- Article 2：**PASS，82/90；证据 22/25。** Round 1 的 B2、B3 均已闭环。
- Article 3：**PASS，83/90；证据 22/25。** 10 分钟有界幂等重放、PWA 失败边界与 LAN 5/5 均有相称证据。
- 三篇均达到“内容至少 77/90、证据至少 20/25”的双门槛，没有 REJECT 项。

本轮按内容 90 分重新评分，五个维度依次为选题 20、证据 25、原创洞察 20、结构可读 15、可行动 10；视觉尚未制作，不在本轮分数内。本报告只读复核正文与证据，只新增本报告，不修改六份正文。

## 复核范围与固定快照

复核了当前目录中的 Source Register、Fact–Claim Matrices、Article Briefs、三篇中英文正文、Round 1 报告和新增实验记录，并回到以下固定工程证据交叉检查：

- CodeFlowMu commit `ed5634c718b9e238c44bb70851020c9793546fe6`；
- `DispatchAttemptStore.ts`、`TaskDispatcher.twoPhaseDispatch.test.ts`；
- `atomic-write.test.ts`、`LongHorizonPlanning.test.ts`；
- `mobileBindStore.ts`、`mobilePanelRoutes.ts`、`mobileRoutes.ts`、`mobileDeviceStore.ts`；
- `lanNetwork.test.ts`、`mobilePwaGatewayPublish.ts`、`mobile-pwa-gateway-open-boundary.test.ts`；
- 2026-08-18 已发布的《文件、路径与事件：FCoP 协作状态机如何实现和测试》；
- TMPA Core S1.0、FCoP v3 / ADR-0038 及正文所列外部资料。

当前内容 blob 快照：

| 文件 | Blob |
|---|---|
| `02-source-register.md` | `eec8009ea82652ef4341166e1549c47ad4a790e9` |
| `03-fact-claim-matrices.md` | `c366e63ac53ce7fa2f792eab08e5d73ae4e44575` |
| `04-article-briefs.md` | `988c6710423a150b3ec0abc2777268232768d598` |
| Article 1 zh / en | `2f4a966739827ff85e2aa5005b15bf4ac16f2a35` / `88e261fa0e13d5fbedcd2f191d56619f2228ecb9` |
| Article 2 zh / en | `1fce718bd9e557bb55bdedc2ed9898aa3c78a2dc` / `b19850f13396d5b50d5f3c7132f527b5df7e027c` |
| Article 3 zh / en | `922ac49929d4f6d7d5057e011324d09c0f75d2b7` / `b4097bf3df2f09e1a1dc95e3c65771d012d82918` |
| `09-experiment-run-log.md` | `510c3a535422c8dd3ac3beff1eb1491d9c1d1829` |

## Round 1 阻断项复核

### B2｜Article 2 的 Core / Runtime 归因与 C4 覆盖：已闭环

Article 2 现在先声明：Core C01–C14 是治理基线，Watcher、依赖、派发、会话和 lease 是 CodeFlowMu 产品职责；随后六项逐条标明来源：

1. 身份唯一：Core C03；
2. 双位置冲突可见：Core C06/C12；
3. 历史保留：Core C14；
4. 派发可归因：CodeFlowMu 实现合同；
5. 依赖先满足：Core 引用/无环基线与 CodeFlowMu 调度职责的组合；
6. 失败可重建：Core C13 与本文测试建议的组合。

这种写法没有再把“会话绑定 attempt/lease”“忙 Agent 阻塞”“Gate 阻止启动”等产品职责反向写成 TMPA Core 的单独规定。`03-fact-claim-matrices.md` 的 T2-F2 与 `02-source-register.md` 的 C4 也同步保持了这一边界。

对 C4 的静态核验结果如下：

- `DispatchAttemptStore.ts` 确实定义并持久化 `offered`、`claimed`、`running`、`reported`、`settled` 及多个终态，保存 attempt、lease、session ID、idempotency key，并对重复 offer、lease 冲突和决定冲突作显式处理。
- `TaskDispatcher.twoPhaseDispatch.test.ts` 的 7 个现有用例主要覆盖可信/未知来源路由、重复 hold 不反复追加、依赖阻塞、显式放行、未派发 Gate 与 `session_started`。
- 该文件没有注入“意图落盘后崩溃”或“会话启动后、身份提交前崩溃”。正文现在明确写成“需要补测的提交顺序”“目标合同”，并明确说明不是当前已验证能力。

因此，正文不再越过当前实现与现有测试覆盖，B2 关闭。

### B3｜9 PASS、5 PASS、两个 NOT RUN、一个 executed FAIL：已闭环

`09-experiment-run-log.md` 已具备本次编辑复核所需的可复核要素：固定 commit、dirty 状态及文件清单、Node/npm 版本、时区、每项 cwd、精确命令、起止时间、退出码、runner 摘要、领域测试执行数、错误链、实际值/期望值、裁决与不支持范围。

固定提交与当前工作树的只读检查还确认：HEAD 正是所列 commit，dirty 文件与日志列出的四项一致；本次引用的测试与实现文件相对该 commit 无差异。因此日志所称“非 clean checkout，但相关文件未改”可以复核。

逐项裁决：

| 入口 | 静态测试体 | 日志事实 | Round 2 裁决 |
|---|---:|---|---|
| Atomic write | 9 | exit 0，9 executed / 9 passed | **PASS 9/9** |
| LAN address | 5 | exit 0，5 executed / 5 passed | **PASS 5/5** |
| LongHorizonPlanning | 4 | 导入 `ProductDeliveryGovernance.ts` 时缺 `yaml`；领域测试体 0 executed | **NOT RUN**，不是产品逻辑 FAIL |
| TaskDispatcher two-phase | 7 | 导入 `AgentSdkAdapter.ts` 时缺 `@cursor/sdk`；领域测试体 0 executed | **NOT RUN**，不是行为 PASS/FAIL |
| Open Edition PWA boundary | 1 | 1 executed / 1 failed | **FAIL 1/1**，原因分类仍未裁决 |

Node runner 对两个导入失败文件显示 `tests 1 / fail 1`，是“测试文件加载单元”失败；日志同时明确记录领域测试体 0 executed，没有把 runner 计数偷换成领域用例已执行。这一分类准确。

PWA 用例中，`isRemoteGatewayPublishAvailable(...) === false` 与 `result.ok === false` 先通过；首个发生不一致的断言是错误码：实现返回 `PWA_GATEWAY_PUBLISH_AUTHORITY_EXTERNAL`，测试期望 `OPEN_EDITION_GATEWAY_PUBLISH_DISABLED`。测试在这里停止，后续 `steps === []` 没有执行；实现返回一个非空 step，因此它只能被称为静态合同差异，不能写成第二项运行失败。日志与两篇正文都遵守了这个边界。

该记录足以让独立编辑复核本轮数字与裁决，B3 关闭。它仍不是 clean-checkout 完整套件或第三方复现，正文已经明确限制，未越界。

## Article 2 与 2026-08-18 FCoP 状态机文章的重复度

**重复度已从“中到高”降到“中等、可接受”，不再构成发布阻断。**

当前 Article 2 在开头显式把 8 月 18 日文章设为协议迁移与原子提交的前置阅读，没有再次展开五个生命周期位置、七条迁移、transition 字段、两个 review 或完整 FCoP 写入算法。保留的协议、身份/位置/历史和 rename 内容只承担 Runtime 测试的输入与边界说明。

本文的主体新增价值已经转向：

- 协议、存储、观察、调度/会话、治理五层测试分解；
- Watcher 与 reconciliation 双输入下的重复/漏事件测试；
- `DispatchAttemptStore`、attempt、lease 与两阶段崩溃窗口；
- 可复现 seed 和故障注入夹具；
- PASS / FAIL / NOT RUN 的运行证据纪律；
- 12 项最小 Runtime 故障矩阵。

原子 rename 一节与旧文仍有概念重叠，但换成 CodeFlowMu 的 9 项专项证据，并服务于 Runtime 故障注入论证；在已链接旧文且不重复完整协议教程的前提下，属于必要上下文，而非同题重写。

## Article 3 专项复核

### 10 分钟绑定与幂等重放

固定提交代码显示：

- `/panel/bind-prepare` 的 pending token TTL 为 10 分钟；
- `MobileBindStore.tryConfirm(bindId, token)` 校验 bind ID 下的 token hash，成功后删除 pending；
- `recordSuccess` 以 bind ID 保存成功结果与 token hash；
- 同一 `bind_id/token` 组合在 10 分钟内返回第一次的 `device_id`、`mobile_session_token` 和 `expires_at`；
- 错误、过期或不匹配的组合返回 invalid；
- 设备存储只持久化 session token hash，并支持过期与撤销。

Article 3 准确写出了 pending 单次消费与成功结果的有界幂等重放，也明确说代码存在不等于安全认证，没有再使用“所有重放一律拒绝”的错误模型。

### PWA 边界失败与 steps 静态差异

Article 3 准确区分：当前实现保持远程 PWA 发布为只读/外部权限；现有测试真正执行并在错误码不一致处失败；非空 `steps` 与旧的空数组期望来自静态对照，测试没有运行到第二个差异。正文没有把它包装成全绿，也没有擅自裁决是实现 bug 还是陈旧测试。

### LAN 5/5

`lanNetwork.test.ts` 确有 5 个测试，分别覆盖虚拟网卡识别、Docker 地址排除、真实 LAN 优先、常见 LAN 地址排序和综合可达启发式；日志记录 5/5 PASS。正文把证据限定为地址选择，没有外推到公网、NAT、TLS、Gateway 长稳、弱网或移动端 E2E，边界准确。

## 重新评分

### Article 1｜两万字需求 → 可执行任务图

**PASS｜82/90**

| 维度 | 分数 | 独立判断 |
|---|---:|---|
| 选题 | 18/20 | 长需求漏读、冲突、陈旧批准和不可验收计划构成明确工程问题。 |
| 证据 | 22/25 | TMPA、FCoP、CodeFlowMu 固定提交合同与 Cursor/E2EDevBench 对照足以支撑；未把 NOT RUN 写成通过。 |
| 原创洞察 | 18/20 | “规划是治理编译”与 REQ→WP→Gate→Test→Evidence 组织方式具有原创解释力。 |
| 结构可读 | 14/15 | 六步递进、贯穿案例和清单清楚；少量“轨道机”等隐喻仍可收敛。 |
| 可行动 | 10/10 | Requirement Ledger、WP 九问、DAG/预算和 Gate 清单可直接复用。 |

事实与证据边界通过。Implementation Case I1.0 仍只出现在来源列表而正文未实质使用，属于非阻断编辑冗余。

### Article 2｜文件式多 Agent Runtime 测试

**PASS｜82/90**

| 维度 | 分数 | 独立判断 |
|---|---:|---|
| 选题 | 18/20 | 从 happy path 转向提交边界和可观察裁决，目标读者与问题明确。 |
| 证据 | 22/25 | 规范、固定提交实现、测试源码、09 原始记录与外部方法资料形成闭环；崩溃窗口仍是待测目标而非已证事实。 |
| 原创洞察 | 18/20 | “不变量 × 故障点 × 可观察裁决”、Watcher/reconciliation 双输入和 attempt/lease 崩溃矩阵形成新的 Runtime 论证。 |
| 结构可读 | 14/15 | 分层、故障域、运行裁决和清单顺序清楚；协议基线仍可再压缩，但已非阻断。 |
| 可行动 | 10/10 | 夹具接口、提交顺序和 12 项清单可直接转化为测试计划。 |

B2 与 B3 已闭环，证据超过硬门槛；与昨日文章的重复已降到可接受水平。

### Article 3｜本地执行与手机控制面

**PASS｜83/90**

| 维度 | 分数 | 独立判断 |
|---|---:|---|
| 选题 | 19/20 | “PC 执行、手机控制”直接对应离桌、弱网、权限和双写风险。 |
| 证据 | 22/25 | TMPA、W3C、local-first、固定提交绑定/PWA/LAN 实现与 09 运行记录相互支持，限制充分。 |
| 原创洞察 | 18/20 | 双平面、同一事实源及“旧视图可读、旧决定不可执行”构成独立架构判断。 |
| 结构可读 | 14/15 | 场景、边界、绑定、审批、网络、缓存与清单自然推进；少量英文直译表达可优化。 |
| 可行动 | 10/10 | 15 项清单明确覆盖事实、绑定、移动写、网络与隐私。 |

绑定、PWA 和 LAN 三项专项均通过事实边界检查，Article 3 不再有运行证据阻断。

## 中英文一致性

六份正文的核心主张、数字、错误码、NOT RUN/FAIL 分类、限制和结论一致。没有发现一语种把建议写成现状、把静态差异写成已执行失败，或把 CodeFlowMu 职责归给 TMPA/FCoP 的实质分叉。

## 非阻断编辑建议

以下不影响 PASS，但建议在正式发布包阶段收口：

1. Article 3 中英文的“同一 token / same token”可精确为“同一 `bind_id/token` 组合”，与 Store 的双参数键语义完全一致。
2. PWA 段可写成“首个不一致断言是错误码”，避免“第一处断言失败”被误读为测试文件中的第一个 assert；前两个 assert 实际通过。
3. Article 2 英文 `the next authority allowed to decide` 可改为 `who has authority to decide next`；清单中的 `Repeat observation, not business commit` 可改为完整句。
4. Article 1/3 英文的 `engineering rail`、Article 3 的 `Task line` 与 `idempotent identity` 仍略显直译，可分别改为 `runtime and product layer`、`Task state and hierarchy`、`idempotency key`。
5. 正式站点成稿应把 `./09-experiment-run-log.md` 换成可公开访问且固定版本的证据地址；当前相对链接足以支持本轮目录内复核，但不能假定发布迁移后仍可达。

## 最终门禁

| 文章 | 内容分 | 证据分 | 硬事实阻断 | 判定 |
|---|---:|---:|---|---|
| Article 1 | 82/90 | 22/25 | 无 | **PASS** |
| Article 2 | 82/90 | 22/25 | 无；B2/B3 已关闭 | **PASS** |
| Article 3 | 83/90 | 22/25 | 无 | **PASS** |

**Round 2 内容门禁：PASS。** 可以进入用户正文确认；这不是视觉批准或发布授权。
