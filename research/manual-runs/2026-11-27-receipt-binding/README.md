# 订单回执错配与正式改价复核 / Receipt mismatch and approved price change

实验时间 2026-11-27。CodeFlowMu 固定基线 `0d2d4e742ef2f3cb48e3ce09cc47f0c03053dc5f`，FCoP 4.0.5。任务及记录使用真实产品端口，业务订单使用隔离的合成 SQLite 服务。实验轨迹中的任务、请求、用户角色和订单标识均为测试数据。

## 首轮回执错配

6 次独立模型会话。每次首次列表为空、发送文件已删除，账本均预置一笔不可见原单。回执请求与金额均匹配的两次都引用原单。请求不符的两次都登记待查。相同请求但金额不符时，一次待查，一次调用新建并在账本留下两笔。首轮账本记录笔数，测试金额来自回执夹具。

## 续验正式改价

6 次案例，每案两名员工分别以执行及独立复核身份运行。改价记录由测试程序通过 PM 身份写入正式 ISSUE，绑定任务轮次、业务号、请求和原单。首次列表仍为空。两次原单有效均沿用，两次确认取消均各补订一笔 790 元订单，两次结果未知均登记待查。六案各一笔有效订单，两张已取消原单仍保存在历史中。四份报告待审，两项待查仍开放。

## How to read the evidence

- [Initial receipt comparison](../../../docs/public/assets/receipt-binding-20261127/receipt-results.json) records six fresh model sessions, formal reports or issues, and the ledger before and after. Compare `trace`, `ledger_before`, and `ledger_after`, particularly `different_amount`.
- [Independent price-change review](../../../docs/public/assets/receipt-binding-20261127/reprice-results.json) records six cases with distinct worker and reviewer sessions. Check `price_change`, the exact-request evidence in `trace`, the persisted `filed_decision`, and the `before` and `after` ledger rows. The relevant count is rows whose state is `active`. The two unresolved cases contain a hidden active original.
- Both rounds used `gpt-6.1-sol` and a synthetic provider. The rebooking tool had no automatic deduplication and recorded amount, currency and state in the follow-up ledger. The formal price-change document was written by the fixture under the test PM role. No live provider, payment, refund, concurrent rebooking, or final business acceptance was tested. Differences between the two rounds include both evidence and role design, so the comparison does not isolate a causal effect of the price document.

[中文文章](https://joinwell52-ai.github.io/joinwell52/zh/research/2026-11-27-receipt-binding) · [English article](https://joinwell52-ai.github.io/joinwell52/en/research/2026-11-27-receipt-binding)
