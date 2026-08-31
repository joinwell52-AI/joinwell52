---
title: "会话没断，账号已经变了：Agent Runtime 为什么不能把对话连续当成授权连续"
date: '2026-08-31'
updated: '2026-08-31'
column: open-source-engineering
category: daily
article_type: comparative-engineering-analysis
edition: research-center
research_question: "跨 Session 恢复时，对话、精确操作授权、执行账号/主身份和证据归属为什么必须各自核验？"
summary: "11 组审批消费对照与 8 组技能会话绑定实验显示：session 变化本身不足以使精确批准失效，旧任务也不能无条件继承授权。对话连续、操作授权连续、执行身份连续和证据归属连续必须分别核验；真实 provider 账号切换仍是待验证边界。"
sources: "/zh/research/evidence/2026-08-31-runtime-continuity"
project_relevance: substantive-relationship
item_id: "RCR-20260831-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-31-session-principal-continuity-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-31-session-principal-continuity-cover.png"
  kicker="Runtime 连续性研究 · 02"
  title="会话没断，账号已经变了"
  summary="对话连续不等于原批准、执行身份和证据归属仍连续。"
  version="RCR-20260831-02"
  status="比较工程研究 · 2026-08-31"
  languageHref="/en/engineering/2026-08-31-session-principal-continuity"
  languageLabel="English"
/>

# 会话没断，账号已经变了

假设一个 Agent 等到了人工批准，却已经因为中断换了一个 session。它能不能继续原来的操作？

“session 变了，必须重新批准”看似安全，却可能把正常恢复变成审批死循环。“还是同一项任务，当然沿用”则走向另一端：任务编号没变，不代表当前动作、调用者和目标都没变。

这两个答案都少了一层判断：**到底要延续什么——对话、任务责任、操作授权、执行身份，还是证据归属？**

我们开发和维护的 CodeFlowMu 是本地多 Agent 协作系统，让不同角色的 Agent 围绕工程任务工作，并管理会话、工具执行、人工审批和结果记录。任务可能跨越多个会话，所以我们必须分别回答“新会话还能做什么”“现在由哪个 provider / host principal 执行”和“后续记录属于谁”，不能只把对话接起来。

对使用这类系统的开发者和审批者，研究价值在于划清“可以延续”和“必须重验”的条件：正常恢复不应无故增加人工批准，调用者或操作目标变化也不能仅凭旧任务编号沿用权限。这需要对照哪些变化被接受、哪些被拒绝，以及调用记录能否证明归属。验证已有保护同样有价值——它能帮助我们排除不必要的整体重构，把后续实验集中到尚未验证的账号切换条件上。

本文把连续性拆成四层：

- **对话连续性**：是否仍是同一段对话或工作上下文；
- **操作授权连续性**：原批准是否仍覆盖当前精确操作；
- **执行身份连续性**：现在到底是哪一个 provider account、service principal 或 host identity 在执行；
- **证据归属连续性**：调用和证据最终归属于哪个 session、task、thread 与 agent。

这次研究先检查已有机制，再用固定基线做两组对照：11 种审批消费条件，8 种技能调用归属条件。结果没有支持“恢复机制整体不完善”的宽泛结论，反而表明，已有的连续性保护应当被保留，再把没有验证过的执行身份边界单独提出。外部产品增加一项功能，不是我们立刻启动开发的理由。

## 1. 外部变化提出了问题，没有替我们证明缺陷

