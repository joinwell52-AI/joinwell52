# Q-20260819-03 — OAuth refresh persistence failure must remain visible

- Runtime date: 2026-08-19
- Column: Open-source Engineering
- Source object: Q-20260819-03
- Primary source: https://github.com/modelcontextprotocol/typescript-sdk/commit/3924de99df834302d89f5997a1b64ca268282284
- Evidence class: Fact for merged code/tests; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

Refreshing an OAuth credential and durably saving the returned credential set are two different failure domains. Before this MCP TypeScript SDK change, both operations lived inside one catch block. If the authorization server successfully issued fresh credentials but the client provider then failed to persist them, that storage error could be swallowed as if the refresh itself had failed. The client could fall through into a new authorization flow while a rotating authorization server had already invalidated the old refresh token. The merged change makes the persistence failure visible to the caller instead of silently reclassifying it as a refresh failure.

## Facts

1. Before the change, `refreshAuthorization()` and `provider.saveTokens()` were executed inside the same `try` block in the refresh-token path.
2. The associated catch deliberately allowed selected refresh failures — including server errors and unknown non-OAuth-shaped failures — to fall through to a new authorization request.
3. A provider I/O exception from `saveTokens()` could therefore enter the same catch and be discarded along with those refresh failures.
4. In that prior path, `auth()` could continue to `startAuthorization()` and return `REDIRECT` even though the authorization server had already issued a valid fresh token set.
5. The new implementation declares `newTokens` outside the try, keeps only `refreshAuthorization()` inside the guarded block, and performs `provider.saveTokens({...newTokens, issuer}, infoCtx)` afterward on an unguarded path.
6. When that persistence call rejects, the error now propagates to the caller.
7. The regression test injects a successful refresh response containing a new access token and a new refresh token, then makes `saveTokens()` reject with `Error('disk full')`.
8. The test expects `auth()` to reject with the same persistence error.
9. The same test verifies `saveTokens()` received the newly minted token values and verifies `redirectToAuthorization` was not called.
10. The change does not alter the existing control flow for genuine refresh-request failures: an insecure token endpoint remains surfaced; non-server OAuth errors are rethrown; server errors or unknown refresh failures may still fall through to fresh authorization.
11. Those deliberate fallthrough paths now emit warnings naming the cause, making previously silent re-authorization behavior operator-visible.
12. Outer recovery for `invalid_grant`, `invalid_client` and `unauthorized_client` still invalidates the relevant stored credentials when the provider implements invalidation and retries authorization; warnings now explain that transition.
13. A test covers a provider that does not implement `invalidateCredentials`: the stale refresh token cannot be removed, the retry reuses it, and a later `invalid_grant` propagates instead of being silently hidden forever.
14. The existing issuer stamp added to refreshed token storage is unchanged.
15. The commit explicitly notes a compatibility change: `OAuthClientProvider.saveTokens` implementations that may reject can now cause `auth()` to reject where previous SDK behavior could return `REDIRECT`.
16. The SDK does not establish a separate authoritative in-memory token store in this changed path before provider persistence. The freshly returned credential set is held in local `newTokens` and passed to the provider. Provider-specific partial writes or in-memory mutation remain outside this commit’s guaranteed semantics.

## Maintainer claims

The change claims that persistence errors after a successful refresh should surface, that refresh errors should preserve their prior control flow, and that silent reauthorization should become diagnosable through warnings. The merged implementation and regression tests directly support those claims. The commit also explains the rotating-refresh-token failure mode, but that explanation is a protocol/operational consequence rather than proof that every authorization server rotates tokens.

## Mechanisms

### Split the refresh and persistence failure domains

The key mechanism is structural rather than a new error type: the persistence call is moved out of the catch that interprets refresh errors. A storage exception can no longer be mistaken for an authorization-server refresh exception merely because both operations occur sequentially.

### Preserve successful refresh state as an explicit local value

`newTokens` is assigned only when `refreshAuthorization()` succeeds. After the guarded block, its presence selects the persistence-and-authorized path. If persistence fails, control exits through the rejection rather than falling through to `startAuthorization()`.

