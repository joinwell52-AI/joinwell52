---
title: "从 SaaS 到 SaaW：当代码库开始“自己开发自己”"
date: "2026-08-10"
column: "industry-architecture"
category: "manifesto"
version: "V1.2"
summary: "一篇压缩后的视觉化技术宣言：从 TMPA 理论与规范、FCoP 协作协议和 CodeFlowMu 工程运行出发，界定 SaaW 与受治理自我演进的研究方向。"
item_id: "MANIFESTO-20260810-SAAW"
lifecycle: "Published"
cover: "/assets/covers/01-saaw-manifesto-cover-agent-worker.png"
visualization: "/assets/covers/04-saaw-three-system-relationship.svg"
visualization_2: "/assets/covers/05-saaw-research-workday-cinematic.png"
visualization_3: "/assets/covers/06-saaw-governed-evolution-cinematic.png"
visualization_4: "/assets/covers/07-saaw-human-authority-cinematic.png"
evidence_status: "Architecture-grounded + production-engine reference implementation"
citation_status: "TMPA V1.0 DOI and publication record linked"
editing_status: "Published V1.2 — condensed cinematic visual edition"
publication_authorized: true
outline: deep
---

# 从 SaaS 到 SaaW：当代码库开始“自己开发自己”

*基于 TMPA、FCoP 与 CodeFlowMu 工程实践的 AI 原生软件宣言*

[English version](/en/industry/2026-08-10-saaw-software-as-an-agent-worker)

[![SaaW — Software as an Agent Worker](/assets/covers/01-saaw-manifesto-cover-agent-worker.png)](/assets/covers/01-saaw-manifesto-cover-agent-worker.png)

## 1. 软件开始承担工作

SaaS 改变了软件的交付方式，却没有消除“人必须进入系统、理解界面、完成操作、核对结果”的最后一公里。Copilot 开始协助人，Agent 开始代替人执行若干步骤，而 **SaaW（Software as an Agent Worker）** 指向更进一步的研究方向：软件不只提供功能，而是在明确岗位、权限、流程和验收条件下持续承担工作。

这不是把聊天窗口改名为“数字员工”。一个可工作的系统必须知道：它接到了什么任务，当前由谁负责，使用了什么权限，产生了哪些证据，失败后如何恢复，最终由谁确认完成。SaaW 因而不是单一模型能力，而是运行、治理、协作、证据和人类授权共同构成的软件形态。

> **边界声明：** SaaW 与 Digital Employee 在本文中属于目标范式和研究方向；它们还不是已经完成并对外交付的第四个产品层。

## 2. 三套现有体系如何衔接

[![TMPA、FCoP 与 CodeFlowMu 的关系](/assets/covers/04-saaw-three-system-relationship.svg)](/assets/covers/04-saaw-three-system-relationship.svg)

*图 1：TMPA → FCoP → CodeFlowMu 的现有体系关系。三者不是同一个软件，也不能互相替代。来源：joinwell52 Research Center 架构综合。*

三者形成一条清楚的工程谱系：

