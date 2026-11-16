# 新消息与交接结果：有界实验记录

日期：2026-11-16。来源：[AG2 #3639](https://github.com/ag2ai/ag2/pull/3639)，作者 coder-abu，已合并。该修复规定：终止工具结果或客户端交接结束本轮时，运行中排队的新输入留给同一 stream 的下一轮，避免额外模型调用改写已形成的交接结果。上游说明特别指出：每次请求建立新 stream 的适配器另有需要处理的输入归属问题，本实验不为它们做保证。

## 固定对象与方法

- AG2 v1.3.2 源码提交 `bf76b9cb6607936a7c240b1efc1811d8bd422de6`；修复前函数取自父提交 `3399e3ef2e339f6c64f7fc8d27eaed09662846a4`。
- [公开最小探针](probe_turn.py)运行 AG2 当前模块，仅在旧对照时替换 `_execute_turn` 函数体；使用 AG2 的 `TestConfig` 脚本模型，不请求真实模型。终止工具返回 `Ticket escalated.`；在工具结果事件到来时排队 `What about my order?`。
- 复跑前将 AG2 checkout 固定在上述 v1.3.2 提交，并确保仓库包含父提交；浅克隆可执行 `git fetch --no-tags --depth=1 origin 3399e3ef2e339f6c64f7fc8d27eaed09662846a4`。在安装了该 checkout 的 Python 环境运行 `python probe_turn.py PATH_TO_AG2_CHECKOUT`。本地按此方式复跑通过；没有改上游源码。
- 真实上游目标测试三项通过：终止工具结果保留、客户端交接等待工具结果后恢复、普通中途输入仍在当前轮消费。测试集合见 [AG2 仓库测试文件](https://github.com/ag2ai/ag2/blob/bf76b9cb6607936a7c240b1efc1811d8bd422de6/test/agent/test_run.py)。

| 对照 | 该轮最终回复 | 该轮脚本模型调用 |
| --- | --- | ---: |
| 修复前 `_execute_turn` + 当前其余运行时 | `Your order shipped.` | 2 |
| v1.3.2 当前函数与运行时 | `Ticket escalated.` | 1 |

这是局部函数因果对照，不是完整旧版发行包测试；原始[结果记录](turn-results.json)由本地运行采集。没有模拟真实提供方拒绝未回答工具调用，也没有运行 A2A/AG-UI 新 stream 适配器。

## CodeFlowMu 对照

产品版本 V3.0.152，提交 `0d2d4e742ef2f3cb48e3ce09cc47f0c03053dc5f`。本地探针穿过当前 `NativeHostProcess.steer`：进程在调用前已结束时返回 `not_live`、stdin 写入 0 次；写入期间结束而无原生送达回执时返回 `unknown`、保存输入，同一请求再查仍为 `unknown`、stdin 总共写入 1 次。相关协调/投递目标回归 27 项通过。两个要求受信任管理员测试环境的集成用例在 `TEST_ADMIN_TOKEN_REQUIRED` 前置条件处停止，未记为通过。

CodeFlowMu 证据只覆盖“输入保存与原生投递不被混称已送达”的局部合同；**不能**由此推出所有真实 Host 的模型轮次与 AG2 相同，也不能认定有同类产品缺陷。FCoP 的正式 TASK/REPORT/验收事实与 Host 会话轮次分属不同层，排队聊天输入不会自动改变正式任务授权或交付。

## 判定

本轮不改 CodeFlowMu，不引入 AG2，不形成正式开发评审。后续若使用受信任真实 Host，优先测运行中、交接点、结束后三时点的输入归属、送达回执、模型调用及新 attempt；这是研究验证候选，条件工时约 0.5–1 工程日，不是开发排期。

公开包保留精确上游探针与结果；CodeFlowMu 源码和产品测试环境受限，本报告只发布结果与明确限制。本文数字不能合并成端到端可靠性百分比。
