---
schema: "research-analysis/v1"
id: "AN-20260805-12"
date: "2026-08-05"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260805-12"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260805-12-verifiable-completion.md"
output_contract: "Research Object"
research_object: "Verifiable Completion Contract"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Verifiable Completion Contract for Computer-use Digital Employees

## Governed scope

This object consumes only the completed Reading Result for `Q-20260805-12`. It performs Research Analysis and produces a Production-ready Research Object. It does not introduce unread material, write publication copy, prescribe a full implementation, or authorize release.

## Analysis

```yaml
analysis:
  observations:
    - The Reading Result shows that a binary final-outcome judgment is insufficient for long, visual and environment-dependent computer-use work.
    - The Universal Verifier separates process quality, outcome attainment and diagnostic failure classification, and uses specific non-overlapping rubrics plus selected screenshot evidence.
    - The strongest measured gain is not attributable to a stronger model alone: backbone substitution improved false positives while worsening false negatives, whereas the bundled verifier architecture improved agreement and reduced false positives.
    - False-positive control is operationally important because an unsupported success claim can contaminate evaluation, training data and downstream business decisions.
    - The external false-positive rate remains 0.08, the benchmark has 246 trajectories, and the evidence is limited to web computer-use tasks.
  cross_comparison:
    - A final screenshot is an outcome artifact, not proof that required steps were followed or side effects stayed within scope.
    - A process score is evidence about execution quality, not proof that the requested business state exists.
    - A controllable-failure label assigns responsibility, but does not itself provide retry safety, compensation or acceptance authority.
    - Compared with the other two same-day Reading Results, this mechanism governs the post-execution completion claim; model routing governs pre-execution selection, while guardrail/session ordering governs what becomes durable after execution.
  discussion:
    - The structurally important change is the decomposition of "done" into separately inspectable claims rather than the use of a particular verifier model.
    - The causal explanation supported by the Reading Result is that explicit rubrics, process/outcome separation, failure taxonomy and evidence selection reduce opportunities for a judge to rationalize the observed trajectory or over-weight a final screenshot.
    - For a Digital Employee runtime, the verifier should be treated as an independent acceptance surface, not as the worker's own completion function.
    - The full research system is not directly reusable for SMEs because it is multi-stage, prompt- and code-heavy, and validated only on a small web benchmark. The reusable part is the completion-evidence contract and the separation of deterministic, learned and human checks.
    - Counter-evidence limits a strong adoption claim: human labels are not an objective oracle; "near-zero" is not zero externally; and no transactional, persistent-session or delayed-side-effect guarantee was demonstrated.
  research_judgment:
    - A Digital Employee must submit a completion claim backed by a versioned evidence contract; it must not be allowed to convert its own last action or final screenshot directly into accepted completion.
    - The minimum reusable architecture is a three-part completion record: process evidence, independently checked business outcome, and failure/side-effect classification.
    - Learned verification may advise the decision, but deterministic business-state checks and required human authority must remain independently expressible and capable of disagreeing.
    - The evidence supports adopting the separation pattern, not adopting the Universal Verifier implementation wholesale.
  uncertainty:
    - Confidence is high that binary completion is structurally inadequate for consequential computer-use work.
    - Confidence is medium that rubric-plus-evidence selection will transfer beyond web trajectories.
    - Confidence is low that the published scores predict enterprise incident reduction, long-lived session reliability or transactional safety.
  counter_evidence:
    - Browserbase false positives remain 8 percent.
    - The benchmark is small and web-specific.
    - The verifier is a bundled system, so the independent transfer value of each component is not isolated.
    - The sources do not demonstrate rollback, compensation, idempotency or durable audit semantics.
  engineering_impact:
    tmpa:
      - No TMPA Core change is justified.
      - Candidate portable semantics belong first in a profile or projection: completion claimant, evidence contract, verifier, acceptor, failure class and undetermined/conflicting judgment.
    digital_employee:
      - Position and WorkOrder should define authority and expected business outcome.
      - Each consequential Operation Node should emit a Completion Claim with rubric/version reference, evidence references, process assessment, outcome assessment, failure class and side-effect assessment.
      - Accepted completion must be produced by an independent verifier or authority gate; the worker may claim but must not self-accept.
      - Uncontrollable failure must remain a first-class result rather than being flattened into worker failure or success.
    codeflowmu:
      - Add a durable completion-receipt projection before attempting a general visual verifier.
      - Compose deterministic state readback, optional learned verification and QA/EVAL or ADMIN acceptance.
      - Preserve conflicting checks instead of forcing a binary result.
      - Keep raw screenshots and traces in governed evidence storage with retention controls, not in the portable contract itself.
  limitations:
    - No non-web Digital Employee execution has been tested.
    - No cost, latency, privacy or evidence-retention analysis has been performed.
    - No threshold policy has been validated for deciding when learned verification can be bypassed or must escalate.
    - No experiment has tested disagreement among deterministic checks, learned verifier and human acceptance.
  future_questions:
    - What is the smallest evidence package that prevents false completion without collecting excessive sensitive context?
    - Which Operation Node classes require deterministic readback, learned verification, human acceptance or all three?
    - How should retries and handoffs preserve failure controllability and evidence provenance?
    - Can a completion receipt be reconstructed from existing CodeFlowMu/FCoP events, or is a new canonical event required?
```

## Research judgment

The Production-relevant object is not “use Microsoft’s verifier.” It is:

> Treat completion as a governed claim with separate process, outcome and failure evidence, and require independent acceptance before a Digital Employee may represent consequential work as complete.

This judgment is an inference from the completed Reading Result and remains bounded by its benchmark and transfer limits.

## Production input

Production may consume this Research Object to explain the architecture of verifiable completion. It must preserve the stated uncertainty, the 8 percent external false-positive qualification, the web-only scope and the distinction between verifier advice and final business acceptance.

## Evidence boundary

- `research/reading/Q-20260805-12-verifiable-completion.md`

No other source was consumed by this Analysis object.
