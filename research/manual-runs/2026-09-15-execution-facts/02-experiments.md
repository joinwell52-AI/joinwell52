# 可运行证据与边界

## A — SDK：十种输入、两种模式

来源：openai/openai-agents-python #5029。候选 b6c2cefd906da7a0b27aed3affc865a21ac005da；对照方法取自 fbf59a40e9da5adb88d370fefaeaae0478376d4a。

`probe-sdk.py` 加载完整候选 SDK，真实进入 _handle_tool_call。RecordingRealtimeModel 为原测试替身；工具只修改本地 Python 列表。对照仅替换 _function_needs_approval 的原始代码，不是完整基线 SDK。

[输出](runs/sdk.json)：10 输入×2 模式。非法字符串、1、None、{}：对照各 1 调用，候选各 UserError/0 调用。正常 true/false、回调 true/false 和 async false 不变。回调 None 两者均调用，属于刻意非标准返回值，不直接认定漏洞。原审批文件 31 测试：候选 31 pass；对照 30 pass、1 fail。未跑全部 Realtime 测试或真实服务。

## B — CrewAI：调用与提交分开计数

来源：crewAIInc/crewAI #7458。前身 a3287100077e33751fc6843c5a701808a2f31266；候选 2ab38214e768f8715149d9cf8f669579e5a9b72a。

`probe-crew.py` 从 AST 提取 unchanged use/ause/_use/_ause；工具选择、遥测、缓存、格式化等依赖用替身。真实临时 SQLite 工具先 INSERT、commit，再模拟响应丢失异常。

[输出](runs/crew.json)：4 场景×2 路径×2 版本，共 16 条。sync/async 一致：一次尝试 2→1 次调用和提交；三次尝试 6→3；成功及 schema 失败后工具成功两控制场景均 1→1。调用参数也保存：旧后备调用携带未筛选 extra 字段。没有真实供应商或全框架集成。

## C — Orca：两个模块、两类观察

来源：stablyai/orca #20723。前身 742a7ad8424d9c45d717fad7064fa32835e4e3c2；候选 e6f789b54215dfe0ddb9cbb0c21748790d89f1ad。

`probe-orca.mjs` 使用 esbuild 打包完整生产模块与真实导入。输入是内存中的合成提交、历史、待发送条目。[输出](runs/orca.json)：5 个调和输入与 5 个结果处置输入，每个版本 10 条，共 20 条。

空且边界一致、无在途轮次的历史从 rejected/not_delivered→unknown/unmatched；正向 ID 匹配仍接受，边界不一致/在途/模糊匹配仍未知。独立的 recovered rejection 处置从 queued + fresh ID→unconfirmed + no fresh ID；未标记 recovered 的合成 rejection/not_delivered 输入仍请求新身份。该组合不代表已验证真实生产者会生成；PR 中拒绝原因约束与非桌面消费者的评审意见未由本轮验证。

这些模块未由本探针串成完整消息发送链，没有实际重发、持久日志、CLI 或云端执行。不能声称“重复副作用已经归零”或“等待最终一定解除”。

## D — Paperclip：原始分支、脚本化时序

来源：paperclipai/paperclip #13443。前身 0e9b24c8216171c26c8358ba387d77858e02c7a9；候选 1db5d93c9c77f94cacea33efe2855c1879a37dd9。

`probe-paperclip.mjs` 提取原 getInvocationBlock 箭头函数、预算升级分支、前身布尔 helper 与候选暂停预检。数据库查询返回可控制的行；升级函数是记录器。候选预检后注入暂停；读取阻塞后注入恢复。这是合成顺序变化，不是真实竞争。

[输出](runs/paperclip.json)：7 场景×2 版本。已暂停、预检后暂停、阻塞后恢复、整公司因预算暂停：旧分支请求升级，候选跳过。活跃公司/助手真实预算阻塞仍升级；无阻塞均通过此分支。记录器的 persistedStatus 字段只记录候选升级目标，并没有持久数据库写入。

未执行原 PostgreSQL 测试、完整恢复扫描、事务竞争、跨任务批量或恢复后的下一轮执行。上游作者的 28 个任务事件不能写成我们的复现规模。

## 初始失败与可复核性

SDK 源码首次提取遇 Windows 符号链接失败，排除 CLAUDE.md 后完成；Paperclip 原始完整压缩包也有技能符号链接，所需两份生产源码已单独提取。Paperclip 探针首次用了候选分支名称寻找前身代码，报 Missing recovery branch；修正为前身真实 isInvocationBudgetBlocked 分支后才形成上述结果。失败没有算入成功样本。

保存结果由 verify.mjs 检查期待观察，并通过 file-manifest.json 核对字节。--sources 另核对源码文件哈希；这不是重新运行上游集成测试。
