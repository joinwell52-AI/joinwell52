# Q-20260914-01 — Admission Evidence Must Follow the Execution Lane

- Runtime date: 2026-09-14 (Asia/Shanghai)
- Queue signal: SIG-20260914-004
- Primary engineering source: https://github.com/paperclipai/paperclip/pull/13372
- Evidence level: `merged_maintainer_change`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

Which credential, provider and host facts must be proven before an Agent enters a selected execution lane, and which unrelated dependencies must not become accidental admission gates?

## Primary Mechanism

Paperclip PR #13372 documents a clean-machine onboarding failure in which a provider-accepted API key could be saved and live-validated, yet the first-agent flow still failed because the managed environment test imposed a local `claude` CLI hello probe. That probe belonged to the subscription/CLI lane, not the direct API-key lane. On a clean machine without the CLI, admission therefore rejected a route whose own credential had already passed the relevant provider check.

The merged correction makes the admission proof conditional on the resolved connection mode. For `api_key`, adoption re-verifies the key against the provider endpoint and does not consult the local CLI hello probe. For subscription execution, the local CLI hello requirement remains. The release smoke also moves the API-key path onto a narrow HTTPS provider mock so the gate can exercise the relevant remote-verification contract without requiring a paid production credential.

## Verification Evidence

The PR reports 26/26 passing environment-route tests, 42/42 passing AI-connection/legacy-compatibility tests and a clean TypeScript check. It also records a deliberately bounded end-to-end state: the exact failing published canary still stops at the old forced CLI probe, so the next canary containing the merged fix is the true clean-machine end-to-end proof. This distinction matters because merged code plus unit/integration tests are strong mechanism evidence, but they are not the same fact as successful release behavior in the next published artifact.

The provider mock is intentionally narrow: it serves only the expected model-list request and returns 404 for unexpected paths. That makes the release test useful as a contract probe rather than a broad imitation of the provider.

## The Admission Boundary

The evidence supports four separate identities that should not be collapsed:

1. **Credential validity** — whether the provider accepts the credential used by this lane.
2. **Host capability** — whether the local host has the binary, environment or runtime feature required by this lane.
3. **Execution-lane selection** — which concrete path the worker will actually use.
4. **Business authorization** — whether this worker may perform the intended business action after technical admission.

A universal probe is dangerous because it can turn a capability required by one lane into a false authority gate for another. The inverse is also dangerous: removing a universal probe must not become permission to skip the facts that the chosen lane genuinely requires. The Paperclip fix preserves that symmetry by dropping the CLI requirement only for API-key execution while retaining provider re-verification.

## Failure Case

Suppose a digital employee can execute either through a local subscription CLI or directly through a provider API. A single preflight that always requires the CLI will reject a valid API route on machines where the CLI is intentionally absent. A single preflight that checks only the API key would make the opposite mistake for the subscription route by failing to prove the local session it depends on.

The admission contract therefore needs to be keyed to the resolved lane, not to the product as a whole.

## Evidence Classes

### Fact

The documented release smoke failed because the API-key route inherited a CLI probe that was irrelevant to that route; the merged change separates the API-key and subscription checks and re-verifies API keys at the provider boundary.

### Engineering Result

The touched route and connection tests pass as reported in the merged PR, and the release harness contains a narrow provider mock designed to exercise the API-key path deterministically.

### Inference

A production Agent runtime should materialize admission as a typed proof bundle whose required facts are derived from the selected execution lane. The bundle should preserve which fact proved which requirement instead of reducing admission to one undifferentiated PASS.

### Unknown

The source does not establish that every provider, hybrid lane or enterprise credential model can be represented by the same two-way split. It also does not establish that a technically admitted worker is authorized for a particular business effect.

## Limits and Negative Evidence

- The evidence comes from one product and one bounded onboarding/release path.
- The next canary containing the fix remains the stronger end-to-end release proof than the merged source alone.
- Provider acceptance proves credential usability at that provider boundary, not organizational permission.
- Host capability can change after admission; long-lived workers may need call-time revalidation for facts whose freshness matters.
- A mock can prove expected integration semantics, but not provider availability, billing state, rate limits or every production response mode.

## Unresolved Questions

1. Should every lane expose a versioned list of required facts and their freshness windows?
2. Which facts may be cached across sessions, and which must be re-read at adoption or call time?
3. How should a hybrid lane prove both remote credential validity and local host capability without recreating a universal probe?
4. What durable evidence should explain why an admission requirement applied to one lane but not another?
5. How should a runtime distinguish technical admission from business authorization in the same audit trail?

## Reading Conclusion

The source-complete evidence supports a bounded conclusion: **Agent admission should prove the facts required by the selected execution lane, not a universal superset of host dependencies**. Route-specific admission avoids false denial without weakening the proof obligations that actually govern that route. Credential validity, host capability, lane selection and business authorization should remain separate evidence identities.

This Reading Note performs evidence extraction only. It does not execute Research Analysis, article writing, visualization, Production or Publication.
