---
title: "A3 公开证据包：技能与会话证据链"
date: '2026-08-28'
updated: '2026-08-30'
column: research-evidence
category: evidence
article_type: evidence-pack
edition: research-center
summary: "保留 59 条历史记录及旧字段传播探针，补充 V2.1.2 SessionStore 绑定与独立 QA 三键、完整性验证结果。"
lifecycle: "Published"
publication_authorized: true
---

# A3｜技能与会话证据链

## 主张

技能配置存在、进入会话、真实调用与工程结果成立是不同事实。V2.0.4 受测普通技能入口使用 `session_id` 做运行期去重，却没有把它写入持久调用证据；该描述是历史缺口，新版实现见后文。

## 历史字段剖面

| 关联字段 | 存在 | 缺失 | 缺失率 |
| --- | ---: | ---: | ---: |
| `task_id` | 49 | 10 | 16.9% |
| `session_id` | 0 | 59 | 100.0% |
| `thread_key` | 42 | 17 | 28.8% |
| `agent_id` | 15 | 44 | 74.6% |
| `integrity` | 59 | 0 | 0% |

样本最晚日期为 2026 年 8 月 12 日，不能代表所有当前技能入口。脱敏混合样本同时保留普通运行时读取记录和受 Runtime authority 核验的规划证据，二者证明范围不同。

## 可重跑附件

以下 Reader/check 验证冻结 JSON 样本的字段统计和关联关系，不运行私有 Runtime。`current_probe` 指当时的旧基线；为保留历史审计，附件及摘要不修改为新版结果。

- [脱敏 fixture](/assets/evidence/2026-08-28-runtime-boundary/A3-skill-session-fixture.json)
- [Reader](/assets/evidence/2026-08-28-runtime-boundary/A3-skill-session-reader.mjs)
- [检查脚本](/assets/evidence/2026-08-28-runtime-boundary/A3-skill-session-check.mjs)
- [附件 SHA-256 清单](/assets/evidence/2026-08-28-runtime-boundary/MANIFEST.txt)

```text
node A3-skill-session-check.mjs
```

预期输出：

```json
{"evidence_id":"RBE-20260828-A3","records":59,"session_id_missing":59,"session_id_missing_percent":100,"current_probe_persisted_task":true,"current_probe_persisted_thread":true,"current_probe_persisted_session":false,"mixed_evidence_levels":2,"status":"PASS"}
```

## 边界

这些材料不代表所有技能证据入口都缺少 session，不证明技能建议错误，也不能根据历史上下文猜测回填缺失会话。调用证据只能证明调用发生，不能单独证明任务完成。

## 2026-08-30：V2.1.2 已交付更新

V2.1.1 `36e5c83b` 上的修改前复跑确认普通调用记录仍丢失 session。实现提交 `3302ca61` 将 SessionStore 存在性、Agent 身份及已有 task/thread 上下文核对结果写入调用证据：`verified / invalid_claim / not_applicable` 分别表示可信绑定、无效声明和有 Runtime 原因的合法无会话操作。

独立 QA C1 在 `64f633ac` 上使用实际 SessionStore 注册记录，得到 journal 1 条、task/thread/session 匹配 3/3、`session_binding=verified`、`binding_reason=runtime_session_store_match`、`evidence_source=sdk_tool_call`，完整性验证通过。

C1 是内部验收编号，与本页 A3 公开包编号不同。这次合法绑定场景不单独证明伪造 session 拒绝、sessionless 或所有调用均有三键；这些分支须分别看开发测试。普通入口的已交付核验也不应被扩大成完整的会话生命周期审查。

## 新增主张的来源与复核权限

| 主张 | 第一方来源 | 可见性 |
| --- | --- | --- |
| 修改前缺口、SessionStore 绑定及失败分支 | `RUNTIME-BOUNDARY-20260830-001`：phase0、targeted 记录及实现 | 私有母版材料，访问受限 |
| C1 三键与完整性验证 | `RUNTIME-BOUNDARY-QA-20260830-001`：independent-qa 记录 | 私有母版材料，访问受限 |
| V2.1.2 正式发布及最终回归 | `V2.1.2-R3`、`V2.1.2-PUBLICATION-20260830-001`；Runtime 1842 pass / 0 fail / 1 skip，Shell 1037 pass / 0 fail | 已登录 GitHub 接口及本地记录核对，2026-08-30 |

[V2.1.2 发布说明（需母版仓库访问权限）](https://github.com/joinwell52-AI/codeflowmu/releases/tag/V2.1.2)。公开页提供脱敏摘要及来源映射，完整源码和原始日志访问受限；不把历史 fixture 包称作新版端到端复现包。

V2.1.2 发布不回填历史 session，也不把 `outcome=ok` 或完整性有效当成 TASK 完成。未发布 Open Edition、未切换在线实例；开发与发布阶段的既有告警、Windows 符号链接 skip 和真实部署未覆盖继续保留。
