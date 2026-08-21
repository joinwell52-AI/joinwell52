# Q-20260821-02 — Approval authority cannot be inferred from A2A transport metadata

- Runtime date: 2026-08-21
- Column: Industry Architecture
- Source object: Q-20260821-02
- Primary source: https://github.com/google/adk-python/commit/9a32eba1e271981fd079bdee489b9159c6ecc72a
- Supporting primary issue: https://github.com/google/adk-python/issues/6461
- Reverted PR for comparison: https://github.com/google/adk-python/pull/6462
- Evidence class: Fact for merged code/tests and current issue state; maintainer/reporter claim where explicitly labeled; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

Google ADK's human-in-the-loop tool confirmation is represented as a user-authored function response. A reported confused-deputy path showed that inbound A2A content is also converted into user-role content, so transport-originated data can satisfy a check intended to represent a human operator. A previous mitigation rejected confirmations whenever A2A metadata was present, but that transport-based guard blocked legitimate operator confirmations when A2A was the route to the operator and still did not protect other unauthenticated ingress paths. The selected commit reverts that guard and explicitly reopens the underlying trust problem.

## Facts

1. The selected merged commit is an explicit revert of the A2A transport guard introduced to address issue #6461.
2. The commit message states that the A2A request converter had been changed to stamp `a2a_metadata` on every inbound A2A invocation and that the confirmation processor returned early whenever that marker was present.
3. The revert changes the request converter back to adding `a2a_metadata` only when the inbound request actually contains non-empty metadata. Empty A2A metadata no longer creates the marker.
4. The revert removes `_A2A_METADATA_KEY` from `request_confirmation.py` and deletes the early-return branch that ignored all confirmation responses whenever A2A metadata was present.
5. The revert deletes regression tests whose expected behavior was to ignore confirmations arriving over A2A, both with protocol metadata and with no metadata.
6. The original issue reports that the confirmation trust check accepts an event whose `author == "user"`, while inbound A2A messages are converted to user-role turns; this lets an A2A peer construct a confirmation-shaped function response for a pending confirmation call.
7. The issue also reports that the same confirmation can be supplied through `/run` or `/run_sse` when those endpoints are exposed without authentication by default. This is part of the reporter's demonstrated threat model and is repeated in the revert commit rationale.
8. The reverted PR #6462 attempted to refuse `adk_request_confirmation` approvals on A2A-originated invocations by checking `run_config.custom_metadata['a2a_metadata']`; its stated non-goal was the unauthenticated API-server path.
9. During review of that prior mitigation, a maintainer pointed out that the marker originally existed only when request metadata was non-empty and asked for the marker to become unconditional. The PR was changed so even empty metadata produced the A2A marker, and tests were added for that case.
10. A later maintainer comment confirms that the unconditional marker and presence-based guard had been verified, but says the team was looking further into the issue.
11. The selected revert removes that unconditional marker behavior and the confirmation guard. A subsequent maintainer comment on issue #6461 explicitly states that the issue is reopened because the PR was reverted.
12. The selected commit characterizes transport gating as both overbroad and insufficient: overbroad because legitimate human confirmation may arrive through the A2A-served agent path; insufficient because the same approval shape can arrive through a different ingress such as an unauthenticated HTTP endpoint.
13. The selected commit does not add a replacement principal-authentication mechanism. No new field, signature, credential, operator identifier, or verifier is introduced in the shown confirmation path.
14. Therefore, at this selected commit, the approving principal's independently authenticated identity is not established by the new code. The commit diagnoses that this is the correct trust object but leaves the implementation gap unresolved.

## Maintainer and reporter claims

The reporter describes a confused-deputy vulnerability in which an A2A peer can supply the same confirmation-shaped response expected from a human operator, because the system's semantic distinction between peer and operator is not represented by the existing user-author check. The earlier PR claims that rejecting A2A-originated confirmation closes the A2A peer vector while leaving the normal local operator path intact, but explicitly does not address an unauthenticated API caller.

The selected revert's maintainer rationale is stronger architecturally: rejecting based on transport metadata conflates channel with principal. It can reject a legitimate operator whose action traverses A2A, yet cannot reject a non-operator using another accepted channel. The issue is therefore reopened rather than declared solved.

## Mechanisms

### The reverted mechanism: transport-origin marker as trust proxy

The prior mitigation used `a2a_metadata` as a proxy for the identity of the actor who supplied a confirmation. Review hardened the proxy by making the marker unconditional for A2A requests, including an empty metadata dictionary. The confirmation processor then refused all confirmations whenever the marker existed.

This was mechanically simple and testable, but the proxy answered the wrong question. It identified a transport route, not the approving principal.

### The selected revert: restore functional confirmation flow

