---
title: "AI Agent 的技能不是工具权限：为什么‘会怎么做’和‘允许做什么’必须分开？"
date: '2026-08-20'
column: industry-architecture
category: daily
article_type: project-research
edition: research-center
research_question: "为什么 Agent 运行时必须把行为知识、工具能力、操作影响与单次批准分开？"
summary: "行为手册只教方法，角色能力决定可调用工具，操作策略判断真实副作用，单次批准只放行一个匹配动作。本文用公开实现与35项定向测试给出可审计的四层权限模型。"
item_id: "MANUAL-20260820-SKILL-AUTHORITY"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-20-skill-vs-tool-authority-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
sources:
  - research/manual-runs/2026-08-20-guided-article-pipeline-round1/02-source-register.md
  - research/manual-runs/2026-08-20-guided-article-pipeline-round1/02-fact-claim-matrices.md
  - research/manual-runs/2026-08-20-guided-article-pipeline-round1/02-article-briefs.md
  - research/manual-runs/2026-08-20-guided-article-pipeline-round1/02-experiment-run-log.md
  - research/manual-runs/2026-08-20-guided-article-pipeline-round1/02-independent-editorial-review-round4.md
  - research/manual-runs/2026-08-20-guided-article-pipeline-round1/03-independent-visual-package-review.md
---

<ArticleCover
  image="/assets/covers/daily-2026-08-20-skill-vs-tool-authority-cover.png"
  kicker="行业架构 · 项目研究"
  title="AI Agent 的技能不是工具权限：为什么‘会怎么做’和‘允许做什么’必须分开？"
  summary="行为手册只教方法，角色能力决定可调用工具，操作策略判断真实副作用，单次批准只放行一个匹配动作。"
  version="MANUAL-20260820-SKILL-AUTHORITY"
  status="Community Readability PASS · 2026-08-22"
  languageHref="/en/industry/2026-08-20-skill-vs-tool-authority"
  languageLabel="English"
/>

# AI Agent 的技能不是工具权限：为什么“会怎么做”和“允许做什么”必须分开？

给一个 AI Agent（人工智能体）一份应用发布手册，再给它终端和文件写入工具。它学会了构建、测试和部署，是否就可以把代码推向生产？当然不可以。真正危险的配置错误，是系统把“知道怎样做”误当成“已经获准去做”：本来等待审核的版本，可能因为工具恰好可见而直接进入发布链。

解决办法不是继续加长提示词，而是在代码层把执行权拆成四道独立关口：行为手册说明怎样做，角色能力决定能调用什么，操作策略检查真实目标与副作用，人工批准只放行一次具体动作。读完本文，你可以用这四层重新审查自己的智能体：它只是学会了方法，还是被系统默默授予了过大的执行权？

先把它想成一次受控的办公室发布：Skill（技能）像操作手册，告诉参谋怎样准备发布；Tool（工具）像真正能改文件、开终端的机器；角色能力像机房门禁；操作策略像写明目标和影响的工作单；人工批准则是只盖在本次工作单上的印章。会看手册、会操作机器、拥有门禁卡和获准执行这一次，是四件不同的事。

| 问题 | 白话角色 | 工程层 | 只负责什么 |
|---|---|---|---|
| 怎样做 | 操作手册 | Skill（技能／行为手册） | 提供方法、步骤和检查清单 |
| 能调用什么 | 门禁卡 | Role Capability（角色工具能力） | 决定某个角色能否发起某类工具调用 |
| 这次会影响谁 | 具体工作单 | Operation Policy（操作策略） | 检查参数、目标、路径和真实副作用 |
| 是否允许发生 | 本次盖章 | Approval（单次批准） | 放行一个完全匹配的具体动作 |

这里还要避免另一个误解：**Tool 不是权限，也不天然安全。**它只是产生真实副作用的接口；如果门禁、操作策略和系统权限配置错误，一个工具完全可能拥有过大的能力。

## 第一层：行为手册只回答“怎样做”

行为手册适合保存流程、检查清单和岗位方法。例如：开发者接到缺陷后先定位调用点，再做小范围修改，最后运行相关测试并解释证据。它改善的是工作方法，不是系统权限。

本文用开源多智能体治理运行系统 CodeFlowMu 作为工程案例。它把这类内容称为 Agent Playbook Skill（按任务加载的岗位手册）。其中的 [`SkillContextRouter`](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/skills/SkillContextRouter.ts) 会根据角色、任务意图和文本信号选择相关手册。普通任务默认只取少量匹配项，而不是把整个技能目录塞进每次提示词；产品设计等受门禁约束的任务会加载规定的完整最小集合，因此不能把实现误写成“任何时候最多三个技能”。

