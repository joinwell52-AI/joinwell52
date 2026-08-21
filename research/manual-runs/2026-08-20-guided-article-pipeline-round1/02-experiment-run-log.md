# 2026-08-20｜CodeFlowMu 专项测试运行记录

## 环境

- 独立测试工作树：`D:/TMPA/CodeFlowMu-article-test-20260820`
- 固定提交：`ed5634c718b9e238c44bb70851020c9793546fe6`
- Node.js：`v24.16.0`
- 依赖安装：`npm ci`
- 安装结果：成功；新增 164 packages；npm audit 报告 6 个依赖漏洞（1 low、2 moderate、3 high）。本文不把依赖安装成功解释为安全审计通过。

## 环境纠正记录

第一次从仓库根运行 `node --import tsx --test ...` 时，Node 无法从根目录解析 workspace 内的 `tsx`，所有文件在加载测试运行器前以 `ERR_MODULE_NOT_FOUND` 退出。该结果属于 **测试未运行**，不是产品测试失败。

纠正方式：分别在 `packages/codeflowmu-runtime` 和 `codeflowmu-shell` 工作区执行命令，使 Node 从对应 workspace 解析 `tsx`。下列结果均来自纠正后的真实运行。

## 文章一：技能与权限

```text
cwd: packages/codeflowmu-runtime
command:
node --import tsx --test --test-concurrency=1 \
  src/skills/__tests__/SkillContextRouter.test.ts \
  src/skill/__tests__/MCPInjector.test.ts \
  src/registry/__tests__/RoleToolPolicy.test.ts

exit: 0
tests: 22
pass: 22
fail: 0
duration_ms: 8691.1804
```

关键边界：测试明确确认 `MCPInjector` 的 stub 模式不启动子进程，`mode='live'` 会主动抛出 `MCPInjectorLiveModeNotImplementedError`。正文不得把它写成已上线的动态 MCP 实时挂载器。

批准记录生命周期专项测试：

```text
cwd: packages/codeflowmu-runtime
command:
node --import tsx --test src/approval/__tests__/OperationApprovalService.test.ts

exit: 0
tests: 13
pass: 13
fail: 0
```

合计：35 项定向测试通过。新增测试支持请求摘要、过期、随机一次性执行令牌、请求变化后旧批准失效以及并发单次消费；不证明每个工具执行器都统一绑定 Git HEAD 或目标文件快照。

另运行 `codeflowmu-shell/src/__tests__/controlled-executor-registry.test.ts`，结果为 1/4 通过、3/4 在执行器调用前因测试夹具缺少新的 `thread_key` 路由前置条件而失败，错误为 `APPROVAL_ROUTING_INCOMPLETE`。该结果属于集成测试夹具与新前置条件漂移，未计入 35 项通过，也未被正文包装成被测安全能力失败或通过。

## 文章二：项目换根

Runtime 项目上下文测试：

```text
cwd: packages/codeflowmu-runtime
command:
node --import tsx --test --test-concurrency=1 \
  src/project/__tests__/ProjectExecutionContext.test.ts \
  src/project/__tests__/ProjectRootResolver.test.ts \
  src/project/__tests__/ProjectWriteBarrier.test.ts

exit: 0
tests: 5
pass: 5
fail: 0
duration_ms: 801.3892
```

Shell 项目注册与切换测试：

```text
cwd: codeflowmu-shell
command:
node --import tsx --test --test-concurrency=1 \
  src/__tests__/project-registry.test.ts \
  src/__tests__/project-switch-adaptation-ui.test.ts \
  src/__tests__/project-clean-runtime.test.ts

exit: 0
tests: 22
pass: 22
fail: 0
duration_ms: 3799.2786
```

合计：27/27 PASS。它证明固定提交上的受测路径，不证明任意第三方扩展、任意并发或跨主机切换。

## 文章三：报告归属

```text
cwd: packages/codeflowmu-runtime
command:
node --import tsx --test --test-concurrency=1 \
  src/pm/__tests__/panel104Regression.test.ts \
  src/ledger/__tests__/LedgerBuilder.report-parenting.test.ts \
  src/pm/__tests__/PmSummaryGate.test.ts

exit: 0
tests: 44
pass: 44
fail: 0
duration_ms: 2209.1472
```

覆盖：三字段归因错配、返工报告显式所有者、同一 thread 多个 ADMIN root、旧报告、QA 缺失/失败、浏览器证据缺失、最终汇总重复等。辅助挂树包含正文匹配和最近开放任务回退，因此正文必须区分“展示/整理用辅助挂树”和“关键验收硬门”。
