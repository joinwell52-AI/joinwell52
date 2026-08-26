---
title: "Agent 有工具权限，为什么还要为每一次执行重新核对？从 GitHub MCP 到任务证据链"
date: '2026-08-26'
column: digital-employee
category: daily
article_type: comparative-study
edition: research-center
research_question: "静态工具能力与一次高风险副作用之间，最少还需要哪些可核查事实？"
summary: "从 GitHub MCP 的按调用 scope 设计和一条受控的 Git 推送记录出发，提出调用级授权回执的最小字段与当前证据缺口。"
sources: "公开一手来源与访问受限的第一方证据范围均在正文列明。"
project_relevance: case-evidence
item_id: "EBR-20260826-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-26-agent-call-time-authorization-receipt-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-26-agent-call-time-authorization-receipt-cover.png"
  kicker="数字员工 · 工程研究"
  title="Agent 有工具权限，为什么还要为每一次执行重新核对？从 GitHub MCP 到任务证据链"
  summary="静态工具能力不等于本次操作获准；一次高风险动作需要留下可回查的任务、目标、版本、批准与结果关联。"
  version="EBR-20260826-01"
  status="工程研究 · 2026-08-26"
  languageHref="/en/digital-employee/2026-08-26-agent-call-time-authorization-receipt"
  languageLabel="English"
/>

# Agent 有工具权限，为什么还要为每一次执行重新核对？从 GitHub MCP 到任务证据链

一条真实的 Git 推送记录摆在审计者面前：目标是 `origin/main`，记录保存了推送前后的版本指纹、管理批准、900 秒有效期和执行结果。它能说明“有人批准过这次外部写入”，却还不能直接回答另一个更关键的问题：这次推送究竟服务于哪一张任务单？

这正是静态角色授权的盲点。开发 Agent 被允许使用 Git，不等于它能在任何时间向任何仓库推送；“DEV 可以调用 Git”描述的是能力，不是当前这一动作已经被允许。本文用这条第一方记录和一个已合入的公开实现说明：一次高风险操作至少应留下谁发起、做什么、作用哪里、为何允许、结果如何五类事实。读完后，你可以审计一个真实的 `git push`、部署或工单创建入口。

