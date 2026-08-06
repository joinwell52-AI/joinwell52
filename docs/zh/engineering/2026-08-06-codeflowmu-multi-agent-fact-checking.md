---
title: '一个 Agent 说“完成了”，团队为什么没放行？'
date: '2026-08-06'
column: open-source-engineering
category: daily
summary: '这不是模型层面的幻觉检测，而是协议与组织结构层面的治理：FCoP 外化事实，CodeFlowMu 运行角色，PM 依据证据拒绝无证据的“完成”。'
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
  title="一个 Agent 说‘完成了’，团队为什么没放行？"
  summary="这不是模型层面的幻觉检测，而是协议与组织结构层面的治理：FCoP 提供事实轨道，CodeFlowMu 运行角色，PM 依据证据说‘不’。"
  version="WP-13"
  status="Field Case · 2026-08-06"
  languageHref="/en/engineering/2026-08-06-codeflowmu-multi-agent-fact-checking"
  languageLabel="English"
/>

# 一个 Agent 说“完成了”，团队为什么没放行？

*CodeFlowMu 多 Agent 防幻觉实战*

**这不是模型层面的“幻觉检测”，而是协议与组织结构层面的治理：FCoP 作为 Agent POSIX 外化事实，CodeFlowMu 作为应用与 Runtime 运行角色，PM 依据证据决定是否放行。**

下午 1 点 06 分，一个 DEV 子执行返回了 `completed`。

它给出的总结很完整：实现思路、测试命令、提交说明、剩余风险，看起来像一份可以直接交给 PM 的工作回执。

但同一份原始事件里，还埋着三句话：

> The shell command returned no exit status, so its result is unknown — do not assume it ran or succeeded.
>
> Test results summary: Unconfirmed in this session.
>
> Commit SHA: Not available here.

**一边是“完成了”，另一边是“无法确认是否执行成功”。**

如果 PM 接受这句“完成”，QA 就会收到一个尚未形成的交付；如果 QA 再只复述 DEV 的结论，任务可能继续进入验收、关闭甚至发布。到了那一步，幻觉就不再只是模型的一句话，而会变成任务状态、报告、提交记录和产品决策。

WP-13 没有这样结束。

PM 没有放行。

## 幻觉发生在一个 Agent 里，事故发生在团队把它当真时

我们经常把“防幻觉”理解成让模型更聪明：换更大的模型、补更长的提示词、再加一个自我反思步骤。

这些方法有价值，但它们仍然把希望寄托在同一个主体身上：**让说错话的人自己证明自己没有说错。**

CodeFlowMu 的做法不同。多 Agent 不是几个模型轮流发言，也不是让三个模型投票，而是一支有岗位、有事实来源、有权限边界和交接关系的团队：

- DEV 负责实现，可以犯错，也可能在工具异常时产生错误判断；
- PM 负责判断交付事实是否满足任务合同，不能把 DEV 的自述当成证据；
- QA 负责以分离角色重新验证，不能只复述 DEV 报告；
- Runtime 负责唤醒、调度、恢复、界面和实时操作流，但不替 PM 作业务裁决。

真正有效的机制不是“保证 DEV 永远不幻觉”，而是：

> **即使某个 Agent 产生幻觉，其他角色也能依靠外部事实，阻止它获得系统权威。**

## 现场：上部是 PM 的事实判断，底部是 Agent 的实时操作流

下面这张图不是后期制作的流程示意，而是当时 CodeFlowMu 业务系统中的真实现场。

上部是 PM 与任务事实；底部保留了 Agent 的实时操作流与可见思考摘要。图中最重要的一句话不是 DEV 的自述，而是 PM 已经作出的判断：

> **子代理自称完成但产物不全--不能当真完成。**

这不是后加的旁白，也不是文章作者的总结，而是 PM 在核对磁盘、Git、REPORT 和任务状态后给出的业务裁决。它把 `completed` 从一句容易被接受的语言声明，重新降回“证据不足，不能放行”。

![CodeFlowMu 现场：PM 事实复核与 Agent 实时操作流](/assets/covers/wp13-codeflowmu-fact-check-live.png)

