---
schema: "publication-candidate-article/v2"
title: "The rules are written. Why might an agent still make a different choice?"
date: "2026-09-18"
published_date: "2026-09-18"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "The rules are written. Why might an agent still make a different choice?"
summary: "An empty list of permitted directories returns allow. Three bounded experiments follow rule meaning through configuration, triggers and restored history."
cover: "/assets/six-governance-20260918/when-rules-change-meaning.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded original-code and public-artifact study; scope stated in text"
pageClass: "six-governance-article"
---

<ArticleCover image="/assets/six-governance-20260918/when-rules-change-meaning.cover-v1.png" kicker="Open-source engineering · Experimental research" title="The rules are written. Why might an agent still make a different choice?" summary="An empty list of permitted directories returns allow. Three bounded experiments follow rule meaning through configuration, triggers and restored history." version="2026-09-18" languageHref="/zh/research/2026-09-18-when-rules-change-meaning" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.six-governance-article .vp-doc h1[id] { display: none; }</style>

# The rules are written. Why might an agent still make a different choice?

What does an empty list of permitted write directories mean?

A natural answer is “writes are forbidden everywhere.” The documentation example of one skill tool we studied gives that interpretation. Yet its original configuration loader and permission checker returned “allow.”

No business file was written in our experiment. The interesting discrepancy occurred earlier: the human-readable constraint and the computed decision already meant different things.

## Following principles into implementations

[Runtime Governance](https://arxiv.org/abs/2603.16586v1), by Maurits Kaptein and colleagues, emphasizes execution paths: earlier reads can change whether a later send is permissible. [AgentSpec](https://arxiv.org/abs/2503.18666v3), by Haoyu Wang and colleagues, connects conditions to execution constraints. [AGENTSAFE](https://arxiv.org/abs/2512.03180v1), co-authored by Mansura Habiba, brings capabilities, controls, oversight, and assurance evidence into a common framework.

We wanted to examine where these ideas require additional engineering evidence. We ran a public policy engine, a rule-trigger module, and a skill permission checker.

The provenance matters: we have not found an official AGENTSAFE implementation. Bulbasaur Skill CLI is a separate related project by Mansura. Its behavior is not an experimental validation of AGENTSAFE.

## Two meanings of an empty list

We loaded YAML through the original loader and submitted path strings to the original checker.

| Configuration and input | Checker decision |
| --- | --- |
| Write rules omitted | Allow |
| Explicit `write_paths: []` | Allow |
| Allow `/workspace/output/**`; path inside that directory | Allow |
| Same rule; path in another directory | Deny |
| Same rule; `/workspace/output/../other.txt` | Allow |

The empty list means “no rules” to this evaluator, rather than “no permitted locations.” The last case shows that this method applies string glob matching without first resolving `..`.

This does not establish that a deployed runtime can write outside its authorized directory. Its caller might normalize paths or enforce an independent boundary. We verified the loader and evaluator, and a discrepancy with the documentation example.

All 29 selected upstream permission tests passed. One explicitly expects allowance when no filesystem rules exist. The tests verify an implementation choice. The remaining question is whether that choice matches the meaning presented to users.

## One send action, opposite decisions

Kyvvu’s public exfiltration policy provided a different controlled comparison. We held the send action constant and changed its recorded history.

A public-data read followed by a review record allowed the send. A sensitive-data read followed by the same review blocked it. Adding another review did not clear the restriction. Under this policy, sensitive access constrains subsequent actions throughout the task.

We then deliberately created a new engine with the same agent and task identifiers but supplied only the review record. The send was allowed. Restoring the sensitive-read history restored the block.

![The same identifiers and action receive different decisions with full, partial and restored histories](/assets/six-governance-20260918/when-rules-change-meaning.figure.en.svg)

*Figure 1. Changing the supplied history changes the send decision. Source: the tainted, fresh_engine_same_ids and restored_history cases in kyvvu-paths.json; decisions only, with no actual sends or claim of hosted recovery failure.*

This is not a report of hosted-platform recovery failure. We intentionally withheld information the policy needs. The result demonstrates that **identical identifiers cannot substitute for the history actually reaching the policy engine.** Recovery and handoff mechanisms need to establish what governance history was restored, who supplied it, and how missing evidence is handled.

The eight selected upstream exfiltration tests also passed. Our six history controls evaluated decisions only; they did not send messages or transfer data.

## Before enforcement, the rule must trigger

AgentSpec directed our attention to an earlier boundary. We used its original parser to construct a PythonREPL rule and exercised the original trigger method.

An exact tool-name match triggered the rule. Renaming the tool prevented that match for the same text argument. A different tool could also trigger it when its text input began with PythonREPL.

Input types mattered too. An exact-name match with dictionary arguments returned true through short-circuit evaluation. A different name with dictionary arguments reached string handling and raised AttributeError. A finish action with None produced the same exception type.

We did not run the complete AgentExecutor, so these results do not establish that every integration fails. They identify an input-contract question: does the adapter supply strings, dictionaries, or null values? Does that contract survive tool wrapping and renaming?

A detailed safety condition cannot work as intended if its trigger receives an object outside the expected contract.

## From having rules to enforcing their meaning

These experiments address distinct boundaries: configuration interpretation, action recognition, available history, and the eventual consumer of a decision. A single “governance enabled” indicator cannot establish them all.

Three small sets of checks are useful:

1. Distinguish omitted settings, explicit empty values, and deny-all semantics. Compare documentation with tests.
2. Test actual tool names and argument types at the trigger boundary, including adapter transformations.
3. Verify that required history is present after recovery or handoff, and that a denial actually prevents the tool effect.

That final effect-boundary check requires an execution experiment. Our evaluator controls cannot answer it.

For practitioners, a further question is whether agent handoffs should carry complete traces or a verifiable, sufficiently conservative governance state. For users, a simpler question is equally useful: when an interface says that no directories have been authorized, do you expect every write to be denied? That expectation should inform a contract test.

Governance needs clear constraints and evidence that their meaning survives implementation.

Study date: 17 September 2026. See the [experiment report](https://github.com/joinwell52-AI/joinwell52/blob/d258d0b925af198f0920fc6e897c390e02979900/research/manual-runs/2026-09-17-six-governance/00-report.md) for pinned commits, kyvvu-engine 0.11.0, controls, and limitations. These local experiments do not reproduce full paper evaluations, demonstrate a deployed escape, or establish a CodeFlowMu defect.

[Research repository](https://github.com/joinwell52-AI/joinwell52)
