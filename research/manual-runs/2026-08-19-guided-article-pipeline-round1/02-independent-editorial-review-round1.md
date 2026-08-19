# 2026-08-19｜独立技术编辑复核（Round 1）

## 结论

**总体判定：NEEDS REVISION。**

- Article 1：**PASS**，82/90，证据 22/25。
- Article 2：**NEEDS REVISION**，77/90，证据 19/25；总分刚到内容门槛，但未达到“证据至少 20/25”的硬门禁。
- Article 3：**NEEDS REVISION**，80/90，证据 20/25；绑定令牌语义已在复核期间修正，当前剩余阻断项是本轮测试结果缺少可独立复核的原始运行记录。
- 三篇均未到 REJECT 程度。问题可以通过收窄事实、补运行证据、明确“规范 / 当前实现 / 本文建议”三类身份解决，无需推翻选题。

本轮只审查内容，不给尚未制作的视觉打分。若后续视觉达到 8/10，则三篇分别可达到 90、85、88；但视觉分不能抵消 Article 2 的证据门禁失败，也不能替代 Article 2、3 的运行证据。

## 审查范围与快照

审查了：

- `02-source-register.md`
- `03-fact-claim-matrices.md`
- `04-article-briefs.md`
- `05-article-1-taskbook-to-task-graph.zh.md` / `.en.md`
- `06-article-2-runtime-testing.zh.md` / `.en.md`
- `07-article-3-local-runtime-mobile-control.zh.md` / `.en.md`

并交叉核对：

- TMPA Architecture Paper A1.0、Core Specification S1.0、Implementation Case I1.0 的已发布 Markdown 工件；
- FCoP 固定提交 `a859e6747fe6e5e2d686e0114c77774726d7f748` 的 v3 规范与 ADR-0038；
- CodeFlowMu 固定提交 `ed5634c718b9e238c44bb70851020c9793546fe6` 的规划合同、Runtime、移动绑定、Gateway 发布边界及相关测试；
- E2EDevBench、Cursor Plan Mode / Agent Best Practices、POSIX `rename()`、FoundationDB testing、W3C Web App Manifest / Service Workers、local-first 论文；
- 站内 2026-08-18 的 12 份中英文文章。

复核期间六份正文曾并发增加 CodeFlowMu 固定提交 permalink；本报告以当前磁盘版本为准。写入报告前的 Git blob 快照为：

| 文件 | Blob |
|---|---|
| `02-source-register.md` | `d0793037a4b80ac1c6459f7a743377d49e9ea198` |
| `03-fact-claim-matrices.md` | `1dd4d1763006298996def248fd090fcd23c1463b` |
| `04-article-briefs.md` | `988c6710423a150b3ec0abc2777268232768d598` |
| Article 1 zh / en | `2f4a966739827ff85e2aa5005b15bf4ac16f2a35` / `88e261fa0e13d5fbedcd2f191d56619f2228ecb9` |
| Article 2 zh / en | `e06752bafaccbbf3782c90a208ef824d2887b6e7` / `07502bf8ceb080bd94ebe2a71b43642038ebbb5f` |
| Article 3 zh / en | `56d59c746f9324d438f6a1e9402dce4d3ab2a7a1` / `4ba4b104a981f20181e2e901b2b4aa8a0ae45640` |

## 已在复核期间修复

### R1｜Article 3 的绑定令牌语义已与当前实现对齐

最新版本已经同步修正 Source Register、Claim Matrix、Brief 和 Article 3 中英文正文，并补充 `mobileBindStore.ts` 固定提交 permalink。当前表述准确区分：

- pending 记录带 TTL，只消费一次；
- 首次成功结果被短期保留；
- 同一 `bind_id/token` 在 10 分钟窗口内幂等返回第一次绑定结果；
- 错误、冲突或过期 token 被拒绝；
- 代码存在不等于安全认证。

验收清单也已经改为“pending 单次消费 + 有界幂等重放”，没有再把当前实现写成一律拒绝重放。该项现已闭环，不再是阻断项。

## 剩余阻断项

### B2｜Article 2 把 Runtime 特定不变量过度归因给 TMPA Core，并高估了两阶段派发测试文件的覆盖

涉及：

- `03-fact-claim-matrices.md` 的 T2-F2、C4 支持范围；
- Article 2 zh/en 的“六个不变量”开头（约 `:29`）；
- `02-source-register.md:24`。

