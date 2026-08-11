# Research Runtime Worker Contract V3 — 中文

## 全局合同

所有 Runtime Worker 必须：

1. 读取 V5 Scheduler 权威清单与自己所属 Runtime 的记录；
2. 只消费该阶段声明的输入；
3. 只执行该阶段规定的工作；
4. 在报告完成前写入持久化产物；
5. 记录 Input、Work Result、Output、Next、Metrics、Evidence、Artifacts；
6. 只更新自己所属 Runtime 的 Record；
7. 只要阶段创建或发布了仓库产物，就必须完成 GitHub Commit 与 Commit Verify。

Worker 不得把 Scheduler 触发当成任务完成。

## Daily Runtime Worker

### 09:00 — Research Runtime Discovery

- 输入：三条 Research Intelligence Profile。
- 工作：扫描、规范化、去重当天信号。
- 输出：Signal Pool。
- 禁止：选题、Deep Reading、Analysis、写作。

### 10:00 — Research Runtime Queue

- 输入：当天 Signal Pool。
- 工作：评分，并对三个栏目分别作出决定。
- 输出：Today's Research Plan；每个栏目必须为 `Selected` 或 `No Selection`。
- 禁止：栏目不作决定、直接发布。

### 11:00 — Research Runtime Reading

- 输入：当天已选对象。
- 工作：Skill 03 Deep Reading 与证据提取。
- 输出：Reading Result。
- 禁止：用摘要替代原始阅读、开始写文章。

### 13:00 — Research Runtime Analysis

- 输入：Reading Result。
- 工作：Skill 04 Research Analysis、比较、判断与影响映射。
- 输出：Research Object。
- 禁止：分析未阅读材料、直接发布。

### 15:00 — Research Runtime Production

- 输入：只能是 Research Object。
- 工作：Skill 05 Writing → 一张正式科技编辑题图 → 判断并在正文相关位置嵌入 `0..N` 张文中配图 → Skill 07 Evidence & Citation → Skill 08 Publication Editing → 静态文章版式校验。
- 输出：完整中英文 Publication Candidate，并通过 `coverGate`、`inlineVisualGate` 与 `layoutGate`。
- 禁止：从 Signal Pool 或 Reading Result 直接写作、直接发布、用技术图冒充题图、生成固定 `## Cover` / `## Figure` 图片栏目，或为了凑门禁强制生成无必要配图。

### 20:00 — Research Runtime Publication

- 输入：只能是完整 Publication Candidate。
- 工作：更新中英文公开文件、索引与网站；提交；验证；发布。
- 输出：Released Daily Research。
- 禁止：重新研究、实质性重写、补救证据。

## Weekly Runtime Worker

- 输入：过去七天已完成证据核验的 Daily Research。
- 工作：形成 Trend、Architecture、Engineering、Prediction 综合判断。
- 输出：Weekly Synthesis。
- 禁止：复制或拼接 Daily 文章。

## Academic Runtime Worker

- 输入：Paper、Benchmark、Specification 或 Institution 对象。
- 工作：完整执行 Reading、Analysis、Writing、Visualization、Evidence、Editing 流程。
- 输出：Academic Observation。
- 禁止：普通产品新闻或一般行业新闻。

## Research Program Runtime Worker

- 输入：TMPA、FCoP、CodeFlowMu、Digital Employee、Research Operating System 的独立 Program Queue。
- 工作：推进 Program Queue、Research、Review 与 Program Publication。
- 输出：受治理的 Program 状态转换与 Program Runtime Record。
- 禁止：进入 Daily Runtime、占用 Daily 栏目、未经 Program Review 发布。

## 成果规则

所有终态任务必须符合 `runtime-shift-result/v2`。班次实际执行成功时必须为 `Completed`，包括受治理输出为 0 的结果；`Skipped` 只允许用于该班次明确不适用且未执行的情况。

## GitHub 规则

GitHub 是唯一事实源。只要任务修改仓库，就必须获取并验证最终 Commit。只在聊天中写草稿或描述计划不算完成。
