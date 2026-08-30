---
title: "技能已经加载，怎样证明它属于这次 Agent 会话？从日志缺项到可信调用证据"
date: '2026-08-28'
updated: '2026-08-30'
column: digital-employee
category: daily
article_type: engineering-analysis
edition: research-center
research_question: "怎样分别证明技能存在、进入会话、真实调用和工程结果成立，并保存可信的会话归属？"
summary: "59 条历史技能记录都有完整性字段，却全部缺少 session_id。CodeFlowMu 随后将普通调用的 SessionStore 核验、可信绑定与显式无会话语义落实到 V2.1.2；独立 QA 验证三键一致，但调用证据仍不能替工程成果签字。"
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
  kicker="数字员工 · 调用证据"
  title="技能已经加载，怎样证明它属于这次 Agent 会话？从日志缺项到可信调用证据"
  summary="记录没有被改过，不等于会话身份可信。V2.1.2 补上调用归属，但不让调用日志替工程结果作证。"
  version="RBE-20260828-03"
  status="工程分析 · 2026-08-30 修订"
/>

# 技能已经加载，怎样证明它属于这次 Agent 会话？从日志缺项到可信调用证据

一条技能日志有任务编号、技能名称、`outcome=ok`，甚至有完整性字段。继续追问“它属于哪一次 Agent 会话”，答案却是空的。

这不一定让 Agent 当场停止工作。技能文件仍可能被读取，任务也可能最终完成。问题出现在复盘时：这次调用发生在首次执行、崩溃恢复还是返工阶段？它是当前 Agent 真正读取过的技能，还是另一轮执行留下的记录？

CodeFlowMu 是我们开发的本地多 Agent 协作系统。研究普通 Skill / Playbook 读取记录时，我们发现一个具体传播断点：session 已参与运行期去重，却没有进入持久调用日志。

这不是简单“补一个字段”就能结束的问题。若把任意客户端字符串原样写进日志，又会把未知归属变成看似可信的错误归属。2026-08-30 发布的 V2.1.2 因此实现了 Runtime SessionStore 核验、明确的绑定状态和可验证完整性；同时保留一条不变的边界：调用证据不能证明工程成果正确。[证据与版本说明](/zh/research/evidence/2026-08-28-skill-session-evidence)

## 历史上，Runtime 知道的 session 为什么没有留下来

V2.0.4 固定提交 `2ba1ad9b` 的普通 Playbook 读取路径接收 agent、session、task 和 thread。它识别 SDK 的工具调用是否读取了技能文件，再用 `session_id + skill_id` 做短期去重，最后写入调用 journal。

但在最后一次 `recordSkillInvocation()` 调用中，task 和 thread 被传下去了，session 没有。这形成了：

`运行时知道会话 → 用会话去重 → 持久记录丢失会话归属`

历史数据展示了它留下的审计后果。我们检查的旧日志截止到 2026 年 8 月 12 日，共 59 条，全部可解析，也没有重复调用记录编号：

| 关联字段 | 存在 | 缺失 | 缺失率 |
| --- | ---: | ---: | ---: |
| 任务编号 `task_id` | 49 | 10 | 16.9% |
| 会话编号 `session_id` | 0 | 59 | 100.0% |
| 线程键 `thread_key` | 42 | 17 | 28.8% |
| Agent 编号 `agent_id` | 15 | 44 | 74.6% |
| 完整性字段 `integrity` | 59 | 0 | 0% |

这张表不代表所有版本或所有技能入口。它的作用是说明这批旧记录能支持什么：完整性字段存在，但单靠记录无法还原到执行会话。字段存在也不等于我们已逐条重新校验了历史 HMAC。

代码定位、历史剖面和运行探针不能互相替代。V2.1.1 基线 `36e5c83b` 上的修改前复跑又确认了普通调用的 session 持久化断点，这才把修复带入当前工程范围。

## 同一个系统里的反例，阻止了过度结论

CodeFlowMu 并不是“所有技能证据都没有 session”。固定提交中的 `pm.record_planning_skill_evidence` 是更强的规划证据入口，会把请求与 Runtime 已掌握的 task、session、caller 和 thread 等上下文核对。

公开脱敏的混合样本保留了同一任务上的两类记录：

| 记录类型 | 已有证据 | 不能代替什么 |
| --- | --- | --- |
| 普通 Agent Runtime 读取记录 | 观察到读取某个 Skill，带任务信息，缺少 session | 不能还原本次调用的可信会话归属 |
| 正式规划技能证据 | 经 Runtime authority 核验，保存 task/thread/session、输入输出摘要等 | 仍不能替代后续代码、测试和业务审查 |

