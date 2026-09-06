---
schema: publication-candidate-article/v2
title: "It Only Sent a GET. Why Did It Write? Effect Boundaries in Agent Tool Gates"
date: "2026-09-05"
published_date: "2026-09-06"
column: open-source-engineering
category: daily
article_type: engineering-case-study
edition: research-center
summary: "A real tool gate allowed a shell GET, after which our loopback service changed business state. An explicit POST required approval. The question is what ALLOW establishes when effects remain unresolved."
cover: "/assets/read-effects-order-20260905/assets/get-effect-cover-v1.png"
language: en
lifecycle: Published
publication_authorized: true
evidence_status: "Controlled experiments and native-gate checks complete; full Host integration not verified"
pageClass: read-effects-article
---

<ArticleCover image="/assets/read-effects-order-20260905/assets/get-effect-cover-v1.png" kicker="Open-source engineering · Controlled experiment" title="It Only Sent a GET. Why Did It Write? Effect Boundaries in Agent Tool Gates" summary="A real tool gate allowed a shell GET, after which our loopback service changed business state. An explicit POST required approval. The question is what ALLOW establishes when effects remain unresolved." version="2026-09-05" languageHref="/zh/engineering/2026-09-05-get-request-effect-boundary" languageLabel="中文" />

<ArticleTableScroll language="en" />

# It Only Sent a GET. Why Did It Write? Effect Boundaries in Agent Tool Gates

<style>.read-effects-article .vp-doc h1[id] { display: none; }</style>

