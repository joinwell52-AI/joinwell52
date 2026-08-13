# P2 Special Study Contract V1.0

## Purpose / 目的

P2 is a governed focused-research lane, not a lower-quality Daily source tier. It checks registered objects on a slower cadence, compares them with a durable baseline, and starts a full special study only when a declared trigger is met.

P2 是受控专项研究通道，不是质量较低的每日来源等级。它按照较慢周期检查已登记对象，与持久化基线进行增量对比，只有命中明确触发条件时才启动完整专项研究。

## Schedule / 调度

- The existing `Research Runtime Weekly` task carries P2 checking every Sunday at 20:30 in `Asia/Shanghai`; P2 has no separate timer.
- `biweekly-or-release` objects receive a weekly release/material-commit check and a full review at least every 14 days.
- `monthly` objects receive one full review per calendar month. A missed first-Sunday run is caught up by the next weekly run.
- The first completed run establishes a baseline for every P2 object.

- 现有 `Research Runtime Weekly` 每周日 20:30（`Asia/Shanghai`）承载 P2 检查；P2 不另建定时任务。
- `biweekly-or-release` 对象每周检查版本与实质提交，至少每 14 天完整复查一次。
- `monthly` 对象每个自然月至少完整复查一次；若错过月初运行，下一次周任务自动补检。
- 每个 P2 对象的首次完成运行用于建立基线。

## Admission / 准入

Every P2 Registry object must declare:

- bilingual category;
- non-empty `watchFor` scope;
- bilingual `specialStudyTrigger`;
- `biweekly-or-release` or `monthly` frequency.

每个 P2 Registry 对象必须声明双语分类、非空观察范围、双语专项触发条件，以及 `biweekly-or-release` 或 `monthly` 频率。

## Run flow / 运行流程

1. Load the latest Registry and all completed P2 checkpoints.
2. Resolve which objects are due and whether each requires baseline, release check, biweekly review, or monthly review.
3. Compare release, tag, material commit, code, dataset, benchmark, rule, or documentation evidence with the prior checkpoint.
4. Resolve every due object to a terminal result. No material change is a valid completed result; silent omission is not.
5. Rank triggered objects by risk, direct relevance, evidence strength, and change magnitude.
6. Select at most one object for a full special study in one run.
7. Persist the P2 record, evidence, artifacts, bounded judgment, next checkpoint, and verified Git commit.

运行顺序为：加载最新 Registry 与历史检查点；判断到期对象和复查模式；对比版本、标签、实质提交、代码、数据集、Benchmark、规则或文档证据；为全部到期对象记录终态；按风险、直接相关性、证据强度和变化幅度排序；每次最多选择一个完整专项；持久化记录、证据、Artifact、有边界的判断、下一检查点和已验证提交。

Every completed object checkpoint records the latest release, tag, `main` commit SHA, key-file hashes, inspected Issue and PR references, dataset or benchmark version when applicable, and a source reference. The next Weekly run compares against these fields and must not re-study an unchanged checkpoint.

每个已完成对象都要记录最新 Release、Tag、`main` Commit SHA、关键文件哈希、已检查 Issue 与 PR、适用时的数据集或 Benchmark 版本以及来源引用。下一次 Weekly 以这些字段做增量比较，不得重复研究未变化的检查点。

## Trigger score / 触发评分

A P2 study starts when a primary-source change is worth resolving, not only after the mechanism has already been proved. Score every due change on four dimensions:

| Dimension | Range | Meaning |
| --- | ---: | --- |
| Relevance | 0–3 | unrelated, adjacent, directly in scope, or central to the declared watch focus |
| Change magnitude | 0–2 | cosmetic, meaningful incremental change, or material behavior/architecture change |
| Evidence quality | 0–3 | unverified, source claim, primary code/docs/data, or primary evidence plus corroboration |
| Action value | 0–2 | no action, changes a research judgment, or may justify an experiment/risk/product decision |

The total is 0–10. A score of **5 or higher** starts one P2 special study, subject to the one-study-per-run ranking. A single strong signal may qualify; the dimensions are not cumulative mandatory gates.

P2 专项的启动标准是“来自一手来源、值得进一步弄清楚”，而不是“机制已经被证明”。四项评分为：相关性 0–3、变化幅度 0–2、证据质量 0–3、行动价值 0–2，总分 0–10；**达到 5 分**即可触发专项，并按每次最多一个进行排序。四项不是必须同时满足的硬条件，单个强信号也可以触发。

