---
title: "When Multi-Agent Systems Go Out of Control: What Agent Governance Do We Need in 2026?"
date: "2026-09-18"
published_date: "2026-09-18"
column: "open-source-engineering"
category: "daily"
article_type: "comparative-research"
language: "en"
lifecycle: "Published"
publication_authorized: true
summary: "Microsoft's runtime governance and a real OpenAI SDK fix lead to the questions of evidence, responsibility and authorization across agent handoffs—and why FCoP uses files for collaboration contracts."
cover: "/assets/fcop-governance-20260918/cover.png"
---

<ArticleCover image="/assets/fcop-governance-20260918/cover.png" kicker="Agent Governance · Part 1" title="When Multi-Agent Systems Go Out of Control: What Agent Governance Do We Need in 2026?" summary="Microsoft's runtime governance and a real OpenAI SDK fix lead to the questions of evidence, responsibility and authorization across agent handoffs—and why FCoP uses files for collaboration contracts." version="2026-09-18" languageHref="/zh/research/2026-09-18-multi-agent-governance" languageLabel="简体中文" />

# When Multi-Agent Systems Go Out of Control: What Agent Governance Do We Need in 2026?

In 2026, developers are giving AI more than questions. They are giving it work.

Breaking down requirements, writing code, running tests and reviewing results—steps once connected by people are increasingly assigned to different agents. A Planner develops a plan, a Coder implements it, and a Reviewer examines the delivery. That is the attraction of a digital team: a person sets the objective, multiple agents divide the work, and progress continues.

But delegating the tasks does not make management disappear. Scope, progress, disagreements and acceptance conditions once held in people's heads now need to remain clear across independently acting roles.

Why did an agent suddenly change the scope? Which of two conflicting reports should we trust? When an executor says “done,” has anyone actually checked? These questions lead to one concern: **once work is delegated to AI, who retains control of its boundaries and progress?**

Tool calls can become more frequent while collaboration becomes harder to explain. That gap is where anxiety about multi-agent governance begins.

### 1. Beneath the Momentum: Communication Confusion and Governance Anxiety in 2026

Consider a collaboration chain: a planner turns an ambiguous objective into tasks, an executor modifies code according to its interpretation, and a reviewer reads only the execution summary before declaring a pass. Every role has produced a response, yet the work may have drifted away from the original assignment. Finding the divergence requires tracing the instructions each participant received, the actions taken and the material behind each judgment.

This kind of loss of control rarely starts dramatically. It hides in seemingly smooth handoffs:

- **The message arrived, but the evidence did not.** The next participant knows that someone said the work was finished, but not what was checked or missed.
- **Tools have permissions, but the assignment lacks boundaries.** Permission to inspect a project is interpreted as permission to modify it. A limited authorization expands along the task chain.
- **The indicator turned green, but responsibility remains unresolved.** Code written, report submitted, tests passed and formal acceptance collapse into a single “done.”

![Scope, checks and review targets across a handoff](/assets/fcop-governance-20260918/figure-01-handoff.en.png)

*Receiving a message does not mean the supporting evidence is complete. The roles illustrate one collaboration pattern.*

Governance therefore starts with a straightforward requirement: **make both “what happened” and “what justifies continuing” possible to establish.**

