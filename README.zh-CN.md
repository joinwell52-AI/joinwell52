# TMPA：文本化多智能体流程架构

> **面向生产级多智能体工作的治理架构**

[English](./README.md) · **简体中文**

本地启动、校验、构建以及 15:00 实际文章候选检查，请参阅：[本地运行说明](./LOCAL-RUN-GUIDE.zh-CN.md)。

[![架构论文 A1.0](https://img.shields.io/badge/TMPA-架构论文_A1.0-2563eb?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/zh/publications/tmpa-architecture-paper-a1.0)
[![核心规范 S1.0](https://img.shields.io/badge/TMPA-核心规范_S1.0-7c3aed?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/zh/publications/tmpa-core-specification-s1.0)
[![实施案例 I1.0](https://img.shields.io/badge/CodeFlowMu-I1.0_14%2F14_PASS-15803d?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/zh/publications/implementation-case-i1.0)
[![DOI](https://img.shields.io/badge/DOI-10.5281%2Fzenodo.21888488-1682D4?style=for-the-badge)](https://doi.org/10.5281/zenodo.21888488)

## 推荐文章

置顶文章可以在外发前登记，外发后直接在同一行补充平台链接。普通外部发布记录从 **2026-08-12** 开始，不回填此前的历史发布；同一文章的中文、英文及各平台链接集中在一行。

| # | 标题 | 版本 | 一句话 |
|---:|---|---|---|
| 📌 | **从 SaaS 到 SaaW：当代码库开始“自己开发自己”** | [研究主页中文](https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-08-10-saaw-software-as-an-agent-worker) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/industry/2026-08-10-saaw-software-as-an-agent-worker) | 从治理、TMPA、FCoP、Agent PC、CodeFlowMu 与 Self-Morphing 推导 SaaW，并以真实生产引擎区分已验证能力与研究前沿。 |
| 01 | **一个 Agent 说“完成了”，团队为什么没放行？** | [研究主页中文](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-08-06-codeflowmu-multi-agent-fact-checking) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-08-06-codeflowmu-multi-agent-fact-checking) · [CSDN 中文](https://blog.csdn.net/m0_51507544/article/details/163676669) · [DEV English](https://dev.to/joinwell52/one-agent-said-done-why-didnt-the-team-release-it-518j) | 一次工具异常后，PM 没有接受“完成”声明，而是让 DEV、Subexecution、PM 与 QA 依次补齐磁盘、Git、报告和测试证据，最终形成可核验交付。 |
| 02 | **智能体能力正在被封装为技能、插件与契约** | [研究主页中文](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-08-02-agent-capability-packaging) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-08-02-agent-capability-packaging) · [CSDN 中文](https://blog.csdn.net/m0_51507544/article/details/163677686) · [DEV English](https://dev.to/joinwell52/open-source-engineering-weekly-002-agent-capability-is-being-packaged-as-skills-plugins-and-1db5) | 可复用智能体能力正在从隐藏提示词转向可检查的技能、插件、接口、工作流节点、事件与最小能力契约。 |
| 03 | **持久化智能体运行时正在成为基础能力** | [研究主页中文](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-08-02-durable-agent-runtime) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-08-02-durable-agent-runtime) · [CSDN 中文](https://blog.csdn.net/m0_51507544/article/details/163677784) · [DEV English](https://dev.to/joinwell52/open-source-engineering-weekly-001-durable-agent-runtime-is-becoming-the-baseline-2oim) | LangGraph、OpenHands、CrewAI 与 AutoGen 共同显示，持久状态、中断、恢复、隔离、可观测与明确完成控制正在成为运行时基础能力。 |

TMPA 是一套厂商中立的架构与规范，用于治理由异构 AI Agent 与人类共同承担的长周期工作。它把持久工作事实从模型的易失性记忆中剥离出来，以可检查对象保存事实，在异步执行中维持责任边界，并依据现有证据重构生命周期、权限、冲突与审计状态。

本仓库是 TMPA 的公开研究、规范、符合性测试与证据基座。**CodeFlowMu** 是 TMPA 的主要工程实证。数字研究员及其发布的文章属于衍生研究基础设施与研究讨论，既不是本仓库的核心定位，也不是 TMPA 的规范性来源。

## 从 TMPA V1.0 稳定版文档集开始

| 文档 | 定位 | 在线阅读 | 正式版工件 |
|---|---|---|---|
| **架构论文 A1.0** | 阐述治理状态问题与架构理论 | [网页](https://joinwell52-ai.github.io/joinwell52/zh/publications/tmpa-architecture-paper-a1.0) | [PDF](./docs/public/releases/tmpa/v1.0/artifacts/tmpa-architecture-paper-a1.0-zh.pdf) |
| **核心规范 S1.0** | 定义规范对象、生命周期、权限、Reader 行为与 C01–C14 | [网页](https://joinwell52-ai.github.io/joinwell52/zh/publications/tmpa-core-specification-s1.0) | [PDF](./docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-zh.pdf) |
| **实施案例 I1.0** | 报告 CodeFlowMu V1.8.0 针对 S1.0 的有界产品证据 | [网页](https://joinwell52-ai.github.io/joinwell52/zh/publications/implementation-case-i1.0) | [PDF](./docs/public/releases/tmpa/v1.0/artifacts/tmpa-implementation-case-i1.0-zh.pdf) |

包含中英文出版物、引用元数据、Manifest、校验和与发行说明的完整档案位于 [`docs/public/releases/tmpa/v1.0/`](./docs/public/releases/tmpa/v1.0/)。

**TMPA V1.0 Zenodo 归档：** <https://zenodo.org/records/21888488>

**DOI：** <https://doi.org/10.5281/zenodo.21888488>

## 为什么需要 TMPA

现代 Agent 系统能够产生丰富的执行轨迹：提示词、工具调用、输出与时间戳。这些记录回答的是**执行了什么**。生产治理还必须回答：

- 谁接受了责任，谁有权批准？
- 哪一个对象代表权威工作事实？
- 被声明的生命周期迁移是否合法？
- 哪些证据缺失、冲突、无效，或仍在等待人工决定？
- Agent 退出、模型变更或 Runtime 重启后，能否重构当前状态？

因此，**执行轨迹（Trace）不等于治理（Governance）**。TMPA 不是另一个通用 Agent 框架，也不会因为系统保存了日志、Markdown 或工作流状态就宣称已经实现治理。它定义的是可观察、可测试的治理行为。

## 四条相互连接的核心规则

1. **文本承载持久消息与状态。** 工作事实以可移植、可检查的对象存在，而不是困在模型会话或进程实例中。
2. **每个写入者拥有自己的局部串行流。** 单写者语义保留来源，防止一个主体静默改写另一个主体的历史。
3. **多个串行流异步推进。** 协作保留偏序与并发语义，不虚构并不存在的全局时间线。
4. **Reader 重构治理状态。** Reader 聚合现有证据，推导流程、责任、生命周期、冲突、三值判断与显式 Issue Set。

TMPA Core 不绑定存储介质：符合规范的实现可以使用文件、数据库行、对象存储对象或事件。**FCoP** 提供基于文件的协作与证据 Profile；**CodeFlowMu** 在可运行的工程系统中实现并消费这一投影。

## 从理论到工程证据

```text
TMPA 架构论文 A1.0
        ↓ 架构理论与设计方向
TMPA 核心规范 S1.0
        ↓ 规范对象、Reader 与符合性行为
FCoP
        ↓ 基于文件的协作与证据 Profile
CodeFlowMu V1.8.0
        ↓ 产品 Adapter 与 Governance Reader
实施案例 I1.0
        ↓ 有边界、可检查的工程证据
数字员工与 Research Runtime 应用
```

这个依赖方向不能颠倒：A1.0 陈述理论，S1.0 是规范性权威，FCoP 提供可复用的协作协议，CodeFlowMu 实现并消费治理投影，I1.0 报告已演示的结果。工程实现可以支持、挑战或推动后续理论修订，但不能静默重定义当前规范。

## CodeFlowMu 工程实证

I1.0 使用精确、冻结的 TMPA Core S1.0 Bundle，评估 CodeFlowMu V1.8.0 的产品 Reader。产品路径实际调用 `GovernanceReader.readSync`，没有用 TMPA Reference Reader 替代产品实现。

| 证据项 | 记录结果 |
|---|---:|
| S1.0 符合性准则 | **14 PASS / 0 PARTIAL / 0 NOT RUN / 0 FAIL** |
| 强制断言 | **71 / 71 通过并完成重算** |
| CodeFlowMu TMPA Runtime 测试 | **24 通过 / 0 失败** |
| CodeFlowMu Runtime 完整测试 | **1,522 通过 / 0 失败 / 1 跳过** |
| CodeFlowMu Shell 覆盖 | **791 通过 / 0 失败** |
| 锁定的 FCoP 参考实现 | **1,210 通过 / 2 跳过** |
| 证据完整性 | **内部 SHA-256 Manifest 覆盖 889 个文件** |

证据入口：

- [实施案例 I1.0 源文档](./docs/zh/publications/implementation-case-i1.0.md)
- [S1.0 符合性工作区与发行审计](./research/conformance/tmpa-core-s1.0/)
- [已登记的 CodeFlowMu V1.8.0 精确版本运行](./research/conformance/tmpa-core-s1.0/external-runs/20260811-codeflowmu-v1.8.0/)
- [锁定证据包](./docs/public/evidence/tmpa/i1.0/tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip) · [SHA-256](./docs/public/evidence/tmpa/i1.0/tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip.sha256)

**声明边界：**上述结果是作者针对一个精确实现版本与一个精确 S1.0 输入 Bundle 运行后获得的已演示行为，不构成独立认证、任意环境下的普遍符合性、TMPA 理论证明、语义真实性证明、幻觉消除证明或独立采用证据。

## 机器可读规范与复现

已发布的 S1.0 机器契约包括：

- [Governance Object Schema](./docs/public/spec/tmpa/s1.0/governance-object.schema.json)
- [Lifecycle Profile Schema](./docs/public/spec/tmpa/s1.0/lifecycle-profile.schema.json)
- [Reader Result Schema](./docs/public/spec/tmpa/s1.0/reader-result.schema.json)
- [Conformance Result Schema](./docs/public/spec/tmpa/s1.0/conformance-result.schema.json)

使用 Node.js 20 或更高版本，可在本地运行作者提供的 S1.0 Reference Reader 测试：

```bash
npm ci
npm run tmpa:s1.0:conformance
```

Reference Reader 结果与单独登记的 CodeFlowMu 产品结果属于两条不同的证据轨道。解释任何结果前，请先阅读[符合性测试说明](./research/conformance/tmpa-core-s1.0/README.md)。

## 研究基础设施与衍生产出

本仓库还包含一套受治理的研究生产系统：Research Intelligence、Daily/Weekly/Academic/Program Runtimes、Research Skills、出版门禁与校验脚本。它们提供了持续运行的研究环境，用于实践治理思想并发布研究成果。

数字研究员每天发布的文章是这一环境的**衍生产出**。它们可以解释 TMPA、连接行业变化或提出新的研究方向，但不能定义符合性，也不能覆盖 S1.0。

- [SaaW：Software as an Agent Worker](https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-08-10-saaw-software-as-an-agent-worker) — 从 SaaS 到“软件作为受治理的工作主体”的行业宣言，连接 TMPA 与 CodeFlowMu 的行业意义。
- [Research Runtime Center V5.0](./docs/zh/runtime/v5.md) — 数字研究员及其出版工作流的运行体系。
- [研究报告生产引擎 V1.3](./docs/zh/publications/research-report-production-engine-v1.3.md) — 构建于该 Runtime 之上的报告生产实现。

引用 TMPA 的权威主张时，请以架构论文和核心规范为准；引用工程结果时，请以 I1.0 与证据包为准；论文之外的文章与宣言应视为研究讨论。

## 仓库结构

```text
.
├── docs/
│   ├── en/ 与 zh/                   # 双语研究网站源文件
│   └── public/
│       ├── spec/tmpa/s1.0/          # 机器可读规范契约
│       ├── releases/tmpa/v1.0/      # 带校验和的双语出版档案
│       └── evidence/tmpa/i1.0/      # 锁定的 CodeFlowMu 证据包
├── research/
│   ├── conformance/tmpa-core-s1.0/  # Reference Reader、Fixture、结果与审计
│   ├── runtime/                      # 受治理的研究执行记录
│   ├── intelligence/                 # 来源 Registry 与研究信号
│   └── skills/                       # 分阶段研究工作契约
├── scripts/                          # 校验、投影与网站工具
└── .github/workflows/                # 校验、调度与 Pages 部署
```

## 引用、权利与参与方式

- 引用元数据：[`CITATION.cff`](./CITATION.cff)，以及 [V1.0 档案](./docs/public/releases/tmpa/v1.0/metadata/)中的各出版物 CFF/BibTeX 文件
- 权利与使用范围：[`LICENSE.md`](./LICENSE.md)
- 研究与贡献规则：[`CONTRIBUTING.md`](./CONTRIBUTING.md) 与 [`RESEARCH-GOVERNANCE.md`](./RESEARCH-GOVERNANCE.md)

## 作者

**朱卫 / Zhu Wei · joinwell52-AI**  
独立研究者

研究网站：[joinwell52-ai.github.io/joinwell52/zh](https://joinwell52-ai.github.io/joinwell52/zh/)
