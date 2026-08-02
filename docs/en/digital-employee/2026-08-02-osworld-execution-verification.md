---
title: Digital Employee Academic Observation 001 — OSWorld Shows Why Work Must Be Verified by Execution
date: '2026-08-02'
column: digital-employee
category: academic
summary: OSWorld’s real-computer tasks, reproducible initial states, and executable evaluators show that a Digital Employee should be judged by the resulting application state rather than its own completion claim.
sources:
  - OSWorld paper
  - OSWorld project and official repository
  - OSWorld-Verified and OSWorld 2.0 project updates
outline: deep
---

<ArticleCover
  image="/assets/covers/academic-osworld.svg"
  kicker="Digital Employee · Academic Observation 001"
  title="OSWorld Shows Why Work Must Be Verified by Execution"
  summary="Real computer work requires controlled initial state, observable actions, and executable final-state evaluation."
  version="DA001"
  status="Production Test V1 · 2026-08-02"
  languageHref="/zh/digital-employee/2026-08-02-osworld-execution-verification"
  languageLabel="简体中文"
/>

## Summary

OSWorld introduced a benchmark and real-computer environment for multimodal Agents performing open-ended tasks across web and desktop applications. The original study contains 369 tasks derived from real computer-use cases. Each task includes detailed initial-state setup and a custom execution-based evaluator.

The original paper reported a large gap between humans and the evaluated baseline systems: humans completed more than 72.36% of tasks, while the best model in that study achieved 12.24%. These are historical results from the 2024 paper, not a claim about the current leaderboard.

The most important contribution for Digital Employee architecture is not the score. It is the evaluation model.

The Research Center judgment is:

> A Digital Employee should be evaluated against a reproducible initial state and an executable final-state contract. Screenshots, action logs, and model explanations are evidence inputs; they are not substitutes for verifying that the required business state actually exists.

## Source

### Primary research object

**OSWorld: Benchmarking Multimodal Agents for Open-Ended Tasks in Real Computer Environments**, published as an arXiv paper in 2024 and associated with the OSWorld project and open-source repository.

The research question is whether multimodal Agents can perform diverse, open-ended computer tasks in real operating-system environments rather than in a simplified webpage, fixed API, or application-specific simulator.

### Why this work was selected

OSWorld is directly relevant to the Digital Employee direction because it combines:

- real web and desktop applications;
- operating-system interaction;
- multi-application workflows;
- controlled initial-state setup;
- action execution in a virtualized environment;
- task-specific executable evaluators;
- reproducible research infrastructure.

The official repository later introduced OSWorld-Verified and the project has continued into OSWorld 2.0. These later developments reinforce an important academic lesson: benchmark tasks, environments, assets, and evaluators need versioned maintenance; a score without the exact benchmark release is incomplete evidence.

## Observation

### 1. The benchmark evaluates work in an environment, not text in isolation

The Agent interacts with a real computer environment. It must perceive the interface, choose actions, navigate application state, and complete a task that may span desktop and web software.

The benchmark therefore tests a system composed of more than a model:

```text
Task instruction
+ initial environment state
+ observation interface
+ action interface
+ computer runtime
+ application behavior
+ evaluator
= measured task outcome
```

*Diagram: joinwell52 Research Center synthesis from the OSWorld paper and repository.*

A benchmark result is consequently affected by environment setup, credentials, network conditions, application versions, action timing, and evaluator correctness.

### 2. Initial state is part of the task contract

OSWorld tasks include a detailed initial-state setup configuration. This is essential because the same instruction can have different meanings depending on open applications, files, account state, browser tabs, prior records, locale, or current selection.

For organizational work, the equivalent is a WorkOrder admission snapshot. A Digital Employee cannot be evaluated fairly if the system does not know which state it received.

### 3. Evaluation is based on the resulting state

OSWorld uses custom execution-based evaluation scripts. The evaluator checks the computer or application state after the Agent acts.

This is stronger than asking the model whether it succeeded. It can distinguish:

- a correct explanation from an incorrect application state;
- a click attempt from a persisted change;
- a visually plausible screen from the required data condition;
- partial progress from actual completion.

### 4. The original human–Agent gap exposed grounding and operational limits

The paper attributed much of the performance gap to GUI grounding and operational knowledge. Open-ended computer work requires identifying the correct interface target, understanding application behavior, sequencing actions, handling delays or unexpected states, and recovering from errors.

The historical numbers should not be used as current capability rankings. Their research value is that they demonstrated how far task-level success could diverge from general language competence.

### 5. Benchmark maintenance is part of evidence quality