GitHub MCP Server 在 2026 年 8 月合并的 [PR #3128](https://github.com/github/github-mcp-server/pull/3128) 提供了一个很清楚的外部参照：它把工具可见性与按调用计算的 OAuth scope challenge 分开。工具可见，不代表当前参数一定满足授权；例如写入工作流文件会比普通仓库写入多要求一项 scope。该 PR 还为动态检查声明最大 scope 集合，并在 token 已满足上界时跳过不必要的参数解析。这是一个具体服务实现的已合并选择，不是对所有 Agent Runtime 的通用证明。

基础层也在朝相同方向探索，但证据强度不同：MCP TypeScript SDK 的 [PR #1624](https://github.com/modelcontextprotocol/typescript-sdk/pull/1624) 仍处于开放审议状态，讨论在请求到达时提出 scope challenge 的接口。它只能说明 SDK 层存在这一演进方向，不能被写成 GitHub MCP 已合入能力的一部分，更不能当作当前 SDK 的成熟特性。

## 静态能力只回答“原则上能不能”

把权限只建模为角色白名单，像给一名员工发了一把总钥匙：它说明此人或许具备开门资格，却解释不了今天为什么要进这间房、是否还在工作时间、门后是不是原来的机器。

一次外部写入至少同时涉及五个问题：

| 回执问题 | 应记录的事实 | 不能由什么替代 |
| --- | --- | --- |
| 谁发起 | role（角色）、worker（执行者）、run（运行实例）、attempt（尝试轮次）、lease（领取租约） | 只有一个泛化的“DEV”角色 |
| 做什么 | tool（工具）、effect class（副作用类别）、参数摘要 | 工具名称本身 |
| 作用哪里 | canonical root（规范化项目根）、realpath（解析后的真实路径）、目标摘要 | 用户界面里显示的项目名 |
| 为何允许 | TASK 范围、当前 revision、最小权限规则 | 一次早先的笼统同意 |
| 结果如何 | 成功或 typed failure、evidence references | “页面显示已提交” |

这里的“摘要”不是把命令、提示词或凭据完整写入日志。它的职责是留下可重算的关联线索，同时避免把秘密再复制一次。它也不是把 OAuth（开放授权）硬塞进本地 Runtime（运行时）：OAuth 是一个具体授权协议；调用级回执是一项更一般的工程要求——在副作用发生前后，把本次判断及结果保留下来。

## 一条真实记录能说明什么，也不能说明什么

在 CodeFlowMu 私有母版的受控归档中，我们阅读到一条 Git push 的第一方记录 `APPROVAL-20260729-0b1a6337e40d`。它保存了 actor/role、`origin/main`、推送前后 SHA、外部写入类别、ADMIN 批准、900 秒有效期、开始/结束以及执行器证据。它是“调用当下有回执”的可检查案例，不是公开可复现的安全认证，也不表示所有工具或所有推送都已被同等覆盖。

![五条已读批准记录中的任务关联情况](/assets/covers/2026-08-26-approval-linkage-sample.svg)

*图 1：第一方已读样本中，五条批准记录均无法直接关联到任务或协作线程；这不是仓库总体比例。来源：CodeFlowMu 访问受限的第一方批准记录样本，访问于 2026-08-26。*

更重要的是，案例暴露了下一步工作，而不是替我们遮住它。已读取的早期私有记录显示，批准事实与动作证据之间仍是松散关联：审计者不能从现有字段直接反查“这一次推送究竟对应哪一张任务单”。这是一个架构断层，而不是一串字段名的争论。它说明调用级回执要真正可审计，必须把批准、任务范围、目标与执行结果连接成同一条责任链。这个观察只适用于本研究读取的五条记录，不能外推为整个仓库所有历史都存在同样缺口。

## 先做一项小而硬的检查

不必先建一个庞大的权限平台。选一个真实的外部写入入口，例如 `git push`、部署或发出工单，为每一次调用强制生成并关联一份最小回执：

1. 执行前锁定 caller、任务范围、规范化目标与 revision；
2. 用一次性 nonce 和到期时间把批准限制为这一次动作；
3. 将成功、明确失败和证据引用分别记录；
4. 重试先查回执：相同请求可安全去重，目标或版本改变则重新判断；
5. 审计时从 action evidence 反查 approval，而不是靠聊天记录推测。

这也给未来的研究留下了可比较的数据：有多少能力原本被允许、但在调用时因目标或版本不匹配被挡下？有多少重试被识别为同一动作？没有这些字段，运行时只能说“角色有能力”，无法诚实说明“为什么这一次被允许”。

## 我们的判断：不要照搬 OAuth，要补上任务证据链

GitHub MCP 的关键贡献，不是要求每个本地 Agent Runtime（运行时）照搬 OAuth（开放授权）协议，而是把“看得见工具”与“这次调用满足条件”明确分开。我们的判断是：本地工程也应沿用这条分离，但把回执继续绑定到任务范围、规范化目标、版本与执行结果。现有 Git push 记录已经证明这类批准、目标摘要、限时和执行证据能够被保留；五条已读记录的关联缺口则说明，`TASK` 关联不能再停留在聊天上下文里，必须成为可反查字段。这是本文提出的工程方向，不是声称当前所有调用已经完成覆盖。

值得向 GitHub MCP 团队继续追问的是：工具是否可以同时暴露机器可读的“最大权限外壳”和本次调用的“最小权限要求”，让 Agent Runtime 在选择工具前完成预检，并把判断保存为可审计回执？这不是本文声称已实现的接口，而是由 #3128 引出的工程问题。

## 边界

GitHub MCP 的已合并设计与一条第一方 Git push 记录，共同给出一个最小可行的方向：告别只看静态角色的授权，把高风险副作用拉回调用当下重新裁决，并留下能回看的回执。这不是万无一失的绝对安全，也不是全部工具已经覆盖的声明；它是下一次外部写入可以立刻开始做的工程改造。

### 主要来源

- [GitHub MCP Server PR #3128：按调用 OAuth scope checks](https://github.com/github/github-mcp-server/pull/3128)，访问于 2026-08-26。
- [MCP TypeScript SDK PR #1624：request-time OAuth scope challenges](https://github.com/modelcontextprotocol/typescript-sdk/pull/1624)，开放 PR，仅作接口方向参考，访问于 2026-08-26。
- CodeFlowMu 私有受控证据：`APPROVAL-20260729-0b1a6337e40d` 与当前 Action Evidence 类型；第一方、访问受限，不能代替独立复现。
