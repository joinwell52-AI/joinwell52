---
date: "2026-09-02"
status: ReadyForProduction
production_input_authorized: true
queue_item: Q-20260902-02
column: industry-architecture
article_type: comparative-study
project_relevance: none
source_reading: "research/reading/Q-20260902-02-connector-layered-authority.md"
---

# Research Analysis — Installed Is Not Authorized: A Layered Connector-Authority Model

## Research question

Which authority identities and decisions must be bound before an enterprise-agent connector call may execute, and why can neither installation nor an Enabled flag stand in for call-time authorization?

## Research themes and subject kind

- **Themes:** connector governance; principal identity; call-time authorization; external-effect evidence
- **Subject kinds:** cross-sample-comparison; architecture-mechanism; governance-problem
- **Samples:** OpenAI Epic integration documentation; Microsoft Copilot Studio / Entra Agent ID documentation; OpenAI Codex Apps/MCP implementation evidence

## Research value

### Failure

An Installed or Enabled state answers only whether a connector is administratively available. It does not establish which principal is acting, which linked account is selected, what the external resource permits, whether current runtime policy allows this occurrence, or what effect the provider accepted. Treating one flag as all six facts creates an authority-compression failure.

### Findings

The OpenAI Epic documentation separates organizational/plugin availability, organization-specific application configuration, the clinician's own sign-in, approved scopes, and existing patient-chart permissions. Microsoft's Entra Agent ID documentation represents configured connector capability on a durable agent identity while describing runtime revalidation through connector policy and DLP controls. The cited Codex implementation carries selected account-link identity and tool information into application-tool policy evaluation.

These samples are not one protocol. Their value is comparative: each exposes a different place where administrative configuration, principal identity, target authority, and runtime decision must remain distinct.

### Mechanism

A bounded connector-call authority chain contains at least:

1. administrative availability;
2. configured agent/tool capability;
3. acting principal or selected account-link identity;
4. target-resource permission at the external provider;
5. current runtime policy decision for this occurrence;
6. provider response or effect evidence.

The first two describe what may be offered to the agent. The next three determine whether this call is authorized now. The sixth records what actually happened. None can be inferred safely from another.

### Implication

An enterprise agent runtime should preserve these propositions as separately inspectable evidence and bind remembered approval to the relevant connector, tool, account link, target scope, and occurrence conditions. Revocation or account switching must invalidate the affected authority relationship without pretending that administrative installation changed.

## Evidence claims

### E1 — public-fact

**Claim:** OpenAI's Epic documentation distinguishes plugin/app availability and setup from each user's Epic sign-in, approved scopes, and pre-existing patient-record permissions; it states that the integration does not expand those existing permissions.

**Source:** OpenAI official Epic plugin and healthcare integration documentation cited by the Reading Note.

**Strength:** states.

**Independent:** false. These are official product statements, not independent tests.

### E2 — public-fact

**Claim:** Microsoft documents configured connector API permissions on an Entra Agent ID and runtime revalidation through the Power Platform connector runtime, Advanced Connector Policies, and DLP, while noting channel-specific Conditional Access limitations.

**Source:** Microsoft Learn documentation cited by the Reading Note.

**Strength:** states.

**Independent:** false.

### E3 — public-fact

**Claim:** The cited Codex implementation revision includes selected connector/account-link identity, tool identity, and annotations in application-tool policy evaluation.

**Source:** OpenAI Codex source at commit eb10d91e48ccbd0930427461fb392337addb1ac0.

**Strength:** states.

**Independent:** false. Public source code is direct implementation evidence for that revision, not independent validation.

### E4 — our-interpretation

**Claim:** Administrative enablement, configured capability, principal/account identity, target-resource authority, runtime policy, and external effect are separate governance propositions that should not be collapsed into a connector-enabled boolean.

**Source:** cross-sample analysis of E1–E3.

**Strength:** supports.

**Independent:** false.

## Cross-sample comparison

| Layer | OpenAI Epic sample | Microsoft Entra Agent ID sample | Codex Apps/MCP sample |
|---|---|---|---|
| Administrative availability | Workspace/plugin setup | Published agent and configured connector | Available connector/tool |
| Agent capability | Approved integration behavior/scopes | Connector API permissions on agent identity | Tool identity and annotations |
| Acting principal/account | Clinician's own Epic sign-in | Agent identity and connector authentication context | Selected account `link_id` |
| Target-resource authority | Existing patient-chart permissions | External resource permission remains distinct | Provider-side authority not proven by local policy |
| Runtime policy | Documented permission boundary | Connector runtime, Advanced Connector Policies, DLP | Application-tool policy evaluation |
| Effect evidence | Provider result boundary remains separate | Provider/runtime outcome remains separate | Tool-call result remains separate |

The cells show evidence available in each sample; blanks or partial descriptions must not be read as proof that the other layers do not exist.

## Contradictions and counterarguments

A single Enabled indicator is operationally convenient for user interfaces. It may be a useful summary, but only if the underlying system retains the layered facts and refuses execution when a required layer is absent or stale. Convenience at presentation time does not justify compression at the authorization boundary.

The three sources use different architectures and terminology. They do not prove a universal end-to-end connector-authorization protocol, exactly-once effects, immutable audit history, complete credential isolation, or uniform revocation behavior.

## Bounded research judgment

Connector installation is capability availability, not execution authority. A governed enterprise agent call should be admitted only after binding current administrative availability, configured capability, acting account/principal, target-resource permission, runtime policy, and—where effects matter—provider effect evidence. The exact implementation varies, but the separation of propositions is the stable architectural conclusion supported by these samples.

## General implications

- Permission UIs may summarize state, but audit records should retain the underlying authority layers.
- Remembered approvals should be scoped to account-link and tool identity, not connector name alone.
- Call-time policy should re-evaluate revocation, account changes, target scope, and occurrence conditions.
- Success responses and effect receipts should remain separate from pre-call authorization.
- Cross-connector abstractions should expose missing layers rather than claim universal equivalence.

## Limitations

The evidence describes specific documented products and one source-code revision. It does not independently reproduce provider behavior or prove complete end-to-end authorization. External policies may change after documentation or installation, reinforcing the need for bounded, current evidence.

## Open questions

- What is the smallest portable receipt that can bind all relevant authority layers without leaking credentials?
- How should a runtime represent provider permissions it can query but does not control?
- Which changes require explicit reapproval rather than silent call-time revalidation?
- How should effect evidence be reconciled when a connector response is lost?

## Editorial recommendation

- **Article type:** comparative-study
- **Selected modules:** research-question; evidence; comparison; architecture-implications; counterarguments; limitations; open-questions
- **Ending module:** open-questions
- **Project relevance:** none
