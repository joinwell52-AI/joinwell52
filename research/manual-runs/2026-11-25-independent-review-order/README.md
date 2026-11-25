# Independent QA and missing-evidence handoff / 独立复核与缺件交接

**2026-11-25 · CodeFlowMu · synthetic rental reconciliation**

| Evidence | Record |
|---|---|
| Report-first, evidence-first, and missing-procedure trials | [36 model verdicts across six fresh sessions](../../../docs/public/assets/independent-review-order-20261125/results.json) |
| Fall-through from existing model verdicts to product records | [Three product readbacks](../../../docs/public/assets/independent-review-order-20261125/product-readback.json) |
| Incoming QA could not open the existing handoff body | [Tool trace for the adapter-failure comparison](../../../docs/public/assets/independent-review-order-20261125/handoff-unreadable-control.json) |
| Incoming QA read the formal ISSUE document before choosing which originals to reopen | [Tool trace](../../../docs/public/assets/independent-review-order-20261125/handoff-live-results.json) · [Case summary](../../../docs/public/assets/independent-review-order-20261125/handoff-summary.json) |

The order comparison used six synthetic cases, repeated once in reverse order. Report-first and evidence-first each produced 12 expected verdicts out of 12. All 12 missing-procedure decisions were holds, under an explicit instruction to request evidence when the governing procedure was unavailable.

The live handoff used `gpt-6.1-sol` through Codex CLI, CodeFlowMu revision `0d2d4e742ef2f3cb48e3ce09cc47f0c03053dc5f`, and FCoP 4.0.5. Each case had an incoming and outgoing session under distinct test principals assigned to the same QA role. A local test adapter supplied synthetic source files. The product interfaces persisted and returned the task, report, issue, and review. In the first run, the adapter incorrectly treated ISSUE metadata as the body. Both incoming reviewers reopened all three sources. Using the official ISSUE document reader in the rerun, both reopened only the restored procedure. Both runs produced the same QA verdicts. Final business acceptance was outside the experiment.

所有款项、身份和工单均为合成测试。第二班按工具返回原件内容计数，另读任务、报告和交接记录。适配器计算摘要时会读取文件字节。样本只覆盖两个固定案例，不能用于估计生产表现。
