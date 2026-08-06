---
title: "一个 Agent 说‘完成了’，为什么团队没有放行？CodeFlowMu 的一次多 Agent 防幻觉实战"
date: '2026-08-06'
column: open-source-engineering
category: daily
summary: "FCoP 让 Agent 在证据不足时有依据地说‘不’；这种拒绝把自述升级为系统事实的能力，才是多 Agent 团队的稀缺能力。"
item_id: WP13-CODEFLOWMU-FACT-CHECK
lifecycle: Published
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
outline: deep
---

<ArticleCover
  image="/assets/covers/wp13-codeflowmu-fact-check-cover-zh.svg"
  kicker="开源工程 · CodeFlowMu 应用案例"
  title="一个 Agent 说‘完成了’，为什么团队没有放行？"
  summary="FCoP 让 Agent 不只会生成‘完成’，也能在证据不足时说‘不’；真正可靠的团队，靠公共事实支撑否决。"
  version="WP-13"
  status="Field Case · 2026-08-06"
  languageHref="/en/engineering/2026-08-06-codeflowmu-multi-agent-fact-checking"
  languageLabel="English"
/>

# 一个 Agent 说“完成了”，为什么团队没有放行？CodeFlowMu 的一次多 Agent 防幻觉实战


下午 1 点 06 分，一个 DEV 子执行返回了 `completed`。

它给出的总结很完整：实现思路、测试命令、提交说明、剩余风险，看起来像一份可以直接交给 PM 的工作回执。

但同一份原始事件里，还埋着三句话：

> The shell command returned no exit status, so its result is unknown — do not assume it ran or succeeded.
>
> Test results summary: Unconfirmed in this session.
>
> Commit SHA: Not available here.

**一边是“完成了”，另一边是“无法确认是否执行成功”。**

这不是一个罕见的模型笑话，而是多 Agent 工程里最危险的一类问题：一个 Agent 的不确定推断，正在准备变成整个系统的确定事实。

如果 PM 相信了这句“完成”，QA 就会收到一个并不存在的交付；如果 QA 再只复述 DEV 的结论，任务可能继续进入验收、关闭甚至发布。到了那一步，幻觉就不再只是模型的一句话，而会变成任务状态、报告、提交记录和产品决策。

WP-13 没有这样结束。

PM 没有放行。

## 幻觉发生在一个 Agent 里，事故发生在整个团队把它当真时

我们经常把“防幻觉”理解成让模型更聪明：换更大的模型、补更长的提示词、再加一个自我反思步骤。

这些方法有价值，但它们仍然把希望寄托在同一个主体身上：**让说错话的人自己证明自己没有说错。**

CodeFlowMu 的思路不同。

多 Agent 不是几个模型轮流发言，也不是让三个模型投票。它是一支有岗位、有权限、有交接关系的团队：

- DEV 负责实现，可以犯错，也可能在工具异常时产生错误判断；
- PM 负责判断交付事实是否成立，不能把 DEV 的自述当成证据；
- QA 负责以分离角色重新验证，不能只复述 DEV 报告；
- Runtime 负责唤醒、调度、恢复、界面和实时操作流，但不应替 PM 作业务裁决；
- FCoP 负责把角色之间的 TASK、REPORT、REVIEW、状态和事件外化成可以共同检查的协议事实。

因此，真正有效的防幻觉机制不是“保证 DEV 永远不幻觉”，而是：

> **即使某个 Agent 产生幻觉，其他角色也能依靠外部事实，阻止它获得系统权威。**

## 现场：上部是 PM 的事实判断，底部是 Agent 的实时操作流

下面这张图不是后期制作的流程示意，而是当时 CodeFlowMu 业务系统中的真实现场。

上部是 PM 与任务事实；底部保留了 Agent 的实时操作流与可见思考摘要。DEV 正在描述实现范围、读取源码、调用工具；PM 没有等待它把故事讲圆，而是直接检查磁盘、Git、REPORT 和任务状态。

图中最重要的一句话不是 DEV 的自述，而是 PM 已经作出的判断：

> **子代理自称完成但产物不全--不能当真完成。**

这不是后加的旁白，也不是文章作者的总结，而是 PM 在核对磁盘、Git、REPORT 和任务状态后给出的业务裁决。它把 `completed` 从一句容易被接受的语言声明，重新降回“证据不足，不能放行”。

