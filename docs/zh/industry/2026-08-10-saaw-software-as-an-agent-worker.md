---
title: "SaaW：Software as an Agent Worker——从 SaaS 到数字员工"
date: "2026-08-10"
column: "industry-architecture"
category: "manifesto"
version: "V1.1"
summary: "SaaW 将软件的交付单位从功能与助手推进到可承担岗位职责的数字工作主体；V1.1 以研究报告生产机 V1.3 为真实工程锚点，并明确当前能力与 Self-Morphing 研究边界。"
item_id: "MANIFESTO-20260810-SAAW"
lifecycle: "Published"
cover: "/assets/covers/saaw-manifesto-cover.svg"
visualization: "/assets/covers/saaw-governance-stack.svg"
visualization_2: "/assets/covers/saaw-self-morphing-loop.svg"
evidence_status: "Architecture-grounded + production-engine reference implementation"
citation_status: "Internal publication mapping completed"
editing_status: "Published V1.1"
publication_authorized: true
outline: deep
---

# SaaW: Software as an Agent Worker
## 从 SaaS 到 SaaW：当代码库开始“自己开发自己”

**基于 TMPA 治理体系与 CodeFlowMu 实践的数字员工范式宣言 · V1.1**

[English version](/en/industry/2026-08-10-saaw-software-as-an-agent-worker)

![SaaW — Software as an Agent Worker](/assets/covers/saaw-manifesto-cover.svg)

> **作者 / 发布单位：** joinwell52 Research Center / CodeFlowMu Core Team  
> **理论与架构：** [TMPA Architecture Paper A0.9](/zh/publications/tmpa-architecture-paper-a0.9)  
> **规范性标准：** [TMPA Core Specification S0.6](/zh/publications/tmpa-core-specification-s0.6)  
> **工程实证：** [TMPA Implementation Case Report I0.8](/zh/publications/implementation-case-i0.8)  
> **首个真实工程锚点：** [研究报告生产机 V1.3](/zh/publications/research-report-production-engine-v1.3)  
> **核心工程载体：** CodeFlowMu / FCoP

## 1. SaaS 改变了软件交付，却没有改变“谁在工作”

过去二十年，SaaS 改变了企业获得软件的方式。部署迁移到云端，升级变成持续服务，浏览器成为统一入口。但企业劳动的底层关系并没有随之改变：**软件提供工具，人负责完成工作。**

员工仍然需要登录 ERP、CRM、财务系统、OA 和行业软件，查询、复制、判断、录入、提交、审批和归档。SaaS 解决了“软件怎样交付”，却没有真正解决“工作由谁完成”。

Copilot 向前推进了一步。AI 可以总结、生成、解释和建议，但多数 Copilot 仍然围绕人类操作员设计：AI 给出答案，人把答案转成业务动作。

我们认为，AI Native Software 的下一步不是再增加一个更聪明的输入框，而是让软件本身开始承担被授权的工作。

# SaaW — Software as an Agent Worker

SaaS 主要交付 **Capability**；Copilot 交付 **Assistance**；SaaW 开始交付 **Work**。

> **SaaW 是一种将软件交付为数字工作主体的软件范式。它能够在明确的岗位职责、权限边界和治理规则下持续执行工作流程、调用业务工具、产生可核验的工作成果，并接受人类监督、审查与授权。**

一个真正的 SaaW 不是换了名字的 Chatbot，也不是一个拥有长 Prompt 的通用 Agent。它必须拥有岗位意义上的 Role、Responsibilities、Workflow、Skills、Permissions、Work State、Evidence、Recovery 与 Human Decision Gates。

软件曾经是工具，后来成为服务。现在，软件开始成为 Worker。

## 2. 企业级 Agent 的真正分水岭：Trace 不等于 Governance

现代 Agent Framework 已经可以留下丰富的 Execution Trace：哪个 Agent 调用了什么工具、模型返回了什么、任务经过了哪些步骤。

这些信息重要，但它们并不等于 Governance State。

Trace 回答“发生了什么”；Governance 还必须回答：谁授权？谁接受？谁负责？哪个对象代表正式事实？谁提交 Report？谁执行 Review？谁作出 Decision？当前状态是否合法？冲突是否解决？系统中断后由谁继续？

> **无治理，不员工。**

如果一个 Agent 只能运行，却不能解释责任、授权、合法状态和恢复条件，它仍然更像自动化程序，而不是能够进入组织结构的数字员工。

## 3. TMPA：让工作事实脱离 Agent 会话而存在

