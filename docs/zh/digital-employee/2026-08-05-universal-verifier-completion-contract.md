---
title: 数字员工学术观察 002 — 完成是一项声明，而不是已接受状态
date: '2026-08-05'
column: digital-employee
category: academic
summary: Microsoft Research 的 Universal Verifier 表明，计算机操作型数字员工必须先提交可分别检查的过程、结果、失败与副作用证据，再由独立权限主体接受完成。
sources:
  - Microsoft Research and arXiv paper 2604.06240
  - Microsoft Research technical article
  - microsoft/fara Universal Verifier implementation
  - microsoft/CUAVerifierBench dataset card
outline: deep
---

<ArticleCover
  image="/assets/covers/academic-universal-verifier.svg"
  kicker="数字员工 · 学术观察 002"
  title="完成是一项声明，而不是已接受状态"
  summary="工作者可以声明完成；独立验证器与接受权限主体决定该声明能否成为持久事实。"
  version="DA002"
  status="Academic Runtime V5 · 2026-08-05"
  languageHref="/en/digital-employee/2026-08-05-universal-verifier-completion-contract"
  languageLabel="English"
/>

## 摘要

Microsoft Research 于 2026 年 4 月发布的预印本 **The Art of Building Verifiers for Computer Use Agents**，研究了计算机操作自动化中的一个核心难题：当 Agent 的执行轨迹很长、以视觉界面为主、依赖外部环境，并且可能作出没有充分依据的成功声明时，系统应如何判断任务是否真正完成？

论文提出 **Universal Verifier**，并发布了人工标注基准 **CUAVerifierBench**。其主要设计不再把完成压缩成单一二元判断，而是分离过程质量与结果达成，区分可控与不可控失败，生成任务特定且互不重叠的评分准则，并针对每条准则检索相关截图证据，而不是把最后一张屏幕截图或 Agent 自身的最终回答当作充分证明。

Research Center 的判断是：

> 完成应以版本化声明进入数字员工运行时。只有经过独立的过程、结果、失败与副作用检查，并由明确的权限策略作出接受决定后，它才能成为已接受状态。

该研究支持采用“完成证据契约”。但它不支持不加选择地整体采用 Microsoft 的验证器实现，也不能证明事务安全、企业事故率下降或对 Web 之外计算机操作任务的可靠性。

## 主要研究对象

本次 Academic Runtime 的主要对象是论文，而不是普通产品公告：

- **论文：** The Art of Building Verifiers for Computer Use Agents
- **作者：** Corby Rosset、Pratyusha Sharma、Andrew Zhao、Miguel Gonzalez-Fernandez、Ahmed Awadallah
- **机构：** Microsoft Research，并有 Browserbase 参与
- **发布：** arXiv v1，2026 年 4 月 5 日；Microsoft Research 技术文章发布于 2026 年 4 月 21 日
- **开放成果：** Universal Verifier 实现与 CUAVerifierBench

该对象以 `Q-20260805-12` 进入当前 Runtime 队列，来源为 Published Research Intelligence 信号 `SIG-20260805-R-003`。其入选原因是：完成误报是数字员工、TMPA 证据以及 CodeFlowMu 完成门禁中边界清晰的治理问题。

## Universal Verifier 改变了什么

传统任务评估器通常试图回答一个二元问题：**Agent 成功了吗？** 论文认为，这种方式把多个本应独立检查的判断压缩成了一个标签。

Universal Verifier 将验证组织为结构化结果：

```text
过程评分
+ 结果判断
+ 诊断性失败报告
= 验证器判断
```

### 1. 评分准则必须具体且互不重叠

系统先根据任务生成评分准则，再把执行轨迹交给评分阶段。将“定义标准”与“观察行为”分开，可以降低系统为了合理化 Agent 已经采取的路径而临时编造标准的风险。

论文归纳了几类反复出现的准则缺陷：

- **虚构准则：** 评估用户从未提出的要求；
- **级联扣分：** 一个上游错误导致多个下游条目重复扣分；
- **行为条件化准则：** 看过轨迹后才调整评分标准；
- **未解析条件准则：** 互斥条件同时保持有效。

作者报告，在迭代开发中，改进评分准则设计贡献了约一半 Cohen’s kappa 增益。这说明：如果测量契约本身有缺陷，下游再强的评分模型也无法可靠修复。

### 2. 过程与结果是独立信号

过程评分衡量 Agent 对适用子目标的执行质量；结果判断则询问，一个合理用户是否会认为请求的最终状态已经达成。

