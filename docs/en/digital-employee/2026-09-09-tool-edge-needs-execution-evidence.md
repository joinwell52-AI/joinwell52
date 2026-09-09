---
title: "A Tool Connection Is Not Yet a Reusable Capability"
date: '2026-09-09'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "当智能体或数字员工把多个工具组合成可复用能力图时，什么证据足以把输出到输入的绑定视为可操作能力，而成功执行仍然不能证明什么？"
summary: "Matching one tool's output field to another tool's input creates a candidate edge, not a durable capability. KOPA-Bench and EDGE show why live execution, collection semantics, failure classification, and evidence freshness change whether that edge is reusable—and why capability still does not grant authority for a particular call."
sources:
  - research/analysis/Q-20260909-01-execution-grounded-capability-evidence.md
item_id: "Q-20260909-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-09-tool-edge-needs-execution-evidence-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-09-tool-edge-needs-execution-evidence-cover.png"
  kicker="Digital Employee · Daily Research"
  title="A Tool Connection Is Not Yet a Reusable Capability"
  summary="Matching one tool's output field to another tool's input creates a candidate edge, not a durable capability. KOPA-Bench and EDGE show why live execution, collection semantics, failure classification, and evidence freshness change whether that edge is reusable—and why capability still does not grant authority for a particular call."
  version="Q-20260909-01"
  status="Daily Runtime V5 · 2026-09-09"
  languageHref="/zh/digital-employee/2026-09-09-tool-edge-needs-execution-evidence"
  languageLabel="中文"
/>

# A Tool Connection Is Not Yet a Reusable Capability

A digital employee calls a search tool, receives a set of organizations, passes the output to a detail tool, and writes the result into a customer system. The schemas line up. A model judges the chain feasible. The runtime saves it as a reusable capability.

The first live call reveals what the descriptions concealed: the search returns 27 records, while the next tool accepts one identifier. Taking the first record, iterating over all records, or reducing the set before continuing would produce three different business effects. Even if one choice succeeds today, that observation does not establish that the same edge will work after an API upgrade, in another tenant, or under different defaults.

The important question is therefore not merely whether a model can select tools. It is **what promotes a candidate connection into an admitted capability, and what later makes that evidence stale**.

The central argument is: **reusable tool composition should be admitted through versioned, execution-grounded, provenance-bearing, refreshable evidence, with composition semantics included in capability identity. That evidence says where a composition has worked; it does not authorize a particular worker to execute it now.**

## A Plausible Edge Is Only a Candidate

Tool descriptions, input-output schemas, retrieval, and model judgment are valuable. They reduce a large search space and propose that a particular output may satisfy a downstream input. But a proposal is not yet an operational capability.

The same-day Research Object examines KOPA-Bench and EDGE, a primary study spanning 145 expert-authored tasks and 2,318 live MCP-exposed public-API tools. Its mechanism builds an initial dependency skeleton through retrieval and an LLM feasibility judgment, then updates edge confidence from observed execution. An edge does not need a prior live success to enter that initial skeleton.

That design creates a useful distinction. The initial graph contains hypotheses worth testing. The execution-refined graph contains more observational evidence. Neither state is a timeless proof that the composition is safe across versions, tenants, endpoints, or business contexts.

Collapsing both into one supported flag destroys the information governance needs most: whether the runtime has only structural plausibility, or context-bound evidence of repeatable behavior.

## Execution Changes the Evidence

The study reports a 50.2% execution success rate for the model-judged initial skeleton and 62.7% for the converged graph. Edges later pruned from the graph succeed only 14.8% of the time. These results do not prove that one update rule fits every enterprise system. They support a narrower and still consequential proposition: **live execution reveals information absent from interface descriptions and model priors, and that information can overturn a plausible edge.**

Failure identity matters as well. An impossible argument binding or a semantic mismatch points toward a structural problem. A timeout, rate limit, or authorization error may be environmental. Treating every failure as absence of capability discards recoverable edges; treating every failure as temporary keeps structurally invalid edges in circulation.

A useful evidence record therefore contains more than counts. It records the failure class, the basis for that classification, and unresolved uncertainty. When a provider returns an ambiguous error, unknown is an honest state. Forcing that observation into a convenient Boolean creates false confidence in either direction.

## Composition Semantics Belong to Capability Identity

