# 换一个 AI 接手时，什么可以继承？公开实验记录

日期：2026-11-05（Asia/Shanghai）。本文是对当日[事实观察 O1/O2/O17/O22 与分析 A1/A2/A4/A6](../../../docs/zh/runtime/daily-intelligence/2026-11-05.md)的后续实验。四个上游项目没有被串成一套真实产品；每项结论只覆盖下述固定入口。

## 来源与运行环境

| 对象 | 固定来源 | 运行入口 |
| --- | --- | --- |
| AG2 | [v1.3.0](https://github.com/ag2ai/ag2/releases/tag/v1.3.0) | Python 3.12.10，`ag2==1.3.0` 的 `merge_variables` 与 `derive_child_variables` |
| LangGraph | [1.2.20](https://github.com/langchain-ai/langgraph/releases/tag/1.2.20) | Python 3.12.10，`langgraph==1.2.20`，进程内 `InMemorySaver` |
| Paradev | [desktop-v2.0.5](https://github.com/ParadevAI/Paradev/releases/tag/desktop-v2.0.5)，`624219c3c6a5428aec38b5f13f040cc0fc087010` | Node 24.22.1，固定 Git 对象中的 `targetPlan.ts`，三个外部依赖替身 |
| Anthropic cookbook | [dreaming PR #959](https://github.com/anthropics/claude-cookbooks/pull/959)，`ce8b2629efe8b24048b127b4c79af1e9cbab93d4` | `memory_distill_utils.py` 与仓库自带的 11 份示例 transcript |
| CodeFlowMu | [提交 `0d2d4e7`](https://github.com/joinwell52-AI/codeflowmu/tree/0d2d4e742ef2f3cb48e3ce09cc47f0c03053dc5f) | `SessionExecutionContract.ts` 真实构造与比较函数；相关本地测试 |

环境是 Windows；Paradev 2.0.5 发行资产没有 Windows 安装包。本轮没有 AG2 模型对话、Paradev 桌面/云端调度或 Anthropic Managed Agents 付费蒸馏调用。

## 输入、观察与判定

1. **数据继承**：AG2 父作用域分别设置 `LOCAL`、`COPIED`、`SHARED`，派生两个子作用域。`LOCAL` 不进入子作用域；`COPIED` 不共享对象，A 改动后父与 B 保持 `0`；`SHARED` 改动后父与 B 都看到 `1`；子作用域新建共享变量抛 `ScopeError`。[探针](probes/ag2_scopes.py)只证明变量 API 的当前行为，不证明完整委派或并发同步。
2. **待审答复继承**：LangGraph 两次 `interrupt()` 取得不同 ID；错误 ID、第一关已消费 ID、第二关已消费 ID 各抛 `UnknownInterruptError`；正确两次恢复得到 `yes-plan/yes-exec`。[探针](probes/langgraph_resume.py)打开内部 `__pregel_strict_resume`，限进程内 checkpoint，不代表远程图的默认行为。
3. **工作区与会话继承**：Paradev 原始 `targetPlan` 经依赖替身执行。仅复用工作区时会话续接为 `false`；无固定工作区而请求续接会打开复用；原目标已复用时换主机，规划结果保留复用和续接，并列出新主机待核验。[探针](probes/paradev_target.mjs)只验证规划函数；`hostsToVerify` 不证明主机已经被核验，也不证明旧授权有效。
4. **经验记录继承**：Anthropic 辅助模块读取 11 份示例记录，列表价算法估算约 `$0.7005`（不是实际账单）。空输入、预算为零和 506 文件分别被拒；合成线程状态下，运行中线程不计入已完成输入覆盖。[探针](probes/dreaming_preflight.py)未运行模型或写入记忆库；无平台导出时的线程完成判定比正式 `end_turn` 证据弱。
5. **CodeFlowMu 当前边界**：真实执行契约比较函数对 host、workspace、role、治理工具的单独改变分别返回 `host_slot_id`、`workspace`、`role`、`governance_tool_ids` 冲突；原样输入无冲突。[探针](probes/codeflowmu_contract.mjs)只跑比较层。固定提交下六组定向测试共 **77/77 通过**：审批操作 15、会话契约 4、治理决定 20、PM 审查就绪 3、任务命令 26、依赖门 9。它们分别验证：工人报告不自动成为 PM 决定；`REPORT done` 不自动满足下游 `requires_success`；旧任务轮次/修订被拒；技术自动化需要限域授权。该总数是六个不同集合之和，不是端到端可靠率。

另试跑 `V2ComprehensiveClosure.e2e.test.ts`，本机 Python 调用向 stderr 返回非 JSON 文本，使夹具在解析处中断；**未计入 77 项通过，也未作为产品故障证据**。

## 主张与证据边界

| 可支持的判断 | 证据 | 尚不能推出 |
| --- | --- | --- |
| 子任务的数据继承有三种不同语义 | AG2 变量探针 | CodeFlowMu 已有或缺少同名作用域；真实模型对话的行为 |
| 一次待审答复可绑定当前中断 ID | LangGraph 本地严格恢复探针 | 所有 LangGraph 部署都默认拒绝旧答复；CodeFlowMu UI 全链已验证 |
| 工作区复用与会话续接可以分开建模 | Paradev 规划函数探针 | 换主机仍有原授权；桌面产品已在 Windows 验收 |
| 长期记忆入口可以检查输入、预算和覆盖 | cookbook 预检探针 | 夜间记忆内容可信、已获人工审核或能安全回滚 |
| CodeFlowMu 已有角色、审查和会话契约的局部边界 | CodeFlowMu 六组测试和契约探针 | 交接后真实 UI、模型、工具与外部副作用链都已验证 |

本轮正式开发评审 **0 项**。现有 CodeFlowMu 定向测试说明多处治理边界已存在；剩余问题需要穿过真实 PM→worker→reviewer 交接与接管入口再判定。外部评论 **0 条**，没有把尚未形成公开英文证据的局部探针发给上游。

## 复跑

固定以上版本，在各自隔离环境安装 `ag2==1.3.0`、`langgraph==1.2.20`、`anthropic>=2,<3`。以下文件使用仓库相对位置；Paradev 和 CodeFlowMu 参数是对应仓库的本地 checkout 路径：

```text
python probes/ag2_scopes.py
python probes/langgraph_resume.py
node probes/paradev_target.mjs <Paradev checkout>
python probes/dreaming_preflight.py <claude-cookbooks checkout>
node --experimental-transform-types probes/codeflowmu_contract.mjs <CodeFlowMu checkout>
```

CodeFlowMu 测试文件位于其固定提交的 `packages/codeflowmu-runtime/src/` 下，分别为 `approval/__tests__/OperationApprovalService.test.ts`、`session/__tests__/SessionExecutionContract.test.ts`、`approval/__tests__/GovernanceApprovalService.test.ts`、`pm/__tests__/pmWorkerReviewReadiness.test.ts`、`governance/__tests__/TaskCommandKernel.test.ts`、`scheduler/__tests__/TaskDependencyGate.test.ts`。用 `node --experimental-transform-types --test <file>` 逐个运行。

探针文件 SHA-256（生成后未编辑）：`ag2_scopes.py` `7917224f7f4a4883b55ae27df9de6cb129ebf9bfdde519c7dc5e6a3e46fca99`；`langgraph_resume.py` `56da70953e1f940d7d8d54352990145d8b7c5412de09c6a2199fa3cfb88762a0`；`paradev_target.mjs` `75a30609e33deca6dd9f182698c76ff6e0a528bb35fbf0b9e84555c67a2f6138`；`dreaming_preflight.py` `dd0d7e589334dae8b55fc334858591c822aa31a3ce48bc8abd89c020fd32eea6`；`codeflowmu_contract.mjs` `962274785bdfcaba505d13c83fe9e5dfe149f6ed51afdba9be6322ba4d012ca`。
