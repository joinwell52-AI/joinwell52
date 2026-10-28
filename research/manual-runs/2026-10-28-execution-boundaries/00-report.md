# 2026-10-28｜停止后的工具与缺页后的记忆：两组有界对照

[English report](./00-report.en.md)

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

## 3. 独立探针：取消后远端仍可能提交

为检验“停止”是否足以说明外部结果，我们另写了[合成远端探针](./probe-stop-receipt.py)，穿过合并版真实 `Runner` 与 `CustomTool`。活动调用把请求交给一个延迟提交的独立任务后，函数失败被选定。此时活动调用收到取消，排队调用未启动；但合成远端已经接收请求。本地运行结束后才放行远端，它仍完成提交。[保存的观察](./probe-stop-receipt.result.json)显示了停止时与远端完成后的两组状态。

这个“远端”是同一 Python 进程中的独立异步任务，特意用来构造**本地取消不能撤销已接受操作**的反例。它没有发出 HTTP 请求，不代表 OpenAI 框架有新漏洞，更不能估计真实外部写入频率。它回答的只是：队列关闭与外部结果确认必须分别记录。

## 4. 独立探针：真实本地文件的两种读取面

[磁盘缺页探针](./probe-disk-gap.py)使用合并版 `EventLog` 和 `LocalFileStore`，在临时目录真实写入四个 JSON 文件，删除序号 1，再以新存储实例加载。幸存事件都可读，普通遍历位置为 `0,1,2`，`get_seq` 却返回 `0,2,3`，加载时有一次缺损警告。[保存的观察](./probe-disk-gap.result.json)含事件 ID 与两种序号。这比上游内存存储测试多检查了本机文件路径；它仍不是生产磁盘故障或上层会话恢复测试。

两个探针均以固定合并版源码和独立脚本运行。前者用仓库 `uv.lock` 的开发环境，后者将合并版 `openhands-sdk` 放在 `PYTHONPATH` 首位；脚本包含断言，结果文件记录期望值。复跑时应核对实际导入路径和环境，并将新结果另存，不覆盖本轮观察。

## 研究边界与产品决定

两组前后结果来自固定源码与上游回归测试的本机复跑；另补两个自拟、可重跑的窄探针。它们不证明整个框架的安全性。未跑 Paperclip 接管、Paradev 查看者凭据、真实模型调用，也未针对 CodeFlowMu 固定版本完成对应问题或需求验证。因此本轮 CodeFlowMu 正式开发评审为 **0 项**；两项不会凭外部修复自动进入开发。

对后续研究的两个问题：当取消到达时，已经开始的外部工具如何记录不可回滚的副作用？当历史被有界桥接后，上层验证器是否能收到“缺页”事实，而不是只看到一条可继续使用的链？
