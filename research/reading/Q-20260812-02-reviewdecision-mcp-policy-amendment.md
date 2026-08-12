# Q-20260812-02 — Shared ReviewDecision separates MCP session consent from persistent policy amendment

- Runtime date: 2026-08-12
- Column: Industry Architecture
- Source object: Q-20260812-02 / SIG-20260812-G-003
- Primary source: https://github.com/openai/codex/commit/67afc7967463282af932be1984df9e16cc55ed99
- Evidence class: Fact for changed protocol/code/tests; Inference only where explicitly labeled
- Stage: Skill 03 Deep Reading only

## Problem

Approval systems become difficult to govern when each tool family invents its own decision enum and persistence semantics. The selected Codex change moves MCP tool approval responses onto the shared `ReviewDecision` contract while preserving a distinct decision for an approval that should amend MCP policy across sessions. The architecture therefore needs to distinguish one-call approval, one-session approval, persistent policy change, denial, timeout and cancellation without allowing an MCP-specific persistent decision to acquire meaning in unrelated tool paths.

## Facts

1. The shared `ReviewDecision` type now includes `ApprovedMcpPolicyAmendment` in addition to ordinary `Approved`, `ApprovedForSession`, exec-policy amendment, network-policy amendment, `Denied`, `TimedOut`, and `Abort` variants.
2. The protocol description defines `approved_mcp_policy_amendment` as approval of the MCP tool call plus a request to amend policy so matching future calls are automatically approved across sessions.
3. MCP approval handling is changed from a private `McpToolApprovalDecision` family to the shared `ReviewDecision` type.
4. MCP decisions that represent ordinary approval, session approval, MCP policy amendment, exec-policy amendment or network-policy amendment enter the accepted MCP tool-call branch; denial, timeout and abort remain non-approval outcomes.
5. An elicitation response marked to persist for the session maps to `ReviewDecision::ApprovedForSession`.
6. An elicitation response marked to persist always maps to `ReviewDecision::ApprovedMcpPolicyAmendment`.
7. The MCP approval-mode normalizer collapses session or persistent MCP approval back to ordinary `Approved` in approval modes that do not permit those persistence semantics.
8. When handling an approved MCP tool call, `ApprovedMcpPolicyAmendment` attempts to persist the MCP approval using a persistent approval key. If a persistent key is unavailable but a session key exists, the code falls back to remembering the approval for the session.
9. The shared decision is intentionally not universally meaningful. Command execution conversion treats `ApprovedMcpPolicyAmendment` as decline with an explicit fail-closed comment because MCP approvals are handled through elicitations.
10. The change description states that MCP-only policy decisions are rejected if they reach command, shell, network or other generic tool approval paths, and tests are updated to verify that behavior.
11. Guardian/auto-review and MCP elicitation code is updated so approved MCP policy amendments are represented as accepted MCP outcomes, while denial, timeout and abort remain rejection-like outcomes.
12. Rejection reasons are preserved through the shared `Denied { rejection }` decision rather than being discarded during MCP normalization.

## Mechanisms established by the source

### Shared decision surface, domain-specific meaning

`ReviewDecision` acts as a common transport and control-plane vocabulary, but not every variant is valid in every domain. The MCP persistent-policy variant is represented centrally while downstream adapters enforce where it is legal.

### Three persistence scopes

The source establishes at least three distinct approval scopes for MCP calls:

- `Approved`: approve the current request without a persistence promise.
- `ApprovedForSession`: remember approval within the current session when the approval mode allows it.
- `ApprovedMcpPolicyAmendment`: request a durable policy change so matching future calls can be auto-approved across sessions.

This is materially different from a single boolean allow/deny gate.

### Policy-mode normalization

Requested persistence is not automatically honored. If the active approval mode permits only prompt or write-level behavior, session and persistent decisions are normalized to ordinary approval. The effective governance policy therefore constrains the durability of a user decision.

### Keyed persistence with bounded fallback

Persistent approval attempts are associated with a persistent approval key. If that key is unavailable but a session approval key exists, the implementation falls back to session memory. The selected source therefore distinguishes the user's decision intent from the persistence capability actually available on that request path.

### Fail-closed cross-domain adapters

A shared sum type creates the possibility that a decision reaches the wrong approval adapter. The command-execution adapter explicitly converts the MCP-only persistent decision to decline. The maintainer description and tests extend this fail-closed principle to generic tool approval paths.

## Evidence

- Commit `67afc7967463282af932be1984df9e16cc55ed99` adds the protocol variant, modifies MCP tool-call handling, session/Guardian mapping and generic approval conversions, and updates tests in one change boundary.
- Generated TypeScript/schema output shows `approved_mcp_policy_amendment` as part of the shared ReviewDecision contract.
- `mcp_tool_call.rs` maps session persistence to `ApprovedForSession`, persistent approval to `ApprovedMcpPolicyAmendment`, and handles persistent/session keys separately.
- Command-execution conversion contains an explicit fail-closed case for the MCP-only variant.

## Limitations

1. A `ReviewDecision` value is a decision representation; it is not proof that a requested persistent policy amendment was successfully written to durable policy storage.
2. The fallback from persistent key absence to session approval means decision intent and effective persistence scope can differ. The selected commit does not expose a separate user-facing acknowledgement for that downgrade.
3. The source does not define the complete matching rule that determines which future MCP calls a persisted amendment auto-approves.
4. It does not establish the lifetime, revocation UI, synchronization model, or conflict-resolution policy for persisted MCP approval rules.
5. The source demonstrates fail-closed conversion in affected generic approval paths, but it does not prove that every future consumer of `ReviewDecision` will automatically enforce domain restrictions.
6. Approval is only one governance layer; the commit does not establish sandbox, data-access, credential or external-side-effect guarantees after approval.
7. `Abort`, `TimedOut`, and `Denied` share the non-approval side of the MCP decision path, but they remain semantically distinct outcomes and should not be collapsed in audit data.

## Comparisons

- **Tool-specific decision enum:** simplifies local implementation but fragments audit, hook and UI semantics across tool families.
- **Shared ReviewDecision without domain guards:** unifies transport but risks interpreting an MCP-only persistent decision in shell/network/command paths.
- **Shared ReviewDecision plus fail-closed adapters:** centralizes the vocabulary while making domain authorization explicit at conversion boundaries.
- **Boolean approval:** cannot represent session-only approval, persistent policy amendment, rejection reason, timeout and cancellation as distinct governance outcomes.

## Unresolved questions

1. How is a successful persistent MCP policy amendment durably acknowledged back to the caller after the decision is accepted?
2. What exact tuple forms the persistent approval key, and how narrowly does it match future MCP calls?
3. How are persisted MCP approvals listed, revoked, versioned or migrated when MCP tool definitions change?
4. If persistent storage fails after the user chose `ApprovedMcpPolicyAmendment`, does the user see that the effective outcome fell back to session scope?
5. Are Guardian decisions allowed to originate persistent MCP policy amendments, or only to consume/normalize them in the changed path?
6. How are simultaneous policy amendments serialized and audited across sessions?
7. Can a centrally managed enterprise policy prohibit persistent user amendments even when the protocol can represent them?

## Reading boundary

This note records the shared decision contract, MCP persistence scopes, normalization, fallback and fail-closed domain boundaries in the selected commit. It does not decide the appropriate approval hierarchy for TMPA or a Digital Employee platform; that belongs to Skill 04 Research Analysis.
