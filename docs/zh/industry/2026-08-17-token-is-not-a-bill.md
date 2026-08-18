---
title: "Token 不是账单：AI Agent 成本界面必须分开使用量、包含额度与应付金额"
date: '2026-08-17'
column: industry-architecture
category: daily
article_type: practical-explainer
edition: research-center
research_question: "How should an AI agent product present usage, included entitlements, and billed cost so that users can make real spending decisions?"
summary: "Token 只说明资源消耗，不能单独回答套餐吸收了多少、当前有多少预计可计费金额，以及最终发票应付多少。一个可行动的 Agent 成本界面应把使用量、套餐权益与计费状态分开。"
sources:
  - research/manual-runs/2026-08-17-high-quality-article-pipeline/10-forum-demand-discovery-2026-08-18.md
  - research/manual-runs/2026-08-17-high-quality-article-pipeline/11-two-topic-deep-reading-and-fact-matrix.md
  - research/manual-runs/2026-08-17-high-quality-article-pipeline/12-two-topic-article-briefs.md
item_id: "MANUAL-20260817-COST"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-17-token-is-not-a-bill-cover.webp"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-17-token-is-not-a-bill-cover.webp"
  kicker="行业架构 · 研究文章"
  title="Token 不是账单：AI Agent 成本界面必须分开使用量、包含额度与应付金额"
  summary="Token 只说明资源消耗，不能单独回答套餐吸收了多少、当前有多少预计可计费金额，以及最终发票应付多少。一个可行动的 Agent 成本界面应把使用量、套餐权益与计费状态分开。"
  version="MANUAL-20260817-COST"
  status="Independent Editorial PASS · 2026-08-18"
  languageHref="/en/industry/2026-08-17-token-is-not-a-bill"
  languageLabel="English"
/>


# Token 不是账单：AI Agent 成本界面必须分开使用量、包含额度与应付金额

早上九点，你让 coding agent 修了一个测试。中午，它又读了半个仓库，试了三个模型。下午打开 Usage 页面，屏幕上写着：**2,300,000 tokens**。

这个数字可能非常精确，却没有回答你真正关心的问题：这些 token 已经包含在订阅里，还是月底还要付钱？如果换个模型，今天是省了还是更贵？团队里究竟是谁、哪个项目消耗了预算？

