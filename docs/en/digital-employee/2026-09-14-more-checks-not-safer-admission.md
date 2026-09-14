---
title: "More Admission Checks Do Not Mean Safer Admission"
date: '2026-09-14'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "在多执行通道的智能体系统中，准入必须证明哪些与所选通道相关的事实，才能避免无关依赖成为错误门禁，同时不把技术可用性误当成业务授权？"
summary: "A provider-valid API-key lane was rejected because the host lacked a CLI needed only by another lane. Correct admission is a proof bundle bound to the selected execution lane, its verifier, and evidence freshness; business authorization remains separate."
sources:
  - research/analysis/Q-20260914-01-lane-bound-admission-proof.md
item_id: "Q-20260914-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-14-more-checks-not-safer-admission-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-14-more-checks-not-safer-admission-cover.png"
  kicker="Digital Employee · Daily Research"
  title="More Admission Checks Do Not Mean Safer Admission"
  summary="A provider-valid API-key lane was rejected because the host lacked a CLI needed only by another lane. Correct admission is a proof bundle bound to the selected execution lane, its verifier, and evidence freshness; business authorization remains separate."
  version="Q-20260914-01"
  status="Daily Runtime V5 · 2026-09-14"
  languageHref="/zh/digital-employee/2026-09-14-more-checks-not-safer-admission"
  languageLabel="中文"
/>

# More Admission Checks Do Not Mean Safer Admission

An agent is configured on a clean machine with an API key. The provider accepts the credential and live validation succeeds, yet the first-agent flow still fails because the runtime requires a local CLI probe used only by a different subscription lane.

This is not merely a missing dependency. A requirement from an unused route has become an authority gate for the selected route. **An admission check is correct only when its meaning matches the execution lane that will actually be used. More checks do not automatically create safer admission.**

## When a Valid Credential Still Cannot Enter

The same-date Research Object examines a clean-machine failure and merged correction in Paperclip. The direct API-key lane had already passed the relevant provider check, but the old flow continued into a local subscription CLI hello probe. Because the clean host did not contain that CLI, the valid route was denied.

The correction resolves connection mode first. The API-key lane re-verifies the key at the provider boundary and no longer consults the local CLI. Subscription execution retains the CLI hello requirement. Release smoke uses a narrow HTTPS provider mock that serves the expected model-list request and returns 404 for unexpected paths.

The source reports 26 of 26 environment-route tests passing, 42 of 42 connection and compatibility tests passing, and a clean TypeScript check. These results support the bounded mechanism. They are not the same fact as an end-to-end clean-machine pass in the next published canary containing the fix.

## The Lane Determines the Proof

A product may expose several execution routes, but the facts required by those routes differ.

A direct API route needs evidence about the credential, provider and endpoint. A subscription CLI route needs evidence that the host contains the binary, the local session is valid and the environment can launch it. A hybrid lane may need both remote credential truth and local capability.

Admission rules should therefore be derived from the route selected for this execution, not from the union of everything the product supports. A universal superset appears conservative, but it grants irrelevant facts the power to reject a valid route.

The opposite error matters too. Lane-specific admission must not mean weaker admission. It should remove irrelevant proofs while strengthening relevant ones. In the bounded fix, the API-key lane replaces an unrelated host probe with provider re-verification; it does not simply skip verification.

## Four Facts Cannot Be One Boolean

At least four evidence identities should remain separate:

- **credential validity** — whether a specific provider accepts the credential;
- **host capability** — whether this machine satisfies the selected lane's local requirements;
- **execution-lane identity** — which concrete route the system will use;
- **business authorization** — whether this agent may create the intended business effect now.

They answer different questions. A valid credential does not prove that a local tool can run. A capable host does not prove that a session is valid. Even when the first three facts hold, they do not authorize a customer message, production mutation or charge.

A single `admission=true` erases those distinctions. When admission fails, an auditor cannot tell which requirement applied, who verified it or when the evidence became stale.

## An Auditable Admission Proof Bundle

A stronger design makes the route selector produce a versioned proof bundle. It records:

- a stable lane identity and contract version;
- the facts required by that lane;
- the authoritative verifier for each fact;
- evidence values or digests, collection times and freshness windows;
- negative applicability—requirements that explicitly do not govern this lane;
- provider, credential, host and environment identities;
- an unambiguous binding from the admitted bundle to the route actually executed;
- separate action-time business-authorization evidence.

If execution changes lanes, the old bundle is invalid. If credentials, host capability or provider state can change, stale evidence must be re-read. Cacheability is not permanence.

The point is not more logging. It is preserving why each fact applied. That explanation makes accidental cross-lane reuse inspectable.

## Why More Checks Can Be Dangerous

Universal preflight is often framed as conservative: if the runtime asks for a superset, it cannot miss a dependency. Safety, however, comes from semantic fit rather than check count.

An unused dependency creates two risks. First, false denial prevents a legitimate worker from using a valid route. Second, false authority encourages operators to treat one host capability as proof that the entire execution path is ready, even when the credential and provider actually used were never verified.

Lane-specific contracts add configuration cost. If the requirement mapping is duplicated across call sites, drift can become worse than one conservative gate. The remedy is a canonical lane-to-requirement registry with positive, negative and route-switch tests—not scattered exceptions.

## Technical Usability Is Not Business Authority

Provider acceptance proves that a credential works at that provider boundary. A host probe proves that a runtime condition exists. Neither fact grants organizational permission for the next business action.

High-impact calls still need current authorization: task ownership, target and scope, policy state, human approval where required, and authoritative external preconditions. Technical admission asks, “Can this route work?” Business authorization asks, “May this effect occur now?”

Keeping them separate also prevents permission inheritance. A long-lived digital employee may reuse a technical environment, but it should not inherit a new destination or effect merely because yesterday's preflight passed.

## Boundaries and Open Questions

The evidence comes from one product and one clean-machine path. It does not define a universal schema for providers, enterprise federation or hybrid lanes, and it does not establish one freshness window for every fact.

The bounded rule is nevertheless clear: **admission must prove the facts the selected route actually depends on and bind those proofs to the route used. Unrelated dependencies must not own denial, and technical usability must not own business authorization.**

Open questions remain: how hybrid lanes combine remote and local proof; how a long task migrates when a lane contract changes; how the runtime attests that the admitted route was the executed route; and which actions require human approval after technical admission.

**Evidence and source:**

- [Paperclip PR #13372: lane-specific admission correction](https://github.com/paperclipai/paperclip/pull/13372), merged engineering evidence, 2026.