这个设计解决两个问题。

第一，减少无关上下文。测试任务不需要同时加载发布、市场调研和运维巡检手册。

第二，让选择过程可观察。系统可以记录这次为什么加载某项手册，而不是事后只看到 Agent 说“我遵循了最佳实践”。

但这里必须守住一条边界：

> 被加载的行为建议不是执行授权，也不是执行成功的证据。

提示词可以告诉 Agent “测试通过后再提交”，却不能证明测试真的运行了，更不能因此授予它远程推送权限。

![四层分别回答怎样做、能调用什么、这次影响谁、是否允许这一次；匹配批准只获得一次受控执行尝试](/assets/covers/daily-2026-08-20-skill-vs-tool-authority-figure-1.png)

*图 1：四层权限责任链。来源：本文根据 CodeFlowMu 固定提交、MCP 与 NIST 边界整理；字段是机制归纳，不是 FCoP 或 MCP 的统一格式。*

## 第二层：角色工具能力只回答“能否发起调用”

行为手册下面才是工具能力。CodeFlowMu 会先把工具名称规范化，再检查当前角色是否拥有这项能力。

例如，在当前公开实现中：

- 开发、运维和测试角色可以读取协作工件并提交执行报告；
- 项目经理可以创建下游任务，但不能因此获得治理归档权；
- 管理员拥有审批、驳回和归档等治理工具；
- 独立评估角色的本地工具被限制为读取类能力。

这些差异不是为了让角色名称更有戏剧性，而是为了让决定权无法被提示词轻易改写。

[`RoleToolCapabilityGate`](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/registry/RoleToolCapabilityGate.ts) 的代码注释写得很直接：它做的是“精确角色/工具能力门”，**不检查命令文本或操作影响**。

这句话很重要。假设开发角色拥有 `write_file`：

```text
write_file("D:/project-a/src/app.ts")
write_file("D:/another-project/secrets.txt")
```

从工具名称看，两次调用完全相同；从实际影响看，前者可能是当前任务内的正常修改，后者已经逃出活动项目。只靠工具白名单无法区分它们。

因此，工具能力门只能回答：**这个角色是否可以发起这一类调用？** 它不能回答：**这组参数指向的真实目标是否安全？**

## 第三层：操作影响判断必须看到参数和目标

真正的风险通常藏在参数里，而不是工具名里。

一次操作至少要回答：

- 它是读取、写入、删除、发布还是进程控制？
- 目标是否位于当前项目内？
- 是否产生持久修改？
- 是否写入外部系统或远程 Git？
- 是否改变权限、治理状态或运行时状态？
- 结果是否可逆？

CodeFlowMu 的 [`UnifiedOperationPolicy`](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/approval/UnifiedOperationPolicy.ts) 会先把这些因素整理为操作事实，再走两条路径：允许执行，或者要求批准。跨项目写入、正式治理工件变更和其他命中负面风险条件的动作不会因为角色拥有 `write_file` 就直接通过。

