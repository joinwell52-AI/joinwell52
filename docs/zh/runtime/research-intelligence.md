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

## 三条情报发现 Skill

### AI 平台变更情报发现

每日观察主要 AI 平台的官方更新：

- OpenAI / ChatGPT / Codex
- Anthropic / Claude / Claude Code
- Google / Gemini
- Cursor
- GitHub Copilot
- Microsoft Copilot Platform

检查官方 Release Notes、文档、论坛或社区、API 变化、企业控制、状态页和官方 GitHub。

### GitHub 工程情报发现

不扫描整个 GitHub，而是运行受控工程雷达：

- 固定组织和仓库观察名单；
- Release、Tag、已合并 PR、高价值 Issue、Discussion 与安全公告；
- 只扫描上次检查点之后的增量；
- 固定主题 × 变化类型查询；
- 少量新项目探索。

### 论文与研究成果情报发现

观察：

- 论文与预印本；
- 技术报告；
- Benchmark 和数据集；
- System Card / Model Card；
- 标准与规范；
- 论文关联的代码、附录与评估工具。

## 三个研究栏目

三条情报管线共同服务：

1. 数字员工；
2. 行业架构；
3. 开源工程。

同一变化只能有一个主栏目，可以记录对另外两个栏目的次级影响。

## 每日完成标准

10:00 队列任务必须汇报：

- 三条管线各自应检查和实际检查的来源数；
- 无法访问和失败的来源；
- 信号、候选、入选和拒绝数量；
- 三个栏目分别“已选题”或“未选题”；
- 未选题的具体原因；
- 选题与来源证据的对应关系。

“已检查但无重要变化”和“没有检查”不能混为一谈。

## 权威文件

- Registry：`research/intelligence/REGISTRY.json`
- Daily Run：`research/intelligence/runs/YYYY/MM/YYYY-MM-DD-intelligence.json`
- Skill Profiles：`research/skills/profiles/`
