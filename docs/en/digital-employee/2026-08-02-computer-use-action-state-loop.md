---
title: Digital Employee Daily 003 — Computer Use Requires an Observable Action–State Loop
date: '2026-08-02'
column: digital-employee
category: daily
summary: OpenAI and Anthropic computer-use guidance shows that reliable GUI work depends on an external harness that observes state, executes bounded actions, captures evidence, and verifies the resulting state.
sources:
  - OpenAI Computer use guide
  - Anthropic Computer use tool documentation
outline: deep
---

<ArticleCover
  image="/assets/covers/computer-use-action-state-loop-cover-v2.jpg"
  kicker="Digital Employee · Daily 003"
  title="Computer Use Requires an Observable Action–State Loop"
  summary="A model does not complete GUI work by intention alone; a governed harness must observe, act, capture, approve, and verify."
  version="DD003"
  status="Production Test V1 · 2026-08-02"
  languageHref="/zh/digital-employee/2026-08-02-computer-use-action-state-loop"
  languageLabel="简体中文"
/>

## Summary

Computer use is often described as an Agent “operating a browser” or “using a desktop.” The official implementation guidance from OpenAI and Anthropic describes a more precise system.

The model interprets a visual state and proposes an action. An application-controlled harness executes that action in a browser, virtual machine, or desktop environment, captures the next state, and sends it back to the model. This repeats until the work reaches a completion condition or a policy gate requires human authority.

The Research Center judgment is:

> A computer-using Digital Employee is not a model with mouse access. It is an observable action–state loop governed by an external runtime, explicit authority, evidence capture, and final-state verification.

This distinction matters because organizational work is completed by a change in business state, not by the model saying that it clicked the right button.

## Source

### Selected primary material

1. **OpenAI Computer use guide** — selected because it defines the common harness shapes, screenshot/action cycle, isolated execution environment, treatment of page content as untrusted input, and human approval for high-impact actions.
2. **Anthropic Computer use tool documentation** — selected because it separates the model-facing tool from the developer-provided environment and agent loop, and documents isolation, minimal privilege, allowlisting, prompt-injection risk, and confirmation for consequential actions.

Both are provider documents. They explain supported mechanisms and recommended safeguards. They are not independent evidence that every GUI task is reliable, safe, or economically suitable for unattended production.

## Observation

### 1. The model proposes; the harness executes

In both implementations, the model does not directly control an operating system. It returns structured actions such as click, type, scroll, key press, or screenshot request. Developer-controlled code interprets those actions and applies them to an environment.

This creates a clear technical boundary:

```text
Model reasoning
    ↓ proposed action
Execution harness
    ↓ controlled operation
Browser / desktop / application
    ↓ resulting state
Screenshot or structured observation
    ↺ back to model
```

*Diagram: joinwell52 Research Center synthesis from the OpenAI and Anthropic computer-use documentation.*

The runtime therefore owns execution semantics, environment isolation, credentials, network reachability, timeouts, and evidence capture.

### 2. Every action depends on a fresh state

The normal loop is not “generate a long script and hope it works.” The system repeatedly captures the current interface, asks for the next action, executes it, and returns an updated screenshot or observation.

This is necessary because interfaces are stateful and non-deterministic. A click may open a dialog, trigger validation, fail silently, change navigation, or expose a new security boundary. The next action should be based on the observed result rather than the intended result.

### 3. Security belongs in the runtime boundary

The two providers converge on similar safeguards:

- use an isolated browser, container, or virtual machine;
- minimize inherited environment variables and host access;
- constrain sites, accounts, tools, and actions;
- treat interface content as potentially untrusted;
- keep humans in the loop for purchases, authentication, destructive changes, or other hard-to-reverse actions;
- avoid giving the model unrestricted access to sensitive data or credentials.

These are not prompt-writing concerns alone. They require enforceable runtime controls.

### 4. Completion cannot be inferred from the last click