TMPA（Textual Multi-Agent Process Architecture）研究一个基础问题：多个 Agent 与人类共同完成长期工作时，可信工作状态应该存在于哪里？

TMPA 不把一切继续塞进模型上下文，而让重要事实成为可持久化、可引用、可重建的文本对象。Task、Acceptance、Report、Review、Decision、Correction、Issue，不只是聊天内容，而是工作事实。

其核心原则包括：**Text carries messages and state**；责任主体采用 **Single-Writer Serial Streams**；多个主体进行 **Asynchronous Collaboration**；Reader 在读端依据 Reference、Causality、Transition 与 Governance Rule 进行 **Deterministic Reconstruction**，重构 Partial-Order Graph 与 Issue Set。

关键不是制造一张漂亮的全绿流程图，而是确定地回答：**现在什么已经成立，什么仍未解决。**

## 4. 从 TMPA 到 FCoP，再到 CodeFlowMu

SaaW 不是某一层技术的别名。理论、协议、运行体和产品范式承担不同责任。

![SaaW Governance & Runtime Stack](/assets/covers/saaw-governance-stack.svg)

**TMPA** 研究工作事实、责任、授权、状态重建与治理边界。  
**FCoP** 将一部分协作关系投射为极轻量、可观察的文件协议。  
**CodeFlowMu** 承担 Agent 编排、Skill 调用、生命周期、Review、Human Decision、Recovery、Agent PC 与 PWA 控制面。  
**SaaW** 描述企业最终部署的是什么：不是聊天能力，而是能够承担工作的数字主体。

这四者不是同义词，也不应该互相吞并。

## 5. FCoP 与 Recoverability：工作的连续性不能依赖会话连续性

CodeFlowMu 的一个关键工程选择是 FCoP。工作对象通过文件、目录、引用和原子生命周期迁移表达协作关系。任务可以经历 `inbox → active → review → done → archive`，Report 与 Issue 作为可追踪对象留下。

> **Directory becomes observable state.**

人类主管、Agent、诊断器和运维工具面对的可以是同一组可观察事实，而不是彼此不同的隐藏内存。

这也是 Recoverability 的基础。数字员工一定会遇到网络中断、SDK 超时、Agent 退出、上下文丢失、系统重启和软件升级。恢复不应该依赖“原来的模型还记得”，而应该重新读取持久化工作事实，再推导当前责任、已完成结果、未解决 Issue 与下一步合法动作。

# Agent is replaceable. Work facts are not.

## 6. Agent PC：数字员工需要自己的工作环境

如果 SaaW 是 Worker，它就不能只存在于对话窗口。

CodeFlowMu 将工作节点进一步抽象为 **Agent PC**：给数字员工使用的运行环境。它可以包含推理通道、Skill、Browser、API、CLI、Script、Credential、Workflow、文件系统和治理规则。

数字员工的循环因此从 `Prompt → Response` 变成：

**Task → Reason → Use Skill → Operate System → Observe Result → Produce Evidence → Continue / Report / Escalate。**

模型提供推理能力，但工作通过真实工具在受控环境中完成。

## 7. AI 应该操作企业软件，而不是绕过企业软件

真实 ERP/CRM 并不是几张 CRUD 表。字段背后可能存在状态机、Trigger、Stored Procedure、审批链、权限规则、外部联动与 Audit Trail。

SaaW 更适合探索非侵入式路径：让 Agent 使用被授权的 API、Browser、CLI、Hook 或 Automation Skill，尽量通过现有业务系统完成工作。

这并不意味着 Agent 永远不会犯错，而是让错误尽可能发生在已有系统能够观察、拒绝、审计和回滚的边界内。

企业需要的不是神话般“绝不犯错的 AI”，而是**错误可见、责任可追、状态可恢复、风险可阻断的 AI Worker**。

## 8. 一个数字员工的一天：研究报告生产机已经让这个问题变得具体

SaaW 如果只有抽象定义，就仍然只是一个漂亮概念。因此 V1.1 引入一个已经运行的工程锚点：**研究报告生产机 V1.3**。

它不是“给 ChatGPT 一个 Prompt，让它写文章”。公开的 V1.3 已经把 Research Analyst 岗位、Research Intelligence System、三栏研究计划、Research Skills 01–08、15:00 Production、20:00 Publication、Runtime Record 与 Git Commit Verify 组织成持续生产线。

一个典型工作日可以被表达为：

```text
Research Analyst 岗位
        ↓
Research Intelligence Discovery
        ↓
三栏 Research Triage
        ↓
Research Object / Reading / Analysis
        ↓
Research Writing
        ↓
Visualization
        ↓
Evidence & Citation
        ↓
Publication Editing
        ↓
Publication Candidate
        ↓
Publication / GitHub Commit / Verify
```

