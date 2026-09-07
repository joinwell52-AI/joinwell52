---
title: Weekly 008 — 权限不是对象属性，而是一次关系
date: '2026-09-06'
column: digital-employee
category: weekly
article_type: research-brief
edition: research-center
research_question: '当 Agent 准备执行一个动作时，哪些事实必须被绑定在一起，才能说这一次动作真的获得了权限？'
summary: '8 月 31 日至 9 月 6 日的 15 篇已发布 Daily Research 反复指出同一个边界：installed、approved、trusted、verified、checkpointed 或稳定身份都不是可直接继承的执行权限。更可靠的模型是把 Authority 视为 Principal、Action、Target、Occurrence、Protocol、Policy Epoch 与 Evidence 共同构成的一次关系，并在真正执行前重新求值。'
sources:
  - 2026-08-31 through 2026-09-06 Daily Runtime V5 publications
  - research/intelligence/p2-runs/2026/09/2026-09-06-p2-special.json
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
cover: '/assets/covers/weekly-008-authority-is-a-relation-editorial-v3.webp'
---

<ArticleCover
  image="/assets/covers/weekly-008-authority-is-a-relation-editorial-v3.webp"
  kicker="Weekly Research · 008"
  title="权限不是对象属性，而是一次关系"
  summary="身份、批准和状态可以被保存；执行权必须针对这一次主体、动作、目标和发生实例重新成立。"
  version="W008"
  status="Published 2026-09-06"
  languageHref="/en/research/weekly/weekly-008"
  languageLabel="English"
/>

# Weekly 008 — 权限不是对象属性，而是一次关系

一个 Connector 已经安装，一个 Agent 已经获得角色，一个 Workspace 已被标记为可信，一个审批已经通过，一个 Checkpoint 可以恢复，一个 Credential Discovery 已经找到地址，一个稳定身份也已经存在。

把这些事实逐个看，它们都可能是正确的；把它们串成一句“所以这次动作可以执行”，结论却未必成立。

8 月 31 日至 9 月 6 日的 Daily Research 从 Standing Permission、Working Memory、Connector、Checkpoint、Delegation、OAuth Discovery、Human Approval、Recovery、Stable Identity 等不同机制反复碰到同一个问题：**我们很容易把一个关于对象的描述性事实，误当成一次具体动作的执行权限。**

上一期 Weekly 007 的结论是：Recovery 不是 Restoration，而是 Re-Admission。恢复后的状态必须重新经过当前 Authority、Ownership、Occurrence Identity 与 Replay Integrity 的准入。本周进一步发现，这个原则并不限于“恢复”。在正常安装、连接、授权、委派、审批和调用路径中也一样成立。

因此本周得到一个更一般的判断：

> **Authority 更适合被建模为一次关系，而不是附着在 User、Agent、Tool、Connector、Checkpoint 或 Credential 上的静态属性。**

换句话说，系统不应只问：

```text
is_admin = true?
connector_installed = true?
approved = true?
trusted = true?
checkpoint_valid = true?
```

它更需要问：

```text
这一个 Principal
是否可以在当前 Policy Epoch 下
对这一个 Target
执行这一个 Action
用于这一个 Occurrence
通过这一个 Protocol
并由这些当前 Evidence 支持？
```

只有后一个问题真正接近“这一次能不能做”。

## 本周证据范围：七个运行日，十五篇正式研究

本次综合只使用 **2026-08-31 至 2026-09-06** 已完成 Runtime 收口的 Daily Research。7 个运行日全部完成 Publication；其中 9 月 1 日是受控零输出日，当天没有合格 Publication Candidate，因此没有为了凑数量制造文章。其余 6 天共发布 **15 篇** Research Center 研究。

