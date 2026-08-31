---
title: "CodeFlowMu V2.1.2 公开发布摘要"
date: '2026-08-30'
updated: '2026-08-31'
column: research-evidence
category: evidence
article_type: release-summary
edition: research-center
summary: "CodeFlowMu V2.1.2 是一次 Runtime 边界安全补丁，集中补强任务创建的持久化幂等、Activity 普通消费者的安全投影，以及技能 Session 身份的 Runtime 核验。本文提供对外可访问的版本摘要、验证结果、适用范围和公开证据入口。"
lifecycle: "Published"
publication_authorized: true
---

# CodeFlowMu V2.1.2 公开发布摘要

> 发布日期：2026-08-30  
> 发布类型：Runtime 边界安全补丁  
> 公开说明更新时间：2026-08-31

## CodeFlowMu 是什么

CodeFlowMu 是一个**本地优先的多 Agent 协作与数字员工运行体**。它不只负责调用模型，而是让 PM、DEV、QA、OPS、EVAL 等不同职责的 Agent 在受控工作空间里持续执行任务，并由 Runtime 管理任务对象、Session、工具调用、Activity、恢复和审计证据。

这类系统会经历长时间运行、重复唤醒、进程恢复、Host 中断和并发执行，因此“动作是否已经发生”“一次调用属于哪个真实 Session”“内部事件应该让谁看到哪些字段”都会成为产品级边界，而不仅是日志或接口细节。

## 一句话结论

V2.1.2 集中解决三类 Runtime 边界问题：

1. **任务创建的持久化幂等边界**：响应丢失、并发重试或进程恢复时，同一稳定业务提交可以找回第一次创建结果，而不是再生成第二张 TASK。
2. **Activity 普通消费者的安全投影**：内部事件可以继续保留完整诊断事实，但 Web Panel、Activity API、Analytics 等普通消费者只获得经过递归白名单重建的字段投影。
3. **技能 Session 身份的 Runtime 核验**：调用方提供的 `session_id` 不再直接视为执行证据，必须与 Runtime 的 SessionStore 事实核对后才能形成可信绑定。

## 1. 任务创建：从“失败后再试”变成可恢复创建合同

V2.1.2 为需要强幂等的任务创建增加稳定 `client_submission_id`、规范 `request_digest`、创建前 reservation 和机器可读创建回执。

核心关系是：

`client_submission_id → request_digest → task_id / task_path → creation_result`

同一提交身份、同一请求摘要的重试会复用原结果；同一提交身份但摘要不同会返回 `conflict`，并保证不新增 TASK。创建过程使用：

`reserved → task_created → committed`

来覆盖“TASK 已经落盘、成功响应却没有返回”以及中间状态恢复窗口。

独立 QA 的关键观察包括：

- A2 响应丢失重试：最终 TASK 数为 1，前后 `task_id` 一致，第二次返回 `reused / action_taken=false`；
- A4 八路并发：`created=1 / reused=7`，最终只有一个权威 `task_id` 和一张 TASK。

公开证据：[响应丢失与逐工具幂等](/zh/research/evidence/2026-08-28-response-loss-idempotency)。

## 2. Activity：内部留证不等于普通消费者可以看到全部字段

V2.1.2 将内部 Activity 事实对象与普通消费者对象明确分层。

普通消费者不再通过“复制完整对象再删除少数字段”的黑名单方式得到结果，而是由服务端按消费者职责使用递归白名单重新构造投影。`payload.raw`、未知字段和未知嵌套值默认不进入普通结果；task、thread、session、event、`projected_summary` 等获准关联字段继续保留。

内部原始事件仍可在明确授权的诊断路径使用，因此这次改造不是删除诊断事实，而是建立消费者边界。

独立 QA B1 的关键观察是：

- 只存在于 raw 中的唯一 marker 在普通投影中出现 **0 次**；
- `raw_present=false`；
- event_type、task_id、session_id 和 `projected_summary` 仍然保留。

公开证据：[事件消费者可见性](/zh/research/evidence/2026-08-28-event-consumer-visibility)。

