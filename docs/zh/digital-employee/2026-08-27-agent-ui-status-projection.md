---
title: "一盏绿灯到底在说什么？从 Sutando 的协作者进度缺失看 Agent UI 状态投影边界"
date: '2026-08-27'
column: digital-employee
category: daily
article_type: comparative-technical-analysis
edition: research-center
research_question: "权限身份、网关连通性、会话活性、执行进度、报告到达和任务生命周期，能否被同一个 UI 状态或绿灯代替？"
summary: "从 Sutando 一次“协作者确实在执行却没有进度流”的公开反例出发，把 Agent UI 状态视为一份投影合同：每个状态必须说明来源、对象、时效、能证明什么，以及冲突时如何失败。"
sources: "/zh/research/evidence/2026-08-27-runtime-semantics-evidence-pack"
project_relevance: first-party-research
item_id: "RSEM-20260827-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-27-agent-ui-status-projection-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-27-agent-ui-status-projection-cover.png"
  kicker="数字员工 · 工程研究"
  title="一盏绿灯到底在说什么？从 Sutando 的协作者进度缺失看 Agent UI 状态投影边界"
  summary="状态不是事实源，而是事实的投影。一个可靠的 Agent 面板必须说明每盏灯来自哪里、针对什么对象、在什么时间窗口内成立，以及它不能替谁下结论。"
  version="RSEM-20260827-03"
  status="工程研究 · 2026-08-27"
  languageHref="/en/digital-employee/2026-08-27-agent-ui-status-projection"
  languageLabel="English"
/>

# 一盏绿灯到底在说什么？从 Sutando 的协作者进度缺失看 Agent UI 状态投影边界

一个协作者正在真实的 live session 里工作，也持续写入进度文件，团队页面却什么都没有显示。

不是网络断了，不是 Agent 没启动，也不是进度数据没有产生。问题只出在一个看似合理的条件：页面先问“是不是 owner”，不是 owner 就不推送进度。