The official repository subsequently announced OSWorld-Verified after fixing reported issues and improving benchmark signals. OSWorld 2.0 further emphasizes release-consistent code, task files, assets, and mocked websites.

This shows that evaluator quality and version pinning are not administrative details. They determine whether two reported scores are actually comparable.

## Discussion

### A Digital Employee needs a Work Verification Contract

An organizational task should be represented with explicit setup and validation:

```yaml
work_verification_contract:
  task_id:
  instruction:
  initial_state_manifest:
  allowed_applications:
  allowed_action_classes:
  credential_scope_ref:
  success_predicates:
  forbidden_side_effects:
  evidence_requirements:
  timeout_and_retry_policy:
  evaluator_version:
  environment_version:
```

The success predicates should be as close as possible to the business system of record. A screenshot can support verification, but a readback of the saved record, generated file hash, workflow status, or application database state is usually stronger.

### Execution-based verification changes the runtime design

If success is checked only at the end through natural language, the Runtime can stop when the Agent says “done.”

If success is execution-based, the Runtime needs:

1. a known initial state;
2. checkpointed observations and actions;
3. an independent evaluator;
4. a clear distinction between progress and completion;
5. retry and recovery rules;
6. evidence retention;
7. a failure report that identifies which predicate was not satisfied.

This makes evaluation part of execution rather than an after-the-fact quality report.

### Benchmark tasks and production work are not identical

OSWorld provides a valuable research environment, but a production Digital Employee faces additional concerns:

- real customer or employee data;
- irreversible or financially consequential actions;
- access governance and separation of duties;
- privacy retention rules;
- incident response;
- changing applications and anti-automation controls;
- ambiguous business objectives;
- authority to escalate rather than continue.

Therefore, passing a benchmark does not prove production readiness. The benchmark validates a subset of the runtime contract.

### A useful internal benchmark should preserve failure evidence

For every failed task, the organization should be able to inspect:

```text
initial state
→ observed state sequence
→ proposed actions
→ executed actions
→ policy/approval events
→ final state
→ failed predicate
→ recovery attempt
```

This supports engineering improvement and prevents a single aggregate success rate from hiding repeated failure modes.

### Evaluation must be versioned

A score should always bind to:

- task-set version;
- environment image or release;
- evaluator version;
- model and runtime version;
- tool and action interface version;
- credential and network configuration;
- retry policy;
- date and execution logs.

Without these references, the result cannot be deterministically interpreted or compared.

## Engineering Impact

### TMPA

This note does not directly edit TMPA publications. It provides research evidence that Integrity requires references to initial state, execution events, evaluator version, evidence, and final-state judgment. A completion claim without these references is not enough for deterministic reconstruction.

### Digital Employee

Digital Employee evaluation should be organized around Position-specific Work Verification Contracts. Each Position needs representative tasks covering normal operation, invalid input, interruption, policy denial, escalation, recovery, and duplicate-action prevention.

The platform should report at least:

- final-state success;
- policy conformance;
- unsupported side effects;
- human intervention points;
- recovery outcome;
- evidence completeness;
- environment and evaluator versions.

### CodeFlowMu

CodeFlowMu should build a small internal computer-use benchmark before integrating uncontrolled external websites. A first suite can use a local deterministic application and include:

1. search and read-only retrieval;
2. form entry with validation;
3. multi-step status transition;
4. file generation and hash verification;
5. approval-required action;
6. injected error followed by checkpoint resume;
7. duplicate-submission prevention.

Each task should have an executable validator. QA should review the validator as well as the Agent output, because a flawed evaluator can certify the wrong behavior.

## Future Work

1. Read and compare OSWorld-Verified and OSWorld 2.0 task/evaluator changes in detail.
2. Define a Position-level benchmark schema for Digital Employees.
3. Build executable validators for a controlled local application.
4. Separate task success, policy compliance, evidence completeness, and recovery quality.
5. Test whether screenshots alone are sufficient for any task class.
6. Establish versioned benchmark releases and frozen evaluation manifests.
7. Compare computer-use benchmarks with end-to-end business-process benchmarks.

## References

1. Xie et al., **OSWorld: Benchmarking Multimodal Agents for Open-Ended Tasks in Real Computer Environments**: https://arxiv.org/abs/2404.07972
2. OSWorld project: https://os-world.github.io/
3. xlang-ai, **OSWorld official repository**: https://github.com/xlang-ai/OSWorld
4. xlang-ai, **OSWorld 2.0 official repository**: https://github.com/xlang-ai/OSWorld-V2
