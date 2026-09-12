# Q-20260912-02 — Long-Lived Agent Systems Need Explicit Authority Precedence When Current Policy Conflicts with Retained Session State

- Runtime date: 2026-09-12 (Asia/Shanghai)
- Queue signals: SIG-20260912-001, SIG-20260912-003
- Comparison signal: SIG-20260912-002
- Primary sources:
  - https://github.com/openai/codex/commit/39d193d72d7959d798642bd3e1496bb8865033b1
  - https://github.com/modelcontextprotocol/typescript-sdk/commit/b65426158ed9f29aea8ef3dc09ca22d7d9d6f970
  - https://github.com/google-gemini/gemini-cli/commit/9c1b0a610534d6f8120964cf2672c07807d8fc90
- Evidence level: `merged_maintainer_change`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

When a long-lived agent retains session configuration, caller-supplied credentials or workspace-visible state while current managed policy and runtime identity can change, which source of authority should win at action time, where should precedence be enforced, and which control operations must remain available after rejection?

## Problem

Long-lived agents accumulate state at different lifetimes. A thread may keep the model-provider route selected when it began. A tool transport may keep caller-configured headers while an OAuth provider later obtains a fresher token. A workspace sandbox may see project files while credentials, trust decisions and policy-integrity state live in the user's runtime area.

Each retained value can be syntactically valid and internally consistent. The safety problem appears when it is no longer the authoritative value for the next effect. If the system has no explicit precedence rule, stale session state may continue to drive model calls, stale credentials may override current authenticated identity, or workspace influence may reach the control state that decides what is trusted.

The three source changes address different layers of this problem. They are comparable as engineering evidence for authority precedence, but they are not equivalent implementations and do not establish a universal policy.

## Sample 1 — Codex Revalidates a Retained Provider Route

The Codex change states that existing app-server threads retain their provider configuration. The new check does not rebuild the complete thread configuration from current user or project defaults. Instead, `check_thread_model_provider` loads current managed requirements independently and compares them with the provider selection and provider definition retained by the thread.

The check covers operations capable of driving the model or changing active work:

- turn start and steer;
- review;
- compaction;
- manual queue start;
- activation or update of a thread goal.

The implementation compares current managed `model_provider` selection with the retained `model_provider_id`, and, when a managed provider definition exists for that provider, compares the required definition with the retained provider definition. Amazon Bedrock variants receive an explicit merge with their built-in provider definition before comparison, avoiding a false mismatch caused only by override representation.

A changed selection or definition returns a permission-denied error. A failure to load or parse the managed requirement also rejects the input rather than falling back to the retained route. The commit describes and tests that rejection occurs before queue or goal state is mutated.

The boundary is selective. Interrupt, realtime stop, and goal pause or clear remain available because they reduce or stop activity rather than initiate new model-driving work. Realtime connections use separate routing and are outside this check. Ordinary user or project configuration changes alone do not invalidate an existing thread; the invalidating authority is the managed requirement.

### Reproducible engineering evidence

The change includes unit and integration coverage for provider selection changes, provider-definition changes, Bedrock overrides, requirement-loading failures, unchanged queue/goal state after rejection, continued operation after local configuration changes, and detached reviews inheriting their parent thread's provider route.

This is strong evidence about the implementation and its tested boundary. Merge status does not independently establish organization-wide effectiveness or prove that every effect-producing call site is covered.

## Sample 2 — MCP Gives Runtime-Derived OAuth Identity Precedence

The MCP TypeScript SDK change addresses precedence inside `SSEClientTransport` and `StreamableHTTPClientTransport`. Previously, transport-managed headers and caller-supplied `requestInit.headers` were merged in an order that allowed the configured value to win. Case variants could also survive as separate object keys and later become a combined two-token header.

The failure mode was concrete: a static caller `Authorization` placeholder could keep overriding a fresh OAuth token after `authProvider` obtained one, preventing the intended fallback-to-OAuth transition. A lowercase/uppercase duplicate or a `Headers` instance could produce a combined value such as fresh and stale bearer tokens in one header.

The revised construction order is:

1. initialize a Fetch `Headers` object from caller-supplied headers;
2. obtain the current provider token;
3. use `Headers.set` to overwrite transport-managed names.

Because `Headers.set` treats names case-insensitively, transport-derived `Authorization`, protocol version, and Streamable HTTP session ID deterministically replace same-named caller values. Other caller headers remain unchanged.

The transition rule is deliberately conditional. Before the provider has a token, a configured `Authorization` value remains usable; once the provider returns a token, the runtime-derived bearer token becomes authoritative. Custom fetch paths remain wrapped so the same precedence applies.

The accompanying change note and tests cover plain objects, tuple arrays, `Headers` instances, case variations, configured-header fallback before a token exists, provider-token takeover, and preservation of unrelated headers.

### Reproducible engineering evidence

This is source-level and test-backed evidence for deterministic header precedence at the transport boundary. It does not show how every MCP server validates the resulting token, and it does not make authorization policy equivalent to authentication-header selection.

## Sample 3 — Gemini CLI Separates Workspace Effects from Runtime Control State

The Gemini CLI change uses isolation rather than replacement. It hardens sandbox profiles and host-path admission so workspace-executed code cannot read or write the files that define credentials, trusted folders, trusted hooks, policy integrity or environment secrets.

The protected set includes OAuth and account stores, MCP and A2A token files, trusted-hook and trusted-folder records, `policy_integrity.json`, and `.env` variants. Host-path resolution handles real paths and symlinks; resolution failure returns a sensitive result and therefore fails closed. The sandbox settings copy is sanitized to remove hooks, command hooks and API-key fields.

