---
title: 凭证、并发与恢复：实验方法与逐轮结果
date: 2026-09-10
---

# 实验附件：对象、作用域与证据边界

所有凭证均为固定合成字符串；没有访问真实密钥、连接模型、操作生产数据库或向外部服务试写。上游源码未修改；Python 方法抽取、TypeScript 类型擦除、依赖接缝均在探针内可审查。

## A · AG2：同一上限，两个统计范围

来源：[#3243](https://github.com/ag2ai/ag2/pull/3243)。base `33779766a2e5040b0f0feb80cd4dd50c24d1e07c`；head `5487973dabc47a383a9c268a121f8de3084ec122`。

实际执行 `Agent._spawn_subtask` 原方法；初始化字段为与版本相符的夹具，任务正文替换为可等待的计数协程。双循环时，A1 先进入，B1 在另一个真实 OS 线程进入，然后 A 再申请 A2，最后统一释放。这个交错直接检验旧单槽引用是否被另一个循环替换，不依赖随机抢占。

| 版本 / 执行域 | A 循环峰值 | B 循环峰值 | 全局峰值 |
| --- | ---: | ---: | ---: |
| base / 单循环 | 1 | 0 | 1 |
| base / 双循环 | 2 | 1 | 3 |
| head / 单循环 | 1 | 0 | 1 |
| head / 双循环 | 1 | 1 | 2 |

每种配置每轮 5 次，2 轮共 40 次受控试验，逐次结果一致；无异常。它证明所测方法在这个交错下的局部与合计行为，不是完整 Agent、模型调用或分布式负载测试。

复跑：`python probe-ag2.py 3`。结果：[第1轮](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/runs/ag2-1.json)、[第2轮](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/runs/ag2-2.json)。

## B · OpenHands：同一秘密，不同传递路径

#4927 base `7a018907c9b6cac2ee7b205a1b4a5e3e0228e8e4`；head `cf1283ca0690d333cbdf0bd7d90b42d16583cb58`。#4931 head `3c51d02d5b224c45664408b1b164b5843b98922e`。

执行原 `_active_file_secrets`、`_present_file_secret_names`、`_strip_conflicting_env`，以及启动方法中连续的环境构造代码。两个版本共用从 head 固定源文件语法树提取的注册表元数据；提供方身份由夹具直接指定，未验证命令探测。注册表导出与文件写入为接缝夹具，文件端只统计回调，不声称创建了真实认证文件。最终环境交给真实 Python 子进程，子进程只返回变量名。四种文件型模拟秘密为 Codex、Gemini、Kimi、Pi 注册表声明的名字。

| 版本 / 提供方 | 文件物化回调数 | 子进程中的四类 blob 变量数 |
| --- | ---: | ---: |
| base / Claude | 4 | 0 |
| base / Codex | 4 | 0 |
| base / 未识别 | 4 | 0 |
| head / Claude | 0 | 4 |
| head / Codex | 1 | 3 |
| head / 未识别 | 4 | 0 |

再把 #4931 的原配置过滤函数接到 #4927 环境片段前面，作为**跨 PR 实验组合**，不是两者已经合并的 SDK：

| Claude ACP 配置 | 过滤后注册表中的名称 |
| --- | --- |
| `null` | 四类 blob、`ANTHROPIC_API_KEY`、`PROD_DB_URL` |
| `[]` | `ANTHROPIC_API_KEY` |
| `[PROD_DB_URL]` | `ANTHROPIC_API_KEY`、`PROD_DB_URL` |

以上所有 ACP 环境场景仍携带装置中的 `PLATFORM_INTERNAL_SENTINEL`，因为该入口在注册表过滤之外。另设普通 OpenHands 配置空列表对照，只运行配置过滤函数，所得集合为空；**没有将此对照解释为普通 OpenHands 子进程测试**。

两轮各 10 个场景，结果一致。先前装置启动失败及修正见 [装置记录](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/runs/harness-notes.md)。我们没有真实 CLI 握手、SDK 服务端、认证、模型输出或秘密外泄证据。

复跑：`python probe-openhands.py 3`。结果：[第1轮](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/runs/openhands-1.json)、[第2轮](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/runs/openhands-2.json)。

## C · Orca：恢复动作与预算释放读取两份索引

来源：[#19745](https://github.com/stablyai/orca/pull/19745)。base `b94bcdc632a9af756f2c43e7e4b4c3b8930f75eb`；head `7af0f109537e5f39aee532690ec4a16b3d58f9fb`。

运行完整恢复模块和对象查找模块，擦除 TypeScript 类型并替换导入。计时、定时器、store 外壳、PTY 和日志为夹具；真实 remount 函数更新内存中终端行的 generation。没有启动 Electron，没有复现显存耗尽。

| 场景 | 请求次数 | base 恢复数 | head 恢复数 |
| --- | ---: | ---: | ---: |
| 两索引一致，间隔 10ms | 200 | 1 | 1 |
| 终端行存在、UI 索引缺失，间隔 10ms | 200 | 200 | 1 |
| 同上，间隔 16s | 10 | 10 | 3 |
| 模拟真正关闭并重新建行 | 2 | 2 | 2 |
| 0/16/32/48/300.001 秒申请 | 5 | 4 | 4 |
| 第一轮成功后重放旧 generation | 2 | 1 | 1 |

两轮各 12 个版本/场景结果一致。10ms 对照体现冷却记录被清除，16s 对照体现五分钟累计上限被清除；二者不可合并为同一种计数。

上游报告的 8 个 tab、122.4 秒、8,878 次 remount 属于作者事故材料，本轮没有取得原始崩溃包，不能当作我们的实测。

复跑：`node probe-orca.mjs 3`。结果：[第1轮](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/runs/orca-1.json)、[第2轮](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/runs/orca-2.json)。

## D · Paperclip：终止请求与退出事实

来源：[#13119](https://github.com/paperclipai/paperclip/pull/13119)，head `7dd170d83f251464f882e7028afb51c9805845b7`。

直接加载 `local-process-control.ts` 原模块，启动一个只等待的 Node 子进程。模块捕获到了同一个 ChildProcess 句柄；终止请求返回 true 的当下，退出证据仍为 false；收到 exit 事件后为 true，重复终止返回 false，捕获表已移除该句柄。未知句柄不会被认定为已退出。两轮结果相同。

这仅验证单一子进程的捕获与退出观察。没有验证子孙进程、工具副作用停止、ACP continuation、新凭证注入或业务可重试性，故不单独包装成长篇“Stop 已安全”文章。

复跑：`node probe-paperclip.mjs 3`。结果：[第1轮](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/runs/paperclip-1.json)、[第2轮](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/runs/paperclip-2.json)。

## 来源与完整性

`sources/index.json` 固定 PR 状态；`sources/code-manifest.json` 固定源文件 URL、SHA 与 SHA-256；`collect.mjs` / `fetch-code.mjs` / `fetch-registry.mjs` 是采集器。`verify.mjs` 检查文件哈希与两轮输出，不把哈希检查称为重新执行实验。


## 公开复核入口

[实验记录与复跑脚本](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope) · [固定源文件清单](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/sources/code-manifest.json) · [English evidence guide](/en/research/evidence/2026-09-10-authority-scope)

公开包不再分发上游完整源码。先运行 `node fetch-pinned.mjs`，按固定 URL 获取并核验原始字节，再运行相应探针。Python 3.10 与 Node 24.16.0 是本轮实际解释器。绘图另需 Matplotlib 与 Pillow；它们不是运行探针的依赖。保存的第 1、2 轮保持不变，新运行请用第 3 轮或其他新编号。
