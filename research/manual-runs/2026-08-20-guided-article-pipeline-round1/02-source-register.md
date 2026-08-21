# 2026-08-20｜三篇文章来源登记

访问日期统一为 **2026-08-20**。第一方代码固定到 CodeFlowMu Open commit `ed5634c718b9e238c44bb70851020c9793546fe6`，TMPA 规范固定到 joinwell52 commit `ae27de71b1a8809c2bd69acedc1482570d55a322`，FCoP 规范固定到 commit `a859e6747fe6e5e2d686e0114c77774726d7f748`。以下来源只支持列出的范围，不把项目自述、单元测试或通用标准外推成生产效果。

## 文章一：技能与工具权限分层

| 来源 | 身份 | 支持 | 不支持 |
|---|---|---|---|
| [MCP 规范：Security and Trust & Safety](https://modelcontextprotocol.io/specification/2025-03-26/index) | MCP 官方规范 | 工具可形成任意数据访问和代码执行路径；工具描述应视为不可信；宿主应提供授权和用户控制 | 不规定 CodeFlowMu 的角色表，也不证明所有本地工具都需要同一种交互批准 |
| [MCP Authorization](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization) | MCP 官方规范 | HTTP 授权、资源绑定、权限不足与令牌安全边界 | 不覆盖 STDIO 工具的全部本地进程权限，也不替代应用层操作影响判断 |
| [NIST SP 800-171 Rev. 3](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/800-171r3/NIST.SP.800-171r3.html) | NIST 官方标准 | 最小权限、职责分离、特权操作限制与日志 | 不是 Agent 专用标准，不规定技能选择或 MCP 接口 |
| [SkillContextRouter.ts](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/skills/SkillContextRouter.ts) | 第一方实现 | 按角色、意图和任务信号懒加载少量行为手册并记录调用 | 关键词路由不保证语义分类永不误判；被加载不等于授权或执行成功 |
| [RoleToolCapabilityGate.ts](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/registry/RoleToolCapabilityGate.ts) | 第一方实现 | 角色对规范化工具标识的精确能力判断 | 代码注释明确它不检查命令文本或副作用 |
| [UnifiedOperationPolicy.ts](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/approval/UnifiedOperationPolicy.ts) | 第一方实现 | 根据目标、持久性、外部写入、治理变化等事实决定允许或要求批准 | 不能保证外部系统执行成功；批准只允许原操作重试 |
| [OperationApprovalService.ts](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/approval/OperationApprovalService.ts) | 第一方实现 | 请求摘要、过期、随机一次性执行令牌、可用/已消费状态与并发单次消费 | 不证明每个执行器都绑定操作前 Git 或文件状态，也不替代操作系统沙箱 |
| [WorkspaceOperationApproval.ts](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/approval/WorkspaceOperationApproval.ts) | 第一方实现 | 特定工作区操作可把 Git HEAD 与目标文件快照加入批准请求 | 不能外推为全部工具路径已经统一实现环境快照与 TOCTOU 防护 |
| [TMPA 核心规范 S1.0](https://github.com/joinwell52-AI/joinwell52/blob/ae27de71b1a8809c2bd69acedc1482570d55a322/docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-zh.md) | 第一方公开研究规范 | 角色、权威、职责分离、事实证据与接受的治理边界 | 不注册工具，不实现运行时批准消费 |
| [FCoP v3 中文规范](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/spec/fcop-v3-spec.zh.md) | 第一方公开协议规范 | TASK、REPORT、ISSUE、REVIEW 信封与协议/运行时职责边界 | 不决定宿主是否允许执行终端命令 |

## 文章二：项目执行链安全换根

| 来源 | 身份 | 支持 | 不支持 |
|---|---|---|---|
| [Node.js Child Process](https://nodejs.org/api/child_process.html) | Node.js 官方文档 | 子进程拥有明确 `cwd`；未指定时继承当前工作目录；目录不存在会产生 `ENOENT` | 不规定如何切换整个 Agent Runtime，也不提供跨组件事务 |
| [VS Code Multi-root Workspaces](https://code.visualstudio.com/docs/editing/workspaces/multi-root-workspaces) | VS Code 官方文档 | 一个窗口可含多个文件夹；未适配多根的扩展可能只使用第一个文件夹 | 不证明 Cursor 或 CodeFlowMu 的具体行为 |
| [VS Code Workspace Trust](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust) | VS Code 官方文档 | 新增文件夹会触发独立信任判断；不可信内容可进入受限模式 | 信任状态不等于 Runtime、MCP 和 Watcher 已切换到同一根 |
| [ProjectExecutionContext.ts](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/project/ProjectExecutionContext.ts) | 第一方实现 | 请求级不可变上下文统一绑定任务准入、提交、生命周期和证据根，并拒绝根不一致 | 不等于热切换事务本身已完成 |
| [project-registry.ts](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/codeflowmu-shell/src/project-registry.ts) | 第一方实现 | 活动项目注册、启动根解析、统一 Runtime/MCP/Watcher/Cursor 工作目录绑定计划与诊断 | 不能外推到任意第三方扩展或任意跨进程故障 |
| [web-panel.ts](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/codeflowmu-shell/src/web-panel.ts) | 第一方实现 | 切换路径先取消会话、停止 Runtime、持久化新根、应用作用域并重载；持久化失败回滚项目标识 | 不承诺完整优雅排空、Windows 句柄释放、符号链接真实路径统一或全部外部副作用回滚，也不允许写成“原子热切换” |
| [TMPA 核心规范 S1.0](https://github.com/joinwell52-AI/joinwell52/blob/ae27de71b1a8809c2bd69acedc1482570d55a322/docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-zh.md) | 第一方公开研究规范 | 冲突事实应保留并交由有权角色处理 | 不证明任何项目切换实现自动满足该原则 |

## 文章三：并行报告归属与验收串账

| 来源 | 身份 | 支持 | 不支持 |
|---|---|---|---|
| [W3C Trace Context](https://www.w3.org/TR/trace-context/) | W3C Recommendation | `trace-id` 关联跨服务请求；`parent-id` 传播调用方当前操作标识 | 追踪身份不证明业务报告真实、正确或已通过验收 |
| [OpenTelemetry Tracing API](https://opentelemetry.io/docs/specs/otel/trace/api/) | OpenTelemetry 官方规范 | 每个 span 最多一个父 span，父子操作共享 TraceId，形成因果树 | 观测 span 不是任务、报告或 QA 验收合同 |
| [FCoP v3 中文规范](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/spec/fcop-v3-spec.zh.md) | 第一方公开协议规范 | TASK 与 REPORT 信封、引用、生命周期事实及协议/运行时边界 | 不规定 CodeFlowMu 的“三字段 DEV 回执”应用门禁 |
| [reportAttribution.ts](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/pm/reportAttribution.ts) | 第一方实现 | 关键 DEV 回执核对文件名推断任务、frontmatter `task_id` 和 `references[0]` | 这是 CodeFlowMu 的场景门禁，不是全部 FCoP REPORT 的通用文件名规则 |
| [reportParenting.ts](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/ledger/reportParenting.ts) | 第一方实现 | 报告父子挂树、明确所有者优先、返工引用、同线程多根分桶和辅助匹配 | 辅助匹配可能使用正文或最近任务，不应被描述为验收级确定性证明 |
| [PmSummaryGate.ts](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/pm/PmSummaryGate.ts) | 第一方实现 | 子任务结算、有效且未被替代的 worker 报告、QA 通过和浏览器证据等汇总门禁 | 通过门禁不是外部第三方认证；部分时间判断仍不能证明跨设备物理时钟可靠 |
| [LedgerBuilder.ts](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/ledger/LedgerBuilder.ts) | 第一方实现 | 解析 `submission_attempt`、`revision_of`、`supersedes`、`superseded_by` 及显式/兼容时间字段 | 不证明全部报告写入路径都会自动生成唯一执行轮次或逻辑时钟 |
| [TMPA 核心规范 S1.0](https://github.com/joinwell52-AI/joinwell52/blob/ae27de71b1a8809c2bd69acedc1482570d55a322/docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-zh.md) | 第一方公开研究规范 | 执行事实、验证事实与有权接受需要分离 | 不规定 CodeFlowMu 的具体三字段归因门 |

## 访问与链接校验

- 上述 8 个外部/公开标准页面均在 2026-08-20 通过浏览器读取。
- 12 个 CodeFlowMu GitHub permalink 均固定指向公开 commit `ed5634c718b9e238c44bb70851020c9793546fe6`。
- TMPA 规范公开 permalink 已固定到 joinwell52 commit `ae27de71b1a8809c2bd69acedc1482570d55a322`。
- FCoP 规范公开 permalink 已固定到 commit `a859e6747fe6e5e2d686e0114c77774726d7f748`；正文将把其声明限制在协议层。
