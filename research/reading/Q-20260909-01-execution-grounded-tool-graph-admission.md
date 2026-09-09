# Q-20260909-01 — Tool Compatibility Needs Execution-Grounded Evidence, Not Schema Plausibility Alone

- Runtime date: 2026-09-09 (Asia/Shanghai)
- Queue signal: SIG-20260909-006
- Primary research source: https://arxiv.org/html/2609.05395v1
- Evidence level: `peer_reviewed_or_primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

When a digital employee or agent runtime wants to compose tools into a reusable multi-step capability graph, what evidence is needed before treating one tool's output as a usable input to another tool, and what does successful execution actually prove?

## Problem

Tool schemas make composition look easier than it is. Two fields can appear type-compatible, an LLM can judge the mapping plausible, and both tools can be individually valid, while the composed call still fails against the live service. The selected KOPA-Bench/EDGE study is useful because it separates **schema-level or model-judged plausibility** from **execution-grounded viability** over real public APIs.

The distinction matters for long-lived digital employees. A runtime may cache a tool graph, reuse an MCP capability, or transfer a learned plan across sessions. If an edge is admitted because names and schemas merely look compatible, the runtime can silently convert an unverified hypothesis into apparent capability. But the opposite overclaim is also unsafe: one successful call does not prove that the composition is universally valid, authorized, side-effect-safe or stable over time.

## Evidence Base

The primary study introduces KOPA-Bench and EDGE. KOPA-Bench contains **145 expert-authored tasks** across **10 Korean public API platforms and six domains**, backed by **2,318 live tools** exposed as MCP functions. A task requires about five tool calls on average and up to 14, and 59% of tasks include parallel calls. The authors report expert review plus executable golden-trajectory verification; seven task-construction errors were found and corrected before the benchmark was frozen.

EDGE is a data-synthesis pipeline built around a dynamic tool-dependency graph. Its first phase proposes and tests output-to-input bindings across the tool inventory; its second phase traverses the refined graph to produce executable training trajectories with sequential, fan-out, derived, parallel, comparison and conditional structures.

The public EDGE-KOPA repository currently exposes the paper-facing README and licenses, but the README states that KOPA-Bench, the EDGE corpus and fine-tuned checkpoints are still "coming soon." At the time of this Reading run, the linked repository therefore does not yet expose the complete benchmark/data/code package needed to independently reproduce the reported pipeline end to end. The paper remains strong primary research evidence, but current public implementation reproducibility is incomplete.

## What an EDGE Actually Means

A dependency edge represents a proposed binding from an output field of one tool to an input argument of another tool. EDGE does **not** begin by executing every possible pair. It first narrows the combinatorial space using retrieval and an LLM feasibility judgment. A candidate enters the initial skeleton if the model-derived feasibility score clears the configured threshold, and the edge receives a deliberately weak Beta prior.

Live execution then supplies evidence. The pipeline samples paths, calls the real APIs and updates edge posteriors from observed successes and failures. Structural failures such as schema mismatches or missing fields are penalized strongly; environmental failures such as rate limits, timeouts, server errors or authorization failures are penalized weakly so that transient service conditions do not immediately destroy a semantically valid binding.

An edge is pruned only after accumulating enough evidence and falling below the viability confidence criterion. This is an important correction to a simple binary reading of the Queue signal: **EDGE does not require one live success before an edge can enter the graph.** Skeleton admission is still model-judged; execution progressively changes the confidence attached to that hypothesis. The final graph is therefore execution-grounded, not equivalent to a set of edges individually proven by a single successful call.

## Controlled Evidence That Execution Changes the Graph

The paper provides a useful controlled comparison because the initial and refined edge sets originate from the same candidate-generation process. The initial skeleton executes successfully **50.2%** of the time, while the converged graph reaches **62.7%**. Edges that are pruned later execute only **14.8%** of the time. Among the pruned set, **70.5%** never succeed, compared with **27.7%** of retained edges; retained zero-success edges are concentrated among under-explored cases with relatively few trials.

Across 100 Phase-A iterations, sampled trajectory pass rate rises by roughly 31 percentage points and step success by roughly 28 points. The execution signal can also overturn the language-model prior: high-prior edges may still be removed after repeated failed execution, which is exactly what a weak prior is intended to permit.

This supports a bounded claim stronger than “schemas are noisy”: **execution supplies information that model judgment and interface descriptions do not contain.** It does not establish that the learned graph is immutable or universally valid.

## One-to-Many Outputs Are a First-Class Composition Problem

Real public APIs frequently return collections rather than one scalar suitable for direct chaining. The study reports that **81.2%** of chained calls consume multi-record outputs, with median cardinality 27 and a maximum of 224,958 records. EDGE therefore types junctions rather than pretending every output-to-input transition is one-to-one.

- `SEQ` is used when one value is passed onward.
- `FAN` expands a small set into separate downstream calls.
- `DRV` deterministically reduces a large result set before continuing.
- `SEM`, `CMP` and `COND` represent shared-argument parallelism, comparative calls and conditional branches.

This is relevant to runtime design because a declared edge is insufficient evidence for a usable **composition semantics**. Cardinality, reduction rules, branching behavior and deterministic selection can all change the effect of an otherwise type-correct connection.

## Training and Transfer Results

EDGE produces **1,781** training trajectories. On KOPA-Bench, Qwen3.5-4B rises from **0.1758 to 0.3094 pass@1**, while Qwen3.5-9B rises from **0.3275 to 0.4310**; an untuned Qwen3.5-27B scores 0.4482. The paper also reports out-of-distribution gains on BFCL, including a 9B multi-turn score increase from 52.25 to 58.12.

A supervised-fine-tuning control on the same corpus already raises the 4B model by about 9.7 percentage points in pass@1, showing that much of the gain comes from the execution-grounded corpus rather than only the later reinforcement-learning stage. Filtering malformed or stale synthesized instances raises pass@1 from 0.242 to 0.309, which independently shows that data validity remains important after graph construction.

The authors also test contamination and transfer. No evaluation query appears verbatim in training; the training/evaluation dependency-edge Jaccard similarity is reported as 0.0 even though the tool universe intentionally overlaps. On 31 tasks grounded in platforms withheld from synthesis, the 4B model still improves substantially. These controls strengthen the claim that the method learns transferable composition behavior rather than only memorizing benchmark chains.

## Execution Evidence Is Graded, Contextual and Perishable

A successful live call establishes that a particular binding worked under the observed endpoint, arguments, data, service state and credentials. It does **not** automatically establish:

- that the caller was authorized to make the resulting business change;
- that the target object and scope were the intended ones;
- that a retry is idempotent or exactly-once;
- that the transition is transactionally safe;
- that the endpoint will preserve its schema and semantics tomorrow;
- that a different credential, tenant or region has the same capability;
- that the same edge is safe when embedded in a different multi-step effect chain.

The paper itself identifies live-service drift as a limitation: endpoint schemas, availability and records can change, so exact reproduction depends partly on external public services. The study also limits its empirical domain to Korean public-sector APIs and does not claim an end-to-end comparison against every alternative data-synthesis pipeline.

For a governed runtime, this means “execution-proven” should be represented as **evidence with provenance and freshness**, not as a timeless Boolean capability flag.

## A Bounded Runtime Evidence Model

A useful architectural inference from the study is that a reusable tool edge should carry at least the following evidence identity:

- source and target tool identity/version;
- source output field and target input argument;
- schema/version observed at test time;
- endpoint and environment identity;
- argument/default binding used;
- credential or permission context relevant to the test;
- returned-data/cardinality class;
- timestamp and trial count;
- structural versus environmental failure classification;
- success history or posterior confidence;
- freshness/revalidation policy.

That record still does not grant execution authority. **Capability evidence and call-time authorization remain separate gates.** EDGE is evidence for whether a composition can execute; it is not evidence that this worker, on this task, may execute it now.

## Failure Modes for a Digital-Employee Runtime

### Schema-plausibility promotion

The runtime turns an LLM-judged or schema-compatible binding directly into an executable capability without live evidence.

### One-success overclaim

A single successful probe is promoted to a universal capability even though the successful context, trial count and transient service state are not recorded.

### Stale-edge inheritance

A graph edge survives a tool/version/API upgrade without a freshness check even though its original execution evidence no longer applies.

### Environmental-noise overreaction

Rate limiting or a temporary outage is treated as structural incompatibility, causing the runtime to discard a sound binding.

### Structural-failure underreaction

Repeated deterministic schema or missing-field failures are treated like transient noise, leaving a misleading edge active.

### Cardinality collapse

A one-to-many response is silently coerced into a single downstream value, producing a different business effect from the intended composition.

### Capability-authority collapse

Successful tool composition is interpreted as permission to perform the corresponding real-world action.

## Evidence Strength

This is strong primary research evidence that live execution materially improves the quality of tool-composition graphs relative to a model-judged skeleton, and that explicitly modeling output cardinality improves realistic multi-step trajectory construction. The benchmark design, controlled graph comparison, training ablations, transfer checks and contamination audit all support the mechanism-level conclusion.

It is not a production authorization study, an exactly-once execution study or a proof of persistent capability under API drift. Current public release state also limits independent end-to-end reproduction because the linked repository has not yet published the benchmark/corpus/checkpoint artifacts described as forthcoming.

## Limits and Unknowns

- The live environment is itself time-varying; observed execution evidence can age.
- A retained final edge can still have zero observed successes if it is under-explored, so final graph membership must not be misread as per-edge proof.
- Environmental versus structural failure classification depends on the correctness of the failure taxonomy.
- The empirical domain is Korean public APIs and may not represent private enterprise APIs, transactional systems or high-risk side effects.
- Tool-call success does not establish organizational authorization, intended target binding, idempotency or compensability.
- Public benchmark/corpus/checkpoint artifacts are not yet all available in the linked repository as of this run.

## Unresolved Questions

1. How should a production runtime expire or revalidate execution evidence after tool, schema, endpoint, credential or tenant changes?
2. What minimum trial history is sufficient before a composition edge may be used automatically rather than only probed or reviewed?
3. How should capability confidence combine with call-time authorization without letting either substitute for the other?
4. Can structural/environmental failure classification itself be independently verified when provider error codes are inconsistent?
5. How should a runtime represent cardinality-dependent effect semantics so that a schema-compatible edge cannot silently change business meaning?

## Reading Conclusion

The selected evidence supports a bounded conclusion: **tool composition should be admitted from execution-grounded evidence, not from schema plausibility or model confidence alone.** EDGE shows that live calls reveal incompatibilities that its own LLM-guided skeleton cannot reliably identify and that accumulated execution evidence can override a prior judgment. But “execution-grounded” is a graded, contextual and time-sensitive claim, not a universal proof. A digital-employee runtime should therefore preserve the provenance, trial history, failure class and freshness of composition evidence, while keeping capability evidence strictly separate from the authorization to produce a real effect.