![CodeFlowMu 现场：PM 事实复核与 Agent 实时操作流](/assets/covers/wp13-codeflowmu-fact-check-live.png)

当时，PM 要回答的不是“DEV 看起来是否努力”，也不是“子执行的语气是否自信”，而是一个非常简单的问题：

> **当前事实，足不足以证明 WP-13 已经完成？**

13:08 左右，PM 得到的答案是：不够。

现场事实包括：

- 正式 DEV REPORT 不存在；
- Git HEAD 仍然停留在前一个 WP，没有 WP-13 对应提交；
- 任务要求的测试文件尚未落盘；
- Shell 多次返回 `no exit status`；
- 子执行自己也承认测试未确认、SHA 不可得。

于是 PM 作出判断：

**不派 QA，不收口，不新建一个重复任务，继续原任务。**

这一步非常关键。PM 不是另一个“更聪明的写作 Agent”，而是拥有不同职责和裁决权的角色。它不需要猜 DEV 的内心，也不需要识别所有幻觉模式，只需要核对任务合同与外部事实是否闭合。

## 五个角色动作，把一句“完成了”重新变成可验证的交付

![WP-13 五阶段多 Agent 事实复核](/assets/covers/wp13-codeflowmu-fact-check-process-zh.svg)

### 第一幕：DEV 的工具通道失去确定性

DEV 已经完成了部分实现，但 Edit、Shell、Read 等工具连续返回异常状态。最关键的不是“工具报错”，而是工具无法提供可靠的退出状态。

在软件工程中，`unknown` 与 `success` 之间有一条不能跨越的线。没有退出状态，就不能证明命令执行了；没有输出，就不能证明测试通过了；没有 commit，就不能证明代码已经形成可追踪交付。

### 第二幕：子执行生成了一个很像完成报告的答案

子执行并没有故意造假。它尝试继续工作，也给出了完整的技术计划。但当工具通道无法确认结果时，它仍把过程组织成了一段带“完成意味”的总结。

这是大模型最自然的能力，也是最危险的能力：**把零散、缺失、互相冲突的信息，组织成一段连贯叙事。**

语言连贯，不代表事实闭合。

### 第三幕：PM 拒绝让叙事获得业务权威

PM 没有再问一遍“你确定吗”。因为同一个 Agent 的再次确认，仍然只是另一条语言声明。

PM 改查四类事实：

| 要证明什么 | 去哪里查 |
|---|---|
| 代码是否真实落盘 | 磁盘文件与差异 |
| 是否形成可追踪交付 | Git commit |
| DEV 是否正式交付 | FCoP REPORT |
| 实现是否满足任务合同 | 测试与 typecheck |

四条证据链都没有闭合，PM 就不放行。

这里没有神奇的“幻觉检测模型”。只有一个不同角色，根据自己的岗位职责，对同一件事作事实判断。

### 第四幕：DEV 在原任务上完成真实交付

工具恢复后，DEV 继续的是同一个 `TASK-20260805-019`，而不是复制一个新任务掩盖异常。

随后真实产物出现了：

- commit：`609571ddb22d1fbb2bfb5e54692c07beeef4cf23`；
- 12 个 WP-13 文件；
- `1230 insertions / 452 deletions`；
- 正式 `REPORT-20260805-037-DEV-to-PM.md`；
- observation 测试 3/3 PASS；
- activity-buffer + project-graph 测试 10/10 PASS；
- root-fault + log-center 回归 14/14 PASS；
- runtime typecheck exit 0；
- 未启用生产 Active；
- 未修改 TaskDispatcher 的真实投递路径。

到这里，“完成”才第一次不再依赖 DEV 的语言表达。

### 第五幕：QA 不相信 DEV，也不相信 PM，只相信重新验证的结果

13:09，PM 在核验 REPORT 和 commit 后，才派出 QA 任务 `TASK-20260805-020`。

QA 作为分离角色，重新执行测试与边界检查。13:11，实时操作流里出现了一句真正有证据支持的话：

> 测试全部通过，27/27。DEV 报告的 3+10+14=27 与实际结果一致。

最终 QA 结果包括：

- 27/27 测试通过；
- typecheck exit 0；
- `git diff --check` exit 0；
- commit 未包含 TaskDispatcher；
- `production_active` 保持 false。

注意，这里是**角色分离 QA 验证**，不是外部第三方审计。但它已经打破了“执行者自证、自批、自关闭”的单点结构。

