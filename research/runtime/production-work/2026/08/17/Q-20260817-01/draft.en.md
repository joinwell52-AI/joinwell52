---
schema: publication-candidate-article/v2
title: "Forward-Compatible APIs Still Need Selective Fail-Closed Boundaries"
date: '2026-08-17'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "How should a forward-compatible agent API retire a field when silently ignoring that field would change the caller's authorization meaning?"
summary: "Forward compatibility does not require ignoring every unknown field. When silent loss of a retired field would change authorization or execution meaning, an API can preserve its general permissive rule while explicitly rejecting that narrow class before decoding, naming a migration path, and observing stale-client behavior."
cover: research/runtime/production-work/2026/08/17/Q-20260817-01/baseline-cover.png
sources:
  - research/analysis/Q-20260817-01-security-significant-schema-retirement.md
---

![Forward-Compatible APIs Still Need Selective Fail-Closed Boundaries cover](research/runtime/production-work/2026/08/17/Q-20260817-01/baseline-cover.png)

# Forward-Compatible APIs Still Need Selective Fail-Closed Boundaries

Accepting unknown fields is often a practical forward-compatibility choice. A newer client can add data without forcing an older server to fail immediately. The same rule can have the opposite effect when the unknown input is a retired permission field: the request parses successfully while an authorization constraint the caller believed it supplied disappears silently.

The 2026-08-17 Research Object examined a merged Codex app-server change. Before permissive deserialization, the implementation explicitly rejects the removed `permissionProfile` field on `thread/start`, `thread/resume`, `thread/fork`, and `turn/start`, and directs the caller to named `permissions`. Unrelated unknown fields remain accepted, the new permission representation still works, and repeated obsolete-field requests do not poison the connection.

That maintainer code and regression evidence supports a narrow but important judgment: **structural forward compatibility and authorization-semantic compatibility are separate decisions.**

## One unknown-field rule can create opposite risks

Rejecting every unknown field makes a schema strict but slows harmless extension. Ignoring every unknown field preserves extension space but can erase intent that the caller believes still constrains execution. The decisive question is not whether permissive or strict decoding is universally better. It is whether ignoring this field materially changes the meaning of the request.

Silent ignore can be appropriate for low-risk presentation metadata. It is more dangerous for permission, execution-environment, or external-effect constraints. Losing one of those fields may transform “execute under the caller's declared boundary” into “execute under the server default.” The server remains syntactically compatible, yet client and server now disagree about effective authorization.

Field retirement therefore needs a semantic-risk classification. General unknown inputs can remain on the permissive path. Known retired fields whose silent loss would change authorization or execution expectations belong in an explicit exception registry.

## Targeted rejection preserves the general compatibility rule

The selected implementation does not make the whole protocol strict, and it does not turn one invalid request into a connection-level failure. It recognizes one known obsolete field before permissive decoding, rejects only that request, and identifies the supported replacement.

This boundary creates three practical benefits. First, the caller receives a visible failure instead of continuing under a false safety assumption. Second, the migration path is explicit and operators can associate failures with stale clients. Third, unrelated extensions keep their forward compatibility; the security exception does not expand into “reject every future field.”

A translation shim can still be a valid alternative when semantic equivalence between old and new representations can be demonstrated. If a field was merely renamed, a controlled bridge may be more helpful than immediate rejection. If the authorization model changed, silent translation can hide the same risk as silent deletion. Fail-closed behavior is not the default answer to retirement; it is the exception for cases where safe semantic equivalence cannot be maintained.

## A retirement registry should describe meaning, not only versions

An actionable registry should identify the methods that accepted the field, the authorization or execution expectation changed by silent loss, the supported replacement, the rejection version, the client's repair path, and telemetry that can reveal stale use without logging sensitive request content.

Resume, fork, and turn boundaries deserve separate review. Durable work may preserve old representations across time, so upgrading a client does not prove that all stored state migrated. A success response that exposes the effective policy or profile version could also help resumed work prove which representation actually governed execution. That is an architectural recommendation, not behavior established by the selected implementation.

## The evidence does not establish end-to-end authorization safety

The evidence covers one merged implementation, four methods, and their tests. It does not authenticate callers or approvers, establish policy provenance, or prove that every permission-bearing path applies the same check. Maintainer code in a public repository is public primary-source evidence, not an independent security evaluation.

A strictly versioned protocol can also avoid per-field exceptions when clients and servers move in lockstep. Silent ignore may remain correct for low-risk inputs. The supported conclusion is therefore narrower than “security fields must always be rejected”: when structural permissiveness would silently change security meaning, the retired field should be recognized separately from the general unknown-field path.

Open questions remain. What evidence is sufficient to classify a retirement as security-significant? How should migration deadlines be governed? How can failure rates be observed without exposing request content? Can resumed work verify the effective policy representation? Forward compatibility can remain open, but it should not be purchased with silent loss of authorization meaning.
