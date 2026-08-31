---
title: "The Conversation Continues, but the Account Has Changed"
date: '2026-08-31'
updated: '2026-08-31'
column: open-source-engineering
category: daily
article_type: comparative-engineering-analysis
edition: research-center
research_question: "During cross-session recovery, why must conversation, precise-operation authority, execution principal, and evidence attribution each be verified independently?"
summary: "Eleven approval-consumption controls and eight skill-session binding controls show that a session change alone need not invalidate an exact approval, while an old task cannot inherit authority unconditionally. Conversation continuity, operation authority, execution-principal continuity, and evidence attribution are four separate questions; real provider-account switching remains unverified in CodeFlowMu."
sources: "/en/research/evidence/2026-08-31-runtime-continuity"
project_relevance: substantive-relationship
item_id: "RCR-20260831-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-31-session-principal-continuity-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

[中文](/zh/engineering/2026-08-31-session-principal-continuity)

<ArticleCover
  image="/assets/covers/daily-2026-08-31-session-principal-continuity-cover.png"
  kicker="Runtime Continuity Research · 02"
  title="The Conversation Continues, but the Account Has Changed"
  summary="Conversation continuity does not prove continuity of approval, execution identity, or evidence ownership."
  version="RCR-20260831-02"
  status="Comparative Engineering Research · 2026-08-31"
  languageHref="/zh/engineering/2026-08-31-session-principal-continuity"
  languageLabel="中文"
/>

# The Conversation Continues, but the Account Has Changed

Suppose an Agent receives human approval, is interrupted, and resumes in a new session. Can it continue the operation?

“A new session must always be approved again” turns routine recovery into an approval loop. “It is the same task, so it can naturally continue” is the opposite error: an unchanged task ID does not prove that the caller, target, or account is unchanged.

CodeFlowMu is the local multi-Agent collaboration system that we develop and maintain. It manages sessions, tool calls, human approval, and result records for role-bearing Agents working on engineering tasks. A task may span sessions, so we must separately ask what the new session may do, which provider or host principal now executes it, and where later evidence belongs.

The study separates four forms of continuity:

- **Conversation continuity** — is this the same conversation or work context?
- **Operation-authority continuity** — does the original approval still cover this exact operation?
- **Execution-principal continuity** — which provider account, service principal, or host identity executes now?
- **Evidence-attribution continuity** — which session, task, thread, and agent own the invocation and its evidence?

For developers and approvers, this prevents two bad defaults: extra approvals on ordinary recovery, and authority inherited merely because an old task exists. Our fixed-baseline experiments test eleven approval-consumption conditions and eight invocation-binding conditions. They support retaining existing safeguards and narrowing the untested provider-identity boundary; they do not support rewriting an entire session framework.

## 1. An external account-switch case is a real scenario, not our proof

