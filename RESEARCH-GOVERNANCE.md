# Research Center Governance

## Single Source of Truth

The `joinwell52-AI/joinwell52` GitHub repository is the only authoritative research database of the joinwell52 Research Center.

All active research content is maintained directly in this repository:

- Research Notes;
- Digital Employee architecture;
- TMPA papers and specifications;
- implementation cases;
- visual assets and website source.

No secondary local research database is authoritative. A local copy may exist only as a temporary working checkout, cache, or migration archive. It must not become an independently maintained source.

## Research Notes information model

Research Notes is the only research entry point. Research is organized by two independent dimensions:

### Column

Exactly three long-term research columns are maintained:

1. `digital-employee`;
2. `industry-architecture`;
3. `open-source-engineering`.

### Category

Each note belongs to one publication category:

1. `daily`;
2. `weekly`;
3. `academic`.

Daily, Weekly and Academic are categories inside each research column. They are not standalone research portals or separately maintained article databases.

### Required frontmatter

Every Research Note MUST declare:

```yaml
title: Article title
date: 'YYYY-MM-DD'
column: digital-employee | industry-architecture | open-source-engineering
category: daily | weekly | academic
summary: Short list summary
```

The website reads these fields directly from GitHub Markdown and automatically generates:

- total note counts by column;
- category counts inside each column;
- newest-first article lists;
- calendar/date filtering;
- latest-note views.

Manual article counts and manually maintained chronological lists are prohibited.

## Authoritative paths

```text
docs/
├── index.md                         # default English portal
├── en/                              # English articles
├── zh/                              # Chinese articles
├── public/assets/                   # covers and visual assets
└── .vitepress/                      # metadata loader and publishing system
```

The physical directory of an article does not determine its research classification. `column`, `category` and `date` frontmatter are authoritative.

## Version and history policy

Git provides the authoritative history:

- commits record editorial evolution;
- diffs record changes;
- tags and releases mark stable publication versions;
- pull requests and issues record review and discussion;
- GitHub Pages publishes the current approved view.

A separate `history/` folder must not be used for ordinary document revisions. Historical snapshots may be retained only when they are external evidence, submitted artifacts, or migration records that cannot be reconstructed from Git.

## Bilingual policy

English is the default public language. Chinese is available under `/zh/`.

English and Chinese articles are maintained as separate documents with corresponding topic, metadata, status and route. One article must not mix both full-language bodies.

## Automation policy

Research OS automation must write Research Notes directly to this repository. A valid automated delivery includes:

1. the Markdown article;
2. valid `column`, `category` and `date` metadata;
3. the paired language article when required;
4. a Git commit.

The website is responsible for classification, counts, sorting and calendar search. Automations MUST NOT edit manual index lists or hard-code article counts.

Automations must not write to the deprecated ChatGPT Library `/TMPA` folder or treat it as evidence of the current state.

## Publication authority

Research Notes and TMPA Publications are separate systems. Research Notes provide research input. TMPA Publication maintenance is governed by its dedicated publication task and GitHub version history.

A document is authoritative only at the path and version declared by the repository. Drafts remain drafts. Vendor claims, generated summaries and unverified observations must not be presented as independently verified facts.

---

# 研究中心治理规则

## 唯一事实源

`joinwell52-AI/joinwell52` GitHub 仓库是 joinwell52 Research Center 唯一权威研究数据库。研究笔记、数字员工架构、TMPA 论文与规范、工程案例、视觉资产和网站源码全部直接在本仓库维护。

任何本地目录或 ChatGPT Library 都不具有第二事实源地位。

## 研究笔记信息模型

研究笔记是唯一研究入口，并由两个独立属性组织。

### 栏目 column

固定三个长期栏目：

1. `digital-employee`：数字员工；
2. `industry-architecture`：行业架构；
3. `open-source-engineering`：开源工程观察。

### 类别 category

固定三种内容类别：

1. `daily`：每日研究；
2. `weekly`：每周综合；
3. `academic`：学术观察。

每日、每周、学术观察是各栏目内部的类别，不再作为独立研究入口或独立文章数据库。

### 必填元数据

每篇研究笔记必须声明：

```yaml
title: 文章标题
date: 'YYYY-MM-DD'
column: digital-employee | industry-architecture | open-source-engineering
category: daily | weekly | academic
summary: 列表摘要
```

网站直接读取 GitHub Markdown 元数据，自动完成栏目统计、类别统计、日期倒序、日历筛选和最新研究展示。禁止手工填写文章数量，禁止维护手工时间列表。

## 自动维护

Research OS 只负责产出带有合法元数据的研究笔记并提交 Git Commit。网站负责自动组织和展示。自动任务不得修改手工索引，也不得把示例数量写入页面。

## 研究与论文边界

Research Notes 与 TMPA Publication System 相互独立。研究笔记可以提供研究输入，但 TMPA 三份正式文档由独立论文任务维护，并以 GitHub main 和 Git History 为唯一事实源。
