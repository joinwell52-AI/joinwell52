# Q-20260821-01 — Standalone tool output needs a distinct external-context boundary

- Runtime date: 2026-08-21
- Column: Digital Employee
- Source object: Q-20260821-01
- Primary source: https://github.com/openai/codex/commit/aead844f64e911f89e556485e3f47d757431c3b1
- Evidence class: Fact for merged code/tests; maintainer claim where explicitly labeled; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

Tool output can enter an agent thread without a matching local tool call. If such a standalone result is treated as ordinary trusted conversation history, it can influence persistent memory or downstream context even though the current thread does not contain the execution event that would normally bind the result to a tool invocation. The merged Codex change introduces an explicit external-context classification for `function_call_output` items that have no `call_id`, and can use that classification to disable memory reuse for the affected thread.

## Facts

1. The merged commit explicitly adds `ResponseItem::FunctionCallOutput { call_id: None, .. }` to the predicate that identifies response items which may include external context.
2. The classification is precise: the new external-context case is the absence of `call_id`; the change does not classify every function-call output as external.
3. In the app-server `thread/inject/items` path, injected response items are first persisted into rollout history. When `memories.disable_on_external_context` is enabled and the injected batch contains a `FunctionCallOutput` with no `call_id`, Codex calls the thread-memory pollution helper.
4. The corresponding app-server regression test enables SQLite state plus `[memories] disable_on_external_context = true`, injects a standalone function output, then reads `StateRuntime` and asserts that the thread memory mode is `polluted`.
5. During session initialization, the merged code adds a post-history scan for a forked initial history. When a forked history is active and the memory-disable policy is enabled, Codex clones the history, finds a `FunctionCallOutput` without a `call_id`, and calls the same pollution helper.
6. The shown initialization patch does not perform that post-history scan for the `New`/`Cleared` or `Resumed` branches. New-thread injection is nevertheless covered through the explicit `thread/inject/items` path demonstrated by the app-server test. The evidence therefore supports named paths rather than a universal claim over every history-loading route.
7. Guardian transcript construction now preserves standalone named tool outputs. A `FunctionCallOutput` with no `call_id`, a `name`, and optional `namespace` becomes a tool-result transcript entry. With namespace `slack` and name `notifications`, the regression expects the identity `tool slack.notifications result`.
8. Guardian transcript text uses the output body when it can be converted to text. Non-text standalone tool output is represented by the placeholder `[non-text output]` rather than silently disappearing from the transcript.
9. The general transcript builder likewise stops dropping `FunctionCallOutput { call_id: None, .. }`. When ToolOutputs are included in transcript sources, it preserves the namespace/name when available and uses the same non-text placeholder behavior.
10. The recent-image collector removes the prior requirement that function/custom-tool output images be paired with a known call id. Images from standalone or otherwise unpaired function/custom-tool outputs can now be selected as recent images for image-generation edit requests.
11. A regression test expands the expected recent-image set to include an image carried by a standalone namespaced function output.
12. The commit message states that standalone function outputs injected into new and forked threads are treated as external context and that memory is marked polluted when `memories.disable_on_external_context` is enabled. The code and tests directly demonstrate the injected-item and forked-history mechanisms described above.

## Maintainer claims

The maintainers frame the change as handling standalone tool outputs as external context rather than ordinary paired tool results. They also state that the change preserves those outputs in Guardian transcripts and permits recent-image reuse from standalone or unpaired tool outputs. These claims are supported by the merged predicate changes, transcript cases and image-selection regression tests, but they are scoped to the Codex paths changed in this commit.

## Mechanisms

### Classify provenance by call pairing

The decisive signal is not that an item is a tool output in general; it is that a `FunctionCallOutput` lacks the `call_id` that normally connects the output to an invocation in the thread. That makes provenance materially different from a paired local tool execution and gives Codex a concrete condition for treating the content as external context.

### Convert external context into a durable memory-state transition

The policy is conditional. Only when `memories.disable_on_external_context` is enabled does detection of the standalone output trigger `mark_thread_memory_mode_polluted_if_external_context`. The app-server regression reads the SQLite-backed state and verifies the durable thread memory mode becomes `polluted`.

This separates evidence classification from policy response: the item can be identified as external context even when the configured memory policy does not disable reuse.

