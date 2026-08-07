---
schema: "research-analysis/v1"
id: "AN-20260807-02"
date: "2026-08-07"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260807-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260807-02-agentic-workflow-server-architecture.md"
output_contract: "Research Object"
research_object: "Role-Aware Heterogeneous Agent Resource Plane"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Role-Aware Heterogeneous Agent Resource Plane

## Governed scope

This object consumes only the completed Reading Result for `Q-20260807-02`. It performs Skill 04 Research Analysis and produces a Production-ready Research Object. It does not introduce unread material, prescribe a complete production scheduler, draft publication copy, or authorize release.

## Analysis

```yaml
analysis:
  observations:
    - The Reading Result shows agentic requests repeatedly alternating among GPU inference, scheduler/orchestrator control work and bursty tool execution rather than behaving like one monolithic model-serving request.
    - Low average CPU and GPU utilization coexists with critical-path burst saturation, involuntary context switching and strong tail-latency effects, so utilization averages alone do not identify safe reclaimable capacity.
    - Scheduler/orchestrator and runner roles have materially different latency and throughput profiles; Agora therefore isolates control pools and allows reclaiming primarily from runner capacity.
    - GPU consolidation and harvesting are workload-dependent: Owl benefits at high load, while aggressive GPU removal is severely harmful for parallel CORAL; CPU isolation also has a non-monotonic optimum because fully private cores remove useful slack.
    - Host-visible graph and tool-type hints improve proactive resource control, but model-orchestrated workflows cannot expose the same future structure before inference resolves the next action.
  cross_comparison:
    - Compared with the same-day Argus Reading Result, both systems reject uniform treatment of roles: Argus varies authority and review by role/risk, while Agora varies compute isolation and reclaiming by role/workload signature.
    - Compared with the same-day deferred-provisioning Reading Result, both systems need typed boundaries around shared resources; one distinguishes control and runner pools, the other distinguishes ordinary and provisioned environments under one stable identity map.
    - All three same-day Reading Results separate a stable logical object from transient execution conditions: a campaign from model sessions, an agentic workflow from changing CPU/GPU placement, and an environment identity from Pending/Ready/Failed provisioning state.
    - The negative operating points in this Reading Result are especially important because they show that an optimization policy can cross from efficient consolidation into catastrophic contention without any change in average utilization semantics.
  discussion:
    - The structurally important change is moving resource scheduling from model-serving units to workflow-role and execution-shape units. The resource plane must understand which work is control-path latency sensitive, which is bursty tool work and which GPU roles can safely collocate.
    - The causal mechanism supported by the Reading Result is not simply higher utilization: isolation protects control paths, bounded runner pools improve locality, consolidation reduces stranded capacity, and retreat policies prevent reclaiming from remaining on the critical path after contention appears.
    - This implies an online control loop rather than one static packing rule. Safe harvesting requires a signal for workload phase, concurrency and role overlap, plus a retreat threshold when tail latency or runner contention crosses a limit.
    - Business priority, credentials and tenant isolation are orthogonal to CPU/GPU efficiency. A production Agent platform must combine resource-role scheduling with policy boundaries rather than assuming that collocation is permissible whenever microarchitecturally efficient.
    - For SMEs, the reusable pattern is not reproducing the Azure server or MILP; it is separating control-plane cores, tool-runner capacity and inference capacity, then measuring a small number of workload signatures before allowing adaptive reclaiming.
  research_judgment:
    - Production agent infrastructure should schedule heterogeneous workflow roles, not only model requests: control-path orchestration, tool runners and inference services require distinct resource classes and latency objectives.
    - Capacity reclaiming should be adaptive and reversible, with explicit negative-operating-point detection; average idle percentage must never be used as the sole signal for CPU or GPU harvesting.
    - Resource placement policy should combine role signature, concurrency shape and future-work visibility; model-orchestrated workflows need more conservative reactive policies when host-side graph hints are unavailable.
    - Efficiency policy and trust policy must remain separate gates: a placement that is computationally efficient is not automatically valid across tenant, credential, sandbox or business-priority boundaries.
  uncertainty:
    - Confidence is high that role-aware CPU separation and burst-aware scheduling are structurally relevant because both production traces and controlled experiments show host work on the critical path.
    - Confidence is medium that the exact pooling and harvesting gains transfer across hardware generations, distributed deployments and different agent frameworks because the controlled study uses one disclosed server and four frameworks.
    - Confidence is low that any fixed online threshold can generalize without new measurements, especially for model-orchestrated workflows whose future tool mix is not host-visible.
  counter_evidence:
    - GPU harvesting that improves Owl becomes severely harmful for CORAL at high load, showing that one global reclaiming rule is unsafe.
    - Fully private task cores slightly worsen batch completion despite stronger isolation, so maximal separation is not the optimum.
    - Headline low-load CPU-harvesting results are materially weaker at high load, limiting any load-independent interpretation of the aggregate efficiency claim.
    - The study measures infrastructure behavior, not governance correctness, agent answer quality, business success or security isolation; those properties cannot be inferred from resource-efficiency gains.
  engineering_impact:
    tmpa:
      - No TMPA Core change is justified by the infrastructure Reading Result.
      - Resource-role and workload-shape metadata may later become implementation-profile inputs, but they should not be promoted to protocol semantics without repeated Runtime evidence.
    digital_employee:
      - Digital Employee execution should expose role class, latency sensitivity, tool-burst profile, concurrency shape and trust/credential boundary as separate scheduling inputs.
      - Long-running work should allow the resource controller to retreat from harvesting or consolidation when tool bursts, tail latency or contention indicate a new operating regime.
      - Model-orchestrated work should be treated as lower-predictability scheduling input because future tools and branches are not known before inference.
      - Business priority and deadline policy should overlay resource optimization so scarce capacity is allocated by consequence as well as throughput.
    codeflowmu:
      - Keep PM/QA/control-path services isolated from opportunistic worker/tool capacity before attempting aggressive host utilization improvements.
      - Add workload telemetry that distinguishes control, inference and tool-runner time instead of reporting only process-wide CPU/GPU averages.
      - Implement bounded, reversible worker-capacity reclaiming with explicit retreat reasons and observable threshold crossings.
      - Do not collocate workers across sandbox, credential or tenant boundaries merely because a resource profiler predicts spare capacity.
  limitations:
    - The analysis is bounded to the completed Reading Result and does not independently reproduce the Azure trace or controlled experiments.
    - The production trace covers one reported 24-hour window and the controlled server uses one CPU/GPU configuration.
    - The exact 10.3-core control demand, pooling widths and harvesting thresholds are empirical operating points rather than portable constants.
    - Multi-machine serving, external services, security boundaries and business-priority scheduling are not established by the Reading Result.
  future_questions:
    - What minimum runtime telemetry can classify control, runner and inference phases reliably enough for adaptive scheduling without adding high instrumentation cost?
    - Which online signal can detect a transition into a CORAL-like contention regime before tail latency collapses?
    - How should trust, credentials, tenant isolation and business priority constrain otherwise efficient CPU/GPU collocation decisions?
    - What scheduling policy works when orchestration is model-driven and the runtime cannot know the next tool or branch in advance?
```

## Research judgment

The Production-relevant object is:

> Treat production agent compute as a role-aware heterogeneous resource plane: isolate latency-sensitive control paths, measure bursty runner and inference behavior separately, reclaim capacity only with reversible adaptive policies, and keep security/business placement constraints independent from efficiency decisions.

This is an inference from the completed Reading Result and remains bounded by the one-day production window, one-server controlled study and explicitly harmful operating points.

## Production input

Production may consume this Research Object to explain why agent infrastructure needs role-aware CPU-GPU scheduling. It must preserve the harmful CORAL GPU-harvesting result, the non-monotonic CPU-isolation result, the difference between host-visible and model-driven orchestration, and the fact that infrastructure efficiency does not establish governance or security correctness.

## Evidence boundary

- `research/reading/Q-20260807-02-agentic-workflow-server-architecture.md`

No other source was consumed by this Analysis object.