这里真正重要的不是“AI 会写文章”，而是工作开始拥有：**岗位、来源、流程、技能、持久状态、生产门禁、出版门禁和可检查成果。**

研究报告生产机的正式定位本身已经明确：它是一个基于 ChatGPT、文本工作流与 GitHub First 的数字研究员生产系统；文章不是执行单元，Skill 才是执行单元；GitHub cron 触发也不等于研究工作已经完成，没有 Worker 执行时状态必须保持 Waiting、Blocked 或 Failed。

这使它成为 SaaW 很重要的 Reference Implementation：不是因为它已经代表完整的自主数字员工，而是因为它已经把“AI 写作”推进成了**受治理的研究工作生产线**。

## 9. 从企业证据到 Governed Workflow：不要把“扫描代码”神化

早期表达很容易把这一过程写成 `Code → SOP`。这过于乐观。

真实企业知识可能散落在遗留代码、API、Schema、配置、UI、文档、日志、岗位说明、人工示范、业务专家知识与现实操作习惯中；这些来源还可能互相冲突。

因此更严谨的路线应该是：

# Enterprise Evidence → Candidate SOP → Validation → Governed Workflow

代码只是 Enterprise Evidence 的一种。

Meta-Development Team 可以利用 AI 从多种证据中提取 Candidate Workflow，但 AI 推导出来的流程不能自动升级为企业事实。它必须经过业务验证、工程测试、治理检查或人类授权，才能成为数字员工可执行的正式 Workflow。

这与 TMPA 的基本精神一致：**AI 生成的判断不是因为“被生成”就成为事实；它必须经过可解释的事实与治理过程获得执行地位。**

## 10. Meta-Dev Runtime 与 Digital Employee Package

CodeFlowMu 最值得继续推进的能力，不只是“多个 Agent 一起开发软件”，而是让研发团队本身成为数字员工的生产 Runtime。

PM、DEV、QA、OPS 四角色可以构成 **Meta-Dev Runtime**。它的产物不再局限于传统应用，还可以是一个 **Digital Employee Package**：Role、Responsibilities、Workflow、Skills、Permissions、Policies、Validation Rules、Runtime Configuration、Recovery Rules 与 Human Decision Gates。

数字员工因此开始像真正的软件产品一样：可以定义、开发、测试、版本化、部署、升级和回滚。

## 11. Self-Morphing：当代码库开始“自己开发自己”

Self-Morphing 最容易被误解，因此必须严格定义。

它不是 Agent 无限制修改自身源代码，也不是绕过验证的自我复制。

> **Self-Morphing 指数字员工开发与运行系统利用自身的软件开发能力，构造、验证并部署新的数字员工形态。**

![Self-Morphing Digital Employee Loop](/assets/covers/saaw-self-morphing-loop.svg)

其受治理链路应该是：

**Meta-Dev Runtime → Analyze Work → Develop Worker Package → Validate → Governance / Human Decision → Deploy → Domain Worker Runtime。**

领域 Worker 在真实工作中继续产生 Report、Issue、Evidence 与 Capability Gap，这些事实再成为下一轮开发输入。

# Develop → Validate → Deploy → Work → Observe → Improve

“自己开发自己”的真正含义不是代码突然拥有生命，而是**软件开发生命周期与软件履职生命周期开始连接成一个受治理的递归系统。**

## 12. 人类终极控盘：Human at the Authority Boundary

SaaW 不意味着 Human-Out-of-the-Loop。

但成熟的 SaaW 也不能意味着 Human-in-every-loop。否则数字员工只是一个需要人不断按按钮的数字实习生。

真正需要建立的是风险分层授权：低风险、可逆、规则明确的工作可以在 Delegated Authority 内自动推进；大额付款、合同最终签署、权限提升、不可逆操作和重要外部发布进入 Decision Gate。

因此更准确的原则是：

# Human at the Authority Boundary.

CodeFlowMu 的 PWA 在这里不是普通手机 UI，而是数字团队的人类控制面。Approve 也不应只是瞬时 UI Event，而应转化成持久化 Governance Fact，成为合法状态跃迁的依据。

## 13. Current Reality / Research Frontier：我们现在究竟走到了哪里

一篇严肃的技术宣言必须区分**已经验证的能力**和**正在探索的方向**。

### Current Reality — 已有工程与证据

