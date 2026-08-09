---
schema: "publication-candidate-article/v1"
title: "Enterprise Agent Identity Planes Should Separate Rotating Assertions, Credential Leases and Propagation"
date: "2026-08-09"
column: "industry-architecture"
category: "daily"
summary: "A file-backed workload identity should not become a long-lived execution credential. A stronger identity plane rereads the authoritative assertion at exchange time, derives a short-lived token, coalesces refreshes and controls log exposure, while treating propagation into child processes and tool boundaries as a separate governance problem."
sources:
  - "research/analysis/Q-20260809-02-rotating-assertion-short-lived-credential.md"
  - "research/reading/Q-20260809-02-workload-identity-exchange.md"
item_id: "Q-20260809-02"
lifecycle: "Publication Candidate"
source_research_object: "research/analysis/Q-20260809-02-rotating-assertion-short-lived-credential.md"
source_reading_result: "research/reading/Q-20260809-02-workload-identity-exchange.md"
visualization: "staging/publication-candidates/2026-08-09-rotating-assertion-short-lived-credential.svg"
visualization_decision: "Required — assertion source, exchange authority, token lease and unproven propagation boundary diagram included"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: false
---

# Enterprise Agent Identity Planes Should Separate Rotating Assertions, Credential Leases and Propagation

One of the most dangerous simplifications in enterprise agent architecture is treating the source of identity and the credential used during execution as the same object. A file-backed JWT assertion can represent workload identity, but it should not be copied into every task, tool process or remote execution environment as a durable bearer credential.

## Central judgment

**A governed agent identity plane needs at least four distinct controls: authoritative identity source, exchange authority, short-lived execution credential and downstream propagation policy.**

Each answers a different question: who provides and rotates identity material; who may exchange it; how long the derived credential is valid; and which execution contexts are allowed to receive it. Short lifetime narrows an exposure window, but it does not prove least privilege or child-process isolation.

The sole analytical input is the `Q-20260809-02` Research Object. Production did not inspect additional call sites or perform new implementation research.

## Source

This article is based on [Research Object — Rotating Assertion to Short-Lived Runtime Credential](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260809-02-rotating-assertion-short-lived-credential.md). Its evidence trail is [Reading Result — Short-Lived Workload Identity Exchange](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260809-02-workload-identity-exchange.md).

The selected implementation provides evidence for assertion rereading, short-lived exchange, caching, proactive refresh, concurrent refresh coalescing, transient-failure fallback and token redaction. It does not prove the broader Queue hypothesis that credentials are stripped from every child-process boundary.

## Observation

The implementation reopens the assertion file for every exchange instead of reading it only at process startup. This allows the identity owner to rotate the assertion without requiring the agent process to restart.

The derived object is a short-lived ChatGPT access token. The recorded implementation boundaries include:

- assertion size and input validation;
- endpoint protocol and network-policy checks;
- a 30-second exchange timeout;
- a maximum accepted token lifetime of one hour;
- in-process caching of the current valid token;
- proactive refresh and refresh after rejection;
- coalescing many concurrent consumers behind one refresh;
- continued use of a still-valid cached token after a transient proactive-refresh failure;
- redaction of access-token values from debug output.

## Control-plane separation

| Control layer | Primary object | What it governs | What it cannot replace |
|---|---|---|---|
| Identity source | File-backed JWT assertion | External authority and rotation | Direct authorization to business APIs |
| Exchange authority | Federation rule + token endpoint | Who may derive a runtime credential | Downstream least privilege |
| Credential lease | Short-lived access token | Exposure duration and refresh | Child-process containment |
| Propagation policy | Process, MCP, hook, Git and remote boundaries | Which consumers receive credentials | Must be implemented and tested independently |

The table is a Research Center architecture synthesis based on the Research Object.

## Discussion

Rereading the assertion preserves rotation authority outside the running process. If the original assertion were cached indefinitely at startup, the external identity could rotate while the runtime continued requesting credentials from stale material. Pull-based exchange resolves “what identity is authoritative now?” at the moment a credential is actually needed.

Refresh coalescing addresses another control-plane failure mode. When many tasks notice an approaching expiry at once, independent exchanges create a request storm and inconsistent failure handling. Shared refresh state turns one exchange into the process-local renewal authority.

Continuing to use a still-valid token after a transient refresh failure is an explicit availability tradeoff. It does not assert that the old token is universally safe; it relies on the fact that the token remains inside its previously issued bounded lease. Maximum lifetime, server-side revocation and federation policy still matter.

The most important boundary is that short-lived does not mean contained. A ten-minute token indiscriminately injected into every child process, log stream, hook or remote shell remains highly exposed during those ten minutes. Propagation needs separate evidence.

## Engineering impact

An enterprise agent runtime should record the assertion source and last-read time, federation audience/subject constraints, current token issue and expiry times, refresh state and fallback use, authorized propagation scope, explicit environment stripping for child processes and diagnostic redaction status.

For CodeFlowMu, credentials should be injected at the narrowest consumer boundary rather than stored as global environment state. Any claim that child execution is isolated should be supported by concrete tests for environment construction, hooks, MCP servers, Git and remote execution.

## Boundaries and uncertainty

The available evidence does not expose the complete federation-side audience, subject and scope policy, nor every integration call site of the new exchange crate. In-process caching also means the process that owns the exchange object can still access the current bearer token.

The supported conclusion is therefore a strong rotating-assertion-to-short-lived-credential mechanism, not a fully closed enterprise credential boundary.

## Future work

Further work should test fencing after token revocation, cross-process refresh when many processes share one rotating assertion, which child processes legitimately require delegation, and whether every propagation event can produce an auditable delegation receipt.

## Visualization note

The visual separates Assertion File, Exchange Authority, Access Token Lease and Propagation Boundary. The orange dashed region explicitly marks child-process propagation controls that are not established by the selected evidence.

## Evidence and references

1. [Research Object — Rotating Assertion to Short-Lived Runtime Credential](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260809-02-rotating-assertion-short-lived-credential.md): sole analytical input.
2. [Reading Result — Short-Lived Workload Identity Exchange](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260809-02-workload-identity-exchange.md): traceability for implementation facts, limitations and open questions.

> Editing status: the bilingual pair preserves the distinction between identity source, exchange, credential lease and propagation boundary. Not yet published.