| 日期 | 数字员工 | 行业架构 | 开源工程 |
|---|---|---|---|
| 8/31 | Standing Rule 不是本次动作的 Authority | 重建出的角色不是 Authority 证明 | 一次成功 Rerun 不能证明 Repair |
| 9/1 | — | — | — |
| 9/2 | Token Budget 不是 Working Memory Evidence | Installed 不是 Authorized | 更小的 Skill 不等于同一个 Skill |
| 9/3 | Checkpoint 不是 Recovery Contract | Delegation 是 Stateful Authorization Program | Discovery 不能重定义 Credential Authority |
| 9/4 | — | — | Recovery Evidence 不是 Replay Authority |
| 9/5 | Judgment 不是 Effective Approval | — | Passing Tests 不是 Operational Capability |
| 9/6 | Risk 不能替你选择 Protocol | Recovery 是一条 Trajectory | Stable Identity 不授权 Destination |

这十五篇文章并不是同一个主题的重复改写。它们分别研究人类监督、上下文恢复、工具连接、Skill 压缩、委派链、Credential Discovery、审批、Replay、Operational Capability 与跨目的地身份绑定。正因为研究对象不同，却持续出现同一种失配，本周才值得把它提升为更一般的架构问题。

## 最常见的错误：把“关于对象的真话”升级成“关于动作的权限”

权限系统最危险的错误不一定来自一个明显的 `allow_all`。更常见的是几个各自正确的事实，在组合时发生了未经授权的语义升级。

例如：

```text
Connector 已安装
→ Agent 拥有 Connector
→ Agent 可以访问目标资源
```

9 月 2 日的行业架构研究把这条链拆开了。Administrative Availability、Configured Agent Capability、Acting Principal / Account、Target-resource Permission 与 Runtime Policy 是不同命题。一个连接器出现在系统里，只能回答“能力入口存在”；它并不自动回答“当前主体对这个目标有没有权限”。

同样：

```text
AI 判断可以批准
→ 这次批准已经具有执行效力
```

9 月 5 日的数字员工研究又把它拆开。Approval Assessment 与真正能改变目标系统状态的 Sign-off Authority 不是一回事。模型可以给出“建议批准”的判断，但 Authority-bearing Approval 仍需要明确的主体、作用域和生效边界。

再比如：

```text
稳定身份已经建立
→ 可以把这个身份用于任何 Destination
```

9 月 6 日的工程研究指出，Identity Stability 只解决“你是谁”的连续性，不解决“你对这个 Destination 能做什么”。如果目标资源、Issuer、Audience 或 Policy Context 变化，稳定身份本身不会自动产生新的授权关系。

这些例子共同说明：

> **对象属性是 Authority 的输入，不是 Authority 本身。**

## 三种事实必须分账：描述事实、证据事实、权限事实

一个可靠的 Agent Runtime 至少应该把三类事实分开保存。

### 第一类：描述事实

它们告诉系统“现在有什么”。例如：

- Connector 已安装；
- Skill 已加载；
- Checkpoint 存在；
- Principal Identity 已解析；
- Workspace Trust 状态为某个值；
- 某个 Approval Record 存在。

这些是状态事实。它们很重要，但通常不应该直接驱动高风险动作。

### 第二类：证据事实

它们告诉系统“为什么我们相信某个状态或判断”。例如：

- 这个身份由哪个 Issuer 签发；
- Checkpoint 来自哪个 Occurrence；
- Approval 由谁、在什么时间、针对什么对象产生；
- Tool Result 对应哪一个调用；
- Recovery Evidence 是否来自同一条权威历史；
- 一个 Test Pass 覆盖的究竟是什么条件。

9 月 5 日工程文章“Passing Tests 不是 Operational Capability”非常适合说明这一点。测试可以是很强的证据，但只有在我们知道它测试了哪一个运行边界时，它才有资格支持 Operational Capability；一个 `PASS` 标签本身不是能力事实。

### 第三类：权限事实

这是最窄、也最需要动态求值的一层：

> **在当前条件下，这一个 Principal 是否可以执行这一个 Action 到这一个 Target？**

它必须消费前两类事实，但不能简单复制它们。

一个实用的 Authority Relation 可以表示成：

```text
Authority = Admit(
  principal,
  action,
  target,
  occurrence,
  protocol,
  policy_epoch,
  evidence
)
```

这里任何一个关键维度发生变化，旧结论都不应该被默认复用。

## Principal：角色不是权限的替代品

