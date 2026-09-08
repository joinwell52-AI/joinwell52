# Q-20260908-02 — Agent Replacement Needs Coordination-Compatibility Evidence, Not Role Matching Alone

- Runtime date: 2026-09-08 (Asia/Shanghai)
- Queue signal: SIG-20260908-004
- Primary research source: https://arxiv.org/html/2609.05279v1
- Evidence level: `peer_reviewed_or_primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`
- Authoritative control-source commit: `3fb9416db906076aa2272477c5b3a4702b82b1dc`
- Generated Reading Prompt: `v1.0.0` / SHA-256 `9ad93d7f4cd7859fc0b32fa9b3b9e2b836a177c889addcc67d0b4fdc3261d7b5`

## Research Question

When a multi-agent team replaces one member with another agent that has the same nominal role and base capability, what evidence is needed to show that the replacement is compatible with the team’s learned coordination conventions rather than merely role-compatible on paper?

## Source-Completeness and Comparison Gate

The complete primary study, **Testing Interchangeability in LLM Agent Teams**, was read across formation protocol, notebook/state design, swap conditions, coordination metrics, task settings, partner-specificity analysis, leadership effects, recovery curves, model/temperature/formation-history ablations, discussion and limitations. The primary source contains designed controlled comparisons among Intact/Placebo/Swap/Swap-cleared/Amnesia/Naive conditions and multiple environments and ablations, satisfying the comparative-evidence gate for this selected primary-research object.

## Scope

The study tests a deceptively simple assumption: if two agents share the same base model and are assigned the same formal role, can one be swapped into another team without meaningful loss?

Teams are independently formed under the same model configuration. Agents carry private notebooks across ten formation episodes. The notebooks are divided into:

- **task notes** — knowledge about the task and environment;
- **partner notes** — knowledge about how a specific teammate behaves, what it does without prompting, which requests need explicit wording, and which handoff conventions have emerged.

After formation, role-matched agents are traded between teams and evaluated on held-out tasks. This design isolates team-specific coordination history from raw model capability more cleanly than a comparison between different model families would.

## Experimental Conditions

The study uses several conditions that make the causal question interpretable:

1. **Intact** — formed team remains unchanged.
2. **Placebo** — the same agent is removed and reinstated, including the roster-change announcement and context reset, controlling for disruption that is not caused by a new teammate.
3. **Swap** — two formed teams exchange role-matched agents; the incoming agent carries its notebooks.
4. **Swap-cleared** — the incoming agent’s old partner-specific notes are removed while task notes are retained.
5. **Amnesia** — no team member is swapped, but existing partner notes are removed.
6. **Naive** — a fresh same-model, same-role agent with an empty notebook replaces the formed member.

The key distinction is that a Swap agent is not less experienced or differently configured. It is experienced in the **wrong team history**.

## Metrics: Outcome and Coordination Cost Are Different

The paper separates task outcome from coordination efficiency.

- `T` is normalized task score.
- `C` is coordination cost: messages per completed subtask in collaborative Overcooked and hints per point in Hanabi.
- `V = Placebo - Naive` estimates the value of team formation.
- `Π = Placebo - Swap` estimates partner-specific residue lost by a role-matched swap.
- `ρ = Π / V` expresses how much formation value is partner-specific; it can exceed 1 if an experienced outsider is worse than a fresh naive replacement.
- `W = Placebo - Amnesia` and `Σ = Swap-cleared - Swap` probe how much partner-specific notebook state contributes.

This metric split is central to the runtime implication. A replacement can preserve a high task score while materially increasing the amount of communication needed to make progress.

## Main Evidence: Role-Matched Swaps Preserve Much Outcome but Raise Cost

Across the reported settings, role-matched replacement generally preserves much of the task score, but communication cost per unit of progress rises by approximately **16–63%**.

In collaborative Overcooked, the excess communication manifests as repeated requests, clarifications, status messages and corrections after failed handoffs. In Hanabi, a swapped agent can be more costly than a naive same-model replacement because it brings expectations formed with another partner while the incumbent team has learned different conventions.

This provides a direct counterexample to a fungibility rule such as:

`same role + same model + same tools => interchangeable worker`

