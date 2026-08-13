---
title: "Resume Is More Than Reload: Reconstructing Execution Capability After a Human Pause"
date: '2026-08-13'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "After a human-in-the-loop pause, which execution capabilities must be reconstructed from current authority before resumed work can safely continue?"
summary: "A paused agent run can restore durable history and still lack the capability or authority needed to act safely."
sources: "research/analysis/Q-20260813-01-resume-capability-reconstruction.md"
item_id: "Q-20260813-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-13-resume-capability-reconstruction-cover.svg"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-13-resume-capability-reconstruction-cover.svg"
  kicker="Digital Employee · Daily Research"
  title="Resume Is More Than Reload: Reconstructing Execution Capability After a Human Pause"
  summary="A paused agent run can restore durable history and still lack the capability or authority needed to act safely."
  version="Q-20260813-01"
  status="Daily Runtime V5 · 2026-08-13"
  languageHref="/zh/digital-employee/2026-08-13-resume-capability-reconstruction"
  languageLabel="中文"
/>

# Resume Is More Than Reload: Reconstructing Execution Capability After a Human Pause

A resumable agent is easy to describe as a persistence problem: save the state, reload it later, and continue. The selected 2026-08-13 Research Object exposes a narrower but more consequential failure mode. A run can recover its durable history and its pending human decision while still missing a capability that was created dynamically by the execution flow. In that case, “resume” has restored memory without restoring a valid right to act.

The evidence is bounded to one Google ADK confirmation-and-transfer path. It does not establish universal pause/resume semantics. But it is enough to separate two concepts that are often collapsed in runtime design: **historical state restoration** and **current executable-capability restoration**.

## A paused run can restore history and still be unable to act

The research question is not whether a serialized run can be reopened. It is whether the reopened run has reconstructed the capabilities that are valid **now**, under the current topology and policy, before any resumed action receives execution authority.

That distinction matters in human-in-the-loop workflows because the pause itself creates time for the environment to change. An agent may have been allowed to transfer control to another agent when the pause began. By the time a human approves the pending action, the destination may have disappeared, the routing topology may have changed, or policy may no longer permit that transfer. A durable record can preserve what was requested without proving that the requested capability still exists.

The practical consequence is that a resume contract should answer two separate questions:

- What historical state has been restored?
- What executable capabilities have been reconstructed or revalidated from current authority?

Treating those as one “resume succeeded” flag hides a meaningful safety boundary.

## The missing object was a capability, not a confirmation record

The selected Research Object records three public-source facts from the examined implementation.

First, the affected resume path could fail because `transfer_to_agent` had been injected dynamically by the flow layer but was absent from the `canonical_tools()` reconstruction path. The missing object was therefore not the human confirmation record itself. It was an executable capability that the resumed context expected to possess.

Second, the fix recomputes current transfer targets and rebuilds the transfer tool before confirmation resolution. If there is no current transfer target, the capability is not reconstructed. That is an important design choice: the runtime derives the capability from current declarations instead of replaying an old executable object simply because it existed before the pause.

Third, capability reconstruction and the human approve/reject decision remain separate gates. Human consent does not manufacture a capability, and capability availability does not replace human consent.

These facts support a bounded conclusion: in this path, a correct resume needs more than durable state and more than a remembered approval request. It needs a current capability surface.

**Evidence and source boundary.** The source basis for these statements is the same-day Research Object at `research/analysis/Q-20260813-01-resume-capability-reconstruction.md`, which records facts derived from the selected public implementation change. This is public primary-source evidence through the examined project, not independent validation of a general theory.

## Split resume into state restoration and capability admission

A more explicit runtime model is:

**Restore durable state → reconstruct current capabilities → compare or revalidate authority → resolve human decision → grant execution authority.**

This is not a universal mandatory sequence for every system. Immutable capabilities may be safely serializable, and some runtimes may encode capability identity differently. The useful architectural point is the separation of concerns.

Historical state answers, “What happened and what was pending?” Current capability reconstruction answers, “What can this execution context do now?” Admission answers, “May it do that now?” Human approval answers, “Did the person authorize the pending decision within the intended scope?”

Keeping these domains separate makes several failure cases visible that a single resume status would blur:

- **State restored, capability absent.** The run can be inspected but cannot safely perform the pending action.
- **Capability reconstructed, human decision unresolved.** The runtime has the technical means to act but not the human authorization.
- **Human approval exists, current capability has changed.** The runtime needs an explicit policy for drift rather than silently treating the old approval as authority over a new capability.
- **Everything restored and revalidated.** Only then does resumed work receive execution authority.

The Research Center interprets the examined fix as evidence for this separation, not as proof that every agent framework must implement the same mechanism.

## Capability drift needs a governed non-execution result

The hardest case is not reconstruction success. It is reconstruction disagreement.

Suppose a person paused on a confirmation to transfer to Agent B, but Agent B is no longer a valid target when the run resumes. A robust runtime should not silently substitute Agent C, recreate an obsolete capability, or convert the old confirmation into a broader permission. It needs a governed non-execution outcome: capability unavailable, authority changed, confirmation stale, or another explicit status that makes the reason inspectable.

This suggests a useful audit boundary. A pending action can carry at least:

- the identity or description of the capability at pause time;
- the current reconstructed capability at resume time, if any;
- the authority or policy basis used for reconstruction;
- the human decision and its scope;
- the final execution-admission result.

The point is not to maximize metadata. It is to preserve the facts needed to distinguish “the user approved” from “the system was still authorized and able to execute the same thing.”

For digital-employee systems, this is especially important because long-running work makes pauses routine rather than exceptional. Human review, external credentials, delegated tools, organizational topology, and policy can all change while a task is suspended.

## One transfer path is not a universal resume theory

The evidence here is intentionally narrow. It covers one Google ADK `transfer_to_agent` confirmation-resume path. It does not establish exactly-once execution, universal capability identity, cross-process restoration, or a complete specification for human-in-the-loop recovery.

There is also a real counterargument to always reconstructing from current state. If a capability is immutable and safely serializable, replaying its identity may be more accurate than rebuilding it from a changed environment. Conversely, reconstructing entirely from current topology may produce a capability different from the one a user originally reviewed.

So the general lesson is not “always rebuild.” It is **make the authority choice explicit**: replay, reconstruct, compare, or refuse.

## Which authority should a pending confirmation bind to?

The unresolved question is the design of the binding itself.

Should a pending confirmation bind to the capability as it existed at pause time? To the capability reconstructed at resume time? Or to both, with an explicit comparison that invalidates the confirmation when material drift occurs?

The selected implementation gives one concrete answer for one dynamic transfer capability: reconstruct from current targets before resolving the confirmation. That is sufficient to expose the broader governance problem, but not to settle it.

A mature resume protocol should make that binding visible. Otherwise, “resume” remains an overloaded word that can mean “we found the old state,” “we rebuilt a tool,” “the human approved,” or “the work is authorized to continue”—four very different claims.