两者可能合理地不一致：

- Agent 遵循了正确流程，但被 CAPTCHA 或库存不可用阻塞；
- Agent 通过意外但有效的路径实现目标；
- Agent 给出看似合理的最终回答，却没有执行必要操作；
- Agent 完成可见目标，同时产生了用户未要求的副作用。

对数字员工而言，这种分离可以避免两种相反错误：把努力当作完成，或者把环境造成的阻塞误判为工作者违规。

### 3. 失败责任必须成为一等结果

验证器区分 Agent 可控因素与外部不可控因素。

可控失败包括意图不匹配、推理错误、幻觉、投入不足、执行错误以及无效工具交互。不可控失败包括缺少凭据的登录墙、CAPTCHA、基础设施故障、目标实体不存在、库存售罄以及没有匹配结果。

这种分类不仅用于解释。它会影响过程评分、重试策略、升级路径，以及系统下一步应改进工作者、修复环境、请求权限还是终止任务。

### 4. 证据检索应面向具体准则

长轨迹可能包含数百张截图。把所有帧一次性放进提示词会形成“大海捞针”问题；只检查最后几帧又可能遗漏关键证据。

Universal Verifier 建立“截图—准则”相关性矩阵。系统对每条准则选择最相关截图，抽取证据，解析条件准则，执行现实检查，再重新评分。截图证据优先于 Agent 自身的完成声明。

这是一个重要架构模式：证据应按声明建立索引，而不能只是按时间累积成日志。

![完成声明、独立验证器、接受门禁与已接受状态](/assets/covers/academic-universal-verifier.svg)

*图：joinwell52 Research Center 根据论文验证边界与数字员工接受边界综合绘制。*

## 实验数据

论文在两个论文版本的数据切分上评估验证器与人工判断的一致性：

| 指标 | 内部集，n=140 | Browserbase OM2W，n=106 |
|---|---:|---:|
| Universal Verifier 结果 Cohen’s κ | 0.64 | 0.58 |
| WebJudge 结果 Cohen’s κ | 0.44 | 0.26 |
| WebVoyager 结果 Cohen’s κ | 0.31 | 0.13 |
| Universal Verifier 结果误报率 | 0.01 | 0.08 |
| WebJudge 结果误报率 | 0.22 | 0.40 |
| WebVoyager 结果误报率 | 0.45 | 0.60 |
| Universal Verifier 过程 Cohen’s κ | 0.59 | 0.43 |

外部数据集的误报率仍为 **8%**，因此“接近零”不能被解释为字面上的零。不过，该结果仍明显低于论文中评估的基线。

论文还把基线验证器的 Backbone 升级为 GPT-5.2。更强模型在部分设置中降低了误报，却提高了漏报，整体 kappa 只得到有限改善。因此，作者将主要优势归因于验证器架构，而不是单纯替换模型。

Browserbase 人工标注者之间的一致性范围，结果判断为 0.53–0.57，过程判断为 0.36–0.45。Universal Verifier 的一致性处于这些范围内。这支持一个有边界的表述：它与人工判断的一致程度，接近人工标注者彼此之间的一致程度；但这并不能证明人工或验证器是客观真值。

### 版本说明

论文使用的内部实验集为 140 条轨迹；当前公开的 Hugging Face Dataset Card 列出 154 条内部轨迹和 106 条 Browserbase 轨迹。因此，任何结果都必须绑定到具体论文、数据配置、切分和发布版本，不能把它描述成“CUAVerifierBench”永久不变的属性。

## 为什么这是一个架构结论

论文最可迁移的贡献是分解方式，而不是某个特定提示词或模型：

```text
工作者声明
→ 面向声明的证据检索
→ 过程评估
→ 结果回读
→ 失败与副作用分类
→ 策略／权限决定
→ 已接受的完成回执
```

数字员工不应同时充当声明者与最终接受者。工作者可以提交完成声明、证据引用和建议状态；独立验证器负责评估这些声明；策略或获得授权的人保留接受、拒绝、升级或保持未确定的权力。

这对应一种职责分离：

- **工作者：** 执行操作并提交证据；
- **验证器：** 根据版本化契约评估证据；
- **接受者：** 应用业务权限与风险策略；
- **运行时：** 保存所有判断，不抹平彼此冲突。

## 建议的完成证据契约

可复用的运行时投影可以表示为：

