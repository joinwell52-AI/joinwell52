# 《Token 不是账单》第一轮返工记录

日期：2026-08-18  
依据：`13-independent-editorial-review-cost-round1.md`  
状态：已完成正文返工，等待 fresh-context 第二轮独立复核。

## 已修正的阻断项

1. 把 Cursor Router 的量化对象从错误的“usage/消耗约两倍”改为“厂商估算的成本平均约两倍，视模式约二至四倍”，并明确这是 Cursor 的厂商估算，不是独立实验结果。
2. 将第三层金额改写为一条显式状态轴：预计可计费 → 已入账/已计费 → 发票应付 → 调整/退款后。只有已开票或供应商定义的等价最终状态才称为最终应付。
3. 更新 Cursor Admin API 到当前可直达地址 `https://cursor.com/docs/account/teams/admin-api`，并区分 `totalCents` 的模型成本与 `chargedCents` 的对账收费语义。
4. 明确 GitHub `discountAmount` 是金额价值，权益余额仍需单独记录单位与数量。
5. 将论坛“迅速聚集大量回复”的热度修辞改为可核验的“同一讨论中多名用户连续提出”。
6. 重构英文稿：不再逐段复制中文“三张小票”的叙述顺序，改用 meter / entitlement ledger / billing ledger 三个数据对象组织产品与 FinOps 论证；事实、数字和边界保持一致。
7. 将正文引用 `[[6]]` 与来源表第 6 项 Cursor Router 一一对应。
8. 收紧最小事件字段，把权益数量、包含价值、余额与不同计费状态拆开。

## 尚未执行

- 题图仍是正文占位路径。根据既定流程，只有内容第二轮独立复核 PASS 后才生成，缺图不作为本轮内容复核缺陷。
- 视觉项与最终 100 分评分等待题图完成后计算。

