---
title: "技能已经加载，怎样证明它属于这次 Agent 会话？从 OpenHands Hooks 到调用证据链"
date: '2026-08-28'
column: digital-employee
category: daily
article_type: engineering-analysis
edition: research-center
research_question: "怎样分别证明技能存在、进入会话、真实调用和工程结果成立，并保存可信的会话归属？"
summary: "技能文件存在、配置进入会话、Agent 真实调用和工程结果成立是四种不同事实。OpenHands 的 workspace hook 提案与 CodeFlowMu 的 59 条历史记录及当前代码探针共同说明：会话归属必须由 Runtime 持久绑定。"
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
  title="技能已经加载，怎样证明它属于这次 Agent 会话？从 OpenHands Hooks 到调用证据链"
  summary="配置存在、进入会话、真实调用与结果成立是四层事实；调用成功不能替工程成果签字。"
  version="RBE-20260828-03"
  status="工程分析 · 2026-08-28"
/>
# 技能已经加载，怎样证明它属于这次 Agent 会话？从 OpenHands Hooks 到调用证据链

一条技能日志写着：

```text
skill = pm-product-design-brief
task  = TASK-20260828-903
outcome = ok
```

看起来很完整。

但继续问一句：

> **它属于哪一次 Agent 会话？**

答案可能是空的。

这不会立刻让 Agent 停止运行。技能文件仍然可能被读取，任务也可能最终完成，日志甚至还有完整性签名。

真正的问题要到复盘时才暴露出来：

```text
这个技能只是被推荐过？
        ↓
进入过本次会话上下文？
        ↓
被当前 Agent 真正读取过？
        ↓
还是另一轮执行留下的记录？
```

更重要的是，即使最终证明“当前会话确实调用过这个技能”，也仍然不能推出：

```text
技能调用成功
        =
工程结果正确
```

因此，本文的核心判断是：

> **技能可发现、配置进入会话、Agent 实际调用、工程结果成立，是四种不同事实。每一层都需要自己的证据，任何一层都不能替下一层作证。**

这篇文章不讨论技能是否拥有执行工具的权限。

授权回答的是：

> 这次允许做什么？

本文回答的是另一个问题：

> **事后怎样证明，这个技能真的属于这次执行？**

## 一个很具体的缺口：session 已经参与运行，却没有进入普通调用证据

CodeFlowMu 是我们正在开发的本地运行多 Agent 协作系统。

系统会记录部分 Skill / Playbook 使用情况，用于回答：

* 哪个角色参考了什么技能；
* 哪个任务触发了什么能力；
* 某项规划证据来自哪里；
* 某个技能是否真正发生过调用。

我们没有先从历史日志猜原因，而是直接检查 CodeFlowMu V2.0.4 固定提交中的普通 Playbook 读取记录路径。

这条路径接收：

```text
agent_id
session_id
payload
thread_key
task_id
```

其中 `session_id` 并不是一个没有使用的装饰字段。

它会真正进入去重键：

```text
session_id + skill_id
```

用来避免同一个会话在短时间内反复读取同一 Skill 时产生重复调用记录。

逻辑可以压缩成：

```text
SDK tool_call
    ↓
识别出读取了某个 Skill 文件
    ↓
用 session_id + skill_id 做短期去重
    ↓
写 skill invocation journal
```

问题出现在最后一步。

当前受测实现写入 `recordSkillInvocation()` 时保存了：

```text
skill_id
channel
outcome
summary
caller_role
thread_key
task_id
triggered_by
```

却没有继续把已经存在的：

```text
session_id
```

写进去。

于是形成了一个非常特别的状态：

> **Runtime 在执行当下知道“这是同一会话”，但落盘后的调用证据失去了这层身份。**

这不是“系统完全没有 session”。

而是：

**session 在运行控制中存在，却在这一条证据传播路径上断掉了。**

## 59 条历史记录留下了什么审计后果