因此，这次工程目标不是重建整个 Skill Framework，也不是给所有旧日志猜测补值，而是补齐普通 invocation evidence——调用证据——的可信身份传播。

## OpenHands 讨论的是另一段相邻边界

外部对照来自 [OpenHands PR #16971](https://github.com/OpenHands/OpenHands/pull/16971)，题为 `fix(api): auto-load workspace hooks on conversation start`。在原研究的 2026-08-28 核验记录中，它是开放提案，不是已交付能力；本文保留这个历史状态，不把它写成对方的发布事实。

该提案描述：工作区已有 `.openhands/hooks.json`，但 Agent Canvas 会话启动路径没有把配置加入 conversation payload。它提出启动时装载，并通过 session 状态里的 `hook_config` 和实际 `HookExecutionEvent` 验证。

OpenHands 的问题在“配置存在 → 进入本次 conversation”；CodeFlowMu 的问题在“已观察到真实读取 → 调用记录保留可信 session”。我们没有修复对方的系统，也没有把 Hook 自动加载移植成本次能力。

两个案例共同提醒的是：从“存在”到“生效”的每一步，都需要本层证据。

| 层次 | 能证明什么 | 不能推出什么 |
| --- | --- | --- |
| 配置存在 | 文件或注册项可发现 | 已进入当前会话 |
| 会话装载 | 当前启动上下文包含配置 | Agent 真正调用过 |
| 调用发生及归属 | 可信调用记录属于这次执行 | 建议正确、Agent 完整遵循 |
| 结果验证 | 独立测试、工件与审查支持具体结论 | 不能由调用日志单独替代 |

![技能存在、会话装载、可信调用和结果验证各自需要证据](/assets/figures/2026-08-28-skill-session-evidence-chain.zh.svg)

*图 1：V2.1.2 补强第三层的普通调用归属，没有把第三层升级为第四层的结果裁决，也没有因此证明所有技能都会自动装载。来源：[WP-C 实现与独立 QA 证据说明](/zh/research/evidence/2026-08-28-skill-session-evidence)，作者据此绘制。*

## V2.1.2 没有选择“原样保存调用者给的 session”

一个非空 `session_id` 首先是一项声明，不是权威事实。新路径交由 Runtime 的 SessionStore——运行时会话注册存储——加载记录，核对 session 是否存在、记录中的 Agent 是否一致，并对双方已有的 task/thread 上下文检查一致性。

核验后的绑定随调用记录落盘，而不再仅用于内存去重：

| 输入与核验结果 | 持久化语义 |
| --- | --- |
| 会话记录存在，身份与相关上下文核对通过 | 保存会话 ID，`session_binding=verified`，原因是 `runtime_session_store_match` |
| 未注册、存储不可用或身份上下文不匹配等 | `session_binding=invalid_claim`，保留失败原因，不升级成可信绑定 |
| Runtime 合法提供无会话原因 | `session_id:null`、`session_binding=not_applicable` 和原因 |
| 无会话 ID，也没有 Runtime 提供的合法原因 | 不是默认 sessionless，而是无效声明 |

这里没有把“缺一个字段”当成业务语义：合法无会话和记录错误变得可区分。不可信声明也不是悄悄消失，而是留下负面审计事实。

需要注意具体实现范围：task/thread 的一致性比较依赖已有上下文；`verified` 不能被扩写成任意调用必定拥有所有三键。普通读取路径的这项身份绑定，也不应被写成完整会话生命周期审查。本文实际的三键齐备结论来自下文 C1 的有任务、有线程、有会话场景。

## 身份核验与完整性校验，现在终于各司其职

调用 journal 带有完整性摘要，读取方可以检查记录是否与 Runtime 的完整性校验相符。但是完整性与归属仍然是两项证明：

- SessionStore 核验回答“这项身份声明与 Runtime 记录能否对应”。
- journal 完整性校验回答“这份持久记录是否保持可验证的完整性”。

给一个错误 session 字符串加上完整性摘要，不会把它变成正确身份。反过来，一条正确的身份绑定如果后续字段被改动，也需要由完整性校验识别。

同理，task、thread 和 session 各有职责：

| 键 | 回答的问题 |
| --- | --- |
| `task_id` | 服务哪个业务任务 |
| `thread_key` | 位于哪条业务链路 |
| `session_id` | 属于哪次运行会话 |
| agent / caller | 谁进行了调用 |

一个任务可以经过首次执行、恢复、返工等多个会话。任务编号无法替代 session，跨多个角色和任务的 thread 也无法替代它。

## 独立 QA 不是检查“日志多了个字段”

独立 QA 在候选 `64f633ac` 上创建真实 SessionStore 记录，调用普通技能读取入口，再读取持久 journal，并执行完整性验证。C1 的观察是：

| 检查项 | 结果 |
| --- | --- |
| 已注册 SessionStore 记录 | 找到 |
| 本次 journal 记录数 | 1 |
| task/thread/session 与输入预期匹配 | 3/3 |
| agent / caller | 符合预期 |
| `session_binding` | `verified` |
| `binding_reason` | `runtime_session_store_match` |
| `evidence_source` | `sdk_tool_call` |
| 完整性验证 | 通过 |

这个独立场景证明新调用记录把运行时身份保留到了持久证据。伪造或未注册 session、合法 sessionless、跨会话区分及同会话去重另由开发定向测试覆盖，不能拿一次合法调用的 3/3 匹配代替所有失败分支。

历史 59 条记录不会因此变成新格式的成功样本：无法从稳定来源恢复的会话身份不猜测回填。

## 为什么 `outcome=ok` 仍然不能表示“任务完成”

修复调用归属，不会改变 invocation evidence 的职责。

一个事实核查技能返回“证据不足，需要继续调查”，调用可以完全成功；业务事实却没有被确认。同样，Agent 读取了规划技能，不表示生成的代码符合规划。

自动注入或推荐也只是“建议考虑该技能”，不是读取，更不是遵循。应该分开：

`available → recommended → bound → invoked → result_verified`

最后一层需要另外的证据：代码差异、工具输出、运行工件、测试、REPORT、REVIEW、EVAL，以及 QA/PM 的判断。不能因为 journal 有 `verified` 或 `outcome=ok`，就让 Runtime 替业务角色裁决。

本次补的是可追溯性，不是新的业务裁判。

## 从冻结合同到正式交付，状态怎样变化

历史 V2.0.4 数据和探针指出缺口；V2.1.1 修改前复跑确认问题仍在；实现后，独立 QA 验证关键调用路径；最后，V2.1.2 于 2026-08-30 正式发布。

最终发布回归为 Runtime 1842 pass / 0 fail / 1 skip，Shell 1037 pass / 0 fail。这里引用的是发布阶段结果，不是原开发阶段的 Shell 1036，也不把多个测试集合相加成“证据可信率”。

这意味着原文“已冻结但尚未开发”已经不再是当前事实。现在可以准确说：普通技能调用的 Runtime 会话绑定已成为 V2.1.2 母版能力，但没有发布独立 Open Edition，也没有自动切换在线实例。[发布说明（需母版仓库访问权限）](https://github.com/joinwell52-AI/codeflowmu/releases/tag/V2.1.2)

## 给 Skills 与 Hooks 工程师的检查表

1. 文件存在、自动推荐、进入会话与实际调用是否分别记录？
2. 会话身份来自 Runtime 核验，还是调用方自报？
3. task、thread 与 session 是否分别保留其含义？
4. 未注册、上下文冲突、合法 sessionless 和漏写字段是否可区分？
5. 绑定记录是否有可验证完整性，而不是只展示一个绿色状态？
6. 查询和 UI 是否保留证据语义，没有把调用成功显示成任务成功？
7. 历史缺失是否保持未知，最终工程结果是否仍由独立证据验证？

这次实现补上了一个非常具体的传播断点，却没有消除所有“技能生效”的歧义。真正可迁移的经验是：把“谁调用了什么”做成可信事实，再让“结果是否成立”继续由另一条证据链负责。

## 证据范围与主要来源

- [历史剖面、混合证据样本及 V2.1.2 更新说明](/zh/research/evidence/2026-08-28-skill-session-evidence)：旧 fixture、Reader、check 验证冻结历史材料的一致性，不运行当前私有 Runtime。旧输出 `current_probe_persisted_session=false` 不表示新版仍丢失会话。
- [OpenHands PR #16971](https://github.com/OpenHands/OpenHands/pull/16971)：原研究于 2026-08-28 记录为开放提案，提供配置装载的相邻问题模型，不是本次 CodeFlowMu 能力的来源代码或交付证明。
- 实现、独立 QA、V2.1.2 发布原始记录属于受限第一方材料。公开页给出来源编号和脱敏结果，不把私有仓库链接包装成人人可以重跑的公开实验。
- 发布范围保留 Windows 符号链接权限性 skip、既有依赖告警，以及真实浏览器、LAN/Gateway 和用户生产项目未覆盖。本文不证明技能建议正确、不证明 Agent 完整遵循技能，也不声称历史 session 能被安全推断补齐。
