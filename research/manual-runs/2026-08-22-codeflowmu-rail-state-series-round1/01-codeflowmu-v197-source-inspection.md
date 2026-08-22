# CodeFlowMu V1.9.7 母版源码检查记录

- 检查日期：2026-08-22（Asia/Shanghai）
- 仓库：`joinwell52-AI/codeflowmu`（私有母版，不是 CodeFlowMu Open）
- 远端检查提交：`2c901972df79dc8d0a1e2eee66ed8dce5e4f953f`
- 代码候选提交：`9e4c6e6a578e96506da245f66580615a36cd70f8`
- 实机重启加载提交：`0174fecd01cc87a97e810539334d367ea80a8e0b`
- 访问方式：GitHub API 原始内容，只读；未修改 `D:\codeflowmu` 脏工作树。

## 已检查的当前实现

1. `packages/codeflowmu-runtime/src/governance/RailAssistanceContract.ts`
   - 轨道输出分为 `neutral`、`unknown_reconcile`、`waiting_dependency`、`negative_list_denied`。
   - 输出显式包含 `decision_owner: AGENT | PM | ADMIN`。
   - 只有冻结负面清单与显式依赖可以形成执行暂停。
   - `canonicalThreadKey()` 去掉查询用的 `#TASK-...` lineage 后缀，避免把查询桶当成第二个任务身份。
2. `packages/codeflowmu-runtime/src/governance/GovernanceFactKernel.ts`
   - 当前快照合同为 `codeflowmu.governance-task/v2`。
   - 分开记录 Runtime、Lifecycle、Report、Evidence、Dependency、Acceptance、Workflow、Attention 与 Commands。
   - 快照固定输出 `business_decision: null`；内核归一化事实，不作业务验收决定。
3. `packages/codeflowmu-runtime/src/registry/RoleToolCapabilityGate.ts`
   - 角色工具门禁按规范工具 ID 和活动能力精确检查。
   - PM 的任务修改不直接绕过 FCoP 工具，而是通过 `pm.*` Runtime 工具进入 `TaskCommandKernel`，保留身份、作用域和防重复检查。
   - 文件本身明确声明该门禁不检查命令正文或全部副作用，因此不能把它写成完整沙箱。
4. `packages/codeflowmu-runtime/src/governance/TaskCommandKernel.ts`
   - 命令请求绑定任务、根任务、线程、轮次、预期修订、理由和防重复流水号。
   - 同一防重复流水号与相同业务指纹重放时返回首次结果；同一流水号对应不同业务意图时报告冲突。
   - 轨道执行业务主体已经作出的命令，但结果固定声明 `rail_business_decision: none`。
5. `packages/codeflowmu-runtime/src/scheduler/TaskDispatcher.ts`
   - 任务派发、能力繁忙排队和显式依赖释放由 Runtime 处理。
   - PM 创建的每个下游工作必须是当前根任务下的新子任务；依赖关系写入正式 TASK，不能用同线程旧任务冒充本轮依赖。
6. `packages/codeflowmu-runtime/src/jobs/ManagedCommandSupervisor.ts`
   - 长作业记录绑定任务、根任务、线程、会话、执行轮次和执行权标识。
   - 每个作业的 `job.json` 是权威记录，`index.json` 只是可重建列表缓存。
   - 支持状态查询、有限等待、增量日志与精确授权取消；这项服务在 V1.9.7 是可选的持久作业能力，不是所有命令的强制入口。

## 可以支持的主张

- CodeFlowMu V1.9.7 已把轨道机收敛为事实、上下文、机械执行、审计和技术恢复层。
- 当前实现明确区分生命周期、报告、证据和验收，不把它们压成单一 `done`。
- 当前实现具备任务作用域校验、角色工具门禁、防重复命令、显式依赖排队以及可选持久长作业等工程机制。

## 不能支持的主张

- 不能证明 CodeFlowMu 已通过第三方安全审计、渗透测试或独立产品认证。
- 不能证明所有 Agent、模型、Host、工具和文件系统路径都被同一套门禁完整覆盖。
- 不能把私有母版实现写成行业标准，也不能公开未获授权的大段私有源码。
- 不能把 V1.9.7 候选记录写成 ADMIN 已正式标记 `RELEASED`。
