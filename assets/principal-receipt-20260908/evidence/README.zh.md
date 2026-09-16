
# 共享 Agent 身份与损坏回执：公开证据说明

[English](https://joinwell52-ai.github.io/joinwell52/en/research/evidence/2026-09-08-principal-receipt) · [下载完整公开包](https://joinwell52-ai.github.io/joinwell52/assets/principal-receipt-20260908/evidence.zip)

本包服务于[共享 Agent 身份文章](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-09-08-shared-agent-instruction-identity)和[损坏回执反例文章](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-09-08-corrupt-receipt-dispatch-counterexample)。发布不等于验证，记录校验也不等于重新执行产品。

## 来源与正式集合

研究日期为 2026 年 9 月 8 日；第一方固定提交为 `c008d9db91a21136fc61a4f60314e22db395d5d2`。环境为 Windows、Node v24.16.0。每次运行保留相关源码文件摘要；它们不是整个仓库的完整依赖闭包。

| 文件 | 内容 | 正式观测数 |
| --- | --- | ---: |
| observations-1.json / observations-2.json | A0–A4 主体对照、R0–R8 回执对照、S0–S2 和 O1 存储对照 | 每轮 18 |
| observations-3.json / observations-4.json | I0–I7 真实调度链实验 | 每轮 8 |
| observations-5.json / observations-6.json | J0–J3 来源投影与策略构造 | 每轮 4 |

共 60 条保存观测，不是 60 次事故、60 个独立用户或可靠性评分。预跑不计入正式集合，名称在 [provenance.json](https://joinwell52-ai.github.io/joinwell52/assets/principal-receipt-20260908/evidence/provenance.json) 中列出。A3 的不同真人只存在于研究叙述，产品输入没有真人身份；不能将它读成双账号实验。

Paperclip [#13005](https://github.com/paperclipai/paperclip/pull/13005) 在研究快照时已合并，固定合并提交为 `1cc45086d3b2f2710d4e161b0dc9ad1d3662a9a8`。它提供受管理 GitHub 操作的身份和凭据选择对照；作者的双账号验证不是我们的独立复跑。Orca [#19399](https://github.com/stablyai/orca/pull/19399) 在研究快照时仍为 Draft，固定 head 为 `885bdbb85617ba248c720073678d34e1e14b62b4`；日志代际修复是提案，不是本轮验证的交付能力。

## 主张与结果怎样对应

| 主张 | 观测 | 不能推出 |
| --- | --- | --- |
| Agent 主体变化使旧批准失效 | A1、A4、J3 | 真人身份全链路已解决 |
| 嵌套触发消息未进入对应会话字段 | J1/J2；逻辑执行编号为阳性对照 | 聊天和命令证据全部丢失 |
| 坏回执可能再次进入执行回调 | R2/R3/R6 | 真实任务或外部效果重复 |
| 同键调度在受测场景没有第二次启动 | I1–I6 | 所有平台、所有中断恢复均安全 |
| 新键可触发新尝试 | I7，合成治理放行 | 改键自动获得真人授权 |
| 其他存储明确区分损坏与缺失 | S0–S2、O1 | 所有存储行为相同 |

[历史聚合](https://joinwell52-ai.github.io/joinwell52/assets/principal-receipt-20260908/evidence/history.json)来自 9 月 8 日逐文件读取的 9 月 5 日记录：审批 1 条、回执 10 行/5 键、技能调用 25 条，其中 9 条具有会话编号。并非全局原子快照；字段缺失不等于全产品没有等价信息。完整性字段存在数量不是完整性算法验签结果。

## 如何复核

解压公开包，进入 evidence 目录，使用 Node 22 或更新版本运行：

```text
node check-records.mjs
```

校验器先检查清单中全部文件的字节数与 SHA-256，再检查 18/8/4 的两轮集合、稳定结果一致性，以及文章引用的控制结果。预期输出以 `PASS: public file hashes, 60 saved observations` 开头，并明确不是新的产品运行或独立 QA。失败时抛错并返回非零退出码。

这是“主张 → 来源摘要 → 脱敏观测 → 读取与断言 → 预期结果 → 限制”的证据包。它不含完整产品源码，也不声称仅凭公开包能重建产品实验。重新执行产品需要固定源码、依赖、隔离任务夹具、治理替身和内存 SDK；原始脚本和完整夹具目前访问受限。

## 脱敏及不可外推的边界

逐轮导出只移除本机夹具定位与进程 PID，保留进程数量；每份公开记录包含原文件 SHA-256。结果、顺序、拒绝条件、源码摘要和限制不变。历史文件不公开操作原文和记录文件名，只保留聚合与源摘要。哈希把版本关联起来，不能让读者凭空验证访问受限原文。

审批回调、治理快照和 SDK 有明确合成部分；没有真实双人认证、凭据切换、付款、邮件或代码推送。I6 是同进程共享一个调度器；I3 是新进程顺序读取旧磁盘状态，不是跨进程并发写锁、硬件掉电或完整启动恢复实验。磁盘 running 状态不证明原进程仍活着。

研究没有改产品、没有实施修复，也未通过独立 QA。公开准备阶段没有新增一轮产品实验。题图为编辑性比喻，文中图只解释已列出的 J1/J2 与 I2/I7，不能代替记录。