| 体系 | 定位 | 负责什么 | 不负责什么 |
|---|---|---|---|
| [TMPA](/zh/publications/tmpa-architecture-paper-a1.0) | 理论与规范 | 定义治理对象、单写者事实流、Reader 语义、冲突与证据边界 | 不直接调度或执行工作 |
| [FCoP](https://joinwell52-ai.github.io/FCoP/) | 基于文件的协作协议 | 用任务、报告、复核、决策及生命周期文件承载可重建协作事实 | 不是完整 Agent Runtime |
| [CodeFlowMu](https://github.com/joinwell52-AI/CodeFlowMu-open) | 工程运行与开源参考环境 | 执行、恢复、角色协作并持续生成工作证据 | 工程结果不会自动证明理论成立 |

TMPA 给出约束，FCoP 把约束变成可见、可读、可重建的协作事实，CodeFlowMu 再将这些事实落实为实际运行。关系是“理论与规范 → 协作协议 → 工程实现”，不是三个名称的营销拼接。

## 3. 企业入口：Trace 不等于 Governance

日志、调用链和截图只能说明“发生过什么”，并不能自动回答“这次行动是否被授权、是否满足验收、冲突如何处理、谁能宣布完成”。因此，工作事实必须独立于某个 Agent 会话存在：Agent 可以替换，事实不能丢；会话可以结束，责任链不能消失。

TMPA 用文本化对象和 Reader 重建流程，FCoP 用项目可见文件保存任务与回执，CodeFlowMu 负责把它们带入运行、异常处理和恢复。这个组合的价值不在于记录更多日志，而在于让任务从接收、执行、复核到决策都可追溯、可争议、可修正。

## 4. 一个真实锚点：研究生产的一天

[![研究生产的一天](/assets/covers/05-saaw-research-workday-cinematic.png)](/assets/covers/05-saaw-research-workday-cinematic.png)

*图 2：同一条持久工作身份穿过发现、排队、阅读、分析、生产和发布。此图表现现有研究生产流程，不等同于宣称 SaaW 产品已经完成。来源：joinwell52 Research Center。*

研究报告生产机提供了一个可验证的工程锚点。一天不是一次超长提示词，而是一组有边界、有产物、有交接的阶段：

| 时间 | 阶段 | 可检查产物 |
|---|---|---|
| 09:00 | Discovery | 信号池与来源记录 |
| 10:00 | Queue | 选题、优先级与计划 |
| 11:00 | Reading | 阅读结果、引用与反证 |
| 13:00 | Analysis | 研究对象与工程判断 |
| 15:00 | Production | 中英文候选稿与配图 |
| 20:00 | Publication | 审核后发布、索引与提交证据 |

这里真正重要的不是时间表，而是每个阶段都留下下一阶段可以读取和质疑的事实。当前能力证明了“受治理的研究生产流程”可以运行；它为 SaaW 提供工程经验，但不等同于一个通用 Digital Employee 产品。

## 5. 从流程经验到可治理能力包

传统自动化常把脚本、提示词、密钥和个人经验混在一起。更稳健的方向，是把岗位能力整理成可审查的包：职责与输入、工具和权限、工作流、验收标准、异常升级、恢复规则、版本与证据要求。代码扫描只能产生候选结构，不能自动理解一个企业；候选结构必须经过人工确认、运行验证和版本治理。

因此，“软件开发软件”的含义不是任意生成代码，而是把已经验证的工作经验转化为可测试、可回滚、可复核的新能力。能力进入运行前必须经过隔离验证；上线后必须继续产生反馈与证据。

## 6. Self-Morphing：受治理的自我演进

[![受治理的自我演进](/assets/covers/06-saaw-governed-evolution-cinematic.png)](/assets/covers/06-saaw-governed-evolution-cinematic.png)

*图 3：开发、验证、部署、工作证据和下一轮改进形成闭环；实时运行体与元开发系统之间保留治理隔离。来源：joinwell52 Research Center 概念设计。*

本文所说的 **Self-Morphing** 不是运行中的 Agent 随意修改自身，也不是无限递归地产生 Agent。它是一个受控闭环：工作证据暴露缺口，元开发流程提出变更，在隔离环境测试，通过明确决策后部署，并保留旧版本与回滚路径。

这个方向要求至少满足五个条件：变更来源可追溯、测试结果可复现、部署需要权限、运行版本可识别、失败可以恢复。缺少其中任何一项，“自我演进”都会退化为不可审计的自动改写。

## 7. 人必须站在授权边界

[![人类授权边界](/assets/covers/07-saaw-human-authority-cinematic.png)](/assets/covers/07-saaw-human-authority-cinematic.png)

*图 4：左侧是可逆、受策略约束的自动运行；中间是审查门；右侧由人对高影响行动作出授权。来源：joinwell52 Research Center 概念设计。*

人不需要逐步点击所有操作，但必须掌握后果性权力。外部发布、不可逆修改、资金、凭证、隐私数据和策略例外，应在真正产生副作用之前停在授权门口。系统需要向人展示的是决策事实，而不是一整屏内部推理：做什么、为什么、影响什么、证据在哪里、批准或拒绝会发生什么。

这也是 PWA 或管理界面的正确角色：它不是把人拉回繁琐操作，而是成为清晰的授权与异常处理面。低风险、可逆、策略内的工作可以自动运行；高影响行动由人承担最终决定。

## 8. 已验证能力与研究前沿

当前已经存在并可分别检查的，是三套公开体系及其证据：TMPA V1.0 的 A1.0 架构论文、S1.0 核心规范和 I1.0 工程案例；FCoP 的文件协作协议与实现；CodeFlowMu 的开源工程运行环境。CodeFlowMu v1.8.0 对 TMPA S1.0 的公开实现证据记录为 14/14 PASS，但这只说明该实现对特定规范与测试的符合性，不代表所有 SaaW 能力已经完成。

下一步研究集中在三件事：把岗位能力包装成可治理对象；把元开发与生产运行彻底分离；用真实工作结果、恢复能力和人类授权质量评价系统，而不是只看模型回答。SaaW 是否成立，最终不由宣言决定，而由长期、可重建、可验收的工作事实决定。

软件的下一阶段或许不再只是“每人一个账号”，而是“每个组织拥有一组可治理的软件工作单元”。在那之前，正确的顺序仍然是：**先固定事实，再运行协作；先验证能力，再扩大自治。**

---

- **作者：** 朱卫 · joinwell52-AI
- **项目：** Digital Employee Works / joinwell52 Research Center
- **版本：** V1.2 · 2026-08-14 精简电影视觉版
- **TMPA V1.0 DOI：** [10.5281/zenodo.21888488](https://doi.org/10.5281/zenodo.21888488)
- **发布记录：** [TMPA V1.0 正式发布记录](/zh/publications/tmpa-v1.0-release-record)
