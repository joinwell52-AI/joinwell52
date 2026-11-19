# 2026-11-19 研究报告：技能副作用声明与实际权限

## 来源、分类与固定范围

今日[动态页](../../../../docs/zh/runtime/daily-intelligence/2026-11-19.md)记录 57 项观察、7 组分析。选择 O1：[Mansura Habiba 的 Bulbasaur PR #25](https://github.com/mansura-habiba/bulbasaur-skill-cli/pull/25)，固定合入 `bb023460e9fb1ce0d5b2b439ea461650c3d3df97`。这是作者本人项目，不称为 AGENTSAFE 官方产物。O2—O3 的评测服务、O11 的子 Agent 授权、O28 的外部交付及其他线索留作跟踪或后续实验，不能把阅读算成已实验。

## 实验结果

Bulbasaur：Python 3.12 运行上游 `test_side_effects_contract.py`，**13 项通过**。另用两份合成 `review-notes` 技能做六项断言。两份都声明 `risk.side_effects: read_only`；一份允许写 `out/*`，另一份写路径为空。前者静态校验退出 1，指出 `declared=read_only` 与 `implied=reversible` 冲突；对 `out/report.txt` 的写提议被 `side_effects.ceiling.write` 拒绝，读取提议允许。后者静态校验通过，写提议仍被 `filesystem.write.empty-allowlist` 拒绝。**没有真正执行文件写入。**

CodeFlowMu：私有仓库干净工作树，固定提交 `794123058b8db012ca0da189b43fdf0c5ec2ff04`。v0.1 技能记录 schema 三项断言通过：`low` 风险且要求写权限可以通过 schema，额外 `side_effects` 字段不接受，`high` 风险而不要求写权限也可通过。这里的风险等级并非“只读”的同义词，schema 合法也非执行授权。实际 `OperationFacts` 分类器与负向谓词六项断言通过：对受保护源码的读取提议是 `read`、没有受保护写入匹配；换成写入提议为 `write`、命中 `NEG.PROTECTED.BOUNDARY.WRITE`。这里只生成操作事实，没有执行工具或完成审批。v0.1 `MCPInjector` 明示为 stub，未覆盖真实技能挂载。CodeFlowMu 私有源码与本地探针不放公开仓库，结果须按受限第一方材料理解。

## 文章、互动与开发处理

本轮形成 1 个实验议题、1 组双语文章；正式开发评审 **0 项**，开发任务 **0 项**。上游展示了“声明与权限静态对照＋动作时上限”的可取做法；本地仍缺 live skill 路径和真实用户需求对应证据，不能称已发现可利用缺陷或直接派工。后续若进入 live skill 验证，需要同时绑定技能版本、权限、任务授权和实际工具动作。英文可读证据见 [English report](./00-report.en.md)。

研究交流：已在 [Bulbasaur 原 PR #25](https://github.com/mansura-habiba/bulbasaur-skill-cli/pull/25#issuecomment-6999111541)提交限定范围的实验观察，追问静态校验失败时宿主是否应整体拒绝加载；既有 Star 已核验，报告更新时尚未观察到回复。交流稿与回执仅存本地台账。
