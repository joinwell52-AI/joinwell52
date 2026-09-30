# Kimi失败证据与同框架对比

本次复核读取各轮归档备份中同一路径的原始运行事件，不采用Agent事后自述，也不读取可能错配的benchmark/raw副本。

## Kimi的具体失败链

| 北京时间 | 原始文件行号 | 实际记录 | 证明范围 |
|---|---|---|---|
| 16:09:23 | 8 | 恢复工具返回`refresh_queued`、`tools_ready:false` | 当次工具准备未完成；刷新排队不等于恢复成功 |
| 16:15:10 | 21 | `invalid_request_error: responses: unknown content part type: "encrypted_content"` | 正式会话遭遇请求内容类型兼容性错误 |
| 16:19:18～16:33:12 | 31、37、61、67、73、83 | 六条`sdk.result`失败，包含`responseStreamDisconnected`和`The engine is currently overloaded, please try again later` | 六个会话失败返回包含过载与断流信息；不等于独立测量了服务实际负载 |
| 16:40:38 | 130 | 会话结算为failed，原因`CODEX_APP_SERVER_CANCELLED` | 最后一个正式会话因取消结束，应与前七个错误结束分开 |

统计口径：按不同Session计，七个正式会话因错误结束，最后一个因取消结束；Runtime合计八条failed。另有一个成功的身份聊天会话，不能算正式任务完成。四次恢复工具返回见行8、48、58、90。资源读取与命令执行实际发生，但没有建立下游任务或形成正式REPORT。

## 同一Codex框架内，差别出现在哪里

在各自已保全的原始运行事件中，Codex、豆包、DeepSeek、千问的`sdk.result`均未检出上述`encrypted_content`拒绝或`overloaded`断流签名；Kimi分别出现一次与六次。这是选定备份内特定错误签名的对比，不表示其他轮完全无工具失败，也不表示未来不会出现同类错误。

Codex、豆包和DeepSeek跨过工具调用、派单和报告交付环节并完成团队任务；千问也能派单和取得DEV报告，主要未交付障碍出现在后续派发、报告提交及恢复处置。Kimi则在正式团队链建立前反复遭遇会话失败。因此统一的是宿主框架，实际请求内容、端点响应和失败位置并不相同。

## EVAL记录存在，不等于最终报告已经生成

Kimi归档备份中存在`.codeflowmu/eval-recordings/CUSTOM-20260909-001.json`（17,488字节）。其开始时间为`2026-09-09T08:08:52.456Z`，即北京时间16:08:52；保存状态为`recording`，`generation_attempts: 0`。这证明本轮已有任务记录入口，不能说“没有记录”；这个快照本身也不能证明记录报告或观察报告已生成。

备份中还保存了任务思考流、聊天思考流和Runtime事件。它们支持事后重建Kimi运行经过。本次检查的归档包未找到本轮最终OBSERVATION报告。benchmark/raw目录虽有文件，使用前仍须核对模型与时间窗，不能因为同名CUSTOM编号而认定都是本轮材料。

## 原因判断

已确认的具体原因包括一条请求内容类型拒绝，以及六条带过载信息的响应流中断。恢复流程没有将任务推进到正式团队协作。不能把这一轮主要解释成“PM不会拆任务”。

仍待定位：哪个组件产生或保留了`encrypted_content`，接入端是否完整支持对应Responses内容，以及过载信息的实际来源与触发条件。原始请求和端点服务日志不足，不能把责任唯一归给Codex、Moonshot或本地适配。工具准备异常与内容拒绝同时出现，尚无证据证明它们是同一个根因。

## 可复核来源

Kimi备份批次：`20260909T084116080121Z-kimi-archived`。原始成员：`fcop/logs/runtime/runtime-events-20260909.jsonl`。SHA256：`386ee360ba5a2073d8af2ad0cd04875f15adc8b1637f3fd0bb7503db2a7de208`。表中行号按此文件的JSONL物理行计数，时间由UTC换算为北京时间。

| 方案 | 备份批次 | 原始运行事件SHA256 |
|---|---|---|
| Codex | `20260909T053535881968Z-codex-terra-complete-evidence` | `13a82ea1e65875bac5e44efd8ef89aea52b21ed858ded83622166a09584d8332` |
| Doubao | `20260909T063219106390Z-doubao-pro-archived` | `6abbedf1315e75ab0a91254a902652f767f0139dd9c7ab7f68efbf7c4b8a5d24` |
| DeepSeek | `20260909T080021174962Z-deepseek-archived` | `a27d7f9b120e7faf976b9c14d68a032747c782522ddbd7d19ef125582de60f14` |
| Kimi | `20260909T084116080121Z-kimi-archived` | `386ee360ba5a2073d8af2ad0cd04875f15adc8b1637f3fd0bb7503db2a7de208` |
| Qwen | `20260909T105231715800Z-qwen-force-archived` | `cdfa88767ab1c57971c2b689d00bbfa1059e0c22dbf2fe65579f098ea19eaad8` |
