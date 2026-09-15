# 2026-09-15：执行前后的事实，不能用连续会话代替

[English evidence overview](README.en.md)

本轮人工研究覆盖用户提供的 **7 组雷达、11 个一手变更对象**。完成 **4 项有界实验，形成 3 篇双语文章**。没有将来源阅读计为复现，没有把测试数量相加成可靠性评分。

## 阅读入口

- [写了“始终审批”，AI 为什么还是执行了？](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-09-15-approval-setting) · [English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-09-15-approval-setting)
- [AI 报错了，为什么数据库反而多写了一条？](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-09-15-retry-after-error) · [English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-09-15-retry-after-error)
- [只是按了暂停，任务为什么被判出故障？](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-09-15-pause-is-not-failure) · [English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-09-15-pause-is-not-failure)
- [完整来源与分类](01-source-audit.md) · [实验范围与结果](02-experiments.md) · [内容自检](05-quality-review.md)

## 本轮结果

| 实验 | 对照观察 | 候选观察 | 证据边界 |
| --- | --- | --- | --- |
| SDK 实时审批 | 四类非法设置各执行一次 | 四类设置报错、零执行 | 完整入口，单方法消融；本地列表效果 |
| CrewAI 工具异常 | 一次尝试两次提交；三次尝试六次提交 | 一次一次；三次三次 | 四个原方法；周边替身；真实 SQLite |
| Orca 送达判断 | 空历史判未送达；恢复拒绝要求新身份 | 保留未知；恢复拒绝保持未确认 | 完整模块、合成输入；没有实际重发 |
| Paperclip 暂停原因 | 暂停走预算升级分支 | 跳过暂停，保留真实预算升级 | 原函数与分支；数据库替身；非完整恢复 |

正式 CodeFlowMu 开发评审 **0 项**：没有取得本地对应问题或新增需求的相称验证。上游实验成果足以支持文章和具体交流，不足以认定本地产品缺陷。本轮不启动开发。内部产品适用性、交流稿、评论台账与回执仅存本地。

## 复核与复跑

保存结果只读校验：

```sh
node verify.mjs
```

下载固定源码后重跑（需要 Git、tar、Node、Python 3.12、uv 和网络）：

```sh
node fetch-sources.mjs
node verify.mjs --sources
npm install
uv venv --python 3.12 .venv
uv pip install --python .venv/Scripts/python.exe -e external/openai-agents-python-5029-head pytest pytest-asyncio pytest-mock inline-snapshot
.venv/Scripts/python.exe probe-sdk.py
.venv/Scripts/python.exe probe-crew.py
node probe-orca.mjs
node probe-paperclip.mjs
```

Linux/macOS 用 `.venv/bin/python` 替换 Windows 路径。探针输出到标准输出，不覆盖发布结果。SDK 父脚本记录子进程退出码；前身单方法对照预期有一项原测试失败，不应被误认为候选测试失败。依赖环境见 `runs/environment.json`；重新解析依赖可能改变版本。

源码归属各上游项目及其许可证，下载缓存不提交。公开探针是本轮编写的测试夹具；原方法/模块在复跑时从固定源码加载。图像是文章机制说明，不是新增实验。哈希证明保存字节一致，不能独立证明结论覆盖范围。
