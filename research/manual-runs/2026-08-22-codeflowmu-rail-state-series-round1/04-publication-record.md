# Research Center 发布记录

日期：2026-08-23

## 授权与范围

- 用户于 2026-08-23 明确指令“发布到GitHub；”。
- 本次只发布至 Research Center 的 GitHub 仓库与 GitHub Pages；未向 DEV、CSDN、掘金或 Cursor Forum 提交。

## GitHub 记录

- 内容提交：`33947826ff5b98079fbd59a95961bb0e964bcbff`
- 发布 PR：[\#157](https://github.com/joinwell52-AI/joinwell52/pull/157)
- 合并提交：`fdc1458a41289b867900114b724a449e4375a66b`
- PR 构建：通过（44 秒）。
- GitHub Pages 部署：[Deploy Research Center Pages \#32586711106](https://github.com/joinwell52-AI/joinwell52/actions/runs/32586711106)，通过（55 秒）。

## 公开页面核验

2026-08-23 使用 HTTP GET 对以下六个页面逐一确认：状态 `200`、正文包含题图路径与“资料与证据边界 / Sources and evidence boundaries”章节；三张 PNG 题图与三张 SVG 文中图亦均返回 `200`。

| 文章 | 中文 | English |
|---|---|---|
| 治理模型、文件状态机与轨道机 | https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-08-22-codeflowmu-governance-state-rail | https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-08-22-codeflowmu-governance-state-rail |
| 文件状态机任务流转 | https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-08-22-agent-task-file-state-machine | https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-08-22-agent-task-file-state-machine |
| 轨道机的派工、恢复与人工裁决边界 | https://joinwell52-ai.github.io/joinwell52/zh/digital-employee/2026-08-22-agent-rail-decision-boundary | https://joinwell52-ai.github.io/joinwell52/en/digital-employee/2026-08-22-agent-rail-decision-boundary |

## 发布时质量与风险

- 构建：`npm run docs:build` 通过；严格 SSR 门禁通过。
- 发布结构：`npm run publication:layout:validate` 通过。
- 编辑门禁：`npm run publication:editorial:validate` 通过。
- 工作流状态：发布后由本记录将一次性流程标记为 `Published`。
- 风险仍保留在正文：V1.9.7 是第一方候选证据；私有运行时无法由公众完整复现；跨平台、渗透安全和长期真实团队的结论仍待独立验证。