当前代码探针定位了字段传播断点，历史记录则回答这个缺口是否只是一次偶然空值。我们检查了一份截至 2026 年 8 月 12 日的技能调用日志，共 59 条，全部可以解析，也没有重复的调用记录编号：

| 关联字段 | 存在 | 缺失 | 缺失率 |
| --- | ---: | ---: | ---: |
| 任务编号 `task_id` | 49 | 10 | 16.9% |
| 会话编号 `session_id` | 0 | 59 | 100.0% |
| 线程键 `thread_key` | 42 | 17 | 28.8% |
| Agent 编号 `agent_id` | 15 | 44 | 74.6% |
| 完整性字段 `integrity` | 59 | 0 | 0% |

这组历史数据不能代表 V2.0.4 的全部当前路径；它说明的是这批旧记录的审计强度：系统能够证明记录被写入且完整性字段存在，却无法仅靠这些记录还原到某一次执行会话。当前代码探针与历史剖面承担不同证明责任——前者定位现在的受测入口，后者展示字段缺失留下的长期后果。
## 最好的反例就在同一个系统里

这个发现不能扩大成：

> CodeFlowMu 所有技能调用记录都没有 session。

事实上，固定提交中的另一条路径已经做得更严格。

`pm.record_planning_skill_evidence` 是规划技能的强证据入口。

它要求提供：

```text
skill_id
task_id
session_id
caller_role
input_context
output_summary
brief_section
product_decisions
```

而且并不是把这些字段原样相信下来。

写入前还会核对 Runtime authority，包括：

```text
project_root
root_task_id
session_id
caller_role
thread_key
```

如果调用目标和 Runtime 已核验身份不一致，就拒绝把它保存为正式规划证据。

因此，同一个 Skill journal 里实际上存在不同证据等级。

这比一句“所有技能记录都缺 session”更值得研究。

## 同一个任务，两种证据强度

现有历史 journal 里已经可以看到这种差异。

同一个任务中，先出现一条普通 Agent Runtime 记录：

```text
channel      = agent_runtime
triggered_by = sdk.tool_call
skill_id     = pm-product-design-brief
task_id      = TASK-DEIDENTIFIED-001
session_id   = 缺失
```

它表达的是：

> Agent 读取过这个 Playbook 文件。

几分钟后，同一任务又出现正式规划证据：

```text
channel         = mcp
triggered_by    = pm.record_planning_skill_evidence
skill_id        = pm-product-design-brief
task_id         = TASK-DEIDENTIFIED-001
thread_key      = THREAD-DEIDENTIFIED-001
session_id      = SESSION-DEIDENTIFIED-001
evidence_source = pm_runtime_control
```

还附带：

```text
input_context
output_summary
brief_section
product_decisions
integrity
```

这两条记录并不互相矛盾。

它们证明的是不同事实。

第一条证明：

> 运行时观察到 Agent 读取 Skill。

第二条证明：

> 一次经过更强 Runtime 上下文核验的规划证据被正式提交。

这正是技能系统需要显式表达的区别。

## 完整性签名也不能替代 session 绑定

Skill journal 还有一个容易被误解的字段：

```text
integrity
```

当前记录会通过 Runtime journal key 计算完整性值。

这很重要。

它可以帮助系统判断：

> 这条记录后来有没有被随意修改？

但它回答不了：

> **它到底属于哪一次会话？**

一条记录完全可能同时满足：

```text
integrity = valid
task_id   = valid
skill_id  = valid
session_id = missing
```

这并不矛盾。

完整性和归属是两类不同性质。

可以把它们理解成：

```text
integrity
→ 这条证据本身有没有被篡改？

session binding
→ 这条证据属于哪一次执行？
```

一个 HMAC 不能凭空恢复没有写入的 session。

同样，一个存在的 session 字符串也不能自动证明它可信。

## OpenHands 提供了另一段相邻证据链

