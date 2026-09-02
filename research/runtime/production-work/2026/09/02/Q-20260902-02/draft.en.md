---
schema: publication-candidate-article/v2
title: "Installed Is Not Authorized"
date: '2026-09-02'
column: industry-architecture
category: daily
article_type: comparative-study
edition: research-center
research_question: "Which authority identities and decisions must be bound before an enterprise-agent connector call may execute?"
summary: "OpenAI Epic documentation, Microsoft Entra Agent ID documentation, and a pinned Codex implementation expose one governance failure: an Installed or Enabled state cannot prove who is acting, what the target permits, whether policy allows this occurrence, or what effect the provider accepted."
cover: staging/publication-candidates/2026-09-02-installed-is-not-authorized-cover.png
sources:
  - research/analysis/Q-20260902-02-connector-layered-authority.md
---

![Installed Is Not Authorized cover](staging/publication-candidates/2026-09-02-installed-is-not-authorized-cover.png)

# Installed Is Not Authorized

An enterprise agent sees a connector marked **Enabled**. The application was approved months ago, the selected account changed yesterday, and the target resource revoked access this morning. Treating the visible flag as execution authority compresses several changing facts into one stale answer.

Installation says a capability may be offered. It does not establish who is acting, which linked account is selected, what the provider permits, whether runtime policy allows this occurrence, or what the provider actually changed.

Three first-party samples expose different parts of that distinction. OpenAI's Epic documentation separates organizational availability and configuration from each clinician's sign-in, approved scopes, and existing patient-chart permissions. Microsoft documents connector permissions on an Entra Agent ID together with runtime revalidation through connector policies and data-loss-prevention controls. A pinned Codex implementation passes selected account-link identity and tool information into application-tool policy evaluation.

They are not one protocol. Their comparative value is narrower: **connector authority is layered, and an Installed or Enabled flag cannot substitute for call-time authorization.**

## Availability and Authority Answer Different Questions

Administrative availability asks whether an organization offers a connector. Configured capability asks which tools or scopes an agent can attempt to invoke. Both are prerequisites; neither identifies the acting principal for a call.

OpenAI's Epic documentation makes the boundary concrete. Workspace and application setup do not expand a clinician's existing chart permissions. The user still signs in, approved scopes remain bounded, and the target system retains its own rules. A connector can be installed while a particular person lacks authority over a particular record.

Microsoft's model reveals another separation. Connector API permissions may be configured on a durable agent identity, while the connector runtime, Advanced Connector Policies, and DLP controls re-evaluate the path at run time. Durable configuration describes capability; current policy decides whether this occurrence may proceed.

## The Account Link Is Part of the Claim

A connector name is not an acting identity. One connector may expose several linked accounts, tenants, or authentication contexts. Remembering that “the user approved the connector” is too coarse if the selected account can change.

The cited Codex revision carries selected account-link identity, tool identity, and annotations into application-tool policy evaluation. That proves a property of one revision, not a universal architecture. It nevertheless illustrates the right question: authorization belongs to a specific tool call under a selected relationship, not to the connector label.

Remembered approval should therefore bind the connector, tool, account link, target scope, and occurrence conditions. Switching accounts, changing tools, widening the target, or revoking permission should invalidate the affected relationship without rewriting the historical installation fact.

## Six Layers Form a Bounded Authority Chain

A governed call needs at least six separately inspectable propositions.

First, administrative availability: is the connector offered here? Second, configured capability: is this tool or scope allowed in the agent configuration? Third, acting principal or account link: which identity will the provider see? Fourth, target-resource permission: may that identity act on this object now? Fifth, runtime policy: does this occurrence satisfy organizational and task rules? Sixth, provider effect evidence: what did the external system accept or change?

The first two describe available capability. The next three determine whether this attempt is authorized now. The last records outcome. None safely implies another.

The split clarifies ownership. Administrators govern availability. Agent configuration governs exposed capability. Identity systems establish the actor. Providers own target permissions. Runtime policy evaluates current conditions. Provider receipts or reconciled state establish effects.

## Authorization Is Not an Effect Receipt

A pre-call decision can authorize an attempt without proving that the provider accepted it. A success-looking response may be lost, retried, or ambiguously mapped to an external change. Conversely, a provider rejection does not prove the local policy decision was wrong.

For consequential actions, retain the admission decision and external effect record as different evidence. If a response is lost, reconcile provider state or use an idempotency mechanism where supported. Replaying solely because the local log lacks success can duplicate an already-applied effect.

The cited sources do not establish exactly-once behavior, immutable audit history, or a shared receipt format. Those remain design requirements, not source-backed claims.

## One Indicator Can Still Exist

Operators need concise interfaces. An Enabled badge can remain useful if it summarizes availability rather than unrestricted execution authority.

The danger appears when the system discards the layers. A reliable runtime can show one indicator while retaining each fact, its freshness, and its owner. When a required layer is missing or stale, admission should fail closed and explain which proposition could not be established.

Revocation then becomes precise. Target-permission revocation invalidates target authority. An account switch invalidates the actor binding. A policy change invalidates the occurrence decision. None changes whether the connector was historically installed.

## The Comparison Has Strict Limits

These samples use different architectures, terminology, and enforcement points. Official documentation states intended behavior; it is not independent reproduction. The source-code sample proves only what a pinned revision carries into one policy decision.

The evidence does not prove a universal connector-authorization protocol, credential isolation, exactly-once effects, or uniform revocation semantics. It supports a bounded conclusion: administrative enablement, configured capability, actor identity, target authority, runtime policy, and provider effect must remain distinct claims.

Open questions remain: what portable receipt can bind the layers without exposing credentials; how should a runtime represent provider permissions it can query but not control; which changes require explicit reapproval; and how should it reconcile an effect when the response disappears?

**Sources:** [OpenAI Epic plugin documentation](https://help.openai.com/articles/20001490-using-the-epic-plugin-with-chatgpt-and-codex), [OpenAI healthcare integrations](https://openai.com/index/chatgpt-connects-health-records-and-healthcare-sources/), [Microsoft Entra Agent ID connector documentation](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-use-entra-agent-identities), and [Codex source at the cited revision](https://github.com/openai/codex/blob/eb10d91e48ccbd0930427461fb392337addb1ac0/codex-rs/core/src/mcp_tool_call.rs)