### Preserve source identity in audit-oriented transcripts

Previously, a standalone function output could be dropped from transcript construction. The merged code now keeps the output and, where available, carries the namespace and tool name into the transcript role. This prevents the memory-protection mechanism from being implemented by erasing the content's tool origin from the Guardian view.

### Treat non-text evidence differently from transcript text

Non-text output is represented as `[non-text output]` in Guardian/general text transcripts, while image-generation history can still recover image URLs from function/custom-tool outputs without requiring a paired call id. The two consumers therefore preserve different representations appropriate to their purpose rather than pretending all output is textual.

## Evidence

- The external-context predicate explicitly includes `FunctionCallOutput { call_id: None, .. }`.
- `thread/inject/items` marks the thread memory polluted after persisting an injected standalone output when the disable-on-external-context policy is enabled.
- The app-server test initializes `StateRuntime` and asserts the stored thread memory mode equals `polluted` after injection.
- Forked-history initialization scans for standalone function output and invokes the same pollution helper under the policy flag.
- Guardian and general transcript tests preserve `slack.notifications` as the tool-source identity and use `[non-text output]` for non-text bodies.
- Recent-image collection no longer requires a matching call id and its regression includes a standalone tool-output image.

## Limitations

1. The memory transition is configuration-dependent. The commit does not establish that memory is always disabled whenever standalone output exists.
2. `call_id: None` is a provenance heuristic demonstrated by this data model; it is not cryptographic proof that the content came from an untrusted external principal.
3. The commit does not show independent authentication or integrity validation of the standalone result itself.
4. The forked-history post-scan is explicitly visible in the initialization patch; the shown code does not establish an identical scan for every resumed-history path.
5. Marking a thread `polluted` demonstrates a durable state used by the memory subsystem, but this commit does not by itself prove every future memory consumer honors that state correctly.
6. Guardian transcript identity is preserved only to the extent name/namespace metadata exists on the response item. Missing or false metadata is not independently validated here.
7. Representing non-text content with a placeholder preserves the fact that non-text output existed, not the full binary content in the text transcript.
8. Image reuse from unpaired output improves edit continuity but also means external-context images remain usable by that feature; the commit does not claim that memory pollution is a universal ban on every downstream consumer.
9. This is not a general statement that all tool output is unsafe, and it is not a proof of end-to-end memory contamination resistance.

## Comparisons

- **Before:** standalone function outputs without a call id were not included in the external-context predicate and were skipped by the transcript path shown in the patch; recent-image selection required pairing against known calls.
- **After:** call-id-less function output is an explicit external-context case, can durably mark thread memory polluted under policy, remains attributable in transcripts, and can still contribute image content to recent-image selection.
- A policy that simply drops all standalone outputs would reduce contamination risk by erasure but would also discard potentially legitimate external evidence. The merged approach keeps the content while attaching a different provenance/memory treatment.
- A stronger provenance mechanism could bind the external result to an authenticated source principal or signed execution receipt. This commit uses structural pairing state rather than such a cryptographic identity.

## Unresolved questions

1. Which downstream memory read/reuse paths consult the `polluted` mode, and can any consumer bypass it?
2. What clears or supersedes a polluted state, and is that transition itself audited?
3. How are standalone outputs created by legitimate integrations distinguished from maliciously injected outputs beyond the missing `call_id` signal?
4. Does resumed history that already contains standalone output receive equivalent pollution handling through another path not shown in this commit?
5. Can namespace/name metadata be authenticated or tied to the connector/tool principal that produced the result?
6. Should non-text external-context artifacts carry hashes or durable references in Guardian transcripts instead of only a placeholder?
7. How should image reuse interact with an external-context pollution policy when the image itself is the potentially contaminating artifact?

## Reading boundary

This note establishes a merged and tested Codex mechanism: standalone `FunctionCallOutput` items without a `call_id` are explicitly recognized as possible external context; under `memories.disable_on_external_context`, demonstrated injection/fork handling can mark the thread memory mode `polluted`; Guardian/general transcripts preserve named tool-source identity; and recent-image selection can still reuse unpaired output images. The evidence does not establish that all tool output is untrusted, that memory is universally disabled, that the source identity is authenticated, or that every future memory/context consumer is protected. Those broader judgments belong to Skill 04 Analysis.
