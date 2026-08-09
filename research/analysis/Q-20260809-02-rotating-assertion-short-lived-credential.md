---
schema: "research-analysis/v1"
id: "AN-20260809-02"
date: "2026-08-09"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260809-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260809-02-workload-identity-exchange.md"
output_contract: "Research Object"
research_object: "Rotating Assertion to Short-Lived Runtime Credential"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Rotating Assertion to Short-Lived Runtime Credential

## Governed scope

Skill 04 analysis using only the three completed 2026-08-09 Reading Results, with Q-20260809-02 as the primary Industry Architecture object.

## Analysis

```yaml
analysis:
  observations:
    - The implementation reopens a file-backed JWT assertion for each exchange, derives a short-lived ChatGPT access token, caches only the current token in memory and caps accepted lifetime at one hour.
    - Concurrent refreshes are coalesced, proactive refresh may fall back to a still-valid token after transient failure, and token values are redacted from debug output.
    - The selected commit does not prove the broader Queue hypothesis that credentials are stripped from all child-process environments.
  cross_comparison:
    - The deletion/cancellation object separates durable authority from running execution; the identity object applies the same principle by separating external workload identity from ephemeral runtime credentials.
    - The checkpoint object reinforces backward/operational compatibility: rotation only works because the assertion source is reread rather than frozen at process start.
  discussion:
    - The architectural value is not merely token exchange but a trust boundary where durable identity material stays externally rotatable while execution receives bounded credentials.
    - Availability-aware refresh is a deliberate tradeoff: a transient renewal failure does not revoke a still-valid credential, so policy depends on bounded lifetime and federation-side constraints.
    - Child-process isolation must be evidenced independently; exchange and propagation control are separate architecture layers.
  research_judgment:
    - Enterprise agent runtimes should separate workload identity source, exchange authority, short-lived execution credential and downstream propagation policy as distinct controls.
    - Rotation should be pull-based from the authoritative assertion source at exchange time rather than assuming process-start identity remains current.
    - Claims about credential containment must not be inferred from short lifetime alone; child-process and tool boundary propagation requires its own evidence.
  engineering_impact:
    digital_employee:
      - Represent credential source, current lease expiry, refresh state and propagation scope separately in runtime identity state.
    codeflowmu:
      - Prefer short-lived scoped credentials injected at the narrow consumer boundary and redact them from logs/diagnostics.
      - Add explicit tests for child-process environment stripping before claiming a complete credential boundary.
    tmpa:
      - Treat identity lease and propagation authority as research inputs, not a protocol requirement yet.
  limitations:
    - The selected commit establishes exchange behavior, not all downstream integration paths.
    - Least privilege and federation audience/subject checks are not fully visible in this Reading Result.
  future_questions:
    - How should process-local token lease state be fenced after revocation?
    - Which child processes should receive delegated credentials, and how is that delegation audited?
```

## Research judgment

A robust agent identity plane separates a rotatable workload assertion from short-lived runtime credentials and treats propagation to child execution contexts as a separate governed boundary requiring independent evidence.

## Evidence boundary

- `research/reading/Q-20260809-01-conversation-delete-run-cancellation.md`
- `research/reading/Q-20260809-02-workload-identity-exchange.md`
- `research/reading/Q-20260809-03-checkpoint-conformance-migration.md`
