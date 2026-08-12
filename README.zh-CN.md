<p align="center">
  <img src="./docs/public/assets/readme/tmpa-readme-hero-zh.svg" alt="TMPA：文本化多智能体流程架构" width="100%">
</p>

<p align="center">
  <strong>AI Agent 能产出结果；生产系统还必须证明：谁负责、什么被接受、为什么可以放行。</strong>
</p>

<p align="center">
  <a href="https://joinwell52-ai.github.io/CodeFlowMu-open/"><strong>了解 CodeFlowMu Open</strong></a>
  ·
  <a href="https://joinwell52-ai.github.io/FCoP/"><strong>了解 FCoP</strong></a>
  ·
  <a href="https://joinwell52-ai.github.io/joinwell52/zh/"><strong>进入研究主页</strong></a>
  ·
  <a href="./README.md"><strong>English</strong></a>
</p>

<p align="center">
  <a href="https://github.com/joinwell52-AI/joinwell52/stargazers"><img alt="GitHub Stars" src="https://img.shields.io/github/stars/joinwell52-AI/joinwell52?style=for-the-badge&logo=github&label=Star"></a>
  <a href="https://doi.org/10.5281/zenodo.21888488"><img alt="DOI" src="https://img.shields.io/badge/DOI-10.5281%2Fzenodo.21888488-1682D4?style=for-the-badge"></a>
  <a href="https://joinwell52-ai.github.io/joinwell52/zh/publications/tmpa-core-specification-s1.0"><img alt="TMPA Core S1.0" src="https://img.shields.io/badge/Core-S1.0-7c3aed?style=for-the-badge"></a>
  <a href="https://joinwell52-ai.github.io/joinwell52/zh/publications/implementation-case-i1.0"><img alt="Implementation I1.0" src="https://img.shields.io/badge/CodeFlowMu-14%2F14_PASS-15803d?style=for-the-badge"></a>
</p>

---

# TMPA

**TMPA（Textual Multi-Agent Process Architecture，文本化多智能体流程架构）**是一套厂商中立的治理架构，用于管理由 AI Agent 与人类共同承担的长周期工作。它把持久工作事实从模型的易失性记忆中剥离出来，在异步执行中保留责任边界，并依据可检查证据重构生命周期、权限、冲突与审计状态。

