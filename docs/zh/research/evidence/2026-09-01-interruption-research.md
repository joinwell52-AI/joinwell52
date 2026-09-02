---
title: "中断接管研究：证据、来源与复核边界"
date: "2026-09-01"
updated: "2026-09-02"
---

# 中断接管研究：证据、来源与复核边界

[English](/en/research/evidence/2026-09-01-interruption-research)

本页配套两篇文章：[中断后的同 TASK 接管](/zh/engineering/2026-09-01-interrupted-task-takeover)和[决定证据连续性](/zh/engineering/2026-09-01-decision-evidence-continuity)。研究固定在 CodeFlowMu V2.1.2 提交 `919c3b48cba31e376b45e60506fa14e4bbcfcb23`。

**这里公开的是已保存的研究记录，不是本次重新运行产品得到的原始日志。** 留存材料包括研究 fixture、命令、结果汇总和观察表；缺少完整逐行 stdout。本页明确保留这一限制，不以转录或检查器 PASS 代替产品复跑、独立 QA 或冻结后的 IA/DC 验收。

## 1. 下载与复核

[完整证据 ZIP](/assets/evidence/2026-09-01-interruption-research.zip) · [中文说明](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-01-interruption-research/README.zh.md) · [English README](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-01-interruption-research/README.en.md) · [观察记录](/assets/evidence/2026-09-01-interruption-research/observations.json) · [来源](/assets/evidence/2026-09-01-interruption-research/sources.json) · [检查器](/assets/evidence/2026-09-01-interruption-research/check.mjs) · [SHA-256 清单](/assets/evidence/2026-09-01-interruption-research/manifest.json) · [研究 fixture 模板](/assets/evidence/2026-09-01-interruption-research/probe-template.ts.txt)

解压完整 ZIP，在文件目录运行：

```text
node check.mjs
```

预期：保存数据关系与文件摘要检查 PASS，退出码 0。它不调用 Runtime，不证明代码行为已再次发生。

## 2. 主张—证据—限制

| 证据 | 保存的观察 | 支持什么 | 不支持什么 |
| --- | --- | --- | --- |
| RA-4 | checkpoint 保存；直接第二次 Session start 后 SDK send=2 | 裸 Session start 没有消费该 checkpoint | Dispatcher 自动重放真实外部效果 |
| RA-5 | 旧 Session 被收敛为 SESSION_LOST 后，迟到 settle 不覆盖旧记录，终态事件增量 0 | 既有记录终态保护 | 通用外部效果 epoch fencing |
| RA-7 / RA-8 | 合成事件分别声明 confirmed_exists / unknown，零退避下均回 inbox，TASK 身份保留 | 真实方法未区分这两类给定语义 | 线上已发生重复副作用或发生率 |
| DC-1 / DC-2 | receipt marker 未持久化；拒绝仍为 failed / OPERATION_BOUNDARY_DENIED | 普通 Session 缺通用 receipt 连续性；拒绝不伪装成功 | 所有专用授权回执都失效 |
| DC-3 / DC-4 | 含 8192 字节合成尾部的 marker 留在内部事件，三类普通投影均不返回，保留 failure code/status | 普通消费者的原文边界 | 内部归档已具备完整查询、保留期和 integrity 合同 |
| RUN-004 | 7 个测试文件：57 pass / 0 fail / 0 skipped | 技术恢复、事实核查、EVAL、关联诊断既有职责隔离 | 新 interruption case 已实现或端到端验收通过 |

RA/DC 是当时研究探针编号，和冻结后的正式 IA/DC 验收编号不是同一集合。fixture 早期使用 `quarantine`，公开合同后来统一为 `hold_for_review`；历史输入未被改写。

## 3. 外部来源：截至 2026-09-02

| 项目 | 核验来源 | 本研究采用的范围 |
| --- | --- | --- |
| OpenAI Codex | [#41916](https://github.com/openai/codex/pull/41916)，已合入 | 重连不自动重发不确定输入 |
| OpenAI Codex | [#41936](https://github.com/openai/codex/pull/41936)，已合入 | 失败审查留存受限诊断；超大 reviewer context 可省略 |
| AG2 | [#3222](https://github.com/ag2ai/ag2/pull/3222)，2026-09-01 合入 | 历史持久化与跨进程 lease 分离 |
| Orkas | [#53](https://github.com/Orkas-AI/Orkas/pull/53)，已合入 | 重复终态与迟到事件的幂等结算 |
| Paperclip | [#12616](https://github.com/paperclipai/paperclip/pull/12616)，2026-09-01 合入 | 默认关闭的实验性 native runner、身份绑定、receipt 与结果 fencing；合入不等于普遍启用 |

这些来源用于提出问题，不能证明 CodeFlowMu 的能力或缺陷。Paperclip #12616 不是 OAuth connector profile；不据此增加 OAuth 任务。

## 4. 产品复跑和公开检查不是一回事

产品复跑需要获准访问固定源码与依赖。现有唯一产品代码根目录是 `D:\codeflowmu`；本包不要求、也不授权复制仓库或覆盖当前工作。版本不匹配时应停止，不把新版本结果写成旧基线证据。模板 import 根可由获授权操作者映射到已核验源码，使用原有 tsx 环境运行；复跑必须另存完整输出。

本轮没有真实掉电、真实第三方副作用、浏览器端到端或独立 QA。后续合同已经冻结，但实现、正式 IA-1～IA-12 / DC-1～DC-3 与独立 QA 的结果不在本证据包的主张范围内。