Core C01–C14 确实规范身份、来源、主载体 / 单写者、角色权限、生命周期、职责分离、引用、无环、确定性重建、冲突、恢复和终态历史；但正文六条中的“每次模型会话启动绑定派发意图和宿主决定”“业务依赖 / Agent 忙碌 / 人工 Gate 阻止执行”等包含 CodeFlowMu Runtime 的具体职责，不能全部写成由 Core 直接导出的规范要求。

建议改成：

> “把 TMPA Core 的治理不变量与 CodeFlowMu 当前 Runtime 的派发职责组合起来，可以得到以下六个测试坐标。”

并为第 4–6 条分别标注“Core 基线”“CodeFlowMu 实现合同”或“本文建议”。

另外，`TaskDispatcher.twoPhaseDispatch.test.ts` 当前可见用例主要覆盖可信 / 未知来源路由、重复 hold 不反复追加、依赖阻塞、控制面显式放行及 session started；没有直接注入“写入派发意图后崩溃”或“会话启动后、提交身份前崩溃”。`02-source-register.md` 不应写成该测试已经覆盖这些崩溃提交边界。若要保留两阶段实现事实，应改引 `TaskDispatcher.ts`、DispatchAttemptStore 相关实现；若要声称崩溃路径已测试，必须找到或新增对应测试证据。

### B3｜9 PASS、5 PASS、两个 NOT RUN、一个 FAIL 缺少可独立复核的本轮原始运行记录

数字与当前测试文件中的用例数量相符，分类逻辑也与 Core S1.0 一致：

- `atomic-write.test.ts` 有 9 个测试；
- `lanNetwork.test.ts` 有 5 个测试；
- 依赖缺失且未进入测试体应为 NOT RUN，而不是 PASS 或产品 FAIL；
- PWA 边界测试实际执行后发生断言不一致，应为 FAIL，语义原因仍待维护者裁决。

但当前轮次目录只保存了汇总表，没有保存命令、cwd、Git SHA / dirty 状态、Node 与包管理器版本、起止时间、退出码、stdout、stderr、加载到的测试数及错误栈。因此独立编辑只能确认“汇总内部自洽”，不能确认这些命令确实在所述环境按所述结果执行。

修订要求：新增一个只追加的实验记录（Markdown 或 JSON 均可），逐个保存：

- 固定提交与工作树状态；
- 精确命令和 cwd；
- Node / npm 或 pnpm 版本；
- 开始 / 结束时间与时区；
- exit code、stdout、stderr；
- executed assertion/test count；
- PASS / FAIL / NOT RUN 的裁决及理由；
- PWA 用例的 actual / expected；
- `yaml`、`@cursor/sdk` 的实际导入错误链，证明测试体为 0 executed。

然后让 Article 2、3 在数字首次出现处链接该运行记录。只链接测试源码不能证明“本轮跑过”。

## 逐篇评分与修订建议

### Article 1｜两万字需求 → 可执行任务图

**判定：PASS｜82/90**

| 维度 | 分数 | 判断 |
|---|---:|---|
| 选题 | 18/20 | 面向长任务漏要求、批准陈旧和不可验收计划，问题清晰且有现实价值。 |
| 证据 | 22/25 | TMPA、FCoP、CodeFlowMu 规划合同与外部对照均能支撑；固定提交链接已经补齐。 |
| 原创洞察 | 18/20 | “规划是治理编译而非摘要”以及 REQ→WP→Gate→Test→Evidence 链条具有明确原创组织价值。 |
| 结构可读 | 14/15 | 六步结构、贯穿案例和清单清楚；个别隐喻略多。 |
| 可行动 | 10/10 | Ledger、WP 九问和开工清单可直接复用。 |

事实边界：**通过。** TMPA / FCoP / CodeFlowMu 分层准确，没有把 FCoP 写成调度器；没有把 I1.0 的 14/14 外推到当前 HEAD；E2EDevBench 只用于说明规划、执行、验证都可能失败，并明确不构成方法效果证明。

非阻断优化：

- 英文 `decidable engineering artifacts` 容易被理解为计算理论意义上的“可判定”；建议改为 `artifacts ready for review and authorized decision`。
- `CodeFlowMu is the engineering rail` 较像项目口号；英文可改为 `CodeFlowMu supplies the implementation/runtime layer`，中文“工程轨道机”可改为“工程运行时与产品层”。
- “每个 REQ 是否至少映射到 WP、Gate、Test 或 Evidence 中需要的组合”略含糊；可直接复述合同的完整链，并说明非每条 REQ 都必须机械创建独立 WP。
- `Implementation Case I1.0` 只列在文末而正文未实质使用。可删除该条，或在证据边界段说明它只证明固定 S1.0 Bundle 的作者运行证据，避免参考文献堆砌。

