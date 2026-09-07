# “参数是否兑现 / 检查到效果”证据包

状态：用户于 2026-09-07 授权随稿公开；正文与证据中英文对齐。这里的 PASS 只表示记录和文件完整性检查通过，不表示产品合同已验收。

## 证据链

主张见 [claims.json](claims.json) → 外部版本与状态见 [sources.json](sources.json) → 正式逐轮数据见 [observations.json](observations.json) → 本说明定义解释边界 → [check-records.mjs](check-records.mjs) 检查记录 → [manifest.json](manifest.json) 提供文件哈希。

数据生成于 2026-09-07 07:35:09 UTC，固定产品提交 `c008d9db91a21136fc61a4f60314e22db395d5d2`。E0–E5 各两轮；第一篇使用 E0–E3（8 条），第二篇使用 E4/E5（4 条）。预跑数据没有加入，也不把两篇计成两个独立十二条样本。

## 怎样理解数据

| 字段 | 说明 |
| --- | --- |
| id / round | 场景和轮次；每次使用独立合成目录 |
| record_overwrite | 批准记录里实际保留的参数，不是推测的 UI 设置 |
| status / error | 操作记录的状态/错误，不是研究脚本退出码 |
| callback_calls | 进入执行回调的次数；不等于目标已被修改的次数 |
| target_bytes / target_digest | 探针执行后实际读回的合成字节及 SHA-256 |
| source_exists | 该场景执行后的源路径是否存在；E0/E1 根本不创建源文件 |
| approved_source_digest | 批准时源快照摘要；没有源的场景为 null |
| after_evidence | 执行器提供的事后证据；失败场景没有该证据，move 只返回 moved，不伪造与 copy 相同的事后摘要 |
| injection | E5 明确标注研究回调内的主动改源；其他场景为 null |

合成文本含义：old-target 是目标原内容；new-target 是写入内容；source-before 是批准时源内容；source-after 是实验变更后的源内容。这些是实际测试字节，不是把生产文件内容替换成的故事。

脱敏删除随机夹具目录与绝对路径，将执行器证据中的源/目标路径改为 source.txt/target.txt。保留所有正式行、状态、错误、字节、摘要、回调次数和注入说明；不公开审批夹具中的身份/令牌文件。原始数据的 SHA-256 保留用于内部审计，但仅有摘要不意味着读者可以核验未公开原件。

## 记录检查，不执行产品

在本目录运行 `node check-records.mjs`。脚本核对十二条记录、场景唯一性、逐轮一致性、文件字节摘要、E4 零回调和 E5 摘要差异，并验证 manifest 中的文件。预期输出是 `EVIDENCE_RECORD_CHECK_PASS`；这包括如实保留 E1 failed、E4 stale 和 E2/E3 的异常成功行为，绝不是把它们包装成产品 PASS。

## 实际产品复跑

实际研究探针为上级研究目录中的 `probe-effects.mjs`，源码与依赖访问受限；本公开包没有复制产品源码，也不声称单独运行记录检查可以复现产品。

授权工程环境中的复跑协议：固定上述提交；每个场景创建隔离目录；使用真实请求构建器准备输入，通过 OperationApprovalService.prepare/approve/execute 调用真实 executeWorkspaceOperation；E0–E3 禁止覆盖，E4/E5 允许覆盖。E4 在重建当前请求前改变源；E5 在审批校验完成后的研究回调内改变源。分别读回文件和审批记录，两轮各用新目录。不要把系统运行目录、业务文件或在线批准用于这个实验。

研究原件仍在本地供审阅；未来公开探针需另做路径可移植性与源码可访问性检查。本文不是端到端、跨进程竞态、断电恢复或独立 QA 报告，也不包含真实账号和远程服务效果。

## 来源与主张限制

sources.json 保存 13 个 PR 的本轮核验时点、base/head、合并状态。它们只用于来源定位，不表示全部已被独立复跑。两篇正文重点引用 Agents SDK #4893/#4894、Paperclip #12949、GitHub MCP #3232，均未合并，最后一个为 Draft。

source_files 的第四项注册表仅静态核查；前面三个受测文件在实验前后原始哈希保持一致。Git 提交使用 LF，本机使用 CRLF；统一换行后内容一致，不把原始字节不等误报为产品改动。

[English guide](README.en.md)
