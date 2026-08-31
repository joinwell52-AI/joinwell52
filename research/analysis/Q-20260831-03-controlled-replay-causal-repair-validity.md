---
schema: "research-analysis/v1"
id: "AN-20260831-03"
date: "2026-08-31"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260831-03"
column: "open-source-engineering"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260831-03-controlled-failure-replay-causal-repair-test.md"
output_contract: "Research Object"
research_object: "Controlled Replay Needs Both Logical-Prefix and External-State Validity"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Controlled Replay Needs Both Logical-Prefix and External-State Validity

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-31 Reading Result for Q-20260831-03. The evidence is the primary research reported in arXiv:2608.25920 over 536 evaluator-confirmed failures across AG2, CrewAI and Magentic-One. The conclusion concerns how a recovery experiment can distinguish causal repair from stochastic resampling. It does not claim arbitrary distributed replay, exactly-once external effects or universal automatic repair.

本对象只分析 Q-20260831-03 的 2026-08-31 当日已完成 Reading Result。证据来自 arXiv:2608.25920 报告的一手研究：覆盖 AG2、CrewAI、Magentic-One 的 536 条经评估确认失败。结论讨论恢复实验如何区分“因果修复”和“随机重新采样”，不主张任意分布式重放、外部效果恰好一次或普遍自动修复。