README 修字、Star 增长、普通依赖升级、宣传性声明或未经核验的讨论通常不触发；但 README、规范或 Issue 中披露了实质架构、接口、能力或风险变化时，应按内容评分，不能因载体是 README 而排除。

Reproducibility is required for promotion to `Experiment Candidate`, and stronger evidence gates apply before adoption or public claims. It is not required merely to start research.

“可复现”是升级为 `Experiment Candidate` 的条件；采用或公开结论还要经过更高证据门禁，但启动研究本身不要求已经可复现。

## Outcomes / 结果

Each due object resolves to one outcome:

- `No Material Change`
- `Continue Watching`
- `Special Study Candidate`
- `Experiment Candidate`
- `Risk Alert`
- `Blocked`
- `Failed`

## Publication boundary / 发布边界

P2 never publishes directly and never automatically changes a first-party product. It produces a special-study record and, when justified, one candidate. Public writing must enter the normal Reading, Analysis, Evidence, Editorial, and Publication gates.

P2 不直接发布，也不自动修改任何第一方产品。它只生成专项巡检记录，以及在证据充分时生成一个候选。公开文章仍必须进入正常的阅读、分析、证据、编辑和发布门禁。

## Completion notification / 完成通知

Every Weekly invocation must notify the user of the P2 result, including:

- checked / due coverage;
- trigger count;
- selected study, or an explicit statement that no study ran;
- selected outcome and checkpoint identity;
- internal study link when present;
- verified GitHub commit.

每次 Weekly 运行都必须主动通知用户 P2 结果，包括已检查数/到期数、触发数、执行的专项或明确的“本周未执行专项”、结果与检查点、存在时的内部报告链接，以及已验证的 GitHub 提交。P2 不得静默完成。

## Internal study artifact / 内部专项报告

When the trigger threshold is met, Weekly Runtime writes one internal study at:

```text
research/intelligence/p2-studies/YYYY/MM/YYYY-MM-DD-{object-slug}.md
```

This is an internal research asset, not a public article. It must contain:

1. object, prior checkpoint, current source reference, and inspected scope;
2. the material change and why the trigger score reached the threshold;
3. primary evidence and unresolved uncertainty;
4. source-complete mechanism analysis and a minimal reproduction when feasible;
5. an independent external judgment before any first-party mapping;
6. bounded relevance to TMPA, FCoP, CodeFlowMu, the Digital Employee, or the Research Operating System;
7. one of: continue watching, experiment proposal, article candidate, risk alert, or no action;
8. the next checkpoint and falsification conditions.

达到触发阈值后，Weekly Runtime 在上述路径写入一份内部专项研究报告。它不是公开文章，必须记录对象与检查点、实质变化与触发评分、一手证据与不确定性、机制分析与可行时的最小复现、独立外部判断、与第一方项目的有边界关联、行动建议、下一检查点和可证伪条件。

## Manual review gate / 人工审核门禁

Every new study is **Pending Review** until a review record exists. The report body is available only through the local review center and is not included in the GitHub Pages build. The public Research Intelligence Radar may expose only aggregate workflow state: `No Report`, `Pending`, or `Processed`; it must not expose the report body or a local link.

每份新专项报告在生成后均为**待处理**，直到产生人工审核记录。报告正文只通过本地审稿中心查看，不进入 GitHub Pages 构建。公开的研究情报雷达只允许显示汇总流程状态：`无报告`、`待处理`、`已处理`，不得展示报告正文或本地链接。

The reviewer records exactly one current decision, with append-only history, at:

```text
research/intelligence/p2-reviews/YYYY/MM/YYYY-MM-DD-{object-slug}.review.json
```

Allowed decisions are:

- `Approved Internal`
- `Revision Required`
- `Promote to Article Candidate`
- `Archived`

An existing review record makes the report `Processed` on the Radar. `Revision Required` still creates a new internal action, but it does not erase the completed review event. Only `Promote to Article Candidate` permits a later handoff into the normal public-writing pipeline; it never publishes automatically.

审核记录采用追加历史、单一当前结论。允许的结论为：内部通过、退回修改、转公开文章候选、归档。只要已有审核记录，雷达即显示该报告为“已处理”；“退回修改”会产生新的内部行动，但不会抹去已经完成的审核事件。只有“转公开文章候选”允许后续进入正常公开写作流程，任何结论都不会自动发布。

## Canonical record / 规范记录

```text
research/intelligence/p2-runs/YYYY/MM/YYYY-MM-DD-p2-special.json
```

Schema:

```text
p2-special-study-run/v1
```