这是 Sutando 的 [PR #3432](https://github.com/sonichi/sutando/pull/3432) 记录的公开反例。原来的 `should_stream_task()` 只允许 owner 进入 progress streaming。它背后的理由并不荒唐：普通 non-owner team task 运行在只读 sandbox，不会更新 `core-status.json`，于是没有 live step 可以展示。真正的缺陷是 collaborator 恰好是这个规则的例外——协作者不走那条只读 sandbox 路径，会真实写入状态文件，却仍被“不是 owner”这个条件挡在 UI 外。

也就是说，页面做错的不是一个颜色，而是一种**事实替换**：

> **把“角色/权限身份”误当成了“是否存在实时执行”。**

修复后的差异很小：`team + collaborator` 从 false 变为 true；普通 team 仍为 false；owner 仍为 true。PR 新增四个回归用例，但作者也明确保留了一个验证缺口：尚未完成 bridge 重启后的真实端到端见证，因此该 PR 在本文复核时仍是开放状态。

这个例子很适合拿来问一个更一般的问题：

> **Agent 控制台上的“在线”“执行中”“有进度”“已完成”，到底分别在证明什么？**

## 1. UI 状态不是事实源，而是一份投影合同

多 Agent 面板很容易把许多底层事实压成一个 `status`。但这些事实本来来自不同来源、不同对象、不同时间窗口：

| 事实轴 | 它真正回答的问题 | 不能替代什么 |
| --- | --- | --- |
| Viewer authority | 当前用户能不能看这条信息？ | 任务在哪里执行 |
| Gateway connectivity | 浏览器/手机能否连到当前 Runtime？ | 某个 Session 是否还活着 |
| Session liveness | 这次执行是否还有新鲜、可验证活动？ | 任务是否会成功交付 |
| Progress | 最近有没有可解释的工作进展？ | 工作内容是否正确 |
| REPORT arrival | 执行结果是否已经形成正式报告？ | 报告是否被接受 |
| Lifecycle | 任务当前处于 inbox / active / review / done 哪一层？ | 关联证据是否没有冲突 |

这些轴可以同时成立，也可以同时冲突。

例如：Gateway 可以 online，但 job heartbeat 已经 stale；Session 可以 completed，但 REPORT 尚未到达；workflow 可以 `done`，同时某条审计证据仍然 `conflict`；用户也可以有权限查看一个任务，却不是这个任务的执行者。

因此，一个可靠的 UI 状态应该被理解成：

**底层事实 → 明确投影规则 → 页面语义**

而不是：

**页面颜色 → 反推系统真相**

这一区别很关键。前者要求页面说明自己依据什么；后者会让“绿灯”逐渐变成一个没有来源的总判断。

## 2. Sutando 的问题为什么不只是一个 progress bug？

Sutando #3432 的直接问题是 collaborator progress 没有流出来。但更值得注意的是条件之间发生了错位：

```text
access tier / owner identity
        ↓ 被错误替代为
execution placement / live progress existence
```

原规则对普通 team task 的解释是成立的，却被扩展到了一个不满足同样运行条件的 collaborator。

这类问题在 Agent 产品里很常见，因为很多字段在正常路径中高度相关：owner 通常也是执行者；online 通常伴随活跃 Session；completed 通常很快会有 REPORT；review 通常意味着证据已经聚合。

可“通常一起出现”不等于“可以互相替代”。真正危险的 bug 往往就出现在例外组合：

- 非 owner，但确实存在 fresh live session；
- Gateway online，但当前 job 已失活；
- Session completed，但正式 REPORT 尚未写入；
- workflow `done`，但某条 evidence association 仍冲突。

因此，UI 投影测试不应只覆盖 happy path，还要专门制造这些**轴之间不再相关的反例组合**。

## 3. 我们自己的审计：五类 Session 观察必须先分开

Sutando 的 PR 不能证明我们存在同样的 collaborator bug。正确的做法不是把外部缺陷直接映射到自己，而是回到自己的 read path，检查有没有把不同事实压成同一个结论。

在我们当前审计到的 Session 观察路径中，存在五种互斥输出：

```text
executing_with_progress
executing_without_fine_progress
session_without_live_execution
completed_waiting_report
technical_error
```

它们背后的判断顺序很重要：

1. Session `failed` 或 recovery 已是 `session_lost` → `technical_error`；
2. Session `completed` 但正式 REPORT 尚未写入 → `completed_waiting_report`；
3. 不是 `running` → 不投影为执行状态；
4. `running` 但没有 live 证据 → `session_without_live_execution`；
5. `running + live` 再根据是否有细粒度 progress 区分前两类。

这说明 UI 在生成文案之前，至少可以先拒绝几个常见的错误升级：

- 没有细粒度 progress ≠ 执行失败；
- 有 Session 记录 ≠ 仍在实时执行；
- Session completed ≠ 已正式交付；
- technical error ≠ 业务任务被拒绝。

第一方源测试中的一个定向 test 实际包含 **5 个分类断言**。早先把它写成“1/1”虽然字面没错，却容易让读者误以为只有一个状态被验证；更准确的口径应该是：**一个定向 test case，覆盖五种分类结果。**

## 4. 公开证据现在可以自己重跑，而不只看我们描述

为了让这篇文章的核心分类不只停留在私有源码和文字说明里，我们把 R3 物化成了三个公开、脱敏的附件：

- [R3 五类 Session 观察 fixture](/assets/evidence/2026-08-27-r3-ui-status-projection-fixture.json)
- [R3 UI projection Reader](/assets/evidence/2026-08-27-r3-ui-status-projection-reader.mjs)
- [R3 check script](/assets/evidence/2026-08-27-r3-ui-status-projection-check.mjs)

公开 fixture 提供五条输入，每条对应一种已披露语义；Reader 按公开判断顺序复现分类合同；check script 对五条记录逐条检查 `actual === expected`，并同时核对五类计数。

运行：

```text
node 2026-08-27-r3-ui-status-projection-check.mjs
```

预期结果：

```json
{"fixture":"deidentified_runtime_session_observation","assertions":5,"status":"PASS"}
```

这里的边界必须讲清楚：**这个公开 Reader 是披露合同的独立复现器，不是私有生产源码。五条公开断言也不是桌面端、PWA、权限过滤和完整交付链的端到端认证。**

它真正增加的是可复核性：外部读者现在不需要相信一句“我们有五类状态”，可以直接检查五条输入怎样被分类。

## 5. 冲突应该是一等输出，而不是 UI 要消灭的噪声

状态投影还有另一类危险：当不同来源互相矛盾时，页面为了“整洁”悄悄选一个最顺眼的答案。

我们更倾向于相反的做法：**来源冲突本身就是一个需要保留的事实。**

例如，在已审计路径中：

- canonical workflow 缺失或来源互相冲突时，可以得到 `projection_conflict`，而不是从 Runtime、REPORT 或验收字段猜一个生命周期；
- Gateway 是否 online 需要 Runtime、磁盘配置和 context identity 相互对齐，实例身份不一致时不能默认发布绿色；
- workflow 已经 `done` 时，一条 evidence conflict 仍可以单独保留，不能因为 lifecycle 已终态就吞掉审计冲突。

这背后是一条很简单的原则：

> **一个事实轴的确定性，不能替另一个事实轴消除不确定性。**

`done` 回答任务位置；`evidence conflict` 回答证据关联。把两者压成一个状态，无论最后显示绿还是红，都会损失信息。

## 6. 每一盏灯至少应该声明五件事

如果状态只是一个颜色 + 文案，开发者很容易在组件里继续拼布尔值。更稳的做法是把每个状态当成一个小型 projection contract，至少声明：

| 声明 | 例子 |
| --- | --- |
| Source | `Gateway online` 来自 Runtime / disk / context identity 的一致性，而不是 REPORT |
| Subject | 它描述的是 Gateway、Session、Task 还是 REPORT |
| Freshness | 这个判断针对哪个时间窗口或版本成立 |
| Establishes / does not establish | 能证明连接可用；不能证明 Session 活着或任务已验收 |
| Conflict policy | 来源冲突时显示 conflict / unknown，而不是回退成绿色 |

这五项一旦明确，很多 UI bug 会从“颜色不对”变成更容易测试的问题：

- viewer 不是 owner，但有权限且存在 fresh local session，progress 会不会被错误隐藏？
- Gateway online、job heartbeat stale，页面能否同时展示“连接可用”和“执行失活”？
- Session completed、REPORT 未到，是否停在 waiting-report，而不是直接 completed-delivery？
- workflow `done`、evidence conflict，两个事实能否同时存在？
- Runtime 与磁盘实例身份不一致，远程页面会不会继续把旧实例标成当前？

这些测试不需要先发明一个更大的全局状态机。它们只要求：**每个条件只回答自己拥有证据的问题。**

## 7. 绿色不是结论，只是一个有范围的投影

真正好的 Agent 面板当然需要简单。用户不应该读十几行内部状态才能知道系统现在大概怎样。

但简单不等于把六种事实压成一个万能绿灯。Sutando 的 collaborator bug 很有代表性：一个原本正确的理由，只要被应用到错误对象上，就足以把真实执行隐藏掉。

我们的本地审计也只支持一个有限结论：Session 活性、progress、REPORT 等待和 technical error 可以先拆开；冲突可以保留为独立轴；这些规则可以被定向测试和公开复现。它**不支持**“所有 UI / PWA / 权限组合都已经正确”的更强主张。

所以，下次看到一个 Agent 状态写着“在线”或“执行中”，更有价值的问题不是“它是不是绿色”，而是：

> **这条状态来自哪一个事实源？描述哪个对象？对哪个时间窗口有效？它证明了什么，又明确不能证明什么？**

如果页面答不出这些问题，这盏灯就承担了超过自己证据范围的权力。

---

## 公开证据

- [Runtime 语义三篇文章：公开证据包](/zh/research/evidence/2026-08-27-runtime-semantics-evidence-pack)
- [R3 五类 Session 观察 fixture](/assets/evidence/2026-08-27-r3-ui-status-projection-fixture.json)
- [R3 UI projection Reader](/assets/evidence/2026-08-27-r3-ui-status-projection-reader.mjs)
- [R3 check script](/assets/evidence/2026-08-27-r3-ui-status-projection-check.mjs)

## 来源与证据边界

- [Sutando PR #3432](https://github.com/sonichi/sutando/pull/3432) 在本文复核时仍为开放 PR。本文只使用它作为“access tier / role identity 不能替代 execution placement / live progress”的公开反例。PR 的四个回归用例是作者报告；作者同时明确说明尚未完成 bridge 重启后的真实端到端见证，因此本文不把该修复描述为已经完整生产验证。
- 第一方 R3 证据支持五类 Session 观察语义、对应定向源测试和公开脱敏复现器。公开 Reader 复现的是披露合同，不是私有产品源码；它不证明全部 Web Panel、桌面端、PWA、Viewer authority 或权限过滤路径都已经通过完整正交性审计。
- 本文的核心结论是关于**投影边界**：Viewer authority、Gateway connectivity、Session liveness、progress、REPORT arrival、lifecycle 与 evidence conflict 应分别保留来源和语义。本文不据此评价 Sutando 或 CodeFlowMu 的整体可靠性。
