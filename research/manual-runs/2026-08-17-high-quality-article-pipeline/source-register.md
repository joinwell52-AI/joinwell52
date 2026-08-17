# 来源登记

访问日期统一为 2026-08-17（Asia/Shanghai）。所有链接均在本次实时运行中打开或下载核验；论文使用完整 PDF 阅读方法、结果与局限，不只读取摘要。

| 来源 | 独立身份 | 类型 | 支持范围 | 不支持范围 |
|---|---|---|---|---|
| [An Empirical Study of Automating Agent Evaluation](https://arxiv.org/abs/2605.11378) | AWS AI Labs / EvalAgent | 研究论文 | 评测生成需要领域知识；计划、轨迹、评测代码与报告可以形成完整工件；在 Sonnet 4.5 evaluator backbone 下，单轮 B1 baseline 的 Eval@1 为 17.5%，EvalAgent 为 65.0%；另一个实验中，专家在 EvalAgent 与 B4 的盲法成对比较里有 79.5% 偏好 EvalAgent | 不证明跨模型、跨领域普遍有效；20 个 Agent、Claude 模型族；仍约三分之一首次执行失败 |
| [Agent-EvalKit](https://github.com/awslabs/Agent-EvalKit) | AWS Labs 维护仓库 | 实现与测试入口 | 可检查的六步实现：计划、用例、Tracing、运行、评测代码、报告 | 不能作为论文数字的独立复现，也不等于生产成熟度 |
| [AgentLens: Revealing the Lucky Pass Problem in SWE-Agent Evaluation](https://arxiv.org/abs/2605.12925) | Microsoft + UIUC | 基准研究 | 1,136 条通过轨迹中 10.7% 被归为 Lucky Pass；过程质量与通过率排序不同；轨迹诊断能定位浪费与偏离 | 仅覆盖 OpenHands 风格、SWE-bench Verified 子集；高过程分不保证补丁正确或安全 |
| [Coding Agents Are Guessing: Measuring Action-Boundary Violations in Underspecified DevOps Instructions](https://arxiv.org/abs/2607.02294) | HKUST + Tongji | 基准研究 | 确定性副作用 Oracle 把 Safe Success、Wrong Target、OverScope 分开；测试配置中 55.8%–67.8% 的已行动运行越过至少一个边界 | 容器化、无确认的压力测试不能直接外推真实生产事故率 |
| [ScientistOne: Towards Human-Level Autonomous Research via Chain-of-Evidence](https://arxiv.org/abs/2605.26340) | Google Cloud AI Research | 研究论文 | 事实—证据链、Score Verification、Specification Violation、Reference Verification、Method–Code Alignment 的组合；75 篇论文审计揭示表面质量不能代替证据一致性 | 不证明完整科学有效性、创新性或引文语义完全正确；开放科学领域仍需专门核验逻辑 |

## 链接状态

- 5 个核心 URL 均可访问。
- 4 篇论文的 PDF 已完整下载并读取；临时 PDF 仅用于本次核验，不作为交付证据。
- Agent-EvalKit 仓库 README 可访问，六步工作流与论文描述一致；未执行该工具，也不声称复现论文指标。