这种分层也符合外部规范的边界。MCP（模型上下文协议）是连接大模型应用与工具的开放协议。其[安全与信任说明](https://modelcontextprotocol.io/specification/2025-03-26/index)明确指出，工具可形成任意数据访问和代码执行路径，工具描述与注解不能默认受信；宿主需要提供清晰的授权和用户控制。MCP 的[授权规范](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization)又进一步处理 HTTP（网页传输协议）中的资源绑定、权限不足和令牌安全。

这些规范说明“工具连得上”与“当前操作被允许”不是一回事，但它们不替 CodeFlowMu 定义角色表，也不替本地 Runtime（运行程序）判断某个文件路径是否逃出项目。

## 第四层：批准的是一个具体动作，不是一张永久通行证

当操作影响需要人工决定时，批准对象不应只写“允许使用终端”。这样的许可太宽，无法回答批准的究竟是哪一次动作。

更稳妥的批准记录需要绑定：

```yaml
actor: DEV-01
task: TASK-042
tool: write_file
target: D:/project-a/src/app.ts
operation: write
effects:
  persistent: true
  external: false
fingerprint: sha256:...
```

这里的字段是本文根据 CodeFlowMu 实现整理的示意，不是 FCoP 或 MCP 的统一行业格式。关键原则是：批准应指向明确的执行者、任务、工具、目标和操作指纹。参数发生变化，旧批准不应被拿来放行新动作。

`UnifiedOperationPolicy` 当前能把需要批准的操作整理为带目标、影响和操作指纹的批准请求，并声明由原 Agent 重试的恢复策略。即使获得批准，也仍然只表示“允许尝试执行”；外部服务可能拒绝、网络可能失败、测试可能不通过。最终结果必须由后续执行事件和证据报告确认。

### 批准不仅要绑定动作，还要绑定“批准时的世界”

只对参数做指纹仍然不够。管理员批准写入 `app.ts` 以后、真正执行以前，文件可能已经被另一个进程修改；这就是典型的“检查时成立，使用时已经变化”。最低限度的批准合同应同时绑定：

- 执行者、角色、任务和项目；
- 工具、完整参数与规范化目标；
- 批准前的 Git 提交、目标文件摘要或等价环境快照；
- 过期时间；
- 只能消费一次的随机执行凭证。

CodeFlowMu 当前的 `OperationApprovalService` 已有请求摘要、过期时间、随机一次性执行令牌和“可用／已消费”状态；本轮新增执行的 13 项服务测试覆盖了过期拒绝、错误令牌、请求变化后批准失效以及并发消费只执行一次。专用工作区适配器还能把 Git HEAD 和目标文件快照放入请求，但这不等于所有工具路径都已经统一绑定了前置状态。更准确的结论是：**一次性与过期机制已有可运行证据；全工具链的环境漂移防护仍需逐个执行器验证。**

代码中没有必要为了术语而强行增加一个名为 `nonce` 的字段。随机一次性执行令牌承担防重放职责；网络重试应复用同一请求身份，参数或前置状态改变则必须重新审批，不能拿旧令牌重放新动作。

### 四层门禁仍然不是操作系统沙箱

从通用安全概念看，角色能力门接近 RBAC（基于角色的粗粒度授权），操作策略接近 ABAC（基于属性的细粒度授权）和副作用判断；MCP 负责连接工具，却不替宿主完成这两层授权。它们都不能替代容器、低权限进程、文件系统访问控制或网络出口限制。

路径和命令的静态解析也存在边界：包装脚本、符号链接、复杂 shell 组合和运行时生成的目标都可能让词法判断失真。因此，高风险动作最好进入受控执行器，并由系统级隔离限制真实能力。本文的测试没有证明 CodeFlowMu 已完成通用容器沙箱或任意命令绕过防护。

NIST SP 800-171 Rev. 3 对这条边界提供了通用安全依据：最小权限适用于用户以及代表用户运行的系统进程，并要求限制非特权主体执行特权功能、记录特权操作。它不是 Agent 专用标准，却提醒我们：分配能力、执行能力和审计执行不能合并成一个布尔值。

## 在我们的技术栈中，三层项目分别管什么

第一次出现这些名称时，最容易产生的误解是把理论、协议和产品混成一件事。它们的分工如下：

| 层次 | 负责什么 | 不负责什么 |
|---|---|---|
| TMPA，智能体治理理论模型 | 角色、权威、职责分离、证据与接受边界 | 不注册工具，不启动进程 |
| FCoP，文件协作协议 | 用文件信封和路径表达任务、报告、问题与审查事实 | 不决定某个宿主是否允许执行终端命令 |
| CodeFlowMu，工程运行系统 | 加载行为手册、注册能力、判断操作影响、发起批准并驱动 Agent | 不能把执行尝试自动写成业务成功 |

一句话概括：**TMPA 定治理原则，FCoP 定协作文书，CodeFlowMu 在运行时执行权限与操作门禁。**

## 35 个定向测试验证了什么，也没有验证什么

本次写作固定 CodeFlowMu Open commit `ed5634c718b9e238c44bb70851020c9793546fe6`。行为手册、工具挂载、角色能力和操作策略三组测试为 **22/22 通过**；批准记录生命周期的定向服务测试为 **13/13 通过**，合计 **35 项通过**。

覆盖内容包括：

- 无关聊天不加载技能；
- 中文和英文任务信号能路由到对应研究手册；
- 开发、测试、运维角色不会互相加载岗位手册；
- 项目内写入被允许，跨项目写入进入批准；
- 正式治理工件变更进入批准；
- 评估角色调用无权限写工具时被拒绝。
- 批准会过期，错误令牌不能执行；
- 请求摘要改变会使旧批准失效；
- 同一批准并发消费时，受控执行只发生一次；
- 原智能体恢复会话后，只能消费一份匹配授权。

测试也揭示了一项必须公开的限制：旧 `MCPInjector` 的 stub 模式只记录拟挂载能力，不会启动子进程；`live` 模式会主动抛出“尚未实现”错误。因此，本文没有把它宣传成已经上线的动态 MCP 实时挂载器。当前可以证明的是行为路由、角色能力门和操作策略边界，而不是所有规划中的 MCP 生命周期能力。

35 个定向测试也不等于整个系统已经通过渗透测试或第三方安全认证。它们没有证明全部工具都绑定文件快照，也没有覆盖复杂命令解析、符号链接绕过、容器隔离或任意第三方 MCP 工具。`npm ci` 的依赖审计仍报告 6 个依赖漏洞，需要另行评估；本文不把安装和测试成功包装成供应链安全结论。

## 三个最值得加入回归套件的案例

### 1. 行为手册不能越权

给测试角色加载“修复代码”手册，但不授予写工具。期望结果：它可以提出修复建议，不能落盘修改。

### 2. 同一工具因目标不同得到不同裁决

让开发角色分别写当前项目文件和相邻项目文件。期望结果：前者按任务策略处理，后者至少进入批准，不得因为工具名相同而复用裁决。

### 3. 调用成功不能冒充交付成功

批准一次远程发布调用，再让外部服务返回失败。期望结果：批准记录保持“已授权”，执行记录为“失败”，任务不能自动进入已验收状态。

## 一份可直接使用的审查清单

为每项 Agent 能力逐项回答：

1. 行为方法存放在哪里，何时加载？
2. 哪些角色能看见并调用对应工具？
3. 工具名是否已经规范化，别名会不会绕过权限表？
4. 参数中的路径、网址、仓库和目标对象由谁解析？
5. 跨项目、外部写入、删除、发布和治理变化怎样升级处理？
6. 批准是否绑定任务、目标和操作指纹？
7. 批准后失败会不会仍被标成完成？
8. 技能选择、工具拒绝、批准和真实执行是否分别留有记录？

可以把判定逻辑写成下面的目标伪代码。它用于审计设计，不是 CodeFlowMu 的现成接口：

```text
角色不能调用工具                         → 拒绝
目标或副作用无法完整解析                 → 不放行，转人工或受控执行器
动作风险低且位于任务、项目和角色边界内   → 允许尝试
动作需要批准                             → 绑定请求摘要、前置状态摘要和过期时间
批准已过期、已消费或前置状态改变         → 旧批准失效
批准匹配                                 → 单次消费，在受限环境执行并记录证据
执行失败                                 → 保持失败，不得把“获准”写成“完成”
```

小型只读助手可以在实现上合并部分组件，但语义仍应保持分开。否则，系统规模一旦增长，你将无法回答一个最基本的问题：这次动作发生，是因为 Agent 学过这套方法，还是因为组织真的授权它这样做？

## 结论

技能解决的是方法复用，工具解决的是执行接口，权限解决的是角色边界，批准解决的是具体风险。四者相关，却不能互相代替。

> 一个 Agent 知道怎样做，只能证明它获得了方法；只有角色能力、操作影响和具体批准依次成立，它才获得这一次执行机会。

这套分层不会让模型变得更聪明，却能让系统在模型判断失误时仍保留清晰的控制权。

## 主要来源

1. [Model Context Protocol：Security and Trust & Safety](https://modelcontextprotocol.io/specification/2025-03-26/index)
2. [Model Context Protocol：Authorization](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization)
3. [NIST SP 800-171 Rev. 3](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/800-171r3/NIST.SP.800-171r3.html)
4. [CodeFlowMu SkillContextRouter 固定提交](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/skills/SkillContextRouter.ts)
5. [CodeFlowMu RoleToolCapabilityGate 固定提交](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/registry/RoleToolCapabilityGate.ts)
6. [CodeFlowMu UnifiedOperationPolicy 固定提交](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/approval/UnifiedOperationPolicy.ts)
7. [CodeFlowMu OperationApprovalService 固定提交](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/approval/OperationApprovalService.ts)
8. [CodeFlowMu WorkspaceOperationApproval 固定提交](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/approval/WorkspaceOperationApproval.ts)
9. [TMPA 核心规范 S1.0，固定提交](https://github.com/joinwell52-AI/joinwell52/blob/ae27de71b1a8809c2bd69acedc1482570d55a322/docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-zh.md)
10. [FCoP v3 中文规范，固定提交](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/spec/fcop-v3-spec.zh.md)

访问日期：2026-08-20。