[Superset](https://www.ycombinator.com/companies/superset) 是 YC 支持的开发工具项目，做的是多 Agent 编程工作台：开发者可以在一个桌面界面中管理并行工作的 Claude Code、Codex 等编程 Agent。这里的 Superset 不是数据可视化工具 Apache Superset。它要处理的是开发者换账号后，怎样保留已有工作上下文的问题。

Superset #6970 在切换默认账号后，提供重启运行中 Agent 的流程：先确认，再重启终端进程，以已有 CLI session ID 继续同一对话，并让新进程读取新登录状态。该 PR 还以两个真实 Claude 账号做了手工 QA：同一对话可恢复，但新的进程环境已携带新账号。它因此说明“对话连续、执行账号变化”是一个真实恢复场景，而不是理论假设；本文没有自行完成真实双账号实验，也不把它写成 CodeFlowMu 的验证结果。[Superset #6970](https://github.com/superset-sh/superset/pull/6970)

另一个对照是 [OpenAI Codex](https://github.com/openai/codex)，即 OpenAI 的编程 Agent；本文引用其公开代码中的恢复机制，而不是模型能力榜单。两项变更给出了不同角度：自动目标续跑保留可信 root/parent turn lineage，外部上下文或目标变化会使旧 lineage 失效；工作目录恢复则只采用归属于当前 thread 的 settings snapshot，不让 legacy 或未归属快照覆盖启动目录。[目标续跑归属](https://github.com/openai/codex/commit/4210c08defe92fe8828f789b6f9fda287ad3709e)、[工作目录快照归属](https://github.com/openai/codex/commit/f5636bb733c4653a6b91413fed1aaf8842374f2e)

这些实现并不是同一种功能，但共同提醒我们：旧状态被保存下来，只说明它可读取；它是否仍可被当前运行继承，需要另一份合同。**Codex 在这里处理的是状态归属和恢复语义，不是人工审批授权；本文只借它说明“历史可读取”与“当前可继承”必须分开判断。** 这个问题应当回到自家入口、上下文来源和证据记录上验证。

## 2. Session 变化本身，不足以使旧批准失效

实验固定 main `f0f42f01`，直接调用真实 `OperationApprovalService`。每个场景使用独立审批记录：先由 ADMIN 批准一项合成高影响操作，再单独改变一个消费条件。实验只消费授权，不执行远端动作。[授权矩阵](evidence/fixtures/authorization.json)

| 改变条件 | 结果 | 能说明什么 |
|---|---|---|
| 不改变，原 session 消费 | 接受 | 正常路径有效 |
| session-1 → session-2，其余绑定与动作相同 | 接受，记录 session-2 | 正常恢复可沿用匹配的批准 |
| project 不匹配 | 不接受 | 项目边界有效 |
| agent 不匹配 | 不接受 | 调用者边界有效 |
| task 不匹配 | 不接受 | 任务边界有效 |
| thread 不匹配 | 不接受 | 线程边界有效 |
| role 不匹配 | 不接受 | 角色边界有效 |
| operation fingerprint 不匹配 | 不接受 | 精确操作匹配有效 |
| session 为空 | 不接受 | 无会话标识不能走该消费路径 |
| 目标改变 | 不接受 | 目标变化进入请求摘要判断 |
| 请求 snapshot 改变 | 不接受 | 操作快照变化进入摘要判断 |

两条接受路径再次消费，都得到 `APPROVAL_ALREADY_CONSUMED`。其余九种条件都没有取得授权；这里是“不接受当前匹配”，不等于发生了九种执行异常。

![两只对齐的钴蓝咬合环被同一晶体核心和紫色细芯穿过，右侧琥珀环错位](/assets/figures/2026-08-31-session-principal-continuity-alignment.png)

*图 1：允许恢复依赖一组匹配条件，而不是 session 字符串本身不变；错位环只表示当前条件不匹配，不表示所有新会话都应重批。图不替代 11 组授权矩阵。来源：RCR-20260831 E-B1 脱敏授权矩阵。*

源码解释了为什么第二行不是漏洞：操作摘要有意不把 session 字符串作为不可变化条件；消费时校验项目、操作指纹、agent、task、thread 和 role，要求原会话与当前会话标识非空，并把实际消费会话写进回执。**批准绑定的是受约束的操作身份，而不是某个瞬时进程 session。**

但这个实验也有清晰边界：审批消费方法接收的是调用链提供的上下文，本身不在这里查询 SessionStore。证明这些字段参与匹配，不等于证明所有外部入口都能可靠地提供它们。测试直接构造可信调用上下文，没有模拟网络调用者伪造身份。

## 3. “可以继续”与“属于谁”是两种证据

授权能被合法消费，并不自动证明后续每条技能记录属于哪个会话。我们因此另测 CodeFlowMu V2.1.2 已工程化的技能绑定路径，而没有拿审批通过代替归属验证。**证据归属验证的是“这条记录应挂到谁名下”，不是“谁有权执行这个操作”。**

夹具在会话存储服务 SessionStore 中登记两个会话，使用真实技能调用记录函数写入调用账本。两者都绑定同一合成 task/thread；负对照逐项改变声明。[技能绑定矩阵](evidence/fixtures/session-binding.json)

| 输入场景 | 持久化绑定结果 | 理由或保留信息 |
|---|---|---|
| 原会话已登记且归属匹配 | verified | 保存 session-1 / TASK-1 / thread-1 |
| 新会话已登记且归属匹配 | verified | 保存 session-2 / TASK-1 / thread-1 |
| session 未登记 | invalid_claim | session_not_registered |
| agent 不匹配 | invalid_claim | session_agent_mismatch |
| task 不匹配 | invalid_claim | session_task_mismatch |
| thread 不匹配 | invalid_claim | session_thread_mismatch |
| 合法无会话系统操作，有明确原因 | not_applicable | session_id 为 null，保留原因 |
| 没有 session，也没有原因 | invalid_claim | 不伪装成合法 sessionless |

八条记录的产品完整性校验均通过；逐条改动记录中的 task 字段后，校验均拒绝。这证明本夹具下记录修改可被检测，不证明一条完整性正确的记录在语义上就正确。未登记 session 的记录同样可以完整地保存一次 `invalid_claim`。

这批数据还有一个不能用“字段填充率”概括的结果：8 条中只有 2 条是 `verified`，5 条是 `invalid_claim`，1 条是 `not_applicable`。6 条 `session_id=null` 并不都是丢失记录——5 条拒绝把不可信声明保存成已绑定会话，另外 1 条明确记录合法系统操作无需会话的原因。若只为提高非空率而填入调用者自报的 session，反而会破坏这里已经验证的保护。[逐条记录与检查结果](evidence/fixtures/session-binding.json)

把这组结果与前面的授权矩阵放在一起，才看得清各自职责：11 个授权场景里，2 条匹配路径获准且不能二次消费，9 条条件变化未取得授权；8 条调用记录则分别回答归属是否可信、无需会话是否有理由，以及记录是否被改过。这是两组分别设计的服务实验，不是对同一笔真实业务的端到端串联验收，也不能相加成“19 次业务运行都安全”。

还有一个边界不能省略：这是调用证据，不是成果证据。即使会话已核验、记录完整、调用完成，也不能据此宣布技能建议正确、任务完成或工程验收通过。

## 4. 执行身份尚不是已验证的授权合同输入

CodeFlowMu 的执行合同包含 provider、host slot、workspace、工具与治理授权等字段。已有实现也保存部分逻辑执行和会话延续信息。但三个不同强度的事实必须拆开：

- 字段存在，说明可以保存什么。
- 比较函数能发现变化，说明这份合同能比较什么。
- 实际入口拒绝或重新授权，才说明变化会怎样影响执行。

前期 P4 探针将一个合成 `PROVIDER_ACCOUNT_ID` 放入 MCP 环境，再改变它。合同摘要不变、比较结果为空；改变 workspace 则出现冲突。这个结果只说明该未识别字段不在这份合同的比较范围，不能证明真实 provider 账号切换绕过了权限。但它已经说明：**仅仅让一个 provider account 字段出现在环境里，不会自动成为治理身份。**[P4 捕获数据](evidence/fixtures/historical-probes.json)

同样，纯合同比较函数的测试通过，不能写成 SessionManager 已强制拒绝所有合同变化。当前代码中的比较能力与实际入口接线需要分别核实；已有测试还明确保留了用户发起返工时重新建立执行上下文的合法路径。把所有变化一律当成篡改，同样会破坏产品。

## 5. 下一步应验证哪些真实条件

当前证据足以形成的是一份验证方向，而不是“账号授权缺陷已坐实”的开发结论。

如果继续研究，应在隔离测试账号下建立三种对照：

| 场景 | 必须核对的事实 | 不能默认的结论 |
|---|---|---|
| 同账号、同目标的正常恢复 | 新 session 来源、原批准匹配、单次消费 | 不能因为 session 改变就一律重批 |
| 同对话切换账号 | 新账号由谁认证、权限范围是否改变、旧 grant 是否仍适用 | 不能用 conversation ID 证明授权连续 |
| 用户明确返工或改变目标 | 新指令、目标快照、授权范围、前后会话归属 | 不能把旧快照当成不可变业务命令 |

只有真实账号身份经过 Runtime 或 Host 的可信入口取得，才能讨论把它纳入什么版本化合同。**让客户端多传一个 account ID，并没有解决谁有资格声明身份的问题。** 合理的研究链条应当是：identity source → authenticated principal → authority contract → execution receipt；P4 只说明我们尚未证明这条链已经存在。

这一阶段最有价值的判断是范围收窄：保留已验证的跨 session 精确操作授权与技能绑定；进一步查清 provider 身份是否改变授权范围，以及谁负责触发重验。不要把一个尚未验证的边界扩成重写整个 Session Framework 的理由。

## 复核入口与研究边界

进入[证据包](/zh/research/evidence/2026-08-31-runtime-continuity)运行 `node check.mjs`，可以检查 11 行授权结果、8 行绑定结果及捕获数据的一致性。有对应产品源码时，可以用附带探针重跑真实服务和 journal 校验；公开包不携带本地签名密钥，不能把对结果的检查冒充重新验证产品 HMAC。

本轮由同一研究者执行，未做独立 QA，也未操纵真实账号。结论不是“所有恢复都安全”，也不是“CodeFlowMu 会话机制存在账号漏洞”。11 组授权消费实验说明，session 改变本身不必使精确操作批准失效；8 组技能记录实验说明，会话归属必须由独立证据验证；Superset 的账号切换则暴露出尚未完成的一层：conversation 可以延续，而 execution principal 已经变化。

**因此，对话是否继续、旧批准是否仍有效、现在由谁执行、后续证据属于谁，是四个不同的问题。任何一个成立，都不能替另外三个提供证明。**
