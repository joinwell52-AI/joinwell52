# Reading Record — Q-20260809-02 Short-lived workload identity exchange

- **Queue item:** `Q-20260809-02`
- **Column:** Industry Architecture
- **Selection status:** Selected
- **Priority:** P0
- **Skill invoked:** `Skill 03 — Deep Reading`
- **Operating date:** 2026-08-09 (Asia/Shanghai)
- **Primary source class:** merged maintainer implementation and tests

## Reading scope

This pass reads openai/codex commit `936f5eb3ee223ab34dcb221fa7c5f9943c8092bd`. The bounded question is the actual workload-identity exchange mechanism implemented by this change: assertion loading, exchange endpoint rules, token lifetime, caching, refresh, concurrency, transient-failure handling and secret exposure controls. The Queue hypothesis about child-process credential stripping is treated separately and is not accepted unless evidenced by this commit.

## Deep Reading output

```yaml
reading_notes:
  problem:
    - A workload may begin with a file-backed identity assertion that should not itself become the long-lived credential used for downstream ChatGPT access.
    - Repeated exchanges need bounded token lifetime, rotation awareness and concurrency control without leaking credentials into logs.
    - A transient refresh failure should not unnecessarily interrupt work while a previously issued token is still valid.

  facts:
    - The change adds a new `codex-workload-identity` crate.
    - It exchanges a file-backed JWT assertion plus federation rule ID for short-lived ChatGPT credentials.
    - The assertion file is reopened on every exchange, explicitly allowing the owner to rotate the assertion without restarting the process.
    - Assertion input is bounded to 16 KiB and rejected if empty, invalid UTF-8 or containing NUL bytes.
    - The exchange implementation caps accepted access-token lifetime at one hour.
    - A current access token is cached in memory and reused while valid.
    - Refresh happens before expiry or after rejection, and concurrent exchanges are coalesced behind shared state rather than independently issuing duplicate refreshes.
    - If proactive refresh fails transiently, the implementation can continue using a still-valid cached token.
    - The HTTP exchange has a 30-second request timeout and validates token endpoint / response behavior.
    - Production proxy and custom-CA policy are delegated to the supplied HTTP client factory; plain HTTP is accepted only for loopback development servers.
    - Access tokens are redacted from debug output.
    - Tests cover request encoding, assertion rotation, caching, concurrent refreshes, transient-failure fallback, configuration validation and malformed inputs/responses.

  mechanisms:
    - The durable or externally provisioned identity remains file-backed; the runtime derives a short-lived bearer credential and retains only the current token in process memory.
    - Reopening the assertion file at each exchange moves rotation authority outside the running process while preserving runtime continuity.
    - A mutex-protected cache turns many concurrent consumers into a single refresh authority and reduces exchange storms.
    - Proactive refresh is availability-aware: failure does not invalidate an otherwise still-usable cached token.
    - Endpoint validation, bounded response size, timeout and secret redaction form a narrow defensive perimeter around the exchange boundary.

  limitations:
    - This commit by itself does not demonstrate the Queue claim that launch-context identity is stripped from executions, MCP servers, hooks, Git or remote child processes.
    - It does not establish how the new crate is integrated into every downstream process-launch path; the selected commit is principally the exchange primitive.
    - Short-lived credentials reduce exposure duration but do not themselves prove least privilege or audience restriction beyond what the federation endpoint issues.
    - In-memory caching still exposes the current bearer token to the process that owns the exchange object.
    - The implementation does not constitute an end-to-end enterprise identity architecture without examining callers and child-process environment construction.

  contradictions:
    - The Queue object bundled “identity exchange” and “child-process credential boundary” into one architecture statement. The selected commit strongly evidences the former, but the latter is not substantiated in the visible change and must remain an unverified hypothesis for Analysis.
    - A proactive refresh failure is tolerated while the old token is valid, which favors availability over immediate credential renewal; the safety boundary therefore depends on the old token's still-valid lifetime.

  unresolved_questions:
    - Which Codex call sites instantiate this exchange and how is the resulting token injected into requests?
    - Are workload-identity source variables or exchanged credentials removed from all child-process environments in another commit?
    - What federation-side audience, subject and policy checks constrain the exchanged ChatGPT credential?
    - What happens when many processes, rather than many tasks inside one process, share the same rotating assertion file?
```

## Source traceability

1. openai/codex merged commit: `https://github.com/openai/codex/commit/936f5eb3ee223ab34dcb221fa7c5f9943c8092bd`
2. Today's Research Plan: `research/runtime/plans/2026/08/2026-08-09-plan.json`
3. Skill 03: `research/skills/03-deep-reading.md`

## Reading gate decision

**Result:** Deep Reading completed for the exchange primitive. The commit provides strong implementation evidence for file-backed assertion rotation, short-lived token exchange, bounded lifetime, cache/refresh/coalescing, transient-failure fallback, endpoint validation and token redaction. It does **not** by itself prove the broader child-process credential-stripping claim; that boundary is explicitly carried forward as unresolved evidence rather than promoted to fact.