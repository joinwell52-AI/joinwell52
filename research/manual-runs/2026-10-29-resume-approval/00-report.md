# 批准后恢复到新会话：受控审批对照

日期：2026-10-29。支持[中文文章](../../../docs/zh/research/2026-10-29-approval-after-resume.md)；[English record](00-report.en.md)。

## 来源与问题

外部启发分别来自 [Codex 每 chat MCP 租约 #57978](https://github.com/openai/codex/pull/57978)、[OpenAI Agents JS 客户端环境准备归属 #2085](https://github.com/openai/openai-agents-js/pull/2085)、[Paperclip 断线写入恢复 #17960](https://github.com/paperclipai/paperclip/pull/17960)。截至本轮 GitHub API 核查，三项 PR 均已合入。它们讨论不同产品的连接、环境与写入 owner；本文没有复跑其代码。自己的实验问：CodeFlowMu 中已批准的**同一操作**，在同一 Agent 换 Session 后能否按约定消费一次？

## 基线与方法

- 本地当前私有 CodeFlowMu 源码提交：`c600e74d5d72253657593a37077e856fe6c7fba6`。源码不在本仓库公开，读者不能通过本包独立编译私有 Runtime。公开的是受控输入、观察结果与限制；这不是公开复现器。
- 用系统临时目录创建批准记录；输入固定为 Agent `DEV-01`、任务 `TASK-1`、`git push origin main` 的审批判断。管理员角色作批准决定，指定唤醒 Session 2。没有执行 Git、网络或部署动作。
- 第一条探针直接调用批准记录接口，重建服务实例后用同 Agent、任务、操作的 Session 3 消费；更换 Agent、任务或目标作为反例。
- 第二条探针由 native 工具审批入口产生原始申请，走批准与决定送达，再从同一入口测试 Session 2、Session 3、原 Session 1 和反例。相关现有审批模块测试 **15/15 通过**。

## 观察结果

| 对照 | 记录接口 | native 工具入口 |
| --- | --- | --- |
| Session 1 原操作 | 授权已批准 | `ALLOW` 一次 |
| Session 2，决定指定的唤醒会话 | 未单独调用 | `REQUIRE_APPROVAL` |
| Session 3，同 Agent／任务／操作 | `consumed` | `REQUIRE_APPROVAL` |
| 更换 Agent | `null` | `REQUIRE_APPROVAL` |
| 更换任务 | `null` | `REQUIRE_APPROVAL` |
| 更换命令目标 | `null` | `REQUIRE_APPROVAL` |
| 原会话第二次消费 | 未单独调用 | 抛出 `APPROVAL_ALREADY_CONSUMED` |

在 native 入口对比原会话与 Session 3，**操作指纹相同，操作摘要不同**。源码静态核对显示：摘要计算去掉最外层 `subject.session_id`，但 native 请求的嵌套 `snapshot.operation_facts.subject.session_id` 仍参与摘要。候选记录按摘要及指纹匹配，因此新会话不命中。记录接口的受控请求没有这个嵌套快照差异，能够跨会话消费。这里发现的是两层实现不一致；未发现跨 Agent、跨任务或换目标的授权复用。

## 复核范围与未完成事项

本地探针和完整私有源码留在受限工作区，未提交本公开仓库。公众可用本包审查**方法、输入条件、状态对照与声明边界**，不能把表格当作可独立验证的部署事故证据。未测试真实 Host 接管、账户或凭据变更、最终 Git push、授权 UI 的完整路径，也没有用户故障发生率。Session 2 与 3 的差异本身不证明安全缺陷；同一 Agent 可能连续恢复。下一步需明确“批准范围”与“执行载体”的字段分工，并对实际接管和凭据 owner 做端到端检查。