```yaml
completion_claim:
  claim_id:
  work_order_id:
  operation_node_id:
  claimant:
  requested_outcome:
  rubric_version:
  process_evidence_refs: []
  outcome_evidence_refs: []
  deterministic_checks: []
  learned_verifier_result:
  failure_class:
  controllability:
  side_effect_assessment:
  verifier_identity:
  verifier_version:
  acceptance_authority:
  acceptance_decision: accepted | rejected | escalated | undetermined
  accepted_at:
  completion_receipt_ref:
```

可移植契约应引用原始截图、轨迹与业务系统回读，而不是直接嵌入所有敏感证据。保留周期、隐私与访问控制属于受治理证据存储层。

## 哪些检查必须彼此独立

后果重大的数字员工运行时至少应组合三类验证界面：

1. **确定性检查：** 数据库回读、文件哈希、工作流状态、余额、记录是否存在或应用状态；
2. **学习型验证：** 轨迹解释、截图证据、意图一致性、失败诊断与副作用识别；
3. **人工或策略接受：** 对不可逆、含糊、受监管或高影响工作的最终权限。

这些检查可能互相冲突。运行时应保存冲突，而不是强制立即得到二元答案。`Undetermined` 或 `Needs Human Acceptance` 比制造 `Completed` 更安全。

## 局限与反证

出版门禁必须保留以下边界：

- 来源是 arXiv 预印本和官方研究出版物，不是最终同行评审的档案论文；
- 论文中的人工标注数据集规模较小；
- Browserbase 数据只包含一个 Agent——Fara-7B——的轨迹，尚未证明可迁移到其他 Agent；
- 研究限于 Web 计算机操作轨迹；
- 人工标签是判断，不是客观完成 Oracle；
- Universal Verifier 是由代码和提示词组成的大型捆绑系统，没有证明每个组件都能独立迁移；
- 论文没有证明回滚、补偿、幂等、持久会话恢复、延迟副作用检测或事务保证；
- 成本、时延、隐私、截图保留和企业访问边界尚未解决；
- 当前 Dataset Card 提醒，106 条外部数据规模较小，并继承 Online-Mind2Web 的时间与领域偏差。

## 工程影响

### TMPA

单篇论文不足以支持修改 TMPA Core。后续可以先在 Profile 或 Projection 中表示声明者、验证器、接受者、证据契约、过程判断、结果判断、失败分类和冲突决定。可移植协议应传递引用与确定语义，而不是厂商特定的验证提示词。

### 数字员工

每个后果重大的 Operation Node 都应产生完成声明，而不是直接写入已接受完成。Position 与 WorkOrder 应定义预期业务结果、验证要求、接受权限、禁止副作用、重试策略与升级规则。

不可控失败必须与工作者失败分开。正确流程因缺少凭据或库存不可用而被阻塞，既不是成功，也不等同于幻觉或疏忽执行。

### CodeFlowMu

当前最直接的工程步骤是建立持久的 **completion receipt projection**，而不是立即开发通用视觉验证器。CodeFlowMu 可以先组合：

- 操作后的确定性状态回读；
- 版本化证据引用；
- 可选的学习型验证；
- QA/EVAL 或 ADMIN 接受；
- 明确的冲突与升级状态；
- 终态完成前的提交与产物验证。

工作者最后一次动作、最终消息或单张截图，都不应单独把后果重大的任务推进到 `done`。

## 出版判断

证据支持以下有边界的采用结论：

> 采用“声明、过程证据、结果证据、失败归因、独立验证、基于权限的接受”这一分离模式；不要把论文报告的 Universal Verifier 当成通用生产保证。

论文为“二元、自报式完成在结构上不足”提供了较强证据；为“基于准则的视觉验证可以迁移到更广泛数字员工系统”提供了中等强度证据；对企业事故率下降、非 Web 工作与事务安全只提供了较弱证据。

## 参考资料

1. Rosset 等，**The Art of Building Verifiers for Computer Use Agents**，arXiv：https://arxiv.org/abs/2604.06240
2. 完整实验 HTML：https://arxiv.org/html/2604.06240
3. Microsoft Research 论文页：https://www.microsoft.com/en-us/research/publication/the-art-of-building-verifiers-for-computer-use-agents/
4. Microsoft Research 技术文章：https://www.microsoft.com/en-us/research/articles/the-art-of-building-verifiers-for-computer-use-agents/
5. Universal Verifier 实现与 Fara Repository：https://github.com/microsoft/fara
6. CUAVerifierBench Dataset Card：https://huggingface.co/datasets/microsoft/CUAVerifierBench
7. Runtime 队列对象：https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/plans/2026/08/2026-08-05-plan.json
