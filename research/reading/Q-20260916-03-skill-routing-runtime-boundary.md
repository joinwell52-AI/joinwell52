# Q-20260916-03 — Skill Routing Should Be a Separately Testable Runtime Boundary

- Runtime date: 2026-09-16 (Asia/Shanghai)
- Queue signal: SIG-20260916-004
- Primary research source: https://arxiv.org/abs/2609.15982
- Evidence level: `primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

As an Agent's skill catalog grows, what evidence supports moving skill selection out of permanent prompt preload and into a distinct runtime routing component whose recall, abstention, latency, stability and failure behavior can be measured independently?

## Source-complete Reading Scope

The primary source is *The Router Within: Eliciting Native Skill Routing from a Frozen LLM*. The reading covered Gavel's problem setup, hidden-state glance, skill-bank compression, model-native verdict, product-of-experts ruling, training/calibration setup, three written-task benchmarks, SkillTraj's 372 trajectories, live mini-swe-agent integration, ablations, alternative read-outs that fail, adjudication details, candidate-pool recall, trajectory construction and routing-cost analysis.

The source evaluates routing quality, not general downstream task completion, security-policy enforcement or organizational authorization. Those boundaries are preserved below.

## The Runtime Boundary

Current skill-loading approaches often use one of two patterns: preload skill metadata into the agent's context and let the model choose, or put an external retrieval/reranking stack beside the agent. Gavel proposes a third design: extract a routing signal from the frozen agent model's own forward passes, keep the full skill library out of working context until a skill is chosen, and make the routing decision an explicit intermediate component.

This is architecturally important because routing becomes observable as its own decision. A system can separately ask whether the router recognized the need, shortlisted the right capability, abstained when nothing fit and made the decision within an acceptable cost/latency budget.

## Gavel Architecture

The pipeline has two main stages and a final ruling.

### Installation-time skill bank

For each skill document, the frozen backbone is run once at installation. A learned linear map `W_s` projects mid-layer hidden states into a bank of skill keys. The bank is then compressed to an epsilon-cover so redundant token directions can be discarded with a bounded score distortion.

Adding a new skill therefore requires a forward pass and indexing, not retraining a per-skill embedding or modifying the backbone.

### Glance

At a routing point, a second learned map `W_q` projects the live task/context hidden states from the same backbone. Task tokens vote against the per-skill key banks using maximum similarity; the resulting score ranks the full library without inserting the library's text into the active conversation context.

The main Qwen3-32B setup reads after block 45 of 64. `W_q` and `W_s` contain 7.9 million trainable parameters in total. They are trained once on 51,104 SkillRet training queries over 9,084 skills. The reported epsilon radius of 0.83 compresses the banks by about 8.5x, with the paper reporting at most a 1.6-point benchmark cost under that setting.

### Verdict

The glance only produces a shortlist. The frozen model then re-examines each candidate together with the task and produces two additional signals: task likelihood conditioned on the skill, and its own yes/no relevance log-odds. This stage reads the full skill body rather than relying only on metadata.

### Product-of-experts ruling

Glance, likelihood and relevance judgment are combined with calibrated coefficients. Candidates outside a pruning margin are not sent to the verdict; roughly nine candidates receive verdict evaluation on average in the main setup.

The live integration can also abstain. If the best candidate receives a negative model-native verdict, the system loads nothing rather than forcing one skill to be selected.

## Written-task Evaluation

The paper evaluates three public benchmark settings with substantially different task and skill distributions.

- **SkillRet test**: 4,997 queries against 6,660 held-out skills.
- **SRA-Bench**: a stratified sample of 861 tasks against 26,262 skills.
- **Eval-Core**: 75 real `task.md` queries against two pools totaling about 78K documents.

Because the provided gold skill labels are incomplete, the paper uses model adjudication: GPT-5.6 Sol compares the selected skill with available gold skills and credits the selection when it is judged at least as suitable. This is a meaningful evaluation dependency rather than ground truth and should remain visible.

The full Gavel pipeline leads the reported comparison across these three benchmark settings. Relative to the strongest competing full pipeline, the paper reports gains of 3.8 points on SkillRet, 13.4 points on SRA-Bench and roughly 1.3–2.7 points on Eval-Core depending on split.

The raw/adjudicated tables also show a material distinction between retrieval recall and final selection: a front end can place a valid skill in the candidate set without the second stage choosing it correctly. Routing quality is therefore naturally decomposable into candidate recall and final commitment quality.

## Mid-rollout Routing: SkillTraj

Static written tasks do not capture an important agent case: the need for a skill may emerge only after work has begun. SkillTraj contains 372 simulated multi-turn trajectories over a held-out library of 6,660 skills. Each trajectory marks the exact token position where a skill becomes needed.

The four scenarios are:

1. user request — 116 trajectories;
2. tool evidence — 106 trajectories;
3. agent plan — 105 trajectories;
4. wrong-skill recovery — 45 trajectories.

The trajectories are generated by GPT-5.6 Sol and filtered by a separate judge plus machine-checkable routing-point and leakage checks. This creates useful controlled coverage, but it is synthetic evaluation rather than naturally occurring production logs.

Gavel leads every reported SkillTraj scenario. Its adjudicated scores are approximately 96.6% for user-request cases, 72.6% for tool-evidence cases, 90.5% for agent-plan cases and 88.9% for wrong-skill recovery. Depending on scenario, the reported lead over the strongest comparison system ranges from 8.6 to 21.9 points.

This is particularly relevant for long-running Agents because it tests routing after tools, plans and prior mistakes have already added noise to context.

## Live Harness Integration

The authors integrate Gavel into mini-swe-agent. A learned gate determines when skill selection should be attempted; the gate reads accumulated glance scores and the final-layer state. It must remain active for two consecutive tokens before routing is attempted.

On the 177-task Skill-Use benchmark with 79 curated skills, the paper reports the following correct-skill trigger rates:

- plain Qwen3-32B progressive-disclosure setup in mini-swe-agent: 1.1%;
- Qwen3-Embedding-8B + Qwen3-Reranker-8B: 89.7%;
- SkillRouter 0.6B embedder + 0.6B reranker: 80.0%;
- Qwen3-32B + Gavel: 90.9%.

The paper additionally reports that Gavel holds its fire and loads nothing in another roughly 5% of tasks.

These numbers measure skill-trigger correctness in this harness; they must not be read as 90.9% end-to-end task success. Correct skill invocation is an intermediate capability, not final execution proof.

## Cost and Context Evidence

Gavel's gate and glance read states already produced by the backbone; the additional online cost comes mainly from verdict forwards. With about nine candidate verdicts per firing in the authors' pricing model, the estimated routing cost is about $0.08 per firing under the stated August 2026 GPT-5.6 Sol prices.

Progressive disclosure has no separate verdict stage but keeps the skill metadata menu in context for every call. The authors model that cost as scaling with both catalog size and number of session calls. They emphasize a different resource boundary as more important: permanent metadata preload occupies finite context and adds attention over the full menu at every generation step.

The source estimates roughly half a second per Gavel verdict firing on a modern serving stack when candidate prefills are batched, with further benefit possible from per-skill prefix caching. This is an analytical/engineering estimate under the stated assumptions, not a universal measured latency guarantee.

## Ablations and Negative Evidence

The paper reports several useful failures that prevent over-reading the design.

- Native attention keys without learned calibration perform essentially at random in the reported tests; simply exposing existing attention state is not sufficient.
- Replacing the native verdict with progressive disclosure over the shortlist is materially worse on settings where long skill-body details matter.
- A skill-body generation-likelihood alternative is also weaker; the model can prefer text that resembles its own writing rather than the skill that serves the task.
- Dense learned retrievers transfer poorly when both query genre and skill-document genre shift out of their training distribution.
- Gavel still depends on learned projections and calibrated scalars. The underlying backbone is frozen, but the routing layer is not “training free.”

These are valuable because they show that the claimed boundary is not “hidden state automatically solves routing.” The useful result comes from a specific learned read-out plus model-native candidate adjudication.

## Routing Evidence vs. Execution Authority

The primary engineering implication is to separate skill routing from skill authority.

A router can provide evidence that a skill is relevant to the current execution state. It does not prove that:

- the current worker is authorized to invoke that skill;
- the skill's tools are authorized for the current target;
- credentials may be delegated;
- the selected skill is safe under current policy;
- the skill's downstream actions will complete correctly;
- a state-changing effect may be retried or committed.

For a governed runtime, the routing result should therefore be an input to call-time admission, not a substitute for it.

A useful separation is:

1. **Need detection** — should the runtime attempt skill routing now?
2. **Candidate retrieval** — which skills plausibly fit?
3. **Relevance verdict / abstention** — which candidate, if any, should be loaded?
4. **Skill admission** — is this worker allowed to use the selected skill in the present authority context?
5. **Tool/effect authorization** — are the concrete downstream operations allowed at call time?
6. **Outcome verification** — did execution actually satisfy the task?

Gavel provides evidence primarily for stages 1–3.

## Model and Router Identity

The routing maps read a specific backbone's internal hidden representation. The paper rebuilds the pipeline for another backbone in an appendix rather than demonstrating that one fixed read-out is universally portable across arbitrary model changes.

This supports a bounded engineering inference: a model upgrade should invalidate untested assumptions about the router's hidden-state geometry. Router identity and validation should bind to the backbone/version it was trained and calibrated against. A “skill catalog unchanged” fact does not imply routing behavior is unchanged after the underlying model changes.

## Evidence Classes

### Fact

Gavel uses two learned linear projections over a frozen backbone, an installation-time compressed skill bank, a full-library glance, model-native verdict signals and a product-of-experts ruling. Its main Qwen3-32B setup trains 7.9M projection parameters once and then evaluates other libraries zero-shot with fixed routing scalars.

### Research Result

The system leads the reported comparisons on three written-task benchmarks and all four SkillTraj scenarios, and the mini-swe-agent integration reports a 90.9% correct-skill trigger rate on Skill-Use versus 1.1% for the plain Qwen3-32B progressive-disclosure condition.

### Inference

Skill selection is usefully modeled as its own runtime boundary with independent recall, abstention, decision-stability, context-cost and latency evidence. This makes routing failures observable without conflating them with downstream task failure.

### Unknown

The study does not establish universal superiority across all backbones, naturally occurring production trajectories, security-sensitive policy routing, arbitrary skill libraries, or end-to-end business-task completion after a correctly routed skill is loaded.

## Limits and Negative Evidence

- SkillTraj is synthetically generated and filtered, not a production trace corpus.
- Public benchmark labels are incomplete and the primary reported scores rely on model adjudication.
- The live Skill-Use result measures correct skill triggering rather than complete task success.
- Most main experiments use Qwen-family backbones; another backbone requires rebuilding the read-out.
- Verdict evaluation adds latency and compute even though it avoids persistent context preload.
- The gate is itself a learned component with its own false-positive/false-negative behavior.
- Relevance is not authorization; a correctly selected skill can still be disallowed or unsafe for the present target.

## Unresolved Questions

1. What acceptance thresholds should a production router meet separately for need detection, shortlist recall, final commitment and abstention?
2. How should router calibration be invalidated and re-certified after a backbone or tokenizer update?
3. What provenance should bind a skill document, its indexed key bank and the exact version loaded into execution context?
4. How should call-time authorization consume a router verdict without allowing relevance to become de facto permission?
5. What naturally occurring long-running workloads would reveal failure modes missing from synthetic SkillTraj trajectories?
6. How should a runtime recover when the wrong skill has already produced intermediate state or side effects before rerouting?

## Reading Conclusion

The source-complete evidence supports a bounded conclusion: **skill routing can be treated as a separately testable runtime component instead of permanent context preload**. Gavel shows that a lightweight learned read-out of a frozen model plus a model-native verdict can route large and shifting skill libraries competitively, including when need emerges mid-rollout. But routing success is only capability-selection evidence. It does not grant skill authority, authorize downstream tools or prove task completion. Need detection, candidate recall, relevance verdict, admission, effect authorization and outcome verification should remain separate runtime facts.

This Reading Note performs evidence extraction only. It does not execute Research Analysis, article writing, visualization, Production or Publication.
