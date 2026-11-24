---
title: "An AI worker takes over. Which rent report would you approve?"
description: "Why do two reports on the same payment get opposite verdicts? Twelve comparisons, one missing-file check, and a paired follow-up trace which rules and evidence should survive an agent handoff."
cover: "/assets/covers/2026-11-24-sop-version-handoff-reader-v2.png"
date: "2026-11-24"
published_date: "2026-11-24"
column: "digital-employee"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
language: "en"
lifecycle: "Published"
publication_authorized: true
lang: "en-US"
pageClass: "six-governance-article"
---

<ArticleCover image="/assets/covers/2026-11-24-sop-version-handoff-reader-v2.png" kicker="Digital employees · Handoff and review" title="An AI worker takes over. Which rent report would you approve?" summary="Why do two reports on the same payment get opposite verdicts? Twelve comparisons, one missing-file check, and a paired follow-up trace which rules and evidence should survive an agent handoff." version="2026-11-24" languageHref="/zh/research/2026-11-24-sop-version-handoff" languageLabel="简体中文" />

<ArticleTableScroll language="en" />

<style>.six-governance-article .vp-doc h1[id] { display: none; }</style>

# An AI worker takes over. Which rent report would you approve?

Imagine a company assigning rent reconciliation to AI digital employees. **A digital employee is an AI agent that takes responsibility for a role.** Like a person given an assignment, the reconciliation agent has to understand the job, plan the work, find evidence, resolve questions, and explain its result. At shift change, another digital employee takes over and a separate reviewer decides whether the report should pass.

**That’s the scenario we tested.** In the actual runs, we used scripted stand-ins for the agents and a test identity to record approval. No humans changed shifts and no language model was called. We ran the real **CodeFlowMu** interfaces. CodeFlowMu is the local AI team coordination system we develop. It manages assignments, approval decisions, reports, and reviews.

The digital employees for these roles are still in development. This synthetic account gives us a way to work out what their role skills and tools should provide. What evidence does the next agent need to carry on independently, and what does a separate reviewer need to check its work?

Take the reviewer’s seat. Two reports show the same rent payment. The tenant owes **¥3,000**, the bank received **¥2,700**, and a **¥300 waiver** is still provisional. Nobody has signed off on the waiver.

When the morning shift assigned the work, only approved waivers counted. That afternoon, the procedure changed to include provisional waivers. One line in the assignment reads: “Finish this attempt under the procedure in effect at dispatch.”

| Report | What it says |
|---|---|
| **A** | Count the provisional waiver. **¥0 outstanding.** The account is reconciled. |
| **B** | Keep the provisional waiver open. **¥300 outstanding** until it’s approved. |

**Would you approve A or B?** Make your call, then see what happened when the reviewer opened the afternoon procedure.

<details>
<summary>I’ve made my choice. Show the result.</summary>


For this assignment, **B** should pass. In the experiment, a reviewer recalculating under the latest procedure did exactly the opposite: **A passed and B was rejected.**

## The reviewer did the math and still got it backwards

The review program recalculated from the source records. Under the new rule, the provisional waiver counts. Subtract ¥2,700 and then ¥300 from ¥3,000, and the balance is zero. The program compared Report B’s ¥300 balance with its own zero and rejected it. Report B had used the version specified on the original assignment.

The question is who changed the rule for this assignment. The morning instructions left ¥300 pending. After the afternoon update, the worker opened the latest procedure, and so did the reviewer. Both calculations were internally correct. **On that path, publishing a procedure silently changed the acceptance criteria for work already underway.** The reviewer recalculated under the same new rule and ratified the change. Add another reviewer who also opens only the latest copy, and you may get one more vote for the same mistake.

## Same procedure ID. Which page opens?

The starting point was a fix in **StaffDeck**, OpenBMB’s open-source platform for enterprise digital employees. It publishes operating procedures for AI agents. The problem was an old database migration that ran at startup. In the regression example, an agent found the expense policy under `sop_expense_policy`. The migration could rename the stored ID to `skill_expense_policy` while the published reference still pointed to the original ID. The procedure could still be in the database while the agent lost sight of it. The fix preserves published IDs and restores previously renamed IDs when it can establish the match without a conflict.

