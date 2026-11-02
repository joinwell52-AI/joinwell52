# AI 工具失败后，日志保存了哪些内容？

[English evidence summary](00-report.en.md) · [中文文章](../../../docs/zh/research/2026-11-02-ai-failure-log-boundary.md)

## 来源与本地问题

11 月 1 日的 [OpenAI Agents Python #5457](https://github.com/openai/openai-agents-python/pull/5457) 用关联 ID 和事件计数诊断断流，不放入 prompt/output；[MCP SDK #3115](https://github.com/modelcontextprotocol/typescript-sdk/pull/3115) 默认 span 不记录参数与结果；[LangGraph #9486](https://github.com/langchain-ai/langgraph/pull/9486) 则说明某项 trace policy 只作用于特定 tracer，不能推定所有 handler 都接收处理后负载。11 月 2 日 [Orkas #154](https://github.com/Orkas-AI/Orkas/pull/154) 在 IPC 日志边界归纳失败信息，同时保留调用者的原错误回复。它们处理的是四种不同边界，仅作为本实验选题来源。

我们检查 CodeFlowMu 动作证据记录：当一次工具调用失败，已知格式与未知格式的合成敏感值分别会怎样进入动作行和长错误输出文件？

## 固定版本与方法

- 私有 CodeFlowMu V3.0.129 提交 `c600e74d5d72253657593a37077e856fe6c7fba6`。受查文件的 Git blob 分别是 `TelemetryRedactor.ts` `5100a9b6d122e7402ec80bd92c8db91f9e2a3956`、`ActionEvidenceLogger.ts` `8acb303e6f41a389f68ff902c089d8e0df4e7fa9`、`ActionEvidenceFromToolCall.ts` `25a64908a170f846752468656cb08145bed659eb`。
- [探针源码](probe_private_adapter.mjs)把**合成的、未真正执行的**失败工具结果送入 `maybeRecordActionEvidenceFromToolCall`。输入包含非零退出、已识别 API key 形态的假值、无固定格式的假敏感值，以及超过 4096 字符的 `stderr`。比较动作行与它指向的错误输出文件。
- 相关现有 `TelemetryRedactor`、`ActionEvidenceLogger`、`ActionEvidenceFromToolCall` 测试在相同源码下为 26/26 通过。
- 该探针需要私有源码访问；公众**不能独立复跑 CodeFlowMu 层**。完整本地运行产物与内部开发评审未公开。

## 实测结果

| 检查点 | 已识别格式的假 key | 无固定格式的假敏感值 |
| --- | --- | --- |
| 动作行 `command` | 原值不在 | 原值仍在 |
| 长错误输出引用文件 | 原值不在 | 原值仍在 |

动作行同时含 `status: failed`、`failure_class: unknown`、`stderr_ref`。现有字段与格式脱敏能遮盖已识别值；它并不能推断任意无格式字符串的敏感性。26 项回归通过，只证明那些测试覆盖的条件通过，不能扩展为所有私密信息均不会落盘。

## 支持范围

仅验证固定版本的模块入口与本机文件结果。未调用真实模型、执行真实失败命令、使用真实凭据，也未检查正式产品实例的读取权限、上传链路、保留期或清理。**这是本地持久化观察，不是已发生泄漏的证明。** `fcop/logs/runtime` 在这里是 CodeFlowMu 产品动作日志路径，不等同于 FCoP 正式任务/报告生命周期账本。建议进一步核查真实消费者与权限，再决定是否把动作事实和详细原文分级保存。