8 月 31 日的行业架构研究关注 Context Reconstruction：如果低权限来源的内容在重建时被重新放进了更高权限的位置，后续 Permission Review 甚至可能“正确地评估风险”，但它评估的是一个已经被污染的 Authority Premise。

这提醒我们，Principal 不只是一个字符串或角色标签。它至少需要回答：

- 当前行动者是谁；
- 这个身份由谁铸造或验证；
- 当前角色来自哪里；
- 角色是否仍然有效；
- 是否发生了 Worker Replacement、Account Switch 或 Delegation。

如果系统只把 `role=admin` 放进恢复状态，重新加载以后看到 `admin` 就继续执行，那么它保存的是一个描述值，而不是当前 Authority。

## Action：同一个 Tool，不同动作不是同一份授权

Standing Permission 最容易诱导系统把动作粒度做得过粗。

8 月 31 日数字员工文章研究了用户自行编写的 Permission Policy 与 occurrence-specific Runtime Commitment。已有规则可以减少重复 Prompt，但研究样本同时显示，大量用户规则仍然保留 `Ask`，说明用户自己也会把“类别级偏好”和“这一次真正执行”分开。

因此：

```text
允许使用 GitHub
```

不能自然扩张成：

```text
允许删除这个仓库
允许合并这个 PR
允许向这个分支写入
允许代表这个账号做当前动作
```

更可靠的实现是在 Action 层保持足够精细的语义，而不是让 Tool Name 承担全部授权意义。

## Target：能力入口和目标资源必须分开

9 月 2 日“Installed 不是 Authorized”和 9 月 6 日“Stable Identity 不授权 Destination”从两个方向指向同一个问题：**Target 是权限关系的一部分。**

系统知道 Agent 可以调用某个 Connector，只能证明 Connector Capability 存在；真正的 Target 可能是：

- 一个具体邮箱；
- 一个 GitHub Repository；
- 一个 Calendar；
- 一个内部数据库；
- 一个 MCP Server；
- 某个资源中的具体对象。

Target 变化意味着授权关系可能变化。对 A 仓库的 Push 权限不能通过“GitHub 已连接”自然迁移成对 B 仓库的 Push 权限。

## Occurrence：同一个任务再次发生，也不是同一次授权

本周多个 Recovery 研究都强调 Occurrence Identity。

9 月 3 日的 Checkpoint 研究把“能恢复状态”和“恢复哪一个执行实例”区分开；9 月 4 日进一步说明 Recovery Evidence 不能自动成为 Replay Authority。如果上一次 Tool Call 已经发生、是否发生未知，或者审批只针对一个特定中断点，那么新 Worker 不能仅因为读到了旧状态就重放动作。

所以 Authority Relation 需要一个能区分具体发生实例的标识：

```text
workflow_id
+ branch_id
+ occurrence_id
```

或者其它等价的复合身份。

这使系统能够回答：这份 Approval 到底是在批准“这个动作类型”，还是只批准“这一个尚未执行的 occurrence”？

## Protocol：风险大小不能替系统选择授权协议

9 月 6 日数字员工研究给出了一个容易被忽略的边界：Risk Score 可以影响审核强度，但它不能单独决定协议。

同一个高风险动作，在不同环境里可能要求：

- Runtime Prompt；
- Human Approval；
- OAuth / delegated consent；
- Host-minted Capability；
- 双人审批；
- 完全禁止。

Protocol 本身应该由 Authority Context、Action Type、Target、Policy 和系统能力共同决定，而不是让一个风险分数直接映射成“自动允许 / 自动拒绝”。

这也解释了 9 月 3 日工程文章为什么强调 Discovery 不能重定义 Credential Authority。Discovery 可以告诉客户端去哪里找授权服务，却不应该在 Redirect、Metadata 或发现路径中让低信任输入重新定义 Issuer 权威。

## Policy Epoch：旧的允许结论需要有失效机制

如果 Permission 可以被撤销、Workspace Trust 可以变化、目标 Resource ACL 会调整、用户可以切换账号，那么一个永远不过期的 `approved=true` 几乎一定过于粗糙。

Authority Relation 应该携带 Policy Epoch 或等价版本身份，使 Runtime 能判断：