## 3. Session：身份声明必须回到 Runtime authority

V2.1.2 不再把调用方提交的 `session_id` 直接升级成可信执行身份，而是由 Runtime 对照 SessionStore 核对：

- task_id；
- thread_key；
- session_id；
- agent；
- caller；
- Session 是否存在以及状态是否可接受。

核验后形成明确证据语义：

- `verified`：Runtime 权威会话事实支持这次绑定；
- `sessionless/not_applicable`：该调用按设计合法不需要 Session，并有明确原因；
- `invalid_claim`：Session 声明与 Runtime 事实不一致，作为负面审计事实保留，不会被升级成可信证据。

独立 QA C1 使用真实 SessionStore 注册记录验证了 task/thread/session/agent/caller 的一致性，并确认 journal 完整性验证通过。

公开证据：[技能与会话证据链](/zh/research/evidence/2026-08-28-skill-session-evidence)。

## 发布验证

V2.1.2 最终发布验证记录为：

- Runtime：**1842 pass / 0 fail / 1 skip**；
- Shell：**1037 pass / 0 fail / 0 skip**；
- V2.1.1 与 V2.1.2 同协议关键矩阵各连续 10 轮：Runtime **1630/1630**、Shell **550/550**；
- typecheck、Shell build、安装器契约、规则和版本一致性通过。

这些数字是发布测试集合的实际结果，不是所谓“可靠率”“安全率”或“证据可信率”。前序失败记录没有因为最终通过而被覆盖，包括字段误裁、锁文件问题和独立 Open Edition 构建边界。

## 版本与兼容性

- CodeFlowMu：V2.1.2
- Runtime：V2.1.2
- Shell：V2.1.2
- Protocol：V1.1.1（不变）
- Mobile PWA / Service Worker cache：V1.0.75（不变）
- Mobile API：V1.3.4（不变）
- Gateway：V1.0.12（不变）

本次无需数据迁移，既有 TASK、REPORT、Session 与 Activity 文件不需要批量改写。

旧调用方如果不提供 `client_submission_id`，仍保持 legacy 创建路径，但不会获得跨响应丢失、跨进程的强幂等保证。普通 Activity 消费者如果曾依赖未登记的 raw/未知字段，需要迁移到公开投影字段。读取技能调用证据时，也不能再把“存在一个 session_id 字符串”直接等同于 `verified`。

## 本次没有声称解决什么

V2.1.2 没有证明：

- 所有 Agent 工具都可以安全重试；
- 所有 Host、真实 LAN/Gateway、浏览器 profile 或生产项目都已覆盖；
- 整个 Runtime 已经不存在任何信息泄露风险；
- `session_binding=verified` 能证明技能建议正确、代码正确或任务已经完成；
- Open Dev Team Edition 已同步发布。

Windows 符号链接权限导致的 1 项 skip、既有依赖告警、部分环境 warning 和真实部署未覆盖范围继续保留。

## 关于源码与原始发布材料

CodeFlowMu 当前产品母版仓库为私有仓库。V2.1.2 的实现源码、完整独立 QA 日志、R3 发布日志和发布回执属于受限第一方材料，不作为公开文章的访问入口。

本页的目的，是把其中与公开研究文章直接相关的**版本事实、验证结果、边界和限制**整理成一个可公开访问、可长期引用的发布摘要。公开证据页同时提供脱敏 fixture、Reader/check 或来源映射；这些材料不会被包装成能够完整重跑私有 Runtime 的公开源码替代品。

## 相关文章

- [工程化实录（一）：响应丢失之后，重试为什么必须先解决持久化幂等边界](/zh/engineering/2026-08-28-response-loss-idempotency)
- [工程化实录（二）：Session 身份不能靠自报——如何建立可验证的执行证据边界](/zh/digital-employee/2026-08-28-skill-session-evidence)
- [工程化实录（三）：事件已经发生，谁应该看见什么——Activity 安全投影的边界设计](/zh/engineering/2026-08-28-event-consumer-visibility)
