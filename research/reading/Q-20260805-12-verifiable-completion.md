# Reading Record — Q-20260805-12 Verifiable completion for computer-use Digital Employees

- **Queue item:** `Q-20260805-12`
- **Column:** Digital Employee
- **Selection status:** Selected
- **Priority:** P0
- **Skill invoked:** `Skill 03 — Deep Reading`
- **Operating date:** 2026-08-05 (Asia/Shanghai)
- **Primary source class:** Microsoft Research preprint, official research article, code and benchmark release

## Reading scope

This pass reads the Universal Verifier work as evidence about how a computer-use Agent's completion can be evaluated. It extracts the verifier's mechanisms, measurements, limitations and unresolved questions. It does not decide how TMPA or CodeFlowMu should adopt the design, and it does not draft a publication.

## Deep Reading output

```yaml
reading_notes:
  problem:
    - Computer-use trajectories are long, visual and environment-dependent, so a final screenshot or a binary task outcome can misclassify partial success, unexpected valid paths and environment-caused failure.
    - A false positive is especially damaging because it can corrupt both evaluation labels and training data.
    - The selected question is whether completion evidence can separate process quality, actual outcome and failure controllability without allowing unsupported success claims.

  facts:
    - The work presents a Universal Verifier for web computer-use trajectories and releases CUAVerifierBench plus implementation artifacts.
    - The verifier returns a process score, a binary outcome judgment and a diagnostic report.
    - Its four cumulative design principles are: specific non-overlapping rubrics; process/outcome separation; controllable/uncontrollable failure separation; and divide-and-conquer screenshot context management.
    - Rubrics are generated without exposing the trajectory, reducing criteria that merely rationalize what the Agent happened to do.
    - Evidence selection first relates screenshots to criteria, then evaluates compact evidence groups instead of flooding one prompt with the complete trajectory.
    - CUAVerifierBench contains 246 human-labeled trajectories: 140 internal and 106 externally annotated Browserbase trajectories, with process and outcome labels.

  vendor_claims:
    - Microsoft describes agreement as human-level and false positives as near zero.
    - The official article states that rubric design accounts for roughly half of the observed gains and that the design, rather than only a stronger backbone, drives the advantage.
    - The authors report that an auto-research Agent reached about 70 percent of expert quality in about 5 percent of the time.

  mechanisms:
    - Rubric criteria are intended to be meaningful, non-overlapping and condition-aware so one error does not create cascading penalties.
    - Process reward measures how well required steps were followed; outcome reward independently records whether the requested end state was achieved.
    - Controllable failures include intent mismatch, reasoning errors, hallucination, insufficient effort and execution errors; uncontrollable failures include CAPTCHAs, login walls, unavailable entities and absent matching results.
    - Side-effect checks detect material actions not requested by the user.
    - Screenshot relevance mapping and top-k evidence grouping preserve evidence from long horizons while limiting context noise.

  evidence:
    - Outcome Cohen's kappa is reported as 0.64 on the internal set and 0.58 on Browserbase, versus 0.44/0.26 for the best WebJudge configuration and 0.31/0.13 for WebVoyager.
    - False-positive rates are reported as 0.01 internally and 0.08 on Browserbase, versus at least 0.22 for WebJudge and at least 0.45 for WebVoyager baselines.
    - Replacing WebVoyager's GPT-4o backbone with GPT-5.2 reduced false positives from 0.45 to 0.10 but increased false negatives from 0.24 to 0.44, showing a quality trade-off rather than uniform improvement.
    - The project records 96 experiments; the gains are attributed to the cumulative system rather than a single prompt or model substitution.
    - A supervised-fine-tuning filtering experiment reports better downstream results when verifier process scores are used to select training trajectories.

  limitations:
    - The source is an April 2026 arXiv preprint and official research publication, not a final peer-reviewed archival result.
    - The benchmark is small and restricted to web computer-use trajectories; it does not directly validate desktop, email, document, coding or long-lived enterprise Digital Employee work.
    - Human labels remain judgments rather than an objective completion oracle, and process-score thresholds are design choices.
    - The external false-positive rate is 0.08, so near zero must not be read literally as zero.
    - The full verifier is a multi-stage system with substantial code and prompt complexity; the evidence does not show that each component transfers independently.
    - The reported benchmark and training results do not establish transactional guarantees, compensation behavior or persistent runtime audit semantics.

  comparisons:
    - Stronger backbone substitution alone improved one error dimension while worsening another, whereas the Universal Verifier combines rubric, evidence-selection and failure-taxonomy changes.
    - Binary outcome-only verification cannot preserve the distinction between a sound process blocked by the environment and a successful outcome reached through an invalid or unsafe process.
    - The benchmark compares verifier-human agreement, not direct end-user trust, operational cost or enterprise incident rates.

  contradictions:
    - "Near-zero false positives" is qualified by an 8 percent Browserbase false-positive rate.
    - "Human-level agreement" refers to Cohen's kappa relative to annotator agreement; it does not establish human correctness or universal validity.
    - The paper argues that architecture matters beyond the model backbone, but the reported result remains a bundled system evaluation and does not isolate every design principle's transfer effect.

  unresolved_questions:
    - How does the verifier perform on non-web applications, persistent sessions and tasks with delayed external effects?
    - What evidence threshold should be required before a Digital Employee may assert completion rather than merely submit a completion claim?
    - How should deterministic checks, learned verifiers and human acceptance be composed when they disagree?
    - Can controllable and uncontrollable failure labels be reconstructed reliably after retries, handoffs or partial compensation?
    - What storage and provenance contract is required so the screenshots, rubric, score and diagnostic report remain independently auditable?
```

## Source traceability

1. Microsoft Research publication: `https://www.microsoft.com/en-us/research/publication/the-art-of-building-verifiers-for-computer-use-agents/`
2. Microsoft Research technical article: `https://www.microsoft.com/en-us/research/articles/the-art-of-building-verifiers-for-computer-use-agents/`
3. arXiv preprint: `https://arxiv.org/abs/2604.06240`
4. Open implementation and benchmark repository: `https://github.com/microsoft/fara`
5. Today's Research Plan: `research/runtime/plans/2026/08/2026-08-05-plan.json`

## Reading gate decision

**Result:** Deep Reading completed. The source package is sufficient for the later Analysis shift to compare verification boundaries and transfer limits. No architecture judgment, implementation recommendation or article was produced in this record.