### Article 2｜文件式多 Agent Runtime 测试

**判定：NEEDS REVISION｜77/90；证据门禁未过**

| 维度 | 分数 | 判断 |
|---|---:|---|
| 选题 | 18/20 | 从 happy path 转向不变量与故障点，面向 Runtime 工程师，价值明确。 |
| 证据 | 19/25 | 规范、代码和外部方法来源扎实，但当前运行结果缺原始日志，且 C4 测试覆盖被写得过强。 |
| 原创洞察 | 16/20 | “不变量 × 故障点 × 可观察裁决”有价值；协议 / 路径 / 事件 / rename 段与 8 月 18 日文章语义重叠较多。 |
| 结构可读 | 14/15 | 分层清楚，12 项清单有效；前半部分可更快进入 Runtime 特有问题。 |
| 可行动 | 10/10 | 故障注入夹具和最小场景表可直接转成测试计划。 |

事实边界：**大体正确，但 B2、B3 阻断。** POSIX rename 的原子名称替换边界、`fsync(file)` 不等于目录项持久、FoundationDB 的确定性模拟 / 故障注入、PASS / FAIL / NOT RUN 的区分都写得谨慎。PWA 测试“测试已执行但当前实现与旧期望不一致”的描述准确，也没有擅自判定实现或测试哪一方必然正确。

必须修订：

- 按 B2 把六个不变量的来源拆开，不能全归因于 Core。
- 按 B2 收窄 `TaskDispatcher.twoPhaseDispatch.test.ts` 的覆盖描述。
- 按 B3补可复核运行记录，并在 9/9、5/5、NOT RUN、FAIL 旁放链接。

降低重复度的建议：

- 2026-08-18《文件、路径与事件：FCoP 协作状态机如何实现和测试》已经完整讲过身份、路径、事件、原子提交和“四层不变量”。本文没有逐句复制，但语义重复明显。
- 将“协议和 Runtime 分开”“六个不变量”“rename 边界”压缩为约 20% 篇幅，并显式链接昨日文章作为协议层前置阅读。
- 把腾出的篇幅用于真正新增内容：DispatchAttemptStore 状态机、Watcher + reconciliation 的双输入测试、offer/claim/running/settled 提交点、崩溃矩阵，以及本轮结果表的可复核证据。

英文小修：

- `the next authority allowed to decide` 改为 `who has authority to decide next` 更自然。
- `Repeat observation, not business commit` 改为 `Repeated observation must not create a second business commit`。
- `weak durability` 在表格中略抽象，可写成 `directory entry not durable after power loss`。

### Article 3｜本地执行与手机控制面

**判定：NEEDS REVISION｜80/90；证据 20/25 已达门槛，但运行证据仍需补齐**

| 维度 | 分数 | 判断 |
|---|---:|---|
| 选题 | 19/20 | “PC 执行 / 手机控制”场景具体，弱网、版本和权限边界切中真实产品风险。 |
| 证据 | 20/25 | TMPA、W3C、CodeFlowMu 与 LAN/PWA 证据组合合理；绑定 token 语义已经修正，但测试运行仍缺原始日志。 |
| 原创洞察 | 18/20 | 双平面、同一事实源、旧视图可读而旧决定不可执行，形成了独立架构判断。 |
| 结构可读 | 14/15 | 场景、架构、绑定、审批、网络、清单依次展开，整体自然。 |
| 可行动 | 9/10 | 15 项清单实用；其中绑定条目需先区分当前实现与目标合同。 |

事实边界：**TMPA / FCoP / CodeFlowMu 边界正确；仅 B3 仍阻断。** 正文正确说明 Manifest 与 Service Worker 不能为长任务 Runtime 提供持续进程保证，也明确 PWA 不属于 FCoP 协议能力。绑定 pending 单次消费与 10 分钟有界幂等重放已经写准；LAN 5/5 的限制、公网 / NAT / TLS / 弱网未验证、PWA 发布权限漂移未裁决等边界也写得充分。

必须修订：

- 按 B3 链接 LAN 5/5 与 PWA FAIL 的原始运行记录；LAN 数字旁同时放 `lanNetwork.test.ts` 固定提交链接。