2026 年 8 月 27 日，aashikantkumar 向 OpenHands 提交了 [PR #16971](https://github.com/OpenHands/OpenHands/pull/16971)：

`fix(api): auto-load workspace hooks on conversation start`

截至本文核验时，这个 PR 仍然处于开放状态，没有合并。

因此它应该被理解为：

> **一个公开问题描述和候选修复。**

而不是 OpenHands 已经正式发布的能力。

PR 描述的场景与 CodeFlowMu 不完全相同。

项目目录中已经存在：

```text
<workspace>/.openhands/hooks.json
```

其中可以定义：

```text
session_start
pre_tool_use
...
```

从静态文件角度看：

```text
Hook 配置存在
```

但 PR 描述的 Agent Canvas 启动路径此前没有读取 workspace hooks，并没有把：

```text
hook_config
```

放入 conversation 启动 payload。

于是：

```text
hooks.json 存在
        ↓
但没有进入本次 conversation
        ↓
项目级 Hook 不会因为文件存在而自动成为本次运行事实
```

PR 提议在启动会话时加载 workspace hooks，并在验证路径中检查：

```text
base_state.json 存在 hook_config
```

以及：

```text
HookExecutionEvent
```

真正发生。

这正好揭示了另一个常见混淆：

> **配置存在，不等于本次会话已经装载。**

## OpenHands 和 CodeFlowMu 处在证据链的不同位置

两个问题不是同一个 Bug。

OpenHands #16971 讨论的是：

```text
配置存在
    ↓
是否进入 conversation？
```

CodeFlowMu 当前普通 Skill 路径讨论的是：

```text
真实 tool_call 已经发生
    ↓
调用证据是否保留 session 归属？
```

两者共同支持的不是某一种实现方案，而是一种工程方法：

> **每一次从“存在”走向“生效”的跃迁，都必须留下本层自己的证据。**

不能用前一层替后一层作证。

## “这个技能已经生效”至少有四种含义

工程讨论里最危险的一句话可能是：

> 这个 Skill 已经生效。

因为“生效”至少可能代表四件完全不同的事。

| 层次   | 可以证明什么                      | 不能推出什么                  |
| ---- | --------------------------- | ----------------------- |
| 配置存在 | Skill、Hook、manifest 或文件可以读取 | 不能证明进入当前 session        |
| 会话绑定 | 当前 session 的启动上下文包含该配置      | 不能证明 Agent 真正调用过        |
| 调用发生 | 有可信 invocation event 绑定本次执行 | 不能证明建议正确                |
| 结果成立 | 独立测试、证据与审查支持工程结论            | 不能由 invocation log 单独证明 |

因此，一条完整证据链更像：

```text
Skill / Hook exists
        ↓
Bound to session
        ↓
Actually invoked
        ↓
Output referenced
        ↓
Engineering result independently verified
```

而不是：

```text
SKILL.md exists
        ↓
任务完成
```

![配置存在、会话绑定、调用发生与结果验证是四种不同事实](/assets/figures/2026-08-28-skill-session-evidence-chain.zh.svg)

*图 1：“技能已经生效”至少包含四类不同事实。OpenHands #16971 主要处于“配置 → 会话”边界；CodeFlowMu 本次普通技能实验命中“调用 → session 归属”边界。调用证据只能证明调用发生，不能单独证明建议正确或任务完成。来源：[CodeFlowMu A3 公开证据包](/zh/research/evidence/2026-08-28-skill-session-evidence) 与 OpenHands #16971。*

## 自动推荐甚至不应该叫“技能执行”

这里还有一个很值得单独拆开的状态：

```text
auto_inject
```

CodeFlowMu 历史 journal 中已经存在这种记录。

其摘要明确写着：

```text
recommendation only
not execution evidence
```

这实际上是一个非常重要的区分。

自动推荐能够证明：

> Runtime 判断这个任务应该考虑某个 Skill。

它不能证明：

> Agent 已经读取了 Skill。

更不能证明：

> Agent 遵循了 Skill。

所以更准确的证据层次应该进一步拆成：

```text
available
recommended
bound
invoked
result_verified
```

其中：

### `available`

Skill 已注册、文件存在。

### `recommended`

Runtime 或治理规则认为它与当前任务相关。

### `bound`

Skill / Hook 已经成为本次 session 上下文的一部分。

### `invoked`

Agent 真正执行了读取或调用。

### `result_verified`

调用之后产生的工程结果获得了独立证据支持。

如果把这些状态都显示成绿色的：

```text
Skill ✓
```

审计价值会立即消失。

## 调用成功绝不能升级成工程成果成功

即使把 `session_id` 全部补上，还存在另一种更严重的语义错误。

例如 journal 中出现：

```text
outcome = ok
```

界面随后显示：

```text
规划成功
```

甚至：

```text
任务成功
```

这都是不成立的。

对于 invocation evidence，`ok` 最多表示：

> **这次技能调用按照接口语义完成了。**

它不证明：

* Skill 的建议正确；
* Agent 完整遵循了建议；
* 建议依据的事实正确；
* 后续代码符合该建议；
* 测试通过；
* QA 接受；
* PM 接受；
* 任务完成。

例如一个事实核查 Skill 返回：

```text
现有证据不足，需要继续调查
```

这次调用完全可以是：

```text
outcome = ok
```

但业务事实显然不是：

```text
事实已确认
```

同理：

```text
规划 Skill 读取成功
```

不等于：

```text
代码符合规划
```

这也是为什么调用证据应该被明确命名为：

```text
invocation evidence
```

而不是：

```text
completion evidence
```

## 工程结果必须由另一条证据链负责

真正的工程结果应该由其他证据承担，例如：

```text
代码 diff
工具原始输出
测试结果
运行工件
REPORT
QA
REVIEW
EVAL
```

于是完整关系应该是：

```text
Skill Invocation
       │
       │ 说明“谁调用了什么”
       ↓
后续工程动作
       │
       │ 产生代码 / 文件 / 输出
       ↓
Independent Evidence
       │
       │ 测试 / REVIEW / EVAL
       ↓
Engineering Conclusion
```

Skill journal 可以被引用。

但它不能自己裁决工程结论。

## session_id 也不能由模型自己证明

另一个常见误区是：

> 那给普通 Skill 日志增加一个 `session_id` 字段不就行了？

不够。

如果工具参数可以传：

```text
session_id = important-production-session
```

然后 Runtime 原样保存，那么任何调用方都可以声称自己的记录属于一个高价值 session。

这样的证据看起来比空字段完整。

实际上更危险。

因为它把：

```text
claim
```

伪装成了：

```text
verified identity
```

## 权威 session 必须来自 Runtime 边界

可信 session 身份至少应该来自两类来源。

第一类：

```text
Runtime 自己创建和维护的 session
```

第二类：

```text
Host 创建
    ↓
Runtime SessionStore / Registry 核验
    ↓
形成 Runtime-bound identity
```

而模型、客户端或普通工具参数里的：

```text
session_id
```

应该先被理解为：

```text
claimed_session_id
```

除非 Runtime 已经证明：

```text
session 存在
+
属于当前实例
+
与当前 agent 对得上
+
必要时与 task/thread 对得上
```

否则不能把它提升成正式 binding evidence。

## CodeFlowMu 的强规划入口已经展示了正确方向

这也是为什么现有规划技能强证据路径很有参考价值。

它不是简单接受：

```text
session_id
```

而是把调用请求与 Runtime authority 做匹配。

抽象出来就是：

```text
Claimed Context
      ↓
Runtime Authority
      ↓
Match?
   ┌──┴──┐
  no    yes
  ↓      ↓
reject  persist
```

普通 Skill invocation 不一定需要复制完整规划证据机制。

但最基本的：

```text
session binding provenance
```

应该保持同一个原则：

> **归属由 Runtime 证明，而不是由模型声明。**

## sessionless 操作也必须成为一种显式状态

系统中确实可能存在没有 Agent session 的合法 Skill 操作。

例如：

* 启动期迁移；
* 离线维护；
* 管理员受控工具；
* 系统初始化；
* 某些离线分析。

此时不能简单：

```text
session_id 字段不存在
```

因为几年后读取证据的人无法区分：

```text
本来就没有 session
```

还是：

```text
本来有，但记录器忘写了
```

更清晰的合同可以是：

```text
session_id: null
session_binding: not_applicable
binding_reason: system_migration
```

而真正绑定的调用：

```text
session_id: session-...
session_binding: verified
```

核验失败：

```text
session_binding: rejected
```

或者直接拒绝把它提升为正式 invocation evidence。

这样，“缺字段”就不再承担业务语义。

## 证据记录还应该说明绑定是怎么来的

如果要进一步增强可审计性，可以增加：

```text
session_binding = verified
binding_source   = runtime_session_store
```

或者：

```text
session_binding = verified
binding_source   = host_runtime_registration
```

这样以后看到：

```text
session_id = abc
```

不仅知道“它声称属于 abc”。

还知道：

> **是谁替这个绑定负责。**

这和单纯增加一个字符串字段有本质区别。

## 一条真正可检查的技能证据链

对 Skills、Hooks、Prompt packages 等可插拔能力，可以逐层检查：

```text
Skill 注册项
      ↓
当前任务匹配？
      ↓
当前 session 装载？
      ↓
Agent 实际读取 / 调用？
      ↓
Invocation 是否绑定可信
task / thread / session / caller？
      ↓
Skill 输出有没有被后续动作引用？
      ↓
最终工程结果由什么独立证据验证？
```

对应的证据也不同。

### 注册层

```text
manifest
SKILL.md
version
digest
```

只能证明能力可发现。

### 会话层

```text
session snapshot
resolved configuration
hook_config
prompt/input snapshot
```

只能证明它进入了本次运行上下文。

### 调用层

```text
invocation_id
skill_id
verified session
task
thread
caller
outcome
integrity
```

证明真正发生过调用。

### 结果层

```text
artifact
test
report
review
eval
```

负责证明工程结论。

没有哪一层可以被省略后，由上一层自动补证。

## 为什么 task_id 不能替代 session_id

有人可能会问：

> 已经有 `task_id`，为什么还要 `session_id`？

因为两者回答不同问题。

一个任务可能经历：

```text
Session A
→ 首次执行

Session B
→ 崩溃恢复

Session C
→ rework

Session D
→ QA 后重新执行
```

如果所有记录只有：

```text
TASK-20260828-903
```

事后无法判断某次 Skill 调用发生在哪一个 execution epoch。

对于恢复、重试和多次 Agent 调用频繁发生的 Runtime，这一点尤其重要。

因此：

```text
task_id
```

回答：

> 它服务哪个业务任务？

而：

```text
session_id
```

回答：

> 它发生在哪一次实际执行？

两者不是重复字段。

## thread_key 也不能替代 session_id

同理：

```text
thread_key
```

描述的是业务链路。

一个 thread 可以跨越：

* 多个任务；
* 多个角色；
* 多个 session；
* 多次恢复；
* 多次审查。

所以更完整的身份维度应该类似：

```text
business lineage
    = thread_key

business unit
    = task_id

execution identity
    = session_id

actor identity
    = agent_id / caller
```

这四者各自承担不同职责。

## 日志显示也不能偷偷降级证据

即使底层 journal 已经保存 `session_id`，还有另一个容易遗漏的地方：

> 上层展示或查询接口有没有把它保留下来？

例如一个强规划证据底层拥有：

```text
session_id
integrity
evidence_source
```

如果 Log Center 的投影最终只显示：

```text
skill
task
status
```

那么 UI 使用者仍然看不到真正的证据归属。

因此以后做这类改造时，需要同时检查：

```text
Record
→ Persistence
→ Query
→ Projection
→ UI
```

不能只确认数据库或 JSONL 多了一个字段，就宣布“会话证据完成”。

## 给 Skills 与 Hooks 工程师的检查表

1. Skill、Hook 或 Prompt package 是否有稳定版本与完整性身份？
2. 静态存在和自动推荐是否明确区别？
3. 当前 session 启动时是否保存了实际 resolved configuration？
4. Agent 真实调用是否拥有独立 invocation event？
5. invocation 是否绑定 task、thread、session 和 actor？
6. session 身份来自 Runtime authority，还是客户端自报？
7. sessionless 操作是否显式记录 `not_applicable`？
8. 核验失败是否被明确拒绝，而不是悄悄保存 claim？
9. 自动注入、真实调用和强证据提交是否使用不同 evidence semantics？
10. `outcome=ok` 是否只表示调用完成？
11. UI 有没有把“调用成功”错误显示成“任务成功”？
12. 历史字段缺失是否保持 unknown，而不是事后猜测回填？
13. EVAL、REVIEW、QA 和 PM 是否仍使用独立工程证据作决定？

## 本轮证据到底支持什么

这次调查支持几个边界清楚的结论。

第一：

> **OpenHands #16971 描述了一个“workspace hook 配置存在，但 Agent Canvas 启动链没有把它加入 conversation”的问题，并提出将 `hook_config` 加入启动请求、在 session 状态和 HookExecutionEvent 中验证。**

截至本文核验时，该 PR 仍然开放，因此不能把它写成 OpenHands 已发布能力。

第二：

> **CodeFlowMu 普通 Playbook 读取记录路径已经获得 `session_id`，并使用它参与运行期去重。**

所以当前问题不是 session 不存在。

第三：

> **同一路径在真正写普通 invocation record 时，没有继续持久化已经存在的 `session_id`。**

这造成了一个明确的证据传播断点：

```text
runtime knows
→ journal forgets
```

第四：

> **CodeFlowMu 不能被概括成“所有技能证据都没有 session”。**

现有强规划技能证据入口已经要求并核对 session 等 Runtime 上下文字段，历史 journal 中也存在实际带 `session_id` 的正式规划证据。

第五：

> **Skill invocation 的 `outcome=ok` 只能证明调用按接口完成，不能单独证明工程成果成立。**

这个边界即使 session 修复以后仍然必须保留。

## 本轮证据不能证明什么

这些事实不能证明：

* 所有普通 Skill 路径都存在完全相同的字段传播缺口；
* OpenHands #16971 最终一定会以当前方案合并；
* Skill 被调用就代表 Agent 完整遵循了它；
* Skill 输出正确；
* 任务已经完成；
* QA、PM、REVIEW 或 EVAL 应该接受结果；
* 历史缺失的 session 可以安全推断并回填；
* 一个客户端提供的 session 字符串天然可信。

这些都是不同层的问题。

## 真正应该冻结的是“归属证据”，不是新的业务裁决

因此，这次最小工程方向不需要重做整个 Skill Framework。

它可以非常窄：

```text
普通 runtime skill invocation
        ↓
使用 Runtime 已知 session identity
        ↓
验证 / 绑定
        ↓
写入 invocation evidence
        ↓
查询与展示继续保留 binding
```

并明确：

```text
invocation evidence
≠
result evidence
```

这样既补上了可审计性，又不会让 Runtime 因为多了 session 证据，就开始替 PM、QA 或 EVAL 判断工程结果。

截至本文写作时，相应工程合同已经冻结，但尚未获得开发授权。

真正值得留下来的方法是：

> **不要问“这个技能是不是加载了”，而要逐层问：它是否存在、是否进入本次会话、是否真的被这次 Agent 调用，以及最终结果由什么独立证据证明。**

只有把这四层分开，Skills、Hooks 和 Agent Runtime 才能从“看起来生效”走向“事后能够证明”。

## 主要来源

* [OpenHands PR #16971：fix(api): auto-load workspace hooks on conversation start](https://github.com/OpenHands/OpenHands/pull/16971)，开放提案，访问日期：2026-08-28。
* [CodeFlowMu A3 公开证据包：技能与会话证据链](/zh/research/evidence/2026-08-28-skill-session-evidence)，含固定提交上的普通 Skill 调用路径探针、混合证据等级样本、Reader、检查脚本和预期输出。