这不是某个用户不会换算。2026 年 7 月，Cursor Forum 一篇关于 Usage 页面从美元改成 token 的讨论中，多名用户连续提出同一类问题：他们失去了按天、按用户、按模型判断花费的能力。Cursor 员工在回复中解释，单纯显示美元也会引起误解：套餐内使用量按名义价格换算后，数字可能高于用户实际支付的订阅费；不同套餐和管理员权限能看到的数据也不同。[[1]](https://forum.cursor.com/t/usage-page-to-token-amount-what/167153)

因此，问题不是“token 还是美元”二选一。两种单一视图都会丢掉信息。一个真正能帮助人作决定的成本界面，至少需要三张小票。

## 第一张小票：我到底用了多少资源

Token 首先是一种资源计量。它能告诉工程师输入有多长、输出有多大、缓存是否生效，也能帮助定位某次 Agent 运行为什么突然变重。

但“用了多少”和“按什么计价”不是同一件事。FinOps Foundation 的 [FOCUS 规范](https://focus.finops.org/focus-specification/v1-3/)把 `Consumed Quantity` 与 `Pricing Quantity` 明确分开：前者关注资源或服务实际消耗，后者关注定价时使用的数量和单位。规范还分别定义了 Billed、Contracted、Effective 与 List Cost。[[2]](https://focus.finops.org/focus-columns/)

这看起来像财务系统里的繁琐字段，其实非常生活化。电表读数不是电费账单，手机用了多少流量也不等于本月还要补多少钱。套餐、阶梯价格、折扣和预付承诺都会改变最后的经济结果。Agent token 也一样。

所以第一张小票应回答：

- 输入、输出和缓存分别用了多少；
- 单位是什么，统计范围是一次请求、一次任务还是整个月；
- 使用的是哪个模型或路由模式；
- 数据是实时估算还是已经结算。

它适合做技术优化，却不应该被命名成“本次花费”。

## 第二张小票：套餐替我付了多少

订阅产品经常同时存在“已包含使用量”和“超出后按量付费”。这时，两个用户消耗相同 token，实际需要追加支付的金额可能完全不同。

[Cursor Teams 的公开说明](https://cursor.com/en-US/business/teams)把 seat 中的 included usage 与超出后的 on-demand usage 分开；面向团队管理员的 [Admin API](https://cursor.com/docs/account/teams/admin-api)也分别提供 subscription-included requests、usage-based requests 和成员 spend。逐 usage event 可以带上模型、token 明细与 usage kind；其中 `totalCents` 表示模型成本，`chargedCents` 才是用于和 spend 汇总对账的事件级收费字段。[[3]](https://cursor.com/docs/account/teams/admin-api)

GitHub 的官方计费报告给出了更直接的三分法：`quantity` 用于理解消耗量，`netAmount` 表示实际计费，`discountAmount` 表示被包含额度或折扣吸收的**金额价值**。权益本身还剩多少，则要连同它采用的 token、request、credit 或合同金额单位另外记录。[[4]](https://docs.github.com/en/billing/tutorials/automate-usage-reporting)

这张小票要告诉用户：

- 本周期有多少包含额度；
- 这次使用消耗了多少权益；
- 还有多少额度可用；
- “包含”是按 token、request、credit 还是合同金额计算；
- 显示的名义价值是否并非真实应付。

如果界面只显示一个美元数字，用户可能把“套餐替你吸收的名义价值”误认为下一张信用卡账单。只显示 token，则反过来让用户不知道权益还剩多少。两者都不够。

## 第三张小票：从预计可计费，到最终应付

第三张小票不能只有一个“费用”数字，还要说明数字走到了哪一步。实时页面通常先给出**预计可计费金额**；请求处理后可能形成已入账或已计费金额；供应商开票后才有**发票应付金额**；退款与月末修正又可能产生调整后金额。

这四个状态应该沿着同一条金额轴展示，而不是压成同义词：

```text
预计可计费 → 已入账/已计费 → 发票应付 → 调整/退款后
```

只有供应商明确标为已开票或等价最终结算状态的金额，才应该被称为“最终应付”。实时值应写成估算，并带上币种、计费主体、结算周期和更新时间。

OpenAI 的官方组织接口也没有假设 token 数量天然等于账单：usage 端点记录 input tokens、requests、project 或 user；costs 端点则返回带 `currency` 与 `value` 的 monetary amount。这个接口证明资源量与货币成本是不同对象，却不能单独证明某个实时 cost 已经成为最终发票。[[5]](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)

这种分离还有一个现实原因：模型路由会改变换算条件。面向 Teams 与 Enterprise 的 Cursor Router 文档说明，模型池会随时间变化，用户不能手选每一次实际路由；Cost 模式采用 bundled Auto pricing，而 Balance 与 Intelligence 按路由模型的费率计费。**据 Cursor 当前的厂商估算**，后两种模式的平均成本约为 Cost 的两倍，视模式可能达到约二至四倍。[[6]](https://cursor.com/docs/cursor-router)

这意味着“230 万 token × 一个固定单价”往往只是一个看起来确定的错误答案。输入、输出和缓存价格可能不同；实际模型可能变化；套餐可能先吸收一部分；合同价格又可能不同于公开 list price。

## 一个普通用户应该能问六个问题

不需要学习 FinOps 才能判断一个成本页面是否有用。打开它时，尝试回答下面六个问题：

1. 我今天实际用了什么——输入、输出、缓存，还是一个被换算过的 credit？
2. 这些使用量里，多少已经由套餐或合同包含？
3. 到目前为止，有多少只是预计可计费，又有多少已经入账？
4. 发票是否已经生成；若没有，页面为什么把实时估算叫成“应付”？
5. 我能否按用户、项目、模型或 Agent 任务找到成本来源？
6. 定价或路由规则变化后，历史数字是否仍使用当时的价格版本？

如果其中任何一问只能靠下载 CSV、猜套餐条款或自己维护换算脚本才能回答，产品提供的是数据，不是成本控制。

## 平台团队应保存什么

对建设 Agent 平台的团队，最小 cost event 不应只有 `total_tokens`。至少应保留：

```text
usage: input / output / cache quantity + unit
entitlement: unit + included / discounted quantity + included value + remaining balance
billing: estimated billable + posted/billed + invoiced due + adjusted/refunded amount
money: currency + payer/payee + settlement status + updated time
pricing: model + router mode + pricing version
scope: user + project + work order + request/run id
time: usage time + charge period + billing period
```

这不是 FOCUS、OpenAI、GitHub 或 Cursor 已经共同制定的行业 schema，而是本文根据这些独立来源提出的最小综合。它的价值在于让三个问题可以分别追溯：用了多少，套餐替你吸收了多少，以及一笔钱此刻只是估算、已经计费，还是已经进入发票。

## 边界：界面不能提前制造一张不存在的发票

实时 cost 仍可能与最终发票不同。退款、月末修正、承诺用量摊销、企业折扣和汇率都会让金额变化。好的界面应该标明状态与更新时间，而不是用更多小数位伪装确定性。

Token 也不应该消失。它仍然是定位上下文膨胀、缓存失效和模型效率的重要信号。真正的问题是把它独自放在“Usage”甚至“Cost”页面上，然后让用户负责补全套餐和账单语义。

最简单的产品原则是：**别让一个数字同时扮演电表、优惠券和信用卡账单。** Agent 平台越是采用动态模型、缓存和混合套餐，这三张小票就越需要同时存在。

## 来源

1. [Cursor Forum：Usage Page $$ to Token Amount? WHAT?](https://forum.cursor.com/t/usage-page-to-token-amount-what/167153)
2. [FinOps Open Cost and Usage Specification](https://focus.finops.org/focus-specification/v1-3/) 与 [FOCUS Column Library](https://focus.finops.org/focus-columns/)
3. [Cursor Admin API](https://cursor.com/docs/account/teams/admin-api) 与 [Cursor Teams](https://cursor.com/en-US/business/teams)
4. [GitHub：Automating usage reporting with the REST API](https://docs.github.com/en/billing/tutorials/automate-usage-reporting)
5. [OpenAI Organization Usage / Costs API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)
6. [Cursor Router Docs](https://cursor.com/docs/cursor-router)