## 这不是“FCoP 自动识别了幻觉”

读到这里，最容易产生的误解是：FCoP 像一个幻觉检测器，自动发现了 DEV 在说假话。

不是。

FCoP 不理解 WP-13 的业务目标，不运行测试，也不判断某条自然语言是否可信。它更接近一套多 Agent 世界里的公共协议面：

- TASK 把“要做什么”外化；
- REPORT 把“做了什么”外化；
- REVIEW 把“谁依据什么作出判断”外化；
- 文件位置表达当前状态；
- `transitions:` 只追加记录过去发生过的迁移；
- 文件名让身份、类型和路由可以被人和 Agent 同时识别。

**FCoP 的价值不是替角色思考，而是让角色有同一组事实可以思考。**

在这次案例里，PM 能说“不”，不是因为协议替它算出了结论，而是因为 TASK、REPORT 缺失、状态位置、事件历史和外部工程证据都可以被检查。

## FCoP 协议，让 Agent 会说“不”

大模型最不缺的是继续生成：补一句解释、给一个方案、把不完整过程整理成“已经完成”。真正稀缺的能力，是在事实没有闭合时停止迎合，并明确说“不”。

> **FCoP 协议的重要价值，是让 Agent 不只会回答“是”，还能够基于公共事实说“不”。**
>
> **会生成答案并不稀缺；会拒绝把证据不足升级为“完成”，才是 Agent 的稀缺能力。**

这个“不”不是情绪，也不是保守措辞，而是可以落到协议行为上的否决：不派 QA、不关闭任务、不制造重复任务、保留缺失证据，并让原任务继续。FCoP 通过 TASK、REPORT、状态位置和事件历史，把说“不”所需要的依据外化；CodeFlowMu 则让 PM 拥有据此作出裁决的岗位和权限。

所以，这次案例的核心不只是“另一个 Agent 发现了前一个 Agent 的错误”，而是协议和组织共同赋予 PM 一项稀缺能力：**面对一个听起来完整的答案，仍然有依据拒绝它成为完成事实。**

## 重新看 FCoP：它不是应用，更不是 Agent OS

看过 FCoP 仓库后，这个案例应该用更准确的方式描述。

### 1. FCoP 的全称是 Filesystem Coordination Protocol

“Filename as Protocol”不是 FCoP 的全称，而是它的核心不变量：**文件名即协议**。

FCoP 当前的核心表述是：

> **文件即协议；位置定义状态；事件记录历史。**

英文对应为：

> **Files carry protocol. Paths address state. Events replay transitions.**

这三个句子恰好解释了 WP-13 为什么能被复核：

- DEV 的“完成”只是语言声明；
- TASK、REPORT、路径和事件是外化事实；
- PM 与 QA 可以读取同一事实面，而不是依赖 DEV 的隐藏上下文。

### 2. FCoP 是行为治理协议层

FCoP 仓库把自己定位为多 Agent 协作中的**行为治理协议层**：它规定 Agent 如何报告行为、如何接受 Review、如何在能力边界内被审计。

这比“文件工单系统”更准确。

FCoP 关注的问题不是“现在该唤醒谁”，而是：

- Agent 声称做了什么？
- 这个行为如何被其他角色检查？
- 当前状态的权威位置在哪里？
- 历史迁移有没有被保留？
- 高风险行为是否有明确的审阅与能力边界？

### 3. FCoP 是 Agent POSIX，不是 Agent OS

FCoP 的边界宪章写得非常明确：

> **FCoP 是 Agent POSIX，不是 Agent OS。**

它负责描述、外化和协调，不负责执行、拥有和编排。

| FCoP 负责 | FCoP 不负责 |
|---|---|
| 状态语义与合法迁移 | 调用 LLM、执行工具 |
| TASK / REPORT / REVIEW 等文件契约 | 唤醒 Agent、调度队列 |
| 行为事件的外化格式 | 自动重试、Heartbeat、TTL |
| 审计与只追加历史 | 决定哪个 Agent 现在执行 |
| 能力声明与 Review 语义 | 沙箱、进程、权限强制的具体实现 |

所以，本文不能说“FCoP 调度 PM、DEV、QA 完成了防幻觉”。

正确说法是：

