# 执行边界与成果连续性：公开证据包

研究日期：2026-09-06；发布授权：2026-09-07。固定 CodeFlowMu 基线：`c008d9db91a21136fc61a4f60314e22db395d5d2`。本包不是产品安全认证、独立 QA 或新增开发授权。

[English](README.en.md) · [完整观测](observations.json) · [版本与原始记录哈希](provenance.json)

## 主张、观察与限制

| ID | 两轮观测 | 支持什么／不能证明什么 |
| --- | --- | --- |
| A0 | 首次效果 1；重放被拒绝 | 单次消费；不代表所有工具全链路 |
| A1 | pending 取消接受；效果 0 | 未获批准的请求取消；尝试执行用的不是已签发令牌，不能证明批准后撤销 |
| A2 | pending 超时后 expired；批准被拒 | 待审批截止有效 |
| A3 | 第 30 秒待审批截止，第 31 秒执行成功 | approved token 的既定语义；不是授权过期绕过 |
| A4 | 回调等待时 cancel 被拒，之后效果 1 | 拒绝码 APPROVAL_NOT_PENDING；不是成功取消后执行 |
| A5 | cancel 仍被拒，研究回调的额外检查令效果为 0 | 自设中止标记，不是产品新增机制 |
| A6 | 先产生效果，收尾时取消被拒 | 效果仍 1，不能推出自动回滚 |
| B0 | 相同请求摘要相同 | 同轮相同输入；不同轮夹具路径不同，摘要不必跨轮相等 |
| B1 | 目标变化后 APPROVAL_STALE，效果 0 | 执行前重算；不是任意并发文件变化的端到端保证 |
| B2 | 同内容、换工作区，操作摘要不同 | 内容身份不替代操作位置 |
| B3 | 换 TASK，操作摘要不同 | 任务身份参与绑定 |
| B4 | 新进程读回摘要一致；改名保留后原路径不在、历史成功仍在 | 同一成果三个时点；非断电、远程同步或业务验收 |
| Adapter normal | 每轮发送 1 次批准答复 | 真实适配器＋伪进程通信 |
| Adapter cancel-during-async-resolution | 每轮答复 0 | 最终发送保护；不是宿主内部工具锁后检查 |
| Adapter request-after-cancel | 每轮答复 0 | 迟到请求保护；不是 OS 进程退出证明 |

12 个服务/工作区场景各两轮＝24 条；3 个适配器场景各两轮＝6 条。不是 30 种独立场景，不统计安全准确率。既有两个测试文件每轮 39 pass / 0 fail / 0 skip，各自保留两份日志，不合并为产品覆盖率。

## 校验公开记录

完整下载 ZIP、解压，进入 evidence 目录，执行：

```sh
node check.mjs
```

只需要 Node；检查导出的 30 条观测、对照语义、基线日志和逐文件哈希。不调用模型、不重跑产品、不写产品目录。哈希可检出相对本清单的字节变化，不是外部签名认证。

## 复跑产品探针

本包不包含 CodeFlowMu 产品源码。需要读者有权访问上述固定基线，安装该项目已有依赖，并使用其 tsx loader 加载 TypeScript。配置 `CODEFLOWMU_SOURCE_ROOT` 后，在包目录运行，例如：

```sh
CODEFLOWMU_SOURCE_ROOT=/path/to/authorized/source node --import /path/to/authorized/source/node_modules/tsx/dist/loader.mjs probe-boundaries.mjs
CODEFLOWMU_SOURCE_ROOT=/path/to/authorized/source node --import /path/to/authorized/source/node_modules/tsx/dist/loader.mjs probe-adapter.mjs
```

以上是 POSIX shell 形式；Windows 请用本机等效环境变量设置与文件 URL loader 路径。实际 loader 位置以安装依赖为准。原实验在 Windows 执行，不能把这组命令当成跨平台验收。

公开探针由实际脚本仅作机械移植：硬编码产品根改为环境变量和动态导入；适配器探针补独立运行所需的 fixtures 目录创建。输出进入本包的 fixtures/runs 或适配器夹具目录，不覆盖 observations.json。公开适配版在发布时做语法检查，未作为新一轮产品实验运行。

## 脱敏、来源与反证

- 全部场景、轮次、状态、错误码、效果计数、内容/请求摘要和观测时间保留。移除本机目录与子进程 PID；不公开原运行账本、批准令牌、用户配置或产品副本。
- 原始 JSON、原探针与原基线日志 SHA-256 见 provenance.json；哈希不让读者还原未公开原件，也不替代独立复跑。
- 七个源码文件的前后摘要核对记录以 product_files 保存。产品原工作区含既存运行数据变更，不宣称整个工作区干净。
- B1 介入内容和 B4 改名后字节在本地编辑复核中再次读取；公开 JSON 的 B1 没有额外添加不存在的原始字段。原夹具未公开。
- Adapter normal 的最终 cancelled 来自清理；kill_calls 只是伪进程方法调用，不是操作系统进程退出。
- 初始实验曾遇到读取路径/通配方式问题，修正后执行；没有把诊断命令算作实验失败，也没有删除实验失败来凑全绿。正式记录没有 unexpected_error。
- OpenHands #4866 是关闭未合入的提案，作者说明修正证据后重提；Paperclip #12901 是已合入的远程工作区变更。状态是 2026-09-06 的来源快照，不宣称持续监测；未独立复跑上游实验或付费 Daytona 套件。

## 读者仍不能据此下的结论

没有真实宿主资源队列、在线任务取消、授权撤销后的工具执行、OS 终止、断电、远程沙箱删除/同步、并发分支合并、生产事故比例或 PM/QA 验收数据。两篇文章均不宣布新产品缺陷、完成修复或批准开发。
