---
title: Research Intelligence System V1.0
outline: deep
---

# Research Intelligence System V1.0

## Definition

The Research Intelligence System separates where evidence is discovered from what the Research Center studies:

```text
Three intelligence pipelines
→ unified and deduplicated signal pool
→ three permanent research columns
```

## Intelligence Sources / 情报源地图

This page gives a plain-language bilingual map of the main sources monitored by the Digital Researcher. The complete machine-readable Watchlist in [`research/intelligence/REGISTRY.json`](https://github.com/joinwell52-AI/joinwell52/blob/main/research/intelligence/REGISTRY.json) remains the single source of truth.

### AI Platforms / AI 平台

| Source | Plain-language description | Frequency | Main focus |
| --- | --- | --- | --- |
| OpenAI | OpenAI official product, developer and research channels / OpenAI 官方产品、开发与研究入口 | P0 · Daily | ChatGPT, Codex, API, Agents, enterprise controls |
| Anthropic / Claude | Anthropic and Claude official channels / Anthropic 与 Claude 官方信息 | P0 · Daily | Claude, Claude Code, API, agent governance |
| Google / Gemini | Google Gemini official developer and product channels / Google Gemini 官方开发与产品信息 | P0 · Daily | Gemini API, AI Studio, Vertex AI, Gemini CLI, ADK |
| Cursor | Cursor official coding and agent platform / Cursor 官方开发工具与 Agent 平台 | P0 · Daily | Coding Agents, Cloud Agents, CLI, engineering workflows |
| GitHub Copilot | GitHub official AI coding product / GitHub 官方 AI 编程产品 | P0 · Daily | Copilot, Coding Agent, CLI, Code Review |
| Microsoft Copilot Platform | Microsoft enterprise Copilot and agent platform / 微软 Copilot 与企业 Agent 平台 | P0 · Daily | Microsoft 365 Copilot, Copilot Studio, Agent Builder, Power Platform |

### GitHub Engineering Repositories / GitHub 工程仓库

**P0 · Daily**

| Repository | Plain-language description | Main focus |
| --- | --- | --- |
| [openai/codex](https://github.com/openai/codex) | OpenAI Codex engineering repository / OpenAI Codex 开源工程仓库 | Coding Agent, runtime, sandbox, permissions, review, protocols |
| [openai/openai-agents-python](https://github.com/openai/openai-agents-python) | OpenAI Agents Python SDK | Agent SDK, tools, handoffs, tracing, runtime mechanisms |
| [anthropics/claude-code](https://github.com/anthropics/claude-code) | Anthropic Claude Code engineering repository | Coding Agent, tools, permissions, sessions, recovery |
| [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli) | Google Gemini CLI | CLI agents, tools, execution environment, interaction protocols |
| [google/adk-python](https://github.com/google/adk-python) | Google Agent Development Kit for Python | Agent framework, workflows, tools, runtime |
| [github/copilot-cli](https://github.com/github/copilot-cli) | GitHub Copilot CLI | Terminal agents, coding workflows, execution and permissions |
| [modelcontextprotocol/python-sdk](https://github.com/modelcontextprotocol/python-sdk) | MCP Python SDK | Model Context Protocol Python implementation |
| [modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk) | MCP TypeScript SDK | Model Context Protocol TypeScript implementation |
| [a2aproject/A2A](https://github.com/a2aproject/A2A) | Agent2Agent protocol project | Agent interoperability, task and message boundaries |

The Registry also maintains P1 weekly repositories including AutoGen, Semantic Kernel, LangGraph, CrewAI, OpenHands, browser-use, SWE-bench, SWE-agent, Langfuse and Phoenix.

### Published Research / 论文与研究成果

**P0 · Daily**

| Source | Plain-language bilingual description | Main focus |
| --- | --- | --- |
| [arXiv](https://arxiv.org/) | Open scholarly preprint platform / 开放学术预印本平台 | `cs.MA`, `cs.SE`, `cs.AI` |
| [Autonomous Agents and Multi-Agent Systems](https://link.springer.com/journal/10458) | JAAMAS, a peer-reviewed multi-agent systems journal / 《自主智能体与多智能体系统》期刊 | Multi-Agent, organization, coordination, protocols, governance |
| [Journal of Systems and Software](https://www.sciencedirect.com/journal/journal-of-systems-and-software) | JSS, a peer-reviewed software engineering journal / 《系统与软件》期刊 | Software architecture, engineering, empirical evaluation, reproducibility |
| [Zenodo](https://zenodo.org/) | Open research-output and DOI repository / 开放科研成果与 DOI 存档平台 | Software, datasets, artifacts, reproducibility evidence |
| [OpenReview](https://openreview.net/) | Open peer-review platform / 开放同行评审平台 | Papers, public reviews, conference research |
| [OpenAI Research](https://openai.com/research/) | OpenAI official research / OpenAI 官方研究 | Agents, models, systems, safety, technical reports |
| [Anthropic Research](https://www.anthropic.com/research) | Anthropic official research / Anthropic 官方研究 | Agents, safety, model behavior, governance |
| [Google DeepMind Research](https://deepmind.google/research/) | Google DeepMind official research / Google DeepMind 官方研究 | Agents, AI systems, models, frontier research |
| [Microsoft Research](https://www.microsoft.com/en-us/research/) | **Microsoft's official research organization / 微软研究院、微软官方研究机构** | Agent systems, enterprise AI, software engineering, systems architecture, benchmarks |

**P1 · Weekly** additionally includes ACL Anthology, PMLR, NeurIPS Proceedings, ACM Digital Library and IEEE Xplore.

> Principle: formal Daily Discovery sources should prefer public endpoints that do not depend on private login state. Restricted full text is recorded as an access condition rather than being treated as absence of a research object.

## Intelligence skills

### AI Platform Change Intelligence

Daily monitoring of official release notes, documentation, forums or communities, API changes, enterprise controls, status pages and official GitHub sources.

### GitHub Engineering Intelligence

A controlled, incremental engineering radar covering fixed watchlists, releases, tags, merged PRs, high-value issues, discussions, security advisories, checkpoint-based scanning and bounded exploration.

### Published Research Intelligence

Papers, preprints, technical reports, benchmarks, datasets, system or model cards, specifications and their associated code and evaluation artifacts.

## Three research columns

All pipelines serve Digital Employee, Industry Architecture and Open-source Engineering. One change has one primary column and optional secondary impact.

## Daily completion gate

The 10:00 Queue shift must report source coverage, inaccessible channels, failures, signal and candidate counts, and a Selected or No Selection decision for every column.

“Checked with no important change” is different from “not checked.”

## Authoritative artifacts

- Registry: [`research/intelligence/REGISTRY.json`](https://github.com/joinwell52-AI/joinwell52/blob/main/research/intelligence/REGISTRY.json)
- Daily Run: `research/intelligence/runs/YYYY/MM/YYYY-MM-DD-intelligence.json`
- Skill Profiles: `research/skills/profiles/`