> **FCoP 提供了可观察、可审计、可治理的协议事实面；CodeFlowMu 作为应用与 Runtime，组织角色、唤醒 Agent、展示现场，并让 PM 与 QA 在事实面上作判断。**

### 4. CodeFlowMu 是 FCoP 的应用现场

CodeFlowMu 不是 FCoP 的另一个名字。

它是基于 FCoP 协议运行的多 Agent 开发工具，把协议变成了一支实际工作的开发团队：PM、DEV、QA、OPS 等角色有不同职责，任务有生命周期，执行过程有实时操作流，异常后可以恢复，结果可以交接与复核。

二者的关系可以这样理解：

```text
CodeFlowMu：让事情发生
FCoP：让发生过的事情能够被报告、检查、审阅和追溯
```

或者用 FCoP 仓库更严格的边界语言：

```text
CodeFlowMu：Application / Runtime / Scheduler / UI
FCoP：Identity + Location + Event + Behavior Governance
```

这也是为什么 WP-13 是一个很好的 **CodeFlowMu 应用案例**，同时也是一份 **FCoP 现场证据**。

它证明的不是“协议会替人判断真假”，而是：当团队真的按协议工作时，一个角色的错误声明不会轻易覆盖其他角色可以看到的事实。

## 多 Agent 的真正价值，不是多几份回答，而是组织上的否决权

假设系统只是增加一个 Reviewer Agent，然后把 DEV 的答案转给它：

> DEV：任务完成了。
>
> Reviewer：看起来合理，通过。

这仍然不是团队，只是两个模型围绕同一段文本互相评价。

真正的角色分离至少需要三件事：

1. **职责不同**：DEV 交付，PM 裁决，QA 验证；
2. **事实来源不同**：不能都只读同一份自然语言总结；
3. **权限不同**：DEV 不能批准自己，QA 不能替 PM 改任务目标，Runtime 不能替业务角色作最终判断。

FCoP 为第二点提供公共事实面，CodeFlowMu 为第一点和第三点提供团队与运行环境。

所以，多 Agent 防幻觉的关键不是 Agent 数量，而是组织结构。

> **没有角色边界的多 Agent，只是多份回答；有角色、有事实源、有裁决权的多 Agent，才是一支团队。**

## 幻觉无法消灭，但可以阻止它成为“组织事实”

这个案例最值得记住的，不是 27/27 测试，而是下面这条边界：

```text
模型生成的完成声明
        ≠
协议中的完成状态
        ≠
业务上的验收通过
```

三者必须经过不同事实和不同角色。

### 工具调用结束，不等于工作完成

工具返回 `completed`，最多说明某次调用生命周期结束。若没有退出状态，就仍然是 `unknown`。

### 工作完成，不等于业务通过

代码、commit、REPORT 和测试齐全，才能证明 DEV 形成了交付；是否接受，还需要 PM/QA 根据任务合同判断。

### 协议状态，不替代业务判断

FCoP 的路径是 NOW 真相，事件是 PAST 证据，但 `done` 也不能被偷换成“产品价值已经被人类最终认可”。协议必须精确，业务裁决也必须保留自己的权威。

## 这个案例应该推动什么改进？先改 Runtime，不要急着膨胀协议

FCoP 仓库还有一个非常重要的原则：协议已经进入“Runtime Absorption Era”。任何新协议机制，都应该来自真实 Runtime 压力，而不是为了理论完整而预先设计。

WP-13 的问题首先暴露在 CodeFlowMu Runtime 层：

- `no exit status` 没有被稳定保持为 `unknown`；
- 子执行完成与业务完成在界面上容易混淆；
- 证据合同需要更明确地附着在任务上；
- PM 的事实复核结果需要更轻量、不可变地落盘；
- QA 必须继续保持角色分离并真正重跑。

这些都应优先在 CodeFlowMu 的 Runtime、界面、状态映射和测试中解决。

只有当多个独立 Runtime 都证明现有 FCoP 文件契约无法表达某种必要事实时，才应该讨论协议扩展。

这条克制很重要。否则，每遇到一次应用问题，就往协议里加一个字段、一个状态、一个自动判断，FCoP 很快就会从 Agent POSIX 膨胀成另一个 Agent OS。

## 对多 Agent 开发工具的工程启示

WP-13 给 CodeFlowMu，也给所有 Agent 平台留下了几个直接要求：

