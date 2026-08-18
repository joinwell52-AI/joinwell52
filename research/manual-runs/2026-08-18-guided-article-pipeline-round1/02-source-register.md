# 写作阶段来源登记表

访问日期统一为 2026-08-18。项目内来源均按本轮读取时的提交固定：FCoP `a859e6747fe6e5e2d686e0114c77774726d7f748`，CodeFlowMu-open `ed5634c718b9e238c44bb70851020c9793546fe6`。

## 共同来源

| 来源 | 身份 | 支持范围 | 不支持范围 |
| --- | --- | --- | --- |
| [Ritchie & Thompson, The UNIX Time-Sharing System](https://pdos.csail.mit.edu/6.828/2014/readings/ritchie78unix.pdf) | Unix 设计者原始论文，全文 15 页已读 | 分层文件系统、路径、文件/设备/进程间 I/O 的兼容接口、过滤器组合，以及简单接口带来的工程经济性 | 不支持“所有对象都必须是文件”，不支持文件天然解决并发、持久性或分布式一致性 |
| [H. Penny Nii, The Blackboard Model of Problem Solving](https://ojs.aaai.org/aimagazine/index.php/aimagazine/article/view/537) | AI Magazine 同行编辑期刊页面 | 共享黑板作为多个知识源逐步贡献中间结果的经典协调模型；系统设计存在多种变体 | 不支持把黑板等同于文件系统，也不证明 FCoP 优于队列或数据库 |
| [Anthropic, Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) | 模型提供商工程文章 | 编排者—执行者、评估者—优化者等工作流；从环境获得 ground truth；复杂度应与任务匹配 | 不支持 FCoP 实现细节，也不证明某一编排模式普遍最优 |
| [FCoP v3 单页规范](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/spec/fcop-v3-spec.md) | 本项目规范性来源 | “文件承载协议、路径表达状态、事件记录历史”；四类 IPC、五个生命周期位置、迁移和边界 | 不支持 FCoP 是行业标准；不支持其承担模型调用、任务执行、沙箱或全局调度 |
| [ADR-0038：FCoP Boundary Charter](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/adr/ADR-0038-fcop-boundary-charter.md) | 本项目架构决策 | FCoP 负责描述、外化和协调；不负责执行、拥有和编排；“Agent POSIX”是边界类比 | 不支持把路线图目标写成已验证能力 |

## 题一：文件起步的治理价值

| 来源 | 身份 | 支持范围 | 不支持范围 |
| --- | --- | --- | --- |
| [FCoP Tetris dogfood 证据目录](https://github.com/joinwell52-AI/FCoP/tree/a859e6747fe6e5e2d686e0114c77774726d7f748/docs/tutorials/assets/tetris-en/evidence) | 项目自用的一手定性记录 | 规格遗漏、执行者猜测、审查驳回与重新派工可被文件工件保留 | 单个案例不能证明普遍效果、生产规模或统计显著性 |
| `docs/zh/digital-employee/architecture.md` | Research Center 内部定位文档 | 人、Agent、控制平面、工件平面的分层；明确“已实现”与“目标” | 草案不是稳定规范，不能独立证明运行效果 |

## 题二：FCoP 状态机实现与测试

| 来源 | 身份 | 支持范围 | 不支持范围 |
| --- | --- | --- | --- |
| [FCoP 3.2.5 release note](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/docs/releases/3.2.5.md) | 本项目版本说明 | worker 报告后停止；归档由 ADMIN/leader 执行；parent 为一等字段 | 文档仍把 PyPI 标为待发布，不能据此声称 3.2.5 已发布到包仓库 |
| [FCoP lifecycle tests](https://github.com/joinwell52-AI/FCoP/tree/a859e6747fe6e5e2d686e0114c77774726d7f748/tests/test_lifecycle) | 可执行项目测试 | 创建、合法迁移、非法迁移拒绝、全链路、归档幂等等行为 | 单机临时目录测试不等于跨机、网络文件系统或高并发证明 |
| [POSIX.1-2024 rename](https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html) | The Open Group 标准 | 在规范条件下 rename 动作具有原子性；EXDEV 等错误限制了跨文件系统重命名 | 不支持 rename 自动提供持久性、锁、租约、无死锁或 exactly-once |
| [POSIX Base Definitions rationale](https://pubs.opengroup.org/onlinepubs/9799919799/xrat/V4_xbd_chap01.html) | The Open Group 解释性材料 | 目录操作原子且可串行化，但不一定持久；需要按要求同步文件和目录 | 不支持所有文件系统、挂载方式和故障模型具有同样行为 |

本轮复跑：在 `D:\TMPA\FCoP` 执行 `python -m pytest tests/test_lifecycle/test_atomic.py tests/test_lifecycle/test_project_v3_writes.py -q`，结果为 `22 passed in 0.89s`。这是当前工作树的局部测试结果，不是完整测试套件或性能基准。

## 题三：Cursor 中的一人 AI 开发团队

| 来源 | 身份 | 支持范围 | 不支持范围 |
| --- | --- | --- | --- |
| [CodeFlowMu-open README](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/README.md) | 项目公开实现说明 | 公开版的 PM/DEV/OPS/QA、独立 EVAL、FCoP 工件、PC/PWA 观察面与人工批准链 | 不支持私有版能力、其他模型提供商或广泛生产采用 |
| [CodeFlowMu edition boundary](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/docs/open/edition-boundary.md) | 项目公开边界说明 | 公开版与生产私有版边界，避免把路线图或私有实现混入教程 | 不证明实际效率提升 |
| [CodeFlowMu release and initialization boundary](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/docs/open/release-and-initialization.md) | 项目公开运行边界说明 | PM 最终 REPORT 后自动生成 EVAL 旁路观察；QA 等待 DEV 依赖的当前规则 | 不支持 EVAL 修改 lifecycle 或代替 PM/ADMIN 接受 |
| [Cursor Plan Mode](https://cursor.com/docs/agent/plan-mode) | Cursor 官方文档 | Agent 研究代码库、提出澄清问题并生成可编辑、可确认的实施计划 | 不支持计划自动成为团队契约，也不支持多个会话自动形成有治理的团队 |
| [Cursor reviewing and testing](https://cursor.com/learn/reviewing-testing) | Cursor 官方指南 | diff view 可持续观察变更；看似正确、甚至通过现有测试的 AI 代码仍可能遗漏边界或安全问题 | 不替代测试、验收条件或外部评估者 |
| [Cursor Checkpoints](https://cursor.com/docs/agent/overview#checkpoints) | Cursor 官方文档 | 自动保存 Agent 改动快照，可恢复；与 Git 分离，只应用于撤销 Agent 变更 | 不支持用 checkpoint 替代 Git 或长期审计 |
| [Cursor Agent tools](https://cursor.com/docs/agent/overview#tools) | Cursor 官方文档 | 文件搜索、编辑和终端等可用能力 | 不支持工具调用天然安全或结果天然正确 |

CodeFlowMu 的 `e2e-lifecycle.test.ts` 已做静态深读；本轮直接执行因当前工作树未安装 `tsx` 依赖而在模块加载前失败，因此正文只把它作为“仓库提供的烟雾测试及其断言”，不声称本轮通过。失败命令和错误已保留在运行记录中。

## 过去 30 天去重结论

本轮按文件日期扫描了 `docs/zh` 中 2026-07-19 至 2026-08-18 的 60 份页面，并对标题、核心判断、证据对象和读者行动做了人工聚类；下列文件是与三题最接近、需要逐篇深读的重叠集，而不是全部扫描清单。

- 题一避开既有“handoff ownership”“terminal evidence”“acceptance persistence”主题，独立聚焦可由人和 Agent 共同读取的工作账本，以及文件接口为何适合作为治理起点。
- 题二避开抽象的 guardrail persistence，独立交付 FCoP 的状态、迁移、写入算法和测试断言。
- 题三与 `2026-08-05-verifiable-completion.md`、`2026-08-05-universal-verifier-completion-contract.md` 和 `2026-08-06-codeflowmu-multi-agent-fact-checking.md` 的治理结论高度重叠，因此不再声称新的核心理论；文章被收窄为“把既有完成验收与裁决权结论落实为 Cursor 操作手册”，其新增价值是需求卡、角色任务、QA REPORT、EVAL 旁路、一日运行表和人工验收包。
- 深读重叠集还包括 `2026-08-15-agent-handoff-ownership.md`、`2026-08-11-durable-event-identity-terminal-evidence.md`、`2026-08-12-acceptance-persistence-handoff.md`、`2026-08-05-guardrail-persistence-state-machine.md` 与 `2026-08-02-control-plane-work-runtime.md`。
