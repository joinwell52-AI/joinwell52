# What does the log retain after an AI tool fails?

[中文实验摘要](00-report.md) · [English article](../../../docs/en/research/2026-11-02-ai-failure-log-boundary.md)

## Sources and local question

[OpenAI Agents Python #5457](https://github.com/openai/openai-agents-python/pull/5457) adds correlation IDs and event counts to an incomplete-stream error without prompt or output text. [MCP SDK #3115](https://github.com/modelcontextprotocol/typescript-sdk/pull/3115) emits spans without tool arguments or results by default. [LangGraph #9486](https://github.com/langchain-ai/langgraph/pull/9486) shows that a trace policy applies to selected tracers rather than every callback handler. [Orkas #154](https://github.com/Orkas-AI/Orkas/pull/154) summarizes IPC failure logs while preserving the original reply for the caller. These address distinct boundaries; none establishes a defect in CodeFlowMu.

Our question was what CodeFlowMu's action evidence retains from one failed tool result when it contains both a recognizable synthetic API-key shape and an arbitrary synthetic sensitive value.

## Pinned version and method

- Private CodeFlowMu V3.0.129 commit `c600e74d5d72253657593a37077e856fe6c7fba6`. Git blobs: `TelemetryRedactor.ts` `5100a9b6d122e7402ec80bd92c8db91f9e2a3956`; `ActionEvidenceLogger.ts` `8acb303e6f41a389f68ff902c089d8e0df4e7fa9`; `ActionEvidenceFromToolCall.ts` `25a64908a170f846752468656cb08145bed659eb`.
- The [probe source](probe_private_adapter.mjs) sends a **synthetic, unexecuted** failed tool result through `maybeRecordActionEvidenceFromToolCall`: nonzero exit, both fake values in the command, and more than 4,096 characters of stderr. It inspects the resulting action row and referenced stderr file.
- The existing three related test suites passed 26/26 on the same source.
- The probe requires access to the private product checkout; public readers **cannot independently replay this CodeFlowMu layer**. Full local artifacts and the product review stay local.

## Observation

| Surface | Recognized fake key | Unformatted fake sensitive value |
| --- | --- | --- |
| Action row `command` | Original absent | Original present |
| Referenced long stderr file | Original absent | Original present |

The action row also records `status: failed`, `failure_class: unknown`, and `stderr_ref`. Existing field and pattern redaction covers recognized shapes. It does not know that an arbitrary unformatted string is sensitive. The 26 passing tests establish their tested behavior, not a universal non-retention guarantee.

## Limits

This is a module-entry and local-file observation at one pinned revision. No real model, command, credential, product UI, read-access policy, upload path, retention period, or cleanup behavior was tested. **Persistence here is not evidence of an actual leak.** The `fcop/logs/runtime` directory is a CodeFlowMu product action-log path, distinct from the formal FCoP task/report lifecycle ledger. Real consumers and access boundaries need separate verification before changing detail retention.