The command-loading behavior distinguishes the trust domains: in an untrusted folder, global user commands can remain available while project and extension commands are excluded. The change also introduces a runtime-directory distinction for sandbox execution, including a separate persistent cache location under macOS Seatbelt, while keeping the host-side control state outside ordinary workspace mutation.

Unlike Codex and MCP, this sample does not decide between two values at a request field. It prevents one substrate from acquiring the ability to observe or rewrite the state that another substrate treats as authoritative.

### Reproducible engineering evidence

The commit contains tests for sensitive-path classification, home-directory and symlink handling, sandbox read/write denials, settings sanitization, trusted versus untrusted command loading, and runtime-directory resolution. It establishes implementation intent and covered cases, not proof against arbitrary sandbox escape or a compromised host.

## Cross-Sample Comparison

| Dimension | Codex retained thread route | MCP transport headers | Gemini CLI sandbox |
|---|---|---|---|
| Retained or lower-authority state | Thread provider selection and definition | Caller-supplied headers | Workspace/project files and commands |
| Current authority source | Managed provider requirements | Token returned by current auth provider plus transport session/protocol state | Host/user runtime credentials, trust and policy-integrity stores |
| Enforcement point | Before model-driving or state-changing input RPCs | HTTP/SSE request-header construction | Sandbox profile, mount/path admission and command loading |
| On conflict or uncertainty | Reject; requirement-load failure also rejects | Replace same-named managed fields; retain fallback only before a provider token exists | Deny access or exclude untrusted project/extension commands |
| Safe controls preserved | Interrupt, realtime stop, goal pause/clear | Unrelated configured headers; static authorization before provider token | Global user commands in an untrusted folder |
| Main non-equivalence | Revalidates policy against retained session identity | Resolves current request-field ownership | Isolates control state from a less-trusted execution substrate |

The common mechanism is not “always use the newest value.” It is to declare which source is authoritative for a particular effect, refresh or protect that source at the relevant boundary, and give conflict handling deterministic semantics.

## Failures and Negative Evidence

### Startup-only admission becomes stale

A thread that was valid when created can become non-compliant after managed requirements change. Retained coherence is not evidence of current authorization.

### Flexible merge creates ambiguous identity

Combining caller and transport headers without a single owner can preserve a stale credential or create a malformed multi-value identity field. General merge flexibility is unsafe for authority-bearing names.

### Workspace access can become control-plane access

If sandboxed work can modify credential, trust or policy-integrity files, a business workspace effect can rewrite the conditions under which later effects are admitted.

### Fail-open policy loading

Treating an unavailable requirement as “no requirement” would grant retained state more authority precisely when current policy cannot be established. The Codex implementation instead rejects model-driving work.

### Over-broad rejection can harm recovery

Blocking every operation after a mismatch would remove the user's ability to stop or reduce activity. Codex preserves negative controls; Gemini preserves a bounded user-owned command surface. Safe failure therefore needs an operation taxonomy, not a single global off switch.

## Evidence Classes

### Fact

The three cited commits are merged maintainer changes with source diffs and tests. Their exact mechanisms, declared boundaries and test cases are inspectable in the repositories.

### Reproducible Engineering Evidence

The commits demonstrate implemented checks for retained-provider mismatch, case-insensitive transport-header replacement, and sandbox/runtime-state isolation under their respective test environments.

### Inference

A governed agent architecture should bind each effect-bearing operation to an explicit authority owner and precedence rule. The rule should be enforced where all policy-relevant facts are observable and before the external effect or state mutation begins.

### Unknown

The available evidence does not establish comparative production incident rates, complete call-site coverage, resistance to compromised control-plane sources, universal sandbox containment, or one precedence model suitable for every tool and organization.

## Bounded Implications for Governed Digital Employees

The evidence supports separating at least four questions:

1. which state is retained for continuity;
2. which current source has authority for the next effect;
3. when and where that authority is refreshed or protected;
4. which stop, rollback or recovery operations remain legal when positive work is rejected.

An agent's memory, workspace and session state may help describe intended work, but none should silently outrank current managed policy, runtime-authenticated identity or protected trust state. Conversely, “current” is not enough by itself: the system must define the authoritative source, the operation class and the conflict behavior.

## Limitations

- All three sources are first-party repository evidence, not independent deployment evaluation.
- The systems operate at different layers, so shared language about authority does not imply identical threat models.
- Codex coverage is limited to the enumerated app-server operations and excludes realtime routing.
- MCP header precedence governs identity-bearing request fields, not the server's full authorization decision.
- Gemini's sandbox hardening assumes the host enforcement mechanism and path-resolution boundary are not compromised.
- None of the commits measures long-term usability costs, false-rejection rates or cross-organization policy portability.

## Unresolved Questions

1. How can repositories prove that every effect-producing call site passes through the same current-authority check?
2. Should an authority update invalidate in-flight work, only the next action, or an entire session epoch?
3. How should cached policy be versioned when the authoritative service is temporarily unavailable?
4. Which negative controls must remain available across all rejection states?
5. How should transport identity, task authorization and artifact authorization be bound without collapsing them into one token?
6. Can sandbox control-state isolation be attested independently of the host that enforces it?
7. How should multi-agent delegation narrow authority when parent and child operate through different transports and policy stores?

## Reading Conclusion

The sources support a bounded architectural observation: long-lived continuity and current authority are separate properties. Codex revalidates managed provider requirements before selected positive operations; MCP makes runtime-derived OAuth and transport state overwrite stale caller fields; Gemini CLI removes credential and trust state from the workspace sandbox's authority surface. Together they show three complementary patterns—revalidation, replacement and isolation—but they do not prove a universal implementation. Analysis must decide how these patterns combine and where their assumptions remain incompatible.

This Reading Note performs evidence extraction only. It does not execute Research Analysis, article writing, visualization, Production or Publication.
