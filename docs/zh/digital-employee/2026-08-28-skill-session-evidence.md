---
title: "CodeFlowMu 工程化实录（二）：Session 身份不能靠自报——如何建立可验证的执行证据边界"
date: '2026-08-28'
updated: '2026-08-31'
column: digital-employee
category: daily
article_type: engineering-analysis
edition: research-center
research_question: "当技能调用携带 session_id 时，Runtime 怎样区分调用方声明、权威会话事实与可审计的执行证据？"
summary: "CodeFlowMu 的历史技能日志暴露了一个比缺字段更深的工程问题：session_id 即使被写入，也不能仅凭调用方自报就成为可信执行证据。V2.1.2 将普通技能调用交由 Runtime 对照 SessionStore 核验 task、thread、session、agent 与 caller，并用 verified、sessionless/not_applicable、invalid_claim 明确区分可信绑定、合法无会话与错误声明。"
sources: "/zh/research/evidence/2026-08-28-skill-session-evidence"
project_relevance: substantive-relationship
item_id: "RBE-20260828-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-28-skill-session-evidence-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-28-skill-session-evidence-cover.png"
  kicker="CodeFlowMu 工程化实录 · 02"
  title="Session 身份不能靠自报——如何建立可验证的执行证据边界"
  summary="日志里出现一个 session_id，只能证明有人写了这个字符串。要把它升级为执行证据，Runtime 必须回到自己的权威会话事实。"
  version="RBE-20260828-03"
  status="工程分析 · 2026-08-31 修订"
/>

# CodeFlowMu 工程化实录（二）：Session 身份不能靠自报——如何建立可验证的执行证据边界

一条技能调用日志可以写得很完整：任务编号、技能名称、`outcome=ok`、调用时间，甚至还有完整性摘要。

但只要再问一句——**这次调用到底属于哪一个真实 Agent Session？**——很多看似完整的日志就会暴露出证据等级的问题。

最直接的做法似乎很简单：让调用方多传一个 `session_id`，原样写进日志。

这仍然不够。

因为一个非空的 `session_id` 首先只是**调用方声明**。它可能来自正确会话，也可能已经结束、属于另一个任务、另一个 Agent，甚至根本没有在 Runtime 中注册。如果系统因为“字符串存在”就把它标记为可信绑定，审计记录反而会比真实事实更强。

CodeFlowMu 在把数字员工运行链路工程化时遇到的正是这个问题。历史版本首先暴露了 session 传播缺口；进一步设计时，我们又确认：真正要补的不是一个字段，而是一条 **执行身份的权威核验边界**。

V2.1.2 最终把这条边界落在 Runtime：技能调用携带的会话身份不再直接成为事实，而是先与 SessionStore 中的权威记录核对，再形成 `verified`、`sessionless/not_applicable` 或 `invalid_claim` 等明确审计语义。

这篇文章讨论的因此不是“技能有没有加载”，而是一个更基础的问题：

> 当系统以后要复盘、恢复、EVAL 或审计一次工具执行时，什么证据足以证明“就是这个 Agent，在这个任务、这条线程、这次 Session 里做了这件事”？

完整历史剖面和公开证据见：[RBE-20260828-03 证据页](/zh/research/evidence/2026-08-28-skill-session-evidence)。

## 外部研究起点：配置存在，不等于进入了这次会话