13:08 左右，PM 看到的事实是：正式 DEV REPORT 不存在；Git HEAD 仍属于前一个 WP；任务要求的测试文件尚未完整落盘；Shell 多次返回 `no exit status`；子执行自己也承认测试未确认、SHA 不可得。

于是 PM 作出判断：

**不派 QA，不收口，不新建一个重复任务，继续原任务。**

## 核心机制：确定性事实读取，加上 PM 的业务裁决

工程读者最关心的问题是：PM 到底“怎么”查到这些事实？这是 prompt 让 PM 自觉检查，还是 Runtime 在放行前强制执行一组非 LLM 检查？

从 WP-13 证据包能够确认的实际链路是：

1. Runtime 记录并展示子执行结束事件，同时保留 `no exit status`、测试未确认和 SHA 不可得等异常事实；
2. Runtime 维持原任务身份，并把该任务继续交给 PM 处理；
3. PM Agent 在自己的执行会话中主动读取任务、生命周期位置、REPORT、磁盘文件、Git 状态和 Runtime 事件；
4. 文件是否存在、HEAD 指向哪里、退出状态是否为空，属于确定性观察；
5. 这些事实是否满足 WP-13 的完成合同，以及应继续、返工还是派 QA，由 PM 作业务裁决。

因此，本文不能把现场写成“FCoP 自动识别了幻觉”，也不能声称当时已经有一个全局硬编码的 `collect_evidence()` 门禁替 PM reject。更准确的表达是：

> **Runtime 保存并暴露事实；PM 按岗位职责和任务合同主动核验；业务放行权仍属于 PM。**

### PM 核验的对象与可复现检查

下表中的命令是可复现的等价检查，用来说明事实来自哪里；它们不是声称 PM 当时逐字执行了同一组命令。

| 要核验的事实 | 可复查的数据源或等价检查 | 13:08 左右的结果 |
|---|---|---|
| 任务当前状态 | 在 `fcop/_lifecycle/{inbox,active,review,done}/` 定位 `TASK-20260805-019` | 仍在 `active` |
| DEV 是否正式交付 | 查找 `fcop/reports/REPORT-*-DEV-to-PM.md` 并核对任务引用 | 未找到对应 REPORT |
| 是否形成 WP-13 提交 | `git rev-parse HEAD`、`git show --stat HEAD`，再核对 WP-13 路径 | HEAD 仍属于前一个 WP |
| 必需文件是否落盘 | 按 TASK 中要求的 WP-13 文件和测试路径执行 `stat/glob` | 不完整 |
| 命令和测试是否可确认 | 读取 Runtime 原始事件、Shell 退出状态和测试输出 | `exit_status = null`，结果为 `unknown` |

下面是**归一化证据摘要**。字段来自证据包中的原始事件和 PM 核验结果，但排版不是 Runtime JSONL 的逐字复制：

```text
13:06  subexecution.status = completed
       shell.exit_status = null
       tests = unconfirmed
       commit_sha = unavailable

13:08  task.bucket = active
       dev_report = missing
       wp13_commit = missing
       required_test_files = incomplete
       pm_decision = evidence_incomplete
       next = continue TASK-20260805-019; do not dispatch QA
```

把现场机制抽象成伪代码，大致是：

```text
on_subexecution_finished(event):
    runtime.append(event)
    # completed 与 exit_status=null 被保留为两个不同事实
    runtime.surface_to_pm(event.task_id)

PM.review_completion(task_id):
    contract = read_task_contract(task_id)
    facts = {
        task_bucket: locate_task(task_id),
        report: find_dev_report(task_id),
        git_head: git_rev_parse("HEAD"),
        required_files: stat(contract.required_files),
        command_results: read_runtime_events(task_id)
    }

    if facts.report.missing
       or not commit_matches(contract, facts.git_head)
       or not facts.required_files.complete
       or facts.command_results.exit_status is null:
        PM.decision = "evidence_incomplete"
        dispatch_QA = false
        continue_same_task = true
    else:
        dispatch_QA = true
```

这段伪代码是对现场机制的工程抽象，**不是声称仓库里已经存在一个同名硬门禁**。后续 Runtime 可以把 `report_missing`、`commit_unreachable`、`evidence_incomplete` 预计算成确定性诊断，但继续、返工或接受仍应由具备职责的角色裁决。