- 把 `unknown` 设计成一等状态，没有退出状态绝不能自动折叠成成功；
- 任务应携带类型化证据合同，代码、UI、文档、运维任务的完成证据不能相同；
- Runtime 可以提示 `report_missing`、`commit_unreachable`、`evidence_incomplete`，但不要替 PM 输出业务真相；
- 工具异常恢复后优先续办原任务，避免重复任务制造第二套历史；
- QA 必须与执行者角色分离，并真正重跑验证；
- TASK、REPORT、REVIEW 和事件历史应保持可达、可追踪、可审计；
- 把“子执行返回 completed，但没有退出状态、commit 和 REPORT”的场景加入回归测试。

## 结尾：团队的意义，是允许一个 Agent 犯错，但不允许错误轻易通过

WP-13 最终通过了 27 项测试，这当然是一个结果。

但真正有价值的时刻发生在测试之前：一个 Agent 已经说“完成了”，系统却没有顺势把它包装成成功。

PM 查了事实，说“不”：子代理自称完成但产物不全，不能当真完成。

DEV 回到原任务，补齐真实交付。

QA 重新验证，最后才给出 PASS。

FCoP 没有替他们思考，也没有替他们调度。

它做了一件更基础的事：让任务、报告、状态和事件不再只存在于某个 Agent 的叙事中。

CodeFlowMu 则把这些协议事实放进一支真正分工的团队，让不同角色拥有继续、拒绝和复核的权力。

FCoP 不是教 Agent 多说一句话，而是让“拒绝放行”成为有事实依据、有状态后果、可以审计的协议动作。

> **单 Agent 的目标是尽可能答对。多 Agent 团队的目标，是即使有人答错，也不会让错误轻易成为组织事实。**

幻觉不可避免。

但当 FCoP 提供公共事实面，CodeFlowMu 提供角色与运行现场，PM、DEV、QA 之间又存在真正的职能分离时，幻觉可以被限制在一次局部错误判断里，而不是扩散成一次错误交付。

这或许才是多 Agent 最现实、也最有价值的“防幻觉”。

---

## 下载完整证据包

本文不是根据回忆重新编排的故事。WP-13 的原始 TASK、DEV/QA REPORT、Runtime JSONL、会话摘录、测试结果、commit patch、截图和校验清单已经整理为可离线审阅的证据包。

- [下载 WP-13 多 Agent 事实复核证据包（ZIP）](https://raw.githubusercontent.com/joinwell52-AI/joinwell52/main/docs/public/evidence/wp13-multi-agent-fact-checking/wp13-multi-agent-fact-check-publication-evidence-v3.zip)
- [在 GitHub 中查看附件位置](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/wp13-multi-agent-fact-checking/wp13-multi-agent-fact-check-publication-evidence-v3.zip)
- SHA-256：`5b5eda3034c822f13421783244b1d0c76a9fa79950bfad0ce61bb8d2e404131c`

证据包用于复核本文陈述，不改变本文末尾的证据边界：它证明 DEV 后续形成真实交付并取得角色分离 QA PASS，但不证明外部第三方认证，也不把快照中的 `review / pending` 解释成最终业务批准。

## FCoP 参考资料

- [FCoP 仓库：文件驱动的 Agent 协作协议](https://github.com/joinwell52-AI/FCoP)
- [FCoP v3 当前规范：文件即协议；位置定义状态；事件记录历史](https://github.com/joinwell52-AI/FCoP/blob/main/spec/fcop-v3-spec.zh.md)
- [ADR-0029：FCoP 行为治理协议宪章](https://github.com/joinwell52-AI/FCoP/blob/main/adr/ADR-0029-fcop-behavior-governance-charter.md)
- [ADR-0038：FCoP Boundary Charter——Agent POSIX, not Agent OS](https://github.com/joinwell52-AI/FCoP/blob/main/adr/ADR-0038-fcop-boundary-charter.md)
- [ADR-0039：Runtime Absorption Era](https://github.com/joinwell52-AI/FCoP/blob/main/adr/ADR-0039-fcop-freeze-discipline-and-runtime-absorption-era.md)

## 证据边界

本文基于 WP-13 出版证据包整理。案例证明 DEV 后续形成真实交付并取得角色分离 QA PASS；证据快照时 TASK-019/020 仍处于 `review / pending`，不据此宣称 PM 已完成最终批准或任务已终态关闭。QA 是角色分离验证，不是外部第三方认证。