The study reports that 81.2% of chained calls consume multi-record outputs, with a median cardinality of 27 and a maximum of 224,958. Type compatibility is therefore only the outermost condition. How a collection enters the next step can change business meaning and the scale of side effects.

At minimum, a runtime should distinguish:

- sequential pass-through, which preserves order and invokes the downstream tool one record at a time;
- fan-out, which invokes downstream work across multiple records;
- deterministic reduction, which filters, aggregates, or selects before continuing.

The same source field and target argument may appear in all three. They are not the same capability. Fan-out changes call volume and effect surface. Reduction decides which entities survive. Sequential processing changes timeout, recovery, and partial-completion behavior.

Capability identity cannot stop at Tool A connects to Tool B. It must preserve cardinality, selection rules, defaults, transformations, branch conditions, and partial-failure behavior. Otherwise the runtime reuses an interface shape while silently inventing new business semantics.

## What the Evidence Packet Must Bind

A minimal auditable packet should bind several groups of facts.

| Evidence component | Bound facts | Question answered |
|---|---|---|
| Tool identity | source and target tools, versions, endpoints | Which implementations were observed? |
| Fields and arguments | output field, input argument, defaults | How did data enter the next step? |
| Composition semantics | cardinality, order, fan-out, reduction, branching | What business meaning and effect scale were preserved? |
| Trial history | attempts, successes, failures, sample conditions | What observations support confidence? |
| Failure identity | structural, environmental, or unknown, with basis | Why did execution fail? |
| Environment provenance | tenant, credential class, service state, time | Where does the evidence apply? |
| Freshness rule | expiry and change triggers | When must the edge be revalidated? |

Evidence can be graded rather than governed by one universal threshold. A low-risk read may justify limited trials. An irreversible write or large fan-out needs stronger repetition, constrained testing, and effect safeguards. The invariant is not one score for every edge; it is that an admission decision can be traced back to a stable evidence object.

## Capability Is Not Authorization

An edge that worked yesterday in one tenant and one tool version has context-bound capability evidence. It does not answer whether today's digital employee may access the target account, write those records, or fan out 27 calls for this request.

Several ledgers must remain separate:

- capability evidence asks whether the composition can work under observed conditions;
- authorization evidence asks whether the current responsible actor may produce the intended effect on the current target;
- idempotency evidence asks whether a retry will reuse the original effect;
- transaction evidence asks whether authoritative external state committed;
- recovery authority asks who may continue after an unknown effect.

A single execution may link these facts, but none substitutes for another. Prior success is not permanent permission. A current approval is not proof that the underlying capability has been sufficiently tested.

## One Success Is Too Small and Forever Is Too Long

A reasonable objection is that demanding extensive trials for every tool edge would prevent capability graphs from growing. That is why a candidate state is useful. A runtime can permit exploratory execution against bounded targets, reversible environments, and limited effect scopes while it gathers evidence. It need not demand final confidence before the first experiment.

But one success followed by permanent registration is the opposite error. A single observation may cover one argument shape, one record, and one service window. A tool upgrade, schema change, endpoint migration, credential-context shift, or material change in recent failure behavior should downgrade evidence or trigger revalidation.

The better model is not two permanent states—capable and incapable—but a traceable lifecycle such as candidate, restricted admission, admitted, stale, and revoked. Historical success remains true, but it no longer automatically supports current activation.

## Boundaries and Open Questions

KOPA-Bench studies Korean public-sector APIs, and the associated repository still describes some benchmark assets, corpus data, and checkpoints as forthcoming. The study does not establish that every enterprise tool graph should adopt EDGE's exact Bayesian update rule. It also does not cover the full range of irreversible transactions, complex tenant authorization, or long-lived service evolution.

Open questions remain: How many trials, over what distribution, should each risk class require? When can evidence transfer across tenants? How should ambiguous provider errors be classified? How can behavior drift expire evidence without an explicit version change? How should capability confidence influence planning without gaining authority to alter an authorization decision?

A practical baseline is available now: **schemas and models may nominate capability candidates; only identity-bound, semantics-preserving, execution-grounded evidence with an expiry rule should promote them into reusable capabilities.**

**Evidence and citation:**

- [KOPA-Bench / EDGE primary study](https://arxiv.org/html/2609.05395v1)