## 五个角色动作，把一句“完成了”变成可验证的交付

![WP-13 五阶段多 Agent 事实复核](/assets/covers/wp13-codeflowmu-fact-check-process-zh.svg)

### 第一幕：DEV 的工具通道失去确定性

DEV 已经完成了部分实现，但 Edit、Shell、Read 等工具连续返回异常状态。最关键的不是“工具报错”，而是工具无法提供可靠的退出状态。

在软件工程中，`unknown` 与 `success` 之间有一条不能跨越的线。没有退出状态，就不能证明命令执行了；没有输出，就不能证明测试通过了；没有 commit，就不能证明代码已经形成可追踪交付。

### 第二幕：子执行生成了一个很像完成报告的答案

子执行并没有故意造假。它尝试继续工作，也给出了完整的技术计划。但当工具通道无法确认结果时，它仍把过程组织成了一段带“完成意味”的总结。

这是大模型最自然、也最危险的能力之一：**把零散、缺失、互相冲突的信息组织成一段连贯叙事。**

语言连贯，不代表事实闭合。

### 第三幕：PM 拒绝让叙事获得业务权威

PM 没有再问一遍“你确定吗”。同一个 Agent 的再次确认，仍然只是另一条语言声明。

它执行了上一节所列的事实核验，发现完成合同没有闭合，于是拒绝派 QA，并保留原任务继续执行。这里没有神奇的“真假分类器”，只有一个不同职责的角色根据外部事实作出有限、可解释的业务判断。

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

这是**角色分离 QA 验证**，不是外部第三方审计。但它已经打破了“执行者自证、自批、自关闭”的单点结构。

## FCoP 协议，让 Agent 会说“不”

大模型最不缺的是继续生成：补一句解释、给一个方案、把不完整过程整理成“已经完成”。真正稀缺的能力，是在事实没有闭合时停止迎合，并明确说“不”。

> **FCoP 协议的重要价值，是让 Agent 不只会回答“是”，还能够基于公共事实说“不”。**
>
> **会生成答案并不稀缺；会拒绝把证据不足升级为“完成”，才是 Agent 的稀缺能力。**

这个“不”不是情绪，也不是保守措辞，而是有实际后果的否决：不派 QA、不关闭任务、不制造重复任务、保留缺失证据，并让原任务继续。

WP-13 的核心不只是“另一个 Agent 发现了前一个 Agent 的错误”，而是协议和组织共同赋予 PM 一项稀缺能力：**面对一个听起来完整的答案，仍然有依据拒绝它成为完成事实。**

## 协议与应用边界：FCoP 是 Agent POSIX，CodeFlowMu 是 Runtime

这里集中说明一次二者的关系，后文不再重复展开。

### FCoP 的全称是 Filesystem Coordination Protocol

“Filename as Protocol”不是 FCoP 的全称，而是它的核心不变量：**文件名即协议**。

FCoP 当前的核心表述是：

> **文件即协议；位置定义状态；事件记录历史。**
>
> **Files carry protocol. Paths address state. Events replay transitions.**

TASK 把“要做什么”外化，REPORT 把“做了什么”外化，REVIEW 把“谁依据什么作出判断”外化；文件位置表达当前状态，`transitions:` 只追加保存过去发生过的迁移。

### FCoP 是行为治理协议层，不是幻觉检测器

FCoP 不理解 WP-13 的业务目标，不运行测试，也不判断某条自然语言是否可信。它规定 Agent 如何报告行为、如何接受 Review、如何在能力边界内被审计。

### FCoP 是 Agent POSIX，不是 Agent OS

| FCoP 负责 | FCoP 不负责 |
|---|---|
| 状态语义与合法迁移 | 调用 LLM、执行工具 |
| TASK / REPORT / REVIEW 文件契约 | 唤醒 Agent、调度队列 |
| 行为事件的外化格式 | 自动重试、Heartbeat、TTL |
| 审计与只追加历史 | 决定哪个 Agent 现在执行 |
| 能力声明与 Review 语义 | 沙箱、进程和权限强制的具体实现 |