这条研究链的外部对照来自 [OpenHands PR #16971](https://github.com/OpenHands/OpenHands/pull/16971)，题为 `fix(api): auto-load workspace hooks on conversation start`。

在 2026-08-28 的原研究记录里，它仍是开放提案，因此本文保留当时状态，不把它改写成已经正式发布的对方能力。

这个提案讨论的是：工作区里已经存在 `.openhands/hooks.json`，但 Agent Canvas 启动 conversation 时没有自动把这份配置带入当前会话。它提出在 conversation admission 时加载 hook 配置，并通过 session 状态里的 `hook_config` 和实际 `HookExecutionEvent` 检查是否生效。

它给我们的启发不是“CodeFlowMu 也该照着做 hook 自动加载”，而是一条更通用的证据原则：

**资源存在、资源进入会话、资源被实际调用、调用产生正确结果，是四件不同的事。**

OpenHands 的问题更靠前：`配置存在 → 是否进入当前 conversation`。

CodeFlowMu 这次的问题更靠后：`已经观察到调用 → 这条调用记录到底属于哪个权威 Session`。

因此两者是相邻问题，不是同一个 Bug，也不是同一份实现。

## 历史断点：Runtime 知道 session，持久证据却丢了它

在 CodeFlowMu V2.0.4 固定提交 `2ba1ad9b` 的普通 Playbook 读取路径中，运行时实际上已经接收 agent、session、task 和 thread。它能识别 SDK 工具调用是否读取技能文件，也会使用 `session_id + skill_id` 做短期去重。

但在最终写入调用 journal 的 `recordSkillInvocation()` 路径里，task 和 thread 被继续传递，session 却没有进入持久记录。

也就是说，当时存在这样一个传播断点：

`运行时知道 Session → 用 Session 做短期处理 → 持久证据丢失 Session 归属`

旧日志把这个断点留下得很清楚。我们检查截至 2026-08-12 的 59 条历史技能记录：

| 关联字段 | 存在 | 缺失 | 缺失率 |
| --- | ---: | ---: | ---: |
| `task_id` | 49 | 10 | 16.9% |
| `session_id` | 0 | 59 | 100.0% |
| `thread_key` | 42 | 17 | 28.8% |
| `agent_id` | 15 | 44 | 74.6% |
| `integrity` | 59 | 0 | 0% |

这 59 条记录只是一批冻结历史样本，不代表所有版本、所有技能入口或生产频率。它们能说明的是：**这批持久记录具有完整性字段，却无法仅靠自身还原真实会话归属。**

这里还有一个非常重要的区别：`integrity` 存在不代表 session 身份真实。

一条记录可以“从写入后没有被篡改”，但它写进去的身份本身仍可能错误。完整性只能证明记录保持原样，不能证明原始声明就是事实。

## 同一系统里的反例，说明目标不是“给所有技能补 session 字段”

CodeFlowMu 并不是所有技能证据都处于同一强度。

同一固定版本里的 `pm.record_planning_skill_evidence` 是一个更强的规划证据入口：它会把请求与 Runtime 已掌握的 task、session、caller 和 thread 等上下文核对，再保存规划技能证据。

这给出了一个很重要的反例：

| 记录类型 | 已能证明 | 仍不能证明 |
| --- | --- | --- |
| 普通 Skill / Playbook 调用记录 | 观察到某技能被读取，带部分任务上下文 | 无法还原可信 Session 归属 |
| 正式规划技能证据 | task/thread/session/caller 等经过 Runtime authority 核对 | 不能因此证明代码、测试或最终业务结果正确 |

所以工程目标不能写成“Skill Framework 缺 session”。真正的目标是：

**让普通 invocation evidence 也拥有明确的身份来源等级，而不是把客户端自报字段直接升级为 Runtime 事实。**

这一步是从日志工程走向证据工程的分界。

## 为什么“把 session_id 原样写进去”反而可能制造假证据

假设一个调用请求里出现：

`session_id = session-042`

系统至少还不知道五件事：

1. `session-042` 是否真实存在于当前 Runtime 的 SessionStore；
2. 它是否属于当前 `task_id`；
3. 它是否属于当前 `thread_key`；
4. 它记录的 Agent 是否与当前调用 Agent 一致；
5. 当前 caller 是否有资格把这次调用归属于该 Session，以及 Session 当前状态是否仍可接受。

如果这些都不核对，只因为字符串长得像 session ID 就持久化为“已绑定”，以后 EVAL、恢复器、审计面板或 ADMIN 看到的就不是弱证据，而是**被系统包装过的错误强证据**。

这种错误比字段为空更危险。

字段为空至少明确告诉后续消费者“这里不知道”。一个未经核验却显示为可信的 session，则会让系统错误地回答“我知道这次是谁、在哪一轮执行的”。

因此 V2.1.2 的设计原则是：

> **声明可以保存，但只有 Runtime 自己能够核验的声明，才能升级为执行身份事实。**

## V2.1.2：Session 身份回到 Runtime authority

V2.1.2 不再把调用方提交的 `session_id` 直接视为执行证据，而是由 Runtime 读取 SessionStore，并围绕实际可用上下文核对：

- `task_id`；
- `thread_key`；
- `session_id`；
- agent；
- caller；
- Session 是否存在、状态是否处于可接受范围。

核验后，调用 journal 不再只有“有 session / 没 session”两个模糊状态，而是形成明确的证据语义：

| 情况 | 持久化语义 | 审计含义 |
| --- | --- | --- |
| SessionStore 记录存在，身份和已有上下文一致 | `session_binding=verified` | 这次调用的会话归属得到 Runtime 权威事实支持 |
| 该调用按设计合法不需要 Session，并有 Runtime 原因 | `sessionless/not_applicable`（现有日志字段可表现为 `session_id:null`、`session_binding=not_applicable`） | 无 Session 是合法语义，不是漏写 |
| Session 未注册、状态不接受、Agent/caller/task/thread 等出现不一致 | `session_binding=invalid_claim` | 保留为负面审计事实，不能升级为已验证执行证据 |

这三个状态的价值，在于它们把过去混在一起的三种情况拆开了：

**真的绑定成功、设计上不需要绑定、有人声称绑定但事实不支持。**

尤其是 `invalid_claim`，它不能被悄悄丢弃。

如果系统发现一个错误 Session 就直接改成 `session_id=null`，以后审计只能看到“没有 Session”，却看不到“曾经有人声称这是某个 Session，但核验失败”。V2.1.2 因此把错误声明保留下来，作为负面证据。

负面证据同样是证据。

## `invalid_claim` 为什么不能自动“修好”

Agent 系统里很容易出现一种看似友好的自动修复冲动：调用方给错了 session，如果 Runtime 能猜到“它可能想写另一个 session”，是否可以自动替换？

对执行证据来说，这种自动修复风险很高。

因为一旦系统主动把未经证明的身份替换成“最像的那个”，它就从事实记录器变成了身份推理器。后续所有审计链都会失去“原始声明是什么、权威事实是什么、两者是否一致”的区别。

更稳健的处理是：

`claim → authority verification → evidence state`

而不是：

`claim → best guess → pretend verified`

这也是为什么 V2.1.2 把不一致声明记录成 `invalid_claim`，而不是静默修成 `verified`。

未来如果业务层需要恢复、重新绑定或人工纠正，那应该产生新的、独立可追踪的治理动作，而不是修改历史调用证据的含义。

## task、thread、session、agent、caller 不能互相替代

Session 身份之所以容易被写弱，一个原因是很多系统已经有 task 或 thread，于是会产生“有任务编号就够了”的错觉。

实际上这些键回答的是不同问题：

| 身份键 | 回答的问题 |
| --- | --- |
| `task_id` | 这次执行服务哪个业务任务 |
| `thread_key` | 它位于哪条业务协作或因果链 |
| `session_id` | 它属于哪一次具体运行会话 |
| agent | 哪个执行角色/Agent 进行了动作 |
| caller | 谁发起了这次调用 |

一个任务完全可能经历首次执行、崩溃恢复、返工和再次验证等多个 Session。同一 thread 也可能跨越多个角色与任务阶段。

因此 `task_id` 不能证明 Session，`thread_key` 也不能证明 Session；一个自报的 Session 更不能反过来覆盖 task/thread/agent/caller 的不一致。

V2.1.2 的价值，就是把这些身份维度放回同一个 Runtime authority 边界里核对。

## 身份真实性与记录完整性，是两套不同证明

调用 journal 本来就有完整性机制，这次 Session 工程化并没有取代它。

现在两条证明各自回答不同问题：

- **SessionStore 核验**：这条身份声明是否与 Runtime 权威会话事实一致？
- **journal 完整性验证**：这条已经持久化的记录是否保持可验证完整性？

一条错误 session claim 即使拥有合法完整性摘要，仍然只是“完整保存了一条错误声明”。

反过来，一条已经 `verified` 的身份记录如果后来被篡改，也仍需要完整性机制发现。

这两条证据不能互相代替。

这也是证据系统与普通日志系统的重要区别：**不是字段越多，证据就越强；必须知道每个字段的 authority 从哪里来。**

## 独立 QA：验证的是一条真实 SessionStore 绑定链

实现完成后，独立 QA 没有只检查“journal 多了一个 session 字段”。

C1 场景先创建真实 SessionStore 记录，再通过普通技能读取入口产生 invocation，随后读取持久 journal，并核对身份和完整性。

独立观察结果包括：

| 检查项 | 结果 |
| --- | --- |
| SessionStore 中存在对应会话 | 找到 |
| 本次持久 journal 记录数 | 1 |
| task / thread / session | 3/3 与输入预期一致 |
| agent / caller | 符合预期 |
| `session_binding` | `verified` |
| `binding_reason` | `runtime_session_store_match` |
| `evidence_source` | `sdk_tool_call` |
| 完整性验证 | 通过 |

V2.1.2 发布说明把 C1 的发布门禁进一步概括为：真实 SessionStore 绑定的 task/thread/session/agent/caller 全部一致。

这里同样要保留证据边界。C1 证明的是一个真实、合法 Session 的完整正向绑定链。伪造或未注册 session、合法 sessionless、跨会话区分和同会话去重等失败/边界分支由开发定向测试覆盖，不能拿一次 C1 代替所有失败路径的独立 QA。

历史 59 条缺少 session 的旧记录也不会因为新版本发布就被自动升级成 `verified`。没有可靠来源可以恢复的历史身份，继续保持未知；不猜测回填，本身就是证据纪律的一部分。

## `verified` 证明执行归属，不证明工作结果正确

这条边界如果不写清楚，很容易造成另一个方向的过度工程化。

假设一条 journal 记录已经显示：

- 正确 task；
- 正确 thread；
- 正确 session；
- 正确 Agent / caller；
- `session_binding=verified`；
- `outcome=ok`。

它能证明什么？

它能证明：**Runtime 有证据支持“这个身份组合下发生了这次技能调用，并且调用本身按其接口语义完成”。**

它不能证明：

- 技能给出的建议是正确的；
- Agent 完整遵循了技能；
- 代码改动正确；
- 测试覆盖充分；
- REPORT 结论成立；
- QA 应该 PASS；
- PM 或 ADMIN 应该批准。

因此更完整的证据层次仍然是：

`available → recommended/bound → invoked → identity_verified → result_verified`

最后一层必须由代码差异、工具输出、运行工件、测试、REPORT、REVIEW、EVAL 以及 QA/PM 等治理证据继续完成。

V2.1.2 补的是**调用归属真实性**，不是给 Runtime 增加业务裁判权。

## 对数字员工运行体意味着什么

Session 证据看起来只是日志层的小字段，但对长时间运行的数字员工系统，它实际决定了很多后续能力能否可信建立。

例如：

- 崩溃恢复时，系统能否判断某条调用属于旧 Session 还是新恢复 Session；
- EVAL 复盘时，能否把某项行为准确归到具体执行轮次；
- 多 Agent 协作时，能否区分同一任务上不同 Agent、不同 Session 的行为；
- ADMIN 查看证据时，系统是否会把调用方自报身份错误包装成“Runtime 已验证”；
- 后续自动诊断或监测是否能够基于可信执行身份，而不是模糊时间线猜测。

如果 Session 只是可选字符串，这些能力越自动化，错误归属的后果反而越大。

所以 CodeFlowMu 这次不是单纯“增强日志字段”，而是在数字员工运行体里明确了一条基础原则：

**执行身份属于 Runtime authority，不属于调用者自我声明。**

## 从工程补丁到正式版本

V2.1.2 于 2026-08-30 正式发布，Session 身份核验与任务幂等、Activity 安全投影一起构成本次 Runtime 边界安全补丁。

最终发布验证记录为：

- Runtime：**1842 pass / 0 fail / 1 skip**；
- Shell：**1037 pass / 0 fail / 0 skip**；
- V2.1.1 与 V2.1.2 同协议关键场景各连续 10 轮，Runtime **1630/1630**、Shell **550/550**；
- typecheck、Shell build、安装器契约、规则与版本一致性全部通过。

这些是整个 V2.1.2 发布集合的验证结果，不是“Session 证据可信率”，也不能由此推出所有 Host、真实 LAN/Gateway、浏览器 profile 或用户生产项目均已覆盖。

本次发布是私有母版 Runtime/Shell，不包含独立 Open Dev Team Edition，也不要求现有 TASK、REPORT、Session 或 Activity 文件做数据迁移。

[CodeFlowMu V2.1.2 发布说明](https://github.com/joinwell52-AI/codeflowmu/blob/main/docs/releases/V2.1.2-RELEASE-NOTES.md)

## 可以迁移到其他 Agent Runtime 的审查方法

如果一个 Agent 系统开始记录 Skill、Tool、Hook 或 MCP 调用，可以逐项检查：

1. `session_id` 来自调用方自报，还是 Runtime 权威注册事实？
2. Session 是否同时与 task、thread、agent、caller 和状态核对？
3. “合法无 Session”和“Session 声明错误”是否被区分？
4. 错误 claim 是否作为负面审计事实保留，而不是被静默删除或猜测修正？
5. 身份核验和日志完整性是否被当成两套不同证明？
6. task/thread/session 是否各自保持语义，而不是互相替代？
7. UI、EVAL 和恢复逻辑是否只把 `verified` 当作已核验归属？
8. 调用成功是否仍与工程结果、业务结果的验证分离？
9. 历史缺失身份是否保持未知，而不是为了“数据完整”而推断补齐？

这些问题比“日志有没有 session 字段”更能判断系统是否真正拥有可信执行证据。

## 工程结论

CodeFlowMu 这次工程化最重要的变化，不是让技能 journal 多保存了一个 ID。

而是明确了三种证据等级：

**调用方可以提出身份声明；Runtime 负责核验；只有核验通过的身份才能成为可信执行证据。**

合法无会话必须有自己的语义，错误声明也必须作为负面事实留下。这样，后续恢复、EVAL、审计和治理才能建立在可验证身份上，而不是建立在“某个字段看起来像真的”之上。

对于数字员工运行体，Session 不是上下文装饰，也不是调用者想写什么就写什么的标签。

它是回答“这件事到底发生在哪一次真实执行里”的证据边界。

## 证据范围与主要来源

- [历史剖面、混合证据样本及 V2.1.2 更新说明](/zh/research/evidence/2026-08-28-skill-session-evidence)：旧 fixture、Reader 与 check 用于验证冻结历史材料的一致性，不运行当前私有 Runtime；历史 `current_probe_persisted_session=false` 不能用于描述 V2.1.2 当前行为。
- [OpenHands PR #16971](https://github.com/OpenHands/OpenHands/pull/16971)：原研究于 2026-08-28 记录为开放提案，提供“配置进入会话”的相邻问题模型，不是 CodeFlowMu 本次能力的来源代码或交付证明。
- [CodeFlowMu V2.1.2 发布说明](https://github.com/joinwell52-AI/codeflowmu/blob/main/docs/releases/V2.1.2-RELEASE-NOTES.md)：记录 SessionStore 核验边界、C1 独立 QA、兼容性、发布门禁与残余风险。
- 实现、独立 QA 与发布原始日志属于受限第一方材料。本文不证明技能建议正确、不证明 Agent 完整遵循技能、不把调用证据替代工程结果验收，也不声称历史 Session 身份可以被安全推断回填。
