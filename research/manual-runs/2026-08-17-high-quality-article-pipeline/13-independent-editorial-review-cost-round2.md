# 《Token 不是账单》独立编辑审稿（Round 2）

## 结论

**PASS**

返工后的中英文候选已经解决首轮全部内容阻断项。核心论断现在稳定：token 是资源计量，不是天然账单；included/discounted value 不能冒充追加应付；预计可计费、已入账/已计费、发票应付和调整/退款后的金额不能压成一个无状态的 `cost` 数字。联网复核未发现会改变结论的关键事实错误或失效直链。

两稿也不再是逐段机械镜像。中文稿用“电表—套餐—信用卡账单”和“三张小票”服务普通用户；英文稿从 product/FinOps 评审场景切入，以 `meter / entitlement ledger / billing ledger` 三个数据对象组织论证。它们共享事实矩阵和结论，但开场、章节命名、解释密度和收束方式均已语言原生化。

审阅对象：

- `staging/publication-candidates/2026-08-17-token-is-not-a-bill.zh.md`
- `staging/publication-candidates/2026-08-17-token-is-not-a-bill.en.md`

联网复核日期：**2026-08-18**。

本轮只审内容。题图尚未生成是既定流程状态，**不作为内容缺陷，也不作为本轮阻断项**。

## 内容评分与 85 分可达性

| 内容维度 | 分值 | 本轮评分 | 判断 |
| --- | ---: | ---: | --- |
| 选题 | 20 | 19 | 用户问题具体，兼顾个人使用者、团队管理员与平台建设者；不落入“token 或美元”二选一。 |
| 证据 | 25 | 24 | FOCUS、GitHub、OpenAI、Cursor 产品/API 文档相互独立且互补，论坛仅承担需求信号；关键字段、单位和结算边界均已收紧。 |
| 原创洞察 | 20 | 19 | “三张小票”与三类 ledger 是清楚、可记忆的跨来源综合，并明确不是行业共同 schema。 |
| 结构可读性 | 15 | 15 | 两稿都由问题进入三层事实，再落到六问、事件字段和边界；中文生活化，英文产品化，各自自然成文。 |
| 可行动性 | 10 | 10 | 普通用户可直接用六问审页面，平台团队可直接检查最小事件字段、状态、范围和历史定价版本。 |
| **内容阶段合计** | **90** | **87** | **PASS；证据 24/25，满足证据至少 20 分门槛。** |

按未来视觉 **8/10** 的保守估计，总分可达 **95/100**；即使视觉只取得最低可用的 **6/10**，预计总分仍为 **93/100**，高于 85 分门槛。内容已具备进入封面生成与视觉审查的条件。

## 首轮阻断项复核

### 1. Cursor Router：已从 usage 修正为 cost

**通过。**

中文第 79 行和英文第 63 行都明确写为 Cursor 的厂商估算：Balance 与 Intelligence 的平均**成本**约为 Cost 的两倍，视模式可能约二至四倍；英文还进一步说明这不是 token usage multiplier。

