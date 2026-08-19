# 2026-08-19｜定向资料登记册

访问基准：2026-08-19（Asia/Shanghai）。本文档只登记本轮三篇文章实际使用的资料，并明确每个来源能证明与不能证明什么。

## 自有已发布研究与规范

| ID | 来源身份 | URL / 本地锚点 | 支持范围 | 不支持范围 |
|---|---|---|---|---|
| O1 | TMPA 架构论文 A1.0，已发布研究论文 | [中文网页](https://joinwell52-ai.github.io/joinwell52/zh/publications/tmpa-architecture-paper-a1.0)；`docs/public/releases/tmpa/v1.0/artifacts/tmpa-architecture-paper-a1.0-zh.pdf` | 文本作为持久消息与状态载体；稳定主载体；单对象单写者；多写者异步流；治理 Reader 重建偏序图；TMPA、FCoP、CodeFlowMu 的层级关系；证据成熟度边界 | 不能证明任意运行时都可靠，也不能证明生产率、成本或长期可靠性的因果提升 |
| O2 | TMPA Core Specification S1.0，唯一规范性来源 | [中文网页](https://joinwell52-ai.github.io/joinwell52/zh/publications/tmpa-core-specification-s1.0)；`docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-zh.pdf` | C01–C14；身份、来源、角色权限、生命周期、事实/接受分离、完整性、引用、无环、确定性重建、冲突保留、恢复和终局历史；测试清单与 PASS/FAIL/PARTIAL/NOT RUN 语义 | 不规定某个 PWA 页面、调度算法或特定网络部署；Schema 通过不等于事实为真 |
| O3 | TMPA Implementation Case I1.0，已发布工程案例 | [中文网页](https://joinwell52-ai.github.io/joinwell52/zh/publications/implementation-case-i1.0)；`docs/public/releases/tmpa/v1.0/artifacts/tmpa-implementation-case-i1.0-zh.pdf` | CodeFlowMu V1.8.0 对精确 S1.0 Bundle 的作者运行证据：14/14 标准、71 条断言；冻结提交、命令、日志、失败与修复历史、清洁复现器、889 文件清单 | 不是独立认证；不是对当前 HEAD 的重新证明；没有代表性 SME、性能、生产率或任意 Profile 结论 |
| O4 | FCoP v3 规范，协议一手资料 | [固定提交规范](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/spec/fcop-v3-spec.md) | 文件承载协议、路径定义当前状态、事件记录历史；TASK/REPORT/ISSUE/REVIEW；生命周期与合法迁移 | FCoP 不执行任务、不拥有模型会话、不提供全局调度或移动控制面 |
| O5 | FCoP 边界章程 ADR-0038 | [固定提交 ADR](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/adr/ADR-0038-fcop-boundary-charter.md) | 解释协议与 Runtime/产品/编排器的边界 | 不能作为 CodeFlowMu 当前实现行为的证据 |

## CodeFlowMu 当前工程实现

当前本地核验提交：`ed5634c718b9e238c44bb70851020c9793546fe6`。该提交用于“代码存在什么机制”的事实定位，不替代正式发布证据。

| ID | 来源身份 | 本地锚点 / 公开入口 | 支持范围 | 不支持范围 |
|---|---|---|---|---|
| C1 | 长任务规划技能与合同 | `skills/pm-long-horizon-planning/SKILL.md`；`references/planning-model-contract.md`；`references/planning-gate-contract.md`；[CodeFlowMu 仓库](https://github.com/joinwell52-AI/CodeFlowMu-open) | EOF 完整读取、源 SHA/行数、Requirement Ledger、REQ→WP/Gate/Test/Evidence 覆盖、DAG/预算、摘要与 digest 绑定、只开放 WP-00 | 这是本项目的方法与实现合同，不是行业通用标准；当前重跑因缺少 `yaml` 未执行到测试体 |
| C2 | 长任务规划实现 | `packages/codeflowmu-runtime/src/pm/LongHorizonPlanning.ts`、`PlanningGateStore.ts` | body/source/validation digest、blocking findings、旧批准失效、Planning Gate 决定绑定当前 revision/digest | 代码静态存在不等于当前环境已经完成全套运行验证 |
| C3 | 原子写入测试 | `packages/codeflowmu-runtime/src/_internal/__tests__/atomic-write.test.ts` | 当前临时重跑 9/9 通过；覆盖临时文件、替换、有限重试及平台错误分支 | 不证明目录项在掉电后的持久性，不证明 exactly-once，不覆盖任意网络文件系统 |
| C4 | 派发实现与现有测试 | `packages/codeflowmu-runtime/src/scheduler/DispatchAttemptStore.ts`；`__tests__/TaskDispatcher.twoPhaseDispatch.test.ts` | Store 实现 offered/claimed/running/terminal attempt、lease、幂等 offer 与冲突决定；现有测试主要覆盖可信/未知来源、重复 hold、依赖阻塞、显式放行及 session started | 当前测试没有直接注入“意图落盘后崩溃”或“会话启动后、身份提交前崩溃”；本轮又因缺少 `@cursor/sdk` 未加载测试体，应记 NOT RUN |
| C5 | LAN 网络测试 | `codeflowmu-shell/src/__tests__/lanNetwork.test.ts` | 当前临时重跑 5/5 通过，支持局域网地址选择的有限实现事实 | 不证明公网可达、Gateway 可靠性或移动端端到端安全性 |
| C6 | 移动绑定与控制面实现 | `codeflowmu-shell/src/mobile/mobilePanelRoutes.ts`、`mobileBindStore.ts`、`mobileDeviceStore.ts`、`mobileGatewayClient.ts` | 短期绑定令牌、TTL、pending 单次消费、完成后 10 分钟同 bind_id/token 的幂等重放窗口；长期设备记录保存会话令牌哈希，但进程内 completed map 会在该窗口暂存首次 `mobile_session_token` 以返回相同结果；设备状态、Gateway 连接/重连及移动路由 | 不能简写成“系统只保存凭据摘要”，也不能把代码存在写成安全认证；弱网与所有攻击面未被完整证明 |
| C7 | Open Edition PWA 发布边界 | `mobilePwaGatewayPublish.ts` 与 `mobile-pwa-gateway-open-boundary.test.ts` | 当前实现明确返回只读/外部发布权限；当前测试仍期待旧错误码并因此失败，暴露合同漂移 | 不能声称当前测试套件全绿；不能把失败直接归因于产品功能错误，需区分实现迁移与测试陈旧 |
| C8 | 本轮专项实验原始记录 | `02-experiment-run-log.md` | 固定提交、dirty 状态、Node/npm、命令、cwd、起止时间、退出码、原始输出、执行数与 PASS/FAIL/NOT RUN 裁决 | 非 clean checkout；不是完整套件或独立第三方复现；只支持所列五个入口 |

## 外部独立资料

| ID | 来源身份 | URL | 支持范围 | 不支持范围 |
|---|---|---|---|---|
| E1 | E2EDevBench 论文 | [arXiv 2511.04064](https://arxiv.org/abs/2511.04064) | 长链路软件开发中规划、执行、验证均可能成为失败根因；论文报告 50 个 PyPI 项目与多工作流实验 | 不能证明 CodeFlowMu 方法优于其他方法；论文对部分根因的解释含作者推断，不是因果证明 |
| E2 | Cursor 官方 Plan Mode | [官方博客](https://cursor.com/blog/plan-mode)；[Agent 最佳实践](https://cursor.com/blog/agent-best-practices) | 复杂任务先研究代码、提问、形成可编辑计划并等待批准；小任务未必需要详细计划 | 不提供 Requirement Ledger、digest 绑定或本项目的 Planning Gate 合同 |
| E3 | POSIX rename 规范 | [The Open Group rename](https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html) | 同一文件系统语义下 rename 的原子名称替换边界 | 不等于无死锁、exactly-once、掉电持久性或跨挂载点原子性 |
| E4 | FoundationDB 测试资料 | [Simulation and Testing](https://apple.github.io/foundationdb/testing.html) | 用确定性模拟、可复现 seed 与故障注入寻找并发/恢复缺陷的方法价值 | FoundationDB 的成熟度不能转移为 CodeFlowMu 的成熟度 |
| E5 | W3C Web App Manifest | [规范草案](https://www.w3.org/TR/appmanifest/) | PWA 安装元数据、作用域和启动体验 | 不提供持续执行 Agent 的运行时保证；当前文档仍是 Working Draft |
| E6 | W3C Service Workers | [规范](https://www.w3.org/TR/service-workers/) | 事件驱动、缓存与网络代理；用户代理可终止 worker | Service Worker 不是可靠的长任务执行进程，不能替代本机 Runtime |
| E7 | Local-first 论文 | [论文页面与 DOI](https://martin.kleppmann.com/2019/10/23/local-first-at-onward.html) | 本地优先的数据所有权、离线可用与同步设计原则 | 不能证明本项目双端架构已解决全部同步、安全和冲突问题 |

## 现行重跑记录

| 日期 | 命令范围 | 结果 | 解释 |
|---|---|---|---|
| 2026-08-19 | `atomic-write.test.ts` | 9 passed | C8 R1；可用于文章 2 的当前有限证据 |
| 2026-08-19 | `lanNetwork.test.ts` | 5 passed | C8 R4；可用于文章 3 的当前有限证据 |
| 2026-08-19 | `LongHorizonPlanning.test.ts` | 领域测试体 0 executed；缺少 `yaml` | C8 R2；NOT RUN，不能写成行为失败或通过 |
| 2026-08-19 | `TaskDispatcher.twoPhaseDispatch.test.ts` | 领域测试体 0 executed；缺少 `@cursor/sdk` | C8 R3；NOT RUN，不能写成行为失败或通过 |
| 2026-08-19 | `mobile-pwa-gateway-open-boundary.test.ts` | 1 executed / 1 failed | C8 R5；当前实现使用 `PWA_GATEWAY_PUBLISH_AUTHORITY_EXTERNAL`，测试仍期待 `OPEN_EDITION_GATEWAY_PUBLISH_DISABLED`；属于待判定的契约/测试漂移 |
