# 设备清单核对实验：设置、结果与限制

本次实验请 AI 数字员工对照设备台账和盘点表，找出盘点表中未出现的设备编号。我们比较了三种操作说明与工具条件，观察员工实际能读取哪些材料、交回什么结果。

选题来自开源 AI 编程工作台 Paradev 的 #10267 改动。它在操作指南中补上了已有工具的 MCP 调用方法，并标明仍需在本机用终端运行的步骤。原作者核对了工具名称和参数，尚未在所列聊天应用中完整执行这些流程。下文记录的是在 CodeFlowMu 测试工作区运行的设备清单实验。 [Paradev PR #10267](https://github.com/ParadevAI/Paradev/pull/10267)

## 实验设置

CodeFlowMu `0d2d4e742ef2f3cb48e3ce09cc47f0c03053dc5f`、FCoP 4.0.5。三个独立 Codex 会话使用同一个模型（gpt-6.1-sol）、同一岗位规则、同一任务、同一合成输入和相同提示，工具说明和可用能力按组调整。实验环境使用只读 Codex CLI，让 Agent 仅通过测试 MCP 接口工作，并以 CLI 事件核对没有 shell 调用。实际宿主迁移未测试。

设备台账有 `D-01`、`D-02`、`D-03`，盘点表有 `D-01`、`D-03`。三种场景分别提供仅 CLI 的说明、带两个 MCP 读取工具的说明、同一份 MCP 说明但只注册台账读取工具。岗位规则正文一致，只改工具入口和工具可用性。设备数据和岗位说明由实验 MCP 提供。工单、报告、提交和回读走实际产品端口。若 Agent 申报完成，脚本就按其申报提交，判据在实验结束后核查。

探针的三个场景都提供 `read_task`、`read_work_package` 和 `file_result`。第一案没有额外注册任何业务取数工具，第二案注册 `read_register` 与 `read_scan`，第三案只注册 `read_register`。第二、第三案的说明均列出两项 MCP 读取操作。

观察点为实际读取了哪些表、是否报出缺项、证据不全时有没有将未验证设备标为缺失、报告回读和任务状态。技术边界是工具映射及工具实际可得性，业务差异由数字员工判断。

## 实际结果

| 场景 | Agent 实际读到的业务数据 | 正式报告和任务状态 |
| --- | --- | --- |
| 只有 CLI 步骤 | 两份模拟材料都未读到 | 登记受阻，无盘点结论。任务保持开放 |
| 两个 MCP 工具都可用 | 台账和盘点表均读到 | 找出 `D-02` 未出现在盘点表，提交报告待审 |
| 说明列有两个 MCP 工具，实际缺少盘点表读取工具 | 读到台账，盘点表未读到 | 登记受阻，并明确缺少盘点表。任务保持开放 |

两份 MCP 岗位说明相同，工具齐全的一案实际完成了差异对照，缺少工具的一案只能交回已读资料和缺项。该结果支持把完成岗位工作所需的输入、取数能力和验收证据写进工作包，再按实际宿主验证。实验中 `D-02` 缺于盘点表，设备损失或位置均未核验。

每组运行一次。已完成工具条件对照，尚未测试实体盘点、真实工作包安装和跨宿主迁移。下一步可在两个真实宿主安装同一份工作包，逐项验收必需接口和最终报告。

[实际工具轨迹与报告回读](../../../docs/public/assets/work-package-portability-20261128/results.json)

## English summary

Three independent Codex sessions using the same model (gpt-6.1-sol) compared a synthetic equipment register (D-01, D-02, D-03) with a count sheet (D-01, D-03). We restricted the workers to the provided MCP tools to simulate working without a terminal. The Codex event records showed no shell calls. All three sessions could read the assignment and guide and file a report through the test interface. The first guide supplied command-line instructions, with neither data retrieval tool available. The second supplied both MCP data retrieval tools and reported D-02 absent from the count sheet. The third used the same MCP guide but received only the register tool, so it filed a blocker naming the unavailable count-sheet tool. The worker that completed the ID comparison submitted its report for review. The other two tasks stayed open.

The assignments and reports used CodeFlowMu's product interfaces at commit `0d2d4e742ef2f3cb48e3ce09cc47f0c03053dc5f` and FCoP 4.0.5. The equipment data and tool availability were simulated, with one run in each condition. The finding is a difference between two records. Physical verification and installation across real hosts were outside the experiment. [Recorded calls and report readback](../../../docs/public/assets/work-package-portability-20261128/results.json)

[中文官网文章](https://joinwell52-ai.github.io/joinwell52/zh/research/2026-11-28-work-package-portability) · [English article](https://joinwell52-ai.github.io/joinwell52/en/research/2026-11-28-work-package-portability)
