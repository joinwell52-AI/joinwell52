# Q-20260827-01 — Runner Process Readiness as Externally Visible Runtime Truth

- Runtime date: 2026-08-27 (Asia/Shanghai)
- Queue signal: SIG-20260827-004
- Primary source: https://github.com/anthropics/claude-code/releases/tag/v2.1.247
- Evidence level: `official_release_note`
- Scope: Claude Code self-hosted runner session state, agent-process readiness, and downstream desktop notification behavior

## Problem

A control plane can know that a session has been scheduled before the execution process that can actually serve the session exists. If that scheduling state is exposed as `running`, downstream clients may treat intent as executable reality and trigger behavior that assumes an active worker.

## Facts

Anthropic's official Claude Code v2.1.247 release notes state that self-hosted runner sessions previously reported `running` before Claude Code had started. The same release note identifies a concrete downstream effect: the Claude desktop app could emit a premature “Claude is waiting for your input” notification.

The fix is described as preventing that premature `running` report. This establishes a demonstrated ordering constraint: the externally visible Running state must no longer precede Claude Code process startup for the affected self-hosted-runner session path.

The public release note does **not** disclose the exact internal readiness primitive used after the fix. It does not say whether readiness is gated by process spawn success, IPC establishment, a protocol handshake, first heartbeat, first event, or another signal. It also does not publish the exact startup-failure state transition or a regression-test identifier.

## Vendor Claims

Anthropic claims the affected self-hosted runner session no longer reports `running` before Claude Code has started. The documented symptom and downstream effect support a bounded runtime-truth claim: the fixed state publication is ordered after actual process startup rather than merely after scheduling/registration intent.

## Mechanisms

1. **State-publication ordering:** the demonstrated fix delays the affected `running` publication until after Claude Code startup rather than publishing it during an earlier runner/session setup phase.
2. **Downstream semantic coupling:** the desktop app interprets the session's `running` state strongly enough to derive a user-facing waiting notification, so a premature state is observably harmful rather than cosmetic.
3. **Readiness/truth separation:** scheduling or runner registration may exist before executable readiness, but the public evidence only proves that the affected `running` state must not cross that boundary early.
4. **Fail-closed interpretation of undisclosed details:** because the release note does not identify the precise readiness signal, this Reading Note does not infer one.

## Evidence

Primary evidence is the official Anthropic Claude Code v2.1.247 release, published 2026-08-26. It explicitly records the pre-fix ordering defect and its premature desktop notification consequence.

The evidence is strong for the observable contract and weak for internal implementation details: the release artifact is authoritative about the bug/fix but does not expose source-level runner readiness code or test cases.

## Limitations

This does not prove that every Claude Code session state is process-backed, nor that every self-hosted-runner lifecycle transition waits for a protocol-level health check.

“Claude Code had started” is the strongest readiness boundary disclosed publicly. It should not be silently upgraded to “fully initialized,” “ready to accept all work,” “healthy,” or “first heartbeat received.”

The public evidence does not disclose how startup failure is represented, whether retries occur before a terminal state, or whether a process that starts and immediately dies can briefly become `running`.

No public regression test or code path was identified in the selected source, so test-level claims remain unknown.

## Comparisons

A scheduler-intent model can mark a unit Running when it has been assigned. The fixed runner behavior demonstrates a stricter externally visible truth model for this path: a client-facing Running signal must at least wait for the actual Claude Code process to start. This is analogous to separating `scheduled`/`claimed` from `ready-to-execute`, but the release note does not define those names as formal Claude Code states.

## Unresolved Questions

- What exact event now gates `running`: successful spawn, IPC/transport connection, handshake, first agent event, or another readiness signal?
- What externally visible state is used when the Claude Code process fails to start?
- Is there a bounded startup timeout and, if so, which state closes the session after timeout?
- What automated regression test protects the ordering between process startup and state publication?
- Can a process that starts successfully but fails during initialization still momentarily satisfy the new gate?

## Reading Conclusion

Claude Code v2.1.247 provides a concrete counterexample to treating scheduling intent as runtime truth: a self-hosted runner could say `running` before the executable Claude Code process existed, and the desktop client acted on that false state. The fix establishes a bounded ordering guarantee that the affected `running` publication no longer precedes Claude Code startup. The exact readiness primitive, startup-failure mapping and regression implementation are not disclosed and therefore remain unknown.
