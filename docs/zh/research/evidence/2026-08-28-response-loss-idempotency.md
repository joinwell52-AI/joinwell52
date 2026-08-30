---
title: "A1 公开证据包：响应丢失与逐工具幂等"
date: '2026-08-28'
updated: '2026-08-30'
column: research-evidence
category: evidence
article_type: evidence-pack
edition: research-center
summary: "保留 V2.0.4 响应丢失历史对照，并补充 V2.1.2 创建回执实现、独立 QA 和正式发布的来源与边界。"
lifecycle: "Published"
publication_authorized: true
---

# A1｜响应丢失与逐工具幂等

## 主张

在 V2.0.4 “动作已经持久化、成功响应随后丢失”的同一故障窗口中，受测的 `write_report` 复用既有报告，而受测的任务创建路径生成第二张任务。这是历史结果，不是 V2.1.2 当前行为；新版工程结果见后文。

## 可重跑附件

以下 Reader/check 重跑的是冻结 JSON 材料的读取和一致性断言，不调用私有 Runtime，不替代产品故障注入。为保留历史可审计性，附件及摘要不改写成新版结果。

- [脱敏 fixture](/assets/evidence/2026-08-28-runtime-boundary/A1-response-loss-fixture.json)
- [Reader](/assets/evidence/2026-08-28-runtime-boundary/A1-response-loss-reader.mjs)
- [检查脚本](/assets/evidence/2026-08-28-runtime-boundary/A1-response-loss-check.mjs)
- [附件 SHA-256 清单](/assets/evidence/2026-08-28-runtime-boundary/MANIFEST.txt)

下载三份文件到同一目录后运行：

```text
node A1-response-loss-check.mjs
```

预期输出：

```json
{"evidence_id":"RBE-20260828-A1","report_objects_after_retry":1,"task_objects_after_retry":2,"status":"PASS"}
```

## 来源与边界

原始定向实验运行于 CodeFlowMu V2.0.4 固定提交 `2ba1ad9baf27077861b6a20e5815b4175f0a81c6`。公开夹具替换了任务编号、路径和正文，但保留相同提交声明与最终对象数量关系。

它不提供生产发生率，不覆盖未受测工具，也不能单独证明后续创建回执已经实现。

## 2026-08-30：V2.1.2 已交付更新

V2.1.1 固定提交 `36e5c83b` 上的修改前复跑确认任务创建缺口仍在、`write_report` 保护仍成立。实现提交 `3302ca61` 增加持久化回执、`write-task-v1` 语义摘要、`reserved → task_created → committed` 恢复、类型化冲突、legacy 兼容和只读 stale 诊断。

独立 QA 在 `64f633ac` 上得到：

| 场景 | 观察结果 |
| --- | --- |
| A2 响应丢失重试 | TASK 数 1；task_id 不变；第二次 `reused / action_taken=false` |
| A4 八路并发 | `created=1 / reused=7`；唯一 task_id；TASK 数 1 |

此处 A2/A4 是内部验收场景编号，不是本页 A1 公开证据包的编号体系。进程重启、摘要冲突和中间态恢复另有开发定向记录，不能由这两项独立 QA 自动代证。

## 新增主张的来源与复核权限

| 主张 | 第一方来源 | 可见性 |
| --- | --- | --- |
| 修改前复现、回执实现与开发回归 | `RUNTIME-BOUNDARY-20260830-001`：phase0、targeted、full-regression 记录 | 私有母版材料，访问受限 |
| A2/A4 独立结果 | `RUNTIME-BOUNDARY-QA-20260830-001`：independent-qa 记录 | 私有母版材料，访问受限 |
| 发布测试通过 | `V2.1.2-R3` 发布证据；Runtime 1842 pass / 0 fail / 1 skip，Shell 1037 pass / 0 fail | 私有母版材料，访问受限 |
| 标签、附件与正式发布 | `V2.1.2-PUBLICATION-20260830-001` 发布回执；标签源码 `cb8869a3`，main `919c3b48` 追加回执 | 已登录 GitHub 接口已核对，2026-08-30 |

[V2.1.2 发布说明与源码附件（需母版仓库访问权限）](https://github.com/joinwell52-AI/codeflowmu/releases/tag/V2.1.2)。公开读者可核对本页脱敏说明和旧附件，但尚不能通过本页独立重跑私有实现；不把上述受限材料宣称为公开 fixture。

新保证要求重试复用稳定 `client_submission_id` 与相同语义摘要；无 ID 的旧调用保持 legacy 行为。正式发布不等于在线实例已升级，也不包含 Open Edition。授权下载应使用 `source-clean.zip`，自动生成的完整仓库包仍含历史运行文件。

Windows 符号链接权限性 skip、既有依赖审计告警、Python 定向夹具 SDK 环境 warning、真实 LAN/Gateway 与生产项目未覆盖范围仍保留。发布 R1/R2 的失败记录没有被 R3 通过结果覆盖。
