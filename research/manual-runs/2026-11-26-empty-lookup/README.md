# Empty lookup and order recovery / 空查询与订单恢复

2026-11-26 · CodeFlowMu · Synthetic rental orders

- [24 controlled policy runs](../../../docs/public/assets/empty-lookup-20261126/results.json)
- [Six live agent traces with ledger and product readbacks](../../../docs/public/assets/empty-lookup-20261126/live-recovery-results.json)

The scripted experiment used four conditions, two policies, and three repeats per condition and policy. When a committed order was temporarily invisible, retrying on empty created two orders in all three runs. A policy using evidence about the original send preserved one order in each run. In the unresolved condition the policy left three tasks active.

For the follow-up, the original local send record was removed from each of six temporary assignments, and every first lookup was empty. Each fresh Codex CLI session used `gpt-6.1-sol` through an isolated MCP test adapter. Two sessions received no receipt and filed unresolved issues. Two recovered an existing order from a commitment receipt and filed reports. Two received definitive evidence that the original request never entered processing and sent once. All six ledgers contained exactly one order at the end of observation.

The order service and receipt authority were synthetic. CodeFlowMu's actual product interfaces recorded and returned tasks, issues, and reports through FCoP 4.0.5. The four filed reports in the live follow-up reached review. The experiment did not invoke final acceptance.

两组材料分别保留固定策略逐轮结果与真实 Agent 的实际调用。续验仅对合成订单和固定的回执归属进行验证，未覆盖错绑回执或真实订单服务。
