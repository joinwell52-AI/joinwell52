---
title: "A Safe Command Name Is Not Execution Authority"
date: '2026-08-20'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "When the visible action name does not fully determine what will execute, what evidence should a digital employee use before treating an action as authorized?"
summary: "A command label records intent, not the full behavior that configuration and executable context can produce. A same-day Codex change shows why execution admission should fail closed to explicit policy when syntax cannot establish the effective action."
sources:
  - research/analysis/Q-20260820-01-effective-execution-authority.md
item_id: "Q-20260820-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-20-command-name-execution-authority-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-20-command-name-execution-authority-cover.png"
  kicker="Digital Employee · Daily Research"
  title="A Safe Command Name Is Not Execution Authority"
  summary="A command label records intent, not the full behavior that configuration and executable context can produce. A same-day Codex change shows why execution admission should fail closed to explicit policy when syntax cannot establish the effective action."
  version="Q-20260820-01"
  status="Daily Runtime V5 · 2026-08-20"
  languageHref="/zh/digital-employee/2026-08-20-command-name-execution-authority"
  languageLabel="中文"
/>

# A Safe Command Name Is Not Execution Authority

`git status` looks like a read-only request. In a configurable repository, however, the visible words do not necessarily describe everything the process may execute. Git configuration can redirect apparently harmless operations into helpers. A digital employee that recognizes only the command name can therefore mistake a familiar label for sufficient authority.

A Codex change merged on 2026-08-20 responds at exactly that boundary. Git was removed from the known-safe command shortcut on Unix and Windows. Under the `UnlessTrusted` approval policy, a plain `git status` now reaches `NeedsApproval` unless an explicit execution-policy rule authorizes it. Tests using absolute executable paths also distinguish a declared host executable from another unmatched Git path. An end-to-end regression reaches a human approval request and preserves denial as the command result.

The evidence supports a narrower and more useful rule than “Git is unsafe”: **a nominal action name is evidence of intent, not execution authority. Effective execution identity, governing policy and downstream effect containment remain separate facts.**

## The label describes intent; the context determines behavior

Command allowlists are attractive because they are deterministic and cheap. If a token such as `status` maps to one fixed implementation, a lexical classifier can remove unnecessary approval friction. The assumption fails when an executable, repository configuration, wrapper or environment can change what the same text will do.

That difference matters for digital employees because the visible action is often the evidence presented to both the agent and the reviewer. A request may say “inspect repository state,” while the effective execution path consults configuration capable of launching another program. The nominal command still records useful intent, but it no longer establishes the complete operation.

The absolute-path tests make the distinction concrete. A policy rule that covers one declared host executable does not automatically authorize another unmatched Git path. Command spelling is therefore only one component of policy identity; executable identity and execution context also matter.

## Failing closed does not mean asking about everything

Removing a known-safe shortcut does not make the classifier the final authority. The regression behavior preserves policy semantics: `UnlessTrusted` asks unless an explicit rule allows the action, while `OnRequest` retains its separate behavior. The change moves an uncertain case out of automatic safety classification and back into the governing policy.

This is an important architectural separation. Classification answers, “What evidence do we have about this action?” Policy answers, “Under the current authority, may it run?” A larger hard-coded allowlist collapses those questions and becomes stale whenever local configuration changes effective behavior.

An always-ask policy is not the only alternative. It can create approval fatigue without improving the evidence shown to a reviewer. A better contract lets cheap classifiers optimize cases whose behavior is independently constrained, but requires explicit policy for cases that syntax alone cannot prove safe.

## Bind the authorization record to effective execution

A useful execution record should preserve at least four distinct facts:

- the nominal intent presented by the user or agent;
- the effective executable and context that may alter behavior;
- the attributable, versioned policy decision that grants or denies authority;
- the later evidence about whether external effects were contained and reconciled.

The first fact supports human understanding. The second makes the decision about the operation that will actually run. The third identifies the authority channel. The fourth prevents a successful admission decision from becoming an unsupported claim about the result.

This separation also changes what an approval interface should show. Repeating the same command text is insufficient when executable path, repository configuration or helper risk materially changes execution. Informed approval needs the evidence that changed the policy outcome, not simply another confirmation button.

## Approval is not containment

The merged code and tests are public primary-source evidence from one implementation; they are not an independent security evaluation across agent runtimes. They do not enumerate every Git helper path, establish binary provenance, prove repository-configuration integrity or verify sandbox behavior.

Most importantly, an approval authorizes a bounded execution decision. It does not prove that a helper behaves as expected, that every external effect stays inside a sandbox or that remote state is reconciled afterward. Those are later gates with their own evidence.

The practical question is no longer whether a command belongs on a permanent “safe” list. It is what minimum effective-execution evidence must accompany an authority decision. Can a policy identity incorporate executable and relevant configuration digests without making every action prohibitively expensive? When repository state changes, which previous rules must expire? A digital employee becomes safer when those transitions are explicit and testable—not when a familiar name is allowed to stand in for the operation itself.

**Primary evidence:** [OpenAI Codex merged commit 3b45c290](https://github.com/openai/codex/commit/3b45c29062ff0e76e71c91b6753290400e7fa8da). The public code and repository tests establish the bounded implementation behavior described here; they do not independently validate complete execution security.
