# 2026-09-13—14 两日线索复核

十四组线索对应十三个 PR 和三个具体提交。固定版本、作者账号、读取时间、文件路径见 [sources/index.json](sources/index.json)。公开快照只保留来源元数据，交流稿和评论工作记录留在本地。

| 雷达线索 | 固定来源 | 读取状态与本轮结论 |
| --- | --- | --- |
| Agy 结果误判 | anywhere-agents 3c94f45；0d2221e 文档 | 原 dispatcher 五组对照。缺失/空白终态仍兼容，不能写成所有非 SUCCESS 均拒绝；152 次审计和真实四单元失败来自作者报告 |
| Agy 额度路由 | anywhere-agents 050ee0b | 七项额度策略单测通过；未知模型组允许尝试，不能写成实时可用量已证明；自定义缓存路径由调用方负责时效 |
| AG2 人工中断 | ag2ai/ag2 #3248 | Draft。持有协程并继续，不从历史重放；进程内 proof、TTL 与 sticky routing 的限制明确，不把“外部化协程”当成已可实施的通用序列化方案 |
| Paperclip 凭证租约 | paperclipai/paperclip #13347 | Merged。事务绑定 advisory lock；真实登录、任务和数据库锁检查是上游验收，本轮未运行 PostgreSQL |
| Paperclip 当前任务 | paperclipai/paperclip #13345 | Draft 65423940。原说明选择器七组双版本检查；完整目标选择和 staging acceptance 不在本轮实测范围 |
| Superset 锁屏推送 | superset-sh/superset #7491 | Open；重开先前已回退的变更。fake APNs、模拟器与真实设备投递不同；不能与正式周更混合为已交付锁屏能力 |
| Orca 客户端归属 | stablyai/orca #20402 | Draft。完整文件清单为 124 个（已补分页）；上游双客户端 E2E 不等于跨所有 OS、SSH 与物理设备验证。routing origin 不自动等于授权主体 |
| Fusion 工具映射 | Runfusion/Fusion #3597 | Open。不同客户端实际命名不同，Grok 为 server__tool 风格；评审中的未注册工具和否定语句问题需按具体 revision 看，不能照搬早期评论为当前缺陷 |
| OpenHands 工作区权限 | OpenHands/OpenHands #17387 | Draft。按 runtime capability 显示 UI，并透传 conversation scope；未发布 TS client 与缺少 editor 仍限制产品验收范围 |
| Codex 新工作树 | openai/codex #45276 | Merged。受管 checkout、空会话、审批 reviewer 继承与失败清理分别有入口；不把创建动作称作跨系统原子事务 |
| AG2 HTTP 合同 | ag2ai/ag2 #3252 | Draft。显式 TransportConfig；security_settings 为 None 仍关闭 DNS rebinding protection，token resource enforcement 默认关闭。可配置不等于默认启用所有保护 |
| Paperclip 入门路径 | paperclipai/paperclip #13372 | Merged。API key 与 subscription 准入分开；受限 HTTPS mock 属测试证据，不是全部真实账号可用的证明 |
| Paperclip 执行锁归属 | paperclipai/paperclip #13374 | Open 3b555e82。新增 assignee 比较及更新 predicate；自动评审指出 stale sweep 绕开 deferred-wake promotion，代码仍单独清锁。本轮未做数据库竞态复现，不称修复已完成 |
| Superset 正式周更 | superset-sh/superset #7507 | Merged a851fc94。正式发布面包括子 Agent、Agent catalog、手机 Pages、Host/Automation 等；PR 特意排除云 workspace 与锁屏卡。建议提升产品雷达优先级，不外推 durable audit identity |
| SDK 清空续接链 | openai/openai-agents-python #5000 | Open bc03568c。五项原测试；旧 clear 对照四失败一通过。mutation generation 原本已存在，新增的是两类指针失效 |

表中十五行是因为十四组原始线索中，Paperclip 首日一组包含凭证租约和当前任务两个问题、两个 PR。anywhere-agents 的岗位说明提交与结果修复合并在一行。本表按工程问题展开，不把不同计数相加为“覆盖率”。

## 证据层次

- 本轮实际执行：原脚本子进程与模拟 CLI；SDK 原测试和真实 SQLite 提交；Paperclip 原说明选择函数与规范化输入替身。
- 本轮源码/评审复核：其余 PR 的固定差异、公开说明与评审记录。未声称跑过这些项目的完整测试或真实设备。
- 上游报告：真实 Agy 批次、云沙箱、iPhone/APNs、Claude/Codex 登录与 E2E 数字；文章明确归因。
- 推导：CodeFlowMu/FCoP 的验收合同建议与竞品优先级；不是已确认本地产品缺陷。

本轮没有重新核查全部 41 位人物的公开社交动态，不沿用雷达中“没有新社交讨论”的结论作为新发现。来源内容中的工具指示均只作为上游资料，没有作为本地执行授权。
