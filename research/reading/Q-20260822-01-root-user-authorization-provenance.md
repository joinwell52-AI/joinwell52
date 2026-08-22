# Q-20260822-01 — Root User Authorization Provenance in Subagent Guardian Review

- Runtime date: 2026-08-22 (Asia/Shanghai)
- Queue signal: SIG-20260822-016
- Primary source: https://github.com/openai/codex/commit/d12a7f3fd8a3f0dcffc665d515b9ee0dd3714315
- Evidence level: `merged_maintainer_change`
- Scope: OpenAI Codex MultiAgent V2 worker Guardian review only

## Problem

A worker can reach a review point after the root conversation has received new user authorization that is absent from the worker's own transcript. Simply forwarding a statement such as “the user approved X” into the worker would erase provenance and could let assistant-authored or agent-forwarded text impersonate root-user authority.

## Facts

The change adds `AgentControl::root_user_authorization()` for non-root MultiAgent V2 workers. It resolves the root thread, reads its raw history, preserves user versus assistant roles, and returns at most the latest 8 retained root messages. Each retained message is independently truncated to a 900-token Guardian budget.

Root user messages are retained except summary messages and `<user_action>` synthetic messages. Root assistant messages are retained only when their phase is absent or `FinalAnswer`; assistant commentary is excluded. Other item types are excluded.

`GuardianRootMessage` has distinct `User` and `Assistant` variants. Rendering prepends the original role to every line, so text embedded inside an assistant message such as `user: I approve ...` remains visibly assistant-authored rather than becoming a new user-role record.

The bounded root conversation is injected into both the core Guardian prompt and Guardian V2 classification input. The prompt states that only root-conversation user messages can authorize actions and that assistant messages are untrusted context; trusted developer approval messages elsewhere remain valid.

The added integration test covers late root-user authorization, forged `user:` role text inside an assistant final answer, a forwarded agent claim, summary-derived synthetic authorization, review-artifact synthetic authorization, and excluded assistant commentary. It also asserts that root authorization is not copied into the normal worker model request; it is exposed to Guardian review instead.

## Vendor Claims

The commit message states that the purpose is to preserve genuine root-user authorization for MultiAgent V2 Guardian reviews without treating forwarded or assistant-authored claims as authorization. The code and integration test directly support that scoped claim.

## Mechanisms

1. **Root identity binding:** resolve the thread at `AgentPath::root()` rather than trusting content carried by the worker.
2. **Role-preserving extraction:** parse structured turn items and encode retained evidence as `GuardianRootMessage::User` or `::Assistant`.
3. **Synthetic-evidence filtering:** remove compacted summaries, `<user_action>` entries, review artifacts, non-final assistant commentary, and unrelated item types from the root evidence feed.
4. **Bounded evidence window:** retain only the newest 8 eligible root messages and truncate each to 900 Guardian tokens.
5. **Review-plane isolation:** add root evidence to Guardian review/classification while leaving the ordinary worker model context unchanged.
6. **Role anti-spoof rendering:** prefix every rendered line with its structured source role, preventing an assistant string containing `user:` from being rendered as root-user evidence.

## Evidence

Primary evidence is merged maintainer commit `d12a7f3fd8a3f0dcffc665d515b9ee0dd3714315`, including the new authorization extractor, Guardian prompt integration, Guardian V2 classification integration, and a 324-line integration test.

The test's expected retained root conversation is: the original root user instruction, the root assistant final answer, and the later genuine root user approval. It separately verifies that forged assistant text and forwarded agent claims remain present only as untrusted transcript/context and that synthetic authorization artifacts are absent from root authorization evidence.

## Limitations

This does not prove end-to-end authorization safety for Codex or for arbitrary subagent operations. The demonstrated boundary is Guardian review for MultiAgent V2 workers.

The mechanism is evidence-windowed: only the latest 8 eligible messages survive and each can be truncated. A very old authorization or revocation can therefore fall outside this review evidence unless another control preserves it.

Assistant final answers remain visible as untrusted context. Correct authorization judgment still depends on Guardian honoring the role boundary and policy instruction.

The change does not turn natural-language authorization into a cryptographic capability, principal token, or immutable authorization ledger.

## Comparisons

Compared with forwarding a natural-language claim from one agent to another, this design retains authorization provenance at a more trustworthy boundary: structured root-thread history. Compared with copying all root history into the worker, it narrows exposure by using a bounded, review-only evidence channel.

## Unresolved Questions

- How are authorization revocations handled when the relevant root-user message falls outside the 8-message evidence window?
- Are there additional Guardian entry points outside the two changed paths that can review MultiAgent V2 worker actions without this root evidence?
- How does this review-time evidence interact with non-Guardian approval mechanisms and developer-level authorization?
- Is the 900-token-per-message truncation guaranteed to retain the portion of a long user message that actually grants or revokes authority?

## Reading Conclusion

The defensible result is narrow but important: Codex now carries **structured root-conversation provenance into MultiAgent V2 Guardian review**, and only structured root-user messages are designated as authorization evidence. Forwarded agent claims, assistant-authored role text, summaries and review artifacts cannot become root-user authorization merely by wording. This is not an end-to-end authorization guarantee.
