---
title: "证据包：取消的执行边界与成果连续性"
outline: deep
---

<ArticleTableScroll language="zh" />

# 随稿证据：取消的执行边界与成果连续性

用户已于 2026-09-07 授权随两篇双语文章公开发布。研究执行日期为 2026-09-06，源码基线为 `c008d9db91a21136fc61a4f60314e22db395d5d2`。这不是产品安全认证、独立 QA 或开发授权。

[English](/en/research/evidence/2026-09-06-execution-artifact-continuity) · [下载完整证据 ZIP](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/execution-artifact-evidence.zip) · [中文完整说明](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/README.zh.md)

## 两篇文章

- [点了取消，究竟取消了哪一步？](/zh/engineering/2026-09-06-cancellation-execution-boundary)
- [文件确实写成功了，为什么还要检查成果？](/zh/engineering/2026-09-06-workspace-artifact-continuity)

## 主张对应

| 记录 | 本轮结果 | 必须保留的前提 |
| --- | --- | --- |
| A0–A3 | 单次消费、待审批取消和过期有效；期限内获批后第31秒仍可执行 | 30秒是待审批截止，不是已批准令牌的通用执行截止；A1没有已签发令牌 |
| A4–A6 | 等待时取消被拒；自设中止检查可阻止写入；已发生效果仍在 | 不能写成成功撤销后仍执行；等待屏障是研究注入 |
| 三组适配器场景 | 每轮正常批准答复1次；两类取消后答复0次 | 真实本地适配器加内存伪进程，不证明真实宿主资源锁后检查 |
| B0–B3 | 同请求稳定；目标变化拒绝；工作区或任务变化改变操作摘要 | 已有精确对象绑定，不是新缺陷或新开发能力 |
| B4 | 新进程读回摘要一致；改名保留后历史成功与原路径不可用并存 | 同一文件三个时点，没有删除、断电或业务验收 |

共12个服务/工作区场景各两轮、3个适配器场景各两轮，合计30条观测，不是30种场景或准确率。两个既有测试文件分别运行两轮，每轮39通过、0失败、0跳过，原日志分别保留。

## 如何检查

解压完整证据包，进入 evidence 目录执行 `node check.mjs`。它校验30条公开观测、两份基线日志与逐文件哈希，只核对既有记录，不重跑产品。

`probe-boundaries.mjs` 与 `probe-adapter.mjs` 是实际研究探针的可配置副本：硬编码产品根改为 `CODEFLOWMU_SOURCE_ROOT`，适配器补独立创建夹具目录。运行仍需有权访问固定 CodeFlowMu 源码、依赖与 TypeScript loader，详见双语说明。本包不包含产品源码、真实令牌或运行账本；没有源码的读者可以核验公开记录，但不能声称完成产品实验复跑。

## 完整性与脱敏

全部场景、轮次、结果、错误码和效果计数保留；移除本机路径与子进程PID。原记录哈希及七个产品源码文件前后核查摘要位于 provenance.json。哈希是对应记录的完整性信息，不是独立签名或正确性证明。

适配器正常场景最后的 cancelled 来自测试清理；kill_calls 只是伪进程调用。B1介入内容与B4保留内容在编辑时另做只读复核，不伪造新的原观测字段。原始本地夹具和产品运行配置不公开。

OpenHands #4866 与 Paperclip #12901 的版本和状态是研究当日快照。未独立复跑上游或付费 Daytona 测试。本次没有新增真实宿主、授权撤销、远程同步、断电或 PM/QA 验收实验。

## 单文件入口

- [完整观测 observations.json](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/observations.json)
- [源码与来源 provenance.json](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/provenance.json)
- [第一轮基线日志](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/baseline-1.log) · [第二轮](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/baseline-2.log)
- [校验脚本](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/check.mjs) · [Manifest](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/manifest.json)
- [审批/工作区探针](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/probe-boundaries.mjs) · [适配器探针](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/probe-adapter.mjs)
- [README 中文](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/README.zh.md) · [README English](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/README.en.md)
