# Research Center Governance

## Single Source of Truth

The `joinwell52-AI/joinwell52` GitHub repository is the only authoritative research database of the joinwell52 Research Center.

All active research content is maintained directly in this repository:

- daily research;
- weekly synthesis;
- academic and paper observation;
- industry and Digital Employee observation;
- GitHub and engineering observation;
- Digital Employee architecture;
- TMPA papers and specifications;
- implementation cases;
- visual assets and website source.

No secondary local research database is authoritative. A local copy may exist only as a temporary working checkout, cache, or migration archive. It must not become an independently maintained source.

## Authoritative paths

```text
docs/
├── index.md                         # default English portal
├── en/                              # English articles
├── zh/                              # Chinese articles
├── public/assets/                   # covers and visual assets
└── .vitepress/                      # portal and publishing system
```

Research is organized as three chronological columns:

1. Academic and Paper Observation;
2. Industry and Digital Employee Observation;
3. GitHub and Engineering Observation.

Daily Research is a self-contained daily study across the three columns. Weekly Synthesis integrates the week's evidence and produces architectural and engineering judgments.

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

English and Chinese articles are maintained as separate documents with corresponding topic, version, status, and route. One article must not mix both full-language bodies.

## Automation policy

Daily and weekly automation must read from and write to this repository directly. Successful maintenance includes updating the article, relevant chronological indexes, homepage entries, paired language version, and visual reference when applicable.

Automations must not write to the deprecated ChatGPT Library `/TMPA` folder or treat it as evidence of the current state.

## Publication authority

A document is authoritative only at the path and version declared by the repository. Drafts remain drafts. Vendor claims, generated summaries, and unverified observations must not be presented as independently verified facts.

---

# 研究中心治理规则

## 唯一事实来源

`joinwell52-AI/joinwell52` GitHub 仓库是 joinwell52 Research Center 唯一权威研究数据库。

所有现行研究内容均直接维护在本仓库中，包括：每日研究、每周综合、学术与论文观察、行业与数字员工观察、GitHub 与工程观察、数字员工架构、TMPA 论文与规范、工程案例、视觉资产和网站源码。

任何本地研究目录都不再具有权威性。本地副本只能作为临时工作区、缓存或迁移归档，不能独立持续维护。

## 历史与版本

Git 是唯一权威历史系统：

- Commit 记录编辑演进；
- Diff 记录具体变化；
- Tag 与 Release 标记稳定出版版本；
- Issue 与 Pull Request 记录讨论和复核；
- GitHub Pages 发布当前批准版本。

普通文档修订不再建立独立 `history/` 文件夹。只有无法由 Git 重建的外部证据、投稿快照或迁移记录，才可以作为专门归档保留。

## 自动维护

每日和每周自动任务必须直接读取和维护本仓库，不得再写入已废弃的 ChatGPT 文件库 `/TMPA` 目录。