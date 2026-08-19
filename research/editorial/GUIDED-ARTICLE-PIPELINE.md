# Guided Article Pipeline V2

## 目的

这条流水线用于需要用户逐阶段确认的 Research Center 人工文章。它不替代 Daily Research Runtime，也不创建 Scheduler、automation 或 cron。

用户可见流程只有四步：

1. 先完整阅读自有研究与工程证据，再从已经实现、能够举证的优势中拟定题目和纲要，交给用户选择；
2. 用户确认题目后，完成定向研究、正文写作与独立编辑复核；
3. 用户确认正文后，制作题图、必要的文中图和整包预览；
4. 用户确认预览后，等待明确的发布指令，再提交、部署和验收公开页面。

内部证据、去重、事实矩阵、Article Brief、独立编辑和视觉 QA 仍然保留，但不得越过用户确认门。

所有选题、正文、独立编辑和视觉工作开始前，必须完整读取并执行 [`COMMUNITY-TECHNICAL-WRITING-STANDARD.md`](./COMMUNITY-TECHNICAL-WRITING-STANDARD.md)。所有题图、文中图和图文预览还必须完整读取并执行 [`EDITORIAL-VISUAL-STANDARD.md`](./EDITORIAL-VISUAL-STANDARD.md)。两份文件分别是全局技术文章标准和全局视觉标准；单次运行复盘只能补充，不能降低它们。

## 检查点

| Checkpoint | 允许的工作 | 必须停下等待 |
| --- | --- | --- |
| `AwaitingTopicSelection` | 1–3 个题目、纲要、证据计划与视觉构想 | 用户选择、合并或修改题目 |
| `WritingInProgress` | 仅对已选题定向研究和写作 | — |
| `AwaitingWritingApproval` | 完整中英文稿、来源、事实矩阵、Brief、独立复核 | 用户确认正文 |
| `VisualsInProgress` | 题图和确有必要的文中图 | — |
| `AwaitingVisualApproval` | 完整文章与图片预览 | 用户确认视觉与整包 |
| `AwaitingPublicationApproval` | 发布前机械 QA | 用户明确说“发布” |
| `Publishing` | 提交、推送、部署和公开页面验收 | — |
| `Published` | 只记录已验证结果 | — |

## 选题前的第一方阅读门

Research Center 的自有项目研究不得从外部热点、竞品能力或本项目尚未实现的短处反推标题。生成任何题目之前，必须持久化 `01-first-party-reading.json`，并完整阅读六类材料：

1. **定位**：Research Center、TMPA、FCoP、CodeFlowMu 的关系与目标读者；
2. **规范**：当前有效的 TMPA Core、FCoP spec 与边界 ADR；
3. **实现**：与候选机制直接对应的当前代码、产品说明或公开能力清单；
4. **现场证据**：测试、运行记录、真实 TASK/REPORT/REVIEW、dogfood 或可复现实验；
5. **研究历史**：当前 Knowledge、Architecture Gate、未决问题与能力状态；
6. **近期内容**：过去 30 天已发布文章和候选包，用于问题、结论、证据与读者行动去重。

每条阅读记录必须写明：文件路径、是否完整阅读、能够支持的主张和不能支持的主张。只有 README、愿景、Roadmap 或规范声明，没有实现或现场证据，不足以把一个“优势”写进候选题。

每个自有项目候选题必须声明 `framing: first-party-strength`，并记录：研究对象、至少一项已举证优势、优势的内部来源、读者价值和预期文章结果。标题和纲要应解释“我们已经做成了什么、为什么有价值、读者如何复用”，不得以 Redis、消息队列、分布式锁、任务租约或其他尚未采用的能力作为文章中心。

## 硬规则

- 第 1 门最多提供 3 个候选，不写正文、不生成图片、不发布。
- 第一方阅读记录未完成，或候选优势没有实现/现场证据时，第 1 门校验失败，不得把题目交给用户选择。
- `topic` 未记录为用户批准时，不得进入写作。
- `writing` 未记录为用户批准时，不得进入配图。
- `visuals` 未记录为用户批准时，不得请求或执行发布。
- `publication` 未记录为用户批准时，不得进入 `Publishing` 或 `Published`。
- 题目确认不是证据豁免。定向资料搜集后仍可因证据不足收窄、降级或退回用户重新选择。
- 文中图是可选项；只有能降低理解成本时才制作。
- 用户、模型或编辑建议只提供编辑方向，不建立技术事实；必须先按全局技术文章标准完成规范、代码和测试核验。
- 返工导致事实、数字、结论或证据边界变化时，中英文稿必须同步复核，旧版独立编辑分数不得沿用。
- 发布只限 Research Center，除非用户另行明确指定其他平台。

## 文件约定

每次人工运行位于：

`research/manual-runs/<runId>/`

数字前缀对应用户门：

- `01-*`：题目与纲要；
- `02-*`：研究、Brief、正文与独立复核；
- `03-*`：题图、文中图与预览；
- `04-*`：发布批准与发布记录。

校验器会拒绝当前检查点之后的数字前缀文件，防止“先做了再请用户追认”。

## 校验命令

```bash
npm run article:guided:validate -- --state research/manual-runs/<runId>/pipeline-state.json
npm run article:guided:test
```

校验器只读，不自动改写中文文件。状态与内容文件由受控编辑产生，中文文本仍遵守工作区的 `apply_patch` 规则。
