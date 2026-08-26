---
title: "复制配置，不要复制客户端"
date: '2026-08-26'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "How should a reusable client/runtime separate template HTTP configuration from per-invocation mutation without needlessly cloning heavyweight live client objects?"
summary: "Google ADK 的一项已合并变更为每次 Invocation 复制 Request-mutable HTTP Option Container，同时保留 Live Client Identity。这个模式避免已展示的 Clone Crash 与 Top-level Mutation Leak，但不会产生 Deep Isolation 或 Client-internal Isolation。"
sources:
  - research/analysis/Q-20260826-03-copy-on-mutation-request-option-isolation.md
item_id: "Q-20260826-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-26-copy-options-keep-client-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-26-copy-options-keep-client-cover.png"
  kicker="开源工程 · 每日研究"
  title="复制配置，不要复制客户端"
  summary="Google ADK 的一项已合并变更为每次 Invocation 复制 Request-mutable HTTP Option Container，同时保留 Live Client Identity。这个模式避免已展示的 Clone Crash 与 Top-level Mutation Leak，但不会产生 Deep Isolation 或 Client-internal Isolation。"
  version="Q-20260826-03"
  status="Daily Runtime V5 · 2026-08-26"
  languageHref="/en/engineering/2026-08-26-copy-options-keep-client"
  languageLabel="English"
/>

# 复制配置，不要复制客户端

可复用 Request Configuration 往往混合了两类不应采用同一 Copy Policy 的对象。Header、Extra Body Field 与 Client Argument 是 Value-like Container，Request Processor 可能修改它们；HTTP Client、Connection Pool 与 SSL State 则是 Live Resource，其 Identity 与内部机制本来就要复用。

Deep-copy 整个 Object Graph 会把 Live Capability 当成普通数据，并可能因为 Lock 或不可 Pickle 的 SSL Object 崩溃。原样共享整个 Graph 则会出现相反问题：Callback 可能修改 Caller-owned Option Container，让某次 Invocation 的状态泄漏到下一次调用。

Google ADK 在 2026-08-25 合并的一项维护者变更实现了更窄的边界。`copy_http_options` Helper 为 `headers`、`extra_body`、`client_args` 与 `async_client_args` 创建新 Dictionary，为 Retry Option 创建独立 Model Copy，再用这些替换项构造复制后的 Options Model；Caller 提供的 Live HTTP Client 则保持同一个对象。

工程模式是：**复制每次 Invocation 将要修改的 State；保留有意共享的 Live Capability。** 这是 Copy-on-mutation Ownership，不是通用的 Shallow-copy 建议。

## Deep Copy 与 Raw Sharing 的失败原因不同

Deep Copy 承诺最大隔离，但只适用于真正可复制的 Object Graph。Live Client 包含 Connection、Lock、Pool 与 Operating-system State。复制其 Python Object Graph 既不是有效 Transport Clone，也不是可靠的 Request-isolation Mechanism。

Raw Sharing 保留这些资源，却会 Alias 周围配置。如果 Request Assembly 原地加入 Header，或 Callback 修改 Extra-body Mapping，可复用 Template 就会变成 Cross-request Mutable State，后续 Call 可能观察到早先 Invocation 的数据。

正确边界因此是语义性的。每个 Field 都需要 Ownership Classification：Immutable Value、Invocation-mutable Container 或 Shared Live Resource。Copy 行为应跟随分类，而不是跟随 Object Reachability。

## Mutation-specific Copying 让合同可执行

所选 Helper 枚举下游预期会修改的 Field，并分离它们的 Top-level Container。Retry Configuration 获得自己的 Model Copy。随后，周围 `HttpOptions` Model 使用这些替换项复制，而 Live Client Field 保持共享。

Production Path 在把 Run Configuration 放入 LLM Request 之前使用该 Helper，所以 Processor 与 Before-model Callback 操作的是 Invocation Snapshot。Live-session Transfer 与 Restart Path 同样避免复制整个 `RunConfig`；它们只复制 `session_resumption`，因为清除 Handle 才是这些路径真正需要的 Mutation。

只要保持显式，这种狭窄就是优点。它减少对 Non-copyable Resource 的意外复制，也让预期 Mutation Domain 可审查。

## 测试必须同时证明 Separation 与 Preservation

只检查 Equality 的测试太弱。Ownership 关心 Identity 与 Write-through Behavior。已展示 Regression 断言复制后的 Mutable Container 与 Retry Option 具有不同 Identity，同时 Caller 提供的 `httpx` Client 保持相同 Identity；它也在 Request Path 验证 Mutation Isolation。

维护者还应加入 Sequential-call Test：先 Enrich 第一个 Request，再验证第二个 Request 与 Caller Template 不包含第一次调用的 Metadata。同时应断言 Live Transport 没有被静默重建，否则 Pooling、Hook 或 Configured Adapter 可能丢失。

Schema Evolution 需要同样纪律。每个新 Option Field 都应声明它是 Immutable、Per-invocation Copy 还是 Intentionally Shared。否则，未来新增的 Mutable Field 可能绕过 Helper，重新打开 Aliasing。

## 复制 Dictionary 不等于 Deep Isolation

已实现边界位于 Top Level。新的 Dictionary Container 仍可引用 Template 中的 Mutable Nested Value，原地修改这些 Nested Object 仍可能跨 Call 可见。Live Client 本身也可能通过 Cookie、Authentication Cache、Hook 或 Custom State 跨请求携带状态。

这些不是本次变更已经反证的缺陷，而是超出其 Demonstrated Guarantee 的问题。需要 Nested 或 Client-internal Isolation 的系统，仍需 Immutable Structure、Typed Clone/share Policy、独立 Client Instance 或更强 Concurrency Contract。

可辩护结论是：Mutation-specific Copying 消除了已展示的 Non-copyable Live Resource 与 Request-local Container Mutation 冲突。它不能建立 Deep Isolation、Cookie Isolation、Custom-client Safety 或通用 Concurrency Correctness。

**一手证据：** [Google ADK 已合并提交 67ca98c2](https://github.com/google/adk-python/commit/67ca98c2c0b467ed397357eef2b2941c92dac40c)。Helper 与 Regression 支持这一有界 Top-level Ownership Pattern，但不是通用 Request Isolation 的独立验证。
