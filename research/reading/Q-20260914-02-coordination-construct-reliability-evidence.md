# Q-20260914-02 — Team Reliability Is a Vector of Coordination Constructs

- Runtime date: 2026-09-14 (Asia/Shanghai)
- Queue signal: SIG-20260914-007
- Primary research source: https://arxiv.org/abs/2608.28266
- Evidence level: `peer_reviewed_or_primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

Can aggregate end-task success establish that a multi-Agent team coordinates reliably, or must reliability be measured separately for allocation, ordering, mutual exclusion and handoff?

## Primary Mechanism

CoCoBench evaluates multi-Agent coordination with executable tasks whose success depends on four distinct coordination constructs: task allocation, sequential ordering, mutual exclusion and handoff. The benchmark contains 897 oracle-validated executable instances and compares 11 leading multimodal models. Instead of treating coordination as one opaque score, it exposes construct-level outcomes so a team can be good at one form of coordination while weak at another.

The constructs correspond to different operational obligations. Allocation asks whether agents divide pending work without wasteful duplication. Ordering asks whether prerequisite-constrained actions occur in a legal sequence. Mutual exclusion asks whether exclusive resources are serialized rather than concurrently contended. Handoff asks whether producer-consumer dependencies transfer work without losing continuity or leaving the receiving agent idle.

## Evaluation Evidence

The primary study reports substantial construct-specific variation across the evaluated models. Strong aggregate task performance does not imply balanced coordination competence. The paper's diagnostics also show why final-state success is too coarse: a team can eventually reach a goal while having violated an ordering constraint, duplicated work, contended for a shared resource or handled a transfer inefficiently along the way.

The benchmark uses executable household activities and a high-level skill interface rather than free-form text-only coordination. Its results therefore have unusually concrete trajectory evidence: allocation choices, prerequisites, resource use and handoffs can be checked against an executable environment and oracle-defined task structure.

The study further reports that centralized state aggregation is important, while simple communication only partially closes coordination gaps. It also finds degradation as team size grows and evidence that, under the high-level skill interface, symbolic team-level planning rather than visual perception alone is a major bottleneck. Those observations strengthen the case for measuring coordination structure directly rather than attributing every failure to model intelligence in the abstract.

## Why Aggregate Success Is Insufficient

A scalar end-task metric merges failure modes with very different operational consequences. Duplicate allocation primarily wastes capacity; ordering violations can invalidate dependent work; mutual-exclusion failures can corrupt shared resources; handoff failures can strand responsibility between agents. A single success percentage cannot tell an operator which contract failed or what recovery is safe.

A governed runtime therefore needs to distinguish at least:

1. **ownership allocation evidence** — who owns each unit of work;
2. **ordering evidence** — which prerequisite relations were respected;
3. **exclusion evidence** — which shared resources had exclusive-use constraints and whether they were honored;
4. **handoff evidence** — when responsibility or produced state moved between agents and whether the receiver accepted it.

## Failure Case

Consider a team that completes a report after two agents independently research the same source, a third begins synthesis before required evidence is ready, and a final handoff is repaired manually. The final artifact can still be correct. If evaluation records only artifact success, the system appears reliable even though its allocation, ordering and handoff contracts are weak. The same latent weaknesses can become costly or unsafe when the shared object is a production database, credential or customer action rather than a document.

## Evidence Classes

### Fact

CoCoBench contains 897 oracle-validated executable tasks and explicitly separates allocation, ordering, mutual exclusion and handoff coordination across 11 evaluated multimodal models.

### Research Result

The reported results show construct-specific competence and demonstrate that aggregate task success can conceal uneven coordination behavior. Team-size and coordination-interface experiments further indicate that coordination quality is not reducible to a single end-state metric.

### Inference

Production multi-Agent systems should represent team reliability as a vector of separately evidenced coordination obligations rather than one scalar success score. Runtime audit records should preserve the event identities needed to attribute violations to a construct.

### Unknown

The study does not establish that the measured household-task distributions transfer quantitatively to software engineering, enterprise workflows or long-lived digital employees. It also does not decide which coordination violations should be recoverable versus terminal in those domains.

## Limits and Negative Evidence

- The environment is an executable household-task setting, not an enterprise production system.
- High-level skills reduce some low-level action noise; results therefore should not be generalized to every tool interface.
- Oracle validation strengthens benchmark truth but does not prove that real organizational goals or authorizations are correctly specified.
- Better coordination scores do not establish business correctness, safety or authorization of the underlying task.
- Construct labels help attribution but do not by themselves identify the responsible human, model, scheduler or protocol layer.

## Unresolved Questions

1. What minimal event schema lets a runtime score allocation, ordering, exclusion and handoff independently after execution?
2. Which constructs should be enforced deterministically when all relevant facts are observable, and which still require semantic judgment?
3. How should reliability be aggregated without allowing a strong construct to hide a weak safety-critical one?
4. How should team-size scaling tests be incorporated into admission for long-lived digital-employee teams?
5. Can the same construct model explain coordination failures across software, research and business-operation teams?

## Reading Conclusion

The evidence supports a bounded conclusion: **multi-Agent reliability is not one number; it is a set of coordination competencies that must be measured separately**. Allocation, ordering, mutual exclusion and handoff have different failure semantics, and final task success can hide violations inside the trajectory. Production evaluation should preserve construct-level evidence before inferring that a team is reliable.

This Reading Note performs evidence extraction only. It does not execute Research Analysis, article writing, visualization, Production or Publication.