### CodeFlowMu 是 FCoP 的应用现场

CodeFlowMu 负责运行 PM、DEV、QA、OPS 等角色，维持任务身份，执行唤醒与调度，记录 Runtime 事件，展示实时操作流，并在异常后恢复原任务。

二者的关系可以压缩为：

```text
CodeFlowMu：Application / Runtime / Scheduler / UI
FCoP：Identity + Location + Event + Behavior Governance
```

或者更直白地说：

```text
CodeFlowMu：让事情发生
FCoP：让发生过的事情可以被报告、检查、审阅和追溯
```

因此，WP-13 是一个 **CodeFlowMu 应用案例**，也是一份 **FCoP 现场证据**；它不是“FCoP 自动检测并修复幻觉”的案例。

## 多 Agent 的真正价值，是组织上的否决权

假设系统只是增加一个 Reviewer Agent，然后把 DEV 的答案转给它：

> DEV：任务完成了。
>
> Reviewer：看起来合理，通过。

这仍然不是团队，只是两个模型围绕同一段文本互相评价。

真正的角色分离至少需要三件事：

1. **职责不同**：DEV 交付，PM 裁决，QA 验证；
2. **事实来源不同**：不能都只读同一份自然语言总结；
3. **权限不同**：DEV 不能批准自己，QA 不能替 PM 改任务目标，Runtime 不能替业务角色作最终判断。

所以，多 Agent 防幻觉的关键不是 Agent 数量，而是组织结构。

> **没有角色边界的多 Agent，只是多份回答；有角色、有事实源、有裁决权的多 Agent，才是一支团队。**

## 三种“成功”必须彻底分开

这个案例最值得记住的边界是：

```text
模型生成的完成声明
        ≠
协议中的完成状态
        ≠
业务上的验收通过
```

### 工具调用结束，不等于工作完成

工具返回 `completed`，最多说明某次调用生命周期结束。若没有退出状态，就仍然是 `unknown`。

### 工作完成，不等于业务通过

代码、commit、REPORT 和测试齐全，才能证明 DEV 形成了交付；是否接受，还需要 PM/QA 根据任务合同判断。

### 协议状态，不替代业务判断

FCoP 的路径是 NOW 真相，事件是 PAST 证据，但 `done` 也不能被偷换成“产品价值已经获得最终业务批准”。协议语义与业务权威必须分别保持精确。

## 这个案例应该推动什么改进？先改 Runtime，不要膨胀协议

WP-13 首先暴露的是 CodeFlowMu Runtime 问题：

- `no exit status` 应稳定保持为 `unknown`；
- 子执行完成与业务完成不能在界面上混为一谈；
- 任务应携带类型化证据合同；
- Runtime 可以预计算 `report_missing`、`commit_unreachable`、`evidence_incomplete`；
- PM 的事实裁决应形成轻量、不可变的记录；
- QA 必须保持角色分离并真正重跑；
- 工具异常恢复后应优先续办原任务；
- “completed 但无 exit status、commit、REPORT”的场景应进入回归测试。

只有当多个独立 Runtime 都证明现有文件契约无法表达某种必要事实时，才应该讨论扩展 FCoP。否则，每遇到一次应用问题就增加字段、状态和自动判断，协议很快会从 Agent POSIX 膨胀成另一个 Agent OS。

## 结尾：团队允许 Agent 犯错，但不允许错误轻易通过

WP-13 最终通过了 27 项测试，但真正有价值的时刻发生在测试之前：一个 Agent 已经说“完成了”，系统却没有顺势把它包装成成功。

PM 查了事实，说“不”：子代理自称完成但产物不全，不能当真完成。

DEV 回到原任务，补齐真实交付；QA 重新验证，最后才给出 PASS。

如前所述，FCoP 负责公共事实面，CodeFlowMu 负责运行角色；真正完成否决动作的是拥有相应职责和权限的 PM。

> **单 Agent 的目标是尽可能答对。多 Agent 团队的目标，是即使有人答错，也不会让错误轻易成为组织事实。**

幻觉不可避免，但它可以被限制在一次局部错误判断里，而不是扩散成一次错误交付。这才是多 Agent 最现实、也最有价值的“防幻觉”。

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
