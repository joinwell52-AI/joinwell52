---
date: "2026-09-14"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260914-01
column: digital-employee
article_type: engineering-insight
project_relevance: none
source_reading: "research/reading/Q-20260914-01-execution-lane-specific-admission-evidence.md"
---

# Research Analysis — Admission Proof Must Follow the Execution Lane

## Research question

Which credential, provider and host facts must be proven before a governed Agent enters a selected execution lane, and how can the admission record avoid turning requirements from an unused lane into accidental authority gates?

## Research themes and subject kind

- Research themes: lane-specific admission; credential validity; host capability; business authorization; evidence freshness; typed proof bundles.
- Subject kinds: `governance-problem`, `failure-mode`, `architecture-mechanism`, `protocol-mechanism`.
- Primary sample: Paperclip PR #13372 clean-machine onboarding failure and merged correction.

The research subject is not one onboarding patch. It is the separation between **facts needed to make a technical route usable** and **authority to perform a business action through that route**.

## Evidence identities

### E1 — source-reported failure

**Identity:** `source-reported-claim`.

**Claim:** A provider-valid API key passed live validation but the first-agent path still failed because an unrelated local subscription CLI hello probe was applied to the direct API-key lane.

**Source:** same-date source-complete Reading Note based on merged Paperclip PR #13372.

**Strength:** direct engineering evidence for one clean-machine path. **Independent:** false.

### E2 — source-reported mechanism

**Identity:** `source-reported-claim`.

**Claim:** The merged correction resolves connection mode first, re-verifies an API key at the provider boundary for the API-key lane, and retains the local CLI hello requirement only for subscription execution.

**Strength:** direct mechanism evidence in the changed path. **Independent:** false.

### E3 — reproducible engineering evidence

**Identity:** `source-reported-claim`.

**Claim:** The PR reports 26/26 passing environment-route tests, 42/42 passing AI-connection and compatibility tests, a clean TypeScript check, and a narrow HTTPS provider mock for the API-key release path.

**Strength:** strong bounded verification of the modified contract; the next canary remains the stronger end-to-end release proof. **Independent:** false.

### E4 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** Admission should be represented as a typed proof bundle derived from the resolved execution lane. Each proof must identify the requirement it satisfies, its freshness boundary and its authoritative verifier.

**Strength:** architectural inference supported by E1–E3; not directly standardized by the sample. **Independent:** false.

### E5 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** Credential validity, host capability, lane selection and business authorization are separate evidence identities. Passing the first three cannot create the fourth.

**Strength:** bounded governance judgment; the source directly supports the distinction between lane and capability, while the business-authorization boundary is an explicit safety inference. **Independent:** false.

### E6 — open question

**Identity:** `open-question`.

**Claim:** The evidence does not establish a universal schema for hybrid lanes, multiple providers, enterprise federation, changing host capabilities or long-lived credential freshness.

## Failure / Finding / Mechanism / Implication

### Failures

1. **Universal-probe false denial:** a requirement belonging to one execution lane blocks a different valid lane.
2. **Universal-pass false admission:** one successful credential check is treated as evidence for every possible route.
3. **Lane drift:** the system verifies facts for one lane, then executes through another.
4. **Freshness collapse:** evidence gathered during setup is reused after credential, provider or host state changes.
5. **Technical-admission escalation:** route usability is mistaken for authorization to create an external business effect.
6. **Opaque denial:** the audit record says only `admission=false`, hiding which requirement applied and which proof failed.

### Findings

The source supports a narrow but important conclusion: admission correctness depends on matching proof obligations to the actual execution route. A preflight is not safer merely because it checks more things. Extra checks can become incorrect when their facts are irrelevant to the selected lane.

The inverse also holds. Removing a universal probe must not weaken requirements that truly govern the chosen route. The sample fix preserves this symmetry: it drops the CLI requirement for direct API-key execution while re-verifying the key at the provider boundary, and it keeps the CLI hello contract for subscription execution.

This yields four separate facts:

- **credential valid for provider and route**;
- **host capable of running that route**;
- **execution lane resolved and unchanged**;
- **business operation currently authorized**.

A single boolean cannot preserve these distinctions or explain a denial.

### Mechanism

A governed runtime can materialize a versioned **lane admission contract**:

- stable lane identifier and contract version;
- list of required facts for that lane;
- verifier for each fact;
- evidence value or digest;
- collection time and freshness window;
- negative requirements that explicitly do not apply;
- resolved provider, credential and host identities;
- immutable binding from the admitted bundle to the actual execution route;
- separate business-authorization evidence evaluated at action time.

The admission decision is valid only if every required fact for the resolved lane passes and no fact from another lane is silently promoted into the gate. If execution changes lanes, admission must be recomputed.

### Implication

For governed digital employees, a route selector should produce both a selected lane and the proof schema required by that lane. The audit trail should answer “why was this fact required?” and “which authority verified it?” rather than merely recording PASS or FAIL.

Call-time authorization remains separate. Provider acceptance proves that a credential works at a provider boundary; it does not prove organizational permission to send a customer message, spend money or mutate production data.

## Comparison and contradictions

A universal host preflight appears conservative because it demands a superset of capabilities. The clean-machine failure contradicts that intuition: the superset can be semantically wrong when the selected route does not depend on those capabilities.

A route-specific check can also appear weaker. The sample shows the necessary correction: route specificity must narrow irrelevant requirements while strengthening the relevant proof. The API-key lane replaces an unrelated CLI probe with provider re-verification; it does not simply skip verification.

The next published canary is still needed to establish end-to-end release behavior. Passing tests and merged code support the mechanism but do not prove every production environment or provider mode.

## Bounded research judgment

**Agent admission should be a lane-bound proof bundle, not a universal checklist. The runtime must derive required evidence from the selected execution lane, bind the verified bundle to the route actually used, and evaluate business authorization as a separate current fact.**

This judgment is strongest for systems with multiple credential or execution modes. It does not claim that every provider can share one schema or that setup-time evidence remains fresh indefinitely.

## General implications

- version each execution lane's proof requirements;
- bind evidence to provider, credential, host, lane and freshness window;
- recompute admission when the chosen lane changes;
- keep negative applicability explicit so unused dependencies cannot become accidental gates;
- preserve provider checks for remote routes and host checks for local routes;
- distinguish technical usability from business authorization;
- expose the failed requirement and verifier in durable audit evidence;
- apply risk-scaled call-time revalidation to mutable facts.

## Limitations and counterarguments

The evidence is one product's merged fix and bounded test suite. It does not establish quantitative failure rates across providers or enterprises. A universal preflight may still be appropriate when all supported lanes genuinely share the same requirements, but that equivalence must be proved rather than assumed.

Route-specific contracts add configuration and testing cost. That cost is justified only if the system preserves a single canonical mapping from lane to requirements; duplicated ad hoc checks could create more drift than one conservative gate.

## Open questions

1. Which admission facts can be cached, and which require call-time revalidation?
2. How should hybrid lanes combine remote credential and local host proofs?
3. What migration rule applies when a lane contract version changes during a long-running task?
4. How should the runtime attest that the executed lane matches the admitted lane?
5. Which business actions require independent human approval after technical admission?
6. What evidence best detects accidental cross-lane requirement reuse?

## Editorial recommendation

- **Article type:** engineering-insight
- **Selected modules:** research-question; clean-machine-failure; four-evidence-identities; lane-bound-proof-bundle; comparison; authorization-boundary; limitations; open-questions
- **Core proposition:** checking more dependencies is not safer when the checks do not belong to the selected route
- **Project relevance:** none
