# Q-20260826-03 — Copy-on-Mutation Isolation for Per-Invocation HTTP Options

- Runtime date: 2026-08-26 (Asia/Shanghai)
- Queue signal: SIG-20260826-016
- Primary source: https://github.com/google/adk-python/commit/67ca98c2c0b467ed397357eef2b2941c92dac40c
- Evidence level: `merged_maintainer_change`
- Scope: Google ADK RunConfig HTTP option copying, live HTTP clients, callback mutation isolation, live-session restart and regression coverage

## Problem

`RunConfig.http_options` may contain live `httpx`/`aiohttp` clients or an `SSLContext`. Deep-copying those objects can crash because their internal locks or SSL state are not pickleable. At the same time, simply reusing the whole `HttpOptions` object lets per-request processors or before-model callbacks mutate caller-owned containers and leak those edits into later invocations.

## Facts

The change introduces `copy_http_options`. It deliberately avoids a deep copy. Instead it copies the mutable container fields `headers`, `extra_body`, `client_args` and `async_client_args` with new dictionaries, shallow-copies `retry_options` through its model copy, and then creates a copied `HttpOptions` model with those replacements.

Live client fields are intentionally not replaced. The regression test verifies that a supplied `httpx_client` in the copy is the exact same object as in the caller's original configuration, while the listed mutable containers and retry options have distinct identities.

`_preprocess_async` now uses this helper when staging run-config HTTP options onto an LLM request. This prevents request assembly and callback mutation from writing through the demonstrated mutable fields into the caller's `RunConfig`.

Two live-session paths previously deep-copied the whole `RunConfig` just to clear `session_resumption.handle`: live agent transfer and live session restart. Both now call `run_config_for_new_live_session`, which performs a model copy that specifically copies only `session_resumption` and clears its handle. Other unmodified run-config state, including live HTTP resources, remains shared rather than being recursively cloned.

## Vendor Claims

The maintainer describes the fix as eliminating crashes and cross-invocation leaks caused by copying `RunConfig.http_options`. The changed copy helpers and identity/mutation regression tests directly support that bounded claim for the demonstrated fields and invocation paths.

## Mechanisms

1. **Mutation-specific copying:** code copies the substructures that downstream request assembly or callbacks can mutate instead of recursively copying the entire configuration graph.
2. **Live-resource reference preservation:** caller-supplied HTTP clients remain shared by identity because they are intentionally reusable, non-copyable resources.
3. **Container detachment:** headers, extra body, client arguments and async-client arguments receive new dictionary containers before request-local use.
4. **Retry-option detachment:** retry configuration receives its own model copy instead of remaining aliased to the caller object.
5. **Narrow live-session copy:** live transfer/restart copies `session_resumption` only because clearing its handle is the actual mutation required.
6. **Centralized helper boundary:** the copy logic lives in shared invocation utilities, reducing divergent ad-hoc copy behavior across LLM flow paths.

## Evidence

Primary evidence is merged Google ADK maintainer commit `67ca98c2c0b467ed397357eef2b2941c92dac40c`. It changes `_invocation_utils.py`, `base_llm_flow.py`, related helpers and regression tests.

A focused test constructs `HttpOptions` with mutable dictionaries, retry options, SSL contexts and a live `httpx.Client`. It verifies that the mutable demonstrated fields are distinct in the copy while the live client is shared by reference. The production flow then uses the same helper before handing request configuration to processors/callbacks.

## Limitations

This does not establish a universal rule that shallow copy is safe for every `HttpOptions` field. The helper explicitly enumerates the mutable fields it currently detaches.

Dictionary containers are copied, but arbitrary mutable nested objects stored inside those dictionaries are not recursively cloned. Nested-value mutation can therefore have different aliasing semantics from container-key/value replacement and needs separate evidence if it matters.

Live clients are deliberately shared. The change prevents cloning crashes and caller-container write-through; it does not make a shared client's own internal mutable state invocation-local or thread-isolated.

The helper's safety depends on future `HttpOptions` fields being reviewed when added. An unrecognized future mutable field could remain shared unless this boundary is updated.

## Comparisons

A full deep copy attempts maximal isolation but fails on legitimate live resources. A raw shared reference preserves those resources but also shares request-mutable configuration. The changed design splits the ownership domains: reusable live clients remain caller-owned shared capabilities, while the demonstrated configuration containers that may be mutated per invocation become invocation-local copies.

## Unresolved Questions

- Which nested values inside `client_args`, `async_client_args` or `extra_body` are permitted to be mutable, and are callbacks expected to mutate them in place?
- Is there a schema-level mechanism to ensure future mutable `HttpOptions` fields are added to the copy helper?
- What concurrency guarantees apply when multiple invocations intentionally share the same live client object?
- Should custom user objects in HTTP option containers expose an explicit clone/share policy rather than inheriting shallow-container semantics?

## Reading Conclusion

The selected ADK change establishes a practical copy-on-mutation boundary for the demonstrated HTTP configuration: per-invocation mutable containers are detached, while non-copyable caller-supplied live clients remain shared by reference. This removes the shown deep-copy crashes and prevents demonstrated container-level callback edits from leaking back into later invocations, but it is not a universal deep-isolation guarantee for nested objects or the live clients themselves.
