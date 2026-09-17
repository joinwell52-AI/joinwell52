# 六位治理研究者：从论文到 GitHub 仓库

核验日期：2026-09-17。本文记录公开研究来源及监测对象，不包含交流稿、联系信息或评论台账。

## 纳入结果

权威清单为 [REGISTRY.json](./REGISTRY.json) 的 `github-engineering.repositories`：新增 5 个仓库，关联已有 MAST，共覆盖 6 位研究者。均为 P1、每周巡检，沿用现有研究发现任务，不另建重复定时任务。Discovery 的生成提示词要求每轮从最新 main 读取该清单；本次接入不代表下一次定时巡检已经执行。

| 研究者 | 起点论文 | 实际跟踪仓库 | 证据关系与边界 |
| --- | --- | --- | --- |
| Maurits C. Kaptein | [Runtime Governance for AI Agents: Policies on Paths](https://arxiv.org/html/2603.16586v1) | [Kyvvu/manifests](https://github.com/Kyvvu/manifests) | 论文 §4.5 → [Kyvvu 官方文档](https://docs.kyvvu.com/) → [官方组织](https://github.com/Kyvvu)的公开策略仓库。是参考实现生态中的策略文件，不是完整平台源码。文档所链 Kyvvu/platform 本轮返回 404，不能判定其是私有还是不存在。 |
| Lakshya A. Agrawal | [Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/abs/2503.13657v3) | [multi-agent-systems-failure-taxonomy/MAST](https://github.com/multi-agent-systems-failure-taxonomy/MAST) | 论文项目仓库；作者为合著者。原已纳入 P1，本次补全作者、论文与基线关联，不重复登记。 |
| Christian Schroeder de Witt | [Open Challenges in Multi-Agent Security](https://arxiv.org/html/2505.02077v2) | [schroederdewitt/perfectly-secure-steganography](https://github.com/schroederdewitt/perfectly-secure-steganography) | 综述 Figure 1、§3.2.2、参考文献 Schroeder de Witt et al. (2023b/2023c) → Perfectly Secure Steganography Using Minimum Entropy Coupling → 作者发布的同名论文代码。它支撑隐蔽通信机制研究，不是 Open Challenges 整篇综述的实现。 |
| Mansura Habiba | [AGENTSAFE](https://arxiv.org/html/2512.03180v1) | [mansura-habiba/bulbasaur-skill-cli](https://github.com/mansura-habiba/bulbasaur-skill-cli) | AGENTSAFE 正文未找到官方代码链接。此仓库是作者的相关技能构建、审计、评测与依赖锁定工具；不能标成 AGENTSAFE 官方实现或实证验证。 |
| Shaokun Zhang | [Which Agent Causes Task Failures and When?](https://arxiv.org/abs/2505.00212v3) | [ag2ai/Agents_Failure_Attribution](https://github.com/ag2ai/Agents_Failure_Attribution) | 论文链接 [mingyin1 分叉](https://github.com/mingyin1/Agents_Failure_Attribution)；GitHub API 的 parent/source 均指向 ag2ai 上游，上游 README 反向链接同一论文。研究跟踪上游，保留论文原始链接。 |
| Haoyu Wang | [AgentSpec](https://arxiv.org/abs/2503.18666v3) | [haoyuwang99/AgentSpec](https://github.com/haoyuwang99/AgentSpec) | 作者公开的论文实现，README 与论文题名对应；重点跟踪运行时约束与评测。 |

## 巡检与证据规则

1. 依照 Registry 和 Skill 01-G 检查文档、代码、PR、可复现 Issue、测试与数据变化；不能只检查 Release。
2. 对照本次默认分支 commit 基线，保存下次实际巡检日期、链接及增量；没有变化与无法访问分别记录。
3. 旧仓库仍可作为机制与复现实验材料，但旧提交不得包装成本日新发现；加入名单不代表已运行实验。
4. 在作者或团队的新仓库中发现论文实现时，先核对论文、作者主页和 README 的关联，再替换或补充监测对象。AGENTSAFE 官方仓库缺口需保留，不能用同名项目填补。
5. 有价值的议题进入实验筛选，实验完成后再决定文章与互动；只有经过实验且有 CodeFlowMu 本地问题或需求证据的项目才进入开发评审。本次未新增实验或开发评审。

## 初始版本基线

以下是本轮 GitHub API 返回的默认分支 HEAD；用于后续增量比较，不是“已复现”的证据。

| 仓库 | 默认分支 HEAD |
| --- | --- |
| Kyvvu/manifests | `ed09a4e7ddf3f06b49c0f862a2da13caa9ffc5b4` |
| multi-agent-systems-failure-taxonomy/MAST | `a70542e541b2104ef8fcd785778179e173fb8d70` |
| schroederdewitt/perfectly-secure-steganography | `cc36ae0b585fae4c7fcf65f7ee4db43aac2edd28` |
| mansura-habiba/bulbasaur-skill-cli | `40303e91b1289200541b3c9f0c975d427fc5b632` |
| ag2ai/Agents_Failure_Attribution | `f4d2b6da464a826580e59b3a0eae15ea2d642d7c` |
| haoyuwang99/AgentSpec | `e6fa3902e2cfb9681f454b355691b771f70543f8` |

## 作者入口

- Maurits：[个人主页](https://www.mauritskaptein.com/)、[Kyvvu](https://github.com/Kyvvu)；尚未确认个人 GitHub 账号。
- Lakshya：[个人主页](https://lakshyaaagrawal.com/)、[GitHub](https://github.com/LakshyAAAgrawal)。
- Christian：[实验室个人页](https://wittlab.ai/people/christian-schroeder-de-witt/)、[GitHub](https://github.com/schroederdewitt)。
- Mansura：[GitHub](https://github.com/mansura-habiba)、[公开 Guardrails PR](https://github.com/langflow-ai/langflow/pull/14934)。
- Shaokun：[个人主页](https://skzhang1.github.io/)、[GitHub](https://github.com/skzhang1)。
- Haoyu：[个人主页](https://sites.google.com/view/haoyuwang18)、[GitHub](https://github.com/haoyuwang99)。