[Superset](https://www.ycombinator.com/companies/superset) is a YC-backed open-source IDE for managing parallel coding Agents. Its [PR #6970](https://github.com/superset-sh/superset/pull/6970) lets a user switch the default provider account, restart eligible running agents, resume the same CLI session ID and conversation, and launch the new process under the new login. The PR reports manual QA with two real Claude accounts: the conversation survived while the new process received the new account environment.

That makes “same conversation, changed execution account” a real recovery scenario rather than a thought experiment. It does not decide whether a CodeFlowMu human approval covers a new principal; we did not perform a real two-account experiment in CodeFlowMu.

[OpenAI Codex](https://github.com/openai/codex) offers a different, narrower contrast. One change preserves root/parent turn lineage across goal continuations and invalidates it when external context or the goal changes; another restores working directory only from a settings snapshot owned by the resumed thread, not a legacy or unowned snapshot. [Lineage change](https://github.com/openai/codex/commit/4210c08defe92fe8828f789b6f9fda287ad3709e), [owned-snapshot change](https://github.com/openai/codex/commit/f5636bb733c4653a6b91413fed1aaf8842374f2e).

Codex is handling ownership and recovery semantics, not human approval. The lesson used here is limited: historical state can be readable without being inheritable by the current execution.

## 2. A session change alone does not invalidate an old approval

The experiment fixes main commit `f0f42f01` and calls the real `OperationApprovalService`. Each independent case first receives ADMIN approval for a synthetic high-impact operation, then changes one consumption condition. It consumes authority but performs no remote action.

| Changed condition | Result | What it supports |
|---|---|---|
| Original session consumes | accepted | normal path works |
| session-1 → session-2, all other bindings and action match | accepted; receipt records session-2 | ordinary recovery may use matching approval |
| project, agent, task, thread, or role mismatch | not accepted | each ownership boundary is checked |
| operation fingerprint, target, or request snapshot changes | not accepted | exact operation identity is checked |
| empty session | not accepted | this consumption path requires a session identifier |

Both accepted paths reject a second consumption as `APPROVAL_ALREADY_CONSUMED`. The nine other conditions did not obtain authority; that is not nine execution failures.

The reason the resumed-session row is not a vulnerability is precise: the operation digest intentionally does not make a session string immutable. Consumption instead checks project, fingerprint, agent, task, thread, and role, requires non-empty old and current session identifiers, and stores the consuming session in the receipt. **Approval binds a constrained operation identity, not one transient process session.**

The method receives context supplied by the caller chain; it does not consult `SessionStore` at this point. The result proves which fields participate in matching, not that every external entry point can supply them honestly.

![Two aligned cobalt interlocking collars share one crystal core and violet provenance filament; an amber collar is offset.](/assets/figures/2026-08-31-session-principal-continuity-alignment.png)

*Figure 1. Recovery is allowed by a set of matching conditions, not by an unchanged session string. The offset collar means the current condition does not match; it does not mean every new session requires reapproval. Source: RCR-20260831 de-identified E-B1 authorization matrix.*

## 3. Permission to proceed and proof of ownership are different evidence

Authority consumption does not prove which session owns a later skill invocation. We separately test the V2.1.2 skill-binding path. The fixture registers two sessions in `SessionStore`, bound to one synthetic task and thread, and writes invocation records through the actual journal service.

| Input case | Persisted binding | Reason |
|---|---|---|
| Registered original or resumed session with matching ownership | `verified` | task, thread, and session are recorded |
| Unregistered or agent/task/thread-mismatched session | `invalid_claim` | the declared identity is rejected as binding evidence |
| Legitimate system action without a session and with a reason | `not_applicable` | `session_id:null` plus reason is retained |
| No session and no reason | `invalid_claim` | not disguised as legitimate sessionless work |

All eight captured records pass their product integrity checks; changing a task field causes rejection. That detects alteration in this fixture. It does not prove that an intact record is semantically correct, that a skill recommendation is correct, or that a task is complete.

Only two records are `verified`; five are `invalid_claim`; one is `not_applicable`. Six `session_id:null` values are therefore not a missing-field rate: five preserve the refusal to treat an untrusted claim as a bound session and one documents a legitimate sessionless system action. **Attribution answers who a record belongs to, not who was authorized to execute an operation.**

## 4. Execution principal is not yet a verified authority-contract input

CodeFlowMu's execution contract has fields for provider, host slot, workspace, tools, and governance authority. A field existing, a comparison function noticing a field, and an entry point enforcing a consequence are three different levels of fact.

P4 placed a synthetic `PROVIDER_ACCOUNT_ID` in an MCP environment and changed it. The contract digest did not change and comparison found no conflict; changing workspace did. This does not prove that a real provider-account switch bypasses permission. It does establish a narrower point: **a provider-account string appearing in an environment does not automatically become a governance identity.** [P4 capture](/assets/evidence/2026-08-31-runtime-continuity/fixtures/historical-probes.json)

The needed chain is `identity source → authenticated principal → authority contract → execution receipt`. A client sending an account ID does not answer who is entitled to assert that identity. We have not yet demonstrated that chain for provider switching.

## 5. What a real next experiment would test

Under authorized isolated test accounts, the next study would compare: normal recovery on the same account and target; the same conversation after a provider-account switch; and explicit rework or a changed target. It would verify the trusted source of the principal, the approved operation snapshot, the grant scope, and the attribution of the resulting session. Until then, retain the verified precise-operation approval and skill binding safeguards, and do not claim that account switching is safe or unsafe.

The [bilingual evidence guide](/en/research/evidence/2026-08-31-runtime-continuity) provides the eleven and eight captured cases plus the checker. The public check does not contain signing keys and does not pretend to rerun product HMAC verification.

**Conversation continuity, operation-authority continuity, execution-principal continuity, and evidence-attribution continuity are four different questions. Proof of any one does not prove the other three.**
