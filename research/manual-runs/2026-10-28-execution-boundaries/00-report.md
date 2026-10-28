# 2026-10-28｜停止后的工具与缺页后的记忆：两组有界对照

本报告承接[10 月 28 日的 18 组日常情报](https://joinwell52-ai.github.io/joinwell52/zh/runtime/daily-intelligence/2026-10-28)，从中选取两组具备修复前后源码和本地可执行回归测试的议题。情报收集与实验是不同工作；其余 16 组没有在本文被写成已实验。

## 1. OpenAI Agents Python：失败已选定，排队 native 工具是否停止

一手来源：[PR #5446](https://github.com/openai/openai-agents-python/pull/5446)。对照源码为修复前 [`a91f0bfe`](https://github.com/openai/openai-agents-python/tree/a91f0bfe013a63ce0ad8935c8c2d25047d249002) 与合并版 [`cd26bbbc`](https://github.com/openai/openai-agents-python/tree/cd26bbbc52847845fde73b9952b51e62e2bcbdc0)。修复版的[同一测试函数](https://github.com/openai/openai-agents-python/blob/cd26bbbc52847845fde73b9952b51e62e2bcbdc0/tests/test_native_tool_failure_history.py#L438)运行于两份源码；前版测试模块路径已打印核验。该测试用 ScriptedModel、SQLiteSession 与合成 custom/local_shell 工具控制时序，未调用真实模型或执行真实 shell 命令。

| 对照 | 交叉条件 | 结果 |
| --- | --- | --- |
| 修复前 | 2 种工具 × 2 种流式模式 × 2 种输入裁决 × 2 种清理情况，共 16 例 | 16/16 失败，均在 `native_cancelled.is_set()` 断言处 |
| 合并版 | 同一份测试、同样 16 例 | 16/16 通过 |
| 合并版扩展 | `test_native_tool_failure_history.py` 与 `test_asyncio_tasks.py` | 84/84 通过 |

复现环境：Windows，Python 3.13.13，`uv sync --group dev --no-default-groups` 按上游 `uv.lock` 安装。测试命令：

```text
python -m pytest tests/test_native_tool_failure_history.py -k test_selected_function_failure_stops_queued_native_invocations -q -o addopts=
```

修复前使用相同测试文件，并将 `sys.path` 首位置于前版 `src`。这是一份**修复版上游回归测试移植到旧源码的对照**，不是独立发现的线上事故。测试证明在指定异步交错中取消信号会传至活动 native 工具，并约束排队调用；它不能证明已发生的外部副作用被撤销。PR 已合并；本轮没有验证具体发行版包含情况。

## 2. OpenHands SDK：事件文件丢失后能否继续读，以及如何保留缺口

一手来源：[PR #6197](https://github.com/OpenHands/software-agent-sdk/pull/6197)。对照源码为修复前 [`acd96e6f`](https://github.com/OpenHands/software-agent-sdk/tree/acd96e6fa424c02432304395b9208f99be24b54d) 与合并版 [`ded5fa5e`](https://github.com/OpenHands/software-agent-sdk/tree/ded5fa5e76ff9b7b4ff622a8df2ed20335e10652)。从修复版的[事件存储测试](https://github.com/OpenHands/software-agent-sdk/blob/ded5fa5e76ff9b7b4ff622a8df2ed20335e10652/tests/sdk/conversation/test_event_store.py)选取 5 个参数化测试用例，在两份源码上运行，分别覆盖中间文件缺失、原始序号与展示索引分离、首项/中项缺失只告警一次，以及祖先缺失后桥接路径。

| 对照 | 结果 | 直接观察 |
| --- | --- | --- |
| 修复前 | 5/5 失败 | 中间文件丢失时，只索引了首项，后续幸存事件不可见；缺失父事件使路径查找失败。旧版无 `get_seq` 方法。 |
| 合并版 | 5/5 通过 | 可读到首项和后续幸存项，展示索引变密；磁盘序号保留空洞，新增事件使用新序号；缺失祖先有界桥接并告警。 |
| 当前主干的同组用例 | 5/5 通过 | 后续提交未使这组受控测试回退；不代表所有部署版本已包含。 |

固定的示例：写入磁盘序号 `0,1,2,3`，删除序号 `1` 后重新加载；幸存事件的展示索引为 `0,1,2`，原始序号是 `0,2,3`，下一次追加获得序号 `4`。**恢复可读并不等于历史完整**；缺口仍是审计事实。测试使用 `InMemoryFileStore`，模拟文件丢失，并非真实磁盘损坏、分布式并发或生产部署。PR 已合并；本轮没有验证正式发行版包含情况。

复现环境：Windows，上游 workspace `uv sync --group dev --no-default-groups`。同一测试文件在前版和合并版分别以 `sys.path` 首位指定对应 `openhands-sdk` 源码，打印模块绝对路径核验；测试选择命令：

```text
python -m pytest tests/sdk/conversation/test_event_store.py -k "test_log_survives_missing_middle_file or test_seq_is_the_on_disk_index_and_survives_a_reload or test_path_to_root_bridges_a_missing_ancestor or test_lost_event_file_is_reported_once" -q -o addopts=
```

## 研究边界与产品决定

两组结果均来自固定源码、受控上游测试在本机的复跑与前后移植。交叉验证的是具体回归条件，不是整个框架的安全性。未跑 Paperclip 接管、Paradev 查看者凭据、真实模型调用，也未针对 CodeFlowMu 固定版本完成对应问题或需求验证。因此本轮 CodeFlowMu 正式开发评审为 **0 项**；两项不会凭外部修复自动进入开发。

对后续研究的两个问题：当取消到达时，已经开始的外部工具如何记录不可回滚的副作用？当历史被有界桥接后，上层验证器是否能收到“缺页”事实，而不是只看到一条可继续使用的链？