英文小修：

- `Task line` 不自然，建议 `Task state and hierarchy`。
- `idempotent identity` 改为 `idempotency key`。
- `CodeFlowMu is the engineering rail` 改为 `CodeFlowMu provides the runtime and product layer`。
- `A complete binding lifecycle should include` 已紧接当前实现与 replay window 的事实说明，含义基本清楚；若要进一步避免误读，可改为 `A target binding lifecycle should include`。

## 数字、裁决与限制复核

| 项目 | 复核结果 | 说明 |
|---|---|---|
| I1.0：14/14、71、889 | 准确，但正文基本未使用 | 已发布 I1.0 记录 14 PASS、71 项强制断言、889 文件 Manifest；只能证明固定 Bundle 的作者运行证据。 |
| Atomic write：9/9 PASS | 汇总内部一致，外部可复核不足 | 测试文件确有 9 个用例；需原始命令与输出证明本轮执行。 |
| LAN：5/5 PASS | 汇总内部一致，外部可复核不足 | 测试文件确有 5 个用例；只覆盖地址选择启发式。 |
| Long-horizon：缺 `yaml` | NOT RUN 分类正确 | 需保存实际导入错误链和 0 executed tests。 |
| Two-phase dispatch：缺 `@cursor/sdk` | NOT RUN 分类正确 | 需保存实际导入错误链；同时收窄测试文件的能力描述。 |
| PWA boundary：1 FAIL | 分类正确 | 实现返回新错误码与非空 steps；测试预期旧错误码与空 steps。测试会先在错误码断言处失败，steps 差异来自静态对照。 |
| 12 项、15 项清单 | 准确标为本文建议 | 不是 Core 或 FCoP 的官方数字，正文已明确说明。 |

## 中英文一致性

六份正文的结构、数字、结论和限制总体一致，没有出现一语种写 PASS、另一语种写 FAIL，或一语种扩大功能边界的情况。Article 3 的绑定 token 问题在中英文中同步存在，因此必须同步修改，不能只修一版。

英文整体达到技术文章可读水平，主要问题是少量直译式名词与项目隐喻，不影响事实但会削弱自然度：`engineering rail`、`task line`、`idempotent identity`、`decidable artifacts`。建议按逐篇意见统一替换。

## 与 2026-08-18 站内文章的重复度

**没有发现逐段或逐句复制，三篇均有新的中心问题；但 Article 2 存在明显的语义重叠，需要主动压缩。**

| 新文章 | 最接近的 2026-08-18 文章 | 判断 |
|---|---|---|
| Article 1 | 《在 Cursor 里带一支 AI 开发团队》 | 低到中等重叠。昨日文章讲角色、需求卡、TASK/REPORT 与验收；本文新增 EOF/digest、Requirement Ledger、WP DAG、预算和 digest-bound Planning Gate，中心主张不同。 |
| Article 2 | 《文件、路径与事件：FCoP 协作状态机如何实现和测试》 | 中到高语义重叠。身份、路径、事件、rename 与不变量已有完整说明；本文的新价值在 Runtime 分层、Watcher/reconciliation、两阶段派发、故障注入和裁决纪律，应把篇幅明显移向这些部分。 |
| Article 3 | 《“用户角色”响应不等于真人审批》《持久化不等于唤醒机制》 | 中等概念邻接，但中心不同。旧文讲审批身份与 reconciliation；本文新增本地执行 / 手机控制双平面、设备绑定、LAN/Gateway 和弱网版本化写操作，足以成立独立文章。 |

## Round 2 通过条件

1. 修正 Article 2 对 Core 与 CodeFlowMu Runtime 的归因，并收窄 C4 测试覆盖。
2. 保存并链接本轮五组测试的原始运行证据；若无法补证，就把正文数字改为“登记册记录，但本次独立复核未取得原始日志”，不得写成已独立确认。
3. Article 2 压缩昨日已经完整讲过的 FCoP 状态机基础，把新增篇幅用于 Runtime 特有机制和真实运行矩阵。
4. 中英文同步修改并重新核对数字、错误码、限制和链接。

绑定令牌语义已在本轮复核期间闭环。完成以上第 1–2 项后，Article 2 的证据分可重新评到 20/25 以上，Article 3 可解除剩余阻断；完成第 3 项后，Article 2 的原创洞察预计可提升至 17–18/20。