```text
旧授权结论
是否仍然属于当前策略世界？
```

这与 Weekly 007 的 Re-Admission 直接相连，但本周把适用范围扩大到了正常运行：即便没有发生 Crash 或 Recovery，只要 Authority Context 发生了可影响决策的变化，旧结论也应重新求值。

## Recovery 是一条 Trajectory，不是一个 Snapshot

9 月 6 日行业架构文章给本周关系模型补上了时间维度：Recovery 不是从一个静态状态跳回另一个静态状态，而是一条需要连续判断的 Trajectory。

一个恢复过程可能经过：

```text
state loaded
→ evidence reconciled
→ old ownership closed
→ authority refreshed
→ occurrence rebound
→ capability materialized
→ action resumed
```

在这条路径上，Authority 不是一枚从旧 Checkpoint 里取出的 Token。它在不同 Transition Point 可能有不同值。

这也是为什么 9 月 4 日的工程文章把 Recovery Evidence 与 Replay Authority 分开：我们可以知道“以前发生过什么”，却仍然没有得到“现在可以再次做什么”的授权。

因此更严格的模型不是：

```text
checkpoint.valid == true
→ resume
```

而是：

```text
reconstruct
→ reconcile facts
→ close or transfer ownership
→ re-evaluate authority relation
→ materialize capability
→ resume bounded occurrence
```

## 不是所有“等价物”都真能保持关系语义

本周还有三篇文章表面上不是授权研究，却给 Relation Model 提供了重要的反例。

### Token Budget 不是 Working Memory Evidence

9 月 2 日数字员工文章发现，同样的 Token Budget 不意味着相同的 Delivered Context，更不意味着相同的 Memory Management Cost。也就是说，一个方便测量的 Proxy 不能自动替代真正需要治理的命题。

### 更小的 Skill 不等于同一个 Skill

同日工程研究指出，Skill Compression 如果破坏 Routing 或 Public Callable-entry Contract，即使文本更短，也已经不再是同一个可调用能力。语义等价需要在关系边界上检查，而不能只比较体积。

### Passing Tests 不是 Operational Capability

9 月 5 日工程文章则提醒我们，测试通过必须绑定到实际环境、入口、依赖与运行条件。否则 `PASS` 只是一个不完整的 Evidence Attribute。

这三件事和 Authority 有相同结构：**不要把一个容易保存、容易显示、容易计算的属性，升级成它所代理的更强命题。**

## 一个可执行的设计：Authority Relation Envelope

把本周证据收敛到工程上，可以得到一个比 `approved=true` 更有用的最小记录：

```text
AuthorityRelationEnvelope
├─ principal
│  ├─ subject_id
│  ├─ issuer / account
│  └─ delegated_from
├─ action
│  ├─ capability
│  └─ operation
├─ target
│  ├─ resource_id
│  └─ destination / audience
├─ occurrence
│  ├─ workflow_id
│  ├─ branch_id
│  └─ occurrence_id
├─ protocol
│  ├─ approval_type
│  └─ credential / capability path
├─ policy
│  ├─ policy_epoch
│  └─ trust context
├─ evidence
│  ├─ source refs
│  ├─ decision refs
│  └─ verification refs
└─ result
   ├─ admitted / denied / paused
   ├─ issued_at
   └─ expires / invalidation rule
```

它不是要求每个低风险动作都写一个巨大 JSON，而是在说明**哪些维度不能在架构上被混为一个布尔值**。实现可以做缓存、索引和压缩，只要 Relation Identity 与失效条件没有被丢掉。

## 这不意味着每次 Tool Call 都必须弹窗

把 Authority 动态化不等于把系统做成人工审批地狱。

如果某类动作满足：

- Principal 没变；
- Action Scope 没变；
- Target 集合明确；
- Policy Epoch 没变；
- Protocol 允许复用；
- Occurrence 复用符合合同；
- Grant 尚未过期或撤销；

那么 Runtime 完全可以复用一个有边界的 Authority Relation，而不是每次重新让人点击。

关键不是“永远重新问”，而是：