The evidence instead supports:

`role compatibility` and `team coordination compatibility` are separate properties.

## Partner-Specific Knowledge Is Partly Materialized, but Not Fully Localized

The Amnesia condition reproduces a substantial fraction of the swap penalty in the more coupled settings—reported around 81% and 64% in two conditions. This suggests the partner-note state contains real coordination information.

However, deleting the partner section also shortens the context and the notebook headings are experimenter-induced. The study therefore cannot prove that the measured effect is fully localized in those notes. Team-specific conventions may also live in implicit behavior, task habits or the interaction policy itself.

This matters for handoff design: a runtime should not assume that copying one explicit “team memory” document transfers all compatibility state.

## Coupling and Team Age Increase Non-Fungibility

Partner specificity becomes larger as coordination demands rise. Reported `ρ` values increase across the task settings from roughly `0.18` to `0.26` to `0.44`, although the authors correctly treat these values as coarse because there are only four swap pairs per setting.

Formation history also matters. In the reported ablation, extending formation episodes from 5 to 10 to 20 raises `ρ` from roughly `0.17` to `0.27` to `0.41`, while team protocol divergence also rises.

The bounded implication is important: **a team can become less interchangeable as it becomes more experienced together.** Mature collaboration creates useful conventions, but those conventions become hidden dependencies during failover or staffing changes.

## Leadership / Coordination Centrality Changes Replacement Risk

The study finds that replacing the agent occupying a leading or initiating seat produces a disproportionate penalty in the higher-coupling setting. The reported partner-specific penalty is about `7.54` percentage points for the more central seat versus `2.55` for the other seat, and roughly 70% of extra messages are produced by the incumbent agent when the initiator is swapped.

This is a useful diagnostic lesson: **the observable symptoms of an incompatible replacement can appear in the agent that did not change.** The incumbent may send more clarifications or retries because its established assumptions no longer match the newcomer.

A runtime that attributes replacement failure only to the incoming worker can therefore misdiagnose the effect.

## Protocol Signature and Donor-Team Carryover

After a swap, coordination signatures shift toward the incoming agent’s donor team, especially when the newcomer takes the lead. This supports the interpretation that teams develop conventions beyond the formal role label and that an incoming experienced agent can import conventions that are valid elsewhere but mismatched locally.

The Swap-cleared comparison suggests that carrying all prior partner-specific state is not necessarily safer than clearing it. Some inherited state can act as stale coordination context.

For digital-employee staffing, this argues against a generic rule that “more memory is always better at handoff.” Memory should be scoped by **which relationship and team context it is valid for**.

## Recovery: Task Performance Recovers Before Coordination Efficiency

The first episode after replacement retains much of placebo task score—about 98%, 90% and 89% across the reported settings—but coordination cost rises to roughly `1.15×`, `1.48×` and `1.55×` the placebo level.

Task score returns within approximately 1% of baseline by episodes 2, 5 and 6 across the settings. Coordination efficiency recovers more slowly; in Hanabi, communication cost remains about 7% above baseline even at episode 10.

This creates a clear operational boundary:

**“The replacement can still finish the work” is an earlier recovery criterion than “the team has recovered its former coordination efficiency.”**

A runtime health dashboard that watches only task success can close a replacement incident too early.

## Model and Decoder Ablations

The paper tests whether the effect is tied to one backbone. The pattern appears across the reported model settings, though magnitude varies. A representative high-coupling table reports partner specificity around `0.27` for the main GPT-5.6 Luna condition, `0.43` for Gemini 3.7 Flash and `0.20` for Claude Sonnet 5, with different protocol-divergence values.

Decoder freedom also changes the result. Greedy decoding reduces measured partner specificity and protocol divergence relative to the main temperature setting; very high temperature increases divergence, but at the extreme the value of formation itself collapses, making the ratio harder to interpret.

The paper therefore supports a broader mechanism—coordination conventions can emerge under multiple configurations—without establishing one universal penalty magnitude.

## Replacement Admission Suggested by the Evidence

A governed agent replacement or failover should distinguish at least five evidence classes.

### 1. Role / capability compatibility

