# Research Center 3.0 Governance

## 1. Single Source of Truth

The `joinwell52-AI/joinwell52` GitHub repository is the only authoritative research database, Runtime Record store and publication history of the joinwell52 Research Center.

All active research content is maintained directly in this repository:

- Research Runtime Charter, scheduler manifest and Runtime Records;
- Research Notes;
- Research Skills and Research Queue artifacts;
- Digital Employee architecture and capability releases;
- TMPA papers and specifications;
- implementation cases;
- visual assets and website source.

No secondary local research database is authoritative. A local copy may exist only as a temporary working checkout, cache or migration archive. The deprecated ChatGPT Library `/TMPA` folder is read-only and must not receive new revisions.

## 2. Research Runtime authority

Research Runtime Center is the operational control plane of the Research Operating System.

Research OS defines lifecycle and work rules. Research Runtime Scheduler V1.0 is the only formal scheduler. The Research Report Production Engine and other Digital Research Employee automations execute as Runtime workers.

Exactly seven formal Runtime tasks are recognized:

1. Research Runtime Engine;
2. Research Runtime Queue;
3. Research Runtime Knowledge;
4. Research Runtime Architecture;
5. Research Runtime Publication;
6. Research Runtime Weekly;
7. Research Runtime Academic.

Historical mixed names such as “Research OS task”, “Queue automation”, “Knowledge task” or “Weekly task” are not formal Runtime names.

The authoritative schedules, responsibilities and boundaries are stored in `research/runtime/SCHEDULER.json` and use timezone `Asia/Shanghai`.

## 3. Runtime Record

Every formal execution must create or update:

```text
research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md
```

Runtime Record is the single source of truth for:

- Runtime Status;
- Today’s Tasks;
- Runtime Timeline;
- Runtime History;
- Runtime Log;
- GitHub Status;
- Publication Status;
- Queue Status;
- Engine Status.

Exactly six statuses are allowed:

```text
Running · Completed · Blocked · Failed · Skipped · Waiting
```

Dashboard and website values must be generated from Runtime Records. Manual status values, hand-maintained history lists and hard-coded Runtime counts are prohibited.

A scheduler trigger opens an execution slot but does not prove completion. A Runtime remains `Waiting`, `Blocked` or `Failed` until the Digital Research Employee produces the defined output and completes the required verification.

## 4. Runtime publication gate

Every formal publication must follow:

```text
Research Runtime
→ Publication Candidate
→ Runtime Record
→ GitHub Commit
→ Commit Verify
→ Runtime Record closure
→ Official Publication
```

A formal publication change without a Runtime Record must fail validation.

A Runtime publication may be marked `Completed` only after:

1. the defined output exists in the repository;
2. required metadata and language pairing are valid;
3. a GitHub commit exists;
4. the commit and output paths have been directly verified;
5. GitHub, Commit Verify and Publication statuses are `Completed`;
6. the final Runtime Log event is recorded.

**Highest engineering constraint:** every official Publication shall be executed by Research Runtime and produce a Runtime Record. Any publication without a Runtime Record is not an official runtime output.

## 5. Research Notes information model

Research Notes remain the only continuously growing research entry point and are organized by two independent dimensions.

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

Daily, Weekly and Academic are categories inside each research column. They are not standalone article databases.

### Required frontmatter

Every Research Note must declare:

```yaml
title: Article title
date: 'YYYY-MM-DD'
column: digital-employee | industry-architecture | open-source-engineering
category: daily | weekly | academic
summary: Short list summary
```

The website reads these fields directly from GitHub Markdown and generates:

- total note counts by column;
- category counts inside each column;
- newest-first article lists;
- calendar/date filtering;
- latest-note views.

Manual article counts and manually maintained chronological lists are prohibited.

## 6. Runtime task boundaries

- Runtime Engine is the only Research OS state-machine engine.
- Runtime Queue maintains discovery, candidate, priority, selection, rejection and lifecycle state; it must not publish.
- Runtime Knowledge maintains knowledge and architecture candidates; it must not publish.
- Runtime Architecture performs formal review and lifecycle decisions.
- Runtime Publication must not perform direct research; it consumes completed knowledge and Research Skills.
- Runtime Weekly must create new cross-analysis and judgment; copying Daily Research is prohibited.
- Runtime Academic is limited to papers, benchmarks, specifications, conferences, institutions and research notes; ordinary news is prohibited.

Publication, Weekly and Academic must use completed Research Skills where applicable.

## 7. GitHub-first version and history policy

Git provides the authoritative history:

- commits record editorial and runtime evolution;
- diffs record changes;
- pull requests and CI record validation;
- tags and releases mark stable publication versions;
- GitHub Pages publishes the current approved view.

A separate `history/` folder must not be used for ordinary revisions. Historical snapshots may be retained only when they are external evidence, submitted artifacts or migration records that cannot be reconstructed from Git.

## 8. Bilingual policy

English is the default public language. Chinese is available under `/zh/`.