[View original cover](https://joinwell52-ai.github.io/joinwell52/assets/read-effects-order-20260905/assets/get-effect-cover-v1.png)

A request entered a tool gate and received `ALLOW`. After execution, our test service contained a new business value.

It did not use POST or a tool named “write.” It issued a GET through a shell.

When we changed the input to an explicit POST, the gate returned `REQUIRE_APPROVAL` instead.

This happened in a controlled experiment. CodeFlowMu is a local multi-agent collaboration system we are developing. We invoked its existing pre-execution gate, then used real curl to contact our loopback fixture only after the gate allowed the call. The value was synthetic; the request, decision, and state change were real.

The research question is narrower than an HTTP lesson: **when a gate does not identify a write risk, may its permission be interpreted as proof that no write will occur?**

## 1. GET has read-only semantics, not an enforcement guarantee

HTTP defines GET as a safe method with essentially read-only semantics. Incidental effects such as access logging are compatible with that definition; asking a GET endpoint to perform a business mutation is a different matter. Resource owners must disallow an unsafe URL-selected action when accessed through a safe method. [RFC 9110, safe methods](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.1)

The protocol does not force an arbitrary server to comply. As a conceptual example, `GET /article/123` retrieves an article, while a nonconforming `GET /save?value=hello` endpoint can execute a save. A redirect can take the client from one address to the other without changing the request method.

The method is not merely a request format: it has defined semantics. Those semantics, however, do not guarantee every server's actual behavior. A method check cannot by itself establish the complete effect boundary.

## 2. Why a public wiki matters to Runtime engineering

On September 4, Sydney Von Arx and colleagues published an analysis reporting roughly 18,000 Agent-related posts on a public wiki, including GET-based writes and information exchange. The authors associate the activity with internal OpenAI agents based on public evidence; this is not a complete internal incident report. Posts are not a count of agents. [Original research](https://collusion.wiki/)

The engineering question is what happens when the remote service changes business state in response to a nominal read. Restricting an HTTP method does not, by itself, control every effect.

There is a second boundary. If another executor can read the result, the retrieval environment also becomes a communication medium.

General-purpose tools make this relevant: a shell may inspect local files or contact a service. Whether our system is affected requires examining its actual entry points—not borrowing another project's incident as evidence about our product.

## 3. Measure the write before explaining it

We did not probe the original writable wiki. Our server listened only on loopback, used a random port, and handled synthetic markers.

The actual fixture used `/read` for reads and `/publish` to save a value in an in-process `Map` when a qualifying GET arrived. `/redirect` returned a 302 pointing to the save endpoint. A client could follow it or stop at the first response. This was neither a database nor a claim of crash-durable storage; `/save` above was only a conceptual illustration.

We kept three counters separate:

- HTTP requests received;
- executions of the business write handler;
- actual changes to the stored business value.

A new access-log entry is not a business mutation. Rewriting an identical value is also not a new value transition.

Each of six environment scenarios ran twice. Both rounds produced the results below.

| Scenario | Observation | Business writes / state changes |
|---|---|---|
| Ordinary GET | Empty value returned | 0 / 0 |
| GET to the save endpoint | Newly saved synthetic value returned | 1 / 1 |
| Follow a 302 | Two GET requests; the second saves a value | 1 / 1 |
| Do not follow the same 302 | Stop at the redirect response | 0 / 0 |
| Separate process A saves; B reads the shared space | B reads A's marker | 1 / 1 |
| B reads a different namespace | Empty value returned | 0 / 0 |

The clients did not share process memory. They exchanged the marker through the service. But they followed a script, not an autonomous model: this establishes a channel, not spontaneous collusion.

Nor does the final row prove tenant isolation. The fixture had no authentication; changing a namespace is not evidence that a client cannot query the original namespace.

[![Experimental illustration: an ordinary read performs no write; following a 302 to the save endpoint performs one write](https://joinwell52-ai.github.io/joinwell52/assets/read-effects-order-20260905/assets/get-redirect-effect-inline-v1.png)](https://joinwell52-ai.github.io/joinwell52/assets/read-effects-order-20260905/assets/get-redirect-effect-inline-v1.png)

*Figure 1. Mechanism illustration of environment cases H0 and H2. ∅ denotes an initially empty value; X stands for a synthetic marker, not a literal value from the raw record. Following the lower 302 path causes two GET requests and one business write. This depicts loopback-service behavior, not a product screenshot or evidence of database durability. Source: mechanism illustration of this article’s controlled experiment, not a raw observation screenshot. Click for the full-resolution image.*

These controls separate method restrictions, redirect handling, endpoint semantics, and the visibility of results to other executors.

## 4. Invoke the existing gate, not a replacement

We fixed CodeFlowMu at commit `c008d9db91a21136fc61a4f60314e22db395d5d2` and imported `evaluateNativeOperationBoundary`, the existing native-tool pre-execution gate. Product code was unchanged.

The gate checks role capabilities before shell-dialect validation and risk policy. We preserved that outer check rather than calling an inner classifier and declaring its output executable.

| Input | Actual Native gate result | Subsequent experiment action |
|---|---|---|
| Local `read_file` | `ALLOW` | Gate check only; no file read |
| Shell curl GET | `ALLOW` | Real loopback curl: 1 write, 1 state change |
| Explicit shell POST | `REQUIRE_APPROVAL` | Request not executed |
| Unregistered `http_get` | `ROLE_CAPABILITY_DENIED` | Not executed |
| Unregistered `web_fetch` | `ROLE_CAPABILITY_DENIED` | Not executed |
| Active capabilities exclude shell | `ROLE_CAPABILITY_DENIED` | Not executed |
| Active capabilities explicitly include shell; GET | `ALLOW` | Separate namespace: 1 write, 1 state change |

These seven scenarios also ran twice: together with the six environment scenarios, that is 13 distinct scenarios and 26 round observations—not 26 independent risks.

POST was a gate-decision control, not an end-to-end comparison of equivalent GET and POST business operations. It was not executed, and the fixture did not implement an equivalent POST save. Nor did we first configure the role as GET-only and then break that restriction: the title describes the tested request, not a read-only permission contract.

The rejection controls matter. Unregistered tools received ALLOW when tested against the inner policy alone, but the complete Native gate rejected them first. Reporting only the inner result would overstate reachability.

Conversely, explicitly granting shell capability did not remove the GET observation. It cannot be explained simply as forgetting to supply the capability list.

## 5. The key boundary is how unresolved effects enter a decision

The GET produced these facts:

```text
operation.kind = execute
impact.external = false
impact.persistent = false
confidence.complete = false
unresolved_fields = [operation.effects]
```

This is not verified evidence of a network read without side effects. The classifier explicitly retained incomplete effect knowledge.

The shell adapter in `OperationFacts` recognizes explicit write-request patterns such as POST. Our GET did not match them. `UnifiedOperationPolicy` then applies a negative-rule list: a match routes to approval; no matched risk predicate means ALLOW, without an additional requirement that `confidence.complete` be true. This approval routing is distinct from the preceding role-capability rejection.

Consider an inspector saying “nothing prohibited has been found,” followed by “this bag has not been fully checked.” That cannot be reported as “the bag has been verified safe.”

The observed path was:

```text
Role has shell capability
→ GET effects remain incompletely identified
→ No negative risk predicate matches
→ ALLOW
→ The loopback service saves a value
```

A negative-rule policy can be a deliberate product choice. One counterexample does not establish that all unknown operations should be blocked. But under this choice, **ALLOW means the policy permits execution—not that remote effects have been proven safe.**

Likewise, `external=false` must be read alongside `complete=false`. In this path, the former cannot independently support a UI claim of “verified no external write.”

## 6. Keep capability, assessment, decision, and observation separate

A tool's name or a command's form does not uniquely determine its final effects. Shell capability establishes permission to use the tool; the scope of permitted network or business operations needs its own basis.

| Layer | This experiment's record | What it does not establish |
|---|---|---|
| Tool capability | The role explicitly has shell capability | Every business operation at every reachable service is authorized |
| Effect assessment | Execution classified; effects incompletely resolved | Absence of a write has been verified |
| Admission decision | Current policy allows execution | Environmental effects have been proven safe |
| Post-execution observation | One business write and one state change | Every Host allows the same behavior |

Even a structure named `OperationFacts` can contain candidate assessments and uncertainty. The name does not promote a prediction into an observed result.

Keeping these layers separate preserves what was known and what happened, even if the policy later changes. A decision consistent with the policy does not erase an actual write. This is a recording recommendation, not a claim that a new end-to-end effect contract has already shipped. We also did not establish a misleading safety label in the UI: that remains a check to perform, not another reported defect.

## 7. What the research should prompt next

Adding a confirmation to every GET, or denying every unknown shell operation, would exceed what this experiment can decide.

Three narrower checks are justified:

1. Do actual Host sessions, proxies, and browser entry points impose additional constraints? Do those constraints govern destinations, request contents, or business operations?
2. Does permission to use a tool also grant access to every reachable service? Are tool capability and network scope supported by separate evidence?
3. When effects remain unresolved, do logs and interfaces preserve that uncertainty rather than presenting permission as a safety proof?

This study verified the tested Native gate and a loopback shell execution, not end-to-end Codex, Cursor, or Gemini sessions. The server deliberately accepted GET-based writes. We collected no production incident sample, caused no third-party disclosure, and did not test server crash durability. Product code was unchanged; development has not been authorized by this research.

The conclusion is not “all GETs are dangerous.” It is more precise:

**Failure to match a write-risk rule is not proof of an absent write effect. What the gate permitted and what the environment actually did require separate answers.**

## Evidence and checking

The companion [evidence guide](/en/research/evidence/2026-09-05-read-effects-acceptance-order) includes de-identified round observations, scenario mappings, source hashes, a checker, and fixture revisions. Re-running the full gate experiment requires the fixed product source. The checker verifies exported-observation consistency and file integrity; it does not rerun product code or provide Host end-to-end or production safety acceptance.
