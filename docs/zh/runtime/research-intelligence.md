---
title: 研究情报系统 V1.0
outline: deep
---

# 研究情报系统 V1.0

## 一句话定义

研究情报系统把“从哪里找”和“研究什么”分开：

```text
三条情报来源管线
↓
统一信号池与去重
↓
三个长期研究栏目
```

## 情报源地图 / Intelligence Sources

这里用简单中英文说明数字研究员正式监控的主要来源。完整、机器可执行的 Watchlist 以 [`research/intelligence/REGISTRY.json`](https://github.com/joinwell52-AI/joinwell52/blob/main/research/intelligence/REGISTRY.json) 为唯一事实源。

### AI 平台 / AI Platforms

| 来源 | 简单说明 | 频率 | 主要关注 |
| --- | --- | --- | --- |
| OpenAI | OpenAI 官方产品、开发者文档与研究入口 | P0 · 每日 | ChatGPT、Codex、API、Agents、企业控制 |
| Anthropic / Claude | Anthropic 与 Claude 官方信息 | P0 · 每日 | Claude、Claude Code、API、Agent 治理 |
| Google / Gemini | Google Gemini 官方开发与产品信息 | P0 · 每日 | Gemini API、AI Studio、Vertex AI、Gemini CLI、ADK |
| Cursor | Cursor 官方开发工具与 Agent 平台 | P0 · 每日 | Coding Agent、Cloud Agent、CLI、工程工作流 |
| GitHub Copilot | GitHub 官方 AI 编程产品 | P0 · 每日 | Copilot、Coding Agent、CLI、Code Review |
| Microsoft Copilot Platform | 微软 Copilot 与企业 Agent 平台 | P0 · 每日 | Microsoft 365 Copilot、Copilot Studio、Agent Builder、Power Platform |

每个平台不仅看首页，还按 Registry 检查 Release Notes、官方文档、社区/论坛、官方 GitHub、Roadmap 或 Status 等正式入口。

### GitHub 工程仓库 / Engineering Repositories

**P0 · 每日**

| 仓库 | 简单说明 | 主要关注 |
| --- | --- | --- |
| [openai/codex](https://github.com/openai/codex) | OpenAI Codex 开源工程仓库 | Coding Agent、Runtime、Sandbox、权限、Review、Protocol |
| [openai/openai-agents-python](https://github.com/openai/openai-agents-python) | OpenAI Agents Python SDK | Agent SDK、工具、Handoff、Tracing、运行机制 |
| [anthropics/claude-code](https://github.com/anthropics/claude-code) | Anthropic Claude Code 工程仓库 | Coding Agent、工具调用、权限、Session、恢复 |
| [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli) | Google Gemini CLI | CLI Agent、工具、执行环境、交互协议 |
| [google/adk-python](https://github.com/google/adk-python) | Google Agent Development Kit Python | Agent 开发框架、Workflow、工具与运行时 |
| [github/copilot-cli](https://github.com/github/copilot-cli) | GitHub Copilot CLI | 终端 Agent、Coding Workflow、执行与权限 |
| [modelcontextprotocol/python-sdk](https://github.com/modelcontextprotocol/python-sdk) | MCP Python SDK | Model Context Protocol Python 实现 |
| [modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk) | MCP TypeScript SDK | Model Context Protocol TypeScript 实现 |
| [a2aproject/A2A](https://github.com/a2aproject/A2A) | Agent2Agent 协议项目 | Agent 间协议、互操作、任务与消息边界 |

Registry 还维护 P1 周度仓库，包括 AutoGen、Semantic Kernel、LangGraph、CrewAI、OpenHands、browser-use、SWE-bench、SWE-agent、Langfuse 和 Phoenix 等。

### 论文与研究成果 / Published Research

**P0 · 每日**

| 来源 | 中文解释 | 主要关注 |
| --- | --- | --- |
| [arXiv](https://arxiv.org/) | 开放学术预印本平台 | `cs.MA` 多智能体、`cs.SE` 软件工程、`cs.AI` 人工智能 |
| [Autonomous Agents and Multi-Agent Systems](https://link.springer.com/journal/10458) | 《自主智能体与多智能体系统》期刊（JAAMAS） | Multi-Agent、Agent 组织、协调、协议、治理 |
| [Journal of Systems and Software](https://www.sciencedirect.com/journal/journal-of-systems-and-software) | 《系统与软件》期刊（JSS） | 软件架构、软件工程、实证评估、可复现工程 |
| [Zenodo](https://zenodo.org/) | 开放科研成果与 DOI 存档平台 | 论文附件、软件、数据集、Artifact、复现证据 |
| [OpenReview](https://openreview.net/) | 开放同行评审平台 | 论文、公开评审、会议研究成果 |
| [OpenAI Research](https://openai.com/research/) | OpenAI 官方研究 | Agent、模型、系统、安全与技术报告 |
| [Anthropic Research](https://www.anthropic.com/research) | Anthropic 官方研究 | Agent、安全、模型行为与治理 |
| [Google DeepMind Research](https://deepmind.google/research/) | Google DeepMind 官方研究 | Agent、AI 系统、模型与前沿研究 |
| [Microsoft Research](https://www.microsoft.com/en-us/research/) | **微软研究院 / Microsoft 官方研究机构** | Agent 系统、企业 AI、软件工程、系统架构与 Benchmark |

**P1 · 每周**还包括 ACL Anthology、PMLR、NeurIPS Proceedings、ACM Digital Library 和 IEEE Xplore。

> 原则：Daily Discovery 的正式来源优先使用公开、无需私人登录态的入口。若全文受限，记录访问状态，不把“无法读取全文”等同于“没有研究对象”。

## 三条情报发现 Skill

### AI 平台变更情报发现

每日观察主要 AI 平台的官方更新，包括 Release Notes、文档、论坛或社区、API 变化、企业控制、状态页和官方 GitHub。

### GitHub 工程情报发现

不扫描整个 GitHub，而是运行受控工程雷达：

- 固定组织和仓库观察名单；
- Release、Tag、已合并 PR、高价值 Issue、Discussion 与安全公告；
- 只扫描上次检查点之后的增量；
- 固定主题 × 变化类型查询；
- 少量新项目探索。

### 论文与研究成果情报发现

观察论文、预印本、技术报告、Benchmark、数据集、System Card / Model Card、标准规范，以及论文关联的代码、附录与评估工具。

## 三个研究栏目

三条情报管线共同服务：

1. 数字员工；
2. 行业架构；
3. 开源工程。

同一变化只能有一个主栏目，可以记录对另外两个栏目的次级影响。

## 每日完成标准

10:00 队列任务必须汇报来源覆盖、无法访问和失败来源、信号/候选/入选/拒绝数量，以及三个栏目分别“已选题”或“未选题”的明确决定。

“已检查但无重要变化”和“没有检查”不能混为一谈。

## 权威文件

- Registry：[`research/intelligence/REGISTRY.json`](https://github.com/joinwell52-AI/joinwell52/blob/main/research/intelligence/REGISTRY.json)
- Daily Run：`research/intelligence/runs/YYYY/MM/YYYY-MM-DD-intelligence.json`
- Skill Profiles：`research/skills/profiles/`