### Fail-visible handling for rotated credentials

When an authorization server rotates refresh tokens, issuance of the fresh token can invalidate the old one before the client’s persistence step completes. Propagating the persistence error cannot undo that server-side transition, but it prevents the SDK from misreporting the state as an ordinary redirect and gives the caller a chance to surface or recover from a credential-loss condition.

### Warnings on deliberate reauthorization paths

The existing recovery behavior for selected refresh/auth errors remains, but warnings now identify why credentials are being invalidated or why a fresh authorization flow is starting. The warning strings JSON-encode server-supplied values to avoid turning arbitrary response content into forged log lines.

### Provider-owned persistence boundary

The SDK calls `provider.saveTokens()` and relies on that provider implementation for durable storage. The change guarantees propagation of provider rejection; it does not make persistence atomic, transactional or automatically retryable.

## Evidence

- The changeset documentation explicitly describes the prior combined catch and the new split control flow.
- `authInternal` now keeps only `refreshAuthorization()` in the refresh catch and invokes `saveTokens()` afterward.
- The regression test verifies a `disk full` persistence error propagates and that no redirect fallback occurs.
- Additional tests preserve and document behavior for server-side refresh failures and `invalid_grant` recovery.
- Warning helpers describe whether stored credentials are actually invalidated, including the case where the provider exposes no invalidation function.
- The public documentation notes the behavioral compatibility impact for providers whose `saveTokens()` can reject.

## Limitations

1. Error propagation is not transaction rollback. If a provider partially persists data and then throws, this change does not define automatic rollback.
2. The SDK cannot reverse an authorization server’s refresh-token rotation after a successful token exchange.
3. No automatic retry policy for `saveTokens()` is introduced; retry safety and timing are left to the caller/provider.
4. The change does not guarantee that every provider performs durable fsync/atomic rename/database transaction semantics before resolving `saveTokens()`.
5. It does not provide exactly-once credential persistence or distributed transactionality between the authorization server and client storage.
6. The rotating-token impact described in the commit applies when the server actually invalidates the old refresh token on successful issuance; deployments with different policies may have different consequences.
7. Warning visibility depends on the consumer’s logging environment and does not itself guarantee alerting or operator action.
8. The change addresses this SDK refresh path; it does not prove all OAuth credential-write paths in an application have equivalent failure separation.

## Comparisons

- Treating refresh and persistence as one operation is compact but semantically wrong once the server exchange can succeed independently of local storage. Splitting the catch makes the commit point visible.
- Automatically starting a new authorization flow after a storage failure can hide the real fault and may destroy recoverability under refresh-token rotation. Propagation favors fail-visible behavior.
- A fully transactional credential protocol would need coordination across server issuance and client persistence, which OAuth does not provide here. This patch therefore improves failure classification rather than creating distributed atomicity.

## Unresolved questions

1. Should the SDK offer an optional bounded retry hook for transient `saveTokens()` failures, and how would it avoid unsafe duplicate provider writes?
2. Can providers expose stronger persistence capabilities such as atomic replace, durability acknowledgement or compare-and-swap so callers can reason about partial failures?
3. Should the SDK retain the freshly issued token set in an explicit recovery object when persistence fails, allowing the application to attempt a controlled save without repeating the refresh exchange?
4. How should headless clients surface this propagated error so operators understand that credentials may have rotated server-side even though local storage failed?
5. Are token-refresh persistence failures observable in telemetry separately from authorization-server refresh failures and user-driven reauthorization?
6. Do transport-level 401 retry paths built on `auth()` preserve the propagated persistence error without masking it in another fallback layer?

## Reading boundary

This note establishes a merged, tested reliability correction in the MCP TypeScript SDK: successful OAuth refresh and local token persistence are now separate failure domains, a `saveTokens()` rejection propagates instead of falling through to a fresh authorization redirect, genuine refresh failures retain their intended recovery behavior, and deliberate reauthorization paths are more visible through warnings. It does not establish atomic OAuth transactions, rollback, automatic persistence retry, exactly-once storage or universal refresh-token rotation behavior. Those broader judgments belong to Skill 04 Analysis.