```yaml
analysis:
  research_questions:
    - id: "RQ1"
      question: "What must a governed Agent Runtime hold constant, and what may it change, for a recovery experiment to support a causal repair claim rather than merely a lucky rerun?"
      question_zh: "受治理 Agent Runtime 在恢复实验中必须固定什么、允许改变什么，才能支持‘因果修复’而不只是一次幸运重跑？"
  research_themes: ["recovery verification", "controlled replay", "causal repair", "failure evidence", "external-state qualification"]
  subject_kind: ["engineering-insight", "failure-mode", "architecture-mechanism", "benchmark-result"]
  samples: ["AG2", "CrewAI", "Magentic-One", "SymFail/SymTrace failure corpus"]

  research_value:
    failures:
      - "A full rerun changes the suspected defect together with unrelated model, tool, scheduling and intermediate-state choices, so success does not isolate the repair mechanism."
      - "A logically matching replay can still be physically invalid when the original prefix mutated external state that was not restored or safely reproduced."
      - "Failure reproduction, target selection and task repair are different metrics and should not be collapsed into one recovery-success number."
    findings:
      - "The study retains 536 evaluator-confirmed failures from 600 task-system executions across three multi-Agent frameworks."
      - "On first-attempt same-failure reproduction, unguided rerun is reported at 67.97% while controlled replay reaches 80.78%; by the third attempt the reported rates are 41.42% and 52.43%."
      - "Unguided rerun repairs only 6.90% of failed tasks at pass@3 in the reported evaluation."
      - "For single-attempt intervention targeting, last-node repair is reported at 1.31%, random targeting at 3.73%, and symptom-driven suspicious-node intervention at 20.15%."
      - "The replay mechanism reports 100% content-hash exactness for the represented logical prefix under its stated captured-state assumptions."
    mechanisms:
      - "Freeze an authoritative failed logical prefix as a replay fixture."
      - "Validate event position and canonicalized boundary request against the recorded trace and fail closed at first divergence."
      - "Return recorded boundary results for matched prefix events and validate materialized event identity/content."
      - "Apply a repair intervention at an explicit anchor and switch only the downstream suffix back to live execution."
      - "Treat external-state restoration, re-execution or checkpointing as a separate qualification from logical-prefix equality."
    implications:
      - "A governed recovery test should have a stable experiment identity binding failed trace version, intervention anchor, repair hypothesis and suffix outcome."
      - "Logical replay fidelity and external-state validity should be separate gates."
      - "A successful full rerun is availability/resampling evidence, not by itself evidence that the proposed repair fixed the original causal mechanism."

  evidence_claims:
    - id: "E1"
      identity: "source-reported-claim"
      claim: "The primary study reports controlled replay reproducing the same failure more often than unguided rerun under the tested protocols."
      claim_zh: "一手研究报告：在测试协议下，Controlled Replay 比 Unguided Rerun 更常复现同一失败。"
      source: "research/reading/Q-20260831-03-controlled-failure-replay-causal-repair-test.md"
      strength: "primary comparative benchmark result"
      independent: false
    - id: "E2"
      identity: "source-reported-claim"
      claim: "The study reports 6.90% unguided-rerun pass@3 repair and 20.15% symptom-driven single-attempt intervention repair on the retained failures."
      claim_zh: "研究报告：在保留失败样本上，Unguided Rerun 的 Pass@3 修复率为 6.90%，Symptom-driven 单次干预修复率为 20.15%。"
      source: "research/reading/Q-20260831-03-controlled-failure-replay-causal-repair-test.md"
      strength: "primary research result; methods are not component-isolated"
      independent: false
    - id: "E3"
      identity: "source-reported-claim"
      claim: "Replay validates position/request alignment and stops on divergence before returning recorded boundary results for the preserved prefix."
      claim_zh: "Replay 在保留前缀中核验 Position/Request 对齐，并在 Divergence 时停止，再对匹配边界返回记录结果。"
      source: "research/reading/Q-20260831-03-controlled-failure-replay-causal-repair-test.md"
      strength: "reported replay mechanism"
      independent: false
    - id: "E4"
      identity: "source-reported-claim"
      claim: "The source explicitly limits replay exactness to represented state and warns that replaying a recorded tool success does not recreate an external side effect."
      claim_zh: "来源明确把 Replay Exactness 限定在 Represented State，并指出重放记录的 Tool Success 不会重建原外部副作用。"
      source: "research/reading/Q-20260831-03-controlled-failure-replay-causal-repair-test.md"
      strength: "explicit source limitation"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "A causal repair claim requires two independent validity checks: logical-prefix fidelity and qualification of the external state on which the live suffix depends."
      claim_zh: "Causal Repair Claim 需要两项独立有效性检查：Logical-prefix Fidelity，以及 Live Suffix 所依赖 External State 的资格核验。"
      source: "E1,E3,E4"
      strength: "bounded engineering interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "Rerun, replay and repair should be represented as different Runtime operations with different evidence semantics."
      claim_zh: "Rerun、Replay 与 Repair 应被表示成不同 Runtime Operation，并拥有不同 Evidence Semantics。"
      source: "E1,E2,E3"
      strength: "governance implication"
      independent: false

  observations:
    - "The replayed prefix acts as a versioned test fixture: divergence means the experiment has changed rather than merely become noisy."
    - "The intervention anchor is the causal boundary; everything before it is evidence to hold fixed, while the suffix is the region allowed to respond to the repair."
    - "Content-hash exactness is meaningful for represented logical events but cannot certify uncaptured provider, timing or external-system state."
  observations_zh:
    - "Replay Prefix 实际上是版本化 Test Fixture：一旦 Divergence，实验已经改变，而不只是增加噪声。"
    - "Intervention Anchor 是因果边界；其前方是需要固定的证据，后方 Suffix 才允许响应修复。"
    - "Content-hash Exactness 对 Represented Logical Event 有意义，却不能认证未捕获的 Provider、Timing 或 External-system State。"

  comparisons:
    - "Rerun asks whether another trajectory can succeed; controlled replay asks whether changing a designated intervention against the same represented failed prefix changes the downstream outcome."
    - "Logical-prefix fidelity is analogous to input-fixture stability; external-state qualification is a separate precondition for interpreting a suffix that touches persistent systems."
  comparisons_zh:
    - "Rerun 询问另一条轨迹能否成功；Controlled Replay 询问在同一 Represented Failed Prefix 上改变指定 Intervention 是否会改变下游结果。"
    - "Logical-prefix Fidelity 类似 Input Fixture 稳定性；对于触及持久系统的 Suffix，External-state Qualification 是另一项独立前提。"

  contradictions:
    - "Unguided rerun frequently reproduces the same failure yet rarely repairs the task, so reproducibility and repair are non-equivalent."
    - "A successful rerun can occur without proving that the intervention addressed the original failure mechanism."
    - "Controlled replay improves causal targeting but still repairs only a minority of retained failures; replay infrastructure is not itself an automatic-repair solution."
  contradictions_zh:
    - "Unguided Rerun 经常复现同一失败，却很少修复任务，因此 Reproducibility 与 Repair 不等价。"
    - "Rerun 成功可以在没有证明 Intervention 修复原始失败机制的情况下发生。"
    - "Controlled Replay 改善因果定位，但仍只修复少数保留失败；Replay Infrastructure 本身不是自动修复方案。"

  counterarguments:
    - "Full reruns remain useful for reliability and pass-rate measurement; the narrower claim is that they are weak evidence for causal repair."
    - "Capturing every physical state is impractical, so a replay system needs an explicit declared determinism boundary rather than pretending to reproduce the entire world."
  counterarguments_zh:
    - "Full Rerun 对可靠性与 Pass-rate 测量仍有价值；这里只是指出它对 Causal Repair 的证明力较弱。"
    - "捕获所有物理状态并不现实，因此 Replay System 应声明明确的 Determinism Boundary，而不是假装重建整个世界。"

  research_judgment: "A governed Agent recovery experiment should distinguish rerun, controlled replay and repair as separate evidence-producing operations. Causal repair is supportable only when the Runtime preserves an authoritative failed logical prefix, rejects prefix divergence, binds the intervention to an explicit anchor, and independently qualifies any external state required by the live suffix. The SymTrace results support this separation under three evaluated multi-Agent frameworks, but the reported 100% prefix exactness applies only to represented captured state. It does not establish arbitrary physical replay or exactly-once external effects."
  research_judgment_zh: "受治理 Agent Recovery Experiment 应把 Rerun、Controlled Replay 与 Repair 区分为三种产生不同证据的 Operation。只有当 Runtime 保留权威 Failed Logical Prefix、拒绝 Prefix Divergence、把 Intervention 绑定到显式 Anchor，并对 Live Suffix 所需 External State 做独立资格核验时，才有基础支持 Causal Repair 判断。SymTrace 在 3 个测试多 Agent Framework 上的结果支持这种区分，但报告的 100% Prefix Exactness 只适用于被表示和捕获的状态，不能建立任意 Physical Replay 或外部效果恰好一次。"

  general_implications:
    - "Persist recovery experiments as versioned objects with task/run identity, failed trace generation, event order, intervention identity and suffix outcome."
    - "Use fail-closed request/event matching so a different prefix becomes a different experiment rather than silently continuing."
    - "Separate replay divergence from external-state divergence in diagnostics and gates."
    - "Require an external-state restoration, compensation, re-execution or checkpoint contract before reusing a recorded success whose side effect matters to the suffix."
  general_implications_zh:
    - "Recovery Experiment 应作为版本化对象持久化，包含 Task/Run Identity、Failed Trace Generation、Event Order、Intervention Identity 与 Suffix Outcome。"
    - "使用 Fail-closed Request/Event Matching，使不同 Prefix 被视为不同实验，而不是静默继续。"
    - "在诊断和 Gate 中区分 Replay Divergence 与 External-state Divergence。"
    - "若记录的 Success 所对应副作用会影响 Suffix，则重用前应要求 External-state Restoration、Compensation、Re-execution 或 Checkpoint Contract。"

  limitations:
    - "The benchmark covers three MAS frameworks and selected browser/assistant tasks rather than the full range of deployed enterprise Agent systems."
    - "Failure-category annotations have non-uniform agreement and parts of the reproduction pipeline use an automated judge."
    - "The main evaluation uses one hosted model alias/configuration, which does not establish provider-version invariance."
    - "The 20.15% symptom-driven result combines target selection and repair guidance, so component contributions are not fully isolated."
    - "Logical replay exactness does not cover uncaptured scheduling, network timing, provider-internal nondeterminism or escaped side effects."
  limitations_zh:
    - "Benchmark 覆盖 3 个 MAS Framework 与部分 Browser/Assistant Task，并非所有生产企业 Agent System。"
    - "Failure-category Annotation 的一致性并不均匀，Reproduction Pipeline 的部分环节使用自动 Judge。"
    - "主实验使用单一 Hosted Model Alias/Configuration，不能建立 Provider-version Invariance。"
    - "20.15% Symptom-driven 结果同时包含 Target Selection 与 Repair Guidance，组件贡献未完全隔离。"
    - "Logical Replay Exactness 不覆盖未捕获 Scheduling、Network Timing、Provider-internal Nondeterminism 或 Escaped Side Effect。"

  open_questions:
    - "Which model, tool, human, scheduling and message-delivery boundaries must be captured for a governed replay?"
    - "What canonicalization can ignore harmless representation differences without accepting materially different requests?"
    - "What external-state contract is sufficient before a recorded tool success may be reused?"
    - "How should multiple repair hypotheses be tested against one frozen prefix without cross-experiment side-effect contamination?"
  open_questions_zh:
    - "受治理 Replay 必须捕获哪些 Model、Tool、Human、Scheduling 与 Message-delivery Boundary？"
    - "什么 Canonicalization 可以忽略无害表示差异，同时拒绝实质不同的 Request？"
    - "重用记录的 Tool Success 前，什么 External-state Contract 才足够？"
    - "多个 Repair Hypothesis 如何针对同一 Frozen Prefix 测试，同时避免跨实验 Side-effect Contamination？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence", "technical-analysis", "engineering-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The conclusion is a general recovery-verification pattern for Agent runtimes and remains complete without first-party project mapping."
    rationale_zh: "结论属于 Agent Runtime 的通用 Recovery-verification 模式，不需要映射任何自有项目。"
```

## Bounded judgment / 有界判断

A recovery run is not a causal repair test merely because it eventually succeeds. The failed logical prefix must remain authoritative up to a declared intervention anchor, and the live suffix must execute against external state that is independently qualified. Logical replay and external-effect validity are related but separate guarantees.

恢复运行最终成功，并不自动使它成为 Causal Repair Test。失败 Logical Prefix 必须一直保持权威直到声明的 Intervention Anchor，而 Live Suffix 还必须运行在经过独立资格核验的 External State 上。Logical Replay 与 External-effect Validity 相互关联，但属于两项不同保证。