[Cursor Router 当前文档](https://cursor.com/docs/cursor-router)支持以下边界：

- Router 当前只面向 Teams 与 Enterprise；
- 模型池会变化，用户不能手选每一次实际路由模型；
- Cost 使用 bundled Auto pricing；
- Balance 与 Intelligence 按实际路由模型费率计费；
- 文档量化的是 cost，另只说两种模式会更快消耗 usage limits。

候选已完整保留计划范围与厂商归属，没有把 Cursor 自报估算写成独立实验结果。

### 2. estimated / billed / invoiced / adjusted：边界已显式拆开

**通过。**

中文第 65—77 行和英文第 48—61 行已经把金额写成状态轴：

```text
estimated billable
→ posted/billed
→ invoiced amount due
→ adjusted/refunded
```

两稿都明确：实时估算不是发票；已入账金额仍可能修正；只有已开票或供应商定义的等价最终结算状态才可称 amount due；退款、月末修正、承诺摊销、税费与汇率仍可能继续改变结果。

[FOCUS v1.3](https://focus.finops.org/focus-specification/v1-3/)把 Billed Cost 定义为“开票依据”，并要求同一 Invoice ID 下的 Billed Cost 合计与对应发票的 payable amount 对齐。候选没有把 FOCUS 的 `Billed Cost` 偷换成“任何实时 cost”，也没有宣称四个状态是 FOCUS 的标准枚举。

### 3. Cursor Admin API：地址与字段语义已修正

**通过。**

两稿都使用当前可直达地址：[Cursor Admin API](https://cursor.com/docs/account/teams/admin-api)。当前文档支持候选的主要事实：

- Daily Usage 中存在 `subscriptionIncludedReqs` 与 `usageBasedReqs`；
- `/teams/spend` 提供成员 `spendCents` 等金额字段；
- usage event 可提供 `model`、`kind`、输入/输出/缓存 token、`isChargeable`、`totalCents` 与 `chargedCents`；
- `tokenUsage.totalCents` 是模型成本；
- `chargedCents` 是事件级总收费，官方明确要求以它和 `/teams/spend` 汇总对账。

候选已经避免把 `totalCents` 与 `chargedCents` 合并成同一个成本字段。

当前文档另有一个精度提示：`subscriptionIncludedReqs`、`usageBasedReqs` 和 `apiKeyReqs` 统计的是 raw usage events，并非旧 request-based pricing 中的 billable request units。两稿没有拿这些字段做计费数量计算，核心判断不受影响；后续若继续扩写 Admin API 示例，应改称“字段/计数器”或补上这一限定。

### 4. GitHub `discountAmount`：金额与数量已分开

**通过。**

[GitHub usage reporting 指南](https://docs.github.com/en/billing/tutorials/automate-usage-reporting)把 `quantity` 用于消耗量、`netAmount` 用于 billed cost、`discountAmount` 用于 included quota 或 discount 覆盖部分。当前 [Billing Usage API](https://docs.github.com/en/rest/billing/usage)还同时给出 `grossQuantity`、`discountQuantity`、`netQuantity` 与 `grossAmount`、`discountAmount`、`netAmount`，可直接确认 quantity 轴与 amount 轴不是一回事。

中文第 53 行和英文第 44 行已准确把 `discountAmount` 写成**金额价值**，并另行要求记录 entitlement 的 token、request、credit 或合同币种单位与余额。首轮最容易混淆的单位问题已经消除。

### 5. OpenAI cost 不等于最终 invoice：边界已守住

**通过。**

[OpenAI 官方 Organization Usage / Costs API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)显示，usage 资源返回 token、request、project/user 等使用维度；costs 资源返回按时间桶聚合的 monetary `amount`，包含 `currency` 与 `value`。

中文第 77 行和英文第 61 行只用它证明“资源量与货币成本是不同对象”，并明确说明接口本身**不能证明实时 cost 已经成为最终发票**。这一区分符合官方文档能支持的范围，没有从 cost endpoint 外推 invoice parity。

### 6. 论坛热度与产品范围：已降为可核验需求事实

**通过。**

[Cursor Forum 原讨论](https://forum.cursor.com/t/usage-page-to-token-amount-what/167153)的首帖日期、连续多名用户对按日/按用户/按模型成本可见性的诉求，以及 Cursor 员工关于 included usage 名义金额可能高于套餐价格、不同计划/权限可见性不同的解释，均可核验。

候选只写“多名用户连续提出 / several users in one discussion”，不再使用无统计依据的热度判断，也没有把论坛投诉写成行业事实或推断厂商动机。

### 7. 引用编号与直链：已对齐

**通过。**

两稿正文 `[[1]]`—`[[6]]` 与末尾来源表一一对应；Cursor Router 独立列为第 6 项。六组外部链接本轮均可打开，Admin API 已换成当前路径。

## 双语自然度与一致性

### 中文稿

中文稿以一天内多次调用 Agent、看到 230 万 token 却无法判断是否追加付费的生活场景开篇。“三张小票”持续承担结构作用，FOCUS 与 API 字段没有压过生活问题；六问从个人用户能看到什么，逐步推进到团队归因与历史定价版本，语序和信息密度符合中文技术解释文。

尤其有效的调整是把第三张小票改名为“从预计可计费，到最终应付”，不再用一句“这才是花了多少钱”抹平结算过程。

### 英文稿

英文稿不是中文稿的逐句翻译。它从产品评审室里 engineering、finance、admin、developer 的不同问题开场，以三个 ledger 分工来组织正文，并将六问改写为 screen review checklist。英文读者能独立理解文章，不需要依赖中文类比。

`meter / entitlement ledger / billing ledger` 的术语密度适合 product、FinOps 与工程管理读者；对 `amount due`、`live estimate` 和 `posted charge` 的区分也比首轮自然。

### 双语一致性

- 两稿都把 230 万 token 明确作为说明性场景，而非真实账单数据；
- 两稿都保留 Router 的厂商归属、计划范围和 cost 而非 usage 的度量类型；
- 两稿都把 GitHub `discountAmount` 写成金额，并另记权益数量/单位；
- 两稿都明确 OpenAI cost 不能证明最终发票；
- 两稿都把最小事件字段标为 Research Center 综合建议，而非跨厂商标准。

未发现中英文之间会导致不同事实判断或不同读者行动的冲突。

## 仍可优化但不阻断放行的细节

1. Cursor Daily Usage 的 `*Reqs` 字段当前是 raw usage event counters。若未来加入示例计算，应在相邻位置写明它们不是旧 request-based pricing 的 billable request units。
2. Admin API 实际依赖相应 Team API key 与权限。正文的“面向团队管理员 / users with team-admin access”作为读者限定可接受；若写操作步骤，宜进一步写成“持有相应 API key 权限的团队管理员”。
3. `posted/billed`、`adjusted/refunded` 是本文建议的通用展示标签，不是四家厂商共享的状态枚举。现稿已在事件合同前后声明这是综合 schema，视觉稿也应继续保留“示意状态轴”属性。
4. 英文题图 alt text 中的 “One concentrated receipt” 略显生硬；生成真实封面后可随视觉内容改成更具体的自然描述。这不属于正文内容问题。

## 阻断项

**无内容阻断项。**

题图占位是故意的流程状态，本轮不要求删除图片引用，也不因文件尚未生成扣内容分。下一步可进入封面生成与独立视觉审查；视觉应继续呈现 `usage → entitlement/discount → billing state` 的关系，并避免把 `estimated billable` 画成已经开票的 `amount due`。

## 最终放行判断

两篇候选在内容阶段达到 **87/90**，证据项 **24/25**，预计加入合格视觉后总分可稳定超过 **85/100**。结论为 **PASS**：可进入封面生成、视觉复核与后续各平台独立改写流程。

