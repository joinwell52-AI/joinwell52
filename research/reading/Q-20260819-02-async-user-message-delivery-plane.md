# Q-20260819-02 — Asynchronous user messaging is separated from model context

- Runtime date: 2026-08-19
- Column: Industry Architecture
- Source object: Q-20260819-02
- Primary source: https://github.com/openai/codex/commit/71dbf72b0576f9e7be1ef28d275bc79ece6d4b6c
- Evidence class: Fact for merged code/tests; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

Long-running agents need to tell the user what is happening without forcing every progress update back into the model’s conversation state. If a user-visible status message is automatically reintroduced as model context, the delivery channel changes future reasoning and spends context budget. If delivery is separated too aggressively, however, progress can become unauditable or unreconstructable. The merged Codex change introduces a narrow asynchronous user-message path that emits a typed user-visible item, returns acceptance to the model so the turn can continue, and deliberately excludes a synthetic copy of that message from the next model input.

## Facts

1. The change adds a `send_user_message_async` function tool.
2. The tool is registered only for root agents, only when the `SendAsyncMessage` feature is enabled, and only when the selected model advertises support for the tool.
3. The tool accepts a single `message` field; empty or whitespace-only messages are rejected before emission.
4. A valid call is converted into an `AgentMessageItem` whose id is the tool call id, whose phase is `FinalAnswer`, and whose `delivery` field is `AgentMessageDelivery::Async`.
5. The runtime emits an ItemStarted event and then an ItemCompleted event for that asynchronous message.
6. Only after those two item-emission calls complete does the tool return `{"accepted":true}` with success=true to the model-facing tool channel.
7. The integration test drives a two-response turn: the model first calls the async user-message tool and later produces the final assistant message.
8. The test verifies that the async item is emitted with the expected id, text, phase and `delivery=Async` metadata.
9. The test verifies that the next model request receives the function-call output `{"accepted":true}`.
10. The test also verifies that the user-visible async text is not inserted into the next model request as a synthetic assistant message.
11. The protocol defines `AgentMessageDelivery::Async` as serialized metadata on `AgentMessageItem` rather than as an out-of-band transient flag.
12. The app-server `ThreadItem::AgentMessage` schema also carries optional delivery metadata, and core-to-app conversion preserves `agent.delivery`.
13. The thread-history builder reconstructs turns from persisted rollout items, handles materialized ItemStarted/ItemCompleted events, converts the core item into a `ThreadItem`, and upserts it into the turn. This establishes a replay/materialization path for the typed async-message item and its delivery metadata inside Codex history handling.
14. The merged change does not add a remote recipient acknowledgement, retry queue, message idempotency key, cancellation protocol or external-delivery receipt.
15. The literal `accepted` result therefore denotes local tool-path acceptance after item emission, not proof that a user device or external channel received or displayed the message.

## Maintainer claims

The commit claims that the root agent can emit an asynchronous user message, receive an immediate accepted result so the turn continues, and keep the visible update out of model input context. Those claims are directly exercised by the integration test. The commit does not claim end-to-end messaging reliability, exactly-once delivery or external acknowledgement, and this note does not infer them.

## Mechanisms

### Root-only, feature-and-model gated registration

The tool is absent for non-root agents and is also gated by both runtime feature state and model-declared support. This prevents every subagent or unsupported model from automatically gaining a direct user-notification channel through this mechanism.

### Delivery item and model tool result are separate records

The visible update is represented as an `AgentMessageItem` with `delivery=Async`. The model receives only the function-call result indicating local acceptance. This explicitly separates the delivery-plane object from the control response that lets model execution continue.

### No synthetic context echo

The integration test inspects the second model request and asserts that the async message text is not present as a synthetic assistant message. The absence of that echo is the key demonstrated context-separation property.

### Typed metadata survives protocol projection

`AgentMessageDelivery::Async` is part of the core item schema, and the app-server projection preserves the field. The thread-history builder materializes persisted item lifecycle events into `ThreadItem`s. Within these demonstrated Codex paths, the delivery classification is reconstructable rather than existing only in a UI callback.

### Event ordering before acceptance

The handler awaits ItemStarted and ItemCompleted emission before returning the accepted function output. Thus, in the demonstrated in-process sequence, the materialized delivery item is emitted before the model is told the tool call succeeded and continues.

## Evidence

- `codex-rs/core/src/tools/handlers/send_user_message_async.rs` defines validation, async item construction, item lifecycle emission and the accepted tool response.
- `codex-rs/core/src/tools/spec_plan.rs` gates registration on root-agent status, `SendAsyncMessage`, and model tool support.
- `codex-rs/core/tests/suite/send_user_message_async.rs` verifies registration, ItemStarted/ItemCompleted, continued turn execution, accepted function output and exclusion of the message from the next model input.
- `codex-rs/protocol/src/items.rs` defines `AgentMessageDelivery::Async` and places optional delivery metadata on `AgentMessageItem`.
- `codex-rs/app-server-protocol/src/protocol/v2/item.rs` carries the same delivery field into `ThreadItem::AgentMessage`.
- `codex-rs/app-server-protocol/src/protocol/thread_history.rs` rebuilds turns from persisted rollout items and materializes item lifecycle events into thread-history items.

## Limitations

1. `accepted=true` is not a user acknowledgement and not a delivery receipt from an external transport.
2. No retry, dead-letter, deduplication or exactly-once mechanism for external user delivery is introduced in this change.
3. The integration test verifies Codex runtime events and model requests, not a UI, mobile client, notification provider or network transport.
4. The change does not define cancellation semantics for an already emitted async message.
5. The ordering guarantee demonstrated here is local to the handler/event/model-request sequence; it does not prove global ordering across concurrent threads, multiple clients or external delivery channels.
6. Persistence/replay is supported by typed item metadata and the existing rollout/thread-history materialization path, but this note does not establish retention duration, storage durability under crash, or compatibility across all future schema migrations.
7. Root-only registration prevents subagents from directly seeing this tool through this path, but it does not prove that a subagent can never indirectly cause a root agent to send a message.
8. Keeping the message out of model context also means later reasoning does not automatically remember the exact text through this tool path; any desired reasoning-state update requires a separate mechanism.

## Comparisons

- A normal assistant message serves both user communication and model-history continuity. This change splits those concerns for one explicit asynchronous path.
- Injecting every status update into context improves conversational continuity but couples observability to reasoning state. The async tool keeps the delivery record while avoiding that synthetic context cost.
- Fire-and-forget notification APIs often lose reconstructability. Here the typed delivery metadata is carried through Codex item and history structures, although external delivery reliability remains unproven.

## Unresolved questions

1. What component ultimately consumes `delivery=Async`, and what acknowledgement or failure semantics does that component expose?
2. Is there a durable queue between Codex history emission and the final user-facing transport, and if so how are retries and duplicates handled?
3. How should multiple async messages be ordered when several root-agent operations execute concurrently?
4. Can the user reply to a particular async message with a correlation id, or does the later user message only re-enter as ordinary turn input?
5. How are async messages represented after thread rollback, compaction, export and long-term retention?
6. Should the model receive a stable message identifier in the accepted result so later tools can update or supersede an earlier user-visible progress item without injecting its text into context?

## Reading boundary

This note establishes a merged, tested separation inside Codex: a gated root-agent tool emits a typed asynchronous user-visible message, preserves `delivery=Async` through protocol/history structures, returns local acceptance so the turn can continue, and does not echo that visible text into the next model request as synthetic context. It does not establish end-to-end user delivery, acknowledgement, retry, exactly-once semantics, cancellation or global ordering. Those broader architectural judgments belong to Skill 04 Analysis.