English and Chinese publications are maintained as separate documents with corresponding topic, metadata, status and route. One article must not mix both full-language bodies. A paired formal publication must not update only one language without recording the intentional boundary.

## 9. Research and formal publication boundary

Research Notes and TMPA Publications remain separate systems. Research Notes may provide research input, while TMPA publication maintenance follows its dedicated versioned publication process.

Both systems are subject to the Runtime Gate when they produce an official publication. Drafts remain drafts. Vendor claims, generated summaries and unverified observations must not be presented as independently verified facts.

---

# Research Center 3.0 研究治理规则

## 1. 唯一事实源

`joinwell52-AI/joinwell52` GitHub 仓库是 joinwell52 Research Center 唯一权威研究数据库、Runtime Record 存储与出版历史。

Research Runtime、研究笔记、Research Skills、Research Queue、数字员工架构与能力发布、TMPA 论文与规范、工程案例、视觉资产和网站源码全部直接在本仓库维护。任何本地目录或 ChatGPT Library 都不具有第二事实源地位；原 `/TMPA` 目录只作为只读迁移档案。

## 2. Research Runtime 权限

Research Runtime Center 是 Research Operating System 的运行控制平面。

Research OS 定义生命周期和工作规则；Research Runtime Scheduler V1.0 是唯一正式调度器；研究报告生产机及其它数字研究员自动任务作为 Runtime Worker 执行。

固定七个正式 Runtime 任务：

1. Research Runtime Engine；
2. Research Runtime Queue；
3. Research Runtime Knowledge；
4. Research Runtime Architecture；
5. Research Runtime Publication；
6. Research Runtime Weekly；
7. Research Runtime Academic。

正式时间、职责和边界以 `research/runtime/SCHEDULER.json` 为准，统一使用 `Asia/Shanghai` 时区。禁止继续使用“Research OS 任务”“Queue 自动任务”“Weekly 任务”等混合正式名称。

## 3. Runtime Record

每次正式执行必须创建或更新：

```text
research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md
```

Runtime Record 是 Runtime Status、Today’s Tasks、Timeline、History、Runtime Log、GitHub Status、Publication Status、Queue Status 与 Engine Status 的唯一事实源。

只允许六种状态：

```text
Running · Completed · Blocked · Failed · Skipped · Waiting
```

Dashboard 与网站必须从 Runtime Record 自动生成。禁止手工填写状态、维护手工历史列表或硬编码 Runtime 数量。

Scheduler Trigger 只表示建立了执行槽位，不表示工作已经完成。没有真实输出和所需验证时，Runtime 必须保持 Waiting、Blocked 或 Failed。

## 4. Runtime Publication Gate

所有正式发布必须经过：

```text
Research Runtime
→ Publication Candidate
→ Runtime Record
→ GitHub Commit
→ Commit Verify
→ Runtime Record Closure
→ Official Publication
```

正式 Publication 变更没有 Runtime Record 时必须验证失败。

只有在输出存在、元数据和语言配对有效、GitHub Commit 已创建并直接验证、GitHub / Commit Verify / Publication 状态均为 Completed、最终 Runtime Log 已记录后，Publication Runtime 才能标记为 Completed。

**最高工程约束：任何正式 Publication 都必须由 Research Runtime 驱动并生成 Runtime Record；没有 Runtime Record 的发布，不属于正式运行结果。**

## 5. 研究笔记信息模型

Research Notes 继续作为唯一持续增长的研究入口，由两个独立属性组织。

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

每篇研究笔记必须声明：

```yaml
title: 文章标题
date: 'YYYY-MM-DD'
column: digital-employee | industry-architecture | open-source-engineering
category: daily | weekly | academic
summary: 列表摘要
```

网站直接读取 GitHub Markdown 元数据，自动完成栏目统计、类别统计、日期倒序、日历筛选和最新研究展示。禁止手工填写文章数量或维护手工时间列表。

## 6. Runtime 任务边界

- Runtime Engine 是唯一 Research OS 状态机引擎；
- Runtime Queue 维护发现、候选、优先级、选择、拒绝和生命周期，禁止直接发布；
- Runtime Knowledge 维护知识和架构候选，禁止直接发布；
- Runtime Architecture 执行正式 Architecture Review 与生命周期决策；
- Runtime Publication 禁止直接研究，只能消费已完成 Knowledge 和 Research Skills；
- Runtime Weekly 必须形成新的综合和判断，禁止复制 Daily；
- Runtime Academic 只处理 Paper、Benchmark、Specification、Conference、Institution 与 Research Note，禁止普通新闻。

## 7. GitHub First 与双语规则

Git Commit、Diff、Pull Request、CI、Tag、Release 与 GitHub Pages 构成正式历史。普通文档修订不得建立独立 `history/` 副本。

英文和中文出版物分别维护，并保持对应主题、元数据、状态和路径。正式双语出版不得无记录地只更新一种语言。

Research Notes 与 TMPA Publication System 保持边界，但任何正式发布都必须经过 Runtime Gate。