A click is an attempted operation, not proof of a completed business outcome. The system must inspect the resulting state: confirmation number, updated record, changed status, generated file, successful search result, or another application-specific condition.

A Digital Employee runtime therefore needs a verifier that is independent of the model’s narrative.

## Discussion

### The minimum computer-operation record

Each GUI operation should produce a durable record:

```yaml
computer_operation:
  work_order_ref:
  step_id:
  actor_ref:
  authority_snapshot_ref:
  pre_state_ref:
  proposed_action:
  policy_decision:
  human_approval_ref:
  execution_result:
  post_state_ref:
  evidence_refs:
  validator_result:
  next_state:
```

This does not require storing every screenshot forever. Retention can follow risk and privacy policy. What matters is that the system can prove which state was observed, which action was authorized, what actually happened, and why the workflow advanced.

### Action, state, and evidence are different facts

| Runtime fact | Question answered | Typical evidence |
|---|---|---|
| Proposed action | What did the model request? | Structured tool call |
| Authorized action | Was the request allowed? | Policy and approval event |
| Executed action | What did the harness attempt? | Runtime event and return code |
| Resulting state | What did the application become? | Screenshot, DOM fact, API readback, file hash |
| Completion judgment | Did the WorkOrder outcome hold? | Task-specific validator |

*Table: joinwell52 Research Center synthesis.*

Conflating these facts creates false success. A tool call may be valid but not executed; execution may succeed technically but produce the wrong state; the desired state may appear temporarily but fail persistence or later validation.

### A Digital Employee is not a scraper

A scraper extracts data from a predetermined page structure. A Digital Employee performs a governed sequence of operations inside an organizational role: open an application, authenticate through an approved path, locate a record, enter or review data, respond to interface state, escalate exceptions, and prove completion.

Programmatic APIs remain preferable when they are stable, authorized, and sufficient. Computer use is valuable where work is only available through human-facing software or where visual context matters. The runtime should choose the lowest-risk suitable channel rather than treating GUI control as a universal replacement for APIs.

### Human authority is a workflow node

Approval should not be an informal interruption. The workflow should enter an explicit state such as `waiting_human_authority`, preserve the proposed action and visible context, identify the approving role, and resume only with a durable decision.

This turns “human in the loop” from a product slogan into an auditable state transition.

## Engineering Impact

### TMPA

This note does not edit a TMPA publication. It provides research evidence for explicit Event, Authority, Lifecycle, Evidence, and Integrity references around external actions. A deterministic reconstruction should distinguish proposed action, permitted action, execution event, observed state, and completion judgment.

### Digital Employee

Computer Operation should become a first-class Work Runtime node with:

1. a bounded application and account context;
2. pre-action state capture;
3. structured action proposal;
4. enforceable policy and approval gates;
5. post-action state capture;
6. task-specific completion validation;
7. exception, retry, and escalation states;
8. privacy-aware evidence retention.

The Position definition should state which applications and action classes the Digital Employee may use without approval.

### CodeFlowMu

CodeFlowMu should treat computer use as a governed runtime adapter, not as unrestricted browser automation. A safe implementation path is:

```text
WorkOrder
→ Operation node
→ Computer-use adapter
→ isolated browser/desktop
→ evidence event
→ validator
→ QA or human gate
→ completion
```

The first validation case should use a controlled local application with known initial states and executable validators. The runtime should log every state transition and prove that a resumed session does not duplicate a consequential action.

## Future Work

1. Define the Computer Operation contract and allowed action taxonomy.
2. Build a controlled local benchmark with login, search, form entry, confirmation, error, and recovery cases.
3. Compare screenshot-only evidence with DOM, API readback, and business-record validation.
4. Define which actions require Position-level pre-authorization and which require per-run human approval.
5. Test checkpoint and resume behavior after browser, network, and model failures.
6. Measure task success by final state, not by the number of completed clicks.

## References

1. OpenAI, **Computer use**: https://developers.openai.com/api/docs/guides/tools-computer-use
2. Anthropic, **Computer use tool**: https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool
