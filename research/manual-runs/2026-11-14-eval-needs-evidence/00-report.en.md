# What an AI acceptance reviewer must see: seven controlled cases

Date: 2026-11-14. Question: when a second AI approves a delivery, did it receive the original request, current artifact, and business facts? These are **authored experimental cases**, not production orders or an end-to-end CodeFlowMu EVAL run.

## Sources and claims

- [browser-use #6398](https://github.com/browser-use/browser-use/pull/6398) adds an after-run same-model judgment and separately records its usage and cost. It supports the usefulness of a post-run observation, not independence of the judge.
- Local CodeFlowMu V3.0.152 source at commit `0d2d4e742ef2f3cb48e3ce09cc47f0c03053dc5f6`: `source_evaluations.py` persists a request before a model call, returns `unknown` without automatic replay after a missing receipt, and marks observations `grants_authority=false`. This is a source-path and targeted-test observation, not a claim that these seven cases passed the product's formal acceptance path.
- [Anthropic's evaluation methods](https://www.anthropic.com/research/building-strong-safety-evaluations) inform the fixed question, labels, calibration, and explicit limits. This small fixture cannot rank models generally.

## Reproducible materials

- [`probe_eval.py`](probe_eval.py) holds the fixed labels, deterministic rules, and scripted report-trusting negative control. Run `python probe_eval.py`; observed exit code 0, false accepts `6` and `1`, rule false rejects `0`, rule-pass IDs `K7` and `M8`.
- [`eval-blind-prompt.txt`](eval-blind-prompt.txt) is the identical input to both models. It omits the labels but explicitly names failure categories; the facts are clear. This is label blinding, not a difficult hidden-condition benchmark.
- [`eval-rule-pass-prompt.txt`](eval-rule-pass-prompt.txt) contains only the two rule-pass types, renamed Q2/N5.

The prompts went through noninteractive Codex CLI with `--sandbox read-only --ephemeral --skip-git-repo-check` and an instruction not to use tools. On 2026-11-14 the `gpt-6.1-sol` and `gpt-6-astra` runs both exited 0 and returned seven JSON decisions; the two-case `gpt-6.1-sol` run also exited 0. CLI-reported token counts were approximately 4,309, 10,749, and 3,862 respectively, including prompt overhead; they do not compare product prices. A `claude -p` attempt returned `Not logged in` with zero input tokens and is excluded. Model outputs may vary on rerun.

| ID | Fixed label | Rule | gpt-6.1-sol | gpt-6-astra | Decisive fact |
| --- | --- | --- | --- | --- | --- |
| K7 | accept | accept | accept | accept | One order, exact items, current evidence, authorization |
| P2 | reject | reject | reject | reject | B-22 missing |
| R4 | reject | reject | reject | reject | Evidence v1, delivered artifact v2 |
| T9 | reject | reject | reject | reject | Published without authorization |
| L3 | reject | reject | reject | reject | Two orders instead of one |
| V6 | reject | reject | reject | reject | Zero orders instead of one |
| M8 | reject | **accept** | reject | reject | B-23 delivered, B-22 requested |

After rule filtering, the model accepted Q2 (equivalent to K7) and rejected N5 (equivalent to M8), citing the B-23/B-22 mismatch. The rules deliberately checked count, version, and authorization without comparing SKU text. The models received both the exact requirement and delivered content. Thus this run shows recognition of a visible semantic mismatch, not an ability to discover trustworthy business facts. Both models are from OpenAI, and no actual executor model participated; different model names do not establish independent evaluation.

## Product boundary and test prerequisite

`tests/contracts/v3/test_source_eval_transport.py -q`: 5 passed; `test_source_eval_process_lifetime.py -q`: 1 passed with `model_request: false`. These cover transport shape and process lifetime. Running `test_source_evaluations.py -q` stopped during fixture setup with `TEST_ADMIN_TOKEN_REQUIRED`, **before EVAL assertions**. The non-admin prerequisite is neither a product failure nor a passing test. No real CodeFlowMu EVAL artifact exists for these seven cases, and no corresponding product defect is confirmed.

The bounded finding: in seven simple cases, rules blocked five failure types; models caught the remaining SKU mismatch when directly given the original requirement and current facts. Formal acceptance still needs provenance, version, access, and decision authority. A next run should use real TASK/REPORT facts, current artifacts, external outcome readback, and human calibration.