> **复用的必须是一个有身份、有作用域、有失效条件的关系结论，而不是一个脱离上下文的 `approved=true`。**

## 目前仍然不能下的结论

本周证据足以支持关系模型作为一个工程抽象，但还不足以声称存在一套适用于所有 Agent 系统的统一授权协议。

我们仍不知道：

- 不同风险等级应当采用多细的 Action Granularity；
- 哪些 Authority Relation 可以安全缓存，缓存多久；
- 多 Agent Delegation 中 Principal Chain 应如何在深层嵌套时压缩而不丢失约束；
- External SaaS、MCP、Local Tool 与 Native App 应共享多少协议层；
- Policy Epoch、Occurrence Identity 与 Target Identity 的最小可互操作格式是什么。

9 月 2 日的 Connector 研究本身也明确没有得到“通用端到端授权协议”的证据。关系模型回答的是**应该保留什么语义**，不是宣称已经有唯一标准实现。

## P2：本周有一项专项触发，但它不进入这篇公开论证

本周 P2 通道完成 **6/6** 个到期对象的检查。`yzhao062/pyod` 的 `v3.6.5` 相对上一月度检查点出现实质 Benchmark / Evaluation 变化，以 9/10 达到专项阈值，因此执行了本轮唯一允许的完整 P2 Special Study，并形成 `Experiment Candidate`。

这份专项报告当前仍是 **Pending Review** 的内部研究资产。按照 P2 Publication Boundary，它不会因为 Weekly 执行完成而自动变成公开文章，也没有被用作本篇“Authority Relation”判断的公共证据。它只在这里作为流程事实被记录：P2 发现了一项值得实验验证的 Benchmark Validity 问题，后续是否进入公开研究，需要单独审核和正常写作/证据/编辑门禁。

其余 P2 对象中，Aegis 与 agent-style 有仓库变化但未触及各自声明的机制触发条件；agent-audit、cs-paper-checklist 与 anomaly-detection-resources 没有实质检查点变化。

## 下一周最值得验证的四件事

本周的关系模型已经足够具体，可以被实验反驳，而不是停留在口号。

第一，测试 **Authority Cache**：缓存一个包含 Principal、Action、Target、Policy Epoch 的 Grant，分别改变 Target、Account 和 Policy Epoch，验证旧 Grant 是否必然失效，而未变化维度是否可以安全复用。

第二，测试 **Delegation Composition**：让 Root Agent 连续委派三层，检查每次委派是否只收窄而不扩大 Action / Target Scope，并验证累积约束是否仍可追溯到 Root Objective。

第三，测试 **Recovery Transition**：在 Tool Call 前、提交后响应丢失、Human Approval Pending 三个位置分别中断，验证 Recovery 能否区分“只需恢复上下文”“必须先对账”“必须等待新 Authorization”三种不同 Relation State。

第四，测试 **Protocol Selection**：给相同 Action 设置不同 Target、Risk、Credential Path 与 Policy Context，验证 Risk Score 是否只影响审核强度，而不会单独决定使用哪个 Authorization Protocol。

如果这些测试显示，一个简单的对象级 Flag 在所有变化条件下都能保持相同安全语义，那么本周的 Relation Model 就需要收缩。反之，如果错误集中发生在 Relation Dimension 被丢失或错误复用的位置，这个抽象就获得了更强的工程支持。

## 结论

过去几周我们不断把一些看上去相近的概念拆开：状态不是权限，证据不是授权，恢复不是复原，Lineage 也不是当前 Admission。

本周把这些拆分进一步压缩成一个更通用的设计原则：

> **权限不是“某个对象拥有什么”的永久属性，而是“某个主体在当前条件下对某个目标执行某个动作”的关系结论。**

身份、Connector、Checkpoint、Approval、Trust、Test Result、Risk Score 都可以成为这条关系的证据或输入，但没有哪一个应该单独替代这条关系。

对于长期运行的 Agent、数字员工和多 Agent Runtime，这个区别决定系统究竟是在保存“过去曾经允许过什么”，还是在每一次真正行动前回答“现在、这里、由这个主体，是否仍然可以做这件事”。