The regression test publishes a procedure, reopens the database, and runs initialization. It tries two cases: the public ID is still intact, or the old logic has already renamed it. In both cases it checks that the original ID is present and the procedure is visible to the agent. That test answers **“Can the agent still find this procedure?”** It gave us a follow-up question. If the ID still works but someone publishes a revision in the afternoon, how does the evening shift open the version that applies to the morning assignment? That is why we put Reports A and B side by side. [StaffDeck’s change and regression test](https://github.com/OpenBMB/StaffDeck/commit/389d5d331cf40eb5f0aae83c4fa24f4ed10b0003)

StaffDeck’s fix shows why the next digital employee needs to be able to retrieve the procedure. We took that question two steps further. First we kept the procedure ID stable and updated the text after dispatch, to see whether the worker and reviewer would make the same version mistake. Then we approved a switch for only one open assignment and checked whether the next shift could keep the verified payment and reassess just the waiver. The first test asks whether the rule can change silently. The second asks whether a deliberate switch can limit the rework to its approved scope.

## The first six all passed. Why run six more?

We simulated the two roles in CodeFlowMu, keeping the rent data and the instruction to finish under the original rule constant. The worker program either opened the current procedure or retrieved the assigned copy. The review program read back the report and task under its own test identity, then checked each report twice: recalculate the amount under the current procedure, or check the version, file fingerprint, and amount against the assignment. The programs computed the balances and verdicts from those inputs.

We set the expected outcome before running the experiment. V1 counts approved waivers only, so this assignment should show ¥300 outstanding. We kept the ledger and the assignment terms fixed and varied whether a revision appeared during handoff and where the worker and reviewer got the procedure. That let us trace a changed verdict back to the way the procedure was selected.

In the first six runs, the rule stayed the same. We tried each worker approach three times. The current copy and assigned copy matched, all six reports showed ¥300 outstanding, and both checks passed every report. **Those six runs gave us a baseline.** In everyday work where the rules stand still, opening the latest copy can look entirely reliable. To tell the approaches apart, we needed an update after the task was assigned and before the next worker took it over.

That is what changed in the next six runs. Opening the latest copy produced three A reports. Retrieving the assigned copy produced three B reports. Each report then went through both review methods. Read across either row in the figure: **the report stays put while a change in review basis flips the verdict.** For this assignment, the current-only check passed all three A reports in error and rejected all three valid B reports. The assignment-based check got all six decisions right.

[![The same report passes under one review basis and is rejected under the other, shown for both reports](/assets/sop-handoff-20261124/verdict-reader-v2.en.svg)](/assets/sop-handoff-20261124/verdict-reader-v2.en.svg)

*Each cell shows three results. The four cells come from six reports, each reviewed two ways.*

We used the official FCoP collaboration interfaces for tasks and reports. The assignment-based verdicts were filed as formal reviews of the corresponding reports. The harness controlled the handoff, accounting rules, and review methods. The results cover that controlled path. Live shift changes and business acceptance still need to be measured. [Per-run balances, both verdicts, and whether a formal review was filed](/assets/sop-handoff-20261124/controlled-runs.json)

## The assignment names a copy nobody can open

For the last run, we kept the assignment’s reference and fingerprint, left the new version available, and took away the old text. The incoming program could identify the missing file. It had no text to tell it how the original procedure treated provisional waivers. **The task stayed active. It produced neither a report nor a review.** This one missing-file check adds a condition to the earlier result: the next shift needs to be able to retrieve the exact version the assignment references. A fingerprint helps verify the copy once you have it.

## Can the next shift carry on with the same job?

At shift change, reassignment, or restart, the system opens an assignment for someone new. **A worker can take over only if they inherit the same job.** When a procedure changes, the system needs to retain two facts: the rule the organization has now published, and the rule that governs this particular assignment. The publication record establishes the first. The original assignment or an authorized decision to move open work onto the new rule establishes the second. That is how the handoff can leave the pending ¥300 where it belongs.

In practice, the task needs to point to a retrievable copy of the applicable rule. The report records the version used and the ledger entries it relied on. Those linked records let the reviewing agent check the numbers and decide whether the work meets the original terms. If the historical copy is missing, the incoming agent needs to identify it and ask the responsible person to recover it.

## This time the rule really changed. What had to be redone?

We ran a follow-up. This time A and B were two separate assignments. **The morning shift used two test accounts, one for reconciliation and one for review.** Under the reconciliation account, the script checked the synthetic ¥2,700 payment, applied V1 to calculate zero eligible waiver, and filed both results in a record linked to the assignment. Under the review account, it checked the original inputs independently and recorded exactly which evidence it had verified. Both assignments stopped there, before a final report was filed.

After V2 was published, the test administrator approved B alone: keep the verified payment and reassess the waiver under the new rule. A’s request stayed pending. We reopened the CodeFlowMu task interface with **two different test identities**, one running reconciliation and one running review. Both recovered the morning’s records through the task interfaces. V2 was available to both assignments, but only B had an effective decision to switch.

We also set the checks for this round before running it. Both assignments had to recover the original payment verification, with zero new payment checks. A had to stay on V1 while its approval was pending. Only B could recalculate the waiver under V2. We checked those expectations against the file fingerprints, operation counts, and filed reviews.

| Assignment | Rule used after handoff | Payment reverifications | Waiver reassessment | Balance confirmed by the new reviewer |
|---|---|---:|---:|---:|
| A, switch pending | V1 | 0 | 0 | ¥300 |
| B, switch approved | V2 | 0 | One calculation and one review | ¥0 |

On both assignments, the payment verification records had identical file fingerprints before and after handoff. The operation log showed zero payment reverifications. B had one new waiver calculation and one independent review. We read back the two formal reviews and checked their links to the reports and earlier evidence. Only B cited an effective switch decision. **This time we could account for B’s zero balance: the terms really had changed, and only the affected step was repeated.** [Both decisions, evidence fingerprints, and operation counts](/assets/sop-handoff-20261124/selective-migration-runs.json)

This was one paired local comparison. Tasks, switch decisions, reports, and reviews went through the product interfaces. The two incoming identities were test accounts. The harness followed the approved list of steps to keep and repeat. A live handoff still needs to show whether AI agents can use the records to determine which earlier results are reusable.

## What should the system hand over?

StaffDeck’s fix shows why a procedure ID needs to survive a restart. Our two local experiments take that further: **the handoff for an open assignment needs to say which rule applies, which results still stand, and which judgments have to be made again.** In the first experiment, recalculating under the latest procedure let three incorrect reports pass and rejected three correct ones. In the follow-up, the approval applied to one assignment. Both kept their original payment evidence, and only the approved assignment reassessed the waiver. Those are observable checks for a digital employee system: after the accounts change, a change in outcome should still trace back to a decision on the specific assignment.

**The digital employee makes its own judgment, and another agent reviews the work independently.** When the reconciliation agent receives A, it should check for an effective decision on that assignment before choosing the rule. If A reports zero, the review agent should open the assigned version, ask why the ¥300 was counted, and reach its own verdict. The organization’s rule owner authorizes which assignments move to the new version.

The **workflow track** carries the assignment, attempt, approved decision, and previous work records into the handoff. **Tools** return the original procedure, ledger entries, and receipts. **Fact-checking** verifies whether the agent actually performed the actions it claims, such as opening a particular version or invoking the payment verification tool. A receipt showing the agent opened V1 establishes that operation. The worker and reviewer still have to determine independently whether the waiver qualifies under V1.

## If you’re programming the next agent, what should it read first?

**Recover the work from the formal records.** The incoming worker gets the assignment ID and attempt, then reads the task, effective decisions, and evidence. The previous agent’s reasoning or chat can suggest where to look. The files establish how far the work got, which approval took effect, and whether a report was formally submitted.

To program the digital employee, give it three things:

- **The assignment tells it what to deliver.** The reconciliation agent owes a report with the balance and its basis. The reviewing agent receives a reference to a specific report and delivers an independent assessment. The assignment and any effective decision for this attempt establish the procedure to apply.
- **A role skill gives it a way to work.** The reconciliation skill can guide the agent to inspect the handoff, work out which evidence still applies, and cite its sources. The review skill can ask the agent to examine the originals before comparing them with the report. Each agent chooses what to investigate and follows up when evidence is missing.
- **MCP, the Model Context Protocol, exposes tools it can call.** An agent uses tools to read assignments and reports, retrieve authorized materials, and file its report or review. The files and receipts returned by the tools give it facts to work from.

FCoP, the File-based Coordination Protocol, gives the agents records they can retrieve and link: the assignment (`TASK`), report (`REPORT`), and review (`REVIEW`). A report’s `subject_ref` and `attempt_id` identify its assignment and attempt. A review’s `references` identify the specific report it assesses. **The worker can submit a result. Delivery depends on an independent review by another agent.** The reviewer makes its own assessment using the original evidence and procedure. A claim that the payment was checked needs a reference to the payment record and the receipt for the check.

In the experiment, CodeFlowMu let us read and write those records under separate test identities and look up approved instructions by assignment and attempt. Both assignments could open V2. A had no effective switch decision for the current attempt. B had a decision for its own assignment and attempt. The experiment exercised this sequence:

```text
Worker: read TASK and attempt → retrieve effective decisions and source evidence → write REPORT → submit for review
Independent reviewer: read task, rule, and source evidence separately → check the specific REPORT → write REVIEW referencing it
```

The script handled version selection and calculation under the approved list of steps. With live agents, FCoP still supplies the formal work records and CodeFlowMu still delivers the relevant context and tools. **The worker and reviewer make their own judgments about what to investigate, what to redo, and whether the report meets the assignment.** A filed “pass” shows who reviewed which report. The cited procedure and original evidence let us check whether that verdict holds up.

## What did the second agent actually check?

These experiments changed how we think about independent review. If two agents pick the same wrong rule, their separate calculations can agree exactly. They still share a faulty premise. That leads to a question: **what would make a review add enough evidence to overturn the first answer?** The same rent case gives us three ways to test it.

**Which comes first, the answer or the evidence?** Could seeing “¥0 outstanding” anchor a live reviewer? We varied how the procedure was chosen in this study. The order in which reviewers see the evidence is a separate question. Give paired reviewers the same assignment, records, and report. One sees the report first. The other examines the source records and files a preliminary assessment before seeing the report. Include correct calculations under both the right and wrong versions. Set the expected verdicts from the assignments in advance and compare missed version errors and incorrect rejections. That tells us whether going to the source first improves review.

**Claiming you checked, checking, and understanding what you checked are three different things.** Give a reviewer two contrasting records. In one, a report says the agent opened V1, but the complete log of the retrieval tool contains no matching call. In the other, the receipt confirms that the right copy was opened, yet the report deducts a ¥300 waiver that V1 disallows. The operation log answers the first claim. A separate review agent has to find the clause and explain the second error. Record the results separately to see whether the evidence trail or the role’s review guidance needs work.

**Which change warrants repeating which step?** In the follow-up, the approval already said to keep the payment and recheck the waiver. Next, let the incoming agent identify the rework itself. Compare a change that affects only waiver eligibility with a case where the bank has reversed the payment. Give workers the same kind of assignments, records, and effective decisions, and have a separate reviewer check their proposals. In the first case, the payment verification can carry forward. In the second, the agent needs to reverify the payment and recalculate the balance. Count both missed rework and unnecessary repetition.

For each comparison, fix the task fixtures, model version, role skill, tools, and permissions. Decide what success looks like before changing the condition under test. FCoP files capture each agent’s verdict and references. Tool receipts record the actions each took.

The results will guide how we build these roles. If checking the originals first reduces missed version errors, we have grounds to put it in the review skill. If a critical action leaves no evidence, we can improve the tool receipt. If the incoming agent cannot tell what still applies, we can check whether the handoff files capture the relationship between the rule, evidence, and work performed. We’ll start with evidence order. **What verifiable evidence does a second digital employee add, and when does it change the result?**

</details>