当前公开体系已经存在并验证了：TMPA A0.9 / S0.6 / I0.8 的论文、规范与案例映射；FCoP 文件驱动生命周期与可观察工作对象；CodeFlowMu 的多 Agent 开发协作、Report / Review / Decision、恢复治理与 PWA 控制面；以及研究报告生产机 V1.3 的真实生产链。

研究报告生产机 V1.0 Production Test 已完成 3 个 Daily Research 对象、3 个 Academic Observation 对象、12 篇中英文 Markdown、6 张独立 SVG Cover，并实际经历 GitHub Branch、PR、CI、构建失败修复、Merge 与 Commit Verify。V1.1–V1.3 又继续建立 Runtime Center、Scheduler、三栏选题、15:00 Production、20:00 Publication 与 Research Intelligence System。

这些属于**已经存在的工程事实**，不是 SaaW 为了论证自己而虚构的案例。

### Research Frontier — 正在继续验证

Digital Employee Package 的统一封装、Agent PC 标准化、Legacy Enterprise Evidence → Candidate SOP 的自动提取、Meta-Dev Runtime → Domain Worker Runtime 的通用转换、风险分层自治以及完整 Self-Morphing 闭环，仍然属于持续工程与研究方向。

因此 SaaW V1.1 不宣称“全自动企业数字员工已经完成”。它提出的是一个已经拥有部分真实工程地基、并且可以继续被证伪、验证和扩展的软件范式。

## 14. 从 Development Runtime 到 Work Runtime

传统软件把开发、部署与工作分开：开发者造软件，运维部署软件，业务人员使用软件。

SaaW 开始重新组合这三个生命周期：

**Development Runtime → Digital Employee Package → Work Runtime → Work Evidence → Development Runtime。**

这不只是 DevOps。DevOps 连接 Development 与 Deployment；SaaW 进一步尝试连接 **Development 与 Work**。

当真实工作证据能够直接驱动下一轮能力开发时，软件不再只是静态工具，而开始成为生产、运行和持续改进数字员工的基础设施。

## 15. SaaW 最终改变的是软件经济学

SaaS 的商业逻辑是企业购买软件能力，然后继续配置员工完成工作。

SaaW 的商业逻辑则可能变成：企业部署被治理的数字工作能力，软件交付的一部分开始从 Feature 转向 Work Outcome。

企业未来购买的可能不只是 CRM，而是客户运营数字团队；不只是财务系统，而是财务处理数字员工；不只是合同管理软件，而是合同审查、签署与履约数字团队。

这意味着软件市场可能从单纯的 **Software Market** 向 **Digital Labor Market** 延伸。

SaaW 的价值不在于发明一个新的 Agent 名词，而在于提出一个新的软件问题：

> **如果软件能够承担岗位职责，那么企业应该如何定义、开发、验证、部署、治理、恢复和升级这种“软件员工”？**

TMPA、FCoP 与 CodeFlowMu 正是在不同层次回答这个问题。

## 16. 结语：软件开始工作

过去的软件一直在回答：怎样让人更高效地工作？

AI Native Software 开始面对另一个问题：哪些工作可以由软件本身完成？

我们的判断不是“人将从系统中消失”，而是角色开始迁移：Agent 进入操作层，人进入治理层。

**SaaS：Human operates Software。**  
**Copilot：Human operates with AI。**  
**SaaW：AI performs Work; Human governs AI。**

而当能够开发数字员工的系统，又开始利用自己的研发能力开发下一代 Worker，一个新的递归生命周期出现：

**AI develops Worker → Worker performs Work → Work produces Evidence → Evidence drives Development → AI develops next Worker。**

这就是 CodeFlowMu 正在探索的方向。

不是再造一个 Multi-Agent Framework。

而是：

> **构造一套能够开发、运行、治理、恢复并持续演化数字员工的软件基础设施。**

# SaaW — Software as an Agent Worker

软件曾经是工具。  
后来成为服务。  
现在，它开始工作。

**从软件市场到数字劳动力市场。**

---

**joinwell52 Research Center**  
**CodeFlowMu Core Team**

**TMPA Architecture Paper A0.9 · TMPA Core Specification S0.6 · TMPA Implementation Case Report I0.8 · Research Report Production Engine V1.3 · CodeFlowMu / FCoP**

> **V1.1 边界说明：** 已发布的 TMPA/FCoP/CodeFlowMu 与研究报告生产机能力，以对应版本规范和证据为准。Self-Morphing、统一 Digital Employee Package、通用 Agent PC 与 Development Runtime → Work Runtime 闭环仍包含正在推进的工程方向，不应被解读为无约束自修改或已经完成的全自动企业部署能力。