Can the incoming agent perform the nominal role, use the required tools and satisfy ordinary capability tests?

This is necessary but not sufficient.

### 2. Team-state compatibility

What conventions has the destination team accumulated? Which are explicit and which are only observable in interaction history? Which partner-specific memories belong to the donor team and should not be imported?

### 3. Seat / coordination-centrality evidence

Is the replaced worker an initiator, coordinator, reviewer, dispatcher or other high-dependency seat? Replacement risk can differ even when formal role labels look symmetric.

### 4. Post-swap acceptance metrics

Measure both task outcome and coordination cost. A replacement should not be declared healthy solely because the task still finishes.

### 5. Recovery window and freshness

Observe whether coordination cost converges after the swap. Historical compatibility evidence can become stale as a team develops new conventions.

## Handoff Semantics Suggested by the Evidence

The source supports a bounded handoff principle:

**carry task-valid state forward; re-admit relationship-specific state against the destination team.**

A replacement package should therefore be separable into:

- task/domain knowledge that remains valid regardless of teammate identity;
- destination-team conventions that should be learned or explicitly supplied;
- donor-team partner memories that may need to be cleared, quarantined or relabeled rather than blindly inherited;
- evidence about the exact team version and role seat for which each convention was observed.

This is analogous to configuration scope: a valid value in Workspace A is not automatically authoritative in Workspace B merely because its schema is valid.

## Important Non-Findings

The source does **not** prove:

- that role-matched agents are unusable after replacement; much task performance is preserved;
- that all coordination penalties are stored in explicit partner notes;
- that a naive agent is generally better than an experienced outsider; the Hanabi counterexample demonstrates possibility, not a universal rule;
- that the 16–63% cost range transfers to enterprise digital employees;
- that team-specific memory should always be deleted; the evidence supports scoped handling, not blanket amnesia;
- that protocol-divergence metrics are mature production compatibility tests.

## Evidence Strength

The source is strong for the narrow interchangeability question because the base model is held constant within a team cohort, the placebo condition controls for context reset and roster-change disruption, and multiple counterfactual notebook conditions probe formation state. It measures both outcome and process cost and includes recovery trajectories and ablations.

The strongest evidence is the separation between **functional interchangeability** and **coordination efficiency**, plus the direct observation that formation history creates partner-specific value not represented by a role label.

## Limits and Unknowns

- Teams are dyadic rather than large organizational groups.
- Ten formation episodes are short relative to months-long digital-employee teams; the effect is still increasing in the 20-episode ablation.
- The explicit partner-note structure may amplify or channel team-specific knowledge.
- Amnesia changes context length, so the experiment lacks a fully length-matched neutral-note control.
- Protocol signatures are relatively superficial behavioral measures.
- The relationship between protocol divergence and partner specificity is exploratory with very few aggregate points.
- Benchmark communication costs are not equivalent to enterprise latency, token cost, human interruption or business risk.
- The study does not test authorization transfer, credential transfer, external side effects or crash recovery during a swap.

## Unresolved Questions

1. What destination-team evidence should be packaged when a digital employee is replaced or fails over to another model/host?
2. Which partner-specific memories should be inherited, cleared or revalidated during a handoff?
3. Can coordination-centrality be derived from execution traces rather than manually assigned role labels?
4. What acceptance threshold should combine task success, message cost, latency and error/retry rate after replacement?
5. How long should a replacement remain in a probation/recovery state before becoming the authoritative active worker?
6. How should multi-person teams represent conventions whose validity depends on more than one pairwise relationship?

## Reading Conclusion

The selected evidence supports a bounded conclusion: **role compatibility is not team compatibility.** A same-model, same-role replacement can preserve much task outcome while imposing a substantial coordination tax because the destination team and the incoming agent carry different learned conventions. Team age, coupling and seat centrality change the risk, and task success can recover earlier than coordination efficiency. Replacement and failover therefore need a separate compatibility-and-handoff evidence boundary that identifies destination-team conventions, scopes relationship-specific memory, measures both outcome and coordination cost, and observes recovery after the swap. The result should not be generalized into a universal enterprise penalty, but it is sufficient to reject the assumption that a role label alone proves fungibility.