The selected change removes the A2A-marker early return from the confirmation processor. This restores the ability of an A2A-served agent to process a legitimate confirmation that arrives through that route. It also returns request metadata handling to a data-carrier role: empty protocol metadata does not create a synthetic `a2a_metadata` entry.

### Reopen rather than silently weaken

The commit message explicitly reopens #6461, and the issue is currently marked open/reopened. This is an important governance signal: functionality is restored by removing a defective guard, but the underlying authorization problem remains visible rather than being treated as resolved.

### Required but absent mechanism: principal-bound approval

The selected commit identifies the missing architectural property but does not implement it. A robust approval decision needs evidence that the actor approving the pending call is the operator authorized for that decision, independent of whether the message arrived by A2A, HTTP, a local UI, or another transport. No such principal-binding evidence is added here.

## Evidence

- `src/google/adk/a2a/converters/request_converter.py` changes from unconditional A2A marker insertion back to conditional insertion only when request metadata is non-empty.
- `src/google/adk/flows/llm_flows/request_confirmation.py` removes the branch that returns early solely because `_A2A_METADATA_KEY` is present.
- Tests asserting that A2A confirmations are ignored, including the empty-metadata variant, are deleted in the revert.
- Issue #6461 describes the user-author check, A2A conversion to user-role content, the confirmation-shaped function response, and the additional HTTP ingress concern.
- PR #6462 documents the prior transport-based mitigation and explicitly labels unauthenticated API ingress as out of scope.
- Maintainer review comments show the prior marker was hardened to cover empty metadata before the team later reverted the approach.
- A maintainer comment after the selected commit explicitly reopens #6461 because the prior fix was reverted.

## Limitations

1. The selected commit is a revert, not a replacement security fix. It should not be described as solving A2A authentication or HITL authorization.
2. Issue #6461 contains a reporter's security analysis and reproduction description; those claims are primary issue evidence, but this Reading did not independently execute the exploit.
3. The commit message repeats that `/run` and `/run_sse` are unauthenticated by default. That is a maintainer-stated rationale here, not an independent deployment audit of every ADK configuration.
4. The exact operator identity available at approval time is not exposed by this commit. The evidence demonstrates a missing principal-binding mechanism rather than a completed one.
5. The revert re-enables legitimate confirmation flow through A2A but necessarily also removes the prior A2A-specific rejection. The residual risk is intentionally left open.
6. The evidence does not establish which authentication design the maintainers will adopt next: session-bound operator identity, channel authentication, signed approval capability, server authentication, or another approach.
7. `author == "user"` is described as the current trust check by the issue and PR. The selected diff does not redesign that semantic identity model.
8. The transport distinction may still be useful as contextual risk evidence; the failure here is using it as the sole authorization criterion.

## Comparisons

- **Original behavior:** confirmation acceptance relies on user-shaped event semantics; A2A conversion can produce the same semantic role.
- **Reverted mitigation:** every A2A invocation is marked and any confirmation on that transport is rejected. This closes one route in the proposed threat model but blocks legitimate operator approval over the same transport and leaves other ingress routes.
- **Selected state:** the transport guard is removed, legitimate flow is restored, and the security issue is explicitly reopened. There is no replacement principal-bound check in the selected commit.
- A principal-bound design would make the authorization decision from authenticated actor evidence and the pending approval's policy, with transport only as supporting context. That architecture is a requirement inferred from the failure mode and explicitly named by the revert rationale, not an implementation demonstrated here.

## Unresolved questions

1. What durable identifier represents the human operator or approving principal in ADK across local UI, A2A, API and hosted deployments?
2. How can an approval response be cryptographically or session-bound to that principal and to the exact pending tool call?
3. Should the pending confirmation carry an unforgeable nonce/capability that only an authorized operator channel can redeem?
4. Which ADK server deployments authenticate `/run` and `/run_sse`, and what production guidance will make that boundary explicit?
5. How should A2A peer identity be authenticated and propagated without treating transport metadata itself as authority?
6. Can an intermediary legitimately relay a human operator approval while retaining end-to-end attribution to the operator?
7. What regression matrix should cover A2A, local UI, authenticated HTTP, unauthenticated HTTP, forged user-role events and legitimate relayed approvals?
8. Until a replacement is merged, which tools or deployments should treat require-confirmation as insufficient protection against remote callers?

## Reading boundary

This note establishes that Google ADK deliberately reverted an A2A-transport-based HITL confirmation guard because it rejected legitimate approvals carried over A2A while failing to protect equivalent approvals arriving over other ingress paths. The underlying issue is explicitly reopened, and the selected commit adds no replacement mechanism that authenticates or binds the approving principal. The evidence therefore supports the architectural conclusion that transport provenance alone is not authorization, but it does not support a claim that A2A authentication, human authorization, or the reported vulnerability is solved. Those broader risk and design judgments belong to Skill 04 Analysis.