本仓库是 TMPA 的公开研究、规范、可执行符合性测试与证据基座。[**CodeFlowMu Open**](https://github.com/joinwell52-AI/CodeFlowMu-open)（[产品主页](https://joinwell52-ai.github.io/CodeFlowMu-open/)）是采用 MIT 许可证、可以安装和实际使用的开源产品：由 **PM / DEV / OPS / QA** 组成四人开发团队，EVAL 在旁路独立观察。当前公开版的 Agent 入口**只对接 Cursor SDK**。[**FCoP**](https://github.com/joinwell52-AI/FCoP)（[协议主页](https://joinwell52-ai.github.io/FCoP/)）是该团队采用的 MIT 开源文件式行为治理协议。

> 如果你正在构建必须经受重启、交接、争议、复核与真实组织问责的 Agent 系统，这个仓库就是为你准备的。**Star 本仓库，即可持续关注稳定规范、可执行示例与证据化发布。**

## 从这里开始

| 你想做什么 | 最合适的入口 |
|---|---|
| 安装真正的开源产品 | [GitHub](https://github.com/joinwell52-AI/CodeFlowMu-open) · [产品主页](https://joinwell52-ai.github.io/CodeFlowMu-open/)——四人开发团队，当前只对接 Cursor |
| 为 Agent 加入文件式协作 | [GitHub](https://github.com/joinwell52-AI/FCoP) · [协议主页](https://joinwell52-ai.github.io/FCoP/)——Python 包、MCP Server 与协议 |
| 五分钟理解核心问题 | [为什么执行轨迹不等于治理](#执行轨迹不等于治理) |
| 以完整视觉方式浏览项目 | [进入 Digital Employee Works →](https://joinwell52-ai.github.io/joinwell52/zh/) |
| 阅读稳定理论与规范 | [架构论文 A1.0](https://joinwell52-ai.github.io/joinwell52/zh/publications/tmpa-architecture-paper-a1.0) · [核心规范 S1.0](https://joinwell52-ai.github.io/joinwell52/zh/publications/tmpa-core-specification-s1.0) |
| 现在就运行 | [执行 S1.0 Reference Reader](#运行-reference-reader) |
| 检查工程主张 | [实施案例 I1.0](https://joinwell52-ai.github.io/joinwell52/zh/publications/implementation-case-i1.0) · [证据包](./docs/public/evidence/tmpa/i1.0/) |
| 引用这项工作 | [Zenodo DOI](https://doi.org/10.5281/zenodo.21888488) · [`CITATION.cff`](./CITATION.cff) |

## 三个公开仓库，一套完整体系

| 仓库 | 首要职责 | GitHub | 项目网站 |
|---|---|---|---|
| **TMPA / joinwell52** | 理论、规范、符合性测试、研究与证据 | [源码与 Star](https://github.com/joinwell52-AI/joinwell52) | [Digital Employee Works](https://joinwell52-ai.github.io/joinwell52/zh/) |
| **FCoP** | 文件式行为治理协议、Python 包与 MCP Server | [源码与 Star](https://github.com/joinwell52-AI/FCoP) | [FCoP 主页](https://joinwell52-ai.github.io/FCoP/) |
| **CodeFlowMu Open** | 可安装的四人开发团队产品 | [源码与 Star](https://github.com/joinwell52-AI/CodeFlowMu-open) | [产品主页](https://joinwell52-ai.github.io/CodeFlowMu-open/) |

每个仓库都有一个清楚的被发现与被 Star 的理由：**TMPA 解释并定义，FCoP 把协作能力做成可复用协议，CodeFlowMu Open 把二者变成可以安装的产品。** 产品使用继续产生现场证据、协议改进与新的规范问题。

## 安装开源产品

[CodeFlowMu Open](https://github.com/joinwell52-AI/CodeFlowMu-open) 不是概念图或文档 Demo，而是拥有[独立产品主页](https://joinwell52-ai.github.io/CodeFlowMu-open/)、可以安装的本地应用。它提供 PC Panel、Mobile PWA、项目隔离、人工审批门禁、FCoP 工作工件，以及固定的 `PM / DEV / OPS / QA` 四人执行团队；`EVAL` 独立观察交付质量与风险。

> **当前 Provider 边界：**公开产品目前只使用 **Cursor SDK / Cursor API Key**。当前版本没有包含、也不宣称支持其他 Agent Provider。

```bat
cd /d D:\
git clone https://github.com/joinwell52-AI/CodeFlowMu-open.git
cd CodeFlowMu-open
START-CODEFLOWMU-OPEN.bat
```

<p align="center">
  <a href="https://github.com/joinwell52-AI/CodeFlowMu-open#真实界面">
    <img src="https://raw.githubusercontent.com/joinwell52-AI/CodeFlowMu-open/main/docs/images/pc/V1.2.6/zh/pc-dashboard-V1.2.6-zh.png" alt="CodeFlowMu Open 真实产品仪表盘" width="920">
  </a>
</p>

<p align="center"><sub>真实产品截图 · 点击进入产品仓库，查看安装方法与完整 PC/PWA 图文说明。</sub></p>

## 执行轨迹不等于治理

Agent 执行轨迹能说明“运行了什么”，但生产治理必须回答更难的问题。

| 执行轨迹 | 治理状态 |
|---|---|
| 工具返回成功 | 结果是否经过独立验收？ |
| 模型声称“完成” | 完成证据是否充分？ |
| 工作流到达最终节点 | 生命周期迁移是否合法？ |
| 日志里记录了某个 Actor | 该 Actor 当时是否拥有权限？ |
| 事件带有时间戳 | 能否在不虚构全局顺序的前提下重构冲突与并发？ |

TMPA 将工作建模为持久治理对象，而不是把关键事实困在聊天、进程或模型会话里。

## 一张图理解整个体系

```text
TMPA 架构论文 A1.0        理论与设计方向
            ↓
TMPA 核心规范 S1.0        规范对象、生命周期、Reader、C01–C14
            ↓
FCoP                        基于文件的协作与证据 Profile
            ↓
CodeFlowMu V1.8.0           产品 Adapter 与 Governance Reader
            ↓
实施案例 I1.0              有边界、可检查的工程证据
            ↓
数字员工应用                在真实生产语境中承担受治理工作
```

这个方向不能颠倒：架构论文解释理论，Core 定义规范行为，[FCoP](https://github.com/joinwell52-AI/FCoP) 提供协议 Profile，[CodeFlowMu Open](https://github.com/joinwell52-AI/CodeFlowMu-open) 是公开、可安装的产品线，实施案例只报告精确版本证据真正支持的结果。

### 四条相互连接的规则

1. **文本承载持久消息与状态。** 工作事实离开模型会话后仍然可移植、可检查。
2. **每个写入者拥有自己的局部串行流。** 一个主体不能静默改写另一个主体的历史。
3. **多个串行流异步推进。** 协作保留真实的偏序与并发语义。
4. **Reader 重构治理状态。** 将现有证据转化为生命周期、责任、冲突、判断与显式 Issue Set。

TMPA Core 不绑定存储介质；文件、数据库行、对象存储对象或事件都可以承载同一套治理语义。

## 运行 Reference Reader

仓库已经包含完整的 TMPA Core S1.0 机器 Schema、Fixture、Profile、作者提供的 Reference Reader 与 C01–C14 Runner。

环境要求：**Node.js 20+**。

```bash
git clone https://github.com/joinwell52-AI/joinwell52.git
cd joinwell52
npm ci
npm run demo
npm run tmpa:s1.0:conformance
```

`npm run demo` 会展示同一份交付：开发者自审时被拒绝，增加独立 QA 证据后才被接受。这是一个小型 TMPA 规范演示；真正可以安装使用的产品是 [CodeFlowMu Open](https://github.com/joinwell52-AI/CodeFlowMu-open)。

预期参考结果：

```text
PASS 14  ·  PARTIAL 0  ·  NOT RUN 0  ·  FAIL 0
```

这只能证明被冻结的参考路径按测试运行。它与已登记的 CodeFlowMu 产品运行属于两条不同证据轨道，也不构成独立认证。解释结果前请先阅读[符合性测试说明](./research/conformance/tmpa-core-s1.0/README.md)。

## TMPA V1.0 稳定出版集

| 文档 | 它回答什么 | 在线阅读 | 正式工件 |
|---|---|---|---|
| **架构论文 A1.0** | 为什么 Agent 工作需要治理状态架构 | [网页](https://joinwell52-ai.github.io/joinwell52/zh/publications/tmpa-architecture-paper-a1.0) | [PDF](./docs/public/releases/tmpa/v1.0/artifacts/tmpa-architecture-paper-a1.0-zh.pdf) |
| **核心规范 S1.0** | 规范对象、权限、生命周期、Reader 行为与符合性要求是什么 | [网页](https://joinwell52-ai.github.io/joinwell52/zh/publications/tmpa-core-specification-s1.0) | [PDF](./docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-zh.pdf) |
| **实施案例 I1.0** | CodeFlowMu V1.8.0 针对精确 S1.0 Bundle 演示了什么 | [网页](https://joinwell52-ai.github.io/joinwell52/zh/publications/implementation-case-i1.0) | [PDF](./docs/public/releases/tmpa/v1.0/artifacts/tmpa-implementation-case-i1.0-zh.pdf) |

带校验和的完整双语出版档案、引用元数据、Manifest 与发行说明位于 [`docs/public/releases/tmpa/v1.0/`](./docs/public/releases/tmpa/v1.0/)。永久归档：[Zenodo 21888488](https://zenodo.org/records/21888488)。

## 工程证据快照

I1.0 使用被冻结的 TMPA Core S1.0 Bundle，评估 CodeFlowMu V1.8.0 的真实产品路径 `GovernanceReader.readSync`。

| 证据项 | 记录结果 |
|---|---:|
| S1.0 符合性准则 | **14 PASS / 0 PARTIAL / 0 NOT RUN / 0 FAIL** |
| 强制断言 | **71 / 71 通过并完成重算** |
| CodeFlowMu TMPA Runtime 测试 | **24 通过 / 0 失败** |
| CodeFlowMu Runtime 完整测试 | **1,522 通过 / 0 失败 / 1 跳过** |
| CodeFlowMu Shell 覆盖 | **791 通过 / 0 失败** |
| 锁定的 FCoP 参考实现 | **1,210 通过 / 2 跳过** |
| 证据完整性 | **内部 SHA-256 Manifest 覆盖 889 个文件** |

可以检查[精确版本登记](./research/conformance/tmpa-core-s1.0/external-runs/20260811-codeflowmu-v1.8.0/)，或下载[锁定证据包](./docs/public/evidence/tmpa/i1.0/tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip)及其 [SHA-256](./docs/public/evidence/tmpa/i1.0/tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip.sha256)。

> **声明边界：**这是针对一个精确实现版本与一个精确输入 Bundle 的作者运行证据，不构成独立认证、普遍符合性、语义真实性证明，也不构成“已经消除幻觉”的证明。

## 公开范围与开源状态

比“开源”标签更重要的是边界透明：

| 组成部分 | 本仓库是否提供 | 当前状态 |
|---|---:|---|
| TMPA 论文、规范、图表与研究内容 | 是 | 公开阅读与引用 |
| S1.0 Schema、Fixture、Runner 与 Reference Reader | 是 | 源码可见、可以运行 |
| CodeFlowMu 符合性证据 | 是 | 冻结证据与精确版本登记 |
| [FCoP GitHub](https://github.com/joinwell52-AI/FCoP) · [主页](https://joinwell52-ai.github.io/FCoP/) | 独立仓库 | MIT 开源协议、Python 包与 MCP Server |
| [CodeFlowMu Open GitHub](https://github.com/joinwell52-AI/CodeFlowMu-open) · [主页](https://joinwell52-ai.github.io/CodeFlowMu-open/) | 独立仓库 | MIT 开源可安装产品；四人团队；当前只对接 Cursor |

本仓库中的 TMPA 研究内容适用 [`LICENSE.md`](./LICENSE.md)；上述两个软件仓库分别采用各自的 MIT 许可证。软件开源许可与 TMPA 出版内容许可相互独立。

## 研究与生产系统

除稳定 TMPA 文档线之外，本仓库还包含一套受治理的研究生产环境：Research Intelligence、Daily/Weekly/Academic/Program Runtime、Research Skills、出版门禁、校验脚本与 VitePress 网站。

### 推荐文章与外部发布记录

置顶文章可以在外发前登记，外发后直接在同一行补充平台链接。普通外部发布记录从 **2026-08-12** 开始，不回填此前的历史发布；同一文章的中文、英文及各平台链接集中在一行。

| # | 标题 | 发布版本 | 一句话 |
|---:|---|---|---|
| 📌 | **从 SaaS 到 SaaW：当代码库开始“自己开发自己”** | [研究主页中文](https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-08-10-saaw-software-as-an-agent-worker) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/industry/2026-08-10-saaw-software-as-an-agent-worker) | 从治理、TMPA、FCoP、Agent PC、CodeFlowMu 与 Self-Morphing 推导 SaaW，并以真实生产引擎区分已验证能力与研究前沿。 |
| 01 | **一个 Agent 说“完成了”，团队为什么没放行？** | [研究主页中文](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-08-06-codeflowmu-multi-agent-fact-checking) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-08-06-codeflowmu-multi-agent-fact-checking) · [CSDN 中文](https://blog.csdn.net/m0_51507544/article/details/163676669) · [DEV English](https://dev.to/joinwell52/one-agent-said-done-why-didnt-the-team-release-it-518j) | 一次工具异常后，PM 没有接受“完成”声明，而是让 DEV、Subexecution、PM 与 QA 依次补齐磁盘、Git、报告和测试证据，最终形成可核验交付。 |
| 02 | **智能体能力正在被封装为技能、插件与契约** | [研究主页中文](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-08-02-agent-capability-packaging) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-08-02-agent-capability-packaging) · [CSDN 中文](https://blog.csdn.net/m0_51507544/article/details/163677686) · [DEV English](https://dev.to/joinwell52/open-source-engineering-weekly-002-agent-capability-is-being-packaged-as-skills-plugins-and-1db5) | 可复用智能体能力正在从隐藏提示词转向可检查的技能、插件、接口、工作流节点、事件与最小能力契约。 |
| 03 | **持久化智能体运行时正在成为基础能力** | [研究主页中文](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-08-02-durable-agent-runtime) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-08-02-durable-agent-runtime) · [CSDN 中文](https://blog.csdn.net/m0_51507544/article/details/163677784) · [DEV English](https://dev.to/joinwell52/open-source-engineering-weekly-001-durable-agent-runtime-is-becoming-the-baseline-2oim) | LangGraph、OpenHands、CrewAI 与 AutoGen 共同显示，持久状态、中断、恢复、隔离、可观测与明确完成控制正在成为运行时基础能力。 |

补充参考：[数字员工架构 V0.2](https://joinwell52-ai.github.io/joinwell52/zh/digital-employee/architecture)。

这些内容可以解释 TMPA 或为后续研究提供输入，但不能覆盖 Core S1.0。

## 仓库结构

```text
.
├── docs/
│   ├── en/ 与 zh/                   双语研究网站
│   └── public/
│       ├── spec/tmpa/s1.0/          机器可读契约
│       ├── releases/tmpa/v1.0/      带校验和的出版档案
│       └── evidence/tmpa/i1.0/      锁定的 CodeFlowMu 证据
├── research/
│   ├── conformance/tmpa-core-s1.0/  Reference Reader、Fixture 与结果
│   ├── runtime/                      受治理的执行记录
│   ├── intelligence/                 来源 Registry 与研究信号
│   └── skills/                       分阶段研究工作契约
├── scripts/                          校验、投影与网站工具
└── .github/workflows/                校验、调度与 Pages 部署
```

## 参与、引用与关注

- 研究与贡献规则：[`CONTRIBUTING.md`](./CONTRIBUTING.md) · [`RESEARCH-GOVERNANCE.md`](./RESEARCH-GOVERNANCE.md)
- 引用元数据：[`CITATION.cff`](./CITATION.cff) · [V1.0 元数据](./docs/public/releases/tmpa/v1.0/metadata/)
- 权利与使用范围：[`LICENSE.md`](./LICENSE.md)
- 问题与建议：[提交 Issue](https://github.com/joinwell52-AI/joinwell52/issues)
- 本地启动、校验与构建：[本地运行说明](./LOCAL-RUN-GUIDE.zh-CN.md)

如果这项工作帮助你理解了可问责的 AI 工作，请[**为仓库点一个 Star**](https://github.com/joinwell52-AI/joinwell52)，并分享对你真正有用的具体工件。

---

<p align="center">
  <strong>朱卫 / Zhu Wei · joinwell52-AI</strong><br>
  独立研究者<br><br>
  <a href="https://joinwell52-ai.github.io/joinwell52/zh/">Digital Employee Works</a>
  ·
  <a href="https://doi.org/10.5281/zenodo.21888488">Zenodo DOI</a>
  ·
  <a href="./README.md">English README</a>
</p>