In its September 2026 responsible AI statement, Microsoft moves governance further into system operation: organizations need to see what agents are doing, test their behavior and intervene when necessary. [Microsoft responsible AI statement](https://blogs.microsoft.com/on-the-issues/2026/09/01/responsible-ai-in-2026-how-we-are-adapting-for-whats-ahead/)

That direction has concrete engineering expressions. ASSERT translates organizational policies into evaluation scenarios. The Agent Control Specification (ACS) defines controls at key points including input, model, state, tool execution and output. Microsoft describes a cycle of identifying problems through evaluation, configuring controls and evaluating the improvement. [ASSERT and ACS technical explanation](https://devblogs.microsoft.com/foundry/build-2026-open-trust-stack-ai-agents/)

A fix in the OpenAI Agents SDK makes the issue concrete. In September 2026, contributor jbeckwith-oai submitted a fix describing how, when an output-checking program threw an exception without reaching a verdict, the run could fail while the unvetted answer was still saved to the session and sent back to the model in the next turn. The fix routes that output through the path that prevents persistence, keeping it out of subsequent context. [OpenAI Agents JS #1938](https://github.com/openai/openai-agents-js/pull/1938)

**A run ending does not mean everything it leaves behind is qualified to become evidence for subsequent work.** In multi-agent collaboration, we must ask whether handed-off content carries its checking status, and whether the recipient can distinguish a verified conclusion from output whose checks never completed.

Further questions follow: whose delivery was checked, and which attempt produced it? Which result does an approval cover? After someone else takes over, can the original basis still be inspected?

The problem has grown beyond getting agents to communicate. It is now **how to leave a basis for the work that later participants can inspect and use.**

### 2. Why Do Traditional Enterprise Governance Frameworks Still Need an Agent Layer?

Enterprise software already has access control, audit logs, database transactions and service gateways. Why does organizing agent work require additional governance rules?

Because technical operations and business assignments are connected by relationships that must be explicitly represented. A gateway can check whether a request carries credentials without knowing whether the action belongs to the current assignment. A database can store task state, but business rules must specify who may change it and what evidence must exist first.

When an agent adapts its execution path to intermediate results, those questions recur. A successful tool call establishes that an action ran. Determining whether the overall process is valid requires placing that action back into its task, role and authorization relationships.

**The first gap is the distance between technical permission and responsibility for the work.**

Being able to write a file is a capability. Being entitled to accept a delivery is a responsibility. Executors, reviewers and approvers should not acquire identical decision rights merely because they use the same tools.

Without explicit task relationships, teams must reconstruct events from logs: who requested this step, whether a modification exceeded the assignment, and why work advanced without review. The more autonomous the system and the longer the chain, the harder that reconstruction becomes.

**The second gap is how a human decision takes effect after intervention.**

A stop button addresses only part of the problem. The system must also know which work has been submitted, which actions have not yet run, which results should be preserved and where execution should resume.

Human approval raises similar questions. For delivery acceptance, approval needs to refer to a specific delivery and its scope. If the executor subsequently changes the content, does the original approval still cover the current result?

Without that relationship, “someone clicked approve” establishes that an event occurred, but provides a weak basis for later work.

Both gaps point to the same issue: a system must understand what an action means within an assignment, not merely that it happened. Generating a report does not establish formal delivery. An approval cannot remain valid independently of its object.

For long-running, continuous, multi-role work, these relationships cannot depend indefinitely on chat history and retrospective explanation. Tasks need identities, deliveries need supporting material, reviews need accountable roles, and key transitions need explicit conditions.

The next question is therefore: **how should these working relationships be preserved so that later participants can read, check and use them?**

### 3. Industry and Frontier Engineering: Why Are Text and File Contracts Worth Attention?

Following that line of thought, human-readable work contracts become valuable.

GitHub Agentic Workflows lets developers describe work in Markdown with YAML frontmatter, compile it into an execution environment, and apply permissions and controls over permitted write operations. The work definition can be read directly while execution mechanisms enforce constraints. [GitHub documentation](https://docs.github.com/en/copilot/concepts/agents/about-github-agentic-workflows)

Anthropic's engineering article on its multi-agent research system describes a different handoff practice: saving some artifacts externally and returning references to the coordinating agent, reducing information loss from repeatedly passing results through intermediaries. [Anthropic engineering article](https://www.anthropic.com/engineering/multi-agent-research-system)

The two approaches operate at different levels but touch a shared need: **work must leave material that the next participant can inspect again.**

Choosing Markdown does not require rejecting other structures. In its work on long-running agents, Anthropic used JSON for a feature list, together with progress material and tests supporting subsequent sessions. [Long-running agent engineering](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

The important question is whether work records can outlive a session and be read, referenced and checked again—not whether the medium is Markdown, YAML, JSON or a database. Sessions end, models change and executors are replaced. The reason a task exists, its current delivery, who checked it and on what basis should survive those changes.

That addresses preservation. Governance requires a further step.

Material used only for retrospective review supports recording and traceability. Material that also determines whether work may proceed starts to participate in governance. Whether a task may advance, whether an approval remains applicable and whether an old check covers a new delivery cannot depend solely on remembering what someone previously said.

A more important question follows: **should governance rules depend on agents remembering them, or become explicit rules shared by all participants?**

### 4. Why Does Governance Ultimately Lead Toward a Protocol?

Context reminders and prompt instructions alone struggle to preserve governance rules across long tasks and repeated handoffs. Context grows, is compressed and is truncated. Sessions end, models change and different roles interpret the same requirement differently. Prompts remain important, but they primarily tell an individual executor what it should do.

Governance must answer another question: **regardless of which model executes today or which agent takes over tomorrow, under what conditions may the work continue?**

A rule that depends solely on model recall resembles an instruction. When it is explicit, shared by participants and checked by the system at critical operations, it starts to become part of governance.

That is why governance needs a protocol.

A protocol is more than a longer prompt, and it need not encode every business judgment. It defines the working rules: what constitutes a task and a formal delivery, which result a review covers, who may make which decisions, and which missing conditions require the system to refuse further progress.

Organizations use procedures, rules and contracts for a related reason: important obligations cannot depend solely on each participant remembering them. Extending execution from people to models makes that concern more pronounced.

**A workflow tells an agent where to go next; a protocol establishes what entitles it to take that step.**

These responsibilities can coexist in one system: the process organizes execution, while the protocol specifies the conditions participants must satisfy to advance.

FCoP—the File-based Coordination Protocol—starts with this question.

It does not prescribe how an agent thinks or replace a reviewer's judgment about code quality. It specifies how work is established: tasks need persistent identities, deliveries must relate to particular tasks and execution attempts, reviews must identify their subjects, and transitions requiring authorization need the corresponding basis. A statement that the work is “done” cannot substitute for missing conditions.

FCoP uses ordinary files to hold these records. TASK, REPORT, ISSUE and REVIEW represent tasks, delivery reports, problems and reviews. People can open them; agents can read and inspect them. Files preserve records and evidence, while the protocol defines their relationships and the conditions under which they support further action.

![Linked records and checks at the operation boundary](/assets/fcop-governance-20260918/figure-02-protocol.en.png)

*The four record types are related records, not sequential lifecycle stages. Allowing an operation does not establish that its deliverable is correct.*

This apparently simple design immediately faces difficult questions.

If network retries send the same creation request 25 times, should there be 25 tasks or just one? If four processes claim the same task simultaneously, can all four believe they succeeded? If a reviewer checks one delivery and the executor subsequently produces a new result, does the old REVIEW still apply? Can work advance without a REPORT, a required review or authorization?

There is an even less intuitive question: **if agents never chat with one another and exchange work records only through TASK, REPORT, ISSUE and REVIEW, can they still form a team capable of sustained collaboration?**

That is what makes FCoP worth investigating. The interesting question is whether **rules expressed through ordinary files can actually constrain multi-agent work.**

### 5. What Matters Is Whether It Can Hold These Boundaries

FCoP proposes a deceptively simple answer: preserve multi-agent work records and collaboration rules in ordinary files, and check those rules at critical operations.

Retries, competing claims, changed deliveries and missing evidence are more revealing tests than a smooth demonstration. Does the system reuse an existing result when it should? Does it reject an invalid request? Can it stop when conditions are missing? Those behaviors establish what the protocol actually constrains.

If these boundaries hold, “files as protocol” becomes more than a design slogan. **It may mean that the order governing multi-agent work need not remain hidden inside a model, a prompt or a large central system.**

> **Next in the series**
>
> *The File System as Protocol: How Does FCoP Use Minimal Markdown to Govern Agents?*
>
> We move from why governance is needed to real FCoP interfaces and runnable code, examining retries, concurrent claims, review applicability after delivery changes, and missing delivery or authorization requirements.

---

[FCoP protocol and examples](https://github.com/joinwell52-AI/FCoP) · [Research repository](https://github.com/joinwell52-AI/joinwell52)
